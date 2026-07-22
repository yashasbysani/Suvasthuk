import type { Metadata } from 'next'
import MasonryGrid    from '@/components/projects/MasonryGrid'
import SectionHeading from '@/components/ui/SectionHeading'
import { getAllProjects } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Architecture Portfolio in Bengaluru',
  description: 'Browse our portfolio of residential villas, commercial spaces, schools and more across Bengaluru and Karnataka.',
  alternates: { canonical: 'https://suvasthuk.com/projects' },
  openGraph: {
    url: 'https://suvasthuk.com/projects',
    title: 'Architecture Portfolio | Suvasthuk Architects',
    description: 'Browse our portfolio of residential villas, commercial spaces, schools and more across Bengaluru and Karnataka.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export const revalidate = 3600 // re-generate at most once an hour

export default async function ProjectsPage() {
  const projects = await getAllProjects().catch(() => [])

  const itemListSchema = projects.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Architecture Portfolio by Suvasthuk Architects',
    url: 'https://suvasthuk.com/projects',
    itemListElement: projects.map((p: { title: string; slug: { current: string } }, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://suvasthuk.com/projects/${p.slug.current}`,
      name: p.title,
    })),
  } : null

  return (
    <main id="main-content" className="pt-24 pb-20">
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <h1 className="sr-only">Architecture Portfolio in Bengaluru</h1>
      <div className="max-w-content mx-auto px-6">
        <div className="mb-12">
          <SectionHeading
            tag="Our Work"
            title="Projects that <br /><strong>speak for themselves</strong>"
          />
        </div>
        <MasonryGrid projects={projects} />
      </div>
    </main>
  )
}
