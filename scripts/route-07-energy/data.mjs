export const VERIFIED_AT = "2026-08-31";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

export const ORIGINAL_VISIBLE_IDS = [
  "springfield-museums", "student-prince", "mgm-springfield-art", "peebles-island", "cohoes-falls",
  "oakwood-troy", "empac", "troy-architecture", "browns-troy", "boxing-hof",
  "syracuse-art-museum", "niagara-mohawk", "dinosaur-syracuse", "anthony-house",
  "mount-hope-rochester", "warner-sunken-garden", "rundel-library", "genesee-brew-house",
  "eden-kazoo", "trec-presque-isle", "erie-land-lighthouse", "rock-hall",
  "christmas-story-house", "buckland-museum", "sugar-agora", "west-side-market",
  "cleveland-art", "moca-cleveland", "brandywine-falls", "all-saints-canonsburg",
  "bedford-coffee-pot", "bedford-architecture", "mack-museum", "lehigh-parkway",
  "uncle-sam-danbury", "mit-museum", "trinity-boston", "modica-way", "plough-stars"
];

export const CORE_IDS = [
  "naismith-center-court", "peebles-island", "cohoes-falls", "empac", "erie-canal-lock-e20",
  "five-wits-syracuse", "strong-museum-play", "high-falls-pont-de-rennes", "eden-kazoo",
  "riverworks-racing-zipline", "presque-isle-movement", "rock-hall", "superelectric-pinball",
  "sugar-agora", "rays-bike-park", "brandywine-falls", "st-nicholas-pittsburgh",
  "carrie-graffiti", "old-pa-pike-rays-hill", "hershey-candy-bar", "martin-guitar",
  "pocono-premium-outlets", "raymondskill-falls", "westville-grand-trunk", "f1-arcade-boston"
];

export const OPTIONAL_IDS = [
  "mgm-springfield-art", "oakwood-troy", "troy-architecture", "boxing-hof", "niagara-mohawk",
  "anthony-house", "mount-hope-rochester", "warner-sunken-garden", "rundel-library",
  "erie-land-lighthouse", "christmas-story-house", "buckland-museum", "cleveland-art",
  "all-saints-canonsburg", "bedford-coffee-pot", "bedford-architecture", "mack-museum",
  "lehigh-parkway", "uncle-sam-danbury", "mit-museum", "trinity-boston", "modica-way",
  "riverworks-high-ropes", "herschell-carrousel", "escape-city-hangover",
  "perplexity-eliot-ness", "perplexity-clockwork-caper"
];

export const ARCHIVE_DISPOSITIONS = {
  "springfield-museums": "remove-archive",
  "student-prince": "optional-food-not-attraction-inventory",
  "browns-troy": "optional-food-not-attraction-inventory",
  "syracuse-art-museum": "remove-archive",
  "dinosaur-syracuse": "optional-food-not-attraction-inventory",
  "genesee-brew-house": "food-removed-high-falls-rebuilt-as-core",
  "trec-presque-isle": "absorbed-into-outdoor-presque-isle-core",
  "west-side-market": "optional-food-not-attraction-inventory",
  "moca-cleveland": "remove-archive",
  "plough-stars": "optional-nightlife-not-attraction-inventory"
};

const cost = (amount, status = amount === null ? "dynamic" : amount === 0 ? "free" : "verified", note = "", options = {}) => ({
  amount_per_person: amount,
  low: options.low ?? amount ?? 0,
  high: options.high ?? amount ?? 0,
  amount_per_group: options.group ?? (amount === null ? null : Math.round(amount * 400) / 100),
  price_type: amount === null ? "live-quote" : amount === 0 ? "free" : "per-person",
  status,
  note,
  planning_signal_per_person: options.planningSignal || null
});

const core = (date, bucket, texture, interaction, amount, best, secondary, options = {}) => ({
  date,
  bucket,
  texture,
  interaction,
  duration: options.duration,
  cost: cost(amount, options.priceStatus, options.costNote, options.costOptions),
  best,
  secondary,
  reservation: options.reservation || "none",
  risk: options.risk || "green",
  sourceIds: options.sourceIds || [],
  flags: options.flags || [],
  skip: options.skip || "Shorten the visit or observe while the rest of the group participates.",
  fallback: options.fallback || null,
  museumLike: options.museumLike || false
});

