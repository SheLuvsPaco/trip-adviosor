# Overall Trip — All 10 Routes: Stops, Types & Drive Log

_Generated from `dataset/manifest.json` and each route's `route.json` / `places.json` on 2026-08-31._

## How to read this file

- One section per route (01–10), one row per day: sleep city, drive summary, and every scheduled stop with its **type bucket**.
- Drive numbers are OSRM road-network **baselines with no live traffic** (per `CLAUDE.md`) — treat as planning minimums, not guarantees.
- `kind` in the dataset is an **open, per-place tag** (350+ unique values, e.g. `cryptid-fieldwork-museum`, `gilded-estate-and-seasonal-design`) — there is no fixed enum. To answer "are we museum-heavy," I bucketed all ~350 tags into 10 categories by keyword (method below). The raw `kind` is kept next to every stop so you can second-guess any call.
- A hidden-gem/replacement stop is a **swap candidate**, not an extra — it's excluded from these counts unless the route's data marks it as already included in the core schedule.

### Type-bucket definitions (methodology)

| Bucket | What it covers |
|---|---|
| Religious & Spiritual | Churches, cathedrals, shrines, active worship services, sacred architecture. |
| Cemetery | Historic cemeteries visited as a stop. |
| Food, Drink & Nightlife | Breweries, dinners, markets, bars, live music, festivals, arcades — evening/social/culinary stops. |
| Shopping | Outlets, bookshops, curiosity shops, dedicated retail stops. |
| Water / Boat Experience | Ferries and boat tours. |
| Museum / Gallery | Indoor curated exhibits: art/history/science museums, galleries, cabinets of curiosities, collections, factories/workshops turned into tours, immersive art installations. |
| Nature & Outdoor | Parks, gardens, waterfalls, trails, caves, overlooks, wildlife, scenic drives — anything primarily about being outside. |
| Historic Site / Architecture | Historic houses, districts, battlefields, forts, civic buildings, industrial heritage, memorials — the site *is* the attraction, not a curated exhibit inside it. |
| Curiosity / Offbeat | Folklore, cryptid lore, roadside oddities, outsider art, optical illusions. |
| Town / Street Walk | Undirected small-town or district walks not centered on one building or exhibit. |

---

## ROUTE-01 — The Gilded Coast & Capital Loop

**Status:** research-complete-bookings-pending  ·  **51 places** · **153 images** · **1144.5 mi baseline** · **11 days** · drive cap **210 min/day**

_A warm-leaning Northeast loop combining coastal scenery, unusual museums, Orthodox sites, three specific music/social events, Gettysburg, industrial Bethlehem, Paterson's urban waterfall and an interior New England return, plus one fully modeled anchor-replacement option for every day._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Newport, RI | 96.3 mi · 2h32m · cap 210m: comfortable | 14:10–15:30 **RISD Museum** _(Museum / Gallery: museum)_<br>15:30–16:00 **Benefit Street Mile of History** _(Historic Site / Architecture: historic-district)_<br>17:20–18:25 **Castle Hill Lighthouse Sunset** _(Nature & Outdoor: viewpoint)_ |
| 2 | 2026-10-05 (Monday) | Newport, RI → New Haven, CT | 120.3 mi · 3h06m · cap 210m: live-traffic-gated | 07:35–08:20 **Newport Cliff Walk** _(Nature & Outdoor: scenic-walk)_<br>09:00–10:30 **The Breakers** _(Historic Site / Architecture: historic-house)_<br>11:45–12:40 **Watch Hill Village and Lighthouse** _(Town / Street Walk: coastal-town)_<br>13:15–16:15 **Mystic Seaport Museum** _(Museum / Gallery: living-history-museum)_<br>17:30–18:25 **Beinecke Rare Book and Manuscript Library** _(Museum / Gallery: library-gallery)_<br>18:45–20:15 **Wooster Square Pizza Night** _(Food, Drink & Nightlife: food-neighborhood)_ |
| 3 | 2026-10-06 (Tuesday) | New Haven, CT → New York, NY | 145.2 mi · 3h23m · cap 210m: live-traffic-gated | 10:00–13:30 **Woodbury Common Premium Outlets** _(Shopping: shopping)_<br>17:00–18:30 **DUMBO and Brooklyn Bridge Park** _(Nature & Outdoor: urban-viewpoint)_ |
| 4 | 2026-10-07 (Wednesday) | New York, NY → New York, NY | 0.0 mi · 0m · cap 210m: comfortable | 10:00–11:30 **Tenement Museum** _(Museum / Gallery: guided-history-museum)_<br>12:30–13:15 **St. Nicholas Greek Orthodox Church and National Shrine** _(Religious & Spiritual: orthodox-church)_<br>13:15–13:45 **The Oculus** _(Historic Site / Architecture: architecture-transit)_<br>14:45–15:45 **Roosevelt Island Tram** _(Nature & Outdoor: scenic-transport)_<br>18:30–22:30 **YOB at Saint Vitus** _(Food, Drink & Nightlife: concert)_ |
| 5 | 2026-10-08 (Thursday) | New York, NY → Philadelphia, PA | 116.2 mi · 2h56m · cap 210m: live-traffic-gated | 10:00–12:30 **Grounds For Sculpture** _(Nature & Outdoor: sculpture-park)_<br>13:05–14:20 **Princeton University Art Museum** _(Museum / Gallery: museum)_<br>14:20–14:40 **Princeton University Chapel** _(Religious & Spiritual: church-architecture)_<br>18:00–18:35 **Elfreth's Alley** _(Historic Site / Architecture: historic-street)_ |
| 6 | 2026-10-09 (Friday) | Philadelphia, PA → Philadelphia, PA | 0.0 mi · 0m · cap 210m: comfortable | 08:15–09:30 **Reading Terminal Market** _(Food, Drink & Nightlife: food-market)_<br>10:00–12:15 **Eastern State Penitentiary** _(Museum / Gallery: history-museum)_<br>14:00–15:15 **Philadelphia's Magic Gardens** _(Curiosity / Offbeat: folk-art-environment)_<br>18:00–22:30 **Basement at The Fillmore Philadelphia** _(Food, Drink & Nightlife: concert)_ |
| 7 | 2026-10-10 (Saturday) | Philadelphia, PA → Washington, DC | 139.1 mi · 3h06m · cap 210m: live-traffic-gated | 14:00–18:00 **Snallygaster 2026** _(Food, Drink & Nightlife: festival)_<br>18:30–19:40 **National Mall Sunset Monument Walk** _(Historic Site / Architecture: monument-walk)_ |
| 8 | 2026-10-11 (Sunday) | Washington, DC → Gettysburg, PA | 79.4 mi · 1h58m · cap 210m: comfortable | 09:00–10:45 **St. Nicholas Orthodox Cathedral** _(Religious & Spiritual: orthodox-cathedral)_<br>11:30–14:15 **Dumbarton Oaks Museum and Gardens** _(Museum / Gallery: museum-garden)_<br>15:00–16:45 **O Museum in The Mansion** _(Museum / Gallery: immersive-museum)_<br>18:00–19:10 **Carroll Creek and Historic Frederick** _(Town / Street Walk: small-town-walk)_ |
| 9 | 2026-10-12 (Monday) | Gettysburg, PA → Easton, PA | 145.0 mi · 3h18m · cap 210m: live-traffic-gated | 08:30–11:30 **Gettysburg Battlefield with Licensed Guide** _(Historic Site / Architecture: guided-battlefield)_<br>14:30–15:25 **Historic Bethlehem Moravian District** _(Historic Site / Architecture: world-heritage-district)_<br>15:45–17:15 **SteelStacks and Hoover-Mason Trestle** _(Historic Site / Architecture: industrial-heritage)_<br>18:10–19:25 **Easton Centre Square Evening Walk** _(Historic Site / Architecture: small-city-historic-district)_ |
| 10 | 2026-10-13 (Tuesday) | Easton, PA → Southbury, CT | 155.3 mi · 3h25m · cap 210m: live-traffic-gated | 09:30–10:45 **Paterson Great Falls and Mill District** _(Nature & Outdoor: urban-national-park)_ |
| 11 | 2026-10-14 (Wednesday) | Southbury, CT → Boston, MA | 147.7 mi · 3h20m · cap 210m: live-traffic-gated | 10:00–11:15 **New England Carousel Museum** _(Museum / Gallery: craft-and-folklore-museum)_<br>12:45–15:15 **Old Sturbridge Village** _(Historic Site / Architecture: living-history-village)_ |

**Type mix for route-01:** Historic Site / Architecture 10, Museum / Gallery 9, Nature & Outdoor 6, Food, Drink & Nightlife 5, Religious & Spiritual 3, Town / Street Walk 2, Shopping 1, Curiosity / Offbeat 1

---

## ROUTE-02 — The Falls, Fire & Clockwork Loop

**Status:** research-complete-bookings-pending  ·  **51 places** · **257 images** · **1281.8 mi baseline** · **11 days** · drive cap **210 min/day**

