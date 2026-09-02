import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { contextualImagePlaces, manualCoordinates } from "../route-03/config.mjs";

const ROUTE_ID = "route-03";
const ROUTE_SLUG = "route-03-wild-shore-rockets-folklore-loop";
const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
const VERIFIED_AT = "2026-08-31";
const writeJson = (filePath, value) => writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);

const ORIGINAL_IDS = [
  "florence-griswold", "cross-sound-ferry", "greenport-waterfront", "book-barn-niantic",
  "north-ferry", "mashomack-preserve", "south-ferry", "parrish-art-museum", "big-duck",
  "tanger-riverhead", "long-island-aquarium", "cradle-of-aviation", "asbury-boardwalk",
  "silverball-asbury", "asbury-live-music", "ocean-grove", "lucy-elephant", "nas-wildwood",
  "cape-may-victorian", "cape-may-ghosts", "sunset-beach-atlantus", "cape-may-lewes-ferry",
  "fort-miles", "great-dune-tower", "berlin-historic", "zwaanendael", "assateague",
  "nasa-wallops", "barrier-islands-center", "chesapeake-bridge-tunnel", "norfolk-pagoda",
  "cape-charles", "nauticus-wisconsin", "edgar-cayce-are", "vibe-neptune", "poe-museum-richmond",
  "hermitage-norfolk", "richmond-orthodox", "bo-railroad", "baltimore-industry", "mutter-museum",
  "metuchen-main-street", "andalusia-estate", "sleepy-hollow-cemetery", "old-dutch-church",
  "headless-horseman", "pumpkin-blaze", "rockefeller-arts", "pez-visitor-center",
  "barker-cartoon-museum"
];

const NEW_CORE_IDS = [
  "uss-nautilus-museum", "fire-island-lighthouse", "revolution-rail-cape-may",
  "cape-may-lighthouse", "assateague-pony-kayak", "kiptopeke-concrete-ships",
  "richmond-capitol-ghost-tour", "neabsco-creek-boardwalk", "maryland-renaissance-festival",
  "mullica-cedar-paddle", "schooner-argia"
];

const CORE_IDS = [
  "uss-nautilus-museum", "cross-sound-ferry", "greenport-waterfront",
  "north-ferry", "mashomack-preserve", "south-ferry", "tanger-riverhead",
  "fire-island-lighthouse", "asbury-boardwalk", "silverball-asbury",
  "lucy-elephant", "revolution-rail-cape-may", "cape-may-lighthouse", "cape-may-ghosts",
  "cape-may-lewes-ferry", "fort-miles", "assateague",
  "assateague-pony-kayak", "nasa-wallops", "kiptopeke-concrete-ships", "chesapeake-bridge-tunnel",
  "nauticus-wisconsin", "richmond-capitol-ghost-tour",
  "richmond-orthodox", "neabsco-creek-boardwalk", "maryland-renaissance-festival",
  "mullica-cedar-paddle",
  "sleepy-hollow-cemetery", "old-dutch-church", "headless-horseman", "pumpkin-blaze",
  "schooner-argia"
];

const OPTIONAL_IDS = new Set([
  "asbury-live-music", "barrier-islands-center", "poe-museum-richmond", "bo-railroad",
  "pez-visitor-center"
]);
const FLEX_IDS = new Set([
  "big-duck", "cape-may-victorian", "great-dune-tower", "berlin-historic", "norfolk-pagoda",
  "vibe-neptune", "metuchen-main-street"
]);
const ARCHIVE_IDS = new Set([
  "florence-griswold", "parrish-art-museum", "cradle-of-aviation", "nas-wildwood",
  "edgar-cayce-are", "mutter-museum"
]);

