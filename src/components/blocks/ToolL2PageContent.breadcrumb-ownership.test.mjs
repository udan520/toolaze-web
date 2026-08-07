import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')

test('video generator heroes own the only visible breadcrumb on affected landing pages', () => {
  const match = source.match(/const toolHeroOwnsBreadcrumb = \[([\s\S]*?)\]\.includes\(topComp\)/)

  assert.ok(match, 'toolHeroOwnsBreadcrumb list should exist')

  for (const topComponent of [
    'ai-asmr-video-generator',
    'kling-ai-video-generator',
    'kling-3',
    'seedance-2',
  ]) {
    assert.match(match[1], new RegExp(`['"]${topComponent}['"]`))
  }
})
