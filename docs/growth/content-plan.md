# Leo Realty — Programmatic SEO Content Plan

**Target:** ~550 pages across 10 clusters, each anchored to a real high-volume Miami-area search pattern. Production timeline: 4-8 weeks at sustainable pace.

**Methodology source:** `~/.claude/skills/marketing-skills/skills/programmatic-seo/SKILL.md` — 12 playbooks. This plan uses 5 of them: Locations, Personas, Comparisons, Glossary, Profiles.

**Content rules** (from the skill, non-negotiable):
1. Every page must have a unique data hook (a stat, calc, school list, demographic — not just rephrased intro text)
2. Every page targets a real search intent, not invented topics
3. Subfolder URLs only (consolidates domain authority)
4. Genuine utility for a human reader — not doorway pages

---

## Cluster 1 — Neighborhood Guides (50 pages)

**Pattern:** `/neighborhoods/[slug]` — already shipped 8, expand to 50.

**Search intent:** "homes for sale [city]", "[city] real estate", "best neighborhoods Miami", "moving to [city]"

**Existing 8** (already live): North Miami Beach, Miami Beach, Brickell, Aventura, Coral Gables, Doral, Hollywood, Pembroke Pines

**Add 42 more, prioritized by Miami-Dade/Broward search volume:**

Miami-Dade (high vol):
- Wynwood, Edgewater, Downtown Miami, Coconut Grove, Pinecrest, Palmetto Bay, Cutler Bay, South Miami, Kendall, Westchester, West Kendall, Hialeah, Miami Lakes, Miami Springs, Bay Harbor Islands, Surfside, Bal Harbour, Sunny Isles Beach, Key Biscayne, Coral Way, Little Havana, Little Haiti, Liberty City, Allapattah, Doral, Fontainebleau, Olympia Heights, Tamiami

Broward (high vol):
- Fort Lauderdale, Plantation, Sunrise, Davie, Weston, Coral Springs, Cooper City, Pompano Beach, Deerfield Beach, Boca Raton (PBC), Tamarac, Lauderhill, Hallandale Beach

Palm Beach (Leo Realty serves):
- West Palm Beach, Boynton Beach, Delray Beach, Wellington, Royal Palm Beach

**Per-page unique hooks:**
- ZIP codes (verifiable: USPS data)
- Geo coordinates (already in lib/neighborhoods.ts)
- Median home price (Zillow Home Value Index — public, attributed)
- Top-rated schools (GreatSchools.org — public, attributed)
- MLS listings filtered to that city (live, dynamic)
- Place JSON-LD for AI extraction

---

## Cluster 2 — Loan Program × Neighborhood Matrix (210 pages)

**Pattern:** `/loan-programs/[program]/[city]` — 7 programs × 30 high-priority neighborhoods

**Search intent:** "FHA loans Miami Beach", "VA loans Brickell", "Hometown Heroes Pembroke Pines"

**Programs:** FHA, VA, USDA, Conventional, DSCR, Hometown Heroes, First-Time Buyer

**Per-page unique hooks:**
- Actual HUD FHA loan limits for that ZIP (HUD has a public lookup API)
- VA county loan limits (VA.gov public data)
- Example monthly payment calculation at the median home price for that city × current rate
- Eligibility checklist specific to the program × city combo
- Local KLE Mortgage loan originator handling that area

**Skip combinations that don't make sense** (e.g., Hometown Heroes only matters in Florida cities, USDA only for rural/suburban — Wynwood doesn't qualify as USDA territory). Realistic count: ~180 pages.

---

## Cluster 3 — First-Time Buyer Guides (20 pages)

**Pattern:** `/guides/first-time-buyer/[city]`

**Search intent:** "first-time homebuyer guide [city]", "buying first home in Miami"

**Top 20 cities:** Miami, Miami Beach, Brickell, Coral Gables, Aventura, Doral, Hialeah, Pembroke Pines, Hollywood, Fort Lauderdale, Plantation, Coral Springs, Boca Raton, North Miami Beach, Cutler Bay, Pinecrest, Kendall, Sunrise, Davie, West Palm Beach

**Per-page unique hooks:**
- Median home price + median income for that city (Census API — free, attributed)
- "How much house you can afford" calculator pre-filled for that city's median income
- Down payment assistance programs available in that county
- Closing cost estimate specific to the county
- Top 3 KLE Mortgage programs that fit first-time buyers in that city

---

## Cluster 4 — Seller Guides (20 pages)

**Pattern:** `/guides/selling/[city]` — same 20 cities

**Search intent:** "selling home in [city]", "best realtor [city]", "how to sell my home Miami"

