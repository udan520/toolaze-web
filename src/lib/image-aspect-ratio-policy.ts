export type ImageGenerationMode = 'image-to-image' | 'text-to-image'

export interface AspectRatioOption {
  value: string
  label: string
}

export const IMAGE_ASPECT_RATIO_PRIORITY = [
  'auto',
  '16:9',
  '9:16',
  '1:1',
  '4:5',
  '3:2',
  '2:3',
] as const

export function getDefaultImageAspectRatio(
  aspectRatios: readonly AspectRatioOption[],
  mode: ImageGenerationMode,
): string {
  const values = new Set(aspectRatios.map(({ value }) => value))
  const preferred = mode === 'image-to-image' ? ['auto', '16:9'] : ['16:9']

  return preferred.find((value) => values.has(value))
    || aspectRatios[0]?.value
    || 'auto'
}

export function resolveSupportedImageAspectRatio(
  aspectRatios: readonly AspectRatioOption[],
  mode: ImageGenerationMode,
  rememberedValue?: string,
): string {
  if (rememberedValue && aspectRatios.some(({ value }) => value === rememberedValue)) {
    return rememberedValue
  }

  return getDefaultImageAspectRatio(aspectRatios, mode)
}

export function orderImageAspectRatios<T extends AspectRatioOption>(
  aspectRatios: readonly T[],
): T[] {
  const remaining = new Map(aspectRatios.map((option) => [option.value, option]))
  const prioritized = IMAGE_ASPECT_RATIO_PRIORITY.flatMap((value) => {
    const option = remaining.get(value)
    if (!option) return []
    remaining.delete(value)
    return [option]
  })

  return [...prioritized, ...remaining.values()]
}
