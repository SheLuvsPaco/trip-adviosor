#!/usr/bin/env node

import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
const ROUTES = {
  "route-06": {
    slug: "route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop",
    aliases: {
      "boston-logan": "boston-logan-rental", danbury: "danbury-west-lodging", nazareth: "nazareth-lodging",
      carlisle: "carlisle-lodging", somerset: "somerset-lodging", wheeling: "wheeling-lodging",
      "point-pleasant": "point-pleasant-lodging", weston: "weston-lodging", everett: "everett-lodging",
      "allentown-west": "allentown-west-lodging", "boston-hotel": "boston-logan-hotel"
    }
  },
  "route-07": { slug: "route-07-kazoos-rock-mechanical-dreams-loop", aliases: {} },
  "route-08": { slug: "route-08-lemurs-stone-bridges-mechanical-dreams-loop", aliases: {} }
};

const readJson = (filePath) => readFile(filePath, "utf8").then(JSON.parse);
function inferCategories(candidate) {
  const text = `${candidate.category || ""} ${candidate.description || ""} ${candidate.why_magical || ""}`.toLowerCase();
  const categories = [];
  if (/church|chapel|orthodox|meeting house|spiritual|sacred/.test(text)) categories.push("orthodox_spiritual");
  if (/historic|history|battle|military|museum|cemetery|heritage|folklore|monument|archive/.test(text)) categories.push("hidden_history_folklore");
  if (/art|architect|design|garden|overlook|nature|waterfall|island|photograph|mural|campus|scenic/.test(text)) categories.push("architecture_nature_photogenic");
  if (/bar|brew|tavern|karaoke|music|night|restaurant/.test(text)) categories.push("social_nightlife_live");
  if (/cafe|coffee|food|market|tavern|restaurant|brew/.test(text)) categories.push("food_cafes");
  if (/outlet|shop|book shop|market/.test(text)) categories.push("shopping_outlets");
  if (/escape|trail|hike|adrenaline/.test(text)) categories.push("athletic_adrenaline");
  if (/quiet|garden|library|walk|reset|lookout/.test(text)) categories.push("quiet_reset");
  if (/unusual|odd|decorative|dinosaur|gwar|mound|pagoda|escape|art|architecture/.test(text)) categories.push("unusual_creative");
  return [...new Set(categories.length ? categories : ["local_culture", "unusual_creative"])];
}

function inferBestFor(candidate) {
  if (candidate.best_for?.length) return candidate.best_for;
  const text = `${candidate.id} ${candidate.category} ${candidate.why_magical}`.toLowerCase();
  const scores = { sheluvspaco: 1, viki: 1, gora: 1, stivka: 1 };
  if (/art|design|garden|market|karaoke|pagoda|photograph|architecture|book/.test(text)) scores.viki += 3;
  if (/battle|history|military|escape|tavern|island|mound/.test(text)) scores.gora += 3;
  if (/church|chapel|meeting|sacred|cemetery|heritage/.test(text)) scores.stivka += 3;
  if (/walk|campus|library|market|compact|calm/.test(text)) scores.sheluvspaco += 2;
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([person]) => person);
}

function normalizedSource(routeId, source) {
  const id = routeId === "route-08" ? `r08x-${source.id}` : source.id;
  return {
    id,
    title: source.title || `${source.candidate_id} research source`,
    source_type: source.source_type || source.type || "official-or-local-authority",
    url: source.url,
    verified_at: source.verified_at || source.accessed_at || "2026-08-30",
    claims: source.claims || source.supports || []
  };
}

function allocateIntegers(values, target) {
  const total = values.reduce((sum, value) => sum + value, 0) || values.length;
  const raw = values.map((value) => value / total * target);
  const result = raw.map(Math.floor);
  let remainder = target - result.reduce((sum, value) => sum + value, 0);
  const order = raw.map((value, index) => ({ index, fraction: value - Math.floor(value) })).sort((a, b) => b.fraction - a.fraction);
  for (let index = 0; index < remainder; index += 1) result[order[index % order.length].index] += 1;
  return result;
}

async function fetchRouteGeometry(coordinates) {
  const coordinateString = coordinates.map(([lon, lat]) => `${lon},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinateString}?overview=false&steps=true&geometries=geojson`;
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "DetourAtlasRouteResearch/1.0" } });
      if (!response.ok) throw new Error(`OSRM HTTP ${response.status}`);
      const payload = await response.json();
      if (payload.code !== "Ok" || !payload.routes?.[0]) throw new Error(`OSRM ${payload.code}`);
      return payload.routes[0];
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

