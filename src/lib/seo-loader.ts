// 支持的所有语言列表
const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// Image Converter 工具的所有 slug 列表
const IMAGE_CONVERTER_SLUGS = [
  'jpg-to-png',
  'png-to-jpg',
  'webp-to-jpg',
  'webp-to-png',
  'png-to-webp',
  'jpg-to-webp',
  'heic-to-jpg',
  'heic-to-png',
  'heic-to-webp',
]

// Font Generator 工具的所有 slug 列表
export const FONT_GENERATOR_SLUGS = [
  'cursive',
  'fancy',
  'bold',
  'tattoo',
  'cool',
  'instagram',
  'italic',
  'gothic',
  'calligraphy',
  'discord',
  'old-english',
  '3d',
  'minecraft',
  'disney',
  'bubble',
  'star-wars',
]

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

// 动态加载独立的工具 JSON 文件（用于 image-converter 和 font-generator）
// 使用显式的导入路径以确保 webpack 能够静态分析
async function loadToolJsonFile(locale: string, tool: string, slug: string) {
  try {
    // 规范化的 locale（处理 zh -> zh-TW 等映射）
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
    // 如果语言不在支持列表中，回退到英语
    if (!SUPPORTED_LOCALES.includes(normalizedLocale)) {
      normalizedLocale = 'en'
    }

    // 验证 slug 是否有效
    if (tool === 'image-converter' && !IMAGE_CONVERTER_SLUGS.includes(slug)) {
      return null
    }
    if (tool === 'font-generator' && !FONT_GENERATOR_SLUGS.includes(slug)) {
      return null
    }

    // 使用显式的导入路径以确保 webpack 能够静态分析
    let data: any = null
    
    try {
      // 根据 locale 和 slug 动态导入对应的文件
      // 使用显式路径映射以确保 webpack 能够静态分析
      switch (normalizedLocale) {
        case 'en':
          if (tool === 'image-converter') {
            switch (slug) {
              case 'jpg-to-png': data = await import('@/data/en/image-converter/jpg-to-png.json'); break
              case 'png-to-jpg': data = await import('@/data/en/image-converter/png-to-jpg.json'); break
              case 'webp-to-jpg': data = await import('@/data/en/image-converter/webp-to-jpg.json'); break
              case 'webp-to-png': data = await import('@/data/en/image-converter/webp-to-png.json'); break
              case 'png-to-webp': data = await import('@/data/en/image-converter/png-to-webp.json'); break
              case 'jpg-to-webp': data = await import('@/data/en/image-converter/jpg-to-webp.json'); break
              case 'heic-to-jpg': data = await import('@/data/en/image-converter/heic-to-jpg.json'); break
              case 'heic-to-png': data = await import('@/data/en/image-converter/heic-to-png.json'); break
              case 'heic-to-webp': data = await import('@/data/en/image-converter/heic-to-webp.json'); break
            }
          } else if (tool === 'font-generator') {
            switch (slug) {
              case 'cursive': data = await import('@/data/en/font-generator/cursive.json'); break
              case 'fancy': data = await import('@/data/en/font-generator/fancy.json'); break
              case 'bold': data = await import('@/data/en/font-generator/bold.json'); break
              case 'tattoo': data = await import('@/data/en/font-generator/tattoo.json'); break
              case 'cool': data = await import('@/data/en/font-generator/cool.json'); break
              case 'instagram': data = await import('@/data/en/font-generator/instagram.json'); break
              case 'italic': data = await import('@/data/en/font-generator/italic.json'); break
              case 'gothic': data = await import('@/data/en/font-generator/gothic.json'); break
              case 'calligraphy': data = await import('@/data/en/font-generator/calligraphy.json'); break
              case 'discord': data = await import('@/data/en/font-generator/discord.json'); break
              case 'old-english': data = await import('@/data/en/font-generator/old-english.json'); break
              case '3d': data = await import('@/data/en/font-generator/3d.json'); break
              case 'minecraft': data = await import('@/data/en/font-generator/minecraft.json'); break
              case 'disney': data = await import('@/data/en/font-generator/disney.json'); break
              case 'bubble': data = await import('@/data/en/font-generator/bubble.json'); break
              case 'star-wars': data = await import('@/data/en/font-generator/star-wars.json'); break
            }
          }
          break
        case 'de':
          switch (slug) {
            case 'jpg-to-png': data = await import('@/data/de/image-converter/jpg-to-png.json'); break
            case 'png-to-jpg': data = await import('@/data/de/image-converter/png-to-jpg.json'); break
            case 'webp-to-jpg': data = await import('@/data/de/image-converter/webp-to-jpg.json'); break
            case 'webp-to-png': data = await import('@/data/de/image-converter/webp-to-png.json'); break
            case 'png-to-webp': data = await import('@/data/de/image-converter/png-to-webp.json'); break
            case 'jpg-to-webp': data = await import('@/data/de/image-converter/jpg-to-webp.json'); break
            case 'heic-to-jpg': data = await import('@/data/de/image-converter/heic-to-jpg.json'); break
            case 'heic-to-png': data = await import('@/data/de/image-converter/heic-to-png.json'); break
            case 'heic-to-webp': data = await import('@/data/de/image-converter/heic-to-webp.json'); break
          }
          break
        case 'ja':
          switch (slug) {
            case 'jpg-to-png': data = await import('@/data/ja/image-converter/jpg-to-png.json'); break
            case 'png-to-jpg': data = await import('@/data/ja/image-converter/png-to-jpg.json'); break
            case 'webp-to-jpg': data = await import('@/data/ja/image-converter/webp-to-jpg.json'); break
            case 'webp-to-png': data = await import('@/data/ja/image-converter/webp-to-png.json'); break
            case 'png-to-webp': data = await import('@/data/ja/image-converter/png-to-webp.json'); break
            case 'jpg-to-webp': data = await import('@/data/ja/image-converter/jpg-to-webp.json'); break
            case 'heic-to-jpg': data = await import('@/data/ja/image-converter/heic-to-jpg.json'); break
            case 'heic-to-png': data = await import('@/data/ja/image-converter/heic-to-png.json'); break
            case 'heic-to-webp': data = await import('@/data/ja/image-converter/heic-to-webp.json'); break
          }
          break
        case 'es':
          switch (slug) {
            case 'jpg-to-png': data = await import('@/data/es/image-converter/jpg-to-png.json'); break
            case 'png-to-jpg': data = await import('@/data/es/image-converter/png-to-jpg.json'); break
            case 'webp-to-jpg': data = await import('@/data/es/image-converter/webp-to-jpg.json'); break
            case 'webp-to-png': data = await import('@/data/es/image-converter/webp-to-png.json'); break
            case 'png-to-webp': data = await import('@/data/es/image-converter/png-to-webp.json'); break
            case 'jpg-to-webp': data = await import('@/data/es/image-converter/jpg-to-webp.json'); break
            case 'heic-to-jpg': data = await import('@/data/es/image-converter/heic-to-jpg.json'); break
            case 'heic-to-png': data = await import('@/data/es/image-converter/heic-to-png.json'); break
            case 'heic-to-webp': data = await import('@/data/es/image-converter/heic-to-webp.json'); break
          }
          break
        case 'zh-TW':
          switch (slug) {
            case 'jpg-to-png': data = await import('@/data/zh-TW/image-converter/jpg-to-png.json'); break
            case 'png-to-jpg': data = await import('@/data/zh-TW/image-converter/png-to-jpg.json'); break
            case 'webp-to-jpg': data = await import('@/data/zh-TW/image-converter/webp-to-jpg.json'); break
            case 'webp-to-png': data = await import('@/data/zh-TW/image-converter/webp-to-png.json'); break
            case 'png-to-webp': data = await import('@/data/zh-TW/image-converter/png-to-webp.json'); break
            case 'jpg-to-webp': data = await import('@/data/zh-TW/image-converter/jpg-to-webp.json'); break
            case 'heic-to-jpg': data = await import('@/data/zh-TW/image-converter/heic-to-jpg.json'); break
            case 'heic-to-png': data = await import('@/data/zh-TW/image-converter/heic-to-png.json'); break
            case 'heic-to-webp': data = await import('@/data/zh-TW/image-converter/heic-to-webp.json'); break
          }
          break
        case 'pt':
          switch (slug) {
            case 'jpg-to-png': data = await import('@/data/pt/image-converter/jpg-to-png.json'); break
            case 'png-to-jpg': data = await import('@/data/pt/image-converter/png-to-jpg.json'); break
            case 'webp-to-jpg': data = await import('@/data/pt/image-converter/webp-to-jpg.json'); break
            case 'webp-to-png': data = await import('@/data/pt/image-converter/webp-to-png.json'); break
            case 'png-to-webp': data = await import('@/data/pt/image-converter/png-to-webp.json'); break
            case 'jpg-to-webp': data = await import('@/data/pt/image-converter/jpg-to-webp.json'); break
            case 'heic-to-jpg': data = await import('@/data/pt/image-converter/heic-to-jpg.json'); break
            case 'heic-to-png': data = await import('@/data/pt/image-converter/heic-to-png.json'); break
            case 'heic-to-webp': data = await import('@/data/pt/image-converter/heic-to-webp.json'); break
          }
          break
        case 'fr':
          switch (slug) {
            case 'jpg-to-png': data = await import('@/data/fr/image-converter/jpg-to-png.json'); break
            case 'png-to-jpg': data = await import('@/data/fr/image-converter/png-to-jpg.json'); break
            case 'webp-to-jpg': data = await import('@/data/fr/image-converter/webp-to-jpg.json'); break
            case 'webp-to-png': data = await import('@/data/fr/image-converter/webp-to-png.json'); break
            case 'png-to-webp': data = await import('@/data/fr/image-converter/png-to-webp.json'); break
            case 'jpg-to-webp': data = await import('@/data/fr/image-converter/jpg-to-webp.json'); break
            case 'heic-to-jpg': data = await import('@/data/fr/image-converter/heic-to-jpg.json'); break
            case 'heic-to-png': data = await import('@/data/fr/image-converter/heic-to-png.json'); break
            case 'heic-to-webp': data = await import('@/data/fr/image-converter/heic-to-webp.json'); break
          }
          break
        case 'ko':
          switch (slug) {
            case 'jpg-to-png': data = await import('@/data/ko/image-converter/jpg-to-png.json'); break
            case 'png-to-jpg': data = await import('@/data/ko/image-converter/png-to-jpg.json'); break
            case 'webp-to-jpg': data = await import('@/data/ko/image-converter/webp-to-jpg.json'); break
            case 'webp-to-png': data = await import('@/data/ko/image-converter/webp-to-png.json'); break
            case 'png-to-webp': data = await import('@/data/ko/image-converter/png-to-webp.json'); break
            case 'jpg-to-webp': data = await import('@/data/ko/image-converter/jpg-to-webp.json'); break
            case 'heic-to-jpg': data = await import('@/data/ko/image-converter/heic-to-jpg.json'); break
            case 'heic-to-png': data = await import('@/data/ko/image-converter/heic-to-png.json'); break
            case 'heic-to-webp': data = await import('@/data/ko/image-converter/heic-to-webp.json'); break
          }
          break
        case 'it':
          switch (slug) {
            case 'jpg-to-png': data = await import('@/data/it/image-converter/jpg-to-png.json'); break
            case 'png-to-jpg': data = await import('@/data/it/image-converter/png-to-jpg.json'); break
            case 'webp-to-jpg': data = await import('@/data/it/image-converter/webp-to-jpg.json'); break
            case 'webp-to-png': data = await import('@/data/it/image-converter/webp-to-png.json'); break
            case 'png-to-webp': data = await import('@/data/it/image-converter/png-to-webp.json'); break
            case 'jpg-to-webp': data = await import('@/data/it/image-converter/jpg-to-webp.json'); break
            case 'heic-to-jpg': data = await import('@/data/it/image-converter/heic-to-jpg.json'); break
            case 'heic-to-png': data = await import('@/data/it/image-converter/heic-to-png.json'); break
            case 'heic-to-webp': data = await import('@/data/it/image-converter/heic-to-webp.json'); break
          }
          break
      }
      
      if (data) {
        return data.default || data
      }
    } catch (importError) {
      // 如果指定语言文件不存在，回退到英语
      if (normalizedLocale !== 'en') {
        try {
          if (tool === 'image-converter') {
            switch (slug) {
              case 'jpg-to-png': data = await import('@/data/en/image-converter/jpg-to-png.json'); break
              case 'png-to-jpg': data = await import('@/data/en/image-converter/png-to-jpg.json'); break
              case 'webp-to-jpg': data = await import('@/data/en/image-converter/webp-to-jpg.json'); break
              case 'webp-to-png': data = await import('@/data/en/image-converter/webp-to-png.json'); break
              case 'png-to-webp': data = await import('@/data/en/image-converter/png-to-webp.json'); break
              case 'jpg-to-webp': data = await import('@/data/en/image-converter/jpg-to-webp.json'); break
              case 'heic-to-jpg': data = await import('@/data/en/image-converter/heic-to-jpg.json'); break
              case 'heic-to-png': data = await import('@/data/en/image-converter/heic-to-png.json'); break
              case 'heic-to-webp': data = await import('@/data/en/image-converter/heic-to-webp.json'); break
            }
          } else if (tool === 'font-generator') {
            switch (slug) {
              case 'cursive': data = await import('@/data/en/font-generator/cursive.json'); break
              case 'fancy': data = await import('@/data/en/font-generator/fancy.json'); break
              case 'bold': data = await import('@/data/en/font-generator/bold.json'); break
              case 'tattoo': data = await import('@/data/en/font-generator/tattoo.json'); break
              case 'cool': data = await import('@/data/en/font-generator/cool.json'); break
              case 'instagram': data = await import('@/data/en/font-generator/instagram.json'); break
              case 'italic': data = await import('@/data/en/font-generator/italic.json'); break
              case 'gothic': data = await import('@/data/en/font-generator/gothic.json'); break
              case 'calligraphy': data = await import('@/data/en/font-generator/calligraphy.json'); break
              case 'discord': data = await import('@/data/en/font-generator/discord.json'); break
              case 'old-english': data = await import('@/data/en/font-generator/old-english.json'); break
              case '3d': data = await import('@/data/en/font-generator/3d.json'); break
              case 'minecraft': data = await import('@/data/en/font-generator/minecraft.json'); break
              case 'disney': data = await import('@/data/en/font-generator/disney.json'); break
              case 'bubble': data = await import('@/data/en/font-generator/bubble.json'); break
              case 'star-wars': data = await import('@/data/en/font-generator/star-wars.json'); break
            }
          }
          if (data) {
            return data.default || data
          }
        } catch (fallbackError) {
          return null
        }
      }
      return null
    }
    
    return null
  } catch (error) {
    return null
  }
}

