'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DeleteIcon from './icons/DeleteIcon'
import {
  buildHistoryRecreateHref,
  buildHistoryRepromptPayload,
  getOriginalHistoryInputImageUrls,
} from '@/lib/history-reprompt'
import { GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE } from '@/lib/generation-history-delete-confirm'
import {
  getHistoryFullScreenPreviewUrl,
  getHistoryLibraryThumbnailUrl,
  getHistoryPreviewMediaUrl,
  getHistoryReferenceThumbnailUrl,
} from '@/lib/history-preview-media'
import { downloadImageInCurrentPage } from '@/lib/browser-image-download'
import { formatLocalTimestampToSeconds } from '@/lib/credit-history-time'
import { getWrappedHairToolHistoryDisplay } from '@/lib/generation-history-display'
import { dispatchToolazeTopNotice } from '@/lib/top-notice'
import {
  trackGenerationHistoryDeleteClick,
  trackGenerationHistoryDownloadClick,
  trackGenerationHistoryRecreateClick,
} from '@/lib/generation-history-analytics'

type GenerationHistoryItem = {
  id: string
  mediaType: 'image' | 'video'
  model: string
  prompt: string
  outputUrl: string
  status: 'pending' | 'succeeded' | 'failed'
  taskId?: string | null
  failureReason?: string | null
  updatedAt?: string
  nativeAudio?: boolean
  statusRequest?: {
    endpoint: string
    taskId: string
    taskProvider?: string | null
    creditHold: unknown
  } | null
  inputUrls: string[]
  aspectRatio: string | null
  resolution: string | null
  outputFormat: string | null
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
  recreateInputUrls?: string[]
  createdAt: string
}

type HistoryFilter = 'all' | 'image' | 'video'
type HistoryDeleteDialog =
  | { mode: 'single'; item: GenerationHistoryItem }
  | { mode: 'bulk' }

const PENDING_REPROMPT_STORAGE_KEY = 'toolaze:pending-reprompt'
const PENDING_HISTORY_POLL_INTERVAL_MS = 5000

const defaultHistoryPageCopy = {
  title: 'History',
  description: 'Review your generated images, open previews, download outputs, or create similar results.',
  loading: 'Loading history...',
  signInRequired: 'Please sign in with Google to view your history.',
  loadError: 'Could not load generation history.',
  emptyTitle: 'No Generation History Yet.',
  emptyDescription: 'Generated images and videos will appear here after they complete.',
  filterAll: 'All',
  filterImages: 'Images',
  filterVideos: 'Videos',
  previewLabel: 'Generation Preview',
  previewImageLabel: 'Preview Generated Image',
  previewReferenceMedia: 'Preview Reference Media',
  closePreview: 'Close Preview',
  referenceMedia: 'Reference Media',
  prompt: 'Prompt',
  copyPrompt: 'Copy Prompt',
  promptCopied: 'Prompt Copied',
  promptCopyFailed: 'Copy Failed',
  recreate: 'Recreate',
  download: 'Download',
  delete: 'Delete',
  deleting: 'Deleting',
  selected: 'Selected',
  batchActions: 'Batch Actions',
  done: 'Done',
  selectItem: 'Select History Item',
  selectAll: 'Select All',
  clearSelection: 'Clear',
  downloadSelected: 'Download Selected',
  deleteSelected: 'Delete Selected',
  downloading: 'Downloading',
  deleteConfirmTitle: 'Delete This Result?',
  deleteSelectedConfirmTitle: 'Delete Selected Results?',
  cancel: 'Cancel',
  deleteHistoryConfirm: GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE,
  deleteError: 'Could not delete history item.',
  deleteSelectedConfirm: 'Delete selected history items? Once deleted, they cannot be recovered.',
  deleteSelectedError: 'Could not delete selected history items.',
  modeVideo: 'Video',
  modeTextToImage: 'Text to Image',
  modeImageToImage: 'Image to Image',
  importToMediaLibrary: 'Import',
  importingToMediaLibrary: 'Importing',
  importedToMediaLibrary: 'Imported',
  importMediaLibraryFailed: 'Import Failed',
  statusGenerating: 'Generating',
  statusFailed: 'Failed',
  failureFallback: 'Generation failed. Recreate the request to try again.',
}