export const CORE_CONFIG = {
  "naismith-center-court": core("2026-10-04", "interactive-play", "COMPETE", 3, 34, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 155, sourceIds: ["src-v7-naismith"], costNote: "Current adult admission; Center Court is included.", flags: ["playable", "head_to_head"] }),
  "peebles-island": core("2026-10-05", "nature", "RELAX", 1, 0, ["viki", "stivka"], ["gora", "sheluvspaco"], { duration: 70, flags: ["weather_gated", "partial_participation_easy"] }),
  "cohoes-falls": core("2026-10-05", "nature", "AWE", 1, 0, ["viki", "gora"], ["stivka", "sheluvspaco"], { duration: 25, flags: ["industrial_scale", "weather_gated"] }),
  "empac": core("2026-10-05", "music-sound", "DISCOVER", 1, 0, ["stivka", "viki"], ["gora", "sheluvspaco"], { duration: 60, sourceIds: ["src-v7-empac"], flags: ["sound_history", "adaptive_reuse"] }),
  "erie-canal-lock-e20": core("2026-10-06", "working-industry", "DISCOVER", 1, 0, ["gora", "sheluvspaco"], ["viki", "stivka"], { duration: 45, sourceIds: ["src-v7-lock-e20"], flags: ["working_infrastructure", "weather_gated"] }),
  "five-wits-syracuse": core("2026-10-06", "interactive-play", "SOLVE", 3, null, ["viki", "gora", "sheluvspaco"], ["stivka"], { duration: 120, priceStatus: "dynamic", costNote: "Use the live booking-cart quote for two adventures.", reservation: "recommended", risk: "yellow", sourceIds: ["src-v7-five-wits"], flags: ["playable", "team", "adjacent_puzzle_mission"], skip: "Choose the less intense adventure if enclosed spaces or physical effects feel uncomfortable." }),
  "strong-museum-play": core("2026-10-07", "interactive-play", "EXPLORE", 3, 25, ["viki", "sheluvspaco"], ["gora", "stivka"], { duration: 180, priceStatus: "planning-floor", costNote: "Current general-admission planning floor; recheck the Oct. 7 ticket.", sourceIds: ["src-v7-strong"], flags: ["playable", "partial_participation_easy"] }),
  "high-falls-pont-de-rennes": core("2026-10-07", "nature", "AWE", 1, 0, ["viki", "gora"], ["stivka", "sheluvspaco"], { duration: 50, sourceIds: ["src-v7-high-falls"], flags: ["industrial_scale", "weather_gated"] }),
  "eden-kazoo": core("2026-10-08", "working-industry", "WEIRD", 2, 5, ["stivka", "viki", "sheluvspaco"], ["gora"], { duration: 75, priceStatus: "partial", costNote: "$5 docent option; make-your-own fee is still unpublished.", reservation: "call-to-confirm", risk: "red", flags: ["working_factory", "make_sound", "you_make_it", "factory_day_required"] }),
  "riverworks-racing-zipline": core("2026-10-08", "adventure", "COMPETE", 4, 45, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 80, sourceIds: ["src-v7-riverworks"], reservation: "required", risk: "red", flags: ["head_to_head", "inside_industry", "weather_gated", "height_or_weight_gate"], skip: "Use the covered high-ropes option or skip if height, weight, weather or fear comfort makes the race a poor fit.", fallback: "riverworks-high-ropes" }),
  "presque-isle-movement": core("2026-10-08", "nature", "RELAX", 2, 0, ["viki", "stivka", "gora"], ["sheluvspaco"], { duration: 150, sourceIds: ["src-v7-presque-isle"], flags: ["lake_weather_gated", "partial_participation_easy"] }),
  "rock-hall": core("2026-10-09", "music-sound", "DISCOVER", 2, 45, ["stivka", "gora", "viki"], ["sheluvspaco"], { duration: 135, sourceIds: ["src-v7-rockhall"], reservation: "recommended", flags: ["make_sound", "playable"], museumLike: true }),
  "superelectric-pinball": core("2026-10-09", "interactive-play", "COMPETE", 3, 8, ["viki", "gora", "sheluvspaco"], ["stivka"], { duration: 75, sourceIds: ["src-v7-superelectric"], flags: ["playable", "head_to_head"] }),
  "sugar-agora": core("2026-10-09", "music-sound", "AWE", 2, null, ["stivka", "gora"], ["viki", "sheluvspaco"], { duration: 180, priceStatus: "unpublished", costNote: "Official face value was not exposed; reprice through the official ticket path.", costOptions: { planningSignal: [60, 70] }, reservation: "required", risk: "red", flags: ["exact_event_date", "hear_live", "hearing_protection_recommended"] }),
  "rays-bike-park": core("2026-10-10", "adventure", "MOVE", 4, 72, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 180, sourceIds: ["src-v7-rays"], costNote: "$37 weekend admission plus $35 walk-in rental.", reservation: "rental-recommended", risk: "yellow", flags: ["playable", "inside_industry", "adaptive_reuse", "partial_participation_easy"], skip: "Use beginner terrain, ride lightly or spectate if cycling confidence is low." }),
  "brandywine-falls": core("2026-10-10", "nature", "WILD", 1, 0, ["viki", "stivka"], ["gora", "sheluvspaco"], { duration: 60, flags: ["weather_gated", "partial_participation_easy"] }),
  "st-nicholas-pittsburgh": core("2026-10-11", "sacred", "WORSHIP", 1, 0, ["stivka"], ["viki", "gora", "sheluvspaco"], { duration: 165, sourceIds: ["src-v7-st-nicholas"], risk: "yellow", flags: ["exact_event_date", "orthodox_sunday"] }),
  "carrie-graffiti": core("2026-10-11", "working-industry", "EXPLORE", 2, 35, ["viki", "gora", "stivka", "sheluvspaco"], [], { duration: 150, sourceIds: ["src-v7-carrie-graffiti"], reservation: "required", risk: "red", flags: ["exact_event_date", "inside_industry", "you_make_it", "weather_gated"], skip: "Contact the operator in advance about uneven-ground access and use their lower-mobility guidance." }),
  "old-pa-pike-rays-hill": core("2026-10-12", "adventure", "WILD", 4, 0, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 170, sourceIds: ["src-v7-pike2bike"], risk: "red", flags: ["inside_industry", "headlamp_required", "weather_gated", "partial_participation_easy"], skip: "Use a portal or partial out-and-back with another traveler; cancel after heavy rain or without adequate lighting." }),
  "hershey-candy-bar": core("2026-10-12", "working-industry", "DISCOVER", 2, 29.95, ["viki", "sheluvspaco"], ["gora", "stivka"], { duration: 60, priceStatus: "starting-price", costNote: "Starting price before taxes and fees.", sourceIds: ["src-v7-hershey"], reservation: "required", risk: "yellow", flags: ["you_make_it", "playable"] }),
  "martin-guitar": core("2026-10-13", "working-industry", "DISCOVER", 2, 10, ["stivka", "gora", "sheluvspaco"], ["viki"], { duration: 80, sourceIds: ["src-v7-martin"], reservation: "required", risk: "red", flags: ["working_factory", "make_sound", "factory_day_required"] }),
  "pocono-premium-outlets": core("2026-10-13", "shopping", "SHOP", 1, 0, ["viki"], ["gora", "stivka", "sheluvspaco"], { duration: 150, sourceIds: ["src-v7-pocono"], flags: ["shopping_spend_excluded", "partial_participation_easy"] }),
  "raymondskill-falls": core("2026-10-13", "nature", "WILD", 2, 0, ["viki", "gora"], ["stivka", "sheluvspaco"], { duration: 60, sourceIds: ["src-v7-raymondskill"], flags: ["weather_gated"], skip: "Skip after rain or when steep, rooty and slippery footing is not comfortable." }),
  "westville-grand-trunk": core("2026-10-14", "nature", "RELAX", 1, 0, ["viki", "stivka"], ["gora", "sheluvspaco"], { duration: 45, sourceIds: ["src-v7-westville"], flags: ["weather_gated", "partial_participation_easy"] }),
  "f1-arcade-boston": core("2026-10-14", "interactive-play", "COMPETE", 4, null, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 75, priceStatus: "dynamic", costNote: "Use the live Team Racing booking-cart quote.", sourceIds: ["src-v7-f1"], reservation: "strongly-recommended", risk: "red", flags: ["playable", "team", "head_to_head"], skip: "Watch or use a shorter simulator mode if motion sensitivity is a concern." })
};

