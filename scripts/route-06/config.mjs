export const ROUTE_ID = "route-06";
export const ROUTE_SLUG = "route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop";
export const ROUTE_NAME = "The Mothman, Steel Cathedrals & Cabinet of Evidence Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("carousel-museum", "New England Carousel Museum, 95 Riverside Avenue, Bristol, Connecticut", ["New England Carousel Museum Bristol Connecticut", "New England Carousel Museum carousel horses", "New England Carousel Museum interior"]),
  p("witchs-dungeon", "Witch's Dungeon Classic Movie Museum, 103 East Main Street, Plainville, Connecticut", ["Witch's Dungeon Classic Movie Museum", "Witch's Dungeon Plainville Connecticut", "Witch's Dungeon movie monsters"]),
  p("columcille", "Columcille Megalith Park, 2155 Fox Gap Road, Bangor, Pennsylvania", ["Columcille Megalith Park", "Columcille stone circle Pennsylvania", "Columcille Megalith Park autumn"]),
  p("martin-guitar", "C. F. Martin Guitar Factory and Museum, 510 Sycamore Street, Nazareth, Pennsylvania", ["Martin Guitar factory Nazareth Pennsylvania", "Martin Guitar Museum Nazareth", "CF Martin guitar factory tour"]),
  p("army-heritage", "U.S. Army Heritage and Education Center, 950 Soldiers Drive, Carlisle, Pennsylvania", ["US Army Heritage Education Center Carlisle", "Army Heritage Trail Carlisle", "US Army Heritage Center exhibits"]),
  p("state-police-museum", "Pennsylvania State Police Museum, 187 East Hersheypark Drive, Hershey, Pennsylvania", ["Pennsylvania State Police Museum Hershey", "PSP Historical Educational Memorial Center", "Pennsylvania State Police museum exhibits"]),
  p("gravity-hill", "Gravity Hill Road, New Paris, Pennsylvania", ["Gravity Hill Bedford County Pennsylvania", "Gravity Hill Road New Paris PA", "Bedford County Gravity Hill autumn"]),
  p("quecreek", "Quecreek Mine Rescue Site, 140 Haupt Road, Somerset, Pennsylvania", ["Quecreek Mine Rescue Site", "Quecreek rescue capsule Pennsylvania", "Quecreek Monument for Life"]),
  p("flight-93", "Flight 93 National Memorial Visitor Center, 6424 Lincoln Highway, Stoystown, Pennsylvania", ["Flight 93 National Memorial visitor center", "Flight 93 Memorial wall names", "Flight 93 National Memorial tower"]),
  p("nationality-rooms", "Cathedral of Learning, 4200 Fifth Avenue, Pittsburgh, Pennsylvania", ["Cathedral of Learning Nationality Rooms", "Nationality Rooms Pittsburgh interior", "Cathedral of Learning Pittsburgh exterior"]),
  p("postnatural-history", "Center for PostNatural History, 4913 Penn Avenue, Pittsburgh, Pennsylvania", ["Center for PostNatural History Pittsburgh", "PostNatural History museum exhibits", "Center for PostNatural History specimens"]),
  p("bicycle-heaven", "Bicycle Heaven, 1800 Preble Avenue, Pittsburgh, Pennsylvania", ["Bicycle Heaven Pittsburgh", "Bicycle Heaven museum interior", "Bicycle Heaven antique bicycles"]),
  p("randyland", "Randyland, 1501 Arch Street, Pittsburgh, Pennsylvania", ["Randyland Pittsburgh", "Randyland colorful courtyard", "Randyland Pittsburgh murals"]),
  p("church-brew", "Church Brew Works, 3525 Liberty Avenue, Pittsburgh, Pennsylvania", ["Church Brew Works Pittsburgh interior", "Church Brew Works Pittsburgh exterior", "Church Brew Works altar brewery"]),
  p("wheeling-heritage-port", "Wheeling Heritage Port, 1201 Water Street, Wheeling, West Virginia", ["Wheeling Heritage Port suspension bridge", "Wheeling West Virginia riverfront night", "Wheeling Suspension Bridge Heritage Port"]),
  p("mcclintic-tnt", "McClintic Wildlife Management Area, 6182 Ohio River Road, Point Pleasant, West Virginia", ["McClintic Wildlife Management Area TNT area", "Point Pleasant TNT bunkers", "McClintic WMA ponds West Virginia"]),
  p("wv-farm-museum", "West Virginia State Farm Museum, 1458 Fairground Road, Point Pleasant, West Virginia", ["West Virginia State Farm Museum", "WV Farm Museum blacksmith shop", "West Virginia Farm Museum log church"]),
  p("mothman-museum", "Mothman Museum, 400 Main Street, Point Pleasant, West Virginia", ["Mothman Museum Point Pleasant", "Mothman Museum exhibits", "Mothman Museum West Virginia interior"]),
  p("mothman-statue", "Mothman Statue, 201 Fourth Street, Point Pleasant, West Virginia", ["Mothman Statue Point Pleasant", "Mothman statue red eyes", "Point Pleasant Mothman statue night"]),
  p("tu-endie-wei", "Tu-Endie-Wei State Park, 1 Main Street, Point Pleasant, West Virginia", ["Tu-Endie-Wei State Park", "Point Pleasant battle monument", "Tu-Endie-Wei Ohio Kanawha rivers"]),
  p("flatwoods-monster", "Flatwoods Monster Museum, 208 Main Street, Sutton, West Virginia", ["Flatwoods Monster Museum Sutton", "Flatwoods Monster Museum exhibits", "Braxie Flatwoods Monster chair"]),
  p("wv-bigfoot", "West Virginia Bigfoot Museum, 400 Fourth Street, Sutton, West Virginia", ["West Virginia Bigfoot Museum Sutton", "WV Bigfoot Museum exhibits", "West Virginia Bigfoot Museum exterior"]),
  p("trans-allegheny", "Trans-Allegheny Lunatic Asylum, 71 Asylum Drive, Weston, West Virginia", ["Trans Allegheny Lunatic Asylum", "Trans Allegheny Asylum interior historic tour", "Weston State Hospital Kirkbride building"]),
  p("american-glass", "Museum of American Glass in West Virginia, 230 Main Avenue, Weston, West Virginia", ["Museum of American Glass West Virginia", "Museum of American Glass Weston interior", "American glass museum Weston collection"]),
  p("assumption-orthodox", "Assumption Greek Orthodox Church, 447 Spruce Street, Morgantown, West Virginia", ["Assumption Greek Orthodox Church Morgantown", "Assumption Orthodox Morgantown iconostasis", "Greek Orthodox church Morgantown West Virginia"]),
  p("fort-bedford", "Fort Bedford Museum, 110 Fort Bedford Drive, Bedford, Pennsylvania", ["Fort Bedford Museum", "Fort Bedford Museum exhibits", "Fort Bedford Pennsylvania park"]),
  p("coverlet-museum", "National Museum of the American Coverlet, 322 South Juliana Street, Bedford, Pennsylvania", ["National Museum American Coverlet Bedford", "Coverlet Museum Bedford interior", "American woven coverlets museum"]),
  p("cabelas-hamburg", "Cabela's, 100 Cabela Drive, Hamburg, Pennsylvania", ["Cabela's Hamburg Pennsylvania Conservation Mountain", "Cabela's Hamburg aquarium", "Cabela's Hamburg Deer Country Museum"]),
  p("hamburg-mural-walk", "Hamburg Historic District, 2 South Fourth Street, Hamburg, Pennsylvania", ["Hamburg Pennsylvania historic district mural", "Hamburg PA Main Street mural", "Hamburg Pennsylvania architecture"]),
  p("tarrywile", "Tarrywile Park and Mansion, 70 Southern Boulevard, Danbury, Connecticut", ["Tarrywile Park Mansion Danbury", "Tarrywile Park pond autumn", "Tarrywile Mansion Connecticut"]),
  p("danbury-museum-streets", "Danbury Museum in the Streets, 43 Main Street, Danbury, Connecticut", ["Danbury Connecticut Main Street historic", "Danbury Museum in the Streets markers", "Danbury Connecticut Hat City architecture"]),
  p("museum-bad-art", "Museum of Bad Art at Dorchester Brewing Company, 1250 Massachusetts Avenue, Boston, Massachusetts", ["Museum of Bad Art Dorchester", "Museum of Bad Art Boston paintings", "Dorchester Brewing Museum of Bad Art"]),
  p("ether-dome-russell", "Paul S. Russell Museum of Medical History and Innovation, 2 North Grove Street, Boston, Massachusetts", ["Mass General Ether Dome", "Russell Museum medical history Boston", "Ether Dome surgical amphitheater"])
];

