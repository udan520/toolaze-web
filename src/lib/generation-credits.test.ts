import assert from 'node:assert/strict'
import test from 'node:test'
import {
  calculateImageGenerationCredits,
  calculateVideoGenerationCredits,
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
