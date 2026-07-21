import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import {
  AI_VIDEO_GENERATOR_MODE_OPTIONS,
  AI_VIDEO_GENERATOR_MODEL_GROUPS,
  AI_VIDEO_GENERATOR_MODEL_OPTIONS,
  getAiVideoGeneratorModelMinimumCredits,
  getAiVideoGeneratorModelConfig,
} from './ai-video-generator-config'

test('AI video generator keeps text-to-video and image-to-video as the only creation modes', () => {
  assert.deepEqual(
    AI_VIDEO_GENERATOR_MODE_OPTIONS.map((mode) => mode.id),
    ['image-to-video', 'text-to-video']
  )
})

test('AI video generator exposes Grok, Seedance, Seedance Mini, and Kling model configs', () => {
  assert.deepEqual(
    AI_VIDEO_GENERATOR_MODEL_OPTIONS.map((model) => model.id),
    ['grok-1-5-video', 'seedance-2', 'seedance-2-mini', 'kling-3']
  )
})

test('AI video generator exposes a two-level visible model menu for every video model group', () => {
  assert.deepEqual(
    AI_VIDEO_GENERATOR_MODEL_GROUPS.map((group) => ({
      id: group.id,
      logoSrc: group.logoSrc,
      logoAlt: group.logoAlt,
      modelIds: group.models.map((model) => model.id),
    })),
    [
      { id: 'grok', logoSrc: '/model-logos/grok.svg', logoAlt: 'Grok logo', modelIds: ['grok-1-5-video'] },
      { id: 'seedance', logoSrc: '/model-logos/bytedance.svg', logoAlt: 'ByteDance logo', modelIds: ['seedance-2', 'seedance-2-mini'] },
      { id: 'kling', logoSrc: '/model-logos/kling.svg', logoAlt: 'Kling logo', modelIds: ['kling-3'] },
    ]
  )
})

test('AI video generator model configs define practical video output defaults', () => {
  const grok = getAiVideoGeneratorModelConfig('grok-1-5-video')
  const seedance = getAiVideoGeneratorModelConfig('seedance-2')
  const seedanceMini = getAiVideoGeneratorModelConfig('seedance-2-mini')
  const kling = getAiVideoGeneratorModelConfig('kling-3')

  assert.equal(grok.defaultMode, 'image-to-video')
  assert.equal(grok.maxImages, 1)
  assert.equal(grok.maxFileSizeMb, 20)
  assert.equal(grok.logoSrc, '/model-logos/grok.svg')
  assert.equal(grok.qualityRating, 4)
  assert.equal(grok.minCredits, 3)
  assert.deepEqual(grok.aspectRatios.map((ratio) => ratio.value), ['auto', '16:9', '9:16', '1:1', '3:2', '2:3'])
  assert.deepEqual(grok.durations, Array.from({ length: 15 }, (_, index) => index + 1))
  assert.equal(grok.defaultDuration, 5)
  assert.deepEqual(grok.resolutions, ['480p', '720p'])

  assert.equal(seedance.maxImages, 9)
  assert.ok(seedance.durations.includes(15))
  assert.equal(seedance.logoSrc, '/model-logos/bytedance.svg')
  assert.equal(seedance.qualityRating, 5)
  assert.equal(seedance.minCredits, 150)
  assert.deepEqual(seedance.resolutions, ['480p', '720p', '1080p', '4K'])

  assert.equal(seedanceMini.name, 'Seedance 2.0 Mini')
  assert.equal(seedanceMini.defaultMode, 'image-to-video')
  assert.equal(seedanceMini.maxImages, 9)
  assert.equal(seedanceMini.logoSrc, '/model-logos/bytedance.svg')
  assert.equal(seedanceMini.qualityRating, 4.5)
  assert.equal(seedanceMini.minCredits, 75)
  assert.deepEqual(seedanceMini.resolutions, ['480p', '720p'])
  assert.ok(seedanceMini.aspectRatios.some((ratio) => ratio.value === 'adaptive'))

  assert.equal(kling.logoSrc, '/model-logos/kling.svg')
  assert.equal(kling.qualityRating, 4.5)
  assert.equal(kling.minCredits, 60)
  assert.deepEqual(kling.resolutions, ['720p', '1080p', '4K'])
  assert.deepEqual(kling.durations, Array.from({ length: 13 }, (_, index) => index + 3))
  assert.equal(kling.supportsNativeAudio, true)
  assert.deepEqual(kling.nativeAudioResolutions, ['720p', '1080p'])
  assert.equal(kling.defaultMode, 'text-to-video')
})

test('AI video generator model menu minimum credits match shared pricing', () => {
  assert.equal(getAiVideoGeneratorModelMinimumCredits(getAiVideoGeneratorModelConfig('seedance-2')), 150)

  for (const model of AI_VIDEO_GENERATOR_MODEL_OPTIONS) {
    assert.equal(
      model.minCredits,
      getAiVideoGeneratorModelMinimumCredits(model),
      model.id + ' menu minimum credits should match shared pricing'
    )
  }
})

test('AI video generator translation slots exist for every supported locale', () => {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  const requiredKeys = [
    'imageToVideo',
    'textToVideo',
    'models',
    'uploadUpTo',
    'upload',
    'prompt',
    'aspectRatio',
    'duration',
    'resolution',
    'generate',
    'samplePreview',
    'history',
    'noHistory',
    'resultReady',
    'recreate',
    'uploadRequestFailed',
    'uploadFailedWithStatus',
    'serverNonJson',
    'checkStatusFailed',
    'generationTimeout',
    'videoGenerationFailed',
    'download',
    'resultExpires',
  ]

  const missing: string[] = []

  for (const locale of locales) {
    const filePath = join(process.cwd(), 'src', 'data', locale, 'common.json')
    const json = JSON.parse(readFileSync(filePath, 'utf8'))
    const toolText = json.common?.aiVideoGeneratorTool

    for (const key of requiredKeys) {
      if (typeof toolText?.[key] !== 'string' || toolText[key].trim() === '') {
        missing.push(`${locale}.${key}`)
      }
    }
  }

  assert.deepEqual(missing, [], missing.join('\n'))
})

test('AI video generator uses upload action copy instead of image-limit wording', () => {
  const filePath = join(process.cwd(), 'src', 'data', 'en', 'common.json')
  const json = JSON.parse(readFileSync(filePath, 'utf8'))
  const uploadUpTo = json.common?.aiVideoGeneratorTool?.uploadUpTo

  assert.equal(uploadUpTo, 'Upload up to {count} images')
  assert.equal(String(uploadUpTo).includes('Image limit'), false)
})
