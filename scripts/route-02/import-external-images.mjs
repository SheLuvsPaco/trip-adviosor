#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const requestedIds = new Set(process.argv.slice(2));

const groups = {
  "three-sisters-sanctuary": {
    mode: "replace",
    images: [
      ["https://spacesarchives.org/assets/2012/03/30/dscf0605.jpg", "https://spacesarchives.org/explore/search-the-online-collection/the-three-sisters-sanctuary/", "SPACES Archives", "Three Sisters Sanctuary stone dragon and environmental-art garden"],
      ["https://threesisterssanctuary.com/wp-content/uploads/2023/11/richardden-1024x576.jpeg", "https://threesisterssanctuary.com/fire-breathing-dragon/", "Three Sisters Sanctuary", "The Dragon's Den mosaic and stone installation"],
      ["https://www.artshubwma.org/assets/images/a/62004003_2632604200123372_5856967006573559808_n-a4515e55.jpg", "https://www.artshubwma.org/profile/three-sisters-sanctuary", "ArtsHub of Western Massachusetts", "Standing stones, gardens and fire-dragon installation at Three Sisters Sanctuary"]
    ]
  },
  "empire-state-carousel": {
    mode: "replace",
    images: [
      ["https://uncoveringnewyork.com/wp-content/uploads/2022/09/Farmers-Museum-Cooperstown-3224.jpg", "https://uncoveringnewyork.com/farmers-museum-cooperstown/", "Uncovering New York", "Empire State Carousel inside its wooden pavilion"],
      ["https://www.visitingcooperstown.com/Pagemill-1/carousel.jpg", "https://www.visitingcooperstown.com/Farmers-Museum-Cooperstown.html", "Visiting Cooperstown", "Hand-carved animals and folklore panels on the Empire State Carousel"],
      ["https://sharonspostcards.weebly.com/uploads/1/1/3/3/11331409/7310259_orig.jpg", "https://sharonspostcards.weebly.com/postcards-blog/empire-state-carousel", "Postcards From The Road", "The illuminated Empire State Carousel at Fenimore Farm"]
    ]
  },
  "iroquois-museum": {
    mode: "replace",
    images: [
      ["https://assets.simpleviewinc.com/simpleview/image/fetch/q_75/https%3A/assets.simpleviewinc.com/simpleview/image/upload/crm/newyorkstate/Iroquois-Indian-Museum---Long-house_270cfb21-ba9f-2ebc-80279f00aa9c8bbd.jpg", "https://www.iloveny.com/listing/iroquois-museum/2435/", "I LOVE NY", "The Iroquois Museum's longhouse-inspired architecture"],
      ["https://assets.simpleviewinc.com/simpleview/image/fetch/q_75/https%3A/assets.simpleviewinc.com/simpleview/image/upload/crm/newyorkstate/IIM_02_8F4404A2-BFB9-2E0D-E5F6367593E05AFA-8f4403d4c756836_8f4404fa-9e16-c721-68340aab5c6d05ef.jpg", "https://www.iloveny.com/listing/iroquois-museum/2435/", "I LOVE NY", "Iroquois Museum exterior, grounds and longhouse form"],
      ["https://npr.brightspotcdn.com/legacy/sites/wamc/files/202007/museum.jpg", "https://www.wamc.org/new-york-news/2020-07-06/iroquois-indian-museum-offers-outdoor-exhibition-on-stereotypes", "WAMC", "Iroquois Museum outdoor pavilion and exhibition grounds"]
    ]
  },
  "artisanworks": {
    mode: "replace",
    images: [
      ["https://assets.simpleviewinc.com/simpleview/image/upload/crm/newyorkstate/52_2675bb36-ae21-617e-c43f363da4342798.jpg", "https://www.iloveny.com/listing/artisanworks/208/", "I LOVE NY", "ARTISANworks industrial gallery filled with eclectic installations"],
      ["https://assets.simpleviewinc.com/simpleview/image/fetch/c_limit%2Ch_1200%2Cq_75%2Cw_1200/https%3A/Rochester.simpleviewcrm.com/images/listings/original_Artisan-Works.jpg", "https://www.visitrochester.com/listing/artisanworks/6963/", "Visit Rochester", "ARTISANworks gallery corridor and collection"],
      ["https://images.zola.com/bc17afeb-bb5c-4a69-a729-0b00aa1d1a26?fit=crop&h=675&q=60&w=1200", "https://www.zola.com/wedding-vendors/wedding-venues/artisanworks", "Zola", "ARTISANworks art-filled industrial interior"]
    ]
  },
  "radio-social": {
    mode: "replace",
    images: [
      ["https://media2.roccitymag.com/rochester/imager/u/slideshow/15533990/radio_social_bowling_4.png", "https://www.roccitymag.com/special-sections/best-bowling-radio-social-15521036", "CITY Magazine Rochester", "Radio Social bowling lounge and seating"],
      ["https://i0.wp.com/theurbanphoenix.com/wp-content/uploads/2017/04/photo-apr-27-12-26-01-pm1.png?resize=810%2C541&ssl=1", "https://theurbanphoenix.com/2017/04/29/radiosocial/", "The Urban Phoenix", "Radio Social lanes and industrial social space"],
      ["https://place.com-photos.com/91414/radio-social-AF1QipM_t-aKs6gQ0J-9rkNCf507gJqHBz--OZsMaqn1.jpg", "https://radio-social.com-place.com/", "Radio Social venue listing", "Radio Social lanes with the venue's SOCIAL wall"]
    ]
  },
  "cave-of-the-winds": {
    mode: "replace",
    images: [
      ["https://framerusercontent.com/images/4QV89F9aTR8N8zbl8erORIJZ47Y.jpg?height=1000&width=1600", "https://www.tickadoo.com/niagara-falls/maid-of-the-mist-cave-winds-observation-tour", "Tickadoo", "Visitors in ponchos on the Cave of the Winds decks beside Bridal Veil Falls"],
      ["https://static.wixstatic.com/media/a6ba08_4a1b05984a0f4bdbb87a5f17a36f3051~mv2.jpg/v1/fill/w_980%2Ch_585%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_auto/a6ba08_4a1b05984a0f4bdbb87a5f17a36f3051~mv2.jpg", "https://www.niagaraaction.com/get-drenched-stand-under-niagara-falls-at-the-cave-of-the-winds-hurricane-deck", "Niagara Action", "The Hurricane Deck at Cave of the Winds directly beneath the falling water"],
      ["https://heroesofadventure.com/wp-content/uploads/2018/02/585244-1370577665-1.jpg", "https://heroesofadventure.com/listing/cave-of-the-winds-niagara-falls-new-york-usa/", "Heroes of Adventure", "Cave of the Winds redwood decks, stairways and yellow ponchos"]
    ]
  },
  "magic-wings": {
    mode: "prepend",
    images: [
      ["https://explorewesternmass.com/wp-content/uploads/2018/02/magic-wings.jpg", "https://explorewesternmass.com/magic-wings-butterfly-conservatory-gardens/", "Explore Western Mass", "Visitors inside Magic Wings' tropical butterfly conservatory"]
    ]
  },
  "house-of-guitars": {
    mode: "append",
    images: [
      ["https://houseofguitars.com/wp-content/uploads/2024/09/frontalfull.jpg", "https://houseofguitars.com/contact/", "House of Guitars", "House of Guitars storefront on Titus Avenue"]
    ]
  },
  "turnpark-art-space": {
    mode: "append",
    images: [
      ["https://www.allegrone.com/writable/imager/images/7396/Turn-Park-Art-Space-74_f47f9183f23a7818caa04834f2ecb469.jpg", "https://www.allegrone.com/our-work/turn-park-art-space", "Allegrone", "TurnPark sculptures and Gate House courtyard"],
      ["https://images.zola.com/8c225a4a-6c21-4f0b-89df-1f259834c287", "https://www.zola.com/wedding-vendors/wedding-venues/turnpark-art-space", "Zola", "TurnPark courtyard, pavilion and sculpture setting"]
    ]
  }
};

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
}

