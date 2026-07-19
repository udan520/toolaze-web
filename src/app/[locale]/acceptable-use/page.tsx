import type { Metadata } from 'next'
import SupportPolicyPageContent from '@/app/support-pages/SupportPolicyPageContent'
import { SUPPORT_PAGE_LOCALES, getSupportPolicyCopy } from '@/app/support-pages/support-page-copy'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations } from '@/lib/seo-loader'

const PATH = '/acceptable-use'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return SUPPORT_PAGE_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const copy = getSupportPolicyCopy('acceptableUse', locale)
  const hreflang = generateHreflangAlternates(locale, PATH)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function LocalizedAcceptableUsePage({ params }: PageProps) {
  const { locale } = await params
  const t = await loadCommonTranslations(locale)

  return (
    <SupportPolicyPageContent
      locale={locale}
      copy={getSupportPolicyCopy('acceptableUse', locale)}
      initialTranslations={t}
    />
  )
}
