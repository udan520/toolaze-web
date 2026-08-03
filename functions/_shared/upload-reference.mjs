import {
  base64UrlEncodeBytes,
  decodeBase64UrlBytes,
} from './crypto.mjs';

export const UPLOAD_REFERENCE_PREFIX = 'toolaze-upload-ref:';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export class UploadReferenceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UploadReferenceError';
    this.status = 400;
  }
}

function getSubtleCrypto() {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure upload references are not supported in this runtime.');
  }
  return globalThis.crypto.subtle;
}

async function importAesKey(secret) {
  const subtle = getSubtleCrypto();
  const digest = await subtle.digest('SHA-256', textEncoder.encode(String(secret || '')));
  return subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

function combineBytes(left, right) {
  const combined = new Uint8Array(left.length + right.length);
  combined.set(left);
  combined.set(right, left.length);
  return combined;
}

export function isUploadReference(value) {
  return String(value || '').startsWith(UPLOAD_REFERENCE_PREFIX);
}

export function getUploadReferenceMediaType(file) {
  const type = String(file?.type || '').toLowerCase();
  const name = String(file?.name || '').toLowerCase();
  if (type.startsWith('video/') || /\.(mp4|mov|mkv|webm|m4v)$/i.test(name)) return 'video';
  if (type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(name)) return 'image';
  return 'file';
}

function normalizeMediaType(value) {
  const mediaType = String(value || '').trim().toLowerCase();
  return ['image', 'video', 'file'].includes(mediaType) ? mediaType : 'file';
}

export async function createUploadReference(payload, secret) {
  const url = String(payload?.url || '').trim();
  if (!url) {
    throw new Error('Upload reference requires a URL.');
  }
  if (!secret) {
    throw new Error('Upload reference secret is not configured.');
  }

  const iv = new Uint8Array(12);
  globalThis.crypto.getRandomValues(iv);
  const key = await importAesKey(secret);
  const plaintext = textEncoder.encode(JSON.stringify({
    url,
    key: String(payload?.key || ''),
    createdAt: Date.now(),
  }));
  const encrypted = new Uint8Array(await getSubtleCrypto().encrypt({ name: 'AES-GCM', iv }, key, plaintext));
  const mediaType = normalizeMediaType(payload?.mediaType);
  return `${UPLOAD_REFERENCE_PREFIX}${mediaType}:${base64UrlEncodeBytes(combineBytes(iv, encrypted))}`;
}

export async function resolveUploadReference(value, secret) {
  const raw = String(value || '').trim();
  if (!isUploadReference(raw)) return raw;
  if (!secret) {
    throw new UploadReferenceError('Uploaded media reference cannot be verified.');
  }

  try {
    const referenceBody = raw.slice(UPLOAD_REFERENCE_PREFIX.length);
    const encryptedToken = referenceBody.includes(':')
      ? referenceBody.slice(referenceBody.indexOf(':') + 1)
      : referenceBody;
    const bytes = decodeBase64UrlBytes(encryptedToken);
    const iv = bytes.slice(0, 12);
    const encrypted = bytes.slice(12);
    const key = await importAesKey(secret);
    const decrypted = await getSubtleCrypto().decrypt({ name: 'AES-GCM', iv }, key, encrypted);
    const payload = JSON.parse(textDecoder.decode(decrypted));
    const url = String(payload?.url || '').trim();
    if (!url) throw new Error('Missing URL');
    return url;
  } catch {
    throw new UploadReferenceError('Uploaded media reference is invalid or expired.');
  }
}

export async function resolveUploadReferences(values, secret) {
  return Promise.all(values.map((value) => resolveUploadReference(value, secret)));
}
