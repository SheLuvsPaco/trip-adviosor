// Authored content for the Route 05 Energy Rebuild V2.
// Source: Energy Rebuild Routes/Route05_Under_The_Mountain_Inside_The_Machine_Rebuild.md

export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
export const VERIFIED_AT = "2026-09-01";

// The 31 scheduled originals the brief status-tags individually.
export const ORIGINAL_IDS = [
  "wadsworth-atheneum", "holy-land-usa", "lackawanna-coal", "steamtown", "scranton-iron",
  "watch-clock", "lancaster-central-market", "lancaster-troll-market", "ephrata-cloister",
  "railroad-museum-pa", "eshelman-covered-bridge", "harrisburg-riverfront", "pa-capitol",
  "antietam", "harpers-lower-town", "storer-college", "virginius-island", "luray-caverns",
  "skyline-overlooks", "stony-man", "charlottesville-downtown", "monticello", "jefferson-school",
  "kluge-ruhe", "ix-looking-glass", "morgan-wade-jefferson", "transfiguration-orthodox",
  "civil-war-medicine", "burnside-plantation", "fairfield-hills", "mapparium"
];

// Package-only alternates carried over from V1, preserved rather than deleted.
export const LEGACY_ALTERNATIVE_IDS = [
  "mark-twain-house", "houdini-museum", "wolf-sanctuary", "turkey-hill-experience", "seton-shrine",
  "shenandoah-caverns-fright", "exchange-hotel", "balls-bluff", "illicks-mill",
  "newtown-meeting-house", "worcester-arms-armor"
];

export const NEW_CORE_IDS = [
  "rock-house-reservation", "eckley-miners-village", "hickory-run-boulder-field",
  "strasburg-rail-road", "skyland-horseback", "bearfence-scramble", "blue-ridge-tunnel",
  "davinci-escape-room", "leesburg-outlets", "catoctin-furnace", "lehigh-gorge-railway",
  "walkway-over-hudson", "mine-hill-preserve", "dinosaur-footprints"
];

export const CORE_IDS = [
  "rock-house-reservation", "holy-land-usa",
  "lackawanna-coal", "scranton-iron",
  "eckley-miners-village", "hickory-run-boulder-field",
  "strasburg-rail-road", "ephrata-cloister",
  "harpers-lower-town", "storer-college", "virginius-island",
  "luray-caverns", "skyline-overlooks", "skyland-horseback", "bearfence-scramble",
  "blue-ridge-tunnel", "monticello", "davinci-escape-room",
  "transfiguration-orthodox", "leesburg-outlets",
  "catoctin-furnace", "harrisburg-riverfront", "lehigh-gorge-railway",
  "walkway-over-hudson", "mine-hill-preserve",
  "dinosaur-footprints", "mapparium"
];

export const OPTIONAL_IDS = new Set([
  "steamtown", "lancaster-central-market", "railroad-museum-pa", "antietam", "stony-man",
  "jefferson-school", "ix-looking-glass", "morgan-wade-jefferson", "civil-war-medicine"
]);

export const SOCIAL_IDS = new Set(["lancaster-central-market", "morgan-wade-jefferson"]);

export const FLEX_IDS = new Set([
  "lancaster-troll-market", "eshelman-covered-bridge", "pa-capitol", "charlottesville-downtown",
  "fairfield-hills"
]);

export const ARCHIVE_IDS = new Set([
  "wadsworth-atheneum", "watch-clock", "kluge-ruhe", "burnside-plantation"
]);

