/**
 * Cloudflare Pages Function: Nano Banana Pro 生图 - 创建任务
 * 部署后地址：https://toolaze-web.pages.dev/api/image-to-image
 * 需设置环境变量：KIE_AI_API_KEY 或 DASHSCOPE_API_KEY，可选 NANO_BANANA_DAILY_CAP
 */
const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

let dailyCount = { date: '', count: 0 };

function getDailyCap(env) {
  const cap = env.NANO_BANANA_DAILY_CAP;
  if (cap === undefined || cap === '') return undefined;
  const n = parseInt(String(cap), 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function checkAndIncrementDaily(env) {
  const cap = getDailyCap(env);
  if (cap === undefined) return true;
  const today = new Date().toISOString().slice(0, 10);
  if (dailyCount.date !== today) {
    dailyCount.date = today;
    dailyCount.count = 0;
  }
  if (dailyCount.count >= cap) return false;
  dailyCount.count += 1;
  return true;
}

function getApiKey(env) {
  return env.KIE_AI_API_KEY || env.DASHSCOPE_API_KEY;
}

function mapOutputFormat(format) {
  if (!format) return undefined;
  const f = String(format).toLowerCase();
  if (f === 'auto') return undefined;
  if (f === 'jpg' || f === 'jpeg') return 'jpg';
  if (f === 'png') return 'png';
  return 'png';
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
    const formData = await request.formData();
    const imageUrl = (formData.get('imageUrl') || '').trim();
    const imageUrlsJson = formData.get('imageUrls');
    const prompt = (formData.get('prompt') || '').trim();
    const aspectRatio = formData.get('aspectRatio') || '1:1';
    const outputFormat = formData.get('outputFormat') || 'Auto';
    const resolution = formData.get('resolution') || '1K';
    const isImageToImage = formData.get('isImageToImage') === 'true';

    if (!prompt) {
      return jsonResponse({ error: 'Prompt is required' }, 400);
    }

    let imageUrls = [];
    if (imageUrlsJson) {
      try {
        const arr = JSON.parse(String(imageUrlsJson));
        imageUrls = Array.isArray(arr) ? arr : [];
      } catch {
        imageUrls = [];
      }
    }
    if (imageUrl && imageUrls.length === 0) {
      imageUrls = [imageUrl];
    }

    if (isImageToImage && imageUrls.length === 0) {
      return jsonResponse({
        error: 'Image-to-image requires a public image URL. Please set NEXT_PUBLIC_IMAGE_UPLOAD_URL to your upload endpoint.',
      }, 400);
    }
    if (isImageToImage && imageUrls.length > 8) {
      return jsonResponse({ error: 'Maximum 8 images allowed' }, 400);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (KIE_AI_API_KEY)' }, 500);
    }

    if (!checkAndIncrementDaily(env)) {
      return jsonResponse(
        { error: 'Daily generation limit reached. Please try again tomorrow.' },
        429
      );
    }

    const input = {
      prompt,
      aspect_ratio: aspectRatio,
      resolution: resolution === '2K' || resolution === '4K' ? resolution : '1K',
    };
    const mappedFormat = mapOutputFormat(outputFormat);
    if (mappedFormat) {
      input.output_format = mappedFormat;
    }
    if (isImageToImage && imageUrls.length > 0) {
      input.image_input = imageUrls.slice(0, 8);
    }

    const response = await fetch(`${KIE_AI_BASE}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'nano-banana-pro',
        input,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = result?.message ?? result?.msg ?? await response.text();
      return jsonResponse({ error: msg || 'Failed to create task' }, response.status);
    }

    if (result?.code === 200 && result?.data?.taskId) {
      return jsonResponse({ taskId: result.data.taskId });
    }

    return jsonResponse({
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
    }, 500);
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
