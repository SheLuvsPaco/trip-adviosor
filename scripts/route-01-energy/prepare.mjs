#!/usr/bin/env node

import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  dayPlans, legacyCoreIds, legacyOptionalIds, manualNodeCoordinates, newPlaces, PEOPLE,
  ROUTE_ID, ROUTE_SLUG, sources, VERIFIED_AT
} from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const RAW_IMAGE_ROOT = path.join(ROOT, "tmp", "route-01-energy-images");
const ASSET_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const OUTPUT_PATH = path.join(ROOT, "scripts", "route-01-energy", "energy-rebuild.json");
const coordinateOverrides = {
  "level99-providence": [-71.4162056, 41.8275772],
  "napatree-point": [-71.8577667, 41.3102],
  "it-adventure-ropes": [-72.9277566, 41.2870369],
  "vessel-hudson-yards": [-74.0005322, 40.7559064],
  "high-line-hudson-yards": [-74.0048, 40.7528],
  "central-park-bike-loop": [-73.9770757, 40.7631535],
  "four-freedoms-park": [-73.960583, 40.750419],
  "beat-the-bomb-brooklyn": [-73.983906, 40.7032035],
  "nj-atv-rentals": [-74.3515534, 40.3344212],
  "baps-akshardham": [-74.5792097, 40.2544674],
  "treetop-quest-philly": [-75.2146868, 39.9936373],
  "ministry-of-awe": [-75.1452624, 39.9510622],
  "ifly-baltimore": [-76.4642072, 39.3692711],
  "cunningham-falls": [-77.4665, 39.6273],
  "sachs-covered-bridge": [-77.2761998, 39.7974187],
  "hawk-mountain-north-lookout": [-75.9868307, 40.6337751],
  "lehigh-valley-grand-prix": [-75.4726935, 40.5942836],
  "palisades-center": [-73.9570363, 41.0972116],
  "purgatory-chasm": [-71.7243753, 42.1329589],
  "boda-borg-boston": [-71.069703, 42.4267231]
};

const imageSelections = {
  "baps-akshardham": [1, 2, 5, 6, 7],
  "beat-the-bomb-brooklyn": [1, 3, 6, 9, 11],
  "boda-borg-boston": [1, 2, 3, 4, 5],
  "central-park-bike-loop": [1, 2, 3, 5, 7],
  "cunningham-falls": [1, 2, 3, 6, 10],
  "four-freedoms-park": [1, 4, 5, 7, 9],
  "hawk-mountain-north-lookout": [1, 3, 4, 6, 10],
  "high-line-hudson-yards": [1, 2, 4, 5, 10],
  "ifly-baltimore": [1, 2, 3, 6, 8],
  "it-adventure-ropes": [1, 2, 4, 6, 12],
  "lehigh-valley-grand-prix": [1, 2, 4, 5, 9],
  "level99-providence": [1, 2, 3, 5, 10],
  "ministry-of-awe": [1, 2, 3, 7, 8],
  "napatree-point": [1, 2, 3, 5, 10],
  "nj-atv-rentals": [1, 2, 3, 4, 9],
  "palisades-center": [1, 2, 4, 7, 10],
  "purgatory-chasm": [1, 2, 3, 6, 10],
  "sachs-covered-bridge": [1, 4, 5, 7, 10],
  "treetop-quest-philly": [1, 4, 5, 7, 10],
  "vessel-hudson-yards": [1, 2, 4, 5, 9]
};

const legacyBucket = {
  "castle-hill-lighthouse": "nature-scenic",
  "cliff-walk": "nature-scenic",
  "newport-car-museum": "high-impact-history-culture",
  "woodbury-common": "shopping",
  "dumbo-brooklyn-bridge-park": "urban-exploration-photo",
  "st-nicholas-wtc": "sacred-spiritual",
  oculus: "urban-exploration-photo",
  "roosevelt-island-tram": "urban-exploration-photo",
  "elfreths-alley": "high-impact-history-culture",
  "eastern-state": "high-impact-history-culture",
  avam: "interactive-puzzle-immersive",
  "lincoln-memorial": "high-impact-history-culture",
  "st-nicholas-cathedral-dc": "sacred-spiritual",
  "gettysburg-battlefield": "high-impact-history-culture",
  "paterson-great-falls": "nature-scenic",
  "submarine-force-museum": "high-impact-history-culture",
  steelstacks: "urban-exploration-photo",
  "reading-terminal-market": "optional-food-nightlife",
  "old-sturbridge-village": "high-impact-history-culture"
};

