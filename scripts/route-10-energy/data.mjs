// Route 10 Energy Rebuild V2 — "The Temples, Follies & Working Machines Loop — Forces Rebuild".
//
// Source brief: Energy Rebuild Routes/Route10_Temples_Follies_Working_Machines_Forces_Rebuild.md
//
// The V1 package scheduled 24 places, 14 of them (58.3%) museum/gallery or historic-site cards. The
// rebuild keeps eight of those, archives three, demotes the rest to documented options, and adds 38
// new places built around physical systems and materials: mines, powder yards, production lines,
// quarries, kart tracks, machine shops, live steam, boulder fields and pumping engines.

export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
export const VERIFIED_AT = "2026-09-01";
export const ROUTE_DNA = "FORCES MADE VISIBLE × WORKING MACHINES × STONE AND TERRAIN";

// 23 active core experiences, in itinerary order.
export const CORE_IDS = [
  "old-new-gate",
  "baps-akshardham",
  "hagley", "herrs",
  "government-island", "game-show-rush-hour", "belle-isle",
  "gnome-raven", "vir-kart",
  "virginia-transportation", "roanoke-pinball", "roanoke-star",
  "natural-chimneys",
  "st-mary-orthodox", "ebt-shop", "ebt-steam",
  "martin-guitar", "hickory-run-boulder-field",
  "pocono-outlets", "pyramid-mountain", "thirteenth-hour",
  "mine-hill-preserve", "waterworks"
];

// Brief §5 category split across the 23 core spots.
export const BUCKETS = {
  "forces-working-systems-craft": ["hagley", "herrs", "virginia-transportation", "ebt-shop", "ebt-steam", "martin-guitar", "waterworks"],
  "stone-geology-industrial-terrain": ["old-new-gate", "government-island", "belle-isle", "natural-chimneys", "hickory-run-boulder-field", "pyramid-mountain", "mine-hill-preserve"],
  "solve-compete-play": ["game-show-rush-hour", "gnome-raven", "vir-kart", "roanoke-pinball", "thirteenth-hour"],
  "sacred-monumental-craft": ["baps-akshardham", "st-mary-orthodox"],
  "scenic-reset": ["roanoke-star"],
  "shopping": ["pocono-outlets"]
};

// Brief §6 activity-texture breakdown.
export const TEXTURES = {
  "hagley": "DISCOVER", "herrs": "DISCOVER", "virginia-transportation": "DISCOVER", "ebt-shop": "DISCOVER", "martin-guitar": "DISCOVER",
  "old-new-gate": "EXPLORE", "government-island": "EXPLORE", "belle-isle": "EXPLORE", "mine-hill-preserve": "EXPLORE",
  "baps-akshardham": "AWE", "ebt-steam": "AWE", "waterworks": "AWE",
  "game-show-rush-hour": "COMPETE", "vir-kart": "COMPETE", "roanoke-pinball": "COMPETE",
  "gnome-raven": "SOLVE", "thirteenth-hour": "SOLVE",
  "natural-chimneys": "WILD", "hickory-run-boulder-field": "WILD",
  "pyramid-mountain": "MOVE",
  "roanoke-star": "RELAX",
  "st-mary-orthodox": "WORSHIP",
  "pocono-outlets": "SHOP"
};

// Brief §5: 0 traditional passive galleries in core. Waterworks is the one conservative
// "observe more than interact" flag, kept because the three-storey pumping engines and the building
// are themselves the attraction.
export const MUSEUM_LIKE_IDS = new Set(["waterworks"]);

// Brief §9 pricing table. vir-kart's spread is the documented one-race / two-race cost switch.
export const PRICES = {
  "old-new-gate": { low: 20, high: 20, type: "paid", group: 80, note: "Base ticket for the Light into the Dungeon October event; ticketing fees are extra." },
  "baps-akshardham": { low: 0, high: 0, type: "free" },
  "hagley": { low: 22, high: 22, type: "paid", group: 88 },
  "herrs": { low: 8, high: 8, type: "paid", group: 32 },
  "government-island": { low: 0, high: 0, type: "free" },
  "game-show-rush-hour": { low: 32, high: 32, type: "paid", group: 128 },
  "belle-isle": { low: 0, high: 0, type: "free" },
  "gnome-raven": { low: 35, high: 35, type: "paid", group: 140 },
  "vir-kart": { low: 30, high: 60, type: "variable", group: 240, note: "$30 per race per person. Core models two races; dropping to one saves $30 per person and $120 for the group." },
  "virginia-transportation": { low: 12.66, high: 12.66, type: "paid", group: 50.64 },
  "roanoke-pinball": { low: 16, high: 16, type: "paid", group: 64, note: "Admission includes unlimited play; the machines are set to free play." },
  "roanoke-star": { low: 0, high: 0, type: "free" },
  "natural-chimneys": { low: 0, high: 0, type: "free", note: "Free for a day visit; camping is separate." },
  "st-mary-orthodox": { low: 0, high: 0, type: "free" },
  "ebt-shop": { low: 18, high: 18, type: "paid", group: 72 },
  "ebt-steam": { low: 28, high: 28, type: "paid", group: 112, note: "Coach or open-air car; the caboose is currently $32." },
  "martin-guitar": { low: 10, high: 10, type: "paid", group: 40 },
  "hickory-run-boulder-field": { low: 0, high: 0, type: "free" },
  "pocono-outlets": { low: 0, high: 0, type: "free", note: "No admission. Purchases are deliberately excluded from the route total." },
  "pyramid-mountain": { low: 0, high: 0, type: "free" },
  "thirteenth-hour": { low: 49, high: 49, type: "paid", group: 196 },
  "mine-hill-preserve": { low: 0, high: 0, type: "free" },
  "waterworks": { low: 0, high: 0, type: "free", note: "Free admission; donations accepted." }
};

