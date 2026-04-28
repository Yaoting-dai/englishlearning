'use client'

import { useParams } from 'next/navigation'
import { readingArticles } from '@/data/reading'
import SentenceReader from '@/components/SentenceReader'
import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'

export default function ReadingDetailClient() {
  const params = useParams()
  const article = readingArticles.find(a => a.id === params.id)
  const { progress, markArticleRead } = useProgress()

  if (!article) return (
    <div className="p-4 text-center">
      <p>Article not found</p>
      <Link href="/reading" className="text-blue-500 mt-4 block">◀ Back to reading</Link>
    </div>
  )

  const isRead = progress.readArticles.includes(article.id)

  return (
    <div className="p-4">
      <Link href="/reading" className="text-gray-400 text-sm mb-4 block">◀ 返回列表</Link>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold">{article.emoji} {article.title}</h1>
        {isRead && <span className="text-green-500 text-sm">✅ 已读</span>}
      </div>
      <p className="text-sm text-gray-400 mb-4">{article.category} · {article.wordCount} words</p>
      <SentenceReader sentences={article.content} title={article.title}
        onComplete={() => markArticleRead(article.id)} />
    </div>
  )
}
