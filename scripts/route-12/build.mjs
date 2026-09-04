#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const ROUTE_ID = 'route-12';
const ROUTE_SLUG = 'atlantic-winners-decision-loop';
const ROUTE_DIRECTORY = `route-12-${ROUTE_SLUG}`;
const ROUTE_DIR = path.join(ROOT, 'dataset', 'routes', ROUTE_DIRECTORY);
const PEOPLE = ['sheluvspaco', 'viki', 'gora', 'stivka'];
const MAP_COLOR = '#D9A441';

const sourceSelections = {
  'route-01-gilded-coast-capital-loop': [
    'level99-providence', 'newport-car-museum', 'it-adventure-ropes', 'woodbury-common',
    'paterson-great-falls', 'central-park-bike-loop', 'high-line-hudson-yards',
    'dumbo-brooklyn-bridge-park', 'st-nicholas-cathedral-dc', 'ministry-of-awe',
    'baps-akshardham', 'old-sturbridge-village', 'boda-borg-boston',
    'st-nicholas-wtc', 'beat-the-bomb-brooklyn', 'hawk-mountain-north-lookout',
    'cunningham-falls', 'lincoln-memorial', 'elfreths-alley', 'eastern-state',
  ],
  'route-03-wild-shore-rockets-folklore-loop': ['pez-visitor-center', 'barker-cartoon-museum', 'baltimore-industry'],
  'route-05-coal-veins-caverns-blue-ridge-secrets-loop': ['pa-capitol', 'harrisburg-riverfront'],
  'route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop': ['reading-pagoda'],
  'route-07-kazoos-rock-mechanical-dreams-loop': ['hershey-candy-bar', 'f1-arcade-boston', 'trinity-boston'],
  'route-08-lemurs-stone-bridges-mechanical-dreams-loop': [
    'crane-manor', 'hotel-greene', 'big-snow-american-dream', 'fish-church-stamford',
    'gnome-raven-magic-lamp', 'kunta-kinte-haley-memorial',
  ],
};

const sourceRouteIds = {
  'route-01-gilded-coast-capital-loop': 'route-01',
  'route-03-wild-shore-rockets-folklore-loop': 'route-03',
  'route-05-coal-veins-caverns-blue-ridge-secrets-loop': 'route-05',
  'route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop': 'route-06',
  'route-07-kazoos-rock-mechanical-dreams-loop': 'route-07',
  'route-08-lemurs-stone-bridges-mechanical-dreams-loop': 'route-08',
};

const corridorOptions = {
  'trinity-boston': {
    days: [1, 11],
    option_type: 'arrival-or-finale-flex',
    status: 'timing-check-required',
    note: 'A 4.00/5 Boston architecture option. Use it only if the arrival handoff runs early on Day 1 or the finale reaches Boston before visitor access ends on Day 11.',
  },
  'boda-borg-boston': {
    days: [1, 11],
    option_type: 'arrival-or-finale-swap',
    status: 'swap-only',
    note: 'A 3.50/5 group-game option near Boston. It needs a two-hour block, so treat it as a replacement for another game stop, not an additive promise.',
  },
  'barker-cartoon-museum': {
    days: [3],
    option_type: 'corridor-flex',
    status: 'hours-check-required',
    note: 'A 3.75/5 Cheshire curiosity close to the New Haven departure. It is a morning flex only if the live opening calendar works before the outlet day.',
  },
  'fish-church-stamford': {
    days: [3, 10],
    option_type: 'short-corridor-flex',
    status: 'access-check-required',
    note: 'A 3.25/5, 45-minute architecture pause near the north-south line. Confirm public church access and use it only while the live drive remains under the cap.',
  },
  'st-nicholas-wtc': {
    days: [4],
    option_type: 'nyc-swap',
    status: 'swap-only',
    note: 'A 4.25/5 sacred-architecture winner in Lower Manhattan. Day 4 is already full, so this replaces a New York stop rather than becoming a fifth fixed commitment.',
  },
  'beat-the-bomb-brooklyn': {
    days: [4],
    option_type: 'nyc-swap',
    status: 'swap-only',
    note: 'A 3.75/5 team-game option in Brooklyn. Use it instead of one scheduled New York block after checking mission inventory and cross-borough timing.',
  },
  'hawk-mountain-north-lookout': {
    days: [5],
    option_type: 'long-form-swap',
    status: 'swap-only-near-cap',
    note: 'A 4.25/5 nature winner near the Pennsylvania crossing, but the 160-minute visit is too large to add casually. It requires an early departure and replaces the reset pace.',
  },
  'reading-pagoda': {
    days: [5],
    option_type: 'corridor-flex',
    status: 'live-route-check-required',
    note: 'A 3.25/5, 40-minute overlook option near the westbound corridor. Add it only if access is open and the live ETA still protects Hershey.',
  },
  'harrisburg-riverfront': {
    days: [6],
    option_type: 'local-flex',
    status: 'daylight-check-required',
    note: 'A 3.00/5 outdoor river-and-bridge pause beside the Harrisburg stop. It is geographically cheap, but optional because Day 6 already runs close to the drive ceiling.',
  },
  'cunningham-falls': {
    days: [6],
    option_type: 'long-form-swap',
    status: 'swap-only-near-cap',
    note: 'A 4.50/5 waterfall winner close to the southbound line. The 135-minute visit must replace Crane Manor or trigger a deliberate day redesign.',
  },
  'lincoln-memorial': {
    days: [6],
    option_type: 'arrival-evening-flex',
    status: 'energy-and-parking-check',
    note: 'A 3.75/5 sunset monument walk after reaching Washington. It adds city movement and walking, not another long intercity detour.',
  },
  'gnome-raven-magic-lamp': {
    days: [7],
    option_type: 'high-signal-incomplete-rating',
    status: 'booking-and-rating-check',
    note: 'Paco rated this Richmond escape experience 5/5; the other three ratings are still blank. It stays visible as a high-signal option but cannot affect the winning score.',
  },
  'kunta-kinte-haley-memorial': {
    days: [8],
    option_type: 'waterfront-flex',
    status: 'daylight-check-required',
    note: 'A 3.25/5, 35-minute Annapolis waterfront pause. It is the lighter Sunday choice if the group wants a break between Richmond and White Marsh.',
  },
  'baltimore-industry': {
    days: [8],
    option_type: 'museum-swap',
    status: 'swap-only',
    note: 'A 2.50/5 industrial museum option near the final approach. It is shown for Gora, who rated it 5/5, but should replace another block rather than stretch the Sunday.',
  },
  'elfreths-alley': {
    days: [9],
    option_type: 'short-city-flex',
    status: 'neighborhood-etiquette-required',
    note: 'A unanimous 4.00/5, 35-minute Philadelphia walk only a few blocks from the city stop. Keep it quiet and treat the residential alley respectfully.',
  },
  'eastern-state': {
    days: [9],
    option_type: 'philadelphia-swap',
    status: 'swap-only',
    note: 'A 3.50/5, 135-minute Philadelphia anchor. The visit is too long to stack onto both scheduled winners, so activate it only as a deliberate swap.',
  },
  'big-snow-american-dream': {
    days: [10],
    option_type: 'northbound-swap',
    status: 'swap-only-near-cap',
    note: 'A 4.00/5 indoor-snow option beside the northbound line. Day 10 already sits near the baseline cap, so this needs a schedule swap and a fresh live route check.',
  },
};

