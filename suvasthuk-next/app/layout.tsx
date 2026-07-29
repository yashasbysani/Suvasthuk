import type { Metadata } from 'next'
import { Libre_Baskerville, DM_Sans } from 'next/font/google'
import './globals.css'
import LenisProvider  from '@/components/animations/LenisProvider'
import SiteShell      from '@/components/layout/SiteShell'
import LocalBusinessSchema  from '@/components/seo/LocalBusinessSchema'
import { SiteModeProvider } from '@/context/SiteModeContext'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Architects in Bengaluru | Suvasthuk Architects — Est. 1993',
    template: '%s — Suvasthuk Architects',
  },
  description:
    'Suvasthuk Architects — an established architecture firm in Bengaluru since 1993. Residential, commercial & interior design, 30+ years of experience.',
  metadataBase: new URL('https://suvasthuk.com'),
  alternates: { canonical: 'https://suvasthuk.com' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://suvasthuk.com',
    siteName: 'Suvasthuk Architects',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'theme-color': '#2C1810',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${dmSans.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        <LocalBusinessSchema />
        <LenisProvider>
          <SiteModeProvider>
            <SiteShell>{children}</SiteShell>
          </SiteModeProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
