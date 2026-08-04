'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb'
import DeleteIcon from '@/components/icons/DeleteIcon'
import { getImageUploadUrl } from '@/lib/upload-url'
import { dispatchToolazeTopNotice } from '@/lib/top-notice'
import {
  getHistoryToolMetadata,
  getLocalizedInternalPath,
} from '@/lib/generation-history-tool-metadata'
import { formatLocalTimestampToSeconds } from '@/lib/credit-history-time'
import {
  getCachedGenerationAuthState,
  getGenerationAuthStateFromAuthMeResult,
} from '@/lib/generation-auth-state'
import type { GenerationAuthState } from '@/lib/generation-auth-state'
import { isCreditExhaustedGenerationError } from '@/lib/generation-error-classifier'
import { normalizeReusableReferenceImageUrl } from '@/lib/history-reprompt'
import { calculateVideoGenerationCredits } from '@/lib/generation-credits'

type Resolution = '480p' | '720p'
type RightPanelMode = 'sample' | 'history'
type TalkingAvatarGenerationStatus = 'processing' | 'succeeded' | 'failed'

type TalkingAvatarDemoVideo = {
  src?: string
  poster?: string
  ariaLabel?: string
}

type TalkingAvatarCopy = {
  imageTitle?: string
  imageHelper?: string
  audioTitle?: string
  audioHelper?: string
  promptLabel?: string
  promptPlaceholder?: string
  resolutionLabel?: string
  generateLabel?: string
  generatingLabel?: string
  resultTitle?: string
  resultEmptyTitle?: string
  resultEmptyText?: string
  demoLabel?: string
  historyLabel?: string
  noHistory?: string
  viewAll?: string
  promptHeading?: string
  generatingSeconds?: string
  resultReady?: string
  videoGenerationFailed?: string
  recreate?: string
  download?: string
  delete?: string
  copyPrompt?: string
  signedOutMessage?: string
  creditsUsedUpTitle?: string
  creditsUsedUpMessage?: string
  addCredits?: string
  maybeLater?: string
  audioTrimTitle?: string
  audioTrimMessage?: string
  audioTrimStartLabel?: string
  audioTrimLengthLabel?: string
  audioTrimRangeLabel?: string
  audioTrimConfirmAction?: string
  audioTrimCancelAction?: string
  audioTooLongMessage?: string
  audioReadFailedMessage?: string
  audioTrimFailedMessage?: string
}

interface TalkingAvatarCreatorToolProps {
  heroBreadcrumbItems: BreadcrumbItem[]
  heroTitleHtml: string
  heroDescription?: string
  copy?: TalkingAvatarCopy
  demoVideo?: TalkingAvatarDemoVideo
}

interface UploadFileState {
  file: File
  preview?: string
  durationSeconds?: number
}

interface PendingAudioTrimState {
  file: File
  preview: string
  duration: number
}

interface PersistedTalkingAvatarHistoryItem {
  id?: string
  mediaType?: 'image' | 'video'
  model?: string
  prompt?: string
  outputUrl?: string
  inputUrls?: string[]
  aspectRatio?: string | null
  resolution?: string | null
  outputFormat?: string | null
  nativeAudio?: boolean | null
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
  createdAt?: string
}

interface TalkingAvatarGenerationRequest {
  id: string
  modelName: string
  prompt: string
  resolution: Resolution
  inputPreview: string
  inputUrls: string[]
  audioPreviewUrl: string
  audioName: string
  createdAt: string
  startedAt: number
  status: TalkingAvatarGenerationStatus
  durationSeconds: number
  taskId?: string
  creditHold?: unknown
  taskProvider?: string
  videoUrl?: string
  error?: string
}

interface TalkingAvatarHistoryItem {
  id: string
  mediaType: 'video'
  modelName: string
  prompt: string
  resolution: string
  outputFormat: string
  inputPreview: string
  inputUrls: string[]
  audioPreviewUrl: string
  audioName?: string
  outputPreview: string
  time: string
  persisted: boolean
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
}

interface PromptInsertEventDetail {
  prompt?: string
}

interface PendingTalkingAvatarRepromptDetail {
  prompt?: string
  imageUrl?: string
  imageUrls?: string[]
  inputUrls?: string[]
  audioUrl?: string
  audioUrls?: string[]
  resolution?: string
  toolSlug?: string | null
  sourcePath?: string | null
}

const DEFAULT_COPY: Required<TalkingAvatarCopy> = {
  imageTitle: 'Upload avatar image',
  imageHelper: 'Use a clear front-facing portrait. JPG, PNG, or WebP works best.',
  audioTitle: 'Upload voice audio',
  audioHelper: 'MP3, WAV, M4A, or OGG. Keep audio under 10MB and 15 seconds for better lip sync.',
  promptLabel: 'Direct the talking avatar',
  promptPlaceholder:
    'Example: natural head movement, warm eye contact, subtle expressions, studio lighting, clean talking avatar video.',
  resolutionLabel: 'Resolution',
  generateLabel: 'Create Talking Avatar',
  generatingLabel: 'Creating avatar video...',
  resultTitle: 'Talking avatar result',
  resultEmptyTitle: 'Your result appears here',
  resultEmptyText: 'Upload one portrait and one audio file, then generate a lip-synced talking avatar video.',
  demoLabel: 'Demo',
  historyLabel: 'History',
  noHistory: 'No talking avatar requests yet.',
  viewAll: 'View All',
  promptHeading: 'Prompt',
  generatingSeconds: 'Creating talking avatar... {seconds}s',
  resultReady: 'Talking avatar ready',
  videoGenerationFailed: 'Talking avatar generation failed.',
  recreate: 'Recreate',
  download: 'Download',
  delete: 'Delete',
  copyPrompt: 'Copy Prompt',
  signedOutMessage: 'Please sign in with Google to create a talking avatar video.',
  creditsUsedUpTitle: 'Credits Used Up',
  creditsUsedUpMessage: 'You need more credits to create this talking avatar video. Buy a one-time pack or earn free credits with daily rewards.',
  addCredits: 'Add Credits',
  maybeLater: 'Maybe Later',
  audioTrimTitle: 'Choose audio segment',
  audioTrimMessage: 'This audio is longer than 15 seconds. Choose the part to keep before uploading.',
  audioTrimStartLabel: 'Start time',
  audioTrimLengthLabel: 'Clip length',
  audioTrimRangeLabel: 'Selected range',
  audioTrimConfirmAction: 'Use selected segment',
  audioTrimCancelAction: 'Cancel upload',
  audioTooLongMessage: 'Audio upload supports up to 15 seconds. Choose a segment or upload a shorter file.',
  audioReadFailedMessage: 'We could not read the audio duration. Please upload an audio file up to 15 seconds.',
  audioTrimFailedMessage: 'We could not trim this audio. Please upload an audio file up to 15 seconds.',
}

