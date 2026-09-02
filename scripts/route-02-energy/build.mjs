import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { contextualImagePlaces, manualCoordinates } from "../route-02/config.mjs";

const ROUTE_ID = "route-02";
const ROUTE_SLUG = "route-02-falls-fire-clockwork-loop";
const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
const VERIFIED_AT = "2026-08-31";
const writeJson = (filePath, value) => writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);

const ORIGINAL_IDS = [
  "smith-botanic-garden", "three-sisters-sanctuary", "tunnel-bar-northampton",
  "mass-moca", "grafton-peace-pagoda", "saratoga-mineral-springs", "congress-park",
  "howe-caverns", "iroquois-museum", "cooperstown-lakefront", "brewery-ommegang",
  "fenimore-farm", "cardiff-giant", "empire-state-carousel", "taughannock-falls",
  "cornell-botanic-gardens", "ithaca-falls", "corning-museum-of-glass",
  "make-your-own-glass", "rochester-high-falls", "george-eastman-museum", "artisanworks",
  "house-of-guitars", "radio-social", "rochester-public-market", "letchworth-falls",
  "buffalo-canalside", "elmwood-essex-music-night", "annunciation-buffalo",
  "niagara-power-vista", "maid-of-the-mist", "cave-of-the-winds",
  "goat-island-illumination", "martin-house", "tr-inaugural-site", "armory-square",
  "erie-canal-museum", "albany-pine-bush", "ny-state-capitol-plaza", "turnpark-art-space"
];

const NEW_CORE_IDS = [
  "revolution-rail-hadley", "leatherstocking-bat-mill", "cayuga-fall-eco-cruise",
  "watkins-glen-gorge", "nut-house-hacker-witch", "balloons-over-letchworth",
  "mount-morris-dam", "fashion-outlets-niagara", "whirlpool-jet-boat",
  "lockport-locks-cruise", "montezuma-wildlife-drive", "moss-island-lock-e17",
  "thacher-indian-ladder"
];

const CORE_IDS = [
  "three-sisters-sanctuary", "grafton-peace-pagoda", "revolution-rail-hadley",
  "saratoga-mineral-springs", "secret-caverns", "cooperstown-lakefront",
  "leatherstocking-bat-mill", "cayuga-fall-eco-cruise", "watkins-glen-gorge",
  "make-your-own-glass", "house-of-guitars", "nut-house-hacker-witch",
  "balloons-over-letchworth", "letchworth-falls", "mount-morris-dam",
  "fashion-outlets-niagara", "annunciation-buffalo", "niagara-power-vista",
  "whirlpool-jet-boat", "cave-of-the-winds", "goat-island-illumination",
  "lockport-locks-cruise", "montezuma-wildlife-drive", "moss-island-lock-e17",
  "thacher-indian-ladder", "turnpark-art-space"
];

const OPTIONAL_IDS = new Set([
  "smith-botanic-garden", "tunnel-bar-northampton", "mass-moca", "howe-caverns",
  "iroquois-museum", "brewery-ommegang", "taughannock-falls", "corning-museum-of-glass",
  "artisanworks", "radio-social", "rochester-public-market", "elmwood-essex-music-night",
  "maid-of-the-mist", "martin-house", "tr-inaugural-site", "albany-pine-bush"
]);
const FLEX_IDS = new Set([
  "congress-park", "cardiff-giant", "empire-state-carousel", "cornell-botanic-gardens",
  "ithaca-falls", "rochester-high-falls", "buffalo-canalside", "armory-square",
  "ny-state-capitol-plaza"
]);
const ARCHIVE_IDS = new Set(["fenimore-farm", "george-eastman-museum", "erie-canal-museum"]);

// V1 one-for-one replacement alternatives. The V2 model retires the replacement system, but the
// research stays in the package as documented alternatives rather than being deleted.
const LEGACY_ALTERNATIVE_IDS = [
  "magic-wings", "clark-art-institute", "fly-creek-cider-mill", "museum-of-earth",
  "strong-museum-play", "eternal-flame-falls", "old-fort-niagara", "forest-lawn-blue-sky",
  "schenectady-stockade", "six-depot"
];

