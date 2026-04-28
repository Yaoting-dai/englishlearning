'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type AgeLevel = 'kindergarten' | 'elementary' | 'middle'

const levelInfo = {
  kindergarten: { label: '幼儿园', age: '3-6岁', emoji: '🌱', image: '/images/kindergarten.png' },
  elementary: { label: '小学', age: '6-12岁', emoji: '📚', image: '/images/elementary.png' },
  middle: { label: '初中', age: '12-15岁', emoji: '🎯', image: '/images/middle.png' },
}

interface AgeLevelContextType {
  level: AgeLevel
  setLevel: (level: AgeLevel) => void
  info: typeof levelInfo[AgeLevel]
}

const AgeLevelContext = createContext<AgeLevelContextType | undefined>(undefined)

export function AgeLevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<AgeLevel>('kindergarten')

  useEffect(() => {
    const saved = localStorage.getItem('ageLevel') as AgeLevel | null
    if (saved && saved in levelInfo) setLevel(saved)
  }, [])

  const setAndSave = (newLevel: AgeLevel) => {
    setLevel(newLevel)
    localStorage.setItem('ageLevel', newLevel)
  }

  return (
    <AgeLevelContext.Provider value={{ level, setLevel: setAndSave, info: levelInfo[level] }}>
      {children}
    </AgeLevelContext.Provider>
  )
}

export function useAgeLevel() {
  const ctx = useContext(AgeLevelContext)
  if (!ctx) throw new Error('useAgeLevel must be used within AgeLevelProvider')
  return ctx
}

export { levelInfo }
