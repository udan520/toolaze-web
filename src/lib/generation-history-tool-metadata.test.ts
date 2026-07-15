import assert from 'node:assert/strict'
import test from 'node:test'
import { getHistoryToolMetadata } from './generation-history-tool-metadata'

test('uses the selected model route and label for model generation history', () => {
  assert.deepEqual(
    getHistoryToolMetadata('/model/nano-banana-pro', 'Seedream 5.0 Pro', 'seedream-5-0-pro'),
    {
      toolSlug: 'model/seedream-5-0-pro',
      toolLabel: 'Seedream 5.0 Pro',
      sourcePath: '/model/seedream-5-0-pro',
    },
  )
})

test('keeps localized model paths in generation history metadata', () => {
  assert.deepEqual(
    getHistoryToolMetadata('/de/model/seedream-5-0-pro', 'Seedream 5.0 Pro', 'seedream-5-0-pro'),
    {
      toolSlug: 'model/seedream-5-0-pro',
      toolLabel: 'Seedream 5.0 Pro',
      sourcePath: '/de/model/seedream-5-0-pro',
    },
  )
})

test('uses fixed tool labels for non-model generator routes', () => {
  assert.deepEqual(
    getHistoryToolMetadata('/ai-hairstyle-changer', 'Seedream 5.0 Pro', 'seedream-5-0-pro'),
    {
      toolSlug: 'ai-hairstyle-changer',
      toolLabel: 'AI Hairstyle Changer',
      sourcePath: '/ai-hairstyle-changer',
    },
  )
})
