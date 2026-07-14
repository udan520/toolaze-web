const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
const LOCAL_DEV_SESSION_TOKEN = 'toolaze-local-dev-session'
const LOCAL_DEV_EMAIL = 'dianawu1202@gmail.com'
const LOCAL_DEV_PASSWORD = 'test123456'
const INITIAL_LOCAL_DEV_CREDIT_BALANCE = 1000

const localDevUser = {
  id: 'local-dev-dianawu1202',
  email: LOCAL_DEV_EMAIL,
  name: 'Diana Wu',
  avatarUrl: null,
}

const LOCAL_DEV_STATE_KEY = Symbol.for('toolaze.localDevAuthState')

function createLocalDevCreditTransaction({
  id = `local-dev-credit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  amount,
  type,
  description,
  balanceAfter,
  createdAt = new Date().toISOString(),
}) {
  return {
    id,
    amount,
    type,
    description,
    reason: type === 'use'
      ? 'image_generation'
      : type === 'refund'
        ? 'image_generation_refund'
        : 'bonus',
    balanceAfter,
    createdAt,
    expiresAt: null,
  }
}

function createLocalDevCreditState(balance = INITIAL_LOCAL_DEV_CREDIT_BALANCE) {
  return {
    balance,
    transactions: [createLocalDevCreditTransaction({
      id: 'local-dev-bonus-credits',
      amount: balance,
      type: 'bonus',
      description: 'Bonus credits',
      balanceAfter: balance,
      createdAt: '2026-07-13T00:00:00.000Z',
    })],
    holds: new Map(),
  }
}

function getLocalDevCreditState() {
  if (!globalThis[LOCAL_DEV_STATE_KEY]) {
    globalThis[LOCAL_DEV_STATE_KEY] = createLocalDevCreditState()
  }

  return globalThis[LOCAL_DEV_STATE_KEY]
}

export function getLocalDevCreditSummary() {
  const state = getLocalDevCreditState()

  return {
    balance: state.balance,
    transactions: state.transactions.slice(0, 10),
  }
}

export function isLocalhost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]'
}

export function normalizeLocalDevEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

export function isValidLocalDevCredential(email, password) {
  return normalizeLocalDevEmail(email) === LOCAL_DEV_EMAIL && password === LOCAL_DEV_PASSWORD
}

export function getLocalDevAuthState() {
  return {
    ok: true,
    user: localDevUser,
    credits: getLocalDevCreditSummary(),
  }
}

export function consumeLocalDevCredits(amount, description = 'Image generation') {
  const state = getLocalDevCreditState()

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive integer')
  }

  if (state.balance < amount) {
    return {
      ok: false,
      credits: getLocalDevCreditSummary(),
      required: amount,
    }
  }

  state.balance -= amount
  state.transactions.unshift(createLocalDevCreditTransaction({
    amount: -amount,
    type: 'use',
    description,
    balanceAfter: state.balance,
  }))

  return {
    ok: true,
    credits: getLocalDevCreditSummary(),
    required: amount,
  }
}

export function refundLocalDevCredits(amount, description = 'Image generation refund') {
  const state = getLocalDevCreditState()

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive integer')
  }

  state.balance += amount
  state.transactions.unshift(createLocalDevCreditTransaction({
    amount,
    type: 'refund',
    description,
    balanceAfter: state.balance,
  }))

  return {
    ok: true,
    credits: getLocalDevCreditSummary(),
    refunded: amount,
  }
}

export function registerLocalDevCreditHold(taskId, amount) {
  const state = getLocalDevCreditState()

  if (!taskId || !Number.isInteger(amount) || amount <= 0) return null

  state.holds.set(String(taskId), {
    taskId: String(taskId),
    amount,
    refunded: false,
  })

  return {
    provider: 'local-dev',
    taskId: String(taskId),
    requiredCredits: amount,
  }
}

export function refundLocalDevCreditHold(taskId, description = 'Image generation refund') {
  const state = getLocalDevCreditState()
  const hold = state.holds.get(String(taskId || ''))

  if (!hold || hold.refunded) {
    return {
      ok: true,
      credits: getLocalDevCreditSummary(),
      refunded: 0,
    }
  }

  hold.refunded = true
  state.holds.set(hold.taskId, hold)
  return refundLocalDevCredits(hold.amount, description)
}

export function resetLocalDevCreditsForTests(balance = INITIAL_LOCAL_DEV_CREDIT_BALANCE) {
  globalThis[LOCAL_DEV_STATE_KEY] = createLocalDevCreditState(balance)
}

export function buildLocalDevSessionCookie() {
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(LOCAL_DEV_SESSION_TOKEN)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ].join('; ')
}

export function buildClearSessionCookie() {
  return [
    `${SESSION_COOKIE_NAME}=`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    'Max-Age=0',
  ].join('; ')
}

export function hasLocalDevSession(request) {
  const cookie = request.headers.get('cookie') || ''
  return cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part === `${SESSION_COOKIE_NAME}=${encodeURIComponent(LOCAL_DEV_SESSION_TOKEN)}`)
}

export function getLocalDevSessionToken() {
  return LOCAL_DEV_SESSION_TOKEN
}
