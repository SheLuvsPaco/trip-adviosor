#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const requestedIds = new Set(process.argv.slice(2));

// Exact-place fallbacks for stops where Wikimedia Commons did not provide a
// complete three-image carousel. Existing reusable Commons selections are
// retained, then these venue/NPS/editorial images fill only the empty slots.
// Non-licensed web images are explicitly blocked from public deployment.
const groups = {
  "prison-showroom": [
    { url: "https://townsquare.media/site/494/files/2024/12/attachment-Untitled-design-2024-12-17T115536.677.jpg", sourcePage: "https://q1065.fm/maine-state-prison-showroom/", publisher: "Q106.5", description: "Handmade furniture and goods inside the Maine State Prison Showroom" },
    { url: "https://gray-wabi-prod.gtv-cdn.com/resizer/v2/XMIBMJHJA5ED7P22AXYQTNBHW4.png?auth=d6a555ba732ade4881ba11ef9839a254978bdb12e5230f48178e77765fbd6c78&height=600&smart=true&width=1200", sourcePage: "https://www.wabi.tv/2025/02/11/maine-state-prison-showroom-offers-quality-goods-made-by-residents-gaining-valuable-skills/", publisher: "WABI", description: "The showroom floor and resident-made woodwork displays" },
    { url: "https://i0.wp.com/bdn-data.s3.amazonaws.com/uploads/2021/12/Optimized-IMG_5960.jpg?fit=780%2C520&ssl=1", sourcePage: "https://www.bangordailynews.com/2021/12/17/news/midcoast/maine-state-prison-showroom-reopens-in-new-location/", publisher: "Bangor Daily News", description: "Rows of Maine State Prison industries crafts at the Thomaston showroom" }
  ],
  "ocean-path": [
    { url: "https://www.nps.gov/common/uploads/structured_data/D583EB46-F042-9F2A-FF92F9226DDB037D.jpg?maxWidth=1600&maxHeight=1200&quality=90", sourcePage: "https://www.nps.gov/acad/index.htm", publisher: "Friends of Acadia / NPS", description: "Sand Beach and the wooded headlands at the start of Ocean Path" },
    { url: "https://www.nps.gov/acad/planyourvisit/images/20190814_OtterCliffs_Climbers-001.jpg", sourcePage: "https://www.nps.gov/acad/planyourvisit/sand-beach-otter-point.htm", publisher: "Ashley L. Conti / Friends of Acadia / NPS", description: "Visitors on the granite coastline beside Otter Cliffs along Ocean Path" }
  ],
  "crypto-museum": [
    { url: "https://cryptozoologymuseum.com/wp-content/uploads/2020/09/ICM-banner.jpg", sourcePage: "https://cryptozoologymuseum.com/", publisher: "International Cryptozoology Museum", description: "Cryptozoology collection banner featuring unusual specimens and lore" },
    { url: "https://cryptozoologymuseum.com/wp-content/uploads/2020/09/cryptocollage.jpg", sourcePage: "https://cryptozoologymuseum.com/", publisher: "International Cryptozoology Museum", description: "A collage of cryptids and collection highlights" }
  ],
  "seal-cove-auto": [
    { url: "https://sealcoveautomuseum.org/wp-content/uploads/2017/03/home-headlight.jpg", sourcePage: "https://sealcoveautomuseum.org/", publisher: "Seal Cove Auto Museum", description: "A brass-era automobile headlamp and polished bodywork" },
    { url: "https://sealcoveautomuseum.org/wp-content/uploads/2017/03/home-underslung.jpg", sourcePage: "https://sealcoveautomuseum.org/", publisher: "Seal Cove Auto Museum", description: "A rare American Underslung displayed in the collection" },
    { url: "https://sealcoveautomuseum.org/wp-content/uploads/2017/03/home-frp.jpg", sourcePage: "https://sealcoveautomuseum.org/", publisher: "Seal Cove Auto Museum", description: "Early motoring engineering inside Seal Cove Auto Museum" }
  ],
  "stj-foliage-train": [
    { url: "https://www.discoverstjohnsbury.com/uploads/1/3/7/2/137246241/autumn-streetscape_orig.jpg", sourcePage: "https://www.discoverstjohnsbury.com/fallforstj.html", publisher: "Discover St. Johnsbury", description: "Fall color and festival atmosphere in downtown St. Johnsbury" },
    { url: "https://www.discoverstjohnsbury.com/uploads/1/3/7/2/137246241/img-2430_orig.jpg", sourcePage: "https://www.discoverstjohnsbury.com/fallforstj.html", publisher: "Discover St. Johnsbury", description: "A Fall for St. J foliage train arriving at Depot Square" },
    { url: "https://www.discoverstjohnsbury.com/uploads/1/3/7/2/137246241/54062618074-8733d1571a-k_orig.jpg", sourcePage: "https://www.discoverstjohnsbury.com/fallforstj.html", publisher: "Discover St. Johnsbury", description: "Historic rail cars and passengers during Fall for St. J" }
  ],
  "dormition-orthodox": [
    { url: "https://www.gocvt.org/assets/images/20210821-det-7-3.jpg", sourcePage: "https://www.gocvt.org/", publisher: "Dormition Greek Orthodox Church", description: "The stone Dormition chapel among evergreens in Burlington" },
    { url: "https://www.gocvt.org/assets/images/parish_photos/church_exterior.jpg", sourcePage: "https://www.gocvt.org/about-us/parishhistory", publisher: "Dormition Greek Orthodox Church", description: "The chapel entrance, cross and Greek dedication mosaic" },
    { url: "https://m.hisvine.com/image/get/zoom/100/offy/0/offx/50/width/1200/file/8431-4502038.jpg", sourcePage: "https://m.hisvine.com/church/86/St-Mary-Archangel-Raphael-Church", publisher: "HisVine parish directory", description: "Dormition chapel facade during its fiftieth-anniversary celebration" }
  ],
  "burlington-waterfront": [
    { url: "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_925,q_75,w_1920/v1/clients/vermont/D21_06_13_0783_2100x1400_2dcd6332_1b3d_455d_8fde_2d568c4f7425_2__a0c9b1a1-36c8-4d86-87cb-6e39398ce915.jpg", sourcePage: "https://www.helloburlingtonvt.com/plan-your-visit/cities-towns/the-waterfront/", publisher: "Hello Burlington", description: "Burlington's boardwalk and Lake Champlain waterfront" },
    { url: "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,g_xy_center,h_925,q_75,w_1920,x_1393,y_1008/v1/clients/vermont/Bruhns_Vermont_2022_8_2100x1400_1c77fd98_b1e7_462a_b724_3b71edc54ab3_40283f34-36c5-4308-a1e8-de3e5deebcd5.jpg", sourcePage: "https://www.helloburlingtonvt.com/plan-your-visit/cities-towns/the-waterfront/", publisher: "Hello Burlington", description: "Golden-hour activity on the Burlington waterfront" }
  ],
  "vins": [
    { url: "https://vinsweb.org/wp-content/uploads/2019/12/FCW-treehouse-01.jpg", sourcePage: "https://vinsweb.org/z-fcw/", publisher: "Vermont Institute of Natural Science", description: "The Forest Canopy Walk treehouse rising above the Vermont woods" },
    { url: "https://vinsweb.org/wp-content/uploads/2019/10/fcw-visit-10-27.jpg", sourcePage: "https://vinsweb.org/z-fcw/", publisher: "Vermont Institute of Natural Science", description: "Visitors crossing the elevated Forest Canopy Walk" },
    { url: "https://vinsweb.org/wp-content/uploads/2019/10/fcw-aerial-IB-10-27-1.jpg", sourcePage: "https://vinsweb.org/z-fcw/", publisher: "Vermont Institute of Natural Science", description: "An aerial view of the canopy structure threading through the forest" }
  ],
  "path-of-life": [
    { url: "https://images.squarespace-cdn.com/content/v1/60b106ca9ca45d7eafa16a16/1623098521052-UAI40RFSAO45QDA89OT8/PathOfLife_SPRING2015_041.jpg", sourcePage: "https://www.greatriveroutfitters.com/path-of-life", publisher: "Great River Outfitters", description: "A symbolic sculpture and landscape inside the Path of Life garden" }
  ],
  "american-precision": [
    { url: "https://americanprecision.org/wp-content/uploads/2019/09/American-Precision-Museum-8-11-23-BDP-9634-1-scaled-e1724263268893.jpg", sourcePage: "https://americanprecision.org/", publisher: "American Precision Museum", description: "Historic belt-driven machine tools on the armory's exhibit floor" }
  ],
  "arcadia-portland": [
    { url: "https://townsquare.media/site/696/files/2024/09/attachment-Arcadia-Food-Court.jpg?h=840&q=85&w=1260", sourcePage: "https://wjbq.com/arcadia-portland-maine-bar-gaming-10-years/", publisher: "WJBQ", description: "Rows of pinball and arcade cabinets beneath Arcadia's neon Food Court sign" },
    { url: "https://www.portlandoldport.com/wp-content/uploads/2021/08/310088576_10159133869326482_7214051174974369611_n.jpg", sourcePage: "https://www.portlandoldport.com/event/ifpa-maine-state-pinball-championship-at-arcadia-national-bar/", publisher: "Portland Old Port", description: "Players gathering around pinball machines inside Arcadia's Congress Street venue" },
    { url: "https://townsquare.media/site/696/files/2024/09/attachment-Arcadia-Back.jpg?q=85&w=1260", sourcePage: "https://wjbq.com/arcadia-portland-maine-bar-gaming-10-years/", publisher: "WJBQ", description: "A social pinball night in Arcadia's neon-lit lower level" }
  ],
  "bethel-village": [
    { url: "https://i0.wp.com/newenglandwanderlust.com/wp-content/uploads_historical/2024/10/things-to-do-in-bethel-maine-1.jpg?resize=1024%2C683&ssl=1", sourcePage: "https://newenglandwanderlust.com/things-to-do-in-bethel-maine/", publisher: "New England Wanderlust", description: "Bethel village and its mountain setting in peak autumn color" }
  ],
  "desert-of-maine": [
    { url: "https://desertofmaine.com/uploads/desertofmaine/710a7775-1ba073_72f84e39dbe8492990cb45ba2be9bdf3~mv2.webp", sourcePage: "https://desertofmaine.com/gallery", publisher: "Desert of Maine", description: "The official gallery's glacial-sand landscape surrounded by Maine forest" }
  ],
  "dog-mountain": [
    { url: "https://vermont.com/wp-content/uploads/2023/04/Dog-Mountain-Gallery-and-Chapel-Exterior.jpg", sourcePage: "https://vermont.com/activities/dog-mountain-and-the-dog-chapel/", publisher: "Vermont.com", description: "The Dog Chapel and Stephen Huneck Gallery on Dog Mountain" }
  ],
  "fairbanks-museum": [
    { url: "https://fairbanksmuseum.org/wp-content/uploads/2022/10/hummingbird.jpeg", sourcePage: "https://fairbanksmuseum.org/collections/", publisher: "Fairbanks Museum & Planetarium", description: "A taxidermy hummingbird from the museum's Victorian natural-history collection" }
  ],
  "museum-everyday-life": [
    { url: "https://museumofeverydaylife.org/wp-content/uploads/MOEL-exterior.jpg", sourcePage: "https://museumofeverydaylife.org/sample-page/about-us", publisher: "Museum of Everyday Life", description: "The self-service Museum of Everyday Life barn in Glover" },
    { url: "https://museumofeverydaylife.org/wp-content/uploads/Deep-Seated-3-scaled.jpg", sourcePage: "https://museumofeverydaylife.org/newsupdates", publisher: "Museum of Everyday Life", description: "A scene from the chair-focused Deep Seated exhibition" },
    { url: "https://museumofeverydaylife.org/wp-content/uploads/Deep-Seated-Poster-simple-small.jpg", sourcePage: "https://museumofeverydaylife.org/newsupdates", publisher: "Museum of Everyday Life", description: "The official 2026 Deep Seated exhibition artwork" }
  ],
  "saint-gaudens": [
    { url: "https://www.nps.gov/common/uploads/cropped_image/primary/957AD511-9907-20FF-23B325DC2742B099.jpg?width=1600&quality=90&mode=crop", sourcePage: "https://www.nps.gov/places/aspet-saint-gaudens-nhp.htm", publisher: "National Park Service", description: "Aspet and its formal grounds on an autumn day" },
    { url: "https://www.nps.gov/common/uploads/structured_data/96FCFEF6-F861-5A8F-9005DFFA53E00BE8.jpg?maxWidth=1600&maxHeight=1200&quality=90", sourcePage: "https://www.nps.gov/saga/index.htm", publisher: "National Park Service", description: "Saint-Gaudens' gilded Amor Caritas sculpture in the park's Atrium" }
  ],
  "see-science": [
    { url: "https://see-sciencecenter.org/wp-content/uploads/2023/05/abovemillyardweb-1024x731.jpg", sourcePage: "https://see-sciencecenter.org/exhibits/", publisher: "SEE Science Center", description: "The three-million-brick LEGO Amoskeag Millyard seen from above" },
    { url: "https://see-sciencecenter.org/wp-content/uploads/2023/05/IMG_1621-1200x800.jpg", sourcePage: "https://see-sciencecenter.org/exhibits/", publisher: "SEE Science Center", description: "Hands-on experimentation on SEE's exhibit floor" },
    { url: "https://see-sciencecenter.org/wp-content/uploads/2023/08/Helix-5-1200x823.jpg", sourcePage: "https://see-sciencecenter.org/exhibits/", publisher: "SEE Science Center", description: "A large interactive science installation at SEE" }
  ]
};

