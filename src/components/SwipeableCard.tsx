'use client'

import { ReactNode, useRef } from 'react'

interface SwipeableCardProps {
  children: ReactNode
  onSwipeLeft: () => void
  onSwipeRight: () => void
  className?: string
}

export default function SwipeableCard({ children, onSwipeLeft, onSwipeRight, className = '' }: SwipeableCardProps) {
  const startX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - startX.current
    if (diff > 60) onSwipeRight()
    else if (diff < -60) onSwipeLeft()
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
      className={`select-none ${className}`}>
      {children}
    </div>
  )
}
