import type { Metadata } from 'next'
import Link                from 'next/link'
import Image                from 'next/image'
import ScrollReveal        from '@/components/animations/ScrollReveal'
import SectionHeading      from '@/components/ui/SectionHeading'
import ConstructionCtaBand from '@/components/construction/ConstructionCtaBand'

const TITLE = 'About Yashas Construction — Building Since 2011'
const DESCRIPTION =
  'Yashas Construction — a Bengaluru-based construction and contracting firm founded in 2011. 100+ projects delivered, GST-registered, led by Proprietor B M Manasa.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://suvasthuk.com/construction/about' },
  openGraph: {
    url: 'https://suvasthuk.com/construction/about',
    title: `${TITLE} | Suvasthuk Architects`,
    description: DESCRIPTION,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

const TEAM = [
  { name: 'B M Manasa', role: 'Proprietor', image: '/images/manasa-headshot.png' },
  { name: 'B K Muralidhar', role: 'Managing Director & Chairman', image: '/images/Muralidhar-headshot.png' },
]

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'Yashas Construction',
  foundingDate: '2011',
  taxID: '29ABOPB9711E1ZM',
  url: 'https://suvasthuk.com/construction/about',
  founder: { '@type': 'Person', name: 'B M Manasa', jobTitle: 'Proprietor' },
  parentOrganization: { '@type': 'Organization', name: 'Suvasthuk Architects' },
}

export default function ConstructionAboutPage() {
  return (
    <main id="main-content" className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {/* Hero */}
      <div className="bg-concrete-deep py-24 px-6">
        <div className="max-w-content mx-auto">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-cement mb-4">Our Story</p>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-[#f0ede8] leading-tight max-w-2xl">
            Building Foundations,{' '}<br /><em>Delivering Excellence</em>
          </h1>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-content mx-auto px-6 py-20">
        {/* About image */}
        <ScrollReveal>
          <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden mb-16 bg-concrete-deep">
            <Image
              src="/images/about-section-construction.png"
              alt="Yashas Construction site"
              fill
              sizes="(min-width:1024px) 1024px, 100vw"
              className="object-contain"
            />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-16">
          <ScrollReveal>
            <SectionHeading tag="Founded 2011" title="Where it <br /><strong>all began</strong>" />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="space-y-5 font-sans text-[16px] leading-[1.85] text-brown-mid">
              <p>
                Founded in 2011, Yashas Construction was established to bring structural integrity
                and expert execution to every project. Over the past decade, we have successfully
                completed over 100 diverse projects, spanning comprehensive new constructions,
                intricate renovations, and specialized contracting jobs.
              </p>
              <p>
                Originally registered under VAT and subsequently converted to GST
                (GSTIN&nbsp;-&nbsp;29ABOPB9711E1ZM), our firm operates with the highest standards
                of financial transparency and professional compliance.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-[#2a2a2a] mt-20 rounded-lg overflow-hidden">
          {[
            { value: '2011', label: 'Year founded'      },
            { value: '100+', label: 'Projects completed' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-concrete px-6 py-8 text-center">
              <p className="font-serif text-3xl text-[#f0ede8]">{value}</p>
              <p className="font-sans text-[9px] tracking-[3px] uppercase text-[#888] mt-2">{label}</p>
            </div>
          ))}
        </div>

        {/* Internal links */}
        <ScrollReveal>
          <div className="flex flex-wrap gap-6 mt-16">
            <Link
              href="/construction/services"
              className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid border-b border-gold pb-1 hover:text-brown-deep transition-colors"
            >
              Our Services →
            </Link>
            <Link
              href="/construction/projects"
              className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid border-b border-gold pb-1 hover:text-brown-deep transition-colors"
            >
              View Projects →
            </Link>
            <Link
              href="/contact?mode=construction"
              className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid border-b border-gold pb-1 hover:text-brown-deep transition-colors"
            >
              Get in Touch →
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Leadership */}
      <div className="bg-concrete py-20 px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <SectionHeading tag="Our Leadership" title="The people behind <br /><strong>the work</strong>" className="mb-4" dark />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="font-sans text-[15px] leading-relaxed text-[#888] max-w-2xl mb-12">
              At the helm of Yashas Construction is Proprietor B M Manasa, who drives the operational
              success and client relations of the firm. She is guided by the visionary oversight of
              our Managing Director and Chairman, B K Muralidhar, ensuring that every brick laid
              aligns with the master design.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <ScrollReveal key={member.name}>
                <div className="bg-concrete-deep rounded-lg p-7">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-5">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <h2 className="font-serif text-xl text-[#f0ede8]">{member.name}</h2>
                  <p className="font-sans text-[12px] text-cement mt-1">{member.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <ConstructionCtaBand />
    </main>
  )
}
