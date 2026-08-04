import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const pageSource = readFileSync('src/app/admin/media-library/page.tsx', 'utf8')
const clientSource = readFileSync('src/app/admin/media-library/MediaLibraryAdminClient.tsx', 'utf8')

test('media library admin page has an online D1 mode for production history imports', () => {
  assert.match(pageSource, /isOnlineMediaLibraryAdminHost/)
  assert.match(pageSource, /mode: 'online'/)
  assert.match(pageSource, /mode=\{mode\}/)
  assert.match(pageSource, /Cloudflare D1/)
  assert.match(clientSource, /\/api\/media-library\/assets/)
})
