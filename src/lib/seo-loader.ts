import imageCompressionData from '@/data/image-compression.json';
import imageConverterData from '@/data/image-converter.json';

export function getSeoContent(tool: string, slug: string) {
  try {
    if (tool === 'image-compressor' || tool === 'image-compression') {
      const data = (imageCompressionData as any)[slug]
      return data || null
    }
    if (tool === 'image-converter' || tool === 'image-conversion') {
      const data = (imageConverterData as any)[slug]
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
  if (tool === 'image-converter' || tool === 'image-conversion') {
    return Object.keys(imageConverterData);
  }
  return [];
}

// 获取所有工具列表（用于主页）
export async function getAllTools(): Promise<Array<{ tool: string; slug: string }>> {
  const tools: Array<{ tool: string; slug: string }> = []
  
  // 添加图片压缩工具
  const compressorSlugs = getAllSlugs('image-compressor')
  for (const slug of compressorSlugs) {
    tools.push({ tool: 'image-compressor', slug })
  }
  
  // 添加图片转换工具
  const converterSlugs = getAllSlugs('image-converter')
  for (const slug of converterSlugs) {
    tools.push({ tool: 'image-converter', slug })
  }
  
  return tools
}

// 加载工具数据（用于主页）
export async function loadToolData(tool: string, slug: string) {
  return getSeoContent(tool, slug)
}