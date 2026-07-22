'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image        from 'next/image'
import ScrollReveal from '@/components/animations/ScrollReveal'

const AUTO_ADVANCE_MS = 4000

type TestimonialItem = {
  quote:         string
  author:        string
  location?:     string
  avatarGender?: 'male' | 'female'
  rating?:       number
  date?:         string
  sourceUrl?:    string
}

const AVATAR_ICON: Record<'male' | 'female', string> = {
  male:   '/images/male-headshot-icon.png',
  female: '/images/female-headshot-icon.png',
}

const STATIC_FALLBACK: TestimonialItem[] = [
  {
    quote: "Suvasthuk didn't just design our home — they understood how we live. The result is a space that feels completely ours.",
    author: 'Priya & Arvind Sharma',
    location: 'Residential Client · Jayanagar, Bengaluru',
    avatarGender: 'female',
    rating: 5,
  },
  {
    quote: "From sanction plans to final handover, the team was meticulous. Our school building exceeded every expectation.",
    author: 'Principal, Poorna Vikas Vidyalaya',
    location: 'Institutional Client · Bengaluru',
    avatarGender: 'male',
    rating: 5,
  },
  {
    quote: "The attention to detail at every stage was remarkable. They treated our office like it was their own space to design.",
    author: 'Ramesh Nair',
    location: 'Commercial Client · Indiranagar, Bengaluru',
    avatarGender: 'male',
    rating: 5,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex justify-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`w-4 h-4 ${i < rating ? 'fill-gold' : 'fill-[#888]/30'}`} aria-hidden="true">
          <path d="M10 1.5l2.6 5.6 6 .7-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L1.4 7.8l6-.7z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonial({
  testimonials,
  dark = false,
}: {
  testimonials: TestimonialItem[]
  dark?:        boolean
}) {
  const list = testimonials.length ? testimonials : STATIC_FALLBACK
  const [active, setActive] = useState(0)
  const t = list[active] ?? list[0]

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((i: number) => {
    setActive(((i % list.length) + list.length) % list.length)
  }, [list.length])
  const next = useCallback(() => goTo(active + 1), [goTo, active])
  const prev = useCallback(() => goTo(active - 1), [goTo, active])

  // Auto-advance every 4s, looping back to the first — restarts whenever the
  // user manually navigates so it doesn't double-advance right after a click.
  useEffect(() => {
    if (list.length <= 1) return
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % list.length)
    }, AUTO_ADVANCE_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [list.length, active])

  // Emit Review + aggregateRating structured data only for real (Sanity) testimonials
  // that carry a numeric rating — never for the static fallback, which has none, so we
  // never publish schema Google could read as fabricated. Reviews attach to the business
  // node declared in LocalBusinessSchema (shared @id) so Google merges them onto it.
  const rated = list.filter(x => typeof x.rating === 'number' && x.rating >= 1)
  const reviewJsonLd = rated.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': 'https://suvasthuk.com/#business',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: (rated.reduce((sum, x) => sum + (x.rating ?? 0), 0) / rated.length).toFixed(1),
          reviewCount: rated.length,
          bestRating: 5,
          worstRating: 1,
        },
        review: rated.map(x => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: x.author },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: x.rating,
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: x.quote,
          ...(x.date && { datePublished: x.date }),
          ...(x.sourceUrl && { url: x.sourceUrl }),
        })),
      }
    : null

  return (
    <>
      {reviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
        />
      )}
    <section
      aria-label="Client Testimonials"
      className={`relative py-20 md:py-28 text-center px-6 ${dark ? 'bg-concrete-deep' : 'bg-charcoal'}`}
    >
      {list.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className={`absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors ${
              dark ? 'text-[#f0ede8]/30 hover:text-[#f0ede8]/70' : 'text-sand/30 hover:text-sand/70'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className={`absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors ${
              dark ? 'text-[#f0ede8]/30 hover:text-[#f0ede8]/70' : 'text-sand/30 hover:text-sand/70'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
      <ScrollReveal direction="none">
        <p
          className={`font-serif text-6xl leading-none mb-4 select-none ${dark ? 'text-cement/20' : 'text-gold/20'}`}
          aria-hidden="true"
        >
          &ldquo;
        </p>
        <blockquote className={`font-serif text-xl md:text-2xl font-normal leading-relaxed max-w-2xl mx-auto italic ${
          dark ? 'text-[#f0ede8]' : 'text-sand'
        }`}>
          {t.quote}
        </blockquote>
        {t.avatarGender && (
          <div className="flex justify-center mt-6 mb-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold/30 bg-sand">
              <Image src={AVATAR_ICON[t.avatarGender]} alt={t.author} fill sizes="48px" className="object-cover" />
            </div>
          </div>
        )}
        {typeof t.rating === 'number' && (
          <div className="mt-2">
            <StarRating rating={t.rating} />
          </div>
        )}
        <p className={`font-sans text-[9px] tracking-[3px] uppercase ${(t.avatarGender || t.rating) ? 'mt-2' : 'mt-6'} ${dark ? 'text-cement' : 'text-gold'}`}>
          {t.author}
        </p>
        {t.location && (
          <p className={`font-sans text-[11px] mt-1 ${dark ? 'text-[#888]' : 'text-sand/30'}`}>
            {t.location}
          </p>
        )}

        {/* Dot navigation */}
        {list.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
                aria-pressed={i === active}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === active
                    ? (dark ? 'bg-cement' : 'bg-gold')
                    : (dark ? 'bg-[#f0ede8]/20' : 'bg-sand/20')
                }`}
              />
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
    </>
  )
}