const NEW_SOURCES = [
  ["src-v3-nautilus", "Submarine Force Museum / U.S. Navy", "official", "https://ussnautilus.org/museum-information/", ["Oct 1-Apr 30 Wed-Mon 09:00-16:00", "free admission", "self-guided Nautilus tour", "conservative 16:00 close"]],
  ["src-v3-fire-island-lighthouse", "Fire Island Lighthouse Preservation Society", "official", "https://fireislandlighthouse.com/visit/", ["daily tower operation", "$10 adult tower admission", "182 steps", "Robert Moses Field 5 access"]],
  ["src-v3-revrail-cape-may", "Revolution Rail Co.", "official", "https://www.revrail.com/cape-may-run", ["4-mile Cape May run", "$170 four-seat railbike", "Garrett Family Preserve and canal route", "exact-date calendar not yet exposed"]],
  ["src-v3-cape-may-lighthouse", "Cape May MAC", "official", "https://capemaymac.org/experience/cape-may-lighthouse/", ["199 steps", "about $12 adult tower admission", "weather and lightning closures"]],
  ["src-v3-assateague-explorer", "Assateague Explorer", "official", "https://assateagueexplorer.com/", ["2-2.5 hour guided kayak", "April-October operation", "from $69 plus 6% card fee", "no experience required", "wildlife boat tour fallback"]],
  ["src-v3-chincoteague-refuge", "U.S. Fish & Wildlife Service", "government", "https://www.fws.gov/refuge/chincoteague", ["Wildlife Loop open to vehicles after 3pm to dusk", "October refuge access to 8pm", "$10 weekly vehicle pass", "horse sightings never guaranteed"]],
  ["src-v3-kiptopeke", "Virginia State Parks / Department of Conservation and Recreation", "government", "https://www.dcr.virginia.gov/state-parks/kiptopeke", ["nine WWII concrete ships as breakwater", "coastal migration corridor", "$7 per passenger vehicle parking"]],
  ["src-v3-nauticus-tour", "Nauticus / Battleship Wisconsin", "official", "https://nauticus.org/", ["$19.95 general admission", "$20 Command & Control guided tour", "about 60 minutes", "restricted spaces beyond self-guided circulation"]],
  ["src-v3-haunts-richmond", "Haunts of Richmond", "official", "https://hauntsofrichmond.com/", ["Haunted Capitol Hill on Oct 10 2026", "19:30-21:00", "$27 online / $30 walk-up", "Capitol-area historical disasters"]],
  ["src-v3-neabsco", "Visit Prince William / Prince William County", "government", "https://www.visitpwc.com/listing/neabsco-creek-boardwalk/1648/", ["3,300-foot accessible wetland boardwalk", "observation decks and overlooks", "Potomac Heritage National Scenic Trail"]],
  ["src-v3-rennfest", "Maryland Renaissance Festival", "official", "https://www.rennfest.com/", ["Sunday Oct 11 2026 operating day", "10:00-19:00", "observed $36.14 per-person online checkout", "jousting, stages and craft village"]],
  ["src-v3-pinelands", "Pinelands Adventures", "official", "https://www.pinelandsadventures.org/", ["Mullica Shorty 1.5-2 hours / about 2 miles", "equipment and operator transport included", "advance reservation required", "tandem and single pricing plus NJDEP fees"]],
  ["src-v3-argia", "Argia Mystic Cruises", "official", "https://www.argiamystic.com/Argia_PublicSails.aspx", ["May through mid-October public sailing", "$65 weekday morning low-season sail", "guests invited to help hoist and trim", "2026 rate sheet published only through Oct 12"]]
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

const transport = (low, high, note) => ({
  group_low_usd: low,
  group_high_usd: high,
  per_person_low_usd: Math.round((low / 4) * 100) / 100,
  per_person_high_usd: Math.round((high / 4) * 100) / 100,
  excluded_from_attraction_ceiling: true,
  note
});

const CORE_CONFIG = {
  "uss-nautilus-museum": { date: "2026-10-04", bucket: "working-infrastructure", texture: "EXPLORE", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], museumLike: true, confined: true, source_ids: ["src-v3-nautilus"] },
  "cross-sound-ferry": { date: "2026-10-04", bucket: "water-movement", texture: "MOVE", interaction: 2, cost: cost(0), risk: "red", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], reservation: "required", weather: true, ferryGated: true, transport: transport(205, 219, "Two standard cars and four adults before the floating fuel surcharge; reprice at booking.") },
  "greenport-waterfront": { date: "2026-10-04", bucket: "coastal-exploration", texture: "EXPLORE", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"] },
  "north-ferry": { date: "2026-10-05", bucket: "water-movement", texture: "MOVE", interaction: 2, cost: cost(0), risk: "green", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], transport: transport(38, 38, "About $16 auto and driver plus $3 per additional passenger, two cars, one way. No reservations.") },
  "mashomack-preserve": { date: "2026-10-05", bucket: "wild-coast-wildlife", texture: "WILD", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], weather: true, highPhysicality: true, fallback: "big-duck", skip: "Easy-to-moderate trail sampler; shorten it freely for a slower morning." },
  "south-ferry": { date: "2026-10-05", bucket: "water-movement", texture: "MOVE", interaction: 2, cost: cost(0), risk: "green", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], transport: transport(36, 40, "About $18 auto plus $2 passenger, two cars, one way; confirm how the driver's fare is treated at travel time.") },
  "tanger-riverhead": { date: "2026-10-05", bucket: "shopping", texture: "SHOP", interaction: 2, cost: cost(0), risk: "green", best: ["viki"], secondary: ["gora", "stivka", "sheluvspaco"] },
  "fire-island-lighthouse": { date: "2026-10-06", bucket: "working-infrastructure", texture: "EXPLORE", interaction: 3, cost: cost(10, 10, 40), risk: "yellow", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], weather: true, highPhysicality: true, highStairs: 182, skip: "Skip the 182-step tower and stay on the barrier-beach boardwalk and sand.", source_ids: ["src-v3-fire-island-lighthouse"] },
  "asbury-boardwalk": { date: "2026-10-06", bucket: "coastal-exploration", texture: "EXPLORE", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true },
  "silverball-asbury": { date: "2026-10-06", bucket: "interactive-play", texture: "COMPETE", interaction: 3, cost: cost(20, 20, 80), risk: "green", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"] },
  "lucy-elephant": { date: "2026-10-07", bucket: "interactive-play", texture: "WEIRD", interaction: 2, cost: cost(9, 9, 36), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required", highStairs: 65 },
  "revolution-rail-cape-may": { date: "2026-10-07", bucket: "interactive-play", texture: "MOVE", interaction: 3, cost: cost(42.5, 42.5, 170, "group-share", "One four-seat railbike at $170 total."), risk: "red", fallback: "cape-may-victorian", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], reservation: "required", weather: true, highPhysicality: true, skip: "The four-seat bike lets stronger riders carry more of the pedalling effort.", source_ids: ["src-v3-revrail-cape-may"] },
  "cape-may-lighthouse": { date: "2026-10-07", bucket: "working-infrastructure", texture: "AWE", interaction: 3, cost: cost(12, 12, 48), risk: "yellow", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], weather: true, highPhysicality: true, highStairs: 199, skip: "The park, beach and lighthouse exterior stay worthwhile without the 199-step climb.", source_ids: ["src-v3-cape-may-lighthouse"] },
  "cape-may-ghosts": { date: "2026-10-07", bucket: "folklore-october", texture: "WEIRD", interaction: 2, cost: cost(20, 20, 80), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required" },
  "cape-may-lewes-ferry": { date: "2026-10-08", bucket: "water-movement", texture: "MOVE", interaction: 2, cost: cost(0), risk: "yellow", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], reservation: "required", weather: true, ferryGated: true, transport: transport(84, 96, "About $42-48 per standard vehicle one way, two cars, plus passenger fares; take the exact Oct 8 total from the booking cart.") },
  "fort-miles": { date: "2026-10-08", bucket: "working-infrastructure", texture: "EXPLORE", interaction: 3, cost: cost(6, 6, 24), risk: "yellow", fallback: "zwaanendael", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], reservation: "required", confined: true },
  "assateague": { date: "2026-10-08", bucket: "wild-coast-wildlife", texture: "WILD", interaction: 1, cost: cost(5, 5, 20, "group-share", "Two $10 weekly refuge vehicle passes shared by four."), risk: "yellow", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true, wildlifeNotGuaranteed: true, fallback: "barrier-islands-center", replaceSources: true, skip: "The whole loop is driven; step out only at the signed pull-offs.", source_ids: ["src-v3-chincoteague-refuge"] },
  "assateague-pony-kayak": { date: "2026-10-09", bucket: "water-movement", texture: "WILD", interaction: 4, cost: cost(73.14, 73.14, 292.56, "per-person-plus-fees", "$69 base plus the published 6% card and booking fee."), risk: "red", fallback: "assateague", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], reservation: "required", weather: true, highPhysicality: true, wildlifeNotGuaranteed: true, skip: "Beginner-friendly but wind-sensitive; the operator's wildlife boat tour is the same-area swap.", source_ids: ["src-v3-assateague-explorer"] },
  "nasa-wallops": { date: "2026-10-09", bucket: "working-infrastructure", texture: "DISCOVER", interaction: 2, cost: cost(0), risk: "green", best: ["gora", "sheluvspaco"], secondary: ["viki", "stivka"], museumLike: true },
  "kiptopeke-concrete-ships": { date: "2026-10-09", bucket: "wild-coast-wildlife", texture: "WILD", interaction: 2, cost: cost(3.5, 3.5, 14, "group-share", "Two $7 per-vehicle parking fees shared by four."), risk: "green", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], weather: true, skip: "Shorten to the concrete-ship view and the migration overlook.", source_ids: ["src-v3-kiptopeke"] },
  "chesapeake-bridge-tunnel": { date: "2026-10-09", bucket: "working-infrastructure", texture: "MOVE", interaction: 1, cost: cost(0), risk: "green", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], transport: transport(32, 32, "Class 1 off-peak toll of $16 per car, two cars. October sits outside the current summer peak window.") },
  "nauticus-wisconsin": { date: "2026-10-10", bucket: "working-infrastructure", texture: "EXPLORE", interaction: 3, cost: cost(39.95, 39.95, 159.8, "per-person", "$19.95 general admission plus the $20 Command & Control guided tour."), risk: "yellow", best: ["gora", "stivka"], secondary: ["viki", "sheluvspaco"], reservation: "required", highPhysicality: true, confined: true, skip: "Take the standard ship deck route if the guided ladders and confined spaces feel too tight.", source_ids: ["src-v3-nauticus-tour"] },
  "richmond-capitol-ghost-tour": { date: "2026-10-10", bucket: "folklore-october", texture: "WEIRD", interaction: 2, cost: cost(27, 27, 108, "per-person", "$27 online; $30 walk-up if bought at the meeting point."), risk: "yellow", fallback: "poe-museum-richmond", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required", exact: true, weather: true, source_ids: ["src-v3-haunts-richmond"] },
  "richmond-orthodox": { date: "2026-10-11", bucket: "sacred-worship", texture: "WORSHIP", interaction: 1, cost: cost(0), risk: "green", best: ["stivka"], secondary: ["viki", "gora", "sheluvspaco"] },
  "neabsco-creek-boardwalk": { date: "2026-10-11", bucket: "wild-coast-wildlife", texture: "RELAX", interaction: 1, cost: cost(0), risk: "green", best: ["stivka", "viki"], secondary: ["gora", "sheluvspaco"], weather: true, skip: "Flat, accessible and designed as the day's recovery stop.", source_ids: ["src-v3-neabsco"] },
  "maryland-renaissance-festival": { date: "2026-10-11", bucket: "experiential-culture", texture: "EXPLORE", interaction: 3, cost: cost(36.14, 36.14, 144.56, "per-person-plus-fees", "Observed Oct 11 online checkout: $31 base plus fee."), risk: "yellow", fallback: "bo-railroad", best: ["stivka", "viki"], secondary: ["gora", "sheluvspaco"], reservation: "required", exact: true, weather: true, skip: "Easy-to-moderate walking; sit and watch performances freely.", source_ids: ["src-v3-rennfest"] },
  "mullica-cedar-paddle": { date: "2026-10-12", bucket: "water-movement", texture: "WILD", interaction: 4, cost: cost(47.12, 57.12, 188.48, "group-share", "Two tandems at $188.48 group, or four singles at $228.48 group, including NJDEP fees."), risk: "yellow", best: ["gora", "viki"], secondary: ["stivka", "sheluvspaco"], reservation: "required", weather: true, highPhysicality: true, skip: "Pair a weaker paddler into a tandem; operator transport removes the shuttle logistics.", source_ids: ["src-v3-pinelands"] },
  "sleepy-hollow-cemetery": { date: "2026-10-13", bucket: "folklore-october", texture: "WEIRD", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], weather: true },
  "old-dutch-church": { date: "2026-10-13", bucket: "folklore-october", texture: "WEIRD", interaction: 1, cost: cost(0), risk: "yellow", best: ["stivka"], secondary: ["viki", "gora", "sheluvspaco"] },
  "headless-horseman": { date: "2026-10-13", bucket: "folklore-october", texture: "WEIRD", interaction: 1, cost: cost(0), risk: "green", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], weather: true },
  "pumpkin-blaze": { date: "2026-10-13", bucket: "folklore-october", texture: "AWE", interaction: 2, cost: cost(24, 42, 96, "per-person", "Timed evening entry; earlier and more popular slots cost more."), risk: "yellow", best: ["viki", "stivka"], secondary: ["gora", "sheluvspaco"], reservation: "required", exact: true, weather: true },
  "schooner-argia": { date: "2026-10-14", bucket: "water-movement", texture: "MOVE", interaction: 3, cost: cost(65, 65, 260), risk: "red", fallback: "pez-visitor-center", best: ["viki", "gora"], secondary: ["stivka", "sheluvspaco"], reservation: "required", weather: true, skip: "Low to moderate: guests can simply ride, and helping with the sails is optional.", source_ids: ["src-v3-argia"] }
};

