export const ROUTE_ID = "route-09";
export const ROUTE_SLUG = "route-09-kaleidoscopes-scripture-stones-secret-machines-loop";
export const ROUTE_NAME = "The Kaleidoscopes, Scripture Stones & Secret Machines Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("art-omi", "Art Omi, 1405 County Route 22, Ghent, New York", ["Art Omi sculpture architecture", "Art Omi Ghent New York", "Art Omi sculpture park landscape"]),
  p("naumkeag-pumpkin", "Naumkeag, 5 Prospect Hill Road, Stockbridge, Massachusetts", ["Naumkeag Stockbridge Blue Steps", "Naumkeag Stockbridge Massachusetts", "Naumkeag Halloween pumpkins"]),
  p("worlds-largest-kaleidoscope", "World's Largest Kaleidoscope, Emerson Resort, Mount Tremper, New York", ["World's Largest Kaleidoscope Mount Tremper", "Emerson Kaleidoscope silo", "Kaleidostore Mount Tremper"]),
  p("opus-40", "Opus 40, 356 George Sickle Road, Saugerties, New York", ["Opus 40 Saugerties", "Opus 40 earthwork", "Opus 40 Catskills landscape"]),
  p("taber-museum", "Thomas T. Taber Museum, 858 West Fourth Street, Williamsport, Pennsylvania", ["Thomas Taber Museum Williamsport", "Taber Museum toy trains", "Taber Museum Williamsport Pennsylvania"]),
  p("millionaires-row", "Way's Garden, 800 West Fourth Street, Williamsport, Pennsylvania", ["Millionaires Row Williamsport Pennsylvania", "Way's Garden Williamsport", "West Fourth Street Williamsport historic houses"]),
  p("scripture-rocks", "Scripture Rocks Heritage Park, 560 Scripture Rocks Road, Brookville, Pennsylvania", ["Scripture Rocks Brookville Pennsylvania", "Scripture Rocks Heritage Park", "Scripture Rocks carved boulders"]),
  p("punxsutawney-folklore", "Gobbler's Knob, 1548 Woodland Avenue Extension, Punxsutawney, Pennsylvania", ["Gobbler's Knob Punxsutawney", "Punxsutawney Phil statue", "Phil's Burrow Punxsutawney"]),
  p("bayernhof", "Bayernhof Museum, 225 Saint Charles Place, Pittsburgh, Pennsylvania", ["Bayernhof Museum Pittsburgh", "Bayernhof Museum music machines", "Bayernhof Museum interior"]),
  p("heinz-history", "Heinz History Center, 1212 Smallman Street, Pittsburgh, Pennsylvania", ["Heinz History Center Pittsburgh", "Heinz History Center interior", "Heinz History Center Mister Rogers"]),
  p("alan-cottrill", "Alan Cottrill Sculpture Studio, 110 South Sixth Street, Zanesville, Ohio", ["Alan Cottrill Sculpture Studio", "Alan Cottrill bronze sculptures Zanesville", "Alan Cottrill studio interior"]),
  p("y-bridge", "Y Bridge, Zanesville, Ohio", ["Y Bridge Zanesville Ohio", "Y Bridge Zanesville aerial", "Y Bridge from Putnam Hill"]),
  p("otherworld", "Otherworld, 5819 Chantry Drive, Columbus, Ohio", ["Otherworld Columbus immersive art", "Otherworld Columbus rooms", "Otherworld Ohio installation"]),
  p("cambridge-glass", "National Museum of Cambridge Glass, 136 South Ninth Street, Cambridge, Ohio", ["National Museum Cambridge Glass", "Cambridge Glass Museum Ohio", "Cambridge Glass collection"]),
  p("butler-institute", "Butler Institute of American Art, 524 Wick Avenue, Youngstown, Ohio", ["Butler Institute American Art", "Butler Institute Youngstown interior", "Butler Institute Youngstown Ohio"]),
  p("fellows-riverside", "Fellows Riverside Gardens, 123 McKinley Avenue, Youngstown, Ohio", ["Fellows Riverside Gardens Youngstown", "Fellows Riverside Gardens autumn", "Fellows Riverside Gardens gazebo"]),
  p("st-nicholas-dubois", "St Nicholas Orthodox Church, 301 South State Street, DuBois, Pennsylvania", ["Saint Nicholas Orthodox Church DuBois", "St Nicholas Orthodox DuBois interior", "St Nicholas Orthodox Church Pennsylvania"]),
  p("bellefonte-victorian", "Talleyrand Park, 320 West High Street, Bellefonte, Pennsylvania", ["Talleyrand Park Bellefonte", "Bellefonte Pennsylvania Victorian architecture", "Bellefonte Pennsylvania courthouse"]),
  p("bellefonte-art", "Bellefonte Art Museum, 133 North Allegheny Street, Bellefonte, Pennsylvania", ["Bellefonte Art Museum", "Bellefonte Art Museum Pennsylvania", "Linn House Bellefonte"]),
  p("columcille", "Columcille Megalith Park, 2155 Fox Gap Road, Bangor, Pennsylvania", ["Columcille Megalith Park", "Columcille stone circle Pennsylvania", "Columcille Megalith Park autumn"]),
  p("asa-packer", "Asa Packer Mansion Museum, Packer Hill Avenue, Jim Thorpe, Pennsylvania", ["Asa Packer Mansion", "Asa Packer Mansion interior", "Asa Packer Mansion Jim Thorpe"]),
  p("aldrich", "The Aldrich Contemporary Art Museum, 258 Main Street, Ridgefield, Connecticut", ["Aldrich Contemporary Art Museum", "Aldrich Museum Ridgefield exterior", "Aldrich Museum exhibition"]),
  p("tarrywile", "Tarrywile Park, 70 Southern Boulevard, Danbury, Connecticut", ["Hearthstone Castle Danbury", "Tarrywile Park Connecticut", "Tarrywile Mansion Danbury"]),
  p("harvard-natural-history", "Harvard Museum of Natural History, 26 Oxford Street, Cambridge, Massachusetts", ["Harvard Museum Natural History glass flowers", "Harvard Museum Natural History great mammals", "Harvard Museum Natural History interior"]),
  p("ether-dome", "Ether Dome, Massachusetts General Hospital, 55 Fruit Street, Boston, Massachusetts", ["Ether Dome Massachusetts General Hospital", "Ether Dome interior", "Ether Monument Boston Public Garden"])
];