// 36 documented options, mapped to the day they attach to.
export const NON_CORE = {
  "new-england-motorcycle": { day: 1, role: "optional" },
  "hill-stead": { day: 1, role: "flex" },
  "bell-works": { day: 2, role: "optional" },
  "puzzleconnect": { day: 2, role: "optional" },
  "sayen-gardens": { day: 2, role: "flex" },
  "winterthur": { day: 3, role: "optional" },
  "brandywine-creek-sp": { day: 3, role: "optional" },
  "marine-corps-museum": { day: 4, role: "optional" },
  "cryptologic-museum": { day: 4, role: "optional" },
  "port-of-falmouth": { day: 4, role: "optional" },
  "tredegar-riverfront": { day: 4, role: "optional" },
  "gnome-raven-alt": { day: 5, role: "optional-swap", replaces: "gnome-raven" },
  "lewis-ginter": { day: 5, role: "flex" },
  "danville-science": { day: 5, role: "optional" },
  "danville-river-district": { day: 5, role: "optional" },
  "winston-link": { day: 6, role: "optional" },
  "black-dog-salvage": { day: 6, role: "optional" },
  "explore-park-mtb": { day: 6, role: "optional" },
  "explore-park-treetop": { day: 6, role: "optional" },
  "carrier-arboretum": { day: 7, role: "optional" },
  "harrisonburg-public-art": { day: 7, role: "flex" },
  "reddish-knob": { day: 7, role: "optional" },
  "rockhill-trolley": { day: 8, role: "optional" },
  "pine-grove-furnace": { day: 8, role: "optional" },
  "kings-gap": { day: 8, role: "optional" },
  "trough-creek": { day: 8, role: "optional" },
  "raystown-allegrippis": { day: 8, role: "optional" },
  "civil-war-museum": { day: 9, role: "optional" },
  "aaca-museum": { day: 9, role: "optional" },
  "yuengling-brewery": { day: 9, role: "optional" },
  "skirmish-paintball": { day: 9, role: "optional" },
  "pocono-utv": { day: 10, role: "optional" },
  "bushkill-falls": { day: 10, role: "optional" },
  "skylands": { day: 10, role: "flex" },
  "five-wits": { day: 10, role: "optional" },
  "boston-athenaeum": { day: 11, role: "optional" }
};

// Not in the brief's selectable inventory at all. Kept as revision history, excluded from the 52/59
// selectable counts and from Magic.
export const ARCHIVE_IDS = new Set(["agecroft-hall", "taubman-art", "holy-myrrhbearers"]);

// The brief reports 59 experience-level choices deduplicating to 52 venue cards. These are the
// groups that share one physical venue.
export const VENUE_GROUPS = {
  "gnome-raven": ["gnome-raven", "gnome-raven-alt"],
  "east-broad-top": ["ebt-shop", "ebt-steam", "rockhill-trolley"],
  "explore-park": ["explore-park-mtb", "explore-park-treetop"],
  "richmond-river": ["belle-isle", "tredegar-riverfront"],
  "south-mountain": ["pine-grove-furnace", "kings-gap"],
  "raystown-huntingdon": ["trough-creek", "raystown-allegrippis"]
};

export const DAY_DATES = ["2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09",
  "2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13", "2026-10-14"];

// Scheduled windows from the brief's day-by-day active core.
export const SCHEDULES = {
  "old-new-gate": ["15:00", "17:00"],
  "baps-akshardham": ["11:00", "13:45"],
  "hagley": ["10:00", "13:00"],
  "herrs": ["14:15", "15:15"],
  "government-island": ["09:45", "11:15"],
  "game-show-rush-hour": ["12:00", "13:15"],
  "belle-isle": ["15:15", "17:00"],
  "gnome-raven": ["13:00", "14:15"],
  "vir-kart": ["16:30", "17:30"],
  "virginia-transportation": ["10:30", "13:00"],
  "roanoke-pinball": ["13:20", "15:00"],
  "roanoke-star": ["17:15", "18:15"],
  "natural-chimneys": ["10:15", "12:00"],
  "st-mary-orthodox": ["10:00", "11:20"],
  "ebt-shop": ["13:15", "14:15"],
  "ebt-steam": ["14:30", "17:00"],
  "martin-guitar": ["11:00", "12:00"],
  "hickory-run-boulder-field": ["13:20", "15:00"],
  "pocono-outlets": ["10:00", "12:00"],
  "pyramid-mountain": ["13:10", "15:10"],
  "thirteenth-hour": ["16:00", "17:30"],
  "mine-hill-preserve": ["09:00", "11:00"],
  "waterworks": ["13:30", "15:15"]
};

export const RESERVATIONS = {
  "old-new-gate": "required-timed-event",
  "hagley": "recommended",
  "herrs": "required-advance-tour",
  "game-show-rush-hour": "required",
  "gnome-raven": "required",
  "vir-kart": "required",
  "ebt-shop": "required",
  "ebt-steam": "required",
  "martin-guitar": "recommended",
  "thirteenth-hour": "required",
  "roanoke-pinball": "none",
  "virginia-transportation": "none"
};

// Measured OSRM totals exceed 270 on two days after the documented comfort breaks.
export const CAP_EXCEPTIONS = {
  7: { minutes: 330, reason: "Roanoke to Chambersburg is the rebuild's one deliberate long transfer, and it buys Orthodox Sunday plus East Broad Top's fixed departures the next day. A documented Winchester break on I-81 splits the run into 137, 109 and 78 minutes, so no leg approaches the uninterrupted ceiling." },
  9: { minutes: 320, reason: "Carlisle to the Poconos carries three fixed anchors: Martin Guitar's tour times, the Boulder Field's daylight, and the Tannersville overnight. Measured at 311 minutes with a 144-minute longest leg, every leg ends at a real stop, so the total is authorised rather than reduced by dropping an anchor." }
};

