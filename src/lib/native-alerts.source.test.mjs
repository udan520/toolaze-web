import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'

const root = new URL('..', import.meta.url).pathname
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs'])

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) return walk(path)
    return [path]
  })
}

function isSourceFile(path) {
  if (!sourceExtensions.has(path.slice(path.lastIndexOf('.')))) return false
  if (path.includes('.test.')) return false
  if (path.includes('/data/')) return false
  return true
}

test('product source does not use browser-native alert dialogs', () => {
  const offenders = walk(root)
    .filter(isSourceFile)
    .flatMap((path) => {
      const source = readFileSync(path, 'utf8')
      const matches = [...source.matchAll(/\b(?:window\.)?alert\s*\(/g)]
      return matches.map((match) => `${relative(root, path)}:${source.slice(0, match.index).split('\n').length}`)
    })

  assert.deepEqual(offenders, [])
})
