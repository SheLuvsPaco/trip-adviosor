export const VERIFIED_AT = "2026-08-31";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];

export const ORIGINAL_VISIBLE_IDS = [
  "carousel-museum", "columcille", "reading-public-museum", "army-heritage", "letort-spring-run",
  "molly-pitcher-brewing", "dunkles-gulf-station", "gravity-hill", "somerset-historical-center",
  "quecreek", "uptown-somerset-walk", "nationality-rooms", "saint-anthony-chapel", "bicycle-heaven",
  "randyland", "church-brew", "wheeling-heritage-port", "grave-creek-mound", "mothman-museum",
  "mothman-statue", "point-pleasant-floodwall", "tu-endie-wei", "mcclintic-tnt", "flatwoods-monster",
  "trans-allegheny", "american-glass", "mountaineer-military-museum", "lamberts-winery",
  "assumption-orthodox", "fort-bedford", "espy-house", "historic-everett-walk", "cabelas-hamburg",
  "tarrywile", "african-meeting-house", "mit-list-visual-arts", "museum-bad-art"
];

export const CORE_IDS = [
  "old-new-gate", "columcille", "martin-guitar", "reading-pagoda", "army-heritage",
  "letort-spring-run", "pike2bike-rays-hill", "quecreek", "carrie-blast-furnaces",
  "troy-hill-art-houses", "maxo-vanka-murals", "wv-penitentiary", "grave-creek-mound",
  "fort-boreman", "mothman-statue", "mothman-tnt-tour", "braxxie-chair-hunt", "trans-allegheny",
  "assumption-orthodox", "coopers-rock-clay-furnace", "sideling-hill-road-cut",
  "fort-hunter-rockville-bridge", "cabelas-hamburg", "pocono-premium-outlets", "tarrywile",
  "dana-common"
];

export const OPTIONAL_IDS = [
  "carousel-museum", "dunkles-gulf-station", "gravity-hill", "flight-93", "nationality-rooms",
  "saint-anthony-chapel", "bicycle-heaven", "randyland", "ruins-project", "imaginarium-minds-eye",
  "hundred-acres-manor", "wv-pen-dungeon", "wv-pen-escape", "palace-of-gold",
  "wheeling-heritage-port", "blennerhassett-candlelight", "mountwood-atv", "wv-farm-museum",
  "point-pleasant-floodwall", "flatwoods-monster", "free-braxxie-challenge", "jq-dickinson-salt",
  "tala-four-floor", "tala-hysteria", "tala-paranormal", "tala-ghost-hunt", "american-glass",
  "sideling-hill-creek", "african-meeting-house"
];

export const ARCHIVE_DISPOSITIONS = {
  "reading-public-museum": "remove-archive",
  "somerset-historical-center": "remove-archive",
  "mountaineer-military-museum": "remove-archive",
  "fort-bedford": "remove-archive",
  "mit-list-visual-arts": "remove-archive",
  "molly-pitcher-brewing": "optional-food-not-attraction-inventory",
  "church-brew": "optional-food-not-attraction-inventory",
  "lamberts-winery": "optional-food-not-attraction-inventory",
  "uptown-somerset-walk": "demote-flex-not-selected-for-55",
  "espy-house": "demote-flex-not-selected-for-55",
  "historic-everett-walk": "demote-flex-not-selected-for-55",
  "mothman-museum": "absorbed-into-guided-field-tour",
  "tu-endie-wei": "absorbed-into-point-pleasant-riverfront-option",
  "mcclintic-tnt": "absorbed-into-guided-field-tour",
  "museum-bad-art": "additional-researched-not-counted"
};

const cost = (amount, group = amount * 4, type = amount === 0 ? "free" : "per-person", note = "") => ({
  amount_per_person: amount,
  low: amount,
  high: amount,
  amount_per_group: Math.round(group * 100) / 100,
  price_type: type,
  status: amount === 0 ? "free" : "verified-current",
  note
});

const core = (date, bucket, texture, interaction, amount, best, secondary, options = {}) => ({
  date, bucket, texture, interaction, cost: cost(amount, options.group ?? amount * 4, options.priceType, options.costNote),
  best, secondary, reservation: options.reservation || "none", risk: options.risk || "green",
  duration: options.duration, source_ids: options.sourceIds || [], flags: options.flags || [],
  skip: options.skip || "Low physical demand; partial participation is easy if anyone needs a shorter version.",
  fallback: options.fallback || null
});

