# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**The Detour Atlas** — a private, map-first decision room where four friends (`sheluvspaco`/Paco, `viki`, `gora`, `stivka`) explore 11 heavily researched road-trip candidates for October 4–14, 2026, rate every stop, test hidden-gem swaps, and pick a winner via an explainable group score.

The repo has two halves that meet at `dataset/`:

1. **A data pipeline** (`scripts/`) — Node ESM collectors + builders that turn hand-authored route configs into validated, self-contained route packages. This is where most of the repo's mass and history lives.
2. **A Vite/React client** (`src/`) that renders those packages. Routes **01 and 02 are built and viewable**; the other nine are researched but not yet wired in. `UI_VISION_AND_IMPLEMENTATION.md` specifies the full eleven-route product it is meant to become.

There is no git history and no package manifest for the pipeline — `package.json` only covers the client.

## Commands

```bash
npm install
npm run dev                 # Vite dev server on 0.0.0.0
npm run build               # production build to dist/ (copies ~1200 local images)
npm run preview

# Data pipeline (run from repo root, Node 22 / current LTS)
node scripts/route-08/build.mjs                                    # rebuild a route package (route-02..route-11)
node scripts/build-route-package.mjs                               # legacy route-01 builder
node scripts/route-01/curate-images.mjs [placeId...]               # network: replace route-01 carousel images with reviewed Commons files
node scripts/route-02/curate-images.mjs [placeId...]               # same, for route-02 (5-6 images per place)
node scripts/validate-route-package.mjs <route-slug>               # THE test gate — run after every build or data edit
node scripts/route-08/collect-research.mjs [placeId...]            # network: Nominatim + Wikimedia Commons
node scripts/route-08/collect-geometry.mjs                         # network: OSRM public demo
node scripts/route-08/collect-weather.mjs                          # network: NOAA 1991–2020 daily normals
node scripts/route-08/collect-replacements.mjs                     # network: OSRM, for swap variants
node scripts/route-08/build-contact-sheets.mjs                     # needs ImageMagick `magick`; writes tmp/route-NN-image-qa/
```

There is no linter, formatter, or test framework. `validate-route-package.mjs` is the only automated gate; it exits non-zero on error and prints `WARN` lines for intentional conditions (e.g. documented-but-unscheduled alternatives).

App URL state for manual QA: `?day=N&view=atlas|ratings|compare|magic&place=<place-id>&map=compat` (`map=compat` forces the Leaflet renderer).

## Dataset architecture

`dataset/manifest.json` is the canonical route index and is **maintained by hand** — no script writes it. Update `place_count`, `image_count`, and `baseline_miles` there after a rebuild.

Each `dataset/routes/<route-slug>/` package splits into three tiers:

- **Provenance, never shipped to the client:** `research-raw.json` (huge; raw Commons/Nominatim candidates + selections), `place-seed.json`, `weather-normals.json`, `route-geometry.json`, `replacement-geometry.json` (the last two are also read by the builder and partly by the app).
- **Production records, consumed by the UI:** `route.json` (metadata, constraints, 11 days, schedules, drive legs, weather, budget, replacement declarations), `places.json`, `images.json`, `route.geojson` (filter by `properties.feature_kind`: `place` / `drive_leg` / `replacement_drive_variant`), `sources.json`, `route-decisions.json`.
- **Human-readable:** `README.md` per route and `docs/routes/route-NN.md` briefs. Cross-check material only, never a data source.

Truth priority when fields disagree: manifest → `route.json` → `places.json`/`images.json` → `replacement-geometry.json` → `route.geojson` → `route-geometry.json` → `sources.json`/`route-decisions.json` → README prose. Never let the UI silently "fix" a researched fact; fail the build instead.

### Pipeline shape

```
config.mjs (places, geocodes, manual coords, lodging nodes, day routes, weather stations)
  → collect-research  → research-raw.json + downloaded images into assets/routes/<slug>/
  → collect-geometry  → route-geometry.json
  → collect-weather   → weather-normals.json
  → collect-replacements → replacement-geometry.json
content.mjs (verifiedAt, sourceRows, seedPlaces, dayPlans — the authored itinerary prose and schedule)
  → build.mjs → route.json, places.json, images.json, sources.json, place-seed.json,
                route.geojson, route-decisions.json
  → validate-route-package.mjs
```

**Where to edit place copy differs per route.** Route 01's `place-seed.json` is a **hand-authored input** to `build-route-package.mjs`. Route 02 inverts this: `place-seed.json` is *generated*, and the `seedPlaces` array lives inline in `scripts/route-02/build.mjs` — edit there. Routes 06–11 keep theirs in `content.mjs`. Never edit the generated `places.json`. Its images are curated by `scripts/route-01/curate-images.mjs`, which holds an explicit per-place list of reviewed Commons file titles, downloads rendered JPEG derivatives (Commons serves `.tif`/`.png` masters browsers can choke on), rewrites `selected_images` in `research-raw.json`, and deletes superseded assets — the relevance-scored collector output it replaced was technically valid but visually useless for several stops.

