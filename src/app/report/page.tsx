'use client'

import { useProgress } from '@/hooks/useProgress'
import { letters } from '@/data/letters'
import { wordCategories } from '@/data/words'
import { readingArticles } from '@/data/reading'
import Link from 'next/link'

export default function ReportPage() {
  const { progress } = useProgress()

  const totalWords = wordCategories.reduce((sum, c) => sum + c.words.length, 0)
  const letterPct = Math.round((progress.learnedLetters.length / letters.length) * 100)
  const wordPct = Math.round((progress.learnedWords.length / totalWords) * 100)
  const readingPct = Math.round((progress.readArticles.length / readingArticles.length) * 100)
  const overall = Math.round((letterPct + wordPct + readingPct) / 3)

  const lastTime = progress.lastStudyTime
    ? new Date(progress.lastStudyTime).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '还没开始学习'

  const categoryStats = wordCategories.map(c => ({
    ...c,
    learned: c.words.filter(w => progress.learnedWords.includes(w.word)).length,
    pct: Math.round((c.words.filter(w => progress.learnedWords.includes(w.word)).length / c.words.length) * 100),
  }))

  return (
    <div className="p-4 pb-8">
      <h1 className="text-xl font-bold mb-5">📈 学习报告</h1>

      {/* Overall */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white mb-5 shadow-md">
        <div className="text-5xl font-bold text-center">{overall}%</div>
        <div className="text-center text-blue-200 mt-1">总完成度</div>
        <div className="flex justify-around mt-4 text-sm">
          <div className="text-center">
            <div className="text-xl font-bold">{progress.learnedLetters.length}/{letters.length}</div>
            <div className="text-blue-200">字母</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{progress.learnedWords.length}/{totalWords}</div>
            <div className="text-blue-200">单词</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{progress.readArticles.length}/{readingArticles.length}</div>
            <div className="text-blue-200">文章</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <div className="text-3xl">🔤</div>
          <div className="text-lg font-bold">{progress.learnedLetters.length}</div>
          <div className="text-xs text-gray-500">字母已学</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <div className="text-3xl">📖</div>
          <div className="text-lg font-bold">{progress.learnedWords.length}</div>
          <div className="text-xs text-gray-500">单词已学</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <div className="text-3xl">📚</div>
          <div className="text-lg font-bold">{progress.readArticles.length}</div>
          <div className="text-xs text-gray-500">文章已读</div>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 text-center">
          <div className="text-3xl">⏱️</div>
          <div className="text-lg font-bold">{progress.totalStudySessions}</div>
          <div className="text-xs text-gray-500">学习次数</div>
        </div>
      </div>

      {/* Last study time */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-sm text-gray-500">
        🕐 上次学习：{lastTime}
      </div>

      {/* Word category progress */}
      <h2 className="font-bold text-lg mb-3">📖 单词分类进度</h2>
      <div className="space-y-3 mb-5">
        {categoryStats.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{cat.emoji} {cat.name}</span>
              <span className="text-sm text-gray-500">{cat.learned}/{cat.words.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className={`h-full rounded-full transition-all ${
                cat.pct === 100 ? 'bg-green-500' : 'bg-blue-400'
              }`} style={{ width: `${cat.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <Link href="/" className="block text-center text-blue-500 font-medium">◀ 返回首页</Link>
    </div>
  )
}
