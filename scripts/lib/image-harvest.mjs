// Shared image harvesting for route packages.
//
// Two sources, one interface:
//
//   ddg      - DuckDuckGo image search. Fast, no per-file throttling, and it finds imagery for
//              commercial venues (escape rooms, operators, attractions) that Wikimedia does not
//              cover. Rights are unknown, so everything it returns is recorded as
//              production_usable:false / permission-required-before-public-deployment.
//
//   commons  - Wikimedia Commons. Slower and rate-limited, but returns a real licence, creator and
//              file page, so results ship production_usable:true. Prefer this for landmarks,
//              parks, geology and anything with genuine Commons coverage.
//
// Wikimedia throttles on-the-fly thumbnail rendering hard. Request a standard cached width and fall
// back to the original file on a 429 rather than giving up on the file.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
const COMMONS_UA = "TripAdvisorRouteDataset/2.0 (route image harvest)";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const safeName = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const strip = (value) => (value || "").replace(/<[^>]+>/g, "").trim();
const decode = (value = "") => value
  .replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&#39;", "'")
  .replaceAll("&lt;", "<").replaceAll("&gt;", ">");

// Junk that shows up in every image-search result set.
const JUNK = /logo|icon|favicon|sprite|badge|placeholder|blank|spacer|avatar|watermark|thumbnail-default/i;

// Stock agencies serve visibly watermarked comps. They are useless for a carousel and worse than
// having no image, so drop them at the source rather than discovering them on the contact sheet.
const STOCK_HOSTS = /alamy|gettyimages|shutterstock|istockphoto|dreamstime|123rf|depositphotos|agefotostock|superstock|mediastorehouse|fineartamerica|picfair|canstock|bigstock|pond5|vectorstock|vecteezy|freepik|dissolve|stocksy|offset|stockphoto|imago-images|zumapress|newscom/i;

// Pinterest and similar re-hosts strip provenance, so attribution cannot be recorded honestly.
const NO_PROVENANCE_HOSTS = /pinimg|pinterest|fbcdn|lookaside|tiktokcdn|redd\.it|imgur/i;

export function isUsableCandidate(imageUrl, sourcePage = "") {
  const haystack = `${imageUrl} ${sourcePage}`;
  return !JUNK.test(imageUrl) && !STOCK_HOSTS.test(haystack) && !NO_PROVENANCE_HOSTS.test(haystack);
}

function hostOf(imageUrl, fallback) {
  try { return new URL(imageUrl).hostname.replace(/^www\./, ""); } catch { return fallback || "Source site"; }
}

/* ------------------------------------------------------------------ DuckDuckGo */