**Per-page unique hooks:**
- Average days on market for that city (MLS-derived, dynamic)
- Sale-to-list-price ratio for that city
- MR 2% commission savings calculation at the city's median price (vs 6% baseline)
- Recent sold comps in that city (MLS)
- Seasonal selling patterns specific to that submarket

---

## Cluster 5 — Investment/Rental Guides (15 pages)

**Pattern:** `/guides/investment/[city]` — top 15 investment-active markets

**Search intent:** "[city] investment property", "Miami rental property guide", "DSCR loan [city]"

**Top 15 investment markets:** Brickell, Wynwood, Edgewater, Miami Beach, Sunny Isles, Aventura, Doral, Hialeah, Hollywood, Fort Lauderdale, Pompano Beach, Cutler Bay, West Palm Beach, Boynton Beach, Plantation

**Per-page unique hooks:**
- Average rental yield for that city
- Average cap rate
- DSCR loan eligibility example with that city's typical numbers
- Short-term-rental regulations (varies by city — some Miami Beach addresses prohibit Airbnb, some don't)
- 1031-exchange properties that match that city's profile

---

## Cluster 6 — School-Zone Pages (50 pages)

**Pattern:** `/homes-near/[school-slug]`

**Search intent:** "homes near [school name]" — families search this aggressively

**Top schools:** Top 50 Miami-Dade + Broward elementary, middle, high schools by GreatSchools rating. Including:
- Aventura Charter Elementary
- Pinecrest Glades Academy
- Doral Charter Elementary
- Coral Reef Senior High
- Cypress Bay High School
- Pinecrest Preparatory
- David Lawrence Jr. K-8 Center
- Plantation Park Elementary
- Western High School
- Cooper City High School
- (and 40 more)

**Per-page unique hooks:**
- School rating + grade range + enrollment (GreatSchools — public)
- School attendance zone boundaries (Miami-Dade Public Schools data)
- MLS listings inside the attendance zone
- Median home price inside that zone (Zillow)
- Place JSON-LD with school + nearby ZIP data

---

## Cluster 7 — Comparison Pages (25 pages)

**Pattern:** `/compare/[a]-vs-[b]`

**Search intent:** "X vs Y" — a top-5 pSEO playbook pattern, very high commercial intent

**Combinations:**
- City vs City (15 pages): Brickell vs Miami Beach, Miami Beach vs Sunny Isles, Aventura vs Bal Harbour, Coral Gables vs Pinecrest, Hialeah vs Doral, Plantation vs Davie, Coral Springs vs Parkland, Boca Raton vs Delray Beach, Hollywood vs Fort Lauderdale, Pembroke Pines vs Weston, Kendall vs Pinecrest, Wynwood vs Edgewater, Coconut Grove vs Coral Gables, Fort Lauderdale vs Miami, Sunny Isles vs Aventura
- Loan vs Loan (5): FHA vs Conventional, VA vs FHA, USDA vs Conventional, Hometown Heroes vs FHA, DSCR vs Conventional Investment
- Strategy vs Strategy (5): Buying vs Renting in Miami 2026, Condo vs Townhouse vs Single-Family, Pre-construction vs Existing, 15-year vs 30-year mortgage, ARM vs Fixed-rate

**Per-page unique hooks:**
- Side-by-side comparison table (median price, schools, walk score, days on market, commute time)
- Pros/cons specific to that pair
- Buyer profile fit ("better for [type] buyer")

---

## Cluster 8 — Glossary "What Is" Pages (60 pages)

**Pattern:** `/glossary/[term]`

**Search intent:** Definitional queries — high AI Overview / ChatGPT citation rate. These get cited because they're concise authoritative answers.

**60 terms, prioritized by Florida real-estate-specific search:**

Mortgage/financing (20):
- What is MR 2% commission, FHA loan, VA loan, USDA loan, DSCR loan, conventional loan, jumbo loan, NMLS, PMI, escrow, earnest money, closing costs, title insurance, points, ARM, debt-to-income ratio, pre-approval, pre-qualification, mortgage rate lock, amortization

Process/transaction (15):
- What is closing day, due diligence, appraisal contingency, inspection contingency, MLS, contingencies, contingent, pending, sold, under contract, escalation clause, seller concessions, days on market, sale-to-list-price ratio, walk-through

Florida-specific (10):
- What is the Florida Hometown Heroes program, Save Our Homes amendment, homestead exemption, HOA in Florida, condo association, Florida property tax cap, hurricane insurance Florida, flood zone X/AE/VE, CDD fees, Chapter 718 condo

Investment (8):
- What is cap rate, cash-on-cash return, 1031 exchange, GRM, NOI, DSCR (term), short-term rental, long-term rental

Roles/parties (7):
- What is a Realtor, broker, listing agent, buyer's agent, dual agency, transaction broker, escrow agent

**Per-page unique hooks:**
- Direct definition in first paragraph (the AI extract target)
- 2-3 example scenarios specific to Miami
- FAQ schema for AI citation
- Internal links to Leo Realty's relevant page

---

## Cluster 9 — Process Guides (15 pages)

**Pattern:** `/guides/[process]`

**Search intent:** "how to [process]", "step by step [process] Florida"

**Topics:**
1. How to buy a home in Florida — step by step
2. How to sell your home in Miami — full timeline
3. How to apply for a Hometown Heroes mortgage
4. How to qualify for an FHA loan in Florida
5. How to get pre-approved for a mortgage
6. Closing costs in Miami-Dade County explained
7. Closing costs in Broward County explained
8. How a 1031 exchange works in Florida
9. How to choose a Realtor in Miami
10. How to negotiate with a seller in Miami's market
11. How to win a bidding war in South Florida
12. How to determine your home's value
13. The Florida home inspection process
14. The Florida title insurance process
15. What to expect at a Florida closing

---

## Cluster 10 — Multilingual Long-tail (12 pages)

**Pattern:** Native-language pages targeting bilingual searchers

**French (6 pages):**
- Realtor parlant français à Miami
- Acheter un condo à Miami pour Canadiens / Européens
- Programme Hometown Heroes en français
- Investir dans l'immobilier de Miami en tant qu'étranger
- Quartiers francophones de Miami
- Guide d'achat immobilier en Floride pour francophones

**Haitian Creole (6 pages):**
- Ajan imobilye ki pale Kreyòl nan Miami
- Achte premye kay ou nan North Miami Beach (gid Kreyòl)
- Pwogram Hometown Heroes pou Ayisyen-Ameriken
- Komisyon MR 2% — kijan li ekonomize lajan
- Katye Ayisyen nan Sid Florid (Little Haiti, North Miami)
- Sa pou konnen anvan w achte yon kay nan Miami

---

## Total — 547 Pages

| Cluster | Count | Priority |
|---|---|---|
| 1. Neighborhoods | 50 | High (existing pattern, easy to extend) |
| 2. Loan × Neighborhood matrix | 180 | High (commercial intent) |
| 3. First-Time Buyer guides | 20 | High (high conversion) |
| 4. Seller guides | 20 | High (matches MR 2% pitch) |
| 5. Investment guides | 15 | Medium (smaller audience but valuable) |
| 6. School-zone pages | 50 | Very high (parent search behavior) |
| 7. Comparison pages | 25 | High (long-tail, AI-citable) |
| 8. Glossary | 60 | Medium SEO, very high AI citation |
| 9. Process guides | 15 | Medium-high |
| 10. Multilingual long-tail | 12 | High for FR/HT diaspora reach |
| **Total** | **547** | |

## Production Order (8-week sprint)

| Week | Cluster(s) | Output | Why first |
|---|---|---|---|
| 1 | 8 (Glossary) | 60 pages | Fastest to draft, immediate AI citation upside |
| 2 | 1 (Neighborhood expansion 8→50) | 42 pages | Existing template proven; just needs new data |
| 3 | 6 (School zones) | 50 pages | High family-buyer search volume |
| 4-5 | 2 (Loan × Neighborhood) | 180 pages | Commercial intent peak |
| 6 | 7 (Comparisons) + 9 (Process guides) | 40 pages | High AI Overview hit rate |
| 7 | 3 + 4 (Buyer + Seller guides) | 40 pages | Direct conversion drivers |
| 8 | 5 (Investment) + 10 (Multilingual) | 27 pages | Niche but high LTV |

## Data Sources Required (free / cheap)

| Source | Use | Cost |
|---|---|---|
| HUD FHA loan limits API | Per-county FHA limits | Free |
| VA.gov loan limits | Per-county VA limits | Free |
| Census ACS API | Median income, demographics | Free |
| GreatSchools API | School ratings, attendance zones | Free tier |
| Zillow Research (Home Value Index) | Median price by ZIP | Free, attribution required |
| Bridge MLS (already integrated) | Live listings | Existing |
| OpenStreetMap / Mapbox | Coordinates, walkability | Free / cheap |

## Quality Gates per Page

Before publishing any page in any cluster, it must pass:
- [ ] Unique data hook present (not just templated text)
- [ ] H1 matches search intent
- [ ] FAQ section with FaqJsonLd if relevant
- [ ] Hreflang alternates set
- [ ] Internal links to 3+ related Leo Realty pages
- [ ] CTA to /contact or /properties
- [ ] OG image generated
- [ ] At least one outbound link to authoritative source (HUD, Census, GreatSchools, etc.)

## Performance Verification (after each cluster)

- Build time delta per cluster
- Lighthouse score on a sample page
- TTFB on Vercel Analytics
- Search Console submission and indexation rate

