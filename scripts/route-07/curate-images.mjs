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
const x = (url, sourcePage, publisher, description) => ({ url, sourcePage, publisher, description });

// These are exact-place selections that replace false-positive Commons results.
// Commons candidates retain their parsed license metadata. Venue/editorial files
// remain private-prototype-only until licensed or replaced for public release.
const groups = {
  "oakwood-troy": {
    candidates: ["File:Uncle Sam Grave 3.JPG", "File:Earl Chapel 3.jpg", "File:Oakwood Cemetery (35348661680).jpg"], externals: []
  },
  "saratoga-auto": { candidates: [], externals: [
    x("https://images.squarespace-cdn.com/content/v1/521f4119e4b0609085e5ab68/72848f10-9085-4b32-a521-3d4e2225ccd8/IMG_5012.JPG?format=1500w", "https://www.saratogaautomuseum.org/about-main", "Saratoga Automobile Museum", "Exact gallery view inside Saratoga Automobile Museum"),
    x("https://images.squarespace-cdn.com/content/v1/521f4119e4b0609085e5ab68/1599143983346-X8GYNPF9EB52YHXRM88H/IMG_9954_jpg.jpg?format=1500w", "https://www.saratogaautomuseum.org/about-main", "Saratoga Automobile Museum", "Exact automobile exhibition inside the museum"),
    x("https://images.squarespace-cdn.com/content/v1/521f4119e4b0609085e5ab68/1593452948930-1L9G5MTKQ59MLASOLH8Y/NYS+Bottling+Plant+1936-2.jpg?format=1500w", "https://www.saratogaautomuseum.org/about-main", "Saratoga Automobile Museum", "Historic New York State Bottling Plant that now houses the museum")
  ]},
  "boxing-hof": { candidates: ["File:Boxing-Hall-of-Fame-02.jpg", "File:Boxing-Hall-of-Fame-01.jpg"], externals: [
    x("https://exploringupstate.com/wp-content/uploads/2018/02/DSC00854-1024x683.jpg", "https://exploringupstate.com/international-boxing-hall-fame-canastota/", "Exploring Upstate", "Exact heavyweight-champions gallery inside the International Boxing Hall of Fame")
  ]},
  "rmsc-electricity": { candidates: [], externals: [
    x("https://rmsc.org/wp-content/uploads/electricty-theater1.jpg", "https://rmsc.org/exhibits/electricity-theater/", "Rochester Museum & Science Center", "Twin Tesla coils performing inside RMSC Electricity Theater"),
    x("https://rmsc.org/wp-content/uploads/electricty-theater6-1600x1068.jpg", "https://rmsc.org/exhibits/electricity-theater/", "Rochester Museum & Science Center", "A second exact view of the musical high-voltage show"),
    x("https://rmsc.org/wp-content/uploads/electricty-theater10.jpg", "https://rmsc.org/exhibits/electricity-theater/", "Rochester Museum & Science Center", "Visitors experiencing the exact Electricity Theater presentation")
  ]},
  "eden-kazoo": { candidates: ["File:Kazoo manufacturing machines.JPG"], externals: [
    x("https://originalkazoocompany.com/wp-content/uploads/2025/07/Factory-inside-copy-1024x819.jpg", "https://originalkazoocompany.com/our-history/", "Original American Kazoo Company", "Current production floor inside the Original American Kazoo Company"),
    x("https://originalkazoocompany.com/wp-content/uploads/2025/07/Early-1900_s-1024x579.jpg", "https://originalkazoocompany.com/our-history/", "Original American Kazoo Company", "Historic workers and belt-driven machinery in the Eden factory")
  ]},
  "trec-presque-isle": { candidates: ["File:Great Lakes Seaway Trail - Tom Ridge Environmental Center - NARA - 7718831.jpg"], externals: [
    x("https://www.accessibleerie.com/wp-content/uploads/2016/09/TREC-1.jpg", "https://www.accessibleerie.com/business/tom-ridge-environmental-center/", "Accessible Erie", "Exact visitor-information and exhibit lobby inside TREC"),
    x("https://uncoveringpa.com/wp-content/uploads/2014/05/Tom-Ridge-Environmental-Education-Center-4682-001.jpg", "https://uncoveringpa.com/tom-ridge-environmental-center", "Uncovering PA", "Exact glass observation tower and visitor-center architecture of TREC")
  ]},
  "erie-maritime": { candidates: ["File:Brig Niagara behind museum.jpg", "File:Erie PA Maritime Museum (9718734767).jpg"], externals: [
    x("https://storage.googleapis.com/clio-images/medium_24461.53243.jpg", "https://theclio.com/entry/24461", "Clio", "Exact exhibit hall inside Erie Maritime Museum")
  ]},
  "buckland-museum": { candidates: [], externals: [
    x("https://bucklandmuseum.org/wp-content/uploads/2024/05/buckland-museum-of-witchcraft-interior.jpg", "https://bucklandmuseum.org/plan-your-visit/", "Buckland Museum of Witchcraft & Magick", "Exact red-walled artifact gallery inside Buckland Museum"),
    x("https://clevelandtraveler.com/wp-content/uploads/2023/09/IMG_9892-1024x768.jpg", "https://clevelandtraveler.com/buckland-museum-of-witchcraft-magick/", "Cleveland Traveler", "Exact cabinets, ritual objects and seating inside Buckland Museum"),
    x("https://cdn.getyourguide.com/img/tour/f1abacc65a230b5a8bd55712a4433f2c20cbd411db69a267c8564fce31e0d799.jpg/vertical_520_780.jpg", "https://www.getyourguide.com/cleveland-l96017/cleveland-buckland-museum-of-witchcraft-admission-ticket-t1123592/", "Buckland Museum ticketing gallery", "Exact seating, wall art and artifact cabinets inside Buckland Museum")
  ]},
  "all-saints-canonsburg": { candidates: [], externals: [
    x("https://www.allsaintscbg.org/assets/template-elements/background-images/bg-allsaintscbg-iconostasis.jpg", "https://www.allsaintscbg.org/", "All Saints Greek Orthodox Church", "Exact iconostasis inside the Canonsburg parish"),
    x("https://s3-media0.fl.yelpcdn.com/bphoto/7vFDKgDSPLEZI6RUSgtW3A/l.jpg", "https://www.mapquest.com/us/pennsylvania/all-saints-greek-orthodox-church-1951750", "Yelp/MapQuest venue listing", "Exact nave and iconostasis of All Saints Canonsburg"),
    x("https://www.allsaintscbg.org/assets/images/parish_photos/ASC.jpg", "https://www.allsaintscbg.org/", "All Saints Greek Orthodox Church", "Exact aerial view of the Canonsburg parish and its gold-domed church")
  ]},
  "old-bedford-village": {
    candidates: ["File:Old Bedford Village 001.JPG", "File:2009 10 03 - 09974 - Bedford - Old Bedford Village Covered Bridge.jpg", "File:Reconstructed building in Old Bedford Village.jpg"], externals: []
  },
  "mack-museum": {
    candidates: ["File:Mack Truck Historical Museum C.jpg", "File:Mack Truck Historical Museum B.jpg", "File:Mack Truck Historical Museum.jpg"], externals: []
  },
  "uncle-sam-danbury": { candidates: [], externals: [
    x("https://images.squarespace-cdn.com/content/v1/5c6ae28990f904697b81cb83/1587061134209-98P90249357RZV23FSZY/7.jpg?format=1500w", "https://www.danburyrail.org/unclesam", "Danbury Railway Museum", "The restored 38-foot Uncle Sam at its exact Danbury home"),
    x("https://images.squarespace-cdn.com/content/v1/5c6ae28990f904697b81cb83/1586795015889-4D7HTBT0KC19R755TJ3Z/65898828_2253511414732219_6823244002888777728_o.jpg?format=1500w", "https://www.danburyrail.org/unclesam", "Danbury Railway Museum", "Dedication-day view of the giant statue and museum sign"),
    x("https://npr.brightspotcdn.com/b9/69/64db87b54ae0b5eb7734575e80f1/230722-danburytrainmuseum-gm10597.jpg", "https://www.ctpublic.org/show/the-wheelhouse/2023-10-11/election-edition-danbury", "Connecticut Public", "Exact public view of Uncle Sam outside Danbury Railway Museum")
  ]},
  "danbury-fair-carousel": { candidates: ["File:Danbury Fair Mall carousel.jpg"], externals: [
    x("https://www.roadarch.com/p/dfcar1.jpg", "https://www.roadarch.com/carousels/ct2.html", "RoadsideArchitecture.com", "Exact full view of the Danbury Fair double-decker carousel"),
    x("https://www.roadarch.com/p/dfcar2.jpg", "https://www.roadarch.com/carousels/ct2.html", "RoadsideArchitecture.com", "Exact lower and upper carousel figures at Danbury Fair")
  ]},
  "harvard-art": {
    candidates: ["File:Interior view of the Harvard Art Museums - Harvard University - Cambridge, MA - DSC01858.jpg", "File:Interior view of the Harvard Art Museums - Harvard University - Cambridge, MA - DSC01768.jpg", "File:Interior view of the Harvard Art Museums - Harvard University - Cambridge, MA - DSC01785.jpg"], externals: []
  }
};