export const DAY_PLANS = [
  { day: 1, sleep_city: "Orange / New Haven edge, CT", theme: "Boston to underground Connecticut" },
  { day: 2, sleep_city: "Hamilton / Robbinsville, NJ", theme: "Monumental hand-carved stone in central New Jersey" },
  { day: 3, sleep_city: "Baltimore, MD", theme: "Brandywine waterpower, then a production line" },
  { day: 4, sleep_city: "Richmond, VA", theme: "Sandstone quarry, live game show, industrial river island" },
  { day: 5, sleep_city: "Danville, VA", theme: "Puzzle craft in Richmond, then speed at VIR" },
  { day: 6, sleep_city: "Roanoke, VA", theme: "Giant machines and playable mechanics" },
  { day: 7, sleep_city: "Chambersburg, PA", theme: "Limestone towers, then the long I-81 transfer north" },
  { day: 8, sleep_city: "Carlisle, PA", theme: "Orthodox Sunday, the machine shop, and live steam" },
  { day: 9, sleep_city: "Tannersville / Poconos, PA", theme: "Hand craftsmanship, then glacial force" },
  { day: 10, sleep_city: "Danbury, CT", theme: "Shopping, a balancing erratic, and an elite escape room" },
  { day: 11, sleep_city: "Boston, MA", theme: "Connecticut iron and granite, then Boston's giant pumps" }
];

const fit = (best, secondary, note) => ({ best_for: best, secondary_for: secondary, best_fit_note: note });

