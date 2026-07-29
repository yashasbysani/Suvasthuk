'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import gsap  from 'gsap'

type Slide = { src: string; alt: string; label: string }

const SLIDES: Slide[] = [
  { src: '/images/hero/hero-1.jpg', alt: 'Luxury villa exterior — Suvasthuk Architects', label: 'Villa Design' },
  { src: '/images/hero/hero-2.jpg', alt: 'Modern house with glass facade',               label: 'Modern Living' },
  { src: '/images/hero/hero-3.jpg', alt: 'Contemporary white villa with pool',            label: 'Residential' },
  { src: '/images/hero/hero-4.jpg', alt: 'Minimalist interior design',                   label: 'Interiors' },
  { src: '/images/hero/hero-5.jpg', alt: 'Dramatic architectural building exterior',      label: 'Commercial' },
  { src: '/images/hero/hero-6.jpg', alt: 'Luxury living room with warm lighting',        label: 'Interior Design' },
]

const STATS = [
  { value: '30+',   label: 'Years Experience' },
  { value: '826+',  label: 'Happy Clients'    },
  { value: '1024+', label: 'Projects Built'   },
  { value: '12+',   label: 'Service Areas'    },
]

const INTERVAL = 5000

export default function Hero() {
  const topBarRef    = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const tagRef       = useRef<HTMLParagraphElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const statsRef     = useRef<HTMLDivElement>(null)

  const [current,  setCurrent]  = useState(0)
  const [animDone, setAnimDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), INTERVAL)
  }, [])

  useEffect(() => {
    if (!animDone) return
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [animDone, startTimer])

  const handleDotClick = (idx: number) => {
    setCurrent(idx)
    startTimer()
  }

  // Opening letterbox animation
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set([tagRef.current, titleRef.current, ctaRef.current, statsRef.current], { opacity: 1, y: 0 })
      setAnimDone(true)
      return
    }
    gsap.set([topBarRef.current, bottomBarRef.current], { scaleY: 1 })
    gsap.set([tagRef.current, titleRef.current, ctaRef.current, statsRef.current], { opacity: 0, y: 30 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => setAnimDone(true) })
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
    <section className="relative h-screen min-h-[680px] overflow-hidden bg-charcoal flex flex-col">

      {/* ── Slideshow images ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            width={1920}
            height={1080}
            priority={i === 0}
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark overlays for text legibility */}
          <div className="absolute inset-0 bg-charcoal/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-charcoal/30" />
        </div>
      ))}

      {/* ── Letterbox bars ── */}
      <div ref={topBarRef}    className="absolute inset-x-0 top-0    h-2/5 bg-charcoal z-10 origin-top" />
      <div ref={bottomBarRef} className="absolute inset-x-0 bottom-0 h-2/5 bg-charcoal z-10 origin-bottom" />

      {/* ── Bengaluru badge ── */}
      <div className="absolute top-24 right-6 z-20 border border-gold/30 rounded-full px-4 py-1.5 bg-gold/10 backdrop-blur-sm">
        <span className="font-sans text-[9px] tracking-[3px] uppercase text-gold">Bengaluru · Est. 1993</span>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 flex-1 flex flex-col justify-between px-6 md:px-14 pt-40 md:pt-32 pb-0">

        {/* Headline block */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="text-center md:text-left">
            <p ref={tagRef} className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-5">
              Architecture &amp; Design · Bangalore
            </p>
            <h1 ref={titleRef} className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal text-sand leading-[1.0] max-w-3xl mx-auto md:mx-0">
              Architects in Bengaluru{' '}
              <br />
              <em>Crafting Iconic Spaces Since 1993</em>
            </h1>
          </div>

          {/* Right column — description + CTAs */}
          <div ref={ctaRef} className="md:max-w-xs lg:max-w-sm shrink-0">
            <p className="font-sans text-[13px] text-sand/60 leading-relaxed mb-7 hidden md:block">
              Seamless, precise, and built to last — from concept sketch to final finish, we build homes that feel truly yours.
            </p>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Link
                href="/projects"
                className="font-sans text-[10px] tracking-[2px] uppercase px-6 py-3 bg-gold text-charcoal hover:bg-gold-dark transition-colors rounded-sm"
              >
                Explore work
              </Link>
              <Link
                href="/contact"
                className="font-sans text-[10px] tracking-[2px] uppercase px-6 py-3 border border-sand/30 text-sand hover:border-gold hover:text-gold transition-colors rounded-sm"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats + dots row ── */}
        <div ref={statsRef} className="mt-auto">
          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-sand/10 mt-10">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`py-6 px-2 md:px-6 ${i < STATS.length - 1 ? 'border-r border-sand/10' : ''}`}
              >
                <p className="font-serif text-3xl md:text-4xl text-sand font-normal leading-none">
                  {s.value}
                  <span className="text-gold text-2xl md:text-3xl"> </span>
                </p>
                <p className="font-sans text-[8px] tracking-[3px] uppercase text-sand/40 mt-2">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Slide dots */}
          {animDone && (
            <div className="flex items-center gap-3 pb-6 px-2 md:px-6">
              <span className="font-sans text-[8px] tracking-[3px] uppercase text-sand/30 mr-1 hidden md:block">
                {SLIDES[current].label}
              </span>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-sand/20 hover:bg-sand/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
