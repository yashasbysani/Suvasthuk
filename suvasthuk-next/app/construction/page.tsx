import type { Metadata } from 'next'
import ConstructionHero      from '@/components/construction/ConstructionHero'
import ConstructionServices  from '@/components/construction/ConstructionServices'
import ConstructionProjects  from '@/components/construction/ConstructionProjects'
import ConstructionProcess   from '@/components/construction/ConstructionProcess'
import ConstructionCtaBand   from '@/components/construction/ConstructionCtaBand'
import Testimonial           from '@/components/home/Testimonial'
import {
  getFeaturedConstructionProjects,
  getTestimonials,
} from '@/sanity/lib/queries'

export const revalidate = 3600 // re-generate at most once an hour

export const metadata: Metadata = {
  title: 'Construction Company in Bengaluru',
  description:
    'Trusted construction company in Bengaluru since 1993. Residential, commercial & turnkey construction. 1024+ projects delivered. Get a free quote.',
  alternates: { canonical: 'https://suvasthuk.com/construction' },
  openGraph: {
    url: 'https://suvasthuk.com/construction',
    title: 'Construction Company in Bengaluru | Suvasthuk Architects',
    description: 'Trusted construction company in Bengaluru since 1993. 1024+ projects delivered.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default async function ConstructionPage() {
  const [projects, testimonials] = await Promise.all([
    getFeaturedConstructionProjects().catch(() => []),
    getTestimonials().catch(() => []),
  ])

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['GeneralContractor', 'HomeAndConstructionBusiness'],
            name: 'Suvasthuk Architects — Construction',
            url: 'https://suvasthuk.com/construction',
            description:
              'Trusted construction company in Bengaluru since 1993. Residential, commercial & turnkey construction.',
            parentOrganization: { '@id': 'https://suvasthuk.com/#business' },
            areaServed: [
              { '@type': 'City',  name: 'Bengaluru' },
              { '@type': 'State', name: 'Karnataka' },
            ],
            priceRange: '₹₹₹',
          }),
        }}
      />
      <ConstructionHero />
      <ConstructionServices />
      <ConstructionProjects projects={projects} />
      <ConstructionProcess />
      <Testimonial testimonials={testimonials} dark />
      <ConstructionCtaBand />
    </main>
  )
}
