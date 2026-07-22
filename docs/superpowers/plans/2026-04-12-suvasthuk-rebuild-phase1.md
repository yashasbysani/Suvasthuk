# Suvasthuk Architects Website Rebuild — Phase 1: Foundation & Homepage

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a production-ready Next.js 14 project with the full design system, animation infrastructure, layout shell, and complete homepage.

**Architecture:** New Next.js App Router project at `suvasthuk-next/` inside the existing repo. Tailwind CSS carries all design tokens. Three-layer animation system: GSAP for hero entry, Framer Motion for scroll reveals, Lenis for smooth scroll.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, GSAP, Framer Motion, Lenis, next/font (Libre Baskerville + DM Sans)

---

### Task 1: Scaffold project and install dependencies

**Files:**
- Create: `suvasthuk-next/` (full Next.js project)

- [ ] **Step 1: Scaffold**

```bash
cd /Users/shrishaa/Developer/Suvasthuk/Suvasthuk_Architects
npx create-next-app@14 suvasthuk-next \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --no-git \
  --import-alias "@/*"
cd suvasthuk-next
```

Expected: directory created with `package.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 2: Install animation + utility packages**

```bash
npm install gsap framer-motion lenis resend react-hook-form next-sitemap
npm install --save-dev @types/gsap
```

Expected: `node_modules/gsap`, `node_modules/framer-motion`, `node_modules/lenis` all present

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected output contains: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```bash
cd /Users/shrishaa/Developer/Suvasthuk/Suvasthuk_Architects
git add suvasthuk-next
git commit -m "feat: scaffold Next.js 14 project with Tailwind and animation deps"
```

---

### Task 2: Tailwind design tokens + globals

**Files:**
- Modify: `suvasthuk-next/tailwind.config.ts`
- Modify: `suvasthuk-next/app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts entirely**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sand:        '#f2ede7',
        'sand-dark': '#e8ddd2',
        cream:       '#ffffff',
        'brown-deep': '#2c2420',
        'brown-mid':  '#7a6a5a',
        'brown-light':'#9a8a7a',
        gold:        '#c4a882',
        'gold-dark': '#9a7a5a',
        charcoal:    '#1a1210',
      },
      fontFamily: {
        serif: ['var(--font-libre-baskerville)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-sand text-brown-deep font-sans antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-serif;
  }
  * {
    @apply box-border;
  }
}
```

- [ ] **Step 3: Verify build**

```bash
cd suvasthuk-next && npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```bash
cd .. && git add suvasthuk-next/tailwind.config.ts suvasthuk-next/app/globals.css
git commit -m "feat: add Earthy Modern design tokens to Tailwind"
```

---

### Task 3: Root layout with fonts and metadata

**Files:**
- Modify: `suvasthuk-next/app/layout.tsx`
- Create: `suvasthuk-next/public/logo.svg`

- [ ] **Step 1: Create placeholder logo SVG**

File: `suvasthuk-next/public/logo.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#c4a882"/>
  <text x="16" y="22" text-anchor="middle" font-size="16" font-family="serif" fill="#2c2420" font-weight="bold">S</text>
</svg>
```

Note: Replace with the actual client logo SVG (the geometric red/gold diamond mark) before launch.

- [ ] **Step 2: Replace app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import { Libre_Baskerville, DM_Sans } from 'next/font/google'
import './globals.css'

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
    default: 'Suvasthuk Architects — Architects in Bangalore Since 1993',
    template: '%s — Suvasthuk Architects',
  },
  description:
    'Trusted architecture firm in Bangalore since 1993. Residential, commercial & interior design. 30+ years, 1000+ projects. Get a free consultation.',
  metadataBase: new URL('https://suvasthuk.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://suvasthuk.com',
    siteName: 'Suvasthuk Architects',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
cd suvasthuk-next && npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```bash
cd .. && git add suvasthuk-next/app/layout.tsx suvasthuk-next/public/logo.svg
git commit -m "feat: root layout with Libre Baskerville + DM Sans fonts and base SEO metadata"
```

---

### Task 4: Lenis smooth scroll + custom cursor

**Files:**
- Create: `suvasthuk-next/components/animations/LenisProvider.tsx`
- Create: `suvasthuk-next/components/animations/CustomCursor.tsx`
- Modify: `suvasthuk-next/app/layout.tsx`

- [ ] **Step 1: Create LenisProvider.tsx**

```typescript
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

- [ ] **Step 2: Create CustomCursor.tsx**

```typescript
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef  = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Hide default cursor site-wide
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' })
    }

    const onEnter = () => {
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: 'power2.out' })
      if (labelRef.current) gsap.to(labelRef.current, { opacity: 1, duration: 0.2 })
    }

    const onLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' })
      if (labelRef.current) gsap.to(labelRef.current, { opacity: 0, duration: 0.2 })
    }

    const attach = () => {
      document.querySelectorAll<HTMLElement>('[data-cursor="view"]').forEach((el) => {
        el.style.cursor = 'none'
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    document.addEventListener('mousemove', onMove)
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })
    attach()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.documentElement.style.cursor = ''
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{ willChange: 'transform' }}
    >
      <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center mix-blend-difference">
        <span
          ref={labelRef}
          className="font-sans text-[7px] tracking-[3px] uppercase text-gold opacity-0"
        >
          View
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Add providers to layout.tsx body**

