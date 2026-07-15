import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatCreditTransactionTimestamp,
  formatLocalTimestampToSeconds,
} from './credit-history-time'

test('formats credit transaction timestamps down to seconds', () => {
  const value = new Date(2026, 6, 14, 4, 31, 28).toISOString()

  assert.equal(formatCreditTransactionTimestamp(value), '2026-07-14 04:31:28')
  assert.equal(formatLocalTimestampToSeconds(value), '2026-07-14 04:31:28')
})

test('returns empty text for invalid credit transaction timestamps', () => {
  assert.equal(formatCreditTransactionTimestamp('not-a-date'), '')
  assert.equal(formatLocalTimestampToSeconds('not-a-date'), '')
})
