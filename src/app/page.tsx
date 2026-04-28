'use client'

import Link from 'next/link'
import { useAgeLevel } from '@/contexts/AgeLevelContext'
import Image from 'next/image'
import { useProgress } from '@/hooks/useProgress'
import { letters } from '@/data/letters'
import { wordCategories } from '@/data/words'

export default function Home() {
  const { info } = useAgeLevel()
  const { progress } = useProgress()

  const letterPct = Math.round((progress.learnedLetters.length / letters.length) * 100)
  const totalWords = wordCategories.reduce((sum, c) => sum + c.words.length, 0)
  const wordPct = Math.round((progress.learnedWords.length / totalWords) * 100)

  const modules = [
    { href: '/letters', emoji: '🔤', title: '字母认读', color: 'bg-green-100', desc: 'A-Z', pct: letterPct },
    { href: '/phonetics', emoji: '🔊', title: '音标认读', color: 'bg-pink-100', desc: 'Pronunciation', pct: 0 },
    { href: '/words', emoji: '📖', title: '单词跟读', color: 'bg-blue-100', desc: 'Vocabulary', pct: wordPct },
    { href: '/songs', emoji: '🎵', title: '儿歌', color: 'bg-orange-100', desc: 'Nursery Rhymes', pct: 0 },
    { href: '/reading', emoji: '📚', title: '美文阅读', color: 'bg-purple-100', desc: 'Reading', pct: 0 },
    { href: '/ai-chat', emoji: '🤖', title: 'AI 老师', color: 'bg-indigo-100', desc: 'Elizabeth', pct: 0 },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-2xl shadow-sm">
        <Image src={info.image} alt={info.label} width={60} height={60}
          className="rounded-xl object-cover" />
        <div>
          <div className="text-xl font-bold">{info.emoji} {info.label}</div>
          <div className="text-sm text-gray-500">{info.age}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {modules.map(m => (
          <Link key={m.href} href={m.href}
            className={`${m.color} rounded-2xl p-5 text-center hover:shadow-md transition-shadow relative`}>
            <div className="text-4xl mb-2">{m.emoji}</div>
            <div className="font-bold text-lg">{m.title}</div>
            <div className="text-sm text-gray-500 mt-1">{m.desc}</div>
            {m.pct > 0 && (
              <div className="mt-2">
                <div className="w-full h-1.5 bg-white/60 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
                <div className="text-xs text-green-600 mt-0.5">{m.pct}%</div>
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/games/word-match"
          className="flex items-center gap-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-yellow-200">
          <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl">🖼️</div>
          <div className="flex-1">
            <div className="font-bold text-lg">🎮 单词游戏</div>
            <div className="text-sm text-gray-500">看图选词 · 玩中学</div>
          </div>
          <div className="text-yellow-600 text-xl">▶</div>
        </Link>
      </div>
    </div>
  )
}
