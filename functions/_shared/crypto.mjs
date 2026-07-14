const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function base64UrlEncodeBytes(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function base64UrlEncodeText(value) {
  return base64UrlEncodeBytes(textEncoder.encode(value));
}

export function decodeBase64UrlBytes(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function base64UrlDecodeText(value) {
  return textDecoder.decode(decodeBase64UrlBytes(value));
}

export async function sha256Hex(value) {
  const hash = await crypto.subtle.digest('SHA-256', textEncoder.encode(value));
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signValue(value, secret) {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(value));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

export async function verifySignedValue(value, signature, secret) {
  const expected = await signValue(value, secret);
  if (expected.length !== signature.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSignedState(payload, secret) {
  const encodedPayload = base64UrlEncodeText(JSON.stringify(payload));
  const signature = await signValue(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function readSignedState(state, secret, nowMs = Date.now()) {
  const parts = String(state || '').split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) return null;

  const valid = await verifySignedValue(encodedPayload, signature, secret);
  if (!valid) return null;

  try {
    const payload = JSON.parse(base64UrlDecodeText(encodedPayload));
    const exp = Number(payload.exp);
    if (!Number.isFinite(exp) || exp < nowMs) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createRandomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncodeBytes(bytes);
}

export function parseJwt(jwt) {
  const parts = String(jwt || '').split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  return {
    header: JSON.parse(base64UrlDecodeText(parts[0])),
    payload: JSON.parse(base64UrlDecodeText(parts[1])),
    signingInput: `${parts[0]}.${parts[1]}`,
    signature: parts[2],
  };
}

export async function verifyJwtRs256(jwt, jwk) {
  const parsed = parseJwt(jwt);
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    decodeBase64UrlBytes(parsed.signature),
    textEncoder.encode(parsed.signingInput)
  );
  return valid ? parsed.payload : null;
}
