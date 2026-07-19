import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const resultSource = readFileSync('src/app/pricing/PricingCheckoutResult.tsx', 'utf8')

test('checkout success refreshes full auth state before notifying credit consumers', () => {
  assert.match(resultSource, /fetch\('\/api\/auth\/me'/)
  assert.match(resultSource, /credentials:\s*'include'/)
  assert.match(resultSource, /toolaze:credits-updated/)
  assert.match(resultSource, /authPayload\?\.credits/)
})

test('checkout success uses the global timed top notice instead of a persistent success card', () => {
  assert.match(resultSource, /toolaze:top-notice/)
  assert.match(resultSource, /Purchase Successful/)
  assert.doesNotMatch(resultSource, /Credits Added Successfully/)
  assert.match(resultSource, /type:\s*'success'/)
  assert.match(resultSource, /celebration:\s*true/)
  assert.doesNotMatch(resultSource, /Start Generating/)
  assert.doesNotMatch(resultSource, /href="\/ai-image-generator"/)
  assert.doesNotMatch(resultSource, /Checkout success page/)
})

test('checkout confirmation still shows a local error card when confirmation fails', () => {
  assert.match(resultSource, /Checkout Could Not Be Confirmed/)
  assert.match(resultSource, /role=\{state === 'failed' \? 'alert' : 'status'\}/)
})
