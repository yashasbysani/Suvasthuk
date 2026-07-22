# Construction Mode + Toggle System — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Construction mode to the existing Suvasthuk Architects website — a fully separate dark-themed experience at `/construction` — with a smooth fade toggle in the navbar that switches between Architecture and Construction modes.

**Architecture:** Hybrid routing (Option C). Architecture lives at `/`, Construction at `/construction/*`. A `SiteModeContext` reads `usePathname()` to set `mode` automatically. The Navbar switches theme, links, and CTA based on mode. Page content fades via CSS `opacity` transition (0.7s).

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Sanity v3, GSAP (hero), Lenis (scroll), `@portabletext/react`

---

## Colour Tokens

### New (Construction)
| Token | Value | Usage |
|---|---|---|
| `cement` | `#A5A391` | Stats band bg, all buttons, tags, accents, step borders |
| `cement-dark` | `#8e8c7f` | Cement hover states |
| `concrete` | `#1e1d1c` | Navbar, Hero, Projects, CTA Band, Footer bg |
| `concrete-deep` | `#161514` | Services, Process section bg (darker alternating sections) |

### Unchanged (Architecture)
`sand`, `sand-dark`, `cream`, `brown-deep`, `brown-mid`, `brown-light`, `gold`, `gold-dark`, `charcoal` — all untouched.

### Construction Text
- Headings: `#f0ede8` (off-white)
- Body/subtext: `#888888` (dust)
- Tags/accents: `#A5A391` (cement)

---

## Routing Map

| Route | Mode | Notes |
|---|---|---|
| `/` | Architecture | Existing homepage, unchanged |
| `/projects`, `/projects/[slug]` | Architecture | Unchanged |
| `/services`, `/services/[slug]` | Architecture | Unchanged |
| `/blog`, `/blog/[slug]` | Architecture | Shared |
| `/about` | Shared | Adapts navbar mode from pathname |
| `/contact` | Shared | Adapts navbar mode from pathname |
| `/construction` | Construction | New homepage |
| `/construction/projects` | Construction | New masonry listing |
| `/construction/projects/[slug]` | Construction | New case study page |
| `/construction/services` | Construction | New services listing |

---

## SiteModeContext

**File:** `context/SiteModeContext.tsx`

```tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type Mode = 'architecture' | 'construction'
const SiteModeContext = createContext<Mode>('architecture')

export function SiteModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const mode: Mode = pathname.startsWith('/construction') ? 'construction' : 'architecture'
  return <SiteModeContext.Provider value={mode}>{children}</SiteModeContext.Provider>
}

export const useSiteMode = () => useContext(SiteModeContext)
```

Wrap in `app/layout.tsx` inside `LenisProvider`:
```tsx
<LenisProvider>
  <SiteModeProvider>
    <Navbar />
    {children}
    <Footer />
    <WhatsAppButton />
  </SiteModeProvider>
</LenisProvider>
```

---

## Navbar Changes

**File:** `components/layout/Navbar.tsx` (modify existing)

The navbar reads `useSiteMode()` and applies two class sets:

### Scrolled background
- Architecture: `bg-sand/95 backdrop-blur-sm border-b border-sand-dark`
- Construction: `bg-concrete/95 backdrop-blur-sm border-b border-concrete-deep`

### Logo text colour
- Architecture: `text-brown-deep`
- Construction: `text-sand`

### Nav links
- Architecture: existing links (Work, Services, About, Blog)
- Construction: Construction-specific links (Projects → `/construction/projects`, Services → `/construction/services`, About → `/about`, Contact → `/contact`)

### Toggle pill (new, sits between nav links and CTA)
```tsx
<div className={`flex rounded-full p-[3px] gap-[2px] ${
  mode === 'architecture' ? 'bg-sand-dark' : 'bg-concrete-deep'
}`}>
  <button onClick={() => router.push('/')}
    className={mode === 'architecture'
      ? 'pill active: bg-white text-brown-deep shadow-sm'
      : 'pill inactive: text-brown-light'}>
    Architecture
  </button>
  <button onClick={() => router.push('/construction')}
    className={mode === 'construction'
      ? 'pill active: bg-cement text-concrete font-bold shadow-sm'
      : 'pill inactive: text-dust'}>
    Construction
  </button>
</div>
```

### CTA button
- Architecture: `bg-brown-deep text-sand` — "Get in Touch" → `/contact`
- Construction: `bg-cement text-concrete font-bold` — "Get a Quote" → `/contact?mode=construction`

