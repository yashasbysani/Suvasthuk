// suvasthuk-next/components/layout/Navbar.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link        from 'next/link'
import Image       from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useSiteMode } from '@/context/SiteModeContext'

const ARCH_LINKS  = [
  { href: '/projects',  label: 'Work'     },
  { href: '/services',  label: 'Services' },
  { href: '/about',     label: 'About'    },
  { href: '/blog',      label: 'Blog'     },
]
const CONST_LINKS = [
  { href: '/construction/projects',  label: 'Projects' },
  { href: '/construction/services',  label: 'Services' },
  { href: '/construction/about',     label: 'About'    },
  { href: '/contact',                label: 'Contact'  },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const router   = useRouter()
  const pathname = usePathname()
  const mode     = useSiteMode()
  const isConst  = mode === 'construction'
  const links    = isConst ? CONST_LINKS : ARCH_LINKS

  // The transparent navbar with light text is only legible over a dark, full-bleed hero,
  // which exists on the two home routes (and the dark construction pages). Every other
  // route has a light/offset top, so the navbar must render in its solid (opaque +
  // dark-text) state from scroll position 0 — otherwise the light text disappears into
  // the light page background.
  const darkTop = pathname === '/' || pathname.startsWith('/construction')
  const solid   = scrolled || !darkTop

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    if (mobileOpen) closeButtonRef.current?.focus()
  }, [mobileOpen])

  const scrolledBg = isConst
    ? 'bg-concrete/95 backdrop-blur-sm border-b border-concrete-deep'
    : 'bg-sand/95 backdrop-blur-sm border-b border-sand-dark'

  return (
    <>
      <nav aria-label="Main navigation" className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid ? scrolledBg : 'bg-transparent'
      }`}>
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href={isConst ? '/construction' : '/'} className="flex items-center gap-3 shrink-0">
            {isConst ? (
              // Full wordmark (uncropped), sized down to sit at the same visual weight
              // as the Suvasthuk icon+text lockup rather than dominating the nav bar.
              <Image
                src="/images/Logo/yashas-logo.png"
                alt="Yashas Construction logo"
                width={180}
                height={61}
                priority
                className="h-9 w-auto"
              />
            ) : (
              <>
                <Image src="/images/Logo/logo.jpg" alt="Suvasthuk Architects logo" width={32} height={32} priority className="rounded-sm object-cover" />
                <span className={`font-sans font-semibold text-[11px] tracking-[3px] uppercase transition-colors duration-500 ${
                  solid ? 'text-brown-deep' : 'text-sand'
                }`}>
                  Suvasthuk Architects
                </span>
              </>
            )}
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={`font-sans text-[10px] tracking-[2px] uppercase transition-colors duration-200 ${
                    solid
                      ? (isConst ? 'text-[#888] hover:text-[#f0ede8]' : 'text-brown-mid hover:text-brown-deep')
                      : 'text-sand/80 hover:text-sand'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Toggle pill — desktop only; mobile has its own toggle inside the hamburger menu */}
          <div className={`hidden md:flex rounded-full p-[3px] gap-[2px] transition-colors duration-500 ${
            isConst ? 'bg-concrete-deep' : 'bg-sand-dark'
          }`}>
            <button
              onClick={() => router.push('/')}
              aria-pressed={!isConst}
              aria-label="Switch to Architecture mode"
              className={`font-sans text-[8px] tracking-[2px] uppercase px-3 py-[5px] rounded-full transition-all duration-300 ${
                !isConst
                  ? 'bg-white text-brown-deep shadow-sm font-semibold'
                  : 'text-brown-light hover:text-brown-mid bg-transparent'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => router.push('/construction')}
              aria-pressed={isConst}
              aria-label="Switch to Construction mode"
              className={`font-sans text-[8px] tracking-[2px] uppercase px-3 py-[5px] rounded-full transition-all duration-300 ${
                isConst
                  ? 'bg-cement text-concrete shadow-sm font-bold'
                  : 'text-brown-light hover:text-brown-mid bg-transparent'
              }`}
            >
              Construction
            </button>
          </div>

          {/* CTA */}
          <Link
            href={isConst ? '/contact?mode=construction' : '/contact'}
            className={`hidden md:inline-flex font-sans text-[10px] tracking-[2px] uppercase px-5 py-2.5 rounded transition-colors duration-300 shrink-0 ${
              isConst
                ? 'bg-cement text-concrete font-bold hover:bg-cement-dark'
                : 'bg-brown-deep text-sand hover:bg-brown-mid'
            }`}
          >
            {isConst ? 'Get a Quote' : 'Get in Touch'}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="md:hidden flex flex-col justify-center gap-1.5 p-2 shrink-0"
          >
            <span className={`w-6 h-px block ${(solid && !isConst) ? 'bg-brown-deep' : 'bg-sand'}`} />
            <span className={`w-4 h-px block ${(solid && !isConst) ? 'bg-brown-deep' : 'bg-sand'}`} />
            <span className={`w-6 h-px block ${(solid && !isConst) ? 'bg-brown-deep' : 'bg-sand'}`} />
          </button>
        </div>

        {/* Mobile toggle row — kept visible on the main screen (not tucked inside the
            hamburger menu) so every visitor immediately sees both companies. */}
        <div className="md:hidden flex justify-center pb-3">
          <div className={`flex rounded-full p-[3px] gap-[2px] transition-colors duration-500 ${
            isConst ? 'bg-concrete-deep' : 'bg-sand-dark'
          }`}>
            <button
              onClick={() => router.push('/')}
              aria-pressed={!isConst}
              aria-label="Switch to Architecture mode"
              className={`font-sans text-[9px] tracking-[2px] uppercase px-4 py-[6px] rounded-full transition-all duration-300 ${
                !isConst
                  ? 'bg-white text-brown-deep shadow-sm font-semibold'
                  : 'text-brown-light hover:text-brown-mid bg-transparent'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => router.push('/construction')}
              aria-pressed={isConst}
              aria-label="Switch to Construction mode"
              className={`font-sans text-[9px] tracking-[2px] uppercase px-4 py-[6px] rounded-full transition-all duration-300 ${
                isConst
                  ? 'bg-cement text-concrete shadow-sm font-bold'
                  : 'text-brown-light hover:text-brown-mid bg-transparent'
              }`}
            >
              Construction
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-charcoal flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <button
            ref={closeButtonRef}
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-6 right-6 font-sans text-[10px] tracking-[3px] uppercase text-sand/50 hover:text-sand transition-colors"
          >
            Close
          </button>

          <ul className="flex flex-col items-center gap-8 mt-10">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-4xl font-normal text-sand hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={isConst ? '/contact?mode=construction' : '/contact'}
                onClick={() => setMobileOpen(false)}
                className="mt-2 font-sans text-[10px] tracking-[3px] uppercase text-gold border-b border-gold pb-1"
              >
                {isConst ? 'Get a Quote →' : 'Get in Touch →'}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
