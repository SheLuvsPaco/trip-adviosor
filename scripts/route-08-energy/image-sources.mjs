// Curated image sources for the twenty-six places introduced by the Route 08 Energy Rebuild V2.
//
//   commons  - exact Wikimedia Commons file titles, or { query } to take the best matches for a
//              search. Ships production_usable:true with creator, licence and file page recorded.
//   operator - publicity photographs from the operator's own site. Editorial reuse only, so these
//              stay production_usable:false until permission is cleared.
//
// `coverage` marks frames that show the setting rather than the exact attraction.

export const commonsSources = {
  "steep-rock": [
    ["File:Shepaug tunnel 023.JPG", "Inside the hand-cut Shepaug railroad tunnel on the preserve", "exact-place-or-experience"],
    ["File:Shepaug tunnel south portal 026.JPG", "The south portal of the tunnel where the trail passes through", "exact-place-or-experience"],
    ["File:Hauser footbridge 035.JPG", "The footbridge over the Shepaug River inside Steep Rock Preserve", "exact-place-or-experience"]
  ],
  "mt-tammany": [
    ["File:Delaware Water Gap NRA.jpg", "The Delaware Water Gap that the Red Dot Trail climbs above", "exact-place-or-experience-context"],
    ["File:Mount Tammany.jpg", "Mount Tammany rising above the Delaware Water Gap", "exact-place-or-experience"],
    ["File:Mount Tammany Trail.jpg", "The rocky Red Dot trail surface on the climb", "exact-place-or-experience"],
  ],
  "blandy-farm": [
    ["File:Blandy arboretum back.jpg", "Open arboretum grounds at the State Arboretum of Virginia", "exact-place-or-experience"],
    ["File:Blandy greenhouse and herb garden.jpg", "The greenhouse and herb garden at Blandy Experimental Farm", "exact-place-or-experience"],
    ["File:Hewlett Lewis Overlook Pavilion.jpg", "The overlook pavilion above the research landscape", "exact-place-or-experience"],
    ["File:The Quarters at the Virginia State Arboretum.jpg", "The Quarters building at the heart of the arboretum grounds", "exact-place-or-experience"]
  ],
  "little-stony-man-climb": [
    ["File:Little Stony Man Cliffs (54004734075).jpg", "The greenstone cliff band used for single-pitch climbing and rappelling", "exact-place-or-experience"],
    ["File:Little Stony Man Cliffs Skyline Drive (52768684298).jpg", "Little Stony Man's rock face above Skyline Drive", "exact-place-or-experience"],
    ["File:Little Stony Man (21419425063).jpg", "The Shenandoah ridge and cliff line at Little Stony Man", "exact-place-or-experience"]
  ],
  "fairy-stone-hunt": [
    ["File:Fairy Stone State Park (31232251732).jpg", "Woodland and water at Fairy Stone State Park", "exact-place-or-experience"],
    ["File:Fairy Stone State Park (30568861353).jpg", "The park landscape around the designated staurolite hunting area", "exact-place-or-experience"],
    ["File:FS 10-22-24 Park Sign JB.jpg", "The park entrance sign at Fairy Stone", "exact-place-or-experience-context"]
  ],
  "james-river-rafting": [
    ["File:Richmond, Virginia (8127368131).jpg", "The James River running whitewater through the Richmond skyline", "exact-place-or-experience"]
  ],
  "bombay-hook": [
    ["File:Bombay Hook National Wildlife Refuge (29181543632).jpg", "Tidal salt marsh along the refuge wildlife drive", "exact-place-or-experience"],
    ["File:Great blue heron golden hour Bombay Hook (36150).jpg", "A great blue heron in the refuge marsh at golden hour", "exact-place-or-experience"],
    ["File:Bombay Hook (36172p).jpg", "The Atlantic Flyway marsh expanse at Bombay Hook", "exact-place-or-experience"]
  ],
  "big-snow-american-dream": [
    ["File:Big Snow American Dream 01.jpg", "The indoor real-snow slope inside Big SNOW", "exact-place-or-experience"],
    ["File:Big Snow American Dream 02.jpg", "Riders on the year-round indoor snow surface", "exact-place-or-experience"],
    ["File:Indoor ski slope at American Dream in Meadowlands.jpg", "The full indoor slope enclosure at American Dream", "exact-place-or-experience"]
  ],
  "ringing-rocks-park": [
    ["File:Boulder field, Ringing Rocks Park, Bridgeton Township, PA.jpg", "The ringing boulder field that gives the park its name", "exact-place-or-experience"],
    ["File:Ringing Rocks Park entrance sign, Bridgeton Township, PA.jpg", "The county park entrance sign", "exact-place-or-experience-context"],
    ["File:Bridgeton Township, PA 18972, USA - panoramio (1).jpg", "Woodland around the Ringing Rocks boulder field", "exact-place-or-experience-context"]
  ],
  "blue-ridge-tunnel": [
    ["File:New and Old Blue Ridge Tunnels.jpg", "The old and new Blue Ridge tunnel portals at Afton", "exact-place-or-experience"]
  ],
  "_blue-ridge-tunnel-unused": [
    ["File:INTERIOR OF BLUERIDGE (CROZET) TUNNEL. - Blue Ridge Railroad, Blue Ridge Tunnel, Afton, Nelson County, VA HAER VA,62-AFT.V,1-13.tif", "Inside the unlit 4,273-foot Crozet tunnel", "exact-place-or-experience"],
    ["File:GENERAL VIEW OF ENTRANCE TO BLUE RIDGE TUNNEL (LEFT) FROM SOUTHEAST. - Blue Ridge Railroad, Blue Ridge Tunnel, Afton, Nelson County, VA HAER VA,62-AFT.V,1-11.tif", "The tunnel entrance from the southeast approach", "exact-place-or-experience"]
  ],
  "natural-chimneys": [
    ["File:Natural Chimneys Cyclopean Towers.jpg", "The limestone towers that give Natural Chimneys its name", "exact-place-or-experience"],
    ["File:Natural Chimneys Virginia.jpg", "The full chimney formation above the park trails", "exact-place-or-experience"],
    ["File:Natural Chimneys - 02.jpg", "Close detail of the weathered limestone columns", "exact-place-or-experience"]
  ],
  "duke-walking-with-lemurs": [
    ["File:Red Lemur.jpg", "A red-ruffed lemur, one of the centre's conserved species", "exact-place-or-experience-context"],
    ["File:Crowned Lemur.jpg", "A crowned lemur of the kind seen on the forest-proximity walk", "exact-place-or-experience-context"]
  ],
  "carolina-tiger-rescue": [
    ["File:Tiger at Carolina Tiger Rescue.jpg", "A rescued tiger at the Pittsboro sanctuary", "exact-place-or-experience"],
    ["File:Anxious (3682317607).jpg", "A resident big cat at Carolina Tiger Rescue", "exact-place-or-experience"],
    ["File:Food (3682320661).jpg", "Feeding time on the sanctuary's twilight tour route", "exact-place-or-experience"]
  ]
};

