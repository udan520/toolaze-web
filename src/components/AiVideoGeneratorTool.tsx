'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AI_VIDEO_GENERATOR_MODE_OPTIONS,
  AI_VIDEO_GENERATOR_MODEL_OPTIONS,
  type AiVideoGeneratorModeId,
  type AiVideoGeneratorModelConfig,
  type AiVideoGeneratorModelId,
  getAiVideoGeneratorModelGroupId,
  getAiVideoGeneratorModelMinimumCredits,
  getAiVideoGeneratorModelConfig,
  getAiVideoGeneratorFallbackModel,
  getAiVideoGeneratorModelGroupsForMode,
} from '@/lib/ai-video-generator-config'
import { getLocalizedModelSelectorCopy } from '@/lib/model-selector-i18n'
import { getImageUploadUrl } from '@/lib/upload-url'
import { calculateVideoGenerationCredits } from '@/lib/generation-credits'
import { useCommonTranslations } from '@/lib/use-common-translations'
import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb'
import CloseIcon from './icons/CloseIcon'
import DeleteIcon from '@/components/icons/DeleteIcon'
import MotionReferenceVideoUploader, { type MotionReferenceVideoUploaderItem } from '@/components/MotionReferenceVideoUploader'
import ReferenceImageUploader from '@/components/ReferenceImageUploader'
import { formatLocalTimestampToSeconds } from '@/lib/credit-history-time'
import {
  getCachedGenerationAuthState,
  getGenerationAuthStateFromAuthMeResult,
  type GenerationAuthState,
} from '@/lib/generation-auth-state'
import {
  getHistoryToolMetadata,
  getLocalizedInternalPath,
} from '@/lib/generation-history-tool-metadata'
import {
  buildHistoryRecreateHref,
  buildHistoryRepromptPayload,
  normalizeReusableReferenceImageUrl,
} from '@/lib/history-reprompt'
import { getReferenceImageConstraintError } from '@/lib/reference-image-constraints'
import { getGenerationModelLabel } from '@/lib/generation-history-display'
import { trackGenerationHistoryRecreateClick } from '@/lib/generation-history-analytics'
import { dispatchToolazeTopNotice } from '@/lib/top-notice'
import { parseLocalePath } from '@/lib/site-language-switch'

interface ImageItem {
  file: File
  preview: string
}

interface VideoItem {
  file: File
  preview: string
  durationSeconds?: number
}

type VideoGenerationStatus = 'processing' | 'succeeded' | 'failed'
type RightPanelMode = 'sample' | 'history'
type SharedHistoryMode = AiVideoGeneratorModeId | 'text-to-image' | 'image-to-image'

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
  motionVideoUrls?: string[]
  characterOrientation?: 'image' | 'video'
  createdAt: string
  startedAt: number
  status: VideoGenerationStatus
  taskId?: string
  creditHold?: unknown
  taskProvider?: string
  videoUrl?: string
  error?: string
}

interface VideoHistoryItem {
  id: string
  mediaType: 'image' | 'video'
  modelId?: AiVideoGeneratorModelId
  model?: string | null
  modelName: string
  mode: SharedHistoryMode
  prompt: string
  aspectRatio: string
  duration?: number
  resolution: string
  outputFormat?: string | null
  nativeAudio: boolean
  inputPreview: string
  inputUrls: string[]
  motionVideoUrls?: string[]
  characterOrientation?: 'image' | 'video'
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
  initialImageUrls?: string[]
  initialMotionVideoUrls?: string[]
  initialMotionVideoDurationSeconds?: number
  initialPrompt?: string
  initialCharacterOrientation?: 'image' | 'video'
  demoVideo?: {
    src?: string
    poster?: string
    ariaLabel?: string
    width?: number
    height?: number
  }
  initialTranslations?: any
}

interface PromptInsertEventDetail {
  prompt?: string
  imageUrl?: string
  imageUrls?: string[]
  videoUrls?: string[]
  imageName?: string
  modelId?: string
  aspectRatio?: string
  resolution?: string
  outputFormat?: string
  mode?: string
  characterOrientation?: 'image' | 'video'
}

const FALLBACK_TEXT = {
  imageToVideo: 'Image to Video',
  textToVideo: 'Text to Video',
  imageToImage: 'Image to Image',
  textToImage: 'Text to Image',
  models: 'Models',
  uploadUpTo: 'Upload up to {count} images',
  uploadYourImage: 'Upload your image',
  upload: 'Upload',
  fileLimit: 'JPG, PNG, WEBP up to {size}MB each',
  fileTooLarge: 'File {name} exceeds {size}MB limit',
  referenceImageInvalidType: 'Use a supported image format for this model.',
  clear: 'Clear',
  delete: 'Delete',
  replace: 'Replace',
  preview: 'Preview',
  optional: 'Optional',
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
  signInRequiredTitle: 'Sign In Required',
  signInRequiredMessage: 'Please sign in with Google to generate videos.',
  creditsUsedUpTitle: 'Credits Used Up',
  creditsUsedUpMessage: 'You need more credits to generate this video. Buy a one-time pack or earn free credits with daily rewards.',
  creditsUsedUpBuyAction: 'Buy Credits',
  creditsUsedUpEarnAction: 'Earn Free Credits',
  download: 'Download',
  resultExpires: 'Generated video links may expire. Download the result if you need to keep it.',
  modelSwitchedTitle: 'Model Switched',
  modelSwitchedDescription: '{previousModel} doesn’t support {mode}. Switched to {nextModel}.',
  noCompatibleModelTitle: 'No Compatible Model',
  noCompatibleModelDescription: 'No model currently supports {mode}. Please choose another mode.',
  motionReferenceVideo: 'Motion Reference Video',
  motionReferenceVideoHelper: 'MP4, QuickTime, or Matroska. Max {size}MB, {min}-{max} seconds. Output duration follows the motion reference video.',
  motionReferenceVideoDurationNote: 'Duration follows the uploaded reference video ({min}-{max} seconds).',
  motionReferenceVideoInvalidType: 'Use MP4, QuickTime, or Matroska for the motion reference video.',
  motionReferenceVideoInvalidDuration: 'Motion reference video must be {min}-{max} seconds.',
  characterOrientation: 'Character Orientation',
  characterOrientationImage: 'Image',
  characterOrientationVideo: 'Video',
  characterOrientationHelper: "Use Image to match the person's orientation in the character image (max 10s video). Use Video to follow the character orientation in the reference video (max 30s video).",
}

