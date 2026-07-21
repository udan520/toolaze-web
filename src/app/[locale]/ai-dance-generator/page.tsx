import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/ai-dance-generator'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('ai-dance-generator', locale)

  return {
    title:
      content?.metadata?.title ||
      'Free AI Dance Generator Online | Create Dance Visuals',
    description:
      content?.metadata?.description ||
      'Use Toolaze AI Dance Generator online to create dance posters, choreography concepts, thumbnails, and social visuals from text prompts.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function AiDanceGeneratorLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/ai-dance-generator')
  }

  if (!hasLocaleL2JsonFile('ai-dance-generator', locale)) {
    redirect('/ai-dance-generator')
  }

  return <ToolL2PageContent locale={locale} tool="ai-dance-generator" />
}
