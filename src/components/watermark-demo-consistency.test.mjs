import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../../', import.meta.url)
const ENTRY_DEMO_IMAGE = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/watermark-remover-demo-before-after.webp'
const SOURCE_IMAGE = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/watermark-remover.jpg'
const read = (path) => readFileSync(new URL(path, root), 'utf8')
const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

test('Watermark Remover page demo keeps source image while entry covers use static demo image', () => {
  const shared = read('src/components/WatermarkRemoverDemoComparison.tsx')
  const generator = read('src/components/AiImageGenerationTool.tsx')
  const l2Page = read('src/components/blocks/ToolL2PageContent.tsx')
  const nav = read('src/components/Navigation.tsx')
  const home = read('src/components/home/HomePageMain.tsx')
  const homeCardImages = read('src/lib/home-advanced-ai-card-images.ts')
  const toolsCopy = read('src/app/ai-tools/copy.ts')
  const toolsGrid = read('src/app/ai-tools/AiToolsGrid.tsx')
  const adminSeo = read('scripts/admin-seo-server.js')

  assert.match(shared, /data-watermark-demo-comparison/)
  assert.match(shared, new RegExp(escaped(SOURCE_IMAGE)))
  assert.match(shared, new RegExp(escaped(ENTRY_DEMO_IMAGE)))
  assert.match(generator, /demoComparison/)
  assert.match(l2Page, new RegExp(escaped(SOURCE_IMAGE)))

  for (const source of [home, homeCardImages, toolsCopy, adminSeo]) {
    assert.match(source, new RegExp(escaped(ENTRY_DEMO_IMAGE)))
  }

  assert.match(nav, /AI_TOOLS_DEMO_IMAGES.watermarkRemover/)
  assert.match(nav, /w-14 aspect-\[4\/3\] rounded-lg object-cover/)
  assert.doesNotMatch(nav, /<WatermarkRemoverDemoComparison/)
  assert.doesNotMatch(toolsGrid, /WatermarkRemoverDemoComparison/)
})
