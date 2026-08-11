import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./ai-video-generator.js', import.meta.url), 'utf8')
const clientSource = readFileSync(new URL('../../src/components/AiVideoGeneratorTool.tsx', import.meta.url), 'utf8')

test('video generation persists a resumable attempt around provider task creation', () => {
  assert.match(source, /createGenerationAttempt/)
  assert.match(source, /attachGenerationAttemptTask/)
  assert.match(source, /taskProvider:\s*modelConfig\.taskProvider/)
  assert.match(source, /requiredCredits/)
  assert.match(source, /consumptionId:\s*creditContext\.consumption\?\.consumptionId/)
})

test('video generation records failed attempts on every terminal creation failure', () => {
  assert.match(source, /updateGenerationAttemptStatus/)
  assert.match(source, /status:\s*'failed'/)
  assert.match(source, /failureReason/)
})

test('video attempts persist public History URLs instead of provider-only upload references', () => {
  assert.match(clientSource, /formData\.append\('historyInputUrls', JSON\.stringify\(\[\.\.\.imageUrls, \.\.\.motionVideoUrls, \.\.\.audioUrls\]\)\)/)
  assert.match(clientSource, /formData\.append\('historyVideoUrls', JSON\.stringify\(motionVideoUrls\)\)/)
  assert.match(clientSource, /formData\.append\('historyAudioUrls', JSON\.stringify\(audioUrls\)\)/)
  assert.match(source, /parseUrlArrayField\(formData, 'historyInputUrls'\)/)
  assert.match(source, /inputUrls:\s*historyInputUrls/)
})
