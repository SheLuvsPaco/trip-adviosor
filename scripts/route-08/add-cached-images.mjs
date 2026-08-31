#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const RAW_PATH = path.join(ROOT, "dataset", "routes", ROUTE_SLUG, "research-raw.json");
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);

// These exact-place files were already present locally, matched back to their
// Commons metadata, and visually reviewed. This avoids another broad download
// pass when Wikimedia is rate-limiting the route collectors.
const cachedSelections = {
  "wadsworth-atheneum": [
    "wadsworth-atheneum-2-maestro-di-hartford-vasi-di-fiori-e-frutta-su-tavolo-hartford-wadsworth--3c170976.jpg",
    "wadsworth-atheneum-3-travelers-tower-wadsworth-atheneum-and-municipal-building-jpg-e4c7602d.jpg"
  ],
  "bear-mountain-perkins": [
    "bear-mountain-perkins-3-perkins-memorial-tower-54495185255-jpg-7c54565e.jpg"
  ],
  "natural-bridge": [
    "natural-bridge-1-down-the-cedar-creek-trail-past-the-bridge-at-natural-bridge-state-park--9f89cd20.jpg",
    "natural-bridge-2-cedar-creek-trail-couple-holding-hands-natural-bridge-state-park-3065514-6da87bae.jpg"
  ],
  "petersburg-battlefield": [
    "petersburg-battlefield-curated-2-view-of-battery-5-from-the-eastern-front-visitor-center-ee-79adb292.jpg"
  ],
  "keystone-tractor": [
    "keystone-tractor-1-1957-metropolitan-by-amc-in-red-and-white-at-keystone-truck-and-tractor--e8ebb5ac.jpg",
    "keystone-tractor-3-1967-jeep-jeepster-v6-in-red-and-white-at-keystone-truck-and-tractor-mus-beb8d5f9.jpg"
  ],
  "poe-museum": [
    "poe-museum-1-old-stone-house-untitled-16810997816-jpg-8382e6b4.jpg"
  ],
  "met-cloisters": [
    "met-cloisters-curated-1-the-met-cloisters-side-view-jpg-5563456b.jpg",
    "met-cloisters-curated-3-interior-view-of-the-nave-of-barnard-s-cloisters-met-dp830-bc5f1ebf.jpg"
  ]
};

function fingerprint(url) {
  return createHash("sha1").update(url).digest("hex").slice(0, 8);
}

async function main() {
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  let added = 0;

  for (const [placeId, filenames] of Object.entries(cachedSelections)) {
    const record = raw.places[placeId];
    if (!record) throw new Error(`Missing Route 08 research record: ${placeId}`);
    const selected = [...(record.selected_images || [])];
    const selectedUrls = new Set(selected.map((image) => image.original_url));

    for (const filename of filenames) {
      if (selected.length >= 5) break;
      await access(path.join(IMAGE_DIR, filename));
      const hash = filename.match(/-([0-9a-f]{8})\.[^.]+$/i)?.[1];
      const candidate = (record.image_candidates || []).find((image) => fingerprint(image.original_url) === hash);
      if (!candidate) throw new Error(`Could not match cached metadata for ${filename}`);
      if (selectedUrls.has(candidate.original_url)) continue;
      selected.push({
        ...candidate,
        local_path: path.relative(ROOT, path.join(IMAGE_DIR, filename)),
        review_status: "reviewed",
        production_usable: candidate.license !== "Unknown",
        rights_status: "commons-license-recorded"
      });
      selectedUrls.add(candidate.original_url);
      added += 1;
    }
    record.selected_images = selected;
  }

  await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`Added ${added} reviewed cached images without network downloads.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
