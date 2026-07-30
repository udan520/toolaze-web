export type AiImageGeneratorMode = 'text-to-image' | 'image-to-image'
export type AiImageGeneratorSettingKind = 'resolution' | 'quality'
export type AiImageGeneratorBadge = 'Hot' | 'New'

type AspectRatio = { value: string; label: string }

const ratios = (...values: string[]): AspectRatio[] =>
  values.map((value) => ({ value, label: value === 'auto' ? 'Auto' : value }))

interface AiImageGeneratorModelConfig {
  name: string
  description: string
  qualityRating: number
  badge?: AiImageGeneratorBadge
  vendor: string
  aspectRatios: AspectRatio[]
  maxImages: number
  maxFileSizeMb: number
  supportsOutputFormat: boolean
  supportsHighResolution: boolean
  defaultMode: AiImageGeneratorMode
  setting: {
    kind: AiImageGeneratorSettingKind
    options: string[]
    defaultValue: string
  }
  providerModels?: {
    textToImage?: string
    imageToImage?: string
  }
}

export const AI_IMAGE_GENERATOR_MODELS = {
  'nano-banana-pro': {
    name: 'Nano Banana Pro',
    description: 'Reliable image editing workflow for style transfer and reference-guided output.',
    qualityRating: 5,
    vendor: 'Google',
    aspectRatios: ratios('1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9', 'auto'),
    maxImages: 8,
    maxFileSizeMb: 30,
    supportsOutputFormat: true,
    supportsHighResolution: false,
    defaultMode: 'image-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K', '4K'], defaultValue: '1K' },
  },
  'nano-banana-2': {
    name: 'Nano Banana 2',
    description: 'Newer multi-reference image workflow with high-resolution output.',
    qualityRating: 4,
    vendor: 'Google',
    aspectRatios: ratios('auto', '1:1', '1:4', '1:8', '2:3', '3:2', '3:4', '4:1', '4:3', '4:5', '5:4', '8:1', '9:16', '16:9', '21:9'),
    maxImages: 14,
    maxFileSizeMb: 30,
    supportsOutputFormat: true,
    supportsHighResolution: true,
    defaultMode: 'image-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K', '4K'], defaultValue: '1K' },
  },
  'gpt-image-2': {
    name: 'GPT Image 2',
    description: 'Create structured images, marketing visuals, mockups, and image edits.',
    qualityRating: 5,
    badge: 'Hot',
    vendor: 'OpenAI',
    aspectRatios: ratios('auto', '1:1', '9:16', '16:9', '4:3', '3:4'),
    maxImages: 16,
    maxFileSizeMb: 30,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K', '4K'], defaultValue: '1K' },
    providerModels: {
      textToImage: 'gpt-image-2-text-to-image',
      imageToImage: 'gpt-image-2-image-to-image',
    },
  },
  'gpt-image-1-5': {
    name: 'GPT Image 1.5',
    description: 'Generate and edit polished images with strong prompt following and multi-image references.',
    qualityRating: 4.5,
    badge: 'New',
    vendor: 'OpenAI',
    aspectRatios: ratios('1:1', '2:3', '3:2'),
    maxImages: 16,
    maxFileSizeMb: 10,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'quality', options: ['medium', 'high'], defaultValue: 'medium' },
    providerModels: {
      textToImage: 'gpt-image/1.5-text-to-image',
      imageToImage: 'gpt-image/1.5-image-to-image',
    },
  },
  'grok-1-5-image': {
    name: 'Grok 1.5 Image',
    description: 'Create image drafts, stylized scenes, and prompt-led visuals.',
    qualityRating: 4,
    badge: 'New',
    vendor: 'xAI',
    aspectRatios: ratios('auto', '1:1', '9:16', '16:9', '4:3', '3:4'),
    maxImages: 1,
    maxFileSizeMb: 30,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K', '4K'], defaultValue: '1K' },
    providerModels: {
      textToImage: 'grok-imagine/text-to-image',
      imageToImage: 'grok-imagine/image-to-image',
    },
  },
  'grok-video-1-5': {
    name: 'Grok Video 1.5',
    description: 'Create short video scenes from up to seven reference images and a motion prompt.',
    qualityRating: 4,
    badge: 'New',
    vendor: 'xAI',
    aspectRatios: ratios('9:16', '16:9'),
    maxImages: 7,
    maxFileSizeMb: 30,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'image-to-image',
    setting: { kind: 'resolution', options: ['480p', '720p'], defaultValue: '480p' },
  },
  'seedream-4-5': {
    name: 'Seedream 4.5',
    description: 'Reference-aware image generation for posters, products, and typography.',
    qualityRating: 4,
    vendor: 'ByteDance',
    aspectRatios: ratios('1:1', '4:3', '3:4', '16:9', '9:16', '2:3', '3:2', '21:9'),
    maxImages: 14,
    maxFileSizeMb: 10,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K', '4K'], defaultValue: '1K' },
  },
  'seedream-5-0-lite': {
    name: 'Seedream 5.0 Lite',
    description: 'Fast Seedream workflow for drafts, concepts, and lightweight iterations.',
    qualityRating: 4.5,
    vendor: 'ByteDance',
    aspectRatios: ratios('1:1', '4:3', '3:4', '16:9', '9:16', '2:3', '3:2', '21:9'),
    maxImages: 14,
    maxFileSizeMb: 10,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K', '4K'], defaultValue: '1K' },
  },
  'seedream-5-0-pro': {
    name: 'Seedream 5.0 Pro',
    description: 'Higher quality Seedream workflow for polished product and campaign images.',
    qualityRating: 5,
    badge: 'New',
    vendor: 'ByteDance',
    aspectRatios: ratios('1:1', '4:3', '3:4', '16:9', '9:16', '2:3', '3:2', '21:9'),
    maxImages: 14,
    maxFileSizeMb: 10,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K'], defaultValue: '1K' },
  },
  'wan-2-7-image': {
    name: 'Wan 2.7 Image',
    description: 'Create images with multi-reference support and structured visual reasoning.',
    qualityRating: 4,
    vendor: 'Wan AI',
    aspectRatios: ratios('1:1', '4:3', '3:4', '16:9', '9:16'),
    maxImages: 9,
    maxFileSizeMb: 10,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K', '4K'], defaultValue: '1K' },
  },
  'flux-2-pro': {
    name: 'Flux 2 Pro',
    description: 'High-fidelity generation and editing for production-ready visual work.',
    qualityRating: 5,
    badge: 'New',
    vendor: 'Black Forest Labs',
    aspectRatios: ratios('1:1', '4:3', '3:4', '16:9', '9:16', '3:2', '2:3'),
    maxImages: 8,
    maxFileSizeMb: 10,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K'], defaultValue: '1K' },
    providerModels: {
      textToImage: 'flux-2/pro-text-to-image',
      imageToImage: 'flux-2/pro-image-to-image',
    },
  },
  'flux-2-flex': {
    name: 'Flux 2 Flex',
    description: 'Flexible prompt-led generation and reference editing for rapid creative iteration.',
    qualityRating: 4.5,
    vendor: 'Black Forest Labs',
    aspectRatios: ratios('1:1', '4:3', '3:4', '16:9', '9:16', '3:2', '2:3'),
    maxImages: 8,
    maxFileSizeMb: 10,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    defaultMode: 'text-to-image',
    setting: { kind: 'resolution', options: ['1K', '2K'], defaultValue: '1K' },
    providerModels: {
      textToImage: 'flux-2/flex-text-to-image',
      imageToImage: 'flux-2/flex-image-to-image',
    },
  },
} satisfies Record<string, AiImageGeneratorModelConfig>

