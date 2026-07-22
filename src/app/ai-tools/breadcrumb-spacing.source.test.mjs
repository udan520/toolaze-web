import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync('src/app/ai-tools/AiToolsPageContent.tsx', 'utf8')

test('AI Tools breadcrumb shares the title container with compact spacing', () => {
  assert.match(source, /<main[\s\S]*?<Breadcrumb[\s\S]*?variant="inline"[\s\S]*?<h1[^>]*mt-4/)
  assert.equal(source.indexOf('<Breadcrumb'), source.lastIndexOf('<Breadcrumb'))
})
