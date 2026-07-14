import assert from 'node:assert/strict'
import test from 'node:test'
import { proxyToPagesFunctions } from './backend-proxy.js'

test('local dev session cookie returns local test account for auth state', async () => {
  const request = new Request('http://localhost:3016/api/auth/me', {
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  })

  const response = await proxyToPagesFunctions(request, '/api/auth/me')
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.user.email, 'dianawu1202@gmail.com')
  assert.equal(payload.credits.balance, 1000)
})

test('local dev session cookie returns wrapped credit activity', async () => {
  const request = new Request('http://localhost:3016/api/credits?limit=200', {
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  })

  const response = await proxyToPagesFunctions(request, '/api/credits')
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.credits.balance, 1000)
  assert.equal(payload.credits.transactions[0].description, 'Bonus credits')
})