// 加载 L2 页面的 SEO 内容（工具主页面，无 slug）
export async function getL2SeoContent(tool: string, locale: string = 'en') {
  try {
    // 规范化的 locale（处理 zh -> zh-TW 等映射）
    let normalizedLocale = locale
    if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
      normalizedLocale = 'zh-TW'
    }
    
    // 如果语言不在支持列表中，回退到英语
    if (!SUPPORTED_LOCALES.includes(normalizedLocale)) {
      normalizedLocale = 'en'
    }

    let data: any = null

    try {
      if (tool === 'font-generator') {
        if (normalizedLocale === 'en') {
          data = await import('@/data/en/font-generator.json')
        } else {
          // 对于其他语言，尝试加载，如果不存在则回退到英语
          try {
            data = await import(`@/data/${normalizedLocale}/font-generator.json`)
          } catch (e) {
            data = await import('@/data/en/font-generator.json')
          }
        }
      }
      // 可以在这里添加其他工具的 L2 页面支持
      
      if (data) {
        return data.default || data
      }
    } catch (importError) {
      // 如果指定语言文件不存在，回退到英语
      if (normalizedLocale !== 'en' && tool === 'font-generator') {
        try {
          data = await import('@/data/en/font-generator.json')
          if (data) {
            return data.default || data
          }
        } catch (fallbackError) {
          return null
        }
      }
      return null
    }
    
    return null
  } catch (error) {
    return null
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
      // 加载独立的 JSON 文件
      const independentData = await loadToolJsonFile(locale, 'image-converter', slug);
      if (independentData) {
        return independentData;
      }
      return null;
    }
    if (tool === 'font-generator') {
      // 加载独立的 JSON 文件
      const independentData = await loadToolJsonFile(locale, 'font-generator', slug);
      if (independentData) {
        return independentData;
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
export async function getAllSlugs(tool: string, locale: string = 'en'): Promise<string[]> {
  try {
    if (tool === 'image-compressor' || tool === 'image-compression') {
      const data = await loadJsonData(locale, 'image-compression.json');
      if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        return Array.isArray(keys) ? keys : [];
      }
      return [];
    }
    if (tool === 'image-converter' || tool === 'image-conversion') {
      // 对于 image-converter，使用预定义的 slug 列表
      // 这样可以避免加载整个 JSON 文件，只返回可用的工具列表
      return Array.isArray(IMAGE_CONVERTER_SLUGS) ? [...IMAGE_CONVERTER_SLUGS] : [];
    }
    if (tool === 'font-generator') {
      // 对于 font-generator，使用预定义的 slug 列表
      return Array.isArray(FONT_GENERATOR_SLUGS) ? [...FONT_GENERATOR_SLUGS] : [];
    }
    return [];
  } catch (error) {
    console.error(`Error in getAllSlugs for ${tool}:`, error);
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