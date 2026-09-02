export const ROUTE_ID = "route-09";
export const ROUTE_SLUG = "route-09-kaleidoscopes-scripture-stones-secret-machines-loop";
export const ROUTE_NAME = "The Kaleidoscopes, Scripture Stones & Secret Machines Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("keystone-arches", "Keystone Arch Bridges Trail, Chester, Massachusetts", ["Keystone Arch Bridges Trail Chester MA", "Keystone Arch Bridges Chester"]),
  p("art-omi", "Art Omi, 1405 County Route 22, Ghent, New York", ["Art Omi sculpture architecture", "Art Omi Ghent New York", "Art Omi sculpture park landscape"]),
  p("opus-40", "Opus 40, 356 George Sickle Road, Saugerties, New York", ["Opus 40 Saugerties", "Opus 40 Catskills landscape"]),
  p("rail-explorers-express", "Rail Explorers Catskills, 70 Lower High Street, Phoenicia, New York", ["Rail Explorers Catskills Phoenicia NY", "Rail Explorers Catskills pedal"]),
  p("worlds-end", "Worlds End State Park, Forksville, Pennsylvania", ["Worlds End State Park Pennsylvania", "Worlds End State Park Canyon Vista"]),
  p("bilgers-rocks", "Bilger's Rocks, 1921 Bilgers Rocks Road, Grampian, Pennsylvania", ["Bilger's Rocks Grampian PA", "Bilger's Rocks Pennsylvania sandstone"]),
  p("scripture-rocks", "Scripture Rocks Heritage Park, 560 Scripture Rocks Road, Brookville, Pennsylvania", ["Scripture Rocks Brookville Pennsylvania", "Scripture Rocks Heritage Park"]),
  p("bayernhof", "Bayernhof Museum, 225 Saint Charles Place, Pittsburgh, Pennsylvania", ["Bayernhof Museum Pittsburgh", "Bayernhof Museum music machines"]),
  p("palace-of-gold", "Palace of Gold, 3759 McCreary's Ridge Road, Moundsville, West Virginia", ["Palace of Gold New Vrindaban West Virginia", "Prabhupada's Palace of Gold interior"]),
  p("alan-cottrill", "Alan Cottrill Sculpture Studio, 110 South Sixth Street, Zanesville, Ohio", ["Alan Cottrill Sculpture Studio Zanesville", "Alan Cottrill bronze sculptures Zanesville"]),
  p("otherworld", "Otherworld, 5819 Chantry Drive, Columbus, Ohio", ["Otherworld Columbus immersive art", "Otherworld Columbus rooms"]),
  p("faustus-escape", "Captivating Worlds, 7475 Walton Parkway, New Albany, Ohio", ["Captivating Worlds escape room Columbus Ohio", "Doctor Faustus escape room Columbus"]),
  p("warther-museum", "Ernest Warther Museum & Gardens, 331 Karl Avenue, Dover, Ohio", ["Ernest Warther Museum Dover Ohio", "Warther Museum wood carving"]),
  p("grove-city-outlets", "Grove City Premium Outlets, 1911 Leesburg Grove City Road, Grove City, Pennsylvania", ["Grove City Premium Outlets Pennsylvania", "Grove City Premium Outlets stores"]),
  p("st-nicholas-orthodox", "St Nicholas Orthodox Church, 2053 North Road NE, Warren, Ohio", ["St Nicholas Orthodox Church Warren Ohio", "St Nicholas Orthodox Warren Ohio interior"]),
  p("parker-dam", "Parker Dam State Park, 28 Fairview Road, Penfield, Pennsylvania", ["Parker Dam State Park Pennsylvania", "Parker Dam State Park lake"]),
  p("bellefonte-talleyrand", "Talleyrand Park, 320 West High Street, Bellefonte, Pennsylvania", ["Talleyrand Park Bellefonte", "Bellefonte Pennsylvania Victorian architecture"]),
  p("hickory-run-boulder-field", "Hickory Run Boulder Field, White Haven, Pennsylvania", ["Hickory Run Boulder Field Pennsylvania", "Boulder Field Hickory Run State Park"]),
  p("skirmish-paintball", "Skirmish Paintball, 211 North Meckesville Road, Albrightsville, Pennsylvania", ["Skirmish Paintball Albrightsville PA", "Skirmish Paintball Pennsylvania woods"]),
  p("columcille", "Columcille Megalith Park, 2155 Fox Gap Road, Bangor, Pennsylvania", ["Columcille Megalith Park Bangor Pennsylvania", "Columcille stone circle Pennsylvania"]),
  p("fonthill-castle", "Fonthill Castle, 525 East Court Street, Doylestown, Pennsylvania", ["Fonthill Castle Doylestown Pennsylvania", "Fonthill Castle interior Mercer"]),
  p("northlandz", "Northlandz, 495 US-202, Flemington, New Jersey", ["Northlandz Flemington New Jersey", "Northlandz miniature railroad"]),
  p("puzzle-theory-spectral", "Puzzle Theory, 100 Barber Avenue, South Windsor, Connecticut", ["Puzzle Theory escape room South Windsor Connecticut", "Puzzle Theory Spectral Rift room"]),
  
  // Flex / Optional / Conditional
  p("worlds-largest-kaleidoscope", "World's Largest Kaleidoscope, Emerson Resort, Mount Tremper, New York", ["World's Largest Kaleidoscope Mount Tremper", "Emerson Kaleidoscope silo"]),
  p("rail-explorers-river-run", "Rail Explorers Catskills, 70 Lower High Street, Phoenicia, New York", ["Rail Explorers Catskills Phoenicia NY", "Rail Explorers Catskills pedal"]),
  p("kaaterskill-falls", "Kaaterskill Falls, Hunter, New York", ["Kaaterskill Falls Catskills NY", "Kaaterskill Falls autumn"]),
  p("saugerties-lighthouse", "Saugerties Lighthouse, 168 Lighthouse Drive, Saugerties, New York", ["Saugerties Lighthouse New York", "Saugerties Lighthouse Hudson River"]),
  p("spiral-house-park", "Spiral House Park, Saugerties, New York", ["Spiral House Saugerties NY"]),
  p("roebling-aqueduct", "Roebling's Delaware Aqueduct, Lackawaxen, Pennsylvania", ["Roebling's Delaware Aqueduct PA NY", "Delaware Aqueduct bridge"]),
  p("hawks-nest", "Hawks Nest Highway, Port Jervis, New York", ["Hawks Nest Route 97 New York", "Hawks Nest Highway NY Delaware River"]),
  p("ricketts-glen", "Ricketts Glen State Park, Benton, Pennsylvania", ["Ricketts Glen State Park Pennsylvania waterfalls", "Ricketts Glen Falls Trail"]),
  p("elk-country-visitor-center", "Elk Country Visitor Center, 134 Homestead Drive, Benezette, Pennsylvania", ["Elk Country Visitor Center Benezette PA", "Benezette Pennsylvania elk"]),
  p("kinzua-bridge", "Kinzua Bridge State Park, Mount Jewett, Pennsylvania", ["Kinzua Bridge State Park Skywalk PA", "Kinzua Bridge Mount Jewett"]),
  p("austin-dam", "Austin Dam Memorial Park, Austin, Pennsylvania", ["Austin Dam Memorial Park PA", "Austin Dam ruins Pennsylvania"]),
  p("penns-cave", "Penn's Cave & Wildlife Park, 222 Penns Cave Road, Centre Hall, Pennsylvania", ["Penn's Cave Centre Hall PA", "Penn's Cave boat tour Pennsylvania"]),
  p("troy-hill-lighthouse", "Darkhouse Lighthouse, Troy Hill, Pittsburgh, Pennsylvania", ["Darkhouse Lighthouse Troy Hill Pittsburgh"]),
  p("troy-hill-hutte-royal", "La Hütte Royal, Troy Hill, Pittsburgh, Pennsylvania", ["La Hutte Royal Troy Hill Pittsburgh"]),
  p("troy-hill-kunzhaus", "Kunzhaus, Troy Hill, Pittsburgh, Pennsylvania", ["Kunzhaus Troy Hill Pittsburgh"]),
  p("troy-hill-mrs-christopher", "Mrs. Christopher's House, Troy Hill, Pittsburgh, Pennsylvania", ["Mrs Christopher's House Troy Hill Pittsburgh"]),
  p("gamegrounds-columbus", "Gamegrounds, Columbus, Ohio", ["Gamegrounds Columbus Ohio", "Gamegrounds arcade Columbus"]),
  p("captivating-worlds-machine", "Captivating Worlds, 7475 Walton Parkway, New Albany, Ohio", ["Captivating Worlds escape room Columbus Ohio", "Welcome to the Machine escape room"]),
  p("book-loft", "The Book Loft of German Village, 631 South 3rd Street, Columbus, Ohio", ["Book Loft German Village Columbus", "Book Loft Columbus Ohio bookstore"]),
  p("hartman-rock-garden", "Hartman Rock Garden, 1905 Russell Avenue, Springfield, Ohio", ["Hartman Rock Garden Springfield Ohio", "Hartman Rock Garden outsider art"]),
  p("cook-forest-cathedral", "Cook Forest State Park, Cooksburg, Pennsylvania", ["Cook Forest State Park Forest Cathedral", "Cook Forest Pennsylvania old growth"]),
  p("lakota-wolf", "Lakota Wolf Preserve, 89 Mount Pleasant Road, Columbia, New Jersey", ["Lakota Wolf Preserve Columbia NJ", "Lakota Wolf Preserve New Jersey wolves"]),
  p("luna-parc", "Luna Parc, 22 De Groat Road, Sandyston, New Jersey", ["Luna Parc Sandyston New Jersey", "Luna Parc Ricky Boscarino"]),
  p("tarrywile", "Tarrywile Park, 70 Southern Boulevard, Danbury, Connecticut", ["Tarrywile Park Connecticut", "Hearthstone Castle Danbury"]),
  p("optical-heritage-museum", "Optical Heritage Museum, 12 Crane Street, Southbridge, Massachusetts", ["Optical Heritage Museum Southbridge MA", "Optical Heritage Museum optics"]),
  p("puzzle-theory-kraken", "Puzzle Theory, 100 Barber Avenue, South Windsor, Connecticut", ["Puzzle Theory escape room South Windsor CT", "Puzzle Theory Kraken room"]),
  p("harvard-natural-history", "Harvard Museum of Natural History, 26 Oxford Street, Cambridge, Massachusetts", ["Harvard Museum Natural History glass flowers", "Harvard Museum Natural History"]),
  p("y-bridge", "Y Bridge, Zanesville, Ohio", ["Y Bridge Zanesville Ohio", "Y Bridge from Putnam Hill"]),
  p("ramapo-valley", "Ramapo Valley County Reservation, 608 Ramapo Valley Road, Mahwah, New Jersey", ["Ramapo Valley County Reservation", "Scarlet Oak Pond Ramapo"])
];

