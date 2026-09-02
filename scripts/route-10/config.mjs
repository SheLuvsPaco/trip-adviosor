export const ROUTE_ID = "route-10";
export const ROUTE_SLUG = "route-10-temples-follies-working-machines-loop";
export const ROUTE_NAME = "The Temples, Follies & Working Machines Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("new-england-motorcycle", "New England Motorcycle Museum, 200 West Main Street, Rockville, Connecticut", ["New England Motorcycle Museum Rockville", "Hockanum Mill motorcycle museum", "New England Motorcycle Museum interior"]),
  p("hill-stead", "Hill-Stead Museum, 35 Mountain Road, Farmington, Connecticut", ["Hill-Stead Museum Farmington", "Hill-Stead Museum interior", "Hill-Stead Sunken Garden"]),
  p("baps-akshardham", "BAPS Swaminarayan Akshardham, 112 North Main Street, Robbinsville, New Jersey", ["BAPS Swaminarayan Akshardham Robbinsville", "Akshardham Robbinsville carvings", "Akshardham Robbinsville courtyard"]),
  p("sayen-gardens", "Sayen House and Gardens, 155 Hughes Drive, Hamilton, New Jersey", ["Sayen Gardens Hamilton New Jersey", "Sayen House gardens", "Sayen Gardens bridge"]),
  p("hagley", "Hagley Museum Visitor Center, 200 Hagley Creek Road, Wilmington, Delaware", ["Hagley Museum powder yard", "Hagley Museum water wheel", "Hagley Eleutherian Mills"]),
  p("winterthur", "Winterthur Museum Garden and Library, 5105 Kennett Pike, Winterthur, Delaware", ["Winterthur Museum Delaware exterior", "Winterthur Museum interior", "Winterthur garden Delaware"]),
  p("marine-corps-museum", "National Museum of the Marine Corps, 1775 Semper Fidelis Way, Triangle, Virginia", ["National Museum Marine Corps exterior", "National Museum Marine Corps gallery", "National Museum Marine Corps aircraft"]),
  p("government-island", "Government Island, 191 Coal Landing Road, Stafford, Virginia", ["Government Island Stafford quarry", "Government Island boardwalk", "Government Island Aquia sandstone"]),
  p("agecroft-hall", "Agecroft Hall, 4305 Sulgrave Road, Richmond, Virginia", ["Agecroft Hall Richmond", "Agecroft Hall interior", "Agecroft Hall gardens"]),
  p("lewis-ginter", "Lewis Ginter Botanical Garden, 1800 Lakeside Avenue, Richmond, Virginia", ["Lewis Ginter Botanical Garden conservatory", "Lewis Ginter Richmond autumn", "Lewis Ginter garden architecture"]),
  p("taubman-art", "Taubman Museum of Art, 110 Salem Avenue Southeast, Roanoke, Virginia", ["Taubman Museum of Art exterior", "Taubman Museum Roanoke gallery", "Taubman Museum architecture"]),
  p("winston-link", "O Winston Link Museum, 101 Shenandoah Avenue Northeast, Roanoke, Virginia", ["O Winston Link Museum Roanoke", "O Winston Link night train photography", "Norfolk Western passenger station Roanoke"]),
  p("roanoke-star", "Roanoke Star, 2000 J B Fishburn Parkway, Roanoke, Virginia", ["Roanoke Star overlook", "Mill Mountain Star sunset", "Roanoke Star night"]),
  p("virginia-transportation", "Virginia Museum of Transportation, 303 Norfolk Avenue Southwest, Roanoke, Virginia", ["Virginia Museum Transportation locomotives", "Norfolk Western 611 Roanoke", "Virginia Museum Transportation railyard"]),
  p("roanoke-pinball", "Roanoke Pinball Museum, 1 Market Square Southeast, Roanoke, Virginia", ["Roanoke Pinball Museum", "Roanoke Pinball Museum machines", "Center in the Square Roanoke pinball"]),
  p("holy-myrrhbearers", "Holy Myrrhbearers Orthodox Christian Church, 5004 Cross Keys Road, Mount Crawford, Virginia", ["Holy Myrrhbearers Orthodox Mount Crawford", "Holy Myrrhbearers Orthodox Church Virginia", "Holy Myrrhbearers Orthodox interior"]),
  p("harrisonburg-public-art", "Hardesty-Higgins House Visitor Center, 212 South Main Street, Harrisonburg, Virginia", ["Harrisonburg Virginia public art mural", "Harrisonburg LOVEworks", "downtown Harrisonburg Virginia"]),
  p("carrier-arboretum", "Edith J Carrier Arboretum, 780 University Boulevard, Harrisonburg, Virginia", ["Edith Carrier Arboretum Harrisonburg", "Carrier Arboretum autumn", "Carrier Arboretum pond"]),
  p("aaca-museum", "AACA Museum, 161 Museum Drive, Hershey, Pennsylvania", ["AACA Museum Hershey", "AACA Museum vintage buses", "AACA Museum Tucker automobiles"]),
  p("civil-war-museum", "National Civil War Museum, 1 Lincoln Circle, Harrisburg, Pennsylvania", ["National Civil War Museum Harrisburg", "National Civil War Museum gallery", "National Civil War Museum artifacts"]),
  p("skylands", "New Jersey Botanical Garden at Skylands, 2 Morris Road, Ringwood, New Jersey", ["Skylands Manor New Jersey Botanical Garden", "New Jersey Botanical Garden Ringwood autumn", "Skylands Manor garden"]),
  p("pyramid-mountain", "Pyramid Mountain Natural Historic Area, 472 Boonton Avenue, Montville, New Jersey", ["Tripod Rock Pyramid Mountain New Jersey", "Pyramid Mountain glacial erratic", "Pyramid Mountain New Jersey trail"]),
  p("boston-athenaeum", "Boston Athenaeum, 10 1/2 Beacon Street, Boston, Massachusetts", ["Boston Athenaeum interior", "Boston Athenaeum reading room", "Boston Athenaeum staircase"]),
  p("waterworks", "Metropolitan Waterworks Museum, 2450 Beacon Street, Boston, Massachusetts", ["Metropolitan Waterworks Museum engines", "Chestnut Hill Waterworks interior", "Metropolitan Waterworks Museum Boston"]),
  // ---- Energy Rebuild V2: new core experiences ----
  p("old-new-gate", "Old New-Gate Prison and Copper Mine, 115 Newgate Road, East Granby, Connecticut", ["Old New-Gate Prison East Granby", "Old Newgate copper mine tunnel", "Old New-Gate Prison ruins"]),
  p("herrs", "Herr's Snack Factory Tour, 271 Old Baltimore Pike, Nottingham, Pennsylvania", ["Herr's Snack Factory Nottingham", "Herr's potato chip production line", "Herr's factory tour"]),
  p("game-show-rush-hour", "Rush Hour Live Game Show, Central Park Boulevard, Fredericksburg, Virginia", ["Rush Hour live game show Fredericksburg", "live game show studio buzzers", "game show studio set"]),
  p("belle-isle", "Belle Isle, James River Park System, Richmond, Virginia", ["Belle Isle Richmond James River", "Belle Isle quarry pond Richmond", "Belle Isle hydroelectric ruins"]),
  p("gnome-raven", "Gnome and Raven Escape Rooms, Richmond, Virginia", ["Gnome and Raven escape room Richmond", "Magic Lamp escape room", "escape room puzzle set"]),
  p("vir-kart", "Virginia International Raceway Kart Track, 1245 Pine Tree Road, Alton, Virginia", ["Virginia International Raceway kart track", "VIR karting Alton Virginia", "racing karts on track"]),
  p("natural-chimneys", "Natural Chimneys Park, 94 Natural Chimneys Lane, Mount Solon, Virginia", ["Natural Chimneys Mount Solon Virginia", "Natural Chimneys limestone towers", "Natural Chimneys park"]),
  p("st-mary-orthodox", "Saint Mary Orthodox Church, Chambersburg, Pennsylvania", ["Saint Mary Orthodox Church Chambersburg", "Orthodox church interior iconostasis", "Orthodox divine liturgy"]),
  p("ebt-shop", "East Broad Top Railroad Shops, 421 Meadow Street, Rockhill Furnace, Pennsylvania", ["East Broad Top Railroad machine shop", "East Broad Top line shaft shop", "East Broad Top roundhouse"]),
  p("ebt-steam", "East Broad Top Railroad Station, Rockhill Furnace, Pennsylvania", ["East Broad Top steam locomotive", "East Broad Top train autumn", "East Broad Top passenger train"]),
  p("martin-guitar", "C. F. Martin and Company Guitar Factory, 510 Sycamore Street, Nazareth, Pennsylvania", ["Martin Guitar factory Nazareth", "Martin guitar factory tour", "guitar factory workshop"]),
  p("hickory-run-boulder-field", "Hickory Run State Park Boulder Field, White Haven, Pennsylvania", ["Hickory Run State Park Boulder Field", "Hickory Run boulder field Pennsylvania", "glacial boulder field"]),
  p("pocono-outlets", "Pocono Premium Outlets, 1000 Premium Outlets Drive, Tannersville, Pennsylvania", ["Pocono Premium Outlets Tannersville", "Pocono outlets shopping center", "premium outlets storefronts"]),
  p("thirteenth-hour", "13th Hour Escape Rooms, 40 Baker Street, Wharton, New Jersey", ["13th Hour Escape Rooms Wharton", "13th Hour Campground escape room", "horror escape room set"]),
  p("mine-hill-preserve", "Mine Hill Preserve, Mine Hill Road, Roxbury, Connecticut", ["Mine Hill Preserve Roxbury Connecticut", "Mine Hill iron furnace Roxbury", "Mine Hill granite quarry"]),

  // ---- Energy Rebuild V2: new documented options ----
  p("bell-works", "Bell Works, 101 Crawfords Corner Road, Holmdel, New Jersey", ["Bell Works Holmdel atrium", "Bell Labs Saarinen Holmdel", "Bell Works interior"]),
  p("puzzleconnect", "PuzzleConnect Escape Rooms, Eatontown, New Jersey", ["PuzzleConnect escape room New Jersey", "Curse of the Hidden Temple escape room", "escape room temple set"]),
  p("brandywine-creek-sp", "Brandywine Creek State Park, Wilmington, Delaware", ["Brandywine Creek State Park Delaware", "Brandywine Creek trail autumn", "Brandywine Creek meadow"]),
  p("cryptologic-museum", "National Cryptologic Museum, Annapolis Junction, Maryland", ["National Cryptologic Museum", "Enigma machine museum display", "cryptologic museum exhibit"]),
  p("port-of-falmouth", "Historic Port of Falmouth Park, Falmouth, Virginia", ["Historic Port of Falmouth Virginia", "Rappahannock River Falmouth", "Falmouth riverfront park"]),
  p("gnome-raven-alt", "Gnome and Raven Escape Rooms, Richmond, Virginia", ["Gnome and Raven Shipwrecked escape room", "Tomb Ruins escape room", "escape room shipwreck set"]),
  p("tredegar-riverfront", "Historic Tredegar, 500 Tredegar Street, Richmond, Virginia", ["Historic Tredegar Richmond", "Tredegar Iron Works ruins", "James River Richmond industrial"]),
  p("danville-science", "Danville Science Center, 677 Craghead Street, Danville, Virginia", ["Danville Science Center Virginia", "Danville Science Center dome", "science center hands on exhibit"]),
  p("danville-river-district", "Danville River District, Craghead Street, Danville, Virginia", ["Danville River District Virginia", "Danville tobacco warehouse architecture", "Danville riverfront"]),
  p("black-dog-salvage", "Black Dog Salvage, 902 13th Street Southwest, Roanoke, Virginia", ["Black Dog Salvage Roanoke", "architectural salvage warehouse", "Black Dog Salvage interior"]),
  p("explore-park-mtb", "Explore Park, Blue Ridge Parkway, Roanoke, Virginia", ["Explore Park Roanoke mountain biking", "Explore Park trails Roanoke", "mountain bike singletrack forest"]),
  p("explore-park-treetop", "Explore Park Treetop Quest, Roanoke, Virginia", ["Explore Park treetop aerial course", "treetop adventure course ropes", "aerial ropes course forest"]),
  p("reddish-knob", "Reddish Knob, George Washington National Forest, Virginia", ["Reddish Knob Virginia overlook", "Reddish Knob summit view", "Shenandoah ridge overlook"]),
  p("rockhill-trolley", "Rockhill Trolley Museum, 430 Meadow Street, Rockhill Furnace, Pennsylvania", ["Rockhill Trolley Museum Pennsylvania", "Rockhill trolley ride", "vintage trolley car museum"]),
  p("pine-grove-furnace", "Pine Grove Furnace State Park, Gardners, Pennsylvania", ["Pine Grove Furnace State Park", "Pine Grove iron furnace stack", "Pole Steeple overlook Pennsylvania"]),
  p("kings-gap", "Kings Gap Environmental Education Center, Carlisle, Pennsylvania", ["Kings Gap Environmental Education Center", "Kings Gap mansion Pennsylvania", "Kings Gap rock scree trail"]),
  p("trough-creek", "Trough Creek State Park, Huntingdon, Pennsylvania", ["Trough Creek State Park Balanced Rock", "Trough Creek suspension bridge", "Rainbow Falls Trough Creek"]),
  p("raystown-allegrippis", "Allegrippis Trails, Raystown Lake, Hesston, Pennsylvania", ["Allegrippis Trails Raystown Lake", "Raystown Lake mountain biking", "Raystown Lake Pennsylvania"]),
  p("yuengling-brewery", "Yuengling Brewery, 420 Mahantongo Street, Pottsville, Pennsylvania", ["Yuengling Brewery Pottsville", "Yuengling brewery tour caves", "Yuengling brewery building"]),
  p("skirmish-paintball", "Skirmish Paintball, 400 Route 903, Albrightsville, Pennsylvania", ["Skirmish Paintball Albrightsville", "paintball field woodland players", "paintball game Pennsylvania"]),
  p("pocono-utv", "Pocono Outdoor Adventure Tours, Tannersville, Pennsylvania", ["Pocono UTV tour Pennsylvania", "UTV side by side trail ride", "off road UTV tour forest"]),
  p("bushkill-falls", "Bushkill Falls, 138 Bushkill Falls Trail, Bushkill, Pennsylvania", ["Bushkill Falls Pennsylvania", "Bushkill Falls main waterfall", "Bushkill Falls boardwalk"]),
  p("five-wits", "5 Wits, Palisades Center, West Nyack, New York", ["5 Wits West Nyack adventure", "5 Wits interactive adventure", "immersive adventure room"])
];

