import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const uploader = readFileSync(join(root, 'src/components/ReferenceImageUploader.tsx'), 'utf8')

test('global reference image uploader owns the shared interaction and visual contract', () => {
  assert.match(uploader, /data-reference-image-uploader/)
  assert.match(uploader, /data-reference-upload-tile/)
  assert.match(uploader, /onDrop=/)
  assert.match(uploader, /maxFileSizeMb/)
  assert.match(uploader, /<ImageReplaceButton/)
  assert.match(uploader, /<DeleteIcon/)
  assert.match(uploader, /max-w-28/)
  assert.match(uploader, /max-w-60/)
  assert.match(uploader, /grid-cols-3/)
})

test('AI reference-driven tools render the global uploader instead of private upload tiles', () => {
  for (const path of [
    'src/components/AiImageGenerationTool.tsx',
    'src/components/AiVideoGeneratorTool.tsx',
    'src/components/WatermarkRemover.tsx',
    'src/components/PhotoRestoration.tsx',
  ]) {
    const source = readFileSync(join(root, path), 'utf8')
    assert.match(source, /<ReferenceImageUploader/, `${path} should render the global reference uploader`)
  }
})

test('generators use compact reference tiles while primary-image tools keep large upload areas', () => {
  const imageGenerator = readFileSync(join(root, 'src/components/AiImageGenerationTool.tsx'), 'utf8')
  const videoGenerator = readFileSync(join(root, 'src/components/AiVideoGeneratorTool.tsx'), 'utf8')
  const watermarkRemover = readFileSync(join(root, 'src/components/WatermarkRemover.tsx'), 'utf8')
  const photoRestoration = readFileSync(join(root, 'src/components/PhotoRestoration.tsx'), 'utf8')

  assert.match(imageGenerator, /<ReferenceImageUploader[\s\S]*?size="compact"[\s\S]*?testIdPrefix="image-reference"/)
  assert.match(videoGenerator, /<ReferenceImageUploader[\s\S]*?size="compact"[\s\S]*?testIdPrefix="video-reference"/)
  assert.match(watermarkRemover, /<ReferenceImageUploader[\s\S]*?size="large"[\s\S]*?testIdPrefix="watermark-remover-reference"/)
  assert.match(photoRestoration, /<ReferenceImageUploader[\s\S]*?size="large"[\s\S]*?testIdPrefix="photo-restoration-reference"/)
})
