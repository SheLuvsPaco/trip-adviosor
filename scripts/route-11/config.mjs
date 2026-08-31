export const ROUTE_ID = "route-11";
export const ROUTE_SLUG = "route-11-hidden-halls-brass-nights-moonshot-run";
export const ROUTE_NAME = "The Hidden Halls, Brass Nights & Moonshot Run";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
export const premiumCapMinutes = 330;

const p = (id, geocode, images) => ({ id, geocode, images });

export const places = [
  p("yale-art-gallery", "Yale University Art Gallery, 1111 Chapel Street, New Haven, Connecticut", ["Yale University Art Gallery exterior", "Yale University Art Gallery interior collection", "Yale University Art Gallery Louis Kahn"]),
  p("ycba", "Yale Center for British Art, 1080 Chapel Street, New Haven, Connecticut", ["Yale Center for British Art exterior", "Yale Center for British Art Louis Kahn interior", "Yale Center for British Art galleries"]),
  p("barnes", "Barnes Foundation, 2025 Benjamin Franklin Parkway, Philadelphia, Pennsylvania", ["Barnes Foundation Philadelphia exterior", "Barnes Foundation collection galleries", "Barnes Foundation ensembles"]),
  p("calder-gardens", "Calder Gardens, 2100 Benjamin Franklin Parkway, Philadelphia, Pennsylvania", ["Calder Gardens Philadelphia Herzog de Meuron", "Calder Gardens Philadelphia interior", "Calder Gardens Piet Oudolf"]),
  p("baltimore-industry", "Baltimore Museum of Industry, 1415 Key Highway, Baltimore, Maryland", ["Baltimore Museum of Industry exterior", "Baltimore Museum of Industry interior", "Baltimore Museum of Industry working exhibits"]),
  p("peabody-library", "George Peabody Library, 17 East Mount Vernon Place, Baltimore, Maryland", ["George Peabody Library Baltimore interior", "George Peabody Library cast iron balconies", "George Peabody Library exterior"]),
  p("grand-caverns", "Grand Caverns, 5 Grand Caverns Drive, Grottoes, Virginia", ["Grand Caverns Virginia interior", "Grand Caverns Grottoes formations", "Grand Caverns Virginia shield formations"]),
  p("frontier-culture", "Frontier Culture Museum, 1290 Richmond Avenue, Staunton, Virginia", ["Frontier Culture Museum Staunton", "Frontier Culture Museum historic farms", "Frontier Culture Museum Virginia interpreters"]),
  p("birthplace-country-music", "Birthplace of Country Music Museum, 101 Country Music Way, Bristol, Virginia", ["Birthplace of Country Music Museum Bristol", "Birthplace Country Music Museum exhibits", "Bristol Sessions museum"]),
  p("gray-fossil", "Gray Fossil Site and Museum, 1212 Suncrest Drive, Gray, Tennessee", ["Gray Fossil Site museum Tennessee", "Gray Fossil Site dig", "Gray Fossil Site fossils"]),
  p("biltmore", "Biltmore Estate, 1 Lodge Street, Asheville, North Carolina", ["Biltmore Estate Asheville exterior", "Biltmore House interior", "Biltmore Gardens autumn"]),
  p("grovewood", "Grovewood Village, 111 Grovewood Road, Asheville, North Carolina", ["Grovewood Village Asheville", "Biltmore Industries Homespun Museum", "Estes Winn Antique Car Museum"]),
  p("boggs-metal-night", "Boggs Social and Supply, 1310 White Street Southwest, Atlanta, Georgia", ["Boggs Social and Supply Atlanta concert", "Sadness band live", "Atlanta metal concert"]),
  p("eji-legacy-sites", "Legacy Museum, 400 North Court Street, Montgomery, Alabama", ["Legacy Museum Montgomery exterior", "National Memorial for Peace and Justice", "Freedom Monument Sculpture Park Montgomery"]),
  p("fitzgerald-museum", "Scott and Zelda Fitzgerald Museum, 919 Felder Avenue, Montgomery, Alabama", ["Fitzgerald Museum Montgomery exterior", "Scott Zelda Fitzgerald Museum interior", "Fitzgerald Museum Montgomery house"]),
  p("annunciation-mobile", "Annunciation Greek Orthodox Church, 50 South Ann Street, Mobile, Alabama", ["Annunciation Greek Orthodox Church Mobile Alabama", "Annunciation Greek Orthodox Mobile interior", "Greek Orthodox church Mobile icons"]),
  p("walter-anderson-ocean-springs", "Walter Anderson Museum of Art, 510 Washington Avenue, Ocean Springs, Mississippi", ["Walter Anderson Museum Ocean Springs", "Walter Anderson Little Room murals", "Walter Anderson Museum Community Center murals"]),
  p("maritime-seafood-biloxi", "Maritime and Seafood Industry Museum, 115 1st Street, Biloxi, Mississippi", ["Maritime Seafood Industry Museum Biloxi", "Biloxi seafood museum Nydia boat", "Maritime Seafood Industry Museum Biloxi interior"]),
  p("whitney-plantation", "Whitney Plantation, 5099 Louisiana Highway 18, Wallace, Louisiana", ["Whitney Plantation memorial", "Whitney Plantation slave cabins", "Whitney Plantation Louisiana"]),
  p("mardi-gras-world", "Mardi Gras World, 1380 Port of New Orleans Place, New Orleans, Louisiana", ["Mardi Gras World float den", "Mardi Gras World artists", "Mardi Gras World New Orleans floats"]),
  p("frenchmen-music-night", "d.b.a. New Orleans, 618 Frenchmen Street, New Orleans, Louisiana", ["d.b.a. New Orleans live music", "Frenchmen Street New Orleans night", "New Orleans brass band Frenchmen Street"]),
  p("jamnola", "JAMNOLA, 940 Frenchmen Street, New Orleans, Louisiana", ["JAMNOLA New Orleans exhibits", "JAMNOLA immersive art", "JAMNOLA Frenchmen Street"]),
  p("st-louis-cemetery-1", "St. Louis Cemetery Number 1, 425 Basin Street, New Orleans, Louisiana", ["St Louis Cemetery Number 1 New Orleans", "St Louis Cemetery 1 tombs", "Marie Laveau tomb St Louis Cemetery"]),
  p("lake-martin-swamp", "Cajun Country Swamp Tours, 1209 Rookery Road, Breaux Bridge, Louisiana", ["Lake Martin Louisiana cypress swamp", "Cajun Country Swamp Tours boat", "Lake Martin alligator birds"]),
  p("avery-island", "TABASCO Factory and Jungle Gardens, 329 Avery Island Road, Avery Island, Louisiana", ["Tabasco factory Avery Island", "Jungle Gardens Avery Island", "Avery Island Buddha garden"]),
  p("space-center-houston", "Space Center Houston, 1601 East NASA Parkway, Houston, Texas", ["Space Center Houston", "NASA Johnson Space Center Mission Control", "Saturn V Rocket Park Houston"]),
  p("rothko-chapel", "Rothko Chapel, 3900 Yupon Street, Houston, Texas", ["Rothko Chapel Houston exterior", "Rothko Chapel interior", "Barnett Newman Broken Obelisk Rothko Chapel"]),
  p("buffalo-bayou-cistern", "Buffalo Bayou Park Cistern, 105 Sabine Street, Houston, Texas", ["Buffalo Bayou Park Cistern Houston", "Undercurrents Buffalo Bayou Cistern", "Houston Cistern columns"])
];

