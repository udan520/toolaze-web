import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import {
  AI_IMAGE_TO_IMAGE_GENERATOR_LOCALES,
  getAiImageToImageGeneratorPageCopy,
  isAiImageToImageGeneratorLocale,
} from '@/app/ai-image-to-image-generator/copy'
import { AiImageGeneratorPageContent } from '@/components/AiImageGeneratorPageContent'
import { generateHreflangAlternates } from '@/lib/hreflang'

const SUPPORTED_LOCALES = AI_IMAGE_TO_IMAGE_GENERATOR_LOCALES

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

  if (!isAiImageToImageGeneratorLocale(locale)) {
    return {}
  }

  const copy = getAiImageToImageGeneratorPageCopy(locale)
  const hreflang = generateHreflangAlternates(locale, '/ai-image-to-image-generator')

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

export default async function AiImageToImageGeneratorLocalePage({ params }: PageProps) {
  const { locale } = await params

  if (!isAiImageToImageGeneratorLocale(locale)) {
    notFound()
  }

  if (locale === 'en') {
    redirect('/ai-image-to-image-generator')
  }

  return (
    <AiImageGeneratorPageContent
      locale={locale}
      pageCopy={getAiImageToImageGeneratorPageCopy(locale)}
      toolId="ai-image-to-image-generator-tool"
      heroPrefix=""
      dailyLimitStorageKey="ai_image_to_image_generator_last_used_date"
    />
  )
}
