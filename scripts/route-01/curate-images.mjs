#!/usr/bin/env node

// Replaces the carousel images for named Route 01 places with explicitly chosen
// Wikimedia Commons files. The original collector picked images by relevance
// score, which produced technically-valid but unusable results for some stops:
// three Bushwick graffiti walls for a metal venue, an abstract window screen and
// a dark ceiling for the Tenement Museum, a near-black close-up for the Oculus.
//
// Selections here are reviewed by eye. Pass place IDs as arguments to limit the
// run; with no arguments every curated place is refreshed.
//
//   node scripts/route-01/curate-images.mjs
//   node scripts/route-01/curate-images.mjs saint-vitus oculus

import { readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROUTE_SLUG = "route-01-gilded-coast-capital-loop";
const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join("assets", "routes", ROUTE_SLUG);
const UA = { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary research)" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Each entry is exactly three reviewed Commons files, ordered hero-first.
export const selections = {
  "benefit-street": [
    "File:Benefit Street, Providence, RI.jpg",
    "File:135 Benefit Street, Providence RI.jpg",
    "File:2021 George R. Drowne House, 119 Benefit Street, Providence.jpg"
  ],
  "castle-hill-lighthouse": [
    "File:Castle Hill Light - Newport RI.jpg",
    "File:Castle Hill Lighthouse at sunset.jpg",
    "File:Castle Hill Lighthouse, Newport RI (8749605864).jpg"
  ],
  "mystic-seaport": [
    "File:Charles W. Morgan.jpg",
    "File:Roann, Mystic Seaport Museum.jpg",
    "File:Wooden ship's figureheads are featured at the Mystic Seaport Maritime Museum in Mystic, Connecticut LCCN2011631132.tif"
  ],
  "wooster-square": [
    "File:Frank Pepe (20663).jpg",
    "File:Frank Pepe's Apizza White Clam Pizza New Haven Connecticut.jpg",
    "File:Sally's Apizza (54106457880).jpg"
  ],
  "woodbury-common": [
    "File:Woodbury Commons promenade.jpg",
    "File:Woodbury Commons food court.jpg",
    "File:Woodbury Common Premium Outlets Hudson Valley District.jpg"
  ],
  "tenement-museum": [
    "File:The Tenement Museum (51624759160).jpg",
    "File:Tenement Museum, located on the Lower East Side of Manhattan at 97 Orchard Street, New York, New York LCCN2011631392.tif",
    "File:Tenement Museum, located on the Lower East Side of Manhattan at 97 Orchard Street, New York, New York LCCN2011631479.tif"
  ],
  "st-nicholas-wtc": [
    "File:St. Nicholas Greek Orthodox Church - 195245115.jpg",
    "File:St Nicholas Orthodox Church Manhattan in 2024.png",
    "File:St. Nicholas Greek Orthodox Church - 4192.jpg"
  ],
  "oculus": [
    "File:The Oculus - Interior - NYC (51521769328).jpg",
    "File:Oculus at Westfield World Trade Center looking east.jpeg",
    "File:Oculus Interior 264.jpg"
  ],
  "roosevelt-island-tram": [
    "File:Roosevelt Island Tramway half-way view towards Manhattan, 2021-10-01.jpg",
    "File:New York City - Flickr - tinto (1).jpg",
    "File:The Roosevelt Island Tramway from Below.jpg"
  ],
  "saint-vitus": [
    "File:Saint Vitus (venue).jpg",
    "File:Mike Scheidt Performing with YOB, Detroit, 2018.jpg",
    "File:Infant Island at Saint Vitus.jpg"
  ],
  "museum-eldridge-street": [
    "File:Eldridge Street Synagogue Looking Up.jpg",
    "File:Eldridge Street Synagogue (42708).jpg",
    "File:Blue Stained Glass of Eldridge Street Synagogue.jpg"
  ],
  "submarine-force-museum": [
    "File:USS Nautilus SSN571.JPG",
    "File:571 USS Nautilus.JPG",
    "File:Submarine Force Library and Museum, Groton CT.jpg"
  ]
};

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function safeName(value) {
  return value.toLowerCase().replace(/^file:/, "").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "").slice(0, 72);
}

async function fetchWithBackoff(url, attempts = 7) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
    if (response.ok) return response;
    // Retry transient server errors as well as rate limiting; Wikimedia returns
    // an occasional 503 under load and a single one should not abort the run.
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === attempts) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    await sleep(6000 * attempt);
  }
  throw new Error(`exhausted retries: ${url}`);
}

