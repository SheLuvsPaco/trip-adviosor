// Authored content for the Route 08 Energy Rebuild V2.
// Source: Energy Rebuild Routes/Route08_Lemurs_Living_Stone_Strange_Worlds_Rebuild.md

export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
export const VERIFIED_AT = "2026-09-01";

// The 39 source-visible originals the brief status-tags individually.
export const ORIGINAL_IDS = [
  "new-britain-art", "dia-beacon", "kemerer-decorative-arts", "moravian-book-shop",
  "reading-pagoda-overlook", "goggleworks", "demuth-museum", "amish-farm-house", "tanger-lancaster",
  "shenandoah-valley-museum", "shenandoah-civil-war-museum", "handley-library", "natural-bridge",
  "roanoke-city-market", "texas-tavern-roanoke", "duke-lemur-bts", "duke-chapel-gardens",
  "american-tobacco-campus", "21c-museum-durham", "bull-city-escape", "petersburg-battlefield",
  "pocahontas-island", "hollywood-cemetery", "gwarbar", "hotel-greene", "richmond-orthodox",
  "poe-museum", "maryland-state-house", "kunta-kinte-haley-memorial", "hagley",
  "rockwood-park-gardens", "met-cloisters", "bruce-museum", "fish-church-stamford",
  "karaoke-on-main", "gardner-museum", "black-heritage-trail-short", "african-meeting-house",
  "old-south-meeting-house"
];

// Package-only alternates the brief could not name from its sources, preserved rather than deleted.
export const LEGACY_ALTERNATIVE_IDS = [
  "wadsworth-atheneum", "bear-mountain-perkins", "mid-atlantic-air", "stonewall-headquarters",
  "woodrow-wilson", "virginia-transportation", "keystone-tractor", "virginia-fine-arts",
  "brandywine-art", "paterson-museum", "boston-public-library"
];

export const NEW_CORE_IDS = [
  "ragged-mountain", "steep-rock", "mt-tammany", "crane-manor", "blandy-farm",
  "little-stony-man-climb", "devils-marbleyard", "fairy-stone-hunt", "james-river-rafting",
  "fredericksburg-riverfront", "bombay-hook", "jersey-gardens", "big-snow-american-dream",
  "dinosaur-state-park"
];

export const NEW_OPTIONAL_IDS = [
  "captured-lv-mayan", "wolf-sanctuary-pa", "lakota-wolf-preserve", "ringing-rocks-park",
  "escape-on-queen", "blue-ridge-tunnel", "natural-chimneys", "duke-walking-with-lemurs",
  "carolina-tiger-rescue", "hidden-gems-zelderon", "gnome-raven-magic-lamp", "bam-kazam"
];

export const CORE_IDS = [
  "ragged-mountain", "steep-rock",
  "mt-tammany",
  "goggleworks",
  "crane-manor", "blandy-farm",
  "little-stony-man-climb",
  "natural-bridge", "devils-marbleyard",
  "fairy-stone-hunt", "duke-lemur-bts", "pocahontas-island", "hotel-greene",
  "richmond-orthodox", "james-river-rafting", "fredericksburg-riverfront",
  "bombay-hook",
  "jersey-gardens", "big-snow-american-dream",
  "dinosaur-state-park"
];

export const OPTIONAL_IDS = new Set([
  "dia-beacon", "tanger-lancaster", "shenandoah-valley-museum", "duke-chapel-gardens",
  "petersburg-battlefield", "poe-museum", "hagley", "gardner-museum",
  "black-heritage-trail-short", "african-meeting-house",
  ...NEW_OPTIONAL_IDS
]);

export const SOCIAL_IDS = new Set(["texas-tavern-roanoke", "gwarbar", "karaoke-on-main"]);

export const FLEX_IDS = new Set([
  "moravian-book-shop", "reading-pagoda-overlook", "handley-library", "roanoke-city-market",
  "american-tobacco-campus", "hollywood-cemetery", "maryland-state-house",
  "kunta-kinte-haley-memorial", "rockwood-park-gardens", "fish-church-stamford"
]);

export const ARCHIVE_IDS = new Set([
  "new-britain-art", "kemerer-decorative-arts", "demuth-museum", "amish-farm-house",
  "shenandoah-civil-war-museum", "21c-museum-durham", "bull-city-escape", "met-cloisters",
  "bruce-museum", "old-south-meeting-house"
]);

