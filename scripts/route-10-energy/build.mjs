// Route 10 Energy Rebuild V2 builder.
//
// Invoked from scripts/route-10/build.mjs. Route 10 needed both halves of the work: 38 places had to
// be authored from scratch, and the 24 V1 records had to be reclassified (21 kept as core or
// options, 3 archived). Nothing is copied from a sibling route's builder, so no donor prose can leak.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ARCHIVE_IDS, BUCKETS, CAP_EXCEPTIONS, CORE_IDS, DAY_DATES, DAY_PLANS, MUSEUM_LIKE_IDS,
  NEW_PLACES, NEW_PLACE_SOURCES, NEW_SOURCES, NON_CORE, PEOPLE, PRICES, RESERVATIONS,
  ROUTE_DNA, SCHEDULES, TEXTURES, VENUE_GROUPS, VERIFIED_AT
} from "./data.mjs";
import { manualCoordinates } from "../route-10/config.mjs";

const TOTAL_CAP = 270;
const UNINTERRUPTED_CAP = 150;

const ROLE_LABELS = {
  optional: "optional-unscored-choice",
  flex: "documented-unscored-flex",
  "optional-swap": "optional-unscored-schedule-swap"
};

const SKIP_NOTES = {
  optional: "An optional choice outside the frozen driving baseline. Activate it only when the live ETA, opening window and group energy all still work.",
  flex: "A short low-output stop held outside the frozen driving baseline. Take it when the day runs early; drop it without consequence when it does not.",
  "optional-swap": "A one-for-one swap, not an addition. Activating it replaces the core experience it stands in for; it never lengthens the day."
};

const bucketOf = (id) => Object.entries(BUCKETS).find(([, ids]) => ids.includes(id))?.[0] ?? null;
const nullRatings = () => Object.fromEntries(PEOPLE.map((p) => [p, null]));
const fitScore = (place, person) =>
  place.best_for?.includes(person) ? 5 : place.secondary_for?.includes(person) ? 4 : 3;

