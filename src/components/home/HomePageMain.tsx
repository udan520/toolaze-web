import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { loadCommonTranslations, IMAGE_MODEL_L2S, VIDEO_MODEL_L2S } from '@/lib/seo-loader'
import { HOME_ADVANCED_AI_TOOL_IDS, HOME_UTILITY_TOOL_IDS } from '@/lib/homepage-grid-tools'
import { getHomeAdvancedAiCardImage } from '@/lib/home-advanced-ai-card-images'
import { getHomeModelCardImage } from '@/lib/home-model-card-images'
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
  'nano-banana-pro': '/model/nano-banana-pro',
  'nano-banana-2': '/model/nano-banana-2',
  'gpt-image-2': '/model/gpt-image-2-0',
}

// AI Video model paths (under /model/)
const AI_VIDEO_PATHS: Record<string, string> = {
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

/** 可选：在 common.home.trendingCards 中按 tool id 覆盖 Trending 区卡片标题与描述 */
type HomeTrendingCardOverride = {
  tool: string
  modelName?: string
  title?: string
  featuredDesc?: string
  description?: string
}

function applyTrendingCardsOverrides(
  items: ToolCard[],
  overrides: HomeTrendingCardOverride[] | undefined
): ToolCard[] {
  if (!overrides?.length) return items
  return items.map((item) => {
    const o = overrides.find((x) => x.tool === item.tool)
    if (!o) return item
    return {
      ...item,
      title: o.title ?? item.title,
      description: o.description ?? item.description,
      featuredDesc: o.featuredDesc ?? item.featuredDesc,
      modelName: o.modelName ?? item.modelName,
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

  // All AI models for Trending section（可被 common.home.trendingCards 覆盖文案）
  const trendingModels = applyTrendingCardsOverrides(
    [...aiVideoTools, ...aiImageTools],
    home?.trendingCards as HomeTrendingCardOverride[] | undefined
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
      'Free AI Image Generator & AI Video Generator - Create 4K images and videos with Nano Banana 2, Seedance 2.0, Kling 3.0. Text-to-image, text-to-video. No sign up required.',
  }

  return (
    <>
      <Script
        id="organization-schema-homepage"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navigation />

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
              'Top AI models, pro video & image creation. Image compression, format conversion, font generator — all free, no sign up required.'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <Link
            href="/model/nano-banana-pro"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-brand text-white font-bold rounded-full home-cta-glow transition-all duration-300 hover:scale-[1.02]"
          >
            {home?.ctaImage ?? 'Try AI Image Generator'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/model/seedance-2"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-full border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
          >
            {home?.ctaVideo ?? 'Image to Video'}
          </Link>
        </div>
      </header>

      {/* AI Video Generator - aiease structure */}
      <section id="ai-video-generator" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.sectionAiVideoTitle ?? home?.aiVideoTitle ?? 'AI Video Generator'}
            </h2>
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              <TextWithLinks
                text={
                  home?.sectionAiVideoSubtitle ??
                  home?.aiVideoIntro ??
                  "Turn ideas into engaging videos in minutes with AI. Powered by advanced AI models, Toolaze's AI Video Generator helps you create eye-catching videos from text-to-video and image-to-video. No skills required!"
                }
                links={[{ term: 'AI Video Generator', href: '/model/seedance-2' }]}
              />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiVideoTools.map((item) => {
              const thumb = getHomeModelCardImage(item.tool)
              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="home-model-card block p-8 rounded-[2rem] border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
                >
                  {thumb ? (
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-indigo-100 bg-slate-50">
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={thumb.width}
                        height={thumb.height}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 50vw"
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

      {/* AI Image Generator - aiease structure */}
      <section id="ai-image-generator" className="py-20 px-6 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.sectionAiImageTitle ?? home?.aiImageTitle ?? 'AI Image Generator'}
            </h2>
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              <TextWithLinks
                text={
                  home?.sectionAiImageSubtitle ??
                  home?.aiImageIntro ??
                  "Generate high-quality images instantly with AI. From artistic illustrations to realistic visuals, Toolaze's AI Image Generator transforms your ideas into stunning images in seconds — fast, flexible, and effortless."
                }
                links={[{ term: 'AI Image Generator', href: '/model/nano-banana-pro' }]}
              />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiImageTools.map((item) => {
              const thumb = getHomeModelCardImage(item.tool)
              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="home-model-card block p-8 rounded-[2rem] border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
                >
                  {thumb ? (
                    <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-indigo-100 bg-slate-50">
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={thumb.width}
                        height={thumb.height}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 50vw"
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

      {/* Trending AI Models - aiease: Featured highlights with descriptions */}
      <section id="trending-models" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.trendingTitle ?? 'Trending AI Image & Video Models, All in One Place'}
            </h2>
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              {home?.trendingSubtitle ?? 'Access Seedance 2.0, Kling 3.0, Nano Banana Pro, and Nano Banana 2 without switching platforms.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingModels.map((item) => {
              const thumb = getHomeModelCardImage(item.tool)
              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="home-model-card block p-6 rounded-[2rem] border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
                >
                  {thumb ? (
                    <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-indigo-100 bg-slate-50">
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={thumb.width}
                        height={thumb.height}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
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

      {/* AI Tools hub — SEO bridge between trending models and utility grid */}
      <section id="ai-tools-hub" className="py-20 px-6 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.aiToolsHubTitle ?? 'Free AI Tools for Images, Video & Everyday Media Workflows'}
            </h2>
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              {home?.aiToolsHubSubtitle ??
                'One hub for AI image generation, AI video generation, and fast browser utilities—no signup and no paywall.'}
            </p>
            {home?.aiToolsHubIntro ? (
              <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed mt-4">
                {home.aiToolsHubIntro}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Array.isArray(home?.aiToolsHubItems) && home.aiToolsHubItems.length > 0
              ? home.aiToolsHubItems
              : [
                  {
                    title: 'AI image generators',
                    description:
                      'Ship campaign-ready visuals with text-to-image and image-to-image using Nano Banana Pro, Nano Banana 2, and GPT Image 2.',
                    href: '/model/nano-banana-pro',
                  },
                  {
                    title: 'AI video generators',
                    description:
                      'Create clips with Seedance 2.0 and Kling 3.0 using text-to-video and image-to-video workflows.',
                    href: '/model/seedance-2',
                  },
                  {
                    title: 'Browser media utilities',
                    description:
                      'Compress and convert images, remove watermarks, restore photos, and more—free in your browser.',
                    href: '/image-compressor',
                  },
                ]
            ).map((item: { title: string; description: string; href: string }, idx: number) => (
              <Link
                key={`${item.href}-${idx}`}
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
                <h3 className="text-lg font-bold text-indigo-600 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
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
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              {home?.advancedToolsSubtitle ??
                'Portrait generation, watermark removal, and photo restoration powered by AI—free to try online, no signup required.'}
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
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              {home?.sectionToolsSubtitle ??
                home?.utilityToolsSubtitle ??
                'Fast, private utilities that run in your browser—image compression and format conversion, stylish font previews, and emoji copy-and-paste. No AI generation required.'}
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
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-3">
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
            {home?.seoIntro?.title ?? 'Free AI Image Generator & AI Video Generator Online'}
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

      <Footer />
    </>
  )
}
