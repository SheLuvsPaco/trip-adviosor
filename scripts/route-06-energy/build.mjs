import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { manualCoordinates } from "./config.mjs";
import {
  ARCHIVE_DISPOSITIONS,
  BOOKING_PRIORITIES,
  CORE_CONFIG,
  CORE_IDS,
  DAY_PLANS,
  IMAGE_CONTEXT_SOURCE,
  NEW_SOURCES,
  OPTIONAL_CONFIG,
  OPTIONAL_IDS,
  ORIGINAL_VISIBLE_IDS,
  PEOPLE,
  PLACE_OVERRIDES,
  VERIFIED_AT
} from "./data.mjs";

const ROUTE_ID = "route-06";
const ROUTE_SLUG = "route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop";
const TOTAL_CAP = 300;
const UNINTERRUPTED_CAP = 150;
const writeJson = (filePath, value) => writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);

function travelerFit(best, secondary) {
  return Object.fromEntries(PEOPLE.map((person) => [person, best.includes(person) ? 5 : secondary.includes(person) ? 4 : 3.5]));
}

function originalStatus(id, isCore) {
  if (!ORIGINAL_VISIBLE_IDS.includes(id)) return isCore ? "new-core" : "new-optional";
  return isCore ? "keep-core" : "keep-optional-or-flex";
}

function overrideObject(id) {
  const row = PLACE_OVERRIDES[id];
  if (!row) return {};
  const [name, kind, city, state, address, summary, why_go] = row;
  return { name, kind, city, state, address, summary, why_go };
}

function defaultCost() {
  return { amount_per_person: 0, low: 0, high: 0, amount_per_group: 0, price_type: "free", status: "free", note: "No admission is modeled." };
}

