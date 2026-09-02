#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ROUTE_SLUG } from "./config.mjs";

const ROOT = process.cwd();
const ROUTE_DIR = path.join(ROOT, "dataset", "routes", ROUTE_SLUG);
const IMAGE_DIR = path.join(ROOT, "assets", "routes", ROUTE_SLUG);
const RAW_PATH = path.join(ROUTE_DIR, "research-raw.json");
const requestedIds = new Set(process.argv.slice(2));

const groups = {
  "nas-wildwood": [
    ["https://wildwoodsnj.com/wp-content/uploads/2019/04/naval-air-station-wildwood.jpg", "https://wildwoodsnj.com/attraction/naval-air-station-wildwood/", "The Wildwoods", "Historic aircraft displayed inside NAS Wildwood's restored Hangar No. 1"],
    ["https://njmom.com/wp-content/uploads/2024/02/naval-air-station-museum-planes-scaled-1.jpg", "https://njmom.com/naval-air-station-wildwood-aviation-museum-hands-on-fun-for-everyone/", "NJ Mom", "The hands-on aircraft collection beneath the original timber hangar roof"],
    ["https://assets.mainlinetoday.com/2023/12/Naval-Air-Station.jpg", "https://mainlinetoday.com/things-to-do/travel/11-anytime-activities/", "Main Line Today", "Planes, helicopters and immersive displays filling the World War II hangar"]
  ],
  "mashomack-preserve": [
    ["https://assets.simpleviewinc.com/simpleview/image/upload/crm/newyorkstate/MashomackDrone_31Aug20-48_CDE06122-2F24-4F39-94292D34EF049D3C_3722e060-921c-54a7-2181c14dd37c777e.jpg", "https://www.iloveny.com/listing/mashomack-preserve/137722/", "I LOVE NY", "An aerial view of Mashomack Preserve's forest, tidal creeks and shoreline"],
    ["https://www.bridgeandtunnelclub.com/bigmap/outoftown/longisland/suffolkcounty/shelterisland/mashomack/15trail.jpg", "https://www.bridgeandtunnelclub.com/bigmap/outoftown/longisland/suffolkcounty/shelterisland/mashomack/", "Bridge and Tunnel Club", "A quiet woodland trail inside Mashomack Preserve"],
    ["https://hamptonsrealestateshowcase.com/wp-content/uploads/2023/06/Mashomack-Preserve_Kelli-Delaney-Kot.jpeg", "https://hamptonsrealestateshowcase.com/lifestyle/spotlight/take-a-hike-4/", "Hamptons Real Estate Showcase", "The marsh-and-woodland landscape protected at Mashomack"]
  ],
  "sunset-beach-atlantus": [
    ["https://sunsetbeachnj.com/cdn/shop/files/sunset_Brielle_Ashleigh_Dougherty.jpg?v=1768863380&width=1400", "https://sunsetbeachnj.com/", "Sunset Beach", "The SS Atlantus silhouette beneath a vivid Delaware Bay sunset"],
    ["https://cdn.shopify.com/s/files/1/1212/9252/files/Atlantus_and_Ferry_grande.jpg?v=1553120804", "https://sunsetbeachnj.com/pages/ss-atlantus-the-concrete-ship", "Sunset Beach", "The concrete wreck of SS Atlantus just offshore at Sunset Beach"],
    ["https://www.southernmansion.com/wp-content/uploads/sites/40/sunsets-at-sunset-beach.jpg", "https://www.southernmansion.com/blog/photo-worthy-places-in-cape-may/", "Southern Mansion", "Sunset Beach, dark rocks and the Atlantus wreck at golden hour"]
  ],
  "cape-charles": [
    ["https://capecharlesvirginiascape.com/wp-content/uploads/2022/05/DJI_0094-1621x1080.jpg", "https://capecharlesvirginiascape.com/", "Cape Charles Virginia's Cape", "An aerial view of Cape Charles' beach, waterfront homes and historic street grid"],
    ["https://capecharlesvirginiascape.com/wp-content/uploads/2020/10/CC-Main-St-Misc-0089.jpg", "https://capecharlesvirginiascape.com/activities-attractions/", "Cape Charles Virginia's Cape", "Cape Charles Town Beach on the calm Chesapeake Bay"],
    ["https://www.ace.aaa.com/content/ace-www/en/publications/travel/us-destinations/virginia/autumn-getaway-cape-charles/_jcr_content/article-image.coreimg.jpeg/1629156735633/cape-charles-1280.jpeg", "https://www.ace.aaa.com/publications/travel/us-destinations/virginia/autumn-getaway-cape-charles.html", "AAA", "An autumn walk along the Cape Charles fishing pier"]
  ],
  "vibe-neptune": [
    ["https://assets.simpleviewinc.com/simpleview/image/upload/c_fill%2Cf_jpg%2Cg_xy_center%2Ch_434%2Cq_65%2Cw_640%2Cx_4014%2Cy_3196/v1/clients/virginia/031924_VTC_Virginia_Beach_family_0097_Edit_2_6e7dbc73-9e07-41a5-9fa0-4ed7af273a02.jpg", "https://www.virginia.org/", "Virginia Tourism Corporation", "King Neptune beside the Virginia Beach boardwalk and Atlantic"],
    ["https://assets.simpleviewinc.com/simpleview/image/upload/c_fit%2Cw_800%2Ch_600/crm/virginiabeachva/ViBeCreativeDistrict-mural-by-Sam-Welty-2022_715D3F7F-5056-A36A-08C389E79C9BB556_715eebb1-5056-a36a-0828859b166cc97d.jpg", "https://www.visitvirginiabeach.com/event/annual-mural-festival/8846/", "Visit Virginia Beach", "A large-scale Sam Welty mural in the ViBe Creative District"],
    ["https://assets.simpleviewinc.com/simpleview/image/upload/c_limit%2Cq_75%2Cw_1200/v1/crm/virginia/ViBe-Creative-District-Mural-by-Hamilton-Glass-2022_7ED6A1A8-0F0D-4980-B487460980883DE6_d9109ec5-1ec4-4f20-afa1a5da4745b61f.jpg", "https://www.virginia.org/event/vibe-mural-festival/11025/", "Virginia Tourism Corporation", "Hamilton Glass' colorful public-art mural in the ViBe district"]
  ],
  "bo-railroad": [
    ["https://www.borail.org/wp-content/uploads/2023/03/museumhistory_3-1024x677.jpg", "https://www.borail.org/about/history/", "B&O Railroad Museum", "Historic locomotives arranged inside the museum's 1884 Baldwin Roundhouse"],
    ["https://baltimore.org/wp-content/uploads/2020/02/niche-museums-BO-museum2-1024x729.png", "https://baltimore.org/what-to-do/niche-baltimore-museums-you-should-put-on-your-list/", "Visit Baltimore", "The B&O Railroad Museum's roundhouse, turntable and locomotive collection"],
    ["https://smithsonianassociates.org/ticketing/images/web-core-2026/bo-railroad.jpg", "https://smithsonianassociates.org/ticketing/programs/b-o-railroad", "Smithsonian Associates", "Restored locomotives beneath the roundhouse's soaring timber roof"]
  ],
  "book-barn-niantic": [
    ["https://static.wixstatic.com/media/11a90b_21b637a7e6d44ab3abfb0f1c7f7e2317~mv2.jpg", "https://www.bookbarnniantic.com/thingstodo", "The Book Barn", "The Book Barn's wooded used-book compound in Niantic"],
    ["https://static.wixstatic.com/media/11a90b_03b288d70b25491591b636a2a15fcaef~mv2.jpg", "https://www.bookbarnniantic.com/thingstodo", "The Book Barn", "A garden and animal corner within The Book Barn compound"],
    ["https://static.wixstatic.com/media/11a90b_a3f06f66ad854a7d86a954da9cac7189~mv2.jpg", "https://www.bookbarnniantic.com/thingstodo", "The Book Barn", "One of The Book Barn's outdoor browsing and discovery spaces"]
  ],
  "tanger-riverhead": [
    ["https://assets.simpleviewinc.com/simpleview/image/upload/crm/newyorkstate/PedestrianPlazaT2_10DDA87A-2A50-41C4-A2C32760062688FD_714b6603-d746-a4d9-6dbf02de5a27f6f0.jpg", "https://www.iloveny.com/listing/tanger-outlet-center-riverhead/3589/", "I LOVE NY", "Tanger Riverhead's landscaped pedestrian outlet plaza"],
    ["https://www.createworldwide.com/assets/images/riverhead.jpg", "https://www.createworldwide.com/projects_4.php", "CREATE Worldwide", "The open-air shopping promenade at Tanger Riverhead"],
    ["https://createworldwide.com/assets/images/riverhead_3.jpg", "https://createworldwide.com/projects_4.php?project=3", "CREATE Worldwide", "Tanger Riverhead storefronts, pergolas and pedestrian hardscape"]
  ],
  "pumpkin-blaze": [
    ["https://hudsonvalley.org/wp-content/uploads/Blaze-2022_slide_ver2.jpg", "https://hudsonvalley.org/events/blaze/", "Historic Hudson Valley", "A firelit installation at the Great Jack O'Lantern Blaze"],
    ["https://hudsonvalley.org/wp-content/uploads/070725_HHV_Marketing_002-845x563.jpg", "https://hudsonvalley.org/events/blaze/", "Historic Hudson Valley", "Carved pumpkins and theatrical lighting along the Blaze trail at Van Cortlandt Manor"],
    ["https://uncoveringnewyork.com/wp-content/uploads/2022/10/Great-Jack-OLantern-Blaze-6871-683x1024.jpg", "https://uncoveringnewyork.com/great-jack-olantern-blaze-hudson-valley/", "Uncovering New York", "The Blaze's giant pumpkin Statue of Liberty installation"]
  ],
  "rockefeller-arts": [
    ["https://www.rbf.org/sites/default/files/styles/feature_2880x908/public/2022-11/DR-Center_terrace_Fred-Charles_002_2880x908.png?h=f708cdb8&itok=B3bdeOUU", "https://www.rbf.org/pocantico/historic-site-tours/dr-center", "Rockefeller Brothers Fund", "The David Rockefeller Creative Arts Center terrace and photovoltaic pergola"],
    ["https://architizer-prod.imgix.net/media/mediadata/uploads/171336387623705_DRCAC_Gallery.jpg?auto=format%2Ccompress&cs=strip&q=60&w=1680", "https://architizer.com/projects/david-rockefeller-creative-arts-center/", "Architizer / FXCollaborative", "The daylight-filled gallery inside the converted Orangerie"],
    ["https://cdn.savingplaces.org/2023/04/24/18/42/33/611/KykuitOrangerie_45092_crFrederickCharles.jpg", "https://savingplaces.org/stories/blending-preservation-and-sustainable-design-at-the-pocantico-center", "Frederick Charles for the National Trust", "The restored Orangerie's arched interior and flexible arts hall"]
  ],
  "pez-visitor-center": [
    ["https://us.pez.com/cdn/shop/files/2025_PEZ_Visitor_Center.jpg?v=1762371995&width=3200", "https://us.pez.com/pages/company-information", "PEZ Candy", "PEZ Visitor Center's candy-wrapper entrance in Orange, Connecticut"],
    ["https://lirp.cdn-website.com/08d31351/dms3rep/multi/opt/423178-9-worlds-largest-pez-dispenser-orange-640w.jpg", "https://www.worldrecordacademy.org/2023/4/worlds-largest-pez-dispenser-world-record-in-orange-connecticut-423178", "World Record Academy", "The working world's-largest PEZ dispenser inside the visitor center"],
    ["https://mommypoppins.com/sites/default/files/86/motorcycle.jpg?fit=crop&height=900&width=1200", "https://mommypoppins.com/connecticut-kids/special-occasions/a-sweet-visit-to-pez-visitor-center-in-orange", "Mommy Poppins", "The PEZ-branded custom motorcycle and memorabilia wall"]
  ],
  "mutter-museum": [
    ["https://collegeofphysicians.org/static/364374e4b28b0d65243a24acfac30acc/dac54/web_about_pageheader.jpg", "https://collegeofphysicians.org/about/", "College of Physicians of Philadelphia", "The historic College of Physicians facade housing the Mutter Museum"],
    ["https://collegeofphysicians.org/static/be66299e01733b050f8f04ee9fd543b7/c350f/web_garden_singlecallout.jpg", "https://collegeofphysicians.org/our-work/", "College of Physicians of Philadelphia", "The Benjamin Rush Medicinal Plant Garden beside the museum"],
    ["https://media.phillyvoice.com/media/images/9123_Mutter_Museum_Main.2e16d0ba.fill-1200x630-c0.jpg", "https://www.phillyvoice.com/m%C3%BCtter-museum-human-remains-postmortem-ethics-public/", "PhillyVoice", "The museum's two-level historic cabinet gallery; view human remains with dignity and follow the current photography policy"]
  ],
  "andalusia-estate": [
    ["https://andalusiapa.org/wp-content/uploads/2022/08/2286776314320551-dsc-8957-2.full-p-1080.jpeg", "https://andalusiapa.org/visit/", "Andalusia Historic House", "The estate's formal walled garden and rose arches"],
    ["https://assets.simpleviewinc.com/simpleview/image/upload/crm/bucks/20170502_165532_2FCEB6EA-7DF5-487F-9B7EC188165C983D_bf1b2eed-d3d8-4b45-b37ccba3a87b8a11.jpg", "https://www.visitbuckscounty.com/listing/andalusia-historic-house-gardens-and-arboretum/164/", "Visit Bucks County", "The Greek Revival Big House facing the Delaware River grounds"],
    ["https://assets.simpleviewinc.com/simpleview/image/upload/crm/bucks/VBC_-_Andalusia_Historic_House-75_gycjov_4888790E-D5C3-8E31-4293E168323587B7-48882ba3cdfc2c3_48888055-fb2e-beec-f9f288902b617f84.jpg", "https://www.visitbuckscounty.com/listing/andalusia-historic-house-gardens-and-arboretum/164/", "Visit Bucks County", "A long formal garden walk through Andalusia's arboretum landscape"]
  ],
  "metuchen-main-street": [
    ["https://townsquare.media/site/942/files/2023/03/attachment-Untitled-design-40.jpg", "https://wpst.com/this-nj-town-was-named-great-american-main-street-of-the-year/", "94.5 PST", "Metuchen's award-winning Main Street and small-business storefronts"],
    ["https://www.downtownnj.com/wp-content/uploads/2017/09/MAIN-STREET-WHITE-TREES.jpg", "https://www.downtownnj.com/metuchen-overnight-success/", "Downtown New Jersey", "Main Street in Metuchen beneath flowering street trees"],
    ["https://i0.wp.com/isaackremer.com/wp-content/uploads/2023/02/PXL_20230207_005259208.NIGHT_-scaled.jpg?fit=1200%2C675&ssl=1", "https://isaackremer.com/metuchen-national-bank-406-main-st-metuchen-new-jersey/", "Isaac Kremer", "Historic Main Street storefronts illuminated for an evening walk"]
  ],
  "baltimore-industry": [
    ["https://www.thebmi.org/wp-content/uploads/2024/03/Cannery-exhibit-by-Aaron-Clamage-scaled.jpg", "https://www.thebmi.org/exhibits/cannery/", "Aaron Clamage for Baltimore Museum of Industry", "The restored working-equipment cannery gallery"],
    ["https://www.thebmi.org/wp-content/uploads/2024/03/cannery-2-by-aaron-clamage-scaled.jpg", "https://www.thebmi.org/exhibits/cannery/", "Aaron Clamage for Baltimore Museum of Industry", "Original canning machinery and the child-labor interpretation"],
    ["https://explore.baltimoreheritage.org/files/fullsize/0d288eefd4fc1a37ad6e387d37fecdd1.jpg", "https://explore.baltimoreheritage.org/items/show/389", "Baltimore Heritage", "The belt-driven workshop machinery inside the former oyster cannery"]
  ],
  "barker-cartoon-museum": [
    ["https://s.hdnux.com/photos/73/73/33/15709907/4/rawImage.jpg", "https://www.thehour.com/wilton/article/Day-Tripping-Cartoon-museum-offers-trip-down-memory-lane-12987483.php", "Hearst Connecticut Media", "Dense cases of lunchboxes, toys and pop-culture characters at Barker Museum"],
    ["https://townsquare.media/site/677/files/2022/08/attachment-facebook-pic-01-1.jpg?q=75&w=1200", "https://i95rock.com/cheshire-ct-museum-is-a-unique-pop-culture-roadside-attraction/", "I-95 Rock", "Vintage lunchboxes, action figures and character memorabilia"],
    ["https://ctvisit.com/sites/default/files/styles/social_media_1200x630/public/bc%20hero%20image_0.jpg?itok=c6pjj1lV", "https://ctvisit.com/listings/barker-character-comic-cartoon-museum", "Connecticut Office of Tourism", "Barker Museum's colorful character and antique-toy collection"]
  ]  ,
  "uss-nautilus-museum": [
    ["https://ctvisit.com/sites/default/files/styles/social_media_1200x630/public/15111219528_73ce2b0bb2_o.jpg?itok=883mkjAU", "https://ctvisit.com/listings/historic-ship-nautilus-submarine-force-museum-0", "Connecticut Office of Tourism", "USS Nautilus (SSN-571) moored at the Submarine Force Museum pier in Groton"],
    ["https://www.thamesriverheritagepark.org/new/wp-content/uploads/2026/01/nautilus_museum_2026.jpg", "https://www.thamesriverheritagepark.org/submarine-force-museum/", "Thames River Heritage Park", "The Submarine Force Museum building and the Nautilus pier on the Thames River"],
    ["https://seahistory.org/wp-content/uploads/Submarine-Force-Museum-USS-Nautilus.jpg", "https://seahistory.org/museums-sites/uss-nautilus-submarine-force-museum/", "National Maritime Historical Society", "USS Nautilus, the world's first operational nuclear-powered submarine, underway"]
  ],
  "fire-island-lighthouse": [
    ["https://static.wixstatic.com/media/2c120d_d8e8efc2cd9c4357b9acbb73c2fef44a~mv2.jpg", "https://fireislandlighthouse.com/visit/", "Fire Island Lighthouse Preservation Society", "The Fire Island Lighthouse tower and keepers quarters above the dunes"],
    ["https://static.wixstatic.com/media/9bf8c5_ba1ded4dc9964a41a9544deec99c8b37~mv2.jpeg", "https://fireislandlighthouse.com/visit/", "Fire Island Lighthouse Preservation Society", "The barrier-beach boardwalk running through dune scrub toward the tower"],
    ["https://static.wixstatic.com/media/2c120d_5100dc9fd52943379511393355f50949~mv2.jpg", "https://fireislandlighthouse.com/visit/", "Fire Island Lighthouse Preservation Society", "Fire Island Inlet and the western barrier-island landscape from the air"]
  ],
  "revolution-rail-cape-may": [
    ["https://images.squarespace-cdn.com/content/v1/63d6550585aa7959f6c07186/085c4a6f-2ad4-47af-9855-bc27dbf28dde/RevRail+014.jpg", "https://www.revrail.com/cape-may-run", "Revolution Rail Co.", "The railbike fleet staged outside Cape May Station before a run"],
    ["https://images.squarespace-cdn.com/content/v1/63d6550585aa7959f6c07186/1cdf41e7-02ad-4492-b5b2-70c22db5a136/RevRail+030.jpg", "https://www.revrail.com/cape-may-run", "Revolution Rail Co.", "Riders pedalling railbikes through wildflower and migration habitat"],
    ["https://images.squarespace-cdn.com/content/v1/63d6550585aa7959f6c07186/6d3573aa-dae4-488f-965d-9e9fbce1f97b/RevRail+003.jpg", "https://www.revrail.com/cape-may-run", "Revolution Rail Co.", "The rail line crossing preserved Cape May marsh toward the canal"]
  ],
  "cape-may-lighthouse": [
    ["https://capemaymac.org/wp-content/uploads/2020/02/Lighthouse_horizontal-header_1500x700.png", "https://capemaymac.org/experience/cape-may-lighthouse/", "Cape May MAC", "The Cape May Lighthouse tower above Cape May Point State Park"],
    ["https://capemaymac.org/wp-content/uploads/2022/05/stairway-stars-600.jpg", "https://capemaymac.org/experience/cape-may-lighthouse/", "Cape May MAC", "The 199-step tower rising into a deep blue evening sky"],
    ["https://capemaymac.org/wp-content/uploads/2021/04/Full-Moon-Lighthouse-Climb-scaled-e1709860224109-600x600.jpg", "https://capemaymac.org/experience/cape-may-lighthouse/", "Cape May MAC", "The lit Cape May Lighthouse beam under a full moon"]
  ],
  "assateague-pony-kayak": [
    ["https://assateagueexplorer.com/wp-content/uploads/2022/03/assateague-kayak-tour-A32R2002-35kb.jpg", "https://assateagueexplorer.com/", "Assateague Explorer", "A guided tandem kayak paddling alongside wild ponies in the Assateague backwaters"],
    ["https://assateagueexplorer.com/wp-content/uploads/2022/03/assateague-ponies-and-lighthouse-MG-8865-2-70kb-900x468.jpg", "https://assateagueexplorer.com/", "Assateague Explorer", "Wild ponies in the shallows below the Assateague lighthouse"],
    ["https://assateagueexplorer.com/wp-content/uploads/2022/03/pony-cruise-IMG-2112-A-70kb-900x468.jpg", "https://assateagueexplorer.com/", "Assateague Explorer", "The operator's wildlife boat tour, the documented same-area fallback, viewing a pony band"]
  ],
  "kiptopeke-concrete-ships": [
    ["https://c1.staticflickr.com/1/942/41936587450_dd497400c0_z.jpg", "https://www.dcr.virginia.gov/state-parks/blog/kiptopekes-breakwater", "Virginia State Parks", "One of the nine WWII concrete ships forming the Kiptopeke breakwater"],
    ["https://c2.staticflickr.com/2/1837/43696973932_cc19ec4f3d_z.jpg", "https://www.dcr.virginia.gov/state-parks/blog/kiptopekes-breakwater", "Virginia State Parks", "The weathered bow of a concrete ship standing off the Kiptopeke beach"],
    ["https://live.staticflickr.com/65535/49084233983_f4e4b800c4_b.jpg", "https://www.dcr.virginia.gov/state-parks/blog/5-things-to-experience-at-kiptopeke-state-park", "Virginia State Parks", "Sunset over the concrete fleet and the Chesapeake migration corridor"]
  ],
  "richmond-capitol-ghost-tour": [
    ["https://www.hauntsofrichmond.com/wp-content/uploads/2026/03/virginia-state-capitol-haunted-capitol-hill-1024x768.jpeg", "https://hauntsofrichmond.com/", "Haunts of Richmond", "A Haunted Capitol Hill tour group on the Virginia State Capitol steps after dark"],
    ["https://www.hauntsofrichmond.com/wp-content/uploads/2026/03/virginia-state-capitol-1024x768.jpg", "https://hauntsofrichmond.com/", "Haunts of Richmond", "The Virginia State Capitol lit at night on the tour route"],
    ["https://www.hauntsofrichmond.com/wp-content/uploads/2026/01/monumentalchurch-1024x760.jpg", "https://hauntsofrichmond.com/", "Haunts of Richmond", "Monumental Church, built over the 1811 Richmond Theatre fire the tour recounts"]
  ],
  "neabsco-creek-boardwalk": [
    ["https://www.vaco.org/wp-content/uploads/2019/08/NeabscoCreekBoardwalk.jpg", "https://www.vaco.org/virginia-county/visit-prince-william-county-and-the-neabsco-creek-boardwalk/", "Virginia Association of Counties", "The signed entrance and first deck of the Neabsco Creek Boardwalk"],
    ["https://www.vaco.org/wp-content/uploads/2019/08/NeabscoCreekBoardwalk3.jpg", "https://www.vaco.org/virginia-county/visit-prince-william-county-and-the-neabsco-creek-boardwalk/", "Virginia Association of Counties", "The boardwalk curving out over the Neabsco Creek wetland"],
    ["https://assets.simpleviewinc.com/simpleview/image/upload/crm/pwmva/neabsco-crk-boardwalk-7-19-18-2-pwt-987b10085056a36_987b117a-5056-a36a-07ac50597bc58f5d.jpg", "https://www.visitpwc.com/listing/neabsco-creek-boardwalk/1648/", "Visit Prince William", "The 3,300-foot boardwalk crossing the marsh, seen from the air"]
  ],
  "maryland-renaissance-festival": [
    ["https://rennfest.com/wp-content/uploads/2026/03/Michael.Baker11-Knights-Engaging-First-Place-Best-Photo-1024x683.jpg", "https://rennfest.com/photos/", "Maryland Renaissance Festival", "Armoured knights engaging in the festival joust before the crowd"],
    ["https://rennfest.com/wp-content/uploads/2026/03/0518-mdrf-090625-LF-Third-Place-Best-Photo-1024x683.jpg", "https://rennfest.com/photos/", "Maryland Renaissance Festival", "A packed woodland stage inside the festival's English-village grounds"],
    ["https://rennfest.com/wp-content/uploads/2026/03/Eric.Harkleroad-Best-Photo4-Second-Place-Character.jpg", "https://rennfest.com/photos/", "Maryland Renaissance Festival", "A festival blacksmith working hot iron at the anvil"]
  ],
  "mullica-cedar-paddle": [
    ["https://www.pinelandsadventures.org/wp/wp-content/uploads/2026/04/Solo-Kayaker-Adventures.jpg", "https://www.pinelandsadventures.org/", "Pinelands Adventures", "A paddler on the narrow tea-coloured cedar water of the Mullica River"],
    ["https://www.pinelandsadventures.org/wp/wp-content/uploads/2026/04/Kayak-Slider-Image-web.jpg", "https://www.pinelandsadventures.org/", "Pinelands Adventures", "The operator's canoe and kayak fleet drawn up at the Atsion launch"],
    ["https://www.pinelandsadventures.org/wp/wp-content/uploads/2021/03/river-wetlands-aerial.jpg", "https://www.pinelandsadventures.org/", "Pinelands Adventures", "Pine Barrens river meanders and cedar wetlands from the air"]
  ],
  "schooner-argia": [
    ["https://www.argiamystic.com/App_Themes/ArgiaMystic/Images/Content/PublicSails_TopImage.jpg", "https://www.argiamystic.com/Argia_PublicSails.aspx", "Argia Mystic Cruises", "The schooner ARGIA under full sail with passengers aboard off Mystic"],
    ["https://ctvisit.com/sites/default/files/media/2025-04/Jack%20sailing%20past%20N%20Dumpling.jpg", "https://ctvisit.com/listings/argia-mystic-cruises", "Connecticut Office of Tourism", "Guests on ARGIA's deck as she sails past North Dumpling Light"],
    ["https://ctvisit.com/sites/default/files/media/2025-04/DJI_0256-crop1.jpg", "https://ctvisit.com/listings/argia-mystic-cruises", "Connecticut Office of Tourism", "ARGIA working to windward in protected Mystic waters, seen from above"]
  ]

};

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
}

