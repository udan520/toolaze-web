import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const srcDir = new URL('../', import.meta.url)
const docsSource = readFileSync(new URL('../../docs/ANALYTICS_TRACKING.md', import.meta.url), 'utf8')

function listSourceFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) return listSourceFiles(path)
    if (!/\.(ts|tsx|js|jsx)$/.test(path)) return []
    if (/\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/.test(path)) return []
    return [path]
  })
}

function extractCustomAnalyticsEvents(source) {
  const events = new Set()
  const patterns = [
    /trackToolazeEvent\(\s*['"]([^'"]+)['"]/g,
    /gtag\(\s*['"]event['"]\s*,\s*['"]([^'"]+)['"]/g,
    /dataLayer\.push\(\s*\{\s*event:\s*['"]([^'"]+)['"]/g,
  ]

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      events.add(match[1])
    }
  }

  return events
}

function extractDocumentedEvents(source) {
  const customEventsSection = source.slice(
    source.indexOf('## Custom Events'),
    source.indexOf('## Parameter Dictionary'),
  )

  return new Set(
    [...customEventsSection.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]),
  )
}

test('custom analytics events in production code are documented', () => {
  const eventNames = new Set()
  const documentedEvents = extractDocumentedEvents(docsSource)

  for (const file of listSourceFiles(srcDir.pathname)) {
    const source = readFileSync(file, 'utf8')
    for (const eventName of extractCustomAnalyticsEvents(source)) {
      eventNames.add(eventName)
    }
  }

  assert.ok(eventNames.size > 0)

  for (const eventName of eventNames) {
    assert.ok(
      documentedEvents.has(eventName),
      `${eventName} is missing from docs/ANALYTICS_TRACKING.md`,
    )
  }

  for (const eventName of documentedEvents) {
    assert.ok(
      eventNames.has(eventName),
      `${eventName} is documented but not found in production analytics code`,
    )
  }
})
