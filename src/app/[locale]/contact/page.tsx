import type { Metadata } from 'next'
import ContactPageContent from '@/app/support-pages/ContactPageContent'
import { SUPPORT_PAGE_LOCALES, getContactPageCopy } from '@/app/support-pages/support-page-copy'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations } from '@/lib/seo-loader'

const PATH = '/contact'

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
  const copy = getContactPageCopy(locale)
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

export default async function LocalizedContactPage({ params }: PageProps) {
  const { locale } = await params
  const t = await loadCommonTranslations(locale)

  return <ContactPageContent locale={locale} copy={getContactPageCopy(locale)} initialTranslations={t} />
}
