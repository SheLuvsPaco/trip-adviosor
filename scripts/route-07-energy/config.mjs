export const ROUTE_SLUG = "route-07-kazoos-rock-mechanical-dreams-loop";

const p = (id, geocode) => ({ id, geocode });

// Route 07 Energy V2 core nodes only. Optional cards remain selectable in the
// UI but do not distort the canonical road geometry until activated.
export const places = [
  p("naismith-center-court", "Naismith Memorial Basketball Hall of Fame, 1000 Hall of Fame Avenue, Springfield, MA"),
  p("peebles-island", "Peebles Island State Park, Waterford, NY"),
  p("cohoes-falls", "Cohoes Falls View Park, North Mohawk Street, Cohoes, NY"),
  p("empac", "EMPAC, 50 8th Street, Troy, NY"),
  p("erie-canal-lock-e20", "Erie Canal Lock E20, 9028 River Road, Marcy, NY"),
  p("five-wits-syracuse", "5 Wits Syracuse, 9090 Destiny USA Drive, Syracuse, NY"),
  p("strong-museum-play", "The Strong National Museum of Play, 1 Manhattan Square Drive, Rochester, NY"),
  p("high-falls-pont-de-rennes", "Pont de Rennes Bridge, Rochester, NY"),
  p("eden-kazoo", "Original American Kazoo Company, 8703 South Main Street, Eden, NY"),
  p("riverworks-racing-zipline", "Buffalo RiverWorks, 359 Ganson Street, Buffalo, NY"),
  p("presque-isle-movement", "Tom Ridge Environmental Center, 301 Peninsula Drive, Erie, PA"),
  p("rock-hall", "Rock and Roll Hall of Fame, 1100 Rock and Roll Boulevard, Cleveland, OH"),
  p("superelectric-pinball", "Superelectric Pinball Parlor, 6500 Detroit Avenue, Cleveland, OH"),
  p("sugar-agora", "Agora Theatre and Ballroom, 5000 Euclid Avenue, Cleveland, OH"),
  p("rays-bike-park", "Ray's Indoor Mountain Bike Park, 9801 Walford Avenue, Cleveland, OH"),
  p("brandywine-falls", "Brandywine Falls, Cuyahoga Valley National Park, OH"),
  p("st-nicholas-pittsburgh", "St. Nicholas Greek Orthodox Cathedral, 419 South Dithridge Street, Pittsburgh, PA"),
  p("carrie-graffiti", "Carrie Blast Furnaces, 801 Carrie Furnace Boulevard, Pittsburgh, PA"),
  p("old-pa-pike-rays-hill", "Pike2Bike western trailhead, Breezewood, PA"),
  p("hershey-candy-bar", "Hershey's Chocolate World, 101 Chocolate World Way, Hershey, PA"),
  p("martin-guitar", "C. F. Martin Guitar Factory, 510 Sycamore Street, Nazareth, PA"),
  p("pocono-premium-outlets", "Pocono Premium Outlets, 1000 Premium Outlets Drive, Tannersville, PA"),
  p("raymondskill-falls", "Raymondskill Falls Trail, Delaware Water Gap National Recreation Area, PA"),
  p("westville-grand-trunk", "Westville Lake Recreation Area, Sturbridge, MA"),
  p("f1-arcade-boston", "F1 Arcade Boston, 87 Pier 4 Boulevard, Boston, MA")
];

