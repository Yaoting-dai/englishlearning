'use client'

import { useState, useCallback } from 'react'
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

const quickPhrases: Record<string, string[]> = {
  kindergarten: ['Hello!', 'My name is...', 'I like apples', 'Thank you!', 'Goodbye!'],
  elementary: ['How are you?', 'I like animals', 'Tell me a story', 'What is this?', 'Can you help me?'],
  middle: ['What do you think?', 'Tell me about your day', 'I have a question', 'Let\'s practice', 'Give me a challenge'],
}

export default function AIChatPage() {
  const { info, level } = useAgeLevel()
  const { speak } = useSpeech()
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = useCallback(async (text: string, sender: 'ai' | 'user') => {
    setMessages(prev => [...prev, { text, sender }])
    return text
  }, [])

  const handleStart = () => {
    setStarted(true)
    const greeting = "Hi there! I'm Elizabeth. Let's start our English class! 🎉"
    addMessage(greeting, 'ai')
    setTimeout(() => speak(greeting), 500)
  }

  const handlePhraseClick = useCallback(async (phrase: string) => {
    if (isLoading) return
    addMessage(phrase, 'user')
    setIsLoading(true)
    try {
      const reply = await sendMessage([{ role: 'user', content: phrase }], level)
      addMessage(reply, 'ai')
      setTimeout(() => speak(reply), 500)
    } catch {
      addMessage("That's great! Tell me more about that! 😊", 'ai')
    }
    setIsLoading(false)
  }, [isLoading, level, speak, addMessage])

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
          <div className="mt-8">
            <StartButton onClick={handleStart} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
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

          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400 text-center mb-2">Tap a phrase to say it:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickPhrases[level].map((phrase, i) => (
                <button key={i} onClick={() => handlePhraseClick(phrase)}
                  disabled={isLoading}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 disabled:opacity-50 active:scale-95 transition-all">
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
