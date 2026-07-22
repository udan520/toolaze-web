import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('AI Tools places category tabs close to the intro copy', () => {
  const source = readFileSync('src/app/ai-tools/AiToolsPageContent.tsx', 'utf8')
  assert.match(source, /text-slate-600 text-lg mb-5 max-w-5xl/)
  assert.doesNotMatch(source, /text-slate-600 text-lg mb-10 max-w-5xl/)
})

test('AI Models removes stacked vertical padding before category tabs', () => {
  const source = readFileSync('src/app/model/ModelPageContent.tsx', 'utf8')
  assert.match(source, /bg-white pt-8 pb-3 px-6 border-b/)
  assert.match(source, /text-\[40px\] font-extrabold text-slate-900 mt-4 mb-4/)
  assert.match(source, /bg-\[#F8FAFF\] pt-3 pb-16 px-6/)
  assert.doesNotMatch(source, /text-\[40px\] font-extrabold text-slate-900 mt-8 mb-4/)
  assert.doesNotMatch(source, /bg-\[#F8FAFF\] py-16 px-6/)
})