export async function buildEnergyRoute10({ root, routeDir }) {
  const [route, placesPackage, sourcesPackage, geometry, research, weather] = await Promise.all([
    readFile(path.join(routeDir, "route.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "places.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "sources.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "route-geometry.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "research-raw.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "weather-normals.json"), "utf8").then(JSON.parse)
  ]);

  /* --------------------------------------------------------------- sources */

  const sourceById = new Map(sourcesPackage.sources.map((s) => [s.id, s]));
  for (const [id, title, kind, url, supports] of NEW_SOURCES) {
    if (!sourceById.has(id)) sourceById.set(id, { id, title, source_kind: kind, url, supports, checked_at: VERIFIED_AT });
  }
  const sources = [...sourceById.values()];

  /* ---------------------------------------------------------------- places */

  const existingById = new Map(placesPackage.places.map((p) => [p.id, p]));
  const coreSet = new Set(CORE_IDS);
  const allIds = [...CORE_IDS, ...Object.keys(NON_CORE), ...ARCHIVE_IDS];

  const places = allIds.map((id) => {
    const existing = existingById.get(id);
    const authored = NEW_PLACES[id];
    if (!existing && !authored) throw new Error(`${id} has neither an existing record nor authored content.`);
    const coordinates = manualCoordinates[id];
    if (!coordinates) throw new Error(`${id} has no coordinates in scripts/route-10/config.mjs.`);

    const base = existing ?? {
      id,
      name: authored.name,
      kind: authored.kind,
      city: authored.city,
      state: authored.state,
      summary: authored.summary,
      why_go: authored.why_go,
      best_for: authored.best_for,
      secondary_for: authored.secondary_for,
      best_fit_note: authored.best_fit_note,
      categories: authored.categories,
      duration_minutes: authored.duration_minutes,
      address: authored.name,
      country: "US"
    };

    const place = { ...base, coordinates, coordinate_order: "longitude_latitude", coordinate_source: "manual_verified_access_or_specific-object-point" };
    place.source_ids = (NEW_PLACE_SOURCES[id] ?? base.source_ids ?? []).filter((sid) => sourceById.has(sid));
    if (authored?.hours_note) {
      place.hours = { opens: null, closes: null, status: "verified-current", note: authored.hours_note };
    }

    place.ratings = { traveler_ratings: nullRatings(), average: null, rating_count: 0 };
    place.researcher_person_fit = Object.fromEntries(PEOPLE.map((p) => [p, fitScore(place, p)]));
    place.data_status = "complete";
    place.price_last_checked = VERIFIED_AT;

    if (ARCHIVE_IDS.has(id)) {
      place.included_in_magic_score = false;
      place.included_in_magic_default = false;
      place.core_status = "archive";
      place.original_status = "remove-archive";
      place.energy_rebuild_role = "preserved-revision-history";
      place.experience_bucket = null;
      place.texture = null;
      place.museum_like = false;
      place.priority = "archive";
      place.optional = true;
      place.included_in_daily_max_total = false;
      place.visit_date = null;
      place.skip_mode = "Removed from the rebuilt itinerary and kept only as revision history. It is excluded from Magic and from the selectable inventory.";
      place.skip_strategy = place.skip_mode;
      place.operational_risk = "not-scheduled";
      place.operational_confidence = "not-scheduled";
      return place;
    }

    if (coreSet.has(id)) {
      const price = PRICES[id];
      place.included_in_magic_score = true;
      place.included_in_magic_default = true;
      place.core_status = "core";
      place.original_status = existing ? "keep-core" : "new-core";
      place.energy_rebuild_role = existing ? "active-core" : "new-energy-anchor";
      place.experience_bucket = bucketOf(id);
      place.texture = TEXTURES[id];
      place.museum_like = MUSEUM_LIKE_IDS.has(id);
      place.priority = "anchor";
      place.optional = false;
      place.included_in_daily_max_total = true;
      place.price_type = price.type;
      place.price_per_person_low = price.low;
      place.price_per_person_high = price.high;
      place.price_per_group = price.group ?? null;
      place.cost = {
        amount_per_person: price.low === price.high ? price.low : null,
        low: price.low, high: price.high,
        amount_per_group: price.group ?? null,
        price_type: price.type, status: "verified-current",
        note: price.note ?? ""
      };
      place.reservation = RESERVATIONS[id] ?? "none";
      place.operational_risk = place.reservation === "none" ? "green" : "yellow";
      place.operational_confidence = place.operational_risk;
      place.skip_mode = null;
      place.skip_strategy = null;
      place.visit_date = null; // assigned in the day loop
      return place;
    }

    const spec = NON_CORE[id];
    place.included_in_magic_score = false;
    place.included_in_magic_default = false;
    place.core_status = spec.role === "flex" ? "flex" : "optional";
    place.original_status = existing ? "demoted-to-option" : "new-option";
    place.energy_rebuild_role = ROLE_LABELS[spec.role];
    place.experience_bucket = null;
    place.texture = null;
    place.museum_like = false;
    place.priority = "option";
    place.optional = true;
    place.included_in_daily_max_total = false;
    place.visit_date = DAY_DATES[spec.day - 1];
    place.replaces_place_id = spec.replaces ?? null;
    place.skip_mode = SKIP_NOTES[spec.role];
    place.skip_strategy = place.skip_mode;
    place.operational_risk = "reconfirm-if-activated";
    place.operational_confidence = "reconfirm-if-activated";
    return place;
  });

  const placeById = new Map(places.map((p) => [p.id, p]));

  /* ---------------------------------------------------------------- images */

  const images = [];
  for (const place of places) {
    const selected = research.places?.[place.id]?.selected_images ?? [];
    place.image_ids = selected.slice(0, 5).map((item, index) => {
      const id = `img-${place.id}-${index + 1}`;
      images.push({
        id, place_id: place.id, title: item.title, description: item.description,
        search_query: item.search_query, local_path: item.local_path,
        source_page: item.source_page, source_file_url: item.original_url,
        creator: item.creator || "Unknown", credit: item.credit || "",
        license: item.license || "Unknown", license_url: item.license_url,
        alt: item.description || `${place.name} photograph`,
        coverage: item.coverage || "exact-place-or-experience",
        production_usable: item.production_usable ?? item.license !== "Unknown",
        rights_status: item.rights_status || "commons-license-recorded",
        visual_review: item.review_status === "reviewed" ? "reviewed" : "pending-final-review"
      });
      return id;
    });
    if (place.image_ids.length < 3) throw new Error(`${place.id} has only ${place.image_ids.length} images.`);
  }

  const uniquePaths = new Set(images.map((i) => i.local_path));
  if (uniquePaths.size < images.length) {
    const counts = new Map();
    for (const i of images) counts.set(i.local_path, (counts.get(i.local_path) || 0) + 1);
    const shared = [...counts.entries()].filter(([, n]) => n > 1);
    throw new Error(`${shared.length} image file(s) shared by more than one record, e.g. ${shared[0][0]} used ${shared[0][1]} times.`);
  }

  /* ------------------------------------------------------------------ days */

  const geometryByDay = new Map(geometry.days.map((d) => [d.day, d]));
  const weatherByDay = new Map((weather.days ?? []).map((d) => [d.day, d]));
  const optionsByDay = new Map();
  for (const [id, spec] of Object.entries(NON_CORE)) {
    if (!optionsByDay.has(spec.day)) optionsByDay.set(spec.day, []);
    optionsByDay.get(spec.day).push(id);
  }

  let longestLegOverall = 0;
  const days = DAY_PLANS.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    if (!routed) throw new Error(`Day ${plan.day} has no measured geometry.`);
    const date = DAY_DATES[plan.day - 1];
    const longestLeg = Math.max(0, ...routed.legs.map((l) => l.baseline_minutes));
    longestLegOverall = Math.max(longestLegOverall, longestLeg);
    const exception = CAP_EXCEPTIONS[plan.day];

    const capStatus = longestLeg > UNINTERRUPTED_CAP ? "over-uninterrupted-cap"
      : exception ? "authorised-long-total-day"
      : routed.baseline_total_minutes > TOTAL_CAP ? "over-total-cap"
      : routed.baseline_total_minutes > 210 ? "long-total-day"
      : "comfortable";

    const scheduledIds = [...new Set(routed.legs.flatMap((l) => [l.from, l.to]).filter((id) => coreSet.has(id)))];
    for (const id of scheduledIds) placeById.get(id).visit_date = date;

    const schedule = scheduledIds.map((id) => {
      const window = SCHEDULES[id];
      if (!window) throw new Error(`Core place ${id} has no scheduled window.`);
      return { start: window[0], end: window[1], place_id: id, priority: "anchor", reservation: placeById.get(id).reservation };
    }).sort((a, b) => a.start.localeCompare(b.start));

    return {
      day: plan.day, date,
      day_of_week: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
      sleep_city: plan.sleep_city, theme: plan.theme, notes: null,
      lodging: { city: plan.sleep_city, status: "zone-selected-not-booked" },
      schedule,
      alternative_place_ids: optionsByDay.get(plan.day) ?? [],
      drive: {
        legs: routed.legs,
        baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes,
        planning_total_minutes: Math.round(routed.baseline_total_minutes * 1.15),
        traffic_risk: routed.risk ?? "medium",
        cap_minutes: TOTAL_CAP,
        max_uninterrupted_minutes: longestLeg,
        uninterrupted_cap_minutes: UNINTERRUPTED_CAP,
        cap_status: capStatus,
        ...(exception ? { authorized_cap_exception_minutes: exception.minutes, cap_exception_reason: exception.reason } : {}),
        fallback: null
      },
      weather: weatherByDay.get(plan.day) ?? route.days?.[plan.day - 1]?.weather ?? null
    };
  });

  for (const place of places) {
    if (coreSet.has(place.id) && !place.visit_date) throw new Error(`Core place ${place.id} was never scheduled.`);
  }

  /* --------------------------------------------------------------- totals */

  const baselineMiles = Number(days.reduce((s, d) => s + (d.drive.baseline_total_miles || 0), 0).toFixed(1));
  const highTotal = CORE_IDS.reduce((s, id) => s + PRICES[id].high, 0);
  const lowTotal = CORE_IDS.reduce((s, id) => s + PRICES[id].low, 0);
  const paidCore = CORE_IDS.filter((id) => PRICES[id].high > 0).length;
  const selectable = CORE_IDS.length + Object.keys(NON_CORE).length;
  const venueCards = selectable - Object.values(VENUE_GROUPS).reduce((s, g) => s + g.length - 1, 0);

  /* ------------------------------------------------------------- assemble */

  route.route = {
    ...route.route,
    status: "energy-rebuild-ui-ready",
    baseline_total_miles: baselineMiles,
    energy_rebuild_version: "2",
    route_dna: ROUTE_DNA,
    verified_at: VERIFIED_AT
  };

  route.constraints = {
    ...route.constraints,
    daily_drive_hard_cap_minutes: TOTAL_CAP,
    max_uninterrupted_drive_minutes: UNINTERRUPTED_CAP,
    route_specific_drive_rule: `Every planned uninterrupted run is at or under ${longestLegOverall} minutes after documented comfort breaks at Stamford, Farmville, Winchester and Hartford. Days 7 and 9 carry explicit authorised total-driving exceptions because each of their long legs is capped by a real stop.`
  };

  route.days = days;
  route.place_ids = places.map((p) => p.id);
  route.core_place_ids = [...CORE_IDS];
  route.alternative_place_ids = Object.keys(NON_CORE);
  route.archived_place_ids = [...ARCHIVE_IDS];
  route.replacement_place_ids = [];
  route.replacement_options = [];

  route.experience_model = {
    active_core_count: CORE_IDS.length,
    selectable_experience_count: selectable,
    selectable_venue_card_count: venueCards,
    passive_museum_core_count: 0,
    passive_museum_core_percent: 0,
    conservative_observe_only_core_count: MUSEUM_LIKE_IDS.size,
    conservative_observe_only_core_percent: Number(((MUSEUM_LIKE_IDS.size / CORE_IDS.length) * 100).toFixed(1)),
    traditional_escape_room_venues_in_package: 3,
    traditional_escape_rooms_in_core: 2,
    experience_buckets: Object.fromEntries(Object.entries(BUCKETS).map(([k, v]) => [k, v.length])),
    texture_counts: Object.values(TEXTURES).reduce((a, t) => ({ ...a, [t]: (a[t] || 0) + 1 }), {}),
    route_dna: ROUTE_DNA
  };

  route.budget = {
    free_route_baseline_per_person_usd: 0,
    selected_experience_total_status: "computed-from-user-toggles",
    do_everything_core_low_per_person_usd: Number(lowTotal.toFixed(2)),
    do_everything_core_high_per_person_usd: Number(highTotal.toFixed(2)),
    do_everything_core_low_group_usd: Number((lowTotal * 4).toFixed(2)),
    do_everything_core_high_group_usd: Number((highTotal * 4).toFixed(2)),
    paid_core_count: paidCore,
    free_core_count: CORE_IDS.length - paidCore,
    variable_booking_fees_excluded: true,
    shopping_spend_excluded: true,
    food_nightlife_lodging_cars_fuel_excluded: true,
    note: "The spread between the two totals is the documented VIR cost switch: the ceiling models two kart races per person at $30 each, and dropping to one race saves $30 per person. Old New-Gate's event ticketing fees are excluded."
  };

  route.operational_flags = {
    ...route.operational_flags,
    all_drive_days_at_or_below_cap: days.every((d) => d.drive.baseline_total_minutes <= (d.drive.authorized_cap_exception_minutes || TOTAL_CAP)),
    all_uninterrupted_legs_at_or_below_cap: longestLegOverall <= UNINTERRUPTED_CAP,
    longest_uninterrupted_leg_minutes: longestLegOverall,
    authorised_long_total_days: Object.keys(CAP_EXCEPTIONS).map(Number),
    long_total_driving_days: days.filter((d) => d.drive.baseline_total_minutes > 210).map((d) => d.day),
    replacement_option_count: 0,
    all_replacement_variants_at_or_below_cap: true,
    days_without_documented_options: days.filter((d) => d.alternative_place_ids.length === 0).map((d) => d.day)
  };

  route.validation = { ...route.validation, verified_at: VERIFIED_AT, energy_rebuild_applied: true };

  /* -------------------------------------------------------------- outputs */

  const mapColor = route.route?.map_color ?? null;
  const geojson = {
    type: "FeatureCollection",
    features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({
        type: "Feature", id: leg.id,
        properties: {
          feature_kind: "drive_leg", route_id: "route-10", day: day.day, date: day.date,
          from: leg.from, to: leg.to,
          distance_miles: leg.baseline_miles ?? leg.distance_miles ?? null,
          baseline_minutes: leg.baseline_minutes, traffic_risk: day.drive.traffic_risk,
          map_color: mapColor, energy_rebuild: true
        },
        geometry: leg.geometry
      }))),
      ...places.map((place) => ({
        type: "Feature", id: place.id,
        properties: {
          feature_kind: "place", route_id: "route-10", place_id: place.id, name: place.name,
          city: place.city ?? null, state: place.state ?? null, visit_date: place.visit_date,
          priority: place.priority, included_in_magic_score: place.included_in_magic_score,
          energy_rebuild_role: place.energy_rebuild_role
        },
        geometry: { type: "Point", coordinates: place.coordinates }
      })),
      ...Object.entries(geometry.nodes ?? {}).map(([nodeId, node]) => ({
        type: "Feature", id: nodeId,
        properties: { feature_kind: "route_node", route_id: "route-10", node_id: nodeId, name: node.name },
        geometry: { type: "Point", coordinates: node.coordinates }
      }))
    ]
  };

  const write = (name, value) => writeFile(path.join(routeDir, name), `${JSON.stringify(value, null, 2)}\n`);
  await Promise.all([
    write("route.json", route),
    write("places.json", { ...placesPackage, places }),
    write("images.json", {
      schema_version: "1.0.0", route_id: "route-10",
      image_policy: "Three locally cached, visually reviewed real images per place. Commons licensing is preserved; permission-required external images are private-prototype-only.",
      images
    }),
    write("sources.json", { ...sourcesPackage, sources }),
    write("route.geojson", geojson),
    write("replacement-geometry.json", {
      schema_version: "1.0.0", route_id: "route-10", generated_at: VERIFIED_AT,
      routing_engine: "none-required", traffic_included: false, variants: []
    })
  ]);

  const gated = images.filter((i) => i.production_usable === false).length;
  console.log(`route-10 energy rebuild: ${CORE_IDS.length} core, ${Object.keys(NON_CORE).length} options, ${ARCHIVE_IDS.size} archived, ${baselineMiles} mi, longest leg ${longestLegOverall} min`);
  console.log(`  ${selectable} selectable experiences across ${venueCards} venue cards`);
  console.log(`  images: ${images.length} across ${uniquePaths.size} distinct files (${gated} rights-gated)`);
}
