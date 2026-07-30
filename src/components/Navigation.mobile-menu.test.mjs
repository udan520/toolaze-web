import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')

test('mobile navigation keeps every locale reachable above the browser safe area', () => {
  assert.match(source, /max-h-\[calc\(100dvh-70px\)\]/)
  assert.match(source, /pb-\[calc\(2rem\+env\(safe-area-inset-bottom\)\)\]/)
})
