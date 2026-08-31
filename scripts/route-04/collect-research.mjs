#!/usr/bin/env node

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const configUrl = new URL(process.env.ROUTE_COLLECTOR_CONFIG || "./config.mjs", import.meta.url);
const { manualCoordinates, places, preferredCommonsFiles, ROUTE_SLUG } = await import(configUrl);

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const requestedIds = new Set(process.argv.slice(2));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const titleRules = {
  "three-sisters-sanctuary": { reject: [/property taxes/i, /death rates/i, /snap recipients/i, /\bmap\b/i, /chart/i] },
  "fenimore-farm": { reject: [/southern tenant/i, /tyronza/i, /arkansas/i] },
  "cardiff-giant": { reject: [/burpee/i, /gardeners/i, /garden chronicle/i, /cardiff bay/i] },
  "ithaca-falls": { require: [/ithaca falls/i] },
  "artisanworks": { reject: [/gjakov/i, /kosov/i] },
  "house-of-guitars": { reject: [/manchester printworks/i] },
  "buffalo-canalside": { reject: [/chicago/i, /coatsworth/i, /lake ontario/i] },
  "elmwood-essex-music-night": { reject: [/7-eleven/i] },
  "museum-of-earth": { reject: [/barnum/i, /circus/i] },
  "niagara-power-vista": { reject: [/power lines/i, /\bON\b/i] },
  "secret-caverns": { require: [/secret caverns/i] },
  "ny-state-capitol-plaza": { require: [/capitol/i, /nyscapitol/i, /state house/i, /empire state plaza/i, /million dollar staircase/i], reject: [/hevesi/i, /palumbo/i, /senator/i, /assemblymember/i, /italian-american day/i] }
};

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").trim();
}

function safeName(value) {
  return value.toLowerCase().replace(/^file:/, "").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "").slice(0, 72);
}

function isRelevant(place, candidate) {
  const title = candidate.title || "";
  const rules = titleRules[place.id];
  if (rules?.reject?.some((pattern) => pattern.test(title))) return false;
  if (rules?.require && !rules.require.some((pattern) => pattern.test(title))) return false;
  return true;
}

function relevanceScore(place, candidate) {
  const haystack = `${candidate.title} ${candidate.description}`.toLowerCase();
  const tokens = [...new Set(`${place.id} ${candidate.search_query}`.toLowerCase().split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !["museum", "state", "park", "york", "interior", "autumn", "new"].includes(token)))];
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

async function fetchWithBackoff(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary research)" } });
    if (response.ok) return response;
    if (response.status !== 429 || attempt === attempts) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    const retryAfter = Number(response.headers.get("retry-after"));
    await sleep(Number.isFinite(retryAfter) ? Math.min(retryAfter * 1000, 30000) : attempt * 10000);
  }
}

async function fetchJson(url) {
  return (await fetchWithBackoff(url)).json();
}

async function geocode(query) {
  const params = new URLSearchParams({ q: query, format: "jsonv2", limit: "3", addressdetails: "1" });
  const results = await fetchJson(`https://nominatim.openstreetmap.org/search?${params}`);
  await sleep(1100);
  return results.map((item) => ({
    display_name: item.display_name,
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    category: item.category,
    type: item.type,
    importance: item.importance,
    osm_type: item.osm_type,
    osm_id: item.osm_id,
    bounding_box: item.boundingbox?.map(Number)
  }));
}

async function geocodeWithFallback(place) {
  const direct = await geocode(place.geocode);
  if (direct.length) return direct;
  const parts = place.geocode.split(",").map((part) => part.trim());
  const fallback = [parts[0], ...parts.slice(-2)].join(", ");
  return fallback === place.geocode ? direct : geocode(fallback);
}

function normalizeImage(page, query) {
  const info = page.imageinfo?.[0];
  const meta = info?.extmetadata || {};
  if (!info || !["image/jpeg", "image/png", "image/webp", "image/tiff"].includes(info.mime)) return null;
  return {
    title: page.title,
    mime: info.mime,
    width: info.width,
    height: info.height,
    thumbnail_url: info.thumburl || info.url,
    original_url: info.url,
    source_page: info.descriptionurl,
    description: stripHtml(meta.ImageDescription?.value || meta.ObjectName?.value || ""),
    creator: stripHtml(meta.Artist?.value || "Unknown"),
    credit: stripHtml(meta.Credit?.value || ""),
    license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || "Unknown"),
    license_url: meta.LicenseUrl?.value || null,
    attribution_required: meta.AttributionRequired?.value === "true",
    search_query: query
  };
}

