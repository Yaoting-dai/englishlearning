'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useAgeLevel } from '@/contexts/AgeLevelContext'
import StartButton from '@/components/StartButton'
import ChatBubble from '@/components/ChatBubble'
import { useSpeech } from '@/hooks/useSpeech'
import { sendMessage } from '@/services/doubao-api'

interface Message {
  text: string
  sender: 'ai' | 'user'
}

export default function AIChatPage() {
  const { info, level } = useAgeLevel()
  const { speak, stop } = useSpeech()
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const speakingRef = useRef(false)

  const addMessage = useCallback((text: string, sender: 'ai' | 'user') => {
    setMessages(prev => [...prev, { text, sender }])
  }, [])

  // Start speech recognition
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      recognitionRef.current = null
      setIsListening(false)
      handleUserSpeech(transcript)
    }

    recognition.onerror = () => {
      recognitionRef.current = null
      setIsListening(false)
    }

    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [])

  // Stop speech recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  // Handle user voice input
  const handleUserSpeech = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    stopListening()
    addMessage(text, 'user')
    setIsLoading(true)
    try {
      const reply = await sendMessage([{ role: 'user', content: text }], level)
      addMessage(reply, 'ai')
      // Speak AI reply, then listen again
      speakingRef.current = true
      speak(reply, undefined, () => {
        speakingRef.current = false
        if (started) startListening()
      })
    } catch {
      const fallback = "That's great! Tell me more! 😊"
      addMessage(fallback, 'ai')
      speak(fallback, undefined, () => {
        speakingRef.current = false
        if (started) startListening()
      })
    }
    setIsLoading(false)
  }, [isLoading, level, speak, addMessage, startListening, stopListening, started])

  const handleStart = () => {
    setStarted(true)
    const greeting = "Hi there! I'm Elizabeth! Let's learn English together! 🎉"
    addMessage(greeting, 'ai')
    speakingRef.current = true
    speak(greeting, undefined, () => {
      speakingRef.current = false
      startListening()
    })
  }

  const handleStop = () => {
    stop()
    stopListening()
    speakingRef.current = false
    setStarted(false)
    setMessages([])
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop()
      stopListening()
    }
  }, [stop, stopListening])

  const speakMessage = (text: string) => speak(text)

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-gray-600">🤖 Elizabeth · {info.label}</span>
      </div>

      {!started ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Image src="/images/teacher.png" alt="Elizabeth" width={160} height={160}
            className="rounded-full object-cover shadow-xl mb-4" />
          <div className="text-2xl font-bold text-blue-700">Elizabeth</div>
          <div className="text-base text-gray-400 mt-1">Your AI English Teacher</div>
          <div className="text-sm text-gray-400 mt-4 text-center max-w-xs">
            🎤 Voice conversation · Speak and I&apos;ll reply!
          </div>
          <div className="mt-8">
            <StartButton onClick={handleStart} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* Header with stop button */}
          <div className="flex justify-end mb-2">
            <button onClick={handleStop}
              className="text-xs text-red-500 border border-red-200 rounded-full px-3 py-1 hover:bg-red-50">
              ✕ End Class
            </button>
          </div>

          {/* Messages */}
          <div className="min-h-[400px] max-h-[450px] overflow-y-auto mb-4">
            {messages.map((m, i) => (
              <div key={i} onClick={() => m.sender === 'ai' && speakMessage(m.text)}
                className={m.sender === 'ai' ? 'cursor-pointer' : ''}>
                <ChatBubble message={m.text} sender={m.sender} />
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-gray-400 py-2">
                <span className="animate-pulse">Elizabeth is thinking...</span>
              </div>
            )}
          </div>

          {/* Voice status */}
          <div className="border-t border-gray-100 pt-3 text-center">
            {isListening ? (
              <div className="flex items-center justify-center gap-2 text-blue-500">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                <span className="text-sm font-medium">🎤 Listening... Speak now</span>
              </div>
            ) : isLoading ? (
              <div className="text-sm text-gray-400">⏳ Waiting for Elizabeth...</div>
            ) : (
              <div className="text-sm text-gray-400">💬 Elizabeth is listening for you</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
