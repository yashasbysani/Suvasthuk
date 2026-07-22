'use client'

import { useEffect, useRef } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import gsap  from 'gsap'

const STATS = [
  { value: '30+',   label: 'Years Experience'  },
  { value: '826+',  label: 'Happy Clients'     },
  { value: '1024+', label: 'Projects Built'    },
  { value: '12+',   label: 'Service Areas'     },
]

export default function ConstructionHero() {
  const topBarRef    = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const tagRef       = useRef<HTMLParagraphElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const statsRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set([tagRef.current, titleRef.current, ctaRef.current, statsRef.current], { opacity: 1, y: 0 })
      return
    }

    gsap.set([topBarRef.current, bottomBarRef.current], { scaleY: 1 })
    gsap.set([tagRef.current, titleRef.current, ctaRef.current, statsRef.current], { opacity: 0, y: 30 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
    tl
      .to(topBarRef.current,    { scaleY: 0, duration: 0.8, transformOrigin: 'top center' }, 0.05)
      .to(bottomBarRef.current, { scaleY: 0, duration: 0.8, transformOrigin: 'bottom center' }, 0.05)
      .to(tagRef.current,       { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.4)
      .to(titleRef.current,     { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.5)
      .to(ctaRef.current,       { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.7)
      .to(statsRef.current,     { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.8)

    return () => { tl.kill() }
  }, [])

  return (
    <section className="relative h-screen min-h-[680px] overflow-hidden bg-concrete flex flex-col">

      {/* Hero image */}
      <Image
        src="/images/construction-hero.jpg"
        alt="Construction site — Suvasthuk Architects"
        width={1920}
        height={1080}
        priority
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-concrete/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-concrete/90 via-concrete/20 to-concrete/30" />

      {/* Letterbox bars */}
      <div ref={topBarRef}    className="absolute inset-x-0 top-0    h-2/5 bg-concrete z-10 origin-top" />
      <div ref={bottomBarRef} className="absolute inset-x-0 bottom-0 h-2/5 bg-concrete z-10 origin-bottom" />

      {/* Bengaluru badge */}
      <div className="absolute top-24 right-6 z-20 border border-cement/30 rounded-full px-4 py-1.5 bg-cement/10 backdrop-blur-sm">
        <span className="font-sans text-[9px] tracking-[3px] uppercase text-cement">Bengaluru · Est. 1993</span>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex-1 flex flex-col justify-between px-6 md:px-14 pt-40 md:pt-32 pb-0">

        {/* Headline block */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p ref={tagRef} className="font-sans text-[9px] tracking-[4px] uppercase text-cement mb-5">
              Construction Services · Bangalore
            </p>
            <h1 ref={titleRef} className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal text-[#f0ede8] leading-[1.0] max-w-3xl">
              Built to last.{' '}<br />
              <em>Delivered on time.</em>
            </h1>
          </div>

          {/* Right column — description + CTAs */}
          <div ref={ctaRef} className="md:max-w-xs lg:max-w-sm shrink-0">
            <p className="font-sans text-[13px] text-cement/70 leading-relaxed mb-7 hidden md:block">
              Full-contract construction from foundation to handover — one team, transparent pricing, zero surprises.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/contact?mode=construction"
                className="font-sans text-[10px] tracking-[2px] uppercase px-6 py-3 bg-cement text-concrete font-bold hover:bg-cement-dark transition-colors rounded-sm"
              >
                Get a Quote
              </Link>
              <Link
                href="/construction/projects"
                className="font-sans text-[10px] tracking-[2px] uppercase px-6 py-3 border border-cement/40 text-[#f0ede8] hover:border-cement hover:text-cement transition-colors rounded-sm"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="mt-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-cement/20 mt-10">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`py-6 px-2 md:px-6 ${i < STATS.length - 1 ? 'border-r border-cement/20' : ''}`}
              >
                <p className="font-serif text-3xl md:text-4xl text-[#f0ede8] font-normal leading-none">
                  {s.value}
                </p>
                <p className="font-sans text-[8px] tracking-[3px] uppercase text-cement/50 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="pb-6" />
        </div>
      </div>
    </section>
  )
}
