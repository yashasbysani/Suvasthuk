import Link from 'next/link'
import ScrollReveal from '@/components/animations/ScrollReveal'

export default function CtaBand() {
  return (
    <section aria-labelledby="cta-heading" className="bg-gradient-to-br from-brown-mid to-brown-deep py-20 px-6">
      <div className="max-w-content mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <ScrollReveal>
          <h2 id="cta-heading" className="font-serif text-3xl md:text-4xl font-normal text-sand leading-tight">
            Ready to build{' '}<br />
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
