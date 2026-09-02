import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { contextualImagePlaces, manualCoordinates } from "../route-04/config.mjs";

const ROUTE_ID = "route-04";
const ROUTE_SLUG = "route-04-trolls-moon-rocks-curiosity-coast-loop";
const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
const VERIFIED_AT = "2026-08-31";
const writeJson = (filePath, value) => writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);

const ORIGINAL_IDS = [
  "nubble-light", "uss-albacore", "african-burying-ground", "victoria-mansion",
  "portland-head-light", "eastern-promenade", "arcadia-portland", "coastal-maine-gardens",
  "prison-showroom", "rockland-breakwater", "owls-head-transportation", "fort-knox-observatory",
  "bar-harbor-shore-path", "cadillac-mountain", "ocean-path", "jordan-pond", "crypto-museum",
  "stephen-king-house", "thomas-hill-standpipe", "cole-transportation", "maine-mineral-gem",
  "bethel-village", "weeks-state-park", "stj-foliage-train", "fairbanks-museum", "hope-cemetery",
  "dormition-orthodox", "shelburne-museum", "burlington-waterfront", "radio-bean",
  "ben-jerrys-graveyard", "coolidge-site", "quechee-gorge", "american-precision", "saint-gaudens",
  "flw-houses", "currier-museum"
];

// V1 one-for-one replacement alternatives. The V2 model retires the replacement system, but the
// research stays in the package as documented alternatives rather than being deleted.
const LEGACY_ALTERNATIVE_IDS = [
  "woodman-museum", "desert-of-maine", "maine-maritime", "penobscot-marine", "seal-cove-auto",
  "colby-art", "dog-mountain", "museum-everyday-life", "vins", "path-of-life", "see-science"
];

const NEW_CORE_IDS = [
  "kittery-outlets", "lucky-catch-lobstering", "bath-iron-works-story", "maiden-cliff",
  "beehive-bowl-climb", "sk-tours-derry", "skowhegan-falls-langlais", "wife-carrying-championship",
  "mount-washington-cog", "arbortrek-smugglers", "beast-mountain-coaster", "k1-scenic-gondola",
  "lost-river-gorge"
];

const CORE_IDS = [
  "kittery-outlets", "nubble-light",
  "uss-albacore", "portland-head-light", "lucky-catch-lobstering",
  "coastal-maine-gardens", "bath-iron-works-story", "rockland-breakwater",
  "maiden-cliff", "fort-knox-observatory", "bar-harbor-shore-path",
  "cadillac-mountain", "beehive-bowl-climb", "sk-tours-derry",
  "skowhegan-falls-langlais", "maine-mineral-gem",
  "wife-carrying-championship", "mount-washington-cog",
  "dormition-orthodox", "arbortrek-smugglers",
  "beast-mountain-coaster", "k1-scenic-gondola", "quechee-gorge",
  "lost-river-gorge",
  "flw-houses"
];

const OPTIONAL_IDS = new Set([
  "african-burying-ground", "arcadia-portland", "prison-showroom", "owls-head-transportation",
  "stephen-king-house", "weeks-state-park", "fairbanks-museum", "hope-cemetery", "radio-bean",
  "ben-jerrys-graveyard", "coolidge-site", "american-precision"
]);
const FLEX_IDS = new Set([
  "eastern-promenade", "ocean-path", "jordan-pond", "thomas-hill-standpipe", "bethel-village",
  "burlington-waterfront"
]);
const ARCHIVE_IDS = new Set([
  "victoria-mansion", "crypto-museum", "cole-transportation", "stj-foliage-train",
  "shelburne-museum", "saint-gaudens", "currier-museum"
]);

