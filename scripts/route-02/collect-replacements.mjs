#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { lodgingNodes, manualCoordinates, places, replacementVariants, ROUTE_ID, ROUTE_SLUG } from "./config.mjs";

const ROUTE_DIR = path.join(process.cwd(), "dataset", "routes", ROUTE_SLUG);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchRoute(points) {
  const coordinates = points.map((point) => point.coordinates.join(",")).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=simplified&geometries=geojson&steps=false`;
  const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const payload = await response.json();
  if (!payload.routes?.[0]) throw new Error(`No route for ${points.map((point) => point.id).join(" -> ")}`);
  return { value: payload.routes[0], url };
}

async function main() {
  const [research, geometry] = await Promise.all([
    readFile(path.join(ROUTE_DIR, "research-raw.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "route-geometry.json"), "utf8").then(JSON.parse)
  ]);
  const nodes = new Map(Object.entries(lodgingNodes).map(([id, node]) => [id, { id, ...node }]));
  for (const place of places) {
    const raw = research.places[place.id];
    const coordinates = manualCoordinates[place.id] || (raw?.selected_coordinate ? [raw.selected_coordinate.longitude, raw.selected_coordinate.latitude] : null);
    if (coordinates) nodes.set(place.id, { id: place.id, name: place.geocode, coordinates });
  }
  const originalByDay = new Map(geometry.days.map((day) => [day.day, day]));
  const output = [];
  for (const variant of replacementVariants) {
    const original = originalByDay.get(variant.day);
    if (variant.unchanged_drive) {
      output.push({ ...variant, node_sequence: [], baseline_total_miles: original.baseline_total_miles, baseline_total_minutes: original.baseline_total_minutes, delta_miles: 0, delta_minutes: 0, cap_minutes: 210, cap_status: "passes-baseline-cap", routing_note: "Parked-city replacement; bed-to-bed driving is unchanged.", legs: [], geometry: null });
      continue;
    }
    const points = variant.nodes.map((id) => {
      const point = nodes.get(id); if (!point) throw new Error(`Missing ${id} in ${variant.id}`); return point;
    });
    const routed = await fetchRoute(points);
    const miles = Math.round((routed.value.distance / 1609.344) * 10) / 10;
    const minutes = Math.round(routed.value.duration / 60);
    output.push({
      ...variant,
      node_sequence: points.map((point) => point.id),
      baseline_total_miles: miles,
      baseline_total_minutes: minutes,
      delta_miles: Math.round((miles - original.baseline_total_miles) * 10) / 10,
      delta_minutes: minutes - original.baseline_total_minutes,
      cap_minutes: 210,
      cap_status: minutes <= 210 ? "passes-baseline-cap" : "fails-baseline-cap",
      routing_note: "OSRM road-network baseline with no live traffic; use the same live-traffic gate as the scheduled day.",
      legs: routed.value.legs.map((leg, index) => ({ id: `${variant.id}-leg-${index + 1}`, from: points[index].id, to: points[index + 1].id, distance_miles: Math.round((leg.distance / 1609.344) * 10) / 10, baseline_minutes: Math.round(leg.duration / 60) })),
      geometry: routed.value.geometry,
      routing_source: routed.url
    });
    await sleep(700);
  }
  const packageData = { schema_version: "1.0.0", route_id: ROUTE_ID, generated_at: new Date().toISOString(), routing_engine: "OSRM", traffic_included: false, variants: output };
  await writeFile(path.join(ROUTE_DIR, "replacement-geometry.json"), `${JSON.stringify(packageData, null, 2)}\n`);
  for (const variant of output) console.log(`${variant.id}: ${variant.baseline_total_miles} mi / ${variant.baseline_total_minutes} min (${variant.delta_minutes >= 0 ? "+" : ""}${variant.delta_minutes}) ${variant.cap_status}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
