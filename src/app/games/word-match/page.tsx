'use client'

import { useAgeLevel } from '@/contexts/AgeLevelContext'
import WordMatchGame from '@/components/WordMatchGame'
import Link from 'next/link'

export default function WordMatchPage() {
  const { info } = useAgeLevel()

  return (
    <div className="p-4">
      <Link href="/words" className="text-gray-400 text-sm mb-4 block">◀ 返回单词</Link>
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">🖼️ 看图选词</h1>
        <p className="text-sm text-gray-400 mt-1">{info.label} · 看图片选出正确的单词</p>
      </div>
      <WordMatchGame />
    </div>
  )
}
