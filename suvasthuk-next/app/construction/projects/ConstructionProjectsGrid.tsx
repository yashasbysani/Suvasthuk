'use client'

import { useState } from 'react'
import Link         from 'next/link'
import Image        from 'next/image'
import ScrollReveal from '@/components/animations/ScrollReveal'
import { urlFor }   from '@/sanity/lib/queries'
import type { ConstructionProject } from '@/sanity/lib/queries'

const FALLBACK: ConstructionProject[] = [
  { title: 'Residential Villa, Whitefield',    category: 'residential',   slug: { current: '#' }, localImage: '/images/Projects/General/General (36).jpg' },
  { title: 'Commercial Complex, Hebbal',        category: 'commercial',    slug: { current: '#' }, localImage: '/images/Projects/General/General (18).jpg' },
  { title: 'Turnkey Office, Indiranagar',       category: 'turnkey',       slug: { current: '#' }, localImage: '/images/Projects/General/General (30).jpg' },
  { title: 'School Campus, Yelahanka',          category: 'institutional', slug: { current: '#' }, localImage: '/images/Projects/Poorna Vikas Vidyalaya/School (3).jpg' },
  { title: 'Apartment Renovation, Koramangala', category: 'renovation',    slug: { current: '#' }, localImage: '/images/Projects/General/General (34).jpg' },
  { title: 'Row House Layout, Devanahalli',     category: 'residential',   slug: { current: '#' }, localImage: '/images/Projects/General/General (29).jpg' },
  { title: 'Hospital Wing, Rajajinagar',        category: 'institutional', slug: { current: '#' }, localImage: '/images/Projects/Poorna Vikas Vidyalaya/School (5).jpg' },
  { title: 'Retail Complex, Whitefield',        category: 'commercial',    slug: { current: '#' }, localImage: '/images/Projects/General/General (32).jpg' },
  { title: 'Penthouse Build, HSR Layout',       category: 'residential',   slug: { current: '#' }, localImage: '/images/Projects/General/General (44).jpg' },
  { title: 'Turnkey Villa, Sarjapur',           category: 'turnkey',       slug: { current: '#' }, localImage: '/images/Projects/General/General (35).jpg' },
  { title: 'Office Park, Electronic City',      category: 'commercial',    slug: { current: '#' }, localImage: '/images/Projects/General/General (1).jpg'  },
  { title: 'Community Hall, Yelahanka',         category: 'institutional', slug: { current: '#' }, localImage: '/images/Projects/Poorna Vikas Vidyalaya/School (7).jpg' },
]

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Turnkey', 'Renovation', 'Institutional']
const PAGE_SIZE   = 50

export default function ConstructionProjectsGrid({ initialProjects }: { initialProjects: ConstructionProject[] }) {
  const projects = initialProjects.length ? initialProjects : FALLBACK
  const [filter, setFilter]   = useState('All')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase())

  const shown   = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  function handleFilterChange(cat: string) {
    setFilter(cat)
    setVisible(PAGE_SIZE)
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleFilterChange(cat)}
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
        {shown.map((p, i) => {
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
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisible(v => v + PAGE_SIZE)}
            className="font-sans text-[10px] tracking-[3px] uppercase text-cement hover:text-cement-dark border border-cement px-8 py-3 rounded-full transition-colors duration-200"
          >
            Load More ({filtered.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