const NEW_SOURCES = [
  ["src-v4-kittery", "Kittery Outlets Association", "official", "https://www.thekitteryoutlets.com/", ["Route 1 outlet cluster", "free admission", "main Route 04 shopping block"]],
  ["src-v4-lucky-catch", "Lucky Catch Cruises", "official", "https://www.luckycatch.com/", ["$60 adult fare", "daily operation through late October", "guests bait, set, haul and measure lobster gear"]],
  ["src-v4-biw-story", "Maine Maritime Museum", "official", "https://www.mainemaritimemuseum.org/cruises", ["Bath Iron Works Story by Land & Sea", "$65 per person", "weekday programme through Oct 16", "trolley plus river components"]],
  ["src-v4-camden-hills", "Maine Bureau of Parks and Lands", "government", "https://www.maine.gov/dacf/parks/", ["Camden Hills State Park day-use fee", "about $6 nonresident adult", "Maiden Cliff trail and Mount Battie alternative"]],
  ["src-v4-acadia", "National Park Service", "government", "https://www.nps.gov/acad/planyourvisit/fees.htm", ["Cadillac sunrise vehicle reservation $6", "reservation system through Oct 25", "05:30 early-morning window", "2026 non-US-resident fee structure requires recheck"]],
  ["src-v4-beehive", "National Park Service", "government", "https://www.nps.gov/acad/planyourvisit/hiking.htm", ["Beehive granite staircases and iron rungs", "roughly 450-foot cliff ascent", "1-3 hour band", "Bowl Trail bypass"]],
  ["src-v4-sk-tours", "SK Tours of Maine", "official", "https://www.sk-tours.com/", ["Derry, Maine tour", "$62.50 per person", "2.5+ hours", "Apr 3 to Oct 30 season", "exact Oct 8 departure not exposed publicly"]],
  ["src-v4-skowhegan", "Main Street Skowhegan", "official", "https://www.skowhegan.org/", ["Kennebec falls and civic landscape", "Bernard Langlais sculpture", "free short route reset"]],
  ["src-v4-wife-carrying", "Sunday River Resort", "official", "https://www.sundayriver.com/events/north-american-wife-carrying-championship", ["Saturday Oct 10 2026 Fall Fest", "race around 11:00", "about 278-yard course with water hazard", "spectating is free"]],
  ["src-v4-cog", "Mount Washington Cog Railway", "official", "https://www.thecog.com/", ["summit round trip just under three hours", "45-minute arrival requirement", "2026 summit season through Oct 25", "$61-111 fare band", "motive power not guaranteed"]],
  ["src-v4-arbortrek", "ArborTrek Canopy Adventures", "official", "https://arbortrek.com/zip-line-canopy-tour/", ["8 ziplines, 2 sky bridges, 2 rappels", "$139 starting price plus Vermont tax", "2.5-3 hours"]],
  ["src-v4-killington", "Killington Resort", "official", "https://www.killington.com/", ["Adventure Center final 2026 fall operating date Oct 12", "Beast Mountain Coaster 4-ride pack about $69", "K-1 gondola $35 advance / $39 same day"]],
  ["src-v4-lost-river", "Lost River Gorge & Boulder Caves", "official", "https://lostrivergorge.com/", ["$25 October online admission", "$29 walk-in", "open daily Sep 24 to Oct 18", "09:00-15:30 October entry", "11 boulder caves with bypasses"]],
  ["src-v4-flw-houses", "Currier Museum of Art", "official", "https://currier.org/", ["Zimmerman and Kalil house tours", "season through Dec 27", "Wednesday operation", "about $55 public ticket", "roughly $500 private group option"]],
  ["src-v4-route108", "Smugglers' Notch Resort", "official", "https://www.smuggs.com/", ["Route 108 notch road typically closes mid-October to mid-May", "Route 15 / Route 100 detour to Stowe"]]
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

const CORE_CONFIG = {
  "kittery-outlets": { date: "2026-10-04", bucket: "shopping", texture: "SHOP", interaction: 2, cost: cost(0), risk: "green", best: ["viki"], secondary: ["gora", "stivka", "sheluvspaco"], skip: "Pure browsing; anyone can sit out in a cafe without losing the stop.", source_ids: ["src-v4-kittery"] },
  "nubble-light": { date: "2026-10-04", bucket: "wild-terrain-scenic", texture: "AWE", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true },
  "uss-albacore": { date: "2026-10-05", bucket: "working-machine-infrastructure", texture: "EXPLORE", interaction: 3, cost: cost(14, 14, 56), risk: "green", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], confined: true, skip: "Tight submarine passages; anyone claustrophobic can stay in the shore exhibits." },
  "portland-head-light": { date: "2026-10-05", bucket: "wild-terrain-scenic", texture: "AWE", interaction: 1, cost: cost(3, 3, 12, "group-share", "Two vehicles at about $6 each for a short paid-parking block."), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, sharedParkFee: true, skip: "Walk the coast, take the photograph and move; this is not a two-hour lighthouse lesson." },
  "lucky-catch-lobstering": { date: "2026-10-05", bucket: "working-machine-infrastructure", texture: "DISCOVER", interaction: 4, cost: cost(60, 60, 240), risk: "yellow", fallback: "eastern-promenade", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], reservation: "required", weather: true, skip: "Guests choose how much gear handling to do; watching from the rail still counts.", source_ids: ["src-v4-lucky-catch"] },
  "coastal-maine-gardens": { date: "2026-10-06", bucket: "regional-weird-folklore", texture: "WEIRD", interaction: 2, cost: cost(28, 28, 112), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "Flat garden paths; the troll loop can be shortened at will." },
  "bath-iron-works-story": { date: "2026-10-06", bucket: "working-machine-infrastructure", texture: "DISCOVER", interaction: 3, cost: cost(65, 65, 260), risk: "yellow", fallback: "maine-maritime", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], reservation: "required", weather: true, skip: "Seated trolley and boat sections; low physical demand throughout.", source_ids: ["src-v4-biw-story"] },
  "rockland-breakwater": { date: "2026-10-06", bucket: "wild-terrain-scenic", texture: "WILD", interaction: 3, cost: cost(0), risk: "yellow", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], weather: true, wetSurface: true, highPhysicality: true, skip: "Turn back at any point along the granite; the walk is out-and-back." },
  "maiden-cliff": { date: "2026-10-07", bucket: "wild-terrain-scenic", texture: "WILD", interaction: 3, cost: cost(6, 6, 24, "group-share", "Camden Hills nonresident day-use, about $6 per adult."), risk: "yellow", fallback: "owls-head-transportation", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], weather: true, highPhysicality: true, sharedParkFee: true, skip: "Use the Mount Battie auto road and overlook instead of the cliff climb; the stop still counts.", source_ids: ["src-v4-camden-hills"] },
  "fort-knox-observatory": { date: "2026-10-07", bucket: "working-machine-infrastructure", texture: "EXPLORE", interaction: 3, cost: cost(11, 11, 44), risk: "green", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], confined: true, skip: "The fort is explorable at any depth and the observatory is a lift, not a climb." },
  "bar-harbor-shore-path": { date: "2026-10-07", bucket: "wild-terrain-scenic", texture: "EXPLORE", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "Deliberately low output; this is the energy trough before the dawn day." },
  "cadillac-mountain": { date: "2026-10-08", bucket: "wild-terrain-scenic", texture: "AWE", interaction: 1, cost: cost(20.5, 20.5, 82, "group-share", "Two private-vehicle entrances at about $35 plus two $6 Cadillac sunrise reservations."), risk: "red", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required", exact: true, weather: true, nonresidentFeeCheck: true, sharedParkFee: true, skip: "Sunrise is watched from the summit parking area; no hiking is required.", source_ids: ["src-v4-acadia"] },
  "beehive-bowl-climb": { date: "2026-10-08", bucket: "wild-terrain-scenic", texture: "WILD", interaction: 4, cost: cost(0), risk: "red", fallback: "jordan-pond", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], weather: true, wetSurface: true, highExposure: true, highPhysicality: true, skip: "Everyone starts on the Bowl Trail; only those who want the iron rungs take the Beehive face, and nobody descends it.", source_ids: ["src-v4-beehive"] },
  "sk-tours-derry": { date: "2026-10-08", bucket: "regional-weird-folklore", texture: "WEIRD", interaction: 2, cost: cost(62.5, 62.5, 250), risk: "red", fallback: "stephen-king-house", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required", skip: "Guided and largely seated; the operator controls the pace.", source_ids: ["src-v4-sk-tours"] },
  "skowhegan-falls-langlais": { date: "2026-10-09", bucket: "regional-weird-folklore", texture: "WEIRD", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "sheluvspaco"], secondary: ["gora", "stivka"], weather: true, skip: "A forty-minute leg-stretch by design; shorten it freely.", source_ids: ["src-v4-skowhegan"] },
  "maine-mineral-gem": { date: "2026-10-09", bucket: "passive-museum", texture: "DISCOVER", interaction: 2, cost: cost(15, 15, 60), risk: "green", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], museumLike: true, skip: "Indoor and seated where wanted; the route's single passive-museum slot." },
  "wife-carrying-championship": { date: "2026-10-10", bucket: "regional-weird-folklore", texture: "WEIRD", interaction: 2, cost: cost(0), risk: "yellow", best: ["viki", "sheluvspaco"], secondary: ["gora", "stivka"], exact: true, weather: true, skip: "Spectating is the core plan; entering the race is a separate optional decision.", source_ids: ["src-v4-wife-carrying"] },
  "mount-washington-cog": { date: "2026-10-10", bucket: "working-machine-infrastructure", texture: "DISCOVER", interaction: 3, cost: cost(61, 111, 244, "per-person", "Fare varies by train and inventory; summit round trip runs just under three hours."), risk: "red", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], reservation: "required", weather: true, skip: "Seated rail travel; summit exposure is the only demanding part and is optional.", source_ids: ["src-v4-cog"] },
  "dormition-orthodox": { date: "2026-10-11", bucket: "worship-sacred", texture: "WORSHIP", interaction: 1, cost: cost(0), risk: "green", best: ["stivka"], secondary: ["viki", "gora", "sheluvspaco"] },
  "arbortrek-smugglers": { date: "2026-10-11", bucket: "adventure-competitive", texture: "CHALLENGE", interaction: 4, cost: cost(139, 139, 556, "per-person-plus-tax", "Starting price before Vermont tax; eight ziplines, two sky bridges and two rappels."), risk: "red", fallback: "burlington-waterfront", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], reservation: "required", weather: true, highExposure: true, highPhysicality: true, route108: true, skip: "Participation is an individual choice; a comfortable base reset is kept for anyone sitting out.", source_ids: ["src-v4-arbortrek", "src-v4-route108"] },
  "beast-mountain-coaster": { date: "2026-10-12", bucket: "adventure-competitive", texture: "COMPETE", interaction: 4, cost: cost(17.25, 17.25, 69, "group-share", "Shared four-ride pack at about $69, one ride each."), risk: "yellow", fallback: "ben-jerrys-graveyard", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], exact: true, weather: true, skip: "Riders control their own brake; anyone can watch from the base instead.", source_ids: ["src-v4-killington"] },
  "k1-scenic-gondola": { date: "2026-10-12", bucket: "working-machine-infrastructure", texture: "AWE", interaction: 2, cost: cost(35, 39, 140, "per-person", "About $35 advance, $39 same day."), risk: "yellow", fallback: "coolidge-site", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], exact: true, weather: true, skip: "A seated lift; the summit walk at the top is optional.", source_ids: ["src-v4-killington"] },
  "quechee-gorge": { date: "2026-10-12", bucket: "wild-terrain-scenic", texture: "AWE", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "A 30-45 minute visual reset from the reopened bridge; the trail below is optional." },
  "lost-river-gorge": { date: "2026-10-13", bucket: "wild-terrain-scenic", texture: "WILD", interaction: 4, cost: cost(25, 25, 100, "per-person", "$25 October online admission; $29 walk-in subject to capacity, which the ceiling does not assume."), risk: "yellow", fallback: "american-precision", best: ["gora", "viki"], secondary: ["sheluvspaco", "stivka"], reservation: "required", weather: true, wetSurface: true, highPhysicality: true, skip: "Every one of the eleven caves has a bypass; the boardwalk line carries the whole group.", source_ids: ["src-v4-lost-river"] },
  "flw-houses": { date: "2026-10-14", bucket: "living-architecture", texture: "EXPLORE", interaction: 2, cost: cost(55, 55, 220, "per-person", "Working public-ticket budget; verify at checkout. A private group tour runs about $500."), risk: "red", fallback: "see-science", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], reservation: "required", skip: "Guided, low-physical and indoors; the design talk is the experience.", source_ids: ["src-v4-flw-houses"] }
};

