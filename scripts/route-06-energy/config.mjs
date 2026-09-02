export const ROUTE_SLUG = "route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop";

const p = (id, geocode) => ({ id, geocode });

// Route 06 V2 core nodes only. Optional inventory is intentionally excluded from
// road geometry until the group activates it.
export const places = [
  p("old-new-gate", "Old New-Gate Prison & Copper Mine, 115 Newgate Road, East Granby, CT"),
  p("columcille", "Columcille Megalith Park, 2155 Fox Gap Road, Bangor, PA"),
  p("martin-guitar", "C. F. Martin Guitar Factory, 510 Sycamore Street, Nazareth, PA"),
  p("reading-pagoda", "Reading Pagoda, 98 Duryea Drive, Reading, PA"),
  p("army-heritage", "U.S. Army Heritage & Education Center, 950 Soldiers Drive, Carlisle, PA"),
  p("letort-spring-run", "LeTort Spring Run Nature Trail, Carlisle, PA"),
  p("pike2bike-rays-hill", "Pike2Bike western trailhead, Breezewood, PA"),
  p("quecreek", "Quecreek Mine Rescue Site, 140 Haupt Road, Somerset, PA"),
  p("carrie-blast-furnaces", "Carrie Blast Furnaces, 801 Carrie Furnace Boulevard, Pittsburgh, PA"),
  p("troy-hill-art-houses", "Troy Hill Art Houses, Pittsburgh, PA"),
  p("maxo-vanka-murals", "St. Nicholas Croatian Catholic Church, 24 Maryland Avenue, Millvale, PA"),
  p("wv-penitentiary", "West Virginia Penitentiary, 818 Jefferson Avenue, Moundsville, WV"),
  p("grave-creek-mound", "Grave Creek Mound Archaeological Complex, Moundsville, WV"),
  p("fort-boreman", "Fort Boreman Park, Parkersburg, WV"),
  p("mothman-statue", "Point Pleasant legend cluster, Fourth and Main Streets, Point Pleasant, WV"),
  p("mothman-tnt-tour", "McClintic Wildlife Management Area, Point Pleasant, WV"),
  p("braxxie-chair-hunt", "Braxxie chair sampler, Sutton and Flatwoods, WV"),
  p("trans-allegheny", "Trans-Allegheny Lunatic Asylum, 71 Asylum Drive, Weston, WV"),
  p("assumption-orthodox", "Assumption Greek Orthodox Church, 447 Spruce Street, Morgantown, WV"),
  p("coopers-rock-clay-furnace", "Coopers Rock State Forest, Bruceton Mills, WV"),
  p("sideling-hill-road-cut", "Sideling Hill Welcome Center, Hancock, MD"),
  p("fort-hunter-rockville-bridge", "Fort Hunter Mansion and Park, Harrisburg, PA"),
  p("cabelas-hamburg", "Cabela's, 100 Cabela Drive, Hamburg, PA"),
  p("pocono-premium-outlets", "Pocono Premium Outlets, 1000 Premium Outlets Drive, Tannersville, PA"),
  p("tarrywile", "Tarrywile Park and Mansion, 70 Southern Boulevard, Danbury, CT"),
  p("dana-common", "Dana Common, Gate 40, Petersham, MA")
];

