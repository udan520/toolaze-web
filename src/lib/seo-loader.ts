import path from 'path'
import fs from 'fs'

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

// 视频模型 L2 列表（用于「更多工具」推荐，仅推荐同类型 L2）
export const VIDEO_MODEL_L2S = ['seedance-2', 'kling-3']

// 图片模型 L2 列表（用于「更多工具」推荐，仅推荐同类型 L2）
export const IMAGE_MODEL_L2S = ['nano-banana-pro', 'nano-banana-2']

// Seedance 2.0 L3 页面 slug 列表（按搜索量/优先级）
const SEEDANCE_2_SLUGS = [
  'text-to-video',
  'image-to-video',
  'ai-video-generator',
]

// Watermark Remover L3 页面 slug 列表（从文件系统动态读取，此为兜底）
const WATERMARK_REMOVER_SLUGS_FALLBACK = [
  'how-to-remove-watermark-from-photo',
]

/** 规范化 watermark-remover 内容格式，兼容旧版/不同结构 */
function normalizeWatermarkRemoverContent(data: Record<string, unknown>): Record<string, unknown> {
  const c = { ...data }
  if (c.scenes && typeof c.scenes === 'object' && !Array.isArray(c.scenes) && 'list' in c.scenes) {
    const s = c.scenes as { title?: string; list?: Array<{ icon?: string; title?: string; desc?: string }> }
    if (s.title) c.scenesTitle = s.title
    c.scenes = Array.isArray(s.list) ? s.list.map((x) => ({ icon: x.icon || '📷', title: x.title || '', desc: x.desc || '' })) : []
  }
  if (c.faq && typeof c.faq === 'object' && !Array.isArray(c.faq) && 'list' in c.faq) {
    const f = c.faq as { title?: string; list?: Array<{ question?: string; answer?: string }> }
    if (f.title) c.faqTitle = f.title
    c.faq = Array.isArray(f.list) ? f.list.map((x) => ({ q: x.question || '', a: x.answer || '' })) : []
  }
  if (c.features && typeof c.features === 'object' && 'list' in c.features && !('items' in c.features)) {
    const f = c.features as { title?: string; list?: string[] }
    const items = Array.isArray(f.list) ? f.list.map((s) => ({ icon: '🤖', iconType: 'ai' as const, title: s, desc: s })) : []
    c.features = { ...f, items }
  }
  return c
}

function getWatermarkRemoverSlugsFromFs(locale: string): string[] {
  try {
    const dir = path.join(process.cwd(), 'src', 'data', locale === 'en' ? 'en' : locale, 'watermark-remover')
    if (!fs.existsSync(dir)) return WATERMARK_REMOVER_SLUGS_FALLBACK
    const files = fs.readdirSync(dir)
    return files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''))
  } catch {
    return WATERMARK_REMOVER_SLUGS_FALLBACK
  }
}

