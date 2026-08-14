export type AdminReadCacheOptions = {
  forceRefresh?: boolean
  maxAgeMs?: number
}

type CacheEntry = {
  value: unknown
  expiresAt: number
}

type AdminReadCacheStore = {
  entries: Map<string, CacheEntry>
  pending: Map<string, Promise<unknown>>
}

const DEFAULT_MAX_AGE_MS = 5 * 60 * 1000
const globalForAdminReadCache = globalThis as typeof globalThis & {
  __toolazeAdminReadCache?: AdminReadCacheStore
}

function getStore(): AdminReadCacheStore {
  if (!globalForAdminReadCache.__toolazeAdminReadCache) {
    globalForAdminReadCache.__toolazeAdminReadCache = {
      entries: new Map(),
      pending: new Map(),
    }
  }

  return globalForAdminReadCache.__toolazeAdminReadCache
}

export async function readAdminSnapshot<T>(
  key: string,
  loader: () => Promise<T>,
  options: AdminReadCacheOptions = {},
): Promise<T> {
  const store = getStore()
  const cached = store.entries.get(key)
  const now = Date.now()

  if (!options.forceRefresh && cached && cached.expiresAt > now) {
    return cached.value as T
  }

  const pending = store.pending.get(key)
  if (pending) return pending as Promise<T>

  const request = loader()
    .then((value) => {
      store.entries.set(key, {
        value,
        expiresAt: Date.now() + (options.maxAgeMs ?? DEFAULT_MAX_AGE_MS),
      })
      return value
    })
    .catch((error) => {
      if (cached) return cached.value as T
      throw error
    })
    .finally(() => {
      if (store.pending.get(key) === request) {
        store.pending.delete(key)
      }
    })

  store.pending.set(key, request)
  return request
}
