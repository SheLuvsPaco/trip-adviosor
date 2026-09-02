#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { newPlaces } from "./config.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputRoot = path.join(process.cwd(), "tmp", "route-01-energy-images");
const requested = new Set(process.argv.slice(2));
const chosen = requested.size ? newPlaces.filter((place) => requested.has(place.id)) : newPlaces;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decode = (value = "") => value
  .replaceAll("&quot;", '"')
  .replaceAll("&amp;", "&")
  .replaceAll("&#39;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">");

async function searchImages(query) {
  const searchUrl = new URL("https://duckduckgo.com/");
  searchUrl.searchParams.set("q", query);
  const html = await fetch(searchUrl, { headers: { "user-agent": "Mozilla/5.0" } }).then((response) => response.text());
  const token = html.match(/vqd=['\"]([^'\"]+)/)?.[1];
  if (!token) throw new Error(`No image-search token for ${query}`);
  const imageUrl = new URL("https://duckduckgo.com/i.js");
  imageUrl.searchParams.set("q", query);
  imageUrl.searchParams.set("vqd", token);
  imageUrl.searchParams.set("o", "json");
  const response = await fetch(imageUrl, { headers: { "user-agent": "Mozilla/5.0", referer: "https://duckduckgo.com/" } });
  if (!response.ok) throw new Error(`Image search HTTP ${response.status}`);
  return (await response.json()).results || [];
}

async function collect(place) {
  const outputDir = path.join(outputRoot, place.id);
  await mkdir(outputDir, { recursive: true });
  const results = await searchImages(place.image_query);
  const records = [];
  for (const result of results.slice(0, 40)) {
    if (records.length >= 12) break;
    try {
      const response = await fetch(decode(result.image), {
        redirect: "follow",
        headers: { "user-agent": "Mozilla/5.0", referer: decode(result.url || "https://duckduckgo.com/") },
        signal: AbortSignal.timeout(15000)
      });
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.startsWith("image/")) continue;
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength < 40000) continue;
      const extension = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
      const localPath = path.join(outputDir, `raw-${String(records.length + 1).padStart(2, "0")}.${extension}`);
      await writeFile(localPath, bytes);
      records.push({
        candidate_id: place.id,
        title: decode(result.title || `${place.name} photograph`),
        source_page: decode(result.url || ""),
        direct_url: decode(result.image || ""),
        creator_credit: "Source-site photographer not stated in image-search result",
        license_rights_status: "permission-required-before-public-deployment",
        production_usable: false,
        local_path: path.relative(outputRoot, localPath),
        alt_text: `${place.name} — ${decode(result.title || "visitor view")}`
      });
    } catch {
      // Broken, protected, tiny, or non-image results are skipped.
    }
  }
  await writeFile(path.join(outputDir, "raw-metadata.json"), `${JSON.stringify(records, null, 2)}\n`);
  return { id: place.id, downloaded: records.length };
}

await mkdir(outputRoot, { recursive: true });
const summary = [];
for (const place of chosen) {
  try {
    summary.push(await collect(place));
  } catch (error) {
    summary.push({ id: place.id, error: error.message });
  }
  await sleep(850);
}
await writeFile(path.join(outputRoot, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
