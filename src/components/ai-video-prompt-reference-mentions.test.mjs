import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./AiVideoGeneratorTool.tsx', import.meta.url), 'utf8')

test('video mentions use configured current-mode capacity and atomic deletion', () => {
  assert.match(source, /supportsConfiguredPromptReferenceMentions/)
  assert.match(source, /deletePromptReferenceMention/)
  assert.match(source, /activeMode === 'image-to-video'/)
  assert.match(source, /modelConfig\.maxImages/)
  assert.match(source, /modelConfig\.maxVideos/)
  assert.match(source, /modelConfig\.maxAudioFiles/)
  assert.match(source, /event\.key === 'Backspace' \|\| event\.key === 'Delete'/)
})

test('first and last frames are excluded from reference mentions', () => {
  assert.doesNotMatch(source, /@First Frame|@Last Frame/)
  assert.match(source, /isFirstLastFrameMode: isUsingFirstLastFrame/)
})
