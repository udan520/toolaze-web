import assert from 'node:assert/strict'
import test from 'node:test'
import { getAiImageGenerationToolText } from './ai-image-generation-tool-text'

test('fills missing AI image generation tool text keys from defaults', () => {
  const text = getAiImageGenerationToolText(
    {
      generate: '生成',
    },
    {
      generate: 'Generate',
      creditsUsedUpTitle: 'Credits Used Up',
      creditsUsedUpMessage: 'Your credits have been used up. More ways to earn credits are coming soon, including bonus events and activity rewards.',
      creditsUsedUpAction: 'Got it',
    },
  )

  assert.equal(text.generate, '生成')
  assert.equal(text.creditsUsedUpTitle, 'Credits Used Up')
  assert.equal(
    text.creditsUsedUpMessage,
    'Your credits have been used up. More ways to earn credits are coming soon, including bonus events and activity rewards.',
  )
  assert.equal(text.creditsUsedUpAction, 'Got it')
})