function getHistoryPageCopy(initialTranslations?: any) {
  return {
    ...defaultHistoryPageCopy,
    ...(initialTranslations?.historyPage || {}),
  }
}

function getGenerationModeLabel(item: GenerationHistoryItem, copy: typeof defaultHistoryPageCopy) {
  if (item.mediaType === 'video') return copy.modeVideo
  return item.inputUrls.length > 0 ? copy.modeImageToImage : copy.modeTextToImage
}

function isVideoHistoryUrl(url: string) {
  return /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(String(url || '').trim())
}

function isReferenceVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v|mkv)(?:[?#].*)?$/i.test(String(url || '').trim())
}

function isReferenceAudioUrl(url: string) {
  return /\.(mp3|wav)(?:[?#].*)?$/i.test(String(url || '').trim())
}

function normalizeGenerationHistoryItem(item: GenerationHistoryItem): GenerationHistoryItem {
  const mediaType: GenerationHistoryItem['mediaType'] =
    item.mediaType === 'video' || isVideoHistoryUrl(item.outputUrl) ? 'video' : 'image'
  const status: GenerationHistoryItem['status'] =
    item.status === 'pending' || item.status === 'failed' ? item.status : 'succeeded'
  const rawInputUrls = Array.isArray(item.inputUrls) ? item.inputUrls : []
  const normalizedItem = {
    ...item,
    status,
    mediaType,
    inputUrls: rawInputUrls,
  }
  const displayInputUrls = rawInputUrls.length > 0
    ? rawInputUrls
    : getOriginalHistoryInputImageUrls(normalizedItem)

  return {
    ...normalizedItem,
    recreateInputUrls: rawInputUrls,
    inputUrls: displayInputUrls,
  }
}

interface HistoryPageClientProps {
  initialTranslations?: any
  locale?: string
}

export default function HistoryPageClient({ initialTranslations, locale = 'en' }: HistoryPageClientProps = {}) {
  const copy = getHistoryPageCopy(initialTranslations)
  const [items, setItems] = useState<GenerationHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewItem, setPreviewItem] = useState<GenerationHistoryItem | null>(null)
  const [fullScreenPreviewUrl, setFullScreenPreviewUrl] = useState('')
  const [deletingId, setDeletingId] = useState('')
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [bulkDownloading, setBulkDownloading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectionMode, setSelectionMode] = useState(false)
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>('all')
  const [deleteDialog, setDeleteDialog] = useState<HistoryDeleteDialog | null>(null)
  const [isMediaLibraryAdmin, setIsMediaLibraryAdmin] = useState(false)
  const [importingMediaLibraryIds, setImportingMediaLibraryIds] = useState<Set<string>>(new Set())
  const pendingPollInFlightRef = useRef(false)

  const sortedItems = useMemo(
    () => [...items].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)),
    [items],
  )
  const filteredItems = useMemo(
    () => sortedItems.filter((item) => activeFilter === 'all' || item.mediaType === activeFilter),
    [activeFilter, sortedItems],
  )
  const imageCount = items.filter((item) => item.mediaType === 'image').length
  const videoCount = items.filter((item) => item.mediaType === 'video').length
  const selectedItems = useMemo(
    () => sortedItems.filter((item) => item.status === 'succeeded' && selectedIds.has(item.id)),
    [selectedIds, sortedItems],
  )
  const selectableFilteredItems = useMemo(
    () => filteredItems.filter((item) => item.status === 'succeeded'),
    [filteredItems],
  )
  const allFilteredSelected = selectableFilteredItems.length > 0
    && selectableFilteredItems.every((item) => selectedIds.has(item.id))
  const selectionDisabled = bulkDeleting || bulkDownloading

  const closePreview = useCallback(() => {
    setPreviewItem(null)
    setFullScreenPreviewUrl('')
  }, [])

  const openPreview = useCallback((item: GenerationHistoryItem) => {
    if (item.status !== 'succeeded') return
    setPreviewItem(item)
    setFullScreenPreviewUrl('')
  }, [])

  useEffect(() => {
    if (!previewItem) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (fullScreenPreviewUrl) {
        setFullScreenPreviewUrl('')
        return
      }
      closePreview()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closePreview, fullScreenPreviewUrl, previewItem])

  const loadHistory = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/history?limit=200', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
        throw new Error(copy.signInRequired)
      }
      if (!response.ok) throw new Error(copy.loadError)
      const data = await response.json().catch(() => ({ items: [] }))
      setItems(Array.isArray(data.items) ? data.items.map(normalizeGenerationHistoryItem) : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.loadError)
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [copy.loadError, copy.signInRequired])

  useEffect(() => {
    void loadHistory(true)
  }, [loadHistory])

  useEffect(() => {
    const pendingItems = items.filter((item) => item.status === 'pending' && item.statusRequest)
    if (pendingItems.length === 0) return

    const refreshPendingHistory = async () => {
      if (pendingPollInFlightRef.current || document.visibilityState === 'hidden') return
      pendingPollInFlightRef.current = true
      setError('')
      try {
        for (const item of pendingItems) {
          const statusRequest = item.statusRequest
          if (!statusRequest) continue
          const response = await fetch(statusRequest.endpoint, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              taskId: statusRequest.taskId,
              taskProvider: statusRequest.taskProvider || null,
              creditHold: statusRequest.creditHold,
            }),
          })
          if (!response.ok) continue
          const result = await response.json().catch(() => ({}))
          if (result.status !== 'SUCCEEDED') continue
          const providerOutputUrl = String(result.videoUrl || result.imageUrl || '').trim()
          if (!providerOutputUrl) continue

          let outputUrl = providerOutputUrl
          const persistResponse = await fetch('/api/save-image-to-r2', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mediaUrl: providerOutputUrl, mediaType: item.mediaType }),
          }).catch(() => null)
          if (persistResponse?.ok) {
            const persisted = await persistResponse.json().catch(() => ({}))
            outputUrl = String(persisted.url || providerOutputUrl)
          }

          await fetch('/api/history', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...item,
              inputUrls: item.recreateInputUrls || item.inputUrls,
              outputUrl,
              taskId: statusRequest.taskId,
            }),
          })
        }
      } finally {
        pendingPollInFlightRef.current = false
        await loadHistory(false)
      }
    }

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refreshPendingHistory()
    }
    const intervalId = window.setInterval(() => void refreshPendingHistory(), PENDING_HISTORY_POLL_INTERVAL_MS)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    window.addEventListener('focus', refreshWhenVisible)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      window.removeEventListener('focus', refreshWhenVisible)
    }
  }, [items, loadHistory])

  useEffect(() => {
    let cancelled = false
    const loadAdminState = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (!response.ok) return
        const data = await response.json().catch(() => ({ user: null }))
        if (!cancelled) setIsMediaLibraryAdmin(Boolean(data.user?.isAdmin))
      } catch {
        if (!cancelled) setIsMediaLibraryAdmin(false)
      }
    }

    void loadAdminState()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const itemIds = new Set(items.map((item) => item.id))
    setSelectedIds((currentIds) => {
      const nextIds = new Set([...currentIds].filter((id) => itemIds.has(id)))
      return nextIds.size === currentIds.size ? currentIds : nextIds
    })
  }, [items])

  const setHistoryFilter = (filter: HistoryFilter) => {
    setActiveFilter(filter)
    setSelectedIds(new Set())
    setSelectionMode(false)
  }

  const toggleHistorySelection = (itemId: string) => {
    if (!selectionMode || selectionDisabled) return
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds)
      if (nextIds.has(itemId)) {
        nextIds.delete(itemId)
      } else {
        nextIds.add(itemId)
      }
      return nextIds
    })
  }

  const enterSelectionMode = () => {
    if (selectionDisabled) return
    setSelectionMode(true)
  }

  const exitSelectionMode = () => {
    if (selectionDisabled) return
    setSelectedIds(new Set())
    setSelectionMode(false)
  }

  const selectAllFilteredItems = () => {
    if (selectionDisabled || selectableFilteredItems.length === 0) return
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds)
      for (const item of selectableFilteredItems) nextIds.add(item.id)
      return nextIds
    })
  }

  const clearSelection = () => {
    if (selectionDisabled) return
    setSelectedIds(new Set())
  }

  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    }, 100)
  }

  const triggerUrlDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownload = async (item: GenerationHistoryItem) => {
    if (item.status !== 'succeeded' || !item.outputUrl) return
    trackGenerationHistoryDownloadClick(item, { surface: 'history_page' })

    await downloadImageInCurrentPage({
      imageUrl: item.outputUrl,
      filename: `toolaze-${item.id}.${item.mediaType === 'video' ? 'mp4' : 'png'}`,
      triggerBlobDownload,
      triggerUrlDownload,
    })
  }

  const handleImportToMediaLibrary = async (item: GenerationHistoryItem) => {
    if (item.status !== 'succeeded' || importingMediaLibraryIds.has(item.id)) return

    setImportingMediaLibraryIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.add(item.id)
      return nextIds
    })
    try {
      const response = await fetch('/api/media-library/import-history', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ historyId: item.id }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || copy.importMediaLibraryFailed)
      }
      const importedCount = Number(payload.importedCount || 0)
      const skippedCount = Number(payload.skippedCount || 0)
      dispatchToolazeTopNotice({
        type: 'success',
        title: copy.importedToMediaLibrary,
        message: `Added ${importedCount.toLocaleString()} asset${importedCount === 1 ? '' : 's'}; skipped ${skippedCount.toLocaleString()}.`,
      })
    } catch (err) {
      dispatchToolazeTopNotice({
        type: 'error',
        title: copy.importMediaLibraryFailed,
        message: err instanceof Error ? err.message : '',
      })
    } finally {
      setImportingMediaLibraryIds((currentIds) => {
        const nextIds = new Set(currentIds)
        nextIds.delete(item.id)
        return nextIds
      })
    }
  }

  const deleteHistoryItem = async (item: GenerationHistoryItem) => {
    trackGenerationHistoryDeleteClick(item, { surface: 'history_page' })

    const response = await fetch(`/api/history?id=${encodeURIComponent(item.id)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.error || copy.deleteError)
    }

    setItems((currentItems) => currentItems.filter((currentItem) => currentItem.id !== item.id))
    setSelectedIds((currentIds) => {
      if (!currentIds.has(item.id)) return currentIds
      const nextIds = new Set(currentIds)
      nextIds.delete(item.id)
      return nextIds
    })
    if (previewItem?.id === item.id) {
      closePreview()
    }
  }

  const handleDelete = async (item: GenerationHistoryItem) => {
    if (deletingId || bulkDeleting) return
    setDeleteDialog({ mode: 'single', item })
  }

  const confirmDeleteSingle = async (item: GenerationHistoryItem) => {
    if (deletingId || bulkDeleting) return

    setDeletingId(item.id)
    setError('')
    try {
      await deleteHistoryItem(item)
      setDeleteDialog(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.deleteError)
    } finally {
      setDeletingId('')
    }
  }

  const handleBulkDownload = async () => {
    if (bulkDownloading || selectedItems.length === 0) return
    setBulkDownloading(true)
    try {
      for (const item of selectedItems) {
        await handleDownload(item)
      }
    } finally {
      setBulkDownloading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (bulkDeleting || selectedItems.length === 0) return
    setDeleteDialog({ mode: 'bulk' })
  }

  const confirmDeleteSelected = async () => {
    if (bulkDeleting || selectedItems.length === 0) return

    setBulkDeleting(true)
    setError('')
    let failed = false
    try {
      for (const item of selectedItems) {
        try {
          await deleteHistoryItem(item)
        } catch {
          failed = true
        }
      }
      if (failed) {
        setError(copy.deleteSelectedError)
      } else {
        setSelectionMode(false)
        setDeleteDialog(null)
      }
    } finally {
      setBulkDeleting(false)
    }
  }

  const confirmDeleteDialog = async () => {
    if (!deleteDialog) return
    if (deleteDialog.mode === 'single') {
      await confirmDeleteSingle(deleteDialog.item)
      return
    }
    await confirmDeleteSelected()
  }

  const handleReprompt = (item: GenerationHistoryItem) => {
    if (item.status === 'pending') return
    trackGenerationHistoryRecreateClick(item, { surface: 'history_page' })

    window.sessionStorage.setItem(PENDING_REPROMPT_STORAGE_KEY, JSON.stringify(buildHistoryRepromptPayload({ ...item, inputUrls: item.recreateInputUrls || item.inputUrls })))
    window.location.href = buildHistoryRecreateHref(item, locale)
  }

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      dispatchToolazeTopNotice({
        type: 'success',
        title: copy.promptCopied,
        message: '',
      })
    } catch {
      dispatchToolazeTopNotice({
        type: 'error',
        title: copy.promptCopyFailed,
        message: '',
      })
    }
  }

  const activePreviewMediaUrl = previewItem
    ? getHistoryPreviewMediaUrl({
        outputUrl: previewItem.outputUrl,
      })
    : ''
  const previewCreatedAt = previewItem ? formatLocalTimestampToSeconds(previewItem.createdAt) : ''
  const previewHistoryDisplay = previewItem
    ? getWrappedHairToolHistoryDisplay(previewItem)
    : null
  const deleteDialogTitle = deleteDialog?.mode === 'bulk'
    ? copy.deleteSelectedConfirmTitle
    : copy.deleteConfirmTitle
  const deleteDialogMessage = deleteDialog?.mode === 'bulk'
    ? copy.deleteSelectedConfirm
    : copy.deleteHistoryConfirm
  const deleteDialogActionLabel = deleteDialog?.mode === 'bulk' ? copy.deleteSelected : copy.delete
  const deleteDialogBusy = deleteDialog?.mode === 'bulk'
    ? bulkDeleting
    : deleteDialog?.mode === 'single' && deletingId === deleteDialog.item.id

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">{copy.title}</h1>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">
            {copy.description}
          </p>
        </div>
      </div>

      {!loading && !error && items.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex w-fit rounded-xl bg-slate-100 p-1" role="tablist" aria-label={copy.title}>
            {([
              { id: 'all', label: copy.filterAll, count: items.length },
              { id: 'image', label: copy.filterImages, count: imageCount },
              { id: 'video', label: copy.filterVideos, count: videoCount },
            ] as const).map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                data-history-filter={filter.id}
                aria-selected={activeFilter === filter.id}
                onClick={() => setHistoryFilter(filter.id)}
                className={`flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{filter.label}</span>
                <span className="text-xs tabular-nums text-slate-400">{filter.count}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            data-history-enter-bulk-select
            onClick={selectionMode ? exitSelectionMode : enterSelectionMode}
            disabled={selectionDisabled}
            className="inline-flex min-h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-extrabold text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectionMode ? copy.done : copy.batchActions}
          </button>
        </div>
      )}

      {!loading && !error && items.length > 0 && selectionMode && (
        <div
          data-history-bulk-actions
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-history-select-all
              onClick={selectAllFilteredItems}
              disabled={selectionDisabled || filteredItems.length === 0 || allFilteredSelected}
              className="inline-flex min-h-9 items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-extrabold text-slate-700 hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copy.selectAll}
            </button>
            {selectedItems.length > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                disabled={selectionDisabled}
                className="inline-flex min-h-9 items-center justify-center rounded-xl px-3 py-2 text-center text-sm font-extrabold text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.clearSelection}
              </button>
            )}
            <span className="text-sm font-bold text-slate-500">
              {copy.selected}: <span className="tabular-nums text-slate-900">{selectedItems.length}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleBulkDownload()}
              disabled={selectedItems.length === 0 || selectionDisabled}
              className="inline-flex min-h-9 items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-extrabold text-slate-700 hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkDownloading ? copy.downloading : copy.downloadSelected}
            </button>
            <button
              type="button"
              onClick={() => void handleBulkDelete()}
              disabled={selectedItems.length === 0 || selectionDisabled}
              className="inline-flex min-h-9 items-center justify-center rounded-xl border border-rose-200 px-3 py-2 text-center text-sm font-extrabold text-rose-600 hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bulkDeleting ? copy.deleting : copy.deleteSelected}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-500">
          {copy.loading}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && filteredItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-base font-extrabold text-slate-900">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm text-slate-500">{copy.emptyDescription}</p>
        </div>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {filteredItems.map((item) => (
            <article key={item.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
              {isMediaLibraryAdmin && item.status === 'succeeded' && !selectionMode && (
                <button
                  type="button"
                  data-history-import-media-library
                  onClick={() => void handleImportToMediaLibrary(item)}
                  disabled={importingMediaLibraryIds.has(item.id)}
                  className="absolute left-2 top-2 z-10 inline-flex min-h-7 items-center justify-center rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-indigo-700 shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {importingMediaLibraryIds.has(item.id) ? copy.importingToMediaLibrary : copy.importToMediaLibrary}
                </button>
              )}
              {selectionMode && item.status === 'succeeded' && (
                <label className="absolute left-2 top-2 z-10 inline-flex cursor-pointer items-center justify-center">
                  <input
                    data-history-card-select
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleHistorySelection(item.id)}
                    disabled={selectionDisabled}
                    className="h-5 w-5 cursor-pointer rounded-md border-2 border-white/90 bg-white/10 text-indigo-600 accent-indigo-600 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1 focus:ring-offset-slate-950/20 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={copy.selectItem}
                    onClick={(event) => event.stopPropagation()}
                  />
                </label>
              )}
              {item.status === 'succeeded' ? (
                <button
                  data-history-card-preview
                  type="button"
                  onClick={() => openPreview(item)}
                  className="group relative block w-full overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={item.mediaType === 'video' ? copy.previewLabel : copy.previewImageLabel}
                >
                {item.mediaType === 'video' ? (
                  <>
                    <video
                      src={item.outputUrl}
                      className="aspect-[3/4] h-auto w-full object-cover object-center transition-opacity group-hover:opacity-90"
                      preload="metadata"
                      muted
                      playsInline
                    />
                    <span className="absolute right-2 top-2 rounded-lg bg-slate-950/75 px-2 py-1 text-[11px] font-extrabold text-white">
                      {copy.modeVideo}
                    </span>
                  </>
                ) : (
                  <img
                    src={getHistoryLibraryThumbnailUrl(item.outputUrl)}
                    alt=""
                    className="aspect-[3/4] h-auto w-full object-cover object-center transition-opacity group-hover:opacity-90"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                {item.inputUrls[0] && (
                  <span
                    data-history-card-reference
                    className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-xl bg-white/95 p-1.5 text-xs font-extrabold text-slate-700 shadow-sm ring-1 ring-slate-200"
                  >
                    {isReferenceVideoUrl(item.inputUrls[0]) ? (
                      <video
                        data-history-card-reference-video
                        src={item.inputUrls[0]}
                        className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                        preload="metadata"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={getHistoryReferenceThumbnailUrl(item.inputUrls[0])}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span className="min-w-0 truncate">{copy.referenceMedia}</span>
                  </span>
                )}
                </button>
              ) : item.status === 'pending' ? (
                <div
                  data-history-status="pending"
                  className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 bg-slate-100 px-4 text-center"
                >
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900">{copy.statusGenerating}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-500">{item.toolLabel || item.model}</p>
                  </div>
                  {item.inputUrls[0] && !isReferenceVideoUrl(item.inputUrls[0]) && (
                    <img
                      src={getHistoryReferenceThumbnailUrl(item.inputUrls[0])}
                      alt=""
                      className="h-14 w-14 rounded-lg object-contain ring-1 ring-slate-200"
                    />
                  )}
                </div>
              ) : (
                <div
                  data-history-status="failed"
                  className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 bg-rose-50 px-4 text-center"
                >
                  <div>
                    <p className="text-sm font-extrabold text-rose-700">{copy.statusFailed}</p>
                    <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-rose-600">
                      {item.failureReason || copy.failureFallback}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReprompt(item)}
                      className="inline-flex min-h-8 items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-indigo-700"
                    >
                      {copy.recreate}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-100"
                      aria-label={copy.delete}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {previewItem && (
        <div
          data-history-preview-modal
          className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-slate-950/55 px-4 py-4 backdrop-blur-sm md:items-center md:py-6"
          role="dialog"
          aria-modal="true"
          aria-label={copy.previewLabel}
          onClick={closePreview}
        >
          <div
            className="relative grid w-full max-w-6xl grid-cols-1 overflow-visible rounded-[28px] bg-slate-50 shadow-2xl md:max-h-[92vh] md:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] md:overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePreview}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label={copy.closePreview}
            >
              <span className="text-2xl leading-none">×</span>
            </button>

            <div className="min-h-0 bg-slate-100 p-3 md:p-5">
              <div className="flex h-full min-h-[240px] items-center justify-center overflow-hidden rounded-2xl bg-slate-200 md:min-h-[320px]">
                {previewItem.mediaType === 'video' && activePreviewMediaUrl === previewItem.outputUrl ? (
                  <video
                    src={activePreviewMediaUrl}
                    className="max-h-[52vh] w-full object-contain md:max-h-[82vh]"
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={activePreviewMediaUrl}
                    alt=""
                    className="max-h-[52vh] w-full object-contain md:max-h-[82vh]"
                  />
                )}
              </div>
            </div>

            <div
              data-history-preview-details
              className="min-h-0 px-5 py-5 md:overflow-y-auto md:px-7 md:py-8"
            >
              <div className="mb-6 flex flex-wrap gap-2 pr-10">
                {previewHistoryDisplay?.showToolLabel && previewHistoryDisplay.toolLabel && (
                  <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700">
                    {previewHistoryDisplay.toolLabel}
                  </span>
                )}
                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700">
                  {getGenerationModeLabel(previewItem, copy)}
                </span>
                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700">
                  {previewHistoryDisplay?.showToolLabel
                    ? previewHistoryDisplay.modelLabel
                    : previewItem.model}
                </span>
                {previewItem.resolution && (
                  <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700">
                    {previewItem.resolution}
                  </span>
                )}
                {previewCreatedAt && (
                  <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700">
                    {previewCreatedAt}
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {previewItem.inputUrls.length > 0 && (
                  <section>
                    <h2 className="mb-3 text-sm font-extrabold text-slate-900">{copy.referenceMedia}</h2>
                    <div className="flex flex-wrap gap-3">
                      {previewItem.inputUrls.map((url, index) => {
                        if (isReferenceAudioUrl(url)) {
                          return (
                            <audio
                              key={`${url}-${index}`}
                              data-history-reference-audio
                              src={url}
                              controls
                              preload="metadata"
                              className="h-10 w-full max-w-[16rem]"
                            />
                          )
                        }
                        return (
                          <button
                            key={`${url}-${index}`}
                            type="button"
                            onClick={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              setFullScreenPreviewUrl(getHistoryFullScreenPreviewUrl(url))
                            }}
                            className="h-20 w-20 cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-0 transition hover:border-indigo-300"
                            aria-label={`${copy.previewReferenceMedia} ${index + 1}`}
                          >
                            {isReferenceVideoUrl(url) ? (
                              <video
                                data-history-reference-video
                                src={url}
                                className="h-full w-full object-cover"
                                preload="metadata"
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={getHistoryReferenceThumbnailUrl(url)}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </section>
                )}

                <section>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-extrabold text-slate-900">{copy.prompt}</h2>
                    <button
                      type="button"
                      onClick={() => void handleCopyPrompt(previewItem.prompt)}
                      className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label={copy.copyPrompt}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                  <div
                    data-history-preview-prompt
                    className="max-h-24 overflow-y-auto overscroll-contain whitespace-pre-wrap rounded-2xl bg-indigo-50/70 px-4 py-3 text-sm leading-6 text-slate-800"
                  >
                    {previewItem.prompt}
                  </div>
                </section>
              </div>

              <div
                data-history-preview-actions
                className="sticky bottom-0 -mx-5 mt-6 grid grid-cols-[minmax(0,1fr)_44px_44px] gap-2 border-t border-slate-200 bg-slate-50/95 px-5 py-4 backdrop-blur sm:grid-cols-[1fr_auto_auto] sm:gap-3 md:static md:mx-0 md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-0"
              >
                <button
                  type="button"
                  onClick={() => handleReprompt(previewItem)}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-extrabold text-white hover:bg-indigo-700"
                >
                  {copy.recreate}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDownload(previewItem)}
                  aria-label={copy.download}
                  title={copy.download}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-0 text-center text-sm font-extrabold text-slate-700 hover:border-indigo-200 hover:text-indigo-600 sm:h-auto sm:px-5 sm:py-3"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="ml-2 hidden sm:inline">{copy.download}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(previewItem)}
                  disabled={deletingId === previewItem.id}
                  aria-label={deletingId === previewItem.id ? copy.deleting : copy.delete}
                  title={deletingId === previewItem.id ? copy.deleting : copy.delete}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-rose-200 px-0 text-center text-sm font-extrabold text-rose-600 hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-auto sm:px-5 sm:py-3"
                >
                  <DeleteIcon size={16} />
                  <span className="ml-2 hidden sm:inline">
                    {deletingId === previewItem.id ? copy.deleting : copy.delete}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteDialog && (
        <div
          data-history-delete-confirm-dialog
          className="fixed inset-0 z-[10020] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={deleteDialogTitle}
          onClick={() => {
            if (!deleteDialogBusy) setDeleteDialog(null)
          }}
        >
          <div
            className="w-full max-w-md rounded-[28px] border border-rose-100 bg-white p-5 shadow-2xl shadow-slate-950/20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <DeleteIcon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-extrabold tracking-tight text-slate-950">{deleteDialogTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{deleteDialogMessage}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                disabled={deleteDialogBusy}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-extrabold text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                onClick={() => void confirmDeleteDialog()}
                disabled={deleteDialogBusy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-center text-sm font-extrabold text-white shadow-lg shadow-rose-100 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300 disabled:shadow-none"
              >
                <DeleteIcon size={16} />
                {deleteDialogBusy ? copy.deleting : deleteDialogActionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {fullScreenPreviewUrl && (
        <div
          className="fixed inset-0 z-[10010] flex items-center justify-center bg-slate-950/95 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={copy.previewReferenceMedia}
          onClick={() => setFullScreenPreviewUrl('')}
        >
          <button
            type="button"
            onClick={() => setFullScreenPreviewUrl('')}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={copy.closePreview}
          >
            <span className="text-2xl leading-none">×</span>
          </button>
          {isReferenceAudioUrl(fullScreenPreviewUrl) ? (
            <audio
              data-history-fullscreen-reference-audio
              src={fullScreenPreviewUrl}
              className="w-full max-w-xl"
              controls
              autoPlay
              onClick={(event) => event.stopPropagation()}
            />
          ) : isReferenceVideoUrl(fullScreenPreviewUrl) ? (
            <video
              data-history-fullscreen-reference-video
              src={fullScreenPreviewUrl}
              className="max-h-[96vh] max-w-[96vw] object-contain"
              controls
              playsInline
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <img
              src={fullScreenPreviewUrl}
              alt=""
              className="max-h-[96vh] max-w-[96vw] object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          )}
        </div>
      )}
    </main>
  )
}
