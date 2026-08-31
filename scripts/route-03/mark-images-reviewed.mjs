#!/usr/bin/env node

import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { places, ROUTE_SLUG } from "./config.mjs";

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
    image.reviewed_at = "2026-08-23";
    reviewed += 1;
  }
}

raw.image_visual_review = {
  status: "reviewed",
  reviewed_at: "2026-08-23",
  reviewed_image_count: reviewed,
  method: "Five chronological 30-image contact sheets plus a targeted replacement sheet were opened at original detail; misleading and weak search results were rejected and rebuilt."
};
await writeFile(rawPath, `${JSON.stringify(raw, null, 2)}\n`);
console.log(`Marked ${reviewed} selected images reviewed.`);
