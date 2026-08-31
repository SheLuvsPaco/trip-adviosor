#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const requestedIds = new Set(process.argv.slice(2));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const x = (url, sourcePage, publisher, description) => ({ url, sourcePage, publisher, description });

const groups = {
  "wadsworth-atheneum": { candidates: ["File:Wadsworth Atheneum, Hartford, Connecticut.JPG", "File:Interior view - Wadsworth Atheneum - Hartford, CT - DSC04992.jpg", "File:Junius Spencer Morgan Memorial, Wadsworth Atheneum - Hartford, CT - DSC04886.jpg"], externals: [] },
  "dia-beacon": { candidates: ["File:Dia Beacon NY1.jpg", "File:Dia Beacon 04.JPG", "File:Richard Serra at Dia, Beacon - Flickr - minka6.jpg"], externals: [] },
  "bear-mountain-perkins": { candidates: ["File:Perkins Memorial Tower - 54495185010.jpg", "File:Perkins Memorial Tower - 54494838841.jpg", "File:Perkins Memorial Tower - 54495103923.jpg"], externals: [] },
  "goggleworks": { candidates: ["File:Goggle Works.JPG", "File:GoggleWorks.Night.ThoughtProcess.LynGodley.jpg"], externals: [
    x("https://mlhxrkjoggqr.i.optimole.com/cb:m9b-.456d6/w:1200/h:800/q:mauto/f:best/https://goggleworks.org/wp-content/uploads/2021/08/Dan_Glass_Studio-9-scaled.jpg", "https://goggleworks.org/visit/", "GoggleWorks Center for the Arts", "Exact working glass studio inside GoggleWorks")
  ] },
  "tanger-lancaster": { candidates: [], externals: [
    x("https://images.contentstack.io/v3/assets/blt1b696824a455b27c/blt910998367198ba32/67f0984c446cbd3fe1bb1969/Lancaster_Gallery_Slide2.jpg", "https://www.tanger.inc/our-properties/locations/lancaster", "Tanger Inc.", "Exact Under Armour and Bath & Body Works storefronts at Tanger Lancaster"),
    x("https://images.contentstack.io/v3/assets/blt1b696824a455b27c/blt64c12fd499564648/67f0984dd2727f0140214e54/Lancaster_Gallery_Slide4.jpg", "https://www.tanger.inc/our-properties/locations/lancaster", "Tanger Inc.", "Exact Polo Ralph Lauren and Fossil storefronts at Tanger Lancaster"),
    x("https://images.contentstack.io/v3/assets/blt1b696824a455b27c/bltaeef7016e7c1a345/67f0984df8adbe754ddd8e9b/Lancaster_Gallery_Slide5.jpg", "https://www.tanger.inc/our-properties/locations/lancaster", "Tanger Inc.", "Exact American Eagle, Aerie and Aeropostale storefronts at Tanger Lancaster")
  ] },
  "natural-bridge": { candidates: ["File:Natural Bridge of Virginia (Natural Bridge State Park, Virginia, USA) 3.jpg", "File:Natural Bridge of Virginia (Natural Bridge State Park, Virginia, USA) 1.jpg", "File:Natural Bridge of Virginia (Natural Bridge State Park, Virginia, USA) 6.jpg"], externals: [] },
  "duke-lemur-bts": { candidates: ["File:Strepsirrhine infants at Duke Lemur Center.jpg", "File:Propithecus coquereli life stages.jpg", "File:Aye Aye.JPG"], externals: [] },
  "duke-chapel-gardens": { candidates: ["File:Duke Chapel, West Campus, Duke University, Durham, NC (48961063292).jpg", "File:Looking towards the pergola at the Sarah P. Duke Gardens Historic Terraces.jpg", "File:Cloister, Duke Chapel, West Campus, Duke University, Durham, NC (48961081672).jpg"], externals: [] },
  "petersburg-battlefield": { candidates: ["File:Exhibition inside of the Petersburg National Battlefield museum - Sarah Stierch.jpg", "File:Eastern Front Fall Foliage (60828220-7603-41f8-abf7-21b141c5d69e).JPG", "File:The Crater Petersburg National Battlefield - panoramio.jpg"], externals: [] },
  "keystone-tractor": { candidates: ["File:01-Keystone Truck and Tractor Museum.jpg", "File:02-Keystone Truck and Tractor Museum.jpg", "File:03-Keystone Truck and Tractor Museum.jpg"], externals: [] },
  "hotel-greene": { candidates: [], externals: [
    x("https://images.squarespace-cdn.com/content/v1/5cdeed45869a210001300e19/1674751863111-0VF6NWKVXM9HC5W7N3AF/image-asset.jpeg?format=1500w", "https://www.hotelgreene.com/", "Hotel Greene", "Exact theatrical Hotel Greene interior and course atmosphere"),
    x("https://static.wixstatic.com/media/e55314_1e22ec7c9acc45cc989d2e49aa2d57cf~mv2.jpg/v1/fill/w_800,h_1000,al_c,q_85,usm_0.66_1.00_0.01/e55314_1e22ec7c9acc45cc989d2e49aa2d57cf~mv2.jpg", "https://www.sonyasfoodforthought.com/post/indoor-mini-golf-in-downtown-richmond", "Sonya's Food for Thought", "Exact Hotel Greene lobby beneath the This Is Not A Hotel sign"),
    x("https://s3-media0.fl.yelpcdn.com/bphoto/5WXUYVZT6Y0eFKN6y0naRQ/l.jpg", "https://www.postcard.inc/places/hotel-greene-richmond-TicIRDTsfwl", "Yelp/Postcard venue listing", "Exact wood-paneled Hotel Greene mini-golf room")
  ] },
  "poe-museum": { candidates: ["File:Poe museum800px.jpg", "File:Poe Museum Garden - panoramio.jpg", "File:'Enchanted Garden' and Old Stone House (no title) (16811732396).jpg"], externals: [] },
  "brandywine-art": { candidates: ["File:Brandywine River Museum of Art along the river.jpg", "File:Brandywine Museum lobby.jpg", "File:Mill at Brandywine MoA.jpg"], externals: [] },
  "met-cloisters": { candidates: ["File:'The Met -- Cloisters' Entrance New York (NY) April 2016 (26410262154).jpg", "File:The Met Cloisters, NY (2).jpg", "File:The Cuxa Cloister Replica Tower of Benedictine Monastery the Saint-Michel de Cuxa Abbey Catalan Northeast Pyrenees Codalet France The Met Cloisters in Gallery 07.jpg"], externals: [] }
};

