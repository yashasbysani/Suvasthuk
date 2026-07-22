import Link from 'next/link'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'

export default function AboutStrip() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
        <ScrollReveal>
          <SectionHeading
            tag="Our Story"
            title="A practice built on <br /><strong>30 years of craft</strong>"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="space-y-4 font-sans text-[15px] leading-relaxed text-brown-mid">
            <p>
              Founded in 1993 by architect B K Muralidhar, Suvasthuk began with one belief —
              that buildings are bridges between people, nature, and culture.
            </p>
            <p>
              Over three decades we have grown from residences to schools, commercial spaces,
              and beyond. Every project, regardless of scale, receives the same &ldquo;macro to micro&rdquo;
              attention — from the governing idea down to the last detail.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-block mt-6 font-sans text-[10px] tracking-[3px] uppercase text-brown-deep border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            Our full story →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
