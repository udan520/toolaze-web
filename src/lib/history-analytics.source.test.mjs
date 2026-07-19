import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

test('login modal view uses a clear login event name', () => {
  const navigation = read('src/components/Navigation.tsx')
  const docs = read('docs/ANALYTICS_TRACKING.md')

  assert.match(navigation, /trackToolazeEvent\('login_modal_view'/)
  assert.match(navigation, /authModalOpen[\s\S]*trackToolazeEvent\('login_modal_view'/)
  assert.match(navigation, /page_path/)
  assert.match(docs, /`login_modal_view`/)
  assert.doesNotMatch(navigation, /auth_modal_view/)
  assert.doesNotMatch(docs, /`auth_modal_view`/)
})

test('generation history action clicks are tracked without prompt or media URLs', () => {
  const helper = read('src/lib/generation-history-analytics.ts')
  const historyPage = read('src/components/HistoryPageClient.tsx')
  const imageTool = read('src/components/AiImageGenerationTool.tsx')
  const docs = read('docs/ANALYTICS_TRACKING.md')

  const eventNames = [
    'generation_history_recreate_button_click',
    'generation_history_download_button_click',
    'generation_history_delete_button_click',
  ]

  for (const eventName of eventNames) {
    assert.match(helper, new RegExp(`trackToolazeEvent\\('${eventName}'`))
    assert.ok(docs.includes('`' + eventName + '`'))
  }

  assert.match(historyPage, /trackGenerationHistoryRecreateClick\(item, \{ surface: 'history_page'/)
  assert.match(historyPage, /trackGenerationHistoryDownloadClick\(item, \{ surface: 'history_page'/)
  assert.match(historyPage, /trackGenerationHistoryDeleteClick\(item, \{ surface: 'history_page'/)
  assert.match(imageTool, /trackGenerationHistoryRecreateClick\(item, \{ surface: 'inline_generator_history'/)
  assert.match(imageTool, /trackGenerationHistoryDownloadClick\(item, \{ surface: 'inline_generator_history'/)
  assert.match(imageTool, /trackGenerationHistoryDeleteClick\(item, \{ surface: 'inline_generator_history'/)

  assert.doesNotMatch(helper, /prompt/)
  assert.doesNotMatch(helper, /outputUrl|outputPreview|imageUrl|inputPreview/)
  assert.doesNotMatch(helper, /generation_history_recreate_click/)
  assert.doesNotMatch(helper, /generation_history_download_click/)
  assert.doesNotMatch(helper, /generation_history_delete_click/)
})