export const contextualImagePlaces = new Set([
  "art-omi", "opus-40", "otherworld", "grove-city-outlets", "st-nicholas-orthodox", 
  "bellefonte-talleyrand", "hickory-run-boulder-field", "columcille", "fonthill-castle", 
  "northlandz", "tarrywile", "y-bridge", "ramapo-valley", "parker-dam", "worlds-end", "bilgers-rocks"
]);

export const preferredCommonsFiles = {
  "art-omi": ["File:Art Omi.jpg"],
  "opus-40": ["File:Opus 40.jpg"],
  "y-bridge": ["File:Y-Bridge, Zanesville, Ohio.jpg"],
  "columcille": ["File:Columcille Megalith Park.jpg"],
  "fonthill-castle": ["File:Fonthill Castle.jpg"],
  "bayernhof": ["File:Bayernhof Museum.jpg"],
  "harvard-natural-history": ["File:Harvard Museum of Natural History.jpg"]
};

// Fallback to auto-geocoding mostly, but these help nominatim:
export const manualCoordinates = {
  "bayernhof": [-79.9158069, 40.4983418],
  "y-bridge": [-82.0144555, 39.9408623],
  "columcille": [-75.2024627, 40.9272149],
  "harvard-natural-history": [-71.1156460, 42.3784657]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "ghent-lodging": { name: "Ghent/Hudson lodging zone", coordinates: [-73.6157, 42.3293] },
  "hancock-lodging": { name: "Hancock lodging zone", coordinates: [-75.2805401, 41.9542233] },
  "williamsport-lodging": { name: "Williamsport lodging zone", coordinates: [-77.0011096, 41.2411556] },
  "brookville-lodging": { name: "Brookville lodging zone", coordinates: [-79.0794702, 41.1604348] },
  "wheeling-lodging": { name: "Wheeling lodging zone", coordinates: [-80.7209149, 40.0639616] },
  "columbus-lodging": { name: "Columbus lodging zone", coordinates: [-82.9840, 40.1420] },
  "west-middlesex-lodging": { name: "West Middlesex lodging zone", coordinates: [-80.4556850, 41.1854889] },
  "bellefonte-lodging": { name: "Bellefonte lodging zone", coordinates: [-77.7737471, 40.9134862] },
  "bangor-lodging": { name: "Bangor/Stroudsburg lodging zone", coordinates: [-75.2000, 40.9500] },
  "danbury-lodging": { name: "Danbury lodging zone", coordinates: [-73.4540111, 41.3948170] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
  // Comfort breaks that split measured legs over the 150-minute uninterrupted ceiling.
  // Neutral waypoints, not attractions: the optional places near them stay optional.
  "sturbridge-break": { name: "Sturbridge, MA comfort break", coordinates: [-72.0787, 42.1015] },
  "binghamton-break": { name: "Binghamton, NY comfort break", coordinates: [-75.9180, 42.0987] },
  "clarion-break": { name: "Clarion, PA comfort break", coordinates: [-79.3839, 41.2151] },
  "mahwah-break": { name: "Mahwah, NJ comfort break", coordinates: [-74.1449, 41.0890] }
};

export const manualLegs = {};

export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "sturbridge-break", "keystone-arches", "art-omi", "ghent-lodging"] },
  { day: 2, risk: "medium", node_ids: ["ghent-lodging", "opus-40", "rail-explorers-express", "hancock-lodging"] },
  { day: 3, risk: "high", node_ids: ["hancock-lodging", "binghamton-break", "worlds-end", "williamsport-lodging"] },
  { day: 4, risk: "medium", node_ids: ["williamsport-lodging", "bilgers-rocks", "scripture-rocks", "brookville-lodging"] },
  { day: 5, risk: "high", node_ids: ["brookville-lodging", "bayernhof", "palace-of-gold", "wheeling-lodging"] },
  { day: 6, risk: "medium", node_ids: ["wheeling-lodging", "alan-cottrill", "otherworld", "columbus-lodging"] },
  { day: 7, risk: "high", node_ids: ["columbus-lodging", "faustus-escape", "warther-museum", "grove-city-outlets", "west-middlesex-lodging"] },
  { day: 8, risk: "medium", node_ids: ["west-middlesex-lodging", "st-nicholas-orthodox", "clarion-break", "parker-dam", "bellefonte-talleyrand", "bellefonte-lodging"] },
  { day: 9, risk: "high", node_ids: ["bellefonte-lodging", "hickory-run-boulder-field", "skirmish-paintball", "columcille", "bangor-lodging"] },
  { day: 10, risk: "high", node_ids: ["bangor-lodging", "fonthill-castle", "northlandz", "mahwah-break", "danbury-lodging"] },
  { day: 11, risk: "high", node_ids: ["danbury-lodging", "puzzle-theory-spectral", "boston-logan-return", "boston-logan-hotel"] }
];