export type AiImageGeneratorModelId = keyof typeof AI_IMAGE_GENERATOR_MODELS

export interface AiImageGeneratorGroup {
  id: string
  name: string
  description: string
  logoSrc: string
  logoAlt: string
  modelIds: AiImageGeneratorModelId[]
}

export const AI_IMAGE_GENERATOR_GROUPS: AiImageGeneratorGroup[] = [
  {
    id: 'openai-gpt',
    name: 'OpenAI GPT',
    description: 'Structured image generation and controlled edits.',
    logoSrc: '/model-logos/openai.svg',
    logoAlt: 'OpenAI logo',
    modelIds: ['gpt-image-2', 'gpt-image-1-5'],
  },
  {
    id: 'seedream',
    name: 'Seedream',
    description: 'Commercial image generation, reference editing, and design layouts.',
    logoSrc: '/model-logos/dreamina.ico',
    logoAlt: 'Dreamina logo',
    modelIds: ['seedream-5-0-pro', 'seedream-5-0-lite', 'seedream-4-5'],
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    description: 'Reference-heavy image editing and multi-image creative workflows.',
    logoSrc: '/model-logos/google-gemini.png',
    logoAlt: 'Google Gemini logo',
    modelIds: ['nano-banana-pro', 'nano-banana-2'],
  },
  {
    id: 'xai',
    name: 'xAI',
    description: 'Grok generation for fast creative drafts, images, and video scenes.',
    logoSrc: '/model-logos/grok.svg',
    logoAlt: 'xAI logo',
    modelIds: ['grok-video-1-5', 'grok-1-5-image'],
  },
  {
    id: 'wan-ai',
    name: 'Wan AI',
    description: 'Thinking-mode image generation and multi-reference composition.',
    logoSrc: '/model-logos/wan.ico',
    logoAlt: 'Wan AI logo',
    modelIds: ['wan-2-7-image'],
  },
  {
    id: 'flux',
    name: 'Flux',
    description: 'Production-grade image generation and reference editing from Black Forest Labs.',
    logoSrc: '/model-logos/flux.svg',
    logoAlt: 'Black Forest Labs Flux logo',
    modelIds: ['flux-2-pro', 'flux-2-flex'],
  },
]

export const AI_IMAGE_GENERATOR_MODEL_OPTIONS = AI_IMAGE_GENERATOR_GROUPS.flatMap((group) =>
  group.modelIds.map((id) => ({ id, ...AI_IMAGE_GENERATOR_MODELS[id] })),
)

export const getAiImageGeneratorModel = (id: AiImageGeneratorModelId) =>
  AI_IMAGE_GENERATOR_MODELS[id]
