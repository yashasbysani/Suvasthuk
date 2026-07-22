'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'

interface LightboxProps {
  images: { src: string; alt: string }[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const current = images[index]

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape')      onClose()
    if (e.key === 'ArrowLeft')   onPrev()
    if (e.key === 'ArrowRight')  onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button — sits below navbar (top-20) so it's always visible */}
      <button
        onClick={onClose}
        className="absolute top-20 right-5 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-10 text-2xl font-light"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Counter */}
      <p className="absolute top-20 left-1/2 -translate-x-1/2 font-sans text-[10px] tracking-[2px] uppercase text-white/40 leading-10">
        {index + 1} / {images.length}
      </p>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 md:left-8 text-white/50 hover:text-white text-3xl transition-colors z-10 p-4"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 md:right-8 text-white/50 hover:text-white text-3xl transition-colors z-10 p-4"
          aria-label="Next image"
        >
          ›
        </button>
      )}
    </div>
  )
}
