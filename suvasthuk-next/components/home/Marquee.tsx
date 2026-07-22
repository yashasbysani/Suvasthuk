const SERVICES = [
  'Residential', 'Commercial', 'Interior Design', 'Construction',
  'Vastu Consultation', 'Renovation', 'Landscaping', 'Structural Design',
  'Sanction Plans', 'Elevation Designs', 'Layout Planning', 'TDR Procurement',
]

export default function Marquee() {
  // Duplicate array so the CSS animation loops seamlessly
  const items = [...SERVICES, ...SERVICES]

  return (
    <div className="bg-charcoal py-4 overflow-hidden">
      <div className="flex gap-10 animate-marquee whitespace-nowrap w-max hover:[animation-play-state:paused]">
        {items.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span className="font-sans text-[9px] tracking-[3px] uppercase text-sand/30">{s}</span>
            <span className="text-gold" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
