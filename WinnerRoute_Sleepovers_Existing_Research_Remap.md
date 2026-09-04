# WINNER ROUTE — SLEEPOVER REMAP

**Phase:** Existing-project research only — no new lodging research added in this pass
**Winner-route travel window:** 2026-10-04 → 2026-10-15 departure
**Travelers:** 4 adults
**Cars:** 2 rental cars
**Research remap checked:** 2026-09-04
**Implementation intent:** Reuse the strongest sleepovers already researched by Route 01–09 agents, without inventing geographic matches or carrying an old exact-date price onto a different night.

> **Important:** `REPRICE_FOR_NEW_DATE` means the property itself is a valid prior-research carry-over, but the old agent priced it for another October 2026 night. The old price is preserved only as context and must not be displayed as the exact winner-route price.

## QUICK WIRING INDEX

| Wire key | Winner day | Night date | Required sleep anchor | Existing-research coverage | Normal / value carry-over | Budget carry-over | WTF carry-over | Implementation action |
|---|---:|---|---|---|---|---|---|---|
| winner-route-night-01 | 1 | 2026-10-04 | Newport, RI | **EXACT anchor + exact date** | The East Island Reserve Hotel | Harbor Base Pineapple Inn | Waterlily — floating Newport Harbor stay | Reuse |
| winner-route-night-02 | 2 | 2026-10-05 | New Haven, CT | **EXACT anchor + exact date** | New Haven Hotel | Motel 6 New Haven–Branford | Woodlands Cottage at Winvian Farm | Reuse |
| winner-route-night-03 | 3 | 2026-10-06 | Central Valley, NY | **GAP** | — | — | — | New research required |
| winner-route-night-04 | 4 | 2026-10-07 | Parsippany, NJ | **GAP** | — | — | — | New research required |
| winner-route-night-05 | 5 | 2026-10-08 | Hershey, PA | **GAP** | — | — | — | New research required |
| winner-route-night-06 | 6 | 2026-10-09 | Washington, DC | **EXACT anchor; old research date differs** | Fairfield Inn & Suites Washington, DC | Gateway Hotel | C&O Canal Lockhouse 10 | Reuse property; **REPRICE Oct 9** |
| winner-route-night-07 | 7 | 2026-10-10 | Ashland, VA | **Exact date; Richmond-area carry-over** | Hampton Inn Richmond West Innsbrook | Motel 6 Sandston, VA – Richmond | Trailside Treehouse, Richmond | Reuse only if Richmond-area sleep is acceptable |
| winner-route-night-08 | 8 | 2026-10-11 | White Marsh, MD | **Nearby-only old set: Annapolis** | DoubleTree Annapolis | Best Western Annapolis | Kathleen Marie — 43-ft Hatteras Yacht | Do **not** wire as default; exact White Marsh research still needed |
| winner-route-night-09 | 9 | 2026-10-12 | Robbinsville, NJ | **GAP at exact anchor; nearby NJ fallbacks exist** | Garden Executive Hotel, South Plainfield (fallback) | Motel 6 East Brunswick (fallback) | No exact-anchor prior WTF | New research required; preserve fallbacks |
| winner-route-night-10 | 10 | 2026-10-13 | New Haven, CT | **Strong reusable CT inventory** | New Haven Hotel (**reprice**) / Circle Hotel Fairfield exact-date backup | Red Roof Inn Milford – New Haven | Winvian Farm Treehouse; Greens Ledge Lighthouse dream swap | Reuse with route-impact flags |
| winner-route-night-11 | 11 | 2026-10-14 | Boston, MA | **GAP** | — | — | — | New research required |

## COVERAGE VERDICT

- **2 nights are clean exact carry-overs:** Newport Oct 4 and New Haven Oct 5.
- **3 more nights have strong reusable property inventory:** Washington DC Oct 9, Ashland/Richmond Oct 10, and New Haven Oct 13.
- **White Marsh Oct 11 has only a geographically inferior Annapolis set** and should remain unfilled until exact-area research is done.
- **5 true exact-anchor holes remain:** Central Valley, Parsippany, Hershey, Robbinsville, and Boston.
- No old exact-date price is silently moved to a different date.

---

