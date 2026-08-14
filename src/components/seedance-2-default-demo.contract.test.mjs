import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const locales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW']
const outputVideo = 'https://assets.toolaze.com/generated/77514e7393eb42b68d04628dfc2d3e9b.mp4'
const imageUrls = [
  'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/a901c0d4b5ba41dcb7c6768be20418de.png',
  'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/6c76ef5f2fe34b7e9cbb0d3c45d6e9ab.png',
]
const referenceVideo = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/796404913d574137b5d0a20690a5dfad.mp4'

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

test('Seedance 2.0 ships the latest multimodal generation as its page demo', () => {
  for (const locale of locales) {
    const dataPath = join(root, 'src', 'data', locale, 'seedance-2.json')
    assert.ok(existsSync(dataPath), `${locale} Seedance page should exist`)
    const content = readJson(dataPath)

    assert.equal(content.heroDemoVideo.src, outputVideo, `${locale} should use the generated Seedance result as its demo video`)
    assert.equal(content.heroDemoVideo.type, 'video', `${locale} demo should be declared as video media`)
    assert.deepEqual(content.topTool.initialImageUrls, imageUrls, `${locale} should preload both reference images`)
    assert.deepEqual(content.topTool.initialMotionVideoUrls, [referenceVideo], `${locale} should preload the reference video`)
    assert.equal('initialAudioUrls' in content.topTool, false, `${locale} should not preload an unused reference audio file`)
    assert.equal(content.topTool.defaultMode, 'image-to-video', `${locale} should open the matching mode`)
    assert.equal(content.topTool.initialPrompt.includes('@Image 1'), true, `${locale} prompt should identify the subject reference`)
    assert.equal(content.topTool.initialPrompt.includes('@Image 2'), true, `${locale} prompt should identify the scene reference`)
    assert.equal(content.topTool.initialPrompt.includes('@Video 1'), true, `${locale} prompt should identify the motion reference`)
  }

  const english = readJson(join(root, 'src', 'data', 'en', 'seedance-2.json'))
  assert.doesNotMatch(english.topTool.initialPrompt, /参考|生成视频/, 'English demo prompt should not retain the source Chinese copy')
  for (const locale of locales.filter((locale) => locale !== 'en')) {
    const localized = readJson(join(root, 'src', 'data', locale, 'seedance-2.json'))
    assert.notEqual(localized.topTool.initialPrompt, english.topTool.initialPrompt, `${locale} demo prompt should be localized`)
  }
})

test('Shared video generator accepts optional initial reference audio for pages that need it', () => {
  const l2Source = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')

  assert.match(l2Source, /initialAudioUrls=\{Array\.isArray\(content\.topTool\?\.initialAudioUrls\)/)
})