function safeName(value) {
  return value.toLowerCase().replace(/^file:/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58);
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim();
}

async function fetchWithBackoff(url, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary image curation)" }, redirect: "follow", signal: AbortSignal.timeout(30000) });
    if (response.ok) return response;
    if (attempt === attempts || response.status !== 429) throw new Error(`${response.status} ${response.statusText}`);
    await sleep(attempt * 6000);
  }
}

async function commonsMetadata(titles) {
  if (!titles.length) return [];
  const params = new URLSearchParams({ action: "query", format: "json", titles: titles.join("|"), prop: "imageinfo", iiprop: "url|extmetadata|mime|size", iiurlwidth: "700" });
  const data = await (await fetchWithBackoff(`https://commons.wikimedia.org/w/api.php?${params}`)).json();
  return Object.values(data.query?.pages || {}).map((page) => {
    const info = page.imageinfo?.[0];
    const meta = info?.extmetadata || {};
    if (!info) return null;
    return {
      title: page.title, mime: info.mime, width: info.width, height: info.height,
      thumbnail_url: info.thumburl || info.url, original_url: info.url, source_page: info.descriptionurl,
      description: stripHtml(meta.ImageDescription?.value || meta.ObjectName?.value || page.title),
      creator: stripHtml(meta.Artist?.value || "Unknown"), credit: stripHtml(meta.Credit?.value || ""),
      license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || "Unknown"),
      license_url: meta.LicenseUrl?.value || null, attribution_required: meta.AttributionRequired?.value === "true",
      search_query: "hand-curated exact Commons file"
    };
  }).filter(Boolean);
}

async function download(url, destination) {
  const response = await fetchWithBackoff(url);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 4000) throw new Error(`response too small (${bytes.length} bytes)`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  for (const [placeId, group] of Object.entries(groups)) {
    if (requestedIds.size && !requestedIds.has(placeId)) continue;
    const record = raw.places[placeId];
    if (!record) throw new Error(`Missing research record ${placeId}`);
    const metadata = await commonsMetadata(group.candidates);
    const metadataByTitle = new Map(metadata.map((item) => [item.title, item]));
    const selected = [];
    for (const title of group.candidates) {
      const candidate = metadataByTitle.get(title);
      if (!candidate) throw new Error(`${placeId} missing exact Commons file ${title}`);
      const retained = (record.selected_images || []).find((item) => item.original_url === candidate.original_url && item.local_path);
      if (retained) { selected.push({ ...candidate, local_path: retained.local_path, review_status: "needs_visual_review" }); continue; }
      const extension = candidate.mime === "image/png" ? "png" : candidate.mime === "image/webp" ? "webp" : "jpg";
      const fingerprint = createHash("sha1").update(candidate.original_url).digest("hex").slice(0, 8);
      const destination = path.join(IMAGE_DIR, `${placeId}-curated-${selected.length + 1}-${safeName(title)}-${fingerprint}.${extension}`);
      await download(candidate.thumbnail_url || candidate.original_url, destination);
      selected.push({ ...candidate, local_path: path.relative(ROOT, destination), review_status: "needs_visual_review", production_usable: candidate.license !== "Unknown", rights_status: "commons-license-recorded" });
      await sleep(1500);
    }
    for (const [index, entry] of group.externals.entries()) {
      const extension = /\.png(?:\?|$)/i.test(entry.url) ? "png" : /\.webp(?:\?|$)/i.test(entry.url) ? "webp" : "jpg";
      const destination = path.join(IMAGE_DIR, `${placeId}-external-${index + 1}-${safeName(entry.publisher)}.${extension}`);
      const mime = await download(entry.url, destination);
      selected.push({
        title: `${placeId} exact-place image ${selected.length + 1}`, mime, width: null, height: null,
        thumbnail_url: entry.url, original_url: entry.url, source_page: entry.sourcePage,
        description: entry.description, creator: entry.publisher, credit: entry.publisher,
        license: "External venue/editorial image; reuse permission required", license_url: entry.sourcePage,
        attribution_required: true, search_query: "hand-curated exact-place web image", local_path: path.relative(ROOT, destination),
        review_status: "needs_visual_review", production_usable: false,
        rights_status: "permission-required-before-public-deployment"
      });
      await sleep(750);
    }
    if (selected.length !== 3) throw new Error(`${placeId} curated ${selected.length}/3 images`);
    record.selected_images = selected;
    raw.places[placeId] = record;
    await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
    console.log(`${placeId}: curated 3 exact-place images`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
