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
  const pathWithoutLocale = '/buzz-cut-filter'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('buzz-cut-filter', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Buzz Cut Filter Online | No Signup | Toolaze',
    fallbackDescription: 'Use the free Buzz Cut Filter with no signup. Upload one portrait and preview a realistic buzz cut while preserving your face and the rest of the photo.',
  })
}

export default async function BuzzCutFilterLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/buzz-cut-filter')
  }

  if (!hasLocaleL2JsonFile('buzz-cut-filter', locale)) {
    redirect('/buzz-cut-filter')
  }

  return <ToolL2PageContent locale={locale} tool="buzz-cut-filter" />
}
