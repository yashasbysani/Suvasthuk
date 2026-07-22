# SOP — Adding Projects, Photos, and Categories
For: Yash (owner, non-developer workflow) · Last updated: 2026-07-19

---

## SOP-1: Add photos to an EXISTING project (no developer needed)

1. Open Sanity Studio: `suvasthuk.com/studio` (or `localhost:3001/studio` during development).
2. Open **Project** → click the project.
3. Drag photos into the **Gallery** field (upload the highest-quality originals — the CDN handles compression/WebP automatically).
4. Optionally drag the crop/hotspot on each image so thumbnails frame well.
5. Click **Publish**. The site updates automatically — no rebuild, no developer.

*Before uploading, rename files per the convention in CATEGORY-MAPPING.md §3 (`{project-slug}-{category}-bengaluru-{nn}.jpg`).*

## SOP-2: Add a NEW project (no developer needed)

1. Copy the new photos into the staging tree first, **choosing the brand folder** (this is what sets `portfolioVisibility` automatically on import — CATEGORY-MAPPING §5):
   `suvasthuk-next/public/images/projects/{shared|suvasthuk-only|yashas-only}/[category]/[new-project-slug]/`
   — `shared/` = joint design-build (shows in both portals), `suvasthuk-only/` = architecture, `yashas-only/` = construction. Lowercase-hyphen folder name; rename files per convention.
2. Open Studio → **Project** → **Create new**.
3. Fill every field using the **Block 4 template in CONTENT-MASTER.md** — especially `designStory` (150–300 words; project pages with only a gallery are the #1 content weakness flagged in the SEO audit).
4. Upload the cover image + gallery from the staging folder.
5. Set `featured: true` only if it should appear on the homepage mosaic.
6. **Publish.**

*Construction-vertical projects (site progress, build-only jobs): same steps but use the **Construction Project** document type instead — they appear under /construction/projects.*

## SOP-3: Add a NEW CATEGORY (one-line developer step, then self-serve)

Honest note: the category list is a fixed dropdown in code, so step 2 needs a developer (or Yash following the exact edit below) — it's one line, once per new category. Everything after is self-serve.

1. Create the staging folder: `public/images/projects/[new-category]/`.
2. **The one-line edit** — in `suvasthuk-next/sanity/schemaTypes/project.ts` line 12, add the new value:
   ```ts
   options: { list: ['residential','commercial','interior','institutional','renovation','farmhouse'] },
   ```
   (example adds `farmhouse`). Commit/deploy. The Studio dropdown now shows it.
3. Add projects under the new category via SOP-2.
4. Ask the developer to confirm the /projects filter bar picks up the new category (it reads categories from the project data, so it usually appears automatically once one published project uses it).
5. Add one row to CONTENT-MASTER.md Block 3 and CATEGORY-MAPPING.md §2 so the docs stay true.

## SOP-4: Bulk-import a whole folder of projects (developer-run, for big batches)

For migrating the 233-image archive, one-off:
1. Developer copies/renames archive folders into `public/images/projects/[category]/[slug]/` per CATEGORY-MAPPING.md §2 and §4.
2. Developer duplicates `scripts/upload-architecture.mjs`, points its `BASE` path at the staging folder, edits its `PROJECTS` list (slug, title, category, location, year per project).
3. Run: `node --env-file=.env.local scripts/upload-[name].mjs` (needs `SANITY_WRITE_TOKEN`).
4. Yash then enriches each created project in Studio with `brief` + `designStory` text (SOP-2 step 3).

## SOP-5: Swap in real testimonials (replaces the dummy placeholders)

1. Open your Google Business reviews page.
2. For each review worth publishing: copy the reviewer name, star rating, full text, and date.
3. Studio → **Testimonial** → create/edit an entry — paste into `author`, `rating`, `quote`, `date`, and paste the review's Google link into `sourceUrl`. Set `order` (1 = shown first).
4. **Publish.** Never edit a client's words beyond trimming length with "…".

---

**Where things live (quick reference)**

| Content | Edit where | Developer needed? |
|---|---|---|
| Project photos/text, blog posts, testimonials | Sanity Studio (/studio) | No |
| Category list | `project.ts` one-liner | Once per new category |
| Services copy, team bios, contact details | Code files (see CONTENT-MASTER.md per-block notes) | Yes (small edits) |
| Careers list | CONTENT-MASTER.md Block 7 (page build pending — see roadmap) | Initially yes |
