// Search queries for the 38 places the Route 10 rebuild introduces. The 24 V1 places keep the
// images already in the package.
//
// source: "commons" - production_usable:true with a real licence. Commons search ANDs every term,
//                     so these stay short; a descriptive sentence reliably returns zero results.
// source: "ddg"     - the only realistic source for escape rooms, kart tracks, factory tours,
//                     outlet centres and UTV operators. Everything it returns is rights-gated.

export const queries = {
  /* ---- new core ---- */
  "old-new-gate": { query: "Old New-Gate Prison", source: "commons" },
  "herrs": { query: "Herr's Snack Factory tour Nottingham Pennsylvania", source: "ddg" },
  "game-show-rush-hour": { query: "Rush Hour game show Fredericksburg Virginia", source: "ddg" },
  "belle-isle": { query: "Belle Isle Richmond Virginia", source: "commons" },
  "gnome-raven": { query: "Gnome and Raven escape room Richmond Virginia", source: "ddg" },
  "vir-kart": { query: "Virginia International Raceway kart track karting", source: "ddg" },
  "natural-chimneys": { query: "Natural Chimneys", source: "commons" },
  "st-mary-orthodox": { query: "Saint Mary Orthodox Church Chambersburg Pennsylvania", source: "ddg" },
  "ebt-shop": { query: "East Broad Top Railroad shops", source: "commons" },
  "ebt-steam": { query: "East Broad Top Railroad", source: "commons" },
  "martin-guitar": { query: "Martin Guitar factory Nazareth", source: "commons" },
  "hickory-run-boulder-field": { query: "Hickory Run State Park Boulder Field", source: "commons" },
  "pocono-outlets": { query: "Pocono Premium Outlets Tannersville Pennsylvania", source: "ddg" },
  "thirteenth-hour": { query: "13th Hour Escape Rooms New Jersey room set players", source: "ddg" },
  "mine-hill-preserve": { query: "Mine Hill Preserve Roxbury Connecticut", source: "ddg" },

  /* ---- new options ---- */
  "bell-works": { query: "Bell Labs Holmdel", source: "commons" },
  "puzzleconnect": { query: "PuzzleConnect escape room New Jersey", source: "ddg" },
  "brandywine-creek-sp": { query: "Brandywine Creek State Park", source: "commons" },
  "cryptologic-museum": { query: "National Cryptologic Museum", source: "commons" },
  "port-of-falmouth": { query: "Falmouth Virginia Rappahannock", source: "commons" },
  "gnome-raven-alt": { query: "Gnome and Raven Shipwrecked escape room Richmond", source: "ddg" },
  "tredegar-riverfront": { query: "Tredegar Iron Works", source: "commons" },
  "danville-science": { query: "Danville Science Center Virginia", source: "ddg" },
  "danville-river-district": { query: "Danville Virginia tobacco warehouse district", source: "ddg" },
  "black-dog-salvage": { query: "Black Dog Salvage Roanoke Virginia", source: "ddg" },
  "explore-park-mtb": { query: "Explore Park Roanoke mountain biking trails", source: "ddg" },
  "explore-park-treetop": { query: "Treetop Quest Explore Park Roanoke aerial course", source: "ddg" },
  "reddish-knob": { query: "Reddish Knob", source: "commons" },
  "rockhill-trolley": { query: "Rockhill Trolley Museum", source: "commons" },
  "pine-grove-furnace": { query: "Pine Grove Furnace", source: "commons" },
  "kings-gap": { query: "Kings Gap Mansion Carlisle Pennsylvania", source: "ddg" },
  "trough-creek": { query: "Trough Creek State Park", source: "commons" },
  "raystown-allegrippis": { query: "Allegrippis Trails Raystown Lake mountain biking", source: "ddg" },
  "yuengling-brewery": { query: "Yuengling Brewery Pottsville", source: "commons" },
  "skirmish-paintball": { query: "Skirmish Paintball Albrightsville Pennsylvania", source: "ddg" },
  "pocono-utv": { query: "Pocono UTV tour side by side Pennsylvania", source: "ddg" },
  "bushkill-falls": { query: "Bushkill Falls", source: "commons" },
  "five-wits": { query: "5 Wits West Nyack interactive adventure", source: "ddg" }
};
