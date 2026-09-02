# Wiring an Energized Route (V2) — End-to-End

A complete procedure for wiring one "Energy Rebuild" route brief into a live, validated,
UI-ready route package. Written for an AI agent with no prior context on this repo.

Read `CLAUDE.md` first for repo architecture. This document is the *procedure*; `CLAUDE.md` is
the *map*. Where they disagree, `CLAUDE.md` wins on architecture and this file wins on sequence.

---

## 0. Mental model — read this before touching anything

**The `-energy/` directories are builders, not data.** `scripts/route-NN-energy/` does not create a
parallel route. It **overwrites the canonical package in `dataset/routes/<slug>/` in place**. There is
no separate "V2 route" to register anywhere. `src/routes.js` needs no changes for a rebuild.

The hook is deliberately blunt. `scripts/route-NN/build.mjs` calls the energy builder and returns
immediately; the entire legacy V1 builder is retained below as dead code for reference:

```js
import { buildEnergyRoute05 } from "../route-05-energy/build.mjs";
// ...
async function main() {
  await buildEnergyRoute05({ root: ROOT, routeDir: ROUTE_DIR });
  return;

  // Legacy Route 05 builder retained below as historical implementation context.
```

So `node scripts/route-05/build.mjs` runs the V2 builder. That is the only build entry point.

**Truth priority when sources disagree** (from `CLAUDE.md`):
`manifest → route.json → places.json/images.json → replacement-geometry.json → route.geojson →
route-geometry.json → sources.json/route-decisions.json → README prose`.
Never let the UI silently "fix" a researched fact — fail the build instead.

---

## 1. Environment traps — check these FIRST

### 1.1 iCloud dataless files (will cost you hours if unknown)

This project lives in `~/Desktop`, which macOS syncs via iCloud Desktop & Documents. iCloud evicts
large or untouched files: `stat` reports the **real size**, but reading returns **0 bytes**.

Symptoms, all the same root cause:

| Symptom | Actually means |
|---|---|
| `Unexpected end of JSON input` | Evicted JSON file |
| `ETIMEDOUT` on a read syscall | Faulting a file in from iCloud, slowly |
| `Stringifier is not a constructor` (postcss) | Evicted `node_modules` file loaded as `{}` |
| `ERR_INVALID_PACKAGE_CONFIG` | Evicted `package.json` |
| `git log` / `git status` / `git commit` hangs | Evicted `.git/objects/pack/*.pack` (can be >1 GB) |

**Detect without downloading** — dataless files occupy 0 disk blocks but report a nonzero size:

```bash
find <dir> -type f -size +0c | while read -r f; do
  [ "$(stat -f '%b' "$f")" = "0" ] && echo "$f"
done
```

**Fix (targeted, never the whole tree):**

```bash
brctl download "<path>"   # then read it once to force the fault
```

Critically: **a stale process keeps the broken module cached.** After materializing files, restart
the dev server — Node caches an empty module's `exports` for the life of the process, so the error
persists against files that are now perfectly fine on disk.

### 1.2 What you do NOT need

- **`node_modules` is not required for route work.** Every pipeline script — builders, validator,
  harvest, promote, optimizer — imports only `node:` built-ins. Verify with:
  ```bash
  grep -rhoE '^import .* from "[^."][^"]*"' scripts/*.mjs scripts/lib/*.mjs | grep -v 'node:'
  ```
  Empty output means zero external dependencies. Do not download `node_modules` to build a route.
- **`npm run build` is not the gate.** `scripts/validate-route-package.mjs` is. The Vite build only
  copies optimized images; Vercel runs it on a clean checkout where nothing is evicted.

### 1.3 External binaries

`magick` (ImageMagick) is required for contact sheets. Without it, `harvest-place-images.mjs`
silently produces no sheets — and you must not promote images you have not looked at.

---

## 2. Read the brief and extract the numbers

Briefs live in `Energy Rebuild Routes/RouteNN_*.md`.

Pull out and write down every hard figure the brief asserts, because these are your acceptance
criteria at the end:

