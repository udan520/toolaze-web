import assert from 'node:assert/strict'
import test from 'node:test'
import { downloadImageInCurrentPage } from './browser-image-download'

test('downloads through the same-origin proxy when it succeeds', async () => {
  const calls: Array<{ input: string; init?: RequestInit }> = []
  const blobs: Array<{ blob: Blob; filename: string }> = []
  const urls: Array<{ url: string; filename: string }> = []

  const result = await downloadImageInCurrentPage({
    imageUrl: 'https://pub-example.r2.dev/output.png',
    filename: 'generated.png',
    fetcher: async (input, init) => {
      calls.push({ input: String(input), init })
      return new Response('proxy-image', { status: 200, headers: { 'content-type': 'image/png' } })
    },
    triggerBlobDownload: (blob, filename) => blobs.push({ blob, filename }),
    triggerUrlDownload: (url, filename) => urls.push({ url, filename }),
  })

  assert.equal(result, 'proxy')
  assert.equal(calls.length, 1)
  assert.match(calls[0].input, /^\/api\/download-image\?/)
  assert.equal(blobs.length, 1)
  assert.equal(blobs[0].filename, 'generated.png')
  assert.equal(urls.length, 0)
})

test('falls back to direct fetch without opening a new page', async () => {
  const calls: string[] = []
  const blobs: string[] = []
  const urls: string[] = []

  const result = await downloadImageInCurrentPage({
    imageUrl: 'https://cdn.example.com/output.png',
    filename: 'generated.png',
    fetcher: async (input) => {
      calls.push(String(input))
      if (calls.length === 1) return new Response('not allowed', { status: 403 })
      return new Response('direct-image', { status: 200, headers: { 'content-type': 'image/png' } })
    },
    triggerBlobDownload: (_blob, filename) => blobs.push(filename),
    triggerUrlDownload: (url) => urls.push(url),
  })

  assert.equal(result, 'direct')
  assert.equal(calls.length, 2)
  assert.equal(calls[1], 'https://cdn.example.com/output.png')
  assert.deepEqual(blobs, ['generated.png'])
  assert.deepEqual(urls, [])
})

test('uses same-page anchor fallback when fetches fail', async () => {
  const urls: Array<{ url: string; filename: string }> = []

  const result = await downloadImageInCurrentPage({
    imageUrl: 'https://blocked.example.com/output.png',
    filename: 'generated.png',
    fetcher: async () => {
      throw new Error('network blocked')
    },
    triggerBlobDownload: () => {
      throw new Error('blob download should not be used')
    },
    triggerUrlDownload: (url, filename) => urls.push({ url, filename }),
  })

  assert.equal(result, 'anchor')
  assert.deepEqual(urls, [{ url: 'https://blocked.example.com/output.png', filename: 'generated.png' }])
})
