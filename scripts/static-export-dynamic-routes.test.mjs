import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const projectRoot = process.cwd()

function readProjectFile(path) {
  return readFileSync(join(projectRoot, path), 'utf8')
}

test('Cloudflare static export temporarily excludes dynamic admin routes', () => {
  const prebuildSource = readProjectFile('scripts/prebuild-check.js')
  const nextBuildSource = readProjectFile('scripts/next-build.js')
  const postbuildSource = readProjectFile('scripts/postbuild-restore-api.js')

  assert.match(prebuildSource, /src['"], ['"]app['"], ['"]admin/)
  assert.match(prebuildSource, /\.admin-backup/)
  assert.match(nextBuildSource, /\.admin-backup/)
  assert.match(postbuildSource, /\.admin-backup/)
})
