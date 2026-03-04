/**
 * Cloudflare Pages Function: Flux Dev 生图 - 创建任务（文生图 / 图生图）
 * 部署后地址：https://toolaze-web.pages.dev/api/flux-dev
 * 需设置环境变量：ZHEN_AI_API_KEY，ZHEN_AI_FLUX_BASE_URL（可选）
 *
 * API 规范：POST /bfl/v1/flux-dev（对齐 gpt-best.apifox.cn Bfl 官方格式）
 * 支持 imageUrl 时走图生图；否则文生图
 * 返回：{ id, polling_url }
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

function mapOutputFormat(format) {
  if (!format) return 'jpeg';
  const f = String(format).toLowerCase();
  if (f === 'jpg' || f === 'jpeg') return 'jpeg';
  if (f === 'png') return 'png';
  return 'jpeg';
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
    const prompt = (body?.prompt ?? '').trim();
    const imageUrl = (body?.imageUrl ?? body?.image_url ?? '').trim();
    const width = body?.width ?? 1024;
    const height = body?.height ?? 768;
    const steps = body?.steps ?? 28;
    const promptUpsampling = body?.prompt_upsampling ?? false;
    const seed = body?.seed ?? 42;
    const guidance = body?.guidance ?? 3;
    const safetyTolerance = body?.safety_tolerance ?? 2;
    const outputFormat = mapOutputFormat(body?.output_format);

    if (!prompt) {
      return jsonResponse({ error: 'prompt is required' }, 400);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (ZHEN_AI_API_KEY)' }, 500);
    }

    const baseUrl = getBaseUrl(env);
    const url = `${baseUrl.replace(/\/$/, '')}/bfl/v1/flux-dev`;

    const payload = {
      prompt,
      width: Number(width) || 1024,
      height: Number(height) || 768,
      steps: Number(steps) || 28,
      prompt_upsampling: Boolean(promptUpsampling),
      seed: Number(seed) ?? 42,
      guidance: Number(guidance) || 3,
      safety_tolerance: Number(safetyTolerance) ?? 2,
      output_format: outputFormat,
    };
    if (imageUrl && imageUrl.startsWith('http')) {
      payload.input_image = imageUrl;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = result?.detail;
      const msg = result?.message ?? result?.error ?? result?.msg
        ?? (typeof detail === 'string' ? detail : null)
        ?? (Array.isArray(detail) ? detail.map(d => d?.msg).filter(Boolean).join('; ') : null)
        ?? `Upstream API error: ${response.status}`;
      return jsonResponse({
        error: String(msg),
        status: response.status,
        hint: response.status === 401 ? 'Check ZHEN_AI_API_KEY' : response.status === 404 ? 'Check ZHEN_AI_FLUX_BASE_URL (e.g. gpt-best Base URL)' : undefined,
      }, response.status >= 400 && response.status < 600 ? response.status : 502);
    }

    const id = result?.id;
    const pollingUrl = result?.polling_url;
    if (!id && !pollingUrl) {
      return jsonResponse({
        error: 'Unexpected response: missing id or polling_url',
        hint: 'The upstream API may use a different response format. Check ZHEN_AI_FLUX_BASE_URL.',
        raw: result,
      }, 500);
    }

    return jsonResponse({
      id: id ?? null,
      polling_url: pollingUrl ?? (baseUrl ? `${baseUrl.replace(/\/$/, '')}/bfl/v1/get_result?id=${id}` : null),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal server error';
    return jsonResponse({
      error: msg,
      hint: 'Check Cloudflare Functions logs. Ensure ZHEN_AI_API_KEY and ZHEN_AI_FLUX_BASE_URL are set.',
    }, 500);
  }
}
