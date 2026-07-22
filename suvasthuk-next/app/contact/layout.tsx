import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us in Bengaluru',
  description: 'Get in touch with Suvasthuk Architects in Sahakar Nagar, Bengaluru. Call +91 9480444666 or email suvasthuk@gmail.com for a free consultation.',
  alternates: { canonical: 'https://suvasthuk.com/contact' },
  openGraph: {
    url: 'https://suvasthuk.com/contact',
    title: 'Contact Us in Bengaluru',
    description: 'Get in touch with Suvasthuk Architects in Sahakar Nagar, Bengaluru. Call +91 9480444666 or email suvasthuk@gmail.com for a free consultation.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
