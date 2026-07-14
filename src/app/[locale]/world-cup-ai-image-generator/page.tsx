import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import WorldCupAiImageGeneratorPageContent from '@/components/WorldCupAiImageGeneratorPageContent'
import { SUPPORTED_WORLD_CUP_LOCALES, getWorldCupPageCopy } from '@/app/world-cup-ai-image-generator/copy'

const SUPPORTED_LOCALES = SUPPORTED_WORLD_CUP_LOCALES

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams(): Array<{ locale: string }> {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    return {}
  }

  const copy = getWorldCupPageCopy(locale)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: `https://toolaze.com/${locale}/world-cup-ai-image-generator`,
    },
  }
}

export default async function LocalizedWorldCupAiImageGeneratorPage({ params }: PageProps) {
  const { locale } = await params

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
    return null
  }

  if (locale === 'en') {
    redirect('/world-cup-ai-image-generator')
  }

  return <WorldCupAiImageGeneratorPageContent locale={locale} />
}
