#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const requestedIds = new Set(process.argv.slice(2));
const e = (url, sourcePage, publisher, description) => ({ url, sourcePage, publisher, description });

// Exact-place fallbacks only. These are locally cached for the private route-
// selection prototype and explicitly blocked from public deployment until the
// venue/publisher grants reuse permission or a licensed replacement is added.
const groups = {
  "houdini-museum": { replace: [0, 1, 2], entries: [
    e("https://static.wixstatic.com/media/353ffa_0224fb982a434000a69bfb2557340d6d~mv2.jpg", "https://www.houdinimuseum.net/", "Houdini Museum", "Houdini artifacts and displays inside the Scranton museum"),
    e("https://static.wixstatic.com/media/353ffa_86a17f1185f14c0d99abc992bd6a5588~mv2.jpg", "https://www.houdinimuseum.net/", "Houdini Museum", "The museum's intimate collection and performance setting"),
    e("https://static.wixstatic.com/media/353ffa_b4c1301112754f588e5e34345b1e0fd6~mv2.jpg", "https://www.houdinimuseum.net/", "Houdini Museum", "A Houdini-themed exhibit photographed by the venue")
  ]},
  "lancaster-troll-market": { replace: [0, 1, 2], entries: [
    e("https://static.wixstatic.com/media/215659_2224d5cdf44149bb960a6439d1c711d5~mv2.jpg", "https://www.lancastertrollmarket.com/", "Lancaster Troll Market", "The Troll Market's specimen-filled War Room display"),
    e("https://static.wixstatic.com/media/215659_51016a5118314864b2e410aeb1a4a198~mv2.jpg", "https://www.lancastertrollmarket.com/", "Lancaster Troll Market", "Curiosities and handmade objects inside the shop"),
    e("https://static.wixstatic.com/media/215659_885a098f9feb472bbaa89599722a9fac~mv2.jpg", "https://www.lancastertrollmarket.com/", "Lancaster Troll Market", "A fantasy-folklore display from the official gallery")
  ]},
  "wolf-sanctuary": { replace: [0, 1, 2], entries: [
    e("https://wolfsanctuarypa.org/wp-content/uploads/2026/03/DSC04850-1024x683.jpg", "https://wolfsanctuarypa.org/", "Wolf Sanctuary of PA", "A sanctuary wolf photographed on the wooded Speedwell Forge property"),
    e("https://wolfsanctuarypa.org/wp-content/uploads/2025/01/DSC07085-1536x1024.jpg", "https://wolfsanctuarypa.org/", "Wolf Sanctuary of PA", "One of the rescued wolves in a forest enclosure"),
    e("https://wolfsanctuarypa.org/wp-content/uploads/2019/09/3U4A6975b-1.jpg", "https://wolfsanctuarypa.org/", "Wolf Sanctuary of PA", "A close portrait from the sanctuary's official gallery")
  ]},
  "turkey-hill-experience": { replace: [0, 1, 2], entries: [
    e("https://www.turkeyhillexperience.com/assets/video/THE_OOH_Video_forWeb_r3_poster.jpg", "https://www.turkeyhillexperience.com/", "Turkey Hill Experience", "The interactive Turkey Hill Experience exhibit floor"),
    e("https://www.turkeyhillexperience.com/assets/images/banners/banner-taste-lab.png", "https://www.turkeyhillexperience.com/featured-attractions/taste-lab", "Turkey Hill Experience", "The official Taste Lab where visitors build a custom flavor"),
    e("https://www.turkeyhillexperience.com/uploads/social/c019f4a5-4172-48e2-9150-3b73f3cfac0c.png", "https://www.turkeyhillexperience.com/", "Turkey Hill Experience", "A visitor creating ice cream in the Taste Lab")
  ]},
  "storer-college": { replace: [0, 1, 2], entries: [
    e("https://home.nps.gov/common/uploads/cropped_image/primary/5ADBA530-DB5B-6EEE-B346916CFE8958C8.jpg?mode=crop&quality=90&width=1600", "https://home.nps.gov/places/storer-college.htm", "National Park Service", "Anthony Hall, the surviving visual anchor of Storer College on Camp Hill"),
    e("https://www.nps.gov/hafe/learn/historyculture/images/Image-of-early-Storer-College-campus_HAFE00011427-2.jpg", "https://www.nps.gov/hafe/learn/historyculture/storer-college.htm", "National Park Service", "Historic view of the Storer College campus on Camp Hill"),
    e("https://www.nps.gov/hafe/learn/historyculture/images/Early-class-photo-from-Storer-College-HAFE00004952.jpg", "https://www.nps.gov/hafe/learn/historyculture/storer-college.htm", "National Park Service", "An early Storer College class photograph"),
  ]},
  "virginius-island": { replace: [0, 1, 2], entries: [
    e("https://www.nps.gov/hafe/planyourvisit/images/HartlaubE_VirginiusIsland_Trails09_20180730.JPG?maxwidth=1300&maxheight=1300&autorotate=false&format=webp", "https://home.nps.gov/hafe/planyourvisit/virginius-island-trail.htm", "National Park Service", "Industrial ruins beside the Virginius Island trail"),
    e("https://www.nps.gov/common/uploads/grid_builder/hafe/crop1_1/4706350B-DC6B-DA2C-2B02FFC222ACA73E.jpg?width=1000&height=1000&mode=crop&quality=90", "https://home.nps.gov/hafe/planyourvisit/virginius-island-trail.htm", "National Park Service", "Forest and masonry remains on Virginius Island"),
    e("https://www.nps.gov/common/uploads/grid_builder/hafe/crop1_1/B28A77A4-D567-3AA1-479E94ABC52AD37F.jpg?width=1000&height=1000&mode=crop&quality=90", "https://home.nps.gov/hafe/planyourvisit/virginius-island-trail.htm", "National Park Service", "Water-powered industry remains along the Shenandoah")
  ]},
  "jefferson-school": { replace: [0, 1, 2], entries: [
    e("https://jsaahcimagesbucket.s3-accelerate.amazonaws.com/wp-content/uploads/2020/10/slider-4.jpg", "https://jeffschoolheritagecenter.org/", "Jefferson School African American Heritage Center", "The historic Jefferson School and heritage-center campus"),
    e("https://jsaahcimagesbucket.s3-accelerate.amazonaws.com/wp-content/uploads/2020/10/events-1-bg.jpg", "https://jeffschoolheritagecenter.org/", "Jefferson School African American Heritage Center", "Community interpretation and programming at Jefferson School"),
    e("https://jsaahcimagesbucket.s3-accelerate.amazonaws.com/wp-content/uploads/2020/12/volunteering-1.jpg", "https://jeffschoolheritagecenter.org/", "Jefferson School African American Heritage Center", "The heritage center's people-centered local-history work")
  ]},
  "ix-looking-glass": { replace: [0, 1, 2], entries: [
    e("https://static.wixstatic.com/media/e701e9_9110af7d7aef49c78ae794ffa84e0af4f000.jpg", "https://www.ixartpark.org/", "IX Art Park", "Murals and outdoor art at IX Art Park"),
    e("https://static.wixstatic.com/media/e701e9_65e992320b8048079f9fe228c43aec5d~mv2.jpg", "https://www.ixartpark.org/", "IX Art Park", "A kaleidoscopic room inside The Looking Glass"),
    e("https://static.wixstatic.com/media/e701e9_a716143ccbd84afebbf00044f95b399e~mv2.jpg", "https://www.ixartpark.org/", "IX Art Park", "Immersive installation art inside The Looking Glass")
  ]},
  "exchange-hotel": { replace: [0, 1, 2], entries: [
    e("https://files.us.gositebuilder.com/03/a3/03a39e43-ff03-4eb7-b514-356e6e074338.jpg", "https://theexchangehotelmuseum.org/", "Exchange Hotel Civil War Medical Museum", "The Exchange Hotel museum in Gordonsville"),
    e("http://files.us.gositebuilder.com/ed/40/ed40e7db-5465-4d6a-af73-d45c3a073f9c.jpg", "https://theexchangehotelmuseum.org/", "Exchange Hotel Civil War Medical Museum", "The restored Exchange Hotel at golden hour"),
    e("http://files.us.gositebuilder.com/1c/f4/1cf4206e-6772-490b-8c94-ddbd71ef50a9.jpg", "https://theexchangehotelmuseum.org/", "Exchange Hotel Civil War Medical Museum", "A historic medical-transport image used in the museum's interpretation")
  ]},
  "watch-clock": { replace: [1, 2], entries: [
    e("https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill%2Ch_656%2Cq_75%2Cw_1024/https%3A/assets.simpleviewinc.com/simpleview/image/upload/crm/york/clock-display--sized-for-listing-c5d587a75056a36_c5d58873-5056-a36a-07ec3fbc00ae54f0.jpg", "https://www.yorkpa.org/listing/national-watch-%26-clock-museum/5427/", "Explore York", "A dense gallery of clocks and watches inside the museum"),
    e("https://assets.simpleviewinc.com/simpleview/image/upload/crm/cumberland/european_gallery_web_cropped0-d57c43195056a36_d57c4478-5056-a36a-0ba32dfe8d7d5845.jpg", "https://www.visitcumberlandvalley.com/listing/national-watch-%26-clock-museum/3467/", "Cumberland Valley Visitors Bureau", "The museum's European gallery of monumental timepieces")
  ]},
  "balls-bluff": { replace: [0], entries: [
    e("https://gohikevirginia.com/wp-content/uploads/2021/03/Balls-Bluff-Bluff-Views.jpg", "https://gohikevirginia.com/balls-bluff-battlefield/", "Go Hike Virginia", "The Potomac River seen through the woods from the Ball's Bluff overlook")
  ]},
  "transfiguration-orthodox": { replace: [0, 1, 2], entries: [
    e("https://www.transfiguration.va.goarch.org/assets/images/Transfiguration_Orthodox_Church_Charlottesville_Virginia.jpg", "https://www.transfiguration.va.goarch.org/", "Transfiguration Greek Orthodox Church", "The Charlottesville parish exterior"),
    e("https://www.transfiguration.va.goarch.org/assets/images/lg-transfiguration-sign-flowers.jpg", "https://www.transfiguration.va.goarch.org/", "Transfiguration Greek Orthodox Church", "The Transfiguration parish sign and flowers"),
    e("https://www.transfiguration.va.goarch.org/assets/images/lg-narthex-candles.jpg", "https://www.transfiguration.va.goarch.org/", "Transfiguration Greek Orthodox Church", "Candles in the parish narthex")
  ]},
  "dinosaur-land": { replace: [0, 1, 2], entries: [
    e("https://static.wixstatic.com/media/3b4404_79eb9962600c42b8a65487c393d6f4fe~mv2.jpg", "https://www.dinosaurlandva.com/", "Dinosaur Land", "The family-run Dinosaur Land entrance and hillside creatures"),
    e("https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_600,q_75,w_1024/v1/clients/virginia/SV12061203V_099_9da871c2-9544-42a0-9ea8-9bdb616a6012.jpg", "https://www.virginia.org/things-to-do/attractions/museums-and-exhibits/one-of-a-kind/", "Virginia Tourism Corporation", "Dinosaur Land's vintage roadside entrance display"),
    e("https://roadtrippers.com/wp-content/uploads/2019/11/dinosaur-land-4-1160x773.jpg", "https://roadtrippers.com/magazine/dinosaur-land-virginia/", "Roadtrippers", "Colorful concrete creatures at Dinosaur Land")
  ]},
  "fairfield-hills": { replace: [2], entries: [
    e("https://preservationct.org/wp-content/uploads/2021/03/Screenshot-2021-03-08-115521.jpg", "https://preservationct.org/newtown-fairfield-hills-campus-deadline-april-20-2021", "Preservation Connecticut", "An aerial view of the Fairfield Hills adaptive-reuse campus")
  ]},
  "illicks-mill": { replace: [1, 2], entries: [
    e("https://www.hlimg.com/images/things2do/738X538/ttd_1522125701m1.jpg", "https://www.hellotravel.com/united-states-of-america/illick-mill", "HelloTravel", "The restored fieldstone Illick's Mill beside Monocacy Creek"),
    e("https://millpictures.com/images/mills/Pa-48_06-01-ILLICKSMill-2-jM-11-4-87.jpg", "https://millpictures.com/mills.php?millid=111", "MillPictures.com", "Illick's Mill and its creekside setting in Bethlehem")
  ]},
  "newtown-meeting-house": { replace: [0, 1], entries: [
    e("https://s.hdnux.com/photos/01/27/04/22/22824069/4/rawImage.jpg", "https://www.newstimes.com/news/article/Late-publisher-of-Newtown-Bee-used-family-17385134.php", "Hearst Connecticut Media", "The Newtown Meeting House and flagpole in autumn"),
    e("https://newtownmeetinghouse.com/wp-content/uploads/2026/03/NewtownMeetingHouse-BookYourWedding.png", "https://newtownmeetinghouse.com/", "Newtown Meeting House", "The venue's official 2026 meeting-house image"),
    e("https://newtownmeetinghouse.com/wp-content/uploads/2026/05/NewtownMeetinHouse_SpecialEvents.jpg", "https://newtownmeetinghouse.com/", "Newtown Meeting House", "Official 2026 special-events view of the meeting house")
  ]},
  "mapparium": { replace: [0, 1, 2], entries: [
    e("https://media.thebostoncalendar.com/images/q_auto,fl_lossy/v1774382733/recowxvdriw4i84zq8af/mapparium-globe-free-for-boston-marathon-runners.jpg", "https://www.thebostoncalendar.com/events/mapparium-globe-free-for-boston-marathon-runners", "The Boston Calendar", "Visitors on the glass bridge through the illuminated Mapparium"),
    e("https://www.attractionsofamerica.com/images/all_thingstodo/20210528114636_mapparium-boston-massachusetts.jpg", "https://www.attractionsofamerica.com/thingstodo/top-10-unusual-places-to-visit-in-the-usa.php", "Attractions of America", "Inside the illuminated stained-glass Mapparium"),
    e("https://www.fiz-x.com/wp-content/uploads/2013/04/mapparium-stained-glass-globe-mary-baker-eddy-library-boston.jpg", "https://www.fiz-x.com/2013-best-photography-so-far/mapparium-stained-glass-globe-mary-baker-eddy-library-boston/", "FizX", "The glowing glass globe and its central bridge")
  ]}
};

