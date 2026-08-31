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
  "new-england-motorcycle": { keep: 0, additions: [
    external("https://static.wixstatic.com/media/4afcb0_8dcd229ed6654816aeb39254b23e3533~mv2.jpg", "https://www.newenglandmotorcyclemuseum.org/", "New England Motorcycle Museum", "Exact museum floor inside the restored Hockanum Mill"),
    external("https://static.wixstatic.com/media/5bfb6f_c9a631e8e43443cb9d7ad97133d9d83d.jpg", "https://www.newenglandmotorcyclemuseum.org/", "New England Motorcycle Museum", "Exact vintage-motorcycle collection in the mill interior"),
    external("https://static.wixstatic.com/media/4afcb0_e4850a2094ca4cefa683f0945472126d~mv2_d_3456_1944_s_2.jpg", "https://www.newenglandmotorcyclemuseum.org/", "New England Motorcycle Museum", "Exact motorcycle display and industrial mill architecture")
  ] },
  "agecroft-hall": { keep: 1, additions: [
    external("https://images.squarespace-cdn.com/content/v1/68879f95decfda713e66975d/fae50a13-60fb-4650-be2c-7341ad6a67b1/Agecroft-2-%2827%29.jpg", "https://www.agecrofthall.org/", "Agecroft Hall", "Exact aerial view of Richmond Agecroft Hall and grounds"),
    external("https://images.squarespace-cdn.com/content/v1/68879f95decfda713e66975d/079eca3c-817a-4aff-a95a-7699b98553ea/BlackCoral-Agecroft-gardens.jpg", "https://www.agecrofthall.org/", "Agecroft Hall", "Exact formal garden at Richmond Agecroft Hall")
  ] },
  "taubman-art": { keep: 0, additions: [
    commons("File:Taubman Museum of Art.jpg", "Exact angular Taubman Museum exterior in downtown Roanoke"),
    commons("File:Taubmanmuseumt.jpg", "Exact Taubman Museum building and glass facade"),
    commons("File:Taubman Museum of Art rooftop view, Roanoke, Virginia (49460146358).jpg", "Exact rooftop view from the Taubman Museum over Roanoke")
  ] },
  "roanoke-pinball": { keep: 0, additions: [
    external("https://img1.wsimg.com/isteam/ip/6eb6bbb1-8363-4974-afe1-80d4909a6642/IMG_1035%201.jpg", "https://roanokepinball.org/", "Roanoke Pinball Museum", "Exact free-play pinball gallery inside the museum"),
    external("https://assets.simpleviewinc.com/simpleview/image/upload/crm/virginia/_P3A4046_cba74ed9-5056-a36a-07d4d43b344e9f78.jpg", "https://www.virginia.org/listing/roanoke-pinball-museum/6002/", "Virginia Tourism Corporation", "Exact rows of playable historic machines in Roanoke Pinball Museum"),
    external("https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_393,q_75,w_660/v1/clients/roanoke/DSC_0188_1d1e7176-e48d-4c5d-9a50-f21c1220b940.jpg", "https://www.visitroanokeva.com/region/cities-and-counties/roanoke/downtown/small-town-tour/", "Visit Virginia's Blue Ridge", "Exact pinball floor inside Center in the Square")
  ] },
  "holy-myrrhbearers": { keep: 0, additions: [
    external("https://eadiocese.org/images/news/2023/03-19-va/336796002_160971460167687_4862318585958926032_n.jpg", "https://eadiocese.org/news_230326_1", "ROCOR Eastern American Diocese", "First Divine Liturgy inside the exact permanent Mount Crawford church"),
    external("https://eadiocese.org/images/news/2024/05-19-mtcraw/15.jpg", "https://eadiocese.org/news_240525_1", "ROCOR Eastern American Diocese", "Exact parish interior during its 2024 patronal feast"),
    external("https://eadiocese.org/images/news/2025/05-04-mcrawford/11.jpg", "https://eadiocese.org/news_250507_1", "ROCOR Eastern American Diocese", "Exact frescoed church interior and congregation during its 2025 feast")
  ] },
  "harrisonburg-public-art": { keep: 0, additions: [
    external("https://visitharrisonburgva.com/wp-content/uploads/2025/10/236220-Students-Enjoying-Downtown-Harrisonburg-Stock-1206_header-1.jpg", "https://visitharrisonburgva.com/tours/downtown-public-art-tour/", "Visit Harrisonburg", "Exact downtown mural and walkable Harrisonburg public-art streetscape"),
    external("https://dfht7c9lgb1wh.cloudfront.net/attachments/clients/582/places/792612/image/cover_photo.jpg?cache_version=1703810544", "https://visitharrisonburgva.com/tours/downtown-public-art-tour/", "Visit Harrisonburg", "Exact whimsical mural on Harrisonburg's official downtown public-art tour"),
    external("https://dfht7c9lgb1wh.cloudfront.net/attachments/clients/582/places/792614/image/cover_photo.jpg?cache_version=1703812221", "https://visitharrisonburgva.com/tours/downtown-public-art-tour/", "Visit Harrisonburg", "Exact bird mural integrated with downtown Harrisonburg architecture")
  ] },
  "carrier-arboretum": { keep: 0, additions: [
    commons("File:Edith J. Carrier Arboretum (31636p).jpg", "Exact pond and woodland at Edith J. Carrier Arboretum"),
    external("https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_480,q_65,w_640/v1/clients/virginia/SV26013003V_044_79b2344d-b57f-4606-b9b0-ab73e016f7fb.jpg", "https://www.virginia.org/blog/post/20-places-to-propose/", "Virginia Tourism Corporation", "Exact Carrier Arboretum bridge and pond in autumn"),
    external("https://appalachiantrail.org/wp-content/uploads/2025/10/Edith-J-Carrier-Arboretum.webp", "https://appalachiantrail.org/protect/conservation/at-community-program/harrisonburg-va/", "Appalachian Trail Conservancy", "Exact footbridge and cultivated pond edge at Carrier Arboretum")
  ] },
  "civil-war-museum": { keep: 1, additions: [
    external("https://nationalcivilwarmuseum.org/wp-content/uploads/2023/05/education-hero.jpg", "https://www.nationalcivilwarmuseum.org/", "National Civil War Museum", "Exact museum learning gallery and artifact interpretation"),
    external("https://www.nationalcivilwarmuseum.org/wp-content/uploads/2024/05/volunteer-lesson.jpg", "https://www.nationalcivilwarmuseum.org/", "National Civil War Museum", "Exact museum interior with volunteer-led object interpretation")
  ] },
  "skylands": { keep: 0, additions: [
    external("https://www.jerseysbest.com/wp-content/uploads/2023/12/Skylands-Manor-front-1024x683.jpg", "https://www.jerseysbest.com/just-in-jersey/in-ringwood-a-botanical-treasure-forever-blooms/", "Jersey's Best", "Exact granite Skylands Manor facade in autumn"),
    commons("File:Skylands2.jpg", "Exact formal garden and manor landscape at Skylands"),
    commons("File:Skylands, Ringwood, NJ - fall garden view.jpg", "Exact autumn garden view at New Jersey Botanical Garden")
  ] },
  "pyramid-mountain": { keep: 2, additions: [
    external("https://www.morrisparks.net/wp-content/uploads/2023/03/ParkPage_PMNHA_Header_600.jpg", "https://www.morrisparks.net/parks_trails/pyramid-mountain-natural-historic-area/", "Morris County Park Commission", "Official Pyramid Mountain forest and glacial-landscape image")
  ] },
  "boston-athenaeum": { keep: 0, additions: [
    external("https://bostonathenaeum.org/wp-content/uploads/2024/01/library-1024x680.png", "https://bostonathenaeum.org/", "Boston Athenaeum", "Exact current reading room inside Boston Athenaeum"),
    commons("File:Interior of the Boston Athenaeum LCCN2007682013.jpg", "Historic exact Boston Athenaeum reading-room interior"),
    commons("File:Boston Athenaeum. Interior - DPLA - 2753475846f50180fb1914b43492b0fa.jpg", "Historic exact Boston Athenaeum interior and book stacks")
  ] },
  "waterworks": { keep: 0, additions: [
    commons("File:Great Engines Hall, Metropolitan Waterworks Museum-9336.jpg", "Exact Great Engines Hall and preserved steam pumps"),
    external("https://waterworksmuseum.org/wp-content/uploads/2017/03/Rosenthal_Leavitt_high-res-1024x683.jpg", "https://waterworksmuseum.org/great-engines-hall/", "Metropolitan Waterworks Museum", "Exact Leavitt steam engine inside Great Engines Hall"),
    commons("File:Chestnut hill pumping station view from reservoir.jpg", "Exact pumping-station architecture viewed from Chestnut Hill Reservoir")
  ] }
};

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 54);
}

async function download(url, destination) {
  let response;
  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary image curation)" }, redirect: "follow", signal: AbortSignal.timeout(30000) });
    if (response.ok || response.status !== 429 || attempt === 3) break;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
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
  const data = await fetch(api, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0" }, signal: AbortSignal.timeout(30000) }).then((response) => response.json());
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
const requested = new Set(process.argv.slice(2));
for (const [placeId, group] of Object.entries(groups)) {
  if (requested.size && !requested.has(placeId)) continue;
  const record = raw.places[placeId];
  if (!record) throw new Error(`Missing research record ${placeId}`);
  const selected = (record.selected_images || []).slice(0, group.keep);
  for (const [additionIndex, item] of group.additions.entries()) {
    const index = selected.length;
    selected.push(item.kind === "commons" ? await curateCommons(placeId, item, index) : await curateExternal(placeId, item, index));
  }
  if (selected.length !== 3) throw new Error(`${placeId} curated ${selected.length}/3 images`);
  record.selected_images = selected;
  raw.places[placeId] = record;
  await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`${placeId}: curated three images`);
}
