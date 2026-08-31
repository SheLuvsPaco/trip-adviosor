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
    const imageIds = (raw?.selected_images || []).slice(0, 3).map((item, index) => {
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
      coordinate_order: "longitude_latitude", coordinate_source: "manual_verified_access_or_specific-object-point",
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
  const comfort = [4.2, 4.5, 4.0, 4.3, 3.7, 4.4, 3.9, 3.8, 3.6, 3.6, 3.5];
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
        traffic_note: "OSRM is a road-network baseline with no live traffic; check the actual two-car ETA before departure and cut the replaceable attraction rather than exceed 210 active minutes."
      },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      weather: {
        kind: "historical_normal", high_c: normal.normal_high_c, low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfort[plan.day - 1], station_id: normal.station_id, station_name: normal.station_name,
        station_role: normal.station_role, source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Lake Erie wind and inland-night temperatures can feel colder than the station values."
      }
    };
  });
  const knownCore = productionPlaces
    .filter((p) => p.included_in_magic_score && !p.categories.includes("social_nightlife_live"))
    .reduce((sum, p) => sum + (p.cost.amount_per_person || 0), 0);
  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID, slug: ROUTE_SLUG.replace(/^route-07-/, ""), name: ROUTE_NAME,
      short_name: "Kazoos, Rock & Machines", status: "research-complete-bookings-pending", map_color: "#F97316",
      timezone: "America/New_York", start_date: "2026-10-04", end_date: "2026-10-14", airport_date: "2026-10-15",
      origin: { name: lodgingNodes["boston-logan-rental"].name, coordinates: lodgingNodes["boston-logan-rental"].coordinates },
      destination: { name: lodgingNodes["boston-logan-hotel"].name, coordinates: lodgingNodes["boston-logan-hotel"].coordinates },
      endpoint_city: "Cleveland, OH",
      direction: "Boston through Springfield, the Capital Region, Syracuse, Rochester, Eden and Erie to Cleveland; return through Canonsburg, Bedford, Allentown and Danbury",
      countries: ["US"], canada_included: false, total_nights: 11, road_nights: 10, final_boston_nights: 1,
      baseline_total_miles: geometry.route_baseline_total_miles,
      summary: "A sound-and-machinery loop that begins with museum choice, finds Uncle Sam's real grave, traces boxing and suffrage through small cities, then reaches a working kazoo factory, Lake Erie ecology and Cleveland's rock history. The exact Sugar show makes the endpoint count; Orthodox Sunday, giant trucks, roadside architecture and a 38-foot Uncle Sam turn the homeward line into a separate story."
    },
    constraints: {
      travelers: 4, cars: 2, cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 180], daily_drive_hard_cap_minutes: 210,
      max_big_nights_out: 4, planned_big_nights_out: 1,
      max_athletic_adrenaline_spots: 2, planned_athletic_adrenaline_spots: 0,
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
      core_admissions_range_per_person_usd: [140, 220], food_and_cafes_range_per_person_usd: [550, 800],
      local_parking_tolls_range_per_person_usd: [95, 190], optional_experiences_contingency_per_person_usd: [100, 220],
      controllable_total_range_per_person_usd: [885, 1430], nightlife_excluded_from_target: true,
      note: "The controllable range remains under $1,500 before lodging, cars, fuel, nightlife and shopping. Sugar tickets are nightlife and intentionally excluded."
    },
    booking_priorities: [
      { place_id: "sugar-agora", urgency: "now", reason: "Exact Friday October 9 event; buy four tickets before building the Cleveland day around it." },
      { place_id: "mack-museum", urgency: "calendar-gated", reason: "October 12 is a holiday. Promote the stop only when the official reservation calendar exposes four confirmed slots." },
      { place_id: "anthony-house", urgency: "early", reason: "Choose a docent-led Wednesday slot that preserves Mount Hope and the Batavia stage." },
      { place_id: "buckland-museum", urgency: "reconfirm", reason: "Official hours are not published as a stable table; use only real October 9 timed inventory, otherwise Crawford is automatic." },
      { place_id: "all-saints-canonsburg", urgency: "reconfirm", reason: "Confirm October 11 Orthros/Liturgy times and visitor/Communion etiquette in the parish bulletin." },
      { place_id: "eden-kazoo", urgency: "day-before-call", reason: "Confirm Thursday machinery activity; the museum can open while the production floor is quiet." }
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
        "Mack's October 12 tour is not assumed: it is a federal holiday and the reservation calendar is authoritative; Fish Hatchery is the automatic swap.",
        "Buckland has no stable official weekly-hours table; Crawford replaces it unless a real October 9 timed ticket exists.",
        "The Danbury Railway Museum is closed Tuesday; only the public exterior Uncle Sam statue is scheduled.",
        "Erie Maritime Museum replacement hours must be confirmed directly before promotion.",
        "MIT Museum happens only after both cars are returned at Logan; no Cambridge driving or parking is encoded.",
        "No OSRM baseline includes live traffic; near-cap days require live-ETA gating and stop cuts."
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
      { decision: "Cleveland is the endpoint; Columbus is not", reason: "Exact OSRM baselines showed Columbus would force dishonest bed-to-bed driving. Cleveland still earns the route with the October 9 Sugar show and a complete cultural day." },
      { decision: "The route uses multiple small staging nights westbound", reason: "Troy, Syracuse, Batavia and Erie keep each active driving day at or below 210 minutes while turning transit into real places rather than fuel-only breaks." },
      { decision: "Uncle Sam is a deliberate narrative bookend", reason: "Samuel Wilson's grave in Troy and the 38-foot Great Danbury Fair statue make two overlooked stops reinforce each other across the loop." },
      { decision: "Mack is calendar-gated, not promised", reason: "October 12 is a holiday. The outdoor Fish Hatchery replacement is already route-tested and becomes automatic without four confirmed reservations." },
      { decision: "One fixed big night only", reason: "Sugar at the Agora directly fits Stivka and gives the farthest city emotional purpose; all other nights remain lighter or quiet." },
      { decision: "Every day has one route-tested replacement", reason: "Each swap is independently measured at or below the same 210-minute baseline cap and is a replacement, never a hidden add-on." }
    ],
    rejected: [
      { option: "Columbus endpoint", reason: "It breaks the daily-drive contract once conservative routing and return staging are measured." },
      { option: "Niagara Falls or Canada", reason: "Routes 2-3 already own western New York and this route remains US-only with no J-1 re-entry dependency." },
      { option: "JELL-O Gallery in Le Roy", reason: "It is closed Tuesday and would be a schedule fiction on the only useful day." },
      { option: "Strong Museum of Play", reason: "Excellent but large, mainstream and exhausting beside the more distinctive Anthony/Mount Hope sequence." },
      { option: "An abandoned Rochester subway visit", reason: "Forum interest does not override legal-access, lighting and safety uncertainty." },
      { option: "A second Cleveland nightlife event", reason: "The Friday concert is the one earned big night; Saturday is intentionally lighter before the southbound stage." },
      { option: "Indoor Danbury Railway Museum on Tuesday", reason: "It is closed; the dataset explicitly schedules only the exterior 38-foot statue." },
      { option: "Stacking hidden-gem replacements", reason: "Replacements exist to rescue weather, energy or closures and are excluded from Magic scoring until promoted." }
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
