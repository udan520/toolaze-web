import assert from 'node:assert/strict'
import test from 'node:test'
import { createGenerationHistoryItem } from './generation-history.mjs'

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