export const contextualImagePlaces = new Set([
  "new-england-motorcycle", "baps-akshardham", "sayen-gardens", "hagley", "winterthur",
  "marine-corps-museum", "government-island", "taubman-art", "winston-link",
  "virginia-transportation", "roanoke-pinball", "holy-myrrhbearers",
  "harrisonburg-public-art", "aaca-museum", "civil-war-museum", "boston-athenaeum", "waterworks"
]);

export const preferredCommonsFiles = {
  "agecroft-hall": ["File:Agecroft Hall.jpg"],
  "roanoke-star": ["File:Roanoke Star.jpg"],
  "skylands": ["File:Skylands Manor.jpg"]
};

// Longitude, latitude. Pins are visitor entrances, trailheads or exact named
// objects rather than broad city centroids.
export const manualCoordinates = {
  "new-england-motorcycle": [-72.4610100, 41.8657300],
  "hill-stead": [-72.8202697, 41.7219280],
  "baps-akshardham": [-74.5797529, 40.2536907],
  "sayen-gardens": [-74.6585056, 40.2369418],
  "hagley": [-75.6611000, 39.7756000],
  "winterthur": [-75.6030000, 39.8060000],
  "marine-corps-museum": [-77.3437206, 38.5442473],
  "government-island": [-77.3884169, 38.4468077],
  "agecroft-hall": [-77.5050627, 37.5530525],
  "lewis-ginter": [-77.4707500, 37.6199722],
  "taubman-art": [-79.9419000, 37.2731000],
  "winston-link": [-79.9442000, 37.2745000],
  "roanoke-star": [-79.9780000, 37.2705000],
  "virginia-transportation": [-79.9463000, 37.2739000],
  "roanoke-pinball": [-79.9415000, 37.2720000],
  "holy-myrrhbearers": [-78.8614606, 38.3369477],
  "harrisonburg-public-art": [-78.8689300, 38.4471700],
  "carrier-arboretum": [-78.8647272, 38.4288286],
  "aaca-museum": [-76.6901211, 40.2981546],
  "civil-war-museum": [-76.8917000, 40.2726000],
  "skylands": [-74.2395400, 41.1269500],
  "pyramid-mountain": [-74.3990000, 40.9470000],
  "boston-athenaeum": [-71.0620806, 42.3579152],
  "waterworks": [-71.1557672, 42.3316114],
  "old-new-gate": [-72.7746000, 41.9589000],
  "herrs": [-76.0122000, 39.7447000],
  "game-show-rush-hour": [-77.4747000, 38.2997000],
  "belle-isle": [-77.4489000, 37.5311000],
  "gnome-raven": [-77.4478000, 37.5620000],
  "vir-kart": [-79.2050000, 36.5680000],
  "natural-chimneys": [-79.0855000, 38.3597000],
  "st-mary-orthodox": [-77.6580000, 39.9330000],
  "ebt-shop": [-77.8955000, 40.2452000],
  "ebt-steam": [-77.8949000, 40.2447000],
  "martin-guitar": [-75.3095000, 40.7398000],
  "hickory-run-boulder-field": [-75.6470000, 41.0468000],
  "pocono-outlets": [-75.3268000, 41.0430000],
  "thirteenth-hour": [-74.5820000, 40.8930000],
  "mine-hill-preserve": [-73.3283000, 41.5530000],
  "bell-works": [-74.1780000, 40.3900000],
  "puzzleconnect": [-74.0540000, 40.2960000],
  "brandywine-creek-sp": [-75.5780000, 39.7930000],
  "cryptologic-museum": [-76.7740000, 39.1090000],
  "port-of-falmouth": [-77.4680000, 38.3260000],
  "gnome-raven-alt": [-77.4478000, 37.5620000],
  "tredegar-riverfront": [-77.4460000, 37.5347000],
  "danville-science": [-79.3930000, 36.5860000],
  "danville-river-district": [-79.3950000, 36.5870000],
  "black-dog-salvage": [-79.9560000, 37.2620000],
  "explore-park-mtb": [-79.8560000, 37.2350000],
  "explore-park-treetop": [-79.8570000, 37.2360000],
  "reddish-knob": [-79.2400000, 38.4650000],
  "rockhill-trolley": [-77.8930000, 40.2470000],
  "pine-grove-furnace": [-77.3050000, 40.0330000],
  "kings-gap": [-77.2560000, 40.1000000],
  "trough-creek": [-78.1200000, 40.3200000],
  "raystown-allegrippis": [-78.0400000, 40.3900000],
  "yuengling-brewery": [-76.1900000, 40.6840000],
  "skirmish-paintball": [-75.6100000, 41.0300000],
  "pocono-utv": [-75.3500000, 41.0500000],
  "bushkill-falls": [-75.0090000, 41.1160000],
  "five-wits": [-73.9560000, 41.0960000]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "milford-east-lodging": { name: "East Milford/Orange lodging zone", coordinates: [-72.9900, 41.2800] },
  "hamilton-lodging": { name: "Hamilton/Robbinsville lodging zone", coordinates: [-74.6510, 40.2190] },
  "baltimore-lodging": { name: "Baltimore Harbor East/Canton lodging zone", coordinates: [-76.5750, 39.2820] },
  "richmond-lodging": { name: "North Richmond/Lakeside lodging zone", coordinates: [-77.4680, 37.6090] },
  "danville-lodging": { name: "Central Danville lodging zone", coordinates: [-79.3950, 36.5860] },
  "roanoke-lodging": { name: "Downtown Roanoke lodging zone", coordinates: [-79.9510, 37.2760] },
  "chambersburg-lodging": { name: "Chambersburg lodging zone", coordinates: [-77.6610, 39.9370] },
  "carlisle-lodging": { name: "Carlisle lodging zone", coordinates: [-77.1890, 40.2010] },
  "tannersville-lodging": { name: "Tannersville/Poconos lodging zone", coordinates: [-75.3200, 41.0400] },
  "danbury-lodging": { name: "Danbury west lodging zone", coordinates: [-73.4540111, 41.3948170] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
  // Comfort breaks that split measured legs over the 150-minute uninterrupted ceiling.
  // Neutral waypoints, not attractions.
  "stamford-break": { name: "Stamford, CT comfort break", coordinates: [-73.5387, 41.0534] },
  "farmville-break": { name: "Farmville, VA comfort break", coordinates: [-78.3919, 37.3021] },
  "winchester-break": { name: "Winchester, VA I-81 comfort break", coordinates: [-78.1633, 39.1857] },
  "hartford-break": { name: "Hartford, CT comfort break", coordinates: [-72.6851, 41.7637] }
};

export const manualLegs = {};

export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "old-new-gate", "milford-east-lodging"] },
  { day: 2, risk: "high", node_ids: ["milford-east-lodging", "stamford-break", "baps-akshardham", "hamilton-lodging"] },
  { day: 3, risk: "medium", node_ids: ["hamilton-lodging", "hagley", "herrs", "baltimore-lodging"] },
  { day: 4, risk: "high", node_ids: ["baltimore-lodging", "government-island", "game-show-rush-hour", "belle-isle", "richmond-lodging"] },
  { day: 5, risk: "medium", node_ids: ["richmond-lodging", "gnome-raven", "farmville-break", "vir-kart", "danville-lodging"] },
  { day: 6, risk: "medium", node_ids: ["danville-lodging", "virginia-transportation", "roanoke-pinball", "roanoke-star", "roanoke-lodging"] },
  { day: 7, risk: "high", node_ids: ["roanoke-lodging", "natural-chimneys", "winchester-break", "chambersburg-lodging"] },
  { day: 8, risk: "medium", node_ids: ["chambersburg-lodging", "st-mary-orthodox", "ebt-shop", "ebt-steam", "carlisle-lodging"] },
  { day: 9, risk: "medium", node_ids: ["carlisle-lodging", "martin-guitar", "hickory-run-boulder-field", "tannersville-lodging"] },
  { day: 10, risk: "medium", node_ids: ["tannersville-lodging", "pocono-outlets", "pyramid-mountain", "thirteenth-hour", "danbury-lodging"] },
  { day: 11, risk: "high", node_ids: ["danbury-lodging", "mine-hill-preserve", "hartford-break", "waterworks", "boston-logan-return", "boston-logan-hotel"] }
];

