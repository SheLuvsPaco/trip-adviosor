#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", "route-01-gilded-coast-capital-loop");

const nodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0236, 42.3670] },
  "newport-lodging": { name: "Newport downtown lodging zone", coordinates: [-71.3128, 41.4901] },
  "new-haven-lodging": { name: "New Haven downtown lodging zone", coordinates: [-72.9279, 41.3078] },
  "brooklyn-lodging": { name: "Downtown Brooklyn lodging zone", coordinates: [-73.9880, 40.6920] },
  "philadelphia-lodging": { name: "Fishtown lodging zone", coordinates: [-75.1356, 39.9647] },
  "washington-lodging": { name: "Dupont Circle lodging zone", coordinates: [-77.0434, 38.9104] },
  "frederick-lodging": { name: "Historic Frederick lodging zone", coordinates: [-77.4100, 39.4143] },
  "gettysburg-lodging": { name: "Gettysburg historic-district lodging zone", coordinates: [-77.2311, 39.8309] },
  "bethlehem-lodging": { name: "Historic Bethlehem lodging zone", coordinates: [-75.3780, 40.6150] },
  "easton-lodging": { name: "Downtown Easton lodging zone", coordinates: [-75.2090, 40.6910] },
  "southbury-lodging": { name: "Southbury I-84 lodging zone", coordinates: [-73.2225, 41.4725] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
  "st-nicholas-wtc": { name: "St. Nicholas Greek Orthodox Church and National Shrine", coordinates: [-74.0132, 40.7118] },
  "roosevelt-island-tram": { name: "Roosevelt Island Tram Manhattan station", coordinates: [-73.9646, 40.7614] },
  "grounds-for-sculpture": { name: "Grounds For Sculpture", coordinates: [-74.7196, 40.2365] },
  "snallygaster": { name: "Snallygaster event footprint", coordinates: [-77.0197, 38.8935] },
  "gettysburg-battlefield": { name: "Gettysburg National Military Park Museum and Visitor Center", coordinates: [-77.2260166, 39.8114747] },
  "indian-echo-caverns": { name: "Indian Echo Caverns", coordinates: [-76.7168808, 40.2528358] },
  "da-vinci-science-center": { name: "Da Vinci Science Center at PNC Plaza", coordinates: [-75.4745130, 40.6020437] },
  "delaware-water-gap": { name: "Point of Gap Overlook", coordinates: [-75.1267, 40.9775] },
  "tarrywile-park": { name: "Tarrywile Park and Mansion", coordinates: [-73.4514308, 41.3802740] },
  "paterson-great-falls": { name: "Paterson Great Falls National Historical Park", coordinates: [-74.1805294, 40.9155412] },
  "carousel-museum": { name: "New England Carousel Museum", coordinates: [-72.9394923, 41.6710664] },
  "old-sturbridge-village": { name: "Old Sturbridge Village", coordinates: [-72.1011232, 42.1038149] }
};

const days = [
  {
    day: 1,
    node_ids: ["boston-logan-rental", "risd-museum", "castle-hill-lighthouse", "newport-lodging"]
  },
  {
    day: 2,
    node_ids: ["newport-lodging", "cliff-walk", "the-breakers", "watch-hill", "mystic-seaport", "beinecke-library", "new-haven-lodging"]
  },
  {
    day: 3,
    node_ids: ["new-haven-lodging", "woodbury-common", "brooklyn-lodging"]
  },
  { day: 4, node_ids: [] },
  {
    day: 5,
    node_ids: ["brooklyn-lodging", "grounds-for-sculpture", "princeton-art-museum", "philadelphia-lodging"]
  },
  { day: 6, node_ids: [] },
  {
    day: 7,
    node_ids: ["philadelphia-lodging", "washington-lodging"]
  },
  {
    day: 8,
    node_ids: ["washington-lodging", "frederick-lodging", "gettysburg-lodging"]
  },
  {
    day: 9,
    node_ids: ["gettysburg-lodging", "gettysburg-battlefield", "bethlehem-lodging", "easton-lodging"]
  },
  {
    day: 10,
    node_ids: ["easton-lodging", "paterson-great-falls", "southbury-lodging"]
  },
  {
    day: 11,
    node_ids: ["southbury-lodging", "carousel-museum", "old-sturbridge-village", "boston-logan-hotel"]
  }
];