function buildPlace(current, id) {
  const isCore = CORE_IDS.includes(id);
  const config = isCore ? CORE_CONFIG[id] : OPTIONAL_CONFIG[id] || {};
  const overrides = overrideObject(id);
  const best = isCore ? config.best : current?.best_for || ["sheluvspaco"];
  const secondary = isCore ? config.secondary : current?.secondary_for || PEOPLE.filter((person) => !best.includes(person));
  const fit = travelerFit(best, secondary);
  const flags = new Set(config.flags || []);
  const coordinate = manualCoordinates[id] || config.coordinates || current?.coordinates;
  if (!coordinate) throw new Error(`Route 06 V2 is missing coordinates for ${id}.`);
  const sourceIds = [...new Set([...(current?.source_ids || []), ...(config.source_ids || []), ...(config.sourceIds || [])])];
  const cost = isCore ? config.cost : config.cost || current?.cost || defaultCost();
  const skip = isCore ? config.skip : "Optional choice; activate it only when the group explicitly wants this variant.";

  return {
    ...(current || {}),
    ...overrides,
    id,
    country: "US",
    visit_date: isCore ? config.date : config.date || current?.visit_date || null,
    best_for: best,
    secondary_for: secondary,
    best_fit_note: isCore ? `Primary fit: ${best.join(", ")}. ${skip}` : current?.best_fit_note || skip,
    categories: current?.categories || ["unusual_creative"],
    duration_minutes: isCore ? config.duration : current?.duration_minutes || 90,
    priority: isCore ? "anchor" : "optional",
    reservation: isCore ? config.reservation : current?.reservation || "check",
    hours: current?.hours || { opens: null, closes: null, status: "reconfirm-required", note: "Reconfirm live access before activating this choice." },
    cost,
    source_ids: sourceIds,
    coordinates: coordinate,
    coordinate_order: "longitude_latitude",
    coordinate_source: manualCoordinates[id] || config.coordinates ? "manual_verified_access_or_planning_point" : current?.coordinate_source,
    ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 },
    researcher_person_fit: fit,
    included_in_magic_score: isCore,
    included_in_magic_default: isCore,
    included_in_daily_max_total: isCore,
    core_status: isCore ? "core" : "optional-or-flex",
    original_status: originalStatus(id, isCore),
    energy_rebuild_role: isCore ? "active-core" : "meaningful-selectable-alternative",
    experience_bucket: isCore ? config.bucket : current?.experience_bucket || "optional-variant",
    texture: isCore ? config.texture : current?.texture || "OPTIONAL",
    interaction_score: isCore ? config.interaction : current?.interaction_score || 2,
    museum_like: false,
    experience_flags: {
      museum_like: false,
      evidence_first: flags.has("evidence_first"),
      legal_ruin: flags.has("legal_ruin"),
      after_dark: flags.has("after_dark"),
      folklore_fieldwork: flags.has("folklore_fieldwork"),
      industrial_scale: flags.has("industrial_scale"),
      institutional_site: flags.has("institutional_site"),
      hunting_season_recheck: flags.has("hunting_season_recheck"),
      headlamp_required: flags.has("headlamp_required"),
      weather_gated: flags.has("weather_gated"),
      partial_participation_easy: flags.has("partial_participation_easy"),
      operator_guided_preferred: flags.has("operator_guided_preferred"),
      source_conflict: flags.has("source_conflict"),
      exact_date_2026: flags.has("exact_date_2026"),
      shopping_spend_excluded: flags.has("shopping_spend_excluded"),
      museum_context: flags.has("museum_context"),
      statue_microstop: flags.has("statue_microstop"),
      guided_tnt_field_tour: id === "mothman-tnt-tour",
      self_guided_wma_fallback: id === "mothman-tnt-tour"
    },
    viki_fit: fit.viki,
    gora_fit: fit.gora,
    stivka_fit: fit.stivka,
    planner_balance_fit: fit.sheluvspaco,
    price_type: cost.price_type,
    price_per_person_low: cost.low ?? cost.amount_per_person ?? 0,
    price_per_person_high: cost.high ?? cost.amount_per_person ?? 0,
    price_per_group: cost.amount_per_group ?? (cost.amount_per_person || 0) * 4,
    price_last_checked: VERIFIED_AT,
    physical_level: flags.has("headlamp_required") ? "moderate" : config.interaction >= 3 ? "light-moderate" : "easy",
    skip_mode: skip,
    skip_strategy: skip,
    optional: true,
    source_confidence: isCore ? "brief-and-primary-source-ledger" : "documented-option",
    operational_confidence: isCore ? config.risk : "activate-and-reconfirm",
    operational_risk: isCore ? config.risk : "activate-and-reconfirm",
    fallback_ids: isCore && config.fallback ? [config.fallback] : [],
    fallback_place_id: isCore ? config.fallback : null,
    replacement: undefined,
    data_status: "complete"
  };
}

function scheduleItem([start, end, placeId, priority], placeById) {
  const place = placeById.get(placeId);
  if (!place) throw new Error(`Route 06 V2 schedule references missing place ${placeId}.`);
  return { start, end, place_id: placeId, priority, reservation: place.reservation };
}

function comfortScore(normal) {
  const temperaturePenalty = Math.abs(normal.normal_high_c - 21) / 4;
  const rainPenalty = normal.measurable_precipitation_probability_percent / 25;
  return Math.round(Math.max(1, Math.min(5, 5 - temperaturePenalty - rainPenalty)) * 10) / 10;
}

// A place that has been through scripts/harvest-place-images.mjs + promote-place-images.mjs has real
// reviewed photographs in research-raw.json. Those always beat a cloned regional-context placeholder.
function realImages(placeId, placeName, research) {
  const selected = research?.places?.[placeId]?.selected_images ?? [];
  if (selected.length < 3) return null;
  return selected.slice(0, 3).map((item, index) => ({
    id: `img-${placeId}-${index + 1}`,
    place_id: placeId,
    title: item.title,
    description: item.description,
    search_query: item.search_query,
    local_path: item.local_path,
    source_page: item.source_page,
    source_file_url: item.original_url,
    creator: item.creator || "Unknown",
    credit: item.credit || "",
    license: item.license || "Unknown",
    license_url: item.license_url,
    alt: item.description || `${placeName} photograph`,
    coverage: item.coverage || "exact-place-or-experience",
    production_usable: item.production_usable ?? item.license !== "Unknown",
    rights_status: item.rights_status || "commons-license-recorded",
    visual_review: item.review_status === "reviewed" ? "reviewed" : "pending-final-review"
  }));
}