// Every non-core place is dated to the day whose corridor it sits on, so the app surfaces it in
// that day's optional/flex picker.
export const NON_CORE_DAY_DATES = {
  "wadsworth-atheneum": "2026-10-04", "mark-twain-house": "2026-10-04",
  "steamtown": "2026-10-05", "houdini-museum": "2026-10-05",
  "watch-clock": "2026-10-06", "lancaster-central-market": "2026-10-06",
  "lancaster-troll-market": "2026-10-06", "wolf-sanctuary": "2026-10-06",
  "turkey-hill-experience": "2026-10-06",
  "railroad-museum-pa": "2026-10-07", "eshelman-covered-bridge": "2026-10-07",
  "pa-capitol": "2026-10-08", "antietam": "2026-10-08", "seton-shrine": "2026-10-08",
  "stony-man": "2026-10-09", "charlottesville-downtown": "2026-10-09",
  "shenandoah-caverns-fright": "2026-10-09",
  "jefferson-school": "2026-10-10", "kluge-ruhe": "2026-10-10", "ix-looking-glass": "2026-10-10",
  "morgan-wade-jefferson": "2026-10-10", "exchange-hotel": "2026-10-10",
  "civil-war-medicine": "2026-10-11", "balls-bluff": "2026-10-11",
  "burnside-plantation": "2026-10-12", "illicks-mill": "2026-10-12",
  "fairfield-hills": "2026-10-13", "newtown-meeting-house": "2026-10-13",
  "worcester-arms-armor": "2026-10-14"
};

export const NEW_SOURCES = [
  ["src-v5-rock-house", "Trustees of Reservations — Rock House Reservation", "land-trust", "https://thetrustees.org/place/rock-house-reservation/", ["glacial rock shelter", "free access", "short trail network"]],
  ["src-v5-eckley", "Eckley Miners' Village", "official", "https://www.eckleyminers.org/", ["anthracite coal-patch village", "Tuesday museum closure", "village walkable dawn to dusk"]],
  ["src-v5-hickory-run", "Pennsylvania DCNR — Hickory Run State Park", "government", "https://www.dcnr.pa.gov/StateParks/FindAPark/HickoryRunStatePark/", ["Boulder Field National Natural Landmark", "free access", "uneven footing"]],
  ["src-v5-strasburg", "Strasburg Rail Road", "official", "https://www.strasburgrailroad.com/", ["live steam excursion", "October operation", "coach fares"]],
  ["src-v5-ephrata", "Pennsylvania Historical and Museum Commission — Ephrata Cloister", "government", "https://www.ephratacloister.org/", ["eighteenth-century religious settlement", "site tour", "adult admission"]],
  ["src-v5-harpers", "National Park Service — Harpers Ferry", "government", "https://www.nps.gov/hafe/planyourvisit/fees.htm", ["$20 per private vehicle", "visitor-center shuttle", "Lower Town and Virginius Island access"]],
  ["src-v5-luray", "Luray Caverns", "official", "https://luraycaverns.com/", ["guided cavern tour", "adult admission", "year-round operation"]],
  ["src-v5-shenandoah", "National Park Service — Shenandoah", "government", "https://www.nps.gov/shen/planyourvisit/fees.htm", ["$30 per private vehicle for seven days", "Skyline Drive overlooks", "Bearfence and Stony Man trailheads"]],
  ["src-v5-skyland", "Skyland Stables, Shenandoah National Park", "official", "https://www.goshenandoah.com/things-to-do/horseback-riding", ["guided trail ride", "no riding experience required", "weight and age limits"]],
  ["src-v5-bearfence", "National Park Service — Bearfence Mountain", "government", "https://www.nps.gov/shen/planyourvisit/bearfence-mountain.htm", ["rock scramble", "360-degree view", "not recommended when wet"]],
  ["src-v5-blue-ridge-tunnel", "Nelson County — Claudius Crozet Blue Ridge Tunnel", "government", "https://www.nelsoncounty-va.gov/blueridgetunnel/", ["4,273-foot unlit tunnel", "headlamp required", "sunrise to sunset", "free"]],
  ["src-v5-monticello", "Thomas Jefferson Foundation — Monticello", "official", "https://www.monticello.org/", ["From Slavery to Freedom guided tour", "landscape-based interpretation", "timed ticket"]],
  ["src-v5-unlocked-history", "Unlocked History Escape Rooms", "official", "https://www.unlockedhistory.com/", ["Da Vinci's Discovery room", "four-player compatible", "strong enthusiast reputation"]],
  ["src-v5-leesburg-outlets", "Leesburg Premium Outlets", "official", "https://www.premiumoutlets.com/outlet/leesburg", ["100+ stores", "free admission", "designer mix"]],
  ["src-v5-catoctin", "Catoctin Furnace Historical Society", "official", "https://catoctinfurnace.org/", ["iron furnace ruins", "Iron Trail", "African American cemetery", "open when the museum is closed"]],
  ["src-v5-lehigh-gorge", "Lehigh Gorge Scenic Railway", "official", "https://www.lgsry.com/", ["open-air car", "2026 foliage-season operation", "Jim Thorpe departure", "adult fare"]],
  ["src-v5-walkway", "Walkway Over the Hudson State Historic Park", "government", "https://walkway.org/", ["former railroad bridge", "free pedestrian access", "Poughkeepsie and Highland ends"]],
  ["src-v5-mine-hill", "Roxbury Land Trust — Mine Hill Preserve", "land-trust", "https://roxburylandtrust.org/mine-hill/", ["Shepaug iron furnace", "quarry and mine portals", "free hiking"]],
  ["src-v5-dinosaur-footprints", "Trustees of Reservations — Dinosaur Footprints", "land-trust", "https://thetrustees.org/place/dinosaur-footprints/", ["in-situ Jurassic trackway", "free roadside access", "Connecticut Valley geology"]],
  ["src-v5-mapparium", "Mary Baker Eddy Library — Mapparium", "official", "https://www.marybakereddylibrary.org/project/mapparium/", ["stained-glass globe", "short guided experience", "adult admission"]]
].map(([id, publisher, type, url, supports]) => ({ id, publisher, type, url, supports, verified_at: VERIFIED_AT }));

