import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
const LOCAL_DEV_SESSION_TOKEN = 'toolaze-local-dev-session'
const LOCAL_DEV_EMAIL = 'dianawu1202@gmail.com'
const LOCAL_DEV_PASSWORD = 'test123456'
const INITIAL_LOCAL_DEV_CREDIT_BALANCE = 1000
const DEFAULT_LOCAL_DEV_STATE_FILE = '/tmp/toolaze-local-dev-state.json'

const localDevUser = {
  id: 'local-dev-dianawu1202',
  email: LOCAL_DEV_EMAIL,
  name: 'Diana Wu',
  avatarUrl: null,
}

const LOCAL_DEV_STATE_KEY = Symbol.for('toolaze.localDevAuthState')

function getLocalDevStateFile() {
  return process.env.TOOLAZE_LOCAL_DEV_STATE_FILE || DEFAULT_LOCAL_DEV_STATE_FILE
}

function normalizeLocalDevCreditState(value) {
  const source = value && typeof value === 'object' ? value : {}
  const balance = Number.isFinite(Number(source.balance))
    ? Number(source.balance)
    : INITIAL_LOCAL_DEV_CREDIT_BALANCE
  const fallback = createLocalDevCreditState(balance)
  const holds = source.holds instanceof Map
    ? source.holds
    : new Map((Array.isArray(source.holds) ? source.holds : [])
      .filter((hold) => hold?.taskId)
      .map((hold) => [String(hold.taskId), {
        taskId: String(hold.taskId),
        amount: Number(hold.amount) || 0,
        refunded: hold.refunded === true,
      }]))

  return {
    balance,
    transactions: Array.isArray(source.transactions) ? source.transactions : fallback.transactions,
    holds,
    history: Array.isArray(source.history) ? source.history : [],
  }
}

function readPersistedLocalDevCreditState() {
  try {
    const raw = readFileSync(getLocalDevStateFile(), 'utf8')
    return normalizeLocalDevCreditState(JSON.parse(raw))
  } catch {
    return null
  }
}

function serializeLocalDevCreditState(state) {
  return {
    balance: state.balance,
    transactions: state.transactions,
    holds: Array.from(state.holds.values()),
    history: state.history,
  }
}

function persistLocalDevCreditState(state) {
  try {
    const stateFile = getLocalDevStateFile()
    mkdirSync(dirname(stateFile), { recursive: true })
    writeFileSync(stateFile, `${JSON.stringify(serializeLocalDevCreditState(state), null, 2)}\n`, 'utf8')
  } catch {
    // Local dev persistence should never block auth or generation flows.
  }
}

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
    history: [],
  }
}

function getLocalDevCreditState() {
  if (!globalThis[LOCAL_DEV_STATE_KEY]) {
    globalThis[LOCAL_DEV_STATE_KEY] = readPersistedLocalDevCreditState() || createLocalDevCreditState()
  }

  const state = normalizeLocalDevCreditState(globalThis[LOCAL_DEV_STATE_KEY])
  globalThis[LOCAL_DEV_STATE_KEY] = state

  return state
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

function createLocalDevHistoryId() {
  return `local-dev-history-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeHistoryReferenceImageUrl(url) {
  const imageUrl = typeof url === 'string' ? url.trim() : ''
  if (!imageUrl) return ''
  if (imageUrl.startsWith('/')) return imageUrl.startsWith('//') || imageUrl.length === 1 ? '' : imageUrl

  try {
    const parsed = new URL(imageUrl)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? imageUrl : ''
  } catch {
    return ''
  }
}

function normalizeLocalDevHistoryInputUrls(inputUrls) {
  return Array.isArray(inputUrls)
    ? inputUrls.map(normalizeHistoryReferenceImageUrl).filter(Boolean)
    : []
}

export function createLocalDevHistoryItem(item) {
  const state = getLocalDevCreditState()
  const outputUrl = String(item?.outputUrl || '').trim()
  const prompt = String(item?.prompt || '').trim()
  const model = String(item?.model || '').trim()

  if (!outputUrl.startsWith('http')) {
    return { ok: false, status: 400, error: 'Output URL is required.' }
  }
  if (!prompt) {
    return { ok: false, status: 400, error: 'Prompt is required.' }
  }
  if (!model) {
    return { ok: false, status: 400, error: 'Model is required.' }
  }

  const historyItem = {
    id: createLocalDevHistoryId(),
    mediaType: item?.mediaType === 'video' ? 'video' : 'image',
    model,
    prompt,
    outputUrl,
    inputUrls: normalizeLocalDevHistoryInputUrls(item?.inputUrls),
    aspectRatio: item?.aspectRatio || null,
    resolution: item?.resolution || null,
    outputFormat: item?.outputFormat || null,
    toolSlug: String(item?.toolSlug || '').trim() || null,
    toolLabel: String(item?.toolLabel || '').trim() || null,
    sourcePath: String(item?.sourcePath || '').trim() || null,
    createdAt: new Date().toISOString(),
  }

  state.history.unshift(historyItem)
  persistLocalDevCreditState(state)
  return { ok: true, status: 201, item: historyItem }
}

export function listLocalDevHistory(limit = 100) {
  const state = getLocalDevCreditState()
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 200))
  return state.history.slice(0, safeLimit)
}

export function deleteLocalDevHistoryItem(itemId) {
  const state = getLocalDevCreditState()
  const id = String(itemId || '').trim()
  const before = state.history.length
  state.history = state.history.filter((item) => item.id !== id)
  const deleted = before - state.history.length
  if (deleted > 0) persistLocalDevCreditState(state)

  return {
    ok: deleted > 0,
    deleted,
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
  persistLocalDevCreditState(state)

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
  persistLocalDevCreditState(state)

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
  persistLocalDevCreditState(state)

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
  persistLocalDevCreditState(globalThis[LOCAL_DEV_STATE_KEY])
}

export function resetLocalDevHistoryForTests() {
  const state = getLocalDevCreditState()
  state.history = []
  persistLocalDevCreditState(state)
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