async function download(url, destination) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 TripAdvisorRouteDataset/3.0" }, redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`response too small (${bytes.length} bytes)`);
  await writeFile(destination, bytes);
  return response.headers.get("content-type") || "image/jpeg";
}

async function main() {
  await mkdir(IMAGE_DIR, { recursive: true });
  const raw = JSON.parse(await readFile(RAW_PATH, "utf8"));
  for (const [placeId, entries] of Object.entries(groups)) {
    if (requestedIds.size && !requestedIds.has(placeId)) continue;
    const record = raw.places[placeId] || { query: placeId, geocode_candidates: [], selected_coordinate: null, image_candidates: [], selected_images: [] };
    const selected = [];
    for (const [index, [url, sourcePage, publisher, description]] of entries.entries()) {
      const extension = url.includes(".png") ? "png" : "jpg";
      const destination = path.join(IMAGE_DIR, `${placeId}-external-${index + 1}-${safeName(publisher)}.${extension}`);
      try {
        const mime = await download(url, destination);
        selected.push({
          title: `${placeId} curated exact-place image ${index + 1}`,
          mime, width: null, height: null, thumbnail_url: url, original_url: url,
          source_page: sourcePage, description, creator: publisher, credit: publisher,
          license: "External editorial image; reuse permission required", license_url: sourcePage,
          attribution_required: true, search_query: "curated exact-place web image",
          local_path: path.relative(ROOT, destination), review_status: "needs_visual_review",
          production_usable: false, rights_status: "permission-required-before-public-deployment"
        });
        console.log(`${placeId}: imported ${publisher}`);
      } catch (error) {
        console.warn(`${placeId}: failed ${publisher}: ${error.message}`);
      }
    }
    if (selected.length === 3) record.selected_images = selected;
    else console.warn(`${placeId}: keeping prior selection because only ${selected.length}/3 curated images downloaded.`);
    raw.places[placeId] = record;
    await writeFile(RAW_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
