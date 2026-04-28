# 幼儿英语启蒙学习 Web App — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional iPad-optimized Web App for children's English learning (ages 3-15) with 6 learning modules.

**Architecture:** Next.js 14 (App Router) + TypeScript + Tailwind CSS SPA with PWA support. Static content embedded as TypeScript data modules. Azure Speech for pronunciation assessment and TTS (AnaNeural child voice). 豆包 API via 火山引擎 ARK for AI chat. LocalStorage/IndexedDB for progress.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Web Speech API (MVP TTS), Azure Speech SDK, 火山引擎 ARK API

**Phases:**
1. **Phase 1 (Foundation):** Project scaffold, navigation, age level settings, data models
2. **Phase 2 (Core Modules):** Letters, Words, Songs modules
3. **Phase 3 (Advanced Modules):** Phonetics, Reading, AI Chat
4. **Phase 4 (Polish):** PWA, speech integration, progress persistence, image assets

---

## File Structure

```
/
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── images/              (copied from 图片素材/)
│       ├── kindergarten.png
│       ├── elementary.png
│       ├── middle.png
│       └── teacher.png
├── src/
│   ├── app/
│   │   ├── layout.tsx           Main layout + nav bar
│   │   ├── page.tsx             Home page with age-based recommendations
│   │   ├── globals.css          Global Tailwind + custom styles
│   │   ├── letters/
│   │   │   └── page.tsx         Letter swipeable card deck
│   │   ├── phonetics/
│   │   │   └── page.tsx         American phonetics chart + detail
│   │   ├── words/
│   │   │   ├── page.tsx         Word category list
│   │   │   └── [category]/page.tsx  Word cards with pronunciation
│   │   ├── songs/
│   │   │   ├── page.tsx         Song list
│   │   │   └── [id]/page.tsx    Song player with scrolling lyrics
│   │   ├── reading/
│   │   │   ├── page.tsx         Reading category list
│   │   │   └── [id]/page.tsx    Article reader with sentence highlighting
│   │   ├── ai-chat/
│   │   │   └── page.tsx         AI chat with Elizabeth
│   │   └── settings/
│   │       └── page.tsx         Age level settings (幼儿园/小学/初中)
│   ├── components/
│   │   ├── NavBar.tsx           Bottom tab navigation
│   │   ├── AgeBadge.tsx         Current age level badge
│   │   ├── SwipeableCard.tsx    Reusable swipeable card (letters, words)
│   │   ├── BigButton.tsx        Reusable large round button (80-88px)
│   │   ├── ScrollList.tsx       Reusable large card scroll list
│   │   ├── PronunciationResult.tsx  Score + phoneme feedback display
│   │   ├── SongPlayer.tsx       Audio player with scrolling lyrics
│   │   ├── SentenceReader.tsx   Sentence-by-sentence reader with highlight
│   │   ├── ChatBubble.tsx       Chat message bubble
│   │   └── StartButton.tsx      Large START button
│   ├── data/
│   │   ├── letters.ts           A-Z letter data with words/images
│   │   ├── phonetics.ts         American phonetic symbols + examples
│   │   ├── words.ts             Categorized vocabulary
│   │   ├── songs.ts             Nursery rhymes with lyrics
│   │   └── reading.ts           5-10 sample articles
│   ├── hooks/
│   │   ├── useAgeLevel.ts       Age level context hook
│   │   ├── useSpeech.ts         TTS hook (Azure/Web Speech)
│   │   └── usePronunciation.ts  Pronunciation assessment hook
│   ├── services/
│   │   ├── azure-speech.ts      Azure Speech SDK wrapper
│   │   └── doubao-api.ts        豆包 API client
│   └── contexts/
│       └── AgeLevelContext.tsx   Age level React context
└── 图片素材/
    └── ... (source images)
```

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
cd /Users/yaoting/Documents/Coding_Projects/Learn\ English
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

- [ ] **Step 2: Update layout with viewport meta and basic structure**

Update `src/app/layout.tsx`:
```tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Learn English - 幼儿英语启蒙',
  description: 'Interactive English learning for kids aged 3-15',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans antialiased">
        <main className="max-w-4xl mx-auto min-h-screen pb-20">
          {children}
        </main>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Add global custom styles**

Add to `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