const NEW_PLACE_BASE = {
  "kittery-outlets": ["Kittery Premium Outlets", "outlet-shopping", "Kittery", "ME", "US Route 1, Kittery, ME 03904", "A protected two-and-a-half-hour shopping block on the Route 1 outlet strip before the route turns to the coast.", "It gets Viki's shopping done on day one so it never interrupts the mountain and foliage days later."],
  "lucky-catch-lobstering": ["Lucky Catch Lobstering Cruise", "working-lobster-boat", "Portland", "ME", "Long Wharf, 170 Commercial Street, Portland, ME 04101", "A working lobster boat where guests bait, set, haul and measure real gear in Casco Bay.", "It turns the working Maine coast into participation instead of another harbour sightseeing run."],
  "bath-iron-works-story": ["Bath Iron Works Story — by Land & Sea", "industrial-shipyard-tour", "Bath", "ME", "Maine Maritime Museum, 243 Washington Street, Bath, ME 04530", "A combined trolley and river programme that puts the group alongside one of America's most serious working shipyards.", "The attraction is live Navy destroyer construction as an industrial system, not a static maritime gallery."],
  "maiden-cliff": ["Maiden Cliff Memorial Hike", "cliff-hike", "Camden", "ME", "Maiden Cliff Trail, Camden Hills State Park, Camden, ME 04843", "About a mile each way to a cliff roughly 800 feet above Megunticook Lake, with the memorial cross to Elenora French.", "Granite stops being scenery and becomes terrain, with a real auto-road alternative for anyone who wants the view without the climb."],
  "beehive-bowl-climb": ["Beehive & Bowl Split-Route Climb", "iron-rung-scramble", "Bar Harbor", "ME", "Bowl Trail from Sand Beach, Acadia National Park, ME 04609", "Granite staircases, iron rungs and exposed cliff faces on a roughly 450-foot ascent, with the Bowl Trail carrying anyone who skips the rungs.", "This is the route's sharpest change of mode: from watching Acadia at dawn to physically climbing it an hour later."],
  "sk-tours-derry": ["SK Tours — The Derry, Maine Tour", "guided-folklore-field-tour", "Bangor", "ME", "SK Tours of Maine, Bangor, ME 04401", "A two-and-a-half-hour guided field tour linking Bangor locations, Stephen King inspirations and the city's own history.", "It replaces standing outside a private house with real guided context, and non-superfans still get the Bangor local-history side."],
  "skowhegan-falls-langlais": ["Skowhegan Falls & Langlais Sculpture Reset", "roadside-civic-landscape", "Skowhegan", "ME", "Skowhegan, ME 04976", "A deliberately short stop at the Kennebec falls and Bernard Langlais's outsized local sculpture.", "It breaks the long Bangor-to-western-Maine transfer with something genuinely Maine rather than a manufactured attraction."],
  "wife-carrying-championship": ["North American Wife Carrying Championship", "exact-date-regional-ritual", "Newry", "ME", "Sunday River Resort, 15 South Ridge Road, Newry, ME 04261", "A 278-yard course with obstacles, uneven ground and a water hazard, run at Sunday River's Fall Fest on the exact Saturday the route is there.", "It is the strongest exact-date discovery in the rebuild and it cannot be replicated anywhere else on the eleven routes."],
  "mount-washington-cog": ["Mount Washington Cog Railway", "mountain-cog-railway", "Bretton Woods", "NH", "Marshfield Base Station, Base Station Road, Bretton Woods, NH 03575", "The world's first mountain-climbing cog railway carrying the group toward a 6,288-foot summit through foliage and alpine weather.", "Old machinery, movement, mountain exposure and fall colour land in one three-hour block."],
  "arbortrek-smugglers": ["ArborTrek Smugglers' Notch Canopy Tour", "zipline-canopy-course", "Jeffersonville", "VT", "ArborTrek Canopy Adventures, Smugglers' Notch Resort, Jeffersonville, VT 05464", "Eight ziplines, two sky bridges and two rappels through the canopy above Smugglers' Notch.", "It is the route's single dedicated adventure course, allowed precisely because it is not repeated three more times."],
  "beast-mountain-coaster": ["Beast Mountain Coaster", "mountain-coaster", "Killington", "VT", "Killington Adventure Center, Snowshed Base, Killington, VT 05751", "A gravity coaster down the mountainside on Killington's published final fall operating day.", "Mechanical speed the group controls itself is a better use of the resort than standing at one more overlook."],
  "k1-scenic-gondola": ["K-1 Express Gondola", "scenic-gondola", "Killington", "VT", "K-1 Base Lodge, Killington Resort, Killington, VT 05751", "A lift to Killington Peak on the last published fall operating day, with the foliage moving underneath.", "Riding through the colour is a different interaction from photographing it from a pull-off."],
  "lost-river-gorge": ["Lost River Gorge & Boulder Caves", "boulder-cave-gorge", "North Woodstock", "NH", "1712 Lost River Road, North Woodstock, NH 03262", "A mile of boardwalk through a glacial gorge with waterfalls, ladders and eleven boulder caves, each with a bypass.", "The group chooses its own difficulty cave by cave, which is why it beats a generic gorge walk."]
};

