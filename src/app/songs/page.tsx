'use client'

import Link from 'next/link'
import { songs } from '@/data/songs'

export default function SongsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🎵 儿歌</h1>
      <div className="flex flex-col gap-4">
        {songs.map(song => (
          <Link key={song.id} href={`/songs/${song.id}`}
            className="flex items-center gap-5 bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-3xl shadow-md shrink-0">
              {song.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xl truncate">{song.title}</div>
              <div className="text-sm text-gray-400 mt-1">{song.category} · {song.duration}</div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-md shrink-0">▶</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