_A foliage-season US-only loop built around private environmental art, caves, Haudenosaunee culture, glassmaking, Rochester's cult art-and-music spaces, Letchworth, Orthodox Sunday, Niagara, Buffalo architecture and the Erie Canal, with one measured anchor replacement for every day._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Northampton, MA | 136.0 mi · 3h07m · cap 210m: live-traffic-gated | 14:35–15:35 **Lyman Conservatory & Smith Botanic Garden** _(Nature & Outdoor: botanic-conservatory)_<br>16:05–17:35 **Three Sisters Sanctuary** _(Nature & Outdoor: environmental-art-garden)_<br>20:00–21:30 **The Tunnel Bar** _(Food, Drink & Nightlife: cocktail-bar)_ |
| 2 | 2026-10-05 (Monday) | Northampton, MA → Saratoga Springs, NY | 108.9 mi · 3h11m · cap 210m: live-traffic-gated | 10:00–12:30 **MASS MoCA** _(Museum / Gallery: contemporary-art-museum)_<br>13:20–14:20 **Grafton Peace Pagoda** _(Religious & Spiritual: spiritual-landmark)_<br>15:40–16:45 **Saratoga Mineral-Spring Tasting Walk** _(Town / Street Walk: mineral-spring-walk)_<br>17:00–18:00 **Congress Park & Canfield Casino** _(Nature & Outdoor: historic-park)_ |
| 3 | 2026-10-06 (Tuesday) | Saratoga Springs, NY → Cooperstown, NY | 97.1 mi · 2h35m · cap 210m: comfortable | 10:00–11:30 **Howe Caverns Traditional Tour** _(Nature & Outdoor: cave-tour)_<br>11:45–13:00 **Iroquois Museum** _(Museum / Gallery: indigenous-museum)_<br>14:20–15:00 **Council Rock & Otsego Lakefront** _(Nature & Outdoor: lakefront-viewpoint)_<br>15:30–17:30 **Brewery Ommegang Farmstead Taproom** _(Food, Drink & Nightlife: brewery-taproom)_ |
| 4 | 2026-10-07 (Wednesday) | Cooperstown, NY → Ithaca, NY | 135.6 mi · 3h21m · cap 210m: live-traffic-gated | 10:00–11:00 **Fenimore Farm & Country Village** _(Museum / Gallery: living-history-museum)_<br>11:00–11:20 **The Cardiff Giant** _(Historic Site / Architecture: historic-hoax)_<br>11:20–11:45 **Empire State Carousel** _(Curiosity / Offbeat: folk-art-carousel)_<br>14:35–16:05 **Taughannock Falls Gorge Walk** _(Nature & Outdoor: waterfall-walk)_<br>16:35–17:25 **Cornell Botanic Gardens & Newman Arboretum** _(Nature & Outdoor: botanic-garden)_ |
| 5 | 2026-10-08 (Thursday) | Ithaca, NY → Rochester, NY | 146.5 mi · 3h09m · cap 210m: live-traffic-gated | 08:10–08:40 **Ithaca Falls at Lake Street** _(Nature & Outdoor: urban-waterfall)_<br>09:45–12:30 **Corning Museum of Glass** _(Museum / Gallery: art-science-museum)_<br>12:45–13:30 **Make Your Own Glass: Fall Object** _(Museum / Gallery: hands-on-workshop)_<br>15:40–16:35 **High Falls & Pont de Rennes View** _(Nature & Outdoor: industrial-waterfall-view)_ |
| 6 | 2026-10-09 (Friday) | Rochester, NY → Rochester, NY | 0.0 mi · 0m · cap 210m: comfortable | 10:00–11:45 **George Eastman Museum** _(Museum / Gallery: photography-film-museum)_<br>12:15–14:15 **ARTISANworks** _(Museum / Gallery: immersive-art-maze)_<br>14:35–15:35 **House of Guitars** _(Shopping: cult-music-store)_<br>19:00–23:00 **Radio Social Bowling Night** _(Food, Drink & Nightlife: social-games-night)_ |
| 7 | 2026-10-10 (Saturday) | Rochester, NY → Buffalo, NY | 123.4 mi · 3h07m · cap 210m: live-traffic-gated | 07:30–09:00 **Rochester Public Market** _(Food, Drink & Nightlife: public-market)_<br>10:30–13:15 **Letchworth Three-Falls Drive** _(Nature & Outdoor: waterfall-scenic-drive)_<br>14:50–16:20 **Canalside & Grain-Elevator Skyline** _(Historic Site / Architecture: waterfront-district)_<br>20:00–24:00 **Elmwood–Essex–Allentown Music Circuit** _(Food, Drink & Nightlife: live-music-bar-circuit)_ |
| 8 | 2026-10-11 (Sunday) | Buffalo, NY → Buffalo, NY | 48.4 mi · 1h21m · cap 210m: comfortable | 08:45–11:30 **Orthros & Divine Liturgy at Annunciation** _(Religious & Spiritual: orthodox-church-service)_<br>12:15–13:15 **Niagara Power Vista** _(Museum / Gallery: interactive-power-museum)_<br>13:45–15:00 **Maid of the Mist** _(Water / Boat Experience: boat-experience)_<br>15:15–16:30 **Cave of the Winds** _(Nature & Outdoor: waterfall-deck-experience)_<br>17:00–19:00 **Goat Island & Terrapin Point Illumination** _(Nature & Outdoor: night-waterfall-view)_ |
| 9 | 2026-10-12 (Monday) | Buffalo, NY → Syracuse, NY | 154.8 mi · 3h17m · cap 210m: live-traffic-gated | 09:30–10:45 **Frank Lloyd Wright's Martin House** _(Historic Site / Architecture: architecture-tour)_<br>11:30–12:30 **Theodore Roosevelt Inaugural Site** _(Historic Site / Architecture: guided-history-site)_<br>16:15–19:15 **Armory Square Slow Evening** _(Historic Site / Architecture: historic-dining-district)_ |
| 10 | 2026-10-13 (Tuesday) | Syracuse, NY → Albany, NY | 162.6 mi · 3h30m · cap 210m: live-traffic-gated | 10:00–10:50 **Erie Canal Museum & 1850 Weighlock** _(Museum / Gallery: infrastructure-museum)_<br>13:45–14:55 **Albany Pine Bush Discovery Center** _(Nature & Outdoor: rare-ecosystem-center)_<br>15:15–16:30 **New York State Capitol & Empire State Plaza** _(Historic Site / Architecture: civic-architecture)_ |
| 11 | 2026-10-14 (Wednesday) | Albany, NY → Boston, MA | 168.5 mi · 3h27m · cap 210m: live-traffic-gated | 10:00–11:30 **TurnPark Art Space** _(Nature & Outdoor: quarry-sculpture-park)_ |

**Type mix for route-02:** Nature & Outdoor 14, Museum / Gallery 9, Historic Site / Architecture 6, Food, Drink & Nightlife 5, Religious & Spiritual 2, Town / Street Walk 1, Curiosity / Offbeat 1, Shopping 1, Water / Boat Experience 1

---

## ROUTE-03 — The Wild Shore, Rockets & Folklore Loop

**Status:** research-complete-bookings-pending  ·  **50 places** · **246 images** · **1415.6 mi baseline** · **11 days** · drive cap **210 min/day**

