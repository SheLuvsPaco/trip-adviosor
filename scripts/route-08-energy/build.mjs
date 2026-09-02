import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { contextualImagePlaces, manualCoordinates } from "../route-08/config.mjs";
import {
  ARCHIVE_IDS,
  BOOKING_PRIORITIES,
  CORE_CONFIG,
  CORE_IDS,
  DAY_PLANS,
  FLEX_IDS,
  LEGACY_ALTERNATIVE_IDS,
  NEW_CORE_IDS,
  NEW_OPTIONAL_IDS,
  NEW_SOURCES,
  NON_CORE_DAY_DATES,
  OPTIONAL_SOURCE_IDS,
  OPTIONAL_IDS,
  ORIGINAL_IDS,
  PEOPLE,
  PLACE_OVERRIDES,
  SOCIAL_IDS,
  VERIFIED_AT
} from "./data.mjs";

const ROUTE_ID = "route-08";
const ROUTE_SLUG = "route-08-lemurs-stone-bridges-mechanical-dreams-loop";
const TOTAL_CAP = 270;
const UNINTERRUPTED_CAP = 150;
const writeJson = (filePath, value) => writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);

// Day 7 is the brief's deliberate signature day: five stops from Roanoke to Richmond by way of
// Stuart, Durham and Petersburg. Every drive is capped by a real stop, but the total is far above
// the standard cap and is authorised explicitly rather than hidden.
const CAP_EXCEPTIONS = {
  7: {
    minutes: 430,
    reason: "Roanoke to Fairy Stone to Durham to Petersburg to Richmond is the brief's signature day. The measured total is above the 270-minute standard cap, but no single leg exceeds 150 minutes because each drive is capped by a real stop and a documented South Hill, VA comfort break splits the Durham-to-Petersburg run. The day runs roughly 07:00 to 21:30 with about 100 minutes of midday slack."
  }
};

function travelerFit(best, secondary) {
  return Object.fromEntries(PEOPLE.map((person) => [person, best.includes(person) ? 5 : secondary.includes(person) ? 4 : 3.5]));
}

function originalStatus(id) {
  const isOriginal = ORIGINAL_IDS.includes(id);
  if (CORE_IDS.includes(id)) return isOriginal ? "keep-core" : "new-core";
  if (SOCIAL_IDS.has(id)) return "keep-optional-social";
  if (OPTIONAL_IDS.has(id)) return isOriginal ? "keep-optional" : "new-optional";
  if (FLEX_IDS.has(id)) return "demote-flex";
  if (ARCHIVE_IDS.has(id)) return "remove-archive";
  return "documented-alternative";
}

function overrideObject(id) {
  const row = PLACE_OVERRIDES[id];
  if (!row) return {};
  const [name, kind, city, state, address, summary, why_go] = row;
  return { name, kind, city, state, address, summary, why_go };
}