### Fade transition
Wrap `{children}` in `app/layout.tsx` with:
```tsx
<div className="transition-opacity duration-700">
  {children}
</div>
```
Navbar uses `transition-all duration-700` on its bg/text classes.

---

## Construction Home Page (`/construction/page.tsx`)

Server component, `revalidate = 3600`. Fetches `getConstructionProjects()` and `getTestimonials()` from Sanity. Falls back to static data when Sanity not configured.

### Section order
1. `ConstructionHero` 
2. `ConstructionStatsBar`
3. `ConstructionServices`
4. `ConstructionProjects` (mosaic, max 5)
5. `ConstructionProcess`
6. `Testimonial` (existing component, add `dark?: boolean` prop — when `true`: bg `bg-concrete-deep`, heading `text-[#f0ede8]`, body `text-[#888]`, quote marks `text-cement`)
7. `ConstructionCtaBand`

---

## Component Specs

### `ConstructionHero`
**File:** `components/construction/ConstructionHero.tsx`

- Background: `bg-concrete` with `bg-gradient-to-br from-[#3a3830] to-concrete` overlay + subtle horizontal line texture (`repeating-linear-gradient`)
- Tag: `text-cement text-[9px] tracking-[3px] uppercase` — "Construction Services · Bangalore"
- H1: `font-serif text-4xl md:text-6xl font-bold text-[#f0ede8] leading-tight` — "Built to last. Delivered on time."
- Body: `font-sans text-[15px] text-[#888] leading-relaxed max-w-xl` — "30+ years of reliable construction across Bangalore. Residential, commercial, and turnkey projects — executed with precision."
- CTA row: `bg-cement text-concrete` "Get a Quote →" + text link "View Projects"
- Same GSAP letterbox entrance animation as architecture Hero (top/bottom bars)

### `ConstructionStatsBar`
**File:** `components/construction/ConstructionStatsBar.tsx`

- Background: `bg-cement`
- 4 stats: `1024+` Projects Built / `30+` Years Experience / `826+` Satisfied Clients / `1993` Year Founded
- Numbers: `font-serif text-3xl font-bold text-concrete`
- Labels: `font-sans text-[9px] tracking-[3px] uppercase text-[#3a3830]`

### `ConstructionServices`
**File:** `components/construction/ConstructionServices.tsx`

- Background: `bg-concrete-deep`
- 6 service cards on `bg-concrete` with `border border-[#2a2a2a]` and cement dot accent
- Services: Residential Construction, Commercial Construction, Turnkey Projects, Project Management, Renovation, Institutional
- Each card: cement square dot, bold name, short description, "Learn more →" in cement

### `ConstructionProjects`
**File:** `components/construction/ConstructionProjects.tsx`

- Same asymmetric mosaic layout as `ProjectsMosaic` (1 tall left + 4 grid right)
- Pulls from `constructionProject` Sanity type
- Static fallback: 5 entries using `/images/project-1.jpg` through `/images/project-5.jpg`
- Card overlay: `bg-gradient-to-t from-concrete/80` with title + category on hover
- "All Projects →" link to `/construction/projects`

### `ConstructionProcess`
**File:** `components/construction/ConstructionProcess.tsx`

- Background: `bg-concrete-deep`
- 4 numbered steps in a row (stacked on mobile), each: `border-t-2 border-cement`
- Steps: `01 Consultation` / `02 Planning` / `03 Execution` / `04 Delivery`
- Each step has step number in cement, bold title in off-white, 1-line description in dust

### `ConstructionCtaBand`
**File:** `components/construction/ConstructionCtaBand.tsx`

- Background: `bg-concrete border-t border-[#2a2a2a]`
- H2: "Ready to start building?" in `font-serif text-3xl text-[#f0ede8]`
- CTA button: `bg-cement text-concrete font-bold` — "Start Your Project →" → `/contact?mode=construction`

---

## Construction Projects Page (`/construction/projects/page.tsx`)

- Reuses `MasonryGrid` + `ProjectCard` with `localImage` support
- Fetches `getAllConstructionProjects()` from Sanity
- Static fallback: all 12 `project-*.jpg` images tagged as construction

## Construction Project Case Study (`/construction/projects/[slug]/page.tsx`)

Same structure as architecture case study:
- Dark hero with cover image + `bg-gradient-to-t from-concrete/80`
- Stats bar: Location, Area (sqft), Completion Year, Category
- PortableText body with dark `prose` variant
- Image gallery (if provided)
- CTA band: "Start a similar project →"

## Construction Services Page (`/construction/services/page.tsx`)