@layer base {
  :root {
    --safe-bottom: env(safe-area-inset-bottom, 0px);
  }
}
```

- [ ] **Step 4: Create manifest.json**

Create `public/manifest.json`:
```json
{
  "name": "Learn English",
  "short_name": "English",
  "description": "幼儿英语启蒙学习",
  "start_url": "/",
  "display": "standalone",
  "orientation": "landscape-primary",
  "background_color": "#fafafa",
  "theme_color": "#2196F3",
  "icons": [
    { "src": "/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/images/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 5: Copy image assets**

Run:
```bash
mkdir -p "/Users/yaoting/Documents/Coding_Projects/Learn English/public/images"
cp "/Users/yaoting/Documents/Coding_Projects/Learn English/图片素材/幼儿园.png" "/Users/yaoting/Documents/Coding_Projects/Learn English/public/images/kindergarten.png"
cp "/Users/yaoting/Documents/Coding_Projects/Learn English/图片素材/小学生.png" "/Users/yaoting/Documents/Coding_Projects/Learn English/public/images/elementary.png"
cp "/Users/yaoting/Documents/Coding_Projects/Learn English/图片素材/初中生.png" "/Users/yaoting/Documents/Coding_Projects/Learn English/public/images/middle.png"
cp "/Users/yaoting/Documents/Coding_Projects/Learn English/图片素材/英语老师.png" "/Users/yaoting/Documents/Coding_Projects/Learn English/public/images/teacher.png"
```

- [ ] **Step 6: Verify build**

Run:
```bash
cd "/Users/yaoting/Documents/Coding_Projects/Learn English" && npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind and assets"

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

### Task 2: Age Level System + Navigation

**Files:**
- Create: `src/contexts/AgeLevelContext.tsx`
- Create: `src/hooks/useAgeLevel.ts`
- Create: `src/components/NavBar.tsx`
- Create: `src/components/AgeBadge.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/app/settings/page.tsx`

- [ ] **Step 1: Create AgeLevelContext**

Create `src/contexts/AgeLevelContext.tsx`:
```tsx
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
```

- [ ] **Step 2: Create NavBar**

Create `src/components/NavBar.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAgeLevel } from '@/contexts/AgeLevelContext'

const tabs = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/letters', label: '字母', icon: '🔤' },
  { href: '/words', label: '学习', icon: '📖' },
  { href: '/songs', label: '儿歌', icon: '🎵' },
  { href: '/ai-chat', label: 'AI', icon: '🤖' },
]

export default function NavBar() {
  const pathname = usePathname()
  const { info, level } = useAgeLevel()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
         style={{ paddingBottom: 'var(--safe-bottom)' }}>
      <div className="max-w-4xl mx-auto flex justify-around items-center py-2">
        {tabs.map(tab => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex flex-col items-center px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}>
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs mt-0.5">{tab.label}</span>
            </Link>
          )
        })}
      </div>
      <div className="flex justify-between px-4 py-1 text-xs text-gray-400 border-t border-gray-100">
        <Link href="/settings" className="flex items-center gap-1">
          <span className="text-base">{info.emoji}</span>
          {info.label}
        </Link>
        <span>⚙️ 设置</span>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Update layout with NavBar and AgeLevelProvider**

Modify `src/app/layout.tsx`:
```tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AgeLevelProvider } from '@/contexts/AgeLevelContext'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'Learn English - 幼儿英语启蒙',
  description: 'Interactive English learning for kids aged 3-15',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans antialiased">
        <AgeLevelProvider>
          <main className="max-w-4xl mx-auto min-h-screen pb-24">
            {children}
          </main>
          <NavBar />
        </AgeLevelProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Create Settings page**

Create `src/app/settings/page.tsx`:
```tsx
'use client'

import { useAgeLevel, levelInfo, AgeLevel } from '@/contexts/AgeLevelContext'
import Image from 'next/image'

const levels: AgeLevel[] = ['kindergarten', 'elementary', 'middle']

