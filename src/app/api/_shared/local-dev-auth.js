import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
const LOCAL_DEV_SESSION_TOKEN = 'toolaze-local-dev-session'
const LOCAL_DEV_EMAIL = 'dianawu1202@gmail.com'
const LOCAL_DEV_PASSWORD = 'test123456'
const INITIAL_LOCAL_DEV_CREDIT_BALANCE = 1000
const DEFAULT_LOCAL_DEV_STATE_FILE = '/tmp/toolaze-local-dev-state.json'
const LOCAL_DEV_CHECK_IN_REWARDS = [5, 10, 15, 20, 25, 30, 50]
const LOCAL_DEV_X_POST_REWARD_CREDITS = 10
const LOCAL_DEV_REWARD_EVENT_REASONS = [
  'new_user_bonus',
  'daily_checkin',
  'x_post_reward',
  'admin_grant',
  'bonus',
]

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
    rewardCheckIn: normalizeLocalDevCheckInState(source.rewardCheckIn),
    rewardXPosts: Array.isArray(source.rewardXPosts) ? source.rewardXPosts : [],
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
    rewardCheckIn: state.rewardCheckIn,
    rewardXPosts: state.rewardXPosts,
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
  reason,
}) {
  return {
    id,
    amount,
    type,
    description,
    reason: reason || (type === 'use'
      ? 'image_generation'
      : type === 'refund'
        ? 'image_generation_refund'
        : 'bonus'),
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
      reason: 'new_user_bonus',
      balanceAfter: balance,
      createdAt: '2026-07-13T00:00:00.000Z',
    })],
    holds: new Map(),
    history: [],
    rewardCheckIn: normalizeLocalDevCheckInState(null),
    rewardXPosts: [],
  }
}

function normalizeLocalDevCheckInState(value) {
  const source = value && typeof value === 'object' ? value : {}
  const streakDay = Number(source.streakDay)
  return {
    streakDay: Number.isInteger(streakDay) && streakDay >= 1 && streakDay <= LOCAL_DEV_CHECK_IN_REWARDS.length
      ? streakDay
      : 0,
    lastCheckInDate: typeof source.lastCheckInDate === 'string' ? source.lastCheckInDate : null,
  }
}

function toLocalDevUtcDateKey(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

function addLocalDevUtcDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return toLocalDevUtcDateKey(date)
}

function getLocalDevActiveStreakDay(checkIn, today) {
  if (!checkIn.lastCheckInDate) return 0
  if (checkIn.lastCheckInDate === today || addLocalDevUtcDays(checkIn.lastCheckInDate, 1) === today) {
    return checkIn.streakDay
  }
  return 0
}

function getLocalDevNextCheckInDay(checkIn, today) {
  if (!checkIn.lastCheckInDate) return 1
  if (checkIn.lastCheckInDate === today) return checkIn.streakDay || 1
  if (addLocalDevUtcDays(checkIn.lastCheckInDate, 1) === today) {
    return checkIn.streakDay >= LOCAL_DEV_CHECK_IN_REWARDS.length ? 1 : checkIn.streakDay + 1
  }
  return 1
}

function getLocalDevCheckInStatusFromState(state, now = new Date()) {
  const today = toLocalDevUtcDateKey(now)
  const checkIn = state.rewardCheckIn
  const checkedInToday = checkIn.lastCheckInDate === today
  const streakDay = getLocalDevActiveStreakDay(checkIn, today)
  const nextDay = checkedInToday
    ? getLocalDevNextCheckInDay(checkIn, addLocalDevUtcDays(today, 1))
    : getLocalDevNextCheckInDay(checkIn, today)

  return {
    checkedInToday,
    streakDay,
    lastCheckInDate: checkIn.lastCheckInDate,
    nextDay,
    nextRewardCredits: LOCAL_DEV_CHECK_IN_REWARDS[nextDay - 1],
    rewards: LOCAL_DEV_CHECK_IN_REWARDS.map((credits, index) => ({
      day: index + 1,
      credits,
      current: checkedInToday ? index + 1 === streakDay : index + 1 === nextDay,
      claimed: streakDay > 0 && index + 1 <= streakDay,
    })),
  }
}

