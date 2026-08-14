import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./route.js', import.meta.url), 'utf8')

test('published page demo assignments route proxies to Cloudflare Pages Functions', () => {
  assert.match(source, /proxyToPagesFunctions\(request, '\/api\/page-demo-assignments\/published'\)/)
  assert.match(source, /export async function GET\(request\)/)
  assert.match(source, /export async function OPTIONS\(request\)/)
})
