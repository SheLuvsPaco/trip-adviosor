#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildEnergyRoute } from "./route-01-energy/build.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", "route-01-gilded-coast-capital-loop");
const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const manualCoordinates = {
  "st-nicholas-wtc": [-74.0132, 40.7118],
  "roosevelt-island-tram": [-73.9646, 40.7614],
  "grounds-for-sculpture": [-74.7196, 40.2365],
  "snallygaster": [-77.0197, 38.8935],
  "o-street-museum": [-77.0452, 38.9085],
  "carroll-creek": [-77.4103, 39.4127],
  "gettysburg-battlefield": [-77.2255, 39.8114],
  "steelstacks": [-75.3676, 40.6157],
  "historic-bethlehem": [-75.3814, 40.6160],
  "da-vinci-science-center": [-75.4774, 40.6017],
  "paterson-great-falls": [-74.1805294, 40.9155412],
  "carousel-museum": [-72.9394923, 41.6710664],
  "old-sturbridge-village": [-72.1011232, 42.1038149],
  "untermyer-gardens": [-73.8874690, 40.9665993],
  "morven-museum": [-74.6669360, 40.3477912],
  "hillwood-estate": [-77.0526526, 38.9436529],
  "ramapo-valley-reservation": [-74.1870007, 41.0777148]
};

const imageExclusions = {
  "castle-hill-lighthouse": ["census-enumeration"],
  "fillmore-philadelphia": ["new-palace-theatre", "wtp-c20"],
  "magic-gardens": ["isaiah-zagar-crop", "magic-gardens-3-isaiah-zagar-jpg"],
  "st-nicholas-cathedral-dc": ["st-john-the-baptist"],
  "st-nicholas-wtc": ["194956312"]
};

const contextualImagePlaces = new Set(["saint-vitus", "snallygaster", "fillmore-philadelphia", "princeton-art-museum"]);

