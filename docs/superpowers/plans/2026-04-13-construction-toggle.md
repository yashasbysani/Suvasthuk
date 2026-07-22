# Construction Mode + Toggle System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Construction mode at `/construction` with a dark cement-themed homepage, projects, and services pages, plus a fade toggle pill in the navbar that switches between Architecture and Construction modes.

**Architecture:** Hybrid routing — Architecture at `/`, Construction at `/construction/*`. `SiteModeContext` reads `usePathname()` to set mode automatically. Navbar and all construction components read from this context. Construction has its own Sanity schema (`constructionProject`) and query functions.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Sanity v3, GSAP, Lenis, `@portabletext/react`

**Working directory for all commands:** `suvasthuk-next/` inside the worktree.

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `context/SiteModeContext.tsx` | Provides `mode` via pathname, exposes `useSiteMode()` |
| `sanity/schemaTypes/constructionProject.ts` | Sanity document type for construction projects |
| `components/construction/ConstructionHero.tsx` | Dark hero with GSAP letterbox animation |
| `components/construction/ConstructionStatsBar.tsx` | Cement bg stats band |
| `components/construction/ConstructionServices.tsx` | 6-card services grid |
| `components/construction/ConstructionProcess.tsx` | 4-step process section |
| `components/construction/ConstructionCtaBand.tsx` | Dark CTA band |
| `components/construction/ConstructionProjects.tsx` | Asymmetric mosaic for construction projects |
| `app/construction/page.tsx` | Construction homepage (server, ISR) |
| `app/construction/projects/page.tsx` | Construction projects listing |
| `app/construction/projects/[slug]/page.tsx` | Construction case study |
| `app/construction/services/page.tsx` | Construction services listing |

### Modified files
| File | Change |
|---|---|
| `tailwind.config.ts` | Add 4 colour tokens: cement, cement-dark, concrete, concrete-deep |
| `app/layout.tsx` | Wrap with SiteModeProvider, add page fade div |
| `app/globals.css` | Add `@keyframes fadeIn` + `.page-fade` class |
| `components/layout/Navbar.tsx` | Toggle pill + mode-aware theming |
| `components/home/Testimonial.tsx` | Add optional `dark` prop |
| `sanity/sanity.config.ts` | Register constructionProject schema |
| `sanity/lib/queries.ts` | Add ConstructionProject type + 3 query functions |
| `next-sitemap.config.js` | Add `/construction` route priorities |

---

## Task 1: Tailwind colour tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add the 4 new tokens**

Open `tailwind.config.ts`. Inside `theme.extend.colors`, add after the existing `charcoal` entry:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sand:            '#f2ede7',
        'sand-dark':     '#e8ddd2',
        cream:           '#ffffff',
        'brown-deep':    '#2c2420',
        'brown-mid':     '#7a6a5a',
        'brown-light':   '#9a8a7a',
        gold:            '#c4a882',
        'gold-dark':     '#9a7a5a',
        charcoal:        '#1a1210',
        cement:          '#A5A391',
        'cement-dark':   '#8e8c7f',
        concrete:        '#1e1d1c',
        'concrete-deep': '#161514',
      },
      fontFamily: {
        serif: ['var(--font-libre-baskerville)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
```

- [ ] **Step 2: Verify build still compiles**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ Compiled` with no errors.

- [ ] **Step 3: Commit**

```bash
git add suvasthuk-next/tailwind.config.ts
git commit -m "feat: add cement and concrete colour tokens for construction mode"
```

---

## Task 2: SiteModeContext

**Files:**
- Create: `context/SiteModeContext.tsx`

- [ ] **Step 1: Create the file**

```typescript
// suvasthuk-next/context/SiteModeContext.tsx
'use client'

import { createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'

export type SiteMode = 'architecture' | 'construction'

const SiteModeContext = createContext<SiteMode>('architecture')

export function SiteModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const mode: SiteMode = pathname.startsWith('/construction') ? 'construction' : 'architecture'
  return (
    <SiteModeContext.Provider value={mode}>
      {children}
    </SiteModeContext.Provider>
  )
}

export const useSiteMode = () => useContext(SiteModeContext)
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add suvasthuk-next/context/SiteModeContext.tsx
git commit -m "feat: add SiteModeContext — sets mode from pathname automatically"
```

---

## Task 3: Update layout.tsx + globals.css (page fade)

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add fadeIn animation to globals.css**

Open `app/globals.css` and append after the existing `@layer components` block:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-sand text-brown-deep font-sans antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-serif;
  }
}

@layer components {
  /* Hover ring effect on project/gallery images */
  [data-cursor="view"] {
    position: relative;
  }
  [data-cursor="view"]::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
    pointer-events: none;
    z-index: 10;
  }
  [data-cursor="view"]:hover::after {
    border-color: rgba(196, 168, 130, 0.6); /* gold/60 */
  }

  /* Page transition fade-in */
  .page-fade {
    animation: fadeIn 0.7s ease both;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

- [ ] **Step 2: Update app/layout.tsx**

```typescript
// suvasthuk-next/app/layout.tsx
import type { Metadata } from 'next'
import { Libre_Baskerville, DM_Sans } from 'next/font/google'
import './globals.css'
import LenisProvider         from '@/components/animations/LenisProvider'
import CustomCursor          from '@/components/animations/CustomCursor'
import Navbar                from '@/components/layout/Navbar'
import Footer                from '@/components/layout/Footer'
import WhatsAppButton        from '@/components/layout/WhatsAppButton'
import LocalBusinessSchema   from '@/components/seo/LocalBusinessSchema'
import { SiteModeProvider }  from '@/context/SiteModeContext'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Suvasthuk Architects — Architects in Bangalore Since 1993',
    template: '%s — Suvasthuk Architects',
  },
  description:
    'Trusted architecture firm in Bangalore since 1993. Residential, commercial & interior design. 30+ years, 1000+ projects. Get a free consultation.',
  metadataBase: new URL('https://suvasthuk.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://suvasthuk.com',
    siteName: 'Suvasthuk Architects',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${dmSans.variable}`}>
      <head>
        <LocalBusinessSchema />
      </head>
      <body>
        <LenisProvider>
          <SiteModeProvider>
            <CustomCursor />
            <Navbar />
            <div className="page-fade">
              {children}
            </div>
            <Footer />
            <WhatsAppButton />
          </SiteModeProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ Compiled` with no errors.

- [ ] **Step 4: Commit**

```bash
git add suvasthuk-next/app/layout.tsx suvasthuk-next/app/globals.css
git commit -m "feat: wrap layout with SiteModeProvider and add page fade animation"
```

---

## Task 4: Navbar — toggle pill + mode-aware theming

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar with mode awareness**

```typescript
// suvasthuk-next/components/layout/Navbar.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link        from 'next/link'
import Image       from 'next/image'
import { useRouter } from 'next/navigation'
import { useSiteMode } from '@/context/SiteModeContext'

