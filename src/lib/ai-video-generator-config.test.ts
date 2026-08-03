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
  getAiVideoGeneratorFallbackModel,
  getAiVideoGeneratorModelGroupsForMode,
} from './ai-video-generator-config'

test('AI video generator keeps text-to-video and image-to-video as the only creation modes', () => {
  assert.deepEqual(
    AI_VIDEO_GENERATOR_MODE_OPTIONS.map((mode) => mode.id),
    ['image-to-video', 'text-to-video']
  )
})

test('text-to-video model groups exclude image-only models and empty groups', () => {
  const groups = getAiVideoGeneratorModelGroupsForMode('text-to-video')

  assert.equal(
    groups.flatMap((group) => group.models).some((model) => model.id === 'seedance-1-pro-fast'),
    false,
  )
  assert.ok(groups.every((group) => group.models.length > 0))
})

test('mode-filtered model groups sort each family by quality while preserving equal-score order', () => {
  for (const mode of ['image-to-video', 'text-to-video'] as const) {
    for (const group of getAiVideoGeneratorModelGroupsForMode(mode)) {
      assert.deepEqual(
        group.models.map((model) => model.qualityRating),
        [...group.models]
          .sort((left, right) => right.qualityRating - left.qualityRating)
          .map((model) => model.qualityRating),
        `${mode}.${group.id}`,
      )

      const originalIds = AI_VIDEO_GENERATOR_MODEL_GROUPS
        .find((candidate) => candidate.id === group.id)
        ?.models.map((model) => model.id) || []
      for (let index = 1; index < group.models.length; index += 1) {
        const previous = group.models[index - 1]
        const current = group.models[index]
        if (previous.qualityRating !== current.qualityRating) continue
        assert.ok(originalIds.indexOf(previous.id) < originalIds.indexOf(current.id))
      }
    }
  }
})

test('mode fallback is the first compatible model in the sorted menu', () => {
  for (const mode of ['image-to-video', 'text-to-video'] as const) {
    const groups = getAiVideoGeneratorModelGroupsForMode(mode)
    assert.equal(getAiVideoGeneratorFallbackModel(mode)?.id, groups[0]?.models[0]?.id)
  }
})

test('AI video generator exposes all configured video model variants', () => {
  assert.deepEqual(
    AI_VIDEO_GENERATOR_MODEL_OPTIONS.map((model) => model.id),
    [
      'grok-1-5-video',
      'seedance-2',
      'seedance-2-mini',
      'seedance-2-fast',
      'seedance-1-5-pro',
      'seedance-1-pro-fast',
      'seedance-1-pro',
      'seedance-1-lite',
      'wan-2-7',
      'wan-2-6',
      'wan-2-5',
      'wan-2-2',
      'kling-3-turbo',
      'kling-3',
      'kling-3-motion-control',
      'kling-2-6-motion-control',
      'kling-2-6',
      'kling-2-5',
      'kling-2-1',
      'veo-3-1-lite',
      'veo-3-1-fast',
      'veo-3-1-quality',
      'pixverse-v6',
      'happyhorse-1-1',
      'happyhorse',
    ]
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
      {
        id: 'seedance',
        logoSrc: '/model-logos/bytedance.svg',
        logoAlt: 'ByteDance logo',
        modelIds: ['seedance-2', 'seedance-2-mini', 'seedance-2-fast', 'seedance-1-5-pro', 'seedance-1-pro-fast', 'seedance-1-pro', 'seedance-1-lite'],
      },
      {
        id: 'wan',
        logoSrc: '/model-logos/wan.ico',
        logoAlt: 'Wan logo',
        modelIds: ['wan-2-7', 'wan-2-6', 'wan-2-5', 'wan-2-2'],
      },
      {
        id: 'kling',
        logoSrc: '/model-logos/kling.svg',
        logoAlt: 'Kling logo',
        modelIds: ['kling-3-turbo', 'kling-3', 'kling-3-motion-control', 'kling-2-6-motion-control', 'kling-2-6', 'kling-2-5', 'kling-2-1'],
      },
      {
        id: 'veo',
        logoSrc: '/model-logos/google-gemini.png',
        logoAlt: 'Google Gemini logo',
        modelIds: ['veo-3-1-lite', 'veo-3-1-fast', 'veo-3-1-quality'],
      },
      {
        id: 'pixverse',
        logoSrc: '/model-logos/pixverse.svg',
        logoAlt: 'PixVerse logo',
        modelIds: ['pixverse-v6'],
      },
      {
        id: 'happyhorse',
        logoSrc: '/model-logos/happyhorse.svg',
        logoAlt: 'HappyHorse logo',
        modelIds: ['happyhorse-1-1', 'happyhorse'],
      },
    ]
  )
})

