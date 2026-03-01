import Link from 'next/link'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { loadCommonTranslations, IMAGE_MODEL_L2S, VIDEO_MODEL_L2S } from '@/lib/seo-loader'
import type { Metadata } from 'next'

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

// 确保静态生成
export const dynamic = 'force-static'
export const dynamicParams = false

export const metadata: Metadata = {
  title: 'Toolaze - Free AI Image Generator & AI Video Generator Online',
  description:
    'Free AI image generator and AI video generator online. Create 4K images with Nano Banana 2, generate videos with Seedance 2.0 and Kling 3.0. Text-to-image, text-to-video. No sign up required. Image compression and format conversion tools too.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolaze.com',
    siteName: 'Toolaze',
    title: 'Toolaze - Free AI Image Generator & AI Video Generator Online',
    description:
      'Free AI image generator and AI video generator online. Create 4K images with Nano Banana 2, generate videos with Seedance 2.0 and Kling 3.0. Text-to-image, text-to-video. No sign up required.',
    images: [
      {
        url: 'https://toolaze.com/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Toolaze Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolaze - Free AI Image Generator & AI Video Generator Online',
    description:
      'Free AI image generator and AI video generator online. Create 4K images, generate videos. Text-to-image, text-to-video. No sign up required.',
    images: ['https://toolaze.com/web-app-manifest-512x512.png'],
  },
}

// AI Image model paths (under /model/)
const AI_IMAGE_PATHS: Record<string, string> = {
  'nano-banana-pro': '/model/nano-banana-pro',
  'nano-banana-2': '/model/nano-banana-2',
}

// AI Video model paths (root level)
const AI_VIDEO_PATHS: Record<string, string> = {
  'seedance-2': '/seedance-2',
  'kling-3': '/kling-3',
}

// Non-AI L2 tools
const OTHER_TOOLS = [
  'image-compressor',
  'image-converter',
  'font-generator',
  'emoji-copy-and-paste',
] as const

type ToolCard = {
  tool: string
  title: string
  description: string
  href: string
  featuredDesc?: string
  modelName?: string
  modelType?: string
}

function getHref(tool: string): string {
  return AI_IMAGE_PATHS[tool] || AI_VIDEO_PATHS[tool] || `/${tool}`
}

async function loadToolData(
  tool: string,
  getTitle: (data: any) => string,
  getDesc: (data: any) => string,
  getFeaturedDesc?: (data: any) => string,
  getModelMeta?: (data: any) => { modelName?: string; modelType?: string }
): Promise<ToolCard | null> {
  try {
    const { getL2SeoContent } = await import('@/lib/seo-loader')
    const data = await getL2SeoContent(tool, 'en')
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

export default async function HomePage() {
  const common = await loadCommonTranslations('en')
  const home = common?.home

  const getModelTitle = (d: any) => (d?.hero?.h1 ? d.hero.h1.replace(/<[^>]*>/g, '').trim() : '')
  const getModelDesc = (d: any) => d?.hero?.desc || d?.metadata?.description || ''
  const getFeaturedDesc = (d: any) => {
    const desc = d?.modelIntro?.description?.[0]
    const card = d?.modelIntro?.featureCards?.[0]?.content
    return desc || card || ''
  }
  const getModelMeta = (d: any) => ({
    modelName: d?.modelIntro?.modelName,
    modelType: d?.modelIntro?.modelType,
  })

  // Load AI Video models (aiease order: Video first)
  const aiVideoTools: ToolCard[] = []
  for (const tool of VIDEO_MODEL_L2S) {
    const card = await loadToolData(tool, getModelTitle, getModelDesc, getFeaturedDesc, getModelMeta)
    if (card) aiVideoTools.push(card)
  }

  // Load AI Image models
  const aiImageTools: ToolCard[] = []
  for (const tool of IMAGE_MODEL_L2S) {
    const card = await loadToolData(tool, getModelTitle, getModelDesc, getFeaturedDesc, getModelMeta)
    if (card) aiImageTools.push(card)
  }

  // All AI models for Trending section
  const trendingModels = [...aiVideoTools, ...aiImageTools]

  // Load other tools
  const otherTools: ToolCard[] = []
  for (const tool of OTHER_TOOLS) {
    const card = await loadToolData(
      tool,
      (d) => (d?.hero?.h1 ? d.hero.h1.replace(/<[^>]*>/g, '').trim() : tool),
      (d) => d?.hero?.desc || d?.metadata?.description || ''
    )
    if (card) otherTools.push(card)
  }

  const faqItems = home?.faq?.items ?? []

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
            href="/seedance-2"
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
              {home?.aiVideoTitle ?? 'AI Video Generator'}
            </h2>
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              <TextWithLinks
                text={home?.aiVideoIntro ?? "Turn ideas into engaging videos in minutes with AI. Powered by advanced AI models, Toolaze's AI Video Generator helps you create eye-catching videos from text-to-video and image-to-video. No skills required!"}
                links={[{ term: 'AI Video Generator', href: '/seedance-2' }]}
              />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiVideoTools.map((item) => (
              <Link
                key={item.tool}
                href={item.href}
                className="home-model-card block p-8 rounded-[2rem] border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
              >
                <div className="w-14 h-14 home-model-card-icon rounded-2xl flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  {item.modelName || item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.featuredDesc || item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Image Generator - aiease structure */}
      <section id="ai-image-generator" className="py-20 px-6 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.aiImageTitle ?? 'AI Image Generator'}
            </h2>
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              <TextWithLinks
                text={home?.aiImageIntro ?? "Generate high-quality images instantly with AI. From artistic illustrations to realistic visuals, Toolaze's AI Image Generator transforms your ideas into stunning images in seconds — fast, flexible, and effortless."}
                links={[{ term: 'AI Image Generator', href: '/model/nano-banana-pro' }]}
              />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiImageTools.map((item) => (
              <Link
                key={item.tool}
                href={item.href}
                className="home-model-card block p-8 rounded-[2rem] border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
              >
                <div className="w-14 h-14 home-model-card-icon rounded-2xl flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="8.5" cy="8.5" r="2" fill="currentColor" opacity="0.6" />
                    <path d="M3 18L7 14L10 17L14 11L21 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-600 mb-3">
                  {item.modelName || item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.featuredDesc || item.description}
                </p>
              </Link>
            ))}
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
              const isVideo = VIDEO_MODEL_L2S.includes(item.tool)
              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="home-model-card block p-6 rounded-[2rem] border border-indigo-100 transition-all duration-300 hover:border-indigo-200"
                >
                  <div className="w-12 h-12 home-model-card-icon rounded-xl flex items-center justify-center mb-3">
                    {isVideo ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="8.5" cy="8.5" r="2" fill="currentColor" opacity="0.6" />
                        <path d="M3 18L7 14L10 17L14 11L21 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    )}
                  </div>
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

      {/* Advanced AI Tools - aiease structure */}
      <section id="advanced-tools" className="py-20 px-6 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="home-section-title text-4xl text-slate-900 mb-4 tracking-tight">
              {home?.advancedToolsTitle ?? 'Advanced AI Tools for Smarter Content Creation'}
            </h2>
            <p className="text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed">
              {home?.advancedToolsSubtitle ?? 'Image compression, format conversion, font generator — all free, all in your browser.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherTools.map((item) => {
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

      {/* FAQ - aiease: Have Questions? We Have Answers! */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="home-section-title text-4xl text-slate-900 text-center mb-14 tracking-tight">
            {home?.faq?.title ?? 'Have Questions? We Have Answers!'}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item: { q: string; a: string }, idx: number) => {
              // 内链密度限制：整块 FAQ ~400 词建议 ≤2 个内链。仅在 2 个答案中各放 1 个最相关链接。
              const faqLinks: Array<{ term: string; href: string }> =
                idx === 0
                  ? [{ term: 'Nano Banana Pro', href: '/model/nano-banana-pro' }]
                  : idx === 1
                    ? [{ term: 'Seedance 2.0', href: '/seedance-2' }]
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
