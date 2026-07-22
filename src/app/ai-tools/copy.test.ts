import assert from 'node:assert/strict'
import test from 'node:test'
import { AI_TOOLS_LOCALES, getAiToolsPageCopy } from './copy'

const expectedRoutes = [
  '/ai-image-generator',
  '/text-to-image-generator',
  '/ai-image-to-image-generator',
  '/ai-video-generator',
  '/world-cup-ai-image-generator',
  '/ai-couple-photo-maker',
  '/ai-baby-generator',
  '/ai-dance-generator',
  '/ai-hairstyle-changer',
  '/ai-hair-color-changer',
  '/watermark-remover',
  '/photo-restoration',
]

test('AI Tools hub includes every global AI tool in every locale', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const cards = getAiToolsPageCopy(locale).cards
    assert.deepEqual(cards.map((card) => card.href), expectedRoutes, `${locale} has missing or mismatched tools`)
    assert.equal(cards.filter((card) => card.category === 'image').length, 10)
    assert.equal(cards.filter((card) => card.category === 'video').length, 2)
  }
})

test('AI Tools hub exposes localized category labels', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const filters = getAiToolsPageCopy(locale).filters
    assert.ok(filters.all)
    assert.ok(filters.image)
    assert.ok(filters.video)
  }
})
