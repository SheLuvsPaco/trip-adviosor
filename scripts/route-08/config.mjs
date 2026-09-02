export const ROUTE_ID = "route-08";
export const ROUTE_SLUG = "route-08-lemurs-stone-bridges-mechanical-dreams-loop";
export const ROUTE_NAME = "The Lemurs, Stone Bridges & Mechanical Dreams Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("new-britain-art", "New Britain Museum of American Art, 56 Lexington Street, New Britain, Connecticut", ["New Britain Museum of American Art", "New Britain Museum American Art interior", "New Britain Museum American Art collection"]),
  p("wadsworth-atheneum", "Wadsworth Atheneum Museum of Art, 600 Main Street, Hartford, Connecticut", ["Wadsworth Atheneum Hartford", "Wadsworth Atheneum interior", "Wadsworth Atheneum Morgan Great Hall"]),
  p("dia-beacon", "Dia Beacon, 3 Beekman Street, Beacon, New York", ["Dia Beacon exterior", "Dia Beacon interior", "Dia Beacon Richard Serra"]),
  p("bear-mountain-perkins", "Perkins Memorial Tower, Bear Mountain State Park, New York", ["Perkins Memorial Tower Bear Mountain", "Bear Mountain Perkins overlook", "Bear Mountain Hudson River autumn"]),
  p("goggleworks", "GoggleWorks Center for the Arts, 201 Washington Street, Reading, Pennsylvania", ["GoggleWorks Reading Pennsylvania", "GoggleWorks interior artist studios", "GoggleWorks hot glass"]),
  p("mid-atlantic-air", "Mid-Atlantic Air Museum, 110 Air Museum Drive, Reading, Pennsylvania", ["Mid Atlantic Air Museum Reading", "Mid Atlantic Air Museum aircraft", "Mid Atlantic Air Museum interior"]),
  p("tanger-lancaster", "Tanger Outlets Lancaster, 311 Stanley K Tanger Boulevard, Lancaster, Pennsylvania", ["Tanger Outlets Lancaster Pennsylvania", "Tanger Lancaster outlet stores", "Tanger Lancaster exterior"]),
  p("shenandoah-valley-museum", "Museum of the Shenandoah Valley, 901 Amherst Street, Winchester, Virginia", ["Museum of Shenandoah Valley", "Glen Burnie gardens Winchester", "Museum Shenandoah Valley galleries"]),
  p("stonewall-headquarters", "Stonewall Jackson Headquarters Museum, 415 North Braddock Street, Winchester, Virginia", ["Stonewall Jackson Headquarters Winchester", "Stonewall Jackson Headquarters interior Winchester", "Stonewall Jackson Headquarters museum"]),
  p("natural-bridge", "Natural Bridge State Park Visitor Center, 6477 South Lee Highway, Natural Bridge, Virginia", ["Natural Bridge Virginia State Park", "Natural Bridge Cedar Creek Trail", "Natural Bridge Virginia autumn"]),
  p("woodrow-wilson", "Woodrow Wilson Presidential Library, 230 East Frederick Street, Staunton, Virginia", ["Woodrow Wilson Presidential Library Staunton", "Woodrow Wilson birthplace Staunton", "Woodrow Wilson museum Pierce Arrow"]),
  p("duke-lemur-bts", "Duke Lemur Center, 3705 Erwin Road, Durham, North Carolina", ["Duke Lemur Center lemurs", "Duke Lemur Center aye aye", "Duke Lemur Center behind the scenes"]),
  p("duke-chapel-gardens", "Duke University Chapel, 401 Chapel Drive, Durham, North Carolina", ["Duke University Chapel", "Sarah P Duke Gardens terraces", "Duke Chapel interior stained glass"]),
  p("virginia-transportation", "Virginia Museum of Transportation, 303 Norfolk Avenue Southwest, Roanoke, Virginia", ["Virginia Museum of Transportation Roanoke", "Norfolk Western 611 Roanoke", "Virginia Museum Transportation railyard"]),
  p("petersburg-battlefield", "Petersburg National Battlefield Eastern Front Visitor Center, 5001 Siege Road, Petersburg, Virginia", ["Petersburg National Battlefield Eastern Front", "Petersburg Battlefield Crater", "Petersburg National Battlefield earthworks"]),
  p("keystone-tractor", "Keystone Truck and Tractor Museum, 880 West Roslyn Road, Colonial Heights, Virginia", ["Keystone Truck Tractor Museum", "Keystone Tractor Museum interior", "Keystone antique trucks tractors"]),
  p("hotel-greene", "Hotel Greene, 508 East Franklin Street, Richmond, Virginia", ["Hotel Greene Richmond miniature golf", "Hotel Greene Richmond interior", "Hotel Greene Richmond lobby"]),
  p("richmond-orthodox", "Saints Constantine and Helen Greek Orthodox Cathedral, 30 Malvern Avenue, Richmond, Virginia", ["Saints Constantine Helen Greek Orthodox Richmond", "Greek Orthodox Cathedral Richmond interior", "Saints Constantine Helen Richmond iconostasis"]),
  p("poe-museum", "Poe Museum, 1914 East Main Street, Richmond, Virginia", ["Poe Museum Richmond", "Poe Museum Enchanted Garden", "Poe Museum Old Stone House"]),
  p("virginia-fine-arts", "Virginia Museum of Fine Arts, 200 North Arthur Ashe Boulevard, Richmond, Virginia", ["Virginia Museum Fine Arts Richmond", "VMFA sculpture garden", "Virginia Museum Fine Arts interior"]),
  p("hagley", "Hagley Museum, 200 Hagley Creek Road, Wilmington, Delaware", ["Hagley Museum powder yard", "Hagley Museum water wheel", "Eleutherian Mills Hagley"]),
  p("brandywine-art", "Brandywine Museum of Art, 1 Hoffmans Mill Road, Chadds Ford, Pennsylvania", ["Brandywine Museum of Art", "Brandywine Museum interior Wyeth", "Brandywine Museum river"]),
  p("met-cloisters", "The Met Cloisters, 99 Margaret Corbin Drive, New York, New York", ["Met Cloisters exterior", "Met Cloisters interior", "Met Cloisters garden"]),
  p("paterson-museum", "Paterson Museum, 2 Market Street, Paterson, New Jersey", ["Paterson Museum locomotive", "Paterson Museum Colt", "Paterson Museum interior"]),
  p("gardner-museum", "Isabella Stewart Gardner Museum, 25 Evans Way, Boston, Massachusetts", ["Isabella Stewart Gardner Museum courtyard", "Gardner Museum Dutch Room", "Isabella Stewart Gardner Museum exterior"]),
  p("boston-public-library", "Boston Public Library Central, 700 Boylston Street, Boston, Massachusetts", ["Boston Public Library Bates Hall", "Boston Public Library courtyard", "Boston Public Library murals"]),
  p("pocahontas-island", "Pocahontas Island Historic District, Rolfe Street, Petersburg, Virginia", ["Pocahontas Island Petersburg", "Appomattox River Petersburg", "Pocahontas Island historic district"]),
  p("ragged-mountain", "Ragged Mountain Memorial Preserve, 599 Wigwam Road, Southington, Connecticut", ["Ragged Mountain Connecticut traprock", "Ragged Mountain Memorial Preserve", "Connecticut basalt ridge"]),
  p("steep-rock", "Steep Rock Preserve, 2 Tunnel Road, Washington Depot, Connecticut", ["Steep Rock Preserve tunnel", "Shepaug River Connecticut", "Shepaug railroad tunnel"]),
  p("mt-tammany", "Mount Tammany, Dunnfield Creek Natural Area, Hardwick Township, New Jersey", ["Mount Tammany Delaware Water Gap", "Red Dot Trail New Jersey", "Delaware Water Gap ridge"]),
  p("crane-manor", "Clue IQ, 103 South Carroll Street, Frederick, Maryland", ["Clue IQ Crane Manor escape room", "Frederick Maryland escape room", "escape room puzzle set"]),
  p("blandy-farm", "Blandy Experimental Farm, 400 Blandy Farm Lane, Boyce, Virginia", ["State Arboretum of Virginia Blandy", "Blandy Experimental Farm arboretum", "Virginia arboretum grounds"]),
  p("little-stony-man-climb", "Little Stony Man, Skyline Drive mile 41.7, Shenandoah National Park, Virginia", ["Little Stony Man cliffs Shenandoah", "Shenandoah greenstone climbing", "Stony Man Skyline Drive"]),
  p("devils-marbleyard", "Devils Marbleyard, Belfast Trail, Natural Bridge Station, Virginia", ["Devils Marbleyard boulder field", "Belfast Trail Virginia quartzite", "James River Face Wilderness"]),
  p("fairy-stone-hunt", "Fairy Stone State Park, 967 Fairystone Lake Drive, Stuart, Virginia", ["Fairy Stone State Park Virginia", "staurolite fairy stone", "Fairy Stone Lake"]),
  p("james-river-rafting", "RVA Paddlesports, 1511 Brook Road, Richmond, Virginia", ["James River Richmond rafting", "Lower James whitewater Richmond", "Belle Isle rapids Richmond"]),
  p("fredericksburg-riverfront", "Fredericksburg Riverfront Park, 701 Sophia Street, Fredericksburg, Virginia", ["Rappahannock River Fredericksburg", "Fredericksburg riverfront park", "Rappahannock riverbank Virginia"]),
  p("bombay-hook", "Bombay Hook National Wildlife Refuge, 2591 Whitehall Neck Road, Smyrna, Delaware", ["Bombay Hook National Wildlife Refuge", "Bombay Hook salt marsh", "Delaware Atlantic Flyway marsh"]),
  p("jersey-gardens", "The Mills at Jersey Gardens, 651 Kapkowski Road, Elizabeth, New Jersey", ["Mills at Jersey Gardens", "Jersey Gardens outlet mall", "Elizabeth New Jersey outlets"]),
  p("big-snow-american-dream", "Big SNOW American Dream, 1 American Dream Way, East Rutherford, New Jersey", ["Big SNOW American Dream indoor slope", "American Dream indoor ski", "indoor real snow New Jersey"]),
  p("dinosaur-state-park", "Dinosaur State Park, 400 West Street, Rocky Hill, Connecticut", ["Dinosaur State Park trackway", "Eubrontes footprint Connecticut", "Dinosaur State Park dome"]),
  p("captured-lv-mayan", "Captured LV, Bethlehem, Pennsylvania", ["Bethlehem Pennsylvania downtown", "Lehigh Valley escape room", "Bethlehem Main Street"]),
  p("wolf-sanctuary-pa", "Wolf Sanctuary of PA, 465 Speedwell Forge Road, Lititz, Pennsylvania", ["Wolf Sanctuary of PA", "wolf sanctuary Pennsylvania", "gray wolf rescue"]),
  p("lakota-wolf-preserve", "Lakota Wolf Preserve, 89 Mount Pleasant Road, Columbia, New Jersey", ["Lakota Wolf Preserve", "wolf preserve New Jersey", "wolf observation area"]),
  p("ringing-rocks-park", "Ringing Rocks Park, Upper Black Eddy, Pennsylvania", ["Ringing Rocks Park boulder field", "Ringing Rocks Pennsylvania", "Bucks County boulder field"]),
  p("escape-on-queen", "Escape on Queen, North Queen Street, Lancaster, Pennsylvania", ["Escape on Queen Lancaster", "Lancaster Pennsylvania escape room", "escape room set"]),
  p("blue-ridge-tunnel", "Blue Ridge Tunnel, Afton, Virginia", ["Blue Ridge Tunnel Crozet", "Blue Ridge Tunnel Afton", "unlit railroad tunnel Virginia"]),
  p("natural-chimneys", "Natural Chimneys, Mount Solon, Virginia", ["Natural Chimneys Virginia", "Cyclopean Towers Virginia", "limestone towers Mount Solon"]),
  p("duke-walking-with-lemurs", "Duke Lemur Center, 3705 Erwin Road, Durham, North Carolina", ["Duke Lemur Center lemurs", "ring-tailed lemur Duke", "lemur forest enclosure"]),
  p("carolina-tiger-rescue", "Carolina Tiger Rescue, 1940 Hanks Chapel Road, Pittsboro, North Carolina", ["Carolina Tiger Rescue tiger", "tiger sanctuary North Carolina", "big cat rescue enclosure"]),
  p("hidden-gems-zelderon", "Hidden Gems Escape, Richmond, Virginia", ["Hidden Gems Escape Richmond", "Richmond Virginia escape room", "escape room interior"]),
  p("gnome-raven-magic-lamp", "Gnome & Raven, Richmond, Virginia", ["Gnome and Raven Richmond", "immersive escape room Richmond", "themed escape room set"]),
  p("bam-kazam", "Bam Kazam, American Dream, East Rutherford, New Jersey", ["Bam Kazam American Dream", "American Dream East Rutherford", "challenge room New Jersey"])
];

