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
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/bangs-filter'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('bangs-filter', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Bangs Filter Online | No Signup | Toolaze',
    fallbackDescription: 'Use the free Bangs Filter with no signup. Upload one portrait and preview curtain bangs, wispy bangs, blunt bangs, side bangs, and more.',
  })
}

export default async function BangsFilterLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/bangs-filter')
  }

  if (!hasLocaleL2JsonFile('bangs-filter', locale)) {
    redirect('/bangs-filter')
  }

  return <ToolL2PageContent locale={locale} tool="bangs-filter" />
}
