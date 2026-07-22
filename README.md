# Suvasthuk Architects

Marketing and portfolio website for **Suvasthuk Architects** (Bengaluru) — architecture,
interior design, and construction. Live at [suvasthuk.com](https://suvasthuk.com).

Built with **Next.js 14 (App Router)** and a **Sanity** CMS backend. All portfolio content
(projects, blog posts, testimonials) is managed through Sanity Studio, which is embedded in
the app itself at `/studio`.

---

## Tech stack

| Area        | Choice                                                        |
| ----------- | ------------------------------------------------------------- |
| Framework   | Next.js 14 (App Router), React 18, TypeScript                 |
| Styling     | Tailwind CSS + styled-components                              |
| CMS         | Sanity v3 (embedded Studio at `/studio`)                      |
| Animation   | Framer Motion, GSAP, Lenis (smooth scroll)                    |
| Email       | Resend (contact form → email)                                 |
| Icons       | lucide-react                                                  |

---

## Project structure

The Git repo root contains the app plus some archived assets. **The actual application lives
in `suvasthuk-next/`** — that's where you run all commands.

```
Suvasthuk_Architects/
├── CNAME                    # Custom domain (suvasthuk.com)
├── _archive/                # Unused / original source images (not shipped)
├── docs/                    # Design notes & specs
└── suvasthuk-next/          # ← THE APP. cd here for everything below.
    ├── app/                 # Next.js App Router — one folder per route
    │   ├── page.tsx         # Homepage
    │   ├── about/
    │   ├── projects/        # Architecture portfolio  (+ [slug] detail pages)
    │   ├── services/
    │   ├── construction/    # Construction division (projects, services)
    │   ├── blog/            # Blog index + [slug] articles
    │   ├── contact/
    │   ├── studio/          # Sanity Studio (CMS admin) — /studio
    │   └── api/contact/     # Contact form handler (Resend)
    ├── components/          # React components, grouped by area
    │   ├── home/            # Homepage sections (Hero, Mosaic, Services…)
    │   ├── construction/    # Construction-page sections
    │   ├── projects/        # Portfolio grid, cards, galleries
    │   ├── layout/          # Navbar, Footer, SiteShell, WhatsApp button
    │   ├── animations/      # Cursor, scroll reveal, Lenis provider
    │   ├── ui/              # Reusable bits (Lightbox, Breadcrumb…)
    │   └── seo/             # JSON-LD schema components
    ├── sanity/              # CMS config
    │   ├── schemaTypes/     # Content models: project, blogPost,
    │   │                    #   constructionProject, testimonial
    │   └── lib/             # Sanity client, GROQ queries, image URL builder
    ├── lib/                 # Shared helpers
    ├── public/images/       # Static images (hero, logo) — see below
    ├── scripts/             # One-off bulk image/content upload scripts
    └── .env.local           # Secrets (see below) — NOT for a public repo
```

---

## Running locally

**Prerequisites:** Node.js 18.17+ (Node 20 LTS recommended) and npm.

```bash
cd suvasthuk-next
npm install
npm run dev
```

Open **http://localhost:3000** for the site and **http://localhost:3000/studio** for the CMS.

### Scripts

| Command         | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the dev server (hot reload)         |
| `npm run build` | Production build                          |
| `npm run start` | Serve the production build                |
| `npm run lint`  | Run ESLint                                |

### Environment variables

Copy the keys below into `suvasthuk-next/.env.local` (this repo is private and already
includes a working `.env.local`, but here's what each value is):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=   # Sanity project id (public, safe)
NEXT_PUBLIC_SANITY_DATASET=      # usually "production" (public, safe)
RESEND_API_KEY=                  # SECRET — sends contact-form email
SANITY_WRITE_TOKEN=              # SECRET — write access to the CMS
```

> ⚠️ `RESEND_API_KEY` and `SANITY_WRITE_TOKEN` are live secrets. Keep the repo private and
> never paste them anywhere public. If they leak, rotate them in the Resend and Sanity
> dashboards.

---

## Content & the CMS

All portfolio content is stored in **Sanity**, edited through the Studio at
[localhost:3000/studio](http://localhost:3000/studio) (or the deployed `/studio`).

Content types (defined in `suvasthuk-next/sanity/schemaTypes/`):

- **Project** — architecture/interior portfolio entries (cover image + gallery, category,
  area, location, year, design story). `featured: true` shows it on the homepage mosaic.
- **Construction Project** — construction-division portfolio.
- **Blog Post** — articles.
- **Testimonial** — client quotes.

---

## How to add images

There are **two kinds** of images on this site. Pick based on what you're changing.

### 1. Portfolio / content images → via Sanity Studio (the normal way)

Any image tied to a project, blog post, or testimonial goes through the CMS. **No code
changes needed.**

1. Run `npm run dev` and open **http://localhost:3000/studio**.
2. Pick a document type (e.g. **Project**) and open or create an entry.
3. Upload the **Cover Image** and drag images into the **Gallery** field.
   - The image picker supports drag-to-crop / hotspot so thumbnails stay well-composed.
4. **Publish**. The site reads the change automatically — no redeploy required.

Images are served and resized on the fly through Sanity's CDN via `urlFor()`
(`sanity/lib/image.ts`), so upload the highest-quality file you have and let Sanity handle
sizing.

### 2. Bulk uploading many images at once → scripts

For seeding a whole folder of images into new project documents, use the scripts in
`suvasthuk-next/scripts/` (e.g. `upload-architecture.mjs`). Each script points at a local
image folder (edit the `BASE` path near the top) and creates/populates Sanity documents.

Run one with the secrets loaded from `.env.local`:

```bash
cd suvasthuk-next
node --env-file=.env.local scripts/upload-architecture.mjs
```

> These are one-off migration helpers — they need `SANITY_WRITE_TOKEN` and will create real
> CMS documents. Read the script and adjust the `BASE` folder and the `PROJECTS` list before
> running.

### 3. Fixed site images (hero, logo) → `public/images/`

A handful of images aren't CMS-managed — the homepage hero slides and the logo. These live
in `suvasthuk-next/public/images/`:

```
public/images/
├── hero/     # hero-1.jpg … hero-6.jpg  (homepage hero slideshow)
├── Logo/     # logo.jpg
└── Projects/ # misc static project images
```

To change one, replace the file (keep the same name) or add a new file and reference it in
the component with a root-relative path, e.g. `/images/hero/hero-1.jpg`. These are baked in
at build time, so changing them **does** require a rebuild/redeploy.

---

## Deployment

The site targets the custom domain **suvasthuk.com** (see `CNAME`). Build with
`npm run build` and deploy the `suvasthuk-next/` app to your host (Vercel is the natural fit
for Next.js). Remember to set the four environment variables above in the host's dashboard.
