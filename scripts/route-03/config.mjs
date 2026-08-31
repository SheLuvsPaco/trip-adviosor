export const ROUTE_ID = "route-03";
export const ROUTE_SLUG = "route-03-wild-shore-rockets-folklore-loop";
export const ROUTE_NAME = "The Wild Shore, Rockets & Folklore Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("florence-griswold", "Florence Griswold Museum, 96 Lyme Street, Old Lyme, Connecticut", ["Florence Griswold Museum Old Lyme", "Florence Griswold House Connecticut", "Lieutenant River Old Lyme art colony"]),
  p("cross-sound-ferry", "Cross Sound Ferry, 2 Ferry Street, New London, Connecticut", ["Cross Sound Ferry New London", "New London Orient Point ferry", "Orient Point lighthouse ferry"]),
  p("greenport-waterfront", "Mitchell Park, 115 Front Street, Greenport, New York", ["Mitchell Park Greenport carousel", "Greenport Long Island waterfront", "Greenport harbor New York"]),
  p("book-barn-niantic", "The Book Barn, 41 West Main Street, Niantic, Connecticut", ["Book Barn Niantic Connecticut", "Niantic Connecticut book shop gardens", "Niantic Connecticut Main Street"]),
  p("north-ferry", "North Ferry, 12 Summerfield Place, Shelter Island Heights, New York", ["North Ferry Shelter Island Greenport", "Shelter Island ferry", "Greenport Shelter Island ferry"]),
  p("mashomack-preserve", "Mashomack Preserve, 79 South Ferry Road, Shelter Island, New York", ["Mashomack Preserve Shelter Island", "Mashomack tidal creek", "Shelter Island nature preserve"]),
  p("south-ferry", "South Ferry, 135 South Ferry Road, Shelter Island, New York", ["South Ferry Shelter Island", "Shelter Island South Ferry", "North Haven Shelter Island ferry"]),
  p("parrish-art-museum", "Parrish Art Museum, 279 Montauk Highway, Water Mill, New York", ["Parrish Art Museum", "Parrish Art Museum interior", "Parrish Art Museum Water Mill architecture"]),
  p("big-duck", "The Big Duck, 1012 Flanders Road, Flanders, New York", ["Big Duck Flanders New York", "Big Duck Long Island", "Big Duck roadside architecture"]),
  p("tanger-riverhead", "Tanger Outlets Riverhead, 1770 West Main Street, Riverhead, New York", ["Tanger Outlets Riverhead", "Riverhead New York outlet center", "Tanger Riverhead Long Island"]),
  p("long-island-aquarium", "Long Island Aquarium, 431 East Main Street, Riverhead, New York", ["Long Island Aquarium Riverhead", "Long Island Aquarium coral reef", "Long Island Aquarium shark tank"]),
  p("cradle-of-aviation", "Cradle of Aviation Museum, Charles Lindbergh Boulevard, Garden City, New York", ["Cradle of Aviation Museum", "Cradle Aviation lunar module", "Cradle of Aviation Museum interior"]),
  p("asbury-boardwalk", "Asbury Park Convention Hall, 1300 Ocean Avenue, Asbury Park, New Jersey", ["Asbury Park Convention Hall", "Asbury Park boardwalk", "Asbury Park carousel house"]),
  p("silverball-asbury", "Silverball Retro Arcade, 1000 Ocean Avenue, Asbury Park, New Jersey", ["Silverball Museum Asbury Park", "Asbury Park pinball arcade", "Silverball retro arcade"]),
  p("asbury-live-music", "The Stone Pony, 913 Ocean Avenue, Asbury Park, New Jersey", ["Stone Pony Asbury Park", "Wonder Bar Asbury Park", "Asbury Park live music"]),
  p("ocean-grove", "Great Auditorium, 21 Pilgrim Pathway, Ocean Grove, New Jersey", ["Great Auditorium Ocean Grove", "Ocean Grove tent city", "Ocean Grove New Jersey Victorian"]),
  p("lucy-elephant", "Lucy the Elephant, 9200 Atlantic Avenue, Margate City, New Jersey", ["Lucy the Elephant Margate", "Lucy Elephant interior", "Lucy Elephant Atlantic Ocean"]),
  p("nas-wildwood", "Naval Air Station Wildwood Aviation Museum, 500 Forrestal Road, Cape May, New Jersey", ["NAS Wildwood Aviation Museum", "Hangar One Cape May aircraft", "Naval Air Station Wildwood museum"]),
  p("cape-may-victorian", "Washington Street Mall, Cape May, New Jersey", ["Cape May Victorian houses", "Washington Street Mall Cape May", "Cape May historic district autumn"]),
  p("cape-may-ghosts", "Ocean Street Trolley Stop, Cape May, New Jersey", ["Cape May trolley", "Emlen Physick Estate", "Cape May Victorian night"]),
  p("sunset-beach-atlantus", "Sunset Beach, 502 Sunset Boulevard, Cape May Point, New Jersey", ["SS Atlantus concrete ship Cape May", "Sunset Beach Cape May Point", "Cape May diamonds Sunset Beach"]),
  p("cape-may-lewes-ferry", "Cape May-Lewes Ferry Terminal, 1200 Lincoln Boulevard, North Cape May, New Jersey", ["Cape May Lewes Ferry", "Cape May ferry Delaware Bay", "Cape May Lewes ferry deck"]),
  p("fort-miles", "Fort Miles Museum, 15099 Cape Henlopen Drive, Lewes, Delaware", ["Fort Miles Delaware", "Battery 519 Fort Miles", "Fort Miles artillery park"]),
  p("great-dune-tower", "Observation Tower, Fort Miles, Cape Henlopen State Park, Lewes, Delaware", ["Cape Henlopen observation tower", "Fort Miles fire control tower", "Cape Henlopen great dune"]),
  p("berlin-historic", "Atlantic Hotel, 2 North Main Street, Berlin, Maryland", ["Berlin Maryland Main Street", "Atlantic Hotel Berlin Maryland", "Berlin Maryland historic district"]),
  p("zwaanendael", "Zwaanendael Museum, 102 Kings Highway, Lewes, Delaware", ["Zwaanendael Museum", "Zwaanendael Museum interior", "Lewes Delaware Dutch architecture"]),
  p("assateague", "Assateague Island National Seashore, 7206 National Seashore Lane, Berlin, Maryland", ["Assateague wild horses Maryland", "Assateague Island dunes", "Assateague Island National Seashore"]),
  p("nasa-wallops", "NASA Wallops Visitor Center, 175 Chincoteague Road, Wallops Island, Virginia", ["NASA Wallops Visitor Center", "Wallops sounding rocket", "NASA Wallops exhibits"]),
  p("barrier-islands-center", "Barrier Islands Center, 7295 Young Street, Machipongo, Virginia", ["Barrier Islands Center Machipongo", "Barrier Islands Center Virginia", "Machipongo Almshouse museum"]),
  p("chesapeake-bridge-tunnel", "Chesapeake Bay Bridge-Tunnel, Virginia", ["Chesapeake Bay Bridge Tunnel", "Chesapeake Bay Bridge Tunnel aerial", "Chesapeake Bay Bridge Tunnel sunset"]),
  p("norfolk-pagoda", "Pagoda and Oriental Garden, 265 West Tazewell Street, Norfolk, Virginia", ["Norfolk Pagoda garden", "Pagoda Oriental Garden Norfolk", "Norfolk waterfront pagoda"]),
  p("cape-charles", "Cape Charles Historic District, Cape Charles, Virginia", ["Cape Charles Virginia historic district", "Cape Charles Virginia beach", "Cape Charles railroad harbor"]),
  p("nauticus-wisconsin", "Nauticus, 1 Waterside Drive, Norfolk, Virginia", ["Battleship Wisconsin Norfolk", "Nauticus Norfolk", "USS Wisconsin deck"]),
  p("edgar-cayce-are", "Edgar Cayce A.R.E., 215 67th Street, Virginia Beach, Virginia", ["Edgar Cayce ARE Virginia Beach", "Edgar Cayce library", "ARE Virginia Beach campus"]),
  p("vibe-neptune", "King Neptune Statue, 3001 Atlantic Avenue, Virginia Beach, Virginia", ["King Neptune Virginia Beach", "ViBe Creative District murals", "Virginia Beach boardwalk Neptune"]),
  p("poe-museum-richmond", "Poe Museum, 1914 East Main Street, Richmond, Virginia", ["Poe Museum Richmond", "Poe Museum Enchanted Garden", "Poe Museum Richmond black cat"]),
  p("hermitage-norfolk", "Hermitage Museum and Gardens, 7637 North Shore Road, Norfolk, Virginia", ["Hermitage Museum Norfolk", "Hermitage Museum gardens Norfolk", "Hermitage Norfolk Arts and Crafts house"]),
  p("richmond-orthodox", "Saints Constantine and Helen Greek Orthodox Cathedral, 30 Malvern Avenue, Richmond, Virginia", ["Saints Constantine Helen Cathedral Richmond", "Greek Orthodox Cathedral Richmond Virginia", "Orthodox iconostasis Richmond"]),
  p("bo-railroad", "B&O Railroad Museum, 901 West Pratt Street, Baltimore, Maryland", ["B&O Railroad Museum roundhouse", "B&O Railroad Museum Baltimore", "Mount Clare roundhouse interior"]),
  p("baltimore-industry", "Baltimore Museum of Industry, 1415 Key Highway, Baltimore, Maryland", ["Baltimore Museum of Industry cannery", "Baltimore Museum of Industry machine shop", "Baltimore Museum of Industry waterfront"]),
  p("mutter-museum", "Mutter Museum, 19 South 22nd Street, Philadelphia, Pennsylvania", ["Mutter Museum Philadelphia exterior", "College of Physicians Philadelphia museum", "Mutter Museum medical instruments"]),
  p("metuchen-main-street", "Main Street and New Street, Metuchen, New Jersey", ["Metuchen New Jersey Main Street", "Downtown Metuchen New Jersey", "Metuchen New Jersey station downtown"]),
  p("andalusia-estate", "Andalusia Historic House, 1237 State Road, Andalusia, Pennsylvania", ["Andalusia Historic House Pennsylvania", "Andalusia Biddle estate gardens", "Andalusia Mansion Bucks County"]),
  p("sleepy-hollow-cemetery", "Sleepy Hollow Cemetery, 540 North Broadway, Sleepy Hollow, New York", ["Sleepy Hollow Cemetery", "Washington Irving grave Sleepy Hollow", "Sleepy Hollow cemetery autumn"]),
  p("old-dutch-church", "Old Dutch Church, 430 North Broadway, Sleepy Hollow, New York", ["Old Dutch Church Sleepy Hollow", "Old Dutch Burying Ground", "Sleepy Hollow church autumn"]),
  p("headless-horseman", "Headless Horseman Bridge, Sleepy Hollow, New York", ["Headless Horseman Bridge Sleepy Hollow", "Headless Horseman statue Sleepy Hollow", "Sleepy Hollow New York autumn"]),
  p("pumpkin-blaze", "Van Cortlandt Manor, 525 South Riverside Avenue, Croton-on-Hudson, New York", ["Great Jack O Lantern Blaze Hudson Valley", "Van Cortlandt Manor pumpkin blaze", "pumpkin blaze Sleepy Hollow"]),
  p("rockefeller-arts", "David Rockefeller Creative Arts Center, 200 Lake Road, Tarrytown, New York", ["David Rockefeller Creative Arts Center", "Pocantico Center architecture", "Rockefeller Pocantico art center"]),
  p("pez-visitor-center", "PEZ Visitor Center, 35 Prindle Hill Road, Orange, Connecticut", ["PEZ Visitor Center", "largest PEZ dispenser", "PEZ factory Orange Connecticut"]),
  p("barker-cartoon-museum", "Barker Character Comic and Cartoon Museum, 1188 Highland Avenue, Cheshire, Connecticut", ["Barker Character Comic Cartoon Museum", "Barker Museum Cheshire toys", "Barker cartoon museum Connecticut"])
];

