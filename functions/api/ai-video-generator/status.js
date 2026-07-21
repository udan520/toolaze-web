/**
 * Cloudflare Pages Function: AI 视频生成 - 查询 Kie 任务状态
 * 部署后地址：https://toolaze-web.pages.dev/api/ai-video-generator/status
 * 需设置环境变量：KIE_AI_API_KEY
 */
const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getApiKey(env) {
  return env.KIE_AI_API_KEY;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function normalizeStatus(state) {
  const value = String(state || '').toLowerCase();
  if (value === 'success' || value === 'succeeded' || value === 'completed') return 'SUCCEEDED';
  if (value === 'fail' || value === 'failed' || value === 'error') return 'FAILED';
  return 'PENDING';
}

function firstUrlFrom(value) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (!Array.isArray(value)) return undefined;

  for (const item of value) {
    if (typeof item === 'string' && item.trim()) return item.trim();
    if (item && typeof item === 'object') {
      const url = item.url || item.videoUrl || item.video_url;
      if (typeof url === 'string' && url.trim()) return url.trim();
    }
  }

  return undefined;
}

function parseVideoUrl(data) {
  const directUrl = firstUrlFrom(data?.videoUrl || data?.video_url || data?.url || data?.resultUrls);
  if (directUrl) return directUrl;

  if (!data?.resultJson) return undefined;

  try {
    const parsed = typeof data.resultJson === 'string'
      ? JSON.parse(data.resultJson)
      : data.resultJson;

    return firstUrlFrom(parsed?.videoUrls)
      || firstUrlFrom(parsed?.video_urls)
      || firstUrlFrom(parsed?.videos)
      || firstUrlFrom(parsed?.resultUrls)
      || firstUrlFrom(parsed?.url)
      || firstUrlFrom(parsed?.videoUrl);
  } catch {
    return undefined;
  }
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
    const taskId = String(body?.taskId || '').trim();
    if (!taskId) {
      return jsonResponse({ error: 'Task ID is required' }, 400);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (KIE_AI_API_KEY)' }, 500);
    }

    const response = await fetch(
      `${KIE_AI_BASE}/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = result?.message ?? result?.msg ?? await response.text();
      return jsonResponse({ error: msg || 'Failed to get video task status' }, response.status);
    }

    const data = result?.data ?? result;
    const status = normalizeStatus(data?.state ?? data?.status);
    const videoUrl = parseVideoUrl(data);

    return jsonResponse({
      status,
      ...(videoUrl && { videoUrl }),
      ...(data?.failMsg || data?.message ? { message: data.failMsg ?? data.message } : {}),
      raw: result,
    });
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
