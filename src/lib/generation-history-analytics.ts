import { trackToolazeEvent } from '@/lib/analytics'

type GenerationHistoryAnalyticsSurface = 'history_page' | 'inline_generator_history'

type GenerationHistoryAnalyticsItem = {
  mediaType?: string | null
  model?: string | null
  modelId?: string | null
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
}

type GenerationHistoryAnalyticsOptions = {
  surface: GenerationHistoryAnalyticsSurface
}

function getCurrentPagePath() {
  if (typeof window === 'undefined') return undefined
  return window.location.pathname || '/'
}

function getGenerationHistoryAnalyticsPayload(
  item: GenerationHistoryAnalyticsItem,
  options: GenerationHistoryAnalyticsOptions,
) {
  const modelId = item.modelId || item.model || undefined

  return {
    surface: options.surface,
    page_path: getCurrentPagePath(),
    media_type: item.mediaType || (item.modelId ? 'image' : undefined),
    model_id: modelId,
    tool_slug: item.toolSlug || undefined,
    tool_label: item.toolLabel || undefined,
    source_path: item.sourcePath || undefined,
  }
}

export function trackGenerationHistoryRecreateClick(
  item: GenerationHistoryAnalyticsItem,
  options: GenerationHistoryAnalyticsOptions,
) {
  trackToolazeEvent('generation_history_recreate_button_click', getGenerationHistoryAnalyticsPayload(item, options))
}

export function trackGenerationHistoryDownloadClick(
  item: GenerationHistoryAnalyticsItem,
  options: GenerationHistoryAnalyticsOptions,
) {
  trackToolazeEvent('generation_history_download_button_click', getGenerationHistoryAnalyticsPayload(item, options))
}

export function trackGenerationHistoryDeleteClick(
  item: GenerationHistoryAnalyticsItem,
  options: GenerationHistoryAnalyticsOptions,
) {
  trackToolazeEvent('generation_history_delete_button_click', getGenerationHistoryAnalyticsPayload(item, options))
}
