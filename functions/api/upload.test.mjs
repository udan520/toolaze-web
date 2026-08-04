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
      R2_PUBLIC_BASE_URL: 'https://assets.toolaze.com',
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
  assert.match(body.url, /^https:\/\/assets\.toolaze\.com\/uploads\/[a-f0-9]+\.mp4$/)
})

test('upload keeps m4a audio distinct from mp4 video', async () => {
  const { response, body, writes } = await uploadFile({
    file: new File(['audio-bytes'], 'voice.m4a', { type: 'audio/mp4' }),
  })

  assert.equal(response.status, 200)
  assert.equal(writes.length, 1)
  assert.match(writes[0].key, /^uploads\/[a-f0-9]+\.m4a$/)
  assert.equal(writes[0].options.httpMetadata.contentType, 'audio/mp4')
  assert.match(body.url, /^https:\/\/assets\.toolaze\.com\/uploads\/[a-f0-9]+\.m4a$/)
})

test('upload ignores the legacy R2 development base URL', async () => {
  const writes = []
  const formData = new FormData()
  formData.set('file', new File(['image-bytes'], 'demo.png', { type: 'image/png' }))

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
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(writes.length, 1)
  assert.match(body.url, /^https:\/\/assets\.toolaze\.com\/uploads\/[a-f0-9]+\.png$/)
})

test('upload can stream motion-control media from a neutral browser purpose', async () => {
  const calls = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init })
    return Response.json({
      success: true,
      code: 200,
      msg: 'File uploaded successfully',
      data: {
        fileName: 'motion.mp4',
        filePath: 'toolaze/kling-motion-control/motion.mp4',
        downloadUrl: 'https://tempfile.redpandaai.co/toolaze/kling-motion-control/motion.mp4',
      },
    })
  }

  const writes = []
  const formData = new FormData()
  formData.set('file', new File(['video-bytes'], 'motion.mp4', { type: 'video/mp4' }))
  formData.set('uploadPurpose', 'kling-motion-control')

  try {
    const response = await onRequest({
      request: new Request('https://toolaze.test/api/upload', {
        method: 'POST',
        body: formData,
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        MY_BUCKET: {
          put: async (key, blob, options) => {
            writes.push({ key, type: blob.type, options })
          },
        },
      },
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(writes.length, 1)
    assert.match(writes[0].key, /^uploads\/[a-f0-9]+\.mp4$/)
    assert.equal(writes[0].options.httpMetadata.contentType, 'video/mp4')
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://kieai.redpandaai.co/api/file-stream-upload')
    assert.equal(calls[0].init.method, 'POST')
    assert.equal(calls[0].init.headers.Authorization, 'Bearer test-key')
    assert.equal(calls[0].init.body.get('uploadPath'), 'toolaze/kling-motion-control')
    assert.match(calls[0].init.body.get('fileName'), /^motion-[a-f0-9]+\.mp4$/)
    assert.match(body.uploadRef, /^toolaze-upload-ref:/)
    assert.match(body.url, /^https:\/\/assets\.toolaze\.com\/uploads\/[a-f0-9]+\.mp4$/)
    assert.match(body.key, /^uploads\/[a-f0-9]+\.mp4$/)
    assert.equal(String(body.uploadRef).includes('redpandaai'), false)
    assert.equal(String(body.uploadRef).includes('kieai'), false)
    assert.equal('provider' in body, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Kie motion-control upload returns the extension-preserving file URL for generation inputs', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => Response.json({
    success: true,
    code: 200,
    msg: 'File uploaded successfully',
    data: {
      fileId: 'file_no_extension',
      fileName: 'character.png',
      filePath: 'toolaze/kling-motion-control/character.png',
      fileUrl: 'https://kieai.redpandaai.co/files/toolaze/kling-motion-control/character.png',
      downloadUrl: 'https://kieai.redpandaai.co/download/file_no_extension',
    },
  })

  const formData = new FormData()
  formData.set('image', new File(['image-bytes'], 'character.png', { type: 'image/png' }))
  formData.set('uploadPurpose', 'kling-motion-control')

  try {
    const response = await onRequest({
      request: new Request('https://toolaze.test/api/upload', {
        method: 'POST',
        body: formData,
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        MY_BUCKET: {
          put: async () => {},
        },
      },
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.match(body.uploadRef, /^toolaze-upload-ref:/)
    assert.equal(String(body.uploadRef).includes('redpandaai'), false)
    assert.equal(String(body.uploadRef).includes('kieai'), false)
    assert.match(body.url, /^https:\/\/assets\.toolaze\.com\/uploads\/[a-f0-9]+\.png$/)
    assert.match(body.key, /^uploads\/[a-f0-9]+\.png$/)
    assert.equal('provider' in body, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Kie motion-control upload rejects unsupported character image formats before provider upload', async () => {
  const originalFetch = globalThis.fetch
  let fetchCalled = false
  globalThis.fetch = async () => {
    fetchCalled = true
    return Response.json({ success: true })
  }

  const formData = new FormData()
  formData.set('image', new File(['image-bytes'], 'character.webp', { type: 'image/webp' }))
  formData.set('uploadPurpose', 'kling-motion-control')

  try {
    const response = await onRequest({
      request: new Request('https://toolaze.test/api/upload', {
        method: 'POST',
        body: formData,
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        MY_BUCKET: {
          put: async () => {},
        },
      },
    })
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.equal(fetchCalled, false)
    assert.match(body.error, /Use JPG or PNG for the Kling 2\.6 Motion Control character image/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
