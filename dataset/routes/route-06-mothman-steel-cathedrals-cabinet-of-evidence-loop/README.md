# Route 06 — Evidence in the Dark

Canonical Energy Rebuild V2 for October 4-15, 2026.

## Package summary

- 55 meaningful selectable experiences: 26 active core and 29 optional/flex
- 26 uniquely scheduled core cards across 11 days
- 177 local image records; 30 new places are clearly labeled as contextual-image-only
- 1814.9 OSRM baseline miles
- 143 minutes for the longest uninterrupted baseline leg after planned rest splits
- $129.95 known core ceiling per person / $519.80 for four
- 0 passive museums, 0 core food/nightlife and 0 core escape rooms

## Route identity

Prison mine -> sacred stones -> guitar factory -> military environments -> black tunnel -> rescue capsule -> blast furnaces -> art house -> labor murals -> penitentiary -> river confluence -> Mothman fieldwork -> asylum by flashlight -> Orthodox Sunday -> iron-furnace forest -> engineered road cut -> giant rail bridge -> outlets -> quiet estate -> vanished town.

## Road correction

Fresh OSRM measurement found four prose bands above the 150-minute uninterrupted rule. Milford, Charleston, Mahwah and Sturbridge are now explicit rest/fuel nodes. Day 11 still measures 300 baseline road minutes and remains red until the rental return deadline is reconciled.

## UI contract

Every core place exposes cost, texture, traveler fit, booking risk, exact-date and weather flags, skip logic, sources, images and equal rating slots. Removed archive and food-only entries live in route-decisions.json rather than the public 55-card rating inventory.

Rebuild with `node scripts/route-06/build.mjs`, then validate with `node scripts/validate-route-package.mjs route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop`.
