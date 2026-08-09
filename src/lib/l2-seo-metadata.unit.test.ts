import assert from 'node:assert/strict'
import test from 'node:test'
import { applyL2OpenGraphImage, getL2OpenGraphImage } from './l2-seo-metadata'

test('prefers a video poster over other page demo images', () => {
  const image = getL2OpenGraphImage({
    heroDemoVideo: {
      type: 'video',
      src: 'https://assets.toolaze.com/demo.mp4',
      poster: 'https://assets.toolaze.com/demo-poster.webp',
      width: 16,
      height: 9,
      ariaLabel: 'Video demo poster',
    },
    topTool: {
      sampleImages: [{ url: 'https://assets.toolaze.com/sample.webp' }],
    },
  })

  assert.equal(image.url, 'https://assets.toolaze.com/demo-poster.webp')
  assert.equal(image.width, 1200)
  assert.equal(image.height, 630)
  assert.equal(image.alt, 'Video demo poster')
})

test('uses an image hero source and resolves local URLs to the production domain', () => {
  const image = getL2OpenGraphImage({
    heroDemoVideo: {
      type: 'image',
      src: '/model-assets/demo.webp',
      width: 1600,
      height: 900,
    },
  })

  assert.equal(image.url, 'https://toolaze.com/model-assets/demo.webp')
  assert.equal(image.width, 1600)
  assert.equal(image.height, 900)
})

test('uses the first sample poster before the sample URL', () => {
  const image = getL2OpenGraphImage({
    topTool: {
      sampleImages: [{
        url: 'https://assets.toolaze.com/sample.mp4',
        poster: 'https://assets.toolaze.com/sample-poster.webp',
      }],
    },
  })

  assert.equal(image.url, 'https://assets.toolaze.com/sample-poster.webp')
})

test('never exposes a video file as og:image and falls back to the Toolaze logo', () => {
  const image = getL2OpenGraphImage({
    heroDemoVideo: {
      type: 'video',
      src: 'https://assets.toolaze.com/demo.mp4',
    },
    topTool: {
      sampleImages: [{ url: 'https://assets.toolaze.com/sample.mp4' }],
    },
  })

  assert.deepEqual(image, {
    url: 'https://toolaze.com/web-app-manifest-512x512.png',
    width: 512,
    height: 512,
    alt: 'Toolaze Logo',
  })
})

test('applies the page demo image without replacing custom metadata fields', () => {
  const metadata = applyL2OpenGraphImage(
    {
      title: 'Custom title',
      description: 'Custom description',
      alternates: { canonical: 'https://toolaze.com/model/example' },
      openGraph: {
        title: 'Custom OG title',
        description: 'Custom OG description',
        url: 'https://toolaze.com/model/example',
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: 'Custom Twitter title',
        description: 'Custom Twitter description',
      },
    },
    {
      topTool: {
        sampleImages: [{ url: '/model-assets/example/demo.webp', title: 'Example demo' }],
      },
    },
  )

  assert.equal(metadata.title, 'Custom title')
  assert.equal(metadata.description, 'Custom description')
  assert.deepEqual(metadata.alternates, { canonical: 'https://toolaze.com/model/example' })
  assert.deepEqual(metadata.openGraph, {
    title: 'Custom OG title',
    description: 'Custom OG description',
    url: 'https://toolaze.com/model/example',
    type: 'website',
    images: [{
      url: 'https://toolaze.com/model-assets/example/demo.webp',
      width: 1200,
      height: 630,
      alt: 'Example demo',
    }],
  })
  assert.deepEqual(metadata.twitter, {
    card: 'summary_large_image',
    title: 'Custom Twitter title',
    description: 'Custom Twitter description',
    images: ['https://toolaze.com/model-assets/example/demo.webp'],
  })
})
