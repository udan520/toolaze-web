'use client'

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SiteImage from './SiteImage'
import { trackToolazeEvent } from '@/lib/analytics'
import { getImageUploadUrl } from '@/lib/upload-url'
import { useCommonTranslations } from '@/lib/use-common-translations'
import DeleteIcon from './icons/DeleteIcon'
import CloseIcon from './icons/CloseIcon'
import ImageReplaceButton from './ImageReplaceButton'
import Breadcrumb from './Breadcrumb'
import type { BreadcrumbItem } from './Breadcrumb'
import { calculateImageGenerationCredits } from '@/lib/generation-credits'
import { isCreditExhaustedGenerationError } from '@/lib/generation-error-classifier'
import { downloadImageInCurrentPage } from '@/lib/browser-image-download'
import {
  getDisplayImagePreviewUrl,
  getOriginalHistoryInputImageUrls,
  getReferencePreviewUrl,
  getWrappedHistoryDefaultInputImageUrls,
  normalizeReusableReferenceImageUrl,
} from '@/lib/history-reprompt'
import { getModelDemoImage, shouldUseDirectImageForDemo } from '@/lib/model-demo-images'
import { createOptimisticCreditDeduction } from '@/lib/optimistic-credits'
import type { OptimisticCreditSummary } from '@/lib/optimistic-credits'
import {
  getCachedGenerationAuthState,
  getGenerationAuthStateFromAuthMeResult,
} from '@/lib/generation-auth-state'
import type { GenerationAuthState } from '@/lib/generation-auth-state'
import { getAiImageGenerationToolText } from '@/lib/ai-image-generation-tool-text'
import {
  resolvePromptInsertMode,
  resolvePromptInsertRemoteImageUrls,
  type PromptInsertMode,
} from '@/lib/prompt-insert-mode'
import {
  GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE,
  shouldDeleteGenerationHistoryItem,
} from '@/lib/generation-history-delete-confirm'
import {
  getHistoryToolMetadata,
  getLocalizedInternalPath,
} from '@/lib/generation-history-tool-metadata'
import {
  trackGenerationHistoryDeleteClick,
  trackGenerationHistoryDownloadClick,
  trackGenerationHistoryRecreateClick,
} from '@/lib/generation-history-analytics'
import { formatLocalTimestampToSeconds } from '@/lib/credit-history-time'
import { dispatchToolazeTopNotice } from '@/lib/top-notice'
import { parseLocalePath } from '@/lib/site-language-switch'
import { getGenerationModelLabel, getWrappedHairToolHistoryDisplay } from '@/lib/generation-history-display'

type RightPanelMode = 'sample' | 'generating' | 'history'
type GenerationMediaType = 'image' | 'video'

interface HistoryItem {
  id: string
  inputPreview: string
  inputUrls?: string[]
  outputPreview: string
  mediaType?: GenerationMediaType
  prompt: string
  time: string
  modelId?: ImageModelId
  aspectRatio?: string
  resolution?: string
  outputFormat?: string
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
}

interface PendingGenerationItem {
  id: string
  inputPreview: string
  inputUrls?: string[]
  prompt: string
  startedAt: number
  modelId: ImageModelId
  modelName: string
  mediaType?: GenerationMediaType
  aspectRatio?: string
  resolution?: string
  outputFormat?: string
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
  taskId?: string
  creditHold?: unknown
  restored?: boolean
}

interface FailedGenerationItem extends PendingGenerationItem {
  errorMessage: string
}

const MODEL_CONFIG = {
  'nano-banana-pro': {
    aspectRatios: [
      { value: '1:1', label: '1:1' },
      { value: '2:3', label: '2:3' },
      { value: '3:2', label: '3:2' },
      { value: '3:4', label: '3:4' },
      { value: '4:3', label: '4:3' },
      { value: '4:5', label: '4:5' },
      { value: '5:4', label: '5:4' },
      { value: '9:16', label: '9:16' },
      { value: '16:9', label: '16:9' },
      { value: '21:9', label: '21:9' },
      { value: 'auto', label: 'Auto' },
    ],
    maxImages: 8,
    supportsOutputFormat: true,
    supportsHighResolution: false,
    maxFileSizeMb: 30,
  },
  'nano-banana-2': {
    aspectRatios: [
      { value: 'auto', label: 'Auto' },
      { value: '1:1', label: '1:1' },
      { value: '1:4', label: '1:4' },
      { value: '1:8', label: '1:8' },
      { value: '2:3', label: '2:3' },
      { value: '3:2', label: '3:2' },
      { value: '3:4', label: '3:4' },
      { value: '4:1', label: '4:1' },
      { value: '4:3', label: '4:3' },
      { value: '4:5', label: '4:5' },
      { value: '5:4', label: '5:4' },
      { value: '8:1', label: '8:1' },
      { value: '9:16', label: '9:16' },
      { value: '16:9', label: '16:9' },
      { value: '21:9', label: '21:9' },
    ],
    maxImages: 14,
    supportsOutputFormat: true,
    supportsHighResolution: true,
    maxFileSizeMb: 30,
  },
  'gpt-image-2': {
    aspectRatios: [
      { value: 'auto', label: 'Auto' },
      { value: '1:1', label: '1:1' },
      { value: '9:16', label: '9:16' },
      { value: '16:9', label: '16:9' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
    ],
    maxImages: 16,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    maxFileSizeMb: 30,
  },
  'grok-1-5-image': {
    aspectRatios: [
      { value: 'auto', label: 'Auto' },
      { value: '1:1', label: '1:1' },
      { value: '9:16', label: '9:16' },
      { value: '16:9', label: '16:9' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
    ],
    maxImages: 1,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    maxFileSizeMb: 30,
  },
  'grok-video-1-5': {
    aspectRatios: [
      { value: '9:16', label: '9:16' },
      { value: '16:9', label: '16:9' },
    ],
    maxImages: 1,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    maxFileSizeMb: 30,
  },
  'seedream-4-5': {
    aspectRatios: [
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
      { value: '2:3', label: '2:3' },
      { value: '3:2', label: '3:2' },
      { value: '21:9', label: '21:9' },
    ],
    maxImages: 14,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    maxFileSizeMb: 10,
  },
  'seedream-5-0-lite': {
    aspectRatios: [
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
      { value: '2:3', label: '2:3' },
      { value: '3:2', label: '3:2' },
      { value: '21:9', label: '21:9' },
    ],
    maxImages: 14,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    maxFileSizeMb: 10,
  },
  'seedream-5-0-pro': {
    aspectRatios: [
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
      { value: '2:3', label: '2:3' },
      { value: '3:2', label: '3:2' },
      { value: '21:9', label: '21:9' },
    ],
    maxImages: 14,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    maxFileSizeMb: 10,
  },
  'wan-2-7-image': {
    aspectRatios: [
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' },
      { value: '3:4', label: '3:4' },
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
    ],
    maxImages: 9,
    supportsOutputFormat: false,
    supportsHighResolution: true,
    maxFileSizeMb: 10,
  },
} as const

type ImageModelId = keyof typeof MODEL_CONFIG

const PENDING_GENERATION_STORAGE_KEY = 'toolaze:image-generation-pending:v1'
const VIDEO_DURATION_OPTIONS = [5, 8, 10, 15] as const
const DEFAULT_VIDEO_DURATION_SECONDS = 8

function getConfiguredVideoDurationSeconds(durationSeconds?: number): number {
  return VIDEO_DURATION_OPTIONS.includes(durationSeconds as typeof VIDEO_DURATION_OPTIONS[number])
    ? durationSeconds as typeof VIDEO_DURATION_OPTIONS[number]
    : DEFAULT_VIDEO_DURATION_SECONDS
}

function getGenerationMediaType(modelId: ImageModelId): GenerationMediaType {
  return modelId === 'grok-video-1-5' ? 'video' : 'image'
}

function getGeneratedFileExtension(item: { mediaType?: GenerationMediaType }): string {
  return item.mediaType === 'video' ? 'mp4' : 'png'
}

type GenerationPollResult = {
  outputUrl: string
  mediaType: GenerationMediaType
}

interface PersistedGenerationHistoryItem {
  id?: string
  model?: string
  prompt?: string
  outputUrl?: string
  inputUrls?: string[]
  aspectRatio?: string | null
  resolution?: string | null
  outputFormat?: string | null
  mediaType?: string | null
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
  createdAt?: string
}

function isImageModelId(value: unknown): value is ImageModelId {
  return typeof value === 'string' && value in MODEL_CONFIG
}

function mapPersistedHistoryItem(item: PersistedGenerationHistoryItem): HistoryItem | null {
  const id = String(item?.id || '').trim()
  const outputPreview = String(item?.outputUrl || '').trim()
  const prompt = String(item?.prompt || '').trim()
  if (!id || !outputPreview || !prompt) return null

  const rawInputUrls = Array.isArray(item.inputUrls)
    ? item.inputUrls.filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
    : []
  const normalizedItem = {
    model: item.model,
    outputUrl: outputPreview,
    inputPreview: rawInputUrls[0] || '',
    inputUrls: rawInputUrls,
    toolSlug: item.toolSlug || null,
    sourcePath: item.sourcePath || null,
  }
  const inputUrls = rawInputUrls.length > 0
    ? rawInputUrls
    : getWrappedHistoryDefaultInputImageUrls(normalizedItem)

  return {
    id,
    inputPreview: inputUrls[0] || '',
    inputUrls,
    outputPreview,
    mediaType: item.mediaType === 'video' ? 'video' : 'image',
    prompt,
    time: formatLocalTimestampToSeconds(item.createdAt || new Date().toISOString()),
    modelId: isImageModelId(item.model) ? item.model : undefined,
    aspectRatio: item.aspectRatio || undefined,
    resolution: item.resolution || undefined,
    outputFormat: item.outputFormat || undefined,
    toolSlug: item.toolSlug || null,
    toolLabel: item.toolLabel || null,
    sourcePath: item.sourcePath || null,
  }
}

function getPersistedHistoryCreatedAtMs(item: PersistedGenerationHistoryItem): number {
  const createdAtMs = Date.parse(item.createdAt || '')
  return Number.isFinite(createdAtMs) ? createdAtMs : 0
}

function sortPersistedHistoryItemsNewestFirst(items: PersistedGenerationHistoryItem[]): PersistedGenerationHistoryItem[] {
  return [...items].sort((a, b) => getPersistedHistoryCreatedAtMs(b) - getPersistedHistoryCreatedAtMs(a))
}

function normalizeStoredPendingGenerationItem(item: unknown): PendingGenerationItem | null {
  if (!item || typeof item !== 'object') return null
  const candidate = item as Partial<PendingGenerationItem>
  const id = String(candidate.id || '').trim()
  const prompt = String(candidate.prompt || '').trim()
  const modelId = candidate.modelId
  const startedAt = Number(candidate.startedAt)

  if (!id || !prompt || !isImageModelId(modelId) || !Number.isFinite(startedAt)) return null

  const inputUrls = Array.isArray(candidate.inputUrls)
    ? candidate.inputUrls.filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
    : []
  const taskId = typeof candidate.taskId === 'string' && candidate.taskId.trim()
    ? candidate.taskId.trim()
    : undefined

  return {
    id,
    inputPreview: typeof candidate.inputPreview === 'string' ? candidate.inputPreview : inputUrls[0] || '',
    inputUrls,
    prompt,
    startedAt,
    modelId,
    modelName: typeof candidate.modelName === 'string' && candidate.modelName.trim()
      ? candidate.modelName.trim()
      : modelId,
    aspectRatio: typeof candidate.aspectRatio === 'string' ? candidate.aspectRatio : undefined,
    resolution: typeof candidate.resolution === 'string' ? candidate.resolution : undefined,
    outputFormat: typeof candidate.outputFormat === 'string' ? candidate.outputFormat : undefined,
    mediaType: candidate.mediaType === 'video' ? 'video' : 'image',
    toolSlug: typeof candidate.toolSlug === 'string' ? candidate.toolSlug : null,
    toolLabel: typeof candidate.toolLabel === 'string' ? candidate.toolLabel : null,
    sourcePath: typeof candidate.sourcePath === 'string' ? candidate.sourcePath : null,
    taskId,
    creditHold: candidate.creditHold,
    restored: true,
  }
}

function getStoredPendingGenerationItems(): PendingGenerationItem[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.sessionStorage.getItem(PENDING_GENERATION_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map(normalizeStoredPendingGenerationItem)
      .filter((item): item is PendingGenerationItem => Boolean(item))
      .sort((a, b) => b.startedAt - a.startedAt)
  } catch {
    window.sessionStorage.removeItem(PENDING_GENERATION_STORAGE_KEY)
    return []
  }
}

interface ImageItem {
  file: File
  preview: string
}

interface PromptInsertEventDetail {
  prompt?: string
  imageUrl?: string
  imageUrls?: string[]
  imageName?: string
  demoImageUrl?: string
  demoImageTitle?: string
  demoImageWidth?: number
  demoImageHeight?: number
  modelId?: ImageModelId
  aspectRatio?: string
  resolution?: string
  outputFormat?: string
  mode?: PromptInsertMode
  presetLabel?: string
  presetGroup?: string
}

interface PromptDemoImage {
  url: string
  title: string
  width: number
  height: number
  mediaType?: GenerationMediaType
  poster?: string
}

interface PromptPreset {
  label: string
  prompt?: string
  color?: string
  swatch?: string
  image?: string
  group?: string
  referenceImage?: string
}

interface PromptPresetTab {
  id: string
  label: string
}

interface PromptModifierOption {
  label: string
  prompt: string
  value?: string
}

interface PromptModifierConfig {
  title: string
  options: PromptModifierOption[]
  defaultValue?: string
}

const EMPTY_PROMPT_PRESETS: PromptPreset[] = []
const EMPTY_PROMPT_PRESET_TABS: PromptPresetTab[] = []

const AUTH_CACHE_STORAGE_KEY = 'toolaze.authSnapshot'
type DesktopPromptTooltipState = {
  text: string
  left: number
  top: number
  width: number
} | null
type RemoteReferenceImageState = 'loading' | 'loaded' | 'retrying' | 'failed'

const promptPreviewClampStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}

const composePromptParts = (...parts: Array<string | undefined>) =>
  parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' ')

const HAIR_COLOR_SWATCHES: Record<string, string> = {
  'rose pink': 'linear-gradient(135deg, #f9a8d4, #db2777)',
  'honey blonde': 'linear-gradient(135deg, #fde68a, #d97706)',
  'platinum blonde': 'linear-gradient(135deg, #fff7ed, #d6d3d1)',
  'copper brown': 'linear-gradient(135deg, #fb923c, #92400e)',
  'burgundy red': 'linear-gradient(135deg, #fda4af, #991b1b)',
  'cherry red': 'linear-gradient(135deg, #ef4444, #7f1d1d)',
  'silver gray': 'linear-gradient(135deg, #f8fafc, #64748b)',
  'ash brown': 'linear-gradient(135deg, #a8a29e, #57534e)',
  'jet black': 'linear-gradient(135deg, #27272a, #020617)',
  'blue black': 'linear-gradient(135deg, #0f172a, #1d4ed8)',
  'lavender purple': 'linear-gradient(135deg, #ddd6fe, #7c3aed)',
}

const getPromptPresetSwatchStyle = (preset: PromptPreset): React.CSSProperties => {
  const swatch = (preset.swatch || preset.color || HAIR_COLOR_SWATCHES[preset.label.toLowerCase()] || 'linear-gradient(135deg, #6366f1, #ec4899)').trim()

  if (swatch.includes('gradient(')) {
    return {
      background: swatch,
      backgroundImage: swatch,
      backgroundColor: '#f472b6',
    }
  }

  return {
    background: swatch,
    backgroundColor: swatch,
  }
}

interface AiImageGenerationToolProps {
  modelId?: ImageModelId
  modelName?: string
  dailyLimitStorageKey?: string
  presetMode?: 'default' | 'ai-couple-photo-maker'
  defaultMode?: 'image-to-image' | 'text-to-image'
  defaultPrompt?: string
  defaultImageUrls?: string[]
  defaultVideoDurationSeconds?: number
  maxUploadImages?: number
  hideModelBranding?: boolean
  sampleImageVariant?: 'default' | 'sharp'
  sampleImages?: Array<{
    url: string
    title?: string
    width?: number
    height?: number
    mediaType?: GenerationMediaType
    poster?: string
  }>
  fitParentHeight?: boolean
  plainRightPanel?: boolean
  promptPresets?: PromptPreset[]
  promptPresetTitle?: string
  promptPresetTabs?: PromptPresetTab[]
  hidePresetPromptInput?: boolean
  hidePromptInput?: boolean
  defaultAspectRatio?: string
  customPromptTabId?: string
  promptModifier?: PromptModifierConfig
  compactResultPanel?: boolean
  sceneText?: {
    uploadTitle?: string
    uploadHelper?: string
    promptLabel?: string
    promptPlaceholder?: string
    generateLabel?: string
    safetyHelper?: string
  }
  heroBreadcrumbItems?: BreadcrumbItem[]
  heroEyebrow?: ReactNode
  heroTitle?: ReactNode
  heroDescription?: ReactNode
  initialTranslations?: any
}

interface ModelOption {
  id: ImageModelId
  name: string
  description: string
  qualityRating: number
  badge?: 'Hot' | 'New'
}

interface ModelGroup {
  id: string
  name: string
  description: string
  logoSrc: string
  logoAlt: string
  models: ModelOption[]
}

