import assert from 'node:assert/strict'
import test from 'node:test'

import { insertPromptReferenceMention, splitPromptReferenceMentions } from './prompt-reference-mentions'

test('replaces a typed at-sign trigger with the selected mention', () => {
  const result = insertPromptReferenceMention({
    value: 'Move @ toward the camera',
    selectionStart: 6,
    selectionEnd: 6,
    triggerIndex: 5,
    mention: '@Image 1',
  })

  assert.deepEqual(result, {
    value: 'Move @Image 1 toward the camera',
    caret: 14,
  })
})

test('inserts a mention at the button-triggered caret with readable spacing', () => {
  const result = insertPromptReferenceMention({
    value: 'Move toward the camera',
    selectionStart: 5,
    selectionEnd: 5,
    triggerIndex: null,
    mention: '@Video 1',
  })

  assert.deepEqual(result, {
    value: 'Move @Video 1 toward the camera',
    caret: 14,
  })
})

test('replaces the current selection when opened from the mention button', () => {
  const result = insertPromptReferenceMention({
    value: 'Use this clip for pacing',
    selectionStart: 4,
    selectionEnd: 13,
    triggerIndex: null,
    mention: '@Audio 1',
  })

  assert.deepEqual(result, {
    value: 'Use @Audio 1 for pacing',
    caret: 13,
  })
})

test('does not add duplicate spaces around an inserted mention', () => {
  const result = insertPromptReferenceMention({
    value: 'Use  for pacing',
    selectionStart: 4,
    selectionEnd: 4,
    triggerIndex: null,
    mention: '@First Frame',
  })

  assert.deepEqual(result, {
    value: 'Use @First Frame for pacing',
    caret: 17,
  })
})

test('preserves line breaks and indentation around an inserted mention', () => {
  const result = insertPromptReferenceMention({
    value: 'First shot\nMove @\n    Next shot',
    selectionStart: 17,
    selectionEnd: 17,
    triggerIndex: 16,
    mention: '@Image 1',
  })

  assert.deepEqual(result, {
    value: 'First shot\nMove @Image 1\n    Next shot',
    caret: 24,
  })
})

test('places the caret after a separator for continued typing', () => {
  const result = insertPromptReferenceMention({
    value: 'Use ',
    selectionStart: 4,
    selectionEnd: 4,
    triggerIndex: null,
    mention: '@Image 1',
  })
  const continuedValue = `${result.value.slice(0, result.caret)}gently${result.value.slice(result.caret)}`

  assert.deepEqual(result, {
    value: 'Use @Image 1 ',
    caret: 13,
  })
  assert.equal(continuedValue, 'Use @Image 1 gently')
})

test('splits current resource mentions from ordinary prompt text', () => {
  const image = { label: '@Image 1', id: 'image-1' }
  const result = splitPromptReferenceMentions('Use @Image 1 with a slow push-in.', [image])

  assert.deepEqual(result, [
    { text: 'Use ' },
    { text: '@Image 1', reference: image },
    { text: ' with a slow push-in.' },
  ])
})

test('keeps a prompt without current resource mentions as ordinary text', () => {
  const image = { label: '@Image 1', id: 'image-1' }
  const result = splitPromptReferenceMentions('Use a slow push-in.', [image])

  assert.deepEqual(result, [{ text: 'Use a slow push-in.' }])
})

test('splits repeated current resource mentions in source order', () => {
  const image = { label: '@Image 1', id: 'image-1' }
  const result = splitPromptReferenceMentions('@Image 1 then @Image 1', [image])

  assert.deepEqual(result, [
    { text: '@Image 1', reference: image },
    { text: ' then ' },
    { text: '@Image 1', reference: image },
  ])
})

test('matches the longest current resource label first', () => {
  const imageOne = { label: '@Image 1', id: 'image-1' }
  const imageTen = { label: '@Image 10', id: 'image-10' }
  const result = splitPromptReferenceMentions('@Image 10', [imageOne, imageTen])

  assert.deepEqual(result, [{ text: '@Image 10', reference: imageTen }])
})

test('does not match a current resource label inside a longer token', () => {
  const image = { label: '@Image 1', id: 'image-1' }

  assert.deepEqual(splitPromptReferenceMentions('@Image 10', [image]), [{ text: '@Image 10' }])
  assert.deepEqual(splitPromptReferenceMentions('@Image 1abc', [image]), [{ text: '@Image 1abc' }])
})