const corridorOptionIds = Object.keys(corridorOptions);

const legacyPlaces = [
  {
    id: 'the-breakers', name: 'The Breakers', kind: 'historic-house', city: 'Newport', state: 'RI',
    address: '44 Ochre Point Avenue, Newport, RI 02840', coordinates: [-71.2982119, 41.4697373],
    summary: 'The Vanderbilt family’s 70-room summer house uses an Italian-palace shell to hide the machinery and labor that made Gilded Age life possible.',
    why_go: 'It combines theatrical rooms, Atlantic grounds, and the less-polished story of the workers and systems behind the spectacle.',
    best_for: ['viki', 'gora'], secondary_for: ['stivka', 'sheluvspaco'],
    best_fit_note: 'Viki gets the rooms and architecture; Gora gets the machinery, labor, and money story behind them.',
    categories: ['architecture_photogenic', 'hidden_history_folklore'], duration_minutes: 90,
    priority: 'anchor', reservation: 'recommended',
    hours: { opens: '09:00', closes: '17:00', status: 'reconfirm-before-booking', note: 'Reserve the first practical admission and recheck restoration access.' },
    cost: { amount_per_person: null, range_per_person: [30, 40], status: 'checkout-required' },
    source_ids: ['src-newport-mansions'],
  },
  {
    id: 'beinecke-library', name: 'Beinecke Rare Book & Manuscript Library', kind: 'library-gallery', city: 'New Haven', state: 'CT',
    address: '121 Wall Street, New Haven, CT 06511', coordinates: [-72.9273243, 41.3115974],
    summary: 'A windowless 1963 library whose thin marble walls glow amber around a six-story glass tower of rare books.',
    why_go: 'This is the compact, high-impact architectural stop the group unanimously rated 5: a stone box outside and a luminous book vault inside.',
    best_for: ['viki', 'gora'], secondary_for: ['stivka', 'sheluvspaco'],
    best_fit_note: 'The room delivers rare books, extraordinary light, and strange architecture without demanding a long detour or visit.',
    categories: ['architecture_photogenic', 'hidden_history_folklore', 'unusual_creative'], duration_minutes: 55,
    priority: 'anchor', reservation: 'none',
    hours: { opens: '09:00', closes: '19:00', status: 'verified', note: 'Monday public exhibition hours; keep the 17:30–18:25 visit.' },
    cost: { amount_per_person: 0, status: 'verified' }, source_ids: ['src-beinecke'],
  },
  {
    id: 'o-street-museum', name: 'O Museum in The Mansion', kind: 'immersive-museum', city: 'Washington', state: 'DC',
    address: '2020 O Street NW, Washington, DC 20036', coordinates: [-77.0452, 38.9085],
    summary: 'Five connected townhouses form a self-guided maze of more than 100 rooms, collections, and dozens of hidden doors.',
    why_go: 'It turns the group into active participants: everyone searches, opens panels, and compares discoveries instead of simply reading labels.',
    best_for: ['viki', 'gora'], secondary_for: ['sheluvspaco', 'stivka'],
    best_fit_note: 'The architecture and secret-door hunt give every traveler something to discover together.',
    categories: ['unusual_creative', 'architecture_photogenic', 'hidden_history_folklore', 'group_bonding'], duration_minutes: 120,
    priority: 'anchor', reservation: 'required',
    hours: { opens: '09:00', closes: '21:00', status: 'verified', note: 'Saturday hours; buy an advance timed experience.' },
    cost: { amount_per_person: null, range_per_person: [35, 65], status: 'experience-dependent' }, source_ids: ['src-o-museum'],
  },
  {
    id: 'princeton-chapel', name: 'Princeton University Chapel', kind: 'church-architecture', city: 'Princeton', state: 'NJ',
    address: 'Princeton University, Princeton, NJ 08544', coordinates: [-74.6569695, 40.3488453],
    summary: 'A monumental 1928 collegiate Gothic chapel of stone arches, stained glass, and an unexpectedly immense interior.',
    why_go: 'It is a short, quiet counterweight to the route’s games and spectacle, placed directly on the northbound line.',
    best_for: ['stivka', 'viki'], secondary_for: ['gora'],
    best_fit_note: 'Stivka gets a reflective sacred stop and Viki gets one of the route’s strongest architectural interiors.',
    categories: ['orthodox_spiritual', 'architecture_photogenic'], duration_minutes: 45,
    priority: 'supporting', reservation: 'none',
    hours: { opens: '07:00', closes: '23:00', status: 'reconfirm-before-visit', note: 'Access may pause for services or university events.' },
    cost: { amount_per_person: 0, status: 'verified' }, source_ids: ['src-princeton-chapel'],
  },
];

