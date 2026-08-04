import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

test('login modal view uses a clear login event name', () => {
  const navigation = read('src/components/Navigation.tsx')
  const docs = read('docs/ANALYTICS_TRACKING.md')
  const signInFlow = navigation.slice(
    navigation.indexOf('function startGoogleSignIn()'),
    navigation.indexOf('async function startDevLogin()'),
  )

  assert.match(navigation, /trackToolazeEvent\('login_modal_view'/)
  assert.match(navigation, /authModalOpen[\s\S]*trackToolazeEvent\('login_modal_view'/)
  assert.match(signInFlow, /trackToolazeEvent\('login_google_click'/)
  assert.ok(
    signInFlow.indexOf("trackToolazeEvent('login_google_click'") <
      signInFlow.indexOf('window.open(getSignInHref()'),
    'Google login click should be tracked before opening the OAuth popup',
  )
  assert.match(signInFlow, /auth_provider:\s*'google'/)
  assert.match(navigation, /page_path/)
  assert.match(docs, /`login_modal_view`/)
  assert.match(docs, /`login_google_click`/)
  assert.doesNotMatch(navigation, /auth_modal_view/)
  assert.doesNotMatch(docs, /`auth_modal_view`/)
  assert.doesNotMatch(signInFlow, /email|userId|token|credential/)
})

test('generation history action clicks are tracked without prompt or media URLs', () => {
  const helper = read('src/lib/generation-history-analytics.ts')
  const historyPage = read('src/components/HistoryPageClient.tsx')
  const imageTool = read('src/components/AiImageGenerationTool.tsx')
  const docs = read('docs/ANALYTICS_TRACKING.md')

  const eventNames = [
    'history_recreate_click',
    'history_download_click',
    'history_delete_click',
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
  assert.doesNotMatch(helper, /generation_history_recreate_button_click/)
  assert.doesNotMatch(helper, /generation_history_download_button_click/)
  assert.doesNotMatch(helper, /generation_history_delete_button_click/)
})