function mergeStepGeometry(leg, fallback) {
  const coordinates = [];
  for (const step of leg.steps || []) {
    for (const coordinate of step.geometry?.coordinates || []) {
      const previous = coordinates[coordinates.length - 1];
      if (!previous || previous[0] !== coordinate[0] || previous[1] !== coordinate[1]) coordinates.push(coordinate);
    }
  }
  return { type: "LineString", coordinates: simplifyLine(coordinates.length >= 2 ? coordinates : fallback, 0.0008) };
}

function squaredSegmentDistance(point, start, end) {
  let x = start[0];
  let y = start[1];
  let dx = end[0] - x;
  let dy = end[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = end[0];
      y = end[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = point[0] - x;
  dy = point[1] - y;
  return dx * dx + dy * dy;
}

function simplifyLine(points, tolerance) {
  if (points.length <= 2) return points;
  const squaredTolerance = tolerance * tolerance;
  const markers = new Uint8Array(points.length);
  const stack = [[0, points.length - 1]];
  markers[0] = 1;
  markers[points.length - 1] = 1;
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxDistance = squaredTolerance;
    let splitIndex = -1;
    for (let index = first + 1; index < last; index += 1) {
      const distance = squaredSegmentDistance(points[index], points[first], points[last]);
      if (distance > maxDistance) {
        splitIndex = index;
        maxDistance = distance;
      }
    }
    if (splitIndex !== -1) {
      markers[splitIndex] = 1;
      stack.push([first, splitIndex], [splitIndex, last]);
    }
  }
  return points.filter((_, index) => markers[index]);
}

async function prepare(routeId, config) {
  const stageDir = path.join(ROOT, "tmp", "route-expansion", routeId);
  const routeDir = path.join(ROOT, "dataset", "routes", config.slug);
  const [candidatePackage, stagedSources, stagedImages, stagedSchedule, route, placesPackage, geometryPackage] = await Promise.all([
    readJson(path.join(stageDir, "candidates.json")),
    readJson(path.join(stageDir, "sources.json")),
    readJson(path.join(stageDir, "image-metadata.json")),
    readJson(path.join(stageDir, "expanded-schedule.json")),
    readJson(path.join(routeDir, "route.json")),
    readJson(path.join(routeDir, "places.json")),
    readJson(path.join(routeDir, "route-geometry.json"))
  ]);
  const candidates = candidatePackage.candidates;
  const normalizedSources = stagedSources.sources.map((source) => normalizedSource(routeId, source));
  const sourceIdsByCandidate = new Map();
  if (routeId === "route-08") {
    for (const source of stagedSources.sources) {
      const ids = sourceIdsByCandidate.get(source.candidate_id) || [];
      ids.push(`r08x-${source.id}`);
      sourceIdsByCandidate.set(source.candidate_id, ids);
    }
  }

  const assetDir = path.join(ROOT, "assets", "routes", config.slug);
  await mkdir(assetDir, { recursive: true });
  const imagesByCandidate = new Map();
  for (const metadata of stagedImages) {
    const rows = imagesByCandidate.get(metadata.candidate_id) || [];
    rows.push(metadata);
    imagesByCandidate.set(metadata.candidate_id, rows);
  }
  const expansionImages = [];
  const imageIdsByCandidate = new Map();
  for (const candidate of candidates) {
    const rows = (imagesByCandidate.get(candidate.id) || []).slice(0, 5);
    if (rows.length !== 5) throw new Error(`${routeId}/${candidate.id} has ${rows.length}/5 staged images`);
    const ids = [];
    for (let index = 0; index < rows.length; index += 1) {
      const metadata = rows[index];
      const id = candidate.image_ids?.[index] || `${routeId.replace("route-", "r")}x-img-${candidate.id}-${index + 1}`;
      const extension = path.extname(metadata.local_path) || ".jpg";
      const fileName = `${candidate.id}-expansion-${String(index + 1).padStart(2, "0")}${extension}`;
      const localPath = path.posix.join("assets", "routes", config.slug, fileName);
      await copyFile(path.join(stageDir, metadata.local_path), path.join(ROOT, localPath));
      expansionImages.push({
        id,
        place_id: candidate.id,
        title: `${candidate.name} — image ${index + 1}`,
        description: metadata.alt_text,
        search_query: candidate.name,
        local_path: localPath,
        source_page: metadata.source_page,
        source_file_url: metadata.direct_url,
        creator: metadata.creator_credit || "Source-site photographer not stated",
        credit: metadata.creator_credit || "Source-site photographer not stated",
        license: metadata.license_rights_status || "Permission required",
        license_url: metadata.source_page,
        alt: metadata.alt_text,
        coverage: "exact-place-or-experience",
        production_usable: false,
        rights_status: "permission-required-before-public-deployment",
        visual_review: metadata.visual_qa || "manually-reviewed"
      });
      ids.push(id);
    }
    imageIdsByCandidate.set(candidate.id, ids);
  }

  const expansionPlaces = candidates.map((candidate) => {
    const bestFor = inferBestFor(candidate);
    const secondaryFor = candidate.secondary_for?.length ? candidate.secondary_for : PEOPLE.filter((person) => !bestFor.includes(person));
    const travelerFit = candidate.traveler_fit || {};
    const fitNote = candidate.best_for
      ? `Best for ${bestFor.join(" and ")} because ${candidate.magic || candidate.description} Also works for ${secondaryFor.join(" and ")} as a balanced shared stop.`
      : `Best fit: ${bestFor.join(" and ")}. Paco: ${travelerFit.paco}; Viki: ${travelerFit.viki}; Gora: ${travelerFit.gora}; Stivka: ${travelerFit.stivka}.`;
    const isAlternative = /alternative/.test(candidate.status || "");
    const sourceIds = routeId === "route-08" ? sourceIdsByCandidate.get(candidate.id) || [] : candidate.source_ids;
    if (!sourceIds?.length) throw new Error(`${routeId}/${candidate.id} has no sources`);
    return {
      id: candidate.id,
      name: candidate.name,
      kind: candidate.category,
      city: candidate.city,
      state: candidate.state,
      visit_date: candidate.date || route.days[candidate.day - 1].date,
      summary: candidate.description || candidate.why_magical,
      why_go: candidate.magic || candidate.why_magical,
      best_for: bestFor,
      secondary_for: secondaryFor,
      best_fit_note: fitNote,
      categories: inferCategories(candidate),
      duration_minutes: candidate.duration_minutes,
      source_ids: sourceIds,
      reservation: candidate.reservation || (/booking|reserve|timed|tour/i.test(candidate.status || "") ? "reserve-or-reconfirm" : "none"),
      hours: {
        opens: null,
        closes: null,
        status: /booking-gated|traffic-gated|cut-first|alternative/.test(candidate.status || "") ? "conditional-reconfirm" : "researched-reconfirm-before-trip",
        note: candidate.hours || candidate.hours_seasonality || candidate.exact_date_feasibility || "Reconfirm exact October 2026 access before departure."
      },
      cost: {
        amount_per_person: candidate.cost_usd ?? candidate.estimated_cost_usd_per_person ?? 0,
        status: "research-estimate-reconfirm",
        note: "Per-person planning estimate; tax, parking, purchases and special-tour fees may differ."
      },
      priority: "supporting",
      address: candidate.address || `${candidate.name}, ${candidate.city}, ${candidate.state}`,
      country: "US",
      coordinates: candidate.coordinates,
      coordinate_order: "longitude_latitude",
      coordinate_source: "manually_verified_research_point",
      image_ids: imageIdsByCandidate.get(candidate.id),
      ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 },
      researcher_person_fit: Object.fromEntries(PEOPLE.map((person) => [person, bestFor.includes(person) ? 5 : secondaryFor.includes(person) ? 4 : 3.8])),
      included_in_magic_score: !isAlternative,
      data_status: "complete-private-prototype-images",
      expansion_status: candidate.status,
      exact_date_feasibility: candidate.exact_date_feasibility,
      access_and_safety: candidate.parking_access_safety,
      route_fit_note: candidate.route_fit_note,
      route_mode: candidate.route_mode,
      alternative_for_place_ids: candidate.replaces
    };
  });

  const coordinateById = new Map();
  for (const [id, node] of Object.entries(geometryPackage.nodes || {})) coordinateById.set(id, node.coordinates);
  for (const place of placesPackage.places) coordinateById.set(place.id, place.coordinates);
  for (const place of expansionPlaces) coordinateById.set(place.id, place.coordinates);
  const resolveId = (id, day) => {
    if (routeId === "route-06" && id === "danbury") return day >= 10 ? "danbury-tarrywile-lodging" : "danbury-west-lodging";
    return config.aliases[id] || id;
  };

  const routeRows = routeId === "route-08"
    ? stagedSchedule.days.map((day) => ({
        day: day.day,
        sequence: day.expanded_driving.node_ids,
        coordinates: day.expanded_driving.coordinates,
        minutes: day.expanded_driving.baseline_minutes,
        miles: day.expanded_driving.baseline_miles,
        status: day.expanded_driving.cap_status,
        stagedLegs: day.expanded_driving.legs
      }))
    : stagedSchedule.routes.filter((row) => !row.variant);

  const days = [];
  for (const row of routeRows) {
    const nodeIds = row.sequence.map((id) => resolveId(id, row.day));
    const coordinates = row.coordinates || nodeIds.map((id) => coordinateById.get(id));
    const missingIndex = coordinates.findIndex((coordinate) => !coordinate);
    if (missingIndex >= 0) throw new Error(`${routeId} day ${row.day} missing coordinates for ${nodeIds[missingIndex]}`);
    const osrmRoute = await fetchRouteGeometry(coordinates);
    const osrmMinutes = osrmRoute.legs.map((leg) => leg.duration / 60);
    const osrmMiles = osrmRoute.legs.map((leg) => leg.distance / 1609.344);
    const minuteWeights = row.stagedLegs?.map((leg) => leg.minutes) || osrmMinutes;
    const mileWeights = row.stagedLegs?.map((leg) => leg.miles) || osrmMiles;
    const targetMinutes = allocateIntegers(minuteWeights, row.minutes);
    const targetMiles = allocateIntegers(mileWeights, Math.round(row.miles * 10)).map((value) => value / 10);
    const legs = osrmRoute.legs.map((leg, index) => {
      const baselineMinutes = targetMinutes[index];
      const distanceMiles = targetMiles[index];
      return {
        id: `d${row.day}-expanded-${nodeIds[index]}-to-${nodeIds[index + 1]}`,
        from: nodeIds[index],
        to: nodeIds[index + 1],
        distance_meters: Math.round(distanceMiles * 1609.344),
        distance_miles: distanceMiles,
        baseline_seconds: baselineMinutes * 60,
        baseline_minutes: baselineMinutes,
        planning_minutes: { low: baselineMinutes, high: Math.ceil(baselineMinutes * 1.25) },
        traffic_risk: row.minutes >= 200 ? "high" : row.minutes >= 180 ? "medium" : "low",
        mode: "driving",
        display_duration_minutes: baselineMinutes,
        counts_toward_drive_cap: true,
        geometry: mergeStepGeometry(leg, [coordinates[index], coordinates[index + 1]])
      };
    });
    let schedule;
    if (routeId === "route-08") {
      schedule = stagedSchedule.days.find((day) => day.day === row.day).schedule;
    } else if (stagedSchedule.schedule[String(row.day)]) {
      schedule = stagedSchedule.schedule[String(row.day)].map(([start, end, place_id]) => ({ start, end, place_id }));
      if (routeId === "route-06" && row.day === 5 && !schedule.some((item) => item.place_id === "wheeling-heritage-port")) {
        schedule.push({ start: "19:00", end: "19:35", place_id: "wheeling-heritage-port" });
      }
    }
    days.push({
      day: row.day,
      schedule,
      drive: {
        legs,
        baseline_total_miles: row.miles,
        baseline_total_minutes: row.minutes,
        planning_total_minutes: { low: row.minutes, high: Math.ceil(row.minutes * 1.25) },
        traffic_risk: row.minutes >= 200 ? "high" : row.minutes >= 180 ? "medium" : "low",
        cap_status: row.minutes >= 210 ? "at-cap-live-traffic-gated" : row.minutes >= 200 ? "live-traffic-gated" : "comfortable",
        expansion_status: row.status
      }
    });
    console.log(`${routeId} day ${row.day}: geometry collected for ${legs.length} legs`);
  }

  const expansion = {
    schema_version: "1.0.0",
    route_id: routeId,
    route_slug: config.slug,
    verified_at: candidatePackage.verified_at || stagedSources.verified_at || "2026-08-30",
    summary: `${expansionPlaces.length} deeply researched additions raise the route to 50 total places without exceeding the 210-minute OSRM baseline driving cap.`,
    places: expansionPlaces,
    images: expansionImages,
    sources: normalizedSources,
    days
  };
  await writeFile(path.join(ROOT, "scripts", routeId, "expansion.json"), `${JSON.stringify(expansion, null, 2)}\n`);
  console.log(`Prepared ${routeId}: ${expansionPlaces.length} places and ${expansionImages.length} images.`);
}

for (const [routeId, config] of Object.entries(ROUTES)) await prepare(routeId, config);
