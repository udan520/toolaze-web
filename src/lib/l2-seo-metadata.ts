import type { Metadata } from 'next'

const SITE_URL = 'https://toolaze.com'
const DEFAULT_OG_IMAGE = SITE_URL + '/web-app-manifest-512x512.png'

interface HreflangMetadata {
  canonical: string
  languages: Record<string, string>
}

interface L2SeoImageCandidate {
  url?: string
  poster?: string
  width?: number
  height?: number
  title?: string
  alt?: string
  ariaLabel?: string
}

interface L2SeoContent {
  metadata?: {
    title?: string
    description?: string
  }
  heroDemoVideo?: L2SeoImageCandidate & {
    src?: string
    type?: string
  }
  topTool?: {
    sampleImages?: L2SeoImageCandidate[]
  }
}

interface BuildL2SeoMetadataOptions {
  content: L2SeoContent | null | undefined
  hreflang: HreflangMetadata
  fallbackTitle: string
  fallbackDescription: string
  robots?: Metadata['robots']
}

function toAbsoluteToolazeUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return SITE_URL + url
  return undefined
}

function isImageUrl(url?: string): boolean {
  if (!url) return false
  return /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(url)
}

function firstImageUrl(...urls: Array<string | undefined>): string | undefined {
  for (const url of urls) {
    const absoluteUrl = toAbsoluteToolazeUrl(url)
    if (isImageUrl(absoluteUrl)) return absoluteUrl
  }
  return undefined
}

export function getL2OpenGraphImage(content: L2SeoContent | null | undefined) {
  const heroDemoVideo = content?.heroDemoVideo
  const firstSample = content?.topTool?.sampleImages?.[0]
  const url =
    firstImageUrl(
      heroDemoVideo?.poster,
      heroDemoVideo?.type === 'image' ? heroDemoVideo?.src : undefined,
      firstSample?.poster,
      firstSample?.url,
    ) || DEFAULT_OG_IMAGE
  const source =
    url === DEFAULT_OG_IMAGE
      ? undefined
      : url === toAbsoluteToolazeUrl(heroDemoVideo?.poster) || url === toAbsoluteToolazeUrl(heroDemoVideo?.src)
        ? heroDemoVideo
        : firstSample
  const hasPixelDimensions = Boolean(source?.width && source?.height && source.width >= 200 && source.height >= 200)
  const isFallback = url === DEFAULT_OG_IMAGE

  return {
    url,
    width: isFallback ? 512 : hasPixelDimensions ? source?.width : 1200,
    height: isFallback ? 512 : hasPixelDimensions ? source?.height : 630,
    alt: isFallback ? 'Toolaze Logo' : source?.alt || source?.ariaLabel || source?.title || 'Toolaze page preview',
  }
}

export function applyL2OpenGraphImage(
  metadata: Metadata,
  content: L2SeoContent | null | undefined,
): Metadata {
  const ogImage = getL2OpenGraphImage(content)

  return {
    ...metadata,
    openGraph: {
      ...(metadata.openGraph || {}),
      images: [ogImage],
    },
    twitter: {
      ...(metadata.twitter || {}),
      card: 'summary_large_image',
      images: [ogImage.url],
    },
  }
}

export function buildL2SeoMetadata({
  content,
  hreflang,
  fallbackTitle,
  fallbackDescription,
  robots = 'index, follow',
}: BuildL2SeoMetadataOptions): Metadata {
  const title = content?.metadata?.title || fallbackTitle
  const description = content?.metadata?.description || fallbackDescription
  const ogImage = getL2OpenGraphImage(content)

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
    openGraph: {
      title,
      description,
      url: hreflang.canonical,
      siteName: 'Toolaze',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  }
}
