import assert from 'node:assert/strict'
import test from 'node:test'
import { createOptimisticCreditDeduction } from './optimistic-credits'

test('creates an optimistic credit summary after deduction', () => {
  const result = createOptimisticCreditDeduction(JSON.stringify({
    user: { id: 'local-dev-user' },
    credits: {
      balance: 1000,
      transactions: [{ id: 'bonus', amount: 1000 }],
    },
  }), 10)

  assert.equal(result?.previous.balance, 1000)
  assert.equal(result?.next.balance, 990)
  assert.equal(result?.next.transactions.length, 1)
})

test('skips optimistic deduction when cached credits are missing or too low', () => {
  assert.equal(createOptimisticCreditDeduction(null, 10), null)
  assert.equal(createOptimisticCreditDeduction(JSON.stringify({ credits: { balance: 5 } }), 10), null)
})