// Every non-core place is dated to the day whose corridor it sits on, so the app can surface it
// in that day's optional/flex picker.
export const NON_CORE_DAY_DATES = {
  "new-britain-art": "2026-10-04", "wadsworth-atheneum": "2026-10-04",
  "dia-beacon": "2026-10-05", "moravian-book-shop": "2026-10-05", "captured-lv-mayan": "2026-10-05",
  "lakota-wolf-preserve": "2026-10-05", "kemerer-decorative-arts": "2026-10-05",
  "bear-mountain-perkins": "2026-10-05",
  "reading-pagoda-overlook": "2026-10-06", "tanger-lancaster": "2026-10-06",
  "wolf-sanctuary-pa": "2026-10-06", "ringing-rocks-park": "2026-10-06",
  "demuth-museum": "2026-10-06", "amish-farm-house": "2026-10-06", "mid-atlantic-air": "2026-10-06",
  "escape-on-queen": "2026-10-07", "shenandoah-valley-museum": "2026-10-07",
  "handley-library": "2026-10-07", "shenandoah-civil-war-museum": "2026-10-07",
  "stonewall-headquarters": "2026-10-07",
  "blue-ridge-tunnel": "2026-10-08", "natural-chimneys": "2026-10-08", "woodrow-wilson": "2026-10-08",
  "roanoke-city-market": "2026-10-09", "texas-tavern-roanoke": "2026-10-09",
  "virginia-transportation": "2026-10-09",
  "duke-chapel-gardens": "2026-10-10", "american-tobacco-campus": "2026-10-10",
  "duke-walking-with-lemurs": "2026-10-10", "carolina-tiger-rescue": "2026-10-10",
  "petersburg-battlefield": "2026-10-10", "hollywood-cemetery": "2026-10-10",
  "hidden-gems-zelderon": "2026-10-10", "gwarbar": "2026-10-10", "21c-museum-durham": "2026-10-10",
  "bull-city-escape": "2026-10-10", "keystone-tractor": "2026-10-10",
  "poe-museum": "2026-10-11", "gnome-raven-magic-lamp": "2026-10-11",
  "maryland-state-house": "2026-10-11", "kunta-kinte-haley-memorial": "2026-10-11",
  "virginia-fine-arts": "2026-10-11",
  "hagley": "2026-10-12", "rockwood-park-gardens": "2026-10-12", "brandywine-art": "2026-10-12",
  "bam-kazam": "2026-10-13", "fish-church-stamford": "2026-10-13",
  "karaoke-on-main": "2026-10-13", "met-cloisters": "2026-10-13", "bruce-museum": "2026-10-13",
  "paterson-museum": "2026-10-13",
  "gardner-museum": "2026-10-14", "black-heritage-trail-short": "2026-10-14",
  "african-meeting-house": "2026-10-14", "old-south-meeting-house": "2026-10-14",
  "boston-public-library": "2026-10-14"
};