_A warmer-leaning Atlantic loop where ferries replace highway monotony: Long Island marshes and architecture, Asbury pinball and live music, Cape May oddities, Fort Miles, Assateague horses, NASA Wallops, the Chesapeake Bay Bridge-Tunnel, Norfolk and Richmond, Orthodox Sunday, industrial history and an exact-date Sleepy Hollow finale._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Greenport, NY | 146.6 mi · 3h05m · cap 210m: live-traffic-gated | 14:15–15:45 **Florence Griswold Museum & Artists' Colony** _(Historic Site / Architecture: art-colony-house)_<br>17:00–18:20 **Cross Sound Ferry: New London to Orient Point** _(Water / Boat Experience: vehicle-ferry-experience)_<br>18:45–20:00 **Greenport Harbor & Mitchell Park Carousel** _(Curiosity / Offbeat: harbor-carousel-walk)_ |
| 2 | 2026-10-05 (Monday) | Greenport, NY → Riverhead, NY | 41.3 mi · 1h36m · cap 210m: comfortable | 08:15–08:30 **North Ferry to Shelter Island** _(Water / Boat Experience: short-vehicle-ferry)_<br>09:00–10:30 **Mashomack Preserve: Red Trail Sampler** _(Town / Street Walk: coastal-preserve-walk)_<br>10:50–11:05 **South Ferry to North Haven** _(Water / Boat Experience: short-vehicle-ferry)_<br>11:35–13:20 **Parrish Art Museum** _(Museum / Gallery: contemporary-art-museum)_<br>14:00–14:30 **The Big Duck** _(Historic Site / Architecture: mimetic-roadside-architecture)_<br>14:50–17:50 **Tanger Outlets Riverhead** _(Shopping: outlet-shopping)_ |
| 3 | 2026-10-06 (Tuesday) | Riverhead, NY → Asbury Park, NJ | 137.8 mi · 3h18m · cap 210m: live-traffic-gated | 10:00–12:30 **Cradle of Aviation Museum** _(Museum / Gallery: aviation-space-museum)_<br>15:20–16:35 **Asbury Boardwalk, Convention Hall & Carousel Ruins** _(Historic Site / Architecture: boardwalk-architecture-walk)_<br>16:45–18:45 **Silverball Retro Arcade** _(Food, Drink & Nightlife: free-play-pinball-museum)_<br>19:45–23:45 **Asbury Live-Music Night** _(Food, Drink & Nightlife: live-music-district)_ |
| 4 | 2026-10-07 (Wednesday) | Asbury Park, NJ → Cape May, NJ | 119.6 mi · 2h41m · cap 210m: live-traffic-gated | 10:00–11:00 **Lucy the Elephant** _(Curiosity / Offbeat: zoomorphic-building)_<br>12:25–14:40 **NAS Wildwood Aviation Museum** _(Museum / Gallery: working-hangar-aviation-museum)_<br>15:10–16:55 **Cape May Victorian Architecture Walk** _(Historic Site / Architecture: historic-district-walk)_<br>19:00–20:30 **Cape May Spirits & Oddities Trolley** _(Curiosity / Offbeat: folklore-trolley)_ |
| 5 | 2026-10-08 (Thursday) | Cape May, NJ → Chincoteague, VA | 109.4 mi · 3h02m · cap 210m: live-traffic-gated | 08:30–09:55 **Cape May-Lewes Ferry** _(Water / Boat Experience: vehicle-ferry-experience)_<br>10:35–12:20 **Fort Miles: Battery 519** _(Museum / Gallery: coastal-defense-museum)_<br>12:25–13:10 **Great Dune & Fire-Control Tower** _(Nature & Outdoor: dune-observation-walk)_<br>14:20–15:20 **Berlin Main Street & Atlantic Hotel** _(Town / Street Walk: small-town-evening)_<br>15:40–17:10 **Assateague Wild-Horse Golden Hour** _(Nature & Outdoor: barrier-island-wildlife)_ |
| 6 | 2026-10-09 (Friday) | Chincoteague, VA → Norfolk, VA | 116.4 mi · 3h19m · cap 210m: live-traffic-gated | 10:00–11:00 **NASA Wallops Visitor Center** _(Museum / Gallery: rocket-science-center)_<br>12:25–13:55 **Barrier Islands Center** _(Museum / Gallery: island-culture-museum)_<br>15:00–15:35 **Chesapeake Bay Bridge-Tunnel Crossing** _(Historic Site / Architecture: engineering-landscape)_ |
| 7 | 2026-10-10 (Saturday) | Norfolk, VA → Richmond, VA | 143.9 mi · 3h24m · cap 210m: live-traffic-gated | 08:20–08:50 **Norfolk Pagoda & Oriental Garden** _(Nature & Outdoor: waterfront-garden)_<br>09:00–11:15 **Nauticus & Battleship Wisconsin** _(Museum / Gallery: battleship-maritime-museum)_<br>12:00–13:15 **Edgar Cayce A.R.E. Headquarters** _(Museum / Gallery: metaphysical-archive)_<br>13:25–13:55 **ViBe Murals & King Neptune** _(Town / Street Walk: public-art-boardwalk-stop)_<br>16:05–16:55 **Poe Museum & Enchanted Garden** _(Museum / Gallery: literary-gothic-museum)_ |
| 8 | 2026-10-11 (Sunday) | Richmond, VA → Baltimore East, MD | 163.2 mi · 3h27m · cap 210m: live-traffic-gated | 08:15–11:30 **Saints Constantine & Helen Divine Liturgy** _(Religious & Spiritual: orthodox-cathedral-service)_<br>14:00–16:00 **B&O Railroad Museum** _(Museum / Gallery: railroad-roundhouse-museum)_ |
| 9 | 2026-10-12 (Monday) | Baltimore East, MD → Metuchen, NJ | 160.3 mi · 3h30m · cap 210m: live-traffic-gated | 10:30–12:45 **Mutter Museum** _(Museum / Gallery: medical-history-cabinet)_<br>17:30–19:00 **Metuchen Main Street Reset** _(Town / Street Walk: walkable-small-town-center)_ |
| 10 | 2026-10-13 (Tuesday) | Metuchen, NJ → Fairfield, CT | 116.4 mi · 2h59m · cap 210m: live-traffic-gated | 10:15–11:45 **Sleepy Hollow Cemetery** _(Cemetery: literary-garden-cemetery)_<br>12:00–12:45 **Old Dutch Church & Burying Ground** _(Religious & Spiritual: historic-churchyard)_<br>12:45–13:15 **Headless Horseman Bridge & Statue** _(Curiosity / Offbeat: folklore-landscape-stop)_<br>19:00–20:00 **Great Jack O'Lantern Blaze** _(Museum / Gallery: immersive-pumpkin-night)_ |
| 11 | 2026-10-14 (Wednesday) | Fairfield, CT → Boston, MA | 160.6 mi · 3h27m · cap 210m: live-traffic-gated | 10:00–11:15 **PEZ Visitor Center & Factory Window** _(Museum / Gallery: candy-design-museum)_ |

**Type mix for route-03:** Museum / Gallery 13, Historic Site / Architecture 5, Water / Boat Experience 4, Curiosity / Offbeat 4, Town / Street Walk 4, Nature & Outdoor 3, Food, Drink & Nightlife 2, Religious & Spiritual 2, Shopping 1, Cemetery 1

---

## ROUTE-04 — The Trolls, Moon Rocks & Curiosity Coast Loop

**Status:** research-complete-bookings-pending  ·  **48 places** · **239 images** · **1063.4 mi baseline** · **11 days** · drive cap **210 min/day**

_A peak-foliage curiosity loop built around giant forest trolls, Acadia sunrise, cryptids, moon and Mars rocks, a Victorian natural-history cabinet, Orthodox Sunday, folk-art memorials, machine-tool history and two Frank Lloyd Wright homes. It is Route 4's coolest-weather option, so every day carries Celsius normals and bad-weather substitutions._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Portsmouth, NH | 86.2 mi · 2h09m · cap 210m: comfortable | 13:30–14:25 **Nubble Light from Sohier Park** _(Nature & Outdoor: lighthouse-viewpoint)_<br>15:05–16:20 **USS Albacore: The Teardrop-Hull Experiment** _(Museum / Gallery: experimental-submarine)_<br>16:35–17:15 **African Burying Ground Memorial Park** _(Historic Site / Architecture: memorial-landscape)_ |
| 2 | 2026-10-05 (Monday) | Portsmouth, NH → Portland, ME | 63.9 mi · 1h35m · cap 210m: comfortable | 10:00–11:15 **Victoria Mansion: Technology in a Gilded Interior** _(Historic Site / Architecture: historic-house)_<br>12:00–13:40 **Portland Head Light & Fort Williams** _(Historic Site / Architecture: lighthouse-fort-landscape)_<br>16:15–17:15 **Eastern Promenade Blue-Hour Walk** _(Nature & Outdoor: bay-overlook)_<br>20:00–22:30 **Arcadia Pinball & Local-Tap Night** _(Food, Drink & Nightlife: arcade-social-night)_ |
| 3 | 2026-10-06 (Tuesday) | Portland, ME → Rockland, ME | 103.8 mi · 2h38m · cap 210m: comfortable | 09:00–12:00 **Guardians of the Seeds at Coastal Maine Botanical Gardens** _(Nature & Outdoor: giant-troll-garden)_<br>13:35–14:25 **Maine State Prison Showroom** _(Shopping: prison-industries-shop)_<br>15:15–16:55 **Rockland Breakwater Lighthouse Walk** _(Town / Street Walk: granite-breakwater-walk)_ |
| 4 | 2026-10-07 (Wednesday) | Rockland, ME → Bar Harbor, ME | 106.6 mi · 3h01m · cap 210m: live-traffic-gated | 10:00–12:00 **Owls Head Transportation Museum** _(Museum / Gallery: operating-machine-museum)_<br>13:35–15:40 **Fort Knox & Penobscot Narrows Observatory** _(Nature & Outdoor: fort-and-bridge-observatory)_<br>17:10–18:15 **Bar Harbor Shore Path at Blue Hour** _(Historic Site / Architecture: historic-waterfront-path)_ |
| 5 | 2026-10-08 (Thursday) | Bar Harbor, ME → Bangor, ME | 80.1 mi · 2h46m · cap 210m: comfortable | 05:30–06:50 **Cadillac Mountain Sunrise** _(Nature & Outdoor: reserved-sunrise-summit)_<br>07:15–09:05 **Ocean Path: Sand Beach to Thunder Hole Sampler** _(Nature & Outdoor: coastal-cliff-walk)_<br>09:35–10:35 **Jordan Pond & the Bubbles View** _(Nature & Outdoor: glacial-pond-view)_<br>12:30–14:00 **International Cryptozoology Museum—New Bangor Home** _(Museum / Gallery: cryptid-museum)_<br>14:20–14:40 **Stephen King's House—Public-Road Exterior** _(Historic Site / Architecture: literary-architecture-stop)_<br>15:00–15:35 **Thomas Hill Standpipe at Sunset** _(Historic Site / Architecture: industrial-water-landmark)_ |
| 6 | 2026-10-09 (Friday) | Bangor, ME → Bethel, ME | 140.0 mi · 3h08m · cap 210m: live-traffic-gated | 09:00–10:50 **Cole Land Transportation Museum** _(Museum / Gallery: transport-and-veteran-museum)_<br>13:25–15:55 **Maine Mineral & Gem Museum: Hold the Moon** _(Museum / Gallery: mineral-and-meteorite-museum)_<br>16:10–17:25 **Bethel Common & Mountain-Town Evening** _(Historic Site / Architecture: quiet-village-evening)_ |
| 7 | 2026-10-10 (Saturday) | Bethel, ME → Montpelier, VT | 116.6 mi · 2h58m · cap 210m: live-traffic-gated | 10:00–11:25 **Weeks State Park: Summit House & Fire Tower** _(Historic Site / Architecture: mountaintop-historic-estate)_<br>12:35–13:35 **Fall for St. J Foliage Train** _(Historic Site / Architecture: historic-foliage-train)_<br>13:50–15:40 **Fairbanks Museum's Victorian Cabinet** _(Museum / Gallery: natural-history-cabinet)_ |
| 8 | 2026-10-11 (Sunday) | Montpelier, VT → Burlington, VT | 71.4 mi · 2h03m · cap 210m: comfortable | 07:00–07:45 **Hope Cemetery: Barre's Granite Autobiography** _(Cemetery: carvers-cemetery)_<br>09:00–11:30 **Sunday at Dormition Greek Orthodox Church** _(Religious & Spiritual: orthodox-divine-liturgy)_<br>12:10–15:50 **Shelburne Museum: The Three-Hour Treasure Hunt** _(Museum / Gallery: open-air-collection-campus)_<br>16:15–18:15 **Burlington Waterfront & Church Street** _(Nature & Outdoor: lakefront-city-walk)_<br>20:30–23:00 **Radio Bean Calendar-Gated Music Night** _(Food, Drink & Nightlife: small-room-live-music)_ |
| 9 | 2026-10-12 (Monday) | Burlington, VT → Woodstock, VT | 126.1 mi · 3h16m · cap 210m: live-traffic-gated | 10:00–11:05 **Ben & Jerry's Flavor Graveyard—No Fake Factory Tour** _(Food, Drink & Nightlife: food-design-stop)_<br>13:20–15:30 **Plymouth Notch: The Night a Farmhouse Became the White House** _(Historic Site / Architecture: presidential-village)_ |
| 10 | 2026-10-13 (Tuesday) | Woodstock, VT → Manchester, NH | 111.6 mi · 2h41m · cap 210m: comfortable | 08:30–09:05 **Quechee Gorge from the Reopened Bridge** _(Nature & Outdoor: gorge-overlook)_<br>10:00–12:00 **American Precision Museum in the 1846 Armory** _(Museum / Gallery: machine-tool-museum)_<br>12:40–14:00 **Saint-Gaudens Sculpture Grounds—Tuesday Exterior Edition** _(Historic Site / Architecture: artist-estate-grounds)_ |
| 11 | 2026-10-14 (Wednesday) | Manchester, NH → Boston, MA | 57.1 mi · 1h14m · cap 210m: comfortable | 09:30–11:30 **Frank Lloyd Wright's Zimmerman & Kalil Houses** _(Historic Site / Architecture: guided-modernist-house-tour)_<br>11:30–12:40 **Currier Museum Highlights** _(Museum / Gallery: art-museum)_ |

