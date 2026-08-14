import assert from 'node:assert/strict'
import test from 'node:test'
import { formatAdminGenerationFailureReason } from './generation-failure-reason'

test('explains generic upstream internal errors when a failed generation used reference images', () => {
  assert.equal(
    formatAdminGenerationFailureReason({
      status: 'failed',
      failureReason: 'Internal Error',
      inputUrls: ['https://assets.toolaze.com/uploads/reference.png'],
    }),
    '上游生成失败，可能由参考图内容安全限制导致（原始错误：Internal Error）',
  )
})

test('keeps explicit provider safety errors visible with a clearer prefix', () => {
  assert.equal(
    formatAdminGenerationFailureReason({
      status: 'failed',
      failureReason: 'Inappropriate content, please try another prompt.',
      inputUrls: ['https://assets.toolaze.com/uploads/reference.png'],
    }),
    '上游内容安全限制：Inappropriate content, please try another prompt.',
  )
})

test('leaves ordinary failure reasons unchanged', () => {
  assert.equal(
    formatAdminGenerationFailureReason({
      status: 'failed',
      failureReason: 'Provider timeout',
      inputUrls: [],
    }),
    'Provider timeout',
  )
})

test('does not show a failure reason for successful records', () => {
  assert.equal(
    formatAdminGenerationFailureReason({
      status: 'succeeded',
      failureReason: 'Internal Error',
      inputUrls: ['https://assets.toolaze.com/uploads/reference.png'],
    }),
    null,
  )
})
