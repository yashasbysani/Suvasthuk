export default function LocalBusinessSchema() {
  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://suvasthuk.com/#business',
    name: 'Suvasthuk Architects',
    image: 'https://suvasthuk.com/images/Logo/logo.jpg',
    url: 'https://suvasthuk.com',
    telephone: '+91-9480444666',
    email: 'suvasthuk@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'F6 17/2, 1st Floor, Kodigehalli Main Rd, Sahakar Nagar',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560092',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.0591,
      longitude: 77.5803,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    foundingDate: '1993',
    priceRange: '₹₹₹',
    areaServed: [
      { '@type': 'City',  name: 'Bengaluru' },
      { '@type': 'State', name: 'Karnataka' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Architecture & Design Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Architectural Design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interior Design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Construction' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Structural Design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vastu Consultation' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Renovation' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Landscaping' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Layout Planning' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sanction Plans & TDR' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Elevation Designs' } },
      ],
    },
    sameAs: [
      'https://www.instagram.com/suvasthuk_architects',
      'https://share.google/1nAqzRFFug4fM29Ax',
    ],
  }

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://suvasthuk.com/#website',
    name: 'Suvasthuk Architects',
    url: 'https://suvasthuk.com',
    publisher: { '@id': 'https://suvasthuk.com/#business' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://suvasthuk.com/projects?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  )
}
