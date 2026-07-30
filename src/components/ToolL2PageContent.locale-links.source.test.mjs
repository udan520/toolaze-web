import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')

test('L2 recommended cards localize internal content hrefs at render time', () => {
  const recommendedCardsBlock = source.slice(
    source.indexOf('filteredRecommendedTools.map'),
    source.indexOf('tryNowText={t?.common?.tryNow', source.indexOf('filteredRecommendedTools.map')),
  )

  assert.match(source, /function getLocalizedContentHref\(/)
  assert.match(
    recommendedCardsBlock,
    /href=\{getLocalizedContentHref\(recTool\.href,\s*locale\)\}/,
    'recommended cards should route raw JSON hrefs through current locale',
  )
  assert.doesNotMatch(
    recommendedCardsBlock,
    /href=\{recTool\.href\}/,
    'recommended cards should not render raw root hrefs from JSON',
  )
})