export const NEW_SOURCES = [
  ["src-v8-ragged", "Southington Land Trust / Ragged Mountain Memorial Preserve", "official", "https://www.southingtonlandtrust.org/", ["traprock ridge trails", "free access", "short ridge sampler"]],
  ["src-v8-steep-rock", "Steep Rock Association", "official", "https://steeprockassoc.org/", ["Shepaug River preserve", "roughly 180-foot hand-cut railroad tunnel", "free access"]],
  ["src-v8-tammany", "National Park Service — Delaware Water Gap NRA", "government", "https://www.nps.gov/dewa/planyourvisit/hiking.htm", ["Red Dot Trail about 1.2 miles and 1,200 feet of gain", "roughly 3-mile loop with Pahaquarry", "no entrance fee for this trailhead", "2026 closures elsewhere in the recreation area"]],
  ["src-v8-goggleworks", "GoggleWorks Center for the Arts", "official", "https://www.goggleworks.org/", ["private glassblowing workshop for 4-7 people", "$100 per person", "participants shape a finished object"]],
  ["src-v8-clueiq", "Clue IQ", "official", "https://www.clueiq.com/", ["Crane Manor 75 minutes", "4-8 recommended players", "multi-linear largest game", "Best of Morty 2022-2025", "$36-60 plus Maryland 10% admissions tax"]],
  ["src-v8-blandy", "University of Virginia — Blandy Experimental Farm", "official", "https://blandy.virginia.edu/", ["State Arboretum of Virginia", "research station grounds", "dawn to dusk", "free"]],
  ["src-v8-shenandoah-climb", "Shenandoah guiding operators", "official", "https://www.nps.gov/shen/planyourvisit/climbing.htm", ["Little Stony Man greenstone", "roughly 20-110 feet single pitch", "beginner through intermediate guiding", "conflicting 2026 operator calendars", "$175 scheduled / about $235 private"]],
  ["src-v8-shenandoah-fees", "National Park Service — Shenandoah", "government", "https://www.nps.gov/shen/planyourvisit/fees.htm", ["$30 per private vehicle for seven days", "two cars up to $60 group"]],
  ["src-v8-natural-bridge", "Virginia State Parks — Natural Bridge", "government", "https://www.dcr.virginia.gov/state-parks/natural-bridge", ["roughly 200-foot limestone arch", "Cedar Creek runs beneath", "$9 adult admission", "major stair descent with arranged alternatives"]],
  ["src-v8-marbleyard", "USDA Forest Service — George Washington & Jefferson National Forests", "government", "https://www.fs.usda.gov/gwj", ["Belfast Trail to Devils Marbleyard", "quartzite boulder field", "free", "wet rock materially changes risk"]],
  ["src-v8-fairy-stone", "Virginia State Parks — Fairy Stone", "government", "https://www.dcr.virginia.gov/state-parks/fairy-stone", ["designated staurolite hunting area", "small personal collection permitted", "$7 per car standard parking"]],
  ["src-v8-duke-lemur", "Duke Lemur Center", "official", "https://lemur.duke.edu/", ["Behind the Scenes year-round", "private for 1-4 people", "$400 per group plus tax", "afternoon aye-aye chance", "reservation mandatory"]],
  ["src-v8-duke-walking", "Duke Lemur Center", "official", "https://lemur.duke.edu/", ["Walking with Lemurs", "Oct-Apr inventory released week-of only", "weather and staffing dependent"]],
  ["src-v8-hotel-greene", "Hotel Greene", "official", "https://www.hotelgreene.com/", ["theatrical mini-golf", "late Saturday operation", "about $18 per person for the activity"]],
  ["src-v8-rva-paddle", "RVA Paddlesports", "official", "https://rvapaddlesports.com/", ["Lower James three hours", "$75 per person", "Class II-IV", "Reedy Creek to 14th Street", "beginner Upper James alternative"]],
  ["src-v8-fredericksburg", "City of Fredericksburg", "government", "https://www.fredericksburgva.gov/", ["Riverfront Park on the Rappahannock", "free", "deliberate drive-break reset"]],
  ["src-v8-bombay-hook", "U.S. Fish & Wildlife Service", "government", "https://www.fws.gov/refuge/bombay-hook", ["one of the largest Mid-Atlantic tidal salt marshes", "Atlantic Flyway", "$4 per vehicle covering up to four occupants", "2026 hunting closures Oct 9, Nov 13, Dec 16"]],
  ["src-v8-jersey-gardens", "The Mills at Jersey Gardens", "official", "https://www.simon.com/mall/the-mills-at-jersey-gardens", ["200+ stores", "free admission", "New Jersey clothing and shoe tax treatment"]],
  ["src-v8-big-snow", "Big SNOW American Dream", "official", "https://www.bigsnowamericandream.com/", ["SNOW Day package $79.99 plus tax", "two hours of slope access", "equipment, outerwear and helmet included", "Tuesday slope hours 1pm-8pm", "advance timed ticket only"]],
  ["src-v8-dinosaur", "Connecticut DEEP — Dinosaur State Park", "government", "https://portal.ct.gov/deep/state-parks/parks/dinosaur-state-park", ["750+ in-situ early Jurassic footprints", "Exhibit Center Wednesday 9:00-16:30", "track casting May 1-Oct 31, 9:00-15:30", "$6 adult admission", "casting takes 30-45 minutes"]],
  ["src-v8-captured-lv", "Captured LV", "official", "https://capturedlv.com/", ["Mayan Temple room", "four-person compatible", "Lehigh Valley"]],
  ["src-v8-wolf-sanctuary", "Wolf Sanctuary of PA", "official", "https://wolfsanctuarypa.org/", ["wolf rescue tours", "October public and private formats"]],
  ["src-v8-lakota-wolf", "Lakota Wolf Preserve", "official", "https://www.lakotawolf.org/", ["wolf, fox, bobcat and lynx observation", "outdoor conservation setting"]],
  ["src-v8-ringing-rocks", "Bucks County Parks", "government", "https://www.buckscounty.gov/", ["128-acre geological formation", "boulder field", "dawn to dusk"]],
  ["src-v8-escape-queen", "Escape on Queen", "official", "https://www.escapeonqueen.com/", ["Post Office Pursuit 90 minutes", "published format starts at five players"]],
  ["src-v8-blue-ridge-tunnel", "Nelson County / Claudius Crozet Blue Ridge Tunnel", "government", "https://www.nelsoncounty-va.gov/blueridgetunnel/", ["4,273-foot unlit tunnel", "headlamp required", "sunrise to sunset"]],
  ["src-v8-natural-chimneys", "Natural Chimneys Park", "government", "https://www.uvrpa.org/", ["limestone towers", "short trails", "lower-exertion geology alternative"]],
  ["src-v8-carolina-tiger", "Carolina Tiger Rescue", "official", "https://carolinatigerrescue.org/", ["adults-only twilight tour", "Fri-Sun through October", "1.5-2 hours", "$32 plus fees"]],
  ["src-v8-hidden-gems", "Hidden Gems Escape", "official", "https://www.hiddengemsescape.com/", ["Curse of Zelderon", "enthusiast-positive current signal"]],
  ["src-v8-gnome-raven", "Gnome & Raven", "official", "https://www.gnomeandraven.com/", ["Magic Lamp immersive room", "award-recognized", "four-player compatible"]],
  ["src-v8-bam-kazam", "Bam Kazam", "official", "https://bamkazam.com/", ["hybrid physical and mental challenge rooms", "American Dream location"]]
].map(([id, publisher, type, url, supports]) => ({ id, publisher, type, url, supports, verified_at: VERIFIED_AT }));

const cost = (low, high = low, group = null, type = low === 0 ? "free" : "per-person", note = "") => ({
  amount_per_person: low,
  low,
  high,
  amount_per_group: group,
  price_type: type,
  status: high === low ? "verified" : "planning-range",
  note
});

// Explicit source mapping for the newly researched optional places.
export const OPTIONAL_SOURCE_IDS = {
  "captured-lv-mayan": ["src-v8-captured-lv"],
  "wolf-sanctuary-pa": ["src-v8-wolf-sanctuary"],
  "lakota-wolf-preserve": ["src-v8-lakota-wolf"],
  "ringing-rocks-park": ["src-v8-ringing-rocks"],
  "escape-on-queen": ["src-v8-escape-queen"],
  "blue-ridge-tunnel": ["src-v8-blue-ridge-tunnel"],
  "natural-chimneys": ["src-v8-natural-chimneys"],
  "duke-walking-with-lemurs": ["src-v8-duke-walking"],
  "carolina-tiger-rescue": ["src-v8-carolina-tiger"],
  "hidden-gems-zelderon": ["src-v8-hidden-gems"],
  "gnome-raven-magic-lamp": ["src-v8-gnome-raven"],
  "bam-kazam": ["src-v8-bam-kazam"]
};