// Full records for the 38 places the rebuild introduces. Existing V1 records keep their researched
// copy and are only reclassified.
export const NEW_PLACES = {
  /* ---- new core ---- */
  "old-new-gate": {
    name: "Old New-Gate Prison & Copper Mine", kind: "colonial-copper-mine-and-prison-underground",
    city: "East Granby", state: "CT", duration_minutes: 120,
    summary: "A copper mine from 1707 that became Connecticut's first state prison. The October event takes visitors down into the flooded caverns by lantern light.",
    why_go: "The route opens by going underground. Cold rock, standing water and the sound of the caverns do more in twenty minutes than any gallery could.",
    ...fit(["gora", "stivka"], ["viki", "sheluvspaco"], "Best for gora and stivka: a real descent into worked rock, with the prison history layered on top."),
    categories: ["hidden_history_folklore", "unusual_creative", "architecture_nature_photogenic"],
    hours_note: "Light into the Dungeon runs on set October dates with timed entry. Book the exact date before travel; the caverns are cold, wet and uneven."
  },
  "herrs": {
    name: "Herr's Snack Factory Tour", kind: "working-snack-production-line",
    city: "Nottingham", state: "PA", duration_minutes: 60,
    summary: "A guided walk along a running snack production line, from raw potatoes through the fryers to bagging and boxing.",
    why_go: "It is a real factory floor at working speed. Watching the line, not a re-creation of one, is the point.",
    ...fit(["gora"], ["sheluvspaco", "viki", "stivka"], "Best for gora: continuous working machinery at production speed, with the smell and noise intact."),
    categories: ["unusual_creative", "local_culture"],
    hours_note: "Tours run on a fixed weekday schedule and must be booked ahead. Closed-toe shoes; no photography on the line."
  },
  "game-show-rush-hour": {
    name: "The Game Show by Rush Hour", kind: "live-studio-game-show-competition",
    city: "Fredericksburg", state: "VA", duration_minutes: 75,
    summary: "A live game-show studio with buzzers, a host and scoreboards, run as a real competition between teams.",
    why_go: "It is the route's clearest four-way contest. Everyone plays, nobody spectates, and the scoreboard settles it.",
    ...fit(["sheluvspaco", "stivka"], ["viki", "gora"], "Best for sheluvspaco and stivka: a hosted competition where the whole group is on the buzzers."),
    categories: ["social_nightlife_live", "unusual_creative", "local_culture"],
    hours_note: "Sessions are booked as a private slot for the group. Confirm the exact Wednesday time when booking."
  },
  "belle-isle": {
    name: "Belle Isle Industrial & Quarry Loop", kind: "river-island-industrial-ruins-and-quarry",
    city: "Richmond", state: "VA", duration_minutes: 105,
    summary: "A James River island reached by a footbridge under the highway, holding a quarry pond, hydroelectric ruins and granite outcrops in the rapids.",
    why_go: "Industrial wreckage, worked granite and whitewater in one loop, all of it free and walkable straight out of the city.",
    ...fit(["gora", "viki"], ["sheluvspaco", "stivka"], "Best for gora and viki: ruined industry against moving water, with rock to scramble on."),
    categories: ["hidden_history_folklore", "architecture_nature_photogenic", "athletic_adrenaline"],
    hours_note: "Open daylight hours and free. The footbridge is the reliable access; rocks near the rapids are slick when wet."
  },
  "gnome-raven": {
    name: "Gnome & Raven: Magic Lamp", kind: "specialist-escape-room",
    city: "Richmond", state: "VA", duration_minutes: 75,
    summary: "A well-regarded independent escape room running a heavily built Magic Lamp set rather than a padlock-and-poster room.",
    why_go: "Richmond's strongest puzzle craft, and the first of the route's two traditional escape rooms.",
    ...fit(["stivka", "sheluvspaco"], ["viki", "gora"], "Best for stivka and sheluvspaco: a built set with real puzzle design rather than a generic room."),
    categories: ["unusual_creative", "social_nightlife_live"],
    hours_note: "Thursday hours currently run 1-8 PM; book the private slot ahead."
  },
  "vir-kart": {
    name: "Virginia International Raceway Kart Track", kind: "racing-kart-circuit",
    city: "Alton", state: "VA", duration_minutes: 60,
    summary: "A kart circuit at a genuine motorsports facility, running karts capable of about 55 mph on a purpose-built track.",
    why_go: "Real speed at a real racetrack, timed and scored, at the end of a driving day.",
    ...fit(["gora", "sheluvspaco"], ["stivka", "viki"], "Best for gora and sheluvspaco: actual racing speed and lap times, not a slow amusement track."),
    categories: ["athletic_adrenaline", "social_nightlife_live"],
    hours_note: "Book the race block ahead. Closed shoes required; the core models two races per person."
  },
  "natural-chimneys": {
    name: "Natural Chimneys Park", kind: "limestone-tower-formation",
    city: "Mount Solon", state: "VA", duration_minutes: 105,
    summary: "Seven limestone towers up to 120 feet high, left standing when the surrounding rock eroded away, in a quiet valley park.",
    why_go: "A free geological break that turns the long I-81 transfer into a real stop instead of a service plaza.",
    ...fit(["viki", "gora"], ["sheluvspaco", "stivka"], "Best for viki and gora: unusual rock at scale, easy to walk, and genuinely photogenic."),
    categories: ["architecture_nature_photogenic", "hidden_history_folklore", "quiet_reset"],
    hours_note: "Free for day visits, open daylight hours. Short level walking around the base of the towers."
  },
  "st-mary-orthodox": {
    name: "St. Mary Orthodox Church", kind: "orthodox-sunday-divine-liturgy",
    city: "Chambersburg", state: "PA", duration_minutes: 80,
    summary: "A parish serving a 10:00 AM Sunday Divine Liturgy, positioned so the group can attend before the day's railroad tours.",
    why_go: "The route protects Orthodox Sunday. Chambersburg exists as an overnight specifically so this works without rushing.",
    ...fit(["viki", "stivka"], ["sheluvspaco", "gora"], "Best for viki and stivka: a served Sunday liturgy, with the day built around it rather than past it."),
    categories: ["orthodox_spiritual", "local_culture"],
    hours_note: "Divine Liturgy currently at 10:00 AM Sunday. Confirm the October schedule; modest dress."
  },
  "ebt-shop": {
    name: "East Broad Top — Individual Shop Tour", kind: "intact-belt-driven-railroad-machine-shop",
    city: "Rockhill Furnace", state: "PA", duration_minutes: 60,
    summary: "A guided tour of the surviving narrow-gauge railroad shops, where line shafts and belt-driven machine tools remain in place as they were left.",
    why_go: "One of the most complete steam-era workshops left in the country, with the power transmission still overhead.",
    ...fit(["gora"], ["viki", "sheluvspaco", "stivka"], "Best for gora: an intact belt-and-line-shaft shop floor, which almost nowhere else still has."),
    categories: ["hidden_history_folklore", "unusual_creative", "architecture_nature_photogenic"],
    hours_note: "Shop tours run on a set schedule and sell separately from the train. Book the 1:15 slot ahead."
  },
  "ebt-steam": {
    name: "East Broad Top — Live Steam Train", kind: "operating-narrow-gauge-steam-railroad",
    city: "Rockhill Furnace", state: "PA", duration_minutes: 150,
    summary: "A ride behind a century-old narrow-gauge steam locomotive on an exact-date October operation, in coach or open-air cars.",
    why_go: "Working steam on its original railroad, on a date that actually exists in October 2026.",
    ...fit(["gora", "viki"], ["sheluvspaco", "stivka"], "Best for gora and viki: a genuine steam locomotive working its own line, with open-air cars for photographs."),
    categories: ["hidden_history_folklore", "architecture_nature_photogenic", "local_culture"],
    hours_note: "Exact-date October operation. Book the specific departure; open-air cars are cold once moving."
  },
  "martin-guitar": {
    name: "C. F. Martin & Co. Factory Tour", kind: "working-guitar-factory-floor",
    city: "Nazareth", state: "PA", duration_minutes: 60,
    summary: "A walk through an active guitar factory, following wood from rough stock through bending, bracing, binding and finishing.",
    why_go: "Hand craftsmanship at production scale, on a working floor, for ten dollars.",
    ...fit(["viki", "gora"], ["sheluvspaco", "stivka"], "Best for viki and gora: close-up handwork and machinery in the same building, at an unusually low price."),
    categories: ["unusual_creative", "local_culture", "hidden_history_folklore"],
    hours_note: "Weekday factory tours only; the floor is quiet outside production hours. Confirm the Monday schedule."
  },
  "hickory-run-boulder-field": {
    name: "Hickory Run State Park — Boulder Field", kind: "glacial-boulder-field",
    city: "White Haven", state: "PA", duration_minutes: 100,
    summary: "A National Natural Landmark: sixteen acres of bare boulders left by periglacial conditions, with no soil and no trees across the whole field.",
    why_go: "You cross it by physically negotiating the rock. It is the route's clearest example of force left visible on the landscape.",
    ...fit(["gora", "stivka"], ["viki", "sheluvspaco"], "Best for gora and stivka: unstable boulders to cross on foot, with easy opt-out at the edge."),
    categories: ["architecture_nature_photogenic", "athletic_adrenaline", "quiet_reset"],
    hours_note: "Free, daylight hours. The access road is slow; boulders are ankle-turning and worse when wet."
  },
  "pocono-outlets": {
    name: "Pocono Premium Outlets", kind: "shopping-block",
    city: "Tannersville", state: "PA", duration_minutes: 120,
    summary: "The route's one scheduled shopping block, an outlet centre immediately off Interstate 80 at Tannersville.",
    why_go: "One deliberate shopping slot in a fixed place, so it never competes with the rest of the itinerary.",
    ...fit(["stivka", "viki"], ["sheluvspaco", "gora"], "Best for stivka and viki: the trip's single planned shopping window, with an easy exit."),
    categories: ["local_culture"],
    hours_note: "No admission. Purchases are excluded from the route budget by design."
  },
  "thirteenth-hour": {
    name: "13th Hour Escape Rooms — The Campground", kind: "horror-theatre-escape-room",
    city: "Wharton", state: "NJ", duration_minutes: 90,
    summary: "A heavily built horror-theatre escape room from an operator known for set construction rather than padlocks.",
    why_go: "The route's puzzle finale, and the strongest built set of the two escape rooms in the package.",
    ...fit(["stivka", "sheluvspaco"], ["gora", "viki"], "Best for stivka and sheluvspaco: a full theatrical set with real production values."),
    categories: ["unusual_creative", "social_nightlife_live"],
    hours_note: "Book the private slot ahead. Horror theming with startle effects; intensity can be dialled down on request."
  },
  "mine-hill-preserve": {
    name: "Mine Hill Preserve", kind: "iron-mine-and-granite-quarry-ruins",
    city: "Roxbury", state: "CT", duration_minutes: 120,
    summary: "A preserve holding nineteenth-century iron-mine workings, roasting ovens, a blast furnace and granite quarry faces in the woods.",
    why_go: "The last industrial landscape of the trip, walked on foot, before the pumping engines in Boston close it out.",
    ...fit(["gora", "viki"], ["sheluvspaco", "stivka"], "Best for gora and viki: furnace and quarry ruins standing in the forest, free and self-guided."),
    categories: ["hidden_history_folklore", "architecture_nature_photogenic", "quiet_reset"],
    hours_note: "Free, daylight hours. Mine openings are gated; trails are rocky and can be wet."
  },

  /* ---- new options ---- */
  "bell-works": {
    name: "Bell Works", kind: "adaptive-reuse-saarinen-atrium", city: "Holmdel", state: "NJ", duration_minutes: 60,
    summary: "Eero Saarinen's former Bell Labs building, now a public 'metroburb' with a quarter-mile glass atrium open to visitors.",
    why_go: "A famous piece of modern architecture you can simply walk into, free, on the way south.",
    ...fit(["viki"], ["sheluvspaco", "stivka", "gora"], "Best for viki: monumental modernist interior space at no cost."),
    categories: ["architecture_nature_photogenic", "local_culture"], hours_note: "Public atrium access during business hours."
  },
  "puzzleconnect": {
    name: "PuzzleConnect: Curse of the Hidden Temple", kind: "specialist-escape-room", city: "Eatontown", state: "NJ", duration_minutes: 60,
    summary: "A well-reviewed New Jersey escape venue running a heavily built temple room.",
    why_go: "The package's third escape venue, held as an option so the core keeps only two.",
    ...fit(["stivka"], ["sheluvspaco", "viki", "gora"], "Best for stivka: strong specialist reputation if the group wants a third puzzle."),
    categories: ["unusual_creative", "social_nightlife_live"], hours_note: "Booked slots; about $39 per person."
  },
  "brandywine-creek-sp": {
    name: "Brandywine Creek State Park", kind: "creek-valley-park-reset", city: "Wilmington", state: "DE", duration_minutes: 60,
    summary: "Meadows, stone walls and creek-side trails immediately upstream of the Hagley powder yards.",
    why_go: "Outdoor movement on a day otherwise spent inside industrial buildings.",
    ...fit(["viki", "gora"], ["sheluvspaco", "stivka"], "Best for viki and gora: a short green break in the same valley as Hagley."),
    categories: ["quiet_reset", "architecture_nature_photogenic"], hours_note: "Daylight hours; small vehicle entry fee in season."
  },
  "cryptologic-museum": {
    name: "National Cryptologic Museum", kind: "codes-and-cipher-machine-collection", city: "Annapolis Junction", state: "MD", duration_minutes: 90,
    summary: "The NSA's public museum, holding Enigma machines, cipher devices and the history of American codebreaking.",
    why_go: "Free, and the one place on the route where the puzzle instinct meets real machines.",
    ...fit(["stivka", "gora"], ["sheluvspaco", "viki"], "Best for stivka and gora: working cipher machinery and codebreaking history at no cost."),
    categories: ["hidden_history_folklore", "unusual_creative"], hours_note: "Free admission; closed some weekdays."
  },
  "port-of-falmouth": {
    name: "Historic Port of Falmouth", kind: "riverfront-colonial-port-remnant", city: "Falmouth", state: "VA", duration_minutes: 45,
    summary: "A small riverside park on the Rappahannock marking the colonial port that shipped Aquia sandstone and tobacco.",
    why_go: "A short free break that completes the Government Island stone story downstream.",
    ...fit(["viki"], ["gora", "sheluvspaco", "stivka"], "Best for viki: quiet river frontage that ties back to the quarry."),
    categories: ["hidden_history_folklore", "quiet_reset"], hours_note: "Open park, daylight hours."
  },
  "gnome-raven-alt": {
    name: "Gnome & Raven: Shipwrecked / Tomb Ruins", kind: "specialist-escape-room", city: "Richmond", state: "VA", duration_minutes: 75,
    summary: "The same Richmond venue's other built rooms, offered as a game choice rather than an extra booking.",
    why_go: "If Magic Lamp is unavailable or already played, these are the same operator's alternates.",
    ...fit(["stivka", "sheluvspaco"], ["viki", "gora"], "Best for stivka and sheluvspaco: a swap of room, not an addition to the day."),
    categories: ["unusual_creative", "social_nightlife_live"], hours_note: "Same venue and price band; choose one room, not two."
  },
  "tredegar-riverfront": {
    name: "Tredegar & James River Industrial Riverfront", kind: "ironworks-ruins-and-river-walk", city: "Richmond", state: "VA", duration_minutes: 75,
    summary: "The Tredegar Iron Works site and the canal-side river walk beneath it, all exterior and free.",
    why_go: "A weather-proof complement to Belle Isle when the island's rocks are wet or the bridge is closed.",
    ...fit(["gora", "viki"], ["sheluvspaco", "stivka"], "Best for gora and viki: heavy industrial fabric on the same riverbank."),
    categories: ["hidden_history_folklore", "architecture_nature_photogenic"], hours_note: "Exterior circuit is free and open; the museum inside is ticketed separately."
  },
  "danville-science": {
    name: "Danville Science Center", kind: "hands-on-science-and-dome", city: "Danville", state: "VA", duration_minutes: 90,
    summary: "An inexpensive hands-on science centre with a digital dome, in a restored railway station.",
    why_go: "The Danville rain option, and hands-on rather than observe-only.",
    ...fit(["stivka", "gora"], ["sheluvspaco", "viki"], "Best for stivka and gora: interactive exhibits if VIR is rained out."),
    categories: ["unusual_creative", "local_culture"], hours_note: "Low admission; dome shows on a set schedule."
  },
  "danville-river-district": {
    name: "Danville River District", kind: "tobacco-warehouse-architecture-walk", city: "Danville", state: "VA", duration_minutes: 45,
    summary: "The restored tobacco-warehouse district along the Dan River, walkable and free.",
    why_go: "A short visual reset rather than another ticketed stop.",
    ...fit(["viki"], ["sheluvspaco", "stivka", "gora"], "Best for viki: big brick industrial architecture at street level."),
    categories: ["architecture_nature_photogenic", "local_culture"], hours_note: "Open streets; best in daylight."
  },
  "black-dog-salvage": {
    name: "Black Dog Salvage", kind: "architectural-salvage-warehouse", city: "Roanoke", state: "VA", duration_minutes: 75,
    summary: "A 44,000-square-foot architectural salvage warehouse of doors, fixtures, ironwork and industrial fragments.",
    why_go: "A treasure hunt through building parts, and the best DISCOVER flex in Roanoke.",
    ...fit(["viki", "stivka"], ["gora", "sheluvspaco"], "Best for viki and stivka: an enormous browsable space full of salvaged objects."),
    categories: ["unusual_creative", "local_culture"], hours_note: "Free to browse during shop hours."
  },
  "explore-park-mtb": {
    name: "Explore Park Mountain Bike Trails", kind: "purpose-built-singletrack", city: "Roanoke", state: "VA", duration_minutes: 150,
    summary: "Over fourteen miles of trail off the Blue Ridge Parkway, nine of them purpose-built mountain-bike singletrack.",
    why_go: "The strongest physical swap on the Roanoke day if the group wants to move rather than look.",
    ...fit(["gora"], ["stivka", "sheluvspaco", "viki"], "Best for gora: real singletrack with rentals available on site."),
    categories: ["athletic_adrenaline", "quiet_reset"], hours_note: "Daylight hours; rentals and shuttle depend on season."
  },
  "explore-park-treetop": {
    name: "Explore Park Treetop Quest", kind: "aerial-ropes-course", city: "Roanoke", state: "VA", duration_minutes: 150,
    summary: "An aerial adventure course of platforms, bridges and ziplines in the same park.",
    why_go: "Held outside the core because Route 1 already uses a treetop challenge heavily.",
    ...fit(["stivka", "gora"], ["sheluvspaco", "viki"], "Best for stivka and gora: height and movement, weather and booking permitting."),
    categories: ["athletic_adrenaline"], hours_note: "Booking and weather dependent; seasonal hours."
  },
  "reddish-knob": {
    name: "Reddish Knob Overlook", kind: "ridge-summit-overlook", city: "Briery Branch", state: "VA", duration_minutes: 75,
    summary: "A drive-up ridge summit on the Virginia-West Virginia line with a very wide view over the Shenandoah Valley.",
    why_go: "A high-return daylight flex on the Shenandoah day when the road is clean.",
    ...fit(["viki"], ["sheluvspaco", "gora", "stivka"], "Best for viki: a large open view reached without a hike."),
    categories: ["architecture_nature_photogenic", "quiet_reset"], hours_note: "Narrow mountain road; avoid in ice, fog or after dark."
  },
  "rockhill-trolley": {
    name: "Rockhill Trolley Museum", kind: "operating-trolley-museum", city: "Rockhill Furnace", state: "PA", duration_minutes: 75,
    summary: "An operating trolley museum directly across the street from East Broad Top, running restored cars on its own track.",
    why_go: "Adjacent mechanical motion if the East Broad Top train timing changes.",
    ...fit(["gora", "viki"], ["sheluvspaco", "stivka"], "Best for gora and viki: another working vehicle, thirty seconds from the railroad."),
    categories: ["hidden_history_folklore", "local_culture"], hours_note: "Weekend operating days; rides included with admission."
  },
  "pine-grove-furnace": {
    name: "Pine Grove Furnace & Pole Steeple", kind: "iron-furnace-landscape-and-overlook", city: "Gardners", state: "PA", duration_minutes: 150,
    summary: "A preserved iron furnace stack in a state park, plus a short steep climb to the Pole Steeple quartzite overlook.",
    why_go: "Iron-making history and a real climb in the same stop.",
    ...fit(["gora", "viki"], ["stivka", "sheluvspaco"], "Best for gora and viki: furnace ruins at the bottom, a rock overlook at the top."),
    categories: ["hidden_history_folklore", "athletic_adrenaline", "architecture_nature_photogenic"], hours_note: "Free park; Pole Steeple is short but steep and rocky."
  },
  "kings-gap": {
    name: "Kings Gap Environmental Education Center", kind: "mountain-estate-and-scree-landscape", city: "Carlisle", state: "PA", duration_minutes: 105,
    summary: "A stone mansion on the South Mountain ridge with rock scree slopes and charcoal-hearth remains in the surrounding forest.",
    why_go: "Stone, industrial history and a ridge view without a long drive from Carlisle.",
    ...fit(["viki", "gora"], ["sheluvspaco", "stivka"], "Best for viki and gora: a big stone house and the worked forest around it."),
    categories: ["architecture_nature_photogenic", "hidden_history_folklore", "quiet_reset"], hours_note: "Free; grounds open daylight hours."
  },
  "trough-creek": {
    name: "Trough Creek State Park — Balanced Rock", kind: "gorge-suspension-bridge-and-balanced-rock", city: "James Creek", state: "PA", duration_minutes: 120,
    summary: "A gorge park with a swinging suspension bridge, Rainbow Falls and a large balanced rock perched above the creek.",
    why_go: "Stronger wild terrain if the group sleeps nearer Huntingdon.",
    ...fit(["gora", "stivka"], ["viki", "sheluvspaco"], "Best for gora and stivka: a suspension bridge and a short steep climb to the balanced rock."),
    categories: ["architecture_nature_photogenic", "athletic_adrenaline"], hours_note: "Free; the climb to Balanced Rock is short, steep and rooty."
  },
  "raystown-allegrippis": {
    name: "Allegrippis Trails, Raystown Lake", kind: "stacked-loop-singletrack-system", city: "Hesston", state: "PA", duration_minutes: 180,
    summary: "A purpose-built stacked-loop singletrack system above Raystown Lake, widely rated among the best flow trails in the region.",
    why_go: "The athletic alternate for a Huntingdon overnight variant.",
    ...fit(["gora"], ["stivka", "sheluvspaco", "viki"], "Best for gora: machine-built flow trail with a full day's riding available."),
    categories: ["athletic_adrenaline"], hours_note: "Free access; bring or rent bikes locally."
  },
  "yuengling-brewery": {
    name: "Yuengling Brewery Tour", kind: "working-brewery-and-mountain-caves", city: "Pottsville", state: "PA", duration_minutes: 75,
    summary: "America's oldest operating brewery, with a tour that goes into the hand-dug fermentation caves cut into the hillside.",
    why_go: "Process and manufacturing interest, kept optional because food and drink stay outside the core.",
    ...fit(["sheluvspaco", "gora"], ["viki", "stivka"], "Best for sheluvspaco and gora: a working production line plus the original caves."),
    categories: ["local_culture", "hidden_history_folklore"], hours_note: "Free tours on a set schedule; the caves are cold and involve stairs."
  },
  "skirmish-paintball": {
    name: "Skirmish Paintball", kind: "large-woodland-paintball-field", city: "Albrightsville", state: "PA", duration_minutes: 180,
    summary: "A very large woodland paintball operation in the Poconos with many separate playing fields.",
    why_go: "A strong COMPETE swap in the Poconos if the group wants a physical contest.",
    ...fit(["gora", "sheluvspaco"], ["stivka", "viki"], "Best for gora and sheluvspaco: team competition across real terrain."),
    categories: ["athletic_adrenaline", "social_nightlife_live"], hours_note: "Recheck exact 2026 promotions and preregistration pricing before use."
  },
  "pocono-utv": {
    name: "Pocono Outdoor Adventure Tours UTV", kind: "guided-utv-trail-tour", city: "Tannersville", state: "PA", duration_minutes: 120,
    summary: "Guided side-by-side UTV tours on private Pocono trails, running year-round.",
    why_go: "Motorised terrain if the shopping-and-hiking day needs more drive.",
    ...fit(["gora", "sheluvspaco"], ["stivka", "viki"], "Best for gora and sheluvspaco: a four-seat UTV keeps the group together."),
    categories: ["athletic_adrenaline"], hours_note: "Currently about $235 per vehicle before tax and fees; booking required."
  },
  "bushkill-falls": {
    name: "Bushkill Falls", kind: "paid-waterfall-trail-system", city: "Bushkill", state: "PA", duration_minutes: 120,
    summary: "A privately run system of eight waterfalls linked by boardwalks and stairs.",
    why_go: "Use only when a nature-heavy swap is genuinely wanted; it is the paid option among free alternatives.",
    ...fit(["viki"], ["stivka", "sheluvspaco", "gora"], "Best for viki: reliable waterfall photography on maintained boardwalks."),
    categories: ["architecture_nature_photogenic", "quiet_reset"], hours_note: "Currently about $22 per adult; many stairs."
  },
  "five-wits": {
    name: "5 Wits West Nyack", kind: "immersive-interactive-adventure", city: "West Nyack", state: "NY", duration_minutes: 60,
    summary: "A themed interactive adventure of physical rooms and effects, closer to a walkthrough than a lock-and-key escape room.",
    why_go: "A weather backup on the return that does not spend the group's escape-room appetite.",
    ...fit(["stivka"], ["sheluvspaco", "gora", "viki"], "Best for stivka: interactive rooms without being a traditional escape room."),
    categories: ["unusual_creative", "social_nightlife_live"], hours_note: "Mall location with long opening hours; walk-ins usually possible."
  }
};