const NEW_SOURCES = [
  ["src-v2-revolution-rail", "Revolution Rail Co.", "official", "https://www.revrail.com/hadley-run", ["7-mile Hadley Run", "two-hour duration", "500-foot and 90-foot bridge", "quad price"]],
  ["src-v2-bat-mill", "Leatherstocking Hand-Split Billet Co.", "official", "https://leatherstockinghandsplits.com/wood-bat-mill-tour/", ["working mill tour", "one-hour duration", "$50 admission", "physical and accessibility notes"]],
  ["src-v2-cayuga-cruise", "Discover Cayuga Lake", "official", "https://discovercayugalake.org/", ["2026 fall foliage schedule", "Ithaca dock", "October operation"]],
  ["src-v2-watkins", "New York State Parks", "government", "https://parks.ny.gov/parks/watkinsglen", ["Gorge Trail", "seasonal closure", "trail difficulty"]],
  ["src-v2-pumpkin-pendant", "Corning Museum of Glass", "official", "https://glassmaking.cmog.org/myog/pumpkin-pendant", ["Sep 12-Nov 29 dates", "$32 price", "flameworking", "shipping"]],
  ["src-v2-nut-house", "Nut House Escape Rooms", "official", "https://www.nuthouseescaperooms.com/", ["The Hacker W.I.T.C.H.", "4-10 players", "private rooms", "dynamic pricing"]],
  ["src-v2-balloons", "Balloons Over Letchworth / Liberty Balloon Co.", "official", "https://www.libertyballoon.com/", ["2026 booking", "$445 starting price", "weather dependency"]],
  ["src-v2-mount-morris", "Recreation.gov / U.S. Army Corps of Engineers", "government", "https://www.recreation.gov/ticket/facility/10087801", ["guided dam tour", "$1 reservation fee", "rolling booking window", "physical requirements"]],
  ["src-v2-fashion-outlets", "Fashion Outlets of Niagara Falls USA", "official", "https://www.fashionoutletsniagara.com/hours", ["Saturday hours", "address"]],
  ["src-v2-whirlpool", "Whirlpool Jet Boat Tours", "official", "https://whirlpooljet.com/get-wet/get-wet-usa/", ["Lewiston departure", "45-minute route", "$68.95 base", "6% surcharge", "restrictions"]],
  ["src-v2-lockport", "Lockport Locks & Erie Canal Cruises", "official", "https://www.lockportlocks.com/daily-cruises.html", ["2026 fall schedule", "12:30 cruise", "$26 adult", "lock-through experience"]],
  ["src-v2-montezuma", "U.S. Fish & Wildlife Service", "government", "https://www.fws.gov/refuge/montezuma", ["Wildlife Drive season", "vehicle rules", "hours", "migration habitat"]],
  ["src-v2-moss", "City of Little Falls", "government", "https://thisislittlefalls.com/moss-island/", ["Moss Island access", "pothole geology", "Lock E17 context"]],
  ["src-v2-thacher", "New York State Parks", "government", "https://parks.ny.gov/visit/state-parks/thacher-state-park", ["Indian Ladder Trail", "Helderberg geology", "seasonal conditions"]]
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
  "three-sisters-sanctuary": { date: "2026-10-04", bucket: "nature-geology-terrain", texture: "WEIRD", interaction: 1, cost: cost(20, 20, 80), risk: "green", fallback: "smith-botanic-garden", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true },
  "grafton-peace-pagoda": { date: "2026-10-05", bucket: "sacred-living-worship", texture: "WORSHIP", interaction: 1, cost: cost(0), risk: "green", best: ["stivka"], secondary: ["viki", "gora", "sheluvspaco"] },
  "revolution-rail-hadley": { date: "2026-10-05", bucket: "moving-water-air-rail", texture: "MOVE", interaction: 3, cost: cost(50, 50, 200, "group-share", "One four-seat railbike."), risk: "yellow", best: ["viki", "gora", "sheluvspaco"], secondary: ["stivka"], reservation: "required", weather: true, highPhysicality: true, source_ids: ["src-v2-revolution-rail"] },
  "saratoga-mineral-springs": { date: "2026-10-05", bucket: "local-ritual-discovery", texture: "DISCOVER", interaction: 2, cost: cost(0), risk: "green", best: ["viki", "sheluvspaco"], secondary: ["gora", "stivka"] },
  "secret-caverns": { date: "2026-10-06", bucket: "nature-geology-terrain", texture: "EXPLORE", interaction: 2, cost: cost(20, 22, null, "per-person", "$20 cash or $22 card."), risk: "green", fallback: "howe-caverns", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], highPhysicality: true },
  "cooperstown-lakefront": { date: "2026-10-06", bucket: "nature-geology-terrain", texture: "RELAX", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"] },
  "leatherstocking-bat-mill": { date: "2026-10-07", bucket: "working-maker-infrastructure", texture: "DISCOVER", interaction: 2, cost: cost(50, 50, 200), risk: "yellow", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], reservation: "required", source_ids: ["src-v2-bat-mill"] },
  "cayuga-fall-eco-cruise": { date: "2026-10-07", bucket: "moving-water-air-rail", texture: "RELAX", interaction: 1, cost: cost(33, 33, 132), risk: "yellow", fallback: "taughannock-falls", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required", weather: true, source_ids: ["src-v2-cayuga-cruise"] },
  "watkins-glen-gorge": { date: "2026-10-08", bucket: "nature-geology-terrain", texture: "WILD", interaction: 3, cost: cost(5, 5, 20, "group-share", "Two $10 vehicle fees shared by four."), risk: "yellow", fallback: "taughannock-falls", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], weather: true, highPhysicality: true, source_ids: ["src-v2-watkins"] },
  "make-your-own-glass": { date: "2026-10-08", bucket: "working-maker-infrastructure", texture: "DISCOVER", interaction: 3, cost: cost(32, 32, 128), risk: "yellow", best: ["viki"], secondary: ["gora", "stivka", "sheluvspaco"], reservation: "required", source_ids: ["src-v2-pumpkin-pendant"] },
  "house-of-guitars": { date: "2026-10-09", bucket: "shopping-music-retail", texture: "SHOP", interaction: 1, cost: cost(0), risk: "green", best: ["stivka", "viki"], secondary: ["gora", "sheluvspaco"] },
  "nut-house-hacker-witch": { date: "2026-10-09", bucket: "puzzle-interactive", texture: "SOLVE", interaction: 3, cost: cost(33, 40, null, "per-person", "Dynamic four-player private-room planning range."), risk: "yellow", best: ["viki", "sheluvspaco"], secondary: ["gora", "stivka"], reservation: "required", source_ids: ["src-v2-nut-house"] },
  "balloons-over-letchworth": { date: "2026-10-10", bucket: "moving-water-air-rail", texture: "AWE", interaction: 2, cost: cost(445, 445, 1780), risk: "red", best: ["viki"], secondary: ["gora", "stivka", "sheluvspaco"], reservation: "required", weather: true, highPhysicality: true, source_ids: ["src-v2-balloons"] },
  "letchworth-falls": { date: "2026-10-10", bucket: "nature-geology-terrain", texture: "MOVE", interaction: 3, cost: cost(5, 5, 20, "group-share", "Two $10 vehicle fees shared by four."), risk: "yellow", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], weather: true, highPhysicality: true },
  "mount-morris-dam": { date: "2026-10-10", bucket: "working-maker-infrastructure", texture: "EXPLORE", interaction: 2, cost: cost(1, 1, 4), risk: "yellow", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], reservation: "required", exact: true, weather: true, highPhysicality: true, source_ids: ["src-v2-mount-morris"] },
  "fashion-outlets-niagara": { date: "2026-10-10", bucket: "shopping-music-retail", texture: "SHOP", interaction: 2, cost: cost(0), risk: "green", best: ["viki"], secondary: ["gora", "stivka", "sheluvspaco"], source_ids: ["src-v2-fashion-outlets"] },
  "annunciation-buffalo": { date: "2026-10-11", bucket: "sacred-living-worship", texture: "WORSHIP", interaction: 1, cost: cost(0), risk: "yellow", best: ["stivka"], secondary: ["viki", "gora", "sheluvspaco"] },
  "niagara-power-vista": { date: "2026-10-11", bucket: "working-maker-infrastructure", texture: "DISCOVER", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"] },
  "whirlpool-jet-boat": { date: "2026-10-11", bucket: "moving-water-air-rail", texture: "MOVE", interaction: 4, cost: cost(73.09, 73.09, 292.36, "per-person-plus-fees", "$68.95 base plus the published 6% fuel surcharge; booking fees extra."), risk: "red", fallback: "maid-of-the-mist", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], reservation: "required", weather: true, highPhysicality: true, source_ids: ["src-v2-whirlpool"] },
  "cave-of-the-winds": { date: "2026-10-11", bucket: "nature-geology-terrain", texture: "AWE", interaction: 4, cost: cost(23, 23, 92), risk: "yellow", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], exact: true, weather: true, highPhysicality: true },
  "goat-island-illumination": { date: "2026-10-11", bucket: "nature-geology-terrain", texture: "AWE", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true },
  "lockport-locks-cruise": { date: "2026-10-12", bucket: "moving-water-air-rail", texture: "EXPLORE", interaction: 2, cost: cost(26, 26, 104), risk: "yellow", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], reservation: "required", exact: true, weather: true, source_ids: ["src-v2-lockport"] },
  "montezuma-wildlife-drive": { date: "2026-10-12", bucket: "nature-geology-terrain", texture: "RELAX", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, source_ids: ["src-v2-montezuma"] },
  "moss-island-lock-e17": { date: "2026-10-13", bucket: "nature-geology-terrain", texture: "WILD", interaction: 3, cost: cost(0), risk: "yellow", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], weather: true, highPhysicality: true, source_ids: ["src-v2-moss"] },
  "thacher-indian-ladder": { date: "2026-10-13", bucket: "nature-geology-terrain", texture: "MOVE", interaction: 3, cost: cost(3, 3, 12, "group-share", "Two $6 vehicle fees shared by four."), risk: "yellow", fallback: "albany-pine-bush", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], weather: true, highPhysicality: true, source_ids: ["src-v2-thacher"] },
  "turnpark-art-space": { date: "2026-10-14", bucket: "nature-geology-terrain", texture: "WEIRD", interaction: 1, cost: cost(10, 10, 40, "group-share", "Official 3-5 adult group rate."), risk: "green", best: ["viki"], secondary: ["gora", "stivka", "sheluvspaco"], weather: true }
};

