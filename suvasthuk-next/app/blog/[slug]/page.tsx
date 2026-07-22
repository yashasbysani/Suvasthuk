import type { Metadata } from 'next'
import { notFound }    from 'next/navigation'
import Image           from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getBlogPostBySlug, urlFor } from '@/sanity/lib/queries'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import ScrollToTop from '@/components/layout/ScrollToTop'
import ArticleSchema from '@/components/seo/ArticleSchema'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const revalidate = 3600 // re-generate at most once an hour
export const dynamic = 'force-dynamic'

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      // Sanity asset refs encode the source's true pixel dimensions
      // ("image-<hash>-<W>x<H>-<ext>") — use them so the image renders at its
      // real aspect ratio instead of being cropped into a fixed box.
      const ref = (value.asset as { _ref?: string })._ref ?? ''
      const dims = ref.match(/-(\d+)x(\d+)-/)
      const width = dims ? Number(dims[1]) : 1600
      const height = dims ? Number(dims[2]) : 1067
      return (
        <figure className="my-10 -mx-6 md:mx-0">
          <Image
            src={urlFor(value as SanityImageSource).width(1600).url()}
            alt={value.alt ?? ''}
            width={width}
            height={height}
            className="w-full h-auto rounded-sm"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          {value.caption && (
            <figcaption className="font-sans text-[12px] text-brown-light/70 text-center mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug).catch(() => null)
  if (!post) return {}
  const rawTitle = post.seoTitle ?? post.title
  const title = rawTitle.replace(/\s*[|—–]\s*Suvasthuk Architects\s*$/i, '').trim()
  const description = post.seoDescription ?? post.excerpt
  const imageUrl = post.coverImage
    ? urlFor(post.coverImage as SanityImageSource).width(1200).height(630).url()
    : '/og-image.jpg'
  return {
    title,
    description,
    alternates: { canonical: `https://suvasthuk.com/blog/${slug}` },
    openGraph: {
      type: 'article',
      url: `https://suvasthuk.com/blog/${slug}`,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      ...(post.publishedAt && { publishedTime: post.publishedAt }),
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://suvasthuk.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://suvasthuk.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://suvasthuk.com/blog/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ArticleSchema
        title={post.title}
        description={post.seoDescription ?? post.excerpt ?? ''}
        imageUrl={post.coverImage ? urlFor(post.coverImage as SanityImageSource).width(1200).url() : undefined}
        author={post.author}
        slug={slug}
        publishedAt={post.publishedAt}
      />
      <main id="main-content" className="pt-16">
        <ScrollToTop />
        <Breadcrumb items={[
          { label: 'Home',  href: '/' },
          { label: 'Blog',  href: '/blog' },
          { label: post.title },
        ]} />
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] bg-sand-dark overflow-hidden">
        {post.coverImage && (
          <Image
            src={urlFor(post.coverImage as SanityImageSource).width(1600).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          {post.category && (
            <p className="font-sans text-[9px] tracking-[4px] uppercase text-gold mb-3">{post.category}</p>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-sand max-w-2xl leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-3">
            {post.author && <span className="font-sans text-[11px] text-sand/40">{post.author}</span>}
            {post.publishedAt && (
              <time
                dateTime={post.publishedAt}
                className="font-sans text-[11px] text-sand/40"
              >
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </time>
            )}
            {post.readTime && <span className="font-sans text-[11px] text-sand/40">{post.readTime} min read</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {post.body && (
          <div className="font-sans text-[16px] leading-[1.85] text-brown-mid prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-brown-deep
            prose-strong:text-brown-deep prose-a:text-gold-dark prose-a:no-underline hover:prose-a:underline">
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-sand-dark">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="font-sans text-[9px] tracking-[1px] uppercase px-3 py-1.5 border border-gold rounded-full text-brown-mid"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-sand-dark flex gap-6">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(post.title + ' https://suvasthuk.com/blog/' + slug)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors"
          >
            Share on WhatsApp
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent('https://suvasthuk.com/blog/' + slug)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[10px] tracking-[2px] uppercase text-brown-light hover:text-brown-deep transition-colors"
          >
            Share on LinkedIn
          </a>
        </div>
      </article>
    </main>
    </>
  )
}
