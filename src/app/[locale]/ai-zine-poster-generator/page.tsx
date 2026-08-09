import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams(): Array<{ locale: string }> {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const hreflang = generateHreflangAlternates(locale, '/ai-zine-poster-generator')
  const content = await getL2SeoContent('ai-zine-poster-generator', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Zine Poster Generator | Photo to Paper Poster | Toolaze',
    fallbackDescription: 'Upload one photo and turn the main subject into a quiet zine-style AI poster with paper texture, sparse type, negative space, and one vivid color accent.',
  })
}

export default async function AiZinePosterGeneratorLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/ai-zine-poster-generator')
  }

  if (!hasLocaleL2JsonFile('ai-zine-poster-generator', locale)) {
    redirect('/ai-zine-poster-generator')
  }

  return <ToolL2PageContent locale={locale} tool="ai-zine-poster-generator" />
}
