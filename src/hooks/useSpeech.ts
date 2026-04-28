'use client'

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
    // Child-like voice: higher pitch, slower rate
    utterance.rate = rate ?? (level === 'kindergarten' ? 0.75 : level === 'elementary' ? 0.85 : 0.95)
    utterance.pitch = level === 'kindergarten' ? 1.6 : level === 'elementary' ? 1.4 : 1.2
    // Find a female/child English voice
    const voices = window.speechSynthesis.getVoices()
    const childVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('female'))
      || voices.find(v => v.lang.startsWith('en-US'))
    if (childVoice) utterance.voice = childVoice
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
