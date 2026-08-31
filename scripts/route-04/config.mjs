export const ROUTE_ID = "route-04";
export const ROUTE_SLUG = "route-04-trolls-moon-rocks-curiosity-coast-loop";
export const ROUTE_NAME = "The Trolls, Moon Rocks & Curiosity Coast Loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("african-burying-ground", "African Burying Ground Memorial Park, Chestnut Street, Portsmouth, New Hampshire", ["Portsmouth African Burying Ground Memorial", "African Burying Ground Portsmouth sculpture", "Chestnut Street memorial Portsmouth NH"]),
  p("uss-albacore", "USS Albacore Museum, 600 Market Street, Portsmouth, New Hampshire", ["USS Albacore Portsmouth museum", "USS Albacore submarine interior", "Albacore Park Portsmouth New Hampshire"]),
  p("nubble-light", "Sohier Park, Nubble Road, York, Maine", ["Nubble Lighthouse York Maine", "Cape Neddick Light Sohier Park", "Nubble lighthouse sunset Maine"]),
  p("woodman-museum", "Woodman Museum, 182 Central Avenue, Dover, New Hampshire", ["Woodman Museum Dover New Hampshire", "Damm Garrison Woodman Museum", "Woodman Institute Museum natural history"]),
  p("victoria-mansion", "Victoria Mansion, 109 Danforth Street, Portland, Maine", ["Victoria Mansion Portland Maine", "Victoria Mansion Portland interior", "Morse Libby House Portland Maine"]),
  p("portland-head-light", "Portland Head Light, 1000 Shore Road, Cape Elizabeth, Maine", ["Portland Head Light Maine", "Fort Williams Park Portland Head lighthouse", "Portland Head Light autumn"]),
  p("eastern-promenade", "Eastern Promenade, Portland, Maine", ["Eastern Promenade Portland Maine", "Portland Maine Eastern Promenade Casco Bay", "Eastern Promenade sunset Portland"]),
  p("arcadia-portland", "Arcadia, 504 Congress Street, Portland, Maine", ["Arcadia Portland Maine arcade bar", "Portland Maine Congress Street night", "Portland Maine pinball bar"]),
  p("desert-of-maine", "Desert of Maine, 95 Desert Road, Freeport, Maine", ["Desert of Maine Freeport", "Desert of Maine dunes", "Desert of Maine Maine historical buildings"]),
  p("coastal-maine-gardens", "Coastal Maine Botanical Gardens, 105 Botanical Gardens Drive, Boothbay, Maine", ["Coastal Maine Botanical Gardens trolls", "Guardians of the Seeds Maine trolls", "Coastal Maine Botanical Gardens Boothbay"]),
  p("prison-showroom", "Maine State Prison Showroom, 358 Main Street, Thomaston, Maine", ["Maine State Prison Showroom Thomaston", "Maine prison industries showroom", "Thomaston Maine Main Street prison showroom"]),
  p("rockland-breakwater", "Rockland Breakwater Lighthouse, Rockland, Maine", ["Rockland Breakwater Lighthouse", "Rockland Breakwater Maine", "Rockland harbor lighthouse sunset"]),
  p("maine-maritime", "Maine Maritime Museum, 243 Washington Street, Bath, Maine", ["Maine Maritime Museum Bath", "Maine Maritime Museum shipyard", "Maine Maritime Museum Percy and Small Shipyard"]),
  p("owls-head-transportation", "Owls Head Transportation Museum, 117 Museum Street, Owls Head, Maine", ["Owls Head Transportation Museum", "Owls Head Museum aircraft", "Owls Head Transportation Museum antique cars"]),
  p("fort-knox-observatory", "Penobscot Narrows Bridge Observatory, Prospect, Maine", ["Penobscot Narrows Bridge Observatory", "Fort Knox Maine Penobscot", "Penobscot Narrows Observatory view"]),
  p("bar-harbor-shore-path", "Bar Harbor Shore Path, Bar Harbor, Maine", ["Bar Harbor Shore Path", "Bar Harbor Shore Path Porcupine Islands", "Bar Harbor Maine waterfront sunset"]),
  p("penobscot-marine", "Penobscot Marine Museum, 2 Church Street, Searsport, Maine", ["Penobscot Marine Museum Searsport", "Penobscot Marine Museum Maine", "Searsport Maine sea captains houses"]),
  p("cadillac-mountain", "Cadillac Mountain Summit, Acadia National Park, Maine", ["Cadillac Mountain sunrise Acadia", "Cadillac Mountain summit October", "Cadillac Mountain Bar Harbor"]),
  p("ocean-path", "Thunder Hole, Park Loop Road, Acadia National Park, Maine", ["Ocean Path Acadia Thunder Hole", "Monument Cove Ocean Path Acadia", "Acadia Ocean Path autumn"]),
  p("jordan-pond", "Jordan Pond House, Acadia National Park, Maine", ["Jordan Pond Acadia Bubbles", "Jordan Pond House autumn", "Jordan Pond Acadia National Park"]),
  p("crypto-museum", "International Cryptozoology Museum, 490 Broadway, Bangor, Maine", ["International Cryptozoology Museum Bangor", "Cryptozoology Museum Bigfoot Maine", "International Cryptozoology Museum exhibits"]),
  p("stephen-king-house", "Stephen King House, 47 West Broadway, Bangor, Maine", ["Stephen King house Bangor", "47 West Broadway Bangor red house", "Stephen King house iron gate"]),
  p("thomas-hill-standpipe", "Thomas Hill Standpipe, 41 Thomas Hill Road, Bangor, Maine", ["Thomas Hill Standpipe Bangor", "Bangor standpipe sunset", "Thomas Hill Standpipe interior"]),
  p("seal-cove-auto", "Seal Cove Auto Museum, 1414 Tremont Road, Seal Cove, Maine", ["Seal Cove Auto Museum", "Seal Cove Auto Museum brass cars", "Seal Cove Maine automobile museum"]),
  p("cole-transportation", "Cole Land Transportation Museum, 405 Perry Road, Bangor, Maine", ["Cole Land Transportation Museum", "Cole Museum Bangor trucks", "Cole Transportation Museum military vehicles"]),
  p("maine-mineral-gem", "Maine Mineral and Gem Museum, 99 Main Street, Bethel, Maine", ["Maine Mineral Gem Museum Bethel", "Maine Mineral Museum meteorites", "Maine Mineral Museum moon rock"]),
  p("bethel-village", "Bethel Common, Bethel, Maine", ["Bethel Maine village common autumn", "Bethel Maine Main Street", "Bethel Maine fall foliage"]),
  p("colby-art", "Colby College Museum of Art, 5600 Mayflower Hill Drive, Waterville, Maine", ["Colby College Museum of Art", "Colby Museum Alfond Lunder", "Colby College art museum architecture"]),
  p("weeks-state-park", "Weeks State Park, 200 Weeks State Park Road, Lancaster, New Hampshire", ["Weeks State Park Lancaster New Hampshire", "Weeks State Park fire tower", "John Wingate Weeks house Mount Prospect autumn"]),
  p("stj-foliage-train", "St. Johnsbury Welcome Center, 51 Depot Square, St Johnsbury, Vermont", ["St Johnsbury foliage train", "Vermont Rail System St Johnsbury train", "St Johnsbury Depot Square autumn"]),
  p("fairbanks-museum", "Fairbanks Museum and Planetarium, 1302 Main Street, St Johnsbury, Vermont", ["Fairbanks Museum St Johnsbury", "Fairbanks Museum Victorian interior", "Fairbanks Museum natural history Vermont"]),
  p("dog-mountain", "Dog Mountain, 143 Parks Road, St Johnsbury, Vermont", ["Dog Chapel Dog Mountain Vermont", "Stephen Huneck Dog Chapel interior", "Dog Mountain St Johnsbury autumn"]),
  p("dormition-orthodox", "Dormition of the Mother of God Greek Orthodox Church, 600 South Willard Street, Burlington, Vermont", ["Dormition Greek Orthodox Burlington Vermont", "Greek Orthodox church Burlington Vermont iconostasis", "Dormition Mother of God Burlington church"]),
  p("shelburne-museum", "Shelburne Museum, 6000 Shelburne Road, Shelburne, Vermont", ["Shelburne Museum Ticonderoga", "Shelburne Museum Round Barn", "Shelburne Museum folk art Vermont"]),
  p("burlington-waterfront", "Waterfront Park, Burlington, Vermont", ["Burlington Vermont waterfront autumn", "Burlington Waterfront Park sunset", "Church Street Burlington Vermont night"]),
  p("radio-bean", "Radio Bean, 8 North Winooski Avenue, Burlington, Vermont", ["Radio Bean Burlington Vermont", "Radio Bean live music Burlington", "Burlington Vermont music venue"]),
  p("museum-everyday-life", "Museum of Everyday Life, 3482 Dry Pond Road, Glover, Vermont", ["Museum of Everyday Life Glover Vermont", "Museum of Everyday Life chairs exhibit", "Museum Everyday Life Vermont barn"]),
  p("ben-jerrys-graveyard", "Ben and Jerry's Factory, 1281 Waterbury-Stowe Road, Waterbury, Vermont", ["Ben Jerry Flavor Graveyard Waterbury", "Ben Jerry factory Waterbury Vermont", "Ben Jerry Flavor Graveyard headstones"]),
  p("hope-cemetery", "Hope Cemetery, 201 Maple Avenue, Barre, Vermont", ["Hope Cemetery Barre Vermont", "Hope Cemetery granite monuments", "Hope Cemetery Barre race car grave"]),
  p("coolidge-site", "President Calvin Coolidge State Historic Site, 3780 Vermont Route 100A, Plymouth Notch, Vermont", ["Calvin Coolidge Historic Site Plymouth Notch", "Coolidge Homestead Vermont autumn", "Plymouth Notch Vermont village"]),
  p("vins", "VINS Nature Center, 149 Natures Way, Quechee, Vermont", ["VINS Nature Center Quechee", "VINS raptor Vermont", "VINS Forest Canopy Walk"]),
  p("quechee-gorge", "Quechee Gorge Bridge, Quechee, Vermont", ["Quechee Gorge Vermont autumn", "Quechee Gorge bridge", "Quechee Gorge October foliage"]),
  p("american-precision", "American Precision Museum, 196 Main Street, Windsor, Vermont", ["American Precision Museum Windsor Vermont", "Robbins Lawrence Armory museum", "American Precision Museum machine tools"]),
  p("saint-gaudens", "Saint-Gaudens National Historical Park, 139 Saint Gaudens Road, Cornish, New Hampshire", ["Saint Gaudens National Historical Park", "Saint Gaudens Aspet autumn", "Saint Gaudens Diana sculpture"]),
  p("path-of-life", "Path of Life Sculpture Garden, 36 Park Road, Windsor, Vermont", ["Path of Life Sculpture Garden Windsor Vermont", "Path of Life Vermont stone labyrinth", "Path of Life sculpture garden maze"]),
  p("flw-houses", "Currier Museum of Art, 150 Ash Street, Manchester, New Hampshire", ["Zimmerman House Frank Lloyd Wright Manchester", "Kalil House Manchester New Hampshire", "Frank Lloyd Wright Currier Manchester"]),
  p("currier-museum", "Currier Museum of Art, 150 Ash Street, Manchester, New Hampshire", ["Currier Museum of Art Manchester", "Currier Museum interior", "Currier Museum New Hampshire art"]),
  p("see-science", "SEE Science Center, 200 Bedford Street, Manchester, New Hampshire", ["SEE Science Center Manchester NH", "LEGO Millyard Manchester SEE", "SEE Science Center exhibits"])
];

