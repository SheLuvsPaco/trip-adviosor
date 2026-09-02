// Candidates chosen off the Route 10 contact sheets in
// tmp/route-10-temples-follies-working-machines-loop-image-harvest/sheets/.
//
// Format: [candidateIndex, description, coverage?] — coverage defaults to exact-place-or-experience.
//
// Rejected during review: operator key art and title cards with burned-in text, site watermarks
// (uncoveringpa.com, escapetheroomers.com), award-badge overlays, trail and Sanborn maps, posed
// team photos with venue branding, photo collages, and out-of-season frames.
//
// Three review decisions worth recording:
//   - Belle Isle: Commons returns mostly Civil War prison-camp material for this island, including
//     photographs of emaciated prisoners. Those are historically real but wrong for a trip-planning
//     carousel, so only the modern river frames are used.
//   - National Cryptologic Museum: the Tunny display is photographed against a Nazi flag. Skipped in
//     favour of the Enigma rotors and the bugged Great Seal.
//   - Gnome & Raven's two cards draw from the same venue's room set, so their picks are kept
//     deliberately disjoint and the alternate rooms are marked as such.

export const selection = {
  /* ------------------------------------------------------------- new core */

  "old-new-gate": [
    [6, "The stone stair descending to the barred mine entrance, which is how the underground tour begins"],
    [1, "The prison ruins above ground with the hoist frame still standing"],
    [12, "Sandstone prison walls open to the sky"]
  ],
  "herrs": [
    [3, "Potato chips running along the production line below the visitor walkway"],
    [2, "The factory tour entrance under an open sky"],
    [1, "The tour building frontage and its snack-factory signage", "exact-place-or-experience-context"]
  ],
  "game-show-rush-hour": [
    [3, "The game-show studio set with its prize wheel and lit podiums"],
    [4, "Contestants ranged along the buzzer podiums mid-game"],
    [6, "The host working the studio floor"]
  ],
  "belle-isle": [
    [3, "Visitors out on the granite shelves in the James River rapids, which is the loop's whole point"],
    [2, "The rapids running past the island through summer trees"],
    [4, "The river at sunset from the island's downstream end"]
  ],
  "gnome-raven": [
    [4, "A built room of framed curiosities, lamps and a rock wall"],
    [9, "The candlelit table set with scattered tokens at the centre of a puzzle"],
    [1, "The Gnome & Raven Emporium frontage on the street", "exact-place-or-experience-context"]
  ],
  "vir-kart": [
    [1, "Karts running wheel to wheel on the circuit"],
    [7, "Drivers lined up in the karts at the paddock before a race"],
    [8, "The lit kart circuit at dusk"]
  ],
  "natural-chimneys": [
    [12, "The limestone towers standing against open sky above bare October trees"],
    [1, "The full height of the formation from the park lawn"],
    [4, "The towers seen along the base path"]
  ],
  "st-mary-orthodox": [
    [1, "The parish exterior with its gold domes"],
    [3, "The same brick church from the approach"],
    [4, "A full congregation standing through the Divine Liturgy", "exact-place-or-experience-context"]
  ],
  "ebt-shop": [
    [5, "The machine shop floor with its overhead line shafts still in place"],
    [7, "Belt-driven machine tools ranged along the shop windows"],
    [9, "The lit shop interior with the machinery as it was left"]
  ],
  "ebt-steam": [
    [12, "The steam train working through autumn forest on its own narrow-gauge line"],
    [11, "The locomotive under a full plume of steam"],
    [2, "The locomotive standing in the engine house at night"]
  ],
  "martin-guitar": [
    [12, "Hands working a guitar body at the bench on the factory floor"],
    [2, "The Nazareth factory building from the street"],
    [3, "The display of historic Martin instruments inside"]
  ],
  "hickory-run-boulder-field": [
    [2, "Visitors sitting out on the boulders, which is the only way to judge the field's scale"],
    [3, "The bare boulder field running unbroken to the treeline"],
    [7, "Close on the large unstable boulders that have to be crossed on foot"]
  ],
  "pocono-outlets": [
    [1, "The outlet street with its shopfronts and parking"],
    [8, "The centre set against the wooded Pocono hillside"],
    [10, "A storefront row with benches along the walkway"]
  ],
  "thirteenth-hour": [
    [4, "Players working a lit console together inside the room"],
    [1, "A neon-lit corridor set"],
    [8, "A heavy timber room set built for the horror theming"]
  ],
  "mine-hill-preserve": [
    [2, "The iron furnace stack framed by yellow autumn foliage"],
    [7, "The double-arched furnace face in the woods"],
    [3, "The roasting ovens standing in the forest"]
  ],

  /* ---------------------------------------------------------- new options */

  "bell-works": [
    [5, "The quarter-mile Saarinen atrium looking down its full length"],
    [8, "The atrium's stacked balconies under the glass roof"],
    [7, "Planting and seating on the atrium floor beneath the skylights"]
  ],
  "puzzleconnect": [
    [4, "A vault-door set built into the room", "exact-place-or-experience-context"],
    [1, "A wood-panelled room dressed with counters and a fireplace", "exact-place-or-experience-context"],
    [12, "Players working a puzzle table together", "exact-place-or-experience-context"]
  ],
  "brandywine-creek-sp": [
    [2, "The park's long dry-laid stone wall running along the meadow"],
    [1, "The tree-lined path in from the parking area"],
    [12, "The autumn field beside the park sign"]
  ],
  "cryptologic-museum": [
    [10, "Enigma rotors and dials at close range"],
    [6, "The carved Great Seal replica that concealed a Soviet listening device"],
    [3, "The museum building from the approach road", "exact-place-or-experience-context"]
  ],
  "port-of-falmouth": [
    [3, "The Rappahannock running past a sandbar below the old port"],
    [1, "The shallows and rock beds on the river"],
    [7, "A wartime sketch of Falmouth from the opposite bank", "exact-place-or-experience-context"]
  ],
  "gnome-raven-alt": [
    [2, "The timber ship interior built for the Shipwrecked room"],
    [10, "A carved stone doorway lit purple in the Tomb Ruins room"],
    [1, "A blue-lit cave wall hung with lanterns"]
  ],
  "tredegar-riverfront": [
    [12, "The Historic Tredegar building above the canal"],
    [11, "Brick ironworks ruins with the surviving stack"],
    [2, "The ironworks and river frontage as they stood in the 1860s", "exact-place-or-experience-context"]
  ],
  "danville-science": [
    [3, "The geodesic dome theatre beside the restored station building"],
    [2, "The colour-lit hands-on exhibit floor"],
    [7, "The main entrance and glazed atrium"]
  ],
  "danville-river-district": [
    [1, "A long brick tobacco warehouse running down the street"],
    [3, "Riverfront brick buildings at the heart of the district"],
    [7, "A warehouse block with its water tower still in place"]
  ],
  "black-dog-salvage": [
    [7, "The salvage floor inside, stacked with fixtures and architectural fragments"],
    [3, "The corner warehouse building with its flag"],
    [10, "The entrance sign and salvaged pieces set out along the frontage"]
  ],
  "explore-park-mtb": [
    [12, "A rider on singletrack through autumn forest"],
    [3, "A rider working a bermed section of purpose-built trail"],
    [6, "A rider airborne on the jump line"]
  ],
  "explore-park-treetop": [
    [2, "A climber threading the hanging rings obstacle"],
    [5, "A rider on the zipline through the canopy"],
    [7, "Climbers moving between platforms high in the trees"]
  ],
  "reddish-knob": [
    [1, "The ridge line and valley from the summit at dusk"],
    [4, "The bare rock of the summit under open sky"],
    [3, "The rock outcrop and the view west from it"]
  ],
  "rockhill-trolley": [
    [1, "A restored open-platform trolley on the museum's track"],
    [2, "A streamlined PCC car in the yard"],
    [4, "Trolley cars standing outside the car barn"]
  ],
  "pine-grove-furnace": [
    [9, "The stone iron furnace stack standing in the park"],
    [1, "The furnace with visitors at its base for scale"],
    [11, "The Appalachian Trail marker beside the park's stone building"]
  ],
  "kings-gap": [
    [1, "The Cameron-Masland stone mansion on the South Mountain ridge"],
    [6, "The mansion entrance under autumn leaf fall"],
    [3, "The mansion seen small against the forested ridge, which shows its setting"]
  ],
  "trough-creek": [
    [1, "The swinging suspension bridge over the creek"],
    [8, "The rock overhang and cliff face above the water"],
    [3, "The bridge seen from the creek bed below"]
  ],
  "raystown-allegrippis": [
    [12, "A rider on the flow trail above Raystown Lake in autumn"],
    [10, "Singletrack running along the slope above the water"],
    [2, "The built jump and berm line on the trail system"]
  ],
  "yuengling-brewery": [
    [1, "Brewery machinery and stacked lager cases on the working floor"],
    [4, "The brewery block at the street corner beneath the church spire"],
    [8, "The brick brewery facade hung with flags"]
  ],
  "skirmish-paintball": [
    [5, "A field game around a downed-aircraft prop"],
    [3, "A large open field with smoke drifting across the players"],
    [11, "Woodland play among the trees"]
  ],
  "pocono-utv": [
    [8, "A UTV on a forest road under full autumn colour"],
    [4, "Two riders in a side-by-side on the trail"],
    [7, "The UTV fleet lined up before a tour"]
  ],
  "bushkill-falls": [
    [10, "The main falls dropping through the gorge"],
    [12, "The tall fall seen from the boardwalk below"],
    [6, "A cascade stepping down through the ferns"]
  ],
  "five-wits": [
    [1, "A blue-lit sci-fi corridor set"],
    [5, "The venue frontage inside the mall", "exact-place-or-experience-context"],
    [7, "A purple-lit control room set"]
  ]
};
