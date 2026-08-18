import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const imageGeneratorSource = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
const talkingAvatarSource = readFileSync(new URL('./TalkingAvatarCreatorTool.tsx', import.meta.url), 'utf8')
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

test('content-bearing preset images expose their localized preset label as alt text', () => {
  const presetImageBlock = imageGeneratorSource.match(/\{hasImage \? \([\s\S]*?\) : isBreastExpansionPreset/)

  assert.ok(presetImageBlock, 'prompt preset image branch should exist')
  assert.match(presetImageBlock[0], /src=\{preset\.image\}[\s\S]*alt=\{preset\.label\}/)
})

test('Talking Avatar image previews use localized reference-image alt text', () => {
  assert.match(talkingAvatarSource, /imagePreviewAlt\?: string/)
  assert.match(talkingAvatarSource, /imagePreviewAlt: 'Avatar reference image'/)
  assert.match(talkingAvatarSource, /alt=\{text\.imagePreviewAlt\}/)

  for (const locale of locales) {
    const page = JSON.parse(readFileSync(new URL(`../data/${locale}/talking-avatar-creator.json`, import.meta.url), 'utf8'))
    assert.match(page.topTool.textOverrides.imagePreviewAlt, /\S/, `${locale} needs localized image preview alt text`)
  }
})
