import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const buttonSource = readFileSync('src/app/pricing/PricingCheckoutButton.tsx', 'utf8')

test('pricing checkout can use embedded Creem checkout behind an explicit flag', () => {
  assert.match(buttonSource, /shouldUseEmbeddedCheckout/)
  assert.match(buttonSource, /openCreemEmbeddedCheckout/)
  assert.match(buttonSource, /if \(shouldUseEmbeddedCheckout\(\)\)/)
  assert.match(buttonSource, /await openCreemEmbeddedCheckout\(payload\.checkoutUrl,\s*\{/)
  assert.match(buttonSource, /onClose:\s*\(\) => setLoading\(false\)/)
})

test('pricing checkout keeps hosted redirect as the default fallback', () => {
  assert.match(buttonSource, /window\.location\.href = payload\.checkoutUrl/)
  assert.ok(
    buttonSource.indexOf('await openCreemEmbeddedCheckout(payload.checkoutUrl') <
      buttonSource.indexOf('window.location.href = payload.checkoutUrl'),
    'hosted redirect should remain after the embedded checkout branch',
  )
})
