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
      toolLabel: 'AI Hair Style Changer',
      sourcePath: '/ai-hairstyle-changer',
    },
  )
})

test('keeps AI dance and AI kissing history labels tied to their source routes', () => {
  assert.deepEqual(
    getHistoryToolMetadata('/ai-dance-generator', 'AI Dance Generator', 'grok-video-1-5'),
    {
      toolSlug: 'ai-dance-generator',
      toolLabel: 'AI Dance Generator',
      sourcePath: '/ai-dance-generator',
    },
  )
  assert.deepEqual(
    getHistoryToolMetadata('/zh-TW/ai-kissing-video-generator', 'AI Kissing Video Generator', 'grok-video-1-5'),
    {
      toolSlug: 'ai-kissing-video-generator',
      toolLabel: 'AI Kissing Video Generator',
      sourcePath: '/zh-TW/ai-kissing-video-generator',
    },
  )
})


test('uses Clothes Changer as the feature label for AI clothes changer route metadata', () => {
  assert.deepEqual(
    getHistoryToolMetadata('/ai-clothes-changer', 'Seedream 5.0 Lite', 'seedream-5-0-lite'),
    {
      toolSlug: 'ai-clothes-changer',
      toolLabel: 'Clothes Changer',
      sourcePath: '/ai-clothes-changer',
    },
  )
})


test('uses AI Bikini Generator as the feature label for bikini route metadata', () => {
  assert.deepEqual(
    getHistoryToolMetadata('/ai-bikini-generator', 'Seedream 5.0 Lite', 'seedream-5-0-lite'),
    {
      toolSlug: 'ai-bikini-generator',
      toolLabel: 'AI Bikini Generator',
      sourcePath: '/ai-bikini-generator',
    },
  )
})
