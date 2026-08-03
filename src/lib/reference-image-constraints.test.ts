import assert from 'node:assert/strict'
import test from 'node:test'
import { getReferenceImageConstraintError } from './reference-image-constraints'

const motionControlConstraints = {
  minDimensionPx: 300,
  aspectRatioMin: 2 / 5,
  aspectRatioMax: 5 / 2,
}

test('reference image constraints accept KIE-compliant character images', () => {
  assert.equal(
    getReferenceImageConstraintError({ width: 720, height: 1280 }, motionControlConstraints),
    null,
  )
  assert.equal(
    getReferenceImageConstraintError({ width: 1024, height: 768 }, motionControlConstraints),
    null,
  )
})

test('reference image constraints reject images at or below the minimum dimension', () => {
  assert.equal(
    getReferenceImageConstraintError({ width: 300, height: 800 }, motionControlConstraints),
    'dimension',
  )
  assert.equal(
    getReferenceImageConstraintError({ width: 800, height: 299 }, motionControlConstraints),
    'dimension',
  )
})

test('reference image constraints reject images outside the supported aspect ratio range', () => {
  assert.equal(
    getReferenceImageConstraintError({ width: 2000, height: 600 }, motionControlConstraints),
    'aspectRatio',
  )
  assert.equal(
    getReferenceImageConstraintError({ width: 600, height: 2000 }, motionControlConstraints),
    'aspectRatio',
  )
})
