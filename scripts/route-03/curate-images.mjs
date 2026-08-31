#!/usr/bin/env node

// Curated carousel images for Route 03, chosen by eye from Wikimedia Commons.
//
// Places absent from this list keep the images already in the package, because
// Commons has no usable coverage of them. Search returns confidently wrong
// results for several: "Cape May" ghost tours return Cape Town, South Africa;
// "Barker Cartoon Museum" returns the Gaziantep Toy Museum in Turkey; "Tanger
// Riverhead" returns a tea shop in Canada and a storefront in Riga; and
// Metuchen and Andalusia return nothing but Sanborn insurance maps and HABS
// measured drawings. Substituting any of those would misrepresent the stop.
//
//   node scripts/route-03/curate-images.mjs
//   node scripts/route-03/curate-images.mjs assateague lucy-elephant

import { readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROUTE_SLUG = "route-03-wild-shore-rockets-folklore-loop";
const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join("assets", "routes", ROUTE_SLUG);
const UA = { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary research)" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const selections = {
  "florence-griswold": [
    "File:Florence Griswold House, Old Lyme, CT.jpg",
    "File:MMDA-Photos - 2025-01-02 - Florence Griswold Museum.jpg",
    "File:Florence Griswold Museum gardens Old Lyme CT.jpg",
    "File:Cyanotype.KateCordsen.FlorenceGriswoldMuseum.jpg",
    "File:Krieble Gallery, Florence Griwold Museum, Lyme, CT.JPG",
    "File:Chadwick Studio, Florence Griswold Museum, Lyme, CT.JPG"
  ],
  "cross-sound-ferry": [
    "File:MV Mary Ellen (Cross Sound Ferry).jpg",
    "File:Orient Point Light at Sunset.jpg",
    "File:At Orient Point, Long Island 2018 01.jpg",
    "File:Ferry Terminal - New London, Connecticut, USA - October 2, 2023.jpg",
    "File:Cape Henlopen (LST-510) boarding.jpg",
    "File:Cape Henlopen (LST-510) interior.jpg"
  ],
  "greenport-waterfront": [
    "File:Greenport Harbor on a spring morning.jpg",
    "File:At Greenport, Long Island 2025 016.jpg",
    "File:At Greenport, Long Island 2025 017.jpg",
    "File:At Greenport, Long Island 2025 038.jpg",
    "File:Greenport Harbor Brewing Co in 2023 02.jpg"
  ],
  "north-ferry": [
    "File:At Greenport, Long Island 2025 072.jpg",
    "File:At Greenport, Long Island 2025 073.jpg",
    "File:Greenport Harbor on a spring morning.jpg",
    "File:At Greenport, Long Island 2018 13.jpg"
  ],
  "south-ferry": [
    "File:Shelter Island South Ferry 2.jpg",
    "File:Shelter Island South Ferry 4.jpg",
    "File:Shelter Island South Ferry 1.jpg",
    "File:Shelter Island South Ferry 3.jpg",
    "File:South Ferry Basin 1.jpg"
  ],
  "parrish-art-museum": [
    "File:Parrish Art Museum.jpg",
    "File:Parrish Art Museum Interior.jpg",
    "File:Un coin confortable Chase.jpg"
  ],
  "big-duck": [
    "File:The Big Duck Flanders.jpg",
    "File:Big Duck.JPG",
    "File:The Big Duck- Flanders.jpg",
    "File:The Big Duck on NY 24.jpg",
    "File:Big Duck Ranch-3.JPG"
  ],
  "long-island-aquarium": [
    "File:Long Island Aquarium 2018 013.jpg",
    "File:Long Island Aquarium 2018 020.jpg",
    "File:Long Island Aquarium 2018 030.jpg",
    "File:Long Island Aquarium 2018 022.jpg",
    "File:Long Island Aquarium 2018 027.jpg",
    "File:Long Island Aquarium 2018 002.jpg"
  ],
  "cradle-of-aviation": [
    "File:LM-13 at Cradle of Aviation Museum, Garden City, NY.jpg",
    "File:CM-002 at Cradle of Aviation Museum, Garden City, NY.jpg",
    "File:At the Cradle of Aviation Museum 2023 150.jpg",
    "File:At the Cradle of Aviation Museum 2023 022.jpg",
    "File:LTA-1 at Cradle of Aviation Museum, Garden City, NY.jpg",
    "File:Sally Ride Statue front.jpg"
  ],
  "asbury-boardwalk": [
    "File:Asbury Park Boardwalk New Jersey 2024.jpg",
    "File:Old Howard Johnson's Asbury Park NJ1.jpg",
    "File:Paramount Theater Asbury Park Convention Hall NJ1.jpg",
    "File:Boardwalk casino, Asbury Park, New Jersey LCCN2017711546.tif",
    "File:Boardwalk, Asbury Park, New Jersey LCCN2017711520.tif",
    "File:Asbury Park Conventiuon Center NJ2.jpg"
  ],
  "asbury-live-music": [
    "File:Wonder Bar NJ1.jpg",
    "File:Low Cut Connie at Stone Pony Summer Stage on Aug 31 2025.jpg",
    "File:We Are Scientists @ The Wonder Bar . October 14th, 2010.jpg",
    "File:Stone Pony Asbury Park NJ1.jpg",
    "File:Stone Pony at Sunset (7357747302).jpg",
    "File:Adam - Stone Pony (7357745270).jpg"
  ],
  "ocean-grove": [
    "File:Ocean Grove tent cabins NJ1.jpg",
    "File:Great Auditorium Ocean Grove NJ2.jpg",
    "File:Great Auditorium Ocean Grove NJ1A.jpg",
    "File:Ocean Path Park and Great Auditorium from Ocean Avenue, Ocean Grove, NJ, Dec. 2024.jpg",
    "File:New Jersey (5221805547).jpg"
  ],
  "lucy-elephant": [
    "File:Lucy the Elephant NJ6.jpg",
    "File:Lucy the Elephant NJ3.jpg",
    "File:Lucy the Elephant NJ7.jpg",
    "File:Lucy the Elephant NJ8.jpg",
    "File:Lucy the Elephant NJ2.jpg",
    "File:Lucy the Elephant NJ4.jpg"
  ],
  "nas-wildwood": [
    "File:2025-03-12 12 38 08 East side of the Naval Air Station Wildwood Aviation Museum at Cape May Airport in Lower Township, Cape May County, New Jersey.jpg",
    "File:A4-D Skyhawk Blue Angel NASW.jpg",
    "File:Stearman NASW.jpg",
    "File:T-28C Trojan NASW.jpg",
    "File:Sikorsky Seaguard NASW.jpg",
    "File:Vultee BT-13 Valiant NASW.jpg"
  ],
  "cape-may-victorian": [
    "File:Victorian cottages, Cape May, New Jersey LCCN2011632539.tif",
    "File:Hybrid - Early Victorian (Gothic Revival, Italianate, Mansard) - Cape May, NJ - John B. McCreary House (4).jpg",
    "File:Hybrid - Early Victorian (Gothic Revival, Italianate, Mansard) - Cape May, NJ - John B. McCreary House (5).jpg",
    "File:Hybrid - Early Victorian (Gothic Revival, Italianate, Mansard) - Cape May, NJ - John B. McCreary House (9.2).jpg",
    "File:Hybrid - Early Victorian (Gothic Revival, Italianate, Mansard) - Cape May, NJ - John B. McCreary House (1).jpg"
  ],
  "sunset-beach-atlantus": [
    "File:7.23.15AtlantusByLuigiNovi6.jpg",
    "File:7.23.15AtlantusByLuigiNovi4.jpg",
    "File:7.23.15AtlantusByLuigiNovi5.jpg",
    "File:Cape May Sunset Beach from Delaware Bay.JPG",
    "File:7.23.15AtlantusByLuigiNovi1.jpg"
  ],
  "cape-may-lewes-ferry": [
    "File:Cape May Lewes Ferry.jpg",
    "File:The Cape May–Lewes Ferry in Delaware.jpg",
    "File:Leaving Cape May Ferry Terminal - Cape May, New Jersey, USA - October 4, 2023.jpg",
    "File:Cape May Ferry Terminal.jpg",
    "File:Cape May Canal - North Cape May, New Jersey, USA - October 4, 2023.jpg"
  ],
  "fort-miles": [
    "File:16-inch gun Fort Miles DE2.jpg",
    "File:8 inch railway gun Fort Miles DE1.jpg",
    "File:Fort Miles tower DE1.jpg",
    "File:Fort Miles tower DE4.jpg",
    "File:Battery Herring Fort Miles DE1.jpg",
    "File:Fort Miles tower DE3.jpg"
  ],
  "great-dune-tower": [
    "File:Henlopen Tower Sunset.jpg",
    "File:Two Towers - Cape Henlopen - Delaware (55008241793).jpg",
    "File:Fire Control Towers - Cape Henlopen State Park (52528724378).jpg",
    "File:Cape Henlopen State Park (53404031550).jpg",
    "File:Gordons Pond Canal Gate - Cape Henlopen State Park (52535277568).jpg"
  ],
  "berlin-historic": [
    "File:Atlantic Hotel Berlin MD1.jpg",
    "File:Berlin, Maryland 2022.jpg",
    "File:Berlin, Maryland 2019a.jpg",
    "File:Berlin, Maryland Town Hall 2019.jpg",
    "File:Berlin, Maryland 2019b.jpg",
    "File:Berlin, Maryland 2019c.jpg"
  ],
  "assateague": [
    "File:Assateague pony and foal MD1.jpg",
    "File:Wild ponies on Assateague Island National Seashore by Bonnie Gruenberg.jpg",
    "File:Assateague Island horses August 2009 2.jpg",
    "File:Wild pony on Assateague Island National Seashore by Bonnie Gruenberg.jpg",
    "File:Assateague Island horses August 2009 4.jpg",
    "File:IMGP5860 Wild ponies of Assateague Island.jpg"
  ],
  "zwaanendael": [
    "File:The Zwaanendael Museum in Lewes, Delaware.jpg",
    "File:Zwaanendaelmuseum.jpg",
    "File:Zwaanendael Museum May 2014.jpg",
    "File:Zwaanendael Museum, Lewes, Delaware LCCN2017706072.tif",
    "File:The Zwaanendael Museum, Lewes DE - panoramio.jpg"
  ],
  "nasa-wallops": [
    "File:The Black Brant XII Sounding Rocket Launched From Wallops Virginia (51185013040).jpg",
    "File:NASA Visitor Center (Wallops Flight Facility) 01.JPG",
    "File:NASA Visitor Center (Wallops Flight Facility) 02.JPG",
    "File:Photograph of a Rocket being Lifted onto the Launch Structure to be Prepared for Launch at the Wallops Island Launch Area in Virginia - DPLA - 3ef6dd4106c4a2279b7ed5aa4ff4194b.jpg",
    "File:First AFSWC Javelin Sounding Rocket On Launcher at Wallops Island (LRC-1959-B701 P-05144).tif"
  ],
  "barrier-islands-center": [
    "File:The Barrier Island Center from outside. (7142125233).jpg",
    "File:Northhampton County Almshouse.jpg",
    "File:The twisted chimney inside the Barrier Island Center. (6996050196).jpg",
    "File:U.S. 13, Eastern Shore, Virginia (14401275536).jpg",
    "File:Coast watch (1979) (20665915651).jpg"
  ],
  "chesapeake-bridge-tunnel": [
    "File:Chesapeake Bay Bridge-Tunnel, Route 13 - Lucius J. Kellam Jr Bridge-Tunnel (8267607668).jpg",
    "File:Chesapeake Bay Bridge-Tunnel, Route 13 - Lucius J. Kellam Jr Bridge-Tunnel (8266541901).jpg",
    "File:Chesapeake Bay Bridge-Tunnel, Route 13 - Lucius J. Kellam Jr Bridge-Tunnel (8267609878).jpg",
    "File:Chesapeake Bay Bridge-Tunnel, Route 13 - Lucius J. Kellam Jr Bridge-Tunnel (8266540363).jpg",
    "File:Chesapeake Bay Bridge Tunnel Trip 12.jpg",
    "File:Chesapeake Bay Bridge Tunnel Trip 05.jpg"
  ],
  "norfolk-pagoda": [
    "File:Norfolk Pagoda (9081677432).jpg",
    "File:Pretty pagoda in Norfolk VA (9079534153).jpg",
    "File:HDR - Pagoda in downtown Norfolk, VA (8820610446).jpg",
    "File:A pagoda garden in Norfolk, VA.jpg",
    "File:Pagoda Restaurant in Norfolk VA (9169901435).jpg",
    "File:Norfolk, Virginia, USA (9900568145).jpg"
  ],
  "cape-charles": [
    "File:A beach in Cape Charles, VA.jpg",
    "File:2017-07-12 11 18 47 View southwest towards U.S. Route 13 (Chesapeake Bay Bridge-Tunnel) from Cape Charles, Northampton County, Virginia.jpg",
    "File:Cape Charles, Virginia - leaving harbor looking south - panoramio.jpg",
    "File:Cape Charles, Virginia - leaving harbor looking east - panoramio (1).jpg",
    "File:Cape Charles, Virginia - leaving harbor looking north - panoramio.jpg"
  ],
  "nauticus-wisconsin": [
    "File:USS Wisconsin, port bow view, Sept 2019 2.jpg",
    "File:USS Wisconsin, bow view, Sept 2019.jpg",
    "File:The Wisconsin Battleship in Norfolk, VA.jpg",
    "File:USS Wisconsin Norfolk VA1.jpg",
    "File:USS Wisconsin (BB-64) underway at sea, circa 1988-1991 (NH 97206-KN).jpg",
    "File:US Navy 091119-N-8907D-196 Capt. Richard Phillips and Cmdr. Frank X. Castellano answer questions after a ceremony publicly thanking the Bainbridge for his dramatic rescue at sea.jpg"
  ],
  "edgar-cayce-are": [
    "File:Cayce-Hospital-Building.jpg",
    "File:ARE-Visitor-Center.jpg",
    "File:ARE-meditation-garden.jpg",
    "File:ARE-Labyrinth.jpg",
    "File:New York Times Oct 1910 article on Edgar Cayce.gif"
  ],
  "poe-museum-richmond": [
    "File:PoeEntrance.jpg",
    "File:Poe Museum Garden - panoramio.jpg",
    "File:Richmond va the old stone house.tif",
    "File:Old stone house, from Robert N. Dennis collection of stereoscopic views.png",
    "File:Old stone house - once Washington's headquarters, by E. S. Lumpkin.png"
  ],
  "hermitage-norfolk": [
    "File:Hermitage Museum & Gardens Exterior.jpg",
    "File:House from drive.jpg",
    "File:The Emperor Commodus Leaving the Arena at the Head of the Gladiators by American muralist Edwin Howland Blashfield (1848-1936) 01.jpg",
    "File:Edward john poynter, la grotta delle ninge della tempesta, 1902 (norfolk, hermitage museum and gardens) 02.jpg",
    "File:Edward john poynter, la grotta delle ninge della tempesta, 1902 (norfolk, hermitage museum and gardens) 01.jpg"
  ],
  "richmond-orthodox": [
    "File:Saints Constantine & Helen Greek Orthodox Church of Washington DC 12.jpg",
    "File:Saints Constantine & Helen Greek Orthodox Cathedral of the Pacific (Honolulu) (3).jpg",
    "File:Saints Constantine & Helen Greek Orthodox Cathedral of the Pacific (Honolulu) (6).jpg",
    "File:Saints Constantine & Helen Greek Orthodox Cathedral of the Pacific (Honolulu) (5).jpg",
    "File:Saints Constantine & Helen Greek Orthodox Cathedral of the Pacific (Honolulu) (4).jpg",
    "File:Saints Constantine & Helen Greek Orthodox Cathedral of the Pacific (Honolulu) (1).jpg"
  ],
  "bo-railroad": [
    "File:B&O Railroad Museum - Baltimore MD (7696096040).jpg",
    "File:B&O Railroad Museum - Baltimore MD (7696099036).jpg",
    "File:B&O Railroad Museum - Baltimore MD (7696101450).jpg",
    "File:B&O Railroad Museum - Baltimore MD (7696103008).jpg",
    "File:Closeup of the Central Railroad of New Jersey 592 at the B&O Railway Museum in October 2017.jpg",
    "File:VIEW OF ENGINES ON DISPLAY - Baltimore and Ohio Railroad, Mount Clare Passenger Car Shop, Southwest corner of Pratt and Poppleton Streets, Baltimore, Independent City, MD HAER MD,4-BALT,127-15.tif"
  ],
  "baltimore-industry": [
    "File:BMI crane Baltimore MD2.jpg",
    "File:Baltimore Museum of Industry (49098131432).jpg",
    "File:Tug Baltimore MD2.jpg",
    "File:Baltimore Museum of Industry 3032152.jpg",
    "File:BMI crane Baltimore MD1.jpg"
  ],
  "mutter-museum": [
    "File:The Mutter Museum (53586792843).jpg",
    "File:Mutter Museum Entrance.jpg",
    "File:Mutter Museum - 18061364051.jpg",
    "File:College of Physicians of Philadelphia entrance.jpg",
    "File:College of Physicians 1.JPG"
  ],
  "sleepy-hollow-cemetery": [
    "File:Sleepy Hollow Cemetery NY1.jpg",
    "File:Owen Jones Monument in Sleepy Hollow Cemetery3.jpg",
    "File:Andrew Carnegie Grave in Sleepy Hollow Cemetery NY.jpg",
    "File:Washington Irving Gravesite 2010.JPG",
    "File:Owen Jones Monument in Sleepy Hollow Cemetery2.jpg",
    "File:IrvingHeadstone.JPG"
  ],
  "old-dutch-church": [
    "File:Dutch Church Sleepy Hollow 12.JPG",
    "File:Dutch Church Sleepy Hollow 4.JPG",
    "File:Broadway at Old Dutch Church of Sleepy Hollow.jpg",
    "File:Dutch Church Sleepy Hollow 15.JPG",
    "File:Dutch Church Sleepy Hollow 22.JPG",
    "File:Dutch Church Sleepy Hollow 8.JPG"
  ],
  "headless-horseman": [
    "File:Sleepy Hollow - Philipsburg Manor House - 20180503120844.jpg",
    "File:Mouth of Pocantico River, Sleepy Hollow, NY.jpg",
    "File:50 William England - Rustic bridge, Sleepy Hollow.jpg",
    "File:Washington Irving's Illustrations of the Legend of Sleepy Hollow, Designed and Etched by F.O.C. Darley for the Members of the American Art Union, 1850 MET MM89541.jpg",
    "File:Washington Irving's Illustrations of the Legend of Sleepy Hollow, Designed and Etched by F.O.C. Darley for the Members of the American Art Union, 1850 MET MM89544.jpg"
  ],
  "rockefeller-arts": [
    "File:Pocantico Lake, NY, in autumn.jpg",
    "File:Union Church of Pocantico Hills.jpg",
    "File:Pocantico Hills Union Church2.jpg",
    "File:A bridge on the Pocantico River Trail.jpg",
    "File:Stone Barns pasture in Pocantico Hills.jpg",
    "File:Pocantico Lake Park.jpg"
  ],
  "pez-visitor-center": [
    "File:PEZ-BOX dispenser, Zylinderhaus Bild 2.JPG",
    "File:PEZ-Candies.jpg",
    "File:Macro of four PEZ.jpg",
    "File:PEZ Mint Dispenser Packaging.jpeg",
    "File:PEZ Verkaufsautomat, Fahrzeugmuseum Marxzell Bild 1.JPG"
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
  const build = spawnSync(process.execPath, ["scripts/route-03/build.mjs"], { stdio: "inherit" });
  if (build.status !== 0) throw new Error("package build failed after curation");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