test('Kling 3 Motion Control follows reference-video motion-control constraints', () => {
  const model = getAiVideoGeneratorModelConfig('kling-3-motion-control')

  assert.equal(model.name, 'Kling 3 Motion Control')
  assert.equal(model.defaultMode, 'image-to-video')
  assert.deepEqual(model.supportedModes, ['image-to-video'])
  assert.equal(model.maxImages, 1)
  assert.equal(model.maxVideos, 1)
  assert.equal(model.maxVideoFileSizeMb, 100)
  assert.equal(model.supportsMotionReferenceVideo, true)
  assert.equal(model.promptRequired, false)
  assert.equal(model.durationMode, 'reference-video')
  assert.equal(model.referenceVideoMinDurationSeconds, 3)
  assert.equal(model.referenceVideoMaxDurationSeconds, 30)
  assert.deepEqual(model.acceptedImageMimeTypes, ['image/jpeg', 'image/png'])
  assert.deepEqual(model.acceptedImageExtensions, ['jpg', 'jpeg', 'png'])
  assert.deepEqual(model.acceptedImageFormats, ['JPG', 'PNG'])
  assert.equal(model.referenceImageMinDimensionPx, 300)
  assert.equal(model.referenceImageAspectRatioMin, 2 / 5)
  assert.equal(model.referenceImageAspectRatioMax, 5 / 2)
  assert.match(model.referenceImageHelperText || '', /JPG or PNG up to \{size\}MB/)
  assert.match(model.invalidImageDimensionsMessage || '', /over 300px/)
  assert.match(model.invalidImageDimensionsMessage || '', /2:5 to 5:2/)
  assert.deepEqual(model.acceptedMotionVideoFormats, ['MP4', 'QuickTime'])
  assert.deepEqual(model.resolutions, ['720p', '1080p'])
  assert.deepEqual(model.durations, Array.from({ length: 28 }, (_, index) => index + 3))
  assert.equal(model.defaultDuration, 3)
})

test('PixVerse and HappyHorse expose only text-to-video and image-to-video settings', () => {
  const pixverse = getAiVideoGeneratorModelConfig('pixverse-v6')
  const happyhorse11 = getAiVideoGeneratorModelConfig('happyhorse-1-1')
  const happyhorse = getAiVideoGeneratorModelConfig('happyhorse')

  assert.equal(pixverse.defaultMode, 'text-to-video')
  assert.equal(pixverse.maxImages, 1)
  assert.deepEqual(pixverse.durations, Array.from({ length: 15 }, (_, index) => index + 1))
  assert.deepEqual(pixverse.resolutions, ['360p', '540p', '720p', '1080p'])
  assert.equal(pixverse.supportsNativeAudio, true)

  for (const model of [happyhorse11, happyhorse]) {
    assert.equal(model.defaultMode, 'text-to-video')
    assert.equal(model.maxImages, 1)
    assert.deepEqual(model.durations, Array.from({ length: 13 }, (_, index) => index + 3))
    assert.deepEqual(model.resolutions, ['720p', '1080p'])
  }
})

test('Seedance 1.0 Pro Fast is an image-to-video-only model', () => {
  const model = getAiVideoGeneratorModelConfig('seedance-1-pro-fast')

  assert.equal(model.name, 'Seedance 1.0 Pro Fast')
  assert.equal(model.defaultMode, 'image-to-video')
  assert.deepEqual(model.supportedModes, ['image-to-video'])
  assert.equal(model.maxImages, 1)
  assert.equal(model.maxFileSizeMb, 10)
  assert.deepEqual(model.durations, [5, 10])
  assert.deepEqual(model.resolutions, ['720p', '1080p'])
})

