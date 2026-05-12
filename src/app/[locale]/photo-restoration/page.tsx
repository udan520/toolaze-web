import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/photo-restoration'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)

  const content = await getL2SeoContent('photo-restoration', locale)

  return {
    title: content?.metadata?.title || 'Free Photo Restoration Online - Restore Old Photos with AI | Toolaze',
    description:
      content?.metadata?.description ||
      'Restore old photos online free with AI. Remove scratches, dust, and noise, and improve details in one click.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function PhotoRestorationLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale !== 'en' && !hasLocaleL2JsonFile('photo-restoration', locale)) {
    redirect('/photo-restoration')
  }

  return <ToolL2PageContent locale={locale} tool="photo-restoration" />
}