export const CORE_CONFIG = {
  "old-new-gate": core("2026-10-04", "industrial-institutional", "EXPLORE", 3, 10, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 115, sourceIds: ["src-v6-new-gate"], flags: ["evidence_first", "institutional_site", "partial_participation_easy"], risk: "red", skip: "The prison yard and surface ruins remain meaningful if the copper-mine stairs are uncomfortable." }),
  "columcille": core("2026-10-05", "sacred-visionary", "EXPLORE", 2, 0, ["viki", "stivka", "sheluvspaco"], ["gora"], { duration: 90, flags: ["weather_gated", "partial_participation_easy"] }),
  "martin-guitar": core("2026-10-05", "working-craft", "DISCOVER", 3, 10, ["stivka", "gora", "sheluvspaco"], ["viki"], { duration: 60, sourceIds: ["src-martin"], reservation: "required", risk: "red", flags: ["operator_guided_preferred"] }),
  "reading-pagoda": core("2026-10-06", "sacred-visionary", "AWE", 1, 0, ["viki", "stivka"], ["gora", "sheluvspaco"], { duration: 40, sourceIds: ["src-v6-reading-pagoda"], flags: ["weather_gated"] }),
  "army-heritage": core("2026-10-06", "industrial-institutional", "EXPLORE", 3, 0, ["gora"], ["viki", "stivka", "sheluvspaco"], { duration: 150, flags: ["evidence_first", "weather_gated", "partial_participation_easy"] }),
  "letort-spring-run": core("2026-10-06", "nature-reset", "RELAX", 1, 0, ["viki", "stivka"], ["gora", "sheluvspaco"], { duration: 45, flags: ["weather_gated", "partial_participation_easy"] }),
  "pike2bike-rays-hill": core("2026-10-07", "industrial-institutional", "EXPLORE", 4, 0, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 150, sourceIds: ["src-v6-pike2bike"], risk: "red", flags: ["evidence_first", "legal_ruin", "headlamp_required", "weather_gated", "partial_participation_easy"], fallback: "flight-93", skip: "Use a shorter portal or partial-tunnel out-and-back; turn around before comfort or daylight is compromised." }),
  "quecreek": core("2026-10-07", "industrial-institutional", "DISCOVER", 2, 8, ["gora", "sheluvspaco"], ["viki", "stivka"], { duration: 90, sourceIds: ["src-quecreek"], reservation: "check", risk: "yellow", flags: ["evidence_first", "operator_guided_preferred"] }),
  "carrie-blast-furnaces": core("2026-10-08", "industrial-institutional", "EXPLORE", 4, 26, ["gora", "viki", "stivka", "sheluvspaco"], [], { duration: 120, sourceIds: ["src-v6-carrie"], reservation: "required", risk: "red", flags: ["evidence_first", "industrial_scale", "operator_guided_preferred", "weather_gated"] }),
  "troy-hill-art-houses": core("2026-10-08", "folklore-weird", "WEIRD", 3, 0, ["viki", "stivka", "sheluvspaco"], ["gora"], { duration: 70, sourceIds: ["src-v6-troy-hill"], reservation: "required", risk: "red", flags: ["partial_participation_easy"], skip: "Choose the reserved house around stair and tight-space comfort before confirming the appointment." }),
  "maxo-vanka-murals": core("2026-10-08", "sacred-visionary", "AWE", 2, 20, ["stivka", "gora", "viki"], ["sheluvspaco"], { duration: 75, sourceIds: ["src-v6-vanka"], reservation: "required", risk: "red", flags: ["exact_date_2026", "operator_guided_preferred"] }),
  "wv-penitentiary": core("2026-10-09", "industrial-institutional", "EXPLORE", 3, 15, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 90, sourceIds: ["src-v6-wv-pen"], reservation: "required", risk: "yellow", flags: ["evidence_first", "institutional_site", "operator_guided_preferred"] }),
  "grave-creek-mound": core("2026-10-09", "archaeology-deep-history", "DISCOVER", 2, 0, ["gora", "stivka"], ["viki", "sheluvspaco"], { duration: 40, flags: ["evidence_first"] }),
  "fort-boreman": core("2026-10-09", "industrial-institutional", "AWE", 1, 0, ["viki", "gora"], ["stivka", "sheluvspaco"], { duration: 45, sourceIds: ["src-v6-fort-boreman"], flags: ["weather_gated"] }),
  "mothman-statue": core("2026-10-10", "folklore-orientation", "ORIENT", 1, 0, ["viki", "sheluvspaco"], ["gora", "stivka"], { duration: 35, sourceIds: ["src-pointpleasant"], flags: ["museum_context", "statue_microstop"] }),
  "mothman-tnt-tour": core("2026-10-10", "folklore-weird", "DISCOVER", 3, 25.95, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 70, group: 103.8, sourceIds: ["src-v6-mothman-tour", "src-wvdnr"], reservation: "required", risk: "red", flags: ["evidence_first", "folklore_fieldwork", "hunting_season_recheck", "operator_guided_preferred", "source_conflict", "exact_date_2026"] }),
  "braxxie-chair-hunt": core("2026-10-10", "folklore-weird", "WEIRD", 2, 0, ["viki", "sheluvspaco"], ["gora", "stivka"], { duration: 40, sourceIds: ["src-v6-braxxie"], flags: ["partial_participation_easy"] }),
  "trans-allegheny": core("2026-10-10", "folklore-weird", "WEIRD", 3, 15, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 30, sourceIds: ["src-v6-tala-dark"], reservation: "on-site", risk: "yellow", flags: ["after_dark", "institutional_site", "operator_guided_preferred", "exact_date_2026"] }),
  "assumption-orthodox": core("2026-10-11", "sacred-visionary", "WORSHIP", 1, 0, ["stivka"], ["viki", "gora", "sheluvspaco"], { duration: 90, risk: "yellow", flags: ["exact_date_2026"] }),
  "coopers-rock-clay-furnace": core("2026-10-11", "nature-reset", "EXPLORE", 2, 0, ["viki", "gora"], ["stivka", "sheluvspaco"], { duration: 90, sourceIds: ["src-v6-coopers-rock"], risk: "yellow", flags: ["weather_gated", "partial_participation_easy", "source_conflict"] }),
  "sideling-hill-road-cut": core("2026-10-11", "industrial-institutional", "AWE", 1, 0, ["gora", "viki"], ["stivka", "sheluvspaco"], { duration: 35, sourceIds: ["src-v6-sideling"], flags: ["partial_participation_easy"] }),
  "fort-hunter-rockville-bridge": core("2026-10-12", "industrial-institutional", "LEARN", 1, 0, ["gora", "viki"], ["stivka", "sheluvspaco"], { duration: 45, sourceIds: ["src-v6-fort-hunter"], flags: ["weather_gated"] }),
  "cabelas-hamburg": core("2026-10-12", "retail-spectacle", "WEIRD", 2, 0, ["viki", "gora", "sheluvspaco"], ["stivka"], { duration: 75, flags: ["partial_participation_easy"] }),
  "pocono-premium-outlets": core("2026-10-12", "shopping", "SHOP", 2, 0, ["viki"], ["gora", "stivka", "sheluvspaco"], { duration: 160, sourceIds: ["src-v6-pocono-outlets"], risk: "yellow", flags: ["exact_date_2026", "shopping_spend_excluded", "partial_participation_easy"] }),
  "tarrywile": core("2026-10-13", "nature-reset", "RELAX", 1, 0, ["viki", "stivka"], ["gora", "sheluvspaco"], { duration: 120, flags: ["weather_gated", "partial_participation_easy"] }),
  "dana-common": core("2026-10-14", "nature-reset", "EXPLORE", 3, 0, ["gora", "viki", "sheluvspaco"], ["stivka"], { duration: 150, sourceIds: ["src-v6-dana"], risk: "red", flags: ["evidence_first", "legal_ruin", "weather_gated", "partial_participation_easy"], fallback: "african-meeting-house", skip: "Shorten the out-and-back before the full common; cancel in sustained rain or inadequate daylight." })
};