// Places introduced by the Energy Rebuild V2 (Route08_Lemurs_Living_Stone_Strange_Worlds_Rebuild.md).
// The legacy V1 builder ignores these; scripts/route-08-energy/build.mjs owns their records.
export const energyRebuildPlaceIds = new Set([
  "ragged-mountain", "steep-rock", "mt-tammany", "crane-manor", "blandy-farm",
  "little-stony-man-climb", "devils-marbleyard", "fairy-stone-hunt", "james-river-rafting",
  "fredericksburg-riverfront", "bombay-hook", "jersey-gardens", "big-snow-american-dream",
  "dinosaur-state-park", "captured-lv-mayan", "wolf-sanctuary-pa", "lakota-wolf-preserve",
  "ringing-rocks-park", "escape-on-queen", "blue-ridge-tunnel", "natural-chimneys",
  "duke-walking-with-lemurs", "carolina-tiger-rescue", "hidden-gems-zelderon",
  "gnome-raven-magic-lamp", "bam-kazam"
]);

export const contextualImagePlaces = new Set([
  "jersey-gardens", "captured-lv-mayan", "bam-kazam", "wolf-sanctuary-pa", "lakota-wolf-preserve",
  "escape-on-queen", "hidden-gems-zelderon", "gnome-raven-magic-lamp",
  "new-britain-art", "wadsworth-atheneum", "dia-beacon", "goggleworks", "mid-atlantic-air",
  "tanger-lancaster", "shenandoah-valley-museum", "stonewall-headquarters", "woodrow-wilson",
  "duke-lemur-bts", "virginia-transportation", "keystone-tractor", "richmond-orthodox",
  "hotel-greene", "poe-museum", "virginia-fine-arts", "paterson-museum"
]);

