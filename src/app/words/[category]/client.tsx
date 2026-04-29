'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { wordCategories } from '@/data/words'
import SwipeableCard from '@/components/SwipeableCard'
import BigButton from '@/components/BigButton'
import PronunciationResult from '@/components/PronunciationResult'
import Link from 'next/link'
import { useSpeech } from '@/hooks/useSpeech'
import { usePronunciation } from '@/hooks/usePronunciation'
import { useProgress } from '@/hooks/useProgress'
import Celebration from '@/components/Celebration'

export default function WordCategoryClient() {
  const params = useParams()
  const category = wordCategories.find(c => c.id === params.category)
  const [index, setIndex] = useState(0)
  const { speak } = useSpeech()
  const { result, isEvaluating, evaluate, clearResult } = usePronunciation()
  const [showResult, setShowResult] = useState(false)
  const { progress, markWordLearned } = useProgress()
  const [showCelebration, setShowCelebration] = useState(false)

  const learnedCount = category ? category.words.filter(w => progress.learnedWords.includes(w.word)).length : 0
  const allLearned = category && learnedCount === category.words.length && learnedCount > 0

  useEffect(() => {
    if (allLearned) {
      const timer = setTimeout(() => setShowCelebration(true), 500)
      return () => clearTimeout(timer)
    }
  }, [allLearned])

  if (!category) return <div className="p-4">Category not found</div>

  const word = category.words[index]

  const goTo = (i: number) => {
    if (i >= 0 && i < category.words.length) {
      setIndex(i)
      setShowResult(false)
      clearResult()
    }
  }

  const handleListen = () => {
    speak(word.word, 0.8)
    markWordLearned(word.word)
  }

  const handleRecord = async () => {
    setShowResult(true)
    const r = await evaluate(word.word)
    if (r && r.score >= 70) markWordLearned(word.word)
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/words" className="text-gray-400">◀</Link>
        <span className="text-lg font-semibold">{category.emoji} {category.name} · {index + 1}/{category.words.length}</span>
        <span className="ml-auto text-sm text-green-600">✅ {learnedCount}/{category.words.length}</span>
      </div>

      <SwipeableCard onSwipeLeft={() => goTo(index + 1)} onSwipeRight={() => goTo(index - 1)}>
        <div className="text-center">
          <div className="w-44 h-44 bg-orange-50 rounded-3xl flex items-center justify-center text-7xl mx-auto shadow-sm">
            {word.emoji}
          </div>
          <div className="text-5xl font-bold mt-4 tracking-wider">{word.word}</div>
          <div className="text-lg text-gray-400 mt-1">{word.phonetic}</div>
          {progress.learnedWords.includes(word.word) && (
            <div className="text-green-500 text-sm mt-2">✅ 已掌握</div>
          )}
        </div>
      </SwipeableCard>

      <div className="flex justify-center gap-8 mt-6">
        <BigButton icon="🔊" label="听发音" color="bg-green-500" onClick={handleListen} />
        <BigButton icon="🎤" label="跟读" color="bg-blue-500" onClick={handleRecord} />
      </div>

      {isEvaluating && (
        <div className="text-center py-4 text-gray-500">🎤 正在评测...</div>
      )}

      {showResult && result && !isEvaluating && (
        <PronunciationResult score={result.score} phonemes={result.phonemes} />
      )}

      <div className="flex justify-between mt-6 text-gray-400">
        <button onClick={() => goTo(index - 1)} disabled={index === 0}
          className={index === 0 ? 'opacity-30' : ''}>◀ 上一个</button>
        <button onClick={() => goTo(index + 1)} disabled={index === category.words.length - 1}
          className={`font-bold ${index === category.words.length - 1 ? 'opacity-30 text-gray-400' : 'text-green-600'}`}>下一个 ▶</button>
      </div>

      <Celebration show={showCelebration} title={`你已掌握${category.name}的全部单词！`} emoji={category.emoji} onClose={() => setShowCelebration(false)} />
    </div>
  )
}