export const PLACE_OVERRIDES = {
  "old-new-gate": ["Old New-Gate Prison & Copper Mine", "prison-mine-site", "East Granby", "CT", "115 Newgate Road, East Granby, CT", "Descend into the copper mine beneath the remains of Connecticut's early state prison, then read the prison yard at ground level.", "The route begins by entering the institution's physical evidence rather than looking at it behind glass."],
  "martin-guitar": ["C. F. Martin Guitar Factory Tour", "working-factory-tour", "Nazareth", "PA", "510 Sycamore Street, Nazareth, PA", "A one-hour weekday tour through the process of making Martin guitars.", "Real craft, tools and production give the music stop a verb stronger than browse."],
  "reading-pagoda": ["Reading Pagoda Grounds", "mountaintop-roadside-architecture", "Reading", "PA", "98 Duryea Drive, Reading, PA", "A restored mountaintop pagoda and city overlook; the grounds, not uncertain interior access, are the attraction.", "A strange skyline marker resets the eye before the military landscape."],
  "army-heritage": ["USAHEC Army Heritage Trail", "outdoor-military-environment", "Carlisle", "PA", "950 Soldiers Drive, Carlisle, PA", "A one-mile outdoor trail through reconstructed trenches, a pillbox, a firebase and large equipment.", "The day walks through military environments instead of spending another long block in cases and labels."],
  "pike2bike-rays-hill": ["Pike2Bike / Rays Hill Tunnel Sampler", "legal-abandoned-infrastructure", "Breezewood", "PA", "Pike2Bike western trailhead, Breezewood, PA", "A controlled out-and-back on the legal former turnpike roadway into the unlit Rays Hill tunnel.", "Headlamps, broken pavement and obsolete infrastructure create the route's clearest evidence-first exploration."],
  "carrie-blast-furnaces": ["Carrie Blast Furnaces Industrial Tour", "blast-furnace-tour", "Pittsburgh", "PA", "801 Carrie Furnace Boulevard, Pittsburgh, PA", "A two-hour guided walk through a rare surviving pre-WWII blast-furnace complex.", "Pittsburgh steel becomes scale, machinery and workers under the structure itself."],
  "troy-hill-art-houses": ["Troy Hill Art Houses — Reserved House", "whole-house-art-environment", "Pittsburgh", "PA", "Troy Hill, Pittsburgh, PA", "One entire artist-created house, selected by appointment around the group's access needs.", "The house is the work, so this never behaves like another gallery stop."],
  "maxo-vanka-murals": ["Maxo Vanka Murals Public Tour", "sacred-labor-murals", "Millvale", "PA", "24 Maryland Avenue, Millvale, PA", "A Thursday evening tour of vivid church murals tied to immigrant labor and social conflict.", "Sacred interior, working-class history and overwhelming visual language converge in one room."],
  "wv-penitentiary": ["West Virginia Penitentiary Guided Day Tour", "historic-penitentiary-tour", "Moundsville", "WV", "818 Jefferson Avenue, Moundsville, WV", "A guided walk inside the decommissioned penitentiary's actual cellblocks and institutional fabric.", "The building itself carries the lived history; no proxy museum is needed."],
  "fort-boreman": ["Fort Boreman Park / River Confluence", "river-rail-overlook", "Parkersburg", "WV", "Fort Boreman Park, Parkersburg, WV", "A hilltop fort and overlook above the Ohio and Little Kanawha confluence and the rail-river corridor.", "The institution day releases into infrastructure read at landscape scale."],
  "mothman-statue": ["Point Pleasant Legend Cluster", "folklore-orientation-cluster", "Point Pleasant", "WV", "Fourth and Main Streets, Point Pleasant, WV", "A compact statue and riverfront orientation before the guided TNT fieldwork.", "It establishes the public legend without pretending one statue is the day's main experience."],
  "mothman-tnt-tour": ["Official Mothman TNT-Area Guided Field Tour", "guided-folklore-field-tour", "Point Pleasant", "WV", "Mothman Museum and McClintic WMA, Point Pleasant, WV", "A museum-led visit into the bunker and landmark landscape connected to the Mothman story.", "A guide ties folklore to the actual terrain while avoiding blind wandering on hunting land."],
  "braxxie-chair-hunt": ["Braxxie Chair Mini-Hunt", "cryptid-roadside-quest", "Sutton", "WV", "Sutton / Flatwoods, WV", "One or two giant Flatwoods Monster chairs used as a playful road-break, not an hours-long checklist.", "The route gets a small shared quest between heavier institutions."],
  "trans-allegheny": ["Trans-Allegheny Flashlight Tour", "after-dark-institutional-tour", "Weston", "WV", "71 Asylum Drive, Weston, WV", "A short October flashlight tour, half historic and half paranormal, inside the Kirkbride building after dark.", "It gives the group the atmosphere of the institution without sacrificing the entire night."],
  "coopers-rock-clay-furnace": ["Coopers Rock / Clay Furnace Forest Sampler", "forest-iron-landscape", "Bruceton Mills", "WV", "Coopers Rock State Forest, WV", "A forest reset built around the Clay Furnace landscape, independent of the main-overlook bridge status.", "Industry fades into the woods without making the route depend on a contested reopening."],
  "sideling-hill-road-cut": ["Sideling Hill I-68 Road Cut", "engineered-geology-stop", "Hancock", "MD", "Sideling Hill Welcome Center, Hancock, MD", "A short stop at the immense engineered cross-section through folded Appalachian rock.", "The road itself becomes evidence and breaks the eastbound transfer."],
  "fort-hunter-rockville-bridge": ["Fort Hunter / Rockville Bridge Engineering Stop", "river-rail-engineering-landscape", "Harrisburg", "PA", "5300 North Front Street, Harrisburg, PA", "A Susquehanna riverfront stop near the giant Rockville rail bridge.", "Rail, river and landscape are legible in forty-five minutes without forcing a museum visit."],
  "pocono-premium-outlets": ["Pocono Premium Outlets", "outlet-shopping", "Tannersville", "PA", "1000 Premium Outlets Drive, Tannersville, PA", "The route's one deliberate multi-hour shopping block, placed after Cabela's on the return.", "Viki gets real shopping time without breaking a signature exploration day."],
  "dana-common": ["Dana Common / Quabbin Vanished-Town Walk", "lost-town-watershed-walk", "Petersham", "MA", "Gate 40, Petersham, MA", "A roughly 3.6-mile out-and-back through the footprint of a town removed for the Quabbin Reservoir.", "The finale walks into foundations, roads and the landscape of a place that disappeared."],

  "ruins-project": ["The Ruins Project", "mosaic-industrial-ruin", "Perryopolis", "PA", "Perryopolis, PA", "A former coal-mine structure transformed into a large mosaic environment.", "Industrial remains become outsider art without losing their original scale."],
  "imaginarium-minds-eye": ["Enter the Imaginarium — The Mind's Eye", "enthusiast-puzzle-experience", "Pittsburgh", "PA", "Pittsburgh, PA", "A high-end collaborative puzzle room kept as the strongest Pittsburgh rain swap.", "It offers genuine group problem-solving rather than a generic escape-room quota."],
  "hundred-acres-manor": ["Hundred Acres Manor", "seasonal-haunted-attraction", "Bethel Park", "PA", "100 Acres Drive, Bethel Park, PA", "A full October haunted attraction whose exact Oct. 8 calendar still needs confirmation.", "Activate it only if the group wants a fear-heavy Pittsburgh night."],
  "wv-pen-dungeon": ["WV Penitentiary Dungeon / North Walk", "seasonal-prison-haunt", "Moundsville", "WV", "818 Jefferson Avenue, Moundsville, WV", "The penitentiary's October fear add-on, separate from the daytime history tour.", "It is an intensity choice, not required evidence."],
  "wv-pen-escape": ["WV Penitentiary Escape the Pen", "prison-escape-room", "Moundsville", "WV", "818 Jefferson Avenue, Moundsville, WV", "A traditional escape-room option inside the penitentiary complex.", "Useful only if the group actively chooses puzzle play over another regional stop."],
  "palace-of-gold": ["Palace of Gold / New Vrindaban", "unusual-sacred-architecture", "Moundsville", "WV", "3759 McCreary's Ridge Road, Moundsville, WV", "Ornate sacred architecture in the hills outside Moundsville.", "A visually extravagant spiritual counterpoint to the prison."],
  "blennerhassett-candlelight": ["Blennerhassett Mansion by Candlelight", "exact-date-island-evening", "Parkersburg", "WV", "Blennerhassett Museum, Parkersburg, WV", "An exact Oct. 9–10 sternwheeler, wagon and candlelit mansion evening with music and folklore.", "The date-specific atmosphere is exceptional, but it remains an intentional evening upgrade."],
  "mountwood-atv": ["Mountwood ATV Trails", "atv-trail-variant", "Waverly", "WV", "Mountwood Park, WV", "An active trail-day variant for travelers who already have access to a suitable ATV, UTV or MX vehicle.", "It provides a genuine physical route branch without pretending a rental is included."],
  "free-braxxie-challenge": ["Full Five-Chair Free Braxxie Challenge", "cryptid-roadside-challenge", "Sutton", "WV", "Braxton County, WV", "The complete five-chair tourism challenge across Braxton County.", "Choose it only when the whole group wants the longer playful chase."],
  "jq-dickinson-salt": ["J. Q. Dickinson Salt-Works", "working-salt-production-tour", "Malden", "WV", "Malden, WV", "A current salt-production tour on the Kanawha corridor.", "A living process makes it the strongest working-craft detour in southern West Virginia."],
  "tala-four-floor": ["TALA Four-Floor Historic Tour", "institutional-history-tour", "Weston", "WV", "71 Asylum Drive, Weston, WV", "The serious daytime history variant through four floors of the asylum.", "Use it when institutional history matters more than the short after-dark atmosphere."],
  "tala-hysteria": ["TALA Hysteria", "seasonal-haunted-attraction", "Weston", "WV", "71 Asylum Drive, Weston, WV", "The October haunted attraction at Trans-Allegheny.", "A fear upgrade whose base price still needs a clean live check."],
  "tala-paranormal": ["TALA Two-Hour Paranormal Tour", "paranormal-investigation-tour", "Weston", "WV", "71 Asylum Drive, Weston, WV", "A longer guided paranormal tour inside the asylum.", "It is the middle-intensity choice between the flashlight sampler and an overnight hunt."],
  "tala-ghost-hunt": ["TALA Oct. 10 Overnight Ghost Hunt", "overnight-ghost-hunt", "Weston", "WV", "71 Asylum Drive, Weston, WV", "An exact-date 23:30–06:00 ghost hunt that destroys the normal sleep plan before Sunday church.", "Keep it visible only as a conscious choose-chaos option."],
  "sideling-hill-creek": ["Sideling Hill Creek / Potomac Overlook Hike", "longer-outdoor-variant", "Hancock", "MD", "Sideling Hill Creek area, MD", "A longer outdoor alternative around the Sideling Hill and Potomac landscape.", "Use it when daylight and energy justify more than the road-cut sampler."],
  "african-meeting-house": ["African Meeting House & Abiel Smith School", "truth-history-site", "Boston", "MA", "46 Joy Street, Boston, MA", "A Boston truth-history fallback for weather that makes Dana Common unsafe or unpleasant.", "The indoor story keeps the finale evidence-centered rather than substituting random entertainment."]
};

