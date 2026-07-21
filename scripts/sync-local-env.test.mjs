import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

test('syncLocalEnv copies allowed shared keys without leaking values', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'toolaze-env-sync-'))
  const sharedEnvPath = join(dir, '.toolaze-shared.env.local')
  const targetEnvPath = join(dir, '.env.local')
  const secret = 'sk-test-secret-value'

  await writeFile(
    sharedEnvPath,
    [
      `KIE_AI_API_KEY=${secret}`,
      'CREEM_API_KEY=creem-secret-value',
      'UNRELATED_SECRET=should-not-copy',
      '',
    ].join('\n'),
    'utf8',
  )
  await writeFile(
    targetEnvPath,
    [
      'EXISTING_ONLY=keep-me',
      'KIE_AI_API_KEY=old-value',
      '',
    ].join('\n'),
    'utf8',
  )

  const { syncLocalEnv } = require('./sync-local-env.js')
  const result = await syncLocalEnv({ sharedEnvPath, targetEnvPath })
  const next = await readFile(targetEnvPath, 'utf8')
  const serialized = JSON.stringify(result)

  assert.match(next, /^EXISTING_ONLY=keep-me$/m)
  assert.match(next, /^KIE_AI_API_KEY=sk-test-secret-value$/m)
  assert.match(next, /^CREEM_API_KEY=creem-secret-value$/m)
  assert.doesNotMatch(next, /UNRELATED_SECRET/)
  assert.deepEqual(result.updated, ['KIE_AI_API_KEY'])
  assert.deepEqual(result.added, ['CREEM_API_KEY'])
  assert.doesNotMatch(serialized, /sk-test-secret-value|creem-secret-value/)
})

test('syncLocalEnv finds a shared env in ancestor workspace folders', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'toolaze-env-sync-nested-'))
  const projectRoot = join(dir, 'toolaze-worktrees', 'lp', 'ai-video-generator')
  const sharedEnvPath = join(dir, '.toolaze-shared.env.local')
  const targetEnvPath = join(projectRoot, '.env.local')

  await mkdir(projectRoot, { recursive: true })
  await writeFile(sharedEnvPath, 'KIE_AI_API_KEY=sk-nested-secret\n', 'utf8')

  const { syncLocalEnv } = require('./sync-local-env.js')
  const result = await syncLocalEnv({ projectRoot })
  const next = await readFile(targetEnvPath, 'utf8')

  assert.equal(result.source, sharedEnvPath)
  assert.match(next, /^KIE_AI_API_KEY=sk-nested-secret$/m)
})
