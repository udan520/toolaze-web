export type ImageGenerationModelId =
  | 'gpt-image-2'
  | 'nano-banana-2'
  | 'nano-banana-pro'
  | 'seedream-4.5'
  | 'seedream-4-5'
  | 'seedream-5-0-lite'
  | 'seedream-5-0-pro'
  | 'wan-2-7-image'
  | 'grok-1-5-image'
  | 'grok-video-1-5'

export type VideoGenerationModelId = string

const BASE_CREDITS: Record<ImageGenerationModelId, number> = {
  'gpt-image-2': 10,
  'nano-banana-2': 10,
  'seedream-4.5': 10,
  'seedream-4-5': 10,
  'seedream-5-0-lite': 10,
  'seedream-5-0-pro': 10,
  'wan-2-7-image': 10,
  'grok-1-5-image': 10,
  'grok-video-1-5': 80,
  'nano-banana-pro': 20,
}

const RESOLUTION_MULTIPLIER: Record<string, number> = {
  '2K': 1.5,
  '4K': 2,
}

export const VIDEO_GENERATION_CREDIT_RATES: Record<VideoGenerationModelId, {
  source: string
  ratesByResolution: Record<string, number>
  nativeAudioRatesByResolution?: Record<string, number>
}> = {
  'grok-1-5-video': {
    source: 'Kie pricing: 480p $0.008/output second, 720p $0.015/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: {
      '480p': 3,
      '720p': 5,
    },
  },
  'seedance-2': {
    source: 'Kie Seedance 2 pricing, no-video column: 480p $0.095/output second, 720p $0.205/output second, 1080p $0.51/output second, 4K $1.04/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: {
      '480p': 30,
      '720p': 60,
      '1080p': 150,
      '4K': 310,
    },
  },
  'seedance-2-mini': {
    source: 'Kie pricing: 480p $0.0475/output second, 720p $0.1025/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: {
      '480p': 15,
      '720p': 30,
    },
  },
  'kling-3': {
    source: 'Kling official pricing: no-native-audio 720p 6 credits/s, 1080p 8 credits/s, 4K 30 credits/s; native-audio 720p 9 credits/s, 1080p 12 credits/s; Toolaze target: $0.01/credit with cleaned per-second rates',
    ratesByResolution: {
      '720p': 20,
      '1080p': 25,
      '4K': 90,
    },
    nativeAudioRatesByResolution: {
      '720p': 30,
      '1080p': 40,
    },
  },
}

const VIDEO_RESOLUTION_CREDITS: Record<string, number> = {
  '480P': 80,
  '720P': 140,
  '1080P': 250,
}

const DEFAULT_VIDEO_DURATION_SECONDS = 8
const MIN_VIDEO_DURATION_SECONDS = 1
const MAX_VIDEO_DURATION_SECONDS = 15

function normalizeVideoDurationSeconds(durationSeconds?: number | string | null): number {
  const value = Math.round(Number(durationSeconds ?? DEFAULT_VIDEO_DURATION_SECONDS))
  if (!Number.isFinite(value)) return DEFAULT_VIDEO_DURATION_SECONDS
  return Math.max(MIN_VIDEO_DURATION_SECONDS, Math.min(MAX_VIDEO_DURATION_SECONDS, value))
}

export function calculateImageGenerationCredits(
  modelId: ImageGenerationModelId,
  resolution: string,
  durationSeconds?: number | string | null
): number {
  const baseCredits = BASE_CREDITS[modelId]
  if (modelId === 'seedream-5-0-pro') {
    return resolution.toUpperCase() === '2K' ? 20 : 10
  }
  if (modelId === 'grok-video-1-5') {
    const baseVideoCredits = VIDEO_RESOLUTION_CREDITS[resolution.toUpperCase()] ?? VIDEO_RESOLUTION_CREDITS['480P']
    const normalizedDuration = normalizeVideoDurationSeconds(durationSeconds)
    return Math.ceil(baseVideoCredits * normalizedDuration / DEFAULT_VIDEO_DURATION_SECONDS)
  }
  const multiplier = RESOLUTION_MULTIPLIER[resolution.toUpperCase()] ?? 1
  return Math.ceil(baseCredits * multiplier)
}

export function calculateVideoGenerationCredits(
  modelId: VideoGenerationModelId,
  resolution: string,
  duration: number,
  options: { nativeAudio?: boolean } = {}
): number | null {
  const rateConfig = VIDEO_GENERATION_CREDIT_RATES[modelId]
  const ratesByResolution = options.nativeAudio
    ? rateConfig?.nativeAudioRatesByResolution
    : rateConfig?.ratesByResolution
  const creditsPerSecond = ratesByResolution?.[resolution]
  if (!creditsPerSecond || !Number.isFinite(duration) || duration <= 0) return null
  return Math.ceil(creditsPerSecond * duration)
}