export const OPTIONAL_CONFIG = {
  "ruins-project": { date: "2026-10-08", sourceIds: ["src-v6-ruins"], coordinates: [-79.752, 40.087] },
  "imaginarium-minds-eye": { date: "2026-10-08", sourceIds: ["src-v6-imaginarium"], coordinates: [-80.17, 40.43], cost: cost(48.75, 195, "group-price") },
  "hundred-acres-manor": { date: "2026-10-08", sourceIds: ["src-v6-hundred-acres"], coordinates: [-80.009367, 40.333552], cost: cost(30) },
  "wv-pen-dungeon": { date: "2026-10-09", sourceIds: ["src-v6-wv-pen"], coordinates: [-80.742304, 39.916014], cost: cost(25) },
  "wv-pen-escape": { date: "2026-10-09", sourceIds: ["src-v6-wv-pen"], coordinates: [-80.742304, 39.916014] },
  "palace-of-gold": { date: "2026-10-09", sourceIds: ["src-v6-palace"], coordinates: [-80.603867, 39.962048] },
  "blennerhassett-candlelight": { date: "2026-10-09", sourceIds: ["src-v6-blennerhassett"], coordinates: [-81.565106, 39.264931], cost: cost(42) },
  "mountwood-atv": { date: "2026-10-09", sourceIds: ["src-v6-mountwood"], coordinates: [-81.290407, 39.24778], cost: cost(12) },
  "free-braxxie-challenge": { date: "2026-10-10", sourceIds: ["src-v6-braxxie"], coordinates: [-80.7101, 38.6655] },
  "jq-dickinson-salt": { date: "2026-10-10", sourceIds: ["src-v6-jq-dickinson"], coordinates: [-81.56, 38.3], cost: cost(5) },
  "tala-four-floor": { date: "2026-10-10", sourceIds: ["src-v6-tala-dark"], coordinates: [-80.471438, 39.038264] },
  "tala-hysteria": { date: "2026-10-10", sourceIds: ["src-v6-tala-dark"], coordinates: [-80.471438, 39.038264] },
  "tala-paranormal": { date: "2026-10-10", sourceIds: ["src-v6-tala-dark"], coordinates: [-80.471438, 39.038264], cost: cost(40) },
  "tala-ghost-hunt": { date: "2026-10-10", sourceIds: ["src-v6-tala-dark"], coordinates: [-80.471438, 39.038264] },
  "sideling-hill-creek": { date: "2026-10-11", sourceIds: ["src-v6-sideling"], coordinates: [-78.27, 39.75] }
};