export const PLACE_OVERRIDES = {
  "naismith-center-court": ["Naismith Basketball Hall — Center Court", "interactive-basketball-hall", "Springfield", "MA", "1000 Hall of Fame Avenue, Springfield, MA 01105", "Start on Center Court with shooting and skills stations before a selective pass through basketball history.", "The opening attraction behaves like a game, not a long museum obligation."],
  "erie-canal-lock-e20": ["Erie Canal Lock E20 — Working Lock", "working-canal-infrastructure", "Marcy", "NY", "9028 River Road, Marcy, NY 13403", "Watch a live Erie Canal lock and its gates, chambers and water levels from the public park.", "A real operating machine breaks the Troy-to-Syracuse transfer."],
  "five-wits-syracuse": ["5 Wits Syracuse — Two-Adventure Mission", "immersive-physical-mission", "Syracuse", "NY", "9090 Destiny USA Drive, Syracuse, NY 13204", "Two automated physical adventures built around sensors, rooms, teamwork and changing effects.", "It supplies the route's brain requirement without forcing a conventional escape-room quota."],
  "strong-museum-play": ["The Strong — Play-First Route", "interactive-museum-of-play", "Rochester", "NY", "1 Manhattan Square Drive, Rochester, NY 14607", "A focused three-hour route through playable zones, arcade machines and hands-on exhibits.", "Play is the medium, so the museum label does not translate into passive browsing."],
  "high-falls-pont-de-rennes": ["High Falls & Pont de Rennes", "industrial-waterfall-walk", "Rochester", "NY", "Pont de Rennes Bridge, Rochester, NY", "A compact walk across Rochester's gorge view where the Genesee drops through the old industrial district.", "Waterpower and factory geography become legible outside."],
  "riverworks-racing-zipline": ["Buffalo RiverWorks — Racing Zipline", "industrial-silo-zipline", "Buffalo", "NY", "359 Ganson Street, Buffalo, NY 14203", "Race side by side through a four-line zipline course threaded through former grain silos.", "The route's industrial Northeast becomes literal playground equipment."],
  "presque-isle-movement": ["Presque Isle — Lake Erie Movement Block", "great-lakes-outdoor-reset", "Erie", "PA", "301 Peninsula Drive, Erie, PA 16505", "A weather-shaped lake block for shoreline walking, beach access and a peninsula drive rather than another indoor center.", "The group meets Lake Erie directly after the silo race."],
  "superelectric-pinball": ["Superelectric Pinball Parlor", "free-play-pinball-parlor", "Cleveland", "OH", "6500 Detroit Avenue, Cleveland, OH 44102", "Pay once and rotate through a room of playable pinball machines.", "Mechanical competition keeps Cleveland's middle act social and fast."],
  "rays-bike-park": ["Ray's Indoor Mountain Bike Park", "adaptive-reuse-indoor-bike-park", "Cleveland", "OH", "9801 Walford Avenue, Cleveland, OH 44102", "Ride beginner-to-advanced terrain inside a vast reused industrial building.", "A former factory becomes an actual moving landscape."],
  "st-nicholas-pittsburgh": ["St. Nicholas Greek Orthodox Cathedral", "orthodox-sunday-worship", "Pittsburgh", "PA", "419 South Dithridge Street, Pittsburgh, PA 15213", "Orthros and Divine Liturgy protect Sunday worship before the industrial art block.", "Faith is scheduled as lived practice and fits the Carrie corridor."],
  "carrie-graffiti": ["Carrie Blast Furnaces — Hands-On Graffiti", "hands-on-industrial-art-tour", "Pittsburgh", "PA", "801 Carrie Furnace Boulevard, Pittsburgh, PA 15218", "An exact-date, small-group workshop that teaches aerosol technique inside the blast-furnace landscape.", "The group leaves marks while learning how an industrial ruin became a living creative site."],
  "old-pa-pike-rays-hill": ["Old PA Pike — Rays Hill Tunnel Out-and-Back", "legal-abandoned-infrastructure", "Breezewood", "PA", "Pike2Bike western trailhead, Breezewood, PA", "A controlled headlamp out-and-back on the undeveloped former turnpike into Rays Hill Tunnel.", "Darkness, rough pavement and obsolete infrastructure create the route's wildest machine encounter."],
  "hershey-candy-bar": ["Hershey's Chocolate World — Create Your Own Candy Bar", "playful-factory-making", "Hershey", "PA", "101 Chocolate World Way, Hershey, PA 17033", "Choose ingredients and a wrapper, pull the lever and follow the bar along the conveyor.", "A manufacturing stop produces a personal object instead of another display case."],
  "martin-guitar": ["Martin Guitar Factory Tour + Pickin' Parlor", "working-guitar-factory", "Nazareth", "PA", "510 Sycamore Street, Nazareth, PA", "Follow the weekday guitar-making process, then handle selected instruments in the visitor environment.", "Sound, craft and a working production line unite the whole route identity."],
  "pocono-premium-outlets": ["Pocono Premium Outlets", "outlet-shopping", "Tannersville", "PA", "1000 Premium Outlets Drive, Tannersville, PA 18372", "A deliberate two-and-a-half-hour block across roughly one hundred outlet stores.", "Viki receives real shopping time without stealing a signature day."],
  "raymondskill-falls": ["Raymondskill Falls", "steep-waterfall-hike", "Milford", "PA", "Raymondskill Falls Trail, Delaware Water Gap NRA, PA", "A short, steep and rooty trail to Pennsylvania's tallest waterfall system.", "A strong forest reset breaks the Poconos-to-Danbury run before dusk."],
  "westville-grand-trunk": ["Westville Lake / Grand Trunk Railbed Reset", "old-rail-corridor-walk", "Sturbridge", "MA", "Westville Lake Recreation Area, Sturbridge, MA", "A short old-railbed sampler breaks the final drive with quiet water and a faint infrastructure thread.", "The finale gets calm breathing room before Boston competition."],
  "f1-arcade-boston": ["F1 Arcade Boston — Team Racing", "full-motion-team-simulator", "Boston", "MA", "87 Pier 4 Boulevard, Boston, MA 02210", "A four-driver Team Racing session with multiple simulator races after the rental cars are returned.", "The trip ends with a shared mechanical competition instead of four slow city stops."],
  "riverworks-high-ropes": ["RiverWorks Urban High Ropes", "covered-industrial-ropes-course", "Buffalo", "NY", "359 Ganson Street, Buffalo, NY 14203", "A covered-weather activity inside the RiverWorks industrial complex.", "It keeps the industrial-adventure promise when the outdoor zipline cannot run."],
  "herschell-carrousel": ["Herschell Carrousel Factory Museum + Ride", "working-carousel-museum", "North Tonawanda", "NY", "180 Thompson Street, North Tonawanda, NY 14120", "Historic carousel machinery plus an operating ride in the original factory complex.", "A gentler mechanical-craft alternative to the silo experience."],
  "escape-city-hangover": ["Escape City Buffalo — The Hangover", "traditional-escape-room", "Tonawanda", "NY", "750 Young Street, Tonawanda, NY 14150", "A specialist-liked conventional room retained only when the group explicitly wants the format.", "It is a real puzzle choice, not a route quota."],
  "perplexity-eliot-ness": ["Perplexity Games — Eliot Ness", "traditional-escape-room", "Cleveland", "OH", "2515 Jay Avenue, Cleveland, OH 44113", "The stronger-reviewed conventional Cleveland room candidate.", "Use it only when the group wants a traditional sixty-minute room."],
  "perplexity-clockwork-caper": ["Perplexity Games — Clockwork Caper", "traditional-escape-room", "Cleveland", "OH", "2515 Jay Avenue, Cleveland, OH 44113", "A theme-perfect clockwork and industrial-espionage room with mixed enthusiast reception.", "Visible with a caution label because theme alone did not earn core time."]
};