// Some exact interiors, current events and private collections do not have
// reusable Commons coverage. These records may use clearly labelled official
// editorial images for this private prototype only.
export const contextualImagePlaces = new Set([
  "barnes", "calder-gardens", "baltimore-industry", "birthplace-country-music",
  "gray-fossil", "grovewood", "boggs-metal-night", "eji-legacy-sites",
  "annunciation-mobile", "walter-anderson-ocean-springs", "whitney-plantation",
  "mardi-gras-world", "frenchmen-music-night", "jamnola", "lake-martin-swamp",
  "avery-island", "space-center-houston", "buffalo-bayou-cistern"
]);

export const preferredCommonsFiles = {};

// Exact visitor entrances where they are stable and known. Other coordinates
// are selected from the saved Nominatim candidates and visually checked.
export const manualCoordinates = {
  "yale-art-gallery": [-72.93077, 41.30832],
  "ycba": [-72.93110, 41.30797],
  "barnes": [-75.17308, 39.96064],
  "calder-gardens": [-75.17450, 39.96114],
  "baltimore-industry": [-76.60102, 39.27384],
  "peabody-library": [-76.61545, 39.29703],
  "grand-caverns": [-78.82018, 38.26670],
  "frontier-culture": [-79.04566, 38.14584],
  "birthplace-country-music": [-82.18261, 36.59645],
  "gray-fossil": [-82.47912, 36.39090],
  "biltmore": [-82.55214, 35.54093],
  "grovewood": [-82.54248, 35.62042],
  "boggs-metal-night": [-84.43144, 33.73205],
  "eji-legacy-sites": [-86.31077, 32.38268],
  "fitzgerald-museum": [-86.29216, 32.35620],
  "annunciation-mobile": [-88.07806, 30.68905],
  "walter-anderson-ocean-springs": [-88.82728, 30.41229],
  "maritime-seafood-biloxi": [-88.86473, 30.39180],
  "whitney-plantation": [-90.66102, 30.02952],
  "mardi-gras-world": [-90.06130, 29.93477],
  "frenchmen-music-night": [-90.05836, 29.96436],
  "jamnola": [-90.05372, 29.96462],
  "st-louis-cemetery-1": [-90.07104, 29.95938],
  "lake-martin-swamp": [-91.89604, 30.22458],
  "avery-island": [-91.90624, 29.91155],
  "space-center-houston": [-95.09796, 29.55187],
  "rothko-chapel": [-95.39644, 29.73756],
  "buffalo-bayou-cistern": [-95.37634, 29.76300]
};