const legacySources = {
  'src-newport-mansions': { publisher: 'Preservation Society of Newport County', type: 'official', url: 'https://www.newportmansions.org/plan-a-visit/', supports: ['visitor hours', 'ticketing', 'restoration notices'] },
  'src-beinecke': { publisher: 'Yale University Library', type: 'official', url: 'https://beinecke.library.yale.edu/research-teaching/doing-research-beinecke-library', supports: ['public visitor hours', 'free exhibition access'] },
  'src-o-museum': { publisher: 'O Museum in The Mansion', type: 'official', url: 'https://www.omuseum.org/faqs', supports: ['Saturday hours', 'secret-door experience', 'advance tickets'] },
  'src-princeton-chapel': { publisher: 'Princeton University Chapel', type: 'official', url: 'https://chapel.princeton.edu/', supports: ['visitor access', 'official venue information'] },
};

const nodes = {
  'boston-logan-rental': { name: 'Boston Logan Rental Car Center', coordinates: [-71.0236, 42.367] },
  'level99-providence': { name: 'Level99 Providence', coordinates: [-71.4162056, 41.8275772] },
  'newport-car-museum': { name: 'Newport Car Museum', coordinates: [-71.2799302, 41.5688949] },
  'newport-lodging': { name: 'Newport lodging zone', coordinates: [-71.3113, 41.4901] },
  'the-breakers': { name: 'The Breakers', coordinates: [-71.2982119, 41.4697373] },
  'it-adventure-ropes': { name: 'IT Adventure Ropes Course', coordinates: [-72.9277566, 41.2870369] },
  'beinecke-library': { name: 'Beinecke Library', coordinates: [-72.9273243, 41.3115974] },
  'new-haven-lodging': { name: 'New Haven lodging zone', coordinates: [-72.9279, 41.3083] },
  'woodbury-common': { name: 'Woodbury Common', coordinates: [-74.1258389, 41.3177338] },
  'paterson-great-falls': { name: 'Paterson Great Falls', coordinates: [-74.1805294, 40.9155412] },
  'nyc-garage': { name: 'Downtown Brooklyn garage zone', coordinates: [-73.9903, 40.6928] },
  'parsippany-lodging': { name: 'Parsippany lodging zone', coordinates: [-74.4229, 40.8579] },
  'allentown-break': { name: 'Allentown comfort break', coordinates: [-75.4902, 40.6084] },
  'hershey-lodging': { name: 'Hershey lodging zone', coordinates: [-76.684, 40.298] },
  'hershey-candy-bar': { name: 'Hershey Chocolate World', coordinates: [-76.661019, 40.288076] },
  'pa-capitol': { name: 'Pennsylvania State Capitol', coordinates: [-76.8837, 40.2644] },
  'crane-manor': { name: 'Crane Manor', coordinates: [-77.4083, 39.4114] },
  'dc-lodging': { name: 'Washington lodging zone', coordinates: [-77.0365, 38.9072] },
  'o-street-museum': { name: 'O Museum in The Mansion', coordinates: [-77.0452, 38.9085] },
  'hotel-greene': { name: 'Hotel Greene', coordinates: [-77.438178, 37.541059] },
  'ashland-lodging': { name: 'Ashland lodging zone', coordinates: [-77.4817, 37.759] },
  'st-nicholas-cathedral-dc': { name: 'St. Nicholas Cathedral', coordinates: [-77.0686587, 38.9248859] },
  'white-marsh-lodging': { name: 'White Marsh lodging zone', coordinates: [-76.495, 39.325] },
  'ministry-of-awe': { name: 'Ministry of Awe', coordinates: [-75.1452624, 39.9510622] },
  'baps-akshardham': { name: 'BAPS Swaminarayan Akshardham', coordinates: [-74.5792097, 40.2544674] },
  'robbinsville-lodging': { name: 'Robbinsville lodging zone', coordinates: [-74.651, 40.219] },
  'princeton-chapel': { name: 'Princeton University Chapel', coordinates: [-74.6569695, 40.3488453] },
  'rye-break': { name: 'Rye comfort break', coordinates: [-73.6837, 40.9807] },
  'pez-visitor-center': { name: 'PEZ Visitor Center', coordinates: [-72.9971, 41.2638] },
  'old-sturbridge-village': { name: 'Old Sturbridge Village', coordinates: [-72.1011232, 42.1038149] },
  'f1-arcade-boston': { name: 'F1 Arcade Boston', coordinates: [-71.043539, 42.350956] },
  'boston-logan-hotel': { name: 'Boston Logan hotel zone', coordinates: [-71.0155, 42.3655] },
};

