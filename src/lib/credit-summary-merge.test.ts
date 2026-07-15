import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeCreditSummaryUpdate } from './credit-summary-merge'

test('preserves credit history when a balance-only update has no transactions', () => {
  const current = {
    balance: 1000,
    transactions: [
      {
        id: 'credit_txn_existing',
        amount: 10,
        balanceAfter: 1000,
        description: 'New user bonus',
        createdAt: '2026-07-15T03:00:00.000Z',
      },
    ],
  }

  const next = mergeCreditSummaryUpdate(current, {
    balance: 990,
    transactions: [],
  })

  assert.equal(next.balance, 990)
  assert.deepEqual(next.transactions, current.transactions)
})

test('uses fresh credit transactions when the update includes them', () => {
  const current = {
    balance: 1000,
    transactions: [
      {
        id: 'credit_txn_existing',
        amount: 10,
        balanceAfter: 1000,
        description: 'New user bonus',
        createdAt: '2026-07-15T03:00:00.000Z',
      },
    ],
  }
  const freshTransactions = [
    {
      id: 'credit_txn_use',
      amount: -10,
      balanceAfter: 990,
      description: 'GPT Image 2 text-to-image generation',
      createdAt: '2026-07-15T03:01:00.000Z',
    },
  ]

  const next = mergeCreditSummaryUpdate(current, {
    balance: 990,
    transactions: freshTransactions,
  })

  assert.equal(next.balance, 990)
  assert.deepEqual(next.transactions, freshTransactions)
})
