export const ROUTE_ID = "route-07";
export const ROUTE_SLUG = "route-07-kazoos-rock-mechanical-dreams-loop";
export const ROUTE_NAME = "The Kazoos, Rock & Mechanical Dreams Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("springfield-museums", "Springfield Museums, 21 Edwards Street, Springfield, Massachusetts", ["Springfield Museums quadrangle Massachusetts", "Springfield Science Museum interior", "Dr Seuss Museum Springfield"]),
  p("springfield-armory", "Springfield Armory National Historic Site, 1 Armory Square, Springfield, Massachusetts", ["Springfield Armory National Historic Site", "Springfield Armory museum rifles", "Springfield Armory Main Arsenal"]),
  p("cohoes-falls", "Cohoes Falls View Park, North Mohawk Street, Cohoes, New York", ["Cohoes Falls New York", "Cohoes Falls View Park", "Cohoes Falls autumn"]),
  p("oakwood-troy", "Uncle Sam Grave, Oakwood Cemetery, Troy, New York", ["Uncle Sam grave Oakwood Cemetery Troy", "Gardner Earl Chapel Oakwood Cemetery", "Oakwood Cemetery Troy overlook"]),
  p("saratoga-auto", "Saratoga Automobile Museum, 110 Avenue of the Pines, Saratoga Springs, New York", ["Saratoga Automobile Museum", "Saratoga Automobile Museum interior", "Saratoga Automobile Museum Bottling Plant"]),
  p("boxing-hof", "International Boxing Hall of Fame, 360 North Peterboro Street, Canastota, New York", ["International Boxing Hall of Fame Canastota", "Boxing Hall of Fame Canastota interior", "International Boxing Hall of Fame exhibits"]),
  p("chittenango-falls", "Chittenango Falls State Park, 5241 Gorge Road, Cazenovia, New York", ["Chittenango Falls State Park", "Chittenango Falls footbridge", "Chittenango Falls autumn"]),
  p("anthony-house", "Susan B. Anthony Museum & House, 17 Madison Street, Rochester, New York", ["Susan B Anthony House Rochester", "Susan B Anthony Museum interior", "Susan B Anthony house parlor"]),
  p("mount-hope-rochester", "Mount Hope Cemetery, 1133 Mount Hope Avenue, Rochester, New York", ["Mount Hope Cemetery Rochester", "Frederick Douglass grave Mount Hope", "Susan B Anthony grave Mount Hope"]),
  p("rmsc-electricity", "Rochester Museum & Science Center, 657 East Avenue, Rochester, New York", ["Rochester Museum Science Center Electricity Theater", "RMSC Tesla coils", "Rochester Museum Science Center exterior"]),
  p("eden-kazoo", "Original American Kazoo Company, 8703 South Main Street, Eden, New York", ["American Kazoo Company Eden New York", "Kazoo Factory Eden museum", "Original American Kazoo factory machinery"]),
  p("trec-presque-isle", "Tom Ridge Environmental Center, 301 Peninsula Drive, Erie, Pennsylvania", ["Tom Ridge Environmental Center", "Tom Ridge Environmental Center tower", "Presque Isle State Park Tom Ridge Center"]),
  p("erie-maritime", "Erie Maritime Museum, 150 East Front Street, Erie, Pennsylvania", ["Erie Maritime Museum", "Erie Maritime Museum interior", "US Brig Niagara Erie museum"]),
  p("rock-hall", "Rock & Roll Hall of Fame, 1100 Rock and Roll Boulevard, Cleveland, Ohio", ["Rock and Roll Hall of Fame Cleveland", "Rock Hall Cleveland interior", "Rock Hall stage exhibits"]),
  p("christmas-story-house", "A Christmas Story House, 3159 West 11th Street, Cleveland, Ohio", ["A Christmas Story House Cleveland", "Christmas Story House interior", "Christmas Story House leg lamp"]),
  p("buckland-museum", "Buckland Museum of Witchcraft & Magick, 2155 Broadview Road, Cleveland, Ohio", ["Buckland Museum Cleveland", "Buckland Museum Witchcraft interior", "Buckland Museum artifacts"]),
  p("sugar-agora", "Agora Theatre & Ballroom, 5000 Euclid Avenue, Cleveland, Ohio", ["Agora Theatre Cleveland", "Agora Theatre Cleveland interior", "Sugar Bob Mould band live"]),
  p("crawford-auto", "Crawford Auto-Aviation Museum, 10825 East Boulevard, Cleveland, Ohio", ["Crawford Auto Aviation Museum", "Crawford Museum Cleveland cars", "Crawford Auto Aviation Museum interior"]),
  p("cleveland-art", "Cleveland Museum of Art, 11150 East Boulevard, Cleveland, Ohio", ["Cleveland Museum of Art", "Cleveland Museum of Art atrium", "Cleveland Museum of Art galleries"]),
  p("lake-view-haserot", "Haserot Angel, Lake View Cemetery, Cleveland, Ohio", ["Haserot Angel Lake View Cemetery", "Angel of Death Victorious Cleveland", "Lake View Cemetery Cleveland autumn"]),
  p("all-saints-canonsburg", "All Saints Greek Orthodox Church, 601 West McMurray Road, Canonsburg, Pennsylvania", ["All Saints Greek Orthodox Church Canonsburg", "All Saints Canonsburg iconostasis", "All Saints Greek Orthodox Canonsburg interior"]),
  p("bedford-coffee-pot", "The Coffee Pot, 108 Telegraph Road, Bedford, Pennsylvania", ["Bedford Coffee Pot Pennsylvania", "Koontz Coffee Pot Bedford", "Giant Coffee Pot Bedford PA"]),
  p("old-bedford-village", "Old Bedford Village, 220 Sawblade Road, Bedford, Pennsylvania", ["Old Bedford Village Pennsylvania", "Old Bedford Village historic buildings", "Old Bedford Village autumn"]),
  p("mack-museum", "Mack Trucks Historical Museum, 2402 Lehigh Parkway South, Allentown, Pennsylvania", ["Mack Trucks Historical Museum", "Mack Museum Allentown interior", "Mack truck museum historic trucks"]),
  p("allentown-fish-hatchery", "Lil-Le-Hi Trout Nursery, 2901 Fish Hatchery Road, Allentown, Pennsylvania", ["Allentown Fish Hatchery", "Lil Le Hi Trout Nursery", "Lehigh Parkway fish hatchery"]),
  p("uncle-sam-danbury", "World's Tallest Uncle Sam Statue, Danbury Railway Museum, 120 White Street, Danbury, Connecticut", ["World's tallest Uncle Sam Danbury", "Uncle Sam statue Danbury Railway Museum", "Great Danbury Fair Uncle Sam statue"]),
  p("danbury-fair-carousel", "Double-Decker Carousel, Danbury Fair, 7 Backus Avenue, Danbury, Connecticut", ["Danbury Fair double decker carousel", "Danbury Fair Mall carousel", "Danbury Fair carousel interior"]),
  p("mit-museum", "MIT Museum, 314 Main Street, Cambridge, Massachusetts", ["MIT Museum Cambridge", "MIT Museum kinetic sculptures", "MIT Museum holography gallery"]),
  p("harvard-art", "Harvard Art Museums, 32 Quincy Street, Cambridge, Massachusetts", ["Harvard Art Museums Calderwood Courtyard", "Harvard Art Museums interior", "Harvard Art Museums exterior"])
];

