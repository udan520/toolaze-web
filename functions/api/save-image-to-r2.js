/**
 * Cloudflare Pages Function: 根据图片 URL 拉取图片并存入 R2，返回 R2 公网 URL。
 * 用于把 Kie 等第三方生成图存到自己的 R2，便于直接下载（同域/CORS）。
 * 部署后地址：https://toolaze-web.pages.dev/api/save-image-to-r2
 * 需绑定 R2（MY_BUCKET）并设置 R2_PUBLIC_BASE_URL。
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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
    const imageUrl = (body.imageUrl || body.url || '').trim();
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid imageUrl' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const resp = await fetch(imageUrl, { redirect: 'follow' });
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch image: ${resp.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const blob = await resp.blob();
    const contentType = resp.headers.get('Content-Type') || blob.type || 'image/png';
    let ext = 'png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
    else if (contentType.includes('webp')) ext = 'webp';

    const randomId = crypto.randomUUID().replace(/-/g, '');
    const key = `generated/${randomId}.${ext}`;
    await env.MY_BUCKET.put(key, blob, {
      httpMetadata: { contentType },
    });

    const base = (env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    if (!base) {
      return new Response(JSON.stringify({ error: 'R2_PUBLIC_BASE_URL not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }
    const publicUrl = `${base}/${key}`;
    return new Response(JSON.stringify({ url: publicUrl, key }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e.message) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}