function grantLocalDevCredits(amount, description, reason = 'bonus') {
  const state = getLocalDevCreditState()

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Credit amount must be a positive integer')
  }

  state.balance += amount
  state.transactions.unshift(createLocalDevCreditTransaction({
    amount,
    type: 'bonus',
    reason,
    description,
    balanceAfter: state.balance,
  }))
  persistLocalDevCreditState(state)

  return {
    ok: true,
    credits: getLocalDevCreditSummary(),
    granted: amount,
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

export function listLocalDevRewardEvents({ reason = 'all', limit = 50 } = {}) {
  const normalizedReason = LOCAL_DEV_REWARD_EVENT_REASONS.includes(String(reason))
    ? String(reason)
    : 'all'
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200))
  const items = getLocalDevCreditState().transactions
    .filter((transaction) => Number(transaction.amount) > 0)
    .filter((transaction) => LOCAL_DEV_REWARD_EVENT_REASONS.includes(transaction.reason))
    .filter((transaction) => normalizedReason === 'all' || transaction.reason === normalizedReason)
    .slice(0, safeLimit)
    .map((transaction) => ({
      id: transaction.id,
      userId: localDevUser.id,
      userEmail: localDevUser.email,
      userName: localDevUser.name,
      type: transaction.type,
      amount: transaction.amount,
      balanceAfter: transaction.balanceAfter,
      reason: transaction.reason,
      description: transaction.description,
      createdAt: transaction.createdAt,
    }))

  return {
    ok: true,
    reason: normalizedReason,
    items,
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

export function getLocalDevDailyCheckInStatus(now = new Date()) {
  const state = getLocalDevCreditState()
  return getLocalDevCheckInStatusFromState(state, now)
}

export function claimLocalDevDailyCheckIn(now = new Date()) {
  const state = getLocalDevCreditState()
  const today = toLocalDevUtcDateKey(now)

  if (state.rewardCheckIn.lastCheckInDate === today) {
    return {
      ok: true,
      alreadyCheckedIn: true,
      rewardCredits: 0,
      checkIn: {
        ...getLocalDevCheckInStatusFromState(state, now),
        day: state.rewardCheckIn.streakDay || 1,
      },
      credits: getLocalDevCreditSummary(),
    }
  }

  const day = getLocalDevNextCheckInDay(state.rewardCheckIn, today)
  const rewardCredits = LOCAL_DEV_CHECK_IN_REWARDS[day - 1]
  state.rewardCheckIn = {
    streakDay: day,
    lastCheckInDate: today,
  }
  persistLocalDevCreditState(state)
  const grant = grantLocalDevCredits(rewardCredits, `Daily check-in reward (Day ${day})`, 'daily_checkin')

  return {
    ok: true,
    alreadyCheckedIn: false,
    rewardCredits,
    checkIn: {
      ...getLocalDevCheckInStatusFromState(getLocalDevCreditState(), now),
      day,
    },
    credits: grant.credits,
  }
}

function normalizeLocalDevXPostUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  try {
    const url = new URL(raw)
    const host = url.hostname.replace(/^www\./, '').toLowerCase()
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
    if (host !== 'x.com' && host !== 'twitter.com') return ''
    url.hash = ''
    return url.toString()
  } catch {
    return ''
  }
}

