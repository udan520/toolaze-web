import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./status.js', import.meta.url), 'utf8')

test('video status persists succeeded and failed terminal states', () => {
  assert.match(source, /updateGenerationAttemptStatus/)
  assert.match(source, /status === 'FAILED'/)
  assert.match(source, /status:\s*'failed'/)
  assert.match(source, /status === 'SUCCEEDED'/)
  assert.match(source, /status:\s*'succeeded'/)
  assert.match(source, /outputUrl:\s*videoUrl/)
})
