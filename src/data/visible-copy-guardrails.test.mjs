import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

import { findVisibleCopyGuardrailIssues } from './visible-copy-guardrails.mjs'

const root = process.cwd()

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function readyFactoryContentRecords() {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  const records = []

  for (const task of queue.tasks) {
    const contentDir = join(root, '_codex', 'seo-pipeline', 'tasks', task.taskId, 'content')
    if (!existsSync(contentDir)) continue

    for (const filename of readdirSync(contentDir).filter((name) => name.endsWith('.json'))) {
      const locale = filename.replace(/\.json$/, '')
      records.push({
        source: `_codex/seo-pipeline/tasks/${task.taskId}/content/${filename}`,
        content: readJson(join(contentDir, filename)),
      })

      const publicDataPath = join(root, 'src', 'data', locale, `${task.slug}.json`)
      if (existsSync(publicDataPath)) {
        records.push({
          source: `src/data/${locale}/${task.slug}.json`,
          content: readJson(publicDataPath),
        })
      }
    }
  }

  return records
}

test('visible-copy guardrails catch internal model configuration phrasing', () => {
  const issues = findVisibleCopyGuardrailIssues(
    {
      faq: [
        {
          q: 'Does Wan 2.6 create sound?',
          a: 'Toolaze marks Wan 2.6 as native-audio capable in the current integration.',
        },
      ],
    },
    { source: 'fixture' },
  )

  assert.ok(
    issues.some((issue) => issue.rule === 'toolaze-internal-model-labeling' && issue.path === 'faq[0].a'),
    'guardrail should catch Toolaze-internal model labeling in visible FAQ copy',
  )
  assert.ok(
    issues.some((issue) => issue.rule === 'internal-implementation-language' && issue.path === 'faq[0].a'),
    'guardrail should catch current integration language in visible FAQ copy',
  )
})

test('visible-copy guardrails ignore structural and source-history fields', () => {
  const issues = findVisibleCopyGuardrailIssues(
    {
      href: '/model/wan-2-6-ai-video-generator',
      sourceHistory: 'Toolaze marks Wan 2.6 as native-audio capable in the current integration.',
      heroDemoVideo: {
        src: 'https://example.com/provider-route-demo.mp4',
        poster: 'https://example.com/schema-only-poster.webp',
      },
    },
    { source: 'fixture' },
  )

  assert.deepEqual(issues, [])
})

test('ready SEO Factory and public landing-page copy pass visible-copy guardrails', () => {
  const issues = readyFactoryContentRecords().flatMap(({ source, content }) =>
    findVisibleCopyGuardrailIssues(content, { source }),
  )

  assert.deepEqual(
    issues,
    [],
    issues
      .slice(0, 20)
      .map((issue) => `${issue.source} ${issue.path} [${issue.rule}]: ${issue.match}`)
      .join('\n'),
  )
})
