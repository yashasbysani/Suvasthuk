'use client'

import { useState } from 'react'
import FilterBar    from './FilterBar'
import ProjectCard  from './ProjectCard'

const PAGE_SIZE = 50

interface Project {
  title:       string
  slug:        { current: string }
  category:    string
  coverImage?: unknown
  localImage?: string
}

export default function MasonryGrid({ projects }: { projects: Project[] }) {
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
      <FilterBar active={filter} onChange={handleFilterChange} />
      <div className="columns-1 sm:columns-2 md:columns-3 gap-3">
        {shown.map((p) => (
          <ProjectCard key={p.slug.current} {...p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-sans text-brown-light text-center py-20">No projects in this category yet.</p>
      )}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisible(v => v + PAGE_SIZE)}
            className="font-sans text-[10px] tracking-[3px] uppercase text-brown-light hover:text-brown-deep border border-gold px-8 py-3 rounded-full transition-colors duration-200"
          >
            Load More ({filtered.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
