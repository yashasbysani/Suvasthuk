export default function PhotoCountBadge({ count }: { count?: number }) {
  if (!count || count < 1) return null

  return (
    <span className="absolute bottom-3 right-3 z-10 font-sans text-[9px] tracking-[1px] uppercase text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
      {count} {count === 1 ? 'Photo' : 'Photos'}
    </span>
  )
}
