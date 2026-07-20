import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')

test('desktop result combines image preview and controls in one card', () => {
  assert.match(source, /data-desktop-result-card/)
  assert.match(source, /data-desktop-result-feed/)
  assert.match(source, /data-desktop-result-item/)
})

test('desktop result mode does not render a separate detail panel', () => {
  assert.doesNotMatch(source, /\$\{rightMode === 'result' \? 'w-full md:w-\[400px\]'/)
  assert.doesNotMatch(source, /currentResult && \(rightMode === 'result' \|\| isCouplePhotoMakerMode\) \?/)
})

test('desktop result card does not use nested card shells for preview and details', () => {
  assert.doesNotMatch(source, /data-desktop-result-details/)
  assert.doesNotMatch(source, /data-desktop-result-preview/)
  assert.match(source, /data-desktop-result-item[\s\S]*grid[\s\S]*lg:grid-cols-\[minmax\(0,240px\)_minmax\(0,1fr\)\]/)
  assert.match(source, /data-desktop-result-item[\s\S]*grid[\s\S]*xl:grid-cols-\[minmax\(0,280px\)_minmax\(0,1fr\)\]/)
  assert.doesNotMatch(source, /lg:grid-cols-\[minmax\(0,420px\)_minmax\(0,1fr\)\]/)
  assert.doesNotMatch(source, /xl:grid-cols-\[minmax\(0,480px\)_minmax\(0,1fr\)\]/)
})

test('desktop result feed appends persisted history instead of replacing the latest result', () => {
  assert.match(source, /fetch\('\/api\/history\?limit=20'/)
  assert.match(source, /setHistory\(\(prev\) => \[item, \.\.\.prev\.filter\(\(historyItem\) => historyItem\.id !== item\.id\)\]/)
  assert.match(source, /sortPersistedHistoryItemsNewestFirst\(data\.items\)/)
  assert.match(source, /history\.map\(\(item\) => \(/)
})

test('desktop right panel shows history tab when account history exists', () => {
  assert.match(source, /data-desktop-result-tabs/)
  assert.match(source, /data-desktop-result-tab="sample"[\s\S]*>\s*\{toolText\.demo\}/)
  assert.match(source, /data-desktop-result-tab="history"[\s\S]*>\s*\{toolText\.history\}/)
  assert.match(source, /setCurrentResult\(\(prev\) => prev \|\| loadedHistory\[0\] \|\| null\)/)
  assert.doesNotMatch(source, /setCurrentResult\(\(prev\) => prev \|\| loadedHistory\[0\] \|\| null\)\s*\n\s*setRightMode\('history'\)/)
  assert.match(source, /setPendingGenerationItems\(\(prev\) => \[pendingItem, \.\.\.prev\]\)\s*\n\s*setRightMode\('history'\)/)
  assert.match(source, /rightMode === 'history' \? \(\s*renderDesktopResultFeed\(\)\s*\) : \(/)
})

test('desktop landing page navigation defaults the right panel to demo unless generation is running', () => {
  assert.match(source, /const lastRightPanelPathnameRef = useRef\(pathname\)/)
  assert.match(source, /useEffect\(\(\) => \{\s*if \(lastRightPanelPathnameRef\.current === pathname\) return\s*lastRightPanelPathnameRef\.current = pathname\s*if \(pendingGenerationItems\.length > 0\) return\s*setRightMode\('sample'\)\s*\}, \[pathname, pendingGenerationItems\.length\]\)/)
  assert.match(source, /useEffect\(\(\) => \{\s*if \(pendingGenerationItems\.length > 0\) \{\s*setRightMode\('history'\)\s*\}\s*\}, \[pendingGenerationItems\.length\]\)/)
})

test('mobile generated result keeps the prompt visible above actions', () => {
  assert.match(source, /data-mobile-result-prompt/)
  assert.match(source, /data-mobile-result-prompt[\s\S]*currentResult\.prompt[\s\S]*data-mobile-result-actions/)
})

test('mobile generated result shows compact metadata tags above the prompt', () => {
  const mobileResultBlock = source.slice(
    source.indexOf('data-mobile-generation-panel'),
    source.indexOf('data-mobile-result-actions'),
  )

  assert.match(source, /data-mobile-history-meta/)
  assert.match(mobileResultBlock, /renderMobileHistoryMeta\(\{[\s\S]*\.\.\.currentResult,[\s\S]*modelName: getHistoryItemModelName\(currentResult\),[\s\S]*\}, currentResult\.time\)/)
  assert.ok(
    mobileResultBlock.indexOf('renderMobileHistoryMeta') < mobileResultBlock.indexOf('data-mobile-result-prompt'),
    'mobile metadata should render above the prompt',
  )
})

test('mobile generated result uses icons for download and delete actions', () => {
  const mobileDownload = source.match(/<button\s+data-mobile-download[\s\S]*?<\/button>/)?.[0] || ''
  assert.notEqual(mobileDownload, '')
  assert.match(mobileDownload, /aria-label=\{downloadingUrl === currentResult\.outputPreview \? toolText\.downloading : toolText\.download\}/)
  assert.match(mobileDownload, /<svg[\s\S]*<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/)
  assert.doesNotMatch(mobileDownload, />\s*\{downloadingUrl === currentResult\.outputPreview \? toolText\.downloading : toolText\.download\}\s*<\/button>/)

  const mobileDelete = source.match(/<button\s+data-mobile-delete[\s\S]*?<\/button>/)?.[0] || ''
  assert.notEqual(mobileDelete, '')
  assert.match(mobileDelete, /aria-label=\{toolText\.delete\}/)
  assert.match(mobileDelete, /<DeleteIcon size=\{16\}/)
  assert.doesNotMatch(mobileDelete, />\s*\{toolText\.delete\}\s*<\/button>/)
})

test('generation supports multiple pending tasks instead of blocking the button', () => {
  assert.match(source, /pendingGenerationItems\.map\(\(item\) => \(/)
  assert.match(source, /setPendingGenerationItems\(\(prev\) => \[pendingItem, \.\.\.prev\]\)/)
  assert.match(source, /setPendingGenerationItems\(\(prev\) => prev\.filter\(\(item\) => item\.id !== pendingItem\.id\)\)/)
  assert.doesNotMatch(source, /disabled=\{isGenerating \|\| !prompt\.trim\(\)/)
  assert.doesNotMatch(source, /background: isGenerating \|\| !prompt\.trim\(\)/)
})

test('pending generations survive refresh and restored tasks keep polling', () => {
  assert.match(source, /const PENDING_GENERATION_STORAGE_KEY = 'toolaze:image-generation-pending:v1'/)
  assert.match(source, /function getStoredPendingGenerationItems\(\): PendingGenerationItem\[\]/)
  assert.match(source, /const \[pendingGenerationItems, setPendingGenerationItems\] = useState<PendingGenerationItem\[\]>\(\(\) => getStoredPendingGenerationItems\(\)\)/)
  assert.match(source, /window\.sessionStorage\.setItem\(PENDING_GENERATION_STORAGE_KEY, JSON\.stringify\(pendingGenerationItems\)\)/)
  assert.match(source, /window\.sessionStorage\.removeItem\(PENDING_GENERATION_STORAGE_KEY\)/)
  assert.match(source, /pendingGenerationItems\.length > 0\)\s*\{\s*setRightMode\('history'\)/)
  assert.match(source, /taskId\?: string/)
  assert.match(source, /creditHold\?: unknown/)
  assert.match(source, /restored\?: boolean/)
  assert.match(source, /setPendingGenerationItems\(\(prev\) => prev\.map\(\(item\) => item\.id === pendingItem\.id \? \{ \.\.\.item, taskId, creditHold \} : item\)\)/)
  assert.match(source, /pendingGenerationItems\.filter\(\(item\) => item\.restored && item\.taskId\)/)
  assert.match(source, /pollRestoredGenerationItem\(item\)/)
})

test('desktop history prompts clamp to four lines with full prompt on hover', () => {
  assert.match(source, /const promptPreviewClampStyle: React\.CSSProperties = \{[\s\S]*WebkitLineClamp: 4[\s\S]*WebkitBoxOrient: 'vertical'[\s\S]*overflow: 'hidden'/)
  assert.match(source, /const renderDesktopPromptPreview = \(promptText: string, testId: string\) => \{/)
  assert.match(source, /const \[desktopPromptTooltip, setDesktopPromptTooltip\] = useState<DesktopPromptTooltipState>\(null\)/)
  assert.match(source, /const showDesktopPromptTooltip = \(/)
  assert.match(source, /data-desktop-prompt-ellipsis/)
  assert.match(source, /data-desktop-prompt-ellipsis[\s\S]*onMouseEnter=\{\(event\) => showDesktopPromptTooltip\(event, promptText\)\}/)
  assert.match(source, /data-desktop-prompt-ellipsis[\s\S]*onMouseLeave=\{hideDesktopPromptTooltip\}/)
  assert.doesNotMatch(source, /<button[\s\S]{0,180}data-desktop-prompt-ellipsis/)
  assert.doesNotMatch(source, /data-desktop-prompt-ellipsis[\s\S]{0,220}aria-label="Show Full Prompt"/)
  assert.doesNotMatch(source, /data-desktop-prompt-ellipsis[\s\S]{0,260}rounded/)
  assert.doesNotMatch(source, /data-desktop-prompt-ellipsis[\s\S]{0,260}bg-\[/)
  assert.doesNotMatch(source, /data-desktop-prompt-ellipsis[\s\S]{0,260}ring-/)
  assert.match(source, /data-desktop-prompt-ellipsis[\s\S]*aria-hidden="true"/)
  assert.match(source, /data-desktop-prompt-ellipsis[\s\S]*className="absolute bottom-0 right-0 h-6 w-8"/)
  assert.doesNotMatch(source, /showEllipsisTrigger \? 'pr-8' : ''/)
  assert.doesNotMatch(source, /data-desktop-result-prompt[\s\S]{0,220}pr-8/)
  assert.doesNotMatch(source, /data-desktop-prompt-ellipsis[\s\S]{0,260}>\s*\.\.\.\s*<\/span>/)
  assert.doesNotMatch(source, /<div\s+className="relative min-w-0"\s+onMouseEnter=\{\(event\) => showDesktopPromptTooltip\(event, promptText\)\}/)
  assert.doesNotMatch(source, /<p[\s\S]{0,260}onMouseEnter=\{\(event\) => showDesktopPromptTooltip\(event, promptText\)\}/)
  assert.match(source, /data-desktop-prompt-tooltip[\s\S]*\{desktopPromptTooltip\.text\}/)
  assert.match(source, /data-desktop-prompt-tooltip[\s\S]*fixed[\s\S]*z-\[10060\]/)
  assert.doesNotMatch(source, /data-desktop-prompt-tooltip[\s\S]{0,220}z-40/)
  assert.doesNotMatch(source, /group-hover:block[\s\S]*group-focus-within:block/)
  assert.match(source, /data-desktop-result-prompt[\s\S]*style=\{promptPreviewClampStyle\}/)
  assert.match(source, /data-desktop-pending-result-prompt[\s\S]*style=\{promptPreviewClampStyle\}/)
  assert.match(source, /data-desktop-failed-result-prompt[\s\S]*style=\{promptPreviewClampStyle\}/)
  assert.doesNotMatch(source, /data-desktop-(?:result|pending-result|failed-result)-prompt[\s\S]{0,120}title=\{item\.prompt\}/)
  assert.doesNotMatch(source, /cursor-help/)
})

test('desktop history metadata appears as light tags above the prompt', () => {
  const resultBlock = source.slice(
    source.indexOf('const renderDesktopResultItem'),
    source.indexOf('const renderDesktopPendingResultItem'),
  )
  const pendingBlock = source.slice(
    source.indexOf('const renderDesktopPendingResultItem'),
    source.indexOf('const applyGenerationItemToForm'),
  )
  const failedBlock = source.slice(
    source.indexOf('const renderDesktopFailedResultItem'),
    source.indexOf('const renderDesktopResultFeed'),
  )

  assert.ok(
    resultBlock.indexOf('renderInlineHistoryMeta') < resultBlock.indexOf('data-desktop-result-prompt'),
    'successful history metadata should render above the prompt',
  )
  assert.ok(
    pendingBlock.indexOf('renderInlineHistoryMeta') < pendingBlock.indexOf('data-desktop-pending-result-prompt'),
    'pending history metadata should render above the prompt',
  )
  assert.ok(
    failedBlock.indexOf('renderInlineHistoryMeta') < failedBlock.indexOf('data-desktop-failed-result-prompt'),
    'failed history metadata should render above the prompt',
  )
  assert.match(source, /rounded-full bg-\[#EEF2FF\]\/60 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-\[#C7D2FE\]\/70/)
})

test('left prompt input shows four lines and scrolls overflow', () => {
  assert.match(source, /data-left-prompt-input/)
  assert.match(source, /data-left-prompt-input[\s\S]*className="h-\[7\.5rem\][\s\S]*overflow-y-auto/)
  assert.match(source, /data-left-prompt-input[\s\S]*rows=\{4\}/)
})

test('left prompt input has an inline clear action', () => {
  assert.match(source, /data-left-prompt-field/)
  assert.match(source, /data-left-prompt-clear/)
  assert.match(source, /data-left-prompt-clear[\s\S]*aria-label="Clear Prompt"/)
  assert.match(source, /data-left-prompt-clear[\s\S]*setPrompt\(''\)/)
  assert.match(source, /data-left-prompt-clear[\s\S]*setCustomPromptDraft\(''\)/)
  assert.match(source, /data-left-prompt-clear[\s\S]*<CloseIcon size=\{14\}/)
  assert.match(source, /data-left-prompt-input[\s\S]*pr-11/)
})

test('desktop generation controls keep generate visible in the first viewport', () => {
  assert.match(source, /data-generation-tool-shell/)
  assert.match(source, /data-generation-tool-shell[\s\S]*md:h-\[calc\(100dvh-6rem\)\][\s\S]*md:max-h-\[calc\(100dvh-6rem\)\][\s\S]*md:min-h-0/)
  assert.doesNotMatch(source, /md:min-h-\[640px\]/)
  assert.doesNotMatch(source, /xl:min-h-\[720px\]/)
  assert.match(source, /data-left-generation-panel[\s\S]*md:h-full[\s\S]*flex[\s\S]*flex-col/)
  assert.match(source, /data-left-settings-scroll[\s\S]*md:flex-1[\s\S]*md:min-h-0[\s\S]*md:overflow-y-auto/)
  assert.match(source, /data-generate-action-bar[\s\S]*flex-shrink-0/)
  assert.match(source, /data-generate-button/)
})

test('desktop generation and history columns use compact spacing', () => {
  assert.match(source, /<section className="[^"]*md:pl-3[^"]*md:pr-3[^"]*xl:pl-4[^"]*xl:pr-4[^"]*2xl:pl-5[^"]*2xl:pr-5/)
  assert.doesNotMatch(source, /md:px-6/)
  assert.doesNotMatch(source, /xl:pl-0/)
  assert.doesNotMatch(source, /2xl:pl-0/)
  assert.doesNotMatch(source, /xl:pr-8/)
  assert.doesNotMatch(source, /2xl:pr-12/)
  assert.doesNotMatch(source, /2xl:pr-6/)
  assert.match(source, /data-generation-tool-shell[\s\S]*md:gap-3[\s\S]*xl:gap-4[\s\S]*2xl:gap-5/)
  assert.doesNotMatch(source, /md:gap-6/)
  assert.doesNotMatch(source, /xl:gap-8/)
  assert.doesNotMatch(source, /2xl:gap-10/)
  assert.match(source, /data-desktop-result-card[\s\S]*flex-1[\s\S]*w-full/)
  assert.doesNotMatch(source, /data-desktop-result-card[\s\S]{0,260}xl:mx-auto/)
  assert.doesNotMatch(source, /data-desktop-result-card[\s\S]{0,260}xl:max-w-\[/)
})

test('desktop history uses compact laptop spacing so metadata tags have more row width', () => {
  assert.match(source, /data-desktop-result-feed[\s\S]*className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain p-4 md:p-5"/)
  assert.match(source, /data-desktop-history-meta className="flex flex-wrap items-center gap-1"/)
  assert.doesNotMatch(source, /data-desktop-result-feed[\s\S]{0,220} p-6"/)
  assert.doesNotMatch(source, /data-desktop-history-meta className="flex flex-wrap items-center gap-1\.5"/)
  assert.doesNotMatch(source, /data-desktop-result-item[\s\S]{0,220}grid gap-6/)
  assert.match(source, /data-desktop-result-item[\s\S]*grid gap-4/)
})

test('desktop history wheel scroll stays inside history feed', () => {
  assert.match(source, /const handleDesktopResultFeedWheel = \(event: React\.WheelEvent<HTMLDivElement>\) => \{/)
  assert.match(source, /event\.preventDefault\(\)[\s\S]*event\.stopPropagation\(\)[\s\S]*container\.scrollTop \+= event\.deltaY/)
  assert.match(source, /data-desktop-result-feed[\s\S]*onWheel=\{handleDesktopResultFeedWheel\}[\s\S]*overscroll-contain/)
})

test('image-to-image history keeps a stable reference preview URL', () => {
  assert.match(source, /const generationPreviewInputUrls =/)
  assert.match(source, /inputPreview: generationPreviewInputUrls\[0\] \|\| ''/)
  assert.match(source, /src=\{getReferencePreviewUrl\(item\.inputPreview\)\}/)
  assert.match(source, /onClick=\{\(\) => setPreviewImage\(item\.inputPreview\)\}/)
})

test('desktop and mobile history show the original reference below the prompt', () => {
  const resultBlock = source.slice(
    source.indexOf('const renderDesktopResultItem'),
    source.indexOf('const renderDesktopPendingResultItem'),
  )
  const mobileResultStart = source.indexOf('data-mobile-generation-panel')
  const mobileResultBlock = source.slice(
    mobileResultStart,
    source.indexOf('{renderResultRetentionPrompt()}', mobileResultStart),
  )

  assert.match(resultBlock, /data-desktop-result-reference/)
  assert.match(resultBlock, /toolText\.inputImage/)
  assert.ok(
    resultBlock.indexOf('data-desktop-result-prompt') < resultBlock.indexOf('data-desktop-result-reference'),
    'desktop original reference should render below the prompt',
  )
  assert.ok(
    resultBlock.indexOf('data-desktop-result-reference') < resultBlock.indexOf('data-desktop-result-actions'),
    'desktop original reference should render above history actions',
  )
  assert.match(mobileResultBlock, /data-mobile-result-reference/)
  assert.match(mobileResultBlock, /getHistoryReferencePreviewUrls\(currentResult\)/)
  assert.match(mobileResultBlock, /toolText\.inputImage/)
  assert.ok(
    mobileResultBlock.indexOf('data-mobile-result-prompt') < mobileResultBlock.indexOf('data-mobile-result-reference'),
    'mobile original reference should render below the prompt',
  )
  assert.ok(
    mobileResultBlock.indexOf('data-mobile-result-reference') < mobileResultBlock.indexOf('data-mobile-result-actions'),
    'mobile original reference should render above history actions',
  )
})

test('successful history renders every original reference image', () => {
  const resultBlock = source.slice(
    source.indexOf('const renderDesktopResultItem'),
    source.indexOf('const renderDesktopPendingResultItem'),
  )
  const mobileResultStart = source.indexOf('data-mobile-generation-panel')
  const mobileResultBlock = source.slice(
    mobileResultStart,
    source.indexOf('{renderResultRetentionPrompt()}', mobileResultStart),
  )

  assert.match(source, /const getHistoryReferencePreviewUrls = \(item: \{[\s\S]*inputPreview\?: string[\s\S]*inputUrls\?: string\[\][\s\S]*\}/)
  assert.match(resultBlock, /getHistoryReferencePreviewUrls\(item\)\.map\(\(url, index\) => \(/)
  assert.match(mobileResultBlock, /getHistoryReferencePreviewUrls\(currentResult\)\.map\(\(url, index\) => \(/)
  assert.doesNotMatch(resultBlock, /\{item\.inputPreview && \(/)
  assert.doesNotMatch(mobileResultBlock, /\{currentResult\.inputPreview && \(/)
})

test('left remote reference images show loading and fallback states', () => {
  assert.match(source, /type RemoteReferenceImageState = 'loading' \| 'loaded' \| 'retrying' \| 'failed'/)
  assert.match(source, /const \[remoteImagePreviewStates, setRemoteImagePreviewStates\] = useState<Record<string, RemoteReferenceImageState>>\(\{\}\)/)
  assert.match(source, /remoteImageUrls\.forEach\(\(url\) => \{[\s\S]*nextStates\[url\] = prev\[url\] \|\| 'loading'/)
  assert.match(source, /data-left-remote-reference-image/)
  assert.match(source, /src=\{previewState === 'retrying' \? normalizeReusableReferenceImageUrl\(url\) : getReferencePreviewUrl\(url\)\}/)
  assert.match(source, /onLoad=\{\(\) => setRemoteImagePreviewState\(url, 'loaded'\)\}/)
  assert.match(source, /onError=\{\(\) => setRemoteImagePreviewState\(url, previewState === 'retrying' \? 'failed' : 'retrying'\)\}/)
  assert.match(source, /data-left-remote-reference-loading/)
  assert.match(source, /previewState === 'loading' \|\| previewState === 'retrying'/)
  assert.match(source, /data-left-remote-reference-failed/)
})

test('left remote reference loading copy is not the generation copy', () => {
  assert.match(source, /referenceImageLoading: 'Loading'/)
  assert.match(source, /data-left-remote-reference-loading[\s\S]*\{toolText\.referenceImageLoading\}/)
  assert.doesNotMatch(source, /data-left-remote-reference-loading[\s\S]{0,260}\{toolText\.generating\}/)
})

test('failed generations stay in the desktop history feed with disabled download', () => {
  assert.match(source, /interface FailedGenerationItem extends PendingGenerationItem/)
  assert.match(source, /const \[failedGenerationItems, setFailedGenerationItems\]/)
  assert.match(source, /setFailedGenerationItems\(\(prev\) => \[\{ \.\.\.pendingItem, errorMessage \}, \.\.\.prev\]\.slice\(0, 20\)\)/)
  assert.match(source, /data-desktop-failed-result-item/)
  assert.match(source, /data-desktop-failed-result-preview[\s\S]*\{toolText\.imageGenerationFailed\}[\s\S]*\{item\.errorMessage\}/)
  assert.match(source, /data-desktop-failed-download[\s\S]*disabled/)
  assert.match(source, /failedGenerationItems\.map\(\(item\) => \(/)
})

test('desktop result tabs sit above hero copy and history mode hides hero copy', () => {
  const tabsIndex = source.indexOf('data-desktop-result-tabs')
  const heroIndex = source.indexOf('data-desktop-result-hero')
  assert.notEqual(tabsIndex, -1)
  assert.notEqual(heroIndex, -1)
  assert.ok(tabsIndex < heroIndex)
  assert.match(source, /\{rightMode !== 'history' && \(heroBreadcrumbItems\?\.length \|\| heroEyebrow \|\| heroTitle \|\| heroDescription\) && \(/)
})

test('desktop result tabs stay compact and hidden only when there is no history state', () => {
  assert.match(source, /const hasDesktopResultTabs = isGenerating \|\| failedGenerationItems\.length > 0 \|\| history\.length > 0/)
  assert.doesNotMatch(source, /hasRevealedDesktopResultTabs/)
  assert.match(source, /data-desktop-result-tabs[\s\S]*className="mx-auto flex w-fit shrink-0/)
  assert.match(source, /data-desktop-result-tab="sample"[\s\S]*className=\{`inline-flex h-9 min-w-\[84px\]/)
  assert.match(source, /data-desktop-result-tab="history"[\s\S]*className=\{`inline-flex h-9 min-w-\[84px\]/)
})

test('history action uses settings instead of generating immediately', () => {
  assert.match(source, /recreate: 'Recreate'/)
  assert.match(source, /const \[activeSettingsHistoryItemId, setActiveSettingsHistoryItemId\] = useState<string \| null>\(null\)/)
  assert.match(source, /const historyItemRefs = useRef\(new Map<string, HTMLDivElement>\(\)\)/)
  const historyApply = source.match(/const applyHistoryItemToForm = \(item: HistoryItem\) => \{[\s\S]*?\n  \}/)?.[0] || ''
  assert.match(historyApply, /setSelectedModelId\(item\.modelId\)/)
  assert.match(historyApply, /setActiveModelGroupId\(getModelGroupId\(item\.modelId\)\)/)
  assert.match(historyApply, /setPrompt\(item\.prompt\)/)
  assert.match(historyApply, /setAspectRatio\(item\.aspectRatio \|\| getDefaultAspectRatioForModel\(item\.modelId \|\| selectedModelId, presetMode\)\)/)
  assert.match(historyApply, /setResolution\(item\.resolution \|\| getDefaultResolutionForModel\(item\.modelId \|\| selectedModelId\)\)/)
  assert.match(historyApply, /setOutputFormat\(item\.outputFormat \|\| 'Auto'\)/)
  assert.match(historyApply, /const inputImageUrls = getOriginalHistoryInputImageUrls\(item\)/)
  assert.match(historyApply, /setRemoteImageUrls\(inputImageUrls\.slice\(0, getMaxImagesForModel\(item\.modelId \|\| selectedModelId\)\)\)/)
  assert.match(historyApply, /setActiveTab\(inputImageUrls\.length > 0 \? 'image-to-image' : 'text-to-image'\)/)
  assert.match(historyApply, /setActiveSettingsHistoryItemId\(item\.id\)/)
  assert.match(historyApply, /historyItemRefs\.current\.get\(item\.id\)\?\.scrollIntoView\(\{ block: 'nearest', behavior: 'smooth' \}\)/)
  assert.doesNotMatch(historyApply, /setRightMode\('sample'\)/)

  const failedApply = source.match(/const applyGenerationItemToForm = \(item: PendingGenerationItem\) => \{[\s\S]*?\n  \}/)?.[0] || ''
  assert.match(failedApply, /setSelectedModelId\(item\.modelId\)/)
  assert.match(failedApply, /setActiveModelGroupId\(getModelGroupId\(item\.modelId\)\)/)
  assert.match(failedApply, /setPrompt\(item\.prompt\)/)
  assert.match(failedApply, /setAspectRatio\(item\.aspectRatio \|\| getDefaultAspectRatioForModel\(item\.modelId, presetMode\)\)/)
  assert.match(failedApply, /setResolution\(item\.resolution \|\| getDefaultResolutionForModel\(item\.modelId\)\)/)
  assert.match(failedApply, /setOutputFormat\(item\.outputFormat \|\| 'Auto'\)/)
  assert.match(failedApply, /const inputImageUrls = getOriginalHistoryInputImageUrls\(item\)/)
  assert.match(failedApply, /setRemoteImageUrls\(inputImageUrls\.slice\(0, getMaxImagesForModel\(item\.modelId\)\)\)/)
  assert.match(failedApply, /setActiveTab\(inputImageUrls\.length > 0 \? 'image-to-image' : 'text-to-image'\)/)
  assert.match(failedApply, /setActiveSettingsHistoryItemId\(item\.id\)/)
  assert.match(failedApply, /historyItemRefs\.current\.get\(item\.id\)\?\.scrollIntoView\(\{ block: 'nearest', behavior: 'smooth' \}\)/)
  assert.doesNotMatch(failedApply, /setRightMode\('sample'\)/)
  assert.match(source, /ref=\{\(node\) => setHistoryItemRef\(item\.id, node\)\}/)
  assert.match(source, /activeSettingsHistoryItemId === item\.id/)
  assert.doesNotMatch(source, /const handleRecreateFromCurrent = \(\) => \{[\s\S]*handleGenerate\(\)/)
})

test('history action can edit a generated image as the next reference image', () => {
  assert.match(source, /editImage: 'Edit Image'/)
  assert.match(source, /const isGenericImageEditToolPath = \(pathname: string\) =>/)
  const historyEdit = source.match(/const editHistoryItemImage = \(item: HistoryItem\) => \{[\s\S]*?\n  \}/)?.[0] || ''
  assert.match(historyEdit, /if \(!isGenericImageEditToolPath\(pathname\)\) \{/)
  assert.match(historyEdit, /window\.sessionStorage\.setItem\(PENDING_REPROMPT_STORAGE_KEY, JSON\.stringify\(\{[\s\S]*mode: 'image-to-image'[\s\S]*imageUrl: item\.outputPreview/)
  assert.match(historyEdit, /window\.location\.href = getLocalizedInternalPath\(pathname, '\/ai-image-generator'\)/)
  assert.doesNotMatch(historyEdit, /setSelectedModelId/)
  assert.doesNotMatch(historyEdit, /setActiveModelGroupId/)
  assert.doesNotMatch(historyEdit, /setPrompt/)
  assert.doesNotMatch(historyEdit, /setAspectRatio/)
  assert.doesNotMatch(historyEdit, /setResolution/)
  assert.doesNotMatch(historyEdit, /setOutputFormat/)
  assert.match(historyEdit, /setImageFiles\(\[\]\)/)
  assert.match(historyEdit, /setRemoteImageUrls\(\[item\.outputPreview\]\.slice\(0, getMaxImagesForModel\(selectedModelId\)\)\)/)
  assert.match(historyEdit, /setActiveTab\('image-to-image'\)/)
  assert.doesNotMatch(historyEdit, /setCurrentResult/)
  assert.doesNotMatch(historyEdit, /handleGenerate\(\)/)

  assert.match(source, /data-desktop-edit-image/)
  assert.match(source, /data-desktop-edit-image[\s\S]*onClick=\{\(\) => editHistoryItemImage\(item\)\}[\s\S]*\{toolText\.editImage\}/)
  assert.match(source, /data-desktop-edit-image[\s\S]*className="flex items-center justify-center rounded-xl border border-\[#C7D2FE\] px-3 py-2\.5 text-\[#4F46E5\] transition-colors hover:bg-\[#EEF2FF\]"/)
  assert.match(source, /data-mobile-edit-image/)
  assert.match(source, /data-mobile-edit-image[\s\S]*onClick=\{\(\) => editHistoryItemImage\(currentResult\)\}[\s\S]*\{toolText\.editImageShort\}/)
  assert.match(source, /editImageShort: 'Edit'/)
})

test('pending reprompt can apply an image-only edit payload', () => {
  const promptInsert = source.match(/const applyPromptInsertDetail = useCallback\(\(detail: PromptInsertEventDetail\) => \{[\s\S]*?\n  \}, \[/)?.[0] || ''

  assert.match(promptInsert, /const nextPrompt = detail\.prompt\?\.trim\(\)/)
  assert.match(promptInsert, /if \(!nextPrompt && urls\.length === 0\) return false/)
  assert.match(promptInsert, /if \(nextPrompt\) \{[\s\S]*setPrompt\(nextPrompt\)/)
  assert.match(promptInsert, /setRemoteImageUrls\(resolvePromptInsertRemoteImageUrls\(\{[\s\S]*referenceUrls: urls/)
  assert.match(promptInsert, /setActiveTab\(nextMode\)/)
})
