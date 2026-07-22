# Suvasthuk Architects Website Rebuild — Phase 2: CMS, Pages & SEO

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up Sanity CMS, build all inner pages (Projects, Blog, Services, Contact, About), implement full SEO (metadata, schema markup, sitemap), and verify production build.

**Architecture:** Sanity Studio runs embedded at `/studio`. All dynamic content (projects, blog posts, testimonials) is fetched at build time via `generateStaticParams` + ISR. Static service pages use MDX. SEO metadata via Next.js `generateMetadata`. Schema markup injected via `<script type="application/ld+json">` in each page.

**Prerequisites:** Phase 1 plan complete. `suvasthuk-next/` exists with full homepage.

**Tech Stack:** Sanity v3, next-sanity, GROQ queries, Resend, React Hook Form, next-sitemap

---

### Task 10: Sanity CMS — setup, schemas, client

**Files:**
- Create: `suvasthuk-next/sanity/sanity.config.ts`
- Create: `suvasthuk-next/sanity/schemaTypes/project.ts`
- Create: `suvasthuk-next/sanity/schemaTypes/blogPost.ts`
- Create: `suvasthuk-next/sanity/schemaTypes/testimonial.ts`
- Create: `suvasthuk-next/sanity/lib/client.ts`
- Create: `suvasthuk-next/sanity/lib/queries.ts`
- Modify: `suvasthuk-next/next.config.ts`

- [ ] **Step 1: Create a free Sanity project**

Go to https://sanity.io/manage → "New project" → name it "Suvasthuk Architects" → note the **Project ID** (looks like `abc12def`).

- [ ] **Step 2: Install Sanity packages**

```bash
cd suvasthuk-next
npm install sanity next-sanity @sanity/image-url
```

Expected: packages installed, no peer-dep errors.

- [ ] **Step 3: Add env variables**

Create `suvasthuk-next/.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                  # leave blank for now — read-only public queries work without it
RESEND_API_KEY=                    # fill in Task 16
```

Add `.env.local` to `.gitignore` inside `suvasthuk-next/`:
```
.env.local
.next/
node_modules/
```

- [ ] **Step 4: Create sanity/lib/client.ts**

```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

- [ ] **Step 5: Create sanity/schemaTypes/project.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title',    type: 'string',  title: 'Title',    validation: r => r.required() }),
    defineField({ name: 'slug',     type: 'slug',    title: 'Slug',     options: { source: 'title' }, validation: r => r.required() }),
    defineField({
      name: 'category', type: 'string', title: 'Category',
      options: { list: ['residential','commercial','interior','institutional','renovation'] },
      validation: r => r.required(),
    }),
    defineField({ name: 'area',     type: 'string',  title: 'Area (e.g. 4,200 sq ft)' }),
    defineField({ name: 'location', type: 'string',  title: 'Location (e.g. Whitefield, Bengaluru)' }),
    defineField({ name: 'year',     type: 'number',  title: 'Year Completed' }),
    defineField({ name: 'services', type: 'array',   title: 'Services', of: [{ type: 'string' }] }),
    defineField({ name: 'coverImage', type: 'image', title: 'Cover Image', options: { hotspot: true } }),
    defineField({ name: 'gallery',  type: 'array',   title: 'Gallery',  of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'brief',    type: 'text',    title: 'Client Brief' }),
    defineField({ name: 'designStory', type: 'array', title: 'Design Story', of: [{ type: 'block' }] }),
    defineField({ name: 'tags',     type: 'array',   title: 'Tags',     of: [{ type: 'string' }] }),
    defineField({ name: 'featured', type: 'boolean', title: 'Show on homepage mosaic', initialValue: false }),
    defineField({ name: 'seoTitle', type: 'string',  title: 'SEO Title (override)' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description (override)', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'category' },
  },
})
```

- [ ] **Step 6: Create sanity/schemaTypes/blogPost.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string',   title: 'Title',    validation: r => r.required() }),
    defineField({ name: 'slug',        type: 'slug',     title: 'Slug',     options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'category',    type: 'string',   title: 'Category' }),
    defineField({ name: 'coverImage',  type: 'image',    title: 'Cover Image', options: { hotspot: true } }),
    defineField({ name: 'excerpt',     type: 'text',     title: 'Excerpt (150 chars)', rows: 2 }),
    defineField({ name: 'author',      type: 'string',   title: 'Author', initialValue: 'Suvasthuk Architects' }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Published At' }),
    defineField({ name: 'readTime',    type: 'number',   title: 'Read Time (minutes)' }),
    defineField({ name: 'body',        type: 'array',    title: 'Body',     of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'tags',        type: 'array',    title: 'Tags',     of: [{ type: 'string' }] }),
    defineField({ name: 'seoTitle',    type: 'string',   title: 'SEO Title (override)' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'publishedAt' },
  },
})
```

- [ ] **Step 7: Create sanity/schemaTypes/testimonial.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote',    type: 'text',   title: 'Quote',        validation: r => r.required() }),
    defineField({ name: 'author',   type: 'string', title: 'Client Name',  validation: r => r.required() }),
    defineField({ name: 'location', type: 'string', title: 'Location / Project type' }),
    defineField({ name: 'order',    type: 'number', title: 'Display order' }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'quote' },
  },
})
```

- [ ] **Step 8: Create sanity/sanity.config.ts**

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { project }     from './schemaTypes/project'
import { blogPost }    from './schemaTypes/blogPost'
import { testimonial } from './schemaTypes/testimonial'

export default defineConfig({
  name: 'suvasthuk',
  title: 'Suvasthuk Architects CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: [project, blogPost, testimonial] },
})
```

- [ ] **Step 9: Create studio route — app/studio/[[...tool]]/page.tsx**

```typescript
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

- [ ] **Step 10: Create sanity/lib/queries.ts**

```typescript
import { client } from './client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)

// Projects
export async function getFeaturedProjects() {
  return client.fetch(`*[_type=="project" && featured==true] | order(_createdAt desc) [0..4] {
    title, slug, category, coverImage
  }`)
}

export async function getAllProjects() {
  return client.fetch(`*[_type=="project"] | order(year desc) {
    title, slug, category, area, location, year, coverImage
  }`)
}

export async function getProjectBySlug(slug: string) {
  return client.fetch(`*[_type=="project" && slug.current==$slug][0] {
    title, slug, category, area, location, year, services,
    coverImage, gallery, brief, designStory, tags, seoTitle, seoDescription
  }`, { slug })
}

export async function getAllProjectSlugs() {
  return client.fetch(`*[_type=="project"]{ "slug": slug.current }`)
}

// Blog
export async function getAllBlogPosts() {
  return client.fetch(`*[_type=="blogPost"] | order(publishedAt desc) {
    title, slug, category, coverImage, excerpt, author, publishedAt, readTime
  }`)
}

export async function getBlogPostBySlug(slug: string) {
  return client.fetch(`*[_type=="blogPost" && slug.current==$slug][0] {
    title, slug, category, coverImage, excerpt, author,
    publishedAt, readTime, body, tags, seoTitle, seoDescription
  }`, { slug })
}

export async function getAllBlogSlugs() {
  return client.fetch(`*[_type=="blogPost"]{ "slug": slug.current }`)
}

// Testimonials
export async function getTestimonials() {
  return client.fetch(`*[_type=="testimonial"] | order(order asc) { quote, author, location }`)
}
```

