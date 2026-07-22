# CONTENT-MASTER.md — Suvasthuk Architects
**The single source-of-truth for all website content.**
Last updated: 2026-07-19 · Owner: Yash · Architecture: Hybrid (this file = authoring source + inventory; Sanity CMS = runtime source for projects/blog/testimonials)

---

## How this file works (read this first)

Every block below is annotated with two labels:

- **Runtime home** — where the content actually lives when the site renders it:
  - `[SANITY]` — a Sanity document, edited at `localhost:3001/studio` (or `suvasthuk.com/studio` once deployed). This file holds the *master copy / inventory*; Sanity holds the *published copy*.
  - `[CODE]` — hardcoded in a component or data file. Changing it = edit the named file (or ask the developer), then the site rebuilds.
- **Sync method** — how content gets from this file into the site.

**Golden rule:** when content changes, update it HERE first, then push to its runtime home. This file is the tie-breaker whenever the site and this doc disagree.

**Migrating to Sanity Portable Text:** blog bodies in `docs/marketing/blog-posts/*.md` use only headings, paragraphs, bold, and lists (no tables, no HTML) so they paste cleanly into Sanity's editor or import via `scripts/upload-blog-posts.mjs`.

---

## Dual-brand architecture (read before Block 1)

This site is a **dual-portal for two distinct, affiliated, co-located companies**:

- **Suvasthuk Architects** — architecture & design. Owns the main site (`/`, `/about`, `/services/*`, `/projects`, `/blog`).
- **Yashas Construction** *(exact legal spelling — singular, no trailing "s")* — construction & execution. Owns the `/construction/*` portal as its digital storefront.

**Shared truth:** both operate from the same Sahakar Nagar address and the same phone number, but **each has its own separate verified Google Business Profile.** The website presents them via a global mode toggle / dual-entry landing so visitors immediately understand there are two companies and can switch portals.

**Core value proposition (primary differentiator for BOTH entities):** integrated **design-build** — one partnership takes you from first sketch (Suvasthuk) to final handover (Yashas), single point of accountability for design, cost, and timeline. Every identity/service/blog block below must lead with this synergy.

---

## Block 1A — Suvasthuk Architects Identity `[CODE + SANITY]`

Runtime homes: `app/layout.tsx` (site title/description), `components/seo/LocalBusinessSchema.tsx` (schema), `components/home/AboutStrip.tsx`, `app/about/page.tsx`, `components/layout/Footer.tsx`.

| Field | Canonical value | Notes |
|---|---|---|
| Legal/brand name | **Suvasthuk Architects** | Never "Suvasthuk Architect" or "Suvastuk" |
| Tagline | *Designing Bengaluru's built landscape since 1993.* | `[PLACEHOLDER — Yash may refine]` |
| Founding year | **1993** | ⚠️ The old live site says "Since 1990" on its homepage. The new build uses 1993 everywhere (12+ files, incl. schema `foundingDate`). **1993 is canonical** unless registration records say otherwise — if they say 1990, tell the developer to run a find-replace across the codebase. One year, everywhere, forever. |
| Founder | **B K Muralidhar**, Principal Architect & Founder | Name presented exactly this way sitewide (old site also used "Muralidhar Bysani Keshavamurthy" — do not mix formats) |
| Mission / philosophy | "Macro to micro" — every project designed from the site masterplan down to the door handle, with the discipline of a builder and the eye of a designer. `[PLACEHOLDER — Yash to approve/refine]` | Used on /about |
| The construction affiliation (core positioning pillar) | Suvasthuk Architects operates an integrated construction division (the `/construction` vertical). **Positioning: "One team from first sketch to final handover — design-build delivery with a single point of accountability for design, cost, and timeline."** This is the differentiator most pure-design competitors (Khosla Associates, Studio B, Cadence, etc.) cannot claim. Use this framing in every service description, the homepage, and blog CTAs. | Schema: `GeneralContractor` node on /construction links to main `ProfessionalService` via `parentOrganization` |
| Service area | Bengaluru (primary) + Karnataka (state-wide) | Per owner decision: **no neighborhood/micro-market pages**. Schema `areaServed`: City Bengaluru + State Karnataka |
| Headline stats | 30+ years · 826+ satisfied clients · 1024+ projects | ⚠️ Audit flag: these are displayed but unsubstantiated on-site. Action: keep only numbers you can defend; link "projects" stat to /projects. `[PLACEHOLDER — Yash to confirm real counts]` |

