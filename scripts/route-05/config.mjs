export const ROUTE_ID = "route-05";
export const ROUTE_SLUG = "route-05-coal-veins-caverns-blue-ridge-secrets-loop";
export const ROUTE_NAME = "The Coal Veins, Caverns & Blue Ridge Secrets Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("wadsworth-atheneum", "Wadsworth Atheneum Museum of Art, 600 Main Street, Hartford, Connecticut", ["Wadsworth Atheneum Hartford exterior", "Wadsworth Atheneum interior gallery", "Wadsworth Atheneum collection"]),
  p("holy-land-usa", "Holy Land USA, 60 Slocum Street, Waterbury, Connecticut", ["Holy Land USA Waterbury Connecticut", "Holy Land USA Waterbury cross", "Holy Land USA Waterbury biblical miniatures"]),
  p("mark-twain-house", "The Mark Twain House & Museum, 351 Farmington Avenue, Hartford, Connecticut", ["Mark Twain House Hartford exterior", "Mark Twain House Hartford interior", "Mark Twain House Museum Connecticut"]),
  p("lackawanna-coal", "Lackawanna Coal Mine Tour, Scranton, Pennsylvania", ["Lackawanna Coal Mine Tour", "Lackawanna coal mine Scranton underground", "Lackawanna Coal Mine Tour entrance"]),
  p("steamtown", "Steamtown National Historic Site, Scranton, Pennsylvania", ["Steamtown National Historic Site", "Steamtown Scranton roundhouse", "Steamtown locomotives Scranton"]),
  p("scranton-iron", "Scranton Iron Furnaces, Scranton, Pennsylvania", ["Scranton Iron Furnaces", "Scranton Iron Furnaces stone stacks", "Scranton Iron Furnaces autumn"]),
  p("houdini-museum", "Houdini Museum, 1433 North Main Avenue, Scranton, Pennsylvania", ["Houdini Museum Scranton", "Houdini Museum Scranton exhibits", "Houdini magic museum Pennsylvania"]),
  p("watch-clock", "National Watch and Clock Museum, 514 Poplar Street, Columbia, Pennsylvania", ["National Watch Clock Museum Columbia Pennsylvania", "National Watch Clock Museum exhibits", "NAWCC Museum clocks"]),
  p("lancaster-central-market", "Lancaster Central Market, Lancaster, Pennsylvania", ["Lancaster Central Market", "Lancaster Central Market interior", "Lancaster Central Market Pennsylvania exterior"]),
  p("lancaster-troll-market", "Lancaster Troll Market, 44 North Queen Street, Lancaster, Pennsylvania", ["Lancaster Troll Market", "Lancaster Troll Market curiosities", "Lancaster Pennsylvania Queen Street"]),
  p("wolf-sanctuary", "Wolf Sanctuary of PA, 465 Speedwell Forge Road, Lititz, Pennsylvania", ["Wolf Sanctuary of Pennsylvania", "Wolf Sanctuary PA wolves", "Speedwell Forge wolf sanctuary"]),
  p("ephrata-cloister", "Ephrata Cloister, 632 West Main Street, Ephrata, Pennsylvania", ["Ephrata Cloister Pennsylvania", "Ephrata Cloister interior", "Ephrata Cloister buildings"]),
  p("railroad-museum-pa", "Railroad Museum of Pennsylvania, 300 Gap Road, Strasburg, Pennsylvania", ["Railroad Museum of Pennsylvania", "Railroad Museum Pennsylvania interior", "Railroad Museum Strasburg locomotives"]),
  p("eshelman-covered-bridge", "Eshelman's Mill Covered Bridge, Paradise, Pennsylvania", ["Eshelman Mill Covered Bridge Pennsylvania", "Leaman Place covered bridge", "Lancaster County covered bridge autumn"]),
  p("harrisburg-riverfront", "Walnut Street Bridge, Harrisburg, Pennsylvania", ["Walnut Street Bridge Harrisburg", "Harrisburg Riverfront Park sunset", "Harrisburg Pennsylvania skyline Susquehanna"]),
  p("turkey-hill-experience", "Turkey Hill Experience, 301 Linden Street, Columbia, Pennsylvania", ["Turkey Hill Experience Columbia Pennsylvania", "Turkey Hill Experience ice cream lab", "Turkey Hill Experience exhibits"]),
  p("pa-capitol", "Pennsylvania State Capitol, Harrisburg, Pennsylvania", ["Pennsylvania State Capitol Harrisburg", "Pennsylvania Capitol rotunda", "Pennsylvania Capitol interior staircase"]),
  p("antietam", "Antietam National Battlefield Visitor Center, Sharpsburg, Maryland", ["Antietam National Battlefield", "Antietam Burnside Bridge", "Antietam battlefield autumn"]),
  p("harpers-lower-town", "Harpers Ferry Lower Town, Harpers Ferry, West Virginia", ["Harpers Ferry Lower Town", "Harpers Ferry The Point", "Harpers Ferry West Virginia autumn"]),
  p("storer-college", "Storer College, Harpers Ferry, West Virginia", ["Storer College Harpers Ferry", "Anthony Hall Storer College", "Camp Hill Harpers Ferry Storer"]),
  p("virginius-island", "Virginius Island, Harpers Ferry, West Virginia", ["Virginius Island Harpers Ferry ruins", "Virginius Island mill ruins", "Virginius Island Shenandoah River"]),
  p("seton-shrine", "National Shrine of Saint Elizabeth Ann Seton, Emmitsburg, Maryland", ["National Shrine Saint Elizabeth Ann Seton", "Seton Shrine Emmitsburg basilica", "Seton Shrine historic house"]),
  p("luray-caverns", "Luray Caverns, Luray, Virginia", ["Luray Caverns Virginia", "Luray Caverns Dream Lake", "Luray Caverns stalactite organ"]),
  p("skyline-overlooks", "Hazel Mountain Overlook, Skyline Drive, Virginia", ["Skyline Drive Shenandoah overlook autumn", "Hazel Mountain Overlook", "Shenandoah National Park Skyline Drive October"]),
  p("stony-man", "Stony Man Trailhead, Skyline Drive, Virginia", ["Stony Man Shenandoah view", "Stony Man Trail autumn", "Stony Man summit Shenandoah"]),
  p("charlottesville-downtown", "Charlottesville Downtown Mall, Charlottesville, Virginia", ["Charlottesville Downtown Mall", "Charlottesville Downtown Mall night", "Charlottesville Virginia pedestrian mall"]),
  p("shenandoah-caverns-fright", "Shenandoah Caverns, Quicksburg, Virginia", ["Shenandoah Caverns Virginia", "Shenandoah Caverns interior", "American Fright Night Shenandoah Caverns"]),
  p("monticello", "Monticello, Charlottesville, Virginia", ["Monticello Charlottesville", "Monticello dome autumn", "Monticello gardens Virginia"]),
  p("jefferson-school", "Jefferson School African American Heritage Center, Charlottesville, Virginia", ["Jefferson School African American Heritage Center", "Jefferson School Charlottesville", "Jefferson School Heritage Center exhibit"]),
  p("kluge-ruhe", "Kluge-Ruhe Aboriginal Art Collection, Charlottesville, Virginia", ["Kluge Ruhe Aboriginal Art Collection", "Kluge Ruhe museum Charlottesville", "Kluge Ruhe Indigenous Australian art"]),
  p("ix-looking-glass", "IX Art Park, Charlottesville, Virginia", ["IX Art Park Charlottesville", "Looking Glass IX Art Park", "IX Art Park murals Charlottesville"]),
  p("morgan-wade-jefferson", "The Jefferson Theater, Charlottesville, Virginia", ["Jefferson Theater Charlottesville", "Morgan Wade live concert", "Jefferson Theater Charlottesville interior"]),
  p("exchange-hotel", "Exchange Hotel Civil War Medical Museum, Gordonsville, Virginia", ["Exchange Hotel Civil War Medical Museum", "Exchange Hotel Gordonsville Virginia", "Exchange Hotel Civil War hospital exhibits"]),
  p("transfiguration-orthodox", "Transfiguration Greek Orthodox Church, 100 Perry Drive, Charlottesville, Virginia", ["Transfiguration Greek Orthodox Charlottesville", "Greek Orthodox church Charlottesville iconostasis", "Transfiguration Orthodox Charlottesville interior"]),
  p("civil-war-medicine", "National Museum of Civil War Medicine, Frederick, Maryland", ["National Museum Civil War Medicine Frederick", "Civil War Medicine Museum exhibits", "Frederick Maryland Civil War museum"]),
  p("balls-bluff", "Ball's Bluff Battlefield Regional Park, Ball's Bluff Road, Leesburg, Virginia", ["Ball's Bluff Battlefield Virginia", "Ball's Bluff National Cemetery", "Ball's Bluff Potomac overlook"]),
  p("burnside-plantation", "Burnside Plantation, 1461 Schoenersville Road, Bethlehem, Pennsylvania", ["Burnside Plantation Bethlehem", "Burnside Plantation farmhouse", "Burnside Plantation horse power wheel"]),
  p("illicks-mill", "Illick's Mill, 100 Illicks Mill Road, Bethlehem, Pennsylvania", ["Illick's Mill Bethlehem", "Monocacy Creek Illicks Mill", "Illicks Mill Pennsylvania stone"]),
  p("fairfield-hills", "Fairfield Hills Campus, 3 Primrose Street, Newtown, Connecticut", ["Fairfield Hills Campus Newtown Connecticut", "Fairfield Hills Hospital buildings", "Fairfield Hills walking trail autumn"]),
  p("newtown-meeting-house", "Newtown Meeting House, 31 Main Street, Newtown, Connecticut", ["Newtown Meeting House Connecticut", "Newtown Connecticut flagpole Main Street", "Newtown Meeting House interior"]),
  p("mapparium", "Mapparium, 210 Massachusetts Avenue, Boston, Massachusetts", ["Mapparium Boston stained glass globe", "Mapparium interior Boston", "Christian Science Plaza Boston Mapparium"]),
  p("worcester-arms-armor", "Worcester Art Museum, 55 Salisbury Street, Worcester, Massachusetts", ["Worcester Art Museum arms armor", "Higgins Armory Worcester Art Museum", "Worcester Art Museum armor galleries"])
];

