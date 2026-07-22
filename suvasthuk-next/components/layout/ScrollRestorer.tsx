'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Saves scroll position to sessionStorage when leaving a page,
 * and restores it when returning to the same page via Back button.
 */
export default function ScrollRestorer() {
  const pathname   = useRef<string>('')
  const currentPath = usePathname()

  // Save scroll position whenever user scrolls (throttled — max once per 300 ms)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    function saveScroll() {
      if (timer !== null) return
      timer = setTimeout(() => {
        sessionStorage.setItem(`scroll:${currentPath}`, String(window.scrollY))
        timer = null
      }, 300)
    }
    window.addEventListener('scroll', saveScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', saveScroll)
      if (timer !== null) clearTimeout(timer)
    }
  }, [currentPath])

  // Restore scroll position when pathname changes
  useEffect(() => {
    const saved = sessionStorage.getItem(`scroll:${currentPath}`)
    if (saved) {
      const y = parseInt(saved, 10)
      // Small delay to let the page render before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, behavior: 'instant' })
        })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    pathname.current = currentPath
  }, [currentPath])

  return null
}