async function imageInfo(titles) {
  const params = new URLSearchParams({
    format: "json", action: "query", titles: titles.join("|"),
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: "1280"
  });
  const response = await fetchWithBackoff(`https://commons.wikimedia.org/w/api.php?${params}`);
  const payload = await response.json();
  const normalized = new Map((payload.query?.normalized || []).map((entry) => [entry.to, entry.from]));
  const byTitle = new Map();
  for (const page of Object.values(payload.query?.pages || {})) {
    if (page.missing !== undefined || !page.imageinfo?.[0]) continue;
    byTitle.set(normalized.get(page.title) || page.title, { title: page.title, info: page.imageinfo[0] });
  }
  return byTitle;
}

async function main() {
  const requested = process.argv.slice(2);
  const places = Object.keys(selections).filter((id) => !requested.length || requested.includes(id));
  const research = JSON.parse(await readFile(path.join(ROUTE_DIR, "research-raw.json"), "utf8"));
  const replaced = [];

  for (const placeId of places) {
    const titles = selections[placeId];
    const found = await imageInfo(titles);
    const missing = titles.filter((title) => !found.has(title));
    if (missing.length) throw new Error(`${placeId}: Commons files not found: ${missing.join(", ")}`);

    const record = research.places[placeId];
    if (!record) throw new Error(`${placeId} is not present in research-raw.json`);
    const previous = record.selected_images || [];

    const selectedImages = [];
    for (const [index, title] of titles.entries()) {
      const { info } = found.get(title);
      // Commons renders .tif/.png masters to JPEG thumbnails; always take the
      // rendered derivative so the browser gets a format it can decode.
      const downloadUrl = info.thumburl || info.url;
      const extension = /\.png(\?|$)/i.test(downloadUrl) ? "png" : "jpg";
      const localPath = path.posix.join(IMAGE_DIR, `${placeId}-${index + 1}-${safeName(title)}.${extension}`);
      const binary = await fetchWithBackoff(downloadUrl);
      await writeFile(path.join(ROOT, localPath), Buffer.from(await binary.arrayBuffer()));

      const meta = info.extmetadata || {};
      const license = stripHtml(meta.LicenseShortName?.value || "") || "Unknown";
      selectedImages.push({
        title,
        mime: extension === "png" ? "image/png" : "image/jpeg",
        width: info.thumbwidth || info.width,
        height: info.thumbheight || info.height,
        thumbnail_url: info.thumburl || info.url,
        original_url: info.url,
        source_page: info.descriptionurl,
        description: stripHtml(meta.ImageDescription?.value || "").slice(0, 400),
        creator: stripHtml(meta.Artist?.value || "") || "Unknown",
        credit: stripHtml(meta.Credit?.value || ""),
        license,
        license_url: meta.LicenseUrl?.value || "",
        attribution_required: !/^(cc0|public domain)/i.test(license),
        search_query: `curated selection for ${placeId}`,
        local_path: localPath,
        review_status: "reviewed"
      });
      await sleep(1100);
    }

    // Drop superseded files so the asset directory does not accumulate orphans.
    const keep = new Set(selectedImages.map((image) => image.local_path));
    for (const image of previous) {
      if (keep.has(image.local_path)) continue;
      await unlink(path.join(ROOT, image.local_path)).catch(() => {});
    }

    record.selected_images = selectedImages;
    replaced.push(`${placeId}: ${selectedImages.length} images`);
    console.log(`curated ${placeId}`);
  }

  research.curated_at = new Date().toISOString();
  await writeFile(path.join(ROUTE_DIR, "research-raw.json"), `${JSON.stringify(research, null, 2)}\n`);
  console.log(`\nUpdated research-raw.json for ${replaced.length} places:`);
  for (const line of replaced) console.log(`  ${line}`);
  // images.json is generated from research-raw.json and curation deletes the
  // files it supersedes, so stopping here would leave the package pointing at
  // images that no longer exist. Rebuild as part of the same operation.
  // images.json is generated from research-raw.json and curation deletes the
  // files it supersedes, so stopping here would leave the package pointing at
  // images that no longer exist. Rebuild as part of the same operation.
  console.log("");
  console.log("rebuilding package...");
  const build = spawnSync(process.execPath, ["scripts/build-route-package.mjs"], { stdio: "inherit" });
  if (build.status !== 0) throw new Error("package build failed after curation");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