Replace the `<body>{children}</body>` in `app/layout.tsx` with:

```typescript
// Add at top of file (after existing imports):
import LenisProvider from '@/components/animations/LenisProvider'
import CustomCursor  from '@/components/animations/CustomCursor'

// Replace body:
<body>
  <LenisProvider>
    <CustomCursor />
    {children}
  </LenisProvider>
</body>
```

- [ ] **Step 4: Verify**

```bash
cd suvasthuk-next && npm run dev
```

Open http://localhost:3000 — scroll should feel smooth (no abrupt jumps), custom gold circle cursor should follow mouse.

- [ ] **Step 5: Commit**

```bash
cd .. && git add suvasthuk-next/components suvasthuk-next/app/layout.tsx
git commit -m "feat: Lenis smooth scroll and custom gold cursor"
```

---

### Task 5: Navbar

**Files:**
- Create: `suvasthuk-next/components/layout/Navbar.tsx`
- Modify: `suvasthuk-next/app/layout.tsx`

- [ ] **Step 1: Create Navbar.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/projects',  label: 'Work'     },
  { href: '/services',  label: 'Services' },
  { href: '/about',     label: 'About'    },
  { href: '/blog',      label: 'Blog'     },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-sand/95 backdrop-blur-sm border-b border-sand-dark'
          : 'bg-transparent'
      }`}>
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo + wordmark */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Suvasthuk Architects logo" width={32} height={32} priority />
            <span className="font-sans font-semibold text-[11px] tracking-[3px] uppercase text-brown-deep">
              Suvasthuk
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid hover:text-brown-deep transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex bg-brown-deep text-sand font-sans text-[10px] tracking-[2px] uppercase px-5 py-2.5 rounded hover:bg-brown-mid transition-colors duration-200"
          >
            Get in Touch
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          >
            <span className="w-6 h-px bg-brown-deep block" />
            <span className="w-4 h-px bg-brown-deep block" />
            <span className="w-6 h-px bg-brown-deep block" />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-charcoal flex flex-col items-center justify-center">
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-6 right-6 font-sans text-[10px] tracking-[3px] uppercase text-sand/50 hover:text-sand transition-colors"
          >
            Close
          </button>
          <ul className="flex flex-col items-center gap-8">
            {NAV_LINKS.map(({ href, label }, i) => (
              <li
                key={href}
                className="opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-forwards"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-4xl font-normal text-sand hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 font-sans text-[10px] tracking-[3px] uppercase text-gold border-b border-gold pb-1"
              >
                Get in Touch →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Add Navbar to layout.tsx**

Inside the `<LenisProvider>` block, add `<Navbar />` before `{children}`:

```typescript
import Navbar from '@/components/layout/Navbar'
// ...
<body>
  <LenisProvider>
    <CustomCursor />
    <Navbar />
    {children}
  </LenisProvider>
</body>
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Open http://localhost:3000 — nav is transparent, becomes frosted after scrolling 80px, mobile hamburger opens full-screen overlay.

- [ ] **Step 4: Commit**

```bash
cd .. && git add suvasthuk-next/components/layout/Navbar.tsx suvasthuk-next/app/layout.tsx
git commit -m "feat: sticky frosted Navbar with mobile overlay"
```

---

### Task 6: Footer + WhatsApp float button

