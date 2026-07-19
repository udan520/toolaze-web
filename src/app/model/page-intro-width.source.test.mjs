import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const checkedPageIntros = [
  {
    file: 'src/app/model/ModelPageContent.tsx',
    forbidden: 'text-slate-600 text-lg leading-relaxed max-w-3xl',
    required: 'text-slate-600 text-lg leading-relaxed max-w-5xl',
  },
  {
    file: 'src/app/ai-tools/AiToolsPageContent.tsx',
    forbidden: 'text-slate-600 text-lg mb-10 max-w-3xl',
    required: 'text-slate-600 text-lg mb-10 max-w-5xl',
  },
  {
    file: 'src/components/HistoryPageClient.tsx',
    forbidden: 'mt-2 max-w-2xl text-sm leading-6 text-slate-600',
    required: 'mt-2 max-w-5xl text-sm leading-6 text-slate-600',
  },
  {
    file: 'src/components/EarnCreditsPageClient.tsx',
    forbidden: 'mt-3 max-w-2xl text-base leading-7 text-slate-600',
    required: 'mt-3 max-w-none text-base leading-7 text-slate-600',
  },
  {
    file: 'src/components/home/HomePageMain.tsx',
    forbidden: 'text-slate-600 max-w-3xl text-base md:text-lg leading-relaxed',
    required: 'text-slate-600 max-w-5xl text-base md:text-lg leading-relaxed',
  },
]

test('left-aligned page intro copy uses the available desktop width', () => {
  for (const { file, forbidden, required } of checkedPageIntros) {
    const source = readFileSync(file, 'utf8')

    assert.equal(
      source.includes(forbidden),
      false,
      `${file} still narrows a left-aligned page intro too early`,
    )
    assert.equal(
      source.includes(required),
      true,
      `${file} should use the wider page intro width class`,
    )
  }
})

test('global UI guide documents the page intro width rule', () => {
  const guide = readFileSync('docs/UI_STYLE_GUIDE.md', 'utf8')

  assert.match(guide, /页面说明文字宽度/)
  assert.match(guide, /max-w-5xl/)
  assert.match(guide, /右侧仍有明显空白/)
  assert.match(guide, /提前换行/)
})
