import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { redirect } from 'next/navigation'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'en').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale = 'en' } = await params
  const content = await getL2SeoContent('talking-avatar-creator', locale)
  const hreflang = generateHreflangAlternates(locale, '/talking-avatar-creator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Talking Avatar Creator Online | Toolaze',
    fallbackDescription: 'Create an AI talking avatar video from one portrait image and one voice audio file with lip sync, facial motion, and short-form video output.',
  })
}

export default async function TalkingAvatarCreatorLocalePage({ params }: PageProps) {
  const { locale = 'en' } = await params
  if (locale === 'en' || !hasLocaleL2JsonFile('talking-avatar-creator', locale)) {
    redirect('/talking-avatar-creator')
  }

  return <ToolL2PageContent locale={locale} tool="talking-avatar-creator" />
}
