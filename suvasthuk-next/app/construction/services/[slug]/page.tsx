import type { Metadata } from 'next'
import { notFound }    from 'next/navigation'
import Link            from 'next/link'
import ServiceIcon     from '@/components/ui/ServiceIcon'
import ConstructionCtaBand from '@/components/construction/ConstructionCtaBand'
import ScrollReveal    from '@/components/animations/ScrollReveal'

type Service = {
  slug:     string
  name:     string
  icon:     string
  tagline:  string
  intro:    string
  whatWeDo: { title: string; detail: string }[]
  process:  { step: string; detail: string }[]
  whyUs:    string[]
  faq:      { q: string; a: string }[]
  seoTitle: string
  seoDesc:  string
}

const SERVICES: Service[] = [
  {
    slug:    'residential-construction',
    name:    'Residential Construction',
    icon:    'Home',
    tagline: 'Homes built to last — and to love.',
    seoTitle: 'Residential Construction in Bengaluru | Suvasthuk Architects',
    seoDesc:  'Trusted residential construction in Bengaluru since 1993. Villas, apartments, row houses built on time with transparent pricing.',
    intro: `Building a home is the single largest investment most families make. At Suvasthuk, we understand that — which is why our residential construction process is built around complete transparency, no subcontracting surprises, and a fixed handover date. Since 1993, we have built villas, independent houses, apartments, and row house layouts across Bengaluru, from compact 20×30 plots to 1-acre estate developments. Every project is managed by a dedicated site engineer who is on-site daily, not just once a week.`,
    whatWeDo: [
      { title: 'Independent Villas & Bungalows',   detail: 'Ground-up construction for G+1 to G+3 independent villas, including basements, terraces, and landscaping.' },
      { title: 'Apartments & Multi-Unit Buildings', detail: 'Stilt + 4 to G+9 apartment buildings with BBMP-approved structural and MEP drawings.' },
      { title: 'Row Houses & Duplex Layouts',       detail: 'Efficient planning for row house developments — shared walls done right, with independent utility connections.' },
      { title: 'Interior & Finishing Work',         detail: 'From tiles and carpentry to painting and landscaping — all finishes under one contract.' },
    ],
    process: [
      { step: 'Site Visit & Soil Test',   detail: 'We inspect the site, review existing approvals, and commission a soil test report to determine the right foundation type.' },
      { step: 'BOQ & Fixed-Price Contract', detail: 'Detailed bill of quantities with locked rates. No escalation clauses, no hidden items.' },
      { step: 'Foundation & Structure',   detail: 'RCC framed structure executed per structural drawings — column casting, slab work, beam layouts inspected at every pour.' },
      { step: 'MEP Rough-In',             detail: 'Plumbing, electrical conduit, and HVAC rough-in before walls are plastered — no hacking later.' },
      { step: 'Finishes & Handover',      detail: 'Tiling, carpentry, painting, electrical fittings, plumbing fixtures — all coordinated, followed by a comprehensive snag walkthrough.' },
    ],
    whyUs: [
      '30+ years building homes in Bengaluru — we know every BBMP zone, soil condition, and sub-contractor.',
      'Dedicated site engineer present every working day — not a weekend-only supervisor.',
      'Transparent pricing with detailed BOQ upfront — no surprises after contract signing.',
      '1-year defect liability period covering structural and waterproofing issues.',
      'In-house structural, MEP, and interior teams — one throat to choke, one number to call.',
    ],
    faq: [
      { q: 'How much does it cost to build a house in Bengaluru?', a: 'Mid-range construction (good-quality finishes, standard fixtures) runs ₹1,800–2,500/sq ft on the built-up area. Premium construction with branded fixtures, imported tiles, and feature ceilings runs ₹2,800–3,800/sq ft. We provide a detailed estimate after a site visit — never a per-sq-ft guess over the phone.' },
      { q: 'How long does it take to build a 2,000 sq ft house?', a: 'A well-managed G+1 residential project (2,000–3,000 sq ft) typically takes 14–18 months from foundation to handover, depending on design complexity and finish specifications.' },
      { q: 'Do you provide structural drawings?', a: 'Yes. Our in-house structural team produces complete RCC drawings — foundation, columns, beams, slabs, and staircases — signed by a licensed structural engineer.' },
      { q: 'Can I make changes during construction?', a: 'Minor changes to layouts and finishes are possible before the relevant stage begins. Major structural changes after casting have cost and time implications, which we discuss transparently before proceeding.' },
    ],
  },
  {
    slug:    'commercial-construction',
    name:    'Commercial Construction',
    icon:    'Building2',
    tagline: 'Built for business, designed for people.',
    seoTitle: 'Commercial Construction in Bengaluru | Suvasthuk Architects',
    seoDesc:  'Commercial construction specialists in Bengaluru. Offices, retail spaces, showrooms & mixed-use buildings built on schedule.',
    intro: `Commercial buildings are investments that must perform on day one. Whether it is a corporate office, a retail showroom, a multi-tenanted commercial complex, or a mixed-use development, Suvasthuk delivers commercial construction with the same discipline and accountability we bring to residential projects — but scaled for the complexity, compliance requirements, and speed that commercial clients demand. We have completed commercial projects across Bengaluru since 1993, from standalone showrooms to 8-storey office buildings.`,
    whatWeDo: [
      { title: 'Office Buildings',        detail: 'Stilt + upper-floor office buildings with open-plan floors, server rooms, and modern MEP infrastructure.' },
      { title: 'Retail & Showrooms',      detail: 'Double-height retail spaces, display-oriented facades, and high-footfall flooring and lighting solutions.' },
      { title: 'Mixed-Use Developments',  detail: 'Ground-floor commercial with residential above — complex MEP separation handled seamlessly.' },
      { title: 'Industrial & Warehouse',  detail: 'Pre-engineered steel structures, loading docks, and industrial-grade flooring and services.' },
    ],
    process: [
      { step: 'Brief & Feasibility',        detail: 'We review your brief, plot, FAR entitlements, and approval requirements before committing to design.' },
      { step: 'Approvals & Sanctions',      detail: 'BBMP plan sanction, fire NOC, BWSSB connection — we manage all commercial approvals.' },
      { step: 'Structural & MEP Design',    detail: 'Complete structural and MEP drawings coordinated before construction begins.' },
      { step: 'Phased Construction',        detail: 'For larger projects, we phase construction so you can occupy lower floors while upper floors are still being built.' },
      { step: 'Fit-Out & Handover',         detail: 'Interior fit-out, facade work, landscaping, and statutory compliance certificates at handover.' },
    ],
    whyUs: [
      'Experienced in commercial BBMP and BDA approvals across all zones.',
      'Phased execution capability — start occupying while construction continues.',
      'Strong vendor relationships for commercial-grade MEP, lifts, and facade systems.',
      'Full compliance documentation at handover — occupancy certificate, fire NOC, lift inspection.',
      '30+ years of commercial projects in Bengaluru with zero litigation record.',
    ],
    faq: [
      { q: 'What approvals are needed for a commercial building in Bengaluru?', a: 'Depending on height and use: BBMP plan sanction, fire NOC, BWSSB connection approval, lift inspection certificate, and occupancy certificate. We manage all of these.' },
      { q: 'What is the construction cost for a commercial building?', a: 'Commercial construction typically runs ₹2,200–3,200/sq ft depending on specifications. High-specification office interiors and facade systems add cost. We provide a detailed estimate after reviewing your brief and approvals.' },
      { q: 'Can you build to a tenant\'s fitout specification?', a: 'Yes. Many of our commercial clients engage us for base building construction and then coordinate with their tenants for fit-out — we handle both.' },
    ],
  },
  {
    slug:    'turnkey-projects',
    name:    'Turnkey Projects',
    icon:    'PackageCheck',
    tagline: 'One contract. Zero coordination stress.',
    seoTitle: 'Turnkey Construction in Bengaluru | Suvasthuk Architects',
    seoDesc:  'Complete turnkey construction in Bengaluru — design, approvals, civil work, MEP, and interiors under one contract.',
    intro: `A turnkey construction contract is the most stress-free way to build. You give us the brief; we deliver the keys to a finished, move-in-ready space. Design, regulatory approvals, civil construction, MEP systems, interior finishes, and landscaping — all managed under a single contract with a single point of accountability. No running between an architect, a contractor, an interior designer, and a plumber. No gap between who designed it and who built it. Just a clear brief, a fixed price, and a handover date.`,
    whatWeDo: [
      { title: 'Design & Approvals',   detail: 'Our architects design the building, obtain BBMP sanction, and produce working drawings — all before a shovel enters the ground.' },
      { title: 'Civil Construction',   detail: 'Foundation, structure, masonry, and roof — executed by our own site teams, not unknown sub-contractors.' },
      { title: 'MEP Systems',          detail: 'Plumbing, electrical, HVAC, and fire suppression designed, supplied, and installed in-house.' },
      { title: 'Interior Finishes',    detail: 'Flooring, carpentry, kitchen and bathroom fittings, lighting, painting — all specified upfront and executed to drawing.' },
      { title: 'Landscaping & Handover', detail: 'Driveway, garden, boundary wall, and external lighting — then a full walkthrough and key handover.' },
    ],
    process: [
      { step: 'Brief Workshop',        detail: 'One or two sessions to capture your requirements, lifestyle, aesthetic preferences, and budget.' },
      { step: 'Design & Pricing',      detail: 'We produce concept designs and a fixed-price contract document simultaneously — no surprises after design approval.' },
      { step: 'Approvals',             detail: 'BBMP plan sanction and other statutory approvals handled by us.' },
      { step: 'Construction',          detail: 'Civil, MEP, and finishes executed sequentially with weekly progress reports.' },
      { step: 'Handover',              detail: 'Snag list cleared, warranties compiled, and keys handed over on the agreed date.' },
    ],
    whyUs: [
      'Single contract — one price, one schedule, one team responsible for everything.',
      'Design and construction by the same firm — zero finger-pointing between designer and builder.',
      'Weekly written progress reports so you know exactly where your project stands.',
      'Fixed price locked at contract signing — not a provisional sum.',
      'In-house expertise across architecture, structure, MEP, and interiors.',
    ],
    faq: [
      { q: 'Is turnkey more expensive than separate contracts?', a: 'A turnkey contract may carry a modest premium (typically 5–8%) over managing separate contracts yourself. But it eliminates hidden costs: coordination fees, delays caused by gaps between contractors, rework, and your own time. Most clients find the total cost comparable or lower.' },
      { q: 'Can I make changes after signing?', a: 'Yes, via a formal change order process. Any change is priced and agreed in writing before execution — no verbal approvals, no hidden additions at the end.' },
      { q: 'Do you do turnkey projects outside Bengaluru?', a: 'We primarily operate in Bengaluru and within 60 km. For projects further afield, contact us and we will assess feasibility.' },
    ],
  },
  {
    slug:    'project-management',
    name:    'Project Management',
    icon:    'ClipboardList',
    tagline: 'Expert supervision at every stage.',
    seoTitle: 'Construction Project Management in Bengaluru | Suvasthuk Architects',
    seoDesc:  'Professional construction project management in Bengaluru. Site supervision, quality control, contractor coordination by Suvasthuk Architects.',
    intro: `You have chosen your own contractor. Now you need someone in your corner — someone who understands construction deeply and will ensure your contractor delivers what they promised. That is what our project management service does. We provide dedicated site supervisors, quality control engineers, and structured reporting to give you real visibility into your project without requiring you to be on-site every day. In 30+ years, we have seen every way a construction project can go wrong. Our project management service exists to make sure yours does not.`,
    whatWeDo: [
      { title: 'Daily Site Supervision',   detail: 'A qualified site engineer visits the site every working day, recording progress and flagging deviations.' },
      { title: 'Quality Control',          detail: 'Concrete cube tests, rebar inspections, waterproofing checks — we verify at every critical stage.' },
      { title: 'Contractor Coordination', detail: 'We manage the interface between civil, MEP, and finishing contractors so you do not have to.' },
      { title: 'Progress Reporting',      detail: 'Weekly written progress reports with photos — so you always know what stage your project is at.' },
      { title: 'Bill Verification',       detail: 'We verify contractor bills against actual work done before you release any payment.' },
    ],
    process: [
      { step: 'Kick-Off & Document Review', detail: 'We review your contract, drawings, BOQ, and schedule before construction begins.' },
      { step: 'Stage Inspection Plan',      detail: 'We identify the 15–20 critical inspection points in your project and schedule them in advance.' },
      { step: 'Daily Supervision',          detail: 'Our engineer is on-site every working day. Any issue is reported to you within 24 hours.' },
      { step: 'Monthly Reviews',            detail: 'Monthly cost-and-progress review with you to confirm the project is on track.' },
      { step: 'Handover Inspection',        detail: 'Comprehensive snag list at completion — we will not sign off until every item is resolved.' },
    ],
    whyUs: [
      'Daily site presence — not a weekly or fortnightly visit.',
      'Independent from your contractor — we work for you, not them.',
      'Bill verification before every payment release — protects your budget.',
      'Structured quality inspections at every critical stage.',
      '30+ years of construction knowledge behind every site call we make.',
    ],
    faq: [
      { q: 'How much does project management cost?', a: 'Our project management fee is typically 3–5% of the project construction value, depending on project scale and duration. It is one of the highest-return investments in any construction project.' },
      { q: 'Can you manage a project you did not design?', a: 'Absolutely. We take on project management for projects designed by other architects and built by independent contractors. We simply need the approved drawings and BOQ to begin.' },
      { q: 'What happens if you find a quality issue?', a: 'We document it in writing, issue a Non-Conformance Report (NCR) to the contractor, and follow up until it is corrected. If the contractor does not respond, we escalate to you immediately.' },
    ],
  },
  {
    slug:    'renovation',
    name:    'Renovation',
    icon:    'Hammer',
    tagline: 'Transform what exists. Build what is missing.',
    seoTitle: 'Renovation Contractors in Bengaluru | Suvasthuk Architects',
    seoDesc:  'Professional renovation services in Bengaluru — apartments, bungalows, offices. Structural upgrades, full remodels, and targeted refits.',
    intro: `The best renovation is one that feels like the space was always meant to be this way. At Suvasthuk, we approach every renovation by first understanding what the space needs to do — then finding the most efficient way to get it there. We have renovated century-old bungalows in Basavanagudi, dated apartments in Koramangala, and tired commercial spaces across Bengaluru. Our team assesses existing structure, services, and finishes carefully before proposing any work — because in renovation, what you do not disturb is as important as what you change.`,
    whatWeDo: [
      { title: 'Apartment Renovation',    detail: 'Kitchen upgrades, bathroom refits, flooring replacement, false ceiling, and full interior renovation for apartments of all sizes.' },
      { title: 'Bungalow & Villa Remodels', detail: 'Layout restructuring, facade upgrades, addition of floors, and full interior renewal for older bungalows and villas.' },
      { title: 'Office Renovation',       detail: 'Open-plan conversions, partition modifications, lighting overhauls, and full office fit-outs while minimising downtime.' },
      { title: 'Structural Upgrades',     detail: 'Column jacketing, slab strengthening, crack repair, and other structural interventions for older buildings.' },
      { title: 'Heritage & Character Properties', detail: 'Sensitive renovation of older Bengaluru homes preserving character while upgrading services and comfort.' },
    ],
    process: [
      { step: 'Condition Assessment',    detail: 'We inspect structure, waterproofing, electrical, and plumbing before any design begins. No surprises mid-project.' },
      { step: 'Scope & Budget Agreement', detail: 'We agree on exact scope and budget before work starts — no verbal approvals.' },
      { step: 'Phased Execution',        detail: 'Work is sequenced room-by-room to minimise disruption, especially in occupied spaces.' },
      { step: 'Quality Inspection',      detail: 'Each completed area is inspected before handover — snag-free completion is non-negotiable.' },
    ],
    whyUs: [
      'Thorough condition assessment before we price anything — no mid-project surprises.',
      'Phased execution for occupied spaces — you can continue living or working during renovation.',
      'Experience with both modern and heritage Bengaluru properties.',
      'Full-service: design, civil, MEP, and finishes under one contract.',
      'Fixed-price contracts — not provisional estimates that balloon later.',
    ],
    faq: [
      { q: 'How long does a 2BHK apartment renovation take?', a: 'A full 2BHK renovation covering flooring, kitchen, bathrooms, false ceiling, and painting typically takes 8–12 weeks depending on the scope and finish specifications.' },
      { q: 'Can you renovate while we are living in the apartment?', a: 'Yes. We plan the work room-by-room so you always have a livable area. Kitchen and bathroom work require temporary arrangements for 2–4 weeks, which we plan in advance with you.' },
      { q: 'What is the cost of a full apartment renovation in Bengaluru?', a: 'A mid-range 2BHK renovation (1,000–1,200 sq ft) typically costs ₹8–14 lakhs. Premium renovation with imported materials, modular kitchen, and branded fittings can go to ₹18–28 lakhs. We provide a detailed estimate after a site visit.' },
    ],
  },
  {
    slug:    'institutional',
    name:    'Institutional Construction',
    icon:    'School',
    tagline: 'Buildings that serve communities for generations.',
    seoTitle: 'Institutional Construction in Bengaluru | Suvasthuk Architects',
    seoDesc:  'Institutional construction specialists in Bengaluru — schools, hospitals, community buildings, places of worship. 30+ years experience.',
    intro: `Institutional buildings carry a weight that residential and commercial projects do not — they serve entire communities, sometimes for generations. A school that was not built right becomes a safety liability. A hospital with poor MEP infrastructure compromises patient care. At Suvasthuk, we have been building institutional structures in Bengaluru since 1993, with a consistent focus on structural integrity, compliance with all applicable standards (IS codes, NBC, fire codes, accessibility requirements), and the operational durability that public buildings demand.`,
    whatWeDo: [
      { title: 'Schools & Educational Institutions', detail: 'Classrooms, labs, libraries, auditoria, and sports facilities — designed for safety, acoustics, and CBSE/ICSE compliance.' },
      { title: 'Hospitals & Healthcare Facilities',  detail: 'OPD blocks, diagnostic centres, and small hospitals with infection-control flooring, medical gas systems, and backup power.' },
      { title: 'Community Halls & Religious Buildings', detail: 'Mandirs, mosques, churches, and community halls — built with care for the cultural significance of the structure.' },
      { title: 'Government & Civic Buildings',      detail: 'Administrative offices, panchayat buildings, and civic infrastructure built to government specification and tender formats.' },
    ],
    process: [
      { step: 'Regulatory Review',       detail: 'We identify all applicable codes, NBC requirements, fire regulations, and accessibility standards before design begins.' },
      { step: 'Structural & MEP Design', detail: 'Institutional structures require more robust structural design — larger spans, higher live loads, and more complex MEP.' },
      { step: 'Statutory Approvals',     detail: 'BBMP sanction, fire NOC, accessibility compliance, and any sector-specific approvals managed by us.' },
      { step: 'Phased Execution',        detail: 'Many institutions operate during construction. We plan phases to minimise disruption to daily operations.' },
      { step: 'Compliance Handover',     detail: 'Full compliance documentation at handover: occupancy certificate, fire NOC, lift certificates, and structural stability certificate.' },
    ],
    whyUs: [
      '30+ years of institutional construction experience in Bengaluru.',
      'Deep understanding of NBC, IS codes, and sector-specific compliance requirements.',
      'Experience working with educational trusts, hospital management committees, and religious institutions.',
      'Phased construction planning for institutions that must remain operational during construction.',
      'Complete compliance documentation at handover — no outstanding NOCs.',
    ],
    faq: [
      { q: 'Do you work with educational trusts and NGOs?', a: 'Yes. We have extensive experience working with educational trusts, religious organisations, and NGOs. We understand the governance requirements and documentation expectations of these clients.' },
      { q: 'What accessibility standards do you follow?', a: 'We follow the National Building Code of India (NBC) accessibility guidelines and, for healthcare facilities, the relevant NABH and MoHFW guidelines.' },
      { q: 'Can you build to a government tender specification?', a: 'Yes. We have experience reading and pricing government tender documents and executing to CPWD and PWD specifications.' },
    ],
  },
]