export const contextualImagePlaces = new Set([
  "cross-sound-ferry", "north-ferry", "south-ferry", "tanger-riverhead", "asbury-live-music",
  "cape-may-ghosts", "cape-may-lewes-ferry", "great-dune-tower", "berlin-historic",
  "chesapeake-bridge-tunnel", "vibe-neptune", "richmond-orthodox", "mutter-museum", "metuchen-main-street",
  "headless-horseman", "pumpkin-blaze"
]);

export const preferredCommonsFiles = {
  "north-ferry": [
    "File:At Greenport, Long Island 2025 072.jpg",
    "File:At Greenport, Long Island 2025 073.jpg",
    "File:At Greenport, Long Island 2018 13.jpg"
  ],
  "long-island-aquarium": [
    "File:Long Island Aquarium 2018 020.jpg",
    "File:Long Island Aquarium 2018 041.jpg",
    "File:Long Island Aquarium 2018 063.jpg"
  ],
  "nas-wildwood": [
    "File:NAS Wildwood Hangar.jpg",
    "File:NAS Wildwood Museum.jpg",
    "File:NAS Wildwood Museum A 01.jpg"
  ],
  "cape-may-lewes-ferry": [
    "File:Cape May Lewes Ferry.jpg",
    "File:The Cape May–Lewes Ferry in Delaware.jpg",
    "File:Dolphins and the Cape May–Lewes Ferry.jpg"
  ],
  "berlin-historic": [
    "File:Berlin, MD.jpg",
    "File:Berlin Main Street MD4.jpg",
    "File:Berlin Main Street MD1.jpg"
  ],
  "zwaanendael": [
    "File:The Zwaanendael Museum in Lewes, Delaware.jpg",
    "File:Zwaanendael Museum; Lewes, DE.jpg",
    "File:Zwaanendael Museum May 2014.jpg"
  ],
  "norfolk-pagoda": [
    "File:A pagoda garden in Norfolk, VA.jpg",
    "File:HDR - Norfolk VA pagoda (9079593353).jpg",
    "File:HDR - Pagoda in downtown Norfolk, VA (8820610446).jpg"
  ],
  "bo-railroad": [
    "File:B&O RR Museum, Roundhouse.jpg",
    "File:B&O Railroad Museum Roundhouse, 2025.jpg",
    "File:Baltimore & Ohio Railroad Museum - Baltimore (2643280810).jpg"
  ]
};

