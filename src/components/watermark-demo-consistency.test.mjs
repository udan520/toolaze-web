import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../../', import.meta.url)
const read = (path) => readFileSync(new URL(path, root), 'utf8')

test('watermark demo uses shared visuals without expanding navigation thumbnails', () => {
  const shared = read('src/components/WatermarkRemoverDemoComparison.tsx')
  const generator = read('src/components/AiImageGenerationTool.tsx')
  const l2Page = read('src/components/blocks/ToolL2PageContent.tsx')
  const nav = read('src/components/Navigation.tsx')
  const toolsGrid = read('src/app/ai-tools/AiToolsGrid.tsx')

  assert.match(shared, /data-watermark-demo-comparison/)
  assert.match(shared, /Toolaze Sample/)
  assert.match(generator, /demoComparison/)
  assert.match(l2Page, /demoComparison=/)
  assert.doesNotMatch(nav, /<WatermarkRemoverDemoComparison/)
  assert.match(nav, /AI_TOOLS_DEMO_IMAGES.watermarkRemover/)
  assert.match(nav, /w-14 aspect-\[4\/3\] rounded-lg object-cover/)
  assert.match(toolsGrid, /WatermarkRemoverDemoComparison/)
})
