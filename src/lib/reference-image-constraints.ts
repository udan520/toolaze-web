export type ReferenceImageConstraintError = 'dimension' | 'aspectRatio'

export interface ReferenceImageDimensions {
  width: number
  height: number
}

export interface ReferenceImageConstraints {
  minDimensionPx?: number
  aspectRatioMin?: number
  aspectRatioMax?: number
}

export function getReferenceImageConstraintError(
  dimensions: ReferenceImageDimensions,
  constraints: ReferenceImageConstraints,
): ReferenceImageConstraintError | null {
  const width = Number(dimensions.width)
  const height = Number(dimensions.height)
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return 'dimension'
  }

  const minDimensionPx = Number(constraints.minDimensionPx)
  if (Number.isFinite(minDimensionPx) && minDimensionPx > 0) {
    if (width <= minDimensionPx || height <= minDimensionPx) return 'dimension'
  }

  const aspectRatio = width / height
  const minRatio = Number(constraints.aspectRatioMin)
  const maxRatio = Number(constraints.aspectRatioMax)
  if (Number.isFinite(minRatio) && minRatio > 0 && aspectRatio < minRatio) {
    return 'aspectRatio'
  }
  if (Number.isFinite(maxRatio) && maxRatio > 0 && aspectRatio > maxRatio) {
    return 'aspectRatio'
  }

  return null
}
