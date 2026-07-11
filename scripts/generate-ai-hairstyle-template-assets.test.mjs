import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const root = join(currentDir, '..')
const generatorPath = join(currentDir, 'generate-ai-hairstyle-template-assets.mjs')
const pageDataPath = join(root, 'src/data/en/ai-hairstyle-changer.json')

test('hairstyle asset generator exists', () => {
  assert.equal(
    existsSync(generatorPath),
    true,
    'scripts/generate-ai-hairstyle-template-assets.mjs should exist',
  )
})

test('women hairstyle configuration matches the landing page presets', {
  skip: !existsSync(generatorPath),
}, async () => {
  const { WOMEN_STYLES, buildGenerationPrompt } = await import(
    `${pathToFileURL(generatorPath).href}?test=${Date.now()}`
  )
  const pageData = JSON.parse(readFileSync(pageDataPath, 'utf8'))
  const expectedPresets = pageData.topTool.functionalAcceptance.presets
    .filter((preset) => preset.group === 'women')

  assert.equal(WOMEN_STYLES.length, 11)
  assert.deepEqual(
    WOMEN_STYLES.map((item) => item.id),
    [
      'short-bob',
      'a-line-bob',
      'long-layers',
      'curtain-bangs',
      'big-waves',
      'pixie-cut',
      'wolf-cut',
      'top-bun',
      'two-braids',
      'curly-bob',
      'straight-hair',
    ],
  )
  assert.deepEqual(
    WOMEN_STYLES.map((item) => item.publicPath),
    expectedPresets.map((preset) => preset.image),
  )

  for (const style of WOMEN_STYLES) {
    const prompt = buildGenerationPrompt(style)
    assert.match(prompt, /Change only the hairstyle/i)
    assert.match(prompt, /only identity and composition reference/i)
    assert.match(prompt, /exact same face/i)
    assert.match(prompt, /black tank top/i)
    assert.match(prompt, /white studio background/i)
    assert.match(prompt, /Do not beautify or redraw the face/i)
  }
})

test('KIE result parser accepts supported response shapes', {
  skip: !existsSync(generatorPath),
}, async () => {
  const { extractImageUrl } = await import(
    `${pathToFileURL(generatorPath).href}?parser=${Date.now()}`
  )

  assert.equal(
    extractImageUrl({
      data: {
        resultJson: JSON.stringify({
          resultUrls: ['https://example.com/result.png'],
        }),
      },
    }),
    'https://example.com/result.png',
  )
  assert.equal(
    extractImageUrl({
      data: {
        resultUrls: ['https://example.com/direct.png'],
      },
    }),
    'https://example.com/direct.png',
  )
})

test('every KIE task uses the original reference URL and fixed web asset settings', async () => {
  const { WOMEN_STYLES, buildTaskPayload } = await import(
    `${pathToFileURL(generatorPath).href}?payload=${Date.now()}`
  )
  const referenceUrl = 'https://assets.example.com/women-reference.png'

  for (const style of WOMEN_STYLES) {
    const payload = buildTaskPayload(
      style,
      referenceUrl,
      'gpt-image-2-text-to-image',
    )

    assert.equal(payload.model, 'gpt-image-2-text-to-image')
    assert.deepEqual(payload.input.input_urls, [referenceUrl])
    assert.equal(payload.input.aspect_ratio, '1:1')
    assert.equal(payload.input.resolution, '1K')
    assert.equal(payload.input.output_format, 'png')
    assert.match(payload.input.prompt, new RegExp(style.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
    assert.match(payload.input.prompt, /exact same face/i)
  }
})

test('public hairstyle assets resolve inside the public directory', async () => {
  const { WOMEN_STYLES, resolvePublicAssetPath } = await import(
    `${pathToFileURL(generatorPath).href}?public-path=${Date.now()}`
  )

  for (const style of WOMEN_STYLES) {
    const resolved = resolvePublicAssetPath(style.publicPath)
    assert.equal(
      resolved,
      join(root, 'public', style.publicPath.replace(/^\//, '')),
    )
  }
})

test('men hairstyle configuration uses the male model invariants', async () => {
  const { MEN_STYLES, buildGenerationPrompt } = await import(
    `${pathToFileURL(generatorPath).href}?men=${Date.now()}`
  )
  const pageData = JSON.parse(readFileSync(pageDataPath, 'utf8'))
  const expectedPresets = pageData.topTool.functionalAcceptance.presets
    .filter((preset) => preset.group === 'men')

  assert.equal(MEN_STYLES.length, 11)
  assert.deepEqual(
    MEN_STYLES.map((item) => item.id),
    [
      'buzz-cut',
      'crew-cut',
      'bald',
      'textured-crop',
      'taper-fade',
      'messy-fade',
      'short-curly',
      'slick-back',
      'soft-bowl',
      'textured-flow',
      'short-box-braids',
    ],
  )
  assert.deepEqual(
    MEN_STYLES.map((item) => item.publicPath),
    expectedPresets.map((preset) => preset.image),
  )

  for (const style of MEN_STYLES) {
    const prompt = buildGenerationPrompt(style)
    assert.match(prompt, /only identity and composition reference/i)
    assert.match(prompt, /exact same face/i)
    assert.match(prompt, /black T-shirt/i)
    assert.match(prompt, /white studio background/i)
    assert.doesNotMatch(prompt, /black tank top/i)
  }
})