async function searchCommons(query) {
  const params = new URLSearchParams({
    action: "query", format: "json", generator: "search", gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6", gsrlimit: "20", prop: "imageinfo", iiprop: "url|extmetadata|mime|size", iiurlwidth: "640"
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  return Object.values(data.query?.pages || {}).sort((a, b) => (a.index || 999) - (b.index || 999))
    .map((page) => normalizeImage(page, query)).filter(Boolean);
}

async function fetchCommonsFiles(titles = []) {
  if (!titles.length) return [];
  const params = new URLSearchParams({
    action: "query", format: "json", titles: titles.join("|"), prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size", iiurlwidth: "640"
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  return Object.values(data.query?.pages || {}).map((page) => normalizeImage(page, "preferred-exact-file")).filter(Boolean);
}

async function downloadImage(url, destination) {
  try { await access(destination); return; } catch { /* download */ }
  const response = await fetchWithBackoff(url);
  await writeFile(destination, new Uint8Array(await response.arrayBuffer()));
}

async function main() {
  await mkdir(ROUTE_DIR, { recursive: true });
  await mkdir(IMAGE_DIR, { recursive: true });
  const outputPath = path.join(ROUTE_DIR, "research-raw.json");
  let output;
  try { output = JSON.parse(await readFile(outputPath, "utf8")); } catch {
    output = {
      generated_at: new Date().toISOString(),
      geocoding_source: "OpenStreetMap Nominatim",
      image_source: "Wikimedia Commons",
      image_policy: "Only reusable Commons derivatives are downloaded; exact-place gaps are explicitly labeled as contextual coverage.",
      places: {}
    };
  }

  const selectedPlaces = requestedIds.size ? places.filter((place) => requestedIds.has(place.id)) : places;
  const unknown = [...requestedIds].filter((id) => !places.some((place) => place.id === id));
  if (unknown.length) throw new Error(`Unknown place ids: ${unknown.join(", ")}`);

  for (const [position, place] of selectedPlaces.entries()) {
    const existing = output.places[place.id];
    const retainedExisting = (existing?.selected_images || []).filter((candidate) => isRelevant(place, candidate));
    if (retainedExisting.length >= 3 && (existing?.selected_coordinate || manualCoordinates[place.id]) && !requestedIds.has(place.id)) {
      console.log(`[${position + 1}/${selectedPlaces.length}] ${place.id}: already complete`);
      continue;
    }
    process.stdout.write(`[${position + 1}/${selectedPlaces.length}] ${place.id}: `);
    let geocodeCandidates = existing?.geocode_candidates || [];
    if (!geocodeCandidates.length) {
      try { geocodeCandidates = await geocodeWithFallback(place); } catch (error) { process.stdout.write(`geocode failed (${error.message}); `); }
    }
    const imageCandidates = [];
    try {
      for (const candidate of await fetchCommonsFiles(preferredCommonsFiles[place.id])) {
        if (!imageCandidates.some((item) => item.original_url === candidate.original_url)) imageCandidates.push(candidate);
      }
    } catch (error) { process.stdout.write(`preferred image lookup failed (${error.message}); `); }
    for (const query of place.images) {
      try {
        for (const candidate of await searchCommons(query)) {
          if (!imageCandidates.some((item) => item.original_url === candidate.original_url)) imageCandidates.push(candidate);
        }
      } catch (error) { process.stdout.write(`image search failed (${error.message}); `); }
      await sleep(1400);
    }

    const selectedImages = requestedIds.has(place.id) ? [] : retainedExisting;
    const preferredTitles = new Set(preferredCommonsFiles[place.id] || []);
    const unusedCandidates = imageCandidates
      .filter((candidate) => isRelevant(place, candidate))
      .filter((candidate) => !selectedImages.some((image) => image.original_url === candidate.original_url))
      .sort((a, b) => {
        const preferredDelta = Number(preferredTitles.has(b.title)) - Number(preferredTitles.has(a.title));
        return preferredDelta || relevanceScore(place, b) - relevanceScore(place, a);
      });
    for (const candidate of unusedCandidates) {
      if (selectedImages.length >= 3) break;
      const index = selectedImages.length;
      const extension = candidate.mime === "image/png" ? "png" : candidate.mime === "image/webp" ? "webp" : "jpg";
      const fingerprint = createHash("sha1").update(candidate.original_url).digest("hex").slice(0, 8);
      const filename = `${place.id}-${index + 1}-${safeName(candidate.title)}-${fingerprint}.${extension}`;
      const destination = path.join(IMAGE_DIR, filename);
      try {
        await downloadImage(candidate.thumbnail_url, destination);
        selectedImages.push({ ...candidate, local_path: path.relative(ROOT, destination), review_status: "needs_visual_review" });
      } catch (error) { process.stdout.write(`download failed (${error.message}); `); }
      await sleep(2600);
    }
    output.places[place.id] = {
      query: place.geocode,
      geocode_candidates: geocodeCandidates,
      selected_coordinate: geocodeCandidates[0] || null,
      image_candidates: imageCandidates,
      selected_images: selectedImages
    };
    output.generated_at = new Date().toISOString();
    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
    console.log(`${geocodeCandidates.length} coordinates; ${selectedImages.length} images`);
    await sleep(650);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
