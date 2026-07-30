import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './generation-contract.js'
import {
  IMAGE_GENERATION_CONTRACT_VERSION,
  SUPPORTED_IMAGE_GENERATION_MODEL_IDS,
} from '../_shared/image-generation-contract.mjs'

test('generation contract exposes the deployed Cloudflare model version', async () => {
  const response = await onRequest({
    request: new Request('https://toolaze-web.pages.dev/api/generation-contract'),
  })
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.version, IMAGE_GENERATION_CONTRACT_VERSION)
  assert.deepEqual(body.models, SUPPORTED_IMAGE_GENERATION_MODEL_IDS)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

test('generation contract remains read-only', async () => {
  const response = await onRequest({
    request: new Request('https://toolaze-web.pages.dev/api/generation-contract', { method: 'POST' }),
  })

  assert.equal(response.status, 405)
})