// Emoji Copy & Paste L3 页面 slug 列表（按搜索量/优先级）
const EMOJI_COPY_PASTE_SLUGS = [
  'crying-copy-and-paste',
  'cross-copy-and-paste',
  'adults-only-copy-and-paste',
  'fire-copy-and-paste',
  'birthday-copy-and-paste',
  'cat-copy-and-paste',
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
    if (tool === 'emoji-copy-and-paste' && !EMOJI_COPY_PASTE_SLUGS.includes(slug)) {
      return null
    }
    if (tool === 'seedance-2' && !SEEDANCE_2_SLUGS.includes(slug)) {
      return null
    }
    // watermark-remover: 允许任意 slug，由 fs 动态加载

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
          } else if (tool === 'emoji-copy-and-paste') {
            switch (slug) {
              case 'crying-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/crying-copy-and-paste.json'); break
              case 'cross-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/cross-copy-and-paste.json'); break
              case 'adults-only-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/adults-only-copy-and-paste.json'); break
              case 'fire-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/fire-copy-and-paste.json'); break
              case 'birthday-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/birthday-copy-and-paste.json'); break
              case 'cat-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/cat-copy-and-paste.json'); break
            }
          } else if (tool === 'seedance-2') {
            switch (slug) {
              case 'text-to-video': data = await import('@/data/en/seedance-2/text-to-video.json'); break
              case 'image-to-video': data = await import('@/data/en/seedance-2/image-to-video.json'); break
              case 'ai-video-generator': data = await import('@/data/en/seedance-2/ai-video-generator.json'); break
            }
          } else if (tool === 'watermark-remover') {
            switch (slug) {
              case 'how-to-remove-watermark-from-photo': data = await import('@/data/en/watermark-remover/how-to-remove-watermark-from-photo.json'); break
              default:
                try {
                  const fp = path.join(process.cwd(), 'src', 'data', 'en', 'watermark-remover', `${slug}.json`)
                  if (fs.existsSync(fp)) {
                    data = { default: JSON.parse(fs.readFileSync(fp, 'utf-8')) }
                  }
                } catch {}
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
      // 如果指定语言文件不存在，回退到英语
      // 但对于 font-generator，如果语言不在支持列表中，不自动回退，让上层处理重定向
      if (normalizedLocale !== 'en') {
        // font-generator 只支持 en, de, ja, es, fr
        // 如果语言不在支持列表中，不自动回退，返回 null 让上层处理重定向
        if (tool === 'font-generator') {
          const supportedFontGeneratorLocales = ['en', 'de', 'ja', 'es', 'fr']
          if (!supportedFontGeneratorLocales.includes(normalizedLocale)) {
            return null
          }
        }
        
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
            // 只有在支持的语言列表中才会执行到这里（因为上面已经检查过了）
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
          } else if (tool === 'emoji-copy-and-paste') {
            switch (slug) {
              case 'crying-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/crying-copy-and-paste.json'); break
              case 'cross-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/cross-copy-and-paste.json'); break
              case 'adults-only-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/adults-only-copy-and-paste.json'); break
              case 'fire-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/fire-copy-and-paste.json'); break
              case 'birthday-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/birthday-copy-and-paste.json'); break
              case 'cat-copy-and-paste': data = await import('@/data/en/emoji-copy-and-paste/cat-copy-and-paste.json'); break
            }
          } else if (tool === 'seedance-2') {
            switch (slug) {
              case 'text-to-video': data = await import('@/data/en/seedance-2/text-to-video.json'); break
              case 'image-to-video': data = await import('@/data/en/seedance-2/image-to-video.json'); break
              case 'ai-video-generator': data = await import('@/data/en/seedance-2/ai-video-generator.json'); break
            }
          } else if (tool === 'watermark-remover') {
            try {
              const fp = path.join(process.cwd(), 'src', 'data', 'en', 'watermark-remover', `${slug}.json`)
              if (fs.existsSync(fp)) {
                data = { default: JSON.parse(fs.readFileSync(fp, 'utf-8')) }
              }
            } catch {}
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
      } else if (tool === 'image-compressor' || tool === 'image-compression') {
        if (normalizedLocale === 'en') {
          data = await import('@/data/en/image-compressor.json')
        } else {
          // 对于其他语言，尝试加载，如果不存在则回退到英语
          try {
            data = await import(`@/data/${normalizedLocale}/image-compressor.json`)
          } catch (e) {
            data = await import('@/data/en/image-compressor.json')
          }
        }
      } else if (tool === 'image-converter' || tool === 'image-conversion') {
        if (normalizedLocale === 'en') {
          data = await import('@/data/en/image-converter.json')
        } else {
          // 对于其他语言，尝试加载，如果不存在则回退到英语
          try {
            data = await import(`@/data/${normalizedLocale}/image-converter.json`)
          } catch (e) {
            data = await import('@/data/en/image-converter.json')
          }
        }
      } else if (tool === 'emoji-copy-and-paste') {
        data = await import('@/data/en/emoji-copy-and-paste.json')
      } else if (tool === 'nano-banana-pro') {
        if (normalizedLocale === 'en') {
          data = await import('@/data/en/nano-banana-pro.json')
        } else {
          // 对于其他语言，尝试加载，如果不存在则回退到英语
          try {
            data = await import(`@/data/${normalizedLocale}/nano-banana-pro.json`)
          } catch (e) {
            data = await import('@/data/en/nano-banana-pro.json')
          }
        }
      } else if (tool === 'nano-banana-2') {
        data = await import('@/data/en/nano-banana-2.json')
      } else if (tool === 'seedance-2') {
        data = await import('@/data/en/seedance-2.json')
      } else if (tool === 'kling-3') {
        data = await import('@/data/en/kling-3.json')
      } else if (tool === 'watermark-remover') {
        data = await import('@/data/en/watermark-remover.json')
      }
      
      const resolved = data?.default || data
      if (resolved && isPublished(resolved)) {
        return resolved
      }
      return null
    } catch (importError) {
      // 如果指定语言文件不存在，回退到英语
      if (normalizedLocale !== 'en') {
        try {
          if (tool === 'font-generator') {
            data = await import('@/data/en/font-generator.json')
          } else if (tool === 'image-compressor' || tool === 'image-compression') {
            data = await import('@/data/en/image-compressor.json')
          } else if (tool === 'image-converter' || tool === 'image-conversion') {
            data = await import('@/data/en/image-converter.json')
          } else if (tool === 'emoji-copy-and-paste') {
            data = await import('@/data/en/emoji-copy-and-paste.json')
          } else if (tool === 'nano-banana-pro') {
            data = await import('@/data/en/nano-banana-pro.json')
          } else if (tool === 'nano-banana-2') {
            data = await import('@/data/en/nano-banana-2.json')
          } else if (tool === 'seedance-2') {
            data = await import('@/data/en/seedance-2.json')
          } else if (tool === 'kling-3') {
            data = await import('@/data/en/kling-3.json')
          } else if (tool === 'watermark-remover') {
            data = await import('@/data/en/watermark-remover.json')
          }
          const fallbackResolved = data?.default || data
          if (fallbackResolved && isPublished(fallbackResolved)) {
            return fallbackResolved
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

/** 检查页面是否上架（metadata.published !== false，默认上架） */
function isPublished(data: Record<string, unknown> | null): boolean {
  return data?.metadata?.published !== false
}

export async function getSeoContent(tool: string, slug: string, locale: string = 'en') {
  try {
    if (tool === 'image-compressor' || tool === 'image-compression') {
      const data = await loadJsonData(locale, 'image-compression.json');
      const pageData = data?.[slug as keyof typeof data];
      if (pageData && isPublished(pageData as Record<string, unknown>)) {
        return pageData;
      }
      return null;
    }
    if (tool === 'image-converter' || tool === 'image-conversion') {
      const independentData = await loadToolJsonFile(locale, 'image-converter', slug);
      if (independentData && isPublished(independentData)) {
        return independentData;
      }
      return null;
    }
    if (tool === 'font-generator') {
      const independentData = await loadToolJsonFile(locale, 'font-generator', slug);
      if (independentData && isPublished(independentData)) {
        const categoryName = getCategoryNameFromSlug(slug);
        return replacePlaceholders(independentData, categoryName);
      }
      return null;
    }
    if (tool === 'emoji-copy-and-paste') {
      const independentData = await loadToolJsonFile(locale, 'emoji-copy-and-paste', slug);
      return independentData && isPublished(independentData) ? independentData : null;
    }
    if (tool === 'seedance-2') {
      const independentData = await loadToolJsonFile(locale, 'seedance-2', slug);
      return independentData && isPublished(independentData) ? independentData : null;
    }
    if (tool === 'watermark-remover') {
      const independentData = await loadToolJsonFile(locale, 'watermark-remover', slug);
      const normalized = independentData ? normalizeWatermarkRemoverContent(independentData) : null;
      return normalized && isPublished(normalized) ? normalized : null;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// 供生成静态页面使用（仅返回上架页面的 slug，下架页面不会出现在测试服/线上）
export async function getAllSlugs(tool: string, locale: string = 'en'): Promise<string[]> {
  try {
    if (tool === 'image-compressor' || tool === 'image-compression') {
      const data = await loadJsonData(locale, 'image-compression.json');
      if (data && typeof data === 'object') {
        return Object.keys(data).filter((k) => isPublished((data as Record<string, unknown>)[k] as Record<string, unknown>));
      }
      return [];
    }
    if (tool === 'image-converter' || tool === 'image-conversion') {
      const candidates = Array.isArray(IMAGE_CONVERTER_SLUGS) ? [...IMAGE_CONVERTER_SLUGS] : [];
      const results: string[] = [];
      for (const slug of candidates) {
        const d = await loadToolJsonFile(locale, 'image-converter', slug);
        if (d && isPublished(d)) results.push(slug);
      }
      return results;
    }
    if (tool === 'font-generator') {
      const candidates = Array.isArray(FONT_GENERATOR_SLUGS) ? [...FONT_GENERATOR_SLUGS] : [];
      const results: string[] = [];
      for (const slug of candidates) {
        const d = await loadToolJsonFile(locale, 'font-generator', slug);
        if (d && isPublished(d)) results.push(slug);
      }
      return results;
    }
    if (tool === 'emoji-copy-and-paste') {
      const candidates = Array.isArray(EMOJI_COPY_PASTE_SLUGS) ? [...EMOJI_COPY_PASTE_SLUGS] : [];
      const results: string[] = [];
      for (const slug of candidates) {
        const d = await loadToolJsonFile(locale, 'emoji-copy-and-paste', slug);
        if (d && isPublished(d)) results.push(slug);
      }
      return results;
    }
    if (tool === 'seedance-2') {
      const candidates = Array.isArray(SEEDANCE_2_SLUGS) ? [...SEEDANCE_2_SLUGS] : [];
      const results: string[] = [];
      for (const slug of candidates) {
        const d = await loadToolJsonFile(locale, 'seedance-2', slug);
        if (d && isPublished(d)) results.push(slug);
      }
      return results;
    }
    if (tool === 'watermark-remover') {
      const candidates = getWatermarkRemoverSlugsFromFs(locale);
      const results: string[] = [];
      for (const slug of candidates) {
        const d = await loadToolJsonFile(locale, 'watermark-remover', slug);
        const normalized = d ? normalizeWatermarkRemoverContent(d) : null;
        if (normalized && isPublished(normalized)) results.push(slug);
      }
      return results;
    }
    if (tool === 'nano-banana-pro' || tool === 'nano-banana-2') {
      return [];
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
  
  // 添加 Emoji Copy & Paste L3 页面（目前仅英文有内容，其他 locale 回退到英文）
  const emojiSlugs = await getAllSlugs('emoji-copy-and-paste', locale)
  for (const slug of emojiSlugs) {
    tools.push({ tool: 'emoji-copy-and-paste', slug })
  }
  
  // 添加 Seedance 2.0 L3 页面（目前仅英文）
  const seedanceSlugs = await getAllSlugs('seedance-2', locale)
  for (const slug of seedanceSlugs) {
    tools.push({ tool: 'seedance-2', slug })
  }
  
  // 添加 Watermark Remover L3 页面（目前仅英文，无 locale 前缀）
  if (locale === 'en') {
    const watermarkRemoverSlugs = await getAllSlugs('watermark-remover', locale)
    for (const slug of watermarkRemoverSlugs) {
      tools.push({ tool: 'watermark-remover', slug })
    }
  }
  
  return tools
}

// 加载工具数据（用于主页）
export async function loadToolData(tool: string, slug: string, locale: string = 'en') {
  return getSeoContent(tool, slug, locale)
}