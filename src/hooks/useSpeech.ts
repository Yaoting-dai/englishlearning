'use client'

import { useCallback } from 'react'
import { useAgeLevel } from '@/contexts/AgeLevelContext'
import { getSavedVoice } from '@/data/voices'

export function useSpeech() {
  const { level } = useAgeLevel()

  // Strip emojis so they aren't read aloud by TTS
  const stripEmojis = (str: string) =>
    str.replace(/[\u2700-\u27BF\u2600-\u26FF\u2300-\u23FF\u2B50\u2B55\u3030\u303D\u3297\u3299]|[\uD83C][\uDC00-\uDFFF]|[\uD83D][\uDC00-\uDFFF]|[\uD83E][\uDC00-\uDFFF]/g, '').trim()

  const speak = useCallback((text: string, rate?: number, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported')
      onEnd?.()
      return
    }
    window.speechSynthesis.cancel()

    // Track whether onEnd has been called (prevents duplicate calls)
    let ended = false
    const endOnce = () => {
      if (ended) return
      ended = true
      clearInterval(pollId)
      clearTimeout(fallbackTimer)
      onEnd?.()
    }

    const cleanText = stripEmojis(text)
    if (!cleanText) {
      endOnce()
      return
    }
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    // Child-friendly voice: warm, clear, and engaging
    utterance.rate = rate ?? (level === 'kindergarten' ? 0.75 : level === 'elementary' ? 0.85 : 0.95)
    utterance.pitch = level === 'kindergarten' ? 1.7 : level === 'elementary' ? 1.5 : 1.3
    // Use saved voice preference, with fallbacks
    const voices = window.speechSynthesis.getVoices()
    const saved = getSavedVoice()
    const preferred = saved
      ? voices.find(v => v.name.includes(saved))
      : null
    const matched = preferred
      || voices.find(v => v.name.includes('Samantha'))
      || voices.find(v => ['Flo', 'Karen', 'Kathy', 'Sandy', 'Shelley', 'Ava', 'Allison'].some(n => v.name.includes(n)))
      || voices.find(v => v.lang.startsWith('en-US'))
    if (matched) utterance.voice = matched
    utterance.onend = endOnce
    window.speechSynthesis.speak(utterance)

    // Poll speechSynthesis.speaking as fallback (onend is unreliable on iOS Safari)
    const pollId = setInterval(() => {
      if (!window.speechSynthesis.speaking && !ended) {
        endOnce()
      }
    }, 300)

    // Hard timeout fallback: estimate max duration + 5s buffer
    const estimatedMs = Math.max(text.length * 80, 5000) + 5000
    const fallbackTimer = setTimeout(() => {
      if (!ended) {
        window.speechSynthesis.cancel()
        endOnce()
      }
    }, estimatedMs)
  }, [level])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { speak, stop }
}
