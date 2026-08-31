# Trip route dataset

This directory is the canonical source of truth for the interactive trip map.
Each route lives in `routes/<route-slug>/` and must contain:

- `route.json` — route metadata, ordered days, drive legs, weather, budgets, and scoring configuration.
- `places.json` — normalized stop and attraction records referenced by `route.json`.
- `images.json` — local image paths, source pages, creators, and licenses.
- `sources.json` — official and routing references with verification dates.
- `README.md` — a readable itinerary and any unresolved operational warnings.

Files ending in `research-raw.json` are reproducible collection output. They are
not consumed by the future application. Every production record must pass the
validators in `scripts/` before its route is considered locked.

## Stable conventions

- IDs are lowercase kebab-case and never reused for a different entity.
- Coordinates are WGS84 decimal degrees in `[longitude, latitude]` order, matching GeoJSON.
- Distances use both miles and integer meters; duration fields use integer minutes/seconds.
- Prices are stored in USD and carry a confidence/status field when not guaranteed.
- Attraction hours are date-specific whenever the source publishes a 2026 schedule.
- All images need a local path plus creator, license, license URL, and source page.
- Historical weather is explicitly labeled as a planning normal, never a forecast.
- User ratings remain empty until a traveler submits them. Researcher fit predictions are separate.