test('Kling 2.6 Motion Control is an image-and-motion-video model', () => {
  const model = getAiVideoGeneratorModelConfig('kling-2-6-motion-control')

  assert.equal(model.name, 'Kling 2.6 Motion Control')
  assert.equal(model.defaultMode, 'image-to-video')
  assert.deepEqual(model.supportedModes, ['image-to-video'])
  assert.equal(model.maxImages, 1)
  assert.equal(model.maxVideos, 1)
  assert.equal(model.maxVideoFileSizeMb, 100)
  assert.equal(model.supportsMotionReferenceVideo, true)
  assert.equal(model.supportsNativeAudioOutput, true)
  assert.equal(model.uploadPurpose, 'kling-motion-control')
  assert.equal('uploadProvider' in model, false)
  assert.equal('uploadPath' in model, false)
  assert.equal('uploadFormatProfile' in model, false)
  assert.deepEqual(model.acceptedImageMimeTypes, ['image/jpeg', 'image/png'])
  assert.deepEqual(model.acceptedImageExtensions, ['jpg', 'jpeg', 'png'])
  assert.deepEqual(model.acceptedImageFormats, ['JPG', 'PNG'])
  assert.equal(model.referenceImageMinDimensionPx, 300)
  assert.equal(model.referenceImageAspectRatioMin, 2 / 5)
  assert.equal(model.referenceImageAspectRatioMax, 5 / 2)
  assert.match(model.referenceImageHelperText || '', /JPG or PNG up to \{size\}MB/)
  assert.match(model.invalidImageDimensionsMessage || '', /over 300px/)
  assert.match(model.invalidImageDimensionsMessage || '', /2:5 to 5:2/)
  assert.equal(model.promptRequired, false)
  assert.equal(model.durationMode, 'reference-video')
  assert.equal(model.referenceVideoMinDurationSeconds, 3)
  assert.equal(model.referenceVideoMaxDurationSeconds, 30)
  assert.deepEqual(model.acceptedMotionVideoFormats, ['MP4', 'QuickTime', 'Matroska'])
  assert.deepEqual(model.resolutions, ['720p', '1080p'])
  assert.deepEqual(model.durations, Array.from({ length: 28 }, (_, index) => index + 3))
  assert.equal(model.defaultDuration, 3)
})

test('image-to-video models with reference-shaped output disable manual aspect-ratio selection', () => {
  const referenceShapedModelIds = [
    'seedance-1-pro-fast',
    'seedance-1-pro',
    'seedance-1-lite',
    'wan-2-6',
    'wan-2-5',
    'wan-2-2',
    'kling-2-6-motion-control',
    'happyhorse-1-1',
    'happyhorse',
  ] as const

  for (const modelId of referenceShapedModelIds) {
    assert.equal(
      getAiVideoGeneratorModelConfig(modelId).imageToVideoAspectRatioMode,
      'reference-image',
      `${modelId} image-to-video output should use the Match Reference aspect-ratio control`,
    )
  }
})