---

## Block 1B — Yashas Construction Identity `[CODE + SANITY]`

Runtime homes: `app/construction/page.tsx`, `app/construction/services/[slug]/page.tsx`, the Yashas `GeneralContractor` node in `components/seo/LocalBusinessSchema.tsx`, construction-portal navbar/footer.

| Field | Canonical value | Notes |
|---|---|---|
| Legal/brand name | **Yashas Construction** | Exact spelling — **singular, no trailing "s"**. Enforce consistently in code, schema, and content. |
| Positioning | *The execution arm of the Suvasthuk design-build partnership — turnkey construction with a single point of accountability.* | Lead with design-build synergy |
| Entity type | Construction company / General Contractor | Schema `@type`: `GeneralContractor` + `HomeAndConstructionBusiness` |
| Address (NAP) | **Same as Suvasthuk** — F6 17/2, 1st Floor, Kodigehalli Main Rd, Sahakar Nagar, Bengaluru, Karnataka 560092 | Co-located (confirmed) |
| Phone | **Same as Suvasthuk** — +91 94804 44666 | Co-located (confirmed). ⚠️ Shared phone is the biggest GBP-merge risk signal — see GBP-LOCAL-SEO-PLAN.md §2A; a distinct Yashas line is the recommended future de-risk |
| Google Business Profile | **Separate, already verified** — `[PLACEHOLDER — Yash: paste the Yashas Construction GBP URL]` | Distinct from Suvasthuk's GBP; this is the key entity-separation signal in schema `sameAs` |
| Legal registration / GST | `[PLACEHOLDER — Yash]` | |
| Service area | Bengaluru + Karnataka | |

---

## Block 2 — Services `[CODE]`

**Architecture services** — runtime home: `lib/services.ts` (name, slug, tagline, description, process steps, FAQ per service — all live there; edit that file to change site copy).
**Construction services** — runtime home: `app/construction/services/[slug]/page.tsx` (`SERVICES` array).

