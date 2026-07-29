// Bengaluru service-area taxonomy, ordered by proximity to the primary hub (Sahakar Nagar,
// North Bangalore) and expanding outward. Shared by LocalBusinessSchema (areaServed JSON-LD)
// and the footer's Service Areas section.

export const SERVICE_AREA_ZONES = [
  {
    zone: 'North Bangalore',
    neighborhoods: [
      'Sahakar Nagar', 'Kodigehalli', 'Hebbal', 'Yelahanka', 'Jakkur', 'Thanisandra',
      'Hennur', 'Nagavara', 'RT Nagar', 'Dollars Colony', 'Sanjay Nagar', 'Mathikere',
      'Vidyaranyapura', 'Devanahalli', 'Doddaballapur Road', 'Bagalur',
    ],
  },
  {
    zone: 'Central & Northwest Bangalore',
    neighborhoods: [
      'Malleswaram', 'Sadashivnagar', 'Vasanth Nagar', 'Rajajinagar', 'Yeshwanthpur',
      'Shivajinagar', 'Frazer Town', 'Cunningham Road',
    ],
  },
  {
    zone: 'East Bangalore',
    neighborhoods: [
      'Indiranagar', 'Whitefield', 'Marathahalli', 'Domlur', 'CV Raman Nagar', 'Hoodi',
      'KR Puram', 'Mahadevapura', 'Varthur',
    ],
  },
  {
    zone: 'South & Southeast Bangalore',
    neighborhoods: [
      'Jayanagar', 'Basavanagudi', 'JP Nagar', 'Koramangala', 'HSR Layout', 'BTM Layout',
      'Banashankari', 'Electronic City', 'Sarjapur Road', 'Bellandur', 'Bannerghatta Road',
      'Kanakapura Road', 'Uttarahalli',
    ],
  },
  {
    zone: 'West Bangalore',
    neighborhoods: [
      'Vijayanagar', 'Basaveshwaranagar', 'Nagarbhavi', 'Kengeri', 'RR Nagar (Rajarajeswari Nagar)',
    ],
  },
] as const

// Places worth their own schema.org node (primary hub + a curated subset of higher-intent
// neighborhoods) — kept shorter than the full 49-neighborhood list to avoid an oversized/
// spammy-looking areaServed block.
export const SCHEMA_AREA_SERVED = [
  { '@type': 'AdministrativeArea', name: 'North Bangalore' },
  { '@type': 'City', name: 'Bengaluru' },
  { '@type': 'State', name: 'Karnataka' },
  { '@type': 'Place', name: 'Sahakar Nagar, Bengaluru' },
  { '@type': 'Place', name: 'Kodigehalli, Bengaluru' },
  { '@type': 'Place', name: 'Hebbal, Bengaluru' },
  { '@type': 'Place', name: 'Yelahanka, Bengaluru' },
  { '@type': 'Place', name: 'Jakkur, Bengaluru' },
  { '@type': 'Place', name: 'Thanisandra, Bengaluru' },
  { '@type': 'Place', name: 'Hennur, Bengaluru' },
  { '@type': 'Place', name: 'RT Nagar, Bengaluru' },
  { '@type': 'Place', name: 'Dollars Colony, Bengaluru' },
  { '@type': 'Place', name: 'Devanahalli, Bengaluru' },
  { '@type': 'Place', name: 'Malleswaram, Bengaluru' },
  { '@type': 'Place', name: 'Sadashivnagar, Bengaluru' },
  { '@type': 'Place', name: 'Indiranagar, Bengaluru' },
  { '@type': 'Place', name: 'Whitefield, Bengaluru' },
  { '@type': 'Place', name: 'Jayanagar, Bengaluru' },
  { '@type': 'Place', name: 'JP Nagar, Bengaluru' },
  { '@type': 'Place', name: 'Koramangala, Bengaluru' },
  { '@type': 'Place', name: 'HSR Layout, Bengaluru' },
] as const
