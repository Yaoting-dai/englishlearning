'use client'

import Link from 'next/link'
import { wordCategories } from '@/data/words'

export default function WordsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📖 单词跟读</h1>
      <Link href="/games/word-match"
        className="flex items-center gap-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl p-4 mb-5 shadow-sm hover:shadow-md transition-shadow border border-yellow-200">
        <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl">🖼️</div>
        <div className="flex-1">
          <div className="font-bold text-lg">看图选词</div>
          <div className="text-sm text-gray-500">看图片选出正确的单词</div>
        </div>
        <div className="text-yellow-600 text-xl">▶</div>
      </Link>
      <div className="grid grid-cols-2 gap-4">
        {wordCategories.map(cat => (
          <Link key={cat.id} href={`/words/${cat.id}`}
            className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-6xl mb-2">{cat.emoji}</div>
            <div className="font-bold text-lg">{cat.name}</div>
            <div className="text-sm text-gray-500 mt-1">{cat.words.length} words</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