function enrichCore(base, id) {
  const config = CORE_CONFIG[id];
  const { best, secondary } = config;
  const fit = travelerFit(best, secondary);
  const current = base || {};
  const skip = config.skip || "Low physical demand; no skip path is required.";
  return {
    ...current,
    ...overrideObject(id),
    id,
    country: "US",
    visit_date: config.date,
    best_for: best,
    secondary_for: secondary,
    best_fit_note: `Primary fit: ${best.join(", ")}. ${skip}`,
    categories: current.categories || ["unusual_creative"],
    duration_minutes: current.duration_minutes || 90,
    priority: "anchor",
    reservation: config.reservation || "none",
    hours: current.hours || { opens: null, closes: null, status: "reconfirm-required", note: "Use the scheduled route window; reconfirm operator inventory before booking." },
    cost: config.cost,
    source_ids: [...new Set([...(current.source_ids || []), ...(config.sourceIds || [])])],
    coordinates: manualCoordinates[id] || current.coordinates,
    coordinate_order: "longitude_latitude",
    coordinate_source: "manual_verified_address",
    ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 },
    researcher_person_fit: fit,
    included_in_magic_score: true,
    included_in_magic_default: true,
    core_status: "core",
    original_status: originalStatus(id),
    energy_rebuild_role: "active-core",
    experience_bucket: config.bucket,
    texture: config.texture,
    interaction_score: config.interaction,
    museum_like: Boolean(config.museumLike),
    experience_flags: {
      museum_like: Boolean(config.museumLike),
      weather_gated: Boolean(config.weather),
      wet_surface_risk: Boolean(config.wetSurface),
      booking_required: config.reservation === "required",
      booking_conflict: Boolean(config.bookingConflict),
      traffic_gated: false,
      high_physicality: Boolean(config.highPhysicality),
      partial_participation_possible: Boolean(config.skip),
      rare_animal: Boolean(config.rareAnimal),
      hands_on_making: Boolean(config.handsOn),
      traditional_escape_room: Boolean(config.escapeRoom),
      photo_heavy: ["WILD", "EXPLORE", "WEIRD", "AWE"].includes(config.texture)
    },
    viki_fit: fit.viki,
    gora_fit: fit.gora,
    stivka_fit: fit.stivka,
    planner_balance_fit: fit.sheluvspaco,
    price_type: config.cost.price_type,
    price_per_person_low: config.cost.low,
    price_per_person_high: config.cost.high,
    price_per_group: config.cost.amount_per_group,
    price_last_checked: VERIFIED_AT,
    physical_level: config.highPhysicality ? "moderate-high" : config.interaction >= 3 ? "light-moderate" : "easy",
    skip_mode: skip,
    skip_strategy: skip,
    optional: true,
    included_in_daily_max_total: true,
    source_confidence: "primary-source-verified",
    operational_confidence: config.risk,
    operational_risk: config.risk,
    fallback_ids: config.fallback ? [config.fallback] : [],
    fallback_place_id: config.fallback || null,
    data_status: "complete"
  };
}

function enrichNonCore(base, id) {
  const current = base || {};
  const status = SOCIAL_IDS.has(id)
    ? "optional-social"
    : OPTIONAL_IDS.has(id)
      ? "optional"
      : FLEX_IDS.has(id)
        ? "flex"
        : ARCHIVE_IDS.has(id)
          ? "archive"
          : "alternative";
  const isNew = NEW_OPTIONAL_IDS.includes(id);
  const best = current.best_for?.length ? current.best_for : ["sheluvspaco"];
  const secondary = current.secondary_for?.length ? current.secondary_for : PEOPLE.filter((person) => !best.includes(person));
  const skip = "Optional choice outside the frozen driving baseline; activate it only when the live ETA, opening window and group energy still work.";
  return {
    ...current,
    ...overrideObject(id),
    id,
    country: "US",
    // Dating every non-core place to a real day is what lets the app surface it in that day's picker.
    visit_date: NON_CORE_DAY_DATES[id] || current.visit_date || null,
    best_for: best,
    secondary_for: secondary,
    best_fit_note: current.best_fit_note || `Primary fit: ${best.join(", ")}. ${skip}`,
    coordinates: manualCoordinates[id] || current.coordinates,
    coordinate_order: "longitude_latitude",
    cost: current.cost || { amount_per_person: null, low: 0, high: 0, amount_per_group: null, price_type: "live-check", status: "unpriced-choice", note: "Check the current price before activating this option." },
    price_per_person_low: current.price_per_person_low ?? current.cost?.low ?? 0,
    price_per_person_high: current.price_per_person_high ?? current.cost?.high ?? 0,
    source_ids: [...new Set([...(current.source_ids || []), ...(isNew ? OPTIONAL_SOURCE_IDS[id] || [] : [])])],
    priority: status,
    included_in_magic_score: false,
    included_in_magic_default: false,
    core_status: status,
    original_status: originalStatus(id),
    energy_rebuild_role: status === "archive" ? "preserved-revision-history" : "documented-alternative",
    replacement: undefined,
    optional: true,
    included_in_daily_max_total: false,
    skip_mode: current.skip_mode || skip,
    skip_strategy: current.skip_strategy || skip,
    operational_risk: current.operational_risk || "reconfirm-if-activated",
    operational_confidence: current.operational_confidence || "reconfirm-if-activated",
    ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 }
  };
}

