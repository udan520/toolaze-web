export const GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE =
  'Delete this image from your generation history? Once deleted, it cannot be recovered.'

export function shouldDeleteGenerationHistoryItem(
  confirmDelete: (message: string) => boolean,
  message = GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE,
): boolean {
  return confirmDelete(message)
}
