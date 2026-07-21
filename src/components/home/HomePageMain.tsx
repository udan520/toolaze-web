import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { loadCommonTranslations, IMAGE_MODEL_L2S, VIDEO_MODEL_L2S } from '@/lib/seo-loader'
import { HOME_ADVANCED_AI_TOOL_IDS, HOME_UTILITY_TOOL_IDS } from '@/lib/homepage-grid-tools'
import { getHomeAdvancedAiCardImage } from '@/lib/home-advanced-ai-card-images'
import { getHomeModelCardImage } from '@/lib/home-model-card-images'
import { getSeedream45LandingCopy } from '@/lib/seedream-4-5-landing-copy'
import { getWan27ImageLandingCopy } from '@/lib/wan-2-7-image-landing-copy'
import {
  applyHomepageToolCardSummary,
  type HomepageToolCardSummaries,
} from '@/lib/homepage-tool-card-summaries'

/** Renders text with internal links for SEO */
function TextWithLinks({
  text,
  links,
}: {
  text: string
  links: Array<{ term: string; href: string }>
}) {
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
      </Link>
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
  'seedance-2-5': '/model/seedance-2-5',
  'seedance-2': '/model/seedance-2',
  'kling-3': '/model/kling-3',
}

type ToolCard = {
  tool: string
  title: string
  description: string
  href: string
  featuredDesc?: string
  modelName?: string
  modelType?: string
}

const TRENDING_MODEL_IDS = ['seedream-5-0-pro', 'gpt-image-2', 'nano-banana-pro', 'seedance-2-5'] as const

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
  overrides: HomeTrendingCardOverride[] | Record<string, HomeTrendingCardOverride> | undefined
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

