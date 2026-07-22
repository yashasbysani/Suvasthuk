'use client'

const FILTERS = ['All', 'Residential', 'Commercial', 'Interior', 'Institutional', 'Renovation']

interface Props {
  active: string
  onChange: (f: string) => void
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`font-sans text-[9px] tracking-[2px] uppercase px-4 py-2 rounded-full border transition-colors ${
            active === f
              ? 'bg-brown-deep text-sand border-brown-deep'
              : 'bg-transparent text-brown-mid border-gold hover:border-brown-deep hover:text-brown-deep'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
