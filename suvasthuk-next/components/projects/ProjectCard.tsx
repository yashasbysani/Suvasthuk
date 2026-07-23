import Link  from 'next/link'
import Image from 'next/image'
import PhotoCountBadge from '@/components/ui/PhotoCountBadge'
import { urlFor } from '@/sanity/lib/queries'

interface Props {
  title:       string
  slug:        { current: string }
  category:    string
  coverImage?: unknown
  localImage?: string
  photoCount?: number
}

export default function ProjectCard({ title, slug, category, coverImage, localImage, photoCount }: Props) {
  const imgSrc = coverImage
    ? urlFor(coverImage as Parameters<typeof urlFor>[0]).width(700).url()
    : localImage ?? null

  return (
    <Link
      href={`/projects/${slug.current}`}
      data-cursor="view"
      aria-label={`View project: ${title}`}
      className="relative overflow-hidden rounded-lg bg-sand-dark block group"
      style={{ breakInside: 'avoid', marginBottom: '12px' }}
    >
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={title}
          width={700}
          height={500}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="aspect-video bg-gradient-to-br from-gold/20 to-gold-dark/30" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
      <PhotoCountBadge count={photoCount} />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-sans text-[8px] tracking-[3px] uppercase text-sand/60 mb-1 capitalize">{category}</p>
        <p className="font-serif text-base text-sand">{title}</p>
      </div>
    </Link>
  )
}
