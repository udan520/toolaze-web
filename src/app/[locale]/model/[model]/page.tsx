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
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

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
  'veo-3-1-ai-video-generator': 'veo-3-1-ai-video-generator',
  'happyhorse-ai-video-generator': 'happyhorse-ai-video-generator',
  'wan-2-7-ai-video-generator': 'wan-2-7-ai-video-generator',
  'wan-3-0-ai-video-generator': 'wan-3-0-ai-video-generator',
  'wan-2-6-ai-video-generator': 'wan-2-6-ai-video-generator',
  'wan-2-5-ai-video-generator': 'wan-2-5-ai-video-generator',
  'pixverse-v6': 'pixverse-v6-ai-video-generator',
  'pixverse-v6-ai-video-generator': 'pixverse-v6-ai-video-generator',
  'happyhorse': 'happyhorse-ai-video-generator',
  'happyhorse-1-1': 'happyhorse-ai-video-generator',
  'seedance-2-5': 'seedance-2-5',
  'seedance-2': 'seedance-2',
  'kling-3': 'kling-3',
  'kling-3-motion-control': 'kling-3-motion-control',
  'kling-2-6-pro-motion-control': 'kling-2-6-pro-motion-control',
  'grok-imagine-video-1-5': 'grok-imagine-video-1-5',
}

const MODEL_REDIRECT_MAP: Record<string, string> = {
  'gpt-image-2-0': 'gpt-image-2',
  'pixverse-v6': 'pixverse-v6-ai-video-generator',
  'happyhorse': 'happyhorse-ai-video-generator',
  'happyhorse-1-1': 'happyhorse-ai-video-generator',
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
  const canonicalModel = MODEL_REDIRECT_MAP[model] || model

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
  const hreflang = generateHreflangAlternates(locale, `/model/${model}`)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: `${model} | Toolaze`,
    fallbackDescription: `Use ${model} online with Toolaze.`,
  })
}

export function generateStaticParams(): Array<{ locale: string; model: string }> {
  const params: Array<{ locale: string; model: string }> = []
  /** 非英语 locale × 全 model：不支持语种的组合在运行时 redirect 到英文 canonical，避免静态导出 404 */
  for (const model of Object.keys(MODEL_TOOL_MAP)) {
    for (const locale of SUPPORTED_LOCALES.filter((locale) => locale !== 'en')) {
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
  const canonicalModel = MODEL_REDIRECT_MAP[model] || model
  if (!tool) {
    notFound()
    return null
  }

  if (MODEL_REDIRECT_MAP[model]) {
    permanentRedirect(locale === 'en' ? `/model/${canonicalModel}` : `/${locale}/model/${canonicalModel}`)
  }

  if (locale === 'en') {
    redirect(`/model/${model}`)
  }

  if (
    tool !== 'gpt-image-2' &&
    tool !== 'seedream-4-5' &&
    tool !== 'wan-2-7-image' &&
    tool !== 'wan-3-0-ai-video-generator' &&
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