`scripts/route-04/` holds the **canonical collector implementations**. Routes 05–11 are three-line wrappers that set `process.env.ROUTE_COLLECTOR_CONFIG` and `await import("../route-04/<collector>.mjs")`; routes 02–03 still carry their own forked copies. When fixing a collector bug, fix `route-04` and check whether 02/03 need the same change.

Per-route scripts drifted over time: routes 02–05 use `import-external-images.mjs` and inline their content in `build.mjs`; routes 06–11 split authored content into `content.mjs`, and 07–11 add `curate-images.mjs` (explicit per-place Commons file lists + labelled external URLs) and `build-contact-sheets.mjs`. Follow the newest route's layout when adding one.

**`curate-images.mjs` scripts rebuild their package before exiting.** `images.json` is generated from `research-raw.json`, and curation deletes superseded asset files as it goes — so a curation run that ends without a rebuild leaves the package referencing files it just replaced, and the app shows empty image slots. They also save after every place and skip already-downloaded files, so an interrupted run resumes safely. Never run two curation/download jobs against `upload.wikimedia.org` at once; that is what triggers the 429s.

`build.mjs` throws rather than emitting a bad package — unknown source IDs, missing coordinates, or missing geometry/weather for a day all abort the build.

## Invariants that matter

- Coordinates are WGS84 `[longitude, latitude]` everywhere, matching GeoJSON. IDs and route slugs are lowercase kebab-case and are **never reused** for a different entity.
- Every route is exactly 11 days, `2026-10-04` → `2026-10-14`, airport date `2026-10-15`, with consecutive dates and non-overlapping schedule windows. The validator enforces all of this.
- Driving caps: 210 baseline minutes/day for the comparison routes. **Route 11 is structurally different** — a premium one-way Boston→Houston run with an authorized 330-minute ceiling that never returns to Boston. Never render it as a normal loop, and never fold its exceptions into the standard cap.
- OSRM durations are road-network baselines with **no live traffic**; planning ranges are judgment buffers. NOAA values are historical normals, not a forecast. The UI must never imply either is live.
- Every place needs ≥3 local images, each with creator, license, license URL, source page, and an existing local file. 306 of the 1,221 images carry `rights_status: "permission-required-before-public-deployment"` / `production_usable: false` — these are private-prototype-only and must never be presented as cleared for public use.
- Traveler ratings ship empty (`null` for all four); `researcher_person_fit` is a separate researcher prediction and is not a vote.
- Each day's hidden gem is a **one-for-one replacement**, not an extra stop: it sits outside Magic scoring (`included_in_magic_score: false`) until confirmed, and swapping it must visibly re-measure miles, time, and cap status.
- Magic score weights are fixed at attractions 45% / excitement 20% / driving comfort 15% / fairness 10% / cost 5% / weather 5%, with equal per-traveler votes and equal per-entity means (so more stops ≠ higher score). Full spec in `UI_VISION_AND_IMPLEMENTATION.md` §6.

## Client notes (`src/main.jsx`)

One ~1300-line file plus `src/styles.css`. [src/routes.js](src/routes.js) statically imports every built route package and exports `ROUTES` / `ROUTE_BY_ID` / `activeRoute()`; `main.jsx` picks one bundle at module load from `?route=` and derives all its lookup tables (`placeById`, `imageById`, `nodeById`, `routeFeatures`, `nodeCityById`) from it. **Switching routes reloads the page** (`openRoute()`) rather than re-deriving those module-scope constants — adding a route means adding its imports to `routes.js`, nothing else. Ratings are stored per route under `detour-atlas-<routeId>-ratings`.

`RouteMap` runs **two renderers behind one component**: MapLibre GL (vector, OpenFreeMap Positron tiles) when WebGL2 is available, and a Leaflet "compat" map otherwise or when `?map=compat` is set. Any map feature added to one path needs the other. Basemap tiles are the only network dependency — all route geometry and trip facts stay local.

Ratings persist to `localStorage` under `detour-atlas-route-01-ratings`; view/day/place live in the query string via `replaceState`. `window.__detourAtlasRoot` is reused so HMR does not double-mount.

The vision doc (§11.5) lists known schema drift to normalize at the app boundary — open-vocabulary `kind`, reservation and cap-status strings, category aliases, `day.title ?? day.theme`, route-11's non-IANA route-level timezone — and warns against coding exhaustive unions over them.

## Design direction

`.impeccable.md` is the design contract: map-first editorial travel atlas, deep graphite/night-ocean over warm paper, brass accents, serif display + sans UI + sparse mono for operational metadata. Explicitly not a SaaS dashboard, booking marketplace, card grid, sci-fi HUD, or Google Maps imitation. Color has exactly one job per hue: route identity, Magic/premium emphasis, or risk status. `UI_VISION_AND_IMPLEMENTATION.md` §19 lists the full anti-pattern list.

## Related files

- `AGENTS.md` — repository guidelines (style, commit/PR conventions).
- `UI_VISION_AND_IMPLEMENTATION.md` — the 1900-line product/UI source of truth: IA, screen specs, scoring, map behavior, accessibility, build order, definition of done.
- `dataset/README.md`, `dataset/schema/route-package.schema.json` — dataset conventions and JSON Schema.
