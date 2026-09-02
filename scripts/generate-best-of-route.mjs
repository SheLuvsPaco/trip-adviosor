import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessAtlasGrading, generateBestOfRoute } from '../src/best-of-route.js';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultOutputPath = resolve(projectRoot, 'tmp/best-of-route.generated.json');

function parseEnv(source) {
  const values = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line;
    const separator = normalized.indexOf('=');
    if (separator < 1) continue;
    const key = normalized.slice(0, separator).trim();
    let value = normalized.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

async function loadConfiguration() {
  let local = {};
  try {
    local = parseEnv(await readFile(resolve(projectRoot, '.env.local'), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const url = process.env.VITE_SUPABASE_URL || local.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || local.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes('YOUR_PROJECT_REF') || key.includes('REPLACE_ME')) {
    return null;
  }
  return { url, key };
}

async function loadRoutes() {
  const manifest = JSON.parse(await readFile(resolve(projectRoot, 'dataset/manifest.json'), 'utf8'));
  return Promise.all(manifest.routes.map(async (entry) => {
    const [route, places, geometry] = await Promise.all([
      readFile(resolve(projectRoot, 'dataset', entry.entry_path), 'utf8').then(JSON.parse),
      readFile(resolve(projectRoot, 'dataset', entry.places_path), 'utf8').then(JSON.parse),
      readFile(resolve(projectRoot, 'dataset', dirname(entry.entry_path), 'route-geometry.json'), 'utf8').then(JSON.parse),
    ]);
    return {
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      color: entry.map_color,
      miles: entry.baseline_miles,
      route,
      places,
      geometry,
    };
  }));
}

async function loadRatings({ url, key }) {
  const rows = [];
  const pageSize = 1000;

  for (let offset = 0; ; offset += pageSize) {
    const endpoint = new URL('/rest/v1/route_ratings', url);
    endpoint.searchParams.set('select', 'route_id,place_id,traveler_id,score,updated_at');
    endpoint.searchParams.set('order', 'route_id.asc,place_id.asc,traveler_id.asc');
    endpoint.searchParams.set('limit', String(pageSize));
    endpoint.searchParams.set('offset', String(offset));
    const response = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Could not read route_ratings (${response.status}): ${detail}`);
    }
    const page = await response.json();
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  return rows;
}

function requestedOutputPath() {
  const flagIndex = process.argv.indexOf('--output');
  if (flagIndex === -1) return defaultOutputPath;
  if (!process.argv[flagIndex + 1]) throw new Error('--output requires a file path.');
  return resolve(projectRoot, process.argv[flagIndex + 1]);
}

async function main() {
  const [configuration, routes] = await Promise.all([loadConfiguration(), loadRoutes()]);
  const ratingRows = configuration ? await loadRatings(configuration) : [];
  const assessment = assessAtlasGrading(routes, ratingRows);

  if (!configuration) console.warn('Supabase is not configured; generating from curated fit scores only.');
  console.log(`Grading coverage: ${assessment.completed_ratings}/${assessment.required_ratings} (${assessment.completion_percent}%). Missing scores use the route packages' curated traveler-fit data.`);
  console.log(`${assessment.complete ? 'Winner' : 'Provisional winner'}: ${assessment.winner.name} (${assessment.winner.group_average.toFixed(2)}/5 effective score).`);
  console.log('Building a road-valid best-of route with OSRM baselines and the protected traffic buffer…');
  const generated = await generateBestOfRoute({ routes, ratingRows });
  const outputPath = requestedOutputPath();
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(generated, null, 2)}\n`, 'utf8');

  console.log(`Selected ${generated.selection.selected_unique_spot_count} of ${generated.selection.candidate_pool_count} highest-ranked candidates.`);
  console.log(`Wrote ${outputPath}.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
