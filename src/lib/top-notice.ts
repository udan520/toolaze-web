export type ToolazeTopNoticeType = 'success' | 'error' | 'warning'

export type ToolazeTopNotice = {
  type: ToolazeTopNoticeType
  title: string
  message: string
  celebration?: boolean
}

export function dispatchToolazeTopNotice(notice: ToolazeTopNotice) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent('toolaze:top-notice', {
    detail: notice,
  }))
}
