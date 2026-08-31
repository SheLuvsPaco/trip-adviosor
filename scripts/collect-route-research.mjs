#!/usr/bin/env node

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ROUTE_SLUG = "route-01-gilded-coast-capital-loop";
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const requestedIds = new Set(process.argv.slice(2));

const places = [
  { id: "risd-museum", geocode: "RISD Museum, 20 North Main Street, Providence, Rhode Island", images: ["RISD Museum Providence"] },
  { id: "benefit-street", geocode: "Benefit Street, Providence, Rhode Island", images: ["Benefit Street Providence Rhode Island"] },
  { id: "castle-hill-lighthouse", geocode: "Castle Hill Lighthouse, Newport, Rhode Island", images: ["Castle Hill Lighthouse Newport Rhode Island"], preferred_files: ["File:Castle Hill Lighthouse at sunset.jpg", "File:Castle Hill Light - Newport RI.jpg", "File:CastleHillLighthouse.jpg"] },
  { id: "cliff-walk", geocode: "Cliff Walk, Newport, Rhode Island", images: ["Newport Cliff Walk Rhode Island"] },
  { id: "the-breakers", geocode: "The Breakers, 44 Ochre Point Avenue, Newport, Rhode Island", images: ["The Breakers Newport Rhode Island mansion"] },
  { id: "watch-hill", geocode: "Watch Hill Lighthouse, Westerly, Rhode Island", images: ["Watch Hill Lighthouse Rhode Island", "Watch Hill Rhode Island Ocean House"] },
  { id: "mystic-seaport", geocode: "Mystic Seaport Museum, 75 Greenmanville Avenue, Mystic, Connecticut", images: ["Mystic Seaport Museum Connecticut"] },
  { id: "beinecke-library", geocode: "Beinecke Rare Book and Manuscript Library, 121 Wall Street, New Haven, Connecticut", images: ["Beinecke Rare Book Library Yale"] },
  { id: "wooster-square", geocode: "Wooster Square Park, New Haven, Connecticut", images: ["Wooster Square New Haven Connecticut", "Wooster Street New Haven pizza"] },
  { id: "woodbury-common", geocode: "Woodbury Common Premium Outlets, 498 Red Apple Court, Central Valley, New York", images: ["Woodbury Common Premium Outlets New York"] },
  { id: "dumbo-brooklyn-bridge-park", geocode: "Brooklyn Bridge Park Pier 1, Brooklyn, New York", images: ["DUMBO Brooklyn Bridge Park Manhattan Bridge", "Brooklyn Bridge Park sunset"] },
  { id: "tenement-museum", geocode: "Tenement Museum, 103 Orchard Street, New York, New York", images: ["Lower East Side Tenement Museum New York"] },
  { id: "st-nicholas-wtc", geocode: "Saint Nicholas Greek Orthodox Church and National Shrine, 130 Liberty Street, New York, New York", images: ["Saint Nicholas Greek Orthodox Church World Trade Center"], preferred_files: ["File:St Nicholas Orthodox Church Manhattan in 2024.png", "File:St Nicholas Greek Orthodox Church during the February 2026 North American blizzard.jpg", "File:St. Nicholas Greek Orthodox Church and National Shrine (55312935307).jpg"] },
  { id: "oculus", geocode: "World Trade Center Transportation Hub Oculus, New York, New York", images: ["World Trade Center Oculus New York interior", "World Trade Center Oculus exterior"] },
  { id: "roosevelt-island-tram", geocode: "Roosevelt Island Tramway Manhattan Station, New York, New York", images: ["Roosevelt Island Tramway New York"] },
  { id: "saint-vitus", geocode: "428 Troutman Street, Brooklyn, New York", images: ["YOB band live", "Bushwick Brooklyn street art"] },
  { id: "grounds-for-sculpture", geocode: "Grounds For Sculpture, 80 Sculptors Way, Hamilton, New Jersey", images: ["Grounds For Sculpture Hamilton New Jersey"] },
  { id: "princeton-art-museum", geocode: "Princeton University Art Museum, Princeton, New Jersey", images: ["Princeton University Art Museum", "Princeton University campus architecture"] },
  { id: "princeton-chapel", geocode: "Princeton University Chapel, Princeton, New Jersey", images: ["Princeton University Chapel"] },
  { id: "elfreths-alley", geocode: "Elfreth's Alley, Philadelphia, Pennsylvania", images: ["Elfreth's Alley Philadelphia"] },
  { id: "reading-terminal-market", geocode: "Reading Terminal Market, 1136 Arch Street, Philadelphia, Pennsylvania", images: ["Reading Terminal Market Philadelphia"] },
  { id: "eastern-state", geocode: "Eastern State Penitentiary, 2027 Fairmount Avenue, Philadelphia, Pennsylvania", images: ["Eastern State Penitentiary Philadelphia"] },
  { id: "magic-gardens", geocode: "Philadelphia's Magic Gardens, 1020 South Street, Philadelphia, Pennsylvania", images: ["Philadelphia Magic Gardens mosaic"], preferred_files: ["File:Magic Garden in Philadelphia.jpg", "File:Magic Garden-Philadelphia.jpg", "File:Magic Gardens (8732256317).jpg"] },
  { id: "fillmore-philadelphia", geocode: "The Fillmore Philadelphia, 29 East Allen Street, Philadelphia, Pennsylvania", images: ["Fillmore Philadelphia concert venue", "Basement band live"], preferred_files: ["File:Omar Apollo Fillmore.jpg", "File:Falling In Reverse Live in Fillmore, Philadelphia.png", "File:Softcult live 2023.jpg"] },
  { id: "federal-hill-park", geocode: "Federal Hill Park, Baltimore, Maryland", images: ["Federal Hill Park Baltimore skyline"] },
  { id: "avam", geocode: "American Visionary Art Museum, 800 Key Highway, Baltimore, Maryland", images: ["American Visionary Art Museum Baltimore"] },
  { id: "snallygaster", geocode: "Pennsylvania Avenue Northwest and 5th Street Northwest, Washington, District of Columbia", images: ["Snallygaster Washington DC festival", "Pennsylvania Avenue Washington DC Capitol"] },
  { id: "st-nicholas-cathedral-dc", geocode: "St Nicholas Orthodox Cathedral, 3500 Massachusetts Avenue Northwest, Washington, District of Columbia", images: ["St Nicholas Orthodox Cathedral Washington DC"], preferred_files: ["File:St Nicholas Wash DC1.jpg", "File:St-Nicholas-Dome.jpg", "File:St. Nicholas Cathedral (55262461240).jpg"] },
  { id: "dumbarton-oaks", geocode: "Dumbarton Oaks Museum, 1700 32nd Street Northwest, Washington, District of Columbia", images: ["Dumbarton Oaks Washington DC museum garden"] },
  { id: "o-street-museum", geocode: "O Museum in The Mansion, 2020 O Street Northwest, Washington, District of Columbia", images: ["Mansion on O Street Washington DC", "Dupont Circle Washington DC architecture"] },
  { id: "lincoln-memorial", geocode: "Lincoln Memorial, Washington, District of Columbia", images: ["Lincoln Memorial Washington DC sunset", "National Mall monuments at night"] },
  { id: "carroll-creek", geocode: "Carroll Creek Linear Park, Frederick, Maryland", images: ["Carroll Creek Linear Park Frederick Maryland", "historic downtown Frederick Maryland"] },
  { id: "gettysburg-battlefield", geocode: "Gettysburg National Military Park Museum and Visitor Center, 1195 Baltimore Pike, Gettysburg, Pennsylvania", images: ["Gettysburg National Military Park battlefield", "Gettysburg battlefield monuments"] },
  { id: "easton-centre-square", geocode: "Centre Square, Easton, Pennsylvania", images: ["Centre Square Easton Pennsylvania", "downtown Easton Pennsylvania"] },
  { id: "steelstacks", geocode: "SteelStacks, 101 Founders Way, Bethlehem, Pennsylvania", images: ["SteelStacks Bethlehem Pennsylvania", "Hoover Mason Trestle Bethlehem Steel"] },
  { id: "historic-bethlehem", geocode: "Historic Bethlehem Visitor Center, 505 Main Street, Bethlehem, Pennsylvania", images: ["Historic Bethlehem Pennsylvania Main Street"] },
  { id: "da-vinci-science-center", geocode: "Da Vinci Science Center at PPL Pavilion, 815 West Hamilton Street, Allentown, Pennsylvania", images: ["Da Vinci Science Center Allentown PPL Pavilion", "downtown Allentown Pennsylvania"] },
  { id: "delaware-water-gap", geocode: "Point of Gap Overlook, Delaware Water Gap, Pennsylvania", images: ["Delaware Water Gap Point of Gap overlook", "Delaware Water Gap Pennsylvania autumn"] },
  { id: "paterson-great-falls", geocode: "Paterson Great Falls National Historical Park, Paterson, New Jersey", images: ["Paterson Great Falls National Historical Park", "Great Falls Paterson New Jersey"] },
  { id: "carousel-museum", geocode: "New England Carousel Museum, 95 Riverside Avenue, Bristol, Connecticut", images: ["New England Carousel Museum Bristol Connecticut"] },
  { id: "beacon-main-street", geocode: "Main Street and North Walnut Street, Beacon, New York", images: ["Main Street Beacon New York", "Beacon New York downtown"] },
  { id: "old-sturbridge-village", geocode: "Old Sturbridge Village, 1 Old Sturbridge Village Road, Sturbridge, Massachusetts", images: ["Old Sturbridge Village Massachusetts", "Old Sturbridge Village historic buildings"] },
  {
    id: "newport-car-museum",
    geocode: "Newport Car Museum, 1947 West Main Road, Portsmouth, Rhode Island",
    images: ["Newport Car Museum Portsmouth Rhode Island"],
    preferred_files: [
      "File:Ford Gallery at the Newport Auto Museum, Portsmouth, Rhode Island (US) (55219905019).jpg",
      "File:Porsche Gallery at the Newport Auto Museum, Portsmouth, Rhode Island (US) (55222011680).jpg",
      "File:Ford Gallery at the Newport Auto Museum, Portsmouth, Rhode Island (US) (55219809348).jpg"
    ]
  },
  {
    id: "submarine-force-museum",
    geocode: "Submarine Force Library and Museum, 1 Crystal Lake Road, Groton, Connecticut",
    images: ["USS Nautilus SSN-571 museum Groton Connecticut"],
    preferred_files: [
      "File:Nautilus (SSN 571) Groton CT 2002 May 08.jpg",
      "File:USS Nautilus SSN571.JPG",
      "File:USS Natilus (SSN 571) Propellers.jpg"
    ]
  },
  {
    id: "untermyer-gardens",
    geocode: "Untermyer Park and Gardens, 945 North Broadway, Yonkers, New York",
    images: ["Untermyer Gardens Yonkers New York"],
    preferred_files: [
      "File:Untermyer Park and Gardens, Yonkers, NY.jpg",
      "File:2020 Untermyer Gardens Rock & Stream Garden waterfall.jpg",
      "File:2020 Untermyer Gardens loggia (east).jpg"
    ]
  },
  {
    id: "museum-eldridge-street",
    geocode: "Museum at Eldridge Street, 12 Eldridge Street, New York, New York",
    images: ["Eldridge Street Synagogue interior"],
    preferred_files: [
      "File:Eldridge Street Synagogue (42773).jpg",
      "File:Eldridge Street Synagogue Looking Up.jpg",
      "File:Eldridge Street Synagogue pews and window.jpg"
    ]
  },
  {
    id: "morven-museum",
    geocode: "Morven Museum and Garden, 55 Stockton Street, Princeton, New Jersey",
    images: ["Morven Princeton New Jersey historic house"],
    preferred_files: [
      "File:GENERAL VIEW OF EXTERIOR - Morven, 55 Stockton Street (U.S. Highway 206), Princeton, Mercer County, NJ HABS NJ,11-PRINT,7-1.tif",
      "File:VIEW OF SOUTH FRONT FACADE FROM SOUTHEAST - Morven, 55 Stockton Street (U.S. Highway 206), Princeton, Mercer County, NJ HABS NJ,11-PRINT,7-5.tif",
      "File:VIEW OF MAIN STAIRHALL - Morven, 55 Stockton Street (U.S. Highway 206), Princeton, Mercer County, NJ HABS NJ,11-PRINT,7-13.tif"
    ]
  },
  {
    id: "wagner-free-institute",
    geocode: "Wagner Free Institute of Science, 1700 West Montgomery Avenue, Philadelphia, Pennsylvania",
    images: ["Wagner Free Institute of Science Philadelphia"],
    preferred_files: [
      "File:Wagner Free Institute of Science, 1700 West Montgomery Avenue, Philadelphia, Philadelphia County, PA HABS PA,51-PHILA,751-19.tif",
      "File:Wagner Free Institute of Science, 1700 West Montgomery Avenue, Philadelphia, Philadelphia County, PA HABS PA,51-PHILA,751-20.tif",
      "File:Wagner Free Institute of Science, 1700 West Montgomery Avenue, Philadelphia, Philadelphia County, PA HABS PA,51-PHILA,751-4.tif"
    ]
  },
  {
    id: "national-building-museum",
    geocode: "National Building Museum, 401 F Street Northwest, Washington, District of Columbia",
    images: ["National Building Museum Washington DC interior"],
    preferred_files: [
      "File:National Building Museum, Washington DC.jpg",
      "File:National Building Museum - interior columns.JPG",
      "File:National Building Museum - interior.JPG"
    ]
  },
  {
    id: "hillwood-estate",
    geocode: "Hillwood Estate Museum and Gardens, 4155 Linnean Avenue Northwest, Washington, District of Columbia",
    images: ["Hillwood Estate Washington DC"],
    preferred_files: [
      "File:Hillwood Museum Exterior Front.jpg",
      "File:Hillwood Estate - Dec 2018 - Stierch 14.jpg",
      "File:Dacha at Hillwood Estate, Museum & Gardens, Washington, D.C. - Sarah Stierch.jpg"
    ]
  },
  {
    id: "lost-river-caverns",
    geocode: "Lost River Caverns, 726 Durham Street, Hellertown, Pennsylvania",
    images: ["Lost River Caverns Hellertown Pennsylvania"],
    preferred_files: [
      "File:Lost River Caverns (Lost Cave) Hellertown, Pa., crystal ball room (72675).jpg",
      "File:Lost River Caverns (Lost Cave) Hellertown, Pa., long bridge over the river (72673).jpg",
      "File:Lost Cave, Hellertown, Pa., crystals in new room (71560).jpg"
    ]
  },
  {
    id: "ramapo-valley-reservation",
    geocode: "Ramapo Valley County Reservation, 608 Ramapo Valley Road, Mahwah, New Jersey",
    images: ["Ramapo Valley County Reservation", "Scarlet Oak Pond Ramapo", "MacMillan Reservoir Ramapo"],
    preferred_files: [
      "File:Scarlet Oak Pond.jpg",
      "File:McMillan Brook Falls - Mahwah, New Jersey 2023-01-18 (01).jpg",
      "File:MacMillan Reservoir - Mahwah, New Jersey 2023-01-18 (01).jpg"
    ]
  },
  {
    id: "american-clock-watch-museum",
    geocode: "American Clock and Watch Museum, 100 Maple Street, Bristol, Connecticut",
    images: ["American Clock Watch Museum Bristol clocks"],
    preferred_files: [
      "File:American Clock and Watch Museum, Bristol CT.jpg",
      "File:2007-dgc-usa-06th-AWCM-gen Us clks.jpg",
      "File:AMCM CT shelf clocks-06-09-2007.JPG"
    ]
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function safeName(value) {
  return value
    .toLowerCase()
    .replace(/^file:/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

async function fetchWithBackoff(url, options = {}, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, {
      ...options,
      headers: {
        "User-Agent": "TripAdvisorRouteDataset/1.0 (personal itinerary research)",
        ...(options.headers || {}),
      },
    });
    if (response.ok) return response;
    if (response.status !== 429 || attempt === attempts) {
      throw new Error(`${response.status} ${response.statusText}: ${url}`);
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retryAfter) ? retryAfter * 1000 : attempt * 15000;
    process.stdout.write(`rate-limited; retrying in ${Math.ceil(delay / 1000)}s... `);
    await sleep(delay);
  }
  throw new Error(`Unreachable retry state: ${url}`);
}

async function fetchJson(url, options = {}) {
  const response = await fetchWithBackoff(url, options);
  return response.json();
}

async function geocode(query) {
  const params = new URLSearchParams({ q: query, format: "jsonv2", limit: "3", addressdetails: "1" });
  const results = await fetchJson(`https://nominatim.openstreetmap.org/search?${params}`);
  await sleep(1100);
  return results.map((result) => ({
    display_name: result.display_name,
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    category: result.category,
    type: result.type,
    importance: result.importance,
    osm_type: result.osm_type,
    osm_id: result.osm_id,
    bounding_box: result.boundingbox?.map(Number),
  }));
}

async function searchCommons(query) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size",
    iiurlwidth: "900",
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const pages = Object.values(data.query?.pages || {}).sort((a, b) => (a.index || 999) - (b.index || 999));
  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      const meta = info?.extmetadata || {};
      if (!info || !["image/jpeg", "image/png", "image/webp", "image/tiff"].includes(info.mime)) return null;
      return {
        title: page.title,
        mime: info.mime,
        width: info.width,
        height: info.height,
        thumbnail_url: info.thumburl || info.url,
        original_url: info.url,
        source_page: info.descriptionurl,
        description: stripHtml(meta.ImageDescription?.value || meta.ObjectName?.value || ""),
        creator: stripHtml(meta.Artist?.value || "Unknown"),
        credit: stripHtml(meta.Credit?.value || ""),
        license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || "Unknown"),
        license_url: meta.LicenseUrl?.value || null,
        attribution_required: meta.AttributionRequired?.value === "true",
      };
    })
    .filter(Boolean);
}