let cachedToken = null;
async function ddgToken(query) {
  const url = new URL("https://duckduckgo.com/");
  url.searchParams.set("q", query);
  const html = await fetch(url, { headers: { "user-agent": BROWSER_UA } }).then((r) => r.text());
  const token = html.match(/vqd=['"]?([-0-9a-zA-Z]+)['"&]/)?.[1];
  if (!token) throw new Error(`no vqd token for "${query}"`);
  return token;
}

export async function searchDdg(query, { limit = 40 } = {}) {
  cachedToken = await ddgToken(query);
  const url = new URL("https://duckduckgo.com/i.js");
  url.searchParams.set("q", query);
  url.searchParams.set("vqd", cachedToken);
  url.searchParams.set("o", "json");
  url.searchParams.set("f", ",,,,,");
  const response = await fetch(url, { headers: { "user-agent": BROWSER_UA, referer: "https://duckduckgo.com/", accept: "application/json" } });
  if (!response.ok) throw new Error(`DuckDuckGo HTTP ${response.status}`);
  const results = (await response.json()).results || [];
  return results.slice(0, limit).map((r) => ({
    source: "ddg",
    title: decode(r.title || query),
    url: decode(r.image),
    source_page: decode(r.url || ""),
    // r.source is the backing engine ("Bing"), not the publisher. Credit the host that serves it.
    publisher: hostOf(decode(r.url), decode(r.source || "")),
    width: r.width || null,
    height: r.height || null
  })).filter((r) => r.url && isUsableCandidate(r.url, r.source_page));
}

/* ------------------------------------------------------------------ Commons */

async function commonsCall(params, attempt = 0) {
  const url = new URL(COMMONS_API);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const response = await fetch(url, { headers: { "User-Agent": COMMONS_UA } });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    if (attempt < 4) { await sleep(4000 * (attempt + 1)); return commonsCall(params, attempt + 1); }
    throw new Error(`Commons API did not return JSON: ${text.slice(0, 60)}`);
  }
}

function commonsFile(page) {
  const info = page.imageinfo?.[0];
  if (!info) return null;
  const extra = info.extmetadata || {};
  return {
    source: "commons",
    title: page.title.replace("File:", ""),
    // 800 is a standard cached width; unusual widths force on-the-fly rendering and get throttled.
    url: info.thumburl || info.url,
    original_url: info.url,
    mime: info.thumbmime || info.mime || "image/jpeg",
    source_page: info.descriptionurl,
    publisher: strip(extra.Artist?.value) || "Wikimedia Commons contributor",
    license: strip(extra.LicenseShortName?.value) || "See the Commons file page",
    license_url: extra.LicenseUrl?.value || info.descriptionurl
  };
}

export async function searchCommons(query, { limit = 12 } = {}) {
  const payload = await commonsCall({
    action: "query", format: "json", generator: "search",
    gsrsearch: `filetype:bitmap ${query}`, gsrnamespace: "6", gsrlimit: String(limit),
    prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "800"
  });
  return Object.values(payload.query?.pages || {}).map(commonsFile).filter(Boolean);
}

export async function commonsByTitle(titles) {
  if (!titles.length) return new Map();
  const payload = await commonsCall({
    action: "query", format: "json", titles: titles.join("|"),
    prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "800"
  });
  const map = new Map();
  for (const page of Object.values(payload.query?.pages || {})) {
    const file = commonsFile(page);
    if (file) map.set(page.title, file);
  }
  return map;
}

/* ------------------------------------------------------------------ download */

export async function download(url, destination, { referer, minBytes = 5000, attempt = 0 } = {}) {
  const response = await fetch(url, {
    headers: { "user-agent": referer ? BROWSER_UA : COMMONS_UA, ...(referer ? { referer } : {}) },
    redirect: "follow",
    signal: AbortSignal.timeout(30000)
  });
  if (response.status === 429 && attempt < 3) {
    await sleep(6000 * (attempt + 1));
    return download(url, destination, { referer, minBytes, attempt: attempt + 1 });
  }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`not an image (${type || "unknown"})`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength < minBytes) throw new Error(`too small (${bytes.byteLength}b)`);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  return { mime: type, bytes: bytes.byteLength };
}

// Commons throttles thumbnail rendering but serves originals as static files.
export async function downloadCommons(file, destination) {
  try {
    return await download(file.url, destination);
  } catch (error) {
    if (!/429/.test(error.message) || !file.original_url || file.original_url === file.url) throw error;
    return download(file.original_url, destination);
  }
}

/* ------------------------------------------------------------------ records */

export function ddgRecord({ candidate, placeId, index, description, coverage = "exact-place-or-experience", localPath }) {
  return {
    title: candidate.title || `${placeId} image ${index + 1}`,
    mime: "image/jpeg", width: candidate.width, height: candidate.height,
    thumbnail_url: candidate.url, original_url: candidate.url,
    source_page: candidate.source_page,
    description,
    creator: candidate.publisher || "Source-site photographer not stated in the search result",
    credit: candidate.publisher || "Source site",
    license: "Third-party web image; reuse permission required",
    license_url: candidate.source_page,
    attribution_required: true,
    search_query: "duckduckgo image search, visually reviewed",
    local_path: localPath,
    review_status: "reviewed",
    coverage,
    production_usable: false,
    rights_status: "permission-required-before-public-deployment"
  };
}

export function commonsRecord({ file, placeId, description, coverage = "exact-place-or-experience", localPath }) {
  return {
    title: file.title,
    mime: file.mime, width: null, height: null,
    thumbnail_url: file.url, original_url: file.url,
    source_page: file.source_page,
    description,
    creator: file.publisher,
    credit: file.publisher,
    license: file.license,
    license_url: file.license_url,
    attribution_required: true,
    search_query: "curated Wikimedia Commons file, visually reviewed",
    local_path: localPath,
    review_status: "reviewed",
    coverage,
    production_usable: true,
    rights_status: "commons-license-recorded"
  };
}

export function dedupe(records) {
  const seen = new Set();
  return records.filter((record) => {
    const key = (record.original_url || record.local_path || record.title || "").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
