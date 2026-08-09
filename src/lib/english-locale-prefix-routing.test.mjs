import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

import nextConfig from '../../next.config.js'

const projectRoot = process.cwd()
const localizedAppRoot = join(projectRoot, 'src', 'app', '[locale]')

const auditedRenderableRoutes = [
  'page.tsx',
  'about/page.tsx',
  'acceptable-use/page.tsx',
  'contact/page.tsx',
  'credits/page.tsx',
  'earn-credits/page.tsx',
  'emoji-copy-and-paste/page.tsx',
  'font-generator/page.tsx',
  'history/page.tsx',
  'image-compressor/page.tsx',
  'image-converter/page.tsx',
  'photo-restoration/page.tsx',
  'pricing/page.tsx',
  'privacy/page.tsx',
  'refund-policy/page.tsx',
  'terms/page.tsx',
  'watermark-remover/page.tsx',
]

function readLocalizedRoute(relativePath) {
  return readFileSync(join(localizedAppRoot, relativePath), 'utf8')
}

function walkPageFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory()
      ? walkPageFiles(path)
      : name === 'page.tsx' ? [path] : []
  })
}

function excludesEnglishStaticParams(source) {
  return /\.filter\(\s*\(?\s*(?:locale|item)\s*\)?\s*=>\s*(?:locale|item)(?:\.code)?\s*!==\s*['"]en['"]\s*\)/.test(source)
    || /const\s+LOCALIZED_LOCALES\s*=\s*\[[^\]]*\]/s.test(source)
}

test('standard Next.js runtime permanently redirects legacy English prefixes', async () => {
  const redirects = await nextConfig.redirects()

  assert.ok(redirects.some((rule) => (
    rule.source === '/en'
    && rule.destination === '/'
    && rule.permanent === true
  )))
  assert.ok(redirects.some((rule) => (
    rule.source === '/en/:path*'
    && rule.destination === '/:path*'
    && rule.permanent === true
  )))
})

test('audited localized pages do not generate English-prefixed static pages', () => {
  for (const relativePath of auditedRenderableRoutes) {
    const source = readLocalizedRoute(relativePath)
    assert.ok(
      excludesEnglishStaticParams(source),
      `${relativePath} must exclude en from generateStaticParams()`,
    )
  }
})

test('every localized static route excludes English parameters', () => {
  for (const file of walkPageFiles(localizedAppRoot)) {
    const relativePath = file.slice(localizedAppRoot.length + 1)
    const source = readFileSync(file, 'utf8')
    if (!source.includes('generateStaticParams')) continue

    assert.ok(
      excludesEnglishStaticParams(source),
      `${relativePath} must exclude en from generateStaticParams()`,
    )
  }
})

test('global project rules forbid English locale prefixes and require a fallback redirect', () => {
  const rules = readFileSync(join(projectRoot, 'AGENTS.md'), 'utf8')
  assert.match(rules, /英文默认语言的公开页面 URL 不得包含 `\/en` 前缀/)
  assert.match(rules, /`\/en`[^\n]*永久重定向[^\n]*无前缀/)
})
