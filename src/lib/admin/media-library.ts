import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { AdminGenerationRecordItem } from './users'

export const MEDIA_LIBRARY_SCHEMA_VERSION = 1
export const DEFAULT_MEDIA_LIBRARY_PATH = path.join(
  process.cwd(),
  '_codex',
  'media-library',
  'assets.json',
)

export type MediaAssetType = 'image' | 'video'
export type MediaAssetSource = 'history' | 'upload' | 'generated'
export type MediaAssetSourceRole =
  | 'history_output'
  | 'history_input'
  | 'manual_upload'
  | 'generated_output'
export type MediaAssetReviewStatus = 'candidate' | 'needs_review' | 'approved' | 'rejected'

export type MediaAsset = {
  id: string
  type: MediaAssetType
  url: string
  posterUrl?: string
  title?: string
  width?: number
  height?: number
  durationSeconds?: number
  source: MediaAssetSource
  sourceRole?: MediaAssetSourceRole
  sourceHistoryId?: string
  sourceToolSlug?: string | null
  sourceToolLabel?: string | null
  sourcePath?: string | null
  sourceModel?: string | null
  sourcePrompt?: string | null
  sourceUserEmail?: string | null
  sourceCreatedAt?: string | null
  aiTags: string[]
  manualTags: string[]
  safetyTags: string[]
  confidence: Record<string, number>
  analysisSummary?: string
  reviewStatus: MediaAssetReviewStatus
  usageCount: number
  notes?: string
  createdAt: string
  updatedAt: string
  lastTaggedAt?: string
}

export type MediaLibraryData = {
  version: typeof MEDIA_LIBRARY_SCHEMA_VERSION
  assets: MediaAsset[]
}

export type MediaAssetFilters = {
  query?: string
  type?: MediaAssetType | 'all'
  source?: MediaAssetSource | 'all'
  reviewStatus?: MediaAssetReviewStatus | 'all'
  tags?: string[]
}

export type MediaAssetStats = {
  total: number
  images: number
  videos: number
  approved: number
  needsReview: number
  candidates: number
  rejected: number
  history: number
  upload: number
  generated: number
}

type CreateManualMediaAssetInput = {
  url: string
  type?: MediaAssetType
  posterUrl?: string
  title?: string
  width?: number
  height?: number
  durationSeconds?: number
  source?: MediaAssetSource
  sourceRole?: MediaAssetSourceRole
  sourceHistoryId?: string
  manualTags?: string[]
  aiTags?: string[]
  safetyTags?: string[]
  confidence?: Record<string, number>
  reviewStatus?: MediaAssetReviewStatus
  notes?: string
  createdAt?: string
}

type ImportMediaAssetsFromHistoryOptions = {
  existingAssets: MediaAsset[]
  now?: string
  includeInputs?: boolean
  includeOutputs?: boolean
}

export type ImportMediaAssetsFromHistoryResult = {
  assets: MediaAsset[]
  importedCount: number
  skippedCount: number
}

export type VisionTaggingResult = {
  asset: MediaAsset
  ok: boolean
  message: string
}

type VisionTaggingOptions = {
  apiKey?: string
  model?: string
  now?: string
  fetchImpl?: typeof fetch
}

type OpenAITextContent = {
  type?: string
  text?: string
}

type OpenAIOutputItem = {
  content?: OpenAITextContent[]
}

type OpenAIResponsesPayload = {
  output_text?: string
  output?: OpenAIOutputItem[]
}

const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'webm', 'mkv'])
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'])