export const contextualImagePlaces = new Set([
  "springfield-museums", "oakwood-troy", "saratoga-auto", "boxing-hof", "anthony-house",
  "mount-hope-rochester", "rmsc-electricity", "eden-kazoo", "erie-maritime", "buckland-museum",
  "sugar-agora", "crawford-auto", "all-saints-canonsburg", "old-bedford-village",
  "mack-museum", "allentown-fish-hatchery", "danbury-fair-carousel", "mit-museum"
]);

export const preferredCommonsFiles = {
  "lake-view-haserot": ["File:The Angel of Death Victorious.jpg"],
  "christmas-story-house": ["File:A Christmas Story House.jpg"],
  "cohoes-falls": ["File:Cohoes Falls, New York.jpg"]
};

// Longitude, latitude; route pins target an entrance, parking point, or the
// specific object rather than a city centroid.
export const manualCoordinates = {
  "springfield-museums": [-72.5863149, 42.1043685],
  "springfield-armory": [-72.5815607, 42.1071841],
  "cohoes-falls": [-73.7100667, 42.7859806],
  "oakwood-troy": [-73.6680166, 42.7624063],
  "saratoga-auto": [-73.8047534, 43.0570007],
  "boxing-hof": [-75.7501454, 43.0896405],
  "chittenango-falls": [-75.8492007, 42.9826164],
  "anthony-house": [-77.6280045, 43.1532425],
  "mount-hope-rochester": [-77.6188240, 43.1299725],
  "rmsc-electricity": [-77.5874681, 43.1525078],
  "eden-kazoo": [-78.8983928, 42.6491077],
  "trec-presque-isle": [-80.1540595, 42.1100038],
  "erie-maritime": [-80.0871807, 42.1364582],
  "rock-hall": [-81.6954068, 41.5084983],
  "christmas-story-house": [-81.6874123, 41.4687248],
  "buckland-museum": [-81.6997569, 41.4381207],
  "sugar-agora": [-81.6536566, 41.5034443],
  "crawford-auto": [-81.6111732, 41.5132810],
  "cleveland-art": [-81.6117367, 41.5090438],
  "lake-view-haserot": [-81.5903833, 41.5130472],
  "all-saints-canonsburg": [-80.1568468, 40.2729710],
  "bedford-coffee-pot": [-78.5173529, 40.0229060],
  "old-bedford-village": [-78.5112971, 40.0412389],
  "mack-museum": [-75.4944108, 40.5721574],
  "allentown-fish-hatchery": [-75.5133440, 40.5632240],
  "uncle-sam-danbury": [-73.4500683, 41.3979253],
  "danbury-fair-carousel": [-73.4807429, 41.3793031],
  "mit-museum": [-71.0864154, 42.3619754],
  "harvard-art": [-71.1141130, 42.3740988]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "springfield-lodging": { name: "Springfield downtown/Armory lodging zone", coordinates: [-72.5840, 42.1015] },
  "troy-lodging": { name: "Troy downtown lodging zone", coordinates: [-73.6868, 42.7284] },
  "syracuse-lodging": { name: "Syracuse downtown lodging zone", coordinates: [-76.1474, 43.0481] },
  "batavia-lodging": { name: "Batavia I-90 lodging zone", coordinates: [-78.1875, 42.9984] },
  "erie-lodging": { name: "Erie downtown/bayfront lodging zone", coordinates: [-80.0825, 42.1292] },
  "cleveland-lodging": { name: "Cleveland downtown lodging zone", coordinates: [-81.6908, 41.4993] },
  "southpointe-lodging": { name: "Canonsburg/Southpointe lodging zone", coordinates: [-80.1640, 40.2775] },
  "mcconnellsburg-lodging": { name: "McConnellsburg west/small-town lodging zone", coordinates: [-78.0250, 39.9350] },
  "allentown-parkway-lodging": { name: "South Allentown/Lehigh Parkway lodging zone", coordinates: [-75.4910, 40.5510] },
  "danbury-downtown-lodging": { name: "Danbury downtown lodging zone", coordinates: [-73.4540, 41.3935] },
  "danbury-mall-lodging": { name: "Danbury Fair/I-84 replacement lodging zone", coordinates: [-73.4800, 41.3800] },
  "boston-logan-return": { name: "Boston Logan Rental Car Center return", coordinates: [-71.0304, 42.3682] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] }
};