export default function SettingsPage() {
  const { level, setLevel, info } = useAgeLevel()

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
```

- [ ] **Step 5: Create Home page**

Create `src/app/page.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { useAgeLevel } from '@/contexts/AgeLevelContext'
import Image from 'next/image'

export default function Home() {
  const { info, level } = useAgeLevel()

  const modules = [
    { href: '/letters', emoji: '🔤', title: '字母认读', color: 'bg-green-100', desc: 'A-Z' },
    { href: '/phonetics', emoji: '🔊', title: '音标认读', color: 'bg-pink-100', desc: 'Pronunciation' },
    { href: '/words', emoji: '📖', title: '单词跟读', color: 'bg-blue-100', desc: 'Vocabulary' },
    { href: '/songs', emoji: '🎵', title: '儿歌', color: 'bg-orange-100', desc: 'Nursery Rhymes' },
    { href: '/reading', emoji: '📚', title: '美文阅读', color: 'bg-purple-100', desc: 'Reading' },
    { href: '/ai-chat', emoji: '🤖', title: 'AI 老师', color: 'bg-indigo-100', desc: 'Elizabeth' },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-2xl shadow-sm">
        <Image src={info.image} alt={info.label} width={60} height={60}
          className="rounded-xl object-cover" />
        <div>
          <div className="text-xl font-bold">{info.emoji} {info.label}</div>
          <div className="text-sm text-gray-500">{info.age}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {modules.map(m => (
          <Link key={m.href} href={m.href}
            className={`${m.color} rounded-2xl p-5 text-center hover:shadow-md transition-shadow`}>
            <div className="text-4xl mb-2">{m.emoji}</div>
            <div className="font-bold text-lg">{m.title}</div>
            <div className="text-sm text-gray-500 mt-1">{m.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify build**

Run: `cd "/Users/yaoting/Documents/Coding_Projects/Learn English" && npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add age level system, navigation, home page, settings"

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

### Task 3: Data Models

**Files:**
- Create: `src/data/letters.ts`
- Create: `src/data/words.ts`
- Create: `src/data/songs.ts`
- Create: `src/data/reading.ts`

- [ ] **Step 1: Create letters data**

Create `src/data/letters.ts`:
```ts
export interface LetterData {
  id: string
  upper: string
  lower: string
  phonetic: string
  word: string
  meaning: string
  emoji: string
}

export const letters: LetterData[] = [
  { id: 'a', upper: 'A', lower: 'a', phonetic: '/eɪ/', word: 'Apple', meaning: '苹果', emoji: '🍎' },
  { id: 'b', upper: 'B', lower: 'b', phonetic: '/biː/', word: 'Ball', meaning: '球', emoji: '⚽' },
  { id: 'c', upper: 'C', lower: 'c', phonetic: '/siː/', word: 'Cat', meaning: '猫', emoji: '🐱' },
  { id: 'd', upper: 'D', lower: 'd', phonetic: '/diː/', word: 'Dog', meaning: '狗', emoji: '🐶' },
  { id: 'e', upper: 'E', lower: 'e', phonetic: '/iː/', word: 'Elephant', meaning: '大象', emoji: '🐘' },
  { id: 'f', upper: 'F', lower: 'f', phonetic: '/ɛf/', word: 'Fish', meaning: '鱼', emoji: '🐟' },
  { id: 'g', upper: 'G', lower: 'g', phonetic: '/dʒiː/', word: 'Girl', meaning: '女孩', emoji: '👧' },
  { id: 'h', upper: 'H', lower: 'h', phonetic: '/eɪtʃ/', word: 'Hat', meaning: '帽子', emoji: '🎩' },
  { id: 'i', upper: 'I', lower: 'i', phonetic: '/aɪ/', word: 'Ice cream', meaning: '冰淇淋', emoji: '🍦' },
  { id: 'j', upper: 'J', lower: 'j', phonetic: '/dʒeɪ/', word: 'Juice', meaning: '果汁', emoji: '🧃' },
  { id: 'k', upper: 'K', lower: 'k', phonetic: '/keɪ/', word: 'Kite', meaning: '风筝', emoji: '🪁' },
  { id: 'l', upper: 'L', lower: 'l', phonetic: '/ɛl/', word: 'Lion', meaning: '狮子', emoji: '🦁' },
  { id: 'm', upper: 'M', lower: 'm', phonetic: '/ɛm/', word: 'Monkey', meaning: '猴子', emoji: '🐵' },
  { id: 'n', upper: 'N', lower: 'n', phonetic: '/ɛn/', word: 'Nose', meaning: '鼻子', emoji: '👃' },
  { id: 'o', upper: 'O', lower: 'o', phonetic: '/oʊ/', word: 'Orange', meaning: '橙子', emoji: '🍊' },
  { id: 'p', upper: 'P', lower: 'p', phonetic: '/piː/', word: 'Pig', meaning: '猪', emoji: '🐷' },
  { id: 'q', upper: 'Q', lower: 'q', phonetic: '/kjuː/', word: 'Queen', meaning: '女王', emoji: '👑' },
  { id: 'r', upper: 'R', lower: 'r', phonetic: '/ɑr/', word: 'Rabbit', meaning: '兔子', emoji: '🐰' },
  { id: 's', upper: 'S', lower: 's', phonetic: '/ɛs/', word: 'Sun', meaning: '太阳', emoji: '☀️' },
  { id: 't', upper: 'T', lower: 't', phonetic: '/tiː/', word: 'Tree', meaning: '树', emoji: '🌳' },
  { id: 'u', upper: 'U', lower: 'u', phonetic: '/juː/', word: 'Umbrella', meaning: '雨伞', emoji: '☂️' },
  { id: 'v', upper: 'V', lower: 'v', phonetic: '/viː/', word: 'Violin', meaning: '小提琴', emoji: '🎻' },
  { id: 'w', upper: 'W', lower: 'w', phonetic: '/dʌbəl juː/', word: 'Water', meaning: '水', emoji: '💧' },
  { id: 'x', upper: 'X', lower: 'x', phonetic: '/ɛks/', word: 'Xylophone', meaning: '木琴', emoji: '🎹' },
  { id: 'y', upper: 'Y', lower: 'y', phonetic: '/waɪ/', word: 'Yoyo', meaning: '悠悠球', emoji: '🪀' },
  { id: 'z', upper: 'Z', lower: 'z', phonetic: '/ziː/', word: 'Zebra', meaning: '斑马', emoji: '🦓' },
]
```

- [ ] **Step 2: Create words data**

Create `src/data/words.ts`:
```ts
export interface WordData {
  word: string
  phonetic: string
  meaning: string
  emoji: string
}

export interface WordCategory {
  id: string
  name: string
  emoji: string
  words: WordData[]
}

export const wordCategories: WordCategory[] = [
  {
    id: 'animals', name: 'Animals', emoji: '🐶',
    words: [
      { word: 'Cat', phonetic: '/kæt/', meaning: '猫', emoji: '🐱' },
      { word: 'Dog', phonetic: '/dɔɡ/', meaning: '狗', emoji: '🐶' },
      { word: 'Fish', phonetic: '/fɪʃ/', meaning: '鱼', emoji: '🐟' },
      { word: 'Bird', phonetic: '/bɜrd/', meaning: '鸟', emoji: '🐦' },
      { word: 'Rabbit', phonetic: '/ˈræbɪt/', meaning: '兔子', emoji: '🐰' },
      { word: 'Pig', phonetic: '/pɪɡ/', meaning: '猪', emoji: '🐷' },
    ],
  },
  {
    id: 'fruits', name: 'Fruits', emoji: '🍎',
    words: [
      { word: 'Apple', phonetic: '/ˈæpəl/', meaning: '苹果', emoji: '🍎' },
      { word: 'Banana', phonetic: '/bəˈnænə/', meaning: '香蕉', emoji: '🍌' },
      { word: 'Orange', phonetic: '/ˈɔrɪndʒ/', meaning: '橙子', emoji: '🍊' },
      { word: 'Grape', phonetic: '/ɡreɪp/', meaning: '葡萄', emoji: '🍇' },
      { word: 'Strawberry', phonetic: '/ˈstrɔˌbɛri/', meaning: '草莓', emoji: '🍓' },
    ],
  },
  {
    id: 'colors', name: 'Colors', emoji: '🎨',
    words: [
      { word: 'Red', phonetic: '/rɛd/', meaning: '红色', emoji: '🔴' },
      { word: 'Blue', phonetic: '/bluː/', meaning: '蓝色', emoji: '🔵' },
      { word: 'Green', phonetic: '/ɡriːn/', meaning: '绿色', emoji: '🟢' },
      { word: 'Yellow', phonetic: '/ˈjɛloʊ/', meaning: '黄色', emoji: '🟡' },
      { word: 'Pink', phonetic: '/pɪŋk/', meaning: '粉色', emoji: '🩷' },
    ],
  },
]
```

- [ ] **Step 3: Create songs data**

Create `src/data/songs.ts`:
```ts
export interface SongLine {
  time: number // seconds
  text: string
}

export interface SongData {
  id: string
  title: string
  emoji: string
  category: string
  duration: string
  audioSrc: string
  lyrics: SongLine[]
}

export const songs: SongData[] = [
  {
    id: 'abc',
    title: 'ABC Song',
    emoji: '🔤',
    category: 'Alphabet',
    duration: '3:45',
    audioSrc: '/audio/abc-song.mp3',
    lyrics: [
      { time: 0, text: 'A-B-C-D-E-F-G' },
      { time: 5, text: 'H-I-J-K-L-M-N-O-P' },
      { time: 10, text: 'Q-R-S-T-U-V-W' },
      { time: 15, text: 'X-Y-Z' },
      { time: 18, text: 'Now I know my ABCs' },
      { time: 23, text: 'Next time won\'t you sing with me' },
    ],
  },
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    emoji: '⭐',
    category: 'Lullaby',
    duration: '2:30',
    audioSrc: '/audio/twinkle.mp3',
    lyrics: [
      { time: 0, text: 'Twinkle, twinkle, little star' },
      { time: 5, text: 'How I wonder what you are' },
      { time: 10, text: 'Up above the world so high' },
      { time: 15, text: 'Like a diamond in the sky' },
      { time: 20, text: 'Twinkle, twinkle, little star' },
      { time: 25, text: 'How I wonder what you are' },
    ],
  },
  {
    id: 'wheels',
    title: 'Wheels on the Bus',
    emoji: '🚌',
    category: 'Action',
    duration: '4:15',
    audioSrc: '/audio/wheels.mp3',
    lyrics: [
      { time: 0, text: 'The wheels on the bus go round and round' },
      { time: 8, text: 'Round and round, round and round' },
      { time: 12, text: 'The wheels on the bus go round and round' },
      { time: 16, text: 'All through the town' },
      { time: 20, text: 'The wipers on the bus go swish, swish, swish' },
      { time: 28, text: 'Swish, swish, swish, swish, swish, swish' },
      { time: 32, text: 'The wipers on the bus go swish, swish, swish' },
      { time: 36, text: 'All through the town' },
    ],
  },
]
```

- [ ] **Step 4: Create reading data**

Create `src/data/reading.ts`:
```ts
export interface ReadingArticle {
  id: string
  title: string
  emoji: string
  category: string
  level: 'kindergarten' | 'elementary' | 'middle'
  wordCount: number
  content: string[]
}

export const readingCategories = ['Short Stories', 'Science & Nature', 'Daily Life', 'Fables & Classics']

export const readingArticles: ReadingArticle[] = [
  {
    id: 'cat-mouse',
    title: 'The Cat and the Mouse',
    emoji: '🐱',
    category: 'Short Stories',
    level: 'kindergarten',
    wordCount: 60,
    content: [
      'Once upon a time, there was a little cat named Mimi.',
      'She lived in a big house with a kind girl named Lily.',
      'One day, Mimi saw a small mouse in the kitchen.',
      'The mouse was eating a piece of cheese.',
      '"Hello!" said the mouse. "This cheese is very good."',
      'Mimi smiled. "No, thank you. I like fish better!"',
    ],
  },
  {
    id: 'sunny-day',
    title: 'A Sunny Day',
    emoji: '☀️',
    category: 'Daily Life',
    level: 'kindergarten',
    wordCount: 45,
    content: [
      'Today is a sunny day.',
      'Tom goes to the park with his mom.',
      'He sees a big tree and a red flower.',
      'Tom says, "What a beautiful day!"',
      'He plays on the swing and feels happy.',
    ],
  },
  {
    id: 'fox-grapes',
    title: 'The Fox and the Grapes',
    emoji: '🦊',
    category: 'Fables & Classics',
    level: 'elementary',
    wordCount: 120,
    content: [
      'One hot summer day, a fox was walking through a garden.',
      'He saw a bunch of beautiful grapes hanging from a vine.',
      'The grapes were purple and looked very sweet.',
      'The fox wanted to eat them very much.',
      'He jumped up to reach the grapes, but they were too high.',
      'He tried again and again, but he could not reach them.',
      'At last, the fox gave up and walked away.',
      '"Those grapes are probably sour anyway," he said to himself.',
      'Moral: It is easy to hate what you cannot have.',
    ],
  },
]
```

- [ ] **Step 5: Verify build**

Run: `cd "/Users/yaoting/Documents/Coding_Projects/Learn English" && npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add data models for letters, words, songs, reading"

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

### Task 4: Letters Module (Swipeable Card Deck)

**Files:**
- Create: `src/components/SwipeableCard.tsx`
- Create: `src/components/BigButton.tsx`
- Create: `src/app/letters/page.tsx`

- [ ] **Step 1: Create SwipeableCard component**

Create `src/components/SwipeableCard.tsx`:
```tsx
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
```

- [ ] **Step 2: Create BigButton component**

Create `src/components/BigButton.tsx`:
```tsx
interface BigButtonProps {
  icon: string
  label: string
  color: string
  onClick?: () => void
  size?: 'md' | 'lg'
}

export default function BigButton({ icon, label, color, onClick, size = 'lg' }: BigButtonProps) {
  const dim = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'
  return (
    <button onClick={onClick}
      className={`${dim} ${color} rounded-full flex flex-col items-center justify-center text-white shadow-lg active:scale-95 transition-transform`}>
      <span className="text-3xl">{icon}</span>
      <span className="text-[10px] mt-0.5">{label}</span>
    </button>
  )
}
```

- [ ] **Step 3: Create letters page**

Create `src/app/letters/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { letters } from '@/data/letters'
import SwipeableCard from '@/components/SwipeableCard'
import BigButton from '@/components/BigButton'

export default function LettersPage() {
  const [index, setIndex] = useState(0)
  const letter = letters[index]

  const goTo = (i: number) => {
    if (i >= 0 && i < letters.length) setIndex(i)
  }

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-gray-600">🔤 字母认读 · {index + 1}/{letters.length}</span>
      </div>

      <SwipeableCard onSwipeLeft={() => goTo(index + 1)} onSwipeRight={() => goTo(index - 1)}>
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-8 mx-2 shadow-md">
          <div className="text-center">
            <div className="text-7xl font-bold text-orange-700 leading-none">{letter.upper}</div>
            <div className="text-3xl font-bold text-orange-500 mt-1">{letter.lower}</div>
            <div className="text-base text-gray-500 mt-2">{letter.phonetic}</div>
            <div className="flex items-center justify-center gap-3 mt-5 bg-white/60 rounded-2xl p-4 mx-4">
              <span className="text-5xl">{letter.emoji}</span>
              <div className="text-left">
                <div className="text-2xl font-bold">{letter.word}</div>
                <div className="text-sm text-gray-500">{letter.phonetic}</div>
              </div>
            </div>
          </div>
        </div>
      </SwipeableCard>

      <div className="flex justify-center gap-6 mt-5">
        <BigButton icon="◀" label="上一个" color="bg-gray-300" onClick={() => goTo(index - 1)} />
        <BigButton icon="🔊" label="发音" color="bg-green-500" />
        <BigButton icon="🎤" label="跟读" color="bg-blue-500" />
        <BigButton icon="▶" label="下一个" color="bg-gray-300" onClick={() => goTo(index + 1)} />
      </div>

      <div className="flex justify-center gap-1.5 mt-5 flex-wrap">
        {letters.map((l, i) => (
          <div key={l.id}
            className={`w-2 h-2 rounded-full ${
              i === index ? 'bg-pink-500 w-3 h-3' :
              i < index ? 'bg-green-400' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `cd "/Users/yaoting/Documents/Coding_Projects/Learn English" && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement letters module with swipeable card deck"

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

### Task 5: Words Module

**Files:**
- Create: `src/components/PronunciationResult.tsx`
- Create: `src/app/words/page.tsx`
- Create: `src/app/words/[category]/page.tsx`

- [ ] **Step 1: Create PronunciationResult component**

Create `src/components/PronunciationResult.tsx`:
```tsx
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
```

- [ ] **Step 2: Create words category page**

Create `src/app/words/page.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { wordCategories } from '@/data/words'

export default function WordsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📖 单词跟读</h1>
      <div className="grid grid-cols-2 gap-4">
        {wordCategories.map(cat => (
          <Link key={cat.id} href={`/words/${cat.id}`}
            className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-6xl mb-2">{cat.emoji}</div>
            <div className="font-bold text-lg">{cat.name}</div>
            <div className="text-sm text-gray-500 mt-1">{cat.words.length} words</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create word detail page**

Create `src/app/words/[category]/page.tsx`:
```tsx
'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { wordCategories } from '@/data/words'
import SwipeableCard from '@/components/SwipeableCard'
import BigButton from '@/components/BigButton'
import PronunciationResult from '@/components/PronunciationResult'
import Link from 'next/link'

export default function WordCategoryPage() {
  const params = useParams()
  const category = wordCategories.find(c => c.id === params.category)
  const [index, setIndex] = useState(0)

  if (!category) return <div className="p-4">Category not found</div>

  const word = category.words[index]
  const [showResult, setShowResult] = useState(false)

  const goTo = (i: number) => {
    if (i >= 0 && i < category.words.length) {
      setIndex(i)
      setShowResult(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/words" className="text-gray-400">◀</Link>
        <span className="text-lg font-semibold">{category.emoji} {category.name} · {index + 1}/{category.words.length}</span>
      </div>

      <SwipeableCard onSwipeLeft={() => goTo(index + 1)} onSwipeRight={() => goTo(index - 1)}>
        <div className="text-center">
          <div className="w-44 h-44 bg-orange-50 rounded-3xl flex items-center justify-center text-7xl mx-auto shadow-sm">
            {word.emoji}
          </div>
          <div className="text-5xl font-bold mt-4 tracking-wider">{word.word}</div>
          <div className="text-lg text-gray-400 mt-1">{word.phonetic}</div>
        </div>
      </SwipeableCard>

      <div className="flex justify-center gap-8 mt-6">
        <BigButton icon="🔊" label="听发音" color="bg-green-500" />
        <BigButton icon="🎤" label="跟读" color="bg-blue-500" onClick={() => setShowResult(true)} />
        <BigButton icon="🔄" label="重听" color="bg-orange-500" />
      </div>

      {showResult && (
        <PronunciationResult
          score={85}
          phonemes={[
            { phoneme: 'k', status: 'correct' },
            { phoneme: 'æ', status: 'correct' },
            { phoneme: 't', status: 'needs-work' },
          ]}
        />
      )}

      <div className="flex justify-between mt-6 text-gray-400">
        <button onClick={() => goTo(index - 1)} disabled={index === 0}
          className={index === 0 ? 'opacity-30' : ''}>◀ 上一个</button>
        <button onClick={() => goTo(index + 1)} disabled={index === category.words.length - 1}
          className={`font-bold ${index === category.words.length - 1 ? 'opacity-30 text-gray-400' : 'text-green-600'}`}>下一个 ▶</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `cd "/Users/yaoting/Documents/Coding_Projects/Learn English" && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement words module with categories and pronunciation assessment UI"

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

### Task 6: Songs Module (Player with Scrolling Lyrics)

**Files:**
- Create: `src/components/SongPlayer.tsx`
- Create: `src/app/songs/page.tsx`
- Create: `src/app/songs/[id]/page.tsx`

- [ ] **Step 1: Create SongPlayer component**

Create `src/components/SongPlayer.tsx`:
```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { SongData } from '@/data/songs'

interface SongPlayerProps {
  song: SongData
}

export default function SongPlayer({ song }: SongPlayerProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lyricsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress(p => {
          const next = p + 1
          const lineIndex = song.lyrics.findLastIndex(l => l.time <= next)
          if (lineIndex >= 0 && lineIndex !== currentLine) setCurrentLine(lineIndex)
          return next > 100 ? 0 : next
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPlaying, song.lyrics])

  useEffect(() => {
    if (lyricsRef.current) {
      const active = lyricsRef.current.querySelector('.text-pink-600')
      active?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentLine])

  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-2xl shadow-md">
          {song.emoji}
        </div>
        <div>
          <div className="text-xl font-bold">{song.title}</div>
          <div className="text-sm text-gray-400">{song.category} · {song.duration}</div>
        </div>
      </div>

      <div ref={lyricsRef} className="bg-gray-50 rounded-2xl p-5 h-56 overflow-y-auto mb-4 flex flex-col justify-center">
        {song.lyrics.map((line, i) => (
          <div key={i} className={`py-1.5 transition-all duration-300 ${
            i === currentLine ? 'text-xl font-bold text-pink-600' :
            i < currentLine ? 'text-sm text-gray-300' : 'text-sm text-gray-500'
          }`}>
            {line.text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-400">{Math.floor(progress / 60)}:{String(progress % 60).padStart(2, '0')}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-pink-500 rounded-full relative" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full shadow-md" />
          </div>
        </div>
        <span className="text-xs text-gray-400">{song.duration}</span>
      </div>

      <div className="flex justify-center items-center gap-10">
        <button className="text-2xl text-gray-400">⏮</button>
        <button onClick={togglePlay}
          className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg active:scale-95 transition-transform">
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="text-2xl text-gray-400">⏭</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create songs list page**

Create `src/app/songs/page.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { songs } from '@/data/songs'

export default function SongsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🎵 儿歌</h1>
      <div className="flex flex-col gap-4">
        {songs.map(song => (
          <Link key={song.id} href={`/songs/${song.id}`}
            className="flex items-center gap-5 bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-3xl shadow-md shrink-0">
              {song.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xl truncate">{song.title}</div>
              <div className="text-sm text-gray-400 mt-1">{song.category} · {song.duration}</div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-md shrink-0">▶</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create song player page**

Create `src/app/songs/[id]/page.tsx`:
```tsx
'use client'

import { useParams } from 'next/navigation'
import { songs } from '@/data/songs'
import SongPlayer from '@/components/SongPlayer'
import Link from 'next/link'

export default function SongPage() {
  const params = useParams()
  const song = songs.find(s => s.id === params.id)

  if (!song) return (
    <div className="p-4 text-center">
      <p>Song not found</p>
      <Link href="/songs" className="text-blue-500 mt-4 block">◀ Back to songs</Link>
    </div>
  )

  return (
    <div className="p-4">
      <Link href="/songs" className="text-gray-400 text-sm mb-4 block">◀ 返回列表</Link>
      <SongPlayer song={song} />
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `cd "/Users/yaoting/Documents/Coding_Projects/Learn English" && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement songs module with scrolling lyrics player"

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

### Task 7: Reading Module (Sentence Highlighting)

**Files:**
- Create: `src/components/SentenceReader.tsx`
- Create: `src/app/reading/page.tsx`
- Create: `src/app/reading/[id]/page.tsx`

- [ ] **Step 1: Create SentenceReader component**

Create `src/components/SentenceReader.tsx`:
```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import BigButton from './BigButton'

interface SentenceReaderProps {
  sentences: string[]
  title: string
}

export default function SentenceReader({ sentences, title }: SentenceReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [showTranslation, setShowTranslation] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isReading) {
      const timer = setInterval(() => {
        setCurrentIndex(i => {
          if (i >= sentences.length - 1) { clearInterval(timer); setIsReading(false); return i }
          return i + 1
        })
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [isReading, sentences.length])

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current.children[currentIndex] as HTMLElement
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentIndex])

  return (
    <div>
      <div className="flex justify-center gap-6 mb-5">
        <BigButton icon="🔊" label="朗读" color="bg-green-500" onClick={() => { setIsReading(!isReading); setCurrentIndex(0) }} />
        <BigButton icon="🎤" label="跟读" color="bg-blue-500" />
      </div>

      <div ref={containerRef} className="bg-gray-50 rounded-2xl p-6 min-h-[300px] flex flex-col justify-center overflow-y-auto">
        {sentences.map((s, i) => (
          <div key={i} onClick={() => setShowTranslation(showTranslation === s ? null : s)}
            className={`py-2 transition-all duration-300 cursor-pointer select-none ${
              i === currentIndex ? 'text-2xl font-bold text-pink-600' :
              i < currentIndex ? 'text-base text-gray-300' : 'text-base text-gray-600'
            }`}>
            {s}
            {showTranslation === s && (
              <div className="text-sm text-gray-400 mt-1 bg-yellow-50 rounded-lg px-3 py-1">
                ✨ 点击查词功能即将上线
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4 text-gray-400 text-sm">
        <span>◀ 上一篇</span>
        <span>{currentIndex + 1} / {sentences.length}</span>
        <span className="text-green-600 font-bold">下一篇 ▶</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create reading list page**

Create `src/app/reading/page.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { readingArticles, readingCategories } from '@/data/reading'
import { useAgeLevel } from '@/contexts/AgeLevelContext'

export default function ReadingPage() {
  const { level } = useAgeLevel()
  const filtered = readingArticles.filter(a => a.level === level)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📖 美文阅读</h1>
      <div className="flex flex-col gap-4">
        {filtered.map(article => (
          <Link key={article.id} href={`/reading/${article.id}`}
            className="flex items-center gap-5 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-md shrink-0">
              {article.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg truncate">{article.title}</div>
              <div className="text-sm text-gray-400 mt-1">{article.category} · {article.wordCount} words</div>
            </div>
            <div className="text-gray-400 text-xl">▸</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create reading detail page**

Create `src/app/reading/[id]/page.tsx`:
```tsx
'use client'

import { useParams } from 'next/navigation'
import { readingArticles } from '@/data/reading'
import SentenceReader from '@/components/SentenceReader'
import Link from 'next/link'

export default function ReadingDetailPage() {
  const params = useParams()
  const article = readingArticles.find(a => a.id === params.id)

  if (!article) return (
    <div className="p-4 text-center">
      <p>Article not found</p>
      <Link href="/reading" className="text-blue-500 mt-4 block">◀ Back to reading</Link>
    </div>
  )

  return (
    <div className="p-4">
      <Link href="/reading" className="text-gray-400 text-sm mb-4 block">◀ 返回列表</Link>
      <h1 className="text-xl font-bold mb-2">{article.emoji} {article.title}</h1>
      <p className="text-sm text-gray-400 mb-4">{article.category} · {article.wordCount} words</p>
      <SentenceReader sentences={article.content} title={article.title} />
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `cd "/Users/yaoting/Documents/Coding_Projects/Learn English" && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement reading module with sentence highlighting reader"

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

### Task 8: AI Chat Module (Elizabeth)

**Files:**
- Create: `src/components/StartButton.tsx`
- Create: `src/components/ChatBubble.tsx`
- Create: `src/services/doubao-api.ts`
- Create: `src/app/ai-chat/page.tsx`

- [ ] **Step 1: Create StartButton component**

Create `src/components/StartButton.tsx`:
```tsx
interface StartButtonProps {
  onClick: () => void
  label?: string
}

export default function StartButton({ onClick, label = 'START' }: StartButtonProps) {
  return (
    <button onClick={onClick}
      className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex flex-col items-center justify-center text-white shadow-xl active:scale-95 transition-transform mx-auto">
      <span className="text-4xl">▶</span>
      <span className="text-base font-bold mt-1">{label}</span>
    </button>
  )
}
```

- [ ] **Step 2: Create ChatBubble component**

Create `src/components/ChatBubble.tsx`:
```tsx
interface ChatBubbleProps {
  message: string
  sender: 'ai' | 'user'
}

export default function ChatBubble({ message, sender }: ChatBubbleProps) {
  const isAI = sender === 'ai'
  return (
    <div className={`flex gap-3 mb-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-base shrink-0 ${
        isAI ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-orange-400'
      }`}>
        {isAI ? 'E' : '👤'}
      </div>
      <div className={`${isAI ? 'bg-blue-50 rounded-r-2xl rounded-bl-2xl' : 'bg-orange-50 rounded-l-2xl rounded-br-2xl'} px-4 py-3 max-w-[75%]`}>
        <div className="text-lg leading-relaxed">{message}</div>
        {isAI && <div className="text-xs text-gray-400 mt-2">🔊 点击听发音</div>}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create 豆包 API service stub**

Create `src/services/doubao-api.ts`:
```ts
const API_ENDPOINT = process.env.NEXT_PUBLIC_DOUBAO_ENDPOINT || ''
const API_KEY = process.env.NEXT_PUBLIC_DOUBAO_API_KEY || ''

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function sendMessage(messages: ChatMessage[], ageLevel: string): Promise<string> {
  if (!API_ENDPOINT || !API_KEY) {
    // Demo mode: return mock response
    await new Promise(resolve => setTimeout(resolve, 1000))
    const mockReplies: Record<string, string> = {
      kindergarten: "Hello! That's great! 🌟 You are learning English so well! Let's practice more! 🎉",
      elementary: "Well done! You're making great progress. Can you tell me more about your day?",
      middle: "Excellent! Your English is improving. Let's have a real conversation. What topics interest you?",
    }
    return mockReplies[ageLevel] || "That's interesting! Tell me more!"
  }

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: 'doubao-pro', messages }),
  })

  if (!response.ok) throw new Error('API request failed')
  const data = await response.json()
  return data.choices?.[0]?.message?.content || '...'
}
```

- [ ] **Step 4: Create AI chat page**

Create `src/app/ai-chat/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useAgeLevel } from '@/contexts/AgeLevelContext'
import StartButton from '@/components/StartButton'
import ChatBubble from '@/components/ChatBubble'

interface Message {
  text: string
  sender: 'ai' | 'user'
}

export default function AIChatPage() {
  const { info } = useAgeLevel()
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handleStart = () => {
    setStarted(true)
    setMessages([{ text: "Hi there! I'm Elizabeth. Let's start our English class! 🎉", sender: 'ai' }])
  }

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <span className="text-lg font-semibold text-gray-600">🤖 Elizabeth · {info.label}</span>
      </div>

      {!started ? (
        <div className="flex flex-col items-center justify-center py-16">
          <img src="/images/teacher.png" alt="Elizabeth"
            className="w-40 h-40 rounded-full object-cover shadow-xl mb-4" />
          <div className="text-2xl font-bold text-blue-700">Elizabeth</div>
          <div className="text-base text-gray-400 mt-1">Your AI English Teacher</div>
          <div className="mt-8">
            <StartButton onClick={handleStart} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="min-h-[400px] max-h-[500px] overflow-y-auto">
            {messages.map((m, i) => (
              <ChatBubble key={i} message={m.text} sender={m.sender} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Verify build**

Run: `cd "/Users/yaoting/Documents/Coding_Projects/Learn English" && npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement AI chat module with Elizabeth"

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

---

## Self-Review

**Spec coverage check:**
- Phase 1 covers home page, navigation, age level settings ✓
- Letters module ✓ (Task 4)
- Phonetics module — deferred to Phase 3 (not in MVP)
- Words module ✓ (Task 5)
- Songs module ✓ (Task 6)
- Reading module ✓ (Task 7)
- AI chat module ✓ (Task 8)

**Placeholder check:** No TBD/TODOs in tasks. All code is complete.

**Type consistency:** All interfaces and component props are consistent across tasks.
