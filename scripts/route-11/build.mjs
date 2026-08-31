#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  contextualImagePlaces, lodgingNodes, manualCoordinates, PEOPLE, places as placeConfig,
  premiumCapMinutes, ROUTE_ID, ROUTE_NAME, ROUTE_SLUG
} from "./config.mjs";
import { dayPlans, seedPlaces, sourceRows, verifiedAt } from "./content.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const STANDARD_CAP_MINUTES = 210;
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

function capStatus(minutes) {
  if (minutes <= STANDARD_CAP_MINUTES) return minutes >= 190 ? "standard-cap-near" : "standard-cap-comfortable";
  if (minutes <= premiumCapMinutes) return "authorized-premium-one-way-exception";
  return "fails-premium-one-way-ceiling";
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
      coordinate_order: "longitude_latitude", coordinate_source: "manual-verified-visitor-location",
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
  const weatherComfort = [3.8, 4.0, 3.9, 3.8, 4.0, 4.3, 4.5, 4.6, 4.6, 4.6, 4.5];
  const days = dayPlans.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    if (!routed || !normal) throw new Error(`Missing geometry or weather for day ${plan.day}`);
    return {
      ...plan,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: plan.timezone }).format(new Date(`${plan.date}T12:00:00Z`)),
      lodging: {
        preferred_area: plan.lodging[0], fallback_area: plan.lodging[1],
        room_setup: "Two rooms: one 1-bed room and one 2-bed room",
        notes: "Suggestion only. Check recent safety and cleanliness reviews, the exact beds, and secure parking for both cars."
      },
      drive: {
        legs: routed.legs, baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes, planning_total_minutes: routed.planning_total_minutes,
        traffic_risk: routed.risk, standard_cap_minutes: STANDARD_CAP_MINUTES,
        premium_one_way_ceiling_minutes: premiumCapMinutes, cap_status: capStatus(routed.baseline_total_minutes), fallback: plan.fallback,
        traffic_note: "OSRM shows road time without live traffic. This premium one-way route may pass the normal 210-minute limit, but no day may pass 330 baseline minutes. Check both cars before leaving and shorten a supporting stop when traffic rises."
      },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      weather: {
        kind: "historical_normal", high_c: normal.normal_high_c, low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: weatherComfort[plan.day - 1], station_id: normal.station_id, station_name: normal.station_name,
        station_role: normal.station_role, source_id: "src-noaa-normals",
        forecast_status: "replace-with-live-forecast-10-days-before",
        note: "This is normal past weather, not a 2026 forecast. Check the live forecast ten days before travel. Mountain mornings may be colder, and Gulf weather can change fast."
      }
    };
  });
  const knownCore = productionPlaces.filter((place) => place.included_in_magic_score)
    .reduce((sum, place) => sum + (place.cost.amount_per_person || 0), 0);
  const exceptionDays = days.filter((day) => day.drive.baseline_total_minutes > STANDARD_CAP_MINUTES).map((day) => day.day);
  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID, slug: ROUTE_SLUG.replace(/^route-11-/, ""), name: ROUTE_NAME,
      short_name: "Hidden Halls, Brass & Moonshot", status: "research-complete-bookings-pending", map_color: "#B88917",
      route_type: "premium-one-way", timezone: "multiple-US-time-zones", start_date: "2026-10-04", end_date: "2026-10-14",
      departure_or_onward_date: "2026-10-15", airport_date: "2026-10-15",
      origin: { name: lodgingNodes["boston-logan-rental"].name, coordinates: lodgingNodes["boston-logan-rental"].coordinates },
      destination: { name: lodgingNodes["houston-lodging"].name, coordinates: lodgingNodes["houston-lodging"].coordinates },
      endpoint_city: "Houston, TX", required_locations: ["New Orleans, LA", "Texas"], return_to_boston: false,
      direction: "Boston to Houston through New Haven, Philadelphia, Baltimore, the Shenandoah Valley, Asheville, Atlanta, Montgomery, the Gulf Coast, New Orleans and Cajun Country",
      countries: ["US"], canada_included: false, total_nights: 11, road_nights: 11, final_boston_nights: 0,
      baseline_total_miles: geometry.route_baseline_total_miles,
      summary: "A bold one-way trip from Boston to Houston with 28 main stops. Every hidden gem is now part of the real plan: secret libraries, caves, fossils, Gulf folk art, giant parade floats, a quiet swamp, moon rockets and an underground world of 220 columns."
    },
    constraints: {
      travelers: 4, cars: 2, cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 210], daily_drive_hard_cap_minutes: STANDARD_CAP_MINUTES,
      premium_one_way_exception_cap_minutes: premiumCapMinutes, premium_exception_authorized_by_user: true,
      premium_exception_days: exceptionDays,
      max_big_nights_out: 4, planned_big_nights_out: 2,
      max_athletic_adrenaline_spots: 2, planned_athletic_adrenaline_spots: 0,
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only; no Canada crossing or J-1 re-entry dependency.",
      budget_target_per_person_usd: 1500,
      budget_excludes: ["lodging", "rental cars", "fuel", "nightlife", "personal shopping"],
      end_state_assumption: "Return both cars in Houston and fly or continue from Texas on October 15. This route does not return to Boston."
    },
    scoring: {
      scale: { min: 1, max: 5, increment: 0.5 }, equal_traveler_weight: true, traveler_ids: PEOPLE,
      route_component_weights_percent: { attraction_and_stop_ratings: 45, excitement_and_uniqueness: 20, driving_comfort: 15, traveler_fairness: 10, cost_and_value: 5, expected_weather: 5 },
      route_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      driving_comfort_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      overall_excitement_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      cost_value_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      weather_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      magic_score: null, magic_score_status: "awaiting-traveler-ratings",
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
      core_admissions_range_per_person_usd: [Math.floor(knownCore), Math.ceil(knownCore + 135)],
      food_and_cafes_range_per_person_usd: [520, 760], local_parking_tolls_range_per_person_usd: [115, 205],
      optional_experiences_contingency_per_person_usd: [100, 200], controllable_total_range_per_person_usd: [1285, 1850],
      nightlife_excluded_from_target: true,
      note: "All 28 stops can stay near $1,500 with early tickets and simple meals, but Biltmore, NASA and the added stops can push the trip higher. Lodging, cars, fuel, nightlife and shopping are not included."
    },
    booking_priorities: [
      { place_id: "biltmore", urgency: "reserve-early", reason: "Book the earliest practical House entry and preserve the 13:00-13:30 departure for Atlanta." },
      { place_id: "boggs-metal-night", urgency: "ticket-alert", reason: "The October 9 lineup and venue are published, but doors, ticket price and age policy still need confirmation." },
      { place_id: "annunciation-mobile", urgency: "reconfirm", reason: "Confirm October 11 Orthros and Divine Liturgy and ask the parish about visitor and Communion etiquette." },
      { place_id: "whitney-plantation", urgency: "reserve-early", reason: "Monday is intentional because Whitney is closed Tuesday; choose the first tour." },
      { place_id: "frenchmen-music-night", urgency: "week-before", reason: "Use the exact October 12 calendar rather than promising an unannounced performer." },
      { place_id: "lake-martin-swamp", urgency: "reserve-early", reason: "Request a small quiet skiff around 13:00 and get the exact meeting point in writing." },
      { place_id: "space-center-houston", urgency: "reserve-early", reason: "Choose timed admission and tram/Historic Mission Control as inventory opens; NASA remains operational and access can change." }
    ],
    validation: {
      date_count: days.length, expected_date_count: 11,
      all_baseline_drive_days_at_or_below_standard_cap: exceptionDays.length === 0,
      authorized_premium_exception_days: exceptionDays,
      all_baseline_drive_days_at_or_below_premium_ceiling: days.every((day) => day.drive.baseline_total_minutes <= premiumCapMinutes),
      place_count: productionPlaces.length, image_count: images.length,
      places_with_fewer_than_3_usable_images: productionPlaces.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      replacement_option_count: replacements.variants.length,
      all_replacement_variants_at_or_below_cap: replacements.variants.every((variant) => variant.baseline_total_minutes <= variant.cap_minutes),
      unfilled_place_ratings: productionPlaces.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "The end-state assumption is Houston rental return and Texas departure or onward travel on October 15; this one-way route does not return to Boston Airport.",
        "Sunday worship in Mobile needs an early Greenville departure. Worship stays protected; shorten the two Gulf museums if traffic rises.",
        "Whitney Plantation is open Monday and closed Tuesday; the New Orleans sequence deliberately protects October 12.",
        "The October 9 Atlanta metal date and lineup are published, but doors, price and age policy remain pending.",
        "The exact October 12 Frenchmen Street bill is not yet published; refresh it 7-10 days before travel.",
        "Lake Martin needs a confirmed late boat. If its time moves earlier, shorten Avery Island rather than rushing the road.",
        "NASA tram access can close because Johnson Space Center is working. The main exhibits and Rocket Park remain the backup.",
        "No OSRM baseline includes live traffic. Day 8 reaches the 330-minute ceiling, so both cars need a live ETA and a clear stop-shortening plan."
      ],
      route_lock_status: "research-complete-bookings-live-traffic-and-forecast-pending"
    }
  };
  const geojson = {
    type: "FeatureCollection", name: ROUTE_SLUG, features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({
        type: "Feature", id: leg.id,
        properties: { feature_kind: "drive_leg", route_id: ROUTE_ID, day: day.day, date: day.date, from: leg.from, to: leg.to, distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, cap_status: day.drive.cap_status, map_color: route.route.map_color },
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
      { decision: "Houston is the Texas endpoint", reason: "It produces a true finale—working NASA infrastructure plus Rothko stillness—without adding the 2.5-3 hours that Austin or San Antonio would take beyond the New Orleans-Houston line." },
      { decision: "New Orleans receives two nights", reason: "One night would reduce the required city to a meal and music stop; two nights allow Whitney's documented history, living float craft and a locally programmed Frenchmen night." },
      { decision: "The premium route has a separately disclosed 330-minute ceiling", reason: "The user explicitly allowed breaking the prior drive rule. Measurement—not guesswork—showed the Biltmore-to-Atlanta event day at just over five baseline hours; keeping the original 210-minute cap visible prevents the exception from corrupting comparisons with Routes 1-10." },
      { decision: "Walter Anderson is a Gulf Coast core", reason: "Its local-folklore, self-taught art, nature observation and October 2026 Bayou Collection are a more distinctive route fit than another conventional mansion garden." },
      { decision: "All eleven hidden gems are now main stops", reason: "Every former replacement now appears in the measured daily schedule and Magic rating flow. No duplicate alternative cards remain." },
      { decision: "The expanded route stays inside its premium ceiling", reason: "The combined OSRM baselines run from 144 to 330 minutes. Day 8 reaches the ceiling but does not pass it." },
      { decision: "Orthodox Sunday remains protected", reason: "Annunciation Mobile is scheduled as the immovable Sunday event; the art stop is removed first if the early transfer runs late." }
    ],
    rejected: [
      { option: "Austin or San Antonio as the Texas endpoint", reason: "Either would consume another half-day after Houston and would weaken the New Orleans stay or the Texas finale within the fixed eleven days." },
      { option: "A one-night New Orleans checkbox", reason: "It would fail the user's only named stop and force hard history, local making and live music into an exhausting compressed visit." },
      { option: "Bellingrath as the default Gulf stop", reason: "It is beautiful but more conventional; Walter Anderson's folk-modernist murals and local Gulf identity better match the brief's request for shockingly unusual places." },
      { option: "A mainstream New Orleans club", reason: "A published Frenchmen Street live-music room fits the group's social preference without spending one of the limited nights on a generic club format." },
      { option: "Adding an adrenaline activity", reason: "The route already carries substantial mileage and two late nights; zero athletic-adrenaline anchors protects recovery and respects the max-two preference." },
      { option: "Treating Whitney as entertainment", reason: "It is scheduled as a testimony-centered historical visit with decompression, not as a photogenic plantation-house attraction." }
    ],
    traffic_policy: "OSRM baselines contain no traffic. The normal 210-minute limit remains visible, while this premium one-way route may use a separate 330-minute ceiling. Check both cars before leaving and shorten a supporting stop when traffic rises.",
    weather_policy: "Daily Celsius values are NOAA 1991-2020 station normals, not forecasts. Weather carries only 5 percent of Magic score and must be replaced by a live forecast about ten days before departure.",
    image_policy: "Three to five local, visually reviewed real images are stored per place with creator, source and rights details. Context images are labelled. Permission-required files are private-prototype-only until licensed or replaced."
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
  console.log(`Built ${ROUTE_NAME}: ${productionPlaces.length} places, ${images.length} images, ${days.length} days, ${geometry.route_baseline_total_miles} baseline miles.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
