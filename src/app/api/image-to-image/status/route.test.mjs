import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
const tempStateDir = mkdtempSync(join(tmpdir(), 'toolaze-local-dev-test-'))
process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(tempStateDir, 'state.json')

test.after(() => {
  if (previousStateFile === undefined) {
    delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  } else {
    process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
  }
  delete globalThis[Symbol.for('toolaze.localDevAuthState')]
  rmSync(tempStateDir, { recursive: true, force: true })
})
import { POST as createImageTask } from '../route.js'
import { POST as checkImageTaskStatus } from './route.js'
import {
  getLocalDevCreditSummary,
  listLocalDevHistory,
  resetLocalDevCreditsForTests,
} from '../../_shared/local-dev-auth.js'

function createLocalDevGenerateRequest() {
  const formData = new FormData()
  formData.append('prompt', 'test prompt')
  formData.append('aspectRatio', '16:9')
  formData.append('resolution', '1K')
  formData.append('isImageToImage', 'false')
  formData.append('model', 'gpt-image-2')

  return new Request('http://localhost:3016/api/image-to-image', {
    method: 'POST',
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: formData,
  })
}

function createLocalDevImageToImageRequest() {
  const formData = new FormData()
  formData.append('prompt', 'Create a couple portrait')
  formData.append('aspectRatio', 'auto')
  formData.append('resolution', '1K')
  formData.append('outputFormat', 'PNG')
  formData.append('isImageToImage', 'true')
  formData.append('model', 'gpt-image-2')
  formData.append('toolSlug', 'ai-couple-photo-maker')
  formData.append('toolLabel', 'AI Couple Photo Maker')
  formData.append('sourcePath', '/ai-couple-photo-maker')
  formData.append('imageUrls', JSON.stringify([
    'https://assets.toolaze.com/uploads/person.png',
    'https://assets.toolaze.com/ai-couple-photo-maker/rainy-eiffel-4x3.jpg',
  ]))

  return new Request('http://localhost:3016/api/image-to-image', {
    method: 'POST',
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: formData,
  })
}

function createLocalDevStatusRequest(taskId, creditHold) {
  return new Request('http://localhost:3016/api/image-to-image/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: JSON.stringify({ taskId, creditHold }),
  })
}

test('local dev image generation is visible in account history while pending', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  const originalFetch = globalThis.fetch
  const originalCreemKey = process.env.CREEM_API_KEY
  resetLocalDevCreditsForTests(1000)
  process.env.KIE_AI_API_KEY = 'test-key'
  process.env.CREEM_API_KEY = 'creem-test-key'

  try {
    globalThis.fetch = async (url) => {
      if (String(url).includes('/v1/moderation/prompt')) {
        return Response.json({ id: 'mod_allow', object: 'moderation_result', decision: 'allow', usage: { units: 1 } })
      }
      return Response.json({ code: 200, data: { taskId: 'task_pending_history' } })
    }

    const createResponse = await createImageTask(createLocalDevImageToImageRequest())
    const createPayload = await createResponse.json()
    const pending = listLocalDevHistory(10)[0]

    assert.equal(createResponse.status, 200)
    assert.equal(pending.status, 'pending')
    assert.equal(pending.taskId, 'task_pending_history')
    assert.deepEqual(pending.inputUrls, [
      'https://assets.toolaze.com/uploads/person.png',
      'https://assets.toolaze.com/ai-couple-photo-maker/rainy-eiffel-4x3.jpg',
    ])
    assert.equal(pending.toolSlug, 'ai-couple-photo-maker')
    assert.deepEqual(pending.statusRequest.creditHold, createPayload.creditHold)
  } finally {
    resetLocalDevCreditsForTests(1000)
    globalThis.fetch = originalFetch
    if (originalKey === undefined) delete process.env.KIE_AI_API_KEY
    else process.env.KIE_AI_API_KEY = originalKey
    if (originalCreemKey === undefined) delete process.env.CREEM_API_KEY
    else process.env.CREEM_API_KEY = originalCreemKey
  }
})

test('local dev status refunds pre-deducted credits once when generation fails after task creation', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  const originalFetch = globalThis.fetch
  const originalCreemKey = process.env.CREEM_API_KEY
  resetLocalDevCreditsForTests(1000)
  process.env.KIE_AI_API_KEY = 'test-key'
  process.env.CREEM_API_KEY = 'creem-test-key'

  try {
    globalThis.fetch = async (url) => {
      if (String(url).includes('/v1/moderation/prompt')) {
        return Response.json({ id: 'mod_allow', object: 'moderation_result', decision: 'allow', usage: { units: 1 } })
      }

      return Response.json({ code: 200, data: { taskId: 'task_failed' } })
    }

    const createResponse = await createImageTask(createLocalDevGenerateRequest())
    const createPayload = await createResponse.json()

    assert.equal(createResponse.status, 200)
    assert.equal(createPayload.credits.balance, 990)
    assert.deepEqual(createPayload.creditHold, {
      provider: 'local-dev',
      taskId: 'task_failed',
      requiredCredits: 10,
      model: 'gpt-image-2',
      isImageToImage: false,
      metadata: {
        model: 'gpt-image-2',
        modelLabel: 'GPT Image 2',
        isImageToImage: false,
        resolution: '1K',
      },
    })

    globalThis.fetch = async () => {
      return Response.json({
        data: {
          state: 'fail',
          failMsg: 'Internal Error, Please try again later.',
        },
      })
    }

    const failedResponse = await checkImageTaskStatus(
      createLocalDevStatusRequest('task_failed', createPayload.creditHold),
    )
    const failedPayload = await failedResponse.json()

    assert.equal(failedResponse.status, 200)
    assert.equal(failedPayload.status, 'FAILED')
    assert.equal(failedPayload.refundedCredits, 10)
    assert.equal(failedPayload.credits.balance, 1000)
    assert.equal(listLocalDevHistory(10)[0].status, 'failed')

    const duplicateRefundResponse = await checkImageTaskStatus(
      createLocalDevStatusRequest('task_failed', createPayload.creditHold),
    )
    const duplicateRefundPayload = await duplicateRefundResponse.json()

    assert.equal(duplicateRefundPayload.refundedCredits, 0)
    assert.equal(getLocalDevCreditSummary().balance, 1000)
    const refundTransaction = getLocalDevCreditSummary().transactions.find((transaction) => (
      transaction.description === 'GPT Image 2 text-to-image generation refund'
    ))
    assert.deepEqual(refundTransaction?.metadata, {
      model: 'gpt-image-2',
      modelLabel: 'GPT Image 2',
      isImageToImage: false,
      resolution: '1K',
    })
    assert.equal(
      getLocalDevCreditSummary().transactions.filter((transaction) => (
        transaction.description === 'GPT Image 2 text-to-image generation refund'
      )).length,
      1,
    )
  } finally {
    resetLocalDevCreditsForTests(1000)
    globalThis.fetch = originalFetch
    if (originalKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = originalKey
    }
    if (originalCreemKey === undefined) {
      delete process.env.CREEM_API_KEY
    } else {
      process.env.CREEM_API_KEY = originalCreemKey
    }
  }
})
