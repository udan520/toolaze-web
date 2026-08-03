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

test('history route preserves Native Audio for local video history', async () => {
  resetLocalDevHistoryForTests()

  const request = new Request('http://localhost:3016/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: JSON.stringify({
      mediaType: 'video',
      model: 'kling-3',
      prompt: 'A cinematic car chase',
      outputUrl: 'https://example.com/output.mp4',
      nativeAudio: true,
    }),
  })

  const response = await POST(request)
  const payload = await response.json()

  assert.equal(response.status, 201)
  assert.equal(payload.item.nativeAudio, true)
})

test('history route accepts promptless video history for motion control', async () => {
  resetLocalDevHistoryForTests()

  const request = new Request('http://localhost:3016/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: JSON.stringify({
      mediaType: 'video',
      model: 'kling-3-motion-control',
      prompt: '',
      outputUrl: 'https://example.com/kling-motion-output.mp4',
      inputUrls: [
        'https://example.com/character.png',
        'https://example.com/reference-motion.mp4',
      ],
      outputFormat: JSON.stringify({ duration: 10, characterOrientation: 'image' }),
    }),
  })

  const response = await POST(request)
  const payload = await response.json()

  assert.equal(response.status, 201)
  assert.equal(payload.item.mediaType, 'video')
  assert.equal(payload.item.model, 'kling-3-motion-control')
  assert.equal(payload.item.prompt, '')
})
