# ROADMAP-90-DAY.md — Suvasthuk Architects Marketing & SEO Execution Plan
Last updated: 2026-07-19 · Merges the SEO audit's 21-item fix list (`suvasthuk.com-seo-audit/FULL-AUDIT-REPORT.md`) with this content/GBP/analytics plan into one sequenced schedule.

---

## How to read this

Each item tags **who does it**: `[Yash]` (owner, no developer needed), `[Dev]` (small code change), or `[Both]`. Items reference the companion doc that has full detail. Work through phases in order — later phases assume earlier ones landed.

---

## Weeks 1–2: Deploy, fix, and get discoverable

**Deployment (blocks almost everything else)**
- [ ] `[Dev]` Create Vercel project, connect repo, set 4 env vars — ANALYTICS-SETUP.md §1
- [ ] `[Dev]` Point suvasthuk.com + www DNS at Vercel — fixes the live/local score gap (18→66) and the TLS certificate mismatch in one move
- [ ] `[Both]` Verify the live site post-cutover: homepage, /studio noindex, sitemap, robots.txt

**Quick technical fixes** (audit findings, all small)
- [x] ~~Remove `/construction/services` from sitemap~~ — **CANCELLED by dual-brand pivot.** Reverted: `/construction/services` is now the Yashas Construction storefront hub and stays in the sitemap. **Coupled task ↓:** convert the route from a redirect to a real hub page (see Dual-Brand workstream) or the sitemap entry is an invalid 307.
- [ ] `[Dev]` Add a Content-Security-Policy header in `next.config.js`
- [ ] `[Dev]` Verify `og:image`/`twitter:image` resolve to the production domain in an actual `next build` (dev-mode showed localhost)
- [ ] `[Dev]` Fix `Person.alumniOf` (bare string → `Organization` object) and `Article.author` fallback (`Person` → `Organization`) in schema components
- [ ] `[Dev]` Fix `addressLocality` (move "Sahakar Nagar" into `streetAddress`, keep city-only in locality) — GBP-LOCAL-SEO-PLAN.md §7
- [ ] `[Dev]` Extend `testimonial.ts` schema with `rating`/`date`/`sourceUrl` and wire `Review`/`aggregateRating` JSON-LD into the Testimonial component

**GBP + analytics setup**
- [ ] `[Yash]` GBP optimization: primary/secondary categories, description, service area, 30+ photos, seed Q&A — GBP-LOCAL-SEO-PLAN.md §2
- [ ] `[Yash]` Verify which of the two GBP link formats is correct; standardize everywhere
- [ ] `[Both]` Set up GA4 + GTM + Search Console, submit sitemap — ANALYTICS-SETUP.md §2-3

**Publish the content sprint**
- [ ] `[Yash]` Publish the 10 written blog posts (`blog-posts/01-10`) into Sanity, staggered over 2-3 weeks — KEYWORD-CONTENT-CALENDAR.md §3
- [ ] `[Yash]` Begin weekly GBP posts reusing blog content

## Weeks 3–4: Reviews, project depth, team credibility

