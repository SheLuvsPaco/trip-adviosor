# Route 05 — Under the Mountain, Inside the Machine

Canonical Energy Rebuild V2 for October 4-15, 2026. Route DNA: **UNDERGROUND -> INDUSTRY -> RIDGE -> RUIN -> MACHINE**.

## Package summary

- 56 total places: 27 active core experiences and 39 selectable choices once archived and social entries are set aside
- 27 uniquely scheduled core place cards across 11 days
- 261 local carousel images, of which 64 are rights-gated
- 1523.1 OSRM baseline miles
- 149 minutes for the longest uninterrupted baseline driving leg
- $316.39-$325.00 optional do-everything attraction range per person, before horseback sales tax
- 0 traditional passive museums in the core (0%), 0 core food or nightlife

## Structural changes

Frederick's Oct 11 overnight moves to Leesburg, which turns a 2h45 run into roughly 2h30 and puts the route's one major shopping block exactly where it solves the geometry. Bethlehem's Oct 12 overnight moves to Stroudsburg so the Lehigh Gorge foliage train can be the day's anchor without stranding the next morning's Hudson run.

## Road evidence

Frozen OSRM geometry is canonical. A documented Milford, PA comfort break splits the Danbury-to-Scranton run, which measured 173 minutes direct. Day 9 totals 317 driving minutes and carries an explicit authorised cap exception; no single leg on that day exceeds 120 minutes.

## UI contract

Core places expose texture, interaction, booking risk, weather and wet-surface gates, partial-participation paths, traveler fit and optional cost ranges. Optional, flex, social, archived and alternative places stay visible and dated to a day, but never enter Magic unless activated.

## Operations

The route is UI-ready but not booking-final. Lock the Skyland trail ride and the Monticello From Slavery to Freedom tour first, then the coal mine, the foliage train and the escape room. Wet rock cancels Bearfence and the Boulder Field scramble, not the itinerary.

Rebuild with `node scripts/route-05/build.mjs`, then validate with `node scripts/validate-route-package.mjs route-05-coal-veins-caverns-blue-ridge-secrets-loop`.
