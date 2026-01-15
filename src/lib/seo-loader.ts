import imageCompressionData from '@/data/image-compression.json';

export function getSeoContent(tool: string, slug: string) {
  try {
    // 目前仅处理图片压缩类工具
    if (tool === 'image-compressor' || tool === 'image-compression') {
      const data = (imageCompressionData as any)[slug]
      return data || null
    }
    return null
  } catch (error) {
    // Silently return null on error to prevent server-side crashes
    return null
  }
}

// 供生成静态页面使用
export function getAllSlugs(tool: string) {
  if (tool === 'image-compressor' || tool === 'image-compression') {
    return Object.keys(imageCompressionData);
  }
  return [];
}

// 获取所有工具列表（用于主页）
export async function getAllTools(): Promise<Array<{ tool: string; slug: string }>> {
  const tools: Array<{ tool: string; slug: string }> = []
  const slugs = getAllSlugs('image-compressor')
  for (const slug of slugs) {
    tools.push({ tool: 'image-compressor', slug })
  }
  return tools
}

// 加载工具数据（用于主页）
export async function loadToolData(tool: string, slug: string) {
  return getSeoContent(tool, slug)
}