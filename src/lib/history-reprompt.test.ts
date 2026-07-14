import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildHistoryRepromptPayload,
  getDisplayImagePreviewUrl,
  getHistoryReferenceImageUrls,
} from './history-reprompt'

const baseHistoryItem = {
  prompt: 'Create a premium citrus soda campaign image.',
  model: 'seedream-5-0-pro',
  outputUrl: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/generations/output-original.png',
  inputUrls: [] as string[],
  aspectRatio: '16:9',
  resolution: '1K',
  outputFormat: 'Auto',
}

test('uses original input references for Create Similar when they exist', () => {
  const item = {
    ...baseHistoryItem,
    inputUrls: [
      'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/reference-one.png',
      'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/reference-two.png',
    ],
  }

  assert.deepEqual(getHistoryReferenceImageUrls(item), item.inputUrls)
  assert.deepEqual(buildHistoryRepromptPayload(item), {
    prompt: item.prompt,
    imageUrls: item.inputUrls,
    modelId: item.model,
    aspectRatio: item.aspectRatio,
    resolution: item.resolution,
    outputFormat: item.outputFormat,
  })
})


test('keeps same-origin reference paths for Create Similar', () => {
  const item = {
    ...baseHistoryItem,
    inputUrls: [
      '/ai-hair-color-changer/default-reference.png',
      ' /ai-baby-generator/sample-reference.webp ',
    ],
  }

  assert.deepEqual(getHistoryReferenceImageUrls(item), [
    '/ai-hair-color-changer/default-reference.png',
    '/ai-baby-generator/sample-reference.webp',
  ])
  assert.deepEqual(buildHistoryRepromptPayload(item).imageUrls, [
    '/ai-hair-color-changer/default-reference.png',
    '/ai-baby-generator/sample-reference.webp',
  ])
})

test('drops browser-only and unsafe reference URLs for Create Similar', () => {
  const item = {
    ...baseHistoryItem,
    inputUrls: [
      'blob:http://localhost/image-id',
      'data:image/png;base64,abc',
      'javascript:alert(1)',
      '//example.com/protocol-relative.png',
      '/ai-hair-color-changer/default-reference.png',
      'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp',
    ],
  }

  assert.deepEqual(buildHistoryRepromptPayload(item).imageUrls, [
    '/ai-hair-color-changer/default-reference.png',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp',
  ])
})

test('falls back to the original output image for Create Similar when no input reference exists', () => {
  assert.deepEqual(getHistoryReferenceImageUrls(baseHistoryItem), [baseHistoryItem.outputUrl])
  assert.deepEqual(buildHistoryRepromptPayload(baseHistoryItem).imageUrls, [baseHistoryItem.outputUrl])
})

test('creates a small display URL without changing the original image URL', () => {
  const previewUrl = getDisplayImagePreviewUrl(baseHistoryItem.outputUrl, 384)

  assert.match(previewUrl, /^\/_next\/image\?/)
  assert.match(previewUrl, /w=384/)
  assert.equal(baseHistoryItem.outputUrl.includes('/_next/image'), false)
})

test('keeps blob and data URLs unchanged for local browser previews', () => {
  assert.equal(getDisplayImagePreviewUrl('blob:http://localhost/image-id', 128), 'blob:http://localhost/image-id')
  assert.equal(getDisplayImagePreviewUrl('data:image/png;base64,abc', 128), 'data:image/png;base64,abc')
})
