#!/usr/bin/env node

// Curated carousel images for Route 05, chosen by eye from Wikimedia Commons.
//
// Ten places are absent and keep the images already in the package. Commons
// either holds only HABS measured drawings for them (Storer College, Virginius
// Island, Mark Twain House) or returns the wrong subject entirely: "Exchange
// Hotel" returns pubs in Australia and Wales, "Jefferson School" returns
// Sacramento and University of Virginia pavilions, and "Holy Land USA" returns
// fourteen photographs of Waterbury roads. Substituting any of those would
// misrepresent the stop.
//
//   node scripts/route-05/curate-images.mjs
//   node scripts/route-05/curate-images.mjs luray-caverns antietam

import { readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROUTE_SLUG = "route-05-coal-veins-caverns-blue-ridge-secrets-loop";
const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join("assets", "routes", ROUTE_SLUG);
const UA = { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary research)" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const selections = {
  "wadsworth-atheneum": [
    "File:Wadsworth Atheneum Museum of Art.jpg",
    "File:Wadsworth Athenaeum, Hartford, Connecticut.jpg",
    "File:Interior view - Wadsworth Atheneum - Hartford, CT - DSC05003.jpg",
    "File:Interior view - Wadsworth Atheneum - Hartford, CT - DSC04995.jpg",
    "File:Wadsworth Atheneum, Hartford, Connecticut.JPG",
    "File:Interior view - Wadsworth Atheneum - Hartford, CT - DSC04992.jpg"
  ],
  "lackawanna-coal": [
    "File:Lackawanna Coal Mine Inside.jpg",
    "File:Lackawanna Coal Mine.jpg",
    "File:Tram car at Coal Mine Tour in Scranton, PA IMG 1558.JPG",
    "File:Coal mining, Anthracite Region, Pennsylvania. Testing for gas and inspecting roof of mine (63553).jpg",
    "File:Coal mining, Anthracite Region, Pennsylvania. A miner testing the roof, following a blast (63551).jpg"
  ],
  "steamtown": [
    "File:Union Pacific No 4012 at Steamtown National Historic Site.jpg",
    "File:Union Pacific 4014 at Steamtown National Historic Site.jpg",
    "File:BLW -26 on the Turntable at Steamtown. (August 2017).jpg",
    "File:Grand Trunk Western 6039 at the Steamtown National Historic Site in July 2023.jpg",
    "File:Steamtown National Historic Site - Scranton, Pennsylvania Grand Trunk Western 6039.jpg"
  ],
  "scranton-iron": [
    "File:Scranton Iron Furnaces in Scranton, PA.jpg",
    "File:Scranton Iron Furnaces, Scranton, PA.jpg",
    "File:Lackawanna Iron Furnace (Scranton).jpg",
    "File:Scranton Lackawanna Iron Furnaces.jpg",
    "File:Scranton Iron Furnaces - Scranton, PA.jpg",
    "File:Scranton iron furnaces 2008 03 23.jpg"
  ],
  "houdini-museum": [
    "File:Houdini, nothing on earth can hold Houdini! Fred Ray & Co. in an intensely funny \"Roman travesty\" .... LCCN2014636903.jpg",
    "File:The world famous self-liberator, Houdini the supreme ruler of mystery will present a grand magical revue in which he will prove himself to be the greatest mystifier that history chronicles LCCN2014636904.jpg",
    "File:Master mystifier, Houdini the greatest necromancer of the age - perhaps of all times-The literary digest. LCCN2014637413.jpg",
    "File:Challenge to Houdini, Regent Theatre, Salford LCCN2014636909.jpg",
    "File:Houdini jumps from Harvard Bridge, Boston, Massachusetts) - John H. Thurston, stereopticons LCCN2015650990.jpg",
    "File:Houdini LCCN2016826964.jpg"
  ],
  "watch-clock": [
    "File:Pocket Watch (48709723592).jpg",
    "File:Pocket Watch (48709584572).jpg",
    "File:Pocket Watch (48709421236).jpg",
    "File:Pocket Watch (48708811876).jpg",
    "File:Antique carved grandfather clock (29450319045).jpg",
    "File:Antique grandfather clock face (25706013870).jpg"
  ],
  "lancaster-central-market": [
    "File:Lancaster Central Market.JPG",
    "File:Central Market, Lancaster, PA - IMG 7734.JPG",
    "File:Central Market, Lancaster.jpg",
    "File:Central Market, Lancaster, PA - IMG 7736.JPG",
    "File:Farmer and his wife at her stall in Central Market. Lancaster, Pennsylvania 8d23430u.jpg",
    "File:Dan Eisenhart, photographer, summer 1981, south and east facades from southeast - Old City Hall, Penn Square, Lancaster, Lancaster County, PA HABS PA,36-LANC,2-3.tif"
  ],
  "wolf-sanctuary": [
    "File:Grey Wolf 2732.jpg",
    "File:Grey Wolf 2731.jpg",
    "File:Eurasian wolf 2.jpg",
    "File:Grey wolf at the Hoenderdaell animal park in Anna Paulowna 2.jpg",
    "File:Grey wolf at the Hoenderdaell animal park in Anna Paulowna.jpg",
    "File:Iberian Wolf AdF 001.jpg"
  ],
  "ephrata-cloister": [
    "File:Ephrata Cloister 9730 R1.jpg",
    "File:Ephrata Cloister, 4.jpg",
    "File:Ephrata Cloister, Sister's House, Saron.jpg",
    "File:Ephrata Cloister - Ephrata, Pennsylvania (5655809510).jpg",
    "File:Ephrata Cloister - Ephrata, Pennsylvania (5655817604).jpg",
    "File:Ephrata Cloister - Ephrata, Pennsylvania (5655250897).jpg"
  ],
  "railroad-museum-pa": [
    "File:Railroad Museum of Pennsylvania - Strasburg, Pennsylvania - 11496578783 PRR D16 1223.jpg",
    "File:Railroad Museum of Pennsylvania - Strasburg, Pennsylvania PRR G5 5741.jpg",
    "File:Railroad Museum of Pennsylvania - Strasburg, Pennsylvania - 11496384604 PRR GP9 7006 and Conrail 2233.jpg",
    "File:Railroad Museum of Pennsylvania - Strasburg, Pennsylvania PRR GP9 7006 number.jpg",
    "File:Fruit Growers Express at Strasburg - Railroad Museum of Pennsylvania.jpg",
    "File:Railroad Museum of Pennsylvania entrance.JPG"
  ],
  "eshelman-covered-bridge": [
    "File:Jackson's Sawmill Covered Bridge (Lancaster County, Pennsylvania).jpg",
    "File:Forry's Mill Covered Bridge from the air-1.jpg",
    "File:Erb's Covered Bridge and Field 3008px.jpg",
    "File:Weaver's Mill Covered Bridge Three Quarters View 3008px.jpg",
    "File:Buck Hill Farm Covered Bridge Three Quarters HDR 2950px.jpg",
    "File:Baumgardener's Covered Bridge Inside Center 3008px.jpg"
  ],
  "harrisburg-riverfront": [
    "File:Harrisburg - Walnut Street Bridge - 20180113205800.jpg",
    "File:GENERAL AERIAL VIEW OF WEST CHANNEL SPANS, SPANS 3, 4 AND 5 REMOVED, LOOKING EAST. - Walnut Street Bridge, Spanning Susquehanna River at Walnut Street (State Route 3034), HAER PA,22-HARBU,25-2.tif",
    "File:GENERAL AERIAL VIEW OF WEST CHANNEL SPANS, SPANS 3 AND 4 REMOVED, LOOKING EAST. - Walnut Street Bridge, Spanning Susquehanna River at Walnut Street (State Route 3034), Harrisburg HAER PA,22-HARBU,25-1.tif",
    "File:ELEVATION OF DAMAGED SPAN 5, LOOKING NORTHWEST. - Walnut Street Bridge, Spanning Susquehanna River at Walnut Street (State Route 3034), Harrisburg, Dauphin County, PA HAER PA,22-HARBU,25-8.tif",
    "File:WEST PORTAL AND APPROACH, LOOKING NORTHEAST. - Walnut Street Bridge, Spanning Susquehanna River at Walnut Street (State Route 3034), Harrisburg, Dauphin County, PA HAER PA,22-HARBU,25-9.tif",
    "File:EAST ABUTMENT, LOOKING NORTH. - Walnut Street Bridge, Spanning Susquehanna River at Walnut Street (State Route 3034), Harrisburg, Dauphin County, PA HAER PA,22-HARBU,25-14.tif"
  ],
  "turkey-hill-experience": [
    "File:Dark chocolate chip ice cream cone - August 2025 - Sarah Stierch.jpg",
    "File:Avocado sorbetes ice cream cone1.jpg",
    "File:Dark chocolate chip ice cream cone - August 2025 - Sarah Stierch (cropped).jpg",
    "File:TENSAI INDUSTRIA - interior - production - equipamentos de frio, gelados, frigorificos , arcas, murais, congeladores, freezers, refrigeration cabinets, showcases, ice creamTF PRO 020.jpg",
    "File:Ice Cream Dessert (Unsplash).jpg",
    "File:Sweet Scoops Ice Cream - July 2023 - Sarah Stierch.jpg"
  ],
  "pa-capitol": [
    "File:Pennsylvania State Capitol west front PA1.jpg",
    "File:Pennsylvania Capitol rotunda PA3.jpg",
    "File:Pennsylvania Capitol rotunda PA5.jpg",
    "File:2022 Pennsylvania State Capitol 01.jpg",
    "File:Rotunda Pennsylvania State Capitol - Art.jpg",
    "File:Tile mosaic in Pennsylvania State Capitol Rotunda 03.jpg"
  ],
  "antietam": [
    "File:Dunker Church, battlefield of Antietam LCCN2014646049.jpg",
    "File:Antietam field MD1.jpg",
    "File:Antietam field MD2.jpg",
    "File:Dunker Church Antietam MD1.jpg",
    "File:Final attack trail Antietam MD1.jpg",
    "File:Dead in front of Dunker Church, Antietam, MD LOC cwpbh.03384.jpg"
  ],
  "harpers-lower-town": [
    "File:Harpers Ferry WV1.jpg",
    "File:John Brown's Fort Harpers Ferry WV1.jpg",
    "File:Lower High St Harpers Ferry WV2.jpg",
    "File:Harpers Ferry bridge tunnel Maryland Heights WV1.jpg",
    "File:Public Way Harpers Ferry WV1.jpg",
    "File:Anthony Hall Harpers Ferry WV1.jpg"
  ],
  "seton-shrine": [
    "File:Seton shrine and basilica Emmitsburg MD1.jpg",
    "File:Seton shrine basilica Emmitsburg MD1.jpg",
    "File:Basilica of the National Shrine of St. Elizabeth Ann Seton interior 02.jpg",
    "File:Basilica of the National Shrine of St. Elizabeth Ann Seton 07.jpg",
    "File:Seton Shrine stone house Emmitsburg MD1.jpg",
    "File:Basilica of the National Shrine of St. Elizabeth Ann Seton interior 10.jpg"
  ],
  "luray-caverns": [
    "File:The Great Stalacpipe Organ.jpg",
    "File:Luray Caverns, Dream Lake - mirror-lake of caverns (2015-05-09 14.01.21 by Stan Mouser).jpg",
    "File:Dream Lake at Luray Caverns 2.jpg",
    "File:Luray Caverns - Luray, Virginia - DSC00583.jpg",
    "File:Luray Caverns - Luray, Virginia - DSC01111.jpg",
    "File:Stalacpipe Organ console - Luray Caverns (2015-05-09 14.29.19 by Stan Mouser).jpg"
  ],
  "skyline-overlooks": [
    "File:Old Rag Overlook from Skyline Drive (28041048500).jpg",
    "File:Spitler Knoll Overlook looking north Shenandoah National Park VA 2022-06-19 18-54-21 1.jpg",
    "File:Naked Creek Overlook looking west Shenandoah National Park VA 2022-06-19 10-00-20.jpg",
    "File:The Point Overlook sign southbound Shenandoah National Park VA 2022-06-19 10-15-46 1.jpg",
    "File:Hazeltop Ridge Overlook south from Skyline Dr Shenandoah National Park VA 2022-06-19 10-09-09.jpg",
    "File:The Point Overlook sign northbound Shenandoah National Park VA 2022-06-19 10-23-03 1.jpg"
  ],
  "stony-man": [
    "File:Stony Man from Hughes River Gap SNP VA1.jpg",
    "File:Stony Man Mt Skyline Drive VA 2062.jpg",
    "File:Stony Man Mt Skyline Drive VA 2079.jpg",
    "File:Stony Man Mt Skyline Drive VA 2078.jpg",
    "File:Stony Man Mt Skyline Drive VA 2085.jpg",
    "File:2018-04-28 12 46 43 Panoramic view south, west and north from the cliffs just northwest of the summit of Stony Man Mountain in Page County, within Shenandoah National Park, Virginia.jpg"
  ],
  "charlottesville-downtown": [
    "File:Sunrise Charlottesville Pavilion Downtown Mall Charlottesville VA January 2012.jpg",
    "File:Downtown Mall, Charlottesville, Virginia (5867535213).jpg",
    "File:Charlottesville Downtown Mall (7532311098).jpg",
    "File:2008-0830-Charlottesville-DowntownMall.jpg",
    "File:Harpist Downtown Mall Charlottesville VA November 2012.jpg",
    "File:Street performer Downtown Mall Charlottesville VA October 2017.jpg"
  ],
  "shenandoah-caverns-fright": [
    "File:Travertine flowstone (Shenandoah Caverns, Quicksburg, Virginia, USA) 7.jpg",
    "File:Travertine flowstone (Shenandoah Caverns, Quicksburg, Virginia, USA) 14.jpg",
    "File:Travertine dripstone (Shenandoah Caverns, Quicksburg, Virginia, USA) 3.jpg",
    "File:Travertine dripstone (Shenandoah Caverns, Quicksburg, Virginia, USA) 5.jpg",
    "File:Travertine dripstone (Shenandoah Caverns, Quicksburg, Virginia, USA) 9.jpg",
    "File:Travertine flowstone (Shenandoah Caverns, Quicksburg, Virginia, USA) 19.jpg"
  ],
  "monticello": [
    "File:Charlottesville - The north front of Monticello.jpg",
    "File:Monticello - primary plantation of President Thomas Jefferson - Charlottesville Virginia, interior, 2022.jpg",
    "File:Charlottesville - The Hall at Monticello.jpg",
    "File:Charlottesville - The parlor or salon, at Monticello.jpg",
    "File:Charlottesville - The dining room at Monticello.jpg"
  ],
  "kluge-ruhe": [
    "File:Aboriginal-art-503444 960 720.jpg",
    "File:Bark Painting LACMA M.2009.127.8.jpg",
    "File:Aboriginal Art Australia(2).jpg",
    "File:Aboriginal Art Australia.jpg",
    "File:Aboriginal Rock Art in Keep River National Park.jpg",
    "File:Aboriginal rock art, Nourlangie Rock, Kakadu - panoramio.jpg"
  ],
  "morgan-wade-jefferson": [
    "File:The Steel Wheels The Jefferson Theater Charlottesville VA February 2019.jpg",
    "File:Eli Cook The Jefferson Theater Charlottesville VA July 2022.jpg",
    "File:Buckethead Charlottesville.jpg",
    "File:Jefferson Theater (Virginia).jpg",
    "File:The Jefferson Theater 110 East Main Street Charlottesville VA June 2022 01.jpg",
    "File:The Jefferson Theater 110 East Main Street Charlottesville VA June 2022 04.jpg"
  ],
  "civil-war-medicine": [
    "File:National Museum of Civil War Medicine building 01.JPG",
    "File:Civil War surgeons kit.jpeg",
    "File:National Museum of Civil War Medicine entrance.JPG",
    "File:National Museum of Civil War Medicine frontage.jpg",
    "File:New National Museum of Civil War Medicine logo and sign.jpg",
    "File:National Museum of Civil War Medicine sign.JPG"
  ],
  "balls-bluff": [
    "File:A Walk Through Ball's Bluff.jpg",
    "File:Ball's Bluff National Cemetery.jpg",
    "File:Death of Col Edward D. Baker- At the Battle of Balls Bluff near Leesburg Va. Oct. 21st 1861 LCCN91793208.jpg",
    "File:The Civil War in America-retreat of the Federalists after the fight at Ball's Bluff, upper Potomac, Virginia - from a sketch by our special artist. LCCN90708961.jpg",
    "File:Battle of Ball's Bluff.png",
    "File:RING OF HEADSTONES INSIDE PERIMETER WALL. VIEW TO SOUTHWEST. - Balls Bluff National Cemetery, Route 7, Leesburg, Loudoun County, VA HALS VA-3-6.tif"
  ],
  "burnside-plantation": [
    "File:Burnside Plantation Farmhouse 01.JPG",
    "File:Burnside Plantation Farmhouse 03.JPG",
    "File:Burnside Plantation Farmhouse 05.JPG",
    "File:Burnside Plantation Garden 01.JPG",
    "File:Burnside Plantation Orchard.JPG",
    "File:Burnside Plantation Corn Crib 01.JPG"
  ],
  "illicks-mill": [
    "File:Monocacy Creek in Bethlehem, PA.jpg",
    "File:Monocacy Creek aqueduct in Bethlehem, PA 05.jpg",
    "File:Monocacy Creek aqueduct in Bethlehem, PA 01.jpg",
    "File:Johann Gustav Grunewald - Bethlehem from the Monocacy Creek (aft. 1862).jpg",
    "File:Johann Gustav Grunewald - View on Monocacy Creek at Bethlehem (1855).jpg",
    "File:NORTH ELEVATION - Waterworks, Monocacy Creek vicinity, Bethlehem, Northampton County, PA HABS PA,48-BETH,7A-1.tif"
  ],
  "newtown-meeting-house": [
    "File:Some old time meeting houses of the Connecticut Valley (1911) (14783301785).jpg",
    "File:Some old time meeting houses of the Connecticut Valley (1911) (14761401386).jpg",
    "File:Newtown, Connecticut flag.jpg",
    "File:Newtown, Connecticut - 4597825637.jpg",
    "File:Newtown, Connecticut - 4598437874.jpg",
    "File:Newtown, Connecticut - 4597829199.jpg"
  ],
  "mapparium": [
    "File:The Christian Science Plaza - 8698021476.jpg",
    "File:The Christian Science Plaza - 8696904315.jpg",
    "File:The Christian Science Plaza - 8698029520.jpg",
    "File:The Christian Science Plaza - 8698029976.jpg",
    "File:The Christian Science Plaza - 8696903427.jpg",
    "File:The Christian Science Plaza - 8698032974.jpg"
  ],
  "worcester-arms-armor": [
    "File:Great Hall - Higgins Armory Museum - DSC05458.JPG",
    "File:Great Hall - Higgins Armory Museum - DSC05706.JPG",
    "File:Austria, Graz(?), early 17th century - Cuirassier's Armor - 2012.37 - Cleveland Museum of Art.tif",
    "File:Pompeo della Cesa - Half Armor for the Foot Tournament - 1996.299 - Cleveland Museum of Art.tif",
    "File:Great Hall - Higgins Armory Museum - DSC05708.JPG",
    "File:Exhibit of swords - Higgins Armory Museum - DSC05718.JPG"
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
  const build = spawnSync(process.execPath, ["scripts/route-05/build.mjs"], { stdio: "inherit" });
  if (build.status !== 0) throw new Error("package build failed after curation");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
