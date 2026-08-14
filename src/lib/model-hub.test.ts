import assert from 'node:assert/strict'
import test from 'node:test'
import { AI_VIDEO_GENERATOR_MODEL_OPTIONS } from './ai-video-generator-config'
import { AI_IMAGE_GENERATOR_MODEL_OPTIONS } from './ai-image-generator-config'
import { getModelHubModels, MODEL_HUB_MODELS } from './model-hub'
import { MODEL_PAGE_LOCALES, getModelPageCopy } from '@/app/model/copy'

test('AI Models hub includes every model available in the shared video generator', () => {
  const hubVideoNames = new Set(
    MODEL_HUB_MODELS
      .filter((model) => model.category === 'video')
      .map((model) => model.name)
  )

  assert.deepEqual(
    AI_VIDEO_GENERATOR_MODEL_OPTIONS
      .map((model) => model.name)
      .filter((name) => !hubVideoNames.has(name)),
    []
  )
})

test('AI Models hub includes every image model available in the shared image generator', () => {
  const hubImageNames = new Set(
    MODEL_HUB_MODELS
      .filter((model) => model.category === 'image')
      .map((model) => model.name),
  )

  assert.deepEqual(
    AI_IMAGE_GENERATOR_MODEL_OPTIONS
      .filter((model) => model.id !== 'grok-video-1-5')
      .map((model) => model.name)
      .filter((name) => !hubImageNames.has(name)),
    [],
  )
})

test('AI Models hub places Seedance 2.5 before every other video model', () => {
  const videoModels = getModelHubModels('video')

  assert.equal(videoModels[0]?.href, '/model/seedance-2-5')
  assert.equal(videoModels.filter((model) => model.href === '/model/seedance-2-5').length, 1)
  assert.equal(videoModels.filter((model) => model.name === 'Seedance 2.5').length, 1)
  assert.ok(videoModels.findIndex((model) => model.href === '/model/seedance-2-5') < videoModels.findIndex((model) => model.href === '/model/seedance-2'))
})

test('AI Models hub cards link directly to canonical model URLs', () => {
  for (const locale of MODEL_PAGE_LOCALES) {
    for (const card of getModelPageCopy(locale).cards) {
      assert.match(card.href, /^\/model\//, `${locale} card ${card.title} must use its canonical model URL`)
    }
  }
})