export const contextualImagePlaces = new Set([
  "african-burying-ground", "arcadia-portland", "prison-showroom", "bar-harbor-shore-path",
  "crypto-museum", "stephen-king-house", "bethel-village", "stj-foliage-train", "dormition-orthodox",
  "radio-bean", "museum-everyday-life", "ben-jerrys-graveyard", "path-of-life", "flw-houses", "see-science"
]);

export const preferredCommonsFiles = {};

export const manualCoordinates = {
  "african-burying-ground": [-70.7597, 43.0760], "uss-albacore": [-70.7736, 43.0821],
  "nubble-light": [-70.5910, 43.1650], "victoria-mansion": [-70.2632, 43.6510],
  "portland-head-light": [-70.2079, 43.6232], "eastern-promenade": [-70.2399, 43.6726],
  "arcadia-portland": [-70.2605, 43.6570], "desert-of-maine": [-70.1559, 43.8528],
  "coastal-maine-gardens": [-69.6470, 43.8753], "prison-showroom": [-69.1814, 44.0784],
  "rockland-breakwater": [-69.0777, 44.1041], "maine-maritime": [-69.8152, 43.8934],
  "owls-head-transportation": [-69.1012, 43.9788], "fort-knox-observatory": [-68.8016, 44.5658],
  "bar-harbor-shore-path": [-68.1992, 44.3876], "penobscot-marine": [-68.9263, 44.4564],
  "cadillac-mountain": [-68.2250, 44.3526], "ocean-path": [-68.1886, 44.3204],
  "jordan-pond": [-68.2526, 44.3204], "crypto-museum": [-68.7744, 44.8140],
  "stephen-king-house": [-68.7834, 44.7965], "thomas-hill-standpipe": [-68.7886, 44.8079],
  "seal-cove-auto": [-68.3990, 44.2997], "cole-transportation": [-68.7923, 44.7775],
  "maine-mineral-gem": [-70.7901, 44.4041], "bethel-village": [-70.7906, 44.4045],
  "colby-art": [-69.6615, 44.5645], "weeks-state-park": [-71.5777, 44.4609],
  "stj-foliage-train": [-72.0163, 44.4191], "fairbanks-museum": [-72.0208, 44.4196],
  "dog-mountain": [-71.9559, 44.4237], "dormition-orthodox": [-73.2011, 44.4643],
  "shelburne-museum": [-73.2321, 44.3753], "burlington-waterfront": [-73.2190, 44.4776],
  "radio-bean": [-73.2105, 44.4811], "museum-everyday-life": [-72.2140, 44.7008],
  "ben-jerrys-graveyard": [-72.7090, 44.3520], "hope-cemetery": [-72.4791, 44.2149],
  "coolidge-site": [-72.7203, 43.5359], "vins": [-72.4186, 43.6438],
  "quechee-gorge": [-72.4080, 43.6371], "american-precision": [-72.3872, 43.4773],
  "saint-gaudens": [-72.3697, 43.5009], "path-of-life": [-72.3952, 43.4930],
  "flw-houses": [-71.4558, 43.0067], "currier-museum": [-71.4558, 43.0067],
  "see-science": [-71.4682, 42.9917], "woodman-museum": [-70.8762, 43.1930]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "portsmouth-lodging": { name: "Portsmouth safe central lodging zone", coordinates: [-70.7626, 43.0718] },
  "portland-lodging": { name: "Portland peninsula lodging zone", coordinates: [-70.2553, 43.6572] },
  "rockland-lodging": { name: "Rockland harbor lodging zone", coordinates: [-69.1089, 44.1037] },
  "bar-harbor-lodging": { name: "Bar Harbor village lodging zone", coordinates: [-68.2039, 44.3876] },
  "bangor-lodging": { name: "Bangor Broadway lodging zone", coordinates: [-68.7712, 44.8016] },
  "bethel-lodging": { name: "Bethel village lodging zone", coordinates: [-70.7906, 44.4042] },
  "montpelier-lodging": { name: "Montpelier downtown lodging zone", coordinates: [-72.5754, 44.2601] },
  "burlington-lodging": { name: "Burlington South End lodging zone", coordinates: [-73.2121, 44.4759] },
  "woodstock-lodging": { name: "Woodstock village lodging zone", coordinates: [-72.5184, 43.6242] },
  "manchester-lodging": { name: "Manchester north/downtown lodging zone", coordinates: [-71.4548, 42.9956] },
  "boston-logan-hotel": { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] }
};

