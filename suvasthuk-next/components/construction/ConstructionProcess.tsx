import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'

const STEPS = [
  { num: '01', title: 'Consultation',  desc: 'We understand your goals, budget, and timeline before anything else.'       },
  { num: '02', title: 'Planning',      desc: 'Detailed drawings, approvals, material scheduling, and cost estimates.'     },
  { num: '03', title: 'Execution',     desc: 'Site work begins. Daily supervision ensures quality at every stage.'        },
  { num: '04', title: 'Delivery',      desc: 'Final inspection, handover documentation, and post-completion support.'     },
]

export default function ConstructionProcess() {
  return (
    <section className="py-20 md:py-28 bg-concrete-deep">
      <div className="max-w-content mx-auto px-6">
        <ScrollReveal className="mb-12">
          <SectionHeading tag="How We Work" title="Our four-step build process" dark />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map(({ num, title, desc }, i) => (
            <ScrollReveal key={num} delay={i * 0.1}>
              <div className="border-t-2 border-cement pt-6">
                <p className="font-sans text-[11px] tracking-[3px] uppercase text-cement font-bold mb-3">{num}</p>
                <h3 className="font-serif text-xl text-[#f0ede8] mb-3">{title}</h3>
                <p className="font-sans text-[13px] text-[#888] leading-relaxed">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