// Sources for the new places. IDs must exist or the builder throws.
export const NEW_SOURCES = [
  ["src-old-newgate", "Old New-Gate Prison & Copper Mine - Connecticut DECD", "government", "https://portal.ct.gov/ecd-oldnewgateprison", ["October event", "underground access", "admission", "address"]],
  ["src-herrs", "Herr's - factory tour", "official", "https://www.herrs.com/pages/tours", ["tour schedule", "booking", "admission", "production line"]],
  ["src-rush-hour", "Rush Hour - The Game Show", "official", "https://www.rushhourescape.com/", ["session format", "group booking", "price", "Fredericksburg location"]],
  ["src-belle-isle", "James River Park System - Belle Isle", "government", "https://jamesriverpark.org/parks-belle-isle/", ["free access", "footbridge", "quarry pond", "hydro ruins"]],
  ["src-gnome-raven", "Gnome & Raven Escape Rooms", "official", "https://www.gnomeandraven.com/", ["room list", "Thursday hours", "price", "Richmond location"]],
  ["src-vir-kart", "Virginia International Raceway - karting", "official", "https://virnow.com/karting/", ["kart speed", "per-race price", "booking", "Alton location"]],
  ["src-natural-chimneys", "Augusta County Parks - Natural Chimneys", "government", "https://www.co.augusta.va.us/government/parks-recreation/natural-chimneys", ["free day use", "tower height", "hours"]],
  ["src-st-mary-chambersburg", "St. Mary Orthodox Church, Chambersburg", "official-faith-site", "https://www.stmaryorthodoxchurch.org/", ["Sunday Divine Liturgy 10:00", "address", "visitor guidance"]],
  ["src-ebt", "East Broad Top Railroad - tickets", "official", "https://eastbroadtop.com/tickets/", ["shop tour price", "train price", "October operating dates", "departure times"]],
  ["src-ebt-shops", "East Broad Top Railroad - the shops", "official", "https://eastbroadtop.com/history/", ["line shaft shop", "machine tools", "national historic landmark"]],
  ["src-martin", "C. F. Martin & Co. - factory tour", "official", "https://www.martinguitar.com/martin-experience/factory-tour.html", ["tour schedule", "price", "factory floor", "Nazareth address"]],
  ["src-hickory-run", "Pennsylvania DCNR - Hickory Run State Park", "government", "https://www.dcnr.pa.gov/StateParks/FindAPark/HickoryRunStatePark/", ["Boulder Field", "national natural landmark", "free access", "access road"]],
  ["src-pocono-outlets", "Pocono Premium Outlets", "official", "https://www.premiumoutlets.com/outlet/pocono", ["hours", "location", "no admission"]],
  ["src-13th-hour", "13th Hour Escape Rooms", "official", "https://13thhour.com/escape-rooms/", ["The Campground", "price", "booking", "Wharton location"]],
  ["src-mine-hill", "Roxbury Land Trust - Mine Hill Preserve", "nonprofit-steward", "https://roxburylandtrust.org/mine-hill-preserve/", ["furnace", "quarry", "free access", "trail conditions"]],
  ["src-bell-works", "Bell Works Holmdel", "official", "https://bell.works/new-jersey/", ["public atrium", "Saarinen building", "hours"]],
  ["src-puzzleconnect", "PuzzleConnect", "official", "https://www.puzzleconnect.com/", ["room list", "price", "New Jersey location"]],
  ["src-brandywine-creek", "Delaware State Parks - Brandywine Creek", "government", "https://destateparks.com/Woodlands/BrandywineCreek", ["trails", "entry fee", "hours"]],
  ["src-cryptologic", "National Cryptologic Museum", "government", "https://www.nsa.gov/museum/", ["free admission", "Enigma", "open days"]],
  ["src-falmouth", "Stafford County - Historic Port of Falmouth", "government", "https://staffordcountyva.gov/", ["riverfront park", "colonial port", "free access"]],
  ["src-tredegar", "American Civil War Museum - Historic Tredegar", "official", "https://acwm.org/visit/historic-tredegar/", ["ironworks site", "riverfront", "exterior access"]],
  ["src-danville-science", "Danville Science Center", "official", "https://www.dsc.smv.org/", ["admission", "dome", "hours"]],
  ["src-danville-river", "Danville River District", "government-tourism", "https://www.visitdanvilleva.com/river-district/", ["tobacco warehouses", "walkable district"]],
  ["src-black-dog", "Black Dog Salvage", "official", "https://blackdogsalvage.com/", ["warehouse size", "hours", "Roanoke location"]],
  ["src-explore-park", "Explore Park, Roanoke", "government", "https://roanokecountyparks.com/216/Explore-Park", ["mountain bike trails", "treetop quest", "hours"]],
  ["src-reddish-knob", "George Washington National Forest - Reddish Knob", "government", "https://www.fs.usda.gov/gwj", ["overlook access", "road conditions"]],
  ["src-rockhill-trolley", "Rockhill Trolley Museum", "official", "https://www.rockhilltrolley.org/", ["operating days", "admission", "location opposite EBT"]],
  ["src-pine-grove", "Pennsylvania DCNR - Pine Grove Furnace State Park", "government", "https://www.dcnr.pa.gov/StateParks/FindAPark/PineGroveFurnaceStatePark/", ["iron furnace", "Pole Steeple trail", "free access"]],
  ["src-kings-gap", "Pennsylvania DCNR - Kings Gap", "government", "https://www.dcnr.pa.gov/StateParks/FindAPark/KingsGapEnvironmentalEducationCenter/", ["mansion", "scree", "charcoal hearths", "free access"]],
  ["src-trough-creek", "Pennsylvania DCNR - Trough Creek State Park", "government", "https://www.dcnr.pa.gov/StateParks/FindAPark/TroughCreekStatePark/", ["Balanced Rock", "suspension bridge", "Rainbow Falls"]],
  ["src-allegrippis", "US Army Corps - Raystown Lake Allegrippis Trails", "government", "https://www.nab.usace.army.mil/Missions/Civil-Works/Raystown/", ["trail system", "free access"]],
  ["src-yuengling", "D. G. Yuengling & Son - brewery tours", "official", "https://www.yuengling.com/visit/pottsville-brewery/", ["free tour", "caves", "schedule"]],
  ["src-skirmish", "Skirmish Paintball", "official", "https://www.skirmish.com/", ["field size", "pricing", "preregistration"]],
  ["src-pocono-utv", "Pocono Outdoor Adventure Tours", "official", "https://poconooutdooradventuretours.com/", ["UTV price", "year-round operation", "booking"]],
  ["src-bushkill", "Bushkill Falls", "official", "https://www.visitbushkillfalls.com/", ["admission", "trail system", "eight waterfalls"]],
  ["src-five-wits", "5 Wits West Nyack", "official", "https://www.5-wits.com/west-nyack", ["format", "hours", "Palisades Center location"]]
];