export const contextualImagePlaces = new Set([
  "holy-land-usa", "lancaster-troll-market", "eshelman-covered-bridge", "harrisburg-riverfront",
  "harpers-lower-town", "storer-college", "skyline-overlooks", "morgan-wade-jefferson",
  "transfiguration-orthodox", "fairfield-hills", "newtown-meeting-house", "mapparium"
]);
export const preferredCommonsFiles = {
  "mark-twain-house": [
    "File:The Mark Twain House and Museum.jpg",
    "File:HALL AND STAIRWAY - Mark Twain House, 351 Farmington Avenue (corrected from original address of 531 Farmington Avenue), Hartford, Hartford County, CT HABS CONN,2-HARF,16-4.tif",
    "File:Billiard Room - Mark Twain House.tiff"
  ],
  "monticello": [
    "File:Thomas Jefferson's Monticello.JPG",
    "File:Charlottesville - The Hall at Monticello.jpg",
    "File:Monticello - Jefferson's study.jpg"
  ],
  "harpers-lower-town": [
    "File:Lower Town, Harpers Ferry, WV - area view.jpg",
    "File:Steps connecting lower and upper town, National Historical Park, Harpers Ferry, West Virginia LCCN2011630818.tif",
    "File:Lower Town Harper's Ferry.jpg"
  ],
  "luray-caverns": [
    "File:Luray Caverns - \"Dream Lake\" (8041066087) (2).jpg",
    "File:Luray Caverns, Virginia (19770925568).jpg",
    "File:2018-04-28 16 19 36 The Great Stalacpipe Organ within Luray Caverns in Luray, Page County, Virginia.jpg"
  ],
  "skyline-overlooks": [
    "File:Skyline Drive - Shenandoah National Park (52409233312).jpg",
    "File:2016-10-25 11 50 08 Panorama southeast from the Hazel Mountain Overlook along Shenandoah National Park's Skyline Drive in Rappahannock County, Virginia.jpg",
    "File:2016-10-25 11 06 44 Panorama west from the Timber Hollow Overlook along Shenandoah National Park's Skyline Drive in Page County, Virginia.jpg"
  ]
};