const replacementIndexes = {
  "american-precision": [1],
  "arcadia-portland": [0, 1, 2],
  "bethel-village": [2],
  "desert-of-maine": [0],
  "dog-mountain": [2],
  "fairbanks-museum": [2],
  "museum-everyday-life": [0, 1, 2],
  "path-of-life": [2],
  "saint-gaudens": [1, 2],
  "see-science": [0, 1, 2]
};

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
}

async function download(url, destination) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 TripAdvisorRouteDataset/4.0" }, redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`response too small (${bytes.length} bytes)`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  for (const [placeId, entries] of Object.entries(groups)) {
    if (requestedIds.size && !requestedIds.has(placeId)) continue;
    const record = raw.places[placeId] || { query: placeId, geocode_candidates: [], selected_coordinate: null, image_candidates: [], selected_images: [] };
    const removed = new Set(replacementIndexes[placeId] || []);
    const selected = [...(record.selected_images || [])].filter((_, index) => !removed.has(index)).slice(0, 3);
    for (const [index, entry] of entries.entries()) {
      if (selected.length >= 3) break;
      const extension = entry.url.includes(".png") ? "png" : "jpg";
      const destination = path.join(IMAGE_DIR, `${placeId}-external-${index + 1}-${safeName(entry.publisher)}-${safeName(entry.description).slice(0, 36)}.${extension}`);
      try {
        const mime = await download(entry.url, destination);
        selected.push({
          title: `${placeId} curated exact-place image ${selected.length + 1}`,
          mime, width: null, height: null, thumbnail_url: entry.url, original_url: entry.url,
          source_page: entry.sourcePage, description: entry.description, creator: entry.publisher, credit: entry.publisher,
          license: "External venue/editorial image; reuse permission required", license_url: entry.sourcePage,
          attribution_required: true, search_query: "curated exact-place web image",
          local_path: path.relative(ROOT, destination), review_status: "needs_visual_review",
          production_usable: false, rights_status: "permission-required-before-public-deployment"
        });
        console.log(`${placeId}: imported ${entry.publisher}`);
      } catch (error) {
        console.warn(`${placeId}: failed ${entry.publisher}: ${error.message}`);
      }
    }
    if (selected.length === 3) record.selected_images = selected;
    else console.warn(`${placeId}: keeping prior selection because only ${selected.length}/3 exact-place images are available.`);
    raw.places[placeId] = record;
    await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
