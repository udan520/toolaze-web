import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getGenerationModelLabel,
  getWrappedHairToolHistoryDisplay,
  isWrappedHairToolHistory,
} from './generation-history-display'

test('detects wrapped hair tools from tool slug and localized source path', () => {
  assert.equal(isWrappedHairToolHistory({
    toolSlug: 'ai-hairstyle-changer',
    sourcePath: '/ai-hairstyle-changer',
  }), true)
  assert.equal(isWrappedHairToolHistory({
    toolSlug: null,
    sourcePath: '/zh-TW/ai-hair-color-changer',
  }), true)
})

test('does not mark ordinary image generation history as wrapped hair tools', () => {
  assert.equal(isWrappedHairToolHistory({
    toolSlug: 'ai-image-generator',
    sourcePath: '/ai-image-generator',
  }), false)
  assert.equal(isWrappedHairToolHistory({
    toolSlug: 'model/gpt-image-2',
    sourcePath: '/model/gpt-image-2',
  }), false)
})

test('returns function label and friendly model label for wrapped hair tool history', () => {
  assert.deepEqual(getWrappedHairToolHistoryDisplay({
    model: 'gpt-image-2',
    toolSlug: 'ai-hair-color-changer',
    toolLabel: 'AI Hair Color Changer',
    sourcePath: '/ai-hair-color-changer',
  }), {
    showToolLabel: true,
    toolLabel: 'AI Hair Color Changer',
    modelLabel: 'GPT Image 2',
  })
})

test('falls back to the source path label for older wrapped hair tool history', () => {
  assert.deepEqual(getWrappedHairToolHistoryDisplay({
    model: 'gpt-image-2',
    sourcePath: '/zh-TW/ai-hairstyle-changer',
  }), {
    showToolLabel: true,
    toolLabel: 'AI Hair Style Changer',
    modelLabel: 'GPT Image 2',
  })
})

test('formats known model ids for user-facing history labels', () => {
  assert.equal(getGenerationModelLabel('gpt-image-2'), 'GPT Image 2')
  assert.equal(getGenerationModelLabel('seedream-5-0-pro'), 'Seedream 5.0 Pro')
  assert.equal(getGenerationModelLabel('custom-model'), 'custom-model')
})