export const manualCoordinates = {
  "wadsworth-atheneum": [-72.6734, 41.7638], "holy-land-usa": [-73.0299116, 41.5491330], "mark-twain-house": [-72.7004, 41.7671],
  "lackawanna-coal": [-75.7155, 41.4173], "steamtown": [-75.6716, 41.4080], "scranton-iron": [-75.6623, 41.4040], "houdini-museum": [-75.6780, 41.4404],
  "watch-clock": [-76.5022, 40.0370], "lancaster-central-market": [-76.3065, 40.0383], "lancaster-troll-market": [-76.3069, 40.0390], "wolf-sanctuary": [-76.3412, 40.2145],
  "ephrata-cloister": [-76.1887, 40.1834], "railroad-museum-pa": [-76.1606, 39.9822], "eshelman-covered-bridge": [-76.1518, 39.9727],
  "harrisburg-riverfront": [-76.8860, 40.2604], "turkey-hill-experience": [-76.4950, 40.0407], "pa-capitol": [-76.8837, 40.2644],
  "antietam": [-77.7447, 39.4680], "harpers-lower-town": [-77.7389, 39.3232], "storer-college": [-77.7411, 39.3240], "virginius-island": [-77.7392, 39.3215], "seton-shrine": [-77.3250, 39.6993],
  "luray-caverns": [-78.4836, 38.6633], "skyline-overlooks": [-78.2920, 38.6254], "stony-man": [-78.2815, 38.5990], "charlottesville-downtown": [-78.4819, 38.0300],
  "shenandoah-caverns-fright": [-78.6809, 38.6140], "monticello": [-78.4529, 38.0322], "jefferson-school": [-78.4936, 38.0310],
  "kluge-ruhe": [-78.4534, 37.9804], "ix-looking-glass": [-78.4832, 38.0233], "morgan-wade-jefferson": [-78.4836, 38.0311], "exchange-hotel": [-78.1870, 38.1331],
  "transfiguration-orthodox": [-78.4797, 38.0360], "civil-war-medicine": [-77.4107, 39.4154], "balls-bluff": [-77.5297, 39.1303],
  "burnside-plantation": [-75.3950, 40.6370], "illicks-mill": [-75.4040, 40.6518], "fairfield-hills": [-73.3036, 41.4141], "newtown-meeting-house": [-73.3031, 41.4149],
  "mapparium": [-71.0873, 42.3440], "worcester-arms-armor": [-71.8020, 42.2730]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "danbury-lodging": { name: "Danbury west/I-84 lodging zone", coordinates: [-73.4540, 41.3948] },
  "scranton-lodging": { name: "Scranton downtown lodging zone", coordinates: [-75.6627, 41.4089] },
  "lancaster-lodging": { name: "Lancaster central lodging zone", coordinates: [-76.3076, 40.0379] },
  "harrisburg-lodging": { name: "Harrisburg downtown lodging zone", coordinates: [-76.8867, 40.2619] },
  "harpers-visitor-parking": { name: "Harpers Ferry visitor-center parking and shuttle", coordinates: [-77.7523, 39.3154] },
  "winchester-lodging": { name: "Winchester historic district lodging zone", coordinates: [-78.1670, 39.1857] },
  "charlottesville-lodging": { name: "Charlottesville downtown lodging zone", coordinates: [-78.4819, 38.0293] },
  "frederick-lodging": { name: "Frederick historic district lodging zone", coordinates: [-77.4108, 39.4143] },
  "bethlehem-lodging": { name: "Bethlehem Burnside/airport lodging zone", coordinates: [-75.3950, 40.6370] },
  "newtown-lodging": { name: "Newtown Fairfield Hills lodging zone", coordinates: [-73.3036, 41.4141] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] }
};

