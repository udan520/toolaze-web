const AUTH_CACHE_STORAGE_KEY = 'toolaze.authSnapshot'

export type GenerationAuthState = {
  isSignedIn: boolean
  creditsExhausted: boolean
}

type GenerationAuthWindow = {
  __TOOLAZE_AUTH_USER__?: unknown
  sessionStorage?: {
    getItem(key: string): string | null
  }
}

type CachedAuthSnapshot = {
  user?: unknown
  credits?: {
    balance?: unknown
  }
}

function readCachedAuthSnapshot(win: GenerationAuthWindow): CachedAuthSnapshot | null {
  try {
    const raw = win.sessionStorage?.getItem(AUTH_CACHE_STORAGE_KEY)
    if (!raw) return null

    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null

    return data as CachedAuthSnapshot
  } catch {
    return null
  }
}

export function getCachedGenerationAuthState(
  requiredCredits: number,
  win: GenerationAuthWindow | null | undefined = typeof window === 'undefined' ? null : window,
): GenerationAuthState {
  if (!win) return { isSignedIn: false, creditsExhausted: false }

  const snapshot = readCachedAuthSnapshot(win)
  const cachedUser = win.__TOOLAZE_AUTH_USER__ || snapshot?.user
  const isSignedIn = Boolean(cachedUser)

  if (cachedUser && !win.__TOOLAZE_AUTH_USER__) {
    win.__TOOLAZE_AUTH_USER__ = cachedUser
  }

  const balance = snapshot?.credits?.balance
  return {
    isSignedIn,
    creditsExhausted: isSignedIn && typeof balance === 'number' && balance < requiredCredits,
  }
}

export function getGenerationAuthStateFromAuthMeResult(
  status: number,
  data: unknown,
  requiredCredits: number,
  cachedAuthState: GenerationAuthState,
): GenerationAuthState {
  if (status === 401 || status === 403) {
    return { isSignedIn: false, creditsExhausted: false }
  }

  if (status < 200 || status >= 300) {
    return cachedAuthState
  }

  const payload = data && typeof data === 'object' ? data as { user?: unknown; credits?: { balance?: unknown } } : {}
  const isSignedIn = Boolean(payload.user) || cachedAuthState.isSignedIn
  const balance = payload.credits?.balance

  return {
    isSignedIn,
    creditsExhausted: isSignedIn && (
      typeof balance === 'number'
        ? balance < requiredCredits
        : cachedAuthState.creditsExhausted
    ),
  }
}
