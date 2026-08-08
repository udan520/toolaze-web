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
  const pathWithoutLocale = '/perm-filter'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('perm-filter', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Perm Filter Online | AI Perm Filter | Toolaze',
    fallbackDescription: 'Use the free AI Perm Filter. Upload one portrait and preview soft wave, loose digital, curly bob, spiral, Korean volume, and men’s perm styles.',
  })
}

export default async function PermFilterLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/perm-filter')
  }

  if (!hasLocaleL2JsonFile('perm-filter', locale)) {
    redirect('/perm-filter')
  }

  return <ToolL2PageContent locale={locale} tool="perm-filter" />
}
