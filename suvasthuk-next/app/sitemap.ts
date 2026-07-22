import type { MetadataRoute } from 'next'
import { getAllBlogSlugs, getAllProjectSlugs, getAllConstructionProjectSlugs } from '@/sanity/lib/queries'
import { SERVICES } from '@/lib/services'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const BASE = 'https://suvasthuk.com'

// Realistic last-modified dates for stable static pages
const SITE_LAUNCH  = new Date('2024-01-01')
const CONTENT_DATE = new Date('2026-01-01')

const CONSTRUCTION_SERVICE_SLUGS = [
  'residential-construction',
  'commercial-construction',
  'turnkey-projects',
  'project-management',
  'renovation',
  'institutional',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, projectSlugs, constructionProjectSlugs] = await Promise.all([
    getAllBlogSlugs().catch(() => []),
    getAllProjectSlugs().catch(() => []),
    getAllConstructionProjectSlugs().catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                       lastModified: CONTENT_DATE, changeFrequency: 'daily',   priority: 1.0  },
    { url: `${BASE}/about`,                  lastModified: SITE_LAUNCH,  changeFrequency: 'monthly', priority: 0.7  },
    { url: `${BASE}/services`,               lastModified: CONTENT_DATE, changeFrequency: 'weekly',  priority: 0.8  },
    { url: `${BASE}/projects`,               lastModified: CONTENT_DATE, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/blog`,                   lastModified: CONTENT_DATE, changeFrequency: 'weekly',  priority: 0.8  },
    { url: `${BASE}/contact`,                lastModified: SITE_LAUNCH,  changeFrequency: 'monthly', priority: 0.7  },
    { url: `${BASE}/construction`,           lastModified: CONTENT_DATE, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE}/construction/projects`,  lastModified: CONTENT_DATE, changeFrequency: 'weekly',  priority: 0.85 },
    // Yashas Construction storefront hub. NOTE: /construction/services currently redirect()s to
    // /construction — it MUST be converted to a real hub page (roadmap task) for this entry to be valid.
    { url: `${BASE}/construction/services`,  lastModified: CONTENT_DATE, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/privacy-policy`,         lastModified: CONTENT_DATE, changeFrequency: 'yearly',  priority: 0.3  },
  ]

  const archServiceRoutes: MetadataRoute.Sitemap = SERVICES
    .filter(s => s.slug !== 'construction')
    .map(s => ({
      url: `${BASE}/services/${s.slug}`,
      lastModified: CONTENT_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  const constServiceRoutes: MetadataRoute.Sitemap = CONSTRUCTION_SERVICE_SLUGS.map(slug => ({
    url: `${BASE}/construction/services/${slug}`,
    lastModified: CONTENT_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const projectRoutes: MetadataRoute.Sitemap = (projectSlugs as { slug: string; _updatedAt?: string }[]).map(({ slug, _updatedAt }) => ({
    url: `${BASE}/projects/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : CONTENT_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const constProjectRoutes: MetadataRoute.Sitemap = (constructionProjectSlugs as { slug: string; _updatedAt?: string }[]).map(({ slug, _updatedAt }) => ({
    url: `${BASE}/construction/projects/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : CONTENT_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = (blogSlugs as { slug: string; _updatedAt?: string }[]).map(({ slug, _updatedAt }) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : CONTENT_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [
    ...staticRoutes,
    ...archServiceRoutes,
    ...constServiceRoutes,
    ...projectRoutes,
    ...constProjectRoutes,
    ...blogRoutes,
  ]
}
