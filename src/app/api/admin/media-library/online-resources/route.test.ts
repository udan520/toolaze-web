import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const previousEnv = {
  TOOLAZE_MEDIA_LIBRARY_FILE: process.env.TOOLAZE_MEDIA_LIBRARY_FILE,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT_URL: process.env.R2_ENDPOINT_URL,
  R2_BUCKET: process.env.R2_BUCKET,
  R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_BASE_URL,
}
const originalFetch = globalThis.fetch
const tempDir = mkdtempSync(join(tmpdir(), 'toolaze-online-resources-route-test-'))
const mediaLibraryPath = join(tempDir, 'assets.json')

process.env.TOOLAZE_MEDIA_LIBRARY_FILE = mediaLibraryPath
process.env.R2_ACCESS_KEY_ID = 'test-access-key'
process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key'
process.env.R2_ENDPOINT_URL = 'https://account.r2.cloudflarestorage.com'
process.env.R2_BUCKET = 'toolaze'
process.env.R2_PUBLIC_BASE_URL = 'https://assets.toolaze.com'

test.after(() => {
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
  globalThis.fetch = originalFetch
  rmSync(tempDir, { recursive: true, force: true })
})

test('online resources API does not run on the main 3006 preview port', async () => {
  const route = await import('./route')
  const response = await route.GET(new Request('http://localhost:3006/api/admin/media-library/online-resources'))

  assert.equal(response.status, 404)
})

test('online resources API lists R2 media and marks assets already in the library', async () => {
  writeFileSync(mediaLibraryPath, JSON.stringify({
    version: 1,
    assets: [
      {
        id: 'asset_existing',
        type: 'image',
        url: 'https://assets.toolaze.com/uploads/full-body-reference.webp',
        source: 'upload',
        aiTags: [],
        manualTags: [],
        safetyTags: [],
        confidence: {},
        reviewStatus: 'approved',
        usageCount: 0,
        createdAt: '2026-08-04T03:00:00.000Z',
        updatedAt: '2026-08-04T03:00:00.000Z',
      },
    ],
  }), 'utf8')

  globalThis.fetch = async (input) => {
    const url = String(input)
    assert.match(url, /list-type=2/)
    assert.match(url, /prefix=uploads%2F/)
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
      <ListBucketResult>
        <IsTruncated>false</IsTruncated>
        <Contents>
          <Key>uploads/full-body-reference.webp</Key>
          <LastModified>2026-08-04T03:00:00.000Z</LastModified>
          <Size>12345</Size>
        </Contents>
        <Contents>
          <Key>uploads/demo-video.mp4</Key>
          <LastModified>2026-08-04T03:05:00.000Z</LastModified>
          <Size>456789</Size>
        </Contents>
      </ListBucketResult>`, {
      headers: { 'content-type': 'application/xml' },
    })
  }

  const route = await import('./route')
  const response = await route.GET(new Request('http://localhost:3010/api/admin/media-library/online-resources?prefix=uploads/&type=all'))
  const payload = await response.json() as {
    resources: Array<{ key: string; alreadyInLibrary: boolean }>
  }

  assert.equal(response.status, 200)
  assert.equal(payload.resources.length, 2)
  assert.deepEqual(payload.resources.map((resource) => [resource.key, resource.alreadyInLibrary]), [
    ['uploads/full-body-reference.webp', true],
    ['uploads/demo-video.mp4', false],
  ])
})

test('online resources API falls back to generation history when R2 list config is missing', async () => {
  for (const key of [
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_ENDPOINT_URL',
    'R2_BUCKET',
    'R2_PUBLIC_BASE_URL',
  ]) {
    delete process.env[key]
  }

  writeFileSync(mediaLibraryPath, JSON.stringify({
    version: 1,
    assets: [
      {
        id: 'asset_existing_history',
        type: 'image',
        url: 'https://assets.toolaze.com/uploads/history-output.webp',
        source: 'history',
        aiTags: [],
        manualTags: [],
        safetyTags: [],
        confidence: {},
        reviewStatus: 'approved',
        usageCount: 0,
        createdAt: '2026-08-04T03:00:00.000Z',
        updatedAt: '2026-08-04T03:00:00.000Z',
      },
    ],
  }), 'utf8')

  const { getOnlineMediaResourcesResponse } = await import('./handler')
  const response = await getOnlineMediaResourcesResponse(
    new Request('http://localhost:3010/api/admin/media-library/online-resources?prefix=uploads/&type=all'),
    {
      listResources: async () => ({
        resources: [],
        total: 0,
        prefix: 'uploads/',
        configMissing: true,
      }),
      fetchHistoryRecords: async () => [
        {
          id: 'generation-1',
          userId: 'user-1',
          userEmail: 'test@example.com',
          userName: 'Test User',
          mediaType: 'image',
          model: 'gpt-image-2',
          prompt: 'full body clothes changer demo',
          outputUrl: 'https://assets.toolaze.com/uploads/history-output.webp',
          inputUrls: ['https://assets.toolaze.com/uploads/history-input.png'],
          aspectRatio: null,
          resolution: null,
          outputFormat: null,
          toolSlug: 'ai-clothes-changer',
          toolLabel: 'AI Clothes Changer',
          sourcePath: '/ai-clothes-changer',
          createdAt: '2026-08-04T03:10:00.000Z',
        },
      ],
    },
  )
  const payload = await response.json() as {
    source: string
    resources: Array<{ key: string; alreadyInLibrary: boolean }>
  }

  assert.equal(response.status, 200)
  assert.equal(payload.source, 'history')
  assert.deepEqual(payload.resources.map((resource) => [resource.key, resource.alreadyInLibrary]), [
    ['uploads/history-output.webp', true],
    ['uploads/history-input.png', false],
  ])
})

test('online resources API reports an actionable error when R2 and history fallback are unavailable', async () => {
  const { getOnlineMediaResourcesResponse } = await import('./handler')
  const response = await getOnlineMediaResourcesResponse(
    new Request('http://localhost:3010/api/admin/media-library/online-resources?prefix=uploads/&type=all'),
    {
      listResources: async () => ({
        resources: [],
        total: 0,
        prefix: 'uploads/',
        configMissing: true,
        message: '未配置 R2 列表权限。',
      }),
      fetchHistoryRecords: async () => {
        throw new Error('当前 Cloudflare 账号没有读取线上 D1 的权限。')
      },
    },
  )
  const payload = await response.json() as {
    configMissing: boolean
    resources: unknown[]
    message: string
  }

  assert.equal(response.status, 200)
  assert.equal(payload.configMissing, true)
  assert.equal(payload.resources.length, 0)
  assert.match(payload.message, /未配置 R2 列表权限/)
  assert.match(payload.message, /Cloudflare/)
})