// These were the original one-for-one fallbacks. Route 10 now promotes every
// one of them into the measured main itinerary, but the history stays here so
// future research can see how the package changed.
export const formerReplacementVariants = [
  { id: "replacement-d1-hill-stead", day: 1, replacement_place_id: "hill-stead", replaces_place_ids: ["new-england-motorcycle"], nodes: ["boston-logan-rental", "hill-stead", "stratford-lodging"] },
  { id: "replacement-d2-sayen", day: 2, replacement_place_id: "sayen-gardens", replaces_place_ids: ["baps-akshardham"], nodes: ["stratford-lodging", "sayen-gardens", "hamilton-lodging"] },
  { id: "replacement-d3-winterthur", day: 3, replacement_place_id: "winterthur", replaces_place_ids: ["hagley"], nodes: ["hamilton-lodging", "winterthur", "baltimore-lodging"] },
  { id: "replacement-d4-government-island", day: 4, replacement_place_id: "government-island", replaces_place_ids: ["marine-corps-museum"], nodes: ["baltimore-lodging", "government-island", "richmond-lodging"] },
  { id: "replacement-d5-lewis-ginter", day: 5, replacement_place_id: "lewis-ginter", replaces_place_ids: ["agecroft-hall"], nodes: ["richmond-lodging", "lewis-ginter", "danville-lodging"] },
  { id: "replacement-d6-winston-link", day: 6, replacement_place_id: "winston-link", replaces_place_ids: ["taubman-art"], nodes: ["danville-lodging", "winston-link", "roanoke-star", "roanoke-lodging"] },
  { id: "replacement-d7-pinball", day: 7, replacement_place_id: "roanoke-pinball", replaces_place_ids: ["virginia-transportation"], nodes: ["roanoke-lodging", "roanoke-pinball", "mount-crawford-lodging"] },
  { id: "replacement-d8-carrier", day: 8, replacement_place_id: "carrier-arboretum", replaces_place_ids: ["harrisonburg-public-art"], nodes: ["mount-crawford-lodging", "holy-myrrhbearers", "carrier-arboretum", "carlisle-lodging"] },
  { id: "replacement-d9-civil-war", day: 9, replacement_place_id: "civil-war-museum", replaces_place_ids: ["aaca-museum"], nodes: ["carlisle-lodging", "civil-war-museum", "stroudsburg-lodging"] },
  { id: "replacement-d10-pyramid", day: 10, replacement_place_id: "pyramid-mountain", replaces_place_ids: ["skylands"], nodes: ["stroudsburg-lodging", "pyramid-mountain", "danbury-lodging"] },
  { id: "replacement-d11-waterworks", day: 11, replacement_place_id: "waterworks", replaces_place_ids: ["boston-athenaeum"], unchanged_drive: true }
];

