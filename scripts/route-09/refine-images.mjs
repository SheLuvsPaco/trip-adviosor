#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const x = (url, sourcePage, publisher, description) => ({ url, sourcePage, publisher, description });

const groups = {
  "y-bridge": { candidates: [
    "File:Historic Y Bridge, Zanesville, Ohio.jpg",
    "File:Intersection on the Zanesville Y-Bridge.jpg",
    "File:Y-Bridge in Zanesville, Ohio (11123293566).jpg"
  ], externals: [] },
  "butler-institute": { candidates: [
    "File:Butler Institute of American Art 01.jpg",
    "File:Butler Institute of American Art 02.jpg",
    "File:Butler Institute of American Art 03.jpg"
  ], externals: [] },
  "cambridge-glass": { candidates: [], externals: [
    x("https://cambridgeglass.org/wp-content/uploads/2024/10/24d9a4296a8c0a4766de3efbc6674ede-1200x705.png", "https://cambridgeglass.org/", "National Cambridge Collectors", "Exact National Museum of Cambridge Glass collection display"),
    x("https://cambridgeglass.org/wp-content/uploads/2025/04/3011-1435-Epergne-Version-2-Forest-Green1-e1744380945384.jpg", "https://cambridgeglass.org/", "National Cambridge Collectors", "Exact forest-green Cambridge Glass epergne from the museum collection"),
    x("https://cambridgeglass.org/wp-content/uploads/2026/01/Royal-Blue.jpg", "https://cambridgeglass.org/", "National Cambridge Collectors", "Exact royal-blue Cambridge Glass collection object")
  ] },
  "bellefonte-art": { candidates: [], externals: [
    x("https://bellefontemuseum.org/app/cms/assets/uploads/890f63470ac0ec248078f4211e298fb8.jpg?v=1775138922", "https://www.bellefontemuseum.org/", "Bellefonte Art Museum", "Official Bellefonte Art Museum image of the historic Linn House or current installation"),
    x("https://bellefontemuseum.org/app/cms/assets/images/32cead0cd764b7d9dd1424c6a8009ac4.jpg?v=1784213584", "https://www.bellefontemuseum.org/", "Bellefonte Art Museum", "Current official Bellefonte Art Museum exhibition image"),
    x("https://pabucketlist.com/wp-content/uploads/2022/08/Bellefonte-Art-Museum-Exterior.jpg", "https://pabucketlist.com/exploring-victorian-bellefonte-in-centre-county-pa/", "PA Bucket List", "Exact Bellefonte Art Museum exterior in the historic General Philip Benner-Henry Linn House")
  ] },
  "columcille": { keep: 1, candidates: [], externals: [
    x("https://static.wixstatic.com/media/e91d68_c98e2c8076ed4ff6924bb54320d8e177~mv2.jpg", "https://www.columcille.org/visitingthepark", "Columcille Megalith Park", "Exact Celtic Eye stone setting seen through Columcille's trees"),
    x("https://static.wixstatic.com/media/e91d68_7adcd497222344eeb2b09d3037dc208f~mv2.jpg", "https://www.columcille.org/visitingthepark", "Columcille Megalith Park", "Exact monolith in the autumn forest at Columcille")
  ] },
  "asa-packer": { keep: 1, candidates: [], externals: [
    x("https://asapackermansion.com/wp-content/uploads/2026/03/Historical-Asa-Packer-Mansion-Carbon-Jim-Thorpe-80-PoconoMtns-scaled.jpg", "https://asapackermansion.com/events/", "Asa Packer Mansion Museum", "Official historical exterior image of the Asa Packer Mansion"),
    x("https://assets.simpleviewinc.com/simpleview/image/upload/crm/poconos/WEB-Downtown-Jim-Thorpe-Asa-Packer-2-Low-Res-PoconoMtns0-448d35aa054d7cc_448d382f-9214-6600-e9c1f0fd3b58318d.jpg", "https://www.poconomountains.com/listing/asa-packer-mansion/579/", "Pocono Mountains Visitors Bureau", "Exact detailed exterior and porch of Asa Packer Mansion")
  ] },
  "aldrich": { candidates: [], externals: [
    x("https://thealdrich.org/client-uploads/images-general/_aldrich_image_6x4_5_1000px/Aldrich-Lower-Garden-01.jpg", "https://thealdrich.org/page/sculpture-garden", "The Aldrich Contemporary Art Museum", "Exact accessible lower sculpture garden at the Aldrich"),
    x("https://thealdrich.org/client-uploads/images-general/_aldrich_image_6x4_5_2000px/10.-Sculpture-Garden-Installation-View.jpg", "https://thealdrich.org/exhibitions/a-garden-of-promise-and-dissent-outdoor-installation", "The Aldrich Contemporary Art Museum", "Exact outdoor sculpture installation and garden paths at the Aldrich"),
    x("https://www.ridgefieldct.gov/Images/Nonprofits/Aldrich%20Garden%20April%202025%20-%20Copy.jpg?t=202507221019310", "https://www.ridgefieldct.gov/community/ridgefield_nonprofits.php", "Town of Ridgefield", "Exact Aldrich sculpture garden with museum architecture and outdoor artwork")
  ] }
};

