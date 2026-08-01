import { getAllSlugs } from '@/lib/seo-loader'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllSlugs('seedance-2', 'en')
  const redirectSlugs = [...new Set([...slugs, 'ai-video-generator'])]

  return SUPPORTED_LOCALES.flatMap((locale) =>
    redirectSlugs.map((slug) => ({
      locale,
      slug,
    })),
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = SUPPORTED_LOCALES.includes(resolvedParams.locale as (typeof SUPPORTED_LOCALES)[number])
    ? resolvedParams.locale
    : 'en'
  const canonicalPath = locale === 'en' ? '/model/seedance-2' : `/${locale}/model/seedance-2`

  return {
    title: 'Redirecting to Seedance 2.0 | Toolaze',
    robots: { index: false, follow: true },
    alternates: {
      canonical: `https://toolaze.com${canonicalPath}`,
    },
  }
}

export default async function LocalizedSeedanceModelSlugRedirect({ params }: PageProps) {
  const resolvedParams = await params

  if (!SUPPORTED_LOCALES.includes(resolvedParams.locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
    return null
  }

  permanentRedirect(
    resolvedParams.locale === 'en'
      ? '/model/seedance-2'
      : `/${resolvedParams.locale}/model/seedance-2`,
  )
}