function safeName(value) {
  return value.toLowerCase().replace(/^file:/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58);
}

async function download(url, destination) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 TripAdvisorRouteDataset/2.0 (personal itinerary image cache)" }, redirect: "follow",
      signal: AbortSignal.timeout(20000)
    });
    if (response.ok) {
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length < 4000) throw new Error(`response too small (${bytes.length} bytes)`);
      await writeFile(destination, bytes);
      return response.headers.get("content-type") || "image/jpeg";
    }
    if (response.status !== 429 || attempt === 5) throw new Error(`${response.status} ${response.statusText}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 5000));
  }
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  for (const [placeId, group] of Object.entries(groups)) {
    if (requestedIds.size && !requestedIds.has(placeId)) continue;
    const record = raw.places[placeId];
    if (!record) throw new Error(`Missing research record ${placeId}`);
    const selected = [];
    for (const title of group.candidates) {
      const candidate = record.image_candidates.find((item) => item.title === title);
      if (!candidate) throw new Error(`${placeId} missing exact Commons candidate ${title}`);
      const extension = candidate.mime === "image/png" ? "png" : candidate.mime === "image/webp" ? "webp" : "jpg";
      const fingerprint = createHash("sha1").update(candidate.original_url).digest("hex").slice(0, 8);
      const destination = path.join(IMAGE_DIR, `${placeId}-curated-${selected.length + 1}-${safeName(title)}-${fingerprint}.${extension}`);
      try {
        await download(candidate.thumbnail_url || candidate.original_url, destination);
      } catch {
        await download(candidate.original_url, destination);
      }
      selected.push({ ...candidate, local_path: path.relative(ROOT, destination), review_status: "needs_visual_review" });
    }
    for (const [index, entry] of group.externals.entries()) {
      const extension = /\.png(?:\?|$)/i.test(entry.url) ? "png" : /\.webp(?:\?|$)/i.test(entry.url) ? "webp" : "jpg";
      const destination = path.join(IMAGE_DIR, `${placeId}-external-${index + 1}-${safeName(entry.publisher)}.${extension}`);
      const mime = await download(entry.url, destination);
      selected.push({
        title: `${placeId} curated exact-place image ${selected.length + 1}`, mime, width: null, height: null,
        thumbnail_url: entry.url, original_url: entry.url, source_page: entry.sourcePage,
        description: entry.description, creator: entry.publisher, credit: entry.publisher,
        license: "External venue/editorial image; reuse permission required", license_url: entry.sourcePage,
        attribution_required: true, search_query: "curated exact-place web image", local_path: path.relative(ROOT, destination),
        review_status: "needs_visual_review", production_usable: false,
        rights_status: "permission-required-before-public-deployment"
      });
    }
    if (selected.length !== 3) throw new Error(`${placeId} curated ${selected.length}/3 images`);
    record.selected_images = selected;
    raw.places[placeId] = record;
    await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
    console.log(`${placeId}: curated 3 exact-place images`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