**Type mix for route-04:** Historic Site / Architecture 12, Nature & Outdoor 9, Museum / Gallery 9, Food, Drink & Nightlife 3, Shopping 1, Town / Street Walk 1, Cemetery 1, Religious & Spiritual 1

---

## ROUTE-05 — The Coal Veins, Caverns & Blue Ridge Secrets Loop

**Status:** research-complete-bookings-pending  ·  **42 places** · **219 images** · **1412.2 mi baseline** · **11 days** · drive cap **210 min/day**

_A warmer Appalachian loop that opens with a Gothic art castle and a handmade biblical hill, descends into an anthracite mine and caverns, then climbs through Harpers Ferry and Skyline Drive to a truth-centered Charlottesville art, history and live-music day. The return uses Orthodox Sunday, Civil War medicine, a Moravian farm, respectful institutional reuse and a stained-glass globe._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Danbury, CT | 161.9 mi · 3h25m · cap 210m: live-traffic-gated | 14:15–15:45 **Wadsworth Atheneum Museum of Art** _(Museum / Gallery: castle-art-museum)_<br>16:25–17:25 **Holy Land USA & Stations Trail** _(Religious & Spiritual: folk-religious-landscape)_ |
| 2 | 2026-10-05 (Monday) | Danbury, CT → Scranton, PA | 146.2 mi · 3h13m · cap 210m: near-cap | 10:45–12:30 **Lackawanna Coal Mine Tour** _(Historic Site / Architecture: underground-industry)_<br>13:10–14:50 **Steamtown National Historic Site** _(Historic Site / Architecture: rail-industry)_<br>15:05–15:40 **Scranton Iron Furnaces** _(Historic Site / Architecture: industrial-ruins)_ |
| 3 | 2026-10-06 (Tuesday) | Scranton, PA → Lancaster, PA | 142.1 mi · 3h13m · cap 210m: near-cap | 10:25–12:05 **National Watch & Clock Museum** _(Museum / Gallery: time-machine-museum)_<br>13:00–14:15 **Lancaster Central Market** _(Food, Drink & Nightlife: historic-food-hall)_<br>14:25–15:20 **Lancaster Troll Market** _(Shopping: curiosity-shop)_ |
| 4 | 2026-10-07 (Wednesday) | Lancaster, PA → Harrisburg, PA | 81.6 mi · 2h12m · cap 210m: comfortable | 09:00–10:35 **Ephrata Cloister** _(Religious & Spiritual: radical-religious-settlement)_<br>11:20–13:20 **Railroad Museum of Pennsylvania** _(Museum / Gallery: rail-mega-museum)_<br>13:35–14:05 **Eshelman's Mill Covered Bridge** _(Nature & Outdoor: covered-bridge)_<br>16:15–17:20 **Harrisburg Riverfront & Walnut Street Bridge** _(Nature & Outdoor: riverfront-blue-hour)_ |
| 5 | 2026-10-08 (Thursday) | Harrisburg, PA → Winchester, VA | 134.9 mi · 3h15m · cap 210m: near-cap | 08:45–10:00 **Pennsylvania State Capitol** _(Historic Site / Architecture: civic-palace)_<br>11:55–13:45 **Antietam National Battlefield** _(Historic Site / Architecture: battlefield-landscape)_<br>14:35–16:10 **Harpers Ferry Lower Town & The Point** _(Historic Site / Architecture: confluence-history)_<br>16:10–16:55 **Storer College & Camp Hill** _(Historic Site / Architecture: education-freedom-site)_<br>16:55–17:50 **Virginius Island Ruins Trail** _(Nature & Outdoor: industrial-ruins-trail)_ |
| 6 | 2026-10-09 (Friday) | Winchester, VA → Charlottesville, VA | 123.2 mi · 3h20m · cap 210m: live-traffic-gated | 09:00–10:50 **Luray Caverns** _(Nature & Outdoor: show-cave)_<br>11:45–12:45 **Skyline Drive Overlook Sequence** _(Nature & Outdoor: scenic-drive)_<br>12:50–14:10 **Stony Man Summit** _(Nature & Outdoor: short-summit-hike)_<br>17:30–20:00 **Charlottesville Downtown Mall** _(Historic Site / Architecture: pedestrian-social-district)_ |
| 7 | 2026-10-10 (Saturday) | Charlottesville, VA → Charlottesville, VA | 18.9 mi · 47m · cap 210m: comfortable | 08:30–11:00 **Monticello - From Slavery to Freedom** _(Historic Site / Architecture: truth-centered-historic-house)_<br>11:25–12:30 **Jefferson School African American Heritage Center** _(Historic Site / Architecture: community-history-center)_<br>13:30–14:45 **Kluge-Ruhe Aboriginal Art Collection** _(Museum / Gallery: indigenous-art-museum)_<br>15:10–16:55 **IX Art Park & The Looking Glass** _(Museum / Gallery: immersive-art-playground)_<br>20:00–22:30 **Morgan Wade at The Jefferson Theater** _(Food, Drink & Nightlife: live-music-night)_ |
| 8 | 2026-10-11 (Sunday) | Charlottesville, VA → Frederick, MD | 130.7 mi · 3h15m · cap 210m: near-cap | 09:00–11:30 **Transfiguration Greek Orthodox Church** _(Religious & Spiritual: orthodox-sunday)_<br>14:45–16:30 **National Museum of Civil War Medicine** _(Museum / Gallery: medical-history-museum)_ |
| 9 | 2026-10-12 (Monday) | Frederick, MD → Bethlehem, PA | 160.2 mi · 3h27m · cap 210m: live-traffic-gated | 12:30–14:10 **Burnside Plantation** _(Nature & Outdoor: moravian-farm-landscape)_ |
| 10 | 2026-10-13 (Tuesday) | Bethlehem, PA → Newtown, CT | 158.4 mi · 3h27m · cap 210m: live-traffic-gated | 13:30–15:05 **Fairfield Hills Adaptive-Reuse Campus** _(Historic Site / Architecture: institutional-reuse-landscape)_ |
| 11 | 2026-10-14 (Wednesday) | Newtown, CT → Boston, MA | 154.1 mi · 3h18m · cap 210m: near-cap | 10:30–11:50 **Mapparium Globe** _(Museum / Gallery: immersive-stained-glass-map)_ |

**Type mix for route-05:** Historic Site / Architecture 11, Museum / Gallery 7, Nature & Outdoor 7, Religious & Spiritual 3, Food, Drink & Nightlife 2, Shopping 1

---

## ROUTE-06 — The Mothman, Steel Cathedrals & Cabinet of Evidence Loop