export const manualLegs = {};

export const dayRoutes = [
  { day: 1, risk: "medium", node_ids: ["boston-logan-rental", "nubble-light", "uss-albacore", "african-burying-ground", "portsmouth-lodging"] },
  { day: 2, risk: "medium", node_ids: ["portsmouth-lodging", "victoria-mansion", "portland-head-light", "eastern-promenade", "portland-lodging"] },
  { day: 3, risk: "low", node_ids: ["portland-lodging", "coastal-maine-gardens", "prison-showroom", "rockland-breakwater", "rockland-lodging"] },
  { day: 4, risk: "low", node_ids: ["rockland-lodging", "owls-head-transportation", "fort-knox-observatory", "bar-harbor-shore-path", "bar-harbor-lodging"] },
  { day: 5, risk: "low", node_ids: ["bar-harbor-lodging", "cadillac-mountain", "ocean-path", "jordan-pond", "crypto-museum", "stephen-king-house", "thomas-hill-standpipe", "bangor-lodging"] },
  { day: 6, risk: "low", node_ids: ["bangor-lodging", "cole-transportation", "maine-mineral-gem", "bethel-village", "bethel-lodging"] },
  { day: 7, risk: "low", node_ids: ["bethel-lodging", "weeks-state-park", "stj-foliage-train", "fairbanks-museum", "montpelier-lodging"] },
  { day: 8, risk: "low", node_ids: ["montpelier-lodging", "hope-cemetery", "dormition-orthodox", "shelburne-museum", "burlington-waterfront", "radio-bean", "burlington-lodging"] },
  { day: 9, risk: "low", node_ids: ["burlington-lodging", "ben-jerrys-graveyard", "coolidge-site", "woodstock-lodging"] },
  { day: 10, risk: "low", node_ids: ["woodstock-lodging", "quechee-gorge", "american-precision", "saint-gaudens", "manchester-lodging"] },
  { day: 11, risk: "medium", node_ids: ["manchester-lodging", "flw-houses", "currier-museum", "boston-logan-hotel"] }
];

