#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const external = (url, sourcePage, publisher, description) => ({ kind: "external", url, sourcePage, publisher, description });
const commons = (title, description) => ({ kind: "commons", title, description });

const groups = {
  "ycba": { keep: 2, additions: [
    external("https://britishart.yale.edu/sites/default/files/img/hero/2025-03/YCBA_Feb2025_fullrespreviews-10._WEBjpg.jpg", "https://britishart.yale.edu/hours-and-visitor-information", "Yale Center for British Art", "Exact daylit Yale Center for British Art gallery after its renovation")
  ] },
  "barnes": { keep: 0, additions: [
    external("https://s3.amazonaws.com/barnes-images-p-e1c3c83bd163b8df/assets/sharedBackgroundImages/_1200x630_crop_center-center_82_none/Barnes-Foundation-Plan-Your-Visit_230427_174259.jpg?mtime=1682617380", "https://www.barnesfoundation.org/plan-your-visit", "Barnes Foundation", "Exact current Barnes Foundation galleries and visitor experience"),
    external("https://barnesfoundation.imgix.net/Bf149.jpg?fit=max&fm=pjpg&w=1400", "https://www.barnesfoundation.org/plan-your-visit", "Barnes Foundation", "Artwork and display detail from the Barnes collection"),
    external("https://barnesfoundation.imgix.net/BF138_210611_144100.jpg?fit=max&fm=pjpg&w=1400", "https://www.barnesfoundation.org/plan-your-visit", "Barnes Foundation", "Artwork and ensemble context from the Barnes collection")
  ] },
  "calder-gardens": { keep: 0, additions: [
    external("https://cdn.sanity.io/images/hgw4kgi0/production/ad115b8d1200c27baa0720e83455e9fd52ae15ef-1926x1284.jpg", "https://caldergardens.org/about/", "Calder Gardens", "Exact Calder Gardens architecture, art and planted landscape"),
    external("https://cdn.sanity.io/images/hgw4kgi0/production/ea86556186f212c724ce09e74fc833b07b4aed55-1966x1311.jpg", "https://caldergardens.org/about/", "Calder Gardens", "Exact underground gallery and Calder installation"),
    external("https://cdn.sanity.io/images/hgw4kgi0/production/daee6fdfab1732bc564806b555f653ce0dcc77d0-1901x1268.jpg", "https://caldergardens.org/about/", "Calder Gardens", "Exact Piet Oudolf planting and reflective garden architecture")
  ] },
  "baltimore-industry": { keep: 0, additions: [
    commons("File:BaltimoreMuseumOfIndustry-FromQuay.jpg", "Exact Baltimore Museum of Industry cannery and harbor exterior"),
    commons("File:C. Hoffberger Co. Ice and Coal Wagon, Baltimore Museum of Industry, 1415 Key Highway, Baltimore, MD 21230 (40795711495).jpg", "Exact ice-and-coal wagon inside the Baltimore Museum of Industry"),
    commons("File:Bethlehem Steel Clyde Model 17 DE 90 crane (1942), Baltimore Museum of Industry, 1415 Key Highway, Baltimore, MD 21230 (27825635148).jpg", "Exact working-industry artifact at the Baltimore Museum of Industry")
  ] },
  "peabody-library": { keep: 0, additions: [
    commons("File:George-peabody-library.jpg", "Full-height exact view of the George Peabody Library atrium"),
    commons("File:George Peabody Library Interior.jpg", "Exact cast-iron balcony and skylight interior"),
    commons("File:George Peabody Library, 17 E. Mount Vernon Place, Baltimore, MD 21202 (34397506652).jpg", "Exact visitor-scale view inside the George Peabody Library")
  ] },
  "grand-caverns": { keep: 0, additions: [
    commons("File:Grand Caverns.JPG", "Exact illuminated formations inside Grand Caverns"),
    external("https://visitstaunton.com/wp-content/uploads/2019/08/14859860_1274375692624512_3762730563841130815_o.jpg", "https://visitstaunton.com/listing/grand-caverns/", "Visit Staunton", "Exact Grand Caverns walking-tour passage and formations"),
    external("https://visitshenandoah.org/wp-content/uploads/2018/06/CathedralHallGrandCaverns.jpg", "https://visitshenandoah.org/whats-new/grand-caverns-world-beneath-valley/", "Shenandoah Valley Travel Association", "Exact Cathedral Hall and shield formations at Grand Caverns")
  ] },
  "biltmore": { keep: 0, additions: [
    external("https://www.biltmore.com/wp-content/uploads/2017/06/movies-filmed-at-biltmore-biltmore-house-with-reflection-in-fountain-1080x638.jpg", "https://www.biltmore.com/", "Biltmore Estate", "Exact panoramic Biltmore House, reflecting pool and Blue Ridge setting"),
    commons("File:Winter Garden, Biltmore House, Biltmore Estate, Asheville, NC (46728218821).jpg", "Exact Winter Garden interior inside Biltmore House"),
    external("https://static1.squarespace.com/static/5e6909c2979ad54e2e89c874/5f356b026a66c34dc510fb82/615f33d36bdcf753db153ae5/1711570966734/Biltmore_MKTG_WalledGrdn15-1-1024x683.jpeg?format=1500w", "https://www.bunnhouse.com/blog/fall-in-asheville-2021", "Bunn House Asheville", "Exact Biltmore walled garden and conservatory in fall color")
  ] },
  "boggs-metal-night": { keep: 0, additions: [
    external("https://images.squarespace-cdn.com/content/v1/5dee99ede5b0744826ca9717/1576036516301-S3U4PVZ522ZMFBNZKABD/4763.jpg?format=1500w", "https://www.boggssocial.com/", "Boggs Social and Supply", "Exact Boggs Social live-room and audience context"),
    external("https://images.squarespace-cdn.com/content/v1/5dee99ede5b0744826ca9717/1630943194109-S4LG99Y9J14W6O38JO2L/Boggs+Day+Sky.png?format=1500w", "https://www.boggssocial.com/", "Boggs Social and Supply", "Exact Boggs Social exterior and West End venue setting"),
    external("https://images.squarespace-cdn.com/content/v1/5dee99ede5b0744826ca9717/1630959842828-8HO229ZUZMA3M3XDYKMR/Boggs+Truck.png?format=1500w", "https://www.boggssocial.com/", "Boggs Social and Supply", "Exact Boggs Social courtyard and venue identity")
  ] },
  "fitzgerald-museum": { keep: 1, additions: [
    external("https://images.squarespace-cdn.com/content/v1/5abd4b0b0dbda35038f9d08d/1621542233536-C7BQ9KLT9V7IDA52REVX/FitzMuseumCover.jpg?format=1500w", "https://www.thefitzgeraldmuseum.org/", "Scott and Zelda Fitzgerald Museum", "Exact Fitzgerald Museum room and collection"),
    external("https://images.squarespace-cdn.com/content/v1/5abd4b0b0dbda35038f9d08d/d18cb0e2-3804-41f0-9215-bb6e0e5e5e23/ScottSuite.jpg?format=1500w", "https://www.thefitzgeraldmuseum.org/", "Scott and Zelda Fitzgerald Museum", "Exact Scott suite interior inside the Fitzgerald house")
  ] },
  "annunciation-mobile": { keep: 0, additions: [
    external("https://www.annunciation.al.goarch.org/assets/images/iconostasis%20of%20our%20parish%20temp.jpeg", "https://annunciation.al.goarch.org/", "Annunciation Greek Orthodox Church of Mobile", "Exact iconostasis and apse inside the Mobile parish"),
    external("https://i.ytimg.com/vi/hBTRW65sYNU/maxresdefault.jpg", "https://www.youtube.com/channel/UCElFT1gX1cuRt0o29BNrTUA", "Annunciation Greek Orthodox Church of Mobile", "Exact parish Divine Liturgy still from its official channel"),
    external("https://i.ytimg.com/vi/E-Wv8VJtiS4/maxresdefault.jpg", "https://www.youtube.com/channel/UCElFT1gX1cuRt0o29BNrTUA", "Annunciation Greek Orthodox Church of Mobile", "Second exact sanctuary and worship view from the parish's official channel")
  ] },
  "walter-anderson-ocean-springs": { keep: 0, additions: [
    commons("File:Walter Anderson Museum of Art.png", "Exact Walter Anderson Museum entrance in Ocean Springs"),
    external("https://static.wixstatic.com/media/7d815d_de07ee7085294beb89b19e0ffa848993~mv2_d_5184_3456_s_4_2.jpg", "https://www.walterandersonmuseum.org/", "Walter Anderson Museum of Art", "Exact museum gallery and Walter Anderson artwork"),
    external("https://ace.aaa.com/content/dam/ace/publications/travel/us-destinations/alabama/out-and-about-winter/ocean-springs-walter-1280.jpg", "https://www.ace.aaa.com/publications/travel/us-destinations/south/what-to-do-in-ocean-springs-ms.html", "AAA", "Exact wraparound Walter Anderson mural gallery in Ocean Springs")
  ] },
  "maritime-seafood-biloxi": { keep: 0, additions: [
    commons("File:Maritime & Seafood Industry Museum.jpg", "Exact contemporary waterfront building of the Biloxi museum"),
    external("https://architizer-prod.imgix.net/media/1425333783664MSIM-nydia2.jpg", "https://architizer.com/blog/inspiration/collections/mississippi-civic-buildings/", "Architizer", "Exact two-story Nydia vessel atrium inside the Biloxi museum"),
    external("https://daybydayinourworld.com/wp-content/uploads/2020/01/Commercial-Fishing-Gallery-at-Maritime-and-Seafood-Industry-Museum.jpg", "https://daybydayinourworld.com/low-cost-weekend-ideas/", "Day by Day in Our World", "Exact working-tools and seafood-labor gallery inside the museum")
  ] },
  "mardi-gras-world": { keep: 0, additions: [
    commons("File:Worker at Mardi Gras World painting floats, New Orleans, Louisiana LCCN2011630538.tif", "Exact working artist painting inside Mardi Gras World"),
    commons("File:Mardi Gras World (8542980567).jpg", "Exact giant float sculpture inside Mardi Gras World"),
    commons("File:New Orleans March 2007 - Mardi Gras World.jpg", "Exact float den and work floor at Mardi Gras World")
  ] },
  "jamnola": { keep: 0, additions: [
    commons("File:JAMNOLA on Frenchmen Street.jpg", "Exact current JAMNOLA entrance on Frenchmen Street"),
    external("https://assets-jpcust.jwpsrv.com/thumbnails/akgUSBQl-720.jpg", "https://knov.neworleanstv.tv/m/QoO0KPrw/the-new-jamnola", "New Orleans Television", "Exact new Frenchmen Street JAMNOLA immersive installation"),
    external("https://image.mux.com/OK029JpXGocivOXqCGCRyHPv00o4Pk9paXQjnFYo5BtXc/thumbnail.jpg?height=720&time=0", "https://m.yelp.com/biz/jamnola-new-orleans-2", "JAMNOLA visitor media", "Exact current interactive light installation at JAMNOLA")
  ] },
  "lake-martin-swamp": { keep: 0, additions: [
    commons("File:Lake Martin LA USA swamp.JPG", "Exact cypress-and-water landscape at Lake Martin"),
    commons("File:Lake Martin LA USA cypress 1.JPG", "Exact cypress habitat viewed from Lake Martin water"),
    commons("File:Lake Martin LA USA alligator.JPG", "Exact wild alligator sighting at Lake Martin")
  ] },
  "space-center-houston": { keep: 0, additions: [
    external("https://spacecenter.org/wp-content/uploads/2023/05/VIPTours2023_9.jpg", "https://spacecenter.org/exhibits-and-experiences/", "Space Center Houston", "Exact visitor tour inside Johnson Space Center"),
    external("https://spacecenter.org/wp-content/uploads/2025/01/web-mw-6.jpg", "https://spacecenter.org/exhibits-and-experiences/", "Space Center Houston", "Exact current Space Center Houston gallery and spaceflight hardware"),
    external("https://spacecenter.org/wp-content/uploads/2023/10/DSC07976_edited.jpg", "https://spacecenter.org/exhibits-and-experiences/", "Space Center Houston", "Exact immersive exhibit and spacecraft collection at Space Center Houston")
  ] },
  "buffalo-bayou-cistern": { keep: 0, additions: [
    commons("File:Buffalo Bayou Park Cistern 01.jpg", "Exact repeating columns and reflections inside Buffalo Bayou Park Cistern"),
    commons("File:Buffalo Bayou Park Cistern 02.jpg", "Second exact interior perspective through the Cistern columns"),
    external("https://www.buffalobayou.org/wp-content/uploads/2026/01/26-04-22_Houston_NickiEvansPhoto_BuffaloBayouCistern_Undercurrents_RafaelLozano-Hemmer_WeingartenArt_0045-scaled.jpg", "https://www.buffalobayou.org/location/the-cistern/", "Buffalo Bayou Partnership", "Exact 2026 Undercurrents light-and-voice installation inside the Cistern")
  ] }
};

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 54);
}

