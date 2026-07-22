interface Props {
  title: string
  description: string
  imageUrl?: string
  author?: string
  slug: string
  publishedAt?: string
  modifiedAt?: string
}

export default function ArticleSchema({ title, description, imageUrl, author, slug, publishedAt, modifiedAt }: Props) {
  const canonicalUrl = `https://suvasthuk.com/blog/${slug}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'en-IN',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    ...(imageUrl && { image: imageUrl }),
    author: author
      ? { '@type': 'Person', name: author }
      : { '@type': 'Organization', name: 'Suvasthuk Architects', url: 'https://suvasthuk.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Suvasthuk Architects',
      url: 'https://suvasthuk.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://suvasthuk.com/images/Logo/logo.jpg',
      },
    },
    url: canonicalUrl,
    ...(publishedAt && { datePublished: publishedAt }),
    ...(modifiedAt  ? { dateModified: modifiedAt } : publishedAt ? { dateModified: publishedAt } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
