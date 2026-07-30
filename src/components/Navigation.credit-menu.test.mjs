import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')

test('recent credit activity shows its transaction type before the feature name', () => {
  assert.match(source, /type: CreditTransactionType/)
  assert.match(source, /reason: string/)
  assert.match(source, /formatCreditTransactionType\(transaction\.type, creditTypeTranslations\)/)
  assert.match(source, /getCreditTransactionBadgeClass\(transaction\.type\)/)
})