export const replacementVariants = [];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "Orange, CT", station: "USW00094702", station_role: "Bridgeport-New Haven coastal proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Hamilton, NJ", station: "USW00013739", station_role: "Philadelphia-Hamilton regional proxy" },
  { day: 3, date: "2026-10-06", sleep_city: "Baltimore, MD", station: "USW00093721", station_role: "Baltimore-Washington airport" },
  { day: 4, date: "2026-10-07", sleep_city: "Richmond, VA", station: "USW00013740", station_role: "Richmond airport" },
  { day: 5, date: "2026-10-08", sleep_city: "Danville, VA", station: "USW00013723", station_role: "Greensboro-Danville regional proxy" },
  { day: 6, date: "2026-10-09", sleep_city: "Roanoke, VA", station: "USW00013741", station_role: "Roanoke airport" },
  { day: 7, date: "2026-10-10", sleep_city: "Chambersburg, PA", station: "USW00014751", station_role: "Harrisburg-Chambersburg regional proxy" },
  { day: 8, date: "2026-10-11", sleep_city: "Carlisle, PA", station: "USW00014751", station_role: "Harrisburg-Carlisle regional proxy" },
  { day: 9, date: "2026-10-12", sleep_city: "Tannersville, PA", station: "USW00014737", station_role: "Lehigh Valley-Poconos regional proxy" },
  { day: 10, date: "2026-10-13", sleep_city: "Danbury, CT", station: "USW00094702", station_role: "Bridgeport-Danbury regional proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];
