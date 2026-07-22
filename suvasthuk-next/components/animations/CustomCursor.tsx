'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef  = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    // Start invisible until first mouse position is known
    gsap.set(cursor, { opacity: 0 })

    // Hide default cursor site-wide
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    const onEnter = () => {
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: 'power2.out' })
      if (labelRef.current) gsap.to(labelRef.current, { opacity: 1, duration: 0.2 })
    }

    const onLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' })
      if (labelRef.current) gsap.to(labelRef.current, { opacity: 0, duration: 0.2 })
    }

    const attached = new WeakSet<HTMLElement>()

    const attach = () => {
      document.querySelectorAll<HTMLElement>('[data-cursor="view"]').forEach((el) => {
        if (attached.has(el)) return
        attached.add(el)
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
      document.querySelectorAll<HTMLElement>('[data-cursor="view"]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.style.cursor = ''
      })
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
        <span
          ref={labelRef}
          className="font-sans text-[7px] tracking-[3px] uppercase text-brown-deep opacity-0"
        >
          View
        </span>
      </div>
    </div>
  )
}
