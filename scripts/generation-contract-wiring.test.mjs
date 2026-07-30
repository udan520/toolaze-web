import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const root = new URL('../', import.meta.url)
const packageJson = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))
const prebuildSource = readFileSync(new URL('scripts/prebuild-check.js', root), 'utf8')
const imageApiSource = readFileSync(new URL('functions/api/image-to-image.js', root), 'utf8')

test('generation model contract is wired into local and Vercel release checks', () => {
  assert.equal(packageJson.scripts['check:generation-contract'], 'tsx scripts/check-generation-contract.ts')
  assert.match(prebuildSource, /npm run check:generation-contract/)
  assert.ok(existsSync(new URL('scripts/check-generation-contract.ts', root)))
})

test('Cloudflare exposes and consumes the shared generation model contract', () => {
  assert.ok(existsSync(new URL('functions/_shared/image-generation-contract.mjs', root)))
  assert.ok(existsSync(new URL('functions/api/generation-contract.js', root)))
  assert.match(imageApiSource, /SUPPORTED_IMAGE_GENERATION_MODEL_IDS/)
})
