export const ROUTE_ID = "route-01";
export const ROUTE_SLUG = "route-01-gilded-coast-capital-loop";
export const PEOPLE = ["sheluvspaco", "viki", "gora", "stivka"];
export const VERIFIED_AT = "2026-08-31";

const travelerRatings = { sheluvspaco: null, viki: null, gora: null, stivka: null };

function place(record) {
  const secondaryFor = PEOPLE.filter((person) => !record.best_for.includes(person));
  return {
    priority: "anchor",
    secondary_for: secondaryFor,
    reservation: "none",
    cost: { amount_per_person: 0, low: 0, high: 0, price_type: "free", status: "checked-2026-08-31", note: "Free unless noted; parking and personal purchases are excluded." },
    experience_flags: {
      museum_like: false,
      weather_gated: false,
      booking_required: false,
      traffic_gated: false,
      high_physicality: false,
      photo_heavy: false
    },
    ratings: { traveler_ratings: { ...travelerRatings }, average: null, rating_count: 0 },
    included_in_magic_score: true,
    ...record
  };
}

export const newPlaces = [
  place({
    id: "level99-providence", name: "Level99 Providence", kind: "interactive-physical-challenge", city: "Providence", state: "RI",
    address: "8 Providence Pl, Suite D301, Providence, RI 02903", visit_date: "2026-10-04", duration_minutes: 120,
    summary: "More than fifty rotating rooms turn timing, strength, dexterity and team puzzles into a real-life multiplayer game.",
    why_go: "It ignites the trip immediately and lets all four travelers contribute without making the day feel like another escape-room clone.",
    best_for: ["sheluvspaco", "viki", "gora"], best_fit_note: "Best for Paco, Viki and Gora because the rooms constantly switch between teamwork, movement and problem-solving; Stivka still gets the shared competitive ritual.",
    categories: ["interactive_puzzle_immersive", "athletic_adrenaline", "group_bonding"], experience_bucket: "interactive-puzzle-immersive",
    reservation: "reserve-gameplay-block", cost: { amount_per_person: 37.5, low: 35, high: 40, price_type: "variable", status: "checked-2026-08-31", note: "Planning range for a gameplay block; food is excluded." },
    hours: { opens: "11:00", closes: "21:00", status: "verified-current", note: "Sunday hours; recheck private-event changes." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: true, traffic_gated: false, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-level99"], image_query: "Level99 Providence challenge rooms gameplay team neon"
  }),
  place({
    id: "napatree-point", name: "Napatree Point Conservation Area", kind: "barrier-beach-hike", city: "Watch Hill", state: "RI",
    address: "Fort Rd and Bay St, Watch Hill, Westerly, RI 02891", visit_date: "2026-10-05", duration_minutes: 90,
    summary: "An undeveloped barrier spit of dunes, two-sided water, migratory birds and traces of Fort Mansfield.",
    why_go: "It replaces passive coastal sightseeing with a quiet, cinematic walk that can be shortened without losing its impact.",
    best_for: ["viki", "gora"], best_fit_note: "Viki gets wild coastal photography and Gora gets quiet open terrain; Paco and Stivka benefit from the low-pressure reset between more intense activities.",
    categories: ["nature_visual", "architecture_photogenic", "quiet_reset"], experience_bucket: "nature-scenic",
    hours: { opens: null, closes: null, status: "public-year-round", note: "No dedicated Napatree parking; use legal Watch Hill parking and stay on designated access paths." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: false, traffic_gated: false, high_physicality: false, photo_heavy: true },
    source_ids: ["src-energy-napatree"], image_query: "Napatree Point Watch Hill Rhode Island dunes beach Fort Mansfield sunset"
  }),
  place({
    id: "it-adventure-ropes", name: "It Adventure Ropes Course", kind: "indoor-ropes-course", city: "New Haven", state: "CT",
    address: "40 Sargent Dr, New Haven, CT 06511", visit_date: "2026-10-05", duration_minutes: 135,
    summary: "Four indoor levels, more than one hundred challenges and long zip rails let everyone choose their own intensity.",
    why_go: "It is weather-proof and gives Gora a true physical test while the group can still remain together.",
    best_for: ["gora", "viki", "sheluvspaco"], best_fit_note: "Gora can push the upper obstacles, Viki gets a visually dramatic challenge and Paco gets flexible team pacing; Stivka can choose a calmer line.",
    categories: ["athletic_adrenaline", "interactive_puzzle_immersive", "group_bonding"], experience_bucket: "adventure-adrenaline",
    reservation: "reserve-recommended", cost: { amount_per_person: 42, low: 42, high: 42, price_type: "paid", status: "checked-2026-08-31", note: "Planning price; confirm the desired ropes/zip package." },
    hours: { opens: "10:00", closes: "19:00", status: "verified-current", note: "Monday hours; private events can change access." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: true, traffic_gated: false, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-it-ropes"], image_query: "It Adventure Ropes Course New Haven indoor ropes zipline"
  }),
  place({
    id: "vessel-hudson-yards", name: "Vessel at Hudson Yards", kind: "climbable-architecture", city: "New York", state: "NY",
    address: "20 Hudson Yards, New York, NY 10001", visit_date: "2026-10-06", duration_minutes: 40,
    summary: "A monumental honeycomb staircase designed to be entered, climbed and photographed rather than observed from a distance.",
    why_go: "It produces a powerful city-arrival image in less than an hour and connects directly into the High Line.",
    best_for: ["viki", "sheluvspaco"], best_fit_note: "Viki gets one of the route's strongest architecture photographs and Paco gets a compact, efficient Manhattan reveal; Gora and Stivka still get movement and scale.",
    categories: ["architecture_photogenic", "unusual_creative"], experience_bucket: "urban-exploration-photo",
    reservation: "timed-ticket-required", cost: { amount_per_person: 14, low: 14, high: 20, price_type: "variable", status: "checked-2026-08-31", note: "General and flex admission range." },
    hours: { opens: "11:00", closes: "19:00", status: "verified-current", note: "Tuesday window fits; reserve timed entry." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: true, traffic_gated: true, high_physicality: false, photo_heavy: true },
    source_ids: ["src-energy-vessel"], image_query: "Vessel Hudson Yards New York interior stairs sunset night"
  }),
  place({
    id: "high-line-hudson-yards", name: "High Line — Hudson Yards to Chelsea", kind: "elevated-urban-park", city: "New York", state: "NY",
    address: "High Line entrance at W 30th St and 10th Ave, New York, NY 10001", visit_date: "2026-10-06", duration_minutes: 90,
    summary: "A former elevated freight line turned into gardens, art and shifting city viewpoints above Manhattan streets.",
    why_go: "It turns the first NYC evening into movement, skyline photography and decompression without another vehicle transfer.",
    best_for: ["viki", "sheluvspaco"], best_fit_note: "Viki gets architecture, plantings and skyline frames while Paco gets an easy, flexible walk; Gora and Stivka get open-air recovery after the drive.",
    categories: ["architecture_photogenic", "nature_visual", "quiet_reset"], experience_bucket: "urban-exploration-photo",
    hours: { opens: "07:00", closes: "22:00", status: "seasonal-reconfirm", note: "Use the official High Line hours posted for October before travel." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: false, traffic_gated: false, high_physicality: false, photo_heavy: true },
    source_ids: ["src-energy-high-line"], image_query: "High Line New York Hudson Yards autumn sunset city view"
  }),
  place({
    id: "central-park-bike-loop", name: "Central Park Bike Loop", kind: "urban-bike-loop", city: "New York", state: "NY",
    address: "56 W 56th St, New York, NY 10019", visit_date: "2026-10-07", duration_minutes: 120,
    summary: "A roughly six-mile park loop gives the NYC day motion, autumn scenery and flexible pacing before the city becomes crowded.",
    why_go: "It is the cleanest antidote to the old guided-museum morning and lets the group share energy without needing advanced athletic skill.",
    best_for: ["gora", "viki", "sheluvspaco"], best_fit_note: "Gora gets movement, Viki gets park photography and Paco gets an easy group rhythm; Stivka can ride at a relaxed pace.",
    categories: ["athletic_adrenaline", "nature_visual", "architecture_photogenic"], experience_bucket: "adventure-adrenaline",
    reservation: "reserve-bike-rental", cost: { amount_per_person: 18, low: 16, high: 20, price_type: "variable", status: "checked-2026-08-31", note: "Short rental estimate including helmet and lock." },
    hours: { opens: "08:00", closes: "19:00", status: "seasonal-reconfirm", note: "October operation confirmed; recheck exact rental desk hours." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: true, traffic_gated: false, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-central-park-bike"], image_query: "Central Park bicycle loop New York autumn skyline riders"
  }),
  place({
    id: "four-freedoms-park", name: "Four Freedoms Park", kind: "island-memorial-park", city: "New York", state: "NY",
    address: "1 FDR Four Freedoms Park, Roosevelt Island, NY 10044", visit_date: "2026-10-07", duration_minutes: 60,
    summary: "Louis Kahn's severe granite memorial terminates Roosevelt Island in a framed panorama of the East River and Manhattan.",
    why_go: "It transforms the tram novelty into a complete island experience with silence, scale and some of the day's best photographs.",
    best_for: ["viki", "stivka"], best_fit_note: "Viki gets monumental geometry and skyline frames while Stivka gets reflective civic architecture; Paco and Gora get a calm reset before the team mission.",
    categories: ["architecture_photogenic", "nature_visual", "quiet_reset"], experience_bucket: "urban-exploration-photo",
    hours: { opens: "09:00", closes: "19:00", status: "verified-current", note: "Open Wednesday in October; closed Tuesdays." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: false, traffic_gated: false, high_physicality: false, photo_heavy: true },
    source_ids: ["src-energy-four-freedoms"], image_query: "Four Freedoms Park Roosevelt Island Louis Kahn skyline sunset"
  }),
  place({
    id: "beat-the-bomb-brooklyn", name: "Beat The Bomb Brooklyn", kind: "team-bomb-mission", city: "Brooklyn", state: "NY",
    address: "255 Water St, Brooklyn, NY 11201", visit_date: "2026-10-07", duration_minutes: 75,
    summary: "A four-person team clears five physical and mental rooms before trying to disarm a paint, foam or slime bomb.",
    why_go: "It is fast, social and genuinely different from a standard escape room, then spills directly into DUMBO at blue hour.",
    best_for: ["sheluvspaco", "viki", "gora"], best_fit_note: "Paco gets coordination, Viki gets the absurd photo/video ending and Gora gets pressure-based games; Stivka remains fully part of the team.",
    categories: ["interactive_puzzle_immersive", "athletic_adrenaline", "group_bonding"], experience_bucket: "interactive-puzzle-immersive",
    reservation: "timed-ticket-required", cost: { amount_per_person: 34.95, low: 34.95, high: 49.95, price_type: "variable", status: "checked-2026-08-31", note: "Bomb Mission starting price; ticket tier changes final cost." },
    hours: { opens: null, closes: null, status: "verified-weekday-pattern", note: "Brooklyn is open Wednesday-Sunday; confirm the exact mission inventory." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: true, traffic_gated: false, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-beat-bomb"], image_query: "Beat The Bomb Brooklyn paint bomb mission team hazmat rooms"
  }),
  place({
    id: "nj-atv-rentals", name: "NJ ATV Rentals at Raceway Park", kind: "guided-atv-experience", city: "Englishtown", state: "NJ",
    address: "230 Pension Rd, Englishtown, NJ 07726", visit_date: "2026-10-08", duration_minutes: 75,
    summary: "A guided one-hour trail session on automatic ATVs with instruction, safety gear and deliberately muddy terrain.",
    why_go: "This is the route's true motor-adrenaline peak and makes the New Jersey transfer feel like a destination.",
    best_for: ["gora", "viki"], best_fit_note: "Gora gets the strongest mechanical adrenaline hit and Viki gets a memorable, highly photographable experience; Paco manages the booking gate and Stivka can choose his pace.",
    categories: ["athletic_adrenaline", "unusual_creative", "group_bonding"], experience_bucket: "adventure-adrenaline",
    reservation: "required-call-before-lock", cost: { amount_per_person: 120, low: 120, high: 120, price_type: "paid", status: "checked-2026-08-31", note: "Operator's 2026 one-hour experience; exact Oct 8 inventory must be accepted." },
    hours: { opens: null, closes: null, status: "booking-gated", note: "Typical season extends through fall, but Oct 8 is not locked until the operator accepts the reservation." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: true, traffic_gated: true, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-nj-atv"], image_query: "NJ ATV Rentals Raceway Park Englishtown trail riders mud"
  }),
  place({
    id: "baps-akshardham", name: "BAPS Swaminarayan Akshardham", kind: "hindu-sacred-complex", city: "Robbinsville", state: "NJ",
    address: "112 N Main St, Robbinsville, NJ 08561", visit_date: "2026-10-08", duration_minutes: 120,
    summary: "A monumental living Hindu complex whose carved stone, scale and sacred atmosphere are unlike anything else on this corridor.",
    why_go: "It lowers the heart rate after ATV riding while still delivering one of the route's most visually extreme architectural memories.",
    best_for: ["stivka", "viki"], best_fit_note: "Stivka gets a serious cross-faith sacred encounter and Viki gets extraordinary detail and scale; Paco and Gora get craft, systems and calm.",
    categories: ["orthodox_spiritual", "architecture_photogenic", "unusual_creative"], experience_bucket: "sacred-spiritual",
    hours: { opens: "09:00", closes: "19:30", status: "verified-current", note: "Open Thursday; respect dress, footwear, bag and photography rules." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: false, traffic_gated: false, high_physicality: false, photo_heavy: true },
    source_ids: ["src-energy-baps"], image_query: "BAPS Akshardham Robbinsville New Jersey carvings interior exterior sunset"
  }),
  place({
    id: "treetop-quest-philly", name: "Treetop Quest Philly", kind: "aerial-obstacle-course", city: "Philadelphia", state: "PA",
    address: "51 Chamounix Dr, Philadelphia, PA 19131", visit_date: "2026-10-09", duration_minutes: 150,
    summary: "More than sixty obstacles and ziplines rise through Fairmount Park's forest, with upper levels that demand real balance and strength.",
    why_go: "It becomes the physical center of Philadelphia day and makes the remaining indoor experiences feel contrasting rather than repetitive.",
    best_for: ["gora", "viki"], best_fit_note: "Gora gets the most demanding route levels and Viki gets forest-canopy action; Paco can coordinate the group while Stivka chooses a comfortable course.",
    categories: ["athletic_adrenaline", "nature_visual", "group_bonding"], experience_bucket: "adventure-adrenaline",
    reservation: "book-exact-noon-slot", cost: { amount_per_person: 67.5, low: 61, high: 74, price_type: "variable", status: "checked-2026-08-31", note: "Standard/discount range; exact October slot price may change." },
    hours: { opens: "12:00", closes: "18:00", status: "exact-date-published", note: "The operator calendar lists Friday Oct 9, 2026; weather can still close the course." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: true, traffic_gated: false, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-treetop"], image_query: "Treetop Quest Philadelphia ziplines aerial obstacle Fairmount Park"
  }),
  place({
    id: "ministry-of-awe", name: "Ministry of Awe", kind: "immersive-labyrinth", city: "Philadelphia", state: "PA",
    address: "27 N 3rd St, Philadelphia, PA 19106", visit_date: "2026-10-09", duration_minutes: 120,
    summary: "Six exploratory stories inside a converted nineteenth-century bank form a strange labyrinth of rooms, passages and immersive installations.",
    why_go: "It keeps the old route's folk-art weirdness but makes discovery and movement—not framed viewing—the experience.",
    best_for: ["viki", "sheluvspaco"], best_fit_note: "Viki gets surreal rooms and strong photographs while Paco gets a flexible shared exploration; Gora and Stivka get mystery without a conventional gallery lecture.",
    categories: ["interactive_puzzle_immersive", "unusual_creative", "architecture_photogenic"], experience_bucket: "interactive-puzzle-immersive",
    reservation: "timed-ticket-recommended", cost: { amount_per_person: 24.99, low: 24.99, high: 32, price_type: "variable", status: "checked-2026-08-31", note: "Starting admission range; reprice before purchase." },
    hours: { opens: "11:00", closes: "22:00", status: "verified-current", note: "Friday hours; timed entry recommended." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: true, traffic_gated: false, high_physicality: false, photo_heavy: true },
    source_ids: ["src-energy-ministry"], image_query: "Ministry of Awe Philadelphia immersive rooms labyrinth bank"
  }),
  place({
    id: "ifly-baltimore", name: "iFLY Baltimore", kind: "indoor-skydiving", city: "White Marsh", state: "MD",
    address: "8209 Town Center Dr, Nottingham, MD 21236", visit_date: "2026-10-10", duration_minutes: 90,
    summary: "A vertical wind tunnel turns a short transfer stop into the sensation of freefall with training, flight gear and instructor support.",
    why_go: "It supplies a premium adrenaline experience without weather risk and differs completely from ropes, karting and ATVs.",
    best_for: ["gora", "viki"], best_fit_note: "Gora gets the route's most unusual physical sensation and Viki gets a dramatic visual memory; Paco and Stivka can participate without prior skill.",
    categories: ["athletic_adrenaline", "unusual_creative"], experience_bucket: "adventure-adrenaline",
    reservation: "required-exact-slot", cost: { amount_per_person: 99, low: 89, high: 109, price_type: "variable", status: "checked-2026-08-31", note: "First-time flyer planning range; exact 2026 package must be repriced." },
    hours: { opens: null, closes: null, status: "booking-gated", note: "Saturday operation is current; lock the 10:30 slot before treating the day as final." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: true, traffic_gated: true, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-ifly"], image_query: "iFLY Baltimore White Marsh indoor skydiving wind tunnel"
  }),
  place({
    id: "cunningham-falls", name: "Cunningham Falls — William Houck Area", kind: "waterfall-hike", city: "Thurmont", state: "MD",
    address: "14274 William Houck Dr, Thurmont, MD 21788", visit_date: "2026-10-11", duration_minutes: 135,
    summary: "A forest trail climbs to Maryland's highest cascading waterfall on the natural corridor from Washington to Gettysburg.",
    why_go: "It creates the route's needed recovery day and replaces three slower indoor blocks with one coherent outdoor experience.",
    best_for: ["viki", "gora"], best_fit_note: "Viki gets autumn waterfall photography and Gora gets a moderate trail; Paco and Stivka get a restorative Sunday afternoon.",
    categories: ["nature_visual", "quiet_reset", "athletic_adrenaline"], experience_bucket: "nature-scenic",
    cost: { amount_per_person: 2.5, low: 2.5, high: 2.5, price_type: "vehicle_fee", status: "checked-2026-08-31", note: "Two non-Maryland vehicles at the current off-season vehicle charge, split four ways." },
    hours: { opens: "08:00", closes: null, status: "verified-seasonal", note: "Open to sunset in April-October; Sunday capacity is the primary risk." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: false, traffic_gated: false, high_physicality: false, photo_heavy: true },
    source_ids: ["src-energy-cunningham"], image_query: "Cunningham Falls State Park Maryland autumn waterfall trail"
  }),
  place({
    id: "sachs-covered-bridge", name: "Sachs Covered Bridge", kind: "covered-bridge-photo-stop", city: "Gettysburg", state: "PA",
    address: "Waterworks Rd, Gettysburg, PA 17325", visit_date: "2026-10-11", duration_minutes: 30,
    summary: "A red nineteenth-century covered bridge spans Marsh Creek just outside Gettysburg and creates an atmospheric short stop.",
    why_go: "It gives the drive a visually specific historical beat without demanding another long tour or reading-heavy visit.",
    best_for: ["viki", "gora"], best_fit_note: "Viki gets a clean architectural photograph and Gora gets a concise battlefield-era object in its landscape; Paco and Stivka get a zero-fatigue stop.",
    categories: ["architecture_photogenic", "hidden_history_folklore", "quiet_reset"], experience_bucket: "high-impact-history-culture",
    experience_flags: { museum_like: false, weather_gated: true, booking_required: false, traffic_gated: false, high_physicality: false, photo_heavy: true },
    source_ids: ["src-energy-sachs"], image_query: "Sachs Covered Bridge Gettysburg Pennsylvania autumn red bridge"
  }),
  place({
    id: "hawk-mountain-north-lookout", name: "Hawk Mountain Sanctuary — North Lookout", kind: "raptor-migration-hike", city: "Kempton", state: "PA",
    address: "1700 Hawk Mountain Rd, Kempton, PA 19529", visit_date: "2026-10-12", duration_minutes: 160,
    summary: "A ridge hike reaches the North Lookout during the sanctuary's official autumn raptor-migration count season.",
    why_go: "Even on a quiet bird day, the layered October ridges make this the strongest nature replacement for another Bethlehem history walk.",
    best_for: ["viki", "gora"], best_fit_note: "Viki gets the route's broadest fall panorama and Gora gets a purposeful mountain trail; Paco and Stivka get a quiet natural counterweight to Gettysburg.",
    categories: ["nature_visual", "athletic_adrenaline", "quiet_reset"], experience_bucket: "nature-scenic",
    cost: { amount_per_person: 10, low: 10, high: 10, price_type: "paid", status: "checked-2026-08-31", note: "Current adult trail admission." },
    hours: { opens: "09:00", closes: "17:00", status: "verified-current", note: "Oct 12 is within the Aug 15-Dec 15 migration count; sightings are never guaranteed." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: false, traffic_gated: false, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-hawk"], image_query: "Hawk Mountain Sanctuary North Lookout autumn raptor migration view"
  }),
  place({
    id: "lehigh-valley-grand-prix", name: "Lehigh Valley Grand Prix", kind: "indoor-karting", city: "Allentown", state: "PA",
    address: "649 S 10th St, Allentown, PA 18103", visit_date: "2026-10-12", duration_minutes: 90,
    summary: "Indoor high-speed karting turns the end of a history-and-nature day into direct four-person competition.",
    why_go: "The mechanical hit re-energizes the group before the Bethlehem sleep and gives Gora a signature experience without adding weather risk.",
    best_for: ["gora", "sheluvspaco"], best_fit_note: "Gora gets speed and competition while Paco gets an easy shared finale; Viki and Stivka can race at their own level.",
    categories: ["athletic_adrenaline", "unusual_creative", "group_bonding"], experience_bucket: "adventure-adrenaline",
    reservation: "reserve-race-block", cost: { amount_per_person: 69.95, low: 49.95, high: 69.95, price_type: "variable", status: "checked-2026-08-31", note: "Planning range up to three races plus required race license." },
    hours: { opens: "14:00", closes: "22:00", status: "verified-current", note: "Monday race hours; reserve enough consecutive inventory for four." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: true, traffic_gated: false, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-lvgp"], image_query: "Lehigh Valley Grand Prix indoor karting race track Allentown"
  }),
  place({
    id: "palisades-center", name: "Palisades Center", kind: "shopping-recovery-block", city: "West Nyack", state: "NY",
    address: "1000 Palisades Center Dr, West Nyack, NY 10994", visit_date: "2026-10-13", duration_minutes: 150,
    summary: "A large retail and entertainment complex placed directly on the North Jersey-to-Connecticut return arc.",
    why_go: "It gives Viki a second shopping window and deliberately lowers physical output after the Gettysburg-Hawk-karting day.",
    best_for: ["viki", "sheluvspaco"], best_fit_note: "Viki gets brand variety and Paco gets a flexible recovery block; Gora and Stivka can split toward entertainment or rest without moving the cars.",
    categories: ["shopping_outlets", "quiet_reset"], experience_bucket: "shopping",
    hours: { opens: "10:00", closes: "20:00", status: "reconfirm-current", note: "Tuesday center hours; individual stores vary." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: false, traffic_gated: true, high_physicality: false, photo_heavy: false },
    source_ids: ["src-energy-palisades"], image_query: "Palisades Center West Nyack interior shopping mall attractions"
  }),
  place({
    id: "purgatory-chasm", name: "Purgatory Chasm State Reservation", kind: "rock-chasm-scramble", city: "Sutton", state: "MA",
    address: "198 Purgatory Rd, Sutton, MA 01590", visit_date: "2026-10-14", duration_minutes: 120,
    priority: "optional", included_in_magic_score: false,
    summary: "A dramatic glacial rock chasm and two miles of trails create a playful scramble on the final road morning.",
    why_go: "It remains a fully researched future swap, but it is not scheduled because adding it to the Fairfield-to-Boston finish pushes rental-car driving beyond the 210-minute cap.",
    best_for: ["gora", "viki"], best_fit_note: "Gora gets a real scramble and Viki gets dramatic rock photography; Paco and Stivka can choose the easier rim paths.",
    categories: ["nature_visual", "athletic_adrenaline", "unusual_creative"], experience_bucket: "nature-scenic",
    cost: { amount_per_person: 10, low: 2.5, high: 10, price_type: "vehicle_fee", status: "checked-2026-08-31", note: "Conservative two-car nonresident parking allocation; actual plate mix may reduce it." },
    hours: { opens: null, closes: null, status: "verified-seasonal", note: "Sunrise-sunset; never scramble during or immediately after rain because the rocks become slippery." },
    experience_flags: { museum_like: false, weather_gated: true, booking_required: false, traffic_gated: false, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-purgatory"], image_query: "Purgatory Chasm Massachusetts rock scramble autumn trail"
  }),
  place({
    id: "boda-borg-boston", name: "Boda Borg Boston", kind: "physical-mental-questing", city: "Malden", state: "MA",
    address: "90 Pleasant St, Malden, MA 02148", visit_date: "2026-10-14", duration_minutes: 120,
    summary: "Twenty-four themed Quests and more than seventy mental and physical rooms reward repeated attempts, rapid learning and four-person teamwork.",
    why_go: "It is the ideal finale: the group fails, adapts, laughs and wins together instead of ending the trip in another display hall.",
    best_for: ["sheluvspaco", "gora", "viki"], best_fit_note: "Paco gets team coordination, Gora gets physical rooms and Viki gets playful immersive variety; Stivka remains essential to solving the Quests.",
    categories: ["interactive_puzzle_immersive", "athletic_adrenaline", "group_bonding"], experience_bucket: "interactive-puzzle-immersive",
    reservation: "reserve-around-car-return", cost: { amount_per_person: 32, low: 32, high: 32, price_type: "paid", status: "checked-2026-08-31", note: "Two-hour current price; closed-toe attached shoes required." },
    hours: { opens: "10:00", closes: "22:00", status: "verified-current", note: "Wednesday hours; final slot must respect the two-car return deadline." },
    experience_flags: { museum_like: false, weather_gated: false, booking_required: true, traffic_gated: true, high_physicality: true, photo_heavy: true },
    source_ids: ["src-energy-boda"], image_query: "Boda Borg Boston Malden quest rooms team challenge"
  })
];

export const legacyCoreIds = [
  "castle-hill-lighthouse", "cliff-walk", "newport-car-museum", "woodbury-common",
  "dumbo-brooklyn-bridge-park", "st-nicholas-wtc", "oculus", "roosevelt-island-tram",
  "elfreths-alley", "eastern-state", "avam", "lincoln-memorial", "st-nicholas-cathedral-dc",
  "gettysburg-battlefield", "paterson-great-falls", "old-sturbridge-village"
];

export const legacyOptionalIds = ["submarine-force-museum", "steelstacks", "reading-terminal-market"];

export const sources = [
  ["src-energy-level99", "Level99 Providence", "official", "https://www.level99.com/providence-ri", ["location", "gameplay", "hours", "reservations"]],
  ["src-energy-napatree", "Watch Hill Conservancy - Napatree Point", "land-trust", "https://watchhillconservancy.org/napatree/", ["public access", "conservation", "parking constraints"]],
  ["src-energy-it-ropes", "It Adventure Ropes Course", "official", "https://itatjordans.squarespace.com/contact", ["address", "Monday hours", "course access"]],
  ["src-energy-vessel", "Vessel visitor information", "official", "https://www.vesselnyc.com/visit", ["hours", "tickets", "location"]],
  ["src-energy-high-line", "The High Line visitor information", "official", "https://www.thehighline.org/visit/", ["hours", "access", "park route"]],
  ["src-energy-central-park-bike", "Central Park bicycle rental planning source", "operator", "https://www.unlimitedbiking.com/rentals/central-park-bike-rentals/", ["October operation", "rental equipment", "location"]],
  ["src-energy-four-freedoms", "Four Freedoms Park planning", "official", "https://www.fdrfourfreedomspark.org/visit/planning-your-visit/", ["Wednesday hours", "address", "access"]],
  ["src-energy-beat-bomb", "Beat The Bomb Brooklyn", "official", "https://www.beatthebomb.com/locations/brooklyn", ["Wednesday operation", "mission format", "address", "price"]],
  ["src-energy-nj-atv", "NJ ATV Rentals", "official", "https://njatvrentals.com/", ["guided ATV format", "season", "reservation", "price"]],
  ["src-energy-baps", "BAPS Swaminarayan Akshardham visitor information", "official", "https://usa.akshardham.org/visit/", ["hours", "address", "visitor etiquette"]],
  ["src-energy-treetop", "Treetop Quest Philadelphia", "official", "https://www.treetopquest.com/philly/", ["obstacles", "ziplines", "2026 schedule", "weather policy"]],
  ["src-energy-ministry", "Ministry of Awe", "official", "https://www.ministryofawe.com/", ["hours", "address", "immersive format"]],
  ["src-energy-ifly", "iFLY Baltimore", "official", "https://www.iflyworld.com/baltimore/", ["location", "first-time flight", "reservations"]],
  ["src-energy-cunningham", "Cunningham Falls State Park", "state-park", "https://dnr.maryland.gov/publiclands/pages/western/cunningham.aspx", ["Houck Area", "hours", "capacity", "fees"]],
  ["src-energy-sachs", "Sachs Covered Bridge", "destination-authority", "https://destinationgettysburg.com/members/sachs-covered-bridge/", ["location", "history", "public access"]],
  ["src-energy-hawk", "Hawk Mountain visitor information", "official", "https://www.hawkmountain.org/visit/visiting-info/admission-hours", ["hours", "trail fee", "autumn migration"]],
  ["src-energy-lvgp", "Lehigh Valley Grand Prix", "official", "https://www.lehighvalleygrandprix.com/", ["Monday hours", "race format", "price"]],
  ["src-energy-palisades", "Palisades Center", "official", "https://www.palisadescenter.com/", ["address", "hours", "retail"]],
  ["src-energy-purgatory", "Purgatory Chasm State Reservation", "state-park", "https://www.mass.gov/locations/purgatory-chasm-state-reservation", ["hours", "trail character", "wet-rock warning", "parking"]],
  ["src-energy-boda", "Boda Borg Boston", "official", "https://www.bodaborg.com/locations/boston/", ["Wednesday hours", "quests", "price", "shoe rule"]]
].map(([id, title, source_type, url, claims]) => ({ id, title, source_type, url, verified_at: VERIFIED_AT, claims }));

export const dayPlans = [
  { day: 1, date: "2026-10-04", sleep_city: "Newport, RI", theme: "Ignition: team challenges into Atlantic golden hour", energy: "medium-high", lodging: ["Downtown Newport or harbor edge", "Middletown near West Main Road"], schedule: [["13:15", "15:15", "level99-providence", "anchor"], ["17:20", "18:30", "castle-hill-lighthouse", "anchor"]], drive_nodes: ["boston-logan-rental", "level99-providence", "castle-hill-lighthouse", "newport-lodging"], fallback: "If the Nantucket transfer is late, cut Level99 before sacrificing the coastal sunset or driving tired." },
  {
    day: 2,
    date: "2026-10-05",
    sleep_city: "New Haven, CT",
    theme: "Design machines, wild coast and indoor ropes",
    energy: "high-varied",
    lodging: ["Downtown/Yale with a staffed secure garage", "East Rock near Whitney Avenue"],
    schedule: [["07:40", "09:00", "cliff-walk", "supporting"], ["10:00", "11:20", "newport-car-museum", "anchor"], ["12:20", "13:50", "napatree-point", "anchor"], ["15:30", "17:45", "it-adventure-ropes", "anchor"]],
    optional_spots: [{
      place_id: "submarine-force-museum",
      option_type: "weather-swap",
      status: "safe-as-swap-only",
      replaces_place_ids: ["napatree-point"],
      baseline_total_minutes_if_added: 212,
      baseline_total_miles_if_added: 133.8,
      baseline_total_minutes_if_used: 193,
      baseline_total_miles_if_used: 125.1,
      current_baseline_total_minutes: 201,
      cap_minutes: 210,
      note: "Use USS Nautilus instead of Napatree when coastal weather is poor. The swap is safely under the cap; adding both is not allowed."
    }],
    drive_nodes: ["newport-lodging", "cliff-walk", "newport-car-museum", "napatree-point", "it-adventure-ropes", "new-haven-lodging"],
    fallback: "If coastal weather is poor, replace Napatree with the unscored USS Nautilus fallback; do not add both. The swap measures 193 baseline minutes, while adding both measures 212 and breaks the 210-minute rule."
  },
  { day: 3, date: "2026-10-06", sleep_city: "New York, NY", theme: "Shopping recovery and a moving Manhattan reveal", energy: "recovery-visual", lodging: ["Downtown Brooklyn with a secure garage", "Long Island City near Court Square"], schedule: [["10:00", "13:30", "woodbury-common", "anchor"], ["16:15", "16:55", "vessel-hudson-yards", "anchor"], ["17:00", "18:30", "high-line-hudson-yards", "supporting"]], drive_nodes: ["new-haven-lodging", "woodbury-common", "nyc-lodging"], fallback: "If live traffic from Woodbury exceeds the protected window, park first and cut Vessel before accepting an excessive uninterrupted drive." },
  { day: 4, date: "2026-10-07", sleep_city: "New York, NY", theme: "Car-free urban game day", energy: "high-varied", lodging: ["Same Downtown Brooklyn hotel", "Same Long Island City hotel"], schedule: [["09:00", "11:00", "central-park-bike-loop", "anchor"], ["12:15", "12:50", "st-nicholas-wtc", "anchor"], ["12:50", "13:15", "oculus", "supporting"], ["13:45", "14:10", "roosevelt-island-tram", "supporting"], ["14:30", "15:30", "four-freedoms-park", "supporting"], ["16:30", "17:45", "beat-the-bomb-brooklyn", "anchor"], ["17:45", "19:00", "dumbo-brooklyn-bridge-park", "supporting"]], drive_nodes: [], fallback: "Cars remain parked. In rain, cut the bike loop first and protect Beat The Bomb plus the sacred/architecture sequence." },
  { day: 5, date: "2026-10-08", sleep_city: "Philadelphia, PA", theme: "Motor adrenaline, monumental sacred craft and one old street", energy: "high-then-calm", lodging: ["Old City with secure parking", "Fishtown/Northern Liberties with secure parking"], schedule: [["10:00", "11:15", "nj-atv-rentals", "anchor"], ["12:15", "14:15", "baps-akshardham", "anchor"], ["16:15", "16:50", "elfreths-alley", "supporting"]], drive_nodes: ["nyc-lodging", "nj-atv-rentals", "baps-akshardham", "elfreths-alley", "philadelphia-lodging"], fallback: "If the ATV booking is not confirmed or weather cancels it, leave it empty rather than replacing it with another museum." },
  { day: 6, date: "2026-10-09", sleep_city: "Philadelphia, PA", theme: "Market fuel, prison atmosphere, forest canopy and surreal labyrinth", energy: "signature-aggressive", lodging: ["Same Old City hotel", "Same Fishtown/Northern Liberties hotel"], schedule: [["08:15", "09:15", "reading-terminal-market", "optional"], ["10:00", "11:20", "eastern-state", "anchor"], ["12:00", "14:30", "treetop-quest-philly", "anchor"], ["16:00", "18:00", "ministry-of-awe", "anchor"]], drive_nodes: [], fallback: "Reading Terminal is a flexible breakfast stop and stays unscored. In bad weather, cut Treetop Quest and extend Ministry only if the group wants it." },
  { day: 7, date: "2026-10-10", sleep_city: "Washington, DC", theme: "Indoor flight, outsider-art color and monument scale", energy: "medium-high", lodging: ["Dupont, Logan Circle or Shaw with secure parking", "Crystal City near Metro"], schedule: [["10:30", "12:00", "ifly-baltimore", "anchor"], ["13:00", "14:30", "avam", "anchor"], ["16:30", "18:45", "lincoln-memorial", "supporting"]], drive_nodes: ["philadelphia-lodging", "ifly-baltimore", "avam", "dc-lodging"], fallback: "If I-95 traffic destroys the Baltimore margin, AVAM is the first cut; never sacrifice the DC sleep or drive cap." },
  { day: 8, date: "2026-10-11", sleep_city: "Gettysburg, PA", theme: "Orthodox Sunday into waterfall forest and a covered bridge", energy: "recovery-nature", lodging: ["Historic Gettysburg", "US-30/US-15 hotel cluster"], schedule: [["09:00", "10:45", "st-nicholas-cathedral-dc", "anchor"], ["12:20", "14:35", "cunningham-falls", "anchor"], ["15:25", "15:55", "sachs-covered-bridge", "supporting"]], drive_nodes: ["dc-lodging", "st-nicholas-cathedral-dc", "cunningham-falls", "sachs-covered-bridge", "gettysburg-lodging"], fallback: "If the park is at capacity or severe rain arrives, continue to Gettysburg early rather than adding an indoor museum." },
  {
    day: 9,
    date: "2026-10-12",
    sleep_city: "Bethlehem / Lehigh Valley, PA",
    theme: "Truth on terrain, migration ridges and karting",
    energy: "high-balanced",
    lodging: ["Bethlehem SouthSide or historic core with secure parking", "Allentown/Bethlehem hotel cluster"],
    schedule: [["08:30", "10:30", "gettysburg-battlefield", "anchor"], ["12:20", "15:00", "hawk-mountain-north-lookout", "anchor"], ["16:30", "18:00", "lehigh-valley-grand-prix", "anchor"]],
    optional_spots: [{
      place_id: "steelstacks",
      option_type: "extra-stop",
      status: "over-standard-cap",
      replaces_place_ids: [],
      baseline_total_minutes_if_added: 212,
      baseline_total_miles_if_added: 143.3,
      current_baseline_total_minutes: 205,
      current_baseline_total_miles: 141.8,
      cap_minutes: 210,
      over_cap_minutes: 2,
      note: "SteelStacks is a free night flex, but the exact routed addition reaches 212 baseline minutes. Activate it only after shortening or replacing another stop enough to restore the driving margin."
    }],
    drive_nodes: ["gettysburg-lodging", "hawk-mountain-north-lookout", "lehigh-valley-grand-prix", "bethlehem-lodging"],
    fallback: "Arrange the licensed guide to meet the group at the Gettysburg lodging/central pickup point, so the battlefield circuit is the booked experience rather than a separate road reposition. Hawk Mountain is the weather cut. SteelStacks stays visible as an optional flex, but it is not part of the baseline because the exact addition reaches 212 minutes."
  },
  { day: 10, date: "2026-10-13", sleep_city: "Fairfield, CT", theme: "Urban waterfall and shopping recovery", energy: "low-recovery", lodging: ["Fairfield near Post Road with secure parking", "Fairfield/Black Rock hotel with staffed reception"], schedule: [["09:45", "11:00", "paterson-great-falls", "anchor"], ["12:00", "14:30", "palisades-center", "anchor"]], drive_nodes: ["bethlehem-lodging", "paterson-great-falls", "palisades-center", "fairfield-lodging"], fallback: "Fairfield is the balanced overnight split: the frozen network baseline keeps both final driving days under 210 minutes. Shorten Palisades before allowing North Jersey or I-95 traffic to erase that buffer." },
  {
    day: 11,
    date: "2026-10-14",
    sleep_city: "Boston, MA",
    theme: "Living-history village finale, then a four-person quest after the cars are safely returned",
    energy: "high-finale",
    lodging: ["Logan Airport hotel with shuttle", "Seaport with confirmed airport transfer"],
    schedule: [["09:30", "12:00", "old-sturbridge-village", "anchor"], ["14:00", "16:00", "boda-borg-boston", "anchor"]],
    optional_spots: [{
      place_id: "purgatory-chasm",
      option_type: "route-redesign",
      status: "over-authorized-cap",
      replaces_place_ids: [],
      baseline_total_minutes_if_added: 247,
      baseline_total_miles_if_added: 180.5,
      current_baseline_total_minutes: 216,
      current_baseline_total_miles: 163.9,
      cap_minutes: 220,
      over_cap_minutes: 27,
      note: "Purgatory Chasm cannot be added to the current finale. It requires replacing Old Sturbridge Village or redesigning the day; the additive route reaches 247 minutes against this day's authorized 220-minute limit."
    }],
    drive_nodes: ["fairfield-lodging", "old-sturbridge-village", "boston-logan-return", "boston-logan-hotel"],
    fallback: "Leave Fairfield by 06:30 to reach Old Sturbridge Village for its 09:30 Wednesday opening. This restores Old Sturbridge Village per traveler request; the Fairfield-Sturbridge-Boston routing raises baseline driving from 200 to 216 minutes, an authorized exception to the standard 210-minute cap for this day only. Return both cars at Logan before the quest, and reach Boda Borg by transit/rideshare. Purgatory Chasm stays visible as a route-redesign option; adding it reaches 247 minutes and exceeds the authorized 220-minute limit."
  }
];

export const manualNodeCoordinates = {
  "boston-logan-rental": [-71.0236, 42.367],
  "newport-lodging": [-71.3113, 41.4901],
  "new-haven-lodging": [-72.9279, 41.3083],
  "nyc-lodging": [-73.9903, 40.6928],
  "philadelphia-lodging": [-75.1443, 39.9504],
  "dc-lodging": [-77.0365, 38.9072],
  "gettysburg-lodging": [-77.2311, 39.8309],
  "bethlehem-lodging": [-75.3824, 40.6202],
  "fairfield-lodging": [-73.2637, 41.1412],
  "boston-logan-return": [-71.0304, 42.3682],
  "boston-logan-hotel": [-71.0155, 42.3655]
};
