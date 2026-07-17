import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildAdminMediaPreviewUrl,
  buildInlineAdminMediaHeaders,
  isAllowedAdminMediaUrl,
  isInlineAdminMediaContentType,
  parseAllowedAdminMediaUrl,
} from './media-preview'

const outputUrl = 'https://tempfile.aiquickdraw.com/p/result.png'

test('builds an admin preview route for allowed generated media URLs', () => {
  assert.equal(isAllowedAdminMediaUrl(outputUrl), true)
  assert.equal(
    buildAdminMediaPreviewUrl(outputUrl),
    `/api/admin/media-preview?url=${encodeURIComponent(outputUrl)}`,
  )
})

test('rejects non-https and untrusted admin media preview URLs', () => {
  assert.equal(parseAllowedAdminMediaUrl('http://tempfile.aiquickdraw.com/p/result.png'), null)
  assert.equal(parseAllowedAdminMediaUrl('https://user:pass@tempfile.aiquickdraw.com/p/result.png'), null)
  assert.equal(parseAllowedAdminMediaUrl('https://example.com/result.png'), null)
  assert.equal(parseAllowedAdminMediaUrl('not-a-url'), null)
  assert.equal(isAllowedAdminMediaUrl('https://example.com/result.png'), false)
  assert.equal(buildAdminMediaPreviewUrl('https://example.com/result.png'), null)
})

test('only allows images and videos to be streamed inline', () => {
  assert.equal(isInlineAdminMediaContentType('image/png'), true)
  assert.equal(isInlineAdminMediaContentType('video/mp4; charset=utf-8'), true)
  assert.equal(isInlineAdminMediaContentType('text/html'), false)
  assert.equal(isInlineAdminMediaContentType(null), false)
})

test('forces proxied media to render inline instead of downloading', () => {
  const headers = buildInlineAdminMediaHeaders(new Headers({
    'content-type': 'image/png',
    'content-length': '123',
    'content-disposition': 'attachment; filename="result.png"',
    etag: '"abc"',
  }))

  assert.equal(headers.get('content-type'), 'image/png')
  assert.equal(headers.get('content-length'), '123')
  assert.equal(headers.get('content-disposition'), 'inline')
  assert.equal(headers.get('etag'), '"abc"')
})