const cost = (low, high = low, group = null, type = low === 0 ? "free" : "per-person", note = "") => ({
  amount_per_person: low, low, high, amount_per_group: group, price_type: type,
  status: high === low ? "verified" : "planning-range", note
});

export const CORE_CONFIG = {
  "rock-house-reservation": { date: "2026-10-04", bucket: "nature-geology-scenic", texture: "WILD", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], weather: true, skip: "A short walk to the rock shelter; turn back whenever the group has seen it.", sourceIds: ["src-v5-rock-house"] },
  "holy-land-usa": { date: "2026-10-04", bucket: "sacred-spiritual", texture: "WEIRD", interaction: 2, cost: cost(0), risk: "yellow", best: ["stivka", "viki"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "An outdoor hillside of folk-religious sculpture; the Stations route can be shortened." },
  "lackawanna-coal": { date: "2026-10-05", bucket: "underground-industrial-infrastructure", texture: "EXPLORE", interaction: 4, cost: cost(12, 12, 48), risk: "yellow", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], reservation: "required", confined: true, skip: "The mine car descends roughly 300 feet; anyone uncomfortable underground can stay at the visitor centre.", sourceIds: ["src-v5-lackawanna"] },
  "scranton-iron": { date: "2026-10-05", bucket: "underground-industrial-infrastructure", texture: "DISCOVER", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], weather: true, skip: "Open-air blast-furnace ruins walked at whatever pace suits." },
  "eckley-miners-village": { date: "2026-10-06", bucket: "underground-industrial-infrastructure", texture: "EXPLORE", interaction: 2, cost: cost(0), risk: "yellow", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], weather: true, skip: "The museum is closed on Tuesdays, so this is the exterior company-town walk; drive it if the weather turns.", sourceIds: ["src-v5-eckley"] },
  "hickory-run-boulder-field": { date: "2026-10-06", bucket: "nature-geology-scenic", texture: "MOVE", interaction: 4, cost: cost(0), risk: "yellow", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], weather: true, wetSurface: true, highPhysicality: true, skip: "The field can be viewed from its edge; only go out onto the boulders as far as feels safe.", sourceIds: ["src-v5-hickory-run"] },
  "strasburg-rail-road": { date: "2026-10-07", bucket: "underground-industrial-infrastructure", texture: "AWE", interaction: 3, cost: cost(30, 30, 120), risk: "yellow", fallback: "railroad-museum-pa", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], reservation: "required", skip: "A seated coach excursion behind live steam; no physical demand.", sourceIds: ["src-v5-strasburg"] },
  "ephrata-cloister": { date: "2026-10-07", bucket: "sacred-spiritual", texture: "DISCOVER", interaction: 2, cost: cost(12.4, 12.4, 49.6), risk: "green", best: ["stivka", "viki"], secondary: ["gora", "sheluvspaco"], skip: "A compact site walk through the eighteenth-century settlement buildings.", sourceIds: ["src-v5-ephrata"] },
  "harpers-lower-town": { date: "2026-10-08", bucket: "high-impact-history-culture", texture: "EXPLORE", interaction: 3, cost: cost(10, 10, 40, "group-share", "Two $20 private-vehicle entries shared by four."), risk: "green", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], weather: true, skip: "The Point and Lower Town are walkable at any pace from the shuttle.", sourceIds: ["src-v5-harpers"] },
  "storer-college": { date: "2026-10-08", bucket: "high-impact-history-culture", texture: "LEARN", interaction: 2, cost: cost(0), risk: "green", best: ["stivka", "gora"], secondary: ["viki", "sheluvspaco"], skip: "An uphill walk from Lower Town; the shuttle reaches Camp Hill directly." },
  "virginius-island": { date: "2026-10-08", bucket: "underground-industrial-infrastructure", texture: "EXPLORE", interaction: 3, cost: cost(0), risk: "yellow", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], weather: true, skip: "A flat riverside ruins trail; it floods, so check conditions rather than forcing it." },
  "luray-caverns": { date: "2026-10-09", bucket: "nature-geology-scenic", texture: "AWE", interaction: 2, cost: cost(34, 34, 136), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], skip: "A paved, lit, guided cavern route with no scrambling.", sourceIds: ["src-v5-luray"] },
  "skyline-overlooks": { date: "2026-10-09", bucket: "nature-geology-scenic", texture: "RELAX", interaction: 1, cost: cost(15, 15, 60, "group-share", "Two $30 Shenandoah vehicle passes shared by four."), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "Selected high-value overlooks only; this is a driving sequence, not a hike.", sourceIds: ["src-v5-shenandoah"] },
  "skyland-horseback": { date: "2026-10-09", bucket: "active-mountain-adventure", texture: "MOVE", interaction: 4, cost: cost(91.99, 100.6, 367.96, "per-person-plus-tax", "Guided trail ride before Virginia sales tax."), risk: "yellow", fallback: "stony-man", best: ["viki", "gora"], secondary: ["sheluvspaco", "stivka"], reservation: "required", weather: true, highPhysicality: true, skip: "No riding experience is required, but check the operator's current weight and age limits before booking.", sourceIds: ["src-v5-skyland"] },
  "bearfence-scramble": { date: "2026-10-09", bucket: "active-mountain-adventure", texture: "MOVE", interaction: 4, cost: cost(0), risk: "yellow", fallback: "stony-man", best: ["gora"], secondary: ["viki", "sheluvspaco", "stivka"], weather: true, wetSurface: true, highPhysicality: true, skip: "Stony Man is the documented no-scramble alternative with a comparable view.", sourceIds: ["src-v5-bearfence"] },
  "blue-ridge-tunnel": { date: "2026-10-10", bucket: "underground-industrial-infrastructure", texture: "DISCOVER", interaction: 3, cost: cost(0), risk: "green", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], confined: true, skip: "Walk in as far as the group is comfortable; headlamps are required and the floor is uneven.", sourceIds: ["src-v5-blue-ridge-tunnel"] },
  "monticello": { date: "2026-10-10", bucket: "high-impact-history-culture", texture: "LEARN", interaction: 2, cost: cost(47, 47, 188), risk: "yellow", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], reservation: "required", skip: "A guided outdoor landscape tour; the pace is set by the guide.", sourceIds: ["src-v5-monticello"] },
  "davinci-escape-room": { date: "2026-10-10", bucket: "interactive-puzzle", texture: "SOLVE", interaction: 3, cost: cost(30, 30, 120), risk: "yellow", best: ["sheluvspaco", "gora"], secondary: ["viki", "stivka"], reservation: "required", escapeRoom: true, skip: "The route's single traditional escape room, sized for four.", sourceIds: ["src-v5-unlocked-history"] },
  "transfiguration-orthodox": { date: "2026-10-11", bucket: "sacred-spiritual", texture: "WORSHIP", interaction: 2, cost: cost(0), risk: "green", best: ["stivka"], secondary: ["viki", "gora", "sheluvspaco"], skip: "Protect the liturgy rather than treating it as an architecture stop." },
  "leesburg-outlets": { date: "2026-10-11", bucket: "shopping", texture: "SHOP", interaction: 2, cost: cost(0), risk: "green", best: ["viki"], secondary: ["gora", "stivka", "sheluvspaco"], skip: "Free to enter; purchases are excluded from the route total.", sourceIds: ["src-v5-leesburg-outlets"] },
  "catoctin-furnace": { date: "2026-10-12", bucket: "underground-industrial-infrastructure", texture: "LEARN", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], weather: true, skip: "The Iron Trail and cemetery are open even when the museum is not; the walk is short and flat.", sourceIds: ["src-v5-catoctin"] },
  "harrisburg-riverfront": { date: "2026-10-12", bucket: "nature-geology-scenic", texture: "RELAX", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "A deliberate 45-minute river reset moved here from Day 4 to break the drive." },
  "lehigh-gorge-railway": { date: "2026-10-12", bucket: "scenic-rail-transport", texture: "AWE", interaction: 2, cost: cost(28, 28, 112), risk: "yellow", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required", weather: true, skip: "Choose the open-air car for the gorge; enclosed seating is available if it is cold.", sourceIds: ["src-v5-lehigh-gorge"] },
  "walkway-over-hudson": { date: "2026-10-13", bucket: "underground-industrial-infrastructure", texture: "MOVE", interaction: 3, cost: cost(0), risk: "green", best: ["viki", "gora"], secondary: ["sheluvspaco", "stivka"], weather: true, skip: "Walk out as far as the group wants; the deck is flat and fully accessible.", sourceIds: ["src-v5-walkway"] },
  "mine-hill-preserve": { date: "2026-10-13", bucket: "underground-industrial-infrastructure", texture: "EXPLORE", interaction: 3, cost: cost(0), risk: "green", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], weather: true, highPhysicality: true, skip: "The furnace sits near the trailhead; the quarry and mine portals are the longer optional loop.", sourceIds: ["src-v5-mine-hill"] },
  "dinosaur-footprints": { date: "2026-10-14", bucket: "nature-geology-scenic", texture: "WEIRD", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], weather: true, skip: "A short roadside stop onto the trackway ledge.", sourceIds: ["src-v5-dinosaur-footprints"] },
  "mapparium": { date: "2026-10-14", bucket: "immersive-curiosity", texture: "AWE", interaction: 2, cost: cost(6, 6, 24), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], skip: "A short walk through the stained-glass globe; fully indoors and seated waiting.", sourceIds: ["src-v5-mapparium"] }
};