export const CORE_CONFIG = {
  "ragged-mountain": { date: "2026-10-04", bucket: "geology-wild-terrain", texture: "WILD", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], weather: true, skip: "Take a short ridge segment rather than a full loop on arrival day; shorten or skip exposed rock when wet.", sourceIds: ["src-v8-ragged"] },
  "steep-rock": { date: "2026-10-04", bucket: "geology-wild-terrain", texture: "EXPLORE", interaction: 2, cost: cost(0), risk: "green", best: ["viki", "gora"], secondary: ["sheluvspaco", "stivka"], weather: true, skip: "An easy-to-moderate river and tunnel sampler; there is no mileage to chase.", sourceIds: ["src-v8-steep-rock"] },
  "mt-tammany": { date: "2026-10-05", bucket: "geology-wild-terrain", texture: "WILD", interaction: 4, cost: cost(0), risk: "yellow", fallback: "lakota-wolf-preserve", best: ["gora"], secondary: ["viki", "sheluvspaco", "stivka"], weather: true, highPhysicality: true, skip: "Kittatinny Point and a lower Dunnfield Creek sampler replace the summit for anyone who does not want the full 1,200-foot climb.", sourceIds: ["src-v8-tammany"] },
  "goggleworks": { date: "2026-10-06", bucket: "maker-creative-industrial", texture: "DISCOVER", interaction: 3, cost: cost(100, 100, 400), risk: "yellow", best: ["viki", "sheluvspaco"], secondary: ["gora", "stivka"], reservation: "required", handsOn: true, skip: "Each participant works their own piece; anyone can watch the hot shop instead.", sourceIds: ["src-v8-goggleworks"] },
  "crane-manor": { date: "2026-10-07", bucket: "puzzle-immersive", texture: "SOLVE", interaction: 3, cost: cost(39.6, 66, 158.4, "per-person", "$36-60 per person plus Maryland's 10% admissions tax."), risk: "yellow", fallback: "captured-lv-mayan", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], reservation: "required", escapeRoom: true, skip: "A 75-minute room built for four to eight; everyone plays at their own pace.", sourceIds: ["src-v8-clueiq"] },
  "blandy-farm": { date: "2026-10-07", bucket: "living-systems-conservation", texture: "DISCOVER", interaction: 2, cost: cost(0), risk: "green", best: ["viki", "gora"], secondary: ["sheluvspaco", "stivka"], weather: true, skip: "Deliberately quiet after the puzzle room; the grounds are flat and open dawn to dusk.", sourceIds: ["src-v8-blandy"] },
  "little-stony-man-climb": { date: "2026-10-08", bucket: "geology-wild-terrain", texture: "MOVE", interaction: 4, cost: cost(190, 250, 760, "per-person", "Guiding at $175 scheduled or about $235 private, plus up to $15 per person for two Shenandoah vehicle passes."), risk: "red", fallback: "blue-ridge-tunnel", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], reservation: "required", weather: true, highPhysicality: true, bookingConflict: true, skip: "The guides call it beginner-friendly, but ask the selected operator what a non-climbing or partial participant can safely do before booking.", sourceIds: ["src-v8-shenandoah-climb", "src-v8-shenandoah-fees"] },
  "natural-bridge": { date: "2026-10-09", bucket: "geology-wild-terrain", texture: "EXPLORE", interaction: 2, cost: cost(9, 9, 36), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "A major stair descent; the park can arrange alternative transport when requested in advance.", sourceIds: ["src-v8-natural-bridge"] },
  "devils-marbleyard": { date: "2026-10-09", bucket: "geology-wild-terrain", texture: "WILD", interaction: 4, cost: cost(0), risk: "yellow", fallback: "natural-chimneys", best: ["gora"], secondary: ["viki", "sheluvspaco", "stivka"], weather: true, wetSurface: true, highPhysicality: true, skip: "Hike to the boulder-field base and explore the lower edge without committing to the full scramble.", sourceIds: ["src-v8-marbleyard"] },
  "fairy-stone-hunt": { date: "2026-10-10", bucket: "geology-wild-terrain", texture: "DISCOVER", interaction: 3, cost: cost(3.5, 3.5, 14, "group-share", "Two cars at $7 standard parking."), risk: "green", best: ["viki", "gora"], secondary: ["sheluvspaco", "stivka"], weather: true, handsOn: true, skip: "A self-guided ground search; stop whenever the group has had enough.", sourceIds: ["src-v8-fairy-stone"] },
  "duke-lemur-bts": { date: "2026-10-10", bucket: "living-systems-conservation", texture: "DISCOVER", interaction: 2, cost: cost(100, 100, 400, "group-share", "$400 per group plus tax for the private 1-4 person Behind the Scenes."), risk: "red", fallback: "carolina-tiger-rescue", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required", rareAnimal: true, skip: "Guided and paced by staff; the afternoon slot is what gives the aye-aye chance.", sourceIds: ["src-v8-duke-lemur"] },
  "pocahontas-island": { date: "2026-10-10", bucket: "truth-in-place", texture: "EXPLORE", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], weather: true, skip: "Keep the visit compact so it stays a place-based stop rather than a lecture." },
  "hotel-greene": { date: "2026-10-10", bucket: "strange-built-environment", texture: "WEIRD", interaction: 3, cost: cost(18, 18, 72), risk: "green", best: ["viki", "sheluvspaco"], secondary: ["gora", "stivka"], skip: "Theatrical mini-golf; food and drink are optional and excluded from the total.", sourceIds: ["src-v8-hotel-greene"] },
  "richmond-orthodox": { date: "2026-10-11", bucket: "sacred-worship", texture: "WORSHIP", interaction: 2, cost: cost(0), risk: "green", best: ["stivka"], secondary: ["viki", "gora", "sheluvspaco"], skip: "Protect the service rather than treating it as a twenty-minute architecture stop." },
  "james-river-rafting": { date: "2026-10-11", bucket: "water-adventure", texture: "MOVE", interaction: 4, cost: cost(75, 75, 300), risk: "red", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], reservation: "required", weather: true, highPhysicality: true, skip: "The operator's beginner Upper James Class I-II trip swaps in without abandoning the river identity.", sourceIds: ["src-v8-rva-paddle"] },
  "fredericksburg-riverfront": { date: "2026-10-11", bucket: "quiet-reset", texture: "RELAX", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "A 25-30 minute river reset by design, inserted to break the post-rafting drive.", sourceIds: ["src-v8-fredericksburg"] },
  "bombay-hook": { date: "2026-10-12", bucket: "living-systems-conservation", texture: "WILD", interaction: 2, cost: cost(2, 2, 8, "group-share", "$4 per vehicle covering up to four occupants; two cars."), risk: "green", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], weather: true, skip: "The wildlife drive is done from the car with one short trail stop; Oct 12 is not a 2026 hunting-closure date.", sourceIds: ["src-v8-bombay-hook"] },
  "jersey-gardens": { date: "2026-10-13", bucket: "shopping", texture: "SHOP", interaction: 1, cost: cost(0), risk: "green", best: ["viki"], secondary: ["gora", "stivka", "sheluvspaco"], skip: "Free to enter; personal purchases are excluded from the route total.", sourceIds: ["src-v8-jersey-gardens"] },
  "big-snow-american-dream": { date: "2026-10-13", bucket: "strange-built-environment", texture: "MOVE", interaction: 4, cost: cost(79.99, 79.99, 319.96, "per-person-plus-tax", "SNOW Day package before New Jersey tax; two hours of slope access with equipment, outerwear and helmet."), risk: "yellow", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], reservation: "required", highPhysicality: true, skip: "The beginner Terrain Based Learning area is included, so nobody has to take the full slope.", sourceIds: ["src-v8-big-snow"] },
  "dinosaur-state-park": { date: "2026-10-14", bucket: "geology-wild-terrain", texture: "DISCOVER", interaction: 3, cost: cost(6, 6, 24), risk: "green", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], museumLike: true, handsOn: true, weather: true, skip: "Casting takes 30-45 minutes and is optional; the in-situ trackway stands on its own in bad weather.", sourceIds: ["src-v8-dinosaur"] }
};

