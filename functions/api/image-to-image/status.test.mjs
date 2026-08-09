import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const createSource = readFileSync(new URL('../image-to-image.js', import.meta.url), 'utf8')
const statusSource = readFileSync(new URL('./status.js', import.meta.url), 'utf8')

test('image generation persists the credit metadata required to resume polling', () => {
  assert.match(createSource, /createGenerationAttempt[\s\S]*requiredCredits:\s*creditContext\.requiredCredits/)
  assert.match(createSource, /attachGenerationAttemptTask[\s\S]*requiredCredits:\s*creditContext\.requiredCredits/)
})
test('image status persists succeeded and failed terminal states', () => {
  assert.match(statusSource, /status === 'FAILED'/)
  assert.match(statusSource, /status:\s*'failed'/)
  assert.match(statusSource, /status === 'SUCCEEDED'/)
  assert.match(statusSource, /status:\s*'succeeded'/)
  assert.match(statusSource, /outputUrl:\s*resultUrl/)
})
