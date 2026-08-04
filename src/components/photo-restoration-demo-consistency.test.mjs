import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../../', import.meta.url)
const DEMO_IMAGE = 'https://assets.toolaze.com/home-advanced-ai/photo-restoration-demo-before-after.webp'
const read = (path) => readFileSync(new URL(path, root), 'utf8')
const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

test('Photo Restoration demo and entry covers use the same R2 image asset', () => {
  const sources = [
    'src/components/blocks/ToolL2PageContent.tsx',
    'src/components/Navigation.tsx',
    'src/components/home/HomePageMain.tsx',
    'src/lib/home-advanced-ai-card-images.ts',
    'src/app/ai-tools/copy.ts',
    'scripts/admin-seo-server.js',
  ]

  for (const source of sources) {
    assert.match(read(source), new RegExp(escaped(DEMO_IMAGE)), `${source} must use the shared Photo Restoration R2 demo image`)
  }
})
