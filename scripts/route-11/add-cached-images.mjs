#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const RAW_PATH = path.join(ROOT, "dataset", "routes", ROUTE_SLUG, "research-raw.json");
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);

// These files were downloaded during the first Route 11 research pass. They
// were matched to their Commons metadata and visually reviewed as a group.
const cachedSelections = {
  barnes: [
    "barnes-1-exterior-of-the-barnes-foundation-dpla-5b7a2b1d373255fdef315a60b69a552f--d7bf522e.jpg",
    "barnes-2-dr-a-c-barnes-barnes-foundation-loc-gsc-5a31120-jpg-13538489.jpg"
  ],
  "peabody-library": [
    "peabody-library-1-detail-at-the-george-peabody-library-formerly-the-library-of-the-peabody-d7097981.jpg",
    "peabody-library-2-detail-at-the-george-peabody-library-formerly-the-library-of-the-peabody-e46ae419.jpg"
  ],
  biltmore: [
    "biltmore-1-winter-garden-exterior-biltmore-estate-asheville-nc-46727575971-jpg-d2160b95.jpg",
    "biltmore-2-biltmore-estate-side-profile-jpg-a944ce8d.jpg"
  ],
  "mardi-gras-world": [
    "mardi-gras-world-1-leviathan-float-orpheus-mardi-gras-jpg-8f0bc63e.jpg",
    "mardi-gras-world-3-uranus-proteus-float-new-orleans-mardi-gras-1886-jpg-d419c0eb.jpg"
  ],
  "lake-martin-swamp": [
    "lake-martin-swamp-2-lake-martin-la-usa-cypress-2-jpg-45d26001.jpg"
  ],
  "space-center-houston": [
    "space-center-houston-1-entry-to-nasa-mission-control-at-johnson-space-center-in-houston-texas-u-43e9d1f8.jpg",
    "space-center-houston-2-apollo-mission-control-isometric-cutaway-nasa-johnson-space-center-apoll-6953ad23.jpg"
  ],
  "buffalo-bayou-cistern": [
    "buffalo-bayou-cistern-1-buffalo-bayou-park-cistern-jpg-e080e535.jpg"
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
    if (!record) throw new Error(`Missing Route 11 research record: ${placeId}`);
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
  console.log(`Added ${added} reviewed Route 11 images without new downloads.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
