import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { MODEL_DEMO_IMAGES, getModelDemoImage, shouldUseDirectImageForDemo } from './model-demo-images'

const projectRoot = process.cwd()

test('model demo images avoid raw generated upload PNGs that break Next image optimization', () => {
  for (const [modelId, image] of Object.entries(MODEL_DEMO_IMAGES)) {
    assert.equal(
      /\/uploads\/[a-f0-9]+\.png$/i.test(image.src),
      false,
      `${modelId} should use a stable local or compressed demo image`,
    )
  }
})

test('local model demo images exist under public assets', () => {
  for (const [modelId, image] of Object.entries(MODEL_DEMO_IMAGES)) {
    if (!image.src.startsWith('/')) continue

    const assetPath = join(projectRoot, 'public', image.src)
    assert.equal(existsSync(assetPath), true, `${modelId} missing demo asset: ${image.src}`)
  }
})

test('GPT Image 2 demo uses the stable local model asset', () => {
  assert.equal(getModelDemoImage('gpt-image-2').src, '/model-assets/gpt-image-2/prompt-product-poster.webp')
})

test('model demo images bypass Next image optimization', () => {
  for (const image of Object.values(MODEL_DEMO_IMAGES)) {
    assert.equal(shouldUseDirectImageForDemo(image.src), true, `${image.src} should render directly`)
  }
})
