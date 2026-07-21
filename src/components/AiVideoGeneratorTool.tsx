'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AI_VIDEO_GENERATOR_MODEL_GROUPS,
  AI_VIDEO_GENERATOR_MODE_OPTIONS,
  type AiVideoGeneratorModeId,
  type AiVideoGeneratorModelConfig,
  type AiVideoGeneratorModelId,
  getAiVideoGeneratorModelGroupId,
  getAiVideoGeneratorModelMinimumCredits,
  getAiVideoGeneratorModelConfig,
} from '@/lib/ai-video-generator-config'
import { getImageUploadUrl } from '@/lib/upload-url'
import { calculateVideoGenerationCredits } from '@/lib/generation-credits'
import { useCommonTranslations } from '@/lib/use-common-translations'
import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb'
import DeleteIcon from '@/components/icons/DeleteIcon'
import ReferenceImageUploader from '@/components/ReferenceImageUploader'
import { formatLocalTimestampToSeconds } from '@/lib/credit-history-time'
import {
  getHistoryToolMetadata,
  getLocalizedInternalPath,
} from '@/lib/generation-history-tool-metadata'
import { trackGenerationHistoryRecreateClick } from '@/lib/generation-history-analytics'
import { dispatchToolazeTopNotice } from '@/lib/top-notice'

interface ImageItem {
  file: File
  preview: string
}

type VideoGenerationStatus = 'processing' | 'succeeded' | 'failed'
type RightPanelMode = 'sample' | 'history'

interface VideoGenerationRequest {
  id: string
  modelId: AiVideoGeneratorModelId
  modelName: string
  mode: AiVideoGeneratorModeId
  prompt: string
  aspectRatio: string
  duration: number
  resolution: string
  nativeAudio: boolean
  inputPreview: string
  inputUrls: string[]
  createdAt: string
  startedAt: number
  status: VideoGenerationStatus
  taskId?: string
  videoUrl?: string
  error?: string
}

interface VideoHistoryItem {
  id: string
  modelId: AiVideoGeneratorModelId
  modelName: string
  mode: AiVideoGeneratorModeId
  prompt: string
  aspectRatio: string
  duration: number
  resolution: string
  nativeAudio: boolean
  inputPreview: string
  inputUrls: string[]
  outputPreview: string
  time: string
  persisted: boolean
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
}

