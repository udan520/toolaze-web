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
    outputUrl: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/output.webp',
    inputUrls: [
      '/ai-hair-color-changer/default-reference.png',
      'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp',
      'javascript:alert(1)',
    ],
  })

  assert.deepEqual(item.inputUrls, [
    '/ai-hair-color-changer/default-reference.png',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp',
  ])
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
