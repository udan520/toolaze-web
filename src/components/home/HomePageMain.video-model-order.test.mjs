import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./HomePageMain.tsx', import.meta.url), 'utf8')

test('homepage places Seedance 2.5 first in dashboard and video model surfaces', () => {
  assert.match(source, /const dashboardModelCards = \['seedance-2-5', 'seedance-2'/)
  assert.match(source, /const videoModelPriority = \['seedance-2-5', 'seedance-2'/)
  assert.match(source, /const sortedAiVideoTools = \[\.\.\.aiVideoTools\]\.sort/)
  assert.match(source, /'seedance-2-5': \{ src: '\/model-logos\/bytedance\.svg'/)
})
