#!/usr/bin/env node

// Curated carousel images for Route 02, chosen by eye from Wikimedia Commons.
//
// The original collector picked by relevance score, which returns the wrong
// subject often enough to matter: searching "MASS MoCA" also returns the Museum
// of Fine Arts Boston, "Cardiff Giant" returns a ferris wheel in Wales, and
// "Fenimore Farm" returns a farm museum in Arkansas. Every file below was
// reviewed on a contact sheet before being listed.
//
// Places absent from this list keep the images already in the package: they have
// no usable Commons coverage (three-sisters-sanctuary, artisanworks, six-depot,
// turnpark-art-space, empire-state-carousel, iroquois-museum, fenimore-farm,
// grafton-peace-pagoda) and inventing a stand-in would misrepresent the stop.
//
//   node scripts/route-02/curate-images.mjs
//   node scripts/route-02/curate-images.mjs maid-of-the-mist secret-caverns

import { readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROUTE_SLUG = "route-02-falls-fire-clockwork-loop";
const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join("assets", "routes", ROUTE_SLUG);
const UA = { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary research)" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const selections = {
  "smith-botanic-garden": [
    "File:Scene at the botanic garden on the campus of Smith College in Northampton, Massachusetts, by Carol M. Highsmith, 2019, from the Library of Congress - master-pnp-highsm-57700-57764a.tiff",
    "File:Scene at the botanic garden on the campus of Smith College in Northampton, Massachusetts, by Carol M. Highsmith, 2019, from the Library of Congress - master-pnp-highsm-57700-57765a.tiff",
    "File:Scene at the botanic garden on the campus of Smith College in Northampton, Massachusetts, by Carol M. Highsmith, 2019, from the Library of Congress - master-pnp-highsm-57700-57767a.tiff",
    "File:Costus deistelii - Lyman Plant House, Smith College - DSC02035.jpg",
    "File:Garden statue - Lyman Plant House, Smith College - DSC01953.jpg",
    "File:Cischweinfia dasyandra - Lyman Plant House, Smith College - DSC01995.jpg"
  ],
  "tunnel-bar-northampton": [
    "File:The Tunnel Bar in Northampton, Mass.jpg",
    "File:Union Station, Northampton MA.jpg",
    "File:Old and New Station, Northampton, Massachusetts - April 2015.jpg",
    "File:The Old and New Station, Northampton, Massachusetts.jpg",
    "File:Northampton R.R. Station, Northampton, Mass.jpg"
  ],
  "mass-moca": [
    "File:MASS MoCA Building 6.jpg",
    "File:Mass MOCA external 2.jpg",
    "File:Mass MOCA external 3.jpg",
    "File:Mass MOCA external 1.jpg",
    "File:Mass MoCA in 2010, North Adams MA.jpg",
    "File:Arnold Print Works (MASS MoCA) 1.jpg"
  ],
  "saratoga-mineral-springs": [
    "File:Hayes Well Spring - Saratoga Springs, New York 01.jpg",
    "File:Orenda Spring - Saratoga Springs, New York.jpg",
    "File:Orenda Spring Tufa Deposits - Saratoga Springs, New York 08.jpg",
    "File:Orenda Spring Tufa Deposits - Saratoga Springs, New York 12.jpg",
    "File:Orenda Spring Tufa Deposits - Saratoga Springs, New York 06.jpg",
    "File:Orenda Spring Tufa Deposits - Saratoga Springs, New York 05.jpg"
  ],
  "congress-park": [
    "File:Canfield Casino fountain, Saratoga Springs.jpg",
    "File:Congress Park Carousel building from west, Saratoga Springs.jpg",
    "File:Congress Park, Saratoga Springs, New York.jpg",
    "File:Congress Park Centre tower, Saratoga Springs.jpg",
    "File:Saratoga Springs History Museum, Saratoga Springs, New York.jpg",
    "File:Historic Congress Park (sign), Saratoga Springs, New York.jpg"
  ],
  "howe-caverns": [
    "File:Howe Caverns Passage 1.jpg",
    "File:Howe Caverns Passage 2.jpg",
    "File:Howe Caverns 2.JPG",
    "File:Howe Caverns 3.JPG",
    "File:Howe Caverns.JPG"
  ],
  "cooperstown-lakefront": [
    "File:Otsego lake at lakefront.jpg",
    "File:Otsego Lake, by Smith, Washington G., 1828-1893 2.png",
    "File:Otsego Lake from Cooperstown, by Smith, Washington G., 1828-1893.jpg",
    "File:Solitude - Otsego Lake, by Smith, Washington G., 1828-1893.jpg",
    "File:Otsego Lake biological buoy.jpg"
  ],
  "cardiff-giant": [
    "File:The Cardiff Giant (8923364469).jpg",
    "File:Cardiff Giant LCCN2014693762.jpg",
    "File:Cardiff Giant LCCN2014693762.tif",
    "File:The Onondaga giant LCCN2003666806.jpg",
    "File:Cardiff Giant, Cooperstown, NY (8906282793).jpg"
  ],
  "taughannock-falls": [
    "File:Taughannock Falls State Park - 20171001 - 05.jpg",
    "File:Taughannock Falls State Park - 20171001 - 04.jpg",
    "File:Taughannock Falls State Park - 20171001 - 30.jpg",
    "File:Taughannock Falls State Park - 20171001 - 29.jpg",
    "File:Taughannock Falls State Park - 20171001 - 03.jpg",
    "File:Taughannock Falls State Park - 20171001 - 27.jpg"
  ],
  "cornell-botanic-gardens": [
    "File:Newman Overlook panorama.jpg",
    "File:Cornell University arboretum, 2019.jpg",
    "File:Cornell Arboretum.jpg",
    "File:The Cornell Botanic Gardens.jpg",
    "File:Nevin Welcome Center at the Cornell Botanic Gardens.jpg"
  ],
  "ithaca-falls": [
    "File:Ithaca Falls - Ithaca.jpg",
    "File:Ithaca Falls Overcast.jpg",
    "File:Ithaca - Fall Creek Falls.jpg",
    "File:Ithaca Gorge - Main Fall 01.jpg",
    "File:Ithaca - Main Falls in Ithaca Gorge.jpg"
  ],
  "corning-museum-of-glass": [
    "File:Corning Museum of Glass (49176554217).jpg",
    "File:Corning Museum of Glass (49175848183).jpg",
    "File:Corning Museum of Glass (49176338436).jpg",
    "File:Corning Museum of Glass (49175848918).jpg",
    "File:Corning Museum of Glass (49185756476).jpg",
    "File:Corning Museum of Glass (49182807538).jpg"
  ],
  "make-your-own-glass": [
    "File:Perry Glass Studio demonstration.jpg",
    "File:Glass in progress.jpg",
    "File:Glass shaping.jpg",
    "File:Spiral in glass.jpg",
    "File:Glass in moulding.jpg",
    "File:Glass bubble.jpg"
  ],
  "rochester-high-falls": [
    "File:High Falls Rochester NY 2024-04-06 13-14-20.jpg",
    "File:Highfallsrochester.jpg",
    "File:High Falls of the Genesee panorama, Rochester, New York - 20190331.jpg",
    "File:Pont De Rennes Bridge rennovation Rochester NY 2024-04-06 13-08-49 1.jpg",
    "File:High Falls Terrace Park, Rochester NY June 2025.jpg"
  ],
  "george-eastman-museum": [
    "File:George Eastman Museum, East Avenue, East Avenue District, Rochester, NY (54420153583).jpg",
    "File:George Eastman House - Rear.png",
    "File:George Eastman Museum, East Avenue, East Avenue District, Rochester, NY (54420099954).jpg",
    "File:Building on George Eastman House Grounds 06.jpg",
    "File:Building on George Eastman House Grounds 01.jpg",
    "File:Lunar Orbiter Photographic Subsystem, George Eastman House, Rochester, New York 03.jpg"
  ],
  "rochester-public-market": [
    "File:RochesterPublicMarketChristmas2018B.jpg",
    "File:RochesterPublicMarketChristmas2018.jpg",
    "File:RochesterPublicMarketBandsOnTheBricks2018LatinoNight.jpg",
    "File:RochesterPublicMarketFoodTruckRodeo2018BandshellB.jpg",
    "File:RochesterPublicMarketDoughnuts.jpg",
    "File:RochesterPublicMarketPumpkinPieRecipe.jpg"
  ],
  "letchworth-falls": [
    "File:Letchworth State Park - 20191006 - 02 - Middle Falls.jpg",
    "File:DSC2232 The upper falls at Letchworth State Park,. New York.jpg",
    "File:MIddle Falls Letchworth State Park, Castile NY 2153.jpg",
    "File:MIddle Falls Letchworth State Park, Castile NY 2159.jpg",
    "File:Middle Falls Letchworth State Park, Castile NY 2176.jpg",
    "File:Middle Falls Letchworth State Park, Castile NY 2189.jpg"
  ],
  "buffalo-canalside": [
    "File:Grain elevators in Silo City, Sept 2019.jpg",
    "File:All fashioned around the silos - Flickr - sagesolar.jpg",
    "File:Canalside.jpg",
    "File:CentralWharfCanalside.jpg",
    "File:Among the pillars, tall and grand - Flickr - sagesolar.jpg",
    "File:Tall Ships Buffalo Festival Buffalo , New York July 08, 2019.jpg"
  ],
  "elmwood-essex-music-night": [
    "File:Corner of Elmwood and West Utica at blue hour, Buffalo, New York - 20191007.jpg",
    "File:Elmwood Avenue apartments at blue hour, Buffalo, New York - 20191205.jpg",
    "File:Granite Works buildings, Main Street, Buffalo, New York - 20191221.jpg",
    "File:Italianate architecture on Wadsworth Street, Buffalo, New York - 20190807.jpg",
    "File:Cary House, Franklin Street, Buffalo, New York - 20191222.jpg"
  ],
  "annunciation-buffalo": [
    "File:Hellenic Orthodox Church of the Annunciation \"Under the Electric Sky\", Buffalo, New York - 20191007.jpg",
    "File:Hellenic Orthodox Church of the Annunciation (North Presbyterian Church), Delaware Avenue and Utica Street, Bryant, Buffalo, NY - 52630982753.jpg",
    "File:Hellenic Orthodox Church of the Annunciation (North Presbyterian Church), Delaware Avenue and Utica Street, Bryant, Buffalo, NY - 52630753799.jpg",
    "File:Hellenic Orthodox Church of the Annunciation (North Presbyterian Church), Delaware Avenue and Utica Street, Bryant, Buffalo, NY - 52630942820.jpg",
    "File:Hellenic Orthodox Church of the Annunciation (North Presbyterian Church), Delaware Avenue and Utica Street, Bryant, Buffalo, NY - 52630753844.jpg",
    "File:Hellenic Orthodox Church of the Annunciation (North Presbyterian Church), Delaware Avenue and Utica Street, Bryant, Buffalo, NY - 52630754474.jpg"
  ],
  "niagara-power-vista": [
    "File:Niagara Power Vista, Lewiston, New York - 20200730 - 03.jpg",
    "File:Robert Moses Power Station (left) and Robert Moses Power Station (right); Lewiston-Queenston Bridge in the background (7234647362).jpg",
    "File:Niagara Power Vista, Lewiston, New York - 20200730 - 01.jpg",
    "File:Robert Moses Niagara Power Plant.jpg",
    "File:Robert Moses Power Station (7234629566).jpg",
    "File:Robert Moses Niagara Power Plant, May 2026.jpg"
  ],
  "maid-of-the-mist": [
    "File:Maid of the Mist VII approaching the Horseshoe Falls, West view 20170418 1.jpg",
    "File:Rainbow and Maid of the Mist, Horseshoe Falls, Niagara Falls, Ontario (29901826111).jpg",
    "File:Maid of the Mist, Horseshoe Falls, Niagara Falls, Ontario (29901863431).jpg",
    "File:Maid of the Mist, Horseshoe Falls, Niagara Falls, Ontario (29901862121).jpg",
    "File:Rainbow and Maid of the Mist, Horseshoe Falls, Niagara Falls, Ontario (29951130646).jpg",
    "File:Horseshoe Falls and Maid of the Mist (30211694610).jpg"
  ],
  "cave-of-the-winds": [
    "File:Cave of the Winds at Niagara Falls IMG 1366.JPG",
    "File:Bridal Veil Falls from Cave of the Winds July 2024.jpeg",
    "File:Cave of the Winds Niagara Falls.jpg",
    "File:Cave of the winds 2.JPG",
    "File:Cave of the Winds (22113655431).jpg",
    "File:Horseshoe falls from Cave of the Winds platform.jpg"
  ],
  "goat-island-illumination": [
    "File:DSC09577 - Beams of Light (37223908895).jpg",
    "File:Goat Island - Isla de la Cabra - panoramio.jpg",
    "File:Cataratas del Niágara 13.jpg",
    "File:Cataratas del Niágara 11.jpg",
    "File:Cataratas del Niágara 05.jpg"
  ],
  "martin-house": [
    "File:Darwin Martin House panoramic view from street.jpg",
    "File:Darwin Martin House Front Entrance with tour group.jpg",
    "File:Darwin Martin House entrance and front of house with tour group.jpg",
    "File:Conservatory, Darwin D. Martin House, Jewett Parkway, Parkside, Buffalo, NY.jpg",
    "File:Planter, Darwin D. Martin House, Jewett Parkway, Parkside, Buffalo, NY.jpg"
  ],
  "tr-inaugural-site": [
    "File:Buffalo December 2024 10 (Theodore Roosevelt Inaugural National Historic Site).jpg",
    "File:Buffalo December 2024 09 (Theodore Roosevelt Inaugural National Historic Site).jpg",
    "File:Theodore Roosevelt Inaugural National Historic Site - DPLA - 40b6e8af7122573ee05240d0fe7309e7.jpg",
    "File:Historic American Buildings Survey, May 1965, INTERIOR CENTER ROOM, FIRST FLOOR. - Ansley Wilcox House, 641 Delaware Avenue, Buffalo, Erie County, NY HABS NY,15-BUF,12-6.tif",
    "File:Historic American Buildings Survey, May 1965, INTERIOR EAST ROOM, FIRST FLOOR. - Ansley Wilcox House, 641 Delaware Avenue, Buffalo, Erie County, NY HABS NY,15-BUF,12-5.tif"
  ],
  "armory-square": [
    "File:Armory Square Historic District, Syracuse, New York,.jpg",
    "File:Armory Square Historic District, Syracuse, New York.jpg",
    "File:Brickland, Armory Square, Syracuse.jpg",
    "File:Museum of Science and Technology (New York State Armory), Jefferson Street and Franklin Street, Syracuse, NY (54416575264).jpg",
    "File:Shot Clock Monument in Armory Square in Syracuse, New York (2013).jpg",
    "File:Lunch at The Blue Tusk (now closed), Armory Square, Downtown Syracuse.jpg"
  ],
  "erie-canal-museum": [
    "File:GENERAL VIEW OF EAST END AND NORTH FACADE - Weighlock Building, Erie Boulevard East and Montgomery Street, Syracuse, Onondaga County, NY HABS NY,34-SYRA,8A-13.tif",
    "File:GENERAL VIEW OF WEIGHLOCK BUILDING AND JUNCTION OF ERIE AND OSWEGO CANALS, WINTER OF 1888-1889 - Weighlock Building, Erie Boulevard East and Montgomery Street, Syracuse, Onondaga HABS NY,34-SYRA,8A-2.tif",
    "File:VIEW LOOKING SOUTHWEST AT THE DOWNSTREAM ENTRANCE INTO BARGE CANAL LOCK 34. THE ERIE CANAL MUSEUM (FORMER POWER PLANT) IS IN THE CENTER OF THE VIEW, NOTE THE TURBINE DISCHARGE HAER NY,32-LOCK,14A-47.tif",
    "File:DETAIL VIEW LOOKING NORTH AT THE SOUTHEAST ELEVATION OF THE ERIE CANAL MUSEUM (FORMER LOCK COMPLEX POWER PLANT). NOTE THE WALL RECESS BELOW THE BUILDING THAT RECEIVES THE END OF HAER NY,32-LOCK,14A-48.tif",
    "File:MR. WILLIAM CROUNCE IN OFFICE, CA. 1900 - Weighlock Building, Erie Boulevard East and Montgomery Street, Syracuse, Onondaga County, NY HABS NY,34-SYRA,8A-5.tif"
  ],
  "albany-pine-bush": [
    "File:Pines in the Albany Pine Bush Preserve.jpg",
    "File:Discovery Trail in Albany Pine Bush Preserve, New York (35011007072).jpg",
    "File:Discovery Trail in Albany Pine Bush Preserve, New York (35135959966).jpg",
    "File:Karner blue butterfly on hawkweed.jpg",
    "File:Karner blue butterfly (Lycaeides melissa samuelis) (5425719548).jpg",
    "File:Discovery Trail in Albany Pine Bush Preserve, New York (35045310121).jpg"
  ],
  "ny-state-capitol-plaza": [
    "File:New York State Capitol building, full.jpg",
    "File:New York State Capitol building, close-up.jpg",
    "File:The Egg Empire State Plaza concourse entrance.jpg",
    "File:Empire State Plaza, Agency Building 3 - Albany, New York 2024.jpg",
    "File:Empire State Plaza concourse Madison Ave. Entrance.jpg"
  ],
  "magic-wings": [
    "File:Magic Wings Butterfly Conservatory, South Deerfield, Massachusetts, USA-5Nov2011.jpg",
    "File:Erythrura gouldiae -Magic Wings Butterfly Conservatory, South Deerfield, Massachusetts, USA-8a (1).jpg",
    "File:Erythrura gouldiae -Magic Wings Butterfly Conservatory, South Deerfield, Massachusetts, USA-8a.jpg",
    "File:Poicephalus senegalus -Magic Wings Butterfly Conservatory, South Deerfield, Massachusetts, USA-8a.jpg",
    "File:Poicephalus senegalus -Magic Wings Butterfly Conservatory, South Deerfield, Massachusetts, USA-8a (2).jpg"
  ],
  "clark-art-institute": [
    "File:The Clark Art Institute - Tadao Ando.jpg",
    "File:Clark Art Institute Aerial View.jpg",
    "File:Wall leading to entrance of the Clark Art Institute, Williamstown MA.jpg",
    "File:Clark Art Institute - Clark Center - 2015a.png",
    "File:Elisabeth Louise Vigée-Lebrun, Bacchante, 1785, Oil on canvas. The Clark Art Institute, 1955.954.tif",
    "File:Clark Art Institute, Williamstown, MA - old gallery.JPG"
  ],
  "museum-of-earth": [
    "File:Hyde Park Mastodon 2.jpg",
    "File:Mammut skeleton Museum of the Earth.jpg",
    "File:Diplomoceras maximum PRI 13889.jpg",
    "File:Palmer Hall Exterior 2.jpg",
    "File:Palmer Hall Exterior 1.jpg"
  ],
  "strong-museum-play": [
    "File:Rochester Play Museum Atrium at Night.jpg",
    "File:Museum of Play at night.jpg",
    "File:Strong4667.JPG",
    "File:Strong4632.JPG",
    "File:Strong National Museum of Play (51363862085).png",
    "File:External view of Museum of Play.jpg"
  ],
  "eternal-flame-falls": [
    "File:Eternal Flame 2.jpg",
    "File:Eternal flame1.jpg",
    "File:Awestruck at the majesty of Eternal Flame Falls, Chestnut Ridge Park, Orchard Park, New York - 20210323.jpg",
    "File:Eternal Flame Falls, Chestnut Ridge Park, Orchard Park, New York - 20210323 - 02.jpg",
    "File:Eternal Flame Falls, Chestnut Ridge Park, Orchard Park, New York - 20210323 - 01.jpg",
    "File:Chestnut Ridge Park, Orchard Park, NY, USA (4608x3456).JPG"
  ],
  "old-fort-niagara": [
    "File:The French Castle at Old Fort Niagara.jpg",
    "File:At Old Fort Niagara, one of the redoubts, the French Castle at the fort, and parade grounds.jpg",
    "File:At Old Fort Niagara, fort walls and one of the redoubts that were built to protect the fort.jpg",
    "File:A view of Old Fort Niagara from Canada across the Niagara River.jpg",
    "File:Old Fort Niagara - Composite Panorama (20170122 - 00001-00007).jpg"
  ],
  "forest-lawn-blue-sky": [
    "File:Blue Sky Mausoleum 4.jpg",
    "File:Blocher Memorial interior - Forest Lawn, Buffalo.jpg",
    "File:Red Jacket Monument, Forest Lawn Cemetery (from Pauls' Dictionary of Buffalo, Niagara Falls, Tonawanda and Vicinity).jpg",
    "File:World War I memorial column, Forest Lawn Cemetery, Buffalo, New York - 20220414.jpg",
    "File:Autumn scene, Forest Lawn Cemetery, Buffalo, New York - 20201028 - 01.jpg",
    "File:Forest Lawn Cemetery, Buffalo, New York - \"...And Pass the Cemetery Gates\" - 20200111.jpg"
  ],
  "secret-caverns": [
    "File:Secret Caverns Waterfall- June 2024.jpg",
    "File:Secret Caverns Passage - June 2024.jpg",
    "File:Secret Caverns Bldg (6230834241).jpg",
    "File:Secret Caverns Glacial Dome.jpg",
    "File:Secret Caverns Lodge.jpg",
    "File:Secret Caverns (14047912359).jpg"
  ],
  "schenectady-stockade": [
    "File:Governor Yates House, 17 Front Street, Schenectady, Schenectady County, NY HABS NY,47-SCHE,14-1.tif",
    "File:121 Front Street (House), Schenectady, Schenectady County, NY HABS NY,47-SCHE,20-1.tif",
    "File:10-12 North Street (House), Schenectady, Schenectady County, NY HABS NY,47-SCHE,21-1.tif",
    "File:13 North Street (House), Schenectady, Schenectady County, NY HABS NY,47-SCHE,22-1.tif",
    "File:Captain Arent Brandt House, Schenectady, Schenectady County, NY HABS NY,47-SCHE,13-1.tif",
    "File:Joseph Yates House, 26 Front Street, Schenectady, Schenectady County, NY HABS NY,47-SCHE,15-1.tif"
  ],
  "house-of-guitars": [
    "File:Wall of Gibson Guitars, Guitar Center, Allandale, Austin, TX.jpg",
    "File:Guitar Store.jpg",
    "File:Interior of a Guitar and Ukulele Shop.jpg",
    "File:Seagull guitars on the wall.jpg",
    "File:Guitar shop.jpg"
  ],
  "radio-social": [
    "File:Interior, bowling lanes general view, facing northwest. - Holiday Bowl, 3730 Crenshaw Boulevard, Los Angeles, Los Angeles County, CA HABS CA-2775-16.tif",
    "File:The New HUB Bowling Lanes (7975562295).jpg",
    "File:The New HUB Bowling Alley Reverse (7975563403).jpg",
    "File:International Bowling Museum and Hall of Fame April 2019 22 (historic bowling lanes with Brunswick semi-automatic pinsetters).jpg"
  ],
  "brewery-ommegang": [
    "File:Brewery Ommegang 102107 041.jpg",
    "File:Brewery Ommegang 00 9346.jpg",
    "File:Otsego County Route 33 - New York - 4365328383.jpg"
  ],
  "fly-creek-cider-mill": [
    "File:Fly Creek Cider Mill - Fly Creek, New York.jpg",
    "File:Fly Creek Cider Mill - Fly Creek, New York - Oct. 2011.jpg",
    "File:Apple Paring Machine - Fly Creek Cider Mill - Fly Creek, New York.jpg"
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
  const build = spawnSync(process.execPath, ["scripts/route-02/build.mjs"], { stdio: "inherit" });
  if (build.status !== 0) throw new Error("package build failed after curation");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
