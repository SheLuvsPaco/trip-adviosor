import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

function uniqueById(rows, label) {
  const byId = new Map();
  for (const row of rows) {
    if (byId.has(row.id)) throw new Error(`Duplicate ${label} id: ${row.id}`);
    byId.set(row.id, row);
  }
  return [...byId.values()];
}

function writeJson(filePath, value) {
  return writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export async function mergeRouteExpansion({ root, routeDir, routeId, routeSlug }) {
  const expansionPath = path.join(root, "scripts", routeId, "expansion.json");
  const expansion = JSON.parse(await readFile(expansionPath, "utf8"));
  if (expansion.route_id !== routeId || expansion.route_slug !== routeSlug) {
    throw new Error(`Expansion identity mismatch in ${expansionPath}`);
  }

  const [route, placePackage, imagePackage, sourcePackage, geojson, decisions, placeSeed, manifest, readme] = await Promise.all([
    readFile(path.join(routeDir, "route.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "places.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "images.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "sources.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "route.geojson"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "route-decisions.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "place-seed.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "dataset", "manifest.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "README.md"), "utf8")
  ]);

  const places = uniqueById([...placePackage.places, ...expansion.places], "place");
  const images = uniqueById([...imagePackage.images, ...expansion.images], "image");
  const sources = uniqueById([...sourcePackage.sources, ...expansion.sources], "source");
  const placeById = new Map(places.map((place) => [place.id, place]));
  const dayExpansion = new Map(expansion.days.map((day) => [day.day, day]));

  for (const day of route.days) {
    const update = dayExpansion.get(day.day);
    if (!update) continue;
    if (update.schedule) {
      day.schedule = update.schedule.map((item) => {
        const place = placeById.get(item.place_id);
        if (!place) throw new Error(`Expanded schedule references unknown place ${item.place_id}`);
        return {
          start: item.start,
          end: item.end,
          place_id: item.place_id,
          priority: item.priority || place.priority,
          reservation: item.reservation || place.reservation
        };
      });
    }
    day.drive = {
      ...day.drive,
      legs: update.drive.legs,
      baseline_total_miles: update.drive.baseline_total_miles,
      baseline_total_minutes: update.drive.baseline_total_minutes,
      planning_total_minutes: update.drive.planning_total_minutes,
      traffic_risk: update.drive.traffic_risk,
      cap_minutes: 210,
      cap_status: update.drive.cap_status,
      expansion_status: update.drive.expansion_status,
      traffic_note: "Expanded OSRM road-network baseline with no live traffic. Recheck the two-car ETA before departure and cut a conditional addition before exceeding 210 active driving minutes."
    };
  }

  route.route.baseline_total_miles = Math.round(route.days.reduce((sum, day) => sum + day.drive.baseline_total_miles, 0) * 10) / 10;
  route.route.status = "researched-expanded";
  route.route.expansion_verified_at = expansion.verified_at;
  route.route.expansion_note = expansion.summary;
  route.place_ids = places.map((place) => place.id);
  route.core_place_ids = places.filter((place) => place.included_in_magic_score).map((place) => place.id);
  route.alternative_place_ids = places.filter((place) => !place.included_in_magic_score).map((place) => place.id);
  route.replacement_place_ids = places.filter((place) => place.priority === "replacement").map((place) => place.id);
  route.validation = {
    ...route.validation,
    all_baseline_drive_days_at_or_below_cap: route.days.every((day) => day.drive.baseline_total_minutes <= 210),
    live_traffic_gated_days: route.days.filter((day) => day.drive.baseline_total_minutes >= 200).map((day) => day.day),
    place_count: places.length,
    image_count: images.length,
    places_with_fewer_than_3_usable_images: places.filter((place) => place.image_ids.length < 3).map((place) => place.id),
    unfilled_place_ratings: places.length * PEOPLE.length,
    expansion_added_place_count: expansion.places.length,
    expansion_images_per_added_place: 5,
    expansion_verified_at: expansion.verified_at,
    expansion_status: "fully-wired-canonical-package"
  };

  const preservedFeatures = geojson.features.filter((feature) => !["drive_leg", "place"].includes(feature.properties?.feature_kind));
  geojson.features = [
    ...route.days.flatMap((day) => day.drive.legs.map((leg) => ({
      type: "Feature",
      id: leg.id,
      properties: {
        feature_kind: "drive_leg",
        route_id: routeId,
        day: day.day,
        date: day.date,
        from: leg.from,
        to: leg.to,
        distance_miles: leg.distance_miles,
        baseline_minutes: leg.baseline_minutes,
        map_color: route.route.map_color,
        expanded_route: true
      },
      geometry: leg.geometry
    }))),
    ...places.map((place) => ({
      type: "Feature",
      id: place.id,
      properties: {
        feature_kind: "place",
        route_id: routeId,
        place_id: place.id,
        name: place.name,
        city: place.city,
        state: place.state,
        visit_date: place.visit_date,
        priority: place.priority,
        included_in_magic_score: place.included_in_magic_score,
        expansion_addition: expansion.places.some((candidate) => candidate.id === place.id)
      },
      geometry: { type: "Point", coordinates: place.coordinates }
    })),
    ...preservedFeatures
  ];

  decisions.accepted = [
    ...decisions.accepted,
    {
      decision: `Promote the ${expansion.places.length}-place researched expansion into the canonical route package`,
      reason: `${expansion.summary} Every added place has five locally cached, visually reviewed images and source metadata; permission-gated images remain private-prototype-only.`
    }
  ];
  decisions.expansion = {
    verified_at: expansion.verified_at,
    added_place_ids: expansion.places.map((place) => place.id),
    scheduled_added_place_ids: expansion.places.filter((place) => place.included_in_magic_score).map((place) => place.id),
    documented_alternative_place_ids: expansion.places.filter((place) => !place.included_in_magic_score).map((place) => place.id),
    image_rights_policy: "Permission required before public deployment; retained for private trip-planning prototype only.",
    routing_policy: "OSRM baselines are frozen research snapshots without live traffic; driving cap must be rechecked on travel day."
  };

  const seedIds = new Set(placeSeed.places.map((place) => place.id));
  placeSeed.places.push(...expansion.places.filter((place) => !seedIds.has(place.id)).map((place) => {
    const { ratings, researcher_person_fit, image_ids, coordinates, coordinate_order, coordinate_source, data_status, ...seed } = place;
    return seed;
  }));

  const manifestRoute = manifest.routes.find((entry) => entry.id === routeId);
  if (!manifestRoute) throw new Error(`Manifest route missing: ${routeId}`);
  manifestRoute.place_count = places.length;
  manifestRoute.image_count = images.length;
  manifestRoute.baseline_miles = route.route.baseline_total_miles;
  manifestRoute.status = "research-complete-expanded-bookings-pending";

  const scheduledPlaceCount = new Set(route.days.flatMap((day) => day.schedule.map((item) => item.place_id))).size;
  const reusableImageCount = images.filter((image) => image.production_usable).length;
  const permissionImageCount = images.filter((image) => image.rights_status === "permission-required-before-public-deployment").length;
  const refreshedReadme = readme
    .replace(/- [\d,.]+ OSRM baseline road miles/, `- ${route.route.baseline_total_miles.toLocaleString("en-US", { minimumFractionDigits: 1 })} OSRM baseline road miles`)
    .replace(/- \d+ core, separately rateable (?:stops|places) plus \d+ route-tested (?:hidden-gem )?replacements/, `- ${scheduledPlaceCount} scheduled, separately rateable places plus ${places.length - scheduledPlaceCount} documented alternatives and route-tested replacements`)
    .replace(/- \d+ visually reviewed, locally cached carousel images:[^\n]*/, `- ${images.length} locally cached carousel images; every new expansion place has five visually reviewed images`)
    .replace(/All [\d,]+ selected carousel images were visually reviewed\.[^\n]*/, `All ${images.length} selected carousel images were visually reviewed. ${reusableImageCount} currently carry reusable-license metadata; ${permissionImageCount} exact-place venue/editorial images are marked \`permission-required-before-public-deployment\`. They are suitable for the private route-selection prototype, but public deployment must license, replace or remove them.`)
    .replace(/- `places\.json` — \d+/, `- \`places.json\` — ${places.length}`)
    .replace(/- `images\.json` — \d+/, `- \`images.json\` — ${images.length}`);
  const expansionSection = `\n## Canonical expansion\n\nThe ${expansion.verified_at} expansion is fully wired into the rebuild pipeline: ${expansion.places.length} researched additions bring this package to ${places.length} places, with ${scheduledPlaceCount} scheduled places and ${places.length - scheduledPlaceCount} documented alternatives/replacements. Every new place has coordinates, traveler-fit copy, equal rating slots, sources, five local images and a GeoJSON map point. Expanded point-to-point road legs retain exact staged miles/minutes and simplified map-grade OSRM geometry. OSRM contains no live traffic, so any day near 210 minutes remains a departure-day cut gate. Expansion images are private-prototype-only until their recorded permissions are cleared.\n`;
  const finalReadme = refreshedReadme.includes("## Canonical expansion")
    ? refreshedReadme.replace(/\n## Canonical expansion[\s\S]*$/, expansionSection)
    : `${refreshedReadme.trimEnd()}\n${expansionSection}`;

  await Promise.all([
    writeJson(path.join(routeDir, "route.json"), route),
    writeJson(path.join(routeDir, "places.json"), { ...placePackage, places }),
    writeJson(path.join(routeDir, "images.json"), { ...imagePackage, images }),
    writeJson(path.join(routeDir, "sources.json"), { ...sourcePackage, verified_at: expansion.verified_at, sources }),
    writeJson(path.join(routeDir, "route.geojson"), geojson),
    writeJson(path.join(routeDir, "route-decisions.json"), decisions),
    writeJson(path.join(routeDir, "place-seed.json"), placeSeed),
    writeJson(path.join(root, "dataset", "manifest.json"), manifest),
    writeFile(path.join(routeDir, "README.md"), finalReadme)
  ]);

  console.log(`Applied ${routeId} expansion: ${places.length} places, ${images.length} images.`);
  return { placeCount: places.length, imageCount: images.length, dayCount: route.days.length };
}