export const manualLegs = {};
export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "springfield-museums", "springfield-lodging"] },
  { day: 2, risk: "medium", node_ids: ["springfield-lodging", "cohoes-falls", "oakwood-troy", "troy-lodging"] },
  { day: 3, risk: "medium", node_ids: ["troy-lodging", "boxing-hof", "syracuse-lodging"] },
  { day: 4, risk: "medium", node_ids: ["syracuse-lodging", "anthony-house", "mount-hope-rochester", "batavia-lodging"] },
  { day: 5, risk: "medium", node_ids: ["batavia-lodging", "eden-kazoo", "trec-presque-isle", "erie-lodging"] },
  { day: 6, risk: "medium", node_ids: ["erie-lodging", "rock-hall", "christmas-story-house", "buckland-museum", "sugar-agora", "cleveland-lodging"] },
  { day: 7, risk: "medium", node_ids: ["cleveland-lodging", "cleveland-art", "southpointe-lodging"] },
  { day: 8, risk: "high", node_ids: ["southpointe-lodging", "all-saints-canonsburg", "bedford-coffee-pot", "mcconnellsburg-lodging"] },
  { day: 9, risk: "high", node_ids: ["mcconnellsburg-lodging", "mack-museum", "allentown-parkway-lodging"] },
  { day: 10, risk: "high", node_ids: ["allentown-parkway-lodging", "uncle-sam-danbury", "danbury-downtown-lodging"] },
  { day: 11, risk: "high", node_ids: ["danbury-downtown-lodging", "boston-logan-return", "boston-logan-hotel"] }
];

