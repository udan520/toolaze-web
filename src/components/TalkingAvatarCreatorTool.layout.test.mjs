import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./TalkingAvatarCreatorTool.tsx', import.meta.url), 'utf8')
const featuresSource = readFileSync(new URL('./blocks/Features.tsx', import.meta.url), 'utf8')
const toolCardSource = readFileSync(new URL('./ToolCard.tsx', import.meta.url), 'utf8')
const toolL2PageSource = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')

test('Talking avatar creator uses the standard left controls and right demo layout', () => {
  const layoutIndex = source.indexOf('data-talking-avatar-layout')
  const controlsIndex = source.indexOf('data-talking-avatar-controls-panel')
  const demoIndex = source.indexOf('data-talking-avatar-demo-panel')
  const heroIndex = source.indexOf('data-talking-avatar-hero-title')
  const previewIndex = source.indexOf('data-talking-avatar-preview-canvas')
  const previewRenderIndex = source.indexOf('renderSamplePreview()', heroIndex)

  assert.notEqual(layoutIndex, -1, 'split tool layout should exist')
  assert.notEqual(controlsIndex, -1, 'left controls panel should exist')
  assert.notEqual(demoIndex, -1, 'right demo panel should exist')
  assert.notEqual(heroIndex, -1, 'hero title should be inside the right panel')
  assert.notEqual(previewIndex, -1, 'demo preview canvas should exist')
  assert.notEqual(previewRenderIndex, -1, 'demo preview should render from the right panel JSX')
  assert.match(source, /demoVideo\?: TalkingAvatarDemoVideo/, 'component should accept a real demo video asset')
  assert.match(source, /data-talking-avatar-demo-video/, 'demo preview should render the supplied video asset')
  assert.match(source, /poster=\{demoVideo\.poster\}/, 'demo video should use the supplied poster')
  const demoVideoBlock = source.slice(
    source.indexOf('data-talking-avatar-demo-video'),
    source.indexOf('/>', source.indexOf('data-talking-avatar-demo-video')),
  )
  assert.match(demoVideoBlock, /controls[\s\S]*autoPlay[\s\S]*loop[\s\S]*muted[\s\S]*playsInline/, 'demo video should match ASMR by autoplaying muted while exposing controls for sound')
  assert.ok(layoutIndex < controlsIndex, 'controls should be inside the split layout')
  assert.ok(layoutIndex < demoIndex, 'demo should be inside the split layout')
  assert.ok(controlsIndex < demoIndex, 'controls should render before the demo panel')
  assert.ok(demoIndex < heroIndex, 'hero title should render inside the right demo panel')
  assert.ok(heroIndex < previewRenderIndex, 'hero copy should sit above the demo preview')
  assert.match(source, /md:w-\[380px\][\s\S]*xl:w-\[400px\][\s\S]*2xl:w-\[420px\]/, 'left panel should match the shared fixed generator width')
  assert.doesNotMatch(source, /mt-8 max-w-4xl[\s\S]*data-talking-avatar-layout/, 'hero copy should not sit in a separate full-width block above the tool')
})

test('Talking avatar creator keeps localized prompt copy in the default textarea value', () => {
  assert.match(source, /useState\(\(\) => text\.promptPlaceholder\)/)
  assert.doesNotMatch(source, /useState\(DEFAULT_COPY\.promptPlaceholder\)/)
})

test('Talking avatar creator accepts shared prompt example clicks', () => {
  assert.match(source, /toolaze:use-prompt/, 'component should listen for shared prompt example events')
  assert.match(source, /setPrompt\(promptText\)/, 'shared prompt examples should fill the prompt textarea')
  assert.match(source, /window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\)/, 'using a prompt should return the user to the generator')
})

