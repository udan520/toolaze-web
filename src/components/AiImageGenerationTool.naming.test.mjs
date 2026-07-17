import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const projectRoot = process.cwd()
const srcDir = join(projectRoot, 'src')
const newComponentPath = join(srcDir, 'components/AiImageGenerationTool.tsx')
const oldComponentPath = join(srcDir, 'components/NanoBananaTool.tsx')

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

test('shared AI image generator component uses the generic component name', () => {
  assert.equal(existsSync(newComponentPath), true)
  assert.equal(existsSync(oldComponentPath), false)

  const source = readFileSync(newComponentPath, 'utf8')
  assert.match(source, /interface AiImageGenerationToolProps/)
  assert.match(source, /export default function AiImageGenerationTool/)
})

test('production code imports the shared image generator from the generic path', () => {
  for (const file of listSourceFiles(srcDir)) {
    const source = readFileSync(file, 'utf8')
    assert.doesNotMatch(source, /@\/components\/NanoBananaTool/, file)
    assert.doesNotMatch(source, /\b<NanoBananaTool\b/, file)
  }
})
