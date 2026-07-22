import type { Metadata } from 'next'
import Link           from 'next/link'
import Image           from 'next/image'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import CtaBand        from '@/components/home/CtaBand'

export const metadata: Metadata = {
  title: 'About — Architecture Firm in Bengaluru Since 1993',
  description: 'Suvasthuk Architects — a Bengaluru-based architecture and design practice founded in 1993 by B K Muralidhar. 30+ years, 1000+ projects.',
  alternates: { canonical: 'https://suvasthuk.com/about' },
  openGraph: {
    url: 'https://suvasthuk.com/about',
    title: 'About Suvasthuk Architects — Architecture Firm in Bengaluru Since 1993',
    description: 'Suvasthuk Architects — a Bengaluru-based architecture and design practice founded in 1993 by B K Muralidhar. 30+ years, 1000+ projects.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

const TEAM = [
  {
    name: 'B K Muralidhar',
    role: 'Principal Architect & Founder',
    since: '1993',
    image: '/images/Muralidhar-headshot.png',
    education: [
      'Malnad College of Engineering, Hassan, Karnataka (Graduated 1987) — Mysore University, Karnataka',
    ],
    affiliations: [
      'Member of Council of Architecture, India (Member since 1992)',
      'Registration Number: 92/14579 (Valid for lifetime)',
    ],
  },
]

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'B K Muralidhar',
  jobTitle: 'Principal Architect & Founder',
  worksFor: {
    '@type': 'Organization',
    name: 'Suvasthuk Architects',
    url: 'https://suvasthuk.com',
  },
  url: 'https://suvasthuk.com/about',
  knowsAbout: ['Architecture', 'Interior Design', 'Urban Planning', 'Vastu Shastra'],
  alumniOf: { '@type': 'Organization', name: 'Bengaluru Architecture Practice' },
}

export default function AboutPage() {
  return (
    <main id="main-content" className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {/* Hero */}
      <div className="bg-charcoal py-24 px-6">
        <div className="max-w-content mx-auto">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">Our Story</p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-sand leading-tight max-w-2xl">
            Three decades of building{' '}<br /><em>Bengaluru better</em>
          </h1>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-content mx-auto px-6 py-20">
        {/* About image */}
        <ScrollReveal>
          <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden mb-16 bg-charcoal">
            <Image
              src="/images/about-section-1.jpg"
              alt="Suvasthuk Architects studio"
              fill
              sizes="(min-width:1024px) 1024px, 100vw"
              className="object-contain"
            />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-16">
          <ScrollReveal>
            <SectionHeading tag="Founded 1993" title="Where it <br /><strong>all began</strong>" />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="space-y-5 font-sans text-[16px] leading-[1.85] text-brown-mid">
              <p>
                Suvasthuk Architects was founded in 1993 by B K Muralidhar with a single conviction:
                that buildings are bridges between people, nature, culture, and history. That the spaces
                we inhabit have a profound effect on how we feel, work, and relate to one another.
              </p>
              <p>
                The firm began with residential projects — exploring the relationship between dwellings
                and the landscapes they inhabit. From that foundation, it has grown to encompass schools,
                commercial interiors, institutional buildings, and large-scale layouts, always carrying
                the same &ldquo;macro to micro&rdquo; philosophy.
              </p>
              <p>
                Today, from our studio in Sahakar Nagar, Bengaluru, a team of architects, designers,
                and engineers collaborates on projects across the city and beyond. Every project —
                a small house or a campus — receives the same energy and attention. The scale changes.
                The commitment does not.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-sand-dark mt-20 rounded-lg overflow-hidden">
          {[
            { value: '30+',   label: 'Years in practice'  },
            { value: '826+',  label: 'Satisfied clients'  },
            { value: '1024+', label: 'Projects completed' },
            { value: '1993',  label: 'Year founded'       },
          ].map(({ value, label }) => (
            <div key={label} className="bg-cream px-6 py-8 text-center">
              <p className="font-serif text-3xl text-brown-deep">{value}</p>
              <p className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light mt-2">{label}</p>
            </div>
          ))}
        </div>

        {/* Internal links */}
        <ScrollReveal>
          <div className="flex flex-wrap gap-6 mt-16">
            <Link
              href="/services"
              className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid border-b border-gold pb-1 hover:text-brown-deep transition-colors"
            >
              Our Services →
            </Link>
            <Link
              href="/projects"
              className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid border-b border-gold pb-1 hover:text-brown-deep transition-colors"
            >
              View Portfolio →
            </Link>
            <Link
              href="/contact"
              className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid border-b border-gold pb-1 hover:text-brown-deep transition-colors"
            >
              Get in Touch →
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Team */}
      <div className="bg-sand-dark py-20 px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <SectionHeading tag="The Team" title="The people behind <br /><strong>the work</strong>" className="mb-12" />
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <ScrollReveal key={member.name}>
                <div className="bg-cream rounded-lg p-7">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-5">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <h2 className="font-serif text-xl text-brown-deep">{member.name}</h2>
                  <p className="font-sans text-[12px] text-gold mt-1">{member.role}</p>
                  <p className="font-sans text-[12px] text-brown-light mt-1">Since {member.since}</p>

                  {member.education && (
                    <div className="mt-5 pt-5 border-t border-sand-dark">
                      <p className="font-sans text-[9px] tracking-[2px] uppercase text-brown-light mb-2">Education</p>
                      <ul className="space-y-1">
                        {member.education.map((line) => (
                          <li key={line} className="font-sans text-[12px] text-brown-mid leading-relaxed">{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {member.affiliations && (
                    <div className="mt-4">
                      <p className="font-sans text-[9px] tracking-[2px] uppercase text-brown-light mb-2">Professional Affiliation</p>
                      <ul className="space-y-1">
                        {member.affiliations.map((line) => (
                          <li key={line} className="font-sans text-[12px] text-brown-mid leading-relaxed">{line}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="font-sans text-[12px] text-brown-light mt-6 text-center">
            Full team profiles coming soon.
          </p>
        </div>
      </div>

      <CtaBand />
    </main>
  )
}