- [ ] **Step 11: Update next.config.ts to allow Sanity image CDN**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 12: Verify studio loads**

```bash
npm run dev
```

Open http://localhost:3000/studio — Sanity Studio should load with Project, Blog Post, Testimonial document types visible.

- [ ] **Step 13: Commit**

```bash
cd .. && git add suvasthuk-next/sanity suvasthuk-next/app/studio suvasthuk-next/next.config.ts suvasthuk-next/.gitignore
git commit -m "feat: Sanity CMS schemas, client, GROQ queries, and embedded Studio"
```

---

### Task 11: Update homepage to use Sanity data

**Files:**
- Modify: `suvasthuk-next/components/home/ProjectsMosaic.tsx`
- Modify: `suvasthuk-next/components/home/Testimonial.tsx`
- Modify: `suvasthuk-next/app/page.tsx`

- [ ] **Step 1: Update app/page.tsx to fetch data server-side**

```typescript
import Hero           from '@/components/home/Hero'
import Marquee        from '@/components/home/Marquee'
import StatsBar       from '@/components/home/StatsBar'
import AboutStrip     from '@/components/home/AboutStrip'
import ServicesGrid   from '@/components/home/ServicesGrid'
import ProjectsMosaic from '@/components/home/ProjectsMosaic'
import Testimonial    from '@/components/home/Testimonial'
import BlogPreview    from '@/components/home/BlogPreview'
import CtaBand        from '@/components/home/CtaBand'
import { getFeaturedProjects, getTestimonials } from '@/sanity/lib/queries'

export default async function HomePage() {
  const [featuredProjects, testimonials] = await Promise.all([
    getFeaturedProjects(),
    getTestimonials(),
  ])

  return (
    <main>
      <Hero />
      <Marquee />
      <StatsBar />
      <AboutStrip />
      <ServicesGrid />
      <ProjectsMosaic projects={featuredProjects} />
      <Testimonial testimonials={testimonials} />
      <BlogPreview />
      <CtaBand />
    </main>
  )
}
```

- [ ] **Step 2: Update ProjectsMosaic.tsx to accept props**

Replace the top of the file (the `FEATURED` static array and function signature):

```typescript
import Image from 'next/image'
import Link  from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import { urlFor }     from '@/sanity/lib/queries'

interface Project {
  title: string
  slug: { current: string }
  category: string
  coverImage: unknown
}

interface Props { projects: Project[] }

export default function ProjectsMosaic({ projects }: Props) {
  // Falls back gracefully if Sanity has no featured projects yet
  if (!projects.length) return null

  const [main, ...rest] = projects
```

Then replace the card rendering to use real images:

Large left card becomes:
```typescript
<Link href={`/projects/${main.slug.current}`} data-cursor="view"
  className="relative overflow-hidden rounded-lg bg-sand-dark aspect-[3/4] md:aspect-auto md:h-full group block">
  {main.coverImage && (
    <Image
      src={urlFor(main.coverImage).width(800).url()}
      alt={main.title}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-700"
    />
  )}
  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
  <div className="absolute bottom-0 left-0 right-0 p-6">
    <p className="font-sans text-[8px] tracking-[3px] uppercase text-sand/60 mb-1 capitalize">{main.category}</p>
    <p className="font-serif text-lg text-sand">{main.title}</p>
  </div>
</Link>
```

Small cards (map over `rest`):
```typescript
{rest.map((p, i) => (
  <ScrollReveal key={p.slug.current} delay={i * 0.08}>
    <Link href={`/projects/${p.slug.current}`} data-cursor="view"
      className="relative overflow-hidden rounded-lg bg-sand-dark aspect-video group block">
      {p.coverImage && (
        <Image
          src={urlFor(p.coverImage).width(600).url()}
          alt={p.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-sans text-[7px] tracking-[3px] uppercase text-sand/60 mb-1 capitalize">{p.category}</p>
        <p className="font-serif text-sm text-sand">{p.title}</p>
      </div>
    </Link>
  </ScrollReveal>
))}
```

- [ ] **Step 3: Update Testimonial.tsx to accept props**

Replace the static `TESTIMONIALS` array and component signature:

```typescript
'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'

interface TestimonialItem { quote: string; author: string; location: string }
interface Props { testimonials: TestimonialItem[] }

// Fallback if Sanity has no testimonials yet
const FALLBACK: TestimonialItem[] = [
  {
    quote: "Suvasthuk didn't just design our home — they understood how we live. The result is a space that feels completely ours.",
    author: 'Priya & Arvind Sharma',
    location: 'Residential Client · Jayanagar, Bengaluru',
  },
]

export default function Testimonial({ testimonials }: Props) {
  const items = testimonials.length ? testimonials : FALLBACK
  const [active, setActive] = useState(0)
  const t = items[active]
  // ... rest of the JSX unchanged
```

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: `✓ Compiled successfully` — if Sanity project ID is valid. If `.env.local` is missing the project ID, build may fail with a fetch error. Ensure `.env.local` has the correct `NEXT_PUBLIC_SANITY_PROJECT_ID`.

- [ ] **Step 5: Commit**

```bash
cd .. && git add suvasthuk-next/app/page.tsx suvasthuk-next/components/home/ProjectsMosaic.tsx suvasthuk-next/components/home/Testimonial.tsx
git commit -m "feat: homepage pulls featured projects and testimonials from Sanity"
```

---

### Task 12: Projects listing page (masonry + filter)

**Files:**
- Create: `suvasthuk-next/app/projects/page.tsx`
- Create: `suvasthuk-next/components/projects/FilterBar.tsx`
- Create: `suvasthuk-next/components/projects/MasonryGrid.tsx`
- Create: `suvasthuk-next/components/projects/ProjectCard.tsx`

- [ ] **Step 1: Create ProjectCard.tsx**

```typescript
import Link  from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/queries'

interface Props {
  title:    string
  slug:     { current: string }
  category: string
  coverImage: unknown
}

export default function ProjectCard({ title, slug, category, coverImage }: Props) {
  return (
    <Link
      href={`/projects/${slug.current}`}
      data-cursor="view"
      className="relative overflow-hidden rounded-lg bg-sand-dark block group"
      style={{ breakInside: 'avoid', marginBottom: '12px' }}
    >
      {coverImage ? (
        <Image
          src={urlFor(coverImage).width(700).url()}
          alt={title}
          width={700}
          height={500}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="aspect-video bg-gradient-to-br from-gold/20 to-gold-dark/30" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="font-sans text-[8px] tracking-[3px] uppercase text-sand/60 mb-1 capitalize">{category}</p>
        <p className="font-serif text-base text-sand">{title}</p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create FilterBar.tsx**

```typescript
'use client'

