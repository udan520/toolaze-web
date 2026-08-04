import assert from 'node:assert/strict'
import test from 'node:test'
import {
  AI_IMAGE_GENERATOR_GROUPS,
  AI_IMAGE_GENERATOR_MODELS,
} from './ai-image-generator-config'

test('GPT Image 1.5 exposes the exact KIE models and quality contract', () => {
  const model = AI_IMAGE_GENERATOR_MODELS['gpt-image-1-5']

  assert.equal(model.providerModels.textToImage, 'gpt-image/1.5-text-to-image')
  assert.equal(model.providerModels.imageToImage, 'gpt-image/1.5-image-to-image')
  assert.deepEqual(model.setting.options, ['medium', 'high'])
  assert.equal(model.setting.kind, 'quality')
  assert.equal(model.maxImages, 16)
  assert.deepEqual(model.aspectRatios.map(({ value }) => value), ['1:1', '2:3', '3:2'])
})

test('Flux 2 Pro and Flex expose text and image KIE models', () => {
  assert.equal(
    AI_IMAGE_GENERATOR_MODELS['flux-2-pro'].providerModels.textToImage,
    'flux-2/pro-text-to-image',
  )
  assert.equal(
    AI_IMAGE_GENERATOR_MODELS['flux-2-pro'].providerModels.imageToImage,
    'flux-2/pro-image-to-image',
  )
  assert.equal(
    AI_IMAGE_GENERATOR_MODELS['flux-2-flex'].providerModels.textToImage,
    'flux-2/flex-text-to-image',
  )
  assert.equal(
    AI_IMAGE_GENERATOR_MODELS['flux-2-flex'].providerModels.imageToImage,
    'flux-2/flex-image-to-image',
  )

  for (const id of ['flux-2-pro', 'flux-2-flex'] as const) {
    const model = AI_IMAGE_GENERATOR_MODELS[id]
    assert.equal(model.setting.kind, 'resolution')
    assert.deepEqual(model.setting.options, ['1K', '2K'])
    assert.equal(model.maxImages, 8)
    assert.equal(model.maxFileSizeMb, 10)
  }
})

test('new image models are grouped under OpenAI and Flux', () => {
  const openAi = AI_IMAGE_GENERATOR_GROUPS.find(({ id }) => id === 'openai-gpt')
  const flux = AI_IMAGE_GENERATOR_GROUPS.find(({ id }) => id === 'flux')

  assert.ok(openAi?.modelIds.includes('gpt-image-1-5'))
  assert.deepEqual(flux?.modelIds, ['flux-2-pro', 'flux-2-flex'])
})

test('Nano Banana 2 Lite exposes the KIE 1K-only workflow contract', () => {
  const model = AI_IMAGE_GENERATOR_MODELS['nano-banana-2-lite']
  const group = AI_IMAGE_GENERATOR_GROUPS.find(({ id }) => id === 'nano-banana')

  assert.equal(model.name, 'Nano Banana 2 Lite')
  assert.equal(model.vendor, 'Google')
  assert.equal(model.defaultMode, 'image-to-image')
  assert.equal(model.maxImages, 10)
  assert.equal(model.maxFileSizeMb, 30)
  assert.equal(model.supportsOutputFormat, true)
  assert.equal(model.supportsHighResolution, false)
  assert.equal(model.setting.kind, 'resolution')
  assert.deepEqual(model.setting.options, ['1K'])
  assert.deepEqual(group?.modelIds, ['nano-banana-pro', 'nano-banana-2', 'nano-banana-2-lite'])
})

test('Grok Image exposes separate official KIE text and image provider models', () => {
  const model = AI_IMAGE_GENERATOR_MODELS['grok-1-5-image']

  assert.equal(model.providerModels.textToImage, 'grok-imagine/text-to-image')
  assert.equal(model.providerModels.imageToImage, 'grok-imagine/image-to-image')
})

test('image generator page capabilities match the audited KIE model matrix', () => {
  const values = (id: keyof typeof AI_IMAGE_GENERATOR_MODELS) =>
    AI_IMAGE_GENERATOR_MODELS[id].aspectRatios.map(({ value }) => value)

  assert.deepEqual(values('gpt-image-2'), [
    'auto',
    '1:1',
    '3:2',
    '2:3',
    '4:3',
    '3:4',
    '5:4',
    '4:5',
    '16:9',
    '9:16',
    '2:1',
    '1:2',
    '3:1',
    '1:3',
    '21:9',
    '9:21',
  ])

  const grokImage = AI_IMAGE_GENERATOR_MODELS['grok-1-5-image']
  assert.equal(grokImage.maxFileSizeMb, 10)
  assert.equal(grokImage.supportsHighResolution, false)
  assert.deepEqual(grokImage.setting.options, ['1K'])
  assert.deepEqual(values('grok-1-5-image'), ['1:1', '2:3', '3:2', '16:9', '9:16'])

  const grokVideo = AI_IMAGE_GENERATOR_MODELS['grok-video-1-5']
  assert.equal(grokVideo.maxImages, 7)
  assert.equal(grokVideo.maxFileSizeMb, 20)
  assert.deepEqual(values('grok-video-1-5'), ['auto', '1:1', '16:9', '9:16', '3:2', '2:3'])

  assert.equal(AI_IMAGE_GENERATOR_MODELS['nano-banana-2'].maxImages, 14)
  assert.equal(AI_IMAGE_GENERATOR_MODELS['nano-banana-2-lite'].maxImages, 10)
  assert.equal(AI_IMAGE_GENERATOR_MODELS['seedream-5-0-pro'].maxImages, 10)
  assert.deepEqual(values('wan-2-7-image'), ['1:1', '16:9', '4:3', '21:9', '3:4', '9:16', '8:1', '1:8'])
})