const NEW_PLACE_BASE = {
  "revolution-rail-hadley": ["Revolution Rail — Hadley Run", "railbike", "Hadley", "NY", "4113 Rockwell Street, Hadley, NY 12835", "Pedal a four-seat railbike for seven miles through Adirondack forest and across a 500-foot bridge 90 feet above the Hudson-Sacandaga confluence.", "It turns fall color, height and old rail infrastructure into one shared physical memory."],
  "leatherstocking-bat-mill": ["Leatherstocking Wood Bat Mill Tour", "working-wood-mill", "Oneonta", "NY", "359 Delaware County Highway 11, Oneonta, NY 13820", "Walk through a working hardwood mill while logs become hand-split billets, kiln-dried dowels and professional baseball bats.", "Robotics, saws, grain and a live turning process make the machinery—not a display case—the experience."],
  "cayuga-fall-eco-cruise": ["Cayuga Lake Fall Foliage Eco-Cruise", "lake-eco-cruise", "Ithaca", "NY", "1000 Allan H. Treman Marina Road, Ithaca, NY 14850", "A seasonal afternoon cruise on Cayuga Lake aboard the MV Teal, paced as a quiet water reset between the mill and the next day's gorge.", "It changes the route's water texture from another waterfall into open lake, migration and October color."],
  "watkins-glen-gorge": ["Watkins Glen Gorge Trail", "gorge-hike", "Watkins Glen", "NY", "1009 North Franklin Street, Watkins Glen, NY 14891", "Stone stairs and narrow passages follow Glen Creek past nineteen cascades, under spray and through the layered shale gorge.", "This is the Finger Lakes gorge worth spending the route's active slot on—close, kinetic and unmistakably geological."],
  "nut-house-hacker-witch": ["Nut House — The Hacker W.I.T.C.H.", "escape-room", "Rochester", "NY", "1280 Scottsville Road, Rochester, NY 14624", "A private four-person server-room escape game where the group has sixty minutes to stop a hacker from taking down the internet.", "Route 02 needs one genuinely strong puzzle block, and this room fits the group exactly without adding a second escape room."],
  "balloons-over-letchworth": ["Balloons Over Letchworth", "hot-air-balloon", "Castile", "NY", "6635 Middle Falls Road, Castile, NY 14427", "A weather-dependent dawn passenger flight launched from inside Letchworth State Park above the Genesee gorge and autumn forest.", "This is the premium signature switch: unforgettable if it flies, easy to remove without breaking the day if it does not."],
  "mount-morris-dam": ["Mount Morris Dam Guided Walking Tour", "working-dam-tour", "Mount Morris", "NY", "6103 Visitor Center Road, Mount Morris, NY 14510", "A ranger-led walk onto and inside the working flood-control dam, including a steep access grade and more than 100 feet of elevation change.", "After seeing Letchworth from air and trail, this reveals the engineered system that controls the same river."],
  "fashion-outlets-niagara": ["Fashion Outlets of Niagara Falls USA", "outlet-shopping", "Niagara Falls", "NY", "1900 Military Road, Niagara Falls, NY 14304", "A protected three-hour shopping block at the region's major US-side outlet center before the group settles in Buffalo.", "It gives Viki one real shopping chapter instead of scattering weak retail stops through the route."],
  "whirlpool-jet-boat": ["Whirlpool Jet Boat — Niagara Gorge", "rapids-jet-boat", "Lewiston", "NY", "115 South Water Street, Lewiston, NY 14092", "A 45-minute jet-boat run from Lewiston into the Niagara Gorge and through Class 5 rapids, with wet and enclosed dry variants.", "Niagara becomes force rather than postcard: the group physically enters the current after learning how the river makes power."],
  "lockport-locks-cruise": ["Lockport Locks & Erie Canal Cruise", "working-lock-cruise", "Lockport", "NY", "210 Market Street, Lockport, NY 14094", "A two-hour narrated boat trip that rises and falls through Locks 34 and 35 and passes the old lock flight and rock cut.", "The group actually locks through the canal instead of learning about it only from a museum label."],
  "montezuma-wildlife-drive": ["Montezuma Wildlife Drive", "wildlife-auto-drive", "Seneca Falls", "NY", "3395 US Route 20 East, Seneca Falls, NY 13148", "A three-mile vehicle-only refuge drive through migration wetlands near sunset, with stops only at signed viewing points.", "It is both a quiet birding reset and the correct break in the Lockport-to-Syracuse return corridor."],
  "moss-island-lock-e17": ["Moss Island & Lock E17", "geology-canal-walk", "Little Falls", "NY", "Moss Island, Little Falls, NY 13365", "A compact walk among giant glacial-hydraulic potholes beside one of the Erie Canal's tallest locks.", "Geology and canal machinery occupy the same patch of ground, making this a high-value return-corridor stop rather than filler."],
  "thacher-indian-ladder": ["Thacher State Park — Indian Ladder", "escarpment-hike", "Voorheesville", "NY", "830 Thacher Park Road, Voorheesville, NY 12186", "A seasonal escarpment walk beneath limestone ledges, past fossils and waterfalls, with broad views across the Hudson-Mohawk valleys.", "It closes the geology sequence at landscape scale and has an easy overlook or Pine Bush fallback when the trail is wet or shut."]
};