// WGS84 longitude, latitude. Named-site results were checked against their
// public access point; Troy Hill is a neighborhood meeting point because the
// exact house is selected only after an appointment is secured.
export const manualCoordinates = {
  "old-new-gate": [-72.744072, 41.959859],
  "columcille": [-75.1708, 40.8671],
  "martin-guitar": [-75.3296, 40.7428],
  "reading-pagoda": [-75.903292, 40.336714],
  "army-heritage": [-77.17, 40.2107],
  "letort-spring-run": [-77.1858, 40.1854],
  "pike2bike-rays-hill": [-78.218373, 40.007857],
  "quecreek": [-79.0784, 40.0395],
  "carrie-blast-furnaces": [-79.888784, 40.413937],
  "troy-hill-art-houses": [-79.9825, 40.4668],
  "maxo-vanka-murals": [-79.969611, 40.476891],
  "wv-penitentiary": [-80.742304, 39.916014],
  "grave-creek-mound": [-80.7432, 39.9169],
  "fort-boreman": [-81.570991, 39.25866],
  "mothman-statue": [-82.137, 38.8443],
  "mothman-tnt-tour": [-82.075785, 38.926017],
  "braxxie-chair-hunt": [-80.7101, 38.6655],
  "trans-allegheny": [-80.471438, 39.038264],
  "assumption-orthodox": [-79.9556, 39.6308],
  "coopers-rock-clay-furnace": [-79.787833, 39.655636],
  "sideling-hill-road-cut": [-78.280823, 39.718617],
  "fort-hunter-rockville-bridge": [-76.908433, 40.342263],
  "cabelas-hamburg": [-75.9906, 40.5576],
  "pocono-premium-outlets": [-75.312708, 41.047631],
  "tarrywile": [-73.4514, 41.3803],
  "dana-common": [-72.226721, 42.422512]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "danbury-lodging": { name: "Danbury two-room lodging zone", coordinates: [-73.454, 41.3948] },
  "nazareth-lodging": { name: "Nazareth / Easton lodging zone", coordinates: [-75.293, 40.719] },
  "carlisle-lodging": { name: "Carlisle I-81 lodging zone", coordinates: [-77.1745, 40.206] },
  "somerset-lodging": { name: "Somerset turnpike lodging zone", coordinates: [-79.078, 40.018] },
  "pittsburgh-lodging": { name: "Pittsburgh central lodging zone", coordinates: [-79.9959, 40.4406] },
  "parkersburg-lodging": { name: "Parkersburg lodging zone", coordinates: [-81.5615, 39.2667] },
  "weston-lodging": { name: "Weston lodging zone", coordinates: [-80.468, 39.0389] },
  "everett-lodging": { name: "Everett / Bedford lodging zone", coordinates: [-78.3734, 40.0115] },
  "tannersville-lodging": { name: "Tannersville / Stroudsburg lodging zone", coordinates: [-75.3127, 41.0476] },
  "i84-pocono-break": { name: "Milford I-84 planned rest break", coordinates: [-74.801, 41.322] },
  "charleston-break": { name: "Charleston planned fuel and rest break", coordinates: [-81.635, 38.354] },
  "mahwah-break": { name: "Mahwah planned rest break", coordinates: [-74.157, 41.09] },
  "sturbridge-break": { name: "Sturbridge planned rest break", coordinates: [-72.08, 42.11] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] }
};

export const manualLegs = {};

export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "old-new-gate", "danbury-lodging"] },
  { day: 2, risk: "medium", node_ids: ["danbury-lodging", "i84-pocono-break", "columcille", "martin-guitar", "nazareth-lodging"] },
  { day: 3, risk: "medium", node_ids: ["nazareth-lodging", "reading-pagoda", "army-heritage", "letort-spring-run", "carlisle-lodging"] },
  { day: 4, risk: "medium", node_ids: ["carlisle-lodging", "pike2bike-rays-hill", "quecreek", "somerset-lodging"] },
  { day: 5, risk: "high", node_ids: ["somerset-lodging", "carrie-blast-furnaces", "troy-hill-art-houses", "maxo-vanka-murals", "pittsburgh-lodging"] },
  { day: 6, risk: "medium", node_ids: ["pittsburgh-lodging", "wv-penitentiary", "grave-creek-mound", "fort-boreman", "parkersburg-lodging"] },
  { day: 7, risk: "medium", node_ids: ["parkersburg-lodging", "mothman-statue", "mothman-tnt-tour", "charleston-break", "braxxie-chair-hunt", "trans-allegheny", "weston-lodging"] },
  { day: 8, risk: "medium", node_ids: ["weston-lodging", "assumption-orthodox", "coopers-rock-clay-furnace", "sideling-hill-road-cut", "everett-lodging"] },
  { day: 9, risk: "medium", node_ids: ["everett-lodging", "fort-hunter-rockville-bridge", "cabelas-hamburg", "pocono-premium-outlets", "tannersville-lodging"] },
  { day: 10, risk: "high", node_ids: ["tannersville-lodging", "mahwah-break", "tarrywile", "danbury-lodging"] },
  { day: 11, risk: "high", node_ids: ["danbury-lodging", "sturbridge-break", "dana-common", "boston-logan-return", "boston-logan-hotel"] }
];
