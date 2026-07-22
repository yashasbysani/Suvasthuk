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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      numRef.current.textContent = value.toString()
      return
    }

    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = Math.round(obj.val).toString()
      },
    })
    return () => { tween.kill() }
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
