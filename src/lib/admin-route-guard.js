export function isLocalAdminHost(value) {
  const rawHost = String(value || '').split(',')[0].trim().toLowerCase()
  if (!rawHost) return false

  try {
    if (rawHost.includes('://')) {
      return isLocalHostname(new URL(rawHost).hostname)
    }
  } catch {
    return false
  }

  if (rawHost.startsWith('[')) {
    const closingBracketIndex = rawHost.indexOf(']')
    return isLocalHostname(closingBracketIndex === -1 ? rawHost : rawHost.slice(1, closingBracketIndex))
  }

  return isLocalHostname(rawHost.split(':')[0])
}

export function isLocalAdminRequest(request) {
  const url = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''

  return isLocalAdminHost(forwardedHost) || isLocalAdminHost(url.host)
}

export function blockNonLocalAdminRequest(request) {
  return isLocalAdminRequest(request) ? null : new Response(null, { status: 404 })
}

function isLocalHostname(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}