- Lists 6 construction services (same as homepage grid, expanded with longer descriptions)
- Dark theme: `bg-concrete` page, `bg-concrete-deep` cards

---

## Sanity Schema — `constructionProject`

**File:** `sanity/schemas/constructionProject.ts`

```typescript
export default {
  name: 'constructionProject',
  title: 'Construction Project',
  type: 'document',
  fields: [
    { name: 'title',          type: 'string',    title: 'Project Title' },
    { name: 'slug',           type: 'slug',      title: 'Slug', options: { source: 'title' } },
    { name: 'category',       type: 'string',    title: 'Category',
      options: { list: ['residential','commercial','turnkey','renovation','institutional'] } },
    { name: 'coverImage',     type: 'image',     title: 'Cover Image', options: { hotspot: true } },
    { name: 'location',       type: 'string',    title: 'Location (e.g. Whitefield, Bangalore)' },
    { name: 'area',           type: 'string',    title: 'Built-up Area (e.g. 4200 sqft)' },
    { name: 'completionYear', type: 'number',    title: 'Completion Year' },
    { name: 'description',    type: 'text',      title: 'Short Description (for cards)' },
    { name: 'body',           type: 'array',     title: 'Case Study Body',
      of: [{ type: 'block' }, { type: 'image' }] },
  ],
}
```

Register in `sanity/schema.ts` alongside existing types.

---

## Sanity Queries — New Functions in `sanity/lib/queries.ts`

```typescript
export async function getAllConstructionProjects(): Promise<ConstructionProject[]> {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type == "constructionProject"] | order(_createdAt desc) {
    title, slug, category, coverImage, location, area, completionYear, description
  }`)
}

export async function getConstructionProjectBySlug(slug: string) {
  if (!isSanityConfigured) return null
  return client.fetch(`*[_type == "constructionProject" && slug.current == $slug][0] {
    title, slug, category, coverImage, location, area, completionYear, description, body
  }`, { slug })
}

export async function getFeaturedConstructionProjects(): Promise<ConstructionProject[]> {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type == "constructionProject"] | order(_createdAt desc)[0...5] {
    title, slug, category, coverImage, location, area, description
  }`)
}
```

---

## SEO

### `/construction/page.tsx` metadata
```typescript
export const metadata: Metadata = {
  title: 'Construction Company in Bangalore | Suvasthuk Architects',
  description: 'Trusted construction company in Bangalore since 1993. Residential, commercial & turnkey construction. 1024+ projects delivered. Get a free quote.',
}
```

### `/construction/projects/page.tsx` metadata
```typescript
export const metadata: Metadata = {
  title: 'Construction Portfolio | Suvasthuk Architects Bangalore',
  description: 'Browse our construction portfolio — residential villas, commercial buildings, turnkey projects across Bangalore and Karnataka.',
}
```

### Construction LocalBusiness JSON-LD
Add a second `<LocalBusinessSchema />` variant at `/construction` routes with `@type: ["LocalBusiness", "GeneralContractor"]` and construction-specific description.

### Sitemap
`next-sitemap.config.js` already crawls all pages — `/construction/*` routes will be auto-included. Add manual priority entries:
- `/construction` → priority `0.95`
- `/construction/projects` → priority `0.85`
- `/construction/services` → priority `0.80`

---

## Tailwind Config Changes

Add to `tailwind.config.ts` under `theme.extend.colors`:
```typescript
cement:          '#A5A391',
'cement-dark':   '#8e8c7f',
concrete:        '#1e1d1c',
'concrete-deep': '#161514',
```

---

## Files Created / Modified

### New files
- `context/SiteModeContext.tsx`
- `components/construction/ConstructionHero.tsx`
- `components/construction/ConstructionStatsBar.tsx`
- `components/construction/ConstructionServices.tsx`
- `components/construction/ConstructionProjects.tsx`
- `components/construction/ConstructionProcess.tsx`
- `components/construction/ConstructionCtaBand.tsx`
- `app/construction/page.tsx`
- `app/construction/projects/page.tsx`
- `app/construction/projects/[slug]/page.tsx`
- `app/construction/services/page.tsx`
- `sanity/schemas/constructionProject.ts`

### Modified files
- `app/layout.tsx` — wrap with `SiteModeProvider`, add page fade wrapper
- `components/layout/Navbar.tsx` — add toggle pill, mode-aware theming
- `sanity/schema.ts` — register `constructionProject`
- `sanity/lib/queries.ts` — add 3 new query functions
- `tailwind.config.ts` — add 4 new colour tokens
- `next-sitemap.config.js` — add construction route priorities
