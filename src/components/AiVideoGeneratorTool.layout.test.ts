import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const source = readFileSync(join(process.cwd(), 'src', 'components', 'AiVideoGeneratorTool.tsx'), 'utf8')
const agentsSource = readFileSync(join(process.cwd(), 'AGENTS.md'), 'utf8')
const uploaderSource = readFileSync(join(process.cwd(), 'src', 'components', 'ReferenceImageUploader.tsx'), 'utf8')
const motionReferenceVideoUploaderPath = join(process.cwd(), 'src', 'components', 'MotionReferenceVideoUploader.tsx')
const promptReferenceMentionPickerPath = join(process.cwd(), 'src', 'components', 'PromptReferenceMentionPicker.tsx')
const promptReferenceMentionOverlayPath = join(process.cwd(), 'src', 'components', 'PromptReferenceMentionOverlay.tsx')

function readMotionReferenceVideoUploaderSource() {
  assert.equal(existsSync(motionReferenceVideoUploaderPath), true, 'shared motion reference video uploader component should exist')
  return readFileSync(motionReferenceVideoUploaderPath, 'utf8')
}

function readPromptReferenceMentionPickerSource() {
  assert.equal(existsSync(promptReferenceMentionPickerPath), true, 'prompt reference mention picker should exist')
  return readFileSync(promptReferenceMentionPickerPath, 'utf8')
}

function readPromptReferenceMentionOverlaySource() {
  assert.equal(existsSync(promptReferenceMentionOverlayPath), true, 'prompt reference mention overlay should exist')
  return readFileSync(promptReferenceMentionOverlayPath, 'utf8')
}

function extractConstFunctionSource(name: string) {
  const start = source.indexOf(`const ${name} =`)
  assert.notEqual(start, -1, `${name} should exist`)

  const bodyStart = source.indexOf('{', start)
  assert.notEqual(bodyStart, -1, `${name} should have a function body`)

  let depth = 0
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') depth += 1
    if (char === '}') depth -= 1
    if (depth === 0) return source.slice(start, index + 1)
  }

  assert.fail(`${name} should have a complete function body`)
}

