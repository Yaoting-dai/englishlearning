'use client'

import { useCallback } from 'react'
import { useAgeLevel } from '@/contexts/AgeLevelContext'

export function useSpeech() {
  const { level } = useAgeLevel()

  const speak = useCallback((text: string, rate?: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = rate ?? (level === 'kindergarten' ? 0.7 : level === 'elementary' ? 0.85 : 1.0)
    utterance.pitch = level === 'kindergarten' ? 1.2 : 1.0
    // Prefer English voice
    const voices = window.speechSynthesis.getVoices()
    const enVoice = voices.find(v => v.lang.startsWith('en-US'))
    if (enVoice) utterance.voice = enVoice
    window.speechSynthesis.speak(utterance)
  }, [level])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { speak, stop }
}
