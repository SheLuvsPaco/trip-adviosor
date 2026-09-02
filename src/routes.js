import manifest from '../dataset/manifest.json';

// Only route metadata belongs in the startup chunk. Full route packages are
// loaded on demand so opening one story does not parse every route, geometry,
// replacement, and image record in the atlas.
const builtRouteIds = new Set(['route-01', 'route-02', 'route-03', 'route-04', 'route-05', 'route-06', 'route-07', 'route-08', 'route-09', 'route-10']);

export const ROUTES = manifest.routes
  .filter((route) => builtRouteIds.has(route.id))
  .map((route) => ({
    id: route.id,
    slug: route.slug,
    name: route.name,
    color: route.map_color,
    miles: route.baseline_miles,
  }));

export const ROUTE_BY_ID = new Map(ROUTES.map((entry) => [entry.id, entry]));

const routeLoaders = {
  'route-01': () => Promise.all([
    import('../dataset/routes/route-01-gilded-coast-capital-loop/route.json'),
    import('../dataset/routes/route-01-gilded-coast-capital-loop/places.json'),
    import('../dataset/routes/route-01-gilded-coast-capital-loop/images.json'),
    import('../dataset/routes/route-01-gilded-coast-capital-loop/route-geometry.json'),
    import('../dataset/routes/route-01-gilded-coast-capital-loop/route.geojson?raw'),
    import('../dataset/routes/route-01-gilded-coast-capital-loop/replacement-geometry.json'),
  ]),
  'route-02': () => Promise.all([
    import('../dataset/routes/route-02-falls-fire-clockwork-loop/route.json'),
    import('../dataset/routes/route-02-falls-fire-clockwork-loop/places.json'),
    import('../dataset/routes/route-02-falls-fire-clockwork-loop/images.json'),
    import('../dataset/routes/route-02-falls-fire-clockwork-loop/route-geometry.json'),
    import('../dataset/routes/route-02-falls-fire-clockwork-loop/route.geojson?raw'),
    import('../dataset/routes/route-02-falls-fire-clockwork-loop/replacement-geometry.json'),
  ]),
  'route-03': () => Promise.all([
    import('../dataset/routes/route-03-wild-shore-rockets-folklore-loop/route.json'),
    import('../dataset/routes/route-03-wild-shore-rockets-folklore-loop/places.json'),
    import('../dataset/routes/route-03-wild-shore-rockets-folklore-loop/images.json'),
    import('../dataset/routes/route-03-wild-shore-rockets-folklore-loop/route-geometry.json'),
    import('../dataset/routes/route-03-wild-shore-rockets-folklore-loop/route.geojson?raw'),
    import('../dataset/routes/route-03-wild-shore-rockets-folklore-loop/replacement-geometry.json'),
  ]),
  'route-04': () => Promise.all([
    import('../dataset/routes/route-04-trolls-moon-rocks-curiosity-coast-loop/route.json'),
    import('../dataset/routes/route-04-trolls-moon-rocks-curiosity-coast-loop/places.json'),
    import('../dataset/routes/route-04-trolls-moon-rocks-curiosity-coast-loop/images.json'),
    import('../dataset/routes/route-04-trolls-moon-rocks-curiosity-coast-loop/route-geometry.json'),
    import('../dataset/routes/route-04-trolls-moon-rocks-curiosity-coast-loop/route.geojson?raw'),
    import('../dataset/routes/route-04-trolls-moon-rocks-curiosity-coast-loop/replacement-geometry.json'),
  ]),
  'route-05': () => Promise.all([
    import('../dataset/routes/route-05-coal-veins-caverns-blue-ridge-secrets-loop/route.json'),
    import('../dataset/routes/route-05-coal-veins-caverns-blue-ridge-secrets-loop/places.json'),
    import('../dataset/routes/route-05-coal-veins-caverns-blue-ridge-secrets-loop/images.json'),
    import('../dataset/routes/route-05-coal-veins-caverns-blue-ridge-secrets-loop/route-geometry.json'),
    import('../dataset/routes/route-05-coal-veins-caverns-blue-ridge-secrets-loop/route.geojson?raw'),
    import('../dataset/routes/route-05-coal-veins-caverns-blue-ridge-secrets-loop/replacement-geometry.json'),
  ]),
  'route-06': () => Promise.all([
    import('../dataset/routes/route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop/route.json'),
    import('../dataset/routes/route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop/places.json'),
    import('../dataset/routes/route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop/images.json'),
    import('../dataset/routes/route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop/route-geometry.json'),
    import('../dataset/routes/route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop/route.geojson?raw'),
    import('../dataset/routes/route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop/replacement-geometry.json'),
  ]),
  'route-07': () => Promise.all([
    import('../dataset/routes/route-07-kazoos-rock-mechanical-dreams-loop/route.json'),
    import('../dataset/routes/route-07-kazoos-rock-mechanical-dreams-loop/places.json'),
    import('../dataset/routes/route-07-kazoos-rock-mechanical-dreams-loop/images.json'),
    import('../dataset/routes/route-07-kazoos-rock-mechanical-dreams-loop/route-geometry.json'),
    import('../dataset/routes/route-07-kazoos-rock-mechanical-dreams-loop/route.geojson?raw'),
    import('../dataset/routes/route-07-kazoos-rock-mechanical-dreams-loop/replacement-geometry.json'),
  ]),
  'route-08': () => Promise.all([
    import('../dataset/routes/route-08-lemurs-stone-bridges-mechanical-dreams-loop/route.json'),
    import('../dataset/routes/route-08-lemurs-stone-bridges-mechanical-dreams-loop/places.json'),
    import('../dataset/routes/route-08-lemurs-stone-bridges-mechanical-dreams-loop/images.json'),
    import('../dataset/routes/route-08-lemurs-stone-bridges-mechanical-dreams-loop/route-geometry.json'),
    import('../dataset/routes/route-08-lemurs-stone-bridges-mechanical-dreams-loop/route.geojson?raw'),
    import('../dataset/routes/route-08-lemurs-stone-bridges-mechanical-dreams-loop/replacement-geometry.json'),
  ]),
  'route-09': () => Promise.all([
    import('../dataset/routes/route-09-kaleidoscopes-scripture-stones-secret-machines-loop/route.json'),
    import('../dataset/routes/route-09-kaleidoscopes-scripture-stones-secret-machines-loop/places.json'),
    import('../dataset/routes/route-09-kaleidoscopes-scripture-stones-secret-machines-loop/images.json'),
    import('../dataset/routes/route-09-kaleidoscopes-scripture-stones-secret-machines-loop/route-geometry.json'),
    import('../dataset/routes/route-09-kaleidoscopes-scripture-stones-secret-machines-loop/route.geojson?raw'),
    import('../dataset/routes/route-09-kaleidoscopes-scripture-stones-secret-machines-loop/replacement-geometry.json'),
  ]),
  'route-10': () => Promise.all([
    import('../dataset/routes/route-10-temples-follies-working-machines-loop/route.json'),
    import('../dataset/routes/route-10-temples-follies-working-machines-loop/places.json'),
    import('../dataset/routes/route-10-temples-follies-working-machines-loop/images.json'),
    import('../dataset/routes/route-10-temples-follies-working-machines-loop/route-geometry.json'),
    import('../dataset/routes/route-10-temples-follies-working-machines-loop/route.geojson?raw'),
    import('../dataset/routes/route-10-temples-follies-working-machines-loop/replacement-geometry.json'),
  ]),
};

