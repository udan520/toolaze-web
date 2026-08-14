import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readAdminSnapshot } from './read-cache'

test('coalesces concurrent reads for the same admin data source', async () => {
  let resolveLoader: ((value: string) => void) | undefined
  let loadCount = 0
  const loader = () => {
    loadCount += 1
    return new Promise<string>((resolve) => {
      resolveLoader = resolve
    })
  }
  const key = `coalesce-${Date.now()}-${Math.random()}`

  const first = readAdminSnapshot(key, loader)
  const second = readAdminSnapshot(key, loader)
  resolveLoader?.('online data')

  assert.equal(await first, 'online data')
  assert.equal(await second, 'online data')
  assert.equal(loadCount, 1)
})

test('returns a fresh cached snapshot without running another remote read', async () => {
  let loadCount = 0
  const key = `fresh-${Date.now()}-${Math.random()}`
  const loader = async () => {
    loadCount += 1
    return { value: loadCount }
  }

  assert.deepEqual(await readAdminSnapshot(key, loader), { value: 1 })
  assert.deepEqual(await readAdminSnapshot(key, loader), { value: 1 })
  assert.equal(loadCount, 1)
})

test('falls back to the last successful snapshot when a forced refresh fails', async () => {
  const key = `stale-${Date.now()}-${Math.random()}`

  await readAdminSnapshot(key, async () => 'last successful data')
  const data = await readAdminSnapshot(
    key,
    async () => {
      throw new Error('Cloudflare timed out')
    },
    { forceRefresh: true },
  )

  assert.equal(data, 'last successful data')
})

test('does not hide the error when no successful snapshot exists', async () => {
  const key = `empty-${Date.now()}-${Math.random()}`

  await assert.rejects(
    readAdminSnapshot(key, async () => {
      throw new Error('Cloudflare timed out')
    }),
    /Cloudflare timed out/,
  )
})
