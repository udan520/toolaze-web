import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import {
  DEFAULT_MEDIA_LIBRARY_PATH,
  loadMediaLibrary,
} from '@/lib/admin/media-library'
import {
  filterOnlineMediaResources,
  listOnlineMediaResources,
  type ListOnlineMediaResourcesOptions,
  type ListOnlineMediaResourcesResult,
  type OnlineMediaResource,
  type OnlineMediaResourceType,
} from '@/lib/admin/media-library-online-assets'
import {
  fetchProductionGenerationRecords,
  type AdminGenerationRecordItem,
} from '@/lib/admin/users'

type OnlineResourcesDependencies = {
  listResources?: (options: ListOnlineMediaResourcesOptions) => Promise<ListOnlineMediaResourcesResult>
  fetchHistoryRecords?: () => Promise<AdminGenerationRecordItem[]>
}

export async function getOnlineMediaResourcesResponse(
  request: Request,
  dependencies: OnlineResourcesDependencies = {},
) {
  if (!isRequestAllowed(request)) return json({ error: 'Not found' }, 404)

  const url = new URL(request.url)
  const searchParams = url.searchParams
  const data = await loadMediaLibrary(getMediaLibraryPath())
  const options = {
    prefix: searchParams.get('prefix') || undefined,
    query: searchParams.get('q') || undefined,
    type: readType(searchParams.get('type')),
    cursor: searchParams.get('cursor') || undefined,
    limit: readLimit(searchParams.get('limit')),
    existingUrls: new Set(data.assets.map((asset) => asset.url)),
  } satisfies ListOnlineMediaResourcesOptions

  const listResources = dependencies.listResources || listOnlineMediaResources
  const result = await listResources(options)

  if (!result.configMissing) return json({ ...result, source: 'r2' })

  const fetchHistoryRecords = dependencies.fetchHistoryRecords
    || (() => fetchProductionGenerationRecords(undefined, 8_000))
  let records: AdminGenerationRecordItem[]

  try {
    records = await fetchHistoryRecords()
  } catch (error) {
    const historyMessage = error instanceof Error ? error.message : 'History fallback failed.'
    return json({
      resources: [],
      total: 0,
      prefix: options.prefix || 'uploads/',
      source: 'unavailable',
      configMissing: true,
      message: [
        result.message || '未配置 R2 列表权限。',
        `History fallback 也无法读取：${historyMessage}`,
        '请配置 R2 list key，或运行 npx wrangler login 刷新 Cloudflare 登录态后重试。',
      ].join(' '),
    })
  }

  const resources = filterOnlineMediaResources(
    mapGenerationRecordsToOnlineMediaResources(records, options.existingUrls),
    options,
  ).slice(0, options.limit || 200)

  return json({
    resources,
    total: resources.length,
    prefix: options.prefix || 'uploads/',
    source: 'history',
    message: 'R2 列表权限未配置，当前展示最近 History 里的线上资源。',
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

function readType(value: string | null): OnlineMediaResourceType | 'all' | undefined {
  if (value === 'image' || value === 'video' || value === 'all') return value
  return undefined
}

function readLimit(value: string | null): number | undefined {
  const limit = Number(value)
  return Number.isFinite(limit) && limit > 0 ? limit : undefined
}

function getMediaLibraryPath(): string {
  return process.env.TOOLAZE_MEDIA_LIBRARY_FILE || DEFAULT_MEDIA_LIBRARY_PATH
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status })
}

function mapGenerationRecordsToOnlineMediaResources(
  records: AdminGenerationRecordItem[],
  existingUrls: Set<string>,
): OnlineMediaResource[] {
  const resources: OnlineMediaResource[] = []
  const seenUrls = new Set<string>()

  for (const record of records) {
    for (const item of getRecordMediaUrls(record)) {
      if (seenUrls.has(item.url)) continue
      seenUrls.add(item.url)

      const key = buildOnlineResourceKey(item.url)
      const type = inferOnlineResourceType(key, item.fallbackType)
      if (!type) continue

      resources.push({
        key,
        url: item.url,
        type,
        uploadedAt: record.createdAt,
        alreadyInLibrary: existingUrls.has(item.url),
      })
    }
  }

  return resources
}

function getRecordMediaUrls(record: AdminGenerationRecordItem): Array<{
  url: string
  fallbackType: OnlineMediaResourceType
}> {
  const fallbackType: OnlineMediaResourceType = record.mediaType === 'video' ? 'video' : 'image'
  const inputUrls = record.inputUrls.map((url): { url: string; fallbackType: OnlineMediaResourceType } => ({
    url,
    fallbackType: inferOnlineResourceType(url, fallbackType) || fallbackType,
  }))

  return [
    { url: record.outputUrl, fallbackType },
    ...inputUrls,
  ].filter((item) => isPublicAssetUrl(item.url))
}

function buildOnlineResourceKey(url: string): string {
  try {
    const parsed = new URL(url)
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ''))
  } catch {
    return url.replace(/^\/+/, '')
  }
}

function inferOnlineResourceType(
  keyOrUrl: string,
  fallback?: OnlineMediaResourceType,
): OnlineMediaResourceType | null {
  const extension = keyOrUrl.split('?')[0]?.split('.').pop()?.toLowerCase() || ''
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(extension)) return 'image'
  if (['mp4', 'mov', 'webm', 'mkv'].includes(extension)) return 'video'
  return fallback || null
}

function isPublicAssetUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}
