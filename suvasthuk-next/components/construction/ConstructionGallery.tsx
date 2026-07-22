'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from '@/components/ui/Lightbox'

interface GalleryImage {
  src: string
  alt: string
}

export default function ConstructionGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images.length) return null

  const openAt = (i: number) => setLightboxIndex(i)
  const close   = () => setLightboxIndex(null)
  const prev    = () => setLightboxIndex(i => (i! - 1 + images.length) % images.length)
  const next    = () => setLightboxIndex(i => (i! + 1) % images.length)

  return (
    <>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => openAt(i)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-cement"
            aria-label={`View ${img.alt} full screen`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="font-sans text-[9px] tracking-[3px] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/60 px-3 py-1.5">
                View
              </span>
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}