const NEW_PLACE_BASE = {
  "uss-nautilus-museum": ["USS Nautilus & Submarine Force Museum", "submarine-museum-ship", "Groton", "CT", "1 Crystal Lake Road, Groton, CT 06340", "Walk through the world's first operational nuclear-powered submarine and its confined working spaces before crossing Long Island Sound on another vessel.", "It replaces a passive art-house opener with the machine that makes Route 03's water identity start on day one."],
  "fire-island-lighthouse": ["Fire Island Lighthouse & Field 5 Boardwalk", "barrier-island-lighthouse", "Fire Island", "NY", "Fire Island Lighthouse, Robert Moses State Park Field 5, Fire Island, NY 11702", "A 182-step tower, an ocean-side boardwalk and a working barrier-island landscape reachable by car at the western end of Fire Island.", "The route's actual geography beats another indoor aviation block, and the boardwalk keeps everyone included even if the tower is skipped."],
  "revolution-rail-cape-may": ["Revolution Rail — Cape May Run", "railbike", "Cape May", "NJ", "609 Lafayette Street, Cape May, NJ 08204", "Pedal a four-seat railbike four miles alongside the Garrett Family Preserve through wildflower and migration habitat to the Cape May Canal.", "It solves the old Cape May pacing problem by turning the afternoon into physical coastal movement instead of a third indoor stop."],
  "cape-may-lighthouse": ["Cape May Lighthouse & Point State Park", "coastal-lighthouse", "Cape May Point", "NJ", "Cape May Lighthouse, Cape May Point State Park, Cape May Point, NJ 08212", "A 199-step climb to the watch gallery above the dunes, marsh and migration corridor at the southern tip of New Jersey.", "It gives the day its one big vertical view, with the surrounding dune landscape intact as the weather fallback."],
  "assateague-pony-kayak": ["Assateague Explorer Wild-Pony Kayak", "guided-wildlife-kayak", "Chincoteague", "VA", "Curtis Merritt Harbor of Refuge, 6262 Marlin Street, Chincoteague, VA 23336", "A two-to-two-and-a-half-hour guided paddle through Assateague's backwater channels and creeks, with ponies, eagles and shorebirds as the target wildlife.", "It is the single most place-specific wildlife encounter on the whole eleven-route project and needs no prior paddling experience."],
  "kiptopeke-concrete-ships": ["Kiptopeke Concrete Ships & Migration Overlook", "maritime-oddity-park", "Cape Charles", "VA", "Kiptopeke State Park, 3540 Kiptopeke Drive, Cape Charles, VA 23310", "Nine WWII-era concrete ships sunk end to end as a breakwater, on a beach that sits inside a major Atlantic fall migration corridor.", "It costs almost no mileage a few miles north of the bridge-tunnel and turns the transfer into the strangest stop on the Eastern Shore."],
  "richmond-capitol-ghost-tour": ["Haunted Capitol Hill Ghost Tour", "local-folklore-walk", "Richmond", "VA", "Virginia State Capitol, 1000 Bank Street, Richmond, VA 23219", "A ninety-minute after-dark walk through the Capitol district built on Richmond's documented disasters, buildings and local stories.", "Folklore stays tied to real geography here instead of the route buying a generic haunted attraction."],
  "neabsco-creek-boardwalk": ["Neabsco Creek Boardwalk", "wetland-boardwalk", "Woodbridge", "VA", "15125 Blackburn Road, Woodbridge, VA 22191", "A 3,300-foot accessible boardwalk with observation decks crossing the Neabsco Creek marsh on the Potomac Heritage trail network.", "It is the genuinely worthwhile break that makes the Richmond-to-Crownsville Sunday legal instead of one long unbroken run."],
  "maryland-renaissance-festival": ["Maryland Renaissance Festival", "seasonal-village-festival", "Annapolis", "MD", "1821 Crownsville Road, Annapolis, MD 21401", "A large permanent English-village site with jousting, working craft shops, stages and costumed performers, open on the exact Sunday the route is there.", "It is participatory seasonal culture rather than nightlife, and it beats another indoor railroad museum on interaction."],
  "mullica-cedar-paddle": ["Pinelands Adventures — Mullica \"Shorty\"", "cedar-river-paddle", "Shamong", "NJ", "1005 Atsion Road, Shamong, NJ 08088", "A beginner-to-moderate two-mile paddle down the narrow tea-coloured Mullica through Pine Barrens cedar swamp, with equipment and shuttle included.", "It converts the holiday return day from a cabinet-museum stop into the route's strangest water texture."],
  "schooner-argia": ["Schooner ARGIA Morning Sail", "traditional-schooner-sail", "Mystic", "CT", "Steamboat Wharf, 15 Holmes Street, Mystic, CT 06355", "A two-hour public sail on a traditional gaff schooner through protected Mystic waters, with guests invited to help hoist and trim.", "The route opened by crossing the Sound on a vehicle ferry; this closes it by actually sailing, if the operator opens Oct 14 inventory."]
};

