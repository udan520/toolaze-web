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
    // 在静态导出模式下，需要根据当前域名动态构建 API URL
    // 如果是在客户端，使用当前域名；否则使用默认域名
    let apiUrl = '/api/generate-alt'
    
    if (typeof window !== 'undefined') {
      // 客户端：使用当前域名构建完整 URL
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1'
      
      if (!isDevelopment) {
        // 生产环境：使用当前域名（支持自定义域名）
        apiUrl = `${window.location.origin}/api/generate-alt`
      }
      // 开发环境：使用相对路径（Next.js dev server 会处理）
    }

    // 调用 API 生成 alt 文本
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    })

    if (!response.ok) {
      // 如果 API 调用失败，返回基于 URL 的默认 alt 文本
      return getDefaultAltFromUrl(imageUrl)
    }

    const data = await response.json()
    return data.alt || getDefaultAltFromUrl(imageUrl)
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
