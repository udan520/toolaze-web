import assert from 'node:assert/strict'
import test from 'node:test'
import {
  GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE,
  shouldDeleteGenerationHistoryItem,
} from './generation-history-delete-confirm'

test('uses the irreversible generation history delete confirmation copy', () => {
  assert.equal(
    GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE,
    'Delete this image from your generation history? Once deleted, it cannot be recovered.',
  )
})

test('does not delete when the user cancels the generation history confirmation', () => {
  const shouldDelete = shouldDeleteGenerationHistoryItem((message) => {
    assert.equal(message, GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE)
    return false
  })

  assert.equal(shouldDelete, false)
})

test('deletes when the user confirms the generation history confirmation', () => {
  const shouldDelete = shouldDeleteGenerationHistoryItem((message) => {
    assert.equal(message, GENERATION_HISTORY_DELETE_CONFIRM_MESSAGE)
    return true
  })

  assert.equal(shouldDelete, true)
})