- core place count, split into kept vs new
- total places, selectable places, image count
- per-person and group budget
- bucket distribution (e.g. `underground-industrial-infrastructure: 9`)
- texture distribution (EXPLORE / AWE / MOVE / …)
- passive-museum percentage (usually a "0%" claim)
- baseline miles, longest uninterrupted leg, any authorized cap exception

> **The brief is not automatically authoritative.** The user may have made later decisions that
> deliberately override it. Before "correcting" the package to match a brief, grep the route's
> `prepare.mjs`, `README.md`, and `route-decisions.json` for a rationale.
>
> This is a real failure mode: on Route 01 the brief implied removing Old Sturbridge Village, but
> `prepare.mjs` recorded *"Day 11 restores Old Sturbridge Village per traveler request"*. Editing to
> match the brief would have destroyed a user decision. **When the package contradicts the brief and
> the package documents why — the package wins. Ask, don't assume.**

---

## 3. Update `scripts/route-NN/config.mjs`

This is the collector input. Add:

1. **New places** — `id` (lowercase kebab-case, **never reused**), name, geocode query.
2. **`manualCoordinates`** — for anything Nominatim gets wrong. Append with
   `Object.assign(manualCoordinates, { ... })`.
   Coordinates are **WGS84 `[longitude, latitude]`**, matching GeoJSON. Getting this backwards is
   the single most common data error.
3. **`energyRebuildPlaceIds`** — the new-place list.
4. **Lodging / break nodes** — every overnight and any mid-drive break that splits a long leg.
5. **`dayRoutes`** — the ordered node sequence per day, which drives OSRM geometry.
6. **Weather stations** — update sleep cities when overnights move.

### Coordinate choice materially changes drive time

Pin the **access point**, not the landmark centroid. On Route 05, pinning Mt. Tammany's *summit*
produced a 213-minute OSRM leg that breached the cap; repinning to the Dunnfield Creek **trailhead**
(`[-75.1270, 40.9720]`) gave 157 minutes for the same visit.

### Breaking a long leg

To bring an over-cap uninterrupted leg down, insert a break node mid-route in `dayRoutes` — e.g.
Route 08 gained `south-hill-break` at `[-78.1281, 36.7276]` between `duke-lemur-bts` and
`pocahontas-island`, cutting the longest leg from 153 to 147 minutes.

---

## 4. Run the collectors (network)

```bash
node scripts/route-NN/collect-geometry.mjs      # OSRM public demo → route-geometry.json
node scripts/route-NN/collect-weather.mjs       # NOAA 1991–2020 normals → weather-normals.json
node scripts/route-NN/collect-replacements.mjs  # OSRM for swap variants → replacement-geometry.json
```

Re-run **geometry** after any `dayRoutes`/coordinate change, **weather** after any sleep-city change,
and **replacements** after any hidden-gem change. `build.mjs` throws if a day is missing geometry or
weather — that is intentional; do not stub it.

`scripts/route-04/` holds the **canonical collector implementations**. Routes 05–11 are thin wrappers
that set `process.env.ROUTE_COLLECTOR_CONFIG` and import route-04's. **Fix collector bugs in
`route-04`**, then check whether 02/03 (which still carry forked copies) need the same fix.

> OSRM durations are road-network baselines with **no live traffic**. NOAA values are historical
> normals, **not a forecast**. The UI must never imply either is live.

---

## 5. Images — the two-phase workflow

**Use this. Do not hand-scrape, and do not use the old per-route `curate-images.mjs` pattern for new
work.** DuckDuckGo is dramatically faster than Wikimedia and has no per-file throttling: one pass
returned 168 candidates for 14 Route 05 places, versus ~15 rate-limited round trips for Route 08's 26.
It also finds imagery for commercial venues (escape rooms, tour operators) that Commons simply lacks.

### Phase 1 — harvest

Create `scripts/route-NN-energy/image-queries.mjs`:

```js
export const queries = {
  "rock-house-reservation": { query: "Rock House Reservation West Brookfield Massachusetts rock shelter", source: "ddg" },
  "eckley-miners-village":  { query: "Eckley Miners Village Pennsylvania coal patch town", source: "ddg" },
};
```

