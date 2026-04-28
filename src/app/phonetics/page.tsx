'use client'

import { useState } from 'react'
import { phonetics } from '@/data/phonetics'
import BigButton from '@/components/BigButton'
import { useSpeech } from '@/hooks/useSpeech'

export default function PhoneticsPage() {
  const [tab, setTab] = useState<'vowel' | 'consonant'>('vowel')
  const [selected, setSelected] = useState<string | null>(null)
  const { speak } = useSpeech()

  const filtered = phonetics.filter(p => p.type === tab)
  const detail = phonetics.find(p => p.symbol === selected)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🔊 音标认读</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => { setTab('vowel'); setSelected(null) }}
          className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
            tab === 'vowel' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'
          }`}>元音</button>
        <button onClick={() => { setTab('consonant'); setSelected(null) }}
          className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
            tab === 'consonant' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'
          }`}>辅音</button>
      </div>

      {!detail ? (
        // Grid view
        <div className="grid grid-cols-4 gap-3">
          {filtered.map(p => (
            <button key={p.symbol} onClick={() => setSelected(p.symbol)}
              className="bg-white rounded-xl py-4 text-center shadow-sm border border-gray-100 active:scale-95 transition-transform">
              <div className="text-2xl font-bold text-pink-600">/{p.symbol}/</div>
              <div className="text-xs text-gray-400 mt-1">{p.description}</div>
            </button>
          ))}
        </div>
      ) : (
        // Detail view
        <div>
          <button onClick={() => setSelected(null)} className="text-gray-400 text-sm mb-3">◀ 返回列表</button>
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <div className="text-5xl font-bold text-pink-600">/{detail.symbol}/</div>
            <div className="text-base text-gray-500 mt-2">{detail.description}</div>
            <div className="flex justify-center gap-6 mt-6">
              <BigButton icon="🔊" label="听发音" color="bg-green-500"
                onClick={() => speak(detail.examples[0].word)} />
              <BigButton icon="🎤" label="跟读" color="bg-blue-500" />
            </div>
            <div className="mt-6 space-y-3">
              {detail.examples.map((ex, i) => (
                <div key={i} className="flex items-center justify-center gap-4 bg-gray-50 rounded-xl py-3 px-4"
                  onClick={() => speak(ex.word)}>
                  <span className="text-xl font-bold">{ex.word}</span>
                  <span className="text-sm text-gray-400">{ex.phonetic}</span>
                  <span className="text-blue-500 text-sm">🔊</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