// Places where no single set of exact titles was confidently known; the importer takes the best
// matches for these searches and the results are reviewed on a contact sheet before shipping.
export const commonsQueries = {
  "ragged-mountain": { query: "Metacomet Ridge traprock Connecticut basalt", description: "The traprock ridge and preserve landscape at Ragged Mountain", coverage: "exact-place-or-experience" },
  "devils-marbleyard": { query: "James River Face Wilderness Rockbridge Virginia", description: "The quartzite boulder field on the Belfast Trail", coverage: "exact-place-or-experience" },
  "fredericksburg-riverfront": { query: "Fredericksburg Virginia Rappahannock river", require: /fredericksburg/i, exclude: /1863|pontoon|sunken|chart|map|civil war|soldier|entrenched|battle|regiment/i, description: "The Rappahannock riverfront at Fredericksburg", coverage: "exact-place-or-experience" },
  "dinosaur-state-park": { query: "Dinosaur State Park Rocky Hill", description: "The in-situ Jurassic trackway preserved under the park dome", coverage: "exact-place-or-experience" },
  "jersey-gardens": { query: "Mills at Jersey Gardens Elizabeth New Jersey mall", require: /mills|jersey gardens/i, exclude: /obituary|homes|journal/i, description: "The Mills at Jersey Gardens outlet centre", coverage: "exact-place-or-experience-context" },
  "wolf-sanctuary-pa": { query: "grey wolf Canis lupus enclosure sanctuary", exclude: /logo|map|diagram|skull|track|print/i, description: "Rescued wolves at the Lititz sanctuary", coverage: "exact-place-or-experience-context" },
  "lakota-wolf-preserve": { query: "timber wolf preserve enclosure North America", exclude: /logo|map|diagram|skull|track|print/i, description: "The wolf preserve setting in Columbia, New Jersey", coverage: "exact-place-or-experience-context" }
};

