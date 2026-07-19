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

test('pricing buy credits button click is tracked with clear naming and plan context', () => {
  assert.match(buttonSource, /trackToolazeEvent\('pricing_buy_credits_button_click'/)
  assert.match(buttonSource, /plan_id:\s*planId/)
  assert.match(buttonSource, /plan_credits:\s*credits/)
  assert.match(buttonSource, /plan_price:\s*price/)
  assert.match(buttonSource, /page_path/)
  assert.ok(
    buttonSource.indexOf("trackToolazeEvent('pricing_buy_credits_button_click'") <
      buttonSource.indexOf("fetch('/api/billing/checkout'"),
    'buy credits click should be tracked before checkout request starts',
  )
  assert.doesNotMatch(buttonSource, /email|userId|balance/)
})