export const replacementVariants = [
  { id: "replacement-d1-springfield-armory", day: 1, replacement_place_id: "springfield-armory", replaces_place_ids: ["springfield-museums"], nodes: ["boston-logan-rental", "springfield-armory", "springfield-lodging"] },
  { id: "replacement-d2-saratoga-auto", day: 2, replacement_place_id: "saratoga-auto", replaces_place_ids: ["cohoes-falls", "oakwood-troy"], nodes: ["springfield-lodging", "saratoga-auto", "troy-lodging"] },
  { id: "replacement-d3-chittenango-falls", day: 3, replacement_place_id: "chittenango-falls", replaces_place_ids: ["boxing-hof"], nodes: ["troy-lodging", "chittenango-falls", "syracuse-lodging"] },
  { id: "replacement-d4-rmsc-electricity", day: 4, replacement_place_id: "rmsc-electricity", replaces_place_ids: ["anthony-house", "mount-hope-rochester"], nodes: ["syracuse-lodging", "rmsc-electricity", "batavia-lodging"] },
  { id: "replacement-d5-erie-maritime", day: 5, replacement_place_id: "erie-maritime", replaces_place_ids: ["trec-presque-isle"], nodes: ["batavia-lodging", "eden-kazoo", "erie-maritime", "erie-lodging"] },
  { id: "replacement-d6-crawford-auto", day: 6, replacement_place_id: "crawford-auto", replaces_place_ids: ["buckland-museum"], nodes: ["erie-lodging", "rock-hall", "christmas-story-house", "crawford-auto", "sugar-agora", "cleveland-lodging"] },
  { id: "replacement-d7-lake-view-haserot", day: 7, replacement_place_id: "lake-view-haserot", replaces_place_ids: ["cleveland-art"], nodes: ["cleveland-lodging", "lake-view-haserot", "southpointe-lodging"] },
  { id: "replacement-d8-old-bedford-village", day: 8, replacement_place_id: "old-bedford-village", replaces_place_ids: ["bedford-coffee-pot"], nodes: ["southpointe-lodging", "all-saints-canonsburg", "old-bedford-village", "mcconnellsburg-lodging"] },
  { id: "replacement-d9-allentown-fish-hatchery", day: 9, replacement_place_id: "allentown-fish-hatchery", replaces_place_ids: ["mack-museum"], nodes: ["mcconnellsburg-lodging", "allentown-fish-hatchery", "allentown-parkway-lodging"] },
  { id: "replacement-d10-danbury-carousel", day: 10, replacement_place_id: "danbury-fair-carousel", replaces_place_ids: ["uncle-sam-danbury"], nodes: ["allentown-parkway-lodging", "danbury-fair-carousel", "danbury-mall-lodging"] },
  { id: "replacement-d11-harvard-art", day: 11, replacement_place_id: "harvard-art", replaces_place_ids: ["mit-museum"], unchanged_drive: true }
];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "Springfield, MA", station: "USW00014740", station_role: "Hartford-Springfield regional proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Troy, NY", station: "USW00014735", station_role: "Albany-Troy regional station" },
  { day: 3, date: "2026-10-06", sleep_city: "Syracuse, NY", station: "USW00014771", station_role: "Syracuse airport" },
  { day: 4, date: "2026-10-07", sleep_city: "Batavia, NY", station: "USW00014768", station_role: "Rochester-Batavia regional proxy" },
  { day: 5, date: "2026-10-08", sleep_city: "Erie, PA", station: "USW00014860", station_role: "Erie airport" },
  { day: 6, date: "2026-10-09", sleep_city: "Cleveland, OH", station: "USW00014820", station_role: "Cleveland airport" },
  { day: 7, date: "2026-10-10", sleep_city: "Canonsburg, PA", station: "USW00094823", station_role: "Pittsburgh-Canonsburg regional proxy" },
  { day: 8, date: "2026-10-11", sleep_city: "McConnellsburg, PA", station: "USW00014751", station_role: "Harrisburg-McConnellsburg regional proxy" },
  { day: 9, date: "2026-10-12", sleep_city: "Allentown, PA", station: "USW00014737", station_role: "Lehigh Valley airport" },
  { day: 10, date: "2026-10-13", sleep_city: "Danbury, CT", station: "USW00094702", station_role: "Bridgeport-Danbury regional proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];

export const verifiedAt = "2026-08-24";