export const PLACE_OVERRIDES = {
  "ragged-mountain": ["Ragged Mountain Memorial Preserve", "traprock-ridge-preserve", "Southington", "CT", "599 Wigwam Road, Southington, CT 06489", "A short basalt ridge sampler that opens the route with stone underfoot instead of an indoor gallery.", "It is the route's first contact with the living-stone theme, and it costs almost nothing in arrival-day energy."],
  "steep-rock": ["Steep Rock Preserve", "river-and-tunnel-preserve", "Washington Depot", "CT", "2 Tunnel Road, Washington Depot, CT 06794", "River, woods and a roughly 180-foot hand-cut railroad tunnel you walk straight through.", "The first strange environment of the route and a clean Viki-and-Gora crossover."],
  "mt-tammany": ["Mount Tammany — Red Dot / Pahaquarry Loop", "ridge-ascent", "Hardwick Township", "NJ", "Dunnfield Creek Natural Area, Hardwick Township, NJ 07825", "About 1.2 miles and 1,200 feet of gain up the Kittatinny ridge, returning on Pahaquarry for a three-mile loop.", "The payoff is not a viewpoint: the group physically climbs the ridge above the Delaware Water Gap."],
  "crane-manor": ["Clue IQ — Crane Manor", "escape-room", "Frederick", "MD", "103 South Carroll Street #1A, Frederick, MD 21701", "A 75-minute multi-linear mystery in Clue IQ's largest and most complex build, recommended for four to eight players.", "It wins the route's one traditional-room slot on exact four-person fit, runtime and enthusiast signal."],
  "blandy-farm": ["Blandy Experimental Farm & State Arboretum", "research-landscape", "Boyce", "VA", "400 Blandy Farm Lane, Boyce, VA 22620", "A University of Virginia research station wrapped around the State Arboretum, open dawn to dusk and free.", "Deliberately quiet after the puzzle room, and a living research landscape rather than another museum."],
  "little-stony-man-climb": ["Little Stony Man Guided Climb & Rappel", "guided-rock-climbing", "Shenandoah National Park", "VA", "Little Stony Man, Skyline Drive mile 41.7, Shenandoah National Park, VA 22835", "Single-pitch greenstone climbing and rappelling of roughly 20 to 110 feet, guided for beginner through intermediate.", "It is the clearest way to turn Shenandoah geology into an experience instead of another overlook sequence."],
  "devils-marbleyard": ["Devil's Marbleyard — Belfast Trail", "boulder-scramble", "Natural Bridge Station", "VA", "Devils Marbleyard Trailhead, Petites Gap Road, Natural Bridge Station, VA 24579", "A huge field of pale quartzite boulders where the memorable part is hand-and-foot movement across the rock.", "A short corridor move changes the geology completely, from walking under an arch to climbing over it."],
  "fairy-stone-hunt": ["Fairy Stone Hunt", "crystal-hunt", "Stuart", "VA", "Fairy Stone State Park, 967 Fairystone Lake Drive, Stuart, VA 24171", "A self-guided search of the designated hunting area for staurolite crystals, the cross-shaped fairy stones.", "It is a literal souvenir taken from the geology rather than bought in a shop."],
  "james-river-rafting": ["RVA Paddlesports — Lower James Rafting", "urban-whitewater-rafting", "Richmond", "VA", "RVA Paddlesports, 1511 Brook Road, Richmond, VA 23220", "Three hours of Class II-IV whitewater from Reedy Creek to 14th Street, straight through the Richmond skyline.", "The city becomes terrain instead of a chain of museums, on what the operator calls America's only urban Class IV run."],
  "fredericksburg-riverfront": ["Fredericksburg Riverfront Park", "river-reset", "Fredericksburg", "VA", "701 Sophia Street, Fredericksburg, VA 22401", "A short stop on the Rappahannock deliberately inserted between Richmond and Annapolis.", "It is not filler: it prevents a long post-rafting highway sit and gives the group half an hour by the river."],
  "bombay-hook": ["Bombay Hook National Wildlife Refuge", "tidal-marsh-refuge", "Smyrna", "DE", "2591 Whitehall Neck Road, Smyrna, DE 19977", "One of the largest remaining Mid-Atlantic tidal salt marshes, sitting directly on the Atlantic Flyway in peak October migration.", "The wildlife drive plus one short trail keeps it a living system rather than a checklist of overlooks."],
  "jersey-gardens": ["The Mills at Jersey Gardens", "outlet-shopping", "Elizabeth", "NJ", "651 Kapkowski Road, Elizabeth, NJ 07201", "New Jersey's large outlet and value centre with more than two hundred stores.", "This is the route's single major shopping block, which is why two smaller old ones were retired."],
  "big-snow-american-dream": ["Big SNOW American Dream", "indoor-snow-slope", "East Rutherford", "NJ", "1 American Dream Way, East Rutherford, NJ 07073", "A year-round indoor real-snow slope with two hours of access, equipment, outerwear and helmet included.", "The route steps out of Mid-Atlantic October and into a completely artificial climate for an afternoon."],
  "dinosaur-state-park": ["Dinosaur State Park — Trackway & Casting", "in-situ-trackway", "Rocky Hill", "CT", "400 West Street, Rocky Hill, CT 06067", "More than 750 early Jurassic footprints preserved in place under the dome, plus an outdoor station to cast a real Eubrontes track.", "A discovery finale where the group leaves with a 200-million-year-old footprint they made themselves."],
  "captured-lv-mayan": ["Captured LV — Mayan Temple", "escape-room", "Bethlehem", "PA", "Captured LV, Bethlehem, PA 18018", "A four-person-compatible Lehigh Valley escape room with strong enthusiast signal.", "A useful bad-weather swap on the Bethlehem night without displacing the corridor's stronger core."],
  "wolf-sanctuary-pa": ["Wolf Sanctuary of PA", "wolf-sanctuary", "Lititz", "PA", "465 Speedwell Forge Road, Lititz, PA 17543", "A working wolf-rescue sanctuary running public and private tours through October.", "Real conservation access that fits the route's living-systems thread without displacing the lemur anchor."],
  "lakota-wolf-preserve": ["Lakota Wolf Preserve", "wolf-preserve", "Columbia", "NJ", "89 Mount Pleasant Road, Columbia, NJ 07832", "Outdoor observation of wolves, foxes, bobcats and lynx in a preserve setting beside the Water Gap.", "It can replace Mount Tammany outright for a far less physical animal-focused day."],
  "ringing-rocks-park": ["Ringing Rocks Park", "boulder-field", "Upper Black Eddy", "PA", "Ringing Rocks Park, Upper Black Eddy, PA 18972", "A 128-acre county park built around a boulder field whose rocks ring when struck.", "A genuinely strange geological option on the Pennsylvania leg, open dawn to dusk and free."],
  "escape-on-queen": ["Escape on Queen — Post Office Pursuit", "escape-room", "Lancaster", "PA", "Escape on Queen, North Queen Street, Lancaster, PA 17603", "A 90-minute long-form room that is harder than the route's core puzzle but published for five players and up.", "Kept selectable because the concept is stronger; it stays out of core only on the group-size mismatch."],
  "blue-ridge-tunnel": ["Claudius Crozet Blue Ridge Tunnel", "unlit-rail-tunnel", "Afton", "VA", "Blue Ridge Tunnel, Afton, VA 22920", "A 4,273-foot unlit nineteenth-century rail tunnel walked by headlamp, open sunrise to sunset.", "The documented wet-weather fallback if the Shenandoah climb cannot run, and a strange environment in its own right."],
  "natural-chimneys": ["Natural Chimneys", "limestone-towers", "Mount Solon", "VA", "Natural Chimneys, Mount Solon, VA 22843", "Tall limestone towers above short, easy trails.", "The lower-exertion geology alternative when wet rock rules out the boulder scramble."],
  "duke-walking-with-lemurs": ["Duke — Walking with Lemurs", "rare-primate-walk", "Durham", "NC", "Duke Lemur Center, 3705 Erwin Road, Durham, NC 27705", "A barrier-free forest-proximity experience with free-ranging lemurs.", "A live upgrade rather than a booking: October to April inventory is only released week-of when weather and staffing allow."],
  "carolina-tiger-rescue": ["Carolina Tiger Rescue — Twilight Tour", "big-cat-sanctuary", "Pittsboro", "NC", "1940 Hanks Chapel Road, Pittsboro, NC 27312", "An adults-only sanctuary tour of ninety minutes to two hours, running Friday to Sunday through October.", "The route's rare-life fallback if the Duke Lemur Center cannot be booked."],
  "hidden-gems-zelderon": ["Hidden Gems — Curse of Zelderon", "escape-room", "Richmond", "VA", "Hidden Gems Escape, Richmond, VA 23220", "A traditional escape room with strong current enthusiast signal.", "Kept optional because Richmond already carries rafting and Hotel Greene in the core."],
  "gnome-raven-magic-lamp": ["Gnome & Raven — Magic Lamp", "immersive-room", "Richmond", "VA", "Gnome & Raven, Richmond, VA 23230", "An award-recognised immersive room built for four players.", "A strong Richmond alternative if the group wants a puzzle instead of the river."],
  "bam-kazam": ["Bam Kazam at American Dream", "physical-challenge-rooms", "East Rutherford", "NJ", "Bam Kazam, American Dream, East Rutherford, NJ 07073", "Hybrid physical and mental challenge rooms in the same complex as the indoor snow slope.", "Better treated as a weather or energy swap than stacked on top of Big SNOW."]
};