# NIGHT 01 — 2026-10-04 — NEWPORT, RI

**Winner route context:** Level99 Providence → optional Newport Car Museum → sleep Newport → next morning Newport activities.

### NORMAL / VALUE — The East Island Reserve Hotel, Middletown
- **Prior source:** Route 01 sleepover layer
- **Prior researched date:** 2026-10-04 — **same date**
- **Price for 4:** ~**$233 group**
- **Per person:** ~**$58**
- **Status:** Exact-date 4-adult Expedia search was checked 2026-09-01.
- **Route fit:** Strong Newport/Middletown base.
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

### EXTREME BUDGET — Harbor Base Pineapple Inn, Newport area
- **Prior source:** Route 01 sleepover layer
- **Prior researched date:** 2026-10-04 — **same date**
- **Price for 4:** ~**$102 group**
- **Per person:** ~**$26**
- **Status:** Exact-date 4-adult Expedia search was checked 2026-09-01.
- **Route fit:** Strong low-cost Newport sleep.
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

### 🟢 🤯 WTF — Waterlily, floating stay in Newport Harbor
- **Prior source:** Route 01
- **What it is:** Private boat stay moored in Newport Harbor near Fort Adams; researched as sleeping four across two bedrooms with multiple decks and a swim platform.
- **WTF score:** **4.5/5**
- **Price:** Exact Oct 4 rate was **CALENDAR-GATED**.
- **Route fit:** Excellent.
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

### 🔴 DREAM SWAP — Rose Island Lighthouse
- **WTF score:** **5.0/5**
- **Why extraordinary:** Boat-only access to an off-grid 18-acre island with a working lighthouse.
- **Conflict:** Prior research found the overnight transfer boat around noon, which conflicts with the current Day 1 schedule.
- **Winner-route decision:** Preserve as dream swap, not default lodging.

---

# NIGHT 02 — 2026-10-05 — NEW HAVEN, CT

**Winner route context:** The Breakers → IT Adventure Ropes → Beinecke Library ends ~18:25 → sleep New Haven → Woodbury Common next day.

### NORMAL / VALUE — New Haven Hotel
- **Prior source:** Route 01
- **Prior researched date:** 2026-10-05 — **same date**
- **Price for 4:** ~**$215 group**
- **Per person:** ~**$54**
- **Status:** Exact-date 4-adult Expedia search checked 2026-09-01.
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

### EXTREME BUDGET — Motel 6 New Haven–Branford
- **Prior source:** Route 01
- **Prior researched date:** 2026-10-05 — **same date**
- **Price for 4:** ~**$82 group**
- **Per person:** ~**$21**
- **Status:** Exact-date 4-adult Expedia search checked 2026-09-01.
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

### 🟠 🤯 WTF — Woodlands Cottage at Winvian Farm, Morris
- **Prior source:** Route 01
- **What it is:** ~1,050-sq-ft forest cottage on Winvian's Litchfield Hills estate; researched for four, with tree-integrated interior and an indoor-waterfall bathroom.
- **WTF score:** **4.25/5**
- **Price status:** **DIRECT QUOTE REQUIRED**; prior context noted Winvian rates starting around $699/night, not an exact Woodlands Oct 5 quote.
- **Route fit:** Orange detour from New Haven, but the northwest movement is directionally useful toward Woodbury the following day.
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

---

# NIGHT 03 — 2026-10-06 — CENTRAL VALLEY, NY

## 🔴 EXISTING-RESEARCH GAP

No completed prior sleepover layer was found with a defensible three-tier set for the **Central Valley / Woodbury Common** sleep anchor on Oct 6.

**Do not substitute:** Route 01's Oct 6 NYC lodging. The winner route intentionally stops in Central Valley, so wiring Manhattan lodging here would change the route.

```json
{
  "wire_key": "winner-route-night-03",
  "night_date": "2026-10-06",
  "sleep_anchor": "Central Valley, NY",
  "existing_research_status": "GAP",
  "requires_new_research": true
}
```

---

# NIGHT 04 — 2026-10-07 — PARSIPPANY, NJ

## 🔴 EXISTING-RESEARCH GAP