const DAY_PLANS = [
  { day: 1, date: "2026-10-04", sleep_city: "Portsmouth, NH", theme: "Shop early, then open Atlantic", schedule: [["13:00", "15:30", "kittery-outlets", "anchor"], ["16:00", "17:00", "nubble-light", "supporting"]], lodging: ["Portsmouth centre within walking distance of the waterfront", "Route 1 bypass hotels with easy two-car parking"], notes: ["Shopping is deliberately taken on arrival day so it never interrupts the mountain and foliage blocks later."], fallback: "Late Boston pickup: keep Nubble, drop the outlet block to an hour and use the African Burying Ground memorial only if there is genuine time." },
  { day: 2, date: "2026-10-05", sleep_city: "Portland, ME", theme: "Machine interior, iconic coast, working water", schedule: [["09:30", "10:45", "uss-albacore", "anchor"], ["12:00", "13:00", "portland-head-light", "supporting"], ["14:00", "15:30", "lucky-catch-lobstering", "anchor"]], lodging: ["Portland peninsula near the Old Port", "Outer Congress Street with reliable two-room inventory"], notes: ["Three genuinely different interactions in one day: submarine interior, coastal icon, then hands-on fishing gear."], fallback: "Wind or severe marine weather cancels the boat: use the Eastern Promenade blue-hour walk and keep the evening free." },
  { day: 3, date: "2026-10-06", sleep_city: "Rockland, ME", theme: "Trolls, destroyers, granite", schedule: [["09:00", "11:10", "coastal-maine-gardens", "anchor"], ["12:30", "15:00", "bath-iron-works-story", "anchor"], ["16:30", "18:00", "rockland-breakwater", "supporting"]], lodging: ["Rockland harbour within walking distance of Main Street", "Thomaston or Rockport with easier parking"], notes: ["The Bath Iron Works programme is a weekday product running through Oct 16; it is the day's fixed point."], fallback: "Wet granite, spray or strong wind: shorten or skip the breakwater rather than walking slick rock." },
  { day: 4, date: "2026-10-07", sleep_city: "Bar Harbor, ME", theme: "Terrain, bridge engineering, deliberate quiet", schedule: [["08:30", "11:00", "maiden-cliff", "anchor"], ["12:15", "13:45", "fort-knox-observatory", "anchor"], ["16:15", "17:30", "bar-harbor-shore-path", "supporting"]], lodging: ["Bar Harbor village within walking distance of the Shore Path", "Trenton or the Route 3 corridor with easy two-car parking"], notes: ["The evening is intentionally low-output because Day 5 starts before dawn and contains the route's most exposed climb."], fallback: "Anyone who does not want the cliff takes the Mount Battie auto road and meets the group at the overlook." },
  { day: 5, date: "2026-10-08", sleep_city: "Bangor, ME", theme: "Cadillac dawn to iron rungs to Derry", schedule: [["05:30", "07:10", "cadillac-mountain", "anchor"], ["08:00", "10:00", "beehive-bowl-climb", "anchor"], ["13:30", "16:00", "sk-tours-derry", "anchor"]], lodging: ["Bangor Broadway or downtown near the tour meeting point", "Bangor airport corridor with secure parking"], notes: ["Beehive is dry-rock only. Do not send anyone up wet iron and wet granite to preserve an itinerary.", "The SK Tours window is a planning target: the operator's booking engine did not expose Oct 8 departure times, so confirm before fixing the afternoon."], fallback: "Wet rock or high wind: Ocean Path and Jordan Pond are the documented Beehive replacements and the day still works." },
  { day: 6, date: "2026-10-09", sleep_city: "Bethel / Newry, ME", theme: "Recovery day, then hold the Moon", schedule: [["10:05", "10:45", "skowhegan-falls-langlais", "supporting"], ["12:45", "14:15", "maine-mineral-gem", "anchor"]], lodging: ["Bethel village within reach of Sunday River", "Newry near the resort access road for the Saturday morning"], notes: ["This is the route's deliberate recovery day and it carries the single passive-museum slot; do not add a second museum."], fallback: "Bad weather simply makes the museum longer; the Skowhegan reset can be dropped without cost." },
  { day: 7, date: "2026-10-10", sleep_city: "St. Johnsbury, VT", theme: "Strange ritual, then mountain engineering", schedule: [["10:15", "12:00", "wife-carrying-championship", "anchor"], ["14:45", "17:40", "mount-washington-cog", "anchor"]], lodging: ["St. Johnsbury near Main Street", "Littleton, NH as the cross-border alternative"], notes: ["Leave the Sunday River area around noon. The Cog requires arrival 45 minutes before departure, so a 14:45 train means a 14:00 check-in.", "Book the summit trip first and treat steam as a bonus only if the exact ticket confirms it."], fallback: "If live navigation erodes the buffer, the Cog wins: leave the festival early rather than losing the booked train." },
  { day: 8, date: "2026-10-11", sleep_city: "Stowe, VT", theme: "Orthodox Sunday, then the canopy", schedule: [["09:00", "12:00", "dormition-orthodox", "anchor"], ["13:00", "16:00", "arbortrek-smugglers", "anchor"]], lodging: ["Stowe village on the southbound Route 100 line", "Waterbury with easier two-room inventory"], notes: ["Recheck the parish bulletin the week before; Orthros around 09:00 and Divine Liturgy around 10:00 are recurring, not ticketed, times.", "Route 108 through Smugglers' Notch normally closes mid-October to mid-May; if it is shut, route via Route 15 and Route 100 rather than forcing the pass."], fallback: "If anyone does not want the height or rappels, keep their participation a genuine individual choice and hold a comfortable base reset." },
  { day: 9, date: "2026-10-12", sleep_city: "Woodstock, VT", theme: "Killington's last fall day", schedule: [["11:00", "11:45", "beast-mountain-coaster", "anchor"], ["12:00", "13:15", "k1-scenic-gondola", "anchor"], ["14:15", "15:00", "quechee-gorge", "supporting"]], lodging: ["Woodstock village near the green", "Quechee or White River Junction with easier parking"], notes: ["Oct 12 is the published final fall operating day for both Killington attractions, so this pairing cannot slip to another date."], fallback: "Mountain operations closed: Ben & Jerry's Flavor Graveyard and Plymouth Notch are the documented lower-physical swaps." },
  { day: 10, date: "2026-10-13", sleep_city: "Manchester, NH", theme: "Boulder caves, then release", schedule: [["10:00", "12:30", "lost-river-gorge", "anchor"]], lodging: ["Manchester downtown near the Wright house meeting point", "Bedford or the I-93 corridor with secure parking"], notes: ["One major attraction by design: this is the pacing release after Oct 10-12.", "The gorge operates in rain but stairs, ladders and cave surfaces get slippery; open does not mean every challenge should be attempted."], fallback: "Miserable weather: the American Precision Museum is the strongest indoor machinery swap." },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", theme: "Living architecture, then home", schedule: [["09:30", "11:30", "flw-houses", "anchor"]], lodging: ["Logan Airport hotel with a confirmed shuttle", "Revere or East Boston with a verified airport transfer"], notes: ["Two distinct Wright houses entered and walked with a guide; this is the old stop that most clearly earned its survival.", "Manchester to Boston is normally in the 1h-1h15 class before live traffic. Put the actual rental return deadline on the timeline and work backward."], fallback: "Wright tickets unavailable: America's Stonehenge is the weird outdoor alternative, but only if rental timing still works." }
];

const BOOKING_PRIORITIES = [
  { place_id: "mount-washington-cog", urgency: "red-lock-first", reason: "Foliage Saturday. Book the summit trip first, motive power second, and protect the 45-minute arrival rule." },
  { place_id: "cadillac-mountain", urgency: "red-lock-first", reason: "Two Oct 8 vehicle reservations, with the 2026 residency and pass strategy resolved before purchase." },
  { place_id: "bath-iron-works-story", urgency: "red-lock-first", reason: "Exact weekday product on Oct 6 and a route signature." },
  { place_id: "sk-tours-derry", urgency: "red-lock-first", reason: "The exact Oct 8 departure is not safely exposed in public calendar data; verify by phone or booking calendar." },
  { place_id: "arbortrek-smugglers", urgency: "red-lock-first", reason: "The exact post-church Oct 11 afternoon slot must exist." },
  { place_id: "flw-houses", urgency: "red-lock-first", reason: "Wednesday Oct 14 dual-house tour; recent visitors strongly recommend booking ahead." },
  { place_id: "lucky-catch-lobstering", urgency: "tier-b", reason: "Reserve the Oct 5 afternoon sailing." },
  { place_id: "coastal-maine-gardens", urgency: "tier-b", reason: "Garden season runs through Oct 18; reserve the Oct 6 morning." },
  { place_id: "lost-river-gorge", urgency: "tier-b", reason: "Timed Oct 13 arrival inside the 09:00-15:30 October window." },
  { place_id: "beast-mountain-coaster", urgency: "tier-b", reason: "Oct 12 is the published final fall operating day." },
  { place_id: "k1-scenic-gondola", urgency: "tier-b", reason: "Oct 12 is the published final fall operating day; advance pricing is cheaper." }
];

