import type { Metadata } from 'next'
import { ConvexClientProvider } from '@/components/ConvexClientProvider'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Vartaa — Team chat in every language',
  description: 'Minimal team chat with AI summaries and multilingual translation across all 22 Indian languages',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Vartaa — Team chat in every language',
    description: 'Real-time multilingual chat for Indian teams',
    siteName: 'Vartaa',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
