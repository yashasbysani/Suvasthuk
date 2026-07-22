# CATEGORY-MAPPING.md — Photo Archive → Website Categories
Last updated: 2026-07-19 · Source archive verified on disk (Google Drive dependency eliminated)

---

## 1. The archive as it exists today

Location: `Suvasthuk-Architects/Images for Website from google drive/`
Verified contents: **233 images** (jpg/png) + 7 PDFs + junk files (`Thumbs.db` — delete on migration).

| Archive folder | Images | Subfolders (projects) |
|---|---|---|
| `houses/` | 86 | abiraman, balaji, balaji nagar, container houses for stellar homes, darshan, harsha, johnson villa, MANJUNATH, Mr. K.Ramesh, Mr.PRABAKAR, muniraj, ramesh, shrikanth, somashekar, srinivas residence, tulasi naik elevations (+ loose files) |
| `appartment/` | 55 | cedar, youtopia |
| `commercial buildings/` | 42 | egv, nh-4 commercials, NH4, rajesh, ravindran, ROHITH, yoga centre |
| `school/` | 34 | dev intrnl, poorna vikas |
| `site photos/` | 12 | chamarj, raju, ravindran site, ravishankar |
| `NH-4/` | 4 | PRESENTATION |
| `Presentation sheets/` | 0 (7 PDFs) | — |

---

## 2. 1:1 mapping to website categories

Website categories = the Sanity `project.category` enum (`sanity/schemaTypes/project.ts:12`):
`residential` · `commercial` · `interior` · `institutional` · `renovation`

| Archive folder | → Category | → Staging destination | Notes |
|---|---|---|---|
| `houses/` | **residential** | `public/images/projects/residential/[project-slug]/` | Largest asset base; each client subfolder = one project entry |
| `appartment/` | **residential** (tag: `apartment`) | `public/images/projects/residential/cedar-apartments/`, `.../youtopia-apartments/` | Enum has no "apartment" value — use the `tags` field to distinguish; /projects can filter by tag later |
| `commercial buildings/` | **commercial** | `public/images/projects/commercial/[project-slug]/` | `nh-4 commercials` + `NH4` + root `NH-4/` folder all merge into ONE project: `nh-4-commercial-complex` |
| `school/` | **institutional** | `public/images/projects/institutional/poorna-vikas-vidyalaya/`, `.../dev-international-school/` | Poorna Vikas partly exists in `public/images/Projects/` already — merge, don't duplicate |
| `site photos/` | **→ construction vertical** (`constructionProject` type, NOT `project`) | `public/images/projects/construction/[project-slug]/` | In-progress site photos belong on /construction/projects, not the architecture portfolio |
| `Presentation sheets/` (PDFs) | design-story source material | keep in archive | Mine these for project descriptions/designStory text; don't publish raw PDFs |
| *(no source folder)* | **interior** | — | ⚠️ GAP — no interior photos in archive. Collect from completed interior projects before the interior category page fills out |
| *(no source folder)* | **renovation** | — | ⚠️ GAP — same. Before/after pairs are the gold standard for renovation portfolios |

**Important pipeline note:** project pages render images from the **Sanity CDN** (uploaded via Studio or `scripts/upload-*.mjs`), not directly from `public/`. The `public/images/projects/` tree is the **staging area + organized archive**: it gives you a clean drag-and-drop folder workflow, the upload scripts read from it, and Sanity serves the optimized result (auto-WebP, responsive sizes). Content documents reference the local staging path as the canonical pointer to each image.

---

## 3. Image SEO conventions (apply during migration)

Most Bengaluru competitor firms under-optimize project imagery — this is a genuine ranking opportunity. Apply these rules to every image as it moves into staging:

### Filename convention
```
{project-slug}-{category}-bengaluru-{nn}.jpg
```
Examples:
- `SHIVAKUMAR 14-3-05.jpg` → `shivakumar-residence-residential-bengaluru-01.jpg`
- `6-09-03 yousuf Print.jpg` → `yousuf-residence-residential-bengaluru-01.jpg`
- Cover image per project: `{project-slug}-cover.jpg`

Rules: all lowercase, hyphens (no spaces), no dates/initials/"Print", sequential `-01`…`-nn`.

