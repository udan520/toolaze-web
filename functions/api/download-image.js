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

function getAllowedBaseUrl(env) {
  const base = env.R2_PUBLIC_BASE_URL;
  if (typeof base === 'string' && base.trim()) {
    return base.trim().replace(/\/$/, '');
  }
  return '';
}

function isAllowedUrl(url, allowedBase) {
  if (!allowedBase) {
    return /^https:\/\/[^/]+\.r2\.dev\//.test(url);
  }
  return url === allowedBase || url.startsWith(allowedBase + '/');
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

    const contentType = resp.headers.get('content-type') || 'image/octet-stream';
    const blob = await resp.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '\\"')}"`,
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