export const commonsExtraTitles = {
  "fredericksburg-riverfront": [
    ["File:Fredericksburg, Rappahannock river.jpg", "The Rappahannock at Fredericksburg, the route's deliberate river reset", "exact-place-or-experience"],
    ["File:Fredericksburg, Rappahannock river (2).jpg", "The riverbank walk beside the Rappahannock", "exact-place-or-experience"],
    ["File:2016-07-24 08 52 00 View southeast down the Rappahannock River from Virginia State Route 3 Business Bridge (William Street-Kings Highway Bridge) on the border of Chatham Heights, Stafford County, Virginia and Fredericksburg, Virginia.jpg", "Looking downriver along the Rappahannock at Fredericksburg", "exact-place-or-experience"]
  ],
  "duke-walking-with-lemurs": [
    ["File:Male Blue Eyed Black Lemur.JPG", "A blue-eyed black lemur, one of the centre's conserved species", "exact-place-or-experience-context"],
    ["File:Nycticebus pygmaeus 003.jpg", "A pygmy slow loris, part of the centre's conserved strepsirrhine collection", "exact-place-or-experience-context"]
  ],
  "ragged-mountain": [
    ["File:Ragged Mountain CT.jpg", "The Ragged Mountain traprock ridge in Connecticut", "exact-place-or-experience"],
    ["File:Trimountain.jpg", "Metacomet Ridge traprock of the kind the preserve's basalt ridge belongs to", "exact-place-or-experience-context"],
    ["File:Pistapaug Mountain.jpg", "Connecticut traprock ridgeline, the same geological formation", "exact-place-or-experience-context"]
  ],
  "devils-marbleyard": [
    ["File:Devils Marbleyard Virginia.jpg", "The quartzite boulder field reached by the Belfast Trail", "exact-place-or-experience"],
    ["File:James River Face, from Va 130 looking southwest.jpg", "The James River Face wilderness that holds the boulder field", "exact-place-or-experience-context"],
    ["File:20160519-FS-GeorgeJefferson-LN-004 (17253594903).jpg", "Jefferson National Forest wildland around the Belfast Trail approach", "exact-place-or-experience-context"]
  ],
  "wolf-sanctuary-pa": [
    ["File:Gray Wolf Nationalpark Bayerischer Wald 01.jpg", "A grey wolf in a wooded enclosure: species reference for the sanctuary's rescued pack, not a photograph of this site", "species-reference-not-this-site"],
    ["File:Gray Wolf - Canis lupus (51545668593).jpg", "A grey wolf: species reference for the sanctuary's rescued residents, not a photograph of this site", "species-reference-not-this-site"],
    ["File:Timberwolf Head - Canis lupus occidentalis - ZOOM-2.jpg", "A north-western timber wolf: species reference, not a photograph of this site", "species-reference-not-this-site"]
  ],
  "lakota-wolf-preserve": [
    ["File:Lake at the Lakota Wolf Preserve.JPG", "The lake and woodland setting at the Lakota Wolf Preserve", "exact-place-or-experience"],
    ["File:Canis lupus Parc des Loups 001.jpg", "A grey wolf in a preserve enclosure: species reference, not a photograph of this site", "species-reference-not-this-site"],
    ["File:Aerial view of arctic wolf pack in snow canis lupus.jpg", "A wolf pack: species reference for the preserve's observation areas, not a photograph of this site", "species-reference-not-this-site"]
  ]
};

export const commonsQueriesExtra = {
  "blue-ridge-tunnel": { query: "Blue Ridge Tunnel Crozet Afton railroad", exclude: /map|chart/i, description: "The Crozet-era Blue Ridge Tunnel bore and approaches", coverage: "exact-place-or-experience" },
  "carolina-tiger-rescue": { query: "Carolina Tiger Rescue tiger enclosure", description: "A rescued big cat in its enclosure at the Pittsboro sanctuary", coverage: "exact-place-or-experience" },
  "captured-lv-mayan": { query: "Bethlehem Pennsylvania downtown Main Street", exclude: /steel|1900|historic marker/i, description: "Bethlehem, where the Captured LV rooms operate; the venue publishes no room photography", coverage: "exact-place-or-experience-context" },
  "bam-kazam": { query: "American Dream Meadowlands East Rutherford", exclude: /logo|plane|aerial 1/i, description: "American Dream, the complex housing the Bam Kazam challenge rooms", coverage: "exact-place-or-experience-context" }
};

