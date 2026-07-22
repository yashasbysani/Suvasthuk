'use client'

import {
  PenTool, Sofa, HardHat, Columns2, Compass,
  Hammer, Trees, Map, FileCheck, Building2,
  Home, PackageCheck, ClipboardList, School,
} from 'lucide-react'

const ICONS: Record<string, typeof PenTool> = {
  PenTool, Sofa, HardHat, Columns2, Compass,
  Hammer, Trees, Map, FileCheck, Building2,
  Home, PackageCheck, ClipboardList, School,
}

export default function ServiceIcon({ name, className = '' }: { name: string; className?: string }) {
  const Icon = ICONS[name]
  if (!Icon) return null
  return <Icon size={22} strokeWidth={1.5} className={className} />
}
