'use client'

import { useState } from 'react'
import { useAgeLevel, levelInfo, AgeLevel } from '@/contexts/AgeLevelContext'
import { useProgress } from '@/hooks/useProgress'
import Image from 'next/image'

const levels: AgeLevel[] = ['kindergarten', 'elementary', 'middle']

export default function SettingsPage() {
  const { level, setLevel } = useAgeLevel()
  const { resetProgress } = useProgress()
  const [showConfirm, setShowConfirm] = useState(false)

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

      <h2 className="text-lg font-semibold mb-4 text-gray-700">🗑️ 学习记录</h2>
      {!showConfirm ? (
        <button onClick={() => setShowConfirm(true)}
          className="w-full p-4 rounded-2xl border-2 border-red-200 bg-white flex items-center gap-4 hover:bg-red-50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">🗑️</div>
          <div className="text-left flex-1">
            <div className="text-lg font-bold text-red-500">重置学习记录</div>
            <div className="text-sm text-gray-500">清除所有学习进度数据</div>
          </div>
        </button>
      ) : (
        <div className="p-4 rounded-2xl border-2 border-red-300 bg-red-50">
          <p className="text-sm text-red-600 font-medium mb-3">确定要清除所有学习记录吗？此操作不可撤销。</p>
          <div className="flex gap-3">
            <button onClick={() => { resetProgress(); setShowConfirm(false) }}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 active:scale-95 transition-transform">
              确认清除
            </button>
            <button onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 bg-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-300 active:scale-95 transition-transform">
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
