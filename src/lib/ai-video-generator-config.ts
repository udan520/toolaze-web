import { calculateVideoGenerationCredits } from './generation-credits'

export type AiVideoGeneratorModeId = 'image-to-video' | 'text-to-video'
export type AiVideoGeneratorModelId =
  | 'grok-1-5-video'
  | 'seedance-2'
  | 'seedance-2-mini'
  | 'seedance-2-fast'
  | 'seedance-1-5-pro'
  | 'seedance-1-pro-fast'
  | 'seedance-1-pro'
  | 'seedance-1-lite'
  | 'wan-2-7'
  | 'wan-2-6'
  | 'wan-2-5'
  | 'wan-2-2'
  | 'kling-3-turbo'
  | 'kling-3-motion-control'
  | 'kling-3'
  | 'kling-2-6-motion-control'
  | 'kling-2-6'
  | 'kling-2-5'
  | 'kling-2-1'
  | 'veo-3-1-lite'
  | 'veo-3-1-fast'
  | 'veo-3-1-quality'
  | 'pixverse-v6'
  | 'happyhorse-1-1'
  | 'happyhorse'

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
  supportedModes: AiVideoGeneratorModeId[]
  maxImages: number
  maxFileSizeMb: number
  maxVideos?: number
  maxVideoFileSizeMb?: number
  supportsMotionReferenceVideo?: boolean
  promptRequired?: boolean
  durationMode?: 'manual' | 'reference-video'
  imageToVideoAspectRatioMode?: 'manual' | 'reference-image'
  referenceVideoMinDurationSeconds?: number
  referenceVideoMaxDurationSeconds?: number
  acceptedImageMimeTypes?: string[]
  acceptedImageExtensions?: string[]
  acceptedImageFormats?: string[]
  referenceImageMinDimensionPx?: number
  referenceImageAspectRatioMin?: number
  referenceImageAspectRatioMax?: number
  referenceImageHelperText?: string
  invalidImageTypeMessage?: string
  invalidImageDimensionsMessage?: string
  acceptedMotionVideoFormats?: string[]
  uploadPurpose?: 'kling-motion-control'
  aspectRatios: Array<AiVideoGeneratorOption>
  durations: number[]
  defaultDuration?: number
  resolutions: string[]
  supportsNativeAudio?: boolean
  nativeAudioResolutions?: string[]
  supportsNativeAudioOutput: boolean
  supportsMultiShot: boolean
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