**Status:** research-complete-expanded-bookings-pending  ·  **50 places** · **184 images** · **1702.4 mi baseline** · **11 days** · drive cap **210 min/day**

_An evidence-and-wonder loop that moves from handmade carousels and a woodland megalith park into military and mining history, Pittsburgh's hidden architectural rooms and maximalist collections, then the Mothman/TNT corridor and Weston's difficult institutional history. Orthodox Sunday, small-town craft, an aquarium-filled retail spectacle and a post-car-return Museum of Bad Art finale keep the return distinct and intentionally lighter._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Danbury, CT | 161.2 mi · 3h25m · cap 210m: live-traffic-gated | 15:30–16:45 **New England Carousel Museum** _(Museum / Gallery: working-folk-art-museum)_ |
| 2 | 2026-10-05 (Monday) | Danbury, CT → Nazareth, PA | 145.6 mi · 3h25m · cap 210m: live-traffic-gated | 11:15–13:00 **Columcille Megalith Park** _(Nature & Outdoor: woodland-megalith-landscape)_ |
| 3 | 2026-10-06 (Tuesday) | Nazareth, PA → Carlisle, PA | 131.1 mi · 3h05m · cap 210m: comfortable | 11:00–12:15 **Reading Public Museum & Arboretum** _(Nature & Outdoor: art-science-arboretum)_<br>13:35–15:50 **U.S. Army Heritage & Education Center** _(Historic Site / Architecture: evidence-first-military-history)_<br>16:15–16:55 **LeTort Spring Run Nature Trail** _(Nature & Outdoor: limestone-stream-reset)_<br>17:10–18:40 **Molly Pitcher Brewing Company** _(Food, Drink & Nightlife: local-brewery-social-dinner)_ |
| 4 | 2026-10-07 (Wednesday) | Carlisle, PA → Somerset, PA | 142.2 mi · 3h28m · cap 210m: live-traffic-gated | 09:25–09:40 **Dunkle's Gulf Station** _(Historic Site / Architecture: art-deco-roadside-architecture)_<br>10:05–10:35 **Gravity Hill, Bedford County** _(Curiosity / Offbeat: roadside-optical-illusion)_<br>11:55–12:55 **Somerset Historical Center** _(Historic Site / Architecture: living-rural-history-landscape)_<br>13:10–14:30 **Quecreek Mine Rescue Site** _(Historic Site / Architecture: working-class-rescue-memorial)_<br>14:45–15:25 **Uptown Somerset Architecture Walk** _(Historic Site / Architecture: small-town-architecture-walk)_ |
| 5 | 2026-10-08 (Thursday) | Somerset, PA → Wheeling, WV | 139.4 mi · 3h19m · cap 210m: comfortable | 10:30–12:00 **Nationality Rooms at the Cathedral of Learning** _(Historic Site / Architecture: architecture-inside-a-skyscraper)_<br>12:25–13:10 **Saint Anthony Chapel** _(Religious & Spiritual: sacred-architecture-relics)_<br>13:35–14:45 **Bicycle Heaven** _(Museum / Gallery: maximalist-bike-museum)_<br>15:00–15:30 **Randyland** _(Curiosity / Offbeat: outsider-art-yard)_<br>16:00–17:15 **The Church Brew Works** _(Religious & Spiritual: church-adaptive-reuse-dinner)_<br>19:00–19:35 **Wheeling Heritage Port & Riverfront** _(Nature & Outdoor: blue-hour-riverfront)_ |
| 6 | 2026-10-09 (Friday) | Wheeling, WV → Point Pleasant, WV | 159.3 mi · 3h21m · cap 210m: live-traffic-gated | 09:00–10:00 **Grave Creek Mound Archaeological Complex** _(Historic Site / Architecture: indigenous-archaeology-earthwork)_<br>12:15–13:15 **Mothman Museum** _(Museum / Gallery: cryptid-evidence-cabinet)_<br>13:15–13:35 **Mothman Statue** _(Curiosity / Offbeat: roadside-icon)_<br>13:35–14:05 **Point Pleasant Floodwall Murals** _(Nature & Outdoor: riverfront-public-history)_<br>14:05–14:40 **Tu-Endie-Wei State Park** _(Historic Site / Architecture: river-confluence-battlefield)_<br>15:05–16:20 **McClintic Wildlife Management Area / TNT Area** _(Nature & Outdoor: wartime-ruins-wetland)_ |
| 7 | 2026-10-10 (Saturday) | Point Pleasant, WV → Weston, WV | 164.3 mi · 3h30m · cap 210m: at-cap-live-traffic-gated | 10:00–11:00 **Flatwoods Monster Museum** _(Curiosity / Offbeat: small-town-ufo-folklore)_<br>12:30–13:15 **Trans-Allegheny Lunatic Asylum - Historic Tour** _(Historic Site / Architecture: institutional-history)_<br>13:25–14:35 **Museum of American Glass in West Virginia** _(Museum / Gallery: regional-craft-archive)_<br>14:40–15:35 **Mountaineer Military Museum** _(Museum / Gallery: veteran-oral-history-museum)_<br>15:50–16:50 **Lambert's Winery** _(Food, Drink & Nightlife: stone-winery-quiet-evening)_ |
| 8 | 2026-10-11 (Sunday) | Weston, WV → Everett, PA | 170.2 mi · 3h30m · cap 210m: at-cap-live-traffic-gated | 09:30–12:00 **Assumption Greek Orthodox Church** _(Religious & Spiritual: canonical-orthodox-parish)_<br>14:25–15:30 **Fort Bedford Museum** _(Museum / Gallery: frontier-logistics-museum)_<br>15:35–15:55 **Espy House & Whiskey Rebellion Marker** _(Historic Site / Architecture: whiskey-rebellion-history)_<br>16:15–16:55 **Historic Everett / Bloody Run Walk** _(Town / Street Walk: railroad-small-town-walk)_ |
| 9 | 2026-10-12 (Monday) | Everett, PA → Allentown West, PA | 168.1 mi · 3h27m · cap 210m: live-traffic-gated | 11:00–12:30 **Cabela's Hamburg - Conservation Mountain & Aquariums** _(Museum / Gallery: museum-sized-retail-spectacle)_ |
| 10 | 2026-10-13 (Tuesday) | Allentown West, PA → Danbury, CT | 159.4 mi · 3h29m · cap 210m: live-traffic-gated | 11:40–14:10 **Tarrywile Park & Mansion Grounds** _(Nature & Outdoor: estate-meadow-reset)_ |
| 11 | 2026-10-14 (Wednesday) | Danbury, CT → Boston, MA | 161.6 mi · 3h25m · cap 210m: live-traffic-gated | 11:45–12:45 **African Meeting House & Abiel Smith School** _(Historic Site / Architecture: black-abolition-history)_<br>13:25–14:15 **MIT List Visual Arts Center** _(Museum / Gallery: experimental-contemporary-art)_<br>15:15–17:00 **Museum of Bad Art at Dorchester Brewing** _(Museum / Gallery: bad-art-gallery)_ |

**Type mix for route-06:** Historic Site / Architecture 11, Museum / Gallery 9, Nature & Outdoor 7, Curiosity / Offbeat 4, Religious & Spiritual 3, Food, Drink & Nightlife 2, Town / Street Walk 1

---

## ROUTE-07 — The Kazoos, Rock & Mechanical Dreams Loop

**Status:** research-complete-expanded-bookings-pending  ·  **50 places** · **192 images** · **1528.2 mi baseline** · **11 days** · drive cap **210 min/day**