export const contextualImagePlaces = new Set([
  "witchs-dungeon", "gravity-hill", "postnatural-history", "randyland", "wheeling-heritage-port",
  "mcclintic-tnt", "wv-farm-museum", "mothman-museum", "flatwoods-monster", "wv-bigfoot",
  "assumption-orthodox", "hamburg-mural-walk", "danbury-museum-streets", "museum-bad-art"
]);

export const preferredCommonsFiles = {};

// Longitude, latitude. These exact access/parking points override ambiguous
// search results and are also the map pins used by the route package.
export const manualCoordinates = {
  "carousel-museum": [-72.9428, 41.6715], "witchs-dungeon": [-72.8688, 41.6719],
  "columcille": [-75.1708, 40.8671], "martin-guitar": [-75.3296, 40.7428],
  "army-heritage": [-77.1700, 40.2107], "state-police-museum": [-76.6555, 40.3008],
  "gravity-hill": [-78.6919, 40.1108], "quecreek": [-79.0784, 40.0395], "flight-93": [-78.8855, 40.0556],
  "nationality-rooms": [-79.9533, 40.4444], "postnatural-history": [-79.9451, 40.4653], "bicycle-heaven": [-80.0191, 40.4597],
  "randyland": [-80.0120, 40.4573], "church-brew": [-79.9643, 40.4625], "wheeling-heritage-port": [-80.7268, 40.0695],
  "mcclintic-tnt": [-82.1000, 38.9265], "wv-farm-museum": [-82.0875, 38.9196],
  "mothman-museum": [-82.1371, 38.8446], "mothman-statue": [-82.1370, 38.8443], "tu-endie-wei": [-82.1420, 38.8399],
  "flatwoods-monster": [-80.7101, 38.6655], "wv-bigfoot": [-80.7077, 38.6643],
  "trans-allegheny": [-80.4717, 39.0393], "american-glass": [-80.4665, 39.0383],
  "assumption-orthodox": [-79.9556, 39.6308], "fort-bedford": [-78.5060, 40.0195], "coverlet-museum": [-78.5070, 40.0115],
  "cabelas-hamburg": [-75.9906, 40.5576], "hamburg-mural-walk": [-75.9818, 40.5556],
  "tarrywile": [-73.4514, 41.3803], "danbury-museum-streets": [-73.4540, 41.3935],
  "museum-bad-art": [-71.0672, 42.3206], "ether-dome-russell": [-71.0677, 42.3625]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "danbury-west-lodging": { name: "Danbury west/I-84 lodging zone", coordinates: [-73.4540, 41.3948] },
  "nazareth-lodging": { name: "Nazareth/Palmer two-room lodging zone", coordinates: [-75.2930, 40.7190] },
  "carlisle-lodging": { name: "Carlisle I-81 lodging zone", coordinates: [-77.1745, 40.2060] },
  "somerset-lodging": { name: "Somerset turnpike lodging zone", coordinates: [-79.0780, 40.0180] },
  "wheeling-lodging": { name: "Wheeling downtown/Heritage Port lodging zone", coordinates: [-80.7247, 40.0679] },
  "point-pleasant-lodging": { name: "Point Pleasant downtown lodging zone", coordinates: [-82.1372, 38.8448] },
  "weston-lodging": { name: "Weston historic-center lodging zone", coordinates: [-80.4680, 39.0389] },
  "everett-lodging": { name: "Everett tidy small-town/US-30 lodging zone", coordinates: [-78.3734, 40.0115] },
  "allentown-west-lodging": { name: "Allentown west/I-78 two-room lodging zone", coordinates: [-75.5900, 40.5800] },
  "danbury-tarrywile-lodging": { name: "Danbury Tarrywile/south lodging zone", coordinates: [-73.4514, 41.3803] },
  "danbury-downtown-lodging": { name: "Danbury downtown replacement lodging zone", coordinates: [-73.4540, 41.3935] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] }
};