async function parseJsonSafely(response: Response) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatText(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`))
}

function isAudioFile(file: File) {
  return file.type.startsWith('audio/') || /\.(mp3|wav|m4a|ogg)$/i.test(file.name)
}

function isImageFile(file: File) {
  return file.type.startsWith('image/')
}

const DEFAULT_REFERENCE_AUDIO_NAME = 'Reference audio'
const TALKING_AVATAR_TOOL_SLUG = 'talking-avatar-creator'
const PENDING_REPROMPT_STORAGE_KEY = 'toolaze:pending-reprompt'
const LOCALIZED_ROUTE_PREFIXES = new Set(['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'])
const MAX_REFERENCE_AUDIO_SECONDS = 15
const AUDIO_DURATION_SAFETY_BUFFER_SECONDS = 0.5
const MAX_REFERENCE_AUDIO_EXPORT_SECONDS = MAX_REFERENCE_AUDIO_SECONDS - AUDIO_DURATION_SAFETY_BUFFER_SECONDS
const MIN_REFERENCE_AUDIO_SECONDS = 1

function normalizeBillingDurationSeconds(value: number | null | undefined) {
  const duration = Number(value)
  if (!Number.isFinite(duration) || duration <= 0) return MAX_REFERENCE_AUDIO_SECONDS
  return Math.max(MIN_REFERENCE_AUDIO_SECONDS, Math.min(MAX_REFERENCE_AUDIO_SECONDS, Math.ceil(duration)))
}

function getRemoteMediaName(url: string, fallback: string) {
  const cleanUrl = url.split('?')[0]?.split('#')[0] || ''
  return decodeURIComponent(cleanUrl.split('/').filter(Boolean).pop() || fallback)
}

function getSourcePathRoot(sourcePath: string | null | undefined) {
  const parts = String(sourcePath || '').split('/').filter(Boolean)
  return LOCALIZED_ROUTE_PREFIXES.has(parts[0] || '') ? parts[1] || '' : parts[0] || ''
}

function isPersistedTalkingAvatarHistoryItem(item: PersistedTalkingAvatarHistoryItem) {
  return item.toolSlug === TALKING_AVATAR_TOOL_SLUG || getSourcePathRoot(item.sourcePath) === TALKING_AVATAR_TOOL_SLUG
}

function formatAudioTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.ceil(Number.isFinite(seconds) ? seconds : 0))
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

async function getAudioDurationInSeconds(file: File) {
  const previewUrl = URL.createObjectURL(file)

  try {
    return await new Promise<number>((resolve, reject) => {
      const audioElement = new Audio()
      audioElement.preload = 'metadata'
      audioElement.onloadedmetadata = () => {
        const duration = Number.isFinite(audioElement.duration) ? audioElement.duration : 0
        resolve(duration)
      }
      audioElement.onerror = () => reject(new Error('Unable to read audio duration.'))
      audioElement.src = previewUrl
      audioElement.load()
    })
  } finally {
    URL.revokeObjectURL(previewUrl)
  }
}

function writeWavString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index))
  }
}

function audioBufferToWavBlob(audioBuffer: AudioBuffer) {
  const channelCount = audioBuffer.numberOfChannels
  const bytesPerSample = 2
  const blockAlign = channelCount * bytesPerSample
  const dataSize = audioBuffer.length * blockAlign
  const wavBuffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(wavBuffer)
  let offset = 0

  writeWavString(view, offset, 'RIFF')
  offset += 4
  view.setUint32(offset, 36 + dataSize, true)
  offset += 4
  writeWavString(view, offset, 'WAVE')
  offset += 4
  writeWavString(view, offset, 'fmt ')
  offset += 4
  view.setUint32(offset, 16, true)
  offset += 4
  view.setUint16(offset, 1, true)
  offset += 2
  view.setUint16(offset, channelCount, true)
  offset += 2
  view.setUint32(offset, audioBuffer.sampleRate, true)
  offset += 4
  view.setUint32(offset, audioBuffer.sampleRate * blockAlign, true)
  offset += 4
  view.setUint16(offset, blockAlign, true)
  offset += 2
  view.setUint16(offset, bytesPerSample * 8, true)
  offset += 2
  writeWavString(view, offset, 'data')
  offset += 4
  view.setUint32(offset, dataSize, true)
  offset += 4

  const channelData = Array.from({ length: channelCount }, (_, channelIndex) => audioBuffer.getChannelData(channelIndex))
  for (let frameIndex = 0; frameIndex < audioBuffer.length; frameIndex += 1) {
    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
      const sample = Math.max(-1, Math.min(1, channelData[channelIndex][frameIndex] || 0))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }

  return new Blob([wavBuffer], { type: 'audio/wav' })
}

async function trimAudioToSegment(file: File, startSeconds: number, endSeconds: number) {
  const audioContextConstructor = window.AudioContext
    || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!audioContextConstructor) {
    throw new Error('Audio trimming is not supported in this browser.')
  }

  const audioContext = new audioContextConstructor()
  try {
    const sourceBuffer = await audioContext.decodeAudioData(await file.arrayBuffer())
    const safeStartSeconds = Math.max(0, Math.min(startSeconds, sourceBuffer.duration))
    const safeEndSeconds = Math.max(safeStartSeconds, Math.min(endSeconds, sourceBuffer.duration, safeStartSeconds + MAX_REFERENCE_AUDIO_EXPORT_SECONDS))
    const startFrame = Math.floor(safeStartSeconds * sourceBuffer.sampleRate)
    const endFrame = Math.max(startFrame + 1, Math.floor(safeEndSeconds * sourceBuffer.sampleRate))
    const maxFrameCount = Math.floor(MAX_REFERENCE_AUDIO_EXPORT_SECONDS * sourceBuffer.sampleRate)
    const frameCount = Math.min(sourceBuffer.length - startFrame, endFrame - startFrame, maxFrameCount)
    const trimmedBuffer = audioContext.createBuffer(sourceBuffer.numberOfChannels, frameCount, sourceBuffer.sampleRate)

    for (let channelIndex = 0; channelIndex < sourceBuffer.numberOfChannels; channelIndex += 1) {
      trimmedBuffer.copyToChannel(sourceBuffer.getChannelData(channelIndex).subarray(startFrame, startFrame + frameCount), channelIndex)
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'audio'
    return new File([audioBufferToWavBlob(trimmedBuffer)], `${baseName}-selected-15s.wav`, {
      type: 'audio/wav',
      lastModified: Date.now(),
    })
  } finally {
    await audioContext.close().catch(() => {})
  }
}

async function ensureSignedInForTalkingAvatarGeneration(requiredCredits: number): Promise<GenerationAuthState> {
  const cachedAuthState = getCachedGenerationAuthState(requiredCredits)

  try {
    const response = await fetch('/api/auth/me', {
      cache: 'no-store',
      credentials: 'include',
    })
    const data = await response.json().catch(() => ({}))
    if (data?.user && typeof window !== 'undefined') {
      ;(window as any).__TOOLAZE_AUTH_USER__ = data.user
    }

    return getGenerationAuthStateFromAuthMeResult(response.status, data, requiredCredits, cachedAuthState)
  } catch {
    return cachedAuthState
  }
}

function dispatchCreditsUpdated(credits: unknown) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('toolaze:credits-updated', {
    detail: credits || null,
  }))
}

function mapPersistedTalkingAvatarHistoryItem(item: PersistedTalkingAvatarHistoryItem): TalkingAvatarHistoryItem | null {
  if (item.mediaType !== 'video' || !item.outputUrl) return null

  const inputUrls = Array.isArray(item.inputUrls) ? item.inputUrls.filter(Boolean) : []
  return {
    id: item.id || `history-${item.outputUrl}`,
    mediaType: 'video',
    modelName: item.toolLabel || 'AI Talking Avatar',
    prompt: item.prompt || '',
    resolution: item.resolution || 'auto',
    outputFormat: item.outputFormat || 'video',
    inputPreview: inputUrls[0] || '',
    inputUrls,
    audioPreviewUrl: inputUrls[1] || '',
    audioName: DEFAULT_REFERENCE_AUDIO_NAME,
    outputPreview: item.outputUrl,
    time: formatLocalTimestampToSeconds(item.createdAt || new Date().toISOString()),
    persisted: Boolean(item.id),
    toolSlug: item.toolSlug || TALKING_AVATAR_TOOL_SLUG,
    toolLabel: item.toolLabel || 'AI Talking Avatar',
    sourcePath: item.sourcePath || null,
  }
}

export default function TalkingAvatarCreatorTool({
  heroBreadcrumbItems,
  heroTitleHtml,
  heroDescription,
  copy,
  demoVideo,
}: TalkingAvatarCreatorToolProps) {
  const pathname = usePathname() || '/talking-avatar-creator'
  const text = useMemo(() => ({ ...DEFAULT_COPY, ...(copy || {}) }), [copy])
  const [image, setImage] = useState<UploadFileState | null>(null)
  const [audio, setAudio] = useState<UploadFileState | null>(null)
  const [remoteImageUrl, setRemoteImageUrl] = useState('')
  const [remoteAudioUrl, setRemoteAudioUrl] = useState('')
  const [remoteAudioName, setRemoteAudioName] = useState(DEFAULT_REFERENCE_AUDIO_NAME)
  const [remoteAudioDurationSeconds, setRemoteAudioDurationSeconds] = useState(MAX_REFERENCE_AUDIO_SECONDS)
  const [prompt, setPrompt] = useState(() => text.promptPlaceholder)
  const [resolution, setResolution] = useState<Resolution>('480p')
  const [currentRequest, setCurrentRequest] = useState<TalkingAvatarGenerationRequest | null>(null)
  const [history, setHistory] = useState<TalkingAvatarHistoryItem[]>([])
  const [rightMode, setRightMode] = useState<RightPanelMode>('sample')
  const [generatingSeconds, setGeneratingSeconds] = useState(0)
  const [creditExhaustedModalOpen, setCreditExhaustedModalOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewAudio, setPreviewAudio] = useState<{ url: string; name?: string } | null>(null)
  const [pendingAudioTrim, setPendingAudioTrim] = useState<PendingAudioTrimState | null>(null)
  const [audioTrimStartSeconds, setAudioTrimStartSeconds] = useState(0)
  const [audioTrimClipSeconds, setAudioTrimClipSeconds] = useState(MAX_REFERENCE_AUDIO_EXPORT_SECONDS)
  const [isTrimmingAudio, setIsTrimmingAudio] = useState(false)

  const isGenerating = currentRequest?.status === 'processing'
  const currentImagePreview = image?.preview || remoteImageUrl
  const currentAudioName = audio?.file?.name || remoteAudioName
  const hasGenerationImage = Boolean(image?.file || remoteImageUrl)
  const hasGenerationAudio = Boolean(audio?.file || remoteAudioUrl)
  const canGenerate = Boolean(hasGenerationImage && hasGenerationAudio && prompt.trim() && !isGenerating)
  const showGenerateCredits = Boolean(hasGenerationAudio && !isGenerating)
  const durationSeconds = normalizeBillingDurationSeconds(audio?.durationSeconds ?? (remoteAudioUrl ? remoteAudioDurationSeconds : MAX_REFERENCE_AUDIO_SECONDS))
  const requiredCredits = calculateVideoGenerationCredits('infinitalk', resolution, durationSeconds) ?? 0
  const hasDesktopResultTabs = isGenerating || currentRequest?.status === 'failed' || history.length > 0
  const historyPageHref = getLocalizedInternalPath(pathname, '/history')
  const creditsPageHref = getLocalizedInternalPath(pathname, '/credits')
  const audioTrimMaxClipSeconds = pendingAudioTrim
    ? Math.min(MAX_REFERENCE_AUDIO_EXPORT_SECONDS, Math.max(MIN_REFERENCE_AUDIO_SECONDS, pendingAudioTrim.duration))
    : MAX_REFERENCE_AUDIO_EXPORT_SECONDS
  const audioTrimMaxStartSeconds = pendingAudioTrim
    ? Math.max(0, pendingAudioTrim.duration - audioTrimClipSeconds)
    : 0
  const audioTrimEndSeconds = pendingAudioTrim
    ? Math.min(pendingAudioTrim.duration, audioTrimStartSeconds + audioTrimClipSeconds)
    : 0

  useEffect(() => {
    return () => {
      if (image?.preview) URL.revokeObjectURL(image.preview)
      if (audio?.preview) URL.revokeObjectURL(audio.preview)
    }
  }, [image?.preview, audio?.preview])

  useEffect(() => {
    return () => {
      if (pendingAudioTrim?.preview) URL.revokeObjectURL(pendingAudioTrim.preview)
    }
  }, [pendingAudioTrim?.preview])

  useEffect(() => {
    if (!isGenerating || !currentRequest?.startedAt) return

    const updateSeconds = () => {
      setGeneratingSeconds(Math.max(0, Math.floor((Date.now() - currentRequest.startedAt) / 1000)))
    }

    updateSeconds()
    const interval = window.setInterval(updateSeconds, 1000)
    return () => window.clearInterval(interval)
  }, [currentRequest?.id, currentRequest?.startedAt, isGenerating])

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<PromptInsertEventDetail>).detail
      const promptText = String(detail?.prompt || '').trim()
      if (!promptText) return

      setPrompt(promptText)
      setRightMode('sample')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('toolaze:use-prompt', handler as EventListener)
    return () => window.removeEventListener('toolaze:use-prompt', handler as EventListener)
  }, [])

  useEffect(() => {
    const raw = window.sessionStorage.getItem(PENDING_REPROMPT_STORAGE_KEY)
    if (!raw) return

    try {
      const detail = JSON.parse(raw) as PendingTalkingAvatarRepromptDetail
      const detailToolSlug = String(detail.toolSlug || '').trim()
      const detailSourceRoot = getSourcePathRoot(detail.sourcePath)
      if (detailToolSlug && detailToolSlug !== TALKING_AVATAR_TOOL_SLUG && detailSourceRoot !== TALKING_AVATAR_TOOL_SLUG) return
      if (!detailToolSlug && detailSourceRoot && detailSourceRoot !== TALKING_AVATAR_TOOL_SLUG) return

      const inputUrls = Array.isArray(detail.inputUrls)
        ? detail.inputUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
        : []
      const imageUrls = Array.isArray(detail.imageUrls)
        ? detail.imageUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
        : []
      const audioUrls = Array.isArray(detail.audioUrls)
        ? detail.audioUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
        : []
      const imageUrl = normalizeReusableReferenceImageUrl(detail.imageUrl) || imageUrls[0] || inputUrls[0] || ''
      const audioUrl = normalizeReusableReferenceImageUrl(detail.audioUrl) || audioUrls[0] || inputUrls[1] || ''
      const nextPrompt = String(detail.prompt || '').trim()

      if (!nextPrompt && !imageUrl && !audioUrl && !detail.resolution) return
      if (nextPrompt) setPrompt(nextPrompt)
      if (detail.resolution === '720p') setResolution('720p')
      if (detail.resolution && detail.resolution !== '720p') setResolution('480p')
      if (imageUrl) {
        setImage(null)
        setRemoteImageUrl(imageUrl)
      }
      if (audioUrl) {
        setAudio(null)
        setRemoteAudioUrl(audioUrl)
        setRemoteAudioName(getRemoteMediaName(audioUrl, DEFAULT_REFERENCE_AUDIO_NAME))
        setRemoteAudioDurationSeconds(MAX_REFERENCE_AUDIO_SECONDS)
      }
      setRightMode('sample')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.sessionStorage.removeItem(PENDING_REPROMPT_STORAGE_KEY)
    } catch {
      window.sessionStorage.removeItem(PENDING_REPROMPT_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadInlineHistory = async () => {
      try {
        const response = await fetch('/api/history?limit=20', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (!response.ok) return
        const data: { items?: PersistedTalkingAvatarHistoryItem[] } = await response.json().catch(() => ({ items: [] }))
        const loadedHistory = Array.isArray(data.items)
          ? data.items
            .filter(isPersistedTalkingAvatarHistoryItem)
            .map(mapPersistedTalkingAvatarHistoryItem)
            .filter((item): item is TalkingAvatarHistoryItem => Boolean(item))
          : []
        if (!cancelled && loadedHistory.length > 0) {
          setHistory(loadedHistory)
        }
      } catch {
        // Inline history is optional. The History page remains the source of truth.
      }
    }

    const refreshInlineHistory = () => {
      void loadInlineHistory()
    }

    void loadInlineHistory()
    window.addEventListener('toolaze:auth-updated', refreshInlineHistory)

    return () => {
      cancelled = true
      window.removeEventListener('toolaze:auth-updated', refreshInlineHistory)
    }
  }, [])

  const selectImage = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    if (!isImageFile(file)) {
      dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: 'Please upload an image file.' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: 'Image must be 10MB or smaller.' })
      return
    }
    if (image?.preview) URL.revokeObjectURL(image.preview)
    setRemoteImageUrl('')
    setImage({ file, preview: URL.createObjectURL(file) })
  }

  const acceptAudioFile = (nextAudioFile: File, nextDurationSeconds = MAX_REFERENCE_AUDIO_SECONDS) => {
    if (audio?.preview) URL.revokeObjectURL(audio.preview)
    setRemoteAudioUrl('')
    setRemoteAudioName(DEFAULT_REFERENCE_AUDIO_NAME)
    setRemoteAudioDurationSeconds(MAX_REFERENCE_AUDIO_SECONDS)
    setAudio({
      file: nextAudioFile,
      preview: URL.createObjectURL(nextAudioFile),
      durationSeconds: normalizeBillingDurationSeconds(nextDurationSeconds),
    })
  }

  const selectAudio = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    if (!isAudioFile(file)) {
      dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: 'Please upload an audio file.' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: 'Audio must be 10MB or smaller.' })
      return
    }

    let durationInSeconds = 0
    try {
      durationInSeconds = await getAudioDurationInSeconds(file)
    } catch {
      dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: text.audioReadFailedMessage })
      return
    }

    if (durationInSeconds > MAX_REFERENCE_AUDIO_EXPORT_SECONDS) {
      const preview = URL.createObjectURL(file)
      setPendingAudioTrim({ file, preview, duration: durationInSeconds })
      setAudioTrimStartSeconds(0)
      setAudioTrimClipSeconds(MAX_REFERENCE_AUDIO_EXPORT_SECONDS)
      return
    }

    acceptAudioFile(file, durationInSeconds)
  }

  const cancelAudioTrim = () => {
    setPendingAudioTrim(null)
    dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: text.audioTooLongMessage })
  }

  const confirmAudioTrim = async () => {
    if (!pendingAudioTrim) return
    setIsTrimmingAudio(true)
    try {
      const nextAudioFile = await trimAudioToSegment(pendingAudioTrim.file, audioTrimStartSeconds, audioTrimEndSeconds)
      acceptAudioFile(nextAudioFile, audioTrimEndSeconds - audioTrimStartSeconds)
      setPendingAudioTrim(null)
    } catch {
      dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: text.audioTrimFailedMessage })
    } finally {
      setIsTrimmingAudio(false)
    }
  }

  const updateAudioTrimStart = (value: string) => {
    const nextStart = Math.max(0, Math.min(Number(value) || 0, audioTrimMaxStartSeconds))
    setAudioTrimStartSeconds(nextStart)
  }

  const updateAudioTrimClipSeconds = (value: string) => {
    if (!pendingAudioTrim) return
    const nextClipSeconds = Math.max(MIN_REFERENCE_AUDIO_SECONDS, Math.min(Number(value) || MIN_REFERENCE_AUDIO_SECONDS, audioTrimMaxClipSeconds))
    setAudioTrimClipSeconds(nextClipSeconds)
    setAudioTrimStartSeconds((current) => Math.min(current, Math.max(0, pendingAudioTrim.duration - nextClipSeconds)))
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(getImageUploadUrl(), {
      method: 'POST',
      body: formData,
    })
    const result = await parseJsonSafely(response)
    if (!response.ok || !result.url) {
      throw new Error(result.error || `Upload failed with status ${response.status}`)
    }
    return String(result.url)
  }

  const pollStatus = async (taskId: string, creditHold?: unknown, taskProvider?: string) => {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const response = await fetch('/api/ai-video-generator/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ taskId, creditHold: creditHold || null, taskProvider: taskProvider || null }),
      })
      const result = await parseJsonSafely(response)
      if (result.credits) {
        dispatchCreditsUpdated(result.credits)
      }
      if (!response.ok) {
        throw new Error(result.error || `Status check failed with status ${response.status}`)
      }
      if (result.status === 'SUCCEEDED' && result.videoUrl) {
        return String(result.videoUrl)
      }
      if (result.status === 'FAILED') {
        throw new Error(result.message || text.videoGenerationFailed)
      }
      await wait(5000)
    }
    throw new Error('Talking avatar generation timed out.')
  }

  const addHistoryItemToFeed = (item: TalkingAvatarHistoryItem) => {
    setHistory((prev) => [item, ...prev.filter((historyItem) => historyItem.id !== item.id)].slice(0, 20))
  }

  const persistHistory = async (
    outputUrl: string,
    imageUrl: string,
    audioUrl: string,
    requestPrompt: string,
    requestResolution: Resolution,
  ): Promise<PersistedTalkingAvatarHistoryItem | null> => {
    const historyTool = getHistoryToolMetadata(pathname, 'Infinitalk', 'infinitalk')
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mediaType: 'video',
          model: 'infinitalk',
          prompt: requestPrompt,
          outputUrl,
          inputUrls: [imageUrl, audioUrl],
          aspectRatio: 'auto',
          resolution: requestResolution,
          outputFormat: 'audio-driven',
          nativeAudio: true,
          ...historyTool,
        }),
      })
      if (!response.ok) return null
      const data = await response.json().catch(() => ({}))
      return data?.item || null
    } catch {
      return null
    }
  }

  const handleGenerate = async () => {
    if (!canGenerate) return

    const requestPrompt = prompt.trim()
    const requestResolution = resolution
    const requestImage = image
    const requestAudio = audio
    const requestRemoteImageUrl = remoteImageUrl
    const requestRemoteAudioUrl = remoteAudioUrl
    const requestImageFile = requestImage?.file || null
    const requestAudioFile = requestAudio?.file || null
    if (!requestRemoteImageUrl && !requestImageFile) return
    if (!requestRemoteAudioUrl && !requestAudioFile) return
    const requestImagePreview = requestImage?.preview || requestRemoteImageUrl
    const requestAudioPreview = requestAudio?.preview || requestRemoteAudioUrl
    const requestAudioName = requestAudio?.file.name || remoteAudioName
    const requestDurationSeconds = durationSeconds
    const requestRequiredCredits = calculateVideoGenerationCredits('infinitalk', requestResolution, requestDurationSeconds) ?? requiredCredits

    const authState = await ensureSignedInForTalkingAvatarGeneration(requestRequiredCredits)
    if (!authState.isSignedIn) {
      dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: text.signedOutMessage })
      window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
      return
    }
    if (authState.creditsExhausted) {
      setCreditExhaustedModalOpen(true)
      return
    }

    const startedAt = Date.now()
    const request: TalkingAvatarGenerationRequest = {
      id: `talking-avatar-${startedAt}-${Math.random().toString(36).slice(2, 8)}`,
      modelName: 'AI Talking Avatar',
      prompt: requestPrompt,
      resolution: requestResolution,
      inputPreview: requestImagePreview || '',
      inputUrls: [],
      audioPreviewUrl: requestAudioPreview || '',
      audioName: requestAudioName,
      createdAt: formatLocalTimestampToSeconds(new Date(startedAt).toISOString()),
      startedAt,
      status: 'processing',
      durationSeconds: requestDurationSeconds,
    }

    setGeneratingSeconds(0)
    setCurrentRequest(request)
    setRightMode('history')

    try {
      const [imageUrl, audioUrl] = await Promise.all([
        requestRemoteImageUrl ? Promise.resolve(requestRemoteImageUrl) : requestImageFile ? uploadFile(requestImageFile) : Promise.reject(new Error('Missing reference image.')),
        requestRemoteAudioUrl ? Promise.resolve(requestRemoteAudioUrl) : requestAudioFile ? uploadFile(requestAudioFile) : Promise.reject(new Error('Missing reference audio.')),
      ])

      setCurrentRequest((current) => current?.id === request.id
        ? { ...current, inputUrls: [imageUrl, audioUrl], inputPreview: imageUrl, audioPreviewUrl: audioUrl }
        : current)

      const formData = new FormData()
      formData.append('imageUrl', imageUrl)
      formData.append('audioUrl', audioUrl)
      formData.append('prompt', requestPrompt)
      formData.append('resolution', requestResolution)
      formData.append('durationSeconds', String(requestDurationSeconds))

      const response = await fetch('/api/talking-avatar-creator', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const result = await parseJsonSafely(response)
      if (result.credits) {
        dispatchCreditsUpdated(result.credits)
      }
      if (!response.ok) {
        if (isCreditExhaustedGenerationError(response.status, result)) {
          setCurrentRequest(null)
          setCreditExhaustedModalOpen(true)
          setRightMode(history.length > 0 ? 'history' : 'sample')
          return
        }
        if (response.status === 401) {
          setCurrentRequest(null)
          dispatchToolazeTopNotice({ type: 'warning', title: 'Warning', message: text.signedOutMessage })
          window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
          setRightMode(history.length > 0 ? 'history' : 'sample')
          return
        }
        throw new Error(result.error || 'Failed to create talking avatar task.')
      }

      let nextVideoUrl = String(result.videoUrl || '').trim()
      const taskId = String(result.taskId || '').trim()
      const creditHold = result.creditHold || null
      const taskProvider = String(result.taskProvider || '').trim()
      if (!nextVideoUrl && taskId) {
        nextVideoUrl = await pollStatus(taskId, creditHold, taskProvider)
      }
      if (!nextVideoUrl) {
        throw new Error('Talking avatar generation returned no video.')
      }

      const savedItem = await persistHistory(nextVideoUrl, imageUrl, audioUrl, requestPrompt, requestResolution)
      const historyItem: TalkingAvatarHistoryItem = {
        id: savedItem?.id || request.id,
        mediaType: 'video',
        modelName: savedItem?.toolLabel || 'AI Talking Avatar',
        prompt: requestPrompt,
        resolution: savedItem?.resolution || requestResolution,
        outputFormat: savedItem?.outputFormat || 'audio-driven',
        inputPreview: imageUrl,
        inputUrls: [imageUrl, audioUrl],
        audioPreviewUrl: audioUrl,
        audioName: requestAudioName,
        outputPreview: nextVideoUrl,
        time: formatLocalTimestampToSeconds(savedItem?.createdAt || new Date().toISOString()),
        persisted: Boolean(savedItem?.id),
        toolSlug: savedItem?.toolSlug || 'talking-avatar-creator',
        toolLabel: savedItem?.toolLabel || 'AI Talking Avatar',
        sourcePath: savedItem?.sourcePath || pathname,
      }

      addHistoryItemToFeed(historyItem)
      setCurrentRequest({
        ...request,
        status: 'succeeded',
        taskId: taskId || undefined,
        creditHold,
        taskProvider: taskProvider || undefined,
        videoUrl: nextVideoUrl,
        inputUrls: [imageUrl, audioUrl],
        inputPreview: imageUrl,
        audioPreviewUrl: audioUrl,
      })
      setRightMode('history')
      dispatchToolazeTopNotice({
        type: 'success',
        title: 'Success',
        message: 'Talking avatar video is ready.',
        celebration: true,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : text.videoGenerationFailed
      if (isCreditExhaustedGenerationError(0, { error: message })) {
        setCreditExhaustedModalOpen(true)
        setCurrentRequest(null)
        setRightMode(history.length > 0 ? 'history' : 'sample')
        return
      }
      setCurrentRequest({ ...request, status: 'failed', error: message })
      setRightMode('history')
      dispatchToolazeTopNotice({ type: 'error', title: 'Failed', message })
    }
  }

  const copyPromptToClipboard = async (promptText: string) => {
    await navigator.clipboard?.writeText(promptText).catch(() => {})
  }

  const applyHistoryItemToForm = (item: TalkingAvatarHistoryItem) => {
    const imageUrl = item.inputPreview || item.inputUrls[0] || ''
    const audioUrl = item.audioPreviewUrl || item.inputUrls[1] || ''

    if (image?.preview) URL.revokeObjectURL(image.preview)
    if (audio?.preview) URL.revokeObjectURL(audio.preview)
    setPrompt(item.prompt || text.promptPlaceholder)
    setResolution(item.resolution === '720p' ? '720p' : '480p')
    setImage(null)
    setAudio(null)
    setRemoteImageUrl(imageUrl)
    setRemoteAudioUrl(audioUrl)
    setRemoteAudioName(item.audioName || (audioUrl ? getRemoteMediaName(audioUrl, DEFAULT_REFERENCE_AUDIO_NAME) : DEFAULT_REFERENCE_AUDIO_NAME))
    setRightMode('sample')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteHistoryItem = async (item: TalkingAvatarHistoryItem) => {
    if (!window.confirm('Delete this history item?')) return
    if (item.persisted) {
      const response = await fetch(`/api/history?id=${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) return
    }
    setHistory((prev) => prev.filter((historyItem) => historyItem.id !== item.id))
  }

  const renderVideoMetaTags = (item: {
    modelName: string
    resolution: string
    outputFormat?: string
  }, timeLabel: string) => (
    <div data-desktop-history-meta className="flex flex-wrap items-center gap-1">
      {[item.modelName, 'Image + Audio', item.resolution, item.outputFormat, timeLabel].filter(Boolean).map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="rounded-full bg-[#EEF2FF]/60 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-[#C7D2FE]/70"
        >
          {tag}
        </span>
      ))}
    </div>
  )

  const renderPromptPreview = (promptText: string) => (
    <p className="max-h-[8rem] overflow-y-auto overscroll-contain pr-2 text-sm leading-6 whitespace-pre-wrap text-slate-600">
      {promptText}
    </p>
  )

  const renderAudioReferenceCard = (audioUrl?: string, audioName = DEFAULT_REFERENCE_AUDIO_NAME) => {
    if (!audioUrl) return null

    return (
      <button
        type="button"
        data-talking-avatar-audio-reference-card
        onClick={() => setPreviewAudio({ url: audioUrl, name: audioName })}
        className="group flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8FAFF] text-[#4F46E5] ring-1 ring-[#E0E7FF] transition hover:bg-[#EEF2FF] hover:ring-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/60"
        title={audioName}
        aria-label={`Preview ${audioName}`}
      >
        <span className="sr-only">{audioName}</span>
        <span aria-hidden="true" className="flex h-8 items-end gap-0.5">
          {[14, 22, 30, 18, 26].map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="w-1 rounded-full bg-current opacity-80 transition-opacity group-hover:opacity-100"
              style={{ height }}
            />
          ))}
        </span>
      </button>
    )
  }

  const renderDesktopPendingVideoItem = (item: TalkingAvatarGenerationRequest) => (
    <div
      key={item.id}
      data-talking-avatar-result-item
      className="grid gap-4 border-b border-[#E0E7FF] pb-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
    >
      <div
        data-talking-avatar-generating-panel
        className="flex min-h-[140px] items-center justify-center rounded-xl bg-slate-50 p-2"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
          <p className="text-sm font-semibold text-[#4F46E5]">
            {formatText(text.generatingSeconds, { seconds: generatingSeconds })}
          </p>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        {renderVideoMetaTags({ ...item, outputFormat: 'audio-driven' }, item.createdAt)}
        <div>
          <p className="mb-2 text-sm font-extrabold text-slate-900">{text.promptHeading}</p>
          {renderPromptPreview(item.prompt)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {item.inputPreview ? (
            <button
              type="button"
              data-talking-avatar-image-reference-card
              onClick={() => setPreviewImage(item.inputPreview)}
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg p-0 ring-1 ring-[#E0E7FF] transition hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/60"
              title="Preview reference image"
              aria-label="Preview reference image"
            >
              <img src={item.inputPreview} alt="" className="h-full w-full object-cover" />
            </button>
          ) : null}
          {renderAudioReferenceCard(item.audioPreviewUrl || item.inputUrls[1], item.audioName)}
        </div>
      </div>
    </div>
  )

  const renderDesktopFailedVideoItem = (item: TalkingAvatarGenerationRequest) => (
    <div
      key={item.id}
      data-talking-avatar-result-item
      className="grid gap-4 rounded-2xl border-b border-[#E0E7FF] pb-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
    >
      <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-red-100 bg-red-50/70 p-5 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 ring-1 ring-red-200">
            !
          </div>
          <p className="text-sm font-extrabold text-red-700">{text.videoGenerationFailed}</p>
          <p className="text-xs leading-5 text-red-600">{item.error || text.videoGenerationFailed}</p>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        {renderVideoMetaTags({ ...item, outputFormat: 'audio-driven' }, item.createdAt)}
        <div>
          <p className="mb-2 text-sm font-extrabold text-slate-900">{text.promptHeading}</p>
          {renderPromptPreview(item.prompt)}
        </div>
      </div>
    </div>
  )

  const renderDesktopVideoHistoryItem = (item: TalkingAvatarHistoryItem) => (
    <div
      key={item.id}
      data-talking-avatar-result-item
      className="grid gap-4 rounded-2xl border-b border-[#E0E7FF] pb-6 last:border-b-0 last:pb-0 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
    >
      <div data-talking-avatar-result-panel className="flex h-full items-start justify-center lg:h-[260px]">
        <video
          src={item.outputPreview}
          controls
          playsInline
          className="h-full max-h-[260px] max-w-full object-contain"
        />
      </div>

      <div className="flex h-full min-w-0 flex-col gap-4 lg:h-[260px]">
        {renderVideoMetaTags(item, item.time)}
        <div className="flex min-h-0 items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm font-extrabold text-slate-900">{text.promptHeading}</p>
            {renderPromptPreview(item.prompt)}
          </div>
          <button
            type="button"
            onClick={() => void copyPromptToClipboard(item.prompt)}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            title={text.copyPrompt}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {item.inputPreview ? (
            <button
              type="button"
              data-talking-avatar-image-reference-card
              onClick={() => setPreviewImage(item.inputPreview)}
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg p-0 ring-1 ring-[#E0E7FF] transition hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/60"
              title="Preview reference image"
              aria-label="Preview reference image"
            >
              <img src={item.inputPreview} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </button>
          ) : null}
          {renderAudioReferenceCard(item.audioPreviewUrl || item.inputUrls[1], item.audioName || DEFAULT_REFERENCE_AUDIO_NAME)}
        </div>

        <div data-talking-avatar-result-actions className="mt-auto flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => applyHistoryItemToForm(item)}
            className="rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#9333EA] px-5 py-2.5 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg"
          >
            {text.recreate}
          </button>
          <a
            href={item.outputPreview}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C7D2FE] px-4 py-2.5 text-sm font-bold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
            title={text.download}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{text.download}</span>
          </a>
          <button
            type="button"
            onClick={() => void handleDeleteHistoryItem(item)}
            className="flex items-center justify-center rounded-xl border border-[#C7D2FE] px-3 py-2.5 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
            title={text.delete}
          >
            <DeleteIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderDesktopVideoResultFeed = () => (
    <div
      data-talking-avatar-result-feed
      className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain p-4 md:p-5"
    >
      <div className="space-y-6">
        {currentRequest?.status === 'processing' ? renderDesktopPendingVideoItem(currentRequest) : null}
        {currentRequest?.status === 'failed' ? renderDesktopFailedVideoItem(currentRequest) : null}
        {history.map((item) => renderDesktopVideoHistoryItem(item))}
        {!isGenerating && currentRequest?.status !== 'failed' && history.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#E0E7FF] bg-white px-4 py-10 text-center text-sm text-slate-500">
            {text.noHistory}
          </p>
        ) : null}
      </div>
    </div>
  )

  const renderDesktopResultTabs = () => (
    <div
      data-desktop-result-tabs
      className="flex w-fit shrink-0 items-center justify-start gap-1 rounded-full border border-[#E0E7FF] bg-white/90 p-1 shadow-sm shadow-[#4F46E5]/5"
    >
      <button
        type="button"
        data-desktop-result-tab="sample"
        aria-pressed={rightMode !== 'history'}
        onClick={() => setRightMode('sample')}
        className={`inline-flex h-9 min-w-[84px] items-center justify-center rounded-full px-3.5 text-sm font-semibold transition-colors ${
          rightMode !== 'history'
            ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
            : 'text-slate-500 hover:bg-[#F8FAFF] hover:text-slate-700'
        }`}
      >
        {text.demoLabel}
      </button>
      <button
        type="button"
        data-desktop-result-tab="history"
        aria-pressed={rightMode === 'history'}
        onClick={() => setRightMode('history')}
        className={`inline-flex h-9 min-w-[84px] items-center justify-center rounded-full px-3.5 text-sm font-semibold transition-colors ${
          rightMode === 'history'
            ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
            : 'text-slate-500 hover:bg-[#F8FAFF] hover:text-slate-700'
        }`}
      >
        {text.historyLabel}
      </button>
    </div>
  )

  const renderSamplePreview = () => (
    <div
      data-talking-avatar-preview-canvas
      className="relative flex min-h-[320px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#F7F5FF] p-4 md:p-6"
    >
      <div data-talking-avatar-preview-frame className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-950 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200/80">
        {demoVideo?.src ? (
          <video
            data-talking-avatar-demo-video
            className="h-full w-full bg-slate-950 object-contain"
            src={demoVideo.src}
            poster={demoVideo.poster}
            aria-label={demoVideo.ariaLabel || text.resultTitle}
            controls
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-indigo-500/30 to-transparent" />
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center text-white">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 bg-white/10 shadow-2xl">
                {currentImagePreview ? (
                  <img src={currentImagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-white/80">AI</span>
                )}
              </div>
              <div className="mt-5 flex h-10 items-end gap-1.5">
                {[18, 28, 38, 24, 34, 44, 26, 36, 22, 30].map((height, index) => (
                  <span key={index} className="w-2 rounded-full bg-indigo-300" style={{ height }} />
                ))}
              </div>
              <p className="mt-4 max-w-full truncate text-sm font-bold text-white">{hasGenerationAudio ? currentAudioName : text.resultEmptyTitle}</p>
              <p className="mt-2 max-w-sm text-xs leading-5 text-white/65">{text.resultEmptyText}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <>
      <section className="w-full bg-[#F8FAFF] pb-6 pl-0 pr-2 md:pb-12 md:pl-0 md:pr-6">
        <div className="w-full max-w-full">
          <div
            data-talking-avatar-layout
            className="flex min-h-0 min-w-0 flex-col gap-4 p-2 md:h-[calc(100dvh-6rem)] md:max-h-[calc(100dvh-6rem)] md:min-h-[640px] md:flex-row md:items-stretch md:gap-3 md:pb-6 md:pl-3 md:pr-3 md:pt-3 xl:gap-4 xl:pl-4 xl:pr-4 2xl:gap-5 2xl:pl-5 2xl:pr-5"
          >
            <aside
              data-talking-avatar-controls-panel
              className="order-2 flex w-full flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8 md:order-none md:h-full md:w-[380px] xl:w-[400px] 2xl:w-[420px]"
            >
              <div className="space-y-4 p-2 md:min-h-0 md:flex-1 md:space-y-5 md:overflow-y-auto md:overscroll-contain md:p-6">
                <label className="block cursor-pointer rounded-2xl border border-dashed border-[#A5B4FC] bg-[#F8FAFF] p-4 transition hover:border-[#4F46E5]">
                  <input className="sr-only" type="file" accept="image/*" onChange={(event) => selectImage(event.target.files)} />
                  <span className="block text-sm font-extrabold text-slate-950">{text.imageTitle}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{text.imageHelper}</span>
                  {currentImagePreview ? (
                    <img src={currentImagePreview} alt="" className="mt-4 h-28 w-full rounded-xl object-cover" />
                  ) : (
                    <span className="mt-4 flex h-24 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-400">
                      Click to choose portrait
                    </span>
                  )}
                </label>

                <label className="block cursor-pointer rounded-2xl border border-dashed border-[#A5B4FC] bg-[#F8FAFF] p-4 transition hover:border-[#4F46E5]">
                  <input
                    className="sr-only"
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a,.ogg"
                    onChange={(event) => {
                      void selectAudio(event.target.files)
                      event.currentTarget.value = ''
                    }}
                  />
                  <span className="block text-sm font-extrabold text-slate-950">{text.audioTitle}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{text.audioHelper}</span>
                  <span className="mt-4 flex h-20 flex-col items-center justify-center rounded-xl bg-white px-3 text-center text-xs font-bold text-slate-500">
                    {audio?.file ? (
                      <>
                        <span className="max-w-full truncate text-slate-800">{audio.file.name}</span>
                        <span className="mt-1 text-slate-400">{(audio.file.size / 1024 / 1024).toFixed(1)}MB</span>
                      </>
                    ) : remoteAudioUrl ? (
                      <>
                        <span className="max-w-full truncate text-slate-800">{remoteAudioName}</span>
                        <span className="mt-1 text-slate-400">Restored from history</span>
                      </>
                    ) : (
                      'Click to choose audio'
                    )}
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">{text.promptLabel}</span>
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={4}
                    className="h-[7.5rem] w-full resize-none overflow-y-auto rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm leading-6 text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                    placeholder={text.promptPlaceholder}
                  />
                </label>

                <div>
                  <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">{text.resolutionLabel}</span>
                  <div role="group" aria-label={text.resolutionLabel} className="grid grid-cols-2 gap-2">
                    {(['480p', '720p'] as const).map((value) => {
                      const isSelected = resolution === value
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setResolution(value)}
                          className={`rounded-xl border px-4 py-2.5 text-sm font-extrabold transition ${
                            isSelected
                              ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
                              : 'border-[#E0E7FF] bg-white text-slate-500 hover:bg-[#F8FAFF] hover:text-slate-900'
                          }`}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div data-talking-avatar-action-bar className="flex-shrink-0 border-t border-[#E0E7FF] bg-white p-4 md:p-6">
                <button
                  type="button"
                  disabled={!canGenerate}
                  onClick={() => void handleGenerate()}
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 text-center text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:from-indigo-200 disabled:to-purple-200 disabled:shadow-none"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{isGenerating ? text.generatingLabel : text.generateLabel}</span>
                    {showGenerateCredits ? (
                      <span className="inline-flex items-center gap-1.5 px-1 text-sm font-extrabold text-white" aria-label={`${requiredCredits} credits`}>
                        <span className="tabular-nums">{requiredCredits}</span>
                        <img src="/credits-icons/diamond-3d-indigo.svg" alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
                      </span>
                    ) : null}
                  </span>
                </button>
              </div>
            </aside>

            <div data-talking-avatar-demo-panel className="order-1 flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:order-none md:h-full">
              {hasDesktopResultTabs ? renderDesktopResultTabs() : null}

              {rightMode !== 'history' ? (
                <div className="shrink-0 text-center md:px-4 md:pt-1 xl:pt-0">
                  {heroBreadcrumbItems?.length ? (
                    <Breadcrumb items={heroBreadcrumbItems} variant="inline" />
                  ) : null}
                  <h1
                    data-talking-avatar-hero-title
                    className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-950 xl:text-[32px]"
                    dangerouslySetInnerHTML={{ __html: heroTitleHtml }}
                  />
                  {heroDescription ? (
                    <p className="mx-auto mt-3 max-w-4xl text-base leading-7 text-slate-600 md:text-[17px] md:leading-7">
                      {heroDescription}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8">
                {rightMode === 'history' ? renderDesktopVideoResultFeed() : renderSamplePreview()}
              </div>

              {rightMode === 'history' ? (
                <div className="flex justify-end">
                  <Link href={historyPageHref} className="text-xs font-bold text-[#4F46E5] hover:text-[#3730A3]">
                    {text.viewAll}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {pendingAudioTrim ? (
        <div
          data-talking-avatar-audio-trim-modal
          className="fixed inset-0 z-[10040] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="talking-avatar-audio-trim-title"
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default rounded-none border-0 bg-transparent p-0"
            aria-label="Cancel audio upload"
            onClick={cancelAudioTrim}
          />
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.28)] ring-1 ring-indigo-100 sm:p-7">
            <button
              type="button"
              onClick={cancelAudioTrim}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-white text-slate-500 shadow-sm transition hover:border-violet-200 hover:text-indigo-700"
              aria-label="Cancel audio upload"
            >
              ×
            </button>
            <div className="pr-10">
              <h2 id="talking-avatar-audio-trim-title" className="text-xl font-extrabold tracking-tight text-slate-950">
                {text.audioTrimTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text.audioTrimMessage}</p>
            </div>

            <audio src={pendingAudioTrim.preview} controls className="mt-5 w-full" />

            <div className="mt-6 space-y-5 rounded-2xl border border-[#E0E7FF] bg-[#F8FAFF] p-4">
              <label className="block">
                <span className="flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  <span>{text.audioTrimStartLabel}</span>
                  <span>{formatAudioTime(audioTrimStartSeconds)}</span>
                </span>
                <input
                  data-talking-avatar-audio-trim-start
                  type="range"
                  min="0"
                  max={audioTrimMaxStartSeconds}
                  step="0.1"
                  value={audioTrimStartSeconds}
                  onChange={(event) => updateAudioTrimStart(event.target.value)}
                  className="mt-3 w-full accent-[#4F46E5]"
                />
              </label>

              <label className="block">
                <span className="flex items-center justify-between gap-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  <span>{text.audioTrimLengthLabel}</span>
                  <span>{formatAudioTime(audioTrimClipSeconds)}</span>
                </span>
                <input
                  data-talking-avatar-audio-trim-length
                  type="range"
                  min={MIN_REFERENCE_AUDIO_SECONDS}
                  max={audioTrimMaxClipSeconds}
                  step="0.1"
                  value={audioTrimClipSeconds}
                  onChange={(event) => updateAudioTrimClipSeconds(event.target.value)}
                  className="mt-3 w-full accent-[#4F46E5]"
                />
              </label>

              <p className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-[#E0E7FF]">
                {text.audioTrimRangeLabel}: {formatAudioTime(audioTrimStartSeconds)} - {formatAudioTime(audioTrimEndSeconds)}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void confirmAudioTrim()}
                disabled={isTrimmingAudio}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#9333EA] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl disabled:cursor-wait disabled:opacity-70"
              >
                {text.audioTrimConfirmAction}
              </button>
              <button
                type="button"
                onClick={cancelAudioTrim}
                disabled={isTrimmingAudio}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-indigo-100 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-indigo-50 disabled:cursor-wait disabled:opacity-70"
              >
                {text.audioTrimCancelAction}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {previewImage ? (
        <div
          data-talking-avatar-image-preview-modal
          className="fixed inset-0 z-[10050] flex cursor-pointer items-center justify-center overflow-hidden bg-slate-950/80 p-2 backdrop-blur-sm md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Reference image preview"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative" onClick={(event) => event.stopPropagation()}>
            <img
              src={previewImage}
              alt="Reference image preview"
              className="h-auto max-h-[calc(100vh-16px)] w-auto max-w-[calc(100vw-16px)] cursor-default rounded-lg object-contain md:max-h-[calc(100vh-48px)] md:max-w-[calc(100vw-48px)]"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg transition-colors hover:bg-white hover:text-slate-900 md:right-6 md:top-6"
              aria-label="Close image preview"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      {previewAudio ? (
        <div
          data-talking-avatar-audio-preview-modal
          className="fixed inset-0 z-[10040] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="talking-avatar-audio-preview-title"
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default rounded-none border-0 bg-transparent p-0"
            aria-label="Close audio preview"
            onClick={() => setPreviewAudio(null)}
          />
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.28)] ring-1 ring-indigo-100 sm:p-7">
            <button
              type="button"
              onClick={() => setPreviewAudio(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-white text-slate-500 shadow-sm transition hover:border-violet-200 hover:text-indigo-700"
              aria-label="Close audio preview"
            >
              ×
            </button>
            <div className="flex items-center gap-4 pr-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#4F46E5] ring-1 ring-[#C7D2FE]">
                <span aria-hidden="true" className="flex h-9 items-end gap-1">
                  {[16, 28, 36, 22, 30].map((height, index) => (
                    <span key={`${height}-${index}`} className="w-1.5 rounded-full bg-current" style={{ height }} />
                  ))}
                </span>
              </div>
              <div className="min-w-0">
                <h2 id="talking-avatar-audio-preview-title" className="text-lg font-extrabold text-slate-950">
                  {DEFAULT_REFERENCE_AUDIO_NAME}
                </h2>
                <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                  {previewAudio.name || DEFAULT_REFERENCE_AUDIO_NAME}
                </p>
              </div>
            </div>
            <audio controls src={previewAudio.url} className="mt-6 w-full" />
          </div>
        </div>
      ) : null}

      {creditExhaustedModalOpen ? (
        <div
          className="fixed inset-0 z-[10040] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="talking-avatar-credit-title"
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default rounded-none border-0 bg-transparent p-0"
            aria-label="Close credits dialog"
            onClick={() => setCreditExhaustedModalOpen(false)}
          />
          <div className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] bg-[#fbfaff] p-[1px] shadow-[0_28px_80px_rgba(99,102,241,0.28)]">
            <div className="relative rounded-[27px] bg-[#fbfaff] px-5 pb-5 pt-6 text-left sm:px-7 sm:pb-7 sm:pt-8">
              <button
                type="button"
                onClick={() => setCreditExhaustedModalOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-white/90 text-slate-500 shadow-sm transition hover:border-violet-200 hover:text-indigo-700"
                aria-label="Close credits dialog"
              >
                ×
              </button>
              <h2 id="talking-avatar-credit-title" className="pr-10 text-[28px] font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-3xl">
                {text.creditsUsedUpTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text.creditsUsedUpMessage}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={creditsPageHref}
                  onClick={() => setCreditExhaustedModalOpen(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#9333EA] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl"
                >
                  {text.addCredits}
                </Link>
                <button
                  type="button"
                  onClick={() => setCreditExhaustedModalOpen(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-indigo-100 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-indigo-50"
                >
                  {text.maybeLater}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