_A sound-and-machinery loop that begins with museum choice, finds Uncle Sam's real grave, traces boxing and suffrage through small cities, then reaches a working kazoo factory, Lake Erie ecology and Cleveland's rock history. The exact Sugar show makes the endpoint count; Orthodox Sunday, giant trucks, roadside architecture and a 38-foot Uncle Sam turn the homeward line into a separate story._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Springfield, MA | 93.5 mi · 1h59m · cap 210m: comfortable | 14:15–16:45 **Springfield Museums** _(Museum / Gallery: five-museum-cultural-campus)_<br>17:00–18:20 **The Student Prince & The Fort** _(Food, Drink & Nightlife: historic-german-dinner)_<br>18:30–19:15 **MGM Springfield Art & Salvaged-Architecture Walk** _(Historic Site / Architecture: free-hotel-art-architecture)_ |
| 2 | 2026-10-05 (Monday) | Springfield, MA → Troy, NY | 106.1 mi · 2h44m · cap 210m: comfortable | 10:45–11:45 **Peebles Island River-Rapids Loop** _(Nature & Outdoor: easy-river-nature-reset)_<br>12:00–12:30 **Cohoes Falls View Park** _(Nature & Outdoor: urban-waterfall-overlook)_<br>13:00–13:45 **Oakwood Cemetery: Uncle Sam Grave & Earl Chapel Grounds** _(Cemetery: victorian-cemetery-history)_<br>14:10–14:55 **EMPAC — The Cedar Hull** _(Historic Site / Architecture: experimental-architecture-acoustics)_<br>15:10–16:10 **Downtown Troy: Pediments, Brackets & Bays** _(Historic Site / Architecture: gilded-age-street-architecture)_<br>16:20–17:50 **Brown's Troy Taproom & Hudson Deck** _(Food, Drink & Nightlife: riverfront-brewery-evening)_ |
| 3 | 2026-10-06 (Tuesday) | Troy, NY → Syracuse, NY | 158.4 mi · 3h23m · cap 210m: live-traffic-gated | 10:45–12:00 **International Boxing Hall of Fame** _(Museum / Gallery: combat-sport-history-museum)_<br>12:45–13:45 **Syracuse University Art Museum** _(Museum / Gallery: free-cross-cultural-art)_<br>14:05–14:30 **Niagara Mohawk Art Deco Night Facade** _(Historic Site / Architecture: art-deco-electric-landmark)_<br>14:35–16:05 **Dinosaur Bar-B-Que — Original Syracuse Room** _(Food, Drink & Nightlife: roadhouse-food-live-energy)_ |
| 4 | 2026-10-07 (Wednesday) | Syracuse, NY → Batavia, NY | 127.9 mi · 2h59m · cap 210m: comfortable | 10:30–11:40 **National Susan B. Anthony Museum & House** _(Historic Site / Architecture: guided-social-history-house)_<br>11:55–12:55 **Mount Hope Cemetery: Douglass & Anthony** _(Historic Site / Architecture: victorian-landscape-and-memory)_<br>13:00–13:35 **Warner Castle Sunken Garden** _(Nature & Outdoor: secret-formal-garden)_<br>13:55–14:40 **Rundel Memorial Library — Secret Rooms** _(Museum / Gallery: art-deco-library-local-history)_<br>14:55–16:25 **Genesee Brew House & High Falls Terrace** _(Nature & Outdoor: industrial-waterfall-social-stop)_ |
| 5 | 2026-10-08 (Thursday) | Batavia, NY → Erie, PA | 146.1 mi · 3h30m · cap 210m: at-cap-live-traffic-gated | 09:25–10:25 **Original American Kazoo Company Factory & Museum** _(Museum / Gallery: working-kazoo-factory)_<br>12:15–14:15 **Tom Ridge Environmental Center & Presque Isle Gateway** _(Nature & Outdoor: lake-ecology-and-observation-tower)_<br>14:35–15:10 **Erie Land Lighthouse Grounds** _(Nature & Outdoor: historic-lake-lighthouse)_ |
| 6 | 2026-10-09 (Friday) | Erie, PA → Cleveland, OH | 116.7 mi · 2h39m · cap 210m: comfortable | 10:45–13:15 **Rock & Roll Hall of Fame** _(Museum / Gallery: music-history-museum)_<br>14:00–15:00 **A Christmas Story House** _(Museum / Gallery: film-location-house-museum)_<br>15:25–16:20 **Buckland Museum of Witchcraft & Magick** _(Museum / Gallery: occult-history-cabinet)_<br>20:00–23:00 **Sugar at the Agora Theatre** _(Food, Drink & Nightlife: fixed-live-rock-night)_ |
| 7 | 2026-10-10 (Saturday) | Cleveland, OH → Canonsburg, PA | 154.4 mi · 3h28m · cap 210m: live-traffic-gated | 08:00–09:15 **West Side Market Breakfast Hall** _(Food, Drink & Nightlife: historic-market-food-hall)_<br>09:40–11:40 **Cleveland Museum of Art** _(Historic Site / Architecture: world-art-and-architecture-anchor)_<br>11:45–12:35 **moCa Cleveland Mirror-Facet Stop** _(Museum / Gallery: contemporary-art-icon)_<br>13:10–14:10 **Brandywine Falls Boardwalk** _(Nature & Outdoor: autumn-waterfall-short-walk)_ |
| 8 | 2026-10-11 (Sunday) | Canonsburg, PA → McConnellsburg, PA | 152.8 mi · 3h29m · cap 210m: live-traffic-gated | 09:00–12:00 **All Saints Greek Orthodox Church** _(Religious & Spiritual: full-orthodox-sunday)_<br>14:45–15:20 **Koontz Coffee Pot** _(Historic Site / Architecture: giant-roadside-architecture)_<br>15:20–16:10 **Fort Bedford & Juliana Street Walk** _(Town / Street Walk: frontier-small-town-walk)_ |
| 9 | 2026-10-12 (Monday) | McConnellsburg, PA → Allentown, PA | 156.7 mi · 3h26m · cap 210m: live-traffic-gated | 11:20–13:20 **Mack Trucks Historical Museum** _(Museum / Gallery: guided-heavy-machinery-history)_<br>13:45–14:30 **Lehigh Parkway & Bogert's Covered Bridge** _(Nature & Outdoor: covered-bridge-evening-reset)_ |
| 10 | 2026-10-13 (Tuesday) | Allentown, PA → Danbury, CT | 154.4 mi · 3h21m · cap 210m: live-traffic-gated | 12:15–12:50 **World's Tallest Uncle Sam Statue** _(Curiosity / Offbeat: giant-fairground-survivor)_ |
| 11 | 2026-10-14 (Wednesday) | Danbury, CT → Boston, MA | 161.2 mi · 3h23m · cap 210m: live-traffic-gated | 12:30–15:00 **MIT Museum** _(Museum / Gallery: invention-and-kinetic-science-museum)_<br>15:30–16:20 **Trinity Church Boston** _(Religious & Spiritual: romanesque-sacred-art)_<br>17:00–17:25 **Modica Way — Graffiti Alley** _(Museum / Gallery: living-street-art-gallery)_<br>17:30–19:10 **The Plough and Stars** _(Food, Drink & Nightlife: tiny-literary-live-music-pub)_ |

**Type mix for route-07:** Museum / Gallery 12, Historic Site / Architecture 8, Nature & Outdoor 8, Food, Drink & Nightlife 6, Religious & Spiritual 2, Cemetery 1, Town / Street Walk 1, Curiosity / Offbeat 1

---

## ROUTE-08 — The Lemurs, Stone Bridges & Mechanical Dreams Loop

**Status:** research-complete-expanded-bookings-pending  ·  **50 places** · **209 images** · **1646.6 mi baseline** · **11 days** · drive cap **210 min/day**