test('AI video generator model configs define practical video output defaults', () => {
  const grok = getAiVideoGeneratorModelConfig('grok-1-5-video')
  const seedance = getAiVideoGeneratorModelConfig('seedance-2')
  const seedanceMini = getAiVideoGeneratorModelConfig('seedance-2-mini')
  const seedanceFast = getAiVideoGeneratorModelConfig('seedance-2-fast')
  const kling = getAiVideoGeneratorModelConfig('kling-3')
  const veoLite = getAiVideoGeneratorModelConfig('veo-3-1-lite')
  const veoFast = getAiVideoGeneratorModelConfig('veo-3-1-fast')
  const veoQuality = getAiVideoGeneratorModelConfig('veo-3-1-quality')

  assert.equal(grok.defaultMode, 'image-to-video')
  assert.equal(grok.maxImages, 1)
  assert.equal(grok.maxFileSizeMb, 20)
  assert.equal(grok.logoSrc, '/model-logos/grok.svg')
  assert.equal(grok.qualityRating, 4)
  assert.equal(grok.minCredits, 3)
  assert.deepEqual(grok.aspectRatios.map((ratio) => ratio.value), ['auto', '16:9', '9:16', '1:1', '3:2', '2:3'])
  assert.deepEqual(grok.durations, Array.from({ length: 15 }, (_, index) => index + 1))
  assert.equal(grok.defaultDuration, 3)
  assert.deepEqual(grok.resolutions, ['480p', '720p'])

  assert.equal(seedance.maxImages, 2)
  assert.ok(seedance.durations.includes(15))
  assert.equal(seedance.logoSrc, '/model-logos/bytedance.svg')
  assert.equal(seedance.qualityRating, 5)
  assert.equal(seedance.minCredits, 190)
  assert.deepEqual(seedance.resolutions, ['480p', '720p', '1080p', '4K'])

  assert.equal(seedanceMini.name, 'Seedance 2.0 Mini')
  assert.equal(seedanceMini.defaultMode, 'image-to-video')
  assert.equal(seedanceMini.maxImages, 2)
  assert.equal(seedanceMini.logoSrc, '/model-logos/bytedance.svg')
  assert.equal(seedanceMini.qualityRating, 4.5)
  assert.equal(seedanceMini.minCredits, 95)
  assert.deepEqual(seedanceMini.resolutions, ['480p', '720p'])
  assert.ok(seedanceMini.aspectRatios.some((ratio) => ratio.value === 'adaptive'))

  assert.equal(seedanceFast.minCredits, 155)
  assert.deepEqual(seedanceFast.resolutions, ['480p', '720p'])
  assert.equal(seedanceFast.supportsNativeAudio, false)
  assert.equal(seedanceFast.nativeAudioResolutions, undefined)

  assert.equal(kling.logoSrc, '/model-logos/kling.svg')
  assert.equal(kling.qualityRating, 4.5)
  assert.equal(kling.minCredits, 84)
  assert.deepEqual(kling.resolutions, ['720p', '1080p', '4K'])
  assert.deepEqual(kling.durations, Array.from({ length: 13 }, (_, index) => index + 3))
  assert.equal(kling.supportsNativeAudio, true)
  assert.deepEqual(kling.nativeAudioResolutions, ['720p', '1080p'])
  assert.equal(kling.defaultMode, 'text-to-video')

  for (const veo of [veoLite, veoFast, veoQuality]) {
    assert.equal(veo.vendor, 'Google')
    assert.equal(veo.logoSrc, '/model-logos/google-gemini.png')
    assert.equal(veo.logoAlt, 'Google Gemini logo')
    assert.equal(veo.maxImages, 2)
    assert.equal(veo.defaultMode, 'text-to-video')
    assert.deepEqual(veo.aspectRatios.map((ratio) => ratio.value), ['16:9', '9:16'])
    assert.deepEqual(veo.durations, [4, 6, 8])
    assert.equal(veo.defaultDuration, 8)
    assert.deepEqual(veo.resolutions, ['720p', '1080p'])
  }
  assert.equal(veoLite.minCredits, 30)
  assert.equal(veoFast.minCredits, 60)
  assert.equal(veoQuality.minCredits, 450)
})

test('AI video generator model menu minimum credits match shared pricing', () => {
  assert.equal(getAiVideoGeneratorModelMinimumCredits(getAiVideoGeneratorModelConfig('seedance-2')), 190)

  const expectedMinimumCreditsByModel = new Map([
    ['grok-1-5-video', 3],
    ['seedance-2', 190],
    ['seedance-2-mini', 95],
    ['seedance-2-fast', 155],
    ['seedance-1-5-pro', 16],
    ['seedance-1-pro-fast', 32],
    ['seedance-1-pro', 30],
    ['seedance-1-lite', 20],
    ['wan-2-7', 64],
    ['wan-2-6', 140],
    ['wan-2-5', 120],
    ['wan-2-2', 16],
    ['kling-3-turbo', 180],
    ['kling-3', 84],
    ['kling-3-motion-control', 120],
    ['kling-2-6-motion-control', 66],
    ['kling-2-6', 110],
    ['kling-2-5', 85],
    ['kling-2-1', 320],
    ['veo-3-1-lite', 30],
    ['veo-3-1-fast', 60],
    ['veo-3-1-quality', 450],
    ['pixverse-v6', 8],
    ['happyhorse-1-1', 135],
    ['happyhorse', 168],
  ])

  for (const model of AI_VIDEO_GENERATOR_MODEL_OPTIONS) {
    assert.equal(
      model.minCredits,
      expectedMinimumCreditsByModel.get(model.id),
      model.id + ' menu minimum credits should use video cost-times-two pricing'
    )
    assert.equal(
      model.minCredits,
      getAiVideoGeneratorModelMinimumCredits(model),
      model.id + ' menu minimum credits should match shared pricing'
    )
  }
})