const riskByDay = {
  1: "medium",
  2: "low",
  3: "high",
  4: "low",
  5: "high",
  6: "low",
  7: "high",
  8: "medium",
  9: "low",
  10: "medium",
  11: "high"
};

function planningRange(baselineMinutes, risk) {
  const factors = {
    low: [1.0, 1.18],
    medium: [1.05, 1.32],
    high: [1.08, 1.58]
  }[risk];
  return {
    low: Math.ceil((baselineMinutes * factors[0]) / 5) * 5,
    high: Math.ceil((baselineMinutes * factors[1] + (risk === "high" ? 10 : 5)) / 5) * 5
  };
}

async function route(from, to) {
  const coordinateString = `${from.coordinates[0]},${from.coordinates[1]};${to.coordinates[0]},${to.coordinates[1]}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinateString}?overview=simplified&geometries=geojson&steps=false`;
  const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const payload = await response.json();
  if (payload.code !== "Ok" || !payload.routes?.[0]) throw new Error(`No OSRM route for ${from.name} -> ${to.name}`);
  return { url, route: payload.routes[0] };
}

async function main() {
  const research = JSON.parse(await readFile(path.join(ROUTE_DIR, "research-raw.json"), "utf8"));
  for (const [id, record] of Object.entries(research.places)) {
    if (!nodes[id] && record.selected_coordinate) {
      nodes[id] = {
        name: record.selected_coordinate.display_name,
        coordinates: [record.selected_coordinate.longitude, record.selected_coordinate.latitude]
      };
    }
  }

  const output = {
    generated_at: new Date().toISOString(),
    routing_engine: "OSRM public demo server",
    routing_profile: "driving",
    traffic_model: "none",
    warning: "Durations are road-network baselines. Planning ranges are explicit risk buffers, not live traffic predictions.",
    nodes,
    days: []
  };

  for (const day of days) {
    const result = {
      day: day.day,
      risk: riskByDay[day.day],
      legs: [],
      baseline_total_meters: 0,
      baseline_total_seconds: 0
    };
    for (let index = 0; index < day.node_ids.length - 1; index += 1) {
      const fromId = day.node_ids[index];
      const toId = day.node_ids[index + 1];
      const from = nodes[fromId];
      const to = nodes[toId];
      if (!from || !to) throw new Error(`Missing route node ${!from ? fromId : toId}`);
      process.stdout.write(`Day ${day.day}: ${fromId} -> ${toId}... `);
      const routed = await route(from, to);
      const baselineMinutes = Math.ceil(routed.route.duration / 60);
      result.legs.push({
        id: `d${day.day}-${fromId}-to-${toId}`,
        from: fromId,
        to: toId,
        distance_meters: Math.round(routed.route.distance),
        distance_miles: Math.round((routed.route.distance / 1609.344) * 10) / 10,
        baseline_seconds: Math.round(routed.route.duration),
        baseline_minutes: baselineMinutes,
        planning_minutes: planningRange(baselineMinutes, riskByDay[day.day]),
        traffic_risk: riskByDay[day.day],
        geometry: routed.route.geometry,
        routing_source: routed.url
      });
      result.baseline_total_meters += Math.round(routed.route.distance);
      result.baseline_total_seconds += Math.round(routed.route.duration);
      process.stdout.write(`${Math.round(routed.route.distance / 1609.344)} mi / ${baselineMinutes} min\n`);
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }
    result.baseline_total_miles = Math.round((result.baseline_total_meters / 1609.344) * 10) / 10;
    result.baseline_total_minutes = Math.ceil(result.baseline_total_seconds / 60);
    result.planning_total_minutes = planningRange(result.baseline_total_minutes, riskByDay[day.day]);
    output.days.push(result);
  }

  output.route_baseline_total_meters = output.days.reduce((sum, day) => sum + day.baseline_total_meters, 0);
  output.route_baseline_total_miles = Math.round((output.route_baseline_total_meters / 1609.344) * 10) / 10;
  output.route_baseline_total_seconds = output.days.reduce((sum, day) => sum + day.baseline_total_seconds, 0);
  await writeFile(path.join(ROUTE_DIR, "route-geometry.json"), `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Route geometry written to ${path.join(ROUTE_DIR, "route-geometry.json")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
