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
const commons = (file, description) => e(
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`,
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replaceAll("%2F", "/")}`,
  "Wikimedia Commons",
  description
);

// Exact-place or explicitly labelled local-context fallbacks. External venue
// and editorial files remain private-prototype-only until permission is secured.
const groups = {
  "witchs-dungeon": { replace: [], entries: [
    e("https://ctvisit.com/sites/default/files/styles/social_media_1200x630/public/media/2025-06/WitchesDungeonHero_0.jpg?itok=7mBiUiD8", "https://ctvisit.com/listings/original-witchs-dungeon-museum-classic-movie-museum", "Connecticut Office of Tourism", "Classic movie-monster figures inside Witch's Dungeon")
  ]},
  "columcille": { replace: [0], entries: [
    e("https://static.wixstatic.com/media/e91d68_c646032614c749dc940f3c16bbe7ff35~mv2.jpg", "https://www.columcille.org/visitingthepark", "Columcille Megalith Park", "Standing stones and woodland at Columcille"),
    e("https://static.wixstatic.com/media/e91d68_7adcd497222344eeb2b09d3037dc208f~mv2.jpg", "https://www.columcille.org/visitingthepark", "Columcille Megalith Park", "A second exact view of the hand-built megalith landscape"),
    commons("Thor's Gate - Columcille Megalith Park (3469130060).jpg", "Thor's Gate at Columcille Megalith Park")
  ]},
  "army-heritage": { replace: [2], entries: [
    commons("US Army M16 MGMC AA Half-track.jpg", "A full-scale vehicle display on the Army Heritage Trail")
  ]},
  "state-police-museum": { replace: [0], entries: [
    e("https://www.psp-hemc.org/wp/wp-content/uploads/2023/06/2980-768x550.jpg", "https://www.psp-hemc.org/wp/", "PSP Historical Educational & Memorial Center", "Pennsylvania State Police museum exhibit"),
    e("https://www.psp-hemc.org/wp/wp-content/uploads/2023/06/20220810_092159.jpg", "https://www.psp-hemc.org/wp/", "PSP Historical Educational & Memorial Center", "Historic Pennsylvania State Police objects inside the museum"),
    e("https://www.psp-hemc.org/wp/wp-content/uploads/2023/06/67653442_10157238100123213_893817006791327744_n.jpg", "https://www.psp-hemc.org/wp/", "PSP Historical Educational & Memorial Center", "A further gallery view from the museum's official site")
  ]},
  "gravity-hill": { replace: [], entries: [
    e("https://www.dangerousroads.org/images/stories/__Roads00000hd/GravityHill0.jpg", "https://www.dangerousroads.org/north-america/usa/11864-gravity-hill.html", "Dangerous Roads", "The painted start line on Gravity Hill Road"),
    e("https://wildkidswander.com/wp-content/uploads/2024/09/Gravity-Hill-sign-in-Bedford-County-1024x576.jpg", "https://wildkidswander.com/gravity-hill-bedford-pa/", "Wild Kids Wander", "The roadside Gravity Hill sign in Bedford County"),
    e("https://userpages.umbc.edu/~frizzell/pabedcogravhill_files/image007.jpg", "https://userpages.umbc.edu/~frizzell/pabedcogravhill.html", "UMBC gravity-hill field study", "A field-study view explaining the optical illusion")
  ]},
  "postnatural-history": { replace: [2], entries: [
    e("https://payload.cargocollective.com/1/18/588283/13173873/IMG_6051_1600_c.JPG", "https://cargocollective.com/postnatural/Exhibits/We-Are-Nature-CMNH", "Center for PostNatural History", "PostNatural specimens installed in the We Are Nature exhibition")
  ]},
  "bicycle-heaven": { replace: [1, 2], entries: [
    e("https://thevendry.com/cdn-cgi/image/height=1920,width=1920,fit=contain,metadata=none/https%3A/s3.us-east-1.amazonaws.com/uploads.thevendry.co/36223/1709652531236_2020-05-27.jpg", "https://thevendry.com/venue/190869/bicycle-heaven-pittsburgh-pa", "The Vendry", "Rows of vintage bicycles inside Bicycle Heaven"),
    e("https://uncoveringpa.com/wp-content/uploads/2016/01/Bicycle-Heaven-Pittsburgh-PA.jpg", "https://uncoveringpa.com/bicycle-heaven-pittsburgh", "Uncovering PA", "The dense floor-to-ceiling bicycle collection in Pittsburgh")
  ]},
  "church-brew": { replace: [], entries: [
    commons("The Church Brew Works.jpg", "The former church interior adapted as a working brewery")
  ]},
  "wheeling-heritage-port": { replace: [], entries: [
    e("https://wheelingcvb.com/wp-content/uploads/Heritage-Port-city-photo.jpg", "https://wheelingcvb.com/", "Visit Wheeling", "Heritage Port and downtown Wheeling from the river"),
    e("https://wheelingcvb.com/wp-content/uploads/Tourism-Wheeling-Heritage-Trail.jpg", "https://wheelingcvb.com/outdoors/wheeling-heritage-trails/", "Visit Wheeling", "The riverside Wheeling Heritage Trail"),
    e("https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/WheelingSuspBridge.jpg/1920px-WheelingSuspBridge.jpg", "https://commons.wikimedia.org/wiki/File:WheelingSuspBridge.jpg", "Wikimedia Commons", "The Wheeling Suspension Bridge seen from the riverfront")
  ]},
  "mcclintic-tnt": { replace: [], entries: [
    e("https://wvexplorer.com/wp-content/uploads/2018/08/TNT-Bunker.jpg", "https://wvexplorer.com/2018/08/19/tnt-area-mothman-point-pleasant-wv/", "WV Explorer", "A surviving World War II explosives bunker in the TNT area"),
    e("https://assets.atlasobscura.com/media/W1siZiIsInVwbG9hZHMvcGxhY2VfaW1hZ2VzL2Y5M2U4MzYzLTRmMTItNDU1NC1iNWQwLTE0NjUwNzBlMmFiM2NjODYzMTAxYTk1Mzk1OTc5OV9GQl9JTUdfMTU3MTM2NzYwODkwNC5qcGciXSxbInAiLCJ0aHVtYiIsIjEyMDB4PiJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA4MSAtYXV0by1vcmllbnQiXV0/FB_IMG_1571367608904.jpg", "https://www.atlasobscura.com/places/tnt-area", "Atlas Obscura", "The circular entrance of a TNT-area bunker"),
    e("https://upload.wikimedia.org/wikipedia/commons/9/9e/Laboratory_and_Supervisors_Office_Acid_Area_West_Virginia_Ordnance_Works.jpg", "https://commons.wikimedia.org/wiki/File:Laboratory_and_Supervisors_Office_Acid_Area_West_Virginia_Ordnance_Works.jpg", "Wikimedia Commons", "Historic West Virginia Ordnance Works structures, contextual evidence for the TNT landscape")
  ]},
  "wv-farm-museum": { replace: [0, 1], entries: [
    e("https://visitpointpleasantwv.com/wp-content/uploads/2020/02/farmmuseum-1.jpg", "https://visitpointpleasantwv.com/see-do/", "Visit Point Pleasant", "Historic buildings at the West Virginia State Farm Museum"),
    e("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Old_log_structures_at_the_West_Virginia_State_Farm_Museum%2C_a_50-acre_historical_tract_to_which_32_old_farm_buildings_have_been_relocated%2C_near_the_Mason_County_Fairgrounds_outside_Point_Pleasant%2C_West_LCCN2015631951.tif/lossy-page1-1920px-thumbnail.tif.jpg", "https://commons.wikimedia.org/wiki/File:Old_log_structures_at_the_West_Virginia_State_Farm_Museum,_a_50-acre_historical_tract_to_which_32_old_farm_buildings_have_been_relocated,_near_the_Mason_County_Fairgrounds_outside_Point_Pleasant,_West_LCCN2015631951.tif", "Wikimedia Commons", "Relocated log structures at the exact State Farm Museum")
  ]},
  "flatwoods-monster": { replace: [], entries: [
    e("https://braxtonwv.org/wp-content/uploads/2019/08/dsc_0022ss.jpg", "https://braxtonwv.org/the-flatwoods-monster/visit-the-museum/", "Braxton County CVB", "The Flatwoods Monster Museum interior"),
    e("https://braxtonwv.org/wp-content/uploads/2019/08/dsc_0023ss.jpg", "https://braxtonwv.org/the-flatwoods-monster/visit-the-museum/", "Braxton County CVB", "Braxie folklore displays in Sutton"),
    e("https://braxtonwv.org/wp-content/uploads/2019/08/dsc_0024ss.jpg", "https://braxtonwv.org/the-flatwoods-monster/visit-the-museum/", "Braxton County CVB", "A third exact gallery view inside the museum")
  ]},
  "wv-bigfoot": { replace: [2], entries: [
    e("https://wchstv.com/resources/media/19825ba8-ee88-4ead-a784-c4a1ad3b13db-large16x9_bigfootfestpic.JPG", "https://wchstv.com/news/local/west-virginia-bigfoot-festival-kicking-off-this-week", "WCHS-TV", "The exact Sutton museum's carved Bigfoot and West Virginia sign")
  ]},
  "american-glass": { replace: [1, 2], entries: [
    e("https://magwv.org/wp-content/uploads/2021/09/martin-massman-stueben-art-glass-collection.jpg", "https://magwv.org/exhibitions/martin-massman-stueben-art-glass-collection/", "Museum of American Glass in West Virginia", "Cases of Steuben glass in the Weston museum"),
    e("https://wvexplorer.com/wp-content/uploads/2023/03/West-Virginia-Glass-Museum.jpg", "https://wvexplorer.com/2023/03/29/history-of-glass-west-virginia-glassware/west-virginia-glass-museum/", "WV Explorer", "A colorful gallery view inside the Weston museum")
  ]},
  "assumption-orthodox": { replace: [], entries: [
    e("https://assumption.kneekthewriter.com/wp-content/uploads/2026/03/fr-jon-emanuelson.jpg", "https://assumption.wv.goarch.org/", "Assumption Greek Orthodox Church", "Assumption parish clergy; exact parish context"),
    e("https://assumption.kneekthewriter.com/wp-content/uploads/2026/03/og-blessing.jpg", "https://assumption.wv.goarch.org/", "Assumption Greek Orthodox Church", "A blessing inside the Morgantown parish"),
    e("https://assumption.kneekthewriter.com/wp-content/uploads/2026/03/og-holy-communion.jpg", "https://assumption.wv.goarch.org/", "Assumption Greek Orthodox Church", "Liturgical life at Assumption; parish-context image")
  ]},
  "fort-bedford": { replace: [0, 1, 2], entries: [
    e("https://uncoveringpa.com/wp-content/uploads/2019/09/Fort-Bedford-Museum-4780-768x512.jpg", "https://uncoveringpa.com/fort-bedford-museum", "Uncovering PA", "The Fort Bedford Museum exterior in Fort Bedford Park"),
    e("https://uncoveringpa.com/wp-content/uploads/2019/09/Fort-Bedford-Museum-4786-768x512.jpg", "https://uncoveringpa.com/fort-bedford-museum", "Uncovering PA", "Historic objects inside Fort Bedford Museum"),
    e("https://uncoveringpa.com/wp-content/uploads/2019/09/Fort-Bedford-Museum-4784-768x512.jpg", "https://uncoveringpa.com/fort-bedford-museum", "Uncovering PA", "The reconstructed fort model and interpretation gallery")
  ]},
  "cabelas-hamburg": { replace: [], entries: [
    e("https://www.cra-architects.com/wp-content/uploads/2019/04/photo-3.jpg", "https://www.cra-architects.com/projects/cabelas-hamburg/", "CRA Architects", "Cabela's Hamburg destination store and monumental interior"),
    e("https://www.bridgeandtunnelclub.com/bigmap/outoftown/pennsylvania/berkscounty/hamburg/cabelas/61cabelas.jpg", "https://www.bridgeandtunnelclub.com/bigmap/outoftown/pennsylvania/berkscounty/hamburg/cabelas/index.htm", "Bridge and Tunnel Club", "Conservation Mountain inside the Hamburg store"),
    e("https://www.bridgeandtunnelclub.com/bigmap/outoftown/pennsylvania/berkscounty/hamburg/cabelas/31cabelas.jpg", "https://www.bridgeandtunnelclub.com/bigmap/outoftown/pennsylvania/berkscounty/hamburg/cabelas/index.htm", "Bridge and Tunnel Club", "The aquarium and wildlife displays at Cabela's Hamburg")
  ]},
  "hamburg-mural-walk": { replace: [0, 1, 2], entries: [
    e("https://padiscoveries.com/wp-content/uploads/2024/05/hamburg-main-street-1.jpg", "https://padiscoveries.com/blog/downtown-discoveries-hamburg/", "PA Discoveries", "Main Street in Hamburg's historic core"),
    e("https://padiscoveries.com/wp-content/uploads/2024/05/hamburg-adams-and-bright.jpg", "https://padiscoveries.com/blog/downtown-discoveries-hamburg/", "PA Discoveries", "Adams and Bright Drug Store, a local architectural anchor"),
    e("https://padiscoveries.com/wp-content/uploads/2024/05/hamburg-art-and-craft-gallery.jpg", "https://padiscoveries.com/blog/downtown-discoveries-hamburg/", "PA Discoveries", "Public art and a storefront in downtown Hamburg")
  ]},
  "danbury-museum-streets": { replace: [1, 2], entries: [
    e("https://s.hdnux.com/photos/01/36/30/23/24741095/5/rawImage.jpg", "https://www.newstimes.com/news/article/danbury-ct-hat-city-legacy-hatting-culture-18679811.php", "Hearst Connecticut Media", "A Museum in the Streets marker explaining Danbury's Hat City history"),
    e("https://upload.wikimedia.org/wikipedia/commons/d/d4/Octagon_House%2C_Danbury%2C_CT.jpg", "https://commons.wikimedia.org/wiki/File:Octagon_House,_Danbury,_CT.jpg", "Wikimedia Commons", "The Octagon House, contextual architecture from Danbury's historic city fabric")
  ]},
  "museum-bad-art": { replace: [0, 1, 2], entries: [
    e("https://www.dorchesterbrewing.com/wp-content/uploads/2023/08/Z62_2053-2-scaled.jpg", "https://www.dorchesterbrewing.com/museum-of-bad-art/", "Dorchester Brewing Company", "The Museum of Bad Art gallery inside Dorchester Brewing"),
    e("https://www.bostonmagazine.com/wp-content/uploads/sites/2/2022/08/Museum-of-Bad-Art-at-DBco.jpg", "https://www.bostonmagazine.com/arts-entertainment/2022/08/16/museum-of-bad-art/", "Boston Magazine", "Visitors and paintings at the current MOBA gallery"),
    e("https://media.timeout.com/images/106159151/1920/1080/image.jpg", "https://www.timeout.com/boston/museums/museum-of-bad-art", "Time Out Boston", "A wall of deliberately bad art in the Boston collection")
  ]},
  "ether-dome-russell": { replace: [2], entries: [
    e("https://secretboston.co/wp-content/uploads/2026/01/Inside_the_Ether_Dome_-_27_July_2013.jpg", "https://secretboston.co/the-ether-dome/", "Secret Boston", "The tiered historic Ether Dome surgical amphitheater")
  ]}
};

function safeName(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58); }
async function download(url, destination) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/139.0 Safari/537.36" }, redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 4000) throw new Error(`response too small (${bytes.length} bytes)`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
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
      const ext = /\.png(?:\?|$)/i.test(entry.url) ? "png" : /\.webp(?:\?|$)/i.test(entry.url) ? "webp" : "jpg";
      const destination = path.join(IMAGE_DIR, `${placeId}-external-${index + 1}-${safeName(entry.publisher)}.${ext}`);
      try {
        const mime = await download(entry.url, destination);
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