export const preferredCommonsFiles = {
  "natural-bridge": ["File:Natural Bridge VA.jpg"],
  "duke-chapel-gardens": ["File:Duke Chapel 2016.jpg"],
  "met-cloisters": ["File:The Cloisters at Fort Tryon Park.jpg"],
  "gardner-museum": ["File:Isabella Stewart Gardner Museum Courtyard.jpg"],
  "boston-public-library": ["File:Bates Hall, Boston Public Library.jpg"]
};

// Longitude, latitude. Pins target visitor entrances, parking areas or the
// named feature rather than city centroids.
export const manualCoordinates = {
  "new-britain-art": [-72.7916536, 41.6642765],
  "wadsworth-atheneum": [-72.6741, 41.7638],
  "dia-beacon": [-73.9826016, 41.5001712],
  "bear-mountain-perkins": [-73.9857, 41.3127],
  "goggleworks": [-75.9333189, 40.3373521],
  "mid-atlantic-air": [-75.9666110, 40.3816940],
  "tanger-lancaster": [-76.2186193, 40.0238818],
  "shenandoah-valley-museum": [-78.1798736, 39.1854199],
  "stonewall-headquarters": [-78.1659169, 39.1894269],
  "natural-bridge": [-79.5437403, 37.6285465],
  "woodrow-wilson": [-79.0686717, 38.1504009],
  "duke-lemur-bts": [-78.9623365, 35.9941971],
  "duke-chapel-gardens": [-78.9402861, 36.0018682],
  "virginia-transportation": [-79.9468241, 37.2731542],
  "petersburg-battlefield": [-77.3831660, 37.2187215],
  "keystone-tractor": [-77.3944402, 37.2484957],
  "hotel-greene": [-77.4381780, 37.5410590],
  "richmond-orthodox": [-77.4934947, 37.5614073],
  "poe-museum": [-77.4260748, 37.5321579],
  "virginia-fine-arts": [-77.4748956, 37.5560585],
  "hagley": [-75.5778439, 39.7749007],
  "brandywine-art": [-75.5930380, 39.8699798],
  "met-cloisters": [-73.9319228, 40.8648684],
  "paterson-museum": [-74.1788927, 40.9135320],
  "gardner-museum": [-71.0991538, 42.3382450],
  "boston-public-library": [-71.0786547, 42.3493298]
};

