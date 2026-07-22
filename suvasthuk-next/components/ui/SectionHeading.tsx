interface Props {
  tag: string
  title: string       // may contain <br /> and <strong> — rendered via dangerouslySetInnerHTML
  className?: string
  dark?: boolean      // true = light text for dark backgrounds
}

export default function SectionHeading({ tag, title, className = '', dark = false }: Props) {
  return (
    <div className={className}>
      <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">{tag}</p>
      <h2
        className={`font-serif text-3xl md:text-4xl font-normal leading-tight ${dark ? 'text-[#f0ede8]' : 'text-brown-deep'}`}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  )
}