const AI_VIDEO_GENERATOR_MODEL_OPTIONS_BASE = [
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
    minCredits: 190,
    defaultMode: 'image-to-video',
    maxImages: 2,
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
    minCredits: 95,
    defaultMode: 'image-to-video',
    maxImages: 2,
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
  ...([
    ['seedance-2-fast', 'Seedance 2.0 Fast', 155, ['480p', '720p'], [5, 10, 15], 2, false],
    ['seedance-1-5-pro', 'Seedance 1.5 Pro', 16, ['480p', '720p', '1080p'], [4, 8, 12], 2, true],
    ['seedance-1-pro-fast', 'Seedance 1.0 Pro Fast', 32, ['720p', '1080p'], [5, 10], 1, false],
    ['seedance-1-pro', 'Seedance 1.0 Pro', 30, ['480p', '720p', '1080p'], [5, 10], 1, false],
    ['seedance-1-lite', 'Seedance 1.0 Lite', 20, ['480p', '720p', '1080p'], [5, 10], 1, false],
  ] as const).map(([id, name, minCredits, resolutions, durations, maxImages, supportsNativeAudio]) => ({
    id,
    name,
    vendor: 'ByteDance',
    description: id === 'seedance-1-pro-fast'
      ? 'Fast image-to-video generation with stable motion and polished 720p or 1080p output.'
      : 'ByteDance text-to-video and image-to-video generation with controllable camera motion and flexible output settings.',
    logoSrc: '/model-logos/bytedance.svg',
    logoAlt: 'ByteDance logo',
    qualityRating: id === 'seedance-2-fast' ? 4.5 : id === 'seedance-1-5-pro' ? 4.5 : 4,
    badge: id === 'seedance-2-fast' || id === 'seedance-1-pro-fast' ? 'New' as const : undefined,
    minCredits,
    defaultMode: id === 'seedance-1-pro-fast' ? 'image-to-video' as const : 'text-to-video' as const,
    supportedModes: id === 'seedance-1-pro-fast'
      ? ['image-to-video' as const]
      : ['image-to-video' as const, 'text-to-video' as const],
    imageToVideoAspectRatioMode: id === 'seedance-1-pro-fast' || id === 'seedance-1-pro' || id === 'seedance-1-lite'
      ? 'reference-image' as const
      : undefined,
    maxImages,
    maxFileSizeMb: id.startsWith('seedance-2') ? 30 : 10,
    aspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4'].map((value) => ({ value, label: value })),
    durations: [...durations],
    defaultDuration: durations[0],
    resolutions: [...resolutions],
    supportsNativeAudio,
    nativeAudioResolutions: supportsNativeAudio ? [...resolutions] : undefined,
    promptPlaceholder: 'Describe the scene, action, camera movement, lighting, and audio when enabled.',
    samplePrompt: 'A cinematic product scene with controlled camera movement, natural motion, detailed lighting, and clean composition.',
    previewTone: 'Seedance cinematic preview',
  })),
  {
    id: 'wan-2-7',
    name: 'Wan 2.7',
    vendor: 'Alibaba',
    description: 'Latest Wan generation with first/last-frame control, audio-guided motion, and polished 1080p output.',
    logoSrc: '/model-logos/wan.ico',
    logoAlt: 'Wan logo',
    qualityRating: 5,
    badge: 'New',
    minCredits: 64,
    defaultMode: 'text-to-video',
    maxImages: 2,
    maxFileSizeMb: 10,
    aspectRatios: [{ value: '16:9', label: '16:9' }, { value: '9:16', label: '9:16' }, { value: '1:1', label: '1:1' }],
    durations: Array.from({ length: 9 }, (_, index) => index + 2),
    defaultDuration: 3,
    resolutions: ['720p', '1080p'],
    promptPlaceholder: 'Describe the visuals, motion, camera, and synchronized ASMR sound.',
    samplePrompt: 'Macro ASMR glass fruit cutting, slow precise blade motion, crisp synchronized sound, soft studio light.',
    previewTone: 'Native-audio cinematic preview',
  },
  ...([
    ['wan-2-6', 'Wan 2.6', 140, [5, 10, 15], ['720p', '1080p']],
    ['wan-2-5', 'Wan 2.5', 120, [5, 10], ['720p', '1080p']],
    ['wan-2-2', 'Wan 2.2', 16, [5], ['480p', '720p']],
  ] as const).map(([id, name, minCredits, durations, resolutions]) => ({
    id,
    name,
    vendor: 'Alibaba',
    description: 'Wan text-to-video and image-to-video generation with controllable cinematic motion.',
    logoSrc: '/model-logos/wan.ico',
    logoAlt: 'Wan logo',
    qualityRating: id === 'wan-2-6' ? 4.5 : 4,
    minCredits,
    defaultMode: 'text-to-video' as const,
    imageToVideoAspectRatioMode: 'reference-image' as const,
    maxImages: 1,
    maxFileSizeMb: 10,
    aspectRatios: [{ value: '16:9', label: '16:9' }, { value: '9:16', label: '9:16' }, { value: '1:1', label: '1:1' }],
    durations: [...durations],
    defaultDuration: 5,
    resolutions: [...resolutions],
    promptPlaceholder: 'Describe the subject, motion, camera direction, and desired audio.',
    samplePrompt: 'A tactile ASMR close-up with slow deliberate motion, detailed materials, and clean synchronized sound.',
    previewTone: 'Cinematic Wan video preview',
  })),
  ...([
    ['kling-3-turbo', 'Kling 3 Turbo', 180, ['720p', '1080p'], true],
  ] as const).map(([id, name, minCredits, resolutions, supportsNativeAudio]) => ({
    id,
    name,
    vendor: 'Kuaishou',
    description: 'Fast Kling generation for expressive motion, native audio, and short cinematic scenes.',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    qualityRating: 4.5,
    badge: 'New' as const,
    minCredits,
    defaultMode: 'text-to-video' as const,
    maxImages: 2,
    maxFileSizeMb: 10,
    aspectRatios: [{ value: '16:9', label: '16:9' }, { value: '9:16', label: '9:16' }, { value: '1:1', label: '1:1' }],
    durations: [5, 10],
    defaultDuration: 5,
    resolutions: [...resolutions],
    supportsNativeAudio,
    nativeAudioResolutions: [...resolutions],
    promptPlaceholder: 'Describe a complete scene with motion, camera, dialogue, and sound.',
    samplePrompt: 'A cinematic macro ASMR scene with precise hand motion and crisp synchronized material sounds.',
    previewTone: 'Fast native-audio preview',
  })),
  {
    id: 'kling-3',
    name: 'Kling 3.0',
    vendor: 'Kuaishou',
    description: 'Sharp video generation for cinematic movement, high-resolution shots, and dynamic scenes.',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    qualityRating: 4.5,
    minCredits: 84,
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
  {
    id: 'kling-3-motion-control',
    name: 'Kling 3 Motion Control',
    vendor: 'Kuaishou',
    description: 'Reference-video motion control for one character image and one motion clip at 720p or 1080p.',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    qualityRating: 4.5,
    badge: 'New',
    minCredits: 120,
    defaultMode: 'image-to-video',
    supportedModes: ['image-to-video'],
    maxImages: 1,
    maxFileSizeMb: 10,
    maxVideos: 1,
    maxVideoFileSizeMb: 100,
    supportsMotionReferenceVideo: true,
    promptRequired: false,
    durationMode: 'reference-video',
    referenceVideoMinDurationSeconds: 3,
    referenceVideoMaxDurationSeconds: 30,
    acceptedMotionVideoFormats: ['MP4', 'QuickTime'],
    uploadPurpose: 'kling-motion-control',
    acceptedImageMimeTypes: ['image/jpeg', 'image/png'],
    acceptedImageExtensions: ['jpg', 'jpeg', 'png'],
    acceptedImageFormats: ['JPG', 'PNG'],
    referenceImageMinDimensionPx: 300,
    referenceImageAspectRatioMin: 2 / 5,
    referenceImageAspectRatioMax: 5 / 2,
    referenceImageHelperText: 'JPG or PNG up to {size}MB. Use an image over 300px with a 2:5 to 5:2 aspect ratio.',
    invalidImageTypeMessage: 'Use JPG or PNG for the Kling 3 Motion Control character image.',
    invalidImageDimensionsMessage: 'Use an image over 300px with a 2:5 to 5:2 aspect ratio for Kling 3 Motion Control.',
    aspectRatios: [{ value: '16:9', label: '16:9' }, { value: '9:16', label: '9:16' }, { value: '1:1', label: '1:1' }],
    durations: Array.from({ length: 28 }, (_, index) => index + 3),
    defaultDuration: 3,
    resolutions: ['720p', '1080p'],
    promptPlaceholder: 'Describe how the character image should follow the uploaded motion reference video while preserving identity and style.',
    samplePrompt: 'Make the character follow the motion reference naturally, preserve facial identity, outfit, proportions, lighting, and camera rhythm.',
    previewTone: 'Motion reference transfer preview',
  },
  {
    id: 'kling-2-6-motion-control',
    name: 'Kling 2.6 Motion Control',
    vendor: 'Kuaishou',
    description: 'Reference-video motion transfer for one character image and one motion video.',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    qualityRating: 4.5,
    badge: 'New',
    minCredits: 66,
    defaultMode: 'image-to-video',
    supportedModes: ['image-to-video'],
    maxImages: 1,
    maxFileSizeMb: 10,
    maxVideos: 1,
    maxVideoFileSizeMb: 100,
    supportsMotionReferenceVideo: true,
    promptRequired: false,
    durationMode: 'reference-video',
    imageToVideoAspectRatioMode: 'reference-image',
    referenceVideoMinDurationSeconds: 3,
    referenceVideoMaxDurationSeconds: 30,
    acceptedMotionVideoFormats: ['MP4', 'QuickTime', 'Matroska'],
    uploadPurpose: 'kling-motion-control',
    acceptedImageMimeTypes: ['image/jpeg', 'image/png'],
    acceptedImageExtensions: ['jpg', 'jpeg', 'png'],
    acceptedImageFormats: ['JPG', 'PNG'],
    referenceImageMinDimensionPx: 300,
    referenceImageAspectRatioMin: 2 / 5,
    referenceImageAspectRatioMax: 5 / 2,
    referenceImageHelperText: 'JPG or PNG up to {size}MB. Use an image over 300px with a 2:5 to 5:2 aspect ratio.',
    invalidImageTypeMessage: 'Use JPG or PNG for the Kling 2.6 Motion Control character image.',
    invalidImageDimensionsMessage: 'Use an image over 300px with a 2:5 to 5:2 aspect ratio for Kling 2.6 Motion Control.',
    aspectRatios: [{ value: '16:9', label: '16:9' }, { value: '9:16', label: '9:16' }, { value: '1:1', label: '1:1' }],
    durations: Array.from({ length: 28 }, (_, index) => index + 3),
    defaultDuration: 3,
    resolutions: ['720p', '1080p'],
    promptPlaceholder: 'Describe how the character should follow the uploaded motion reference video while preserving identity and style.',
    samplePrompt: 'Make the character follow the motion reference naturally, preserve facial identity, outfit, body proportions, and clean studio lighting.',
    previewTone: 'Motion reference transfer preview',
  },
  ...([
    ['kling-2-6', 'Kling 2.6', 110, ['720p', '1080p'], true],
    ['kling-2-5', 'Kling 2.5 Turbo Pro', 85, ['1080p'], false],
    ['kling-2-1', 'Kling 2.1 Master', 320, ['1080p'], false],
  ] as const).map(([id, name, minCredits, resolutions, supportsNativeAudio]) => ({
    id,
    name,
    vendor: 'Kuaishou',
    description: 'Reliable Kling text-to-video and image-to-video generation with strong motion consistency.',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    qualityRating: id === 'kling-2-6' ? 4.5 : 4,
    minCredits,
    defaultMode: 'text-to-video' as const,
    maxImages: 1,
    maxFileSizeMb: 10,
    aspectRatios: [{ value: '16:9', label: '16:9' }, { value: '9:16', label: '9:16' }, { value: '1:1', label: '1:1' }],
    durations: [5, 10],
    defaultDuration: 5,
    resolutions: [...resolutions],
    supportsNativeAudio,
    nativeAudioResolutions: supportsNativeAudio ? [...resolutions] : undefined,
    promptPlaceholder: 'Describe the subject, movement, camera, and final visual style.',
    samplePrompt: 'A close-up ASMR scene with controlled motion, tactile materials, and cinematic lighting.',
    previewTone: 'Kling cinematic preview',
  })),
  ...([
    ['veo-3-1-lite', 'Veo 3.1 Lite', 30, 4],
    ['veo-3-1-fast', 'Veo 3.1 Fast', 60, 4.5],
    ['veo-3-1-quality', 'Veo 3.1 Quality', 450, 5],
  ] as const).map(([id, name, minCredits, qualityRating]) => ({
    id,
    name,
    vendor: 'Google',
    description: 'Native-audio video generation for detailed motion, synchronized sound, and cinematic scenes.',
    logoSrc: '/model-logos/google-gemini.png',
    logoAlt: 'Google Gemini logo',
    qualityRating,
    minCredits,
    defaultMode: 'text-to-video' as const,
    maxImages: 2,
    maxFileSizeMb: 30,
    aspectRatios: [
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
    ],
    durations: [4, 6, 8],
    defaultDuration: 8,
    resolutions: ['720p', '1080p'],
    promptPlaceholder: 'Describe the scene, motion, camera, textures, and synchronized audio in detail.',
    samplePrompt: 'A macro ASMR soap cutting scene, precise blade movement, crisp synchronized texture sounds, soft studio light.',
    previewTone: 'Native-audio cinematic preview',
  })),
  {
    id: 'pixverse-v6',
    name: 'PixVerse V6',
    vendor: 'PixVerse',
    description: 'Flexible text-to-video and image-to-video generation with native audio and outputs up to 1080p.',
    logoSrc: '/model-logos/pixverse.svg',
    logoAlt: 'PixVerse logo',
    qualityRating: 4.5,
    badge: 'New',
    minCredits: 8,
    defaultMode: 'text-to-video',
    maxImages: 1,
    maxFileSizeMb: 20,
    aspectRatios: ['16:9', '4:3', '1:1', '3:4', '9:16', '2:3', '3:2', '21:9']
      .map((value) => ({ value, label: value })),
    durations: Array.from({ length: 15 }, (_, index) => index + 1),
    defaultDuration: 5,
    resolutions: ['360p', '540p', '720p', '1080p'],
    supportsNativeAudio: true,
    nativeAudioResolutions: ['360p', '540p', '720p', '1080p'],
    promptPlaceholder: 'Describe the scene, motion, camera, visual style, and synchronized sound.',
    samplePrompt: 'A cinematic macro product reveal with smooth camera movement, tactile details, and synchronized ambient audio.',
    previewTone: 'Native-audio PixVerse preview',
  },
  ...([
    ['happyhorse-1-1', 'HappyHorse 1.1', 135, 4.5],
    ['happyhorse', 'HappyHorse', 168, 4],
  ] as const).map(([id, name, minCredits, qualityRating]) => ({
    id,
    name,
    vendor: 'Alibaba',
    description: 'Text-to-video and image-to-video generation with smooth motion and consistent visual storytelling.',
    logoSrc: '/model-logos/happyhorse.svg',
    logoAlt: 'HappyHorse logo',
    qualityRating,
    minCredits,
    defaultMode: 'text-to-video' as const,
    imageToVideoAspectRatioMode: 'reference-image' as const,
    maxImages: 1,
    maxFileSizeMb: 20,
    aspectRatios: [
      '16:9',
      '9:16',
      '1:1',
      '4:3',
      '3:4',
      ...(id === 'happyhorse-1-1' ? ['4:5', '5:4', '9:21', '21:9'] : []),
    ].map((value) => ({ value, label: value })),
    durations: Array.from({ length: 13 }, (_, index) => index + 3),
    defaultDuration: 5,
    resolutions: ['720p', '1080p'],
    promptPlaceholder: 'Describe the subject, action, camera movement, lighting, and final visual style.',
    samplePrompt: 'A polished cinematic scene with expressive subject motion, smooth camera movement, and detailed natural lighting.',
    previewTone: 'HappyHorse cinematic preview',
  })),
]

const NATIVE_AUDIO_OUTPUT_MODEL_IDS = new Set<AiVideoGeneratorModelId>([
  'grok-1-5-video',
  'seedance-2',
  'seedance-2-mini',
  'seedance-1-5-pro',
  'wan-2-6',
  'wan-2-5',
  'kling-3-turbo',
  'kling-3',
  'kling-2-6-motion-control',
  'kling-2-6',
  'veo-3-1-lite',
  'veo-3-1-fast',
  'veo-3-1-quality',
  'pixverse-v6',
  'happyhorse-1-1',
  'happyhorse',
])

const MULTI_SHOT_MODEL_IDS = new Set<AiVideoGeneratorModelId>([
  'seedance-2',
  'seedance-2-mini',
  'seedance-2-fast',
  'seedance-1-5-pro',
  'seedance-1-pro-fast',
  'seedance-1-pro',
  'wan-2-6',
  'kling-3-turbo',
  'kling-3',
  'veo-3-1-lite',
  'veo-3-1-fast',
  'veo-3-1-quality',
  'pixverse-v6',
  'happyhorse-1-1',
  'happyhorse',
])

export const AI_VIDEO_GENERATOR_MODEL_OPTIONS: AiVideoGeneratorModelConfig[] =
  AI_VIDEO_GENERATOR_MODEL_OPTIONS_BASE.map((model) => ({
    ...model,
    supportedModes: Array.isArray((model as { supportedModes?: AiVideoGeneratorModeId[] }).supportedModes)
      ? [...(model as { supportedModes: AiVideoGeneratorModeId[] }).supportedModes]
      : ['image-to-video', 'text-to-video'],
    supportsNativeAudioOutput: NATIVE_AUDIO_OUTPUT_MODEL_IDS.has(model.id as AiVideoGeneratorModelId),
    supportsMultiShot: MULTI_SHOT_MODEL_IDS.has(model.id as AiVideoGeneratorModelId),
  })) as AiVideoGeneratorModelConfig[]

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
    models: AI_VIDEO_GENERATOR_MODEL_OPTIONS.filter((model) => model.id.startsWith('seedance-')),
  },
  {
    id: 'wan',
    name: 'Wan',
    logoSrc: '/model-logos/wan.ico',
    logoAlt: 'Wan logo',
    models: AI_VIDEO_GENERATOR_MODEL_OPTIONS.filter((model) => model.id.startsWith('wan-')),
  },
  {
    id: 'kling',
    name: 'Kling',
    logoSrc: '/model-logos/kling.svg',
    logoAlt: 'Kling logo',
    models: AI_VIDEO_GENERATOR_MODEL_OPTIONS.filter((model) => model.id.startsWith('kling-')),
  },
  {
    id: 'veo',
    name: 'Veo',
    logoSrc: '/model-logos/google-gemini.png',
    logoAlt: 'Google Gemini logo',
    models: AI_VIDEO_GENERATOR_MODEL_OPTIONS.filter((model) => model.id.startsWith('veo-')),
  },
  {
    id: 'pixverse',
    name: 'PixVerse',
    logoSrc: '/model-logos/pixverse.svg',
    logoAlt: 'PixVerse logo',
    models: AI_VIDEO_GENERATOR_MODEL_OPTIONS.filter((model) => model.id.startsWith('pixverse-')),
  },
  {
    id: 'happyhorse',
    name: 'HappyHorse',
    logoSrc: '/model-logos/happyhorse.svg',
    logoAlt: 'HappyHorse logo',
    models: AI_VIDEO_GENERATOR_MODEL_OPTIONS.filter((model) => model.id.startsWith('happyhorse')),
  },
]

export function getAiVideoGeneratorModelGroupsForMode(
  mode: AiVideoGeneratorModeId,
): AiVideoGeneratorModelGroup[] {
  return AI_VIDEO_GENERATOR_MODEL_GROUPS
    .map((group) => ({
      ...group,
      models: group.models
        .filter((model) => model.supportedModes.includes(mode))
        .sort((left, right) => right.qualityRating - left.qualityRating),
    }))
    .filter((group) => group.models.length > 0)
}

export function getAiVideoGeneratorFallbackModel(
  mode: AiVideoGeneratorModeId,
): AiVideoGeneratorModelConfig | undefined {
  return getAiVideoGeneratorModelGroupsForMode(mode)[0]?.models[0]
}

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
