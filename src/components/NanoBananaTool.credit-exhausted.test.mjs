import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./NanoBananaTool.tsx', import.meta.url), 'utf8')
const creditModalSource = source.slice(
  source.indexOf('{creditExhaustedModalOpen && ('),
  source.indexOf('{/* Toast Container */'),
)

test('credit exhausted modal relies on icon close instead of a text close action', () => {
  assert.ok(creditModalSource.includes('aria-label="Close credits dialog"'))
  assert.ok(!creditModalSource.includes('nanoText.creditsUsedUpAction'))
})