function travelerFit(best, secondary) {
  return Object.fromEntries(PEOPLE.map((person) => [person, best.includes(person) ? 5 : secondary.includes(person) ? 4 : 3.5]));
}

function originalStatus(id) {
  if (CORE_IDS.includes(id)) return ORIGINAL_IDS.includes(id) ? "keep-core" : "new-core";
  if (OPTIONAL_IDS.has(id)) return "keep-optional";
  if (FLEX_IDS.has(id)) return "demote-flex";
  if (ARCHIVE_IDS.has(id)) return "remove-archive";
  return "documented-alternative";
}

function enrichCore(base, id) {
  const config = CORE_CONFIG[id];
  const [name, kind, city, state, address, summary, whyGo] = NEW_PLACE_BASE[id] || [];
  const { best, secondary } = config;
  const fit = travelerFit(best, secondary);
  const current = base || {};
  const skipStrategy = config.skip || "Low physical demand; no skip path is required.";
  return {
    ...current,
    id,
    name: name || current.name,
    kind: kind || current.kind,
    city: city || current.city,
    state: state || current.state,
    country: "US",
    address: address || current.address,
    visit_date: config.date,
    summary: summary || current.summary,
    why_go: whyGo || current.why_go,
    best_for: best,
    secondary_for: secondary,
    best_fit_note: `Primary fit: ${best.join(", ")}. ${skipStrategy}`,
    categories: current.categories || ["unusual_creative"],
    duration_minutes: current.duration_minutes || 90,
    priority: "anchor",
    reservation: config.reservation || "none",
    hours: current.hours || { opens: null, closes: null, status: "reconfirm-required", note: "Use the scheduled route window; reconfirm operator inventory before booking." },
    cost: config.cost,
    source_ids: [...new Set([...(current.source_ids || []), ...(config.source_ids || [])])],
    coordinates: manualCoordinates[id] || current.coordinates,
    coordinate_order: "longitude_latitude",
    coordinate_source: "manual_verified_address",
    ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 },
    researcher_person_fit: fit,
    included_in_magic_score: true,
    core_status: "core",
    original_status: originalStatus(id),
    energy_rebuild_role: "active-core",
    experience_bucket: config.bucket,
    texture: config.texture,
    interaction_score: config.interaction,
    museum_like: Boolean(config.museumLike),
    experience_flags: {
      museum_like: Boolean(config.museumLike),
      weather_gated: Boolean(config.weather),
      wet_surface_risk: Boolean(config.wetSurface),
      booking_required: config.reservation === "required",
      exact_date_anchor: Boolean(config.exact),
      high_exposure: Boolean(config.highExposure),
      high_physicality: Boolean(config.highPhysicality),
      viki_bypass_available: Boolean(config.skip),
      traffic_gated: false,
      route108_dependency: Boolean(config.route108),
      shared_park_fee: Boolean(config.sharedParkFee),
      nonresident_fee_check: Boolean(config.nonresidentFeeCheck),
      confined_space: Boolean(config.confined),
      photo_heavy: ["AWE", "WILD", "WEIRD"].includes(config.texture),
      machinery_heavy: config.bucket === "working-machine-infrastructure"
    },
    viki_fit: fit.viki,
    gora_fit: fit.gora,
    stivka_fit: fit.stivka,
    planner_balance_fit: fit.sheluvspaco,
    price_type: config.cost.price_type,
    price_per_person_low: config.cost.low,
    price_per_person_high: config.cost.high,
    price_per_group: config.cost.amount_per_group,
    price_last_checked: VERIFIED_AT,
    physical_level: config.highExposure ? "high" : config.highPhysicality ? "moderate" : config.interaction >= 3 ? "light-moderate" : "easy",
    skip_mode: skipStrategy,
    skip_strategy: skipStrategy,
    optional: true,
    included_in_magic_default: true,
    included_in_daily_max_total: true,
    source_confidence: "primary-source-verified",
    operational_confidence: config.risk,
    operational_risk: config.risk,
    fallback_ids: config.fallback ? [config.fallback] : [],
    fallback_place_id: config.fallback || null,
    data_status: "complete"
  };
}

function enrichNonCore(place) {
  const status = OPTIONAL_IDS.has(place.id)
    ? "optional"
    : FLEX_IDS.has(place.id)
      ? "flex"
      : ARCHIVE_IDS.has(place.id)
        ? "archive"
        : "alternative";
  return {
    ...place,
    priority: status,
    included_in_magic_score: false,
    included_in_magic_default: false,
    core_status: status,
    original_status: originalStatus(place.id),
    energy_rebuild_role: status === "archive" ? "preserved-revision-history" : "documented-alternative",
    replacement: undefined,
    optional: true,
    included_in_daily_max_total: false,
    operational_risk: place.operational_risk || "reconfirm-if-activated",
    ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 }
  };
}

function scheduleItem([start, end, placeId, priority], placeById) {
  const place = placeById.get(placeId);
  if (!place) throw new Error(`Missing Route 04 V2 place: ${placeId}`);
  return { start, end, place_id: placeId, priority, reservation: place.reservation };
}

function imageRecord(placeId, image, index) {
  const commons = image.production_usable === true;
  return {
    id: `img-${placeId}-${index + 1}`,
    place_id: placeId,
    title: image.title,
    description: image.description,
    search_query: image.search_query,
    local_path: image.local_path,
    source_page: image.source_page,
    source_file_url: image.original_url,
    creator: image.creator || image.credit || "Source publisher",
    credit: image.credit || image.creator || "Source publisher",
    license: image.license,
    license_url: image.license_url || image.source_page,
    alt: image.description || `${placeId.replaceAll("-", " ")} photograph`,
    coverage: image.coverage || (contextualImagePlaces.has(placeId) ? "exact-place-or-experience-context" : "exact-place-or-experience"),
    production_usable: commons,
    rights_status: commons ? "commons-license-recorded" : "permission-required-before-public-deployment",
    visual_review: "reviewed"
  };
}

function comfortScore(normal) {
  const temperaturePenalty = Math.abs(normal.normal_high_c - 21) / 4;
  const rainPenalty = normal.measurable_precipitation_probability_percent / 25;
  return Math.round(Math.max(1, Math.min(5, 5 - temperaturePenalty - rainPenalty)) * 10) / 10;
}