export const OPTIONAL_CONFIG = {
  "riverworks-high-ropes": { date: "2026-10-08", coordinates: [-78.872261, 42.869324], sourceIds: ["src-v7-riverworks"] },
  "herschell-carrousel": { date: "2026-10-08", coordinates: [-78.873067, 43.029906], sourceIds: ["src-v7-herschell"] },
  "escape-city-hangover": { date: "2026-10-08", coordinates: [-78.858467, 43.003654], sourceIds: ["src-v7-escape-city"] },
  "perplexity-eliot-ness": { date: "2026-10-09", coordinates: [-81.705944, 41.486222], sourceIds: ["src-v7-perplexity"] },
  "perplexity-clockwork-caper": { date: "2026-10-09", coordinates: [-81.705944, 41.486222], sourceIds: ["src-v7-perplexity"], caution: true }
};

export const DAY_PLANS = [
  { day: 1, date: "2026-10-04", sleep_city: "Springfield, MA", theme: "Center Court opening", schedule: [["13:15", "15:50", "naismith-center-court", "anchor"]], lodging: ["Springfield downtown with staffed reception", "I-91 Springfield with secure two-car parking"], fallback: "Late Logan departure: preserve a useful Center Court block and shorten the galleries." },
  { day: 2, date: "2026-10-05", sleep_city: "Troy, NY", theme: "River force and experimental sound", schedule: [["10:30", "11:40", "peebles-island", "supporting"], ["11:55", "12:20", "cohoes-falls", "supporting"], ["13:00", "14:00", "empac", "anchor"]], lodging: ["Troy center near EMPAC", "Albany-Troy edge with secure parking"], fallback: "Rain shortens the river stops; EMPAC remains a public-area sampler, not an invented Monday tour." },
  { day: 3, date: "2026-10-06", sleep_city: "Syracuse, NY", theme: "Working lock to physical mission", schedule: [["10:30", "11:15", "erie-canal-lock-e20", "supporting"], ["13:00", "15:00", "five-wits-syracuse", "anchor"]], lodging: ["Syracuse downtown", "Destiny USA corridor with secure two-car parking"], fallback: "A quiet lock still works as infrastructure; choose one 5 Wits adventure if timing slips." },
  { day: 4, date: "2026-10-07", sleep_city: "Batavia, NY", theme: "Play, then industrial water", schedule: [["10:00", "13:00", "strong-museum-play", "anchor"], ["13:20", "14:10", "high-falls-pont-de-rennes", "supporting"]], lodging: ["Batavia I-90 lodging zone", "Batavia center with staffed reception"], fallback: "Hard rain compresses High Falls; keep the play-first Strong route." },
  { day: 5, date: "2026-10-08", sleep_city: "Erie, PA", theme: "Make sound, race silos, meet Lake Erie", schedule: [["09:30", "10:45", "eden-kazoo", "anchor"], ["12:00", "13:20", "riverworks-racing-zipline", "anchor"], ["15:15", "17:45", "presque-isle-movement", "anchor"]], lodging: ["Erie bayfront", "Erie I-90 with secure parking"], fallback: "Wind or lightning activates the covered ropes or Herschell option; Presque Isle can become a drive sampler." },
  { day: 6, date: "2026-10-09", sleep_city: "Cleveland, OH", theme: "Playable rock day", schedule: [["10:00", "12:15", "rock-hall", "anchor"], ["13:00", "14:15", "superelectric-pinball", "supporting"], ["20:00", "23:00", "sugar-agora", "anchor"]], lodging: ["Cleveland downtown with secure parking", "Midtown near the Agora with staffed parking"], fallback: "The exact Sugar show wins; shorten daytime browsing before eroding the evening." },
  { day: 7, date: "2026-10-10", sleep_city: "Pittsburgh, PA", theme: "Ride a factory, then waterfall reset", schedule: [["09:00", "12:00", "rays-bike-park", "anchor"], ["12:45", "13:45", "brandywine-falls", "supporting"]], lodging: ["Pittsburgh central", "East Pittsburgh with secure two-car parking"], fallback: "Use beginner terrain or spectate at Ray's; compress Brandywine when wet or crowded." },
  { day: 8, date: "2026-10-11", sleep_city: "Breezewood, PA", theme: "Orthodox Sunday and hands-on steel", schedule: [["08:15", "11:00", "st-nicholas-pittsburgh", "anchor"], ["12:30", "15:00", "carrie-graffiti", "anchor"]], lodging: ["Breezewood with staffed late check-in", "Everett edge with secure two-car parking"], fallback: "All Saints remains the worship fallback; Carrie is exact-date and must retain its arrival buffer." },
  { day: 9, date: "2026-10-12", sleep_city: "Nazareth / Bethlehem, PA", theme: "Dark road, then candy line", schedule: [["08:30", "11:20", "old-pa-pike-rays-hill", "anchor"], ["13:30", "14:30", "hershey-candy-bar", "anchor"]], lodging: ["Nazareth / Bethlehem with safe two-room inventory", "Easton corridor with secure parking"], fallback: "Heavy rain cancels the tunnel and moves Hershey earlier; no one enters without a headlamp and backup light." },
  { day: 10, date: "2026-10-13", sleep_city: "Danbury, CT", theme: "Guitars, outlets, waterfall", schedule: [["10:00", "11:20", "martin-guitar", "anchor"], ["12:00", "14:30", "pocono-premium-outlets", "anchor"], ["15:30", "16:30", "raymondskill-falls", "supporting"]], lodging: ["Danbury near I-84", "Danbury west with secure parking"], fallback: "Wet footing cancels Raymondskill; Martin's registered tour and the shopping block win." },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", theme: "Railbed calm to mechanical finale", schedule: [["09:50", "10:35", "westville-grand-trunk", "supporting"], ["13:00", "14:15", "f1-arcade-boston", "anchor"]], lodging: ["Boston Logan hotel with confirmed shuttle", "East Boston or Revere with verified airport transfer"], fallback: "Return both cars by 12:10 before Team Racing; live Boston traffic and the rental deadline control the morning." }
];

