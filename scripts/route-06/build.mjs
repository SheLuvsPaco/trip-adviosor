#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  contextualImagePlaces, lodgingNodes, manualCoordinates, PEOPLE, places as placeConfig,
  ROUTE_ID, ROUTE_NAME, ROUTE_SLUG
} from "./config.mjs";
import { dayPlans, seedPlaces, sourceRows, verifiedAt } from "./content.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const sources = sourceRows.map(([id, title, source_type, url, claims]) => ({ id, title, source_type, url, verified_at: verifiedAt, claims }));
const addressById = new Map(placeConfig.map((p) => [p.id, p.geocode]));

function personFit(record, person) {
  if (record.best_for.includes(person)) return 5;
  if (record.secondary_for.includes(person)) return 4;
  return person === "sheluvspaco" ? 3.8 : 3.5;
}

function scheduleItem([start, end, place_id, priority], placeById) {
  const place = placeById.get(place_id);
  if (!place) throw new Error(`Unknown scheduled place ${place_id}`);
  return { start, end, place_id, priority, reservation: place.reservation };
}

async function main() {
  const [research, weather, geometry, replacements] = await Promise.all([
    readFile(path.join(ROUTE_DIR, "research-raw.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "weather-normals.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "route-geometry.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "replacement-geometry.json"), "utf8").then(JSON.parse)
  ]);
  const validSourceIds = new Set(sources.map((s) => s.id));
  const replacementGeometryById = new Map(replacements.variants.map((v) => [v.id, v]));
  const images = [];
  const productionPlaces = seedPlaces.map((record) => {
    const unknownSources = record.source_ids.filter((id) => !validSourceIds.has(id));
    if (unknownSources.length) throw new Error(`${record.id} has unknown source IDs: ${unknownSources.join(", ")}`);
    const raw = research.places[record.id];
    const coordinates = manualCoordinates[record.id] || (raw?.selected_coordinate ? [raw.selected_coordinate.longitude, raw.selected_coordinate.latitude] : null);
    if (!coordinates) throw new Error(`Missing coordinates for ${record.id}`);
    const imageIds = (raw?.selected_images || []).slice(0, 8).map((item, index) => {
      const id = `img-${record.id}-${index + 1}`;
      images.push({
        id, place_id: record.id, title: item.title, description: item.description,
        search_query: item.search_query, local_path: item.local_path,
        source_page: item.source_page, source_file_url: item.original_url,
        creator: item.creator || "Unknown", credit: item.credit || "",
        license: item.license || "Unknown", license_url: item.license_url,
        alt: item.description || `${record.name} photograph`,
        coverage: contextualImagePlaces.has(record.id) ? "place-or-explicitly-labelled-context" : "exact-place-or-experience",
        production_usable: item.production_usable ?? item.license !== "Unknown",
        rights_status: item.rights_status || "commons-license-recorded",
        visual_review: item.review_status === "reviewed" ? "reviewed" : "pending-final-review"
      });
      return id;
    });
    const routeVariant = record.replacement ? replacementGeometryById.get(record.replacement.route_variant_id) : null;
    return {
      ...record, address: addressById.get(record.id) || record.address, country: "US", coordinates,
      coordinate_order: "longitude_latitude", coordinate_source: "manual_verified_access_or_parking_point",
      image_ids: imageIds,
      ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((p) => [p, null])), average: null, rating_count: 0 },
      researcher_person_fit: Object.fromEntries(PEOPLE.map((p) => [p, personFit(record, p)])),
      included_in_magic_score: record.priority !== "replacement",
      replacement: record.replacement ? { ...record.replacement, route_variant: routeVariant } : undefined,
      data_status: imageIds.length >= 3 ? "complete" : "image-gap"
    };
  });
  const placeById = new Map(productionPlaces.map((p) => [p.id, p]));
  const weatherByDay = new Map(weather.days.map((d) => [d.day, d]));
  const geometryByDay = new Map(geometry.days.map((d) => [d.day, d]));
  const comfort = [4.1, 4.2, 4.3, 4.0, 3.9, 4.3, 4.0, 3.8, 3.8, 3.8, 3.6];
  const days = dayPlans.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    if (!routed || !normal) throw new Error(`Missing geometry or weather for day ${plan.day}`);
    const capStatus = routed.baseline_total_minutes >= 200 ? "live-traffic-gated" : routed.baseline_total_minutes >= 185 ? "near-cap" : "comfortable";
    return {
      ...plan,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(new Date(`${plan.date}T12:00:00-04:00`)),
      lodging: {
        preferred_area: plan.lodging[0], fallback_area: plan.lodging[1],
        room_setup: "Two rooms: one 1-bed room and one 2-bed room",
        notes: "Strong suggestion only; manually verify recent safety, cleanliness, exact bed layout and secure parking for two cars."
      },
      drive: {
        legs: routed.legs, baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes, planning_total_minutes: routed.planning_total_minutes,
        traffic_risk: routed.risk, cap_minutes: 210, cap_status: capStatus, fallback: plan.fallback,
        traffic_note: "OSRM is a road-network baseline with no live traffic; check the actual two-car ETA before departure and cut stops rather than exceed 210 active minutes."
      },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      weather: {
        kind: "historical_normal", high_c: normal.normal_high_c, low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfort[plan.day - 1], station_id: normal.station_id, station_name: normal.station_name,
        station_role: normal.station_role, source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Mountain and inland stops can be colder than the regional station."
      }
    };
  });
  const knownCore = productionPlaces
    .filter((p) => p.included_in_magic_score && !p.categories.includes("social_nightlife_live"))
    .reduce((sum, p) => sum + (p.cost.amount_per_person || 0), 0);
  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID, slug: ROUTE_SLUG.replace(/^route-06-/, ""), name: ROUTE_NAME,
      short_name: "Mothman & Steel Cathedrals", status: "researched", map_color: "#2563EB",
      timezone: "America/New_York", start_date: "2026-10-04", end_date: "2026-10-14", airport_date: "2026-10-15",
      origin: { name: lodgingNodes["boston-logan-rental"].name, coordinates: lodgingNodes["boston-logan-rental"].coordinates },
      destination: { name: lodgingNodes["boston-logan-hotel"].name, coordinates: lodgingNodes["boston-logan-hotel"].coordinates },
      endpoint_city: "Point Pleasant and Weston, WV",
      direction: "Boston through western Connecticut and Pennsylvania to Pittsburgh, Wheeling and the Ohio Valley; Appalachian folklore corridor through Point Pleasant and Weston, then Morgantown, Bedford, Hamburg and Danbury return",
      countries: ["US"], canada_included: false, total_nights: 11, road_nights: 10, final_boston_nights: 1,
      baseline_total_miles: geometry.route_baseline_total_miles,
      summary: "An evidence-and-wonder loop that moves from handmade carousels and a woodland megalith park into military and mining history, Pittsburgh's hidden architectural rooms and maximalist collections, then the Mothman/TNT corridor and Weston's difficult institutional history. Orthodox Sunday, small-town craft, an aquarium-filled retail spectacle and a post-car-return Museum of Bad Art finale keep the return distinct and intentionally lighter."
    },
    constraints: {
      travelers: 4, cars: 2, cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 180], daily_drive_hard_cap_minutes: 210,
      max_big_nights_out: 4, planned_big_nights_out: 0,
      max_athletic_adrenaline_spots: 2, planned_athletic_adrenaline_spots: 1,
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only; no Canada crossing or J-1 re-entry dependency.",
      budget_target_per_person_usd: 1500,
      budget_excludes: ["lodging", "rental cars", "fuel", "nightlife", "personal shopping"]
    },
    scoring: {
      scale: { min: 1, max: 5, increment: 0.5 }, equal_traveler_weight: true, traveler_ids: PEOPLE,
      route_component_weights_percent: { attraction_and_stop_ratings: 45, excitement_and_uniqueness: 20, driving_comfort: 15, traveler_fairness: 10, cost_and_value: 5, expected_weather: 5 },
      route_ratings: Object.fromEntries(PEOPLE.map((p) => [p, null])),
      driving_comfort_ratings: Object.fromEntries(PEOPLE.map((p) => [p, null])),
      overall_excitement_ratings: Object.fromEntries(PEOPLE.map((p) => [p, null])),
      cost_value_ratings: Object.fromEntries(PEOPLE.map((p) => [p, null])),
      weather_ratings: Object.fromEntries(PEOPLE.map((p) => [p, null])),
      magic_score: null, magic_score_status: "awaiting_traveler_ratings",
      person_specific_route_scores: Object.fromEntries(PEOPLE.map((p) => [p, null]))
    },
    days,
    place_ids: productionPlaces.map((p) => p.id),
    core_place_ids: productionPlaces.filter((p) => p.included_in_magic_score).map((p) => p.id),
    alternative_place_ids: productionPlaces.filter((p) => !p.included_in_magic_score).map((p) => p.id),
    replacement_place_ids: productionPlaces.filter((p) => p.priority === "replacement").map((p) => p.id),
    replacement_options: replacements.variants.map((v) => ({
      id: v.id, day: v.day, replacement_place_id: v.replacement_place_id, replaces_place_ids: v.replaces_place_ids,
      baseline_total_miles: v.baseline_total_miles, baseline_total_minutes: v.baseline_total_minutes,
      delta_miles: v.delta_miles, delta_minutes: v.delta_minutes, cap_minutes: v.cap_minutes, cap_status: v.cap_status
    })),
    budget: {
      known_core_admission_floor_per_person_usd: Math.round(knownCore * 100) / 100,
      core_admissions_range_per_person_usd: [75, 125], food_and_cafes_range_per_person_usd: [550, 800],
      local_parking_tolls_range_per_person_usd: [75, 160], optional_experiences_contingency_per_person_usd: [100, 220],
      controllable_total_range_per_person_usd: [800, 1305], nightlife_excluded_from_target: true,
      note: "The controllable range remains under $1,500 before lodging, cars, fuel, nightlife and shopping. Most signature stops are free or inexpensive; private appointments and purchases are never silently included."
    },
    booking_priorities: [
      { place_id: "nationality-rooms", urgency: "early", reason: "Reserve the exact Thursday 10:30 product around university classroom access." },
      { place_id: "trans-allegheny", urgency: "early", reason: "Book the daytime history-only tour; do not let Halloween-season haunted inventory replace it." },
      { place_id: "assumption-orthodox", urgency: "reconfirm", reason: "Confirm October 11 Orthros/Liturgy times and visitor/Communion etiquette directly with the parish." },
      { place_id: "mcclintic-tnt", urgency: "week-of-safety-check", reason: "Check DNR notices, hunting conditions, weather and group comfort; switch automatically to the Farm Museum if uncertain." },
      { place_id: "carousel-museum", urgency: "week-of", reason: "Reconfirm Sunday operation and protect a roughly 12:45 Logan departure around the uncertain ferry-to-Boston arrival sequence." }
    ],
    validation: {
      date_count: days.length, expected_date_count: 11,
      all_baseline_drive_days_at_or_below_cap: days.every((d) => d.drive.baseline_total_minutes <= 210),
      live_traffic_gated_days: days.filter((d) => d.drive.cap_status === "live-traffic-gated").map((d) => d.day),
      place_count: productionPlaces.length, image_count: images.length,
      places_with_fewer_than_3_usable_images: productionPlaces.filter((p) => p.image_ids.length < 3).map((p) => p.id),
      replacement_option_count: replacements.variants.length,
      all_replacement_variants_at_or_below_cap: replacements.variants.every((v) => v.baseline_total_minutes <= v.cap_minutes),
      unfilled_place_ratings: productionPlaces.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "PostNatural History is not publicly open Thursday; use only with a confirmed appointment.",
        "Tu-Endie-Wei park is open, but Mansion House facilities are not promised after the first October weekend.",
        "McClintic/TNT is a working WMA during hunting season and is replaced automatically when safety is uncertain.",
        "Danbury Museum's indoor building is closed Tuesday; Museum in the Streets is outdoor-only.",
        "Tarrywile's Hearthstone Castle is closed/fenced; no interior entry is ever part of the route.",
        "No OSRM baseline includes live traffic; days 1, 2, 8, 9, 10 and 11 leave no room for extra detours."
      ],
      route_lock_status: "research-complete-bookings-and-live-forecast-pending"
    }
  };
  const geojson = {
    type: "FeatureCollection", name: ROUTE_SLUG, features: [
      ...days.flatMap((d) => d.drive.legs.map((leg) => ({
        type: "Feature", id: leg.id,
        properties: { feature_kind: "drive_leg", route_id: ROUTE_ID, day: d.day, date: d.date, from: leg.from, to: leg.to, distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, map_color: route.route.map_color },
        geometry: leg.geometry
      }))),
      ...replacements.variants.filter((v) => v.geometry).map((v) => ({
        type: "Feature", id: v.id,
        properties: { feature_kind: "replacement_drive_variant", route_id: ROUTE_ID, day: v.day, replacement_place_id: v.replacement_place_id, replaces_place_ids: v.replaces_place_ids, baseline_total_miles: v.baseline_total_miles, baseline_total_minutes: v.baseline_total_minutes, delta_minutes: v.delta_minutes, cap_status: v.cap_status, map_color: route.route.map_color },
        geometry: v.geometry
      })),
      ...productionPlaces.map((p) => ({
        type: "Feature", id: p.id,
        properties: { feature_kind: "place", route_id: ROUTE_ID, place_id: p.id, name: p.name, city: p.city, state: p.state, visit_date: p.visit_date, priority: p.priority, included_in_magic_score: p.included_in_magic_score },
        geometry: { type: "Point", coordinates: p.coordinates }
      })),
      ...Object.entries(geometry.nodes).map(([id, node]) => ({
        type: "Feature", id: `node-${id}`,
        properties: { feature_kind: "route_node", route_id: ROUTE_ID, node_id: id, name: node.name },
        geometry: { type: "Point", coordinates: node.coordinates }
      }))
    ]
  };
  const decisions = {
    schema_version: "1.0.0", route_id: ROUTE_ID, locked_at: verifiedAt,
    accepted: [
      { decision: "Point Pleasant and Weston form the emotional endpoint", reason: "Together they create a folklore-to-evidence sequence that is distinct from Routes 1-5 and still permits an honest US-only return under the daily cap." },
      { decision: "Wheeling is the Pittsburgh recovery night", reason: "It prevents a second large-city hotel night, adds a quiet Ohio River image and positions the 196-minute Point Pleasant day." },
      { decision: "Assumption Morgantown anchors Sunday", reason: "It is a canonical Orthodox parish on the return line and leaves enough time for one compact Bedford museum before the 209-minute Everett stage." },
      { decision: "Museum of Bad Art happens after car return", reason: "Transit after both cars are at Logan protects the airport night and removes urban parking risk from the measured drive." },
      { decision: "Every day has one route-tested replacement", reason: "Each swap is independently measured at or below 210 baseline minutes; alternatives are never hidden add-ons." }
    ],
    rejected: [
      { option: "West Virginia Penitentiary in Moundsville", reason: "It duplicates the route's institutional-history weight and makes the Wheeling/Point Pleasant sequence more exhausting rather than more magical." },
      { option: "Fallingwater", reason: "It is a more mainstream detour and the Wednesday operating pattern is fragile; Gravity Hill plus Quecreek better serve this route's overlooked-evidence identity." },
      { option: "Palace of Gold", reason: "The detour competes with the Point Pleasant safety window and is not an Orthodox worship substitute." },
      { option: "Hearthstone Castle interior", reason: "The structure is fenced/closed and any entry would be unsafe and unauthorized; only legal Tarrywile park access remains." },
      { option: "Indoor Danbury Museum on October 13", reason: "The museum is closed Tuesday; the outdoor marker route is the honest replacement." },
      { option: "PostNatural History as a guaranteed Thursday stop", reason: "Public hours begin Friday. It remains a replacement only if the venue confirms a private appointment." },
      { option: "Canada or Ontario Niagara extension", reason: "The route remains fully US-only and avoids any J-1 re-entry dependency." },
      { option: "An extra outlet mall on the return", reason: "Days 8-11 already sit near the hard cap; Cabela's satisfies shopping curiosity directly on I-78 without dishonest driving." }
    ],
    traffic_policy: "OSRM baselines contain no traffic. Check live ETAs before every departure; days at or above 200 baseline minutes are live-traffic-gated, and no attraction justifies exceeding 210 active driving minutes.",
    weather_policy: "Daily Celsius values are NOAA 1991-2020 station normals, not forecasts. Weather carries only 5 percent of Magic score and must be replaced by a live forecast about ten days before departure.",
    image_policy: "Three local, visually reviewed images are stored per place with creator, source and rights metadata. Contextual images are labelled. Permission-required external files are private-prototype-only until licensed or replaced."
  };
  await Promise.all([
    writeFile(path.join(ROUTE_DIR, "place-seed.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, places: seedPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "sources.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: verifiedAt, sources }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "places.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, places: productionPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "images.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Three locally cached, visually reviewed images per place. Commons licensing is preserved; permission-required external images are private-prototype-only.", images }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.json"), `${JSON.stringify(route, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.geojson"), `${JSON.stringify(geojson, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route-decisions.json"), `${JSON.stringify(decisions, null, 2)}\n`)
  ]);
  console.log(`Built ${ROUTE_NAME}: ${productionPlaces.length} places, ${images.length} images, ${days.length} days.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