export function createManualMediaAsset(input: CreateManualMediaAssetInput): MediaAsset {
  const now = input.createdAt || new Date().toISOString()
  const url = normalizeMediaUrl(input.url)
  const type = input.type || inferMediaAssetType(url)
  const source = input.source || 'upload'

  return {
    id: createAssetId(url),
    type,
    url,
    ...(input.posterUrl ? { posterUrl: normalizeMediaUrl(input.posterUrl) } : {}),
    ...(input.title ? { title: input.title.trim() } : {}),
    ...(readPositiveNumber(input.width) ? { width: Number(input.width) } : {}),
    ...(readPositiveNumber(input.height) ? { height: Number(input.height) } : {}),
    ...(readPositiveNumber(input.durationSeconds) ? { durationSeconds: Number(input.durationSeconds) } : {}),
    source,
    sourceRole: input.sourceRole || (source === 'upload' ? 'manual_upload' : undefined),
    ...(input.sourceHistoryId ? { sourceHistoryId: input.sourceHistoryId } : {}),
    aiTags: normalizeTagList(input.aiTags),
    manualTags: normalizeTagList(input.manualTags),
    safetyTags: normalizeTagList(input.safetyTags),
    confidence: normalizeConfidence(input.confidence),
    reviewStatus: input.reviewStatus || 'candidate',
    usageCount: 0,
    ...(input.notes ? { notes: input.notes.trim() } : {}),
    createdAt: now,
    updatedAt: now,
  }
}

export function importMediaAssetsFromHistory(
  records: AdminGenerationRecordItem[],
  options: ImportMediaAssetsFromHistoryOptions,
): ImportMediaAssetsFromHistoryResult {
  const now = options.now || new Date().toISOString()
  const includeInputs = options.includeInputs !== false
  const includeOutputs = options.includeOutputs !== false
  const assets = [...options.existingAssets]
  const knownUrls = new Set(assets.map((asset) => normalizeMediaUrl(asset.url)))
  let importedCount = 0
  let skippedCount = 0

  for (const record of records) {
    const candidates: Array<{ url: string; sourceRole: MediaAssetSourceRole }> = []
    if (includeOutputs) candidates.push({ url: record.outputUrl, sourceRole: 'history_output' })
    if (includeInputs) {
      for (const url of record.inputUrls || []) {
        candidates.push({ url, sourceRole: 'history_input' })
      }
    }

    for (const candidate of candidates) {
      const url = normalizeMediaUrl(candidate.url)
      if (!isUsableMediaUrl(url)) continue
      if (knownUrls.has(url)) {
        skippedCount += 1
        continue
      }

      const asset = createHistoryMediaAsset(record, candidate.sourceRole, url, now)
      assets.push(asset)
      knownUrls.add(url)
      importedCount += 1
    }
  }

  return { assets, importedCount, skippedCount }
}

export function filterMediaAssets(assets: MediaAsset[], filters: MediaAssetFilters): MediaAsset[] {
  const query = filters.query?.trim().toLowerCase()
  const requiredTags = normalizeTagList(filters.tags)

  return assets.filter((asset) => {
    if (filters.type && filters.type !== 'all' && asset.type !== filters.type) return false
    if (filters.source && filters.source !== 'all' && asset.source !== filters.source) return false
    if (
      filters.reviewStatus
      && filters.reviewStatus !== 'all'
      && asset.reviewStatus !== filters.reviewStatus
    ) {
      return false
    }

    if (requiredTags.length > 0) {
      const assetTags = new Set(getCombinedAssetTags(asset))
      if (!requiredTags.every((tag) => assetTags.has(tag))) return false
    }

    if (!query) return true
    const searchable = [
      asset.id,
      asset.url,
      asset.title,
      asset.sourceToolSlug,
      asset.sourceToolLabel,
      asset.sourcePath,
      asset.sourceModel,
      asset.sourcePrompt,
      asset.notes,
      ...getCombinedAssetTags(asset),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchable.includes(query)
  })
}

export function buildMediaAssetStats(assets: MediaAsset[]): MediaAssetStats {
  return {
    total: assets.length,
    images: assets.filter((asset) => asset.type === 'image').length,
    videos: assets.filter((asset) => asset.type === 'video').length,
    approved: assets.filter((asset) => asset.reviewStatus === 'approved').length,
    needsReview: assets.filter((asset) => asset.reviewStatus === 'needs_review').length,
    candidates: assets.filter((asset) => asset.reviewStatus === 'candidate').length,
    rejected: assets.filter((asset) => asset.reviewStatus === 'rejected').length,
    history: assets.filter((asset) => asset.source === 'history').length,
    upload: assets.filter((asset) => asset.source === 'upload').length,
    generated: assets.filter((asset) => asset.source === 'generated').length,
  }
}

export async function loadMediaLibrary(
  filePath = DEFAULT_MEDIA_LIBRARY_PATH,
): Promise<MediaLibraryData> {
  try {
    const text = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(text) as Partial<MediaLibraryData>
    if (!Array.isArray(parsed.assets)) return createEmptyMediaLibrary()

    return {
      version: MEDIA_LIBRARY_SCHEMA_VERSION,
      assets: parsed.assets.map(normalizePersistedAsset),
    }
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') return createEmptyMediaLibrary()
    throw error
  }
}

export async function saveMediaLibrary(
  data: MediaLibraryData,
  filePath = DEFAULT_MEDIA_LIBRARY_PATH,
): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
  const payload: MediaLibraryData = {
    version: MEDIA_LIBRARY_SCHEMA_VERSION,
    assets: data.assets.map(normalizePersistedAsset),
  }
  const tempPath = `${filePath}.${process.pid}.tmp`
  await writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  await rename(tempPath, filePath)
}