_A warmer trip south, built around a private visit with aye-ayes and other lemurs at Duke. Along the way, the group explores huge factory art, working studios, Shenandoah gardens, Natural Bridge, Civil War history, a strange indoor mini-golf hotel, an Orthodox Sunday service, old water-powered factories, medieval rooms, and a final art palace in Boston._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Danbury, CT | 162.7 mi · 3h27m · cap 210m: live-traffic-gated | 14:45–16:35 **New Britain Museum of American Art** _(Museum / Gallery: american-art-museum)_ |
| 2 | 2026-10-05 (Monday) | Danbury, CT → Bethlehem, PA | 163.4 mi · 3h25m · cap 210m: live-traffic-gated | 10:00–12:15 **Dia Beacon** _(Museum / Gallery: monumental-contemporary-art-factory)_<br>15:10–16:10 **Kemerer Museum of Decorative Arts** _(Museum / Gallery: decorative-arts-period-rooms)_<br>16:15–17:00 **Moravian Book Shop** _(Shopping: historic-bookshop-cafe)_ |
| 3 | 2026-10-06 (Tuesday) | Bethlehem, PA → Lancaster, PA | 83.1 mi · 2h17m · cap 210m: comfortable | 09:05–09:40 **Reading Pagoda & Mount Penn Overlook** _(Nature & Outdoor: roadside-folly-overlook)_<br>10:00–12:00 **GoggleWorks Center for the Arts** _(Museum / Gallery: working-arts-factory)_<br>12:50–13:35 **Demuth Museum** _(Historic Site / Architecture: artist-home-modernism)_<br>13:50–15:00 **The Amish Farm and House** _(Museum / Gallery: community-culture-farm-museum)_<br>15:15–18:00 **Tanger Outlets Lancaster** _(Shopping: controlled-outlet-shopping-window)_ |
| 4 | 2026-10-07 (Wednesday) | Lancaster, PA → Winchester, VA | 158.6 mi · 3h22m · cap 210m: live-traffic-gated | 12:00–15:30 **Museum of the Shenandoah Valley** _(Nature & Outdoor: art-gardens-and-regional-history)_<br>15:45–16:30 **Shenandoah Valley Civil War Museum** _(Historic Site / Architecture: courthouse-prison-graffiti-history)_<br>16:35–17:30 **Handley Library Self-Guided Architecture Tour** _(Museum / Gallery: beaux-arts-library-hidden-details)_ |
| 5 | 2026-10-08 (Thursday) | Winchester, VA → Roanoke, VA | 179.4 mi · 3h26m · cap 210m: live-traffic-gated | 11:00–13:30 **Natural Bridge State Park** _(Town / Street Walk: limestone-arch-and-creek-walk)_<br>15:00–15:45 **Historic Roanoke City Market** _(Food, Drink & Nightlife: living-open-air-market)_<br>18:30–19:15 **Texas Tavern** _(Food, Drink & Nightlife: historic-counter-diner)_ |
| 6 | 2026-10-09 (Friday) | Roanoke, VA → Durham, NC | 142.2 mi · 3h21m · cap 210m: live-traffic-gated | 13:30–15:30 **Duke Lemur Center Behind the Scenes Tour** _(Nature & Outdoor: private-conservation-animal-tour)_<br>15:50–18:00 **Duke Chapel & Sarah P. Duke Gardens** _(Religious & Spiritual: gothic-chapel-and-botanical-reset)_<br>18:25–19:10 **American Tobacco Campus** _(Historic Site / Architecture: adaptive-reuse-industrial-district)_<br>19:20–20:05 **21c Museum Hotel Durham Galleries** _(Museum / Gallery: contemporary-art-deco-bank)_<br>20:45–22:10 **Bull City Escape — Wrong Side of Tobacco Road** _(Food, Drink & Nightlife: local-sports-escape-room)_ |
| 7 | 2026-10-10 (Saturday) | Durham, NC → Richmond, VA | 161.8 mi · 3h26m · cap 210m: live-traffic-gated | 11:30–14:30 **Petersburg National Battlefield: Eastern Front** _(Historic Site / Architecture: siege-landscape-and-civil-war-history)_<br>15:00–15:45 **Pocahontas Island Historic District & River Trail** _(Historic Site / Architecture: free-black-community-river-history)_<br>16:25–17:20 **Hollywood Cemetery & W. W. Pool Mausoleum** _(Curiosity / Offbeat: victorian-landscape-documented-folklore)_<br>17:40–18:40 **GWARbar** _(Food, Drink & Nightlife: heavy-metal-themed-social-dinner)_<br>19:00–21:30 **Hotel Greene** _(Food, Drink & Nightlife: theatrical-indoor-mini-golf)_ |
| 8 | 2026-10-11 (Sunday) | Richmond, VA → Annapolis, MD | 153.3 mi · 3h18m · cap 210m: comfortable | 08:15–11:30 **Saints Constantine & Helen Greek Orthodox Cathedral** _(Religious & Spiritual: full-orthodox-sunday)_<br>12:00–13:15 **The Poe Museum & Enchanted Garden** _(Nature & Outdoor: literary-house-and-gothic-garden)_<br>16:20–17:00 **Maryland State House** _(Historic Site / Architecture: revolutionary-government-architecture)_<br>17:05–17:40 **Kunta Kinte-Alex Haley Memorial** _(Historic Site / Architecture: public-memory-waterfront)_ |
| 9 | 2026-10-12 (Monday) | Annapolis, MD → Bensalem, PA | 145.7 mi · 3h21m · cap 210m: live-traffic-gated | 10:00–13:30 **Hagley Museum & Library** _(Historic Site / Architecture: water-powered-industrial-landscape)_<br>14:00–14:55 **Rockwood Park Historic Garden** _(Nature & Outdoor: gothic-revival-garden-reset)_ |
| 10 | 2026-10-13 (Tuesday) | Bensalem, PA → Bridgeport, CT | 140.7 mi · 3h20m · cap 210m: live-traffic-gated | 10:00–13:00 **The Met Cloisters** _(Nature & Outdoor: medieval-art-architecture-and-gardens)_<br>13:55–15:00 **Bruce Museum** _(Museum / Gallery: art-science-natural-history)_<br>15:25–16:10 **First Presbyterian Church of Stamford (Fish Church)** _(Religious & Spiritual: modern-sacred-architecture)_<br>18:00–19:30 **Karaoke on Main — Private Room** _(Food, Drink & Nightlife: private-karaoke-social-night)_ |
| 11 | 2026-10-14 (Wednesday) | Bridgeport, CT → Boston, MA | 155.7 mi · 3h16m · cap 210m: comfortable | 11:30–13:15 **Isabella Stewart Gardner Museum & Theft Walk** _(Museum / Gallery: personal-art-palace-and-unsolved-theft)_<br>13:40–14:20 **Black Heritage Trail: Shaw Memorial to Beacon Hill** _(Historic Site / Architecture: self-guided-black-history-walk)_<br>14:30–15:20 **African Meeting House & Abiel Smith School** _(Historic Site / Architecture: black-abolition-history)_<br>15:40–16:30 **Old South Meeting House** _(Historic Site / Architecture: protest-history-meeting-house)_ |

**Type mix for route-08:** Historic Site / Architecture 11, Museum / Gallery 9, Nature & Outdoor 6, Food, Drink & Nightlife 6, Religious & Spiritual 3, Shopping 2, Town / Street Walk 1, Curiosity / Offbeat 1

---

## ROUTE-09 — The Kaleidoscopes, Scripture Stones & Secret Machines Loop

**Status:** research-complete-bookings-pending  ·  **25 places** · **125 images** · **1677.3 mi baseline** · **11 days** · drive cap **210 min/day**

_The small-town outsider-art loop: a silo-sized kaleidoscope, scripture-carved boulders, a secret mansion of self-playing machines, a bronze studio, the Y Bridge and Otherworld lead to Columbus. The return protects Orthodox Sunday, sleeps in Victorian Bellefonte, crosses a modern megalith sanctuary and ends with a legal castle-ruin view and Harvard's Glass Flowers after both cars are returned._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → Ghent, NY | 160.8 mi · 3h28m · cap 210m: live-traffic-gated | 15:35–17:30 **Art Omi Sculpture & Architecture Park** _(Museum / Gallery: landscape-scale-contemporary-art)_ |
| 2 | 2026-10-05 (Monday) | Ghent, NY → Hancock, NY | 127.5 mi · 3h13m · cap 210m: near-cap | 10:15–11:30 **World's Largest Kaleidoscope & Kaleidostore** _(Curiosity / Offbeat: silo-sized-optical-show)_ |
| 3 | 2026-10-06 (Tuesday) | Hancock, NY → Williamsport, PA | 169.3 mi · 3h26m · cap 210m: live-traffic-gated | 12:00–14:00 **Thomas T. Taber Museum** _(Historic Site / Architecture: regional-history-and-railroad-obsession)_ |
| 4 | 2026-10-07 (Wednesday) | Williamsport, PA → Brookville, PA | 129.9 mi · 2h34m · cap 210m: comfortable | 11:15–13:00 **Scripture Rocks Heritage Park** _(Curiosity / Offbeat: outsider-scripture-landscape)_ |
| 5 | 2026-10-08 (Thursday) | Brookville, PA → Wheeling, WV | 140.3 mi · 3h22m · cap 210m: live-traffic-gated | 10:30–13:00 **Bayernhof Museum** _(Museum / Gallery: secret-house-of-music-machines)_ |
| 6 | 2026-10-09 (Friday) | Wheeling, WV → Columbus, OH | 141.6 mi · 2h48m · cap 210m: comfortable | 10:00–11:30 **Alan Cottrill Sculpture Studio & Gallery** _(Curiosity / Offbeat: working-bronze-artist-labyrinth)_<br>11:40–12:15 **Zanesville Y Bridge & Putnam Overlook** _(Nature & Outdoor: three-way-river-bridge)_<br>15:15–17:45 **Otherworld Columbus** _(Museum / Gallery: interactive-surreal-art-world)_ |
| 7 | 2026-10-10 (Saturday) | Columbus, OH → West Middlesex, PA | 178.4 mi · 3h27m · cap 210m: live-traffic-gated | 11:00–13:15 **Butler Institute of American Art** _(Museum / Gallery: free-american-art-museum)_ |
| 8 | 2026-10-11 (Sunday) | West Middlesex, PA → Bellefonte, PA | 161.3 mi · 3h05m · cap 210m: near-cap | 09:40–12:00 **Protected Orthodox Sunday at St Nicholas Orthodox Church** _(Religious & Spiritual: canonical-orthodox-worship)_<br>14:00–15:45 **Bellefonte Victorian & Talleyrand Waterfront Walk** _(Nature & Outdoor: victorian-small-town-reset)_ |
| 9 | 2026-10-12 (Monday) | Bellefonte, PA → Tannersville, PA | 169.3 mi · 3h29m · cap 210m: live-traffic-gated | 11:15–13:30 **Columcille Megalith Park** _(Nature & Outdoor: celtic-inspired-stone-sanctuary)_ |
| 10 | 2026-10-13 (Tuesday) | Tannersville, PA → Danbury, CT | 137.9 mi · 3h09m · cap 210m: near-cap | 12:00–14:15 **Tarrywile Mansion, Park & Hearthstone Exterior** _(Historic Site / Architecture: municipal-estate-and-fenced-castle-ruin)_ |
| 11 | 2026-10-14 (Wednesday) | Danbury, CT → Boston, MA | 161.1 mi · 3h23m · cap 210m: live-traffic-gated | 12:00–15:00 **Harvard Museum of Natural History & Glass Flowers** _(Museum / Gallery: scientific-wonder-cabinet)_ |

**Type mix for route-09:** Museum / Gallery 5, Curiosity / Offbeat 3, Nature & Outdoor 3, Historic Site / Architecture 2, Religious & Spiritual 1

---

## ROUTE-10 — The Temples, Follies & Working Machines Loop

**Status:** research-complete-bookings-pending  ·  **24 places** · **80 images** · **1547 mi baseline** · **11 days** · drive cap **210 min/day**

_This full route joins 24 main stops instead of hiding half the story as backups. Motorcycles, temples, gardens, powder mills, giant trains, pinball, Orthodox Sunday, Tripod Rock, steam pumps, and a secret-feeling Boston library all fit inside the measured driving cap._

