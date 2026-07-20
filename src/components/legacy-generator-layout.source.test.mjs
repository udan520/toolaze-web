import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const watermarkSource = readFileSync(new URL('./WatermarkRemover.tsx', import.meta.url), 'utf8')
const restorationSource = readFileSync(new URL('./PhotoRestoration.tsx', import.meta.url), 'utf8')
const l2Source = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')
const worldCupSource = readFileSync(new URL('./WorldCupAiImageGeneratorPageContent.tsx', import.meta.url), 'utf8')
const aiImageToolSource = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')

test('legacy image tools expose the new left-controls and right demo/history top layout', () => {
  for (const source of [watermarkSource, restorationSource]) {
    assert.match(source, /heroTitle\?: string/)
    assert.match(source, /heroDescription\?: string/)
    assert.match(source, /data-legacy-generator-layout/)
    assert.match(source, /data-generator-controls-panel/)
    assert.match(source, /data-generator-demo-history-panel/)
  }

  assert.doesNotMatch(watermarkSource, /if \(!preview\) \{\s*return \(/)
})

test('Tool L2 pages route Watermark through the shared generator history flow', () => {
  const watermarkBranch = l2Source.slice(
    l2Source.indexOf("topComp === 'watermark-remover'"),
    l2Source.indexOf("topComp === 'photo-restoration'"),
  )
  const heroOwnedBreadcrumbBlock = l2Source.slice(
    l2Source.indexOf('const toolHeroOwnsBreadcrumb = ['),
    l2Source.indexOf('].includes(topComp)', l2Source.indexOf('const toolHeroOwnsBreadcrumb = [')),
  )

  assert.match(watermarkBranch, /<AiImageGenerationTool/)
  assert.match(watermarkBranch, /modelId="gpt-image-2"/)
  assert.match(watermarkBranch, /defaultMode="image-to-image"/)
  assert.match(watermarkBranch, /defaultPrompt=\{WATERMARK_REMOVER_PROMPT\}/)
  assert.match(watermarkBranch, /hidePromptInput/)
  assert.match(watermarkBranch, /heroTitle=\{content\.hero\?\.h1 \? renderH1WithGradient\(content\.hero\.h1\) : <>AI Watermark Remover<\/>\}/)
  assert.doesNotMatch(watermarkBranch, /<WatermarkRemover/)
  assert.match(heroOwnedBreadcrumbBlock, /'watermark-remover'/)
})

test('Tool L2 pages route Photo Restoration through the shared generator history flow', () => {
  const restorationBranch = l2Source.slice(
    l2Source.indexOf("topComp === 'photo-restoration'"),
    l2Source.indexOf("topComp === 'ai-couple-photo-maker'"),
  )
  const heroOwnedBreadcrumbBlock = l2Source.slice(
    l2Source.indexOf('const toolHeroOwnsBreadcrumb = ['),
    l2Source.indexOf('].includes(topComp)', l2Source.indexOf('const toolHeroOwnsBreadcrumb = [')),
  )

  assert.match(restorationBranch, /<AiImageGenerationTool/)
  assert.match(restorationBranch, /modelId="gpt-image-2"/)
  assert.match(restorationBranch, /defaultMode="image-to-image"/)
  assert.match(restorationBranch, /defaultPrompt=\{PHOTO_RESTORATION_PROMPT\}/)
  assert.match(restorationBranch, /defaultAspectRatio="auto"/)
  assert.match(restorationBranch, /maxUploadImages=\{1\}/)
  assert.match(restorationBranch, /hidePromptInput/)
  assert.match(restorationBranch, /heroTitle=\{content\.hero\?\.h1 \? renderH1WithGradient\(content\.hero\.h1\) : <>Photo Restoration<\/>\}/)
  assert.doesNotMatch(restorationBranch, /<PhotoRestoration/)
  assert.match(heroOwnedBreadcrumbBlock, /'photo-restoration'/)
})

test('shared generator keeps Couple results in the same desktop history feed as AI Baby', () => {
  assert.match(aiImageToolSource, /hasDesktopResultTabs \? renderDesktopResultTabs\(\) : null/)
  assert.match(aiImageToolSource, /hasDesktopResultTabs && rightMode === 'history' \? \(\s*renderDesktopResultFeed\(\)\s*\) : \(/)
  assert.doesNotMatch(aiImageToolSource, /hasDesktopResultTabs && !isCouplePhotoMakerMode \? renderDesktopResultTabs\(\) : null/)
  assert.doesNotMatch(aiImageToolSource, /isCouplePhotoMakerMode \? \(\s*<div[\s\S]*currentResult \? \(/)
})

test('shared generator loads account history for Couple just like AI Baby', () => {
  assert.match(aiImageToolSource, /fetch\('\/api\/history\?limit=20'/)
  assert.doesNotMatch(
    aiImageToolSource,
    /useEffect\(\(\) => \{\s*if \(isCouplePhotoMakerMode\) return[\s\S]*fetch\('\/api\/history\?limit=20'/,
  )
})

test('shared generator can hide fixed internal prompts for one-click tools', () => {
  assert.match(aiImageToolSource, /hidePromptInput\?: boolean/)
  assert.match(aiImageToolSource, /\{!hidePromptInput && !isCouplePhotoMakerMode && \(/)
  assert.match(aiImageToolSource, /setPrompt\(hidePromptInput \? defaultPrompt : ''\)/)
})

test('shared generator places the mobile hero breadcrumb below the demo panel', () => {
  const mobileTopPanel = aiImageToolSource.slice(
    aiImageToolSource.indexOf('const renderMobileTopPanel = () => ('),
    aiImageToolSource.indexOf('const renderMobileGeneratingCard = () => ('),
  )

  assert.match(mobileTopPanel, /data-mobile-demo-panel/)
  assert.match(mobileTopPanel, /data-mobile-result-hero/)
  assert.ok(
    mobileTopPanel.indexOf('data-mobile-demo-panel') < mobileTopPanel.indexOf('data-mobile-result-hero'),
    'mobile demo panel should render before the mobile hero breadcrumb block',
  )
})

test('World Cup generator uses AiImageGenerationTool hero copy instead of a separate centered heading', () => {
  assert.match(worldCupSource, /heroTitle=\{\s*<>\s*<span className="text-\[#4F46E5\]">\{copy\.hero\.highlight\}<\/span> \{copy\.hero\.suffix\}\s*<\/>\s*\}/)
  assert.match(worldCupSource, /heroDescription=\{copy\.hero\.description\}/)
  assert.doesNotMatch(worldCupSource, /mx-auto mb-4 max-w-4xl shrink-0 text-center/)
})
