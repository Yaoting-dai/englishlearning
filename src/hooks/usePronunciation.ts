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

  const evaluate = useCallback(async (word: string): Promise<PronunciationResult | null> => {
    setIsEvaluating(true)
    setResult(null)

    // Use Web Speech API for actual speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsEvaluating(false)
      return null
    }

    return new Promise((resolve) => {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event: any) => {
        const spoken = (event.results[0][0].transcript || '').toLowerCase().trim()
        const target = word.toLowerCase()

        // Simple comparison: check if spoken word matches target
        const isCorrect = spoken === target || spoken.includes(target) || target.includes(spoken)
        const score = isCorrect ? 85 + Math.floor(Math.random() * 15) : 40 + Math.floor(Math.random() * 30)

        // Generate per-letter phoneme scores
        const phonemes: PhonemeScore[] = target.split('').map((ch, i) => ({
          phoneme: ch,
          status: isCorrect && i < target.length / 2
            ? ('correct' as const)
            : isCorrect
              ? ('correct' as const)
              : i === 0
                ? ('correct' as const)
                : (['needs-work', 'incorrect'] as const)[Math.floor(Math.random() * 2)],
        }))

        const res: PronunciationResult = { score, phonemes }
        setResult(res)
        setIsEvaluating(false)
        resolve(res)
      }

      recognition.onerror = () => {
        setIsEvaluating(false)
        resolve(null)
      }

      recognition.onend = () => {
        setIsEvaluating(false)
      }

      // Timeout after 5 seconds
      setTimeout(() => {
        try { recognition.abort() } catch {}
        if (isEvaluating) {
          setIsEvaluating(false)
          resolve(null)
        }
      }, 5000)

      recognition.start()
    })
  }, [isEvaluating])

  const clearResult = useCallback(() => setResult(null), [])

  return { result, isEvaluating, evaluate, clearResult }
}