export async function upsertMediaAsset(
  asset: MediaAsset,
  filePath = DEFAULT_MEDIA_LIBRARY_PATH,
): Promise<MediaLibraryData> {
  const data = await loadMediaLibrary(filePath)
  const nextAsset = normalizePersistedAsset(asset)
  const index = data.assets.findIndex((item) => item.id === nextAsset.id || item.url === nextAsset.url)
  if (index >= 0) {
    data.assets[index] = {
      ...data.assets[index],
      ...nextAsset,
      createdAt: data.assets[index].createdAt,
      updatedAt: nextAsset.updatedAt,
    }
  } else {
    data.assets.unshift(nextAsset)
  }
  await saveMediaLibrary(data, filePath)
  return data
}

export async function updateMediaAsset(
  assetId: string,
  patch: Partial<Pick<MediaAsset, 'manualTags' | 'aiTags' | 'safetyTags' | 'reviewStatus' | 'notes' | 'title'>>,
  filePath = DEFAULT_MEDIA_LIBRARY_PATH,
): Promise<MediaLibraryData> {
  const data = await loadMediaLibrary(filePath)
  const index = data.assets.findIndex((asset) => asset.id === assetId)
  if (index < 0) throw new Error('素材不存在。')

  const current = data.assets[index]
  data.assets[index] = normalizePersistedAsset({
    ...current,
    ...patch,
    manualTags: patch.manualTags === undefined ? current.manualTags : normalizeTagList(patch.manualTags),
    aiTags: patch.aiTags === undefined ? current.aiTags : normalizeTagList(patch.aiTags),
    safetyTags: patch.safetyTags === undefined ? current.safetyTags : normalizeTagList(patch.safetyTags),
    reviewStatus: patch.reviewStatus || current.reviewStatus,
    updatedAt: new Date().toISOString(),
  })

  await saveMediaLibrary(data, filePath)
  return data
}

