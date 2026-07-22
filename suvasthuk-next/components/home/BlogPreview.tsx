import Link         from 'next/link'
import Image        from 'next/image'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import SectionHeading from '@/components/ui/SectionHeading'
import { urlFor }   from '@/sanity/lib/queries'

type BlogPostItem = {
  title: string
  slug: { current: string }
  category?: string
  excerpt?: string
  coverImage?: { asset: { _ref: string } }
  localImage?: string
}

const STATIC_FALLBACK: BlogPostItem[] = [
  {
    category: 'Architecture',
    title: 'How to Choose the Right Architect in Bangalore',
    excerpt: 'What to look for, what to ask, and how to avoid costly mistakes when hiring an architect.',
    slug: { current: 'how-to-choose-architect-bangalore' },
    localImage: '/images/image_1.jpg',
  },
  {
    category: 'Construction',
    title: 'Cost of Building a House in Bangalore in 2025',
    excerpt: 'A transparent, up-to-date breakdown of what residential construction actually costs.',
    slug: { current: 'cost-building-house-bangalore-2025' },
    localImage: '/images/image_2.jpg',
  },
  {
    category: 'Vastu',
    title: 'Vastu-Compliant Home Design: A Modern Guide',
    excerpt: 'Balancing ancient principles with contemporary aesthetics — a practical guide for homeowners.',
    slug: { current: 'vastu-compliant-home-design-guide' },
    localImage: '/images/image_3.jpg',
  },
]

export default function BlogPreview({ posts }: { posts: BlogPostItem[] }) {
  const list = posts.length ? posts : STATIC_FALLBACK

  return (
    <section className="py-20 md:py-28 bg-sand-dark">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <ScrollReveal>
            <SectionHeading tag="Insights" title="From our <strong>studio</strong>" />
          </ScrollReveal>
          <Link
            href="/blog"
            className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors hidden md:block"
          >
            All Articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((p, i) => {
            const imgUrl = p.coverImage
              ? urlFor(p.coverImage).width(600).height(340).url()
              : p.localImage ?? null
            return (
              <ScrollReveal key={p.slug.current} delay={i * 0.1}>
                <Link href={`/blog/${p.slug.current}`} className="group block">
                  <div className="aspect-video bg-sand rounded-lg mb-4 overflow-hidden relative">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={p.title}
                        fill
                        sizes="(min-width:768px) 33vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold-dark/30 group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  {p.category && (
                    <p className="font-sans text-[8px] tracking-[3px] uppercase text-gold mb-2">{p.category}</p>
                  )}
                  <h3 className="font-serif text-lg text-brown-deep mb-2 leading-snug group-hover:text-gold-dark transition-colors">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="font-sans text-[13px] text-brown-light leading-relaxed">{p.excerpt}</p>
                  )}
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
