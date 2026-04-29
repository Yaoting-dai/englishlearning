'use client'

import { useState, useCallback, useRef } from 'react'

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
  const evaluatingRef = useRef(false)

  const evaluate = useCallback(async (word: string): Promise<PronunciationResult | null> => {
    if (evaluatingRef.current) return null
    evaluatingRef.current = true
    setIsEvaluating(true)
    setResult(null)

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      evaluatingRef.current = false
      setIsEvaluating(false)
      return null
    }

    return new Promise((resolve) => {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false

      let settled = false
      const finish = (res: PronunciationResult | null) => {
        if (settled) return
        settled = true
        evaluatingRef.current = false
        setIsEvaluating(false)
        if (res) setResult(res)
        resolve(res)
      }

      recognition.onresult = (event: any) => {
        const spoken = (event.results[0][0].transcript || '').toLowerCase().trim()
        const target = word.toLowerCase()

        const isCorrect = spoken === target || spoken.includes(target) || target.includes(spoken)
        const score = isCorrect ? 85 + Math.floor(Math.random() * 15) : 40 + Math.floor(Math.random() * 30)

        const phonemes: PhonemeScore[] = target.split('').map((ch) => ({
          phoneme: ch,
          status: (isCorrect ? 'correct' : 'incorrect') as 'correct' | 'incorrect',
        }))

        finish({ score, phonemes })
      }

      recognition.onerror = () => finish(null)
      recognition.onend = () => finish(null)

      setTimeout(() => {
        try { recognition.abort() } catch {}
        finish(null)
      }, 5000)

      recognition.start()
    })
  }, [])

  const clearResult = useCallback(() => setResult(null), [])

  return { result, isEvaluating, evaluate, clearResult }
}
