import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main-content" className="pt-24 pb-20 min-h-[70vh] flex items-center">
      <div className="max-w-content mx-auto px-6 text-center">
        <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-4">404 — Page not found</p>
        <h1 className="font-serif text-4xl md:text-5xl text-brown-deep leading-tight mb-6">
          This page seems to be{' '}<em>off the plan</em>
        </h1>
        <p className="font-sans text-[15px] text-brown-mid max-w-md mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Try one of these instead:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="bg-brown-deep text-sand font-sans font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-brown-mid transition-colors"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="border border-gold text-brown-deep font-sans font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:border-brown-deep transition-colors"
          >
            Our Projects
          </Link>
          <Link
            href="/contact"
            className="border border-gold text-brown-deep font-sans font-semibold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:border-brown-deep transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}