export const lodgingNodes = {
  "boston-logan-rental": { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
  "new-haven-lodging": { name: "Downtown New Haven/Yale lodging zone", coordinates: [-72.9287, 41.3068] },
  "philadelphia-lodging": { name: "Logan Square/Parkway lodging zone", coordinates: [-75.1718, 39.9577] },
  "shepherdstown-lodging": { name: "Historic Shepherdstown lodging zone", coordinates: [-77.8048, 39.4301] },
  "roanoke-lodging": { name: "Downtown Roanoke lodging zone", coordinates: [-79.9510, 37.2760] },
  "asheville-lodging": { name: "Central Asheville lodging zone", coordinates: [-82.5515, 35.5951] },
  "atlanta-lodging": { name: "Midtown/Old Fourth Ward lodging zone", coordinates: [-84.3722, 33.7802] },
  "greenville-lodging": { name: "Greenville, Alabama lodging zone", coordinates: [-86.6178, 31.8296] },
  "new-orleans-lodging": { name: "Warehouse District/Lower Garden lodging zone", coordinates: [-90.0732, 29.9430] },
  "lafayette-lodging": { name: "Downtown Lafayette lodging zone", coordinates: [-92.0180, 30.2241] },
  "houston-lodging": { name: "Montrose/Museum District lodging zone", coordinates: [-95.3890, 29.7310] }
};

export const manualLegs = {};

export const dayRoutes = [
  { day: 1, risk: "high", node_ids: ["boston-logan-rental", "ycba", "yale-art-gallery", "new-haven-lodging"] },
  { day: 2, risk: "high", node_ids: ["new-haven-lodging", "barnes", "calder-gardens", "philadelphia-lodging"] },
  { day: 3, risk: "high", node_ids: ["philadelphia-lodging", "baltimore-industry", "peabody-library", "shepherdstown-lodging"] },
  { day: 4, risk: "medium", node_ids: ["shepherdstown-lodging", "grand-caverns", "frontier-culture", "roanoke-lodging"] },
  { day: 5, risk: "medium", node_ids: ["roanoke-lodging", "birthplace-country-music", "gray-fossil", "asheville-lodging"] },
  { day: 6, risk: "high", node_ids: ["asheville-lodging", "biltmore", "grovewood", "boggs-metal-night", "atlanta-lodging"] },
  { day: 7, risk: "medium", node_ids: ["atlanta-lodging", "fitzgerald-museum", "eji-legacy-sites", "greenville-lodging"] },
  { day: 8, risk: "high", node_ids: ["greenville-lodging", "annunciation-mobile", "walter-anderson-ocean-springs", "maritime-seafood-biloxi", "new-orleans-lodging"] },
  { day: 9, risk: "medium", node_ids: ["new-orleans-lodging", "whitney-plantation", "mardi-gras-world", "jamnola", "frenchmen-music-night", "new-orleans-lodging"] },
  { day: 10, risk: "medium", node_ids: ["new-orleans-lodging", "st-louis-cemetery-1", "avery-island", "lake-martin-swamp", "lafayette-lodging"] },
  { day: 11, risk: "high", node_ids: ["lafayette-lodging", "space-center-houston", "buffalo-bayou-cistern", "rothko-chapel", "houston-lodging"] }
];

// Kept as an audit trail. These former swaps are now measured main stops.
export const formerReplacementVariants = [
  { id: "replacement-d1-ycba", day: 1, replacement_place_id: "ycba", replaces_place_ids: ["yale-art-gallery"], nodes: ["boston-logan-rental", "ycba", "new-haven-lodging"] },
  { id: "replacement-d2-calder", day: 2, replacement_place_id: "calder-gardens", replaces_place_ids: ["barnes"], nodes: ["new-haven-lodging", "calder-gardens", "philadelphia-lodging"] },
  { id: "replacement-d3-peabody", day: 3, replacement_place_id: "peabody-library", replaces_place_ids: ["baltimore-industry"], nodes: ["philadelphia-lodging", "peabody-library", "shepherdstown-lodging"] },
  { id: "replacement-d4-frontier", day: 4, replacement_place_id: "frontier-culture", replaces_place_ids: ["grand-caverns"], nodes: ["shepherdstown-lodging", "frontier-culture", "roanoke-lodging"] },
  { id: "replacement-d5-gray", day: 5, replacement_place_id: "gray-fossil", replaces_place_ids: ["birthplace-country-music"], nodes: ["roanoke-lodging", "gray-fossil", "asheville-lodging"] },
  { id: "replacement-d6-grovewood", day: 6, replacement_place_id: "grovewood", replaces_place_ids: ["biltmore"], nodes: ["asheville-lodging", "grovewood", "boggs-metal-night", "atlanta-lodging"] },
  { id: "replacement-d7-fitzgerald", day: 7, replacement_place_id: "fitzgerald-museum", replaces_place_ids: ["eji-legacy-sites"], nodes: ["atlanta-lodging", "fitzgerald-museum", "greenville-lodging"] },
  { id: "replacement-d8-maritime-seafood", day: 8, replacement_place_id: "maritime-seafood-biloxi", replaces_place_ids: ["walter-anderson-ocean-springs"], nodes: ["greenville-lodging", "annunciation-mobile", "maritime-seafood-biloxi", "new-orleans-lodging"] },
  { id: "replacement-d9-jamnola", day: 9, replacement_place_id: "jamnola", replaces_place_ids: ["mardi-gras-world"], nodes: ["new-orleans-lodging", "whitney-plantation", "jamnola", "frenchmen-music-night", "new-orleans-lodging"] },
  { id: "replacement-d10-avery", day: 10, replacement_place_id: "avery-island", replaces_place_ids: ["st-louis-cemetery-1", "lake-martin-swamp"], nodes: ["new-orleans-lodging", "avery-island", "lafayette-lodging"] },
  { id: "replacement-d11-cistern", day: 11, replacement_place_id: "buffalo-bayou-cistern", replaces_place_ids: ["space-center-houston"], nodes: ["lafayette-lodging", "buffalo-bayou-cistern", "rothko-chapel", "houston-lodging"] }
];

export const replacementVariants = [];

export const weatherRequests = [
  { day: 1, date: "2026-10-04", sleep_city: "New Haven, CT", station: "USW00094702", station_role: "Bridgeport-New Haven coastal proxy" },
  { day: 2, date: "2026-10-05", sleep_city: "Philadelphia, PA", station: "USW00013739", station_role: "Philadelphia International Airport" },
  { day: 3, date: "2026-10-06", sleep_city: "Shepherdstown, WV", station: "USW00093738", station_role: "Washington Dulles-Shepherdstown regional proxy" },
  { day: 4, date: "2026-10-07", sleep_city: "Roanoke, VA", station: "USW00013741", station_role: "Roanoke Airport" },
  { day: 5, date: "2026-10-08", sleep_city: "Asheville, NC", station: "USW00003812", station_role: "Asheville Regional Airport" },
  { day: 6, date: "2026-10-09", sleep_city: "Atlanta, GA", station: "USW00013874", station_role: "Atlanta Hartsfield Airport" },
  { day: 7, date: "2026-10-10", sleep_city: "Greenville, AL", station: "USW00013895", station_role: "Montgomery-Greenville regional proxy" },
  { day: 8, date: "2026-10-11", sleep_city: "New Orleans, LA", station: "USW00012916", station_role: "New Orleans International Airport" },
  { day: 9, date: "2026-10-12", sleep_city: "New Orleans, LA", station: "USW00012916", station_role: "New Orleans International Airport" },
  { day: 10, date: "2026-10-13", sleep_city: "Lafayette, LA", station: "USW00013976", station_role: "Lafayette Regional Airport" },
  { day: 11, date: "2026-10-14", sleep_city: "Houston, TX", station: "USW00012918", station_role: "Houston Hobby Airport" }
];