const VIDEO_HISTORY_MODEL_SLUGS: Record<AiVideoGeneratorModelId, string> = {
  'grok-1-5-video': 'grok-imagine-video-1-5',
  'seedance-2': 'seedance-2',
  'seedance-2-mini': 'seedance-2-mini',
  'seedance-2-fast': 'seedance-2-fast',
  'seedance-1-5-pro': 'seedance-1-5-pro',
  'seedance-1-pro-fast': 'seedance-1-pro-fast',
  'seedance-1-pro': 'seedance-1-pro',
  'seedance-1-lite': 'seedance-1-lite',
  'wan-2-7': 'wan-2-7',
  'wan-2-6': 'wan-2-6',
  'wan-2-5': 'wan-2-5',
  'wan-2-2': 'wan-2-2',
  'kling-3-turbo': 'kling-3-turbo',
  'kling-3': 'kling-3',
  'kling-2-6-motion-control': 'kling-2-6-motion-control',
  'kling-2-6': 'kling-2-6',
  'kling-2-5': 'kling-2-5',
  'kling-2-1': 'kling-2-1',
  'veo-3-1-lite': 'veo-3-1-lite',
  'veo-3-1-fast': 'veo-3-1-fast',
  'veo-3-1-quality': 'veo-3-1-quality',
  'pixverse-v6': 'pixverse-v6',
  'happyhorse-1-1': 'happyhorse-1-1',
  'happyhorse': 'happyhorse',
}

const PENDING_REPROMPT_STORAGE_KEY = 'toolaze:pending-reprompt'
const ACCEPTED_MOTION_REFERENCE_VIDEO_TYPES = 'video/mp4,video/quicktime,video/x-matroska,.mp4,.mov,.mkv'
const ACCEPTED_MOTION_REFERENCE_VIDEO_FILE_RE = /\.(mp4|mov|mkv)$/i

const getReferenceImageDimensions = (file: File): Promise<{ width: number; height: number }> => new Promise((resolve, reject) => {
  const previewUrl = URL.createObjectURL(file)
  const image = new Image()
  image.onload = () => {
    URL.revokeObjectURL(previewUrl)
    resolve({ width: image.naturalWidth, height: image.naturalHeight })
  }
  image.onerror = () => {
    URL.revokeObjectURL(previewUrl)
    reject(new Error('Image metadata could not be read.'))
  }
  image.src = previewUrl
})

function getVideoHistoryModelSlug(modelId: AiVideoGeneratorModelId) {
  return VIDEO_HISTORY_MODEL_SLUGS[modelId] || modelId
}

function getVideoModelIdFromHistoryModel(model: unknown): AiVideoGeneratorModelId {
  const normalized = String(model || '').trim()
  const match = Object.entries(VIDEO_HISTORY_MODEL_SLUGS).find(([, slug]) => slug === normalized)
  if (match) return match[0] as AiVideoGeneratorModelId
  return 'grok-1-5-video'
}

function getHistoryDuration(outputFormat: string | null | undefined, fallback: number) {
  const serialized = String(outputFormat || '').trim()
  try {
    const parsed = JSON.parse(serialized)
    const duration = Number(parsed?.duration)
    if (Number.isFinite(duration) && duration > 0) return duration
  } catch {
    // Legacy video history stores duration as "12s".
  }
  const duration = Number(serialized.replace(/s$/i, ''))
  return Number.isFinite(duration) && duration > 0 ? duration : fallback
}

function getHistoryCharacterOrientation(outputFormat: string | null | undefined): 'image' | 'video' {
  try {
    const parsed = JSON.parse(String(outputFormat || ''))
    return parsed?.characterOrientation === 'image' ? 'image' : 'video'
  } catch {
    return 'video'
  }
}

function isVideoHistoryMediaType(item: PersistedVideoHistoryItem) {
  return item.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(String(item.outputUrl || '').trim())
}

