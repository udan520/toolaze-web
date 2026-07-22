import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const footerSource = readFileSync('src/components/Footer.tsx', 'utf8')
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

test('footer separates image tools, video tools, image models, and video models', () => {
  assert.match(footerSource, /translations\.aiImage \|\| 'AI Image'/)
  assert.match(footerSource, /translations\.aiVideo \|\| 'AI Video'/)
  assert.match(footerSource, /translations\.aiImageModel \|\| 'AI Image Model'/)
  assert.match(footerSource, /translations\.aiVideoModel \|\| 'AI Video Model'/)

  const imageToolsBlock = footerSource.slice(
    footerSource.indexOf('{/* AI Image */}'),
    footerSource.indexOf('{/* AI Video */}'),
  )
  const videoToolsBlock = footerSource.slice(
    footerSource.indexOf('{/* AI Video */}'),
    footerSource.indexOf('{/* AI Image Model */}'),
  )
  const imageModelBlock = footerSource.slice(
    footerSource.indexOf('{/* AI Image Model */}'),
    footerSource.indexOf('{/* AI Video Model */}'),
  )
  const videoModelBlock = footerSource.slice(
    footerSource.indexOf('{/* AI Video Model */}'),
    footerSource.indexOf('{/* 基础导航链接 */}'),
  )

  assert.doesNotMatch(imageToolsBlock, /\/ai-dance-generator/)
  assert.match(imageToolsBlock, /\/ai-image-generator/)
  assert.match(imageToolsBlock, /\/text-to-image-generator/)
  assert.match(imageToolsBlock, /\/ai-image-to-image-generator/)
  assert.match(imageToolsBlock, /\/ai-hairstyle-changer/)
  assert.match(imageToolsBlock, /\/ai-hair-color-changer/)
  assert.match(videoToolsBlock, /\/ai-dance-generator/)
  assert.doesNotMatch(videoToolsBlock, /\/model\/seedance-2|\/model\/kling-3|\/model\/grok-imagine-video-1-5/)
  assert.match(imageModelBlock, /\/model\/gpt-image-2/)
  assert.match(imageModelBlock, /\/model\/seedream-5-0-pro/)
  assert.match(imageModelBlock, /\/model\/wan-2-7-image/)
  assert.match(imageModelBlock, /\/model\/nano-banana-pro/)
  assert.match(imageModelBlock, /\/model\/nano-banana-2/)
  assert.match(imageModelBlock, /\/model\/seedream-5-0-lite/)
  assert.match(imageModelBlock, /\/model\/seedream-4-5/)
  assert.match(videoModelBlock, /\/model\/grok-imagine-video-1-5/)
  assert.match(videoModelBlock, /\/model\/seedance-2-5/)
  assert.match(videoModelBlock, /\/model\/seedance-2/)
  assert.match(videoModelBlock, /\/model\/kling-3/)
})

test('footer no longer renders utility directory groups', () => {
  for (const href of ['/image-compressor', '/image-converter', '/font-generator', '/emoji-copy-and-paste']) {
    assert.equal(footerSource.includes(`getLocalizedHref('${href}')`), false, `${href} should not be rendered in the footer`)
  }

  assert.doesNotMatch(footerSource, /footerMenuData/)
  assert.doesNotMatch(footerSource, /getClientMenuItems/)
})

test('footer tool group titles exist in every supported locale', () => {
  for (const locale of locales) {
    const common = JSON.parse(readFileSync(`src/data/${locale}/common.json`, 'utf8'))
    for (const key of ['aiImage', 'aiVideo', 'aiImageModel', 'aiVideoModel']) {
      assert.equal(typeof common.footer[key], 'string', `${locale} is missing footer.${key}`)
      assert.ok(common.footer[key].length > 0, `${locale}.footer.${key} is empty`)
    }
  }
})