// WGS84 longitude, latitude. Coordinates target a public entrance, trailhead,
// venue entrance or planning point rather than a city centroid.
export const manualCoordinates = {
  "naismith-center-court": [-72.58506, 42.093712],
  "peebles-island": [-73.685789, 42.781038],
  "cohoes-falls": [-73.710067, 42.785981],
  "empac": [-73.683855, 42.728811],
  "erie-canal-lock-e20": [-75.288971, 43.142632],
  "five-wits-syracuse": [-76.172506, 43.069217],
  "strong-museum-play": [-77.600773, 43.152854],
  "high-falls-pont-de-rennes": [-77.6148, 43.163575],
  "eden-kazoo": [-78.898393, 42.649108],
  "riverworks-racing-zipline": [-78.872261, 42.869324],
  "presque-isle-movement": [-80.15406, 42.110004],
  "rock-hall": [-81.695407, 41.508498],
  "superelectric-pinball": [-81.730447, 41.484131],
  "sugar-agora": [-81.653657, 41.503444],
  "rays-bike-park": [-81.752399, 41.45465],
  "brandywine-falls": [-81.538964, 41.303301],
  "st-nicholas-pittsburgh": [-79.949921, 40.444661],
  "carrie-graffiti": [-79.888784, 40.413937],
  "old-pa-pike-rays-hill": [-78.218373, 40.007857],
  "hershey-candy-bar": [-76.661019, 40.288076],
  "martin-guitar": [-75.306099, 40.753511],
  "pocono-premium-outlets": [-75.314838, 41.05052],
  "raymondskill-falls": [-74.839007, 41.289349],
  "westville-grand-trunk": [-72.061727, 42.077831],
  "f1-arcade-boston": [-71.043539, 42.350956]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "springfield-lodging": { name: "Springfield downtown lodging zone", coordinates: [-72.584, 42.1015] },
  "troy-lodging": { name: "Troy downtown lodging zone", coordinates: [-73.6868, 42.7284] },
  "syracuse-lodging": { name: "Syracuse downtown lodging zone", coordinates: [-76.1474, 43.0481] },
  "batavia-lodging": { name: "Batavia I-90 lodging zone", coordinates: [-78.1875, 42.9984] },
  "erie-lodging": { name: "Erie bayfront lodging zone", coordinates: [-80.0825, 42.1292] },
  "cleveland-lodging": { name: "Cleveland downtown lodging zone", coordinates: [-81.6908, 41.4993] },
  "pittsburgh-lodging": { name: "Pittsburgh central lodging zone", coordinates: [-79.9959, 40.4406] },
  "breezewood-lodging": { name: "Breezewood lodging zone", coordinates: [-78.2453, 39.9984] },
  "nazareth-lodging": { name: "Nazareth and Bethlehem lodging zone", coordinates: [-75.306, 40.7535] },
  "danbury-lodging": { name: "Danbury I-84 lodging zone", coordinates: [-73.454, 41.3948] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] }
};

export const manualLegs = {
  "boston-logan-return:f1-arcade-boston": { mode: "rideshare-or-transit", distance_miles: 4.5, display_minutes: 30 },
  "f1-arcade-boston:boston-logan-hotel": { mode: "rideshare-or-transit", distance_miles: 5.5, display_minutes: 30 }
};

export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "naismith-center-court", "springfield-lodging"] },
  { day: 2, risk: "medium", node_ids: ["springfield-lodging", "peebles-island", "cohoes-falls", "empac", "troy-lodging"] },
  { day: 3, risk: "medium", node_ids: ["troy-lodging", "erie-canal-lock-e20", "five-wits-syracuse", "syracuse-lodging"] },
  { day: 4, risk: "medium", node_ids: ["syracuse-lodging", "strong-museum-play", "high-falls-pont-de-rennes", "batavia-lodging"] },
  { day: 5, risk: "medium", node_ids: ["batavia-lodging", "eden-kazoo", "riverworks-racing-zipline", "presque-isle-movement", "erie-lodging"] },
  { day: 6, risk: "medium", node_ids: ["erie-lodging", "rock-hall", "superelectric-pinball", "sugar-agora", "cleveland-lodging"] },
  { day: 7, risk: "medium", node_ids: ["cleveland-lodging", "rays-bike-park", "brandywine-falls", "pittsburgh-lodging"] },
  { day: 8, risk: "high", node_ids: ["pittsburgh-lodging", "st-nicholas-pittsburgh", "carrie-graffiti", "breezewood-lodging"] },
  { day: 9, risk: "medium", node_ids: ["breezewood-lodging", "old-pa-pike-rays-hill", "hershey-candy-bar", "nazareth-lodging"] },
  { day: 10, risk: "high", node_ids: ["nazareth-lodging", "martin-guitar", "pocono-premium-outlets", "raymondskill-falls", "danbury-lodging"] },
  { day: 11, risk: "high", node_ids: ["danbury-lodging", "westville-grand-trunk", "boston-logan-return", "f1-arcade-boston", "boston-logan-hotel"] }
];
