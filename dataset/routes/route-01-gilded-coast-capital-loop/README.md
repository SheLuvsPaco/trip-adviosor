# Route 01 — The Gilded Coast & Capital Loop

Research-complete first dataset entry for the October 4-15, 2026 trip. The road trip departs Boston on October 4, returns to a Boston Logan hotel on October 14, and preserves October 15 for the airport. There is no Boston sleepover on October 4 and no Canada crossing.

## Locked route

Boston Logan → Providence → Newport → Watch Hill → Mystic → New Haven → Woodbury Common → New York City → Grounds For Sculpture → Princeton → Philadelphia → Washington → Frederick → Gettysburg → Bethlehem → Easton → Paterson → Southbury → Bristol → Old Sturbridge Village → Boston Logan.

- 11 calendar days and 11 hotel nights, including Boston on October 14
- 1,144.5 baseline road miles
- 27 hours 4 minutes of baseline driving, including local sightseeing legs
- 51 fully modeled/rateable places: 40 scheduled or documented alternatives plus 11 anchor replacements
- 153 production carousel images: three per place, stored locally with creator, license and source metadata
- Three defined social nights: YOB at Saint Vitus, Basement at The Fillmore, and Snallygaster
- Zero Canada/J-1 border dependency
- Zero scheduled long hikes and zero scheduled athletic/adrenaline anchors
- One hidden-gem anchor replacement for every day; all 11 replacement variants remain at or below the 3h30 baseline driving cap

## Day-by-day audit

| Day | Date | Sleep | Main sequence | Miles | Baseline drive | Buffered planning range | NOAA normal °C high/low | Measurable precipitation normal |
|---:|---|---|---|---:|---:|---:|---:|---:|
| 1 | Sun Oct 4 | Newport | RISD → Benefit Street → Castle Hill | 96.3 | 2h32 | 2h40-3h30 | 20.0 / 9.7 | 32.8% |
| 2 | Mon Oct 5 | New Haven | Cliff Walk → Breakers → Watch Hill → Mystic → Yale | 120.3 | 3h06 | 3h10-3h45 | 20.3 / 11.3 | 31.3% |
| 3 | Tue Oct 6 | New York | Woodbury Common → DUMBO | 145.2 | 3h23 | 3h40-5h35 | 20.1 / 12.7 | 30.9% |
| 4 | Wed Oct 7 | New York | Tenement → St. Nicholas → Oculus → Tram → YOB | 0.0 | Parked | — | 19.9 / 12.5 | 31.0% |
| 5 | Thu Oct 8 | Philadelphia | Grounds For Sculpture → Princeton → Philadelphia | 116.2 | 2h56 | 3h15-4h50 | 21.2 / 11.3 | 31.2% |
| 6 | Fri Oct 9 | Philadelphia | Market → Eastern State → Magic Gardens → Basement | 0.0 | Parked | — | 21.0 / 11.1 | 31.1% |
| 7 | Sat Oct 10 | Washington | Direct transfer → Snallygaster → National Mall | 139.1 | 3h06 | 3h25-5h05 | 22.0 / 12.6 | 27.6% |
| 8 | Sun Oct 11 | Gettysburg | Orthodox liturgy → Dumbarton → O Museum → Frederick | 79.4 | 1h58 | 2h05-2h45 | 20.9 / 8.4 | 27.4% |
| 9 | Mon Oct 12 | Easton | Gettysburg → Bethlehem → SteelStacks → Easton | 145.0 | 3h18 | 3h20-4h00 | 19.4 / 7.3 | 32.7% |
| 10 | Tue Oct 13 | Southbury | Easton → Paterson Great Falls → Southbury | 155.3 | 3h25 | 3h40-4h40 | 18.6 / 9.6 | 31.7% |
| 11 | Wed Oct 14 | Boston | Carousel Museum → Old Sturbridge → Logan hotel | 147.7 | 3h20 | 3h40-5h30 | 17.1 / 8.9 | 33.5% |

Baseline durations come from OSRM road geometry and contain no live traffic. Buffered ranges are transparent risk bands, not forecasts. Days 3, 7, 9, 10 and 11 require a same-day live directions check and the fallbacks encoded in `route.json`; no future dataset can truthfully predict October 2026 traffic now.

## Hidden-gem anchor replacements

Each option is a true substitution, not an extra stop. It includes coordinates, visit-date hours, cost status, descriptions, traveler-fit notes, four-person rating shells, three locally stored attributed images and an alternate road calculation. Replacements remain outside the Magic score until the group promotes one into the chosen itinerary.

