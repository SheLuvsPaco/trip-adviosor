#!/usr/bin/env node

// Downloads carousel imagery for the Route 08 Energy Rebuild V2 additions and records rights
// metadata per source. See image-sources.mjs for the curated selections.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "../route-08/config.mjs";
import { commonsExtraTitles, commonsQueries, commonsQueriesExtra, commonsSources, operatorSources } from "./image-sources.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "TripAdvisorRouteDataset/2.0 (route-08 energy rebuild)";
const BROWSER = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
const requested = new Set(process.argv.slice(2));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const strip = (value) => (value || "").replace(/<[^>]+>/g, "").trim();
const safeName = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

async function commonsCall(params, attempt = 0) {
  const url = new URL(API);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const response = await fetch(url, { headers: { "User-Agent": UA } });
  const text = await response.text();
  try { return JSON.parse(text); } catch {
    if (attempt < 4) { await sleep(4000 * (attempt + 1)); return commonsCall(params, attempt + 1); }
    throw new Error(`Commons API not returning JSON: ${text.slice(0, 60)}`);
  }
}

function toFile(page) {
  const info = page.imageinfo?.[0];
  if (!info) return null;
  const extra = info.extmetadata || {};
  return {
    title: page.title.replace("File:", ""),
    url: info.thumburl || info.url,
    original_file_url: info.url,
    mime: info.thumbmime || info.mime || "image/jpeg",
    source_page: info.descriptionurl,
    creator: strip(extra.Artist?.value) || "Wikimedia Commons contributor",
    license: strip(extra.LicenseShortName?.value) || "See the Commons file page",
    license_url: extra.LicenseUrl?.value || info.descriptionurl
  };
}

async function download(url, destination, referer, attempt = 0) {
  const response = await fetch(url, {
    headers: { "User-Agent": referer ? BROWSER : UA, ...(referer ? { referer } : {}) },
    redirect: "follow",
    signal: AbortSignal.timeout(40000)
  });
  // Wikimedia throttles bursts of full-size fetches; back off rather than dropping the file.
  if (response.status === 429 && attempt < 3) {
    await sleep(6000 * (attempt + 1));
    return download(url, destination, referer, attempt + 1);
  }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`too small (${bytes.length}b)`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

function commonsRecord(file, description, coverage, placeId, index, kind) {
  return {
    title: file.title,
    mime: file.mime, width: null, height: null, thumbnail_url: file.url, original_url: file.url,
    source_page: file.source_page, description, creator: file.creator, credit: file.creator,
    license: file.license, license_url: file.license_url,
    attribution_required: true, search_query: `curated Wikimedia Commons file (${kind})`,
    local_path: null, review_status: "reviewed", coverage,
    production_usable: true, rights_status: "commons-license-recorded"
  };
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  const placeIds = new Set([...Object.keys(commonsSources), ...Object.keys(commonsQueries), ...Object.keys(commonsQueriesExtra), ...Object.keys(commonsExtraTitles), ...Object.keys(operatorSources)].filter((id) => !id.startsWith("_")));

  for (const placeId of placeIds) {
    if (requested.size && !requested.has(placeId)) continue;
    const record = raw.places[placeId] || { query: placeId, geocode_candidates: [], selected_coordinate: null, image_candidates: [], selected_images: [] };
    const selected = [];

    for (const [index, [url, sourcePage, publisher, description, coverage]] of (operatorSources[placeId] || []).entries()) {
      const destination = path.join(IMAGE_DIR, `${placeId}-operator-${index + 1}-${safeName(publisher)}.${url.includes(".png") ? "png" : "jpg"}`);
      try {
        const mime = await download(url, destination, new URL(url).origin);
        selected.push({
          title: `${placeId} operator image ${index + 1}`,
          mime, width: null, height: null, thumbnail_url: url, original_url: url,
          source_page: sourcePage, description, creator: publisher, credit: publisher,
          license: "Operator publicity image; reuse permission required", license_url: sourcePage,
          attribution_required: true, search_query: "curated exact-place operator image",
          local_path: path.relative(ROOT, destination), review_status: "reviewed",
          coverage: coverage || "exact-place-or-experience",
          production_usable: false, rights_status: "permission-required-before-public-deployment"
        });
        console.log(`${placeId}: operator ${publisher}`);
      } catch (error) { console.warn(`${placeId}: FAILED operator ${publisher}: ${error.message}`); }
      await sleep(400);
    }

    const exact = [...(commonsSources[placeId] || []), ...(commonsExtraTitles[placeId] || [])];
    if (exact.length) {
      const payload = await commonsCall({ action: "query", format: "json", titles: exact.map(([t]) => t).join("|"), prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "800" });
      const byTitle = new Map(Object.values(payload.query?.pages || {}).map((p) => [p.title, toFile(p)]).filter(([, f]) => f));
      for (const [index, [title, description, coverage]] of exact.entries()) {
        const file = byTitle.get(title);
        if (!file) { console.warn(`${placeId}: Commons title not found: ${title}`); continue; }
        const destination = path.join(IMAGE_DIR, `${placeId}-commons-${index + 1}-${safeName(file.title.replace(/\.[a-z]+$/i, ""))}.jpg`);
        try {
          try { await download(file.url, destination); }
          catch (thumbError) {
            if (!/429/.test(thumbError.message) || !file.original_file_url) throw thumbError;
            console.log(`${placeId}: thumbnail throttled, using the original file for ${file.title}`);
            await download(file.original_file_url, destination);
          }
          const rec = commonsRecord(file, description, coverage, placeId, index, "exact title");
          rec.local_path = path.relative(ROOT, destination);
          selected.push(rec);
          console.log(`${placeId}: commons ${file.title} (${file.license})`);
        } catch (error) { console.warn(`${placeId}: FAILED commons ${title}: ${error.message}`); }
        await sleep(3200);
      }
    }

    const q = commonsQueries[placeId] || commonsQueriesExtra[placeId];
    if (q) {
      const payload = await commonsCall({ action: "query", format: "json", generator: "search", gsrsearch: `filetype:bitmap ${q.query}`, gsrnamespace: "6", gsrlimit: "14", prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "800" });
      const files = Object.values(payload.query?.pages || {}).map(toFile).filter(Boolean)
        .filter((f) => (!q.require || q.require.test(f.title)) && (!q.exclude || !q.exclude.test(f.title)));
      let index = 0;
      for (const file of files) {
        if (selected.length >= 3) break;
        const destination = path.join(IMAGE_DIR, `${placeId}-commons-${index + 1}-${safeName(file.title.replace(/\.[a-z]+$/i, ""))}.jpg`);
        try {
          await download(file.url, destination);
          const rec = commonsRecord(file, q.description, q.coverage, placeId, index, "search");
          rec.local_path = path.relative(ROOT, destination);
          selected.push(rec);
          index += 1;
          console.log(`${placeId}: commons(search) ${file.title} (${file.license})`);
        } catch (error) { console.warn(`${placeId}: FAILED ${file.title}: ${error.message}`); }
        await sleep(3200);
      }
    }

    const seen = new Set();
    const deduped = selected.filter((image) => {
      const key = (image.title || image.original_url || "").toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (deduped.length >= 3) record.selected_images = deduped.slice(0, 3);
    else console.warn(`!! ${placeId}: only ${deduped.length}/3 images`);
    raw.places[placeId] = record;
    await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