const dayPlans = [
  { sleep: 'Newport, RI', theme: 'Games, machines, and the Atlantic edge', nodes: ['boston-logan-rental', 'level99-providence', 'newport-car-museum', 'newport-lodging'], schedule: [['13:00', '15:00', 'level99-providence', 'anchor'], ['15:50', '16:50', 'newport-car-museum', 'optional']] },
  { sleep: 'New Haven, CT', theme: 'Gilded machinery, aerial play, and glowing books', nodes: ['newport-lodging', 'the-breakers', 'it-adventure-ropes', 'beinecke-library', 'new-haven-lodging'], schedule: [['09:00', '10:30', 'the-breakers', 'anchor'], ['13:15', '15:30', 'it-adventure-ropes', 'anchor'], ['17:30', '18:25', 'beinecke-library', 'anchor']] },
  { sleep: 'Central Valley, NY', theme: 'A full outlet day without a second agenda', nodes: ['new-haven-lodging', 'woodbury-common'], schedule: [['10:00', '13:30', 'woodbury-common', 'anchor']] },
  { sleep: 'Parsippany, NJ', theme: 'Waterfall force and one concentrated New York day', nodes: ['woodbury-common', 'paterson-great-falls', 'nyc-garage', 'parsippany-lodging'], schedule: [['09:30', '10:45', 'paterson-great-falls', 'anchor'], ['12:00', '14:00', 'central-park-bike-loop', 'anchor'], ['14:45', '16:15', 'high-line-hudson-yards', 'supporting'], ['17:30', '19:00', 'dumbo-brooklyn-bridge-park', 'supporting']] },
  { sleep: 'Hershey, PA', theme: 'The reset, with chocolate waiting at the end', nodes: ['parsippany-lodging', 'allentown-break', 'hershey-candy-bar', 'hershey-lodging'], schedule: [['15:00', '16:00', 'hershey-candy-bar', 'anchor']] },
  { sleep: 'Washington, DC', theme: 'A civic palace and an impossible house', nodes: ['hershey-lodging', 'pa-capitol', 'crane-manor', 'dc-lodging'], schedule: [['10:30', '11:45', 'pa-capitol', 'anchor'], ['13:40', '15:10', 'crane-manor', 'anchor']] },
  { sleep: 'Ashland, VA', theme: 'Secret doors and Richmond’s indoor golf fantasy', nodes: ['dc-lodging', 'o-street-museum', 'hotel-greene', 'ashland-lodging'], schedule: [['09:00', '11:00', 'o-street-museum', 'anchor'], ['14:00', '16:30', 'hotel-greene', 'anchor']] },
  { sleep: 'White Marsh, MD', theme: 'An Orthodox Sunday with room to breathe', nodes: ['ashland-lodging', 'st-nicholas-cathedral-dc', 'white-marsh-lodging'], schedule: [['09:00', '10:45', 'st-nicholas-cathedral-dc', 'anchor']] },
  { sleep: 'Robbinsville, NJ', theme: 'Immersion, marble, and monumental craft', nodes: ['white-marsh-lodging', 'ministry-of-awe', 'baps-akshardham', 'robbinsville-lodging'], schedule: [['10:00', '12:00', 'ministry-of-awe', 'anchor'], ['13:15', '15:15', 'baps-akshardham', 'anchor']] },
  { sleep: 'New Haven, CT', theme: 'A Gothic pause on the protected northbound line', nodes: ['robbinsville-lodging', 'princeton-chapel', 'rye-break', 'new-haven-lodging'], schedule: [['09:00', '09:45', 'princeton-chapel', 'supporting']] },
  { sleep: 'Boston, MA', theme: 'Candy mechanisms, living history, and a final race', nodes: ['new-haven-lodging', 'pez-visitor-center', 'old-sturbridge-village', 'f1-arcade-boston', 'boston-logan-hotel'], schedule: [['10:00', '10:45', 'pez-visitor-center', 'anchor'], ['13:00', '15:30', 'old-sturbridge-village', 'anchor'], ['17:30', '18:45', 'f1-arcade-boston', 'anchor']] },
];

const visitDates = Object.fromEntries(dayPlans.flatMap((day, index) => day.schedule.map((item) => [item[2], `2026-10-${String(index + 4).padStart(2, '0')}`])));

function parseRatings(csv) {
  return csv.trim().split(/\r?\n/).slice(1).map((line) => line.split(',')).map(([route_id, place_id, traveler_id, score, updated_at]) => ({ route_id, place_id, traveler_id, score: Number(score), updated_at }));
}

function enrichSleepoverResearch(sleepoverResearch, enrichment) {
  const entries = enrichment.entries || {};
  return {
    ...sleepoverResearch,
    enrichment_researched_at: enrichment.researched_at,
    media_rights_note: enrichment.source_policy,
    nights: sleepoverResearch.nights.map((night) => ({
      ...night,
      suggestions: (night.suggestions || []).map((suggestion) => {
        const entry = entries[suggestion.id];
        if (!entry) return suggestion;
        const referencedImage = entry.image_ref ? entries[entry.image_ref]?.image : null;
        const researchPriceUrl = suggestion.booking_url && suggestion.booking_url !== entry.booking_url
          ? suggestion.booking_url
          : undefined;
        return {
          ...suggestion,
          ...entry,
          ...(researchPriceUrl ? { research_price_url: researchPriceUrl } : {}),
          image: entry.image || referencedImage || undefined,
        };
      }),
    })),
  };
}

async function loadSourcePackages() {
  const packages = new Map();
  for (const [directory, ids] of Object.entries(sourceSelections)) {
    const base = path.join(ROOT, 'dataset', 'routes', directory);
    const [places, images, sources] = await Promise.all(['places.json', 'images.json', 'sources.json'].map((file) => readFile(path.join(base, file), 'utf8').then(JSON.parse)));
    packages.set(directory, { ids, places: places.places, images: images.images, sources: sources.sources });
  }
  return packages;
}

