import type { PromptInsertMode } from './prompt-insert-mode'

export interface PromptExampleUseItem {
  title: string
  prompt: string
  referenceImage?: string
  image?: string
  poster?: string
  group?: string
}

export function buildPromptExampleUseDetail(
  item: PromptExampleUseItem,
  targetMode?: PromptInsertMode,
) {
  const referenceImageUrl = item.referenceImage
  const demoImageUrl = item.referenceImage || item.image || item.poster
  const referenceImageName = referenceImageUrl?.split('/').pop()?.split('?')[0] || `${item.title}.webp`

  return {
    prompt: item.prompt,
    ...(referenceImageUrl ? {
      imageUrl: referenceImageUrl,
      imageName: referenceImageName,
    } : {}),
    demoImageUrl,
    demoImageTitle: item.title,
    mode: targetMode,
    presetLabel: item.title,
    presetGroup: item.group,
  }
}
