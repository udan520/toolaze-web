import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps { params: Promise<{ locale: string }> }

export const dynamic = 'force-static'
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale = 'en' } = await params
  const hreflang = generateHreflangAlternates(locale, '/ai-asmr-video-generator')
  const content = await getL2SeoContent('ai-asmr-video-generator', locale)
  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI ASMR Video Generator with Sound | Toolaze',
    fallbackDescription: 'Create tactile AI ASMR videos with synchronized sound from text or an image.',
  })
}

export default async function AiAsmrVideoGeneratorLocalePage({ params }: PageProps) {
  const { locale = 'en' } = await params
  if (locale === 'en' || !hasLocaleL2JsonFile('ai-asmr-video-generator', locale)) {
    redirect('/ai-asmr-video-generator')
  }
  return <ToolL2PageContent locale={locale} tool="ai-asmr-video-generator" />
}