Pricing policy (owner decision): **Hybrid** — exact pricing stays off the site, gated behind the enquiry form + WhatsApp. Indicative ₹/sq-ft market ranges ARE published in blog cost guides (that's what captures cost-query search traffic). The `price:` fields below are internal reference only — they populate quote conversations, not web pages.

### Architecture vertical (10 services, live at /services/[slug])

| # | Service | Slug | Ideal client | Differentiator vs competitors | price (internal) |
|---|---|---|---|---|---|
| 1 | Architectural Design | `architectural-design` | Homeowners, developers | Design-build: drawings that are actually buildable at quoted cost | `[PLACEHOLDER — Yash]` |
| 2 | Interior Design | `interior-design` | Homeowners, offices, retail | Same team that built the shell designs the inside | `[PLACEHOLDER — Yash]` |
| 3 | Construction | `construction` (redirects to /construction) | All | Full-contract build, labour + materials, in-house | `[PLACEHOLDER — Yash]` |
| 4 | Structural Design | `structural-design` | Self-builders, developers | IS-code compliant engineering from the design team itself | `[PLACEHOLDER — Yash]` |
| 5 | Vastu Consultation | `vastu-consultation` | Residential clients | Vastu integrated into modern design, not bolted on | `[PLACEHOLDER — Yash]` |
| 6 | Renovation | `renovation` | Owners of ageing homes | Structural assessment + design + execution, one contract | `[PLACEHOLDER — Yash]` |
| 7 | Landscaping | `landscaping` | Villa/estate owners | Outdoor spaces designed with the architecture, not after it | `[PLACEHOLDER — Yash]` |
| 8 | Layout Planning | `layout-planning` | Land owners, developers | 30+ years of Bengaluru plot/layout regulation experience | `[PLACEHOLDER — Yash]` |
| 9 | Sanction Plans & TDR | `sanction-plans-tdr` | All Bengaluru builders | Hundreds of BBMP sanctions filed; TDR procurement handled in-house | `[PLACEHOLDER — Yash]` |
| 10 | Elevation Designs | `elevation-designs` | Budget-conscious self-builders | Facade transformation without full redesign | `[PLACEHOLDER — Yash]` |

### Construction vertical (6 services, live at /construction/services/[slug])

| # | Service | Slug | price (internal) |
|---|---|---|---|
| 1 | Residential Construction | `residential-construction` | `[PLACEHOLDER — Yash, ₹/sq ft band]` |
| 2 | Commercial Construction | `commercial-construction` | `[PLACEHOLDER — Yash]` |
| 3 | Turnkey Projects | `turnkey-projects` | `[PLACEHOLDER — Yash]` |
| 4 | Project Management | `project-management` | `[PLACEHOLDER — Yash]` |
| 5 | Renovation | `renovation` | `[PLACEHOLDER — Yash]` |
| 6 | Institutional Construction | `institutional` | `[PLACEHOLDER — Yash]` |

**Internal-linking rule (SEO):** every service page links to (a) its most relevant project category on /projects, (b) 1-2 relevant blog posts, (c) /contact. Blog posts link back to their matching service page. The 10 new blog posts in `blog-posts/` already contain these links.

---

## Block 3 — Categories `[SANITY enum + CODE]`

Runtime home: `sanity/schemaTypes/project.ts` line 12 — fixed list: `residential` · `commercial` · `interior` · `institutional` · `renovation`.

Full mapping of the local photo archive → categories, plus the add-a-category procedure: see **CATEGORY-MAPPING.md** and **SOP-ADD-CATEGORY.md** (same folder).

Current gaps: **`interior` and `renovation` have no photos in the archive** — commission/collect photos for these two categories; until then those category filters will look thin on /projects.

---

## Block 4 — Projects `[SANITY]`

Runtime home: Sanity `project` documents (edit in Studio → Project). Bulk import: `scripts/upload-architecture.mjs` pattern.
Schema fields per project: `title, slug, category, area, location, year, services[], coverImage, gallery[], brief, designStory, tags[], featured, seoTitle, seoDescription, portfolioVisibility[]`.

**DRY dual-brand model (unified schema — no separate `constructionProject` type):** every project is ONE document tagged with **`portfolioVisibility`** (array): `['suvasthuk']`, `['yashas']`, or `['suvasthuk','yashas']` for joint design-build projects. Galleries filter on this field per portal, so a joint project is authored once and appears in both. The existing separate `constructionProject` documents get migrated into `project` with `portfolioVisibility: ['yashas']` (migration script — see ROADMAP). Folder-driven auto-flagging on import: CATEGORY-MAPPING.md §5.

### Current inventory (in Sanity today — verify in Studio)
muniraj-residence · manjesh-views · private-bungalows · residential-perspectives · apartment-designs · commercial-buildings · nh-4-projects · institutional-projects · collected-renders · option-04 *(+ construction-vertical projects under `constructionProject`)*

⚠️ **Audit critical finding:** project pages currently render ~13 words of body copy. Every project needs the template below filled in (300-400 words minimum). This is the single biggest content lift on the site.

### Project entry template (copy for each new/updated project)
```
title:        [Project name, e.g. "Muniraj Residence"]
category:     [residential | commercial | interior | institutional | renovation]
location:     [Area, Bengaluru — e.g. "Sahakar Nagar, Bengaluru"]
year:         [YYYY completed]
area:         [e.g. "4,200 sq ft"]
services:     [e.g. Architectural Design, Structural Design, Construction]
coverImage:   /public/images/projects/[category]/[slug]/[slug]-cover.jpg   ← local staging path
gallery:      /public/images/projects/[category]/[slug]/  (all images in folder)
brief:        [2-3 sentences: what the client asked for]
designStory:  [150-300 words: the challenge, the design response, materials,
               one construction/delivery detail that shows design-build value]
testimonial:  [link to Block 8 entry if the client gave a review]
tags:         [e.g. duplex, 30x40, vastu-compliant]
featured:     [true = shows on homepage mosaic]
seoTitle:     [≤60 chars, e.g. "Muniraj Residence — 4BHK Duplex in Bengaluru"]
seoDescription: [140-155 chars incl. location + project type + firm name]
```

---

## Block 5 — Team / About `[CODE]`

Runtime home: `app/about/page.tsx` (`TEAM` array, line ~21).

| Person | Role | Status |
|---|---|---|
| B K Muralidhar | Principal Architect & Founder (since 1993) | ✅ Live (photo: /images/person_1.jpg) |
| `[PLACEHOLDER — Name]` | `[Senior Architect]` | ⚠️ **"Full team profiles coming soon" is still live on /about** — audit high-priority finding. Supply name + role + credential + photo for at least 2 more people, then remove the placeholder line (app/about/page.tsx:166) |
| `[PLACEHOLDER — Name]` | `[Site Engineer / Project Manager — construction division]` | Reinforces design-build positioning |

Credentials to add when available (E-E-A-T): COA registration number(s) `[PLACEHOLDER]`, professional affiliations `[PLACEHOLDER]`, awards/press `[PLACEHOLDER]`.
**Blog byline rule:** posts are attributed to **B K Muralidhar, Principal Architect** (not the org name) — fixes the audit's author-schema finding.

---

## Block 6 — Blog `[SANITY]`

Runtime home: Sanity `blogPost` documents. Import: `scripts/upload-blog-posts.mjs`.
Full keyword strategy + calendar: **KEYWORD-CONTENT-CALENDAR.md**. Full manuscripts: **blog-posts/01…10**.

| # | Post | Slug | Status |
|---|---|---|---|
| 1 | Construction Cost per Sq Ft in Bangalore (2026 Guide) | `construction-costs-bangalore-2025` | REWRITE — replaces thin existing post, same slug |
| 2 | How to Choose the Right Architect in Bangalore | `how-to-choose-the-right-architect-in-bangalore` | REWRITE |
| 3 | BBMP Plan Approval: Complete 2026 Guide | `bbmp-plan-approval-bangalore-guide-2025` | REWRITE |
| 4 | Vastu Shastra in Modern Homes | `vastu-shastra-modern-homes` | REWRITE |
| 5 | Sustainable Architecture & Materials in Karnataka | `sustainable-architecture-bangalore` | REWRITE |
| 6 | Interior Design Trends in Bangalore 2026 | `interior-design-trends-bangalore-2025` | REWRITE |
| 7 | Design-Build vs Separate Architect & Contractor | `design-build-vs-traditional-contractor-bangalore` | NEW |
| 8 | 30×40 House Construction in Bangalore | `30x40-house-construction-bangalore` | NEW |
| 9 | Commercial Building Design & Construction in Bengaluru | `commercial-building-design-construction-bangalore` | NEW |
| 10 | School & Institutional Building Design in Karnataka | `school-institutional-building-design-karnataka` | NEW |

---

## Block 7 — Careers `[NEW — no runtime home yet]`

No /careers route exists. Page build is scheduled in ROADMAP-90-DAY.md (Month 2). Until then this block is the master list; toggling `[OPEN]`/`[CLOSED]` here is the workflow once the page reads from it.

```
role:
  title:        Junior Architect
  department:   Design
  location:     Sahakar Nagar, Bengaluru (on-site)
  type:         Full-time
  status:       [CLOSED]        ← flip to [OPEN] to publish
  description:  [PLACEHOLDER — 2-3 sentences]
  requirements: [B.Arch; 0-2 years; AutoCAD/SketchUp/Revit; COA registration preferred]

role:
  title:        Site Engineer — Construction Division
  department:   Construction
  location:     Bengaluru (site-based)
  type:         Full-time
  status:       [CLOSED]
  description:  [PLACEHOLDER]
  requirements: [BE Civil; 2-5 years residential/commercial site experience]
```

---

## Block 8 — Testimonials `[SANITY]`

Runtime home: Sanity `testimonial` documents (schema being extended with `rating`, `date`, `sourceUrl`).
Rendered by `components/home/Testimonial.tsx`; will carry `Review` + `aggregateRating` JSON-LD once populated (see GBP-LOCAL-SEO-PLAN.md §3).

**⚠️ The 3 entries below are STRUCTURAL DUMMIES. Swap in real Google reviews (exact quotes, real names/initials) — do not publish dummy content.**

```
testimonial:
  author:     [Reviewer Name]
  rating:     5
  quote:      "[Paste real Google review text here — verbatim, do not edit the client's words]"
  location:   [Project type / area, e.g. "Residential villa, North Bengaluru"]
  date:       [YYYY-MM-DD of the Google review]
  sourceUrl:  [link to the review on Google — proves authenticity]
  order:      1

testimonial:
  author:     [Reviewer Name]
  rating:     5
  quote:      "[Paste real Google review text here]"
  location:   [Project type]
  date:       [YYYY-MM-DD]
  sourceUrl:  [Google review link]
  order:      2

testimonial:
  author:     [Reviewer Name]
  rating:     [4 or 5 — real rating]
  quote:      "[Paste real Google review text here]"
  location:   [Project type]
  date:       [YYYY-MM-DD]
  sourceUrl:  [Google review link]
  order:      3
```

---

## Block 9 — Contact / CTA `[CODE]`

Runtime homes: `app/contact/page.tsx`, `components/layout/Footer.tsx`, `components/seo/LocalBusinessSchema.tsx`. **All three must always match this block.**

| Field | Canonical value | Status |
|---|---|---|
| Address (NAP master) | F6 17/2, 1st Floor, Kodigehalli Main Rd, Sahakar Nagar, Bengaluru, Karnataka 560092, India | Schema currently bundles "Sahakar Nagar, Bengaluru" into `addressLocality` — fix per audit: locality = "Bengaluru" only, neighborhood moves into street line |
| Mobile | +91 94804 44666 | In schema ✅ |
| Landline | 080-4111 0467 | ⚠️ On /contact only — **decide:** if it's on the Google Business Profile, add to schema + footer; if defunct, remove from /contact. `[PLACEHOLDER — Yash decision]` |
| Email | suvasthuk@gmail.com | Works, but audit recommends a domain email (info@suvasthuk.com) once mail hosting exists. `[PLACEHOLDER — future]` |
| WhatsApp | +91 94804 44666 (wa.me link, floating button sitewide) | Primary conversion channel — tracked as a GA4 event (ANALYTICS-SETUP.md) |
| Google Business Profile | **Pick ONE canonical URL** — footer uses `g.page/suvasthuk?share`, schema uses a `share.google/…` link. Verify both resolve to the same listing, then use the full Google Maps place URL everywhere. `[PLACEHOLDER — Yash to verify]` | Audit high finding |
| Enquiry form fields | Name · Phone · Email · Project type (dropdown: Residential / Commercial / Interior / Renovation / Institutional / Other) · Location · Message | Handled by /api/contact → Resend email |
| Primary CTA (sitewide) | "Get a free consultation" → /contact | |
| Secondary CTA | WhatsApp button | |
| Instagram | instagram.com/suvasthuk_architects | Only live social. Add LinkedIn/Facebook/YouTube to schema `sameAs` as they're created (GBP plan §6) |

---

*Companion documents: CATEGORY-MAPPING.md · SOP-ADD-CATEGORY.md · KEYWORD-CONTENT-CALENDAR.md · blog-posts/ · GBP-LOCAL-SEO-PLAN.md · ANALYTICS-SETUP.md · ROADMAP-90-DAY.md · SEO baseline: ../../suvasthuk.com-seo-audit/FULL-AUDIT-REPORT.md*
