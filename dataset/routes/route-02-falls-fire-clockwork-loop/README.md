# Route 02 — The Falls, Fire & Clockwork Loop

Research-complete second dataset entry for the October 4-15, 2026 trip. The road trip departs Boston on October 4, returns to a Boston Logan hotel on October 14, and preserves October 15 for the airport. It is deliberately US-only: Niagara is experienced entirely from New York, with no Canada border or J-1 re-entry dependency.

## Locked route

Boston Logan → Northampton → North Adams → Grafton → Saratoga Springs → Howes Cave → Cooperstown → Ithaca → Corning → Rochester → Letchworth → Buffalo → Niagara Falls → Syracuse → Albany → West Stockbridge → Boston Logan.

- 11 calendar days and 11 hotel nights, including Boston on October 14
- 1,281.8 baseline road miles
- 40 scheduled, separately rateable places plus 11 hidden-gem anchor replacements
- 153 locally cached carousel images when the image audit is complete: three per place with creator, rights and source metadata; the dataset flags any external image that needs reuse permission before public deployment
- 7 larger-city nights and 4 quieter/smaller-place nights
- Two intentionally social nights: Radio Social in Rochester and a locally chosen Essex/Elmwood live-music circuit in Buffalo
- One parked-car reset day in Rochester
- Two scheduled athletic/adrenaline anchors, matching the trip-wide maximum
- One Orthodox Sunday morning at Annunciation in Buffalo
- Eleven measured replacement variants; every baseline remains at or below the 3h30 bed-to-bed driving cap

## Why this one should feel different

The famous apex is Niagara, but the connective tissue is what gives the route its identity: an artist's private stone sanctuary, a Buddhist peace ridge, naturally carbonated spring water, an underground boat ride, Haudenosaunee-created interpretation, America's most notorious petrified-man hoax, a rideable folk-art carousel, molten-glass making, a maximalist Rochester art maze, an untidy rock-and-roll record store, a working hydroelectric vista, Frank Lloyd Wright and a rare inland pine-barrens ecosystem.

The choices are not a checklist of the first-ranked attractions. MASS MoCA beats a conventional gallery because its factory scale suits the group; Howe is paired with the Iroquois Museum so the corridor contains both spectacle and Indigenous authorship; the Cardiff Giant and Empire State Carousel receive their own ratings because they are the actual reasons for the Cooperstown stop; and Rochester gets two nights because its unusual places become exhausting if squeezed into a transfer day.

## Day-by-day audit

| Day | Date | Sleep | Main sequence | Miles | Baseline drive | NOAA normal °C high/low | Measurable precipitation normal |
|---:|---|---|---|---:|---:|---:|---:|
| 1 | Sun Oct 4 | Northampton | Smith glasshouse → Three Sisters → Tunnel Bar | 136.0 | 3h07 | 20.2 / 8.1 | 33.3% |
| 2 | Mon Oct 5 | Saratoga Springs | MASS MoCA → Peace Pagoda → mineral springs → Congress Park | 108.9 | 3h11 | 19.0 / 7.2 | 35.9% |
| 3 | Tue Oct 6 | Cooperstown | Howe Caverns → Iroquois Museum → lakefront → Ommegang | 97.1 | 2h35 | 16.2 / 6.5 | 42.3% |
| 4 | Wed Oct 7 | Ithaca | Fenimore Farm → Cardiff Giant → Carousel → Taughannock → Cornell | 135.6 | 3h21 | 18.3 / 5.6 | 45.3% |
| 5 | Thu Oct 8 | Rochester | Ithaca Falls → Corning glass → make glass → High Falls | 146.5 | 3h09 | 18.0 / 7.6 | 42.4% |
| 6 | Fri Oct 9 | Rochester | Eastman → ARTISANworks → House of Guitars → Radio Social | 0.0 | Parked | 17.8 / 7.4 | 42.6% |
| 7 | Sat Oct 10 | Buffalo | Public Market → Letchworth → Canalside → live music | 123.4 | 3h07 | 16.6 / 7.7 | 43.6% |
| 8 | Sun Oct 11 | Buffalo | Orthodox liturgy → Power Vista → Maid → Cave → illumination | 48.4 | 1h21 | 16.4 / 7.5 | 43.8% |
| 9 | Mon Oct 12 | Syracuse | Martin House → Roosevelt site → Armory Square | 154.8 | 3h17 | 16.4 / 6.5 | 47.3% |
| 10 | Tue Oct 13 | Albany | Erie Canal Museum → Pine Bush → Capitol exterior/plaza | 162.6 | 3h30 | 17.1 / 5.6 | 36.2% |
| 11 | Wed Oct 14 | Boston | TurnPark → Logan hotel | 168.5 | 3h27 | 17.1 / 8.9 | 33.5% |

Baseline durations come from OSRM road geometry and contain no live traffic. The weather values are NOAA 1991-2020 date normals, not a 2026 forecast. Replace them with live forecasts about ten days before travel and re-run every bed-to-bed route in live navigation each morning.