const museumLike = new Set(["newport-car-museum", "eastern-state", "avam", "submarine-force-museum", "old-sturbridge-village"]);
const photoHeavy = new Set(["castle-hill-lighthouse", "cliff-walk", "dumbo-brooklyn-bridge-park", "st-nicholas-wtc", "oculus", "roosevelt-island-tram", "elfreths-alley", "avam", "lincoln-memorial", "st-nicholas-cathedral-dc", "paterson-great-falls", "steelstacks", "old-sturbridge-village"]);

// Day 11 restores Old Sturbridge Village per traveler request (2026-08-31). The Fairfield -> Sturbridge -> Boston
// routing raises baseline driving from 200 to 216 minutes, so this day carries an explicitly authorized exception
// to the standard 210-minute cap. No other day or route inherits this exception.
const authorizedDayCapMinutes = { 11: 220 };
const readJson = (filePath) => readFile(filePath, "utf8").then(JSON.parse);
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function fitScores(place) {
  return Object.fromEntries(PEOPLE.map((person) => [person, place.best_for.includes(person) ? 5 : place.secondary_for.includes(person) ? 4 : 3.7]));
}

async function fetchLeg(from, to, id, day) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.join(",")};${to.join(",")}?overview=simplified&geometries=geojson&steps=false`;
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "DetourAtlasEnergyRebuild/1.0" } });
      if (!response.ok) throw new Error(`OSRM HTTP ${response.status}`);
      const payload = await response.json();
      const route = payload.routes?.[0];
      if (!route) throw new Error(`OSRM ${payload.code || "missing route"}`);
      const baselineMinutes = Math.max(1, Math.round(route.duration / 60));
      return {
        id: `d${day}-${id}`,
        distance_meters: Math.round(route.distance),
        distance_miles: Math.round(route.distance / 1609.344 * 10) / 10,
        baseline_seconds: Math.round(route.duration),
        baseline_minutes: baselineMinutes,
        planning_minutes: { low: baselineMinutes, high: Math.ceil(baselineMinutes * 1.25) },
        traffic_risk: baselineMinutes >= 75 ? "high" : baselineMinutes >= 40 ? "medium" : "low",
        mode: "driving",
        display_duration_minutes: baselineMinutes,
        counts_toward_drive_cap: true,
        geometry: route.geometry,
        routing_source: url
      };
    } catch (error) {
      lastError = error;
      await sleep(attempt * 700);
    }
  }
  throw lastError;
}

async function main() {
  const [legacyPlacesPackage, legacyImagesPackage, legacySourcesPackage] = await Promise.all([
    readJson(path.join(ROUTE_DIR, "places.json")),
    readJson(path.join(ROUTE_DIR, "images.json")),
    readJson(path.join(ROUTE_DIR, "sources.json"))
  ]);
  const legacyIds = new Set([...legacyCoreIds, ...legacyOptionalIds]);
  const legacyPlaces = legacyPlacesPackage.places.filter((place) => legacyIds.has(place.id)).map((record) => {
    const isCore = legacyCoreIds.includes(record.id);
    const bestFor = record.best_for;
    return {
      ...record,
      priority: isCore ? (record.id === "newport-car-museum" || record.id === "avam" ? "anchor" : record.priority === "optional" || record.priority === "replacement" ? "supporting" : record.priority) : "optional",
      included_in_magic_score: isCore,
      replacement: undefined,
      experience_bucket: legacyBucket[record.id],
      experience_flags: {
        museum_like: museumLike.has(record.id),
        weather_gated: ["castle-hill-lighthouse", "cliff-walk", "dumbo-brooklyn-bridge-park", "lincoln-memorial", "paterson-great-falls", "steelstacks"].includes(record.id),
        booking_required: ["newport-car-museum", "avam", "gettysburg-battlefield"].includes(record.id),
        traffic_gated: ["dumbo-brooklyn-bridge-park", "paterson-great-falls"].includes(record.id),
        high_physicality: false,
        photo_heavy: photoHeavy.has(record.id)
      },
      ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 },
      researcher_person_fit: Object.fromEntries(PEOPLE.map((person) => [person, bestFor.includes(person) ? 5 : record.secondary_for.includes(person) ? 4 : 3.7])),
      energy_rebuild_role: isCore ? "retained-distinctive-anchor" : "optional-unscored-flex"
    };
  });
  if (legacyPlaces.length !== legacyIds.size) throw new Error(`Legacy selection resolved ${legacyPlaces.length}/${legacyIds.size} places`);
  const legacyImageIds = new Set(legacyPlaces.flatMap((place) => place.image_ids));
  const legacyImages = legacyImagesPackage.images.filter((image) => legacyImageIds.has(image.id));

  await mkdir(ASSET_DIR, { recursive: true });
  const newImages = [];
  const imageIdsByPlace = new Map();
  for (const place of newPlaces) {
    const raw = await readJson(path.join(RAW_IMAGE_ROOT, place.id, "raw-metadata.json"));
    const selections = imageSelections[place.id];
    if (!selections || selections.length !== 5) throw new Error(`${place.id} lacks five curated selections`);
    const imageIds = [];
    for (let outputIndex = 0; outputIndex < selections.length; outputIndex += 1) {
      const rawIndex = selections[outputIndex] - 1;
      const metadata = raw[rawIndex];
      if (!metadata) throw new Error(`${place.id} raw image ${rawIndex + 1} is unavailable`);
      const extension = path.extname(metadata.local_path) || ".jpg";
      const fileName = `${place.id}-energy-${String(outputIndex + 1).padStart(2, "0")}${extension}`;
      const localPath = path.posix.join("assets", "routes", ROUTE_SLUG, fileName);
      await copyFile(path.join(RAW_IMAGE_ROOT, metadata.local_path), path.join(ROOT, localPath));
      const id = `img-energy-${place.id}-${outputIndex + 1}`;
      newImages.push({
        id,
        place_id: place.id,
        title: metadata.title,
        description: metadata.alt_text,
        search_query: place.image_query,
        local_path: localPath,
        source_page: metadata.source_page,
        source_file_url: metadata.direct_url,
        creator: metadata.creator_credit,
        credit: metadata.creator_credit,
        license: "Permission required",
        license_url: metadata.source_page,
        alt: metadata.alt_text,
        coverage: "exact-place-or-experience",
        production_usable: false,
        rights_status: "permission-required-before-public-deployment",
        visual_review: "manually-reviewed-contact-sheet"
      });
      imageIds.push(id);
    }
    imageIdsByPlace.set(place.id, imageIds);
  }

  const canonicalNewPlaces = newPlaces.map((record) => ({
    ...record,
    country: "US",
    coordinates: coordinateOverrides[record.id],
    coordinate_order: "longitude_latitude",
    coordinate_source: "manual_verified_address_or_access_point",
    image_ids: imageIdsByPlace.get(record.id),
    ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 },
    researcher_person_fit: fitScores(record),
    data_status: "complete-private-prototype-images",
    energy_rebuild_role: record.included_in_magic_score ? "new-energy-anchor" : "documented-unscored-route-alternative"
  }));
  const allPlaces = [...legacyPlaces, ...canonicalNewPlaces];
  const placeById = new Map(allPlaces.map((place) => [place.id, place]));
  const coordinateById = new Map([...allPlaces.map((place) => [place.id, place.coordinates]), ...Object.entries(manualNodeCoordinates)]);
  const days = [];
  for (const plan of dayPlans) {
    const legs = [];
    for (let index = 0; index < plan.drive_nodes.length - 1; index += 1) {
      const fromId = plan.drive_nodes[index];
      const toId = plan.drive_nodes[index + 1];
      const from = coordinateById.get(fromId);
      const to = coordinateById.get(toId);
      if (!from || !to) throw new Error(`Day ${plan.day} missing drive coordinate: ${fromId} -> ${toId}`);
      const leg = await fetchLeg(from, to, `${fromId}-to-${toId}`, plan.day);
      legs.push({ ...leg, from: fromId, to: toId });
      await sleep(150);
    }
    const totalMinutes = legs.reduce((sum, leg) => sum + leg.baseline_minutes, 0);
    const totalMiles = Math.round(legs.reduce((sum, leg) => sum + leg.distance_miles, 0) * 10) / 10;
    const dayCapMinutes = authorizedDayCapMinutes[plan.day] || 210;
    if (totalMinutes > dayCapMinutes) throw new Error(`Day ${plan.day} exceeds ${dayCapMinutes} minutes: ${totalMinutes}`);
    const isAuthorizedException = Boolean(authorizedDayCapMinutes[plan.day]) && totalMinutes > 210;
    const schedule = plan.schedule.map(([start, end, place_id, priority]) => {
      const scheduledPlace = placeById.get(place_id);
      if (!scheduledPlace) throw new Error(`Day ${plan.day} references missing ${place_id}`);
      return { start, end, place_id, priority, reservation: scheduledPlace.reservation };
    });
    days.push({
      ...plan,
      schedule,
      drive: {
        legs,
        baseline_total_miles: totalMiles,
        baseline_total_minutes: totalMinutes,
        planning_total_minutes: { low: totalMinutes, high: Math.ceil(totalMinutes * 1.25) },
        traffic_risk: totalMinutes >= 180 ? "high" : totalMinutes >= 120 ? "medium" : "low",
        cap_minutes: 210,
        ...(isAuthorizedException ? {
          authorized_cap_exception_minutes: dayCapMinutes,
          cap_exception_reason: "Old Sturbridge Village restored per traveler request (2026-08-31); the Fairfield-Sturbridge-Boston routing raises baseline driving from 200 to 216 minutes. Approved by the trip owner for this day only; no other day or route inherits this exception."
        } : {}),
        cap_status: isAuthorizedException ? "authorized-cap-exception" : totalMinutes >= 200 ? "live-traffic-gated" : totalMinutes >= 180 ? "near-cap" : "comfortable",
        fallback: plan.fallback,
        traffic_note: "OSRM road-network baseline; no live traffic. Recheck two-car ETAs before departure and cut optional content before crossing 210 active driving minutes."
      }
    });
    console.log(`Day ${plan.day}: ${totalMiles} mi / ${totalMinutes} min / ${legs.length} legs`);
  }

  const usedLegacySourceIds = new Set(legacyPlaces.flatMap((place) => place.source_ids));
  usedLegacySourceIds.add("src-noaa-normals");
  const retainedLegacySources = legacySourcesPackage.sources.filter((source) => usedLegacySourceIds.has(source.id));
  const packageSources = [...new Map(
    [...retainedLegacySources, ...sources].map((source) => [source.id, source])
  ).values()];
  const packageData = {
    schema_version: "1.0.0",
    route_id: ROUTE_ID,
    route_slug: ROUTE_SLUG,
    verified_at: VERIFIED_AT,
    legacy_selection: {
      core_ids: legacyCoreIds,
      optional_ids: legacyOptionalIds,
      rationale: "Only distinctive, high-energy or exceptionally atmospheric legacy places survive; generic museums, scheduled food and fixed nightlife are removed."
    },
    places: allPlaces,
    images: [...legacyImages, ...newImages],
    sources: packageSources,
    days,
    route_nodes: manualNodeCoordinates
  };
  await writeFile(OUTPUT_PATH, `${JSON.stringify(packageData, null, 2)}\n`);
  console.log(`Prepared energy rebuild: ${allPlaces.length} places, ${packageData.images.length} images, ${packageData.sources.length} sources.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
