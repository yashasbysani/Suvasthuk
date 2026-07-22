'use client'

import { usePathname, useRouter } from 'next/navigation'

function getParent(pathname: string): string {
  if (pathname.startsWith('/blog'))                     return '/'
  if (pathname.startsWith('/projects/'))                return '/projects'
  if (pathname.startsWith('/services/'))                return '/services'
  if (pathname.startsWith('/construction/projects/'))   return '/construction/projects'
  if (pathname.startsWith('/construction/'))            return '/construction'
  return '/'
}

export default function BackButton() {
  const pathname       = usePathname()
  const router         = useRouter()
  const isConstruction = pathname.startsWith('/construction')

  // Hide on both home pages
  if (pathname === '/' || pathname === '/construction') return null

  const colors = isConstruction
    ? 'text-sand/60 hover:text-sand'
    : 'text-brown-deep/50 hover:text-brown-deep'

  return (
    <div className="fixed top-16 left-0 z-40 pt-3 pl-6">
      <button
        onClick={() => router.push(getParent(pathname))}
        className={`flex items-center gap-2 font-sans text-[10px] tracking-[2px] uppercase transition-colors duration-200 ${colors}`}
      >
        <span className="text-base leading-none">←</span>
        <span>Back</span>
      </button>
    </div>
  )
}