export async function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = SERVICES.find(x => x.slug === slug)
  if (!s) return {}
  return {
    title: s.seoTitle.replace(/\s*\|\s*Suvasthuk.*$/i, '').trim(),
    description: s.seoDesc,
    alternates: { canonical: `https://suvasthuk.com/construction/services/${slug}` },
    openGraph: {
      url: `https://suvasthuk.com/construction/services/${slug}`,
      title: s.seoTitle,
      description: s.seoDesc,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function ConstructionServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = SERVICES.find(x => x.slug === slug)
  if (!s) notFound()

  return (
    <main id="main-content" className="bg-concrete min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: s.faq.map((f: { q: string; a: string }) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
      {/* Hero */}
      <div className="bg-concrete-deep pt-32 pb-16 px-6 md:px-14 border-b border-[#2a2a2a]">
        <div className="max-w-content mx-auto">
          <Link
            href="/construction"
            className="font-sans text-[9px] tracking-[3px] uppercase text-cement/50 hover:text-cement transition-colors mb-8 inline-block"
          >
            ← Construction
          </Link>
          <div className="flex items-start gap-5 mt-4">
            <div className="w-14 h-14 rounded-lg bg-concrete flex items-center justify-center shrink-0 border border-[#2a2a2a]">
              <ServiceIcon name={s.icon} className="text-cement" />
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-cement mb-3">What We Build</p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#f0ede8] font-normal leading-tight">{s.name}</h1>
              <p className="font-sans text-[14px] text-cement mt-2">{s.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 md:px-14 py-16 space-y-20">

        {/* Intro */}
        <ScrollReveal>
          <p className="font-sans text-[16px] leading-[1.9] text-[#aaa] max-w-3xl">{s.intro}</p>
        </ScrollReveal>

        {/* What we do */}
        <ScrollReveal>
          <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-cement mb-8">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {s.whatWeDo.map((w, i) => (
              <div key={i} className="bg-concrete-deep rounded-lg p-6 border border-[#2a2a2a]">
                <div className="w-1.5 h-1.5 rounded-full bg-cement mb-4" />
                <h3 className="font-serif text-lg text-[#f0ede8] mb-2">{w.title}</h3>
                <p className="font-sans text-[13px] text-[#888] leading-relaxed">{w.detail}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Process */}
        <ScrollReveal>
          <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-cement mb-8">Our Process</h2>
          <div className="space-y-0">
            {s.process.map((step, i) => (
              <div key={i} className="flex gap-6 pb-8 relative">
                {i < s.process.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-px bg-[#2a2a2a]" />
                )}
                <div className="w-10 h-10 rounded-full border border-cement/30 flex items-center justify-center shrink-0 bg-concrete-deep">
                  <span className="font-sans text-[10px] text-cement">{i + 1}</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-serif text-lg text-[#f0ede8] mb-1">{step.step}</h3>
                  <p className="font-sans text-[13px] text-[#888] leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Why Suvasthuk */}
        <ScrollReveal>
          <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-cement mb-8">Why Suvasthuk</h2>
          <ul className="space-y-4">
            {s.whyUs.map((point, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-cement mt-1 shrink-0">→</span>
                <p className="font-sans text-[14px] text-[#aaa] leading-relaxed">{point}</p>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <h2 className="font-sans text-[9px] tracking-[4px] uppercase text-cement mb-8">Frequently Asked</h2>
          <div className="space-y-6">
            {s.faq.map((item, i) => (
              <div key={i} className="border-t border-[#2a2a2a] pt-6">
                <h3 className="font-serif text-lg text-[#f0ede8] mb-3">{item.q}</h3>
                <p className="font-sans text-[13px] text-[#888] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>

      <ConstructionCtaBand />
    </main>
  )
}