export const replacementVariants = [
  {
    "id": "replacement-d2-worlds-largest-kaleidoscope",
    "day": 2,
    "replacement_place_id": "worlds-largest-kaleidoscope",
    "replaces_place_ids": [
      "opus-40"
    ]
  },
  {
    "id": "replacement-d2-rail-explorers-river-run",
    "day": 2,
    "replacement_place_id": "rail-explorers-river-run",
    "replaces_place_ids": [
      "rail-explorers-express"
    ]
  },
  {
    "id": "replacement-d2-kaaterskill-falls",
    "day": 2,
    "replacement_place_id": "kaaterskill-falls",
    "replaces_place_ids": [
      "opus-40"
    ]
  },
  {
    "id": "replacement-d2-saugerties-lighthouse",
    "day": 2,
    "replacement_place_id": "saugerties-lighthouse",
    "replaces_place_ids": [
      "opus-40"
    ]
  },
  {
    "id": "replacement-d2-spiral-house-park",
    "day": 2,
    "replacement_place_id": "spiral-house-park",
    "replaces_place_ids": [
      "opus-40"
    ]
  },
  {
    "id": "replacement-d3-roebling-aqueduct",
    "day": 3,
    "replacement_place_id": "roebling-aqueduct",
    "replaces_place_ids": [
      "worlds-end"
    ]
  },
  {
    "id": "replacement-d3-hawks-nest",
    "day": 3,
    "replacement_place_id": "hawks-nest",
    "replaces_place_ids": [
      "worlds-end"
    ]
  },
  {
    "id": "replacement-d3-ricketts-glen",
    "day": 3,
    "replacement_place_id": "ricketts-glen",
    "replaces_place_ids": [
      "worlds-end"
    ]
  },
  {
    "id": "replacement-d4-elk-country-visitor-center",
    "day": 4,
    "replacement_place_id": "elk-country-visitor-center",
    "replaces_place_ids": [
      "bilgers-rocks"
    ]
  },
  {
    "id": "replacement-d4-kinzua-bridge",
    "day": 4,
    "replacement_place_id": "kinzua-bridge",
    "replaces_place_ids": [
      "scripture-rocks"
    ]
  },
  {
    "id": "replacement-d4-austin-dam",
    "day": 4,
    "replacement_place_id": "austin-dam",
    "replaces_place_ids": [
      "scripture-rocks"
    ]
  },
  {
    "id": "replacement-d4-cook-forest-cathedral",
    "day": 4,
    "replacement_place_id": "cook-forest-cathedral",
    "replaces_place_ids": [
      "scripture-rocks"
    ]
  },
  {
    "id": "replacement-d5-troy-hill-lighthouse",
    "day": 5,
    "replacement_place_id": "troy-hill-lighthouse",
    "replaces_place_ids": [
      "bayernhof"
    ]
  },
  {
    "id": "replacement-d5-troy-hill-hutte-royal",
    "day": 5,
    "replacement_place_id": "troy-hill-hutte-royal",
    "replaces_place_ids": [
      "bayernhof"
    ]
  },
  {
    "id": "replacement-d5-troy-hill-kunzhaus",
    "day": 5,
    "replacement_place_id": "troy-hill-kunzhaus",
    "replaces_place_ids": [
      "bayernhof"
    ]
  },
  {
    "id": "replacement-d5-troy-hill-mrs-christopher",
    "day": 5,
    "replacement_place_id": "troy-hill-mrs-christopher",
    "replaces_place_ids": [
      "bayernhof"
    ]
  },
  {
    "id": "replacement-d6-gamegrounds-columbus",
    "day": 6,
    "replacement_place_id": "gamegrounds-columbus",
    "replaces_place_ids": [
      "otherworld"
    ]
  },
  {
    "id": "replacement-d6-book-loft",
    "day": 6,
    "replacement_place_id": "book-loft",
    "replaces_place_ids": [
      "otherworld"
    ]
  },
  {
    "id": "replacement-d6-y-bridge",
    "day": 6,
    "replacement_place_id": "y-bridge",
    "replaces_place_ids": [
      "alan-cottrill"
    ]
  },
  {
    "id": "replacement-d7-captivating-worlds-machine",
    "day": 7,
    "replacement_place_id": "captivating-worlds-machine",
    "replaces_place_ids": [
      "faustus-escape"
    ]
  },
  {
    "id": "replacement-d7-hartman-rock-garden",
    "day": 7,
    "replacement_place_id": "hartman-rock-garden",
    "replaces_place_ids": [
      "warther-museum"
    ]
  },
  {
    "id": "replacement-d8-penns-cave",
    "day": 8,
    "replacement_place_id": "penns-cave",
    "replaces_place_ids": [
      "parker-dam"
    ]
  },
  {
    "id": "replacement-d10-lakota-wolf",
    "day": 10,
    "replacement_place_id": "lakota-wolf",
    "replaces_place_ids": [
      "northlandz"
    ]
  },
  {
    "id": "replacement-d10-luna-parc",
    "day": 10,
    "replacement_place_id": "luna-parc",
    "replaces_place_ids": [
      "northlandz"
    ]
  },
  {
    "id": "replacement-d10-tarrywile",
    "day": 10,
    "replacement_place_id": "tarrywile",
    "replaces_place_ids": [
      "fonthill-castle"
    ]
  },
  {
    "id": "replacement-d10-ramapo-valley",
    "day": 10,
    "replacement_place_id": "ramapo-valley",
    "replaces_place_ids": [
      "northlandz"
    ]
  },
  {
    "id": "replacement-d11-optical-heritage-museum",
    "day": 11,
    "replacement_place_id": "optical-heritage-museum",
    "replaces_place_ids": [
      "puzzle-theory-spectral"
    ]
  },
  {
    "id": "replacement-d11-puzzle-theory-kraken",
    "day": 11,
    "replacement_place_id": "puzzle-theory-kraken",
    "replaces_place_ids": [
      "puzzle-theory-spectral"
    ]
  },
  {
    "id": "replacement-d11-harvard-natural-history",
    "day": 11,
    "replacement_place_id": "harvard-natural-history",
    "replaces_place_ids": [
      "puzzle-theory-spectral"
    ]
  }
];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "Ghent, NY", station: "USW00014735", station_role: "Albany-Ghent regional proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Hancock, NY", station: "USW00004725", station_role: "Binghamton-Hancock regional proxy" },
  { day: 3, date: "2026-10-06", sleep_city: "Williamsport, PA", station: "USW00014778", station_role: "Williamsport airport" },
  { day: 4, date: "2026-10-07", sleep_city: "Brookville, PA", station: "USW00004751", station_role: "DuBois-Brookville regional proxy" },
  { day: 5, date: "2026-10-08", sleep_city: "Wheeling, WV", station: "USW00094823", station_role: "Pittsburgh-Wheeling regional proxy" },
  { day: 6, date: "2026-10-09", sleep_city: "Columbus, OH", station: "USW00014821", station_role: "Columbus airport" },
  { day: 7, date: "2026-10-10", sleep_city: "West Middlesex, PA", station: "USW00014852", station_role: "Youngstown-West Middlesex regional proxy" },
  { day: 8, date: "2026-10-11", sleep_city: "Bellefonte, PA", station: "USW00014777", station_role: "State College-Bellefonte regional proxy" },
  { day: 9, date: "2026-10-12", sleep_city: "Bangor, PA", station: "USW00014737", station_role: "Lehigh Valley-Poconos regional proxy" },
  { day: 10, date: "2026-10-13", sleep_city: "Danbury, CT", station: "USW00094702", station_role: "Bridgeport-Danbury regional proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];