// Energy Rebuild V2 coordinates, geocoded 2026-09-01. The four marked approximate could not be
// resolved by Nominatim and use researched street addresses instead.
Object.assign(manualCoordinates, {
  "ragged-mountain": [-72.8102, 41.6296], "steep-rock": [-73.3269, 41.6144],
  // Mt. Tammany routes to the Dunnfield Creek trailhead parking on I-80, not the summit:
  // the summit pin forced OSRM into a 213-minute detour.
  "mt-tammany": [-75.1270, 40.9720],
  "crane-manor": [-77.4083, 39.4114],
  "blandy-farm": [-78.0655, 39.0607],
  "little-stony-man-climb": [-78.3800, 38.5919],       // approximate: Skyland, Skyline Drive mile 41.7
  "devils-marbleyard": [-79.4719, 37.5811], "fairy-stone-hunt": [-80.0857, 36.7882],
  "james-river-rafting": [-77.4445, 37.5567], "fredericksburg-riverfront": [-77.4567, 38.3013],
  "bombay-hook": [-75.4373, 39.2424], "jersey-gardens": [-74.1736, 40.6628],
  "big-snow-american-dream": [-74.0702, 40.8085], "dinosaur-state-park": [-72.6565, 41.6503],
  "captured-lv-mayan": [-75.3787, 40.6179],
  "wolf-sanctuary-pa": [-76.3547, 40.1858],            // approximate: 465 Speedwell Forge Rd, Lititz
  "lakota-wolf-preserve": [-75.0169, 40.9264],         // approximate: 89 Mount Pleasant Rd, Columbia
  "ringing-rocks-park": [-75.1296, 40.5643], "escape-on-queen": [-76.3059, 40.0392],
  "blue-ridge-tunnel": [-78.8586, 38.0333], "natural-chimneys": [-79.0828, 38.3579],
  "duke-walking-with-lemurs": [-78.9430, 36.0060], "carolina-tiger-rescue": [-79.1146, 35.7110],
  "hidden-gems-zelderon": [-77.4343, 37.5385],
  "gnome-raven-magic-lamp": [-77.4700, 37.5600],       // approximate: Richmond, Scott's Addition area
  "bam-kazam": [-74.0702, 40.8085],
  "pocahontas-island": [-77.4020, 37.2390]
});

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "danbury-west-lodging": { name: "West Danbury/Ridgebury I-84 lodging zone", coordinates: [-73.5000, 41.3900] },
  "bethlehem-lodging": { name: "Historic Bethlehem lodging zone", coordinates: [-75.3824373, 40.6201695] },
  "lancaster-east-lodging": { name: "East Lancaster lodging zone", coordinates: [-76.2126863, 40.0247942] },
  "winchester-lodging": { name: "Winchester west lodging zone", coordinates: [-78.1676, 39.1857] },
  "milford-pa-break": { name: "Milford, PA Delaware River comfort break", coordinates: [-74.8021, 41.3223] },
  "staunton-lodging": { name: "Staunton downtown lodging zone", coordinates: [-79.0726, 38.1496] },
  "roanoke-downtown-lodging": { name: "Downtown Roanoke lodging zone", coordinates: [-79.9468241, 37.2731542] },
  "durham-lodging": { name: "Downtown Durham lodging zone", coordinates: [-78.9087291, 35.9967428] },
  "richmond-lodging": { name: "Richmond Monroe Ward lodging zone", coordinates: [-77.4466130, 37.5453393] },
  "south-hill-break": { name: "South Hill, VA I-85 comfort break", coordinates: [-78.1281, 36.7276] },
  "annapolis-lodging": { name: "Annapolis hotel corridor", coordinates: [-76.5472304, 38.9825918] },
  "bensalem-lodging": { name: "Bensalem I-95 lodging zone", coordinates: [-74.9600, 40.1050] },
  "bridgeport-lodging": { name: "Bridgeport/Fairfield lodging zone", coordinates: [-73.1952, 41.1865] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] }
};

