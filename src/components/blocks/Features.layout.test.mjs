import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const source = readFileSync(join(process.cwd(), 'src', 'components', 'blocks', 'Features.tsx'), 'utf8')

test('Features section does not use viewport-width full-bleed styles that overflow pages', () => {
  assert.equal(source.includes("width: '100vw'"), false)
  assert.equal(source.includes("marginLeft: '-50vw'"), false)
  assert.equal(source.includes("marginRight: '-50vw'"), false)
  assert.match(source, /className=\{`\$\{bgClass\} w-full max-w-full overflow-x-hidden px-6 py-24`\}/)
  assert.match(source, /mx-auto w-full max-w-6xl min-w-0/)
})

test('Features section wraps long headings and card text inside the content width', () => {
  assert.match(source, /max-w-4xl[\s\S]*break-words/)
  assert.match(source, /grid w-full min-w-0/)
  assert.match(source, /min-w-0 rounded-lg/)
  assert.match(source, /break-words text-center text-lg/)
  assert.match(source, /break-words text-center text-sm/)
})