function cloneContextImages(placeId, placeName, sourcePlaceId, imagesByPlace) {
  // The first V2 build can clone from a legacy/archived source card. Later
  // builds intentionally no longer contain that card, so fall back to the
  // target's already-labeled contextual records to keep the pipeline idempotent.
  const candidates = imagesByPlace.get(sourcePlaceId) || imagesByPlace.get(placeId) || [];
  if (candidates.length < 3) throw new Error(`${placeId} cannot clone three context images from ${sourcePlaceId}; found ${candidates.length}.`);
  return candidates.slice(0, 3).map((image, index) => ({
    ...image,
    id: `img-${placeId}-context-${index + 1}`,
    place_id: placeId,
    title: `${placeName} — regional context ${index + 1}`,
    description: `Context image for ${placeName}; this is not presented as an exact-place photograph.`,
    alt: `Regional context for ${placeName}`,
    coverage: "regional-context-not-exact-place",
    visual_review: "reviewed-context-only"
  }));
}

export async function buildEnergyRoute06({ root, routeDir }) {
  const [currentPlacesPackage, currentImagesPackage, research, currentSourcesPackage, weather, geometry, manifest] = await Promise.all([
    readFile(path.join(routeDir, "places.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "images.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "research-raw.json"), "utf8").then(JSON.parse).catch(() => ({ places: {} })),
    readFile(path.join(routeDir, "sources.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "weather-normals.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "route-geometry.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "dataset", "manifest.json"), "utf8").then(JSON.parse)
  ]);

  const currentPlaceById = new Map(currentPlacesPackage.places.map((place) => [place.id, place]));
  const finalIds = [...CORE_IDS, ...OPTIONAL_IDS];
  if (new Set(finalIds).size !== 55) throw new Error(`Route 06 V2 inventory must contain 55 unique places; found ${new Set(finalIds).size}.`);
  const places = finalIds.map((id) => buildPlace(currentPlaceById.get(id), id));
  const placeById = new Map(places.map((place) => [place.id, place]));

  const currentImagesByPlace = new Map();
  for (const image of currentImagesPackage.images) {
    currentImagesByPlace.set(image.place_id, [...(currentImagesByPlace.get(image.place_id) || []), image]);
  }
  const newIdSet = new Set(Object.keys(IMAGE_CONTEXT_SOURCE));
  const images = currentImagesPackage.images.filter((image) => placeById.has(image.place_id) && !newIdSet.has(image.place_id));
  for (const [placeId, sourcePlaceId] of Object.entries(IMAGE_CONTEXT_SOURCE)) {
    const placeName = placeById.get(placeId).name;
    const real = realImages(placeId, placeName, research);
    images.push(...(real ?? cloneContextImages(placeId, placeName, sourcePlaceId, currentImagesByPlace)));
  }
  const imageIdsByPlace = new Map();
  for (const image of images) imageIdsByPlace.set(image.place_id, [...(imageIdsByPlace.get(image.place_id) || []), image.id]);
  for (const place of places) {
    place.image_ids = imageIdsByPlace.get(place.id) || [];
    if (place.image_ids.length < 3) throw new Error(`${place.id} has ${place.image_ids.length}/3 UI images.`);
  }

  const sourceById = new Map(currentSourcesPackage.sources.map((source) => [source.id, source]));
  for (const source of NEW_SOURCES) sourceById.set(source.id, source);
  const usedSourceIds = new Set(places.flatMap((place) => place.source_ids || []));
  const sources = [...sourceById.values()].filter((source) => usedSourceIds.has(source.id));
  for (const sourceId of usedSourceIds) if (!sourceById.has(sourceId)) throw new Error(`Unknown Route 06 V2 source ${sourceId}.`);

  const weatherByDay = new Map(weather.days.map((day) => [day.day, day]));
  const geometryByDay = new Map(geometry.days.map((day) => [day.day, day]));
  const days = DAY_PLANS.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    if (!routed || !normal) throw new Error(`Route 06 V2 day ${plan.day} is missing geometry or climate data.`);
    const longestLeg = Math.max(0, ...routed.legs.map((leg) => leg.baseline_minutes));
    const capStatus = longestLeg > UNINTERRUPTED_CAP
      ? "over-uninterrupted-cap"
      : routed.baseline_total_minutes > TOTAL_CAP
        ? "over-total-cap"
        : routed.baseline_total_minutes > 210
          ? "long-total-day-with-planned-breaks"
          : routed.planning_total_minutes.high > 210
            ? "live-traffic-gated"
            : "comfortable";
    return {
      day: plan.day,
      date: plan.date,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(new Date(`${plan.date}T12:00:00-04:00`)),
      sleep_city: plan.sleep_city,
      theme: plan.theme,
      notes: [
        "OSRM is a frozen road-network baseline with no live traffic.",
        ...(routed.baseline_total_minutes > 210 ? ["This is a long total road day; the mapped rest/fuel nodes are operational stops, not extra attractions."] : [])
      ],
      lodging: { preferred_area: plan.lodging[0], fallback_area: plan.lodging[1], room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Strong suggestion only; verify safety, cleanliness, exact beds, late check-in and secure two-car parking." },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      drive: {
        legs: routed.legs,
        baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes,
        planning_total_minutes: routed.planning_total_minutes,
        traffic_risk: routed.risk,
        cap_minutes: TOTAL_CAP,
        max_uninterrupted_minutes: longestLeg,
        uninterrupted_cap_minutes: UNINTERRUPTED_CAP,
        cap_status: capStatus,
        fallback: plan.fallback,
        traffic_note: "OSRM has no live traffic. Recheck both cars before every leg and cut optional activity before eroding a booking or safe arrival."
      },
      weather: {
        kind: "historical_normal",
        high_c: normal.normal_high_c,
        low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfortScore(normal),
        station_id: normal.station_id,
        station_name: normal.station_name,
        station_role: normal.station_role,
        source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Tunnel, industrial, forest and watershed conditions require a live check."
      }
    };
  });

  const corePlaces = places.filter((place) => place.included_in_magic_score);
  const lowCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_low, 0) * 100) / 100;
  const highCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_high, 0) * 100) / 100;
  const baselineMiles = Math.round(days.reduce((sum, day) => sum + day.drive.baseline_total_miles, 0) * 10) / 10;
  const scheduled = new Set(days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  const longestLeg = Math.max(...days.map((day) => day.drive.max_uninterrupted_minutes));
  const paidCore = corePlaces.filter((place) => place.price_per_person_low > 0);
  const rightsGatedImages = images.filter((image) => image.production_usable === false);
  if (corePlaces.length !== 26 || OPTIONAL_IDS.length !== 29) throw new Error(`Route 06 V2 balance is ${corePlaces.length} core / ${OPTIONAL_IDS.length} optional.`);
  if (lowCost !== 129.95 || highCost !== 129.95) throw new Error(`Route 06 V2 core ceiling must be $129.95; calculated $${lowCost}.`);
  for (const id of CORE_IDS) if (!scheduled.has(id)) throw new Error(`Core place ${id} is not scheduled.`);

  const bucketTally = corePlaces.reduce((tally, place) => ({ ...tally, [place.experience_bucket]: (tally[place.experience_bucket] || 0) + 1 }), {});
  const textureTally = corePlaces.reduce((tally, place) => ({ ...tally, [place.texture]: (tally[place.texture] || 0) + 1 }), {});
  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID,
      slug: "mothman-steel-cathedrals-cabinet-of-evidence-loop",
      name: "The Mothman, Steel Cathedrals & Cabinet of Evidence Loop",
      short_name: "Evidence in the Dark",
      status: "energy-rebuild-ui-ready",
      map_color: manifest.routes.find((entry) => entry.id === ROUTE_ID)?.map_color || "#2563EB",
      timezone: "America/New_York",
      start_date: "2026-10-04",
      end_date: "2026-10-14",
      airport_date: "2026-10-15",
      origin: { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
      destination: { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
      endpoint_city: "Point Pleasant and Weston, WV",
      direction: "Boston through western Connecticut and Pennsylvania to Pittsburgh, then Moundsville, Parkersburg, Point Pleasant and Weston before a Morgantown, I-68, Poconos, Danbury and Quabbin return",
      countries: ["US"],
      canada_included: false,
      total_nights: 11,
      road_nights: 10,
      final_boston_nights: 1,
      baseline_total_miles: baselineMiles,
      energy_rebuild_version: "2.0.0",
      energy_rebuild_verified_at: VERIFIED_AT,
      route_dna: "EVIDENCE IN THE DARK",
      summary: "A route built around entering the physical evidence: a prison mine, sacred stones, a working guitar factory, reconstructed military environments, an abandoned turnpike tunnel, a rescue shaft, blast furnaces, an artist house, labor murals, a penitentiary, Mothman fieldwork, an asylum by flashlight, an iron-furnace forest, engineered geology, a deliberate shopping release and the footprint of a vanished Massachusetts town."
    },
    constraints: {
      travelers: 4,
      cars: 2,
      cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 210],
      daily_drive_hard_cap_minutes: TOTAL_CAP,
      max_uninterrupted_drive_minutes: UNINTERRUPTED_CAP,
      route_specific_drive_rule: "No planned uninterrupted drive exceeds 150 baseline minutes. Four optimistic prose estimates were split with explicit rest/fuel nodes after OSRM measurement.",
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only route with no border crossing.",
      budget_excludes: ["lodging", "rental cars", "fuel", "tolls", "ordinary parking", "food", "nightlife", "shopping purchases", "donations"]
    },
    scoring: {
      scale: { min: 1, max: 5, increment: 0.5 },
      equal_traveler_weight: true,
      traveler_ids: PEOPLE,
      route_component_weights_percent: { attraction_and_stop_ratings: 45, excitement_and_uniqueness: 20, driving_comfort: 15, traveler_fairness: 10, cost_and_value: 5, expected_weather: 5 },
      route_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      driving_comfort_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      overall_excitement_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      cost_value_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      weather_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      magic_score: null,
      magic_score_status: "awaiting-traveler-ratings",
      person_specific_route_scores: Object.fromEntries(PEOPLE.map((person) => [person, null]))
    },
    experience_model: {
      meaningful_selectable_inventory_count: places.length,
      core_experience_count: corePlaces.length,
      optional_flex_count: OPTIONAL_IDS.length,
      museum_like_core_count: 0,
      museum_like_core_percent: 0,
      museum_like_core_ids: [],
      core_food_nightlife_count: 0,
      core_escape_room_count: 0,
      paid_core_count: paidCore.length,
      free_or_donation_core_count: corePlaces.length - paidCore.length,
      route_dna: "evidence-in-the-dark",
      experience_buckets: Object.entries(bucketTally).map(([bucket, count]) => ({ bucket, count })),
      textures: Object.entries(textureTally).map(([texture, count]) => ({ texture, count })),
      design_rule: "History survives only when the site, landscape, machine or guided fieldwork changes the verb from look to enter, walk, illuminate, inspect or stand at the evidence.",
      mothman_cluster_accounting: "The statue and riverfront orientation is kept as a short scheduled card, while the museum context and TNT landscape are one guided field-tour activation. Do not inflate the cluster into four independent major experiences.",
      brief_reconciliation_note: "The source table lists 26 core cards but its category rows sum to 25. This package records the Point Pleasant orientation as its own folklore-orientation bucket and exposes the mismatch instead of hiding it."
    },
    days,
    place_ids: places.map((place) => place.id),
    core_place_ids: corePlaces.map((place) => place.id),
    alternative_place_ids: OPTIONAL_IDS,
    replacement_place_ids: [],
    replacement_options: [],
    budget: {
      free_route_baseline_per_person_usd: 0,
      selected_experience_total_status: "computed-from-user-toggles",
      do_everything_core_low_per_person_usd: lowCost,
      do_everything_core_high_per_person_usd: highCost,
      do_everything_core_low_group_usd: 519.8,
      do_everything_core_high_group_usd: 519.8,
      paid_core_count: paidCore.length,
      free_or_donation_core_count: corePlaces.length - paidCore.length,
      shopping_spend_excluded: true,
      food_nightlife_lodging_cars_fuel_excluded: true,
      optional_costs: [
        { place_id: "blennerhassett-candlelight", per_person_usd: 42 },
        { place_id: "mountwood-atv", per_person_usd: 12, note: "Vehicle or rental is not included." },
        { place_id: "tala-paranormal", per_person_usd: 40 },
        { place_id: "hundred-acres-manor", per_person_usd: 30, note: "Starting planning price." },
        { place_id: "imaginarium-minds-eye", group_usd: 195, note: "Approximate enthusiast-review planning price; confirm live checkout." }
      ],
      note: "Every paid core experience is optional. The ceiling excludes hotels, cars, fuel, tolls, ordinary parking, food, shopping and donations."
    },
    booking_priorities: BOOKING_PRIORITIES,
    operational_flags: {
      red: [
        "Mothman Oct. 10 guided TNT tour is published but currently marked unavailable.",
        "Old New-Gate public mine-tour timing must align with the Oct. 4 Logan arrival.",
        "Carrie, Martin, Vanka and Troy Hill require early booking action.",
        "Day 11 measures 300 baseline road minutes after the Dana finale; the rental return deadline is unresolved."
      ],
      yellow: [
        "Pike2Bike surface and trailhead conditions after storms.",
        "McClintic 2026 hunting-season and tick advisories.",
        "Coopers Rock main-overlook bridge status; the core uses Clay Furnace so it does not depend on reopening.",
        "Pocono Premium Outlets Oct. 12 holiday hours.",
        "Assumption Oct. 11 Divine Liturgy time.",
        "OSRM found longer totals than the prose brief on Days 2, 7, 9, 10 and 11; the UI shows measured road time and planned breaks."
      ],
      green: [
        "Pike2Bike to Quecreek corridor.",
        "Carrie, Troy Hill and Vanka as Pittsburgh's route identity.",
        "Pittsburgh to Moundsville to Parkersburg geometry.",
        "Point Pleasant on Saturday Oct. 10 and Weston after dark.",
        "Protected Sunday worship followed by forest and engineered geology.",
        "The Pocono shopping block and quiet Danbury reset."
      ]
    },
    validation: {
      date_count: days.length,
      expected_date_count: 11,
      all_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= TOTAL_CAP),
      all_uninterrupted_legs_at_or_below_cap: longestLeg <= UNINTERRUPTED_CAP,
      longest_uninterrupted_leg_minutes: longestLeg,
      live_traffic_gated_days: days.filter((day) => day.drive.planning_total_minutes.high > TOTAL_CAP).map((day) => day.day),
      long_total_driving_days: days.filter((day) => day.drive.baseline_total_minutes > 210).map((day) => day.day),
      place_count: places.length,
      core_place_count: corePlaces.length,
      optional_flex_count: OPTIONAL_IDS.length,
      scheduled_unique_place_count: scheduled.size,
      image_count: images.length,
      rights_gated_image_count: rightsGatedImages.length,
      contextual_only_place_ids: Object.keys(IMAGE_CONTEXT_SOURCE),
      places_with_fewer_than_3_usable_images: places.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      replacement_option_count: 0,
      all_replacement_variants_at_or_below_cap: true,
      unfilled_place_ratings: places.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "Mothman guided TNT inventory is unresolved.",
        "Day 11 rental return timing is unresolved.",
        "New-place images are explicitly contextual until exact licensed photography is acquired.",
        "OSRM contains no live traffic; Boston, I-84, I-78 and Pittsburgh remain departure-day gates."
      ],
      route_lock_status: "ui-ready-bookings-live-traffic-and-exact-images-pending",
      energy_rebuild_status: "canonical-and-rebuild-safe"
    }
  };

  const geojson = {
    type: "FeatureCollection",
    name: `${ROUTE_SLUG}-energy-v2`,
    features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({
        type: "Feature",
        id: leg.id,
        properties: { feature_kind: "drive_leg", route_id: ROUTE_ID, day: day.day, date: day.date, from: leg.from, to: leg.to, distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, traffic_risk: leg.traffic_risk, map_color: route.route.map_color, energy_rebuild: true },
        geometry: leg.geometry
      }))),
      ...places.map((place) => ({
        type: "Feature",
        id: place.id,
        properties: { feature_kind: "place", route_id: ROUTE_ID, place_id: place.id, name: place.name, city: place.city, state: place.state, visit_date: place.visit_date, priority: place.priority, included_in_magic_score: place.included_in_magic_score, experience_bucket: place.experience_bucket, energy_rebuild_role: place.energy_rebuild_role },
        geometry: { type: "Point", coordinates: place.coordinates }
      })),
      ...Object.entries(geometry.nodes).map(([nodeId, node]) => ({
        type: "Feature",
        id: `node-${nodeId}`,
        properties: { feature_kind: "route_node", route_id: ROUTE_ID, node_id: nodeId, name: node.name },
        geometry: { type: "Point", coordinates: node.coordinates }
      }))
    ]
  };

  const decisions = {
    schema_version: "1.0.0",
    route_id: ROUTE_ID,
    verified_at: VERIFIED_AT,
    generated_from: "Energy Rebuild Routes/Route06_Evidence_In_The_Dark_Rebuild_With_Costs.md",
    purpose: "Rebuild Route 06 around physical evidence, legal ruins, industrial scale, folklore fieldwork and October darkness.",
    route_dna: "EVIDENCE IN THE DARK",
    source_visible_original_ids: ORIGINAL_VISIBLE_IDS,
    source_visible_original_count: ORIGINAL_VISIBLE_IDS.length,
    archive_and_absorbed_dispositions: ARCHIVE_DISPOSITIONS,
    core_ids: CORE_IDS,
    optional_flex_ids: OPTIONAL_IDS,
    inventory_rule: "The public UI contains exactly 55 meaningful selectable experiences. Pure archive, food-only and additional-not-counted entries stay in this revision history rather than becoming rateable cards.",
    overnight_changes: "Pittsburgh is the Oct. 8 sleep, Parkersburg is the Oct. 9 sleep, Weston remains the Oct. 10 after-dark sleep, and the return runs through Everett, Tannersville, Danbury and Boston.",
    driving_reconciliation: "Fresh OSRM geometry contradicted four optimistic uninterrupted-drive bands in the brief. Planned rest or fuel nodes at Milford, Charleston, Mahwah and Sturbridge keep every uninterrupted baseline leg at or below 150 minutes without inventing extra attractions.",
    image_policy: "Existing Route 06 local images retain their recorded rights. New experiences temporarily reuse related local context images with explicit regional-context-not-exact-place coverage labels."
  };

  const replacementGeometry = { schema_version: "1.0.0", route_id: ROUTE_ID, generated_at: VERIFIED_AT, routing_engine: "none-required", traffic_included: false, variants: [] };
  const readme = `# Route 06 — Evidence in the Dark\n\nCanonical Energy Rebuild V2 for October 4-15, 2026.\n\n## Package summary\n\n- ${places.length} meaningful selectable experiences: ${corePlaces.length} active core and ${OPTIONAL_IDS.length} optional/flex\n- ${scheduled.size} uniquely scheduled core cards across 11 days\n- ${images.length} local image records; ${Object.keys(IMAGE_CONTEXT_SOURCE).length} new places are clearly labeled as contextual-image-only\n- ${baselineMiles.toFixed(1)} OSRM baseline miles\n- ${longestLeg} minutes for the longest uninterrupted baseline leg after planned rest splits\n- $${lowCost.toFixed(2)} known core ceiling per person / $519.80 for four\n- 0 passive museums, 0 core food/nightlife and 0 core escape rooms\n\n## Route identity\n\nPrison mine -> sacred stones -> guitar factory -> military environments -> black tunnel -> rescue capsule -> blast furnaces -> art house -> labor murals -> penitentiary -> river confluence -> Mothman fieldwork -> asylum by flashlight -> Orthodox Sunday -> iron-furnace forest -> engineered road cut -> giant rail bridge -> outlets -> quiet estate -> vanished town.\n\n## Road correction\n\nFresh OSRM measurement found four prose bands above the 150-minute uninterrupted rule. Milford, Charleston, Mahwah and Sturbridge are now explicit rest/fuel nodes. Day 11 still measures 300 baseline road minutes and remains red until the rental return deadline is reconciled.\n\n## UI contract\n\nEvery core place exposes cost, texture, traveler fit, booking risk, exact-date and weather flags, skip logic, sources, images and equal rating slots. Removed archive and food-only entries live in route-decisions.json rather than the public 55-card rating inventory.\n\nRebuild with \`node scripts/route-06/build.mjs\`, then validate with \`node scripts/validate-route-package.mjs ${ROUTE_SLUG}\`.\n`;

  const manifestRoute = manifest.routes.find((entry) => entry.id === ROUTE_ID);
  if (!manifestRoute) throw new Error("route-06 is missing from dataset/manifest.json");
  manifestRoute.name = route.route.name;
  manifestRoute.status = "energy-rebuild-ui-ready";
  manifestRoute.place_count = places.length;
  manifestRoute.image_count = images.length;
  manifestRoute.day_count = days.length;
  manifestRoute.baseline_miles = baselineMiles;

  await Promise.all([
    writeJson(path.join(routeDir, "places.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, places }),
    writeJson(path.join(routeDir, "images.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Existing rights metadata retained. New experiences use explicitly labeled contextual imagery until exact licensed assets are acquired.", images }),
    writeJson(path.join(routeDir, "sources.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: VERIFIED_AT, sources }),
    writeJson(path.join(routeDir, "route.json"), route),
    writeJson(path.join(routeDir, "route.geojson"), geojson),
    writeJson(path.join(routeDir, "replacement-geometry.json"), replacementGeometry),
    writeJson(path.join(routeDir, "route-decisions.json"), decisions),
    writeJson(path.join(routeDir, "place-seed.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, generated_from: "Energy Rebuild Routes/Route06_Evidence_In_The_Dark_Rebuild_With_Costs.md", places }),
    writeFile(path.join(routeDir, "README.md"), readme),
    writeJson(path.join(root, "dataset", "manifest.json"), manifest)
  ]);
  console.log(`Built Route 06 Energy V2: ${places.length} places, ${corePlaces.length} core, ${images.length} images, ${days.length} days, ${baselineMiles} miles.`);
  return { placeCount: places.length, imageCount: images.length, dayCount: days.length };
}
