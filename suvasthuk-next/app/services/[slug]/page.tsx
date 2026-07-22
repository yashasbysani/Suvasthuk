import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link         from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import Breadcrumb     from '@/components/ui/Breadcrumb'
import { SERVICES }   from '@/lib/services'

export function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const s = SERVICES.find(s => s.slug === slug)
  if (!s) return {}
  return {
    title: `${s.name} in Bengaluru`,
    description: `${s.tagline} Suvasthuk Architects, Bengaluru — 30+ years experience.`,
    alternates: { canonical: `https://suvasthuk.com/services/${slug}` },
    openGraph: {
      url: `https://suvasthuk.com/services/${slug}`,
      title: `${s.name} in Bengaluru`,
      description: `${s.tagline} Suvasthuk Architects, Bengaluru — 30+ years experience.`,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = SERVICES.find(s => s.slug === slug)
  if (!service) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://suvasthuk.com' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://suvasthuk.com/services' },
      { '@type': 'ListItem', position: 3, name: service.name, item: `https://suvasthuk.com/services/${slug}` },
    ],
  }

  return (
    <main id="main-content" className="pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: service.faq.map((f: { q: string; a: string }) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: service.name,
            name: service.name,
            description: service.description,
            provider: { '@id': 'https://suvasthuk.com/#business' },
            areaServed: [
              { '@type': 'City',  name: 'Bengaluru' },
              { '@type': 'State', name: 'Karnataka' },
            ],
            url: `https://suvasthuk.com/services/${service.slug}`,
          }),
        }}
      />
      <Breadcrumb items={[
        { label: 'Home',     href: '/' },
        { label: 'Services', href: '/services' },
        { label: service.name },
      ]} />
      {/* Hero */}
      <div className="bg-charcoal py-20 px-6">
        <div className="max-w-content mx-auto">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">Services</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-sand max-w-2xl leading-tight">
            {service.name}
          </h1>
          <p className="font-sans text-[15px] text-sand/50 mt-4 max-w-lg">{service.tagline}</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6">
        {/* Description */}
        <ScrollReveal>
          <div className="py-14 md:py-20 max-w-2xl">
            <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-5">What We Do</h2>
            <p className="font-sans text-[16px] leading-[1.85] text-brown-mid">{service.description}</p>
          </div>
        </ScrollReveal>

        {/* Process */}
        <ScrollReveal>
          <div className="py-14 border-t border-sand-dark">
            <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-8">Our Process</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {service.process.map((p, i) => (
                <div key={i} className="bg-sand-dark rounded-lg p-6">
                  <p className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-serif text-lg text-brown-deep mb-2">{p.step}</h3>
                  <p className="font-sans text-[13px] text-brown-mid leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* FAQ with schema-friendly structure */}
        <ScrollReveal>
          <div className="py-14 border-t border-sand-dark">
            <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6 max-w-2xl">
              {service.faq.map((f, i) => (
                <div key={i}>
                  <h3 className="font-serif text-lg text-brown-deep mb-2">{f.q}</h3>
                  <p className="font-sans text-[14px] text-brown-mid leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Related Services + Portfolio link */}
        <ScrollReveal>
          <div className="py-14 border-t border-sand-dark">
            <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-6">Explore More</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {SERVICES
                .filter(s => s.slug !== service.slug)
                .slice(0, 4)
                .map(s => (
                  <Link
                    key={s.slug}
                    href={s.slug === 'construction' ? '/construction' : `/services/${s.slug}`}
                    className="font-sans text-[11px] tracking-[1px] border border-sand-dark rounded-full px-4 py-2 text-brown-mid hover:border-gold hover:text-brown-deep transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
            </div>
            <Link
              href="/projects"
              className="inline-block font-sans text-[10px] tracking-[2px] uppercase text-brown-mid border-b border-gold pb-1 hover:text-brown-deep transition-colors"
            >
              Browse our portfolio →
            </Link>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <div className="py-14 border-t border-sand-dark flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-serif text-2xl text-brown-deep">
                Start your {service.name.toLowerCase()} project
              </p>
              <p className="font-sans text-[13px] text-brown-light mt-1">
                Get in touch for a free initial consultation.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-block bg-brown-deep text-sand font-sans font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-brown-mid transition-colors whitespace-nowrap"
            >
              Get in Touch
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  )
}