test('AI video generator renders hero copy inside the right demo panel', () => {
  const splitPanelIndex = source.indexOf("flex min-h-0 min-w-0 flex-col gap-4")
  const leftPanelIndex = source.indexOf("md:w-[380px] xl:w-[400px] 2xl:w-[420px]")
  const rightPanelIndex = source.indexOf('data-video-demo-panel')
  const rightPanelBlock = source.slice(rightPanelIndex, source.indexOf('{motionVideoPreview && ('))
  const heroTitleIndex = rightPanelBlock.indexOf('data-video-hero-title')
  const demoCanvasRenderIndex = rightPanelBlock.indexOf('renderVideoDemoCanvas()')

  assert.notEqual(splitPanelIndex, -1, 'tool split panel should exist')
  assert.notEqual(leftPanelIndex, -1, 'left controls should use the same fixed image-tool panel width')
  assert.notEqual(rightPanelIndex, -1, 'right video demo panel should exist')
  assert.notEqual(heroTitleIndex, -1, 'hero title should render in the demo panel')
  assert.notEqual(source.indexOf('data-video-preview-canvas'), -1, 'clean demo canvas should exist')
  assert.notEqual(demoCanvasRenderIndex, -1, 'clean demo canvas should render in the demo panel')
  assert.ok(splitPanelIndex < leftPanelIndex, 'left controls should be inside the split tool layout')
  assert.ok(splitPanelIndex < rightPanelIndex, 'demo panel should be inside the split tool layout')
  assert.ok(heroTitleIndex < demoCanvasRenderIndex, 'hero title should sit above the demo canvas')
  assert.match(source, /data-left-generation-panel className="order-2[\s\S]*md:order-none/, 'mobile controls should render after the hero/demo panel')
  assert.match(source, /data-video-demo-panel className="order-1[\s\S]*md:order-none/, 'mobile hero/demo panel should render before controls')
  assert.equal(source.includes('mx-auto w-full max-w-[1440px] rounded-[2rem]'), false, 'video tool should not add an extra outer rounded card shell')
  assert.equal(source.includes('grid min-h-[620px]'), false, 'video tool should not keep the old nested grid wrapper')
})

test('AI video generator accepts hero breadcrumbs above the right-panel title', () => {
  const breadcrumbPropIndex = source.indexOf('heroBreadcrumbItems')
  const breadcrumbRenderIndex = source.indexOf('<Breadcrumb items={heroBreadcrumbItems} variant="inline" />')
  const heroTitleIndex = source.indexOf('data-video-hero-title')

  assert.notEqual(breadcrumbPropIndex, -1, 'video tool should accept hero breadcrumb items')
  assert.notEqual(breadcrumbRenderIndex, -1, 'video tool should render hero breadcrumbs inline')
  assert.ok(breadcrumbRenderIndex < heroTitleIndex, 'hero breadcrumbs should sit above the title')
})

test('AI video generator can preload page demo inputs from content data', () => {
  assert.match(source, /initialImageUrls\?: string\[\]/, 'video tool should accept initial reference image URLs')
  assert.match(source, /initialMotionVideoUrls\?: string\[\]/, 'video tool should accept initial motion reference video URLs')
  assert.match(source, /initialMotionVideoDurationSeconds\?: number/, 'video tool should accept an initial motion reference duration')
  assert.match(source, /initialPrompt\?: string/, 'video tool should accept an initial prompt')
  assert.match(source, /initialCharacterOrientation\?: 'image' \| 'video'/, 'video tool should accept an initial character orientation')
  assert.match(source, /useState<string\[\]>\(\(\) => \(\s*Array\.isArray\(initialImageUrls\)/, 'remote image URL state should seed from initialImageUrls')
  assert.match(source, /remoteUrls: Array\.isArray\(initialMotionVideoUrls\) \? initialMotionVideoUrls\.filter\(Boolean\)/, 'combined motion video state should seed remote URLs from initialMotionVideoUrls')
  assert.match(source, /Math\.ceil\(Number\(initialMotionVideoDurationSeconds\)\)/, 'reference-video pages should seed the generated duration from the preloaded video')
  assert.match(source, /useState<'image' \| 'video'>\(initialCharacterOrientation \|\| 'video'\)/, 'character orientation should seed from page data')
  assert.match(source, /useState\(initialPrompt \|\| ''\)/, 'prompt should seed from page data')
})

test('AI video generator can deep-link to a model and creation mode from query params', () => {
  assert.match(source, /const queryParams = new URLSearchParams\(window\.location\.search\)/, 'video tool should read query params once for deep links')
  assert.match(source, /const queryModelId = queryParams\.get\('model'\)/, 'video tool should read model from the query string')
  assert.match(source, /const queryModeId = queryParams\.get\('mode'\)/, 'video tool should read mode from the query string')
  assert.match(source, /nextModel\.supportedModes\.includes\(queryModeId as AiVideoGeneratorModeId\)/, 'query mode should only apply when the selected model supports it')
  assert.match(source, /setActiveMode\(nextMode\)/, 'query mode should drive the active video mode after the model is selected')
})

test('AI video generator keeps desktop hero H1 compact on laptop viewports', () => {
  assert.match(source, /data-video-hero-title[\s\S]*text-\[30px\][\s\S]*xl:text-\[32px\]/)
  assert.doesNotMatch(source, /data-video-hero-title[\s\S]{0,220}md:text-\[36px\]\s+xl:text-\[38px\]/)
})

test('AI video generator exposes compact output setting menus', () => {
  assert.equal(source.includes('value={aspectRatio}'), false, 'aspect ratio should not render as a select value')
  assert.equal(source.includes('value={resolution}'), false, 'resolution should not render as a select value')
  assert.match(source, /modelConfig\.aspectRatios\.map\(\(ratio\) =>[\s\S]*aria-pressed=\{isSelected\}/, 'aspect ratio options should be visible pressed buttons')
  assert.match(source, /modelConfig\.resolutions\.map\(\(value\) =>[\s\S]*aria-pressed=\{isSelected\}/, 'resolution options should be visible pressed buttons')
  assert.notEqual(source.indexOf('data-video-output-settings-panel'), -1, 'the active output setting should render in a compact panel')
  assert.notEqual(source.indexOf('data-video-output-settings-trigger'), -1, 'all output values should use one compact summary trigger')
  assert.match(source, /import VideoDurationSlider from '.\/VideoDurationSlider'/, 'video duration should use the shared slider component')
  assert.match(source, /<VideoDurationSlider[\s\S]*options=\{modelConfig\.durations\}[\s\S]*value=\{duration\}/, 'duration slider should keep discrete duration options')
  assert.match(source, /modelConfig\.aspectRatios\.find\(\(option\) => option\.value === aspectRatio\)\?\.label/, 'summary values should use title-cased configuration labels such as Auto')
  assert.notEqual(source.indexOf('const shouldAllowLeftOverlay = isModelMenuOpen'), -1, 'duration should no longer alter the left scroll clipping layer')
  assert.equal(source.includes('isDurationMenuOpen'), false, 'duration should not keep separate menu state')
  assert.notEqual(source.indexOf("shouldAllowLeftOverlay ? 'md:overflow-visible' : 'md:overflow-y-auto'"), -1, 'left panel should return to vertical scrolling when floating menus close')
})

test('AI video generator keeps prompt sizing aligned with the image tool', () => {
  assert.notEqual(source.indexOf('rows={4}'), -1, 'prompt textarea should use four visible rows like the image tool')
  assert.notEqual(source.indexOf('h-[7.5rem] w-full scroll-mb-28 resize-none overflow-y-auto'), -1, 'prompt textarea should match image-tool height and Safari-safe scrolling style')
  assert.equal(source.includes('rows={6}'), false, 'prompt textarea should not use the previous taller six-row sizing')
  assert.equal(source.includes('rounded-2xl border border-slate-200 bg-slate-50/70'), false, 'prompt textarea should not keep the older video-only styling')
})

test('prompt reference mention picker groups uploaded media with identifiable previews', () => {
  const pickerSource = readPromptReferenceMentionPickerSource()

  assert.match(pickerSource, /export interface PromptReferenceMentionItem/, 'picker should expose a typed reference item contract')
  assert.match(pickerSource, /data-prompt-reference-mention-picker/, 'picker should expose a stable surface for interaction tests')
  assert.match(pickerSource, /Images|Videos|Audio/, 'picker should group references by media type')
  assert.match(pickerSource, /item\.kind === 'image'[\s\S]*<img/, 'image references should render thumbnails')
  assert.match(pickerSource, /item\.kind === 'video'[\s\S]*<video/, 'video references should render contained previews')
  assert.match(pickerSource, /item\.kind === 'audio'/, 'audio references should render a dedicated fallback visual')
  assert.match(pickerSource, /Upload a reference to mention it\./, 'picker should explain its empty state without extra decoration')
  assert.match(pickerSource, /aria-label=\{`Mention \$\{item\.label\}`\}/, 'each reference should be an accessible mention action')
  assert.match(pickerSource, /onClick=\{\(\) => onSelect\(item\)\}/, 'selecting an item should return that exact reference')
  assert.match(pickerSource, /object-contain/, 'video references should remain uncropped for inspection')
})

test('AI video generator wires prompt reference mentions to the active resource state', () => {
  assert.match(source, /PromptReferenceMentionPicker/, 'video generator should render the shared mention picker')
  assert.match(source, /insertPromptReferenceMention/, 'video generator should use cursor-aware insertion math')
  assert.match(source, /event\.key !== '@'/, 'typing at-sign should open the mention flow')
  assert.match(source, /data-prompt-reference-mention-trigger/, 'prompt field should expose a clickable at-sign trigger')
  assert.match(source, /setPromptMentionTriggerIndex/, 'keyboard and button openings should track replacement context')
  assert.match(source, /requestAnimationFrame\(\(\) => \{[\s\S]*setSelectionRange\(result\.caret/, 'selection should return to the caret after insertion')
  assert.match(source, /ordinalRegistry\.get\('image', `remote:\$\{url\}`\)/, 'remote images should keep stable image numbering')
  assert.match(source, /ordinalRegistry\.get\('image', `local:\$\{item\.preview\}`\)/, 'local images should keep stable image numbering')
  assert.match(source, /ordinalRegistry\.get\('video', `remote:\$\{url\}`\)/, 'remote videos should keep stable video numbering')
  assert.match(source, /ordinalRegistry\.get\('audio', `remote:\$\{url\}`\)/, 'remote audio should keep stable audio numbering')
  assert.doesNotMatch(source, /@First Frame|@Last Frame/, 'first and last frame slots should not be exposed as generic reference mentions')
  assert.match(source, /document\.addEventListener\('mousedown', handlePromptMentionPointerDown\)/, 'outside pointer presses should close the picker')
  assert.match(source, /if \(event\.key === 'Escape'\) setIsPromptMentionPickerOpen\(false\)/, 'Escape should close the picker')
  assert.match(source, /Mention a reference/, 'the trigger should have an accessible label')
})

test('Seedance 2.0 keeps first/last frames mutually exclusive with multimodal references', () => {
  const configSource = readFileSync(join(process.cwd(), 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')

  assert.doesNotMatch(configSource, /id: 'seedance-2',[\s\S]*?canCombineFirstLastFrameWithReferences: true/)
  assert.match(source, /supportsMultimodalReferences && \(!isUsingFirstLastFrame \|\| canCombineFirstLastFrameWithReferences\)/)
  assert.match(source, /formData\.append\('webSearch', String\(webSearch\)\)/)
  assert.match(source, /data-video-web-search-toggle/)
  assert.match(source, /referenceAudioTotalMaxDurationSeconds/)
  assert.match(source, /webSearch: request\.webSearch/)
})

test('prompt reference trigger sits on its own row below the native prompt editor', () => {
  assert.match(
    source,
    /<textarea[\s\S]*?<div className="relative flex h-11 items-center px-3">[\s\S]*data-prompt-reference-mention-trigger/,
    'the at-sign trigger should render in a dedicated row below the textarea',
  )
  assert.match(source, /px-4 py-3 text-base leading-6 text-slate-800/, 'mention-capable prompts should use native visible text so caret geometry stays accurate')
  assert.doesNotMatch(
    source,
    /supportsPromptReferenceMentions \? 'pb-12 pt-3 text-transparent caret-slate-800'/,
    'the prompt field should no longer reserve in-editor space or hide native text for the mention trigger',
  )
})

test('prompt reference labels stay bound to surviving resources after a non-tail deletion', async () => {
  const pickerModule = await import('./PromptReferenceMentionPicker') as Record<string, unknown>
  const createRegistry = pickerModule.createPromptReferenceMentionOrdinalRegistry
  if (typeof createRegistry !== 'function') {
    assert.fail('picker module should expose the stable ordinal registry')
  }
  const registry = createRegistry()
  const initialResources = ['remote:first', 'remote:middle', 'remote:last']
  const initialLabels = initialResources.map((identity) => `@Image ${registry.get('image', identity)}`)

  assert.deepEqual(initialLabels, ['@Image 1', '@Image 2', '@Image 3'])

  const survivingResources = ['remote:first', 'remote:last']
  const survivingLabels = survivingResources.map((identity) => `@Image ${registry.get('image', identity)}`)

  assert.deepEqual(survivingLabels, ['@Image 1', '@Image 3'], 'deleting the middle resource must not renumber the surviving tail resource')
  assert.equal(survivingLabels.includes('@Image 2'), false, 'the deleted resource token must no longer match a current item')

  registry.syncActive('image', survivingResources)
  const replacementLabel = `@Image ${registry.get('image', 'remote:replacement')}`
  assert.equal(replacementLabel, '@Image 4', 'cleaning inactive identities must not reuse a removed ordinal')
  assert.equal(registry.get('image', 'remote:last'), 3, 'active identity cleanup must preserve surviving labels')
})

test('AI video generator derives mention labels from stable resource identities without reordering payload arrays', () => {
  const pickerSource = readPromptReferenceMentionPickerSource()

  assert.match(source, /promptReferenceMentionOrdinalRegistryRef/, 'generator should retain mention ordinals for its mounted lifetime')
  assert.match(source, /get\('image', `remote:\$\{url\}`\)/, 'remote image identity should be URL-backed')
  assert.match(source, /get\('image', `local:\$\{item\.preview\}`\)/, 'local image identity should use its unique object URL')
  assert.match(source, /get\('video', `remote:\$\{url\}`\)/, 'remote video identity should be URL-backed')
  assert.match(source, /get\('video', `local:\$\{item\.preview\}`\)/, 'local video identity should use its unique object URL')
  assert.match(source, /get\('audio', `remote:\$\{url\}`\)/, 'remote audio identity should be URL-backed')
  assert.match(source, /get\('audio', `local:\$\{item\.preview\}`\)/, 'local audio identity should use its unique object URL')
  assert.match(source, /formData\.append\('imageUrls', JSON\.stringify\(uploadedImageMedia\.referenceGenerationUrls\)\)/, 'stable labels must not alter image payload ordering')
  assert.match(source, /formData\.append\('videoUrls', JSON\.stringify\(uploadedMotionVideoMedia\.generationUrls\)\)/, 'stable labels must not alter video payload ordering')
  assert.match(source, /ordinalRegistry\.syncActive\('image'/, 'generator should retire image identities no longer in current resources')
  assert.match(source, /ordinalRegistry\.syncActive\('video'/, 'generator should retire video identities no longer in current resources')
  assert.match(source, /ordinalRegistry\.syncActive\('audio'/, 'generator should retire audio identities no longer in current resources')
  assert.match(pickerSource, /ordinals\[kind\]\.delete\(identity\)/, 'registry cleanup should remove inactive identity entries')
  assert.match(pickerSource, /nextOrdinal\[kind\] \+= 1/, 'registry cleanup must keep ordinal allocation monotonic')
})

test('prompt reference mentions keep native textarea text and caret behavior', () => {
  assert.doesNotMatch(source, /<PromptReferenceMentionOverlay/, 'the editor should not duplicate text in an overlay layer')
  assert.doesNotMatch(source, /text-transparent[\s\S]*caret-slate-800/, 'the native textarea should render its own text and caret')
})

test('prompt reference tokens show SSR-safe portal previews for each media kind', () => {
  const overlaySource = readPromptReferenceMentionOverlaySource()

  assert.match(overlaySource, /createPortal/, 'reference previews should escape textarea clipping through a portal')
  assert.match(overlaySource, /typeof document === 'undefined'/, 'portal rendering should be safe during SSR')
  assert.match(overlaySource, /window\.innerWidth/, 'preview placement should account for the viewport edge')
  assert.match(overlaySource, /reference\.kind === 'image'[\s\S]*<img/, 'image tokens should preview the referenced image')
  assert.match(overlaySource, /reference\.kind === 'video'[\s\S]*<video[\s\S]*object-contain/, 'video tokens should use an uncropped preview')
  assert.match(overlaySource, /reference\.kind === 'audio'[\s\S]*data-prompt-reference-audio-preview/, 'audio tokens should show an identity card')
})

test('prompt token hit testing finds hover previews without owning pointer events', async () => {
  const overlayModule = await import('./PromptReferenceMentionOverlay') as Record<string, unknown>
  const findTokenAtPoint = overlayModule.findPromptReferenceTokenAtPoint
  if (typeof findTokenAtPoint !== 'function') {
    assert.fail('overlay module should expose pointer-independent token hit testing')
  }

  const image = { id: 'image-1', kind: 'image', label: '@Image 1', name: 'Image', src: '/image.webp' }
  const targets = [{ reference: image, rect: { left: 10, right: 90, top: 20, bottom: 44 } }]

  assert.equal(findTokenAtPoint(targets, 40, 30), image, 'a point inside the visual token should resolve its preview resource')
  assert.equal(findTokenAtPoint(targets, 100, 30), null, 'a point outside visual tokens should clear the preview')

  const wrappedTargets = [
    { reference: image, rect: { left: 10, right: 90, top: 20, bottom: 44 } },
    { reference: image, rect: { left: 10, right: 50, top: 48, bottom: 72 } },
  ]
  assert.equal(findTokenAtPoint(wrappedTargets, 70, 60), null, 'the empty corner of a wrapped token bounding box must not count as a hit')
  assert.equal(findTokenAtPoint(wrappedTargets, 30, 60), image, 'each wrapped line fragment should remain hoverable')
})

test('prompt visual tokens never intercept native textarea selection gestures', () => {
  const overlaySource = readPromptReferenceMentionOverlaySource()

  assert.match(overlaySource, /data-prompt-reference-mention-overlay[\s\S]*pointer-events-none/, 'the mirror should remain pointer transparent')
  assert.doesNotMatch(overlaySource, /pointer-events-auto/, 'token spans must not become pointer targets above the textarea')
  assert.doesNotMatch(overlaySource, /onMouseEnter|onMouseLeave|onMouseDown|onPointerDown/, 'tokens must not own click, drag, or hover events')
  assert.match(overlaySource, /textarea\.addEventListener\('mousemove'/, 'hover observation should stay scoped to the native textarea')
  assert.match(overlaySource, /getClientRects\(\)/, 'wrapped tokens should expose every rendered line fragment')
  assert.doesNotMatch(overlaySource, /getBoundingClientRect\(\)/, 'wrapped token hit testing must not use one enclosing rectangle')
  assert.match(overlaySource, /querySelector\('textarea'\)[\s\S]*event\.target !== textarea/, 'geometry hits should only preview when the native textarea is the real pointer target')
})

test('prompt reference previews invalidate stale portal geometry and removed resources', () => {
  const overlaySource = readPromptReferenceMentionOverlaySource()

  assert.match(overlaySource, /addEventListener\('scroll',[\s\S]*true\)/, 'page and textarea scroll should invalidate fixed preview coordinates')
  assert.match(overlaySource, /addEventListener\('resize'/, 'viewport resize should invalidate fixed preview coordinates')
  assert.match(overlaySource, /useEffect\(\(\) => \{[\s\S]*setHoveredReference\(null\)[\s\S]*\}, \[value, items\]\)/, 'prompt or current-resource changes should clear hovered media')
  assert.match(overlaySource, /items\.some\([\s\S]*item\.id === reference\.id[\s\S]*item\.src === reference\.src/, 'portal rendering should reject removed or replaced resources synchronously')
})

test('prompt reference picker contains wheel and touch scrolling without disabling its own scroll', () => {
  const pickerSource = readPromptReferenceMentionPickerSource()
  const scrollHandler = pickerSource.match(/const stopScrollPropagation[\s\S]*?\n\}/)?.[0] || ''

  assert.match(pickerSource, /overflow-y-auto[\s\S]*overscroll-contain/, 'picker should contain boundary overscroll')
  assert.match(pickerSource, /onWheel=\{stopScrollPropagation\}/, 'wheel events should not reach the generator panel or page')
  assert.match(pickerSource, /onTouchMove=\{stopScrollPropagation\}/, 'touch scrolling should not reach the generator panel or page')
  assert.match(pickerSource, /event\.stopPropagation\(\)/, 'scroll isolation should stop propagation')
  assert.doesNotMatch(scrollHandler, /preventDefault\(\)/, 'picker scrolling itself must remain native')
})

test('prompt reference picker exposes listbox popup semantics while textarea keeps focus', () => {
  const pickerSource = readPromptReferenceMentionPickerSource()

  assert.match(pickerSource, /id=\{id\}[\s\S]*role="listbox"/, 'picker should expose the trigger-controlled listbox id')
  assert.match(pickerSource, /role="option"[\s\S]*aria-selected=\{item\.id === activeItemId\}/, 'reference actions should expose option selection state')
  assert.match(source, /aria-haspopup="listbox"/, 'mention trigger should identify its popup type')
  assert.match(source, /aria-controls=\{promptMentionPickerId\}/, 'mention trigger should own the stable listbox id')
  assert.match(source, /event\.key === 'ArrowDown'[\s\S]*event\.key === 'ArrowUp'[\s\S]*event\.key === 'Enter'/, 'textarea keyboard handling should navigate and select listbox options')
  assert.match(source, /useEffect\(\(\) => \{[\s\S]*setPromptMentionActiveIndex[\s\S]*promptReferenceMentionItems\.length[\s\S]*\}, \[promptReferenceMentionItems\]\)/, 'resource removal should keep the active option index in range')
  assert.match(source, /if \(event\.key === 'Escape'\)[\s\S]*promptTextareaRef\.current\?\.focus\(\)/, 'Escape should close the popup and restore textarea focus')
})

test('prompt reference trigger and picker use the dedicated action row', () => {
  const pickerSource = readPromptReferenceMentionPickerSource()

  assert.match(source, /relative flex h-11 items-center px-3[\s\S]*data-prompt-reference-mention-trigger/, 'at-sign trigger should sit in the dedicated action row')
  assert.doesNotMatch(source, /data-prompt-reference-mention-trigger[\s\S]{0,300}border-t border-slate-200\/90/, 'the dedicated action row should not use a harsh divider')
  assert.match(pickerSource, /data-prompt-reference-mention-picker[\s\S]*z-30/, 'picker should remain above the prompt action row')
})

test('prompt action row keeps Clear beside the at-sign trigger', () => {
  assert.match(source, /data-prompt-reference-mention-trigger[\s\S]*data-prompt-clear/, 'video prompt actions should keep Clear on the same row as the at-sign trigger')
  assert.match(source, /data-prompt-clear[\s\S]*aria-label="Clear Prompt"[\s\S]*<DeleteIcon size=\{14\} \/>[\s\S]*Clear/, 'video Clear action should use an explicit label and trash icon')
})

test('project rules enforce shared hero ownership and reusable defect recurrence prevention', () => {
  assert.match(agentsSource, /breadcrumb、H1、Demo[\s\S]*单一 owner/, 'shared hero structures should have one explicit owner')
  assert.match(agentsSource, /isolated[\s\S]*reusable/, 'defects should be classified by recurrence scope')
  assert.match(agentsSource, /可复用模式[\s\S]*项目规则[\s\S]*契约测试/, 'reusable defect patterns should require both a project rule and a contract test')
})

test('AI video generator keeps multimodal references out of text-to-video mode', () => {
  assert.match(source, /supportsAiVideoMultimodalReferencesForMode\(modelConfig, activeMode\)/, 'multimodal UI should read a mode-level capability contract')
  assert.match(source, /\{supportsMultimodalReferences && \(!isUsingFirstLastFrame \|\| canCombineFirstLastFrameWithReferences\) \? \(/, 'reference video and audio uploads should only render when the active mode supports them')
  assert.match(source, /if \(!supportsMultimodalReferences\) return \{ generationUrls: \[\], historyUrls: \[\] \}/, 'hidden multimodal references should not upload in text-to-video mode')
  assert.match(source, /referenceVideoDuration: supportsMultimodalReferences \? referenceVideoDurationTotal : 0/, 'hidden reference videos should not affect text-to-video pricing')
})

test('Kling character orientation sits directly below the prompt field', () => {
  const promptFieldIndex = source.indexOf('{promptLabel}</label>')
  const orientationIndex = source.indexOf('<div data-character-orientation>')
  const outputSettingsIndex = source.indexOf('data-video-output-settings')

  assert.notEqual(promptFieldIndex, -1, 'prompt field should exist')
  assert.notEqual(orientationIndex, -1, 'character orientation should exist')
  assert.notEqual(outputSettingsIndex, -1, 'fixed output settings should exist after the prompt')
  assert.ok(promptFieldIndex < orientationIndex, 'character orientation should render below the prompt field')
  assert.ok(orientationIndex < outputSettingsIndex, 'character orientation should stay above the fixed output settings')
})

test('AI video generator uses the shared compact reference-image tile', () => {
  assert.match(source, /<ReferenceImageUploader/, 'video upload should reuse the global reference uploader')
  assert.match(source, /size="compact"/, 'video reference uploads should use the compact tile shared with image generators')
  assert.match(uploaderSource, /data-reference-upload-tile/, 'shared upload should expose a square upload tile')
  assert.match(uploaderSource, /max-w-28/, 'shared compact upload should stay close to the image generator grid tile size')
  assert.match(uploaderSource, /<ImageReplaceButton/, 'shared uploader should expose image replacement')
  assert.match(source, /remoteImageUrls\.map[\s\S]*onReplace: \(file: File\) => replaceRemoteImageWithFile\(index, file\)/, 'preloaded remote video reference images should keep the same replace action')
  assert.match(source, /const replaceRemoteImageWithFile = async \(index: number, file: File\)/, 'remote video reference image replacement should be handled explicitly')
  assert.notEqual(source.indexOf('removeImage(index)'), -1, 'uploaded video references should support the same inline delete action')
  assert.match(uploaderSource, /maxImages > 1/, 'single-reference models should not open a multi-file picker')
  assert.equal(source.includes('min-h-[150px]'), false, 'video upload should not use the old large dropzone')
  assert.equal(source.includes('clearImages'), false, 'video upload should not keep a separate clear-all control')
})

test('AI video generator supports explicit first and last frame image slots for compatible models', () => {
  const configSource = readFileSync(join(process.cwd(), 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')

  assert.match(configSource, /supportsFirstLastFrame\?: boolean/, 'model config should explicitly mark first/last-frame support')
  assert.match(configSource, /id: 'seedance-2',[\s\S]*?supportsFirstLastFrame: true/, 'Seedance 2.0 should expose first/last-frame mode')
  assert.match(configSource, /id: 'seedance-2-mini',[\s\S]*?supportsFirstLastFrame: true/, 'Seedance 2.0 Mini should expose first/last-frame mode')
  assert.match(configSource, /'seedance-2-fast'[\s\S]*?supportsFirstLastFrame: id === 'seedance-2-fast'/, 'Seedance 2.0 Fast should expose first/last-frame mode without marking Seedance 1.5 as first/last-frame')
  assert.match(configSource, /id: 'wan-2-7',[\s\S]*?supportsFirstLastFrame: true/, 'Wan 2.7 should expose first/last-frame mode')
  assert.match(configSource, /'kling-3-turbo'[\s\S]*?supportsFirstLastFrame: true/, 'Kling 3 Turbo should expose first/last-frame mode')
  assert.match(configSource, /id: 'kling-3',[\s\S]*?supportsFirstLastFrame: true/, 'Kling 3.0 should expose first/last-frame mode')
  assert.match(configSource, /maxImages: 1,[\s\S]*?supportsFirstLastFrame: id === 'kling-2-5'/, 'Kling 2.5 Turbo Pro should keep its ordinary reference-image limit separate from first/last frames')
  assert.match(configSource, /supportsFirstLastFrame: id === 'kling-2-5'/, 'Kling 2.5 Turbo Pro should expose first/last-frame mode without marking other Kling 2.x models')
  assert.match(configSource, /id: 'seedance-2',[\s\S]*?maxImages: 9,[\s\S]*?supportsFirstLastFrame: true/, 'Seedance 2.0 multi-reference uploads should allow nine images independently from first/last frames')

  assert.match(source, /const supportsFirstLastFrame = activeMode === 'image-to-video' && Boolean\(modelConfig\.supportsFirstLastFrame\)/, 'the toggle should only render for image-to-video models that support it')
  assert.match(source, /const \[firstLastFrameEnabled, setFirstLastFrameEnabled\] = useState\(false\)/, 'the UI should track first/last-frame mode independently from upload count')
  assert.match(source, /label: 'First\/Last Frames'[\s\S]*tone: 'positive'/, 'first/last-frame models should show a model-list capability tag')
  assert.match(source, /data-first-last-frame-toggle/, 'the upload header should expose a first/last-frame toggle')
  assert.match(source, /aria-pressed=\{firstLastFrameEnabled\}/, 'the toggle should expose pressed state')
  assert.match(source, /data-first-last-frame-toggle[\s\S]*className=\{`inline-flex items-center gap-2 rounded-md p-0 text-\[12px\]/, 'the first/last-frame toggle should read like an inline switch, not a pill button')
  assert.match(source, /firstLastFrameEnabled \? 'translate-x-3\.5' : 'translate-x-0\.5'/, 'the enabled switch knob should slide to the right edge of the first/last-frame track')
  assert.doesNotMatch(source, /data-first-last-frame-toggle[\s\S]{0,900}rounded-full border px-2 py-1/, 'the first/last-frame toggle should not have an outer pill border')
  assert.match(source, /data-first-last-frame-slots/, 'enabled first/last-frame mode should render a dedicated two-slot layout')
  assert.match(source, /className="flex w-fit items-start gap-3"/, 'first/last-frame slots should use a tight flex row so the swap control sits between the two actual upload boxes')
  assert.match(source, /className="w-28 shrink-0"[\s\S]*testIdPrefix="video-first-frame"/, 'first-frame slot should keep the compact upload box from shrinking in the flex row')
  assert.match(source, /className="w-28 shrink-0"[\s\S]*testIdPrefix="video-last-frame"/, 'last-frame slot should keep the compact upload box from shrinking in the flex row')
  assert.match(source, /label=\{text\.firstFrame\}/, 'the first slot should be labeled as the first frame')
  assert.match(source, /label=\{text\.lastFrame\}/, 'the second slot should be labeled as the last frame')
  assert.match(source, /data-first-last-frame-swap/, 'the two slots should expose a swap action between them')
  assert.match(source, /data-first-last-frame-swap[\s\S]*className="mt-16 inline-flex h-8 w-8/, 'the swap action should align with the vertical center of the upload boxes')
  assert.match(source, /swapReferenceImageSlots\(0, 1\)/, 'the swap action should exchange the first and last frame slots')
  assert.match(source, /onFiles=\{\(files\) => void handleFilesForReferenceSlot\(0, files\)\}/, 'first-frame uploads should fill slot 0 instead of appending blindly')
  assert.match(source, /onFiles=\{\(files\) => void handleFilesForReferenceSlot\(1, files\)\}/, 'last-frame uploads should fill slot 1 instead of appending blindly')
  assert.match(source, /activeMode === 'image-to-video' \? \(\s*firstLastFrameEnabled \? \(/, 'first/last-frame slots should replace the ordinary multi-reference uploader when enabled')
  assert.match(source, /firstLastFrameEnabled \? \(\s*<div data-first-last-frame-slots>[\s\S]*\) : \(\s*<ReferenceImageUploader/, 'first/last-frame mode and multi-reference mode should be mutually exclusive in the same upload slot')
  assert.match(source, /<ReferenceImageUploader[\s\S]*maxImages=\{modelConfig\.maxImages\}[\s\S]*testIdPrefix="video-reference"[\s\S]*headerAction=\{firstLastFrameToggle\}/, 'ordinary reference-image upload should keep using modelConfig.maxImages when first/last-frame mode is off')
  assert.match(source, /type UploadedImageMediaReferences = \{[\s\S]*referenceGenerationUrls: string\[\][\s\S]*firstLastFrameGenerationUrls: string\[\]/, 'image upload results should keep reference images separate from first/last-frame images')
  assert.match(source, /formData\.append\('imageUrls', JSON\.stringify\(uploadedImageMedia\.referenceGenerationUrls\)\)/, 'ordinary reference images should continue using imageUrls')
  assert.match(source, /formData\.append\('firstFrameUrl', uploadedImageMedia\.firstLastFrameGenerationUrls\[0\]\)/, 'first frame should use a dedicated request field')
  assert.match(source, /formData\.append\('lastFrameUrl', uploadedImageMedia\.firstLastFrameGenerationUrls\[1\]\)/, 'last frame should use a dedicated request field')
})

test('AI video generator preserves ordinary reference images when first/last-frame mode toggles', () => {
  const toggleHandler = extractConstFunctionSource('handleFirstLastFrameToggle')

  assert.doesNotMatch(toggleHandler, /imageFilesRef\.current\.forEach/, 'the toggle must not revoke ordinary local image previews')
  assert.doesNotMatch(toggleHandler, /imageFilesRef\.current = \[\]/, 'the toggle must not reset the ordinary local image ref')
  assert.doesNotMatch(toggleHandler, /setImageFiles\(\[\]\)/, 'the toggle must preserve ordinary local images')
  assert.doesNotMatch(toggleHandler, /setRemoteImageUrls\(\[\]\)/, 'the toggle must preserve ordinary remote images')
  assert.match(toggleHandler, /motionVideoFilesRef\.current\.forEach/, 'the toggle should keep clearing incompatible reference videos')
  assert.match(toggleHandler, /audioFilesRef\.current\.forEach/, 'the toggle should keep clearing incompatible reference audio')
})

test('Kling motion control restricts character image uploads to KIE-supported image formats', () => {
  const configSource = readFileSync(join(process.cwd(), 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')

  assert.match(configSource, /id: 'kling-2-6-motion-control'[\s\S]*acceptedImageMimeTypes: \['image\/jpeg', 'image\/png'\]/)
  assert.match(configSource, /id: 'kling-2-6-motion-control'[\s\S]*acceptedImageExtensions: \['jpg', 'jpeg', 'png'\]/)
  assert.match(configSource, /id: 'kling-2-6-motion-control'[\s\S]*referenceImageMinDimensionPx: 300/)
  assert.match(configSource, /id: 'kling-2-6-motion-control'[\s\S]*referenceImageAspectRatioMin: 2 \/ 5/)
  assert.match(configSource, /id: 'kling-2-6-motion-control'[\s\S]*referenceImageAspectRatioMax: 5 \/ 2/)
  assert.match(source, /import \{ getReferenceImageConstraintError/)
  assert.match(source, /const getReferenceImageDimensions = \(file: File\): Promise<\{ width: number; height: number \}>/)
  assert.match(source, /const validateReferenceImageFile = async \(file: File\)/)
  assert.match(source, /showImageInvalidDimensionsNotice/)
  assert.match(source, /await validateReferenceImageFile\(file\)/)
  assert.match(source, /acceptedTypes=\{modelConfig\.acceptedImageMimeTypes\?\.join\(','\)\}/)
  assert.match(source, /acceptedMimeTypes=\{modelConfig\.acceptedImageMimeTypes\}/)
  assert.match(source, /acceptedFileExtensions=\{modelConfig\.acceptedImageExtensions\}/)
  assert.match(source, /onInvalidType=\{showImageInvalidTypeNotice\}/)
  assert.match(source, /helperText=\{referenceImageHelperText\}/)
  assert.match(source, /uploadForm\.append\('uploadPurpose', modelConfig\.uploadPurpose\)/)
  assert.equal(source.includes("uploadForm.append('uploadProvider'"), false, 'browser upload payload must not expose provider fields')
  assert.equal(source.includes("uploadForm.append('uploadPath'"), false, 'browser upload payload must not expose internal upload paths')
  assert.equal(source.includes("uploadForm.append('uploadFormatProfile'"), false, 'browser upload payload must not expose provider format profiles')
  assert.doesNotMatch(source, /helperText=\{formatText\(text\.fileLimit, \{ size: modelConfig\.maxFileSizeMb \}\)\}/)
})

test('AI video generator exposes a motion reference video upload for Kling motion models', () => {
  const motionUploaderSource = readMotionReferenceVideoUploaderSource()

  assert.notEqual(source.indexOf('supportsMotionReferenceVideo'), -1, 'motion-control models should expose a config flag')
  assert.notEqual(source.indexOf('motionVideoFiles'), -1, 'video generator should track local motion reference videos')
  assert.notEqual(source.indexOf('uploadMotionVideos'), -1, 'video generator should upload motion reference videos before creating a task')
  assert.notEqual(source.indexOf("const getUploadUrlForModel = (config: AiVideoGeneratorModelConfig) => config.uploadPurpose === 'kling-motion-control' ? '/api/upload' : getImageUploadUrl()"), -1, 'motion-control uploads should use the current app upload route instead of the default remote Pages upload URL')
  assert.equal(source.includes('const uploadUrl = getImageUploadUrl()'), false, 'model uploads should not call the generic upload URL directly')
  assert.match(source, /const uploadUrl = getUploadUrlForModel\(modelConfig\)[\s\S]*for \(const imageItem of imageFiles\)/, 'reference image uploads should use the model-aware upload URL')
  assert.match(source, /const uploadUrl = getUploadUrlForModel\(modelConfig\)[\s\S]*for \(const videoItem of motionVideoFiles\)/, 'motion video uploads should use the model-aware upload URL')
  assert.notEqual(source.indexOf("uploadForm.append('uploadPurpose', modelConfig.uploadPurpose)"), -1, 'motion-control uploads should send only a neutral upload purpose')
  assert.equal(source.includes("uploadForm.append('uploadProvider'"), false, 'motion-control uploads should not expose provider names in browser payloads')
  assert.equal(source.includes("uploadForm.append('uploadPath'"), false, 'motion-control uploads should not expose internal upload paths in browser payloads')
  assert.equal(source.includes("uploadForm.append('uploadFormatProfile'"), false, 'motion-control uploads should not expose provider format profiles in browser payloads')
  assert.match(source, /const mediaReference = String\(uploadResult\.uploadRef \|\| uploadResult\.url \|\| ''\)\.trim\(\)/, 'generation payloads should prefer opaque upload references over provider URLs')
  assert.equal(source.includes('const url = String(uploadResult.url || \'\').trim()'), false, 'motion-control upload results should not force real provider URLs into browser payloads')
  assert.match(source, /formData\.append\('videoUrls', JSON\.stringify\(uploadedMotionVideoMedia\.generationUrls\)\)/, 'generation request should submit KIE motion-control videoUrls')
  assert.match(source, /<MotionReferenceVideoUploader/, 'motion-control models should render the shared video upload control')
  assert.notEqual(motionUploaderSource.indexOf('data-motion-reference-video-uploader'), -1, 'motion-control uploader component should render a dedicated wrapper')
  assert.notEqual(source.indexOf('ACCEPTED_MOTION_REFERENCE_VIDEO_TYPES'), -1, 'motion reference upload should centralize its accepted formats')
  assert.notEqual(source.indexOf('video/mp4,video/quicktime,video/x-matroska,.mp4,.mov,.mkv'), -1, 'motion reference upload should accept MP4, QuickTime, and Matroska only')
  assert.match(source, /const motionReferenceVideoFormats = modelConfig\.acceptedMotionVideoFormats\?\.join\(', '\) \|\| 'MP4, QuickTime'/, 'motion reference helper should read supported formats from model config')
  assert.match(source, /formatText\(text\.motionReferenceVideoHelper, \{[\s\S]*formats: motionReferenceVideoFormats,[\s\S]*size: modelConfig\.maxVideoFileSizeMb \|\| 50,[\s\S]*max: referenceVideoMaxDurationSeconds/, 'motion reference helper should render the configured format, size, and orientation-specific duration')
  assert.notEqual(source.indexOf('Output duration follows the motion reference video.'), -1, 'motion reference helper should explain duration is reference-video derived')
  assert.notEqual(source.indexOf('replaceMotionVideoWithFile'), -1, 'motion reference previews should support replacement')
  assert.notEqual(motionUploaderSource.indexOf('data-motion-video-replace'), -1, 'motion reference previews should expose a hover replace button')
  assert.notEqual(motionUploaderSource.indexOf('data-motion-video-large-dropzone'), -1, 'motion reference upload should use one large upload box')
  assert.notEqual(motionUploaderSource.indexOf('data-motion-video-empty-requirements'), -1, 'empty motion reference upload should show format, size, and duration requirements inside the box')
  assert.notEqual(motionUploaderSource.indexOf('data-motion-video-selected-card'), -1, 'selected motion reference video should cover the upload box')
  assert.notEqual(motionUploaderSource.indexOf('data-motion-video-preview-button'), -1, 'selected motion reference video should expose a preview button')
  assert.notEqual(source.indexOf('data-motion-video-preview-dialog'), -1, 'preview button should open a video preview dialog')
  assert.notEqual(source.indexOf('setMotionVideoPreview'), -1, 'motion reference preview dialog should be state-driven')
  const motionUploaderBlock = motionUploaderSource
  const selectedMotionVideoBlock = motionUploaderSource.slice(motionUploaderSource.indexOf('data-motion-video-selected-card'), motionUploaderSource.indexOf('data-motion-video-empty-requirements'))
  const emptyMotionVideoBlock = motionUploaderSource.slice(motionUploaderSource.indexOf('data-motion-video-empty-requirements'))
  assert.match(selectedMotionVideoBlock, /className="[^"]*object-contain[^"]*object-center/, 'selected motion reference video should show the full source frame centered without cropping')
  assert.equal(selectedMotionVideoBlock.includes('object-cover'), false, 'selected motion reference video should not crop portrait or square reference videos')
  assert.notEqual(motionUploaderBlock.indexOf('data-motion-video-heading'), -1, 'motion reference component should keep its title above the upload box')
  assert.ok(
    motionUploaderBlock.indexOf('data-motion-video-heading') < motionUploaderBlock.indexOf('data-motion-video-large-dropzone'),
    'motion reference title should sit outside and above the upload box',
  )
  assert.equal(selectedMotionVideoBlock.includes('>{title}</'), false, 'selected motion video box should not repeat the title')
  assert.equal(emptyMotionVideoBlock.includes('>{title}</'), false, 'empty motion video box should not repeat the title')
  assert.equal(selectedMotionVideoBlock.includes('helperText'), false, 'selected motion video should hide requirements after upload')
  assert.equal(emptyMotionVideoBlock.includes('helperText'), true, 'empty motion video box should show requirements before upload')
  assert.notEqual(selectedMotionVideoBlock.indexOf('data-motion-video-delete'), -1, 'selected motion video should expose a top-right delete button')
  assert.notEqual(selectedMotionVideoBlock.indexOf('aria-label={deleteLabel}'), -1, 'delete button should keep an accessible label')
  assert.match(selectedMotionVideoBlock, /data-motion-video-preview-button[\s\S]*opacity-0[\s\S]*group-hover:opacity-100[\s\S]*group-focus-within:opacity-100/, 'preview action should only appear on hover or focus')
  assert.match(selectedMotionVideoBlock, /data-motion-video-replace[\s\S]*opacity-0[\s\S]*group-hover:opacity-100[\s\S]*group-focus-within:opacity-100/, 'replace action should only appear on hover or focus')
  assert.notEqual(source.indexOf('src: motionVideoFiles[0].preview'), -1, 'uploaded motion reference videos should render an in-form video preview')
  assert.notEqual(motionUploaderSource.indexOf('preload="metadata"'), -1, 'motion reference previews should load video metadata without eager full playback')
  assert.notEqual(source.indexOf('getMotionReferenceVideoDuration'), -1, 'local motion videos should be validated from video metadata')
  assert.notEqual(source.indexOf('referenceVideoMinDurationSeconds'), -1, 'motion-control video validation should use configured min duration')
  assert.notEqual(source.indexOf('referenceVideoMaxDurationSeconds'), -1, 'motion-control video validation should use configured max duration')
  assert.notEqual(source.indexOf('setDuration(Math.ceil(videoDurationSeconds))'), -1, 'generation duration should follow the uploaded motion reference video duration')
  assert.equal(source.includes('accept="video/mp4,video/webm,video/quicktime"'), false, 'KIE motion reference upload should not accept WebM')
  assert.equal(source.includes('MP4, WebM, or MOV'), false, 'KIE motion reference helper should not advertise WebM')
  assert.equal(source.includes('h-24 w-24'), false, 'motion reference upload should not use tiny square thumbnails')
})

test('motion reference video upload is extracted into a reusable component', () => {
  assert.equal(existsSync(motionReferenceVideoUploaderPath), true, 'shared motion reference video uploader component should exist')
  const motionUploaderSource = readFileSync(motionReferenceVideoUploaderPath, 'utf8')

  assert.match(source, /import MotionReferenceVideoUploader/, 'video generator should import the shared motion reference video uploader')
  assert.match(source, /<MotionReferenceVideoUploader/, 'video generator should render the shared motion reference video uploader')
  assert.match(motionUploaderSource, /export type MotionReferenceVideoUploaderItem/, 'shared uploader should expose a reusable selected video item type')
  assert.match(motionUploaderSource, /data-motion-reference-video-uploader/, 'shared uploader should own the motion reference wrapper')
  assert.match(motionUploaderSource, /data-motion-video-heading/, 'shared uploader should own the title placement')
  assert.match(motionUploaderSource, /data-motion-video-empty-requirements/, 'shared uploader should own the empty requirements state')
  assert.match(motionUploaderSource, /data-motion-video-selected-card/, 'shared uploader should own the selected preview state')
  assert.match(motionUploaderSource, /data-motion-video-preview-button[\s\S]*group-hover:opacity-100/, 'shared uploader should keep preview as a hover action')
  assert.match(motionUploaderSource, /data-motion-video-replace[\s\S]*group-hover:opacity-100/, 'shared uploader should keep replace as a hover action')
  assert.match(motionUploaderSource, /data-motion-video-delete/, 'shared uploader should keep the top-right delete action')
})

test('Kling motion control exposes character orientation and applies its video-length limit', () => {
  assert.notEqual(source.indexOf("const [characterOrientation, setCharacterOrientation] = useState<'image' | 'video'>(initialCharacterOrientation || 'video')"), -1)
  assert.notEqual(source.indexOf('data-character-orientation'), -1, 'motion-control models should render the required orientation selector')
  assert.match(source, /characterOrientation === 'image'[^\n]*\? 10[^\n]*: modelConfig\.referenceVideoMaxDurationSeconds/, 'image orientation should cap motion references at 10 seconds')
  assert.match(source, /formData\.append\('characterOrientation', characterOrientation\)/, 'generation requests should submit the selected orientation')
  assert.equal(source.includes("formData.append('characterOrientation', 'video')"), false, 'orientation must not be hard-coded')
})

test('Kling motion control preserves character orientation in history Recreate', () => {
  assert.notEqual(source.indexOf("characterOrientation?: 'image' | 'video'"), -1)
  assert.notEqual(source.indexOf('getHistoryCharacterOrientation'), -1)
  assert.match(source, /characterOrientation: supportsMotionReferenceVideo \? characterOrientation : undefined/)
  assert.match(source, /setCharacterOrientation\(item\.characterOrientation \|\| 'video'\)/)
  assert.match(source, /characterOrientation: request\.characterOrientation/)
})

test('reference-video models hide generate credits until a valid reference video is present', () => {
  assert.match(source, /const shouldShowGenerationCreditCost = modelConfig\.durationMode !== 'reference-video' \|\| motionReferenceVideoCount > 0/)
  assert.match(source, /!isPreparing && shouldShowGenerationCreditCost/)
  assert.match(source, /data-generate-credit-cost/)
})

test('Kling motion control prompts are optional and duration follows the reference video', () => {
  assert.notEqual(source.indexOf('const promptRequired = modelConfig.promptRequired !== false'), -1, 'prompt requiredness should come from model config')
  assert.match(source, /const canGenerate = \(!promptRequired \|\| prompt\.trim\(\)\.length > 0\)/, 'optional-prompt models should generate without prompt text')
  assert.match(source, /promptRequired \? text\.prompt : `\$\{text\.prompt\} \(\$\{text\.optional\}\)`/, 'optional-prompt models should label the prompt clearly')
  assert.notEqual(source.indexOf("optional: 'Optional'"), -1, 'fallback copy should include Optional for prompt labels')
  assert.notEqual(source.indexOf("modelConfig.durationMode === 'reference-video'"), -1, 'reference-video models should branch away from manual duration selection')
  assert.match(source, /modelConfig\.durationMode === 'reference-video' \? \(\s*<div data-video-reference-duration-note/, 'reference-video models should show a read-only duration note in the expanded settings')
  assert.match(source, /modelConfig\.durationMode === 'reference-video' \? text\.referenceImageAspectRatioLabel/, 'reference-video models should show a read-only summary label')
})

test('AI video generator uses the image-tool style two-level model selector above upload', () => {
  const selectorIndex = source.indexOf('data-video-model-selector')
  const menuIndex = source.indexOf('data-video-model-menu')
  const desktopGroupIndex = source.indexOf('data-video-model-groups')
  const desktopOptionsIndex = source.indexOf('data-video-model-options')
  const uploadIndex = source.indexOf('<ReferenceImageUploader')

  assert.notEqual(selectorIndex, -1, 'video model selector should exist')
  assert.notEqual(menuIndex, -1, 'video model selector should expose a menu')
  assert.notEqual(desktopGroupIndex, -1, 'video model selector should expose first-level groups')
  assert.notEqual(desktopOptionsIndex, -1, 'video model selector should expose second-level models')
  assert.ok(selectorIndex < uploadIndex, 'video model selector should sit above the image upload area')
  assert.match(source, /getAiVideoGeneratorModelGroupsForMode\(activeMode\)/, 'video selector should use grouped model data for the active mode')
  assert.notEqual(source.indexOf('md:w-[640px] md:grid-cols-[210px_minmax(0,430px)]'), -1, 'desktop model selector should match the image tool two-level width')
  assert.notEqual(source.indexOf('src={group.logoSrc}'), -1, 'video model mark should render the configured model logo')
  assert.notEqual(source.indexOf('alt={group.logoAlt}'), -1, 'video model logo should keep descriptive alt text')
  assert.notEqual(source.indexOf('src={option.logoSrc}'), -1, 'second-level video models should render each model logo')
  assert.notEqual(source.indexOf('alt={option.logoAlt}'), -1, 'second-level video model logos should keep descriptive alt text')
  assert.notEqual(source.indexOf('option.description'), -1, 'second-level video models should show model descriptions')
  assert.notEqual(source.indexOf('<VideoModelQualityRating value={option.qualityRating} />'), -1, 'second-level video models should show quality ratings')
  assert.notEqual(source.indexOf('getVideoModelOptionMetadata(option)'), -1, 'second-level video models should show model credit metadata')
  assert.notEqual(source.indexOf('/credits-icons/diamond-3d-indigo.svg'), -1, 'second-level video credit metadata should use the Toolaze credits icon')
  assert.notEqual(source.indexOf('h-5 w-5 shrink-0 rounded-md object-contain'), -1, 'video model mark should match the image tool icon height')
  assert.equal(source.includes('label.slice(0, 1).toUpperCase()'), false, 'video model selector should not use a letter placeholder for Grok')
  assert.equal(source.includes('inline-flex h-8 min-w-8'), false, 'video model mark should not make the selector taller than the image tool')
  assert.equal(source.includes('<select'), false, 'video model selector should not use the old dropdown select')
  assert.equal(source.includes('text.modeHint'), false, 'video tool should not render the mode hint sentence')
})

test('Seedance secondary model options show Hot and New badges', () => {
  const configSource = readFileSync(join(process.cwd(), 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')

  assert.match(configSource, /id: 'seedance-2',[\s\S]*?badge: 'Hot'/)
  assert.match(configSource, /id: 'seedance-2-mini',[\s\S]*?badge: 'New'/)
  assert.match(source, /option\.badge && \(/)
  assert.match(source, /option\.badge === 'Hot' \? 'bg-red-500' : 'bg-emerald-500'/)
  assert.match(source, /\{getModelBadgeLabel\(option\.badge\)\}/)
})

test('AI video generator ships the local Grok logo asset used by the selector', () => {
  const logoPath = join(process.cwd(), 'public', 'model-logos', 'grok.svg')
  const logoSource = readFileSync(logoPath, 'utf8')

  assert.ok(existsSync(logoPath), 'Grok selector logo should be a local public asset')
  assert.match(logoSource, /<svg[^>]+viewBox="0 0 24 24"/, 'Grok logo should use the downloaded compact mark viewBox for small selector icons')
  assert.match(logoSource, /Grok/, 'Grok logo should preserve an accessible title')
})

test('AI video generator ships downloaded model logo assets used by the selector', () => {
  const bytedanceLogoPath = join(process.cwd(), 'public', 'model-logos', 'bytedance.svg')
  const klingLogoPath = join(process.cwd(), 'public', 'model-logos', 'kling.svg')
  const bytedanceLogoSource = readFileSync(bytedanceLogoPath, 'utf8')
  const klingLogoSource = readFileSync(klingLogoPath, 'utf8')

  assert.ok(existsSync(bytedanceLogoPath), 'Seedance models should use the downloaded ByteDance logo asset')
  assert.ok(existsSync(klingLogoPath), 'Kling model should use the downloaded Kling logo asset')
  assert.match(bytedanceLogoSource, /<title>ByteDance<\/title>/, 'ByteDance logo should be the downloaded branded SVG')
  assert.match(klingLogoSource, /<title>Kling<\/title>/, 'Kling logo should be the downloaded branded SVG')
})

test('AI video generator places duration below resolution', () => {
  const aspectRatioIndex = source.indexOf('{text.aspectRatio}')
  const resolutionIndex = source.indexOf('{text.resolution}')
  const durationIndex = source.indexOf('data-video-duration-selector')

  assert.notEqual(aspectRatioIndex, -1, 'aspect ratio control should exist')
  assert.notEqual(resolutionIndex, -1, 'resolution control should exist')
  assert.notEqual(durationIndex, -1, 'duration control should exist')
  assert.ok(aspectRatioIndex < resolutionIndex, 'resolution should follow aspect ratio')
  assert.ok(resolutionIndex < durationIndex, 'duration should sit below resolution')
})

test('AI video generator keeps the right demo panel free of sample and provider labels', () => {
  assert.equal(source.includes('{text.samplePreview}'), false, 'demo panel should not show sample preview copy')
  assert.equal(source.includes('{modelConfig.vendor}'), false, 'demo panel should not show provider copy')
  assert.equal(source.includes('{modelConfig.previewTone}'), false, 'default demo canvas should not show preview-tone copy')
  assert.equal(source.includes('{getModeLabel(activeMode, text)}'), false, 'demo panel should not duplicate the active mode label')
  assert.equal(source.includes('<h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">{modelConfig.name}</h3>'), false, 'demo panel should not show the model name as a sample title')
})

test('AI video generator keeps the demo preview canvas shallow', () => {
  assert.notEqual(source.indexOf('data-video-preview-canvas'), -1, 'demo preview canvas should exist')
  assert.notEqual(source.indexOf('data-video-preview-frame'), -1, 'demo preview should keep a single inner video frame')
  assert.notEqual(source.indexOf('data-video-demo-media'), -1, 'demo preview should render a real video when configured')
  assert.notEqual(source.indexOf('demoVideo?.src'), -1, 'demo preview should read video media from page data')
  assert.notEqual(source.indexOf('autoPlay'), -1, 'demo video should autoplay silently in the hero preview')
  assert.notEqual(source.indexOf('playsInline'), -1, 'demo video should play inline on mobile browsers')
  assert.match(source, /data-video-preview-frame[\s\S]*className=\{demoVideo\?\.src[\s\S]*bg-transparent[\s\S]*aspect-video[\s\S]*bg-slate-950/, 'real demo media should use its natural ratio while the empty fallback keeps a 16:9 frame')
  assert.match(source, /data-video-demo-media[\s\S]*className="block h-auto max-h-\[520px\] w-auto max-w-full object-contain"/, 'real demo media should size from its intrinsic aspect ratio without side fill')
  assert.doesNotMatch(source, /data-video-demo-media[\s\S]{0,200}bg-slate-950/, 'real demo media should not paint black behind portrait video')
  assert.match(source, /data-video-preview-canvas[\s\S]*bg-\[#F7F5FF\] p-6/, 'demo preview canvas should use one subtle flat purple surface')
  assert.doesNotMatch(source, /data-video-preview-canvas[\s\S]{0,400}bg-\[radial-gradient/, 'demo video should not sit on a purple gradient layer')
  assert.doesNotMatch(source, /data-video-preview-frame[^>]*shadow-indigo/, 'demo video frame should not keep a purple shadow behind the media')
  assert.equal(source.includes('className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient'), false, 'demo preview should not wrap the gradient in a second visible panel')
  assert.equal(source.includes('absolute inset-6'), false, 'demo preview should not include an extra translucent inner shell')
})

test('AI video generator matches image tool generating and result panel structure', () => {
  assert.notEqual(source.indexOf('data-video-generating-panel'), -1, 'video generating state should use a full-size right panel')
  assert.equal(source.includes('data-video-generating-card'), false, 'video generating state should not shrink into a nested aspect-ratio card')
  assert.match(source, /animationDelay: '0s'[\s\S]*animationDelay: '0\.2s'[\s\S]*animationDelay: '0\.4s'[\s\S]*animationDelay: '0\.6s'/, 'video generating state should use the same four-dot pulse rhythm as the image tool')
  assert.notEqual(source.indexOf('formatText(text.generatingSeconds, { seconds: generatingSeconds })'), -1, 'video generating state should use the same elapsed-seconds copy pattern as the image tool')
  assert.notEqual(source.indexOf('data-video-result-panel'), -1, 'video result should render a full-size focused result panel')
  assert.equal(source.includes('data-video-result-stage'), false, 'video result should not render inside an extra nested result stage')
  assert.notEqual(source.indexOf('data-video-result-actions'), -1, 'video result should expose result actions')
  assert.equal(source.includes('absolute right-3 top-3 flex items-center gap-2'), false, 'video result actions should not overlay the video')
  assert.match(source, /data-video-result-actions[\s\S]*\{text\.recreate\}[\s\S]*\{text\.download\}[\s\S]*<DeleteIcon/, 'video result actions should sit with recreate and delete controls')
  assert.equal(source.includes('inputPreview: imageUrls[0] || request.inputPreview'), false, 'opaque upload references should not replace the visible input preview')
  assert.match(source, /inputPreview: request\.inputPreview/, 'completed requests should preserve the local visible input preview after opaque upload refs are created')
  assert.match(source, /data-video-result-item[\s\S]{0,320}pb-6/, 'completed video history items should keep padding before the divider')
  assert.doesNotMatch(source, /data-video-result-item[\s\S]{0,320}lg:pb-0/, 'desktop history items should not remove divider padding')
  assert.match(source, /data-video-result-panel[\s\S]{0,100}className="flex h-full items-start justify-center lg:h-\[260px\]"/, 'history media should use the approved 260px desktop content height')
  assert.match(source, /data-video-result-details[\s\S]{0,100}className="flex h-full min-w-0 flex-col gap-4 lg:h-\[260px\]"/, 'history details should match the video height without consuming divider padding')
  assert.match(source, /className="h-full max-h-\[260px\] max-w-full object-contain"/, 'video history media should fill the row without exceeding 260px')
  assert.match(source, /data-video-result-actions className="mt-auto flex flex-wrap gap-2 pt-1"/, 'history actions should anchor to the bottom of the 260px details column')
  assert.doesNotMatch(source, /data-video-result-panel[\s\S]{0,180}bg-slate-950/, 'video history media should not sit on a dark panel background')
  assert.doesNotMatch(source, /data-video-result-panel[\s\S]{0,260}<video[\s\S]{0,180}(?:bg-black|rounded-)/, 'video history media should not add a black background or rounded corners')
  assert.equal(source.includes('currentRequest.createdAt'), false, 'video result panel should not show a separate timestamp pill')
})

test('AI video history Recreate restores every recorded setting without generating immediately', () => {
  assert.match(source, /recreate: 'Recreate'/)
  assert.match(source, /nativeAudio:\s*boolean/)
  assert.match(source, /const \[activeSettingsHistoryItemId, setActiveSettingsHistoryItemId\] = useState<string \| null>\(null\)/)
  assert.match(source, /const historyItemRefs = useRef\(new Map<string, HTMLDivElement>\(\)\)/)

  const historyApply = extractConstFunctionSource('applyHistoryItemToForm')
  assert.match(historyApply, /trackGenerationHistoryRecreateClick\(\{ \.\.\.item, mediaType: item\.mediaType === 'video' \? 'video' : 'image' \}, \{ surface: 'inline_generator_history' \}\)/)
  assert.match(historyApply, /if \(item\.mediaType === 'image'\) \{/)
  assert.match(historyApply, /window\.sessionStorage\.setItem\(PENDING_REPROMPT_STORAGE_KEY, JSON\.stringify\(buildHistoryRepromptPayload\(\{/)
  assert.match(historyApply, /window\.location\.href = buildHistoryRecreateHref\(\{[\s\S]*mediaType: 'image'[\s\S]*model: item\.model/)
  assert.match(historyApply, /if \(!item\.modelId\) return/)
  assert.match(historyApply, /setSelectedModelId\(item\.modelId\)/)
  assert.match(historyApply, /setActiveModelGroupId\(getAiVideoGeneratorModelGroupId\(item\.modelId\)\)/)
  assert.match(historyApply, /const nextMode = item\.mode as AiVideoGeneratorModeId/)
  assert.match(historyApply, /setActiveMode\(nextMode\)/)
  assert.match(historyApply, /setPrompt\(item\.prompt\)/)
  assert.match(historyApply, /setAspectRatio\(/)
  assert.match(historyApply, /setDuration\(/)
  assert.match(historyApply, /setResolution\(/)
  assert.match(historyApply, /setRemoteImageUrls\(item\.inputUrls\.slice\(0, itemConfig\.maxImages\)\)/)
  assert.match(historyApply, /setNativeAudio\(Boolean\(itemConfig\.supportsNativeAudio && item\.nativeAudio\)\)/)
  assert.match(historyApply, /setActiveSettingsHistoryItemId\(item\.id\)/)
  assert.match(historyApply, /historyItemRefs\.current\.get\(item\.id\)\?\.scrollIntoView\(\{ block: 'nearest', behavior: 'smooth' \}\)/)
  assert.doesNotMatch(historyApply, /handleGenerate\(/)

  assert.match(source, /ref=\{\(node\) => setHistoryItemRef\(item\.id, node\)\}/)
  assert.match(source, /activeSettingsHistoryItemId === item\.id/)
  assert.match(source, /nativeAudio:\s*request\.nativeAudio/)
  assert.match(source, /nativeAudio:\s*item\.nativeAudio === true/)
  assert.match(source, /mode:\s*request\.mode/, 'video history should persist the original creation mode')
  assert.match(source, /getHistoryGenerationMode\(item\.outputFormat, inferredHistoryMode\)/, 'persisted history should restore the stored creation mode')
})

test('AI video generator uses the shared generation history API for completed videos', () => {
  assert.match(source, /fetch\('\/api\/history\?limit=20'/, 'video tool should load the shared account history feed')
  assert.match(source, /mediaType:\s*'video'/, 'video tool should persist generated videos with mediaType video')
  assert.match(source, /fetch\('\/api\/history',\s*\{[\s\S]*method:\s*'POST'/, 'video tool should save completed generations to shared history')
  assert.match(source, /const persistGeneratedMediaToR2 = async \(/, 'video tool should centralize generated result persistence before history')
  assert.match(source, /fetch\('\/api\/save-image-to-r2'[\s\S]*mediaUrl[\s\S]*mediaType/, 'video tool should call the shared R2 media persistence endpoint with media type')
  assert.match(source, /const persistedVideoUrl = await persistGeneratedMediaToR2\(videoUrl, 'video'\)/, 'completed videos should be persisted to R2 before writing local state')
  assert.match(source, /persistGeneratedVideoHistoryItem\(completedRequest, persistedVideoUrl, \[\.\.\.imageUrls, \.\.\.uploadedMotionVideoMedia\.historyUrls\]/, 'shared history should store the R2-persisted generated video URL')
  assert.match(source, /outputPreview: persistedVideoUrl/, 'inline history preview should use the persisted generated video URL')
  assert.match(source, /type UploadedMediaReferences = \{[\s\S]*generationUrls: string\[\][\s\S]*historyUrls: string\[\]/, 'uploaded media should keep separate generation refs and displayable history urls')
  assert.match(source, /formData\.append\('imageUrls', JSON\.stringify\(uploadedImageMedia\.referenceGenerationUrls\)\)/, 'generation requests should keep using provider-safe reference-image refs')
  assert.match(source, /formData\.append\('firstFrameUrl', uploadedImageMedia\.firstLastFrameGenerationUrls\[0\]\)/, 'first/last-frame requests should use dedicated provider-safe frame refs')
  assert.match(source, /formData\.append\('videoUrls', JSON\.stringify\(uploadedMotionVideoMedia\.generationUrls\)\)/, 'generation requests should keep using provider-safe motion video references')
  assert.match(source, /firstLastFrame: request\.firstLastFrame/, 'shared video history should remember whether image inputs were first/last-frame resources')
  assert.match(source, /getHistoryToolMetadata\(pathname, modelConfig\.name, getVideoHistoryModelSlug\(selectedModelId\)\)/, 'video history should use the public model route metadata')
  assert.match(source, /mapPersistedVideoHistoryItem/, 'video tool should map persisted history records back into the inline feed')
  assert.doesNotMatch(source, /setHistory\(\(prev\) => \[completedRequest, \.\.\.prev\]\.slice\(0, 5\)\)/, 'video tool should not keep the old local-only five item history')
})

test('AI video history displays motion reference videos alongside reference images', () => {
  const pendingRenderer = extractConstFunctionSource('renderDesktopPendingVideoItem')
  const historyRenderer = extractConstFunctionSource('renderDesktopVideoHistoryItem')

  assert.match(source, /const renderVideoReferenceMedia = \(/, 'video history should use one reference-media renderer')
  assert.match(source, /data-video-history-reference-video/, 'motion reference videos should have a dedicated history selector')
  assert.match(source, /<video[\s\S]*src=\{url\}[\s\S]*preload="metadata"/, 'reference videos should render as video thumbnails')
  assert.match(pendingRenderer, /renderVideoReferenceMedia\(\{[\s\S]*motionVideoUrls: item\.motionVideoUrls \|\| \[\]/, 'generating rows should show selected motion reference videos')
  assert.match(historyRenderer, /renderVideoReferenceMedia\(\{[\s\S]*motionVideoUrls: item\.motionVideoUrls \|\| \[\]/, 'completed history rows should show saved motion reference videos')
})

test('AI video generator right side uses the image-style sample and history feed flow', () => {
  assert.match(source, /type RightPanelMode = 'sample' \| 'history'/)
  assert.match(source, /const \[rightMode, setRightMode\] = useState<RightPanelMode>\('sample'\)/)
  assert.match(source, /data-desktop-result-tabs/)
  assert.match(source, /data-desktop-result-tab="sample"[\s\S]*>\s*\{text\.demo\}/)
  assert.match(source, /data-desktop-result-tab="history"[\s\S]*>\s*\{text\.history\}/)
  assert.match(source, /data-video-result-feed/)
  assert.match(source, /data-video-result-item/)
  assert.match(source, /rightMode === 'history' \? \(\s*<>\s*\{renderVideoDemoCanvas\('md:hidden'\)\}[\s\S]*renderDesktopVideoResultFeed\(\)/)
  assert.equal(source.includes('<aside className="mt-4 rounded-2xl border border-[#E0E7FF] bg-white p-4'), false, 'video history should not render as a separate bottom panel')
})

test('AI video generator keeps mobile Demo fixed and shows one latest History item below the generator', () => {
  const videoPanel = source.slice(
    source.indexOf('<div data-video-demo-panel'),
    source.indexOf('{motionVideoPreview && ('),
  )

  assert.match(source, /data-mobile-video-history-panel/)
  assert.match(source, /const latestHistoryItem = history\[0\]/)
  assert.match(source, /\{renderMobileVideoHistoryPanel\(\)\}\s*<div data-video-demo-panel/)
  assert.match(source, /data-desktop-result-tabs[\s\S]*className="hidden w-fit[\s\S]*md:flex/)
  assert.match(videoPanel, /renderVideoDemoCanvas\('md:hidden'\)/, 'mobile should keep showing Demo even when desktop is on History')
  assert.match(videoPanel, /<div className="hidden min-h-0 min-w-0 flex-1 flex-col md:flex">[\s\S]*renderDesktopVideoResultFeed\(\)/)
  assert.match(videoPanel, /className=\{`\$\{rightMode === 'history' \? 'md:hidden' : ''\} shrink-0/)
})

test('AI video history prompts scroll instead of clipping long text', () => {
  assert.match(source, /const renderPromptPreview = \(promptText: string\) => \(/)
  assert.match(source, /data-video-history-prompt[\s\S]*className="max-h-\[8rem\][\s\S]*overflow-y-auto[\s\S]*overscroll-contain/)
  assert.doesNotMatch(source, /line-clamp-4 text-sm leading-6 text-slate-600/)
  assert.doesNotMatch(source, /items-start justify-between gap-4 overflow-hidden/)
})

test('AI video generator opens on Demo but switches to History after an in-page generation', () => {
  const initialHistoryLoad = source.match(/const loadInlineHistory = async \(\) => \{[\s\S]*?\n    \}/)?.[0] || ''
  const generateFlow = extractConstFunctionSource('handleGenerate')

  assert.match(source, /const \[rightMode, setRightMode\] = useState<RightPanelMode>\('sample'\)/)
  assert.match(source, /const hasDesktopResultTabs = isGenerating \|\| currentRequest\?\.status === 'failed' \|\| history\.length > 0/)
  assert.doesNotMatch(initialHistoryLoad, /setRightMode\('history'\)/, 'loading persisted history must keep the initial Demo selection')
  assert.match(generateFlow, /setCurrentRequest\(request\)[\s\S]*setRightMode\('history'\)/, 'starting a generation should reveal and select History')
  assert.match(generateFlow, /addHistoryItemToFeed\(historyItem\)[\s\S]*setRightMode\('history'\)/, 'a completed generation should remain on History')
})

test('AI video generator checks credits before entering the generating state', () => {
  const generateFlow = extractConstFunctionSource('handleGenerate')
  const authCheckIndex = generateFlow.indexOf('await ensureSignedInForGeneration(requestCreditCost)')
  const startRequestIndex = generateFlow.indexOf('setCurrentRequest(request)')

  assert.match(source, /getCachedGenerationAuthState[\s\S]*getGenerationAuthStateFromAuthMeResult[\s\S]*type GenerationAuthState/)
  assert.notEqual(source.indexOf('const [creditExhaustedModalOpen, setCreditExhaustedModalOpen] = useState(false)'), -1)
  assert.notEqual(authCheckIndex, -1, 'video generate should check auth and credits before starting')
  assert.notEqual(startRequestIndex, -1, 'video generate should still start a request after the preflight')
  assert.ok(authCheckIndex < startRequestIndex, 'credits preflight must happen before History enters generating state')
  assert.match(generateFlow, /const requestCreditCost = generationCreditCost/)
  assert.match(generateFlow, /if \(authState\.creditsExhausted\) \{[\s\S]*setCreditExhaustedModalOpen\(true\)[\s\S]*return[\s\S]*\}/)
  assert.match(source, /aria-labelledby="video-credit-exhausted-title"/)
  assert.match(source, /href=\{getLocalizedInternalPath\(pathname, '\/pricing'\)\}/)
  assert.match(source, /href=\{getLocalizedInternalPath\(pathname, '\/earn-credits'\)\}/)
})

test('AI video generator reports GA4 generation and credit funnel events', () => {
  const payloadBuilder = extractConstFunctionSource('getVideoAnalyticsPayload')
  const generateFlow = extractConstFunctionSource('handleGenerate')

  assert.notEqual(source.indexOf("import { trackToolazeEvent } from '@/lib/analytics'"), -1, 'video tool should import the GA4 event reporter')
  assert.match(payloadBuilder, /source:\s*'ai_video_generator_tool'/)
  assert.match(payloadBuilder, /page_path:\s*pathname \|\| ''/)
  assert.match(payloadBuilder, /media_type:\s*'video'/)
  assert.match(payloadBuilder, /model_id:\s*selectedModelId/)
  assert.match(payloadBuilder, /model_name:\s*modelConfig\.name/)
  assert.match(payloadBuilder, /generation_mode:\s*activeMode/)
  assert.match(payloadBuilder, /resolution,\s*/)
  assert.match(payloadBuilder, /duration_seconds:\s*duration/)
  assert.match(payloadBuilder, /native_audio:\s*effectiveNativeAudio/)
  assert.match(payloadBuilder, /credit_cost:\s*generationCreditCost/)
  assert.match(payloadBuilder, /has_reference_images:\s*referenceMediaCount > 0/)
  assert.match(payloadBuilder, /reference_image_count:\s*referenceImageCount/)
  assert.match(source, /trackToolazeEvent\('credit_low_view', getVideoAnalyticsPayload\(\)\)/)
  assert.match(source, /trackToolazeEvent\('credit_low_buy_click', getVideoAnalyticsPayload\(\{[\s\S]*destination:\s*'\/pricing'/)
  assert.match(source, /trackToolazeEvent\('credit_low_earn_click', getVideoAnalyticsPayload\(\{[\s\S]*destination:\s*'\/earn-credits'/)
  assert.match(generateFlow, /trackToolazeEvent\('generate_click', getVideoAnalyticsPayload\(\)\)[\s\S]*await ensureSignedInForGeneration\(requestCreditCost\)/, 'generate_click should fire after local validation and before login or credit gates')
  assert.match(generateFlow, /trackToolazeEvent\('generate_start', getVideoAnalyticsPayload\(\)\)[\s\S]*fetch\('\/api\/ai-video-generator'/, 'generate_start should fire immediately before the backend generation call')
  assert.match(generateFlow, /trackToolazeEvent\('generate_success', getVideoAnalyticsPayload\(\{[\s\S]*result_delivery:[\s\S]*task_provider:[\s\S]*history_persisted:/, 'successful video generations should report clean success metadata')
  assert.match(generateFlow, /let failureStage: 'upload' \| 'create_or_poll' = 'upload'/, 'video failures should keep a sanitized stage without raw error text')
  assert.match(generateFlow, /failureStage = 'create_or_poll'[\s\S]*fetch\('\/api\/ai-video-generator'/, 'backend failures should be separated from upload failures')
  assert.match(generateFlow, /trackToolazeEvent\('generate_fail', getVideoAnalyticsPayload\(\{[\s\S]*failure_stage:\s*failureStage/, 'failed video generations should report the sanitized failure stage')
})

test('AI video generator aligns the outer desktop shell with the image generator shell', () => {
  assert.match(source, /data-generation-tool-shell/)
  assert.match(source, /data-generation-tool-shell[\s\S]*md:h-\[calc\(100dvh-6rem\)\][\s\S]*md:max-h-\[calc\(100dvh-6rem\)\][\s\S]*md:min-h-0/)
  assert.doesNotMatch(source, /md:min-h-\[640px\]/)
  assert.doesNotMatch(source, /xl:min-h-\[720px\]/)
  assert.match(source, /data-left-generation-panel[\s\S]*md:h-full[\s\S]*flex[\s\S]*flex-col/)
  assert.match(source, /data-left-settings-scroll[\s\S]*md:flex-1[\s\S]*md:min-h-0[\s\S]*md:overflow-y-auto/)
  assert.match(source, /data-generate-action-bar[\s\S]*flex-shrink-0/)
  assert.match(source, /data-generate-button/)
})

test('AI video generator keeps a title-free compact output bar fixed directly above Generate', () => {
  const scrollStart = source.indexOf('data-left-settings-scroll')
  const outputSettingsIndex = source.indexOf('data-video-output-settings')
  const generateActionIndex = source.indexOf('data-generate-action-bar')
  const outputSettingsToGenerate = source.slice(outputSettingsIndex, generateActionIndex)

  assert.notEqual(outputSettingsIndex, -1, 'output settings should expose a stable wrapper')
  assert.ok(scrollStart < outputSettingsIndex, 'output settings should follow the scrollable input area')
  assert.ok(outputSettingsIndex < generateActionIndex, 'output settings should appear before Generate')
  assert.match(source, /data-left-settings-scroll[\s\S]*<\/div>\s*<div ref=\{videoOutputSettingsRef\} data-video-output-settings/, 'output settings should sit outside the scrolling input area')
  assert.match(outputSettingsToGenerate, /flex-shrink-0/, 'output settings should not shrink inside the fixed action area')
  assert.match(source, /const \[isVideoOutputSettingsOpen, setIsVideoOutputSettingsOpen\] = useState\(false\)/, 'the compact bar should use one shared expanded state')
  assert.match(outputSettingsToGenerate, /data-video-output-settings-panel/, 'the compact bar should expand into a settings panel')
  assert.match(outputSettingsToGenerate, /data-video-output-settings-trigger/, 'all current values should share one compact trigger')
  assert.match(outputSettingsToGenerate, /data-video-output-settings-panel[\s\S]*absolute bottom-full left-0 right-0 z-30 mb-2[\s\S]*md:static/, 'mobile output settings should expand upward without pushing Generate down')
  assert.match(source, /const videoOutputSettingsRef = useRef<HTMLDivElement>\(null\)/, 'video output settings should own an outside-click boundary')
  assert.match(source, /if \(!isVideoOutputSettingsOpen\) return[\s\S]*videoOutputSettingsRef\.current\.contains\(event\.target\)[\s\S]*closeVideoOutputSettings\(\)[\s\S]*event\.key === 'Escape'/, 'video output settings should close only on outside click or Escape')
  assert.doesNotMatch(outputSettingsToGenerate, /setAspectRatio\(ratio\.value\)[\s\S]{0,120}setIsVideoOutputSettingsOpen\(false\)/, 'selecting an aspect ratio should keep the panel open')
  assert.doesNotMatch(outputSettingsToGenerate, /setResolution\(value\)[\s\S]{0,180}setIsVideoOutputSettingsOpen\(false\)/, 'selecting a resolution should keep the panel open')
  assert.match(outputSettingsToGenerate, /data-video-output-aspect-ratio-value/, 'the compact bar should display the selected aspect ratio without a title')
  assert.match(outputSettingsToGenerate, /data-video-output-resolution-value/, 'the compact bar should display the selected resolution without a title')
  assert.match(outputSettingsToGenerate, /data-video-output-duration-value/, 'the compact bar should display the selected duration without a title')
  assert.match(outputSettingsToGenerate, /onClick=\{\(\) => setIsVideoOutputSettingsOpen\(\(current\) => !current\)\}/, 'clicking any part of the single compact bar should toggle the complete settings panel')
  assert.match(outputSettingsToGenerate, /text\.aspectRatio[\s\S]*text\.resolution[\s\S]*text\.duration/, 'the expanded panel should contain all output settings together')
  assert.doesNotMatch(outputSettingsToGenerate, /setIsVideoOutputSettingsOpen\(false\)/, 'selecting an output option should keep the expanded panel open')
})

test('AI video generator shows the current credit cost inside the generate button', () => {
  assert.notEqual(source.indexOf("from '@/lib/generation-credits'"), -1, 'video tool should reuse the shared video credit calculator')
  assert.notEqual(source.indexOf('getAiVideoGeneratorModelMinimumCredits'), -1, 'video tool should reuse computed model minimum credits')
  assert.equal(source.includes('label: `${option.minCredits}+`'), false, 'model menu should not render a hand-maintained minCredits value')
  assert.notEqual(source.indexOf('const generationCreditCost = useMemo'), -1, 'video tool should derive a current credit cost from model settings')
  assert.notEqual(source.indexOf('calculateVideoGenerationCredits(selectedModelId, resolution, duration, {'), -1, 'video cost should use exact mapped pricing and fall back to model minimum credits')
  assert.notEqual(source.indexOf('nativeAudio: effectiveNativeAudio'), -1, 'video cost should include the effective Native Audio state')
  assert.notEqual(source.indexOf('data-generate-credit-cost'), -1, 'generate button should expose the visible credit cost')
  assert.notEqual(source.indexOf('aria-label={`${generationCreditCost} credits`}'), -1, 'generate button credit cost should remain accessible')
  assert.notEqual(source.indexOf('/credits-icons/diamond-3d-indigo.svg'), -1, 'generate button should use the Toolaze credits icon')
})

test('AI video generator exposes Kling Native Audio as a priced toggle', () => {
  assert.notEqual(source.indexOf('hasVideoNativeAudioPriceDifference'), -1, 'video tool should derive Native Audio choice visibility from shared pricing')
  assert.notEqual(source.indexOf('const effectiveNativeAudio = supportsNativeAudio && (nativeAudioHasPriceDifference ? nativeAudio : true)'), -1, 'same-price Native Audio should default on')
  assert.notEqual(source.indexOf('supportsNativeAudio && nativeAudioHasPriceDifference ? ('), -1, 'same-price Native Audio should hide the toggle')
  assert.notEqual(source.indexOf('data-video-native-audio-toggle'), -1, 'video tool should expose a Native Audio toggle')
  assert.notEqual(source.indexOf("formData.append('nativeAudio', String(effectiveNativeAudio))"), -1, 'video requests should send the effective Native Audio state')
  assert.notEqual(source.indexOf('modelConfig.nativeAudioResolutions?.includes(value)'), -1, 'unsupported Native Audio resolutions should disable the toggle')
  assert.notEqual(source.indexOf('text.nativeAudio'), -1, 'Native Audio label should be rendered from text slots')
})
