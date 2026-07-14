import type { PromptInsertMode } from './prompt-insert-mode'

export interface PromptExampleUseItem {
  title: string
  prompt: string
  image?: string
  group?: string
}

export function buildPromptExampleUseDetail(
  item: PromptExampleUseItem,
  targetMode?: PromptInsertMode,
) {
  return {
    prompt: item.prompt,
    demoImageUrl: item.image,
    demoImageTitle: item.title,
    mode: targetMode,
    presetLabel: item.title,
    presetGroup: item.group,
  }
}
