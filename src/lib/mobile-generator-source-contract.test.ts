import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const projectRoot = process.cwd()
const aiImageGenerationSource = readFileSync(join(projectRoot, 'src/components/AiImageGenerationTool.tsx'), 'utf8')
const navigationSource = readFileSync(join(projectRoot, 'src/components/Navigation.tsx'), 'utf8')
const rootLayoutSource = readFileSync(join(projectRoot, 'src/app/layout.tsx'), 'utf8')
const historyPageSource = readFileSync(join(projectRoot, 'src/components/HistoryPageClient.tsx'), 'utf8')
const creditsPageSource = readFileSync(join(projectRoot, 'src/components/CreditsPageClient.tsx'), 'utf8')

test('mobile generator keeps the result panel directly after the generate button', () => {
  const buttonIndex = aiImageGenerationSource.indexOf('data-generate-button')
  const mobilePanelIndex = aiImageGenerationSource.indexOf('renderMobileGenerationPanel()', buttonIndex)

  assert.ok(buttonIndex > -1, 'generate button should have a stable marker')
  assert.ok(mobilePanelIndex > buttonIndex, 'mobile generation panel should render after the generate button')
  assert.ok(
    mobilePanelIndex - buttonIndex < 3500,
    'mobile generation panel should stay immediately under the generate button',
  )
})

test('mobile generating state uses a 4:3 preview area', () => {
  assert.match(aiImageGenerationSource, /data-mobile-generating-card[\s\S]*aspect-\[4\/3\]/)
})

test('mobile history detail exposes result actions after selecting a history item', () => {
  const panelIndex = aiImageGenerationSource.indexOf('data-mobile-generation-panel')
  const currentResultIndex = aiImageGenerationSource.indexOf('currentResult ?', panelIndex)
  const fallbackIndex = aiImageGenerationSource.indexOf(') : isUserSignedIn ?', currentResultIndex)
  const currentResultBlock = aiImageGenerationSource.slice(currentResultIndex, fallbackIndex)

  assert.ok(panelIndex > -1, 'mobile generation panel should have a stable marker')
  assert.ok(currentResultIndex > panelIndex, 'mobile panel should render the current result branch')
  assert.ok(fallbackIndex > currentResultIndex, 'mobile current result branch should be bounded')
  assert.match(currentResultBlock, /data-mobile-result-actions/)
  assert.match(currentResultBlock, /handleRecreateFromCurrent/)
  assert.match(currentResultBlock, /handleDownload\(currentResult\.outputPreview/)
  assert.match(currentResultBlock, /handleDeleteCurrentResult/)
})

test('history preview modal keeps action buttons reachable on h5', () => {
  assert.match(historyPageSource, /data-history-preview-modal/)
  assert.match(historyPageSource, /data-history-preview-details/)
  assert.match(historyPageSource, /data-history-preview-actions/)
  assert.match(historyPageSource, /data-history-preview-modal[\s\S]*overflow-y-auto[\s\S]*md:overflow-hidden/)
  assert.match(historyPageSource, /data-history-preview-actions[\s\S]*sticky[\s\S]*bottom-0/)
})

test('history preview shows wrapped hair tool labels with the underlying model', () => {
  assert.match(historyPageSource, /getWrappedHairToolHistoryDisplay/)
  assert.match(historyPageSource, /previewHistoryDisplay\?\.showToolLabel[\s\S]*previewHistoryDisplay\.toolLabel/)
  assert.match(historyPageSource, /previewHistoryDisplay\?\.showToolLabel\s*\?\s*previewHistoryDisplay\.modelLabel/)
  assert.doesNotMatch(historyPageSource, /`Model: \$\{previewHistoryDisplay\.modelLabel\}`/)
})

test('history preview backfills wrapped hair tool reference images for older records', () => {
  assert.match(historyPageSource, /getOriginalHistoryInputImageUrls/)
  assert.match(historyPageSource, /normalizeGenerationHistoryItem\(/)
  assert.match(historyPageSource, /inputUrls: getOriginalHistoryInputImageUrls\(normalizedItem\)/)
})

test('inline generator history can show wrapped hair tool model even when model branding is hidden', () => {
  assert.match(aiImageGenerationSource, /getWrappedHairToolHistoryDisplay/)
  assert.match(aiImageGenerationSource, /const renderInlineHistoryMeta = \(/)
  assert.match(aiImageGenerationSource, /showModelLabel: Boolean\(modelLabel\)/)
  assert.match(aiImageGenerationSource, /display\.showModelLabel && display\.modelLabel \? display\.modelLabel : ''/)
  assert.match(aiImageGenerationSource, /metaTags\.map\(\(tag, index\) => \(/)
  assert.doesNotMatch(aiImageGenerationSource, /`Model: \$\{display\.modelLabel\}`/)
  assert.doesNotMatch(aiImageGenerationSource, /!\s*hideModelBranding\s*&&\s*\([\s\S]{0,160}<span>\{item\.modelName\}<\/span>/)
})

test('inline account history keeps model labels visible even on wrapped tool pages', () => {
  assert.match(aiImageGenerationSource, /showModelLabel: Boolean\(modelLabel\)/)
  assert.doesNotMatch(aiImageGenerationSource, /showModelLabel: historyDisplay\.showToolLabel \|\| !hideModelBranding/)
})

test('guest result retention copy uses clickable login and hides for signed-in users', () => {
  assert.match(aiImageGenerationSource, /isUserSignedIn/)
  assert.match(aiImageGenerationSource, /toolaze:open-auth-modal/)
  assert.doesNotMatch(aiImageGenerationSource, /The image will disappear after you refresh the page/)
})

test('mobile model submenu renders under the active first-level group', () => {
  assert.match(aiImageGenerationSource, /data-mobile-model-menu/)
  assert.match(aiImageGenerationSource, /group\.id === activeModelGroup\.id[\s\S]*group\.models\.map/)
})

test('mobile account menu uses a fixed overlay so its actions remain tappable', () => {
  assert.match(navigationSource, /renderAccountMenu\('mobile'\)/)
  assert.match(navigationSource, /data-account-menu-variant=\{variant\}/)
  assert.match(navigationSource, /fixed right-3 top-\[64px\]/)
  assert.doesNotMatch(navigationSource, /isMobileView\s*&&\s*\(/)
  assert.match(navigationSource, /mobileAccountMenuRef/)
  assert.match(navigationSource, /desktopAccountMenuRef/)
  assert.match(navigationSource, /isInsideAccountMenu/)
})

test('root viewport disables iOS input zoom', () => {
  assert.match(rootLayoutSource, /maximumScale:\s*1/)
  assert.match(rootLayoutSource, /userScalable:\s*false/)
})

test('generation and credit timestamps use local time down to seconds', () => {
  assert.match(navigationSource, /formatCreditTransactionTimestamp\(transaction\.createdAt\)/)
  assert.match(creditsPageSource, /formatCreditTransactionTimestamp\(transaction\.createdAt\)/)
  assert.match(historyPageSource, /formatLocalTimestampToSeconds\(previewItem\.createdAt\)/)
  assert.match(aiImageGenerationSource, /formatLocalTimestampToSeconds\(savedItem\?\.createdAt/)
  assert.doesNotMatch(creditsPageSource, /function formatCreditDate/)
  assert.doesNotMatch(historyPageSource, /function formatDate/)
})
