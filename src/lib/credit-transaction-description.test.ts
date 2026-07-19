import assert from 'node:assert/strict'
import test from 'node:test'
import { formatCreditTransactionDescription } from './credit-transaction-description'

test('formats internal credit transaction descriptions for users', () => {
  assert.equal(formatCreditTransactionDescription('credit_purchase'), 'Credit Purchase')
  assert.equal(formatCreditTransactionDescription('new_user_bonus'), 'New User Bonus')
  assert.equal(formatCreditTransactionDescription('image_generation_refund'), 'Image Generation Refund')
  assert.equal(formatCreditTransactionDescription('Starter Credit Purchase'), 'Starter Credit Purchase')
  assert.equal(formatCreditTransactionDescription('Creator credit purchase'), 'Creator Credit Purchase')
  assert.equal(formatCreditTransactionDescription('GPT Image 2 text-to-image generation'), 'GPT Image 2 Text To Image Generation')
  assert.equal(formatCreditTransactionDescription('Daily check-in reward (Day 1)'), 'Daily Check In Reward (Day 1)')
})