- [ ] `[Yash]` Swap the 3 dummy testimonials for real Google reviews — SOP-ADD-CATEGORY.md SOP-5
- [ ] `[Yash]` Start the review-request workflow for every new project handover — GBP-LOCAL-SEO-PLAN.md §4
- [ ] `[Yash]` Begin migrating the 233-image local archive into `public/images/projects/[category]/` per CATEGORY-MAPPING.md §2
- [ ] `[Yash]` Write `designStory` copy (150-300 words) for the highest-priority existing projects (muniraj-residence, manjesh-views first — the audit's flagged near-empty pages) — CONTENT-MASTER.md Block 4 template
- [ ] `[Yash]` Supply 2+ real team bios + photos; remove "Full team profiles coming soon" from `app/about/page.tsx:166` — CONTENT-MASTER.md Block 5
- [ ] `[Dev]` Add `Service` + `BreadcrumbList` schema to the 6 construction service pages, and `BreadcrumbList` + `CreativeWork` to construction project pages (mirrors the pattern already working on the architecture vertical)
- [ ] `[Dev]` Give the `GeneralContractor` schema node its own address/telephone/`@id`
- [ ] `[Yash]` Confirm the secondary landline — add to schema/footer if real, remove from /contact if not

## Month 2: Content velocity + category expansion

- [ ] `[Yash]` Publish 2 new posts/month per KEYWORD-CONTENT-CALENDAR.md §4 pipeline
- [ ] `[Yash]` Bulk-import archive photos into new Sanity project entries (SOP-4) — target: `interior` and `renovation` categories, which currently have zero photos
- [ ] `[Yash]` Establish JustDial, Sulekha, Houzz India citations with exact-match NAP — GBP-LOCAL-SEO-PLAN.md §5
- [ ] `[Yash]` Create a real Facebook Business Page (fixes the dead `href="#"` footer link) + LinkedIn Company Page; add both to `sameAs`
- [ ] `[Dev]` Add `FAQPage` schema to the blog template (service pages already have this; blog posts don't yet — the 10 new posts already have FAQ *content*, just needs schema wiring)
- [ ] `[Yash]` Scope and start the `/careers` page build (content already drafted in CONTENT-MASTER.md Block 7)

## Month 3: Authority, citations, and first review

- [ ] `[Yash]` Continue citation building — IndiaMART, architecture-specific directories
- [ ] `[Yash]` Consider starting a YouTube channel with project walkthrough videos (the single strongest external AI-citation correlator identified in the GEO audit)
- [ ] `[Both]` Full KPI review against ANALYTICS-SETUP.md §6 — first real month-over-month trend data
- [ ] `[Both]` Re-run PageSpeed Insights / Lighthouse against the live site (blocked by API quota during the original audit)
- [ ] `[Both]` Re-run the SEO audit categories (technical, schema, GEO, local) to measure movement against the July 2026 baseline

## Dual-Brand workstream (Suvasthuk Architects + Yashas Construction)

Elevates Yashas Construction from a Suvasthuk sub-vertical to a co-equal primary entity. Sequence within Weeks 1–4 / Month 2.

- [x] `[Dev]` Revert sitemap deletion — `/construction/services` restored (done this session)
- [ ] `[Dev]` **Convert `/construction/services/page.tsx` from `redirect()` to a real Yashas services hub page** (makes the restored sitemap entry valid; needs hub content)
- [ ] `[Dev]` **Unify Sanity schema (DRY):** add `portfolioVisibility` array field (`['suvasthuk'] | ['yashas'] | ['suvasthuk','yashas']`) to `project.ts`; reconcile category enum with construction categories
- [ ] `[Dev]` **Migrate** existing `constructionProject` documents → `project` docs with `portfolioVisibility: ['yashas']`; backfill existing `project` docs with `['suvasthuk']`; remove `constructionProject` from schema index; update `sanity/lib/queries.ts` + any pages reading the old type (⚠️ touches live data — do as a careful, isolated pass with a Sanity dataset backup first)
- [ ] `[Dev]` **Brand-filter galleries:** `/projects` filters `portfolioVisibility` contains `suvasthuk`; `/construction/projects` filters contains `yashas`
- [ ] `[Dev]` **Split `LocalBusinessSchema.tsx`** into two distinct `@id` nodes (Suvasthuk `ProfessionalService` + Yashas `GeneralContractor`), each with its own GBP `sameAs`; render mode-aware (Yashas node primary on `/construction/*`) — GBP-LOCAL-SEO-PLAN.md §2A
- [ ] `[Dev]` **Dual-entry UX:** rebrand the existing `SiteModeContext` "Construction" mode as "Yashas Construction"; add a clear two-company landing/toggle so visitors know there are two firms
- [ ] `[Yash]` **Second GBP optimization pass** for Yashas Construction (own categories: General contractor; own photos from `yashas-only/`) — GBP-LOCAL-SEO-PLAN.md §2
- [ ] `[Yash]` Provide Yashas GBP URL + confirm whether a **distinct phone line** is feasible (recommended to de-risk the shared-NAP merge — §2A)
- [ ] `[Yash]` Update import scripts to read `shared/` `suvasthuk-only/` `yashas-only/` folder paths → auto-set `portfolioVisibility` (CATEGORY-MAPPING §5)

## Ongoing (ownership routines)

| Cadence | Task |
|---|---|
| Weekly | 1 GBP post; check GA4 traffic sources + GSC performance (5 min each) |
| Per project handover | Send review request (WhatsApp template) same-day |
| Bi-weekly/monthly | Publish next blog post from the content calendar |
| Monthly | Full KPI dashboard review — ANALYTICS-SETUP.md §6 |
| As content changes | Update CONTENT-MASTER.md first, then push to its runtime home (the golden rule) |

## Milestone expectations (the honest framing)

- **End of Month 1:** technical foundation solid, GBP optimized, 10 posts live, deployed on the correct domain. This is table stakes, not ranking results yet.
- **Months 3-4:** first movement on long-tail/informational queries (the blog posts' target keywords); GBP-driven local visibility improving as reviews accumulate.
- **Months 5-6+:** meaningful movement on mid-competition commercial terms; head terms ("architects in Bangalore") remain a longer campaign against 30-year-established competitors — sustained content + citations + reviews compound from here.

---

*Full findings behind every audit-derived item: `../../suvasthuk.com-seo-audit/FULL-AUDIT-REPORT.md`. Companion docs: CONTENT-MASTER.md · CATEGORY-MAPPING.md · SOP-ADD-CATEGORY.md · KEYWORD-CONTENT-CALENDAR.md · GBP-LOCAL-SEO-PLAN.md · ANALYTICS-SETUP.md*
