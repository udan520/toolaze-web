import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const checkedFiles = [
  'src/components/AiImageGenerationTool.tsx',
  'src/components/ImageCompressor.tsx',
  'src/components/ImageConverter.tsx',
  'src/components/WatermarkRemover.tsx',
]

test('tool toasts render centered below the sticky navigation', () => {
  for (const file of checkedFiles) {
    const source = readFileSync(file, 'utf8')

    assert.equal(
      source.includes('fixed bottom-6 right-6'),
      false,
      `${file} still renders toast notifications in the bottom right`,
    )
    assert.equal(
      source.includes('fixed right-4 top-20'),
      false,
      `${file} still renders toast notifications in the top right`,
    )
  }
})

test('watermark remover legacy toast uses the shared top-center position', () => {
  const source = readFileSync('src/components/WatermarkRemover.tsx', 'utf8')

  assert.match(source, /fixed left-1\/2 top-\[90px\]/)
  assert.match(source, /-translate-x-1\/2/)
})
