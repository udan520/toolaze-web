import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const root = new URL('../../', import.meta.url)
const read = (file) => readFileSync(new URL(file, root), 'utf8')

test('image selector excludes video models and uses the official Grok logo', () => {
  const source = read('src/components/AiImageGenerationTool.tsx')
  assert.match(source, /MODEL_GROUPS\.map\(.*filter\(.*grok-video-1-5/s)
  assert.match(source, /logoSrc: '\/model-logos\/grok\.svg'/)
  assert.doesNotMatch(source, /modelGroups = MODEL_GROUPS\s*$/)

  const groupIndexes = ['openai-gpt', 'seedream', 'nano-banana', 'xai', 'wan-ai'].map((id) =>
    source.indexOf(`id: '${id}'`),
  )
  assert.deepEqual(
    groupIndexes.every((index) => index >= 0),
    true,
    'image model groups should all exist in the dropdown config',
  )
  assert.deepEqual(
    groupIndexes,
    [...groupIndexes].sort((a, b) => a - b),
    'xAI should appear directly after Nano Banana in the first-level image model dropdown',
  )
})

test('video inline history loads both image and video records and left-aligns tabs', () => {
  const source = read('src/components/AiVideoGeneratorTool.tsx')
  assert.doesNotMatch(source, /if \(item\.mediaType !== 'video'\) return null/)
  assert.match(source, /className="flex w-fit shrink-0 items-center justify-start/)
  assert.match(source, /item\.mediaType === 'video' \? \(\s*<video/s)
  assert.match(source, /item\.mediaType === 'video' \? 'video' : 'image'/)
})

test('video inline shared history preserves image model and mode metadata', () => {
  const source = read('src/components/AiVideoGeneratorTool.tsx')
  const imageBranch = source.match(/if \(mediaType === 'image'\) \{([\s\S]*?)\n  \}\n\n  const modelId = getVideoModelIdFromHistoryModel\(item\.model\)/)?.[1] || ''

  assert.notEqual(imageBranch, '', 'image history mapping branch should exist')
  assert.match(source, /mediaType === 'image'[\s\S]*getGenerationModelLabel\(item\.model\)/)
  assert.match(source, /mediaType === 'image'[\s\S]*inputUrls\.length > 0 \? 'image-to-image' : 'text-to-image'/)
  assert.match(source, /item\.mediaType === 'image'[\s\S]*getImageHistoryModeLabel\(item\.mode, text\)/)
  assert.doesNotMatch(imageBranch, /getVideoModelIdFromHistoryModel/)
  assert.doesNotMatch(imageBranch, /grok-1-5-video/)
})
