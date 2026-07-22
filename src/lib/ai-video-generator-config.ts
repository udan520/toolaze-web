import { calculateVideoGenerationCredits } from './generation-credits'

export type AiVideoGeneratorModeId = 'image-to-video' | 'text-to-video'
export type AiVideoGeneratorModelId = 'grok-1-5-video' | 'seedance-2' | 'seedance-2-mini' | 'kling-3'

export interface AiVideoGeneratorOption<T extends string | number = string> {
  value: T
  label: string
}

export interface AiVideoGeneratorModeOption {
  id: AiVideoGeneratorModeId
  label: string
  helper: string
}

export interface AiVideoGeneratorModelConfig {
  id: AiVideoGeneratorModelId
  name: string
  vendor: string
  description: string
  logoSrc: string
  logoAlt: string
  qualityRating: number
  badge?: 'Hot' | 'New'
  minCredits: number
  defaultMode: AiVideoGeneratorModeId
  maxImages: number
  maxFileSizeMb: number
  aspectRatios: Array<AiVideoGeneratorOption>
  durations: number[]
  defaultDuration?: number
  resolutions: string[]
  supportsNativeAudio?: boolean
  nativeAudioResolutions?: string[]
  promptPlaceholder: string
  samplePrompt: string
  previewTone: string
}

export interface AiVideoGeneratorModelGroup {
  id: string
  name: string
  logoSrc: string
  logoAlt: string
  models: AiVideoGeneratorModelConfig[]
}

export const AI_VIDEO_GENERATOR_MODE_OPTIONS: AiVideoGeneratorModeOption[] = [
  {
    id: 'image-to-video',
    label: 'Image to Video',
    helper: 'Upload a reference image, then describe the motion, camera, and mood.',
  },
  {
    id: 'text-to-video',
    label: 'Text to Video',
    helper: 'Describe the full scene from scratch with subject, action, style, and camera.',
  },
]

export const AI_VIDEO_GENERATOR_MODEL_OPTIONS: AiVideoGeneratorModelConfig[] = [
  {
    id: 'grok-1-5-video',
    name: 'Grok 1.5 Video',
    vendor: 'xAI',
    description: 'Fast reference-to-video motion for punchy product, creator, and social clips.',
    logoSrc: '/model-logos/grok.svg',
    logoAlt: 'Grok logo',
    qualityRating: 4,
    minCredits: 3,
    defaultMode: 'image-to-video',
    maxImages: 1,
    maxFileSizeMb: 20,
    aspectRatios: [
      { value: 'auto', label: 'Auto' },
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
      { value: '1:1', label: '1:1' },
      { value: '3:2', label: '3:2' },
      { value: '2:3', label: '2:3' },
    ],
    durations: Array.from({ length: 15 }, (_, index) => index + 1),
    defaultDuration: 3,
    resolutions: ['480p', '720p'],
    promptPlaceholder:
      'Animate this reference into a cinematic product reveal with subtle camera movement, realistic motion, and clean lighting.',
    samplePrompt:
      'A cinematic close-up of a futuristic sneaker rotating on a glossy black platform, neon rim light, slow push-in camera, premium commercial style.',
    previewTone: 'Cinematic motion preview',
  },
  {
    id: 'seedance-2',
    name: 'Seedance 2.0',
    vendor: 'ByteDance',
    description: 'High-control multimodal video generation for cinematic scenes and polished motion.',
    logoSrc: '/model-logos/bytedance.svg',
    logoAlt: 'ByteDance logo',
    qualityRating: 5,
    badge: 'Hot',
    minCredits: 150,
    defaultMode: 'image-to-video',
    maxImages: 9,
    maxFileSizeMb: 30,
    aspectRatios: [
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
    ],
    durations: [5, 10, 15],
    resolutions: ['480p', '720p', '1080p', '4K'],
    promptPlaceholder:
      'Describe the motion, camera path, lighting, and audio mood for the video.',
    samplePrompt:
      'A small coffee shop at sunrise, steam rising from a ceramic cup, soft handheld camera move, warm window light, calm ambient street sound.',
    previewTone: '1080p multimodal studio',
  },
  {
    id: 'seedance-2-mini',
    name: 'Seedance 2.0 Mini',
    vendor: 'ByteDance',
    description: 'Efficient Seedance workflow for faster 480p and 720p drafts with strong reference control.',
    logoSrc: '/model-logos/bytedance.svg',
    logoAlt: 'ByteDance logo',
    qualityRating: 4.5,
    badge: 'New',
    minCredits: 75,
    defaultMode: 'image-to-video',
    maxImages: 9,
    maxFileSizeMb: 30,
    aspectRatios: [
      { value: 'adaptive', label: 'Adaptive' },
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
      { value: '21:9', label: '21:9' },
    ],
    durations: [5, 10, 15],
    defaultDuration: 5,
    resolutions: ['480p', '720p'],
    promptPlaceholder:
      'Describe a fast, efficient video generation with clear subject motion, camera direction, and final framing.',
    samplePrompt:
      'A lifestyle product photo becomes a polished social video, gentle parallax, clean studio light, smooth motion, crisp 720p output.',
    previewTone: 'Fast 720p video preview',
  },
  {
    id: 'kling-3',
    name: 'Kling 3.0',
    vendor: 'Kuaishou',
    description: 'Sharp video generation for cinematic movement, high-resolution shots, and dynamic scenes.',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    qualityRating: 4.5,
    minCredits: 60,
    defaultMode: 'text-to-video',
    maxImages: 4,
    maxFileSizeMb: 30,
    aspectRatios: [
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
      { value: '1:1', label: '1:1' },
      { value: '21:9', label: '21:9' },
    ],
    durations: Array.from({ length: 13 }, (_, index) => index + 3),
    resolutions: ['720p', '1080p', '4K'],
    supportsNativeAudio: true,
    nativeAudioResolutions: ['720p', '1080p'],
    promptPlaceholder:
      'Write a full video prompt with subject, shot sequence, motion, audio, and final style.',
    samplePrompt:
      'A sleek electric car crosses a rain-soaked downtown bridge at night, 6-shot commercial sequence, reflections, tire spray, cinematic 4K lighting.',
    previewTone: '4K multi-shot preview',
  },
]

