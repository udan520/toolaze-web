import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import './globals.css'
import ErrorSuppressor from '@/components/ErrorSuppressor'

export const metadata: Metadata = {
  title: 'Toolaze - Free AI Image Compressor & Local Tools',
  description: 'Compress images locally in your browser. No server uploads, 100% private, free AI tools for creators.',
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  themeColor: '#4F46E5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Toolaze',
  },
  alternates: {
    canonical: 'https://toolaze.com',
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
        {/* Google Analytics - Must be at the end of body for static export */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8KFZMZZ67F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8KFZMZZ67F');
          `}
        </Script>
      </body>
    </html>
  )
}
