import assert from 'node:assert/strict'
import test from 'node:test'
import { formatCreditTransactionSupplement, formatCreditTransactionTitle } from './credit-transaction-description'
import { enrichCreditSummaryWithHistory } from './credit-summary-display'

test('enriches account dropdown credit history with wrapped landing page tool labels', async () => {
  const credits = {
    balance: 9810,
    transactions: [
      {
        id: 'credit-use-1',
        amount: -10,
        balanceAfter: 9810,
        reason: 'image_generation',
        description: 'Seedream 5.0 Lite image-to-image generation',
        createdAt: '2026-07-28T13:34:26.000Z',
      },
    ],
  }

  const enriched = await enrichCreditSummaryWithHistory(credits, async () => ({
    ok: true,
    json: async () => ({
      items: [
        {
          model: 'seedream-5-0-lite',
          toolSlug: 'ai-clothes-changer',
          sourcePath: '/ai-clothes-changer',
          inputUrls: ['https://example.com/person.webp', 'https://example.com/clothes.webp'],
          createdAt: '2026-07-28T13:34:28.000Z',
        },
      ],
    }),
  }))

  assert.equal(formatCreditTransactionTitle(enriched.transactions[0]), 'Clothes Changer')
  assert.equal(formatCreditTransactionSupplement(enriched.transactions[0]), 'Seedream 5.0 Lite')
})
