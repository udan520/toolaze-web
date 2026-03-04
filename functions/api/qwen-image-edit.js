/**
 * Cloudflare Pages Function: 图生图（OpenAI DALL-E 格式）
 * 部署后地址：https://toolaze-web.pages.dev/api/qwen-image-edit
 * 需设置环境变量：ZHEN_AI_API_KEY，ZHEN_AI_FLUX_BASE_URL（如 https://ai.t8star.cn）
 *
 * 接口：POST /v1/images/edits（multipart/form-data）
 * 文档：https://gpt-best.apifox.cn/api-341817449（nano-banana Edits 兼容）
 */
const DEFAULT_BASE = 'https://ai.t8star.cn'
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function getBaseUrl(env) {
  const url = (env.ZHEN_AI_FLUX_BASE_URL || '').trim()
  return url || DEFAULT_BASE
}

function getApiKey(env) {
  return env.ZHEN_AI_API_KEY
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

export async function onRequest(context) {
  const { request, env } = context
  const method = request.method

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }
  if (method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405)
  }

  const apiKey = getApiKey(env)
  if (!apiKey) {
    return jsonResponse({ error: 'API key not configured (ZHEN_AI_API_KEY)' }, 500)
  }

  try {
    const contentType = request.headers.get('Content-Type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse({ error: 'Content-Type must be multipart/form-data' }, 400)
    }

    const formData = await request.formData()
    const model = formData.get('model') || 'nano-banana'
    const prompt = (formData.get('prompt') || '').trim()
    const image = formData.get('image') || formData.get('file')

    if (!prompt) {
      return jsonResponse({ error: 'prompt is required' }, 400)
    }
    if (!image || !(image instanceof Blob)) {
      return jsonResponse({ error: 'image file is required (field: image or file)' }, 400)
    }

    const baseUrl = getBaseUrl(env)
    const url = `${baseUrl.replace(/\/$/, '')}/v1/images/edits`

    const upstreamForm = new FormData()
    upstreamForm.append('model', model)
    upstreamForm.append('prompt', prompt)
    upstreamForm.append('image', image, image.name || 'image.png')
    upstreamForm.append('response_format', formData.get('response_format') || 'url')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: upstreamForm,
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const msg = result?.error?.message ?? result?.message ?? result?.error ?? `Upstream error: ${response.status}`
      return jsonResponse({ error: String(msg), hint: response.status === 401 ? 'Check ZHEN_AI_API_KEY' : undefined }, response.status)
    }

    // 多种响应格式：data[0].url / metadata.output.choices[0].message.content[0].image
    const item = result?.data?.[0]
    let imageUrl = item?.url
    const b64 = item?.b64_json
    if (!imageUrl) {
      const content = result?.metadata?.output?.choices?.[0]?.message?.content?.[0]
      imageUrl = content?.image || content?.url
    }
    if (imageUrl) {
      return jsonResponse({ url: imageUrl })
    }
    if (b64) {
      return jsonResponse({ url: `data:image/png;base64,${b64}` })
    }
    return jsonResponse({ error: 'Unexpected response format', raw: result }, 500)
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
      hint: 'Check ZHEN_AI_API_KEY and ZHEN_AI_FLUX_BASE_URL',
    }, 500)
  }
}
