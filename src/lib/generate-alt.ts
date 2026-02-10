/**
 * 自动生成图片 alt 文本的工具函数
 * 使用 AI 图像识别 API 分析图片内容并生成描述性的 alt 文本
 */

/**
 * 使用 OpenAI Vision API 生成图片的 alt 文本
 * @param imageUrl 图片 URL
 * @returns 生成的 alt 文本
 */
export async function generateAltFromImage(imageUrl: string): Promise<string> {
  try {
    // 调用 API 生成 alt 文本
    const response = await fetch('/api/generate-alt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate alt text')
    }

    const data = await response.json()
    return data.alt || 'Image'
  } catch (error) {
    console.error('Error generating alt text:', error)
    // 如果生成失败，返回基于 URL 的默认 alt 文本
    return getDefaultAltFromUrl(imageUrl)
  }
}

/**
 * 从图片 URL 生成默认的 alt 文本
 * @param imageUrl 图片 URL
 * @returns 默认的 alt 文本
 */
function getDefaultAltFromUrl(imageUrl: string): string {
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
    
    return 'Image'
  } catch {
    return 'Image'
  }
}
