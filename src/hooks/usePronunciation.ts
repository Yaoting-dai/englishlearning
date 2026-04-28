'use client'

import { useState, useCallback } from 'react'

export interface PhonemeScore {
  phoneme: string
  status: 'correct' | 'needs-work' | 'incorrect'
}

export interface PronunciationResult {
  score: number
  phonemes: PhonemeScore[]
}

export function usePronunciation() {
  const [result, setResult] = useState<PronunciationResult | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const evaluate = useCallback(async (_word: string) => {
    setIsEvaluating(true)
    // Mock: simulate Azure Pronunciation Assessment
    await new Promise(resolve => setTimeout(resolve, 800))
    const mockResult: PronunciationResult = {
      score: Math.floor(Math.random() * 40) + 60, // 60-99
      phonemes: [
        { phoneme: _word[0]?.toLowerCase() || '', status: 'correct' },
        { phoneme: _word[1]?.toLowerCase() || '', status: Math.random() > 0.5 ? 'correct' : 'needs-work' },
        { phoneme: _word[2]?.toLowerCase() || '', status: Math.random() > 0.7 ? 'correct' : 'incorrect' },
      ],
    }
    setResult(mockResult)
    setIsEvaluating(false)
    return mockResult
  }, [])

  const clearResult = useCallback(() => setResult(null), [])

  return { result, isEvaluating, evaluate, clearResult }
}