const MODEL_GROUPS: ModelGroup[] = [
  {
    id: 'openai-gpt',
    name: 'OpenAI GPT',
    description: 'Structured image generation and controlled edits.',
    logoSrc: '/model-logos/openai.svg',
    logoAlt: 'OpenAI logo',
    models: [
      {
        id: 'gpt-image-2',
        name: 'GPT Image 2',
        description: 'Create structured images, marketing visuals, mockups, and image edits.',
        qualityRating: 5,
        badge: 'Hot',
      },
    ],
  },
  {
    id: 'xai',
    name: 'xAI',
    description: 'Grok generation for fast creative drafts, images, and video scenes.',
    logoSrc: '/favicon.svg',
    logoAlt: 'xAI logo',
    models: [
      {
        id: 'grok-video-1-5',
        name: 'Grok Video 1.5',
        description: 'Create short dance videos from one reference image and a motion prompt.',
        qualityRating: 4,
        badge: 'New',
      },
      {
        id: 'grok-1-5-image',
        name: 'Grok 1.5 Image',
        description: 'Create image drafts, stylized scenes, and prompt-led visuals.',
        qualityRating: 4,
        badge: 'New',
      },
    ],
  },
  {
    id: 'seedream',
    name: 'Seedream',
    description: 'Commercial image generation, reference editing, and design layouts.',
    logoSrc: '/model-logos/dreamina.ico',
    logoAlt: 'Dreamina logo',
    models: [
      {
        id: 'seedream-5-0-pro',
        name: 'Seedream 5.0 Pro',
        description: 'Higher quality Seedream workflow for polished product and campaign images.',
        qualityRating: 5,
        badge: 'New',
      },
      {
        id: 'seedream-5-0-lite',
        name: 'Seedream 5.0 Lite',
        description: 'Fast Seedream workflow for drafts, concepts, and lightweight iterations.',
        qualityRating: 4.5,
      },
      {
        id: 'seedream-4-5',
        name: 'Seedream 4.5',
        description: 'Reference-aware image generation for posters, products, and typography.',
        qualityRating: 4,
      },
    ],
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    description: 'Reference-heavy image editing and multi-image creative workflows.',
    logoSrc: '/model-logos/google-gemini.png',
    logoAlt: 'Google Gemini logo',
    models: [
      {
        id: 'nano-banana-pro',
        name: 'Nano Banana Pro',
        description: 'Reliable image editing workflow for style transfer and reference-guided output.',
        qualityRating: 5,
      },
      {
        id: 'nano-banana-2',
        name: 'Nano Banana 2',
        description: 'Newer multi-reference image workflow with high-resolution output.',
        qualityRating: 4,
      },
    ],
  },
  {
    id: 'wan-ai',
    name: 'Wan AI',
    description: 'Thinking-mode image generation and multi-reference composition.',
    logoSrc: '/model-logos/wan.ico',
    logoAlt: 'Wan AI logo',
    models: [
      {
        id: 'wan-2-7-image',
        name: 'Wan 2.7 Image',
        description: 'Create images with multi-reference support and structured visual reasoning.',
        qualityRating: 4,
      },
    ],
  },
]

const getFlatModelOptions = () => MODEL_GROUPS.flatMap((group) => group.models)

const getModelGroupId = (modelId: ImageModelId) =>
  MODEL_GROUPS.find((group) => group.models.some((model) => model.id === modelId))?.id || MODEL_GROUPS[0].id

const TEXT_TO_IMAGE_DEFAULT_MODELS: ImageModelId[] = ['gpt-image-2', 'grok-1-5-image', 'seedream-4-5', 'seedream-5-0-lite', 'seedream-5-0-pro', 'wan-2-7-image']

const getDefaultTabForModel = (id: ImageModelId): 'image-to-image' | 'text-to-image' =>
  TEXT_TO_IMAGE_DEFAULT_MODELS.includes(id) ? 'text-to-image' : 'image-to-image'

const getDefaultAspectRatioForModel = (id: ImageModelId, presetMode: AiImageGenerationToolProps['presetMode']): string => {
  if (id === 'grok-video-1-5') return '9:16'

  const ratioOptions = presetMode === 'ai-couple-photo-maker'
    ? WRAPPED_IMAGE_PLAY_RATIO_OPTIONS
    : MODEL_CONFIG[id].aspectRatios

  return ratioOptions.some((item) => item.value === '16:9')
    ? '16:9'
    : ratioOptions[0]?.value || 'auto'
}

const getResolutionOptionsForModel = (id: ImageModelId): string[] =>
  id === 'grok-video-1-5'
    ? ['480p', '720p', '1080p']
    : id === 'seedream-5-0-pro'
      ? ['1K', '2K']
      : ['1K', '2K', '4K']

const getDefaultResolutionForModel = (id: ImageModelId): string =>
  getResolutionOptionsForModel(id)[0] || '1K'

function getModelOptionMetadata(id: ImageModelId): string[] {
  const resolutionOptions = getResolutionOptionsForModel(id)
  const maxResolution = resolutionOptions[resolutionOptions.length - 1] || '1K'
  const creditCosts = resolutionOptions.map((option) => calculateImageGenerationCredits(id, option))
  const minCredits = Math.min(...creditCosts)
  const creditLabel = `${minCredits} credits +`

  return [creditLabel, `Max ${maxResolution}`]
}

function ModelQualityRating({ value }: { value: number }) {
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

const WRAPPED_IMAGE_PLAY_RATIO_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
  { value: '5:4', label: '5:4' },
  { value: '4:5', label: '4:5' },
  { value: '1:1', label: '1:1' },
  { value: '21:9', label: '21:9' },
] as const

const PENDING_REPROMPT_STORAGE_KEY = 'toolaze:pending-reprompt'
const EMPTY_DEFAULT_IMAGE_URLS: string[] = []
const GENERIC_IMAGE_EDIT_TOOL_SLUGS = new Set(['ai-image-generator', 'ai-image-to-image-generator'])

const areStringArraysEqual = (left: string[], right: string[]) =>
  left.length === right.length && left.every((item, index) => item === right[index])

const isGenericImageEditToolPath = (pathname: string) =>
  GENERIC_IMAGE_EDIT_TOOL_SLUGS.has(parseLocalePath(pathname).segments[0] || '')

function shouldUploadReferenceUrlForGeneration(url: string): boolean {
  if (url.startsWith('/')) return true
  if (typeof window === 'undefined') return false

  try {
    const parsed = new URL(url, window.location.origin)
    return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(parsed.hostname)
  } catch {
    return false
  }
}

function getReferenceImageFileName(url: string, index: number): string {
  const cleanPath = url.split('?')[0]?.split('#')[0] || ''
  const name = cleanPath.split('/').filter(Boolean).pop()
  return name || `reference-${index + 1}.png`
}

async function uploadRemoteReferenceUrlsForGeneration(
  urls: string[],
  uploadUrl: string,
  uploadFailedMessage: string,
): Promise<string[]> {
  const nextUrls: string[] = []

  for (const [index, url] of urls.entries()) {
    if (!shouldUploadReferenceUrlForGeneration(url)) {
      nextUrls.push(url)
      continue
    }

    const imageResponse = await fetch(url)
    if (!imageResponse.ok) {
      throw new Error(uploadFailedMessage)
    }

    const blob = await imageResponse.blob()
    const uploadForm = new FormData()
    uploadForm.append('image', blob, getReferenceImageFileName(url, index))

    const uploadResponse = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
    if (!uploadResponse.ok) {
      throw new Error(uploadFailedMessage)
    }

    const result = await uploadResponse.json().catch(() => ({}))
    if (typeof result.url !== 'string' || !result.url.startsWith('http')) {
      throw new Error(uploadFailedMessage)
    }

    nextUrls.push(result.url)
  }

  return nextUrls
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

function dispatchCreditsUpdated(credits: OptimisticCreditSummary | unknown) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('toolaze:credits-updated', {
    detail: credits || null,
  }))
}

function startOptimisticCreditDeduction(requiredCredits: number): (() => void) | null {
  if (typeof window === 'undefined') return null

  const change = createOptimisticCreditDeduction(
    window.sessionStorage.getItem(AUTH_CACHE_STORAGE_KEY),
    requiredCredits,
  )
  if (!change) return null

  dispatchCreditsUpdated(change.next)
  return () => dispatchCreditsUpdated(change.previous)
}

