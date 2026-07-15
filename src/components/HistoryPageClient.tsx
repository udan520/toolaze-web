'use client'

import { useCallback, useEffect, useState } from 'react'
import DeleteIcon from './icons/DeleteIcon'
import { buildHistoryRepromptPayload } from '@/lib/history-reprompt'
import {
  GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE,
  shouldDeleteGenerationHistoryItem,
} from '@/lib/generation-history-delete-confirm'
import {
  getHistoryFullScreenPreviewUrl,
  getHistoryLibraryThumbnailUrl,
  getHistoryPreviewMediaUrl,
  getHistoryReferenceThumbnailUrl,
} from '@/lib/history-preview-media'
import { downloadImageInCurrentPage } from '@/lib/browser-image-download'
import { formatLocalTimestampToSeconds } from '@/lib/credit-history-time'

type GenerationHistoryItem = {
  id: string
  mediaType: 'image' | 'video'
  model: string
  prompt: string
  outputUrl: string
  inputUrls: string[]
  aspectRatio: string | null
  resolution: string | null
  outputFormat: string | null
  createdAt: string
}

const PENDING_REPROMPT_STORAGE_KEY = 'toolaze:pending-reprompt'

const defaultHistoryPageCopy = {
  title: 'History',
  description: 'Review your generated images, open previews, download outputs, or create similar results.',
  loading: 'Loading history...',
  signInRequired: 'Please sign in with Google to view your history.',
  loadError: 'Could not load generation history.',
  emptyTitle: 'No generation history yet.',
  emptyDescription: 'Generated images will appear here after they complete.',
  previewLabel: 'Generation preview',
  previewImageLabel: 'Preview generated image',
  previewReferenceMedia: 'Preview reference media',
  closePreview: 'Close preview',
  referenceMedia: 'Reference Media',
  prompt: 'Prompt',
  copyPrompt: 'Copy prompt',
  createSimilar: 'Create Similar',
  download: 'Download',
  delete: 'Delete',
  deleting: 'Deleting',
  deleteHistoryConfirm: GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE,
  deleteError: 'Could not delete history item.',
  modeVideo: 'Video',
  modeTextToImage: 'Text to Image',
  modeImageToImage: 'Image to Image',
}

function getHistoryPageCopy(initialTranslations?: any) {
  return {
    ...defaultHistoryPageCopy,
    ...(initialTranslations?.historyPage || {}),
  }
}

function getModelHref(model: string) {
  const safeModel = String(model || 'nano-banana-pro').trim() || 'nano-banana-pro'
  return `/model/${safeModel}`
}

function getGenerationModeLabel(item: GenerationHistoryItem, copy: typeof defaultHistoryPageCopy) {
  if (item.mediaType === 'video') return copy.modeVideo
  return item.inputUrls.length > 0 ? copy.modeImageToImage : copy.modeTextToImage
}

interface HistoryPageClientProps {
  initialTranslations?: any
  locale?: string
}

