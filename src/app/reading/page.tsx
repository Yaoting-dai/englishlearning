'use client'

import Link from 'next/link'
import { readingArticles } from '@/data/reading'
import { useAgeLevel } from '@/contexts/AgeLevelContext'
import { useProgress } from '@/hooks/useProgress'

export default function ReadingPage() {
  const { level } = useAgeLevel()
  const { progress } = useProgress()
  const filtered = readingArticles.filter(a => a.level === level)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📖 美文阅读</h1>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-4">📚</div>
          <p>当前阶段暂无文章</p>
          <p className="text-sm mt-2">去设置页切换学习阶段</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(article => {
            const isRead = progress.readArticles.includes(article.id)
            return (
              <Link key={article.id} href={`/reading/${article.id}`}
                className={`flex items-center gap-5 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${
                  isRead ? 'bg-green-50' : 'bg-gradient-to-r from-blue-100 to-blue-50'
                }`}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-md shrink-0">
                  {article.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg truncate">{article.title}</div>
                  <div className="text-sm text-gray-400 mt-1">{article.category} · {article.wordCount} words</div>
                </div>
                <div className="flex items-center gap-2">
                  {isRead && <span className="text-green-500 text-sm">✅</span>}
                  <span className="text-gray-400 text-xl">▸</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