export const BOOKING_PRIORITIES = [
  { place_id: "carrie-graffiti", urgency: "red-lock-first", reason: "Exact Oct. 11 start, only 15 participants and advance purchase required." },
  { place_id: "sugar-agora", urgency: "red-lock-first", reason: "Exact Oct. 9 route-defining show; use the official ticket path." },
  { place_id: "eden-kazoo", urgency: "red-lock-first", reason: "Confirm Thursday factory operation, docent availability and the make-your-own experience." },
  { place_id: "martin-guitar", urgency: "red-lock-first", reason: "The Oct. 13 weekday factory tour requires preregistration." },
  { place_id: "riverworks-racing-zipline", urgency: "red-lock-first", reason: "Exact October inventory and weather-sensitive operation remain unresolved." },
  { place_id: "five-wits-syracuse", urgency: "tier-b", reason: "Reserve the selected two-adventure package once live pricing is accepted." },
  { place_id: "hershey-candy-bar", urgency: "tier-b", reason: "Oct. 12 holiday-period inventory may compress." },
  { place_id: "rays-bike-park", urgency: "tier-b", reason: "Reserve rental bikes if the group needs them." },
  { place_id: "f1-arcade-boston", urgency: "tier-b", reason: "Book Team Racing around the actual two-car return deadline." },
  { place_id: "rock-hall", urgency: "tier-b", reason: "Timed admission protects the Garage-first Cleveland sequence." }
];

