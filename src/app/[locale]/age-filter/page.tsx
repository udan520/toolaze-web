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
  const hreflang = generateHreflangAlternates(locale, '/age-filter')
  const content = await getL2SeoContent('age-filter', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free AI Age Filter Online – No Sign-Up | Toolaze',
    fallbackDescription: 'Use the free AI Age Filter online with no sign-up. Upload one photo and see a baby, child, young adult, middle-aged, or older-adult look.',
  })
}

export default async function AgeFilterLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en' || !hasLocaleL2JsonFile('age-filter', locale)) {
    redirect('/age-filter')
  }

  return <ToolL2PageContent locale={locale} tool="age-filter" />
}
