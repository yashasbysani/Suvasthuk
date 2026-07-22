'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from '@/components/ui/Lightbox'

interface Props {
  images: { src: string; alt: string }[]
}

export default function ArchitectureGallery({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <div className="columns-1 md:columns-2 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            data-cursor="view"
            className="mb-3 overflow-hidden rounded-lg group w-full text-left block"
            style={{ breakInside: 'avoid' }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={900}
              height={600}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => (i! - 1 + images.length) % images.length)}
          onNext={() => setLightboxIndex(i => (i! + 1) % images.length)}
        />
      )}
    </>
  )
}
