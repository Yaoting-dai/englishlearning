'use client'

import { useState } from 'react'
import { letters } from '@/data/letters'
import SwipeableCard from '@/components/SwipeableCard'
import BigButton from '@/components/BigButton'
import { useSpeech } from '@/hooks/useSpeech'
import { useProgress } from '@/hooks/useProgress'

export default function LettersPage() {
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState('')
  const letter = letters[index]
  const { speak } = useSpeech()
  const { progress, markLetterLearned } = useProgress()

  const goTo = (i: number) => {
    if (i >= 0 && i < letters.length) setIndex(i)
  }

  const handleSpeak = () => {
    setFeedback('')
    speak(letter.upper)
    markLetterLearned(letter.id)
    setTimeout(() => speak(letter.word), 1200)
  }

  const handleRepeat = () => {
    speak(letter.word)
    markLetterLearned(letter.id)
    setFeedback('🎤 请跟读...')
    setTimeout(() => setFeedback(''), 1500)
  }

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-gray-600">
          🔤 字母认读 · {index + 1}/{letters.length}
        </span>
        <span className="ml-3 text-sm text-green-600">
          ✅ {progress.learnedLetters.length} 已学
        </span>
      </div>

      <SwipeableCard onSwipeLeft={() => goTo(index + 1)} onSwipeRight={() => goTo(index - 1)}>
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-8 mx-2 shadow-md">
          <div className="text-center">
            <div className="text-7xl font-bold text-orange-700 leading-none">{letter.upper}</div>
            <div className="text-3xl font-bold text-orange-500 mt-1">{letter.lower}</div>
            <div className="text-base text-gray-500 mt-2">{letter.phonetic}</div>
            <div className="flex items-center justify-center gap-3 mt-5 bg-white/60 rounded-2xl p-4 mx-4">
              <span className="text-5xl shrink-0">{letter.emoji}</span>
              <div className="text-left min-w-0">
                <div className="text-2xl font-bold break-words">{letter.word}</div>
                <div className="text-sm text-gray-500 break-words">{letter.phonetic}</div>
              </div>
            </div>
          </div>
        </div>
      </SwipeableCard>

      <div className="flex justify-center gap-6 mt-5">
        <BigButton icon="◀" label="上一个" color="bg-gray-300" onClick={() => goTo(index - 1)} />
        <BigButton icon="🔊" label="发音" color="bg-green-500" onClick={handleSpeak} />
        <BigButton icon="🎤" label="跟读" color="bg-blue-500" onClick={handleRepeat} />
        <BigButton icon="▶" label="下一个" color="bg-gray-300" onClick={() => goTo(index + 1)} />
      </div>

      {feedback && (
        <div className="text-center py-3 text-blue-500 font-medium animate-pulse">{feedback}</div>
      )}

      <div className="flex justify-center gap-1.5 mt-5 flex-wrap">
        {letters.map((l, i) => (
          <div key={l.id}
            className={`rounded-full transition-all ${
              progress.learnedLetters.includes(l.id)
                ? 'w-3 h-3 bg-green-400'
                : i === index
                  ? 'w-3 h-3 bg-pink-500'
                  : 'w-2 h-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
