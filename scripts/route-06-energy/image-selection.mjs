// Candidates chosen off the Route 06 contact sheets in
// tmp/route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop-image-harvest/sheets/.
//
// Format: [candidateIndex, description, coverage?] — coverage defaults to exact-place-or-experience.
//
// These 30 places were previously showing cloned "regional-context-not-exact-place" images borrowed
// from other venues. Every pick below is a photograph of the place itself.
//
// Rejected during review: site watermarks (pabucketlist.com, TrekOhio.com, WildATV.com), operator
// logo and title-card overlays, vintage postcards, trail maps, video thumbnails, and the Grave Creek
// Mound signage that Commons returns inside the West Virginia Penitentiary result set.
//
// Same-venue groups (four TALA tours, three WV Penitentiary products, two Braxxie hunts) ran one
// query each. Their sheets are index-aligned, so each card takes different frames and no two cards
// end up with the same photograph.

export const selection = {
  /* ---- core ---- */

  "old-new-gate": [
    [1, "The brick prison ruins with the timber bracing that holds the walls"],
    [7, "The stone stair down to the barred mine entrance"],
    [9, "Roofless sandstone cell blocks open to the sky"]
  ],
  "reading-pagoda": [
    [3, "The pagoda lit red above the Reading city lights at dusk"],
    [12, "The pagoda's tiered roofs against open blue sky"],
    [16, "The pagoda from the terrace below its lowest gallery"]
  ],
  "pike2bike-rays-hill": [
    [10, "Inside the abandoned turnpike tunnel, both bores covered in graffiti"],
    [3, "The tunnel portal reached along the cracked roadbed"],
    [8, "The portal and its ventilation housing swallowed by scrub"]
  ],
  "carrie-blast-furnaces": [
    [4, "The furnaces and their gas mains standing above the tree line"],
    [6, "Light falling through the shattered cladding inside the cast house"],
    [12, "The stove line looking up the length of the hot-blast pipes"]
  ],
  "troy-hill-art-houses": [
    [1, "The ordinary Troy Hill rowhouse that holds the installation"],
    [3, "A room lined floor to ceiling with records and patterned wallpaper"],
    [4, "The amber-lit room of salvaged lamps and lenses"]
  ],
  "maxo-vanka-murals": [
    [3, "Immigrant workers holding up a model of the church, painted on the nave wall"],
    [11, "The painted dome and altar seen from the nave floor"],
    [6, "The dinner-table mural where a diner is served by a waiter in a gas mask"]
  ],
  "wv-penitentiary": [
    [1, "The gothic sandstone front of the penitentiary"],
    [9, "The prison seen across the town in autumn colour"],
    [16, "A cell interior with its fixed steel toilet"]
  ],
  "fort-boreman": [
    [1, "The park entrance arch on the hilltop road"],
    [3, "The Ohio and Little Kanawha confluence from the overlook"],
    [15, "A field gun on the ridge at sunset above the rivers"]
  ],
  "mothman-tnt-tour": [
    [3, "An open concrete igloo with its dark interior, one of the TNT-area magazines"],
    [8, "An igloo doorway mirrored in standing water"],
    [2, "A grassed-over magazine with its steel door still in place"]
  ],
  "braxxie-chair-hunt": [
    [6, "A Braxxie chair beside the Flatwoods town sign"],
    [8, "The green-jacketed Braxxie variant on its roadside platform"],
    [16, "Close on the monster's spade-shaped head and lit eyes"]
  ],
  "coopers-rock-clay-furnace": [
    [2, "The Cheat River canyon from the main overlook in full autumn colour"],
    [16, "The overlook rock ledge above the gorge"],
    [5, "The narrow passage between the cliff faces on the rock trail"]
  ],
  "sideling-hill-road-cut": [
    [5, "The interstate curving through the cut with autumn colour on the ridge"],
    [4, "The folded rock strata rising above both carriageways"],
    [1, "The full height of the cut from the roadside"]
  ],
  "fort-hunter-rockville-bridge": [
    [5, "The stone arches marching across the Susquehanna under open sky"],
    [12, "A freight train crossing the masonry arches"],
    [2, "The bridge from the river shore, showing its full length"]
  ],
  "pocono-premium-outlets": [
    [1, "The outlet street with autumn trees behind the shopfronts"],
    [5, "The centre sign against the wooded Pocono ridge"],
    [8, "The main building and its glazed entrance block"]
  ],
  "dana-common": [
    [6, "A dry-laid stone wall running through the woods that grew over the town"],
    [11, "A surviving cellar hole among the trees"],
    [16, "The Dana Common register plaque set into a boulder on the green"]
  ],

  /* ---- options ---- */

  "ruins-project": [
    [2, "The mosaic-covered wall running the length of the ruined coke works"],
    [7, "A full-size locomotive worked in mosaic along the concrete wall"],
    [14, "A mosaic portrait set into the bare concrete"]
  ],
  "imaginarium-minds-eye": [
    [2, "The library set with its oversized clock"],
    [6, "The curtained parlour set"],
    [9, "The yellow-striped illusionist's room"]
  ],
  "hundred-acres-manor": [
    [1, "The manor facade lit red and stacked with carved pumpkins"],
    [5, "The orange-lit entrance arch into the haunt"],
    [7, "The castle front and rose window at night"]
  ],
  "wv-pen-dungeon": [
    [6, "The penitentiary front under heavy cloud"],
    [3, "The building seen through the perimeter razor wire"],
    [11, "The long cell-block wall running down the street"]
  ],
  "wv-pen-escape": [
    [2, "The main gate and the planting along the front wall"],
    [7, "The prison across the open field from the north"],
    [10, "The full length of the walled compound"]
  ],
  "palace-of-gold": [
    [1, "The gilded domes and painted terraces of the palace"],
    [3, "The fountain and gardens below the palace front"],
    [2, "A festival crowd gathered on the palace terrace", "exact-place-or-experience-context"]
  ],
  "blennerhassett-candlelight": [
    [2, "The reconstructed Palladian mansion at the end of its drive"],
    [4, "The mansion front and flanking wings"],
    [6, "A nineteenth-century engraving of the island estate", "exact-place-or-experience-context"]
  ],
  "mountwood-atv": [
    [9, "Riders strung along a ridge trail with the hills behind"],
    [4, "An ATV throwing dirt on a rutted climb"],
    [14, "A rider in dust under yellow autumn canopy"]
  ],
  "free-braxxie-challenge": [
    [10, "A Braxxie chair beside its interpretive kiosk"],
    [13, "A chair standing in deep green woods"],
    [3, "The red-headed monster silhouetted against a pale sky"]
  ],
  "jq-dickinson-salt": [
    [6, "The salt house and barn under the autumn hillside above the Kanawha"],
    [3, "Finishing salts in their jars on the works counter"],
    [8, "Three jars of the finished salt on weathered board"]
  ],
  "tala-four-floor": [
    [1, "The Kirkbride building's full front elevation and clock tower"],
    [7, "A ward corridor running the length of the wing"],
    [4, "The restored period parlour on the main floor"]
  ],
  "tala-hysteria": [
    [8, "A wheelchair left in a peeling day room"],
    [10, "The rocking chair and restraint display in the medical rooms"],
    [11, "A case of surgical and musical instruments from the asylum collection"]
  ],
  "tala-paranormal": [
    [12, "A tiled ward corridor lit green and red"],
    [6, "Barred window light falling across an empty room"],
    [11, "A desk and lamp left in a treatment room"]
  ],
  "tala-ghost-hunt": [
    [5, "A gilded mirror in one of the administration rooms"],
    [3, "A violin from the asylum's music therapy collection", "exact-place-or-experience-context"],
    [2, "A patient ledger from the asylum archive", "exact-place-or-experience-context"]
  ],
  "sideling-hill-creek": [
    [3, "The Potomac far below the overlook in full autumn colour"],
    [2, "The overlook bench and the valley beyond it"],
    [11, "Kayakers working the creek where it meets the river"]
  ]
};
