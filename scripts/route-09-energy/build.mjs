// Route 09 Energy Rebuild V2 builder.
//
// Invoked from scripts/route-09/build.mjs. Unlike the routes 05-08 builders, this one *mutates the
// existing package* rather than regenerating every record from scratch: Route 09's research pass had
// already landed all 52 brief places with verified copy, coordinates, sources and images. What was
// missing was the classification layer. Rebuilding the prose from a sibling route's builder would
// have risked importing that route's narrative wholesale, so nothing is copied here.
//
// What this changes:
//   - 23 places become active core; the other 29 become documented options bound to their day.
//   - Day schedules carry only core stops; options move into alternative_place_ids with a visit_date.
//   - Drive stats are recomputed from measured OSRM geometry, with three authorised cap exceptions.
//   - The eleven legacy one-for-one replacement variants are retired, matching routes 05-08.
//   - Budget switches to the energized do-everything model.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  BUCKETS, CAP_EXCEPTIONS, CORE_IDS, DAY_DATES, DAY_PLANS, MUSEUM_LIKE_IDS,
  NON_CORE, PEOPLE, PRICES, ROUTE_DNA, TEXTURES, VERIFIED_AT
} from "./data.mjs";

const TOTAL_CAP = 270;
const UNINTERRUPTED_CAP = 150;

// Scheduled windows from the brief's day-by-day itinerary. Day 8's afternoon runs later than the
// brief's prose: measured geometry puts the Warren-to-Parker Dam run, once split at Clarion, at 169
// minutes rather than the brief's ~1h45-2h00 band, which pushes Bellefonte past its stated 16:15.
const SCHEDULES = {
  "keystone-arches": ["13:30", "14:35"],
  "art-omi": ["15:45", "17:30"],
  "opus-40": ["10:00", "11:45"],
  "rail-explorers-express": ["13:00", "14:30"],
  "worlds-end": ["10:45", "12:45"],
  "bilgers-rocks": ["10:30", "12:15"],
  "scripture-rocks": ["13:45", "15:30"],
  "bayernhof": ["10:00", "12:30"],
  "palace-of-gold": ["14:15", "16:00"],
  "alan-cottrill": ["10:00", "11:15"],
  "otherworld": ["14:30", "17:00"],
  "faustus-escape": ["09:00", "10:15"],
  "warther-museum": ["12:15", "14:15"],
  "grove-city-outlets": ["16:15", "18:30"],
  "st-nicholas-orthodox": ["10:00", "11:45"],
  "parker-dam": ["14:55", "15:25"],
  "bellefonte-talleyrand": ["16:45", "18:00"],
  "hickory-run-boulder-field": ["09:45", "10:45"],
  "skirmish-paintball": ["11:30", "14:15"],
  "columcille": ["15:15", "17:00"],
  "fonthill-castle": ["10:00", "11:15"],
  "northlandz": ["12:15", "14:45"],
  "puzzle-theory-spectral": ["10:30", "11:45"]
};

const RESERVATIONS = {
  "rail-explorers-express": "required",
  "bayernhof": "required-advance-tour",
  "faustus-escape": "required",
  "skirmish-paintball": "preregistration-required",
  "fonthill-castle": "required",
  "northlandz": "recommended",
  "puzzle-theory-spectral": "required",
  "otherworld": "timed-entry",
  "opus-40": "recommended",
  "palace-of-gold": "recheck-before-departure",
  "warther-museum": "recommended"
};

const ROLE_LABELS = {
  flex: "documented-unscored-flex",
  optional: "optional-unscored-choice",
  conditional: "conditional-unscored-upgrade",
  "optional-swap": "optional-unscored-schedule-swap",
  "structural-flex": "structural-unscored-drive-break"
};

const SKIP_NOTES = {
  flex: "A short high-return stop held outside the frozen driving baseline. Take it when the day is running early; drop it without consequence when it is not.",
  optional: "An optional choice outside the frozen driving baseline. Activate it only when the live ETA, opening window and group energy all still work.",
  conditional: "Schedule-dependent: this one needs an appointment, a released visiting date or a confirmed opening before it can be counted on.",
  "optional-swap": "A one-for-one swap, not an addition. Activating it replaces the core experience it stands in for; it never lengthens the day.",
  "structural-flex": "A drive break rather than an attraction. Use it to reset the clock when live traffic threatens the uninterrupted ceiling."
};

