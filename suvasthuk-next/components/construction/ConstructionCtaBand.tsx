import Link         from 'next/link'
import ScrollReveal from '@/components/animations/ScrollReveal'

export default function ConstructionCtaBand() {
  return (
    <section className="bg-concrete border-t border-[#2a2a2a] py-20 px-6">
      <div className="max-w-content mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <ScrollReveal>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#f0ede8] leading-tight">
            Ready to start{' '}<br />
            <strong className="text-cement">building?</strong>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <Link
            href="/contact?mode=construction"
            className="inline-block bg-cement text-concrete font-sans font-bold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded hover:bg-cement-dark transition-colors whitespace-nowrap"
          >
            Start Your Project →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
