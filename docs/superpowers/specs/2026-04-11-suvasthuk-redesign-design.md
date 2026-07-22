# Suvasthuk Architects — Full Website Redesign
**Spec Date:** 2026-04-11  
**Status:** Approved  

---

## 1. Project Overview

A complete ground-up rebuild of [suvasthuk.com](https://suvasthuk.com/) — replacing the current static Bootstrap template with a premium Next.js 14 website optimised for SEO, conversion, and a high-end animated user experience.

**Goals:**
1. Premium UI that positions Suvasthuk alongside top-tier architecture firms
2. Rank #1 on Google for "architects in Bangalore" and related keywords
3. Generate qualified leads (residential + commercial clients)

**Firm background:** Founded 1993 by architect B K Muralidhar. Based in Sahakar Nagar, Bengaluru. 30+ years experience, 826+ clients, 1024+ projects. Services span architecture, interior design, construction, structural design, Vastu consultation, renovation, landscaping, layout planning, sanction plans, TDR procurement, elevation design.

---

## 2. Tech Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | Next.js 14 (App Router) | SSR/SSG for SEO, great image optimisation, Vercel-native |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| Animations | GSAP + Framer Motion + Lenis | GSAP for cinematic hero, Framer Motion for scroll reveals, Lenis for smooth scroll |
| CMS | Sanity Studio (embedded) | Visual dashboard for non-developers, great Next.js integration, free tier sufficient |
| Contact form | Resend API | Simple transactional email, free tier, Next.js API route |
| Hosting | Vercel | Native Next.js platform, zero-config deployments |
| Sitemap | next-sitemap | Auto-generates sitemap.xml + robots.txt |
| Fonts | Google Fonts (self-hosted via next/font) | Libre Baskerville + DM Sans |
| Images | next/image + WebP | Automatic optimisation, lazy loading, Core Web Vitals |

**Key packages:**
```
next@14, framer-motion, gsap, lenis,
@sanity/client, sanity, next-sanity, tailwindcss,
resend, next-sitemap, schema-dts
```

---

## 3. Design System

### 3.1 Colour Palette — Earthy Modern

| Token | Hex | Usage |
|-------|-----|-------|
| `sand` | `#f2ede7` | Page background |
| `sand-dark` | `#e8ddd2` | Section alternate bg, card bg hover |
| `cream` | `#fff` | Card backgrounds, modals |
| `brown-deep` | `#2c2420` | Primary text, headings, nav |
| `brown-mid` | `#7a6a5a` | Body text, secondary copy |
| `brown-light` | `#9a8a7a` | Captions, meta text |
| `gold` | `#c4a882` | Accent — borders, dividers, tags, CTA underlines |
| `gold-dark` | `#9a7a5a` | Hover state for gold elements |
| `charcoal` | `#1a1210` | Footer background, dark hero overlays |

### 3.2 Typography

| Role | Font | Weight | Size range |
|------|------|--------|-----------|
| Display / H1 | Libre Baskerville | 400 (italic for emphasis) | 40–72px |
| H2 | Libre Baskerville | 400 | 28–40px |
| H3 | Libre Baskerville | 700 | 18–24px |
| Body | DM Sans | 300–400 | 14–16px |
| UI / Labels | DM Sans | 500–600 | 10–12px, letter-spacing: 2–4px, uppercase |
| Captions | DM Sans | 300 | 11–13px |

### 3.3 Spacing & Layout

- Max content width: `1280px`
- Section padding: `80px` vertical (mobile: `48px`)
- Grid: 12-column, gap `24px`
- Border radius: `8px` cards, `100px` pills, `4px` buttons

### 3.4 Logo

Existing geometric logo (red/gold 3D diamond form on warm background). Used in nav and footer. SVG version required from client. Displayed at `32×32px` in nav alongside wordmark "Suvasthuk" in DM Sans 600.

---

## 4. Animation System

Three-layer motion system — each triggered at a different stage of the user journey.

### Layer 1 — Hero Entry (GSAP, cinematic)
- On page load: black letterbox bars (top + bottom) slide away revealing the hero image
- Hero image starts at `scale(1.1)` and eases to `scale(1.0)` over 1.8s
- Headline text fades + slides up after bars clear (delay: 1.0s)
- Tagline and CTA stagger in at 100ms intervals after headline
- Implemented with GSAP `timeline()` + `gsap.fromTo()`

### Layer 2 — Scroll Reveals (Framer Motion)
- Every section entering the viewport triggers a `fadeInUp` animation
- Text lines wipe up from a clip-path mask (not a simple fade)
- Stats counter animates from 0 to final value as section enters view
- Project cards slide in with a staggered `x: 40` → `x: 0` per card
- Implemented with Framer Motion `useInView` + `motion.div` variants

### Layer 3 — Image Hover / Focus (GSAP + custom cursor)
- Custom cursor: 40px circle, `mix-blend-mode: difference`, morphs to "View" label on project image hover
- Project images in masonry grid: GSAP `scale(1.05)` + subtle parallax on `mousemove`
- Floating ambient circles behind project cards animate continuously with `gsap.to()` infinite
- On image focus (click to open case study): full-screen transition expand from card position

### Smooth Scroll
- Lenis smooth scroll applied globally
- Scroll progress bar at top of page (thin gold line)

---

## 5. Site Architecture

### 5.1 Pages

| Route | Page | SSG/SSR | Sanity-driven |
|-------|------|---------|---------------|
| `/` | Homepage | SSG | Partial (featured projects, testimonials) |
| `/about` | About | SSG | No |
| `/services` | Services overview | SSG | No |
| `/services/[slug]` | Individual service | SSG | No (MDX) |
| `/projects` | Projects masonry | SSG | Yes |
| `/projects/[slug]` | Project case study | SSG + ISR | Yes |
| `/blog` | Blog listing | SSG + ISR | Yes |
| `/blog/[slug]` | Blog post | SSG + ISR | Yes |
| `/contact` | Contact | SSG | No |

### 5.2 Navigation

**Desktop sticky nav:**
```
[Logo + Wordmark]    Work · Services · About · Blog    [Get in Touch →]
```
- Transparent over hero, transitions to `bg-sand/95 backdrop-blur` on scroll past 80px
- "Get in Touch" = filled button (`bg-brown-deep text-sand`)

**Mobile:** Hamburger → full-screen overlay menu, links animate in with stagger

### 5.3 Footer

4-column dark footer (`bg-charcoal`):
- Col 1: Logo + one-line description + Instagram/LinkedIn icons
- Col 2: Work (Projects, Services, Case Studies)
- Col 3: Studio (About, Team, Blog)
- Col 4: Contact (email, phone, address with Google Maps link)
- Bottom bar: copyright + "Designed & Built by [Suvasthuk]"

---

## 6. Homepage Sections (in order)

1. **Sticky Nav** — transparent → frosted on scroll
2. **Cinematic Hero** — full-viewport, GSAP entry, headline + CTA, "30 years" ghost counter, Bengaluru badge
3. **Scrolling Marquee** — infinite loop of service names separated by gold dots
4. **Stats Bar** — 4 columns: 30+ years / 826+ clients / 1024+ projects / 12+ services. Counter animates on enter.
5. **About Strip** — 2-col: heading left, 2-paragraph story + "Our full story →" right
6. **Services Grid** — 3×2 cards on `sand-dark` bg. Icon + name + one-line description. "All Services →" link.
7. **Projects Mosaic** — asymmetric grid (1 tall left + 4 smaller right). Fluid hover. "All Projects →"
8. **Testimonial** — dark bg, single quote, client name + location. Carousel if multiple testimonials.
9. **Blog Preview** — 3 article cards. Category tag + title + excerpt.
10. **CTA Band** — warm gradient, "Ready to build something remarkable?" + "Start a Conversation" button
11. **Footer**

---

## 7. Project Showcase

### 7.1 Listing Page (`/projects`)

- Filterable masonry grid
- Filter pills: All · Residential · Commercial · Interior · Institutional · Renovation
- Images fill cards, category + name revealed on hover (GSAP opacity)
- Custom cursor morphs to "View" on hover
- "Load more" button (no pagination — better for Googlebot crawling than infinite scroll)
- Each card links to `/projects/[slug]`

### 7.2 Case Study Page (`/projects/[slug]`)

Sections:
1. **Hero** — full-width image, project name + category overlaid
2. **Key Stats row** — Area · Location · Year · Services (3–4 stat boxes)
3. **Brief** — what the client asked for
4. **Design story** — 2–4 paragraphs, editorial write-up
5. **Photo gallery** — masonry / lightbox, fluid hover animations
6. **Tags** — keyword chips (Vastu, Villa, Modern, Bangalore, etc.) — these are also SEO signals
7. **Next Project** — teaser card at bottom → drives internal linking

**Sanity schema for Project:**
```typescript
{
  title: string,
  slug: slug,
  category: 'residential' | 'commercial' | 'interior' | 'institutional' | 'renovation',
  area: string,          // "4,200 sq ft"
  location: string,      // "Whitefield, Bengaluru"
  year: number,
  services: string[],
  coverImage: image,
  gallery: image[],
  brief: text,
  designStory: portableText,
  tags: string[],
  featured: boolean,     // shown on homepage mosaic
  seoTitle: string,
  seoDescription: string
}
```

---

## 8. Services

### 8.1 Overview Page (`/services`)
- 2-col grid of service cards
- Each card: icon + name + 2-line description + "Learn more →"

### 8.2 Individual Service Pages (`/services/[slug]`)
10 pages, one per service. Each page structure:
1. Hero with service name + one-line value prop
2. What we do (400–600 words)
3. Our process (3–4 steps)
4. Related projects (pulled from Sanity by tag)
5. FAQ (3–5 questions specific to the service)
6. CTA — "Start your [service] project →"

**Services list with slugs:**
| Service | Slug |
|---------|------|
| Architectural Design | `architectural-design` |
| Interior Design | `interior-design` |
| Construction | `construction` |
| Structural Design | `structural-design` |
| Vastu Consultation | `vastu-consultation` |
| Renovation | `renovation` |
| Landscaping | `landscaping` |
| Layout Planning | `layout-planning` |
| Sanction Plans & TDR | `sanction-plans-tdr` |
| Elevation Designs | `elevation-designs` |

---

## 9. Blog

### 9.1 Listing Page (`/blog`)
- 3-column card grid
- Card: cover image + category tag + title + excerpt + read time
- Sanity-driven, ISR revalidation every 60s

### 9.2 Blog Post Page (`/blog/[slug]`)
- Full-width hero image
- Title + author + date + read time
- Portable Text body with inline images
- Related posts at bottom (same category)
- Share buttons (WhatsApp, LinkedIn, copy link)

### 9.3 Launch Blog Topics (10 posts, prioritised by SEO value)
1. *How to Choose the Right Architect in Bangalore* — primary target keyword
2. *Cost of Building a House in Bangalore in 2025* — high search volume
3. *Vastu-Compliant Home Design: A Modern Guide for Bangaloreans*
4. *The Complete Guide to BBMP Building Sanction Plans* — zero competition, hyper-local
5. *Interior Design Trends for Bangalore Homes in 2025*
6. *How to Read Architectural Drawings: A Homeowner's Guide*
7. *Villa vs Apartment in Bangalore: Which is the Better Investment?*
8. *Top 5 Mistakes People Make When Building a House in Bangalore*
9. *Sustainable Architecture in Bangalore: Building Green in the City*
10. *What is TDR (Transferable Development Rights) and How Does It Work in Bangalore?*

**Sanity schema for BlogPost:**
```typescript
{
  title: string,
  slug: slug,
  category: string,
  coverImage: image,
  excerpt: string,        // 150 chars, used for meta description
  author: string,
  publishedAt: datetime,
  readTime: number,       // minutes
  body: portableText,
  tags: string[],
  seoTitle: string,
  seoDescription: string
}
```

---

## 10. Contact Page

- **Info cards:** MEET (address + Google Maps link) · TALK (2 phone numbers) · WRITE (email)
- **Contact form fields:** Name · Phone · Email · Project type (dropdown) · Budget range (optional) · Message · Submit
- **Backend:** Next.js API route → Resend → email to `suvasthuk@gmail.com`
- **WhatsApp float button:** fixed bottom-right, links to `https://wa.me/919480444666`
- Form validation: client-side (React Hook Form) + server-side
- Success state: inline confirmation, no page redirect

---

## 11. SEO Implementation

### 11.1 Per-page metadata (via Next.js `generateMetadata`)

| Page | Title | Description |
|------|-------|-------------|
| Home | Suvasthuk Architects — Architects in Bangalore Since 1993 | Trusted architecture firm in Bangalore since 1993. Residential, commercial & interior design. 30+ years, 1000+ projects. Get a free consultation. |
| Services | Architecture & Design Services in Bangalore — Suvasthuk | Full-service architecture firm offering architectural design, interior design, construction, Vastu consultation and more in Bangalore. |
| `/services/interior-design` | Interior Designers in Bangalore — Suvasthuk Architects | Premium interior design services in Bangalore. Residential and commercial interiors tailored to your vision. 30+ years experience. |
| Projects | Architecture Portfolio — Suvasthuk Architects Bangalore | Browse 1000+ completed projects — residential villas, commercial spaces, schools and more across Bangalore and Karnataka. |
| Blog | Architecture & Design Insights — Suvasthuk Architects | Expert articles on architecture, interior design, construction costs, Vastu, and building in Bangalore. |
| Contact | Contact Suvasthuk Architects — Bangalore | Get in touch with Suvasthuk Architects in Sahakar Nagar, Bangalore. Call +91 9480444666 or email suvasthuk@gmail.com. |

### 11.2 Heading Structure

Every page follows strict heading hierarchy:
- One `<h1>` per page, contains primary keyword
- `<h2>` for major sections
- `<h3>` for sub-sections and card titles

### 11.3 Schema Markup

**LocalBusiness schema on every page:**
```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "name": "Suvasthuk Architects",
  "image": "https://suvasthuk.com/logo.svg",
  "url": "https://suvasthuk.com",
  "telephone": "+91-9480444666",
  "email": "suvasthuk@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "F6 17/2, 1st Floor, Kodigehalli Main Rd",
    "addressLocality": "Sahakar Nagar, Bengaluru",
    "addressRegion": "Karnataka",
    "postalCode": "560092",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 13.0591,
    "longitude": 77.5803
  },
  "openingHours": "Mo-Sa 09:00-18:00",
  "foundingDate": "1993",
  "priceRange": "₹₹₹",
  "areaServed": "Bangalore, Karnataka",
  "serviceType": ["Architectural Design", "Interior Design", "Construction", "Vastu Consultation"]
}
```

**BreadcrumbList on all inner pages.**  
**Article schema on blog posts.**

### 11.4 Technical SEO
- `sitemap.xml` auto-generated by `next-sitemap` (includes all project + blog slugs from Sanity)
- `robots.txt` — allow all, disallow `/studio` (Sanity admin)
- Canonical tags on all pages
- Open Graph + Twitter Card meta tags
- All images: `alt` text with descriptive, keyword-rich copy
- `next/image` for automatic WebP conversion + lazy loading
- No render-blocking scripts — GSAP loaded client-side only

---

## 12. Conversion Optimisation

### 12.1 CTA Strategy
- **Primary CTA:** "Get in Touch" — sticky in nav, always visible
- **Secondary CTA:** "Explore our work" — hero, soft entry point
- **Tertiary CTA:** "Start a Conversation" — CTA band after projects section
- **WhatsApp float:** bottom-right on all pages, instant contact
- Rule: never more than one primary CTA visible at once

### 12.2 Trust Signals
- Stats bar (30 yrs / 826 clients / 1024 projects) — above the fold on homepage
- Testimonials carousel — rotating client quotes with name + area
- Project case studies — social proof through specificity (real projects, real locations)
- "Since 1993" badge in hero — longevity is trust

### 12.3 Lead Capture
- Contact form on `/contact` — low friction, 6 fields
- Optional: "Download our free Building Checklist" on blog sidebar — email capture via Sanity + Resend

---

## 13. Folder Structure

```
suvasthuk/
├── app/
│   ├── layout.tsx              # Root layout: fonts, Lenis, analytics
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── services/
│   │   ├── page.tsx            # Services overview
│   │   └── [slug]/page.tsx     # Individual service page
│   ├── projects/
│   │   ├── page.tsx            # Masonry grid
│   │   └── [slug]/page.tsx     # Case study
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/page.tsx     # Blog post
│   └── api/
│       └── contact/route.ts    # Resend email handler
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppButton.tsx
│   ├── animations/
│   │   ├── HeroEntry.tsx       # GSAP cinematic reveal
│   │   ├── ScrollReveal.tsx    # Framer Motion wrapper
│   │   ├── CustomCursor.tsx    # Morphing cursor
│   │   └── LenisProvider.tsx   # Smooth scroll context
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── Marquee.tsx
│   │   ├── StatsBar.tsx
│   │   ├── AboutStrip.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── ProjectsMosaic.tsx
│   │   ├── Testimonial.tsx
│   │   ├── BlogPreview.tsx
│   │   └── CtaBand.tsx
│   ├── projects/
│   │   ├── MasonryGrid.tsx
│   │   ├── FilterBar.tsx
│   │   └── ProjectCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── SectionHeading.tsx
│       └── Tag.tsx
├── sanity/
│   ├── sanity.config.ts
│   ├── schemaTypes/
│   │   ├── project.ts
│   │   ├── blogPost.ts
│   │   ├── testimonial.ts
│   │   └── service.ts
│   └── lib/
│       ├── client.ts
│       └── queries.ts
├── lib/
│   └── metadata.ts             # Shared generateMetadata helpers
├── public/
│   ├── logo.svg
│   └── images/                 # Static assets (migrated from current site)
├── next.config.ts
├── tailwind.config.ts
└── next-sitemap.config.ts
```

---

## 14. Migration Notes

The current site (`/Users/shrishaa/Developer/Suvasthuk/Suvasthuk_Architects`) has:
- `images/Projects/General/` — 53 project images → migrate to Sanity assets or `/public/images/`
- `images/Projects/Poorna Vikas Vidyalaya/` — 11 school project images → same
- Contact info: `suvasthuk@gmail.com`, `080-41110467`, `+91-9480444666`
- Address: F6 17/2, 1st Floor, Kodigehalli Main Rd, Sahakar Nagar, Bengaluru 560092
- Instagram: `@suvasthuk_architects`
- Domain: `suvasthuk.com` (CNAME file present — Vercel custom domain setup)

The new project lives alongside the current repo or in a new `suvasthuk-next/` directory. Old site stays on Vercel until new one is fully ready.

---

## 15. Out of Scope (This Spec)

- Team page content (placeholder until photos provided)
- Google Analytics / tag setup (add post-launch)
- Paid advertising / Google Ads
- WhatsApp Business API integration (float button only)
- Multi-language support
