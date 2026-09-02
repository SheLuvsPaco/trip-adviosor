// Route 09 Energy Rebuild V2 — "Private Universes & Impossible Mechanisms".
//
// Source brief: Energy Rebuild Routes/Route09_Private_Universes_Rebuild_With_Costs.md
//
// Route 09's research pass had already landed all 52 brief places into the package, but every one of
// them was marked core and scheduled, the day options were empty, and the eleven legacy replacement
// variants pointed at places the expansion had removed. This rebuild does the classification work:
// 23 active core experiences, 29 documented options attached to their days, and the legacy
// one-for-one replacement model retired the way routes 05-08 retired theirs.

export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
export const VERIFIED_AT = "2026-09-01";
export const ROUTE_DNA = "PRIVATE UNIVERSES × IMPOSSIBLE MECHANISMS × ONE-PERSON WORLDS";

// The 23 active core experiences, in itinerary order. This list is the single source of truth for
// what is scheduled; scripts/route-09/config.mjs dayRoutes already routes exactly these.
export const CORE_IDS = [
  "keystone-arches", "art-omi",
  "opus-40", "rail-explorers-express",
  "worlds-end",
  "bilgers-rocks", "scripture-rocks",
  "bayernhof", "palace-of-gold",
  "alan-cottrill", "otherworld",
  "faustus-escape", "warther-museum", "grove-city-outlets",
  "st-nicholas-orthodox", "parker-dam", "bellefonte-talleyrand",
  "hickory-run-boulder-field", "skirmish-paintball", "columcille",
  "fonthill-castle", "northlandz",
  "puzzle-theory-spectral"
];

// Brief §7 category split across the 23 core spots.
export const BUCKETS = {
  "creator-built-obsessive-worlds": ["opus-40", "scripture-rocks", "bayernhof", "alan-cottrill", "otherworld", "warther-museum", "fonthill-castle", "northlandz"],
  "nature-active-terrain": ["keystone-arches", "worlds-end", "bilgers-rocks", "parker-dam", "hickory-run-boulder-field"],
  "brain-puzzle-competition": ["faustus-escape", "skirmish-paintball", "puzzle-theory-spectral"],
  "sacred-visionary-environments": ["palace-of-gold", "st-nicholas-orthodox", "columcille"],
  "landscape-scale-art-perception": ["art-omi"],
  "unusual-movement-rail-machine": ["rail-explorers-express"],
  "shopping": ["grove-city-outlets"],
  "town-mental-reset": ["bellefonte-talleyrand"]
};

// Brief §9 texture families. The brief pairs them (AWE / EXPLORE); the package stores one primary
// texture per place, distributed so each family total matches the brief.
export const TEXTURES = {
  "art-omi": "AWE", "opus-40": "AWE", "palace-of-gold": "AWE", "northlandz": "AWE",
  "scripture-rocks": "EXPLORE", "bayernhof": "EXPLORE", "otherworld": "EXPLORE", "fonthill-castle": "EXPLORE",
  "keystone-arches": "MOVE", "rail-explorers-express": "MOVE", "hickory-run-boulder-field": "MOVE",
  "worlds-end": "WILD", "bilgers-rocks": "WILD", "parker-dam": "WILD",
  "faustus-escape": "SOLVE", "puzzle-theory-spectral": "SOLVE",
  "skirmish-paintball": "COMPETE",
  "alan-cottrill": "DISCOVER",
  "warther-museum": "WEIRD",
  "st-nicholas-orthodox": "WORSHIP",
  "columcille": "CONTEMPLATE",
  "grove-city-outlets": "SHOP",
  "bellefonte-talleyrand": "RELAX"
};

// Brief §8: 0 of 23 are passive display-case museums. These four are the transparency flag — indoor
// curated environments where the building, creator or machinery is itself the experience.
export const MUSEUM_LIKE_IDS = new Set(["bayernhof", "warther-museum", "fonthill-castle", "northlandz"]);

// Brief §14 price table. low/high are per person USD.
export const PRICES = {
  "keystone-arches": { low: 0, high: 0, type: "free" },
  "art-omi": { low: 0, high: 0, type: "free-donation", note: "No required admission; suggested donation about $15 per person." },
  "opus-40": { low: 20, high: 20, type: "paid", group: 80 },
  "rail-explorers-express": { low: 33.75, high: 33.75, type: "group-product", group: 135, note: "Sold as a quad railbike from $135; $33.75 per person for four." },
  "worlds-end": { low: 0, high: 0, type: "free" },
  "bilgers-rocks": { low: 0, high: 0, type: "free-donation" },
  "scripture-rocks": { low: 0, high: 0, type: "free-donation" },
  "bayernhof": { low: 10, high: 10, type: "paid", group: 40 },
  "palace-of-gold": { low: 12, high: 12, type: "paid", note: "Current tour model about $12 per person; recheck the official booking page." },
  "alan-cottrill": { low: 0, high: 0, type: "free-model", note: "No normal admission currently published; modelled at $0 and flagged to verify before departure." },
  "otherworld": { low: 30, high: 30, type: "paid", group: 120 },
  "faustus-escape": { low: 20, high: 28, type: "variable", note: "Evidence sits near $20-28 per person; the $28 ceiling holds until Oct 10 booking inventory locks." },
  "warther-museum": { low: 20, high: 20, type: "paid", group: 80 },
  "grove-city-outlets": { low: 0, high: 0, type: "free", note: "Free admission. Shopping spend is deliberately excluded from the route total." },
  "st-nicholas-orthodox": { low: 0, high: 0, type: "free" },
  "parker-dam": { low: 0, high: 0, type: "free" },
  "bellefonte-talleyrand": { low: 0, high: 0, type: "free" },
  "hickory-run-boulder-field": { low: 0, high: 0, type: "free" },
  "skirmish-paintball": { low: 21.5, high: 73.5, type: "variable", group: 86, note: "Oct 12 half-price preregistration is $21.50 per person. The high figure adds a conservative 1,000-round paint budget of about $52 per person, which is optional." },
  "columcille": { low: 0, high: 0, type: "free-donation" },
  "fonthill-castle": { low: 20, high: 20, type: "paid", group: 80 },
  "northlandz": { low: 33.75, high: 33.75, type: "group-product", group: 135, note: "Group-of-four indoor ticket at $135 total; recheck the current group product." },
  "puzzle-theory-spectral": { low: 29, high: 35, type: "variable", note: "Listings sit around $29-30 per person; $35 is held as a conservative ceiling until the Oct 14 checkout opens." }
};

