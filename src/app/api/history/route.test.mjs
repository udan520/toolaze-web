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
import { POST } from './route.js'
import { resetLocalDevHistoryForTests } from '../_shared/local-dev-auth.js'

function createHistoryPostRequest() {
  return new Request('http://localhost:3016/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: JSON.stringify({
      mediaType: 'image',
      model: 'seedream-5-0-pro',
      prompt: 'test prompt',
      outputUrl: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/test.webp',
      inputUrls: ['https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp'],
      aspectRatio: '16:9',
      resolution: '1K',
      outputFormat: 'Auto',
    }),
  })
}

test('history route accepts local dev POST requests', async () => {
  resetLocalDevHistoryForTests()

  const response = await POST(createHistoryPostRequest())
  const payload = await response.json()

  assert.equal(response.status, 201)
  assert.equal(payload.item.model, 'seedream-5-0-pro')
  assert.equal(payload.item.outputUrl, 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/test.webp')
})
