import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const componentSource = readFileSync(join(root, 'src', 'components', 'blocks', 'ModelComparisonTable.tsx'), 'utf8')

const unsupportedContinuationPhrases = [
  'No first/last-frame or continuation control.',
  'Keine Erst-/Letztes-Frame- oder Fortsetzungssteuerung.',
  'Sin control de primer/último fotograma ni continuación.',
  'Pas de contrôle première/dernière image ni de continuation.',
  'Nessun controllo primo/ultimo fotogramma o continuità.',
  '最初/最後フレームや継続制御はなし。',
  '첫/마지막 프레임이나 연속 제어 없음.',
  'Sem controle de primeiro/último quadro ou continuação.',
  '不支援首/尾幀或延續控制。',
]

const wanComparisonFiles = [
  ...['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'].flatMap((locale) =>
    ['wan-2-5-ai-video-generator', 'wan-2-6-ai-video-generator', 'wan-2-7-ai-video-generator'].map((slug) =>
      join(root, 'src', 'data', locale, `${slug}.json`)
    )
  ),
  ...[
    '2026-07-30-wan-2-5-ai-video-generator',
    '2026-08-03-wan-2-6-ai-video-generator',
    '2026-08-01-wan-2-7-ai-video-generator',
  ].flatMap((taskId) =>
    ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'].map((locale) =>
      join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`)
    )
  ),
]

test('model comparison table renders exact support values as colored SVG icons', () => {
  assert.match(componentSource, /function BooleanComparisonIcon/, 'support values should use a dedicated icon renderer')
  assert.match(componentSource, /<svg aria-hidden="true"/, 'support icons should be SVG, not plain text')
  assert.match(componentSource, /bg-emerald-50 text-emerald-600/, 'supported values should render as green checks')
  assert.match(componentSource, /bg-rose-50 text-rose-500/, 'unsupported values should render as red crosses')
  assert.doesNotMatch(componentSource, /✅|❌/, 'the table should not rely on emoji check or cross glyphs')
  assert.match(componentSource, /renderComparisonValue\(row\.baseline\)/, 'baseline cells should pass through icon rendering')
  assert.match(componentSource, /renderComparisonValue\(row\.middle\)/, 'middle cells should pass through icon rendering')
  assert.match(componentSource, /renderComparisonValue\(row\.target\)/, 'target cells should pass through icon rendering')
})

test('Wan same-family comparison unsupported cells stay icon-ready across public data and SEO Factory content', () => {
  for (const file of wanComparisonFiles) {
    const source = readFileSync(file, 'utf8')

    for (const phrase of unsupportedContinuationPhrases) {
      assert.doesNotMatch(source, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${file} should use a pure localized No value instead of an unsupported explanatory sentence`)
    }
  }
})