`source` is `"ddg"` (fast, rights unknown) or `"commons"` (slow, ships a real licence). Prefer
`commons` for landmarks, parks and geology; `ddg` for commercial venues.

> **Commons search ANDs every term — keep those queries to two or three words.** A full descriptive
> phrase reliably returns *zero* results, which looks identical to rate-limiting and will send you
> chasing a throttling problem that does not exist. `"Fonthill Castle"` returns results;
> `"Fonthill Castle Doylestown Pennsylvania Henry Mercer concrete"` returns none.
>
> Also sanity-check what a short query actually matches. On Route 09, `"Bilgers Rocks"` matched
> **bilge** (ship diagrams and a yacht) and `"Pennsylvania elk Benezette"` returned county maps.
> When Commons returns the wrong subject, switch that place to `ddg` rather than fighting it.

```bash
node scripts/harvest-place-images.mjs <full-route-dir-slug> [--source=ddg|commons|both] [--per=12] [placeId...]
# e.g. node scripts/harvest-place-images.mjs route-05-coal-veins-caverns-blue-ridge-secrets-loop
```

Pass the **full directory slug**, not `route-05`. Output:

- `tmp/<slug>-image-harvest/<place-id>/NN.jpg` — numbered candidates
- `tmp/<slug>-image-harvest/candidates.json` — manifest (**merged**, so re-harvesting a few places
  does not drop the rest)
- `tmp/<slug>-image-harvest/sheets/<place-id>.jpg` — numbered contact sheets

### Phase 2 — review, then promote

**Look at every contact sheet.** Search returns plenty that is technically valid and visually
useless. Reject: stock-agency comps, 4-up collages, video thumbnails, blog graphics with text
overlays, and out-of-season snow frames on an October route.

Create `scripts/route-NN-energy/image-selection.mjs`:

```js
export const selection = {
  "rock-house-reservation": [
    [1, "Inside the glacial rock shelter that gives the reservation its name"],
    [3, "The pond below the rock house in full October colour"],
    [2, "The boulder outcrop above the clearing"]
  ],
};
```

Format is `[candidateIndex, description, coverage?]`. Descriptions must say what the frame *actually
shows* — they ship to the UI.

`coverage` values:

| Value | Use when |
|---|---|
| `exact-place-or-experience` (default) | The frame really is the attraction |
| `exact-place-or-experience-context` | The setting, the venue's town, a neighbouring feature |
| `species-reference-not-this-site` | An animal reference photo taken elsewhere |

Saying so in data is what keeps the package honest. Do not default everything to `exact`.

```bash
node scripts/promote-place-images.mjs <full-route-dir-slug> [placeId...]
```

This copies files into `assets/routes/<slug>/`, writes `selected_images` into `research-raw.json`
with correct rights metadata, and **deletes superseded files**.

### Rights rules — non-negotiable

| Source | `production_usable` | `rights_status` |
|---|---|---|
| DuckDuckGo / web | `false` | `permission-required-before-public-deployment` |
| Wikimedia Commons | `true` | `commons-license-recorded` |

Rights-gated images are **private-prototype-only** and must never be presented as cleared for public
use. Every place needs **≥3 images**, each with creator, license, license URL, source page, and an
existing local file.

> ### ⚠ The validator cannot catch a shared placeholder file
>
> `validate-route-package.mjs` checks only that each image's `local_path` **exists**. It does not
> check that the file is distinct, or that it depicts the right place.
>
> Route 09 shipped 179 image records pointing at **80 distinct files**: a single Keystone Arch
> Bridges photo was the local file for **100 records across 34 places**. The package validated
> cleanly while a third of the route would have shown a Massachusetts stone bridge.
>
> Check it explicitly after any build:
> ```bash
> node -e 'const i=require("./dataset/routes/<slug>/images.json").images;
> console.log(i.length, new Set(i.map(x=>x.local_path)).size)'
> ```
> Those two numbers must match. `scripts/route-09-energy/build.mjs` and `scripts/route-10-energy/build.mjs`
> both throw on a collision — copy that guard when you write a new builder.
>
> One nuance: sharing a file between two cards **at the same venue** is legitimate (a museum with
> two separate tour products, say). Sharing across venues is not. Compare coordinates to tell them
> apart — routes 06 and 07 currently have 36 files each shared across *different* venues.

