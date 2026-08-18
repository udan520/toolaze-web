import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const read = (path) => readFileSync(join(root, path), 'utf8')
const signupCreditPatterns = {
  en: /20 free credits/i,
  de: /20 (?:kostenlose )?Credits/i,
  ja: /20無料クレジット/,
  es: /20 créditos gratis/i,
  'zh-TW': /20[^\n]*(?:免費[^\n]*)?credits/i,
  pt: /20 créditos grátis/i,
  fr: /20 crédits gratuits/i,
  ko: /무료 크레딧 20개/,
  it: /20 crediti gratuiti/i,
}
const unsupportedNoSignup = /No Sign-Up|no sign up is needed|ohne Anmeldung|登録不要|sin registro|無需註冊|免註冊|sem cadastro|sans inscription|가입 없음|가입 불필요|senza registrazione/i

test('three JSON page families are localized, substantial, and free of unsupported trust claims', () => {
  for (const locale of locales) {
    for (const slug of ['age-filter', 'photo-restoration', 'watermark-remover']) {
      const content = JSON.parse(read(`src/data/${locale}/${slug}.json`))
      const visible = JSON.stringify(content)
      assert.ok(visible.length > 3500, `${locale}/${slug} should have substantial decision-support copy`)
      assert.equal(content.howToUse.steps.length, 3, `${locale}/${slug} should keep a focused three-step workflow`)
      assert.match(content.howToUse.screenshot.src, new RegExp(`/landing-pages/${slug}/how-to/workflow\\.webp$`))
      assert.doesNotMatch(visible, /4\.9\/5|10K\+|No Account, No Limit|No daily cap|not stored permanently|perfect|guaranteed/i)
      assert.ok((content.faq || []).length <= 6, `${locale}/${slug} FAQ should stay focused`)
    }
  }
})

test('free claims disclose the 20-credit sign-up condition in every locale', () => {
  for (const locale of locales) {
    for (const slug of ['age-filter', 'photo-restoration', 'watermark-remover']) {
      const visible = read(`src/data/${locale}/${slug}.json`)
      assert.match(visible, signupCreditPatterns[locale], `${locale}/${slug} should disclose signup credits`)
      assert.doesNotMatch(visible, unsupportedNoSignup, `${locale}/${slug} should not promise no-sign-up generation`)
    }
  }

  const textToImage = read('src/app/text-to-image-generator/copy.ts')
  for (const locale of locales) assert.match(textToImage, signupCreditPatterns[locale])
  assert.doesNotMatch(textToImage, unsupportedNoSignup)
})

test('watermark copy contains a visible rights boundary in every locale', () => {
  const rightsPatterns = {
    en: /own|permission|rights/i,
    de: /Rechte|Erlaubnis/i,
    ja: /権利|許可/,
    es: /derechos|permiso/i,
    'zh-TW': /權利|授權/,
    pt: /direitos|permissão/i,
    fr: /droits|autorisation/i,
    ko: /권리|허가/,
    it: /diritti|autorizzazione/i,
  }
  for (const locale of locales) {
    const visible = read(`src/data/${locale}/watermark-remover.json`)
    assert.match(visible, rightsPatterns[locale])
  }
})

test('text-to-image and Seedream Pro copy are live, distinct, localized, and bounded by actual controls', () => {
  const textToImage = read('src/app/text-to-image-generator/copy.ts')
  const seedream = read('src/lib/seedream-5-0-pro-landing-copy.ts')
  assert.match(textToImage, /Text-only|text-only|reference image/i)
  assert.match(textToImage, /https:\/\/assets\.toolaze\.com\/landing-pages\/text-to-image-generator\/how-to\/workflow\.webp/)
  assert.match(seedream, /https:\/\/assets\.toolaze\.com\/landing-pages\/seedream-5-0-pro\/how-to\/workflow\.webp/)
  assert.match(seedream, /up to 10 reference images/i)
  assert.match(seedream, /1K|2K/)
  assert.doesNotMatch(seedream, /Coming Soon|Preview workflow|before the Pro launch|Pro 上線前|Pro 출시 전|avant Pro|prima di Pro/i)
})

test('sitemap has an explicit 2026-08-19 lastmod for each rewritten canonical path', () => {
  const sitemap = read('src/app/sitemap.ts')
  for (const path of ['/age-filter', '/photo-restoration', '/watermark-remover', '/text-to-image-generator', '/model/seedream-5-0-pro']) {
    assert.match(sitemap, new RegExp(`['\"]${path.replaceAll('/', '\\/')}['\"]:\\s*['\"]2026-08-19['\"]`))
  }
})