async function download(url, destination) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 TripAdvisorRouteDataset/2.0" }, redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`response too small (${bytes.length} bytes)`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  for (const [placeId, group] of Object.entries(groups)) {
    if (requestedIds.size && !requestedIds.has(placeId)) continue;
    const existing = raw.places[placeId] || { query: placeId, geocode_candidates: [], selected_coordinate: null, image_candidates: [], selected_images: [] };
    const original = [...existing.selected_images];
    const selected = group.mode === "append" ? [...original] : [];
    for (const [index, entry] of group.images.entries()) {
      const [url, sourcePage, publisher, description] = entry;
      if (selected.some((image) => image.original_url === url)) continue;
      const filename = `${placeId}-external-${index + 1}-${safeName(publisher)}.jpg`;
      const destination = path.join(IMAGE_DIR, filename);
      try {
        const mime = await download(url, destination);
        selected.push({
          title: `${placeId} exact venue image ${index + 1}`,
          mime,
          width: null,
          height: null,
          thumbnail_url: url,
          original_url: url,
          source_page: sourcePage,
          description,
          creator: publisher,
          credit: publisher,
          license: "External editorial image; reuse permission required",
          license_url: sourcePage,
          attribution_required: true,
          search_query: "curated exact-place web image",
          local_path: path.relative(ROOT, destination),
          review_status: "needs_visual_review",
          production_usable: false,
          rights_status: "permission-required-before-public-deployment"
        });
        console.log(`${placeId}: imported ${publisher}`);
      } catch (error) {
        console.warn(`${placeId}: failed ${publisher}: ${error.message}`);
      }
    }
    existing.selected_images = (group.mode === "prepend" ? [...selected, ...original] : selected).slice(0, 3);
    raw.places[placeId] = existing;
    await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
