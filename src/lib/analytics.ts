export type ToolazeAnalyticsPayloadValue = string | number | boolean | null | undefined
export type ToolazeAnalyticsPayload = Record<string, ToolazeAnalyticsPayloadValue>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function sanitizeAnalyticsPayload(payload: ToolazeAnalyticsPayload): Record<string, string | number | boolean | null> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean | null>
}

export function trackToolazeEvent(eventName: string, payload: ToolazeAnalyticsPayload = {}) {
  if (typeof window === 'undefined') return

  const sanitizedPayload = sanitizeAnalyticsPayload(payload)

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, sanitizedPayload)
      return
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: eventName, ...sanitizedPayload })
  } catch {
    // Analytics must never block generation, checkout navigation, or rewards flows.
  }
}