### Two hard rules

1. **Never run two download jobs against `upload.wikimedia.org` at once.** That is what triggers 429s.
2. **Always rebuild after promoting.** `images.json` is generated from `research-raw.json`, and
   promotion deletes superseded assets as it goes. Promoting without rebuilding leaves the package
   referencing files that no longer exist, and the app shows empty image slots.

---

## 6. Write the energy builder

Two files in `scripts/route-NN-energy/`:

### `data.mjs` — pure data

Follow the established export set (see `scripts/route-05-energy/data.mjs`):

```
PEOPLE, VERIFIED_AT, ORIGINAL_IDS, LEGACY_ALTERNATIVE_IDS, NEW_CORE_IDS, CORE_IDS,
OPTIONAL_IDS, SOCIAL_IDS, FLEX_IDS, ARCHIVE_IDS, NON_CORE_DAY_DATES, NEW_SOURCES,
CORE_CONFIG, PLACE_OVERRIDES, DAY_PLANS, BOOKING_PRIORITIES
```

`LEGACY_ALTERNATIVE_IDS` matters: without it the builder **deletes** V1 alternatives it does not
recognise. Route 02 would have silently dropped 10.

### `build.mjs` — exports `buildEnergyRouteNN({ root, routeDir })`

Derive it from the newest existing energy builder. Then hook it into `scripts/route-NN/build.mjs` per
§0.

> ### ⚠ Grep for prose leaks after deriving from another route
>
> These builders carry large blocks of authored narrative. Copying one route's builder to make
> another's **carries that route's prose with it**, and the validator cannot detect it — the package
> is structurally perfect and factually about the wrong trip.
>
> After deriving, grep the new package for the donor route's distinctive nouns:
> ```bash
> grep -rn "Lemur\|Duke\|Pocahontas" dataset/routes/route-05-*/ | head
> ```
> Expect zero hits. Run this for every place name, city and theme word unique to the donor.

### Required per-place fields

Non-core places **must carry `visit_date` matching the day they attach to**, or they will not surface
in the UI. `dayOptionRecords()` in `src/main.jsx` finds options via `alternative_place_ids` where
`place.visit_date` equals the day's date and priority ≠ archive.

Also set: `core_status` (`core` / `optional` / `alternative`), `original_status`
(`new-core` / `keep-core` / …), `texture`, `interaction_score`, price mirrors, fit mirrors,
`operational_risk`, and `skip_mode` (or `skip_strategy` — the UI reads
`place.skip_mode || place.skip_strategy`).

If a route's brief predates the texture taxonomy, set `texture: null` explicitly rather than
inventing values.

### Source IDs

Every `place.source_ids` entry must exist in `sources.json` or the build throws. Do not generate
source IDs with a regex over place IDs — that produced non-existent `src-v8-<placeId>` ids on
Route 08. Use an explicit map, and prune defensively:

```js
for (const place of places) place.source_ids = (place.source_ids || []).filter((id) => sourceById.has(id));
```

### Driving caps

Convention: `TOTAL_CAP = 270`, `UNINTERRUPTED_CAP = 150`. Baseline comparison routes cap at 210
minutes/day.

`cap_status` resolution order:
`over-uninterrupted-cap → authorised-long-total-day → over-total-cap → long-total-day (>210) →
live-traffic-gated (planning high >210) → comfortable`

Ordering matters — on Route 08 an over-cap status was **masking** a day that should have read
`authorised-long-total-day`.

For a day that legitimately exceeds the cap:

```js
const CAP_EXCEPTIONS = { 9: { minutes: 330, reason: "..." } };
```

The validator requires `cap_exception_reason` whenever `authorized_cap_exception_minutes` is set.

### Hidden gems

