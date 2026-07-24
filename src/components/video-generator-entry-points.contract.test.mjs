import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slugs = ['text-to-video-generator', 'image-to-video-generator']
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const navigationPath = join(root, 'src', 'components', 'Navigation.tsx')
const footerPath = join(root, 'src', 'components', 'Footer.tsx')
const aiToolsCopyPath = join(root, 'src', 'app', 'ai-tools', 'copy.ts')
const sitemapPath = join(root, 'src', 'app', 'sitemap.ts')
const factoryTaskPath = join(root, '_codex', 'seo-pipeline', 'tasks', '2026-07-23-image-to-video-generator', 'task.json')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function countOccurrences(source, value) {
  return source.split(value).length - 1
}

test('text-to-video and image-to-video generators expose English and localized routes', () => {
  for (const slug of slugs) {
    assert.ok(
      existsSync(join(root, 'src', 'app', slug, 'page.tsx')),
      `${slug} should expose an English route`,
    )
    assert.ok(
      existsSync(join(root, 'src', 'app', '[locale]', slug, 'page.tsx')),
      `${slug} should expose a localized route`,
    )
  }
})

test('video generator routes appear in navigation, footer, AI Tools, and sitemap', () => {
  const navigationSource = readFileSync(navigationPath, 'utf8')
  const footerSource = readFileSync(footerPath, 'utf8')
  const aiToolsCopySource = readFileSync(aiToolsCopyPath, 'utf8')
  const sitemapSource = readFileSync(sitemapPath, 'utf8')

  for (const slug of slugs) {
    assert.equal(
      countOccurrences(navigationSource, `/${slug}`),
      2,
      `${slug} should appear exactly twice in Navigation.tsx for desktop and mobile`,
    )
    assert.equal(
      countOccurrences(footerSource, `/${slug}`),
      1,
      `${slug} should appear exactly once in Footer.tsx`,
    )
    assert.match(
      aiToolsCopySource,
      new RegExp(`href:\\s*['\"]/${slug}['\"]`),
      `${slug} should have an href in the AI Tools copy`,
    )
    assert.match(
      sitemapSource,
      new RegExp(`['\"]${slug}['\"]`),
      `${slug} should be included as a sitemap route slug`,
    )
  }
})

test('all supported common translations include video generator navigation and footer labels', () => {
  const requiredKeys = [
    ['nav', 'textToVideoGenerator'],
    ['nav', 'imageToVideoGenerator'],
    ['footer', 'textToVideoGenerator'],
    ['footer', 'imageToVideoGenerator'],
  ]

  for (const locale of locales) {
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))

    for (const [section, key] of requiredKeys) {
      assert.equal(
        typeof common[section]?.[key],
        'string',
        `${locale} common.json should define ${section}.${key}`,
      )
      assert.ok(common[section][key].trim(), `${locale} ${section}.${key} should not be empty`)
    }
  }
})

test('Image to Video Factory release boundary includes every public entry point', () => {
  const task = readJson(factoryTaskPath)
  const releaseBoundary = task.releaseBoundary

  assert.equal(typeof releaseBoundary, 'string', 'Factory task should define a releaseBoundary')
  assert.match(releaseBoundary, /navigation/i, 'releaseBoundary should include navigation')
  assert.match(releaseBoundary, /footer/i, 'releaseBoundary should include footer')
  assert.match(releaseBoundary, /AI Tools/i, 'releaseBoundary should include AI Tools')
  assert.match(releaseBoundary, /sitemap/i, 'releaseBoundary should include sitemap')
  for (const entryPoint of ['navigation', 'footer', 'AI Tools', 'sitemap']) {
    assert.doesNotMatch(
      releaseBoundary,
      new RegExp(`(?:\\bno\\b|excluded|out of scope|not included)[^.!;\\n]*${entryPoint}`, 'i'),
      `releaseBoundary should not exclude ${entryPoint}`,
    )
  }
})
