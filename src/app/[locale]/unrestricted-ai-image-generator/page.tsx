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
  const pathWithoutLocale = '/unrestricted-ai-image-generator'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('unrestricted-ai-image-generator', locale)

  return {
    title:
      content?.metadata?.title ||
      'Unrestricted AI Image Generator Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Create broader AI image concepts online with text-to-image, image-to-image, direct prompt control, and clear creative boundaries.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function UnrestrictedAiImageGeneratorLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/unrestricted-ai-image-generator')
  }

  if (!hasLocaleL2JsonFile('unrestricted-ai-image-generator', locale)) {
    redirect('/unrestricted-ai-image-generator')
  }

  return <ToolL2PageContent locale={locale} tool="unrestricted-ai-image-generator" />
}
