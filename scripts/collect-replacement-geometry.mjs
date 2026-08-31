#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", "route-01-gilded-coast-capital-loop");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const variants = [
  { id: "replacement-d1-newport-car", day: 1, replacement_place_id: "newport-car-museum", replaces_place_ids: ["risd-museum", "benefit-street"], nodes: ["boston-logan-rental", "newport-car-museum", "castle-hill-lighthouse", "newport-lodging"] },
  { id: "replacement-d2-nautilus", day: 2, replacement_place_id: "submarine-force-museum", replaces_place_ids: ["mystic-seaport"], nodes: ["newport-lodging", "cliff-walk", "the-breakers", "watch-hill", "submarine-force-museum", "beinecke-library", "new-haven-lodging"] },
  { id: "replacement-d3-untermyer", day: 3, replacement_place_id: "untermyer-gardens", replaces_place_ids: ["woodbury-common"], nodes: ["new-haven-lodging", "untermyer-gardens", "brooklyn-lodging"] },
  { id: "replacement-d4-eldridge", day: 4, replacement_place_id: "museum-eldridge-street", replaces_place_ids: ["tenement-museum"], unchanged_drive: true },
  { id: "replacement-d5-morven", day: 5, replacement_place_id: "morven-museum", replaces_place_ids: ["princeton-art-museum", "princeton-chapel"], nodes: ["brooklyn-lodging", "grounds-for-sculpture", "morven-museum", "philadelphia-lodging"] },
  { id: "replacement-d6-wagner", day: 6, replacement_place_id: "wagner-free-institute", replaces_place_ids: ["eastern-state"], unchanged_drive: true },
  { id: "replacement-d7-building-museum", day: 7, replacement_place_id: "national-building-museum", replaces_place_ids: ["snallygaster"], unchanged_drive: true },
  { id: "replacement-d8-hillwood", day: 8, replacement_place_id: "hillwood-estate", replaces_place_ids: ["dumbarton-oaks"], unchanged_drive: true },
  { id: "replacement-d9-lost-river", day: 9, replacement_place_id: "lost-river-caverns", replaces_place_ids: ["historic-bethlehem", "steelstacks"], nodes: ["gettysburg-lodging", "gettysburg-battlefield", "lost-river-caverns", "easton-lodging"] },
  { id: "replacement-d10-ramapo", day: 10, replacement_place_id: "ramapo-valley-reservation", replaces_place_ids: ["paterson-great-falls"], nodes: ["easton-lodging", "ramapo-valley-reservation", "southbury-lodging"] },
  { id: "replacement-d11-clock-museum", day: 11, replacement_place_id: "american-clock-watch-museum", replaces_place_ids: ["carousel-museum"], nodes: ["southbury-lodging", "american-clock-watch-museum", "old-sturbridge-village", "boston-logan-hotel"] }
];

async function fetchRoute(points) {
  const coordinates = points.map((point) => point.coordinates.join(",")).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=simplified&geometries=geojson&steps=false`;
  const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/1.0 (personal itinerary research)" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const payload = await response.json();
  const route = payload.routes?.[0];
  if (!route) throw new Error(`No route returned for ${points.map((point) => point.id).join(" -> ")}`);
  return { route, url };
}

async function main() {
  const [placePackage, routeGeometry] = await Promise.all([
    readFile(path.join(ROUTE_DIR, "places.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "route-geometry.json"), "utf8").then(JSON.parse)
  ]);
  const placeById = new Map(placePackage.places.map((place) => [place.id, place]));
  const originalByDay = new Map(routeGeometry.days.map((day) => [day.day, day]));
  const nodeById = new Map([
    ...Object.entries(routeGeometry.nodes).map(([id, node]) => [id, { id, name: node.name, coordinates: node.coordinates }]),
    ...placePackage.places.map((place) => [place.id, { id: place.id, name: place.name, coordinates: place.coordinates }])
  ]);

  const output = [];
  for (const variant of variants) {
    const original = originalByDay.get(variant.day);
    if (variant.unchanged_drive) {
      output.push({
        ...variant,
        node_sequence: [],
        baseline_total_miles: original.baseline_total_miles,
        baseline_total_minutes: original.baseline_total_minutes,
        delta_miles: 0,
        delta_minutes: 0,
        cap_minutes: 210,
        cap_status: original.baseline_total_minutes <= 210 ? "passes-baseline-cap" : "fails-baseline-cap",
        routing_note: "Replacement occurs within the parked-city program or at the same destination; the bed-to-bed driving route is unchanged.",
        legs: [],
        geometry: null
      });
      continue;
    }

    const points = variant.nodes.map((id) => {
      const point = nodeById.get(id);
      if (!point) throw new Error(`Missing coordinate for ${id} in ${variant.id}`);
      return point;
    });
    const { route, url } = await fetchRoute(points);
    const totalMiles = Math.round((route.distance / 1609.344) * 10) / 10;
    const totalMinutes = Math.round(route.duration / 60);
    const legs = route.legs.map((leg, index) => ({
      id: `${variant.id}-leg-${index + 1}`,
      from: points[index].id,
      to: points[index + 1].id,
      distance_miles: Math.round((leg.distance / 1609.344) * 10) / 10,
      baseline_minutes: Math.round(leg.duration / 60)
    }));
    output.push({
      ...variant,
      node_sequence: points.map((point) => point.id),
      baseline_total_miles: totalMiles,
      baseline_total_minutes: totalMinutes,
      delta_miles: Math.round((totalMiles - original.baseline_total_miles) * 10) / 10,
      delta_minutes: totalMinutes - original.baseline_total_minutes,
      cap_minutes: 210,
      cap_status: totalMinutes <= 210 ? "passes-baseline-cap" : "fails-baseline-cap",
      routing_note: "OSRM road-network baseline with no live traffic; use the same live-traffic gate as the scheduled day.",
      legs,
      geometry: route.geometry,
      routing_source: url
    });
    await sleep(800);
  }

  const packageData = {
    schema_version: "1.0.0",
    route_id: "route-01",
    generated_at: new Date().toISOString(),
    routing_engine: "OSRM",
    traffic_included: false,
    variants: output
  };
  await writeFile(path.join(ROUTE_DIR, "replacement-geometry.json"), `${JSON.stringify(packageData, null, 2)}\n`);
  for (const variant of output) {
    console.log(`${variant.id}: ${variant.baseline_total_miles} mi / ${variant.baseline_total_minutes} min (${variant.delta_minutes >= 0 ? "+" : ""}${variant.delta_minutes} min) ${variant.cap_status}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
