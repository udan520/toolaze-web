import assert from 'node:assert/strict'
import test from 'node:test'
import { MODEL_HUB_MODELS, getModelHubModels } from './model-hub'

const expectedRoutes = [
  '/model/gpt-image-2',
  '/model/seedream-5-0-pro',
  '/model/nano-banana-pro',
  '/model/seedream-5-0-lite',
  '/model/wan-2-7-image',
  '/model/nano-banana-2',
  '/model/seedream-4-5',
  '/model/seedance-2',
  '/model/kling-3',
  '/model/grok-imagine-video-1-5',
  '/model/seedance-2-5',
]

test('model hub includes every canonical model landing page', () => {
  assert.deepEqual(MODEL_HUB_MODELS.map((model) => model.href), expectedRoutes)
})

test('model hub filters image and video models without losing the quality order', () => {
  for (const category of ['all', 'image', 'video'] as const) {
    const models = getModelHubModels(category)

    if (category !== 'all') {
      assert.ok(models.every((model) => model.category === category))
    }

    const ratings = models
      .map((model) => model.qualityRating)
      .filter((rating): rating is number => rating !== null)

    assert.deepEqual(ratings, [...ratings].sort((left, right) => right - left))
    const unrankedIndex = models.findIndex((model) => model.qualityRating === null)
    if (unrankedIndex !== -1) {
      assert.equal(unrankedIndex, models.length - 1)
    }
  }
})
