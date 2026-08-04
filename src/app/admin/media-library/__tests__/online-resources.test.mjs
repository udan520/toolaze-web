import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const source = readFileSync('src/app/admin/media-library/MediaLibraryAdminClient.tsx', 'utf8')

test('media library admin exposes online resources import flow', () => {
  assert.match(source, /线上资源池/)
  assert.match(source, /\/api\/admin\/media-library\/online-resources/)
  assert.match(source, /导入所选/)
  assert.match(source, /action:\s*['"]create_url['"]/)
})
