import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const source = readFileSync(join(process.cwd(), 'src', 'components', 'AiVideoGeneratorTool.tsx'), 'utf8')
const uploaderSource = readFileSync(join(process.cwd(), 'src', 'components', 'ReferenceImageUploader.tsx'), 'utf8')
const motionReferenceVideoUploaderPath = join(process.cwd(), 'src', 'components', 'MotionReferenceVideoUploader.tsx')

function readMotionReferenceVideoUploaderSource() {
  assert.equal(existsSync(motionReferenceVideoUploaderPath), true, 'shared motion reference video uploader component should exist')
  return readFileSync(motionReferenceVideoUploaderPath, 'utf8')
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
  const heroTitleIndex = source.indexOf('data-video-hero-title')
  const demoCanvasIndex = source.indexOf('data-video-preview-canvas')

  assert.notEqual(splitPanelIndex, -1, 'tool split panel should exist')
  assert.notEqual(leftPanelIndex, -1, 'left controls should use the same fixed image-tool panel width')
  assert.notEqual(rightPanelIndex, -1, 'right video demo panel should exist')
  assert.notEqual(heroTitleIndex, -1, 'hero title should render in the demo panel')
  assert.notEqual(demoCanvasIndex, -1, 'clean demo canvas should exist')
  assert.ok(splitPanelIndex < leftPanelIndex, 'left controls should be inside the split tool layout')
  assert.ok(splitPanelIndex < rightPanelIndex, 'demo panel should be inside the split tool layout')
  assert.ok(rightPanelIndex < heroTitleIndex, 'hero title should be inside the right demo panel')
  assert.ok(heroTitleIndex < demoCanvasIndex, 'hero title should sit above the demo canvas')
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
  assert.match(source, /useState<string\[\]>\(\(\) => \(\s*Array\.isArray\(initialMotionVideoUrls\)/, 'remote motion video URL state should seed from initialMotionVideoUrls')
  assert.match(source, /Math\.ceil\(Number\(initialMotionVideoDurationSeconds\)\)/, 'reference-video pages should seed the generated duration from the preloaded video')
  assert.match(source, /useState<'image' \| 'video'>\(initialCharacterOrientation \|\| 'video'\)/, 'character orientation should seed from page data')
  assert.match(source, /useState\(initialPrompt \|\| ''\)/, 'prompt should seed from page data')
})

test('AI video generator keeps desktop hero H1 compact on laptop viewports', () => {
  assert.match(source, /data-video-hero-title[\s\S]*text-\[30px\][\s\S]*xl:text-\[32px\]/)
  assert.doesNotMatch(source, /data-video-hero-title[\s\S]{0,220}md:text-\[36px\]\s+xl:text-\[38px\]/)
})

test('AI video generator exposes compact settings with duration as a scrollable dropdown', () => {
  assert.equal(source.includes('value={aspectRatio}'), false, 'aspect ratio should not render as a select value')
  assert.equal(source.includes('value={resolution}'), false, 'resolution should not render as a select value')
  assert.match(source, /modelConfig\.aspectRatios\.map\(\(ratio\) =>[\s\S]*aria-pressed=\{isSelected\}/, 'aspect ratio options should be visible pressed buttons')
  assert.match(source, /modelConfig\.resolutions\.map\(\(value\) =>[\s\S]*aria-pressed=\{isSelected\}/, 'resolution options should be visible pressed buttons')
  assert.notEqual(source.indexOf('data-video-duration-selector'), -1, 'duration selector should exist')
  assert.notEqual(source.indexOf('data-video-duration-button'), -1, 'duration should use a compact dropdown trigger')
  assert.notEqual(source.indexOf('data-video-duration-menu'), -1, 'duration should expose a dropdown menu')
  assert.match(source, /data-video-duration-menu[\s\S]*max-h-44[\s\S]*overflow-y-auto/, 'duration menu should cap height and scroll long option lists')
  assert.notEqual(source.indexOf("import { createPortal } from 'react-dom'"), -1, 'duration menu should render through a body portal')
  assert.notEqual(source.indexOf('const durationButtonRef = useRef<HTMLButtonElement>(null)'), -1, 'duration trigger should own the menu anchor rect')
  assert.notEqual(source.indexOf('const durationMenuRef = useRef<HTMLDivElement>(null)'), -1, 'duration menu should be included in outside-click detection')
  assert.notEqual(source.indexOf('const [durationMenuRect, setDurationMenuRect]'), -1, 'duration menu should track fixed viewport coordinates')
  assert.match(source, /data-video-duration-menu[\s\S]*className="fixed z-\[9999\][\s\S]*max-h-44[\s\S]*overflow-y-auto/, 'duration menu should escape the left scroll panel and action bar stacking context')
  assert.match(source, /data-video-duration-menu[\s\S]*transform: 'translateY\(calc\(-100% - 0\.5rem\)\)'/, 'duration menu should always open upward from the trigger')
  assert.notEqual(source.indexOf('durationMenuRef.current?.contains(event.target as Node)'), -1, 'portal menu clicks should not be treated as outside clicks')
  assert.notEqual(source.indexOf("window.addEventListener('resize', updateDurationMenuRect)"), -1, 'duration menu should reposition on viewport changes')
  assert.notEqual(source.indexOf("window.addEventListener('scroll', updateDurationMenuRect, true)"), -1, 'duration menu should stay anchored while nested panels scroll')
  assert.equal(source.includes('role="group" aria-label={text.duration} className="grid grid-cols-3 gap-2"'), false, 'duration should not render all options as an expanded button grid')
  assert.notEqual(source.indexOf('const shouldAllowLeftOverlay = isModelMenuOpen'), -1, 'duration should no longer alter the left scroll clipping layer')
  assert.equal(source.includes('const shouldAllowLeftOverlay = isModelMenuOpen || isDurationMenuOpen'), false, 'duration portal should not depend on the left scroll container overflow')
  assert.notEqual(source.indexOf("shouldAllowLeftOverlay ? 'md:overflow-visible' : 'md:overflow-y-auto'"), -1, 'left panel should return to vertical scrolling when floating menus close')
  assert.equal(source.includes("className={`relative ${isDurationMenuOpen ? 'z-[80]' : ''}`"), false, 'duration portal should not rely on local stacking context')
})

test('AI video generator keeps prompt sizing aligned with the image tool', () => {
  assert.notEqual(source.indexOf('rows={4}'), -1, 'prompt textarea should use four visible rows like the image tool')
  assert.notEqual(source.indexOf('h-[7.5rem] w-full resize-none overflow-y-auto rounded-xl'), -1, 'prompt textarea should match image-tool height and scrolling style')
  assert.equal(source.includes('rows={6}'), false, 'prompt textarea should not use the previous taller six-row sizing')
  assert.equal(source.includes('rounded-2xl border border-slate-200 bg-slate-50/70'), false, 'prompt textarea should not keep the older video-only styling')
})

test('Kling character orientation sits directly below the prompt field', () => {
  const promptFieldIndex = source.indexOf('{promptLabel}</label>')
  const orientationIndex = source.indexOf('<div data-character-orientation>')
  const settingsIndex = source.indexOf('<div className="grid gap-3 grid-cols-1">', promptFieldIndex)

  assert.notEqual(promptFieldIndex, -1, 'prompt field should exist')
  assert.notEqual(orientationIndex, -1, 'character orientation should exist')
  assert.notEqual(settingsIndex, -1, 'video settings should exist after the prompt')
  assert.ok(promptFieldIndex < orientationIndex, 'character orientation should render below the prompt field')
  assert.ok(orientationIndex < settingsIndex, 'character orientation should stay immediately before the remaining video settings')
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
  assert.match(source, /formData\.append\('videoUrls', JSON\.stringify\(motionVideoUrls\)\)/, 'generation request should submit KIE motion-control videoUrls')
  assert.match(source, /<MotionReferenceVideoUploader/, 'motion-control models should render the shared video upload control')
  assert.notEqual(motionUploaderSource.indexOf('data-motion-reference-video-uploader'), -1, 'motion-control uploader component should render a dedicated wrapper')
  assert.notEqual(source.indexOf('ACCEPTED_MOTION_REFERENCE_VIDEO_TYPES'), -1, 'motion reference upload should centralize its accepted formats')
  assert.notEqual(source.indexOf('video/mp4,video/quicktime,video/x-matroska,.mp4,.mov,.mkv'), -1, 'motion reference upload should accept MP4, QuickTime, and Matroska only')
  assert.notEqual(source.indexOf('MP4, QuickTime, or Matroska. Max {size}MB, {min}-{max} seconds.'), -1, 'motion reference helper should show KIE format, size, and dynamic length requirements')
  assert.match(source, /formatText\(text\.motionReferenceVideoHelper, \{[\s\S]*size: modelConfig\.maxVideoFileSizeMb \|\| 50,[\s\S]*max: referenceVideoMaxDurationSeconds/, 'motion reference helper should render the configured 100MB limit and orientation-specific duration')
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

test('Kling motion control prompts are optional and duration is not a fixed selector', () => {
  assert.notEqual(source.indexOf('const promptRequired = modelConfig.promptRequired !== false'), -1, 'prompt requiredness should come from model config')
  assert.match(source, /const canGenerate = \(!promptRequired \|\| prompt\.trim\(\)\.length > 0\)/, 'optional-prompt models should generate without prompt text')
  assert.match(source, /promptRequired \? text\.prompt : `\$\{text\.prompt\} \(\$\{text\.optional\}\)`/, 'optional-prompt models should label the prompt clearly')
  assert.notEqual(source.indexOf("optional: 'Optional'"), -1, 'fallback copy should include Optional for prompt labels')
  assert.notEqual(source.indexOf("modelConfig.durationMode === 'reference-video'"), -1, 'reference-video models should branch away from manual duration selection')
  assert.notEqual(source.indexOf('data-video-reference-duration-note'), -1, 'reference-video models should show a duration note instead of fixed options')
  assert.notEqual(source.indexOf("motionReferenceVideoDurationNote: 'Duration follows the uploaded reference video ({min}-{max} seconds).'"), -1, 'reference-video duration note should explain the dynamic KIE duration rule')
  assert.match(source, /const renderDurationMenu = \(\) => \{[\s\S]*if \(modelConfig\.durationMode === 'reference-video'\) return null/, 'reference-video models should not render the manual duration menu')
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
  const durationIndex = source.indexOf('{text.duration}')

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
  assert.match(historyApply, /setActiveMode\(item\.inputUrls\.length > 0 \? 'image-to-video' : item\.mode as AiVideoGeneratorModeId\)/)
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
})

test('AI video generator uses the shared generation history API for completed videos', () => {
  assert.match(source, /fetch\('\/api\/history\?limit=20'/, 'video tool should load the shared account history feed')
  assert.match(source, /mediaType:\s*'video'/, 'video tool should persist generated videos with mediaType video')
  assert.match(source, /fetch\('\/api\/history',\s*\{[\s\S]*method:\s*'POST'/, 'video tool should save completed generations to shared history')
  assert.match(source, /getHistoryToolMetadata\(pathname, modelConfig\.name, getVideoHistoryModelSlug\(selectedModelId\)\)/, 'video history should use the public model route metadata')
  assert.match(source, /mapPersistedVideoHistoryItem/, 'video tool should map persisted history records back into the inline feed')
  assert.doesNotMatch(source, /setHistory\(\(prev\) => \[completedRequest, \.\.\.prev\]\.slice\(0, 5\)\)/, 'video tool should not keep the old local-only five item history')
})

test('AI video generator right side uses the image-style sample and history feed flow', () => {
  assert.match(source, /type RightPanelMode = 'sample' \| 'history'/)
  assert.match(source, /const \[rightMode, setRightMode\] = useState<RightPanelMode>\('sample'\)/)
  assert.match(source, /data-desktop-result-tabs/)
  assert.match(source, /data-desktop-result-tab="sample"[\s\S]*>\s*\{text\.demo\}/)
  assert.match(source, /data-desktop-result-tab="history"[\s\S]*>\s*\{text\.history\}/)
  assert.match(source, /data-video-result-feed/)
  assert.match(source, /data-video-result-item/)
  assert.match(source, /rightMode === 'history' \? \(\s*renderDesktopVideoResultFeed\(\)\s*\) : \(/)
  assert.equal(source.includes('<aside className="mt-4 rounded-2xl border border-[#E0E7FF] bg-white p-4'), false, 'video history should not render as a separate bottom panel')
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

test('AI video generator shows the current credit cost inside the generate button', () => {
  assert.notEqual(source.indexOf("import { calculateVideoGenerationCredits } from '@/lib/generation-credits'"), -1, 'video tool should reuse the shared video credit calculator')
  assert.notEqual(source.indexOf('getAiVideoGeneratorModelMinimumCredits'), -1, 'video tool should reuse computed model minimum credits')
  assert.equal(source.includes('label: `${option.minCredits}+`'), false, 'model menu should not render a hand-maintained minCredits value')
  assert.notEqual(source.indexOf('const generationCreditCost = useMemo'), -1, 'video tool should derive a current credit cost from model settings')
  assert.notEqual(source.indexOf('calculateVideoGenerationCredits(selectedModelId, resolution, duration, {'), -1, 'video cost should use exact mapped pricing and fall back to model minimum credits')
  assert.notEqual(source.indexOf('nativeAudio: supportsNativeAudio && nativeAudio'), -1, 'video cost should include Native Audio when enabled')
  assert.notEqual(source.indexOf('data-generate-credit-cost'), -1, 'generate button should expose the visible credit cost')
  assert.notEqual(source.indexOf('aria-label={`${generationCreditCost} credits`}'), -1, 'generate button credit cost should remain accessible')
  assert.notEqual(source.indexOf('/credits-icons/diamond-3d-indigo.svg'), -1, 'generate button should use the Toolaze credits icon')
})

test('AI video generator exposes Kling Native Audio as a priced toggle', () => {
  assert.notEqual(source.indexOf('data-video-native-audio-toggle'), -1, 'video tool should expose a Native Audio toggle')
  assert.notEqual(source.indexOf("formData.append('nativeAudio', String(nativeAudio))"), -1, 'video requests should send Native Audio state')
  assert.notEqual(source.indexOf('modelConfig.nativeAudioResolutions?.includes(value)'), -1, 'unsupported Native Audio resolutions should disable the toggle')
  assert.notEqual(source.indexOf('text.nativeAudio'), -1, 'Native Audio label should be rendered from text slots')
})
