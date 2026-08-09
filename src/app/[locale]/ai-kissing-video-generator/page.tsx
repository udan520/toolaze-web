import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps {
  params: Promise<{
    locale: string
  }>
}
export const dynamic = 'force-static'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'en').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/ai-kissing-video-generator'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('ai-kissing-video-generator', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Kissing Video Generator Online | Create AI Kiss Videos',
    fallbackDescription: 'Use Toolaze AI Kissing Video Generator online to turn photos into short romantic kiss videos for couple edits, story reels, and social clips.',
  })
}

export default async function AiKissingVideoGeneratorLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/ai-kissing-video-generator')
  }

  if (!hasLocaleL2JsonFile('ai-kissing-video-generator', locale)) {
    redirect('/ai-kissing-video-generator')
  }

  return <ToolL2PageContent locale={locale} tool="ai-kissing-video-generator" />
}
