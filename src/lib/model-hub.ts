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

export const MODEL_HUB_MODELS: ModelHubModel[] = [
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
    name: 'Seedance 2.0',
    href: '/model/seedance-2',
    category: 'video',
    vendor: 'ByteDance',
    logoSrc: '/model-logos/bytedance.svg',
    logoAlt: 'ByteDance logo',
    qualityRating: 5,
  },
  {
    name: 'Kling 3.0',
    href: '/model/kling-3',
    category: 'video',
    vendor: 'Kuaishou',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    qualityRating: 4.5,
  },
  {
    name: 'Grok 1.5 Video',
    href: '/model/grok-imagine-video-1-5',
    category: 'video',
    vendor: 'xAI',
    logoSrc: '/model-logos/grok.svg',
    logoAlt: 'Grok logo',
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