export const DAY_PLANS = [
  { day: 1, date: "2026-10-04", sleep_city: "Danbury, CT", theme: "Basalt ridge to river tunnel", schedule: [["14:20", "15:30", "ragged-mountain", "anchor"], ["16:35", "18:00", "steep-rock", "anchor"]], lodging: ["West Danbury near the I-84 corridor", "Ridgefield or Brookfield with easier two-car parking"], notes: ["Outdoor ignition without turning arrival day into a marathon: stone first, wall art never."], fallback: "Wet rock: shorten the Ragged ridge segment and give the time to Steep Rock's river and tunnel." },
  { day: 2, date: "2026-10-05", sleep_city: "Bethlehem, PA", theme: "Climb the Water Gap", schedule: [["10:00", "13:00", "mt-tammany", "anchor"]], lodging: ["Historic Bethlehem within walking distance of Main Street", "Route 22 corridor with reliable two-room inventory"], notes: ["The measured Danbury run is split by a documented Milford, PA comfort break on the Delaware.", "NPS has 2026 closures elsewhere in the recreation area; recheck trail alerts 48 hours before."], fallback: "Anyone who does not want the 1,200-foot climb takes Kittatinny Point and the lower Dunnfield Creek sampler." },
  { day: 3, date: "2026-10-06", sleep_city: "Lancaster, PA", theme: "Make molten glass", schedule: [["10:30", "12:30", "goggleworks", "anchor"]], lodging: ["East Lancaster with secure two-car parking", "Lancaster city centre near the market"], notes: ["The old arts-centre visit survives only because it converted into a private hands-on workshop for four."], fallback: "Reading Pagoda is the quick visual overlook if the workshop slot moves; Tanger Lancaster only if the group deliberately wants shopping here." },
  { day: 4, date: "2026-10-07", sleep_city: "Winchester, VA", theme: "Elite puzzle, then research landscape", schedule: [["11:00", "12:30", "crane-manor", "anchor"], ["14:00", "15:15", "blandy-farm", "supporting"]], lodging: ["West Winchester near the Route 37 corridor", "Old Town Winchester within walking distance of the pedestrian mall"], notes: ["Brain-first morning, deliberately quiet outdoor afternoon."], fallback: "If Crane Manor is unavailable, Captured LV in the Lehigh Valley is the documented room swap." },
  { day: 5, date: "2026-10-08", sleep_city: "Staunton, VA", theme: "Shenandoah greenstone", schedule: [["09:00", "15:00", "little-stony-man-climb", "anchor"]], lodging: ["Downtown Staunton near the Wharf district", "I-81 corridor with easier parking"], notes: ["One technical anchor; do not pad the day.", "Two 2026 operator calendars conflict on Thursday availability. Get written confirmation for Oct 8 before treating this as locked.", "Staunton replaces the old push through to Roanoke so a full technical day is not followed by a late drive."], fallback: "If neither the scheduled nor the private guide can confirm, activate the Blue Ridge Tunnel and Natural Chimneys package rather than fabricating availability." },
  { day: 6, date: "2026-10-09", sleep_city: "Roanoke, VA", theme: "Limestone arch to boulder field", schedule: [["09:30", "11:15", "natural-bridge", "anchor"], ["11:35", "14:45", "devils-marbleyard", "anchor"]], lodging: ["Downtown Roanoke near the market", "Roanoke I-581 corridor with secure parking"], notes: ["Signature geology day: walk under a 200-foot arch, then move hand-and-foot across quartzite."], fallback: "Wet boulders materially change risk. In rain, use Natural Chimneys or the Blue Ridge Tunnel instead of forcing the scramble." },
  { day: 7, date: "2026-10-10", sleep_city: "Richmond, VA", theme: "Crystals, aye-ayes and a theatrical course", schedule: [["08:30", "09:30", "fairy-stone-hunt", "anchor"], ["13:30", "15:30", "duke-lemur-bts", "anchor"], ["17:40", "18:25", "pocahontas-island", "supporting"], ["19:30", "21:30", "hotel-greene", "anchor"]], lodging: ["Richmond Monroe Ward or the Fan", "Scott's Addition with secure two-car parking"], notes: ["The route's longest driving day at 418 measured minutes, but every drive is capped by a real stop and no single leg runs beyond 153 minutes.", "The Duke Behind the Scenes afternoon is what gives the aye-aye chance, and it is a hard reservation."], fallback: "If Duke cannot be booked, Carolina Tiger Rescue's twilight tour is the documented rare-life replacement." },
  { day: 8, date: "2026-10-11", sleep_city: "Annapolis, MD", theme: "Orthodox Sunday, then urban Class IV", schedule: [["08:15", "11:15", "richmond-orthodox", "anchor"], ["12:30", "15:30", "james-river-rafting", "anchor"], ["16:40", "17:10", "fredericksburg-riverfront", "supporting"]], lodging: ["Annapolis historic district within walking distance of the water", "Parole or the US-50 corridor with easier parking"], notes: ["Protect the liturgy rather than using it as a photo stop; confirm the post-liturgy raft departure.", "Richmond sunset on Oct 11 is about 18:38, so the technical river work stays well before dark."], fallback: "If Class IV is not comfortable, the operator's beginner Upper James Class I-II trip keeps the river identity." },
  { day: 9, date: "2026-10-12", sleep_city: "Bensalem, PA", theme: "Atlantic Flyway marsh", schedule: [["10:30", "13:00", "bombay-hook", "anchor"]], lodging: ["Bensalem near the I-95 corridor", "Trevose with reliable two-room inventory"], notes: ["Monday Oct 12 is not one of the refuge's 2026 hunting-closure dates, which makes it a clean holiday anchor.", "Download the entrance pass before arrival; connectivity at the refuge can be limited."], fallback: "Storm or closure: Hagley's water-powered industrial landscape is the retained Delaware alternative." },
  { day: 10, date: "2026-10-13", sleep_city: "Bridgeport, CT", theme: "Outlet block, then real snow indoors", schedule: [["10:15", "12:45", "jersey-gardens", "anchor"], ["14:00", "16:00", "big-snow-american-dream", "anchor"]], lodging: ["Bridgeport or Fairfield near the I-95 corridor", "Stratford with easier late arrival"], notes: ["Big SNOW is an advance timed ticket; the operator does not sell this package on site.", "North Jersey and I-95 are live-traffic gated. If navigation predicts over 2h15, take a real stretch break rather than a three-hour sit."], fallback: "Bam Kazam's challenge rooms in the same complex are the documented weather or energy swap." },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", theme: "Two hundred million year old tracks", schedule: [["10:00", "11:30", "dinosaur-state-park", "anchor"]], lodging: ["Logan Airport hotel with a confirmed shuttle", "Revere or East Boston with a verified airport transfer"], notes: ["The Exhibit Center opens Wednesday 09:00-16:30 and outdoor casting runs to Oct 31, 09:00-15:30.", "Casting is free if you bring the required materials and takes about 30-45 minutes."], fallback: "Inclement weather: casting is not recommended, but the preserved in-situ trackway stands on its own." }
];