function scheduleItem([start, end, placeId, priority], placeById) {
  const place = placeById.get(placeId);
  if (!place) throw new Error(`Missing Route 08 V2 place: ${placeId}`);
  return { start, end, place_id: placeId, priority, reservation: place.reservation };
}

function imageRecord(placeId, image, index) {
  const commons = image.production_usable === true;
  return {
    id: `img-${placeId}-${index + 1}`,
    place_id: placeId,
    title: image.title,
    description: image.description,
    search_query: image.search_query,
    local_path: image.local_path,
    source_page: image.source_page,
    source_file_url: image.original_url,
    creator: image.creator || image.credit || "Source publisher",
    credit: image.credit || image.creator || "Source publisher",
    license: image.license,
    license_url: image.license_url || image.source_page,
    alt: image.description || `${placeId.replaceAll("-", " ")} photograph`,
    coverage: image.coverage || (contextualImagePlaces.has(placeId) ? "exact-place-or-experience-context" : "exact-place-or-experience"),
    production_usable: commons,
    rights_status: commons ? "commons-license-recorded" : "permission-required-before-public-deployment",
    visual_review: "reviewed"
  };
}

function comfortScore(normal) {
  const temperaturePenalty = Math.abs(normal.normal_high_c - 21) / 4;
  const rainPenalty = normal.measurable_precipitation_probability_percent / 25;
  return Math.round(Math.max(1, Math.min(5, 5 - temperaturePenalty - rainPenalty)) * 10) / 10;
}

