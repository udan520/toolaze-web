type AiImageGenerationToolText = Record<string, string>

export function getAiImageGenerationToolText<T extends AiImageGenerationToolText>(
  translatedText: Partial<T> | null | undefined,
  defaultText: T,
): T {
  return {
    ...defaultText,
    ...(translatedText || {}),
  }
}
