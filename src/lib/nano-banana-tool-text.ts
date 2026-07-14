type NanoBananaToolText = Record<string, string>

export function getNanoBananaToolText<T extends NanoBananaToolText>(
  translatedText: Partial<T> | null | undefined,
  defaultText: T,
): T {
  return {
    ...defaultText,
    ...(translatedText || {}),
  }
}
