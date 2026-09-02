// Real imagery for the 23 Route 07 places that were still showing cloned
// "regional-context-not-exact-place" placeholders borrowed from other venues.
//
// Commons search ANDs every term, so those queries stay short. DDG covers arcades, escape rooms,
// indoor bike parks and outlet centres, which Commons does not photograph.
//
// The two Perplexity Games rooms and the two Buffalo RiverWorks activities share a venue and so
// share a query; each card then picks different frames off the shared contact sheet.

export const queries = {
  /* ---- core ---- */
  "naismith-center-court": { query: "Naismith Memorial Basketball Hall of Fame", source: "commons" },
  "erie-canal-lock-e20": { query: "Erie Canal Lock 20 Marcy New York", source: "ddg" },
  "five-wits-syracuse": { query: "5 Wits Syracuse interactive adventure", source: "ddg" },
  "strong-museum-play": { query: "Strong National Museum of Play Rochester", source: "commons" },
  "high-falls-pont-de-rennes": { query: "High Falls Rochester", source: "commons" },
  "riverworks-racing-zipline": { query: "Buffalo RiverWorks zipline silos", source: "ddg" },
  "presque-isle-movement": { query: "Presque Isle State Park", source: "commons" },
  "superelectric-pinball": { query: "Superelectric Pinball Parlor Cleveland", source: "ddg" },
  "rays-bike-park": { query: "Rays Indoor Mountain Bike Park Cleveland", source: "ddg" },
  "st-nicholas-pittsburgh": { query: "Saint Nicholas Greek Orthodox Cathedral Pittsburgh", source: "ddg" },
  "carrie-graffiti": { query: "Carrie Furnace", source: "commons" },
  "old-pa-pike-rays-hill": { query: "Abandoned Pennsylvania Turnpike Rays Hill tunnel", source: "ddg" },
  "hershey-candy-bar": { query: "Hershey's Chocolate World Hershey Pennsylvania", source: "ddg" },
  "martin-guitar": { query: "Martin Guitar factory Nazareth", source: "commons" },
  "pocono-premium-outlets": { query: "Pocono Premium Outlets Tannersville Pennsylvania", source: "ddg" },
  "raymondskill-falls": { query: "Raymondskill Falls", source: "commons" },
  "westville-grand-trunk": { query: "Westville Lake Southbridge Massachusetts", source: "ddg" },
  "f1-arcade-boston": { query: "F1 Arcade Boston racing simulators", source: "ddg" },

  /* ---- options ---- */
  "riverworks-high-ropes": { query: "Buffalo RiverWorks high ropes course", source: "ddg" },
  "herschell-carrousel": { query: "Herschell Carrousel Factory Museum", source: "commons" },
  "escape-city-hangover": { query: "Escape City Buffalo escape room", source: "ddg" },
  "perplexity-eliot-ness": { query: "Perplexity Games Cleveland escape room", source: "ddg" },
  "perplexity-clockwork-caper": { query: "Perplexity Games Cleveland escape room", source: "ddg" }
};