**Files:**
- Create: `suvasthuk-next/components/layout/Footer.tsx`
- Create: `suvasthuk-next/components/layout/WhatsAppButton.tsx`
- Modify: `suvasthuk-next/app/layout.tsx`

- [ ] **Step 1: Create Footer.tsx**

```typescript
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-charcoal pt-16 pb-8">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand — spans 2 cols on md */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.svg" alt="Suvasthuk Architects" width={28} height={28} />
              <span className="font-sans font-semibold text-[11px] tracking-[3px] uppercase text-sand">
                Suvasthuk Architects
              </span>
            </div>
            <p className="font-sans text-[13px] leading-relaxed text-sand/30 max-w-xs">
              A collaborative design practice shaping the built landscape of Bangalore since 1993.
            </p>
            <div className="flex gap-5 mt-5">
              <a
                href="https://www.instagram.com/suvasthuk_architects/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[9px] tracking-[2px] uppercase text-sand/30 hover:text-gold transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Work links */}
          <div>
            <p className="font-sans text-[9px] tracking-[3px] uppercase text-sand/30 mb-5">Work</p>
            <ul className="space-y-3">
              {[
                { href: '/projects',          label: 'Projects'     },
                { href: '/services',          label: 'Services'     },
                { href: '/projects',          label: 'Case Studies' },
                { href: '/about',             label: 'About'        },
                { href: '/blog',              label: 'Blog'         },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="font-sans text-[13px] text-sand/50 hover:text-sand transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-[9px] tracking-[3px] uppercase text-sand/30 mb-5">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href="mailto:suvasthuk@gmail.com" className="font-sans text-[13px] text-sand/50 hover:text-sand transition-colors">
                  suvasthuk@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919480444666" className="font-sans text-[13px] text-sand/50 hover:text-sand transition-colors">
                  +91 9480444666
                </a>
              </li>
              <li>
                <a
                  href="https://g.page/suvasthuk?share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[13px] text-sand/50 hover:text-sand transition-colors leading-relaxed block"
                >
                  Sahakar Nagar,<br />Bengaluru 560092
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sand/5 pt-6 flex flex-col md:flex-row justify-between gap-2">
          <p className="font-sans text-[10px] text-sand/20">
            © {new Date().getFullYear()} Suvasthuk Architects. All rights reserved.
          </p>
          <p className="font-sans text-[10px] text-sand/20">Bengaluru, Karnataka, India</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Create WhatsAppButton.tsx**

```typescript
export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919480444666"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  )
}
```

- [ ] **Step 3: Add to layout.tsx**

```typescript
import Footer         from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
// ...
<body>
  <LenisProvider>
    <CustomCursor />
    <Navbar />
    {children}
    <Footer />
    <WhatsAppButton />
  </LenisProvider>
</body>
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Open http://localhost:3000 — scroll to bottom: dark footer with 4 columns. Green WhatsApp button fixed bottom-right.

- [ ] **Step 5: Commit**

```bash
cd .. && git add suvasthuk-next/components/layout suvasthuk-next/app/layout.tsx
git commit -m "feat: dark 4-column footer and WhatsApp float button"
```

---

### Task 7: ScrollReveal wrapper + Hero section

**Files:**
- Create: `suvasthuk-next/components/animations/ScrollReveal.tsx`
- Create: `suvasthuk-next/components/home/Hero.tsx`
- Modify: `suvasthuk-next/app/page.tsx`

- [ ] **Step 1: Create ScrollReveal.tsx**

```typescript
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'none'
}

export default function ScrollReveal({ children, className, delay = 0, direction = 'up' }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: direction === 'up'   ? 40 : 0,
        x: direction === 'left' ? 40 : 0,
        clipPath: direction === 'up' ? 'inset(100% 0 0 0)' : 'inset(0%)',
      }}
      animate={inView ? {
        opacity: 1,
        y: 0,
        x: 0,
        clipPath: 'inset(0%)',
        transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
      } : {}}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Create Hero.tsx**

```typescript
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

