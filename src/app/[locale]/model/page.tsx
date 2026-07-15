import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ModelPageContent } from '@/app/model/ModelPageContent'
import {
  MODEL_PAGE_LOCALES,
  getModelPageCopy,
  getModelPageMetadata,
  isModelPageLocale,
} from '@/app/model/copy'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations } from '@/lib/seo-loader'

const SUPPORTED_LOCALES = MODEL_PAGE_LOCALES

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isModelPageLocale(locale)) return {}

  const hreflang = generateHreflangAlternates(locale, '/model')
  return getModelPageMetadata(locale, hreflang.canonical)
}

export default async function LocalizedModelIndexPage({ params }: PageProps) {
  const { locale } = await params

  if (!isModelPageLocale(locale)) {
    notFound()
  }

  if (locale === 'en') {
    redirect('/model')
  }

  const [copy, translations] = await Promise.all([
    Promise.resolve(getModelPageCopy(locale)),
    loadCommonTranslations(locale),
  ])

  return <ModelPageContent locale={locale} pageCopy={copy} initialTranslations={translations} />
}
