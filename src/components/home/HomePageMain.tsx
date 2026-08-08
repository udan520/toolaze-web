import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HomeAiToolsTabs, { type HomeAiToolsTabCard } from '@/components/home/HomeAiToolsTabs'
import HomeTrendingToolsRail from '@/components/home/HomeTrendingToolsRail'
import HomeModelCardsRail, { type HomeModelCardsRailCard } from '@/components/home/HomeModelCardsRail'
import { loadCommonTranslations, IMAGE_MODEL_L2S, VIDEO_MODEL_L2S } from '@/lib/seo-loader'
import { HOME_ADVANCED_AI_TOOL_IDS } from '@/lib/homepage-grid-tools'
import { getHomeAdvancedAiCardImage } from '@/lib/home-advanced-ai-card-images'
import { getHomeModelCardImage } from '@/lib/home-model-card-images'
import { getSeedream45LandingCopy } from '@/lib/seedream-4-5-landing-copy'
import { getWan27ImageLandingCopy } from '@/lib/wan-2-7-image-landing-copy'
import { applyHomepageToolCardSummary, type HomepageToolCardSummaries } from '@/lib/homepage-tool-card-summaries'

/** Renders text with internal links for SEO */
function TextWithLinks({ text, links }: { text: string; links: Array<{ term: string; href: string }> }) {
  const sorted = [...links].sort((a, b) => b.term.length - a.term.length)
  const parts: React.ReactNode[] = []
  let remaining = text
  while (true) {
    let earliest = -1
    let match: (typeof links)[0] | null = null
    for (const link of sorted) {
      const idx = remaining.indexOf(link.term)
      if (idx >= 0 && (earliest < 0 || idx < earliest)) {
        earliest = idx
        match = link
      }
    }
    if (!match || earliest < 0) {
      parts.push(remaining)
      break
    }
    parts.push(remaining.slice(0, earliest))
    parts.push(
      <Link
        key={`${match.term}-${parts.length}`}
        href={match.href}
        className="text-indigo-600 hover:text-indigo-700 underline font-medium"
      >
        {match.term}
      </Link>,
    )
    remaining = remaining.slice(earliest + match.term.length)
  }
  return <>{parts}</>
}

// AI Image model paths (under /model/)
const AI_IMAGE_PATHS: Record<string, string> = {
  'gpt-image-2': '/model/gpt-image-2',
  'wan-2-7-image': '/model/wan-2-7-image',
  'nano-banana-pro': '/model/nano-banana-pro',
  'nano-banana-2': '/model/nano-banana-2',
  'seedream-4-5': '/model/seedream-4-5',
  'seedream-5-0-pro': '/model/seedream-5-0-pro',
}

// AI Video model paths (under /model/)
const AI_VIDEO_PATHS: Record<string, string> = {
  'wan-2-5-ai-video-generator': '/model/wan-2-5-ai-video-generator',
  'seedance-2-5': '/model/seedance-2-5',
  'seedance-2': '/model/seedance-2',
  'kling-3': '/model/kling-3',
  'kling-2-6-pro-motion-control': '/model/kling-2-6-pro-motion-control',
}

type ToolCard = {
  tool: string
  title: string
  description: string
  href: string
  featuredDesc?: string
  modelName?: string
  modelType?: string
  heroDemoVideo?: { src?: string; poster?: string; ariaLabel?: string }
}

const TRENDING_MODEL_IDS = ['seedream-5-0-pro', 'gpt-image-2', 'nano-banana-pro', 'seedance-2-5'] as const

type HomeVideoDemoMedia = {
  src: string
  poster?: string
  ariaLabel: string
}

type HomeVideoSchemaCandidate = {
  title: string
  description?: string
  src?: string
  poster?: string
}

const HOME_VIDEO_SCHEMA_META: Record<string, { duration: string; uploadDate: string }> = {
  'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-control-demo.mp4': {
    duration: 'PT7.9S',
    uploadDate: '2026-08-03T04:44:32.000Z',
  },
  'https://assets.toolaze.com/model-assets/ai-dance-generator/ai-dance-demo.mp4': {
    duration: 'PT8.042S',
    uploadDate: '2026-07-21T07:36:34.000Z',
  },
  'https://assets.toolaze.com/uploads/83a8c5b91a4945beb66275c38a731dbf.png': {
    duration: 'PT3.042S',
    uploadDate: '2026-07-24T00:27:57.000Z',
  },
  'https://assets.toolaze.com/landing-pages/ai-asmr-video-generator/demo.mp4': {
    duration: 'PT8.021S',
    uploadDate: '2026-07-29T04:40:40.000Z',
  },
  'https://assets.toolaze.com/landing-pages/talking-avatar-creator/demo.mp4': {
    duration: 'PT14.48S',
    uploadDate: '2026-07-31T07:08:59.000Z',
  },
  'https://assets.toolaze.com/model-assets/kling-3-motion-control/motion-control-demo.mp4': {
    duration: 'PT7.067S',
    uploadDate: '2026-08-04T02:57:26.000Z',
  },
  '/model-assets/grok-imagine-video-1-5/grok-hero-demo-16x9.mp4': {
    duration: 'PT5.042S',
    uploadDate: '2026-08-04T20:01:05.000Z',
  },
  'https://assets.toolaze.com/uploads/ai-video-generator/prompt-templates/storyboard-scene.mp4': {
    duration: 'PT5S',
    uploadDate: '2026-07-21T00:00:00.000Z',
  },
  'https://assets.toolaze.com/uploads/ai-video-generator/prompt-templates/image-guided-motion.mp4': {
    duration: 'PT5S',
    uploadDate: '2026-07-21T00:00:00.000Z',
  },
}

function toAbsoluteToolazeUrl(value: string): string {
  return value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://toolaze.com${value.startsWith('/') ? value : `/${value}`}`
}

function buildHomeVideoObjects(candidates: HomeVideoSchemaCandidate[]) {
  const seen = new Set<string>()
  return candidates.flatMap((item) => {
    if (!item.src || !item.poster || seen.has(item.src)) return []
    const meta = HOME_VIDEO_SCHEMA_META[item.src]
    if (!meta) return []
    seen.add(item.src)
    return [{
      '@type': 'VideoObject',
      name: item.title,
      description: item.description || item.title,
      thumbnailUrl: toAbsoluteToolazeUrl(item.poster),
      uploadDate: meta.uploadDate,
      duration: meta.duration,
      contentUrl: toAbsoluteToolazeUrl(item.src),
    }]
  })
}