### Alt-text templates (per category)
Filled in per image in Sanity or by the upload script:
- **residential:** `"{Project name} — {n}BHK residential architecture in Bengaluru by Suvasthuk Architects — {view: front elevation / living room / facade}"`
- **commercial:** `"{Project name} — commercial building design in Bengaluru — {view}"`
- **institutional:** `"{Project name} — school/institutional architecture in Karnataka — {view}"`
- **construction (site photos):** `"{Project name} — under-construction site progress, Bengaluru — {stage: structure / finishing}"`

Keep alt text under ~125 characters, descriptive first, brand second, never keyword-stuffed.

### Format & compression
- Upload the **highest-quality original** to Sanity — its CDN automatically serves WebP/AVIF-negotiated, resized variants via `next/image` + `urlFor()`. Do **not** pre-compress to WebP yourself; you'd only lose quality before the CDN re-encodes.
- Strip obvious junk before upload: `Thumbs.db`, duplicate scans, sub-800px images (too small for the gallery).
- Target: every gallery image ≥1600px wide; cover images ≥2000px.

### Captions
Sanity gallery images support hotspot/crop today; add a one-line caption in the `designStory` text near each image reference instead (e.g., "The double-height living space opens to the north court"). Captions feed both users and AI-crawler passage extraction.

---

## 4. Proposed project entries from the archive (starter list)

These folders have enough images to become full project pages immediately (pair with the Block 4 template in CONTENT-MASTER.md):

| Project entry (proposed slug) | Category | Source folder | Est. images |
|---|---|---|---|
| `muniraj-residence` (exists in Sanity — enrich) | residential | houses/muniraj | ~5-8 |
| `johnson-villa` | residential | houses/johnson villa | ~5 |
| `srinivas-residence` | residential | houses/srinivas residence | ~5 |
| `container-houses-stellar-homes` | residential | houses/container houses… | ~5 — genuinely differentiated story (container architecture) |
| `cedar-apartments` | residential (tag apartment) | appartment/cedar | ~25 |
| `youtopia-apartments` | residential (tag apartment) | appartment/youtopia | ~25 |
| `nh-4-commercial-complex` | commercial | commercial buildings/nh-4* + NH-4/ | ~10 |
| `yoga-centre` | commercial | commercial buildings/yoga centre | ~5 |
| `egv-commercial` | commercial | commercial buildings/egv | ~5 |
| `poorna-vikas-vidyalaya` | institutional | school/poorna vikas | ~15 |
| `dev-international-school` | institutional | school/dev intrnl | ~15 |
| construction: `ravindran-site`, `chamaraj-site`, etc. | constructionProject | site photos/* | 12 total |

Remaining `houses/` subfolders: batch as smaller entries or fold the best photos into `private-bungalows` / `residential-perspectives` collection pages that already exist in Sanity.

---

## 5. Dual-brand folder structure → `portfolioVisibility` auto-flagging

Under the unified DRY schema, the **top-level folder encodes the brand**, and the import script reads it to set `portfolioVisibility` automatically — you never hand-tag a document.

```
public/images/projects/
├── shared/[category]/[project-slug]/          → portfolioVisibility: ['suvasthuk','yashas']   (joint design-build)
├── suvasthuk-only/[category]/[project-slug]/   → portfolioVisibility: ['suvasthuk']            (design/architecture)
└── yashas-only/[category]/[project-slug]/      → portfolioVisibility: ['yashas']               (construction execution)
```

**Import-script rule (for `scripts/upload-*.mjs`):** derive the flag from the path's first segment after `projects/`:

| First path segment | `portfolioVisibility` set on the Sanity `project` doc |
|---|---|
| `shared/` | `['suvasthuk','yashas']` |
| `suvasthuk-only/` | `['suvasthuk']` |
| `yashas-only/` | `['yashas']` |

Re-mapping the existing archive (CATEGORY-MAPPING §2) onto this: architecture `houses/`, `appartment/`, `commercial buildings/`, `school/` → `suvasthuk-only/` (or `shared/` where Yashas also built them); the `site photos/` in-progress construction shots → **`yashas-only/`**. Joint projects where Suvasthuk designed *and* Yashas built go in `shared/` and surface in both portals from a single document.

The old category → `constructionProject` mapping in §2 is superseded: construction projects are now `project` documents with `portfolioVisibility: ['yashas']`, living under `yashas-only/`.

---

*Companion: SOP-ADD-CATEGORY.md (step-by-step procedures) · CONTENT-MASTER.md Block 3-4*
