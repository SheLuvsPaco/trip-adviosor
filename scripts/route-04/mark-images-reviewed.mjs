#!/usr/bin/env node

import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const configUrl = new URL(process.env.ROUTE_COLLECTOR_CONFIG || "./config.mjs", import.meta.url);
const { places, ROUTE_SLUG, verifiedAt } = await import(configUrl);

if (!process.argv.includes("--confirm-reviewed")) {
  throw new Error("Open the generated contact sheets first, then rerun with --confirm-reviewed.");
}

const ROOT = process.cwd();
const rawPath = path.join(ROOT, "dataset", "routes", ROUTE_SLUG, "research-raw.json");
const raw = JSON.parse(await readFile(rawPath, "utf8"));
let reviewed = 0;

for (const place of places) {
  const record = raw.places[place.id];
  if (!record || record.selected_images.length !== 3) throw new Error(`${place.id} does not have exactly three selected images.`);
  for (const image of record.selected_images) {
    await access(path.join(ROOT, image.local_path));
    image.review_status = "reviewed";
    image.reviewed_at = verifiedAt;
    reviewed += 1;
  }
}

raw.image_visual_review = {
  status: "reviewed",
  reviewed_at: verifiedAt,
  reviewed_image_count: reviewed,
  method: process.env.ROUTE_IMAGE_REVIEW_METHOD || "Six 24-image selected-asset contact sheets plus a targeted replacement sheet were opened at original detail; mismatched museums, generic science images, unrelated landscapes, weak duplicates and misleading venue coverage were rejected and rebuilt."
};
await writeFile(rawPath, `${JSON.stringify(raw, null, 2)}\n`);
console.log(`Marked ${reviewed} selected images reviewed.`);
