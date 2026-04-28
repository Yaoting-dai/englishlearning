'use client'

import { useEffect, useState } from 'react'

interface CelebrationProps {
  show: boolean
  title: string
  emoji?: string
  onClose: () => void
}

function generateParticles() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 8 + Math.random() * 16,
  }))
}

export default function Celebration({ show, title, emoji = '🎉', onClose }: CelebrationProps) {
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([])

  useEffect(() => {
    if (show) setParticles(generateParticles())
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Confetti */}
      {particles.map(p => (
        <div key={p.id}
          className="absolute animate-bounce"
          style={{
            left: `${p.left}%`,
            top: '-10%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `celebration-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}

      {/* Card */}
      <div className="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl z-10 animate-bounce-in">
        <div className="text-6xl mb-4">{emoji}</div>
        <div className="text-2xl font-bold text-gray-800 mb-2">🎊 太棒了!</div>
        <div className="text-lg text-gray-600 mb-6">{title}</div>
        <button onClick={onClose}
          className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-md active:scale-95 transition-transform">
          👍 继续学习
        </button>
      </div>

      <style jsx>{`
        @keyframes celebration-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
