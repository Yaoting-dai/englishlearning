'use client'

import { useCallback } from 'react'
import { useAgeLevel } from '@/contexts/AgeLevelContext'
import { getSavedVoice } from '@/data/voices'

export function useSpeech() {
  const { level } = useAgeLevel()

  // Strip emojis so they aren't read aloud by TTS
  const stripEmojis = (str: string) =>
    str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu, '').trim()

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
