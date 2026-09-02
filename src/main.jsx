import { Component, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import manifest from '../dataset/manifest.json';
import { assessAtlasGrading, generateBestOfRoute } from './best-of-route.js';
import { loadAllRatings, persistRating, ratingSyncConfigured, reconcileRatings } from './ratings-store.js';
import { ROUTES, ROUTE_BY_ID, activeRouteId, loadAllRouteFeatures, loadAllRoutes, loadRoute, routeLegend } from './routes.js';
import './styles.css';

let ACTIVE;
let routeData;
let placesData;
let imagesData;
let routeGeometry;
let replacementData;
let ROUTE_ID;
let ROUTE_COLOR;
let RATINGS_KEY;
let placeById;
let imageById;
let nodeById;
let nodeCityById;
let routeFeatures;
let stats;
let LngLatBounds;
let MapLibreMap;
let mapLibrePromise;
let Leaflet;
let leafletPromise;

const PRODUCT_NAME = 'The Detour Atlas';
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';
const EMPTY_COLLECTION = { type: 'FeatureCollection', features: [] };
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const TRAVELERS = [
  { id: 'sheluvspaco', name: 'Paco', short: 'P', color: '#e5b96b' },
  { id: 'viki', name: 'Viki', short: 'V', color: '#e77d63' },
  { id: 'gora', name: 'Gora', short: 'G', color: '#4f9d8d' },
  { id: 'stivka', name: 'Stivka', short: 'S', color: '#8174aa' },
];
const ENERGIZED_PRICING_ROUTE_IDS = new Set(['route-01', 'route-02', 'route-03', 'route-04', 'route-05', 'route-06', 'route-07', 'route-08', 'route-09', 'route-10']);

function applyActiveRoute(bundle) {
  ACTIVE = bundle;
  routeData = bundle.route;
  placesData = bundle.places;
  imagesData = bundle.images;
  routeGeometry = bundle.geometry;
  replacementData = bundle.replacements;
  ROUTE_ID = bundle.id;
  ROUTE_COLOR = bundle.color;
  RATINGS_KEY = `detour-atlas-${bundle.id}-ratings`;
  placeById = new Map(placesData.places.map((place) => [place.id, place]));
  imageById = new Map(imagesData.images.map((image) => [image.id, image]));
  nodeById = new Map(Object.entries(routeGeometry.nodes || {}));
  routeFeatures = bundle.geojson.features.filter((feature) => feature.properties?.feature_kind === 'drive_leg');
  nodeCityById = buildNodeCityById();
  stats = routeStats();
  document.documentElement.style.setProperty('--route', ROUTE_COLOR);
}

let routeNavigator = null;

function loadMapLibre() {
  if (!mapLibrePromise) {
    mapLibrePromise = Promise.all([
      import('maplibre-gl'),
      import('maplibre-gl/dist/maplibre-gl.css'),
      import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'),
    ]).then(([module, , worker]) => {
      LngLatBounds = module.LngLatBounds;
      MapLibreMap = module.Map;
      module.setWorkerUrl(worker.default);
      return module;
    });
  }
  return mapLibrePromise;
}

function loadLeaflet() {
  if (!leafletPromise) {
    leafletPromise = import('leaflet').then((module) => {
      Leaflet = module;
      return module;
    });
  }
  return leafletPromise;
}

function openRoute(routeId) {
  routeNavigator?.(routeId);
}

function assetPath(localPath, optimized = true, rendition = 'display') {
  const normalized = String(localPath || '').replace(/^\/+/, '');
  if (optimized && ACTIVE) {
    const suffix = rendition === 'thumb' ? '-thumb.webp' : '.webp';
    const filename = normalized.split('/').at(-1).replace(/\.[^.]+$/, suffix);
    const routeDirectory = normalized.split('/')[2];
    return `/assets/optimized/routes/${routeDirectory}/${filename}`;
  }
  return `/${normalized}`;
}

function RouteImage({ image, images = [], alt = '', onError, rendition = 'display', sizes, loading = 'eager', ...props }) {
  const candidates = useMemo(() => {
    const seen = new Set();
    return [image, ...images].filter((candidate) => {
      if (!candidate?.local_path || seen.has(candidate.local_path)) return false;
      seen.add(candidate.local_path);
      return true;
    });
  }, [image, images]);
  const candidateKey = candidates.map((candidate) => candidate.local_path).join('|');
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [useOriginal, setUseOriginal] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(loading !== 'lazy');
  const imageRef = useRef(null);

  useEffect(() => {
    setCandidateIndex(0);
    setUseOriginal(false);
    setShouldLoad(loading !== 'lazy');
  }, [candidateKey, loading]);

  useEffect(() => {
    if (loading !== 'lazy' || shouldLoad || !imageRef.current) return undefined;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '180px' });
    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, [loading, shouldLoad, candidateKey]);

  const activeImage = candidates[candidateIndex];
  if (!activeImage) return <span className="image-placeholder" aria-hidden="true" />;
  const optimizedSrcSet = shouldLoad && !useOriginal && rendition === 'display'
    ? `${assetPath(activeImage.local_path, true, 'thumb')} 480w, ${assetPath(activeImage.local_path, true, 'display')} 1280w`
    : undefined;

  function handleError(event) {
    if (!useOriginal) {
      setUseOriginal(true);
      return;
    }
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex((index) => index + 1);
      setUseOriginal(false);
      return;
    }
    event.currentTarget.dataset.failed = 'true';
    onError?.(event);
  }

  return (
    <img
      {...props}
      ref={imageRef}
      src={shouldLoad ? assetPath(activeImage.local_path, !useOriginal, rendition) : TRANSPARENT_PIXEL}
      srcSet={optimizedSrcSet}
      sizes={optimizedSrcSet ? sizes || '(max-width: 860px) 100vw, 50vw' : sizes}
      alt={alt || activeImage.alt || ''}
      loading={loading}
      decoding="async"
      onError={shouldLoad ? handleError : undefined}
    />
  );
}

function formatMiles(value) {
  const numeric = Number(value || 0);
  return numeric.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: numeric % 1 ? 1 : 0 });
}

function formatDuration(minutes) {
  if (!minutes) return 'Parked day';
  const hours = Math.floor(minutes / 60);
  const remainder = Math.round(minutes % 60);
  return `${hours ? `${hours}h ` : ''}${remainder ? `${remainder}m` : ''}`.trim();
}

function formatUsd(value) {
  const numeric = Number(value);
  const hasCents = Math.abs(numeric - Math.round(numeric)) > 0.001;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function priceRangeLabel(low, high, estimated = false) {
  if (!Number.isFinite(low) || !Number.isFinite(high)) return null;
  const label = Math.abs(low - high) < 0.001 ? formatUsd(low) : `${formatUsd(low)}–${formatUsd(high)}`;
  return estimated ? `${label} est.` : label;
}

function placePrice(place) {
  const cost = place?.cost || {};
  const priceStatus = `${cost.price_type || ''} ${cost.status || ''}`.toLowerCase();
  const isQuoteOnly = cost.amount_per_person == null && /live-quote|dynamic|unpublished/.test(priceStatus);
  const planningSignal = Array.isArray(cost.planning_signal_per_person) ? cost.planning_signal_per_person : null;

  if (isQuoteOnly) {
    const estimate = planningSignal ? priceRangeLabel(Number(planningSignal[0]), Number(planningSignal[1]), true) : null;
    return { label: estimate || 'Live quote', exact: false };
  }

  const range = Array.isArray(cost.range_per_person) ? cost.range_per_person : null;
  if (range && Number.isFinite(Number(range[0])) && Number.isFinite(Number(range[1]))) {
    return { label: priceRangeLabel(Number(range[0]), Number(range[1])), exact: cost.status !== 'checkout-required' };
  }

  const low = Number.isFinite(cost.low) ? cost.low : Number.isFinite(place?.price_per_person_low) ? place.price_per_person_low : null;
  const high = Number.isFinite(cost.high) ? cost.high : Number.isFinite(place?.price_per_person_high) ? place.price_per_person_high : low;
  if (Number.isFinite(low) && Number.isFinite(high)) {
    const donation = low === 0 && high === 0 && /donation/.test(`${cost.note || ''} ${cost.status || ''}`.toLowerCase());
    return { label: donation ? 'Free / donation' : low === 0 && high === 0 ? 'Free' : priceRangeLabel(low, high), exact: cost.status !== 'estimate' };
  }

  if (Number.isFinite(cost.amount_per_person)) {
    const donation = cost.amount_per_person === 0 && /donation/.test(`${cost.note || ''} ${cost.status || ''}`.toLowerCase());
    return { label: donation ? 'Free / donation' : cost.amount_per_person === 0 ? 'Free' : formatUsd(cost.amount_per_person), exact: !/estimate|planning/.test(priceStatus) };
  }

  if (Number.isFinite(cost.amount_per_group) && routeData.constraints?.travelers) {
    return { label: `${formatUsd(cost.amount_per_group / routeData.constraints.travelers)} est.`, exact: false };
  }

  return { label: 'Verify price', exact: false };
}

function placePriceCardLabel(place) {
  if (!ENERGIZED_PRICING_ROUTE_IDS.has(ACTIVE.id)) return null;
  const { label } = placePrice(place);
  if (/^(Free|Live quote|Verify price)/.test(label)) return label;
  if (label.endsWith(' est.')) return `${label.slice(0, -5)} pp est.`;
  return `${label} pp`;
}

function routeAttractionTotal() {
  if (!ENERGIZED_PRICING_ROUTE_IDS.has(ACTIVE.id)) {
    return { label: 'Pending rebuild', note: 'energized pricing not published yet', ready: false };
  }

  const budget = routeData.budget || {};
  const authoritativeRanges = [
    [budget.do_everything_core_low_per_person_usd, budget.do_everything_core_high_per_person_usd, false],
    [budget.core_admissions_range_per_person_usd?.[0], budget.core_admissions_range_per_person_usd?.[1], false],
    [budget.provisional_all_core_planning_envelope_per_person_usd?.[0], budget.provisional_all_core_planning_envelope_per_person_usd?.[1], true],
  ];
  for (const [low, high, estimated] of authoritativeRanges) {
    if (Number.isFinite(low) && Number.isFinite(high)) {
      return { label: priceRangeLabel(low, high, estimated), note: 'per person · default scheduled loop', ready: true };
    }
  }

  const scheduledIds = new Set(routeData.days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  const ranges = [...scheduledIds].map((id) => {
    const place = placeById.get(id);
    const cost = place?.cost || {};
    const range = Array.isArray(cost.range_per_person) ? cost.range_per_person : null;
    const low = Number.isFinite(cost.low) ? cost.low : range ? Number(range[0]) : Number.isFinite(cost.amount_per_person) ? cost.amount_per_person : null;
    const high = Number.isFinite(cost.high) ? cost.high : range ? Number(range[1]) : Number.isFinite(cost.amount_per_person) ? cost.amount_per_person : null;
    return { low, high };
  });
  if (ranges.every(({ low, high }) => Number.isFinite(low) && Number.isFinite(high))) {
    return {
      label: priceRangeLabel(ranges.reduce((sum, item) => sum + item.low, 0), ranges.reduce((sum, item) => sum + item.high, 0), true),
      note: 'per person · computed scheduled loop',
      ready: true,
    };
  }
  return { label: 'Verify total', note: 'one or more live prices are unpublished', ready: false };
}

function dateCode(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date(`${date}T12:00:00`)).toUpperCase();
}

function weekday(date, long = false) {
  return new Intl.DateTimeFormat('en-US', { weekday: long ? 'long' : 'short' }).format(new Date(`${date}T12:00:00`));
}

function riskLabel(risk) {
  return {
    low: 'Low traffic risk',
    medium: 'Medium traffic risk',
    high: 'High traffic risk',
    'schedule-and-weather': 'Schedule + weather risk',
  }[risk] || 'Planning risk';
}

function placeImages(place) {
  if (!place) return [];
  const images = (place.image_ids || []).map((id) => imageById.get(id)).filter(Boolean);
  return [...images.filter((image) => image.production_usable), ...images.filter((image) => !image.production_usable)];
}

function bestImage(place, index = 0) {
  const images = placeImages(place);
  return images[index] || images[0];
}

function nodeName(id) {
  const node = nodeById.get(id);
  const place = placeById.get(id);
  return place?.name || node?.name || String(id || '').replaceAll('-', ' ');
}

// Drive legs run between researched places and lodging/airport nodes. Places carry
// their own city; a lodging node takes the sleep_city of the day whose last leg
// ends there; the few remaining nodes (mid-day waypoints, the airport rental
// centre) resolve to the nearest already-known point, all of which sit inside the
// town they are named for. Nothing here invents a city that is not in the dataset.
function buildNodeCityById() {
  const cities = new Map();
  for (const place of placesData.places) {
    if (place.city) cities.set(place.id, `${place.city}, ${place.state}`);
  }
  for (const day of routeData.days) {
    const legs = day.drive?.legs || [];
    const last = legs[legs.length - 1];
    if (last && day.sleep_city && !cities.has(last.to)) cities.set(last.to, day.sleep_city);
  }
  const coordinatesOf = (id) => placeById.get(id)?.coordinates || nodeById.get(id)?.coordinates;
  const anchors = [...cities.keys()].map((id) => [cities.get(id), coordinatesOf(id)]).filter(([, point]) => point);
  for (const [id, node] of nodeById) {
    if (cities.has(id) || !node.coordinates) continue;
    let closest = null;
    for (const [city, point] of anchors) {
      const dx = (point[0] - node.coordinates[0]) * Math.cos((node.coordinates[1] * Math.PI) / 180);
      const km = Math.hypot(dx, point[1] - node.coordinates[1]) * 111;
      if (km <= 15 && (!closest || km < closest.km)) closest = { km, city };
    }
    if (closest) cities.set(id, closest.city);
  }
  return cities;
}

function nodeCity(id) {
  return nodeCityById.get(id) || nodeName(id);
}

function shortNodeName(id) {
  return nodeName(id)
    .replace('Boston Logan Rental Car Center', 'Boston Logan')
    .replace('Boston Logan hotel zone', 'Boston')
    .replace(' lodging', '')
    .replace('Lodging', '');
}

function featureCollection(features) {
  return { type: 'FeatureCollection', features };
}

function flattenCoordinates(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'LineString') return geometry.coordinates || [];
  if (geometry.type === 'MultiLineString') return (geometry.coordinates || []).flat();
  if (geometry.type === 'Point') return [geometry.coordinates];
  return [];
}

