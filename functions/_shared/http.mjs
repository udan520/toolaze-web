export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS,
      ...headers,
    },
  });
}

export function redirectResponse(location, status = 302, headers = {}) {
  return new Response(null, {
    status,
    headers: {
      Location: location,
      ...headers,
    },
  });
}

export function handleOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export function getRequestUrl(request) {
  return new URL(request.url);
}

export function getSafeReturnTo(value) {
  if (!value || typeof value !== 'string') return '/';
  if (!value.startsWith('/')) return '/';
  if (value.startsWith('//')) return '/';
  if (value.includes('\\')) return '/';
  return value;
}

export function getClientIp(request) {
  if (!request?.headers) return null;

  const cloudflareIp = readHeaderValue(request, 'CF-Connecting-IP');
  if (cloudflareIp) return cloudflareIp;

  const forwardedFor = readHeaderValue(request, 'X-Forwarded-For');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  return readHeaderValue(request, 'X-Real-IP');
}

export function getClientCountry(request) {
  const country = readHeaderValue(request, 'CF-IPCountry');
  if (!country || country.toUpperCase() === 'XX') return null;
  return /^[A-Za-z]{2}$/.test(country) ? country.toUpperCase() : null;
}

function readHeaderValue(request, name) {
  const value = request.headers.get(name);
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}
