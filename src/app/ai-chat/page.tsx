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
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [speechError, setSpeechError] = useState('')
  const recognitionRef = useRef<any>(null)
  const readyForInputRef = useRef(false)

  const speechSupported = typeof window !== 'undefined' && (!!((window as any).SpeechRecognition) || !!((window as any).webkitSpeechRecognition))
  const messagesRef = useRef<Message[]>([])

  const addMessage = useCallback((text: string, sender: 'ai' | 'user') => {
    const newMsg = { text, sender }
    messagesRef.current = [...messagesRef.current, newMsg]
    setMessages(prev => [...prev, newMsg])
  }, [])

  // Handle user voice input
  const handleUserSpeech = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    addMessage(text.trim(), 'user')
    setIsLoading(true)
    readyForInputRef.current = false
    try {
      // Build full conversation history for the API
      const apiMessages = messagesRef.current.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text,
      }))
      const reply = await sendMessage(apiMessages, level)
      addMessage(reply, 'ai')
      setAiSpeaking(true)
      speak(reply, undefined, () => {
        setAiSpeaking(false)
        readyForInputRef.current = true
      })
    } catch {
      const fallback = "That's great! Tell me more! 😊"
      addMessage(fallback, 'ai')
      setAiSpeaking(true)
      speak(fallback, undefined, () => {
        setAiSpeaking(false)
        readyForInputRef.current = true
      })
    }
    setIsLoading(false)
  }, [isLoading, level, speak, addMessage])

  // Start speech recognition (triggered by user tap)
  const startListening = useCallback(() => {
    if (isListening || isLoading) return
    setSpeechError('')
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      if (result.isFinal) {
        const transcript = result[0].transcript
        if (transcript.trim()) {
          recognitionRef.current = null
          setIsListening(false)
          handleUserSpeech(transcript.trim())
        }
      }
    }

    recognition.onerror = () => {
      recognitionRef.current = null
      setIsListening(false)
      setSpeechError('语音识别失败，请重试')
    }

    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setIsListening(true)
      // Timeout: auto-stop after 15s to prevent getting stuck on iOS
      setTimeout(() => {
        if (recognitionRef.current === recognition) {
          try { recognition.abort() } catch {}
          recognitionRef.current = null
          setIsListening(false)
          setSpeechError('语音识别超时，请重试')
        }
      }, 15000)
    } catch {
      setIsListening(false)
      setSpeechError('语音识别启动失败')
    }
  }, [isListening, isLoading, handleUserSpeech])

  // Stop speech recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch {}
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const handleStart = () => {
    setStarted(true)
    readyForInputRef.current = false
    const greeting = "Hi there! I'm Elizabeth! Let's learn English together! 🎉"
    addMessage(greeting, 'ai')
    setAiSpeaking(true)
    speak(greeting, undefined, () => {
      setAiSpeaking(false)
      readyForInputRef.current = true
    })
  }

  const handleStop = () => {
    stop()
    stopListening()
    setAiSpeaking(false)
    readyForInputRef.current = false
    setStarted(false)
    setMessages([])
    messagesRef.current = []
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
            {speechSupported ? '🎤 Tap the mic to speak, Elizabeth will reply!' : '💬 Type a message, Elizabeth will reply!'}
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

          {/* Input area */}
          <div className="border-t border-gray-100 pt-3 text-center">
            {speechError && (
              <p className="text-xs text-red-500 mb-2">{speechError}</p>
            )}
            {isListening ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-3xl text-white">🎤</span>
                </div>
                <span className="text-sm text-red-500 font-medium">Listening...</span>
              </div>
            ) : isLoading ? (
              <div className="text-sm text-gray-400 py-4">⏳ Waiting for Elizabeth...</div>
            ) : aiSpeaking ? (
              <div className="text-sm text-gray-400 py-4">🔊 Elizabeth is speaking...</div>
            ) : speechSupported ? (
              <button onClick={startListening}
                className="flex flex-col items-center gap-2 mx-auto active:scale-95 transition-transform">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600">
                  <span className="text-3xl text-white">🎤</span>
                </div>
                <span className="text-sm text-blue-500 font-medium">Tap to speak</span>
              </button>
            ) : (
              <p className="text-sm text-gray-400 py-4">Speech not supported in this browser</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
