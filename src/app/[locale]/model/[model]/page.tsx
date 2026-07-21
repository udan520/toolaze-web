import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { GptImage2LandingPage } from '@/components/GptImage2LandingPage'
import { getGptImage2PageMetadata } from '@/lib/gpt-image-2-landing-copy'
import { Seedream45LandingPage } from '@/components/Seedream45LandingPage'
import { getSeedream45PageMetadata } from '@/lib/seedream-4-5-landing-copy'
import { Wan27ImageLandingPage } from '@/components/Wan27ImageLandingPage'
import { getWan27ImagePageMetadata } from '@/lib/wan-2-7-image-landing-copy'
import { Seedream50LiteLandingPage } from '@/components/Seedream50LiteLandingPage'
import { getSeedream50LitePageMetadata } from '@/lib/seedream-5-0-lite-landing-copy'
import { Seedream50ProLandingPage } from '@/components/Seedream50ProLandingPage'
import { getSeedream50ProPageMetadata } from '@/lib/seedream-5-0-pro-landing-copy'
import { GrokImagineVideo15LandingPage } from '@/components/GrokImagineVideo15LandingPage'
import { getGrokImagineVideo15PageMetadata } from '@/lib/grok-imagine-video-1-5-landing-copy'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

const MODEL_TOOL_MAP: Record<string, string> = {
  'nano-banana-2': 'nano-banana-2',
  'nano-banana-pro': 'nano-banana-pro',
  'gpt-image-2': 'gpt-image-2',
  'gpt-image-2-0': 'gpt-image-2',
  'seedream-4-5': 'seedream-4-5',
  'seedream-5-0-lite': 'seedream-5-0-lite',
  'seedream-5-0-pro': 'seedream-5-0-pro',
  'wan-2-7-image': 'wan-2-7-image',
  'seedance-2-5': 'seedance-2-5',
  'seedance-2': 'seedance-2',
  'kling-3': 'kling-3',
  'grok-imagine-video-1-5': 'grok-imagine-video-1-5',
}

interface PageProps {
  params: Promise<{
    locale: string
    model: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, model } = await params
  const tool = MODEL_TOOL_MAP[model]
  const canonicalModel = model === 'gpt-image-2-0' ? 'gpt-image-2' : model

  if (!tool || !SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    return {}
  }

  if (tool === 'gpt-image-2') {
    const canonicalPath = locale === 'en' ? `/model/${canonicalModel}` : `/${locale}/model/${canonicalModel}`
    return getGptImage2PageMetadata(locale, `https://toolaze.com${canonicalPath}`)
  }

  if (tool === 'seedream-4-5') {
    return getSeedream45PageMetadata(locale, `https://toolaze.com/${locale}/model/${model}`)
  }

  if (tool === 'wan-2-7-image') {
    return getWan27ImagePageMetadata(locale, `https://toolaze.com/${locale}/model/${model}`)
  }

  if (tool === 'seedream-5-0-lite') {
    return getSeedream50LitePageMetadata(locale, `https://toolaze.com/${locale}/model/${model}`)
  }

  if (tool === 'seedream-5-0-pro') {
    return getSeedream50ProPageMetadata(locale, `https://toolaze.com/${locale}/model/${model}`)
  }

  if (tool === 'grok-imagine-video-1-5') {
    return getGrokImagineVideo15PageMetadata(locale, `https://toolaze.com/${locale}/model/${model}`)
  }

  const content = await getL2SeoContent(tool, locale)
  const metadata = content?.metadata as { title?: string; description?: string } | undefined

  return {
    title: metadata?.title || `${model} | Toolaze`,
    description: metadata?.description || `Use ${model} online with Toolaze.`,
    robots: 'index, follow',
    alternates: {
      canonical: `https://toolaze.com/${locale}/model/${model}`,
    },
  }
}

export function generateStaticParams(): Array<{ locale: string; model: string }> {
  const params: Array<{ locale: string; model: string }> = []
  /** 全 locale × 全 model：不支持语种的组合在运行时 redirect 到英文 canonical，避免静态导出 404 */
  for (const model of Object.keys(MODEL_TOOL_MAP)) {
    for (const locale of SUPPORTED_LOCALES) {
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

  if (model === 'gpt-image-2-0') {
    permanentRedirect(locale === 'en' ? '/model/gpt-image-2' : `/${locale}/model/gpt-image-2`)
  }

  if (locale === 'en') {
    redirect(`/model/${model}`)
  }

  if (
    tool !== 'gpt-image-2' &&
    tool !== 'seedream-4-5' &&
    tool !== 'wan-2-7-image' &&
    tool !== 'seedream-5-0-lite' &&
    tool !== 'seedream-5-0-pro' &&
    tool !== 'grok-imagine-video-1-5' &&
    !hasLocaleL2JsonFile(tool, locale)
  ) {
    redirect(`/model/${model}`)
  }

  if (tool === 'gpt-image-2') {
    return <GptImage2LandingPage locale={locale} />
  }

  if (tool === 'seedream-4-5') {
    return <Seedream45LandingPage locale={locale} />
  }

  if (tool === 'wan-2-7-image') {
    return <Wan27ImageLandingPage locale={locale} />
  }

  if (tool === 'seedream-5-0-lite') {
    return <Seedream50LiteLandingPage locale={locale} />
  }

  if (tool === 'seedream-5-0-pro') {
    return <Seedream50ProLandingPage locale={locale} />
  }

  if (tool === 'grok-imagine-video-1-5') {
    return <GrokImagineVideo15LandingPage locale={locale} />
  }

  return <ToolL2PageContent locale={locale} tool={tool} />
}