export const manualCoordinates = {
  "cross-sound-ferry": [-72.0946, 41.3554], "greenport-waterfront": [-72.3602, 41.1018],
  "north-ferry": [-72.3578, 41.1010], "south-ferry": [-72.3279, 41.0403],
  "big-duck": [-72.6176, 40.9046], "tanger-riverhead": [-72.7156, 40.9217],
  "asbury-boardwalk": [-74.0105, 40.2236],
  "silverball-asbury": [-74.0101, 40.2190], "asbury-live-music": [-74.0109, 40.2177],
  "ocean-grove": [-74.0063, 40.2122], "lucy-elephant": [-74.5161, 39.3208],
  "nas-wildwood": [-74.9082, 39.0027], "cape-may-victorian": [-74.9210, 38.9318],
  "cape-may-ghosts": [-74.9170, 38.9313], "sunset-beach-atlantus": [-74.9697, 38.9441],
  "cape-may-lewes-ferry": [-74.9597, 38.9687], "fort-miles": [-75.0949, 38.7758],
  "great-dune-tower": [-75.0915, 38.7768], "berlin-historic": [-75.2174, 38.3229],
  "assateague": [-75.1572, 38.2508], "nasa-wallops": [-75.4665, 37.9333],
  "barrier-islands-center": [-75.9948, 37.4030], "chesapeake-bridge-tunnel": [-76.0800, 37.0300],
  "norfolk-pagoda": [-76.2964, 36.8505], "cape-charles": [-76.0174, 37.2679],
  "nauticus-wisconsin": [-76.2951, 36.8477], "edgar-cayce-are": [-75.9850, 36.8910],
  "vibe-neptune": [-75.9779, 36.8594], "poe-museum-richmond": [-77.4261, 37.5322],
  "hermitage-norfolk": [-76.3129, 36.9110], "richmond-orthodox": [-77.5066, 37.5682],
  "bo-railroad": [-76.6335, 39.2847], "baltimore-industry": [-76.6015, 39.2741],
  "mutter-museum": [-75.1765, 39.9533], "metuchen-main-street": [-74.3607, 40.5420],
  "andalusia-estate": [-74.9582, 40.0620],
  "sleepy-hollow-cemetery": [-73.8603, 41.0954], "old-dutch-church": [-73.8610, 41.0904],
  "headless-horseman": [-73.8615, 41.0916], "pumpkin-blaze": [-73.8765, 41.1917],
  "rockefeller-arts": [-73.8374, 41.0930],
  "pez-visitor-center": [-72.9971, 41.2638], "barker-cartoon-museum": [-72.8940, 41.5314]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "greenport-lodging": { name: "Greenport village lodging zone", coordinates: [-72.3593, 41.1033] },
  "riverhead-lodging": { name: "Riverhead lodging zone", coordinates: [-72.6624, 40.9169] },
  "asbury-lodging": { name: "Asbury Park lodging zone", coordinates: [-74.0121, 40.2204] },
  "cape-may-lodging": { name: "Cape May historic district lodging zone", coordinates: [-74.9212, 38.9351] },
  "chincoteague-lodging": { name: "Chincoteague quiet-town lodging zone", coordinates: [-75.3780, 37.9340] },
  "norfolk-lodging": { name: "Norfolk airport and Military Highway lodging zone", coordinates: [-76.2100, 36.8930] },
  "richmond-west-lodging": { name: "Richmond West End lodging zone", coordinates: [-77.5050, 37.5680] },
  "white-marsh-lodging": { name: "Baltimore Northeast I-95 lodging zone", coordinates: [-76.4950, 39.3250] },
  "bridgewater-lodging": { name: "Metuchen Main Street lodging zone", coordinates: [-74.3607, 40.5420] },
  "milford-lodging": { name: "Fairfield I-95 lodging zone", coordinates: [-73.2400, 41.1770] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
  "new-london-terminal": { name: "Cross Sound Ferry New London terminal", coordinates: [-72.0946, 41.3554] },
  "orient-terminal": { name: "Cross Sound Ferry Orient Point terminal", coordinates: [-72.2418, 41.1536] },
  "north-ferry-greenport": { name: "North Ferry Greenport terminal", coordinates: [-72.3593, 41.1012] },
  "north-ferry-shelter": { name: "North Ferry Shelter Island terminal", coordinates: [-72.3567, 41.0847] },
  "south-ferry-shelter": { name: "South Ferry Shelter Island terminal", coordinates: [-72.3279, 41.0403] },
  "south-ferry-north-haven": { name: "South Ferry North Haven terminal", coordinates: [-72.3185, 41.0158] },
  "lewes-terminal": { name: "Cape May-Lewes Ferry terminal", coordinates: [-75.1199, 38.7824] }
};

export const manualLegs = {
  "new-london-terminal:orient-terminal": { mode: "ferry", display_minutes: 80, distance_miles: 18.5, counts_toward_drive_cap: false },
  "north-ferry-greenport:north-ferry-shelter": { mode: "ferry", display_minutes: 8, distance_miles: 0.7, counts_toward_drive_cap: false },
  "south-ferry-shelter:south-ferry-north-haven": { mode: "ferry", display_minutes: 5, distance_miles: 0.5, counts_toward_drive_cap: false },
  "cape-may-lewes-ferry:lewes-terminal": { mode: "ferry", display_minutes: 85, distance_miles: 17.0, counts_toward_drive_cap: false }
};

export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "florence-griswold", "new-london-terminal", "orient-terminal", "greenport-lodging"] },
  { day: 2, risk: "low", node_ids: ["greenport-lodging", "north-ferry-greenport", "north-ferry-shelter", "mashomack-preserve", "south-ferry-shelter", "south-ferry-north-haven", "parrish-art-museum", "big-duck", "tanger-riverhead", "riverhead-lodging"] },
  { day: 3, risk: "high", node_ids: ["riverhead-lodging", "cradle-of-aviation", "asbury-lodging"] },
  { day: 4, risk: "medium", node_ids: ["asbury-lodging", "lucy-elephant", "nas-wildwood", "cape-may-lodging"] },
  { day: 5, risk: "low", node_ids: ["cape-may-lodging", "cape-may-lewes-ferry", "lewes-terminal", "fort-miles", "great-dune-tower", "berlin-historic", "assateague", "chincoteague-lodging"] },
  { day: 6, risk: "low", node_ids: ["chincoteague-lodging", "nasa-wallops", "barrier-islands-center", "norfolk-lodging"] },
  { day: 7, risk: "medium", node_ids: ["norfolk-lodging", "norfolk-pagoda", "nauticus-wisconsin", "edgar-cayce-are", "vibe-neptune", "poe-museum-richmond", "richmond-west-lodging"] },
  { day: 8, risk: "high", node_ids: ["richmond-west-lodging", "richmond-orthodox", "bo-railroad", "white-marsh-lodging"] },
  { day: 9, risk: "high", node_ids: ["white-marsh-lodging", "mutter-museum", "bridgewater-lodging"] },
  { day: 10, risk: "high", node_ids: ["bridgewater-lodging", "sleepy-hollow-cemetery", "pumpkin-blaze", "milford-lodging"] },
  { day: 11, risk: "high", node_ids: ["milford-lodging", "pez-visitor-center", "boston-logan-hotel"] }
];