const DAY_PLANS = [
  { day: 1, date: "2026-10-04", sleep_city: "Northampton, MA", theme: "Strange sanctuary · soft ignition", schedule: [["14:30", "16:00", "three-sisters-sanctuary", "anchor"]], lodging: ["Downtown Northampton with two-room inventory and secure two-car parking", "Hadley near Route 9 for an easier morning exit"], notes: ["Begin with one handmade, weather-exposed world after the Boston pickup; do not overfill arrival day."], fallback: "Heavy rain: activate Lyman Conservatory and keep the sanctuary optional." },
  { day: 2, date: "2026-10-05", sleep_city: "Saratoga Springs, NY", theme: "Sacred hill · rail over rivers · mineral ritual", schedule: [["09:20", "10:10", "grafton-peace-pagoda", "supporting"], ["12:00", "14:00", "revolution-rail-hadley", "anchor"], ["15:15", "16:30", "saratoga-mineral-springs", "supporting"]], lodging: ["Central Saratoga near Broadway with secure parking", "I-87 edge hotel with strong two-room inventory"], notes: ["Measured road geometry makes this the route's longest total-driving day even though no single leg exceeds two hours."], fallback: "Railbike cancellation: go to Saratoga early; use MASS MoCA only if the group actively wants an indoor art block." },
  { day: 3, date: "2026-10-06", sleep_city: "Cooperstown, NY", theme: "Underground waterfall · quiet lake", schedule: [["10:00", "11:15", "secret-caverns", "anchor"], ["12:45", "13:30", "cooperstown-lakefront", "supporting"]], lodging: ["Cooperstown village near Main Street and the lake", "Route 28 hotel cluster with easy two-car parking"], notes: ["The low-output lake reset is intentional after 103 cave stairs."], fallback: "Choose Howe Caverns if the group wants a more polished cave format or easier comfort profile." },
  { day: 4, date: "2026-10-07", sleep_city: "Ithaca, NY", theme: "Working wood · open water", schedule: [["10:00", "11:00", "leatherstocking-bat-mill", "anchor"], ["15:00", "16:30", "cayuga-fall-eco-cruise", "anchor"]], lodging: ["Downtown Ithaca near the Commons with secure parking", "Southwest Ithaca near Route 13 for the Watkins Glen exit"], notes: ["The cruise time is a planning target until the exact Oct 7 departure posts."], fallback: "Wind cancellation: activate Taughannock Falls and keep the bat mill fixed." },
  { day: 5, date: "2026-10-08", sleep_city: "Rochester, NY", theme: "Shale gorge · glass over flame", schedule: [["08:30", "10:30", "watkins-glen-gorge", "anchor"], ["11:30", "12:30", "make-your-own-glass", "anchor"]], lodging: ["Rochester East End or Neighborhood of the Arts with secure parking", "Brighton near I-590 with reliable two-room inventory"], notes: ["Recheck the Gorge Trail 48 hours before; the Corning pendant remains valuable even if the trail closes."], fallback: "Early gorge closure: use a rim walk or Ithaca flex, then protect the reserved glassmaking slot." },
  { day: 6, date: "2026-10-09", sleep_city: "Mount Morris / Geneseo, NY", theme: "Cult guitars · elite puzzles · position south", schedule: [["10:00", "11:00", "house-of-guitars", "supporting"], ["12:00", "13:15", "nut-house-hacker-witch", "anchor"]], lodging: ["Mount Morris near the Letchworth north entrance", "Geneseo with cleaner two-room inventory and easy NY-36 access"], notes: ["The Rochester second night is deliberately moved south to protect Saturday's dawn start and exact 14:00 dam tour."], fallback: "If the escape room is unavailable, use ARTISANworks; do not move the overnight back to Rochester." },
  { day: 7, date: "2026-10-10", sleep_city: "Buffalo, NY", theme: "Sky · gorge · dam · outlets", schedule: [["06:30", "09:00", "balloons-over-letchworth", "anchor"], ["10:00", "12:00", "letchworth-falls", "anchor"], ["14:00", "15:00", "mount-morris-dam", "anchor"], ["16:45", "19:45", "fashion-outlets-niagara", "anchor"]], lodging: ["Buffalo Elmwood Village with secure off-street parking", "Downtown Buffalo with a staffed garage"], notes: ["The $445 balloon is a premium switch, not a dependency; the ground day remains complete without it."], fallback: "Balloon cancellation: sleep later, deepen the ground walk, keep the dam and shopping, and save $445 per person." },
  { day: 8, date: "2026-10-11", sleep_city: "Buffalo, NY", theme: "Orthodox Sunday · live power · Niagara force", schedule: [["08:45", "11:30", "annunciation-buffalo", "anchor"], ["12:15", "13:00", "niagara-power-vista", "supporting"], ["13:30", "14:15", "whirlpool-jet-boat", "anchor"], ["15:00", "16:15", "cave-of-the-winds", "anchor"], ["16:15", "18:30", "goat-island-illumination", "supporting"]], lodging: ["Same Buffalo Elmwood hotel", "Same downtown Buffalo hotel"], notes: ["Confirm the Oct 11 parish bulletin and the exact jet departure; choose the enclosed Dry Freedom version for lower cold exposure."], fallback: "Jet cancellation or comfort issue: substitute Maid of the Mist rather than adding it as a second boat." },
  { day: 9, date: "2026-10-12", sleep_city: "Syracuse, NY", theme: "Working canal · migration reset", schedule: [["12:30", "14:30", "lockport-locks-cruise", "anchor"], ["17:20", "18:05", "montezuma-wildlife-drive", "supporting"]], lodging: ["Syracuse Armory Square with staffed parking", "East Syracuse near I-90 for an easier morning departure"], notes: ["OSRM measures Lockport to Montezuma longer than the rebuild brief; the documented Ontario Travel Plaza comfort break splits the run without becoming a scored attraction."], fallback: "Cruise cancellation: continue east, keep the Ontario Travel Plaza comfort break and Montezuma, and do not use the closed Lockport Cave attraction." },
  { day: 10, date: "2026-10-13", sleep_city: "Albany, NY", theme: "Giant potholes · escarpment", schedule: [["10:00", "11:30", "moss-island-lock-e17", "anchor"], ["13:15", "15:00", "thacher-indian-ladder", "anchor"]], lodging: ["East Greenbush or Rensselaer near I-90", "Downtown Albany only with secure two-car parking"], notes: ["Verify Moss Island construction access and Indian Ladder trail status; do not improvise climbing."], fallback: "If Indian Ladder is closed or slick, activate Albany Pine Bush and keep the Little Falls geology stop." },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", theme: "Marble quarry art · protected return", schedule: [["10:00", "11:30", "turnpark-art-space", "anchor"]], lodging: ["Logan Airport hotel with confirmed shuttle", "Revere or East Boston with a verified airport transfer"], notes: ["A Charlton service-plaza break is encoded because the measured West Stockbridge-to-Boston baseline exceeds 2.5 uninterrupted hours."], fallback: "Severe rain or Boston traffic: shorten or skip TurnPark; the rental return and final Boston night win." }
];