export const replacementVariants = [
  { id: "replacement-d1-woodman", day: 1, replacement_place_id: "woodman-museum", replaces_place_ids: ["uss-albacore"], nodes: ["boston-logan-rental", "nubble-light", "woodman-museum", "african-burying-ground", "portsmouth-lodging"] },
  { id: "replacement-d2-desert", day: 2, replacement_place_id: "desert-of-maine", replaces_place_ids: ["victoria-mansion"], nodes: ["portsmouth-lodging", "desert-of-maine", "portland-head-light", "eastern-promenade", "portland-lodging"] },
  { id: "replacement-d3-maritime", day: 3, replacement_place_id: "maine-maritime", replaces_place_ids: ["coastal-maine-gardens"], nodes: ["portland-lodging", "maine-maritime", "prison-showroom", "rockland-breakwater", "rockland-lodging"] },
  { id: "replacement-d4-penobscot", day: 4, replacement_place_id: "penobscot-marine", replaces_place_ids: ["owls-head-transportation"], nodes: ["rockland-lodging", "penobscot-marine", "fort-knox-observatory", "bar-harbor-shore-path", "bar-harbor-lodging"] },
  { id: "replacement-d5-seal-cove", day: 5, replacement_place_id: "seal-cove-auto", replaces_place_ids: ["cadillac-mountain", "ocean-path", "jordan-pond"], nodes: ["bar-harbor-lodging", "seal-cove-auto", "crypto-museum", "stephen-king-house", "thomas-hill-standpipe", "bangor-lodging"] },
  { id: "replacement-d6-colby", day: 6, replacement_place_id: "colby-art", replaces_place_ids: ["cole-transportation"], nodes: ["bangor-lodging", "colby-art", "maine-mineral-gem", "bethel-village", "bethel-lodging"] },
  { id: "replacement-d7-dog-mountain", day: 7, replacement_place_id: "dog-mountain", replaces_place_ids: ["weeks-state-park", "stj-foliage-train", "fairbanks-museum"], nodes: ["bethel-lodging", "dog-mountain", "montpelier-lodging"] },
  { id: "replacement-d8-everyday", day: 8, replacement_place_id: "museum-everyday-life", replaces_place_ids: ["hope-cemetery", "shelburne-museum"], nodes: ["montpelier-lodging", "museum-everyday-life", "dormition-orthodox", "burlington-lodging"] },
  { id: "replacement-d9-vins", day: 9, replacement_place_id: "vins", replaces_place_ids: ["coolidge-site"], nodes: ["burlington-lodging", "ben-jerrys-graveyard", "vins", "woodstock-lodging"] },
  { id: "replacement-d10-path-of-life", day: 10, replacement_place_id: "path-of-life", replaces_place_ids: ["american-precision"], nodes: ["woodstock-lodging", "quechee-gorge", "path-of-life", "saint-gaudens", "manchester-lodging"] },
  { id: "replacement-d11-see", day: 11, replacement_place_id: "see-science", replaces_place_ids: ["flw-houses", "currier-museum"], nodes: ["manchester-lodging", "see-science", "boston-logan-hotel"] }
];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "Portsmouth, NH", station: "USW00014764", station_role: "Portland-Portsmouth coastal proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Portland, ME", station: "USW00014764", station_role: "Portland airport" },
  { day: 3, date: "2026-10-06", sleep_city: "Rockland, ME", station: "USW00014764", station_role: "Portland-midcoast regional proxy" },
  { day: 4, date: "2026-10-07", sleep_city: "Bar Harbor, ME", station: "USW00014606", station_role: "Bangor-Mount Desert regional proxy" },
  { day: 5, date: "2026-10-08", sleep_city: "Bangor, ME", station: "USW00014606", station_role: "Bangor airport" },
  { day: 6, date: "2026-10-09", sleep_city: "Bethel, ME", station: "USW00014745", station_role: "Concord-western Maine regional proxy" },
  { day: 7, date: "2026-10-10", sleep_city: "Montpelier, VT", station: "USW00094705", station_role: "Montpelier airport" },
  { day: 8, date: "2026-10-11", sleep_city: "Burlington, VT", station: "USW00014742", station_role: "Burlington airport" },
  { day: 9, date: "2026-10-12", sleep_city: "Woodstock, VT", station: "USW00094765", station_role: "Lebanon-Woodstock regional proxy" },
  { day: 10, date: "2026-10-13", sleep_city: "Manchester, NH", station: "USW00014745", station_role: "Concord-Manchester regional proxy" },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", station: "USW00014739", station_role: "Boston Logan airport" }
];
