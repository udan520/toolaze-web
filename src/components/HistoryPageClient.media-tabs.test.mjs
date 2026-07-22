import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./HistoryPageClient.tsx', import.meta.url), 'utf8')

test('History page exposes All, Images, and Videos filters over one shared history feed', () => {
  assert.match(source, /type HistoryFilter = 'all' \| 'image' \| 'video'/)
  assert.match(source, /const \[activeFilter, setActiveFilter\] = useState<HistoryFilter>\('all'\)/)
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
