import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const projectRoot = process.cwd()

function readProjectFile(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), 'utf8')
}

test('Grok video model is registered in the minimal shared entry points', () => {
  const seoLoader = readProjectFile('src/lib/seo-loader.ts')
  const siteLanguageSwitch = readProjectFile('src/lib/site-language-switch.ts')
  const sitemap = readProjectFile('src/app/sitemap.ts')
  const localizedModelPage = readProjectFile('src/app/[locale]/model/[model]/page.tsx')

  assert.match(seoLoader, /VIDEO_MODEL_L2S = \[[^\]]*'grok-imagine-video-1-5'/)
  assert.match(seoLoader, /importL2FlatJson\('grok-imagine-video-1-5', normalizedLocale\)/)
  assert.match(seoLoader, /@\/data\/en\/grok-imagine-video-1-5\.json/)

  assert.match(siteLanguageSwitch, /'ai-video-generator': ALL_LOCALE_CODES/)
  assert.match(siteLanguageSwitch, /'grok-imagine-video-1-5': ALL_LOCALE_CODES/)

  assert.match(sitemap, /MODEL_PAGES = \[[^\]]*'grok-imagine-video-1-5'/)
  assert.match(sitemap, /LOCALIZED_MODEL_SLUGS = \[[^\]]*'grok-imagine-video-1-5'/)
  assert.match(sitemap, /locale === 'en' \? '\/ai-video-generator' : `\/\$\{locale\}\/ai-video-generator`/)
  assert.match(sitemap, /tool !== 'grok-imagine-video-1-5'/)

  assert.match(localizedModelPage, /'grok-imagine-video-1-5': 'grok-imagine-video-1-5'/)
})
