import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import {
  AI_IMAGE_GENERATOR_LOCALES,
  getAiImageGeneratorPageCopy,
} from '@/app/ai-image-generator/copy'
import { AiImageGeneratorPageContent } from '@/components/AiImageGeneratorPageContent'

const SUPPORTED_LOCALES = AI_IMAGE_GENERATOR_LOCALES

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

  const copy = getAiImageGeneratorPageCopy(locale)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: locale === 'en'
        ? 'https://toolaze.com/ai-image-generator'
        : `https://toolaze.com/${locale}/ai-image-generator`,
    },
  }
}

export default async function AiImageGeneratorLocalePage({ params }: PageProps) {
  const { locale } = await params

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
    return null
  }

  if (locale === 'en') {
    redirect('/ai-image-generator')
  }

  return <AiImageGeneratorPageContent locale={locale} />
}
