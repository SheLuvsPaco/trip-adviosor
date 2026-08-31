#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const RAW_PATH = path.join(ROOT, "dataset", "routes", ROUTE_SLUG, "research-raw.json");
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);

// These files were already downloaded by the Route 10 research pass. Each was
// matched back to its Commons metadata and visually reviewed before selection.
const cachedSelections = {
  "agecroft-hall": [
    { filename: "agecroft-hall-3-gardens-old-and-new-agecroft-hall-lancashire-pegged-and-jointed-english--25bcb325.jpg" }
  ],
  "boston-athenaeum": [
    { filename: "boston-athenaeum-1-boston-massachusetts-boston-athenaeum-reading-room-dpla-dcc7bd0d06dc01be-9e6295e9.jpg" },
    { filename: "boston-athenaeum-curated-1-file-boston-athenaeum-leventhal-room-jpg.jpg", title: "File:Boston Athenaeum Leventhal Room.jpg" }
  ],
  "harrisonburg-public-art": [
    { filename: "harrisonburg-public-art-1-historical-marker-a33-court-square-downtown-harrisonburg-va-july-2008-jp-4e3859b1.jpg" },
    { filename: "harrisonburg-public-art-2-country-fair-and-trading-court-house-square-mural-study-harrisonburg-vir-c1eaa1e3.jpg" }
  ],
  "roanoke-pinball": [
    { filename: "roanoke-pinball-1-roanoke-virginia-30005826524-jpg-6a3b83d6.jpg" }
  ],
  skylands: [
    { filename: "skylands-curated-1-file-skylands3-jpg.jpg", title: "File:Skylands3.jpg" }
  ],
  waterworks: [
    { filename: "waterworks-1-great-engines-hall-metropolitan-waterworks-museum-9336-jpg-b0a621ed.jpg" },
    { filename: "waterworks-3-metropolitan-waterworks-museum-boston-massachusetts-jpg-a6f3daa3.jpg" }
  ]
};

function fingerprint(url) {
  return createHash("sha1").update(url).digest("hex").slice(0, 8);
}

async function main() {
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  let added = 0;

  for (const [placeId, selections] of Object.entries(cachedSelections)) {
    const record = raw.places[placeId];
    if (!record) throw new Error(`Missing Route 10 research record: ${placeId}`);
    const selected = [...(record.selected_images || [])];
    const selectedUrls = new Set(selected.map((image) => image.original_url));

    for (const selection of selections) {
      if (selected.length >= 5) break;
      await access(path.join(IMAGE_DIR, selection.filename));
      const hash = selection.filename.match(/-([0-9a-f]{8})\.[^.]+$/i)?.[1];
      const candidate = (record.image_candidates || []).find((image) =>
        selection.title ? image.title === selection.title : fingerprint(image.original_url) === hash
      );
      if (!candidate) throw new Error(`Could not match cached metadata for ${selection.filename}`);
      if (selectedUrls.has(candidate.original_url)) continue;
      selected.push({
        ...candidate,
        local_path: path.relative(ROOT, path.join(IMAGE_DIR, selection.filename)),
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
  console.log(`Added ${added} reviewed Route 10 images without new downloads.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