export const NEW_SOURCES = [
  ["src-v7-naismith", "Naismith Memorial Basketball Hall of Fame", "official", "https://www.hoophall.com/plan-your-experience/", ["daily hours", "$34 adult", "Center Court"]],
  ["src-v7-empac", "EMPAC Visit", "official", "https://www.empac.rpi.edu/visit", ["weekday public access", "building and acoustics"]],
  ["src-v7-lock-e20", "New York State Canal Corporation", "government", "https://www.canals.ny.gov/", ["Lock E20", "2026 navigation season"]],
  ["src-v7-five-wits", "5 Wits Syracuse", "official", "https://5-wits.com/syracuse/", ["immersive adventure format", "live booking required"]],
  ["src-v7-strong", "The Strong National Museum of Play", "official", "https://www.museumofplay.org/", ["play-first exhibits", "admission floor"]],
  ["src-v7-high-falls", "City of Rochester High Falls", "government", "https://www.cityofrochester.gov/departments/bureau-communications/high-falls", ["High Falls district", "Pont de Rennes"]],
  ["src-v7-riverworks", "Buffalo RiverWorks Adventures", "official", "https://buffaloriverworks.com/adventure/", ["racing zipline", "$45 full course", "safety gates"]],
  ["src-v7-presque-isle", "Pennsylvania DCNR — Presque Isle", "government", "https://www.dcnr.pa.gov/StateParks/FindAPark/PresqueIsleStatePark/", ["park access", "Great Lakes weather"]],
  ["src-v7-rockhall", "Rock & Roll Hall of Fame", "official", "https://rockhall.com/visit/", ["Garage", "current operation", "admission planning price"]],
  ["src-v7-superelectric", "Superelectric Pinball Parlor", "official", "https://www.superelectric.tv/", ["all-you-can-play format", "$8 admission"]],
  ["src-v7-rays", "Ray's Indoor Mountain Bike Park", "official", "https://raysmtb.com/", ["Oct. 2 regular season", "weekend admission", "rental price"]],
  ["src-v7-st-nicholas", "St. Nicholas Greek Orthodox Cathedral", "official", "https://www.stnickspgh.org/", ["Sunday Orthros", "Divine Liturgy"]],
  ["src-v7-carrie-graffiti", "Rivers of Steel — Hands-On Graffiti", "official", "https://riversofsteel.com/experiences/hands-on-graffiti/", ["Oct. 11 12:30", "$35", "15-person cap"]],
  ["src-v7-pike2bike", "Pike2Bike", "official-trail", "https://www.pike2bike.com/", ["dawn to dusk", "headlamps", "trail rules"]],
  ["src-v7-hershey", "Hershey's Chocolate World", "official", "https://www.chocolateworld.com/create-your-own-candy-bar.html", ["45-minute activity", "$29.95 starting price"]],
  ["src-v7-martin", "C. F. Martin & Co. Visit Us", "official", "https://www.martinguitar.com/visit-us.html", ["weekday factory tour", "$10", "preregistration"]],
  ["src-v7-pocono", "Pocono Premium Outlets", "official", "https://www.premiumoutlets.com/outlet/pocono", ["roughly 100 stores", "address"]],
  ["src-v7-raymondskill", "National Park Service — Raymondskill Creek Trail", "government", "https://www.nps.gov/dewa/planyourvisit/raymondskill-creek-trail.htm", ["steep uneven trail", "waterfall context"]],
  ["src-v7-westville", "USACE — Westville Lake", "government", "https://www.nae.usace.army.mil/Missions/Recreation/Westville-Lake/", ["recreation area", "trail access"]],
  ["src-v7-f1", "F1 Arcade Boston", "official", "https://f1arcade.com/us/boston", ["Wednesday hours", "Team Racing for 4-18", "four races per driver"]],
  ["src-v7-herschell", "Herschell Carrousel Factory Museum", "official", "https://www.carrouselmuseum.org/", ["factory museum", "carousel ride"]],
  ["src-v7-escape-city", "Escape City Buffalo", "official", "https://escapecitybuffalo.com/", ["The Hangover room"]],
  ["src-v7-perplexity", "Perplexity Games", "official", "https://www.perplexitygames.com/", ["Eliot Ness", "Clockwork Caper"]]
].map(([id, title, source_type, url, claims]) => ({ id, title, source_type, url, claims, verified_at: VERIFIED_AT }));

