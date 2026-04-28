'use client'

import { useParams } from 'next/navigation'
import { songs } from '@/data/songs'
import SongPlayer from '@/components/SongPlayer'
import Link from 'next/link'

export default function SongClient() {
  const params = useParams()
  const song = songs.find(s => s.id === params.id)

  if (!song) return (
    <div className="p-4 text-center">
      <p>Song not found</p>
      <Link href="/songs" className="text-blue-500 mt-4 block">◀ Back to songs</Link>
    </div>
  )

  return (
    <div className="p-4">
      <Link href="/songs" className="text-gray-400 text-sm mb-4 block">◀ 返回列表</Link>
      <SongPlayer song={song} />
    </div>
  )
}
