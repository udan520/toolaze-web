import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getDefaultImageAspectRatio,
  orderImageAspectRatios,
  resolveSupportedImageAspectRatio,
} from './image-aspect-ratio-policy'

const options = (...values: string[]) => values.map((value) => ({
  value,
  label: value === 'auto' ? 'Auto' : value,
}))

test('image-to-image prefers auto and falls back to 16:9 when auto is unsupported', () => {
  assert.equal(
    getDefaultImageAspectRatio(options('1:1', '16:9', 'auto'), 'image-to-image'),
    'auto',
  )
  assert.equal(
    getDefaultImageAspectRatio(options('1:1', '16:9', '9:16'), 'image-to-image'),
    '16:9',
  )
})

test('text-to-image prefers 16:9 and falls back to the first supported ratio', () => {
  assert.equal(
    getDefaultImageAspectRatio(options('auto', '1:1', '16:9'), 'text-to-image'),
    '16:9',
  )
  assert.equal(
    getDefaultImageAspectRatio(options('1:1', '2:3', '3:2'), 'text-to-image'),
    '1:1',
  )
})

test('a remembered ratio is retained only when the next model supports it', () => {
  const supported = options('1:1', '16:9', '9:16')

  assert.equal(
    resolveSupportedImageAspectRatio(supported, 'text-to-image', '9:16'),
    '9:16',
  )
  assert.equal(
    resolveSupportedImageAspectRatio(supported, 'image-to-image', 'auto'),
    '16:9',
  )
})

test('ratios use common priority before preserving remaining model order', () => {
  const ordered = orderImageAspectRatios(options(
    '1:1',
    '2:1',
    '2:3',
    '3:2',
    '4:5',
    '16:9',
    '9:16',
    'auto',
    '3:4',
  ))

  assert.deepEqual(
    ordered.map(({ value }) => value),
    ['auto', '16:9', '9:16', '1:1', '4:5', '3:2', '2:3', '2:1', '3:4'],
  )
})
