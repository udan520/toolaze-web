import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CREDIT_TRANSACTION_TABS,
  filterCreditTransactions,
  type CreditTransactionForTabs,
} from './credit-transaction-tabs'

const transactions: CreditTransactionForTabs[] = [
  { id: 'signup', type: 'grant', amount: 10, reason: 'new_user_bonus' },
  { id: 'check-in', type: 'grant', amount: 5, reason: 'daily_checkin' },
  { id: 'x-post', type: 'grant', amount: 10, reason: 'x_post_reward' },
  { id: 'admin', type: 'grant', amount: 100, reason: 'admin_grant' },
  { id: 'refund', type: 'refund', amount: 8, reason: 'image_generation_refund' },
  { id: 'generation', type: 'use', amount: -10, reason: 'image_generation' },
  { id: 'legacy-purchase', type: 'bonus', amount: 1000, description: 'Creator Credit Purchase' },
  { id: 'purchase', type: 'purchase', amount: 1000, reason: 'credit_purchase' },
]

test('credit activity tabs expose the user-facing categories in order', () => {
  assert.deepEqual(
    CREDIT_TRANSACTION_TABS.map((tab) => [tab.id, tab.label]),
    [
      ['all', 'All'],
      ['obtained', 'Obtained'],
      ['used', 'Used'],
      ['purchases', 'Purchases'],
    ],
  )
})

test('credit activity tabs classify obtained, used, and purchase records', () => {
  assert.deepEqual(filterCreditTransactions(transactions, 'all').map((item) => item.id), [
    'signup',
    'check-in',
    'x-post',
    'admin',
    'refund',
    'generation',
    'legacy-purchase',
    'purchase',
  ])
  assert.deepEqual(filterCreditTransactions(transactions, 'obtained').map((item) => item.id), [
    'signup',
    'check-in',
    'x-post',
    'admin',
    'refund',
  ])
  assert.deepEqual(filterCreditTransactions(transactions, 'used').map((item) => item.id), [
    'generation',
  ])
  assert.deepEqual(filterCreditTransactions(transactions, 'purchases').map((item) => item.id), [
    'legacy-purchase',
    'purchase',
  ])
})
