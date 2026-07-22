'use client'

import { usePathname } from 'next/navigation'
import Navbar         from './Navbar'
import Footer         from './Footer'
import WhatsAppButton from './WhatsAppButton'
import BackButton     from './BackButton'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname.startsWith('/studio')

  if (isStudio) return <>{children}</>

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:text-brown-deep"
      >
        Skip to content
      </a>
      <header>
        <Navbar />
      </header>
      <BackButton />
      <div className="page-fade">{children}</div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