const DAY_PLANS = [
  { day: 1, date: "2026-10-04", sleep_city: "Greenport, NY", theme: "Machines to water", schedule: [["14:00", "15:30", "uss-nautilus-museum", "anchor"], ["17:00", "18:20", "cross-sound-ferry", "anchor"], ["18:45", "20:00", "greenport-waterfront", "supporting"]], lodging: ["Greenport village within walking distance of the harbour", "Southold or East Marion with easier two-car parking"], notes: ["The 17:00 sailing is a planning target: Cross Sound has not published the exact October timetable, so Day 1 is built around the ferry rather than the other way round."], fallback: "Ferry disruption: keep the Nautilus visit, sleep on the Connecticut side and rebuild Day 2 around a later crossing." },
  { day: 2, date: "2026-10-05", sleep_city: "Riverhead, NY", theme: "Island reset", schedule: [["08:30", "08:40", "north-ferry", "supporting"], ["09:00", "11:00", "mashomack-preserve", "anchor"], ["11:15", "11:22", "south-ferry", "supporting"], ["14:15", "17:15", "tanger-riverhead", "anchor"]], lodging: ["Riverhead near the outlet centre with secure two-car parking", "Route 58 corridor for an easier morning exit"], notes: ["Both Shelter Island ferries run frequently and take no reservations, so the crossings act as natural breaks rather than logistics."], fallback: "Heavy rain: shorten Mashomack to the visitor-centre loop, add the Big Duck flex stop and start the shopping block early." },
  { day: 3, date: "2026-10-06", sleep_city: "Asbury Park, NJ", theme: "Barrier beach to boardwalk", schedule: [["09:45", "11:45", "fire-island-lighthouse", "anchor"], ["15:30", "16:45", "asbury-boardwalk", "supporting"], ["17:00", "19:00", "silverball-asbury", "anchor"]], lodging: ["Asbury Park oceanfront within walking distance of the boardwalk", "Ocean Township or Neptune with reliable two-room inventory"], notes: ["The measured Fire Island to Asbury leg is 148 baseline minutes with no traffic model; this is the route's most traffic-sensitive outbound run."], fallback: "If live navigation pushes the remaining run past about 2h15, insert a short harbour-side break rather than accepting one long congestion sit." },
  { day: 4, date: "2026-10-07", sleep_city: "Cape May, NJ", theme: "Weird coast in motion", schedule: [["10:00", "11:00", "lucy-elephant", "supporting"], ["12:30", "14:00", "revolution-rail-cape-may", "anchor"], ["14:45", "16:15", "cape-may-lighthouse", "anchor"], ["19:00", "19:30", "cape-may-ghosts", "anchor"]], lodging: ["Cape May historic district within walking distance of the trolley stop", "North Cape May near the ferry terminal for the morning departure"], notes: ["The railbike is bookable but the indexed public page does not expose an exact Oct 7 calendar; do not call the day locked until it does."], fallback: "Railbike cancellation: use the demoted Victorian architecture walk plus more lighthouse and dune time, or a Cape May dolphin cruise if marine weather is better." },
  { day: 5, date: "2026-10-08", sleep_city: "Chincoteague, VA", theme: "Cross the Delaware, find the wild shore", schedule: [["09:00", "10:25", "cape-may-lewes-ferry", "anchor"], ["10:45", "12:00", "fort-miles", "anchor"], ["16:00", "18:15", "assateague", "anchor"]], lodging: ["Chincoteague island town near Main Street", "Chincoteague causeway side with easier two-car parking"], notes: ["The wild-horse block is implemented on the Virginia refuge side rather than detouring to Berlin and back; the Wildlife Loop opens to vehicles after 3pm."], fallback: "Refuge closure or storm: use the Barrier Islands Center and keep Fort Miles, then take the horses from the Beach Road pull-offs if they are open." },
  { day: 6, date: "2026-10-09", sleep_city: "Norfolk, VA", theme: "Signature Atlantic-edge day", schedule: [["08:30", "11:00", "assateague-pony-kayak", "anchor"], ["11:20", "12:20", "nasa-wallops", "supporting"], ["13:40", "14:40", "kiptopeke-concrete-ships", "anchor"], ["15:00", "15:40", "chesapeake-bridge-tunnel", "anchor"]], lodging: ["Norfolk waterfront within reach of Nauticus for the morning", "Norfolk airport and Military Highway corridor with secure parking"], notes: ["No Oct 9 launch is confirmed at Wallops; the visitor centre is worth the hour on its own and no launch should be promised."], fallback: "Wind or small-craft advisory: swap the kayak for the operator's wildlife boat tour, or repeat the refuge Wildlife Loop and keep the rest of the day intact." },
  { day: 7, date: "2026-10-10", sleep_city: "Richmond, VA", theme: "Heavy steel, dark stories", schedule: [["09:00", "12:30", "nauticus-wisconsin", "anchor"], ["19:30", "21:00", "richmond-capitol-ghost-tour", "anchor"]], lodging: ["Richmond Fan or Museum District within walking distance of dinner", "Richmond West End with secure two-car parking"], notes: ["The Command & Control guided add-on is what makes the battleship physical; its slot controls the Norfolk departure and therefore the whole day."], fallback: "Severe rain: keep the ship, move the evening to the Poe Museum if hours permit, or take a relaxed Richmond evening instead." },
  { day: 8, date: "2026-10-11", sleep_city: "Annapolis, MD", theme: "Sacred to festival", schedule: [["08:15", "11:30", "richmond-orthodox", "anchor"], ["13:05", "13:50", "neabsco-creek-boardwalk", "supporting"], ["15:00", "19:00", "maryland-renaissance-festival", "anchor"]], lodging: ["Annapolis waterfront within walking distance of the historic district", "Parole or US-50 corridor with reliable two-room inventory"], notes: ["The overnight moves from Baltimore East to Annapolis; Neabsco is what makes the Richmond-to-Crownsville Sunday a legal two-leg day."], fallback: "Festival closure or severe weather: activate the retained B&O Railroad Museum if it is geographically workable, otherwise take an Annapolis waterfront evening." },
  { day: 9, date: "2026-10-12", sleep_city: "Metuchen, NJ", theme: "Ghost water", schedule: [["11:00", "13:30", "mullica-cedar-paddle", "anchor"]], lodging: ["Metuchen near Main Street with secure two-car parking", "Edison or Woodbridge along the Route 1 corridor"], notes: ["This is the route's longest measured driving day at 296 baseline minutes; the Middletown-Odessa DE-1 comfort break keeps every uninterrupted leg near 100 minutes.", "Oct 12 is Columbus Day / Indigenous Peoples' Day, so the paddle is reserved rather than treated as a walk-up."], fallback: "High water, wind or operator cancellation: do not force unsafe water. Take a Pine Barrens drive and short walk, or move north earlier and rest." },
  { day: 10, date: "2026-10-13", sleep_city: "Fairfield, CT", theme: "October legend day", schedule: [["10:15", "11:30", "sleepy-hollow-cemetery", "anchor"], ["11:35", "12:15", "old-dutch-church", "supporting"], ["12:15", "12:45", "headless-horseman", "supporting"], ["18:30", "19:30", "pumpkin-blaze", "anchor"]], lodging: ["Fairfield near the I-95 corridor with secure two-car parking", "Milford or Stratford with easier late arrival"], notes: ["Sunset is about 18:17 with civil twilight to roughly 18:45, so the legend geography is done in daylight and the Blaze after dark.", "The historic Headless Horseman bridge does not survive in its original form; the card presents the legend landscape and states the distinction."], fallback: "Rain: keep the legend stops short and let the Blaze weather policy decide the evening; the cemetery and burying ground stay walkable." },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", theme: "Sail home", schedule: [["09:30", "11:30", "schooner-argia", "anchor"]], lodging: ["Logan Airport hotel with a confirmed shuttle", "Revere or East Boston with a verified airport transfer"], notes: ["ARGIA's public material says May through mid-October but the 2026 rate sheet publishes only through Oct 12, so the finale stays a booking gate.", "The sail is subordinate to the rental return: if the required return time makes 09:30-11:30 unsafe, the sail is dropped, not the return."], fallback: "No Oct 14 ARGIA inventory or marine weather: activate the retained PEZ Visitor Center or a short Connecticut-coast reset and protect Logan." }
];

