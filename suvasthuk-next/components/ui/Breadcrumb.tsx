import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="max-w-content mx-auto px-6 pt-6 pb-2">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="font-sans text-[9px] text-brown-light/40" aria-hidden="true">›</span>
              )}
              {isLast || !item.href ? (
                <span
                  className="font-sans text-[9px] tracking-[2px] uppercase text-brown-mid"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-sans text-[9px] tracking-[2px] uppercase text-brown-light/60 hover:text-brown-mid transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
