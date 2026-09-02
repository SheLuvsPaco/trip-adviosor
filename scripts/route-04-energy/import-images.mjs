#!/usr/bin/env node

// Imports carousel imagery for the thirteen Route 04 Energy Rebuild V2 core stops.
//
// Two sources, each recorded with its own rights metadata:
//   operator  - exact-venue photographs from the operator's own site. Editorial reuse only,
//               so these stay production_usable:false until permission is cleared.
//   commons   - Wikimedia Commons files with a real licence, creator and file page. These are
//               production_usable:true and carry their licence through to images.json.
//
// Every candidate in this file was downloaded and visually reviewed on a contact sheet before
// selection. Where the best available file is not the exact attraction, `coverage` says so.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "../route-04/config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const UA = "TripAdvisorRouteDataset/2.0 (route-04 energy rebuild)";
const requestedIds = new Set(process.argv.slice(2));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// [url, sourcePage, publisher, description, coverage?]
const operatorGroups = {
  "lucky-catch-lobstering": [
    ["https://www.luckycatch.com/wp-content/uploads/2021/03/Captain-Dave-Lobstering-e1616627371377.jpg", "https://www.luckycatch.com/", "Lucky Catch Cruises", "The captain hauling a lobster trap aboard the working boat"],
    ["https://www.luckycatch.com/wp-content/uploads/2021/03/measuring-the-bug-e1616630557492.jpg", "https://www.luckycatch.com/", "Lucky Catch Cruises", "A guest measuring a lobster with the crew, gloves on, mid-trip"],
    ["https://www.luckycatch.com/wp-content/uploads/2021/03/PR084010343051-e1616630787379-300x300.jpg", "https://www.luckycatch.com/", "Lucky Catch Cruises", "The haul: lobster, crab and starfish sorted in the deck tray"]
  ],
  "sk-tours-derry": [
    ["https://sk-tours.com/wp-content/uploads/sites/5086/2021/09/164067818_4570519926297541_6772708282590991795_n.jpg?w=1200", "https://www.sk-tours.com/", "SK Tours of Maine", "The SK Tours van outside the Stephen King house on West Broadway"],
    ["https://sk-tours.com/wp-content/uploads/sites/5086/2021/10/stephen-king-home-e1634311514809.jpg?w=1600", "https://www.sk-tours.com/", "SK Tours of Maine", "The red Victorian and its bat-and-spider ironwork fence in Bangor"],
    ["https://sk-tours.com/wp-content/uploads/sites/5086/2021/10/front-page-2.jpg?w=1200", "https://www.sk-tours.com/", "SK Tours of Maine", "Bangor from above with the Thomas Hill Standpipe, the tour's Derry landscape"]
  ],
  "wife-carrying-championship": [
    ["https://cdn.sanity.io/images/k8yfdmw9/sunday-river/314266d7ccf4aa625cc6dc721db9d5b43bb814f8-2048x1367.jpg?w=1600&q=80&fit=min&auto=format", "https://www.sundayriver.com/events/north-american-wife-carrying-championship", "Sunday River Resort", "A competitor carrying his partner through the course's water hazard"],
    ["https://cdn.sanity.io/images/k8yfdmw9/sunday-river/55fd4e3ca4f3d88ab8f7c566e0c3e59801adc11d-2048x1367.jpg?w=1600&q=80&fit=min&auto=format", "https://www.sundayriver.com/events/north-american-wife-carrying-championship", "Sunday River Resort", "Racing for the finish banner in front of the championship crowd"],
    ["https://cdn.sanity.io/images/k8yfdmw9/sunday-river/a320d2b90c458caa72e8ba39c067ab76469c86a5-2048x1367.jpg?w=1600&q=80&fit=min&auto=format", "https://www.sundayriver.com/events/north-american-wife-carrying-championship", "Sunday River Resort", "Competitors gathered at the start line under the Sunday River banner"]
  ],
  "mount-washington-cog": [
    ["https://images.squarespace-cdn.com/content/v1/67c9c098a524b766ffd29a77/657f1255-9bb0-49f7-b436-aaaba5d9a526/MWCR_170615-7-2.jpg", "https://www.thecog.com/", "Mount Washington Cog Railway", "A cog train at the 6,288-foot summit beside the Sherman Adams building"],
    ["https://images.squarespace-cdn.com/content/v1/67c9c098a524b766ffd29a77/65d90dac-29a6-4ef8-a298-7bc39e4be5d9/MWCR_171012-5.jpg", "https://www.thecog.com/", "Mount Washington Cog Railway", "A train working down the trestle with the White Mountains behind"],
    ["https://images.squarespace-cdn.com/content/v1/67c9c098a524b766ffd29a77/f3e4a9c8-c5e7-4f2f-90df-e5d3ad40fded/MWCR_191019-1946.jpg", "https://www.thecog.com/", "Mount Washington Cog Railway", "The cog line climbing the exposed upper mountain at low sun"]
  ],
  "k1-scenic-gondola": [
    ["https://killington.com/assets/image-cache/summer/DroneScenics_Killington_Godwin-2-2%20%281%29.5fc4d71e.jpg", "https://killington.com/scenic-gondola-rides", "Killington Resort", "The K-1 Lodge on the summit ridge with the gondola line running up the green mountainside", "exact-place-or-experience"],
    ["https://killington.com/assets/image-cache/summer/GOPR0227%20%282%29.4cc86293.jpg", "https://killington.com/scenic-gondola-rides", "Killington Resort", "The lift-served mountain and trail network the gondola climbs, from the air in green season", "exact-place-or-experience-context"]
  ],
  "beast-mountain-coaster": [
    ["https://killington.com/assets/image-cache/hotel/7-13%20Golf%20Course%20Drone%20Photos_Killington_Godwin-3.8daa0c85.jpg", "https://killington.com/summer-adventure-center", "Killington Resort", "Killington's base village in green season, where the Adventure Center sits", "exact-place-or-experience-context"],
    ["https://killington.com/assets/image-cache/bike-park/Bikepark25.c281075b.jpg", "https://killington.com/summer-adventure-center", "Killington Resort", "Green-season activity on the mountain the Adventure Center operates from", "exact-place-or-experience-context"]
  ],
  "arbortrek-smugglers": [
    ["https://arbortrek.com/wp-content/uploads/2022/01/arbortrek-zip-one.jpg", "https://arbortrek.com/zip-line-canopy-tour/", "ArborTrek Canopy Adventures", "A rider on the zipline heading for a canopy platform in the hardwoods"],
    ["https://arbortrek.com/wp-content/uploads/2022/02/jumping-group-asn.jpg", "https://arbortrek.com/zip-line-canopy-tour/", "ArborTrek Canopy Adventures", "A harnessed group at the Smugglers' Notch base before the tour"],
    ["https://arbortrek.com/wp-content/uploads/2022/02/zip-line-canopy-tour-arbortrek-cover.jpg", "https://arbortrek.com/zip-line-canopy-tour/", "ArborTrek Canopy Adventures", "The canopy tour line running between platforms above the forest floor"]
  ]
};

