const DEFAULT_CREEM_API_BASE_URL = 'https://api.creem.io'
const MODERATION_PATH = '/v1/moderation/prompt'
const BLOCKED_PROMPT_ERROR = 'This prompt cannot be generated. Please try a different idea.'
const TEMPORARY_MODERATION_ERROR = 'Prompt moderation is temporarily unavailable. Please try again.'
const UNCONFIGURED_MODERATION_ERROR = 'Prompt moderation is not configured.'

function getCreemApiKey(env = {}) {
  return env.CREEM_API_KEY || env.CREEM_MODERATION_API_KEY || ''
}

function getCreemApiBaseUrl(env = {}) {
  return String(env.CREEM_API_BASE_URL || DEFAULT_CREEM_API_BASE_URL).replace(/\/+$/, '')
}

function getModerationUrl(env = {}) {
  return `${getCreemApiBaseUrl(env)}${MODERATION_PATH}`
}

function getAbortSignal(timeoutMs) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(timeoutMs)
  }
  return undefined
}

function normalizeDecision(value) {
  return String(value || '').trim().toLowerCase()
}

function buildBlockedResult(data) {
  return {
    allowed: false,
    status: 400,
    body: {
      error: BLOCKED_PROMPT_ERROR,
      moderation: {
        id: data?.id || null,
        decision: normalizeDecision(data?.decision) || 'deny',
      },
    },
  }
}

function buildUnavailableResult() {
  return {
    allowed: false,
    status: 503,
    body: { error: TEMPORARY_MODERATION_ERROR },
  }
}

export async function moderatePromptBeforeGeneration({
  prompt,
  env = {},
  externalId,
  fetchImpl = fetch,
  timeoutMs = 8000,
} = {}) {
  const normalizedPrompt = String(prompt || '').trim()
  if (!normalizedPrompt) {
    return {
      allowed: false,
      status: 400,
      body: { error: 'Prompt is required' },
    }
  }

  const apiKey = getCreemApiKey(env)
  if (!apiKey) {
    return {
      allowed: false,
      status: 500,
      body: { error: UNCONFIGURED_MODERATION_ERROR },
    }
  }

  let response
  try {
    response = await fetchImpl(getModerationUrl(env), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        prompt: normalizedPrompt,
        ...(externalId ? { external_id: String(externalId) } : {}),
      }),
      signal: getAbortSignal(timeoutMs),
    })
  } catch {
    return buildUnavailableResult()
  }

  if (!response?.ok) {
    return buildUnavailableResult()
  }

  const data = await response.json().catch(() => null)
  const decision = normalizeDecision(data?.decision)

  if (decision === 'allow') {
    return {
      allowed: true,
      status: 200,
      body: {
        moderation: {
          id: data?.id || null,
          decision,
        },
      },
    }
  }

  if (decision === 'deny' || decision === 'flag') {
    return buildBlockedResult(data)
  }

  return buildUnavailableResult()
}

export function createModerationExternalId(prefix = 'toolaze-generation') {
  const randomPart =
    globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  return `${prefix}-${Date.now()}-${randomPart}`
}