export default function HistoryPageClient({ initialTranslations }: HistoryPageClientProps = {}) {
  const copy = getHistoryPageCopy(initialTranslations)
  const [items, setItems] = useState<GenerationHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewItem, setPreviewItem] = useState<GenerationHistoryItem | null>(null)
  const [fullScreenPreviewUrl, setFullScreenPreviewUrl] = useState('')
  const [deletingId, setDeletingId] = useState('')

  const closePreview = useCallback(() => {
    setPreviewItem(null)
    setFullScreenPreviewUrl('')
  }, [])

  const openPreview = useCallback((item: GenerationHistoryItem) => {
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

  useEffect(() => {
    let cancelled = false
    const loadHistory = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/history?limit=200', { cache: 'no-store' })
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
          throw new Error(copy.signInRequired)
        }
        if (!response.ok) throw new Error(copy.loadError)
        const data = await response.json().catch(() => ({ items: [] }))
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : [])
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : copy.loadError)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadHistory()
    return () => {
      cancelled = true
    }
  }, [copy.loadError, copy.signInRequired])

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
    await downloadImageInCurrentPage({
      imageUrl: item.outputUrl,
      filename: `toolaze-${item.id}.${item.mediaType === 'video' ? 'mp4' : 'png'}`,
      triggerBlobDownload,
      triggerUrlDownload,
    })
  }

  const handleDelete = async (item: GenerationHistoryItem) => {
    if (deletingId) return
    if (
      !shouldDeleteGenerationHistoryItem(
        (message) => window.confirm(message),
        copy.deleteHistoryConfirm,
      )
    ) {
      return
    }

    setDeletingId(item.id)
    setError('')
    try {
      const response = await fetch(`/api/history?id=${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || copy.deleteError)
      }
      setItems((currentItems) => currentItems.filter((currentItem) => currentItem.id !== item.id))
      closePreview()
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.deleteError)
    } finally {
      setDeletingId('')
    }
  }

  const handleReprompt = (item: GenerationHistoryItem) => {
    window.sessionStorage.setItem(PENDING_REPROMPT_STORAGE_KEY, JSON.stringify(buildHistoryRepromptPayload(item)))
    window.location.href = getModelHref(item.model)
  }

  const activePreviewMediaUrl = previewItem
    ? getHistoryPreviewMediaUrl({
        outputUrl: previewItem.outputUrl,
      })
    : ''
  const previewCreatedAt = previewItem ? formatLocalTimestampToSeconds(previewItem.createdAt) : ''

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">{copy.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {copy.description}
          </p>
        </div>
      </div>

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

      {!loading && !error && items.filter((item) => item.mediaType === 'image').length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-base font-extrabold text-slate-900">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm text-slate-500">{copy.emptyDescription}</p>
        </div>
      )}

      {!loading && !error && items.filter((item) => item.mediaType === 'image').length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {items.filter((item) => item.mediaType === 'image').map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
              <img
                src={getHistoryLibraryThumbnailUrl(item.outputUrl)}
                alt=""
                className="aspect-[3/4] h-auto w-full cursor-zoom-in object-cover object-center"
                loading="lazy"
                decoding="async"
                onClick={() => openPreview(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') openPreview(item)
                }}
                tabIndex={0}
                role="button"
                aria-label={copy.previewImageLabel}
              />
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
                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700">
                  {getGenerationModeLabel(previewItem, copy)}
                </span>
                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700">
                  {previewItem.model}
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
                            <img
                              src={getHistoryReferenceThumbnailUrl(url)}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
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
                      onClick={() => navigator.clipboard.writeText(previewItem.prompt).catch(() => {})}
                      className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      aria-label={copy.copyPrompt}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                  <div className="min-h-[260px] rounded-2xl bg-indigo-50/70 px-4 py-4 text-sm leading-6 text-slate-800">
                    {previewItem.prompt}
                  </div>
                </section>
              </div>

              <div
                data-history-preview-actions
                className="sticky bottom-0 -mx-5 mt-6 grid gap-3 border-t border-slate-200 bg-slate-50/95 px-5 py-4 backdrop-blur sm:grid-cols-[1fr_auto_auto] md:static md:mx-0 md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-0"
              >
                <button
                  type="button"
                  onClick={() => handleReprompt(previewItem)}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-extrabold text-white hover:bg-indigo-700"
                >
                  {copy.createSimilar}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDownload(previewItem)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-extrabold text-slate-700 hover:border-indigo-200 hover:text-indigo-600"
                >
                  {copy.download}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(previewItem)}
                  disabled={deletingId === previewItem.id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-5 py-3 text-center text-sm font-extrabold text-rose-600 hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <DeleteIcon size={16} />
                  {deletingId === previewItem.id ? copy.deleting : copy.delete}
                </button>
              </div>
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
          <img
            src={fullScreenPreviewUrl}
            alt=""
            className="max-h-[96vh] max-w-[96vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  )
}