function mapCoordinatesFor(features, points = []) {
  return [
    ...features.flatMap((feature) => flattenCoordinates(feature.geometry)),
    ...points.map((point) => point.coordinates).filter(Boolean),
  ];
}

function mapBoundsFor(features, points = []) {
  const coordinates = mapCoordinatesFor(features, points);
  if (!coordinates.length) return null;
  return coordinates.reduce((bounds, coordinate) => bounds.extend(coordinate), new LngLatBounds(coordinates[0], coordinates[0]));
}

function leafletLineCoordinates(geometry) {
  if (!geometry?.coordinates) return [];
  const swapCoordinates = (coordinates) => {
    if (!Array.isArray(coordinates?.[0])) return [];
    if (typeof coordinates[0][0] === 'number') return coordinates.map(([longitude, latitude]) => [latitude, longitude]);
    return coordinates.map(swapCoordinates);
  };
  return swapCoordinates(geometry.coordinates);
}

function supportsWebGL2() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    const supported = Boolean(context);
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return supported;
  } catch {
    return false;
  }
}

function replacementForDay(dayNumber) {
  return replacementData.variants.find((variant) => variant.day === dayNumber) || null;
}

function dayOptionRecords(day) {
  const scheduledPlaceIds = new Set(routeData.days.flatMap((entry) => entry.schedule.map((item) => item.place_id)));
  const explicitOptions = (day.optional_spots || []).map((option) => ({
    ...option,
    place: placeById.get(option.place_id),
  })).filter((option) => option.place);
  const explicitPlaceIds = new Set(explicitOptions.map((option) => option.place_id));
  const variant = replacementForDay(day.day);
  const dayLimit = day.drive.authorized_cap_exception_minutes
    || routeData.constraints?.daily_drive_hard_cap_minutes
    || day.drive.cap_minutes
    || 210;

  const derivedOptions = (routeData.alternative_place_ids || []).map((placeId) => {
    if (explicitPlaceIds.has(placeId) || scheduledPlaceIds.has(placeId)) return null;
    const place = placeById.get(placeId);
    if (!place || place.visit_date !== day.date) return null;
    if (place.priority === 'archive' || place.energy_rebuild_role === 'preserved-revision-history') return null;

    if (variant?.replacement_place_id === placeId) {
      const replacementNames = (variant.replaces_place_ids || [])
        .map((id) => placeById.get(id)?.name)
        .filter(Boolean);
      return {
        place_id: placeId,
        place,
        option_type: 'route-swap',
        status: 'route-safe-swap',
        replaces_place_ids: variant.replaces_place_ids || [],
        baseline_total_minutes_if_used: variant.baseline_total_minutes,
        baseline_total_miles_if_used: variant.baseline_total_miles,
        current_baseline_total_minutes: day.drive.baseline_total_minutes,
        current_baseline_total_miles: day.drive.baseline_total_miles,
        cap_minutes: dayLimit,
        replacement_variant: variant,
        note: `Use this as a full swap for ${replacementNames.join(' + ')}. The routed replacement remains within the day's driving limit; it is not an extra stop.`,
      };
    }

    const optionType = place.priority === 'flex' ? 'flex' : place.priority === 'alternative' ? 'alternative' : 'optional';
    const defaultNote = optionType === 'flex'
      ? 'A quick flex assigned to this day by the route brief. It is outside the frozen driving baseline, so activate it only when the live ETA, opening window and group energy still work.'
      : 'A selectable alternative assigned to this day by the route brief. It is outside the frozen driving baseline; add or swap it only after checking the live ETA and operating window.';
    return {
      place_id: placeId,
      place,
      option_type: optionType,
      status: `documented-${optionType}`,
      replaces_place_ids: [],
      current_baseline_total_minutes: day.drive.baseline_total_minutes,
      current_baseline_total_miles: day.drive.baseline_total_miles,
      cap_minutes: dayLimit,
      note: place.skip_mode || place.skip_strategy || defaultNote,
    };
  }).filter(Boolean);

  return [...explicitOptions, ...derivedOptions];
}

function dayStops(day, replacement = null) {
  const original = day.schedule.map((item) => ({ ...item, place: placeById.get(item.place_id) })).filter((item) => item.place);
  if (!replacement) return original.map((item, index) => ({ ...item, sequence: index + 1 }));

  const replacedIds = new Set(replacement.replaces_place_ids || []);
  const firstReplacedIndex = original.findIndex((item) => replacedIds.has(item.place_id));
  const replacedItems = original.filter((item) => replacedIds.has(item.place_id));
  const replacementPlace = placeById.get(replacement.replacement_place_id);
  const next = original.filter((item) => !replacedIds.has(item.place_id));
  if (replacementPlace) {
    const insertAt = Math.max(0, firstReplacedIndex);
    next.splice(insertAt, 0, {
      start: replacedItems[0]?.start || '—',
      end: replacedItems.at(-1)?.end || '—',
      place_id: replacementPlace.id,
      place: replacementPlace,
      priority: 'anchor',
      reservation: replacementPlace.reservation || 'check',
      isReplacement: true,
    });
  }
  return next.map((item, index) => ({ ...item, sequence: index + 1 }));
}

function galleryForStops(stops) {
  const seen = new Set();
  return stops.flatMap(({ place }) => placeImages(place).map((image) => ({ image, place })))
    .filter(({ image }) => {
      if (!image || seen.has(image.id)) return false;
      seen.add(image.id);
      return true;
    });
}

function routeStats() {
  const driveMinutes = routeData.days.reduce((sum, day) => sum + (day.drive.baseline_total_minutes || 0), 0);
  const high = Math.max(...routeData.days.map((day) => day.weather?.high_c || 0));
  const low = Math.min(...routeData.days.map((day) => day.weather?.low_c || 0));
  const longestDay = routeData.days.reduce((longest, day) => (day.drive.baseline_total_minutes > longest.drive.baseline_total_minutes ? day : longest), routeData.days[0]);
  return { driveMinutes, high, low, longestDay };
}

function loadRatings() {
  try {
    return JSON.parse(window.localStorage.getItem(RATINGS_KEY) || '{}');
  } catch {
    return {};
  }
}

function Icon({ name, size = 18, strokeWidth = 1.7 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    atlas: <><circle cx="12" cy="12" r="8.5" /><path d="M3.8 9.5c2.8 1.7 5.6 2.5 8.2 2.5 3.2 0 5.9-.9 8.2-2.5" /><path d="M12 3.5c-2 2.2-3 5.1-3 8.5s1 6.3 3 8.5c2-2.2 3-5.1 3-8.5s-1-6.3-3-8.5Z" /></>,
    route: <><path d="M5 19c2.3-6.2 4-10.7 7-10.7 2.1 0 2.2 2.7 4.2 2.7 1.1 0 2-.8 2.8-2" /><circle cx="5" cy="19" r="1.6" /><circle cx="19" cy="9" r="1.6" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17" /></>,
    car: <><path d="m5 17-1.2 2.5M19 17l1.2 2.5M4.5 16.5h15l-1.2-6.1a2 2 0 0 0-2-1.6H7.7a2 2 0 0 0-2 1.6l-1.2 6.1Z" /><path d="M6.5 16.5v1.2h11v-1.2M7 13h.01M17 13h.01" /></>,
    compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    cloud: <><path d="M7.2 18.5h9.4a3.8 3.8 0 0 0 .4-7.6A5.4 5.4 0 0 0 6.7 10a4.3 4.3 0 0 0 .5 8.5Z" /></>,
    bed: <><path d="M4 18v-8.5M4 15h16M20 18v-6.2a2 2 0 0 0-2-2h-5v5M6.5 13V11a2 2 0 0 1 2-2h2.4a2 2 0 0 1 2 2v2" /></>,
    camera: <><path d="M5 7.5h3l1.2-2h5.6l1.2 2h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17V9A1.5 1.5 0 0 1 5 7.5Z" /><circle cx="12" cy="13" r="3.2" /></>,
    info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 10.5v5M12 7.5h.01" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    arrow: <><path d="M5 12h13M13 6l6 6-6 6" /></>,
    external: <><path d="M14 5h5v5M19 5l-8 8" /><path d="M18 13v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 17.5v-10A1.5 1.5 0 0 1 6.5 6H11" /></>,
    warning: <><path d="m12 4 8 15H4L12 4Z" /><path d="M12 9v4M12 16h.01" /></>,
    sparkle: <><path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3ZM19 16l.5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5L19 16Z" /></>,
    users: <><circle cx="9" cy="9" r="3" /><path d="M3.8 19c.5-2.7 2.2-4 5.2-4s4.7 1.3 5.2 4M16 7a3 3 0 0 1 0 5M17 15c2.1.3 3.2 1.6 3.5 3.5" /></>,
    repeat: <><path d="M17 4h3v3M20 7c-1.8-2.1-4-3-6.8-2.4M7 20H4v-3M4 17c1.8 2.1 4 3 6.8 2.4" /><path d="M4 7h9M20 17h-9" /></>,
    expand: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    ticket: <><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7Z" /><path d="M12 7v10" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    gallery: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 15 5-5 4 4 2-2 7 7" /><circle cx="16.5" cy="9.5" r="1.5" /></>,
  };
  return <svg {...common}>{paths[name] || paths.info}</svg>;
}

class AppErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <main className="error-shell"><span className="eyebrow">ATLAS LOAD ERROR</span><h1>The route story stopped short.</h1><p>The data is safe; the interface failed while composing it.</p><code>{this.state.error.message}</code><button className="button button-primary" type="button" onClick={() => window.location.reload()}>Reload the atlas <Icon name="arrow" size={14} /></button></main>;
    }
    return this.props.children;
  }
}

