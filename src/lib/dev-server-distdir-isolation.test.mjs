import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('admin media dev server uses a separate Next dist dir from the 3006 app server', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  const nextConfigSource = readFileSync('next.config.js', 'utf8')

  assert.match(nextConfigSource, /process\.env\.NEXT_DIST_DIR/)
  assert.match(nextConfigSource, /distDir/)
  assert.match(packageJson.scripts['admin:media'], /NEXT_DIST_DIR=\.next-admin-media/)
  assert.match(packageJson.scripts['admin:media'], /next dev -p 3010/)
})
