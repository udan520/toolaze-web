import assert from 'node:assert/strict'
import test from 'node:test'
import {
  calculateImageGenerationCredits,
  calculateVideoGenerationCredits,
  VIDEO_GENERATION_CREDIT_RATES,
} from './generation-credits'

test('Kissing Grok Video uses the same credits as Grok 1.5 Video', () => {
  for (const [resolution, duration] of [
    ['480p', 3],
    ['480p', 5],
    ['720p', 8],
    ['720p', 10],
  ] as const) {
    assert.equal(
      calculateImageGenerationCredits('grok-video-1-5', resolution, duration),
      calculateVideoGenerationCredits('grok-1-5-video', resolution, duration),
    )
  }
})

test('Veo 3.1 model variants use mapped per-video pricing', () => {
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-lite'].ratesByResolution['720p'], 45)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-fast'].ratesByResolution['1080p'], 100)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-quality'].ratesByResolution['720p'], 375)
  assert.equal(calculateVideoGenerationCredits('veo-3-1-lite', '720p', 8), 45)
  assert.equal(calculateVideoGenerationCredits('veo-3-1-fast', '1080p', 8), 100)
  assert.equal(calculateVideoGenerationCredits('veo-3-1-quality', '720p', 4), 375)
})

test('Seedance 1.0 Pro Fast uses fixed credits for each supported output spec', () => {
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '720p', 5), 24)
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '720p', 10), 54)
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '1080p', 5), 54)
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '1080p', 10), 108)
})

test('GPT Image 1.5 and Flux 2 use explicit Toolaze product credits', () => {
  assert.equal(calculateImageGenerationCredits('gpt-image-1-5', 'medium'), 15)
  assert.equal(calculateImageGenerationCredits('gpt-image-1-5', 'high'), 25)
  assert.equal(calculateImageGenerationCredits('flux-2-pro', '1K'), 15)
  assert.equal(calculateImageGenerationCredits('flux-2-pro', '2K'), 25)
  assert.equal(calculateImageGenerationCredits('flux-2-flex', '1K'), 20)
  assert.equal(calculateImageGenerationCredits('flux-2-flex', '2K'), 30)
})
