import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatCreditTransactionType,
  getCreditTransactionBadgeClass,
} from './credit-transaction-badge'

const labels = {
  grant: 'Bonus',
  use: 'Used',
  refund: 'Refund',
  purchase: 'Purchase',
  adjustment: 'Adjustment',
}

test('credit badges use the shared user-facing type labels', () => {
  assert.equal(formatCreditTransactionType('bonus', labels), 'Bonus')
  assert.equal(formatCreditTransactionType('use', labels), 'Used')
  assert.equal(formatCreditTransactionType('refund', labels), 'Refund')
  assert.equal(formatCreditTransactionType('purchase', labels), 'Purchase')
})

test('credit badge colors match the product credit history rules', () => {
  assert.match(getCreditTransactionBadgeClass('use'), /emerald/)
  assert.match(getCreditTransactionBadgeClass('refund'), /orange/)
  assert.match(getCreditTransactionBadgeClass('grant'), /indigo/)
  assert.match(getCreditTransactionBadgeClass('bonus'), /indigo/)
  assert.match(getCreditTransactionBadgeClass('purchase'), /indigo/)
  assert.match(getCreditTransactionBadgeClass('adjustment'), /slate/)
})
