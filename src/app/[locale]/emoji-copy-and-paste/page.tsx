import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/emoji-copy-and-paste'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)

  const content = await getL2SeoContent('emoji-copy-and-paste', locale)

  return {
    title: content?.metadata?.title || 'Emoji Copy & Paste - Copy Emojis Online Free | Toolaze',
    description: content?.metadata?.description || 'Copy and paste emojis online for free. Browse by category, search, pick skin tone, and copy instantly. No sign-up required.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function EmojiCopyAndPasteLocalePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  return <ToolL2PageContent locale={locale} tool="emoji-copy-and-paste" />
}