export const PLACE_OVERRIDES = {
  "rock-house-reservation": ["Rock House Reservation", "glacial-rock-shelter", "West Brookfield", "MA", "Rock House Reservation, West Brookfield, MA 01585", "A glacial rock chamber used as a shelter for thousands of years, with a small pond and short trails around it.", "It opens the route with geology you physically walk into instead of an indoor art block."],
  "eckley-miners-village": ["Eckley Miners' Village", "coal-patch-village", "Weatherly", "PA", "Eckley Miners' Village, Weatherly, PA 18255", "A preserved anthracite company town whose street of miners' houses can be walked or driven even when the museum is shut.", "A real worker settlement replaces a display collection, and the Tuesday museum closure costs the route nothing."],
  "hickory-run-boulder-field": ["Hickory Run Boulder Field", "boulder-field", "White Haven", "PA", "Boulder Field, Hickory Run State Park, White Haven, PA 18661", "A sixteen-acre National Natural Landmark of bare glacial boulders, crossed on hands and feet rather than viewed from a rail.", "Physical, strange and highly photogenic, and it changes the day's texture completely after the coal village."],
  "strasburg-rail-road": ["Strasburg Rail Road", "steam-excursion", "Ronks", "PA", "Strasburg Rail Road, 301 Gap Road, Ronks, PA 17572", "A working steam excursion through Lancaster County farmland behind a genuine coal-fired locomotive.", "Machinery in motion beats the same machinery behind glass, which is why it takes the rail slot from the museum."],
  "skyland-horseback": ["Skyland Stables Trail Ride", "guided-trail-ride", "Shenandoah National Park", "VA", "Skyland Stables, Skyline Drive mile 42.5, Shenandoah National Park, VA 22835", "A guided trail ride out of Skyland with no riding experience required.", "A distinctive way to move through Shenandoah that nothing else on the eleven routes offers."],
  "bearfence-scramble": ["Bearfence Mountain Scramble", "rock-scramble", "Shenandoah National Park", "VA", "Bearfence Mountain Trail, Skyline Drive mile 56.4, Shenandoah National Park, VA 22835", "A short quartzite scramble to a genuine 360-degree summit view.", "It delivers Old Rag's drama without Old Rag's time cost, and Stony Man is the documented easier alternative."],
  "blue-ridge-tunnel": ["Claudius Crozet Blue Ridge Tunnel", "unlit-rail-tunnel", "Afton", "VA", "Blue Ridge Tunnel, Afton, VA 22920", "A 4,273-foot unlit nineteenth-century rail tunnel walked by headlamp through the mountain.", "Hidden infrastructure you physically pass through is exactly the route's DNA, and it is free and open sunrise to sunset."],
  "davinci-escape-room": ["Unlocked History — Da Vinci's Discovery", "escape-room", "Charlottesville", "VA", "Unlocked History Escape Rooms, Charlottesville, VA 22902", "A built Renaissance workshop room sized for four players with a strong enthusiast reputation.", "One exceptional solve block rather than general immersive-art filler."],
  "leesburg-outlets": ["Leesburg Premium Outlets", "outlet-shopping", "Leesburg", "VA", "Leesburg Premium Outlets, 241 Fort Evans Road NE, Leesburg, VA 20176", "More than a hundred stores with a strong designer mix, taken as one protected afternoon block.", "It gives Viki a real shopping chapter and simultaneously solves the Charlottesville-to-north driving problem."],
  "catoctin-furnace": ["Catoctin Furnace & African American Cemetery", "iron-furnace-ruins", "Thurmont", "MD", "Catoctin Furnace Historic District, Thurmont, MD 21788", "Stone furnace stacks, the Iron Trail and the cemetery of the enslaved and free Black ironworkers who ran them.", "Industrial ruins and labour truth in one short walk that stays open when the museum is closed."],
  "lehigh-gorge-railway": ["Lehigh Gorge Scenic Railway", "open-air-foliage-train", "Jim Thorpe", "PA", "Lehigh Gorge Scenic Railway, 1 Susquehanna Street, Jim Thorpe, PA 18229", "An open-air car through the Lehigh Gorge during the exact 2026 foliage-season operating window.", "Moving foliage seen from an open car is a different experience from photographing a hillside from a pull-off."],
  "walkway-over-hudson": ["Walkway Over the Hudson", "rail-bridge-walkway", "Poughkeepsie", "NY", "Walkway Over the Hudson, Poughkeepsie, NY 12601", "A former railroad bridge turned pedestrian deck, high above the Hudson and free to cross.", "Active railroad infrastructure that also breaks the long return drive exactly where the route needs it."],
  "mine-hill-preserve": ["Mine Hill Preserve", "iron-furnace-and-quarry", "Roxbury", "CT", "Mine Hill Preserve, Roxbury, CT 06783", "The Shepaug iron furnace, granite quarry faces and mine portals on one free hiking preserve.", "Furnace, quarry and mine in a single site is the cleanest possible close to the route's industrial thread."],
  "dinosaur-footprints": ["Dinosaur Footprints Reservation", "in-situ-trackway", "Holyoke", "MA", "Dinosaur Footprints Reservation, Holyoke, MA 01040", "An exposed sandstone ledge carrying early Jurassic tracks in the position the animals left them.", "Fast, free deep-time geology on the return line, and a clean pairing with the Mapparium finale."]
};

