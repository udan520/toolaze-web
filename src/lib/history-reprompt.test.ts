import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildHistoryRecreateHref,
  buildHistoryRepromptPayload,
  getDisplayImagePreviewUrl,
  getHistoryReferenceImageUrls,
  getOriginalHistoryInputImageUrls,
  getReferencePreviewUrl,
  shouldUseGenericImageGeneratorForHistoryRecreate,
  splitDualUploadReferenceImageUrls,
} from './history-reprompt'

test('routes image history Recreate to the localized generic image generator', () => {
  assert.equal(
    buildHistoryRecreateHref({ mediaType: 'image', model: 'flux-2-pro' }, 'en'),
    '/ai-image-generator?model=flux-2-pro',
  )
  assert.equal(
    buildHistoryRecreateHref({ mediaType: 'image', model: 'gpt-image-1-5' }, 'zh-TW'),
    '/zh-TW/ai-image-generator?model=gpt-image-1-5',
  )
})

test('routes video history Recreate to the localized generic video generator', () => {
  assert.equal(
    buildHistoryRecreateHref({ mediaType: 'video', model: 'grok-1-5-video' }, 'ja'),
    '/ja/ai-video-generator',
  )
})

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
    mode: 'image-to-image',
  })
})

test('splits dual-upload Recreate references into person and clothing slots', () => {
  const inputUrls = [
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/person.webp',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/bikini-reference.webp',
  ]

  assert.deepEqual(splitDualUploadReferenceImageUrls(inputUrls, true), {
    personImageUrls: [inputUrls[0]],
    secondaryReferenceImageUrls: [inputUrls[1]],
  })
})

test('keeps normal Recreate references in the primary upload slot', () => {
  const inputUrls = [
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/reference-one.webp',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/reference-two.webp',
  ]

  assert.deepEqual(splitDualUploadReferenceImageUrls(inputUrls, false), {
    personImageUrls: inputUrls,
    secondaryReferenceImageUrls: [],
  })
})

test('redirects cross-tool image Recreate from wrapped tool pages to generic image generator', () => {
  const photoRestorationItem = {
    ...baseHistoryItem,
    toolSlug: 'photo-restoration',
    sourcePath: '/photo-restoration',
  }

  assert.equal(
    shouldUseGenericImageGeneratorForHistoryRecreate('/ai-bikini-generator', photoRestorationItem),
    true,
  )
  assert.equal(
    shouldUseGenericImageGeneratorForHistoryRecreate('/zh-TW/ai-bikini-generator', {
      ...photoRestorationItem,
      toolSlug: '',
      sourcePath: '/zh-TW/photo-restoration',
    }),
    true,
  )
})

test('keeps same-tool and generic image Recreate on the current page', () => {
  assert.equal(
    shouldUseGenericImageGeneratorForHistoryRecreate('/ai-bikini-generator', {
      ...baseHistoryItem,
      toolSlug: 'ai-bikini-generator',
      sourcePath: '/ai-bikini-generator',
    }),
    false,
  )
  assert.equal(
    shouldUseGenericImageGeneratorForHistoryRecreate('/ai-image-generator', {
      ...baseHistoryItem,
      toolSlug: 'photo-restoration',
      sourcePath: '/photo-restoration',
    }),
    false,
  )
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

test('keeps text-to-image Recreate as text-to-image when no original input exists', () => {
  assert.deepEqual(getHistoryReferenceImageUrls(baseHistoryItem), [baseHistoryItem.outputUrl])
  assert.deepEqual(buildHistoryRepromptPayload(baseHistoryItem), {
    prompt: baseHistoryItem.prompt,
    imageUrls: [],
    modelId: baseHistoryItem.model,
    aspectRatio: baseHistoryItem.aspectRatio,
    resolution: baseHistoryItem.resolution,
    outputFormat: baseHistoryItem.outputFormat,
    mode: 'text-to-image',
  })
})

test('keeps image-to-image Recreate tied to original input references', () => {
  const item = {
    ...baseHistoryItem,
    inputUrls: [
      'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/reference-one.png',
    ],
  }

  assert.deepEqual(buildHistoryRepromptPayload(item), {
    prompt: item.prompt,
    imageUrls: item.inputUrls,
    modelId: item.model,
    aspectRatio: item.aspectRatio,
    resolution: item.resolution,
    outputFormat: item.outputFormat,
    mode: 'image-to-image',
  })
})

test('uses input preview as the original input image for Recreate when input urls are missing', () => {
  const item = {
    ...baseHistoryItem,
    inputUrls: [],
    inputPreview: '/ai-hairstyle-changer/default-reference.png',
  }

  assert.deepEqual(getOriginalHistoryInputImageUrls(item), ['/ai-hairstyle-changer/default-reference.png'])
})

test('uses wrapped hair tool default references for older image-to-image history without input urls', () => {
  const hairstyleItem = {
    ...baseHistoryItem,
    inputUrls: [],
    inputPreview: '',
    toolSlug: 'ai-hairstyle-changer',
    sourcePath: '/ai-hairstyle-changer',
  }
  const hairColorItem = {
    ...baseHistoryItem,
    inputUrls: [],
    inputPreview: '',
    toolSlug: '',
    sourcePath: '/zh-TW/ai-hair-color-changer',
  }

  assert.deepEqual(getOriginalHistoryInputImageUrls(hairstyleItem), ['/ai-hairstyle-changer/default-reference.png'])
  assert.deepEqual(getHistoryReferenceImageUrls(hairstyleItem), ['/ai-hairstyle-changer/default-reference.png'])
  assert.deepEqual(getOriginalHistoryInputImageUrls(hairColorItem), ['/ai-hair-color-changer/default-reference.png'])
  assert.deepEqual(getHistoryReferenceImageUrls(hairColorItem), ['/ai-hair-color-changer/default-reference.png'])
})

test('does not fall back to output image for Recreate when no original input exists', () => {
  assert.deepEqual(getOriginalHistoryInputImageUrls(baseHistoryItem), [])
})

test('keeps remote R2 display URLs direct to avoid optimizer failures', () => {
  const previewUrl = getDisplayImagePreviewUrl(baseHistoryItem.outputUrl, 384)

  assert.equal(previewUrl, baseHistoryItem.outputUrl)
  assert.equal(baseHistoryItem.outputUrl.includes('/_next/image'), false)
})

test('creates a small display URL for same-origin images', () => {
  const previewUrl = getDisplayImagePreviewUrl('/ai-hair-color-changer/default-reference-preview.webp', 384)

  assert.match(previewUrl, /^\/_next\/image\?/)
  assert.match(previewUrl, /w=384/)
})

test('keeps blob and data URLs unchanged for local browser previews', () => {
  assert.equal(getDisplayImagePreviewUrl('blob:http://localhost/image-id', 128), 'blob:http://localhost/image-id')
  assert.equal(getDisplayImagePreviewUrl('data:image/png;base64,abc', 128), 'data:image/png;base64,abc')
})

test('uses retina-friendly reference thumbnails for upload previews', () => {
  const previewUrl = getReferencePreviewUrl('/ai-hairstyle-changer/default-reference.png')

  assert.match(previewUrl, /^\/_next\/image\?/)
  assert.match(previewUrl, /w=384/)
})

test('uses the optimized hair color thumbnail asset at retina-friendly size', () => {
  const previewUrl = getReferencePreviewUrl('/ai-hair-color-changer/default-reference.png')

  assert.match(previewUrl, /default-reference-preview\.webp/)
  assert.match(previewUrl, /w=384/)
})