const bucketOf = (id) => Object.entries(BUCKETS).find(([, ids]) => ids.includes(id))?.[0] ?? null;
const nullRatings = () => Object.fromEntries(PEOPLE.map((p) => [p, null]));

export async function buildEnergyRoute09({ root, routeDir }) {
  const [route, placesPackage, geometry, research] = await Promise.all([
    readFile(path.join(routeDir, "route.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "places.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "route-geometry.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "research-raw.json"), "utf8").then(JSON.parse)
  ]);

  const placeById = new Map(placesPackage.places.map((place) => [place.id, place]));
  for (const id of CORE_IDS) if (!placeById.has(id)) throw new Error(`Core place ${id} is missing from places.json.`);
  for (const id of Object.keys(NON_CORE)) if (!placeById.has(id)) throw new Error(`Option ${id} is missing from places.json.`);

  const coreSet = new Set(CORE_IDS);

  /* ---------------------------------------------------------------- images */

  // images.json is generated from research-raw.json, which scripts/promote-place-images.mjs rewrites.
  // Regenerating here is what makes a curation run actually reach the package: 34 places were
  // previously sharing one Keystone Arches file as their local image, which the validator could not
  // catch because it only checks that the file exists.
  const images = [];
  for (const place of placesPackage.places) {
    const selected = research.places?.[place.id]?.selected_images ?? [];
    place.image_ids = selected.slice(0, 5).map((item, index) => {
      const id = `img-${place.id}-${index + 1}`;
      images.push({
        id,
        place_id: place.id,
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

  const uniquePaths = new Set(images.map((image) => image.local_path));
  if (uniquePaths.size < images.length) {
    const counts = new Map();
    for (const image of images) counts.set(image.local_path, (counts.get(image.local_path) || 0) + 1);
    const shared = [...counts.entries()].filter(([, n]) => n > 1);
    throw new Error(`${shared.length} image file(s) are shared by more than one record, e.g. ${shared[0][0]} used ${shared[0][1]} times.`);
  }

  /* ---------------------------------------------------------------- places */

  for (const place of placesPackage.places) {
    const core = coreSet.has(place.id);
    place.included_in_magic_score = core;
    place.included_in_magic_default = core;
    place.data_status = "complete";

    if (core) {
      const price = PRICES[place.id];
      place.core_status = "core";
      place.original_status = "keep-core";
      place.energy_rebuild_role = "active-core";
      place.experience_bucket = bucketOf(place.id);
      place.texture = TEXTURES[place.id];
      place.museum_like = MUSEUM_LIKE_IDS.has(place.id);
      place.priority = "anchor";
      place.optional = false;
      place.included_in_daily_max_total = true;
      place.price_type = price.type;
      place.price_per_person_low = price.low;
      place.price_per_person_high = price.high;
      place.price_per_group = price.group ?? null;
      place.price_last_checked = VERIFIED_AT;
      place.cost = {
        amount_per_person: price.low === price.high ? price.low : null,
        low: price.low,
        high: price.high,
        amount_per_group: price.group ?? null,
        price_type: price.type,
        status: price.type === "free-model" ? "modelled-verify-before-departure" : "verified",
        note: price.note ?? ""
      };
      place.reservation = RESERVATIONS[place.id] ?? "none";
      place.operational_risk = place.reservation === "none" ? "green" : "yellow";
      place.operational_confidence = place.operational_risk;
      place.skip_mode = null;
      place.skip_strategy = null;
      place.visit_date = null; // set from the day loop below
    } else {
      const spec = NON_CORE[place.id];
      place.core_status = spec.role === "structural-flex" ? "flex" : (spec.role === "conditional" ? "conditional" : (spec.role.startsWith("optional") ? "optional" : "flex"));
      place.original_status = "documented-option";
      place.energy_rebuild_role = ROLE_LABELS[spec.role];
      place.experience_bucket = null;
      place.texture = null;
      place.museum_like = false;
      place.priority = spec.role === "structural-flex" ? "drive-break" : "option";
      place.optional = true;
      place.included_in_daily_max_total = false;
      place.visit_date = DAY_DATES[spec.day - 1];
      place.replaces_place_id = spec.replaces ?? null;
      place.skip_mode = SKIP_NOTES[spec.role];
      place.skip_strategy = SKIP_NOTES[spec.role];
      place.operational_risk = "reconfirm-if-activated";
      place.operational_confidence = "reconfirm-if-activated";
      place.price_last_checked = VERIFIED_AT;
    }

    place.ratings = {
      traveler_ratings: nullRatings(),
      average: null,
      rating_count: 0
    };
  }

  /* ------------------------------------------------------------------ days */

  const geometryByDay = new Map(geometry.days.map((day) => [day.day, day]));
  const optionsByDay = new Map();
  for (const [id, spec] of Object.entries(NON_CORE)) {
    if (!optionsByDay.has(spec.day)) optionsByDay.set(spec.day, []);
    optionsByDay.get(spec.day).push(id);
  }

  // Core stops in itinerary order, split across days by the routed node order.
  const coreByDay = new Map();
  for (const plan of geometry.days) {
    const ids = plan.legs.flatMap((leg) => [leg.from, leg.to]).filter((id) => coreSet.has(id));
    coreByDay.set(plan.day, [...new Set(ids)]);
  }

  let longestLegOverall = 0;
  const days = DAY_PLANS.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    if (!routed) throw new Error(`Day ${plan.day} has no measured geometry.`);
    const date = DAY_DATES[plan.day - 1];
    const longestLeg = Math.max(0, ...routed.legs.map((leg) => leg.baseline_minutes));
    longestLegOverall = Math.max(longestLegOverall, longestLeg);
    const exception = CAP_EXCEPTIONS[plan.day];

    const capStatus = longestLeg > UNINTERRUPTED_CAP
      ? "over-uninterrupted-cap"
      : exception
        ? "authorised-long-total-day"
        : routed.baseline_total_minutes > TOTAL_CAP
          ? "over-total-cap"
          : routed.baseline_total_minutes > 210
            ? "long-total-day"
            : "comfortable";

    const scheduleIds = coreByDay.get(plan.day) ?? [];
    for (const id of scheduleIds) placeById.get(id).visit_date = date;

    const schedule = scheduleIds
      .map((id) => {
        const window = SCHEDULES[id];
        if (!window) throw new Error(`Core place ${id} has no scheduled window.`);
        return { start: window[0], end: window[1], place_id: id, priority: "anchor", reservation: placeById.get(id).reservation };
      })
      .sort((a, b) => a.start.localeCompare(b.start));

    return {
      day: plan.day,
      date,
      day_of_week: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
      sleep_city: plan.sleep_city,
      theme: plan.theme,
      notes: null,
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
        ...(exception
          ? { authorized_cap_exception_minutes: exception.minutes, cap_exception_reason: exception.reason }
          : {}),
        fallback: null
      },
      weather: route.days?.[plan.day - 1]?.weather ?? null
    };
  });

  /* ---------------------------------------------------------------- totals */

  const baselineMiles = Number(days.reduce((sum, day) => sum + (day.drive.baseline_total_miles || 0), 0).toFixed(1));
  const paidCore = CORE_IDS.filter((id) => PRICES[id].high > 0);
  const lowTotal = CORE_IDS.reduce((sum, id) => sum + PRICES[id].high, 0)
    - (PRICES["skirmish-paintball"].high - PRICES["skirmish-paintball"].low);
  const highTotal = CORE_IDS.reduce((sum, id) => sum + PRICES[id].high, 0);

  /* ------------------------------------------------------------ assemble */

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
    route_specific_drive_rule: "Every planned uninterrupted run is at or under 136 minutes after documented comfort breaks at Sturbridge, Binghamton, Clarion and Mahwah. Days 7, 8 and 10 carry explicit authorised total-driving exceptions because each of their long legs is capped by a real stop."
  };

  route.days = days;
  route.place_ids = placesPackage.places.map((place) => place.id);
  route.core_place_ids = [...CORE_IDS];
  route.alternative_place_ids = Object.keys(NON_CORE);
  route.replacement_place_ids = [];
  route.replacement_options = [];

  route.experience_model = {
    active_core_count: CORE_IDS.length,
    selectable_experience_count: CORE_IDS.length + Object.keys(NON_CORE).length,
    passive_museum_core_count: 0,
    passive_museum_core_percent: 0,
    museum_labeled_core_count: MUSEUM_LIKE_IDS.size,
    museum_labeled_core_percent: Number(((MUSEUM_LIKE_IDS.size / CORE_IDS.length) * 100).toFixed(1)),
    experience_buckets: Object.fromEntries(Object.entries(BUCKETS).map(([k, v]) => [k, v.length])),
    texture_counts: Object.values(TEXTURES).reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {}),
    route_dna: ROUTE_DNA
  };

  route.budget = {
    free_route_baseline_per_person_usd: 0,
    selected_experience_total_status: "computed-from-user-toggles",
    do_everything_core_low_per_person_usd: Number(lowTotal.toFixed(2)),
    do_everything_core_high_per_person_usd: Number(highTotal.toFixed(2)),
    do_everything_core_low_group_usd: Number((lowTotal * 4).toFixed(2)),
    do_everything_core_high_group_usd: Number((highTotal * 4).toFixed(2)),
    paid_core_count: paidCore.length,
    free_core_count: CORE_IDS.length - paidCore.length,
    variable_booking_fees_excluded: true,
    shopping_spend_excluded: true,
    food_nightlife_lodging_cars_fuel_excluded: true,
    note: "The spread between the two totals is the Skirmish paint budget: Oct 12 half-price entry is $21.50 per person, and a conservative 1,000-round allocation adds about $52. Faustus and Spectral Rift carry conservative ceilings until their exact dates open for checkout."
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

  route.validation = {
    ...route.validation,
    verified_at: VERIFIED_AT,
    energy_rebuild_applied: true
  };

  /* ------------------------------------------------------------- geojson */

  const mapColor = route.route?.map_color ?? null;
  const geojson = {
    type: "FeatureCollection",
    features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({
        type: "Feature",
        id: leg.id,
        properties: {
          feature_kind: "drive_leg",
          route_id: "route-09",
          day: day.day,
          date: day.date,
          from: leg.from,
          to: leg.to,
          distance_miles: leg.baseline_miles ?? leg.distance_miles ?? null,
          baseline_minutes: leg.baseline_minutes,
          traffic_risk: day.drive.traffic_risk,
          map_color: mapColor,
          energy_rebuild: true
        },
        geometry: leg.geometry
      }))),
      ...placesPackage.places.map((place) => ({
        type: "Feature",
        id: place.id,
        properties: {
          feature_kind: "place",
          route_id: "route-09",
          place_id: place.id,
          name: place.name,
          city: place.city ?? null,
          state: place.state ?? null,
          visit_date: place.visit_date,
          priority: place.priority,
          included_in_magic_score: place.included_in_magic_score,
          energy_rebuild_role: place.energy_rebuild_role
        },
        geometry: { type: "Point", coordinates: place.coordinates }
      })),
      ...Object.entries(geometry.nodes ?? {}).map(([nodeId, node]) => ({
        type: "Feature",
        id: nodeId,
        properties: { feature_kind: "route_node", route_id: "route-09", node_id: nodeId, name: node.name },
        geometry: { type: "Point", coordinates: node.coordinates }
      }))
    ]
  };

  const replacementGeometry = {
    schema_version: "1.0.0",
    route_id: "route-09",
    generated_at: VERIFIED_AT,
    routing_engine: "none-required",
    traffic_included: false,
    variants: []
  };

  const imagesPackage = {
    schema_version: "1.0.0",
    route_id: "route-09",
    image_policy: "Three locally cached, visually reviewed real images per place. Commons licensing is preserved; permission-required external images are private-prototype-only.",
    images
  };

  const write = (name, value) => writeFile(path.join(routeDir, name), `${JSON.stringify(value, null, 2)}\n`);
  await Promise.all([
    write("route.json", route),
    write("places.json", placesPackage),
    write("images.json", imagesPackage),
    write("route.geojson", geojson),
    write("replacement-geometry.json", replacementGeometry)
  ]);

  const gated = images.filter((image) => image.production_usable === false).length;
  console.log(`route-09 energy rebuild: ${CORE_IDS.length} core, ${Object.keys(NON_CORE).length} options, ${baselineMiles} mi, longest leg ${longestLegOverall} min`);
  console.log(`  images: ${images.length} across ${uniquePaths.size} distinct files (${gated} rights-gated)`);
}