export async function buildEnergyRoute08({ root, routeDir }) {
  const [currentPlacesPackage, currentImagesPackage, currentSourcesPackage, research, weather, geometry, manifest] = await Promise.all([
    readFile(path.join(routeDir, "places.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "images.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "sources.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "research-raw.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "weather-normals.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "route-geometry.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "dataset", "manifest.json"), "utf8").then(JSON.parse)
  ]);

  const currentPlaceById = new Map(currentPlacesPackage.places.map((place) => [place.id, place]));
  const keepIds = [...ORIGINAL_IDS, ...LEGACY_ALTERNATIVE_IDS, ...NEW_CORE_IDS, ...NEW_OPTIONAL_IDS];
  const places = keepIds.map((id) => (CORE_IDS.includes(id) ? enrichCore(currentPlaceById.get(id), id) : enrichNonCore(currentPlaceById.get(id), id)));
  const placeById = new Map(places.map((place) => [place.id, place]));
  for (const id of CORE_IDS) {
    if (!placeById.has(id)) throw new Error(`Route 08 V2 core place is missing: ${id}`);
    if (!placeById.get(id).coordinates) throw new Error(`Route 08 V2 core place has no coordinates: ${id}`);
  }

  const newIds = new Set([...NEW_CORE_IDS, ...NEW_OPTIONAL_IDS]);
  const existingImages = currentImagesPackage.images.filter((image) => !newIds.has(image.place_id) && placeById.has(image.place_id));
  const newImages = [...newIds].flatMap((placeId) => {
    const selected = research.places[placeId]?.selected_images || [];
    if (selected.length < 3) throw new Error(`${placeId} has ${selected.length}/3 Route 08 V2 images.`);
    return selected.slice(0, 3).map((image, index) => imageRecord(placeId, image, index));
  });
  const images = [...existingImages, ...newImages];
  const imageIdsByPlace = new Map();
  for (const image of images) imageIdsByPlace.set(image.place_id, [...(imageIdsByPlace.get(image.place_id) || []), image.id]);
  for (const place of places) {
    place.image_ids = imageIdsByPlace.get(place.id) || [];
    place.data_status = place.image_ids.length >= 3 ? place.data_status || "complete" : "image-gap";
  }

  const sourceById = new Map(currentSourcesPackage.sources.map((source) => [source.id, source]));
  for (const source of NEW_SOURCES) sourceById.set(source.id, source);
  // A previous build could have written source ids that no longer exist; prune rather than inherit.
  for (const place of places) place.source_ids = (place.source_ids || []).filter((id) => sourceById.has(id));
  const usedSourceIds = new Set(places.flatMap((place) => place.source_ids));
  const sources = [...sourceById.values()].filter((source) => usedSourceIds.has(source.id));

  const weatherByDay = new Map(weather.days.map((day) => [day.day, day]));
  const geometryByDay = new Map(geometry.days.map((day) => [day.day, day]));

  const days = DAY_PLANS.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    if (!routed) throw new Error(`Day ${plan.day} has no measured geometry.`);
    if (!normal) throw new Error(`Day ${plan.day} has no weather normal.`);
    const longestLeg = Math.max(0, ...routed.legs.map((leg) => leg.baseline_minutes));
    const exception = CAP_EXCEPTIONS[plan.day];
    const capStatus = longestLeg > UNINTERRUPTED_CAP
      ? "over-uninterrupted-cap"
      : exception
        ? "authorised-long-total-day"
        : routed.baseline_total_minutes > TOTAL_CAP
          ? "over-total-cap"
          : routed.baseline_total_minutes > 210
            ? "long-total-day"
            : routed.planning_total_minutes.high > 210
              ? "live-traffic-gated"
              : "comfortable";
    return {
      day: plan.day,
      date: plan.date,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(new Date(`${plan.date}T12:00:00-04:00`)),
      sleep_city: plan.sleep_city,
      theme: plan.theme,
      notes: plan.notes,
      lodging: { preferred_area: plan.lodging[0], fallback_area: plan.lodging[1], room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Strong suggestion only; prioritize safety, cleanliness, secure two-car parking and the exact bed layout." },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      drive: {
        legs: routed.legs,
        baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes,
        planning_total_minutes: routed.planning_total_minutes,
        traffic_risk: routed.risk,
        cap_minutes: TOTAL_CAP,
        authorized_cap_exception_minutes: exception?.minutes,
        cap_exception_reason: exception?.reason,
        max_uninterrupted_minutes: longestLeg,
        uninterrupted_cap_minutes: UNINTERRUPTED_CAP,
        cap_status: capStatus,
        fallback: plan.fallback
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
        note: "Climate normal, not a 2026 forecast. Wet greenstone and wet quartzite materially change risk on Days 5 and 6; neither the climb nor the boulder scramble should be forced."
      }
    };
  });

  const corePlaces = places.filter((place) => place.included_in_magic_score);
  const lowCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_low, 0) * 100) / 100;
  const highCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_high, 0) * 100) / 100;
  const baselineMiles = Math.round(days.reduce((sum, day) => sum + day.drive.baseline_total_miles, 0) * 10) / 10;
  const scheduled = new Set(days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  const longestLeg = Math.max(...days.map((day) => day.drive.max_uninterrupted_minutes));
  const museumLikeCore = corePlaces.filter((place) => place.museum_like);
  const paidCore = corePlaces.filter((place) => place.price_per_person_low > 0);
  const legacyAlternates = new Set(LEGACY_ALTERNATIVE_IDS);
  const selectable = places.filter((place) => !ARCHIVE_IDS.has(place.id) && !SOCIAL_IDS.has(place.id) && !legacyAlternates.has(place.id));
  const rightsGated = images.filter((image) => image.production_usable === false);

  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID,
      slug: "lemurs-stone-bridges-mechanical-dreams-loop",
      name: "The Lemurs, Living Stone & Strange Worlds Loop",
      short_name: "Lemurs & Living Stone",
      status: "energy-rebuild-ui-ready",
      map_color: manifest.routes.find((entry) => entry.id === ROUTE_ID)?.map_color || "#B5651D",
      timezone: "America/New_York",
      start_date: "2026-10-04",
      end_date: "2026-10-14",
      airport_date: "2026-10-15",
      origin: { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
      destination: { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
      endpoint_city: "Durham, NC",
      direction: "Boston through the Connecticut traprock and the Delaware Water Gap to Reading and Lancaster, south through Frederick and the Shenandoah to Roanoke and Durham, then north through Petersburg, Richmond, Annapolis and Delaware Bay to North Jersey and home",
      countries: ["US"],
      canada_included: false,
      total_nights: 11,
      road_nights: 10,
      final_boston_nights: 1,
      baseline_total_miles: baselineMiles,
      energy_rebuild_version: "2.0.0",
      energy_rebuild_verified_at: VERIFIED_AT,
      route_dna: "RARE LIFE × LIVING STONE × STRANGE WORLDS",
      summary: "Rare life, living stone and strange worlds: a basalt ridge, a hand-cut river tunnel, the Kittatinny ridge above the Water Gap, molten glass made by hand, an elite puzzle manor, a research arboretum, greenstone climbing, a 200-foot limestone arch, a quartzite boulder field, a staurolite crystal hunt, aye-ayes at the Duke Lemur Center, the Pocahontas Island freedom landscape, theatrical mini-golf, Orthodox Sunday, urban Class IV whitewater, an Atlantic Flyway marsh, indoor real snow and a Jurassic footprint you cast yourself."
    },
    constraints: {
      travelers: 4,
      cars: 2,
      cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 210],
      daily_drive_hard_cap_minutes: TOTAL_CAP,
      max_uninterrupted_drive_minutes: UNINTERRUPTED_CAP,
      route_specific_drive_rule: "No planned uninterrupted run exceeds roughly 2.5 hours. Day 7 carries an explicit authorised total-driving exception because every one of its long legs is capped by a real stop.",
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only route with no border crossing.",
      budget_excludes: ["lodging", "rental cars", "fuel", "tolls", "ordinary city parking and transit", "food", "nightlife", "shopping purchases", "optional casting materials at Dinosaur State Park"]
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
      core_experience_count: corePlaces.length,
      museum_like_core_count: museumLikeCore.length,
      museum_like_core_percent: Math.round((museumLikeCore.length / corePlaces.length) * 10000) / 100,
      museum_like_core_ids: museumLikeCore.map((place) => place.id),
      strict_passive_museum_core_count: 0,
      core_food_nightlife_count: 0,
      core_escape_room_count: corePlaces.filter((place) => place.experience_flags?.traditional_escape_room).length,
      paid_core_count: paidCore.length,
      free_core_count: corePlaces.length - paidCore.length,
      selectable_choice_count: selectable.length,
      route_dna: "rare-life-living-stone-strange-worlds",
      experience_buckets: Object.entries(corePlaces.reduce((tally, place) => ({ ...tally, [place.experience_bucket]: (tally[place.experience_bucket] || 0) + 1 }), {})).map(([bucket, count]) => ({ bucket, count })),
      textures: Object.entries(corePlaces.reduce((tally, place) => ({ ...tally, [place.texture]: (tally[place.texture] || 0) + 1 }), {})).map(([texture, count]) => ({ texture, count })),
      design_rule: "Optional, flex, social, archived and alternative places stay visible and dated to a day, but never affect Magic unless the group activates them.",
      museum_like_note: "Zero strict passive museums. Dinosaur State Park is flagged conservatively because its dome contains interpretive space, but the experience is an in-situ Jurassic trackway plus casting a real footprint.",
      bucket_note: "The brief groups Make / Solve / Strange Play as a single bucket of four; this package records them separately as maker-creative-industrial, puzzle-immersive and strange-built-environment."
    },
    days,
    place_ids: places.map((place) => place.id),
    core_place_ids: corePlaces.map((place) => place.id),
    alternative_place_ids: places.filter((place) => !place.included_in_magic_score).map((place) => place.id),
    replacement_place_ids: [],
    replacement_options: [],
    budget: {
      free_route_baseline_per_person_usd: 0,
      selected_experience_total_status: "computed-from-user-toggles",
      do_everything_core_low_per_person_usd: lowCost,
      do_everything_core_high_per_person_usd: highCost,
      do_everything_core_low_group_usd: Math.round(lowCost * 4 * 100) / 100,
      do_everything_core_high_group_usd: Math.round(highCost * 4 * 100) / 100,
      paid_core_count: paidCore.length,
      free_core_count: corePlaces.length - paidCore.length,
      variable_booking_fees_excluded: true,
      maryland_and_new_jersey_tax_excluded: true,
      shopping_spend_excluded: true,
      food_nightlife_lodging_cars_fuel_excluded: true,
      note: "Every paid attraction is optional. The two ranges inside the total are the Crane Manor per-player band and the Shenandoah guiding product, which is a scheduled class at $175 or a private guide at about $235 plus park entrance."
    },
    booking_priorities: BOOKING_PRIORITIES,
    operational_flags: {
      red: [
        "Little Stony Man: two 2026 operator calendars disagree on Thursday availability. Do not treat Oct 8 as locked without written confirmation.",
        "Duke Lemur Center Behind the Scenes is private, reservation-only and has no walk-ins.",
        "RVA Paddlesports' exact post-liturgy Oct 11 departure and river conditions must be confirmed.",
        "Big SNOW sells the SNOW Day package in advance only; there are no on-site sales."
      ],
      yellow: [
        "GoggleWorks is a custom private booking rather than a public timed ticket.",
        "Wet greenstone or wet quartzite cancels the climb and the boulder scramble, not the itinerary.",
        "Delaware Water Gap has 2026 closures elsewhere in the recreation area; recheck trail alerts.",
        "North Jersey and I-95 on Day 10 are live-traffic gated.",
        "Natural Bridge involves a major stair descent; arrange the alternative in advance if anyone needs it."
      ],
      green: [
        "Ragged Mountain and Steep Rock as a stone-first arrival day.",
        "The Milford comfort break splitting the Danbury-to-Water-Gap run.",
        "Frederick breaking the Lancaster-to-Shenandoah corridor.",
        "Staunton replacing the old push through to Roanoke after a full technical day.",
        "Natural Bridge into Devil's Marbleyard as a single geology progression.",
        "Fredericksburg as the deliberate post-rafting reset.",
        "Bombay Hook on a Monday that is not a 2026 hunting-closure date.",
        "One major shopping block at Jersey Gardens instead of two smaller ones."
      ]
    },
    validation: {
      date_count: days.length,
      expected_date_count: 11,
      all_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= (day.drive.authorized_cap_exception_minutes || TOTAL_CAP)),
      all_uninterrupted_legs_at_or_below_cap: longestLeg <= UNINTERRUPTED_CAP,
      longest_uninterrupted_leg_minutes: longestLeg,
      authorized_cap_exception_days: days.filter((day) => day.drive.authorized_cap_exception_minutes).map((day) => day.day),
      live_traffic_gated_days: days.filter((day) => day.drive.planning_total_minutes.high > 210).map((day) => day.day),
      long_total_driving_days: days.filter((day) => day.drive.baseline_total_minutes > 210).map((day) => day.day),
      place_count: places.length,
      core_place_count: corePlaces.length,
      selectable_choice_count: selectable.length,
      scheduled_unique_place_count: scheduled.size,
      image_count: images.length,
      rights_gated_image_count: rightsGated.length,
      places_with_fewer_than_3_usable_images: places.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      non_core_places_without_a_day: places.filter((place) => !place.included_in_magic_score && !place.visit_date).map((place) => place.id),
      replacement_option_count: 0,
      all_replacement_variants_at_or_below_cap: true,
      unfilled_place_ratings: places.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "Day 7 measures well over the 270-minute standard cap and carries an explicit authorised exception; every long leg is capped by a real stop, and a documented South Hill, VA break splits the Durham-to-Petersburg run that measured 153 minutes direct.",
        "The Little Stony Man Thursday booking conflict is unresolved; the Blue Ridge Tunnel and Natural Chimneys package is the documented fallback.",
        "Escape on Queen publishes a five-player minimum against a group of four, which is why it stays optional rather than core.",
        "The eleven package-only alternates the brief could not name are preserved as documented alternatives rather than being status-tagged.",
        "Captured LV, Bam Kazam, Jersey Gardens and the two wolf sites ship with contextual or species-reference imagery because no exact-attraction file was available.",
        "OSRM contains no live traffic; the Boston departure, North Jersey and I-95 remain live-traffic gates."
      ],
      route_lock_status: "ui-ready-bookings-and-live-forecast-pending",
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
    purpose: "Rebuild Route 08 around rare life, living stone and strange worlds, and hand the app a large dated set of optional and flex choices rather than a bare core.",
    route_dna: "RARE LIFE × LIVING STONE × STRANGE WORLDS",
    identity_change: "The route drops 'Mechanical Dreams' from its identity. Route 07 already owns sound, machinery and working factories; Route 08's real corridor strength is living systems, active geology and strange environments.",
    retained_original_core_ids: CORE_IDS.filter((id) => ORIGINAL_IDS.includes(id)),
    new_core_ids: NEW_CORE_IDS,
    new_optional_ids: NEW_OPTIONAL_IDS,
    original_optional_ids: [...OPTIONAL_IDS].filter((id) => ORIGINAL_IDS.includes(id)),
    original_social_ids: [...SOCIAL_IDS],
    original_flex_ids: [...FLEX_IDS],
    original_archive_ids: [...ARCHIVE_IDS],
    documented_alternative_ids: LEGACY_ALTERNATIVE_IDS,
    source_completeness_note: "The brief names only the 39 scheduled Route 08 originals. The package also holds 11 alternates the brief could not name, so they are preserved as documented alternatives with dates rather than being invented into KEEP/OPTIONAL/FLEX/ARCHIVE statuses.",
    overnight_change: "Winchester to Staunton on Oct 8, so a full technical climbing day is not followed by an unnecessary late drive and Oct 9 becomes a clean southbound geology day.",
    optional_dating: "Every non-core place carries a visit_date on the day whose corridor it sits on, which is what lets the app surface it in that day's optional and flex picker.",
    replacement_model_change: "The eleven legacy one-for-one replacement variants are retired. Their places remain visible as documented alternatives and are excluded from Magic until activated.",
    drive_correction: "Measured OSRM geometry replaces the brief's prose bands. Documented comfort breaks at Milford, PA and South Hill, VA split the Danbury-to-Water-Gap and Durham-to-Petersburg runs, and the Mt. Tammany pin routes to the Dunnfield Creek trailhead rather than the summit, which had forced a 213-minute detour.",
    image_policy: "Seventy-eight images across twenty-six new places: mostly Wikimedia Commons files shipped production-usable with creator, licence and file page recorded, plus operator publicity images for the escape rooms, Clue IQ and RVA Paddlesports held private-prototype-only. Five places carry contextual or species-reference coverage where no exact-attraction file exists, and those images say so."
  };

  const replacementGeometry = { schema_version: "1.0.0", route_id: ROUTE_ID, generated_at: VERIFIED_AT, routing_engine: "none-required", traffic_included: false, variants: [] };

  const readme = `# Route 08 — The Lemurs, Living Stone & Strange Worlds Loop

Canonical Energy Rebuild V2 for October 4-15, 2026. Route DNA: **RARE LIFE × LIVING STONE × STRANGE WORLDS**.

## Package summary

- ${places.length} total places: ${corePlaces.length} active core experiences and ${selectable.length} selectable choices once archived and social entries are set aside
- ${scheduled.size} uniquely scheduled core place cards across 11 days
- ${images.length} local carousel images, of which ${rightsGated.length} are rights-gated operator files
- ${baselineMiles.toFixed(1)} OSRM baseline miles
- ${longestLeg} minutes for the longest uninterrupted baseline driving leg
- $${lowCost.toFixed(2)}-$${highCost.toFixed(2)} optional do-everything attraction range per person, before Maryland and New Jersey tax
- ${museumLikeCore.length} conservatively museum-flagged core stop (${route.experience_model.museum_like_core_percent}%), 0 strict passive museums, 0 core food or nightlife

## Structural changes

Winchester's Oct 8 overnight moves to Staunton so the technical climbing day is not followed by a late drive. Every non-core place is dated to a day so the app can surface it in that day's optional and flex picker.

## Road evidence

Frozen OSRM geometry is canonical. A documented Milford, PA comfort break splits the Danbury-to-Water-Gap run, and Mt. Tammany routes to the Dunnfield Creek trailhead rather than the summit. Day 7 is the brief's signature day at 418 measured driving minutes and carries an explicit authorised cap exception; no single leg exceeds 153 minutes.

## UI contract

Core places expose texture, interaction, booking risk, weather and wet-surface gates, partial-participation paths, traveler fit and optional cost ranges. Optional, flex, social, archived and alternative places stay visible but never enter Magic unless activated.

## Operations

The route is UI-ready but not booking-final. The Shenandoah climb has an unresolved operator calendar conflict, and the Duke Lemur Center, RVA Paddlesports and Big SNOW are all hard reservations.

Rebuild with \`node scripts/route-08/build.mjs\`, then validate with \`node scripts/validate-route-package.mjs ${ROUTE_SLUG}\`.
`;

  const manifestRoute = manifest.routes.find((entry) => entry.id === ROUTE_ID);
  if (!manifestRoute) throw new Error("route-08 is missing from dataset/manifest.json");
  manifestRoute.name = route.route.name;
  manifestRoute.status = "energy-rebuild-ui-ready";
  manifestRoute.place_count = places.length;
  manifestRoute.image_count = images.length;
  manifestRoute.day_count = days.length;
  manifestRoute.baseline_miles = baselineMiles;

  await Promise.all([
    writeJson(path.join(routeDir, "places.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, places }),
    writeJson(path.join(routeDir, "images.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Legacy rights retained for original stops. New-place imagery mixes Wikimedia Commons files shipped production-usable with operator publicity images held private-prototype-only until permission is cleared.", images }),
    writeJson(path.join(routeDir, "sources.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: VERIFIED_AT, sources }),
    writeJson(path.join(routeDir, "route.json"), route),
    writeJson(path.join(routeDir, "route.geojson"), geojson),
    writeJson(path.join(routeDir, "replacement-geometry.json"), replacementGeometry),
    writeJson(path.join(routeDir, "route-decisions.json"), decisions),
    writeJson(path.join(routeDir, "place-seed.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, generated_from: "Energy Rebuild Routes/Route08_Lemurs_Living_Stone_Strange_Worlds_Rebuild.md", places }),
    writeFile(path.join(routeDir, "README.md"), readme),
    writeJson(path.join(root, "dataset", "manifest.json"), manifest)
  ]);
  console.log(`Built Route 08 Energy V2: ${places.length} places, ${corePlaces.length} core, ${selectable.length} selectable, ${images.length} images, ${days.length} days, ${baselineMiles} miles.`);
  return { placeCount: places.length, imageCount: images.length, dayCount: days.length };
}
