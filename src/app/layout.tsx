import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import ErrorSuppressor from '@/components/ErrorSuppressor'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: 'Toolaze - Free AI Image Compressor & Local Tools',
  description: 'Compress images locally in your browser. No server uploads, 100% private, free AI tools for creators.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen overflow-x-hidden font-sans antialiased" suppressHydrationWarning>
        <ErrorSuppressor />
        {children}
        <GoogleAnalytics gaId="G-8KFZMZZ67F" />
      </body>
    </html>
  )
}
