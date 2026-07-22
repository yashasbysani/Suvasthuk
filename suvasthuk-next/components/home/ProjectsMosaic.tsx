import Link         from 'next/link'
import Image        from 'next/image'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import { urlFor }   from '@/sanity/lib/queries'

type SanityProject = {
  title: string
  slug: { current: string }
  category: string
  coverImage?: { asset: { _ref: string }; hotspot?: unknown }
  localImage?: string
}

const FALLBACK: SanityProject[] = []

function ProjectCard({
  project,
  className = '',
}: {
  project: SanityProject
  className?: string
}) {
  const href = project.slug.current === '#' ? '/projects' : `/projects/${project.slug.current}`
  const imgUrl = project.coverImage
    ? urlFor(project.coverImage).width(800).height(600).url()
    : project.localImage ?? null

  return (
    <Link href={href} className={`block ${className}`}>
      <div
        data-cursor="view"
        className="relative overflow-hidden rounded-lg bg-sand-dark h-full group"
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
          <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-gold-dark/60 group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="font-sans text-[8px] tracking-[3px] uppercase text-sand/60 mb-1 capitalize">
            {project.category}
          </p>
          <p className="font-serif text-lg text-sand">{project.title}</p>
        </div>
      </div>
    </Link>
  )
}

export default function ProjectsMosaic({ projects }: { projects: SanityProject[] }) {
  const list = projects.length ? projects : FALLBACK
  const featured = list.slice(0, 5)

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <ScrollReveal>
          <SectionHeading tag="Featured Work" title="Projects that <br /><strong>speak for themselves</strong>" />
        </ScrollReveal>
        <Link
          href="/projects"
          className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors hidden md:block"
        >
          All Projects →
        </Link>
      </div>

      {/* Asymmetric mosaic: 1 tall left + 4 grid right */}
      <div className="max-w-content mx-auto px-6 grid md:grid-cols-3 gap-3">
        {/* Large left card */}
        {featured[0] && (
          <ScrollReveal className="md:row-span-2">
            <ProjectCard
              project={featured[0]}
              className="h-full aspect-[3/4] md:aspect-auto md:h-full"
            />
          </ScrollReveal>
        )}

        {/* 4 smaller cards */}
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
          href="/projects"
          className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid hover:text-brown-deep transition-colors border-b border-gold pb-1"
        >
          View all projects →
        </Link>
      </div>
    </section>
  )
}
