# GBP-LOCAL-SEO-PLAN.md — Google Business Profile, Reviews & Local Citations
Last updated: 2026-07-19 · Scope: Bengaluru + Karnataka (no neighborhood-level GBP service-area entries per owner decision)

---

## 1. Why this is the highest-leverage lever available

Per the baseline SEO audit (`suvasthuk.com-seo-audit/FULL-AUDIT-REPORT.md`), Local SEO is the **weakest category even on the new codebase** (39/100) despite strong NAP consistency and schema elsewhere — the gaps are entirely in GBP presence, reviews, and citations, none of which require a code deploy to fix. This is the fastest-moving lever in the whole plan.

## 2A. Co-located dual-entity strategy (Suvasthuk + Yashas Construction)

Two distinct companies at the **same address and same phone number**, each with its **own separate verified GBP**. The goal: keep Google treating them as two entities, not merging them on the shared NAP.

**Honest reality first:** on-page JSON-LD does **not** control GBP merging — Google dedups listings during verification using NAP + phone + primary category, not your markup. Since Yashas already has a *separate verified GBP*, the two listings exist distinctly today; the schema's job is to **reinforce** that separation and avoid signals that invite a merge. The single biggest merge-risk factor here is the **shared phone number** (Google weights phone heavily for dedup). Strongest de-risk, in order: (1) a **distinct phone line for Yashas** — even a cheap virtual/second number — is the highest-impact change and is recommended; (2) distinct primary GBP **categories** (Architect vs. General contractor); (3) distinct website **landing URL** per entity (Suvasthuk → `/`, Yashas → `/construction`).

**JSON-LD structure — two distinct `@id` nodes, NOT nested as departments:**

| | Suvasthuk node | Yashas node |
|---|---|---|
| `@id` | `https://suvasthuk.com/#suvasthuk` | `https://suvasthuk.com/#yashas` |
| `@type` | `ProfessionalService` (architecture) | `["GeneralContractor","HomeAndConstructionBusiness"]` |
| `name` | Suvasthuk Architects | Yashas Construction |
| `url` | `https://suvasthuk.com/` | `https://suvasthuk.com/construction` |
| `sameAs` | Suvasthuk GBP + Instagram | **Yashas GBP** `[PLACEHOLDER — Yash]` |
| `address` / `telephone` | shared (same values) | shared (same values) |

- **The decisive separation signal is the distinct `sameAs` → each node points to its OWN GBP URL**, plus distinct `name` and distinct primary `@type`/category. That's what tells Google "two entities."
- **Do NOT model one as a `department` of the other, or nest under a single `LocalBusiness`** — hierarchical nesting can *encourage* the merge you're trying to avoid. Keep them as two independent, sibling nodes.
- **Express the design-build partnership softly** — in each node's `description` and in page content — rather than via a hierarchical `parentOrganization`/`subOrganization` link (avoid inventing an umbrella legal entity that doesn't exist). If a real umbrella entity is later registered, a parent `Organization` with `subOrganization: [#suvasthuk, #yashas]` becomes the correct link at that point.
- **Render mode-aware:** the Suvasthuk node is the primary business node on architecture-portal pages; the **Yashas node is primary on `/construction/*`** pages. The shared `WebSite` node stays sitewide. This aligns entity emphasis with the portal the crawler is on instead of having both nodes compete on every page.

Implementation: split `components/seo/LocalBusinessSchema.tsx` into two exported nodes (or parameterize by portal), and have the construction routes render the Yashas node. Both GBPs must keep NAP character-identical to CONTENT-MASTER Block 1A/1B.

---

## 2. Google Business Profile optimization checklist (per entity — run once for Suvasthuk, once for Yashas)

