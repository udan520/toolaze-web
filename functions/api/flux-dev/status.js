/**
 * Cloudflare Pages Function: Flux Dev 生图 - 查询任务状态
 * 部署后地址：https://toolaze-web.pages.dev/api/flux-dev/status
 * 需设置环境变量：ZHEN_AI_API_KEY，ZHEN_AI_FLUX_BASE_URL（可选）
 *
 * 请求体：{ polling_url } 或 { id }
 * 返回：{ status: 'SUCCEEDED'|'PENDING'|'FAILED', imageUrl, result }
 */
const DEFAULT_BASE = 'https://api.openai-hk.com';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getBaseUrl(env) {
  const url = (env.ZHEN_AI_FLUX_BASE_URL || '').trim();
  return url || DEFAULT_BASE;
}

function getApiKey(env) {
  return env.ZHEN_AI_API_KEY;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const pollingUrl = (body?.polling_url ?? '').trim();
    const id = (body?.id ?? '').trim();

    if (!pollingUrl && !id) {
      return jsonResponse({ error: 'polling_url or id is required' }, 400);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (ZHEN_AI_API_KEY)' }, 500);
    }

    const url = pollingUrl || `${getBaseUrl(env).replace(/\/$/, '')}/bfl/v1/get_result?id=${encodeURIComponent(id)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = result?.message ?? result?.error ?? result?.msg ?? await response.text();
      return jsonResponse({ error: msg || 'Failed to get task status' }, response.status);
    }

    const rawStatus = result?.status ?? '';
    const statusMap = {
      Ready: 'SUCCEEDED',
      ready: 'SUCCEEDED',
      Failed: 'FAILED',
      failed: 'FAILED',
      Error: 'FAILED',
      error: 'FAILED',
    };
    const status = statusMap[rawStatus] ?? 'PENDING';

    let imageUrl = null;
    const res = result?.result;
    if (res && typeof res === 'object') {
      imageUrl = res?.sample ?? res?.url ?? res?.image ?? null;
    }

    return jsonResponse({
      status,
      imageUrl: imageUrl || undefined,
      result: res ?? undefined,
      raw: result,
    });
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
