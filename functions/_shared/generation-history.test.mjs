import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { createGenerationHistoryItem, listGenerationHistory } from './generation-history.mjs'

test('createGenerationHistoryItem preserves same-origin reference image paths', async () => {
  let boundValues = []
  const env = {
    DB: {
      prepare() {
        return {
          bind(...values) {
            boundValues = values
            return {
              async run() {
                return { success: true }
              },
            }
          },
        }
      },
    },
  }

  const item = await createGenerationHistoryItem(env, 'user_test', {
    mediaType: 'image',
    model: 'seedream-5-0-pro',
    prompt: 'relative reference prompt',
    outputUrl: 'https://assets.toolaze.com/uploads/output.webp',
    inputUrls: [
      '/ai-hair-color-changer/default-reference.png',
      'https://assets.toolaze.com/uploads/input.webp',
      'javascript:alert(1)',
    ],
  })

  assert.deepEqual(item.inputUrls, [
    '/ai-hair-color-changer/default-reference.png',
    'https://assets.toolaze.com/uploads/input.webp',
  ])
  assert.equal(boundValues[6], JSON.stringify(item.inputUrls))
})

test('task-backed history finalization is idempotent', async () => {
  const sqlStatements = []
  const env = {
    DB: {
      prepare(sql) {
        sqlStatements.push(sql)
        return {
          bind() {
            return {
              async run() {
                return { success: true }
              },
            }
          },
        }
      },
    },
  }
  const item = {
    taskId: 'task_123',
    mediaType: 'image',
    model: 'gpt-image-2',
    prompt: 'Portrait',
    outputUrl: 'https://assets.toolaze.com/output.webp',
  }

  const first = await createGenerationHistoryItem(env, 'user_1', item)
  const second = await createGenerationHistoryItem(env, 'user_1', item)

  assert.equal(first.id, second.id)
  assert.match(sqlStatements[0], /on conflict\s*\(id\)\s*do update/i)
})

test('generation history rewrites legacy R2 development URLs to the canonical asset domain', async () => {
  let boundValues = []
  const env = {
    R2_PUBLIC_BASE_URL: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev',
    DB: {
      prepare() {
        return {
          bind(...values) {
            boundValues = values
            return {
              async run() {
                return { success: true }
              },
            }
          },
        }
      },
    },
  }

  const item = await createGenerationHistoryItem(env, 'user_test', {
    mediaType: 'image',
    model: 'seedream-5-0-pro',
    prompt: 'legacy r2 prompt',
    outputUrl: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/generated/output.webp',
    inputUrls: [
      'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp?version=1',
    ],
  })

  assert.equal(item.outputUrl, 'https://assets.toolaze.com/generated/output.webp')
  assert.deepEqual(item.inputUrls, [
    'https://assets.toolaze.com/uploads/input.webp?version=1',
  ])
  assert.equal(boundValues[5], item.outputUrl)
  assert.equal(boundValues[6], JSON.stringify(item.inputUrls))
})

test('generation history stores Native Audio as a dedicated boolean field', async () => {
  let boundValues = []
  const env = {
    DB: {
      prepare() {
        return {
          bind(...values) {
            boundValues = values
            return {
              async run() {
                return { success: true }
              },
            }
          },
        }
      },
    },
  }

  const item = await createGenerationHistoryItem(env, 'user_test', {
    mediaType: 'video',
    model: 'kling-3',
    prompt: 'A cinematic car chase',
    outputUrl: 'https://example.com/output.mp4',
    nativeAudio: true,
  })

  assert.equal(boundValues[10], 1)
  assert.equal(item.nativeAudio, true)
})

