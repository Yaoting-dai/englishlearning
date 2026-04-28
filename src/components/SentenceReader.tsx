'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import BigButton from './BigButton'
import { useSpeech } from '@/hooks/useSpeech'

interface SentenceReaderProps {
  sentences: string[]
  title: string
  onComplete?: () => void
}

export default function SentenceReader({ sentences, title, onComplete }: SentenceReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showTranslation, setShowTranslation] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { speak, stop } = useSpeech()

  const speakSentence = useCallback((index: number) => {
    if (index < sentences.length) {
      setIsSpeaking(true)
      speak(sentences[index], 0.8)
    }
  }, [sentences, speak])

  useEffect(() => {
    if (isReading) {
      speakSentence(0)
      const timer = setInterval(() => {
        setCurrentIndex(i => {
          const next = i + 1
          if (next >= sentences.length) { clearInterval(timer); setIsReading(false); setIsSpeaking(false); onComplete?.(); return i }
          speakSentence(next)
          return next
        })
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [isReading, sentences.length, speakSentence, onComplete])

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current.children[currentIndex] as HTMLElement
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentIndex])

  return (
    <div>
      <div className="flex justify-center gap-6 mb-5">
        <BigButton icon="🔊" label={isReading ? '⏸ 暂停' : '朗读'} color="bg-green-500" onClick={() => {
          if (isReading) { setIsReading(false); stop() }
          else { setCurrentIndex(0); setIsReading(true) }
        }} />
        <BigButton icon="🎤" label="跟读" color="bg-blue-500" onClick={() => speak(sentences[currentIndex] || sentences[0], 0.8)} />
      </div>

      <div ref={containerRef} className="bg-gray-50 rounded-2xl p-6 min-h-[300px] flex flex-col justify-center overflow-y-auto">
        {sentences.map((s, i) => (
          <div key={i} onClick={() => setShowTranslation(showTranslation === s ? null : s)}
            className={`py-2 transition-all duration-300 cursor-pointer select-none ${
              i === currentIndex ? 'text-2xl font-bold text-pink-600' :
              i < currentIndex ? 'text-base text-gray-300' : 'text-base text-gray-600'
            }`}>
            {s}
            {showTranslation === s && (
              <div className="text-sm text-gray-400 mt-1 bg-yellow-50 rounded-lg px-3 py-1">
                ✨ 点击查词功能即将上线
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4 text-gray-400 text-sm">
        <span>◀ 上一篇</span>
        <span>{currentIndex + 1} / {sentences.length}</span>
        <span className="text-green-600 font-bold">下一篇 ▶</span>
      </div>
    </div>
  )
}