Each day's hidden gem is a **one-for-one replacement, not an extra stop**. It sits outside Magic
scoring (`included_in_magic_score: false`) until confirmed, and swapping it must visibly re-measure
miles, time and cap status. The validator enforces
`replacement_place_ids.length === replacementGeometry.variants.length`.

### Ratings

Traveler ratings ship **empty** (`null` for all four). `researcher_person_fit` is a separate
researcher prediction and **is not a vote**. Never seed ratings.

---

## 7. Build, validate, optimize

```bash
node scripts/route-NN/build.mjs
node scripts/validate-route-package.mjs <full-route-dir-slug>
npm run optimize:images -- <full-route-dir-slug>
```

`validate-route-package.mjs` exits non-zero on error. `WARN` lines are intentional conditions
(documented-but-unscheduled alternatives) and are expected — do not "fix" them.

The validator enforces: exactly 11 days `2026-10-04`→`2026-10-14`, airport date `2026-10-15`,
consecutive dates, non-overlapping schedule windows, ≥3 images per place with existing local files,
`day.drive.baseline_total_minutes <= (authorized_cap_exception_minutes || daily_drive_hard_cap_minutes || 210)`,
and the replacement-count identity above.

The optimizer generates `.webp` + `-thumb.webp` renditions into `assets/optimized/routes/<slug>/`.
**This is mandatory**: the Vite build hard-throws if any rendition is missing:

```
Missing N optimized route images. Run npm run optimize:images -- <route-directory>.
```

`assets/optimized/` is **committed to git**, not generated at deploy time. New renditions must be
committed or Vercel's build fails on a clean checkout.

---

## 8. Update `dataset/manifest.json` by hand

**No script writes the manifest.** After a rebuild, update the route's `place_count`, `image_count`
and `baseline_miles`, and set `status` to `energy-rebuild-ui-ready`.

Verify against the built package rather than trusting the brief:

```bash
node -e '
const fs=require("fs"), d="route-05-coal-veins-caverns-blue-ridge-secrets-loop";
const p=JSON.parse(fs.readFileSync(`dataset/routes/${d}/places.json`)).places;
const i=JSON.parse(fs.readFileSync(`dataset/routes/${d}/images.json`)).images;
console.log("places",p.length,"images",i.length);'
```

---

## 9. Client wiring

Usually **nothing to change** — `src/routes.js` already statically imports all 11 packages, and the
energy builder overwrites in place.

One exception: `ENERGIZED_PRICING_ROUTE_IDS` in `src/main.jsx` gates the "full price per person"
field. Add the route id (`'route-09'`) **only once its budget actually carries energized pricing**.

`routeAttractionTotal()` resolves the price in this order:
1. `budget.do_everything_core_low/high_per_person_usd` ← what an energized route should have
2. `budget.core_admissions_range_per_person_usd`
3. `budget.provisional_all_core_planning_envelope_per_person_usd`

A V1 route listed in the pricing set will silently fall through to (2) and display a price built from
V1 data. Route 09 is currently in that state — in the set, but with 0 non-core places and no
`do_everything_*` key.

Manual QA URL state:
`?route=route-05&day=N&view=atlas|ratings|compare|magic&place=<place-id>&map=compat`
(`map=compat` forces the Leaflet renderer; any map feature added to one renderer needs the other.)

---

## 10. Commit and push

Deployment is GitHub → Vercel. Vercel builds from a clean checkout, so **anything uncommitted does
not exist to the deploy**.

Must be committed:
- `dataset/routes/<slug>/**` — the rebuilt package
- `assets/routes/<slug>/**` — promoted source images
- `assets/optimized/routes/<slug>/**` — WebP renditions (or the build throws)
- `scripts/route-NN-energy/**` — the builder, queries, selection
- `dataset/manifest.json`
- `src/main.jsx` if the pricing set changed

`tmp/` is gitignored — harvest candidates and contact sheets are correctly excluded.

If git commands hang, see §1.1: the packfile is almost certainly evicted.

---

## 11. Definition of done

