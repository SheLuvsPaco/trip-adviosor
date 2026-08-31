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
const addressById = new Map(placeConfig.map((place) => [place.id, place.geocode]));

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
  const validSourceIds = new Set(sources.map((source) => source.id));
  const replacementGeometryById = new Map(replacements.variants.map((variant) => [variant.id, variant]));
  const images = [];
  const productionPlaces = seedPlaces.map((record) => {
    const unknownSources = record.source_ids.filter((id) => !validSourceIds.has(id));
    if (unknownSources.length) throw new Error(`${record.id} has unknown source IDs: ${unknownSources.join(", ")}`);
    const raw = research.places[record.id];
    const coordinates = manualCoordinates[record.id] || (raw?.selected_coordinate ? [raw.selected_coordinate.longitude, raw.selected_coordinate.latitude] : null);
    if (!coordinates) throw new Error(`Missing coordinates for ${record.id}`);
    const imageIds = (raw?.selected_images || []).slice(0, 5).map((item, index) => {
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
      ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 },
      researcher_person_fit: Object.fromEntries(PEOPLE.map((person) => [person, personFit(record, person)])),
      included_in_magic_score: record.priority !== "replacement",
      replacement: record.replacement ? { ...record.replacement, route_variant: routeVariant } : undefined,
      data_status: imageIds.length >= 3 ? "complete" : "image-gap"
    };
  });
  const placeById = new Map(productionPlaces.map((place) => [place.id, place]));
  const weatherByDay = new Map(weather.days.map((day) => [day.day, day]));
  const geometryByDay = new Map(geometry.days.map((day) => [day.day, day]));
  const comfort = [4.0, 4.1, 4.0, 4.2, 4.1, 4.2, 4.0, 3.9, 4.0, 4.1, 3.8];
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
        traffic_note: "OSRM is a road-network baseline with no live traffic. Check the actual two-car ETA before departure and cut the replaceable attraction rather than exceed 210 active minutes."
      },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      weather: {
        kind: "historical_normal", high_c: normal.normal_high_c, low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfort[plan.day - 1], station_id: normal.station_id, station_name: normal.station_name,
        station_role: normal.station_role, source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Central Pennsylvania and Poconos mornings can feel colder than the regional station; weather is only five percent of Magic scoring."
      }
    };
  });
  const knownCore = productionPlaces.filter((place) => place.included_in_magic_score)
    .reduce((sum, place) => sum + (place.cost.amount_per_person || 0), 0);
  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID, slug: ROUTE_SLUG.replace(/^route-09-/, ""), name: ROUTE_NAME,
      short_name: "Kaleidoscopes & Secret Machines", status: "research-complete-bookings-pending", map_color: "#A855F7",
      timezone: "America/New_York", start_date: "2026-10-04", end_date: "2026-10-14", airport_date: "2026-10-15",
      origin: { name: lodgingNodes["boston-logan-rental"].name, coordinates: lodgingNodes["boston-logan-rental"].coordinates },
      destination: { name: lodgingNodes["boston-logan-hotel"].name, coordinates: lodgingNodes["boston-logan-hotel"].coordinates },
      endpoint_city: "Columbus, OH",
      direction: "Boston through the Berkshires, Catskills, northern and western Pennsylvania to Wheeling, Zanesville and Columbus; return through Youngstown, DuBois, Bellefonte, the Poconos and Danbury",
      countries: ["US"], canada_included: false, total_nights: 11, road_nights: 10, final_boston_nights: 1,
      baseline_total_miles: geometry.route_baseline_total_miles,
      summary: "The small-town outsider-art loop: a silo-sized kaleidoscope, scripture-carved boulders, a secret mansion of self-playing machines, a bronze studio, the Y Bridge and Otherworld lead to Columbus. The return protects Orthodox Sunday, sleeps in Victorian Bellefonte, crosses a modern megalith sanctuary and ends with a legal castle-ruin view and Harvard's Glass Flowers after both cars are returned."
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
      route_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      driving_comfort_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      overall_excitement_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      cost_value_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      weather_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      magic_score: null, magic_score_status: "awaiting_traveler_ratings",
      person_specific_route_scores: Object.fromEntries(PEOPLE.map((person) => [person, null]))
    },
    days,
    place_ids: productionPlaces.map((place) => place.id),
    core_place_ids: productionPlaces.filter((place) => place.included_in_magic_score).map((place) => place.id),
    alternative_place_ids: productionPlaces.filter((place) => !place.included_in_magic_score).map((place) => place.id),
    replacement_place_ids: productionPlaces.filter((place) => place.priority === "replacement").map((place) => place.id),
    replacement_options: replacements.variants.map((variant) => ({
      id: variant.id, day: variant.day, replacement_place_id: variant.replacement_place_id, replaces_place_ids: variant.replaces_place_ids,
      baseline_total_miles: variant.baseline_total_miles, baseline_total_minutes: variant.baseline_total_minutes,
      delta_miles: variant.delta_miles, delta_minutes: variant.delta_minutes, cap_minutes: variant.cap_minutes, cap_status: variant.cap_status
    })),
    budget: {
      known_core_admission_floor_per_person_usd: Math.round(knownCore * 100) / 100,
      core_admissions_range_per_person_usd: [95, 155], food_and_cafes_range_per_person_usd: [550, 800],
      local_parking_tolls_range_per_person_usd: [95, 180], optional_experiences_contingency_per_person_usd: [75, 170],
      controllable_total_range_per_person_usd: [815, 1305], nightlife_excluded_from_target: true,
      note: "Route 9 is unusually value-efficient because Art Omi, Scripture Rocks, Butler, Bellefonte and Tarrywile are free or donation-based. Lodging, cars, fuel, nightlife and shopping remain excluded."
    },
    booking_priorities: [
      { place_id: "bayernhof", urgency: "now", reason: "The route-defining secret-house tour is appointment-only and capped at twelve visitors." },
      { place_id: "st-nicholas-dubois", urgency: "reconfirm", reason: "Confirm whether October 11 is Divine Liturgy or Obednitsa with Communion and ask about visitor/Communion etiquette." },
      { place_id: "otherworld", urgency: "early", reason: "Reserve a Friday timed entry that preserves dinner and the Polaris sleep." },
      { place_id: "naumkeag-pumpkin", urgency: "only-if-promoted", reason: "The 2026 event is date-confirmed, but exact slots and prices release August 26." },
      { place_id: "taber-museum", urgency: "week-before", reason: "Confirm Tuesday operation and the toy-train gallery before the near-cap Hancock departure." },
      { place_id: "harvard-natural-history", urgency: "early", reason: "Choose a midday entry only after both cars are returned at Logan." }
    ],
    validation: {
      date_count: days.length, expected_date_count: 11,
      all_baseline_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= 210),
      live_traffic_gated_days: days.filter((day) => day.drive.cap_status === "live-traffic-gated").map((day) => day.day),
      place_count: productionPlaces.length, image_count: images.length,
      places_with_fewer_than_3_usable_images: productionPlaces.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      replacement_option_count: replacements.variants.length,
      all_replacement_variants_at_or_below_cap: replacements.variants.every((variant) => variant.baseline_total_minutes <= variant.cap_minutes),
      unfilled_place_ratings: productionPlaces.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "Aldrich museum is closed Tuesday; only the separately documented outdoor sculpture garden may replace Tarrywile after a same-day gate check.",
        "St Nicholas officially alternates Divine Liturgy and Obednitsa with Communion; October 11 service type must be confirmed and is never mislabelled.",
        "Bayernhof is not promised without an appointment; Heinz History Center is the automatic measured replacement.",
        "Naumkeag exact October 4 timed inventory and price do not exist until the August 26 release.",
        "Hearthstone Castle is a fenced dangerous ruin; no entry, fence crossing or trespass is part of the route.",
        "Columcille images are private-prototype-only unless its website-use photography permission is obtained.",
        "No OSRM baseline includes live traffic; near-cap and gated days require live-ETA checks and attraction cuts."
      ],
      route_lock_status: "research-complete-bookings-and-live-forecast-pending"
    }
  };
  const geojson = {
    type: "FeatureCollection", name: ROUTE_SLUG, features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({
        type: "Feature", id: leg.id,
        properties: { feature_kind: "drive_leg", route_id: ROUTE_ID, day: day.day, date: day.date, from: leg.from, to: leg.to, distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, map_color: route.route.map_color },
        geometry: leg.geometry
      }))),
      ...replacements.variants.filter((variant) => variant.geometry).map((variant) => ({
        type: "Feature", id: variant.id,
        properties: { feature_kind: "replacement_drive_variant", route_id: ROUTE_ID, day: variant.day, replacement_place_id: variant.replacement_place_id, replaces_place_ids: variant.replaces_place_ids, baseline_total_miles: variant.baseline_total_miles, baseline_total_minutes: variant.baseline_total_minutes, delta_minutes: variant.delta_minutes, cap_status: variant.cap_status, map_color: route.route.map_color },
        geometry: variant.geometry
      })),
      ...productionPlaces.map((place) => ({
        type: "Feature", id: place.id,
        properties: { feature_kind: "place", route_id: ROUTE_ID, place_id: place.id, name: place.name, city: place.city, state: place.state, visit_date: place.visit_date, priority: place.priority, included_in_magic_score: place.included_in_magic_score },
        geometry: { type: "Point", coordinates: place.coordinates }
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
      { decision: "Columbus is the endpoint", reason: "Otherworld and the Zanesville bronze-and-bridge sequence give Route 9 a coherent creative endpoint without duplicating the large-city identities of Routes 6-8." },
      { decision: "Route 9 favors small-town obsessions over famous-city checklists", reason: "Kaleidoscopes, carved rocks, mechanical music, bronze, glass and megaliths are the route's story; Columbus is a reveal, not the whole point." },
      { decision: "Every day has one measured replacement", reason: "All eleven variants are independently routed at 209 minutes or less and remain swaps, never disguised additions." },
      { decision: "Orthodox Sunday is protected but precisely labelled", reason: "The parish alternates Liturgy and Obednitsa with Communion; the route protects worship while refusing to promise a service type until October 11 is confirmed." },
      { decision: "Tarrywile replaces the closed Tuesday Aldrich museum as core", reason: "Tarrywile is legally accessible Tuesday and supplies architecture, nature and preservation history; Aldrich survives only as an outdoor garden option." },
      { decision: "The return ends after both cars are returned", reason: "Harvard or Mass General happens by transit/rideshare, protecting the October 15 airport deadline." }
    ],
    rejected: [
      { option: "Aldrich museum galleries on Tuesday", reason: "The official visitor page says the museum is closed. Only its outdoor garden can be represented." },
      { option: "Canton or a deeper southern Ohio detour", reason: "The geometry would either duplicate Route 7's Ohio identity or push sleep-to-sleep stages beyond 210 minutes." },
      { option: "Punxsutawney Weather Discovery Center on Wednesday", reason: "It is closed that day; the replacement uses only public outdoor folklore sites." },
      { option: "Trespassing at Hearthstone Castle", reason: "The ruin is fenced and explicitly unsafe. The route encodes legal exterior observation only." },
      { option: "A second big nightlife night", reason: "Otherworld supplies social energy without a club night, leaving the endpoint restorative before the long Youngstown return." },
      { option: "Stacking replacements", reason: "A replacement rescues weather, energy, closure or booking failure and stays outside Magic scoring unless explicitly promoted." }
    ],
    traffic_policy: "OSRM baselines contain no traffic. Check live ETAs before every departure; days at or above 200 baseline minutes are live-traffic-gated, and no attraction justifies exceeding 210 active driving minutes.",
    weather_policy: "Daily Celsius values are NOAA 1991-2020 station normals, not forecasts. Weather carries only 5 percent of Magic score and must be replaced by a live forecast about ten days before departure.",
    image_policy: "Three local, visually reviewed real images are stored per place with creator, source and rights metadata. Contextual images are labelled. Permission-required venue/editorial files are private-prototype-only until licensed or replaced."
  };
  await Promise.all([
    writeFile(path.join(ROUTE_DIR, "place-seed.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, places: seedPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "sources.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: verifiedAt, sources }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "places.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, places: productionPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "images.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Three locally cached, visually reviewed real images per place. Commons licensing is preserved; permission-required external images are private-prototype-only.", images }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.json"), `${JSON.stringify(route, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.geojson"), `${JSON.stringify(geojson, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route-decisions.json"), `${JSON.stringify(decisions, null, 2)}\n`)
  ]);
  console.log(`Built ${ROUTE_NAME}: ${productionPlaces.length} places, ${images.length} images, ${days.length} days.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