function isMotionVideoReferenceUrl(url: string) {
  const value = String(url || '').trim()
  return value.startsWith('toolaze-upload-ref:video:') || /\.(mp4|webm|mov|m4v|mkv)(?:[?#].*)?$/i.test(value)
}

function splitVideoInputUrls(inputUrls: string[]) {
  return {
    imageUrls: inputUrls.filter((url) => !isMotionVideoReferenceUrl(url)),
    motionVideoUrls: inputUrls.filter(isMotionVideoReferenceUrl),
  }
}

function getPersistedHistoryCreatedAtMs(item: PersistedVideoHistoryItem): number {
  const createdAtMs = Date.parse(item.createdAt || '')
  return Number.isFinite(createdAtMs) ? createdAtMs : 0
}

function sortPersistedVideoHistoryItemsNewestFirst(items: PersistedVideoHistoryItem[]): PersistedVideoHistoryItem[] {
  return [...items].sort((a, b) => getPersistedHistoryCreatedAtMs(b) - getPersistedHistoryCreatedAtMs(a))
}

function mapPersistedVideoHistoryItem(item: PersistedVideoHistoryItem): VideoHistoryItem | null {
  const id = String(item.id || '').trim()
  const outputPreview = String(item.outputUrl || '').trim()
  const prompt = String(item.prompt || '').trim()
  if (!id || !outputPreview) return null

  const mediaType = isVideoHistoryMediaType(item) ? 'video' : 'image'
  const rawInputUrls = Array.isArray(item.inputUrls)
    ? item.inputUrls.filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
    : []
  const { imageUrls: inputUrls, motionVideoUrls } = splitVideoInputUrls(rawInputUrls)

  if (mediaType === 'image') {
    return {
      id,
      mediaType,
      model: String(item.model || '').trim() || null,
      modelName: getGenerationModelLabel(item.model),
      mode: inputUrls.length > 0 ? 'image-to-image' : 'text-to-image',
      prompt,
      aspectRatio: item.aspectRatio || '',
      resolution: item.resolution || '',
      outputFormat: item.outputFormat || null,
      nativeAudio: false,
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

  const modelId = getVideoModelIdFromHistoryModel(item.model)
  const modelConfig = getAiVideoGeneratorModelConfig(modelId)

  return {
    id,
    mediaType,
    model: String(item.model || '').trim() || null,
    modelId,
    modelName: modelConfig.name,
    mode: inputUrls.length > 0 ? 'image-to-video' : 'text-to-video',
    prompt,
    aspectRatio: item.aspectRatio || modelConfig.aspectRatios[0]?.value || '16:9',
    duration: getHistoryDuration(item.outputFormat, modelConfig.defaultDuration || modelConfig.durations[0] || 5),
    resolution: item.resolution || modelConfig.resolutions[0] || '480p',
    outputFormat: item.outputFormat || null,
    nativeAudio: item.nativeAudio === true,
    inputPreview: inputUrls[0] || '',
    inputUrls,
    motionVideoUrls,
    characterOrientation: modelConfig.supportsMotionReferenceVideo
      ? getHistoryCharacterOrientation(item.outputFormat)
      : undefined,
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

function getImageHistoryModeLabel(mode: SharedHistoryMode, text: typeof FALLBACK_TEXT) {
  if (mode === 'image-to-image') return text.imageToImage
  if (mode === 'text-to-image') return text.textToImage
  return getModeLabel(mode, text)
}

function getInitialVideoMode(
  modelConfig: AiVideoGeneratorModelConfig,
  defaultMode?: AiVideoGeneratorModeId,
) {
  if (defaultMode && modelConfig.supportedModes.includes(defaultMode)) return defaultMode
  return modelConfig.defaultMode
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

async function ensureSignedInForGeneration(requiredCredits: number): Promise<GenerationAuthState> {
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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getMotionReferenceVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Video metadata is unavailable'))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')
    const cleanup = () => URL.revokeObjectURL(objectUrl)

    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      const durationSeconds = Number(video.duration)
      cleanup()
      if (Number.isFinite(durationSeconds) && durationSeconds > 0) {
        resolve(durationSeconds)
        return
      }
      reject(new Error('Video duration is unavailable'))
    }
    video.onerror = () => {
      cleanup()
      reject(new Error('Video duration is unavailable'))
    }
    video.src = objectUrl
  })
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
  const durationLabel = option.durationMode === 'reference-video'
    ? `${option.referenceVideoMinDurationSeconds || firstDuration}-${option.referenceVideoMaxDurationSeconds || lastDuration}s reference`
    : `${firstDuration}-${lastDuration}s`
  const minimumCredits = getAiVideoGeneratorModelMinimumCredits(option)
  return [
    { label: `${minimumCredits}+`, iconSrc: '/credits-icons/diamond-3d-indigo.svg', ariaLabel: `${minimumCredits}+ credits` },
    { label: durationLabel },
    { label: option.resolutions.join('/') },
    {
      label: option.supportsNativeAudioOutput ? 'Native Audio' : 'No Native Audio',
      tone: option.supportsNativeAudioOutput ? 'positive' : 'neutral',
    },
    {
      label: option.supportsMultiShot ? 'Multi-shot' : 'Single-shot',
      tone: option.supportsMultiShot ? 'positive' : 'neutral',
    },
  ]
}

const getUploadUrlForModel = (config: AiVideoGeneratorModelConfig) => config.uploadPurpose === 'kling-motion-control' ? '/api/upload' : getImageUploadUrl()

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
  initialImageUrls,
  initialMotionVideoUrls,
  initialMotionVideoDurationSeconds,
  initialPrompt,
  initialCharacterOrientation,
  demoVideo,
  initialTranslations,
}: AiVideoGeneratorToolProps) {
  const pathname = usePathname()
  const commonTranslations = useCommonTranslations(initialTranslations)
  const text = { ...FALLBACK_TEXT, ...(commonTranslations?.common?.aiVideoGeneratorTool || {}) }
  const localizedModelSelectorCopy = useMemo(
    () => getLocalizedModelSelectorCopy(
      parseLocalePath(pathname).pathLocale || 'en',
      commonTranslations?.common?.modelSelector,
    ),
    [commonTranslations, pathname],
  )
  const videoModelSelectorCopy = localizedModelSelectorCopy.video
  const modelSelectorBadgeLabels = localizedModelSelectorCopy.badges
  const getModelBadgeLabel = (badge?: AiVideoGeneratorModelConfig['badge']) => {
    if (!badge) return ''
    return modelSelectorBadgeLabels?.[badge.toLowerCase()] || badge
  }
  const imageFilesRef = useRef<ImageItem[]>([])
  const motionVideoFilesRef = useRef<VideoItem[]>([])
  const modelSelectorRef = useRef<HTMLDivElement>(null)
  const durationSelectorRef = useRef<HTMLDivElement>(null)
  const durationButtonRef = useRef<HTMLButtonElement>(null)
  const durationMenuRef = useRef<HTMLDivElement>(null)
  const historyItemRefs = useRef(new Map<string, HTMLDivElement>())
  const [selectedModelId, setSelectedModelId] = useState<AiVideoGeneratorModelId>(modelId)
  const modelConfig = useMemo(() => getAiVideoGeneratorModelConfig(selectedModelId), [selectedModelId])
  const [activeMode, setActiveMode] = useState<AiVideoGeneratorModeId>(() => getInitialVideoMode(modelConfig, defaultMode))
  const modelGroups = useMemo(
    () => getAiVideoGeneratorModelGroupsForMode(activeMode).map((group) => ({
      ...group,
      description: videoModelSelectorCopy?.groups?.[group.id]?.description,
      logoAlt: videoModelSelectorCopy?.groups?.[group.id]?.logoAlt || group.logoAlt,
      models: group.models.map((model) => {
        const modelCopy = videoModelSelectorCopy?.models?.[model.id]
        return {
          ...model,
          description: modelCopy?.description || model.description,
          logoAlt: modelCopy?.logoAlt || model.logoAlt,
        }
      }),
    })),
    [activeMode, videoModelSelectorCopy],
  )
  const modelOptions = useMemo(() => modelGroups.flatMap((group) => group.models), [modelGroups])
  const selectedModelOption = modelOptions.find((option) => option.id === selectedModelId) || modelConfig
  const selectedModelGroup = modelGroups.find((group) => group.models.some((model) => model.id === selectedModelId)) || modelGroups[0]
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const [isDurationMenuOpen, setIsDurationMenuOpen] = useState(false)
  const [activeModelGroupId, setActiveModelGroupId] = useState(() => getAiVideoGeneratorModelGroupId(modelId))
  const activeModelGroup = modelGroups.find((group) => group.id === activeModelGroupId) || modelGroups[0]
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([])
  const [remoteImageUrls, setRemoteImageUrls] = useState<string[]>(() => (
    Array.isArray(initialImageUrls) ? initialImageUrls.filter(Boolean).slice(0, modelConfig.maxImages) : []
  ))
  const [motionVideoFiles, setMotionVideoFiles] = useState<VideoItem[]>([])
  const [remoteMotionVideoUrls, setRemoteMotionVideoUrls] = useState<string[]>(() => (
    Array.isArray(initialMotionVideoUrls) ? initialMotionVideoUrls.filter(Boolean).slice(0, modelConfig.maxVideos || 1) : []
  ))
  const [characterOrientation, setCharacterOrientation] = useState<'image' | 'video'>(initialCharacterOrientation || 'video')
  const [prompt, setPrompt] = useState(initialPrompt || '')
  const [aspectRatio, setAspectRatio] = useState(modelConfig.aspectRatios[0]?.value || '16:9')
  const [duration, setDuration] = useState(() => {
    if (modelConfig.durationMode === 'reference-video') {
      const referenceDuration = Math.ceil(Number(initialMotionVideoDurationSeconds))
      if (Number.isFinite(referenceDuration) && referenceDuration > 0) return referenceDuration
    }
    return modelConfig.defaultDuration || modelConfig.durations[0] || 5
  })
  const [resolution, setResolution] = useState(modelConfig.resolutions[0] || '1080p')
  const [nativeAudio, setNativeAudio] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<VideoGenerationRequest | null>(null)
  const [creditExhaustedModalOpen, setCreditExhaustedModalOpen] = useState(false)
  const [generatingSeconds, setGeneratingSeconds] = useState(0)
  const [history, setHistory] = useState<VideoHistoryItem[]>([])
  const [activeSettingsHistoryItemId, setActiveSettingsHistoryItemId] = useState<string | null>(null)
  const [rightMode, setRightMode] = useState<RightPanelMode>('sample')
  const [motionVideoPreview, setMotionVideoPreview] = useState<{ src: string; label: string } | null>(null)
  const [durationMenuRect, setDurationMenuRect] = useState<{ left: number; top: number; width: number } | null>(null)
  const shouldAllowLeftOverlay = isModelMenuOpen
  const supportsNativeAudio = Boolean(modelConfig.supportsNativeAudio)
  const supportsMotionReferenceVideo = Boolean(modelConfig.supportsMotionReferenceVideo)
  const promptRequired = modelConfig.promptRequired !== false
  const promptLabel = promptRequired ? text.prompt : `${text.prompt} (${text.optional})`
  const minimumCreditCost = useMemo(() => getAiVideoGeneratorModelMinimumCredits(modelConfig), [modelConfig])
  const generationCreditCost = useMemo(
    () => calculateVideoGenerationCredits(selectedModelId, resolution, duration, {
      nativeAudio: supportsNativeAudio && nativeAudio,
    }) ?? minimumCreditCost,
    [selectedModelId, resolution, duration, supportsNativeAudio, nativeAudio, minimumCreditCost],
  )

  const applyModelSelection = (nextModel: AiVideoGeneratorModelConfig) => {
    const nextResolution = nextModel.resolutions.includes(resolution)
      ? resolution
      : nextModel.resolutions[0] || '1080p'
    setSelectedModelId(nextModel.id)
    setActiveModelGroupId(getAiVideoGeneratorModelGroupId(nextModel.id))
    setAspectRatio((current) =>
      nextModel.aspectRatios.some((option) => option.value === current)
        ? current
        : nextModel.aspectRatios[0]?.value || '16:9',
    )
    setDuration((current) =>
      nextModel.durations.includes(current)
        ? current
        : nextModel.defaultDuration || nextModel.durations[0] || 5,
    )
    setResolution(nextResolution)
    setNativeAudio((current) =>
      Boolean(
        current &&
        nextModel.supportsNativeAudio &&
        (!nextModel.nativeAudioResolutions || nextModel.nativeAudioResolutions.includes(nextResolution)),
      ),
    )
    if (!nextModel.supportsMotionReferenceVideo) {
      motionVideoFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
      motionVideoFilesRef.current = []
      setMotionVideoFiles([])
      setRemoteMotionVideoUrls([])
    }
    setIsModelMenuOpen(false)
    setIsDurationMenuOpen(false)
  }

  const handleModeChange = (nextMode: AiVideoGeneratorModeId) => {
    setIsModelMenuOpen(false)
    setIsDurationMenuOpen(false)
    if (modelConfig.supportedModes.includes(nextMode)) {
      setActiveMode(nextMode)
      return
    }

    const fallbackModel = getAiVideoGeneratorFallbackModel(nextMode)
    if (!fallbackModel) {
      dispatchToolazeTopNotice({
        type: 'error',
        title: text.noCompatibleModelTitle,
        message: formatText(text.noCompatibleModelDescription, {
          mode: getModeLabel(nextMode, text),
        }),
      })
      return
    }

    const previousModelName = modelConfig.name
    applyModelSelection(fallbackModel)
    setActiveMode(nextMode)
    dispatchToolazeTopNotice({
      type: 'warning',
      title: text.modelSwitchedTitle,
      message: formatText(text.modelSwitchedDescription, {
        previousModel: previousModelName,
        mode: getModeLabel(nextMode, text),
        nextModel: fallbackModel.name,
      }),
    })
  }

  const updateDurationMenuRect = useCallback(() => {
    const rect = durationButtonRef.current?.getBoundingClientRect()
    if (!rect) {
      setDurationMenuRect(null)
      return
    }

    setDurationMenuRect({ left: rect.left, top: rect.top, width: rect.width })
  }, [])

  const toggleDurationMenu = () => {
    if (modelConfig.durationMode === 'reference-video') return
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
    motionVideoFilesRef.current = motionVideoFiles
  }, [motionVideoFiles])

  useEffect(() => {
    return () => {
      imageFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
      motionVideoFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
    }
  }, [])

  useEffect(() => {
    const queryModelId = new URLSearchParams(window.location.search).get('model')
    const nextModelId = AI_VIDEO_GENERATOR_MODEL_OPTIONS.some((option) => option.id === queryModelId)
      ? queryModelId as AiVideoGeneratorModelId
      : modelId
    const nextModel = getAiVideoGeneratorModelConfig(nextModelId)
    applyModelSelection(nextModel)
    setActiveMode(getInitialVideoMode(nextModel, defaultMode))
  }, [defaultMode, modelId])

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
    if (!supportsNativeAudio && nativeAudio) {
      setNativeAudio(false)
    }
  }, [supportsNativeAudio, nativeAudio])

  const applyPromptInsertDetail = useCallback((detail: PromptInsertEventDetail) => {
    const promptText = String(detail?.prompt || '').trim()
    const singleImageUrl = normalizeReusableReferenceImageUrl(detail?.imageUrl)
    const imageUrls = Array.isArray(detail?.imageUrls)
      ? detail.imageUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
      : []
    const referenceUrls = imageUrls.length > 0 ? imageUrls : singleImageUrl ? [singleImageUrl] : []
    if (!promptText && referenceUrls.length === 0) return false

    const nextModel = detail?.modelId
      ? getAiVideoGeneratorModelConfig(getVideoModelIdFromHistoryModel(detail.modelId))
      : modelConfig
    const requestedMode: AiVideoGeneratorModeId =
      detail?.mode === 'text-to-video' || detail?.mode === 'image-to-video'
        ? detail.mode
        : referenceUrls.length > 0 ? 'image-to-video' : 'text-to-video'
    const nextMode = nextModel.supportedModes.includes(requestedMode)
      ? requestedMode
      : getInitialVideoMode(nextModel, undefined)
    const nextDuration = getHistoryDuration(detail?.outputFormat, nextModel.defaultDuration || nextModel.durations[0] || 5)

    setSelectedModelId(nextModel.id)
    setActiveModelGroupId(getAiVideoGeneratorModelGroupId(nextModel.id))
    setActiveMode(nextMode)
    setPrompt(promptText)
    setAspectRatio(
      detail?.aspectRatio && nextModel.aspectRatios.some((option) => option.value === detail.aspectRatio)
        ? detail.aspectRatio
        : nextModel.aspectRatios[0]?.value || '16:9',
    )
    setDuration(
      nextModel.durations.includes(nextDuration)
        ? nextDuration
        : nextModel.defaultDuration || nextModel.durations[0] || 5,
    )
    setResolution(
      detail?.resolution && nextModel.resolutions.includes(detail.resolution)
        ? detail.resolution
        : nextModel.resolutions[0] || '480p',
    )
    setNativeAudio(false)
    setCharacterOrientation(nextModel.supportsMotionReferenceVideo
      ? detail?.characterOrientation || getHistoryCharacterOrientation(detail?.outputFormat)
      : 'video')
    setIsModelMenuOpen(false)
    setIsDurationMenuOpen(false)
    imageFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
    imageFilesRef.current = []
    setImageFiles([])
    motionVideoFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
    motionVideoFilesRef.current = []
    setMotionVideoFiles([])
    setRemoteImageUrls(nextMode === 'image-to-video' ? referenceUrls.slice(0, nextModel.maxImages) : [])
    setRemoteMotionVideoUrls(nextModel.supportsMotionReferenceVideo && Array.isArray(detail?.videoUrls)
      ? detail.videoUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean).slice(0, nextModel.maxVideos || 1)
      : [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return true
  }, [modelConfig])

  // 从提示词案例板块一键带入 Prompt，保持与图片生成器相同的使用路径。
  useEffect(() => {
    const handler = (event: Event) => {
      applyPromptInsertDetail((event as CustomEvent<PromptInsertEventDetail>).detail || {})
    }

    window.addEventListener('toolaze:use-prompt', handler as EventListener)
    return () => window.removeEventListener('toolaze:use-prompt', handler as EventListener)
  }, [applyPromptInsertDetail])

  useEffect(() => {
    const raw = window.sessionStorage.getItem(PENDING_REPROMPT_STORAGE_KEY)
    if (!raw) return
    try {
      const detail = JSON.parse(raw) as PromptInsertEventDetail
      if (applyPromptInsertDetail(detail)) {
        window.sessionStorage.removeItem(PENDING_REPROMPT_STORAGE_KEY)
      }
    } catch {
      window.sessionStorage.removeItem(PENDING_REPROMPT_STORAGE_KEY)
    }
  }, [applyPromptInsertDetail])

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
  const motionReferenceVideoCount = remoteMotionVideoUrls.length + motionVideoFiles.length
  const referenceVideoMaxDurationSeconds = characterOrientation === 'image' ? 10 : modelConfig.referenceVideoMaxDurationSeconds || 30
  const shouldShowGenerationCreditCost = modelConfig.durationMode !== 'reference-video' || motionReferenceVideoCount > 0
  const motionReferenceVideoHelperText = formatText(text.motionReferenceVideoHelper, {
    size: modelConfig.maxVideoFileSizeMb || 50,
    min: modelConfig.referenceVideoMinDurationSeconds || 3,
    max: referenceVideoMaxDurationSeconds,
  })
  const selectedMotionVideo = remoteMotionVideoUrls[0]
    ? {
      source: 'remote' as const,
      index: 0,
      src: remoteMotionVideoUrls[0],
      label: text.motionReferenceVideo,
    }
    : motionVideoFiles[0]
      ? {
        source: 'local' as const,
        index: 0,
        src: motionVideoFiles[0].preview,
        label: motionVideoFiles[0].file.name || text.motionReferenceVideo,
        durationSeconds: motionVideoFiles[0].durationSeconds,
      }
      : null
  const referenceImageHelperText = modelConfig.referenceImageHelperText
    ? formatText(modelConfig.referenceImageHelperText, { size: modelConfig.maxFileSizeMb })
    : formatText(text.fileLimit, { size: modelConfig.maxFileSizeMb })
  const hasReferenceImageDimensionConstraints = Boolean(
    modelConfig.referenceImageMinDimensionPx
      || modelConfig.referenceImageAspectRatioMin
      || modelConfig.referenceImageAspectRatioMax,
  )
  const canGenerate = (!promptRequired || prompt.trim().length > 0)
    && (activeMode === 'text-to-video' || referenceImageCount > 0)
    && (!supportsMotionReferenceVideo || motionReferenceVideoCount > 0)
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

  const showImageInvalidTypeNotice = () => {
    dispatchToolazeTopNotice({
      type: 'warning',
      title: 'Warning',
      message: modelConfig.invalidImageTypeMessage || text.referenceImageInvalidType,
    })
  }

  const showImageInvalidDimensionsNotice = () => {
    dispatchToolazeTopNotice({
      type: 'warning',
      title: 'Warning',
      message: modelConfig.invalidImageDimensionsMessage || text.referenceImageInvalidType,
    })
  }

  const showVideoFileTooLargeNotice = (file: File) => {
    dispatchToolazeTopNotice({
      type: 'warning',
      title: 'Warning',
      message: formatText(text.fileTooLarge, { name: file.name, size: modelConfig.maxVideoFileSizeMb || modelConfig.maxFileSizeMb }),
    })
  }

  const showMotionVideoInvalidTypeNotice = () => {
    dispatchToolazeTopNotice({
      type: 'warning',
      title: 'Warning',
      message: text.motionReferenceVideoInvalidType,
    })
  }

  const showMotionVideoInvalidDurationNotice = () => {
    dispatchToolazeTopNotice({
      type: 'warning',
      title: 'Warning',
      message: formatText(text.motionReferenceVideoInvalidDuration, {
        min: modelConfig.referenceVideoMinDurationSeconds || 3,
        max: modelConfig.referenceVideoMaxDurationSeconds || 30,
      }),
    })
  }

  const validateReferenceImageFile = async (file: File) => {
    if (!hasReferenceImageDimensionConstraints) return true

    try {
      const dimensions = await getReferenceImageDimensions(file)
      const error = getReferenceImageConstraintError(dimensions, {
        minDimensionPx: modelConfig.referenceImageMinDimensionPx,
        aspectRatioMin: modelConfig.referenceImageAspectRatioMin,
        aspectRatioMax: modelConfig.referenceImageAspectRatioMax,
      })
      if (!error) return true
    } catch {
      // Fall through to the same user-facing guidance because KIE will reject unreadable image metadata.
    }

    showImageInvalidDimensionsNotice()
    return false
  }

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.isArray(files) ? files : Array.from(files)
    const remainingSlots = modelConfig.maxImages - referenceImageCount
    if (remainingSlots <= 0) return

    const maxSize = modelConfig.maxFileSizeMb * 1024 * 1024
    const candidateFiles = list
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remainingSlots)
      .filter((file) => {
        if (file.size <= maxSize) return true
        showFileTooLargeNotice(file)
        return false
      })

    const validFiles: File[] = []
    for (const file of candidateFiles) {
      if (await validateReferenceImageFile(file)) validFiles.push(file)
    }

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

  const removeSelectedMotionVideo = () => {
    if (!selectedMotionVideo) return
    if (selectedMotionVideo.source === 'remote') {
      setRemoteMotionVideoUrls((prev) => prev.filter((_, itemIndex) => itemIndex !== selectedMotionVideo.index))
      return
    }

    setMotionVideoFiles((prev) => {
      const item = prev[selectedMotionVideo.index]
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((_, itemIndex) => itemIndex !== selectedMotionVideo.index)
    })
  }

  const handleCharacterOrientationChange = (nextOrientation: 'image' | 'video') => {
    if (nextOrientation === characterOrientation) return
    setCharacterOrientation(nextOrientation)

    if (nextOrientation === 'image' && motionReferenceVideoCount > 0 && duration > 10) {
      motionVideoFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
      motionVideoFilesRef.current = []
      setMotionVideoFiles([])
      setRemoteMotionVideoUrls([])
      setDuration(modelConfig.referenceVideoMinDurationSeconds || 3)
      dispatchToolazeTopNotice({
        type: 'warning',
        title: 'Warning',
        message: formatText(text.motionReferenceVideoInvalidDuration, {
          min: modelConfig.referenceVideoMinDurationSeconds || 3,
          max: 10,
        }),
      })
    }
  }

  const buildMotionVideoItem = async (file: File): Promise<VideoItem | null> => {
    const hasAcceptedType = ['video/mp4', 'video/quicktime', 'video/x-matroska'].includes(file.type)
      || ACCEPTED_MOTION_REFERENCE_VIDEO_FILE_RE.test(file.name)
    if (!hasAcceptedType) {
      showMotionVideoInvalidTypeNotice()
      return null
    }
    const maxSize = (modelConfig.maxVideoFileSizeMb || 50) * 1024 * 1024
    if (file.size > maxSize) {
      showVideoFileTooLargeNotice(file)
      return null
    }

    let videoDurationSeconds: number
    try {
      videoDurationSeconds = await getMotionReferenceVideoDuration(file)
    } catch {
      showMotionVideoInvalidDurationNotice()
      return null
    }
    const minDuration = modelConfig.referenceVideoMinDurationSeconds || 3
    const maxDuration = referenceVideoMaxDurationSeconds
    if (videoDurationSeconds < minDuration || videoDurationSeconds > maxDuration) {
      showMotionVideoInvalidDurationNotice()
      return null
    }

    setDuration(Math.ceil(videoDurationSeconds))
    return {
      file,
      preview: URL.createObjectURL(file),
      durationSeconds: videoDurationSeconds,
    }
  }

  const handleMotionVideoFiles = async (files: FileList | File[]) => {
    const list = Array.isArray(files) ? files : Array.from(files)
    const maxVideos = modelConfig.maxVideos || 1
    const remainingSlots = maxVideos - motionReferenceVideoCount
    if (remainingSlots <= 0) return

    const validItems: VideoItem[] = []
    for (const file of list.slice(0, remainingSlots)) {
      const item = await buildMotionVideoItem(file)
      if (item) validItems.push(item)
    }

    if (validItems.length === 0) return

    motionVideoFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
    motionVideoFilesRef.current = []
    setRemoteMotionVideoUrls([])
    setMotionVideoFiles((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.preview))
      return [...validItems].slice(0, maxVideos)
    })
  }

  const replaceMotionVideoWithFile = async (
    index: number,
    file: File,
    source: MotionReferenceVideoUploaderItem['source'] = 'local',
  ) => {
    const nextItem = await buildMotionVideoItem(file)
    if (!nextItem) return

    if (source === 'remote') {
      setRemoteMotionVideoUrls((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
      motionVideoFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview))
      motionVideoFilesRef.current = []
      setMotionVideoFiles([nextItem])
      return
    }

    setMotionVideoFiles((prev) => {
      const nextFiles = [...prev]
      const existing = nextFiles[index]
      if (!existing) return prev
      URL.revokeObjectURL(existing.preview)
      nextFiles[index] = nextItem
      return nextFiles
    })
  }

  const replaceRemoteImageWithFile = async (index: number, file: File) => {
    if (!(await validateReferenceImageFile(file))) return

    setRemoteImageUrls((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
    setImageFiles((prev) => [
      ...prev,
      {
        file,
        preview: URL.createObjectURL(file),
      },
    ].slice(0, modelConfig.maxImages))
  }

  const replaceImageWithFile = async (index: number, file: File) => {
    if (!(await validateReferenceImageFile(file))) return

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
    applyModelSelection(getAiVideoGeneratorModelConfig(nextModelId))
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
                  {getModelBadgeLabel(option.badge)}
                </span>
              )}
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-500 break-words">{option.description}</span>
            <VideoModelQualityRating value={option.qualityRating} />
            <span className="mt-2 flex flex-wrap gap-1.5">
              {metadata.map((item) => (
                <span
                  key={item.label}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold leading-none ${
                    item.tone === 'positive'
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white/80 text-slate-500'
                  }`}
                  aria-label={item.ariaLabel}
                >
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


  const appendUploadPurposeField = (uploadForm: FormData) => {
    if (!modelConfig.uploadPurpose) return
    uploadForm.append('uploadPurpose', modelConfig.uploadPurpose)
  }

  const uploadImages = async () => {
    if (activeMode !== 'image-to-video') return []

    const imageUrls: string[] = [...remoteImageUrls]
    const uploadUrl = getUploadUrlForModel(modelConfig)

    for (const imageItem of imageFiles) {
      const uploadForm = new FormData()
      uploadForm.append('image', imageItem.file)
      appendUploadPurposeField(uploadForm)

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

      const mediaReference = String(uploadResult.uploadRef || uploadResult.url || '').trim()
      if (!mediaReference) {
        throw new Error(text.uploadRequestFailed)
      }

      imageUrls.push(mediaReference)
    }

    return imageUrls
  }

  const uploadMotionVideos = async () => {
    if (!supportsMotionReferenceVideo) return []

    const motionVideoUrls: string[] = [...remoteMotionVideoUrls]
    const uploadUrl = getUploadUrlForModel(modelConfig)

    for (const videoItem of motionVideoFiles) {
      const uploadForm = new FormData()
      uploadForm.append('file', videoItem.file)
      appendUploadPurposeField(uploadForm)

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

      const mediaReference = String(uploadResult.uploadRef || uploadResult.url || '').trim()
      if (!mediaReference) {
        throw new Error(text.uploadRequestFailed)
      }

      motionVideoUrls.push(mediaReference)
    }

    return motionVideoUrls
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
          outputFormat: request.characterOrientation
            ? JSON.stringify({ duration: request.duration, characterOrientation: request.characterOrientation })
            : `${request.duration}s`,
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

  const pollVideoStatus = async (taskId: string, creditHold?: unknown, taskProvider?: string) => {
    const maxAttempts = 60
    const pollInterval = 5000

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const statusResponse = await fetch('/api/ai-video-generator/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, creditHold: creditHold || null, taskProvider: taskProvider || null }),
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
    if (modelConfig.durationMode === 'reference-video') return null
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
    const requestCreditCost = generationCreditCost
    const authState = await ensureSignedInForGeneration(requestCreditCost)
    if (!authState.isSignedIn) {
      dispatchToolazeTopNotice({
        type: 'warning',
        title: text.signInRequiredTitle,
        message: text.signInRequiredMessage,
      })
      window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
      return
    }
    if (authState.creditsExhausted) {
      setCreditExhaustedModalOpen(true)
      return
    }

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
      motionVideoUrls: remoteMotionVideoUrls,
      characterOrientation: supportsMotionReferenceVideo ? characterOrientation : undefined,
      createdAt: formatLocalTimestampToSeconds(new Date(startedAt).toISOString()),
      startedAt,
      status: 'processing',
    }

    setCurrentRequest(request)
    setRightMode('history')

    try {
      const imageUrls = await uploadImages()
      const motionVideoUrls = await uploadMotionVideos()
      setCurrentRequest((current) => current?.id === request.id ? { ...current, inputUrls: imageUrls, motionVideoUrls } : current)
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
      if (motionVideoUrls.length > 0) {
        formData.append('videoUrls', JSON.stringify(motionVideoUrls))
        formData.append('characterOrientation', characterOrientation)
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
      const creditHold = createResult.creditHold || null
      const taskProvider = String(createResult.taskProvider || '').trim()
      if (!videoUrl && taskId) {
        videoUrl = await pollVideoStatus(taskId, creditHold, taskProvider)
      }
      if (!videoUrl) {
        throw new Error(text.videoGenerationFailed)
      }

      const completedRequest: VideoGenerationRequest = {
        ...request,
        status: 'succeeded',
        taskId: taskId || undefined,
        creditHold,
        taskProvider: taskProvider || undefined,
        videoUrl,
        inputUrls: imageUrls,
        motionVideoUrls,
        characterOrientation: request.characterOrientation,
        inputPreview: request.inputPreview,
      }
      const savedItem = await persistGeneratedVideoHistoryItem(completedRequest, videoUrl, [...imageUrls, ...motionVideoUrls], requestHistoryTool)
      const historyItem: VideoHistoryItem = {
        id: savedItem?.id || completedRequest.id,
        mediaType: 'video',
        model: getVideoHistoryModelSlug(completedRequest.modelId),
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
        motionVideoUrls,
        characterOrientation: completedRequest.characterOrientation,
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
    trackGenerationHistoryRecreateClick({ ...item, mediaType: item.mediaType === 'video' ? 'video' : 'image' }, { surface: 'inline_generator_history' })

    if (item.mediaType === 'image') {
      window.sessionStorage.setItem(PENDING_REPROMPT_STORAGE_KEY, JSON.stringify(buildHistoryRepromptPayload({
        prompt: item.prompt,
        model: item.model,
        outputUrl: item.outputPreview,
        inputUrls: item.inputUrls,
        aspectRatio: item.aspectRatio,
        resolution: item.resolution,
        outputFormat: item.outputFormat,
      })))
      window.location.href = buildHistoryRecreateHref({
        mediaType: 'image',
        model: item.model,
      }, parseLocalePath(pathname).pathLocale || 'en')
      return
    }

    if (!item.modelId) return
    const itemConfig = getAiVideoGeneratorModelConfig(item.modelId)
    setSelectedModelId(item.modelId)
    setActiveModelGroupId(getAiVideoGeneratorModelGroupId(item.modelId))
    setActiveMode(item.inputUrls.length > 0 ? 'image-to-video' : item.mode as AiVideoGeneratorModeId)
    setPrompt(item.prompt)
    setAspectRatio(item.aspectRatio || itemConfig.aspectRatios[0]?.value || '16:9')
    setDuration(item.duration || itemConfig.defaultDuration || itemConfig.durations[0] || 5)
    setResolution(item.resolution || itemConfig.resolutions[0] || '480p')
    setNativeAudio(Boolean(itemConfig.supportsNativeAudio && item.nativeAudio))
    setCharacterOrientation(item.characterOrientation || 'video')
    setRemoteImageUrls(item.inputUrls.slice(0, itemConfig.maxImages))
    setRemoteMotionVideoUrls(itemConfig.supportsMotionReferenceVideo ? (item.motionVideoUrls || []).slice(0, itemConfig.maxVideos || 1) : [])
    setImageFiles((prev) => {
      prev.forEach((image) => URL.revokeObjectURL(image.preview))
      return []
    })
    setMotionVideoFiles((prev) => {
      prev.forEach((video) => URL.revokeObjectURL(video.preview))
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
    mediaType?: 'image' | 'video'
    modelName: string
    mode: SharedHistoryMode
    aspectRatio: string
    duration?: number
    resolution: string
    outputFormat?: string | null
  }, timeLabel: string) => (
    <div data-desktop-history-meta className="flex flex-wrap items-center gap-1">
      {(item.mediaType === 'image'
        ? [
            item.modelName,
            getImageHistoryModeLabel(item.mode, text),
            item.aspectRatio,
            item.resolution,
            item.outputFormat && item.outputFormat !== 'Auto' ? item.outputFormat : '',
            timeLabel,
          ]
        : [
            item.modelName,
            getModeLabel(item.mode as AiVideoGeneratorModeId, text),
            item.aspectRatio,
            item.duration ? `${item.duration}s` : '',
            item.resolution,
            timeLabel,
          ]).filter(Boolean).map((tag, index) => (
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
    <p
      data-video-history-prompt
      className="max-h-[8rem] overflow-y-auto overscroll-contain pr-2 text-sm leading-6 whitespace-pre-wrap text-slate-600"
    >
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
        {item.mediaType === 'video' ? (
          <video
            src={item.outputPreview}
            controls
            playsInline
            className="h-full max-h-[260px] max-w-full object-contain"
          />
        ) : (
          <img
            src={item.outputPreview}
            alt={text.resultReady}
            className="h-full max-h-[260px] max-w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <div data-video-result-details className="flex h-full min-w-0 flex-col gap-4 lg:h-[260px]">
        {renderVideoMetaTags(item, item.time)}
        <div className="flex min-h-0 items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
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
                      {AI_VIDEO_GENERATOR_MODE_OPTIONS.map((mode) => {
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => handleModeChange(mode.id)}
                            className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                              activeMode === mode.id
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {getModeLabel(mode.id, text)}
                          </button>
                        )
                      })}
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
                          onReplace: (file: File) => replaceRemoteImageWithFile(index, file),
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
                      acceptedTypes={modelConfig.acceptedImageMimeTypes?.join(',')}
                      acceptedMimeTypes={modelConfig.acceptedImageMimeTypes}
                      acceptedFileExtensions={modelConfig.acceptedImageExtensions}
                      onFiles={handleFiles}
                      onInvalidType={showImageInvalidTypeNotice}
                      onValidationError={showFileTooLargeNotice}
                      label={modelConfig.maxImages === 1 ? text.uploadYourImage : formatText(text.uploadUpTo, { count: modelConfig.maxImages })}
                      helperText={referenceImageHelperText}
                      uploadLabel={text.upload}
                      replaceLabel={text.replace}
                      deleteLabel={text.delete}
                      size="compact"
                      testIdPrefix="video-reference"
                    />
                  ) : null}

                  {activeMode === 'image-to-video' && supportsMotionReferenceVideo ? (
                    <MotionReferenceVideoUploader
                      selectedVideo={selectedMotionVideo}
                      accept={ACCEPTED_MOTION_REFERENCE_VIDEO_TYPES}
                      title={text.motionReferenceVideo}
                      helperText={motionReferenceVideoHelperText}
                      previewLabel={text.preview}
                      replaceLabel={text.replace}
                      deleteLabel="Delete motion reference video"
                      onUpload={(files) => {
                        if (files?.length) void handleMotionVideoFiles(files)
                      }}
                      onReplace={(item, files) => {
                        if (files?.[0]) void replaceMotionVideoWithFile(item.index, files[0], item.source)
                      }}
                      onPreview={(item) => setMotionVideoPreview({ src: item.src, label: item.label })}
                      onDelete={removeSelectedMotionVideo}
                    />
                  ) : null}

                  <div>
                    <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">{promptLabel}</label>
                    <textarea
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      placeholder={text.promptPlaceholder}
                      rows={4}
                      className="h-[7.5rem] w-full resize-none overflow-y-auto rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm leading-6 text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                    />
                  </div>

                  {activeMode === 'image-to-video' && supportsMotionReferenceVideo ? (
                    <div data-character-orientation>
                      <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">
                        {text.characterOrientation} <span className="text-red-500">*</span>
                      </span>
                      <div role="group" aria-label={text.characterOrientation} className="grid grid-cols-2 gap-2">
                        {(['image', 'video'] as const).map((value) => {
                          const isSelected = characterOrientation === value
                          return (
                            <button
                              key={value}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => handleCharacterOrientationChange(value)}
                              className={getOptionButtonClassName(isSelected)}
                            >
                              {value === 'image' ? text.characterOrientationImage : text.characterOrientationVideo}
                            </button>
                          )
                        })}
                      </div>
                      <p className="mt-2 text-[11px] leading-4 text-slate-500">{text.characterOrientationHelper}</p>
                    </div>
                  ) : null}

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

                    {modelConfig.durationMode === 'reference-video' ? (
                      <div data-video-reference-duration-note className="rounded-xl border border-[#E0E7FF] bg-[#F8FAFF] px-4 py-3 text-xs font-semibold leading-5 text-slate-600">
                        {formatText(text.motionReferenceVideoDurationNote, {
                          min: modelConfig.referenceVideoMinDurationSeconds || 3,
                          max: referenceVideoMaxDurationSeconds,
                        })}
                      </div>
                    ) : (
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
                    )}

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
                      {!isPreparing && shouldShowGenerationCreditCost ? (
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
                            suppressHydrationWarning
                            className="block h-auto max-h-[520px] w-auto max-w-full object-contain"
                            src={demoVideo.src}
                            poster={demoVideo.poster}
                            aria-label={demoVideo.ariaLabel || text.previewHint}
                            controls
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
      {motionVideoPreview && (
        <div
          data-motion-video-preview-dialog
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={motionVideoPreview.label}
          onClick={() => setMotionVideoPreview(null)}
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-950 shadow-2xl shadow-slate-950/40 ring-1 ring-white/10" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
              <p className="min-w-0 truncate text-sm font-bold">{motionVideoPreview.label}</p>
              <button
                type="button"
                onClick={() => setMotionVideoPreview(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close motion reference preview"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <video
              src={motionVideoPreview.src}
              className="block max-h-[78vh] w-full bg-black object-contain"
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      )}
      {creditExhaustedModalOpen && (
        <div
          className="fixed inset-0 z-[10040] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-credit-exhausted-title"
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default rounded-none border-0 bg-transparent p-0"
            aria-label="Close credits dialog"
            onClick={() => setCreditExhaustedModalOpen(false)}
          />
          <div className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] bg-[#fbfaff] p-[1px] shadow-[0_28px_80px_rgba(99,102,241,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.28),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(79,70,229,0.22),transparent_30%),linear-gradient(135deg,rgba(99,102,241,0.45),rgba(217,70,239,0.18),rgba(255,255,255,0))]" />
            <div className="relative rounded-[27px] bg-[#fbfaff] px-5 pb-5 pt-6 text-left sm:px-7 sm:pb-7 sm:pt-8">
              <button
                type="button"
                onClick={() => setCreditExhaustedModalOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-white/90 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-indigo-700 hover:shadow-md"
                aria-label="Close credits dialog"
              >
                <CloseIcon size={18} />
              </button>
              <h2 id="video-credit-exhausted-title" className="max-w-[12rem] pr-10 text-[28px] font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:max-w-none sm:text-3xl">
                {text.creditsUsedUpTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {text.creditsUsedUpMessage}
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-[1.1fr_0.9fr]">
                <Link
                  href={getLocalizedInternalPath(pathname, '/pricing')}
                  onClick={() => setCreditExhaustedModalOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(99,102,241,0.34)]"
                >
                  {text.creditsUsedUpBuyAction}
                </Link>
                <Link
                  href={getLocalizedInternalPath(pathname, '/earn-credits')}
                  onClick={() => setCreditExhaustedModalOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm font-extrabold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-indigo-50"
                >
                  {text.creditsUsedUpEarnAction}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {renderDurationMenu()}
    </section>
  )
}
