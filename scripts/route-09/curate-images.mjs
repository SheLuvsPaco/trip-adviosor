#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const x = (url, sourcePage, publisher, description) => ({ url, sourcePage, publisher, description });

const groups = {
  "worlds-largest-kaleidoscope": { keep: 1, externals: [
    x("https://emersonresort.com/wp-content/uploads/2025/03/kaleidoscope.jpg", "https://emersonresort.com/kaleidoscope/location-hours/", "Emerson Resort", "Exact World's Largest Kaleidoscope silo and entrance"),
    x("https://emersonresort.com/wp-content/uploads/2025/03/Emerson-2-16.jpg", "https://emersonresort.com/experiences/signature-attractions/", "Emerson Resort", "Exact Emerson kaleidoscope attraction and surrounding Catskills property")
  ] },
  "taber-museum": { keep: 2, externals: [
    x("https://tabermuseum.org/application/files/4214/9378/5416/taber_museum.jpg", "https://tabermuseum.org/", "Thomas T. Taber Museum", "Exact Thomas T. Taber Museum exterior in Williamsport")
  ] },
  "scripture-rocks": { keep: 0, externals: [
    x("https://scripturerocks.com/wp-content/uploads/2023/05/Scripture-Rocks-trail-2022-15-1024x515.jpg", "https://scripturerocks.com/visit/", "Scripture Rocks Heritage Park", "Exact forest trail and inscribed boulders at Scripture Rocks"),
    x("https://scripturerocks.com/wp-content/uploads/2023/05/Scripture-Rocks-Death-Rock.jpg", "https://scripturerocks.com/visit/", "Scripture Rocks Heritage Park", "Exact Death Rock inscription in Scripture Rocks Heritage Park"),
    x("https://scripturerocks.com/wp-content/uploads/2023/05/Scripture-Rocks-Altar-Rock-Douglas-Stahlman.jpg", "https://scripturerocks.com/other-rocks/", "Scripture Rocks Heritage Park", "Historic image of Douglas Stahlman at exact Altar Rock")
  ] },
  "alan-cottrill": { keep: 0, externals: [
    x("https://static.wixstatic.com/media/2fcaa3_155ecd5cf4624d73bea00e4be4d8b02b~mv2.jpg", "https://www.alancottrill.com/", "Alan Cottrill Sculpture Studio", "Exact bronze figures and working sculpture studio"),
    x("https://static.wixstatic.com/media/2fcaa3_9755e18aca98423dab5bb40dc7571e8b~mv2.jpg", "https://www.alancottrill.com/", "Alan Cottrill Sculpture Studio", "Exact Alan Cottrill gallery densely filled with bronzes"),
    x("https://static.wixstatic.com/media/2fcaa3_42bd57a797c345909e6461cf917abe73~mv2.jpg", "https://www.alancottrill.com/", "Alan Cottrill Sculpture Studio", "Exact monumental sculpture work by the Zanesville studio")
  ] },
  "otherworld": { keep: 0, externals: [
    x("https://cdn.prod.website-files.com/6388d2265a4d0f677119f2a1/63d95d98d6742b5f8698968d_Open%20Graph%20-%20otherworld.jpg", "https://www.otherworld.com/main/tickets-and-hours", "Otherworld", "Exact glowing interactive environment at Otherworld Columbus"),
    x("https://cdn.prod.website-files.com/6388d2265a4d0f677119f2a1/6388d2265a4d0f625619f2c2_about-hero-img-1.jpg", "https://www.otherworld.com/", "Otherworld", "Exact artist-built room inside Otherworld"),
    x("https://cdn.prod.website-files.com/6388d2265a4d0f677119f2a1/6388d2265a4d0f757819f2c3_about-hero-img-2.jpg", "https://www.otherworld.com/", "Otherworld", "Exact surreal installation inside Otherworld Columbus")
  ] },
  "columcille": { keep: 1, externals: [
    x("https://static.wixstatic.com/media/e91d68_c646032614c749dc940f3c16bbe7ff35~mv2.jpg", "https://www.columcille.org/visitingthepark", "Columcille Megalith Park", "Exact stone setting in Columcille's wooded sanctuary"),
    x("https://static.wixstatic.com/media/e91d68_7adcd497222344eeb2b09d3037dc208f~mv2.jpg", "https://www.columcille.org/visitingthepark", "Columcille Megalith Park", "Exact monolith and forest landscape at Columcille")
  ] }
};

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 54);
}

async function download(url, destination) {
  const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary image curation)" }, redirect: "follow", signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 4000) throw new Error(`Image response too small (${bytes.length} bytes): ${url}`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

await mkdir(IMAGE_DIR, { recursive: true });
const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
for (const [placeId, group] of Object.entries(groups)) {
  const record = raw.places[placeId];
  if (!record) throw new Error(`Missing research record ${placeId}`);
  const selected = (record.selected_images || []).slice(0, group.keep);
  for (const [index, entry] of group.externals.entries()) {
    const destination = path.join(IMAGE_DIR, `${placeId}-external-${index + 1}-${safeName(entry.publisher)}.jpg`);
    const mime = await download(entry.url, destination);
    selected.push({
      title: `${placeId} exact-place image ${selected.length + 1}`, mime, width: null, height: null,
      thumbnail_url: entry.url, original_url: entry.url, source_page: entry.sourcePage,
      description: entry.description, creator: entry.publisher, credit: entry.publisher,
      license: "External venue image; reuse permission required", license_url: entry.sourcePage,
      attribution_required: true, search_query: "hand-curated exact-place official image",
      local_path: path.relative(ROOT, destination), review_status: "needs_visual_review",
      production_usable: false, rights_status: "permission-required-before-public-deployment"
    });
  }
  if (selected.length !== 3) throw new Error(`${placeId} curated ${selected.length}/3 images`);
  record.selected_images = selected;
  raw.places[placeId] = record;
  await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`${placeId}: curated three exact-place images`);
}
