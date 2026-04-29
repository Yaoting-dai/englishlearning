'use client'

import { useState, useEffect } from 'react'
import { useAgeLevel, levelInfo, AgeLevel } from '@/contexts/AgeLevelContext'
import { voiceOptions, getSavedVoice, saveVoice } from '@/data/voices'
import Image from 'next/image'

const levels: AgeLevel[] = ['kindergarten', 'elementary', 'middle']

export default function SettingsPage() {
  const { level, setLevel } = useAgeLevel()
  const [currentVoice, setCurrentVoice] = useState('Flo')

  useEffect(() => {
    setCurrentVoice(getSavedVoice() || 'Flo')
  }, [])

  const handleVoiceChange = (id: string) => {
    saveVoice(id)
    setCurrentVoice(id)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ 家长设置</h1>

      <h2 className="text-lg font-semibold mb-4 text-gray-700">选择学习阶段</h2>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {levels.map(l => {
          const li = levelInfo[l]
          const isActive = level === l
          return (
            <button key={l} onClick={() => setLevel(l)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}>
              <Image src={li.image} alt={li.label} width={72} height={72}
                className="rounded-xl object-cover" />
              <div className="text-left flex-1">
                <div className="text-lg font-bold">{li.emoji} {li.label}</div>
                <div className="text-sm text-gray-500">{li.age}</div>
              </div>
              {isActive && <span className="text-2xl">✅</span>}
            </button>
          )
        })}
      </div>

      <h2 className="text-lg font-semibold mb-4 text-gray-700">🎙️ 选择朗读音色</h2>
      <div className="grid grid-cols-1 gap-3">
        {voiceOptions.map(v => {
          const isActive = currentVoice === v.id
          return (
            <button key={v.id} onClick={() => handleVoiceChange(v.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                isActive ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white'
              }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                isActive ? 'bg-pink-500 text-white' : 'bg-gray-100'
              }`}>
                {isActive ? '🎤' : '🔊'}
              </div>
              <div className="text-left flex-1">
                <div className="text-lg font-bold">{v.label}</div>
                <div className="text-sm text-gray-500">{v.description}</div>
              </div>
              {isActive && (
                <span className="text-xs text-pink-500 font-medium bg-pink-100 px-2 py-1 rounded-full">当前</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
