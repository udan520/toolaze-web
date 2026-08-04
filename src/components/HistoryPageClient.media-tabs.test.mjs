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

test('History Recreate preserves the raw generation inputs for the target landing page', () => {
  assert.match(source, /recreateInputUrls\?: string\[\]/, 'history items should keep raw input URLs for Recreate')
  assert.match(source, /const rawInputUrls = Array\.isArray\(item\.inputUrls\) \? item\.inputUrls : \[\]/, 'normalizer should capture raw inputs before display normalization')
  assert.match(source, /recreateInputUrls: rawInputUrls/, 'normalized items should keep the raw inputs separately')
  assert.match(source, /buildHistoryRepromptPayload\(\{ \.\.\.item, inputUrls: item\.recreateInputUrls \|\| item\.inputUrls \}\)/, 'Recreate payload should use raw inputs rather than display-only references')
})

test('History preview renders every reference media item including motion reference videos', () => {
  assert.match(source, /function isReferenceVideoUrl\(url: string\)/, 'history should classify reference videos separately from images')
  assert.match(source, /data-history-reference-video/, 'history preview should expose reference video thumbnails')
  assert.match(source, /isReferenceVideoUrl\(url\) \? \(/, 'reference renderer should branch on video URLs')
  assert.match(source, /<video[\s\S]*src=\{url\}[\s\S]*preload="metadata"/, 'reference videos should render with video metadata previews')
  assert.match(source, /data-history-fullscreen-reference-video/, 'fullscreen reference preview should support videos')
  assert.match(source, /isReferenceVideoUrl\(fullScreenPreviewUrl\) \? \(/, 'fullscreen preview should not render reference videos through an img tag')
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


test('History cards expose a media-library import action only for admin users', () => {
  assert.match(source, /const \[isMediaLibraryAdmin, setIsMediaLibraryAdmin\] = useState\(false\)/)
  assert.match(source, /fetch\('\/api\/auth\/me', \{[\s\S]*credentials: 'include'/)
  assert.match(source, /setIsMediaLibraryAdmin\(Boolean\(data\.user\?\.isAdmin\)\)/)
  assert.match(source, /const handleImportToMediaLibrary = async \(item: GenerationHistoryItem\)/)
  assert.match(source, /fetch\('\/api\/media-library\/import-history', \{[\s\S]*method: 'POST'[\s\S]*credentials: 'include'[\s\S]*historyId: item\.id/)
  assert.match(source, /\{isMediaLibraryAdmin && !selectionMode && \(/)
  assert.match(source, /data-history-import-media-library/)
  assert.match(source, /copy\.importToMediaLibrary/)
})