function AtlasRouter({ initialBundle }) {
  const [bundle, setBundle] = useState(initialBundle);
  const [pendingRouteId, setPendingRouteId] = useState(null);
  const [routeLoadError, setRouteLoadError] = useState('');
  const requestRef = useRef(0);

  async function navigate(routeId, writeHistory = true) {
    if (!ROUTE_BY_ID.has(routeId) || routeId === bundle.id || pendingRouteId === routeId) return;
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setPendingRouteId(routeId);
    setRouteLoadError('');
    try {
      const nextBundle = await loadRoute(routeId);
      if (requestRef.current !== requestId) return;
      if (writeHistory) {
        const query = new URLSearchParams({ route: routeId });
        window.history.pushState({}, '', `${window.location.pathname}?${query.toString()}`);
      }
      setBundle(nextBundle);
    } catch (error) {
      if (requestRef.current === requestId) setRouteLoadError(error.message || 'The route package could not be loaded.');
    } finally {
      if (requestRef.current === requestId) setPendingRouteId(null);
    }
  }

  routeNavigator = navigate;
  applyActiveRoute(bundle);

  useEffect(() => {
    const handlePopState = () => navigate(activeRouteId(), false);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });

  return (
    <>
      <AppErrorBoundary key={bundle.id}><App key={bundle.id} /></AppErrorBoundary>
      {pendingRouteId && <div className="route-loading-status" role="status">Loading {ROUTE_BY_ID.get(pendingRouteId)?.name || 'route'}…</div>}
      {routeLoadError && <div className="route-loading-status is-error" role="alert">{routeLoadError}</div>}
    </>
  );
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const initialDay = Math.min(Math.max(Number(params.get('day')) || 1, 1), routeData.days.length);
  const [activeDay, setActiveDay] = useState(initialDay);
  const [activeTraveler, setActiveTraveler] = useState('sheluvspaco');
  const [shellView, setShellView] = useState(params.get('view') || 'atlas');
  const [routeIndexOpen, setRouteIndexOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(params.get('place') || null);
  const [focusedPlaceId, setFocusedPlaceId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedLegId, setSelectedLegId] = useState(null);
  const [mapMode, setMapMode] = useState('day');
  const [replacementReview, setReplacementReview] = useState(null);
  const [acceptedReplacements, setAcceptedReplacements] = useState({});
  const [methodOpen, setMethodOpen] = useState(false);
  const [ratings, setRatings] = useState(loadRatings);
  const [allRouteFeatureData, setAllRouteFeatureData] = useState([]);
  const [allRoutesLoading, setAllRoutesLoading] = useState(false);
  const [compareRoutes, setCompareRoutes] = useState(null);

  const day = routeData.days[activeDay - 1];
  const activeVariant = acceptedReplacements[activeDay] ? replacementForDay(activeDay) : null;
  const activeStops = useMemo(() => dayStops(day, activeVariant), [day, activeVariant]);
  const heroGallery = useMemo(() => galleryForStops(activeStops), [activeStops]);
  const selectedPlace = selectedPlaceId ? placeById.get(selectedPlaceId) : null;
  const focusedPlace = focusedPlaceId ? placeById.get(focusedPlaceId) : null;
  const selectedLeg = day.drive.legs.find((leg) => leg.id === selectedLegId) || activeVariant?.legs?.find((leg) => leg.id === selectedLegId) || null;
  const travelerRatingCount = Object.keys(ratings).filter((key) => key.startsWith(`${activeTraveler}:`)).length;

  useEffect(() => {
    window.localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    if (!ratingSyncConfigured) return undefined;
    let cancelled = false;
    const localRatings = loadRatings();

    reconcileRatings(ROUTE_ID, localRatings)
      .then((syncedRatings) => {
        if (!cancelled) setRatings(syncedRatings);
      })
      .catch((error) => {
        console.error('[Detour Atlas] Rating sync failed; using the local copy.', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.title = selectedPlace ? `${selectedPlace.name} · ${PRODUCT_NAME}` : `${ACTIVE.name} · ${PRODUCT_NAME}`;
  }, [selectedPlace]);

  function writeUrl(next = {}) {
    const nextDay = next.day ?? activeDay;
    const nextView = next.view ?? shellView;
    const nextPlace = next.place === undefined ? selectedPlaceId : next.place;
    const query = new URLSearchParams({ route: ACTIVE.id });
    if (nextView !== 'atlas') query.set('view', nextView);
    if (nextDay !== 1) query.set('day', String(nextDay));
    if (nextPlace) query.set('place', nextPlace);
    window.history.replaceState({}, '', `${window.location.pathname}?${query.toString()}`);
  }

  function changeDay(nextDay) {
    setActiveDay(nextDay);
    setSelectedPlaceId(null);
    setFocusedPlaceId(null);
    setSelectedLegId(null);
    setReplacementReview(null);
    setHeroIndex(0);
    writeUrl({ day: nextDay, place: null });
  }

  function changeView(nextView) {
    setShellView(nextView);
    setSelectedPlaceId(null);
    writeUrl({ view: nextView, place: null });
    if (nextView === 'compare' && !compareRoutes) {
      loadAllRoutes().then(setCompareRoutes).catch((error) => console.error('[Detour Atlas] Route comparison failed to load.', error));
    }
  }

  async function showAllRoutes() {
    setMapMode('all');
    setRouteIndexOpen(false);
    if (allRouteFeatureData.length || allRoutesLoading) return;
    setAllRoutesLoading(true);
    try {
      setAllRouteFeatureData(await loadAllRouteFeatures());
    } catch (error) {
      console.error('[Detour Atlas] All-routes geometry failed to load.', error);
      setMapMode('whole');
    } finally {
      setAllRoutesLoading(false);
    }
  }

  function openPlace(placeId) {
    setSelectedPlaceId(placeId);
    setFocusedPlaceId(placeId);
    setSelectedImage(0);
    writeUrl({ place: placeId });
  }

  function closePlace() {
    setSelectedPlaceId(null);
    setSelectedImage(0);
    writeUrl({ place: null });
  }

  function ratePlace(placeId, score, travelerId = activeTraveler) {
    setRatings((current) => {
      const key = `${travelerId}:${placeId}`;
      if (score == null) {
        const next = { ...current };
        delete next[key];
        return next;
      }
      return { ...current, [key]: score };
    });
    persistRating({ routeId: ROUTE_ID, placeId, travelerId, score }).catch((error) => {
      console.error('[Detour Atlas] Rating save failed; the local copy is still safe.', error);
    });
  }

  function focusPlace(placeId) {
    setFocusedPlaceId(placeId);
    if (placeId) setSelectedLegId(null);
  }

  function selectLeg(legId) {
    setSelectedLegId(legId);
    if (legId) setFocusedPlaceId(null);
  }

  function acceptReplacement(dayNumber) {
    setAcceptedReplacements((current) => ({ ...current, [dayNumber]: true }));
    setReplacementReview(null);
    setSelectedLegId(null);
    setHeroIndex(0);
  }

  function restoreOriginal(dayNumber) {
    setAcceptedReplacements((current) => ({ ...current, [dayNumber]: false }));
    setReplacementReview(null);
    setSelectedLegId(null);
    setHeroIndex(0);
  }

  return (
    <div className="app-shell">
      <TopBar
        activeView={shellView}
        activeTraveler={activeTraveler}
        onViewChange={changeView}
        onTravelerChange={setActiveTraveler}
        ratingCount={travelerRatingCount}
        onMethodOpen={() => setMethodOpen(true)}
      />
      <main className="workspace">
        <RouteMap
          activeDay={activeDay}
          day={day}
          activeStops={activeStops}
          activeVariant={activeVariant}
          focusedPlace={focusedPlace}
          selectedLeg={selectedLeg}
          selectedLegId={selectedLegId}
          replacementReview={replacementReview}
          mapMode={mapMode}
          onMapModeChange={setMapMode}
          onPlaceFocus={focusPlace}
          onPlaceOpen={openPlace}
          onLegSelect={selectLeg}
          onIndexToggle={() => setRouteIndexOpen((open) => !open)}
          routeIndexOpen={routeIndexOpen}
          onRouteIndexClose={() => setRouteIndexOpen(false)}
          onShowAllRoutes={showAllRoutes}
          allRouteFeatures={allRouteFeatureData}
          allRoutesLoading={allRoutesLoading}
        />
        <section className="story-panel" aria-label={`${ACTIVE.name} story`}>
          {shellView === 'atlas' && (
            <RouteStory
              activeDay={activeDay}
              day={day}
              activeStops={activeStops}
              activeVariant={activeVariant}
              heroGallery={heroGallery}
              heroIndex={heroIndex}
              onHeroChange={setHeroIndex}
              onDayChange={changeDay}
              onPlaceOpen={openPlace}
              onPlaceFocus={focusPlace}
              focusedPlace={focusedPlace}
              activeTraveler={activeTraveler}
              ratings={ratings}
              onReplacementReview={setReplacementReview}
            />
          )}
          {shellView === 'ratings' && <RatingStudio activeTraveler={activeTraveler} ratings={ratings} onPlaceOpen={openPlace} />}
          {shellView === 'compare' && <CompareView routes={compareRoutes} onBack={() => changeView('atlas')} />}
          {shellView === 'magic' && <MagicView activeTraveler={activeTraveler} ratings={ratings} onBack={() => changeView('atlas')} />}
        </section>
      </main>

      {selectedPlace && (
        <PlaceGallery
          place={selectedPlace}
          activeTraveler={activeTraveler}
          ratings={ratings}
          imageIndex={selectedImage}
          onImageChange={setSelectedImage}
          onClose={closePlace}
          onRate={(score, travelerId) => ratePlace(selectedPlace.id, score, travelerId)}
        />
      )}
      {replacementReview && (
        <ReplacementReview
          variant={replacementReview}
          active={Boolean(acceptedReplacements[replacementReview.day])}
          onClose={() => setReplacementReview(null)}
          onAccept={() => acceptReplacement(replacementReview.day)}
          onRestore={() => restoreOriginal(replacementReview.day)}
          onPlaceOpen={openPlace}
        />
      )}
      {methodOpen && <MethodNote onClose={() => setMethodOpen(false)} />}
    </div>
  );
}

function TopBar({ activeView, activeTraveler, onViewChange, onTravelerChange, ratingCount, onMethodOpen }) {
  return (
    <header className="topbar">
      <button className="brand-lockup" type="button" onClick={() => onViewChange('atlas')} aria-label={`Open ${ACTIVE.name} atlas`}>
        <span className="brand-mark"><Icon name="atlas" size={20} /></span>
        <span><strong>{PRODUCT_NAME}</strong><small>{ACTIVE.id.replace('route-', 'ROUTE ')} · OCT 04—14, 2026</small></span>
      </button>
      <nav className="global-nav" aria-label="Primary navigation">
        <NavButton active={activeView === 'atlas'} onClick={() => onViewChange('atlas')}>Explore</NavButton>
        <NavButton active={activeView === 'compare'} onClick={() => onViewChange('compare')} badge="01">Compare</NavButton>
        <NavButton active={activeView === 'ratings'} onClick={() => onViewChange('ratings')} badge={ratingCount ? String(ratingCount).padStart(2, '0') : '—'}>Rate</NavButton>
        <NavButton active={activeView === 'magic'} onClick={() => onViewChange('magic')} icon={<Icon name="sparkle" size={13} />}>Magic</NavButton>
      </nav>
      <div className="topbar-actions">
        <div className="traveler-switcher" aria-label="Active traveler">
          <span className="traveler-label">Rating as</span>
          {TRAVELERS.map((traveler) => (
            <button
              className={`traveler-pill ${activeTraveler === traveler.id ? 'is-active' : ''}`}
              style={{ '--traveler-color': traveler.color }}
              key={traveler.id}
              type="button"
              onClick={() => onTravelerChange(traveler.id)}
              aria-label={`Rate as ${traveler.name}`}
              aria-pressed={activeTraveler === traveler.id}
              title={traveler.name}
            >{traveler.short}</button>
          ))}
        </div>
        <button className="method-button" type="button" onClick={onMethodOpen} aria-label="Open route methodology"><Icon name="info" size={17} /></button>
      </div>
    </header>
  );
}

function NavButton({ children, active, onClick, badge, icon }) {
  return <button className={`nav-button ${active ? 'is-active' : ''}`} type="button" onClick={onClick}>{icon}{children}{badge && <span className="nav-badge">{badge}</span>}</button>;
}

function RouteMap({
  activeDay,
  day,
  activeStops,
  activeVariant,
  focusedPlace,
  selectedLeg,
  selectedLegId,
  replacementReview,
  mapMode,
  onMapModeChange,
  onPlaceFocus,
  onPlaceOpen,
  onLegSelect,
  onIndexToggle,
  routeIndexOpen,
  onRouteIndexClose,
  onShowAllRoutes,
  allRouteFeatures,
  allRoutesLoading,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const leafletLayersRef = useRef(null);
  const leafletMarkersRef = useRef(null);
  const focusHandlerRef = useRef(onPlaceFocus);
  const legHandlerRef = useRef(onLegSelect);
  const [mapEngine, setMapEngine] = useState(() => {
    const requestedEngine = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('map');
    return requestedEngine === 'vector' && supportsWebGL2() ? 'vector' : 'compat';
  });
  const [mapReady, setMapReady] = useState(false);
  const [mapLoadSlow, setMapLoadSlow] = useState(false);
  const [mapNotice, setMapNotice] = useState(() => (mapEngine === 'compat' ? 'Performance road map · fully interactive' : ''));
  const [mapLibreLibraryReady, setMapLibreLibraryReady] = useState(Boolean(MapLibreMap));
  const [leafletLibraryReady, setLeafletLibraryReady] = useState(Boolean(Leaflet));

  focusHandlerRef.current = onPlaceFocus;
  legHandlerRef.current = onLegSelect;

  const activeFeatures = useMemo(() => {
    if (activeVariant) {
      return [{ type: 'Feature', id: activeVariant.id, properties: { day: activeDay, replacement: true }, geometry: activeVariant.geometry }];
    }
    return routeFeatures.filter((feature) => Number(feature.properties?.day) === activeDay);
  }, [activeDay, activeVariant]);

  // Selection is deliberately kept out of this memo. Baking it in here made every
  // selection change produce a new feature collection, which rebuilt the whole
  // Leaflet layer stack (hundreds of polylines) instead of just restyling a marker.
  const stopFeatures = useMemo(() => featureCollection(activeStops.map(({ place, sequence, priority, isReplacement }) => ({
    type: 'Feature',
    id: place.id,
    properties: {
      placeId: place.id,
      sequence: String(sequence).padStart(2, '0'),
      name: place.name,
      priority,
      replacement: Boolean(isReplacement),
    },
    geometry: { type: 'Point', coordinates: place.coordinates },
  }))), [activeStops]);

  const selectedStopId = focusedPlace?.id || null;

  function fitMap(mode = mapMode, animate = true) {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const features = mode === 'all' ? allRouteFeatures : mode === 'whole' ? routeFeatures : activeFeatures;
    const points = mode === 'day' ? activeStops.map(({ place }) => place) : [];
    const mobile = window.matchMedia('(max-width: 900px)').matches;
    const padding = mode === 'all'
      ? mobile ? { top: 50, right: 25, bottom: 70, left: 25 } : { top: 80, right: 40, bottom: 100, left: 40 }
      : mobile ? { top: 90, right: 45, bottom: 150, left: 45 } : { top: 120, right: 70, bottom: 190, left: 70 };

    if (mapEngine === 'compat') {
      const coordinates = mapCoordinatesFor(features, points);
      if (!coordinates.length) return;
      const bounds = Leaflet.latLngBounds(coordinates.map(([longitude, latitude]) => [latitude, longitude]));
      map.fitBounds(bounds, {
        paddingTopLeft: [padding.left, padding.top],
        paddingBottomRight: [padding.right, padding.bottom],
        animate,
        duration: animate ? 0.9 : 0,
        maxZoom: mode === 'day' ? 10.5 : 6.25,
      });
      return;
    }

    const bounds = mapBoundsFor(features, points);
    if (!bounds) return;
    map.fitBounds(bounds, { padding, duration: animate ? 900 : 0, maxZoom: mode === 'day' ? 10.4 : 6.2 });
  }

  function useCompatibilityMap(notice = 'Compatibility road map · fully interactive') {
    setMapReady(false);
    setMapLoadSlow(false);
    setMapNotice(notice);
    setMapEngine('compat');
  }

  function changeZoom(direction) {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (mapEngine === 'compat') {
      if (direction > 0) map.zoomIn(1, { animate: true, duration: 0.35 });
      else map.zoomOut(1, { animate: true, duration: 0.35 });
      return;
    }
    if (direction > 0) map.zoomIn({ duration: 350 });
    else map.zoomOut({ duration: 350 });
  }

  useEffect(() => {
    if (mapEngine !== 'vector' || MapLibreMap) {
      if (MapLibreMap) setMapLibreLibraryReady(true);
      return undefined;
    }
    let active = true;
    loadMapLibre()
      .then(() => { if (active) setMapLibreLibraryReady(true); })
      .catch((error) => {
        console.info('[Detour Atlas] Vector map library unavailable; using compatibility map.', error);
        if (active) useCompatibilityMap('Vector map unavailable · compatibility map active');
      });
    return () => { active = false; };
  }, [mapEngine]);

  useEffect(() => {
    if (mapEngine !== 'compat' || Leaflet) {
      if (Leaflet) setLeafletLibraryReady(true);
      return undefined;
    }
    let active = true;
    loadLeaflet()
      .then(() => { if (active) setLeafletLibraryReady(true); })
      .catch((error) => {
        console.error('[Detour Atlas] Compatibility map library failed to load.', error);
        if (active) setMapNotice('Compatibility map failed to load');
      });
    return () => { active = false; };
  }, [mapEngine]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    if (mapEngine === 'compat' && !leafletLibraryReady) return undefined;
    if (mapEngine === 'vector' && !mapLibreLibraryReady) return undefined;
    const container = containerRef.current;
    setMapReady(false);
    setMapLoadSlow(false);

    if (mapEngine === 'compat') {
      container.replaceChildren();
      let tileFailures = 0;
      const map = Leaflet.map(container, {
        zoomControl: false,
        attributionControl: true,
        preferCanvas: false,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        minZoom: 3,
        maxZoom: 18,
      }).setView([40.9, -73.9], 5.25);
      mapRef.current = map;
      const tiles = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'atlas-base-tiles',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const handleTileError = () => {
        tileFailures += 1;
        if (tileFailures === 4) setMapNotice('Street tiles unavailable · route remains interactive');
      };
      tiles.on('tileerror', handleTileError);

      leafletLayersRef.current = {
        context: Leaflet.layerGroup().addTo(map),
        active: Leaflet.layerGroup().addTo(map),
        detour: Leaflet.layerGroup().addTo(map),
        selected: Leaflet.layerGroup().addTo(map),
        stops: Leaflet.layerGroup().addTo(map),
      };
      setMapNotice((current) => current || 'Compatibility road map · fully interactive');
      setMapReady(true);

      const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current === map) map.invalidateSize({ pan: false, animate: false });
      });
      resizeObserver.observe(container);
      const frame = window.requestAnimationFrame(() => map.invalidateSize({ pan: false, animate: false }));

      return () => {
        window.cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        tiles.off('tileerror', handleTileError);
        leafletLayersRef.current = null;
        if (mapRef.current === map) {
          map.remove();
          mapRef.current = null;
        }
      };
    }

    let map;
    try {
      map = new MapLibreMap({
        container,
        style: MAP_STYLE,
        center: [-73.9, 40.9],
        zoom: 5.2,
        minZoom: 3,
        maxZoom: 16,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: true,
        antialias: true,
      });
    } catch (error) {
      console.info('[Detour Atlas] Vector map unavailable; using compatibility map.', error);
      container.replaceChildren();
      useCompatibilityMap('WebGL unavailable · compatibility map active');
      return undefined;
    }
    mapRef.current = map;
    setMapNotice('');

    const handleMapError = (event) => {
      const message = String(event?.error?.message || event?.message || '');
      if (/webgl|gpuinitialization|graphics device|not support/i.test(message)) {
        useCompatibilityMap('WebGL unavailable · compatibility map active');
      }
    };
    map.on('error', handleMapError);

    const slowTimer = window.setTimeout(() => setMapLoadSlow(true), 6500);
    map.once('style.load', () => {
      if (mapRef.current !== map) return;
      window.clearTimeout(slowTimer);
      setMapLoadSlow(false);
      const styleLayers = map.getStyle().layers || [];
      const firstLabel = styleLayers.find((layer) => layer.type === 'symbol')?.id;

      // Positron ships very low-contrast labels; place names were effectively
      // unreadable over the route colours. Enlarge and re-contrast them in place
      // rather than swapping to a louder basemap.
      for (const layer of styleLayers) {
        if (layer.type !== 'symbol' || !layer.layout?.['text-field']) continue;
        const isPlace = /place|city|town|village|state|country/i.test(layer.id);
        try {
          const size = map.getLayoutProperty(layer.id, 'text-size');
          if (typeof size === 'number') map.setLayoutProperty(layer.id, 'text-size', Math.round(size * (isPlace ? 1.3 : 1.12)));
          else if (Array.isArray(size)) map.setLayoutProperty(layer.id, 'text-size', ['*', size, isPlace ? 1.3 : 1.12]);
          map.setPaintProperty(layer.id, 'text-halo-color', 'rgba(255, 253, 247, .95)');
          map.setPaintProperty(layer.id, 'text-halo-width', isPlace ? 2 : 1.5);
          if (isPlace) map.setPaintProperty(layer.id, 'text-color', '#22383b');
        } catch {
          // A style layer that rejects the override keeps its original styling.
        }
      }
      map.addSource('all-route', { type: 'geojson', data: featureCollection(routeFeatures) });
      map.addSource('active-route', { type: 'geojson', data: EMPTY_COLLECTION });
      map.addSource('selected-leg', { type: 'geojson', data: EMPTY_COLLECTION });
      map.addSource('detour-route', { type: 'geojson', data: EMPTY_COLLECTION });
      map.addSource('day-stops', { type: 'geojson', data: EMPTY_COLLECTION });
      map.addSource('all-routes', { type: 'geojson', data: EMPTY_COLLECTION });

      map.addLayer({ id: 'all-routes-casing', type: 'line', source: 'all-routes', paint: { 'line-color': '#fffdf7', 'line-width': 8, 'line-opacity': 0.85 } }, firstLabel);
      map.addLayer({ id: 'all-routes-line', type: 'line', source: 'all-routes', paint: { 'line-color': ['get', 'color'], 'line-width': 3.6, 'line-opacity': 0.92 } }, firstLabel);
      map.addLayer({ id: 'route-context-casing', type: 'line', source: 'all-route', paint: { 'line-color': '#fffdf7', 'line-width': 7, 'line-opacity': 0.75 } }, firstLabel);
      map.addLayer({ id: 'route-context', type: 'line', source: 'all-route', paint: { 'line-color': '#5f6b68', 'line-width': 2.5, 'line-opacity': 0.44 } }, firstLabel);
      map.addLayer({ id: 'active-route-casing', type: 'line', source: 'active-route', paint: { 'line-color': '#fff9ee', 'line-width': 11, 'line-opacity': 0.98 } }, firstLabel);
      map.addLayer({ id: 'active-route-line', type: 'line', source: 'active-route', paint: { 'line-color': ROUTE_COLOR, 'line-width': 6.5, 'line-opacity': 1 } }, firstLabel);
      map.addLayer({ id: 'detour-route-line', type: 'line', source: 'detour-route', paint: { 'line-color': '#9b6f21', 'line-width': 6, 'line-dasharray': [1.4, 1.2], 'line-opacity': 0.95 } }, firstLabel);
      map.addLayer({ id: 'selected-leg-line', type: 'line', source: 'selected-leg', paint: { 'line-color': '#172d31', 'line-width': 9, 'line-opacity': 0.9 } }, firstLabel);
      map.addLayer({ id: 'active-route-hit', type: 'line', source: 'active-route', paint: { 'line-color': '#000000', 'line-width': 28, 'line-opacity': 0 } });
      map.addLayer({
        id: 'stop-halo',
        type: 'circle',
        source: 'day-stops',
        paint: {
          'circle-radius': ['case', ['get', 'selected'], 17, 12],
          'circle-color': ['case', ['get', 'replacement'], '#f2cf83', '#fffaf0'],
          'circle-opacity': 0.92,
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(22, 39, 42, .22)',
        },
      });
      map.addLayer({
        id: 'stop-core',
        type: 'circle',
        source: 'day-stops',
        paint: {
          'circle-radius': ['case', ['get', 'selected'], 10, 8],
          'circle-color': ['case', ['get', 'selected'], '#172d31', ROUTE_COLOR],
        },
      });
      map.addLayer({
        id: 'stop-number',
        type: 'symbol',
        source: 'day-stops',
        layout: { 'text-field': ['get', 'sequence'], 'text-font': ['Noto Sans Bold'], 'text-size': 10, 'text-allow-overlap': true },
        paint: { 'text-color': '#fffaf0' },
      });

      map.on('mouseenter', 'stop-halo', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'stop-halo', () => { map.getCanvas().style.cursor = ''; });
      map.on('click', 'stop-halo', (event) => {
        const placeId = event.features?.[0]?.properties?.placeId;
        if (placeId) focusHandlerRef.current(placeId);
      });
      map.on('mouseenter', 'active-route-hit', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'active-route-hit', () => { map.getCanvas().style.cursor = ''; });
      map.on('click', 'active-route-hit', (event) => {
        const legId = event.features?.[0]?.id || event.features?.[0]?.properties?.id;
        if (legId) legHandlerRef.current(legId);
      });
      setMapReady(true);
    });

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current !== map || typeof map.resize !== 'function') return;
      try {
        map.resize();
      } catch (error) {
        const message = String(error?.message || '');
        if (/resize|webgl|gpu|undefined/i.test(message)) useCompatibilityMap('Vector map failed · compatibility map active');
      }
    });
    resizeObserver.observe(container);
    return () => {
      window.clearTimeout(slowTimer);
      resizeObserver.disconnect();
      map.off('error', handleMapError);
      if (mapRef.current === map) {
        try {
          map.remove();
        } catch {
          container.replaceChildren();
        }
        mapRef.current = null;
      }
    };
  }, [mapEngine, leafletLibraryReady, mapLibreLibraryReady]);

  useEffect(() => {
    if (mapEngine !== 'vector' || !mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const showingAll = mapMode === 'all';
    map.getSource('all-routes')?.setData(showingAll ? featureCollection(allRouteFeatures) : EMPTY_COLLECTION);
    for (const id of ['route-context', 'route-context-casing', 'active-route-casing', 'active-route-line', 'stop-halo', 'stop-core', 'stop-number']) {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', showingAll ? 'none' : 'visible');
    }
  }, [mapEngine, mapReady, mapMode, allRouteFeatures]);

  useEffect(() => {
    if (mapEngine !== 'vector' || !mapReady || !mapRef.current) return;
    mapRef.current.getSource('active-route')?.setData(featureCollection(activeFeatures));
    const detourFeature = replacementReview && !activeVariant
      ? [{ type: 'Feature', id: replacementReview.id, properties: { preview: true }, geometry: replacementReview.geometry }]
      : [];
    mapRef.current.getSource('detour-route')?.setData(featureCollection(detourFeature));
    const selectedFeature = selectedLegId ? routeFeatures.find((feature) => feature.id === selectedLegId) : null;
    mapRef.current.getSource('selected-leg')?.setData(featureCollection(selectedFeature ? [selectedFeature] : []));
  }, [mapEngine, mapReady, activeFeatures, selectedLegId, replacementReview, activeVariant]);

  // Selection touches only the five-point stop source, never the route geometry.
  useEffect(() => {
    if (mapEngine !== 'vector' || !mapReady || !mapRef.current) return;
    mapRef.current.getSource('day-stops')?.setData(featureCollection(stopFeatures.features.map((feature) => ({
      ...feature,
      properties: { ...feature.properties, selected: feature.properties.placeId === selectedStopId },
    }))));
  }, [mapEngine, mapReady, stopFeatures, selectedStopId]);

  const addLeafletLine = (group, feature, options, clickHandler) => {
    const coordinates = leafletLineCoordinates(feature.geometry);
    if (!coordinates.length) return null;
    const line = Leaflet.polyline(coordinates, options).addTo(group);
    if (clickHandler) line.on('click', clickHandler);
    return line;
  };

  // The eleven-route context is the most expensive layer to draw, so it is rebuilt
  // only when the map mode actually changes — not on every day or selection change.
  useEffect(() => {
    if (mapEngine !== 'compat' || !mapReady || !leafletLayersRef.current) return;
    const group = leafletLayersRef.current.context;
    group.clearLayers();
    if (mapMode === 'all') {
      allRouteFeatures.forEach((feature) => {
        addLeafletLine(group, feature, { color: '#fffdf7', weight: 8, opacity: 0.85, interactive: false, smoothFactor: 3 });
        addLeafletLine(group, feature, { color: feature.properties.color, weight: 3.6, opacity: 0.92, interactive: false, smoothFactor: 3 });
      });
      return;
    }
    const whole = mapMode === 'whole';
    routeFeatures.forEach((feature) => {
      addLeafletLine(group, feature, { color: '#fffdf7', weight: whole ? 9 : 7, opacity: 0.76, interactive: false, smoothFactor: whole ? 2.5 : 1.6 });
      addLeafletLine(group, feature, { color: whole ? ROUTE_COLOR : '#5f6b68', weight: whole ? 4.6 : 2.5, opacity: whole ? 0.76 : 0.44, interactive: false, smoothFactor: whole ? 2.5 : 1.6 });
    });
  }, [mapEngine, mapReady, mapMode, allRouteFeatures]);

  useEffect(() => {
    if (mapEngine !== 'compat' || !mapReady || !leafletLayersRef.current) return;
    const layers = leafletLayersRef.current;
    layers.active.clearLayers();
    layers.detour.clearLayers();
    layers.selected.clearLayers();
    if (mapMode === 'all') return;

    activeFeatures.forEach((feature) => {
      addLeafletLine(layers.active, feature, { color: '#fff9ee', weight: 11, opacity: 0.98, interactive: false, smoothFactor: 1.2 });
      addLeafletLine(layers.active, feature, { color: mapMode === 'whole' ? '#17383b' : ROUTE_COLOR, weight: 6.5, opacity: 1, interactive: false, smoothFactor: 1.2 });
      addLeafletLine(layers.active, feature, { color: '#000', weight: 28, opacity: 0, interactive: true }, () => legHandlerRef.current(feature.id));
    });

    if (replacementReview && !activeVariant) {
      addLeafletLine(layers.detour, { geometry: replacementReview.geometry }, { color: '#9b6f21', weight: 6, opacity: 0.95, dashArray: '8 7', interactive: false });
    }

    const selectedFeature = selectedLegId ? routeFeatures.find((feature) => feature.id === selectedLegId) : null;
    if (selectedFeature) addLeafletLine(layers.selected, selectedFeature, { color: '#172d31', weight: 9, opacity: 0.9, interactive: false });
  }, [mapEngine, mapReady, activeFeatures, selectedLegId, replacementReview, activeVariant, mapMode]);

  useEffect(() => {
    if (mapEngine !== 'compat' || !mapReady || !leafletLayersRef.current) return;
    const layers = leafletLayersRef.current;
    layers.stops.clearLayers();
    leafletMarkersRef.current = new Map();
    if (mapMode === 'all') return;
    stopFeatures.features.forEach((feature) => {
      const { placeId, sequence, name, replacement } = feature.properties;
      const [longitude, latitude] = feature.geometry.coordinates;
      const marker = Leaflet.marker([latitude, longitude], {
        title: name,
        alt: `Stop ${sequence}: ${name}`,
        keyboard: true,
        riseOnHover: true,
        icon: Leaflet.divIcon({
          className: `atlas-stop-marker${replacement ? ' is-replacement' : ''}`,
          html: `<span>${sequence}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
      }).addTo(layers.stops);
      marker.on('click', () => focusHandlerRef.current(placeId));
      leafletMarkersRef.current.set(placeId, { marker, sequence, replacement });
    });
  }, [mapEngine, mapReady, stopFeatures, mapMode]);

  // Restyling the selected marker must never touch the route layers.
  useEffect(() => {
    if (mapEngine !== 'compat' || !mapReady || !leafletMarkersRef.current) return;
    leafletMarkersRef.current.forEach(({ marker, sequence, replacement }, placeId) => {
      const selected = placeId === selectedStopId;
      marker.setIcon(Leaflet.divIcon({
        className: `atlas-stop-marker${selected ? ' is-selected' : ''}${replacement ? ' is-replacement' : ''}`,
        html: `<span>${sequence}</span>`,
        iconSize: selected ? [42, 42] : [34, 34],
        iconAnchor: selected ? [21, 21] : [17, 17],
      }));
    });
  }, [mapEngine, mapReady, stopFeatures, selectedStopId]);

  useEffect(() => {
    if (mapEngine !== 'vector' || !mapReady) return;
    const map = mapRef.current;
    map?.setPaintProperty('route-context', 'line-color', mapMode === 'whole' ? ROUTE_COLOR : '#5f6b68');
    map?.setPaintProperty('route-context', 'line-width', mapMode === 'whole' ? 4.6 : 2.5);
    map?.setPaintProperty('route-context', 'line-opacity', mapMode === 'whole' ? 0.76 : 0.44);
    map?.setPaintProperty('route-context-casing', 'line-width', mapMode === 'whole' ? 9 : 7);
    map?.setPaintProperty('active-route-line', 'line-color', mapMode === 'whole' ? '#17383b' : ROUTE_COLOR);
    fitMap(mapMode);
  }, [mapEngine, mapReady, activeDay, activeVariant, mapMode, allRouteFeatures]);

  useEffect(() => {
    if (mapEngine !== 'compat' || !mapReady) return;
    fitMap(mapMode);
  }, [mapEngine, mapReady, activeDay, activeVariant, mapMode, allRouteFeatures]);

  useEffect(() => {
    if (!mapReady || !focusedPlace?.coordinates || !mapRef.current) return;
    const zoom = Math.max(mapRef.current.getZoom(), 8.4);
    if (mapEngine === 'compat') {
      const [longitude, latitude] = focusedPlace.coordinates;
      mapRef.current.flyTo([latitude, longitude], zoom, { animate: true, duration: 0.65 });
      return;
    }
    mapRef.current.easeTo({ center: focusedPlace.coordinates, zoom, duration: 650, offset: [-40, -40] });
  }, [focusedPlace?.id, mapEngine, mapReady]);

  // Mirrors how App resolves selectedLeg, so the banner numbers the leg the same
  // way the road deck below the map does.
  const selectedLegIndex = (activeVariant?.legs || day.drive.legs || []).findIndex((leg) => leg.id === selectedLegId);
  const mapDayMiles = activeVariant?.baseline_total_miles ?? day.drive.baseline_total_miles;
  const mapDayMinutes = activeVariant?.baseline_total_minutes ?? day.drive.baseline_total_minutes;

  return (
    <section className="map-canvas" aria-label={`Interactive ${ACTIVE.name} map`}>
      <div ref={containerRef} className={`maplibre-stage map-stage is-${mapEngine}`} />
      <div className="map-paper-wash" aria-hidden="true" />
      {!mapReady && (
        <div className="map-loading">
          <span className="map-loading-pulse" />
          <span>{mapEngine === 'compat' ? 'Starting the compatibility map…' : 'Loading the road map…'}</span>
          {mapLoadSlow && <button type="button" onClick={() => useCompatibilityMap('Compatibility map selected · fully interactive')}>Use compatibility map</button>}
        </div>
      )}
      {mapReady && allRoutesLoading && (
        <div className="map-loading is-inline" role="status">
          <span className="map-loading-pulse" />
          <span>Loading the route overview…</span>
        </div>
      )}
      {mapReady && selectedLeg ? (
        <div className="map-leg-banner" aria-live="polite">
          <span className="eyebrow">DRIVE {String(selectedLegIndex + 1).padStart(2, '0')} · {formatMiles(selectedLeg.distance_miles)} MI · {formatDuration(selectedLeg.baseline_minutes)}</span>
          <div className="map-leg-route">
            <span className="map-leg-end">
              <small>FROM</small>
              <strong>{nodeCity(selectedLeg.from)}</strong>
            </span>
            <Icon name="arrow" size={17} />
            <span className="map-leg-end">
              <small>TO</small>
              <strong>{nodeCity(selectedLeg.to)}</strong>
            </span>
          </div>
        </div>
      ) : mapReady && mapEngine === 'compat' && (
        <div className={`map-compat-status${mapNotice.includes('unavailable') ? ' is-warning' : ''}`}><Icon name={mapNotice.includes('unavailable') ? 'warning' : 'atlas'} size={12} />{mapNotice}</div>
      )}

      <div className="map-route-lockup">
        <span className="route-stamp">{ACTIVE.id.replace('route-', '')}</span>
        <div><span className="eyebrow">{routeData.route.route_type === 'premium-one-way' ? `BOSTON → ${routeData.route.endpoint_city.split(',')[0].toUpperCase()}` : 'BOSTON ROUND TRIP'} · 11 DAYS</span><h1>{ACTIVE.name.replace('The ', '')}</h1></div>
      </div>

      <button className="route-index-trigger" type="button" onClick={onIndexToggle} aria-expanded={routeIndexOpen}>
        <Icon name="layers" size={16} /><span>Routes</span><strong>{ROUTES.length}</strong>
      </button>

      <div className="map-mode-switch" aria-label="Map focus">
        <button type="button" className={mapMode === 'day' ? 'is-active' : ''} onClick={() => onMapModeChange('day')}>Day {String(activeDay).padStart(2, '0')}</button>
        <button type="button" className={mapMode === 'whole' ? 'is-active' : ''} onClick={() => onMapModeChange('whole')}>{routeData.route.route_type === 'premium-one-way' ? 'Whole route' : 'Whole loop'}</button>
        <button type="button" className={mapMode === 'all' ? 'is-active' : ''} onClick={onShowAllRoutes}>All routes</button>
      </div>

      <div className="map-controls" aria-label="Map controls">
        <button type="button" aria-label="Zoom in" onClick={() => changeZoom(1)}><Icon name="plus" size={16} /></button>
        <button type="button" aria-label="Zoom out" onClick={() => changeZoom(-1)}><Icon name="minus" size={16} /></button>
        <button type="button" aria-label="Recenter route" onClick={() => fitMap(mapMode)}><Icon name="expand" size={15} /></button>
      </div>

      {focusedPlace && <MapPlacePreview place={focusedPlace} onClose={() => onPlaceFocus(null)} onOpen={() => onPlaceOpen(focusedPlace.id)} />}

      <RoadDeck
        day={day}
        variant={activeVariant}
        selectedLeg={selectedLeg}
        selectedLegId={selectedLegId}
        miles={mapDayMiles}
        minutes={mapDayMinutes}
        onLegSelect={onLegSelect}
      />

      {mapMode === 'all' && (
        <div className="route-legend" aria-label="Route colours">
          <span className="eyebrow">ALL BUILT ROUTES</span>
          <ul>
            {routeLegend.map((entry) => (
              <li key={entry.id} className={entry.id === ACTIVE.id ? 'is-active' : ''}>
                <i style={{ background: entry.color }} aria-hidden="true" />
                <strong>{entry.name}</strong>
                <small>{formatMiles(entry.miles)} mi</small>
              </li>
            ))}
          </ul>
          <p>Each route keeps its own colour everywhere in the atlas.</p>
        </div>
      )}
      {routeIndexOpen && <RouteIndex onClose={onRouteIndexClose} onShowAll={onShowAllRoutes} />}
    </section>
  );
}

function MapPlacePreview({ place, onClose, onOpen }) {
  const image = bestImage(place);
  return (
    <article className="map-place-preview">
      {image && <RouteImage image={image} images={placeImages(place)} alt={image.alt || place.name} loading="lazy" rendition="thumb" />}
      <button className="preview-close" type="button" onClick={onClose} aria-label="Close stop preview"><Icon name="close" size={14} /></button>
      <div className="preview-body">
        <span className="eyebrow">MAP STOP · {place.city}, {place.state}</span>
        <h2>{place.name}</h2>
        <p>{place.why_go}</p>
        <button className="text-link" type="button" onClick={onOpen}>Open story + photos <Icon name="arrow" size={14} /></button>
      </div>
    </article>
  );
}

function RoadDeck({ day, variant, selectedLeg, selectedLegId, miles, minutes, onLegSelect }) {
  const legs = variant?.legs || day.drive.legs;
  return (
    <aside className="road-deck" aria-label={`Day ${day.day} driving legs`}>
      <div className="road-deck-summary">
        <span className="eyebrow">BED TO BED</span>
        <strong>{formatMiles(miles)} mi <em>·</em> {formatDuration(minutes)}</strong>
        <small>{variant ? 'Hidden-gem route active' : riskLabel(day.drive.traffic_risk)}</small>
      </div>
      <div className="road-leg-scroller">
        {legs.length ? legs.map((leg, index) => (
          <button className={`road-leg ${selectedLegId === leg.id ? 'is-active' : ''}`} type="button" key={leg.id} onClick={() => onLegSelect(leg.id)}>
            <span className="road-leg-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="road-leg-copy"><small>{shortNodeName(leg.from)} → {shortNodeName(leg.to)}</small><strong>{formatMiles(leg.distance_miles)} mi <em>·</em> {formatDuration(leg.baseline_minutes)}</strong>{leg.planning_minutes && <span>plan {leg.planning_minutes.low}—{leg.planning_minutes.high} min</span>}</span>
          </button>
        )) : <div className="parked-road-note"><Icon name="pin" size={17} /><span><strong>Cars stay parked.</strong><small>This chapter is built for walking and transit.</small></span></div>}
      </div>
      {selectedLeg && <button className="road-deck-dismiss" type="button" aria-label="Clear selected leg" onClick={() => onLegSelect(null)}><Icon name="close" size={13} /></button>}
    </aside>
  );
}

function RouteIndex({ onClose, onShowAll }) {
  return (
    <aside className="route-index-panel" aria-label="Route index">
      <div className="route-index-head"><div><span className="eyebrow">THE SHORTLIST</span><h2>Eleven possible stories.</h2></div><button type="button" onClick={onClose} aria-label="Close route index"><Icon name="close" size={18} /></button></div>
      <p>{ROUTES.length} routes are built and can be opened now. The rest are researched and waiting for the same visual build.</p>
      <button className="route-index-all" type="button" onClick={onShowAll}>
        <span className="all-routes-swatches" aria-hidden="true">{routeLegend.map((entry) => <i key={entry.id} style={{ background: entry.color }} />)}</span>
        <span><strong>All routes</strong><small>Every built loop on one map, each in its own colour</small></span>
        <Icon name="arrow" size={16} />
      </button>
      <div className="route-index-list">
        {manifest.routes.map((route, index) => {
          const isActive = route.id === ROUTE_ID;
          const isBuilt = ROUTE_BY_ID.has(route.id);
          return <button className={`route-index-row ${isActive ? 'is-active' : ''}`} type="button" key={route.id} onClick={() => (isActive ? onClose() : openRoute(route.id))} disabled={!isBuilt}>
            <span className="route-number" style={{ color: route.map_color }}>{String(index + 1).padStart(2, '0')}</span>
            <span><strong>{route.name.replace('The ', '')}</strong><small>Boston loop · {formatMiles(route.baseline_miles)} mi</small></span>
            <em>{isActive ? 'OPEN' : isBuilt ? 'VIEW' : 'STAGED'}</em>
          </button>;
        })}
      </div>
    </aside>
  );
}

function RouteStory({
  activeDay,
  day,
  activeStops,
  activeVariant,
  heroGallery,
  heroIndex,
  onHeroChange,
  onDayChange,
  onPlaceOpen,
  onPlaceFocus,
  focusedPlace,
  activeTraveler,
  ratings,
  onReplacementReview,
}) {
  const hero = heroGallery[heroIndex] || heroGallery[0];
  const origin = day.drive.legs[0] ? shortNodeName(day.drive.legs[0].from) : day.sleep_city;
  const driveMiles = activeVariant?.baseline_total_miles ?? day.drive.baseline_total_miles;
  const driveMinutes = activeVariant?.baseline_total_minutes ?? day.drive.baseline_total_minutes;
  const attractionTotal = routeAttractionTotal();

  useEffect(() => {
    if (heroIndex >= heroGallery.length) onHeroChange(0);
  }, [heroGallery.length, heroIndex, onHeroChange]);

  function moveHero(direction) {
    if (!heroGallery.length) return;
    onHeroChange((heroIndex + direction + heroGallery.length) % heroGallery.length);
  }

  return (
    <div className="story-scroll">
      <ChapterStrip activeDay={activeDay} onDayChange={onDayChange} />

      <section className="day-hero" aria-labelledby="day-title">
        {hero && (
          <button className="day-hero-image" type="button" key={hero.image.id} onClick={() => onPlaceOpen(hero.place.id)} aria-label={`Open ${hero.place.name} gallery`}>
            <RouteImage image={hero.image} images={placeImages(hero.place)} alt={hero.image.alt || hero.place.name} loading="eager" fetchPriority="high" />
          </button>
        )}
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy">
          <div className="hero-kicker"><span>DAY {String(day.day).padStart(2, '0')}</span><span>{weekday(day.date, true)} · {dateCode(day.date)}</span></div>
          <h2 id="day-title">{day.theme}</h2>
          <div className="hero-route"><span>{origin}</span><Icon name="arrow" size={15} /><strong>{day.sleep_city}</strong></div>
        </div>
        {heroGallery.length > 1 && <div className="hero-controls"><button type="button" onClick={() => moveHero(-1)} aria-label="Previous day photo"><Icon name="chevron" size={18} /></button><span>{String(heroIndex + 1).padStart(2, '0')} / {String(heroGallery.length).padStart(2, '0')}</span><button type="button" onClick={() => moveHero(1)} aria-label="Next day photo"><Icon name="chevron" size={18} /></button></div>}
        {hero && <button className="hero-caption" type="button" onClick={() => onPlaceOpen(hero.place.id)}><Icon name="camera" size={13} /><span>{hero.place.name}</span><small>Open gallery</small></button>}
      </section>

      <section className="day-facts" aria-label="Day facts">
        <Fact icon="car" label={day.drive.baseline_total_minutes ? 'Road baseline' : 'City day'} value={day.drive.baseline_total_minutes ? `${formatMiles(driveMiles)} mi · ${formatDuration(driveMinutes)}` : 'Walk + transit'} note={activeVariant ? 'detour selected' : 'no live traffic'} />
        <Fact icon="clock" label="Planning gate" value={day.drive.planning_total_minutes ? `${day.drive.planning_total_minutes.low}—${day.drive.planning_total_minutes.high} min` : 'Cars parked'} note={riskLabel(day.drive.traffic_risk)} />
        <Fact icon="cloud" label="Expected weather" value={`${day.weather.high_c.toFixed(1)}° / ${day.weather.low_c.toFixed(1)}°C`} note={`${Math.round(day.weather.precipitation_probability_percent)}% rain · historical normal`} />
        <Fact
          icon="ticket"
          label="Loop attractions"
          value={attractionTotal.label}
          note={attractionTotal.note}
          emphasis={attractionTotal.ready}
        />
      </section>

      <section className="day-story">
        <div className="day-story-head">
          <div><span className="eyebrow">THE STOPS · CHOSEN BY HAND</span><h3>Why this day is worth the drive.</h3></div>
          <p>{day.notes?.[0] || 'Times are planning anchors, not a promise against traffic or weather.'}</p>
        </div>
        <div className="stop-story-list">
          {activeStops.map((stop) => (
            <StopStoryCard
              key={stop.place.id}
              stop={stop}
              rating={ratings[`${activeTraveler}:${stop.place.id}`]}
              onOpen={() => onPlaceOpen(stop.place.id)}
              onLocate={() => onPlaceFocus(stop.place.id)}
              isLocated={focusedPlace?.id === stop.place.id}
            />
          ))}
        </div>

        <DayOptionsSection
          day={day}
          activeVariant={activeVariant}
          activeTraveler={activeTraveler}
          ratings={ratings}
          focusedPlace={focusedPlace}
          onPlaceOpen={onPlaceOpen}
          onPlaceFocus={onPlaceFocus}
          onReplacementReview={onReplacementReview}
        />

        <div className="practical-grid">
          <LodgingCard lodging={day.lodging} city={day.sleep_city} />
          <FallbackCard text={day.fallback} />
        </div>

      </section>
    </div>
  );
}

function DayOptionsSection({ day, activeVariant, activeTraveler, ratings, focusedPlace, onPlaceOpen, onPlaceFocus, onReplacementReview }) {
  const options = dayOptionRecords(day);

  if (!options.length) return null;

  return (
    <section className="day-options" aria-labelledby={`day-${day.day}-options-title`}>
      <div className="day-options-head">
        <div>
          <span className="eyebrow">FLEX FILE · {options.length} {options.length === 1 ? 'CHOICE' : 'CHOICES'} OUTSIDE THE BASELINE</span>
          <h3 id={`day-${day.day}-options-title`}>Possible, with conditions.</h3>
        </div>
        <p>These choices stay attached to Day {day.day} and remain fully rateable. Archived revision history stays out of this live decision file.</p>
      </div>
      <div className="day-option-list">
        {options.map((option) => (
          <DayOptionCard
            key={option.place_id}
            option={option}
            rating={ratings[`${activeTraveler}:${option.place_id}`]}
            onOpen={() => onPlaceOpen(option.place_id)}
            onLocate={() => onPlaceFocus(option.place_id)}
            isLocated={focusedPlace?.id === option.place_id}
            isActive={activeVariant?.replacement_place_id === option.place_id}
            onCompare={option.replacement_variant ? () => onReplacementReview(option.replacement_variant) : null}
          />
        ))}
      </div>
    </section>
  );
}

function DayOptionCard({ option, rating, onOpen, onLocate, isLocated, isActive, onCompare }) {
  const { place } = option;
  const image = bestImage(place);
  const priceLabel = placePriceCardLabel(place);
  const replacementNames = (option.replaces_place_ids || [])
    .map((id) => placeById.get(id)?.name)
    .filter(Boolean);
  const isSwap = option.status === 'safe-as-swap-only' || option.status === 'route-safe-swap';
  const hasUsedMinutes = Number.isFinite(option.baseline_total_minutes_if_used);
  const hasAddedMinutes = Number.isFinite(option.baseline_total_minutes_if_added);
  const hasOverage = Number.isFinite(option.over_cap_minutes);
  const statusLabel = {
    'safe-as-swap-only': 'SWAP ONLY · ROUTE-SAFE',
    'route-safe-swap': 'ROUTED SWAP · WITHIN LIMIT',
    'over-standard-cap': 'OVER THE STANDARD CAP',
    'over-authorized-cap': 'ROUTE REDESIGN REQUIRED',
    'documented-flex': 'FLEX · LIVE ETA CHECK',
    'documented-optional': 'OPTIONAL · OUTSIDE BASELINE',
    'documented-alternative': 'ALTERNATIVE · OUTSIDE BASELINE',
  }[option.status] || 'CONDITIONAL OPTION';

  return (
    <article className={`day-option-card option-${option.status} ${isLocated ? 'is-located' : ''} ${isActive ? 'is-active' : ''}`}>
      <button className="day-option-image" type="button" onClick={onOpen} aria-label={`Open ${place.name} gallery and ratings`}>
        {image && <RouteImage image={image} images={placeImages(place)} alt={image.alt || place.name} loading="lazy" rendition="thumb" />}
        <span><Icon name="gallery" size={13} /> {placeImages(place).length} photos</span>
      </button>
      <div className="day-option-copy">
        <div className="day-option-status"><Icon name={isSwap ? 'repeat' : hasOverage ? 'warning' : 'route'} size={14} /> {isActive ? 'ACTIVE · ' : ''}{statusLabel}</div>
        <button className="day-option-title" type="button" onClick={onOpen}><h4>{place.name}</h4><Icon name="arrow" size={16} /></button>
        <p>{option.note}</p>
        {replacementNames.length > 0 && <div className="day-option-swap"><span>USE INSTEAD OF</span><strong>{replacementNames.join(' + ')}</strong></div>}
        <div className="day-option-metrics" aria-label="Driving impact">
          {hasUsedMinutes && hasAddedMinutes ? (
            <>
              <span><small>AS THE SWAP</small><strong>{option.baseline_total_minutes_if_used} min</strong></span>
              <span><small>IF ADDED</small><strong>{option.baseline_total_minutes_if_added} min</strong></span>
              <span><small>DAY LIMIT</small><strong>{option.cap_minutes} min</strong></span>
            </>
          ) : hasUsedMinutes ? (
            <>
              <span><small>AS THE SWAP</small><strong>{option.baseline_total_minutes_if_used} min</strong></span>
              <span><small>BASE ROUTE</small><strong>{option.current_baseline_total_minutes} min</strong></span>
              <span><small>DAY LIMIT</small><strong>{option.cap_minutes} min</strong></span>
            </>
          ) : hasAddedMinutes ? (
            <>
              <span><small>BASE ROUTE</small><strong>{option.current_baseline_total_minutes} min</strong></span>
              <span><small>WITH OPTION</small><strong>{option.baseline_total_minutes_if_added} min</strong></span>
              <span><small>OVER LIMIT</small><strong>+{option.over_cap_minutes} min</strong></span>
            </>
          ) : (
            <>
              <span><small>BASE ROUTE</small><strong>{option.current_baseline_total_minutes || 'Parked'}{option.current_baseline_total_minutes ? ' min' : ''}</strong></span>
              <span><small>DAY LIMIT</small><strong>{option.cap_minutes} min</strong></span>
              <span><small>FILED AS</small><strong>{option.option_type}</strong></span>
            </>
          )}
        </div>
        <div className="day-option-actions">
          {onCompare && <button className="button button-primary" type="button" onClick={onCompare}>{isActive ? 'Review active swap' : 'Compare this swap'} <Icon name="repeat" size={14} /></button>}
          <button className={`button ${onCompare ? 'button-quiet' : 'button-primary'}`} type="button" onClick={onOpen}>Gallery + rate <Icon name="arrow" size={14} /></button>
          {priceLabel && <span className="day-option-price"><Icon name="ticket" size={12} /> {priceLabel}</span>}
          <span className={rating ? 'has-rating' : ''}>★ {rating ? `${rating}/5 yours` : 'Not rated yet'}</span>
          <button className="locate-stop" type="button" onClick={onLocate} aria-pressed={isLocated}><Icon name="pin" size={12} /> {isLocated ? 'On map' : 'Show on map'}</button>
        </div>
      </div>
    </article>
  );
}

function ChapterStrip({ activeDay, onDayChange }) {
  return (
    <div className="chapter-strip-wrap">
      <div className="chapter-strip-head"><span>THE 11-DAY CUT</span><span>Click a chapter · map + story move together</span></div>
      <div className="chapter-strip" role="tablist" aria-label="Route days">
        {routeData.days.map((day) => {
          const place = placeById.get(day.schedule.find((item) => item.priority === 'anchor')?.place_id || day.schedule[0]?.place_id);
          const image = bestImage(place);
          return (
            <button key={day.day} type="button" role="tab" aria-selected={day.day === activeDay} className={`chapter-tab ${day.day === activeDay ? 'is-active' : ''}`} onClick={() => onDayChange(day.day)}>
              {image && <RouteImage image={image} images={placeImages(place)} alt="" loading="lazy" rendition="thumb" />}
              <span className="chapter-tab-shade" />
              <span className="chapter-tab-copy"><strong>{String(day.day).padStart(2, '0')}</strong><small>{weekday(day.date)}</small></span>
              <span className={`risk-pin risk-${day.drive.traffic_risk}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Fact({ icon, label, value, note, emphasis = false }) {
  return <div className={`fact ${emphasis ? 'is-emphasis' : ''}`}><span className="fact-icon"><Icon name={icon} size={17} /></span><span><small>{label}</small><strong>{value}</strong><em>{note}</em></span></div>;
}

function StopStoryCard({ stop, rating, onOpen, onLocate, isLocated }) {
  const { place, start, end, priority, reservation, sequence, isReplacement } = stop;
  const image = bestImage(place);
  const imageCount = placeImages(place).length;
  const priceLabel = placePriceCardLabel(place);
  return (
    <article className={`stop-story-card ${priority === 'anchor' ? 'is-anchor' : ''} ${isLocated ? 'is-located' : ''}`}>
      <button className="stop-story-image" type="button" onClick={onOpen}>
        {image && <RouteImage image={image} images={placeImages(place)} alt={image.alt || place.name} loading="lazy" rendition="thumb" />}
        <span className="photo-count"><Icon name="gallery" size={13} /> {imageCount} photos</span>
        <span className="stop-sequence">{String(sequence).padStart(2, '0')}</span>
      </button>
      <div className="stop-story-copy">
        <div className="stop-meta"><span className={`priority priority-${priority}`}>{isReplacement ? 'swap stop' : priority}</span><span>{start}—{end}</span><span>{place.city}, {place.state}</span></div>
        <button className="stop-title" type="button" onClick={onOpen}><h4>{place.name}</h4><Icon name="arrow" size={16} /></button>
        <p>{place.summary}</p>
        <blockquote>{place.why_go}</blockquote>
        <div className="stop-card-foot">
          <span><Icon name="clock" size={13} /> {place.duration_minutes} min</span>
          {priceLabel && <span className="spot-price"><Icon name="ticket" size={13} /> {priceLabel}</span>}
          <span><Icon name="calendar" size={13} /> {reservation === 'none' ? 'No reservation' : 'Check booking'}</span>
          <span className={rating ? 'has-rating' : ''}>★ {rating ? `${rating}/5 yours` : 'Not rated'}</span>
          <button className="locate-stop" type="button" onClick={onLocate} aria-pressed={isLocated}><Icon name="pin" size={12} /> {isLocated ? 'On map' : 'Show on map'}</button>
        </div>
      </div>
    </article>
  );
}

function LodgingCard({ lodging, city }) {
  return <article className="lodging-card"><div className="card-kicker"><Icon name="bed" size={15} /> SLEEP CHAPTER · {city}</div><h4>{lodging.preferred_area}</h4><p>{lodging.notes}</p><div className="lodging-meta"><span>Fallback area</span><strong>{lodging.fallback_area}</strong><span>Room shape</span><strong>{lodging.room_setup}</strong></div><small>Strong suggestion · verify availability manually</small></article>;
}

function FallbackCard({ text }) {
  return <article className="fallback-card"><div className="card-kicker"><Icon name="warning" size={15} /> IF THE DAY SLIPS</div><h4>Protect the mood, not the checklist.</h4><p>{text}</p><small>The fallback is already part of the route logic.</small></article>;
}

function ReplacementCard({ variant, active, onReview, onRestore, onPlaceOpen }) {
  const place = placeById.get(variant.replacement_place_id);
  const image = bestImage(place);
  return (
    <article className={`replacement-card ${active ? 'is-active' : ''}`}>
      <button className="replacement-image" type="button" onClick={() => onPlaceOpen(place.id)}>{image && <RouteImage image={image} images={placeImages(place)} alt={image.alt || place.name} loading="lazy" rendition="thumb" />}<span>{active ? 'ACTIVE DETOUR' : 'HIDDEN-GEM ALTERNATIVE'}</span></button>
      <div className="replacement-copy"><div className="card-kicker"><Icon name={active ? 'check' : 'repeat'} size={15} /> {active ? 'THIS SWAP IS ON' : 'YOU CAN SWAP THIS DAY'}</div><h3>{place.name}</h3><p>{place.why_go}</p><div className="replacement-delta"><span>{Number(variant.delta_miles) > 0 ? '+' : ''}{Number(variant.delta_miles).toFixed(1)} mi</span><span>{Number(variant.delta_minutes) > 0 ? '+' : ''}{variant.delta_minutes} min</span><span>{variant.cap_status === 'passes-baseline-cap' ? 'inside the limit' : 'check the limit'}</span></div><div className="replacement-actions"><button className="button button-primary" type="button" onClick={onReview}>{active ? 'Review this swap' : 'Compare on the map'} <Icon name="arrow" size={14} /></button>{active && <button className="button button-quiet" type="button" onClick={onRestore}>Restore original</button>}</div></div>
    </article>
  );
}

function ReplacementReview({ variant, active, onClose, onAccept, onRestore, onPlaceOpen }) {
  const place = placeById.get(variant.replacement_place_id);
  const image = bestImage(place);
  const originals = (variant.replaces_place_ids || []).map((id) => placeById.get(id)).filter(Boolean);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="replacement-review" role="dialog" aria-modal="true" aria-labelledby="replacement-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close detour comparison"><Icon name="close" size={18} /></button>
        <div className="replacement-review-visual">{image && <RouteImage image={image} images={placeImages(place)} alt={image.alt || place.name} loading="eager" />}<div><span>THE DETOUR</span><strong>{formatMiles(variant.baseline_total_miles)} mi · {formatDuration(variant.baseline_total_minutes)}</strong><small>Dashed gold line is previewed on the map behind this card.</small></div></div>
        <div className="replacement-review-copy">
          <span className="eyebrow">DAY {String(variant.day).padStart(2, '0')} · AN ACTUAL SWAP</span>
          <h2 id="replacement-title">Trade {originals.map((item) => item.name).join(' + ')} for <em>{place.name}</em>.</h2>
          <p>{place.summary}</p>
          <div className="swap-grid"><div><small>ORIGINAL ANCHOR{originals.length > 1 ? 'S' : ''}</small>{originals.map((item) => <strong key={item.id}>{item.name}</strong>)}</div><Icon name="repeat" size={21} /><div><small>HIDDEN GEM</small><strong>{place.name}</strong></div></div>
          <div className="delta-grid"><span><small>Distance change</small><strong>{variant.delta_miles > 0 ? '+' : ''}{variant.delta_miles.toFixed(1)} mi</strong></span><span><small>Time change</small><strong>{variant.delta_minutes > 0 ? '+' : ''}{variant.delta_minutes} min</strong></span><span><small>Driving rule</small><strong>{variant.cap_status === 'passes-baseline-cap' ? 'Passes' : 'Review'}</strong></span></div>
          <button className="text-link" type="button" onClick={() => onPlaceOpen(place.id)}>See the full place gallery <Icon name="arrow" size={14} /></button>
          <div className="modal-actions">{active ? <><button className="button button-primary" type="button" onClick={onClose}>Keep this detour</button><button className="button button-quiet" type="button" onClick={onRestore}>Restore original day</button></> : <><button className="button button-primary" type="button" onClick={onAccept}>Use this detour</button><button className="button button-quiet" type="button" onClick={onClose}>Keep original day</button></>}</div>
        </div>
      </section>
    </div>
  );
}

function PlaceGallery({ place, activeTraveler, ratings, imageIndex, onImageChange, onClose, onRate }) {
  const images = placeImages(place);
  const image = images[imageIndex] || images[0];
  const price = ENERGIZED_PRICING_ROUTE_IDS.has(ACTIVE.id) ? placePrice(place).label : 'Pending rebuild';
  const groupScores = TRAVELERS.map((item) => ratings[`${item.id}:${place.id}`]).filter(Boolean);
  const groupAverage = groupScores.length ? groupScores.reduce((sum, score) => sum + score, 0) / groupScores.length : null;

  function move(direction) {
    if (!images.length) return;
    onImageChange((imageIndex + direction + images.length) % images.length);
  }

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <section className="place-gallery" role="dialog" aria-modal="true" aria-labelledby="place-title">
      <button className="gallery-close" type="button" onClick={onClose} aria-label="Close place gallery"><Icon name="close" size={19} /><span>Close</span></button>
      <div className="gallery-stage">
        {image && <RouteImage key={image.id} image={image} images={images} alt={image.alt || place.name} loading="eager" fetchPriority="high" />}
        <div className="gallery-stage-shade" />
        {images.length > 1 && <><button className="gallery-arrow gallery-arrow-prev" type="button" onClick={() => move(-1)} aria-label="Previous photo"><Icon name="chevron" size={24} /></button><button className="gallery-arrow gallery-arrow-next" type="button" onClick={() => move(1)} aria-label="Next photo"><Icon name="chevron" size={24} /></button></>}
        <div className="gallery-caption"><span><Icon name="camera" size={14} /> {image?.coverage === 'exact-place' ? 'Exact-place image' : 'Local context image'}</span><strong>{String(imageIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</strong></div>
        <div className="gallery-thumbs">{images.map((item, index) => <button key={item.id} type="button" className={index === imageIndex ? 'is-active' : ''} onClick={() => onImageChange(index)} aria-label={`Show photo ${index + 1}`}><RouteImage image={item} alt="" loading="lazy" rendition="thumb" /></button>)}</div>
      </div>
      <aside className="gallery-note">
        <div className="gallery-note-scroll">
          <span className="eyebrow">PLACE {place.visit_date ? `· ${dateCode(place.visit_date)}` : ''}</span>
          <div className="place-location"><Icon name="pin" size={14} /> {place.city}, {place.state}</div>
          <h2 id="place-title">{place.name}</h2>
          <p className="place-deck">{place.summary}</p>
          <div className="why-go"><span>WHY WE GO HERE</span><p>{place.why_go}</p></div>
          <div className="place-quick-facts"><span><Icon name="clock" size={15} /><small>Time here</small><strong>{place.duration_minutes} min</strong></span><span><Icon name="ticket" size={15} /><small>Price / person</small><strong>{price}</strong></span><span><Icon name="calendar" size={15} /><small>Hours</small><strong>{place.hours?.opens && place.hours?.closes ? `${place.hours.opens}—${place.hours.closes}` : 'Verify'}</strong></span></div>
          <div className="fit-note"><span>BEST FOR</span><p>{place.best_fit_note}</p><div className="fit-people">{TRAVELERS.map((person) => <span key={person.id} className={(place.best_for || []).includes(person.id) ? 'is-primary' : ''} style={{ '--person-color': person.color }}>{person.short}<small>{person.name}</small></span>)}</div></div>
          <div className="place-rating">
            <div className="place-rating-head"><span className="eyebrow">RATINGS</span><p>Everyone counts the same. All four of you can rate here, with no need to change the person at the top.</p></div>
            {TRAVELERS.map((person) => (
              <div className={`rating-line ${person.id === activeTraveler ? 'is-active' : ''}`} key={person.id}>
                <span className="rating-person" style={{ '--person-color': person.color }}><em>{person.short}</em>{person.name}</span>
                <StarRating rating={ratings[`${person.id}:${place.id}`]} onRate={(score) => onRate(score, person.id)} label={person.name} />
              </div>
            ))}
          </div>
          <div className="group-score"><span>GROUP AVERAGE</span><strong>{groupAverage ? groupAverage.toFixed(1) : '—'} <small>/ 5 · {groupScores.length}/4 voted</small></strong></div>
          <div className="place-source"><span>IMAGE SOURCE + RIGHTS</span><small>{image?.creator || 'Creator recorded in dataset'} · {image?.license || 'License recorded'} · {image?.production_usable ? 'production-usable metadata recorded' : 'permission needed before public launch'}</small>{image?.source_page && <a href={image.source_page} target="_blank" rel="noreferrer">Open source page <Icon name="external" size={12} /></a>}</div>
        </div>
      </aside>
    </section>
  );
}

function StarRating({ rating, onRate, label }) {
  return <div className="star-rating" role="group" aria-label={label ? `${label}: five star rating` : 'Five star rating'}><div>{[1, 2, 3, 4, 5].map((score) => <button key={score} type="button" className={rating >= score ? 'is-on' : ''} onClick={() => onRate(score)} aria-label={label ? `${label}: ${score} out of 5 stars` : `${score} out of 5 stars`} aria-pressed={rating === score}>★</button>)}</div><span>{rating ? rating.toFixed(1) : '—'}</span>{rating ? <button className="clear-rating" type="button" onClick={() => onRate(null)} aria-label={label ? `Clear ${label}'s rating` : 'Clear rating'}>clear</button> : null}</div>;
}

function RatingStudio({ activeTraveler, ratings, onPlaceOpen }) {
  const traveler = TRAVELERS.find((person) => person.id === activeTraveler);
  const places = placesData.places;
  const completed = places.filter((place) => ratings[`${activeTraveler}:${place.id}`]).length;
  const sorted = [...places].sort((a, b) => Number(Boolean(ratings[`${activeTraveler}:${a.id}`])) - Number(Boolean(ratings[`${activeTraveler}:${b.id}`])));
  return (
    <div className="secondary-view story-scroll">
      <div className="secondary-head"><span className="eyebrow">RATING STUDIO · ALL {places.length} STOPS</span><h1>{traveler.name}'s private cut.</h1><p>Every rateable place lives in one queue. The score stays blank until someone actually chooses it.</p></div>
      <div className="rating-progress"><div><span>Progress</span><strong>{completed}<small> / {places.length}</small></strong></div><div className="progress-track"><span style={{ width: `${(completed / places.length) * 100}%` }} /></div></div>
      <div className="rating-queue">{sorted.map((place) => { const image = bestImage(place); const score = ratings[`${activeTraveler}:${place.id}`]; return <button className="rating-row" type="button" key={place.id} onClick={() => onPlaceOpen(place.id)}>{image && <RouteImage image={image} images={placeImages(place)} alt="" loading="lazy" rendition="thumb" />}<span><small>{place.city}, {place.state} · {place.kind.replaceAll('-', ' ')}</small><strong>{place.name}</strong></span><em className={score ? 'is-rated' : ''}>{score ? `${score}/5` : 'Rate'} <Icon name="chevron" size={14} /></em></button>; })}</div>
    </div>
  );
}

function CompareView({ routes, onBack }) {
  return (
    <div className="secondary-view story-scroll">
      <div className="secondary-head"><span className="eyebrow">COMPARISON FRAME · {ROUTES.length} ROUTES BUILT</span><h1>Compare the road, not the brochure.</h1><p>Each built route shows the same facts: days, miles, driving time and expected weather. Open one to explore and rate it.</p></div>
      {!routes && <div className="comparison-loading" role="status"><span className="map-loading-pulse" />Loading route evidence…</div>}
      {(routes || []).map((entry) => {
        const driveMinutes = entry.route.days.reduce((sum, day) => sum + (day.drive.baseline_total_minutes || 0), 0);
        const high = Math.max(...entry.route.days.map((day) => day.weather?.high_c || 0));
        const low = Math.min(...entry.route.days.map((day) => day.weather?.low_c || 0));
        const isActive = entry.id === ACTIVE.id;
        return (
          <div className={`compare-card ${isActive ? 'is-active' : ''}`} key={entry.id}>
            <span className="route-stamp" style={{ color: entry.color }}>{entry.id.replace('route-', '')}</span>
            <div>
              <span className="eyebrow">{isActive ? 'OPEN NOW' : 'BUILT · READY TO OPEN'}</span>
              <h2>{entry.name}</h2>
              <p>{entry.route.route.summary}</p>
              {!isActive && <button className="button button-quiet" type="button" onClick={() => openRoute(entry.id)}>Open this route <Icon name="arrow" size={14} /></button>}
            </div>
            <div className="compare-metrics"><span><small>Journey</small><strong>{entry.route.days.length} days</strong></span><span><small>Road</small><strong>{formatMiles(entry.route.route.baseline_total_miles)} mi</strong></span><span><small>Drive time</small><strong>{formatDuration(driveMinutes)}</strong></span><span><small>Climate normal</small><strong>{Math.round(low)}—{Math.round(high)}°C</strong></span></div>
          </div>
        );
      })}
      <div className="staged-routes"><span>THE REST</span><p>Researched and waiting for the same visual build.</p><button className="button button-primary" type="button" onClick={onBack}>Back to the atlas <Icon name="arrow" size={14} /></button></div>
    </div>
  );
}

function MagicView({ activeTraveler, ratings, onBack }) {
  const [routes, setRoutes] = useState(null);
  const [ratingRows, setRatingRows] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [generatedRoute, setGeneratedRoute] = useState(null);
  const requestId = useRef(0);
  const currentTraveler = TRAVELERS.find((traveler) => traveler.id === activeTraveler);
  const currentCompleted = placesData.places.filter((place) => ratings[`${activeTraveler}:${place.id}`]).length;
  const assessment = useMemo(
    () => (routes && ratingRows ? assessAtlasGrading(routes, ratingRows) : null),
    [routes, ratingRows],
  );
  const rankedRoutes = useMemo(() => [...(assessment?.route_scores || [])]
    .filter((route) => route.group_average != null)
    .sort((a, b) => (
      b.group_average - a.group_average
      || b.fairness_floor - a.fairness_floor
      || b.coverage_percent - a.coverage_percent
      || a.baseline_miles - b.baseline_miles
    )), [assessment]);

  async function refreshRatings() {
    const activeRequest = requestId.current + 1;
    requestId.current = activeRequest;
    setLoadError('');
    setGenerationError('');
    setGeneratedRoute(null);
    try {
      const [loadedRoutes, loadedRatings] = await Promise.all([loadAllRoutes(), loadAllRatings()]);
      if (requestId.current !== activeRequest) return;
      setRoutes(loadedRoutes);
      setRatingRows(loadedRatings);
    } catch (error) {
      if (requestId.current === activeRequest) setLoadError(error.message || 'The grading board could not be loaded.');
    }
  }

  useEffect(() => {
    refreshRatings();
    return () => {
      requestId.current += 1;
    };
  }, []);

  async function buildBestOfRoute() {
    if (!assessment?.winner || !routes || !ratingRows) return;
    setGenerating(true);
    setGenerationError('');
    setGeneratedRoute(null);
    try {
      setGeneratedRoute(await generateBestOfRoute({ routes, ratingRows }));
    } catch (error) {
      setGenerationError(error.message || 'The best-of route could not be generated.');
    } finally {
      setGenerating(false);
    }
  }

  function downloadGeneratedRoute() {
    if (!generatedRoute) return;
    const blob = new Blob([`${JSON.stringify(generatedRoute, null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'best-of-atlas-generated-route.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  const progress = assessment?.completion_percent || 0;
  return (
    <div className="secondary-view story-scroll">
      <div className="secondary-head"><span className="eyebrow"><Icon name="sparkle" size={13} /> MAGIC · TRANSPARENT, NOT MYSTERIOUS</span><h1>Build the route whenever the group is ready.</h1><p>Traveler ratings take priority. Any skipped score falls back to the researched traveler-fit data already attached to that place, so ungraded spots remain eligible and the route can be generated manually at any point.</p></div>

      {!ratingSyncConfigured && <div className="magic-alert" role="alert"><strong>Cloud grading is not configured in this build.</strong><span>Manual generation still works from curated fit scores. Add the two public Supabase variables to include shared traveler ratings.</span></div>}
      {loadError && <div className="magic-alert is-error" role="alert"><strong>The grading board could not load.</strong><span>{loadError}</span><button className="button button-quiet" type="button" onClick={refreshRatings}>Try again</button></div>}

      <div className="magic-card">
        <div className="magic-dial" style={{ '--progress': `${progress * 3.6}deg` }}><span><strong>{assessment ? `${progress}%` : '…'}</strong><small>Atlas graded</small></span></div>
        <div>
          <span className="eyebrow">ALL ROUTES · ALL FOUR TRAVELERS</span>
          <h2>{assessment ? `${assessment.completed_ratings.toLocaleString()} of ${assessment.required_ratings.toLocaleString()} ratings are complete.` : 'Loading the shared grading board…'}</h2>
          <p>{assessment?.complete ? 'Every candidate is traveler-scored; no curated fallback is needed.' : `${assessment?.missing_ratings.toLocaleString() || '—'} scores are skipped or still open and will use curated fit values. ${currentTraveler.name} has rated ${currentCompleted} of ${placesData.places.length} places on the open route.`}</p>
          <div className="magic-actions">
            <button className="button button-primary" type="button" disabled={!assessment?.winner || generating} onClick={buildBestOfRoute}>{generating ? 'Routing the best spots…' : 'Generate route now'} <Icon name="sparkle" size={14} /></button>
            <button className="button button-quiet" type="button" onClick={refreshRatings} disabled={generating}>Refresh grading</button>
            <button className="button button-quiet" type="button" onClick={onBack}>Keep exploring <Icon name="arrow" size={14} /></button>
          </div>
        </div>
      </div>

      {assessment?.winner && (
        <section className="magic-winner" aria-labelledby="winner-title">
          <span className="eyebrow">{assessment.complete ? 'CURRENT WINNER' : 'PROVISIONAL WINNER · MANUAL GENERATION READY'}</span>
          <h2 id="winner-title">{assessment.winner.name}</h2>
          <p><strong>{assessment.winner.group_average.toFixed(2)} / 5</strong> effective group score · <strong>{assessment.winner.coverage_percent}%</strong> traveler-rated. Missing scores use curated fit; equal traveler weight, fairness and shorter mileage break ties.</p>
          <div className="magic-ranking">{rankedRoutes.map((route, index) => <div key={route.id} className={index === 0 ? 'is-winner' : ''}><span>{String(index + 1).padStart(2, '0')}</span><strong>{route.name}</strong><em>{route.group_average.toFixed(2)} · {route.coverage_percent}%</em></div>)}</div>
        </section>
      )}

      {generationError && <div className="magic-alert is-error" role="alert"><strong>No valid draft was produced.</strong><span>{generationError}</span><span>No driving rule was relaxed.</span></div>}

      {generatedRoute && (
        <section className="magic-result" aria-labelledby="generated-title">
          <span className="eyebrow">GENERATED · ROAD-CHECKED DRAFT</span>
          <h2 id="generated-title">{generatedRoute.route.name}</h2>
          <p>{generatedRoute.selection.selected_unique_spot_count} highest-ranked places fit, including skipped spots evaluated with curated fit data. {generatedRoute.selection.excluded_top_spots.length} other leading candidates were left out because they could not fit their researched date, operating window, or the driving cap.</p>
          <div className="magic-result-metrics"><span><small>Winner backbone</small><strong>{generatedRoute.route.based_on_winning_route_id.replace('route-', 'Route ')}</strong></span><span><small>Road baseline cap</small><strong>{generatedRoute.constraints.daily_drive_hard_cap_minutes} min/day</strong></span><span><small>Traffic planning model</small><strong>{generatedRoute.constraints.traffic_buffer_multiplier.toFixed(1)}× baseline</strong></span></div>
          <div className="magic-days">{generatedRoute.days.map((day) => <article key={day.date}><div><span>DAY {String(day.day).padStart(2, '0')} · {day.date}</span><strong>{day.sleep_city || 'Road night'}</strong><small>{day.drive.baseline_total_miles} mi · {day.drive.baseline_total_minutes} min baseline · {day.drive.planning_total_minutes.high} min buffered</small></div><ol>{day.schedule.length ? day.schedule.map((stop) => <li key={`${stop.source_route_id}:${stop.place_id}`}><strong>{stop.name}</strong><span>{stop.start}–{stop.end} · {stop.group_average.toFixed(2)}/5 · {stop.graded_traveler_count}/4 graded</span></li>) : <li className="is-empty">Transit / recovery day</li>}</ol></article>)}</div>
          <div className="magic-actions"><button className="button button-primary" type="button" onClick={downloadGeneratedRoute}>Download route JSON <Icon name="arrow" size={14} /></button><button className="button button-quiet" type="button" onClick={buildBestOfRoute}>Generate again</button></div>
          <p className="magic-caveat">OSRM supplies baseline road times, not live traffic. The draft still marks reservations, hours, weather, lodging, parking and day-of travel ETAs for final confirmation.</p>
        </section>
      )}
    </div>
  );
}

function MethodNote({ onClose }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="method-note" role="dialog" aria-modal="true" aria-labelledby="method-title"><button className="modal-close" type="button" onClick={onClose} aria-label="Close methodology"><Icon name="close" size={18} /></button><span className="eyebrow">HOW TO READ THIS PROTOTYPE</span><h2 id="method-title">Useful precision, without pretending it is live.</h2><div><article><strong>Road time</strong><p>Baselines come from routed road geometry. Planning ranges add judgment for traffic-sensitive legs; they are not live traffic.</p></article><article><strong>Weather</strong><p>Daily Celsius values are historical normals until a real forecast is available inside the ten-day window.</p></article><article><strong>Images</strong><p>Each local image has source and rights metadata. Non-production images are explicitly labeled before a public launch.</p></article><article><strong>Detours</strong><p>Hidden gems replace scheduled anchors. They never quietly inflate the day or hide a driving-rule breach.</p></article></div><button className="button button-primary" type="button" onClick={onClose}>Back to the atlas</button></section></div>;
}

const appRoot = window.__detourAtlasRoot || createRoot(document.getElementById('root'));
window.__detourAtlasRoot = appRoot;
appRoot.render(<main className="error-shell"><span className="eyebrow">OPENING THE ATLAS</span><h1>Loading the route story…</h1></main>);

loadRoute(activeRouteId())
  .then((initialBundle) => {
    applyActiveRoute(initialBundle);
    appRoot.render(<AtlasRouter initialBundle={initialBundle} />);
  })
  .catch((error) => {
    appRoot.render(<main className="error-shell"><span className="eyebrow">ATLAS LOAD ERROR</span><h1>The route package could not be opened.</h1><code>{error.message}</code><button className="button button-primary" type="button" onClick={() => window.location.reload()}>Try again</button></main>);
  });
