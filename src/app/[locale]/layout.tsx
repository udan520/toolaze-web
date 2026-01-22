import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { generateHreflangAlternates } from '@/lib/hreflang'

interface LayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

// 为静态导出生成所有语言版本的参数
export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const hreflang = generateHreflangAlternates(locale)
  
  return {
    metadataBase: new URL('https://toolaze.com'),
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
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
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  
  return <>{children}</>
}
