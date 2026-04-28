'use client'

import { useState, useEffect, useCallback } from 'react'
import { wordCategories, WordData } from '@/data/words'
import { useSpeech } from '@/hooks/useSpeech'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count)
}

const allWords: WordData[] = wordCategories.flatMap(c => c.words)

export default function WordMatchGame() {
  const { speak } = useSpeech()
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [options, setOptions] = useState<WordData[]>([])
  const [correct, setCorrect] = useState<WordData | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const [currentCategory, setCurrentCategory] = useState<string>('all')

  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const startRound = useCallback(() => {
    const pool = categoryFilter === 'all'
      ? allWords
      : wordCategories.find(c => c.id === categoryFilter)?.words || allWords

    const shuffled = shuffle(pool)
    const correctWord = shuffled[0]
    const wrongPool = allWords.filter(w => w.word !== correctWord.word)
    const wrongOptions = pickRandom(wrongPool, 3).map(w => w.word)
    const allOptions = shuffle([correctWord.word, ...wrongOptions])

    setCorrect(correctWord)
    setOptions(allOptions.map(word => pool.find(w => w.word === word) || correctWord))
    setSelected(null)
    setIsCorrect(null)
  }, [categoryFilter])

  useEffect(() => {
    startRound()
  }, [startRound, round])

  const handleSelect = (word: string) => {
    if (selected !== null) return // already answered
    setSelected(word)
    const correct_word = word === correct?.word
    setIsCorrect(correct_word)
    setTotal(t => t + 1)
    if (correct_word) setScore(s => s + 1)
    speak(correct_word ? 'Correct!' : correct?.word || '')
  }

  const handleNext = () => {
    if (round + 1 >= 10) {
      setGameOver(true)
      return
    }
    setRound(r => r + 1)
  }

  const handleRestart = () => {
    setRound(0)
    setScore(0)
    setTotal(0)
    setGameOver(false)
    setSelected(null)
    setIsCorrect(null)
  }

  const bgColor = (word: string) => {
    if (selected === null) return 'bg-white hover:bg-blue-50 border-gray-200'
    if (word === correct?.word) return 'bg-green-100 border-green-500 text-green-800'
    if (word === selected) return 'bg-red-100 border-red-400 text-red-800'
    return 'bg-gray-50 border-gray-200 text-gray-400'
  }

  if (gameOver) {
    const pct = Math.round((score / total) * 100)
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <div className="text-2xl font-bold mb-2">游戏结束!</div>
        <div className="text-6xl font-bold text-blue-600 mb-2">{score}/{total}</div>
        <div className="text-lg text-gray-500 mb-6">{pct}% 正确率</div>
        <div className="flex justify-center gap-4">
          <button onClick={handleRestart}
            className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-md active:scale-95 transition-transform">
            🔄 再来一局
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Score & Progress */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-lg font-bold text-blue-600">⭐ {score}/{total}</div>
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${
              i < round ? 'bg-green-400' : i === round ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </div>

      {/* Emoji display */}
      <div className="text-center mb-6">
        <div className="w-48 h-48 bg-orange-50 rounded-3xl flex items-center justify-center text-8xl mx-auto shadow-md mb-3">
          {correct?.emoji || '❓'}
        </div>
        <div className="text-lg text-gray-400">Choose the correct word</div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(opt.word)}
            className={`${bgColor(opt.word)} border-2 rounded-2xl py-5 px-4 text-center active:scale-95 transition-all`}>
            <div className="text-xl font-bold">{opt.word}</div>
            {selected && opt.word === correct?.word && (
              <div className="text-green-600 text-sm mt-1">✅ Correct!</div>
            )}
            {selected && opt.word === selected && opt.word !== correct?.word && (
              <div className="text-red-500 text-sm mt-1">❌</div>
            )}
          </button>
        ))}
      </div>

      {/* Next button */}
      {selected !== null && (
        <div className="text-center mt-6">
          <button onClick={handleNext}
            className="bg-blue-500 text-white px-10 py-3 rounded-full text-lg font-bold shadow-md active:scale-95 transition-transform">
            {round + 1 >= 10 ? '🏁 查看结果' : '▶ 下一题'}
          </button>
        </div>
      )}
    </div>
  )
}