export async function tagMediaAssetWithVision(
  asset: MediaAsset,
  options: VisionTaggingOptions = {},
): Promise<VisionTaggingResult> {
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY || ''
  const model = options.model || process.env.MEDIA_LIBRARY_VISION_MODEL || 'gpt-5'
  const now = options.now || new Date().toISOString()

  if (!apiKey) {
    return {
      ok: false,
      message: '未配置 OPENAI_API_KEY，已保留为待审核素材。',
      asset: normalizePersistedAsset({
        ...asset,
        aiTags: mergeTags(asset.aiTags, ['ai_tagging_config_missing']),
        reviewStatus: 'needs_review',
        updatedAt: now,
      }),
    }
  }

  if (asset.type === 'video' && !asset.posterUrl) {
    return {
      ok: false,
      message: '视频 AI 打标需要先补充 poster URL。',
      asset: normalizePersistedAsset({
        ...asset,
        aiTags: mergeTags(asset.aiTags, ['ai_tagging_video_poster_missing']),
        reviewStatus: 'needs_review',
        updatedAt: now,
      }),
    }
  }

  const imageUrl = asset.posterUrl || asset.url
  if (!isHttpUrl(imageUrl)) {
    return {
      ok: false,
      message: 'AI 打标需要可公开访问的图片或视频 poster URL。',
      asset: normalizePersistedAsset({
        ...asset,
        aiTags: mergeTags(asset.aiTags, ['ai_tagging_url_not_public']),
        reviewStatus: 'needs_review',
        updatedAt: now,
      }),
    }
  }

  const response = await (options.fetchImpl || fetch)('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: [
                'Analyze this media asset for a reusable AI landing-page asset library.',
                'Return concise visual tags only. Use apparent visual presentation, not identity claims.',
                'Prefer tags such as full_body, half_body, close_up, female_presenting, male_presenting, adult_likely, young_adult, middle_aged, single_person, group, standing, sitting, clothing_reference, portrait_reference, simple_background, busy_background, product, logo_or_brand_risk, minor_risk, sexualized_risk.',
              ].join(' '),
            },
            {
              type: 'input_image',
              image_url: imageUrl,
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'media_asset_tags',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['tags', 'safetyTags', 'summary', 'confidence'],
            properties: {
              tags: {
                type: 'array',
                items: { type: 'string' },
              },
              safetyTags: {
                type: 'array',
                items: { type: 'string' },
              },
              summary: { type: 'string' },
              confidence: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['label', 'score'],
                  properties: {
                    label: { type: 'string' },
                    score: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `OpenAI vision tagging failed with status ${response.status}`)
  }

  const payload = await response.json() as OpenAIResponsesPayload
  const parsed = parseVisionTaggingPayload(extractOpenAIResponseText(payload))
  const safetyTags = normalizeTagList(parsed.safetyTags)

  return {
    ok: true,
    message: 'AI 标签已生成，请人工确认后再批准复用。',
    asset: normalizePersistedAsset({
      ...asset,
      aiTags: mergeTags(asset.aiTags, parsed.tags),
      safetyTags: mergeTags(asset.safetyTags, safetyTags),
      confidence: {
        ...asset.confidence,
        ...parsed.confidence,
      },
      analysisSummary: parsed.summary.trim(),
      reviewStatus: hasBlockingSafetyTag(safetyTags) ? 'needs_review' : 'needs_review',
      lastTaggedAt: now,
      updatedAt: now,
    }),
  }
}

function createHistoryMediaAsset(
  record: AdminGenerationRecordItem,
  sourceRole: MediaAssetSourceRole,
  url: string,
  now: string,
): MediaAsset {
  return {
    id: createAssetId(url),
    type: inferMediaAssetType(url, record.mediaType === 'video' ? 'video' : 'image'),
    url,
    title: buildHistoryAssetTitle(record, sourceRole),
    source: 'history',
    sourceRole,
    sourceHistoryId: record.id,
    sourceToolSlug: record.toolSlug,
    sourceToolLabel: record.toolLabel,
    sourcePath: record.sourcePath,
    sourceModel: record.model,
    sourcePrompt: record.prompt,
    sourceUserEmail: record.userEmail,
    sourceCreatedAt: record.createdAt,
    aiTags: [],
    manualTags: [],
    safetyTags: [],
    confidence: {},
    reviewStatus: 'candidate',
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  }
}

function buildHistoryAssetTitle(record: AdminGenerationRecordItem, sourceRole: MediaAssetSourceRole): string {
  const tool = record.toolLabel || record.toolSlug || 'History'
  return `${tool} ${sourceRole === 'history_output' ? '输出' : '输入'}`
}

function normalizePersistedAsset(asset: MediaAsset): MediaAsset {
  const now = new Date().toISOString()
  const url = normalizeMediaUrl(asset.url)
  return {
    ...asset,
    id: asset.id || createAssetId(url),
    url,
    type: asset.type || inferMediaAssetType(url),
    aiTags: normalizeTagList(asset.aiTags),
    manualTags: normalizeTagList(asset.manualTags),
    safetyTags: normalizeTagList(asset.safetyTags),
    confidence: normalizeConfidence(asset.confidence),
    reviewStatus: normalizeReviewStatus(asset.reviewStatus),
    usageCount: Math.max(0, Number(asset.usageCount) || 0),
    createdAt: asset.createdAt || now,
    updatedAt: asset.updatedAt || asset.createdAt || now,
  }
}

