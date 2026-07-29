import assert from 'node:assert/strict'
import test from 'node:test'
import { AI_VIDEO_GENERATOR_MODEL_OPTIONS } from './ai-video-generator-config'
import { AI_IMAGE_GENERATOR_MODEL_OPTIONS } from './ai-image-generator-config'
import { MODEL_HUB_MODELS } from './model-hub'

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
