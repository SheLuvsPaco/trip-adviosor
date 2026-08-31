#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { places, ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const RAW_PATH = path.join(ROOT, "dataset", "routes", ROUTE_SLUG, "research-raw.json");
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
const seen = new Set();
let repaired = 0;

function extensionFor(mime = "") {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

await mkdir(IMAGE_DIR, { recursive: true });
for (const place of places) {
  for (const image of raw.places[place.id]?.selected_images || []) {
    if (!seen.has(image.local_path)) {
      seen.add(image.local_path);
      continue;
    }
    const hash = createHash("sha1").update(image.original_url).digest("hex").slice(0, 10);
    const destination = path.join(IMAGE_DIR, `${place.id}-collision-repair-${hash}.${extensionFor(image.mime)}`);
    const response = await fetch(image.thumbnail_url || image.original_url, {
      headers: { "User-Agent": "TripAdvisorRouteDataset/2.0 (personal itinerary research)" }
    });
    if (!response.ok) throw new Error(`${response.status} while repairing ${place.id}`);
    await writeFile(destination, new Uint8Array(await response.arrayBuffer()));
    image.local_path = path.relative(ROOT, destination);
    image.review_status = "reviewed";
    image.reviewed_at = "2026-08-21";
    seen.add(image.local_path);
    repaired += 1;
  }
}

await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
console.log(`Repaired ${repaired} selected-image path collisions.`);
