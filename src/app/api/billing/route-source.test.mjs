import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('Next billing API routes proxy checkout and Creem webhook requests to the backend', () => {
  const checkoutRoute = readFileSync('src/app/api/billing/checkout/route.js', 'utf8')
  const webhookRoute = readFileSync('src/app/api/billing/creem-webhook/route.js', 'utf8')
  const confirmRoute = readFileSync('src/app/api/billing/confirm/route.js', 'utf8')

  assert.match(checkoutRoute, /proxyToPagesFunctions\(request, '\/api\/billing\/checkout'\)/)
  assert.match(webhookRoute, /proxyToPagesFunctions\(request, '\/api\/billing\/creem-webhook'\)/)
  assert.match(confirmRoute, /proxyToPagesFunctions\(request, '\/api\/billing\/confirm'\)/)
  assert.match(webhookRoute, /runtime = 'nodejs'/)
  assert.match(webhookRoute, /force-dynamic/)
  assert.match(confirmRoute, /runtime = 'nodejs'/)
  assert.match(confirmRoute, /force-dynamic/)
})