export const DAY_PLANS = [
  { day: 1, date: "2026-10-04", sleep_city: "Danbury, CT", theme: "Glacial rock chamber, folk-religious hill", schedule: [["14:25", "15:30", "rock-house-reservation", "anchor"], ["17:20", "18:20", "holy-land-usa", "anchor"]], lodging: ["West Danbury near the I-84 corridor", "Brookfield or Bethel with easier two-car parking"], notes: ["Geology you walk into, then a strange sacred hillside; no indoor art on arrival day."], fallback: "Heavy rain: shorten the Rock House walk and give the time to the Holy Land hillside, which reads well in flat light." },
  { day: 2, date: "2026-10-05", sleep_city: "Scranton, PA", theme: "Descend into anthracite country", schedule: [["10:45", "11:45", "lackawanna-coal", "anchor"], ["13:15", "14:00", "scranton-iron", "supporting"]], lodging: ["Downtown Scranton near Lackawanna Avenue", "Dickson City along the Route 6 corridor"], notes: ["The measured Danbury run is split by a documented Milford, PA comfort break on the Delaware.", "Steamtown's 2026 short train rides are Friday to Sunday, so Monday keeps it optional rather than core."], fallback: "If the mine tour is full, Steamtown's locomotive shop tour is the documented Scranton substitute." },
  { day: 3, date: "2026-10-06", sleep_city: "Lancaster, PA", theme: "Coal-patch village, then a field of boulders", schedule: [["09:45", "11:00", "eckley-miners-village", "anchor"], ["11:35", "13:00", "hickory-run-boulder-field", "anchor"]], lodging: ["Central Lancaster with secure two-car parking", "Route 30 corridor for an easier morning exit"], notes: ["Eckley's museum is closed on Tuesdays; the village street itself is the experience and stays open."], fallback: "Wet boulders change the risk materially. In rain, view the field from its edge rather than crossing it." },
  { day: 4, date: "2026-10-07", sleep_city: "Harrisburg, PA", theme: "Live steam, then a radical religious settlement", schedule: [["09:30", "11:00", "strasburg-rail-road", "anchor"], ["11:30", "13:00", "ephrata-cloister", "anchor"]], lodging: ["Downtown Harrisburg near the riverfront", "Camp Hill across the Susquehanna"], notes: ["The lightest driving day on the route, which is deliberate after the boulder field."], fallback: "If the steam excursion sells out, the Railroad Museum of Pennsylvania sits directly opposite as the retained fallback." },
  { day: 5, date: "2026-10-08", sleep_city: "Winchester, VA", theme: "Confluence, freedom and factory ruins", schedule: [["10:00", "11:00", "harpers-lower-town", "anchor"], ["11:00", "12:00", "storer-college", "supporting"], ["12:00", "13:15", "virginius-island", "anchor"]], lodging: ["Winchester historic district near the pedestrian mall", "Route 37 corridor with easier parking"], notes: ["Park at the visitor centre and take the shuttle; Lower Town parking is minimal.", "Virginius Island floods, so check trail conditions rather than assuming access."], fallback: "Antietam is the documented swap if the group wants battlefield terrain, but do not stack it on a full Harpers day." },
  { day: 6, date: "2026-10-09", sleep_city: "Charlottesville, VA", theme: "Cavern, Skyline, saddle, scramble", schedule: [["09:00", "10:15", "luray-caverns", "anchor"], ["10:45", "12:00", "skyline-overlooks", "supporting"], ["13:15", "14:15", "skyland-horseback", "anchor"], ["14:45", "16:00", "bearfence-scramble", "anchor"]], lodging: ["Charlottesville downtown near the mall", "US-29 corridor with easier two-car parking"], notes: ["Four different ways of moving through the same mountains in one day: underground, by car, on horseback and on rock."], fallback: "Wet rock cancels Bearfence; Stony Man gives a comparable view with no scramble." },
  { day: 7, date: "2026-10-10", sleep_city: "Charlottesville, VA", theme: "Through the mountain, then the truth tour", schedule: [["08:00", "10:15", "blue-ridge-tunnel", "anchor"], ["11:30", "14:00", "monticello", "anchor"], ["15:30", "16:45", "davinci-escape-room", "anchor"]], lodging: ["Same Charlottesville hotel", "Same US-29 corridor hotel"], notes: ["The route's lightest driving day by far, which is what makes three substantial blocks possible.", "Headlamps are required for the tunnel; the floor is uneven and unlit throughout."], fallback: "Rain: the tunnel is unaffected, and IX Art Park is the documented indoor swap if the group wants one." },
  { day: 8, date: "2026-10-11", sleep_city: "Leesburg, VA", theme: "Orthodox Sunday, then one real shopping block", schedule: [["09:00", "12:00", "transfiguration-orthodox", "anchor"], ["14:00", "18:00", "leesburg-outlets", "anchor"]], lodging: ["Leesburg historic district within walking distance of King Street", "Route 7 corridor with easier parking"], notes: ["Leesburg replaces Frederick as the overnight: it turns a 2h45 run into roughly 2h30 and puts the shopping block where it solves the geometry."], fallback: "If the liturgy runs long, the outlet block simply starts later; nothing else on the day is time-critical." },
  { day: 9, date: "2026-10-12", sleep_city: "Stroudsburg, PA", theme: "Iron labour, river reset, foliage train", schedule: [["08:00", "09:30", "catoctin-furnace", "anchor"], ["10:45", "11:30", "harrisburg-riverfront", "supporting"], ["15:00", "15:45", "lehigh-gorge-railway", "anchor"]], lodging: ["Downtown Stroudsburg near Main Street", "Bartonsville along the I-80 corridor"], notes: ["The route's longest driving day at 317 measured minutes, carrying an explicit authorised exception; no single leg exceeds 120 minutes.", "Sleeping in Stroudsburg rather than Jim Thorpe is what keeps the next day's Hudson run inside the rule."], fallback: "If the train is cancelled, continue to Stroudsburg early and use the extra evening; do not chase a replacement attraction." },
  { day: 10, date: "2026-10-13", sleep_city: "Newtown, CT", theme: "Rail bridge over the Hudson, iron mine in the woods", schedule: [["10:15", "11:45", "walkway-over-hudson", "anchor"], ["13:00", "15:30", "mine-hill-preserve", "anchor"]], lodging: ["Newtown near the Fairfield Hills campus", "Danbury I-84 corridor as the fallback"], notes: ["The Walkway is both a real experience and the driving-rule breaker that makes this day work."], fallback: "Bad trail conditions: Fairfield Hills near the sleep city is the documented low-energy alternative." },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", theme: "Deep time, then a globe of stained glass", schedule: [["09:15", "10:00", "dinosaur-footprints", "supporting"], ["12:30", "13:30", "mapparium", "anchor"]], lodging: ["Logan Airport hotel with a confirmed shuttle", "Revere or East Boston with a verified airport transfer"], notes: ["Both stops are short by design so the rental return controls the day, not the itinerary."], fallback: "If traffic erodes the morning, the Dinosaur Footprints stop is the one to drop; the Mapparium is the finale." }
];

export const BOOKING_PRIORITIES = [
  { place_id: "skyland-horseback", urgency: "red-lock-first", reason: "Limited horses per ride and a hard Oct 9 slot; confirm current weight and age limits." },
  { place_id: "monticello", urgency: "red-lock-first", reason: "From Slavery to Freedom is a timed guided tour on a Saturday." },
  { place_id: "lackawanna-coal", urgency: "tier-a", reason: "Reserve the Oct 5 descent; the mine runs limited tours." },
  { place_id: "lehigh-gorge-railway", urgency: "tier-a", reason: "Foliage-season open-air seating on Oct 12 sells ahead." },
  { place_id: "davinci-escape-room", urgency: "tier-a", reason: "Reserve the Oct 10 afternoon slot for four players." },
  { place_id: "strasburg-rail-road", urgency: "tier-b", reason: "Book the Oct 7 morning steam excursion." },
  { place_id: "luray-caverns", urgency: "tier-b", reason: "Timed cavern entry on Oct 9 before the horseback slot." },
  { place_id: "ephrata-cloister", urgency: "tier-c", reason: "Small site; confirm the Oct 7 tour schedule." }
];
