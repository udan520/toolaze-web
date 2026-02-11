/**
 * Cloudflare Function: 生成图片 alt 文本
 * 使用 OpenAI Vision API 或其他图像识别服务
 * 
 * 部署路径: /api/generate-alt
 */

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const { imageUrl } = await request.json()

    if (!imageUrl || typeof imageUrl !== 'string') {
      return new Response(
        JSON.stringify({ error: 'imageUrl is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 检查是否配置了 OpenAI API Key
    const openaiApiKey = env.OPENAI_API_KEY

    if (!openaiApiKey) {
      // 如果没有配置 OpenAI API，返回基于 URL 的默认 alt 文本
      const defaultAlt = getDefaultAltFromUrl(imageUrl)
      return new Response(
        JSON.stringify({ alt: defaultAlt }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 使用 OpenAI Vision API 生成 alt 文本
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // 使用更便宜的模型
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Describe this image in a concise alt text for accessibility (max 125 characters, in English). Focus on the main subject and key visual elements.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 50,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const altText = data.choices?.[0]?.message?.content?.trim() || 'Image'

      // 确保 alt 文本不超过 125 个字符（SEO 最佳实践）
      const finalAlt = altText.length > 125 ? altText.substring(0, 122) + '...' : altText

      return new Response(
        JSON.stringify({ alt: finalAlt }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('OpenAI API error:', error)
      // 如果 API 调用失败，返回基于 URL 的默认 alt 文本
      const defaultAlt = getDefaultAltFromUrl(imageUrl)
      return new Response(
        JSON.stringify({ alt: defaultAlt }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Generate alt error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * 从图片 URL 生成默认的 alt 文本
 */
function getDefaultAltFromUrl(imageUrl) {
  try {
    const url = new URL(imageUrl)
    const pathname = url.pathname

    // 从文件名提取信息
    const filename = pathname.split('/').pop() || ''
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '')

    // 如果文件名包含有意义的信息，使用它
    if (nameWithoutExt && nameWithoutExt.length > 0 && !nameWithoutExt.match(/^[a-f0-9]{32}$/i)) {
      // 不是纯哈希值，使用文件名
      return nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // 从路径推断
    if (pathname.includes('sample')) return 'Sample image'
    if (pathname.includes('logo')) return 'Logo'
    if (pathname.includes('hero')) return 'Hero image'
    if (pathname.includes('banner')) return 'Banner image'
    if (pathname.includes('nano-banana')) return 'Nano Banana Pro sample output'

    return 'Image'
  } catch {
    return 'Image'
  }
}
