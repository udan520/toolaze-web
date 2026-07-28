import assert from 'node:assert/strict'
import test from 'node:test'
import { AI_TOOLS_LOCALES, getAiToolsPageCopy } from './copy'

const expectedRoutes = [
  '/ai-image-generator',
  '/text-to-image-generator',
  '/ai-image-to-image-generator',
  '/ai-video-generator',
  '/text-to-video-generator',
  '/image-to-video-generator',
  '/world-cup-ai-image-generator',
  '/ai-couple-photo-maker',
  '/ai-baby-generator',
  '/ai-dance-generator',
  '/ai-kissing-video-generator',
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
    assert.equal(cards.filter((card) => card.category === 'video').length, 5)
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

test('Photo Restoration cards use the shared page demo image instead of the old stock photo', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const restorationCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/photo-restoration')

    assert.ok(restorationCard, `${locale} is missing Photo Restoration`)
    assert.equal(restorationCard.image, 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/photo-restoration-demo-before-after.webp')
    assert.doesNotMatch(restorationCard.image, /images\.unsplash\.com/)
  }
})

test('Watermark Remover cards use the shared page demo image instead of the old stock photo', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const watermarkCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/watermark-remover')

    assert.ok(watermarkCard, `${locale} is missing Watermark Remover`)
    assert.equal(watermarkCard.image, 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/watermark-remover-demo-before-after.webp')
    assert.doesNotMatch(watermarkCard.image, /images\.unsplash\.com/)
  }
})
