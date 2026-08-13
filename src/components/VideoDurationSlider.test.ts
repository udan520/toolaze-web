import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const source = readFileSync(join(process.cwd(), 'src', 'components', 'VideoDurationSlider.tsx'), 'utf8')

test('video duration slider supports discrete video duration choices', () => {
  assert.match(source, /data-video-duration-slider/)
  assert.match(source, /type="range"/)
  assert.match(source, /max=\{maxIndex\}/)
  assert.match(source, /value=\{selectedIndex\}/)
  assert.match(source, /onChange=\{\(event\) => onChange\(options\[Number\(event\.target\.value\)\]\)\}/)
})
