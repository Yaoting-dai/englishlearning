'use client'

import { useCallback } from 'react'
import { useAgeLevel } from '@/contexts/AgeLevelContext'

export function useSpeech() {
  const { level } = useAgeLevel()

  const speak = useCallback((text: string, rate?: number, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported')
      onEnd?.()
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    // Child-friendly voice: warm, clear, and engaging
    utterance.rate = rate ?? (level === 'kindergarten' ? 0.75 : level === 'elementary' ? 0.85 : 0.95)
    utterance.pitch = level === 'kindergarten' ? 1.7 : level === 'elementary' ? 1.5 : 1.3
    // Find Karen voice (user preference), with fallbacks
    const voices = window.speechSynthesis.getVoices()
    const karenVoice = voices.find(v => v.name.includes('Karen'))
      || voices.find(v => ['Samantha', 'Flo', 'Kathy', 'Sandy', 'Shelley', 'Ava', 'Allison'].some(n => v.name.includes(n)))
      || voices.find(v => v.lang.startsWith('en-US'))
    if (karenVoice) utterance.voice = karenVoice
    if (onEnd) utterance.onend = onEnd
    window.speechSynthesis.speak(utterance)
  }, [level])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { speak, stop }
}