export const contextualImagePlaces = new Set([
  "naumkeag-pumpkin", "worlds-largest-kaleidoscope", "taber-museum", "millionaires-row",
  "punxsutawney-folklore", "bayernhof", "heinz-history", "alan-cottrill", "otherworld",
  "cambridge-glass", "butler-institute", "st-nicholas-dubois", "bellefonte-victorian",
  "bellefonte-art", "aldrich", "harvard-natural-history", "ether-dome"
]);

export const preferredCommonsFiles = {
  "art-omi": ["File:Art Omi.jpg"],
  "opus-40": ["File:Opus 40.jpg"],
  "y-bridge": ["File:Y-Bridge, Zanesville, Ohio.jpg"],
  "columcille": ["File:Columcille Megalith Park.jpg"],
  "asa-packer": ["File:Asa Packer Mansion.jpg"]
};

// Longitude, latitude. Pins target visitor entrances, parking or the named
// feature rather than broad city centroids.
export const manualCoordinates = {
  "art-omi": [-73.6766147, 42.3334297],
  "naumkeag-pumpkin": [-73.3161392, 42.2897141],
  "worlds-largest-kaleidoscope": [-74.2883494, 42.0502805],
  "opus-40": [-74.0321708, 42.0515592],
  "taber-museum": [-77.0198998, 41.2400968],
  "millionaires-row": [-77.0192656, 41.2389615],
  "scripture-rocks": [-79.0506188, 41.1594272],
  "punxsutawney-folklore": [-78.9570232, 40.9318475],
  "bayernhof": [-79.9158069, 40.4983418],
  "heinz-history": [-79.9922396, 40.4465605],
  "alan-cottrill": [-82.0050289, 39.9379756],
  "y-bridge": [-82.0144555, 39.9408623],
  "otherworld": [-82.8358334, 39.9221432],
  "cambridge-glass": [-81.5885651, 40.0237125],
  "butler-institute": [-80.6457767, 41.1047679],
  "fellows-riverside": [-80.6766042, 41.0996875],
  "st-nicholas-dubois": [-78.7707861, 41.1188561],
  "bellefonte-victorian": [-77.7817061, 40.9095540],
  "bellefonte-art": [-77.7785487, 40.9130418],
  "columcille": [-75.2024627, 40.9272149],
  "asa-packer": [-75.7372730, 40.8651570],
  "aldrich": [-73.4968718, 41.2769959],
  "tarrywile": [-73.4484190, 41.3780766],
  "harvard-natural-history": [-71.1156460, 42.3784657],
  "ether-dome": [-71.0679004, 42.3634958]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "ghent-lodging": { name: "Ghent/Chatham lodging zone", coordinates: [-73.6157, 42.3293] },
  "hancock-lodging": { name: "Hancock village lodging zone", coordinates: [-75.2805401, 41.9542233] },
  "williamsport-lodging": { name: "Central Williamsport lodging zone", coordinates: [-77.0011096, 41.2411556] },
  "brookville-lodging": { name: "Brookville historic-district lodging zone", coordinates: [-79.0794702, 41.1604348] },
  "wheeling-lodging": { name: "Wheeling riverfront lodging zone", coordinates: [-80.7209149, 40.0639616] },
  "polaris-lodging": { name: "North Columbus/Polaris lodging zone", coordinates: [-82.9840, 40.1420] },
  "west-middlesex-lodging": { name: "West Middlesex lodging zone", coordinates: [-80.4556850, 41.1854889] },
  "bellefonte-lodging": { name: "Historic Bellefonte lodging zone", coordinates: [-77.7737471, 40.9134862] },
  "tannersville-lodging": { name: "Tannersville/Bartonsville lodging zone", coordinates: [-75.3000, 41.0400] },
  "danbury-lodging": { name: "Danbury west lodging zone", coordinates: [-73.4540111, 41.3948170] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] }
};

