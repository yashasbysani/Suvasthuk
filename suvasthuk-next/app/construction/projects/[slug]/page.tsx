import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import Image             from 'next/image'
import Link              from 'next/link'
import { PortableText }       from '@portabletext/react'
import ConstructionGallery    from '@/components/construction/ConstructionGallery'
import {
  getConstructionProjectBySlug,
  getAllConstructionProjectSlugs,
  urlFor,
} from '@/sanity/lib/queries'

export const revalidate = 3600 // re-generate at most once an hour

export async function generateStaticParams() {
  const slugs = await getAllConstructionProjectSlugs().catch(() => [])
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = await getConstructionProjectBySlug(slug).catch(() => null)
  if (!project) return {}
  const title = `${project.title} | Construction | Suvasthuk Architects`
  const description = project.description ?? `Construction case study: ${project.title}`
  return {
    title,
    description,
    alternates: { canonical: `https://suvasthuk.com/construction/projects/${slug}` },
    openGraph: {
      url: `https://suvasthuk.com/construction/projects/${slug}`,
      title,
      description,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://suvasthuk.com' },
      { '@type': 'ListItem', position: 2, name: 'Construction', item: 'https://suvasthuk.com/construction' },
      { '@type': 'ListItem', position: 3, name: 'Projects',     item: 'https://suvasthuk.com/construction/projects' },
      { '@type': 'ListItem', position: 4, name: project.title,  item: `https://suvasthuk.com/construction/projects/${slug}` },
    ],
  }

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description ?? `${project.title} — construction case study by Suvasthuk Architects`,
    url: `https://suvasthuk.com/construction/projects/${slug}`,
    creator: { '@id': 'https://suvasthuk.com/#business' },
    ...(project.location && { locationCreated: { '@type': 'Place', name: project.location } }),
    ...(project.completionYear && { dateCreated: String(project.completionYear) }),
    ...(project.category && { genre: project.category }),
  }

  return (
    <main id="main-content" className="bg-concrete min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }} />
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
        {/* Render text blocks via PortableText */}
        {project.body && project.body.some((b: { _type: string }) => b._type === 'block') && (
          <div className="prose prose-invert prose-lg max-w-2xl mb-12
            prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#f0ede8]
            prose-p:text-[#888] prose-p:leading-relaxed
            prose-strong:text-[#f0ede8] prose-a:text-cement">
            <PortableText value={project.body.filter((b: { _type: string }) => b._type === 'block')} />
          </div>
        )}

        {/* Gallery grid with lightbox */}
        {project.body && (() => {
          const galleryImages = project.body
            .filter((b: { _type: string; asset?: { _ref: string } }) => b._type === 'image' && b.asset)
            .map((img: { asset: { _ref: string }; alt?: string }, i: number) => ({
              src: urlFor(img).width(1600).url(),
              alt: img.alt ?? `${project.title} — photo ${i + 1}`,
            }))
          return galleryImages.length > 0 ? <ConstructionGallery images={galleryImages} /> : null
        })()}

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
