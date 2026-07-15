import { HomePageMain } from '@/components/home/HomePageMain'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import type { Metadata } from 'next'


interface PageProps {
  params: Promise<{
    locale: string
  }>
}

// 为静态导出生成所有语言版本的参数
export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const localeParam = resolvedParams.locale || 'en'
  
  // 验证 locale 是否是有效的语言代码
  const validLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  const locale = validLocales.includes(localeParam) ? localeParam : 'en'
  const hreflang = generateHreflangAlternates(locale)
  
  // Load translations for metadata
  const t = await loadCommonTranslations(locale)
  const metadata = t?.home?.metadata || {
    title: 'Toolaze - AI Image Tools and Creative Utilities',
    description: 'Create, edit, compress, and convert images with AI tools, one-time credits, and clear usage policies.'
  }
  
  return {
    title: metadata.title,
    description: metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : locale.replace('-', '_'),
      url: hreflang.canonical,
      siteName: 'Toolaze',
      title: metadata.title,
      description: metadata.description,
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
      title: metadata.title,
      description: metadata.description,
      images: ['https://toolaze.com/web-app-manifest-512x512.png'],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
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
  
  return <HomePageMain locale={localeParam} />
}
