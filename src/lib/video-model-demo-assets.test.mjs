import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW']
const videoModelPages = ['seedance-2', 'kling-3']
const expectedHeroDemos = {
  'seedance-2': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d0d55df5eef346809067197fddb1b251.png',
    source: /Character Motion Prompt/,
  },
  'kling-3': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/56bb211041b34c5f8f27d3c0208322e7.png',
    source: /Storyboard Shot Prompt/,
  },
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

test('Seedance 2.0 and Kling 3.0 model pages use their assigned Grok prompt example hero videos', () => {
  for (const locale of locales) {
    for (const page of videoModelPages) {
      const data = readJson(`src/data/${locale}/${page}.json`)
      const demo = data.heroDemoVideo
      const expected = expectedHeroDemos[page]

      assert.equal(typeof demo?.src, 'string', `${locale}/${page} heroDemoVideo.src`)
      assert.equal(demo.src, expected.src, `${locale}/${page} assigned demo asset`)
      assert.doesNotMatch(demo.src, /ai-dance-generator/, `${locale}/${page} must not reuse dance assets`)
      assert.equal(demo.width, 16, `${locale}/${page} demo width`)
      assert.equal(demo.height, 9, `${locale}/${page} demo height`)
      assert.match(demo.sourceHistory || '', /16:9/, `${locale}/${page} source history`)
      assert.match(demo.sourceHistory || '', expected.source, `${locale}/${page} assigned prompt source`)
    }
  }
})
