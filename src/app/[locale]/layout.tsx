import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { generateHreflangAlternates } from '@/lib/hreflang'

interface LayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

// 确保静态生成
export const dynamic = 'force-static'
export const dynamicParams = false

// 为静态导出生成所有语言版本的参数
export async function generateStaticParams(): Promise<Array<{ locale: string }>> {
  // 严格定义有效的 locale 列表
  const validLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  
  // 确保返回的数组不为空
  if (validLocales.length === 0) {
    console.warn('No valid locales found, using default "en"')
    return [{ locale: 'en' }]
  }
  
  // 返回所有有效的 locale 参数
  return validLocales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const resolvedParams = await params
  const localeParam = resolvedParams.locale || 'en'
  
  // 验证 locale 是否是有效的语言代码
  const validLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  const locale = validLocales.includes(localeParam) ? localeParam : 'en'
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
        { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const resolvedParams = await params
  const localeParam = resolvedParams.locale || 'en'
  
  // 验证 locale 是否是有效的语言代码
  const validLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  if (!validLocales.includes(localeParam)) {
    // 如果不是有效的 locale，返回 404
    const { notFound } = await import('next/navigation')
    notFound()
    return null
  }
  
  const locale = localeParam
  
  return <>{children}</>
}
