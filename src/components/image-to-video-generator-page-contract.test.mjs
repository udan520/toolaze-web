import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const pagePath = join(root, 'src', 'data', 'en', 'image-to-video-generator.json')
const factoryPath = join(root, '_codex', 'seo-pipeline', 'tasks', '2026-07-23-image-to-video-generator', 'content', 'en.json')
const promptUseDetailPath = join(root, 'src', 'lib', 'prompt-example-use-detail.ts')
const promptExamplesPath = join(root, 'src', 'components', 'blocks', 'PromptExamples.tsx')
const videoToolPath = join(root, 'src', 'components', 'AiVideoGeneratorTool.tsx')
const l2Path = join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx')
const localizedLocales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

test('image-to-video page keeps four video prompt cards and six use cases', () => {
  const page = readJson(pagePath)
  const factory = readJson(factoryPath)

  assert.equal(page.promptExamples.items.length, 4)
  assert.equal(factory.promptExamples.items.length, 4)
  assert.equal(page.scenes.length, 6)
  assert.equal(factory.scenes.length, 6)
  assert.deepEqual(factory.promptExamples.items, page.promptExamples.items)
  assert.deepEqual(factory.scenes, page.scenes)
})

test('image-to-video page exposes related AI video tools in English', () => {
  const page = readJson(pagePath)
  const factory = readJson(factoryPath)
  const expectedLinks = [
    '/ai-video-generator',
    '/model/seedance-2',
    '/model/kling-3',
  ]
  const routeFiles = [
    'src/app/ai-video-generator/page.tsx',
    'src/app/model/seedance-2/page.tsx',
    'src/app/model/kling-3/page.tsx',
  ]

  assert.equal(page.moreTools, 'Related AI Video Tools')
  assert.deepEqual(page.moreToolsLinks.map((item) => item.href), expectedLinks)
  assert.ok(routeFiles.every((path) => existsSync(join(root, path))), 'related tools must use existing direct page routes')
  assert.deepEqual(factory.moreTools, page.moreTools)
  assert.deepEqual(factory.moreToolsLinks, page.moreToolsLinks)
})

test('image-to-video page has synchronized localized SEO Factory content', () => {
  for (const locale of localizedLocales) {
    const page = readJson(join(root, 'src', 'data', locale, 'image-to-video-generator.json'))
    const factory = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', '2026-07-23-image-to-video-generator', 'content', `${locale}.json`))

    assert.equal(page.topTool.defaultMode, 'image-to-video')
    assert.equal(page.promptExamples.layout, 'reference-video')
    assert.equal(page.promptExamples.items.length, 4)
    assert.equal(page.scenes.length, 6)
    assert.deepEqual(page.moreToolsLinks.map((item) => item.href), [
      '/ai-video-generator',
      '/model/seedance-2',
      '/model/kling-3',
    ])
    assert.ok(page.modelSelectionGuide.items.every((item) => !/\slogo$/i.test(item.logoAlt)))
    assert.deepEqual(factory, page)
  }
})

test('image-to-video model selection cards use model logos and prominent model names', () => {
  const page = readJson(pagePath)
  const l2Source = readFileSync(l2Path, 'utf8')
  const expectedLogos = {
    'Grok 1.5 Video': '/model-logos/grok.svg',
    'Seedance 2.0': '/model-logos/bytedance.svg',
    'Seedance 2.0 Mini': '/model-logos/bytedance.svg',
    'Kling 3.0': '/model-logos/kling.svg',
  }

  assert.deepEqual(page.modelSelectionGuide.items.map((item) => item.title), Object.keys(expectedLogos))
  for (const item of page.modelSelectionGuide.items) {
    assert.equal(item.logoSrc, expectedLogos[item.title])
    assert.match(item.logoAlt, /logo/i)
    assert.ok(item.badge && item.badge !== item.title, `${item.title} badge should describe capability, not repeat the model name`)
  }

  assert.match(l2Source, /logoSrc\?: string/)
  assert.match(l2Source, /item\.logoSrc\s*\?\s*\(/)
  assert.match(l2Source, /src=\{item\.logoSrc\}/)
  assert.match(l2Source, /alt=\{item\.logoAlt/)
  assert.match(l2Source, /text-2xl font-extrabold text-slate-950/)
})

test('image-to-video prompt cards send their poster image into the video generator', () => {
  const page = readJson(pagePath)
  const expectedFirstFrames = [
    'https://assets.toolaze.com/uploads/880154a7e9874c2eb41e2beb2a9bab67.webp',
    'https://assets.toolaze.com/uploads/d94dc2c421ed40bd89f0811484b581bc.webp',
    'https://assets.toolaze.com/uploads/2b49461525a74c4fa3679a2c4e40a5db.webp',
    'https://assets.toolaze.com/uploads/d45047f7914948c28a6249cb2e32bbbc.webp',
  ]
  const promptUseDetailSource = readFileSync(promptUseDetailPath, 'utf8')
  const promptExamplesSource = readFileSync(promptExamplesPath, 'utf8')
  const videoToolSource = readFileSync(videoToolPath, 'utf8')

  assert.equal(page.promptExamples.layout, 'reference-video')
  assert.ok(page.promptExamples.items.every((item) => item.referenceImage), 'each image-to-video prompt should include a reference image')
  assert.deepEqual(page.promptExamples.items.map((item) => item.referenceImage), expectedFirstFrames)
  assert.deepEqual(page.promptExamples.items.map((item) => item.poster), expectedFirstFrames)
  assert.match(promptExamplesSource, /reference-video/)
  assert.match(promptExamplesSource, /Reference Image/)
  assert.match(promptExamplesSource, /Result Video/)
  assert.match(promptExamplesSource, /lg:grid-cols-\[minmax\(0,1fr\)_360px\]/, 'reference-video layout should keep the result media column compact like GPT Image 2 result previews')
  assert.match(promptUseDetailSource, /poster\?: string/)
  assert.match(promptUseDetailSource, /referenceImage\?: string/)
  assert.match(promptUseDetailSource, /const referenceImageUrl = item\.referenceImage/)
  assert.match(promptUseDetailSource, /const demoImageUrl = item\.referenceImage \|\| item\.image \|\| item\.poster/)
  assert.match(promptUseDetailSource, /imageUrl: referenceImageUrl/)
  assert.match(promptUseDetailSource, /imageName: referenceImageName/)
  assert.match(promptExamplesSource, /poster\?: string/)
  assert.match(videoToolSource, /imageUrl\?: string/)
  assert.match(videoToolSource, /const singleImageUrl = normalizeReusableReferenceImageUrl\(detail\?\.imageUrl\)/)
  assert.match(videoToolSource, /const referenceUrls = imageUrls\.length > 0 \? imageUrls : singleImageUrl \? \[singleImageUrl\] : \[\]/)
  assert.match(videoToolSource, /setActiveMode\(nextMode\)/)
  assert.match(videoToolSource, /setRemoteImageUrls\(nextMode === 'image-to-video' \? referenceUrls\.slice\(0, nextModel\.maxImages\) : \[\]\)/)
})
