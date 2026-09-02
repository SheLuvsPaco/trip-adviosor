// Candidates chosen off the Route 07 contact sheets in
// tmp/route-07-kazoos-rock-mechanical-dreams-loop-image-harvest/sheets/.
//
// Format: [candidateIndex, description, coverage?] — coverage defaults to exact-place-or-experience.
//
// These 23 places were previously showing cloned "regional-context-not-exact-place" images borrowed
// from other venues — a kazoo-factory photograph was standing in for Hershey's Chocolate World and
// the Martin Guitar factory. Every pick below is a photograph of the place itself.
//
// Rejected during review: site watermarks (pabucketlist.com), news-broadcast chyrons, operator promo
// cards ("COMING TO BOSTON EARLY 2024"), Mountain Bike Action overlays, vintage postcards, and the
// wedding-photographer watermarks Commons and DDG both return for the Pittsburgh cathedral.
//
// Two venues appear twice in the package (Buffalo RiverWorks, Perplexity Games) and one tunnel is
// shared with Route 06. Their picks are kept disjoint so no two cards carry the same photograph.

export const selection = {
  /* ---- core ---- */

  "naismith-center-court": [
    [4, "The Hall's silver dome and the basketball mast beside it"],
    [8, "The centre-court floor under the ring of retired banners"],
    [13, "The entrance front with its hoops and Hall of Fame roundel"]
  ],
  "erie-canal-lock-e20": [
    [6, "A boat rising inside the lock chamber with the gates closed behind it"],
    [2, "The lock full of craft waiting on the level change"],
    [10, "A working barge filling the chamber end to end"]
  ],
  "five-wits-syracuse": [
    [7, "The lit corridor set that opens the adventure"],
    [2, "The bank of themed adventure doors and their score screens"],
    [13, "Players working a neon-lit puzzle wall together"]
  ],
  "strong-museum-play": [
    [11, "The curved glass front of the museum lit at dusk"],
    [14, "The World Video Game Hall of Fame arcade inside"],
    [10, "The illuminated window that fronts the building at night"]
  ],
  "high-falls-pont-de-rennes": [
    [3, "High Falls dropping through the gorge with the mill buildings above"],
    [12, "The Pont de Rennes pedestrian bridge looking downriver at sunset"],
    [1, "The falls and the Rochester skyline together"]
  ],
  "riverworks-racing-zipline": [
    [1, "A rider on the zipline between the grain silos, seen from below"],
    [5, "The zipline running past the painted shark mouth on the silo wall"],
    [6, "The blue silos and the zipline strung out over the river"]
  ],
  "presque-isle-movement": [
    [14, "Presque Isle Light and its keeper's house on the peninsula"],
    [10, "The Lake Erie beach with swimmers along the shore"],
    [5, "Open sand running the length of the lakeshore"]
  ],
  "superelectric-pinball": [
    [1, "A row of machines under the parlour's strung bunting"],
    [15, "A playfield lit up mid-game"],
    [16, "Two players working adjacent machines"]
  ],
  "rays-bike-park": [
    [1, "The indoor park's wooden lines seen across the whole floor"],
    [4, "Riders working the banked pump-track berms"],
    [8, "Riders picking through the log and skinny section"]
  ],
  "st-nicholas-pittsburgh": [
    [1, "The cathedral's neoclassical portico from the street"],
    [15, "The same front with its red doors under the pediment"],
    [16, "The gilded iconostasis and nave inside"]
  ],
  "carrie-graffiti": [
    [5, "Daylight cutting through the torn cladding inside the furnace house"],
    [9, "An abandoned works office with its papers still on the desk"],
    [13, "The rusted bell and hopper at the top of the furnace"]
  ],
  "old-pa-pike-rays-hill": [
    [12, "The graffiti-covered roadbed running up to the tunnel portal"],
    [7, "The portal with the scrub closing in over the old carriageway"],
    [15, "The portal and its ventilation housing from the abandoned road"]
  ],
  "hershey-candy-bar": [
    [16, "The character statues inside the Chocolate World concourse"],
    [12, "The interior atrium and its fountain from the upper level"],
    [3, "The entrance under the mascots with visitors going in"]
  ],
  "martin-guitar": [
    [3, "The C. F. Martin & Co. factory building from the visitor entrance"],
    [14, "Two workers shaping a neck at the bench on the factory floor"],
    [12, "The gallery of historic Martin instruments"]
  ],
  "pocono-premium-outlets": [
    [4, "The upper-level storefront run along the centre"],
    [7, "The glazed entrance building above the parking"],
    [12, "The walkway and lawn between the shop blocks"]
  ],
  "raymondskill-falls": [
    [13, "The falls stepping down the gorge in autumn colour"],
    [15, "The lower cascade with autumn leaves along the rock"],
    [3, "The full drop of the falls in high spring flow"]
  ],
  "westville-grand-trunk": [
    [8, "Westville Lake under open sky from the rocky shore"],
    [12, "The Westville Lake sign at the trailhead"],
    [2, "The lake reflecting the treeline off the rock bank"]
  ],
  "f1-arcade-boston": [
    [6, "The row of racing rigs under their screens"],
    [2, "Players racing side by side at the simulators"],
    [14, "The bar and dining floor with the race screens above it"]
  ],

  /* ---- options ---- */

  "riverworks-high-ropes": [
    [3, "Climbers working the ropes course under the shed roof"],
    [7, "A climber crossing a high wire above the floor"],
    [9, "Climbers traversing the outdoor concrete wall"]
  ],
  "herschell-carrousel": [
    [1, "The restored carousel with its carved and painted horses"],
    [12, "The red factory building under its 1872 Allan Herschell sign"],
    [5, "A carved rooster from the factory's menagerie figures"]
  ],
  "escape-city-hangover": [
    [6, "A green and blue lit industrial set built around heavy gearing"],
    [12, "The red-lit vault room"],
    [14, "The orange-lit furnace room set"]
  ],
  "perplexity-eliot-ness": [
    [4, "Players working a lantern-lit outdoor set"],
    [13, "A team at the wooden puzzle box in the brick room"],
    [12, "A costumed team in the brick-walled set"]
  ],
  "perplexity-clockwork-caper": [
    [11, "Players working a glowing puzzle panel"],
    [16, "A team celebrating a solve at the venue", "exact-place-or-experience-context"],
    [3, "A team with their result cards after the game", "exact-place-or-experience-context"]
  ]
};
