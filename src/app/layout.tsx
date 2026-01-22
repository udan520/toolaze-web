import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import './globals.css'
import ErrorSuppressor from '@/components/ErrorSuppressor'
import HtmlLangSetter from '@/components/HtmlLangSetter'

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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolaze.com',
    siteName: 'Toolaze',
    title: 'Toolaze - Free AI Image Compressor & Local Tools',
    description: 'Compress images locally in your browser. No server uploads, 100% private, free AI tools for creators.',
    images: [
      {
        url: 'https://toolaze.com/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Toolaze Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolaze - Free AI Image Compressor & Local Tools',
    description: 'Compress images locally in your browser. No server uploads, 100% private, free AI tools for creators.',
    images: ['https://toolaze.com/web-app-manifest-512x512.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  // Organization Schema for Google Search Logo
  // Google requires logo to be at least 112x112px, square, and accessible
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toolaze',
    url: 'https://toolaze.com',
    logo: 'https://toolaze.com/web-app-manifest-512x512.png',
    image: 'https://toolaze.com/web-app-manifest-512x512.png',
    sameAs: [],
    description: 'Free AI Image Compressor & Local Tools - Professional image processing tools that run entirely in your browser.',
  }

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen overflow-x-hidden font-sans antialiased" suppressHydrationWarning>
        {/* Organization Schema for Google Search Logo */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* 在页面解析时立即设置正确的 lang 属性 */}
        <Script
          id="set-html-lang"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const path = window.location.pathname;
                const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'];
                const pathSegments = path.split('/').filter(Boolean);
                const firstSegment = pathSegments[0] || '';
                const locale = locales.includes(firstSegment) ? firstSegment : 'en';
                if (document.documentElement) {
                  document.documentElement.lang = locale;
                }
              })();
            `,
          }}
        />
        <HtmlLangSetter />
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
