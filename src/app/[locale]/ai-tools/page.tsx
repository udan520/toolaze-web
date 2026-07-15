import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { AiToolsPageContent } from '@/app/ai-tools/AiToolsPageContent'
import {
  AI_TOOLS_LOCALES,
  getAiToolsPageCopy,
  getAiToolsPageMetadata,
  isAiToolsLocale,
} from '@/app/ai-tools/copy'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations } from '@/lib/seo-loader'

const SUPPORTED_LOCALES = AI_TOOLS_LOCALES

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isAiToolsLocale(locale)) return {}

  const hreflang = generateHreflangAlternates(locale, '/ai-tools')
  return getAiToolsPageMetadata(locale, hreflang.canonical)
}

export default async function AiToolsLocalePage({ params }: PageProps) {
  const { locale } = await params

  if (!isAiToolsLocale(locale)) {
    notFound()
  }

  if (locale === 'en') {
    redirect('/ai-tools')
  }

  const [copy, translations] = await Promise.all([
    Promise.resolve(getAiToolsPageCopy(locale)),
    loadCommonTranslations(locale),
  ])

  return <AiToolsPageContent locale={locale} pageCopy={copy} initialTranslations={translations} />
}
