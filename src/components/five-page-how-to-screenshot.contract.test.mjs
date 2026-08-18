import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const jsonPages = ['age-filter', 'photo-restoration', 'watermark-remover']

test('shared How To cards render one screenshot before each step title and label', () => {
  const componentPath = 'src/components/blocks/HowToStepCards.tsx'
  assert.equal(existsSync(join(root, componentPath)), true, 'HowToStepCards should own the shared layout')
  if (!existsSync(join(root, componentPath))) return

  const source = read(componentPath)
  assert.match(source, /steps\.map/)
  assert.ok(source.indexOf('<img') < source.indexOf('<h3'), 'step image should render before its title')
  assert.ok(source.indexOf('<h3') < source.indexOf('{stepLabel}'), 'title should render before the STEP label')
  assert.match(source, /object-contain/)
})

test('five page renderers no longer use one section-level screenshot', () => {
  const howToUse = read('src/components/blocks/HowToUse.tsx')
  const textToImage = read('src/components/AiImageGeneratorPageContent.tsx')
  const seedream = read('src/components/Seedream50ProLandingPage.tsx')
  const sources = [howToUse, textToImage, seedream].join('\n')

  assert.doesNotMatch(sources, /HowToScreenshot/)
  assert.match(howToUse, /HowToStepCards/)
  assert.match(textToImage, /HowToStepCards/)
  assert.match(seedream, /HowToStepCards/)
})

test('three JSON page families attach localized media to every visible step', () => {
  for (const locale of locales) {
    for (const page of jsonPages) {
      const data = JSON.parse(read(`src/data/${locale}/${page}.json`))
      assert.equal(data.howToUse.screenshot, undefined, `${locale}/${page} should not keep a section screenshot`)
      assert.equal(data.howToUse.steps.length, 3, `${locale}/${page} should keep three steps`)

      data.howToUse.steps.forEach((step, index) => {
        assert.equal(
          step.media?.src,
          `https://assets.toolaze.com/landing-pages/${page}/how-to/step-${index + 1}.webp`,
          `${locale}/${page} step ${index + 1} should use its stable R2 asset`,
        )
        assert.ok(step.media?.alt?.trim(), `${locale}/${page} step ${index + 1} should have localized alt text`)
      })
    }
  }
})

test('text-to-image and Seedream expose five unique step assets each', () => {
  const sources = [
    ['text-to-image-generator', read('src/app/text-to-image-generator/copy.ts')],
    ['seedream-5-0-pro', read('src/lib/seedream-5-0-pro-landing-copy.ts')],
  ]

  for (const [slug, source] of sources) {
    assert.doesNotMatch(source, new RegExp(`landing-pages/${slug}/how-to/workflow\\.webp`))
    for (let index = 1; index <= 5; index += 1) {
      assert.match(
        source,
        new RegExp(`https://assets\\.toolaze\\.com/landing-pages/${slug}/how-to/step-${index}\\.webp`),
        `${slug} should expose step ${index}`,
      )
    }
  }
})

test('the five English page families expose exactly 19 step screenshots', () => {
  const jsonAssetUrls = jsonPages.flatMap((page) => {
    const data = JSON.parse(read(`src/data/en/${page}.json`))
    return data.howToUse.steps.map((step) => step.media?.src).filter(Boolean)
  })
  const sourceAssetUrls = [
    read('src/app/text-to-image-generator/copy.ts'),
    read('src/lib/seedream-5-0-pro-landing-copy.ts'),
  ].flatMap((source) => source.match(/https:\/\/assets\.toolaze\.com\/landing-pages\/[^'"`]+\/how-to\/step-\d+\.webp/g) || [])

  assert.equal(new Set([...jsonAssetUrls, ...sourceAssetUrls]).size, 19)
})
