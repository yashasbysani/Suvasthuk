import type { Metadata }  from 'next'
import Link                from 'next/link'
import ConstructionServices from '@/components/construction/ConstructionServices'
import ConstructionCtaBand  from '@/components/construction/ConstructionCtaBand'

// Storefront hub for the Yashas Construction services. Kept in slug order to mirror
// ConstructionServices.tsx and the /construction/services/[slug] detail pages.
// Dual-brand note: site-wide "Yashas Construction" rebranding (SiteModeContext rename,
// two-company toggle) is a separate roadmap task; copy here stays consistent with the
// current construction vertical while this route establishes the valid 200 hub.
const SERVICE_SLUGS = [
  'residential-construction',
  'commercial-construction',
  'turnkey-projects',
  'project-management',
  'renovation',
  'institutional',
] as const

const TITLE = 'Construction Services in Bengaluru'
const DESCRIPTION =
  'Full-service construction in Bengaluru since 1993 — residential, commercial, turnkey, renovation, institutional, and project management, all under one accountable contract.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://suvasthuk.com/construction/services' },
  openGraph: {
    url: 'https://suvasthuk.com/construction/services',
    title: `${TITLE} | Suvasthuk Architects`,
    description: DESCRIPTION,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function ConstructionServicesHubPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Construction Services',
    itemListElement: SERVICE_SLUGS.map((slug, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://suvasthuk.com/construction/services/${slug}`,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Construction', item: 'https://suvasthuk.com/construction' },
      { '@type': 'ListItem', position: 2, name: 'Services',     item: 'https://suvasthuk.com/construction/services' },
    ],
  }

  return (
    <main id="main-content" className="bg-concrete min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
          <h1 className="font-serif text-4xl md:text-5xl text-[#f0ede8] font-normal leading-tight max-w-3xl mt-4">
            {TITLE}
          </h1>
          <p className="font-sans text-[15px] text-[#aaa] leading-relaxed mt-5 max-w-2xl">
            {DESCRIPTION}
          </p>
        </div>
      </div>

      {/* Services grid — shared with the construction homepage */}
      <ConstructionServices />

      <ConstructionCtaBand />
    </main>
  )
}
