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
  const pathWithoutLocale = '/ai-couple-photo-maker'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)

  const content = await getL2SeoContent('ai-couple-photo-maker', locale)

  return {
    title:
      content?.metadata?.title ||
      'AI Couple Photo Maker Online Free - Upload One Photo, Pick a Scene | Toolaze',
    description:
      content?.metadata?.description ||
      'Use AI Couple Photo Maker online free with Toolaze. Upload one or two couple photos, choose a preset scene, and generate realistic couple images in seconds.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function AiCouplePhotoMakerLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/ai-couple-photo-maker')
  }

  if (!hasLocaleL2JsonFile('ai-couple-photo-maker', locale)) {
    redirect('/ai-couple-photo-maker')
  }

  return <ToolL2PageContent locale={locale} tool="ai-couple-photo-maker" />
}