function travelerFit(best, secondary) {
  return Object.fromEntries(PEOPLE.map((person) => [person, best.includes(person) ? 5 : secondary.includes(person) ? 4 : 3.5]));
}

function originalStatus(id) {
  if (CORE_IDS.includes(id)) return ORIGINAL_IDS.includes(id) ? "keep-core" : id === "secret-caverns" ? "promoted-original-alternative" : "new-core";
  if (OPTIONAL_IDS.has(id)) return "keep-optional";
  if (FLEX_IDS.has(id)) return "demote-flex";
  if (ARCHIVE_IDS.has(id)) return "remove-archive";
  return "documented-alternative";
}

function enrichCore(base, id) {
  const config = CORE_CONFIG[id];
  const [name, kind, city, state, address, summary, whyGo] = NEW_PLACE_BASE[id] || [];
  const best = config.best;
  const secondary = config.secondary;
  const current = base || {};
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
    summary: summary || (id === "make-your-own-glass" ? "Work colored glass rods over a torch to create a seasonal pumpkin pendant, then have the cooled piece shipped home at no added domestic charge." : id === "letchworth-falls" ? "Use a compact active route around Letchworth's gorge and Upper-Middle Falls instead of treating the park as only a scenic drive." : current.summary),
    why_go: whyGo || (id === "make-your-own-glass" ? "The group makes the object instead of spending the core block walking galleries." : id === "letchworth-falls" ? "The correct landscape stays, but the group now moves through it between the balloon and the dam." : current.why_go),
    best_for: best,
    secondary_for: secondary,
    best_fit_note: `Primary fit: ${best.join(", ")}. ${config.highPhysicality ? "A lower-intensity or skip path is documented in the route." : "The stop also gives the rest of the group a distinct change of pace."}`,
    categories: current.categories || ["unusual_creative"],
    duration_minutes: current.duration_minutes || 90,
    priority: "anchor",
    reservation: config.reservation || "none",
    hours: current.hours || { opens: null, closes: null, status: "reconfirm-required", note: "Use the scheduled route window; reconfirm operator inventory." },
    cost: config.cost,
    source_ids: config.source_ids || current.source_ids || [],
    coordinates: current.coordinates || manualCoordinates[id],
    coordinate_order: "longitude_latitude",
    coordinate_source: current.coordinate_source || "manual_verified_address",
    ratings: { traveler_ratings: Object.fromEntries(PEOPLE.map((person) => [person, null])), average: null, rating_count: 0 },
    researcher_person_fit: travelerFit(best, secondary),
    included_in_magic_score: true,
    core_status: "core",
    original_status: originalStatus(id),
    energy_rebuild_role: "active-core",
    experience_bucket: config.bucket,
    texture: config.texture,
    interaction_score: config.interaction,
    museum_like: false,
    experience_flags: {
      museum_like: false,
      weather_gated: Boolean(config.weather),
      booking_required: config.reservation === "required",
      exact_date_verified: Boolean(config.exact),
      traffic_gated: false,
      high_physicality: Boolean(config.highPhysicality),
      skip_possible: true,
      photo_heavy: ["AWE", "WILD", "WEIRD", "MOVE"].includes(config.texture)
    },
    viki_fit: travelerFit(best, secondary).viki,
    gora_fit: travelerFit(best, secondary).gora,
    stivka_fit: travelerFit(best, secondary).stivka,
    planner_balance_fit: travelerFit(best, secondary).sheluvspaco,
    price_type: config.cost.price_type,
    price_per_person_low: config.cost.low,
    price_per_person_high: config.cost.high,
    price_per_group: config.cost.amount_per_group,
    price_last_checked: VERIFIED_AT,
    optional: true,
    included_in_daily_max_total: true,
    source_confidence: "primary-source-verified",
    operational_risk: config.risk,
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
  if (!place) throw new Error(`Missing Route 02 V2 place: ${placeId}`);
  return { start, end, place_id: placeId, priority, reservation: place.reservation };
}

