import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import { notFound, redirect } from 'next/navigation'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

const MODEL_TOOL_MAP: Record<string, string> = {
  'nano-banana-2': 'nano-banana-2',
  'nano-banana-pro': 'nano-banana-pro',
  'gpt-image-2': 'gpt-image-2',
  'gpt-image-2-0': 'gpt-image-2',
  'seedance-2': 'seedance-2',
  'kling-3': 'kling-3',
}

const MODEL_SUPPORTED_LOCALES: Record<string, readonly string[]> = {
  'nano-banana-2': SUPPORTED_LOCALES,
  'gpt-image-2': SUPPORTED_LOCALES,
  'gpt-image-2-0': SUPPORTED_LOCALES,
  'nano-banana-pro': ['en'],
  'seedance-2': ['en'],
  'kling-3': ['en'],
}

interface PageProps {
  params: Promise<{
    locale: string
    model: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams(): Array<{ locale: string; model: string }> {
  const params: Array<{ locale: string; model: string }> = []

  for (const model of Object.keys(MODEL_SUPPORTED_LOCALES)) {
    const locales = MODEL_SUPPORTED_LOCALES[model] || ['en']
    for (const locale of locales) {
      params.push({ locale, model })
    }
  }

  return params
}

export default async function LocalizedModelPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const model = resolvedParams.model

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
    return null
  }

  const tool = MODEL_TOOL_MAP[model]
  if (!tool) {
    notFound()
    return null
  }

  const supportedLocales = MODEL_SUPPORTED_LOCALES[model] || ['en']
  if (!supportedLocales.includes(locale)) {
    redirect(`/model/${model}`)
  }

  if (locale === 'en') {
    redirect(`/model/${model}`)
  }

  return <ToolL2PageContent locale={locale} tool={tool} />
}
