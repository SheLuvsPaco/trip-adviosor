// Candidates chosen off the Route 09 contact sheets in
// tmp/route-09-kaleidoscopes-scripture-stones-secret-machines-loop-image-harvest/sheets/.
//
// Format: [candidateIndex, description, coverage?] — coverage defaults to exact-place-or-experience.
//
// Rejected during review: stock-agency comps (blocked at source), operator key art and title cards
// with text burned in, site watermarks (pabucketlist.com, uncoveringpa.com, weirdnj.com), photo
// collages, TV chyrons, posed team photos with venue branding, engineering drawings and county maps,
// and out-of-season snow frames on an October route.
//
// Two honesty notes that drove several coverage downgrades:
//   - The four Troy Hill art houses share search results; a Darkhouse lighthouse frame turned up in
//     the Kunzhaus set. Interiors that cannot be attributed to a specific house are marked context.
//   - Puzzle Theory and Captivating Worlds run several rooms at one address, so room-level
//     attribution of a set photo is not verifiable from the frame.

export const selection = {
  /* ------------------------------------------------------------------ core */

  "keystone-arches": [
    [1, "The dry-laid stone arch carrying the old Boston & Albany grade over the west branch in full October colour"],
    [7, "The arch above the stream with autumn foliage on both banks"],
    [6, "Walkers standing on top of the arch, which is how the trail sampler actually meets the bridge"]
  ],
  "rail-explorers-express": [
    [12, "A railbike running through a tunnel of peak autumn foliage on the Catskills line"],
    [10, "A four-person quad railbike beside the river, which is the exact product the group books"],
    [8, "The rail line along the water with the Catskills behind it"]
  ],
  "bilgers-rocks": [
    [6, "The narrow passage between two sandstone walls that the visit is built around"],
    [3, "Moss-covered corridors of the rock city under the tree canopy"],
    [2, "A sandstone slab bridging the passage overhead"]
  ],
  "faustus-escape": [
    [6, "Players working a dark, green-lit room mid-game"],
    [11, "The gear-and-timber set dressing of the room interior"],
    [1, "The New Albany storefront the escape rooms operate from", "exact-place-or-experience-context"]
  ],
  "st-nicholas-orthodox": [
    [1, "The parish exterior with its gold onion dome"],
    [3, "A full congregation standing through the Divine Liturgy", "exact-place-or-experience-context"],
    [8, "The priest in green vestments before the congregation", "exact-place-or-experience-context"]
  ],
  "hickory-run-boulder-field": [
    [3, "The boulder field running to the treeline under open sky, showing its full extent"],
    [2, "Visitors sitting out on the boulders, which is the only way to judge the scale"],
    [7, "Close on the large unstable boulders that have to be physically negotiated"]
  ],
  "skirmish-paintball": [
    [7, "A large field game in progress with smoke drifting across the grass"],
    [10, "An elevated view of a full bunker field mid-game"],
    [11, "Woodland play among the trees with a flag objective"]
  ],
  "fonthill-castle": [
    [1, "The full concrete castle from the lawn under open sky"],
    [11, "The interior columns, fireplace and tiled arched windows of the main hall"],
    [12, "An interior room lined with Mercer's handmade tile and prints"]
  ],
  "northlandz": [
    [5, "The signature trestle bridge spanning a modelled gorge"],
    [8, "A wide view down the layout hall showing how much of the building the miniature world fills"],
    [4, "A visitor walking the canyon between layout sections, which gives the scale"]
  ],
  "puzzle-theory-spectral": [
    [10, "A set built around a vault door and hanging chains", "exact-place-or-experience-context"],
    [8, "Neon-lit ladder and timber set dressing", "exact-place-or-experience-context"],
    [3, "An illuminated puzzle box prop", "exact-place-or-experience-context"]
  ],

  /* --------------------------------------------------------------- options */

  "kaaterskill-falls": [
    [6, "The two-tier falls dropping into the amphitheatre in autumn"],
    [2, "The upper fall and the rock shelf behind it"],
    [10, "The cascade running over the lower ledge"]
  ],
  "saugerties-lighthouse": [
    [3, "The brick lighthouse in golden evening light above the autumn marsh grass"],
    [8, "The boardwalk approach across the marsh, which is the walk itself"],
    [1, "The lighthouse and keeper's house from the water side"]
  ],
  "spiral-house-park": [
    [1, "The artist-built house set into a hillside of peak autumn colour"],
    [10, "The full rainbow arch sculpture on the lawn"],
    [5, "The multicoloured wave sculpture on its reflecting base"]
  ],
  "roebling-aqueduct": [
    [1, "The aqueduct carrying its deck across the Delaware, seen from above"],
    [3, "The deck between the stone towers, which is the crossing on foot"],
    [9, "The span in its river landscape"]
  ],
  "hawks-nest": [
    [11, "The road curving along the cliff face above the Delaware behind its stone parapet"],
    [10, "The stone wall and roadway hugging the rock with the valley below"],
    [1, "The river running through the wooded gorge from the overlook"]
  ],
  "ricketts-glen": [
    [6, "A tall falls dropping through the glen in autumn"],
    [9, "Falls stepping down over ledges with golden leaves on the rocks"],
    [1, "The cascade running beside the trail"]
  ],
  "elk-country-visitor-center": [
    [3, "Wild elk grazing an autumn meadow with the ridge behind them"],
    [2, "The visitor centre building and its viewing terrace"],
    [11, "The bronze bull elk at the centre entrance"]
  ],
  "kinzua-bridge": [
    [6, "The surviving viaduct towers above autumn forest"],
    [7, "The skywalk deck running out along the old track bed"],
    [12, "The collapsed towers lying in the valley where the 2003 tornado left them"]
  ],
  "austin-dam": [
    [1, "The broken concrete dam standing in the valley as a walkable ruin"],
    [12, "The state marker recording the 1911 failure"],
    [2, "The 1911 flood aftermath in the valley below the dam", "exact-place-or-experience-context"]
  ],
  "penns-cave": [
    [5, "A tour boat under the lit formations, which is the whole all-water experience"],
    [1, "Visitors boarding at the cave mouth"],
    [6, "Lit flowstone along the cavern wall"]
  ],
  "troy-hill-lighthouse": [
    [6, "The glazed lantern room built inside the rowhouse attic"],
    [1, "The Fresnel lens lit in a darkened room"],
    [9, "The black-and-white striped interior with visitors for scale", "exact-place-or-experience-context"]
  ],
  "troy-hill-hutte-royal": [
    [1, "The ordinary Troy Hill rowhouse that contains the work"],
    [2, "A layered interior of lamps, framed pieces and salvaged furniture"],
    [12, "The red quilted ceiling installation overhead"]
  ],
  "troy-hill-kunzhaus": [
    [1, "A preserved parlour with piano and period furniture in one of the Troy Hill art houses", "exact-place-or-experience-context"],
    [2, "A study of lamps, ledgers and bookshelves inside the house", "exact-place-or-experience-context"],
    [4, "A wall densely hung with devotional prints and crosses", "exact-place-or-experience-context"]
  ],
  "troy-hill-mrs-christopher": [
    [8, "Attic shelving packed with specimen jars in Mark Dion's cabinet-of-curiosity arrangement"],
    [12, "The ultraviolet-lit Extinction Club room"],
    [7, "The green glass display cabinet standing in the yard behind the house"]
  ],
  "gamegrounds-columbus": [
    [1, "Players at the illuminated arch game in the dark hall"],
    [10, "Two players working an LED button game"],
    [5, "The pixel-and-starfield room"]
  ],
  "captivating-worlds-machine": [
    [7, "Players inside a brick-and-lamp set mid-game"],
    [3, "A room set built as a kitchen with a chequerboard floor", "exact-place-or-experience-context"],
    [2, "The stairway inside the venue", "exact-place-or-experience-context"]
  ],
  "book-loft": [
    [5, "A narrow corridor of shelving, which is what makes the 32 rooms worth walking"],
    [2, "The courtyard entrance with book displays under the awnings"],
    [12, "The brick alley running along the shopfront"]
  ],
  "hartman-rock-garden": [
    [12, "The large stone castle facade built up from hand-set rock"],
    [1, "One of the miniature stone buildings in close detail"],
    [9, "A long stone wall set with small figures"]
  ],
  "cook-forest-cathedral": [
    [3, "Old-growth trunks rising from an autumn leaf floor in the Forest Cathedral"],
    [5, "The scale of the surviving white pines beside the trail"],
    [1, "The stream running through the old-growth stand in autumn"]
  ],
  "lakota-wolf": [
    [1, "Wolves in the preserve enclosure among autumn leaf litter"],
    [7, "A keeper among the pack, which is how the watch is actually run"],
    [10, "A black wolf in autumn forest", "species-reference-not-this-site"]
  ],
  "luna-parc": [
    [3, "The full mosaic-covered house and its garden of sculptures"],
    [11, "The mosaic interior bathroom"],
    [5, "Close on a mosaic door and window surround"]
  ],
  "optical-heritage-museum": [
    [7, "The gallery of display cases under coloured light"],
    [8, "A pair of 17th-century Nuremberg glasses with their handwritten label"],
    [5, "A tray of antique lenses from the working collection"]
  ],
  "puzzle-theory-kraken": [
    [10, "A set room lit in purple and green around a marked puzzle table", "exact-place-or-experience-context"],
    [2, "A lantern-lit set with a wall plaque", "exact-place-or-experience-context"],
    [5, "The South Windsor building the rooms operate from", "exact-place-or-experience-context"]
  ],
  "ramapo-valley": [
    [9, "The reservation lake under open sky"],
    [1, "The still pond with reflected trees"],
    [12, "The lake with the ridge above it in late autumn light"]
  ]
};