async function routeLeg(day, index, from, to) {
  const [a, b] = [nodes[from].coordinates, nodes[to].coordinates];
  const endpoint = `https://router.project-osrm.org/route/v1/driving/${a.join(',')};${b.join(',')}?overview=full&geometries=geojson&steps=false`;
  const response = await fetch(endpoint, { headers: { 'User-Agent': 'DetourAtlas/1.0 route-package-builder' } });
  if (!response.ok) throw new Error(`OSRM ${response.status} for ${from} to ${to}`);
  const body = await response.json();
  const result = body.routes?.[0];
  if (!result) throw new Error(`OSRM returned no route for ${from} to ${to}`);
  const baselineMinutes = Math.ceil(result.duration / 60);
  return {
    id: `d${day}-${index + 1}-${from}-to-${to}`,
    from, to,
    distance_meters: Math.round(result.distance),
    distance_miles: Math.round(result.distance / 1609.344 * 10) / 10,
    baseline_seconds: Math.round(result.duration),
    baseline_minutes: baselineMinutes,
    planning_minutes: Math.ceil(baselineMinutes * 1.2),
    traffic_risk: day === 1 || day === 4 || day === 7 || day === 9 ? 'high' : 'medium',
    mode: 'drive', display_duration_minutes: baselineMinutes, counts_toward_drive_cap: true,
    geometry: result.geometry, routing_source: 'OSRM car profile baseline; no live traffic',
  };
}

async function collectGeometry() {
  const days = [];
  for (let dayIndex = 0; dayIndex < dayPlans.length; dayIndex += 1) {
    const plan = dayPlans[dayIndex];
    const legs = [];
    for (let index = 0; index < plan.nodes.length - 1; index += 1) legs.push(await routeLeg(dayIndex + 1, index, plan.nodes[index], plan.nodes[index + 1]));
    const baselineSeconds = legs.reduce((sum, leg) => sum + leg.baseline_seconds, 0);
    const baselineMeters = legs.reduce((sum, leg) => sum + leg.distance_meters, 0);
    const baselineMinutes = Math.ceil(baselineSeconds / 60);
    days.push({
      day: dayIndex + 1,
      risk: legs.some((leg) => leg.traffic_risk === 'high') ? 'high' : 'medium',
      legs,
      baseline_total_meters: baselineMeters,
      baseline_total_seconds: baselineSeconds,
      non_driving_travel_minutes: dayIndex === 3 ? 55 : 0,
      baseline_total_miles: Math.round(baselineMeters / 1609.344 * 10) / 10,
      baseline_total_minutes: baselineMinutes,
      planning_total_minutes: { low: baselineMinutes, high: Math.ceil(baselineMinutes * 1.2) },
      total_travel_minutes_excluding_queues: baselineMinutes + (dayIndex === 3 ? 55 : 0),
    });
  }
  return {
    generated_at: new Date().toISOString(), routing_engine: 'OSRM', routing_profile: 'car', traffic_model: 'baseline-with-20-percent-planning-envelope',
    warning: 'OSRM is a route-shape baseline, not live traffic. Recheck each morning and protect the 210-minute cap.',
    nodes, days,
    route_baseline_total_meters: days.reduce((sum, day) => sum + day.baseline_total_meters, 0),
    route_baseline_total_miles: Math.round(days.reduce((sum, day) => sum + day.baseline_total_meters, 0) / 1609.344 * 10) / 10,
    route_baseline_total_seconds: days.reduce((sum, day) => sum + day.baseline_total_seconds, 0),
  };
}

function prefixedSourceId(routeId, sourceId) {
  return `src-final-${routeId.replace('route-', 'r')}-${sourceId.replace(/^src-/, '')}`;
}