No completed prior sleepover layer surfaced a defensible Parsippany three-tier set for Oct 7.

Nearby NYC, Metuchen, Bensalem and Poconos properties were researched on other routes, but none should be silently relabeled as Parsippany lodging.

```json
{
  "wire_key": "winner-route-night-04",
  "night_date": "2026-10-07",
  "sleep_anchor": "Parsippany, NJ",
  "existing_research_status": "GAP",
  "requires_new_research": true
}
```

---

# NIGHT 05 — 2026-10-08 — HERSHEY, PA

## 🔴 EXISTING-RESEARCH GAP

Hershey appears in other route activity research, but the existing sleepover handoffs do **not** contain a complete Hershey Oct 8 normal/budget/WTF set.

Do not reuse Harrisburg, Lancaster, Bethlehem or Winchester lodging merely because those cities were researched on nearby Pennsylvania routes.

```json
{
  "wire_key": "winner-route-night-05",
  "night_date": "2026-10-08",
  "sleep_anchor": "Hershey, PA",
  "existing_research_status": "GAP",
  "requires_new_research": true
}
```

---

# NIGHT 06 — 2026-10-09 — WASHINGTON, DC

**Winner route context:** Hershey → Harrisburg → Frederick / Crane Manor → Washington → sleep DC → O Museum next day.

Route 01 researched this exact DC lodging trio for **Oct 10**, not Oct 9. The properties are strong carry-overs; the conventional prices must be refreshed for the winner-route date.

### NORMAL / VALUE — Fairfield Inn & Suites Washington, DC
- **Prior source:** Route 01
- **Old researched date:** 2026-10-10
- **Old price context:** ~**$259 group / ~$65 pp**
- **Winner-route price status:** **REPRICE_FOR_NEW_DATE — Oct 9→10**
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

### EXTREME BUDGET — Gateway Hotel
- **Prior source:** Route 01
- **Old researched date:** 2026-10-10
- **Old price context:** ~**$88 group / ~$22 pp**
- **Winner-route price status:** **REPRICE_FOR_NEW_DATE — Oct 9→10**
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

### 🟢 🤯 WTF — C&O Canal Lockhouse 10, Cabin John
- **Prior source:** Route 01
- **What it is:** Actual rehabilitated canal lockkeeper's house beside the C&O towpath, sleeping up to eight with electricity, HVAC, indoor plumbing, shower and kitchen.
- **WTF score:** **4.5/5**
- **Published price model in prior research:** $175/night + $80 cleaning ≈ **$255 group / ~$64 pp**.
- **Winner-route booking status:** Exact **Oct 9** calendar availability must be checked; do not treat the old Oct 10 gate as confirmation.
- **Route fit:** Excellent for a Washington night.
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

---

# NIGHT 07 — 2026-10-10 — ASHLAND, VA

**Winner route context:** Washington → Richmond → Hotel Greene → planned Ashland sleep → northbound next day.

The existing research is for **Richmond on the exact same night**. This is reusable inventory, but it is not an exact Ashland-anchor set.

### NORMAL / VALUE — Hampton Inn Richmond West Innsbrook
- **Prior sources:** Routes 03 / 08
- **Location:** 10800 W Broad St, Glen Allen, VA 23060
- **Date:** 2026-10-10 — **exact winner-route date**
- **Capacity:** 4 adults — 2 queen beds
- **Price for 4:** **$133**
- **Per person:** **$33.25**
- **Guest rating:** ~8.2/10 in prior exact-date research
- **Parking:** available; prior handoff says confirm both rental-car registrations
- **Booking status:** four-adult configuration/date verified in Route 03; two-car detail remains a confirmation item
- **booking_url_exact_dates:** https://www.expedia.com/.h1326.Hotel-Information?chkin=2026-10-10&chkout=2026-10-11&rm1=a4&SEOCID=U.HOTEL.OPENAI-MICROAPP
- **room/source URL:** https://www.booking.com/hotel/us/hampton-inn-richmond-west.html
- **Winner-route warning:** Richmond/Glen Allen inventory, not an exact Ashland property. Route engine should verify the Hotel Greene → hotel → northbound geometry before wiring.

