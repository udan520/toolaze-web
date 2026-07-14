export type ImageGenerationModelId =
  | 'gpt-image-2'
  | 'nano-banana-2'
  | 'nano-banana-pro'
  | 'seedream-4.5'
  | 'seedream-4-5'
  | 'seedream-5-0-lite'
  | 'seedream-5-0-pro'
  | 'wan-2-7-image'

const BASE_CREDITS: Record<ImageGenerationModelId, number> = {
  'gpt-image-2': 10,
  'nano-banana-2': 10,
  'seedream-4.5': 10,
  'seedream-4-5': 10,
  'seedream-5-0-lite': 10,
  'seedream-5-0-pro': 10,
  'wan-2-7-image': 10,
  'nano-banana-pro': 20,
}

const RESOLUTION_MULTIPLIER: Record<string, number> = {
  '2K': 1.5,
  '4K': 2,
}

export function calculateImageGenerationCredits(
  modelId: ImageGenerationModelId,
  resolution: string
): number {
  const baseCredits = BASE_CREDITS[modelId]
  if (modelId === 'seedream-5-0-pro') {
    return resolution.toUpperCase() === '2K' ? 20 : 10
  }
  const multiplier = RESOLUTION_MULTIPLIER[resolution.toUpperCase()] ?? 1
  return Math.ceil(baseCredits * multiplier)
}
