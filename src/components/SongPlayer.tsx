'use client'

import { useState, useEffect, useRef } from 'react'
import { SongData } from '@/data/songs'

interface SongPlayerProps {
  song: SongData
}

export default function SongPlayer({ song }: SongPlayerProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lyricsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress(p => {
          const next = p + 1
          const lineIndex = song.lyrics.findLastIndex(l => l.time <= next)
          if (lineIndex >= 0 && lineIndex !== currentLine) setCurrentLine(lineIndex)
          return next > 100 ? 0 : next
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPlaying, song.lyrics, currentLine])

  useEffect(() => {
    if (lyricsRef.current) {
      const active = lyricsRef.current.querySelector('.text-pink-600')
      active?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentLine])

  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-2xl shadow-md">
          {song.emoji}
        </div>
        <div>
          <div className="text-xl font-bold">{song.title}</div>
          <div className="text-sm text-gray-400">{song.category} · {song.duration}</div>
        </div>
      </div>

      <div ref={lyricsRef} className="bg-gray-50 rounded-2xl p-5 h-56 overflow-y-auto mb-4 flex flex-col justify-center">
        {song.lyrics.map((line, i) => (
          <div key={i} className={`py-1.5 transition-all duration-300 ${
            i === currentLine ? 'text-xl font-bold text-pink-600' :
            i < currentLine ? 'text-sm text-gray-300' : 'text-sm text-gray-500'
          }`}>
            {line.text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-400">{Math.floor(progress / 60)}:{String(progress % 60).padStart(2, '0')}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-pink-500 rounded-full relative" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full shadow-md" />
          </div>
        </div>
        <span className="text-xs text-gray-400">{song.duration}</span>
      </div>

      <div className="flex justify-center items-center gap-10">
        <button className="text-2xl text-gray-400">⏮</button>
        <button onClick={togglePlay}
          className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg active:scale-95 transition-transform">
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="text-2xl text-gray-400">⏭</button>
      </div>
    </div>
  )
}