export const DAY_PLANS = [
  { day: 1, date: "2026-10-04", sleep_city: "Danbury, CT", theme: "Descend into the evidence", schedule: [["13:50", "15:45", "old-new-gate", "anchor"]], lodging: ["Danbury near I-84 with staffed reception", "Danbury west with easy two-car parking"], fallback: "Late arrival: use the Carousel Museum only if its live hours work; otherwise protect the Danbury sleep." },
  { day: 2, date: "2026-10-05", sleep_city: "Nazareth / Easton, PA", theme: "Mythic stone to real working craft", schedule: [["10:15", "11:45", "columcille", "anchor"], ["12:20", "13:20", "martin-guitar", "anchor"]], lodging: ["Nazareth / Easton with safe two-room inventory", "Palmer Township near the highway"], fallback: "Hard rain shortens Columcille; Martin's booked factory window wins." },
  { day: 3, date: "2026-10-06", sleep_city: "Carlisle, PA", theme: "Strange skyline, field environments, stream reset", schedule: [["09:15", "09:55", "reading-pagoda", "supporting"], ["11:30", "14:00", "army-heritage", "anchor"], ["14:20", "15:05", "letort-spring-run", "supporting"]], lodging: ["Carlisle I-81 with secure two-car parking", "Carlisle center near LeTort"], fallback: "Shorten LeTort after sustained rain and keep the Army Heritage Trail evidence-first." },
  { day: 4, date: "2026-10-07", sleep_city: "Somerset, PA", theme: "The legal-ruin day", schedule: [["09:30", "12:00", "pike2bike-rays-hill", "anchor"], ["13:20", "14:50", "quecreek", "anchor"]], lodging: ["Somerset turnpike lodging zone", "Somerset center with staffed reception"], fallback: "Hard rain, ice or unsafe trail conditions cancel Pike2Bike; use Flight 93 instead." },
  { day: 5, date: "2026-10-08", sleep_city: "Pittsburgh, PA", theme: "Steel cathedral, outsider house, labor murals", schedule: [["10:00", "12:00", "carrie-blast-furnaces", "anchor"], ["13:00", "14:10", "troy-hill-art-houses", "anchor"], ["18:30", "19:45", "maxo-vanka-murals", "anchor"]], lodging: ["Pittsburgh central with secure two-car parking", "Troy Hill / North Shore edge with staffed parking"], fallback: "Carrie weather or sellout: use Nationality Rooms plus the reserved art house and Vanka." },
  { day: 6, date: "2026-10-09", sleep_city: "Parkersburg, WV", theme: "Institution, archaeology, river confluence", schedule: [["09:30", "11:00", "wv-penitentiary", "anchor"], ["11:10", "11:50", "grave-creek-mound", "supporting"], ["15:10", "15:55", "fort-boreman", "supporting"]], lodging: ["Parkersburg near the river with secure parking", "Vienna / Parkersburg highway inventory"], fallback: "If Mansion by Candlelight is activated, keep Fort Boreman to fifteen minutes or skip it." },
  { day: 7, date: "2026-10-10", sleep_city: "Weston, WV", theme: "Folklore fieldwork and October darkness", schedule: [["10:00", "10:35", "mothman-statue", "supporting"], ["11:00", "12:10", "mothman-tnt-tour", "anchor"], ["14:20", "15:00", "braxxie-chair-hunt", "supporting"], ["19:00", "19:30", "trans-allegheny", "anchor"]], lodging: ["Weston near the historic center", "Weston highway lodging with late check-in"], fallback: "Tour unavailable: use museum, statue and riverfront only; do not wander unfamiliar WMA bunkers blindly." },
  { day: 8, date: "2026-10-11", sleep_city: "Everett / Bedford, PA", theme: "Worship, forest, engineered geology", schedule: [["10:30", "12:00", "assumption-orthodox", "anchor"], ["12:35", "14:05", "coopers-rock-clay-furnace", "anchor"], ["15:30", "16:05", "sideling-hill-road-cut", "supporting"]], lodging: ["Everett / Bedford with safe two-room inventory", "Bedford highway lodging with staffed reception"], fallback: "Use an open Clay Furnace trail; the day never depends on the main overlook bridge." },
  { day: 9, date: "2026-10-12", sleep_city: "Tannersville / Stroudsburg, PA", theme: "Engineering, retail spectacle, shopping recovery", schedule: [["10:00", "10:45", "fort-hunter-rockville-bridge", "supporting"], ["12:00", "13:15", "cabelas-hamburg", "supporting"], ["14:35", "17:15", "pocono-premium-outlets", "anchor"]], lodging: ["Tannersville / Stroudsburg near the outlets", "Pocono I-80 lodging with secure two-car parking"], fallback: "Recheck Oct. 12 holiday hours and move the shopping window within the day rather than deleting it." },
  { day: 10, date: "2026-10-13", sleep_city: "Danbury, CT", theme: "Deliberate decompression", schedule: [["12:15", "14:15", "tarrywile", "anchor"]], lodging: ["Danbury near Tarrywile and I-84", "Danbury west with easy two-car parking"], fallback: "Hard rain moves the reset indoors; do not add another intense attraction to this day." },
  { day: 11, date: "2026-10-14", sleep_city: "Boston, MA", theme: "A vanished town, then home", schedule: [["10:45", "13:15", "dana-common", "anchor"]], lodging: ["Boston Logan hotel with a confirmed shuttle", "East Boston / Revere with verified airport transfer"], fallback: "Heavy rain or inadequate daylight activates the African Meeting House after the cars are safely returned." }
];