const FILTERS = ['All', 'Residential', 'Commercial', 'Interior', 'Institutional', 'Renovation']

interface Props {
  active: string
  onChange: (f: string) => void
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`font-sans text-[9px] tracking-[2px] uppercase px-4 py-2 rounded-full border transition-colors ${
            active === f
              ? 'bg-brown-deep text-sand border-brown-deep'
              : 'bg-transparent text-brown-mid border-gold hover:border-brown-deep hover:text-brown-deep'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create MasonryGrid.tsx**

```typescript
'use client'

import { useState } from 'react'
import FilterBar    from './FilterBar'
import ProjectCard  from './ProjectCard'

interface Project {
  title: string
  slug: { current: string }
  category: string
  coverImage: unknown
}

export default function MasonryGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase())

  return (
    <div>
      <FilterBar active={filter} onChange={setFilter} />
      {/* CSS columns masonry */}
      <div style={{ columnCount: 3, columnGap: '12px' }} className="md:columns-3 columns-1 sm:columns-2">
        {filtered.map((p) => (
          <ProjectCard key={p.slug.current} {...p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-sans text-brown-light text-center py-20">No projects in this category yet.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create app/projects/page.tsx**

```typescript
import type { Metadata } from 'next'
import MasonryGrid    from '@/components/projects/MasonryGrid'
import SectionHeading from '@/components/ui/SectionHeading'
import { getAllProjects } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Architecture Portfolio',
  description: 'Browse 1000+ completed projects — residential villas, commercial spaces, schools and more across Bangalore and Karnataka.',
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-12">
          <SectionHeading
            tag="Our Work"
            title="Projects that<br /><strong>speak for themselves</strong>"
          />
        </div>
        <MasonryGrid projects={projects} />
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 6: Commit**

```bash
cd .. && git add suvasthuk-next/app/projects/page.tsx suvasthuk-next/components/projects
git commit -m "feat: projects listing with filterable masonry grid"
```

---

### Task 13: Project case study page

**Files:**
- Create: `suvasthuk-next/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create app/projects/[slug]/page.tsx**

```typescript
import type { Metadata } from 'next'
import { notFound }   from 'next/navigation'
import Image          from 'next/image'
import Link           from 'next/link'
import { PortableText } from '@portabletext/react'
import { getProjectBySlug, getAllProjectSlugs, urlFor } from '@/sanity/lib/queries'

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllProjectSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) return {}
  return {
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? `${project.category} project in ${project.location} by Suvasthuk Architects.`,
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()

  return (
    <main className="pt-16">
      {/* Hero image */}
      <div className="relative h-[60vh] min-h-[400px] bg-sand-dark overflow-hidden">
        {project.coverImage && (
          <Image
            src={urlFor(project.coverImage).width(1600).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3 capitalize">{project.category}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-sand max-w-2xl leading-tight">{project.title}</h1>
        </div>
      </div>

      {/* Key stats */}
      <div className="bg-sand-dark">
        <div className="max-w-content mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-sand-dark">
          {[
            { label: 'Area',     value: project.area     },
            { label: 'Location', value: project.location },
            { label: 'Year',     value: project.year?.toString() },
            { label: 'Services', value: project.services?.join(', ') },
          ].map(({ label, value }) => value ? (
            <div key={label} className="bg-cream px-6 py-5">
              <p className="font-sans text-[8px] tracking-[3px] uppercase text-gold mb-1">{label}</p>
              <p className="font-sans text-[13px] font-medium text-brown-deep leading-snug">{value}</p>
            </div>
          ) : null)}
        </div>
      </div>

      {/* Brief + design story */}
      <div className="max-w-content mx-auto px-6 py-16 md:py-20 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          {project.brief && (
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">The Brief</p>
              <p className="font-sans text-[15px] leading-relaxed text-brown-mid">{project.brief}</p>
            </div>
          )}
          {project.designStory && (
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">Design Story</p>
              <div className="font-sans text-[15px] leading-relaxed text-brown-mid prose prose-sm max-w-none">
                <PortableText value={project.designStory} />
              </div>
            </div>
          )}
        </div>
        {/* Tags */}
        {project.tags?.length > 0 && (
          <div>
            <p className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-4">Tags</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="font-sans text-[9px] tracking-[1px] uppercase px-3 py-1.5 border border-gold rounded-full text-brown-mid"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery */}
      {project.gallery?.length > 0 && (
        <div className="max-w-content mx-auto px-6 pb-16">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-6">Gallery</p>
          <div style={{ columnCount: 2, columnGap: '12px' }} className="md:columns-2 columns-1">
            {project.gallery.map((img: unknown, i: number) => (
              <div key={i} data-cursor="view" className="mb-3 overflow-hidden rounded-lg group" style={{ breakInside: 'avoid' }}>
                <Image
                  src={urlFor(img).width(900).url()}
                  alt={`${project.title} — photo ${i + 1}`}
                  width={900}
                  height={600}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="max-w-content mx-auto px-6 pb-16">
        <Link
          href="/projects"
          className="font-sans text-[10px] tracking-[3px] uppercase text-brown-light hover:text-brown-deep transition-colors border-b border-gold pb-1"
        >
          ← All Projects
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Install PortableText renderer**

```bash
cd suvasthuk-next && npm install @portabletext/react
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. Dynamic `[slug]` routes are statically generated from Sanity.

- [ ] **Step 4: Commit**

```bash
cd .. && git add suvasthuk-next/app/projects/[slug] suvasthuk-next/package.json suvasthuk-next/package-lock.json
git commit -m "feat: project case study page with gallery, stats, and PortableText"
```

---

### Task 14: Blog listing + post pages

**Files:**
- Create: `suvasthuk-next/app/blog/page.tsx`
- Create: `suvasthuk-next/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create app/blog/page.tsx**

```typescript
import type { Metadata } from 'next'
import Link  from 'next/link'
import Image from 'next/image'
import SectionHeading from '@/components/ui/SectionHeading'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import { getAllBlogPosts, urlFor } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Architecture & Design Insights',
  description: 'Expert articles on architecture, interior design, construction costs, Vastu, and building in Bangalore.',
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-14">
          <SectionHeading tag="Insights" title="From our <strong>studio</strong>" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post: { title: string; slug: { current: string }; category: string; coverImage: unknown; excerpt: string; readTime: number }, i: number) => (
            <ScrollReveal key={post.slug.current} delay={i * 0.07}>
              <Link href={`/blog/${post.slug.current}`} className="group block">
                <div className="aspect-video rounded-lg overflow-hidden bg-sand-dark mb-4">
                  {post.coverImage ? (
                    <Image
                      src={urlFor(post.coverImage).width(600).url()}
                      alt={post.title}
                      width={600}
                      height={337}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold-dark/30 group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <p className="font-sans text-[8px] tracking-[3px] uppercase text-gold mb-2">{post.category}</p>
                <h2 className="font-serif text-xl text-brown-deep mb-2 leading-snug group-hover:text-gold-dark transition-colors">
                  {post.title}
                </h2>
                <p className="font-sans text-[13px] text-brown-light leading-relaxed line-clamp-2">{post.excerpt}</p>
                {post.readTime && (
                  <p className="font-sans text-[11px] text-brown-light/60 mt-2">{post.readTime} min read</p>
                )}
              </Link>
            </ScrollReveal>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="font-sans text-brown-light text-center py-20">Articles coming soon.</p>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create app/blog/[slug]/page.tsx**

```typescript
import type { Metadata } from 'next'
import { notFound }   from 'next/navigation'
import Image          from 'next/image'
import { PortableText } from '@portabletext/react'
import { getBlogPostBySlug, getAllBlogSlugs, urlFor } from '@/sanity/lib/queries'

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllBlogSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <main className="pt-16">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] bg-sand-dark overflow-hidden">
        {post.coverImage && (
          <Image
            src={urlFor(post.coverImage).width(1600).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">{post.category}</p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-sand max-w-2xl leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="font-sans text-[11px] text-sand/40">{post.author}</span>
            {post.readTime && <span className="font-sans text-[11px] text-sand/40">{post.readTime} min read</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {post.body && (
          <div className="font-sans text-[16px] leading-[1.85] text-brown-mid prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-brown-deep
            prose-strong:text-brown-deep prose-a:text-gold-dark prose-a:no-underline hover:prose-a:underline">
            <PortableText value={post.body} />
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-sand-dark">
            {post.tags.map((tag: string) => (
              <span key={tag} className="font-sans text-[9px] tracking-[1px] uppercase px-3 py-1.5 border border-gold rounded-full text-brown-mid">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-sand-dark flex gap-4">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(post.title + ' https://suvasthuk.com/blog/' + params.slug)}`}
            target="_blank" rel="noopener noreferrer"
            className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors"
          >
            Share on WhatsApp
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent('https://suvasthuk.com/blog/' + params.slug)}`}
            target="_blank" rel="noopener noreferrer"
            className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors"
          >
            Share on LinkedIn
          </a>
        </div>
      </article>
    </main>
  )
}
```

- [ ] **Step 3: Install Tailwind typography plugin**

```bash
cd suvasthuk-next && npm install -D @tailwindcss/typography
```

Add to `tailwind.config.ts` plugins:
```typescript
plugins: [require('@tailwindcss/typography')],
```

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 5: Commit**

```bash
cd .. && git add suvasthuk-next/app/blog suvasthuk-next/tailwind.config.ts suvasthuk-next/package.json suvasthuk-next/package-lock.json
git commit -m "feat: blog listing and post pages with PortableText and share buttons"
```

---

### Task 15: Services pages

**Files:**
- Create: `suvasthuk-next/app/services/page.tsx`
- Create: `suvasthuk-next/app/services/[slug]/page.tsx`
- Create: `suvasthuk-next/lib/services.ts`

- [ ] **Step 1: Create lib/services.ts** (all service data in one place)

```typescript
export interface ServiceData {
  name: string
  slug: string
  tagline: string
  description: string
  process: { step: string; detail: string }[]
  faq: { q: string; a: string }[]
}

export const SERVICES: ServiceData[] = [
  {
    name: 'Architectural Design',
    slug: 'architectural-design',
    tagline: 'From concept sketch to permit-ready drawings.',
    description: `Architectural design is the heart of everything we do at Suvasthuk. Since 1993, we have translated hundreds of client briefs into built reality across Bangalore. Our process starts with deep listening — understanding how you live, work, and move through space. We then develop concepts that balance aesthetics, function, Vastu principles where required, and the practical constraints of your site and budget. Every design is resolved at both the macro level (massing, orientation, natural light) and the micro level (material choices, joinery, thresholds). We produce complete drawing sets: floor plans, elevations, sections, and 3D visualisations, through to construction and working drawings.`,
    process: [
      { step: 'Brief & Site Analysis', detail: 'We meet, listen, and visit your site to understand orientation, neighbours, and context.' },
      { step: 'Concept Design',        detail: 'Sketches, mood boards, and a 3D massing study — your first look at the building.' },
      { step: 'Design Development',    detail: 'Detailed floor plans, elevations, sections, and material palette finalised.' },
      { step: 'Construction Drawings', detail: 'Complete working drawings ready for contractor tendering and BBMP submission.' },
    ],
    faq: [
      { q: 'How long does architectural design take?', a: 'A typical residential project takes 4–8 weeks from brief to permit-ready drawings, depending on scope and revision cycles.' },
      { q: 'Do you handle BBMP approvals?', a: 'Yes — we prepare sanction plan drawings to BBMP specifications and guide you through the approval process.' },
      { q: 'Can I make changes mid-design?', a: 'Absolutely. We build revision rounds into every stage so the design evolves with your thinking.' },
    ],
  },
  {
    name: 'Interior Design',
    slug: 'interior-design',
    tagline: 'Spaces that feel as good as they look.',
    description: `Interior design at Suvasthuk is not about decoration — it is about making space feel right. We design interiors for homes, offices, retail spaces, and hospitality projects across Bangalore. Our approach ties every interior decision back to how the space will be used: furniture layouts that make rooms feel generous, lighting layers that shift a room from work to rest, material choices that age beautifully and are practical to maintain. We work across styles — contemporary, traditional, Indo-modern fusion — always anchored by your brief and budget. Our services cover space planning, furniture selection and custom design, lighting design, material and finish specification, and site supervision.`,
    process: [
      { step: 'Space Planning',      detail: 'Optimise furniture layout, traffic flow, and functional zones before choosing finishes.' },
      { step: 'Concept & Palette',   detail: 'Mood boards with materials, colours, furniture, and lighting directions.' },
      { step: 'Design Documentation', detail: 'Detailed drawings, specifications, and vendor BOQs for execution.' },
      { step: 'Site Execution',      detail: 'We supervise contractors and do quality checks at every stage.' },
    ],
    faq: [
      { q: 'Do you do turnkey interior projects?', a: 'Yes — we can manage the full execution, coordinating vendors, contractors, and procurement on your behalf.' },
      { q: 'What is the minimum budget for interior design?', a: 'A 1,000 sq ft apartment interior typically starts at ₹8–12 lakhs for mid-range finishes, and ₹15–25 lakhs for premium.' },
      { q: 'Can you work with existing furniture?', a: 'Absolutely. We incorporate pieces you love and design around them.' },
    ],
  },
  {
    name: 'Construction',
    slug: 'construction',
    tagline: 'Full-contract build with labour and materials.',
    description: `Suvasthuk offers complete construction services — we take responsibility for the entire build, from foundation to handover. This means you deal with one team, not a patchwork of contractors. We manage civil works, structural execution, MEP (mechanical, electrical, plumbing), finishes, and landscaping. Our construction contracts are transparent: detailed BOQs upfront, no hidden escalations, and a fixed handover date. With 30+ years of relationships with trusted vendors and sub-contractors in Bangalore, we maintain quality and schedule without compromise.`,
    process: [
      { step: 'BOQ & Contract',     detail: 'Detailed bill of quantities with fixed rates, so you know exactly what you are paying for.' },
      { step: 'Foundation & Civil', detail: 'Structural execution per approved drawings, with RCC and masonry quality checks.' },
      { step: 'MEP & Finishes',     detail: 'Electrical, plumbing, tiling, carpentry, painting — coordinated under one roof.' },
      { step: 'Handover',           detail: 'Final punch list, snag clearance, and keys handed over on schedule.' },
    ],
    faq: [
      { q: 'What is the cost per sq ft for construction in Bangalore?', a: 'Mid-range construction runs ₹1,800–2,500/sq ft. Premium finishes with branded fixtures can go up to ₹3,500+/sq ft. We provide detailed estimates after a site visit.' },
      { q: 'Do you provide a construction warranty?', a: 'Yes — one-year defect liability period post-handover, covering structural and waterproofing defects.' },
      { q: 'Can you build from another architect\'s drawings?', a: 'Yes. We are happy to execute construction from approved drawings prepared by others.' },
    ],
  },
  {
    name: 'Structural Design',
    slug: 'structural-design',
    tagline: 'Engineering drawings for every stage of your project.',
    description: `Every building needs a sound structural design — one that is safe, code-compliant, and optimised for cost. Our structural engineering team produces complete drawings for residential, commercial, and institutional projects in Bangalore. We work with RCC framed structures, load-bearing masonry, and steel, adapting to the scale and soil conditions of each project. Our drawings are produced to BBMP and IS code standards, and are coordinated with architectural drawings to avoid conflicts. We also provide peer review of structural drawings prepared by others.`,
    process: [
      { step: 'Soil & Site Assessment', detail: 'Review soil test reports and site conditions to determine appropriate foundation type.' },
      { step: 'Structural Scheme',       detail: 'Column grid, beam depths, slab spans — structural concept aligned with architecture.' },
      { step: 'Working Drawings',        detail: 'Reinforcement details for foundation, columns, beams, slabs, and staircase.' },
      { step: 'Site Support',            detail: 'Available to answer contractor queries and review bar bending schedules.' },
    ],
    faq: [
      { q: 'Is structural design mandatory for BBMP approval?', a: 'Yes — BBMP requires structural drawings signed by a licensed structural engineer for most new constructions.' },
      { q: 'Can you review an existing structural design?', a: 'Yes, we offer peer review services for an independent check of structural drawings.' },
    ],
  },
  {
    name: 'Vastu Consultation',
    slug: 'vastu-consultation',
    tagline: 'Aligned spaces and harmonious living.',
    description: `Vastu Shastra, when applied thoughtfully, creates homes and workspaces that feel balanced and harmonious. At Suvasthuk, we offer Vastu consultation both as a standalone service and integrated into our architectural design process. We do not apply Vastu as a rigid ruleset that overrides practical design — instead, we work with the underlying principles of orientation, energy flow, and spatial hierarchy to create spaces that feel right. Our consultations cover new construction (plot selection, orientation, room placement, entry design), interior layouts, and remediation for existing buildings.`,
    process: [
      { step: 'Plot & Orientation Review', detail: 'Analyse plot direction, surrounding context, and entry placement.' },
      { step: 'Layout Consultation',       detail: 'Room placement, door and window positions, kitchen and master bedroom orientation.' },
      { step: 'Interior Recommendations',  detail: 'Colour, material, and furniture placement aligned with Vastu principles.' },
      { step: 'Remediation (if needed)',   detail: 'Practical solutions for existing buildings that cannot be rebuilt.' },
    ],
    faq: [
      { q: 'Can Vastu and modern design coexist?', a: 'Yes — the majority of Vastu principles align naturally with good design: orientation for natural light, logical room adjacencies, clear entries. We reconcile the two seamlessly.' },
      { q: 'Do you offer Vastu for commercial spaces?', a: 'Yes — offices, retail stores, and hospitality spaces all benefit from Vastu-aligned planning.' },
    ],
  },
  {
    name: 'Renovation',
    slug: 'renovation',
    tagline: 'Refresh and transform existing spaces.',
    description: `A renovation done well can transform a dated or dysfunctional space into something you love again — without the cost and disruption of a full rebuild. Suvasthuk handles renovations from small apartment refreshes to complete gut-and-redo projects on older bungalows and heritage properties in Bangalore. We assess existing structure and services, identify what can be retained, and design interventions that make the most impact within your budget. Our renovation projects cover layout changes, kitchen and bathroom upgrades, flooring, facades, and full-service interior renovations.`,
    process: [
      { step: 'Condition Assessment', detail: 'Inspect existing structure, services, and finishes to understand what can be kept and what must go.' },
      { step: 'Design Brief',         detail: 'Agree on scope, priorities, and budget before any design work begins.' },
      { step: 'Design & Documentation', detail: 'Drawings and specifications for approved renovation scope.' },
      { step: 'Execution',            detail: 'Coordinated execution minimising disruption, especially in occupied spaces.' },
    ],
    faq: [
      { q: 'How long does a typical apartment renovation take?', a: 'A 2BHK renovation covering flooring, painting, kitchen and bathrooms typically takes 6–10 weeks.' },
      { q: 'Can you renovate while the space is occupied?', a: 'Yes — we phase the work room by room so you can continue living or working during the renovation.' },
    ],
  },
  {
    name: 'Landscaping',
    slug: 'landscaping',
    tagline: 'Gardens and outdoor spaces that extend your home.',
    description: `The outdoor space around a building is as important as the building itself. Suvasthuk designs landscapes for residential plots, institutional campuses, and commercial properties across Bangalore. Our landscaping work covers site grading and drainage, planting design, paving, water features, boundary treatments, and lighting. We work with local plants suited to Bangalore's climate — drought-tolerant, low-maintenance species that look beautiful year-round. Our designs integrate seamlessly with the architecture, using the same material palette and language.`,
    process: [
      { step: 'Site Survey',       detail: 'Map existing trees, levels, drainage patterns, and soil conditions.' },
      { step: 'Concept Design',    detail: 'Planting palette, paving layout, feature elements, and lighting concept.' },
      { step: 'Documentation',     detail: 'Planting plan, irrigation layout, and paving details for execution.' },
      { step: 'Establishment',     detail: 'We oversee planting and provide a maintenance guide for the first year.' },
    ],
    faq: [
      { q: 'Do you handle terrace gardens?', a: 'Yes — terrace and balcony gardens are a speciality, with lightweight planting media and integrated waterproofing.' },
    ],
  },
  {
    name: 'Layout Planning',
    slug: 'layout-planning',
    tagline: 'Master planning for plots and developments.',
    description: `Layout planning is required when subdividing land, planning a gated community, or developing a multi-plot site. Suvasthuk prepares detailed layout plans that comply with BBMP, BDA, and RERA regulations. We handle road widths, setbacks, common amenities, drainage, and phasing. Our layouts are designed not just for regulatory approval but for livability — well-oriented plots, generous road widths, and green buffers.`,
    process: [
      { step: 'Site & Regulation Review', detail: 'Understand applicable regulations (BBMP, BDA, RERA) and site constraints.' },
      { step: 'Layout Concept',           detail: 'Plot arrangement, road network, amenities, and open space.' },
      { step: 'Approval Drawings',        detail: 'Drawings prepared to authority standards for submission.' },
      { step: 'Execution Support',        detail: 'Site marking, infrastructure coordination, and RERA registration support.' },
    ],
    faq: [
      { q: 'How long does layout approval take in Bangalore?', a: 'BBMP layout approval typically takes 3–6 months. We manage the process and follow up on your behalf.' },
    ],
  },
  {
    name: 'Sanction Plans & TDR',
    slug: 'sanction-plans-tdr',
    tagline: 'BBMP approvals and Transferable Development Rights.',
    description: `Navigating BBMP sanction plans and TDR (Transferable Development Rights) requires deep knowledge of local regulations. Suvasthuk has over 30 years of experience obtaining building sanctions in Bangalore, including complex cases involving TDR utilisation. We prepare plan approval drawings to BBMP standards, handle documentation, and liaise with authorities on your behalf. We also buy and sell TDR certificates to help clients maximise their permissible built-up area.`,
    process: [
      { step: 'Documentation Checklist', detail: 'Compile all required documents: khata, sketch, EC, structural certificate, etc.' },
      { step: 'Sanction Drawings',       detail: 'Prepare BBMP-format drawings — site plan, floor plans, elevations, sections.' },
      { step: 'Submission & Follow-up',  detail: 'Submit application and manage the approval process through to sanction order.' },
      { step: 'TDR (if applicable)',     detail: 'Identify TDR availability, calculate permissible utilisation, and procure certificates.' },
    ],
    faq: [
      { q: 'What documents are needed for BBMP plan sanction?', a: 'Khata certificate, property sketch, encumbrance certificate, structural stability certificate, and NOCs from BDA/fire/BWSSB depending on building height and use.' },
      { q: 'What is TDR and how can it help?', a: 'TDR lets you purchase additional floor area beyond your normal FAR entitlement. It is bought and sold as a certificate. We help you assess whether TDR is available for your area and handle procurement.' },
    ],
  },
  {
    name: 'Elevation Designs',
    slug: 'elevation-designs',
    tagline: 'Facades that make a lasting first impression.',
    description: `The elevation is what the world sees — it sets expectations before anyone steps inside. Suvasthuk designs elevations for new construction and for existing buildings seeking a refresh. Our elevation designs balance the architectural character of the building, the neighbourhood context, material availability, and maintenance requirements. We produce detailed elevation drawings with material callouts, profiles, and 3D renders so you can visualise exactly how your building will look.`,
    process: [
      { step: 'Character Study',         detail: 'Analyse context, style preferences, and material options.' },
      { step: '2D Elevation Design',     detail: 'Detailed drawings showing window proportions, cladding, projections, and roof profile.' },
      { step: '3D Visualisation',        detail: 'Photo-realistic renders for client approval before construction.' },
      { step: 'Material Specification',  detail: 'Detailed spec sheets for contractors with approved sources.' },
    ],
    faq: [
      { q: 'Can you redesign just the elevation of an existing building?', a: 'Yes — facade upgrades are a cost-effective way to modernise an older building without a full renovation.' },
    ],
  },
]
```

- [ ] **Step 2: Create app/services/page.tsx**

```typescript
import type { Metadata } from 'next'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import { SERVICES }   from '@/lib/services'

export const metadata: Metadata = {
  title: 'Architecture & Design Services in Bangalore',
  description: 'Full-service architecture firm offering architectural design, interior design, construction, Vastu consultation and more in Bangalore.',
}

export default function ServicesPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-14">
          <SectionHeading tag="What We Do" title="End-to-end design<br /><strong>&amp; build services</strong>" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 0.06}>
              <Link href={`/services/${s.slug}`} className="block bg-cream p-7 rounded-lg hover:shadow-md transition-shadow group h-full">
                <div className="w-9 h-9 rounded-md bg-sand-dark mb-5 group-hover:bg-gold/20 transition-colors" />
                <h2 className="font-serif text-xl text-brown-deep mb-2">{s.name}</h2>
                <p className="font-sans text-[13px] text-brown-light leading-relaxed">{s.tagline}</p>
                <p className="font-sans text-[10px] tracking-[2px] uppercase text-gold mt-4">Learn more →</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Create app/services/[slug]/page.tsx**

```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import { SERVICES }   from '@/lib/services'

export function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const s = SERVICES.find(s => s.slug === params.slug)
  if (!s) return {}
  return {
    title: `${s.name} in Bangalore`,
    description: `${s.tagline} Suvasthuk Architects, Bangalore — 30+ years experience.`,
  }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find(s => s.slug === params.slug)
  if (!service) notFound()

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <div className="bg-charcoal py-20 px-6 mb-0">
        <div className="max-w-content mx-auto">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">Services</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-sand max-w-2xl leading-tight">
            {service.name}
          </h1>
          <p className="font-sans text-[15px] text-sand/50 mt-4 max-w-lg">{service.tagline}</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">
        {/* Description */}
        <ScrollReveal>
          <div className="py-14 md:py-20 max-w-2xl">
            <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-5">What We Do</p>
            <p className="font-sans text-[16px] leading-[1.85] text-brown-mid">{service.description}</p>
          </div>
        </ScrollReveal>

        {/* Process */}
        <ScrollReveal>
          <div className="py-14 border-t border-sand-dark">
            <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-8">Our Process</p>
            <div className="grid md:grid-cols-2 gap-6">
              {service.process.map((p, i) => (
                <div key={i} className="bg-sand-dark rounded-lg p-6">
                  <p className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-3">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="font-serif text-lg text-brown-deep mb-2">{p.step}</h3>
                  <p className="font-sans text-[13px] text-brown-mid leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <div className="py-14 border-t border-sand-dark">
            <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-8">Frequently Asked</p>
            <div className="space-y-6 max-w-2xl">
              {service.faq.map((f, i) => (
                <div key={i}>
                  <h3 className="font-serif text-lg text-brown-deep mb-2">{f.q}</h3>
                  <p className="font-sans text-[14px] text-brown-mid leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <div className="py-14 border-t border-sand-dark flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-serif text-2xl text-brown-deep">Start your {service.name.toLowerCase()} project</p>
              <p className="font-sans text-[13px] text-brown-light mt-1">Get in touch for a free initial consultation.</p>
            </div>
            <Link
              href="/contact"
              className="inline-block bg-brown-deep text-sand font-sans font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-brown-mid transition-colors whitespace-nowrap"
            >
              Get in Touch
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. All 10 service routes statically generated.

- [ ] **Step 5: Commit**

```bash
cd .. && git add suvasthuk-next/lib/services.ts suvasthuk-next/app/services
git commit -m "feat: services overview and 10 individual service pages with FAQ"
```

---

### Task 16: Contact page + Resend email API

**Files:**
- Create: `suvasthuk-next/app/contact/page.tsx`
- Create: `suvasthuk-next/app/api/contact/route.ts`

- [ ] **Step 1: Set up Resend**

Sign up at https://resend.com (free tier: 3,000 emails/month). Get an API key and add it to `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

- [ ] **Step 2: Create app/api/contact/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, phone, email, projectType, budget, message } = await req.json()

  // Basic server-side validation
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'Suvasthuk Website <noreply@suvasthuk.com>',
      to:   'suvasthuk@gmail.com',
      replyTo: email,
      subject: `New enquiry from ${name} — ${projectType ?? 'General'}`,
      html: `
        <h2>New website enquiry</h2>
        <table cellpadding="8">
          <tr><td><strong>Name</strong></td><td>${name}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone ?? '—'}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
          <tr><td><strong>Project type</strong></td><td>${projectType ?? '—'}</td></tr>
          <tr><td><strong>Budget</strong></td><td>${budget ?? '—'}</td></tr>
          <tr><td><strong>Message</strong></td><td>${message}</td></tr>
        </table>
      `,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Failed to send message. Please try calling us directly.' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Create app/contact/page.tsx**

```typescript
'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

const PROJECT_TYPES = [
  'Residential Design', 'Interior Design', 'Construction',
  'Renovation', 'Commercial Project', 'Vastu Consultation',
  'Sanction Plans / TDR', 'Other',
]

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-14">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-brown-deep leading-tight">
            Let&apos;s build something<br /><em>together</em>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact info */}
          <div className="space-y-10">
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Meet</p>
              <a
                href="https://g.page/suvasthuk?share"
                target="_blank" rel="noopener noreferrer"
                className="font-sans text-[15px] text-brown-mid leading-relaxed hover:text-brown-deep transition-colors"
              >
                F6 17/2, 1st Floor, Kodigehalli Main Rd<br />
                Sahakar Nagar, Bengaluru 560092
              </a>
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Talk</p>
              <a href="tel:+918041110467"  className="block font-sans text-[15px] text-brown-mid hover:text-brown-deep transition-colors">080 – 41110467</a>
              <a href="tel:+919480444666"  className="block font-sans text-[15px] text-brown-mid hover:text-brown-deep transition-colors mt-1">+91 9480444666</a>
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Write</p>
              <a href="mailto:suvasthuk@gmail.com" className="font-sans text-[15px] text-brown-mid hover:text-brown-deep transition-colors">
                suvasthuk@gmail.com
              </a>
            </div>
          </div>

          {/* Form */}
          <div>
            {status === 'success' ? (
              <div className="bg-sand-dark rounded-lg p-8">
                <p className="font-serif text-2xl text-brown-deep mb-2">Thank you!</p>
                <p className="font-sans text-[15px] text-brown-mid">We&apos;ve received your message and will get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">Name *</label>
                    <input name="name" required className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">Phone</label>
                    <input name="phone" type="tel" className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">Email *</label>
                  <input name="email" type="email" required className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">Project Type</label>
                  <select name="projectType" className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold">
                    <option value="">Select…</option>
                    {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">Approximate Budget</label>
                  <select name="budget" className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold">
                    <option value="">Prefer not to say</option>
                    <option>Under ₹20 lakhs</option>
                    <option>₹20–50 lakhs</option>
                    <option>₹50 lakhs – 1 crore</option>
                    <option>Above ₹1 crore</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">Message *</label>
                  <textarea name="message" required rows={5} className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold resize-none" />
                </div>
                {status === 'error' && (
                  <p className="font-sans text-[13px] text-red-600">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-brown-deep text-sand font-sans font-semibold text-[11px] tracking-[2px] uppercase py-4 rounded hover:bg-brown-mid transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
```

Note: `app/contact/page.tsx` uses `'use client'` because of the form state. Add an `export const metadata` from a separate server component or move metadata to a `layout.tsx` inside `app/contact/`. The simplest solution is to add a `app/contact/layout.tsx`:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Suvasthuk Architects in Sahakar Nagar, Bangalore. Call +91 9480444666 or email suvasthuk@gmail.com.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 5: Test form locally**

```bash
npm run dev
```

Open http://localhost:3000/contact, fill the form, submit. Check terminal for Resend API response (requires valid `.env.local` RESEND_API_KEY and a verified sender domain in Resend).

- [ ] **Step 6: Commit**

```bash
cd .. && git add suvasthuk-next/app/contact suvasthuk-next/app/api
git commit -m "feat: contact page with Resend email API and form validation"
```

---

### Task 17: About page

**Files:**
- Create: `suvasthuk-next/app/about/page.tsx`

- [ ] **Step 1: Create app/about/page.tsx**

```typescript
import type { Metadata } from 'next'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand        from '@/components/home/CtaBand'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Suvasthuk Architects — a Bangalore-based architecture and design practice founded in 1993 by B K Muralidhar. 30+ years, 1000+ projects.',
}

const TEAM_PLACEHOLDER = [
  { name: 'B K Muralidhar', role: 'Principal Architect & Founder', since: '1993' },
]

export default function AboutPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <div className="bg-charcoal py-24 px-6">
        <div className="max-w-content mx-auto">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">Our Story</p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-sand leading-tight max-w-2xl">
            Three decades of building<br /><em>Bangalore better</em>
          </h1>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-content mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          <ScrollReveal>
            <SectionHeading tag="Founded 1993" title="Where it<br /><strong>all began</strong>" />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="space-y-5 font-sans text-[16px] leading-[1.85] text-brown-mid">
              <p>
                Suvasthuk Architects was founded in 1993 by B K Muralidhar with a single conviction:
                that buildings are bridges between people, nature, culture, and history. That the spaces
                we inhabit have a profound effect on how we feel, work, and relate to one another.
              </p>
              <p>
                The firm began with residential projects — exploring the relationship between dwellings
                and the landscapes they inhabit. From that foundation, it has grown to encompass schools,
                commercial interiors, institutional buildings, and large-scale layouts, always carrying
                the same "macro to micro" philosophy.
              </p>
              <p>
                Today, from our studio in Sahakar Nagar, Bengaluru, a team of architects, designers,
                and engineers collaborates on projects across the city and beyond. Every project —
                a small house or a campus — receives the same energy and attention. The scale changes.
                The commitment does not.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-sand-dark mt-20 rounded-lg overflow-hidden">
          {[
            { value: '30+',   label: 'Years in practice'  },
            { value: '826+',  label: 'Satisfied clients'  },
            { value: '1024+', label: 'Projects completed' },
            { value: '1993',  label: 'Year founded'       },
          ].map(({ value, label }) => (
            <div key={label} className="bg-cream px-6 py-8 text-center">
              <p className="font-serif text-3xl text-brown-deep">{value}</p>
              <p className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light mt-2">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-sand-dark py-20 px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <SectionHeading tag="The Team" title="The people behind<br /><strong>the work</strong>" className="mb-12" />
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM_PLACEHOLDER.map((member) => (
              <ScrollReveal key={member.name}>
                <div className="bg-cream rounded-lg p-7">
                  <div className="w-16 h-16 rounded-full bg-sand-dark mb-5" />
                  {/* Replace with actual team photo */}
                  <h2 className="font-serif text-xl text-brown-deep">{member.name}</h2>
                  <p className="font-sans text-[12px] text-gold mt-1">{member.role}</p>
                  <p className="font-sans text-[12px] text-brown-light mt-1">Since {member.since}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="font-sans text-[12px] text-brown-light mt-6 text-center">
            Full team profiles coming soon.
          </p>
        </div>
      </div>

      <CtaBand />
    </main>
  )
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
cd .. && git add suvasthuk-next/app/about
git commit -m "feat: about page with firm story, stats, and team section"
```

---

### Task 18: SEO — LocalBusiness schema markup on all pages

**Files:**
- Create: `suvasthuk-next/components/seo/LocalBusinessSchema.tsx`
- Modify: `suvasthuk-next/app/layout.tsx`

- [ ] **Step 1: Create LocalBusinessSchema.tsx**

```typescript
export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: 'Suvasthuk Architects',
    image: 'https://suvasthuk.com/logo.svg',
    url: 'https://suvasthuk.com',
    telephone: '+91-9480444666',
    email: 'suvasthuk@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'F6 17/2, 1st Floor, Kodigehalli Main Rd',
      addressLocality: 'Sahakar Nagar, Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560092',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.0591,
      longitude: 77.5803,
    },
    openingHours: 'Mo-Sa 09:00-18:00',
    foundingDate: '1993',
    priceRange: '₹₹₹',
    areaServed: 'Bangalore, Karnataka',
    serviceType: [
      'Architectural Design', 'Interior Design', 'Construction',
      'Structural Design', 'Vastu Consultation', 'Renovation',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

- [ ] **Step 2: Add to root layout.tsx `<head>`**

```typescript
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
// ...
<html ...>
  <head>
    <LocalBusinessSchema />
  </head>
  <body>...</body>
</html>
```

- [ ] **Step 3: Build and verify schema**

```bash
npm run build && npm run start
```

Open http://localhost:3000, view page source, confirm `application/ld+json` script is present with the LocalBusiness JSON.

Validate at: https://validator.schema.org/ — paste the URL or the JSON directly.

- [ ] **Step 4: Commit**

```bash
cd .. && git add suvasthuk-next/components/seo suvasthuk-next/app/layout.tsx
git commit -m "feat: LocalBusiness + ProfessionalService schema markup on all pages"
```

---

### Task 19: Sitemap, robots.txt, and production build verification

**Files:**
- Create: `suvasthuk-next/next-sitemap.config.js`
- Modify: `suvasthuk-next/package.json`

- [ ] **Step 1: Create next-sitemap.config.js**

```javascript
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
    // Homepage gets highest priority
    if (path === '/') return { ...config, priority: 1.0, changefreq: 'daily' }
    // Project and blog pages get high priority
    if (path.startsWith('/projects/') || path.startsWith('/blog/')) {
      return { ...config, priority: 0.9, changefreq: 'monthly' }
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority }
  },
}
```

- [ ] **Step 2: Add postbuild script to package.json**

In `suvasthuk-next/package.json`, find the `"scripts"` section and add:

```json
"postbuild": "next-sitemap"
```

So it looks like:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "postbuild": "next-sitemap",
  "start": "next start",
  "lint": "next lint"
}
```

