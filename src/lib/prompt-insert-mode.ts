export type PromptInsertMode = 'image-to-image' | 'text-to-image'

export function resolvePromptInsertMode({
  requestedMode,
  hasReferenceImages,
}: {
  requestedMode?: PromptInsertMode
  hasReferenceImages: boolean
}): PromptInsertMode {
  if (hasReferenceImages) return 'image-to-image'
  return requestedMode || 'text-to-image'
}

export function resolvePromptInsertRemoteImageUrls({
  nextMode,
  currentRemoteImageUrls,
  referenceUrls,
  maxImages,
}: {
  nextMode: PromptInsertMode
  currentRemoteImageUrls: string[]
  referenceUrls: string[]
  maxImages: number
}) {
  if (referenceUrls.length > 0) return referenceUrls.slice(0, maxImages)
  if (nextMode === 'image-to-image') return currentRemoteImageUrls.slice(0, maxImages)
  return []
}
