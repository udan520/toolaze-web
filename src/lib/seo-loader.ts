// 支持的所有语言列表
const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 动态导入 JSON 数据（支持多语言）
async function loadJsonData(locale: string, filename: string) {
  try {
    // 规范化的 locale（处理 zh -> zh-TW 等映射）
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW' // 所有中文变体映射到繁体中文
    }
    
    // 如果语言不在支持列表中，回退到英语
    if (!SUPPORTED_LOCALES.includes(normalizedLocale)) {
      normalizedLocale = 'en'
    }

    // 尝试从指定语言目录加载
    if (normalizedLocale === 'en') {
      if (filename === 'image-compression.json') {
        const data = await import('@/data/en/image-compression.json');
        return data.default || data;
      }
      if (filename === 'image-converter.json') {
        const data = await import('@/data/en/image-converter.json');
        return data.default || data;
      }
      if (filename === 'common.json') {
        const data = await import('@/data/en/common.json');
        return data.default || data;
      }
    } else {
      // 动态导入其他语言文件
      try {
        if (filename === 'image-compression.json') {
          const data = await import(`@/data/${normalizedLocale}/image-compression.json`);
          return data.default || data;
        }
        if (filename === 'image-converter.json') {
          const data = await import(`@/data/${normalizedLocale}/image-converter.json`);
          return data.default || data;
        }
        if (filename === 'common.json') {
          const data = await import(`@/data/${normalizedLocale}/common.json`);
          return data.default || data;
        }
      } catch (importError) {
        // 如果语言文件不存在，回退到英语
        return loadJsonData('en', filename);
      }
    }
    
    // 如果指定语言不存在，回退到英语
    if (normalizedLocale !== 'en') {
      return loadJsonData('en', filename);
    }
    
    // 最后回退到根目录（向后兼容）
    if (filename === 'image-compression.json') {
      const data = await import('@/data/image-compression.json');
      return data.default || data;
    }
    if (filename === 'image-converter.json') {
      const data = await import('@/data/image-converter.json');
      return data.default || data;
    }
    if (filename === 'common.json') {
      // common.json 只从语言目录加载，不回退到根目录
      return null;
    }
    
    return null;
  } catch (error) {
    // 如果指定语言不存在，回退到英语
    if (locale !== 'en') {
      try {
        return loadJsonData('en', filename);
      } catch (fallbackError) {
        // 如果英语也不存在，尝试根目录（向后兼容）
        try {
          if (filename === 'image-compression.json') {
            const data = await import('@/data/image-compression.json');
            return data.default || data;
          }
          if (filename === 'image-converter.json') {
            const data = await import('@/data/image-converter.json');
            return data.default || data;
          }
          if (filename === 'common.json') {
            // common.json 只从语言目录加载，不回退到根目录
            return null;
          }
        } catch (rootError) {
          return null;
        }
      }
    }
    return null;
  }
}

// 加载公共翻译数据
export async function loadCommonTranslations(locale: string = 'en') {
  try {
    const data = await loadJsonData(locale, 'common.json');
    return data;
  } catch (error) {
    // 如果加载失败，回退到英语
    if (locale !== 'en') {
      try {
        return await loadJsonData('en', 'common.json');
      } catch (fallbackError) {
        return null;
      }
    }
    return null;
  }
}

export async function getSeoContent(tool: string, slug: string, locale: string = 'en') {
  try {
    if (tool === 'image-compressor' || tool === 'image-compression') {
      const data = await loadJsonData(locale, 'image-compression.json');
      if (data && data[slug]) {
        return data[slug];
      }
      return null;
    }
    if (tool === 'image-converter' || tool === 'image-conversion') {
      const data = await loadJsonData(locale, 'image-converter.json');
      if (data && data[slug]) {
        return data[slug];
      }
      return null;
    }
    return null;
  } catch (error) {
    // Silently return null on error to prevent server-side crashes
    return null;
  }
}

// 供生成静态页面使用
export async function getAllSlugs(tool: string, locale: string = 'en') {
  try {
    if (tool === 'image-compressor' || tool === 'image-compression') {
      const data = await loadJsonData(locale, 'image-compression.json');
      return data ? Object.keys(data) : [];
    }
    if (tool === 'image-converter' || tool === 'image-conversion') {
      const data = await loadJsonData(locale, 'image-converter.json');
      return data ? Object.keys(data) : [];
    }
    return [];
  } catch (error) {
    return [];
  }
}

// 获取所有工具列表（用于主页）
export async function getAllTools(locale: string = 'en'): Promise<Array<{ tool: string; slug: string }>> {
  const tools: Array<{ tool: string; slug: string }> = []
  
  // 添加图片压缩工具
  const compressorSlugs = await getAllSlugs('image-compressor', locale)
  for (const slug of compressorSlugs) {
    tools.push({ tool: 'image-compressor', slug })
  }
  
  // 添加图片转换工具
  const converterSlugs = await getAllSlugs('image-converter', locale)
  for (const slug of converterSlugs) {
    tools.push({ tool: 'image-converter', slug })
  }
  
  return tools
}

// 加载工具数据（用于主页）
export async function loadToolData(tool: string, slug: string, locale: string = 'en') {
  return getSeoContent(tool, slug, locale)
}