type HomeDashboardModelLogo = {
  src: string
  alt: string
}

const HOME_DASHBOARD_MODEL_LOGOS: Record<string, HomeDashboardModelLogo> = {
  'seedance-2': { src: '/model-logos/bytedance.svg', alt: 'ByteDance logo' },
  'gpt-image-2': { src: '/model-logos/openai.svg', alt: 'OpenAI logo' },
  'seedream-5-0-pro': { src: '/model-logos/bytedance.svg', alt: 'ByteDance logo' },
  'kling-3': { src: '/model-logos/kling.svg', alt: 'Kling logo' },
}

const HOME_VIDEO_MODEL_DEMO_FALLBACKS: Record<string, HomeVideoDemoMedia> = {
  'seedance-2-5': {
    src: 'https://assets.toolaze.com/uploads/ai-video-generator/prompt-templates/storyboard-scene.mp4',
    poster:
      'https://assets.toolaze.com/uploads/ai-video-generator/prompt-templates/storyboard-scene.webp',
    ariaLabel: 'Seedance 2.5 demo video preview',
  },
  'seedance-2': {
    src: '/videos/seedance-2-demo-16x9.mp4',
    poster: '/videos/seedance-2-demo-16x9.jpg',
    ariaLabel: 'Seedance 2.0 demo video preview',
  },
  'kling-3': {
    src: 'https://assets.toolaze.com/uploads/ai-video-generator/prompt-templates/image-guided-motion.mp4',
    poster:
      'https://assets.toolaze.com/uploads/ai-video-generator/prompt-templates/image-guided-motion.webp',
    ariaLabel: 'Kling 3.0 demo video preview',
  },
  'kling-2-6-pro-motion-control': {
    src: 'https://assets.toolaze.com/uploads/ai-video-generator/prompt-templates/image-guided-motion.mp4',
    poster: 'https://assets.toolaze.com/uploads/ai-video-generator/prompt-templates/image-guided-motion.webp',
    ariaLabel: 'Kling 2.6 motion control demo video preview',
  },
}

/** 可选：在 common.home.trendingCards 中按 tool id 覆盖 Trending 区卡片标题与描述 */
type HomeTrendingCardOverride = {
  tool?: string
  modelName?: string
  title?: string
  featuredDesc?: string
  description?: string
  cardTitle?: string
  summary?: string
}

function applyTrendingCardsOverrides(
  items: ToolCard[],
  overrides: HomeTrendingCardOverride[] | Record<string, HomeTrendingCardOverride> | undefined,
): ToolCard[] {
  if (!overrides || (Array.isArray(overrides) && overrides.length === 0)) return items
  return items.map((item) => {
    const o = Array.isArray(overrides) ? overrides.find((x) => x.tool === item.tool) : overrides[item.tool]
    if (!o) return item
    return {
      ...item,
      title: o.title ?? o.cardTitle ?? item.title,
      description: o.description ?? o.summary ?? item.description,
      featuredDesc: o.featuredDesc ?? o.summary ?? item.featuredDesc,
      modelName: o.modelName ?? o.cardTitle ?? item.modelName,
    }
  })
}

function getHref(tool: string): string {
  return AI_IMAGE_PATHS[tool] || AI_VIDEO_PATHS[tool] || `/${tool}`
}

function isVideoMediaUrl(src?: string): boolean {
  return /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(src || '')
}

function getPlainCardTitle(value?: string): string {
  return (value || '').replace(/<[^>]*>/g, '').trim()
}

function getHomeVideoModelDemoMedia(item: ToolCard): HomeVideoDemoMedia | undefined {
  if (item.heroDemoVideo?.src && isVideoMediaUrl(item.heroDemoVideo.src)) {
    return {
      src: item.heroDemoVideo.src,
      poster: item.heroDemoVideo.poster,
      ariaLabel:
        item.heroDemoVideo.ariaLabel || `${getPlainCardTitle(item.modelName || item.title)} demo video preview`,
    }
  }

  return HOME_VIDEO_MODEL_DEMO_FALLBACKS[item.tool]
}

async function loadToolData(
  tool: string,
  locale: string,
  getTitle: (data: any) => string,
  getDesc: (data: any) => string,
  getFeaturedDesc?: (data: any) => string,
  getModelMeta?: (data: any) => { modelName?: string; modelType?: string },
): Promise<ToolCard | null> {
  try {
    const { getL2SeoContent } = await import('@/lib/seo-loader')
    const data = (await getL2SeoContent(tool, locale)) || (await getL2SeoContent(tool, 'en'))
    if (!data) return null
    const title = getTitle(data)
    const description = getDesc(data)
    const featuredDesc = getFeaturedDesc?.(data)
    const modelMeta = getModelMeta?.(data)
    return {
      tool,
      title,
      description,
      href: getHref(tool),
      featuredDesc,
      modelName: modelMeta?.modelName,
      modelType: modelMeta?.modelType,
      heroDemoVideo: data?.heroDemoVideo,
    }
  } catch {
    return null
  }
}

