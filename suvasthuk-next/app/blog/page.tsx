import type { Metadata } from 'next'
import Link  from 'next/link'
import Image from 'next/image'
import SectionHeading from '@/components/ui/SectionHeading'
import ScrollReveal   from '@/components/animations/ScrollReveal'
import { getAllBlogPosts, urlFor } from '@/sanity/lib/queries'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const metadata: Metadata = {
  title: 'Architecture & Design Insights',
  description: 'Expert articles on architecture, interior design, construction costs, Vastu, and building in Bengaluru.',
  alternates: { canonical: 'https://suvasthuk.com/blog' },
  openGraph: {
    url: 'https://suvasthuk.com/blog',
    title: 'Architecture & Design Insights',
    description: 'Expert articles on architecture, interior design, construction costs, Vastu, and building in Bengaluru.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export const revalidate = 3600 // re-generate at most once an hour

type BlogPost = {
  title:      string
  slug:       { current: string }
  category?:  string
  coverImage?: SanityImageSource
  excerpt?:   string
  readTime?:  number
}

export default async function BlogPage() {
  const posts: BlogPost[] = await getAllBlogPosts().catch(() => [])

  const itemListSchema = posts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Architecture & Design Insights by Suvasthuk Architects',
    url: 'https://suvasthuk.com/blog',
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://suvasthuk.com/blog/${post.slug.current}`,
      name: post.title,
    })),
  } : null

  return (
    <main id="main-content" className="pt-24 pb-20">
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <h1 className="sr-only">Architecture & Design Insights</h1>
      <div className="max-w-content mx-auto px-6">
        <div className="mb-14">
          <SectionHeading tag="Insights" title="From our <strong>studio</strong>" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug.current} delay={i * 0.07}>
              <article>
                <Link href={`/blog/${post.slug.current}`} className="group block">
                  <div className="aspect-video rounded-lg overflow-hidden bg-sand-dark mb-4">
                    {post.coverImage ? (
                      <Image
                        src={urlFor(post.coverImage).width(600).url()}
                        alt={post.title}
                        width={600}
                        height={337}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold-dark/30 group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  {post.category && (
                    <p className="font-sans text-[8px] tracking-[3px] uppercase text-gold mb-2">{post.category}</p>
                  )}
                  <h2 className="font-serif text-xl text-brown-deep mb-2 leading-snug group-hover:text-gold-dark transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="font-sans text-[13px] text-brown-light leading-relaxed line-clamp-2">{post.excerpt}</p>
                  )}
                  {post.readTime && (
                    <p className="font-sans text-[11px] text-brown-light/60 mt-2">{post.readTime} min read</p>
                  )}
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="font-sans text-brown-light text-center py-20">Articles coming soon.</p>
        )}
      </div>
    </main>
  )
}