// [commonsFileTitle, description, coverage]
const commonsGroups = {
  "beehive-bowl-climb": [
    ["File:Iron Rungs support.jpg", "A climber pulling up on the iron rungs bolted into the Beehive's granite face", "exact-place-or-experience"],
    ["File:Acadia National Park (8111138208).jpg", "The Beehive's bare granite dome seen across the marsh from the Bowl Trail approach", "exact-place-or-experience"],
    ["File:Acadia National Park (8111126059).jpg", "Granite ledges and iron rungs on the Beehive route in autumn colour", "exact-place-or-experience"]
  ],
  "maiden-cliff": [
    ["File:Camden Hills State Park - Maine - 8165896571.jpg", "Open granite ledge and the long view out of Camden Hills State Park", "exact-place-or-experience-context"],
    ["File:Camden Hills State Park - Maine - 8165930116.jpg", "Camden village and harbour in full autumn colour from the park's heights", "exact-place-or-experience-context"],
    ["File:Camden Hills State Park - Maine - 8165894365.jpg", "Low sun over Penobscot Bay from the Camden Hills ridge", "exact-place-or-experience-context"]
  ],
  "bath-iron-works-story": [
    ["File:View of Bath Iron Works from the Maine Maritime Museum, Bath, Maine - 20130917.JPG", "Bath Iron Works cranes and a destroyer on the ways, seen from the museum shore", "exact-place-or-experience"],
    ["File:General Dynamics Bath Iron Works.jpg", "The working shipyard along the Kennebec, the subject of the land-and-sea programme", "exact-place-or-experience"],
    ["File:Maine Maritime Museum.jpg", "The Maine Maritime Museum building where the Bath Iron Works Story begins", "exact-place-or-experience"]
  ],
  "lost-river-gorge": [
    ["File:Lost River Gorge waterfall and platform.jpg", "The boardwalk and stairs threading past a waterfall in the gorge", "exact-place-or-experience"],
    ["File:Lost River Gorge, New Hampshire ^1 - Flickr - ~jar().jpg", "Water falling between the glacial boulders that form the cave system", "exact-place-or-experience"],
    ["File:Cave of Lost Souls, Lost River.jpg", "A historic view of the entrance to the Cave of Lost Souls", "exact-place-or-experience-context"]
  ],
  "k1-scenic-gondola": [
    ["File:Cable Car In Killington Mountain.jpg", "A Killington gondola cabin running above the green mountainside", "exact-place-or-experience"]
  ],
  "beast-mountain-coaster": [
    ["File:North of West Bridgewater (8109123115).jpg", "Peak autumn colour on the hills immediately around Killington", "exact-place-or-experience-context"]
  ],
  "skowhegan-falls-langlais": [
    ["File:Main Street, Skowhegan, Maine (2015).jpg", "Skowhegan's Main Street, the civic landscape around the falls stop", "exact-place-or-experience-context"],
    ["File:Falls at Skowhegan, Kennebec Valley, by John Bachelder.jpg", "The falls on the Kennebec at Skowhegan in a nineteenth-century view", "exact-place-or-experience-context"],
    ["File:Business Section, Water Street, Skowhegan, ME.jpg", "Water Street above the Kennebec gorge in Skowhegan", "exact-place-or-experience-context"]
  ],
  "kittery-outlets": [
    ["File:Kittery Trading Post, Kittery ME.jpg", "Kittery Trading Post, the anchor of the Route 1 outlet strip", "exact-place-or-experience-context"],
    ["File:Town Hall, Kittery ME.jpg", "Kittery town centre beside the Route 1 shopping corridor", "exact-place-or-experience-context"],
    ["File:Rice Memorial Library, Kittery ME.jpg", "Kittery's historic centre a short drive from the outlet blocks", "exact-place-or-experience-context"]
  ]
};

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
}

