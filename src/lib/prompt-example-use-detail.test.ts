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

test('keeps text-to-image prompt examples prompt-only when the card image is only a demo preview', () => {
  assert.deepEqual(
    buildPromptExampleUseDetail(
      {
        title: 'Dark fantasy character sheet',
        prompt: 'Create a cinematic dark fantasy character concept sheet.',
        image: 'https://example.com/prompt-character-sheet.webp',
      },
      'text-to-image',
    ),
    {
      prompt: 'Create a cinematic dark fantasy character concept sheet.',
      demoImageUrl: 'https://example.com/prompt-character-sheet.webp',
      demoImageTitle: 'Dark fantasy character sheet',
      mode: 'text-to-image',
      presetLabel: 'Dark fantasy character sheet',
      presetGroup: undefined,
    },
  )
})