export async function buildEnergyRoute04({ root, routeDir }) {
  const [currentPlacesPackage, currentImagesPackage, currentSourcesPackage, research, weather, geometry, manifest] = await Promise.all([
    readFile(path.join(routeDir, "places.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "images.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "sources.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "research-raw.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "weather-normals.json"), "utf8").then(JSON.parse),
    readFile(path.join(routeDir, "route-geometry.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "dataset", "manifest.json"), "utf8").then(JSON.parse)
  ]);

  const currentPlaceById = new Map(currentPlacesPackage.places.map((place) => [place.id, place]));
  const keepIds = [...ORIGINAL_IDS, ...LEGACY_ALTERNATIVE_IDS, ...NEW_CORE_IDS];
  const places = keepIds.map((id) => (CORE_IDS.includes(id) ? enrichCore(currentPlaceById.get(id), id) : enrichNonCore(currentPlaceById.get(id)))).filter(Boolean);
  const placeById = new Map(places.map((place) => [place.id, place]));
  for (const id of CORE_IDS) if (!placeById.has(id)) throw new Error(`Route 04 V2 core place is missing from the package: ${id}`);

  const keptOriginalIds = new Set([...ORIGINAL_IDS, ...LEGACY_ALTERNATIVE_IDS]);
  const existingImages = currentImagesPackage.images.filter((image) => keptOriginalIds.has(image.place_id));
  const newImages = NEW_CORE_IDS.flatMap((placeId) => {
    const selected = research.places[placeId]?.selected_images || [];
    if (selected.length < 3) throw new Error(`${placeId} has ${selected.length}/3 Route 04 V2 images.`);
    return selected.slice(0, 3).map((image, index) => imageRecord(placeId, image, index));
  });
  const images = [...existingImages, ...newImages];
  const imageIdsByPlace = new Map();
  for (const image of images) imageIdsByPlace.set(image.place_id, [...(imageIdsByPlace.get(image.place_id) || []), image.id]);
  for (const place of places) {
    place.image_ids = imageIdsByPlace.get(place.id) || [];
    place.data_status = place.image_ids.length >= 3 ? place.data_status || "complete" : "image-gap";
  }

  const sourceById = new Map(currentSourcesPackage.sources.map((source) => [source.id, source]));
  for (const source of NEW_SOURCES) sourceById.set(source.id, source);
  const usedSourceIds = new Set(places.flatMap((place) => place.source_ids || []));
  const sources = [...sourceById.values()].filter((source) => usedSourceIds.has(source.id));

  const weatherByDay = new Map(weather.days.map((day) => [day.day, day]));
  const geometryByDay = new Map(geometry.days.map((day) => [day.day, day]));
  const TOTAL_CAP = 270;
  const UNINTERRUPTED_CAP = 150;

  const days = DAY_PLANS.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    if (!routed) throw new Error(`Day ${plan.day} has no measured geometry.`);
    if (!normal) throw new Error(`Day ${plan.day} has no weather normal.`);
    const longestLeg = Math.max(0, ...routed.legs.map((leg) => leg.baseline_minutes));
    const capStatus = longestLeg > UNINTERRUPTED_CAP
      ? "over-uninterrupted-cap"
      : routed.baseline_total_minutes > TOTAL_CAP
        ? "over-total-cap"
        : routed.baseline_total_minutes > 210
          ? "long-total-day"
          : routed.planning_total_minutes.high > 210
            ? "live-traffic-gated"
            : "comfortable";
    return {
      day: plan.day,
      date: plan.date,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(new Date(`${plan.date}T12:00:00-04:00`)),
      sleep_city: plan.sleep_city,
      theme: plan.theme,
      notes: plan.notes,
      lodging: { preferred_area: plan.lodging[0], fallback_area: plan.lodging[1], room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Strong suggestion only; prioritize safety, cleanliness, secure two-car parking and the exact bed layout." },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      drive: {
        legs: routed.legs,
        baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes,
        planning_total_minutes: routed.planning_total_minutes,
        traffic_risk: routed.risk,
        cap_minutes: TOTAL_CAP,
        max_uninterrupted_minutes: longestLeg,
        uninterrupted_cap_minutes: UNINTERRUPTED_CAP,
        cap_status: capStatus,
        fallback: plan.fallback
      },
      weather: {
        kind: "historical_normal",
        high_c: normal.normal_high_c,
        low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfortScore(normal),
        station_id: normal.station_id,
        station_name: normal.station_name,
        station_role: plan.day === 7 ? "Montpelier-St. Johnsbury regional proxy" : plan.day === 8 ? "Burlington-Stowe regional proxy" : normal.station_role,
        source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Mount Washington's summit runs dramatically colder and windier than any valley station; carry a shell, warm layer, hat and closed footwear on Oct 10."
      }
    };
  });

  const corePlaces = places.filter((place) => place.included_in_magic_score);
  const lowCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_low, 0) * 100) / 100;
  const highCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_high, 0) * 100) / 100;
  const baselineMiles = Math.round(days.reduce((sum, day) => sum + day.drive.baseline_total_miles, 0) * 10) / 10;
  const scheduled = new Set(days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  const longestLeg = Math.max(...days.map((day) => day.drive.max_uninterrupted_minutes));
  const museumLikeCore = corePlaces.filter((place) => place.museum_like);
  const paidCore = corePlaces.filter((place) => place.price_per_person_low > 0);
  const rightsGatedImages = images.filter((image) => image.production_usable === false);

  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID,
      slug: "trolls-moon-rocks-curiosity-coast-loop",
      name: "The Cold Granite, Rungs & Mountain-Machine Loop",
      short_name: "Cold Granite & Rungs",
      status: "energy-rebuild-ui-ready",
      map_color: manifest.routes.find((entry) => entry.id === ROUTE_ID)?.map_color || "#4C8C7B",
      timezone: "America/New_York",
      start_date: "2026-10-04",
      end_date: "2026-10-14",
      airport_date: "2026-10-15",
      origin: { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
      destination: { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
      endpoint_city: "Bar Harbor, ME",
      direction: "Boston up the Maine coast through Portsmouth, Portland, Bath and Rockland to Acadia and Bangor, then west through Bethel and the White Mountains into Vermont and south through Killington and Woodstock to Manchester and Boston",
      countries: ["US"],
      canada_included: false,
      total_nights: 11,
      road_nights: 10,
      final_boston_nights: 1,
      baseline_total_miles: baselineMiles,
      energy_rebuild_version: "2.0.0",
      energy_rebuild_verified_at: VERIFIED_AT,
      route_dna: "COLD GRANITE × RUNGS × MOUNTAIN MACHINES",
      summary: "Northern New England as physical material: an experimental submarine, a working lobster boat, Navy destroyer construction from land and river, giant forest trolls, a granite breakwater, a memorial cliff, Cadillac at dawn, iron rungs on the Beehive, a Stephen King field tour, Moon and Mars rock, the exact-date wife carrying championship, a cog railway to 6,288 feet, a Vermont canopy course, a last-day mountain coaster and gondola, boulder caves and two Frank Lloyd Wright houses."
    },
    constraints: {
      travelers: 4,
      cars: 2,
      cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 210],
      daily_drive_hard_cap_minutes: TOTAL_CAP,
      max_uninterrupted_drive_minutes: UNINTERRUPTED_CAP,
      route_specific_drive_rule: "No planned uninterrupted run exceeds roughly 2.5 hours. The measured worst case is the Skowhegan to Bethel leg.",
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only route with no border crossing. The 2026 Acadia non-US-resident entrance structure must be checked against each traveler's status before purchase.",
      budget_excludes: ["lodging", "rental cars", "fuel", "tolls", "ordinary city parking and transit", "food", "nightlife", "shopping purchases"]
    },
    scoring: {
      scale: { min: 1, max: 5, increment: 0.5 },
      equal_traveler_weight: true,
      traveler_ids: PEOPLE,
      route_component_weights_percent: { attraction_and_stop_ratings: 45, excitement_and_uniqueness: 20, driving_comfort: 15, traveler_fairness: 10, cost_and_value: 5, expected_weather: 5 },
      route_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      driving_comfort_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      overall_excitement_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      cost_value_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      weather_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])),
      magic_score: null,
      magic_score_status: "awaiting-traveler-ratings",
      person_specific_route_scores: Object.fromEntries(PEOPLE.map((person) => [person, null]))
    },
    experience_model: {
      core_experience_count: corePlaces.length,
      museum_like_core_count: museumLikeCore.length,
      museum_like_core_percent: Math.round((museumLikeCore.length / corePlaces.length) * 10000) / 100,
      museum_like_core_ids: museumLikeCore.map((place) => place.id),
      core_food_nightlife_count: 0,
      core_escape_room_count: 0,
      paid_core_count: paidCore.length,
      route_dna: "cold-granite-rungs-mountain-machines",
      experience_buckets: Object.entries(corePlaces.reduce((tally, place) => ({ ...tally, [place.experience_bucket]: (tally[place.experience_bucket] || 0) + 1 }), {})).map(([bucket, count]) => ({ bucket, count })),
      textures: Object.entries(corePlaces.reduce((tally, place) => ({ ...tally, [place.texture]: (tally[place.texture] || 0) + 1 }), {})).map(([texture, count]) => ({ texture, count })),
      design_rule: "Optional, flex, archived and alternative originals stay visible but never affect Magic unless the group activates them.",
      museum_like_note: "The Maine Mineral & Gem Museum is the single passive museum. It survives because lunar and Martian material in a small western-Maine town is route-defining, and on a 25-stop route one museum is 4%.",
      texture_note: "The brief groups CHALLENGE and COMPETE as a single row of two; this package records them separately as ArborTrek and the Beast coaster."
    },
    days,
    place_ids: places.map((place) => place.id),
    core_place_ids: corePlaces.map((place) => place.id),
    alternative_place_ids: places.filter((place) => !place.included_in_magic_score).map((place) => place.id),
    replacement_place_ids: [],
    replacement_options: [],
    budget: {
      free_route_baseline_per_person_usd: 0,
      selected_experience_total_status: "computed-from-user-toggles",
      do_everything_core_low_per_person_usd: lowCost,
      do_everything_core_high_per_person_usd: highCost,
      do_everything_core_low_group_usd: Math.round(lowCost * 4 * 100) / 100,
      do_everything_core_high_group_usd: Math.round(highCost * 4 * 100) / 100,
      paid_core_count: paidCore.length,
      variable_booking_fees_excluded: true,
      vermont_tax_excluded: true,
      shopping_spend_excluded: true,
      food_nightlife_lodging_cars_fuel_excluded: true,
      scenarios: [
        { id: "acadia-nonresident-allowance", label: "Acadia non-US-resident allowance", per_person_delta_usd: 17.5, note: "Working planning allowance if the 2026 non-US-resident Acadia structure applies. Recheck the exact NPS checkout and pass rule before purchase." },
        { id: "wright-private-tour", label: "Wright houses private group tour", per_person_delta_usd: 70, note: "If public dual-house inventory is unavailable, the current private option is about $500 per group." }
      ],
      note: "Every paid attraction is optional. The Cog fare band and the Killington gondola advance-versus-same-day difference are the only ranges inside the core total."
    },
    booking_priorities: BOOKING_PRIORITIES,
    operational_flags: {
      red: [
        "Mount Washington Cog: book the Oct 10 summit trip first; steam motive power is never guaranteed.",
        "Cadillac Mountain: two Oct 8 sunrise vehicle reservations plus an unresolved 2026 Acadia residency and pass strategy.",
        "SK Tours: the exact Oct 8 departure time is not exposed in public booking data.",
        "ArborTrek: the exact Oct 11 post-church slot must be confirmed.",
        "Zimmerman and Kalil houses: Wednesday Oct 14 inventory must be reserved ahead.",
        "Beehive is dry-rock only; wet iron and wet granite cancel the climb, not the itinerary."
      ],
      yellow: [
        "Bath Iron Works Story runs as a weekday product through Oct 16.",
        "Lucky Catch is wind and severe-weather gated.",
        "Route 108 through Smugglers' Notch normally closes mid-October to mid-May.",
        "Killington's coaster and gondola both stop after Oct 12.",
        "Lost River operates in rain but stairs, ladders and cave surfaces become slippery.",
        "Rockland Breakwater granite is genuinely dangerous when wet or wind-blown."
      ],
      green: [
        "Kittery as the single shopping block on arrival day.",
        "The Portsmouth submarine to Portland coast to lobster boat sequence.",
        "Boothbay trolls into the Bath shipyard programme.",
        "Camden Hills terrain into Fort Knox bridge engineering.",
        "The deliberate Bar Harbor energy trough before the dawn day.",
        "Skowhegan as the honest mid-transfer reset.",
        "St. Johnsbury and Stowe as fatigue-reducing sleep corrections.",
        "Quechee's reopened bridge as the Killington cool-down.",
        "Lost River as the single-attraction pacing release."
      ],
      nonresident_fee_rule: "The NPS introduced an additional non-U.S.-resident fee structure for selected parks in 2026. Every traveler's residency and pass position must be checked against the live Acadia checkout before payment; do not buy on the strength of this package alone."
    },
    validation: {
      date_count: days.length,
      expected_date_count: 11,
      all_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= TOTAL_CAP),
      all_uninterrupted_legs_at_or_below_cap: longestLeg <= UNINTERRUPTED_CAP,
      longest_uninterrupted_leg_minutes: longestLeg,
      live_traffic_gated_days: days.filter((day) => day.drive.planning_total_minutes.high > 210).map((day) => day.day),
      long_total_driving_days: days.filter((day) => day.drive.baseline_total_minutes > 210).map((day) => day.day),
      place_count: places.length,
      core_place_count: corePlaces.length,
      scheduled_unique_place_count: scheduled.size,
      image_count: images.length,
      rights_gated_image_count: rightsGatedImages.length,
      places_with_fewer_than_3_usable_images: places.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      replacement_option_count: 0,
      all_replacement_variants_at_or_below_cap: true,
      unfilled_place_ratings: places.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "The SK Tours Oct 8 departure time is a planning target, not confirmed inventory; do not hard-code it until the booking calendar opens.",
        "Cadillac sunrise, the Cog, ArborTrek and the Wright houses are all reservation-controlled and none is booking-final.",
        "The 2026 Acadia non-U.S.-resident entrance structure is unresolved and can move the Day 5 cost materially.",
        "Route 108 through Smugglers' Notch can close on early winter weather, forcing the Route 15 and Route 100 detour to Stowe.",
        "Killington's Adventure Center and K-1 gondola both close after Oct 12, so Day 9 cannot slip.",
        "Cannon Mountain's aerial tramway is retired for 2026 and the Rock of Ages quarry tour is discontinued; neither is used.",
        "Beast Mountain Coaster, Kittery, Maiden Cliff and Skowhegan ship with contextual rather than exact-attraction imagery.",
        "OSRM contains no live traffic; the Boston departure and return remain live-traffic gates."
      ],
      route_lock_status: "ui-ready-bookings-and-live-forecast-pending",
      energy_rebuild_status: "canonical-and-rebuild-safe"
    }
  };

  const geojson = {
    type: "FeatureCollection",
    name: `${ROUTE_SLUG}-energy-v2`,
    features: [
      ...days.flatMap((day) => day.drive.legs.map((leg) => ({
        type: "Feature",
        id: leg.id,
        properties: { feature_kind: "drive_leg", route_id: ROUTE_ID, day: day.day, date: day.date, from: leg.from, to: leg.to, distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, traffic_risk: leg.traffic_risk, map_color: route.route.map_color, energy_rebuild: true },
        geometry: leg.geometry
      }))),
      ...places.map((place) => ({
        type: "Feature",
        id: place.id,
        properties: { feature_kind: "place", route_id: ROUTE_ID, place_id: place.id, name: place.name, city: place.city, state: place.state, visit_date: place.visit_date, priority: place.priority, included_in_magic_score: place.included_in_magic_score, experience_bucket: place.experience_bucket, energy_rebuild_role: place.energy_rebuild_role },
        geometry: { type: "Point", coordinates: place.coordinates }
      })),
      ...Object.entries(geometry.nodes).map(([nodeId, node]) => ({
        type: "Feature",
        id: `node-${nodeId}`,
        properties: { feature_kind: "route_node", route_id: ROUTE_ID, node_id: nodeId, name: node.name },
        geometry: { type: "Point", coordinates: node.coordinates }
      }))
    ]
  };

  const decisions = {
    schema_version: "1.0.0",
    route_id: ROUTE_ID,
    verified_at: VERIFIED_AT,
    purpose: "Rebuild Route 04 around northern New England as physical material while keeping all 37 original stops in the revision history.",
    route_dna: "COLD GRANITE × RUNGS × MOUNTAIN MACHINES",
    retained_original_core_ids: CORE_IDS.filter((id) => ORIGINAL_IDS.includes(id)),
    new_core_ids: NEW_CORE_IDS,
    original_optional_ids: [...OPTIONAL_IDS],
    original_flex_ids: [...FLEX_IDS],
    original_archive_ids: [...ARCHIVE_IDS],
    documented_alternative_ids: LEGACY_ALTERNATIVE_IDS,
    overnight_changes: "Montpelier becomes St. Johnsbury on Oct 10 so the group is not repositioning after a three-hour alpine rail trip, and Burlington becomes Stowe on Oct 11 so Sunday finishes on the southbound Vermont line instead of driving back west.",
    replacement_model_change: "The eleven legacy one-for-one replacement variants are retired. Their places stay visible as documented alternatives and are excluded from Magic until activated.",
    bath_iron_works_note: "The new core stop bath-iron-works-story is the museum's Land & Sea programme. The legacy alternative place maine-maritime remains a separate documented record and keeps its own id.",
    escape_room_note: "Route 04 ships with zero escape rooms in the active core. The corridor research did not find one strong enough on the right dates, and none was forced in.",
    drive_correction: "Measured OSRM geometry replaces the brief's prose bands. The longest uninterrupted leg is the 132-minute Skowhegan to Bethel run and no day exceeds the 270-minute total cap, so Route 04 needs no authorised cap exception.",
    image_policy: "Fifteen operator publicity images for the commercial experiences stay private-prototype-only until permission is cleared. Twenty-four Wikimedia Commons files ship production-usable with creator, licence and file page recorded. Kittery, Maiden Cliff, the Beast coaster and Skowhegan carry contextual coverage because no exact-attraction file was available."
  };

  const replacementGeometry = { schema_version: "1.0.0", route_id: ROUTE_ID, generated_at: VERIFIED_AT, routing_engine: "none-required", traffic_included: false, variants: [] };

  const readme = `# Route 04 — The Cold Granite, Rungs & Mountain-Machine Loop

Canonical Energy Rebuild V2 for October 4-15, 2026. Route DNA: **COLD GRANITE × RUNGS × MOUNTAIN MACHINES**.

## Package summary

- ${places.length} total places: ${corePlaces.length} active core experiences plus all ${places.length - corePlaces.length} non-core originals preserved as optional, flex, archived or documented alternatives
- ${scheduled.size} uniquely scheduled core place cards across 11 days
- ${images.length} local carousel images, of which ${rightsGatedImages.length} are rights-gated operator files
- ${baselineMiles.toFixed(1)} OSRM baseline miles
- ${longestLeg} minutes for the longest uninterrupted baseline driving leg
- $${lowCost.toFixed(2)}-$${highCost.toFixed(2)} optional do-everything attraction range per person, before Vermont tax and booking fees
- ${museumLikeCore.length} passive museum in the core (${route.experience_model.museum_like_core_percent}%), 0 escape rooms, 0 core food or nightlife

## Structural changes

Montpelier becomes St. Johnsbury and Burlington becomes Stowe. Both are fatigue and geometry corrections, not a redesign of the major route. Shopping moves to Kittery on arrival day so it never interrupts the mountain and foliage blocks.

## Road evidence

Frozen OSRM geometry is canonical in the UI. The longest uninterrupted leg is the 132-minute Skowhegan to Bethel run, and no day exceeds the 270-minute total cap, so unlike Routes 02 and 03 this package needs no authorised cap exception.

## UI contract

Core places expose texture, interaction, booking risk, weather and wet-surface gates, exposure, Viki bypass paths, traveler fit and optional cost ranges. Optional, flex, archived and alternative originals stay visible but never enter Magic unless activated.

## Operations

The route is UI-ready but not booking-final. Lock the Cog, Cadillac reservations, the Bath Iron Works programme, SK Tours, ArborTrek and the Wright houses first. The 2026 Acadia non-U.S.-resident entrance structure must be rechecked before any pass purchase. Beehive is dry-rock only.

Rebuild with \`node scripts/route-04/build.mjs\`, then validate with \`node scripts/validate-route-package.mjs ${ROUTE_SLUG}\`.
`;

  const manifestRoute = manifest.routes.find((entry) => entry.id === ROUTE_ID);
  if (!manifestRoute) throw new Error("route-04 is missing from dataset/manifest.json");
  manifestRoute.name = route.route.name;
  manifestRoute.status = "energy-rebuild-ui-ready";
  manifestRoute.place_count = places.length;
  manifestRoute.image_count = images.length;
  manifestRoute.day_count = days.length;
  manifestRoute.baseline_miles = baselineMiles;

  await Promise.all([
    writeJson(path.join(routeDir, "places.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, places }),
    writeJson(path.join(routeDir, "images.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Legacy Commons rights retained for original stops. New-core imagery is a mix of Wikimedia Commons files shipped production-usable and operator publicity images held private-prototype-only until permission is cleared.", images }),
    writeJson(path.join(routeDir, "sources.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: VERIFIED_AT, sources }),
    writeJson(path.join(routeDir, "route.json"), route),
    writeJson(path.join(routeDir, "route.geojson"), geojson),
    writeJson(path.join(routeDir, "replacement-geometry.json"), replacementGeometry),
    writeJson(path.join(routeDir, "route-decisions.json"), decisions),
    writeJson(path.join(routeDir, "place-seed.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, generated_from: "Energy Rebuild Routes/Route04_Cold_Granite_Rebuild_With_Costs.md", places }),
    writeFile(path.join(routeDir, "README.md"), readme),
    writeJson(path.join(root, "dataset", "manifest.json"), manifest)
  ]);
  console.log(`Built Route 04 Energy V2: ${places.length} places, ${corePlaces.length} core, ${images.length} images, ${days.length} days, ${baselineMiles} miles.`);
  return { placeCount: places.length, imageCount: images.length, dayCount: days.length };
}