### EXTREME BUDGET — Motel 6 Sandston, VA – Richmond
- **Location:** 5704 Williamsburg Rd, Sandston, VA 23150
- **Date:** 2026-10-10 — **exact date**
- **Prior price for 4:** **$81 / $20.25 pp**
- **Room:** two-full-bed inventory was found; one handoff called it verified, a later Route 08 handoff conservatively marked the exact selected rate/config pairing `CONFIGURATION_NOT_VERIFIED`.
- **Guest signal:** mixed; re-read latest cleanliness/smoke reviews before purchase.
- **booking_url:** https://www.studio6.com/property/motel-sandston-virginia-us-293591/
- **booking_url_exact_dates:** https://www.expedia.com/.h996383.Hotel-Information?chkin=2026-10-10&chkout=2026-10-11&rm1=a4&SEOCID=U.HOTEL.OPENAI-MICROAPP
- **Winner-route warning:** geographically less aligned with an Ashland sleep than a north-Richmond hotel.

### 🟠 🤯 WTF — Trailside Treehouse, Richmond
- **Location:** 5005 Riverside Dr, Richmond, VA 23225
- **What it is:** Genuine architect-designed two-story treehouse over a wooded James River gully.
- **Capacity:** prior host research supports 4 adults; Route 03 notes sleeping for six in the treehouse.
- **WTF score:** **4.75–4.8/5** across the two prior route handoffs.
- **Price:** **CALENDAR-GATED** exact Oct 10 four-adult total.
- **Parking:** host explicitly provides **2 driveway spaces**.
- **October:** sleeping level has climate control; private bathroom/lounge is in host-home basement.
- **booking_url:** https://www.trailsidetreehouse.com/book-now
- **Airbnb:** https://www.airbnb.com/rooms/20724950
- **Winner-route impact:** **ORANGE** because the new route intends to sleep in Ashland after Hotel Greene. This stay pulls the overnight back into Richmond instead of completing the northbound reposition.

---

# NIGHT 08 — 2026-10-11 — WHITE MARSH, MD

## 🟠 PARTIAL COVERAGE ONLY — ANNAPOLIS SET

No exact White Marsh sleepover handoff was found. Route 08/03 researched a complete **Annapolis** trio for the **same Oct 11 night**, but Annapolis is south of the winner-route intended White Marsh position.

**Recommendation for coding:** Do **not** wire this trio as the default Night 8. Keep it as existing-research fallback inventory while exact White Marsh / Baltimore-area research is performed.

### Existing fallback NORMAL — DoubleTree by Hilton Hotel Annapolis
- **Date:** exact Oct 11
- **Capacity:** 4 adults — 2 queen beds
- **Price for 4:** **$154 / $38.50 pp**
- **Guest rating:** 8.8/10 in prior exact-date result
- **Parking:** free onsite published
- **Status:** capacity/date verified; age policy recheck
- **Winner-route impact:** **ROUTE-INTERFERING vs White Marsh** because it backtracks south.

### Existing fallback BUDGET — Best Western Annapolis
- **Date:** exact Oct 11
- **Capacity:** 4 adults — 2 queen beds
- **Price for 4:** **$130 / $32.50 pp**
- **Guest rating:** 7.8/10
- **Parking:** free onsite published
- **Winner-route impact:** same southbound backtrack problem.

### Existing fallback 🤯 WTF — Kathleen Marie, 43-ft Hatteras Yacht
- **Location:** Eastport / Annapolis
- **Capacity:** 4 adults — 2 bedrooms / 2 baths
- **WTF score:** **4.65/5**
- **What it is:** Docked 43-ft Hatteras motor yacht with galley, heat/AC and hot water.
- **Price:** exact Oct 11 quote required.
- **Parking:** second overnight vehicle space must be confirmed.
- **booking_url:** https://www.vrbo.com/en-ca/cottage-rental/p1753807vb
- **Winner-route impact:** **RED/ORANGE** for this winner route; strong stay, wrong overnight direction.

```json
{
  "wire_key": "winner-route-night-08",
  "night_date": "2026-10-11",
  "sleep_anchor": "White Marsh, MD",
  "existing_research_status": "PARTIAL_NEARBY_ONLY",
  "default_should_remain_unwired": true,
  "requires_new_research": true
}
```