test('every video model declares native-audio and multi-shot capabilities', () => {
  for (const model of AI_VIDEO_GENERATOR_MODEL_OPTIONS) {
    assert.equal(typeof model.supportsNativeAudioOutput, 'boolean', `${model.id} native audio capability`)
    assert.equal(typeof model.supportsMultiShot, 'boolean', `${model.id} multi-shot capability`)
  }
})

test('HappyHorse models advertise their native audio and multi-shot capabilities', () => {
  for (const modelId of ['happyhorse-1-1', 'happyhorse'] as const) {
    const model = getAiVideoGeneratorModelConfig(modelId)
    assert.equal(model.supportsNativeAudioOutput, true)
    assert.equal(model.supportsMultiShot, true)
  }
})

test('video capability labels match the audited KIE model matrix', () => {
  const nativeAudioModels = AI_VIDEO_GENERATOR_MODEL_OPTIONS
    .filter((model) => model.supportsNativeAudioOutput)
    .map((model) => model.id)
  const multiShotModels = AI_VIDEO_GENERATOR_MODEL_OPTIONS
    .filter((model) => model.supportsMultiShot)
    .map((model) => model.id)

  assert.deepEqual(nativeAudioModels, [
    'grok-1-5-video',
    'seedance-2',
    'seedance-2-mini',
    'seedance-1-5-pro',
    'wan-2-6',
    'wan-2-5',
    'kling-3-turbo',
    'kling-3',
    'kling-2-6-motion-control',
    'kling-2-6',
    'veo-3-1-lite',
    'veo-3-1-fast',
    'veo-3-1-quality',
    'pixverse-v6',
    'happyhorse-1-1',
    'happyhorse',
  ])
  assert.deepEqual(multiShotModels, [
    'seedance-2',
    'seedance-2-mini',
    'seedance-2-fast',
    'seedance-1-5-pro',
    'seedance-1-pro-fast',
    'seedance-1-pro',
    'wan-2-6',
    'kling-3-turbo',
    'kling-3',
    'veo-3-1-lite',
    'veo-3-1-fast',
    'veo-3-1-quality',
    'pixverse-v6',
    'happyhorse-1-1',
    'happyhorse',
  ])
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
    'referenceImageAspectRatioLabel',
    'referenceImageAspectRatioHelper',
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
    'modelSwitchedTitle',
    'modelSwitchedDescription',
    'noCompatibleModelTitle',
    'noCompatibleModelDescription',
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

  const englishToolText = JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'data', 'en', 'common.json'), 'utf8'),
  ).common.aiVideoGeneratorTool
  for (const locale of locales.filter((item) => item !== 'en')) {
    const localizedToolText = JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'data', locale, 'common.json'), 'utf8'),
    ).common.aiVideoGeneratorTool
    for (const key of [
      'modelSwitchedTitle',
      'modelSwitchedDescription',
      'noCompatibleModelTitle',
      'noCompatibleModelDescription',
      'referenceImageAspectRatioLabel',
      'referenceImageAspectRatioHelper',
    ]) {
      assert.notEqual(localizedToolText[key], englishToolText[key], `${locale}.${key}`)
    }
  }
})

test('AI video generator uses upload action copy instead of image-limit wording', () => {
  const filePath = join(process.cwd(), 'src', 'data', 'en', 'common.json')
  const json = JSON.parse(readFileSync(filePath, 'utf8'))
  const uploadUpTo = json.common?.aiVideoGeneratorTool?.uploadUpTo

  assert.equal(uploadUpTo, 'Upload up to {count} images')
  assert.equal(String(uploadUpTo).includes('Image limit'), false)
})
