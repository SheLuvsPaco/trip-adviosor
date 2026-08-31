#!/usr/bin/env node

// Curated carousel images for Route 04, chosen by eye from Wikimedia Commons.
//
// Fifteen places are deliberately absent and keep the images already in the
// package. Commons either has no photographic coverage of them (Victoria
// Mansion, Saint-Gaudens, American Precision and Shelburne return only HABS
// measured drawings and black-and-white survey plates) or returns a confidently
// wrong subject: "Seal Cove Auto" returns Cambrian gneiss outcrops, "SEE
// Science" returns ISS satellite photos of New Hampshire, "Museum of Everyday
// Life" returns a Soviet everyday-life museum in Russia, "Dog Mountain" returns
// the one in Washington State, and "Owls Head Transportation" returns a Fort
// Lauderdale car show. Substituting any of those would misrepresent the stop.
//
//   node scripts/route-04/curate-images.mjs
//   node scripts/route-04/curate-images.mjs cadillac-mountain hope-cemetery

import { readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROUTE_SLUG = "route-04-trolls-moon-rocks-curiosity-coast-loop";
const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join("assets", "routes", ROUTE_SLUG);
const UA = { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary research)" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const selections = {
  "african-burying-ground": [
    "File:Portsmouth African Burying Ground Memorial Park 03.jpg",
    "File:Portsmouth, New Hampshire (70323).jpg",
    "File:Portsmouth, New Hampshire (52492).jpg",
    "File:Portsmouth, New Hampshire (14912).jpg",
    "File:Portsmouth African Burying Ground Memorial Park 10.jpg",
    "File:Portsmouth, New Hampshire (83453).jpg"
  ],
  "uss-albacore": [
    "File:USS Albacore (2018) 07.jpg",
    "File:USS Albacore (2018) 08.jpg",
    "File:USS Albacore (2018) 09.jpg",
    "File:USS Albacore (2018) 11.jpg",
    "File:USS Albacore (2018) props.jpg",
    "File:USS Albacore (2018) 04.jpg"
  ],
  "nubble-light": [
    "File:Cape Neddick Light - Nubble Light.jpg",
    "File:Nubble Light House - York ME.jpg",
    "File:Long Exposure Nubble Light (6045103261).jpg",
    "File:Nubble Light, Maine - Flickr - Kevin M. Gill.jpg",
    "File:Cape Neddick Light York ME 20220917.jpg",
    "File:Cape Neddick Lighthouse (Nubble Light) image 2.jpg"
  ],
  "portland-head-light": [
    "File:Portland Head Lighthouse, Cape Elizabeth Maine, Fort Williams Park.jpg",
    "File:Portland Head Light.png",
    "File:Portland Head Lighthouse Ocean Horizontal.JPG",
    "File:Portland Head Light July 2019.jpg",
    "File:Portland Head Light (36519622605).jpg",
    "File:The Lighthouse at Portland Head.jpg"
  ],
  "eastern-promenade": [
    "File:Eastern prom july 4th.jpg",
    "File:Eastern Promenade IMG 1718.JPG",
    "File:Maine Narrow Gauge tracks along the Eastern Promenade, November 2016.JPG",
    "File:Birds eye view of Casco Bay, Portland, Maine, and surroundings. LOC 80693592.tif",
    "File:Birds eye view of Casco Bay, Portland, Maine, and surroundings. LOC 80693592.jpg"
  ],
  "arcadia-portland": [
    "File:Retrovolt Arcade 2017 - Arcade and Pinball Machines.jpg",
    "File:Cedar Point Pinball Machines (14847892452).jpg",
    "File:Pinball machines, Red Bank, NJ.1(2 - 7279175820).jpg",
    "File:Pinball game.jpg",
    "File:Addams family pinball.jpg",
    "File:Gottlieb Pinball - 24155803169.jpg"
  ],
  "desert-of-maine": [
    "File:Desert of Maine - Freeport, ME - IMG 7964.JPG",
    "File:Desert of Maine - Freeport, ME - IMG 7990.JPG",
    "File:Desert of Maine - Freeport, ME - IMG 8002.JPG",
    "File:Desert of Maine - Freeport, ME - IMG 7997.JPG",
    "File:Desert of Maine - Freeport, ME - IMG 8012.JPG",
    "File:Desert of Maine - camel.jpg"
  ],
  "coastal-maine-gardens": [
    "File:Coastal Maine Botanical Gardens - DSC03126.jpg",
    "File:Pond - Coastal Maine Botanical Gardens - DSC03092.jpg",
    "File:Children's Garden - Coastal Maine Botanical Gardens - DSC03268.jpg",
    "File:Children's Garden pond - Coastal Maine Botanical Gardens - DSC03282.jpg",
    "File:Coastal Maine Botanical Gardens - DSC03220.jpg",
    "File:Coastal Maine Botanical Gardens - DSC03068.jpg"
  ],
  "rockland-breakwater": [
    "File:Rockland Breakwater Lighthouse.jpg",
    "File:Breakwater Light, Rockland, Maine (62834).jpg",
    "File:Rockland Breakwater Lighthouse (8195498648).jpg",
    "File:Rockland light dusk.jpg",
    "File:Rockland (Maine) breakwater in winter.jpg",
    "File:Rockland Harbor Breakwater Light.jpg"
  ],
  "maine-maritime": [
    "File:War of 1812 Exhibit - Maine Maritime Museum, ME, USA 2012.jpg",
    "File:CARPENTER SHOP - Percy and Small Shipyard, 263 Washington Street, Bath, Sagadahoc County, ME HAER ME,12-BATH,10-2.tif",
    "File:PAINT SHOP - Percy and Small Shipyard, 263 Washington Street, Bath, Sagadahoc County, ME HAER ME,12-BATH,10-7.tif",
    "File:PITCH OVEN - Percy and Small Shipyard, 263 Washington Street, Bath, Sagadahoc County, ME HAER ME,12-BATH,10-12.tif",
    "File:CAULKING SHED - Percy and Small Shipyard, 263 Washington Street, Bath, Sagadahoc County, ME HAER ME,12-BATH,10-8.tif",
    "File:GENERATOR BUILDING - Percy and Small Shipyard, 263 Washington Street, Bath, Sagadahoc County, ME HAER ME,12-BATH,10-3.tif"
  ],
  "fort-knox-observatory": [
    "File:Penobscot Narrows Bridge and Observatory detail, Maine, US (PPL1-Corrected) julesvernex2.jpg",
    "File:Penobscot Narrows Bridge and Observatory Western Side.JPG",
    "File:Fort Knox Fortification.JPG",
    "File:Fort Knox Loophole 2.JPG",
    "File:Penobscot Narrows Bridge and Observatory Downstream.JPG",
    "File:Penobscot Narrows Bridge and Observatory West Side.JPG"
  ],
  "bar-harbor-shore-path": [
    "File:Sunrise at Bald Porcupine Island, Maine.jpg",
    "File:Shore Path 2021.jpg",
    "File:Bar Harbor shoreline and the Porcupines.jpg",
    "File:Sunset on Frenchman Bay in Bar Harbor, ME. - panoramio.jpg",
    "File:View of the Porcupine Islands from Cadillac Mountain.jpg",
    "File:Fishing boats on Frenchman Bay.jpg"
  ],
  "cadillac-mountain": [
    "File:Cadillac Mountain Sunrise, Acadia National Park (30621606400).jpg",
    "File:Cadillac Mountain Sunrise, Acadia National Park - 51650832934.jpg",
    "File:Cadillac Mountain Sunrise, Acadia National Park.jpg",
    "File:Cadillac Mountain Road Acadia National Park.jpg",
    "File:Ironbound Island from Cadillac Mountain Acadia National Park.jpg",
    "File:Dorr Mountain Champlain Mountain Frenchman Bay Schoodic Peninsula left from Cadillac Mountain Acadia National Park.jpg"
  ],
  "ocean-path": [
    "File:Thunder Hole, Ocean Path, Acadia National Park.jpg",
    "File:Thunder Hole image five.jpg",
    "File:Thunder hole, Acadia National Park, Maine.jpg",
    "File:Thunder Hole Vista (184486465).jpeg",
    "File:Atlantic Coast Near Thunder Hole, Acadia National Park, Maine - 68556818.jpg",
    "File:Atlantic Coast Near Thunder Hole, Acadia National Park, Maine - 68557184.jpg"
  ],
  "jordan-pond": [
    "File:The Bubbles at Jordan Pond, Acadia National Park (30107369060).jpg",
    "File:Jordan Pond from South Bubble Rock Trail, Acadia National Park - 51649739761.jpg",
    "File:Jordan Pond, Acadia National Park - 51649968208.jpg",
    "File:Jordan Pond, Acadia National Park - 51649739081.jpg",
    "File:Jordan Pond, Acadia National Park - 51649738631.jpg",
    "File:Jordan Pond, Acadia National Park - 51649967998.jpg"
  ],
  "crypto-museum": [
    "File:International Cryptozoology Museum Front Entrance 2025-05-11.jpg",
    "File:Thylacine exhibit at Cryptozoology Museum.jpg",
    "File:Coelacanth Fish at Cryptozoology Museum.jpg",
    "File:Cryptozoology banner Mothman.jpg",
    "File:Cryptozoology banner Maltese tiger.jpg",
    "File:Murphy the Bigfoot.jpg"
  ],
  "stephen-king-house": [
    "File:Stephen King House, Broadway, Whitney Park, Bangor, ME (54366205727).jpg",
    "File:Stephen King House, Broadway, Whitney Park, Bangor, ME (54367478925).jpg",
    "File:Stephen King House, Broadway, Whitney Park, Bangor, ME (54367308643).jpg",
    "File:Stephen King House, Broadway, Whitney Park, Bangor, ME (54367077281).jpg",
    "File:Stephen King House, Broadway, Whitney Park, Bangor, ME (54367308393).jpg",
    "File:Stephen King House, Broadway, Whitney Park, Bangor, ME (54367079486).jpg"
  ],
  "cole-transportation": [
    "File:Oshkosh Snowplow, Bangor, ME IMG 2506.JPG",
    "File:Stanley Steamer, Bangor, ME IMG 2584.JPG",
    "File:1928 Buick, Bangor, ME IMG 2537.JPG",
    "File:Dairy truck, Bangor, ME IMG 2545.JPG",
    "File:1960 Ford Fairlane, Bangor, ME IMG 2589.JPG",
    "File:Hearse (1890-1920), Bangor, ME IMG 2525.JPG"
  ],
  "maine-mineral-gem": [
    "File:Elbaite tourmaline (Oxford Pegmatite Field; Dunton Quarry, Newry, Maine, USA) 2 (43321961242).jpg",
    "File:Elbaite tourmaline (Mount Mica, Oxford County, Maine, USA) 3.jpg",
    "File:Elbaite tourmaline (Mount Mica, Oxford County, Maine, USA) 1.jpg",
    "File:Maine Mineral and Gem Museum, Bethel - Elbaite tourmaline - watermelon tourmaline.jpg",
    "File:Lunar Meteorite Fragmental Breccia.jpg",
    "File:Blue Tourmaline (GeoDIL number - 1850).jpg"
  ],
  "bethel-village": [
    "File:Bethel, Maine - 8165380351.jpg",
    "File:Bethel, Maine - 8165380713.jpg",
    "File:Bethel, Maine - 8165416612.jpg",
    "File:Bethel, Maine - 8165382627.jpg",
    "File:Bethel, Maine - 8165374141.jpg",
    "File:Bethel, Maine - 8165378889.jpg"
  ],
  "colby-art": [
    "File:Colby College Museum of Art 2024.jpg",
    "File:Arrow Maker, by Edmonia Lewis (Colby Coll Mus Art 2023.014) 03.jpg",
    "File:Winslow Homer - Under the Apple Boughs (1879, Colby College Museum of Art).jpg",
    "File:Winslow Homer - A Fishing Schooner.jpg",
    "File:Theodore Robinson - Boats at a Landing, 1894.jpg",
    "File:Theodore Robinson - Landscape, c.1889.jpg"
  ],
  "weeks-state-park": [
    "File:Mount Prospect Station.jpg",
    "File:Mount Prospect Park sign on fence, street level.JPG",
    "File:Main Street - Lancaster, New Hampshire (29717119713).jpg",
    "File:Mechanic Street Bridge (Lancaster, New Hampshire) - HAER NH-45 - 198825pu.jpg",
    "File:Mechanic Street Bridge (Lancaster, New Hampshire) - HAER NH-45 - 198827pu.jpg"
  ],
  "fairbanks-museum": [
    "File:Interior - Fairbanks Museum and Planetarium - DSC04211.JPG",
    "File:Interior - Fairbanks Museum and Planetarium - DSC04241.JPG",
    "File:Bird case - Fairbanks Museum and Planetarium - DSC04398.JPG",
    "File:Facade - Fairbanks Museum and Planetarium - DSC04178.JPG",
    "File:Interior - Fairbanks Museum and Planetarium - DSC04244.JPG",
    "File:Campephilus principalis - Fairbanks Museum and Planetarium - DSC04229.JPG"
  ],
  "dog-mountain": [
    "File:Dog Chapel.jpg",
    "File:Dog chapel in Saint Johnsbury, Vermont-IMG 2258.jpg",
    "File:Dog chapel in Saint Johnsbury, Vermont-IMG 2256.jpg",
    "File:Steven Huneck's Dog Mountain (4021678581).jpg"
  ],
  "burlington-waterfront": [
    "File:Burlington harbor sunset (45143139631).jpg",
    "File:Silent sunset over lake Champlain.jpg",
    "File:Church Street Marketplace in autumn.jpg",
    "File:Burlington, Vermont Waterfront (30308921845).jpg",
    "File:Burlington Bay, Lake Champlain, Vermont (30012082460).jpg",
    "File:Ben and Jerrys Church St Burlington VT 2025-04-14 17-05-07.jpg"
  ],
  "radio-bean": [
    "File:Radio Bean 8 North Winooski Avenue downtown Burlington VT July 2025 10.jpg",
    "File:Radio Bean 8 North Winooski Avenue downtown Burlington VT July 2025 12.jpg",
    "File:Radio Bean 8 North Winooski Avenue downtown Burlington VT July 2025 14.jpg",
    "File:Radio Bean 8 North Winooski Avenue downtown Burlington VT July 2025 15.jpg",
    "File:Radio Bean 8 North Winooski Avenue downtown Burlington VT July 2025 03.jpg",
    "File:Radio Bean 8 North Winooski Avenue downtown Burlington VT July 2025 07.jpg"
  ],
  "ben-jerrys-graveyard": [
    "File:Ben & Jerry's factory.jpg",
    "File:Ben & Jerry's factory at Waterbury seating area.jpg",
    "File:Waterbury (Vermont)-Stowe street, down-town-2022-08-07.jpg",
    "File:Waterbury (Vermont)-Main street and church-2022-08-07.jpg",
    "File:Waterbury (Vermont)-Main street with railway bridge-2022-08-07.jpg",
    "File:Waterbury, Vermont - 6017840500.jpg"
  ],
  "hope-cemetery": [
    "File:Hope Cemetery, Barre Vermont.jpg",
    "File:HopeBarre01.JPG",
    "File:HopeBarre02.JPG",
    "File:HopeBarre03.JPG",
    "File:HopeBarre04.JPG",
    "File:1918 spanish flu memorial, Hope Cemtery, Barre Vermont.jpg"
  ],
  "coolidge-site": [
    "File:Coolidge homestead in Plymouth, Vermont.jpg",
    "File:Florence Cilley General Store.jpg",
    "File:The Wilder Horse Barn.jpg",
    "File:Coolidge birthplace in Plymouth, Vermont.jpg",
    "File:Plymouth Notch.jpg",
    "File:Calvin Coolidge State Historic Site - Plymouth Union, Vermont - 4825675634.jpg"
  ],
  "vins": [
    "File:Great horned owl! (54608768597).jpg",
    "File:Great horned owl along lower Columbia River (51903553988).jpg",
    "File:Great horned owl (52034802547).jpg",
    "File:Great Horned Owl (53903809157).jpg",
    "File:Great Horned Owl (53905059994).jpg",
    "File:Great horned owl along lower Columbia River (51904109965).jpg"
  ],
  "quechee-gorge": [
    "File:Quechee Gorge - 48900604178.jpg",
    "File:Quechee Gorge.jpg",
    "File:Quechee Gorge Bridge.jpg",
    "File:Quechee Gorge - 48901339572.jpg",
    "File:15 23 0757 quechee gorge.jpg",
    "File:The Dam, Quechee State Park, Vermont (5142626938).jpg"
  ],
  "flw-houses": [
    "File:Zimmerman House - Manchester, New Hampshire - DSC07796.jpg",
    "File:Zimmerman House - Manchester, New Hampshire - DSC07800.jpg",
    "File:Zimmerman House - Manchester, New Hampshire - DSC07782.jpg",
    "File:Zimmerman House detail - Manchester, New Hampshire - DSC07732.jpg",
    "File:Zimmerman House detail - Manchester, New Hampshire - DSC07736.jpg",
    "File:Zimmerman House detail - Manchester, New Hampshire - DSC07750.jpg"
  ],
  "currier-museum": [
    "File:Interior view - Currier Museum of Art - Manchester, NH - DSC07340.jpg",
    "File:Interior view - Currier Museum of Art - Manchester, NH - DSC08046.jpg",
    "File:Interior view - Currier Museum of Art - Manchester, NH - DSC07920.jpg",
    "File:George Washington by Hiram Powers, first carved in marble 1844, this version made 1846-1860, marble - Currier Museum of Art - Manchester, NH - DSC07539.jpg",
    "File:The South West Prospect of the Seat of Colonel George Boyd at Portsmouth, New Hampshire, New England, artist unknown, 1774, oil on canvas - Currier Museum of Art - Manchester, NH - DSC07374.jpg",
    "File:Chest-on-chest, maker unknown, probably southern New Hampshire, c. 1785, maple and white pine - Currier Museum of Art - Manchester, NH - DSC07682.jpg"
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
    const retryAfter = Number(response.headers.get("retry-after"));
    await sleep(Math.max(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 0, 8000 * attempt));
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

  // When the requested width is wider than the source, the API hands back the
  // unscaled original — which upload.wikimedia.org rate-limits hard and which
  // Wikimedia explicitly asks clients not to fetch. Re-request those at a width
  // below the original so we always download a rendered thumbnail.
  for (const [key, entry] of byTitle) {
    const { info } = entry;
    if (info.thumburl && info.thumburl.includes("/thumb/")) continue;
    const width = Math.max(320, Math.min(1280, (info.width || 1281) - 1));
    const retry = new URLSearchParams({
      format: "json", action: "query", titles: entry.title,
      prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: String(width)
    });
    await sleep(700);
    const again = await fetchWithBackoff(`https://commons.wikimedia.org/w/api.php?${retry}`);
    const body = await again.json();
    const page = Object.values(body.query?.pages || {})[0];
    if (page?.imageinfo?.[0]?.thumburl?.includes("/thumb/")) byTitle.set(key, { title: entry.title, info: page.imageinfo[0] });
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
      const downloadUrl = info.thumburl && info.thumburl.includes("/thumb/") ? info.thumburl : info.url;
      const extension = /\.png(\?|$)/i.test(downloadUrl) ? "png" : "jpg";
      const localPath = path.posix.join(IMAGE_DIR, `${placeId}-${index + 1}-${safeName(title)}.${extension}`);
      const absolute = path.join(ROOT, localPath);
      if (!existsSync(absolute) || statSync(absolute).size < 4096) {
        const binary = await fetchWithBackoff(downloadUrl);
        await writeFile(absolute, Buffer.from(await binary.arrayBuffer()));
        await sleep(1100);
      }

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
    }

    // Drop superseded files so the asset directory does not accumulate orphans.
    const keep = new Set(selectedImages.map((image) => image.local_path));
    for (const image of previous) {
      if (keep.has(image.local_path)) continue;
      await unlink(path.join(ROOT, image.local_path)).catch(() => {});
    }

    record.selected_images = selectedImages;
    research.curated_at = new Date().toISOString();
    await writeFile(path.join(ROUTE_DIR, "research-raw.json"), `${JSON.stringify(research, null, 2)}\n`);
    replaced.push(`${placeId}: ${selectedImages.length} images`);
    console.log(`curated ${placeId} (${selectedImages.length})`);
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
  const build = spawnSync(process.execPath, ["scripts/route-04/build.mjs"], { stdio: "inherit" });
  if (build.status !== 0) throw new Error("package build failed after curation");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
