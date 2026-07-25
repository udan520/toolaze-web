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
})

test('video inline history loads both image and video records and left-aligns tabs', () => {
  const source = read('src/components/AiVideoGeneratorTool.tsx')
  assert.doesNotMatch(source, /if \(item\.mediaType !== 'video'\) return null/)
  assert.match(source, /className="flex w-fit shrink-0 items-center justify-start/)
  assert.match(source, /item\.mediaType === 'video' \? \(\s*<video/s)
  assert.match(source, /item\.mediaType === 'video' \? 'video' : 'image'/)
})