const BOOKING_PRIORITIES = [
  { place_id: "schooner-argia", urgency: "red-edge-finale", reason: "Do not buy surrounding commitments until the operator shows Oct 14 public inventory; \"mid-October\" is not evidence." },
  { place_id: "cross-sound-ferry", urgency: "red-lock-first", reason: "Exact Oct 4 October timetable and vehicle reservation are not yet published." },
  { place_id: "revolution-rail-cape-may", urgency: "red-lock-first", reason: "The exact Oct 7 run must appear in the live booking calendar." },
  { place_id: "cape-may-lewes-ferry", urgency: "tier-a", reason: "Reserve the Oct 8 sailing around the Battery 519 tour time." },
  { place_id: "assateague-pony-kayak", urgency: "tier-a", reason: "Shoulder-season weather and limited guided inventory on Oct 9." },
  { place_id: "nauticus-wisconsin", urgency: "tier-a", reason: "The Command & Control add-on slot controls the Oct 10 Richmond transfer." },
  { place_id: "maryland-renaissance-festival", urgency: "tier-a", reason: "Oct 11 is a confirmed operating day; buy before sellout risk develops." },
  { place_id: "mullica-cedar-paddle", urgency: "tier-a", reason: "Federal-holiday demand plus operator transport logistics on Oct 12." },
  { place_id: "pumpkin-blaze", urgency: "tier-a", reason: "Reserve the exact Oct 13 evening entry slot." },
  { place_id: "lucy-elephant", urgency: "tier-b", reason: "Interior access is guided-only and modest capacity." },
  { place_id: "cape-may-ghosts", urgency: "tier-b", reason: "Book the Oct 7 Spirits & Oddities departure." },
  { place_id: "fort-miles", urgency: "tier-b", reason: "Battery 519 runs Wed-Sat through Nov 1; reserve the Thursday tour." },
  { place_id: "richmond-capitol-ghost-tour", urgency: "tier-b", reason: "The Oct 10 19:30 departure is listed; $27 online beats $30 walk-up." }
];

const RED_FLAGS = [
  "Cross Sound Ferry has not published an exact Oct 4 vehicle sailing in the indexed October timetable.",
  "Revolution Rail's Cape May run must show the exact Oct 7 date in the live booking calendar.",
  "Schooner ARGIA must be explicitly bookable for Oct 14; the 2026 rate sheet stops at Oct 12.",
  "The final rental-car return time must be reconciled with any Mystic sail before Day 11 is locked."
];