async function requestImageGenerationTask(formData: FormData, toolText: Record<string, string>): Promise<Response> {
  const send = () => fetch('/api/image-to-image', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  try {
    return await send()
  } catch (error: any) {
    const msg = error?.message || ''
    if (msg.includes('fetch') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      try {
        return await send()
      } catch {
        throw new Error(toolText.networkFailed)
      }
    }
    throw error
  }
}

type CoupleTemplateCategory = 'style'

interface CoupleTemplate {
  id: string
  title: string
  prompt: string
  category: CoupleTemplateCategory
  image?: string
}

const NANO_BANANA_2_COUPLE_TEMPLATES: CoupleTemplate[] = [
  {
    id: 'rainy-eiffel',
    title: 'Rainy Paris + Eiffel Tower',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/rainy-eiffel-4x3.jpg',
    prompt:
      'Medium frontal portrait of a couple standing side-by-side under a large transparent umbrella on a rainy Paris street, both facing the camera. Both subjects MUST match the facial features, identity, and appearance of the uploaded reference images, with no deviation. Both subjects are wearing coordinated elegant evening outfits with refined styling. They stand close together under the umbrella, subtle intimacy, joyful and confident expressions. Background: a rainy Paris street with the Eiffel Tower softly glowing in the misty distance. Wet pavement reflecting warm street lamps and city lights. Cinematic rain atmosphere with visible rain droplets on the transparent umbrella, soft diffusion from moisture in the air. Lighting: moody cinematic lighting with contrast between warm street lights and cool rainy tones. Extremely realistic skin texture, hyper-detailed, sharp focus, premium editorial photography. Lens: 50mm, shallow depth of field, subjects in sharp focus, background softly blurred. Color grading: rich, vibrant, high-end cinematic style.',
  },
  {
    id: 'rooftop',
    title: 'Rooftop Night',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/rooftop-4x3.jpg',
    prompt:
      'Medium frontal portrait of a stylish couple standing side-by-side at a rooftop bar at night, both facing the camera. Both subjects MUST match the facial features, identity, and appearance of the uploaded reference images, with no deviation. Both subjects are wearing modern upscale evening outfits suitable for a rooftop setting. They are each holding a champagne glass, standing close together with subtle intimacy, relaxed and confident expressions. Background: a high-end rooftop bar with a stunning city skyline at night, filled with glowing neon lights and soft bokeh. Glass railings and modern architectural elements subtly visible. Lighting: warm ambient lighting from the bar mixed with cool city light reflections, creating cinematic contrast and a modern luxury atmosphere. Extremely realistic skin texture, hyper-detailed, sharp focus, premium editorial lifestyle photography. Lens: 50mm, shallow depth of field, subjects in sharp focus, background smoothly blurred with rich bokeh. Color grading: high contrast, rich tones, modern luxury cinematic style.',
  },
  {
    id: 'red-carpet',
    title: 'Red Carpet Event',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/red-carpet-4x3.jpg',
    prompt:
      'Medium frontal portrait of a glamorous couple standing shoulder-to-shoulder on a red carpet, both facing the camera. Both subjects MUST match the facial features, identity, and appearance of the uploaded reference images, with no deviation. Both subjects are wearing premium red-carpet formal outfits with black and gold accents. They stand close together with confident and elegant posture, maintaining refined expressions and strong eye contact with the camera. Composition: centered and symmetrical framing, clean foreground with the couple as the clear focal point. Background: a red carpet event setting with a softly blurred crowd, subtle silhouettes, and controlled camera flash bokeh, ensuring no background figures are sharp or distracting. Lighting: cinematic, high-fashion lighting with soft key light on faces and subtle rim light separation, combined with gentle flash highlights for a premium editorial look. Extremely realistic skin texture, clean and sharp facial details, high resolution, premium fashion photography. Lens: 50mm, shallow depth of field, subjects in crisp focus, background smoothly blurred. Color grading: high contrast with rich blacks and luminous gold tones, modern luxury editorial style.',
  },
  {
    id: 'candlelight-dinner',
    title: 'Candlelight Dinner',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/candlelight-dinner-4x3.jpg',
    prompt:
      'Intimate frontal portrait of a couple seated at a candlelit dinner table in a sophisticated restaurant. Both subjects are looking and smiling at the camera, holding up fine red wine glasses for a toast. Their faces are softly illuminated by the warm, flickering orange glow of many candles on the table. Soft bokeh of a luxury dimly lit interior in the background. Dramatic shadows, deeply romantic atmosphere, hyper-realistic skin texture, elegant formal evening outfits.',
  },
  {
    id: 'rose-wall',
    title: 'Rose Wall',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/rose-wall-4x3.jpg',
    prompt:
      'Medium frontal portrait of a happily smiling couple standing side-by-side. One subject holds a luxurious bouquet of deep red roses with velvet ribbon, while the other leans naturally on their partner\'s shoulder, both looking confidently at the camera. Background is a lush, textured wall of red rose. Sunlight filtering through leaves (dappled light), extremely realistic skin texture, vibrant and rich colors, romantic high-end lifestyle photography.',
  },
  {
    id: 'opera-formal',
    title: 'Opera Formal',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/opera-formal-4x3.jpg',
    prompt:
      'Medium frontal portrait of a couple standing side-by-side on the grand staircase of an opulent opera house, both facing the camera. Both subjects MUST match the facial features, identity, and appearance of the uploaded reference images, with no deviation. Subject A has polished styling and is wearing a premium formal outfit. Subject B is wearing a shimmering formal outfit, with their arm elegantly linked with their partner. They stand centered on a plush red-carpeted staircase, with confident and joyful expressions, maintaining a poised and regal posture. Background: a luxurious opera house interior with gilded arches, a massive crystal chandelier overhead, and rich red velvet curtains. Architectural symmetry emphasized. Lighting: warm, golden cinematic lighting inspired by reference images, casting soft highlights on skin and fabric, with gentle falloff and dramatic shadows for depth. Extremely realistic skin texture, clean and detailed facial features, high sharpness, premium editorial photography. Lens: 50mm, shallow depth of field, subjects in sharp focus, background slightly softened while preserving grandeur. Color grading: rich gold and deep red tones, high contrast, cinematic luxury style.',
  },
  {
    id: 'beach-outdoor',
    title: 'Beach Outdoor',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/beach-outdoor-4x3.jpg',
    prompt:
      'Medium close-up frontal portrait of a couple, both facing the camera. Both subjects MUST match the facial features, identity, and appearance of the uploaded reference images, with no deviation. Subject B has neatly styled hair and is wearing an elegant white ceremonial outfit with refined details. Subject B leans gently toward Subject A with a joyful and relaxed expression. Subject A has polished styling and is wearing a tailored navy formal outfit with refined details. Both are smiling radiantly and confidently, maintaining natural intimacy and a relaxed posture. Composition: symmetrical, centered on their faces, filling the center third of the frame. Lighting: soft natural sunlight filtering through unseen palm leaves, creating dappled light patterns across their faces and shoulders, warm and organic highlights with gentle shadow contrast. Background: softly blurred lush palm foliage with subtle hints of ocean waves, creating a tropical, romantic atmosphere. Extremely realistic skin texture, clean and detailed facial features, high sharpness, premium lifestyle wedding photography. Lens: 50mm, shallow depth of field, subjects in crisp focus, background smoothly blurred. Color grading: warm, soft, inviting tones with a high-end editorial finish.',
  },
  {
    id: 'garden-tea',
    title: 'Garden Tea',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/garden-tea-4x3.jpg',
    prompt:
      'Medium frontal portrait of a couple sitting close together at an elegant outdoor tea table in a lush, sunlit garden, both facing the camera. Both subjects MUST match the facial features, identity, and appearance of the uploaded reference images, with no deviation. Both subjects are wearing coordinated elegant garden-party outfits. They are seated side-by-side, leaning slightly toward each other with relaxed posture, smiling warmly and confidently at the camera. Composition: centered and symmetrical framing, medium shot, with both faces clearly visible and unobstructed, table elements placed neatly in the foreground. Table details: a refined tea setting with delicate macarons, teacups, and tableware arranged neatly and not blocking the subjects. Lighting: soft natural sunlight filtering through leaves, creating controlled dappled light patterns across their faces, clothing, and table, with balanced highlights and gentle shadows. Background: a lush garden with greenery, flowers, and soft palm elements, smoothly blurred to create depth while maintaining a bright and airy atmosphere. Extremely realistic skin texture, clean facial details, high resolution, sharp focus, premium high-fashion lifestyle photography. Lens: 50mm, shallow depth of field, subjects in crisp focus, foreground and background softly blurred. Color grading: soft pastel tones with warm highlights, refined and elegant editorial finish.',
  },
  {
    id: 'snow-ring',
    title: 'Snow + Ring',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/snow-ring-4x3.jpg',
    prompt:
      'Medium frontal portrait of a couple standing close together in a romantic setting surrounded by abundant red rose arrangements, both facing the camera. Both subjects MUST match the facial features, identity, and appearance of the uploaded reference images, with no deviation. Subject A is holding a luxurious bouquet of deep red roses wrapped with a velvet ribbon, positioned slightly to the side and below chest level to keep both faces fully visible. Subject B gently leans toward Subject A, with a warm and elegant smile, showing natural intimacy. Both are looking directly at the camera with confident, joyful expressions. Composition: centered and symmetrical framing, medium close-up, with both subjects clearly visible and unobstructed. Environment: layered rose arrangements including foreground bouquets, mid-ground floral clusters, and soft background rose decor, creating depth instead of a flat wall. Background: softly blurred romantic floral setting with rich red tones, subtle greenery accents, and hints of a styled indoor or garden environment. Lighting: soft natural light combined with gentle warm highlights, creating a romantic glow with controlled dappled light and balanced shadows. Extremely realistic skin texture, clean facial details, high resolution, sharp focus, premium lifestyle photography. Lens: 50mm, shallow depth of field, subjects in crisp focus, foreground and background softly blurred for depth. Color grading: rich, controlled reds with warm cinematic tones, avoiding oversaturation while maintaining vibrancy, high-end editorial finish.',
  },
  {
    id: 'cozy-home',
    title: 'Cozy Home',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/cozy-home-4x3.jpg',
    prompt:
      'Medium frontal portrait of a couple in their early 30s seated closely together on a plush cream-colored sofa in a warm and cozy living room, both facing the camera. Both subjects MUST match the facial features, identity, and appearance of the uploaded reference images, with no deviation. Subject A is wearing a cozy knit outfit, with an arm gently around Subject B. Subject B is wearing a soft cream home outfit, snuggled closely with their head resting on Subject A\'s shoulder, holding a warm mug. Both are smiling naturally and warmly, with relaxed expressions and subtle intimacy. Composition: centered and balanced, medium close framing, the couple filling the central area with clean, symmetrical composition. Lighting: soft warm ambient lighting from a nearby fireplace combined with gentle diffused indoor light, creating natural highlights and soft shadow transitions across their faces. Background: a tastefully styled living room with softly blurred bookshelves, potted plants, textured walls, and a glowing fireplace, providing depth while keeping focus on the subjects. Extremely realistic skin texture, clean facial details, high resolution, sharp focus, premium lifestyle photography. Lens: 50mm, shallow depth of field, subjects in crisp focus, background smoothly blurred. Color grading: warm, soft, inviting tones with a refined high-end editorial finish.',
  },
  {
    id: 'sunset-beach',
    title: 'Sunset Beach',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/sunset-beach-4x3.jpg',
    prompt:
      'Medium frontal portrait of a couple standing side-by-side on a beach during sunset, both facing the camera. Both subjects MUST match the facial features of the uploaded reference images. Subject A is holding a bouquet of flowers, Subject B gently leaning toward Subject A. Both are smiling softly and confidently. Golden sunset light casting warm glow, soft rim light around their hair. Ocean waves and horizon visible in the background, sky filled with orange, pink, and purple tones. Wind slightly moving hair and clothes, romantic cinematic atmosphere. Extremely realistic skin texture, high detail, premium lifestyle photography, 50mm lens, shallow depth of field.',
  },
  {
    id: 'mountain',
    title: 'Mountain Peak',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/mountain-4x3.jpg',
    prompt:
      'Medium frontal portrait of a couple standing together on a mountain peak, both facing the camera. Both subjects MUST match the facial features of the uploaded reference images. They are wearing stylish outdoor clothing, standing close together with subtle physical interaction (hand on shoulder or holding hands). Background shows dramatic mountains, snow-covered peaks, and vast sky. Natural sunlight with cinematic contrast, slightly cool tone. Wind blowing slightly, giving dynamic motion to clothing and hair. Extremely realistic skin texture, sharp focus, cinematic outdoor photography, high-end editorial style.',
  },
  {
    id: 'night-street',
    title: 'Night Street',
    category: 'style',
    image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-couple-photo-maker/night-street-4x3.jpg',
    prompt:
      'Medium frontal portrait of a couple standing side-by-side in a city at night, both facing the camera. Both subjects MUST match the facial features of the uploaded reference images. City lights, neon signs, and blurred traffic lights in the background creating strong bokeh. Cool and cinematic lighting with contrast between warm and cool tones. The couple dressed in stylish urban outfits, confident expression, slight intimacy. Extremely realistic skin texture, sharp focus on subjects, background softly blurred, premium editorial photography.',
  },
]

const COUPLE_IDENTITY_LOCK_INSTRUCTION =
  'Identity lock (strict): Keep exactly the same two people from the uploaded references. Preserve each person\'s facial structure, hairstyle, skin tone, body shape, and gender presentation. Do not swap identities, do not add a third person, and do not introduce male traits (such as beard, mustache, or masculinized facial/jaw features) if they are not present in the references.'

export default function AiImageGenerationTool({
  modelId = 'nano-banana-pro',
  modelName = 'Nano Banana Pro',
  dailyLimitStorageKey = 'nano_banana_last_used_date',
  presetMode = 'default',
  defaultMode,
  defaultPrompt = '',
  defaultImageUrls = EMPTY_DEFAULT_IMAGE_URLS,
  defaultVideoDurationSeconds,
  maxUploadImages,
  hideModelBranding = false,
  sampleImageVariant = 'default',
  sampleImages,
  fitParentHeight = false,
  plainRightPanel = false,
  promptPresets = EMPTY_PROMPT_PRESETS,
  promptPresetTitle = 'Hair Color Presets',
  promptPresetTabs = EMPTY_PROMPT_PRESET_TABS,
  hidePresetPromptInput = false,
  hidePromptInput = false,
  defaultAspectRatio,
  customPromptTabId = 'custom',
  promptModifier,
  compactResultPanel = false,
  sceneText,
  heroBreadcrumbItems,
  heroEyebrow,
  heroTitle,
  heroDescription,
  initialTranslations,
}: AiImageGenerationToolProps = {}) {
  const pathname = usePathname()
  const hasImagePromptPresets = promptPresets.some((preset) => Boolean(preset.image))
  const commonTranslations = useCommonTranslations(initialTranslations)
  const commonToolText = commonTranslations?.common?.tool
  const defaultToolText = {
    imageToImage: 'Image to Image',
    textToImage: 'Text to Image',
    models: 'Models',
    uploadUpTo: 'Upload up to {count} images',
    upload: 'Upload',
    fileLimit: 'JPG, PNG, WEBP up to 30MB each · max {count} images',
    delete: 'Delete',
    deleteHistoryConfirm: GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE,
    deleteHistoryFailed: 'Could not delete history item.',
    replace: 'Replace',
    previewSoon: 'Preview Soon',
    styleTemplates: 'Style Templates',
    aspectRatios: 'Aspect Ratios',
    prompt: 'Prompt',
    promptPlaceholder: 'Please describe the image content',
    outputAspectRatios: 'Output Aspect Ratios',
    resolution: 'Resolution',
    highResUnavailable: '2K and 4K are temporarily unavailable.',
    outputFormat: 'Output Format',
    demo: 'Demo',
    sampleImage: 'Sample Image',
    noDemoImageYet: 'No Demo Image Yet',
    inputImage: 'Reference Image',
    history: 'History',
    noHistory: 'No history yet. Generate an image to see it here.',
    recreate: 'Recreate',
    editImage: 'Edit Image',
    editImageShort: 'Edit',
    download: 'Download',
    downloading: 'Downloading...',
    copyPrompt: 'Copy Prompt',
    promptCopied: 'Prompt Copied to Clipboard',
    promptCopyFailed: 'Failed to Copy Prompt',
    promptInserted: 'Prompt inserted. You can generate now.',
    generate: 'Generate',
    generating: 'Generating...',
    generatingSeconds: 'Generating... {seconds}s',
    referenceImageLoading: 'Loading',
    generatedAlt: 'Generated',
    resultRetentionLogin: 'Log In',
    resultRetentionMessage: ' to keep your generation history permanently.',
    viewAll: 'View All',
    historyResultAlt: 'History Result',
    inputAlt: 'Reference Image',
    fileTooLarge: 'File {name} exceeds 30MB limit',
    maxImagesAllowed: 'Maximum {max} images allowed. Only {remaining} will be added.',
    uploadFailed: 'Image upload failed.',
    uploadMissingUrl: 'Upload did not return url',
    uploadRequestFailed: 'Image upload request failed. Please check the upload service configuration and network connection.',
    uploadFailedWithStatus: 'Upload failed: {status}',
    uploadUrlHint: 'Please ensure the upload URL is complete and deployed.',
    serverNonJson: 'Server returned a non-JSON response.',
    requestFailed: 'Request failed:',
    checkStatusFailed: 'Failed to check status ({status})',
    generateFailed: 'Failed to generate media',
    generationFailedWithMessage: 'Generation failed: {message}',
    noResult: 'No task ID or media URL received',
    networkError: 'Network error',
    networkFailed: 'Network connection failed. Please check your network connection and try again.',
    serviceUnstable: 'Generation service is temporarily unstable. Please try again in a moment.',
    imageGenerationFailed: 'Generation Failed',
    generationTimeout: 'Generation timeout',
    dailyLimitReached: 'Daily free limit reached. Please come back tomorrow!',
    recreateMissingInput: 'No input image found. Switched to Text to Image for recreate.',
    creditsUsedUpTitle: 'Credits Used Up',
    creditsUsedUpMessage: 'You need more credits to generate this image. Buy a one-time pack or earn free credits with daily rewards.',
    creditsUsedUpBuyAction: 'Buy Credits',
    creditsUsedUpEarnAction: 'Earn Free Credits',
    creditsUsedUpAction: 'Close',
  }
  const toolText = getAiImageGenerationToolText(commonTranslations?.common?.nanoBananaTool, defaultToolText)
  const formatToolText = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce((next, [key, value]) => next.replace(`{${key}}`, String(value)), template)
  const isCouplePhotoMakerMode = presetMode === 'ai-couple-photo-maker'
  const modelGroups = MODEL_GROUPS
  const modelOptions = useMemo(() => getFlatModelOptions(), [])
  const [selectedModelId, setSelectedModelId] = useState<ImageModelId>(modelId)
  const selectedModelName = modelOptions.find((option) => option.id === selectedModelId)?.name || modelName
  const selectedModelOption = modelOptions.find((option) => option.id === selectedModelId)
  const selectedMediaType = getGenerationMediaType(selectedModelId)
  const displayModelName = hideModelBranding ? (selectedMediaType === 'video' ? 'AI video' : 'AI image') : selectedModelName
  const modelConfig = MODEL_CONFIG[selectedModelId]
  const getMaxImagesForModel = (id: ImageModelId) => {
    const modelMaxImages = MODEL_CONFIG[id].maxImages
    const configuredMaxImages = typeof maxUploadImages === 'number' && Number.isFinite(maxUploadImages)
      ? Math.max(0, Math.min(Math.floor(maxUploadImages), modelMaxImages))
      : undefined
    return configuredMaxImages ?? (isCouplePhotoMakerMode ? Math.min(2, modelMaxImages) : modelMaxImages)
  }
  const MAX_IMAGES = getMaxImagesForModel(selectedModelId)
  const MAX_FILE_SIZE_MB = modelConfig.maxFileSizeMb ?? 30
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024
  const [activeTab, setActiveTab] = useState<'image-to-image' | 'text-to-image'>(defaultMode || getDefaultTabForModel(modelId))
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([])
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [selectedPromptModifier, setSelectedPromptModifier] = useState(
    promptModifier?.defaultValue ||
      promptModifier?.options[0]?.value ||
      promptModifier?.options[0]?.label ||
      ''
  )
  const [customPromptDraft, setCustomPromptDraft] = useState('')
  const [activePromptPresetTab, setActivePromptPresetTab] = useState(
    promptPresetTabs[0]?.id || ''
  )
  const [selectedPromptPreset, setSelectedPromptPreset] = useState<string>(() => {
    const firstTabId = promptPresetTabs[0]?.id
    const firstPreset = promptPresets.find(
      (item) => item.prompt?.trim() && (!firstTabId || item.group === firstTabId)
    )
    return firstPreset?.label ?? 'Custom'
  })
  const [aspectRatio, setAspectRatio] = useState<string>(
    defaultAspectRatio || getDefaultAspectRatioForModel(modelId, presetMode)
  )
  const [resolution, setResolution] = useState<string>(getDefaultResolutionForModel(modelId))
  const [videoDurationSeconds, setVideoDurationSeconds] = useState<number>(() => getConfiguredVideoDurationSeconds(defaultVideoDurationSeconds))
  const [outputFormat, setOutputFormat] = useState(isCouplePhotoMakerMode ? 'PNG' : 'Auto')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    const firstStyle = NANO_BANANA_2_COUPLE_TEMPLATES.find((item) => item.category === 'style')
    return firstStyle?.id ?? ''
  })
  const [rightMode, setRightMode] = useState<RightPanelMode>('sample')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [pendingGenerationItems, setPendingGenerationItems] = useState<PendingGenerationItem[]>(() => getStoredPendingGenerationItems())
  const [failedGenerationItems, setFailedGenerationItems] = useState<FailedGenerationItem[]>([])
  const [activeSettingsHistoryItemId, setActiveSettingsHistoryItemId] = useState<string | null>(null)
  const [currentResult, setCurrentResult] = useState<HistoryItem | null>(null)
  const [remoteImageUrls, setRemoteImageUrls] = useState<string[]>(defaultImageUrls.slice(0, MAX_IMAGES))
  const [remoteImagePreviewStates, setRemoteImagePreviewStates] = useState<Record<string, RemoteReferenceImageState>>({})
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [desktopPromptTooltip, setDesktopPromptTooltip] = useState<DesktopPromptTooltipState>(null)
  const [promptDemoImage, setPromptDemoImage] = useState<PromptDemoImage | null>(null)
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string; type: string }>>([])
  const [creditExhaustedModalOpen, setCreditExhaustedModalOpen] = useState(false)
  const [generatingSeconds, setGeneratingSeconds] = useState(0)
  const [isUserSignedIn, setIsUserSignedIn] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null)
  const modelSelectorRef = useRef<HTMLDivElement>(null)
  const historyItemRefs = useRef(new Map<string, HTMLDivElement>())
  const restoredGenerationPollIdsRef = useRef(new Set<string>())
  const lastRightPanelPathnameRef = useRef(pathname)
  const shouldPositionInsertedPromptRef = useRef(false)
  const localIdRef = useRef(0)
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const [activeModelGroupId, setActiveModelGroupId] = useState(() => getModelGroupId(modelId))
  const activeModelGroup = modelGroups.find((group) => group.id === activeModelGroupId) || modelGroups[0]
  const selectedModelGroup = modelGroups.find((group) => group.models.some((model) => model.id === selectedModelId)) || modelGroups[0]
  const generationCreditCost = calculateImageGenerationCredits(selectedModelId, resolution, videoDurationSeconds)
  const historyPageHref = getLocalizedInternalPath(pathname, '/history')
  const isGenerating = pendingGenerationItems.length > 0
  const hasDesktopResultTabs = isGenerating || failedGenerationItems.length > 0 || history.length > 0
  const hasMobileResultTabs = isGenerating || failedGenerationItems.length > 0 || history.length > 0
  const resolutionOptions = useMemo(
    () => getResolutionOptionsForModel(selectedModelId),
    [selectedModelId]
  )

  useEffect(() => {
    setSelectedModelId(modelId)
    setActiveModelGroupId(getModelGroupId(modelId))
  }, [modelId])

  useEffect(() => {
    if (!isModelMenuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!modelSelectorRef.current) return
      if (event.target instanceof Node && modelSelectorRef.current.contains(event.target)) return
      setIsModelMenuOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModelMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModelMenuOpen])

  useEffect(() => {
    setActiveTab(defaultMode || getDefaultTabForModel(modelId))
  }, [defaultMode, modelId])

  useEffect(() => {
    setPrompt(defaultPrompt)
  }, [defaultPrompt])

  useEffect(() => {
    if (!defaultAspectRatio) return
    if (!modelConfig.aspectRatios.some((item) => item.value === defaultAspectRatio)) return
    setAspectRatio(defaultAspectRatio)
  }, [defaultAspectRatio, modelConfig.aspectRatios])

  useEffect(() => {
    setVideoDurationSeconds(getConfiguredVideoDurationSeconds(defaultVideoDurationSeconds))
  }, [defaultVideoDurationSeconds])

  useEffect(() => {
    const nextTabId = promptPresetTabs[0]?.id || ''
    setActivePromptPresetTab(nextTabId)
    const firstPreset = promptPresets.find(
      (item) => item.prompt?.trim() && (!nextTabId || item.group === nextTabId)
    )
    setSelectedPromptPreset(firstPreset?.label ?? 'Custom')
    if (firstPreset?.prompt?.trim()) {
      setPrompt(firstPreset.prompt)
    }
  }, [promptPresetTabs, promptPresets])

  const visiblePromptPresets = promptPresets.filter((preset) => {
    if (preset.label.toLowerCase() === 'custom') return false
    if (promptPresetTabs.length === 0) return true
    return preset.group === activePromptPresetTab
  })

  const selectedPromptPresetReferenceImage =
    promptPresets.find((preset) => preset.label === selectedPromptPreset)?.referenceImage
  const selectedPromptModifierOption = promptModifier?.options.find(
    (option) => (option.value || option.label) === selectedPromptModifier
  )

  useEffect(() => {
    const nextValue =
      promptModifier?.defaultValue ||
      promptModifier?.options[0]?.value ||
      promptModifier?.options[0]?.label ||
      ''
    setSelectedPromptModifier(nextValue)
  }, [promptModifier])

  const getGenerationReferenceUrls = (
    userReferenceUrls: string[],
    templateReferenceImage?: string,
    maxImages = modelConfig.maxImages,
  ) => {
    const combined = templateReferenceImage
      ? [...userReferenceUrls, templateReferenceImage]
      : userReferenceUrls
    return Array.from(new Set(combined)).slice(0, maxImages)
  }

  const selectPromptPresetTab = (tabId: string) => {
    if (activePromptPresetTab === customPromptTabId) {
      setCustomPromptDraft(prompt)
    }

    setActivePromptPresetTab(tabId)

    if (tabId === customPromptTabId) {
      setSelectedPromptPreset('Custom')
      setPrompt(customPromptDraft)
      requestAnimationFrame(() => promptTextareaRef.current?.focus())
      return
    }

    const firstPreset = promptPresets.find(
      (preset) => preset.group === tabId && preset.prompt?.trim()
    )
    setSelectedPromptPreset(firstPreset?.label ?? '')
    setPrompt(firstPreset?.prompt || '')
  }

  useEffect(() => {
    const nextRemoteImageUrls = defaultImageUrls.slice(0, MAX_IMAGES)
    setRemoteImageUrls((prev) => areStringArraysEqual(prev, nextRemoteImageUrls) ? prev : nextRemoteImageUrls)
  }, [defaultImageUrls, MAX_IMAGES])

  const setRemoteImagePreviewState = (url: string, state: RemoteReferenceImageState) => {
    setRemoteImagePreviewStates((prev) => ({ ...prev, [url]: state }))
  }

  useEffect(() => {
    setRemoteImagePreviewStates((prev) => {
      const nextStates: Record<string, RemoteReferenceImageState> = {}
      remoteImageUrls.forEach((url) => {
        nextStates[url] = prev[url] || 'loading'
      })
      return nextStates
    })
  }, [remoteImageUrls])

  useEffect(() => {
    if (modelConfig.aspectRatios.some((item) => item.value === aspectRatio)) return
    setAspectRatio(modelConfig.aspectRatios[0]?.value || 'auto')
  }, [aspectRatio, modelConfig.aspectRatios])

  useEffect(() => {
    if (resolutionOptions.includes(resolution)) return
    setResolution(resolutionOptions[0] || '1K')
  }, [resolution, resolutionOptions])

  // 全屏预览时禁止底层页面滚动
  useEffect(() => {
    if (previewImage) {
      const prevOverflow = document.body.style.overflow
      const prevPosition = document.body.style.position
      const prevWidth = document.body.style.width
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      return () => {
        document.body.style.overflow = prevOverflow
        document.body.style.position = prevPosition
        document.body.style.width = prevWidth
      }
    }
  }, [previewImage])

  useEffect(() => {
    if (!isGenerating) {
      setGeneratingSeconds(0)
      return
    }
    const startedAt = Date.now()
    setGeneratingSeconds(0)
    const timer = setInterval(() => {
      setGeneratingSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    }, 1000)
    return () => clearInterval(timer)
  }, [isGenerating])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const refreshSignedInState = () => {
      setIsUserSignedIn(getCachedGenerationAuthState(0).isSignedIn)
    }

    refreshSignedInState()
    window.addEventListener('toolaze:auth-updated', refreshSignedInState)
    window.addEventListener('toolaze:credits-updated', refreshSignedInState)
    window.addEventListener('focus', refreshSignedInState)

    return () => {
      window.removeEventListener('toolaze:auth-updated', refreshSignedInState)
      window.removeEventListener('toolaze:credits-updated', refreshSignedInState)
      window.removeEventListener('focus', refreshSignedInState)
    }
  }, [])

  useLayoutEffect(() => {
    if (!shouldPositionInsertedPromptRef.current) return
    shouldPositionInsertedPromptRef.current = false
    const textarea = promptTextareaRef.current
    if (!textarea) return

    const positionPromptAtStart = () => {
      textarea.focus()
      textarea.setSelectionRange(0, 0)
      textarea.scrollTop = 0
    }

    positionPromptAtStart()
    const frameId = window.requestAnimationFrame(positionPromptAtStart)
    return () => window.cancelAnimationFrame(frameId)
  }, [prompt])

  const applyPromptInsertDetail = useCallback((detail: PromptInsertEventDetail) => {
    const nextPrompt = detail.prompt?.trim()
    const imageUrl = normalizeReusableReferenceImageUrl(detail.imageUrl)
    const imageUrls = Array.isArray(detail.imageUrls)
      ? detail.imageUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
      : []
    const urls = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : []
    if (!nextPrompt && urls.length === 0) return false
    const demoImageUrl = detail.demoImageUrl?.trim()

    if (detail.aspectRatio) setAspectRatio(detail.aspectRatio)
    if (detail.resolution) setResolution(detail.resolution)
    if (detail.outputFormat) setOutputFormat(detail.outputFormat)
    if (detail.presetGroup) setActivePromptPresetTab(detail.presetGroup)
    if (detail.presetLabel) setSelectedPromptPreset(detail.presetLabel)
    if (nextPrompt) {
      shouldPositionInsertedPromptRef.current = true
      setPrompt(nextPrompt)
      setRightMode('sample')
      setPromptDemoImage(
        demoImageUrl
          ? {
              url: demoImageUrl,
              title: detail.demoImageTitle || toolText.sampleImage,
              width: detail.demoImageWidth || 900,
              height: detail.demoImageHeight || 1200,
            }
          : null
      )
    }

    const nextMode = resolvePromptInsertMode({
      requestedMode: detail.mode,
      hasReferenceImages: urls.length > 0,
    })
    setRemoteImageUrls(resolvePromptInsertRemoteImageUrls({
      nextMode,
      currentRemoteImageUrls: remoteImageUrls,
      referenceUrls: urls,
      maxImages: MAX_IMAGES,
    }))
    setActiveTab(nextMode)

    if (nextPrompt) showToast(toolText.promptInserted, 'success')
    return true
  }, [MAX_IMAGES, toolText.promptInserted, toolText.sampleImage, remoteImageUrls])

  // 从提示词案例板块一键带入 Prompt，可选携带参考图。
  useEffect(() => {
    const handler = async (event: Event) => {
      const customEvent = event as CustomEvent<PromptInsertEventDetail>
      if (customEvent.detail?.modelId && customEvent.detail.modelId !== selectedModelId) {
        window.sessionStorage.setItem(PENDING_REPROMPT_STORAGE_KEY, JSON.stringify(customEvent.detail))
        handleModelChange(customEvent.detail.modelId)
        return
      }
      applyPromptInsertDetail(customEvent.detail || {})
    }

    window.addEventListener('toolaze:use-prompt', handler as EventListener)
    return () => window.removeEventListener('toolaze:use-prompt', handler as EventListener)
  }, [applyPromptInsertDetail, selectedModelId])

  useEffect(() => {
    const raw = window.sessionStorage.getItem(PENDING_REPROMPT_STORAGE_KEY)
    if (!raw) return
    try {
      const detail = JSON.parse(raw) as PromptInsertEventDetail
      if (detail.modelId && detail.modelId !== selectedModelId) return
      if (applyPromptInsertDetail(detail)) {
        window.sessionStorage.removeItem(PENDING_REPROMPT_STORAGE_KEY)
      }
    } catch {
      window.sessionStorage.removeItem(PENDING_REPROMPT_STORAGE_KEY)
    }
  }, [applyPromptInsertDetail, selectedModelId])

  const createLocalId = useCallback((prefix: string) => {
    localIdRef.current += 1
    return `${prefix}-${Date.now()}-${localIdRef.current}`
  }, [])

  const addHistoryItemToFeed = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev.filter((historyItem) => historyItem.id !== item.id)].slice(0, 20))
    setCurrentResult(item)
  }, [])

  const parseJsonSafely = useCallback(async (res: Response): Promise<Record<string, any>> => {
    const text = await res.text()
    if (!text) return {}
    try {
      return JSON.parse(text) as Record<string, any>
    } catch {
      throw new Error(toolText.serverNonJson)
    }
  }, [toolText.serverNonJson])

  const saveGeneratedImageToR2 = useCallback(async (outputUrl: string) => {
    try {
      const saveRes = await fetch('/api/save-image-to-r2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: outputUrl }),
      })
      if (!saveRes.ok) return outputUrl
      const data = await parseJsonSafely(saveRes)
      return typeof data.url === 'string' && data.url ? data.url : outputUrl
    } catch {
      return outputUrl
    }
  }, [parseJsonSafely])

  const persistGeneratedHistoryItem = useCallback(async (
    item: {
      outputUrl: string
      inputUrls?: string[]
      prompt: string
      modelId: ImageModelId
      modelName: string
      aspectRatio?: string
      resolution?: string
      outputFormat?: string
      mediaType?: 'image' | 'video'
    },
  ) => {
    const historyTool = getHistoryToolMetadata(pathname, item.modelName, item.modelId)

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: item.mediaType || 'image',
          model: item.modelId,
          prompt: item.prompt,
          outputUrl: item.outputUrl,
          inputUrls: item.inputUrls || [],
          aspectRatio: item.aspectRatio,
          resolution: item.resolution,
          outputFormat: item.outputFormat,
          ...historyTool,
        }),
      })
      if (!response.ok) return null
      const data = await response.json().catch(() => ({}))
      return data?.item || null
    } catch {
      return null
    }
  }, [pathname])

  const pollRestoredGenerationItem = useCallback(async (item: PendingGenerationItem) => {
    if (!item.taskId) return

    try {
      let attempts = 0
      const maxAttempts = 60
      const pollInterval = 5000
      const pendingMediaType = item.mediaType || getGenerationMediaType(item.modelId)

      const pollStatus = async (): Promise<GenerationPollResult> => {
        let statusResponse: Response
        try {
          statusResponse = await fetch('/api/image-to-image/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: item.taskId, creditHold: item.creditHold || null }),
            credentials: 'include',
          })
        } catch (error: any) {
          const msg = error?.message || toolText.networkError
          if (msg.includes('fetch') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
            attempts++
            if (attempts >= maxAttempts) {
              throw new Error(toolText.networkFailed)
            }
            await new Promise((resolve) => setTimeout(resolve, pollInterval))
            return pollStatus()
          }
          throw new Error(`${toolText.requestFailed} ${msg}`)
        }

        if (!statusResponse.ok) {
          const errBody = await parseJsonSafely(statusResponse).catch(() => ({}))
          const errMsg = (errBody as { error?: string })?.error || formatToolText(toolText.checkStatusFailed, { status: statusResponse.status })
          const transientError =
            statusResponse.status >= 500 ||
            errMsg.includes('fetch failed') ||
            errMsg.includes('recordInfo is null')
          if (transientError) {
            attempts++
            if (attempts >= maxAttempts) {
              throw new Error(toolText.serviceUnstable)
            }
            await new Promise((resolve) => setTimeout(resolve, pollInterval))
            return pollStatus()
          }
          throw new Error(errMsg)
        }

        const statusResult = await parseJsonSafely(statusResponse)
        if (statusResult.credits) {
          dispatchCreditsUpdated(statusResult.credits)
        }
        const outputUrl = String(statusResult.videoUrl || statusResult.imageUrl || '').trim()
        if (statusResult.status === 'SUCCEEDED' && outputUrl) {
          const mediaType: GenerationMediaType =
            statusResult.mediaType === 'video' || statusResult.videoUrl ? 'video' : pendingMediaType
          return { outputUrl, mediaType }
        }
        if (statusResult.status === 'FAILED') {
          throw new Error(String(statusResult.message || toolText.imageGenerationFailed))
        }

        attempts++
        if (attempts >= maxAttempts) {
          throw new Error(toolText.generationTimeout)
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval))
        return pollStatus()
      }

      const { outputUrl, mediaType } = await pollStatus()
      const finalUrl = mediaType === 'image' ? await saveGeneratedImageToR2(outputUrl) : outputUrl
      const savedItem = await persistGeneratedHistoryItem({
        outputUrl: finalUrl,
        inputUrls: item.inputUrls || [],
        prompt: item.prompt,
        modelId: item.modelId,
        modelName: item.modelName,
        aspectRatio: item.aspectRatio,
        resolution: item.resolution,
        outputFormat: item.outputFormat,
        mediaType,
      })
      addHistoryItemToFeed({
        id: savedItem?.id || item.id,
        inputPreview: item.inputPreview || item.inputUrls?.[0] || '',
        inputUrls: item.inputUrls || [],
        outputPreview: finalUrl,
        mediaType,
        prompt: item.prompt,
        time: formatLocalTimestampToSeconds(savedItem?.createdAt || new Date().toISOString()),
        modelId: item.modelId,
        aspectRatio: item.aspectRatio,
        resolution: item.resolution,
        outputFormat: item.outputFormat,
      })
      setRightMode('history')
    } catch (error: any) {
      const errorMessage = error?.message || toolText.imageGenerationFailed
      dispatchToolazeTopNotice({
        type: 'error',
        title: 'Generation Failed',
        message: errorMessage,
      })
      setFailedGenerationItems((prev) => [{ ...item, errorMessage }, ...prev].slice(0, 20))
      setRightMode('history')
    } finally {
      setPendingGenerationItems((prev) => prev.filter((pendingItem) => pendingItem.id !== item.id))
      restoredGenerationPollIdsRef.current.delete(item.id)
    }
  }, [
    addHistoryItemToFeed,
    parseJsonSafely,
    persistGeneratedHistoryItem,
    saveGeneratedImageToR2,
    toolText.checkStatusFailed,
    toolText.generationTimeout,
    toolText.imageGenerationFailed,
    toolText.networkError,
    toolText.networkFailed,
    toolText.requestFailed,
    toolText.serviceUnstable,
  ])

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = createLocalId('toast')
    const cleanMsg = msg.replace(/✅|❌|⚠️|❗/g, '').trim()

    setToasts(prev => [...prev, { id, msg: cleanMsg, type }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (pendingGenerationItems.length === 0) {
      window.sessionStorage.removeItem(PENDING_GENERATION_STORAGE_KEY)
      return
    }

    window.sessionStorage.setItem(PENDING_GENERATION_STORAGE_KEY, JSON.stringify(pendingGenerationItems))
  }, [pendingGenerationItems])

  useEffect(() => {
    if (pendingGenerationItems.length > 0) {
      setRightMode('history')
    }
  }, [pendingGenerationItems.length])

  useEffect(() => {
    if (lastRightPanelPathnameRef.current === pathname) return
    lastRightPanelPathnameRef.current = pathname
    if (pendingGenerationItems.length > 0) return
    setRightMode('sample')
  }, [pathname, pendingGenerationItems.length])

  useEffect(() => {
    const restoredPendingGenerationItems = pendingGenerationItems.filter((item) => item.restored && item.taskId)
    restoredPendingGenerationItems.forEach((item) => {
      if (restoredGenerationPollIdsRef.current.has(item.id)) return
      restoredGenerationPollIdsRef.current.add(item.id)
      void pollRestoredGenerationItem(item)
    })
  }, [pendingGenerationItems, pollRestoredGenerationItem])

  useEffect(() => {
    let cancelled = false

    const loadInlineHistory = async () => {
      try {
        const response = await fetch('/api/history?limit=20', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (!response.ok) return
        const data: { items?: PersistedGenerationHistoryItem[] } = await response.json().catch(() => ({ items: [] }))
        const loadedHistory = Array.isArray(data.items)
          ? sortPersistedHistoryItemsNewestFirst(data.items)
            .map(mapPersistedHistoryItem)
            .filter((item: HistoryItem | null): item is HistoryItem => Boolean(item))
          : []
        if (cancelled || loadedHistory.length === 0) return
        setHistory(loadedHistory)
        setCurrentResult((prev) => prev || loadedHistory[0] || null)
      } catch {
        // Inline history is an enhancement. The full History page remains the source of truth.
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

  const visibleTemplates = useMemo(
    () => NANO_BANANA_2_COUPLE_TEMPLATES.filter((item) => item.category === 'style'),
    []
  )

  const selectedTemplate = useMemo(
    () => NANO_BANANA_2_COUPLE_TEMPLATES.find((item) => item.id === selectedTemplateId),
    [selectedTemplateId]
  )

  const fallbackTemplateImage = useMemo(
    () => NANO_BANANA_2_COUPLE_TEMPLATES.find((item) => item.image)?.image ?? null,
    []
  )

  const selectedTemplateImage = selectedTemplate?.image || fallbackTemplateImage
  const wrappedRatioOptions = useMemo(() => WRAPPED_IMAGE_PLAY_RATIO_OPTIONS, [])

  useEffect(() => {
    if (!isCouplePhotoMakerMode) return
    setActiveTab('image-to-image')
    setAspectRatio('auto')
    setResolution('1K')
    setOutputFormat('PNG')
  }, [isCouplePhotoMakerMode])

  useEffect(() => {
    if (!isCouplePhotoMakerMode || !selectedTemplateId) return
    const selected = NANO_BANANA_2_COUPLE_TEMPLATES.find((item) => item.id === selectedTemplateId)
    if (!selected) return
    setPrompt(selected.prompt)
  }, [isCouplePhotoMakerMode, selectedTemplateId])

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.isArray(files) ? files : Array.from(files)
    const validFiles = list.filter((f) => {
      if (!f.type.startsWith('image/')) return false
      if (f.size > MAX_FILE_SIZE) {
        showToast(formatToolText(toolText.fileTooLarge, { name: f.name }), 'error')
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const currentCount = imageFiles.length
    const remainingSlots = MAX_IMAGES - currentCount
    if (validFiles.length > remainingSlots) {
      showToast(formatToolText(toolText.maxImagesAllowed, { max: MAX_IMAGES, remaining: remainingSlots }), 'warning')
      validFiles.splice(remainingSlots)
    }

    const newImages: ImageItem[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setRemoteImageUrls([])
    setImageFiles(prev => {
      const combined = [...prev, ...newImages]
      return combined.slice(0, MAX_IMAGES)
    })
  }

  const pickReplacementImage = (onReplace: (file: File) => void) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp'
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file || !file.type.startsWith('image/')) return
      if (file.size > MAX_FILE_SIZE) {
        showToast(formatToolText(toolText.fileTooLarge, { name: file.name }), 'error')
        return
      }
      onReplace(file)
    }
    input.click()
  }

  const replaceRemoteImage = (index: number) => {
    pickReplacementImage((file) => {
      setRemoteImageUrls((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
      setImageFiles((prev) => [
        ...prev,
        { file, preview: URL.createObjectURL(file) },
      ].slice(0, MAX_IMAGES))
    })
  }

  const replaceLocalImage = (index: number) => {
    pickReplacementImage((file) => {
      setImageFiles((prev) => {
        const nextFiles = [...prev]
        URL.revokeObjectURL(nextFiles[index].preview)
        nextFiles[index] = {
          file,
          preview: URL.createObjectURL(file),
        }
        return nextFiles
      })
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const clearAllImages = () => {
    imageFiles.forEach(item => URL.revokeObjectURL(item.preview))
    setImageFiles([])
    setRemoteImageUrls([])
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const getGenerationAnalyticsPayload = useCallback((extra: Record<string, string | number | boolean | undefined> = {}) => {
    const referenceImageCount = imageFiles.length + remoteImageUrls.length

    return {
      source: 'nano_banana_tool',
      page_path: pathname || '',
      model_id: selectedModelId,
      model_name: selectedModelName,
      generation_mode: activeTab,
      resolution,
      aspect_ratio: aspectRatio,
      video_duration_seconds: selectedMediaType === 'video' ? videoDurationSeconds : undefined,
      output_format: modelConfig.supportsOutputFormat && !isCouplePhotoMakerMode ? outputFormat : undefined,
      credit_cost: generationCreditCost,
      has_reference_images: referenceImageCount > 0,
      reference_image_count: referenceImageCount,
      preset_mode: presetMode,
      ...extra,
    }
  }, [
    activeTab,
    aspectRatio,
    generationCreditCost,
    imageFiles.length,
    isCouplePhotoMakerMode,
    modelConfig.supportsOutputFormat,
    outputFormat,
    pathname,
    presetMode,
    remoteImageUrls.length,
    resolution,
    selectedModelId,
    selectedModelName,
    selectedMediaType,
    videoDurationSeconds,
  ])

  useEffect(() => {
    if (!creditExhaustedModalOpen) return

    trackToolazeEvent('credit_insufficient_modal_view', getGenerationAnalyticsPayload())
  }, [creditExhaustedModalOpen, getGenerationAnalyticsPayload])

  const handleCreditInsufficientBuyCreditsClick = () => {
    trackToolazeEvent('credit_insufficient_buy_credits_button_click', getGenerationAnalyticsPayload({
      destination: '/pricing',
    }))
    setCreditExhaustedModalOpen(false)
  }

  const handleCreditInsufficientEarnFreeCreditsClick = () => {
    trackToolazeEvent('credit_insufficient_earn_free_credits_button_click', getGenerationAnalyticsPayload({
      destination: '/earn-credits',
    }))
    setCreditExhaustedModalOpen(false)
  }

  const handleGenerate = async () => {
    const requestPrompt = prompt.trim()
    const requestActiveTab = activeTab
    const requestImageFiles = [...imageFiles]
    const requestRemoteImageUrls = [...remoteImageUrls]
    const requestAspectRatio = aspectRatio
    const requestResolution = resolution
    const requestOutputFormat = outputFormat
    const requestModelId = selectedModelId
    const requestModelName = selectedModelName
    const requestMediaType = getGenerationMediaType(requestModelId)
    const requestVideoDurationSeconds = videoDurationSeconds
    const requestHistoryTool = getHistoryToolMetadata(pathname, requestModelName, requestModelId)
    const requestModelConfig = MODEL_CONFIG[requestModelId]
    const requestCreditCost = generationCreditCost
    const requestPromptModifierPrompt = selectedPromptModifierOption?.prompt
    const requestTemplateReferenceImage = selectedPromptPresetReferenceImage
    const hasReferenceImages = requestImageFiles.length > 0 || requestRemoteImageUrls.length > 0

    if (requestActiveTab === 'image-to-image' && !hasReferenceImages) return
    if (!requestPrompt) return

    trackToolazeEvent('image_generate_click', getGenerationAnalyticsPayload())
    const authState = await ensureSignedInForGeneration(requestCreditCost)
    if (!authState.isSignedIn) {
      showToast('Please sign in with Google to generate images.', 'warning')
      window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
      return
    }
    if (authState.creditsExhausted) {
      setCreditExhaustedModalOpen(true)
      return
    }
    setIsUserSignedIn(true)

    const effectivePrompt = composePromptParts(
      requestPrompt,
      requestPromptModifierPrompt,
      isCouplePhotoMakerMode ? COUPLE_IDENTITY_LOCK_INSTRUCTION : undefined,
    )
    const generationPreviewInputUrls = requestActiveTab === 'image-to-image'
      ? getGenerationReferenceUrls(
        [...requestImageFiles.map((item) => item.preview), ...requestRemoteImageUrls],
        requestTemplateReferenceImage,
        requestModelConfig.maxImages,
      )
      : []
    const pendingItem: PendingGenerationItem = {
      id: createLocalId('pending'),
      inputPreview: generationPreviewInputUrls[0] || '',
      inputUrls: generationPreviewInputUrls,
      prompt: effectivePrompt,
      startedAt: Date.now(),
      modelId: requestModelId,
      modelName: requestModelName,
      mediaType: requestMediaType,
      aspectRatio: requestAspectRatio,
      resolution: requestResolution,
      outputFormat: requestOutputFormat,
      ...requestHistoryTool,
    }

    setPendingGenerationItems((prev) => [pendingItem, ...prev])
    setRightMode('history')
    let rollbackOptimisticCredits = startOptimisticCreditDeduction(requestCreditCost)

    try {
      const formData = new FormData()
      formData.append('prompt', effectivePrompt)
      formData.append('aspectRatio', requestAspectRatio)
      formData.append('resolution', requestModelId === 'wan-2-7-image' && requestActiveTab === 'image-to-image' && requestResolution === '4K' ? '2K' : requestResolution)
      if (requestMediaType === 'video') {
        formData.append('duration', String(requestVideoDurationSeconds))
      }
      if (requestModelId === 'seedream-4-5' || requestModelId === 'seedream-5-0-lite' || requestModelId === 'seedream-5-0-pro') {
        formData.append('quality', requestModelId === 'seedream-5-0-pro'
          ? (requestResolution === '2K' ? 'High' : 'Basic')
          : (requestResolution === '4K' ? 'High' : 'Basic'))
      }
      if (requestModelConfig.supportsOutputFormat) {
        formData.append('outputFormat', requestOutputFormat)
      }
      formData.append('isImageToImage', String(requestActiveTab === 'image-to-image'))
      formData.append('model', requestModelId)

      const uploadUrl = getImageUploadUrl()

      let generationInputUrls = [...requestRemoteImageUrls]
      if (requestActiveTab === 'image-to-image' && requestImageFiles.length > 0) {
        // 批量上传所有图片
        const imageUrls: string[] = []
        for (const imageItem of requestImageFiles) {
          const uploadForm = new FormData()
          uploadForm.append('image', imageItem.file)
          let uploadRes: Response
          try {
            uploadRes = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
          } catch (e: any) {
            const msg = e?.message || ''
            if (msg.includes('fetch') || msg.includes('NetworkError') || msg.includes('Failed to fetch')) {
              throw new Error(toolText.uploadRequestFailed)
            }
            throw e
          }
          if (!uploadRes.ok) {
            const err = await uploadRes.json().catch(() => ({}))
            const msg = err?.error || formatToolText(toolText.uploadFailedWithStatus, { status: uploadRes.status })
            if (uploadRes.status === 405) {
              throw new Error(`${msg} ${toolText.uploadUrlHint}`)
            }
            throw new Error(msg)
          }
          const { url } = await uploadRes.json()
          if (url) {
            imageUrls.push(url)
          } else {
            throw new Error(toolText.uploadMissingUrl)
          }
        }
        // 将所有 URL 作为 JSON 字符串传递
        generationInputUrls = imageUrls
      }
      generationInputUrls = getGenerationReferenceUrls(
        generationInputUrls,
        requestTemplateReferenceImage,
        requestModelConfig.maxImages,
      )
      if (requestActiveTab === 'image-to-image' && generationInputUrls.length > 0) {
        generationInputUrls = await uploadRemoteReferenceUrlsForGeneration(
          generationInputUrls,
          uploadUrl,
          toolText.uploadFailed,
        )
        formData.append('imageUrls', JSON.stringify(generationInputUrls))
      }

      const generateResponse = await requestImageGenerationTask(formData, toolText)

      if (!generateResponse.ok) {
        const errorData = await parseJsonSafely(generateResponse)
        if (errorData.credits) {
          dispatchCreditsUpdated(errorData.credits)
          rollbackOptimisticCredits = null
        }
        if (isCreditExhaustedGenerationError(generateResponse.status, errorData)) {
          rollbackOptimisticCredits?.()
          rollbackOptimisticCredits = null
          setCreditExhaustedModalOpen(true)
          setRightMode(currentResult ? 'history' : 'sample')
          return
        }
        if (generateResponse.status === 401) {
          const cachedAuthState = getCachedGenerationAuthState(generationCreditCost)
          if (cachedAuthState.creditsExhausted) {
            rollbackOptimisticCredits?.()
            rollbackOptimisticCredits = null
            setCreditExhaustedModalOpen(true)
            setRightMode(currentResult ? 'history' : 'sample')
            return
          }

          rollbackOptimisticCredits?.()
          rollbackOptimisticCredits = null
          showToast('Please sign in with Google to generate images.', 'warning')
          window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
          setRightMode(currentResult ? 'history' : 'sample')
          return
        }
        throw new Error(errorData.error || toolText.generateFailed)
      }

      const generateResult = await parseJsonSafely(generateResponse)
      if (generateResult.credits) {
        dispatchCreditsUpdated(generateResult.credits)
      }
      rollbackOptimisticCredits = null
      const taskId = generateResult.taskId
      const creditHold = generateResult.creditHold || null

      if (!taskId) {
        const syncOutputUrl = String(generateResult.videoUrl || generateResult.imageUrl || '').trim()
        if (syncOutputUrl) {
          const syncMediaType: GenerationMediaType =
            generateResult.mediaType === 'video' || generateResult.videoUrl ? 'video' : requestMediaType
          const savedItem = await persistGeneratedHistoryItem({
            outputUrl: syncOutputUrl,
            inputUrls: generationInputUrls,
            prompt: effectivePrompt,
            modelId: requestModelId,
            modelName: requestModelName,
            aspectRatio: requestAspectRatio,
            resolution: requestResolution,
            outputFormat: requestOutputFormat,
            mediaType: syncMediaType,
          })
          const savedInputUrls = Array.isArray(savedItem?.inputUrls) && savedItem.inputUrls.length > 0
            ? savedItem.inputUrls
            : generationInputUrls
          const item: HistoryItem = {
            id: savedItem?.id || createLocalId('sync'),
            inputPreview: savedInputUrls[0] || generationPreviewInputUrls[0] || '',
            inputUrls: savedInputUrls,
            outputPreview: syncOutputUrl,
            mediaType: syncMediaType,
            prompt: effectivePrompt,
            time: formatLocalTimestampToSeconds(savedItem?.createdAt || new Date().toISOString()),
            modelId: requestModelId,
            aspectRatio: requestAspectRatio,
            resolution: requestResolution,
            outputFormat: requestOutputFormat,
            toolSlug: savedItem?.toolSlug || requestHistoryTool.toolSlug,
            toolLabel: savedItem?.toolLabel || requestHistoryTool.toolLabel,
            sourcePath: savedItem?.sourcePath || requestHistoryTool.sourcePath,
          }
          addHistoryItemToFeed(item)
          setRightMode('history')
          return
        }
        throw new Error(toolText.noResult)
      }

      setPendingGenerationItems((prev) => prev.map((item) => item.id === pendingItem.id ? { ...item, taskId, creditHold } : item))

      // 轮询任务状态
      let attempts = 0
      const maxAttempts = 60 // 最多轮询 60 次（约 5 分钟）
      const pollInterval = 5000 // 每 5 秒轮询一次

      const pollStatus = async (): Promise<GenerationPollResult> => {
        let statusResponse: Response
        try {
          statusResponse = await fetch('/api/image-to-image/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId, creditHold }),
            credentials: 'include',
          })
        } catch (error: any) {
          const msg = error?.message || toolText.networkError
          if (msg.includes('fetch') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
            attempts++
            if (attempts >= maxAttempts) {
              throw new Error(toolText.networkFailed)
            }
            await new Promise((resolve) => setTimeout(resolve, pollInterval))
            return pollStatus()
          }
          throw new Error(`${toolText.requestFailed} ${msg}`)
        }

        if (!statusResponse.ok) {
          const errBody = await parseJsonSafely(statusResponse).catch(() => ({}))
          const errMsg = (errBody as { error?: string })?.error || formatToolText(toolText.checkStatusFailed, { status: statusResponse.status })
          const transientError =
            statusResponse.status >= 500 ||
            errMsg.includes('fetch failed') ||
            errMsg.includes('recordInfo is null')
          if (transientError) {
            attempts++
            if (attempts >= maxAttempts) {
              throw new Error(toolText.serviceUnstable)
            }
            await new Promise((resolve) => setTimeout(resolve, pollInterval))
            return pollStatus()
          }
          throw new Error(errMsg)
        }

        const statusResult = await parseJsonSafely(statusResponse)
        if (statusResult.credits) {
          dispatchCreditsUpdated(statusResult.credits)
          rollbackOptimisticCredits = null
        }

        const outputUrl = String(statusResult.videoUrl || statusResult.imageUrl || '').trim()
        if (statusResult.status === 'SUCCEEDED' && outputUrl) {
          const mediaType: GenerationMediaType =
            statusResult.mediaType === 'video' || statusResult.videoUrl ? 'video' : requestMediaType
          return { outputUrl, mediaType }
        }

        if (statusResult.status === 'FAILED') {
          throw new Error(statusResult.message || toolText.imageGenerationFailed)
        }

        // 继续轮询
        attempts++
        if (attempts >= maxAttempts) {
          throw new Error(toolText.generationTimeout)
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval))
        return pollStatus()
      }

      const { outputUrl, mediaType } = await pollStatus()

      if (outputUrl) {
        const finalUrl = mediaType === 'image' ? await saveGeneratedImageToR2(outputUrl) : outputUrl

        const savedItem = await persistGeneratedHistoryItem({
          outputUrl: finalUrl,
          inputUrls: generationInputUrls,
          prompt: effectivePrompt,
          modelId: requestModelId,
          modelName: requestModelName,
          aspectRatio: requestAspectRatio,
          resolution: requestResolution,
          outputFormat: requestOutputFormat,
          mediaType,
        })
        const savedInputUrls = Array.isArray(savedItem?.inputUrls) && savedItem.inputUrls.length > 0
          ? savedItem.inputUrls
          : generationInputUrls
        const item: HistoryItem = {
          id: savedItem?.id || createLocalId('async'),
          inputPreview: savedInputUrls[0] || generationPreviewInputUrls[0] || '',
          inputUrls: savedInputUrls,
          outputPreview: finalUrl,
          mediaType,
          prompt: effectivePrompt,
          time: formatLocalTimestampToSeconds(savedItem?.createdAt || new Date().toISOString()),
          modelId: requestModelId,
          aspectRatio: requestAspectRatio,
          resolution: requestResolution,
          outputFormat: requestOutputFormat,
          toolSlug: savedItem?.toolSlug || requestHistoryTool.toolSlug,
          toolLabel: savedItem?.toolLabel || requestHistoryTool.toolLabel,
          sourcePath: savedItem?.sourcePath || requestHistoryTool.sourcePath,
        }
        addHistoryItemToFeed(item)
        setRightMode('history')
      }
    } catch (error: any) {
      rollbackOptimisticCredits?.()
      rollbackOptimisticCredits = null
      console.warn('Generation warning:', error)
      if (isCreditExhaustedGenerationError(0, { error: error?.message })) {
        setCreditExhaustedModalOpen(true)
        setRightMode(currentResult ? 'history' : 'sample')
        return
      }
      dispatchToolazeTopNotice({
        type: 'error',
        title: 'Generation Failed',
        message: error?.message || toolText.imageGenerationFailed,
      })
      const errorMessage = error?.message || toolText.imageGenerationFailed
      setFailedGenerationItems((prev) => [{ ...pendingItem, errorMessage }, ...prev].slice(0, 20))
      setRightMode('history')
    } finally {
      setPendingGenerationItems((prev) => prev.filter((item) => item.id !== pendingItem.id))
    }
  }

  const handleClear = () => {
    clearAllImages()
    setPrompt(hidePromptInput ? defaultPrompt : '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatTagValue = (value: string | undefined): string => {
    if (!value) return 'Auto'
    // 如果已经是首字母大写或全大写（如 "Auto", "PNG", "1K"），直接返回
    if (value[0] === value[0].toUpperCase() || value === value.toUpperCase()) {
      return value
    }
    // 否则首字母大写（如 "auto" -> "Auto"）
    return value.charAt(0).toUpperCase() + value.slice(1)
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

  const handleDownload = async (imageUrl: string, filename: string, item?: HistoryItem) => {
    if (item) {
      trackGenerationHistoryDownloadClick(item, { surface: 'inline_generator_history' })
    }

    setDownloadingUrl(imageUrl)

    try {
      await downloadImageInCurrentPage({
        imageUrl,
        filename,
        triggerBlobDownload,
        triggerUrlDownload,
      })
    } finally {
      setTimeout(() => setDownloadingUrl(null), 1000)
    }
  }

  const confirmDeleteHistoryItem = () =>
    shouldDeleteGenerationHistoryItem(
      (message) => window.confirm(message),
      toolText.deleteHistoryConfirm,
    )

  const deletePersistedHistoryItem = async (itemId: string) => {
    if (itemId.startsWith('sync-') || itemId.startsWith('async-')) return true

    try {
      const response = await fetch(`/api/history?id=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
      })
      if (response.ok || response.status === 404) return true
    } catch (error) {
      console.warn('Failed to delete history item:', error)
    }

    showToast(toolText.deleteHistoryFailed, 'error')
    return false
  }

  const removeHistoryItemFromState = (itemId: string) => {
    const nextHistory = history.filter((item) => item.id !== itemId)
    setHistory(nextHistory)
    if (currentResult?.id === itemId) {
      setCurrentResult(null)
    }
    setRightMode(nextHistory.length > 0 ? 'history' : 'sample')
  }

  const handleDeleteHistoryItem = async (item: HistoryItem) => {
    if (!confirmDeleteHistoryItem()) return
    trackGenerationHistoryDeleteClick(item, { surface: 'inline_generator_history' })
    if (!(await deletePersistedHistoryItem(item.id))) return
    removeHistoryItemFromState(item.id)
  }

  const handleDeleteCurrentResult = async () => {
    if (!currentResult) return
    await handleDeleteHistoryItem(currentResult)
  }

  const handleRecreateFromCurrent = () => {
    if (!currentResult) return
    applyHistoryItemToForm(currentResult)
  }

  const sampleImage = useMemo(() => {
    const customImages = sampleImages?.filter((item) => item.url)
    if (customImages?.length) {
      const image = customImages[0]
      return {
        url: image.url,
        caption: image.title || `${displayModelName} sample output`,
        width: image.width || 800,
        height: image.height || 600,
        mediaType: image.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(image.url) ? 'video' : 'image',
        poster: image.poster,
      }
    }

    const image = getModelDemoImage(selectedModelId)
    return {
      url: image.src,
      caption: image.alt || `${displayModelName} sample output`,
      width: image.width,
      height: image.height,
      mediaType: 'image' as GenerationMediaType,
      poster: undefined,
    }
  }, [displayModelName, sampleImages, selectedModelId])
  const isSharpSampleImage = sampleImageVariant === 'sharp'
  const displayedSampleImageUrl = promptDemoImage?.url || sampleImage.url
  const displayedSampleImageTitle = promptDemoImage?.title || sampleImage.caption
  const displayedSampleImageWidth = promptDemoImage?.width || sampleImage.width
  const displayedSampleImageHeight = promptDemoImage?.height || sampleImage.height
  const displayedSampleMediaType = promptDemoImage?.mediaType || sampleImage.mediaType
  const displayedSamplePoster = promptDemoImage?.poster || sampleImage.poster

  const handleModelChange = (nextModelId: ModelOption['id']) => {
    if (nextModelId === selectedModelId) {
      setIsModelMenuOpen(false)
      return
    }
    setSelectedModelId(nextModelId)
    setActiveModelGroupId(getModelGroupId(nextModelId))
    setAspectRatio((currentAspectRatio) => {
      const nextAspectRatios = MODEL_CONFIG[nextModelId].aspectRatios
      return nextAspectRatios.some((item) => item.value === currentAspectRatio)
        ? currentAspectRatio
        : nextAspectRatios[0]?.value || 'auto'
    })
    setResolution((currentResolution) => {
      const nextResolutionOptions = getResolutionOptionsForModel(nextModelId)
      return nextResolutionOptions.includes(currentResolution)
        ? currentResolution
        : nextResolutionOptions[0] || '1K'
    })
    setIsModelMenuOpen(false)
    if (isCouplePhotoMakerMode) return
    setActiveTab(imageFiles.length > 0 || remoteImageUrls.length > 0 ? 'image-to-image' : getDefaultTabForModel(nextModelId))

    const parts = pathname.split('/').filter(Boolean)
    const modelIndex = parts.indexOf('model')
    if (modelIndex !== -1 && parts.length > modelIndex + 1) {
      parts[modelIndex + 1] = nextModelId
      window.history.pushState(null, '', `/${parts.join('/')}`)
      return
    }
    window.history.pushState(null, '', `/model/${nextModelId}`)
  }

  const openResultSignIn = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
  }

  const renderModelOptionButton = (option: ModelOption, group: ModelGroup) => {
    const isSelectedModel = option.id === selectedModelId
    const metadata = getModelOptionMetadata(option.id)

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
                src={group.logoSrc}
                alt={group.logoAlt}
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
            <ModelQualityRating value={option.qualityRating} />
          </span>
          {isSelectedModel && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-[#4F46E5]">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          {metadata.map((item) => (
            <span key={item} className="rounded-md border border-slate-200 bg-white/80 px-2 py-1 text-[11px] font-semibold leading-none text-slate-600">
              {item}
            </span>
          ))}
        </span>
      </button>
    )
  }

  const renderDemoPreview = () => {
    if (isCouplePhotoMakerMode) {
      return selectedTemplateImage ? (
        <img
          src={`${selectedTemplateImage}?v=20260508`}
          alt={selectedTemplate?.title || toolText.sampleImage}
          className="h-full w-full rounded-xl object-contain ring-1 ring-slate-200/50"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white text-sm text-slate-500 ring-1 ring-slate-200/50">
          {toolText.noDemoImageYet}
        </div>
      )
    }

    return (
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden ring-1 ring-slate-200/50 ${
          isSharpSampleImage ? 'rounded-md bg-slate-50 p-0 shadow-none' : 'rounded-2xl p-2 shadow-inner'
        }`}
      >
        {displayedSampleMediaType === 'video' ? (
          <video
            src={displayedSampleImageUrl}
            poster={displayedSamplePoster}
            className={isSharpSampleImage ? 'h-full max-h-full max-w-full rounded-md object-contain' : 'h-full max-h-full max-w-full object-contain'}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label={displayedSampleImageTitle}
          />
        ) : (
          <SiteImage
            src={displayedSampleImageUrl}
            alt={displayedSampleImageTitle}
            autoAlt={!promptDemoImage}
            width={displayedSampleImageWidth}
            height={displayedSampleImageHeight}
            unoptimized={shouldUseDirectImageForDemo(displayedSampleImageUrl)}
            className={isSharpSampleImage ? 'max-h-full max-w-full rounded-md' : 'max-h-full max-w-full'}
            style={{
              objectFit: 'contain',
              width: isSharpSampleImage ? '100%' : 'auto',
              height: '100%',
              maxHeight: '100%',
            }}
          />
        )}
      </div>
    )
  }

  const renderResultRetentionPrompt = () => {
    if (isUserSignedIn) return null

    return (
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        <button
          type="button"
          onClick={openResultSignIn}
          className="font-bold text-[#4F46E5] underline-offset-2 hover:underline"
        >
          {toolText.resultRetentionLogin}
        </button>
        {toolText.resultRetentionMessage}
      </p>
    )
  }

  const copyPromptToClipboard = async (promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText)
      showToast(toolText.promptCopied, 'success')
    } catch (err) {
      console.error('Failed to copy:', err)
      const textArea = document.createElement('textarea')
      textArea.value = promptText
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        showToast(toolText.promptCopied, 'success')
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr)
        showToast(toolText.promptCopyFailed, 'error')
      }
      document.body.removeChild(textArea)
    }
  }

  const handleDesktopResultFeedWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    container.scrollTop += event.deltaY
  }

  const showDesktopPromptTooltip = (
    event: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>,
    promptText: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const viewportPadding = 16
    const width = Math.min(544, window.innerWidth - viewportPadding * 2)
    const left = Math.max(
      viewportPadding,
      Math.min(rect.left, window.innerWidth - width - viewportPadding),
    )
    const preferredTop = rect.bottom + 8
    const top = preferredTop + 224 <= window.innerHeight - viewportPadding
      ? preferredTop
      : Math.max(viewportPadding, rect.top - 232)

    setDesktopPromptTooltip({ text: promptText, left, top, width })
  }

  const hideDesktopPromptTooltip = () => {
    setDesktopPromptTooltip(null)
  }

  const shouldShowPromptEllipsisTrigger = (promptText: string) =>
    promptText.length > 220 || promptText.split(/\r\n|\r|\n/).length > 4

  const renderDesktopPromptPreview = (promptText: string, testId: string) => {
    const showEllipsisTrigger = shouldShowPromptEllipsisTrigger(promptText)

    return (
      <div className="relative min-w-0">
        <p
          data-desktop-result-prompt={testId === 'data-desktop-result-prompt' ? true : undefined}
          data-desktop-pending-result-prompt={testId === 'data-desktop-pending-result-prompt' ? true : undefined}
          data-desktop-failed-result-prompt={testId === 'data-desktop-failed-result-prompt' ? true : undefined}
          style={promptPreviewClampStyle}
          className="text-sm leading-6 text-slate-600"
        >
          {promptText}
        </p>
        {showEllipsisTrigger && (
          <span
            data-desktop-prompt-ellipsis
            aria-hidden="true"
            onMouseEnter={(event) => showDesktopPromptTooltip(event, promptText)}
            onMouseLeave={hideDesktopPromptTooltip}
            className="absolute bottom-0 right-0 h-6 w-8"
          />
        )}
      </div>
    )
  }

  const getHistoryItemModelName = (item: HistoryItem) =>
    item.modelId
      ? modelOptions.find((option) => option.id === item.modelId)?.name || selectedModelName
      : selectedModelName

  const getHistoryReferencePreviewUrls = (item: {
    inputPreview?: string
    inputUrls?: string[]
  }) => {
    const inputUrls = Array.isArray(item.inputUrls)
      ? item.inputUrls.filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
      : []
    if (inputUrls.length > 0) return inputUrls
    return item.inputPreview ? [item.inputPreview] : []
  }

  const getInlineHistoryDisplay = (item: {
    modelId?: ImageModelId
    modelName?: string
    toolSlug?: string | null
    toolLabel?: string | null
    sourcePath?: string | null
  }) => {
    const historyDisplay = getWrappedHairToolHistoryDisplay({
      model: item.modelId,
      toolSlug: item.toolSlug,
      toolLabel: item.toolLabel,
      sourcePath: item.sourcePath || pathname,
    })
    const modelLabel = historyDisplay.showToolLabel
      ? historyDisplay.modelLabel
      : item.modelName || (item.modelId ? getGenerationModelLabel(item.modelId) : selectedModelName)

    return {
      ...historyDisplay,
      modelLabel,
      showModelLabel: Boolean(modelLabel),
    }
  }

  const getHistoryMetaTags = (item: {
    modelId?: ImageModelId
    modelName?: string
    aspectRatio?: string
    resolution?: string
    outputFormat?: string
    toolSlug?: string | null
    toolLabel?: string | null
    sourcePath?: string | null
  }, timeLabel: string) => {
    const display = getInlineHistoryDisplay(item)
    const outputFormatTag = item.outputFormat && item.outputFormat !== 'Auto'
      ? formatTagValue(item.outputFormat)
      : ''
    return [
      display.showToolLabel && display.toolLabel ? display.toolLabel : '',
      display.showModelLabel && display.modelLabel ? display.modelLabel : '',
      formatTagValue(item.aspectRatio),
      item.resolution ? formatTagValue(item.resolution) : '',
      outputFormatTag,
      timeLabel,
    ].filter(Boolean)
  }

  const renderInlineHistoryMeta = (item: {
    modelId?: ImageModelId
    modelName?: string
    aspectRatio?: string
    resolution?: string
    outputFormat?: string
    toolSlug?: string | null
    toolLabel?: string | null
    sourcePath?: string | null
  }, timeLabel: string) => {
    const metaTags = getHistoryMetaTags(item, timeLabel)

    return (
      <div data-desktop-history-meta className="flex flex-wrap items-center gap-1">
        {metaTags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="rounded-full bg-[#EEF2FF]/60 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-[#C7D2FE]/70"
          >
            {tag}
          </span>
        ))}
      </div>
    )
  }

  const renderMobileHistoryMeta = (item: {
    modelId?: ImageModelId
    modelName?: string
    aspectRatio?: string
    resolution?: string
    outputFormat?: string
    toolSlug?: string | null
    toolLabel?: string | null
    sourcePath?: string | null
  }, timeLabel: string) => {
    const metaTags = getHistoryMetaTags(item, timeLabel)

    return (
      <div data-mobile-history-meta className="mt-3 flex flex-wrap items-center gap-1 px-1">
        {metaTags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="rounded-full bg-[#EEF2FF]/60 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-[#C7D2FE]/70"
          >
            {tag}
          </span>
        ))}
      </div>
    )
  }

  const setHistoryItemRef = (itemId: string, node: HTMLDivElement | null) => {
    if (node) {
      historyItemRefs.current.set(itemId, node)
      return
    }
    historyItemRefs.current.delete(itemId)
  }

  const applyHistoryItemToForm = (item: HistoryItem) => {
    trackGenerationHistoryRecreateClick(item, { surface: 'inline_generator_history' })

    const inputImageUrls = getOriginalHistoryInputImageUrls(item)
    if (item.modelId) {
      setSelectedModelId(item.modelId)
      setActiveModelGroupId(getModelGroupId(item.modelId))
    }
    setPrompt(item.prompt)
    setAspectRatio(item.aspectRatio || getDefaultAspectRatioForModel(item.modelId || selectedModelId, presetMode))
    setResolution(item.resolution || getDefaultResolutionForModel(item.modelId || selectedModelId))
    setOutputFormat(item.outputFormat || 'Auto')
    setRemoteImageUrls(inputImageUrls.slice(0, getMaxImagesForModel(item.modelId || selectedModelId)))
    setActiveTab(inputImageUrls.length > 0 ? 'image-to-image' : 'text-to-image')
    setCurrentResult(item)
    setActiveSettingsHistoryItemId(item.id)
    historyItemRefs.current.get(item.id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const editHistoryItemImage = (item: HistoryItem) => {
    if (item.mediaType === 'video') {
      applyHistoryItemToForm(item)
      return
    }

    if (!isGenericImageEditToolPath(pathname)) {
      window.sessionStorage.setItem(PENDING_REPROMPT_STORAGE_KEY, JSON.stringify({
        mode: 'image-to-image',
        imageUrl: item.outputPreview,
      }))
      window.location.href = getLocalizedInternalPath(pathname, '/ai-image-generator')
      return
    }

    setImageFiles([])
    setRemoteImageUrls([item.outputPreview].slice(0, getMaxImagesForModel(selectedModelId)))
    setActiveTab('image-to-image')
    setActiveSettingsHistoryItemId(item.id)
    historyItemRefs.current.get(item.id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const renderDesktopResultItem = (item: HistoryItem) => (
    <div
      key={item.id}
      ref={(node) => setHistoryItemRef(item.id, node)}
      data-desktop-result-item
      className={`grid gap-4 rounded-2xl border-b border-[#E0E7FF] pb-6 transition-colors last:border-b-0 last:pb-0 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)] ${
        activeSettingsHistoryItemId === item.id ? 'bg-[#EEF2FF]/60 p-4 ring-1 ring-[#C7D2FE]' : ''
      }`}
    >
      <div>
        {item.mediaType === 'video' ? (
          <div className="flex min-h-[140px] items-center justify-center rounded-xl bg-slate-950 p-2">
            <video
              src={item.outputPreview}
              className="max-h-[220px] w-full rounded-lg object-contain"
              autoPlay
              muted
              loop
              controls
              playsInline
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPreviewImage(item.outputPreview)}
            className="flex min-h-[140px] items-center justify-center rounded-xl bg-slate-50 p-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
            title={toolText.generatedAlt}
          >
            <img
              src={getDisplayImagePreviewUrl(item.outputPreview, 960)}
              alt={toolText.generatedAlt}
              className="max-h-[220px] w-full rounded-lg object-contain transition-opacity hover:opacity-90"
              loading="lazy"
              decoding="async"
            />
          </button>
        )}
      </div>

      <div className="min-w-0 space-y-4">
        {renderInlineHistoryMeta({
          ...item,
          modelName: getHistoryItemModelName(item),
        }, item.time)}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-extrabold text-slate-900">{toolText.prompt}</p>
            {renderDesktopPromptPreview(item.prompt, 'data-desktop-result-prompt')}
          </div>
          <button
            type="button"
            onClick={() => void copyPromptToClipboard(item.prompt)}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            title={toolText.copyPrompt}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        {getHistoryReferencePreviewUrls(item).length > 0 && (
          <div className="flex max-w-md flex-wrap gap-2">
            {getHistoryReferencePreviewUrls(item).map((url, index) => (
              <button
                key={`${url}-${index}`}
                data-desktop-result-reference
                type="button"
                onClick={() => setPreviewImage(url)}
                className="inline-flex items-center p-0 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/30"
                title={`${toolText.inputImage} ${index + 1}`}
              >
                <img
                  src={getReferencePreviewUrl(url)}
                  alt={`${toolText.inputAlt} ${index + 1}`}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        )}

        <div data-desktop-result-actions className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => applyHistoryItemToForm(item)}
            className="rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#9333EA] px-5 py-2.5 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg"
          >
            {toolText.recreate}
          </button>
          {item.mediaType !== 'video' && (
            <button
              data-desktop-edit-image
              type="button"
              onClick={() => editHistoryItemImage(item)}
              className="flex items-center justify-center rounded-xl border border-[#C7D2FE] px-3 py-2.5 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
            >
              {toolText.editImage}
            </button>
          )}
          <button
            type="button"
            onClick={() => handleDownload(item.outputPreview, `generated-${item.id}.${getGeneratedFileExtension(item)}`, item)}
            disabled={downloadingUrl === item.outputPreview}
            className="flex items-center justify-center rounded-xl border border-[#C7D2FE] px-3 py-2.5 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-50"
            title={downloadingUrl === item.outputPreview ? toolText.downloading : toolText.download}
          >
            {downloadingUrl === item.outputPreview ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="16" opacity="0.3" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="16" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => void handleDeleteHistoryItem(item)}
            className="flex items-center justify-center rounded-xl border border-[#C7D2FE] px-3 py-2.5 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
            title={toolText.delete}
          >
            <DeleteIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderDesktopPendingResultItem = (item: PendingGenerationItem) => (
    <div
      key={item.id}
      data-desktop-result-item
      className="grid gap-4 border-b border-[#E0E7FF] pb-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
    >
      <div className="flex min-h-[140px] items-center justify-center rounded-xl bg-slate-50 p-2">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-sm font-semibold text-[#4F46E5]">
            {formatToolText(toolText.generatingSeconds, {
              seconds: Math.max(0, Math.floor((Date.now() - item.startedAt) / 1000)),
            })}
          </p>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        {renderInlineHistoryMeta(item, new Date().toLocaleString())}

        <div>
          <p className="mb-2 text-sm font-extrabold text-slate-900">{toolText.prompt}</p>
          {renderDesktopPromptPreview(item.prompt, 'data-desktop-pending-result-prompt')}
        </div>
        {item.inputPreview && (
          <button
            type="button"
            onClick={() => setPreviewImage(item.inputPreview)}
            className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
            title={toolText.inputImage}
          >
            <img
              src={getReferencePreviewUrl(item.inputPreview)}
              alt={toolText.inputAlt}
              className="h-14 w-14 rounded-lg object-cover ring-1 ring-[#E0E7FF]"
            />
          </button>
        )}
      </div>
    </div>
  )

  const applyGenerationItemToForm = (item: PendingGenerationItem) => {
    const inputImageUrls = getOriginalHistoryInputImageUrls(item)
    setSelectedModelId(item.modelId)
    setActiveModelGroupId(getModelGroupId(item.modelId))
    setPrompt(item.prompt)
    setAspectRatio(item.aspectRatio || getDefaultAspectRatioForModel(item.modelId, presetMode))
    setResolution(item.resolution || getDefaultResolutionForModel(item.modelId))
    setOutputFormat(item.outputFormat || 'Auto')
    setRemoteImageUrls(inputImageUrls.slice(0, getMaxImagesForModel(item.modelId)))
    setActiveTab(inputImageUrls.length > 0 ? 'image-to-image' : 'text-to-image')
    setActiveSettingsHistoryItemId(item.id)
    historyItemRefs.current.get(item.id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const renderDesktopFailedResultItem = (item: FailedGenerationItem) => (
    <div
      key={item.id}
      ref={(node) => setHistoryItemRef(item.id, node)}
      data-desktop-failed-result-item
      data-desktop-result-item
      className={`grid gap-4 rounded-2xl border-b border-[#E0E7FF] pb-6 transition-colors lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)] ${
        activeSettingsHistoryItemId === item.id ? 'bg-[#EEF2FF]/60 p-4 ring-1 ring-[#C7D2FE]' : ''
      }`}
    >
      <div
        data-desktop-failed-result-preview
        className="flex min-h-[140px] items-center justify-center rounded-xl border border-red-100 bg-red-50/70 p-5 text-center"
      >
        <div className="space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 ring-1 ring-red-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-extrabold text-red-700">{toolText.imageGenerationFailed}</p>
          <p className="text-xs leading-5 text-red-600">{item.errorMessage}</p>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        {renderInlineHistoryMeta(item, new Date(item.startedAt).toLocaleString())}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-extrabold text-slate-900">{toolText.prompt}</p>
            {renderDesktopPromptPreview(item.prompt, 'data-desktop-failed-result-prompt')}
          </div>
          <button
            type="button"
            onClick={() => void copyPromptToClipboard(item.prompt)}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            title={toolText.copyPrompt}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        {item.inputPreview && (
          <button
            type="button"
            onClick={() => setPreviewImage(item.inputPreview)}
            className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
            title={toolText.inputImage}
          >
            <img
              src={getReferencePreviewUrl(item.inputPreview)}
              alt={toolText.inputAlt}
              className="h-14 w-14 rounded-lg object-cover ring-1 ring-[#E0E7FF] transition-opacity hover:opacity-80"
              loading="lazy"
              decoding="async"
            />
          </button>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => applyGenerationItemToForm(item)}
            className="rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#9333EA] px-5 py-2.5 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg"
          >
            {toolText.recreate}
          </button>
          <button
            type="button"
            data-desktop-failed-download
            disabled
            className="flex cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-300"
            title={toolText.download}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setFailedGenerationItems((prev) => prev.filter((failedItem) => failedItem.id !== item.id))}
            className="flex items-center justify-center rounded-xl border border-[#C7D2FE] px-3 py-2.5 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
            title={toolText.delete}
          >
            <DeleteIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderDesktopResultFeed = () => (
    <div
      data-desktop-result-feed
      onWheel={handleDesktopResultFeedWheel}
      className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain p-4 md:p-5"
    >
      <div className="space-y-6">
        {pendingGenerationItems.map((item) => (
          renderDesktopPendingResultItem(item)
        ))}
        {failedGenerationItems.map((item) => (
          renderDesktopFailedResultItem(item)
        ))}
        {history.map((item) => (
          renderDesktopResultItem(item)
        ))}
        {!isGenerating && failedGenerationItems.length === 0 && history.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#E0E7FF] bg-white px-4 py-10 text-center text-sm text-slate-500">
            {toolText.noHistory}
          </p>
        )}
        {renderResultRetentionPrompt()}
      </div>
    </div>
  )

  const renderDesktopResultTabs = () => (
    <div
      data-desktop-result-tabs
      className="flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-[#E0E7FF] bg-white/90 p-1 shadow-sm shadow-[#4F46E5]/5"
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
        {toolText.demo}
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
        {toolText.history}
      </button>
    </div>
  )

  const renderMobileResultTabs = () => (
    <div
      data-mobile-result-tabs
      className="flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-[#E0E7FF] bg-white/90 p-1 shadow-sm shadow-[#4F46E5]/5"
    >
      <button
        type="button"
        data-mobile-result-tab="sample"
        aria-pressed={rightMode !== 'history'}
        onClick={() => setRightMode('sample')}
        className={`inline-flex h-8 min-w-[76px] items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors ${
          rightMode !== 'history'
            ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
            : 'text-slate-500 hover:bg-[#F8FAFF] hover:text-slate-700'
        }`}
      >
        {toolText.demo}
      </button>
      <button
        type="button"
        data-mobile-result-tab="history"
        aria-pressed={rightMode === 'history'}
        onClick={() => setRightMode('history')}
        className={`inline-flex h-8 min-w-[76px] items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors ${
          rightMode === 'history'
            ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
            : 'text-slate-500 hover:bg-[#F8FAFF] hover:text-slate-700'
        }`}
      >
        {toolText.history}
      </button>
    </div>
  )

  const renderMobileGeneratingCard = () => (
    <div
      data-mobile-generating-card
      className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-[#E0E7FF] bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="h-3 w-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="h-3 w-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
          <div className="h-3 w-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
        <p className="text-sm font-medium text-slate-500">{formatToolText(toolText.generatingSeconds, { seconds: generatingSeconds })}</p>
      </div>
    </div>
  )

  const renderMobileHistoryFeed = () => {
    if (!isGenerating && !currentResult && !isUserSignedIn) return null

    const recentHistory = history.slice(0, 4)
    const currentResultRecreateDisabled =
      !currentResult ||
      isGenerating ||
      !(currentResult.prompt && currentResult.prompt.trim()) ||
      (activeTab === 'image-to-image' && imageFiles.length === 0 && !currentResult.inputPreview)

    return (
      <div data-mobile-generation-panel className="md:hidden">
        {isUserSignedIn && (
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">{toolText.history}</h2>
            <Link href={historyPageHref} className="text-xs font-bold text-[#4F46E5] hover:text-[#3730A3]">
              {toolText.viewAll}
            </Link>
          </div>
        )}
        {isGenerating ? (
          renderMobileGeneratingCard()
        ) : currentResult ? (
          <div className="rounded-2xl border border-[#E0E7FF] bg-white p-2 shadow-sm">
            {currentResult.mediaType === 'video' ? (
              <video
                src={currentResult.outputPreview}
                className="aspect-[4/3] w-full rounded-xl bg-slate-950 object-contain"
                autoPlay
                muted
                loop
                controls
                playsInline
              />
            ) : (
              <img
                src={currentResult.outputPreview}
                alt={toolText.generatedAlt}
                onClick={() => setPreviewImage(currentResult.outputPreview)}
                className="aspect-[4/3] w-full rounded-xl object-contain cursor-pointer bg-slate-50"
              />
            )}
            {renderMobileHistoryMeta({
              ...currentResult,
              modelName: getHistoryItemModelName(currentResult),
            }, currentResult.time)}
            <div data-mobile-result-prompt className="mt-3 space-y-1.5 px-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-extrabold text-slate-900">{toolText.prompt}</p>
                <button
                  type="button"
                  onClick={() => void copyPromptToClipboard(currentResult.prompt)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  title={toolText.copyPrompt}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
              <p className="max-h-24 overflow-y-auto text-xs leading-5 text-slate-600">
                {currentResult.prompt}
              </p>
            </div>
            {getHistoryReferencePreviewUrls(currentResult).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {getHistoryReferencePreviewUrls(currentResult).map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    data-mobile-result-reference
                    type="button"
                    onClick={() => setPreviewImage(url)}
                    className="inline-flex items-center p-0 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/30"
                    title={`${toolText.inputImage} ${index + 1}`}
                  >
                    <img
                      src={getReferencePreviewUrl(url)}
                      alt={`${toolText.inputAlt} ${index + 1}`}
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
            <div data-mobile-result-actions className={`mt-3 grid gap-2 ${currentResult.mediaType === 'video' ? 'grid-cols-3' : 'grid-cols-4'}`}>
              <button
                type="button"
                onClick={handleRecreateFromCurrent}
                disabled={currentResultRecreateDisabled}
                className="min-w-0 truncate rounded-xl bg-[#4F46E5] px-2.5 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:bg-[#C7D2FE] disabled:shadow-none"
              >
                {toolText.recreate}
              </button>
              {currentResult.mediaType !== 'video' && (
                <button
                  data-mobile-edit-image
                  type="button"
                  onClick={() => editHistoryItemImage(currentResult)}
                  className="min-w-0 truncate rounded-xl border border-[#C7D2FE] px-2.5 py-2.5 text-xs font-extrabold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
                  title={toolText.editImage}
                >
                  {toolText.editImageShort}
                </button>
              )}
              <button
                data-mobile-download
                type="button"
                onClick={() => handleDownload(currentResult.outputPreview, `generated-${currentResult.id}.${getGeneratedFileExtension(currentResult)}`, currentResult)}
                disabled={downloadingUrl === currentResult.outputPreview}
                aria-label={downloadingUrl === currentResult.outputPreview ? toolText.downloading : toolText.download}
                className="flex min-w-0 items-center justify-center rounded-xl border border-[#C7D2FE] px-2.5 py-2.5 text-xs font-extrabold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-60"
                title={downloadingUrl === currentResult.outputPreview ? toolText.downloading : toolText.download}
              >
                {downloadingUrl === currentResult.outputPreview ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="16" opacity="0.3" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="16" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                )}
              </button>
              <button
                data-mobile-delete
                type="button"
                onClick={() => void handleDeleteCurrentResult()}
                aria-label={toolText.delete}
                className="flex min-w-0 items-center justify-center rounded-xl border border-[#C7D2FE] px-2.5 py-2.5 text-xs font-extrabold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
                title={toolText.delete}
              >
                <DeleteIcon size={16} />
              </button>
            </div>
            {renderResultRetentionPrompt()}
          </div>
        ) : isUserSignedIn ? (
          recentHistory.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {recentHistory.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentResult(item)
                    setRightMode('history')
                  }}
                  className="overflow-hidden rounded-xl border border-[#E0E7FF] bg-white p-1 text-left"
                >
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.outputPreview}
                      className="aspect-[4/3] w-full rounded-lg bg-slate-950 object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={getDisplayImagePreviewUrl(item.outputPreview, 384)}
                      alt={toolText.historyResultAlt}
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-[#E0E7FF] bg-white px-4 py-5 text-center text-sm text-slate-500">
              {toolText.noHistory}
            </p>
          )
        ) : null}
      </div>
    )
  }

  const renderMobileTopPanel = () => {
    const showMobileHero = rightMode !== 'history' && (heroBreadcrumbItems?.length || heroEyebrow || heroTitle || heroDescription)

    return (
      <div className="space-y-4 md:hidden">
        {hasMobileResultTabs ? renderMobileResultTabs() : null}
        {rightMode === 'history' ? (
          renderMobileHistoryFeed()
        ) : (
          <>
            <div data-mobile-demo-panel className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#E0E7FF] bg-white p-2 shadow-lg shadow-[#4F46E5]/8">
              {renderDemoPreview()}
            </div>
            {showMobileHero && (
              <div data-mobile-result-hero className="text-left">
                {heroBreadcrumbItems?.length ? (
                  <div className="mb-1 flex justify-start">
                    <Breadcrumb items={heroBreadcrumbItems} variant="inline" />
                  </div>
                ) : null}
                {heroEyebrow && (
                  <div className="mb-3 flex flex-wrap items-center justify-start gap-3">
                    {heroEyebrow}
                  </div>
                )}
                {heroTitle && (
                  <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-950">
                    {heroTitle}
                  </h1>
                )}
                {heroDescription && (
                  <p className="mt-3 max-w-none text-base leading-7 text-slate-600">
                    {heroDescription}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  const rightPanelShadowClass = plainRightPanel ? 'shadow-none' : 'shadow-lg shadow-[#4F46E5]/8'

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-visible p-2 md:pl-3 md:pr-3 md:pb-6 md:pt-3 xl:pl-4 xl:pr-4 2xl:pl-5 2xl:pr-5">
      <div
        data-generation-tool-shell
        className={`flex min-h-0 min-w-0 flex-col gap-4 ${fitParentHeight ? 'md:h-full md:min-h-0' : 'md:h-[calc(100dvh-6rem)] md:max-h-[calc(100dvh-6rem)] md:min-h-0'} md:flex-row md:items-stretch md:gap-3 xl:gap-4 2xl:gap-5`}
      >
        {renderMobileTopPanel()}
        {/* Left: 生图参数区 — 桌面可滚动+固定按钮；h5 上下流式布局，自然高度 */}
        <div
          data-left-generation-panel
          className="w-full md:h-full md:w-[380px] xl:w-[400px] 2xl:w-[420px] flex-shrink-0 flex flex-col rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8 overflow-visible"
        >
          <div
            data-left-settings-scroll
            className={`p-2 md:p-6 space-y-4 md:space-y-5 md:flex-1 md:min-h-0 md:overscroll-contain ${isModelMenuOpen ? 'md:overflow-visible' : 'md:overflow-y-auto'}`}
          >
            {/* Tabs */}
            {!isCouplePhotoMakerMode && !hideModelBranding && (
              <div className="flex rounded-xl bg-[#EEF2FF] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('image-to-image')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'image-to-image'
                      ? 'bg-white text-[#4F46E5] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {toolText.imageToImage}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('text-to-image')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'text-to-image'
                      ? 'bg-white text-[#4F46E5] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {toolText.textToImage}
                </button>
              </div>
            )}

            {/* Models */}
            {!isCouplePhotoMakerMode && !hideModelBranding && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{toolText.models}</label>
                <div ref={modelSelectorRef} className="relative z-40">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModelGroupId(selectedModelGroup.id)
                      setIsModelMenuOpen((open) => !open)
                    }}
                    className="!flex w-full items-center justify-between gap-3 !rounded-xl !border !border-[#E0E7FF] bg-[#EEF2FF]/30 !px-3 !py-2.5 text-left text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 !whitespace-normal hover:!border-[#C7D2FE] hover:bg-[#EEF2FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                    aria-haspopup="listbox"
                    aria-expanded={isModelMenuOpen}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <img
                        src={selectedModelGroup.logoSrc}
                        alt={selectedModelGroup.logoAlt}
                        className="h-5 w-5 shrink-0 rounded-md object-contain"
                        loading="lazy"
                      />
                      <span className="min-w-0">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-bold text-slate-900">{selectedModelName}</span>
                          {selectedModelOption?.badge && (
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white ${
                              selectedModelOption.badge === 'Hot' ? 'bg-red-500' : 'bg-emerald-500'
                            }`}>
                              {selectedModelOption.badge}
                            </span>
                          )}
                        </span>
                      </span>
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
                      <div data-mobile-model-menu className="absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-full overflow-y-auto !rounded-2xl !border !border-[#E0E7FF] bg-white p-2 shadow-xl shadow-[#4F46E5]/12 md:hidden" role="listbox">
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
                                <img
                                  src={group.logoSrc}
                                  alt={group.logoAlt}
                                  className="h-5 w-5 shrink-0 rounded-md object-contain"
                                  loading="lazy"
                                />
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

                      <div className="absolute left-0 top-full z-50 mt-2 hidden h-[380px] max-h-[70vh] overflow-hidden !rounded-2xl !border !border-[#E0E7FF] bg-white shadow-xl shadow-[#4F46E5]/12 md:grid md:w-[640px] md:grid-cols-[210px_minmax(0,430px)]" role="listbox">
                        <div className="h-full space-y-1 overflow-y-auto border-r border-slate-100 bg-slate-50/70 p-2">
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
                                <img
                                  src={group.logoSrc}
                                  alt={group.logoAlt}
                                  className="h-5 w-5 shrink-0 rounded-md object-contain"
                                  loading="lazy"
                                />
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

                        <div className="h-full min-w-0 space-y-2 overflow-y-auto p-2">
                          {activeModelGroup.models.map((option) => renderModelOptionButton(option, activeModelGroup))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Image Upload (Image to Image) - 小正方形一排三个 */}
            {activeTab === 'image-to-image' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wide">
                    {sceneText?.uploadTitle || (MAX_IMAGES === 1 ? 'Upload your image' : formatToolText(toolText.uploadUpTo, { count: MAX_IMAGES }))}
                  </label>
                  {(imageFiles.length > 0 || remoteImageUrls.length > 0) && (
                    <span className="text-xs font-medium text-slate-400">{imageFiles.length + remoteImageUrls.length}/{MAX_IMAGES}</span>
                  )}
                </div>
                <div className={`grid gap-2 ${MAX_IMAGES === 1 ? 'grid-cols-1 max-w-40' : 'grid-cols-3'}`}>
                  {/* 上传占位：第一格 */}
                  {imageFiles.length + remoteImageUrls.length < MAX_IMAGES && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      className="aspect-square rounded-lg border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF]/50 cursor-pointer hover:border-[#4F46E5]/50 hover:bg-[#E0E7FF]/50 transition-all duration-200 flex flex-col items-center justify-center"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple={MAX_IMAGES > 1}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.length) handleFiles(e.target.files)
                          e.target.value = ''
                        }}
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span className="text-xs font-medium text-slate-500">{toolText.upload}</span>
                    </div>
                  )}
                  {remoteImageUrls.map((url, index) => {
                    const previewState = remoteImagePreviewStates[url] || 'loading'
                    const isReferencePreviewLoading = previewState === 'loading' || previewState === 'retrying'

                    return (
                      <div
                        key={`${url}-${index}`}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-[#E0E7FF] bg-slate-100 cursor-pointer"
                        onClick={() => setPreviewImage(url)}
                      >
                        {previewState !== 'failed' && (
                          <img
                            data-left-remote-reference-image
                            src={previewState === 'retrying' ? normalizeReusableReferenceImageUrl(url) : getReferencePreviewUrl(url)}
                            alt={`${toolText.inputAlt} ${index + 1}`}
                            className={`w-full h-full object-cover transition-opacity duration-200 ${isReferencePreviewLoading ? 'opacity-0' : 'opacity-100'}`}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => setRemoteImagePreviewState(url, 'loaded')}
                            onError={() => setRemoteImagePreviewState(url, previewState === 'retrying' ? 'failed' : 'retrying')}
                          />
                        )}
                        {isReferencePreviewLoading && (
                          <div
                            data-left-remote-reference-loading
                            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 text-xs font-semibold text-slate-500"
                          >
                            <span className="h-5 w-5 rounded-full border-2 border-[#C7D2FE] border-t-[#4F46E5] animate-spin" />
                            <span>{toolText.referenceImageLoading}</span>
                          </div>
                        )}
                        {previewState === 'failed' && (
                          <div
                            data-left-remote-reference-failed
                            className="absolute inset-0 flex items-center justify-center bg-slate-100 px-3 text-center text-xs font-semibold text-slate-500"
                          >
                            Image Failed
                          </div>
                        )}
                        <ImageReplaceButton
                          onReplace={() => replaceRemoteImage(index)}
                          label={toolText.replace}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRemoteImageUrls((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-md bg-white/80 flex items-center justify-center shadow-sm z-10 text-black [&_svg]:flex-shrink-0 md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible md:transition-opacity"
                          title={toolText.delete}
                        >
                          <DeleteIcon size={16} />
                        </button>
                      </div>
                    )
                  })}

                  {/* 已上传图片：小正方形 + 序号 */}
                  {imageFiles.map((item, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-[#E0E7FF] bg-slate-100 cursor-pointer"
                    >
                      <img
                        src={item.preview}
                        alt={`${toolText.upload} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <ImageReplaceButton
                        onReplace={() => replaceLocalImage(index)}
                        label={toolText.replace}
                      />
                      {/* 序号：右下角 - 深灰色圆角方形，白色数字 */}
                      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-white/80 text-black text-xs font-bold flex items-center justify-center shadow-sm z-10">
                        {index + 1}
                      </span>
                      {/* 删除按钮：右上角 - 与右下角序号同款底色和形状，Web hover 显示，H5 常显 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-md bg-white/80 flex items-center justify-center shadow-sm z-10 text-black [&_svg]:flex-shrink-0 md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible md:transition-opacity"
                        title={toolText.delete}
                      >
                        <DeleteIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {sceneText?.uploadHelper || formatToolText(toolText.fileLimit, { count: MAX_IMAGES }).replace('30MB', `${MAX_FILE_SIZE_MB}MB`)}
                </p>
              </div>
            )}

            {isCouplePhotoMakerMode && (
              <div className="flex flex-col flex-1 min-h-0">
                <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{toolText.styleTemplates}</label>
                <div className="grid grid-cols-3 gap-[8px] flex-1 min-h-0 overflow-y-auto pb-[8px]">
                  {visibleTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`p-0 bg-transparent cursor-pointer rounded-lg overflow-hidden ${
                        selectedTemplateId === tpl.id ? 'ring-2 ring-[#6D28D9]' : 'ring-1 ring-slate-200/60'
                      }`}
                      title={tpl.title}
                    >
                      <div className="w-full aspect-[3/4] bg-[#EEF2FF] flex items-center justify-center text-[11px] font-semibold text-slate-500 overflow-hidden">
                        {tpl.image ? (
                          <img src={`${tpl.image}?v=20260508`} alt={tpl.title} className="h-full w-full object-cover" />
                        ) : (
                          toolText.previewSoon
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{toolText.aspectRatios}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {wrappedRatioOptions.map((ar) => {
                      const isSelected = aspectRatio === ar.value
                      return (
                        <button
                          key={ar.value}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setAspectRatio(ar.value)}
                          className={`min-h-10 rounded-xl border px-2 py-2 text-center text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
                              : 'border-[#E0E7FF] bg-white text-slate-600 hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
                          }`}
                        >
                          {ar.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Prompt */}
            {!hidePromptInput && !isCouplePhotoMakerMode && (
              <div>
                {promptModifier && promptModifier.options.length > 0 && (
                  <div className="mb-4">
                    <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-500">
                      {promptModifier.title}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {promptModifier.options.map((option) => {
                        const optionValue = option.value || option.label
                        const isSelected = selectedPromptModifier === optionValue
                        return (
                          <button
                            key={optionValue}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setSelectedPromptModifier(optionValue)}
                            className={`min-h-10 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                              isSelected
                                ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
                                : 'border-[#E0E7FF] bg-white text-slate-600 hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
                            }`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                {promptPresets.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">
                      {promptPresetTitle}
                    </label>
                    {promptPresetTabs.length > 0 && (
                      <div
                        role="tablist"
                        aria-label={promptPresetTitle}
                        className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1"
                      >
                        {promptPresetTabs.map((tab) => {
                          const isActive = activePromptPresetTab === tab.id
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              onClick={() => selectPromptPresetTab(tab.id)}
                              className={`min-h-9 rounded-lg px-2 py-2 text-xs font-bold transition-colors ${
                                isActive
                                  ? 'bg-white text-[#4F46E5] shadow-sm'
                                  : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
                              }`}
                            >
                              {tab.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {activePromptPresetTab !== customPromptTabId && (
                      <div className={hasImagePromptPresets ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-4 gap-3'}>
                      {visiblePromptPresets.map((preset) => {
                        const isSelected = selectedPromptPreset === preset.label
                        const hasImage = Boolean(preset.image)
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            title={preset.label}
                            aria-label={preset.label}
                            aria-pressed={isSelected}
                            onClick={() => {
                              setSelectedPromptPreset(preset.label)
                              if (preset.prompt?.trim()) {
                                setPrompt(preset.prompt)
                              }
                              if (!hidePresetPromptInput) {
                                requestAnimationFrame(() => {
                                  promptTextareaRef.current?.focus()
                                })
                              }
                            }}
                            className={
                              hasImage
                                ? `group overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all ${
                                    isSelected
                                      ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20'
                                      : 'border-slate-200 hover:border-[#C7D2FE] hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)]'
                                  }`
                                : `flex h-12 w-12 items-center justify-center rounded-2xl border bg-white p-1.5 shadow-sm transition-all ${
                                    isSelected
                                      ? 'border-[#4F46E5] shadow-[0_10px_26px_rgba(79,70,229,0.22)]'
                                      : 'border-slate-200 hover:border-[#C7D2FE] hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)]'
                                  }`
                            }
                          >
                            {hasImage ? (
                              <>
                                <span className="block aspect-square w-full overflow-hidden bg-slate-100">
                                  <img
                                    src={preset.image}
                                    alt=""
                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                                  />
                                </span>
                                <span className="block truncate px-2 py-1.5 text-center text-[11px] font-semibold text-slate-700">
                                  {preset.label}
                                </span>
                              </>
                            ) : (
                              <span
                                className="block min-h-9 min-w-9 rounded-xl border border-white shadow-sm"
                                data-swatch={preset.label}
                                style={getPromptPresetSwatchStyle(preset)}
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>
                    )}
                  </div>
                )}
                {!(hidePresetPromptInput && activePromptPresetTab !== customPromptTabId) && (
                  <>
                    <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{sceneText?.promptLabel || toolText.prompt}</label>
                    <div data-left-prompt-field className="relative">
                      <textarea
                        ref={promptTextareaRef}
                        data-left-prompt-input
                        value={prompt}
                        onChange={(e) => {
                          setPrompt(e.target.value)
                          if (activePromptPresetTab === customPromptTabId) {
                            setCustomPromptDraft(e.target.value)
                          }
                        }}
                        placeholder={sceneText?.promptPlaceholder || toolText.promptPlaceholder}
                        className="h-[7.5rem] w-full resize-none overflow-y-auto rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 pr-11 text-sm leading-6 text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                        rows={4}
                      />
                      {prompt && (
                        <button
                          type="button"
                          data-left-prompt-clear
                          aria-label="Clear Prompt"
                          onClick={() => {
                            setPrompt('')
                            setCustomPromptDraft('')
                            promptTextareaRef.current?.focus()
                          }}
                          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
                        >
                          <CloseIcon size={14} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Output Aspect Ratios */}
            {!isCouplePhotoMakerMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{toolText.outputAspectRatios}</label>
                <div className="grid grid-cols-4 gap-2">
                  {modelConfig.aspectRatios.map((ar) => {
                    const isSelected = aspectRatio === ar.value
                    return (
                      <button
                        key={ar.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setAspectRatio(ar.value)}
                        className={`min-h-10 rounded-xl border px-2 py-2 text-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
                            : 'border-[#E0E7FF] bg-white text-slate-600 hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
                        }`}
                      >
                        {ar.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Resolution */}
            {!isCouplePhotoMakerMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{toolText.resolution}</label>
                <div className="grid grid-cols-3 gap-2">
                  {resolutionOptions.map((option) => {
                    const isSelected = resolution === option
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setResolution(option)}
                        className={`min-h-10 rounded-xl border px-3 py-2 text-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
                            : 'border-[#E0E7FF] bg-white text-slate-600 hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedMediaType === 'video' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Video Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {VIDEO_DURATION_OPTIONS.map((option) => {
                    const isSelected = videoDurationSeconds === option
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setVideoDurationSeconds(option)}
                        className={`min-h-10 rounded-xl border px-3 py-2 text-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
                            : 'border-[#E0E7FF] bg-white text-slate-600 hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
                        }`}
                      >
                        {option}s
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {modelConfig.supportsOutputFormat && !isCouplePhotoMakerMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{toolText.outputFormat}</label>
                <div className="relative">
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF]/30 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] hover:border-[#C7D2FE] hover:bg-[#EEF2FF]/50 transition-all duration-200 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="Auto">Auto</option>
                    <option value="PNG">PNG</option>
                    <option value="JPG">JPG</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4F46E5]">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Generate 固定底部，始终在第一屏 */}
          <div data-generate-action-bar className="flex-shrink-0 rounded-b-2xl p-2 pt-4 md:p-6 md:pt-4 bg-white">
            <div className="flex gap-3">
              <button
                type="button"
                data-generate-button
                onClick={handleGenerate}
                disabled={!prompt.trim() || (activeTab === 'image-to-image' && imageFiles.length === 0 && remoteImageUrls.length === 0)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center disabled:cursor-not-allowed transition-all duration-200 text-white shadow-md hover:shadow-lg disabled:shadow-none"
                style={{
                  background: !prompt.trim() || (activeTab === 'image-to-image' && imageFiles.length === 0 && remoteImageUrls.length === 0)
                    ? 'linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)'
                    : 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{sceneText?.generateLabel || toolText.generate}</span>
                  <span
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
                </span>
              </button>
            </div>
            {sceneText?.safetyHelper && (
              <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                {sceneText.safetyHelper}
              </p>
            )}
          </div>
        </div>

        <div className="hidden min-h-0 min-w-0 flex-1 flex-col gap-4 md:flex md:h-full">
          {hasDesktopResultTabs ? renderDesktopResultTabs() : null}

          {rightMode !== 'history' && (heroBreadcrumbItems?.length || heroEyebrow || heroTitle || heroDescription) && (
            <div data-desktop-result-hero className="shrink-0 text-center md:px-0 md:pt-1 xl:pt-0">
              {heroBreadcrumbItems?.length ? (
                <div data-desktop-result-breadcrumbs className="mb-1 flex justify-start">
                  <Breadcrumb items={heroBreadcrumbItems} variant="inline" />
                </div>
              ) : null}
              {heroEyebrow && (
                <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
                  {heroEyebrow}
                </div>
              )}
              {heroTitle && (
                <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-950 md:text-[36px] xl:text-[38px]">
                  {heroTitle}
                </h1>
              )}
              {heroDescription && (
                <p className="mx-auto mt-3 max-w-4xl text-base leading-7 text-slate-600 md:text-[17px] md:leading-7">
                  {heroDescription}
                </p>
              )}
            </div>
          )}

          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:flex-row">
            <div
              data-desktop-result-card
              className={`relative z-10 flex min-h-[440px] min-w-0 flex-1 w-full flex-col overflow-hidden rounded-2xl border border-[#E0E7FF] bg-white ${rightPanelShadowClass}`}
            >
              {hasDesktopResultTabs && rightMode === 'history' ? (
                renderDesktopResultFeed()
              ) : (
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-2 md:p-8">
                  {renderDemoPreview()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {desktopPromptTooltip && (
        <div
          data-desktop-prompt-tooltip
          role="tooltip"
          className="pointer-events-none fixed z-[10060] max-h-56 overflow-y-auto rounded-xl border border-[#E0E7FF] bg-white p-3 text-sm leading-6 text-slate-700 shadow-xl shadow-slate-900/12"
          style={{
            left: desktopPromptTooltip.left,
            top: desktopPromptTooltip.top,
            width: desktopPromptTooltip.width,
          }}
        >
          {desktopPromptTooltip.text}
        </div>
      )}

      {/* Image Preview Modal - 点击非图片区域（背景）可退出 */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[10050] flex items-center justify-center p-2 md:p-6 cursor-pointer overflow-hidden"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt={commonToolText?.gallery?.preview || 'Preview'}
              className="max-w-[calc(100vw-16px)] max-h-[calc(100vh-16px)] md:max-w-[calc(100vw-48px)] md:max-h-[calc(100vh-48px)] w-auto h-auto object-contain rounded-lg cursor-default"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setPreviewImage(null)
              }}
              className="absolute top-2 right-2 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white hover:bg-white flex items-center justify-center shadow-lg transition-colors z-10 cursor-pointer text-slate-600 [&_svg]:flex-shrink-0"
              aria-label={commonToolText?.actions?.close || 'Close'}
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>
      )}

      {creditExhaustedModalOpen && (
        <div
          className="fixed inset-0 z-[10040] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="credit-exhausted-title"
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
              <h2 id="credit-exhausted-title" className="max-w-[12rem] pr-10 text-[28px] font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:max-w-none sm:text-3xl">
                {toolText.creditsUsedUpTitle}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {toolText.creditsUsedUpMessage}
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-[1.1fr_0.9fr]">
                <Link
                  href="/pricing"
                  onClick={handleCreditInsufficientBuyCreditsClick}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(99,102,241,0.34)]"
                >
                  {toolText.creditsUsedUpBuyAction || 'Buy Credits'}
                </Link>
                <Link
                  href="/earn-credits"
                  onClick={handleCreditInsufficientEarnFreeCreditsClick}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm font-extrabold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-indigo-50"
                >
                  {toolText.creditsUsedUpEarnAction || 'Earn Free Credits'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div id="toastContainer" className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] flex flex-col items-center gap-2.5 pointer-events-none">
        {toasts.map((toast) => {
          const ToastIcon = () => {
            if (toast.type === 'success') {
              return (
                <svg className="toast-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" fill="#059669"/>
                </svg>
              )
            } else if (toast.type === 'error') {
              return (
                <svg className="toast-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#EF4444"/>
                  <path d="M10 6V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14H10.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            } else if (toast.type === 'warning') {
              return (
                <svg className="toast-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#F59E0B"/>
                  <path d="M10 6V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14H10.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            }
            return null
          }

          return (
            <div
              key={toast.id}
              className={`toast ${toast.type}`}
            >
              <ToastIcon />
              <span>{toast.msg}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