export const BOOKING_PRIORITIES = [
  { place_id: "mothman-tnt-tour", urgency: "red-lock-first", reason: "The exact Oct. 10 product is published but currently unavailable; call before treating it as bookable." },
  { place_id: "carrie-blast-furnaces", urgency: "red-lock-first", reason: "Lock the Oct. 8 two-hour industrial tour." },
  { place_id: "martin-guitar", urgency: "red-lock-first", reason: "Monday factory access requires advance registration." },
  { place_id: "maxo-vanka-murals", urgency: "red-lock-first", reason: "Protect the Thursday 18:30 public tour." },
  { place_id: "troy-hill-art-houses", urgency: "red-lock-first", reason: "Appointment only; choose the specific house around access needs." },
  { place_id: "old-new-gate", urgency: "red-lock-first", reason: "Confirm the Oct. 4 public mine-tour timing against the Logan arrival." },
  { place_id: "quecreek", urgency: "tier-b", reason: "Call about a guided or live presentation roughly a week ahead." },
  { place_id: "trans-allegheny", urgency: "tier-b", reason: "Flashlight tours are first-come on site; arrive with buffer." },
  { place_id: "wv-penitentiary", urgency: "tier-b", reason: "Reserve the Oct. 9 guided day tour." }
];

export const NEW_SOURCES = [
  ["src-v6-new-gate", "Connecticut DEEP — Old New-Gate", "government", "https://portal.ct.gov/deep/state-parks/museums/old-new-gate-prison-and-copper-mine", ["2026 season", "$10 admission", "mine included"]],
  ["src-v6-reading-pagoda", "Reading Pagoda", "official", "https://www.readingpagoda.com/", ["grounds and restoration context"]],
  ["src-v6-pike2bike", "Pike2Bike trail documentation", "official-trail", "https://www.pike2bike.com/", ["non-motorized former turnpike", "tunnel safety"]],
  ["src-v6-carrie", "Rivers of Steel — Carrie Blast Furnaces", "official", "https://riversofsteel.com/experiences/carrie-blast-furnaces-industrial-tour/", ["two-hour industrial tour", "$26 admission", "May-October season"]],
  ["src-v6-troy-hill", "Troy Hill Art Houses", "official", "https://www.troyhillarthouses.com/", ["whole-house installations", "appointment required", "free"]],
  ["src-v6-vanka", "Society to Preserve the Millvale Murals of Maxo Vanka", "official", "https://vankamurals.org/", ["Thursday public tour", "$20 admission"]],
  ["src-v6-wv-pen", "West Virginia Penitentiary", "official", "https://wvpentours.com/", ["guided day tours", "October attractions"]],
  ["src-v6-fort-boreman", "Wood County — Fort Boreman", "government", "https://woodcountywv.com/online-services/shelter-meeting-rooms/parks/fort-boreman/", ["park access", "river overlook"]],
  ["src-v6-mothman-tour", "Mothman Museum TNT tour store", "official", "https://mothmanmuseum.square.site/", ["Oct. 10 2026 product", "$25.95", "museum admission", "unavailable status"]],
  ["src-v6-braxxie", "Braxton County CVB", "official-tourism", "https://braxtonwv.org/", ["five-chair Free Braxxie challenge"]],
  ["src-v6-tala-dark", "Trans-Allegheny Asylum After Dark", "official", "https://trans-alleghenylunaticasylum.com/events-schedule/", ["Sep. 25-Oct. 31 season", "flashlight tour", "Oct. 10 ghost hunt"]],
  ["src-v6-coopers-rock", "West Virginia State Parks — Coopers Rock", "government", "https://wvstateparks.com/parks/coopers-rock-state-forest/", ["trail access", "bridge status"]],
  ["src-v6-sideling", "Maryland Tourism — Sideling Hill Welcome Center", "government-tourism", "https://www.visitmaryland.org/listing/visitor-centers/sideling-hill-welcome-center", ["road cut", "visitor center"]],
  ["src-v6-fort-hunter", "Dauphin County — Fort Hunter", "government", "https://www.dauphincounty.gov/government/support-services/parks-recreation/parks/fort-hunter", ["public riverfront park", "Rockville Bridge context"]],
  ["src-v6-pocono-outlets", "Pocono Premium Outlets", "official", "https://www.premiumoutlets.com/outlet/pocono", ["weekday hours", "brand mix", "holiday recheck"]],
  ["src-v6-dana", "Massachusetts DCR — Quabbin Reservoir", "government", "https://www.mass.gov/locations/quabbin-reservoir", ["Gate 40 access", "watershed rules", "Dana Common walk"]],
  ["src-v6-ruins", "The Ruins Project", "official", "https://www.theruinsproject.org/", ["mosaic industrial-ruin environment"]],
  ["src-v6-imaginarium", "Enter the Imaginarium", "official", "https://entertheimaginarium.com/", ["The Mind's Eye puzzle experience"]],
  ["src-v6-hundred-acres", "Hundred Acres Manor", "official", "https://www.hundredacresmanor.com/", ["2026 haunt season", "price from $30"]],
  ["src-v6-palace", "Palace of Gold", "official", "https://www.palaceofgold.com/", ["sacred architecture", "visitor access"]],
  ["src-v6-blennerhassett", "West Virginia State Parks — Mansion by Candlelight", "government", "https://wvstateparks.com/event/mansion-by-candlelight-2026-blennerhassett-island-historical-state-park/", ["Oct. 9-10 2026", "$42 adult"]],
  ["src-v6-mountwood", "Mountwood Park ATV", "official", "https://mountwoodpark.org/atv-park/", ["2026 season", "$12 day permit"]],
  ["src-v6-jq-dickinson", "J. Q. Dickinson Salt-Works", "official", "https://www.jqdsalt.com/", ["working salt tours", "Monday-Saturday pattern"]]
].map(([id, publisher, type, url, supports]) => ({ id, publisher, type, url, supports, verified_at: VERIFIED_AT }));

