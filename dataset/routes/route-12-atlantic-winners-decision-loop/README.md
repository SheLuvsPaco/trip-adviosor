# The Atlantic Winners Decision Loop

Final 11-night decision route for October 4–14, 2026. It contains 21 locked, fully rated core places, Newport Car Museum as the scheduled arrival-day option, and 17 additional corridor choices shown outside the baseline. Beinecke Rare Book & Manuscript Library remains on Day 2 at 17:30–18:25.

Ratings are not duplicated or filled in. Every place carries a `rating_source` pointing to its original route/place row, and `rating-provenance.json` records the retained traveler snapshot. Incomplete optional ratings stay incomplete and do not affect the winning score.

Existing sleepover research is remapped into each day under `lodging.suggestions`; `sleepovers.json` preserves the complete research/gap status without presenting stale price context as a live quote.

Rebuild with `node scripts/route-12/build.mjs`; validate with `node scripts/validate-route-package.mjs route-12-atlantic-winners-decision-loop`.
