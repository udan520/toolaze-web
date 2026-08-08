import {
  AI_VIDEO_GENERATOR_MODEL_OPTIONS,
  type AiVideoGeneratorModelId,
} from './ai-video-generator-config'
import {
  AI_IMAGE_GENERATOR_GROUPS,
  AI_IMAGE_GENERATOR_MODEL_OPTIONS,
} from './ai-image-generator-config'

export type ModelHubCategory = 'all' | 'image' | 'video'

export interface ModelHubModel {
  name: string
  href: string
  category: Exclude<ModelHubCategory, 'all'>
  vendor: string
  logoSrc: string
  logoAlt: string
  qualityRating: number | null
}

const VIDEO_MODEL_PAGE_HREFS: Partial<Record<AiVideoGeneratorModelId, string>> = {
  'veo-3-1-fast': '/model/veo-3-1-ai-video-generator',
  'veo-3-1-lite': '/model/veo-3-1-ai-video-generator',
  'veo-3-1-quality': '/model/veo-3-1-ai-video-generator',
  'wan-2-7': '/model/wan-2-7-ai-video-generator',
  'wan-3-0': '/model/wan-3-0-ai-video-generator',
  'wan-2-6': '/model/wan-2-6-ai-video-generator',
  'wan-2-5': '/model/wan-2-5-ai-video-generator',
  'grok-1-5-video': '/model/grok-imagine-video-1-5',
  'pixverse-v6': '/model/pixverse-v6-ai-video-generator',
  'happyhorse-1-1': '/model/happyhorse-ai-video-generator',
  'happyhorse': '/model/happyhorse-ai-video-generator',
  'seedance-2': '/model/seedance-2',
  'kling-3': '/model/kling-3',
  'kling-2-6-motion-control': '/model/kling-2-6-pro-motion-control',
  'kling-3-motion-control': '/model/kling-3-motion-control',
}

const IMAGE_MODEL_PAGE_HREFS: Record<string, string> = {
  'gpt-image-2': '/model/gpt-image-2',
  'seedream-5-0-pro': '/model/seedream-5-0-pro',
  'nano-banana-pro': '/model/nano-banana-pro',
  'seedream-5-0-lite': '/model/seedream-5-0-lite',
  'wan-2-7-image': '/model/wan-2-7-image',
  'nano-banana-2': '/model/nano-banana-2',
  'seedream-4-5': '/model/seedream-4-5',
}

const LEGACY_MODEL_HUB_MODELS: ModelHubModel[] = [
  {
    name: 'GPT Image 2',
    href: '/model/gpt-image-2',
    category: 'image',
    vendor: 'OpenAI',
    logoSrc: '/model-logos/openai.svg',
    logoAlt: 'OpenAI logo',
    qualityRating: 5,
  },
  {
    name: 'Seedream 5.0 Pro',
    href: '/model/seedream-5-0-pro',
    category: 'image',
    vendor: 'ByteDance',
    logoSrc: '/model-logos/dreamina.ico',
    logoAlt: 'Dreamina logo',
    qualityRating: 5,
  },
  {
    name: 'Nano Banana Pro',
    href: '/model/nano-banana-pro',
    category: 'image',
    vendor: 'Google',
    logoSrc: '/model-logos/google-gemini.png',
    logoAlt: 'Google Gemini logo',
    qualityRating: 5,
  },
  {
    name: 'Seedream 5.0 Lite',
    href: '/model/seedream-5-0-lite',
    category: 'image',
    vendor: 'ByteDance',
    logoSrc: '/model-logos/dreamina.ico',
    logoAlt: 'Dreamina logo',
    qualityRating: 4.5,
  },
  {
    name: 'Wan 2.7 Image',
    href: '/model/wan-2-7-image',
    category: 'image',
    vendor: 'Wan AI',
    logoSrc: '/model-logos/wan.ico',
    logoAlt: 'Wan AI logo',
    qualityRating: 4,
  },
  {
    name: 'Nano Banana 2',
    href: '/model/nano-banana-2',
    category: 'image',
    vendor: 'Google',
    logoSrc: '/model-logos/google-gemini.png',
    logoAlt: 'Google Gemini logo',
    qualityRating: 4,
  },
  {
    name: 'Seedream 4.5',
    href: '/model/seedream-4-5',
    category: 'image',
    vendor: 'ByteDance',
    logoSrc: '/model-logos/dreamina.ico',
    logoAlt: 'Dreamina logo',
    qualityRating: 4,
  },
  {
    name: 'Seedance 2.5',
    href: '/model/seedance-2-5',
    category: 'video',
    vendor: 'ByteDance',
    logoSrc: '/model-logos/bytedance.svg',
    logoAlt: 'ByteDance logo',
    qualityRating: null,
  },
  ...AI_VIDEO_GENERATOR_MODEL_OPTIONS.map((model) => ({
    name: model.name,
    href: VIDEO_MODEL_PAGE_HREFS[model.id] || '/ai-video-generator',
    category: 'video' as const,
    vendor: model.vendor,
    logoSrc: model.logoSrc,
    logoAlt: model.logoAlt,
    qualityRating: model.qualityRating,
  })),
]

const IMAGE_MODEL_GROUPS = new Map(
  AI_IMAGE_GENERATOR_GROUPS.flatMap((group) =>
    group.modelIds.map((modelId) => [modelId, group] as const),
  ),
)

export const MODEL_HUB_MODELS: ModelHubModel[] = [
  ...AI_IMAGE_GENERATOR_MODEL_OPTIONS
    .filter((model) => model.id !== 'grok-video-1-5')
    .map((model) => {
      const group = IMAGE_MODEL_GROUPS.get(model.id)
      return {
        name: model.name,
        href: IMAGE_MODEL_PAGE_HREFS[model.id] || `/ai-image-generator?model=${model.id}`,
        category: 'image' as const,
        vendor: model.vendor,
        logoSrc: group?.logoSrc || '/model-logos/openai.svg',
        logoAlt: group?.logoAlt || `${model.vendor} logo`,
        qualityRating: model.qualityRating,
      }
    }),
  ...LEGACY_MODEL_HUB_MODELS.filter((model) => model.category === 'video'),
]

export function getModelHubModels(category: ModelHubCategory): ModelHubModel[] {
  return MODEL_HUB_MODELS
    .filter((model) => category === 'all' || model.category === category)
    .sort((left, right) => {
      if (left.qualityRating === null) return 1
      if (right.qualityRating === null) return -1
      return right.qualityRating - left.qualityRating
    })
}
