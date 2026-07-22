import Link         from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceIcon    from '@/components/ui/ServiceIcon'

const SERVICES = [
  { name: 'Residential Construction', desc: 'Villas, apartments, and row houses — built to your specification.',    slug: 'residential-construction', icon: 'Home'         },
  { name: 'Commercial Construction',  desc: 'Offices, retail spaces, and mixed-use buildings across Bangalore.',    slug: 'commercial-construction',  icon: 'Building2'    },
  { name: 'Turnkey Projects',         desc: 'Design-to-delivery under a single contract. Zero coordination stress.', slug: 'turnkey-projects',         icon: 'PackageCheck' },
  { name: 'Project Management',       desc: 'Expert site supervision and contractor coordination.',                  slug: 'project-management',       icon: 'ClipboardList'},
  { name: 'Renovation',               desc: 'Structural upgrades, refits, and complete space transformations.',      slug: 'renovation',               icon: 'Hammer'       },
  { name: 'Institutional',            desc: 'Schools, hospitals, and campuses built to last generations.',           slug: 'institutional',            icon: 'School'       },
]

export default function ConstructionServices() {
  return (
    <section className="py-20 md:py-28 bg-concrete-deep">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <ScrollReveal>
            <SectionHeading tag="What We Build" title="End-to-end construction you can rely on" dark />
          </ScrollReveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 0.07}>
              <Link
                href={`/construction/services/${s.slug}`}
                className="block bg-concrete p-7 rounded-lg border border-[#2a2a2a] hover:border-cement/40 transition-colors group h-full"
              >
                <div className="w-11 h-11 rounded-md bg-concrete-deep flex items-center justify-center mb-5 group-hover:bg-cement/10 transition-colors">
                  <ServiceIcon name={s.icon} className="text-cement" />
                </div>
                <h3 className="font-serif text-lg text-[#f0ede8] mb-2">{s.name}</h3>
                <p className="font-sans text-[13px] text-[#888] leading-relaxed">{s.desc}</p>
                <p className="font-sans text-[10px] tracking-[2px] uppercase text-cement mt-4">Learn more →</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
