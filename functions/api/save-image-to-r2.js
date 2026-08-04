/**
 * Cloudflare Pages Function: 根据媒体 URL 拉取图片/视频并存入 R2，返回 R2 公网 URL。
 * 用于把 Kie 等第三方生成结果存到自己的 R2，便于直接下载（同域/CORS）。
 * 部署后地址：https://toolaze-web.pages.dev/api/save-image-to-r2
 * 需绑定 R2（MY_BUCKET）并设置 R2_PUBLIC_BASE_URL。
 */
import { getCanonicalR2PublicBaseUrl } from '../_shared/r2-public-url.mjs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function normalizeRequestedMediaType(value) {
  return value === 'video' || value === 'image' ? value : null;
}

function getExtensionFromUrl(mediaUrl) {
  try {
    const pathname = new URL(mediaUrl).pathname;
    return pathname.split('.').pop()?.toLowerCase() || '';
  } catch {
    return '';
  }
}

function inferMediaType(contentType, requestedMediaType) {
  if (requestedMediaType) return requestedMediaType;
  if (contentType.toLowerCase().startsWith('video/')) return 'video';
  return 'image';
}

function inferExtension(contentType, mediaType, mediaUrl) {
  const normalizedContentType = contentType.toLowerCase();
  if (normalizedContentType.includes('jpeg') || normalizedContentType.includes('jpg')) return 'jpg';
  if (normalizedContentType.includes('png')) return 'png';
  if (normalizedContentType.includes('webp')) return 'webp';
  if (normalizedContentType.includes('gif')) return 'gif';
  if (normalizedContentType.includes('mp4')) return 'mp4';
  if (normalizedContentType.includes('webm')) return 'webm';
  if (normalizedContentType.includes('quicktime')) return 'mov';
  if (normalizedContentType.includes('x-m4v')) return 'm4v';

  const extension = getExtensionFromUrl(mediaUrl);
  const allowedExtensions = mediaType === 'video'
    ? new Set(['mp4', 'webm', 'mov', 'm4v'])
    : new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);
  if (allowedExtensions.has(extension)) return extension === 'jpeg' ? 'jpg' : extension;

  return mediaType === 'video' ? 'mp4' : 'png';
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed', allow: 'POST, OPTIONS' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST, OPTIONS', ...CORS },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const mediaUrl = String(body.mediaUrl || body.imageUrl || body.url || '').trim();
    if (!mediaUrl || !mediaUrl.startsWith('http')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid mediaUrl' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const resp = await fetch(mediaUrl, { redirect: 'follow' });
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch media: ${resp.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const blob = await resp.blob();
    const requestedMediaType = normalizeRequestedMediaType(body.mediaType);
    const contentType = resp.headers.get('Content-Type') || blob.type || (requestedMediaType === 'video' ? 'video/mp4' : 'image/png');
    const mediaType = inferMediaType(contentType, requestedMediaType);
    const ext = inferExtension(contentType, mediaType, mediaUrl);

    const randomId = crypto.randomUUID().replace(/-/g, '');
    const key = `generated/${randomId}.${ext}`;
    await env.MY_BUCKET.put(key, blob, {
      httpMetadata: { contentType },
    });

    const base = getCanonicalR2PublicBaseUrl(env);
    const publicUrl = `${base}/${key}`;
    return new Response(JSON.stringify({ url: publicUrl, key, mediaType }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e.message) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}
