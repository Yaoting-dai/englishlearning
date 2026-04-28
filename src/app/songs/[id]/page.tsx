import { songs } from '@/data/songs'
import SongClient from './client'

export function generateStaticParams() {
  return songs.map(s => ({ id: s.id }))
}

export default function SongPage() {
  return <SongClient />
}
