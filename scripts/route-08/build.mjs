#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  contextualImagePlaces, lodgingNodes, manualCoordinates, PEOPLE, places as placeConfig,
  ROUTE_ID, ROUTE_NAME, ROUTE_SLUG
} from "./config.mjs";
import { buildEnergyRoute08 } from "../route-08-energy/build.mjs";
import { dayPlans, seedPlaces, sourceRows, verifiedAt } from "./content.mjs";
import { mergeRouteExpansion } from "../lib/merge-route-expansion.mjs";

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
  await buildEnergyRoute08({ root: ROOT, routeDir: ROUTE_DIR });
  return;

  // Legacy Route 08 builder retained below as historical implementation context.
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
      const rawAlt = (item.description || item.title || `${record.name} photograph`).replace(/\s+/g, " ").trim();
      const alt = rawAlt.length <= 140 ? rawAlt : `${record.name} — photo ${index + 1}`;
      images.push({
        id, place_id: record.id, title: item.title, description: item.description,
        search_query: item.search_query, local_path: item.local_path,
        source_page: item.source_page, source_file_url: item.original_url,
        creator: item.creator || "Unknown", credit: item.credit || "",
        license: item.license || "Unknown", license_url: item.license_url,
        alt,
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
  const comfort = [4.2, 4.2, 4.4, 4.4, 4.5, 4.8, 4.5, 4.3, 4.2, 4.0, 3.7];
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
        note: "Climate normal, not a 2026 forecast. Durham is normally the warmest sleep; Boston is coolest, and mountain mornings can feel colder than the regional station value."
      }
    };
  });
  const knownCore = productionPlaces.filter((place) => place.included_in_magic_score)
    .reduce((sum, place) => sum + (place.cost.amount_per_person || 0), 0);
  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID, slug: ROUTE_SLUG.replace(/^route-08-/, ""), name: ROUTE_NAME,
      short_name: "Lemurs & Stone Bridges", status: "research-complete-bookings-pending", map_color: "#16A34A",
      timezone: "America/New_York", start_date: "2026-10-04", end_date: "2026-10-14", airport_date: "2026-10-15",
      origin: { name: lodgingNodes["boston-logan-rental"].name, coordinates: lodgingNodes["boston-logan-rental"].coordinates },
      destination: { name: lodgingNodes["boston-logan-hotel"].name, coordinates: lodgingNodes["boston-logan-hotel"].coordinates },
      endpoint_city: "Durham, NC",
      direction: "Boston through Connecticut, the Hudson Valley, Bethlehem, Lancaster, Winchester and Roanoke to Durham; return through Petersburg, Richmond, Annapolis, Wilmington, Fort Tryon and Bridgeport",
      countries: ["US"], canada_included: false, total_nights: 11, road_nights: 10, final_boston_nights: 1,
      baseline_total_miles: geometry.route_baseline_total_miles,
      summary: "A warmer trip south, built around a private visit with aye-ayes and other lemurs at Duke. Along the way, the group explores huge factory art, working studios, Shenandoah gardens, Natural Bridge, Civil War history, a strange indoor mini-golf hotel, an Orthodox Sunday service, old water-powered factories, medieval rooms, and a final art palace in Boston."
    },
    constraints: {
      travelers: 4, cars: 2, cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 180], daily_drive_hard_cap_minutes: 210,
      max_big_nights_out: 4, planned_big_nights_out: 0,
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
      core_admissions_range_per_person_usd: [275, 340], food_and_cafes_range_per_person_usd: [550, 800],
      local_parking_tolls_range_per_person_usd: [100, 190], optional_experiences_contingency_per_person_usd: [75, 160],
      controllable_total_range_per_person_usd: [1000, 1490], nightlife_excluded_from_target: true,
      note: "The private lemur tour contributes roughly $100 per person but the controllable range can remain near the $1,500 target before lodging, cars, fuel, nightlife and shopping."
    },
    booking_priorities: [
      { place_id: "duke-lemur-bts", urgency: "now", reason: "The route-defining private tour has limited 13:30 inventory, no walk-ins and exactly fits the four-person group." },
      { place_id: "richmond-orthodox", urgency: "reconfirm", reason: "Confirm October 11 Orthros, Divine Liturgy and visitor/Communion etiquette in the cathedral bulletin." },
      { place_id: "hagley", urgency: "holiday-confirm", reason: "October 12 is a holiday. Keep Hagley core only after direct confirmation; Brandywine is already measured." },
      { place_id: "hotel-greene", urgency: "week-of", reason: "Saturday evening can produce long waits and the venue is 21-plus after 17:00; confirm exact hours and arrival strategy." },
      { place_id: "gardner-museum", urgency: "early", reason: "Reserve an 11:30 Wednesday entry that leaves time to return both rental cars first." },
      { place_id: "dia-beacon", urgency: "early", reason: "Reserve Monday opening inventory to protect the 205-minute cap day." }
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
        "Duke Lemur Center is not promised without a confirmed four-person Behind the Scenes reservation; Virginia Museum of Transportation is the automatic measured swap.",
        "Hagley's October 12 holiday operation must be confirmed; Brandywine replaces it rather than stacking.",
        "Perkins Memorial Drive is weather- and operations-gated; Bear Mountain never replaces Dia unless the summit road is open.",
        "Hotel Greene's Saturday wait and 21-plus evening policy require a same-week check; it occurs only after both cars are parked.",
        "The Richmond parish bulletin controls October 11 service times; Orthros and Divine Liturgy are protected from tourism cuts.",
        "Gardner happens only after both cars are returned at Logan; no Boston driving or parking is encoded.",
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
      { decision: "Durham is the endpoint", reason: "The private Duke Lemur Center experience is rare enough to justify the distance and reaches the warmest climate normal of the route without forcing a Canada crossing or an over-cap sleep stage." },
      { decision: "The route stages through Danbury, Bethlehem, Lancaster, Winchester and Roanoke", reason: "Exact OSRM measurements keep every core day at or below 207 minutes while turning transit days into art, gardens, architecture and industrial stories." },
      { decision: "One outlet window is intentionally scheduled", reason: "Tanger Lancaster gives Viki a real fashion-outlet block without scattering shopping across the route or charging it to the shared budget." },
      { decision: "Richmond protects a full Orthodox Sunday", reason: "Orthros and Divine Liturgy remain the fixed anchor; Poe or VMFA is cut first if the service or traffic runs long." },
      { decision: "Hotel Greene is a light social night, not a big night out", reason: "Its theatrical mini-golf world satisfies the unusual-experience brief without creating club fatigue before Sunday church." },
      { decision: "Every day has one route-tested replacement", reason: "Each swap is measured independently at or below 209 minutes and is a replacement, never a hidden add-on." },
      { decision: "Boston's final museum happens after car return", reason: "Returning both cars before Gardner protects the October 15 airport requirement and avoids parking two vehicles in central Boston." }
    ],
    rejected: [
      { option: "Raleigh, Wilson Whirligig Park and an exact Dax concert", reason: "Preliminary routing pushed consecutive endpoint days beyond the 210-minute bed-to-bed rule. An event is not magical if its schedule requires hiding road time." },
      { option: "Korner's Folly, Williamsburg or Jamestown detours", reason: "Each pulled the route sideways and either broke the drive cap or displaced the stronger lemur, Natural Bridge and Orthodox anchors." },
      { option: "Another Icon Museum or repeated Northeast anchor", reason: "Earlier routes already own those stories; Route 8 needed a distinct southbound identity." },
      { option: "Canada or Canadian Niagara", reason: "The route remains US-only with no J-1 re-entry dependency." },
      { option: "A second athletic or adrenaline stop", reason: "The route deliberately spends its energy budget on discovery, conservation, architecture and history. Hotel Greene is playful, not a heavy athletic demand." },
      { option: "Stacking hidden-gem replacements", reason: "Replacements rescue weather, energy or closures and remain excluded from Magic scoring until explicitly promoted." }
    ],
    traffic_policy: "OSRM baselines contain no traffic. Check live ETAs before every departure; days at or above 200 baseline minutes are live-traffic-gated, and no attraction justifies exceeding 210 active driving minutes.",
    weather_policy: "Daily Celsius values are NOAA 1991-2020 station normals, not forecasts. Weather carries only 5 percent of Magic score and must be replaced by a live forecast about ten days before departure.",
    image_policy: "Three to five local, visually reviewed images are stored per place with creator, source and rights metadata. Contextual images are labelled. Permission-required venue/editorial files are private-prototype-only until licensed or replaced."
  };
  await Promise.all([
    writeFile(path.join(ROUTE_DIR, "place-seed.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, places: seedPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "sources.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: verifiedAt, sources }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "places.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, places: productionPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "images.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Three to five locally cached, visually reviewed images per place. Commons licensing is preserved; permission-required external images are private-prototype-only.", images }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.json"), `${JSON.stringify(route, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.geojson"), `${JSON.stringify(geojson, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route-decisions.json"), `${JSON.stringify(decisions, null, 2)}\n`)
  ]);
  const result = await mergeRouteExpansion({ root: ROOT, routeDir: ROUTE_DIR, routeId: ROUTE_ID, routeSlug: ROUTE_SLUG });
  console.log(`Built ${ROUTE_NAME}: ${result.placeCount} places, ${result.imageCount} images, ${result.dayCount} days.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