test('Talking avatar creator follows the shared video generation result flow', () => {
  assert.match(source, /type RightPanelMode = 'sample' \| 'history'/)
  assert.match(source, /currentRequest.*TalkingAvatarGenerationRequest/s)
  assert.match(source, /history.*TalkingAvatarHistoryItem/s)
  assert.match(source, /data-desktop-result-tabs/)
  assert.match(source, /data-desktop-result-tab="sample"[\s\S]*>\s*\{text\.demoLabel\}/)
  assert.match(source, /data-desktop-result-tab="history"[\s\S]*>\s*\{text\.historyLabel\}/)
  assert.match(source, /data-talking-avatar-result-feed/)
  assert.match(source, /data-talking-avatar-result-item/)
  assert.match(source, /data-talking-avatar-generating-panel/)
  assert.match(source, /data-talking-avatar-result-actions/)
  assert.match(source, /setRightMode\('history'\)[\s\S]*const \[imageUrl, audioUrl\] = await Promise\.all/, 'generate should switch to history before upload and task creation')
  assert.doesNotMatch(source, /videoUrl \? \([\s\S]*data-talking-avatar-result-panel/, 'result should not only replace the static demo canvas')
})

test('Talking avatar creator uses shared auth, credits, and account history mechanics', () => {
  assert.match(source, /ensureSignedInForTalkingAvatarGeneration/)
  assert.match(source, /fetch\('\/api\/auth\/me'/)
  assert.match(source, /toolaze:open-auth-modal/)
  assert.match(source, /creditExhaustedModalOpen/)
  assert.match(source, /isCreditExhaustedGenerationError/)
  assert.match(source, /dispatchCreditsUpdated/)
  assert.match(source, /fetch\('\/api\/history\?limit=20'/)
  assert.match(source, /credentials: 'include'/)
})

test('Talking avatar creator inline history only renders Talking Avatar records', () => {
  assert.match(source, /isPersistedTalkingAvatarHistoryItem/, 'component should identify records owned by the Talking Avatar tool')
  assert.match(source, /toolSlug[^\n]+talking-avatar-creator|talking-avatar-creator[^\n]+toolSlug/s, 'history filtering should check the stored tool slug')
  assert.match(source, /getSourcePathRoot\(item\.sourcePath\) === TALKING_AVATAR_TOOL_SLUG/, 'history filtering should also handle localized source paths')
  assert.match(source, /filter\(isPersistedTalkingAvatarHistoryItem\)[\s\S]*\.map\(mapPersistedTalkingAvatarHistoryItem\)/, 'account history should be filtered before mapping into the inline feed')
  assert.match(source, /modelName:\s*'AI Talking Avatar'/, 'inline request history should use the feature label as the primary title')
  assert.doesNotMatch(source, /modelName:\s*'Infinitalk'/, 'inline request history should not show the backend model as the primary title')
})

test('Talking avatar creator does not send credentials to the cross-origin upload endpoint', () => {
  const uploadFileBlock = source.slice(
    source.indexOf('const uploadFile = async'),
    source.indexOf('const pollStatus = async'),
  )

  assert.match(uploadFileBlock, /fetch\(getImageUploadUrl\(\), \{[\s\S]*method: 'POST'[\s\S]*body: formData[\s\S]*\}/)
  assert.doesNotMatch(uploadFileBlock, /credentials: 'include'/)
})

test('Talking avatar creator does not show model or mode selector copy above inputs', () => {
  const controlsBlock = source.slice(
    source.indexOf('data-talking-avatar-controls-panel'),
    source.indexOf('<label className="block cursor-pointer', source.indexOf('data-talking-avatar-controls-panel')),
  )

  assert.doesNotMatch(controlsBlock, /grid grid-cols-2/)
  assert.doesNotMatch(controlsBlock, />Image \+ Audio</)
  assert.doesNotMatch(controlsBlock, />Infinitalk</)
  assert.doesNotMatch(controlsBlock, /data-talking-avatar-model-note/)
  assert.doesNotMatch(controlsBlock, />Mode</)
})

test('Talking avatar creator does not render the extra demo helper copy under the preview', () => {
  assert.doesNotMatch(source, /<strong className="text-slate-950">\{text\.sampleTitle\}<\/strong> \{text\.sampleText\}/)
})

test('Talking avatar creator does not render demo status cards under the preview', () => {
  assert.doesNotMatch(source, />\s*Portrait\s*<\/div>[\s\S]*\{image\?\.file\.name \|\| 'Not uploaded'\}/)
  assert.doesNotMatch(source, />\s*Audio\s*<\/div>[\s\S]*\{audio\?\.file\.name \|\| 'Not uploaded'\}/)
  assert.doesNotMatch(source, />\s*Output\s*<\/div>[\s\S]*\{resolution\}/)
})

test('shared feature cards render fallback icons when page data omits icons', () => {
  assert.match(featuresSource, /fallbackFeatureIconTypes/, 'Features should define fallback icon types')
  assert.match(featuresSource, /fallbackFeatureIconTypes\[idx % fallbackFeatureIconTypes\.length\]/, 'feature cards should pick a fallback icon by card index')
  assert.match(featuresSource, /featureIconType \? \([\s\S]*<LineIcon type=\{featureIconType\}/, 'fallback icon type should render a visible line icon')
})

test('related tool cards render configured demo media instead of icon-only cards', () => {
  assert.match(toolCardSource, /interface ToolCardMedia/, 'ToolCard should accept structured demo media')
  assert.match(toolCardSource, /data-tool-card-media/, 'ToolCard should render a media preview container')
  assert.match(toolCardSource, /media\.type === 'video'[\s\S]*<video/, 'video media should render as a video preview')
  assert.match(toolCardSource, /autoPlay[\s\S]*loop[\s\S]*muted[\s\S]*playsInline/, 'tool-card videos should autoplay safely')
  assert.match(toolCardSource, /media\.type === 'image'[\s\S]*<img|<img[\s\S]*alt=\{media\.alt \|\| title\}/, 'image media should render as an image preview')
  assert.match(toolL2PageSource, /media=\{recTool\.media\}/, 'L2 related tools should pass configured media into ToolCard')
})

test('Talking avatar creator shows reference audio as a square preview card with fullscreen playback', () => {
  assert.match(source, /audioPreviewUrl/, 'history items should preserve the reference audio URL')
  assert.match(source, /previewAudio.*setPreviewAudio/s, 'component should track fullscreen audio preview state')
  assert.match(source, /data-talking-avatar-audio-reference-card/, 'audio reference should render as a dedicated preview card')
  assert.match(source, /data-talking-avatar-audio-preview-modal/, 'audio preview should open in a fullscreen modal')
  assert.match(source, /<audio[\s\S]*controls[\s\S]*src=\{previewAudio\.url\}/, 'fullscreen preview should use a native audio player')

  const audioCardBlock = source.slice(
    source.indexOf('data-talking-avatar-audio-reference-card'),
    source.indexOf('</button>', source.indexOf('data-talking-avatar-audio-reference-card')),
  )

  assert.match(audioCardBlock, /h-14[\s\S]*w-14|w-14[\s\S]*h-14/, 'audio card should match the square thumbnail size')
  assert.match(audioCardBlock, /onClick=\{\(\) => setPreviewAudio/, 'audio card should open the fullscreen audio preview')
})

test('Talking avatar creator opens history reference images in a fullscreen preview', () => {
  assert.match(source, /previewImage.*setPreviewImage/s, 'component should track fullscreen reference image preview state')
  assert.match(source, /data-talking-avatar-image-reference-card/, 'history reference image should render as a clickable preview card')
  assert.match(source, /data-talking-avatar-image-preview-modal/, 'reference image preview should open in a fullscreen modal')
  assert.match(source, /onClick=\{\(\) => setPreviewImage\(item\.inputPreview\)\}/, 'history reference image click should open the original image')
  assert.match(source, /src=\{previewImage\}/, 'fullscreen preview should render the original reference image URL')
})

test('Talking avatar creator matches shared history download and delete actions', () => {
  assert.match(source, /import DeleteIcon from '@\/components\/icons\/DeleteIcon'/, 'history delete should use the shared trash icon')

  const actionsBlock = source.slice(
    source.indexOf('data-talking-avatar-result-actions'),
    source.indexOf('</div>', source.indexOf('data-talking-avatar-result-actions')),
  )

  assert.match(actionsBlock, /<a[\s\S]*download[\s\S]*title=\{text\.download\}[\s\S]*<svg[\s\S]*<span>\{text\.download\}<\/span>/, 'download action should match the shared video history button with icon and label')
  assert.match(actionsBlock, /<button[\s\S]*onClick=\{\(\) => void handleDeleteHistoryItem\(item\)\}[\s\S]*title=\{text\.delete\}[\s\S]*<DeleteIcon size=\{20\} \/>/, 'delete action should use the shared trash icon')
  assert.doesNotMatch(actionsBlock, /<span aria-hidden="true">×<\/span>/, 'delete action should not use a text close glyph')
})

test('Talking avatar creator restores prompt, reference image, and reference audio for Recreate', () => {
  assert.match(source, /const PENDING_REPROMPT_STORAGE_KEY = 'toolaze:pending-reprompt'/, 'component should read the shared pending Recreate payload')
  assert.match(source, /const \[remoteImageUrl, setRemoteImageUrl\] = useState\(''\)/, 'remote reference images should be first-class form state')
  assert.match(source, /const \[remoteAudioUrl, setRemoteAudioUrl\] = useState\(''\)/, 'remote reference audio should be first-class form state')
  assert.match(source, /window\.sessionStorage\.getItem\(PENDING_REPROMPT_STORAGE_KEY\)/, 'landing page should restore Recreate payloads after navigation')
  assert.match(source, /setRemoteImageUrl\(imageUrl\)/, 'pending Recreate payload should restore the reference image URL')
  assert.match(source, /setRemoteAudioUrl\(audioUrl\)/, 'pending Recreate payload should restore the reference audio URL')
  assert.match(source, /const imageUrl = item\.inputPreview \|\| item\.inputUrls\[0\] \|\| ''[\s\S]*const audioUrl = item\.audioPreviewUrl \|\| item\.inputUrls\[1\] \|\| ''[\s\S]*setPrompt\(item\.prompt \|\| text\.promptPlaceholder\)[\s\S]*setRemoteImageUrl\(imageUrl\)[\s\S]*setRemoteAudioUrl\(audioUrl\)/, 'inline history Recreate should restore every generation input')
  assert.match(source, /const hasGenerationImage = Boolean\(image\?\.file \|\| remoteImageUrl\)/, 'restored remote image should count as a generation input')
  assert.match(source, /const hasGenerationAudio = Boolean\(audio\?\.file \|\| remoteAudioUrl\)/, 'restored remote audio should count as a generation input')
  assert.match(source, /const canGenerate = Boolean\(hasGenerationImage && hasGenerationAudio && prompt\.trim\(\) && !isGenerating\)/, 'restored remote media should enable generation')
  assert.match(source, /requestRemoteImageUrl \? Promise\.resolve\(requestRemoteImageUrl\) : requestImageFile \? uploadFile\(requestImageFile\)/, 'generation should reuse restored reference image URLs without reuploading')
  assert.match(source, /requestRemoteAudioUrl \? Promise\.resolve\(requestRemoteAudioUrl\) : requestAudioFile \? uploadFile\(requestAudioFile\)/, 'generation should reuse restored reference audio URLs without reuploading')
  assert.doesNotMatch(source, /Upload a portrait and audio file again to recreate/, 'Recreate should not ask users to reupload existing history inputs')
})

test('Talking avatar creator hides generate credit cost until audio is available', () => {
  assert.match(source, /const showGenerateCredits = Boolean\(hasGenerationAudio && !isGenerating\)/, 'credit display should depend on an uploaded or restored audio file')

  const actionBarBlock = source.slice(
    source.indexOf('data-talking-avatar-action-bar'),
    source.indexOf('</button>', source.indexOf('data-talking-avatar-action-bar')),
  )

  assert.match(actionBarBlock, /showGenerateCredits \? \([\s\S]*getRequiredCredits\(resolution\)[\s\S]*diamond-3d-indigo\.svg/, 'generate button should only render credit cost after audio upload')
  assert.doesNotMatch(actionBarBlock, /!isGenerating \? \([\s\S]*getRequiredCredits\(resolution\)/, 'generate button should not show credit cost before audio exists')
})

test('Talking avatar creator lets users choose a max 15-second segment before accepting long audio', () => {
  assert.match(source, /MAX_REFERENCE_AUDIO_SECONDS\s*=\s*15/, 'audio duration limit should be centralized at 15 seconds')
  assert.match(source, /AUDIO_DURATION_SAFETY_BUFFER_SECONDS\s*=\s*0\.5/, 'audio trimming should keep a safety buffer below the upstream 15-second limit')
  assert.match(source, /MAX_REFERENCE_AUDIO_EXPORT_SECONDS\s*=\s*MAX_REFERENCE_AUDIO_SECONDS - AUDIO_DURATION_SAFETY_BUFFER_SECONDS/, 'accepted audio should use the safe export limit')
  assert.match(source, /audioTrimTitle/, 'copy should include the trim dialog title')
  assert.match(source, /audioTooLongMessage/, 'copy should include the decline warning message')
  assert.match(source, /getAudioDurationInSeconds\(file\)/, 'audio upload should inspect selected audio duration')
  assert.match(source, /pendingAudioTrim.*setPendingAudioTrim/s, 'long audio should be held in a pending trim state before it enters the audio field')
  assert.match(source, /data-talking-avatar-audio-trim-modal/, 'long audio should open a segment selection modal')
  assert.match(source, /audioTrimStartSeconds/, 'the user should be able to choose which part of the audio to keep')
  assert.match(source, /trimAudioToSegment\(pendingAudioTrim\.file, audioTrimStartSeconds, audioTrimEndSeconds\)/, 'confirmed long audio should be trimmed from the selected segment before upload')
  assert.match(source, /setAudio\(\{ file: nextAudioFile, preview: URL\.createObjectURL\(nextAudioFile\) \}\)/, 'audio box should receive the accepted or trimmed file')

  const selectAudioBlock = source.slice(
    source.indexOf('const selectAudio = async'),
    source.indexOf('const uploadFile = async'),
  )

  assert.match(selectAudioBlock, /durationInSeconds > MAX_REFERENCE_AUDIO_EXPORT_SECONDS[\s\S]*setPendingAudioTrim\(\{ file, preview, duration: durationInSeconds \}\)[\s\S]*setAudioTrimStartSeconds\(0\)[\s\S]*return/, 'audio near the upstream limit should wait for user-selected trimming before entering the audio field')
  assert.doesNotMatch(selectAudioBlock, /window\.confirm/, 'long audio should use the custom segment chooser instead of a browser confirm dialog')
})

test('Talking avatar audio trimming never produces a segment longer than 15 seconds', () => {
  const trimBlock = source.slice(
    source.indexOf('async function trimAudioToSegment'),
    source.indexOf('async function ensureSignedInForTalkingAvatarGeneration'),
  )

  assert.match(trimBlock, /maxFrameCount\s*=\s*Math\.floor\(MAX_REFERENCE_AUDIO_EXPORT_SECONDS \* sourceBuffer\.sampleRate\)/, 'trimmed audio should cap frames below the upstream 15-second limit')
  assert.match(trimBlock, /frameCount\s*=\s*Math\.min\([\s\S]*maxFrameCount[\s\S]*\)/, 'trimmed frame count should respect the safe export cap')
  assert.doesNotMatch(trimBlock, /Math\.ceil\(safeEndSeconds \* sourceBuffer\.sampleRate\)/, 'rounding the end frame up can create audio slightly over 15 seconds')
})
