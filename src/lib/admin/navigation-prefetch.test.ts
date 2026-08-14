import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

test('admin sidebar does not prefetch remote-data pages', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/components/admin/AdminShell.tsx'),
    'utf8',
  )

  assert.match(source, /<Link[\s\S]*?prefetch=\{false\}[\s\S]*?href=\{item\.href\}/)
})
