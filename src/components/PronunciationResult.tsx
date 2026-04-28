interface PhonemeScore {
  phoneme: string
  status: 'correct' | 'needs-work' | 'incorrect'
}

interface PronunciationResultProps {
  score: number
  phonemes: PhonemeScore[]
}

const statusStyles = {
  correct: 'bg-green-500 text-white',
  'needs-work': 'bg-orange-400 text-white',
  incorrect: 'bg-red-400 text-white',
}
const statusIcons = { correct: '✅', 'needs-work': '⚠️', incorrect: '❌' }

export default function PronunciationResult({ score, phonemes }: PronunciationResultProps) {
  const color = score >= 80 ? 'text-green-700' : score >= 60 ? 'text-orange-600' : 'text-red-500'
  const bg = score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-orange-50' : 'bg-red-50'
  const label = score >= 80 ? '⭐ 优秀' : score >= 60 ? '💪 加油' : '🔄 再试'

  return (
    <div className={`${bg} rounded-2xl p-5 mt-4`}>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className={`text-5xl font-bold ${color}`}>{score}</div>
          <div className="text-xs text-gray-500 mt-1">评分</div>
        </div>
        <div className="flex-1 flex flex-wrap gap-2 justify-center">
          {phonemes.map((p, i) => (
            <span key={i} className={`${statusStyles[p.status]} px-3 py-1 rounded-lg text-sm font-medium`}>
              {statusIcons[p.status]} /{p.phoneme}/
            </span>
          ))}
        </div>
        <div className={`${color} font-bold text-lg`}>{label}</div>
      </div>
    </div>
  )
}
