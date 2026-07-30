import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./HistoryPageClient.tsx', import.meta.url), 'utf8')

test('History page exposes All, Images, and Videos filters over one shared history feed', () => {
  assert.match(source, /type HistoryFilter = 'all' \| 'image' \| 'video'/)
  assert.match(source, /const \[activeFilter, setActiveFilter\] = useState<HistoryFilter>\('all'\)/)
  assert.match(source, /fetch\('\/api\/history\?limit=200', \{[\s\S]*credentials: 'include'/)
  assert.doesNotMatch(source, /\/api\/history\?limit=200[^\n]*toolSlug/)
  assert.match(source, /data-history-filter=/)
  assert.match(source, /copy\.filterAll/)
  assert.match(source, /copy\.filterImages/)
  assert.match(source, /copy\.filterVideos/)
  assert.match(source, /activeFilter === 'all' \|\| item\.mediaType === activeFilter/)
})

test('History cards render both generated images and generated videos', () => {
  assert.match(source, /item\.mediaType === 'video' \? \(/)
  assert.match(source, /<video[\s\S]*src=\{item\.outputUrl\}/)
  assert.match(source, /<img[\s\S]*getHistoryLibraryThumbnailUrl\(item\.outputUrl\)/)
})

test('History normalizer treats video file URLs as video even when legacy media type is wrong', () => {
  assert.match(source, /function isVideoHistoryUrl\(url: string\)/)
  assert.match(source, /item\.mediaType === 'video' \|\| isVideoHistoryUrl\(item\.outputUrl\) \? 'video' : 'image'/)
})

test('History page supports selecting records for batch download and delete', () => {
  assert.match(source, /const \[selectionMode, setSelectionMode\] = useState\(false\)/)
  assert.match(source, /const \[selectedIds, setSelectedIds\] = useState<Set<string>>/)
  assert.match(source, /data-history-enter-bulk-select/)
  assert.match(source, /data-history-bulk-actions/)
  assert.match(source, /data-history-select-all/)
  assert.match(source, /data-history-card-select/)
  assert.match(source, /\{selectionMode && \(\s*<label[\s\S]*data-history-card-select/)
  assert.match(source, /data-history-delete-confirm-dialog/)
  assert.doesNotMatch(source, /window\.confirm/)
  assert.match(source, /handleBulkDownload/)
  assert.match(source, /handleBulkDelete/)
  assert.match(source, /copy\.batchActions/)
  assert.match(source, /copy\.downloadSelected/)
  assert.match(source, /copy\.deleteSelected/)
})

test('History Recreate uses an existing localized generator route', () => {
  assert.match(source, /buildHistoryRecreateHref\(item, locale\)/)
  assert.doesNotMatch(source, /function getModelHref/)
  assert.doesNotMatch(source, /window\.location\.href = `?\/model\//)
})

test('History h5 preview keeps compact actions and a four-line scrolling prompt', () => {
  assert.match(source, /data-history-preview-actions[\s\S]*grid-cols-\[minmax\(0,1fr\)_44px_44px\]/)
  assert.match(source, /data-history-preview-prompt[\s\S]*max-h-24[\s\S]*overflow-y-auto[\s\S]*overscroll-contain/)
  assert.match(source, /\{copy\.recreate\}/)
  assert.doesNotMatch(source, /\{copy\.createSimilar\}/)
})

test('History prompt copy reports success and failure through the global notice', () => {
  assert.match(source, /const handleCopyPrompt = async/)
  assert.match(source, /dispatchToolazeTopNotice\(\{[\s\S]*type: 'success'[\s\S]*copy\.promptCopied/)
  assert.match(source, /dispatchToolazeTopNotice\(\{[\s\S]*type: 'error'[\s\S]*copy\.promptCopyFailed/)
})
