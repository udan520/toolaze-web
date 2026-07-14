import assert from 'node:assert/strict'
import test from 'node:test'
import { resolvePromptInsertMode, resolvePromptInsertRemoteImageUrls } from './prompt-insert-mode'

test('keeps image-to-image mode when prompt example explicitly needs an uploaded reference', () => {
  assert.equal(
    resolvePromptInsertMode({
      requestedMode: 'image-to-image',
      hasReferenceImages: false,
    }),
    'image-to-image',
  )
})

test('uses image-to-image mode when reusable reference images are present', () => {
  assert.equal(
    resolvePromptInsertMode({
      requestedMode: 'text-to-image',
      hasReferenceImages: true,
    }),
    'image-to-image',
  )
})

test('falls back to text-to-image for prompt-only inserts without an explicit mode', () => {
  assert.equal(
    resolvePromptInsertMode({
      hasReferenceImages: false,
    }),
    'text-to-image',
  )
})

test('preserves existing remote references for image-to-image prompt-only inserts', () => {
  assert.deepEqual(
    resolvePromptInsertRemoteImageUrls({
      nextMode: 'image-to-image',
      currentRemoteImageUrls: ['/ai-hairstyle-changer/default-reference.png'],
      referenceUrls: [],
      maxImages: 4,
    }),
    ['/ai-hairstyle-changer/default-reference.png'],
  )
})

test('clears existing remote references for text-to-image prompt-only inserts', () => {
  assert.deepEqual(
    resolvePromptInsertRemoteImageUrls({
      nextMode: 'text-to-image',
      currentRemoteImageUrls: ['/ai-hairstyle-changer/default-reference.png'],
      referenceUrls: [],
      maxImages: 4,
    }),
    [],
  )
})
