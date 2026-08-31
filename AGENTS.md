# Repository Guidelines

## Project Structure & Module Organization

- `dataset/manifest.json` is the canonical route index. Each `dataset/routes/<route-slug>/` package contains `route.json`, `places.json`, `images.json`, `sources.json`, `route.geojson`, geometry/research artifacts, and a human-readable `README.md`.
- `assets/routes/<route-slug>/` stores local image assets. `docs/routes/` contains research briefs, while `UI_VISION_AND_IMPLEMENTATION.md` documents the intended application contract.
- `scripts/` contains Node.js ES-module collectors, builders, validators, and route-specific configuration/content. Keep generated QA material in `tmp/`.

## Build, Test, and Development Commands

Run commands from the repository root with a current LTS Node.js release. There is no package manifest or npm test runner.

- `node scripts/route-08/build.mjs` rebuilds a route package; substitute the desired route directory (`route-02` through `route-11`).
- `node scripts/build-route-package.mjs` builds the legacy Route 01 package.
- `node scripts/validate-route-package.mjs <route-slug>` validates schema shape, references, schedules, coordinates, images, GeoJSON, and driving caps. Example: `node scripts/validate-route-package.mjs route-08-lemurs-stone-bridges-mechanical-dreams-loop`.
- Collection scripts such as `node scripts/route-08/collect-research.mjs` and `collect-geometry.mjs` use external services and write dataset/assets; review diffs before committing.
- Route image contact-sheet scripts require ImageMagick (`magick`) and are useful for visual QA.

## Coding Style & Naming Conventions

Use ES modules (`.mjs`), two-space indentation, semicolons, and descriptive `camelCase` JavaScript names. Format JSON with two-space indentation. IDs and route slugs use lowercase kebab-case and are never reused. Coordinates are WGS84 `[longitude, latitude]`; preserve integer minute/second duration fields and USD price metadata. No formatter or linter is configured, so follow neighboring code.

## Testing Guidelines

There is no formal test framework or coverage threshold. Treat the route validator as the required test gate after every build or data edit. Also inspect changed image contact sheets and confirm every image retains creator, license, source page, local path, and accurate rights status.

## Commit & Pull Request Guidelines

This checkout has no Git history, so no existing commit convention can be inferred. Use concise imperative subjects with a scope, such as `dataset: add route 08 package`. Keep changes focused. PRs should name affected route slugs, include validator output, explain regenerated artifacts or source changes, and attach contact-sheet screenshots when images change. Never present `permission-required-before-public-deployment` assets as cleared for public use.
