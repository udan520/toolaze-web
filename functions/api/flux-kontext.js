/**
 * Cloudflare Pages Function: Flux Kontext 图生图 - 创建任务（去水印等）
 * 部署后地址：https://toolaze-web.pages.dev/api/flux-kontext
 * 需设置环境变量：ZHEN_AI_API_KEY，ZHEN_AI_FLUX_BASE_URL（可选）
 *
 * 请求体：prompt, imageUrl（必填，公网可访问的图片 URL）, aspect_ratio, seed, output_format 等
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
    const aspectRatio = body?.aspect_ratio ?? body?.aspectRatio ?? '1:1';
    const seed = body?.seed ?? Math.floor(Math.random() * 2147483647);
    const outputFormat = (body?.output_format ?? body?.outputFormat ?? 'jpeg').toLowerCase();
    const promptUpsampling = body?.prompt_upsampling ?? false;
    const safetyTolerance = body?.safety_tolerance ?? 2;

    if (!prompt) {
      return jsonResponse({ error: 'prompt is required' }, 400);
    }
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return jsonResponse({ error: 'imageUrl is required (public URL)' }, 400);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (ZHEN_AI_API_KEY)' }, 500);
    }

    const baseUrl = getBaseUrl(env);
    const url = `${baseUrl.replace(/\/$/, '')}/bfl/v1/flux-kontext-pro`;

    const payload = {
      prompt,
      input_image: imageUrl,
      aspect_ratio: aspectRatio,
      seed: Number(seed) || Math.floor(Math.random() * 2147483647),
      output_format: outputFormat === 'png' ? 'png' : 'jpeg',
      prompt_upsampling: Boolean(promptUpsampling),
      safety_tolerance: Math.min(6, Math.max(0, Number(safetyTolerance) || 2)),
    };

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
      const msg = result?.message ?? result?.error ?? result?.detail ?? result?.msg ?? await response.text();
      return jsonResponse({ error: msg || 'Failed to create flux-kontext task' }, response.status);
    }

    const id = result?.id;
    const pollingUrl = result?.polling_url;
    if (!id && !pollingUrl) {
      return jsonResponse({
        error: 'Unexpected response: missing id or polling_url',
        raw: result,
      }, 500);
    }

    return jsonResponse({
      id: id ?? null,
      polling_url: pollingUrl ?? (baseUrl ? `${baseUrl.replace(/\/$/, '')}/bfl/v1/get_result?id=${id}` : null),
    });
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
