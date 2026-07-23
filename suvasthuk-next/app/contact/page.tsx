'use client'

import { useState } from 'react'
import Link from 'next/link'

const PROJECT_TYPES = [
  'Residential Design', 'Interior Design', 'Construction',
  'Renovation', 'Commercial Project', 'Vastu Consultation',
  'Sanction Plans / TDR', 'Architectural Designs', 'All of the above',
  'Just need help with a few questions only', 'Other',
]

function GoogleReviewCard({ company, rating, href }: { company: string; rating?: number; href: string }) {
  return (
    <div className="bg-sand-dark rounded-lg p-6">
      <div className="flex items-center gap-3 mb-3">
        <svg viewBox="0 0 48 48" className="w-7 h-7 shrink-0" aria-hidden="true">
          <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
          <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
          <path fill="#FBBC05" d="M11.69 28.18A13.98 13.98 0 0 1 10.89 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
          <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
        </svg>
        <div>
          <p className="font-sans text-[13px] font-semibold text-brown-deep">
            {company} on Google
          </p>
          {rating && (
            <p className="font-sans text-[12px] text-brown-mid mt-0.5">
              Rated {rating} out of 5 Stars
            </p>
          )}
          {rating && (
            <div className="flex gap-0.5 mt-0.5" aria-label={`${rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} viewBox="0 0 20 20" className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'fill-gold' : 'fill-[#888]/30'}`} aria-hidden="true">
                  <path d="M10 1.5l2.6 5.6 6 .7-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L1.4 7.8l6-.7z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-sans text-[10px] tracking-[2px] uppercase text-brown-deep border-b border-gold pb-1 hover:text-gold transition-colors"
      >
        Read our Reviews →
      </a>
    </div>
  )
}

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <main id="main-content" className="pt-24 pb-20">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-14">
          <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-brown-deep leading-tight">
            Let&apos;s build something{' '}<br /><em>together</em>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact info */}
          <div className="space-y-10">
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Meet</p>
              <a
                href="https://g.page/suvasthuk?share"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[15px] text-brown-mid leading-relaxed hover:text-brown-deep transition-colors"
              >
                F6 17/2, 1st Floor, Kodigehalli Main Rd<br />
                Sahakar Nagar, Bengaluru 560092
              </a>
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Talk</p>
              <a href="tel:+918041110467" className="block font-sans text-[15px] text-brown-mid hover:text-brown-deep transition-colors">
                080 – 41110467
              </a>
              <a href="tel:+919480444666" className="block font-sans text-[15px] text-brown-mid hover:text-brown-deep transition-colors mt-1">
                +91 9480444666
              </a>
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">Write</p>
              <a href="mailto:suvasthuk@gmail.com" className="font-sans text-[15px] text-brown-mid hover:text-brown-deep transition-colors">
                suvasthuk@gmail.com
              </a>
            </div>

            {/* Google Reviews */}
            <GoogleReviewCard
              company="Suvasthuk Architects"
              rating={4.2}
              href="https://share.google/9sWOGtFztKahPi9if"
            />

            <div className="flex items-center gap-4 py-1">
              <span className="flex-1 border-t border-sand-dark" />
              <span className="font-sans text-[11px] leading-relaxed text-brown-light text-center max-w-[220px]">
                In proud partnership with our sister company, Yashas Construction, bringing
                comprehensive design and build solutions under one roof.
              </span>
              <span className="flex-1 border-t border-sand-dark" />
            </div>

            <GoogleReviewCard
              company="Yashas Construction"
              rating={5}
              href="https://share.google/FReltVZvNDolwgFtU"
            />
          </div>

          {/* Form */}
          <div>
            {status === 'success' ? (
              <div className="bg-sand-dark rounded-lg p-8">
                <p className="font-serif text-2xl text-brown-deep mb-2">Thank you!</p>
                <p className="font-sans text-[15px] text-brown-mid">
                  We&apos;ve received your message and will get back to you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot — hidden from real users, catches bots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">
                      Name *
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold"
                  >
                    <option value="">Select…</option>
                    {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">
                    Approximate Budget
                  </label>
                  <select
                    name="budget"
                    className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold"
                  >
                    <option value="">Prefer not to say</option>
                    <option>Under ₹20 lakhs</option>
                    <option>₹20–50 lakhs</option>
                    <option>₹50 lakhs – 1 crore</option>
                    <option>Above ₹1 crore</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[9px] tracking-[3px] uppercase text-brown-light block mb-1.5">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-cream border border-sand-dark rounded px-4 py-3 font-sans text-[14px] text-brown-deep focus:outline-none focus:border-gold resize-none"
                  />
                </div>
                {status === 'error' && (
                  <p className="font-sans text-[13px] text-red-600">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-brown-deep text-sand font-sans font-semibold text-[11px] tracking-[2px] uppercase py-4 rounded hover:bg-brown-mid transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
                <p className="font-sans text-[11px] text-brown-light text-center">
                  By submitting, you agree to our{' '}
                  <Link href="/privacy-policy" className="underline hover:text-brown-deep transition-colors">
                    Privacy Policy
                  </Link>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
