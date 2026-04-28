'use client'

import { useAgeLevel, levelInfo, AgeLevel } from '@/contexts/AgeLevelContext'
import Image from 'next/image'

const levels: AgeLevel[] = ['kindergarten', 'elementary', 'middle']

export default function SettingsPage() {
  const { level, setLevel } = useAgeLevel()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ 家长设置</h1>
      <h2 className="text-lg font-semibold mb-4 text-gray-700">选择学习阶段</h2>
      <div className="grid grid-cols-1 gap-4">
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
    </div>
  )
}