async function build() {
  await mkdir(ROUTE_DIR, { recursive: true });
  const [packages, rawResearch, ratingCsv, rawSleepoverResearch, sleepoverEnrichment] = await Promise.all([
    loadSourcePackages(),
    readFile(path.join(ROOT, 'dataset/routes/route-01-gilded-coast-capital-loop/research-raw.json'), 'utf8').then(JSON.parse),
    readFile(path.join(ROOT, 'route_ratings_rows.csv'), 'utf8'),
    readFile(path.join(ROOT, 'scripts/route-12/sleepovers.json'), 'utf8').then(JSON.parse),
    readFile(path.join(ROOT, 'scripts/route-12/sleepover-enrichment.json'), 'utf8').then(JSON.parse),
  ]);
  const sleepoverResearch = enrichSleepoverResearch(rawSleepoverResearch, sleepoverEnrichment);
  const ratingRows = parseRatings(ratingCsv);
  const selectedPlaces = [];
  const selectedImages = [];
  const selectedSources = new Map();

  for (const [directory, sourcePackage] of packages) {
    const sourceRouteId = sourceRouteIds[directory];
    for (const placeId of sourcePackage.ids) {
      const original = sourcePackage.places.find((place) => place.id === placeId);
      if (!original) throw new Error(`Missing ${placeId} in ${directory}`);
      const corridorOption = corridorOptions[placeId];
      const travelerRatings = Object.fromEntries(PEOPLE.map((person) => [person, ratingRows.find((row) => row.route_id === sourceRouteId && row.place_id === placeId && row.traveler_id === person)?.score ?? null]));
      if (!corridorOption && Object.values(travelerRatings).some((score) => score == null)) throw new Error(`Incomplete preserved ratings for ${sourceRouteId}/${placeId}`);
      const imageIds = original.image_ids.map((id, index) => {
        const image = sourcePackage.images.find((candidate) => candidate.id === id);
        if (!image) throw new Error(`Missing image ${id}`);
        const finalId = `img-final-${placeId}-${index + 1}`;
        selectedImages.push({ ...image, id: finalId, place_id: placeId });
        return finalId;
      });
      const sourceIds = original.source_ids.map((id) => {
        const source = sourcePackage.sources.find((candidate) => candidate.id === id);
        if (!source) throw new Error(`Missing source ${id}`);
        const finalId = prefixedSourceId(sourceRouteId, id);
        selectedSources.set(finalId, { ...source, id: finalId });
        return finalId;
      });
      const scores = Object.values(travelerRatings).filter(Number.isFinite);
      const isArrivalOption = placeId === 'newport-car-museum';
      selectedPlaces.push({
        ...original,
        visit_date: visitDates[placeId] || `2026-10-${String(corridorOption.days[0] + 3).padStart(2, '0')}`,
        priority: corridorOption ? 'flex' : isArrivalOption ? 'optional' : original.priority === 'optional' ? 'supporting' : original.priority,
        included_in_magic_score: !corridorOption && !isArrivalOption,
        included_in_magic_default: !corridorOption && !isArrivalOption,
        core_status: corridorOption ? 'corridor-option-outside-baseline' : isArrivalOption ? 'arrival-day-optional' : 'final-decision-core',
        optional: Boolean(corridorOption) || isArrivalOption,
        source_ids: sourceIds,
        image_ids: imageIds,
        rating_source: { route_id: sourceRouteId, place_id: placeId, preserved: true },
        ratings: { traveler_ratings: travelerRatings, average: scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null, rating_count: scores.length, source: 'preserved-db-export-2026-09-04' },
        data_status: scores.length === PEOPLE.length ? 'complete' : 'ratings-incomplete',
      });
    }
  }

  for (const original of legacyPlaces) {
    const sourceRouteId = 'route-01';
    const travelerRatings = Object.fromEntries(PEOPLE.map((person) => [person, ratingRows.find((row) => row.route_id === sourceRouteId && row.place_id === original.id && row.traveler_id === person)?.score ?? null]));
    const raw = rawResearch.places[original.id];
    const imageIds = raw.selected_images.slice(0, 3).map((image, index) => {
      const finalId = `img-final-${original.id}-${index + 1}`;
      selectedImages.push({
        id: finalId, place_id: original.id, local_path: image.local_path, source_page: image.source_page,
        source_file_url: image.original_url, creator: image.creator || 'Unknown creator', credit: image.credit,
        license: image.license || 'Rights status unknown', license_url: image.license_url,
        alt: image.description || `${original.name} photograph`, coverage: 'exact-place', production_usable: image.license !== 'Unknown', visual_review: 'reviewed',
      });
      return finalId;
    });
    const sourceIds = original.source_ids.map((id) => {
      const finalId = prefixedSourceId(sourceRouteId, id);
      selectedSources.set(finalId, { id: finalId, ...legacySources[id] });
      return finalId;
    });
    const scores = Object.values(travelerRatings);
    selectedPlaces.push({
      ...original, country: 'US', visit_date: visitDates[original.id], coordinate_order: 'longitude_latitude', coordinate_source: 'retained-verified-route-01-research',
      source_ids: sourceIds, image_ids: imageIds,
      rating_source: { route_id: sourceRouteId, place_id: original.id, preserved: true },
      ratings: { traveler_ratings: travelerRatings, average: scores.reduce((sum, score) => sum + score, 0) / scores.length, rating_count: scores.length, source: 'preserved-db-export-2026-09-04' },
      researcher_person_fit: Object.fromEntries(PEOPLE.map((person) => [person, travelerRatings[person]])),
      included_in_magic_score: true, included_in_magic_default: true, core_status: 'restored-final-decision-core', optional: false,
      data_status: 'complete', operational_confidence: 'high', operational_risk: 'reconfirm-hours-and-access-before-booking',
    });
  }

  const placeById = new Map(selectedPlaces.map((place) => [place.id, place]));
  const sleepoverByDay = new Map(sleepoverResearch.nights.map((night) => [night.day, night]));
  const geometry = await collectGeometry();
  const days = dayPlans.map((plan, index) => {
    const day = index + 1;
    const date = `2026-10-${String(day + 3).padStart(2, '0')}`;
    const routed = geometry.days[index];
    return {
      day, date,
      day_of_week: new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'America/New_York' }).format(new Date(`${date}T12:00:00-04:00`)),
      sleep_city: plan.sleep, theme: plan.theme,
      notes: day === 1 ? ['Newport Car Museum is the only optional stop: use it only if both cars are collected on time.'] : day === 2 ? ['Beinecke is locked at its original 17:30–18:25 window and adds only the short New Haven hop.'] : null,
      lodging: {
        city: plan.sleep,
        status: 'suggestions-not-booked',
        source_document: sleepoverResearch.source_document,
        research_checked: sleepoverResearch.research_checked,
        ...sleepoverByDay.get(day),
      },
      schedule: plan.schedule.map(([start, end, placeId, priority]) => ({ start, end, place_id: placeId, priority, reservation: placeById.get(placeId).reservation })),
      optional_spots: Object.entries(corridorOptions)
        .filter(([, option]) => option.days.includes(day))
        .map(([placeId, option]) => ({
          place_id: placeId,
          option_type: option.option_type,
          status: option.status,
          replaces_place_ids: [],
          current_baseline_total_minutes: routed.baseline_total_minutes,
          current_baseline_total_miles: routed.baseline_total_miles,
          cap_minutes: 210,
          note: option.note,
        })),
      alternative_place_ids: day === 1 ? ['newport-car-museum'] : [],
      drive: {
        legs: routed.legs, baseline_total_miles: routed.baseline_total_miles, baseline_total_minutes: routed.baseline_total_minutes,
        planning_total_minutes: routed.planning_total_minutes, traffic_risk: routed.risk, cap_minutes: 210,
        cap_status: routed.baseline_total_minutes <= 210 ? (routed.baseline_total_minutes >= 185 ? 'near-cap' : 'comfortable') : 'over-cap',
        fallback: 'Check live traffic before departure; remove only the named optional item, never a locked core stop.',
      },
      weather: { kind: 'historical-normal-planning-band', high_c: index < 3 || index > 8 ? 18 : 21, low_c: index < 3 || index > 8 ? 9 : 12, precipitation_probability_percent: 28, comfort_score: 4.1, forecast_status: 'replace-with-live-forecast-10-days-before' },
    };
  });

  const corePlaces = selectedPlaces.filter((place) => place.included_in_magic_score);
  const personAverages = Object.fromEntries(PEOPLE.map((person) => [person, Math.round(corePlaces.reduce((sum, place) => sum + place.ratings.traveler_ratings[person], 0) / corePlaces.length * 1000) / 1000]));
  const groupAverage = Math.round(Object.values(personAverages).reduce((sum, score) => sum + score, 0) / PEOPLE.length * 1000) / 1000;
  const route = {
    schema_version: '1.0.0',
    route: {
      id: ROUTE_ID, slug: ROUTE_SLUG, name: 'The Atlantic Winners Decision Loop', short_name: 'Atlantic Winners', status: 'final-decision-ui-ready', map_color: MAP_COLOR,
      timezone: 'America/New_York', start_date: '2026-10-04', end_date: '2026-10-14', airport_date: '2026-10-15',
      origin: nodes['boston-logan-rental'], destination: nodes['boston-logan-hotel'], endpoint_city: 'Washington, DC / Richmond, VA',
      direction: 'Boston to Newport and New Haven, through New York and Pennsylvania to Washington and Richmond, returning through Philadelphia, Princeton, and Connecticut',
      countries: ['US'], canada_included: false, total_nights: 11, road_nights: 10, final_boston_nights: 1,
      baseline_total_miles: geometry.route_baseline_total_miles,
      summary: 'The final group decision route keeps 21 scored core experiences, one scheduled arrival-day option, and 17 visible corridor choices outside the baseline. Beinecke remains locked on Day 2 and every optional place preserves its original shared ratings.',
      route_dna: 'GROUP WINNERS × PLAYFUL MACHINES × STRANGE ARCHITECTURE × SACRED INTERIORS', verified_at: '2026-09-04', decision_route: true,
    },
    constraints: {
      travelers: 4, cars: 2, cars_follow_same_route: true, daily_drive_target_minutes: [120, 180], daily_drive_hard_cap_minutes: 210,
      max_big_nights_out: 4, planned_big_nights_out: 1, max_athletic_adrenaline_spots: 2, planned_athletic_adrenaline_spots: 1,
      hike_soft_cap_miles: 6, lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ['safe', 'clean', 'comfortable', 'two-room inventory', 'secure two-car parking'],
      visa_policy: 'US-only; no Canada crossing or J-1 re-entry dependency.', budget_target_per_person_usd: 1500,
      budget_excludes: ['lodging', 'rental cars', 'fuel', 'nightlife', 'personal shopping'], max_uninterrupted_drive_minutes: 150,
      route_specific_drive_rule: 'Every baseline day is at or below 210 minutes; Allentown and Rye are explicit comfort breaks on the two longest transfer lines.',
    },
    scoring: {
      scale: { min: 1, max: 5, increment: 0.5 }, equal_traveler_weight: true, traveler_ids: PEOPLE,
      route_component_weights_percent: { attraction_and_stop_ratings: 45, excitement_and_uniqueness: 20, driving_comfort: 15, traveler_fairness: 10, cost_and_value: 5, expected_weather: 5 },
      route_ratings: personAverages, driving_comfort_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), overall_excitement_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      cost_value_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), weather_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      magic_score: groupAverage, magic_score_status: 'fully-rated-final-decision-core', person_specific_route_scores: personAverages,
    },
    days,
    place_ids: selectedPlaces.map((place) => place.id), core_place_ids: corePlaces.map((place) => place.id),
    alternative_place_ids: ['newport-car-museum', ...corridorOptionIds], replacement_place_ids: [], replacement_options: [],
    budget: { known_core_admission_floor_per_person_usd: null, core_admissions_planning_range_per_person_usd: [330, 520], food_and_cafes_range_per_person_usd: [600, 900], local_transit_shared_parking_tolls_range_per_person_usd: [180, 300], controllable_total_range_per_person_usd: [1110, 1720], note: 'Reprice timed experiences and parking before booking; personal shopping remains excluded.' },
    booking_priorities: [
      { place_id: 'o-street-museum', urgency: 'buy-first', reason: 'Timed weekend inventory.' },
      { place_id: 'it-adventure-ropes', urgency: 'early', reason: 'Protect the Day 2 sequence and Beinecke window.' },
      { place_id: 'hotel-greene', urgency: 'early', reason: 'Saturday capacity can create waits.' },
      { place_id: 'hershey-candy-bar', urgency: 'when-calendar-opens', reason: 'Reserve the Day 5 afternoon slot.' },
    ],
    validation: {
      date_count: days.length, expected_date_count: 11, all_baseline_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= 210),
      live_traffic_gated_days: days.filter((day) => day.drive.planning_total_minutes.high > 210).map((day) => day.day),
      place_count: selectedPlaces.length, image_count: selectedImages.length, places_with_fewer_than_3_usable_images: selectedPlaces.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      replacement_option_count: 0, corridor_option_count: corridorOptionIds.length, all_replacement_variants_at_or_below_cap: true,
      unfilled_core_place_ratings: 0,
      unfilled_optional_place_ratings: selectedPlaces.filter((place) => !place.included_in_magic_score).reduce((count, place) => count + Object.values(place.ratings.traveler_ratings).filter((score) => score == null).length, 0),
      hard_closures_or_conflicts: ['Live traffic can exceed the planning envelope on near-cap days.', 'Newport Car Museum is optional if arrival-day rental collection slips.'],
      route_lock_status: 'final-decision-research-complete-bookings-pending',
      preserved_rating_count: selectedPlaces.reduce((count, place) => count + Object.values(place.ratings.traveler_ratings).filter(Number.isFinite).length, 0),
    },
    archived_place_ids: [],
    experience_model: { decision_basis: 'fully-rated-core-with-unscored-corridor-options', core_group_average: groupAverage, fairness_floor: Math.min(...Object.values(personAverages)), optional_arrival_place_id: 'newport-car-museum', corridor_option_ids: corridorOptionIds },
    operational_flags: ['recheck-live-traffic', 'reconfirm-hours', 'preserve-source-rating-identities'],
  };

  const geojson = {
    type: 'FeatureCollection', name: ROUTE_DIRECTORY,
    features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({ type: 'Feature', id: leg.id, properties: { feature_kind: 'drive_leg', route_id: ROUTE_ID, day: day.day, date: day.date, from: leg.from, to: leg.to, distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, traffic_risk: leg.traffic_risk, map_color: MAP_COLOR, final_decision: true }, geometry: leg.geometry }))),
      ...selectedPlaces.map((place) => ({ type: 'Feature', id: place.id, properties: { feature_kind: 'place', route_id: ROUTE_ID, place_id: place.id, name: place.name, city: place.city, state: place.state, priority: place.priority, included_in_magic_score: place.included_in_magic_score, map_color: MAP_COLOR }, geometry: { type: 'Point', coordinates: place.coordinates } })),
    ],
  };
  const replacementGeometry = { schema_version: '1.0.0', route_id: ROUTE_ID, generated_at: '2026-09-04', routing_engine: 'none-required', traffic_included: false, variants: [] };
  const provenance = {
    schema_version: '1.0.0', route_id: ROUTE_ID, generated_at: new Date().toISOString(), source_export: 'route_ratings_rows.csv',
    policy: 'No route-12 rating rows are created. Each place reads and writes through rating_source to preserve the original shared-board record.',
    selected_spots: selectedPlaces.map((place) => ({ place_id: place.id, rating_source: place.rating_source, traveler_ratings: place.ratings.traveler_ratings, included_in_core: place.included_in_magic_score })),
  };
  const sources = [...selectedSources.values(), { id: 'src-final-rating-export', publisher: 'Detour Atlas shared rating board', type: 'first-party-data-export', url: 'route_ratings_rows.csv', supports: ['four named traveler ratings', 'final route selection', 'rating provenance'] }];

  await Promise.all([
    writeFile(path.join(ROUTE_DIR, 'route.json'), `${JSON.stringify(route, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'places.json'), `${JSON.stringify({ schema_version: '1.0.0', route_id: ROUTE_ID, places: selectedPlaces }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'images.json'), `${JSON.stringify({ schema_version: '1.0.0', route_id: ROUTE_ID, images: selectedImages }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'sources.json'), `${JSON.stringify({ schema_version: '1.0.0', route_id: ROUTE_ID, sources }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'route-geometry.json'), `${JSON.stringify(geometry, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'route.geojson'), `${JSON.stringify(geojson, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'replacement-geometry.json'), `${JSON.stringify(replacementGeometry, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'rating-provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'sleepovers.json'), `${JSON.stringify(sleepoverResearch, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'route-decisions.json'), `${JSON.stringify({ route_id: ROUTE_ID, status: 'final-decision', locked_additions: ['beinecke-library'], optional_only: ['newport-car-museum', ...corridorOptionIds], method: '21 fully rated scored core places, equal traveler weight, physical routing under the 210-minute daily baseline cap; corridor options remain visible but outside the baseline and winning score' }, null, 2)}\n`),
    writeFile(path.join(ROUTE_DIR, 'README.md'), `# The Atlantic Winners Decision Loop\n\nFinal 11-night decision route for October 4–14, 2026. It contains 21 locked, fully rated core places, Newport Car Museum as the scheduled arrival-day option, and 17 additional corridor choices shown outside the baseline. Beinecke Rare Book & Manuscript Library remains on Day 2 at 17:30–18:25.\n\nRatings are not duplicated or filled in. Every place carries a \`rating_source\` pointing to its original route/place row, and \`rating-provenance.json\` records the retained traveler snapshot. Incomplete optional ratings stay incomplete and do not affect the winning score.\n\nExisting sleepover research is remapped into each day under \`lodging.suggestions\`; \`sleepovers.json\` preserves the complete research/gap status without presenting stale price context as a live quote.\n\nRebuild with \`node scripts/route-12/build.mjs\`; validate with \`node scripts/validate-route-package.mjs ${ROUTE_DIRECTORY}\`.\n`),
  ]);

  const manifestPath = path.join(ROOT, 'dataset', 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const entry = {
    id: ROUTE_ID, slug: ROUTE_SLUG, name: route.route.name, status: route.route.status,
    start_date: route.route.start_date, end_date: route.route.end_date, airport_date: route.route.airport_date,
    map_color: MAP_COLOR,
    entry_path: `routes/${ROUTE_DIRECTORY}/route.json`,
    places_path: `routes/${ROUTE_DIRECTORY}/places.json`,
    images_path: `routes/${ROUTE_DIRECTORY}/images.json`,
    map_path: `routes/${ROUTE_DIRECTORY}/route.geojson`,
    replacement_geometry_path: `routes/${ROUTE_DIRECTORY}/replacement-geometry.json`,
    sources_path: `routes/${ROUTE_DIRECTORY}/sources.json`,
    decisions_path: `routes/${ROUTE_DIRECTORY}/route-decisions.json`,
    place_count: selectedPlaces.length, image_count: selectedImages.length, day_count: days.length,
    baseline_miles: geometry.route_baseline_total_miles,
  };
  manifest.routes = [...manifest.routes.filter((candidate) => candidate.id !== ROUTE_ID), entry].sort((a, b) => a.id.localeCompare(b.id));
  manifest.route_count = manifest.routes.length;
  manifest.updated_at = '2026-09-04';
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`Built ${ROUTE_ID}: ${selectedPlaces.length} places, ${selectedImages.length} images, ${geometry.route_baseline_total_miles} miles.`);
  console.log(`Preserved core score: ${groupAverage}/5; traveler averages ${JSON.stringify(personAverages)}.`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
