// Real imagery for the 30 Route 06 places that were still showing cloned
// "regional-context-not-exact-place" placeholders borrowed from other venues.
//
// Commons search ANDs every term, so those queries stay short. DDG covers the commercial venues
// (haunts, escape rooms, ATV operators, outlet centres) that Commons does not.
//
// Same-venue variants — the four TALA tours, the three West Virginia Penitentiary products, the two
// Braxxie hunts — deliberately run the same query. Each card then picks different frames off the
// shared contact sheet so no two cards show an identical file.

export const queries = {
  /* ---- core ---- */
  "old-new-gate": { query: "Old New-Gate Prison", source: "commons" },
  "reading-pagoda": { query: "Reading Pagoda", source: "commons" },
  "pike2bike-rays-hill": { query: "Abandoned Pennsylvania Turnpike Rays Hill tunnel", source: "ddg" },
  "carrie-blast-furnaces": { query: "Carrie Furnace", source: "commons" },
  "troy-hill-art-houses": { query: "Troy Hill Pittsburgh art house La Hutte Royal", source: "ddg" },
  "maxo-vanka-murals": { query: "Maxo Vanka murals Millvale", source: "commons" },
  "wv-penitentiary": { query: "West Virginia Penitentiary", source: "commons" },
  "fort-boreman": { query: "Fort Boreman Park Parkersburg West Virginia", source: "ddg" },
  "mothman-tnt-tour": { query: "TNT area Point Pleasant West Virginia igloo bunker", source: "ddg" },
  "braxxie-chair-hunt": { query: "Flatwoods Monster Braxxie chair Braxton County West Virginia", source: "ddg" },
  "coopers-rock-clay-furnace": { query: "Coopers Rock State Forest", source: "commons" },
  "sideling-hill-road-cut": { query: "Sideling Hill Maryland road cut", source: "commons" },
  "fort-hunter-rockville-bridge": { query: "Rockville Bridge Pennsylvania", source: "commons" },
  "pocono-premium-outlets": { query: "Pocono Premium Outlets Tannersville Pennsylvania", source: "ddg" },
  "dana-common": { query: "Dana Massachusetts Quabbin common", source: "ddg" },

  /* ---- options ---- */
  "ruins-project": { query: "The Ruins Project Whitsett Pennsylvania mosaic coal mine", source: "ddg" },
  "imaginarium-minds-eye": { query: "Enter the Imaginarium escape room Pennsylvania", source: "ddg" },
  "hundred-acres-manor": { query: "Hundred Acres Manor haunted house Pittsburgh", source: "ddg" },
  "wv-pen-dungeon": { query: "West Virginia Penitentiary", source: "commons" },
  "wv-pen-escape": { query: "West Virginia Penitentiary", source: "commons" },
  "palace-of-gold": { query: "Prabhupada Palace of Gold", source: "commons" },
  "blennerhassett-candlelight": { query: "Blennerhassett Mansion", source: "commons" },
  "mountwood-atv": { query: "Mountwood Park ATV trails West Virginia", source: "ddg" },
  "free-braxxie-challenge": { query: "Flatwoods Monster Braxxie chair Braxton County West Virginia", source: "ddg" },
  "jq-dickinson-salt": { query: "J.Q. Dickinson Salt Works West Virginia", source: "ddg" },
  "tala-four-floor": { query: "Trans-Allegheny Lunatic Asylum", source: "commons" },
  "tala-hysteria": { query: "Trans-Allegheny Lunatic Asylum", source: "commons" },
  "tala-paranormal": { query: "Trans-Allegheny Lunatic Asylum", source: "commons" },
  "tala-ghost-hunt": { query: "Trans-Allegheny Lunatic Asylum", source: "commons" },
  "sideling-hill-creek": { query: "Sideling Hill Creek Maryland Potomac", source: "ddg" }
};
