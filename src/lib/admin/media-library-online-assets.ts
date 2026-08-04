import { createHash, createHmac } from 'node:crypto'
import { readFile } from 'node:fs/promises'

export type OnlineMediaResourceType = 'image' | 'video'

export type R2ListedObject = {
  key: string
  lastModified?: string
  sizeBytes?: number
}

export type R2ListObjectsResult = {
  objects: R2ListedObject[]
  isTruncated: boolean
  nextCursor?: string
}

export type OnlineMediaResource = {
  key: string
  url: string
  type: OnlineMediaResourceType
  sizeBytes?: number
  uploadedAt?: string
  alreadyInLibrary: boolean
}

export type OnlineMediaResourceFilters = {
  query?: string
  type?: OnlineMediaResourceType | 'all'
  prefix?: string
}

export type ListOnlineMediaResourcesOptions = OnlineMediaResourceFilters & {
  cursor?: string
  limit?: number
  existingUrls?: Set<string>
  fetchImpl?: typeof fetch
}

export type ListOnlineMediaResourcesResult = {
  resources: OnlineMediaResource[]
  total: number
  prefix: string
  bucket?: string
  nextCursor?: string
  configMissing?: boolean
  message?: string
}

type R2ListConfig = {
  accessKeyId: string
  secretAccessKey: string
  endpointUrl: string
  bucket: string
  publicBaseUrl: string
}

const R2_ENV_KEYS = [
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT_URL',
  'R2_BUCKET',
  'R2_PUBLIC_BASE_URL',
] as const

const DEFAULT_R2_BUCKET = 'toolaze'
const DEFAULT_PUBLIC_BASE_URL = 'https://assets.toolaze.com'
const DEFAULT_PREFIX = 'uploads/'
const EMPTY_PAYLOAD_HASH = createHash('sha256').update('').digest('hex')
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'])
const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'webm', 'mkv'])

export async function listOnlineMediaResources(
  options: ListOnlineMediaResourcesOptions = {},
): Promise<ListOnlineMediaResourcesResult> {
  const prefix = normalizePrefix(options.prefix)
  const config = await getR2ListConfig()
  if (!config.accessKeyId || !config.secretAccessKey || !config.endpointUrl || !config.publicBaseUrl) {
    return {
      resources: [],
      total: 0,
      prefix,
      configMissing: true,
      message: '未配置 R2 列表权限。需要 R2_ACCESS_KEY_ID、R2_SECRET_ACCESS_KEY、R2_ENDPOINT_URL 和 R2_PUBLIC_BASE_URL。',
    }
  }

  const result = await fetchR2ListObjects(config, {
    prefix,
    cursor: options.cursor,
    limit: options.limit,
    fetchImpl: options.fetchImpl,
  })
  const resources = filterOnlineMediaResources(
    mapR2ObjectsToOnlineMediaResources(result.objects, {
      publicBaseUrl: config.publicBaseUrl,
      existingUrls: options.existingUrls || new Set(),
    }),
    options,
  )

  return {
    resources,
    total: resources.length,
    prefix,
    bucket: config.bucket,
    nextCursor: result.nextCursor,
  }
}

export function parseR2ListObjectsResponse(xml: string): R2ListObjectsResult {
  const objects: R2ListedObject[] = []
  const contentMatches = String(xml || '').matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)

  for (const match of contentMatches) {
    const block = match[1] || ''
    const key = readXmlTag(block, 'Key')
    if (!key) continue
    const size = Number(readXmlTag(block, 'Size'))
    objects.push({
      key,
      ...(readXmlTag(block, 'LastModified') ? { lastModified: readXmlTag(block, 'LastModified') } : {}),
      ...(Number.isFinite(size) ? { sizeBytes: size } : {}),
    })
  }

  return {
    objects,
    isTruncated: readXmlTag(xml, 'IsTruncated') === 'true',
    ...(readXmlTag(xml, 'NextContinuationToken') ? { nextCursor: readXmlTag(xml, 'NextContinuationToken') } : {}),
  }
}

export function mapR2ObjectsToOnlineMediaResources(
  objects: R2ListedObject[],
  options: {
    publicBaseUrl: string
    existingUrls?: Set<string>
  },
): OnlineMediaResource[] {
  const baseUrl = normalizeBaseUrl(options.publicBaseUrl || DEFAULT_PUBLIC_BASE_URL)
  const existingUrls = new Set(
    Array.from(options.existingUrls || []).map(normalizeComparableUrl),
  )

  return objects
    .map((object): OnlineMediaResource | null => {
      const type = inferOnlineMediaType(object.key)
      if (!type) return null
      const url = `${baseUrl}/${encodeR2KeyForPublicUrl(object.key)}`
      return {
        key: object.key,
        url,
        type,
        ...(Number.isFinite(object.sizeBytes) ? { sizeBytes: object.sizeBytes } : {}),
        ...(object.lastModified ? { uploadedAt: object.lastModified } : {}),
        alreadyInLibrary: existingUrls.has(normalizeComparableUrl(url)),
      }
    })
    .filter((resource): resource is OnlineMediaResource => Boolean(resource))
}