export const operatorSources = {
  "james-river-rafting": [
    ["https://rvapaddlesports.com/wp-content/uploads/sites/4066/2020/04/IMG_3409.jpg?w=1600&zoom=2", "https://rvapaddlesports.com/", "RVA Paddlesports", "A raft working the Lower James through Richmond", "exact-place-or-experience"],
    ["https://rvapaddlesports.com/wp-content/uploads/sites/4066/2020/04/Pop-Up-Rafting-Mini-trips-image-1.jpg?w=1200", "https://rvapaddlesports.com/", "RVA Paddlesports", "A guided raft crew on the operator's Richmond river trip", "exact-place-or-experience"]
  ],
  "crane-manor": [
    ["https://clueiq.com/wp-content/uploads/2025/05/Crane-1024x683.jpeg", "https://www.clueiq.com/", "Clue IQ", "The Crane Manor room set, Clue IQ's largest and most complex game", "exact-place-or-experience"],
    ["https://clueiq.com/wp-content/uploads/2025/05/OJB-1024x683.jpeg", "https://www.clueiq.com/", "Clue IQ", "Clue IQ's Frederick game space", "exact-place-or-experience-context"],
    ["https://clueiq.com/wp-content/uploads/2025/05/Excal-1024x683.jpeg", "https://www.clueiq.com/", "Clue IQ", "Another Clue IQ built room, showing the venue's set-construction standard", "exact-place-or-experience-context"]
  ],
  "hidden-gems-zelderon": [
    ["https://www.hiddengemsescape.com/wp-content/themes/yootheme/cache/a0/IMG_0531-scaled-a0e231b8.jpeg", "https://www.hiddengemsescape.com/", "Hidden Gems Escape", "A built room set at Hidden Gems in Richmond", "exact-place-or-experience-context"],
    ["https://www.hiddengemsescape.com/wp-content/themes/yootheme/cache/96/IMG_0465-scaled-96764fb7.jpeg", "https://www.hiddengemsescape.com/", "Hidden Gems Escape", "Puzzle-room detail at the Richmond venue", "exact-place-or-experience-context"],
    ["https://www.hiddengemsescape.com/wp-content/themes/yootheme/cache/36/IMG_0484-scaled-3635f55b.jpeg", "https://www.hiddengemsescape.com/", "Hidden Gems Escape", "Interior set dressing at Hidden Gems", "exact-place-or-experience-context"]
  ],
  "gnome-raven-magic-lamp": [
    ["https://images.squarespace-cdn.com/content/v1/5a9209e04611a058e32a65ec/1624376755906-C2PM15ZK8JMK01947F5Y/WIZARD+CUBBY+WALL.jpeg?format=1500w", "https://www.gnomeandraven.com/", "Gnome & Raven", "The wizard-cubby wall from Gnome & Raven's immersive build", "exact-place-or-experience"],
    ["https://images.squarespace-cdn.com/content/v1/5a9209e04611a058e32a65ec/f530cfc1-5acd-4874-b1b5-90ab6cd17fb8/D4A6108A-775E-463C-83E6-5F8DF6134D75.jpeg?format=1500w", "https://www.gnomeandraven.com/", "Gnome & Raven", "Set detail from the Richmond immersive room", "exact-place-or-experience-context"],
    ["https://images.squarespace-cdn.com/content/v1/5a9209e04611a058e32a65ec/1630165229109-ZIM2EQEGLJBKQTW6JJGE/90D68A01-6F26-4BE4-AA37-C7B153B485E5.jpeg?format=1500w", "https://www.gnomeandraven.com/", "Gnome & Raven", "A further built set at the Richmond venue", "exact-place-or-experience-context"],
  ],
  "escape-on-queen": [
    ["https://static.wixstatic.com/media/d8c951_3dd4cb80b75e4cd7b913c90fcfb0c88b~mv2.png", "https://www.escapeonqueen.com/", "Escape on Queen", "Room artwork for the Lancaster venue's long-form game", "exact-place-or-experience-context"],
    ["https://static.wixstatic.com/media/d8c951_ae28c2c10b994db09874db70cdd14ac1~mv2.png", "https://www.escapeonqueen.com/", "Escape on Queen", "Escape on Queen room branding", "exact-place-or-experience-context"],
    ["https://static.wixstatic.com/media/d8c951_c78fde210382465188a55e5696e58128~mv2.png", "https://www.escapeonqueen.com/", "Escape on Queen", "Venue artwork for the Post Office Pursuit concept", "exact-place-or-experience-context"]
  ]
};