const dayPlans = [
  {
    day: 1,
    date: "2026-10-04",
    sleep_city: "Newport, RI",
    theme: "Art, old Providence and an Atlantic sunset",
    schedule: [
      ["14:10", "15:30", "risd-museum", "anchor"],
      ["15:30", "16:00", "benefit-street", "supporting"],
      ["17:20", "18:25", "castle-hill-lighthouse", "anchor"]
    ],
    lodging: { preferred_area: "Downtown Newport or harbor edge", fallback_area: "Middletown near West Main Road", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Parking and a clean late check-in matter more than resort amenities." },
    notes: ["Assumes both rental cars are collected at Boston Logan by 12:45.", "If the Nantucket-Hyannis-Boston transfer reaches the rental desk after 14:00, skip RISD and Benefit Street; do not sacrifice the Newport sunset or drive late."],
    fallback: "Late transfer: drive directly from Logan to Newport and retain Castle Hill only."
  },
  {
    day: 2,
    date: "2026-10-05",
    sleep_city: "New Haven, CT",
    theme: "Gilded Age, quiet coast, ships and rare books",
    schedule: [
      ["07:35", "08:20", "cliff-walk", "supporting"],
      ["09:00", "10:30", "the-breakers", "anchor"],
      ["11:45", "12:40", "watch-hill", "supporting"],
      ["13:15", "16:15", "mystic-seaport", "anchor"],
      ["17:30", "18:25", "beinecke-library", "anchor"],
      ["18:45", "20:15", "wooster-square", "supporting"]
    ],
    lodging: { preferred_area: "Downtown/Yale or Chapel Street with a staffed secure garage", fallback_area: "East Rock near Whitney Avenue", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Do not leave luggage visible during the Yale stop." },
    notes: ["Watch Hill is the added town from the drive re-audit.", "Mystic duration can contract to 2.5 hours if the Breakers or coastal roads run late."],
    fallback: "If arrival at Watch Hill is after 12:10, convert it to a 20-minute harbor viewpoint and protect Mystic and Beinecke."
  },
  {
    day: 3,
    date: "2026-10-06",
    sleep_city: "New York, NY",
    theme: "Outlet day and Brooklyn skyline arrival",
    schedule: [
      ["10:00", "13:30", "woodbury-common", "anchor"],
      ["17:00", "18:30", "dumbo-brooklyn-bridge-park", "supporting"]
    ],
    lodging: { preferred_area: "Downtown Brooklyn near Jay Street/MetroTech with a secure garage", fallback_area: "Long Island City near Court Square", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Park both cars once until Thursday morning; price the garage before booking lodging." },
    notes: ["Leave New Haven at 08:00 and Woodbury no later than 13:30.", "The DUMBO walk is flexible and disappears if NYC traffic consumes the arrival window."],
    fallback: "If live ETA from Woodbury to the hotel exceeds 2 hours, leave immediately and cancel DUMBO rather than extending the bed-to-bed day."
  },
  {
    day: 4,
    date: "2026-10-07",
    sleep_city: "New York, NY",
    theme: "Immigrant lives, sacred architecture, moving viewpoints and metal",
    schedule: [
      ["10:00", "11:30", "tenement-museum", "anchor"],
      ["12:30", "13:15", "st-nicholas-wtc", "anchor"],
      ["13:15", "13:45", "oculus", "supporting"],
      ["14:45", "15:45", "roosevelt-island-tram", "supporting"],
      ["18:30", "22:30", "saint-vitus", "anchor"]
    ],
    lodging: { preferred_area: "Same Downtown Brooklyn hotel", fallback_area: "Same Long Island City hotel", room_setup: "Keep both rooms for a second night", notes: "Use subway/tram/walking all day; cars stay parked." },
    notes: ["Lunch remains unscheduled in the Lower East Side to preserve group choice.", "The concert is big night 1 of 3."],
    fallback: "If concert energy is low, attend the opening set and leave early; the ticket remains a group-rated experience."
  },
  {
    day: 5,
    date: "2026-10-08",
    sleep_city: "Philadelphia, PA",
    theme: "Surreal sculpture, new architecture and an old residential lane",
    schedule: [
      ["10:00", "12:30", "grounds-for-sculpture", "anchor"],
      ["13:05", "14:20", "princeton-art-museum", "anchor"],
      ["14:20", "14:40", "princeton-chapel", "supporting"],
      ["18:00", "18:35", "elfreths-alley", "optional"]
    ],
    lodging: { preferred_area: "Fishtown/Northern Liberties near The Fillmore with a secure garage", fallback_area: "Old City near Market Street", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Fishtown minimizes the Friday concert commute; Old City is better for the Thursday walk." },
    notes: ["Princeton is the added town from the drive re-audit; the museum is free and open until 20:00 Thursday.", "Elfreth's Alley is deliberately optional after a traffic-sensitive entry into Philadelphia."],
    fallback: "If NYC/New Jersey traffic pushes Princeton departure past 15:15, skip Elfreth's Alley and check in/rest."
  },
  {
    day: 6,
    date: "2026-10-09",
    sleep_city: "Philadelphia, PA",
    theme: "Market culture, prison history, folk-art obsession and live rock",
    schedule: [
      ["08:15", "09:30", "reading-terminal-market", "anchor"],
      ["10:00", "12:15", "eastern-state", "anchor"],
      ["14:00", "15:15", "magic-gardens", "supporting"],
      ["18:00", "22:30", "fillmore-philadelphia", "anchor"]
    ],
    lodging: { preferred_area: "Same Fishtown/Northern Liberties hotel", fallback_area: "Same Old City hotel", room_setup: "Keep both rooms for a second night", notes: "Cars stay parked; use walking and ride-share/transit." },
    notes: ["Rest from 15:30 until the concert doors.", "The concert is big night 2 of 3."],
    fallback: "Magic Gardens is the first item removed if Eastern State discussion runs long or the group needs recovery time."
  },
  {
    day: 7,
    date: "2026-10-10",
    sleep_city: "Washington, DC",
    theme: "A protected capital transfer, folklore beer and monuments after dark",
    schedule: [
      ["14:00", "18:00", "snallygaster", "anchor"],
      ["18:30", "19:40", "lincoln-memorial", "supporting"]
    ],
    lodging: { preferred_area: "Dupont Circle, Logan Circle or Shaw with secure parking", fallback_area: "Crystal City near Metro if central parking is prohibitive", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Park before the festival and do not drive again that day." },
    notes: ["Baltimore was removed from the core day after routing showed that it erased the traffic margin before the fixed 14:00 festival.", "Snallygaster is big night 3 of 3, although it finishes at 18:00 rather than becoming a club night."],
    fallback: "If the live Philadelphia-to-Washington ETA threatens the 210-minute drive cap or festival entry, leave earlier and drop the monument walk; Baltimore remains a documented but non-core alternative."
  },
  {
    day: 8,
    date: "2026-10-11",
    sleep_city: "Gettysburg, PA",
    theme: "Orthodox worship, Byzantine art, secret doors and a small-city reset",
    schedule: [
      ["09:00", "10:45", "st-nicholas-cathedral-dc", "anchor"],
      ["11:30", "14:15", "dumbarton-oaks", "anchor"],
      ["15:00", "16:45", "o-street-museum", "anchor"],
      ["18:00", "19:10", "carroll-creek", "supporting"]
    ],
    lodging: { preferred_area: "Historic Gettysburg within a short drive of the NPS visitor center", fallback_area: "US-30/US-15 hotel cluster with staffed reception and easy two-room inventory", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Frederick remains the dinner stop; sleeping in Gettysburg is what protects the next day's cap." },
    notes: ["Use transit or ride-share in Washington and retrieve cars only for departure.", "Continue 51 baseline minutes from Frederick to Gettysburg after dinner; O Museum is the added unusual anchor from the re-audit."],
    fallback: "If Washington runs late, shorten Carroll Creek to dinner-to-go and continue to Gettysburg; do not move the hotel back to Frederick."
  },
  {
    day: 9,
    date: "2026-10-12",
    sleep_city: "Easton, PA",
    theme: "Battlefield terrain, Moravian streets, blast furnaces and a quiet square",
    schedule: [
      ["08:30", "11:30", "gettysburg-battlefield", "anchor"],
      ["14:30", "15:25", "historic-bethlehem", "optional"],
      ["15:45", "17:15", "steelstacks", "anchor"],
      ["18:10", "19:25", "easton-centre-square", "supporting"]
    ],
    lodging: { preferred_area: "Downtown Easton near Centre Square with secure or staffed parking", fallback_area: "Easton/Phillipsburg I-78 hotel cluster", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Easton advances the return by 22 baseline minutes and still gives a real small-city night." },
    notes: ["Reserve a 09:00 private licensed guide and consolidate into one car for the tour if capacity permits.", "Historic Bethlehem is the first cut if Gettysburg runs late; protect SteelStacks and the Easton sleep endpoint."],
    fallback: "If Gettysburg departure is after 12:15, skip Historic Bethlehem, retain a shorter SteelStacks walk, and reach Easton without exceeding the cap."
  },
  {
    day: 10,
    date: "2026-10-13",
    sleep_city: "Southbury, CT",
    theme: "A giant urban waterfall, industrial truth and a quiet Connecticut reset",
    schedule: [
      ["09:30", "10:45", "paterson-great-falls", "anchor"]
    ],
    lodging: { preferred_area: "Southbury near I-84 Exit 16 with on-site parking", fallback_area: "Middlebury/West Waterbury near I-84, avoiding an unnecessary downtown detour", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "This is a practical safety-and-recovery night; clean two-room inventory takes priority over nightlife." },
    notes: ["Paterson splits the 3h26 baseline almost evenly and adds nature plus industrial history without a long hike.", "The grounds are open Tuesday, but no ranger tour is expected; keep luggage concealed and use official parking."],
    fallback: "If live traffic predicts more than 210 driving minutes, depart Easton before the commuter build and shorten Paterson to the two official overlook areas; do not add Water Gap or Beacon."
  },
  {
    day: 11,
    date: "2026-10-14",
    sleep_city: "Boston, MA",
    theme: "Carousel craft, a living 1830s village and a protected Boston return",
    schedule: [
      ["10:00", "11:15", "carousel-museum", "anchor"],
      ["12:45", "15:15", "old-sturbridge-village", "anchor"]
    ],
    lodging: { preferred_area: "Logan Airport hotel with shuttle", fallback_area: "Seaport with confirmed airport transfer", room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Airport convenience takes priority for the October 15 departure." },
    notes: ["Depart Southbury by 09:15; the museum opens at 10:00 and Sturbridge is open Wednesday.", "The route should reach the Logan hotel zone around 17:00, leaving a protected final evening before the October 15 airport deadline."],
    fallback: "If traffic or weather deteriorates, shorten Sturbridge to 90 minutes; the Carousel Museum is first to drop only if the morning departure slips beyond 10:00."
  }
];

function personFit(place, person) {
  if (place.best_for.includes(person)) return 5;
  if (place.secondary_for.includes(person)) return 4;
  return person === "sheluvspaco" ? 3.8 : 3.4;
}

function scheduleItem(tuple, placeById) {
  const [start, end, placeId, priority] = tuple;
  const place = placeById.get(placeId);
  if (!place) throw new Error(`Unknown place in schedule: ${placeId}`);
  return { start, end, place_id: placeId, priority, reservation: place.reservation };
}

async function main() {
  await buildEnergyRoute({ root: ROOT, routeDir: ROUTE_DIR });
  return;

  // Legacy Route 01 builder retained below as historical implementation context.
  // The canonical rebuild path above consumes the reviewed Energy V2 artifact.
  const [seed, research, weather, geometry, replacementGeometry] = await Promise.all([
    readFile(path.join(ROUTE_DIR, "place-seed.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "research-raw.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "weather-normals.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "route-geometry.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "replacement-geometry.json"), "utf8").then(JSON.parse)
  ]);

  const replacementVariantById = new Map(replacementGeometry.variants.map((variant) => [variant.id, variant]));
  const images = [];
  const places = seed.places.map((place) => {
    const raw = research.places[place.id];
    const rawCoordinate = raw?.selected_coordinate;
    const coordinates = manualCoordinates[place.id] || (rawCoordinate ? [rawCoordinate.longitude, rawCoordinate.latitude] : null);
    if (!coordinates) throw new Error(`Missing coordinates for ${place.id}`);
    const exclusions = imageExclusions[place.id] || [];
    const selected = (raw?.selected_images || []).filter((image) => !exclusions.some((text) => image.local_path.includes(text)));
    const imageIds = selected.map((image, index) => {
      const imageId = `img-${place.id}-${index + 1}`;
      images.push({
        id: imageId,
        place_id: place.id,
        local_path: image.local_path,
        source_page: image.source_page,
        source_file_url: image.original_url,
        creator: image.creator,
        credit: image.credit,
        license: image.license,
        license_url: image.license_url,
        alt: image.description || `${place.name} photograph`,
        coverage: contextualImagePlaces.has(place.id) ? "neighborhood-or-event-context" : "exact-place",
        production_usable: image.license !== "Unknown",
        visual_review: "reviewed"
      });
      return imageId;
    });
    const replacementVariant = place.replacement
      ? replacementVariantById.get(place.replacement.route_variant_id)
      : null;
    if (place.replacement && !replacementVariant) {
      throw new Error(`Missing replacement route variant ${place.replacement.route_variant_id} for ${place.id}`);
    }
    return {
      ...place,
      country: "US",
      coordinates,
      coordinate_order: "longitude_latitude",
      coordinate_source: manualCoordinates[place.id] ? "manual_verified_address" : "openstreetmap_nominatim",
      image_ids: imageIds,
      ratings: {
        traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
        average: null,
        rating_count: 0
      },
      researcher_person_fit: Object.fromEntries(PEOPLE.map((person) => [person, personFit(place, person)])),
      included_in_magic_score: !["optional", "replacement"].includes(place.priority),
      replacement: place.replacement ? { ...place.replacement, route_variant: replacementVariant } : undefined,
      data_status: imageIds.length >= 3 ? "complete" : "image-gap"
    };
  });

  const placeById = new Map(places.map((place) => [place.id, place]));
  const weatherByDay = new Map(weather.days.map((day) => [day.day, day]));
  const geometryByDay = new Map(geometry.days.map((day) => [day.day, day]));
  const comfortScores = [4.2, 4.3, 4.4, 4.4, 4.5, 4.4, 4.7, 4.2, 4.0, 3.6, 3.7];

  const days = dayPlans.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    const capStatus = routed.planning_total_minutes.high > 210
      ? "live-traffic-gated"
      : routed.baseline_total_minutes >= 185
        ? "near-cap"
        : "comfortable";
    return {
      ...plan,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(new Date(`${plan.date}T12:00:00-04:00`)),
      drive: {
        legs: routed.legs,
        baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes,
        planning_total_minutes: routed.planning_total_minutes,
        traffic_risk: routed.risk,
        cap_minutes: 210,
        cap_status: capStatus,
        fallback: plan.fallback
      },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      weather: {
        kind: "historical_normal",
        high_c: normal.normal_high_c,
        low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfortScores[plan.day - 1],
        station_id: normal.station_id,
        station_name: normal.station_name,
        station_role: normal.station_role,
        source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before"
      }
    };
  });

  const corePlaceCosts = places.filter((place) => place.included_in_magic_score && !["concert", "festival", "food-neighborhood", "food-market", "small-town-district"].includes(place.kind));
  const knownCore = corePlaceCosts.reduce((sum, place) => sum + (place.cost.amount_per_person || 0), 0);
  const route = {
    schema_version: "1.0.0",
    route: {
      id: "route-01",
      slug: "gilded-coast-capital-loop",
      name: "The Gilded Coast & Capital Loop",
      short_name: "Gilded Coast",
      status: "researched",
      map_color: "#FF5A36",
      timezone: "America/New_York",
      start_date: "2026-10-04",
      end_date: "2026-10-14",
      airport_date: "2026-10-15",
      origin: { name: "Boston Logan Rental Car Center", coordinates: [-71.0236, 42.3670] },
      destination: { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
      endpoint_city: "Washington, DC",
      direction: "southbound Atlantic corridor, northbound Pennsylvania-New Jersey-Connecticut interior corridor",
      countries: ["US"],
      canada_included: false,
      total_nights: 11,
      road_nights: 10,
      final_boston_nights: 1,
      baseline_total_miles: geometry.route_baseline_total_miles,
      summary: "A warm-leaning Northeast loop combining coastal scenery, unusual museums, Orthodox sites, three specific music/social events, Gettysburg, industrial Bethlehem, Paterson's urban waterfall and an interior New England return, plus one fully modeled anchor-replacement option for every day."
    },
    constraints: {
      travelers: 4,
      cars: 2,
      cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 165],
      daily_drive_hard_cap_minutes: 210,
      max_big_nights_out: 4,
      planned_big_nights_out: 3,
      max_athletic_adrenaline_spots: 2,
      planned_athletic_adrenaline_spots: 0,
      hike_soft_cap_miles: 6,
      lodging_rooms: [
        { count: 1, beds: 1 },
        { count: 1, beds: 2 }
      ],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure parking"],
      visa_policy: "US-only route; no Canada border crossing or J-1 re-entry dependency.",
      budget_target_per_person_usd: 1500,
      budget_excludes: ["lodging", "rental cars", "fuel", "nightlife", "personal shopping"]
    },
    scoring: {
      scale: { min: 1, max: 5, increment: 0.5 },
      equal_traveler_weight: true,
      traveler_ids: PEOPLE,
      route_component_weights_percent: {
        attraction_and_stop_ratings: 45,
        excitement_and_uniqueness: 20,
        driving_comfort: 15,
        traveler_fairness: 10,
        cost_and_value: 5,
        expected_weather: 5
      },
      route_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      driving_comfort_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      overall_excitement_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      cost_value_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      weather_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      magic_score: null,
      magic_score_status: "awaiting_traveler_ratings",
      person_specific_route_scores: Object.fromEntries(PEOPLE.map((person) => [person, null]))
    },
    days,
    place_ids: places.map((place) => place.id),
    core_place_ids: places.filter((place) => place.included_in_magic_score).map((place) => place.id),
    alternative_place_ids: places.filter((place) => !place.included_in_magic_score).map((place) => place.id),
    replacement_place_ids: places.filter((place) => place.priority === "replacement").map((place) => place.id),
    replacement_options: replacementGeometry.variants.map((variant) => ({
      id: variant.id,
      day: variant.day,
      replacement_place_id: variant.replacement_place_id,
      replaces_place_ids: variant.replaces_place_ids,
      baseline_total_miles: variant.baseline_total_miles,
      baseline_total_minutes: variant.baseline_total_minutes,
      delta_miles: variant.delta_miles,
      delta_minutes: variant.delta_minutes,
      cap_minutes: variant.cap_minutes,
      cap_status: variant.cap_status
    })),
    budget: {
      known_core_admission_floor_per_person_usd: Math.round(knownCore * 100) / 100,
      core_admissions_planning_range_per_person_usd: [250, 380],
      food_and_cafes_range_per_person_usd: [600, 900],
      local_transit_shared_parking_tolls_range_per_person_usd: [150, 250],
      controllable_total_range_per_person_usd: [1000, 1350],
      nightlife_range_per_person_usd: [155, 220],
      nightlife_excluded_from_target: true,
      note: "Ranges deliberately avoid claiming exact 2026 parking, restaurant, variable ticket or personal shopping costs."
    },
    booking_priorities: [
      { place_id: "snallygaster", urgency: "buy-first", reason: "Official event expects to sell out." },
      { place_id: "saint-vitus", urgency: "buy-first", reason: "Date-specific concert and small venue." },
      { place_id: "fillmore-philadelphia", urgency: "buy-first", reason: "Date-specific concert." },
      { place_id: "tenement-museum", urgency: "early", reason: "Guided-only timed inventory." },
      { place_id: "gettysburg-battlefield", urgency: "early", reason: "Private licensed guide and target 10:00 slot." },
      { place_id: "o-street-museum", urgency: "early", reason: "Timed weekend tour." },
      { place_id: "grounds-for-sculpture", urgency: "normal", reason: "Timed entry required." },
      { place_id: "magic-gardens", urgency: "normal", reason: "Small timed-entry capacity." },
      { place_id: "old-sturbridge-village", urgency: "when-calendar-opens", reason: "Protect the 12:45 arrival window on the final road day." }
    ],
    validation: {
      date_count: days.length,
      expected_date_count: 11,
      all_baseline_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= 210),
      live_traffic_gated_days: days.filter((day) => day.drive.cap_status === "live-traffic-gated").map((day) => day.day),
      place_count: places.length,
      image_count: images.length,
      places_with_fewer_than_3_usable_images: places.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      replacement_option_count: replacementGeometry.variants.length,
      all_replacement_variants_at_or_below_cap: replacementGeometry.variants.every((variant) => variant.baseline_total_minutes <= variant.cap_minutes),
      unfilled_place_ratings: places.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "The Breakers rear terrace restoration continues through November 2026.",
        "Dia Beacon is closed Tuesday and is intentionally not scheduled.",
        "National Museum of Industrial History is closed Monday and is intentionally not scheduled.",
        "AVAM October 10 opening-day crowds are possible; Baltimore is a documented alternative, not part of the core schedule.",
        "Da Vinci Science Center is a rated rain-day alternative but is excluded from the core Magic score.",
        "Old Sturbridge Village October 14 dated ticket inventory is not yet locked."
      ],
      route_lock_status: "research-complete-bookings-pending"
    }
  };

  const geojson = {
    type: "FeatureCollection",
    name: "route-01-gilded-coast-capital-loop",
    features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({
        type: "Feature",
        id: leg.id,
        properties: {
          feature_kind: "drive_leg",
          route_id: "route-01",
          day: day.day,
          date: day.date,
          from: leg.from,
          to: leg.to,
          distance_miles: leg.distance_miles,
          baseline_minutes: leg.baseline_minutes,
          traffic_risk: leg.traffic_risk,
          map_color: route.route.map_color
        },
        geometry: leg.geometry
      }))),
      ...replacementGeometry.variants.filter((variant) => variant.geometry).map((variant) => ({
        type: "Feature",
        id: variant.id,
        properties: {
          feature_kind: "replacement_drive_variant",
          route_id: "route-01",
          day: variant.day,
          replacement_place_id: variant.replacement_place_id,
          replaces_place_ids: variant.replaces_place_ids,
          baseline_total_miles: variant.baseline_total_miles,
          baseline_total_minutes: variant.baseline_total_minutes,
          delta_minutes: variant.delta_minutes,
          cap_status: variant.cap_status,
          map_color: route.route.map_color
        },
        geometry: variant.geometry
      })),
      ...places.map((place) => ({
        type: "Feature",
        id: place.id,
        properties: {
          feature_kind: "place",
          route_id: "route-01",
          place_id: place.id,
          name: place.name,
          city: place.city,
          state: place.state,
          visit_date: place.visit_date,
          priority: place.priority,
          included_in_magic_score: place.included_in_magic_score
        },
        geometry: { type: "Point", coordinates: place.coordinates }
      })),
      ...Object.entries(geometry.nodes).map(([nodeId, node]) => ({
        type: "Feature",
        id: `node-${nodeId}`,
        properties: {
          feature_kind: "route_node",
          route_id: "route-01",
          node_id: nodeId,
          name: node.name
        },
        geometry: { type: "Point", coordinates: node.coordinates }
      }))
    ]
  };

  await Promise.all([
    writeFile(path.join(ROUTE_DIR, "places.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: "route-01", places }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "images.json"), `${JSON.stringify({ schema_version: "1.0.0", route_id: "route-01", image_policy: "Downloaded Wikimedia Commons derivatives with per-file attribution; contextual coverage is explicitly labeled.", images }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.json"), `${JSON.stringify(route, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, "route.geojson"), `${JSON.stringify(geojson, null, 2)}\n`)
  ]);
  console.log(`Built Route 1 package: ${places.length} places, ${images.length} images, ${days.length} days.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
