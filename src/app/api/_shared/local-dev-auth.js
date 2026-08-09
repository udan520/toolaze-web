import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import {
  getImageGenerationCreditDescription,
  getImageGenerationCreditMetadata,
  getImageGenerationCreditRefundDescription,
  getImageGenerationModelLabel,
} from '../../../../functions/_shared/generation-credit-label.mjs'

const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
const LOCAL_DEV_SESSION_TOKEN = 'toolaze-local-dev-session'
const LOCAL_DEV_EMAIL = 'dianawu1202@gmail.com'
const LOCAL_DEV_PASSWORD = 'test123456'
const INITIAL_LOCAL_DEV_CREDIT_BALANCE = 1000
const DEFAULT_LOCAL_DEV_STATE_FILE = '/tmp/toolaze-local-dev-state.json'
const LOCAL_DEV_CHECK_IN_REWARDS = [5, 10, 15, 20, 25, 30, 50]
const LOCAL_DEV_X_POST_REWARD_CREDITS = 10
const LOCAL_DEV_LEGACY_CREDIT_HISTORY_MATCH_WINDOW_MS = 15 * 60 * 1000
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
        metadata: hold.metadata && typeof hold.metadata === 'object' ? hold.metadata : {},
      }]))

  return {
    balance,
    transactions: Array.isArray(source.transactions) ? source.transactions : fallback.transactions,
    holds,
    history: Array.isArray(source.history) ? source.history : [],
    attempts: Array.isArray(source.attempts) ? source.attempts : [],
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
    attempts: state.attempts,
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
  metadata,
}) {
  const transaction = {
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
  if (metadata && typeof metadata === 'object' && Object.keys(metadata).length > 0) {
    transaction.metadata = metadata
  }
  return transaction
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
    attempts: [],
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

function getTimestampMs(value) {
  const timestamp = Date.parse(String(value || ''))
  return Number.isFinite(timestamp) ? timestamp : 0
}

function isLegacyImageGenerationCreditTransaction(transaction) {
  if (!transaction || typeof transaction !== 'object') return false
  if (transaction.metadata?.toolLabel) return false
  return transaction.reason === 'image_generation' || transaction.reason === 'image_generation_refund'
}

function getImageGenerationModeFromCreditDescription(description, historyItem) {
  const normalizedDescription = String(description || '').toLowerCase()
  if (normalizedDescription.includes('image-to-image')) return true
  if (normalizedDescription.includes('text-to-image')) return false
  return Array.isArray(historyItem?.inputUrls) && historyItem.inputUrls.length > 0
}

function findLocalDevHistoryMatchForCreditTransaction(transaction, historyItems) {
  const transactionTime = getTimestampMs(transaction?.createdAt)
  if (!transactionTime || !Array.isArray(historyItems) || historyItems.length === 0) return null

  const description = String(transaction.description || '').toLowerCase()
  const candidates = historyItems
    .filter((item) => item?.mediaType !== 'video' && (item?.toolSlug || item?.sourcePath))
    .map((item) => {
      const createdAtMs = getTimestampMs(item.createdAt)
      return {
        item,
        distance: createdAtMs ? Math.abs(createdAtMs - transactionTime) : Number.POSITIVE_INFINITY,
        modelMatches: description.includes(getImageGenerationModelLabel(item.model).toLowerCase()),
      }
    })
    .filter((candidate) => candidate.distance <= LOCAL_DEV_LEGACY_CREDIT_HISTORY_MATCH_WINDOW_MS)
    .sort((left, right) => {
      if (left.modelMatches !== right.modelMatches) return left.modelMatches ? -1 : 1
      return left.distance - right.distance
    })

  return candidates[0]?.item || null
}

function enrichLocalDevCreditTransaction(transaction, historyItems) {
  if (!isLegacyImageGenerationCreditTransaction(transaction)) return transaction

  const historyItem = findLocalDevHistoryMatchForCreditTransaction(transaction, historyItems)
  if (!historyItem) return transaction

  const isImageToImage = getImageGenerationModeFromCreditDescription(transaction.description, historyItem)
  const metadata = getImageGenerationCreditMetadata(historyItem.model, isImageToImage, {
    toolSlug: historyItem.toolSlug,
    toolLabel: historyItem.toolLabel,
    sourcePath: historyItem.sourcePath,
  })
  const description = transaction.reason === 'image_generation_refund'
    ? getImageGenerationCreditRefundDescription(historyItem.model, isImageToImage, metadata)
    : getImageGenerationCreditDescription(historyItem.model, isImageToImage, metadata)

  return {
    ...transaction,
    description,
    metadata,
  }
}

export function getLocalDevCreditSummary() {
  const state = getLocalDevCreditState()

  return {
    balance: state.balance,
    transactions: state.transactions
      .slice(0, 10)
      .map((transaction) => enrichLocalDevCreditTransaction(transaction, state.history)),
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

export function isLocalRequest(request) {
  const url = new URL(request.url)
  if (isLocalhost(url.hostname)) return true

  const host = request.headers.get('host')?.trim()
  if (!host) return false

  try {
    return isLocalhost(new URL(`http://${host}`).hostname)
  } catch {
    return false
  }
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
    user: {
      ...localDevUser,
      isAdmin: isLocalDevAdminEmail(localDevUser.email),
    },
    credits: getLocalDevCreditSummary(),
  }
}

function isLocalDevAdminEmail(email) {
  const normalized = normalizeLocalDevEmail(email)
  if (!normalized) return false
  return String(process.env.MEDIA_LIBRARY_ADMIN_EMAILS || process.env.TOOLAZE_ADMIN_EMAILS || '')
    .split(/[,\n]/)
    .map(normalizeLocalDevEmail)
    .includes(normalized)
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

function createLocalDevGenerationAttemptId() {
  return `gen_attempt_local_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function getLocalDevAttemptStatusRequest(attempt) {
  if (attempt.status !== 'pending' || !attempt.taskId || !attempt.creditHold) return null

  return {
    endpoint: '/api/image-to-image/status',
    taskId: attempt.taskId,
    taskProvider: 'image-to-image',
    creditHold: attempt.creditHold,
  }
}

function serializeLocalDevGenerationAttempt(attempt) {
  return {
    ...attempt,
    failureReason: attempt.failureReason || null,
    statusRequest: getLocalDevAttemptStatusRequest(attempt),
  }
}

export function createLocalDevGenerationAttempt(item) {
  const state = getLocalDevCreditState()
  const now = new Date().toISOString()
  const attempt = {
    id: createLocalDevGenerationAttemptId(),
    taskId: null,
    mediaType: item?.mediaType === 'video' ? 'video' : 'image',
    status: 'pending',
    model: String(item?.model || '').trim() || 'unknown',
    prompt: String(item?.prompt || '').trim(),
    outputUrl: '',
    inputUrls: normalizeLocalDevHistoryInputUrls(item?.inputUrls),
    aspectRatio: item?.aspectRatio || null,
    resolution: item?.resolution || null,
    outputFormat: item?.outputFormat || null,
    nativeAudio: item?.nativeAudio === true,
    toolSlug: String(item?.toolSlug || '').trim() || null,
    toolLabel: String(item?.toolLabel || '').trim() || null,
    sourcePath: String(item?.sourcePath || '').trim() || null,
    requiredCredits: Number.isInteger(item?.requiredCredits) ? item.requiredCredits : null,
    creditHold: null,
    failureReason: null,
    historyId: null,
    createdAt: now,
    updatedAt: now,
  }

  state.attempts.unshift(attempt)
  persistLocalDevCreditState(state)
  return serializeLocalDevGenerationAttempt(attempt)
}

export function attachLocalDevGenerationAttemptTask(attemptId, taskId, creditHold) {
  const state = getLocalDevCreditState()
  const attempt = state.attempts.find((item) => item.id === String(attemptId || ''))
  if (!attempt || !taskId) return null

  attempt.taskId = String(taskId)
  attempt.creditHold = creditHold && typeof creditHold === 'object' ? creditHold : null
  attempt.updatedAt = new Date().toISOString()
  persistLocalDevCreditState(state)
  return serializeLocalDevGenerationAttempt(attempt)
}

export function updateLocalDevGenerationAttemptStatus({ attemptId, taskId, status, outputUrl, failureReason } = {}) {
  const state = getLocalDevCreditState()
  const attempt = state.attempts.find((item) => (
    attemptId ? item.id === String(attemptId) : taskId && item.taskId === String(taskId)
  ))
  if (!attempt) return null

  attempt.status = status === 'succeeded' ? 'succeeded' : status === 'failed' ? 'failed' : 'pending'
  if (outputUrl) attempt.outputUrl = String(outputUrl)
  attempt.failureReason = failureReason ? String(failureReason) : null
  attempt.updatedAt = new Date().toISOString()
  persistLocalDevCreditState(state)
  return serializeLocalDevGenerationAttempt(attempt)
}

export function listLocalDevGenerationHistory(limit = 100) {
  const state = getLocalDevCreditState()
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 200))
  const completed = state.history.map((item) => ({
    ...item,
    status: 'succeeded',
    updatedAt: item.createdAt,
  }))
  const lifecycle = state.attempts
    .filter((attempt) => !attempt.historyId)
    .map(serializeLocalDevGenerationAttempt)

  return [...completed, ...lifecycle]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, safeLimit)
}

export function createLocalDevHistoryItem(item) {
  const state = getLocalDevCreditState()
  const mediaType = item?.mediaType === 'video' ? 'video' : 'image'
  const outputUrl = String(item?.outputUrl || '').trim()
  const prompt = String(item?.prompt || '').trim()
  const model = String(item?.model || '').trim()

  if (!outputUrl.startsWith('http')) {
    return { ok: false, status: 400, error: 'Output URL is required.' }
  }
  if (mediaType !== 'video' && !prompt) {
    return { ok: false, status: 400, error: 'Prompt is required.' }
  }
  if (!model) {
    return { ok: false, status: 400, error: 'Model is required.' }
  }

  const taskId = String(item?.taskId || '').trim()
  const existingItem = taskId
    ? state.history.find((historyItem) => historyItem.taskId === taskId)
    : null
  const historyItem = {
    id: existingItem?.id || createLocalDevHistoryId(),
    taskId: taskId || null,
    mediaType,
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

  if (existingItem) {
    state.history = state.history.map((candidate) => candidate.id === existingItem.id ? historyItem : candidate)
  } else {
    state.history.unshift(historyItem)
  }
  if (taskId) {
    const attempt = state.attempts.find((candidate) => candidate.taskId === taskId)
    if (attempt) {
      attempt.status = 'succeeded'
      attempt.outputUrl = outputUrl
      attempt.historyId = historyItem.id
      attempt.updatedAt = new Date().toISOString()
    }
  }
  persistLocalDevCreditState(state)
  return { ok: true, status: 201, item: historyItem }
}

export function listLocalDevHistory(limit = 100) {
  return listLocalDevGenerationHistory(limit)
}

export function deleteLocalDevHistoryItem(itemId) {
  const state = getLocalDevCreditState()
  const id = String(itemId || '').trim()
  const historyItem = state.history.find((item) => item.id === id)
  const before = state.history.length + state.attempts.length
  state.history = state.history.filter((item) => item.id !== id)
  state.attempts = state.attempts.filter((attempt) => (
    attempt.id !== id && (!historyItem || attempt.historyId !== historyItem.id)
  ))
  const deleted = before - state.history.length - state.attempts.length
  if (deleted > 0) persistLocalDevCreditState(state)

  return {
    ok: deleted > 0,
    deleted,
  }
}

export function consumeLocalDevCredits(amount, description = 'Image generation', metadata) {
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
    metadata,
  }))
  persistLocalDevCreditState(state)

  return {
    ok: true,
    credits: getLocalDevCreditSummary(),
    required: amount,
  }
}

export function refundLocalDevCredits(amount, description = 'Image generation refund', metadata) {
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
    metadata,
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
    metadata: metadata && typeof metadata === 'object' ? metadata : {},
  })
  persistLocalDevCreditState(state)

  return {
    provider: 'local-dev',
    taskId: String(taskId),
    requiredCredits: amount,
    model: metadata.model ? String(metadata.model) : undefined,
    isImageToImage: Boolean(metadata.isImageToImage),
    metadata: metadata && typeof metadata === 'object' ? metadata : {},
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
  return refundLocalDevCredits(hold.amount, description, hold.metadata)
}

export function resetLocalDevCreditsForTests(balance = INITIAL_LOCAL_DEV_CREDIT_BALANCE) {
  globalThis[LOCAL_DEV_STATE_KEY] = createLocalDevCreditState(balance)
  persistLocalDevCreditState(globalThis[LOCAL_DEV_STATE_KEY])
}

export function resetLocalDevHistoryForTests() {
  const state = getLocalDevCreditState()
  state.history = []
  state.attempts = []
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
