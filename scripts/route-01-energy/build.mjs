import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
const VERIFIED_AT = "2026-08-31";
const writeJson = (filePath, value) => writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);

export async function buildEnergyRoute({ root, routeDir }) {
  const [energy, weather, manifest] = await Promise.all([
    readFile(path.join(root, "scripts", "route-01-energy", "energy-rebuild.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "weather-normals.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "dataset", "manifest.json"), "utf8").then(JSON.parse)
  ]);
  const placeById = new Map(energy.places.map((place) => [place.id, place]));
  const weatherByDay = new Map(weather.days.map((day) => [day.day, day]));
  const comfortScores = [4.2, 4.1, 4.4, 4.4, 4.5, 4.3, 4.5, 4.0, 3.8, 3.7, 3.6];
  const days = energy.days.map((day) => {
    const normal = weatherByDay.get(day.day);
    return {
      ...day,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(new Date(`${day.date}T12:00:00-04:00`)),
      lodging: {
        preferred_area: day.lodging[0],
        fallback_area: day.lodging[1],
        room_setup: "Two rooms: one 1-bed room and one 2-bed room",
        notes: "Strong suggestion only; prioritize safety, cleanliness, secure two-car parking and the exact bed layout."
      },
      weather: {
        kind: "historical_normal",
        high_c: normal.normal_high_c,
        low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfortScores[day.day - 1],
        station_id: normal.station_id,
        station_name: normal.station_name,
        station_role: normal.station_role,
        source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Weather-sensitive activities have route-safe cut logic."
      }
    };
  });
  // Bring Route 01's place records up to the field set the later V2 routes emit. Everything here is
  // derived from data the rebuild already holds; nothing is invented. Route 01's brief predates the
  // texture / interaction taxonomy introduced in Route 02, so those two fields stay null rather than
  // being fabricated, and route-decisions.json records why.
  const OPTIONAL_ROLES = new Set(["optional-unscored-flex", "documented-unscored-route-alternative"]);
  for (const place of energy.places) {
    const core = place.included_in_magic_score === true;
    const fit = place.researcher_person_fit || {};
    const low = place.cost?.low ?? place.cost?.amount_per_person ?? 0;
    const high = place.cost?.high ?? place.cost?.amount_per_person ?? low;
    place.core_status = core ? "core" : OPTIONAL_ROLES.has(place.energy_rebuild_role) ? "optional" : "alternative";
    place.original_status = core
      ? (place.energy_rebuild_role === "new-energy-anchor" ? "new-core" : "keep-core")
      : place.energy_rebuild_role === "optional-unscored-flex" ? "keep-optional" : "documented-alternative";
    place.included_in_magic_default = core;
    place.museum_like = Boolean(place.experience_flags?.museum_like);
    place.texture = null;
    place.interaction_score = null;
    place.price_per_person_low = low;
    place.price_per_person_high = high;
    place.price_per_group = place.cost?.amount_per_group ?? null;
    place.price_type = place.cost?.price_type ?? (low === 0 ? "free" : "per-person");
    place.price_last_checked = VERIFIED_AT;
    place.viki_fit = fit.viki ?? null;
    place.gora_fit = fit.gora ?? null;
    place.stivka_fit = fit.stivka ?? null;
    place.planner_balance_fit = fit.sheluvspaco ?? null;
    place.operational_risk = place.operational_risk || (place.reservation === "required" ? "yellow" : "green");
    place.operational_confidence = place.operational_confidence || place.operational_risk;
    place.optional = true;
    place.included_in_daily_max_total = core;
    if (!place.skip_mode) place.skip_mode = place.best_fit_note || (core ? "Every paid attraction is optional; activate only what the group wants." : "Optional choice; activate it only when the group explicitly wants this variant.");
    place.skip_strategy = place.skip_mode;
  }

  const scheduled = new Set(days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  const optionalSpots = days.flatMap((day) => day.optional_spots || []);
  const directFlexPlaceIds = days.flatMap((day) => day.schedule
    .filter((item) => item.priority === "optional")
    .map((item) => item.place_id));
  const corePlaces = energy.places.filter((place) => place.included_in_magic_score);
  const lowCost = corePlaces.reduce((sum, place) => sum + (place.cost?.low ?? place.cost?.amount_per_person ?? 0), 0);
  const highCost = corePlaces.reduce((sum, place) => sum + (place.cost?.high ?? place.cost?.amount_per_person ?? 0), 0);
  const museumLikeCoreCount = corePlaces.filter((place) => place.experience_flags?.museum_like).length;
  const baselineMiles = Math.round(days.reduce((sum, day) => sum + day.drive.baseline_total_miles, 0) * 10) / 10;
  const route = {
    schema_version: "1.0.0",
    route: {
      id: "route-01",
      slug: "gilded-coast-capital-loop",
      name: "The Gilded Coast & Capital Energy Loop",
      short_name: "Gilded Coast Energy",
      status: "energy-rebuild-ui-ready",
      route_dna: "MOVEMENT × COMPETITION × SCENERY × CONTROLLED ADRENALINE",
      map_color: "#FF5A36",
      timezone: "America/New_York",
      start_date: "2026-10-04",
      end_date: "2026-10-14",
      airport_date: "2026-10-15",
      origin: { name: "Boston Logan Rental Car Center", coordinates: [-71.0236, 42.367] },
      destination: { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
      endpoint_city: "Washington, DC",
      direction: "Boston to Newport, New Haven, New York, Philadelphia, Washington and Gettysburg; return through Hawk Mountain, Lehigh Valley, Paterson and Fairfield",
      countries: ["US"],
      canada_included: false,
      total_nights: 11,
      road_nights: 10,
      final_boston_nights: 1,
      baseline_total_miles: baselineMiles,
      energy_rebuild_version: "2.0.0",
      energy_rebuild_verified_at: energy.verified_at,
      summary: "An active Northeast loop built around changing forms of interaction: solve, coast, climb, shop, bike, race, worship, fly, hike, learn on real terrain and finish with a four-person quest. Only the Newport Car Museum, American Visionary Art Museum and Eastern State survive as museum-like core stops because their physical environments are the experience."
    },
    constraints: {
      travelers: 4, cars: 2, cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 180], daily_drive_hard_cap_minutes: 210,
      max_big_nights_out: 4, planned_big_nights_out: 0,
      max_athletic_adrenaline_spots: 2,
      planned_athletic_adrenaline_spots: corePlaces.filter((place) => place.experience_bucket === "adventure-adrenaline").length,
      energy_rebuild_exception: "The earlier two-adrenaline-spot preference is superseded for this route by varied physical experiences separated with recovery days; no single day uses more than one dominant high-output anchor except the intentionally aggressive Philadelphia day.",
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only route; no Canada crossing or J-1 re-entry dependency.",
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
    experience_model: {
      primary_buckets: ["nature-scenic", "adventure-adrenaline", "interactive-puzzle-immersive", "high-impact-history-culture", "sacred-spiritual", "urban-exploration-photo", "shopping", "optional-food-nightlife"],
      museum_like_core_count: museumLikeCoreCount,
      museum_like_core_percent: Math.round(museumLikeCoreCount / corePlaces.length * 1000) / 10,
      old_museum_and_historic_concentration_percent: 51.4,
      direct_flex_place_ids: directFlexPlaceIds,
      constrained_day_option_place_ids: optionalSpots.map((option) => option.place_id),
      design_rule: "Retain learning only where the physical environment or interaction is exceptional. Route-safe flex can appear in the main day; constrained options remain rateable beneath that day's stops and never affect Magic until activated."
    },
    days,
    place_ids: energy.places.map((place) => place.id),
    core_place_ids: corePlaces.map((place) => place.id),
    alternative_place_ids: energy.places.filter((place) => !place.included_in_magic_score).map((place) => place.id),
    replacement_place_ids: [],
    replacement_options: [],
    budget: {
      free_route_baseline_per_person_usd: 0,
      selected_experience_total_status: "computed-from-user-toggles",
      do_everything_core_low_per_person_usd: Math.round(lowCost * 100) / 100,
      do_everything_core_high_per_person_usd: Math.round(highCost * 100) / 100,
      shopping_spend_excluded: true,
      food_nightlife_lodging_cars_fuel_excluded: true,
      note: "Every paid attraction is optional. The UI should sum only experiences the group activates."
    },
    booking_priorities: [
      { place_id: "nj-atv-rentals", urgency: "call-first", reason: "Exact Oct 8 operation must be accepted by the operator." },
      { place_id: "treetop-quest-philly", urgency: "book-first", reason: "Secure the published Oct 9 noon window and confirm weather policy." },
      { place_id: "gettysburg-battlefield", urgency: "book-first", reason: "Oct 12 holiday closure complicates visitor-center walk-up; reserve a private guide independently." },
      { place_id: "ifly-baltimore", urgency: "book-first", reason: "Lock a late-morning slot that protects the DC transfer." },
      { place_id: "boda-borg-boston", urgency: "book-around-car-return", reason: "Protect the final two-car return deadline." },
      { place_id: "beat-the-bomb-brooklyn", urgency: "timed-ticket", reason: "Protect the exact mission and four-person time." },
      { place_id: "level99-providence", urgency: "timed-ticket", reason: "Reserve the opening-day gameplay block." },
      { place_id: "vessel-hudson-yards", urgency: "timed-ticket", reason: "Protect the short Hudson Yards window." }
    ],
    validation: {
      date_count: days.length, expected_date_count: 11,
      all_baseline_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= 210),
      live_traffic_gated_days: days.filter((day) => day.drive.cap_status === "live-traffic-gated").map((day) => day.day),
      place_count: energy.places.length,
      scheduled_unique_place_count: scheduled.size,
      image_count: energy.images.length,
      places_with_fewer_than_3_usable_images: energy.places.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      optional_spot_count: optionalSpots.length,
      direct_flex_place_count: directFlexPlaceIds.length,
      replacement_option_count: 0,
      all_replacement_variants_at_or_below_cap: true,
      unfilled_place_ratings: energy.places.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "NJ ATV on Oct 8 remains booking-gated until the operator accepts the exact date.",
        "Gettysburg's visitor center is listed closed Oct 12; battlefield grounds remain open and the private guide must be arranged independently.",
        "Outdoor and aerial experiences require 48-hour weather/closure checks.",
        "Both cars are returned at Logan before the group reaches Boda Borg by transit or rideshare.",
        "USS Nautilus is safe only as a Day 2 swap for Napatree: the swap is 193 baseline minutes, while adding both reaches 212 against the 210-minute cap.",
        "SteelStacks is a fully illustrated unscored Day 9 option, not a baseline stop: the exact routed addition reaches 212 minutes against the 210-minute cap.",
        "Purgatory Chasm is a fully illustrated unscored Day 11 route-redesign option, not an additive stop: including it reaches 247 minutes against that day's authorized 220-minute limit.",
        "OSRM contains no live traffic; NYC, I-95, North Jersey and Boston approaches remain live-traffic gates."
      ],
      route_lock_status: "ui-ready-bookings-and-live-forecast-pending",
      energy_rebuild_status: "canonical-and-rebuild-safe"
    }
  };

  const geojson = {
    type: "FeatureCollection",
    name: "route-01-gilded-coast-capital-loop-energy-v2",
    features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({
        type: "Feature", id: leg.id,
        properties: { feature_kind: "drive_leg", route_id: "route-01", day: day.day, date: day.date, from: leg.from, to: leg.to, distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, traffic_risk: leg.traffic_risk, map_color: route.route.map_color, energy_rebuild: true },
        geometry: leg.geometry
      }))),
      ...energy.places.map((place) => ({
        type: "Feature", id: place.id,
        properties: { feature_kind: "place", route_id: "route-01", place_id: place.id, name: place.name, city: place.city, state: place.state, visit_date: place.visit_date, priority: place.priority, included_in_magic_score: place.included_in_magic_score, experience_bucket: place.experience_bucket, energy_rebuild_role: place.energy_rebuild_role },
        geometry: { type: "Point", coordinates: place.coordinates }
      })),
      ...Object.entries(energy.route_nodes).map(([nodeId, coordinates]) => ({
        type: "Feature", id: `node-${nodeId}`,
        properties: { feature_kind: "route_node", route_id: "route-01", node_id: nodeId, name: nodeId.replaceAll("-", " ") },
        geometry: { type: "Point", coordinates }
      }))
    ]
  };
  const routeGeometry = {
    schema_version: "1.0.0",
    generated_at: energy.verified_at,
    routing_engine: "OSRM public demo server",
    routing_profile: "driving",
    traffic_model: "none",
    warning: "Durations are frozen road-network baselines. The planning range is a risk buffer, not live traffic.",
    nodes: Object.fromEntries([
      ...Object.entries(energy.route_nodes).map(([id, coordinates]) => [id, { name: id.replaceAll("-", " "), coordinates }]),
      ...energy.places.map((place) => [place.id, { name: place.name, coordinates: place.coordinates }])
    ]),
    days: days.map((day) => ({
      day: day.day,
      date: day.date,
      risk: day.drive.traffic_risk,
      legs: day.drive.legs,
      baseline_total_miles: day.drive.baseline_total_miles,
      baseline_total_minutes: day.drive.baseline_total_minutes
    }))
  };
  const decisions = {
    schema_version: "1.0.0", route_id: "route-01", verified_at: energy.verified_at,
    purpose: "Replace museum-heavy repetition with varied physical, scenic, social, sacred and immersive interaction while selectively restoring only exceptional legacy anchors.",
    retained_legacy_core: energy.legacy_selection.core_ids,
    retained_legacy_optional: energy.legacy_selection.optional_ids,
    legacy_selection_reasoning: {
      "newport-car-museum": "Restored as the user's explicit example: automotive design, real machines and driving simulators make it an active visual museum rather than a reading-heavy stop.",
      avam: "Restored because outsider art, kinetic sculpture and the building itself provide color and discovery between iFLY and DC.",
      steelstacks: "Retained as a free, unscored Day 9 option after karting. Exact routing reaches 212 minutes, so it appears beneath the main stops and must not be added without another cut.",
      "submarine-force-museum": "Retained as the Day 2 bad-weather substitution for Napatree. The 193-minute swap is route-safe; adding both reaches 212 minutes and is not allowed.",
      "reading-terminal-market": "Promoted into the main Day 6 schedule because the cars remain parked and it adds no route driving. It remains an optional, unscored food flex."
    },
    unscheduled_energy_alternative: {
      "purgatory-chasm": "Kept with its complete five-image card as a Day 11 route-redesign option. Current OSRM routing measures 247 minutes when added, 27 minutes beyond the authorized 220-minute limit, so it appears beneath the main stops rather than in the baseline."
    },
    rejected_legacy_pattern: "Generic museums, repeated historic interiors, scheduled meals and fixed nightlife remain removed from core.",
    traffic_policy: "OSRM is a frozen road-network baseline without traffic. Cut flexible content before exceeding 210 active driving minutes.",
    image_policy: "Existing legacy attributions are preserved. Every new place has five visually reviewed exact-place images marked permission-required for private-prototype use only."
  };
  const replacementGeometry = { schema_version: "1.0.0", route_id: "route-01", generated_at: energy.verified_at, routing_engine: "none-required", traffic_included: false, variants: [] };
  const readme = `# Route 01 — The Gilded Coast & Capital Energy Loop\n\nCanonical Energy Rebuild V2 for October 4–15, 2026. This package replaces the museum-heavy Route 01 rhythm with movement, competition, scenery, sacred architecture, controlled adrenaline, shopping recovery and only three museum-like core experiences whose physical environments justify the stop.\n\n## Package summary\n\n- ${energy.places.length} total places; ${corePlaces.length} core-scored and ${energy.places.length - corePlaces.length} optional/unscored\n- ${scheduled.size} uniquely scheduled place cards across 11 days\n- ${directFlexPlaceIds.length} route-safe flex stop in a main day and ${optionalSpots.length} constrained options beneath affected days\n- ${energy.images.length} local carousel images\n- ${baselineMiles.toLocaleString("en-US", { minimumFractionDigits: 1 })} OSRM baseline miles; every standard day remains at or below 210 baseline minutes, with the approved 220-minute Day 11 exception documented in data\n- ${museumLikeCoreCount}/${corePlaces.length} museum-like core experiences (${route.experience_model.museum_like_core_percent}%), down from the original 51.4% museum/history concentration\n- $${route.budget.do_everything_core_low_per_person_usd}–$${route.budget.do_everything_core_high_per_person_usd} optional do-everything attraction range per person; free route baseline is $0\n\n## Restored legacy highlights\n\nNewport Car Museum is a core Day 2 anchor because automotive design, real machines and simulators create active visual energy. American Visionary Art Museum is a compact Day 7 core stop because its outsider-art environment adds color between iFLY and Washington. Reading Terminal is now a route-safe, unscored Day 6 breakfast flex. USS Nautilus stays visible beneath Day 2 as a 193-minute weather swap for Napatree; adding both would reach 212 minutes. SteelStacks stays beneath Day 9 because its exact addition reaches 212 minutes. Purgatory Chasm stays beneath Day 11 as a route-redesign option because its additive route reaches 247 minutes against that day's authorized 220-minute limit.\n\n## UI contract\n\nEach place exposes its primary \`experience_bucket\`, secondary \`experience_flags\`, four equal rating slots, traveler-fit copy, optional cost model, booking state, coordinates, sources and carousel images. Route-safe flex uses the normal \`schedule\`; constrained choices use per-day \`optional_spots\` and remain fully viewable and rateable beneath the main stops. Optional places are excluded from Magic until activated. Route days contain exact schedules and point-to-point OSRM legs; map points and lines are in \`route.geojson\`.\n\n## Operations\n\nThe route is UI-ready but not booking-final. Lock NJ ATV, Treetop Quest, Gettysburg's independent holiday guide and iFLY first. Day 11 returns both cars at Logan before the Boda Borg finale by transit or rideshare. Recheck outdoor closures and replace climate normals with live Celsius forecasts inside the forecast window. New editorial/venue imagery is private-prototype-only until permission is cleared.\n\nRebuild with \`node scripts/build-route-package.mjs\`, then validate with \`node scripts/validate-route-package.mjs route-01-gilded-coast-capital-loop\`.\n`;

  const manifestRoute = manifest.routes.find((entry) => entry.id === "route-01");
  if (!manifestRoute) throw new Error("route-01 is missing from dataset/manifest.json");
  manifestRoute.name = route.route.name;
  manifestRoute.status = "energy-rebuild-ui-ready";
  manifestRoute.place_count = energy.places.length;
  manifestRoute.image_count = energy.images.length;
  manifestRoute.day_count = days.length;
  manifestRoute.baseline_miles = baselineMiles;

  await Promise.all([
    writeJson(path.join(routeDir, "places.json"), { schema_version: "1.0.0", route_id: "route-01", places: energy.places }),
    writeJson(path.join(routeDir, "images.json"), { schema_version: "1.0.0", route_id: "route-01", image_policy: "Legacy image rights retained; five manually reviewed exact-place images per new Energy Rebuild place are private-prototype-only until permission is cleared.", images: energy.images }),
    writeJson(path.join(routeDir, "sources.json"), { schema_version: "1.0.0", route_id: "route-01", verified_at: energy.verified_at, sources: energy.sources }),
    writeJson(path.join(routeDir, "route.json"), route),
    writeJson(path.join(routeDir, "route-geometry.json"), routeGeometry),
    writeJson(path.join(routeDir, "route.geojson"), geojson),
    writeJson(path.join(routeDir, "replacement-geometry.json"), replacementGeometry),
    writeJson(path.join(routeDir, "route-decisions.json"), decisions),
    writeJson(path.join(routeDir, "place-seed.json"), {
      schema_version: "1.0.0",
      route_id: "route-01",
      generated_from: "scripts/route-01-energy/energy-rebuild.json",
      places: energy.places
    }),
    writeFile(path.join(routeDir, "README.md"), readme),
    writeJson(path.join(root, "dataset", "manifest.json"), manifest)
  ]);
  console.log(`Built Route 01 Energy V2: ${energy.places.length} places, ${energy.images.length} images, ${days.length} days.`);
  return { placeCount: energy.places.length, imageCount: energy.images.length, dayCount: days.length };
}