// Which source IDs belong to which new place.
export const NEW_PLACE_SOURCES = {
  "old-new-gate": ["src-old-newgate"], "herrs": ["src-herrs"], "game-show-rush-hour": ["src-rush-hour"],
  "belle-isle": ["src-belle-isle"], "gnome-raven": ["src-gnome-raven"], "vir-kart": ["src-vir-kart"],
  "natural-chimneys": ["src-natural-chimneys"], "st-mary-orthodox": ["src-st-mary-chambersburg"],
  "ebt-shop": ["src-ebt", "src-ebt-shops"], "ebt-steam": ["src-ebt"], "martin-guitar": ["src-martin"],
  "hickory-run-boulder-field": ["src-hickory-run"], "pocono-outlets": ["src-pocono-outlets"],
  "thirteenth-hour": ["src-13th-hour"], "mine-hill-preserve": ["src-mine-hill"],
  "bell-works": ["src-bell-works"], "puzzleconnect": ["src-puzzleconnect"], "brandywine-creek-sp": ["src-brandywine-creek"],
  "cryptologic-museum": ["src-cryptologic"], "port-of-falmouth": ["src-falmouth"], "gnome-raven-alt": ["src-gnome-raven"],
  "tredegar-riverfront": ["src-tredegar"], "danville-science": ["src-danville-science"],
  "danville-river-district": ["src-danville-river"], "black-dog-salvage": ["src-black-dog"],
  "explore-park-mtb": ["src-explore-park"], "explore-park-treetop": ["src-explore-park"],
  "reddish-knob": ["src-reddish-knob"], "rockhill-trolley": ["src-rockhill-trolley"],
  "pine-grove-furnace": ["src-pine-grove"], "kings-gap": ["src-kings-gap"], "trough-creek": ["src-trough-creek"],
  "raystown-allegrippis": ["src-allegrippis"], "yuengling-brewery": ["src-yuengling"],
  "skirmish-paintball": ["src-skirmish"], "pocono-utv": ["src-pocono-utv"], "bushkill-falls": ["src-bushkill"],
  "five-wits": ["src-five-wits"]
};
