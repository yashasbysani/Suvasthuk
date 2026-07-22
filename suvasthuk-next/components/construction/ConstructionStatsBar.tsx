import ScrollReveal from '@/components/animations/ScrollReveal'

const STATS = [
  { value: '1024+', label: 'Projects Built'     },
  { value: '30+',   label: 'Years Experience'   },
  { value: '826+',  label: 'Satisfied Clients'  },
  { value: '1993',  label: 'Year Founded'       },
]

export default function ConstructionStatsBar() {
  return (
    <section className="bg-cement py-10">
      <div className="max-w-content mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-cement-dark rounded-lg overflow-hidden">
        {STATS.map(({ value, label }, i) => (
          <ScrollReveal key={label} delay={i * 0.08}>
            <div className="bg-cement px-6 py-8 text-center">
              <p className="font-serif text-3xl font-bold text-concrete">{value}</p>
              <p className="font-sans text-[9px] tracking-[3px] uppercase text-[#3a3830] mt-2">{label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
