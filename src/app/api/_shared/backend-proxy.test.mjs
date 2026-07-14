import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
const tempStateDir = mkdtempSync(join(tmpdir(), 'toolaze-local-dev-test-'))
process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(tempStateDir, 'state.json')

test.after(() => {
  if (previousStateFile === undefined) {
    delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  } else {
    process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
  }
  delete globalThis[Symbol.for('toolaze.localDevAuthState')]
  rmSync(tempStateDir, { recursive: true, force: true })
})
import { proxyToPagesFunctions } from './backend-proxy.js'
import { resetLocalDevHistoryForTests } from './local-dev-auth.js'

test('local dev session cookie returns local test account for auth state', async () => {
  const request = new Request('http://localhost:3016/api/auth/me', {
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  })

  const response = await proxyToPagesFunctions(request, '/api/auth/me')
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.user.email, 'dianawu1202@gmail.com')
  assert.equal(payload.credits.balance, 1000)
})

test('local dev session cookie returns wrapped credit activity', async () => {
  const request = new Request('http://localhost:3016/api/credits?limit=200', {
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  })

  const response = await proxyToPagesFunctions(request, '/api/credits')
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.credits.balance, 1000)
  assert.equal(payload.credits.transactions[0].description, 'Bonus credits')
})

test('local dev session can create and list generation history', async () => {
  resetLocalDevHistoryForTests()

  const createResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: JSON.stringify({
      mediaType: 'image',
      model: 'seedream-5-0-pro',
      prompt: 'test prompt',
      outputUrl: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/output.webp',
      inputUrls: ['https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp'],
      aspectRatio: '16:9',
      resolution: '1K',
      outputFormat: 'Auto',
    }),
  }), '/api/history')
  const createPayload = await createResponse.json()

  assert.equal(createResponse.status, 201)
  assert.equal(createPayload.item.model, 'seedream-5-0-pro')

  const listResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/history?limit=200', {
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  }), '/api/history')
  const listPayload = await listResponse.json()

  assert.equal(listResponse.status, 200)
  assert.equal(listPayload.items.length, 1)
  assert.equal(listPayload.items[0].id, createPayload.item.id)
  assert.equal(listPayload.items[0].outputUrl, createPayload.item.outputUrl)
})