export const BOOKING_PRIORITIES = [
  { place_id: "little-stony-man-climb", urgency: "red-lock-first", reason: "Two 2026 operator calendars conflict on Thursday Oct 8; get written confirmation before treating it as locked." },
  { place_id: "duke-lemur-bts", urgency: "red-lock-first", reason: "Private 1-4 Behind the Scenes with no walk-ins; exact Oct 10 inventory is a hard gate." },
  { place_id: "james-river-rafting", urgency: "red-lock-first", reason: "Confirm the post-liturgy Oct 11 departure and current river conditions." },
  { place_id: "goggleworks", urgency: "tier-a", reason: "Custom private workshop; request Oct 6 for four people." },
  { place_id: "crane-manor", urgency: "tier-a", reason: "Reserve a specific Oct 7 slot for the 75-minute room." },
  { place_id: "big-snow-american-dream", urgency: "tier-a", reason: "Advance timed ticket only; no on-site sales for the SNOW Day package." },
  { place_id: "natural-bridge", urgency: "tier-b", reason: "Arrange stair-alternative transport in advance if anyone needs it." },
  { place_id: "hotel-greene", urgency: "tier-b", reason: "Confirm the late Saturday Oct 10 evening slot." },
  { place_id: "carolina-tiger-rescue", urgency: "tier-c", reason: "Only if the Duke booking fails; Friday-to-Sunday twilight tours run through October." }
];