export const manualLegs = {};

export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "art-omi", "ghent-lodging"] },
  { day: 2, risk: "medium", node_ids: ["ghent-lodging", "worlds-largest-kaleidoscope", "hancock-lodging"] },
  { day: 3, risk: "high", node_ids: ["hancock-lodging", "taber-museum", "williamsport-lodging"] },
  { day: 4, risk: "medium", node_ids: ["williamsport-lodging", "scripture-rocks", "brookville-lodging"] },
  { day: 5, risk: "high", node_ids: ["brookville-lodging", "bayernhof", "wheeling-lodging"] },
  { day: 6, risk: "medium", node_ids: ["wheeling-lodging", "alan-cottrill", "y-bridge", "otherworld", "polaris-lodging"] },
  { day: 7, risk: "high", node_ids: ["polaris-lodging", "butler-institute", "west-middlesex-lodging"] },
  { day: 8, risk: "medium", node_ids: ["west-middlesex-lodging", "st-nicholas-dubois", "bellefonte-lodging"] },
  { day: 9, risk: "high", node_ids: ["bellefonte-lodging", "columcille", "tannersville-lodging"] },
  { day: 10, risk: "high", node_ids: ["tannersville-lodging", "tarrywile", "danbury-lodging"] },
  { day: 11, risk: "high", node_ids: ["danbury-lodging", "boston-logan-return", "boston-logan-hotel"] }
];

export const replacementVariants = [
  { id: "replacement-d1-naumkeag", day: 1, replacement_place_id: "naumkeag-pumpkin", replaces_place_ids: ["art-omi"], nodes: ["boston-logan-rental", "naumkeag-pumpkin", "ghent-lodging"] },
  { id: "replacement-d2-opus-40", day: 2, replacement_place_id: "opus-40", replaces_place_ids: ["worlds-largest-kaleidoscope"], nodes: ["ghent-lodging", "opus-40", "hancock-lodging"] },
  { id: "replacement-d3-millionaires-row", day: 3, replacement_place_id: "millionaires-row", replaces_place_ids: ["taber-museum"], nodes: ["hancock-lodging", "millionaires-row", "williamsport-lodging"] },
  { id: "replacement-d4-punxsutawney", day: 4, replacement_place_id: "punxsutawney-folklore", replaces_place_ids: ["scripture-rocks"], nodes: ["williamsport-lodging", "punxsutawney-folklore", "brookville-lodging"] },
  { id: "replacement-d5-heinz", day: 5, replacement_place_id: "heinz-history", replaces_place_ids: ["bayernhof"], nodes: ["brookville-lodging", "heinz-history", "wheeling-lodging"] },
  { id: "replacement-d6-cambridge-glass", day: 6, replacement_place_id: "cambridge-glass", replaces_place_ids: ["otherworld"], nodes: ["wheeling-lodging", "cambridge-glass", "alan-cottrill", "y-bridge", "polaris-lodging"] },
  { id: "replacement-d7-fellows", day: 7, replacement_place_id: "fellows-riverside", replaces_place_ids: ["butler-institute"], nodes: ["polaris-lodging", "fellows-riverside", "west-middlesex-lodging"] },
  { id: "replacement-d8-bellefonte-art", day: 8, replacement_place_id: "bellefonte-art", replaces_place_ids: ["bellefonte-victorian"], unchanged_drive: true },
  { id: "replacement-d9-asa-packer", day: 9, replacement_place_id: "asa-packer", replaces_place_ids: ["columcille"], nodes: ["bellefonte-lodging", "asa-packer", "tannersville-lodging"] },
  { id: "replacement-d10-aldrich-garden", day: 10, replacement_place_id: "aldrich", replaces_place_ids: ["tarrywile"], nodes: ["tannersville-lodging", "aldrich", "danbury-lodging"] },
  { id: "replacement-d11-ether-dome", day: 11, replacement_place_id: "ether-dome", replaces_place_ids: ["harvard-natural-history"], unchanged_drive: true }
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
  { day: 9, date: "2026-10-12", sleep_city: "Tannersville, PA", station: "USW00014737", station_role: "Lehigh Valley-Poconos regional proxy" },
  { day: 10, date: "2026-10-13", sleep_city: "Danbury, CT", station: "USW00094702", station_role: "Bridgeport-Danbury regional proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];