export default function Hero() {
  const topBarRef    = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const imgRef       = useRef<HTMLDivElement>(null)
  const tagRef       = useRef<HTMLParagraphElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.set([topBarRef.current, bottomBarRef.current], { scaleY: 1 })
    gsap.set(imgRef.current, { scale: 1.1 })
    gsap.set([tagRef.current, titleRef.current, ctaRef.current], { opacity: 0, y: 30 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
    tl
      .to(topBarRef.current,    { scaleY: 0, duration: 1.4, transformOrigin: 'top center' }, 0.3)
      .to(bottomBarRef.current, { scaleY: 0, duration: 1.4, transformOrigin: 'bottom center' }, 0.3)
      .to(imgRef.current,       { scale: 1, duration: 2.0, ease: 'power2.out' }, 0.3)
      .to(tagRef.current,       { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.3)
      .to(titleRef.current,     { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 1.5)
      .to(ctaRef.current,       { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.8)
  }, [])

  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden bg-charcoal">
      {/* Background — replace inner div with next/image when real hero photo is ready */}
      <div ref={imgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d2d] to-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
      </div>

      {/* Letterbox bars */}
      <div ref={topBarRef}    className="absolute inset-x-0 top-0    h-2/5 bg-charcoal z-10 origin-top" />
      <div ref={bottomBarRef} className="absolute inset-x-0 bottom-0 h-2/5 bg-charcoal z-10 origin-bottom" />

      {/* Ghost year counter */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right pointer-events-none z-20 select-none">
        <span className="font-serif text-[80px] md:text-[120px] font-normal leading-none text-sand/[0.04]">30</span>
        <p className="font-sans text-[8px] tracking-[4px] uppercase text-sand/20 mt-1">Years of craft</p>
      </div>

      {/* Bengaluru pill badge */}
      <div className="absolute top-24 right-6 z-20 border border-gold/30 rounded-full px-4 py-1.5 bg-gold/10 backdrop-blur-sm">
        <span className="font-sans text-[9px] tracking-[3px] uppercase text-gold">Bengaluru · Est. 1993</span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end pb-20 px-6 md:px-12">
        <div>
          <p ref={tagRef} className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">
            Architecture &amp; Design · Bangalore
          </p>
          <h1 ref={titleRef} className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal text-sand leading-tight max-w-2xl">
            We shape spaces<br />
            <em>that define lives</em>
          </h1>
          <div ref={ctaRef} className="flex items-center gap-8 mt-8">
            <Link
              href="/projects"
              className="font-sans text-[10px] tracking-[3px] uppercase text-sand border-b border-gold pb-1 hover:text-gold transition-colors"
            >
              Explore our work
            </Link>
            <span className="font-sans text-[9px] tracking-[3px] uppercase text-sand/30 hidden md:block">↓ Scroll</span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update app/page.tsx**

```typescript
import Hero from '@/components/home/Hero'

export default function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Open http://localhost:3000 — letterbox bars should part on load, hero image zooms gently, headline + CTA fade in after. Scroll animations fire on `ScrollReveal` wrapped elements (none yet, but component is ready).

- [ ] **Step 5: Commit**

```bash
cd .. && git add suvasthuk-next/components/animations/ScrollReveal.tsx suvasthuk-next/components/home/Hero.tsx suvasthuk-next/app/page.tsx
git commit -m "feat: GSAP cinematic hero entry and ScrollReveal wrapper"
```

---

### Task 8: Marquee + StatsBar + SectionHeading

**Files:**
- Create: `suvasthuk-next/components/ui/SectionHeading.tsx`
- Create: `suvasthuk-next/components/home/Marquee.tsx`
- Create: `suvasthuk-next/components/home/StatsBar.tsx`
- Modify: `suvasthuk-next/app/page.tsx`

- [ ] **Step 1: Create SectionHeading.tsx**

```typescript
interface Props {
  tag: string
  title: string       // may contain <br /> and <strong> — rendered via dangerouslySetInnerHTML
  className?: string
}

export default function SectionHeading({ tag, title, className = '' }: Props) {
  return (
    <div className={className}>
      <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">{tag}</p>
      <h2
        className="font-serif text-3xl md:text-4xl font-normal text-brown-deep leading-tight"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create Marquee.tsx**

```typescript
const SERVICES = [
  'Residential', 'Commercial', 'Interior Design', 'Construction',
  'Vastu Consultation', 'Renovation', 'Landscaping', 'Structural Design',
  'Sanction Plans', 'Elevation Designs', 'Layout Planning', 'TDR Procurement',
]

export default function Marquee() {
  // Duplicate array so the CSS animation loops seamlessly
  const items = [...SERVICES, ...SERVICES]

  return (
    <div className="bg-charcoal py-4 overflow-hidden">
      <div className="flex gap-10 animate-marquee whitespace-nowrap w-max">
        {items.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span className="font-sans text-[9px] tracking-[3px] uppercase text-sand/30">{s}</span>
            <span className="text-gold" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create StatsBar.tsx**

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import gsap from 'gsap'

const STATS = [
  { value: 30,   suffix: '+', label: 'Years Experience' },
  { value: 826,  suffix: '+', label: 'Happy Clients'    },
  { value: 1024, suffix: '+', label: 'Projects Built'   },
  { value: 12,   suffix: '+', label: 'Service Areas'    },
]

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null)
  const wrapRef = useRef(null)
  const inView = useInView(wrapRef, { once: true })

  useEffect(() => {
    if (!inView || !numRef.current) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = Math.round(obj.val).toString()
      },
    })
  }, [inView, value])

  return (
    <div ref={wrapRef} className="bg-sand py-10 px-6 text-center">
      <p className="font-serif text-4xl md:text-5xl font-normal text-brown-deep leading-none">
        <span ref={numRef}>0</span>
        <span className="text-gold">{suffix}</span>
      </p>
      <p className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light mt-3">{label}</p>
    </div>
  )
}

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-sand-dark">
      {STATS.map((s) => <StatItem key={s.label} {...s} />)}
    </div>
  )
}
```

- [ ] **Step 4: Update app/page.tsx**

```typescript
import Hero         from '@/components/home/Hero'
import Marquee      from '@/components/home/Marquee'
import StatsBar     from '@/components/home/StatsBar'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee />
      <StatsBar />
    </main>
  )
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```

- Marquee text scrolls continuously below the hero
- Stats show "0" then animate to 30, 826, 1024, 12 as section scrolls into view

- [ ] **Step 6: Commit**

```bash
cd .. && git add suvasthuk-next/components/ui/SectionHeading.tsx suvasthuk-next/components/home/Marquee.tsx suvasthuk-next/components/home/StatsBar.tsx suvasthuk-next/app/page.tsx
git commit -m "feat: Marquee and animated StatsBar sections"
```

---

### Task 9: AboutStrip + ServicesGrid + ProjectsMosaic (static) + Testimonial + CtaBand

**Files:**
- Create: `suvasthuk-next/components/home/AboutStrip.tsx`
- Create: `suvasthuk-next/components/home/ServicesGrid.tsx`
- Create: `suvasthuk-next/components/home/ProjectsMosaic.tsx`
- Create: `suvasthuk-next/components/home/Testimonial.tsx`
- Create: `suvasthuk-next/components/home/BlogPreview.tsx`
- Create: `suvasthuk-next/components/home/CtaBand.tsx`
- Modify: `suvasthuk-next/app/page.tsx`

- [ ] **Step 1: Create AboutStrip.tsx**

```typescript
import Link from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'

export default function AboutStrip() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
        <ScrollReveal>
          <SectionHeading
            tag="Our Story"
            title="A practice built on<br /><strong>30 years of craft</strong>"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="space-y-4 font-sans text-[15px] leading-relaxed text-brown-mid">
            <p>
              Founded in 1993 by architect B K Muralidhar, Suvasthuk began with one belief —
              that buildings are bridges between people, nature, and culture.
            </p>
            <p>
              Over three decades we have grown from residences to schools, commercial spaces,
              and beyond. Every project, regardless of scale, receives the same "macro to micro"
              attention — from the governing idea down to the last detail.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-block mt-6 font-sans text-[10px] tracking-[3px] uppercase text-brown-deep border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            Our full story →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create ServicesGrid.tsx**

```typescript
import Link from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'

const SERVICES = [
  { name: 'Architectural Design', desc: 'From concept to permit-ready drawings',     slug: 'architectural-design' },
  { name: 'Interior Design',      desc: 'Spaces that feel as good as they look',     slug: 'interior-design'      },
  { name: 'Construction',         desc: 'Full-contract build with labour & materials', slug: 'construction'        },
  { name: 'Structural Design',    desc: 'Engineering drawings for every stage',      slug: 'structural-design'    },
  { name: 'Vastu Consultation',   desc: 'Aligned spaces, harmonious living',         slug: 'vastu-consultation'   },
  { name: 'Renovation',           desc: 'Refresh and transform existing spaces',     slug: 'renovation'           },
]

export default function ServicesGrid() {
  return (
    <section className="py-20 md:py-28 bg-sand-dark">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <ScrollReveal>
            <SectionHeading tag="What We Do" title="End-to-end design<br /><strong>&amp; build services</strong>" />
          </ScrollReveal>
          <Link
            href="/services"
            className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors hidden md:block"
          >
            All Services →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <ScrollReveal key={s.slug} delay={i * 0.07}>
              <Link
                href={`/services/${s.slug}`}
                className="block bg-cream p-7 rounded-lg hover:shadow-md transition-shadow group h-full"
              >
                <div className="w-9 h-9 rounded-md bg-sand-dark mb-5 group-hover:bg-gold/20 transition-colors" />
                <h3 className="font-serif text-lg text-brown-deep mb-2">{s.name}</h3>
                <p className="font-sans text-[13px] text-brown-light leading-relaxed">{s.desc}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create ProjectsMosaic.tsx** (static placeholder images until Sanity is wired up in Phase 2)

```typescript
import Link  from 'next/link'
import Image from 'next/image'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'

// Static featured projects — replaced by Sanity query in Task 11
const FEATURED = [
  { title: 'Modern Villa, Whitefield',     category: 'Residential',   src: '/images/projects/hero-1.jpg' },
  { title: 'Poorna Vikas Vidyalaya',        category: 'Institutional', src: '/images/projects/hero-2.jpg' },
  { title: 'Corporate Office, Indiranagar', category: 'Interior',      src: '/images/projects/hero-3.jpg' },
  { title: 'Luxury Apartment',              category: 'Residential',   src: '/images/projects/hero-4.jpg' },
  { title: 'Heritage Renovation',           category: 'Renovation',    src: '/images/projects/hero-5.jpg' },
]

export default function ProjectsMosaic() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <ScrollReveal>
          <SectionHeading tag="Featured Work" title="Projects that<br /><strong>speak for themselves</strong>" />
        </ScrollReveal>
        <Link
          href="/projects"
          className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors hidden md:block"
        >
          All Projects →
        </Link>
      </div>

      {/* Asymmetric mosaic: 1 tall left + 4 grid right */}
      <div className="max-w-content mx-auto px-6 grid md:grid-cols-3 gap-3">
        {/* Large left card */}
        <ScrollReveal className="md:row-span-2">
          <div
            data-cursor="view"
            className="relative overflow-hidden rounded-lg bg-sand-dark aspect-[3/4] md:aspect-auto md:h-full group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-gold-dark/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-sans text-[8px] tracking-[3px] uppercase text-sand/60 mb-1">{FEATURED[0].category}</p>
              <p className="font-serif text-lg text-sand">{FEATURED[0].title}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 smaller cards */}
        {FEATURED.slice(1).map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.08}>
            <div
              data-cursor="view"
              className="relative overflow-hidden rounded-lg bg-sand-dark aspect-video group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold-dark/50 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-sans text-[7px] tracking-[3px] uppercase text-sand/60 mb-1">{p.category}</p>
                <p className="font-serif text-sm text-sand">{p.title}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="max-w-content mx-auto px-6 mt-6 text-center">
        <Link
          href="/projects"
          className="font-sans text-[10px] tracking-[2px] uppercase text-brown-mid hover:text-brown-deep transition-colors border-b border-gold pb-1"
        >
          View all 1024+ projects →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create Testimonial.tsx**

```typescript
'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'

// Static — add more when client provides testimonials
const TESTIMONIALS = [
  {
    quote: "Suvasthuk didn't just design our home — they understood how we live. The result is a space that feels completely ours.",
    author: 'Priya & Arvind Sharma',
    location: 'Residential Client · Jayanagar, Bengaluru',
  },
  {
    quote: "From sanction plans to final handover, the team was meticulous. Our school building exceeded every expectation.",
    author: 'Principal, Poorna Vikas Vidyalaya',
    location: 'Institutional Client · Bengaluru',
  },
]

export default function Testimonial() {
  const [active, setActive] = useState(0)
  const t = TESTIMONIALS[active]

  return (
    <section className="bg-charcoal py-20 md:py-28 text-center px-6">
      <ScrollReveal direction="none">
        <p className="font-serif text-6xl text-gold/20 leading-none mb-4 select-none" aria-hidden="true">&ldquo;</p>
        <blockquote className="font-serif text-xl md:text-2xl font-normal text-sand leading-relaxed max-w-2xl mx-auto italic">
          {t.quote}
        </blockquote>
        <p className="font-sans text-[9px] tracking-[3px] uppercase text-gold mt-6">{t.author}</p>
        <p className="font-sans text-[11px] text-sand/30 mt-1">{t.location}</p>

        {/* Dot navigation */}
        {TESTIMONIALS.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === active ? 'bg-gold' : 'bg-sand/20'
                }`}
              />
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  )
}
```

- [ ] **Step 5: Create BlogPreview.tsx** (static until Sanity in Phase 2)

```typescript
import Link from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'

const POSTS = [
  {
    category: 'Architecture',
    title: 'How to Choose the Right Architect in Bangalore',
    excerpt: 'What to look for, what to ask, and how to avoid costly mistakes when hiring an architect.',
    slug: 'how-to-choose-architect-bangalore',
  },
  {
    category: 'Construction',
    title: 'Cost of Building a House in Bangalore in 2025',
    excerpt: 'A transparent, up-to-date breakdown of what residential construction actually costs.',
    slug: 'cost-building-house-bangalore-2025',
  },
  {
    category: 'Vastu',
    title: 'Vastu-Compliant Home Design: A Modern Guide',
    excerpt: 'Balancing ancient principles with contemporary aesthetics — a practical guide for homeowners.',
    slug: 'vastu-compliant-home-design-guide',
  },
]

export default function BlogPreview() {
  return (
    <section className="py-20 md:py-28 bg-sand-dark">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <ScrollReveal>
            <SectionHeading tag="Insights" title="From our <strong>studio</strong>" />
          </ScrollReveal>
          <Link
            href="/blog"
            className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors hidden md:block"
          >
            All Articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((p, i) => (
            <ScrollReveal key={p.slug} delay={i * 0.1}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="aspect-video bg-sand rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold-dark/30 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="font-sans text-[8px] tracking-[3px] uppercase text-gold mb-2">{p.category}</p>
                <h3 className="font-serif text-lg text-brown-deep mb-2 leading-snug group-hover:text-gold-dark transition-colors">
                  {p.title}
                </h3>
                <p className="font-sans text-[13px] text-brown-light leading-relaxed">{p.excerpt}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create CtaBand.tsx**

```typescript
import Link from 'next/link'
import ScrollReveal from '@/components/animations/ScrollReveal'

export default function CtaBand() {
  return (
    <section className="bg-gradient-to-br from-brown-mid to-brown-deep py-20 px-6">
      <div className="max-w-content mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-sand leading-tight">
            Ready to build<br />
            <strong>something remarkable?</strong>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <Link
            href="/contact"
            className="inline-block bg-sand text-brown-deep font-sans font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-cream transition-colors whitespace-nowrap"
          >
            Start a Conversation
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Update app/page.tsx with all sections**

```typescript
import Hero           from '@/components/home/Hero'
import Marquee        from '@/components/home/Marquee'
import StatsBar       from '@/components/home/StatsBar'
import AboutStrip     from '@/components/home/AboutStrip'
import ServicesGrid   from '@/components/home/ServicesGrid'
import ProjectsMosaic from '@/components/home/ProjectsMosaic'
import Testimonial    from '@/components/home/Testimonial'
import BlogPreview    from '@/components/home/BlogPreview'
import CtaBand        from '@/components/home/CtaBand'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee />
      <StatsBar />
      <AboutStrip />
      <ServicesGrid />
      <ProjectsMosaic />
      <Testimonial />
      <BlogPreview />
      <CtaBand />
    </main>
  )
}
```

- [ ] **Step 8: Verify full homepage**

```bash
npm run dev
```

Scroll through http://localhost:3000 — verify:
- Each section reveals as it enters viewport
- Testimonial dot navigation switches quotes
- "Get in Touch" in navbar and CTA band both go to `/contact`
- WhatsApp button stays fixed

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 9: Commit**

```bash
cd .. && git add suvasthuk-next/components/home suvasthuk-next/app/page.tsx
git commit -m "feat: complete homepage — all 9 sections with scroll animations"
```

---

*Phase 1 complete. Homepage is fully built with static data.*

*Continue with Phase 2 plan: `docs/superpowers/plans/2026-04-12-suvasthuk-rebuild-phase2.md`*
*which covers: Sanity CMS setup, Projects pages, Blog pages, Services pages, Contact, About, SEO.*
