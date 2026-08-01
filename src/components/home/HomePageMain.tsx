import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HomeAiToolsTabs, { type HomeAiToolsTabCard } from '@/components/home/HomeAiToolsTabs'
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
        cardSummaries
      )
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
  const homeVideoToolCards: HomeAiToolsTabCard[] = [
    {
      title: navCopy.aiVideoGenerator || 'AI Video Generator',
      href: localizeHomeHref('/ai-video-generator'),
      media: {
        type: 'video',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ai-video-generator/ai-video-generator-grok-demo.mp4',
        alt: 'AI Video Generator demo video',
      },
    },
    {
      title: navCopy.textToVideoGenerator || 'Text to Video Generator',
      href: localizeHomeHref('/text-to-video-generator'),
      media: {
        type: 'video',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/1b0129b9d2504494825f8fd28b00f4af.png',
        poster: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/c601d39d801e44938e5e33711e19df32.webp',
        alt: 'Text to Video Generator demo video',
      },
    },
    {
      title: navCopy.imageToVideoGenerator || 'Image to Video Generator',
      href: localizeHomeHref('/image-to-video-generator'),
      media: {
        type: 'video',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ai-video-generator/ai-video-generator-grok-demo.mp4',
        alt: 'Image to Video Generator demo video',
      },
    },
    {
      title: navCopy.aiDanceGenerator || 'AI Dance Generator',
      href: localizeHomeHref('/ai-dance-generator'),
      media: {
        type: 'video',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/ai-dance-demo.mp4',
        alt: 'AI Dance Generator demo video',
      },
    },
    {
      title: navCopy.talkingAvatarCreator || 'AI Talking Avatar',
      href: localizeHomeHref('/talking-avatar-creator'),
      media: {
        type: 'video',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/landing-pages/talking-avatar-creator/demo.mp4',
        poster: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/landing-pages/talking-avatar-creator/demo-poster.webp',
        alt: 'AI Talking Avatar demo video',
      },
    },
    {
      title: navCopy.aiKissingVideoGenerator || 'AI Kissing Video Generator',
      href: localizeHomeHref('/ai-kissing-video-generator'),
      media: {
        type: 'video',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/83a8c5b91a4945beb66275c38a731dbf.png',
        poster: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/15ccbe71d8eb4921930b8b7638bcebab.webp',
        alt: 'AI Kissing Video Generator demo video',
      },
    },
  ]
  const homeImageToolCards: HomeAiToolsTabCard[] = [
    {
      title: navCopy.aiImageGenerator || 'AI Image Generator',
      href: localizeHomeHref('/ai-image-generator'),
      media: {
        type: 'image',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/gpt-image-2.jpg',
        alt: 'AI Image Generator demo image',
      },
    },
    {
      title: navCopy.textToImageGenerator || 'Text to Image Generator',
      href: localizeHomeHref('/text-to-image-generator'),
      media: {
        type: 'image',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-image-generator/text-to-image-generator.webp',
        alt: 'Text to Image Generator demo image',
      },
    },
    {
      title: navCopy.aiImageToImageGenerator || 'AI Image to Image Generator',
      href: localizeHomeHref('/ai-image-to-image-generator'),
      media: {
        type: 'image',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/gpt-image-2/feature-image-editing.webp',
        alt: 'AI Image to Image Generator demo image',
      },
    },
    {
      title: navCopy.aiHairstyleChanger || 'AI Hairstyle Changer',
      href: localizeHomeHref('/ai-hairstyle-changer'),
      media: {
        type: 'image',
        src: '/ai-hairstyle-changer/hero-before-after.webp',
        alt: 'AI Hairstyle Changer demo image',
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
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp',
        alt: 'World Cup AI Image Generator demo image',
      },
    },
    {
      title: navCopy.watermarkRemover || 'Watermark Remover',
      href: localizeHomeHref('/watermark-remover'),
      media: {
        type: 'image',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/watermark-remover-demo-before-after.webp',
        alt: 'Watermark Remover demo image',
      },
    },
    {
      title: navCopy.photoRestoration || 'Photo Restoration',
      href: localizeHomeHref('/photo-restoration'),
      media: {
        type: 'image',
        src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/photo-restoration-demo-before-after.webp',
        alt: 'Photo Restoration demo image',
      },
    },
  ]

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

  const dashboardCopyByLocale: Record<string, {
    aiVideoGeneration: string
    aiImageGeneration: string
    videoEditor: string
    aiModels: string
    trending: string
    tryForFree: string
    liveNowSuffix: string
    freeDisclosure: string
  }> = {
    en: {
      aiVideoGeneration: 'AI Video Generation',
      aiImageGeneration: 'AI Image Generation',
      videoEditor: 'Video Editor',
      aiModels: 'AI Models',
      trending: 'Trending',
      tryForFree: 'Try For Free',
      liveNowSuffix: ' is Live Now!',
      freeDisclosure: 'New users receive 20 credits after signing up; higher settings may use more credits.',
    },
    de: {
      aiVideoGeneration: 'KI-Videogenerierung',
      aiImageGeneration: 'KI-Bildgenerierung',
      videoEditor: 'Video-Editor',
      aiModels: 'KI-Modelle',
      trending: 'Trending',
      tryForFree: 'Kostenlos testen',
      liveNowSuffix: ' ist jetzt live!',
      freeDisclosure: 'Neue Nutzer erhalten nach der Registrierung 20 Credits; höhere Einstellungen können mehr Credits benötigen.',
    },
    ja: {
      aiVideoGeneration: 'AI動画生成',
      aiImageGeneration: 'AI画像生成',
      videoEditor: '動画エディター',
      aiModels: 'AIモデル',
      trending: 'トレンド',
      tryForFree: '無料で試す',
      liveNowSuffix: 'が公開されました！',
      freeDisclosure: '新規登録後に20 creditsを受け取れます。高品質設定では追加creditsが必要な場合があります。',
    },
    es: {
      aiVideoGeneration: 'Generación de Video IA',
      aiImageGeneration: 'Generación de Imagen IA',
      videoEditor: 'Editor de Video',
      aiModels: 'Modelos IA',
      trending: 'Tendencias',
      tryForFree: 'Probar Gratis',
      liveNowSuffix: ' ya está disponible',
      freeDisclosure: 'Los nuevos usuarios reciben 20 créditos al registrarse; los ajustes superiores pueden usar más créditos.',
    },
    'zh-TW': {
      aiVideoGeneration: 'AI 影片生成',
      aiImageGeneration: 'AI 圖像生成',
      videoEditor: '影片編輯器',
      aiModels: 'AI 模型',
      trending: '熱門趨勢',
      tryForFree: '免費試用',
      liveNowSuffix: '現已上線！',
      freeDisclosure: '新用戶註冊後可獲得 20 credits；更高規格設定可能需要更多 credits。',
    },
    pt: {
      aiVideoGeneration: 'Geração de Vídeo IA',
      aiImageGeneration: 'Geração de Imagem IA',
      videoEditor: 'Editor de Vídeo',
      aiModels: 'Modelos de IA',
      trending: 'Em Alta',
      tryForFree: 'Testar Grátis',
      liveNowSuffix: ' já está disponível',
      freeDisclosure: 'Novos usuários recebem 20 créditos após o cadastro; configurações mais altas podem usar mais créditos.',
    },
    fr: {
      aiVideoGeneration: 'Génération Vidéo IA',
      aiImageGeneration: 'Génération Image IA',
      videoEditor: 'Éditeur Vidéo',
      aiModels: 'Modèles IA',
      trending: 'Tendances',
      tryForFree: 'Essayer Gratuitement',
      liveNowSuffix: ' est disponible',
      freeDisclosure: 'Les nouveaux utilisateurs reçoivent 20 crédits après inscription ; les réglages avancés peuvent utiliser plus de crédits.',
    },
    ko: {
      aiVideoGeneration: 'AI 비디오 생성',
      aiImageGeneration: 'AI 이미지 생성',
      videoEditor: '비디오 편집기',
      aiModels: 'AI 모델',
      trending: '인기',
      tryForFree: '무료로 사용해보기',
      liveNowSuffix: ' 출시!',
      freeDisclosure: '신규 사용자는 가입 후 20 credits를 받으며, 고급 설정은 더 많은 credits가 필요할 수 있습니다.',
    },
    it: {
      aiVideoGeneration: 'Generazione Video AI',
      aiImageGeneration: 'Generazione Immagini AI',
      videoEditor: 'Editor Video',
      aiModels: 'Modelli AI',
      trending: 'Di Tendenza',
      tryForFree: 'Prova Gratis',
      liveNowSuffix: ' è disponibile',
      freeDisclosure: 'I nuovi utenti ricevono 20 crediti dopo la registrazione; le impostazioni avanzate possono usare più crediti.',
    },
  }
  const dashboardCopy = dashboardCopyByLocale[locale] || dashboardCopyByLocale.en
  const cleanTitle = (value?: string) => (value || '').replace(/<[^>]*>/g, '').trim()
  const allHomeCards = [...aiVideoTools, ...aiImageTools, ...advancedAiTools, ...utilityTools]
  const findHomeCard = (tool: string) => allHomeCards.find((item) => item.tool === tool)
  const featuredLaunch =
    findHomeCard('seedance-2-5') ||
    findHomeCard('seedance-2') ||
    aiVideoTools[0] ||
    trendingModels[0]
  const featuredLaunchTitle = cleanTitle(featuredLaunch?.modelName || featuredLaunch?.title) || 'Seedance 2.5'
  const featuredLaunchThumb = featuredLaunch ? getHomeModelCardImage(featuredLaunch.tool) : null
  const dashboardModelCards = ['seedance-2', 'gpt-image-2', 'seedream-5-0-pro', 'kling-3']
    .map(findHomeCard)
    .filter((item): item is ToolCard => Boolean(item))
    .slice(0, 4)
  const dashboardTrendingCards = [
    {
      title: navCopy.worldCupAiImageGenerator || 'World Cup AI Image Generator',
      href: localizeHomeHref('/world-cup-ai-image-generator'),
      image: getHomeAdvancedAiCardImage('world-cup-ai-image-generator'),
    },
    {
      title: navCopy.aiDanceGenerator || 'AI Dance Generator',
      href: localizeHomeHref('/ai-dance-generator'),
      image: getHomeModelCardImage('ai-asmr-video-generator'),
    },
    {
      title: navCopy.aiKissingVideoGenerator || 'AI Kissing Video Generator',
      href: localizeHomeHref('/ai-kissing-video-generator'),
      image: getHomeModelCardImage('ai-kissing-video-generator'),
    },
  ].filter((item) => Boolean(item.image))
  const quickLaunchGroups = [
    {
      title: dashboardCopy.aiVideoGeneration,
      links: [
        { label: navCopy.imageToVideoGenerator || 'Image to Video Generator', href: localizeHomeHref('/image-to-video-generator') },
        { label: navCopy.textToVideoGenerator || 'Text to Video Generator', href: localizeHomeHref('/text-to-video-generator') },
        { label: dashboardCopy.videoEditor, href: localizeHomeHref('/ai-video-generator') },
      ],
    },
    {
      title: dashboardCopy.aiImageGeneration,
      links: [
        { label: navCopy.aiImageToImageGenerator || 'AI Image to Image Generator', href: localizeHomeHref('/ai-image-to-image-generator') },
        { label: navCopy.textToImageGenerator || 'Text to Image Generator', href: localizeHomeHref('/text-to-image-generator') },
      ],
    },
    {
      title: navCopy.aiTools || 'AI Tools',
      links: [
        { label: navCopy.videoTools || 'Video Tools', href: localizeHomeHref('/ai-video-generator') },
        { label: navCopy.imageTools || 'Image Tools', href: localizeHomeHref('/ai-image-generator') },
      ],
    },
  ]

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

      {/* Dashboard-style first screen */}
      <section className="bg-[#F8FAFF] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px] overflow-hidden border border-indigo-100 bg-white shadow-soft lg:min-h-[calc(100vh-92px)]">
          <div className="min-w-0 px-4 py-5 sm:px-6 lg:px-7">
            <div className="grid gap-4 xl:grid-cols-3">
              {quickLaunchGroups.map((group) => (
                <section key={group.title} className="rounded-[1.25rem] bg-slate-100/80 p-5 ring-1 ring-slate-200/70">
                  <h2 className="mb-6 text-base font-extrabold text-slate-950">{group.title}</h2>
                  <div className="flex flex-wrap gap-3">
                    {group.links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:text-indigo-700 hover:ring-indigo-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.95fr)]">
              <Link
                href={featuredLaunch?.href || localizeHomeHref('/ai-video-generator')}
                className="group relative min-h-[290px] overflow-hidden rounded-[1.5rem] bg-slate-200 p-7 text-white shadow-sm ring-1 ring-slate-200"
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
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/78 via-slate-950/42 to-slate-950/10" />
                <div className="relative flex h-full max-w-xl flex-col justify-center">
                  <h1 className="home-section-title mb-4 text-[30px] leading-tight text-white md:text-[34px]">
                    {featuredLaunchTitle}{dashboardCopy.liveNowSuffix}
                  </h1>
                  <p className="mb-8 max-w-md text-sm font-medium leading-relaxed text-white/82">
                    {featuredLaunch?.featuredDesc ||
                      featuredLaunch?.description ||
                      'Create premium AI video with reference images, motion control, and credit-based generation.'}
                  </p>
                  <span className="inline-flex min-h-12 w-fit items-center justify-center rounded-xl bg-white px-10 text-sm font-bold text-slate-900 shadow-lg shadow-slate-950/10 transition-colors group-hover:text-indigo-700">
                    {dashboardCopy.tryForFree}
                  </span>
                  <span className="mt-3 text-xs font-medium text-white/72">
                    {dashboardCopy.freeDisclosure}
                  </span>
                </div>
              </Link>

              <section aria-labelledby="home-ai-models-title">
                <div className="mb-2 flex items-center justify-end">
                  <h2 id="home-ai-models-title" className="text-sm font-bold text-slate-600">
                    {dashboardCopy.aiModels}
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {dashboardModelCards.map((item) => {
                    const thumb = getHomeModelCardImage(item.tool)
                    return (
                      <Link
                        key={item.tool}
                        href={item.href}
                        className="group relative min-h-[137px] overflow-hidden rounded-[1.25rem] bg-slate-100 p-5 ring-1 ring-slate-200 transition-colors hover:ring-indigo-200"
                      >
                        {thumb ? (
                          <Image
                            src={thumb.src}
                            alt={thumb.alt}
                            width={thumb.width}
                            height={thumb.height}
                            className="absolute inset-0 h-full w-full object-cover opacity-42 transition-transform duration-500 group-hover:scale-[1.04]"
                            sizes="(max-width: 768px) 100vw, 22vw"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-white/76 backdrop-blur-[1px]" />
                        <div className="relative">
                          <h3 className="mb-4 text-xl font-extrabold leading-tight text-slate-950">
                            {cleanTitle(item.modelName || item.title)}
                          </h3>
                          <p className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-700">
                            {item.featuredDesc || item.description}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            </div>

            <section id="trending-models" className="mt-9" aria-labelledby="home-trending-title">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 id="home-trending-title" className="home-section-title text-3xl text-slate-950">
                  {dashboardCopy.trending}
                </h2>
                <div className="hidden items-center gap-2 text-slate-500 sm:flex" aria-hidden="true">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {dashboardTrendingCards.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative min-h-[240px] overflow-hidden rounded-[1.5rem] bg-slate-100 ring-1 ring-slate-200 transition-colors hover:ring-indigo-200"
                  >
                    {item.image ? (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 30vw"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/12 to-transparent" />
                    <h3 className="absolute inset-x-5 bottom-5 text-center text-base font-extrabold text-white drop-shadow">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
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
                links={[
                  { term: 'AI Dance Generator', href: '/ai-dance-generator' },
                  { term: 'AI Video Generator', href: '/ai-video-generator' },
                ]}
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
              videoTools: 'Video Tools',
              imageTools: 'Image Tools',
            }}
            videoTools={homeVideoToolCards}
            imageTools={homeImageToolCards}
          />
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
