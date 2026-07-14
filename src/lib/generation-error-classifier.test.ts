import assert from 'node:assert/strict'
import test from 'node:test'
import { isCreditExhaustedGenerationError } from './generation-error-classifier'

test('classifies explicit insufficient credit responses as credit exhausted', () => {
  assert.equal(
    isCreditExhaustedGenerationError(402, { error: 'Insufficient credits to generate this image.' }),
    true,
  )
  assert.equal(
    isCreditExhaustedGenerationError(403, { message: 'Your credit balance is not enough.' }),
    true,
  )
})

test('classifies zero balance responses as credit exhausted', () => {
  assert.equal(
    isCreditExhaustedGenerationError(401, { error: 'No credits remaining.', credits: { balance: 0 } }),
    true,
  )
})

test('keeps ordinary unauthorized responses as sign-in required', () => {
  assert.equal(
    isCreditExhaustedGenerationError(401, { error: 'Please sign in with Google to generate images.' }),
    false,
  )
})
