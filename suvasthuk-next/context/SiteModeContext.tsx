'use client'

import { createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'

export type SiteMode = 'architecture' | 'construction'

const SiteModeContext = createContext<SiteMode>('architecture')

export function SiteModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const mode: SiteMode = pathname.startsWith('/construction') ? 'construction' : 'architecture'
  return (
    <SiteModeContext.Provider value={mode}>
      {children}
    </SiteModeContext.Provider>
  )
}

export const useSiteMode = () => useContext(SiteModeContext)
