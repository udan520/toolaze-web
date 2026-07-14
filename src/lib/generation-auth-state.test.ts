import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getCachedGenerationAuthState,
  getGenerationAuthStateFromAuthMeResult,
} from './generation-auth-state'

function createWindowWithSnapshot(snapshot: unknown) {
  return {
    sessionStorage: {
      getItem(key: string) {
        return key === 'toolaze.authSnapshot' ? JSON.stringify(snapshot) : null
      },
    },
  }
}

test('treats cached signed-in user with zero credits as credits exhausted', () => {
  const win = createWindowWithSnapshot({
    user: { id: 'local-user', email: 'dianawu1202@gmail.com' },
    credits: { balance: 0 },
  })

  assert.deepEqual(getCachedGenerationAuthState(10, win), {
    isSignedIn: true,
    creditsExhausted: true,
  })
})

test('keeps cached signed-in user with enough credits eligible for generation', () => {
  const win = createWindowWithSnapshot({
    user: { id: 'local-user', email: 'dianawu1202@gmail.com' },
    credits: { balance: 20 },
  })

  assert.deepEqual(getCachedGenerationAuthState(10, win), {
    isSignedIn: true,
    creditsExhausted: false,
  })
})

test('keeps missing cached user as signed out', () => {
  const win = createWindowWithSnapshot({
    credits: { balance: 0 },
  })

  assert.deepEqual(getCachedGenerationAuthState(10, win), {
    isSignedIn: false,
    creditsExhausted: false,
  })
})

test('treats explicit auth rejection as signed out even when cache exists', () => {
  assert.deepEqual(
    getGenerationAuthStateFromAuthMeResult(
      401,
      {},
      10,
      { isSignedIn: true, creditsExhausted: false },
    ),
    {
      isSignedIn: false,
      creditsExhausted: false,
    },
  )
})

test('keeps cached auth state during transient auth check failures', () => {
  assert.deepEqual(
    getGenerationAuthStateFromAuthMeResult(
      500,
      {},
      10,
      { isSignedIn: true, creditsExhausted: false },
    ),
    {
      isSignedIn: true,
      creditsExhausted: false,
    },
  )
})

test('uses live auth balance when auth check succeeds', () => {
  assert.deepEqual(
    getGenerationAuthStateFromAuthMeResult(
      200,
      { user: { id: 'local-user' }, credits: { balance: 5 } },
      10,
      { isSignedIn: true, creditsExhausted: false },
    ),
    {
      isSignedIn: true,
      creditsExhausted: true,
    },
  )
})