Day 10 has zero static margin and Day 11 has three minutes. The core rules are therefore strict: if Day 10 exceeds 3h30, remove the Capitol walk and go to the east-side lodging area; if Day 11 exceeds it, replace or remove TurnPark and protect the Boston airport night. Days 1, 2, 4, 5, 7 and 9 also have congestion-sensitive corridors and carry their own fallbacks in `route.json`.

## Hidden-gem anchor replacements

These are real substitutions, not extra stops. Each has coordinates, date-aware operations, cost status, a group-fit explanation, four rating slots, three attributed carousel images and measured replacement geometry. Replacements remain outside the Magic score until promoted.

| Day | Replacement | Replaces | Variant baseline | Change vs core |
|---:|---|---|---:|---:|
| 1 | Magic Wings Butterfly Conservatory | Three Sisters Sanctuary | 2h55 | -12 min |
| 2 | Clark outdoor campus and trails | MASS MoCA | 3h15 | +4 min |
| 3 | Secret Caverns | Howe Caverns | 2h34 | -1 min |
| 4 | Fly Creek Cider Mill | Fenimore Farm + Giant + Carousel | 3h21 | unchanged |
| 5 | Museum of the Earth | Corning + Make Your Own Glass | 2h18 | -51 min |
| 6 | Strong National Museum of Play | ARTISANworks + House of Guitars | Parked | unchanged |
| 7 | Eternal Flame Falls | Letchworth | 2h35 | -32 min |
| 8 | Old Fort Niagara | Maid of the Mist + Cave of the Winds | 2h01 | +40 min |
| 9 | Forest Lawn + Blue Sky Mausoleum | Martin House | 3h13 | -4 min |
| 10 | Schenectady Stockade walk | Albany Pine Bush | 3h26 | -4 min |
| 11 | No. Six Depot café/gallery | TurnPark | 3h25 | -2 min |

Three attractive candidates were rejected only after measuring the actual day geometry: Hyde Hall reached 251 minutes, Graycliff 274, and Green Lakes 221. Yaddo is excluded because the gardens are closed after storm damage; Silo City is excluded because no public tour is scheduled for October 10. The full audit lives in `route-decisions.json`.

Clark deserves one warning: the galleries are closed Monday. Its replacement card is specifically for the free outdoor campus, reflecting pools and trails, not an interior museum visit. The Albany card similarly promises the Capitol exterior and Empire State Plaza; the 14:00 interior tour does not fit the Pine Bush schedule.

## Traveler balance

- Viki gets environmental art, glasshouses, factory architecture, foliage, molten glass, unusual social interiors, Niagara night photography and cozy replacement cafés.
- Gora gets caverns, Haudenosaunee interpretation, the Cardiff fraud, industrial craft, Letchworth, hydroelectric engineering, Roosevelt history and the Erie Canal.
- Stivka gets the peace ridge, quieter lake and garden time, rock archaeology at House of Guitars, a full Orthodox Sunday, historic belief stories and reflective architecture.
- Paco gets consensus experiences designed to keep the group together—glassmaking, Radio Social, Niagara, the carousel—and a replacement on every day for real-time mood management.

The fit is intentionally overlapping. No place is labeled as belonging to only one person, and every card explains who it most naturally fits without treating the profiles as rigid lists.

## Ratings and Magic score

Every place has four equal traveler rating slots and a 1-5 scale. The route winner uses:

- attraction and stop ratings: 45%
- excitement and uniqueness: 20%
- driving comfort: 15%
- traveler fairness: 10%
- cost and value: 5%
- expected weather: 5%

The weather weight is deliberately small. Replacement places do not affect the Magic score until selected. Person-specific route scores remain separate so the app can show each traveler's favorite alongside the group winner.

## Budget and booking order

The modeled controllable range is $1,020-$1,450 per person before lodging, cars, fuel, nightlife and shopping. The known core admission floor is about $343 per person; the glassmaking project is the biggest admission variable.

1. Howe Caverns, Corning Make Your Own Glass and the Martin House interior tour.
2. Radio Social bowling lane and the actual Buffalo live-music calendar when it opens.
3. Niagara operational reconfirmation for Maid of the Mist and Cave of the Winds.
4. Two-room lodging: one 1-bed room and one 2-bed room, prioritizing safety, cleanliness, parking and staffed late check-in.

## Dataset inventory

- `route.json` — app-ready route, schedules, road legs, weather, scoring, budgets, booking priorities and fallbacks
- `places.json` — 51 coordinates, descriptions, person-fit notes, hours, costs and equal four-person rating shells
- `images.json` — three local carousel records per place after the image audit, with exact/context coverage and reuse-status flags
- `route.geojson` — road LineStrings, replacement variants, attraction Points and lodging/logistics Points
- `route-geometry.json` — raw OSRM core road calculations
- `replacement-geometry.json` — all eleven alternative calculations, deltas and cap results
- `weather-normals.json` — NOAA/NCEI daily normals in Celsius
- `sources.json` — official, government, editorial, map/review and forum research registry
- `route-decisions.json` — experience rationale and accepted/rejected geometry audit
- `place-seed.json` and `research-raw.json` — reproducible build inputs

Rebuild with `node scripts/route-02/build.mjs`, then validate with `node scripts/validate-route-package.mjs route-02-falls-fire-clockwork-loop`.
