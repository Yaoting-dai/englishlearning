'use client'

import { useState, useEffect, useCallback } from 'react'

interface ProgressData {
  learnedLetters: string[]
  learnedWords: string[]
  readArticles: string[]
  lastStudyTime: number | null
  totalStudySessions: number
}

const defaultProgress: ProgressData = {
  learnedLetters: [],
  learnedWords: [],
  readArticles: [],
  lastStudyTime: null,
  totalStudySessions: 0,
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress)

  useEffect(() => {
    const saved = localStorage.getItem('learningProgress')
    if (saved) {
      try { setProgress({ ...defaultProgress, ...JSON.parse(saved) }) }
      catch { /* ignore */ }
    }
  }, [])

  const save = useCallback((data: ProgressData) => {
    setProgress(data)
    localStorage.setItem('learningProgress', JSON.stringify(data))
  }, [])

  const touchStudy = useCallback(() => {
    save({ ...progress, lastStudyTime: Date.now(), totalStudySessions: progress.totalStudySessions + 1 })
  }, [progress, save])

  const markLetterLearned = useCallback((id: string) => {
    touchStudy()
    save({
      ...progress,
      learnedLetters: progress.learnedLetters.includes(id) ? progress.learnedLetters : [...progress.learnedLetters, id],
    })
  }, [progress, save, touchStudy])

  const markWordLearned = useCallback((word: string) => {
    touchStudy()
    save({
      ...progress,
      learnedWords: progress.learnedWords.includes(word) ? progress.learnedWords : [...progress.learnedWords, word],
    })
  }, [progress, save, touchStudy])

  const markArticleRead = useCallback((id: string) => {
    touchStudy()
    save({
      ...progress,
      readArticles: progress.readArticles.includes(id) ? progress.readArticles : [...progress.readArticles, id],
    })
  }, [progress, save, touchStudy])

  const resetProgress = useCallback(() => {
    save(defaultProgress)
  }, [save])

  return { progress, markLetterLearned, markWordLearned, markArticleRead, resetProgress }
}
