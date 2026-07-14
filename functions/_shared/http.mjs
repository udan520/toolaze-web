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
