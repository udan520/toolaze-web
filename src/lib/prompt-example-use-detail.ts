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
  const imageUrl = item.referenceImage || item.image || item.poster
  const imageName = imageUrl?.split('/').pop()?.split('?')[0] || `${item.title}.webp`

  return {
    prompt: item.prompt,
    imageUrl,
    imageName,
    demoImageUrl: item.referenceImage || item.image || item.poster,
    demoImageTitle: item.title,
    mode: targetMode,
    presetLabel: item.title,
    presetGroup: item.group,
  }
}