export const manualLegs = {};
export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "wadsworth-atheneum", "holy-land-usa", "danbury-lodging"] },
  { day: 2, risk: "medium", node_ids: ["danbury-lodging", "lackawanna-coal", "steamtown", "scranton-iron", "scranton-lodging"] },
  { day: 3, risk: "medium", node_ids: ["scranton-lodging", "watch-clock", "lancaster-central-market", "lancaster-troll-market", "lancaster-lodging"] },
  { day: 4, risk: "low", node_ids: ["lancaster-lodging", "ephrata-cloister", "railroad-museum-pa", "eshelman-covered-bridge", "harrisburg-riverfront", "harrisburg-lodging"] },
  { day: 5, risk: "medium", node_ids: ["harrisburg-lodging", "pa-capitol", "antietam", "harpers-visitor-parking", "winchester-lodging"] },
  { day: 6, risk: "medium", node_ids: ["winchester-lodging", "luray-caverns", "stony-man", "charlottesville-downtown", "charlottesville-lodging"] },
  { day: 7, risk: "low", node_ids: ["charlottesville-lodging", "monticello", "jefferson-school", "kluge-ruhe", "ix-looking-glass", "morgan-wade-jefferson", "charlottesville-lodging"] },
  { day: 8, risk: "medium", node_ids: ["charlottesville-lodging", "transfiguration-orthodox", "civil-war-medicine", "frederick-lodging"] },
  { day: 9, risk: "high", node_ids: ["frederick-lodging", "burnside-plantation", "bethlehem-lodging"] },
  { day: 10, risk: "high", node_ids: ["bethlehem-lodging", "fairfield-hills", "newtown-lodging"] },
  { day: 11, risk: "high", node_ids: ["newtown-lodging", "mapparium", "boston-logan-return", "boston-logan-hotel"] }
];