export const manualLegs = {};

export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "ragged-mountain", "steep-rock", "danbury-west-lodging"] },
  { day: 2, risk: "medium", node_ids: ["danbury-west-lodging", "milford-pa-break", "mt-tammany", "bethlehem-lodging"] },
  { day: 3, risk: "low", node_ids: ["bethlehem-lodging", "goggleworks", "lancaster-east-lodging"] },
  { day: 4, risk: "medium", node_ids: ["lancaster-east-lodging", "crane-manor", "blandy-farm", "winchester-lodging"] },
  { day: 5, risk: "low", node_ids: ["winchester-lodging", "little-stony-man-climb", "staunton-lodging"] },
  { day: 6, risk: "low", node_ids: ["staunton-lodging", "natural-bridge", "devils-marbleyard", "roanoke-downtown-lodging"] },
  { day: 7, risk: "medium", node_ids: ["roanoke-downtown-lodging", "fairy-stone-hunt", "duke-lemur-bts", "south-hill-break", "pocahontas-island", "hotel-greene", "richmond-lodging"] },
  { day: 8, risk: "medium", node_ids: ["richmond-lodging", "richmond-orthodox", "james-river-rafting", "fredericksburg-riverfront", "annapolis-lodging"] },
  { day: 9, risk: "medium", node_ids: ["annapolis-lodging", "bombay-hook", "bensalem-lodging"] },
  { day: 10, risk: "high", node_ids: ["bensalem-lodging", "jersey-gardens", "big-snow-american-dream", "bridgeport-lodging"] },
  { day: 11, risk: "high", node_ids: ["bridgeport-lodging", "dinosaur-state-park", "boston-logan-hotel"] }
];

