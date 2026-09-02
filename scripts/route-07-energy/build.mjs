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

const ROUTE_ID = "route-07";
const ROUTE_SLUG = "route-07-kazoos-rock-mechanical-dreams-loop";
const TOTAL_CAP = 300;
const UNINTERRUPTED_CAP = 150;
const writeJson = (filePath, value) => writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);

function travelerFit(best, secondary) {
  return Object.fromEntries(PEOPLE.map((person) => [person, best.includes(person) ? 5 : secondary.includes(person) ? 4 : 3.5]));
}

function originalStatus(id, isCore) {
  if (!ORIGINAL_VISIBLE_IDS.includes(id)) return isCore ? "new-core" : "new-optional";
  return isCore ? "keep-core-or-rebuilt" : "keep-optional-or-flex";
}

function overrideObject(id) {
  const row = PLACE_OVERRIDES[id];
  if (!row) return {};
  const [name, kind, city, state, address, summary, why_go] = row;
  return { name, kind, city, state, address, summary, why_go };
}

function defaultCost() {
  return {
    amount_per_person: null,
    low: 0,
    high: 0,
    amount_per_group: null,
    price_type: "live-check",
    status: "unpriced-choice",
    note: "Activate this optional choice only after checking its current price."
  };
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
  if (!coordinate) throw new Error(`Route 07 V2 is missing coordinates for ${id}.`);
  const sourceIds = [...new Set([...(current?.source_ids || []), ...(config.sourceIds || [])])];
  const cost = isCore ? config.cost : config.cost || current?.cost || defaultCost();
  const skip = isCore ? config.skip : "Optional choice; activate it only when the group explicitly wants this variant.";
  const categories = isCore
    ? [
        config.bucket === "nature" ? "nature_photogenic" : "unusual_creative",
        ...(config.bucket === "adventure" ? ["athletic_adrenaline"] : []),
        ...(config.bucket === "sacred" ? ["orthodox_spiritual"] : []),
        ...(config.bucket === "shopping" ? ["food_coffee_shopping"] : []),
        ...(config.bucket === "music-sound" ? ["live_social_nightlife"] : [])
      ]
    : current?.categories || ["unusual_creative"];

  return {
    ...(current || {}),
    ...overrides,
    id,
    country: "US",
    visit_date: isCore ? config.date : config.date || current?.visit_date || null,
    best_for: best,
    secondary_for: secondary,
    best_fit_note: isCore ? `Primary fit: ${best.join(", ")}. ${skip}` : current?.best_fit_note || skip,
    categories: [...new Set(categories)],
    duration_minutes: isCore ? config.duration : current?.duration_minutes || 90,
    priority: isCore ? "anchor" : "optional",
    reservation: isCore ? config.reservation : current?.reservation || "check",
    hours: current?.hours || {
      opens: null,
      closes: null,
      status: "reconfirm-required",
      note: "Use the exact-date operating window in the Route 07 brief and reconfirm before booking."
    },
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
    museum_like: isCore ? config.museumLike : false,
    machine_state: flags.has("working_factory") || flags.has("working_infrastructure") ? "working" : flags.has("playable") ? "playable" : flags.has("adaptive_reuse") ? "adaptive-reuse" : "none",
    sound_state: flags.has("make_sound") ? "make_sound" : flags.has("hear_live") ? "hear_live" : flags.has("sound_history") ? "sound_history" : "none",
    industrial_access: flags.has("inside_industry") ? "inside_historic" : flags.has("working_factory") ? "inside_active" : flags.has("industrial_scale") ? "exterior" : "none",
    competition_mode: flags.has("team") ? "team" : flags.has("head_to_head") ? "head_to_head" : "none",
    maker_output: flags.has("you_make_it") ? (id === "hershey-candy-bar" ? "custom candy bar and wrapper" : id === "eden-kazoo" ? "custom kazoo when confirmed" : "hands-on creative output") : null,
    headlamp_required: flags.has("headlamp_required"),
    height_or_weight_gate: flags.has("height_or_weight_gate"),
    hearing_protection_recommended: flags.has("hearing_protection_recommended"),
    factory_day_required: flags.has("factory_day_required"),
    exact_event_date: flags.has("exact_event_date") ? config.date : null,
    lake_weather_gated: flags.has("lake_weather_gated"),
    route07_dna_strength: isCore ? (config.interaction >= 3 || ["working-industry", "music-sound"].includes(config.bucket) ? "high" : "supporting") : "optional",
    experience_flags: {
      playable: flags.has("playable"),
      you_make_it: flags.has("you_make_it"),
      head_to_head: flags.has("head_to_head"),
      team: flags.has("team"),
      inside_industry: flags.has("inside_industry"),
      working_factory: flags.has("working_factory"),
      working_infrastructure: flags.has("working_infrastructure"),
      exact_event_date: flags.has("exact_event_date"),
      headlamp_required: flags.has("headlamp_required"),
      weather_gated: flags.has("weather_gated"),
      lake_weather_gated: flags.has("lake_weather_gated"),
      shopping_spend_excluded: flags.has("shopping_spend_excluded"),
      orthodox_sunday: flags.has("orthodox_sunday"),
      height_or_weight_gate: flags.has("height_or_weight_gate"),
      hearing_protection_recommended: flags.has("hearing_protection_recommended"),
      adjacent_puzzle_mission: flags.has("adjacent_puzzle_mission"),
      traditional_escape_room: !isCore && ["escape-city-hangover", "perplexity-eliot-ness", "perplexity-clockwork-caper"].includes(id),
      caution: Boolean(config.caution),
      partial_participation_easy: flags.has("partial_participation_easy")
    },
    viki_fit: fit.viki,
    gora_fit: fit.gora,
    stivka_fit: fit.stivka,
    planner_balance_fit: fit.sheluvspaco,
    price_status: cost.status,
    price_type: cost.price_type,
    price_per_person_low: cost.low ?? cost.amount_per_person ?? 0,
    price_per_person_high: cost.high ?? cost.amount_per_person ?? 0,
    price_per_group: cost.amount_per_group ?? null,
    price_last_checked: VERIFIED_AT,
    shopping_spend_excluded: flags.has("shopping_spend_excluded"),
    included_in_selected_total: false,
    physical_level: flags.has("headlamp_required") || config.interaction >= 4 ? "moderate-high" : config.interaction >= 3 ? "light-moderate" : "easy",
    skip_mode: skip,
    skip_strategy: skip,
    optional: true,
    booking_required: ["required", "strongly-recommended"].includes(isCore ? config.reservation : current?.reservation),
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
  if (!place) throw new Error(`Route 07 V2 schedule references missing place ${placeId}.`);
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

export async function buildEnergyRoute07({ root, routeDir }) {
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
  if (new Set(finalIds).size !== 52) throw new Error(`Route 07 V2 inventory must contain 52 unique places; found ${new Set(finalIds).size}.`);
  const places = finalIds.map((id) => buildPlace(currentPlaceById.get(id), id));
  const placeById = new Map(places.map((place) => [place.id, place]));

  const currentImagesByPlace = new Map();
  for (const image of currentImagesPackage.images) {
    currentImagesByPlace.set(image.place_id, [...(currentImagesByPlace.get(image.place_id) || []), image]);
  }
  const contextualIdSet = new Set(Object.keys(IMAGE_CONTEXT_SOURCE));
  const images = currentImagesPackage.images.filter((image) => placeById.has(image.place_id) && !contextualIdSet.has(image.place_id));
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
  for (const sourceId of usedSourceIds) if (!sourceById.has(sourceId)) throw new Error(`Unknown Route 07 V2 source ${sourceId}.`);

  const weatherByDay = new Map(weather.days.map((day) => [day.day, day]));
  const geometryByDay = new Map(geometry.days.map((day) => [day.day, day]));
  const days = DAY_PLANS.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    if (!routed || !normal) throw new Error(`Route 07 V2 day ${plan.day} is missing geometry or climate data.`);
    const displayLegs = routed.legs.map((leg) => leg.counts_toward_drive_cap === false
      ? { ...leg, baseline_minutes: leg.display_duration_minutes }
      : leg);
    const longestLeg = Math.max(0, ...displayLegs.filter((leg) => leg.counts_toward_drive_cap !== false).map((leg) => leg.baseline_minutes));
    const capStatus = longestLeg > UNINTERRUPTED_CAP
      ? "over-uninterrupted-cap"
      : routed.baseline_total_minutes > TOTAL_CAP
        ? "over-total-cap"
        : routed.planning_total_minutes.high > 210
          ? "live-traffic-gated"
          : "comfortable";
    return {
      day: plan.day,
      date: plan.date,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(new Date(`${plan.date}T12:00:00-04:00`)),
      sleep_city: plan.sleep_city,
      theme: plan.theme,
      notes: ["OSRM is a frozen road-network baseline with no live traffic."],
      lodging: {
        preferred_area: plan.lodging[0],
        fallback_area: plan.lodging[1],
        room_setup: "Two rooms: one 1-bed room and one 2-bed room",
        notes: "Strong suggestion only; verify safety, cleanliness, exact beds, late check-in and secure two-car parking."
      },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      drive: {
        legs: displayLegs,
        baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes,
        planning_total_minutes: routed.planning_total_minutes,
        non_driving_travel_minutes: routed.non_driving_travel_minutes || 0,
        traffic_risk: routed.risk,
        cap_minutes: TOTAL_CAP,
        max_uninterrupted_minutes: longestLeg,
        uninterrupted_cap_minutes: UNINTERRUPTED_CAP,
        cap_status: capStatus,
        fallback: plan.fallback,
        traffic_note: "OSRM has no live traffic. If a segment reaches roughly 135 minutes before departure, surface the nearest flex or tactical break rather than accepting a three-hour sit."
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
        note: "Climate normal, not a 2026 forecast. Great Lakes, tunnel, waterfall and industrial conditions require live checks."
      }
    };
  });

  const corePlaces = places.filter((place) => place.included_in_magic_score);
  const knownLowCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_low, 0) * 100) / 100;
  const knownHighCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_high, 0) * 100) / 100;
  const baselineMiles = Math.round(days.reduce((sum, day) => sum + day.drive.baseline_total_miles, 0) * 10) / 10;
  const scheduled = new Set(days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  const longestLeg = Math.max(...days.map((day) => day.drive.max_uninterrupted_minutes));
  const paidCore = corePlaces.filter((place) => place.price_status !== "free");
  const rightsGatedImages = images.filter((image) => image.production_usable === false);
  const museumLikeCore = corePlaces.filter((place) => place.museum_like);
  if (corePlaces.length !== 25 || OPTIONAL_IDS.length !== 27) throw new Error(`Route 07 V2 balance is ${corePlaces.length} core / ${OPTIONAL_IDS.length} optional.`);
  if (knownLowCost !== 308.95 || knownHighCost !== 308.95) throw new Error(`Route 07 V2 known-price subtotal must be $308.95; calculated $${knownLowCost}–$${knownHighCost}.`);
  if (paidCore.length !== 13) throw new Error(`Route 07 V2 must expose 13 ticketed core experiences; found ${paidCore.length}.`);
  for (const id of CORE_IDS) if (!scheduled.has(id)) throw new Error(`Core place ${id} is not scheduled.`);

  const bucketTally = corePlaces.reduce((tally, place) => ({ ...tally, [place.experience_bucket]: (tally[place.experience_bucket] || 0) + 1 }), {});
  const textureTally = corePlaces.reduce((tally, place) => ({ ...tally, [place.texture]: (tally[place.texture] || 0) + 1 }), {});
  const averageInteraction = Math.round((corePlaces.reduce((sum, place) => sum + place.interaction_score, 0) / corePlaces.length) * 100) / 100;
  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID,
      slug: "kazoos-rock-mechanical-dreams-loop",
      name: "Kazoos, Rock & Mechanical Dreams — Industrial Playground",
      short_name: "Inside the Playable Machine",
      status: "energy-rebuild-ui-ready",
      map_color: manifest.routes.find((entry) => entry.id === ROUTE_ID)?.map_color || "#F97316",
      timezone: "America/New_York",
      start_date: "2026-10-04",
      end_date: "2026-10-14",
      airport_date: "2026-10-15",
      origin: { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
      destination: { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
      endpoint_city: "Cleveland, OH",
      direction: "Boston to Springfield, Troy, Syracuse, Rochester, Eden, Buffalo, Erie and Cleveland; return through Pittsburgh, Breezewood, Hershey, Nazareth, the Poconos, Danbury and Sturbridge",
      countries: ["US"],
      canada_included: false,
      total_nights: 11,
      road_nights: 10,
      final_boston_nights: 1,
      baseline_total_miles: baselineMiles,
      energy_rebuild_version: "2.0.0",
      energy_rebuild_verified_at: VERIFIED_AT,
      route_dna: "INDUSTRIAL PLAYGROUND — SOUND, MOTION & MACHINES YOU CAN USE",
      summary: "A hands-on loop where the Northeast's industrial shell becomes a playable machine: shoot on Center Court, watch a canal lock work, solve automated rooms, make sound, race between grain silos, ride through a former factory, spray paint blast furnaces, enter a black turnpike tunnel, pull a candy-line lever, watch guitars being built and finish with team racing in Boston."
    },
    constraints: {
      travelers: 4,
      cars: 2,
      cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 210],
      daily_drive_hard_cap_minutes: TOTAL_CAP,
      max_uninterrupted_drive_minutes: UNINTERRUPTED_CAP,
      route_specific_drive_rule: "No planned uninterrupted OSRM baseline leg exceeds 150 minutes. Recheck live ETAs and surface a flex or tactical break around 135 minutes.",
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only route with no border crossing.",
      budget_target_per_person_usd: 1500,
      budget_excludes: ["lodging", "rental cars", "fuel", "tolls", "ordinary parking", "food", "nightlife beyond Sugar", "shopping purchases"]
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
      magic_score_status: "awaiting_traveler_ratings",
      person_specific_route_scores: Object.fromEntries(PEOPLE.map((person) => [person, null]))
    },
    experience_model: {
      meaningful_selectable_inventory_count: places.length,
      core_experience_count: corePlaces.length,
      optional_flex_count: OPTIONAL_IDS.length,
      museum_like_core_count: museumLikeCore.length,
      museum_like_core_percent: Math.round((museumLikeCore.length / corePlaces.length) * 100),
      museum_like_core_ids: museumLikeCore.map((place) => place.id),
      core_food_nightlife_count: 1,
      core_exact_event_count: 2,
      core_traditional_escape_room_count: 0,
      core_adjacent_puzzle_mission_count: 1,
      optional_traditional_escape_room_count: 3,
      paid_core_count: paidCore.length,
      free_core_count: corePlaces.length - paidCore.length,
      average_core_interaction_score: averageInteraction,
      route_dna: "industrial-playground-sound-motion-machines",
      experience_buckets: Object.entries(bucketTally).map(([bucket, count]) => ({ bucket, count })),
      textures: Object.entries(textureTally).map(([texture, count]) => ({ texture, count })),
      design_rule: "Every core attraction must change the group's verb from look to play, make, race, enter, worship, move, solve, hear or physically read a working landscape."
    },
    days,
    place_ids: places.map((place) => place.id),
    core_place_ids: corePlaces.map((place) => place.id),
    alternative_place_ids: OPTIONAL_IDS,
    replacement_place_ids: [],
    replacement_options: [],
    budget: {
      selected_experience_total_status: "computed-from-user-toggles",
      verified_known_price_subtotal_per_person_usd: knownLowCost,
      verified_known_price_subtotal_group_usd: Math.round(knownLowCost * 400) / 100,
      provisional_all_core_planning_envelope_per_person_usd: [450, 550],
      dynamic_or_unpublished_core_ids: corePlaces.filter((place) => ["dynamic", "unpublished"].includes(place.price_status)).map((place) => place.id),
      partially_unpublished_core_ids: ["eden-kazoo"],
      paid_core_count: paidCore.length,
      free_core_count: corePlaces.length - paidCore.length,
      shopping_spend_excluded: true,
      food_lodging_cars_fuel_tolls_excluded: true,
      note: "The $308.95 subtotal excludes 5 Wits, the kazoo make-your-own add-on, Sugar, F1 Team Racing, taxes and fees. The $450–$550 envelope is planning guidance, not a vendor-quoted ticket total."
    },
    booking_priorities: BOOKING_PRIORITIES,
    operational_flags: {
      red: [
        "Buffalo RiverWorks exact Oct. 8 racing-zipline inventory is not yet exposed.",
        "American Kazoo factory operation and make-your-own access require direct confirmation.",
        "Sugar's official ticket checkout and final price remain unresolved.",
        "F1 Team Racing must be booked around the actual two-car return deadline.",
        "Carrie Hands-On Graffiti is an exact-date, 15-person event and must be locked first."
      ],
      yellow: [
        "5 Wits package price, The Strong Oct. 7 ticket, Ray's rentals, Hershey holiday inventory and Martin tour slot.",
        "Old PA Pike and Raymondskill conditions after rain.",
        "Buffalo, Erie and Cleveland wind, lightning and Great Lakes weather.",
        "OSRM is not live traffic; Boston, Pittsburgh, I-84 and the turnpike remain departure-day gates."
      ],
      green: [
        "Lock E20 cleanly splits Troy to Syracuse.",
        "Rochester, Batavia, Eden, Buffalo and Erie form a coherent westbound machine corridor.",
        "Pittsburgh replaces Canonsburg and Breezewood replaces McConnellsburg for better Sunday and tunnel geometry.",
        "Hershey breaks central Pennsylvania and Nazareth protects the Tuesday Martin tour.",
        "Raymondskill and Sturbridge break the final return corridor."
      ]
    },
    validation: {
      date_count: days.length,
      expected_date_count: 11,
      all_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= TOTAL_CAP),
      all_uninterrupted_legs_at_or_below_cap: longestLeg <= UNINTERRUPTED_CAP,
      longest_uninterrupted_leg_minutes: longestLeg,
      live_traffic_gated_days: days.filter((day) => day.drive.planning_total_minutes.high > 210).map((day) => day.day),
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
        "Exact RiverWorks zipline inventory is unresolved.",
        "Kazoo factory and make-your-own operation require a direct call.",
        "Sugar and F1 live checkout prices are unresolved.",
        "New-place images are explicitly contextual until exact licensed photography is acquired.",
        "OSRM contains no live traffic."
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
        properties: { feature_kind: "drive_leg", route_id: ROUTE_ID, day: day.day, date: day.date, from: leg.from, to: leg.to, mode: leg.mode, distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, traffic_risk: leg.traffic_risk, map_color: route.route.map_color, energy_rebuild: true },
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
    generated_from: "Energy Rebuild Routes/Route07_Energy_Rebuild_With_Costs.md",
    purpose: "Rebuild Route 07 as a hands-on industrial playground built from sound, motion and machines the group can use.",
    route_dna: "INDUSTRIAL PLAYGROUND — SOUND, MOTION & MACHINES YOU CAN USE",
    source_visible_original_ids: ORIGINAL_VISIBLE_IDS,
    source_visible_original_count: ORIGINAL_VISIBLE_IDS.length,
    archive_and_absorbed_dispositions: ARCHIVE_DISPOSITIONS,
    core_ids: CORE_IDS,
    optional_flex_ids: OPTIONAL_IDS,
    inventory_rule: "The UI contains exactly 52 meaningful selectable experiences: 25 scheduled core cards and 27 unscheduled optional/flex cards. Food-only, nightlife-only and archive entries stay in revision history.",
    overnight_changes: "Pittsburgh replaces Canonsburg, Breezewood replaces McConnellsburg, and Nazareth/Bethlehem replaces Allentown so Sunday worship, Carrie, the Old PA Pike and Martin Guitar fit their real operating windows.",
    price_policy: "Dynamic or unpublished 5 Wits, Sugar and F1 prices remain Verify states. The $450–$550 envelope is not stored as a quoted ticket ceiling.",
    image_policy: "Existing Route 07 local images retain recorded rights metadata. New experiences use clearly labeled regional-context images until exact licensed photography is acquired."
  };

  const replacementGeometry = { schema_version: "1.0.0", route_id: ROUTE_ID, generated_at: VERIFIED_AT, routing_engine: "none-required", traffic_included: false, variants: [] };
  const readme = `# Route 07 — Inside the Playable Machine\n\nCanonical Energy Rebuild V2 for October 4–15, 2026.\n\n## Package summary\n\n- ${places.length} meaningful selectable experiences: ${corePlaces.length} active core and ${OPTIONAL_IDS.length} optional/flex\n- ${scheduled.size} uniquely scheduled core cards across 11 days\n- ${images.length} local image records; ${Object.keys(IMAGE_CONTEXT_SOURCE).length} new places are clearly labeled contextual-image-only\n- ${baselineMiles.toFixed(1)} OSRM baseline driving miles\n- ${longestLeg} minutes for the longest uninterrupted baseline driving leg\n- $${knownLowCost.toFixed(2)} verified known-price subtotal per person; dynamic and unpublished items remain excluded\n- ${paidCore.length} ticketed core experiences, ${corePlaces.length - paidCore.length} free core experiences\n- ${museumLikeCore.length} passive museum-like core card, 0 traditional escape rooms in core\n\n## Route identity\n\nShoot → watch the lock turn → solve → play → make → zipline → coast → plug in → play pinball → hear Sugar live → ride an old factory → worship → spray paint steel ruins → enter the dark tunnel → pull the candy-line lever → watch guitars being built → shop → hike → race.\n\n## UI contract\n\nEvery core card exposes price status, texture, traveler fit, interaction score, booking risk, exact-date and weather flags, skip logic, sources, images and four equal rating slots. The 27 additional cards are real choices, never hidden extra scheduled stops.\n\nRebuild with \`node scripts/route-07/build.mjs\`, then validate with \`node scripts/validate-route-package.mjs ${ROUTE_SLUG}\`.\n`;

  const manifestRoute = manifest.routes.find((entry) => entry.id === ROUTE_ID);
  if (!manifestRoute) throw new Error("route-07 is missing from dataset/manifest.json");
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
    writeJson(path.join(routeDir, "place-seed.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, generated_from: "Energy Rebuild Routes/Route07_Energy_Rebuild_With_Costs.md", places }),
    writeFile(path.join(routeDir, "README.md"), readme),
    writeJson(path.join(root, "dataset", "manifest.json"), manifest)
  ]);
  console.log(`Built Route 07 Energy V2: ${places.length} places, ${corePlaces.length} core, ${images.length} images, ${days.length} days, ${baselineMiles} miles.`);
  return { placeCount: places.length, imageCount: images.length, dayCount: days.length };
}