export const manualLegs = {};
export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "carousel-museum", "danbury-west-lodging"] },
  { day: 2, risk: "medium", node_ids: ["danbury-west-lodging", "columcille", "nazareth-lodging"] },
  { day: 3, risk: "medium", node_ids: ["nazareth-lodging", "army-heritage", "carlisle-lodging"] },
  { day: 4, risk: "medium", node_ids: ["carlisle-lodging", "gravity-hill", "quecreek", "somerset-lodging"] },
  { day: 5, risk: "high", node_ids: ["somerset-lodging", "nationality-rooms", "bicycle-heaven", "randyland", "church-brew", "wheeling-lodging"] },
  { day: 6, risk: "high", node_ids: ["wheeling-lodging", "mothman-museum", "mothman-statue", "tu-endie-wei", "mcclintic-tnt", "point-pleasant-lodging"] },
  { day: 7, risk: "medium", node_ids: ["point-pleasant-lodging", "flatwoods-monster", "trans-allegheny", "american-glass", "weston-lodging"] },
  { day: 8, risk: "high", node_ids: ["weston-lodging", "assumption-orthodox", "fort-bedford", "everett-lodging"] },
  { day: 9, risk: "high", node_ids: ["everett-lodging", "cabelas-hamburg", "allentown-west-lodging"] },
  { day: 10, risk: "high", node_ids: ["allentown-west-lodging", "tarrywile", "danbury-tarrywile-lodging"] },
  { day: 11, risk: "high", node_ids: ["danbury-tarrywile-lodging", "boston-logan-return", "boston-logan-hotel"] }
];

