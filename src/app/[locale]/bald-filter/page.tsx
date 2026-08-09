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
  const pathWithoutLocale = '/bald-filter'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('bald-filter', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Bald Filter Online | No Signup | Toolaze',
    fallbackDescription: 'Use the free Bald Filter with no signup. Upload one portrait and preview a realistic shaved-head look while preserving your face and the rest of the photo.',
  })
}

export default async function BaldFilterLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/bald-filter')
  }

  if (!hasLocaleL2JsonFile('bald-filter', locale)) {
    redirect('/bald-filter')
  }

  return <ToolL2PageContent locale={locale} tool="bald-filter" />
}
