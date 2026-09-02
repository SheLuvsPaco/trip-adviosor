#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const requestedRoute = process.argv[2] || "route-01-gilded-coast-capital-loop";
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", requestedRoute);

const errors = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

function minutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

async function main() {
  const [route, placePackage, imagePackage, sourcePackage, geojson, replacementGeometry] = await Promise.all([
    readFile(path.join(ROUTE_DIR, "route.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "places.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "images.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "sources.json"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "route.geojson"), "utf8").then(JSON.parse),
    readFile(path.join(ROUTE_DIR, "replacement-geometry.json"), "utf8").then(JSON.parse)
  ]);

  const places = placePackage.places;
  const images = imagePackage.images;
  const sources = sourcePackage.sources;
  const placeIds = new Set(places.map((place) => place.id));
  const imageIds = new Set(images.map((image) => image.id));
  const sourceIds = new Set(sources.map((source) => source.id));
  const driveCapMinutes = route.constraints.premium_one_way_exception_cap_minutes || route.constraints.daily_drive_hard_cap_minutes || 210;

  assert(route.schema_version === "1.0.0", "Unexpected route schema version.");
  assert(route.days.length === 11, `Expected 11 days, found ${route.days.length}.`);
  assert(route.route.total_nights === 11, "Route must encode 11 total nights including Boston on October 14.");
  assert(route.route.airport_date === "2026-10-15", "Airport date must remain October 15, 2026.");
  assert(new Set(places.map((place) => place.id)).size === places.length, "Duplicate place IDs found.");
  assert(new Set(images.map((image) => image.id)).size === images.length, "Duplicate image IDs found.");
  assert(new Set(sources.map((source) => source.id)).size === sources.length, "Duplicate source IDs found.");
  assert(geojson.type === "FeatureCollection", "route.geojson is not a FeatureCollection.");
  assert(route.route.baseline_total_miles > 0, "Route baseline mileage is missing.");
  assert(route.place_ids.length === places.length, "route.place_ids does not match places.json count.");
  assert(route.replacement_place_ids.length === replacementGeometry.variants.length, "Replacement place and variant counts differ.");
  assert(route.replacement_options.length === replacementGeometry.variants.length, "route.replacement_options count is incomplete.");

  for (let index = 0; index < route.days.length; index += 1) {
    const day = route.days[index];
    const expected = new Date(`${route.route.start_date}T12:00:00-04:00`);
    expected.setDate(expected.getDate() + index);
    assert(day.date === expected.toISOString().slice(0, 10), `Day ${day.day} date is not consecutive: ${day.date}.`);
    assert(day.day === index + 1, `Day numbering mismatch at index ${index}.`);
    const dayCapMinutes = day.drive.authorized_cap_exception_minutes || driveCapMinutes;
    assert(day.drive.baseline_total_minutes <= dayCapMinutes, `Day ${day.day} baseline driving exceeds ${dayCapMinutes} minutes: ${day.drive.baseline_total_minutes}.`);
    assert(!day.drive.authorized_cap_exception_minutes || Boolean(day.drive.cap_exception_reason), `Day ${day.day} has an authorized cap exception but no cap_exception_reason.`);
    assert(day.drive.legs.reduce((sum, leg) => sum + leg.baseline_seconds, 0) > 0 || day.drive.legs.length === 0, `Day ${day.day} has no driving baseline unexpectedly.`);
    let previousEnd = -1;
    for (const item of day.schedule) {
      assert(placeIds.has(item.place_id), `Day ${day.day} references unknown place ${item.place_id}.`);
      assert(minutes(item.start) < minutes(item.end), `Day ${day.day} has invalid time window for ${item.place_id}.`);
      assert(minutes(item.start) >= previousEnd, `Day ${day.day} schedule overlaps at ${item.place_id}.`);
      previousEnd = minutes(item.end);
    }
  }

  for (const place of places) {
    assert(Array.isArray(place.coordinates) && place.coordinates.length === 2, `${place.id} has invalid coordinates.`);
    if (place.coordinates?.length === 2) {
      assert(place.coordinates[0] >= -180 && place.coordinates[0] <= 180, `${place.id} longitude is invalid.`);
      assert(place.coordinates[1] >= -90 && place.coordinates[1] <= 90, `${place.id} latitude is invalid.`);
    }
    assert(place.best_for.length > 0, `${place.id} has no best-fit traveler.`);
    assert(typeof place.best_fit_note === "string" && place.best_fit_note.length > 20, `${place.id} lacks a usable best-fit note.`);
    assert(Object.keys(place.ratings.traveler_ratings).length === 4, `${place.id} does not expose four equal traveler ratings.`);
    assert(typeof place.included_in_magic_score === "boolean", `${place.id} is missing Magic-score inclusion state.`);
    for (const sourceId of place.source_ids) assert(sourceIds.has(sourceId), `${place.id} references unknown source ${sourceId}.`);
    for (const imageId of place.image_ids) assert(imageIds.has(imageId), `${place.id} references unknown image ${imageId}.`);
    assert(place.image_ids.length >= 3, `${place.id} has ${place.image_ids.length}/3 production images.`);
    if (place.priority === "replacement") {
      assert(place.included_in_magic_score === false, `${place.id} replacement must be excluded from Magic scoring until promoted.`);
      assert(Boolean(place.replacement), `${place.id} lacks replacement metadata.`);
      assert(place.replacement?.route_variant?.replacement_place_id === place.id, `${place.id} is not linked to its route variant.`);
      assert(place.replacement?.route_variant?.baseline_total_minutes <= driveCapMinutes, `${place.id} replacement route exceeds ${driveCapMinutes} baseline minutes.`);
      for (const replacedId of place.replacement?.replaces_place_ids || []) {
        assert(placeIds.has(replacedId), `${place.id} replaces unknown anchor ${replacedId}.`);
      }
    }
  }

  for (const image of images) {
    assert(placeIds.has(image.place_id), `${image.id} references unknown place ${image.place_id}.`);
    assert(Boolean(image.creator), `${image.id} is missing creator attribution.`);
    assert(Boolean(image.license), `${image.id} is missing a license.`);
    assert(Boolean(image.source_page), `${image.id} is missing a source page.`);
    try {
      await access(path.join(ROOT, image.local_path));
    } catch {
      errors.push(`${image.id} local file is missing: ${image.local_path}`);
    }
  }

  const scheduled = new Set(route.days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  for (const place of places) {
    if (place.included_in_magic_score) assert(scheduled.has(place.id), `${place.id} is core-scored but never scheduled.`);
    if (!scheduled.has(place.id) && place.included_in_magic_score === false && place.priority !== "replacement") warnings.push(`${place.id} is a documented alternative and intentionally unscheduled.`);
  }

  const geoPlaceIds = new Set(geojson.features.filter((feature) => feature.properties?.feature_kind === "place").map((feature) => feature.properties.place_id));
  const geoLegIds = new Set(geojson.features.filter((feature) => feature.properties?.feature_kind === "drive_leg").map((feature) => feature.id));
  const geoReplacementIds = new Set(geojson.features.filter((feature) => feature.properties?.feature_kind === "replacement_drive_variant").map((feature) => feature.id));
  for (const place of places) assert(geoPlaceIds.has(place.id), `${place.id} is missing from route.geojson.`);
  for (const leg of route.days.flatMap((day) => day.drive.legs)) assert(geoLegIds.has(leg.id), `${leg.id} is missing from route.geojson.`);
  for (const variant of replacementGeometry.variants) {
    assert(variant.baseline_total_minutes <= variant.cap_minutes, `${variant.id} exceeds its baseline driving cap.`);
    assert(variant.cap_status === "passes-baseline-cap", `${variant.id} does not carry a passing cap status.`);
    if (variant.geometry) assert(geoReplacementIds.has(variant.id), `${variant.id} geometry is missing from route.geojson.`);
  }

  console.log(`Route: ${route.route.name}`);
  console.log(`Days: ${route.days.length}`);
  console.log(`Places: ${places.length}`);
  console.log(`Images: ${images.length}`);
  console.log(`Replacement options: ${replacementGeometry.variants.length}`);
  console.log(`Baseline route miles: ${route.route.baseline_total_miles}`);
  console.log(`Warnings: ${warnings.length}`);
  for (const warning of warnings) console.log(`WARN ${warning}`);
  if (errors.length) {
    for (const error of errors) console.error(`ERROR ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Validation passed.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
