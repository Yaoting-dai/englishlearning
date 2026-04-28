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
  const { info } = useAgeLevel()

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
        <div className="flex items-center gap-3">
          <Link href="/report" className="flex items-center gap-1 hover:text-blue-500">📈 报告</Link>
          <Link href="/settings" className="flex items-center gap-1 hover:text-blue-500">⚙️ 设置</Link>
        </div>
      </div>
    </nav>
  )
}