- [ ] `node scripts/validate-route-package.mjs <slug>` passes (WARNs OK)
- [ ] Counts match the brief: core (kept + new), total places, selectable, images
- [ ] Budget matches the brief, per-person and group
- [ ] Bucket and texture distributions match the brief
- [ ] Passive-museum percentage matches the brief
- [ ] Baseline miles and longest uninterrupted leg within cap, or an authorized exception with a reason
- [ ] Every place has ≥3 images with existing local files and complete rights metadata
- [ ] Rights-gated images marked `production_usable: false`
- [ ] Every non-core place has `visit_date`; options surface on **all 11 days**
- [ ] `npm run optimize:images` run; renditions exist for every image
- [ ] `dataset/manifest.json` updated by hand
- [ ] Zero prose leaks from the donor route (§6)
- [ ] Traveler ratings still `null`
- [ ] Committed and pushed

---

## 12. Failure modes seen in practice

| Symptom | Cause | Fix |
|---|---|---|
| Build throws on unknown source id | Regex-generated source ids | Explicit map + prune filter (§6) |
| V1 alternatives vanish after rebuild | Missing `LEGACY_ALTERNATIVE_IDS` | Add them; branch in `enrichNonCore` |
| Day breaches 270 cap | Real routing change | Break node, or `CAP_EXCEPTIONS` + reason |
| Empty image slots in app | Promoted without rebuilding | Re-run `build.mjs` |
| Options missing on a day | Non-core place lacks `visit_date` | Add it |
| Vite build throws "Missing N optimized" | Renditions not generated/committed | `npm run optimize:images`, commit |
| Wrong-route place names in package | Prose leak from donor builder | Grep donor nouns (§6) |
| Wikimedia 429s | Concurrent download jobs | One at a time; `iiurlwidth=800` |
| Watermarked stock images | Stock agency in results | Already blocked in `STOCK_HOSTS`; extend if new |
| Commons returns 0 for a famous landmark | Query too long (Commons ANDs terms) | Cut to 2-3 words (§5) |
| Commons returns the wrong subject | Short query matched another word | Switch that place to `ddg` |
| Many places show the same photo | Shared `local_path`; validator can't see it | Uniqueness check (§5) |
| Any "empty file" / hang / JSON error | iCloud eviction | §1.1 |

---

## 13. Design guardrails

`.impeccable.md` is the design contract: map-first editorial travel atlas, deep graphite/night-ocean
over warm paper, brass accents, serif display + sans UI + sparse mono for operational metadata.

Explicitly **not**: a SaaS dashboard, booking marketplace, card grid, sci-fi HUD, or Google Maps
imitation. Colour has exactly one job per hue — route identity, Magic/premium emphasis, or risk
status.

**Magic score weights are fixed** and must not be recomputed per route:

| Component | Weight |
|---|---|
| Attractions | 45% |
| Excitement | 20% |
| Driving comfort | 15% |
| Fairness | 10% |
| Cost | 5% |
| Weather | 5% |

Equal per-traveler votes and equal per-entity means — so **more stops ≠ higher score**.

**Known schema drift** to normalize at the app boundary, never with exhaustive unions: open-vocabulary
`kind`, reservation and cap-status strings, category aliases, and `day.title ?? day.theme`.

> ### Note on `UI_VISION_AND_IMPLEMENTATION.md`
>
> Older docs and git history reference a 1900-line `UI_VISION_AND_IMPLEMENTATION.md` (IA, screen
> specs, scoring, map behavior, accessibility, build order) and cite its §6, §11.5 and §19.
>
> **That file was intentionally deleted for codebase cleanliness and is not coming back.** The design
> facts above are the surviving authority. If you find a reference to it, treat the reference as
> stale — do not go looking for the file, and do not invent specifications in its name.

Other reference material that *does* exist: `AGENTS.md` (style, commit/PR conventions),
`dataset/README.md` and `dataset/schema/route-package.schema.json` (dataset conventions and JSON
Schema), `docs/routes/route-NN.md` (per-route briefs — cross-check material only, never a data
source), and `notes/` (`OverallTrip.md`, `Spots.md`, `tripplan.md`, `Q&A_trip.md`).
