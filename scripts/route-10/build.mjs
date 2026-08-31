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
  const comfort = [4.1, 4.3, 4.3, 4.5, 4.4, 4.4, 4.2, 4.0, 3.9, 4.0, 3.8];
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
        traffic_note: "OSRM is a road-network baseline with no live traffic. Check the two-car ETA before departure and shorten or cut a supporting stop rather than exceed 210 active minutes."
      },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      weather: {
        kind: "historical_normal", high_c: normal.normal_high_c, low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfort[plan.day - 1], station_id: normal.station_id, station_name: normal.station_name,
        station_role: normal.station_role, source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Mountain-valley and Poconos mornings may run colder than the regional station; weather is only five percent of Magic scoring."
      }
    };
  });
  const knownCore = productionPlaces.filter((place) => place.included_in_magic_score)
    .reduce((sum, place) => sum + (place.cost.amount_per_person || 0), 0);
  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID, slug: ROUTE_SLUG.replace(/^route-10-/, ""), name: ROUTE_NAME,
      short_name: "Temples, Follies & Machines", status: "research-complete-bookings-pending", map_color: "#DB2777",
      timezone: "America/New_York", start_date: "2026-10-04", end_date: "2026-10-14", airport_date: "2026-10-15",
      origin: { name: lodgingNodes["boston-logan-rental"].name, coordinates: lodgingNodes["boston-logan-rental"].coordinates },
      destination: { name: lodgingNodes["boston-logan-hotel"].name, coordinates: lodgingNodes["boston-logan-hotel"].coordinates },
      endpoint_city: "Roanoke, VA",
      direction: "Boston through Connecticut, Robbinsville, Wilmington, Baltimore, Richmond and Danville to Roanoke; return through the Shenandoah Valley, Carlisle, Hershey, the Poconos, Skylands and Danbury",
      countries: ["US"], canada_included: false, total_nights: 11, road_nights: 10, final_boston_nights: 1,
      baseline_total_miles: geometry.route_baseline_total_miles,
      summary: "This full route joins 24 main stops instead of hiding half the story as backups. Motorcycles, temples, gardens, powder mills, giant trains, pinball, Orthodox Sunday, Tripod Rock, steam pumps, and a secret-feeling Boston library all fit inside the measured driving cap."
    },
    constraints: {
      travelers: 4, cars: 2, cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 180], daily_drive_hard_cap_minutes: 210,
      max_big_nights_out: 4, planned_big_nights_out: 1,
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
      core_admissions_range_per_person_usd: [190, 250], food_and_cafes_range_per_person_usd: [550, 800],
      local_parking_tolls_range_per_person_usd: [110, 205], optional_experiences_contingency_per_person_usd: [75, 170],
      controllable_total_range_per_person_usd: [925, 1425], nightlife_excluded_from_target: true,
      note: "All 24 main stops still fit the $1,500 target because many are free, including Akshardham, Sayen, the Marine Corps museum, Government Island, Taubman, the Roanoke Star, Carrier Arboretum and Harrisonburg public art. Lodging, cars, fuel, nightlife and shopping remain excluded."
    },
    booking_priorities: [
      { place_id: "new-england-motorcycle", urgency: "week-before", reason: "Its Sunday window ends at 15:00, so confirm October 4 hours against ferry and Boston pickup reality." },
      { place_id: "baps-akshardham", urgency: "early", reason: "Request the 11:00 small-group tour and review dress, shoes, photography and food rules with all four travelers." },
      { place_id: "agecroft-hall", urgency: "early", reason: "Reserve the first Thursday house tour because the Danville drive is live-traffic-gated." },
      { place_id: "hill-stead", urgency: "early", reason: "Ask whether an earlier house tour is possible; the measured late visit otherwise covers the grounds and exterior." },
      { place_id: "winterthur", urgency: "early", reason: "Reserve a focused Tuesday house entry that leaves enough time for the planned Hagley visit." },
      { place_id: "winston-link", urgency: "week-before", reason: "Call the history museum to confirm how much of the Link collection is installed for the planned visit." },
      { place_id: "holy-myrrhbearers", urgency: "reconfirm", reason: "Confirm October 11 Hours and Divine Liturgy at the current Mount Crawford address and ask about visitor and Communion etiquette." },
      { place_id: "boston-athenaeum", urgency: "early", reason: "Choose full-building day membership or first-floor access only after the Logan car-return plan is fixed." }
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
        "New England Motorcycle Museum closes at 15:00 Sunday; a delayed Nantucket-ferry/Boston pickup means cutting it, not rushing.",
        "Hagley is open Tuesday and closed Wednesday; the itinerary deliberately reaches it October 6.",
        "Akshardham is a living sacred site with dress, shoe, phone, photography and food rules; the route never treats it as a photo prop.",
        "O. Winston Link gallery scope must be confirmed by phone because recent visitor reports conflict with the collection page.",
        "Holy Myrrhbearers service and current Mount Crawford address must be reconfirmed; Communion eligibility is never assumed.",
        "Skylands manor interior is not promised Tuesday; the core visit is exterior architecture and gardens.",
        "Pyramid Mountain is now a main stop but is still cancelled for wet or unsafe footing.",
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
      { decision: "Roanoke is the endpoint", reason: "Its sculptural museum, neon mountain star, Link night photography and working rail heritage produce a coherent reveal while allowing a fully different Shenandoah-Hershey return." },
      { decision: "Route 10 joins faith, architecture and machines", reason: "The stops are not a random best-of list: each asks how belief, industry, transport, memory or wealth becomes physical space." },
      { decision: "All eleven hidden gems are now main stops", reason: "The route order and three overnight zones were re-measured so all 24 places appear in the daily story without duplicate alternative cards." },
      { decision: "Every expanded day stays inside the driving cap", reason: "The combined OSRM baselines run from 128 to 210 minutes. East Milford, Baltimore east and north Richmond keep the tight days legal." },
      { decision: "Orthodox Sunday is protected", reason: "Sleeping near Mount Crawford makes worship the immovable first event; the optional short Harrisonburg layer flexes around it." },
      { decision: "The endpoint day is intentionally spacious", reason: "About 136 baseline minutes leaves time for Taubman, Winston Link, the sunset Star and an unhurried Roanoke dinner." },
      { decision: "The return ends after both cars are returned", reason: "Waterworks and the Athenaeum both happen by transit or rideshare after the car return, protecting the October 15 airport deadline." }
    ],
    rejected: [
      { option: "Asheville as the endpoint", reason: "The northbound sleep-to-sleep chain cannot return by October 14 without breaking the 210-minute cap or reducing the route to drive-only days." },
      { option: "Morris Museum on Tuesday", reason: "Its official schedule is closed Tuesday; Skylands supplies a legal, open and more photogenic core." },
      { option: "Franklin Mineral Museum on Tuesday", reason: "Its posted schedule is closed Tuesday and cannot support the measured return day." },
      { option: "Skylands manor interior on Tuesday", reason: "Interior tours are offered only on select Sundays, so the dataset promises only exterior and garden access." },
      { option: "Driving to Pyramid Mountain after Skylands", reason: "The reverse order adds about 37 baseline minutes. Hiking first keeps the expanded day under the cap." }
    ],
    traffic_policy: "OSRM baselines contain no traffic. Check live ETAs before every departure; days at or above 200 baseline minutes are live-traffic-gated, and no attraction justifies exceeding 210 active driving minutes.",
    weather_policy: "Daily Celsius values are NOAA 1991-2020 station normals, not forecasts. Weather carries only 5 percent of Magic score and must be replaced by a live forecast about ten days before departure.",
    image_policy: "Three to five local, visually reviewed real images are stored per place with creator, source and rights metadata. Contextual images are labelled. Permission-required venue/editorial files are private-prototype-only until licensed or replaced."
  };
  await Promise.all([
    writeFile(path.join(ROUTE_DIR, "place-seed.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, places: seedPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "sources.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: verifiedAt, sources }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "places.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, places: productionPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "images.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Three to five locally cached, visually reviewed real images per place. Commons licensing is preserved; permission-required external images are private-prototype-only.", images }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.json"), `${JSON.stringify(route, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.geojson"), `${JSON.stringify(geojson, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route-decisions.json"), `${JSON.stringify(decisions, null, 2)}\n`)
  ]);
  console.log(`Built ${ROUTE_NAME}: ${productionPlaces.length} places, ${images.length} images, ${days.length} days.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
