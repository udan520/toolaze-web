import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.filter((locale) => locale !== 'en').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/watermark-remover'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)

  const content = await getL2SeoContent('watermark-remover', locale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Watermark Remover - Remove Watermark from Images with AI | Toolaze',
    fallbackDescription: 'Remove watermark from image online free. Erase watermarks from photos instantly with AI. JPG, PNG, WebP support. No sign-up required.',
  })
}

export default async function WatermarkRemoverLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale !== 'en' && !hasLocaleL2JsonFile('watermark-remover', locale)) {
    redirect('/watermark-remover')
  }

  return <ToolL2PageContent locale={locale} tool="watermark-remover" />
}