async function download(url, destination) {
  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary image curation)" }, redirect: "follow", signal: AbortSignal.timeout(40000) });
    if (response.ok || response.status !== 429 || attempt === 4) break;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1800));
  }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 4000) throw new Error(`Image response too small (${bytes.length} bytes): ${url}`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

function textValue(value) {
  return String(value?.value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function curateCommons(placeId, item, index) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({ action: "query", titles: item.title, prop: "imageinfo", iiprop: "url|extmetadata|mime|size", iiurlwidth: "1400", format: "json", origin: "*" });
  const response = await fetch(api, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0" }, signal: AbortSignal.timeout(40000) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${item.title}`);
  const data = await response.json();
  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.url) throw new Error(`Commons file unavailable: ${item.title}`);
  const metadata = info.extmetadata || {};
  const extension = info.mime === "image/png" ? "png" : "jpg";
  const destination = path.join(IMAGE_DIR, `${placeId}-curated-${index + 1}-${safeName(item.title)}.${extension}`);
  await download(info.thumburl || info.url, destination);
  return {
    title: item.title, mime: info.mime, width: info.width, height: info.height,
    thumbnail_url: info.thumburl || info.url, original_url: info.url,
    source_page: info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
    description: item.description, creator: textValue(metadata.Artist) || "Unknown", credit: textValue(metadata.Credit),
    license: textValue(metadata.LicenseShortName) || "Wikimedia Commons license", license_url: textValue(metadata.LicenseUrl) || info.descriptionurl,
    attribution_required: true, search_query: item.title, local_path: path.relative(ROOT, destination),
    review_status: "needs_visual_review", production_usable: true, rights_status: "commons-license-recorded"
  };
}

async function curateExternal(placeId, item, index) {
  const destination = path.join(IMAGE_DIR, `${placeId}-external-${index + 1}-${safeName(item.publisher)}.jpg`);
  const mime = await download(item.url, destination);
  return {
    title: `${placeId} exact-place image ${index + 1}`, mime, width: null, height: null,
    thumbnail_url: item.url, original_url: item.url, source_page: item.sourcePage,
    description: item.description, creator: item.publisher, credit: item.publisher,
    license: "External venue/editorial image; reuse permission required", license_url: item.sourcePage,
    attribution_required: true, search_query: "hand-curated exact-place image", local_path: path.relative(ROOT, destination),
    review_status: "needs_visual_review", production_usable: false, rights_status: "permission-required-before-public-deployment"
  };
}

await mkdir(IMAGE_DIR, { recursive: true });
const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
delete raw.places.bellingrath;
const requested = new Set(process.argv.slice(2));
for (const [placeId, group] of Object.entries(groups)) {
  if (requested.size && !requested.has(placeId)) continue;
  const record = raw.places[placeId] || { query: placeId, geocode_candidates: [], selected_coordinate: null, image_candidates: [], selected_images: [] };
  const selected = (record.selected_images || []).slice(0, group.keep);
  for (const item of group.additions) {
    const index = selected.length;
    selected.push(item.kind === "commons" ? await curateCommons(placeId, item, index) : await curateExternal(placeId, item, index));
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  if (selected.length !== 3) throw new Error(`${placeId} curated ${selected.length}/3 images`);
  record.selected_images = selected;
  raw.places[placeId] = record;
  await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`${placeId}: curated three images`);
}