export async function HomePageMain({ locale = 'en' }: { locale?: string }) {
  const common = await loadCommonTranslations(locale)
  const home = common?.home

  const getModelTitle = (d: any) => (d?.hero?.h1 ? d.hero.h1.replace(/<[^>]*>/g, '').trim() : '')
  const getModelDesc = (d: any) => d?.hero?.desc || d?.metadata?.description || ''
  /** 无 common 提炼文案时的兜底：仅用 hero 一行或 meta 摘要，不用 modelIntro 长段 */
  const getFeaturedDesc = (d: any) => {
    const hero = d?.hero?.desc
    if (hero && typeof hero === 'string') {
      const t = hero.replace(/<[^>]*>/g, '').trim()
      if (t) return t.length > 320 ? `${t.slice(0, 320)}…` : t
    }
    const m = d?.metadata?.description
    if (m && typeof m === 'string') {
      const t = m.trim()
      return t.length > 320 ? `${t.slice(0, 320)}…` : t
    }
    return ''
  }
  const getModelMeta = (d: any) => ({
    modelName: d?.modelIntro?.modelName,
    modelType: d?.modelIntro?.modelType,
  })

  const cardSummaries = home?.homepageToolCardSummaries as HomepageToolCardSummaries | undefined
  const navCopy = common?.nav ?? {}
  const localizeHomeHref = (href: string) => (locale === 'en' ? href : `/${locale}${href}`)

  // Load AI Video models（标题/模型名仍来自 L2；描述用 common 提炼文案）
  const aiVideoTools: ToolCard[] = []
  for (const tool of VIDEO_MODEL_L2S) {
    const card = await loadToolData(tool, locale, getModelTitle, getModelDesc, getFeaturedDesc, getModelMeta)
    if (!card) continue
    aiVideoTools.push(
      applyHomepageToolCardSummary(
        tool === 'grok-imagine-video-1-5'
          ? {
              ...card,
              tool: 'grok-1-5-video',
              modelName: card.modelName || 'Grok 1.5 Video',
              href: '/model/grok-imagine-video-1-5',
            }
          : card,
        cardSummaries,
      ),
    )
  }

  // Load AI Image models
  const aiImageTools: ToolCard[] = []
  for (const tool of IMAGE_MODEL_L2S) {
    const card = await loadToolData(tool, locale, getModelTitle, getModelDesc, getFeaturedDesc, getModelMeta)
    if (card) aiImageTools.push(applyHomepageToolCardSummary(card, cardSummaries))
  }
  const wan27Copy = getWan27ImageLandingCopy(locale)
  const wan27Card = applyHomepageToolCardSummary(
    {
      tool: 'wan-2-7-image',
      title: wan27Copy.schema.pageName,
      description: wan27Copy.metadata.description,
      href: getHref('wan-2-7-image'),
      featuredDesc: wan27Copy.hero.description,
      modelName: wan27Copy.hero.modelName,
      modelType: 'AI Image Generator',
    },
    cardSummaries,
  )
  if (!aiImageTools.some((item) => item.tool === wan27Card.tool)) {
    const gptIndex = aiImageTools.findIndex((item) => item.tool === 'gpt-image-2')
    aiImageTools.splice(gptIndex >= 0 ? gptIndex + 1 : 0, 0, wan27Card)
  }
  const seedream45Copy = getSeedream45LandingCopy(locale)
  const seedream45Card = applyHomepageToolCardSummary(
    {
      tool: 'seedream-4-5',
      title: seedream45Copy.schema.pageName,
      description: seedream45Copy.metadata.description,
      href: getHref('seedream-4-5'),
      featuredDesc: seedream45Copy.hero.description,
      modelName: seedream45Copy.hero.modelName,
      modelType: 'AI Image Generator',
    },
    cardSummaries,
  )
  if (!aiImageTools.some((item) => item.tool === seedream45Card.tool)) {
    aiImageTools.push(seedream45Card)
  }
  const seedream50ProCard = applyHomepageToolCardSummary(
    {
      tool: 'seedream-5-0-pro',
      title: 'Seedream 5.0 Pro',
      description:
        'Advanced AI image model for cinematic campaign visuals, brand systems, product ads, and high-resolution creative workflows.',
      href: getHref('seedream-5-0-pro'),
      featuredDesc:
        'Advanced AI image model for cinematic campaign visuals, brand systems, product ads, and high-resolution creative workflows.',
      modelName: 'Seedream 5.0 Pro',
      modelType: 'AI Image Generator',
    },
    cardSummaries,
  )
  if (!aiImageTools.some((item) => item.tool === seedream50ProCard.tool)) {
    aiImageTools.unshift(seedream50ProCard)
  }
  // Curated Trending section（只放首页首屏下方的四个重点模型）
  const trendingModels = applyTrendingCardsOverrides(
    TRENDING_MODEL_IDS.map((tool) => [...aiImageTools, ...aiVideoTools].find((item) => item.tool === tool)).filter(
      (item): item is ToolCard => Boolean(item),
    ),
    home?.trendingCards as Record<string, HomeTrendingCardOverride> | HomeTrendingCardOverride[] | undefined,
  )

  async function loadHomeGridToolCard(tool: string): Promise<ToolCard | null> {
    return loadToolData(
      tool,
      locale,
      (d) => (d?.hero?.h1 ? d.hero.h1.replace(/<[^>]*>/g, '').trim() : tool),
      (d) => d?.hero?.desc || d?.metadata?.description || '',
    )
  }

  const advancedAiTools: ToolCard[] = []
  advancedAiTools.push(
    applyHomepageToolCardSummary(
      {
        tool: 'world-cup-ai-image-generator',
        title: 'World Cup AI Image Generator',
        description:
          'Create football posters, fan portraits, sticker packs, and watch-party visuals with GPT Image 2 from the web interface.',
        href: '/world-cup-ai-image-generator',
        featuredDesc:
          'Create football posters, fan portraits, sticker packs, and watch-party visuals with GPT Image 2 from the web interface.',
        modelName: 'World Cup AI Image Generator',
        modelType: 'AI Image Generator',
      },
      cardSummaries,
    ),
  )
  for (const tool of HOME_ADVANCED_AI_TOOL_IDS) {
    const card = await loadHomeGridToolCard(tool)
    if (!card) continue

    const localizedAdvancedOverrides: Record<string, Partial<ToolCard>> = {
      'watermark-remover': {
        title: home?.toolWatermarkRemover || card.title,
        description: home?.toolWatermarkRemoverDesc || card.description,
      },
      'photo-restoration': {
        title: home?.toolPhotoRestoration || card.title,
        description: home?.toolPhotoRestorationDesc || card.description,
      },
    }

    advancedAiTools.push(
      applyHomepageToolCardSummary({ ...card, ...(localizedAdvancedOverrides[tool] || {}) }, cardSummaries),
    )
  }
  const mergedAdvancedImageToolCards: HomeAiToolsTabCard[] = [
    'unrestricted-ai-image-generator',
    'ai-clothes-changer',
    'ai-bikini-generator',
    'ai-breast-expansion',
  ].flatMap((tool) => {
    const card = advancedAiTools.find((item) => item.tool === tool)
    const thumb = getHomeAdvancedAiCardImage(tool)
    if (!card || !thumb) return []

    return [
      {
        title: (card.title || '').replace(/<[^>]*>/g, '').trim() || tool,
        href: localizeHomeHref(card.href),
        media: {
          type: 'image' as const,
          src: thumb.src,
          alt: thumb.alt,
        },
      },
    ]
  })
  const homeVideoToolCards: HomeAiToolsTabCard[] = [
    {
      title: navCopy.aiMotionControlGenerator || 'AI Motion Control Generator',
      href: localizeHomeHref('/model/kling-2-6-pro-motion-control'),
      media: {
        type: 'video',
        src: 'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-control-demo.mp4',
        poster:
          'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-control-demo-poster.webp',
        alt: navCopy.aiMotionControlGenerator || 'AI Motion Control Generator',
      },
    },
    {
      title: navCopy.aiDanceGenerator || 'AI Dance Generator',
      href: localizeHomeHref('/ai-dance-generator'),
      media: {
        type: 'video',
        src: 'https://assets.toolaze.com/model-assets/ai-dance-generator/ai-dance-demo.mp4',
        poster:
          'https://assets.toolaze.com/model-assets/ai-dance-generator/ai-dance-demo-poster.webp',
        alt: 'AI Dance Generator demo video',
      },
    },
    {
      title: navCopy.aiAsmrVideoGenerator || 'AI ASMR Video Generator',
      href: localizeHomeHref('/ai-asmr-video-generator'),
      media: {
        type: 'video',
        src: 'https://assets.toolaze.com/landing-pages/ai-asmr-video-generator/demo.mp4',
        poster: getHomeModelCardImage('ai-asmr-video-generator')?.src,
        alt: 'AI ASMR Video Generator demo video',
      },
    },
    {
      title: navCopy.talkingAvatarCreator || 'AI Talking Avatar',
      href: localizeHomeHref('/talking-avatar-creator'),
      media: {
        type: 'video',
        src: 'https://assets.toolaze.com/landing-pages/talking-avatar-creator/demo.mp4',
        poster:
          'https://assets.toolaze.com/landing-pages/talking-avatar-creator/demo-poster.webp',
        alt: 'AI Talking Avatar demo video',
      },
    },
    {
      title: navCopy.aiKissingVideoGenerator || 'AI Kissing Video Generator',
      href: localizeHomeHref('/ai-kissing-video-generator'),
      media: {
        type: 'video',
        src: 'https://assets.toolaze.com/uploads/83a8c5b91a4945beb66275c38a731dbf.png',
        poster: 'https://assets.toolaze.com/uploads/15ccbe71d8eb4921930b8b7638bcebab.webp',
        alt: 'AI Kissing Video Generator demo video',
      },
    },
  ]
  const homeImageToolCards: HomeAiToolsTabCard[] = [
    {
      title: navCopy.aiHairstyleChanger || 'AI Hairstyle Changer',
      href: localizeHomeHref('/ai-hairstyle-changer'),
      media: {
        type: 'image',
        src: '/ai-hairstyle-changer/hero-before-after.webp?v=20260711-no-divider-label-padding',
        alt: 'AI Hairstyle Changer demo image',
      },
    },
    {
      title: navCopy.buzzCutFilter || 'Buzz Cut Filter',
      href: localizeHomeHref('/buzz-cut-filter'),
      media: {
        type: 'image',
        src: '/ai-hairstyle-changer/templates/men/buzz-cut.webp',
        alt: 'Buzz Cut Filter demo image',
      },
    },
    {
      title: navCopy.baldFilter || 'Bald Filter',
      href: localizeHomeHref('/bald-filter'),
      media: {
        type: 'image',
        src: 'https://assets.toolaze.com/model-assets/bald-filter/bald-filter-before-after-demo.webp',
        alt: 'Bald Filter demo image',
      },
    },
    {
      title: navCopy.bangsFilter || 'Bangs Filter',
      href: localizeHomeHref('/bangs-filter'),
      media: {
        type: 'image',
        src: 'https://assets.toolaze.com/model-assets/bangs-filter/bangs-filter-before-after-demo.webp',
        alt: 'Bangs Filter demo image',
      },
    },
    {
      title: navCopy.permFilter || 'Perm Filter',
      href: localizeHomeHref('/perm-filter'),
      media: {
        type: 'image',
        src: 'https://assets.toolaze.com/model-assets/perm-filter/perm-filter-before-after-demo.webp',
        alt: 'Perm Filter demo image',
      },
    },
    {
      title: navCopy.aiHairColorChanger || 'AI Hair Color Changer',
      href: localizeHomeHref('/ai-hair-color-changer'),
      media: {
        type: 'image',
        src: '/ai-hair-color-changer/rose-pink-before-after.webp',
        alt: 'AI Hair Color Changer demo image',
      },
    },
    {
      title: navCopy.aiBabyGenerator || 'AI Baby Generator',
      href: localizeHomeHref('/ai-baby-generator'),
      media: {
        type: 'image',
        src: '/ai-baby-generator/hero-baby-portrait.webp',
        alt: 'AI Baby Generator demo image',
      },
    },
    {
      title: navCopy.aiCouplePhotoMaker || 'AI Couple Photo Maker',
      href: localizeHomeHref('/ai-couple-photo-maker'),
      media: {
        type: 'image',
        src: '/ai-couple-photo-maker/rainy-eiffel-4x3.jpg',
        alt: 'AI Couple Photo Maker demo image',
      },
    },
    {
      title: navCopy.worldCupAiImageGenerator || 'World Cup AI Image Generator',
      href: localizeHomeHref('/world-cup-ai-image-generator'),
      media: {
        type: 'image',
        src: 'https://assets.toolaze.com/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp',
        alt: 'World Cup AI Image Generator demo image',
      },
    },
    {
      title: navCopy.aiZinePosterGenerator || 'AI Zine Poster Generator',
      href: localizeHomeHref('/ai-zine-poster-generator'),
      media: {
        type: 'image',
        src: 'https://assets.toolaze.com/model-assets/ai-zine-poster-generator/zine-poster-demo.webp',
        alt: 'AI Zine Poster Generator demo image',
      },
    },
    {
      title: navCopy.photoAbstractPosterGenerator || 'Photo Abstract Poster Generator',
      href: localizeHomeHref('/ai-photo-abstract-poster-generator'),
      media: {
        type: 'image',
        src: '/model-assets/ai-photo-abstract-poster-generator/photo-abstract-poster-demo.webp',
        alt: 'Photo Abstract Poster Generator demo image',
      },
    },
    {
      title: navCopy.watermarkRemover || 'Watermark Remover',
      href: localizeHomeHref('/watermark-remover'),
      media: {
        type: 'image',
        src: 'https://assets.toolaze.com/home-advanced-ai/watermark-remover-demo-before-after.webp',
        alt: 'Watermark Remover demo image',
      },
    },
    {
      title: navCopy.photoRestoration || 'Photo Restoration',
      href: localizeHomeHref('/photo-restoration'),
      media: {
        type: 'image',
        src: 'https://assets.toolaze.com/home-advanced-ai/photo-restoration-demo-before-after.webp',
        alt: 'Photo Restoration demo image',
      },
    },
    ...mergedAdvancedImageToolCards,
  ]

  const faqItems = home?.faq?.items ?? []
  const whyToolaze = home?.whyToolaze
  const homeFeatureItems =
    home?.features && typeof home.features === 'object'
      ? Object.values(home.features).filter(
          (item): item is { title?: string; desc?: string } => !!item && typeof item === 'object',
        )
      : []

  const dashboardCopyByLocale: Record<
    string,
    {
      aiVideoGeneration: string
      aiImageGeneration: string
      aiModels: string
      trending: string
      trendingSubtitle?: string
      tryForFree: string
      liveNowSuffix: string
    }
  > = {
    en: {
      aiVideoGeneration: 'AI Video Generation',
      aiImageGeneration: 'AI Image Generation',
      aiModels: 'All Models',
      trending: 'Trending',
      tryForFree: 'Try For Free',
      liveNowSuffix: ' is Live Now!',
    },
    de: {
      aiVideoGeneration: 'KI-Videogenerierung',
      aiImageGeneration: 'KI-Bildgenerierung',
      aiModels: 'KI-Modelle',
      trending: 'Trending',
      tryForFree: 'Kostenlos testen',
      liveNowSuffix: ' ist jetzt live!',
    },
    ja: {
      aiVideoGeneration: 'AI動画生成',
      aiImageGeneration: 'AI画像生成',
      aiModels: 'AIモデル',
      trending: 'トレンド',
      tryForFree: '無料で試す',
      liveNowSuffix: 'が公開されました！',
    },
    es: {
      aiVideoGeneration: 'Generación de Video IA',
      aiImageGeneration: 'Generación de Imagen IA',
      aiModels: 'Modelos IA',
      trending: 'Tendencias',
      tryForFree: 'Probar Gratis',
      liveNowSuffix: ' ya está disponible',
    },
    'zh-TW': {
      aiVideoGeneration: 'AI 影片生成',
      aiImageGeneration: 'AI 圖像生成',
      aiModels: 'AI 模型',
      trending: '熱門趨勢',
      tryForFree: '免費試用',
      liveNowSuffix: '現已上線！',
    },
    pt: {
      aiVideoGeneration: 'Geração de Vídeo IA',
      aiImageGeneration: 'Geração de Imagem IA',
      aiModels: 'Modelos de IA',
      trending: 'Em Alta',
      tryForFree: 'Testar Grátis',
      liveNowSuffix: ' já está disponível',
    },
    fr: {
      aiVideoGeneration: 'Génération Vidéo IA',
      aiImageGeneration: 'Génération Image IA',
      aiModels: 'Modèles IA',
      trending: 'Tendances',
      tryForFree: 'Essayer Gratuitement',
      liveNowSuffix: ' est disponible',
    },
    ko: {
      aiVideoGeneration: 'AI 비디오 생성',
      aiImageGeneration: 'AI 이미지 생성',
      aiModels: 'AI 모델',
      trending: '인기',
      tryForFree: '무료로 사용해보기',
      liveNowSuffix: ' 출시!',
    },
    it: {
      aiVideoGeneration: 'Generazione Video AI',
      aiImageGeneration: 'Generazione Immagini AI',
      aiModels: 'Modelli AI',
      trending: 'Di Tendenza',
      tryForFree: 'Prova Gratis',
      liveNowSuffix: ' è disponibile',
    },
  }
  const dashboardCopy = dashboardCopyByLocale[locale] || dashboardCopyByLocale.en
  const quickActionCopyByLocale: Record<
    string,
    {
      imageToVideo: string
      textToVideo: string
      imageToImage: string
      textToImage: string
    }
  > = {
    en: {
      imageToVideo: 'Image to Video',
      textToVideo: 'Text to Video',
      imageToImage: 'Image to Image',
      textToImage: 'Text to Image',
    },
    de: {
      imageToVideo: 'Bild zu Video',
      textToVideo: 'Text zu Video',
      imageToImage: 'Bild zu Bild',
      textToImage: 'Text zu Bild',
    },
    ja: {
      imageToVideo: '画像から動画',
      textToVideo: 'テキストから動画',
      imageToImage: '画像から画像',
      textToImage: 'テキストから画像',
    },
    es: {
      imageToVideo: 'Imagen a video',
      textToVideo: 'Texto a video',
      imageToImage: 'Imagen a imagen',
      textToImage: 'Texto a imagen',
    },
    'zh-TW': {
      imageToVideo: '圖像轉影片',
      textToVideo: '文字轉影片',
      imageToImage: '圖像轉圖像',
      textToImage: '文字轉圖像',
    },
    pt: {
      imageToVideo: 'Imagem para vídeo',
      textToVideo: 'Texto para vídeo',
      imageToImage: 'Imagem para imagem',
      textToImage: 'Texto para imagem',
    },
    fr: {
      imageToVideo: 'Image vers vidéo',
      textToVideo: 'Texte vers vidéo',
      imageToImage: 'Image vers image',
      textToImage: 'Texte vers image',
    },
    ko: {
      imageToVideo: '이미지→동영상',
      textToVideo: '텍스트→동영상',
      imageToImage: '이미지→이미지',
      textToImage: '텍스트→이미지',
    },
    it: {
      imageToVideo: 'Immagine a video',
      textToVideo: 'Testo a video',
      imageToImage: 'Immagine a immagine',
      textToImage: 'Testo a immagine',
    },
  }
  const quickActionCopy = quickActionCopyByLocale[locale] || quickActionCopyByLocale.en
  const cleanTitle = (value?: string) => (value || '').replace(/<[^>]*>/g, '').trim()
  const allHomeCards = [...aiVideoTools, ...aiImageTools, ...advancedAiTools]
  const findHomeCard = (tool: string) => allHomeCards.find((item) => item.tool === tool)
  const featuredLaunch = {
    title: 'Seedance 2.0 Mini',
    href: localizeHomeHref('/ai-video-generator?model=seedance-2-mini'),
    description:
      'Create faster 480p and 720p video drafts with image-to-video starts, prompt tests, and lower-credit iteration before larger renders.',
  }
  const featuredLaunchThumb = {
    src: '/model-assets/seedance-2-mini/home-banner.webp',
    width: 1400,
    height: 788,
    alt: 'Seedance 2.0 Mini golden hour portrait video generation preview',
  }
  const dashboardModelCards = ['seedance-2', 'gpt-image-2', 'seedream-5-0-pro', 'kling-3']
    .map(findHomeCard)
    .filter((item): item is ToolCard => Boolean(item))
    .slice(0, 4)
  const allAiToolCards = [...homeVideoToolCards, ...homeImageToolCards]
  const aiKissingPreviewCard = homeVideoToolCards.find(
    (item) => item.href === localizeHomeHref('/ai-kissing-video-generator'),
  )
  const photoRestorationPreviewCard = homeImageToolCards.find(
    (item) => item.href === localizeHomeHref('/photo-restoration'),
  )
  const textToImagePreviewCard: HomeAiToolsTabCard = {
    title: quickActionCopy.textToImage,
    href: localizeHomeHref('/text-to-image-generator'),
    media: {
      type: 'image',
      src: '/ai-image-generator/text-to-image-generator/golden-hour-portrait.webp',
      alt: 'Text to Image Generator golden hour portrait sample',
    },
  }
  const ecommerceImagePreviewCard: HomeAiToolsTabCard = {
    title: quickActionCopy.textToImage,
    href: localizeHomeHref('/text-to-image-generator?preview=ecommerce'),
    media: {
      type: 'image',
      src: '/ai-image-generator/text-to-image-generator/skincare-hero-brief.webp',
      alt: 'Text to Image Generator ecommerce product sample',
    },
  }
  const featuredTrendingHrefs = [
    localizeHomeHref('/ai-kissing-video-generator'),
    localizeHomeHref('/ai-dance-generator'),
    localizeHomeHref('/ai-asmr-video-generator'),
  ]
  const featuredTrendingCards = featuredTrendingHrefs
    .map((href) => allAiToolCards.find((item) => item.href === href))
    .filter((item): item is HomeAiToolsTabCard => Boolean(item))
  const featuredTrendingHrefSet = new Set(featuredTrendingCards.map((item) => item.href))
  const dashboardTrendingCards = [
    ...featuredTrendingCards,
    ...allAiToolCards.filter((item) => !featuredTrendingHrefSet.has(item.href)),
  ]
  const imageModelCards: HomeModelCardsRailCard[] = aiImageTools.flatMap((item) => {
    const thumb = getHomeModelCardImage(item.tool)
    if (!thumb) return []
    return [
      {
        id: item.tool,
        title: cleanTitle(item.modelName || item.title) || item.title,
        description: item.featuredDesc || item.description,
        href: item.href,
        media: {
          type: 'image',
          src: thumb.src,
          alt: thumb.alt,
          width: thumb.width,
          height: thumb.height,
        },
      },
    ]
  })
  const videoModelCards: HomeModelCardsRailCard[] = []
  for (const item of aiVideoTools) {
    const videoModelDemo = getHomeVideoModelDemoMedia(item)
    const imageFallback = getHomeModelCardImage(item.tool)
    const baseCard = {
      id: item.tool,
      title: cleanTitle(item.modelName || item.title) || item.title,
      description: item.featuredDesc || item.description,
      href: item.href,
    }

    if (videoModelDemo) {
      videoModelCards.push({
        ...baseCard,
        media: {
          type: 'video',
          src: videoModelDemo.src,
          poster: videoModelDemo.poster,
          alt: videoModelDemo.ariaLabel,
        },
      })
      continue
    }

    if (imageFallback) {
      videoModelCards.push({
        ...baseCard,
        media: {
          type: 'image',
          src: imageFallback.src,
          alt: imageFallback.alt,
          width: imageFallback.width,
          height: imageFallback.height,
        },
      })
    }
  }
  const quickLaunchGroups = [
    {
      title: dashboardCopy.aiVideoGeneration,
      cardHref: localizeHomeHref('/ai-video-generator'),
      surface: 'from-sky-50 via-white to-indigo-50',
      line: 'from-sky-400/0 via-sky-400/70 to-indigo-400/0',
      previewCards: homeVideoToolCards.slice(0, 2),
      links: [
        {
          label: quickActionCopy.imageToVideo,
          href: localizeHomeHref('/image-to-video-generator'),
        },
        {
          label: quickActionCopy.textToVideo,
          href: localizeHomeHref('/text-to-video-generator'),
        },
      ],
    },
    {
      title: dashboardCopy.aiImageGeneration,
      cardHref: localizeHomeHref('/ai-image-generator'),
      surface: 'from-violet-50 via-white to-fuchsia-50',
      line: 'from-violet-400/0 via-violet-400/70 to-fuchsia-400/0',
      previewCards: [ecommerceImagePreviewCard, textToImagePreviewCard].filter(
        (item): item is HomeAiToolsTabCard => Boolean(item),
      ),
      links: [
        {
          label: quickActionCopy.imageToImage,
          href: localizeHomeHref('/ai-image-to-image-generator'),
        },
        {
          label: quickActionCopy.textToImage,
          href: localizeHomeHref('/text-to-image-generator'),
        },
      ],
    },
    {
      title: navCopy.aiTools || 'AI Tools',
      cardHref: localizeHomeHref('/ai-tools'),
      surface: 'from-slate-50 via-white to-emerald-50',
      line: 'from-slate-400/0 via-emerald-400/70 to-slate-400/0',
      previewCards: [aiKissingPreviewCard, photoRestorationPreviewCard].filter(
        (item): item is HomeAiToolsTabCard => Boolean(item),
      ),
      links: [
        { label: navCopy.videoTools || 'Video Tools', href: localizeHomeHref('/ai-tools?tab=video') },
        { label: navCopy.imageTools || 'Image Tools', href: localizeHomeHref('/ai-tools?tab=image') },
      ],
    },
  ]
  const homepageVideoObjects = buildHomeVideoObjects([
    ...homeVideoToolCards.map((card) => ({
      title: card.title,
      description: card.media.alt,
      src: card.media.type === 'video' ? card.media.src : undefined,
      poster: card.media.type === 'video' ? card.media.poster : undefined,
    })),
    ...videoModelCards.map((card) => ({
      title: card.title,
      description: card.description,
      src: card.media.type === 'video' ? card.media.src : undefined,
      poster: card.media.type === 'video' ? card.media.poster : undefined,
    })),
  ])

  // Organization Schema for Google Search Logo
  const organizationSchema = {
    '@type': 'Organization',
    name: 'Toolaze',
    url: 'https://toolaze.com',
    logo: 'https://toolaze.com/web-app-manifest-512x512.png',
    image: 'https://toolaze.com/web-app-manifest-512x512.png',
    sameAs: [],
    description:
      'AI Image & Video Creation Tools - Create images and videos with supported AI models, selected free trials, and credit-based generation.',
  }
  const homepageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema,
      ...homepageVideoObjects,
    ],
  }

  return (
    <>
      <Script
        id="organization-schema-homepage"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      <Navigation initialTranslations={common} />

      {/* Dashboard-style first screen */}
      <section className="bg-[#F8FAFF] px-2 pb-12 pt-3 sm:px-3 lg:px-4">
        <div className="min-w-0">
          <div className="grid gap-4 xl:grid-cols-3">
            {quickLaunchGroups.map((group) => (
              <section
                key={group.title}
                className={`group isolate relative min-h-[156px] overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br ${group.surface} p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] motion-safe:transition-all motion-safe:duration-300 motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] hover:border-indigo-200/90 hover:shadow-[0_24px_70px_rgba(79,70,229,0.14)]`}
              >
                {group.cardHref ? (
                  <Link
                    href={group.cardHref}
                    aria-label={`Open ${group.title}`}
                    className="absolute inset-0 z-0"
                  />
                ) : null}
                <div className="pointer-events-none absolute right-2 top-1/2 hidden h-[108px] w-[118px] -translate-y-1/2 opacity-90 sm:block">
                  {group.previewCards.map((card, index) => (
                    <div
                      key={card.href}
                      className={`absolute overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_14px_32px_rgba(79,70,229,0.16)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                        index === 0
                          ? 'right-3 top-2 z-10 h-[58px] w-24 -rotate-2 group-hover:-translate-y-0.5'
                          : 'bottom-2 right-0 z-20 h-[58px] w-24 rotate-[3deg] group-hover:-translate-y-1'
                      }`}
                    >
                      {card.media.type === 'video' ? (
                        <video
                          className="h-full w-full object-cover"
                          src={card.media.src}
                          poster={card.media.poster}
                          aria-label={card.media.alt}
                          muted
                          loop
                          playsInline
                          autoPlay
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={card.media.src}
                          alt={card.media.alt}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.11),transparent_34%)] opacity-80" />
                <div
                  className={`pointer-events-none absolute inset-x-8 top-0 h-px origin-center scale-x-95 bg-gradient-to-r ${group.line} opacity-70 motion-safe:transition-all motion-safe:duration-300 motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-110 group-hover:opacity-100`}
                />
                <div className="pointer-events-none relative z-10 mb-7 max-w-none sm:max-w-[calc(100%-124px)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
                  <h2 className="text-[1.28rem] font-extrabold leading-tight tracking-[-0.03em] text-slate-950">
                    {group.title}
                  </h2>
                </div>
                <div className="pointer-events-auto relative z-20 flex max-w-none sm:max-w-[calc(100%-124px)] flex-wrap gap-3">
                  {group.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-bold tracking-[-0.01em] text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 hover:shadow-md"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-end">
              <h2 id="home-ai-models-title" className="text-sm font-bold text-slate-600">
                <Link
                  href={localizeHomeHref('/model')}
                  className="inline-flex items-center transition-colors hover:text-indigo-700"
                >
                  {dashboardCopy.aiModels}
                </Link>
              </h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.95fr)]">
              <Link
                href={featuredLaunch.href}
                className="group relative min-h-[282px] overflow-hidden rounded-[1.75rem] bg-slate-900 p-7 text-white shadow-[0_22px_70px_rgba(79,70,229,0.18)] ring-1 ring-indigo-100/80"
              >
                {featuredLaunchThumb ? (
                  <Image
                    src={featuredLaunchThumb.src}
                    alt={featuredLaunchThumb.alt}
                    width={featuredLaunchThumb.width}
                    height={featuredLaunchThumb.height}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    priority
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/86 via-indigo-950/54 to-violet-950/18" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(199,210,254,0.22),transparent_30%)]" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-[72%] bg-[linear-gradient(90deg,rgba(15,23,42,0.84)_0%,rgba(30,41,59,0.62)_46%,rgba(30,41,59,0.18)_76%,transparent_100%)]" />
                <div className="relative flex h-full max-w-xl flex-col justify-center">
                  <h1 className="home-section-title mb-4 text-[30px] leading-tight text-white drop-shadow md:text-[35px]">
                    {featuredLaunch.title}
                    {dashboardCopy.liveNowSuffix}
                  </h1>
                  <p className="mb-6 max-w-md text-sm font-semibold leading-relaxed text-white/85 drop-shadow-sm">
                    {featuredLaunch.description}
                  </p>
                  <span className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-white px-8 text-sm font-extrabold text-indigo-700 shadow-lg shadow-slate-950/20 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-indigo-50">
                    {dashboardCopy.tryForFree}
                  </span>
                </div>
              </Link>

              <section aria-labelledby="home-ai-models-title">
                <div className="grid gap-4 sm:grid-cols-2">
                  {dashboardModelCards.map((item) => {
                    const logo = HOME_DASHBOARD_MODEL_LOGOS[item.tool]

                    return (
                      <Link
                        key={item.tool}
                        href={item.href}
                        className="group relative min-h-[137px] overflow-hidden rounded-[1.25rem] border border-indigo-100/80 bg-white p-5 text-slate-950 shadow-[0_14px_36px_rgba(79,70,229,0.08)] ring-1 ring-indigo-50/80 transition-colors hover:border-indigo-200 hover:ring-indigo-100"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_42%)]" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-violet-100/50 to-transparent" />
                        <span
                          className="absolute bottom-4 right-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 transition-colors group-hover:bg-indigo-100"
                          aria-hidden="true"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M9 7h8v8" />
                          </svg>
                        </span>
                        <div className="relative">
                          <div className="mb-3 flex min-w-0 items-center gap-2.5">
                            {logo ? (
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white shadow-sm">
                                <img src={logo.src} alt={logo.alt} className="h-5 w-5 object-contain" />
                              </span>
                            ) : null}
                            <h3 className="min-w-0 truncate text-xl font-extrabold leading-tight text-slate-950">
                              {cleanTitle(item.modelName || item.title)}
                            </h3>
                          </div>
                          <p className="line-clamp-2 pr-8 text-xs font-medium leading-relaxed text-slate-600">
                            {item.featuredDesc || item.description}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            </div>
          </div>

          <HomeTrendingToolsRail
            title={dashboardCopy.trending}
            subtitle={dashboardCopy.trendingSubtitle}
            cards={dashboardTrendingCards}
          />
        </div>
      </section>

      {/* AI Tools hub — image and video tools from the global navigation */}
      <section id="ai-tools-hub" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {navCopy.aiTools || 'AI Tools'}
            </h2>
            <p className="text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed">
              {home?.aiToolsHubSubtitle ??
                'Explore concrete creative tools for portraits, style previews, restoration, watermark cleanup, and fast browser utilities.'}
            </p>
          </div>
          <HomeAiToolsTabs
            copy={{
              videoTools: navCopy.videoTools || 'Video Tools',
              imageTools: navCopy.imageTools || 'Image Tools',
            }}
            videoTools={homeVideoToolCards}
            imageTools={homeImageToolCards}
          />
        </div>
      </section>

      {/* AI Image Generator - aiease structure */}
      <section id="ai-image-generator" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.sectionAiImageTitle ?? home?.aiImageTitle ?? 'AI Image Generator'}
            </h2>
            <p className="text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed">
              <TextWithLinks
                text={
                  home?.sectionAiImageSubtitle ??
                  'Compare Toolaze image models by quality, resolution, reference support, edit strength, and best creative use case before choosing a model.'
                }
                links={[
                  { term: 'GPT Image 2', href: '/model/gpt-image-2' },
                  { term: 'Seedream 5.0 Pro', href: '/model/seedream-5-0-pro' },
                  { term: 'Nano Banana Pro', href: '/model/nano-banana-pro' },
                ]}
              />
            </p>
          </div>

          <HomeModelCardsRail cards={imageModelCards} mediaKind="image" />
        </div>
      </section>

      {/* AI Video Generator - aiease structure */}
      <section id="ai-video-generator" className="py-20 px-6 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.sectionAiVideoTitle ?? home?.aiVideoTitle ?? 'AI Video Generator'}
            </h2>
            <p className="text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed">
              <TextWithLinks
                text={home?.sectionAiVideoSubtitle ?? home?.aiVideoIntro ?? ''}
                links={[
                  { term: 'AI Dance Generator', href: '/ai-dance-generator' },
                  { term: 'AI Video Generator', href: '/ai-video-generator' },
                ]}
              />
            </p>
          </div>

          <HomeModelCardsRail cards={videoModelCards} mediaKind="video" />
        </div>
      </section>

      {/* Why Toolaze */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-5xl">
            <p className="mb-3 text-sm font-semibold text-indigo-600">{whyToolaze?.badge ?? 'Why Toolaze?'}</p>
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {whyToolaze?.title ?? 'Built for Creators & Performance'}
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              {whyToolaze?.subtitle ??
                'Everything you need to know about why Toolaze is the smart choice for AI image generation, AI video generation, and creative workflows.'}
            </p>
          </div>
        </div>
      </section>

      {/* Homepage Features */}
      <section className="py-20 px-6 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homeFeatureItems.map((item, idx) => (
              <div
                key={`${item.title || 'feature'}-${idx}`}
                className="rounded-2xl border border-indigo-100 bg-white p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title || ''}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc || ''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Intro */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="home-section-title text-4xl text-slate-900 mb-6 tracking-tight">
            {home?.seoIntro?.title ?? 'AI Image Generator and AI Video Generator Online'}
          </h2>
          <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
            {home?.seoIntro?.paragraph1 ? <p>{home.seoIntro.paragraph1}</p> : null}
            {home?.seoIntro?.paragraph2 ? <p>{home.seoIntro.paragraph2}</p> : null}
            {home?.seoIntro?.paragraph3 ? <p>{home.seoIntro.paragraph3}</p> : null}
          </div>
        </div>
      </section>

      {/* FAQ - aiease: Have Questions? We Have Answers! */}
      <section className="py-24 px-6 bg-[#F8FAFF]">
        <div className="max-w-3xl mx-auto">
          <h2 className="home-section-title text-4xl text-slate-900 text-center mb-14 tracking-tight">
            {home?.faqTitle ?? home?.faq?.title ?? 'Have Questions? We Have Answers!'}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item: { q: string; a: string }, idx: number) => {
              // 内链密度限制：整块 FAQ ~400 词建议 ≤2 个内链。仅在 2 个答案中各放 1 个最相关链接。
              const faqLinks: Array<{ term: string; href: string }> =
                idx === 0
                  ? [
                      {
                        term: 'Nano Banana Pro',
                        href: '/model/nano-banana-pro',
                      },
                    ]
                  : idx === 1
                    ? [{ term: 'Seedance 2.0', href: '/model/seedance-2' }]
                    : []
              return (
                <details
                  key={idx}
                  className="group bg-slate-50/80 hover:bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all duration-200"
                >
                  <summary className="font-semibold text-slate-900 cursor-pointer flex items-center justify-between gap-4 list-none">
                    <span className="text-base">{item.q}</span>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold group-open:rotate-45 transition-transform duration-200">
                      +
                    </span>
                  </summary>
                  <p className="text-slate-600 mt-4 text-sm leading-relaxed pl-0">
                    <TextWithLinks text={item.a} links={faqLinks} />
                  </p>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      <Footer initialTranslations={common} />
    </>
  )
}