test('generation history stores request IP and country metadata', async () => {
  let boundValues = []
  const env = {
    DB: {
      prepare() {
        return {
          bind(...values) {
            boundValues = values
            return {
              async run() {
                return { success: true }
              },
            }
          },
        }
      },
    },
  }

  const item = await createGenerationHistoryItem(env, 'user_test', {
    mediaType: 'image',
    model: 'gpt-image-2',
    prompt: 'request metadata prompt',
    outputUrl: 'https://example.com/output.png',
    requestIp: '203.0.113.8',
    requestCountry: 'US',
  })

  assert.equal(boundValues[14], '203.0.113.8')
  assert.equal(boundValues[15], 'US')
  assert.equal(item.requestIp, '203.0.113.8')
  assert.equal(item.requestCountry, 'US')
})

test('generation history maps persisted Native Audio values back to booleans', async () => {
  const env = {
    DB: {
      prepare() {
        return {
          bind() {
            return {
              async all() {
                return {
                  results: [{
                    id: 'gen_video',
                    media_type: 'video',
                    model: 'kling-3',
                    prompt: 'A cinematic car chase',
                    output_url: 'https://example.com/output.mp4',
                    input_urls: null,
                    aspect_ratio: '9:16',
                    resolution: '1080p',
                    output_format: '5s',
                    native_audio: 1,
                    tool_slug: 'ai-video-generator',
                    tool_label: 'AI Video Generator',
                    source_path: '/ai-video-generator',
                    request_ip: '203.0.113.8',
                    request_country: 'US',
                    created_at: '2026-07-21T00:00:00.000Z',
                  }],
                }
              },
            }
          },
        }
      },
    },
  }

  const [item] = await listGenerationHistory(env, 'user_test')

  assert.equal(item.nativeAudio, true)
  assert.equal(item.requestIp, '203.0.113.8')
  assert.equal(item.requestCountry, 'US')
})

test('generation history rewrites legacy R2 URLs when reading persisted rows', async () => {
  const env = {
    DB: {
      prepare() {
        return {
          bind() {
            return {
              async all() {
                return {
                  results: [{
                    id: 'gen_legacy',
                    media_type: 'image',
                    model: 'seedream-5-0-pro',
                    prompt: 'legacy persisted url',
                    output_url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/generated/output.webp',
                    input_urls: JSON.stringify([
                      'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp',
                    ]),
                    aspect_ratio: '1:1',
                    resolution: '1K',
                    output_format: 'png',
                    native_audio: 0,
                    tool_slug: 'ai-image-generator',
                    tool_label: 'AI Image Generator',
                    source_path: '/ai-image-generator',
                    request_ip: null,
                    request_country: null,
                    created_at: '2026-08-04T00:00:00.000Z',
                  }],
                }
              },
            }
          },
        }
      },
    },
  }

  const [item] = await listGenerationHistory(env, 'user_test')

  assert.equal(item.outputUrl, 'https://assets.toolaze.com/generated/output.webp')
  assert.deepEqual(item.inputUrls, [
    'https://assets.toolaze.com/uploads/input.webp',
  ])
})

test('generation history migration adds the Native Audio column with a safe default', () => {
  const migrationPath = join(process.cwd(), 'migrations', '0007_generation_history_native_audio.sql')
  assert.equal(existsSync(migrationPath), true)
  const migration = readFileSync(migrationPath, 'utf8')
  assert.match(migration, /alter table generation_history\s+add column native_audio integer not null default 0/i)
})

test('history API forwards Native Audio to shared persistence', () => {
  const apiSource = readFileSync(join(process.cwd(), 'functions', 'api', 'history.js'), 'utf8')
  assert.match(apiSource, /nativeAudio:\s*body\.nativeAudio/)
})

test('history API forwards request IP and country to shared persistence', () => {
  const apiSource = readFileSync(join(process.cwd(), 'functions', 'api', 'history.js'), 'utf8')
  assert.match(apiSource, /getClientIp\(request\)/)
  assert.match(apiSource, /getClientCountry\(request\)/)
  assert.match(apiSource, /requestIp:/)
  assert.match(apiSource, /requestCountry:/)
})