// The 29 documented options, mapped to the day they attach to. Roles follow the brief's own labels.
export const NON_CORE = {
  "worlds-largest-kaleidoscope": { day: 2, role: "flex" },
  "rail-explorers-river-run": { day: 2, role: "optional-swap", replaces: "rail-explorers-express" },
  "kaaterskill-falls": { day: 2, role: "optional" },
  "saugerties-lighthouse": { day: 2, role: "optional" },
  "spiral-house-park": { day: 2, role: "conditional" },
  "roebling-aqueduct": { day: 3, role: "optional" },
  "hawks-nest": { day: 3, role: "flex" },
  "ricketts-glen": { day: 3, role: "optional" },
  "elk-country-visitor-center": { day: 4, role: "optional" },
  "kinzua-bridge": { day: 4, role: "optional" },
  "austin-dam": { day: 4, role: "optional" },
  "cook-forest-cathedral": { day: 4, role: "optional" },
  "troy-hill-lighthouse": { day: 5, role: "conditional" },
  "troy-hill-hutte-royal": { day: 5, role: "conditional" },
  "troy-hill-kunzhaus": { day: 5, role: "conditional" },
  "troy-hill-mrs-christopher": { day: 5, role: "conditional" },
  "gamegrounds-columbus": { day: 6, role: "optional" },
  "book-loft": { day: 6, role: "flex" },
  "y-bridge": { day: 6, role: "flex" },
  "captivating-worlds-machine": { day: 7, role: "optional-swap", replaces: "faustus-escape" },
  "hartman-rock-garden": { day: 7, role: "optional" },
  "penns-cave": { day: 8, role: "optional" },
  "lakota-wolf": { day: 10, role: "optional" },
  "luna-parc": { day: 10, role: "conditional" },
  "tarrywile": { day: 10, role: "flex" },
  "ramapo-valley": { day: 10, role: "structural-flex" },
  "optical-heritage-museum": { day: 11, role: "optional" },
  "puzzle-theory-kraken": { day: 11, role: "optional-swap", replaces: "puzzle-theory-spectral" },
  "harvard-natural-history": { day: 11, role: "optional" }
};

export const DAY_DATES = ["2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09",
  "2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13", "2026-10-14"];

// Measured OSRM totals exceed 270 on three days. Each long total is made of legs that are all capped
// by a real stop, so the day is authorised rather than silently over cap.
export const CAP_EXCEPTIONS = {
  7: { minutes: 305, reason: "Columbus to West Middlesex is a fixed three-anchor transfer day. Measured at 299 minutes, its longest single run is 136 minutes and every leg ends at a real stop, so the total is authorised rather than reduced by dropping an anchor." },
  8: { minutes: 285, reason: "A documented Clarion comfort break splits what OSRM measured as a 161-minute Warren-to-Parker Dam run. The break costs eight minutes of total driving and buys a 99-minute longest leg, which is the trade the uninterrupted ceiling exists to make." },
  10: { minutes: 310, reason: "The brief gates Flemington to Danbury as traffic-sensitive at roughly 2h26 direct. A documented Mahwah break splits it into 88 and 84 minutes; the resulting 300-minute total is authorised so the split is structural rather than left to a live-traffic decision." }
};

// Day themes and sleep cities from the brief's day-by-day itinerary.
export const DAY_PLANS = [
  { day: 1, sleep_city: "Ghent / Hudson, NY", theme: "Stone arches in the Berkshires, then landscape-scale art" },
  { day: 2, sleep_city: "Hancock, NY", theme: "A quarry turned earthwork, then a pedal machine through the Catskills" },
  { day: 3, sleep_city: "Williamsport, PA", theme: "Gorge, waterfall and rock at Worlds End" },
  { day: 4, sleep_city: "Brookville, PA", theme: "A sandstone rock city, then one man's theology carved into the forest" },
  { day: 5, sleep_city: "Wheeling, WV", theme: "The secret machine mansion, then hand-built sacred maximalism" },
  { day: 6, sleep_city: "Columbus, OH", theme: "A working bronze studio, then a surreal labyrinth" },
  { day: 7, sleep_city: "West Middlesex, PA", theme: "Elite puzzle room, a lifetime of carving, and the route's one shopping block" },
  { day: 8, sleep_city: "Bellefonte, PA", theme: "Orthodox Sunday in Warren, forest reset, Victorian small town" },
  { day: 9, sleep_city: "Bangor / Stroudsburg, PA", theme: "Boulder field, exact-date paintball, megalith sanctuary" },
  { day: 10, sleep_city: "Danbury, CT", theme: "A concrete castle, then a miniature universe" },
  { day: 11, sleep_city: "Boston, MA", theme: "The puzzle finale, then Logan" }
];
