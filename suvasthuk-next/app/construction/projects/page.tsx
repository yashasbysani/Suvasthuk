import type { Metadata } from 'next'
import SectionHeading from '@/components/ui/SectionHeading'
import ConstructionProjectsGrid from './ConstructionProjectsGrid'
import { getAllConstructionProjects } from '@/sanity/lib/queries'

export const revalidate = 3600 // re-generate at most once an hour

export const metadata: Metadata = {
  title: 'Construction Portfolio',
  description: 'Browse our construction portfolio — residential villas, commercial buildings, turnkey projects across Bengaluru and Karnataka.',
  alternates: { canonical: 'https://suvasthuk.com/construction/projects' },
  openGraph: {
    url: 'https://suvasthuk.com/construction/projects',
    title: 'Construction Portfolio | Suvasthuk Architects Bengaluru',
    description: 'Browse our construction portfolio — residential villas, commercial buildings, turnkey projects across Bengaluru and Karnataka.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function ConstructionProjectsPage() {
  const fetched = await getAllConstructionProjects().catch(() => [])
  return (
    <main id="main-content" className="pt-24 pb-20 bg-concrete min-h-screen">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-12">
          <SectionHeading tag="Our Work" title="Construction case studies" />
        </div>
        <ConstructionProjectsGrid initialProjects={fetched} />
      </div>
    </main>
  )
}
