import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

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
  const hreflang = generateHreflangAlternates(locale, '/ai-photo-abstract-poster-generator')
  const content = await getL2SeoContent('ai-photo-abstract-poster-generator', locale)

  return {
    title:
      content?.metadata?.title ||
      'Photo Abstract Poster Generator | Photo to Memory Panel | Toolaze',
    description:
      content?.metadata?.description ||
      'Upload one photo and create a browser-composed abstract poster with the original image preserved above, a sparse memory panel below, and a short poetic English title.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function AiPhotoAbstractPosterGeneratorLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/ai-photo-abstract-poster-generator')
  }

  if (!hasLocaleL2JsonFile('ai-photo-abstract-poster-generator', locale)) {
    redirect('/ai-photo-abstract-poster-generator')
  }

  return <ToolL2PageContent locale={locale} tool="ai-photo-abstract-poster-generator" />
}