export const AI_VIDEO_GENERATOR_MODEL_GROUPS: AiVideoGeneratorModelGroup[] = [
  {
    id: 'grok',
    name: 'Grok',
    logoSrc: '/model-logos/grok.svg',
    logoAlt: 'Grok logo',
    models: [AI_VIDEO_GENERATOR_MODEL_OPTIONS[0]],
  },
  {
    id: 'seedance',
    name: 'Seedance',
    logoSrc: '/model-logos/bytedance.svg',
    logoAlt: 'ByteDance logo',
    models: [AI_VIDEO_GENERATOR_MODEL_OPTIONS[1], AI_VIDEO_GENERATOR_MODEL_OPTIONS[2]],
  },
  {
    id: 'kling',
    name: 'Kling',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    models: [AI_VIDEO_GENERATOR_MODEL_OPTIONS[3]],
  },
]

export function getAiVideoGeneratorModelGroupId(modelId: AiVideoGeneratorModelId): string {
  return AI_VIDEO_GENERATOR_MODEL_GROUPS.find((group) =>
    group.models.some((model) => model.id === modelId)
  )?.id || AI_VIDEO_GENERATOR_MODEL_GROUPS[0].id
}

export function getAiVideoGeneratorModelMinimumCredits(
  model: AiVideoGeneratorModelConfig
): number {
  const creditCosts = model.resolutions.flatMap((resolution) =>
    model.durations
      .map((duration) => calculateVideoGenerationCredits(model.id, resolution, duration))
      .filter((credits): credits is number => typeof credits === 'number')
  )

  return creditCosts.length > 0 ? Math.min(...creditCosts) : model.minCredits
}

export function getAiVideoGeneratorModelConfig(
  modelId: AiVideoGeneratorModelId
): AiVideoGeneratorModelConfig {
  return AI_VIDEO_GENERATOR_MODEL_OPTIONS.find((model) => model.id === modelId) ?? AI_VIDEO_GENERATOR_MODEL_OPTIONS[0]
}