// Contextual clones are explicit: no regional image is presented as exact
// photography of a new V2 place.
export const IMAGE_CONTEXT_SOURCE = {
  "naismith-center-court": "springfield-museums",
  "erie-canal-lock-e20": "cohoes-falls",
  "five-wits-syracuse": "syracuse-art-museum",
  "strong-museum-play": "rmsc-electricity",
  "high-falls-pont-de-rennes": "genesee-brew-house",
  "riverworks-racing-zipline": "genesee-brew-house",
  "presque-isle-movement": "trec-presque-isle",
  "superelectric-pinball": "christmas-story-house",
  "rays-bike-park": "crawford-auto",
  "st-nicholas-pittsburgh": "all-saints-canonsburg",
  "carrie-graffiti": "mack-museum",
  "old-pa-pike-rays-hill": "old-bedford-village",
  "hershey-candy-bar": "eden-kazoo",
  "martin-guitar": "eden-kazoo",
  "pocono-premium-outlets": "mgm-springfield-art",
  "raymondskill-falls": "brandywine-falls",
  "westville-grand-trunk": "peebles-island",
  "f1-arcade-boston": "danbury-fair-carousel",
  "riverworks-high-ropes": "genesee-brew-house",
  "herschell-carrousel": "danbury-fair-carousel",
  "escape-city-hangover": "rmsc-electricity",
  "perplexity-eliot-ness": "buckland-museum",
  "perplexity-clockwork-caper": "buckland-museum"
};
