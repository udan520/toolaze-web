type EnvLike = Record<string, string | undefined>

type HeaderReader = {
  get(name: string): string | null
}

export function isLocalAdminHost(host: string | null): boolean {
  if (!host) return false

  const normalized = host.trim().toLowerCase()
  if (normalized === '::1') return true
  if (normalized.startsWith('[')) {
    return normalized.slice(0, normalized.indexOf(']') + 1) === '[::1]'
  }

  const hostname = normalized.split(':')[0]
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

export function parseAdminEmailAllowlist(env: EnvLike = process.env): string[] {
  return String(env.TOOLAZE_ADMIN_EMAILS || '')
    .split(/[,\n]/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmailAllowed(
  adminEmail: string | null,
  env: EnvLike = process.env,
): boolean {
  if (!adminEmail) return false

  const normalizedEmail = adminEmail.trim().toLowerCase()
  if (!normalizedEmail) return false

  return parseAdminEmailAllowlist(env).includes(normalizedEmail)
}

export function getAdminEmailFromHeaders(headers: HeaderReader): string | null {
  return readHeader(headers, 'cf-access-authenticated-user-email')
}

export function isAdminRequestAllowed({
  host,
  adminEmail,
  env = process.env,
}: {
  host: string | null
  adminEmail: string | null
  env?: EnvLike
}): boolean {
  if (isLocalAdminHost(host)) return true
  if (env.TOOLAZE_ENABLE_REMOTE_ADMIN !== 'true') return false

  return isAdminEmailAllowed(adminEmail, env)
}

function readHeader(headers: HeaderReader, name: string): string | null {
  const value = headers.get(name)
  const normalized = value?.trim()
  return normalized || null
}
