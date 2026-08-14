import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

test('loaded Google avatars are not kept transparent by a missed load event', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/components/admin/UserDashboard.tsx'),
    'utf8',
  )

  assert.doesNotMatch(source, /avatarLoaded/)
  assert.doesNotMatch(source, /opacity-0/)
  assert.match(source, /onError=\{\(\) => setAvatarFailed\(true\)\}/)
})
