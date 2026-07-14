import assert from 'node:assert/strict'
import test from 'node:test'
import { getNanoBananaToolText } from './nano-banana-tool-text'

test('fills missing nano banana tool text keys from defaults', () => {
  const text = getNanoBananaToolText(
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
