# Route 01 — The Gilded Coast & Capital Energy Loop

Canonical Energy Rebuild V2 for October 4–15, 2026. This package replaces the museum-heavy Route 01 rhythm with movement, competition, scenery, sacred architecture, controlled adrenaline, shopping recovery and only three museum-like core experiences whose physical environments justify the stop.

## Package summary

- 39 total places; 35 core-scored and 4 optional/unscored
- 36 uniquely scheduled place cards across 11 days
- 1 route-safe flex stop in a main day and 3 constrained options beneath affected days
- 157 local carousel images
- 1,166.4 OSRM baseline miles; every standard day remains at or below 210 baseline minutes, with the approved 220-minute Day 11 exception documented in data
- 4/35 museum-like core experiences (11.4%), down from the original 51.4% museum/history concentration
- $625.69–$715.7 optional do-everything attraction range per person; free route baseline is $0

## Restored legacy highlights

Newport Car Museum is a core Day 2 anchor because automotive design, real machines and simulators create active visual energy. American Visionary Art Museum is a compact Day 7 core stop because its outsider-art environment adds color between iFLY and Washington. Reading Terminal is now a route-safe, unscored Day 6 breakfast flex. USS Nautilus stays visible beneath Day 2 as a 193-minute weather swap for Napatree; adding both would reach 212 minutes. SteelStacks stays beneath Day 9 because its exact addition reaches 212 minutes. Purgatory Chasm stays beneath Day 11 as a route-redesign option because its additive route reaches 247 minutes against that day's authorized 220-minute limit.

## UI contract

Each place exposes its primary `experience_bucket`, secondary `experience_flags`, four equal rating slots, traveler-fit copy, optional cost model, booking state, coordinates, sources and carousel images. Route-safe flex uses the normal `schedule`; constrained choices use per-day `optional_spots` and remain fully viewable and rateable beneath the main stops. Optional places are excluded from Magic until activated. Route days contain exact schedules and point-to-point OSRM legs; map points and lines are in `route.geojson`.

## Operations

The route is UI-ready but not booking-final. Lock NJ ATV, Treetop Quest, Gettysburg's independent holiday guide and iFLY first. Day 11 returns both cars at Logan before the Boda Borg finale by transit or rideshare. Recheck outdoor closures and replace climate normals with live Celsius forecasts inside the forecast window. New editorial/venue imagery is private-prototype-only until permission is cleared.

Rebuild with `node scripts/build-route-package.mjs`, then validate with `node scripts/validate-route-package.mjs route-01-gilded-coast-capital-loop`.
