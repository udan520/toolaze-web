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

test('mobile account menu shows two recent credit records while desktop keeps three', () => {
  assert.match(source, /const renderCreditTransactions = \(variant: 'desktop' \| 'mobile' = 'desktop'\)/)
  assert.match(source, /const transactionLimit = variant === 'mobile' \? 2 : 3/)
  assert.match(source, /creditSummary\.transactions\.slice\(0, transactionLimit\)/)
  assert.match(source, /renderCreditTransactions\(variant\)/)
})