async function loadToolData(
  tool: string,
  locale: string,
  getTitle: (data: any) => string,
  getDesc: (data: any) => string,
  getFeaturedDesc?: (data: any) => string,
  getModelMeta?: (data: any) => { modelName?: string; modelType?: string }
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

  // Load AI Video models（标题/模型名仍来自 L2；描述用 common 提炼文案）
  const aiVideoTools: ToolCard[] = []
  for (const tool of VIDEO_MODEL_L2S) {
    const card = await loadToolData(tool, locale, getModelTitle, getModelDesc, getFeaturedDesc, getModelMeta)
    if (card) aiVideoTools.push(applyHomepageToolCardSummary(card, cardSummaries))
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
    cardSummaries
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
    cardSummaries
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
    cardSummaries
  )
  if (!aiImageTools.some((item) => item.tool === seedream50ProCard.tool)) {
    aiImageTools.unshift(seedream50ProCard)
  }
  // Curated Trending section（只放首页首屏下方的四个重点模型）
  const trendingModels = applyTrendingCardsOverrides(
    TRENDING_MODEL_IDS.map((tool) => [...aiImageTools, ...aiVideoTools].find((item) => item.tool === tool)).filter(
      (item): item is ToolCard => Boolean(item)
    ),
    home?.trendingCards as Record<string, HomeTrendingCardOverride> | HomeTrendingCardOverride[] | undefined
  )

  async function loadHomeGridToolCard(tool: string): Promise<ToolCard | null> {
    return loadToolData(
      tool,
      locale,
      (d) => (d?.hero?.h1 ? d.hero.h1.replace(/<[^>]*>/g, '').trim() : tool),
      (d) => d?.hero?.desc || d?.metadata?.description || ''
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
      cardSummaries
    )
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
      applyHomepageToolCardSummary({ ...card, ...(localizedAdvancedOverrides[tool] || {}) }, cardSummaries)
    )
  }
  const aiToolsHubCards = advancedAiTools.filter((item) => item.tool !== 'world-cup-ai-image-generator').slice(0, 3)

  const utilityTools: ToolCard[] = []
  for (const tool of HOME_UTILITY_TOOL_IDS) {
    const card = await loadHomeGridToolCard(tool)
    if (!card) continue

    const localizedUtilityOverrides: Record<string, Partial<ToolCard>> = {
      'image-compressor': {
        title: home?.toolImageCompressor || card.title,
        description: home?.toolImageCompressorDesc || card.description,
      },
      'image-converter': {
        title: home?.toolFormatConverter || card.title,
        description: home?.toolFormatConverterDesc || card.description,
      },
      'font-generator': {
        title: home?.toolFontGenerator || card.title,
        description: home?.toolFontGeneratorDesc || card.description,
      },
      'emoji-copy-and-paste': {
        title: home?.toolEmojiCopyAndPaste || card.title,
        description: home?.toolEmojiCopyAndPasteDesc || card.description,
      },
    }
    utilityTools.push({ ...card, ...(localizedUtilityOverrides[tool] || {}) })
  }

  const faqItems = home?.faq?.items ?? []
  const whyToolaze = home?.whyToolaze
  const homeFeatureItems =
    home?.features && typeof home.features === 'object'
      ? Object.values(home.features).filter(
          (item): item is { title?: string; desc?: string } => !!item && typeof item === 'object'
        )
      : []

  // Organization Schema for Google Search Logo
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toolaze',
    url: 'https://toolaze.com',
    logo: 'https://toolaze.com/web-app-manifest-512x512.png',
    image: 'https://toolaze.com/web-app-manifest-512x512.png',
    sameAs: [],
    description:
      'AI Image & Video Creation Tools - Create images and videos with supported AI models, selected free trials, and credit-based generation.',
  }

  return (
    <>
      <Script
        id="organization-schema-homepage"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navigation initialTranslations={common} />

      {/* Hero - aiease style: All-in-One Platform */}
      <header className="relative pt-16 pb-24 px-6 bg-[#F8FAFF] home-hero-mesh overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-10 relative z-10">
          <h1
            className="home-section-title text-[40px] md:text-[44px] text-slate-900 mb-6 tracking-tight"
            style={{ lineHeight: '1.25' }}
          >
            {home?.heroTitle ?? 'All-in-One AI Image & Video Creation Platform'}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {home?.heroTagline ??
              'Create AI images and videos with leading AI models. Try selected features for free and purchase credits when you need more generations.'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <Link
            href="/ai-image-generator"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-brand text-white font-bold rounded-full home-cta-glow transition-all duration-300 hover:scale-[1.02]"
          >
            {home?.ctaImage ?? 'Try AI Image Generator'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/ai-image-to-image-generator"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-full border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
          >
            {home?.ctaImageEdit ?? 'AI Image to Image Generator'}
          </Link>
        </div>
      </header>

      {/* Trending AI Models - aiease: Featured highlights with descriptions */}
      <section id="trending-models" className="py-20 px-6 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.trendingTitle ?? 'Trending AI Image & Video Models, All in One Place'}
            </h2>
            <p className="text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed">
              {home?.trendingSubtitle ?? 'Access Seedream 5.0 Pro, GPT Image 2, Nano Banana Pro, and Seedance 2.5 without switching platforms.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingModels.map((item) => {
              const thumb = getHomeModelCardImage(item.tool)
              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="home-model-card block p-4 rounded-lg border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
                >
                  {thumb ? (
                    <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-md ring-1 ring-indigo-100 bg-slate-50">
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={thumb.width}
                        height={thumb.height}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-base font-bold text-indigo-600 mb-2">
                    {item.modelName || item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.featuredDesc || item.description}
                  </p>
                </Link>
              )
            })}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiImageTools.map((item) => {
              const thumb = getHomeModelCardImage(item.tool)
              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="home-model-card block p-4 rounded-lg border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
                >
                  {thumb ? (
                    <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-md ring-1 ring-indigo-100 bg-slate-50">
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={thumb.width}
                        height={thumb.height}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">
                    {item.modelName || item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.featuredDesc || item.description}
                  </p>
                </Link>
              )
            })}
          </div>
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
                text={
                  home?.sectionAiVideoSubtitle ??
                  home?.aiVideoIntro ??
                  ''
                }
                links={[{ term: 'AI Video Generator', href: '/ai-video-generator' }]}
              />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiVideoTools.map((item) => {
              const thumb = getHomeModelCardImage(item.tool)
              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="home-model-card block p-4 rounded-lg border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
                >
                  {thumb ? (
                    <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-md ring-1 ring-indigo-100 bg-slate-50">
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={thumb.width}
                        height={thumb.height}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-xl font-bold text-indigo-600 mb-3">
                    {item.modelName || item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.featuredDesc || item.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Tools hub — SEO bridge between model discovery and utility tools */}
      <section id="ai-tools-hub" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.aiToolsHubTitle ?? 'Free AI Tools for Creative Media Workflows'}
            </h2>
            <p className="text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed">
              {home?.aiToolsHubSubtitle ??
                'Explore concrete creative tools for portraits, style previews, restoration, watermark cleanup, and fast browser utilities.'}
            </p>
            {home?.aiToolsHubIntro ? (
              <p className="text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed mt-4">
                {home.aiToolsHubIntro}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiToolsHubCards.map((item) => (
              <Link
                key={item.tool}
                href={item.href}
                className="home-model-card block p-8 rounded-[2rem] border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
              >
                <div className="w-12 h-12 home-model-card-icon rounded-xl flex items-center justify-center mb-4">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-indigo-600"
                  >
                    <path
                      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-indigo-600 mb-3">
                  {(item.modelName || item.title || '').replace(/<[^>]*>/g, '').trim()}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.featuredDesc || item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI-powered tools (couple portraits, watermark removal, restoration) */}
      <section id="advanced-ai-tools" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.advancedToolsTitle ?? 'More AI-Powered Creative Tools'}
            </h2>
            <p className="text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed">
              {home?.advancedToolsSubtitle ??
                'Portrait generation, authorized watermark cleanup, and photo restoration powered by AI. Try selected tools online and use credits for supported generation workflows.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advancedAiTools.map((item) => {
              const thumb = getHomeAdvancedAiCardImage(item.tool)

              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="group block p-6 rounded-[2rem] bg-white border border-indigo-100 hover:border-indigo-200 transition-all duration-300"
                >
                  {thumb ? (
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-indigo-100 bg-slate-50">
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={thumb.width}
                        height={thumb.height}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <h3 className="font-bold text-slate-900 mb-2 text-base">
                    {(item.title || '').replace(/<[^>]*>/g, '').trim()}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description || ''}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Local / utility tools (compression, conversion, fonts, emoji)—not AI-generation features */}
      <section id="browser-utility-tools" className="py-20 px-6 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.sectionToolsTitle ?? home?.utilityToolsTitle ?? 'Free Browser Tools for Images & Text'}
            </h2>
            <p className="text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed">
              {home?.sectionToolsSubtitle ??
                home?.utilityToolsSubtitle ??
                'Fast utility tools for image compression and format conversion, stylish font previews, and emoji copy-and-paste. No AI generation required.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {utilityTools.map((item) => {
              const toolEmoji: Record<string, string> = {
                'image-compressor': '🗜️',
                'image-converter': '🔄',
                'font-generator': '✏️',
                'emoji-copy-and-paste': '😀',
              }
              const emoji = toolEmoji[item.tool] || '📌'

              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="group block p-6 rounded-[2rem] bg-white border border-indigo-100 hover:border-indigo-200 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 text-2xl group-hover:scale-105 transition-transform duration-300">
                    {emoji}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 text-base">
                    {(item.title || '').replace(/<[^>]*>/g, '').trim()}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description || ''}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Toolaze */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-5xl">
            <p className="mb-3 text-sm font-semibold text-indigo-600">
              {whyToolaze?.badge ?? 'Why Toolaze?'}
            </p>
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
              <div key={`${item.title || 'feature'}-${idx}`} className="rounded-2xl border border-indigo-100 bg-white p-6">
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
                  ? [{ term: 'Nano Banana Pro', href: '/model/nano-banana-pro' }]
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
