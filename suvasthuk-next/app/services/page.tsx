import type { Metadata } from 'next'
import Link from 'next/link'
import SectionHeading from '@/components/ui/SectionHeading'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import ServiceIcon    from '@/components/ui/ServiceIcon'
import { SERVICES }   from '@/lib/services'

export const metadata: Metadata = {
  title: 'Architecture & Design Services in Bengaluru',
  description: 'Full-service architecture firm offering architectural design, interior design, construction, Vastu consultation and more in Bengaluru since 1993.',
  alternates: { canonical: 'https://suvasthuk.com/services' },
  openGraph: {
    url: 'https://suvasthuk.com/services',
    title: 'Architecture & Design Services in Bengaluru',
    description: 'Full-service architecture firm offering architectural design, interior design, construction, Vastu consultation and more in Bengaluru since 1993.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function ServicesPage() {
  return (
    <main id="main-content" className="pt-24 pb-20">
      <h1 className="sr-only">Architecture & Design Services in Bengaluru</h1>
      <div className="max-w-content mx-auto px-6">
        <div className="mb-14">
          <SectionHeading tag="What We Do" title="End-to-end design <br /><strong>&amp; build services</strong>" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 0.06}>
              <Link
                href={s.slug === 'construction' ? '/construction' : `/services/${s.slug}`}
                aria-label={`Learn about our ${s.name} service`}
                className="block bg-cream p-7 rounded-lg hover:shadow-md transition-shadow group h-full"
              >
                <div className="w-11 h-11 rounded-md bg-sand-dark flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <ServiceIcon name={s.icon} className="text-gold" />
                </div>
                <h2 className="font-serif text-xl text-brown-deep mb-2">{s.name}</h2>
                {' '}
                <p className="font-sans text-[13px] text-brown-light leading-relaxed">{s.tagline}</p>
                <p className="font-sans text-[10px] tracking-[2px] uppercase text-gold mt-4">Learn more →</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  )
}
