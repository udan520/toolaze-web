import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const previousFile = process.env.TOOLAZE_MEDIA_LIBRARY_FILE
const tempDir = mkdtempSync(join(tmpdir(), 'toolaze-media-library-route-test-'))
process.env.TOOLAZE_MEDIA_LIBRARY_FILE = join(tempDir, 'assets.json')

test.after(() => {
  if (previousFile === undefined) {
    delete process.env.TOOLAZE_MEDIA_LIBRARY_FILE
  } else {
    process.env.TOOLAZE_MEDIA_LIBRARY_FILE = previousFile
  }
  rmSync(tempDir, { recursive: true, force: true })
})

test('production media library API is hidden by default', async () => {
  const route = await import('./route')
  const response = await route.GET(new Request('https://toolaze.com/api/admin/media-library'))

  assert.equal(response.status, 404)
})

test('media library API does not run on the main 3006 preview port', async () => {
  const route = await import('./route')
  const response = await route.GET(new Request('http://localhost:3006/api/admin/media-library'))

  assert.equal(response.status, 404)
})

test('localhost media library API creates and lists assets on port 3010', async () => {
  const route = await import('./route')
  const createResponse = await route.POST(new Request('http://localhost:3010/api/admin/media-library', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'create_url',
      url: 'https://pub.example.com/uploads/full-body-reference.webp',
      type: 'image',
      title: 'Full body reference',
      manualTags: ['female presenting', 'full-body', 'adult_likely'],
    }),
  }))
  const createPayload = await createResponse.json()

  assert.equal(createResponse.status, 201)
  assert.equal(createPayload.asset.reviewStatus, 'candidate')
  assert.deepEqual(createPayload.asset.manualTags, ['adult_likely', 'female_presenting', 'full_body'])

  const readResponse = await route.GET(new Request('http://localhost:3010/api/admin/media-library?tags=full_body,adult_likely'))
  const readPayload = await readResponse.json()

  assert.equal(readResponse.status, 200)
  assert.equal(readPayload.assets.length, 1)
  assert.equal(readPayload.stats.total, 1)
})
