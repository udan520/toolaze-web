export type PageDemoTargetSource = 'app_route' | 'data_file' | 'model_route'

export type PageDemoTarget = {
  url: string
  slug: string
  title: string
  keywords: string[]
  source: PageDemoTargetSource
  publishedAt?: string
}

const LOCALE_SEGMENTS = new Set([
  'de',
  'en',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'pt',
  'zh-tw',
])

export function normalizePageDemoUrlToSlug(value: string): string {
  let text = value.trim()
  if (!text) return ''

  if (/^(?:www\.)?toolaze\.com\//i.test(text) || /^[a-z0-9-]+\.vercel\.app\//i.test(text)) {
    text = `https://${text}`
  }
  if (/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\//i.test(text)) {
    text = `http://${text}`
  }

  const pathText = readPathname(text)
    .replace(/^\/+|\/+$/g, '')
    .trim()

  const segments = pathText
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (segments.length > 1 && isLocaleSegment(segments[0])) {
    segments.shift()
  }

  return segments.join('/').toLowerCase()
}

export function formatPageDemoSlugAsUrl(value: string): string {
  const slug = normalizePageDemoUrlToSlug(value)
  return slug ? `/${slug}` : ''
}

export function formatPageDemoLocalUrl(value: string): string {
  const slug = normalizePageDemoUrlToSlug(value)
  return slug ? `http://localhost:3010/${slug}` : ''
}

export function formatPageDemoPublicLocalUrl(value: string): string {
  const slug = normalizePageDemoUrlToSlug(value)
  return slug ? `http://localhost:3006/${slug}` : ''
}

function readPathname(value: string): string {
  try {
    return new URL(value, 'https://toolaze.com').pathname
  } catch {
    return value.split(/[?#]/)[0] || ''
  }
}

function isLocaleSegment(value: string): boolean {
  const text = value.toLowerCase()
  return LOCALE_SEGMENTS.has(text) || /^[a-z]{2}(?:-[a-z]{2})?$/.test(text)
}
