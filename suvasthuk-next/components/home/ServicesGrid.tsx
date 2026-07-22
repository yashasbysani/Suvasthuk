import Link from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceIcon    from '@/components/ui/ServiceIcon'
import { SERVICES }   from '@/lib/services'

// Show only the first 6 on the home page
const HOME_SERVICES = SERVICES.slice(0, 6)

export default function ServicesGrid() {
  return (
    <section className="py-20 md:py-28 bg-sand-dark">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <ScrollReveal>
            <SectionHeading tag="What We Do" title="End-to-end design <br /><strong>&amp; build services</strong>" />
          </ScrollReveal>
          <Link
            href="/services"
            className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors hidden md:block"
          >
            All Services →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {HOME_SERVICES.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 0.07}>
              <Link
                href={s.slug === 'construction' ? '/construction' : `/services/${s.slug}`}
                aria-label={`Learn about our ${s.name} service`}
                className="block bg-cream p-7 rounded-lg hover:shadow-md transition-shadow group h-full"
              >
                <div className="w-11 h-11 rounded-md bg-sand-dark flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <ServiceIcon name={s.icon} className="text-gold" />
                </div>
                <h3 className="font-serif text-lg text-brown-deep mb-2">{s.name}</h3>
                {' '}
                <p className="font-sans text-[13px] text-brown-light leading-relaxed">{s.tagline}</p>
                <p className="font-sans text-[10px] tracking-[2px] uppercase text-gold mt-4">Learn more →</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
