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
