import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')

test('ToolL2PageContent applies published page demo assignments before rendering generator defaults', () => {
  assert.match(source, /applyPublishedPageDemoAssignments/)
  assert.match(source, /pageSlug:\s*tool/)
  assert.match(source, /locale/)
  assert.match(source, /includeDrafts:\s*process\.env\.NODE_ENV\s*!==\s*'production'/)
  assert.ok(
    source.indexOf('applyPublishedPageDemoAssignments') < source.indexOf('const topComp'),
    'page demo assignments should be applied before top tool defaults are derived',
  )
})

test('ToolL2PageContent keeps page demo assignments server-side for release-built HTML', () => {
  assert.doesNotMatch(source, /PageDemoRuntimeBridge/)
  assert.doesNotMatch(source, /page-demo-assignments\/published/)
})