async function exactCommonsFiles(titles) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: titles.join("|"),
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size",
    iiurlwidth: "900",
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const requestedOrder = new Map(titles.map((title, index) => [title.replaceAll("_", " ").toLowerCase(), index]));
  return Object.values(data.query?.pages || {}).map((page) => {
    const info = page.imageinfo?.[0];
    const meta = info?.extmetadata || {};
    if (!info || !["image/jpeg", "image/png", "image/webp", "image/tiff"].includes(info.mime)) return null;
    return {
      title: page.title,
      mime: info.mime,
      width: info.width,
      height: info.height,
      thumbnail_url: info.thumburl || info.url,
      original_url: info.url,
      source_page: info.descriptionurl,
      description: stripHtml(meta.ImageDescription?.value || meta.ObjectName?.value || ""),
      creator: stripHtml(meta.Artist?.value || "Unknown"),
      credit: stripHtml(meta.Credit?.value || ""),
      license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || "Unknown"),
      license_url: meta.LicenseUrl?.value || null,
      attribution_required: meta.AttributionRequired?.value === "true",
      search_query: "exact Commons filename"
    };
  }).filter(Boolean).sort((left, right) => {
    const leftOrder = requestedOrder.get(left.title.replaceAll("_", " ").toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = requestedOrder.get(right.title.replaceAll("_", " ").toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

async function downloadImage(url, destination) {
  try {
    await access(destination);
    return;
  } catch {
    // Download missing file.
  }
  const response = await fetchWithBackoff(url);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(destination, bytes);
}

async function main() {
  await mkdir(ROUTE_DIR, { recursive: true });
  await mkdir(IMAGE_DIR, { recursive: true });
  const outputPath = path.join(ROUTE_DIR, "research-raw.json");
  let output;
  try {
    output = JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    output = {
      generated_at: new Date().toISOString(),
      geocoding_source: "OpenStreetMap Nominatim",
      image_source: "Wikimedia Commons",
      image_policy: "Only reusable Commons files are downloaded; retain creator and license attribution.",
      places: {},
    };
  }

  const selectedPlaces = requestedIds.size ? places.filter((place) => requestedIds.has(place.id)) : places;
  const unknownIds = [...requestedIds].filter((id) => !places.some((place) => place.id === id));
  if (unknownIds.length) throw new Error(`Unknown place ids: ${unknownIds.join(", ")}`);

  for (const [position, place] of selectedPlaces.entries()) {
    const existing = output.places[place.id];
    if (existing?.selected_images?.length >= 3 && !place.preferred_files) {
      process.stdout.write(`[${position + 1}/${places.length}] ${place.id}: already complete\n`);
      continue;
    }
    process.stdout.write(`[${position + 1}/${selectedPlaces.length}] ${place.id}: geocoding... `);
    let geocodeCandidates = output.places[place.id]?.geocode_candidates || [];
    try {
      if (!geocodeCandidates.length) geocodeCandidates = await geocode(place.geocode);
      process.stdout.write(`${geocodeCandidates.length} candidates; images... `);
    } catch (error) {
      process.stdout.write(`geocode failed (${error.message}); images... `);
    }

    let imageCandidates = output.places[place.id]?.image_candidates || [];
    if (place.preferred_files?.length) {
      try {
        imageCandidates = await exactCommonsFiles(place.preferred_files);
      } catch (error) {
        process.stdout.write(`preferred-file lookup failed (${error.message}); `);
      }
    }
    if (imageCandidates.length < 3) {
      if (place.exact_files?.length) {
        try {
          imageCandidates.push(...await exactCommonsFiles(place.exact_files));
        } catch (error) {
          process.stdout.write(`exact-file lookup failed (${error.message}); `);
        }
      }
      for (const query of place.images) {
        try {
          const candidates = await searchCommons(query);
          for (const candidate of candidates) {
            if (!imageCandidates.some((item) => item.original_url === candidate.original_url)) {
              imageCandidates.push({ ...candidate, search_query: query });
            }
          }
        } catch (error) {
          process.stdout.write(`search failed (${error.message}); `);
        }
        if (imageCandidates.length >= 5) break;
        await sleep(1500);
      }
    }

    const selectedImages = [];
    for (const [imageIndex, candidate] of imageCandidates.slice(0, 3).entries()) {
      const extension = candidate.mime === "image/png" ? "png" : candidate.mime === "image/webp" ? "webp" : "jpg";
      const filename = `${place.id}-${imageIndex + 1}-${safeName(candidate.title)}.${extension}`;
      const destination = path.join(IMAGE_DIR, filename);
      try {
        await downloadImage(candidate.thumbnail_url, destination);
        selectedImages.push({
          ...candidate,
          local_path: path.relative(ROOT, destination),
          review_status: "needs_visual_review",
        });
      } catch (error) {
        process.stdout.write(`download failed (${error.message}); `);
      }
      await sleep(2000);
    }

    output.places[place.id] = {
      query: place.geocode,
      geocode_candidates: geocodeCandidates,
      selected_coordinate: geocodeCandidates[0] || null,
      image_candidates: imageCandidates,
      selected_images: selectedImages,
    };
    output.generated_at = new Date().toISOString();
    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
    process.stdout.write(`${selectedImages.length} saved\n`);
    await sleep(1500);
  }

  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  process.stdout.write(`Research written to ${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
