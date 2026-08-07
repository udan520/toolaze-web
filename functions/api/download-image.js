/**
 * Cloudflare Pages Function: 代理下载 R2 上的图片，返回 Content-Disposition: attachment。
 * 仅允许白名单域名（R2 公网域名），防止被滥用。
 * 部署后地址：https://toolaze-web.pages.dev/api/download-image
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const IMAGE_FORMAT_BY_MIME = {
  'image/png': { extension: 'png', mimeType: 'image/png' },
  'image/jpeg': { extension: 'jpg', mimeType: 'image/jpeg' },
  'image/webp': { extension: 'webp', mimeType: 'image/webp' },
  'image/gif': { extension: 'gif', mimeType: 'image/gif' },
  'image/avif': { extension: 'avif', mimeType: 'image/avif' },
};

function startsWithBytes(bytes, signature, offset = 0) {
  return signature.every((value, index) => bytes[offset + index] === value);
}

function detectImageFormat(bytes, mimeType) {
  if (startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return IMAGE_FORMAT_BY_MIME['image/png'];
  }
  if (startsWithBytes(bytes, [0xff, 0xd8, 0xff])) return IMAGE_FORMAT_BY_MIME['image/jpeg'];
  if (startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWithBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return IMAGE_FORMAT_BY_MIME['image/webp'];
  }
  if (startsWithBytes(bytes, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) || startsWithBytes(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])) {
    return IMAGE_FORMAT_BY_MIME['image/gif'];
  }
  if (startsWithBytes(bytes, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = String.fromCharCode(...bytes.slice(8, 12)).toLowerCase();
    if (brand === 'avif' || brand === 'avis') return IMAGE_FORMAT_BY_MIME['image/avif'];
  }
  return IMAGE_FORMAT_BY_MIME[mimeType.split(';', 1)[0].trim().toLowerCase()] || null;
}

function replaceFilenameExtension(filename, extension) {
  const baseName = filename.replace(/\.[^./\\]+$/, '') || 'image';
  return `${baseName}.${extension}`;
}

function getAllowedBaseUrl(env) {
  const base = env.R2_PUBLIC_BASE_URL;
  if (typeof base === 'string' && base.trim()) {
    return base.trim().replace(/\/$/, '');
  }
  return '';
}

function isAllowedUrl(url, allowedBase) {
  if (!url || !url.startsWith('http')) return false;
  let hostname = '';
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  if (allowedBase && (url === allowedBase || url.startsWith(allowedBase + '/'))) return true;
  if (hostname === 'assets.toolaze.com') return true;
  if (hostname.endsWith('.r2.dev')) return true;
  // KIE / third-party result files can be temporary CDN URLs before we persist them to R2.
  if (hostname === 'tempfile.aiquickdraw.com' || hostname.endsWith('.aiquickdraw.com')) return true;
  if (hostname === 'tempfile.redpandaai.co' || hostname === 'kieai.redpandaai.co') return true;
  // AI 图生图 / 去水印等接口返回的 CDN 域名（如 ai.t8star.cn）
  if (hostname.endsWith('t8star.cn')) return true;
  return false;
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed', allow: 'GET, OPTIONS' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'GET, OPTIONS', ...CORS },
    });
  }

  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    const filename = url.searchParams.get('filename') || 'image.png';

    if (!targetUrl || !targetUrl.startsWith('http')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid url' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const allowedBase = getAllowedBaseUrl(env);
    if (!isAllowedUrl(targetUrl, allowedBase)) {
      return new Response(JSON.stringify({ error: 'URL not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const resp = await fetch(targetUrl, { redirect: 'follow' });
    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream failed: ${resp.status}` }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...CORS } }
      );
    }

    const blob = await resp.blob();
    const upstreamContentType = resp.headers.get('content-type') || 'image/octet-stream';
    const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
    const format = detectImageFormat(bytes, upstreamContentType);
    const contentType = format?.mimeType || upstreamContentType;
    const downloadFilename = format ? replaceFilenameExtension(filename, format.extension) : filename;

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename.replace(/"/g, '\\"')}"`,
        'Cache-Control': 'no-cache',
        ...CORS,
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS } }
    );
  }
}
