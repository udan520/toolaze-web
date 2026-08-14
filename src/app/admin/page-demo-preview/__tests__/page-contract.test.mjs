import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const previewSource = readFileSync('src/app/admin/page-demo-preview/page.tsx', 'utf8')

test('page demo preview is a noindex admin-only preview route', () => {
  assert.match(previewSource, /robots:\s*['"]noindex,\s*nofollow['"]/)
  assert.match(previewSource, /isAdminRequestAllowed/)
  assert.match(previewSource, /notFound\(\)/)
  assert.match(previewSource, /loadPageDemoAssignments/)
  assert.match(previewSource, /Draft \/ Published 预览/)
})

test('page demo preview shows output, prompt, params and related input assets', () => {
  assert.match(previewSource, /Output Demo/)
  assert.match(previewSource, /Default Prompt/)
  assert.match(previewSource, /参考 Input/)
  assert.match(previewSource, /生成参数/)
})

test('page demo preview labels locale as language scope', () => {
  assert.match(previewSource, /语言范围/)
  assert.match(previewSource, /formatLocaleScope/)
  assert.match(previewSource, /全部语言/)
})