// New experiences reuse clearly labeled contextual images already licensed or
// rights-gated in the Route 06 private prototype. No clone is presented as an
// exact-place photograph.
export const IMAGE_CONTEXT_SOURCE = {
  "old-new-gate": "quecreek",
  "reading-pagoda": "nationality-rooms",
  "pike2bike-rays-hill": "flight-93",
  "carrie-blast-furnaces": "army-heritage",
  "troy-hill-art-houses": "randyland",
  "maxo-vanka-murals": "saint-anthony-chapel",
  "wv-penitentiary": "trans-allegheny",
  "fort-boreman": "wheeling-heritage-port",
  "mothman-tnt-tour": "mcclintic-tnt",
  "braxxie-chair-hunt": "flatwoods-monster",
  "coopers-rock-clay-furnace": "hawk-mountain-sanctuary",
  "sideling-hill-road-cut": "gravity-hill",
  "fort-hunter-rockville-bridge": "wheeling-heritage-port",
  "pocono-premium-outlets": "cabelas-hamburg",
  "dana-common": "tarrywile",
  "ruins-project": "randyland",
  "imaginarium-minds-eye": "postnatural-history",
  "hundred-acres-manor": "witchs-dungeon",
  "wv-pen-dungeon": "trans-allegheny",
  "wv-pen-escape": "trans-allegheny",
  "palace-of-gold": "saint-anthony-chapel",
  "blennerhassett-candlelight": "wheeling-heritage-port",
  "mountwood-atv": "hawk-mountain-sanctuary",
  "free-braxxie-challenge": "flatwoods-monster",
  "jq-dickinson-salt": "quecreek",
  "tala-four-floor": "trans-allegheny",
  "tala-hysteria": "trans-allegheny",
  "tala-paranormal": "trans-allegheny",
  "tala-ghost-hunt": "trans-allegheny",
  "sideling-hill-creek": "hawk-mountain-sanctuary"
};
