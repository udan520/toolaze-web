import assert from 'node:assert/strict'
import test from 'node:test'
import { backfillCreditTransactionsWithHistory } from './credit-transaction-history-backfill'

test('backfills legacy credit transactions from shared generation history', () => {
  const transactions: Array<{
    id: string
    type: string
    amount: number
    balanceAfter: number
    reason: string
    description: string
    createdAt: string
    metadata?: Record<string, unknown>
  }> = [
    {
      id: 'credit_txn_1',
      type: 'use',
      amount: -10,
      balanceAfter: 1010,
      reason: 'image_generation',
      description: 'Seedream 5.0 Lite image-to-image generation',
      createdAt: '2026-07-28T00:22:18.603Z',
    },
  ]
  const [transaction] = backfillCreditTransactionsWithHistory(transactions, [
    {
      model: 'seedream-5-0-lite',
      inputUrls: ['https://example.com/person.webp', 'https://example.com/outfit.webp'],
      toolSlug: 'ai-clothes-changer',
      toolLabel: 'AI Clothes Changer',
      sourcePath: '/ai-clothes-changer',
      createdAt: '2026-07-28T00:23:14.429Z',
    },
  ])

  assert.equal(transaction.description, 'Clothes Changer')
  assert.deepEqual(transaction.metadata, {
    model: 'seedream-5-0-lite',
    modelLabel: 'Seedream 5.0 Lite',
    isImageToImage: true,
    toolSlug: 'ai-clothes-changer',
    toolLabel: 'Clothes Changer',
    sourcePath: '/ai-clothes-changer',
  })
})

test('does not backfill image credit activity from nearby video history', () => {
  const transactions: Array<{
    id: string
    type: string
    amount: number
    balanceAfter: number
    reason: string
    description: string
    createdAt: string
    metadata?: Record<string, unknown>
  }> = [
    {
      id: 'credit_txn_3',
      type: 'use',
      amount: -10,
      balanceAfter: 990,
      reason: 'image_generation',
      description: 'Image generation',
      createdAt: '2026-07-28T00:22:18.603Z',
    },
  ]

  const [transaction] = backfillCreditTransactionsWithHistory(transactions, [
    {
      mediaType: 'video',
      model: 'grok-video-1-5',
      inputUrls: ['https://example.com/source.webp'],
      toolSlug: 'ai-dance-generator',
      toolLabel: 'AI Dance Generator',
      sourcePath: '/ai-dance-generator',
      createdAt: '2026-07-28T00:22:20.000Z',
    },
    {
      mediaType: 'image',
      model: 'seedream-5-0-lite',
      inputUrls: ['https://example.com/person.webp', 'https://example.com/outfit.webp'],
      toolSlug: 'ai-clothes-changer',
      toolLabel: 'AI Clothes Changer',
      sourcePath: '/ai-clothes-changer',
      createdAt: '2026-07-28T00:24:10.000Z',
    },
  ])

  assert.equal(transaction.description, 'Clothes Changer')
  assert.equal(transaction.metadata?.modelLabel, 'Seedream 5.0 Lite')
  assert.equal(transaction.metadata?.toolLabel, 'Clothes Changer')
})

test('keeps existing wrapped tool credit metadata unchanged', () => {
  const original = {
    id: 'credit_txn_2',
    type: 'use',
    amount: -10,
    balanceAfter: 990,
    reason: 'image_generation',
    description: 'Clothes Changer',
    metadata: {
      toolLabel: 'Clothes Changer',
      modelLabel: 'Seedream 5.0 Lite',
    },
    createdAt: '2026-07-28T00:22:18.603Z',
  }

  const [transaction] = backfillCreditTransactionsWithHistory([original], [])

  assert.equal(transaction, original)
})