function createEmptyMediaLibrary(): MediaLibraryData {
  return {
    version: MEDIA_LIBRARY_SCHEMA_VERSION,
    assets: [],
  }
}

function createAssetId(url: string): string {
  return `asset_${createHash('sha256').update(normalizeMediaUrl(url)).digest('hex').slice(0, 18)}`
}

function inferMediaAssetType(url: string, fallback: MediaAssetType = 'image'): MediaAssetType {
  const extension = getUrlExtension(url)
  if (VIDEO_EXTENSIONS.has(extension)) return 'video'
  if (IMAGE_EXTENSIONS.has(extension)) return 'image'
  return fallback
}

function getUrlExtension(url: string): string {
  const pathname = (() => {
    try {
      return new URL(url, 'https://toolaze.local').pathname
    } catch {
      return url
    }
  })()
  const extension = pathname.split('.').pop()?.toLowerCase() || ''
  return extension.replace(/[^a-z0-9]/g, '')
}

function normalizeMediaUrl(value: string): string {
  return String(value || '').trim()
}

function isUsableMediaUrl(value: string): boolean {
  if (!value) return false
  if (value.startsWith('/')) return value.length > 1 && !value.startsWith('//')
  return isHttpUrl(value)
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function normalizeTagList(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  const normalized = tags
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim().toLowerCase().replace(/[\s-]+/g, '_'))
    .filter(Boolean)
  return Array.from(new Set(normalized)).sort()
}

function mergeTags(...groups: Array<unknown>): string[] {
  return normalizeTagList(groups.flatMap((group) => (Array.isArray(group) ? group : [])))
}

function getCombinedAssetTags(asset: MediaAsset): string[] {
  return mergeTags(asset.manualTags, asset.aiTags, asset.safetyTags)
}

function normalizeConfidence(confidence: unknown): Record<string, number> {
  if (!confidence || typeof confidence !== 'object' || Array.isArray(confidence)) return {}
  return Object.fromEntries(
    Object.entries(confidence)
      .map(([key, value]) => [key.trim().toLowerCase().replace(/[\s-]+/g, '_'), Number(value)])
      .filter(([key, value]) => key && Number.isFinite(value))
      .map(([key, value]) => [key, Math.max(0, Math.min(1, value as number))]),
  )
}

function normalizeReviewStatus(value: unknown): MediaAssetReviewStatus {
  if (
    value === 'candidate'
    || value === 'needs_review'
    || value === 'approved'
    || value === 'rejected'
  ) {
    return value
  }
  return 'candidate'
}

function readPositiveNumber(value: unknown): number | undefined {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : undefined
}

function extractOpenAIResponseText(payload: OpenAIResponsesPayload): string {
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text
  }
  const text = payload.output
    ?.flatMap((item) => item.content || [])
    .find((content) => content.type === 'output_text' && typeof content.text === 'string')
    ?.text
  if (!text) throw new Error('OpenAI response did not include structured output text.')
  return text
}

function parseVisionTaggingPayload(text: string): {
  tags: string[]
  safetyTags: string[]
  summary: string
  confidence: Record<string, number>
} {
  const parsed = JSON.parse(text) as {
    tags?: unknown
    safetyTags?: unknown
    summary?: unknown
    confidence?: unknown
  }

  const confidencePairs = Array.isArray(parsed.confidence) ? parsed.confidence : []
  const confidence = Object.fromEntries(
    confidencePairs
      .filter((item): item is { label: string; score: number } => (
        typeof item === 'object'
        && item !== null
        && typeof (item as { label?: unknown }).label === 'string'
        && typeof (item as { score?: unknown }).score === 'number'
      ))
      .map((item) => [
        item.label.trim().toLowerCase().replace(/[\s-]+/g, '_'),
        Math.max(0, Math.min(1, item.score)),
      ]),
  )

  return {
    tags: normalizeTagList(parsed.tags),
    safetyTags: normalizeTagList(parsed.safetyTags),
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    confidence,
  }
}

function hasBlockingSafetyTag(tags: string[]): boolean {
  return tags.some((tag) => (
    tag === 'minor_risk'
    || tag === 'sexualized_risk'
    || tag === 'violence_risk'
    || tag === 'logo_or_brand_risk'
  ))
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}
