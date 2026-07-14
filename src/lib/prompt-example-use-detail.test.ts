import assert from 'node:assert/strict'
import test from 'node:test'
import { buildPromptExampleUseDetail } from './prompt-example-use-detail'

test('includes image-to-image target mode when building prompt example insert detail', () => {
  assert.deepEqual(
    buildPromptExampleUseDetail(
      {
        title: 'Short Bob',
        prompt: 'Use the uploaded portrait as the identity reference.',
        image: '/ai-hairstyle-changer/templates/women/short-bob.webp',
        group: 'women',
      },
      'image-to-image',
    ),
    {
      prompt: 'Use the uploaded portrait as the identity reference.',
      demoImageUrl: '/ai-hairstyle-changer/templates/women/short-bob.webp',
      demoImageTitle: 'Short Bob',
      mode: 'image-to-image',
      presetLabel: 'Short Bob',
      presetGroup: 'women',
    },
  )
})
