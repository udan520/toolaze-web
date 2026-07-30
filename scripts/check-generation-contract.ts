import assert from 'node:assert/strict'
import { AI_IMAGE_GENERATOR_MODELS } from '../src/lib/ai-image-generator-config'
import {
  IMAGE_GENERATION_CONTRACT_VERSION,
  SUPPORTED_IMAGE_GENERATION_MODEL_IDS,
} from '../functions/_shared/image-generation-contract.mjs'

const frontendModels = Object.keys(AI_IMAGE_GENERATOR_MODELS).sort()
const backendModels = [...SUPPORTED_IMAGE_GENERATION_MODEL_IDS].sort()

async function main() {
  assert.deepEqual(
    frontendModels,
    backendModels,
    'Vercel model config and Cloudflare supported model list differ. Update both before release.',
  )

  console.log(`Generation model source contract OK: ${IMAGE_GENERATION_CONTRACT_VERSION}`)

  if (process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production') {
    const backendOrigin = (process.env.ACCOUNT_API_BACKEND || 'https://toolaze-web.pages.dev').replace(/\/+$/, '')
    const response = await fetch(`${backendOrigin}/api/generation-contract`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      throw new Error(
        `Cloudflare generation contract is unavailable (${response.status}). Deploy Cloudflare Production before Vercel Production.`,
      )
    }

    const remote = await response.json() as { version?: string; models?: string[] }
    assert.equal(
      remote.version,
      IMAGE_GENERATION_CONTRACT_VERSION,
      `Cloudflare generation contract is ${remote.version || 'missing'}, but Vercel requires ${IMAGE_GENERATION_CONTRACT_VERSION}. Deploy Cloudflare Production first.`,
    )
    assert.deepEqual(
      [...(remote.models || [])].sort(),
      backendModels,
      'Cloudflare reports a different generation model list. Deploy Cloudflare Production first.',
    )

    console.log(`Cloudflare Production contract OK: ${remote.version}`)
  }
}

void main()
