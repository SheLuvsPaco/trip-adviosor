#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { dayRoutes, lodgingNodes, manualCoordinates, places, ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function planningRange(minutes, risk) {
  const factors = { low: [1.0, 1.18], medium: [1.05, 1.32], high: [1.08, 1.55] }[risk];
  return {
    low: Math.ceil((minutes * factors[0]) / 5) * 5,
    high: Math.ceil((minutes * factors[1] + (risk === "high" ? 10 : 5)) / 5) * 5
  };
}

async function route(from, to) {
  const coordinates = `${from.coordinates.join(",")};${to.coordinates.join(",")}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=simplified&geometries=geojson&steps=false`;
  const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const payload = await response.json();
  if (!payload.routes?.[0]) throw new Error(`No route for ${from.name} -> ${to.name}`);
  return { url, value: payload.routes[0] };
}

async function main() {
  const research = JSON.parse(await readFile(path.join(ROUTE_DIR, "research-raw.json"), "utf8"));
  const nodes = { ...lodgingNodes };
  for (const place of places) {
    const raw = research.places[place.id];
    const coordinates = manualCoordinates[place.id] || (raw?.selected_coordinate
      ? [raw.selected_coordinate.longitude, raw.selected_coordinate.latitude]
      : null);
    if (coordinates) nodes[place.id] = { name: place.geocode, coordinates };
  }

  const output = {
    generated_at: new Date().toISOString(),
    routing_engine: "OSRM public demo server",
    routing_profile: "driving",
    traffic_model: "none",
    warning: "Durations are road-network baselines. Planning ranges are risk buffers, not live traffic predictions.",
    nodes,
    days: []
  };

  for (const day of dayRoutes) {
    const result = { day: day.day, risk: day.risk, legs: [], baseline_total_meters: 0, baseline_total_seconds: 0 };
    for (let index = 0; index < day.node_ids.length - 1; index += 1) {
      const fromId = day.node_ids[index];
      const toId = day.node_ids[index + 1];
      const from = nodes[fromId];
      const to = nodes[toId];
      if (!from || !to) throw new Error(`Missing route node ${!from ? fromId : toId}`);
      process.stdout.write(`Day ${day.day}: ${fromId} -> ${toId}... `);
      const routed = await route(from, to);
      const minutes = Math.ceil(routed.value.duration / 60);
      result.legs.push({
        id: `d${day.day}-${fromId}-to-${toId}`,
        from: fromId,
        to: toId,
        distance_meters: Math.round(routed.value.distance),
        distance_miles: Math.round((routed.value.distance / 1609.344) * 10) / 10,
        baseline_seconds: Math.round(routed.value.duration),
        baseline_minutes: minutes,
        planning_minutes: planningRange(minutes, day.risk),
        traffic_risk: day.risk,
        geometry: routed.value.geometry,
        routing_source: routed.url
      });
      result.baseline_total_meters += Math.round(routed.value.distance);
      result.baseline_total_seconds += Math.round(routed.value.duration);
      console.log(`${Math.round(routed.value.distance / 1609.344)} mi / ${minutes} min`);
      await sleep(800);
    }
    result.baseline_total_miles = Math.round((result.baseline_total_meters / 1609.344) * 10) / 10;
    result.baseline_total_minutes = Math.ceil(result.baseline_total_seconds / 60);
    result.planning_total_minutes = planningRange(result.baseline_total_minutes, day.risk);
    output.days.push(result);
  }
  output.route_baseline_total_meters = output.days.reduce((sum, day) => sum + day.baseline_total_meters, 0);
  output.route_baseline_total_miles = Math.round((output.route_baseline_total_meters / 1609.344) * 10) / 10;
  output.route_baseline_total_seconds = output.days.reduce((sum, day) => sum + day.baseline_total_seconds, 0);
  await writeFile(path.join(ROUTE_DIR, "route-geometry.json"), `${JSON.stringify(output, null, 2)}\n`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
