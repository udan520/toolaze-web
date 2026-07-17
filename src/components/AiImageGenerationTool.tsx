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
  getReferencePreviewUrl,
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
import { formatLocalTimestampToSeconds } from '@/lib/credit-history-time'

type RightPanelMode = 'sample' | 'generating' | 'history' | 'result'

interface HistoryItem {
  id: string
  inputPreview: string
  inputUrls?: string[]
  outputPreview: string
  prompt: string
  time: string
  modelId?: ImageModelId
  aspectRatio?: string
  resolution?: string
  outputFormat?: string
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
  maxUploadImages?: number
  hideModelBranding?: boolean
  sampleImageVariant?: 'default' | 'sharp'
  sampleImages?: Array<{
    url: string
    title?: string
    width?: number
    height?: number
  }>
  fitParentHeight?: boolean
  plainRightPanel?: boolean
  promptPresets?: PromptPreset[]
  promptPresetTitle?: string
  promptPresetTabs?: PromptPresetTab[]
  hidePresetPromptInput?: boolean
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

const TEXT_TO_IMAGE_DEFAULT_MODELS: ImageModelId[] = ['gpt-image-2', 'seedream-4-5', 'seedream-5-0-lite', 'seedream-5-0-pro', 'wan-2-7-image']

const getDefaultTabForModel = (id: ImageModelId): 'image-to-image' | 'text-to-image' =>
  TEXT_TO_IMAGE_DEFAULT_MODELS.includes(id) ? 'text-to-image' : 'image-to-image'

const getDefaultAspectRatioForModel = (id: ImageModelId, presetMode: AiImageGenerationToolProps['presetMode']): string => {
  const ratioOptions = presetMode === 'ai-couple-photo-maker'
    ? WRAPPED_IMAGE_PLAY_RATIO_OPTIONS
    : MODEL_CONFIG[id].aspectRatios

  return ratioOptions.some((item) => item.value === '16:9')
    ? '16:9'
    : ratioOptions[0]?.value || 'auto'
}

const getResolutionOptionsForModel = (id: ImageModelId): string[] =>
  id === 'seedream-5-0-pro' ? ['1K', '2K'] : ['1K', '2K', '4K']

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

const areStringArraysEqual = (left: string[], right: string[]) =>
  left.length === right.length && left.every((item, index) => item === right[index])

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
    sampleImage: 'Sample image',
    noDemoImageYet: 'No demo image yet',
    inputImage: 'Reference image',
    history: 'History',
    noHistory: 'No history yet. Generate an image to see it here.',
    recreate: 'Recreate',
    download: 'Download',
    downloading: 'Downloading...',
    copyPrompt: 'Copy prompt',
    promptCopied: 'Prompt copied to clipboard',
    promptCopyFailed: 'Failed to copy prompt',
    promptInserted: 'Prompt inserted. You can generate now.',
    generate: 'Generate',
    generating: 'Generating...',
    generatingSeconds: 'Generating... {seconds}s',
    generatedAlt: 'Generated',
    resultRetentionLogin: 'Log in',
    resultRetentionMessage: ' to keep your generation history permanently.',
    viewAll: 'view all',
    historyResultAlt: 'History result',
    inputAlt: 'Reference image',
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
    generateFailed: 'Failed to generate image',
    generationFailedWithMessage: 'Generation failed: {message}',
    noResult: 'No task ID or image URL received',
    networkError: 'Network error',
    networkFailed: 'Network connection failed. Please check your network connection and try again.',
    serviceUnstable: 'Generation service is temporarily unstable. Please try again in a moment.',
    imageGenerationFailed: 'Image generation failed',
    generationTimeout: 'Generation timeout',
    dailyLimitReached: 'Daily free limit reached. Please come back tomorrow!',
    recreateMissingInput: 'No input image found. Switched to Text to Image for recreate.',
    creditsUsedUpTitle: 'Credits Used Up',
    creditsUsedUpMessage: 'You need more credits to generate this image. Buy a one-time pack or earn free credits with daily rewards.',
    creditsUsedUpBuyAction: 'Buy credits',
    creditsUsedUpEarnAction: 'Earn free credits',
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
  const displayModelName = hideModelBranding ? 'AI image' : selectedModelName
  const modelConfig = MODEL_CONFIG[selectedModelId]
  const configuredMaxImages = typeof maxUploadImages === 'number' && Number.isFinite(maxUploadImages)
    ? Math.max(0, Math.min(Math.floor(maxUploadImages), modelConfig.maxImages))
    : undefined
  const MAX_IMAGES = configuredMaxImages ?? (isCouplePhotoMakerMode ? 2 : modelConfig.maxImages)
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
    getDefaultAspectRatioForModel(modelId, presetMode)
  )
  const [resolution, setResolution] = useState<string>(getDefaultResolutionForModel(modelId))
  const [outputFormat, setOutputFormat] = useState(isCouplePhotoMakerMode ? 'PNG' : 'Auto')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    const firstStyle = NANO_BANANA_2_COUPLE_TEMPLATES.find((item) => item.category === 'style')
    return firstStyle?.id ?? ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [rightMode, setRightMode] = useState<RightPanelMode>('sample')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentResult, setCurrentResult] = useState<HistoryItem | null>(null)
  const [remoteImageUrls, setRemoteImageUrls] = useState<string[]>(defaultImageUrls.slice(0, MAX_IMAGES))
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [promptDemoImage, setPromptDemoImage] = useState<PromptDemoImage | null>(null)
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string; type: string }>>([])
  const [creditExhaustedModalOpen, setCreditExhaustedModalOpen] = useState(false)
  const [generatingSeconds, setGeneratingSeconds] = useState(0)
  const [isUserSignedIn, setIsUserSignedIn] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null)
  const modelSelectorRef = useRef<HTMLDivElement>(null)
  const shouldPositionInsertedPromptRef = useRef(false)
  const localIdRef = useRef(0)
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const [activeModelGroupId, setActiveModelGroupId] = useState(() => getModelGroupId(modelId))
  const activeModelGroup = modelGroups.find((group) => group.id === activeModelGroupId) || modelGroups[0]
  const selectedModelGroup = modelGroups.find((group) => group.models.some((model) => model.id === selectedModelId)) || modelGroups[0]
  const generationCreditCost = calculateImageGenerationCredits(selectedModelId, resolution)
  const historyPageHref = getLocalizedInternalPath(pathname, '/history')
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
  ) => {
    const combined = templateReferenceImage
      ? [...userReferenceUrls, templateReferenceImage]
      : userReferenceUrls
    return Array.from(new Set(combined)).slice(0, modelConfig.maxImages)
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
    if (!nextPrompt) return false
    const imageUrl = normalizeReusableReferenceImageUrl(detail.imageUrl)
    const imageUrls = Array.isArray(detail.imageUrls)
      ? detail.imageUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
      : []
    const demoImageUrl = detail.demoImageUrl?.trim()

    shouldPositionInsertedPromptRef.current = true
    if (detail.aspectRatio) setAspectRatio(detail.aspectRatio)
    if (detail.resolution) setResolution(detail.resolution)
    if (detail.outputFormat) setOutputFormat(detail.outputFormat)
    if (detail.presetGroup) setActivePromptPresetTab(detail.presetGroup)
    if (detail.presetLabel) setSelectedPromptPreset(detail.presetLabel)
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

    const urls = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : []
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

    showToast(toolText.promptInserted, 'success')
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

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = createLocalId('toast')
    const cleanMsg = msg.replace(/✅|❌|⚠️|❗/g, '').trim()

    setToasts(prev => [...prev, { id, msg: cleanMsg, type }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

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
  ])

  useEffect(() => {
    if (!creditExhaustedModalOpen) return

    trackToolazeEvent('credit_paywall_view', getGenerationAnalyticsPayload({
      paywall_type: 'credit_exhausted',
    }))
  }, [creditExhaustedModalOpen, getGenerationAnalyticsPayload])

  const handleCreditPaywallCtaClick = (
    cta: 'buy_credits' | 'earn_free_credits',
    destination: string,
  ) => {
    trackToolazeEvent('credit_paywall_cta_click', getGenerationAnalyticsPayload({
      paywall_type: 'credit_exhausted',
      cta,
      destination,
    }))
    setCreditExhaustedModalOpen(false)
  }

  const handleGenerate = async () => {
    const hasReferenceImages = imageFiles.length > 0 || remoteImageUrls.length > 0
    if (activeTab === 'image-to-image' && !hasReferenceImages) return
    if (!prompt?.trim()) return
    trackToolazeEvent('image_generate_click', getGenerationAnalyticsPayload())
    const authState = await ensureSignedInForGeneration(generationCreditCost)
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
    setIsGenerating(true)
    setRightMode('generating')
    let rollbackOptimisticCredits = startOptimisticCreditDeduction(generationCreditCost)

    try {
      const effectivePrompt = composePromptParts(
        prompt.trim(),
        selectedPromptModifierOption?.prompt,
        isCouplePhotoMakerMode ? COUPLE_IDENTITY_LOCK_INSTRUCTION : undefined,
      )
      const formData = new FormData()
      formData.append('prompt', effectivePrompt)
      formData.append('aspectRatio', aspectRatio)
      formData.append('resolution', selectedModelId === 'wan-2-7-image' && activeTab === 'image-to-image' && resolution === '4K' ? '2K' : resolution)
      if (selectedModelId === 'seedream-4-5' || selectedModelId === 'seedream-5-0-lite' || selectedModelId === 'seedream-5-0-pro') {
        formData.append('quality', selectedModelId === 'seedream-5-0-pro'
          ? (resolution === '2K' ? 'High' : 'Basic')
          : (resolution === '4K' ? 'High' : 'Basic'))
      }
      if (modelConfig.supportsOutputFormat) {
        formData.append('outputFormat', outputFormat)
      }
      formData.append('isImageToImage', String(activeTab === 'image-to-image'))
      formData.append('model', selectedModelId)

      const uploadUrl = getImageUploadUrl()

      let generationInputUrls = [...remoteImageUrls]
      if (activeTab === 'image-to-image' && imageFiles.length > 0) {
        // 批量上传所有图片
        const imageUrls: string[] = []
        for (const imageItem of imageFiles) {
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
        selectedPromptPresetReferenceImage,
      )
      if (activeTab === 'image-to-image' && generationInputUrls.length > 0) {
        generationInputUrls = await uploadRemoteReferenceUrlsForGeneration(
          generationInputUrls,
          uploadUrl,
          toolText.uploadFailed,
        )
        formData.append('imageUrls', JSON.stringify(generationInputUrls))
      }

      const generateResponse = await requestImageGenerationTask(formData, toolText)

      const parseJsonSafely = async (res: Response): Promise<Record<string, any>> => {
        const text = await res.text()
        if (!text) return {}
        try {
          return JSON.parse(text) as Record<string, any>
        } catch {
          throw new Error(toolText.serverNonJson)
        }
      }

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
          setIsGenerating(false)
          setRightMode(currentResult ? 'result' : 'sample')
          return
        }
        if (generateResponse.status === 401) {
          const cachedAuthState = getCachedGenerationAuthState(generationCreditCost)
          if (cachedAuthState.creditsExhausted) {
            rollbackOptimisticCredits?.()
            rollbackOptimisticCredits = null
            setCreditExhaustedModalOpen(true)
            setIsGenerating(false)
            setRightMode(currentResult ? 'result' : 'sample')
            return
          }

          rollbackOptimisticCredits?.()
          rollbackOptimisticCredits = null
          showToast('Please sign in with Google to generate images.', 'warning')
          window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
          setIsGenerating(false)
          setRightMode(currentResult ? 'result' : 'sample')
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

      const persistHistoryItem = async (outputUrl: string, mediaType: 'image' | 'video' = 'image') => {
        const historyTool = getHistoryToolMetadata(pathname, selectedModelName, selectedModelId)

        try {
          const response = await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mediaType,
              model: selectedModelId,
              prompt: effectivePrompt,
              outputUrl,
              inputUrls: generationInputUrls,
              aspectRatio,
              resolution,
              outputFormat,
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

      if (!taskId) {
        // 如果直接返回了图片 URL（同步）
        if (generateResult.imageUrl) {
          const savedItem = await persistHistoryItem(generateResult.imageUrl)
          const item: HistoryItem = {
            id: savedItem?.id || createLocalId('sync'),
            inputPreview: imageFiles.length > 0 ? imageFiles[0].preview : generationInputUrls[0] || '',
            inputUrls: generationInputUrls,
            outputPreview: generateResult.imageUrl,
            prompt: effectivePrompt,
            time: formatLocalTimestampToSeconds(savedItem?.createdAt || new Date().toISOString()),
            modelId: selectedModelId,
            aspectRatio,
            resolution,
            outputFormat,
          }
          // 使用函数式更新，确保基于最新状态
          setHistory((prev) => {
            // 确保不会重复添加相同的项
            const exists = prev.find(h => h.id === item.id)
            if (exists) {
              console.warn('History item already exists:', item.id)
              return prev
            }
            const newHistory = [item, ...prev]
            console.log('Adding to history (sync):', item.id, 'Previous count:', prev.length, 'New count:', newHistory.length)
            return newHistory
          })
          setCurrentResult(item)
          setRightMode(isCouplePhotoMakerMode ? 'history' : 'result')
          setIsGenerating(false)
          return
        }
        throw new Error(toolText.noResult)
      }

      // 轮询任务状态
      let attempts = 0
      const maxAttempts = 60 // 最多轮询 60 次（约 5 分钟）
      const pollInterval = 5000 // 每 5 秒轮询一次

      const pollStatus = async (): Promise<string> => {
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

        if (statusResult.status === 'SUCCEEDED' && statusResult.imageUrl) {
          return statusResult.imageUrl
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

      const outputUrl = await pollStatus()

      if (outputUrl) {
        // 尝试把生成图存到自己的 R2，便于直接下载（避免跨域新开标签）
        let finalUrl = outputUrl
        try {
          const saveRes = await fetch('/api/save-image-to-r2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: outputUrl }),
          })
          if (saveRes.ok) {
            const data = await parseJsonSafely(saveRes)
            if ((data as { url?: string }).url) {
              finalUrl = (data as { url: string }).url
            }
          }
        } catch (_) {
          // 存 R2 失败则继续用原始 URL
        }

        const savedItem = await persistHistoryItem(finalUrl)
        const item: HistoryItem = {
          id: savedItem?.id || createLocalId('async'),
          inputPreview: imageFiles.length > 0 ? imageFiles[0].preview : generationInputUrls[0] || '',
          inputUrls: generationInputUrls,
          outputPreview: finalUrl,
          prompt: effectivePrompt,
          time: formatLocalTimestampToSeconds(savedItem?.createdAt || new Date().toISOString()),
          modelId: selectedModelId,
          aspectRatio,
          resolution,
          outputFormat,
        }
        // 使用函数式更新，确保基于最新状态
        setHistory((prev) => {
          // 确保不会重复添加相同的项
          const exists = prev.find(h => h.id === item.id)
          if (exists) {
            console.warn('History item already exists:', item.id)
            return prev
          }
          const newHistory = [item, ...prev]
          console.log('Adding to history (async):', item.id, 'Previous count:', prev.length, 'New count:', newHistory.length)
          return newHistory
        })
        setCurrentResult(item)
        setRightMode(isCouplePhotoMakerMode ? 'history' : 'result')
      }
    } catch (error: any) {
      rollbackOptimisticCredits?.()
      rollbackOptimisticCredits = null
      console.warn('Generation warning:', error)
      if (isCreditExhaustedGenerationError(0, { error: error?.message })) {
        setCreditExhaustedModalOpen(true)
        setRightMode(currentResult ? 'result' : 'sample')
        return
      }
      alert(formatToolText(toolText.generationFailedWithMessage, { message: error.message }))
      setRightMode('sample')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClear = () => {
    clearAllImages()
    setPrompt('')
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

  const handleDownload = async (imageUrl: string, filename: string) => {
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
    if (!(await deletePersistedHistoryItem(item.id))) return
    removeHistoryItemFromState(item.id)
  }

  const handleDeleteCurrentResult = async () => {
    if (!currentResult) return
    await handleDeleteHistoryItem(currentResult)
  }

  const handleRecreateFromCurrent = () => {
    if (!currentResult) return
    const nextPrompt = currentResult.prompt?.trim() || ''
    if (!nextPrompt) return

    setPrompt(nextPrompt)
    if (activeTab === 'image-to-image' && imageFiles.length === 0) {
      setActiveTab('text-to-image')
      showToast(toolText.recreateMissingInput, 'info')
    }

    setTimeout(() => {
      handleGenerate()
    }, 0)
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
      }
    }

    const image = getModelDemoImage(selectedModelId)
    return {
      url: image.src,
      caption: image.alt || `${displayModelName} sample output`,
      width: image.width,
      height: image.height,
    }
  }, [displayModelName, sampleImages, selectedModelId])
  const isSharpSampleImage = sampleImageVariant === 'sharp'
  const displayedSampleImageUrl = promptDemoImage?.url || sampleImage.url
  const displayedSampleImageTitle = promptDemoImage?.title || sampleImage.caption
  const displayedSampleImageWidth = promptDemoImage?.width || sampleImage.width
  const displayedSampleImageHeight = promptDemoImage?.height || sampleImage.height

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

  const renderMobileTopPanel = () => (
    <div className="space-y-4 md:hidden">
      {(heroBreadcrumbItems?.length || heroEyebrow || heroTitle || heroDescription) && (
        <div className="text-center">
          {heroBreadcrumbItems?.length ? (
            <div className="mx-auto mb-1 max-w-4xl">
              <Breadcrumb items={heroBreadcrumbItems} variant="inline" />
            </div>
          ) : null}
          {heroEyebrow && (
            <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
              {heroEyebrow}
            </div>
          )}
          {heroTitle && (
            <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-950">
              {heroTitle}
            </h1>
          )}
          {heroDescription && (
            <p className="mx-auto mt-3 max-w-4xl text-base leading-7 text-slate-600">
              {heroDescription}
            </p>
          )}
        </div>
      )}
      <div data-mobile-demo-panel className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#E0E7FF] bg-white p-2 shadow-lg shadow-[#4F46E5]/8">
        {renderDemoPreview()}
      </div>
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

  const renderMobileGenerationPanel = () => {
    if (!isGenerating && !currentResult && !isUserSignedIn) return null

    const recentHistory = history.slice(0, 4)
    const currentResultRecreateDisabled =
      !currentResult ||
      isGenerating ||
      !(currentResult.prompt && currentResult.prompt.trim()) ||
      (activeTab === 'image-to-image' && imageFiles.length === 0 && !currentResult.inputPreview)

    return (
      <div data-mobile-generation-panel className="mt-3 md:hidden">
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
            <img
              src={currentResult.outputPreview}
              alt={toolText.generatedAlt}
              onClick={() => setPreviewImage(currentResult.outputPreview)}
              className="aspect-[4/3] w-full rounded-xl object-contain cursor-pointer bg-slate-50"
            />
            <div data-mobile-result-actions className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleRecreateFromCurrent}
                disabled={currentResultRecreateDisabled}
                className="min-w-0 truncate rounded-xl bg-[#4F46E5] px-2.5 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:bg-[#C7D2FE] disabled:shadow-none"
              >
                {toolText.recreate}
              </button>
              <button
                type="button"
                onClick={() => handleDownload(currentResult.outputPreview, `generated-${currentResult.id}.png`)}
                disabled={downloadingUrl === currentResult.outputPreview}
                className="min-w-0 truncate rounded-xl border border-[#C7D2FE] px-2.5 py-2.5 text-xs font-extrabold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-60"
                title={downloadingUrl === currentResult.outputPreview ? toolText.downloading : toolText.download}
              >
                {downloadingUrl === currentResult.outputPreview ? toolText.downloading : toolText.download}
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteCurrentResult()}
                className="min-w-0 truncate rounded-xl border border-[#C7D2FE] px-2.5 py-2.5 text-xs font-extrabold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
                title={toolText.delete}
              >
                {toolText.delete}
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
                    setRightMode('result')
                  }}
                  className="overflow-hidden rounded-xl border border-[#E0E7FF] bg-white p-1 text-left"
                >
                  <img
                    src={getDisplayImagePreviewUrl(item.outputPreview, 384)}
                    alt={toolText.historyResultAlt}
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                    loading="lazy"
                    decoding="async"
                  />
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

  const rightPanelShadowClass = plainRightPanel ? 'shadow-none' : 'shadow-lg shadow-[#4F46E5]/8'

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-visible p-2 md:px-6 md:pb-6 md:pt-3 xl:pl-0 xl:pr-8 2xl:pl-0 2xl:pr-12">
      <div className={`flex min-h-0 min-w-0 flex-col gap-4 ${fitParentHeight ? 'md:h-full md:min-h-0' : 'md:h-[calc(100dvh-10rem)] md:min-h-[640px] xl:h-[calc(100dvh-7rem)] xl:min-h-[720px]'} md:flex-row md:items-stretch md:gap-6 xl:gap-8 2xl:gap-10`}>
        {renderMobileTopPanel()}
        {/* Left: 生图参数区 — 桌面可滚动+固定按钮；h5 上下流式布局，自然高度 */}
        <div className="w-full md:h-full md:w-[380px] xl:w-[400px] 2xl:w-[420px] flex-shrink-0 flex flex-col rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8 overflow-visible">
          <div className={`p-2 md:p-6 space-y-4 md:space-y-5 md:flex-1 md:min-h-0 md:overscroll-contain ${isModelMenuOpen ? 'md:overflow-visible' : 'md:overflow-y-auto'}`}>
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
                  {remoteImageUrls.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-[#E0E7FF] bg-slate-100 cursor-pointer"
                      onClick={() => setPreviewImage(url)}
                    >
                      <img
                        src={getReferencePreviewUrl(url)}
                        alt={`${toolText.inputAlt} ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
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
                  ))}

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
            {!isCouplePhotoMakerMode && (
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
                    <textarea
                      ref={promptTextareaRef}
                      value={prompt}
                      onChange={(e) => {
                        setPrompt(e.target.value)
                        if (activePromptPresetTab === customPromptTabId) {
                          setCustomPromptDraft(e.target.value)
                        }
                      }}
                      placeholder={sceneText?.promptPlaceholder || toolText.promptPlaceholder}
                      className="h-[10.5rem] w-full resize-none overflow-y-auto rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm leading-6 text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40"
                      rows={6}
                    />
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
          <div className="flex-shrink-0 rounded-b-2xl p-2 pt-4 md:p-6 md:pt-4 bg-white">
            <div className="flex gap-3">
              <button
                type="button"
                data-generate-button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && imageFiles.length === 0 && remoteImageUrls.length === 0)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center disabled:cursor-not-allowed transition-all duration-200 text-white shadow-md hover:shadow-lg disabled:shadow-none"
                style={{
                  background: isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && imageFiles.length === 0 && remoteImageUrls.length === 0)
                    ? 'linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)'
                    : 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                }}
              >
                {isGenerating ? (
                  formatToolText(toolText.generatingSeconds, { seconds: generatingSeconds })
                ) : (
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
                )}
              </button>
            </div>
            {renderMobileGenerationPanel()}
            {sceneText?.safetyHelper && (
              <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                {sceneText.safetyHelper}
              </p>
            )}
          </div>
        </div>

        <div className="hidden min-h-0 min-w-0 flex-1 flex-col gap-4 md:flex md:h-full">
          {(heroBreadcrumbItems?.length || heroEyebrow || heroTitle || heroDescription) && (
            <div className="shrink-0 text-center md:px-4 md:pt-1 xl:pt-0">
              {heroBreadcrumbItems?.length ? (
                <div className="mx-auto mb-1 max-w-4xl">
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
        {/* Middle: Generated Image (shown when result exists) or Generating Animation */}
        {isGenerating ? (
          <div className={`flex-1 min-w-0 bg-white rounded-2xl border border-[#E0E7FF] ${rightPanelShadowClass} flex items-center justify-center p-2 md:p-8 xl:mx-auto xl:w-full xl:max-w-[1280px] 2xl:max-w-[1440px]`}>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
              <p className="text-slate-500 font-medium text-sm">{formatToolText(toolText.generatingSeconds, { seconds: generatingSeconds })}</p>
            </div>
          </div>
        ) : currentResult && (rightMode === 'result' || isCouplePhotoMakerMode) ? (
          <div className={`flex-1 min-w-0 min-h-[400px] md:min-h-0 bg-white rounded-2xl border border-[#E0E7FF] ${rightPanelShadowClass} flex flex-col items-center justify-center p-2 md:p-8 xl:mx-auto xl:w-full xl:max-w-[1280px] 2xl:max-w-[1440px] relative z-10`}>
            <img
              src={currentResult.outputPreview}
              alt={toolText.generatedAlt}
              onClick={() => setPreviewImage(currentResult.outputPreview)}
              className="max-w-full max-h-[60vh] md:max-h-full object-contain rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            />
            {!compactResultPanel && renderResultRetentionPrompt()}
            {compactResultPanel && currentResult && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-lg bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold text-[#4F46E5]">
                  {formatTagValue(currentResult.aspectRatio || aspectRatio)}
                </span>
                <span className="rounded-lg bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold text-[#4F46E5]">
                  {currentResult.time}
                </span>
                <button
                  type="button"
                  onClick={() => handleDownload(currentResult.outputPreview, `generated-${currentResult.id}.png`)}
                  disabled={downloadingUrl === currentResult.outputPreview}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C7D2FE] text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-50"
                  title={downloadingUrl === currentResult.outputPreview ? toolText.downloading : toolText.download}
                >
                  {downloadingUrl === currentResult.outputPreview ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="16" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteCurrentResult()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C7D2FE] text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
                  title={toolText.delete}
                >
                  <DeleteIcon size={18} />
                </button>
              </div>
            )}
            {isCouplePhotoMakerMode && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => handleDownload(currentResult.outputPreview, `generated-${currentResult.id}.png`)}
                  disabled={downloadingUrl === currentResult.outputPreview}
                  className="px-6 py-2.5 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {downloadingUrl === currentResult.outputPreview ? toolText.downloading : toolText.download}
                </button>
              </div>
            )}
          </div>
        ) : isCouplePhotoMakerMode ? (
          <div className={`flex-1 min-w-0 min-h-[400px] md:min-h-0 bg-white rounded-2xl border border-[#E0E7FF] ${rightPanelShadowClass} flex flex-col items-center justify-center p-2 md:p-8 xl:mx-auto xl:w-full xl:max-w-[1280px] 2xl:max-w-[1440px] relative z-10`}>
            <div className="w-full flex-1 flex justify-center items-center min-h-0">
              {selectedTemplateImage ? (
                <img
                  src={`${selectedTemplateImage}?v=20260508`}
                  alt={selectedTemplate?.title || toolText.sampleImage}
                  className="max-w-full max-h-[60vh] md:max-h-full object-contain rounded-xl ring-1 ring-slate-200/50"
                />
              ) : (
                <div className="w-full min-h-[200px] rounded-xl ring-1 ring-slate-200/50 bg-white flex items-center justify-center text-sm text-slate-500">
                  {toolText.noDemoImageYet}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Right: 功能示例图 / 生成中 / 历史记录 / 结果详情 */}
        {!isGenerating &&
          !isCouplePhotoMakerMode &&
          !(compactResultPanel && rightMode === 'result' && currentResult) && (
          <div className={`${rightMode === 'result' ? 'w-full md:w-[400px]' : 'flex-1 xl:mx-auto xl:w-full xl:max-w-[1280px] 2xl:max-w-[1440px]'} min-h-0 min-w-0 bg-white ${isCouplePhotoMakerMode ? 'rounded-none' : 'rounded-2xl'} border border-[#E0E7FF] ${rightPanelShadowClass} flex flex-col relative overflow-hidden`}>
          {/* Tabs for right panel when history exists */}
          {(history.length > 0 || isGenerating) && !isGenerating && rightMode !== 'result' && !isCouplePhotoMakerMode && (
            <div className="flex border-b border-[#E0E7FF] px-5 pt-4 gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setRightMode('sample')}
                className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-colors ${
                  rightMode === 'sample' ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] border-b-0 -mb-px' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Demo
              </button>
              <button
                type="button"
                onClick={() => setRightMode('history')}
                className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-colors ${
                  rightMode === 'history' ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] border-b-0 -mb-px' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                History
              </button>
            </div>
          )}

          <div className={`flex min-h-0 flex-1 p-2 md:p-8 ${rightMode === 'result' || rightMode === 'history' ? 'flex-col justify-start overflow-auto' : 'flex-col items-center justify-center overflow-hidden'}`}>
            {rightMode === 'sample' && (
              <>
                <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
                  {isCouplePhotoMakerMode ? (
                    selectedTemplateImage ? (
                      <img
                        src={`${selectedTemplateImage}?v=20260508`}
                        alt={selectedTemplate?.title || toolText.sampleImage}
                        className="w-full h-full rounded-xl object-contain ring-1 ring-slate-200/50"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl ring-1 ring-slate-200/50 bg-white flex items-center justify-center text-sm text-slate-500">
                        {toolText.noDemoImageYet}
                      </div>
                    )
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center overflow-hidden ring-1 ring-slate-200/50 ${
                        isSharpSampleImage ? 'rounded-md bg-slate-50 p-0 shadow-none' : 'rounded-2xl p-2 shadow-inner'
                      }`}
                    >
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
                          maxHeight: '100%'
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {rightMode === 'generating' && !isGenerating && (
              <div className="flex flex-col items-center justify-center gap-8">
                <div className="w-16 h-16 rounded-full border-4 border-[#EEF2FF] border-t-[#4F46E5] animate-spin" />
                <p className="text-slate-500 font-medium text-sm tracking-wider">{`Generating... ${generatingSeconds}s`}</p>
              </div>
            )}

            {rightMode === 'result' && currentResult && !isCouplePhotoMakerMode && (
              <div className="w-full space-y-6">
                {/* Output Prompt */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{toolText.prompt}</label>
                  <div className="relative">
                    <textarea
                      value={currentResult.prompt}
                      readOnly
                      className="w-full min-h-[100px] px-4 py-3 pr-10 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-sm resize-none"
                      rows={4}
                    />
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const btn = e.currentTarget as HTMLButtonElement
                        if (!btn) return

                        try {
                          await navigator.clipboard.writeText(currentResult.prompt)
                          showToast(toolText.promptCopied, 'success')
                        } catch (err) {
                          console.error('Failed to copy:', err)
                          // 降级方案：使用传统方法
                          const textArea = document.createElement('textarea')
                          textArea.value = currentResult.prompt
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
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer z-10"
                      title={toolText.copyPrompt}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Reference Thumbnail */}
                {currentResult.inputPreview && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500">{toolText.inputImage}</p>
                    <img
                      src={getDisplayImagePreviewUrl(currentResult.inputPreview, 96)}
                      alt={toolText.inputAlt}
                      onClick={() => setPreviewImage(currentResult.inputPreview!)}
                      className="h-12 w-12 rounded-lg object-cover ring-2 ring-[#C7D2FE] cursor-pointer hover:opacity-80 transition-opacity"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                {/* Metadata Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{formatTagValue(aspectRatio)}</span>
                  {!hideModelBranding && (
                    <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{selectedModelName}</span>
                  )}
                  <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{currentResult.time}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleRecreateFromCurrent}
                    disabled={
                      isGenerating ||
                      !(currentResult.prompt && currentResult.prompt.trim()) ||
                      (activeTab === 'image-to-image' && imageFiles.length === 0 && !currentResult.inputPreview)
                    }
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-center disabled:cursor-not-allowed transition-all duration-200 text-white shadow-md hover:shadow-lg disabled:shadow-none"
                    style={{
                      background:
                        isGenerating ||
                        !(currentResult.prompt && currentResult.prompt.trim()) ||
                        (activeTab === 'image-to-image' && imageFiles.length === 0 && !currentResult.inputPreview)
                        ? 'linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)'
                        : 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                    }}
                  >
                    {toolText.recreate}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(currentResult.outputPreview, `generated-${currentResult.id}.png`)}
                    disabled={downloadingUrl === currentResult.outputPreview}
                    className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title={downloadingUrl === currentResult.outputPreview ? toolText.downloading : toolText.download}
                  >
                    {downloadingUrl === currentResult.outputPreview ? (
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
                    onClick={() => void handleDeleteCurrentResult()}
                    className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors"
                    title={toolText.delete}
                  >
                    <DeleteIcon size={20} />
                  </button>
                </div>
              </div>
            )}

            {rightMode === 'history' && isCouplePhotoMakerMode && (
              <div className="w-full max-w-[300px] mx-auto space-y-4">
                <h3 className="text-slate-700 font-semibold text-base tracking-wider">{toolText.history}</h3>
                {history.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCurrentResult(item)
                          setRightMode('history')
                        }}
                        className={`relative rounded-xl overflow-hidden border transition-colors ${
                          currentResult?.id === item.id
                            ? 'border-[#6D28D9] ring-2 ring-[#DDD6FE]'
                            : 'border-[#E0E7FF] hover:border-[#C7D2FE]'
                        }`}
                      >
                        <img
                          src={getDisplayImagePreviewUrl(item.outputPreview, 384)}
                          alt={toolText.historyResultAlt}
                          className="w-full aspect-[4/3] object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">{toolText.noHistory}</p>
                )}
              </div>
            )}

            {rightMode === 'history' && !isCouplePhotoMakerMode && (
              <div className="w-full space-y-6">
                <h3 className="text-slate-700 font-semibold text-base tracking-wider mb-6">{toolText.history}</h3>
                {/* Generating Status at Top */}
                {isGenerating && (
                  <div className="p-5 rounded-2xl border border-[#E0E7FF] bg-white shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.6s' }} />
                      </div>
                      <p className="text-slate-500 font-medium text-sm">{formatToolText(toolText.generatingSeconds, { seconds: generatingSeconds })}</p>
                    </div>
                  </div>
                )}
                {/* History Items */}
                {history.length > 0 && history.map((item) => (
                  <div key={item.id} className="space-y-4 p-5 rounded-2xl border border-[#E0E7FF] bg-white shadow-sm">
                    {/* Prompt */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">{toolText.prompt}</label>
                      <div className="relative">
                        <textarea
                          value={item.prompt}
                          readOnly
                          className="w-full min-h-[80px] px-4 py-3 pr-10 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-sm resize-none"
                          rows={3}
                        />
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const btn = e.currentTarget as HTMLButtonElement
                            if (!btn) return

                            try {
                              await navigator.clipboard.writeText(item.prompt)
                              showToast(toolText.promptCopied, 'success')
                            } catch (err) {
                              console.error('Failed to copy:', err)
                              // 降级方案：使用传统方法
                              const textArea = document.createElement('textarea')
                              textArea.value = item.prompt
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
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer z-10"
                          title={toolText.copyPrompt}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Input Thumbnail & Metadata */}
                    <div className="flex items-center gap-3">
                      {item.inputPreview ? (
                        <img
                          src={getDisplayImagePreviewUrl(item.inputPreview, 96)}
                          alt={toolText.inputAlt}
                          onClick={() => setPreviewImage(item.inputPreview!)}
                          className="h-12 w-12 rounded-lg object-cover ring-2 ring-[#C7D2FE] cursor-pointer hover:opacity-80 transition-opacity"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-xs text-[#4F46E5]">{toolText.textToImage}</div>
                      )}
                      <div className="flex flex-wrap gap-2 flex-1">
                        <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{formatTagValue(item.aspectRatio)}</span>
                        {!hideModelBranding && (
                          <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{selectedModelName}</span>
                        )}
                        <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{item.time}</span>
                      </div>
                    </div>

                    {/* Generated Image */}
                    <div className="w-full">
                      <img
                        src={getDisplayImagePreviewUrl(item.outputPreview, 640)}
                        alt={toolText.generatedAlt}
                        onClick={() => setPreviewImage(item.outputPreview)}
                        className="w-full rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity border border-[#E0E7FF]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt(item.prompt)
                          setAspectRatio(item.aspectRatio || 'auto')
                          setResolution(item.resolution || '1K')
                          setOutputFormat(item.outputFormat || 'Auto')
                          if (item.inputPreview) {
                            // 如果有输入图片，切换到 image-to-image 模式
                            setActiveTab('image-to-image')
                            // 注意：这里无法直接恢复 imageFiles，因为它们是 File 对象
                            // 但可以显示预览（仅显示第一张）
                          }
                          setCurrentResult(item)
                          setRightMode('result')
                        }}
                        className="flex-1 py-3 rounded-xl font-bold text-sm text-center transition-all duration-200 text-white shadow-md hover:shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                        }}
                      >
                        {toolText.recreate}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(item.outputPreview, `generated-${item.id}.png`)}
                        disabled={downloadingUrl === item.outputPreview}
                        className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                        className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors"
                        title={toolText.delete}
                      >
                        <DeleteIcon size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rightMode === 'history' && history.length === 0 && !isGenerating && (
              <p className="text-slate-500 text-sm">{toolText.noHistory}</p>
            )}

            {rightMode === 'history' && history.length === 0 && isGenerating && (
              <div className="w-full max-w-3xl">
                <div className="p-5 rounded-2xl border border-[#E0E7FF] bg-white shadow-sm">
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                    <p className="text-slate-500 font-medium text-sm">{formatToolText(toolText.generatingSeconds, { seconds: generatingSeconds })}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
          </div>
        </div>
      </div>

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
                  onClick={() => handleCreditPaywallCtaClick('buy_credits', '/pricing')}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(99,102,241,0.34)]"
                >
                  {toolText.creditsUsedUpBuyAction || 'Buy credits'}
                </Link>
                <Link
                  href="/earn-credits"
                  onClick={() => handleCreditPaywallCtaClick('earn_free_credits', '/earn-credits')}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm font-extrabold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-indigo-50"
                >
                  {toolText.creditsUsedUpEarnAction || 'Earn free credits'}
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
