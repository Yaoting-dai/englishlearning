import { wordCategories } from '@/data/words'
import WordCategoryClient from './client'

export function generateStaticParams() {
  return wordCategories.map(c => ({ category: c.id }))
}

export default function WordCategoryPage() {
  return <WordCategoryClient />
}