function safeName(value) {
  return value.toLowerCase().replace(/^file:/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 56);
}
function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim();
}
async function fetchWithBackoff(url, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary image curation)" }, redirect: "follow", signal: AbortSignal.timeout(30000) });
    if (response.ok) return response;
    if (attempt === attempts || response.status !== 429) throw new Error(`${response.status} ${response.statusText}: ${url}`);
    await sleep(attempt * 5000);
  }
}
async function commonsMetadata(titles) {
  if (!titles.length) return [];
  const params = new URLSearchParams({ action: "query", format: "json", titles: titles.join("|"), prop: "imageinfo", iiprop: "url|extmetadata|mime|size", iiurlwidth: "900" });
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
  if (bytes.length < 4000) throw new Error(`Image response too small (${bytes.length} bytes): ${url}`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

await mkdir(IMAGE_DIR, { recursive: true });
const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
for (const [placeId, group] of Object.entries(groups)) {
  const record = raw.places[placeId];
  if (!record) throw new Error(`Missing research record ${placeId}`);
  const selected = (record.selected_images || []).slice(0, group.keep || 0);
  const metadata = await commonsMetadata(group.candidates || []);
  const byTitle = new Map(metadata.map((item) => [item.title, item]));
  for (const title of group.candidates || []) {
    const item = byTitle.get(title);
    if (!item) throw new Error(`${placeId} missing Commons file ${title}`);
    const fingerprint = createHash("sha1").update(item.original_url).digest("hex").slice(0, 8);
    const destination = path.join(IMAGE_DIR, `${placeId}-refined-${selected.length + 1}-${safeName(title)}-${fingerprint}.jpg`);
    await download(item.thumbnail_url || item.original_url, destination);
    selected.push({ ...item, local_path: path.relative(ROOT, destination), review_status: "needs_visual_review", production_usable: item.license !== "Unknown", rights_status: "commons-license-recorded" });
    await sleep(1200);
  }
  for (const [index, entry] of (group.externals || []).entries()) {
    const destination = path.join(IMAGE_DIR, `${placeId}-refined-external-${index + 1}-${safeName(entry.publisher)}.jpg`);
    const mime = await download(entry.url, destination);
    selected.push({
      title: `${placeId} exact-place image ${selected.length + 1}`, mime, width: null, height: null,
      thumbnail_url: entry.url, original_url: entry.url, source_page: entry.sourcePage,
      description: entry.description, creator: entry.publisher, credit: entry.publisher,
      license: "External venue/editorial image; reuse permission required", license_url: entry.sourcePage,
      attribution_required: true, search_query: "hand-curated exact-place web image",
      local_path: path.relative(ROOT, destination), review_status: "needs_visual_review",
      production_usable: false, rights_status: "permission-required-before-public-deployment"
    });
  }
  if (selected.length !== 3) throw new Error(`${placeId} refined ${selected.length}/3 images`);
  record.selected_images = selected;
  raw.places[placeId] = record;
  await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`${placeId}: refined three exact-place images`);
}

// The official Cottrill homepage selection shows exact works by the studio,
// not necessarily the Sixth Street gallery rooms. Keep that distinction in
// image metadata so the future carousel never mislabels context as interior.
for (const [index, image] of raw.places["alan-cottrill"].selected_images.entries()) {
  image.description = `Selected bronze work by Alan Cottrill shown by the official studio site (${index + 1} of 3)`;
}
await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
