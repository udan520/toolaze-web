import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { getL2SeoContent } from './seo-loader'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

function readImageSize(filePath: string) {
  const buffer = readFileSync(filePath)

  if (
    buffer[0] === 0x89 &&
    buffer.toString('ascii', 1, 4) === 'PNG'
  ) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    }
  }

  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    let offset = 12
    while (offset + 8 <= buffer.length) {
      const chunk = buffer.toString('ascii', offset, offset + 4)
      const chunkSize = buffer.readUInt32LE(offset + 4)
      const dataOffset = offset + 8

      if (chunk === 'VP8X') {
        return {
          width: 1 + buffer.readUIntLE(dataOffset + 4, 3),
          height: 1 + buffer.readUIntLE(dataOffset + 7, 3),
        }
      }

      if (chunk === 'VP8L') {
        const b1 = buffer[dataOffset + 1]
        const b2 = buffer[dataOffset + 2]
        const b3 = buffer[dataOffset + 3]
        const b4 = buffer[dataOffset + 4]
        return {
          width: 1 + (((b2 & 0x3f) << 8) | b1),
          height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)),
        }
      }

      if (chunk === 'VP8 ') {
        return {
          width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
          height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff,
        }
      }

      offset = dataOffset + chunkSize + (chunkSize % 2)
    }
  }

  throw new Error(`Unsupported image format: ${filePath}`)
}

test('loads AI Hairstyle Changer as a single-image scene page', async () => {
  const content = await getL2SeoContent('ai-hairstyle-changer', 'en')

  assert.ok(content, 'AI Hairstyle Changer content should load')
  assert.equal(content?.pageGroup, 'ai-tools')
  assert.equal(content?.visiblePageType, 'scene')
  assert.equal(content?.topTool?.mode, 'image-to-image')
  assert.equal(content?.topTool?.maxUploadImages, 1)
  assert.equal(content?.topTool?.hideModelBranding, true)
  assert.equal(content?.topTool?.compactResultPanel, true)
  assert.match(content?.metadata?.title || '', /AI Hairstyle Changer/i)
  assert.match(content?.hero?.h1 || '', /Hairstyle Changer/i)
  assert.ok(content?.sectionsOrder?.includes('testimonials'))
})

test('AI Hairstyle Changer uses local visual hairstyle presets', async () => {
  const content = await getL2SeoContent('ai-hairstyle-changer', 'en')
  const presets = content?.topTool?.functionalAcceptance?.presets || []
  const tabs = content?.topTool?.functionalAcceptance?.presetTabs || []

  assert.equal(
    content?.topTool?.functionalAcceptance?.recommendedMode,
    'gender-tab-preset-first-with-custom',
  )
  assert.deepEqual(
    tabs.map((tab: { id: string }) => tab.id),
    ['women', 'men', 'custom'],
  )
  assert.equal(content?.topTool?.functionalAcceptance?.hidePresetPromptInput, true)
  assert.ok(presets.filter((preset: { group?: string }) => preset.group === 'women').length >= 10)
  assert.ok(presets.filter((preset: { group?: string }) => preset.group === 'men').length >= 10)
  for (const preset of presets) {
    if (typeof preset === 'string' || preset.label?.toLowerCase() === 'custom') continue

    assert.ok(preset.image?.startsWith('/ai-hairstyle-changer/templates/'))
    assert.ok(
      existsSync(join(process.cwd(), 'public', preset.image)),
      `preset image should exist: ${preset.image}`,
    )
    assert.ok(preset.prompt?.trim(), `preset should fill a prompt: ${preset.label}`)
    assert.ok(['women', 'men'].includes(preset.group), `preset should have a gender group: ${preset.label}`)
  }
})

test('AI Hairstyle Changer shows hairstyle prompts in content while keeping the tool compact', async () => {
  for (const locale of locales) {
    const content = await getL2SeoContent('ai-hairstyle-changer', locale)
    const presets = (content?.topTool?.functionalAcceptance?.presets || [])
      .filter((preset: { label?: string; image?: string; prompt?: string; group?: string } | string) =>
        typeof preset !== 'string' && preset.label?.toLowerCase() !== 'custom',
      ) as Array<{ label: string; image: string; prompt: string; group: string }>
    const examples = content?.promptExamples?.items || []

    assert.ok(
      content?.sectionsOrder?.includes('promptExamples'),
      `prompt examples should be visible for ${locale}`,
    )
    assert.equal(
      content?.topTool?.functionalAcceptance?.hidePresetPromptInput,
      true,
      `preset prompt input should stay hidden for ${locale}`,
    )
    assert.equal(
      content?.topTool?.compactResultPanel,
      true,
      `result panel should stay compact for ${locale}`,
    )
    assert.equal(examples.length, presets.length, `all hairstyle presets should appear as examples for ${locale}`)
    assert.equal(examples.filter((item: { group?: string }) => item.group === 'women').length, 11)
    assert.equal(examples.filter((item: { group?: string }) => item.group === 'men').length, 11)

    for (const preset of presets) {
      const example = examples.find((item: { title?: string }) => item.title === preset.label)

      assert.ok(example, `missing prompt example for ${locale}: ${preset.label}`)
      assert.equal(example.prompt, preset.prompt)
      assert.equal(example.image, preset.image)
      assert.equal(example.group, preset.group)
    }
  }

  const english = await getL2SeoContent('ai-hairstyle-changer', 'en')
  assert.doesNotMatch(english?.hero?.desc || '', /editable prompt/i)
  assert.doesNotMatch(english?.metadata?.description || '', /edit the prompt/i)
})

