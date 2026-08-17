import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../..')

const staleLaunchCopyByLocale = {
  en: /coming soon/i,
  de: /Vorschau|vorbereitet/i,
  ja: /プレビュー|準備中/i,
  es: /Vista previa|se prepara/i,
  'zh-TW': /預覽|準備就緒前/i,
  pt: /Prévia|está sendo preparada/i,
  fr: /Aperçu|en cours de préparation/i,
  ko: /미리보기|준비되는 동안/i,
  it: /Anteprima|viene preparata/i,
}

test('Seedance 2.0 live page copy does not describe the generator as pending', async () => {
  for (const [locale, staleLaunchCopy] of Object.entries(staleLaunchCopyByLocale)) {
    const file = path.join(root, 'src/data', locale, 'seedance-2.json')
    const page = JSON.parse(await readFile(file, 'utf8'))
    const visibleLaunchCopy = [page.metadata?.title, page.metadata?.description, page.hero?.h1, page.hero?.desc]
      .filter(Boolean)
      .join(' ')

    assert.doesNotMatch(visibleLaunchCopy, staleLaunchCopy, `${locale} must not describe Seedance 2.0 as pending`)
  }
})
