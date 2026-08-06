import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatPageDemoLocalUrl,
  formatPageDemoPublicLocalUrl,
  normalizePageDemoUrlToSlug,
} from './page-demo-url'

test('normalizes page demo URLs into locale-free assignment slugs', () => {
  assert.equal(normalizePageDemoUrlToSlug('/image-to-video-generator'), 'image-to-video-generator')
  assert.equal(normalizePageDemoUrlToSlug('https://toolaze.com/pt/ai-baby-generator?utm=demo#top'), 'ai-baby-generator')
  assert.equal(normalizePageDemoUrlToSlug('toolaze.com/ja/model/kling-3-motion-control'), 'model/kling-3-motion-control')
  assert.equal(normalizePageDemoUrlToSlug('localhost:3010/model/kling-3-motion-control'), 'model/kling-3-motion-control')
  assert.equal(normalizePageDemoUrlToSlug('http://localhost:3010/image-to-video-generator'), 'image-to-video-generator')
  assert.equal(normalizePageDemoUrlToSlug('/model/kling-3-motion-control/'), 'model/kling-3-motion-control')
})

test('formats page demo targets as localhost preview URLs without changing saved slugs', () => {
  assert.equal(
    formatPageDemoLocalUrl('/image-to-video-generator'),
    'http://localhost:3010/image-to-video-generator',
  )
  assert.equal(
    formatPageDemoPublicLocalUrl('/image-to-video-generator'),
    'http://localhost:3006/image-to-video-generator',
  )
  assert.equal(
    normalizePageDemoUrlToSlug(formatPageDemoLocalUrl('/image-to-video-generator')),
    'image-to-video-generator',
  )
})
