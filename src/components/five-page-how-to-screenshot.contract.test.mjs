import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

test('shared How To screenshot renders between section heading and numbered steps', () => {
  const source = read('src/components/blocks/HowToUse.tsx')
  assert.match(source, /HowToScreenshot/)
  assert.ok(source.indexOf('<h2') < source.indexOf('<HowToScreenshot'))
  assert.ok(source.indexOf('<HowToScreenshot') < source.indexOf('steps.map'))
})

test('all five page renderers wire a section-level workflow screenshot', () => {
  const l2 = read('src/components/blocks/ToolL2PageContent.tsx')
  const textToImage = read('src/components/AiImageGeneratorPageContent.tsx')
  const seedream = read('src/components/Seedream50ProLandingPage.tsx')
  assert.match(l2, /screenshot=\{content\.howToUse\?\.screenshot\}/)
  assert.match(textToImage, /copy\.howTo\.screenshot/)
  assert.match(seedream, /copy\.howTo\.screenshot/)
})

test('workflow screenshot URLs are stable R2 URLs for all five pages', () => {
  const sources = [
    read('src/data/en/age-filter.json'),
    read('src/data/en/photo-restoration.json'),
    read('src/data/en/watermark-remover.json'),
    read('src/app/text-to-image-generator/copy.ts'),
    read('src/lib/seedream-5-0-pro-landing-copy.ts'),
  ].join('\n')
  for (const slug of ['age-filter', 'photo-restoration', 'watermark-remover', 'text-to-image-generator', 'seedream-5-0-pro']) {
    assert.match(sources, new RegExp(`https://assets\\.toolaze\\.com/landing-pages/${slug}/how-to/workflow\\.webp`))
  }
})