function safeName(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58); }
async function download(url) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 TripAdvisorRouteDataset/5.0" }, redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 4000) throw new Error(`response too small (${bytes.length} bytes)`);
  return { bytes, mime: (response.headers.get("content-type") || "image/jpeg").split(";")[0].toLowerCase() };
}

function extensionFor(mime, url) {
  if (mime === "image/webp") return "webp";
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  throw new Error(`unsupported response type ${mime} from ${url}`);
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  for (const [placeId, group] of Object.entries(groups)) {
    if (requestedIds.size && !requestedIds.has(placeId)) continue;
    const record = raw.places[placeId] || { query: placeId, geocode_candidates: [], selected_coordinate: null, image_candidates: [], selected_images: [] };
    const removed = new Set(group.replace || []);
    const selected = [...(record.selected_images || [])].filter((_, index) => !removed.has(index)).slice(0, 3);
    for (const [index, entry] of group.entries.entries()) {
      if (selected.length >= 3) break;
      try {
        const { bytes, mime } = await download(entry.url);
        const ext = extensionFor(mime, entry.url);
        const destination = path.join(IMAGE_DIR, `${placeId}-external-${index + 1}-${safeName(entry.publisher)}.${ext}`);
        await writeFile(destination, bytes);
        selected.push({ title: `${placeId} curated exact-place image ${selected.length + 1}`, mime, width: null, height: null, thumbnail_url: entry.url, original_url: entry.url, source_page: entry.sourcePage, description: entry.description, creator: entry.publisher, credit: entry.publisher, license: "External venue/editorial image; reuse permission required", license_url: entry.sourcePage, attribution_required: true, search_query: "curated exact-place web image", local_path: path.relative(ROOT, destination), review_status: "needs_visual_review", production_usable: false, rights_status: "permission-required-before-public-deployment" });
        console.log(`${placeId}: imported ${entry.publisher}`);
      } catch (error) { console.warn(`${placeId}: failed ${entry.publisher}: ${error.message}`); }
    }
    if (selected.length === 3) record.selected_images = selected;
    else console.warn(`${placeId}: only ${selected.length}/3 images after exact-place import.`);
    raw.places[placeId] = record;
    await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
