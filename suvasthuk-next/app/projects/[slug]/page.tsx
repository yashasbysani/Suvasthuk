import type { Metadata } from 'next'
import { notFound }    from 'next/navigation'
import Image           from 'next/image'
import Link            from 'next/link'
import { PortableText } from '@portabletext/react'
import { getProjectBySlug, getAllProjectSlugs, urlFor } from '@/sanity/lib/queries'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import ArchitectureGallery from '@/components/projects/ArchitectureGallery'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const revalidate = 3600 // re-generate at most once an hour

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllProjectSlugs().catch(() => [])
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug).catch(() => null)
  if (!project) return {}
  const description = project.seoDescription
    ?? `${project.category} project in ${project.location ?? 'Bengaluru'} by Suvasthuk Architects.`
  const categoryLabel = project.category
    ? project.category.charAt(0).toUpperCase() + project.category.slice(1)
    : null
  const title = project.seoTitle
    ?? (categoryLabel
      ? `${project.title} — ${categoryLabel} Project in Bengaluru`
      : `${project.title} — Architecture Project in Bengaluru`)
  const ogImage = project.coverImage
    ? urlFor(project.coverImage as SanityImageSource).width(1200).height(630).url()
    : '/og-image.jpg'
  return {
    title,
    description,
    alternates: { canonical: `https://suvasthuk.com/projects/${slug}` },
    openGraph: {
      url: `https://suvasthuk.com/projects/${slug}`,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug).catch(() => null)
  if (!project) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://suvasthuk.com' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://suvasthuk.com/projects' },
      { '@type': 'ListItem', position: 3, name: project.title, item: `https://suvasthuk.com/projects/${slug}` },
    ],
  }

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.brief ?? project.seoDescription ?? `${project.title} by Suvasthuk Architects`,
    url: `https://suvasthuk.com/projects/${slug}`,
    creator: { '@id': 'https://suvasthuk.com/#business' },
    ...(project.location && { locationCreated: { '@type': 'Place', name: project.location } }),
    ...(project.year && { dateCreated: String(project.year) }),
    ...(project.category && { genre: project.category }),
  }

  return (
    <main id="main-content" className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }} />
      <Breadcrumb items={[
        { label: 'Home',     href: '/' },
        { label: 'Projects', href: '/projects' },
        { label: project.title },
      ]} />
      {/* Hero image */}
      <div className="relative h-[60vh] min-h-[400px] bg-sand-dark overflow-hidden">
        {project.coverImage && (
          <Image
            src={urlFor(project.coverImage as SanityImageSource).width(1600).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3 capitalize">{project.category}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-sand max-w-2xl leading-tight">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Key stats */}
      <div className="bg-sand-dark">
        <div className="max-w-content mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-sand-dark">
          {[
            { label: 'Area',     value: project.area },
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
              <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">The Brief</h2>
              <p className="font-sans text-[15px] leading-relaxed text-brown-mid">{project.brief}</p>
            </div>
          )}
          {project.designStory && (
            <div>
              <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">Design Story</h2>
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
          <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-6">Gallery</h2>
          <ArchitectureGallery
            images={project.gallery.map((img: SanityImageSource & { alt?: string }, i: number) => ({
              src: urlFor(img).width(1600).url(),
              alt: img.alt || `${project.title}${project.category ? ` — ${project.category} architecture` : ''}${project.location ? ` in ${project.location}` : ' in Bengaluru'} | Suvasthuk Architects — photo ${i + 1}`,
            }))}
          />
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
