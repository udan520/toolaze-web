import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './upload.js'

async function uploadFile({ file, type }) {
  const writes = []
  const formData = new FormData()
  formData.set('file', file)

  const response = await onRequest({
    request: new Request('https://toolaze.test/api/upload', {
      method: 'POST',
      body: formData,
    }),
    env: {
      MY_BUCKET: {
        put: async (key, blob, options) => {
          writes.push({ key, type: blob.type, options })
        },
      },
      R2_PUBLIC_BASE_URL: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev',
    },
  })

  return { response, body: await response.json(), writes }
}

test('upload stores mp4 video with a video extension and content type', async () => {
  const { response, body, writes } = await uploadFile({
    file: new File(['video-bytes'], 'demo.mp4', { type: 'video/mp4' }),
  })

  assert.equal(response.status, 200)
  assert.equal(writes.length, 1)
  assert.match(writes[0].key, /^uploads\/[a-f0-9]+\.mp4$/)
  assert.equal(writes[0].options.httpMetadata.contentType, 'video/mp4')
  assert.match(body.url, /^https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\/[a-f0-9]+\.mp4$/)
})

test('upload keeps m4a audio distinct from mp4 video', async () => {
  const { response, body, writes } = await uploadFile({
    file: new File(['audio-bytes'], 'voice.m4a', { type: 'audio/mp4' }),
  })

  assert.equal(response.status, 200)
  assert.equal(writes.length, 1)
  assert.match(writes[0].key, /^uploads\/[a-f0-9]+\.m4a$/)
  assert.equal(writes[0].options.httpMetadata.contentType, 'audio/mp4')
  assert.match(body.url, /^https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\/[a-f0-9]+\.m4a$/)
})