async function download(url, destination, referer) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": referer ? "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36" : UA,
      ...(referer ? { referer } : {})
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`response too small (${bytes.length} bytes)`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

async function commonsMetadata(titles) {
  const url = new URL(COMMONS_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("titles", titles.join("|"));
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|extmetadata|size|mime");
  url.searchParams.set("iiurlwidth", "1600");
  const payload = await fetch(url, { headers: { "User-Agent": UA } }).then((response) => response.json());
  const strip = (value) => (value || "").replace(/<[^>]+>/g, "").trim();
  const byTitle = new Map();
  for (const page of Object.values(payload.query?.pages || {})) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const extra = info.extmetadata || {};
    byTitle.set(page.title, {
      title: page.title.replace("File:", ""),
      url: info.thumburl || info.url,
      mime: info.thumbmime || info.mime || "image/jpeg",
      source_page: info.descriptionurl,
      creator: strip(extra.Artist?.value) || "Wikimedia Commons contributor",
      license: strip(extra.LicenseShortName?.value) || "See the Commons file page",
      license_url: extra.LicenseUrl?.value || info.descriptionurl
    });
  }
  return byTitle;
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  const placeIds = new Set([...Object.keys(operatorGroups), ...Object.keys(commonsGroups)]);

  for (const placeId of placeIds) {
    if (requestedIds.size && !requestedIds.has(placeId)) continue;
    const record = raw.places[placeId] || { query: placeId, geocode_candidates: [], selected_coordinate: null, image_candidates: [], selected_images: [] };
    const selected = [];

    for (const [index, [url, sourcePage, publisher, description, coverage]] of (operatorGroups[placeId] || []).entries()) {
      const extension = url.includes(".png") ? "png" : "jpg";
      const destination = path.join(IMAGE_DIR, `${placeId}-operator-${index + 1}-${safeName(publisher)}.${extension}`);
      try {
        const mime = await download(url, destination, new URL(url).origin);
        selected.push({
          title: `${placeId} operator image ${index + 1}`,
          mime, width: null, height: null, thumbnail_url: url, original_url: url,
          source_page: sourcePage, description, creator: publisher, credit: publisher,
          license: "Operator publicity image; reuse permission required",
          license_url: sourcePage,
          attribution_required: true, search_query: "curated exact-place operator image",
          local_path: path.relative(ROOT, destination), review_status: "reviewed",
          coverage: coverage || "exact-place-or-experience",
          production_usable: false, rights_status: "permission-required-before-public-deployment"
        });
        console.log(`${placeId}: operator ${publisher}`);
      } catch (error) {
        console.warn(`${placeId}: failed operator ${publisher}: ${error.message}`);
      }
      await sleep(400);
    }

    const commonsEntries = commonsGroups[placeId] || [];
    if (commonsEntries.length) {
      const metadata = await commonsMetadata(commonsEntries.map(([title]) => title));
      for (const [index, [title, description, coverage]] of commonsEntries.entries()) {
        const file = metadata.get(title);
        if (!file) { console.warn(`${placeId}: Commons file not found: ${title}`); continue; }
        const extension = file.mime.includes("png") ? "png" : "jpg";
        const destination = path.join(IMAGE_DIR, `${placeId}-commons-${index + 1}-${safeName(file.title.replace(/\.[a-z]+$/i, ""))}.${extension}`);
        try {
          await download(file.url, destination);
          selected.push({
            title: file.title,
            mime: file.mime, width: null, height: null, thumbnail_url: file.url, original_url: file.url,
            source_page: file.source_page, description, creator: file.creator, credit: file.creator,
            license: file.license, license_url: file.license_url,
            attribution_required: true, search_query: "curated Wikimedia Commons file",
            local_path: path.relative(ROOT, destination), review_status: "reviewed",
            coverage,
            production_usable: true, rights_status: "commons-license-recorded"
          });
          console.log(`${placeId}: commons ${file.title} (${file.license})`);
        } catch (error) {
          console.warn(`${placeId}: failed commons ${title}: ${error.message}`);
        }
        await sleep(900);
      }
    }

    if (selected.length >= 3) record.selected_images = selected;
    else console.warn(`${placeId}: keeping prior selection because only ${selected.length}/3 images downloaded.`);
    raw.places[placeId] = record;
    await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
