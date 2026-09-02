#!/usr/bin/env node

// PHASE 1 of image gathering: pull candidates and build contact sheets for visual review.
//
//   node scripts/harvest-place-images.mjs <route-slug> [--source=ddg|commons|both] [--per=12] [placeId...]
//
// Reads the place list and queries from scripts/<route-dir>-energy/image-queries.mjs, which exports:
//
//   export const queries = {
//     "place-id": { query: "what to search for", source: "ddg" | "commons", note: "optional" },
//     ...
//   };
//
// Writes candidates to tmp/<route-slug>-image-harvest/<place-id>/NN.jpg plus a candidates.json
// manifest, and a contact sheet per place at tmp/<route-slug>-image-harvest/sheets/<place-id>.jpg.
//
// ALWAYS look at the contact sheets before promoting. Image search returns plenty of results that
// are technically valid and visually useless or plain wrong subject.

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { download, downloadCommons, safeName, searchCommons, searchDdg, sleep } from "./lib/image-harvest.mjs";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const routeSlug = args.find((a) => !a.startsWith("--"));
if (!routeSlug) {
  console.error("Usage: node scripts/harvest-place-images.mjs <route-slug> [--source=ddg|commons|both] [--per=12] [placeId...]");
  process.exit(1);
}
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : fallback;
};
const sourceMode = flag("source", "both");
const perPlace = Number(flag("per", 12));
const requested = new Set(args.filter((a) => !a.startsWith("--") && a !== routeSlug));

const routeNumber = routeSlug.match(/^route-(\d+)/)?.[1];
const OUT_ROOT = path.join(ROOT, "tmp", `${routeSlug}-image-harvest`);

// Number every tile so the reviewer can name candidates by index in image-selection.mjs.
const LABEL_FONT = "/System/Library/Fonts/Supplemental/Arial.ttf";

function montage(files, destination) {
  return new Promise((resolve) => {
    const child = spawn("magick", ["montage", ...files, "-tile", "4x", "-geometry", "300x225+4+4",
      "-background", "#222", "-fill", "#FFD400", "-font", LABEL_FONT, "-pointsize", "34",
      "-label", "%[fx:t+1]", destination], { stdio: "ignore" });
    child.on("close", () => resolve());
    child.on("error", () => resolve());
  });
}

async function main() {
  const queryModule = await import(path.join(ROOT, "scripts", `route-${routeNumber}-energy`, "image-queries.mjs"));
  const queries = queryModule.queries;
  await mkdir(path.join(OUT_ROOT, "sheets"), { recursive: true });
  // Merge into any existing manifest so re-harvesting a few places does not drop the rest.
  const manifestPath = path.join(OUT_ROOT, "candidates.json");
  const manifest = await readFile(manifestPath, "utf8").then(JSON.parse).catch(() => ({}));

  for (const [placeId, spec] of Object.entries(queries)) {
    if (requested.size && !requested.has(placeId)) continue;
    const wanted = spec.source || (sourceMode === "both" ? "ddg" : sourceMode);
    if (sourceMode !== "both" && wanted !== sourceMode) continue;
    const dir = path.join(OUT_ROOT, placeId);
    await mkdir(dir, { recursive: true });

    let candidates = [];
    try {
      candidates = wanted === "commons"
        ? await searchCommons(spec.query, { limit: perPlace })
        : await searchDdg(spec.query, { limit: perPlace * 3 });
    } catch (error) {
      console.warn(`${placeId}: search failed (${error.message})`);
      continue;
    }

    const kept = [];
    for (const candidate of candidates) {
      if (kept.length >= perPlace) break;
      const index = kept.length + 1;
      const destination = path.join(dir, `${String(index).padStart(2, "0")}.jpg`);
      try {
        if (wanted === "commons") await downloadCommons(candidate, destination);
        else await download(candidate.url, destination, { referer: candidate.source_page ? new URL(candidate.source_page).origin : undefined, minBytes: 40000 });
        kept.push({ ...candidate, index, local_path: path.relative(ROOT, destination) });
      } catch {
        // Broken, hotlink-protected, tiny or non-image results are skipped silently.
      }
      if (wanted === "commons") await sleep(1200);
    }

    manifest[placeId] = { query: spec.query, source: wanted, note: spec.note || null, candidates: kept };
    const files = (await readdir(dir)).filter((f) => f.endsWith(".jpg")).sort().map((f) => path.join(dir, f));
    if (files.length) await montage(files, path.join(OUT_ROOT, "sheets", `${placeId}.jpg`));
    console.log(`${placeId.padEnd(32)} ${wanted.padEnd(8)} ${kept.length}/${perPlace} candidates`);
    if (wanted === "ddg") await sleep(900);
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nCandidates: ${path.relative(ROOT, OUT_ROOT)}/candidates.json`);
  console.log(`Contact sheets: ${path.relative(ROOT, OUT_ROOT)}/sheets/ — review these before promoting.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
