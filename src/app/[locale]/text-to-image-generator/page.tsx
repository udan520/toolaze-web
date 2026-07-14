import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import {
  TEXT_TO_IMAGE_GENERATOR_LOCALES,
  getTextToImageGeneratorPageCopy,
  isTextToImageGeneratorLocale,
} from '@/app/text-to-image-generator/copy'
import { AiImageGeneratorPageContent } from '@/components/AiImageGeneratorPageContent'
import { generateHreflangAlternates } from '@/lib/hreflang'

const SUPPORTED_LOCALES = TEXT_TO_IMAGE_GENERATOR_LOCALES

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

  if (!isTextToImageGeneratorLocale(locale)) {
    return {}
  }

  const copy = getTextToImageGeneratorPageCopy(locale)
  const hreflang = generateHreflangAlternates(locale, '/text-to-image-generator')

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

export default async function TextToImageGeneratorLocalePage({ params }: PageProps) {
  const { locale } = await params

  if (!isTextToImageGeneratorLocale(locale)) {
    notFound()
  }

  if (locale === 'en') {
    redirect('/text-to-image-generator')
  }

  return (
    <AiImageGeneratorPageContent
      locale={locale}
      pageCopy={getTextToImageGeneratorPageCopy(locale)}
      toolId="text-to-image-generator-tool"
      heroPrefix=""
      dailyLimitStorageKey="text_to_image_generator_last_used_date"
      pageUrl={`https://toolaze.com/${locale}/text-to-image-generator`}
      contentOrder="text-to-image"
    />
  )
}
