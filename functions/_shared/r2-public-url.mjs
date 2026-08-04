const CANONICAL_R2_PUBLIC_BASE_URL = 'https://assets.toolaze.com';
const LEGACY_R2_PUBLIC_HOSTS = new Set([
  'pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev',
]);

function sanitizeBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

export function getCanonicalR2PublicBaseUrl(env = {}) {
  const configuredBase = sanitizeBaseUrl(env.R2_PUBLIC_BASE_URL);
  const base = configuredBase || CANONICAL_R2_PUBLIC_BASE_URL;

  try {
    const parsed = new URL(base);
    if (LEGACY_R2_PUBLIC_HOSTS.has(parsed.hostname)) return CANONICAL_R2_PUBLIC_BASE_URL;
    return base;
  } catch {
    return CANONICAL_R2_PUBLIC_BASE_URL;
  }
}

export function rewriteLegacyR2PublicUrl(value, env = {}) {
  const url = typeof value === 'string' ? value.trim() : '';
  if (!url) return '';

  try {
    const parsed = new URL(url);
    if (!LEGACY_R2_PUBLIC_HOSTS.has(parsed.hostname)) return url;
    return `${getCanonicalR2PublicBaseUrl(env)}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
}
