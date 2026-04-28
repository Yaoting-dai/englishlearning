import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AgeLevelProvider } from '@/contexts/AgeLevelContext'
import NavBar from '@/components/NavBar'
import PwaRegister from '@/components/PwaRegister'

export const metadata: Metadata = {
  title: 'Learn English - 幼儿英语启蒙',
  description: 'Interactive English learning for kids aged 3-15',
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 3,
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
          <PwaRegister />
        </AgeLevelProvider>
      </body>
    </html>
  )
}
