#!/usr/bin/env node

// PHASE 2 of image gathering: promote the candidates you picked into the route package.
//
//   node scripts/promote-place-images.mjs <route-slug> [placeId...]
//
// Reads scripts/route-NN-energy/image-selection.mjs, which exports the three candidate indices you
// chose off each contact sheet plus a written description of what each frame actually shows:
//
//   export const selection = {
//     "place-id": [
//       [3, "What the third candidate actually shows"],
//       [7, "What the seventh shows", "exact-place-or-experience-context"],
//       [1, "What the first shows"]
//     ],
//     ...
//   };
//
// The optional third element is `coverage`. Use the default only when the frame really is the
// attraction. Use "exact-place-or-experience-context" when it is the setting, the venue's town or a
// neighbouring feature, and "species-reference-not-this-site" for an animal reference photo taken
// somewhere else. Saying so in data is what keeps the package honest.
//
// Copies the chosen files into assets/routes/<slug>/, writes selected_images into research-raw.json
// with the right rights metadata per source, and deletes superseded files for those places.

import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { commonsRecord, ddgRecord, dedupe, safeName } from "./lib/image-harvest.mjs";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const routeSlug = args[0];
if (!routeSlug) {
  console.error("Usage: node scripts/promote-place-images.mjs <route-slug> [placeId...]");
  process.exit(1);
}
const requested = new Set(args.slice(1));
const routeNumber = routeSlug.match(/^route-(\d+)/)?.[1];
const HARVEST = path.join(ROOT, "tmp", `${routeSlug}-image-harvest`);
const ASSET_DIR = path.join(ROOT, "assets", "routes", routeSlug);
const RAW_PATH = path.join(ROOT, "dataset", "routes", routeSlug, "research-raw.json");

async function main() {
  const { selection } = await import(path.join(ROOT, "scripts", `route-${routeNumber}-energy`, "image-selection.mjs"));
  const manifest = JSON.parse(await readFile(path.join(HARVEST, "candidates.json"), "utf8"));
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  await mkdir(ASSET_DIR, { recursive: true });

  for (const [placeId, picks] of Object.entries(selection)) {
    if (requested.size && !requested.has(placeId)) continue;
    const entry = manifest[placeId];
    if (!entry) { console.warn(`${placeId}: no harvest entry; run harvest-place-images first.`); continue; }

    const records = [];
    for (const [order, pick] of picks.entries()) {
      const [index, description, coverage] = pick;
      const candidate = entry.candidates.find((c) => c.index === index);
      if (!candidate) { console.warn(`${placeId}: candidate #${index} not found`); continue; }
      const stem = entry.source === "commons"
        ? `${placeId}-commons-${order + 1}-${safeName(candidate.title.replace(/\.[a-z]+$/i, ""))}`
        : `${placeId}-web-${order + 1}-${safeName(candidate.publisher || "source")}`;
      const destination = path.join(ASSET_DIR, `${stem}.jpg`);
      await copyFile(path.join(ROOT, candidate.local_path), destination);
      const localPath = path.relative(ROOT, destination);
      records.push(entry.source === "commons"
        ? commonsRecord({ file: candidate, placeId, description, coverage, localPath })
        : ddgRecord({ candidate, placeId, index: order, description, coverage, localPath }));
    }

    const deduped = dedupe(records);
    if (deduped.length < 3) { console.warn(`!! ${placeId}: only ${deduped.length}/3 promoted`); continue; }

    // Remove files this place previously used so the package never references superseded assets.
    const keep = new Set(deduped.map((r) => path.basename(r.local_path)));
    for (const file of await readdir(ASSET_DIR)) {
      if (file.startsWith(`${placeId}-`) && !keep.has(file)) await rm(path.join(ASSET_DIR, file), { force: true });
    }

    raw.places[placeId] = { ...(raw.places[placeId] || { query: placeId, geocode_candidates: [], selected_coordinate: null, image_candidates: [] }), selected_images: deduped.slice(0, 3) };
    console.log(`${placeId.padEnd(32)} ${entry.source.padEnd(8)} ${deduped.length} promoted`);
  }

  await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  console.log("\nresearch-raw.json updated. Now run the route build, then validate.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