const ARCH_LINKS  = [
  { href: '/projects',  label: 'Work'     },
  { href: '/services',  label: 'Services' },
  { href: '/about',     label: 'About'    },
  { href: '/blog',      label: 'Blog'     },
]
const CONST_LINKS = [
  { href: '/construction/projects',  label: 'Projects' },
  { href: '/construction/services',  label: 'Services' },
  { href: '/about',                  label: 'About'    },
  { href: '/contact',                label: 'Contact'  },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const router  = useRouter()
  const mode    = useSiteMode()
  const isConst = mode === 'construction'
  const links   = isConst ? CONST_LINKS : ARCH_LINKS

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    if (mobileOpen) closeButtonRef.current?.focus()
  }, [mobileOpen])

  const scrolledBg = isConst
    ? 'bg-concrete/95 backdrop-blur-sm border-b border-concrete-deep'
    : 'bg-sand/95 backdrop-blur-sm border-b border-sand-dark'

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? scrolledBg : 'bg-transparent'
      }`}>
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href={isConst ? '/construction' : '/'} className="flex items-center gap-3 shrink-0">
            <Image src="/logo.svg" alt="Suvasthuk Architects logo" width={32} height={32} priority />
            <span className={`font-sans font-semibold text-[11px] tracking-[3px] uppercase transition-colors duration-500 ${
              isConst ? 'text-sand' : 'text-brown-deep'
            }`}>
              Suvasthuk
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`font-sans text-[10px] tracking-[2px] uppercase transition-colors duration-200 ${
                    isConst
                      ? 'text-[#888] hover:text-[#f0ede8]'
                      : 'text-brown-mid hover:text-brown-deep'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Toggle pill */}
          <div className={`hidden md:flex rounded-full p-[3px] gap-[2px] transition-colors duration-500 ${
            isConst ? 'bg-concrete-deep' : 'bg-sand-dark'
          }`}>
            <button
              onClick={() => router.push('/')}
              className={`font-sans text-[8px] tracking-[2px] uppercase px-3 py-[5px] rounded-full transition-all duration-300 ${
                !isConst
                  ? 'bg-white text-brown-deep shadow-sm font-semibold'
                  : 'text-brown-light hover:text-brown-mid bg-transparent'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => router.push('/construction')}
              className={`font-sans text-[8px] tracking-[2px] uppercase px-3 py-[5px] rounded-full transition-all duration-300 ${
                isConst
                  ? 'bg-cement text-concrete shadow-sm font-bold'
                  : 'text-brown-light hover:text-brown-mid bg-transparent'
              }`}
            >
              Construction
            </button>
          </div>

          {/* CTA */}
          <Link
            href={isConst ? '/contact?mode=construction' : '/contact'}
            className={`hidden md:inline-flex font-sans text-[10px] tracking-[2px] uppercase px-5 py-2.5 rounded transition-colors duration-300 shrink-0 ${
              isConst
                ? 'bg-cement text-concrete font-bold hover:bg-cement-dark'
                : 'bg-brown-deep text-sand hover:bg-brown-mid'
            }`}
          >
            {isConst ? 'Get a Quote' : 'Get in Touch'}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          >
            <span className={`w-6 h-px block ${isConst ? 'bg-sand' : 'bg-brown-deep'}`} />
            <span className={`w-4 h-px block ${isConst ? 'bg-sand' : 'bg-brown-deep'}`} />
            <span className={`w-6 h-px block ${isConst ? 'bg-sand' : 'bg-brown-deep'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-charcoal flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            ref={closeButtonRef}
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-6 right-6 font-sans text-[10px] tracking-[3px] uppercase text-sand/50 hover:text-sand transition-colors"
          >
            Close
          </button>

          {/* Mobile mode toggle */}
          <div className="flex rounded-full bg-concrete-deep p-[3px] gap-[2px] mb-10">
            <button
              onClick={() => { router.push('/'); setMobileOpen(false) }}
              className={`font-sans text-[8px] tracking-[2px] uppercase px-4 py-2 rounded-full transition-all duration-300 ${
                !isConst ? 'bg-white text-brown-deep font-semibold' : 'text-[#888]'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => { router.push('/construction'); setMobileOpen(false) }}
              className={`font-sans text-[8px] tracking-[2px] uppercase px-4 py-2 rounded-full transition-all duration-300 ${
                isConst ? 'bg-cement text-concrete font-bold' : 'text-[#888]'
              }`}
            >
              Construction
            </button>
          </div>

          <ul className="flex flex-col items-center gap-8">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-4xl font-normal text-sand hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={isConst ? '/contact?mode=construction' : '/contact'}
                onClick={() => setMobileOpen(false)}
                className="mt-2 font-sans text-[10px] tracking-[3px] uppercase text-gold border-b border-gold pb-1"
              >
                {isConst ? 'Get a Quote →' : 'Get in Touch →'}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ Compiled` with no errors.

- [ ] **Step 3: Start dev server and check both modes**

```bash
npm run dev
```
Open `http://localhost:3001` — navbar should show Architecture pill active, sand background.
Open `http://localhost:3001/construction` — navbar should switch to dark bg, Construction pill active in cement colour.

- [ ] **Step 4: Commit**

```bash
git add suvasthuk-next/components/layout/Navbar.tsx
git commit -m "feat: add mode-aware navbar with Architecture/Construction toggle pill"
```

---

## Task 5: constructionProject Sanity schema

**Files:**
- Create: `sanity/schemaTypes/constructionProject.ts`
- Modify: `sanity/sanity.config.ts`

- [ ] **Step 1: Create the schema file**

```typescript
// suvasthuk-next/sanity/schemaTypes/constructionProject.ts
import { defineField, defineType } from 'sanity'

export const constructionProject = defineType({
  name: 'constructionProject',
  title: 'Construction Project',
  type: 'document',
  fields: [
    defineField({ name: 'title',    type: 'string', title: 'Project Title',  validation: r => r.required() }),
    defineField({ name: 'slug',     type: 'slug',   title: 'Slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({
      name: 'category', type: 'string', title: 'Category',
      options: { list: ['residential', 'commercial', 'turnkey', 'renovation', 'institutional'] },
      validation: r => r.required(),
    }),
    defineField({ name: 'coverImage',     type: 'image',  title: 'Cover Image', options: { hotspot: true } }),
    defineField({ name: 'location',       type: 'string', title: 'Location (e.g. Whitefield, Bangalore)' }),
    defineField({ name: 'area',           type: 'string', title: 'Built-up Area (e.g. 4200 sqft)' }),
    defineField({ name: 'completionYear', type: 'number', title: 'Completion Year' }),
    defineField({ name: 'description',    type: 'text',   title: 'Short Description (for cards)', rows: 3 }),
    defineField({
      name: 'body', type: 'array', title: 'Case Study Body',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'featured', type: 'boolean', title: 'Show on construction homepage', initialValue: false }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'category' },
  },
})
```

- [ ] **Step 2: Register in sanity.config.ts**

```typescript
// suvasthuk-next/sanity/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool }    from '@sanity/vision'
import { project }              from './schemaTypes/project'
import { blogPost }             from './schemaTypes/blogPost'
import { testimonial }          from './schemaTypes/testimonial'
import { constructionProject }  from './schemaTypes/constructionProject'

export default defineConfig({
  name: 'suvasthuk',
  title: 'Suvasthuk Architects CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: [project, blogPost, testimonial, constructionProject] },
})
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ Compiled` with no errors.

- [ ] **Step 4: Commit**

```bash
git add suvasthuk-next/sanity/schemaTypes/constructionProject.ts suvasthuk-next/sanity/sanity.config.ts
git commit -m "feat: add constructionProject Sanity schema"
```

---

## Task 6: Sanity queries for construction projects

**Files:**
- Modify: `sanity/lib/queries.ts`

- [ ] **Step 1: Add type + 3 query functions**

Append to the bottom of `sanity/lib/queries.ts`:

```typescript
// --- Construction Projects ---

export type ConstructionProject = {
  title:          string
  slug:           { current: string }
  category:       string
  coverImage?:    { asset: { _ref: string }; hotspot?: unknown }
  localImage?:    string
  location?:      string
  area?:          string
  completionYear?: number
  description?:   string
}

export async function getFeaturedConstructionProjects(): Promise<ConstructionProject[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type=="constructionProject" && featured==true] | order(_createdAt desc)[0...5] {
      title, slug, category, coverImage, location, area, completionYear, description
    }`
  )
}

export async function getAllConstructionProjects(): Promise<ConstructionProject[]> {
  if (!isSanityConfigured) return []
  return client.fetch(
    `*[_type=="constructionProject"] | order(_createdAt desc) {
      title, slug, category, coverImage, location, area, completionYear, description
    }`
  )
}

export async function getConstructionProjectBySlug(slug: string) {
  if (!isSanityConfigured) return null
  return client.fetch(
    `*[_type=="constructionProject" && slug.current==$slug][0] {
      title, slug, category, coverImage, location, area, completionYear, description, body
    }`,
    { slug }
  )
}

export async function getAllConstructionProjectSlugs() {
  if (!isSanityConfigured) return []
  return client.fetch(`*[_type=="constructionProject"]{ "slug": slug.current }`)
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add suvasthuk-next/sanity/lib/queries.ts
git commit -m "feat: add construction project Sanity query functions"
```

---

## Task 7: ConstructionHero

**Files:**
- Create: `components/construction/ConstructionHero.tsx`

- [ ] **Step 1: Create the component**

```typescript
// suvasthuk-next/components/construction/ConstructionHero.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link  from 'next/link'
import gsap  from 'gsap'

export default function ConstructionHero() {
  const topBarRef    = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const tagRef       = useRef<HTMLParagraphElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      gsap.set([tagRef.current, titleRef.current, ctaRef.current], { opacity: 1, y: 0 })
      return
    }

    gsap.set([topBarRef.current, bottomBarRef.current], { scaleY: 1 })
    gsap.set([tagRef.current, titleRef.current, ctaRef.current], { opacity: 0, y: 30 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
    tl
      .to(topBarRef.current,    { scaleY: 0, duration: 1.4, transformOrigin: 'top center' }, 0.3)
      .to(bottomBarRef.current, { scaleY: 0, duration: 1.4, transformOrigin: 'bottom center' }, 0.3)
      .to(tagRef.current,       { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.3)
      .to(titleRef.current,     { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 1.5)
      .to(ctaRef.current,       { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.8)

    return () => { tl.kill() }
  }, [])

  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden bg-concrete">
      {/* Background gradient + texture */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(150deg, #3a3830 0%, #1e1d1c 65%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(165,163,145,0.5) 3px, rgba(165,163,145,0.5) 4px)',
        }}
      />

      {/* Letterbox bars */}
      <div ref={topBarRef}    className="absolute inset-x-0 top-0    h-2/5 bg-concrete z-10 origin-top" />
      <div ref={bottomBarRef} className="absolute inset-x-0 bottom-0 h-2/5 bg-concrete z-10 origin-bottom" />

      {/* Ghost year counter */}
      <div aria-hidden="true" className="absolute right-8 top-1/2 -translate-y-1/2 text-right pointer-events-none z-20 select-none">
        <span className="font-serif text-[80px] md:text-[120px] font-normal leading-none text-cement/[0.05]">30</span>
        <p className="font-sans text-[8px] tracking-[4px] uppercase text-cement/20 mt-1">Years of craft</p>
      </div>

      {/* Bengaluru pill badge */}
      <div className="absolute top-24 right-6 z-20 border border-cement/30 rounded-full px-4 py-1.5 bg-cement/10 backdrop-blur-sm">
        <span className="font-sans text-[9px] tracking-[3px] uppercase text-cement">Bengaluru · Est. 1993</span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end pb-20 px-6 md:px-12">
        <div>
          <p ref={tagRef} className="font-sans text-[9px] tracking-[4px] uppercase text-cement mb-4">
            Construction Services · Bangalore
          </p>
          <h1 ref={titleRef} className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-[#f0ede8] leading-tight max-w-2xl">
            Built to last.<br />
            <em className="font-normal">Delivered on time.</em>
          </h1>
          <div ref={ctaRef} className="flex items-center gap-6 mt-8">
            <Link
              href="/contact?mode=construction"
              className="font-sans text-[10px] tracking-[3px] uppercase bg-cement text-concrete font-bold px-6 py-3 rounded hover:bg-cement-dark transition-colors"
            >
              Get a Quote
            </Link>
            <Link
              href="/construction/projects"
              className="font-sans text-[10px] tracking-[3px] uppercase text-[#f0ede8] border-b border-cement pb-1 hover:text-cement transition-colors"
            >
              View Projects →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ Compiled` with no errors.

- [ ] **Step 3: Commit**

```bash
git add suvasthuk-next/components/construction/ConstructionHero.tsx
git commit -m "feat: add ConstructionHero with GSAP letterbox animation"
```

---

## Task 8: ConstructionStatsBar

**Files:**
- Create: `components/construction/ConstructionStatsBar.tsx`

- [ ] **Step 1: Create the component**

```typescript
// suvasthuk-next/components/construction/ConstructionStatsBar.tsx
import ScrollReveal from '@/components/animations/ScrollReveal'

const STATS = [
  { value: '1024+', label: 'Projects Built'     },
  { value: '30+',   label: 'Years Experience'   },
  { value: '826+',  label: 'Satisfied Clients'  },
  { value: '1993',  label: 'Year Founded'       },
]

export default function ConstructionStatsBar() {
  return (
    <section className="bg-cement py-10">
      <div className="max-w-content mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-cement-dark rounded-lg overflow-hidden">
        {STATS.map(({ value, label }, i) => (
          <ScrollReveal key={label} delay={i * 0.08}>
            <div className="bg-cement px-6 py-8 text-center">
              <p className="font-serif text-3xl font-bold text-concrete">{value}</p>
              <p className="font-sans text-[9px] tracking-[3px] uppercase text-[#3a3830] mt-2">{label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add suvasthuk-next/components/construction/ConstructionStatsBar.tsx
git commit -m "feat: add ConstructionStatsBar (cement bg, dark text)"
```

---

## Task 9: ConstructionServices

**Files:**
- Create: `components/construction/ConstructionServices.tsx`

- [ ] **Step 1: Create the component**

```typescript
// suvasthuk-next/components/construction/ConstructionServices.tsx
import Link         from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'

const SERVICES = [
  { name: 'Residential Construction', desc: 'Villas, apartments, and row houses — built to your specification.',   slug: 'residential-construction' },
  { name: 'Commercial Construction',  desc: 'Offices, retail spaces, and mixed-use buildings across Bangalore.',   slug: 'commercial-construction'  },
  { name: 'Turnkey Projects',         desc: 'Design-to-delivery under a single contract. Zero coordination stress.', slug: 'turnkey-projects'         },
  { name: 'Project Management',       desc: 'Expert site supervision and contractor coordination.',                 slug: 'project-management'       },
  { name: 'Renovation',               desc: 'Structural upgrades, refits, and complete space transformations.',     slug: 'renovation'               },
  { name: 'Institutional',            desc: 'Schools, hospitals, and campuses built to last generations.',          slug: 'institutional'            },
]

export default function ConstructionServices() {
  return (
    <section className="py-20 md:py-28 bg-concrete-deep">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <ScrollReveal>
            <SectionHeading tag="What We Build" title="End-to-end construction<br /><strong>you can rely on</strong>" />
          </ScrollReveal>
          <Link
            href="/construction/services"
            className="font-sans text-[10px] tracking-[2px] uppercase text-cement hover:text-cement-dark transition-colors hidden md:block"
          >
            All Services →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 0.07}>
              <Link
                href={`/construction/services#${s.slug}`}
                className="block bg-concrete p-7 rounded-lg border border-[#2a2a2a] hover:border-cement/40 transition-colors group h-full"
              >
                <div className="w-3 h-3 rounded-sm bg-cement mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-lg text-[#f0ede8] mb-2">{s.name}</h3>
                <p className="font-sans text-[13px] text-[#888] leading-relaxed">{s.desc}</p>
                <p className="font-sans text-[10px] tracking-[2px] uppercase text-cement mt-4">Learn more →</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add suvasthuk-next/components/construction/ConstructionServices.tsx
git commit -m "feat: add ConstructionServices grid (6 cards, dark theme)"
```

---

## Task 10: ConstructionProcess

**Files:**
- Create: `components/construction/ConstructionProcess.tsx`

- [ ] **Step 1: Create the component**

```typescript
// suvasthuk-next/components/construction/ConstructionProcess.tsx
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'

const STEPS = [
  { num: '01', title: 'Consultation',  desc: 'We understand your goals, budget, and timeline before anything else.'       },
  { num: '02', title: 'Planning',      desc: 'Detailed drawings, approvals, material scheduling, and cost estimates.'     },
  { num: '03', title: 'Execution',     desc: 'Site work begins. Daily supervision ensures quality at every stage.'        },
  { num: '04', title: 'Delivery',      desc: 'Final inspection, handover documentation, and post-completion support.'     },
]

export default function ConstructionProcess() {
  return (
    <section className="py-20 md:py-28 bg-concrete-deep">
      <div className="max-w-content mx-auto px-6">
        <ScrollReveal className="mb-12">
          <SectionHeading tag="How We Work" title="Our four-step<br /><strong>build process</strong>" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map(({ num, title, desc }, i) => (
            <ScrollReveal key={num} delay={i * 0.1}>
              <div className="border-t-2 border-cement pt-6">
                <p className="font-sans text-[11px] tracking-[3px] uppercase text-cement font-bold mb-3">{num}</p>
                <h3 className="font-serif text-xl text-[#f0ede8] mb-3">{title}</h3>
                <p className="font-sans text-[13px] text-[#888] leading-relaxed">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add suvasthuk-next/components/construction/ConstructionProcess.tsx
git commit -m "feat: add ConstructionProcess 4-step section"
```

---

## Task 11: ConstructionCtaBand

**Files:**
- Create: `components/construction/ConstructionCtaBand.tsx`

- [ ] **Step 1: Create the component**

```typescript
// suvasthuk-next/components/construction/ConstructionCtaBand.tsx
import Link         from 'next/link'
import ScrollReveal from '@/components/animations/ScrollReveal'

export default function ConstructionCtaBand() {
  return (
    <section className="bg-concrete border-t border-[#2a2a2a] py-20 px-6">
      <div className="max-w-content mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#f0ede8] leading-tight">
            Ready to start<br />
            <strong className="text-cement">building?</strong>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <Link
            href="/contact?mode=construction"
            className="inline-block bg-cement text-concrete font-sans font-bold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-cement-dark transition-colors whitespace-nowrap"
          >
            Start Your Project →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add suvasthuk-next/components/construction/ConstructionCtaBand.tsx
git commit -m "feat: add ConstructionCtaBand"
```

---

## Task 12: ConstructionProjects

**Files:**
- Create: `components/construction/ConstructionProjects.tsx`

- [ ] **Step 1: Create the component**

```typescript
// suvasthuk-next/components/construction/ConstructionProjects.tsx
import Link         from 'next/link'
import Image        from 'next/image'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import { urlFor }   from '@/sanity/lib/queries'
import type { ConstructionProject } from '@/sanity/lib/queries'

const FALLBACK: ConstructionProject[] = [
  { title: 'Residential Villa, Whitefield',     category: 'residential', slug: { current: '#' }, localImage: '/images/project-1.jpg' },
  { title: 'Commercial Complex, Hebbal',         category: 'commercial',  slug: { current: '#' }, localImage: '/images/project-2.jpg' },
  { title: 'Turnkey Office, Indiranagar',        category: 'turnkey',     slug: { current: '#' }, localImage: '/images/project-3.jpg' },
  { title: 'School Campus, Yelahanka',           category: 'institutional', slug: { current: '#' }, localImage: '/images/project-4.jpg' },
  { title: 'Apartment Renovation, Koramangala',  category: 'renovation',  slug: { current: '#' }, localImage: '/images/project-5.jpg' },
]

function ProjectCard({ project, className = '' }: { project: ConstructionProject; className?: string }) {
  const href   = project.slug.current === '#' ? '/construction/projects' : `/construction/projects/${project.slug.current}`
  const imgUrl = project.coverImage
    ? urlFor(project.coverImage).width(800).height(600).url()
    : project.localImage ?? null

  return (
    <Link href={href} className={`block ${className}`}>
      <div
        data-cursor="view"
        className="relative overflow-hidden rounded-lg bg-concrete-deep h-full group"
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={project.title}
            fill
            sizes="(min-width:768px) 33vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cement/20 to-cement-dark/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-concrete/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="font-sans text-[8px] tracking-[3px] uppercase text-cement/70 mb-1 capitalize">
            {project.category}
          </p>
          <p className="font-serif text-lg text-[#f0ede8]">{project.title}</p>
        </div>
      </div>
    </Link>
  )
}

export default function ConstructionProjects({ projects }: { projects: ConstructionProject[] }) {
  const list     = projects.length ? projects : FALLBACK
  const featured = list.slice(0, 5)

  return (
    <section className="py-20 md:py-28 bg-concrete">
      <div className="max-w-content mx-auto px-6 mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <ScrollReveal>
          <SectionHeading tag="Our Work" title="Construction<br /><strong>case studies</strong>" />
        </ScrollReveal>
        <Link
          href="/construction/projects"
          className="font-sans text-[10px] tracking-[2px] uppercase text-cement hover:text-cement-dark transition-colors hidden md:block"
        >
          All Projects →
        </Link>
      </div>

      {/* Asymmetric mosaic */}
      <div className="max-w-content mx-auto px-6 grid md:grid-cols-3 gap-3">
        {featured[0] && (
          <ScrollReveal className="md:row-span-2">
            <ProjectCard
              project={featured[0]}
              className="h-full aspect-[3/4] md:aspect-auto md:h-full"
            />
          </ScrollReveal>
        )}
        {featured.slice(1).map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.08}>
            <div className="aspect-video">
              <ProjectCard project={p} className="h-full" />
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="max-w-content mx-auto px-6 mt-6 text-center">
        <Link
          href="/construction/projects"
          className="font-sans text-[10px] tracking-[2px] uppercase text-cement hover:text-cement-dark transition-colors border-b border-cement pb-1"
        >
          View all construction projects →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: `✓ Compiled` with no errors.

- [ ] **Step 3: Commit**

```bash
git add suvasthuk-next/components/construction/ConstructionProjects.tsx
git commit -m "feat: add ConstructionProjects asymmetric mosaic"
```

---

## Task 13: Add dark prop to Testimonial

**Files:**
- Modify: `components/home/Testimonial.tsx`

- [ ] **Step 1: Update Testimonial to accept dark prop**

```typescript
// suvasthuk-next/components/home/Testimonial.tsx
'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'

type TestimonialItem = {
  quote:     string
  author:    string
  location?: string
}

const STATIC_FALLBACK: TestimonialItem[] = [
  {
    quote: "Suvasthuk didn't just design our home — they understood how we live. The result is a space that feels completely ours.",
    author: 'Priya & Arvind Sharma',
    location: 'Residential Client · Jayanagar, Bengaluru',
  },
  {
    quote: "From sanction plans to final handover, the team was meticulous. Our school building exceeded every expectation.",
    author: 'Principal, Poorna Vikas Vidyalaya',
    location: 'Institutional Client · Bengaluru',
  },
]

export default function Testimonial({
  testimonials,
  dark = false,
}: {
  testimonials: TestimonialItem[]
  dark?:        boolean
}) {
  const list = testimonials.length ? testimonials : STATIC_FALLBACK
  const [active, setActive] = useState(0)
  const t = list[active] ?? list[0]

  return (
    <section
      aria-label="Client Testimonials"
      className={`py-20 md:py-28 text-center px-6 ${dark ? 'bg-concrete-deep' : 'bg-charcoal'}`}
    >
      <ScrollReveal direction="none">
        <p
          className={`font-serif text-6xl leading-none mb-4 select-none ${dark ? 'text-cement/20' : 'text-gold/20'}`}
          aria-hidden="true"
        >
          &ldquo;
        </p>
        <blockquote className={`font-serif text-xl md:text-2xl font-normal leading-relaxed max-w-2xl mx-auto italic ${
          dark ? 'text-[#f0ede8]' : 'text-sand'
        }`}>
          {t.quote}
        </blockquote>
        <p className={`font-sans text-[9px] tracking-[3px] uppercase mt-6 ${dark ? 'text-cement' : 'text-gold'}`}>
          {t.author}
        </p>
        {t.location && (
          <p className={`font-sans text-[11px] mt-1 ${dark ? 'text-[#888]' : 'text-sand/30'}`}>
            {t.location}
          </p>
        )}

        {list.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
                aria-pressed={i === active}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === active
                    ? (dark ? 'bg-cement' : 'bg-gold')
                    : (dark ? 'bg-[#f0ede8]/20' : 'bg-sand/20')
                }`}
              />
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add suvasthuk-next/components/home/Testimonial.tsx
git commit -m "feat: add dark prop to Testimonial for construction mode"
```

---

## Task 14: Construction home page

**Files:**
- Create: `app/construction/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// suvasthuk-next/app/construction/page.tsx
import type { Metadata } from 'next'
import ConstructionHero      from '@/components/construction/ConstructionHero'
import ConstructionStatsBar  from '@/components/construction/ConstructionStatsBar'
import ConstructionServices  from '@/components/construction/ConstructionServices'
import ConstructionProjects  from '@/components/construction/ConstructionProjects'
import ConstructionProcess   from '@/components/construction/ConstructionProcess'
import ConstructionCtaBand   from '@/components/construction/ConstructionCtaBand'
import Testimonial           from '@/components/home/Testimonial'
import {
  getFeaturedConstructionProjects,
  getTestimonials,
} from '@/sanity/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Construction Company in Bangalore | Suvasthuk Architects',
  description:
    'Trusted construction company in Bangalore since 1993. Residential, commercial & turnkey construction. 1024+ projects delivered. Get a free quote.',
  openGraph: {
    title: 'Construction Company in Bangalore | Suvasthuk Architects',
    description: 'Trusted construction company in Bangalore since 1993. 1024+ projects delivered.',
  },
}

export default async function ConstructionPage() {
  const [projects, testimonials] = await Promise.all([
    getFeaturedConstructionProjects().catch(() => []),
    getTestimonials().catch(() => []),
  ])

  return (
    <main>
      <ConstructionHero />
      <ConstructionStatsBar />
      <ConstructionServices />
      <ConstructionProjects projects={projects} />
      <ConstructionProcess />
      <Testimonial testimonials={testimonials} dark />
      <ConstructionCtaBand />
    </main>
  )
}
```

- [ ] **Step 2: Verify build and check page**

```bash
npm run build 2>&1 | tail -5
```
Expected: `/construction` listed in the build output as a static route.

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```
Open `http://localhost:3001/construction`. Verify:
- Navbar switches to dark bg with Construction pill active
- Hero shows letterbox animation on load
- Cement stats band appears
- All sections render without console errors

- [ ] **Step 4: Commit**

```bash
git add suvasthuk-next/app/construction/page.tsx
git commit -m "feat: add construction homepage with all 7 sections"
```

---

## Task 15: Construction projects listing page

**Files:**
- Create: `app/construction/projects/page.tsx`

Note: We do NOT reuse `MasonryGrid` here — that component hardcodes `/projects/[slug]` hrefs and has architecture-specific filter categories. We write a simple inline grid instead.

- [ ] **Step 1: Create the page**

```typescript
// suvasthuk-next/app/construction/projects/page.tsx
'use client'

import { useState }  from 'react'
import type { Metadata } from 'next'
import Link          from 'next/link'
import Image         from 'next/image'
import SectionHeading from '@/components/ui/SectionHeading'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import { urlFor, getAllConstructionProjects } from '@/sanity/lib/queries'
import type { ConstructionProject } from '@/sanity/lib/queries'

// Note: page uses 'use client' so metadata export won't work here.
// SEO metadata is declared in a parent layout or via a separate metadata file.
// The page title is set via the layout.tsx template: '%s — Suvasthuk Architects'

const FALLBACK_PROJECTS: ConstructionProject[] = [
  { title: 'Residential Villa, Whitefield',    category: 'residential',   slug: { current: '#' }, localImage: '/images/project-1.jpg'  },
  { title: 'Commercial Complex, Hebbal',        category: 'commercial',    slug: { current: '#' }, localImage: '/images/project-2.jpg'  },
  { title: 'Turnkey Office, Indiranagar',       category: 'turnkey',       slug: { current: '#' }, localImage: '/images/project-3.jpg'  },
  { title: 'School Campus, Yelahanka',          category: 'institutional', slug: { current: '#' }, localImage: '/images/project-4.jpg'  },
  { title: 'Apartment Renovation, Koramangala', category: 'renovation',    slug: { current: '#' }, localImage: '/images/project-5.jpg'  },
  { title: 'Row House Layout, Devanahalli',     category: 'residential',   slug: { current: '#' }, localImage: '/images/project-6.jpg'  },
  { title: 'Hospital Wing, Rajajinagar',        category: 'institutional', slug: { current: '#' }, localImage: '/images/project-7.jpg'  },
  { title: 'Retail Complex, Whitefield',        category: 'commercial',    slug: { current: '#' }, localImage: '/images/project-8.jpg'  },
  { title: 'Penthouse Build, HSR Layout',       category: 'residential',   slug: { current: '#' }, localImage: '/images/project-9.jpg'  },
  { title: 'Turnkey Villa, Sarjapur',           category: 'turnkey',       slug: { current: '#' }, localImage: '/images/project-10.jpg' },
  { title: 'Office Park, Electronic City',      category: 'commercial',    slug: { current: '#' }, localImage: '/images/project-11.jpg' },
  { title: 'Community Hall, Yelahanka',         category: 'institutional', slug: { current: '#' }, localImage: '/images/project-12.jpg' },
]

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Turnkey', 'Renovation', 'Institutional']

function ConstructionGrid({ projects }: { projects: ConstructionProject[] }) {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase())

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`font-sans text-[9px] tracking-[2px] uppercase px-4 py-2 rounded-full border transition-colors ${
              filter === cat
                ? 'bg-cement text-concrete border-cement font-bold'
                : 'border-[#2a2a2a] text-[#888] hover:border-cement/40 hover:text-cement'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry columns */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-3">
        {filtered.map((p, i) => {
          const imgSrc = p.coverImage
            ? urlFor(p.coverImage).width(700).url()
            : p.localImage ?? null
          const href = p.slug.current === '#'
            ? '/construction/projects'
            : `/construction/projects/${p.slug.current}`

          return (
            <ScrollReveal key={`${p.slug.current}-${i}`} delay={i * 0.04}>
              <Link
                href={href}
                data-cursor="view"
                className="relative overflow-hidden rounded-lg bg-concrete-deep block group mb-3"
                style={{ breakInside: 'avoid' }}
              >
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={p.title}
                    width={700}
                    height={500}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-cement/20 to-cement-dark/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-concrete/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-sans text-[8px] tracking-[3px] uppercase text-cement/70 mb-1 capitalize">{p.category}</p>
                  <p className="font-serif text-base text-[#f0ede8]">{p.title}</p>
                </div>
              </Link>
            </ScrollReveal>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="font-sans text-[#888] text-center py-20">No projects in this category yet.</p>
      )}
    </div>
  )
}

export default async function ConstructionProjectsPage() {
  const fetched  = await getAllConstructionProjects().catch(() => [])
  const projects = fetched.length ? fetched : FALLBACK_PROJECTS

  return (
    <main className="pt-24 pb-20 bg-concrete min-h-screen">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-12">
          <SectionHeading tag="Our Work" title="Construction<br /><strong>case studies</strong>" />
        </div>
        <ConstructionGrid projects={projects} />
      </div>
    </main>
  )
}
```

Since this page uses `'use client'` (needed for the filter state), add a separate `app/construction/projects/metadata.ts` for SEO:

```typescript
// suvasthuk-next/app/construction/projects/metadata.ts
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Construction Portfolio | Suvasthuk Architects Bangalore',
  description: 'Browse our construction portfolio — residential villas, commercial buildings, turnkey projects across Bangalore and Karnataka.',
}
```

Actually, metadata exports only work from `page.tsx` or `layout.tsx`. Since the page is a client component, split it: keep a thin server wrapper that exports metadata and renders the client component.

Replace the above with this two-file approach:

**File 1** — `app/construction/projects/page.tsx` (server, exports metadata):

```typescript
// suvasthuk-next/app/construction/projects/page.tsx
import type { Metadata } from 'next'
import SectionHeading from '@/components/ui/SectionHeading'
import ConstructionProjectsGrid from './ConstructionProjectsGrid'
import { getAllConstructionProjects } from '@/sanity/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Construction Portfolio | Suvasthuk Architects Bangalore',
  description: 'Browse our construction portfolio — residential villas, commercial buildings, turnkey projects across Bangalore and Karnataka.',
}

export default async function ConstructionProjectsPage() {
  const fetched = await getAllConstructionProjects().catch(() => [])
  return (
    <main className="pt-24 pb-20 bg-concrete min-h-screen">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-12">
          <SectionHeading tag="Our Work" title="Construction<br /><strong>case studies</strong>" />
        </div>
        <ConstructionProjectsGrid initialProjects={fetched} />
      </div>
    </main>
  )
}
```

**File 2** — `app/construction/projects/ConstructionProjectsGrid.tsx` (client, handles filter):

```typescript
// suvasthuk-next/app/construction/projects/ConstructionProjectsGrid.tsx
'use client'

import { useState } from 'react'
import Link         from 'next/link'
import Image        from 'next/image'
import ScrollReveal from '@/components/animations/ScrollReveal'
import { urlFor }   from '@/sanity/lib/queries'
import type { ConstructionProject } from '@/sanity/lib/queries'

const FALLBACK: ConstructionProject[] = [
  { title: 'Residential Villa, Whitefield',    category: 'residential',   slug: { current: '#' }, localImage: '/images/project-1.jpg'  },
  { title: 'Commercial Complex, Hebbal',        category: 'commercial',    slug: { current: '#' }, localImage: '/images/project-2.jpg'  },
  { title: 'Turnkey Office, Indiranagar',       category: 'turnkey',       slug: { current: '#' }, localImage: '/images/project-3.jpg'  },
  { title: 'School Campus, Yelahanka',          category: 'institutional', slug: { current: '#' }, localImage: '/images/project-4.jpg'  },
  { title: 'Apartment Renovation, Koramangala', category: 'renovation',    slug: { current: '#' }, localImage: '/images/project-5.jpg'  },
  { title: 'Row House Layout, Devanahalli',     category: 'residential',   slug: { current: '#' }, localImage: '/images/project-6.jpg'  },
  { title: 'Hospital Wing, Rajajinagar',        category: 'institutional', slug: { current: '#' }, localImage: '/images/project-7.jpg'  },
  { title: 'Retail Complex, Whitefield',        category: 'commercial',    slug: { current: '#' }, localImage: '/images/project-8.jpg'  },
  { title: 'Penthouse Build, HSR Layout',       category: 'residential',   slug: { current: '#' }, localImage: '/images/project-9.jpg'  },
  { title: 'Turnkey Villa, Sarjapur',           category: 'turnkey',       slug: { current: '#' }, localImage: '/images/project-10.jpg' },
  { title: 'Office Park, Electronic City',      category: 'commercial',    slug: { current: '#' }, localImage: '/images/project-11.jpg' },
  { title: 'Community Hall, Yelahanka',         category: 'institutional', slug: { current: '#' }, localImage: '/images/project-12.jpg' },
]

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Turnkey', 'Renovation', 'Institutional']

export default function ConstructionProjectsGrid({ initialProjects }: { initialProjects: ConstructionProject[] }) {
  const projects = initialProjects.length ? initialProjects : FALLBACK
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase())

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`font-sans text-[9px] tracking-[2px] uppercase px-4 py-2 rounded-full border transition-colors ${
              filter === cat
                ? 'bg-cement text-concrete border-cement font-bold'
                : 'border-[#2a2a2a] text-[#888] hover:border-cement/40 hover:text-cement'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry columns */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-3">
        {filtered.map((p, i) => {
          const imgSrc = p.coverImage
            ? urlFor(p.coverImage).width(700).url()
            : p.localImage ?? null
          const href = p.slug.current === '#'
            ? '/construction/projects'
            : `/construction/projects/${p.slug.current}`

          return (
            <ScrollReveal key={`${p.slug.current}-${i}`} delay={i * 0.04}>
              <Link
                href={href}
                data-cursor="view"
                className="relative overflow-hidden rounded-lg bg-concrete-deep block group mb-3"
                style={{ breakInside: 'avoid' }}
              >
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={p.title}
                    width={700}
                    height={500}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-cement/20 to-cement-dark/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-concrete/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-sans text-[8px] tracking-[3px] uppercase text-cement/70 mb-1 capitalize">{p.category}</p>
                  <p className="font-serif text-base text-[#f0ede8]">{p.title}</p>
                </div>
              </Link>
            </ScrollReveal>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="font-sans text-[#888] text-center py-20">No projects in this category yet.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: `/construction/projects` in build output.

- [ ] **Step 3: Commit**

```bash
git add suvasthuk-next/app/construction/projects/page.tsx
git commit -m "feat: add construction projects listing page"
```

---

## Task 16: Construction project case study page

**Files:**
- Create: `app/construction/projects/[slug]/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// suvasthuk-next/app/construction/projects/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import Image             from 'next/image'
import Link              from 'next/link'
import { PortableText }  from '@portabletext/react'
import {
  getConstructionProjectBySlug,
  getAllConstructionProjectSlugs,
  urlFor,
} from '@/sanity/lib/queries'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllConstructionProjectSlugs().catch(() => [])
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project  = await getConstructionProjectBySlug(slug).catch(() => null)
  if (!project) return {}
  return {
    title:       `${project.title} | Construction | Suvasthuk Architects`,
    description: project.description ?? `Construction case study: ${project.title}`,
  }
}

export default async function ConstructionCaseStudyPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const project  = await getConstructionProjectBySlug(slug).catch(() => null)
  if (!project) notFound()

  const heroUrl = project.coverImage
    ? urlFor(project.coverImage).width(1400).height(700).url()
    : null

  return (
    <main className="bg-concrete min-h-screen">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] bg-concrete-deep overflow-hidden">
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a3830] to-concrete" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-concrete/90 via-concrete/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-content mx-auto">
          <p className="font-sans text-[9px] tracking-[3px] uppercase text-cement mb-3 capitalize">
            {project.category}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#f0ede8] leading-tight max-w-2xl">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-concrete-deep border-b border-[#2a2a2a]">
        <div className="max-w-content mx-auto px-6 py-6 flex flex-wrap gap-8">
          {project.location && (
            <div>
              <p className="font-sans text-[8px] tracking-[3px] uppercase text-cement mb-1">Location</p>
              <p className="font-sans text-[14px] text-[#f0ede8]">{project.location}</p>
            </div>
          )}
          {project.area && (
            <div>
              <p className="font-sans text-[8px] tracking-[3px] uppercase text-cement mb-1">Built-up Area</p>
              <p className="font-sans text-[14px] text-[#f0ede8]">{project.area}</p>
            </div>
          )}
          {project.completionYear && (
            <div>
              <p className="font-sans text-[8px] tracking-[3px] uppercase text-cement mb-1">Completed</p>
              <p className="font-sans text-[14px] text-[#f0ede8]">{project.completionYear}</p>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-content mx-auto px-6 py-16">
        {project.description && (
          <p className="font-sans text-[16px] text-[#888] leading-relaxed max-w-2xl mb-12">
            {project.description}
          </p>
        )}
        {project.body && (
          <div className="prose prose-invert prose-lg max-w-2xl
            prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#f0ede8]
            prose-p:text-[#888] prose-p:leading-relaxed
            prose-strong:text-[#f0ede8] prose-a:text-cement">
            <PortableText value={project.body} />
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 pt-10 border-t border-[#2a2a2a] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="font-serif text-2xl text-[#f0ede8]">Start a similar project?</p>
          <Link
            href="/contact?mode=construction"
            className="font-sans text-[11px] tracking-[2px] uppercase bg-cement text-concrete font-bold px-8 py-4 rounded hover:bg-cement-dark transition-colors"
          >
            Get a Quote →
          </Link>
        </div>

        <Link
          href="/construction/projects"
          className="inline-block mt-8 font-sans text-[10px] tracking-[2px] uppercase text-cement border-b border-cement pb-1 hover:text-cement-dark transition-colors"
        >
          ← All Construction Projects
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: `/construction/projects/[slug]` in build output.

- [ ] **Step 3: Commit**

```bash
git add suvasthuk-next/app/construction/projects/[slug]/page.tsx
git commit -m "feat: add construction project case study page"
```

---

## Task 17: Construction services page

**Files:**
- Create: `app/construction/services/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// suvasthuk-next/app/construction/services/page.tsx
import type { Metadata } from 'next'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import ConstructionCtaBand from '@/components/construction/ConstructionCtaBand'

export const metadata: Metadata = {
  title: 'Construction Services in Bangalore | Suvasthuk Architects',
  description:
    'Residential, commercial, turnkey, renovation and institutional construction services in Bangalore. 30+ years of quality construction since 1993.',
}

const SERVICES = [
  {
    id: 'residential-construction',
    name: 'Residential Construction',
    tagline: 'Homes built to last — and to love.',
    description:
      'From independent villas to apartment complexes and row house layouts, we manage every aspect of residential construction. Our team handles structural work, finishing, plumbing, electrical, and interiors under a single contract — ensuring seamless execution and no coordination gaps.',
  },
  {
    id: 'commercial-construction',
    name: 'Commercial Construction',
    tagline: 'Built for business, designed for people.',
    description:
      'We construct offices, retail spaces, showrooms, and mixed-use buildings that balance functionality with professional aesthetics. From ground-up construction to fit-outs, our commercial projects are delivered on schedule with full compliance documentation.',
  },
  {
    id: 'turnkey-projects',
    name: 'Turnkey Projects',
    tagline: 'One contract. Zero coordination stress.',
    description:
      'A turnkey contract means you hand us the brief and we deliver a finished, move-in-ready space. Design, approvals, civil work, MEP, and interiors — all under one roof. Ideal for clients who want complete accountability and a single point of contact.',
  },
  {
    id: 'project-management',
    name: 'Project Management',
    tagline: 'Expert supervision at every stage.',
    description:
      'Already have a contractor? Our project management service provides dedicated site supervisors, quality control engineers, and progress reporting. We ensure your contractor delivers to spec, on time, and within budget — without you having to be on-site every day.',
  },
  {
    id: 'renovation',
    name: 'Renovation',
    tagline: 'Transform what exists. Build what is missing.',
    description:
      'Structural upgrades, complete remodels, and targeted refits for residential and commercial spaces. We assess existing conditions carefully before work begins, minimise disruption, and deliver a finished space that feels entirely new.',
  },
  {
    id: 'institutional',
    name: 'Institutional Construction',
    tagline: 'Buildings that serve communities for generations.',
    description:
      'Schools, hospitals, community halls, and places of worship — we have 30+ years of experience building spaces that serve the public. Our institutional projects meet all statutory requirements, accessibility standards, and long-term durability specifications.',
  },
]

export default function ConstructionServicesPage() {
  return (
    <main className="bg-concrete min-h-screen pt-24 pb-0">
      <div className="max-w-content mx-auto px-6 mb-14">
        <SectionHeading
          tag="What We Build"
          title="Construction services<br /><strong>across Bangalore</strong>"
        />
      </div>

      <div className="max-w-content mx-auto px-6 pb-20 space-y-4">
        {SERVICES.map((s, i) => (
          <ScrollReveal key={s.id} delay={i * 0.06}>
            <div
              id={s.id}
              className="bg-concrete-deep rounded-lg p-8 border border-[#2a2a2a] hover:border-cement/30 transition-colors"
            >
              <div className="w-3 h-3 rounded-sm bg-cement mb-5" />
              <h2 className="font-serif text-2xl text-[#f0ede8] mb-1">{s.name}</h2>
              <p className="font-sans text-[12px] text-cement mb-4">{s.tagline}</p>
              <p className="font-sans text-[14px] text-[#888] leading-relaxed max-w-2xl">{s.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ConstructionCtaBand />
    </main>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```
Expected: `/construction/services` in build output.

- [ ] **Step 3: Commit**

```bash
git add suvasthuk-next/app/construction/services/page.tsx
git commit -m "feat: add construction services listing page"
```

---

## Task 18: Sitemap + final build check

**Files:**
- Modify: `next-sitemap.config.js`

- [ ] **Step 1: Add construction route priorities**

```javascript
// suvasthuk-next/next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://suvasthuk.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/studio' },
    ],
    additionalSitemaps: ['https://suvasthuk.com/sitemap.xml'],
  },
  exclude: ['/studio/*', '/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    if (path === '/')               return { ...config, priority: 1.0,  changefreq: 'daily'   }
    if (path === '/construction')   return { ...config, priority: 0.95, changefreq: 'weekly'  }
    if (path === '/construction/projects') return { ...config, priority: 0.85, changefreq: 'weekly' }
    if (path === '/construction/services') return { ...config, priority: 0.80, changefreq: 'monthly' }
    if (path.startsWith('/construction/projects/')) return { ...config, priority: 0.80, changefreq: 'monthly' }
    if (path.startsWith('/projects/') || path.startsWith('/blog/')) {
      return { ...config, priority: 0.9, changefreq: 'monthly' }
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority }
  },
}
```

- [ ] **Step 2: Run full production build**

```bash
npm run build 2>&1 | tail -20
```
Expected output should include:
- `/construction` ✓
- `/construction/projects` ✓
- `/construction/services` ✓
- `/construction/projects/[slug]` ✓
- Sitemap generation: `✅ Generation completed`
- No TypeScript errors

- [ ] **Step 3: Spot-check dev server**

```bash
npm run dev
```
Check these URLs in the browser:
- `http://localhost:3001` — Architecture mode, toggle pill shows Architecture active
- `http://localhost:3001/construction` — Construction mode, dark navbar, cement toggle active, all sections render
- `http://localhost:3001/construction/projects` — dark bg, project grid renders with fallback images
- `http://localhost:3001/construction/services` — all 6 service cards render
- Toggle between modes by clicking the pill — fade transition should be visible

- [ ] **Step 4: Commit**

```bash
git add suvasthuk-next/next-sitemap.config.js
git commit -m "feat: add construction routes to sitemap with correct priority"
```

---

## Done

All 18 tasks complete. The construction mode is live at `/construction` with its own dark cement-themed experience, a shared navbar toggle, separate Sanity schema, and full SEO metadata.
