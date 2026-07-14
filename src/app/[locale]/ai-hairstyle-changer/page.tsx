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

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/ai-hairstyle-changer'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('ai-hairstyle-changer', locale)

  return {
    title:
      content?.metadata?.title ||
      'Free AI Hairstyle Changer Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Upload one portrait and preview popular hairstyles online with editable presets and prompts.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function AiHairstyleChangerLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/ai-hairstyle-changer')
  }

  if (!hasLocaleL2JsonFile('ai-hairstyle-changer', locale)) {
    redirect('/ai-hairstyle-changer')
  }

  return <ToolL2PageContent locale={locale} tool="ai-hairstyle-changer" />
}
