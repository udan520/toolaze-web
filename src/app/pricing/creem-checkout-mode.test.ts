import assert from 'node:assert/strict'
import test from 'node:test'
import { shouldUseEmbeddedCheckout } from './creem-checkout-mode'

test('Creem embedded checkout is disabled unless explicitly enabled', () => {
  assert.equal(shouldUseEmbeddedCheckout(undefined), false)
  assert.equal(shouldUseEmbeddedCheckout(''), false)
  assert.equal(shouldUseEmbeddedCheckout('hosted'), false)
  assert.equal(shouldUseEmbeddedCheckout('embedded'), true)
})