test('AI Hairstyle Changer scene branch forwards compact result mode', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/components/blocks/ToolL2PageContent.tsx'),
    'utf8',
  )
  const branchStart = source.indexOf("topComp === 'gpt-image-2'")
  const branchEnd = source.indexOf("topComp === 'seedance-2'", branchStart)
  const branchSource = source.slice(branchStart, branchEnd)

  assert.notEqual(branchStart, -1)
  assert.notEqual(branchEnd, -1)
  assert.match(
    branchSource,
    /compactResultPanel=\{content\.topTool\?\.compactResultPanel === true\}/,
  )
})

test('PromptExamples supports gender tabs for hairstyle examples', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/components/blocks/PromptExamples.tsx'),
    'utf8',
  )

  assert.match(source, /useState\('women'\)/)
  assert.match(source, /activeGroup/)
  assert.match(source, /item\.group === activeGroup/)
  assert.match(source, /role="tablist"/)
  assert.match(source, /role="tab"/)
  assert.match(source, /line-clamp-5/)
  assert.match(source, /presetLabel: item\.title/)
  assert.match(source, /presetGroup: item\.group/)
  assert.match(source, /navigator\.clipboard\.writeText\(item\.prompt\)/)
  assert.match(source, /Copied'\s*:\s*'Copy Prompt'/)
})

test('AI Hairstyle Changer has a local default reference and hero demo', async () => {
  const content = await getL2SeoContent('ai-hairstyle-changer', 'en')
  const defaultImages = content?.topTool?.defaultImageUrls || []
  const samples = content?.topTool?.sampleImages || []

  assert.equal(defaultImages.length, 1)
  assert.ok(samples.length >= 1)

  for (const imageUrl of [...defaultImages, ...samples.map((item: { url: string }) => item.url)]) {
    assert.ok(imageUrl.startsWith('/ai-hairstyle-changer/'))
    assert.ok(
      existsSync(join(process.cwd(), 'public', imageUrl.split('?')[0])),
      `image should exist: ${imageUrl}`,
    )
  }
})

test('AI Hairstyle Changer hairstyle assets have generated production dimensions', async () => {
  const content = await getL2SeoContent('ai-hairstyle-changer', 'en')
  const presets = (content?.topTool?.functionalAcceptance?.presets || [])
    .filter((preset: { label?: string; image?: string; group?: string } | string) =>
      typeof preset !== 'string' && preset.label?.toLowerCase() !== 'custom',
    ) as Array<{ label: string; image: string; group: string }>
  const hashes = new Set<string>()

  assert.equal(presets.filter((preset) => preset.group === 'women').length, 11)
  assert.equal(presets.filter((preset) => preset.group === 'men').length, 11)

  for (const preset of presets) {
    const filePath = join(process.cwd(), 'public', preset.image)
    const size = readImageSize(filePath)
    const hash = createHash('sha256').update(readFileSync(filePath)).digest('hex')

    assert.deepEqual(size, { width: 640, height: 640 }, `${preset.label} should be 640x640`)
    assert.equal(hashes.has(hash), false, `${preset.label} should not duplicate another hairstyle asset`)
    hashes.add(hash)
  }

  const heroPath = join(process.cwd(), 'public/ai-hairstyle-changer/hero-before-after.webp')
  assert.deepEqual(readImageSize(heroPath), { width: 1600, height: 900 })

  const referencePath = join(process.cwd(), 'public/ai-hairstyle-changer/default-reference.png')
  assert.deepEqual(readImageSize(referencePath), { width: 1086, height: 1448 })

  const previewPath = join(process.cwd(), 'public/ai-hairstyle-changer/default-reference-preview.webp')
  assert.deepEqual(readImageSize(previewPath), { width: 720, height: 960 })
})

test('AI Hairstyle Changer has English and localized routes', () => {
  assert.ok(existsSync(join(process.cwd(), 'src/app/ai-hairstyle-changer/page.tsx')))
  assert.ok(existsSync(join(process.cwd(), 'src/app/[locale]/ai-hairstyle-changer/page.tsx')))

  for (const locale of locales) {
    assert.ok(
      existsSync(join(process.cwd(), 'src/data', locale, 'ai-hairstyle-changer.json')),
      `missing locale file: ${locale}`,
    )
  }
})
