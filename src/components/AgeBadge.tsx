'use client'

import { useAgeLevel } from '@/contexts/AgeLevelContext'
import Image from 'next/image'

export default function AgeBadge() {
  const { info } = useAgeLevel()
  return (
    <div className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1 shadow-sm">
      <Image src={info.image} alt={info.label} width={24} height={24} className="rounded-full object-cover" />
      <span className="text-sm font-medium">{info.emoji} {info.label}</span>
    </div>
  )
}