export const replacementVariants = [
  { id: "replacement-d1-witchs-dungeon", day: 1, replacement_place_id: "witchs-dungeon", replaces_place_ids: ["carousel-museum"], nodes: ["boston-logan-rental", "witchs-dungeon", "danbury-west-lodging"] },
  { id: "replacement-d2-martin-guitar", day: 2, replacement_place_id: "martin-guitar", replaces_place_ids: ["columcille"], nodes: ["danbury-west-lodging", "martin-guitar", "nazareth-lodging"] },
  { id: "replacement-d3-state-police", day: 3, replacement_place_id: "state-police-museum", replaces_place_ids: ["army-heritage"], nodes: ["nazareth-lodging", "state-police-museum", "carlisle-lodging"] },
  { id: "replacement-d4-flight-93", day: 4, replacement_place_id: "flight-93", replaces_place_ids: ["gravity-hill", "quecreek"], nodes: ["carlisle-lodging", "flight-93", "somerset-lodging"] },
  { id: "replacement-d5-postnatural", day: 5, replacement_place_id: "postnatural-history", replaces_place_ids: ["nationality-rooms"], nodes: ["somerset-lodging", "postnatural-history", "bicycle-heaven", "randyland", "church-brew", "wheeling-lodging"] },
  { id: "replacement-d6-farm-museum", day: 6, replacement_place_id: "wv-farm-museum", replaces_place_ids: ["mcclintic-tnt"], nodes: ["wheeling-lodging", "mothman-museum", "mothman-statue", "tu-endie-wei", "wv-farm-museum", "point-pleasant-lodging"] },
  { id: "replacement-d7-bigfoot", day: 7, replacement_place_id: "wv-bigfoot", replaces_place_ids: ["flatwoods-monster"], nodes: ["point-pleasant-lodging", "wv-bigfoot", "trans-allegheny", "american-glass", "weston-lodging"] },
  { id: "replacement-d8-coverlet", day: 8, replacement_place_id: "coverlet-museum", replaces_place_ids: ["fort-bedford"], nodes: ["weston-lodging", "assumption-orthodox", "coverlet-museum", "everett-lodging"] },
  { id: "replacement-d9-hamburg-murals", day: 9, replacement_place_id: "hamburg-mural-walk", replaces_place_ids: ["cabelas-hamburg"], nodes: ["everett-lodging", "hamburg-mural-walk", "allentown-west-lodging"] },
  { id: "replacement-d10-danbury-streets", day: 10, replacement_place_id: "danbury-museum-streets", replaces_place_ids: ["tarrywile"], nodes: ["allentown-west-lodging", "danbury-museum-streets", "danbury-downtown-lodging"] },
  { id: "replacement-d11-ether-dome", day: 11, replacement_place_id: "ether-dome-russell", replaces_place_ids: ["museum-bad-art"], unchanged_drive: true }
];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "Danbury, CT", station: "USW00094702", station_role: "Bridgeport-Danbury regional proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Nazareth, PA", station: "USW00014737", station_role: "Lehigh Valley airport" },
  { day: 3, date: "2026-10-06", sleep_city: "Carlisle, PA", station: "USW00014751", station_role: "Harrisburg-Carlisle regional proxy" },
  { day: 4, date: "2026-10-07", sleep_city: "Somerset, PA", station: "USW00094823", station_role: "Pittsburgh-Somerset regional proxy" },
  { day: 5, date: "2026-10-08", sleep_city: "Wheeling, WV", station: "USW00094823", station_role: "Pittsburgh-Wheeling regional proxy" },
  { day: 6, date: "2026-10-09", sleep_city: "Point Pleasant, WV", station: "USW00003860", station_role: "Huntington-Tri-State regional proxy" },
  { day: 7, date: "2026-10-10", sleep_city: "Weston, WV", station: "USW00003802", station_role: "Clarksburg-Benedum regional proxy" },
  { day: 8, date: "2026-10-11", sleep_city: "Everett, PA", station: "USW00094823", station_role: "Western Pennsylvania regional proxy" },
  { day: 9, date: "2026-10-12", sleep_city: "Allentown West, PA", station: "USW00014737", station_role: "Lehigh Valley airport" },
  { day: 10, date: "2026-10-13", sleep_city: "Danbury, CT", station: "USW00094702", station_role: "Bridgeport-Danbury regional proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];
