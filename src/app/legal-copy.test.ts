import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'
import { BROWSER_LOCALE_REDIRECT_SCRIPT } from '../lib/browser-locale-redirect'
import { getPreferredLocalizedUrl } from '../lib/site-language-switch'

const projectRoot = process.cwd()
const supportedLocales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'] as const
const copyRoots = ['src/app', 'src/components', 'src/data']
const bannedCopyPatterns = [
  /locally in your browser/i,
  /local processing/i,
  /local ai/i,
  /never leave(?:s)? your device/i,
  /never leave(?:s)? your computer/i,
  /files? never leave/i,
  /never uploaded/i,
  /never transmitted/i,
  /nothing is sent to our servers/i,
  /do not upload/i,
  /no server uploads?/i,
  /stored locally/i,
  /stays local/i,
  /happens locally/i,
  /100%\s*(?:private|privacy|local)/i,
  /run(?:s)? entirely in your browser/i,
  /works? entirely in your browser/i,
  /entirely in your browser/i,
  /all .* happens in your browser/i,
  /browser-based compressor/i,
]

function readProjectFile(path: string) {
  return readFileSync(join(projectRoot, path), 'utf8')
}

function readJson(path: string) {
  return JSON.parse(readProjectFile(path))
}

function walkFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolute = join(directory, entry)
    const stats = statSync(absolute)
    if (stats.isDirectory()) return walkFiles(absolute)
    return [absolute]
  })
}

function visibleCopyFiles() {
  return copyRoots
    .flatMap((root) => walkFiles(join(projectRoot, root)))
    .filter((file) => /\.(tsx|json)$/.test(file))
    .filter((file) => !file.endsWith('.test.tsx') && !file.endsWith('.test.ts'))
}

test('public site copy no longer promises browser-only or no-upload processing', () => {
  const violations = visibleCopyFiles().flatMap((file) => {
    const content = readFileSync(file, 'utf8')
    return bannedCopyPatterns
      .filter((pattern) => pattern.test(content))
      .map((pattern) => `${relative(projectRoot, file)} -> ${pattern}`)
  })

  assert.deepEqual(violations, [])
})

test('legal policy pages exist and cover AI generation, credits, refunds, and acceptable use', () => {
  const requiredPages = [
    'src/app/privacy/page.tsx',
    'src/app/terms/page.tsx',
    'src/app/refund-policy/page.tsx',
    'src/app/acceptable-use/page.tsx',
  ]

  for (const page of requiredPages) {
    assert.equal(existsSync(join(projectRoot, page)), true, `${page} should exist`)
  }

  const privacy = readProjectFile('src/app/privacy/page.tsx')
  assert.match(privacy, /AI generation/i)
  assert.match(privacy, /prompts/i)
  assert.match(privacy, /uploaded images/i)
  assert.match(privacy, /third-party AI providers/i)
  assert.match(privacy, /Creem/i)
  assert.match(privacy, /credits/i)

  const terms = readProjectFile('src/app/terms/page.tsx')
  assert.match(terms, /credits/i)
  assert.match(terms, /failed generation/i)
  assert.match(terms, /commercial use/i)
  assert.match(terms, /Acceptable Use Policy/i)
  assert.match(terms, /NSFW|sexual/i)
  assert.match(terms, /third-party model/i)

  const refund = readProjectFile('src/app/refund-policy/page.tsx')
  assert.match(refund, /unused credits/i)
  assert.match(refund, /used credits/i)
  assert.match(refund, /failed generation/i)
  assert.match(refund, /12 months/i)
  assert.match(refund, /support@toolaze\.com/i)

  const acceptableUse = readProjectFile('src/app/acceptable-use/page.tsx')
  assert.match(acceptableUse, /NSFW/i)
  assert.match(acceptableUse, /sexual/i)
  assert.match(acceptableUse, /illegal/i)
  assert.match(acceptableUse, /deepfake|impersonation/i)
  assert.match(acceptableUse, /minors/i)
  assert.match(acceptableUse, /copyright/i)
})

test('footer, sitemap, and locale redirects expose the required legal routes', () => {
  const footer = readProjectFile('src/components/Footer.tsx')
  assert.match(footer, /\/refund-policy/)
  assert.match(footer, /\/acceptable-use/)

  const sitemap = readProjectFile('src/app/sitemap.ts')
  assert.match(sitemap, /refund-policy/)
  assert.match(sitemap, /acceptable-use/)

  assert.equal(getPreferredLocalizedUrl('/refund-policy', 'de'), '/refund-policy')
  assert.equal(getPreferredLocalizedUrl('/acceptable-use', 'zh-TW'), '/acceptable-use')
  assert.match(BROWSER_LOCALE_REDIRECT_SCRIPT, /refund-policy/)
  assert.match(BROWSER_LOCALE_REDIRECT_SCRIPT, /acceptable-use/)
})

test('localized common legal copy removes old local-only promises', () => {
  for (const locale of supportedLocales) {
    const common = readJson(`src/data/${locale}/common.json`)
    const legalCopy = JSON.stringify({
      footer: common.footer,
      about: common.about,
      privacy: common.privacy,
      terms: common.terms,
      breadcrumb: common.breadcrumb,
    })

    for (const pattern of bannedCopyPatterns) {
      assert.doesNotMatch(legalCopy, pattern, `${locale} still contains ${pattern}`)
    }

    assert.match(legalCopy, /AI|KI|IA|AI|人工|인공|providers|payment|credits|退款|払い戻し|Rückerstattung|reembolso|rimborso/i)
  }
})