export function submitLocalDevXPostReward(postUrl) {
  const state = getLocalDevCreditState()
  const normalizedUrl = normalizeLocalDevXPostUrl(postUrl)
  if (!normalizedUrl) {
    return {
      ok: false,
      status: 400,
      error: 'Please submit a valid X post URL.',
    }
  }

  const existing = state.rewardXPosts.find((item) => item.postUrl === normalizedUrl)
  if (existing) {
    return {
      ok: true,
      duplicate: true,
      xPost: existing,
    }
  }

  const now = new Date().toISOString()
  const xPost = {
    id: `local-dev-x-post-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    postUrl: normalizedUrl,
    rewardCredits: LOCAL_DEV_X_POST_REWARD_CREDITS,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }
  state.rewardXPosts.unshift(xPost)
  persistLocalDevCreditState(state)

  return {
    ok: true,
    duplicate: false,
    xPost,
  }
}

function serializeLocalDevXPostReward(item) {
  return {
    id: item.id,
    userId: localDevUser.id,
    userEmail: localDevUser.email,
    userName: localDevUser.name,
    postUrl: item.postUrl,
    rewardCredits: item.rewardCredits || LOCAL_DEV_X_POST_REWARD_CREDITS,
    status: item.status || 'pending',
    reviewedBy: item.reviewedBy || null,
    reviewedAt: item.reviewedAt || null,
    rejectionReason: item.rejectionReason || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

export function listLocalDevXPostRewardReviews({ status = 'pending' } = {}) {
  const normalizedStatus = ['pending', 'approved', 'rejected', 'all'].includes(String(status))
    ? String(status)
    : 'pending'
  const items = getLocalDevCreditState().rewardXPosts
    .filter((item) => normalizedStatus === 'all' || (item.status || 'pending') === normalizedStatus)
    .map(serializeLocalDevXPostReward)

  return {
    ok: true,
    status: normalizedStatus,
    items,
  }
}

export function reviewLocalDevXPostReward({ id, action, reason, reviewer = 'local-dev-admin' } = {}) {
  const state = getLocalDevCreditState()
  const xPost = state.rewardXPosts.find((item) => item.id === String(id || ''))
  if (!xPost) return { ok: false, status: 404, error: 'X post review not found.' }

  if ((xPost.status || 'pending') !== 'pending') {
    return {
      ok: true,
      alreadyReviewed: true,
      xPost: serializeLocalDevXPostReward(xPost),
      credits: getLocalDevCreditSummary(),
    }
  }

  const now = new Date().toISOString()
  if (action === 'approve') {
    xPost.status = 'approved'
    xPost.reviewedBy = reviewer
    xPost.reviewedAt = now
    xPost.rejectionReason = null
    xPost.updatedAt = now
    persistLocalDevCreditState(state)
    const grant = grantLocalDevCredits(
      xPost.rewardCredits || LOCAL_DEV_X_POST_REWARD_CREDITS,
      'Approved X post reward',
      'x_post_reward',
    )
    return {
      ok: true,
      alreadyReviewed: false,
      xPost: serializeLocalDevXPostReward(xPost),
      credits: grant.credits,
    }
  }

  if (action === 'reject') {
    xPost.status = 'rejected'
    xPost.reviewedBy = reviewer
    xPost.reviewedAt = now
    xPost.rejectionReason = String(reason || '').trim() || 'Does not meet reward requirements.'
    xPost.updatedAt = now
    persistLocalDevCreditState(state)
    return {
      ok: true,
      alreadyReviewed: false,
      xPost: serializeLocalDevXPostReward(xPost),
      credits: getLocalDevCreditSummary(),
    }
  }

  return { ok: false, status: 400, error: 'Unsupported review action.' }
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
    nativeAudio: item?.nativeAudio === true,
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

export function registerLocalDevCreditHold(taskId, amount, metadata = {}) {
  const state = getLocalDevCreditState()

  if (!taskId || !Number.isInteger(amount) || amount <= 0) return null

  state.holds.set(String(taskId), {
    taskId: String(taskId),
    amount,
    refunded: false,
    model: metadata.model ? String(metadata.model) : undefined,
    isImageToImage: Boolean(metadata.isImageToImage),
  })
  persistLocalDevCreditState(state)

  return {
    provider: 'local-dev',
    taskId: String(taskId),
    requiredCredits: amount,
    model: metadata.model ? String(metadata.model) : undefined,
    isImageToImage: Boolean(metadata.isImageToImage),
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
