#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { lodgingNodes, manualCoordinates, manualLegs, places, replacementVariants, ROUTE_ID, ROUTE_SLUG } from "./config.mjs";

const ROUTE_DIR = path.join(process.cwd(), "dataset", "routes", ROUTE_SLUG);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchRoute(from, to) {
  const coordinates = `${from.coordinates.join(",")};${to.coordinates.join(",")}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=simplified&geometries=geojson&steps=false`;
  const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const payload = await response.json();
  if (!payload.routes?.[0]) throw new Error(`No route for ${from.id} -> ${to.id}`);
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
    const legs = [];
    const geometryLines = [];
    let roadDistanceMeters = 0;
    let roadDurationSeconds = 0;
    let ferryMinutes = 0;
    const routingSources = [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const from = points[index];
      const to = points[index + 1];
      const manual = manualLegs[`${from.id}:${to.id}`];
      if (manual) {
        legs.push({ id: `${variant.id}-leg-${index + 1}`, from: from.id, to: to.id, mode: manual.mode, distance_miles: manual.distance_miles, baseline_minutes: 0, display_duration_minutes: manual.display_minutes, counts_toward_drive_cap: false });
        geometryLines.push([from.coordinates, to.coordinates]);
        ferryMinutes += manual.display_minutes;
        continue;
      }
      const routed = await fetchRoute(from, to);
      roadDistanceMeters += routed.value.distance;
      roadDurationSeconds += routed.value.duration;
      routingSources.push(routed.url);
      legs.push({ id: `${variant.id}-leg-${index + 1}`, from: from.id, to: to.id, mode: "driving", distance_miles: Math.round((routed.value.distance / 1609.344) * 10) / 10, baseline_minutes: Math.round(routed.value.duration / 60), display_duration_minutes: Math.round(routed.value.duration / 60), counts_toward_drive_cap: true });
      geometryLines.push(routed.value.geometry.coordinates);
      await sleep(450);
    }
    const miles = Math.round((roadDistanceMeters / 1609.344) * 10) / 10;
    const minutes = Math.round(roadDurationSeconds / 60);
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
      non_driving_travel_minutes: ferryMinutes,
      total_travel_minutes_excluding_queues: minutes + ferryMinutes,
      legs,
      geometry: { type: "MultiLineString", coordinates: geometryLines },
      routing_source: routingSources
    });
    await sleep(250);
  }
  const packageData = { schema_version: "1.0.0", route_id: ROUTE_ID, generated_at: new Date().toISOString(), routing_engine: "OSRM", traffic_included: false, variants: output };
  await writeFile(path.join(ROUTE_DIR, "replacement-geometry.json"), `${JSON.stringify(packageData, null, 2)}\n`);
  for (const variant of output) console.log(`${variant.id}: ${variant.baseline_total_miles} mi / ${variant.baseline_total_minutes} min (${variant.delta_minutes >= 0 ? "+" : ""}${variant.delta_minutes}) ${variant.cap_status}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
