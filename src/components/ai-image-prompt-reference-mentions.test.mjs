import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')

test('image mentions are enabled only for configured multi-image image-to-image modes', () => {
  assert.match(source, /supportsConfiguredPromptReferenceMentions/)
  assert.match(source, /activeTab === 'image-to-image'/)
  assert.match(source, /currentMaxUploadImages/)
  assert.match(source, /PromptReferenceMentionPicker/)
  assert.match(source, /PromptReferenceMentionOverlay/)
  assert.match(source, /<div ref=\{promptMentionRootRef\} className="relative overflow-visible">/)
  assert.match(source, /relative flex h-11 items-center px-3/)
  assert.doesNotMatch(source, /relative flex h-11 items-center border-t border-slate-200\/90 px-3/)
  assert.match(source, /text-transparent caret-slate-800/)
})

test('image prompt deletion uses the shared atomic mention behavior', () => {
  assert.match(source, /deletePromptReferenceMention/)
  assert.match(source, /event\.key === 'Backspace' \|\| event\.key === 'Delete'/)
  assert.match(source, /mentions: promptReferenceMentionItems/)
})
