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
          if (tool === 'image-converter') {
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
          } else if (tool === 'font-generator') {
            switch (slug) {
              case 'cursive': data = await import('@/data/de/font-generator/cursive.json'); break
              case 'fancy': data = await import('@/data/de/font-generator/fancy.json'); break
              case 'bold': data = await import('@/data/de/font-generator/bold.json'); break
              case 'tattoo': data = await import('@/data/de/font-generator/tattoo.json'); break
              case 'cool': data = await import('@/data/de/font-generator/cool.json'); break
              case 'instagram': data = await import('@/data/de/font-generator/instagram.json'); break
              case 'italic': data = await import('@/data/de/font-generator/italic.json'); break
              case 'gothic': data = await import('@/data/de/font-generator/gothic.json'); break
              case 'calligraphy': data = await import('@/data/de/font-generator/calligraphy.json'); break
              case 'discord': data = await import('@/data/de/font-generator/discord.json'); break
              case 'old-english': data = await import('@/data/de/font-generator/old-english.json'); break
              case '3d': data = await import('@/data/de/font-generator/3d.json'); break
              case 'minecraft': data = await import('@/data/de/font-generator/minecraft.json'); break
              case 'disney': data = await import('@/data/de/font-generator/disney.json'); break
              case 'bubble': data = await import('@/data/de/font-generator/bubble.json'); break
              case 'star-wars': data = await import('@/data/de/font-generator/star-wars.json'); break
            }
          }
          break
        case 'ja':
          if (tool === 'image-converter') {
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
          } else if (tool === 'font-generator') {
            switch (slug) {
              case 'cursive': data = await import('@/data/ja/font-generator/cursive.json'); break
              case 'fancy': data = await import('@/data/ja/font-generator/fancy.json'); break
              case 'bold': data = await import('@/data/ja/font-generator/bold.json'); break
              case 'tattoo': data = await import('@/data/ja/font-generator/tattoo.json'); break
              case 'cool': data = await import('@/data/ja/font-generator/cool.json'); break
              case 'instagram': data = await import('@/data/ja/font-generator/instagram.json'); break
              case 'italic': data = await import('@/data/ja/font-generator/italic.json'); break
              case 'gothic': data = await import('@/data/ja/font-generator/gothic.json'); break
              case 'calligraphy': data = await import('@/data/ja/font-generator/calligraphy.json'); break
              case 'discord': data = await import('@/data/ja/font-generator/discord.json'); break
              case 'old-english': data = await import('@/data/ja/font-generator/old-english.json'); break
              case '3d': data = await import('@/data/ja/font-generator/3d.json'); break
              case 'minecraft': data = await import('@/data/ja/font-generator/minecraft.json'); break
              case 'disney': data = await import('@/data/ja/font-generator/disney.json'); break
              case 'bubble': data = await import('@/data/ja/font-generator/bubble.json'); break
              case 'star-wars': data = await import('@/data/ja/font-generator/star-wars.json'); break
            }
          }
          break
        case 'es':
          if (tool === 'image-converter') {
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
          } else if (tool === 'font-generator') {
            switch (slug) {
              case 'cursive': data = await import('@/data/es/font-generator/cursive.json'); break
              case 'fancy': data = await import('@/data/es/font-generator/fancy.json'); break
              case 'bold': data = await import('@/data/es/font-generator/bold.json'); break
              case 'tattoo': data = await import('@/data/es/font-generator/tattoo.json'); break
              case 'cool': data = await import('@/data/es/font-generator/cool.json'); break
              case 'instagram': data = await import('@/data/es/font-generator/instagram.json'); break
              case 'italic': data = await import('@/data/es/font-generator/italic.json'); break
              case 'gothic': data = await import('@/data/es/font-generator/gothic.json'); break
              case 'calligraphy': data = await import('@/data/es/font-generator/calligraphy.json'); break
              case 'discord': data = await import('@/data/es/font-generator/discord.json'); break
              case 'old-english': data = await import('@/data/es/font-generator/old-english.json'); break
              case '3d': data = await import('@/data/es/font-generator/3d.json'); break
              case 'minecraft': data = await import('@/data/es/font-generator/minecraft.json'); break
              case 'disney': data = await import('@/data/es/font-generator/disney.json'); break
              case 'bubble': data = await import('@/data/es/font-generator/bubble.json'); break
              case 'star-wars': data = await import('@/data/es/font-generator/star-wars.json'); break
            }
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
          if (tool === 'image-converter') {
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
          } else if (tool === 'font-generator') {
            switch (slug) {
              case 'cursive': data = await import('@/data/fr/font-generator/cursive.json'); break
              case 'fancy': data = await import('@/data/fr/font-generator/fancy.json'); break
              case 'bold': data = await import('@/data/fr/font-generator/bold.json'); break
              case 'tattoo': data = await import('@/data/fr/font-generator/tattoo.json'); break
              case 'cool': data = await import('@/data/fr/font-generator/cool.json'); break
              case 'instagram': data = await import('@/data/fr/font-generator/instagram.json'); break
              case 'italic': data = await import('@/data/fr/font-generator/italic.json'); break
              case 'gothic': data = await import('@/data/fr/font-generator/gothic.json'); break
              case 'calligraphy': data = await import('@/data/fr/font-generator/calligraphy.json'); break
              case 'discord': data = await import('@/data/fr/font-generator/discord.json'); break
              case 'old-english': data = await import('@/data/fr/font-generator/old-english.json'); break
              case '3d': data = await import('@/data/fr/font-generator/3d.json'); break
              case 'minecraft': data = await import('@/data/fr/font-generator/minecraft.json'); break
              case 'disney': data = await import('@/data/fr/font-generator/disney.json'); break
              case 'bubble': data = await import('@/data/fr/font-generator/bubble.json'); break
              case 'star-wars': data = await import('@/data/fr/font-generator/star-wars.json'); break
            }
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
      
      // 对于 font-generator，如果语言不在支持列表中，不自动回退到英语
      // 这样 page.tsx 可以检测到 content 为 null 并执行重定向
      // 支持的语言列表：en, de, ja, es, fr
      // 注意：这里不进行自动回退，让上层处理重定向逻辑
      
      if (data) {
        return data.default || data
      }
    } catch (importError) {
      // 如果指定语言文件不存在，对于 font-generator、image-converter 和 image-compressor，不自动回退到英语
      // 返回 null 让上层处理重定向逻辑
      if (normalizedLocale !== 'en') {
        // font-generator 只支持 en, de, ja, es, fr
        // 如果语言不在支持列表中，不自动回退，返回 null 让上层处理重定向
        if (tool === 'font-generator') {
          const supportedFontGeneratorLocales = ['en', 'de', 'ja', 'es', 'fr']
          if (!supportedFontGeneratorLocales.includes(normalizedLocale)) {
            return null
          }
        }
        
        // image-converter 和 image-compressor：如果文件不存在，返回 null（不回退到英语）
        // 这样 page.tsx 可以检测到 content 为 null 并执行重定向
        if (tool === 'image-converter' || tool === 'image-compressor' || tool === 'image-compression') {
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
    
    // font-generator 只支持 en, de, ja, es, fr
    const fontGeneratorSupportedLocales = ['en', 'de', 'ja', 'es', 'fr']
    if (tool === 'font-generator' && !fontGeneratorSupportedLocales.includes(normalizedLocale)) {
      // 对于不支持的语言，返回null，让页面重定向到英语版本
      return null
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
        } else if (fontGeneratorSupportedLocales.includes(normalizedLocale)) {
          // 只尝试加载支持的语言，如果不存在则返回null（不回退到英语）
          try {
            data = await import(`@/data/${normalizedLocale}/font-generator.json`)
          } catch (e) {
            // 对于font-generator，如果支持的语言文件不存在，返回null而不是回退到英语
            return null
          }
        } else {
          // 不支持的语言，返回null
          return null
        }
      } else if (tool === 'image-compressor' || tool === 'image-compression') {
        if (normalizedLocale === 'en') {
          data = await import('@/data/en/image-compressor.json')
        } else {
          // 对于其他语言，尝试加载，如果不存在则返回null（不回退到英语，让页面重定向）
          try {
            data = await import(`@/data/${normalizedLocale}/image-compressor.json`)
          } catch (e) {
            // 对于image-compressor，如果支持的语言文件不存在，返回null而不是回退到英语
            return null
          }
        }
      } else if (tool === 'image-converter' || tool === 'image-conversion') {
        if (normalizedLocale === 'en') {
          data = await import('@/data/en/image-converter.json')
        } else {
          // 对于其他语言，尝试加载，如果不存在则返回null（不回退到英语，让页面重定向）
          try {
            data = await import(`@/data/${normalizedLocale}/image-converter.json`)
          } catch (e) {
            // 对于image-converter，如果支持的语言文件不存在，返回null而不是回退到英语
            return null
          }
        }
      }
      
      if (data) {
        return data.default || data
      }
    } catch (importError) {
      // 如果指定语言文件不存在，对于font-generator、image-compressor和image-converter返回null（不回退到英语），让页面重定向
      if (normalizedLocale !== 'en') {
        // font-generator、image-compressor和image-converter不支持的语言或文件不存在时，返回null
        if (tool === 'font-generator' || tool === 'image-compressor' || tool === 'image-compression' || tool === 'image-converter' || tool === 'image-conversion') {
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

// 从 slug 提取类别名称（用于替换占位符）
function getCategoryNameFromSlug(slug: string): string {
  // 将 slug 转换为类别名称：将连字符替换为空格，并保持小写
  return slug.replace(/-/g, ' ').toLowerCase();
}

// 递归替换对象中所有字符串的占位符
function replacePlaceholders(obj: any, categoryName: string): any {
  if (typeof obj === 'string') {
    // 替换字符串中的占位符
    return obj.replace(/\$\{category\.name\.toLowerCase\(\)\}/g, categoryName);
  } else if (Array.isArray(obj)) {
    // 递归处理数组
    return obj.map(item => replacePlaceholders(item, categoryName));
  } else if (obj !== null && typeof obj === 'object') {
    // 递归处理对象
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = replacePlaceholders(obj[key], categoryName);
      }
    }
    return result;
  }
  return obj;
}

export async function getSeoContent(tool: string, slug: string, locale: string = 'en') {
  try {
    if (tool === 'image-compressor' || tool === 'image-compression') {
      // 规范化的 locale（处理 zh -> zh-TW 等映射）
      let normalizedLocale = locale
      if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') {
        normalizedLocale = 'zh-TW'
      }
      
      // 如果语言不在支持列表中，返回null（不回退到英语）
      if (!SUPPORTED_LOCALES.includes(normalizedLocale)) {
        return null
      }
      
      let data: any = null
      
      // 尝试加载指定语言的文件
      if (normalizedLocale === 'en') {
        try {
          data = await import('@/data/en/image-compression.json')
          data = data.default || data
        } catch (e) {
          return null
        }
      } else {
        // 对于其他语言，尝试加载，如果不存在则返回null（不回退到英语）
        try {
          data = await import(`@/data/${normalizedLocale}/image-compression.json`)
          data = data.default || data
        } catch (e) {
          // 如果语言文件不存在，返回null（不回退到英语）
          return null
        }
      }
      
      // 检查slug是否存在
      if (data && data[slug]) {
        return data[slug]
      }
      // 如果slug不存在，返回null（不回退到英语）
      return null
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
        // 提取类别名称并替换占位符
        const categoryName = getCategoryNameFromSlug(slug);
        const processedData = replacePlaceholders(independentData, categoryName);
        return processedData;
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

// 获取所有工具列表（用于主页和 sitemap）
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
  
  // 添加字体生成工具（支持 en、de、ja、es 和 fr）
  if (locale === 'en' || locale === 'de' || locale === 'ja' || locale === 'es' || locale === 'fr') {
    const fontGeneratorSlugs = await getAllSlugs('font-generator', locale)
    for (const slug of fontGeneratorSlugs) {
      tools.push({ tool: 'font-generator', slug })
    }
  }
  
  return tools
}

// 加载工具数据（用于主页）
export async function loadToolData(tool: string, slug: string, locale: string = 'en') {
  return getSeoContent(tool, slug, locale)
}