const routePromises = new Map();

function bundle(meta, modules) {
  const [route, places, images, geometry, geojsonRaw, replacements] = modules.map((module) => module.default);
  return {
    ...meta,
    route,
    places,
    images,
    geometry,
    geojson: JSON.parse(geojsonRaw),
    replacements,
  };
}

export function activeRouteId() {
  if (typeof window === 'undefined') return ROUTES[0].id;
  const requested = new URLSearchParams(window.location.search).get('route');
  return ROUTE_BY_ID.has(requested) ? requested : ROUTES[0].id;
}

export function loadRoute(routeId) {
  const id = ROUTE_BY_ID.has(routeId) ? routeId : ROUTES[0].id;
  if (!routePromises.has(id)) {
    const meta = ROUTE_BY_ID.get(id);
    routePromises.set(id, routeLoaders[id]().then((modules) => bundle(meta, modules)));
  }
  return routePromises.get(id);
}

export function loadAllRoutes() {
  return Promise.all(ROUTES.map((route) => loadRoute(route.id)));
}

export async function loadAllRouteFeatures() {
  const routes = await loadAllRoutes();
  return routes.flatMap((entry) =>
    entry.geojson.features
      .filter((feature) => feature.properties?.feature_kind === 'drive_leg')
      .map((feature) => ({
        ...feature,
        id: undefined,
        properties: { ...feature.properties, routeId: entry.id, routeName: entry.name, color: entry.color },
      })));
}

export const routeLegend = ROUTES.map((entry) => ({
  id: entry.id,
  name: entry.name.replace(/^The /, ''),
  color: entry.color,
  miles: entry.miles,
}));