export const replacementVariants = [
  { id: "replacement-d1-wadsworth", day: 1, replacement_place_id: "wadsworth-atheneum", replaces_place_ids: ["new-britain-art"], nodes: ["boston-logan-rental", "wadsworth-atheneum", "danbury-west-lodging"] },
  { id: "replacement-d2-bear-mountain", day: 2, replacement_place_id: "bear-mountain-perkins", replaces_place_ids: ["dia-beacon"], nodes: ["danbury-west-lodging", "bear-mountain-perkins", "bethlehem-lodging"] },
  { id: "replacement-d3-mid-atlantic-air", day: 3, replacement_place_id: "mid-atlantic-air", replaces_place_ids: ["goggleworks"], nodes: ["bethlehem-lodging", "mid-atlantic-air", "tanger-lancaster", "lancaster-east-lodging"] },
  { id: "replacement-d4-stonewall", day: 4, replacement_place_id: "stonewall-headquarters", replaces_place_ids: ["shenandoah-valley-museum"], nodes: ["lancaster-east-lodging", "stonewall-headquarters", "winchester-lodging"] },
  { id: "replacement-d5-woodrow", day: 5, replacement_place_id: "woodrow-wilson", replaces_place_ids: ["natural-bridge"], nodes: ["winchester-lodging", "woodrow-wilson", "roanoke-downtown-lodging"] },
  { id: "replacement-d6-virginia-transport", day: 6, replacement_place_id: "virginia-transportation", replaces_place_ids: ["duke-lemur-bts"], nodes: ["roanoke-downtown-lodging", "virginia-transportation", "duke-chapel-gardens", "durham-lodging"] },
  { id: "replacement-d7-keystone", day: 7, replacement_place_id: "keystone-tractor", replaces_place_ids: ["petersburg-battlefield"], nodes: ["durham-lodging", "keystone-tractor", "richmond-lodging"] },
  { id: "replacement-d8-vmfa", day: 8, replacement_place_id: "virginia-fine-arts", replaces_place_ids: ["poe-museum"], nodes: ["richmond-lodging", "richmond-orthodox", "virginia-fine-arts", "annapolis-lodging"] },
  { id: "replacement-d9-brandywine", day: 9, replacement_place_id: "brandywine-art", replaces_place_ids: ["hagley"], nodes: ["annapolis-lodging", "brandywine-art", "bensalem-lodging"] },
  { id: "replacement-d10-paterson", day: 10, replacement_place_id: "paterson-museum", replaces_place_ids: ["met-cloisters"], nodes: ["bensalem-lodging", "paterson-museum", "bridgeport-lodging"] },
  { id: "replacement-d11-bpl", day: 11, replacement_place_id: "boston-public-library", replaces_place_ids: ["gardner-museum"], unchanged_drive: true }
];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "Danbury, CT", station: "USW00094702", station_role: "Bridgeport-Danbury regional proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Bethlehem, PA", station: "USW00014737", station_role: "Lehigh Valley airport" },
  { day: 3, date: "2026-10-06", sleep_city: "Lancaster, PA", station: "USW00014751", station_role: "Harrisburg-Lancaster regional proxy" },
  { day: 4, date: "2026-10-07", sleep_city: "Winchester, VA", station: "USW00093738", station_role: "Dulles-Winchester regional proxy" },
  { day: 5, date: "2026-10-08", sleep_city: "Staunton, VA", station: "USW00013741", station_role: "Roanoke-Shenandoah Valley regional proxy" },
  { day: 6, date: "2026-10-09", sleep_city: "Roanoke, VA", station: "USW00013741", station_role: "Roanoke airport" },
  { day: 7, date: "2026-10-10", sleep_city: "Richmond, VA", station: "USW00013740", station_role: "Richmond airport" },
  { day: 8, date: "2026-10-11", sleep_city: "Annapolis, MD", station: "USW00093721", station_role: "Baltimore-Washington airport regional proxy" },
  { day: 9, date: "2026-10-12", sleep_city: "Bensalem, PA", station: "USW00013739", station_role: "Philadelphia-Bensalem regional proxy" },
  { day: 10, date: "2026-10-13", sleep_city: "Bridgeport, CT", station: "USW00094702", station_role: "Bridgeport airport" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];

export const verifiedAt = "2026-08-24";
