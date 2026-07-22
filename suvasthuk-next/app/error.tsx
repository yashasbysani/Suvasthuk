'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <main id="main-content" className="pt-24 pb-20 min-h-[70vh] flex items-center">
      <div className="max-w-content mx-auto px-6 text-center">
        <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">Something went wrong</p>
        <h1 className="font-serif text-4xl md:text-5xl text-brown-deep leading-tight mb-6">
          We hit an{' '}<em>unexpected snag</em>
        </h1>
        <p className="font-sans text-[15px] text-brown-mid max-w-md mx-auto mb-10">
          Please try again — or reach us directly at{' '}
          <a href="mailto:suvasthuk@gmail.com" className="underline hover:text-brown-deep">suvasthuk@gmail.com</a>.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="bg-brown-deep text-sand font-sans font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-brown-mid transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-gold text-brown-deep font-sans font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:border-brown-deep transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
