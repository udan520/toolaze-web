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

test('Veo 3.1 model variants use video cost-times-two per-video pricing', () => {
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-lite'].ratesByResolution['720p'], 30)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-fast'].ratesByResolution['1080p'], 75)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-quality'].ratesByResolution['720p'], 450)
  assert.equal(calculateVideoGenerationCredits('veo-3-1-lite', '720p', 8), 30)
  assert.equal(calculateVideoGenerationCredits('veo-3-1-fast', '1080p', 8), 75)
  assert.equal(calculateVideoGenerationCredits('veo-3-1-quality', '720p', 4), 450)
})

test('video pricing rounds cost-times-two credits to the nearest integer', () => {
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['infinitalk'].ratesByResolution['480p'], 6)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['infinitalk'].ratesByResolution['720p'], 24)
  assert.equal(calculateVideoGenerationCredits('infinitalk', '480p', 15), 90)
  assert.equal(calculateVideoGenerationCredits('infinitalk', '480p', 14.5), 90)
  assert.equal(calculateVideoGenerationCredits('infinitalk', '720p', 15), 360)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['grok-1-5-video'].ratesByResolution['480p'], 3)
  assert.equal(calculateVideoGenerationCredits('grok-1-5-video', '480p', 5), 15)
  assert.equal(calculateVideoGenerationCredits('grok-1-5-video', '480p', 3), 9)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini'].ratesByResolution['480p'], 19)
  assert.equal(calculateVideoGenerationCredits('seedance-2-mini', '480p', 5), 95)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-1-lite'].ratesByResolution['720p'], 9)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['pixverse-v6'].ratesByResolution['540p'], 11)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['pixverse-v6'].ratesByResolution['720p'], 14)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['pixverse-v6'].ratesByResolution['1080p'], 29)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['pixverse-v6'].nativeAudioRatesByResolution?.['720p'], 19)
  assert.equal(calculateVideoGenerationCredits('pixverse-v6', '720p', 5), 70)
  assert.equal(calculateVideoGenerationCredits('pixverse-v6', '720p', 5, { nativeAudio: true }), 95)
})

test('video pricing never moves 9-credit totals to the next ten', () => {
  assert.equal(calculateVideoGenerationCredits('grok-1-5-video', '480p', 3), 9)
  assert.equal(calculateVideoGenerationCredits('seedance-2-mini', '480p', 1), 19)
  assert.equal(calculateVideoGenerationCredits('pixverse-v6', '1080p', 1), 29)
})

test('Seedance 2.5 prices video references from input plus output duration', () => {
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2-5'].ratesByResolution['480p'], 56)
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2-5'].ratesByResolution['720p'], 126)
  assert.deepEqual(VIDEO_GENERATION_CREDIT_RATES['seedance-2-5'].referenceVideoRatesByResolution, {
    '480p': 34,
    '720p': 76,
  })
  assert.equal(calculateVideoGenerationCredits('seedance-2-5', '480p', 4), 224)
  assert.equal(calculateVideoGenerationCredits('seedance-2-5', '480p', 4, { nativeAudio: true }), 224)
  assert.equal(calculateVideoGenerationCredits('seedance-2-5', '720p', 10), 1260)
  assert.equal(calculateVideoGenerationCredits('seedance-2-5', '480p', 4, { referenceVideoDuration: 6 }), 340)
  assert.equal(calculateVideoGenerationCredits('seedance-2-5', '720p', 10, { referenceVideoDuration: 12.2 }), 1748)
  assert.equal(calculateVideoGenerationCredits('kling-2-6-motion-control', '720p', 12, { referenceVideoDuration: 8 }), 264)
})

test('image pricing moves 9-credit results to the next ten', () => {
  assert.equal(calculateImageGenerationCredits('nano-banana-2-lite', '1K'), 10)
  assert.equal(calculateImageGenerationCredits('gpt-image-2', '1K'), 10)
})

test('Seedance 1.0 Pro Fast uses fixed credits for each supported output spec', () => {
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '720p', 5), 32)
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '720p', 10), 72)
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '1080p', 5), 72)
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '1080p', 10), 144)
})

test('GPT Image 1.5 and Flux 2 use KIE cost times three credits', () => {
  assert.equal(calculateImageGenerationCredits('gpt-image-1-5', 'medium'), 12)
  assert.equal(calculateImageGenerationCredits('gpt-image-1-5', 'high'), 66)
  assert.equal(calculateImageGenerationCredits('flux-2-pro', '1K'), 15)
  assert.equal(calculateImageGenerationCredits('flux-2-pro', '2K'), 21)
  assert.equal(calculateImageGenerationCredits('flux-2-flex', '1K'), 42)
  assert.equal(calculateImageGenerationCredits('flux-2-flex', '2K'), 72)
})
