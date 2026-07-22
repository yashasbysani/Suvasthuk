import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Suvasthuk Architects',
    short_name: 'Suvasthuk',
    description:
      'Trusted architecture firm in Bengaluru since 1993. Residential, commercial & interior design.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f2ede7',
    theme_color: '#2c2420',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