| Day | Date (Day) | City → City | Drive (mi · time · cap) | Stops (time · name · type) |
|---|---|---|---|---|
| 1 | 2026-10-04 (Sunday) | Boston Logan Rental Car Center → East Milford/Orange, CT | 151.6 mi · 3h26m · cap 210m: live-traffic-gated | 14:00–15:00 **New England Motorcycle Museum in the Hockanum Mill** _(Museum / Gallery: motorcycles-inside-a-revived-textile-mill)_<br>15:40–16:40 **Hill-Stead Museum, Sunken Garden & Theodate Pope Riddle House** _(Historic Site / Architecture: woman-designed-country-house-and-art)_ |
| 2 | 2026-10-05 (Monday) | East Milford/Orange, CT → Hamilton, NJ | 135.8 mi · 3h19m · cap 210m: near-cap | 10:00–12:30 **BAPS Swaminarayan Akshardham** _(Religious & Spiritual: monumental-living-hindu-sacred-complex)_<br>13:15–14:30 **Sayen House & Gardens** _(Nature & Outdoor: free-woodland-garden-and-historic-house-setting)_ |
| 3 | 2026-10-06 (Tuesday) | Hamilton, NJ → Baltimore, MD | 144.7 mi · 3h28m · cap 210m: live-traffic-gated | 10:00–11:45 **Winterthur House, Galleries & Garden Tram** _(Historic Site / Architecture: american-decorative-arts-estate)_<br>12:10–14:25 **Hagley Powder Yards, Waterpower & Eleutherian Mills** _(Historic Site / Architecture: working-industrial-landscape)_ |
| 4 | 2026-10-07 (Wednesday) | Baltimore, MD → North Richmond, VA | 148.8 mi · 3h26m · cap 210m: live-traffic-gated | 09:00–12:00 **National Museum of the Marine Corps** _(Museum / Gallery: immersive-military-history-museum)_<br>12:30–14:00 **Government Island Aquia Sandstone Quarry & Boardwalk** _(Historic Site / Architecture: birthstone-of-washington-architecture)_ |
| 5 | 2026-10-08 (Thursday) | North Richmond, VA → Danville, VA | 149.6 mi · 3h28m · cap 210m: live-traffic-gated | 09:00–11:00 **Lewis Ginter Conservatory & Botanical Garden** _(Nature & Outdoor: glasshouse-and-designed-garden)_<br>12:00–14:00 **Agecroft Hall & James River Garden** _(Historic Site / Architecture: sixteenth-century-english-house-reassembled-in-virginia)_ |
| 6 | 2026-10-09 (Friday) | Danville, VA → Roanoke, VA | 86.9 mi · 2h15m · cap 210m: comfortable | 10:00–11:45 **Taubman Museum of Art** _(Museum / Gallery: sculptural-building-and-free-american-art)_<br>12:00–13:20 **O. Winston Link Night-Trains & Roanoke History Museum** _(Historic Site / Architecture: staged-night-photography-and-railroad-memory)_<br>17:30–18:30 **Mill Mountain Roanoke Star & Blue Ridge Overlook** _(Nature & Outdoor: drive-up-neon-mountain-overlook)_ |
| 7 | 2026-10-10 (Saturday) | Roanoke, VA → Mount Crawford, VA | 105.5 mi · 2h07m · cap 210m: comfortable | 10:00–12:15 **Virginia Museum of Transportation & Outdoor Railyard** _(Museum / Gallery: giant-machines-in-a-century-old-freight-station)_<br>12:30–14:00 **Roanoke Pinball Museum** _(Food, Drink & Nightlife: playable-century-of-pinball)_ |
| 8 | 2026-10-11 (Sunday) | Mount Crawford, VA → Carlisle, PA | 175.0 mi · 3h28m · cap 210m: live-traffic-gated | 09:45–12:30 **Protected Orthodox Sunday at Holy Myrrhbearers** _(Religious & Spiritual: canonical-rocor-hours-and-divine-liturgy)_<br>12:45–13:30 **Edith J. Carrier Arboretum** _(Nature & Outdoor: free-valley-arboretum-and-pond)_<br>13:45–14:30 **Harrisonburg Public Art & Hidden-History Circuit** _(Nature & Outdoor: small-city-murals-sculpture-and-memory)_ |
| 9 | 2026-10-12 (Monday) | Carlisle, PA → Stroudsburg, PA | 148.6 mi · 3h27m · cap 210m: live-traffic-gated | 10:00–12:00 **National Civil War Museum** _(Museum / Gallery: artifact-led-war-and-aftermath-history)_<br>12:35–14:35 **America's Transportation Experience at the AACA Museum** _(Historic Site / Architecture: cars-buses-and-industrial-design)_ |
| 10 | 2026-10-13 (Tuesday) | Stroudsburg, PA → Danbury, CT | 139.5 mi · 3h26m · cap 210m: live-traffic-gated | 07:30–09:45 **Pyramid Mountain Tripod Rock Hike** _(Nature & Outdoor: glacial-erratic-balancing-rock)_<br>11:00–12:30 **Skylands Manor & New Jersey Botanical Garden** _(Nature & Outdoor: tudor-revival-estate-and-free-autumn-garden)_ |
| 11 | 2026-10-14 (Wednesday) | Danbury, CT → Boston, MA | 161.1 mi · 3h23m · cap 210m: live-traffic-gated | 11:00–12:30 **Metropolitan Waterworks Museum Great Engines Hall** _(Museum / Gallery: victorian-steam-pumps-and-public-health)_<br>13:30–16:00 **Boston Athenaeum Full-Building Day Membership** _(Museum / Gallery: twelve-story-independent-library-and-art)_ |

**Type mix for route-10:** Museum / Gallery 7, Historic Site / Architecture 7, Nature & Outdoor 7, Religious & Spiritual 2, Food, Drink & Nightlife 1

---

## Spot-Type Balance — All 10 Routes Combined

| Type | Count | % of all scheduled stops |
|---|---|---|
| Religious & Spiritual | 22 | 6.5% |
| Cemetery | 3 | 0.9% |
| Food, Drink & Nightlife | 32 | 9.5% |
| Shopping | 7 | 2.1% |
| Water / Boat Experience | 5 | 1.5% |
| Museum / Gallery | 89 | 26.4% |
| Nature & Outdoor | 70 | 20.8% |
| Historic Site / Architecture | 83 | 24.6% |
| Curiosity / Offbeat | 15 | 4.5% |
| Town / Street Walk | 11 | 3.3% |
| **Total** | **337** | **100%** |

_This covers the **337 stops currently on the day-by-day schedule** across all 10 routes. The route packages hold **441 places total** — the other **104** are alternates or hidden-gem replacement candidates that exist in the data but are not on the itinerary yet, so swapping one in will shift these counts._

**Indoor-exhibit-leaning stops (Museum/Gallery + Historic Site/Architecture): 172 of 337 (51.0%).** Outdoor-leaning stops (Nature & Outdoor + Town/Street Walk): 81 (24.0%).

## Per-Route Type Matrix

| Type | R01 | R02 | R03 | R04 | R05 | R06 | R07 | R08 | R09 | R10 | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Religious & Spiritual | 3 | 2 | 2 | 1 | 3 | 3 | 2 | 3 | 1 | 2 | 22 |
| Cemetery | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 3 |
| Food, Drink & Nightlife | 5 | 5 | 2 | 3 | 2 | 2 | 6 | 6 | 0 | 1 | 32 |
| Shopping | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 2 | 0 | 0 | 7 |
| Water / Boat Experience | 0 | 1 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 |
| Museum / Gallery | 9 | 9 | 13 | 9 | 7 | 9 | 12 | 9 | 5 | 7 | 89 |
| Nature & Outdoor | 6 | 14 | 3 | 9 | 7 | 7 | 8 | 6 | 3 | 7 | 70 |
| Historic Site / Architecture | 10 | 6 | 5 | 12 | 11 | 11 | 8 | 11 | 2 | 7 | 83 |
| Curiosity / Offbeat | 1 | 1 | 4 | 0 | 0 | 4 | 1 | 1 | 3 | 0 | 15 |
| Town / Street Walk | 2 | 1 | 4 | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 11 |
| **Total scheduled stops** | 37 | 40 | 39 | 37 | 31 | 37 | 39 | 39 | 14 | 24 | **337** |

## Museum-Load Ranking by Route

| Route | Museum/Gallery | Historic Site/Architecture | Combined | % of route's scheduled stops |
|---|---|---|---|---|
| route-10 — The Temples, Follies & Working Machines Loop | 7 | 7 | 14 | 58.3% (of 24) |
| route-05 — The Coal Veins, Caverns & Blue Ridge Secrets Loop | 7 | 11 | 18 | 58.1% (of 31) |
| route-04 — The Trolls, Moon Rocks & Curiosity Coast Loop | 9 | 12 | 21 | 56.8% (of 37) |
| route-06 — The Mothman, Steel Cathedrals & Cabinet of Evidence Loop | 9 | 11 | 20 | 54.1% (of 37) |
| route-01 — The Gilded Coast & Capital Loop | 9 | 10 | 19 | 51.4% (of 37) |
| route-07 — The Kazoos, Rock & Mechanical Dreams Loop | 12 | 8 | 20 | 51.3% (of 39) |
| route-08 — The Lemurs, Stone Bridges & Mechanical Dreams Loop | 9 | 11 | 20 | 51.3% (of 39) |
| route-09 — The Kaleidoscopes, Scripture Stones & Secret Machines Loop | 5 | 2 | 7 | 50.0% (of 14) |
| route-03 — The Wild Shore, Rockets & Folklore Loop | 13 | 5 | 18 | 46.2% (of 39) |
| route-02 — The Falls, Fire & Clockwork Loop | 9 | 6 | 15 | 37.5% (of 40) |
