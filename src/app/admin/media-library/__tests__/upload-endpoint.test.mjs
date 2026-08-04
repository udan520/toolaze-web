import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const source = readFileSync('src/app/admin/media-library/MediaLibraryAdminClient.tsx', 'utf8')

test('media library upload uses the shared upload URL resolver', () => {
  assert.match(source, /import \{ getImageUploadUrl \} from ['"]@\/lib\/upload-url['"]/)
  assert.match(source, /requestJson\(getImageUploadUrl\(\)\s*,/)
  assert.doesNotMatch(source, /requestJson\(['"]\/api\/upload['"]\s*,/)
})
