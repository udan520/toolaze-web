import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

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
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/font-generator'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  const content = await getL2SeoContent('font-generator', locale)
  
  return {
    title: content?.metadata?.title || 'Free Font Generator - Create Custom Fonts Online | Toolaze',
    description: content?.metadata?.description || 'Generate custom fonts online for free. Create cursive, fancy, bold, italic, gothic, and tattoo fonts. Copy and paste instantly. No sign-up required.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function FontGeneratorPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  return <ToolL2PageContent locale={locale} tool="font-generator" />
}
