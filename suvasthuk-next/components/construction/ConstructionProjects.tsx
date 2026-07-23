import Link         from 'next/link'
import Image        from 'next/image'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import PhotoCountBadge from '@/components/ui/PhotoCountBadge'
import { urlFor }   from '@/sanity/lib/queries'
import type { ConstructionProject } from '@/sanity/lib/queries'

const FALLBACK: ConstructionProject[] = [
  { title: 'Residential Villa, Whitefield',     category: 'residential',   slug: { current: '#' }, localImage: '/images/Projects/General/General (36).jpg' },
  { title: 'Commercial Complex, Hebbal',         category: 'commercial',    slug: { current: '#' }, localImage: '/images/Projects/General/General (18).jpg' },
  { title: 'Turnkey Office, Indiranagar',        category: 'turnkey',       slug: { current: '#' }, localImage: '/images/Projects/General/General (30).jpg' },
  { title: 'School Campus, Yelahanka',           category: 'institutional', slug: { current: '#' }, localImage: '/images/Projects/Poorna Vikas Vidyalaya/School (3).jpg' },
  { title: 'Apartment Renovation, Koramangala',  category: 'renovation',    slug: { current: '#' }, localImage: '/images/Projects/General/General (34).jpg' },
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
        <PhotoCountBadge count={project.photoCount} />
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
          <SectionHeading tag="Our Work" title="Construction case studies" dark />
        </ScrollReveal>
        <Link
          href="/construction/projects"
          className="font-sans text-[10px] tracking-[2px] uppercase text-cement hover:text-cement-dark transition-colors hidden md:block"
        >
          All Projects →
        </Link>
      </div>

      {/* Asymmetric mosaic */}
      <div className="max-w-content mx-auto px-6 grid md:grid-cols-3 gap-3 md:auto-rows-[280px]">
        {featured[0] && (
          <ScrollReveal className="md:row-span-2">
            <div className="aspect-[3/4] md:aspect-auto md:h-[572px]">
              <ProjectCard project={featured[0]} className="h-full" />
            </div>
          </ScrollReveal>
        )}
        {featured.slice(1).map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.08}>
            <div className="aspect-video md:aspect-auto md:h-[280px]">
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
