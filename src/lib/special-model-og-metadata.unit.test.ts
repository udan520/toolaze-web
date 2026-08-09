import assert from 'node:assert/strict'
import test from 'node:test'
import type { Metadata } from 'next'
import { getGptImage2PageMetadata } from './gpt-image-2-landing-copy'
import { getGrokImagineVideo15PageMetadata } from './grok-imagine-video-1-5-landing-copy'
import { getSeedream45PageMetadata } from './seedream-4-5-landing-copy'
import { getSeedream50LitePageMetadata } from './seedream-5-0-lite-landing-copy'
import { getSeedream50ProPageMetadata } from './seedream-5-0-pro-landing-copy'
import { getWan27ImagePageMetadata } from './wan-2-7-image-landing-copy'

function getOgImageUrl(metadata: Metadata): string | undefined {
  const images = metadata.openGraph && 'images' in metadata.openGraph ? metadata.openGraph.images : undefined
  const firstImage = Array.isArray(images) ? images[0] : images

  return typeof firstImage === 'string' || firstImage instanceof URL ? firstImage.toString() : firstImage?.url.toString()
}

function getOgImageDimensions(metadata: Metadata): [number | string | undefined, number | string | undefined] {
  const images = metadata.openGraph && 'images' in metadata.openGraph ? metadata.openGraph.images : undefined
  const firstImage = Array.isArray(images) ? images[0] : images

  return typeof firstImage === 'object' && firstImage && !(firstImage instanceof URL)
    ? [firstImage.width, firstImage.height]
    : [undefined, undefined]
}

const cases: Array<[string, () => Metadata, string, number, number]> = [
  ['GPT Image 2', () => getGptImage2PageMetadata('en'), 'https://toolaze.com/model-assets/gpt-image-2/prompt-product-poster.webp', 1280, 801],
  ['Seedream 4.5', () => getSeedream45PageMetadata('en'), 'https://toolaze.com/model-assets/seedream-4-5/feature-reference-consistency.webp', 1280, 960],
  ['Wan 2.7 Image', () => getWan27ImagePageMetadata('en'), 'https://toolaze.com/model-assets/wan-2-7-image/thinking-mode.webp', 960, 720],
  ['Seedream 5.0 Lite', () => getSeedream50LitePageMetadata('en'), 'https://assets.toolaze.com/model-assets/seedream-5-0-lite/gallery-search-grounded-product.webp', 1200, 900],
  ['Seedream 5.0 Pro', () => getSeedream50ProPageMetadata('en'), 'https://toolaze.com/model-assets/seedream-5-0-pro/prompt-product-ad.webp', 960, 720],
  ['Grok Imagine Video 1.5', () => getGrokImagineVideo15PageMetadata('en'), 'https://assets.toolaze.com/uploads/7b12e05c8c564a18b1ce7b02887051ac-poster.webp', 1200, 630],
]

for (const [name, buildMetadata, expectedUrl, expectedWidth, expectedHeight] of cases) {
  test(`${name} metadata uses its page demo as the OG image`, () => {
    const metadata = buildMetadata()

    assert.equal(getOgImageUrl(metadata), expectedUrl)
    assert.deepEqual(getOgImageDimensions(metadata), [expectedWidth, expectedHeight])
    assert.doesNotMatch(expectedUrl, /\.mp4(?:[?#].*)?$/i)
  })
}

const multilingualCases: Array<[string, (locale: string, canonicalUrl: string) => Metadata, string]> = [
  ['GPT Image 2', getGptImage2PageMetadata, 'gpt-image-2'],
  ['Seedream 4.5', getSeedream45PageMetadata, 'seedream-4-5'],
  ['Wan 2.7 Image', getWan27ImagePageMetadata, 'wan-2-7-image'],
  ['Seedream 5.0 Lite', getSeedream50LitePageMetadata, 'seedream-5-0-lite'],
  ['Seedream 5.0 Pro', getSeedream50ProPageMetadata, 'seedream-5-0-pro'],
  ['Grok Imagine Video 1.5', getGrokImagineVideo15PageMetadata, 'grok-imagine-video-1-5'],
]

for (const [name, buildMetadata, slug] of multilingualCases) {
  test(`${name} metadata publishes reciprocal hreflang links with a self-canonical`, () => {
    const englishUrl = `https://toolaze.com/model/${slug}`
    const germanUrl = `https://toolaze.com/de/model/${slug}`
    const metadata = buildMetadata('de', germanUrl)

    assert.equal(metadata.alternates?.canonical, germanUrl)
    assert.deepEqual(metadata.alternates?.languages, {
      en: englishUrl,
      de: germanUrl,
      ja: `https://toolaze.com/ja/model/${slug}`,
      es: `https://toolaze.com/es/model/${slug}`,
      'zh-TW': `https://toolaze.com/zh-TW/model/${slug}`,
      pt: `https://toolaze.com/pt/model/${slug}`,
      fr: `https://toolaze.com/fr/model/${slug}`,
      ko: `https://toolaze.com/ko/model/${slug}`,
      it: `https://toolaze.com/it/model/${slug}`,
      'x-default': englishUrl,
    })
  })
}