---

# NIGHT 09 — 2026-10-12 — ROBBINSVILLE, NJ

## 🔴 EXACT-ANCHOR GAP — PRESERVE NEARBY NJ FALLBACKS

No completed Route 10 sleepover layer for Hamilton/Robbinsville was found in the project inventory, even though that geography appears in the Route 10 itinerary. Therefore there is no honest old Robbinsville normal/budget/WTF trio to reuse.

Two exact-date Oct 12 fallbacks from Route 03 are worth preserving, but they should not be presented as Robbinsville lodging without a route check.

### Nearby fallback NORMAL — The Garden Executive Hotel, South Plainfield
- **Address:** 101 New World Way, South Plainfield, NJ 07080
- **Date:** exact Oct 12
- **Capacity:** 4 adults — Standard Two Doubles
- **Price for 4:** **$100 / $25 pp**
- **Guest rating:** 8.4/10
- **Parking:** free onsite advertised; confirm both cars
- **booking_url_exact_dates:** https://www.expedia.com/.h24399.Hotel-Information?chkin=2026-10-12&chkout=2026-10-13&rm1=a4&SEOCID=U.HOTEL.OPENAI-MICROAPP
- **room source:** https://www.gardenexecutivehotel.com/rooms/standard-two-doubles-non-smoking
- **Winner-route status:** fallback only; it pulls the sleep north of Robbinsville.

### Nearby fallback BUDGET — Motel 6 East Brunswick, NJ
- **Address:** 244 Route 18, East Brunswick, NJ 08816
- **Date:** exact Oct 12
- **Capacity:** 4 adults — 2 full beds in prior research
- **Price for 4:** **$96 / $24 pp**
- **Guest rating:** 7.6/10 exact-search signal
- **Parking:** free advertised; confirm two cars
- **Winner-route status:** fallback only.

### WTF
No previously researched true WTF stay was found that cleanly maps to the exact Robbinsville anchor. Do not force the Bensalem barn-suite near-match or a farther Poconos stay into this slot.

---

# NIGHT 10 — 2026-10-13 — NEW HAVEN, CT

This night has excellent reusable Connecticut inventory, but the cleanest implementation mixes **exact-anchor prior research** and **exact-date nearby research**.

### NORMAL / VALUE — New Haven Hotel — exact anchor, REPRICE
- **Prior source:** Route 01 New Haven set
- **Old researched date:** Oct 5
- **Old price context:** ~$215 group / ~$54 pp
- **Winner-route date:** Oct 13
- **Status:** **REPRICE_FOR_NEW_DATE**
- **Why retain:** Exact New Haven sleep location is preferable to moving the normal base west solely to preserve an old price.
- **booking_url:** `NOT_SURFACED_IN_EXISTING_ROUTE01_ARTIFACT`

### Exact-date NORMAL backup — The Circle Hotel Fairfield
- **Address:** 417 Post Rd, Fairfield, CT 06824
- **Date:** exact Oct 13
- **Capacity:** 4 adults — 2 queen beds
- **Price for 4:** **$156 / $39 pp**
- **Guest rating:** 9.0/10
- **Parking:** free advertised; confirm two vehicles
- **booking_url_exact_dates:** https://www.expedia.com/.h9816438.Hotel-Information?chkin=2026-10-13&chkout=2026-10-14&rm1=a4&SEOCID=U.HOTEL.OPENAI-MICROAPP
- **Warning:** west of New Haven; less exact than the intended sleep anchor.

### EXTREME BUDGET — Red Roof Inn Milford – New Haven
- **Address:** 10 Rowe Ave, Milford, CT 06460
- **Date:** exact Oct 13
- **Capacity:** 4 adults — 2 full/double beds
- **Price for 4:** **$114 / $28.50 pp**
- **Guest rating:** 7.2/10
- **Parking:** free onsite self-parking
- **Booking status:** BOOKING_READY in Route 08 handoff, with minimum check-in age still to confirm
- **booking_url_exact_dates:** https://www.expedia.com/.h7188.Hotel-Information?chkin=2026-10-13&chkout=2026-10-14&rm1=a4&SEOCID=U.HOTEL.OPENAI-MICROAPP
- **Why this maps well:** Milford is immediately in the New Haven corridor and the old price is already for the correct winner-route night.