export const replacementVariants = [
  { id: "replacement-d1-book-barn", day: 1, replacement_place_id: "book-barn-niantic", replaces_place_ids: ["florence-griswold"], nodes: ["boston-logan-rental", "book-barn-niantic", "new-london-terminal", "orient-terminal", "greenport-lodging"] },
  { id: "replacement-d2-aquarium", day: 2, replacement_place_id: "long-island-aquarium", replaces_place_ids: ["parrish-art-museum", "big-duck"], nodes: ["greenport-lodging", "north-ferry-greenport", "north-ferry-shelter", "mashomack-preserve", "south-ferry-shelter", "south-ferry-north-haven", "long-island-aquarium", "tanger-riverhead", "riverhead-lodging"] },
  { id: "replacement-d3-ocean-grove", day: 3, replacement_place_id: "ocean-grove", replaces_place_ids: ["cradle-of-aviation"], nodes: ["riverhead-lodging", "ocean-grove", "asbury-lodging"] },
  { id: "replacement-d4-atlantus", day: 4, replacement_place_id: "sunset-beach-atlantus", replaces_place_ids: ["lucy-elephant"], nodes: ["asbury-lodging", "nas-wildwood", "sunset-beach-atlantus", "cape-may-lodging"] },
  { id: "replacement-d5-zwaanendael", day: 5, replacement_place_id: "zwaanendael", replaces_place_ids: ["fort-miles"], nodes: ["cape-may-lodging", "cape-may-lewes-ferry", "lewes-terminal", "zwaanendael", "great-dune-tower", "berlin-historic", "assateague", "chincoteague-lodging"] },
  { id: "replacement-d6-cape-charles", day: 6, replacement_place_id: "cape-charles", replaces_place_ids: ["barrier-islands-center"], nodes: ["chincoteague-lodging", "nasa-wallops", "cape-charles", "norfolk-lodging"] },
  { id: "replacement-d7-hermitage", day: 7, replacement_place_id: "hermitage-norfolk", replaces_place_ids: ["norfolk-pagoda", "nauticus-wisconsin", "vibe-neptune"], nodes: ["norfolk-lodging", "hermitage-norfolk", "edgar-cayce-are", "poe-museum-richmond", "richmond-west-lodging"] },
  { id: "replacement-d8-baltimore-industry", day: 8, replacement_place_id: "baltimore-industry", replaces_place_ids: ["bo-railroad"], nodes: ["richmond-west-lodging", "richmond-orthodox", "baltimore-industry", "white-marsh-lodging"] },
  { id: "replacement-d9-andalusia", day: 9, replacement_place_id: "andalusia-estate", replaces_place_ids: ["mutter-museum"], nodes: ["white-marsh-lodging", "andalusia-estate", "bridgewater-lodging"] },
  { id: "replacement-d10-rockefeller", day: 10, replacement_place_id: "rockefeller-arts", replaces_place_ids: ["sleepy-hollow-cemetery", "old-dutch-church", "headless-horseman"], nodes: ["bridgewater-lodging", "rockefeller-arts", "pumpkin-blaze", "milford-lodging"] },
  { id: "replacement-d11-barker", day: 11, replacement_place_id: "barker-cartoon-museum", replaces_place_ids: ["pez-visitor-center"], nodes: ["milford-lodging", "barker-cartoon-museum", "boston-logan-hotel"] }
];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "Greenport, NY", station: "USW00014758", station_role: "Bridgeport-Long Island Sound regional proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Riverhead, NY", station: "USW00014719", station_role: "Islip-Long Island regional proxy" },
  { day: 3, date: "2026-10-06", sleep_city: "Asbury Park, NJ", station: "USW00014734", station_role: "Newark-coastal New Jersey proxy" },
  { day: 4, date: "2026-10-07", sleep_city: "Cape May, NJ", station: "USW00013724", station_role: "Atlantic City coastal proxy" },
  { day: 5, date: "2026-10-08", sleep_city: "Chincoteague, VA", station: "USW00093786", station_role: "Ocean City-Chincoteague coastal proxy" },
  { day: 6, date: "2026-10-09", sleep_city: "Norfolk, VA", station: "USW00013737", station_role: "Norfolk airport" },
  { day: 7, date: "2026-10-10", sleep_city: "Richmond, VA", station: "USW00013740", station_role: "Richmond airport" },
  { day: 8, date: "2026-10-11", sleep_city: "Baltimore East, MD", station: "USW00093721", station_role: "Baltimore airport regional proxy" },
  { day: 9, date: "2026-10-12", sleep_city: "Bridgewater, NJ", station: "USW00014734", station_role: "Newark-central New Jersey proxy" },
  { day: 10, date: "2026-10-13", sleep_city: "Fairfield, CT", station: "USW00014758", station_role: "New Haven-Fairfield coastal proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];
