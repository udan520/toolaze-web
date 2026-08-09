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

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'en').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/ai-hair-color-changer'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('ai-hair-color-changer', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Hair Color Changer Online - Change Hair Color with AI | Toolaze',
    fallbackDescription: 'Upload a portrait and preview new hair colors online with AI image-to-image editing.',
  })
}

export default async function AiHairColorChangerLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/ai-hair-color-changer')
  }

  if (!hasLocaleL2JsonFile('ai-hair-color-changer', locale)) {
    redirect('/ai-hair-color-changer')
  }

  return <ToolL2PageContent locale={locale} tool="ai-hair-color-changer" />
}