| Day | Hidden-gem replacement | Replaces | Variant baseline | Change vs core day |
|---:|---|---|---:|---:|
| 1 | Newport Car Museum | RISD Museum + Benefit Street | 2h19 | -13 min |
| 2 | Submarine Force Museum + USS Nautilus | Mystic Seaport Museum | 3h10 | +4 min |
| 3 | Untermyer Gardens | Woodbury Common | 2h37 | -46 min |
| 4 | Museum at Eldridge Street | Tenement Museum | Parked | Unchanged |
| 5 | Morven Museum & Garden | Princeton Art Museum + Chapel | 2h54 | -2 min |
| 6 | Wagner Free Institute of Science | Eastern State Penitentiary | Parked | Unchanged |
| 7 | National Building Museum | Snallygaster | 3h06 | Unchanged |
| 8 | Hillwood Estate, Museum & Gardens | Dumbarton Oaks | 1h58 | Unchanged |
| 9 | Lost River Caverns | Historic Bethlehem + SteelStacks | 3h20 | +2 min |
| 10 | Ramapo Valley County Reservation | Paterson Great Falls | 3h22 | -3 min |
| 11 | American Clock & Watch Museum | Carousel Museum | 3h24 | +4 min |

The first Day 10 and Day 11 candidates were rejected after geometry checks exceeded the cap. Ramapo and the Clock & Watch Museum are the cap-safe replacements retained in the production dataset.

## Why the return changed

The first draft looked attractive on a map but failed the driving rule. Frederick-Gettysburg-Bethlehem measured 221 minutes, and Beacon-Hartford-Boston measured 247 minutes. The final route moves the October 11 bed to Gettysburg, advances the October 12 bed to Easton, uses Paterson as the October 13 midpoint, sleeps near I-84 in Southbury, and returns through Bristol and Sturbridge. Final Days 9-11 measure 198, 205 and 200 baseline minutes.

The full audit, including rejected Reading, Water Gap, Beacon, Litchfield and Tarrywile variants, is in `route-decisions.json`. This prevents later coding or editing from quietly reintroducing a route already proven to exceed the cap.

## Ratings and Magic score

Every place has four equal traveler rating slots, a 1-5 scale, a best-fit note, person-fit research values, cost status and a flag showing whether it belongs in the Magic score. The route weights are:

- attraction and stop ratings: 45%
- excitement and uniqueness: 20%
- driving comfort: 15%
- traveler fairness: 10%
- cost and value: 5%
- expected weather: 5%

Optional items remain rateable but do not affect the Magic score unless promoted into the final schedule. Person-specific route scores remain separate so the app can show each traveler's favorite route as well as the group winner.

## Deliberate alternatives

- Federal Hill Park and the American Visionary Art Museum are documented Baltimore alternatives. They are not scheduled because they destroy the traffic margin before Snallygaster's fixed 14:00 entry.
- Da Vinci Science Center is a documented rain-day alternative, excluded from the core score and schedule.
- Elfreth's Alley and Historic Bethlehem appear in the schedule as optional cuts and are excluded from the core score unless retained after final voting.

## Booking order

1. Snallygaster, YOB/Saint Vitus and Basement/The Fillmore tickets.
2. Tenement Museum and the Gettysburg licensed guide.
3. O Museum, Grounds For Sculpture and Magic Gardens timed entry.
4. Old Sturbridge Village when the October dated inventory is available.
5. Two-room lodging: one 1-bed room and one 2-bed room, prioritizing safety, cleanliness, parking and late check-in over resort features.

## Dataset inventory

- `route.json` — app-ready route, days, driving legs, weather, fallbacks, lodging areas, budgets and scoring
- `places.json` — 51 coordinates, descriptions, fit notes, categories, hours, costs and four-person rating shells, including embedded replacement-route metadata
- `images.json` — 153 local carousel records with attribution and usage status
- `route.geojson` — core and replacement road LineStrings plus attraction and logistics-node Points
- `route-geometry.json` — raw OSRM leg calculations and route nodes
- `replacement-geometry.json` — all 11 alternate anchor route calculations, leg sequences, deltas and cap results
- `weather-normals.json` — NOAA/NCEI daily climate-normal extracts in Celsius
- `sources.json` — official and primary research registry
- `route-decisions.json` — accepted/rejected routing audit
- `place-seed.json` and `research-raw.json` — reproducible source material for rebuilding the package

Run `node scripts/build-route-package.mjs` after approved data edits, then `node scripts/validate-route-package.mjs` before using this route in the app.