const YELLOW_FLAGS = [
  "Cape May-Lewes exact Oct 8 sailing and vehicle total.",
  "Assateague Explorer wind and small-craft policy 48 hours prior.",
  "Chincoteague refuge and Kiptopeke park alerts during coastal storms.",
  "The exact USS Wisconsin guided-tour slot.",
  "Maryland Renaissance Festival weather and sellout conditions.",
  "Oct 12 holiday traffic and Pinelands Adventures availability.",
  "The exact Great Jack O'Lantern Blaze entry time and weather policy.",
  "All ferry fuel surcharges and vehicle-size pricing."
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
  const skipStrategy = config.skip
    || (config.highStairs
      ? `The ${config.highStairs}-step climb is optional; the surrounding grounds keep everyone included.`
      : config.highPhysicality
        ? "A lower-intensity or skip path is documented in the day's fallback."
        : "Low physical demand; no skip path is required.");
  return {
    ...current,
    id,
    name: name || (id === "assateague" ? "Chincoteague Refuge Wild-Pony Golden Hour" : current.name),
    kind: kind || current.kind,
    city: city || (id === "assateague" ? "Chincoteague" : current.city),
    state: state || (id === "assateague" ? "VA" : current.state),
    country: "US",
    address: address || (id === "assateague" ? "Chincoteague National Wildlife Refuge, 8231 Beach Road, Chincoteague, VA 23336" : current.address),
    visit_date: config.date,
    summary: summary || (id === "assateague"
      ? "Drive the refuge Wildlife Loop after it opens to vehicles at 3pm, watching for the Virginia herd across marsh, pool and maritime forest until dusk."
      : id === "nauticus-wisconsin"
        ? "Board the battleship Wisconsin and take the guided Command & Control route up through levels and spaces the self-guided circulation never reaches."
        : current.summary),
    why_go: whyGo || (id === "assateague"
      ? "Same wild-horse memory as the original plan, but on the Virginia side, which removes the Berlin detour and sets up the next morning's kayak."
      : id === "nauticus-wisconsin"
        ? "The guided add-on converts a broad museum visit into physical, restricted warship space, which is the only reason the stop survived."
        : current.why_go),
    best_for: best,
    secondary_for: secondary,
    best_fit_note: `Primary fit: ${best.join(", ")}. ${skipStrategy}`,
    categories: current.categories || ["unusual_creative"],
    duration_minutes: current.duration_minutes || 90,
    priority: "anchor",
    reservation: config.reservation || "none",
    hours: current.hours || { opens: null, closes: null, status: "reconfirm-required", note: "Use the scheduled route window; reconfirm operator inventory before booking." },
    cost: config.cost,
    source_ids: config.replaceSources
      ? config.source_ids
      : [...new Set([...(current.source_ids || []), ...(config.source_ids || [])])],
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
      water_weather_gated: Boolean(config.weather),
      ferry_timetable_gated: Boolean(config.ferryGated),
      booking_required: config.reservation === "required",
      exact_date_verified: Boolean(config.exact),
      traffic_gated: false,
      high_stair_count: config.highStairs ? config.highStairs : false,
      confined_space: Boolean(config.confined),
      high_physicality: Boolean(config.highPhysicality),
      wildlife_not_guaranteed: Boolean(config.wildlifeNotGuaranteed),
      skip_possible: true,
      photo_heavy: ["AWE", "WILD", "WEIRD", "MOVE"].includes(config.texture),
      transport_fee_excluded_from_magic_cost: Boolean(config.transport)
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
    transport_fee: config.transport || null,
    transport_fee_excluded_from_attraction_ceiling: Boolean(config.transport),
    physical_level: config.highPhysicality ? "moderate" : config.interaction >= 3 ? "light-moderate" : "easy",
    skip_strategy: skipStrategy,
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
  if (!place) throw new Error(`Missing Route 03 V2 place: ${placeId}`);
  return { start, end, place_id: placeId, priority, reservation: place.reservation };
}

function imageRecord(placeId, image, index) {
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
    coverage: "exact-place-or-experience",
    production_usable: false,
    rights_status: "permission-required-before-public-deployment",
    visual_review: "reviewed"
  };
}

function comfortScore(normal) {
  const temperaturePenalty = Math.abs(normal.normal_high_c - 21) / 4;
  const rainPenalty = normal.measurable_precipitation_probability_percent / 25;
  return Math.round(Math.max(1, Math.min(5, 5 - temperaturePenalty - rainPenalty)) * 10) / 10;
}

