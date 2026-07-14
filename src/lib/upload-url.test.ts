import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveImageUploadUrl } from './upload-url'

test('uses configured upload URL on localhost when provided', () => {
  assert.equal(
    resolveImageUploadUrl({
      publicUploadUrl: 'https://toolaze-web.pages.dev/api/upload',
      hostname: 'localhost',
    }),
    'https://toolaze-web.pages.dev/api/upload',
  )
})

test('uses the Pages upload endpoint on localhost when no local R2 config exists', () => {
  assert.equal(
    resolveImageUploadUrl({
      publicUploadUrl: '',
      hostname: 'localhost',
    }),
    'https://toolaze-web.pages.dev/api/upload',
  )
})

test('keeps same-origin upload as the default outside local preview', () => {
  assert.equal(
    resolveImageUploadUrl({
      publicUploadUrl: '',
      hostname: 'toolaze.com',
    }),
    '/api/upload',
  )
})
