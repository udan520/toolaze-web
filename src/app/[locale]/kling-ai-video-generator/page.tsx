import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { redirect } from 'next/navigation'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps { params: Promise<{ locale: string }> }

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale = 'en' } = await params
  const hreflang = generateHreflangAlternates(locale, '/kling-ai-video-generator')
  const content = await getL2SeoContent('kling-ai-video-generator', locale)

  return {
    title: content?.metadata?.title || 'Kling AI Video Generator Online | Toolaze',
    description: content?.metadata?.description || 'Create short AI videos with Kling 3.0 from text or reference images in Toolaze.',
    robots: 'index, follow',
    alternates: { canonical: hreflang.canonical, languages: hreflang.languages },
  }
}

export default async function KlingAiVideoGeneratorLocalePage({ params }: PageProps) {
  const { locale = 'en' } = await params
  if (locale === 'en' || !hasLocaleL2JsonFile('kling-ai-video-generator', locale)) {
    redirect('/kling-ai-video-generator')
  }
  return <ToolL2PageContent locale={locale} tool="kling-ai-video-generator" />
}