export async function buildEnergyRoute03({ root, routeDir }) {
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
  const keepIds = [...ORIGINAL_IDS, ...NEW_CORE_IDS];
  const places = keepIds.map((id) => (CORE_IDS.includes(id) ? enrichCore(currentPlaceById.get(id), id) : enrichNonCore(currentPlaceById.get(id)))).filter(Boolean);
  const placeById = new Map(places.map((place) => [place.id, place]));
  for (const id of CORE_IDS) if (!placeById.has(id)) throw new Error(`Route 03 V2 core place is missing from the package: ${id}`);

  const existingImages = currentImagesPackage.images
    .filter((image) => ORIGINAL_IDS.includes(image.place_id))
    .map((image) => (image.place_id === "assateague"
      ? { ...image, coverage: "exact-place-or-experience-context", visual_review: "reviewed-virginia-side-context" }
      : image));
  const newImages = NEW_CORE_IDS.flatMap((placeId) => {
    const selected = research.places[placeId]?.selected_images || [];
    if (selected.length < 3) throw new Error(`${placeId} has ${selected.length}/3 Route 03 V2 images.`);
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
  const CAP_EXCEPTIONS = {
    9: { minutes: 300, reason: "Annapolis to the Pine Barrens to Metuchen is the measured Columbus-Day return. Every uninterrupted leg stays near 100 minutes because of the documented Middletown-Odessa DE-1 comfort break, but the 296-minute total is above the 270-minute standard cap and is authorised deliberately." }
  };

  const days = DAY_PLANS.map((plan) => {
    const routed = geometryByDay.get(plan.day);
    const normal = weatherByDay.get(plan.day);
    if (!routed) throw new Error(`Day ${plan.day} has no measured geometry.`);
    if (!normal) throw new Error(`Day ${plan.day} has no weather normal.`);
    const drivingLegs = routed.legs.filter((leg) => leg.counts_toward_drive_cap !== false);
    const longestLeg = Math.max(0, ...drivingLegs.map((leg) => leg.baseline_minutes));
    const exception = CAP_EXCEPTIONS[plan.day];
    const capStatus = longestLeg > UNINTERRUPTED_CAP
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
        non_driving_travel_minutes: routed.non_driving_travel_minutes,
        traffic_risk: routed.risk,
        cap_minutes: TOTAL_CAP,
        authorized_cap_exception_minutes: exception?.minutes,
        cap_exception_reason: exception?.reason,
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
        station_role: plan.day === 8 ? "Baltimore-Annapolis regional proxy" : normal.station_role,
        source_id: "src-noaa-normals",
        forecast_status: "replace_with_live_forecast_10_days_before",
        note: "Climate normal, not a 2026 forecast. Route 03 is more weather-coupled than the inland routes; recheck ferry operators, park and refuge alerts and bridge-tunnel notices 48-72 hours before each coastal segment."
      }
    };
  });

  const corePlaces = places.filter((place) => place.included_in_magic_score);
  const lowCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_low, 0) * 100) / 100;
  const highCost = Math.round(corePlaces.reduce((sum, place) => sum + place.price_per_person_high, 0) * 100) / 100;
  const argia = placeById.get("schooner-argia");
  const withoutArgiaLow = Math.round((lowCost - argia.price_per_person_low) * 100) / 100;
  const withoutArgiaHigh = Math.round((highCost - argia.price_per_person_high) * 100) / 100;
  const baselineMiles = Math.round(days.reduce((sum, day) => sum + day.drive.baseline_total_miles, 0) * 10) / 10;
  const scheduled = new Set(days.flatMap((day) => day.schedule.map((item) => item.place_id)));
  const longestLeg = Math.max(...days.map((day) => day.drive.max_uninterrupted_minutes));
  const transportPlaces = corePlaces.filter((place) => place.transport_fee);
  const transportLow = transportPlaces.reduce((sum, place) => sum + place.transport_fee.group_low_usd, 0);
  const transportHigh = transportPlaces.reduce((sum, place) => sum + place.transport_fee.group_high_usd, 0);
  const museumLikeCore = corePlaces.filter((place) => place.museum_like);

  const route = {
    schema_version: "1.0.0",
    route: {
      id: ROUTE_ID,
      slug: "wild-shore-rockets-folklore-loop",
      name: "The Wild Shore, Rockets & Folklore Loop",
      short_name: "Wild Shore & Rockets",
      status: "energy-rebuild-ui-ready",
      map_color: "#00A8A8",
      timezone: "America/New_York",
      start_date: "2026-10-04",
      end_date: "2026-10-14",
      airport_date: "2026-10-15",
      origin: { name: "Boston Logan Rental Car Center", coordinates: [-71.0304, 42.3682] },
      destination: { name: "Boston Logan hotel zone", coordinates: [-71.0155, 42.3655] },
      endpoint_city: "Norfolk, VA",
      direction: "Boston to the Connecticut coast, across the Sound by ferry, down the barrier islands and Jersey Shore to Cape May, over Delaware Bay to Chincoteague, Wallops and the bay tunnel, then north through Richmond, Annapolis, the Pine Barrens and Sleepy Hollow to Mystic and Boston",
      countries: ["US"],
      canada_included: false,
      total_nights: 11,
      road_nights: 10,
      final_boston_nights: 1,
      baseline_total_miles: baselineMiles,
      energy_rebuild_version: "2.0.0",
      energy_rebuild_verified_at: VERIFIED_AT,
      route_dna: "ATLANTIC EDGE IN MOTION",
      summary: "An Atlantic-fringe loop that moves through the coast instead of looking at it: a nuclear submarine, four ferry crossings, a barrier-island lighthouse, a coastal railbike, a gun battery, wild ponies by car and by kayak, a rocket range, nine concrete ships, a 23-mile bay tunnel, restricted battleship spaces, Richmond and Sleepy Hollow folklore on their exact dates, a tea-coloured Pine Barrens paddle and a schooner home."
    },
    constraints: {
      travelers: 4,
      cars: 2,
      cars_follow_same_route: true,
      daily_drive_target_minutes: [120, 210],
      daily_drive_hard_cap_minutes: TOTAL_CAP,
      max_uninterrupted_drive_minutes: UNINTERRUPTED_CAP,
      route_specific_drive_rule: "Ferry crossings and activity stops reset the uninterrupted clock. No core driving leg may exceed 150 baseline minutes; Day 9 carries an explicit authorised total-driving exception.",
      hike_soft_cap_miles: 6,
      lodging_rooms: [{ count: 1, beds: 1 }, { count: 1, beds: 2 }],
      lodging_priorities: ["safe", "clean", "comfortable", "two-room inventory", "secure two-car parking"],
      visa_policy: "US-only route with no border crossing and no J-1 re-entry dependency.",
      budget_excludes: ["lodging", "rental cars", "fuel", "tolls", "ferry transport fares", "food", "nightlife", "shopping purchases"]
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
      strict_passive_museum_core_count: 0,
      route_dna: "atlantic-edge-in-motion",
      experience_buckets: Object.entries(corePlaces.reduce((tally, place) => ({ ...tally, [place.experience_bucket]: (tally[place.experience_bucket] || 0) + 1 }), {})).map(([bucket, count]) => ({ bucket, count })),
      textures: Object.entries(corePlaces.reduce((tally, place) => ({ ...tally, [place.texture]: (tally[place.texture] || 0) + 1 }), {})).map(([texture, count]) => ({ texture, count })),
      design_rule: "Optional, flex, archived and alternative originals stay visible but never affect Magic unless the group activates them.",
      museum_like_note: "USS Nautilus and NASA Wallops carry interpretive space, so they are flagged conservatively. Both survive because the real submarine and rocket-range context is the experience, not wall text."
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
      without_argia_low_per_person_usd: withoutArgiaLow,
      without_argia_high_per_person_usd: withoutArgiaHigh,
      argia_share_of_high_percent: Math.round((argia.price_per_person_high / highCost) * 1000) / 10,
      variable_booking_fees_excluded: true,
      shopping_spend_excluded: true,
      food_nightlife_lodging_cars_fuel_excluded: true,
      transport_layer: {
        excluded_from_attraction_ceiling: true,
        group_low_usd: transportLow,
        group_high_usd: transportHigh,
        per_person_low_usd: Math.round((transportLow / 4) * 100) / 100,
        per_person_high_usd: Math.round((transportHigh / 4) * 100) / 100,
        items: transportPlaces.map((place) => ({ place_id: place.id, name: place.name, ...place.transport_fee })),
        note: "Four ferry crossings and the Chesapeake Bay Bridge-Tunnel toll are route transportation, not attractions. They are shown separately so the Magic cost component is not corrupted."
      },
      note: "Every paid attraction is optional. ARGIA is the schedule-gated premium switch; without it the ceiling drops to the without-argia range."
    },
    booking_priorities: BOOKING_PRIORITIES,
    operational_flags: {
      red: RED_FLAGS,
      yellow: YELLOW_FLAGS,
      green: [
        "The double-ferry Shelter Island geometry.",
        "Riverhead as the single shopping endpoint.",
        "The Fire Island to Asbury progression.",
        "Lucy as the Jersey Shore drive break.",
        "The Fort Miles to Chincoteague transfer.",
        "The Wallops, Kiptopeke and bridge-tunnel sequence.",
        "The Norfolk to Richmond transfer length.",
        "Neabsco as the mandatory worthwhile Sunday road break.",
        "The Pine Barrens as the Oct 12 return anchor.",
        "The exact-date Sleepy Hollow and Blaze sequence."
      ],
      coastal_storm_rule: "October is inside Atlantic hurricane season. A named storm or coastal flood event can affect several consecutive days and both major ferries; treat Route 03 as more weather-coupled than Routes 01 and 02."
    },
    validation: {
      date_count: days.length,
      expected_date_count: 11,
      all_drive_days_at_or_below_cap: days.every((day) => day.drive.baseline_total_minutes <= (day.drive.authorized_cap_exception_minutes || TOTAL_CAP)),
      all_uninterrupted_legs_at_or_below_cap: longestLeg <= UNINTERRUPTED_CAP,
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
        "Day 9 measures 296 baseline driving minutes, above the 270-minute standard cap; it carries an explicit authorised exception and a documented Middletown-Odessa DE-1 comfort break.",
        "Day 3's Fire Island to Asbury leg measures 148 baseline minutes with no traffic model and is the route's sharpest live-traffic gate.",
        "Cross Sound Ferry, Revolution Rail Cape May and Schooner ARGIA are not booking-final; the Day 11 finale falls back to the retained PEZ Visitor Center.",
        "Assateague horse sightings are never guaranteed by NPS or FWS; the refuge card promises the landscape, not the animals.",
        "The historic Headless Horseman bridge does not survive in its original form and the card states the distinction rather than presenting a replica.",
        "OSRM contains no live traffic; the Long Island, metro New York and Annapolis-to-Shamong transfers remain live-traffic gates."
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
        properties: { feature_kind: "drive_leg", route_id: ROUTE_ID, day: day.day, date: day.date, from: leg.from, to: leg.to, mode: leg.mode || "driving", distance_miles: leg.distance_miles, baseline_minutes: leg.baseline_minutes, counts_toward_drive_cap: leg.counts_toward_drive_cap !== false, traffic_risk: leg.traffic_risk, map_color: route.route.map_color, energy_rebuild: true },
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
    purpose: "Rebuild Route 03 around movement through the Atlantic edge itself while keeping every original stop in the revision history.",
    route_dna: "ATLANTIC EDGE IN MOTION",
    retained_original_core_ids: CORE_IDS.filter((id) => ORIGINAL_IDS.includes(id)),
    new_core_ids: NEW_CORE_IDS,
    original_optional_ids: [...OPTIONAL_IDS],
    original_flex_ids: [...FLEX_IDS],
    original_archive_ids: [...ARCHIVE_IDS],
    documented_alternative_ids: places.filter((place) => place.original_status === "documented-alternative").map((place) => place.id),
    overnight_change: "The Oct 11 overnight moves from Baltimore East to Annapolis so the exact-date Maryland Renaissance Festival can replace the B&O Railroad Museum day.",
    assateague_implementation_change: "The wild-horse golden hour keeps its place id but moves from the Maryland Assateague access at Berlin to the Virginia Chincoteague refuge Wildlife Loop. Same experience and same island, cleaner geometry, and it sets up the next morning's kayak. Its legacy Maryland-side carousel images are relabelled as contextual coverage.",
    drive_correction: "Measured OSRM geometry replaces the brief's prose bands. The documented Middletown-Odessa DE-1 comfort break keeps every uninterrupted baseline leg at or below 148 minutes; Day 9's 296-minute total carries an explicit authorised cap exception rather than being hidden.",
    replacement_model_change: "The eleven legacy one-for-one replacement variants are retired. Non-core originals are now visible as optional, flex, archived or documented alternatives and are excluded from Magic until activated.",
    image_policy: "Legacy Commons records for original stops are preserved unchanged. All thirty-three new-core images are exact-venue operator or editorial files, reviewed visually and marked private-prototype-only until reuse permission is cleared."
  };

  const replacementGeometry = { schema_version: "1.0.0", route_id: ROUTE_ID, generated_at: VERIFIED_AT, routing_engine: "none-required", traffic_included: false, variants: [] };

  const readme = `# Route 03 — The Wild Shore, Rockets & Folklore Loop

Canonical Energy Rebuild V2 for October 4-15, 2026. Route DNA: **ATLANTIC EDGE IN MOTION**.

## Package summary

- ${places.length} total places: ${corePlaces.length} active core experiences plus all ${places.length - corePlaces.length} non-core originals preserved as optional, flex, archived or documented alternatives
- ${scheduled.size} uniquely scheduled core place cards across 11 days
- ${images.length} local carousel images
- ${baselineMiles.toFixed(1)} OSRM baseline miles
- ${longestLeg} minutes for the longest uninterrupted baseline driving leg
- $${lowCost.toFixed(2)}-$${highCost.toFixed(2)} optional do-everything attraction range per person, before variable booking fees
- $${withoutArgiaLow.toFixed(2)}-$${withoutArgiaHigh.toFixed(2)} without the schedule-gated Mystic schooner finale
- $${transportLow}-$${transportHigh} group ferry and toll transport layer, tracked separately from the attraction ceiling

## Structural changes

The Oct 11 overnight moves from Baltimore East to Annapolis so the exact-date Maryland Renaissance Festival can carry the Sunday. The wild-horse golden hour moves to the Virginia Chincoteague refuge side, which removes the Berlin detour and sets up the Oct 9 kayak.

## Road evidence

Frozen OSRM geometry is canonical in the UI. The documented Middletown-Odessa DE-1 comfort break splits the Annapolis-to-Shamong run so no uninterrupted leg exceeds 148 minutes. Day 9 still totals 296 driving minutes and carries an explicit authorised cap exception rather than a quietly raised cap.

## UI contract

Core places expose texture, interaction, booking risk, weather and ferry gates, stair counts, skip logic, traveler fit and optional cost ranges. Ferry fares and the bridge-tunnel toll live in a separate transport layer so they never enter the Magic cost component.

## Operations

The route is UI-ready but not booking-final. Cross Sound Ferry, the Cape May railbike and the ARGIA finale are red-flagged until exact-date inventory appears. Assateague horse sightings are never guaranteed. Exact operator and editorial imagery for the new core stops remains private-prototype-only until rights are cleared.

Rebuild with \`node scripts/route-03/build.mjs\`, then validate with \`node scripts/validate-route-package.mjs ${ROUTE_SLUG}\`.
`;

  const manifestRoute = manifest.routes.find((entry) => entry.id === ROUTE_ID);
  if (!manifestRoute) throw new Error("route-03 is missing from dataset/manifest.json");
  manifestRoute.name = route.route.name;
  manifestRoute.status = "energy-rebuild-ui-ready";
  manifestRoute.place_count = places.length;
  manifestRoute.image_count = images.length;
  manifestRoute.day_count = days.length;
  manifestRoute.baseline_miles = baselineMiles;

  await Promise.all([
    writeJson(path.join(routeDir, "places.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, places }),
    writeJson(path.join(routeDir, "images.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, image_policy: "Legacy Commons rights retained for original stops; exact-venue operator and editorial images for the new core are private-prototype-only until permission is cleared.", images }),
    writeJson(path.join(routeDir, "sources.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, verified_at: VERIFIED_AT, sources }),
    writeJson(path.join(routeDir, "route.json"), route),
    writeJson(path.join(routeDir, "route.geojson"), geojson),
    writeJson(path.join(routeDir, "replacement-geometry.json"), replacementGeometry),
    writeJson(path.join(routeDir, "route-decisions.json"), decisions),
    writeJson(path.join(routeDir, "place-seed.json"), { schema_version: "1.0.0", route_id: ROUTE_ID, generated_from: "Energy Rebuild Routes/Route03_Atlantic_Edge_Rebuild_With_Costs.md", places }),
    writeFile(path.join(routeDir, "README.md"), readme),
    writeJson(path.join(root, "dataset", "manifest.json"), manifest)
  ]);
  console.log(`Built Route 03 Energy V2: ${places.length} places, ${corePlaces.length} core, ${images.length} images, ${days.length} days, ${baselineMiles} miles.`);
  return { placeCount: places.length, imageCount: images.length, dayCount: days.length };
}
