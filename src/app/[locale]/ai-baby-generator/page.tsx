import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'

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
  const pathWithoutLocale = '/ai-baby-generator'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)

  const content = await getL2SeoContent('ai-baby-generator', locale)

  return {
    title:
      content?.metadata?.title ||
      'AI Baby Generator Online Free - Create Future Baby Photos | Toolaze',
    description:
      content?.metadata?.description ||
      'Use Toolaze AI Baby Generator online free. Upload parent photos, choose a baby portrait style, and create cute future baby images in seconds.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function AiBabyGeneratorLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'

  if (locale === 'en') {
    redirect('/ai-baby-generator')
  }

  if (!hasLocaleL2JsonFile('ai-baby-generator', locale)) {
    redirect('/ai-baby-generator')
  }

  return <ToolL2PageContent locale={locale} tool="ai-baby-generator" />
}
