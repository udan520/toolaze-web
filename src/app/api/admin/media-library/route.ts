import {
  buildMediaAssetStats,
  createManualMediaAsset,
  DEFAULT_MEDIA_LIBRARY_PATH,
  filterMediaAssets,
  importMediaAssetsFromHistory,
  loadMediaLibrary,
  saveMediaLibrary,
  tagMediaAssetWithVision,
  updateMediaAsset,
  upsertMediaAsset,
  type MediaAsset,
  type MediaAssetFilters,
  type MediaAssetReviewStatus,
  type MediaAssetSource,
  type MediaAssetType,
} from '@/lib/admin/media-library'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import { fetchProductionGenerationRecords } from '@/lib/admin/users'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

type CreateUrlBody = {
  action: 'create_url'
  url?: string
  type?: MediaAssetType
  posterUrl?: string
  title?: string
  source?: MediaAssetSource
  manualTags?: string[] | string
  notes?: string
  width?: number
  height?: number
  durationSeconds?: number
}

type ImportHistoryBody = {
  action: 'import_recent_history'
  includeInputs?: boolean
  includeOutputs?: boolean
}

type AiTagBody = {
  action: 'ai_tag'
  assetId?: string
}

type UpdateBody = {
  assetId?: string
  manualTags?: string[] | string
  aiTags?: string[] | string
  safetyTags?: string[] | string
  reviewStatus?: MediaAssetReviewStatus
  notes?: string
  title?: string
}

type ActionBody = CreateUrlBody | ImportHistoryBody | AiTagBody

export async function GET(request: Request) {
  if (!isRequestAllowed(request)) return json({ error: 'Not found' }, 404)

  const url = new URL(request.url)
  const data = await loadMediaLibrary(getMediaLibraryPath())
  const filters = readFilters(url.searchParams)
  const assets = filterMediaAssets(data.assets, filters)

  return json({
    assets,
    stats: buildMediaAssetStats(data.assets),
    filteredCount: assets.length,
    storagePath: getMediaLibraryPath(),
  })
}

export async function POST(request: Request) {
  if (!isRequestAllowed(request)) return json({ error: 'Not found' }, 404)

  const body = await readJson<ActionBody>(request)

  if (body.action === 'create_url') {
    const url = String(body.url || '').trim()
    if (!url) return json({ error: '素材 URL 不能为空。' }, 400)

    const asset = createManualMediaAsset({
      url,
      type: body.type,
      posterUrl: body.posterUrl,
      title: body.title,
      source: body.source || 'upload',
      manualTags: parseTags(body.manualTags),
      notes: body.notes,
      width: body.width,
      height: body.height,
      durationSeconds: body.durationSeconds,
    })
    const data = await upsertMediaAsset(asset, getMediaLibraryPath())

    return json({
      asset,
      stats: buildMediaAssetStats(data.assets),
    }, 201)
  }

  if (body.action === 'import_recent_history') {
    const data = await loadMediaLibrary(getMediaLibraryPath())
    const records = await fetchProductionGenerationRecords()
    const result = importMediaAssetsFromHistory(records, {
      existingAssets: data.assets,
      includeInputs: body.includeInputs !== false,
      includeOutputs: body.includeOutputs !== false,
    })
    await saveMediaLibrary({
      version: data.version,
      assets: result.assets,
    }, getMediaLibraryPath())

    return json({
      assets: result.assets,
      importedCount: result.importedCount,
      skippedCount: result.skippedCount,
      stats: buildMediaAssetStats(result.assets),
    })
  }

  if (body.action === 'ai_tag') {
    const assetId = String(body.assetId || '').trim()
    if (!assetId) return json({ error: '缺少 assetId。' }, 400)

    const data = await loadMediaLibrary(getMediaLibraryPath())
    const asset = data.assets.find((item) => item.id === assetId)
    if (!asset) return json({ error: '素材不存在。' }, 404)

    const result = await tagMediaAssetWithVision(asset)
    const nextAssets = data.assets.map((item) => (item.id === assetId ? result.asset : item))
    await saveMediaLibrary({ version: data.version, assets: nextAssets }, getMediaLibraryPath())

    return json({
      asset: result.asset,
      ok: result.ok,
      message: result.message,
      stats: buildMediaAssetStats(nextAssets),
    })
  }

  return json({ error: '未知素材库操作。' }, 400)
}

export async function PATCH(request: Request) {
  if (!isRequestAllowed(request)) return json({ error: 'Not found' }, 404)

  const body = await readJson<UpdateBody>(request)
  const assetId = String(body.assetId || '').trim()
  if (!assetId) return json({ error: '缺少 assetId。' }, 400)

  const patch: Parameters<typeof updateMediaAsset>[1] = {}
  if (body.manualTags !== undefined) patch.manualTags = parseTags(body.manualTags)
  if (body.aiTags !== undefined) patch.aiTags = parseTags(body.aiTags)
  if (body.safetyTags !== undefined) patch.safetyTags = parseTags(body.safetyTags)
  if (body.reviewStatus) patch.reviewStatus = body.reviewStatus
  if (body.notes !== undefined) patch.notes = body.notes
  if (body.title !== undefined) patch.title = body.title

  const data = await updateMediaAsset(assetId, patch, getMediaLibraryPath())
  const asset = data.assets.find((item) => item.id === assetId) as MediaAsset | undefined

  return json({
    asset,
    stats: buildMediaAssetStats(data.assets),
  })
}

function isRequestAllowed(request: Request): boolean {
  const requestUrl = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host

  return isMediaLibraryAdminHost(host) && isAdminRequestAllowed({
    host,
    adminEmail: getAdminEmailFromHeaders(request.headers),
  })
}

function isMediaLibraryAdminHost(host: string | null): boolean {
  if (!host) return false
  const normalized = host.trim().toLowerCase()
  const hostname = normalized.startsWith('[')
    ? normalized.slice(0, normalized.indexOf(']') + 1)
    : normalized.split(':')[0]
  const port = normalized.startsWith('[')
    ? normalized.slice(normalized.indexOf(']') + 1).replace(/^:/, '')
    : normalized.split(':')[1]

  return (
    (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]')
    && port === '3010'
  )
}

function readFilters(searchParams: URLSearchParams): MediaAssetFilters {
  return {
    query: searchParams.get('q') || undefined,
    type: readEnum(searchParams.get('type'), ['image', 'video', 'all']),
    source: readEnum(searchParams.get('source'), ['history', 'upload', 'generated', 'all']),
    reviewStatus: readEnum(searchParams.get('reviewStatus'), [
      'candidate',
      'needs_review',
      'approved',
      'rejected',
      'all',
    ]),
    tags: parseTags(searchParams.get('tags') || undefined),
  }
}

function readEnum<T extends string>(value: string | null, allowed: T[]): T | undefined {
  if (!value) return undefined
  return allowed.includes(value as T) ? value as T : undefined
}

function parseTags(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []
  return value.split(/[,，\n]/)
}

async function readJson<T>(request: Request): Promise<T> {
  try {
    return await request.json() as T
  } catch {
    return {} as T
  }
}

function getMediaLibraryPath(): string {
  return process.env.TOOLAZE_MEDIA_LIBRARY_FILE || DEFAULT_MEDIA_LIBRARY_PATH
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status })
}
