#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import path from "node:path";
const configUrl = new URL(process.env.ROUTE_COLLECTOR_CONFIG || "./config.mjs", import.meta.url);
const { ROUTE_SLUG, weatherRequests } = await import(configUrl);

const OUTPUT = path.join(process.cwd(), "dataset", "routes", ROUTE_SLUG, "weather-normals.json");

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1; } else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = "";
    } else field += char;
  }
  const headers = rows.shift();
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]])));
}

const toCelsius = (value) => Math.round((((Number(value) - 32) * 5) / 9) * 10) / 10;

async function fetchStation(station) {
  const url = `https://www.ncei.noaa.gov/data/normals-daily/1991-2020/access/${station}.csv`;
  const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/2.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return { url, rows: parseCsv(await response.text()) };
}

async function main() {
  const cache = new Map();
  const output = {
    methodology: "NOAA/NCEI U.S. Climate Normals 1991-2020 daily normals; these are planning baselines, not forecasts.",
    dataset_url: "https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals",
    generated_at: new Date().toISOString(),
    days: []
  };
  for (const request of weatherRequests) {
    if (!cache.has(request.station)) cache.set(request.station, await fetchStation(request.station));
    const station = cache.get(request.station);
    const record = station.rows.find((row) => row.DATE === request.date.slice(5));
    if (!record) throw new Error(`No ${request.date.slice(5)} normal for ${request.station}`);
    output.days.push({
      ...request,
      station_id: request.station,
      station_name: record.NAME.trim(),
      station_coordinates: [Number(record.LONGITUDE), Number(record.LATITUDE)],
      normal_high_c: toCelsius(record["DLY-TMAX-NORMAL"].trim()),
      normal_low_c: toCelsius(record["DLY-TMIN-NORMAL"].trim()),
      measurable_precipitation_probability_percent: Number(record["DLY-PRCP-PCTALL-GE001HI"].trim()),
      source_url: station.url
    });
  }
  await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
