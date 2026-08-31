# Premium Route 11 — The Hidden Halls, Brass Nights & Moonshot Run

Finished one-way route for October 4-15, 2026. The group collects two cars at Boston Logan, sleeps in Houston on October 14, and returns both cars in Texas on October 15. This route does not return to Boston.

## Finished route

Boston → New Haven → Philadelphia → Baltimore → Shepherdstown → Roanoke → Bristol → Asheville → Atlanta → Montgomery → Mobile → the Mississippi Gulf Coast → New Orleans → Cajun Country → Houston.

- 11 travel days and 11 road hotel nights
- 2,212.5 OSRM baseline road miles and 46h27 baseline driving
- 28 main, separately rateable places
- all 11 former hidden-gem replacements promoted into the real schedule
- zero replacement cards or alternative-only places
- 96 local, visually reviewed images, with three to five per place
- two New Orleans nights and a Houston finish
- protected Orthodox Sunday worship in Mobile
- one Atlanta metal night and one New Orleans live-music night
- no required hike or athletic activity

## Day-by-day route

| Day | Sleep | Main sequence | Miles | Baseline |
|---:|---|---|---:|---:|
| 1 | New Haven | Yale Center for British Art → Yale Art Gallery | 139.8 | 2h53 |
| 2 | Philadelphia | Barnes Foundation → Calder Gardens | 172.8 | 3h50 |
| 3 | Shepherdstown | Baltimore Museum of Industry → Peabody Library | 173.8 | 3h55 |
| 4 | Roanoke | Grand Caverns → Frontier Culture Museum | 223.1 | 4h36 |
| 5 | Asheville | Birthplace of Country Music → Gray Fossil Site | 251.1 | 5h01 |
| 6 | Atlanta | Biltmore → Grovewood → Boggs metal night | 230.9 | 5h17 |
| 7 | Greenville, AL | Fitzgerald Museum → EJI Legacy Sites | 210.6 | 4h05 |
| 8 | New Orleans | Orthodox worship → Walter Anderson → Biloxi Maritime Museum | 279.5 | 5h30 |
| 9 | New Orleans | Whitney → Mardi Gras World → JAMNOLA → Frenchmen music | 104.5 | 2h24 |
| 10 | Lafayette | St. Louis Cemetery → Avery Island → Lake Martin | 181.7 | 4h11 |
| 11 | Houston | Space Center → Buffalo Bayou Cistern → Rothko Chapel | 244.7 | 4h52 |

The normal comparison cap remains 210 minutes. This user-approved premium one-way route has a separate 330-minute baseline ceiling. Every expanded day stays at or below that ceiling. Day 8 reaches exactly 330 minutes, so worship stays protected and the two short Gulf museum visits must flex around live traffic.

## Hidden gems now promoted

The following places are no longer backups. They appear in the measured schedule, daily map, stop queue, and Magic scoring:

- Yale Center for British Art
- Calder Gardens
- George Peabody Library
- Frontier Culture Museum
- Gray Fossil Site
- Grovewood Village
- Scott and Zelda Fitzgerald Museum
- Biloxi Maritime and Seafood Industry Museum
- JAMNOLA
- Avery Island TABASCO Factory and Jungle Gardens
- Buffalo Bayou Park Cistern

Their former route variants remain only as source-code audit history in `scripts/route-11/config.mjs`. `replacement-geometry.json`, `replacement_place_ids`, and UI replacement options are empty.

## Timing locks

- Leave Logan by about 11:30 on Day 1. The two free Yale museums sit beside each other and use short highlight visits.
- Book the first Grand Caverns tour on Day 4 and choose only two farm areas at Frontier Culture Museum.
- Keep Biltmore to the house and one garden. Leave Grovewood by 13:15 for Atlanta.
- The clock moves back one hour before Montgomery. Keep Fitzgerald short and give most of Day 7 to EJI.
- Leave Greenville very early on Sunday. Worship is never shortened for sightseeing.
- Keep the same New Orleans rooms for both nights and leave the music night whenever the group is tired.
- Confirm an approved St. Louis Cemetery tour and a late small Lake Martin boat before locking Day 10.
- Leave Lafayette near 05:30 and reserve both NASA and the Cistern for Day 11.

OSRM does not include live traffic. Check both cars before every departure and shorten a supporting stop instead of rushing or passing the premium ceiling.

## Budget and images

Known admission planning is $548.04 per person. The controllable range is $1,285-$1,850 before lodging, rental cars, fuel, nightlife, and shopping. Early tickets and simple meals can keep the trip near the $1,500 target, but Biltmore, NASA, and all 28 stops create a real upper-range risk.

Of the 96 image records, 67 have reusable production metadata and 29 exact-place venue/editorial files are marked `permission-required-before-public-deployment`. Those 29 files are suitable only for this private prototype until licensed or replaced.

## Build and validation

```bash
node scripts/route-11/build.mjs
node scripts/validate-route-package.mjs route-11-hidden-halls-brass-nights-moonshot-run
npm run optimize:images -- route-11-hidden-halls-brass-nights-moonshot-run 1280
npm run build
```