export const replacementVariants = [
  { id: "replacement-d1-mark-twain", day: 1, replacement_place_id: "mark-twain-house", replaces_place_ids: ["wadsworth-atheneum"], nodes: ["boston-logan-rental", "mark-twain-house", "holy-land-usa", "danbury-lodging"] },
  { id: "replacement-d2-houdini", day: 2, replacement_place_id: "houdini-museum", replaces_place_ids: ["steamtown", "scranton-iron"], nodes: ["danbury-lodging", "lackawanna-coal", "houdini-museum", "scranton-lodging"] },
  { id: "replacement-d3-wolves", day: 3, replacement_place_id: "wolf-sanctuary", replaces_place_ids: ["watch-clock"], nodes: ["scranton-lodging", "wolf-sanctuary", "lancaster-central-market", "lancaster-troll-market", "lancaster-lodging"] },
  { id: "replacement-d4-turkey-hill", day: 4, replacement_place_id: "turkey-hill-experience", replaces_place_ids: ["railroad-museum-pa", "eshelman-covered-bridge"], nodes: ["lancaster-lodging", "ephrata-cloister", "turkey-hill-experience", "harrisburg-riverfront", "harrisburg-lodging"] },
  { id: "replacement-d5-seton", day: 5, replacement_place_id: "seton-shrine", replaces_place_ids: ["antietam"], nodes: ["harrisburg-lodging", "pa-capitol", "seton-shrine", "harpers-visitor-parking", "winchester-lodging"] },
  { id: "replacement-d6-shenandoah-fright", day: 6, replacement_place_id: "shenandoah-caverns-fright", replaces_place_ids: ["luray-caverns", "skyline-overlooks", "stony-man"], nodes: ["winchester-lodging", "shenandoah-caverns-fright", "charlottesville-lodging"] },
  { id: "replacement-d7-exchange-hotel", day: 7, replacement_place_id: "exchange-hotel", replaces_place_ids: ["monticello", "jefferson-school"], nodes: ["charlottesville-lodging", "exchange-hotel", "kluge-ruhe", "ix-looking-glass", "morgan-wade-jefferson", "charlottesville-lodging"] },
  { id: "replacement-d8-balls-bluff", day: 8, replacement_place_id: "balls-bluff", replaces_place_ids: ["civil-war-medicine"], nodes: ["charlottesville-lodging", "transfiguration-orthodox", "balls-bluff", "frederick-lodging"] },
  { id: "replacement-d9-illicks-mill", day: 9, replacement_place_id: "illicks-mill", replaces_place_ids: ["burnside-plantation"], nodes: ["frederick-lodging", "illicks-mill", "bethlehem-lodging"] },
  { id: "replacement-d10-newtown-meeting", day: 10, replacement_place_id: "newtown-meeting-house", replaces_place_ids: ["fairfield-hills"], unchanged_drive: true },
  { id: "replacement-d11-worcester-armor", day: 11, replacement_place_id: "worcester-arms-armor", replaces_place_ids: ["mapparium"], nodes: ["newtown-lodging", "worcester-arms-armor", "boston-logan-return", "boston-logan-hotel"] }
];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "Danbury, CT", station: "USW00094702", station_role: "Bridgeport-Danbury regional proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Scranton, PA", station: "USW00014777", station_role: "Wilkes-Barre/Scranton airport" },
  { day: 3, date: "2026-10-06", sleep_city: "Lancaster, PA", station: "USW00014751", station_role: "Harrisburg-Lancaster proxy" },
  { day: 4, date: "2026-10-07", sleep_city: "Harrisburg, PA", station: "USW00014751", station_role: "Harrisburg airport" },
  { day: 5, date: "2026-10-08", sleep_city: "Winchester, VA", station: "USW00093738", station_role: "Dulles-Winchester regional proxy" },
  { day: 6, date: "2026-10-09", sleep_city: "Charlottesville, VA", station: "USW00093736", station_role: "Charlottesville airport" },
  { day: 7, date: "2026-10-10", sleep_city: "Charlottesville, VA", station: "USW00093736", station_role: "Charlottesville airport" },
  { day: 8, date: "2026-10-11", sleep_city: "Frederick, MD", station: "USW00093738", station_role: "Dulles-Frederick regional proxy" },
  { day: 9, date: "2026-10-12", sleep_city: "Bethlehem, PA", station: "USW00014737", station_role: "Lehigh Valley airport" },
  { day: 10, date: "2026-10-13", sleep_city: "Newtown, CT", station: "USW00094702", station_role: "Bridgeport-Newtown regional proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];