- [ ] **Step 3: Final production build**

```bash
cd suvasthuk-next && npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

✓ sitemap.xml generated
✓ robots.txt generated
```

If TypeScript errors appear, fix them before proceeding.

- [ ] **Step 4: Smoke test locally**

```bash
npm run start
```

Check each route:
- http://localhost:3000 — homepage loads, hero animates
- http://localhost:3000/projects — masonry grid
- http://localhost:3000/blog — blog listing
- http://localhost:3000/services — services grid
- http://localhost:3000/services/architectural-design — service detail page
- http://localhost:3000/contact — contact form
- http://localhost:3000/about — about page
- http://localhost:3000/sitemap.xml — sitemap present
- http://localhost:3000/robots.txt — robots.txt present

- [ ] **Step 5: Add .gitignore entries**

Ensure `suvasthuk-next/.gitignore` contains:
```
node_modules/
.next/
.env.local
public/sitemap*.xml
public/robots.txt
```

- [ ] **Step 6: Final commit**

```bash
cd .. && git add suvasthuk-next/next-sitemap.config.js suvasthuk-next/package.json suvasthuk-next/.gitignore
git commit -m "feat: next-sitemap config, robots.txt, and production build verified"
```

---

## Post-Build Checklist (before deploying to Vercel)

- [ ] Replace `public/logo.svg` with the actual client logo SVG
- [ ] Add a real hero photograph to `app/components/home/Hero.tsx` (replace the `bg-gradient` div with `next/image`)
- [ ] Enter real `NEXT_PUBLIC_SANITY_PROJECT_ID` in Vercel environment variables
- [ ] Enter `RESEND_API_KEY` in Vercel environment variables
- [ ] Verify sender domain in Resend dashboard (the `from:` address in `route.ts` must use a verified domain, or use `onboarding@resend.dev` for testing)
- [ ] Add Vercel project, connect git repo, set custom domain `suvasthuk.com`
- [ ] Enter at least 5 featured projects in Sanity Studio so the homepage mosaic is populated
- [ ] Enter 2–3 testimonials in Sanity Studio
- [ ] Add `.superpowers/` to root `.gitignore`