export function filterOnlineMediaResources(
  resources: OnlineMediaResource[],
  filters: OnlineMediaResourceFilters = {},
): OnlineMediaResource[] {
  const type = filters.type || 'all'
  const prefix = filters.prefix?.trim() || ''
  const tokens = normalizeSearchText(filters.query || '').split(' ').filter(Boolean)

  return resources.filter((resource) => {
    if (type !== 'all' && resource.type !== type) return false
    if (prefix && !resource.key.startsWith(prefix)) return false
    if (tokens.length === 0) return true

    const searchable = normalizeSearchText(`${resource.key} ${resource.url}`)
    return tokens.every((token) => searchable.includes(token))
  })
}

async function fetchR2ListObjects(
  config: R2ListConfig,
  options: {
    prefix: string
    cursor?: string
    limit?: number
    fetchImpl?: typeof fetch
  },
): Promise<R2ListObjectsResult> {
  const endpoint = new URL(config.endpointUrl)
  const objectPath = `/${config.bucket}`
  const queryParams = new URLSearchParams()
  queryParams.set('list-type', '2')
  queryParams.set('max-keys', String(clampLimit(options.limit)))
  if (options.prefix) queryParams.set('prefix', options.prefix)
  if (options.cursor) queryParams.set('continuation-token', options.cursor)

  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const canonicalQuery = buildCanonicalQueryString(queryParams)
  const canonicalHeaders = [
    `host:${endpoint.host}`,
    `x-amz-content-sha256:${EMPTY_PAYLOAD_HASH}`,
    `x-amz-date:${amzDate}`,
  ].join('\n') + '\n'
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalRequest = [
    'GET',
    objectPath,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    EMPTY_PAYLOAD_HASH,
  ].join('\n')
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n')
  const signature = hmacHex(getSigningKey(config.secretAccessKey, dateStamp), stringToSign)
  const authorization = [
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(', ')
  const requestUrl = `${endpoint.origin}${objectPath}?${queryParams.toString()}`
  const response = await (options.fetchImpl || fetch)(requestUrl, {
    method: 'GET',
    headers: {
      Authorization: authorization,
      'x-amz-content-sha256': EMPTY_PAYLOAD_HASH,
      'x-amz-date': amzDate,
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `R2 resource listing failed with status ${response.status}`)
  }

  return parseR2ListObjectsResponse(await response.text())
}

async function getR2ListConfig(): Promise<R2ListConfig> {
  const fallback = await readLocalEnvFallback()
  return {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || fallback.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || fallback.R2_SECRET_ACCESS_KEY || '',
    endpointUrl: (process.env.R2_ENDPOINT_URL || fallback.R2_ENDPOINT_URL || '').replace(/\/+$/, ''),
    bucket: process.env.R2_BUCKET || fallback.R2_BUCKET || DEFAULT_R2_BUCKET,
    publicBaseUrl: normalizeBaseUrl(process.env.R2_PUBLIC_BASE_URL || fallback.R2_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL),
  }
}

async function readLocalEnvFallback(): Promise<Partial<Record<typeof R2_ENV_KEYS[number], string>>> {
  try {
    const text = await readFile('.env.local', 'utf8')
    return Object.fromEntries(
      R2_ENV_KEYS
        .map((key) => {
          const match = text.match(new RegExp(`^(?:export\\s+)?${key}=[\\"']?([^\\"'\\n]+)[\\"']?`, 'm'))
          return [key, match?.[1]?.trim() || '']
        })
        .filter(([, value]) => value),
    )
  } catch {
    return {}
  }
}

function readXmlTag(xml: string, tagName: string): string {
  const match = String(xml || '').match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`))
  return decodeXml(match?.[1]?.trim() || '')
}

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function inferOnlineMediaType(key: string): OnlineMediaResourceType | null {
  const extension = key.split('?')[0]?.split('.').pop()?.toLowerCase() || ''
  if (IMAGE_EXTENSIONS.has(extension)) return 'image'
  if (VIDEO_EXTENSIONS.has(extension)) return 'video'
  return null
}

function encodeR2KeyForPublicUrl(key: string): string {
  return key.split('/').map((part) => encodeURIComponent(part)).join('/')
}

function normalizeBaseUrl(value: string): string {
  return String(value || '').trim().replace(/\/+$/, '')
}

function normalizePrefix(value: string | undefined): string {
  const prefix = String(value || DEFAULT_PREFIX).trim().replace(/^\/+/, '')
  return prefix || DEFAULT_PREFIX
}

function normalizeComparableUrl(value: string): string {
  return String(value || '').trim()
}

function normalizeSearchText(value: string): string {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function clampLimit(value: number | undefined): number {
  const limit = Number(value) || 100
  return Math.max(1, Math.min(1000, Math.floor(limit)))
}

function buildCanonicalQueryString(params: URLSearchParams): string {
  return Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${awsEncode(key)}=${awsEncode(value)}`)
    .join('&')
}

function awsEncode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function hmacBuffer(key: string | Buffer, value: string): Buffer {
  return createHmac('sha256', key).update(value).digest()
}

function hmacHex(key: string | Buffer, value: string): string {
  return createHmac('sha256', key).update(value).digest('hex')
}

function getSigningKey(secretAccessKey: string, dateStamp: string): Buffer {
  const dateKey = hmacBuffer(`AWS4${secretAccessKey}`, dateStamp)
  const regionKey = hmacBuffer(dateKey, 'auto')
  const serviceKey = hmacBuffer(regionKey, 's3')
  return hmacBuffer(serviceKey, 'aws4_request')
}
