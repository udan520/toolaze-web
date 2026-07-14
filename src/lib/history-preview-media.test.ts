import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getHistoryFullScreenPreviewUrl,
  getHistoryLibraryThumbnailUrl,
  getHistoryPreviewMediaUrl,
  getHistoryReferenceThumbnailUrl,
} from './history-preview-media'

test('uses the generated output as the initial history preview media', () => {
  assert.equal(
    getHistoryPreviewMediaUrl({
      outputUrl: 'https://example.com/generated.webp',
      selectedReferenceUrl: '',
    }),
    'https://example.com/generated.webp',
  )
})

test('keeps the generated output in the detail preview when a reference is selected', () => {
  assert.equal(
    getHistoryPreviewMediaUrl({
      outputUrl: 'https://example.com/generated.webp',
      selectedReferenceUrl: 'https://example.com/reference.webp',
    }),
    'https://example.com/generated.webp',
  )
})

test('uses the original reference image for full screen preview when the URL is a Next thumbnail', () => {
  const originalUrl = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/reference-original.webp'
  const thumbnailUrl = `/_next/image?url=${encodeURIComponent(originalUrl)}&w=128&q=60`

  assert.equal(
    getHistoryFullScreenPreviewUrl(thumbnailUrl),
    originalUrl,
  )
})

test('uses smaller thumbnails for the library grid before opening the original preview', () => {
  const originalUrl = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/generations/output-original.png'
  const thumbnailUrl = getHistoryLibraryThumbnailUrl(originalUrl)

  assert.match(thumbnailUrl, /^\/_next\/image\?/)
  assert.match(thumbnailUrl, /w=256/)
  assert.match(thumbnailUrl, /q=60/)
})

test('uses compact reference thumbnails while preserving original click targets', () => {
  const originalUrl = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/reference-original.webp'
  const thumbnailUrl = getHistoryReferenceThumbnailUrl(originalUrl)

  assert.match(thumbnailUrl, /^\/_next\/image\?/)
  assert.match(thumbnailUrl, /w=128/)
  assert.match(thumbnailUrl, /q=60/)
  assert.equal(getHistoryFullScreenPreviewUrl(originalUrl), originalUrl)
})
