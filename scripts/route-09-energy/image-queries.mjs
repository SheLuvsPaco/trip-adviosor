// Search queries for the 34 Route 09 places whose carousels were pointing at a single shared
// placeholder file (a Keystone Arch Bridges photo reused as the local file for 100 image records).
//
// source: "commons" - Wikimedia Commons. Slower, but ships production_usable:true with a licence.
//                     Commons search ANDs every term, so these queries stay short: a full
//                     descriptive sentence reliably returns zero results.
//                     Used for state parks, natural landmarks and listed buildings, which Commons
//                     covers well.
// source: "ddg"     - DuckDuckGo. Fast and broad, and the only realistic source for escape rooms,
//                     paintball fields, private art houses and other commercial venues. Everything
//                     it returns is rights-gated (production_usable:false).

export const queries = {
  // ---- core ----
  "keystone-arches": { query: "Keystone Arch Bridges Trail Chester Massachusetts stone railroad bridge", source: "ddg" },
  "rail-explorers-express": { query: "Rail Explorers Catskills railbike Phoenicia New York", source: "ddg" },
  "bilgers-rocks": { query: "Bilgers Rocks Grampian Pennsylvania rock formations passages", source: "ddg" },
  "faustus-escape": { query: "Captivating Worlds escape room New Albany Ohio Doctor Faustus", source: "ddg" },
  "st-nicholas-orthodox": { query: "Saint Nicholas Orthodox Church Warren Ohio", source: "ddg" },
  "hickory-run-boulder-field": { query: "Hickory Run State Park Boulder Field Pennsylvania", source: "commons" },
  "skirmish-paintball": { query: "Skirmish Paintball Albrightsville Pennsylvania field players", source: "ddg" },
  "fonthill-castle": { query: "Fonthill Castle", source: "commons" },
  "northlandz": { query: "Northlandz Flemington New Jersey miniature railroad", source: "ddg" },
  "puzzle-theory-spectral": { query: "Puzzle Theory escape room South Windsor Connecticut", source: "ddg" },

  // ---- options ----
  "kaaterskill-falls": { query: "Kaaterskill Falls", source: "commons" },
  "saugerties-lighthouse": { query: "Saugerties Lighthouse Hudson River New York", source: "commons" },
  "spiral-house-park": { query: "Spiral House Saugerties New York artist built sculpture", source: "ddg" },
  "roebling-aqueduct": { query: "Roebling Delaware Aqueduct Lackawaxen suspension bridge", source: "commons" },
  "hawks-nest": { query: "Hawks Nest New York", source: "commons" },
  "ricketts-glen": { query: "Ricketts Glen State Park Falls Trail waterfall Pennsylvania", source: "commons" },
  "elk-country-visitor-center": { query: "Elk Country Visitor Center Benezette Pennsylvania elk viewing", source: "ddg" },
  "kinzua-bridge": { query: "Kinzua Bridge", source: "commons" },
  "austin-dam": { query: "Austin Dam", source: "commons" },
  "penns-cave": { query: "Penns Cave", source: "commons" },
  "troy-hill-lighthouse": { query: "Darkhouse Lighthouse Troy Hill Pittsburgh art house", source: "ddg" },
  "troy-hill-hutte-royal": { query: "La Hutte Royal Troy Hill Pittsburgh Thorsten Brinkmann", source: "ddg" },
  "troy-hill-kunzhaus": { query: "Kunzhaus Troy Hill Pittsburgh art house photography", source: "ddg" },
  "troy-hill-mrs-christopher": { query: "Mrs Christophers House Mark Dion Troy Hill Pittsburgh", source: "ddg" },
  "gamegrounds-columbus": { query: "Gamegrounds Columbus Ohio interactive game rooms", source: "ddg" },
  "captivating-worlds-machine": { query: "Captivating Worlds Welcome to the Machine escape room New Albany Ohio", source: "ddg" },
  "book-loft": { query: "Book Loft German Village Columbus Ohio bookstore rooms", source: "ddg" },
  "hartman-rock-garden": { query: "Hartman Rock Garden", source: "commons" },
  "cook-forest-cathedral": { query: "Cook Forest State Park", source: "commons" },
  "lakota-wolf": { query: "Lakota Wolf Preserve Columbia New Jersey wolves", source: "ddg" },
  "luna-parc": { query: "Luna Parc Ricky Boscarino Sandyston New Jersey mosaic house", source: "ddg" },
  "optical-heritage-museum": { query: "Optical Heritage Museum Southbridge Massachusetts eyeglasses", source: "ddg" },
  "puzzle-theory-kraken": { query: "Puzzle Theory Middletown Connecticut escape room Krakens Revenge", source: "ddg" },
  "ramapo-valley": { query: "Ramapo Valley County Reservation", source: "commons" }
};
