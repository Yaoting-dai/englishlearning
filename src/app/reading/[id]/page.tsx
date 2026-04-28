import { readingArticles } from '@/data/reading'
import ReadingDetailClient from './client'

export function generateStaticParams() {
  return readingArticles.map(a => ({ id: a.id }))
}

export default function ReadingDetailPage() {
  return <ReadingDetailClient />
}
