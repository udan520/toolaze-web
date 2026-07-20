import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const watermarkSource = readFileSync(new URL('./WatermarkRemover.tsx', import.meta.url), 'utf8')
const l2Source = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')
const aiToolsCopySource = readFileSync(new URL('../app/ai-tools/copy.ts', import.meta.url), 'utf8')

test('AI tools hub exposes baby, couple, watermark, and World Cup entries', () => {
  for (const href of [
    '/ai-baby-generator',
    '/ai-couple-photo-maker',
    '/watermark-remover',
    '/world-cup-ai-image-generator',
  ]) {
    assert.match(aiToolsCopySource, new RegExp(`href: '${href}'`))
  }

  assert.doesNotMatch(aiToolsCopySource, /REVIEW_HIDDEN_AI_TOOL_HREFS/)
})

test('photo restoration root page uses GPT Image 2 shared image-to-image flow', () => {
  const restorationBranch = l2Source.slice(
    l2Source.indexOf("topComp === 'photo-restoration'"),
    l2Source.indexOf("topComp === 'ai-couple-photo-maker'"),
  )

  assert.match(restorationBranch, /<AiImageGenerationTool/)
  assert.match(restorationBranch, /modelId="gpt-image-2"/)
  assert.match(restorationBranch, /defaultMode="image-to-image"/)
  assert.match(restorationBranch, /defaultPrompt=\{PHOTO_RESTORATION_PROMPT\}/)
  assert.match(restorationBranch, /hidePromptInput/)
  assert.match(restorationBranch, /generateLabel: 'Restore Photo'/)
})

test('watermark remover sends GPT Image 2 image-to-image generation requests', () => {
  assert.match(watermarkSource, /formData\.append\('isImageToImage', 'true'\)/)
  assert.match(watermarkSource, /formData\.append\('model', 'gpt-image-2'\)/)
  assert.match(watermarkSource, /fetch\('\/api\/image-to-image'/)
  assert.match(watermarkSource, /fetch\('\/api\/image-to-image\/status'/)
  assert.doesNotMatch(watermarkSource, /fetch\('\/api\/qwen-image-edit'/)
  assert.doesNotMatch(watermarkSource, /form\.append\('model', 'nano-banana'\)/)
})
