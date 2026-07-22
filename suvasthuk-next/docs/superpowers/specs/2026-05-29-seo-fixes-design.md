# SEO Fixes — Design Spec
**Date:** 2026-05-29  
**Scope:** Critical + High priority issues from live SEO audit  
**Approach:** Next.js 14 App Router native (Approach A)

---

## Background

Live audit of `http://localhost:2000` (pre-production build of the Next.js 14 App Router site that will replace `https://suvasthuk.com`) identified ~30 SEO issues. This spec covers the Critical and High priority subset. The site will be deployed to `https://suvasthuk.com` once ready.

---

## 1. Crawlability — robots.ts + sitemap.ts

**Files:** `app/robots.ts` (new), `app/sitemap.ts` (new)

### robots.ts
Returns a `MetadataRoute.Robots` object:
- `rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api'] }`
- `sitemap: 'https://suvasthuk.com/sitemap.xml'`

### sitemap.ts
Returns `MetadataRoute.Sitemap` array covering:
- Static routes with explicit priorities/changefreq: `/` (1.0, daily), `/about` (0.7), `/services` (0.8), `/projects` (0.85), `/blog` (0.8), `/contact` (0.7), `/construction` (0.95), `/construction/projects` (0.85), `/construction/services` (0.80)
- Dynamic routes from Sanity: blog slugs via `getAllBlogSlugs()`, project slugs via `getAllProjectSlugs()`, service slugs from `SERVICES` constant — all with priority 0.8–0.9
- All URLs prefixed with `https://suvasthuk.com`
- Graceful `.catch(() => [])` on all Sanity calls

`next-sitemap.config.js` is left in place but no longer drives sitemap generation.

---

## 2. Canonical Tags + Per-page OG Metadata

**Files:** `app/layout.tsx`, `app/about/page.tsx`, `app/services/page.tsx`, `app/projects/page.tsx`, `app/blog/page.tsx`, `app/contact/page.tsx`, `app/services/[slug]/page.tsx`, `app/projects/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`

### Root layout
Add to default metadata:
```ts
alternates: { canonical: 'https://suvasthuk.com' }
```

### Static listing pages (about, services, projects, blog, contact)
Each gets:
```ts
alternates: { canonical: 'https://suvasthuk.com/<path>' },
openGraph: {
  url: 'https://suvasthuk.com/<path>',
  title: '<page title>',
  description: '<page description>',
  images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
}
```

### Dynamic pages (services/[slug], projects/[slug], blog/[slug])
`generateMetadata` builds canonical and OG url from slug:
```ts
alternates: { canonical: `https://suvasthuk.com/services/${slug}` },
openGraph: { url: `https://suvasthuk.com/services/${slug}`, ... }
```
Blog post `generateMetadata` also sets `openGraph.images` from the Sanity cover image URL.

---

## 3. H1 on Listing Pages

**Files:** `app/services/page.tsx`, `app/projects/page.tsx`, `app/blog/page.tsx`

`SectionHeading` renders `<h2>`. Each listing page gets a visually-hidden `<h1>` inserted before the `SectionHeading`:

```tsx
<h1 className="sr-only">Architecture & Design Services in Bengaluru</h1>
```

H1 text per page:
- `/services` → `Architecture & Design Services in Bengaluru`
- `/projects` → `Architecture Portfolio in Bengaluru`
- `/blog` → `Architecture & Design Insights`

---

## 4. Structured Data

### 4a. LocalBusinessSchema.tsx — updated
**File:** `components/seo/LocalBusinessSchema.tsx`

Changes:
- `@type` → `'ProfessionalService'` (remove `'LocalBusiness'`)
- Add `sameAs: ['https://www.instagram.com/suvasthuk_architects', 'https://share.google/1nAqzRFFug4fM29Ax']`
- Add second `<script>` for `WebSite` schema with `potentialAction`:
  ```json
  {
    "@type": "WebSite",
    "name": "Suvasthuk Architects",
    "url": "https://suvasthuk.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://suvasthuk.com/?s={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  ```

### 4b. ArticleSchema.tsx — new component
**File:** `components/seo/ArticleSchema.tsx`

Props: `{ title, excerpt, coverImageUrl, author, slug, publishedAt? }`

Renders:
```json
{
  "@type": "Article",
  "headline": "<title>",
  "description": "<excerpt>",
  "image": "<coverImageUrl>",
  "author": { "@type": "Person", "name": "<author>" },
  "publisher": {
    "@type": "Organization",
    "name": "Suvasthuk Architects",
    "url": "https://suvasthuk.com"
  },
  "url": "https://suvasthuk.com/blog/<slug>"
}
```

Rendered directly in `app/blog/[slug]/page.tsx` JSX using a `<script type="application/ld+json">` tag, same pattern as `LocalBusinessSchema.tsx`.

### 4c. FAQPage schema — inline in service page
**File:** `app/services/[slug]/page.tsx`

Built from `service.faq` array (already present). Rendered as:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  }) }}
/>
```

---

## 5. OG Image

**Action:** Copy `public/images/hero/hero-1.jpg` → `public/og-image.jpg`

The file is referenced in root `layout.tsx` metadata as `/og-image.jpg`. `metadataBase` is already set to `https://suvasthuk.com`, so the full URL resolves correctly on deployment.

---

## 6. Semantic HTML

**Files:** `components/layout/SiteShell.tsx`, individual page `<main>` elements

- `SiteShell.tsx` — wrap `<Navbar />` in `<header>` landmark
- `SiteShell.tsx` — add skip-to-content: `<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-brown-deep">Skip to content</a>`
- Each page `<main>` gets `id="main-content"` attribute

---

## Files Changed Summary

| File | Change |
|------|--------|
| `app/robots.ts` | New — App Router robots handler |
| `app/sitemap.ts` | New — App Router sitemap handler |
| `app/layout.tsx` | Add canonical to default metadata |
| `app/about/page.tsx` | Add canonical + openGraph |
| `app/services/page.tsx` | Add canonical + openGraph + sr-only H1 |
| `app/projects/page.tsx` | Add canonical + openGraph + sr-only H1 |
| `app/blog/page.tsx` | Add canonical + openGraph + sr-only H1 |
| `app/contact/page.tsx` | Add canonical + openGraph |
| `app/services/[slug]/page.tsx` | Add canonical + openGraph + FAQPage schema |
| `app/projects/[slug]/page.tsx` | Add canonical + openGraph |
| `app/blog/[slug]/page.tsx` | Add canonical + openGraph + ArticleSchema |
| `components/seo/LocalBusinessSchema.tsx` | Update @type, add sameAs + WebSite schema |
| `components/seo/ArticleSchema.tsx` | New — Article JSON-LD component |
| `components/layout/SiteShell.tsx` | Add `<header>`, skip-to-content link |
| `public/og-image.jpg` | New — copy of hero-1.jpg |

---

## Out of Scope (deferred)

- Local landing pages for specific Bangalore neighbourhoods
- Breadcrumb navigation + BreadcrumbList schema
- `aggregateRating` in schema (needs real review data)
- `hasOfferCatalog` in schema
- `noindex` flag for staging (discussed, deferred to user preference)