function imageRecord(placeId, image, index) {
  const external = image.rights_status === "permission-required-before-public-deployment" || image.production_usable === false;
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
    license: image.license || "External editorial image; reuse permission required",
    license_url: image.license_url || image.source_page,
    alt: image.description || `${placeId.replaceAll("-", " ")} photograph`,
    coverage: contextualImagePlaces.has(placeId) ? "exact-place-or-experience-context" : "exact-place-or-experience",
    production_usable: !external,
    rights_status: external ? "permission-required-before-public-deployment" : (image.rights_status || "commons-license-recorded"),
    visual_review: "reviewed"
  };
}

export async function buildEnergyRoute02({ root, routeDir }) {
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
  const keepIds = [...ORIGINAL_IDS, "secret-caverns", ...LEGACY_ALTERNATIVE_IDS, ...NEW_CORE_IDS];
  const places = keepIds.map((id) => CORE_IDS.includes(id) ? enrichCore(currentPlaceById.get(id), id) : enrichNonCore(currentPlaceById.get(id))).filter(Boolean);
  const placeById = new Map(places.map((place) => [place.id, place]));

  const keptOriginalIds = new Set([...ORIGINAL_IDS, "secret-caverns", ...LEGACY_ALTERNATIVE_IDS]);
  const existingImages = currentImagesPackage.images.filter((image) => keptOriginalIds.has(image.place_id));
  const newImages = NEW_CORE_IDS.flatMap((placeId) => {
    const selected = research.places[placeId]?.selected_images || [];
    if (selected.length < 3) throw new Error(`${placeId} has ${selected.length}/3 Route 02 V2 images.`);
    return selected.slice(0, 3).map((image, index) => imageRecord(placeId, image, index));
  });
  const images = [...existingImages, ...newImages];
  const imageIdsByPlace = new Map();
  for (const image of images) imageIdsByPlace.set(image.place_id, [...(imageIdsByPlace.get(image.place_id) || []), image.id]);
  for (const place of places) {
    place.image_ids = imageIdsByPlace.get(place.id) || [];
    place.data_status = place.image_ids.length >= 3 ? "complete" : "image-gap";
  }

  const sourceById = new Map(currentSourcesPackage.sources.map((source) => [source.id, source]));
  for (const source of NEW_SOURCES) sourceById.set(source.id, source);
  const usedSourceIds = new Set(places.flatMap((place) => place.source_ids));
  const sources = [...sourceById.values()].filter((source) => usedSourceIds.has(source.id));

  const weatherByDay = new Map(weather.days.map((day) => [day.day, day]));
  const geometryByDay = new Map(geometry.days.map((day) => [day.day, day]));
  const comfortScores = [4.0, 2.8, 4.3, 3.7, 3.4, 4.6, 3.0, 3.8, 3.2, 3.4, 3.5];
  const TOTAL_CAP = 270;
  const CAP_EXCEPTIONS = {
    9: { minutes: 310, reason: "Buffalo to Lockport to Montezuma to Syracuse is the measured working-canal and migration day. The documented Ontario Travel Plaza comfort break holds every uninterrupted leg to 106 minutes, but the 298-minute total sits above the 270-minute standard cap and is authorised deliberately." }
  };

  const days = DAY_PLANS.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    const longestLeg = Math.max(0, ...routed.legs.map((leg) => leg.baseline_minutes));
    const exception = CAP_EXCEPTIONS[plan.day];
    const capStatus = longestLeg > 150
      ? "over-uninterrupted-cap"
      : exception
        ? "authorised-long-total-day"
        : routed.baseline_total_minutes > TOTAL_CAP
          ? "over-total-cap"
          : routed.baseline_total_minutes > 210
            ? "long-total-day"
            : routed.planning_total_minutes.high > 210
              ? "live-traffic-gated"
              : "comfortable";
    return {
      ...plan,
      day_of_week: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "America/New_York" }).format(new Date(`${plan.date}T12:00:00-04:00`)),
      lodging: { preferred_area: plan.lodging[0], fallback_area: plan.lodging[1], room_setup: "Two rooms: one 1-bed room and one 2-bed room", notes: "Strong suggestion only; prioritize safety, cleanliness, secure two-car parking and the exact bed layout." },
      schedule: plan.schedule.map((item) => scheduleItem(item, placeById)),
      drive: {
        legs: routed.legs,
        baseline_total_miles: routed.baseline_total_miles,
        baseline_total_minutes: routed.baseline_total_minutes,
        planning_total_minutes: routed.planning_total_minutes,
        traffic_risk: routed.risk,
        cap_minutes: TOTAL_CAP,
        authorized_cap_exception_minutes: exception?.minutes,
        cap_exception_reason: exception?.reason,
        max_uninterrupted_minutes: longestLeg,
        uninterrupted_cap_minutes: 150,
        cap_status: capStatus,
        fallback: plan.fallback
      },
      weather: {
        kind: "historical_normal",
        high_c: normal.normal_high_c,
        low_c: normal.normal_low_c,
        precipitation_probability_percent: normal.measurable_precipitation_probability_percent,
        comfort_score: comfortScores[plan.day - 1],
        station_id: normal.station_id,
        station_name: normal.station_name,
        station_role: plan.day === 6 ? "Rochester-Mount Morris regional proxy" : normal.station_role,
        source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Weather-sensitive activities have explicit route-safe fallbacks."
      }
    };
  });

  const corePlaces = places.filter((place) => place.included_in_magic_score);
  const lowCost = corePlaces.reduce((sum, place) => sum + place.price_per_person_low, 0);
  const highCost = corePlaces.reduce((sum, place) => sum + place.price_per_person_high, 0);
  const withoutBalloonLow = lowCost - placeById.get("balloons-over-letchworth").price_per_person_low;
  const withoutBalloonHigh = highCost - placeById.get("balloons-over-letchworth").price_per_person_high;
  const baselineMiles = Math.round(days.reduce((sum, day) => sum + day.drive.baseline_total_miles, 0) * 10) / 10;
  const scheduled = new Set(days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  const longestLeg = Math.max(...days.flatMap((day) => day.drive.legs.map((leg) => leg.baseline_minutes)));

  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID,
      slug: "falls-fire-clockwork-loop",
      name: "The Falls, Fire & Clockwork Loop",
      short_name: "Falls · Fire · Clockwork",
      status: "energy-rebuild-ui-ready",
      map_color: "#6C5CE7",
      timezone: "America/New_York",
      start_date: "2026-10-04",
      end_date: "2026-10-14",
      airport_date: "2026-10-15",
      origin: { name: "Boston Logan Rental Car Center", coordinates: [-71.0236, 42.3670] },
      destination: { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
      endpoint_city: "Niagara Falls, NY",
      direction: "Boston through the Berkshires, Saratoga, Finger Lakes and Genesee gorge to Niagara; return through the working Erie Canal and Helderberg escarpment",
      countries: ["US"],
      canada_included: false,
      total_nights: 11,
      road_nights: 10,
      final_boston_nights: 1,
      baseline_total_miles: baselineMiles,
      energy_rebuild_version: "2.0.0",
      energy_rebuild_verified_at: VERIFIED_AT,
      route_dna: "WATER × ROCK × FIRE × MOTION",
      summary: "An Upstate New York force-and-motion loop: rail over rivers, underground water, a working bat mill, glass over flame, Letchworth by air and trail, a live flood-control dam, Niagara rapids, working canal locks, migration wetlands and escarpment geology."
    },
    constraints: {
      travelers: 4,
      cars: 2,
      cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 210],
      daily_drive_hard_cap_minutes: 270,
      max_uninterrupted_drive_minutes: 150,
      route_specific_drive_rule: "Activity and comfort breaks reset the uninterrupted clock; no core leg may exceed 150 baseline minutes.",
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only route; Niagara is visited entirely from New York with no Canada or J-1 re-entry dependency.",
      budget_excludes: ["lodging", "rental cars", "fuel", "tolls", "food", "nightlife", "shopping purchases"]
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
      museum_like_core_count: 0,
      museum_like_core_percent: 0,
      route_dna: "water-rock-fire-motion",
      design_rule: "Optional, flex and archived originals remain visible but do not affect Magic unless activated."
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
      do_everything_core_low_per_person_usd: Math.round(lowCost * 100) / 100,
      do_everything_core_high_per_person_usd: Math.round(highCost * 100) / 100,
      without_balloon_low_per_person_usd: Math.round(withoutBalloonLow * 100) / 100,
      without_balloon_high_per_person_usd: Math.round(withoutBalloonHigh * 100) / 100,
      balloon_share_of_high_percent: Math.round((445 / highCost) * 1000) / 10,
      variable_booking_fees_excluded: true,
      shopping_spend_excluded: true,
      food_nightlife_lodging_cars_fuel_excluded: true,
      note: "Every paid attraction is optional. The balloon is the premium switch and the UI should sum only experiences the group activates."
    },
    booking_priorities: [
      { place_id: "balloons-over-letchworth", urgency: "red-lock-first", reason: "Exact Oct 10 dawn inventory and weather." },
      { place_id: "whirlpool-jet-boat", urgency: "red-lock-first", reason: "Exact Oct 11 departure and wet/dry boat choice." },
      { place_id: "revolution-rail-hadley", urgency: "tier-a", reason: "Reserve the Oct 5 four-seat railbike." },
      { place_id: "cayuga-fall-eco-cruise", urgency: "tier-a", reason: "Lock the exact Oct 7 fall departure when posted." },
      { place_id: "nut-house-hacker-witch", urgency: "tier-a", reason: "Reserve a private four-player session." },
      { place_id: "mount-morris-dam", urgency: "rolling-window", reason: "Exact Oct 10 14:00 event; tickets open seven days ahead." },
      { place_id: "make-your-own-glass", urgency: "tier-b", reason: "Reserve the Oct 8 Pumpkin Pendant slot." },
      { place_id: "lockport-locks-cruise", urgency: "tier-b", reason: "Reserve the Oct 12 12:30 cruise." },
      { place_id: "leatherstocking-bat-mill", urgency: "tier-b", reason: "Capacity-limited working mill tour." }
    ],
    validation: {
      date_count: days.length,
      expected_date_count: 11,
      all_drive_days_at_or_below_total_cap: days.every((day) => day.drive.baseline_total_minutes <= (day.drive.authorized_cap_exception_minutes || TOTAL_CAP)),
      all_uninterrupted_legs_at_or_below_cap: longestLeg <= 150,
      longest_uninterrupted_leg_minutes: longestLeg,
      authorized_cap_exception_days: days.filter((day) => day.drive.authorized_cap_exception_minutes).map((day) => day.day),
      live_traffic_gated_days: days.filter((day) => day.drive.planning_total_minutes.high > 210).map((day) => day.day),
      long_total_driving_days: days.filter((day) => day.drive.baseline_total_minutes > 210).map((day) => day.day),
      place_count: places.length,
      core_place_count: corePlaces.length,
      scheduled_unique_place_count: scheduled.size,
      image_count: images.length,
      places_with_fewer_than_3_usable_images: places.filter((place) => place.image_ids.length < 3).map((place) => place.id),
      replacement_option_count: 0,
      all_replacement_variants_at_or_below_cap: true,
      unfilled_place_ratings: places.length * PEOPLE.length,
      hard_closures_or_conflicts: [
        "Day 2 is a 265-minute measured total-driving day even though every uninterrupted leg is at or below 120 minutes.",
        "Day 9 measures 298 baseline driving minutes, above the 270-minute standard cap; it carries an explicit authorised exception and the documented Ontario Travel Plaza comfort break.",
        "Day 9 uses the documented Ontario Travel Plaza comfort break because the direct Lockport-to-Montezuma OSRM leg exceeded 150 minutes.",
        "Day 11 uses an explicit Charlton service-plaza break because the direct West Stockbridge-Boston OSRM leg exceeded 150 minutes.",
        "The Letchworth balloon and Whirlpool Jet remain booking and weather gated.",
        "Watkins Glen, Moss Island and Indian Ladder require current closure checks.",
        "OSRM contains no live traffic; Boston and Niagara approaches remain live-traffic gates."
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
    purpose: "Rebuild Route 02 around water, rock, fire, motion and working infrastructure while retaining every original stop in the revision history.",
    route_dna: "WATER × ROCK × FIRE × MOTION",
    retained_original_core_ids: CORE_IDS.filter((id) => ORIGINAL_IDS.includes(id)),
    promoted_original_alternative_ids: ["secret-caverns"],
    new_core_ids: NEW_CORE_IDS,
    original_optional_ids: [...OPTIONAL_IDS],
    original_flex_ids: [...FLEX_IDS],
    original_archive_ids: [...ARCHIVE_IDS],
    documented_alternative_ids: LEGACY_ALTERNATIVE_IDS,
    replacement_model_change: "The eleven legacy one-for-one replacement variants are retired. Their places stay visible as documented alternatives and are excluded from Magic until activated.",
    overnight_change: "Rochester's second night moves to Mount Morris / Geneseo on Oct 9.",
    drive_correction: "Measured OSRM geometry replaces optimistic prose bands. The Charlton Service Plaza and Ontario Travel Plaza comfort breaks keep every uninterrupted baseline leg at or below 150 minutes; Day 9\u2019s 298-minute total carries an explicit authorised cap exception rather than being hidden.",
    image_policy: "Existing Commons and attribution records are preserved. Niche operator images are exact-place private-prototype assets marked permission-required before public deployment."
  };
  const replacementGeometry = { schema_version: "1.0.0", route_id: ROUTE_ID, generated_at: VERIFIED_AT, routing_engine: "none-required", traffic_included: false, variants: [] };
  const readme = `# Route 02 — The Falls, Fire & Clockwork Loop\n\nCanonical Energy Rebuild V2 for October 4-15, 2026. Route DNA: **WATER × ROCK × FIRE × MOTION**.\n\n## Package summary\n\n- ${places.length} total places: ${corePlaces.length} active core experiences plus all ${places.length - corePlaces.length} non-core originals preserved as optional, flex, archived or documented alternatives\n- ${scheduled.size} uniquely scheduled core place cards across 11 days\n- ${images.length} local carousel images\n- ${baselineMiles.toFixed(1)} OSRM baseline miles\n- ${longestLeg} minutes for the longest uninterrupted baseline leg after explicit comfort breaks\n- $${lowCost.toFixed(2)}-$${highCost.toFixed(2)} optional do-everything attraction range per person, before variable booking fees\n- $${withoutBalloonLow.toFixed(2)}-$${withoutBalloonHigh.toFixed(2)} without the weather-dependent Letchworth balloon\n\n## Structural change\n\nThe Oct 9 overnight moves from Rochester to Mount Morris / Geneseo. That protects the Oct 10 dawn balloon, active Letchworth time and exact 14:00 Mount Morris Dam tour.\n\n## Road evidence\n\nThe rebuild brief's prose drive bands were optimistic on several legs. Frozen OSRM geometry is canonical in the UI. Day 2 is a long total-driving day, while the documented Ontario Travel Plaza break on Day 9 and Charlton Service Plaza on Days 1 and 11 keep every uninterrupted baseline leg at or below 150 minutes. These are comfort breaks, not scored attractions.\n\n## UI contract\n\nCore places expose texture, interaction, booking risk, weather gates, skip logic, traveler fit and optional cost ranges. Optional, flex and archived originals remain visible but are excluded from Magic until activated.\n\n## Operations\n\nThe route is UI-ready but not booking-final. Lock the balloon, jet boat, railbike, Cayuga cruise and escape room first. Recheck Watkins Glen, Moss Island and Indian Ladder access near departure. Exact operator/editorial imagery remains private-prototype-only until rights are cleared.\n\nRebuild with \`node scripts/route-02/build.mjs\`, then validate with \`node scripts/validate-route-package.mjs ${ROUTE_SLUG}\`.\n`;

  const manifestRoute = manifest.routes.find((entry) => entry.id === ROUTE_ID);
  if (!manifestRoute) throw new Error("route-02 is missing from dataset/manifest.json");
  manifestRoute.name = route.route.name;
  manifestRoute.status = "energy-rebuild-ui-ready";
  manifestRoute.place_count = places.length;
  manifestRoute.image_count = images.length;
  manifestRoute.day_count = days.length;
  manifestRoute.baseline_miles = baselineMiles;

  await Promise.all([
    writeJson(path.join(routeDir, "places.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, places }),
    writeJson(path.join(routeDir, "images.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Legacy rights retained; niche operator images are private-prototype-only until permission is cleared.", images }),
    writeJson(path.join(routeDir, "sources.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: VERIFIED_AT, sources }),
    writeJson(path.join(routeDir, "route.json"), route),
    writeJson(path.join(routeDir, "route.geojson"), geojson),
    writeJson(path.join(routeDir, "replacement-geometry.json"), replacementGeometry),
    writeJson(path.join(routeDir, "route-decisions.json"), decisions),
    writeJson(path.join(routeDir, "place-seed.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, generated_from: "Energy Rebuild Routes/Route02_Falls_Fire_Clockwork_Rebuild.md", places }),
    writeFile(path.join(routeDir, "README.md"), readme),
    writeJson(path.join(root, "dataset", "manifest.json"), manifest)
  ]);
  console.log(`Built Route 02 Energy V2: ${places.length} places, ${images.length} images, ${days.length} days.`);
  return { placeCount: places.length, imageCount: images.length, dayCount: days.length };
}