| Item | Action | Status |
|---|---|---|
| Primary category | Set to **"Architect"** (not "Designer" or generic "Establishment") | `[PLACEHOLDER — Yash to verify current GBP category]` |
| Secondary categories (2–4) | Add: **Construction company**, **Interior designer**, **Building design company** | `[PLACEHOLDER — Yash to add in GBP dashboard]` |
| Business description | Lead with positioning: *"Suvasthuk Architects designs and builds residential, commercial, and institutional projects across Bengaluru and Karnataka. Est. 1993. Integrated design-build — one team from concept to handover."* | `[PLACEHOLDER — paste into GBP]` |
| Service area | Bengaluru + Karnataka (city + state, not neighborhood list — matches the site's SEO scope decision) | `[PLACEHOLDER]` |
| NAP on GBP | Must exactly match CONTENT-MASTER.md Block 9: F6 17/2, 1st Floor, Kodigehalli Main Rd, Sahakar Nagar, Bengaluru, Karnataka 560092 · +91 94804 44666 | Verify against current listing |
| Website link | Point to the deployed suvasthuk.com (post-DNS-cutover) | Blocked on ANALYTICS-SETUP.md deploy step |
| Photos | Minimum 30 — mix of exterior, interior, team, and site-progress shots. Pull directly from the newly organized `public/images/projects/` archive (233 images available — CATEGORY-MAPPING.md) | `[PLACEHOLDER — Yash to upload]` |
| Posts | Weekly GBP post (project update, blog link, or offer) — reuses blog content, near-zero extra effort | Start once cadence begins (ROADMAP-90-DAY.md) |
| Q&A section | Seed 3–5 questions/answers proactively (e.g., "Do you handle both design and construction?", "What areas do you serve?") — prevents low-quality user-submitted Q&As from ranking instead | `[PLACEHOLDER]` |
| Two GBP link formats found in code | Footer uses `g.page/suvasthuk?share`; schema uses a `share.google/…` link. **Verify both resolve to the same listing**, then standardize on the full Google Maps place URL everywhere (footer, schema `sameAs`, /contact) | `[PLACEHOLDER — Yash to verify, then flag to developer]` |

## 3. Reviews pipeline (dummy → real)

**Current state:** CONTENT-MASTER.md Block 8 holds 3 structural dummy testimonial entries. The Sanity `testimonial` schema is being extended with `rating`, `date`, `sourceUrl` (see task in ROADMAP) so real reviews carry `Review`/`aggregateRating` JSON-LD once populated — this was a Critical finding in the audit (zero review schema anywhere, even though a `Testimonial` component already renders content).

**Swap-in workflow (SOP-5 in SOP-ADD-CATEGORY.md):**
1. Open your Google Business reviews page.
2. Copy each review you want to feature: name, star rating, exact quote text, date.
3. In Sanity Studio → Testimonial → paste into `author` / `rating` / `quote` / `date`, and paste the review's own Google link into `sourceUrl` (proves authenticity, strengthens trust for both users and AI crawlers).
4. Publish. The site renders `Review` + `aggregateRating` schema automatically once the component is wired to the new fields (developer task, see ROADMAP).

**Never publish a dummy as real.** The live legacy site's #1 credibility failure — fabricated "Garreth Smith" testimonials repeated five times — is the audit's most damning finding. Do not repeat it, even temporarily.

## 4. Ongoing review-generation workflow

For every project reaching handover:
1. **Same-day ask.** The moment keys are handed over — while satisfaction is highest — send the templates below.
2. **WhatsApp template** (primary channel — Indian clients respond far better here than email):
   > "Hi [Name], it's been a pleasure building [Project name] with you! If you have 2 minutes, a Google review would mean a lot to us and helps other families find us: [direct review link]. Thank you for trusting us with your home."
3. **Email template** (backup / for commercial/institutional clients):
   > Subject: A small favor, [Name]?
   > Body: Short thank-you + the same direct review link + an offer to feature their project (with permission) on the portfolio.
4. **Direct review link:** generate via Google's "get more reviews" short-link tool in the GBP dashboard — always use the direct link, never ask clients to search for the business.
5. **Track in a simple log** (even a spreadsheet): project name, client, ask-sent date, review-received date. Follow up once, politely, after 2 weeks if no review lands.
6. **Never incentivize reviews** (Google policy violation, and also just bad practice) — ask sincerely, once, with a gentle follow-up.

## 5. India citation-building list

None currently exist (audit: zero directory presence found). Priority order:

| Directory | Priority | Notes |
|---|---|---|
| JustDial | High | India's largest local directory; claim/verify listing, exact NAP match |
| Sulekha | High | Strong for home-services/architecture category specifically |
| Houzz India | High | Architecture/design-specific — portfolio photos double as a citation AND a lead source |
| IndiaMART | Medium | B2B-leaning, useful for commercial/institutional lead flow |
| Facebook Business Page | Medium | Currently a dead `href="#"` link in the footer per the audit — create a real page, fix the link, add to `sameAs` |
| LinkedIn Company Page | Medium | Add to `sameAs`; also supports the credibility/E-E-A-T work in CONTENT-MASTER Block 5 |
| Architecture-specific award/directory listings | Low, ongoing | Any COA-affiliated or regional architecture award directory — pursue opportunistically |

**Rule for every listing:** NAP must be character-for-character identical to CONTENT-MASTER.md Block 9. Inconsistent NAP across citations is itself a negative ranking signal — better to have 3 perfectly consistent listings than 8 sloppy ones.

## 6. sameAs entity graph (schema + GBP alignment)

Current `sameAs` in `components/seo/LocalBusinessSchema.tsx`: Instagram + one Google share link only (audit finding — "thin entity graph," the weakest link in an otherwise-strong GEO/AEO score of 78/100). As new profiles go live, add each to the schema's `sameAs` array:
- [ ] Google Business Profile (standardized URL — see §2)
- [ ] Instagram (already present)
- [ ] Facebook Business Page (once created)
- [ ] LinkedIn Company Page (once created)
- [ ] YouTube channel (longer-horizon — project walkthrough videos are the single strongest external AI-citation correlator per the GEO audit; consider for Month 3+)

## 7. Known discrepancies to resolve (carried from the audit)

- **Landline `080-4111 0467`** — only visible on /contact, absent from schema/footer. Confirm whether it's on the GBP listing; if yes, add everywhere; if defunct, remove from /contact.
- **`addressLocality` bundling** — schema currently sets `"Sahakar Nagar, Bengaluru"` as locality; should be `"Bengaluru"` only, with "Sahakar Nagar" moved into the street-address line (developer fix, ROADMAP).
- **Geo coordinates precision** — currently 4-decimal; pull 5-decimal coordinates from the actual GBP pin for building-level accuracy.
- **`GeneralContractor` node** on /construction has no own address/telephone (relies solely on `parentOrganization` reference) — validators don't reliably resolve this; add inline NAP to that schema node too.

---

*Companion: CONTENT-MASTER.md Block 8-9 · SOP-ADD-CATEGORY.md §SOP-5 · ROADMAP-90-DAY.md Weeks 1-4*