### 🟠 🤯 WTF — Winvian Farm Treehouse Cottage, Morris
- **Prior exact-date context:** researched for Oct 13 by Route 03/05/09.
- **What it is:** Dedicated two-story luxury treehouse suspended roughly 35 ft in the Litchfield Hills canopy.
- **Capacity:** max 4; prior research describes 1 king + sofa bed / four-person unit depending on source version.
- **WTF score:** **4.75–5.0/5** across route-agent evaluations.
- **Price:** direct quote / exact Oct 13 total required; prior context showed very premium pricing, not a booking-final exact quote.
- **booking_url:** https://www.winvian.com/rooms/treehouse/
- **Route impact:** **ORANGE** — inland detour from New Haven, though it can be directionally less bad than a western-Connecticut stay because Day 11 moves north toward Massachusetts.

### 🔴 DREAM SWAP — Greens Ledge Lighthouse
- **What it is:** Active seven-floor cast-iron offshore lighthouse one mile from shore; guests sleep inside the lighthouse on its tiny island.
- **WTF score:** **5.0/5** in Route 08 research.
- **Capacity:** up to 6; prior research records 3 bedrooms / 5 beds / 2 baths.
- **Published context:** from roughly **$3,500 group / $875 pp** for four in the prior handoff; exact Oct 13 availability/transfer logistics still need checking.
- **Route impact:** **RED** for New Haven because it pulls the group west and introduces boat-transfer/two-car parking logistics before an east/north Day 11.

---

# NIGHT 11 — 2026-10-14 — BOSTON, MA

## 🔴 EXISTING-RESEARCH GAP

The original route agents generally treated Oct 14 as the return-to-Boston/end day, so their lodging layers stop after the Oct 13 overnight. Your winner route adds a **Boston hotel on Oct 14 → Logan departure Oct 15**, creating a genuinely new lodging night.

```json
{
  "wire_key": "winner-route-night-11",
  "night_date": "2026-10-14",
  "sleep_anchor": "Boston, MA",
  "next_day": "Logan Airport departure — 2026-10-15",
  "existing_research_status": "GAP",
  "requires_new_research": true
}
```

---

# EXISTING-RESEARCH REUSE SUMMARY FOR CODING AGENT

## Safe to wire now as prior-research candidates

1. **Oct 4 Newport** — East Island Reserve / Pineapple Inn / Waterlily.
2. **Oct 5 New Haven** — New Haven Hotel / Motel 6 Branford / Winvian Woodlands.
3. **Oct 9 Washington DC** — Fairfield Inn / Gateway Hotel / Lockhouse 10, but **all exact-date price/availability fields must be refreshed to Oct 9**.
4. **Oct 10 Ashland/Richmond** — Hampton Innsbrook / Motel 6 Sandston / Trailside Treehouse, with an explicit `sleep_anchor_mismatch` because these are Richmond-area choices.
5. **Oct 13 New Haven** — New Haven Hotel reprice, exact-date Red Roof Milford, Winvian Treehouse; Circle Hotel Fairfield as exact-date normal backup; Greens Ledge as red dream swap.

## Do not wire as defaults yet

- **Oct 6 Central Valley** — no old exact set.
- **Oct 7 Parsippany** — no old exact set.
- **Oct 8 Hershey** — no old exact set.
- **Oct 11 White Marsh** — Annapolis inventory exists but is the wrong direction.
- **Oct 12 Robbinsville** — South Plainfield / East Brunswick are only fallbacks, not anchor-perfect.
- **Oct 14 Boston** — new night not researched in the original 10-night layers.

## New-research queue after old inventory is exhausted

1. Central Valley, NY — Oct 6
2. Parsippany, NJ — Oct 7
3. Hershey, PA — Oct 8
4. White Marsh / Baltimore northeast, MD — Oct 11
5. Robbinsville / Hamilton / Princeton, NJ — Oct 12
6. Boston / Logan-compatible, MA — Oct 14

That is the complete gap list. New research should be limited to those six targets rather than reopening nights already covered well by the prior agents.
