#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "dataset", "routes", "route-01-gilded-coast-capital-loop", "weather-normals.json");

const requests = [
  { day: 1, date: "2026-10-04", sleep_city: "Newport, RI", station: "USW00014765", station_role: "Providence proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "New Haven, CT", station: "USW00094702", station_role: "Bridgeport proxy" },
  { day: 3, date: "2026-10-06", sleep_city: "New York, NY", station: "USW00094728", station_role: "Central Park" },
  { day: 4, date: "2026-10-07", sleep_city: "New York, NY", station: "USW00094728", station_role: "Central Park" },
  { day: 5, date: "2026-10-08", sleep_city: "Philadelphia, PA", station: "USW00013739", station_role: "Philadelphia International" },
  { day: 6, date: "2026-10-09", sleep_city: "Philadelphia, PA", station: "USW00013739", station_role: "Philadelphia International" },
  { day: 7, date: "2026-10-10", sleep_city: "Washington, DC", station: "USW00013743", station_role: "Reagan National" },
  { day: 8, date: "2026-10-11", sleep_city: "Gettysburg, PA", station: "USW00093738", station_role: "DC-Frederick-Gettysburg corridor proxy" },
  { day: 9, date: "2026-10-12", sleep_city: "Easton, PA", station: "USW00014737", station_role: "Allentown-Bethlehem-Easton corridor" },
  { day: 10, date: "2026-10-13", sleep_city: "Southbury, CT", station: "USW00094702", station_role: "Southbury regional proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan" }
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift();
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]])));
}

function fahrenheitToCelsius(value) {
  return Math.round((((Number(value) - 32) * 5) / 9) * 10) / 10;
}

async function fetchStation(station) {
  const url = `https://www.ncei.noaa.gov/data/normals-daily/1991-2020/access/${station}.csv`;
  const response = await fetch(url, { headers: { "User-Agent": "TripAdvisorRouteDataset/1.0" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return { url, rows: parseCsv(await response.text()) };
}

async function main() {
  const stationCache = new Map();
  const output = {
    methodology: "NOAA/NCEI U.S. Climate Normals 1991-2020 daily normals; values are planning baselines, not forecasts.",
    dataset_url: "https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals",
    generated_at: new Date().toISOString(),
    days: []
  };

  for (const request of requests) {
    if (!stationCache.has(request.station)) stationCache.set(request.station, await fetchStation(request.station));
    const stationData = stationCache.get(request.station);
    const monthDay = request.date.slice(5);
    const record = stationData.rows.find((row) => row.DATE === monthDay);
    if (!record) throw new Error(`No ${monthDay} normal found for ${request.station}`);
    output.days.push({
      day: request.day,
      date: request.date,
      sleep_city: request.sleep_city,
      station_id: request.station,
      station_name: record.NAME.trim(),
      station_role: request.station_role,
      station_coordinates: [Number(record.LONGITUDE), Number(record.LATITUDE)],
      normal_high_c: fahrenheitToCelsius(record["DLY-TMAX-NORMAL"].trim()),
      normal_low_c: fahrenheitToCelsius(record["DLY-TMIN-NORMAL"].trim()),
      measurable_precipitation_probability_percent: Number(record["DLY-PRCP-PCTALL-GE001HI"].trim()),
      source_url: stationData.url
    });
  }

  await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Weather normals written to ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