interface PersistedVideoHistoryItem {
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

interface AiVideoGeneratorToolProps {
  modelId?: AiVideoGeneratorModelId
  defaultMode?: AiVideoGeneratorModeId
  allowModelSelect?: boolean
  heroBreadcrumbItems?: BreadcrumbItem[]
  heroTitleHtml?: string
  heroDescription?: string
  demoVideo?: {
    src?: string
    ariaLabel?: string
  }
  initialTranslations?: any
}

interface PromptInsertEventDetail {
  prompt?: string
}

const FALLBACK_TEXT = {
  imageToVideo: 'Image to Video',
  textToVideo: 'Text to Video',
  models: 'Models',
  uploadUpTo: 'Upload up to {count} images',
  uploadYourImage: 'Upload your image',
  upload: 'Upload',
  fileLimit: 'JPG, PNG, WEBP up to {size}MB each',
  fileTooLarge: 'File {name} exceeds {size}MB limit',
  clear: 'Clear',
  delete: 'Delete',
  replace: 'Replace',
  prompt: 'Prompt',
  promptPlaceholder: 'Describe the scene, motion, camera movement, and style.',
  aspectRatio: 'Aspect Ratio',
  duration: 'Duration',
  resolution: 'Resolution',
  nativeAudio: 'Native Audio',
  nativeAudioHint: 'Generate the video with native audio when supported.',
  generate: 'Generate Video',
  generating: 'Generating video...',
  generatingSeconds: 'Generating video... {seconds}s',
  demo: 'Demo',
  samplePreview: 'Sample Preview',
  previewHint: 'Upload a reference image or write a prompt to generate a video.',
  motionCue: 'Motion',
  cameraCue: 'Camera',
  audioCue: 'Audio',
  history: 'History',
  viewAll: 'View All',
  noHistory: 'No video requests yet.',
  resultReady: 'Video ready',
  recreate: 'Recreate',
  copyPrompt: 'Copy Prompt',
  referenceImage: 'Reference Image',
  uploadRequestFailed: 'Image upload request failed. Please try again.',
  uploadFailedWithStatus: 'Image upload failed with status {status}.',
  serverNonJson: 'The server returned an unreadable response.',
  checkStatusFailed: 'Status check failed with status {status}.',
  generationTimeout: 'Video generation timed out. Please try again.',
  videoGenerationFailed: 'Video generation failed.',
  download: 'Download',
  resultExpires: 'Generated video links may expire. Download the result if you need to keep it.',
}

const VIDEO_HISTORY_MODEL_SLUGS: Record<AiVideoGeneratorModelId, string> = {
  'grok-1-5-video': 'grok-imagine-video-1-5',
  'seedance-2': 'seedance-2',
  'seedance-2-mini': 'seedance-2-mini',
  'kling-3': 'kling-3',
}

function getVideoHistoryModelSlug(modelId: AiVideoGeneratorModelId) {
  return VIDEO_HISTORY_MODEL_SLUGS[modelId] || modelId
}

function getVideoModelIdFromHistoryModel(model: unknown): AiVideoGeneratorModelId {
  const normalized = String(model || '').trim()
  const match = Object.entries(VIDEO_HISTORY_MODEL_SLUGS).find(([, slug]) => slug === normalized)
  if (match) return match[0] as AiVideoGeneratorModelId
  if (normalized === 'grok-1-5-video' || normalized === 'seedance-2' || normalized === 'seedance-2-mini' || normalized === 'kling-3') {
    return normalized
  }
  return 'grok-1-5-video'
}

function getHistoryDuration(outputFormat: string | null | undefined, fallback: number) {
  const duration = Number(String(outputFormat || '').replace(/s$/i, ''))
  return Number.isFinite(duration) && duration > 0 ? duration : fallback
}

function getPersistedHistoryCreatedAtMs(item: PersistedVideoHistoryItem): number {
  const createdAtMs = Date.parse(item.createdAt || '')
  return Number.isFinite(createdAtMs) ? createdAtMs : 0
}

function sortPersistedVideoHistoryItemsNewestFirst(items: PersistedVideoHistoryItem[]): PersistedVideoHistoryItem[] {
  return [...items].sort((a, b) => getPersistedHistoryCreatedAtMs(b) - getPersistedHistoryCreatedAtMs(a))
}

function mapPersistedVideoHistoryItem(item: PersistedVideoHistoryItem): VideoHistoryItem | null {
  if (item.mediaType !== 'video') return null

  const id = String(item.id || '').trim()
  const outputPreview = String(item.outputUrl || '').trim()
  const prompt = String(item.prompt || '').trim()
  if (!id || !outputPreview || !prompt) return null

  const modelId = getVideoModelIdFromHistoryModel(item.model)
  const modelConfig = getAiVideoGeneratorModelConfig(modelId)
  const inputUrls = Array.isArray(item.inputUrls)
    ? item.inputUrls.filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
    : []

  return {
    id,
    modelId,
    modelName: modelConfig.name,
    mode: inputUrls.length > 0 ? 'image-to-video' : 'text-to-video',
    prompt,
    aspectRatio: item.aspectRatio || modelConfig.aspectRatios[0]?.value || '16:9',
    duration: getHistoryDuration(item.outputFormat, modelConfig.defaultDuration || modelConfig.durations[0] || 5),
    resolution: item.resolution || modelConfig.resolutions[0] || '480p',
    nativeAudio: item.nativeAudio === true,
    inputPreview: inputUrls[0] || '',
    inputUrls,
    outputPreview,
    time: formatLocalTimestampToSeconds(item.createdAt || new Date().toISOString()),
    persisted: true,
    toolSlug: item.toolSlug || null,
    toolLabel: item.toolLabel || null,
    sourcePath: item.sourcePath || null,
  }
}

function formatText(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((next, [key, value]) => next.replace(`{${key}}`, String(value)), template)
}

function getModeLabel(mode: AiVideoGeneratorModeId, text: typeof FALLBACK_TEXT) {
  return mode === 'image-to-video' ? text.imageToVideo : text.textToVideo
}

function getInitialVideoMode(
  modelConfig: AiVideoGeneratorModelConfig,
  defaultMode?: AiVideoGeneratorModeId,
) {
  return defaultMode || modelConfig.defaultMode
}

async function parseJsonSafely(response: Response, errorMessage: string): Promise<Record<string, any>> {
  const body = await response.text()
  if (!body) return {}
  try {
    return JSON.parse(body) as Record<string, any>
  } catch {
    throw new Error(errorMessage)
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getOptionButtonClassName(isSelected: boolean) {
  return `min-h-10 rounded-xl border px-2 py-2 text-center text-xs font-bold transition-all ${
    isSelected
      ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
      : 'border-[#E0E7FF] bg-white text-slate-600 hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
  }`
}

function getVideoModelOptionMetadata(option: AiVideoGeneratorModelConfig) {
  const firstDuration = option.durations[0]
  const lastDuration = option.durations[option.durations.length - 1]
  const minimumCredits = getAiVideoGeneratorModelMinimumCredits(option)
  return [
    { label: `${minimumCredits}+`, iconSrc: '/credits-icons/diamond-3d-indigo.svg', ariaLabel: `${minimumCredits}+ credits` },
    { label: `${firstDuration}-${lastDuration}s` },
    { label: option.resolutions.join('/') },
  ]
}

function VideoModelQualityRating({ value }: { value: number }) {
  return (
    <span
      className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold leading-none text-slate-400"
      aria-label={`Quality ${value} out of 5`}
    >
      <span>Quality</span>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.max(0, Math.min(1, value - index))
          return (
            <span key={index} className="relative inline-flex h-3.5 w-3.5 overflow-hidden text-slate-300">
              <span className="absolute inset-0">★</span>
              <span className="absolute inset-0 overflow-hidden text-amber-400" style={{ width: `${fill * 100}%` }}>
                ★
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}

export default function AiVideoGeneratorTool({
  modelId = 'grok-1-5-video',
  defaultMode,
  allowModelSelect = true,
  heroBreadcrumbItems,
  heroTitleHtml,
  heroDescription,
  demoVideo,
  initialTranslations,
}: AiVideoGeneratorToolProps) {
  const pathname = usePathname()
  const commonTranslations = useCommonTranslations(initialTranslations)
  const text = { ...FALLBACK_TEXT, ...(commonTranslations?.common?.aiVideoGeneratorTool || {}) }
  const imageFilesRef = useRef<ImageItem[]>([])
  const modelSelectorRef = useRef<HTMLDivElement>(null)
  const durationSelectorRef = useRef<HTMLDivElement>(null)
  const durationButtonRef = useRef<HTMLButtonElement>(null)
  const durationMenuRef = useRef<HTMLDivElement>(null)
  const historyItemRefs = useRef(new Map<string, HTMLDivElement>())
  const isApplyingHistoryItemRef = useRef(false)
  const modelGroups = AI_VIDEO_GENERATOR_MODEL_GROUPS
  const modelOptions = useMemo(() => modelGroups.flatMap((group) => group.models), [modelGroups])
  const [selectedModelId, setSelectedModelId] = useState<AiVideoGeneratorModelId>(modelId)
  const modelConfig = useMemo(() => getAiVideoGeneratorModelConfig(selectedModelId), [selectedModelId])
  const selectedModelOption = modelOptions.find((option) => option.id === selectedModelId) || modelConfig
  const selectedModelGroup = modelGroups.find((group) => group.models.some((model) => model.id === selectedModelId)) || modelGroups[0]
  const [activeMode, setActiveMode] = useState<AiVideoGeneratorModeId>(() => getInitialVideoMode(modelConfig, defaultMode))
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const [isDurationMenuOpen, setIsDurationMenuOpen] = useState(false)
  const [activeModelGroupId, setActiveModelGroupId] = useState(() => getAiVideoGeneratorModelGroupId(modelId))
  const activeModelGroup = modelGroups.find((group) => group.id === activeModelGroupId) || modelGroups[0]
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([])
  const [remoteImageUrls, setRemoteImageUrls] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState(modelConfig.aspectRatios[0]?.value || '16:9')
  const [duration, setDuration] = useState(modelConfig.defaultDuration || modelConfig.durations[0] || 5)
  const [resolution, setResolution] = useState(modelConfig.resolutions[0] || '1080p')
  const [nativeAudio, setNativeAudio] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<VideoGenerationRequest | null>(null)
  const [generatingSeconds, setGeneratingSeconds] = useState(0)
  const [history, setHistory] = useState<VideoHistoryItem[]>([])
  const [activeSettingsHistoryItemId, setActiveSettingsHistoryItemId] = useState<string | null>(null)
  const [rightMode, setRightMode] = useState<RightPanelMode>('sample')
  const [durationMenuRect, setDurationMenuRect] = useState<{ left: number; top: number; width: number } | null>(null)
  const shouldAllowLeftOverlay = isModelMenuOpen
  const supportsNativeAudio = Boolean(modelConfig.supportsNativeAudio)
  const minimumCreditCost = useMemo(() => getAiVideoGeneratorModelMinimumCredits(modelConfig), [modelConfig])
  const generationCreditCost = useMemo(
    () => calculateVideoGenerationCredits(selectedModelId, resolution, duration, {
      nativeAudio: supportsNativeAudio && nativeAudio,
    }) ?? minimumCreditCost,
    [selectedModelId, resolution, duration, supportsNativeAudio, nativeAudio, minimumCreditCost],
  )

  const updateDurationMenuRect = useCallback(() => {
    const rect = durationButtonRef.current?.getBoundingClientRect()
    if (!rect) {
      setDurationMenuRect(null)
      return
    }

    setDurationMenuRect({ left: rect.left, top: rect.top, width: rect.width })
  }, [])

  const toggleDurationMenu = () => {
    setIsModelMenuOpen(false)
    if (isDurationMenuOpen) {
      setIsDurationMenuOpen(false)
      return
    }

    updateDurationMenuRect()
    setIsDurationMenuOpen(true)
  }

  useEffect(() => {
    imageFilesRef.current = imageFiles
  }, [imageFiles])

  useEffect(() => {
    return () => {
      imageFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
    }
  }, [])

  useEffect(() => {
    setSelectedModelId(modelId)
    setActiveModelGroupId(getAiVideoGeneratorModelGroupId(modelId))
  }, [modelId])

  useEffect(() => {
    if (!isModelMenuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!modelSelectorRef.current?.contains(event.target as Node)) {
        setIsModelMenuOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModelMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModelMenuOpen])

  useEffect(() => {
    if (!isDurationMenuOpen) {
      setDurationMenuRect(null)
      return
    }

    updateDurationMenuRect()

    const handlePointerDown = (event: MouseEvent) => {
      if (
        !durationSelectorRef.current?.contains(event.target as Node) &&
        !durationMenuRef.current?.contains(event.target as Node)
      ) {
        setIsDurationMenuOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDurationMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', updateDurationMenuRect)
    window.addEventListener('scroll', updateDurationMenuRect, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', updateDurationMenuRect)
      window.removeEventListener('scroll', updateDurationMenuRect, true)
    }
  }, [isDurationMenuOpen, updateDurationMenuRect])

  useEffect(() => {
    if (isApplyingHistoryItemRef.current) {
      isApplyingHistoryItemRef.current = false
      setIsDurationMenuOpen(false)
      return
    }

    setActiveMode(getInitialVideoMode(modelConfig, defaultMode))
    setAspectRatio(modelConfig.aspectRatios[0]?.value || '16:9')
    setDuration(modelConfig.defaultDuration || modelConfig.durations[0] || 5)
    setResolution(modelConfig.resolutions[0] || '1080p')
    setNativeAudio(false)
    setIsDurationMenuOpen(false)
    setImageFiles((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.preview))
      return []
    })
    setRemoteImageUrls([])
  }, [defaultMode, modelConfig])

  useEffect(() => {
    if (!supportsNativeAudio && nativeAudio) {
      setNativeAudio(false)
    }
  }, [supportsNativeAudio, nativeAudio])

  useEffect(() => {
    if (activeMode !== 'text-to-video') return
    imageFiles.forEach((item) => URL.revokeObjectURL(item.preview))
    setImageFiles([])
    setRemoteImageUrls([])
  }, [activeMode])

  // 从提示词案例板块一键带入 Prompt，保持与图片生成器相同的使用路径。
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<PromptInsertEventDetail>).detail
      const promptText = String(detail?.prompt || '').trim()
      if (!promptText) return

      setPrompt(promptText)
      setActiveMode('text-to-video')
      setIsModelMenuOpen(false)
      setIsDurationMenuOpen(false)
      imageFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
      imageFilesRef.current = []
      setImageFiles([])
      setRemoteImageUrls([])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('toolaze:use-prompt', handler as EventListener)
    return () => window.removeEventListener('toolaze:use-prompt', handler as EventListener)
  }, [])

  useEffect(() => {
    if (currentRequest?.status !== 'processing') return

    const interval = window.setInterval(() => {
      setGeneratingSeconds((seconds) => seconds + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [currentRequest?.id, currentRequest?.status])

  useEffect(() => {
    let cancelled = false

    const loadInlineHistory = async () => {
      try {
        const response = await fetch('/api/history?limit=20', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (!response.ok) return
        const data: { items?: PersistedVideoHistoryItem[] } = await response.json().catch(() => ({ items: [] }))
        const loadedHistory = Array.isArray(data.items)
          ? sortPersistedVideoHistoryItemsNewestFirst(data.items)
            .map(mapPersistedVideoHistoryItem)
            .filter((item: VideoHistoryItem | null): item is VideoHistoryItem => Boolean(item))
          : []
        if (cancelled || loadedHistory.length === 0) return
        setHistory(loadedHistory)
      } catch {
        // Inline history is optional; the full History page remains the source of truth.
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

  const referenceImageCount = remoteImageUrls.length + imageFiles.length
  const canGenerate = prompt.trim().length > 0 && (activeMode === 'text-to-video' || referenceImageCount > 0)
  const historyPageHref = getLocalizedInternalPath(pathname, '/history')
  const isGenerating = currentRequest?.status === 'processing'
  const hasDesktopResultTabs = isGenerating || currentRequest?.status === 'failed' || history.length > 0

  const showFileTooLargeNotice = (file: File) => {
    dispatchToolazeTopNotice({
      type: 'warning',
      title: 'Warning',
      message: formatText(text.fileTooLarge, { name: file.name, size: modelConfig.maxFileSizeMb }),
    })
  }

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.isArray(files) ? files : Array.from(files)
    const remainingSlots = modelConfig.maxImages - referenceImageCount
    if (remainingSlots <= 0) return

    const maxSize = modelConfig.maxFileSizeMb * 1024 * 1024
    const validFiles = list
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remainingSlots)
      .filter((file) => {
        if (file.size <= maxSize) return true
        showFileTooLargeNotice(file)
        return false
      })

    if (validFiles.length === 0) return

    setRemoteImageUrls([])
    setImageFiles((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ])
  }

  const replaceImageWithFile = (index: number, file: File) => {
    setImageFiles((prev) => {
      const nextFiles = [...prev]
      if (!nextFiles[index]) return prev
      URL.revokeObjectURL(nextFiles[index].preview)
      nextFiles[index] = {
        file,
        preview: URL.createObjectURL(file),
      }
      return nextFiles
    })
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => {
      const nextFiles = [...prev]
      if (!nextFiles[index]) return prev
      URL.revokeObjectURL(nextFiles[index].preview)
      nextFiles.splice(index, 1)
      return nextFiles
    })
  }

  const handleModelChange = (nextModelId: AiVideoGeneratorModelId) => {
    if (nextModelId === selectedModelId) {
      setIsModelMenuOpen(false)
      return
    }
    setSelectedModelId(nextModelId)
    setActiveModelGroupId(getAiVideoGeneratorModelGroupId(nextModelId))
    setIsModelMenuOpen(false)
  }

  const renderModelGroupMark = (group: typeof modelGroups[number]) => (
    <img
      src={group.logoSrc}
      alt={group.logoAlt}
      className="h-5 w-5 shrink-0 rounded-md object-contain"
      loading="lazy"
    />
  )

  const renderModelOptionButton = (option: typeof modelOptions[number], _group: typeof modelGroups[number]) => {
    const isSelectedModel = option.id === selectedModelId
    const metadata = getVideoModelOptionMetadata(option)

    return (
      <button
        key={option.id}
        type="button"
        onClick={() => handleModelChange(option.id)}
        className={`!flex w-full flex-col items-stretch gap-0 !rounded-xl !px-3 !py-3 text-left transition-colors duration-150 !whitespace-normal ${
          isSelectedModel
            ? 'bg-[#DBEAFE] text-slate-950'
            : 'bg-white text-slate-700 hover:bg-[#F8FAFF]'
        }`}
        aria-selected={isSelectedModel}
      >
        <span className="flex min-w-0 items-start justify-between gap-3">
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 items-center gap-2">
              <img
                src={option.logoSrc}
                alt={option.logoAlt}
                className="h-5 w-5 shrink-0 rounded-md object-contain"
                loading="lazy"
              />
              <span className="truncate text-sm font-extrabold">{option.name}</span>
              {option.badge && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white ${
                  option.badge === 'Hot' ? 'bg-red-500' : 'bg-emerald-500'
                }`}>
                  {option.badge}
                </span>
              )}
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-500 break-words">{option.description}</span>
            <VideoModelQualityRating value={option.qualityRating} />
            <span className="mt-2 flex flex-wrap gap-1.5">
              {metadata.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white/80 px-2 py-1 text-[11px] font-semibold leading-none text-slate-600" aria-label={item.ariaLabel}>
                  {item.iconSrc ? (
                    <img
                      src={item.iconSrc}
                      alt=""
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                      loading="lazy"
                    />
                  ) : null}
                  <span>{item.label}</span>
                </span>
              ))}
            </span>
          </span>
          {isSelectedModel && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-[#4F46E5]">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      </button>
    )
  }


  const uploadImages = async () => {
    if (activeMode !== 'image-to-video') return []

    const imageUrls: string[] = [...remoteImageUrls]
    const uploadUrl = getImageUploadUrl()

    for (const imageItem of imageFiles) {
      const uploadForm = new FormData()
      uploadForm.append('image', imageItem.file)

      let uploadResponse: Response
      try {
        uploadResponse = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
      } catch {
        throw new Error(text.uploadRequestFailed)
      }

      const uploadResult = await parseJsonSafely(uploadResponse, text.serverNonJson)
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || formatText(text.uploadFailedWithStatus, { status: uploadResponse.status }))
      }

      const url = String(uploadResult.url || '').trim()
      if (!url) {
        throw new Error(text.uploadRequestFailed)
      }

      imageUrls.push(url)
    }

    return imageUrls
  }

  const addHistoryItemToFeed = (item: VideoHistoryItem) => {
    setHistory((prev) => [item, ...prev.filter((historyItem) => historyItem.id !== item.id)].slice(0, 20))
  }

  const persistGeneratedVideoHistoryItem = async (
    request: VideoGenerationRequest,
    videoUrl: string,
    inputUrls: string[],
    historyTool: ReturnType<typeof getHistoryToolMetadata>,
  ) => {
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mediaType: 'video',
          model: getVideoHistoryModelSlug(request.modelId),
          prompt: request.prompt,
          outputUrl: videoUrl,
          inputUrls,
          aspectRatio: request.aspectRatio,
          resolution: request.resolution,
          outputFormat: `${request.duration}s`,
          nativeAudio: request.nativeAudio,
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

  const pollVideoStatus = async (taskId: string) => {
    const maxAttempts = 60
    const pollInterval = 5000

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const statusResponse = await fetch('/api/ai-video-generator/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      })

      const statusResult = await parseJsonSafely(statusResponse, text.serverNonJson)
      if (!statusResponse.ok) {
        throw new Error(statusResult.error || formatText(text.checkStatusFailed, { status: statusResponse.status }))
      }

      if (statusResult.status === 'SUCCEEDED' && statusResult.videoUrl) {
        return String(statusResult.videoUrl)
      }
      if (statusResult.status === 'FAILED') {
        throw new Error(statusResult.message || text.videoGenerationFailed)
      }

      await wait(pollInterval)
    }

    throw new Error(text.generationTimeout)
  }

  const renderDurationMenu = () => {
    if (!isDurationMenuOpen || !durationMenuRect || typeof document === 'undefined') return null

    return createPortal(
      <div
        ref={durationMenuRef}
        data-video-duration-menu
        className="fixed z-[9999] max-h-44 overflow-y-auto rounded-2xl border border-[#E0E7FF] bg-white p-2 shadow-xl shadow-[#4F46E5]/12"
        style={{
          left: durationMenuRect.left,
          top: durationMenuRect.top,
          width: durationMenuRect.width,
          transform: 'translateY(calc(-100% - 0.5rem))',
        }}
        role="listbox"
      >
        {modelConfig.durations.map((value) => {
          const isSelected = duration === value
          return (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                setDuration(value)
                setIsDurationMenuOpen(false)
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors ${
                isSelected
                  ? 'bg-[#E0E7FF] text-[#3730A3]'
                  : 'text-slate-600 hover:bg-[#F8FAFF] hover:text-slate-900'
              }`}
            >
              <span>{value}s</span>
              {isSelected ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#4F46E5]">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : null}
            </button>
          )
        })}
      </div>,
      document.body,
    )
  }

  const handleGenerate = async () => {
    if (!canGenerate) return
    setIsPreparing(true)
    setGeneratingSeconds(0)

    const startedAt = Date.now()
    const requestHistoryTool = getHistoryToolMetadata(pathname, modelConfig.name, getVideoHistoryModelSlug(selectedModelId))
    const request: VideoGenerationRequest = {
      id: `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      modelId: selectedModelId,
      modelName: modelConfig.name,
      mode: activeMode,
      prompt: prompt.trim(),
      aspectRatio,
      duration,
      resolution,
      nativeAudio: supportsNativeAudio && nativeAudio,
      inputPreview: remoteImageUrls[0] || imageFiles[0]?.preview || '',
      inputUrls: remoteImageUrls,
      createdAt: formatLocalTimestampToSeconds(new Date(startedAt).toISOString()),
      startedAt,
      status: 'processing',
    }

    setCurrentRequest(request)
    setRightMode('history')

    try {
      const imageUrls = await uploadImages()
      setCurrentRequest((current) => current?.id === request.id ? { ...current, inputUrls: imageUrls } : current)
      const formData = new FormData()
      formData.append('mode', activeMode)
      formData.append('model', selectedModelId)
      formData.append('prompt', prompt.trim())
      formData.append('aspectRatio', aspectRatio)
      formData.append('duration', String(duration))
      formData.append('resolution', resolution)
      if (supportsNativeAudio) {
        formData.append('nativeAudio', String(nativeAudio))
      }
      if (imageUrls.length > 0) {
        formData.append('imageUrls', JSON.stringify(imageUrls))
      }

      const createResponse = await fetch('/api/ai-video-generator', {
        method: 'POST',
        body: formData,
      })
      const createResult = await parseJsonSafely(createResponse, text.serverNonJson)
      if (!createResponse.ok) {
        throw new Error(createResult.error || text.videoGenerationFailed)
      }

      let videoUrl = String(createResult.videoUrl || '').trim()
      const taskId = String(createResult.taskId || '').trim()
      if (!videoUrl && taskId) {
        videoUrl = await pollVideoStatus(taskId)
      }
      if (!videoUrl) {
        throw new Error(text.videoGenerationFailed)
      }

      const completedRequest: VideoGenerationRequest = {
        ...request,
        status: 'succeeded',
        taskId: taskId || undefined,
        videoUrl,
        inputUrls: imageUrls,
        inputPreview: imageUrls[0] || request.inputPreview,
      }
      const savedItem = await persistGeneratedVideoHistoryItem(completedRequest, videoUrl, imageUrls, requestHistoryTool)
      const historyItem: VideoHistoryItem = {
        id: savedItem?.id || completedRequest.id,
        modelId: completedRequest.modelId,
        modelName: completedRequest.modelName,
        mode: completedRequest.mode,
        prompt: completedRequest.prompt,
        aspectRatio: completedRequest.aspectRatio,
        duration: completedRequest.duration,
        resolution: completedRequest.resolution,
        nativeAudio: completedRequest.nativeAudio,
        inputPreview: completedRequest.inputPreview,
        inputUrls: imageUrls,
        outputPreview: videoUrl,
        time: formatLocalTimestampToSeconds(savedItem?.createdAt || new Date().toISOString()),
        persisted: Boolean(savedItem?.id),
        toolSlug: savedItem?.toolSlug || null,
        toolLabel: savedItem?.toolLabel || null,
        sourcePath: savedItem?.sourcePath || null,
      }

      setCurrentRequest(completedRequest)
      addHistoryItemToFeed(historyItem)
      setRightMode('history')
    } catch (error) {
      setCurrentRequest({
        ...request,
        status: 'failed',
        error: error instanceof Error ? error.message : text.videoGenerationFailed,
      })
    } finally {
      setIsPreparing(false)
    }
  }

  const copyPromptToClipboard = async (promptText: string) => {
    await navigator.clipboard?.writeText(promptText).catch(() => {})
  }

  const setHistoryItemRef = (itemId: string, node: HTMLDivElement | null) => {
    if (node) {
      historyItemRefs.current.set(itemId, node)
      return
    }
    historyItemRefs.current.delete(itemId)
  }

  const applyHistoryItemToForm = (item: VideoHistoryItem) => {
    trackGenerationHistoryRecreateClick({ ...item, mediaType: 'video' }, { surface: 'inline_generator_history' })

    const itemConfig = getAiVideoGeneratorModelConfig(item.modelId)
    if (item.modelId !== selectedModelId) {
      isApplyingHistoryItemRef.current = true
    }
    setSelectedModelId(item.modelId)
    setActiveModelGroupId(getAiVideoGeneratorModelGroupId(item.modelId))
    setActiveMode(item.inputUrls.length > 0 ? 'image-to-video' : item.mode)
    setPrompt(item.prompt)
    setAspectRatio(item.aspectRatio || itemConfig.aspectRatios[0]?.value || '16:9')
    setDuration(item.duration || itemConfig.defaultDuration || itemConfig.durations[0] || 5)
    setResolution(item.resolution || itemConfig.resolutions[0] || '480p')
    setNativeAudio(Boolean(itemConfig.supportsNativeAudio && item.nativeAudio))
    setRemoteImageUrls(item.inputUrls.slice(0, itemConfig.maxImages))
    setImageFiles((prev) => {
      prev.forEach((image) => URL.revokeObjectURL(image.preview))
      return []
    })
    setActiveSettingsHistoryItemId(item.id)
    historyItemRefs.current.get(item.id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const removeHistoryItemFromState = (itemId: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleDeleteHistoryItem = async (item: VideoHistoryItem) => {
    if (!window.confirm('Delete this history item?')) return
    if (item.persisted) {
      const response = await fetch(`/api/history?id=${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) return
    }
    removeHistoryItemFromState(item.id)
  }

  const renderVideoMetaTags = (item: {
    modelName: string
    mode: AiVideoGeneratorModeId
    aspectRatio: string
    duration: number
    resolution: string
  }, timeLabel: string) => (
    <div data-desktop-history-meta className="flex flex-wrap items-center gap-1">
      {[
        item.modelName,
        getModeLabel(item.mode, text),
        item.aspectRatio,
        `${item.duration}s`,
        item.resolution,
        timeLabel,
      ].filter(Boolean).map((tag, index) => (
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
    <p className="line-clamp-4 text-sm leading-6 text-slate-600">
      {promptText}
    </p>
  )

  const renderDesktopPendingVideoItem = (item: VideoGenerationRequest) => (
    <div
      key={item.id}
      data-video-result-item
      className="grid gap-4 border-b border-[#E0E7FF] pb-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
    >
      <div
        data-video-generating-panel
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
        {renderVideoMetaTags(item, item.createdAt)}
        <div>
          <p className="mb-2 text-sm font-extrabold text-slate-900">{text.prompt}</p>
          {renderPromptPreview(item.prompt)}
        </div>
        {item.inputPreview && (
          <img
            src={item.inputPreview}
            alt={text.referenceImage}
            className="h-14 w-14 rounded-lg object-cover ring-1 ring-[#E0E7FF]"
          />
        )}
      </div>
    </div>
  )

  const renderDesktopFailedVideoItem = (item: VideoGenerationRequest) => (
    <div
      key={item.id}
      data-video-result-item
      className="grid gap-4 rounded-2xl border-b border-[#E0E7FF] pb-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
    >
      <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-red-100 bg-red-50/70 p-5 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 ring-1 ring-red-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-extrabold text-red-700">{text.videoGenerationFailed}</p>
          <p className="text-xs leading-5 text-red-600">{item.error || text.videoGenerationFailed}</p>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        {renderVideoMetaTags(item, item.createdAt)}
        <div>
          <p className="mb-2 text-sm font-extrabold text-slate-900">{text.prompt}</p>
          {renderPromptPreview(item.prompt)}
        </div>
      </div>
    </div>
  )

  const renderDesktopVideoHistoryItem = (item: VideoHistoryItem) => (
    <div
      key={item.id}
      ref={(node) => setHistoryItemRef(item.id, node)}
      data-video-result-item
      className={`grid gap-4 rounded-2xl border-b border-[#E0E7FF] pb-6 transition-colors last:border-b-0 last:pb-0 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)] ${
        activeSettingsHistoryItemId === item.id ? 'bg-[#EEF2FF]/60 p-4 ring-1 ring-[#C7D2FE]' : ''
      }`}
    >
      <div
        data-video-result-panel
        className="flex h-full items-start justify-center lg:h-[260px]"
      >
        <video
          src={item.outputPreview}
          controls
          playsInline
          className="h-full max-h-[260px] max-w-full object-contain"
        />
      </div>

      <div data-video-result-details className="flex h-full min-w-0 flex-col gap-4 lg:h-[260px]">
        {renderVideoMetaTags(item, item.time)}
        <div className="flex min-h-0 items-start justify-between gap-4 overflow-hidden">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-extrabold text-slate-900">{text.prompt}</p>
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

        {item.inputPreview && (
          <img
            src={item.inputPreview}
            alt={text.referenceImage}
            className="h-14 w-14 rounded-lg object-cover ring-1 ring-[#E0E7FF]"
            loading="lazy"
            decoding="async"
          />
        )}

        <div data-video-result-actions className="mt-auto flex flex-wrap gap-2 pt-1">
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
      data-video-result-feed
      className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain p-4 md:p-5"
    >
      <div className="space-y-6">
        {currentRequest?.status === 'processing' ? renderDesktopPendingVideoItem(currentRequest) : null}
        {currentRequest?.status === 'failed' ? renderDesktopFailedVideoItem(currentRequest) : null}
        {history.map((item) => renderDesktopVideoHistoryItem(item))}
        {!isGenerating && currentRequest?.status !== 'failed' && history.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#E0E7FF] bg-white px-4 py-10 text-center text-sm text-slate-500">
            {text.noHistory}
          </p>
        )}
      </div>
    </div>
  )

  const renderDesktopResultTabs = () => (
    <div
      data-desktop-result-tabs
      className="mx-auto flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-[#E0E7FF] bg-white/90 p-1 shadow-sm shadow-[#4F46E5]/5"
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
        {text.demo}
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
        {text.history}
      </button>
    </div>
  )

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-visible p-2 md:pl-3 md:pr-3 md:pb-6 md:pt-3 xl:pl-4 xl:pr-4 2xl:pl-5 2xl:pr-5">
      <div
        data-generation-tool-shell
        className="flex min-h-0 min-w-0 flex-col gap-4 md:h-[calc(100dvh-6rem)] md:max-h-[calc(100dvh-6rem)] md:min-h-0 md:flex-row md:items-stretch md:gap-3 xl:gap-4 2xl:gap-5"
      >
              <aside data-left-generation-panel className="w-full md:h-full md:w-[380px] xl:w-[400px] 2xl:w-[420px] flex-shrink-0 flex flex-col rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8 overflow-visible">
                <div data-left-settings-scroll className={`p-2 md:p-6 space-y-4 md:space-y-5 md:flex-1 md:min-h-0 md:overscroll-contain ${shouldAllowLeftOverlay ? 'md:overflow-visible' : 'md:overflow-y-auto'}`}>
                  <div className="rounded-2xl bg-[#EEF2FF] p-1">
                    <div className="grid grid-cols-2 gap-1">
                      {AI_VIDEO_GENERATOR_MODE_OPTIONS.map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setActiveMode(mode.id)}
                          className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                            activeMode === mode.id
                              ? 'bg-white text-indigo-700 shadow-sm'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {getModeLabel(mode.id, text)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {allowModelSelect ? (
                    <div data-video-model-selector>
                      <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">{text.models}</label>
                      <div ref={modelSelectorRef} className="relative z-40">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDurationMenuOpen(false)
                            setActiveModelGroupId(selectedModelGroup.id)
                            setIsModelMenuOpen((open) => !open)
                          }}
                          className="!flex w-full items-center justify-between gap-3 !rounded-xl !border !border-[#E0E7FF] bg-[#EEF2FF]/30 !px-3 !py-2.5 text-left text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 !whitespace-normal hover:!border-[#C7D2FE] hover:bg-[#EEF2FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                          aria-haspopup="listbox"
                          aria-expanded={isModelMenuOpen}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <img
                              src={selectedModelOption.logoSrc}
                              alt={selectedModelOption.logoAlt}
                              className="h-5 w-5 shrink-0 rounded-md object-contain"
                              loading="lazy"
                            />
                            <span className="truncate font-bold text-slate-900">{selectedModelOption.name}</span>
                          </span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`shrink-0 text-[#4F46E5] transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180' : ''}`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        {isModelMenuOpen && (
                          <>
                            <div data-video-model-menu className="absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-full overflow-y-auto !rounded-2xl !border !border-[#E0E7FF] bg-white p-2 shadow-xl shadow-[#4F46E5]/12 md:hidden" role="listbox">
                              {modelGroups.map((group) => {
                                const isActiveGroup = group.id === activeModelGroup.id
                                return (
                                  <div key={group.id} className="space-y-1">
                                    <button
                                      type="button"
                                      onClick={() => setActiveModelGroupId(group.id)}
                                      className={`!flex w-full items-center gap-2 !rounded-xl !px-3 !py-2.5 text-left transition-colors duration-150 !whitespace-normal ${
                                        isActiveGroup
                                          ? 'bg-[#E0E7FF] text-[#3730A3]'
                                          : 'text-slate-600 hover:bg-[#F8FAFF] hover:text-slate-900'
                                      }`}
                                    >
                                      {renderModelGroupMark(group)}
                                      <span className="min-w-0 flex-1">
                                        <span className="block text-xs font-extrabold leading-5">{group.name}</span>
                                      </span>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${isActiveGroup ? 'rotate-90' : ''}`}>
                                        <polyline points="9 18 15 12 9 6" />
                                      </svg>
                                    </button>
                                    {group.id === activeModelGroup.id && (
                                      <div className="space-y-2 pb-2 pl-2">
                                        {group.models.map((option) => renderModelOptionButton(option, group))}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>

                            <div data-video-model-menu className="absolute left-0 top-full z-50 mt-2 hidden h-[380px] max-h-[70vh] overflow-hidden !rounded-2xl !border !border-[#E0E7FF] bg-white shadow-xl shadow-[#4F46E5]/12 md:grid md:w-[640px] md:grid-cols-[210px_minmax(0,430px)]" role="listbox">
                              <div data-video-model-groups className="h-full space-y-1 overflow-y-auto border-r border-slate-100 bg-slate-50/70 p-2">
                                {modelGroups.map((group) => {
                                  const isActiveGroup = group.id === activeModelGroup.id
                                  return (
                                    <button
                                      key={group.id}
                                      type="button"
                                      onMouseEnter={() => setActiveModelGroupId(group.id)}
                                      onClick={() => setActiveModelGroupId(group.id)}
                                      className={`!flex w-full items-center gap-2 !rounded-xl !px-3 !py-2.5 text-left transition-colors duration-150 !whitespace-normal ${
                                        isActiveGroup
                                          ? 'bg-[#E0E7FF] text-[#3730A3]'
                                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                      }`}
                                    >
                                      {renderModelGroupMark(group)}
                                      <span className="min-w-0 flex-1">
                                        <span className="block text-xs font-extrabold leading-5">{group.name}</span>
                                      </span>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                        <polyline points="9 18 15 12 9 6" />
                                      </svg>
                                    </button>
                                  )
                                })}
                              </div>

                              <div data-video-model-options className="h-full min-w-0 space-y-2 overflow-y-auto p-2">
                                {activeModelGroup.models.map((option) => renderModelOptionButton(option, activeModelGroup))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {activeMode === 'image-to-video' ? (
                    <ReferenceImageUploader
                      items={[
                        ...remoteImageUrls.map((url, index) => ({
                          id: `remote-${url}-${index}`,
                          src: url,
                          alt: `${text.referenceImage} ${index + 1}`,
                          onRemove: () => setRemoteImageUrls((prev) => prev.filter((_, itemIndex) => itemIndex !== index)),
                        })),
                        ...imageFiles.map((item, index) => ({
                          id: `local-${item.file.name}-${index}`,
                          src: item.preview,
                          alt: `${text.upload} ${index + 1}`,
                          onRemove: () => removeImage(index),
                          onReplace: (file: File) => replaceImageWithFile(index, file),
                        })),
                      ]}
                      maxImages={modelConfig.maxImages}
                      maxFileSizeMb={modelConfig.maxFileSizeMb}
                      onFiles={handleFiles}
                      onValidationError={showFileTooLargeNotice}
                      label={modelConfig.maxImages === 1 ? text.uploadYourImage : formatText(text.uploadUpTo, { count: modelConfig.maxImages })}
                      helperText={formatText(text.fileLimit, { size: modelConfig.maxFileSizeMb })}
                      uploadLabel={text.upload}
                      replaceLabel={text.replace}
                      deleteLabel={text.delete}
                      size="compact"
                      testIdPrefix="video-reference"
                    />
                  ) : null}

                  <div>
                    <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">{text.prompt}</label>
                    <textarea
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      placeholder={text.promptPlaceholder}
                      rows={4}
                      className="h-[7.5rem] w-full resize-none overflow-y-auto rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm leading-6 text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                    />
                  </div>

                  <div className="grid gap-3 grid-cols-1">
                    <div>
                      <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">{text.aspectRatio}</span>
                      <div role="group" aria-label={text.aspectRatio} className="grid grid-cols-3 gap-2">
                        {modelConfig.aspectRatios.map((ratio) => {
                          const isSelected = aspectRatio === ratio.value
                          return (
                            <button
                              key={ratio.value}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => setAspectRatio(ratio.value)}
                              className={getOptionButtonClassName(isSelected)}
                            >
                              {ratio.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">{text.resolution}</span>
                      <div role="group" aria-label={text.resolution} className="grid grid-cols-3 gap-2">
                        {modelConfig.resolutions.map((value) => {
                          const isSelected = resolution === value
                          return (
                            <button
                              key={value}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => {
                                setResolution(value)
                                if (nativeAudio && !modelConfig.nativeAudioResolutions?.includes(value)) {
                                  setNativeAudio(false)
                                }
                              }}
                              className={getOptionButtonClassName(isSelected)}
                            >
                              {value}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div data-video-duration-selector ref={durationSelectorRef} className="relative">
                      <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">{text.duration}</span>
                      <button
                        ref={durationButtonRef}
                        data-video-duration-button
                        type="button"
                        onClick={toggleDurationMenu}
                        className="!flex w-full items-center justify-between gap-3 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF]/30 px-4 py-2.5 text-left text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 hover:border-[#C7D2FE] hover:bg-[#EEF2FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                        aria-haspopup="listbox"
                        aria-expanded={isDurationMenuOpen}
                      >
                        <span className="font-bold text-slate-900">{duration}s</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`shrink-0 text-[#4F46E5] transition-transform duration-200 ${isDurationMenuOpen ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>

                    {supportsNativeAudio ? (
                      <div data-video-native-audio-toggle className="rounded-xl border border-[#E0E7FF] bg-[#F8FAFF] p-3">
                        <button
                          type="button"
                          aria-pressed={nativeAudio}
                          onClick={() => {
                            const nextNativeAudio = !nativeAudio
                            if (nextNativeAudio && !modelConfig.nativeAudioResolutions?.includes(resolution)) {
                              setResolution(modelConfig.nativeAudioResolutions?.[0] || resolution)
                            }
                            setNativeAudio(nextNativeAudio)
                          }}
                          className="flex w-full items-center justify-between gap-3 text-left"
                        >
                          <span>
                            <span className="block text-sm font-bold text-slate-900">{text.nativeAudio}</span>
                            <span className="mt-0.5 block text-xs leading-5 text-slate-500">{text.nativeAudioHint}</span>
                          </span>
                          <span className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${nativeAudio ? 'bg-[#4F46E5]' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${nativeAudio ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div data-generate-action-bar className="flex-shrink-0 border-t border-[#E0E7FF] bg-white p-4 md:p-6">
                  <button
                    data-generate-button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!canGenerate || isPreparing}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:from-indigo-200 disabled:to-purple-200 disabled:shadow-none"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>{isPreparing ? text.generating : text.generate}</span>
                      {!isPreparing ? (
                        <span
                          data-generate-credit-cost
                          className="inline-flex items-center gap-1.5 px-1 text-sm font-extrabold text-white"
                          aria-label={`${generationCreditCost} credits`}
                        >
                          <span className="tabular-nums">{generationCreditCost}</span>
                          <img
                            src="/credits-icons/diamond-3d-indigo.svg"
                            alt=""
                            aria-hidden="true"
                            className="h-[18px] w-[18px]"
                          />
                        </span>
                      ) : null}
                    </span>
                  </button>
                </div>
              </aside>

              <div data-video-demo-panel className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:h-full">
                {hasDesktopResultTabs ? renderDesktopResultTabs() : null}
                {rightMode !== 'history' && (heroBreadcrumbItems?.length || heroTitleHtml || heroDescription) ? (
                  <div className="shrink-0 text-center md:px-4 md:pt-1 xl:pt-0">
                    {heroBreadcrumbItems?.length ? (
                      <Breadcrumb items={heroBreadcrumbItems} variant="inline" />
                    ) : null}
                    {heroTitleHtml ? (
                      <h1
                        data-video-hero-title
                        className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-950 xl:text-[32px]"
                        dangerouslySetInnerHTML={{ __html: heroTitleHtml }}
                      />
                    ) : null}
                    {heroDescription ? (
                      <p className="mx-auto mt-3 max-w-4xl text-base leading-7 text-slate-600 md:text-[17px] md:leading-7">
                        {heroDescription}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8">
                  {rightMode === 'history' ? (
                    renderDesktopVideoResultFeed()
                  ) : (
                    <div
                      data-video-preview-canvas
                      className="relative flex min-h-[320px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#F7F5FF] p-6"
                      aria-label={text.previewHint}
                    >
                      <div
                        data-video-preview-frame
                        className={demoVideo?.src
                          ? 'relative inline-flex max-h-full max-w-full overflow-hidden rounded-2xl bg-transparent shadow-lg shadow-slate-200/70 ring-1 ring-slate-200/80'
                          : 'relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-950 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200/80'}
                      >
                        {demoVideo?.src ? (
                          <video
                            data-video-demo-media
                            className="block h-auto max-h-[520px] w-auto max-w-full object-contain"
                            src={demoVideo.src}
                            aria-label={demoVideo.ariaLabel || text.previewHint}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(79,70,229,0.66)),radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.34),transparent_32%)]" />
                            <div className="absolute inset-8 rounded-[1.25rem] border border-white/10 bg-white/[0.02]" />
                            <div className="absolute left-7 right-7 bottom-7 h-1.5 overflow-hidden rounded-full bg-white/15">
                              <div className="h-full w-1/3 rounded-full bg-white/45" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
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
      {renderDurationMenu()}
    </section>
  )
}
