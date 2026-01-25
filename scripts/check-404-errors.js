const https = require('https')
const http = require('http')
const { URL } = require('url')
const fs = require('fs')
const path = require('path')

// 配置
const baseUrl = process.env.BASE_URL || 'https://toolaze.com'
const maxConcurrent = 10 // 最大并发请求数
const timeout = 10000 // 请求超时时间（毫秒）

// 支持的locale
const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const STATIC_PAGES = ['about', 'privacy', 'terms']
const TOOL_PAGES = ['image-compressor', 'image-converter', 'font-generator']

// Font Generator slugs
const FONT_GENERATOR_SLUGS = [
  'cursive', 'fancy', 'bold', 'tattoo', 'cool', 'instagram', 'italic', 'gothic',
  'calligraphy', 'discord', 'old-english', '3d', 'minecraft', 'disney', 'bubble', 'star-wars'
]

// Image Converter slugs
const IMAGE_CONVERTER_SLUGS = [
  'jpg-to-png', 'png-to-jpg', 'webp-to-jpg', 'webp-to-png',
  'png-to-webp', 'jpg-to-webp', 'heic-to-jpg', 'heic-to-png', 'heic-to-webp'
]

// 从文件系统获取所有工具URL
function getAllToolUrls() {
  const urls = []

  // 1. 首页（所有语言版本）
  SUPPORTED_LOCALES.forEach((locale) => {
    const urlPath = locale === 'en' ? '' : `/${locale}`
    urls.push(`${baseUrl}${urlPath}`)
  })

  // 2. 静态页面（所有语言版本）
  STATIC_PAGES.forEach((page) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const urlPath = locale === 'en' ? `/${page}` : `/${locale}/${page}`
      urls.push(`${baseUrl}${urlPath}`)
    })
  })

  // 3. 工具L2页面（所有语言版本）
  TOOL_PAGES.forEach((tool) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      // font-generator 支持 en、de、ja、es 和 fr
      if (tool === 'font-generator' && locale !== 'en' && locale !== 'de' && locale !== 'ja' && locale !== 'es' && locale !== 'fr') {
        return
      }
      const urlPath = locale === 'en' ? `/${tool}` : `/${locale}/${tool}`
      urls.push(`${baseUrl}${urlPath}`)
    })
  })

  // 4. 工具L3页面
  // Image Compressor L3 - 从JSON文件读取（只读取en版本，其他语言使用相同slug）
  try {
    const compressionDataPath = path.join(__dirname, '../src/data/en/image-compression.json')
    if (fs.existsSync(compressionDataPath)) {
      const compressionData = JSON.parse(fs.readFileSync(compressionDataPath, 'utf8'))
      // image-compression.json 是一个对象，key是slug（排除metadata等顶层字段）
      const compressorSlugs = Object.keys(compressionData).filter(key => {
        const value = compressionData[key]
        return value && typeof value === 'object' && value.metadata !== undefined
      })
      SUPPORTED_LOCALES.forEach((locale) => {
        compressorSlugs.forEach((slug) => {
          const urlPath = locale === 'en' 
            ? `/image-compressor/${slug}`
            : `/${locale}/image-compressor/${slug}`
          urls.push(`${baseUrl}${urlPath}`)
        })
      })
    }
  } catch (error) {
    console.warn('Failed to load image-compressor slugs:', error.message)
  }

  // Image Converter L3
  SUPPORTED_LOCALES.forEach((locale) => {
    IMAGE_CONVERTER_SLUGS.forEach((slug) => {
      const urlPath = locale === 'en' 
        ? `/image-converter/${slug}`
        : `/${locale}/image-converter/${slug}`
      urls.push(`${baseUrl}${urlPath}`)
    })
  })

  // Font Generator L3（支持 en、de、ja、es 和 fr）
  // 注意：其他语言（ko, zh-TW, pt, it）的L3页面会被重定向到英语版本，所以不在这里检查
  const fontGeneratorLocales = ['en', 'de', 'ja', 'es', 'fr']
  fontGeneratorLocales.forEach((locale) => {
    FONT_GENERATOR_SLUGS.forEach((slug) => {
      const urlPath = locale === 'en' 
        ? `/font-generator/${slug}`
        : `/${locale}/font-generator/${slug}`
      urls.push(`${baseUrl}${urlPath}`)
    })
  })

  return urls
}

// 检查单个URL
function checkUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD', // 使用HEAD请求，更快
      timeout: timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; 404Checker/1.0)'
      }
    }

    const req = client.request(options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 400
      })
      res.destroy()
    })

    req.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        ok: false,
        error: error.message
      })
    })

    req.on('timeout', () => {
      req.destroy()
      resolve({
        url,
        status: 'TIMEOUT',
        ok: false,
        error: 'Request timeout'
      })
    })

    req.end()
  })
}

// 并发控制检查URL
async function checkUrlsConcurrently(urls) {
  const results = []
  const errors = []
  let index = 0

  async function checkNext() {
    while (index < urls.length) {
      const currentIndex = index++
      const url = urls[currentIndex]
      
      try {
        const result = await checkUrl(url)
        results.push(result)
        
        if (!result.ok) {
          errors.push(result)
        }
        
        // 显示进度
        if ((currentIndex + 1) % 10 === 0 || currentIndex + 1 === urls.length) {
          process.stdout.write(`\r检查进度: ${currentIndex + 1}/${urls.length} (错误: ${errors.length})`)
        }
      } catch (error) {
        errors.push({
          url,
          status: 'EXCEPTION',
          ok: false,
          error: error.message
        })
      }
    }
  }

  // 启动并发请求
  const promises = []
  for (let i = 0; i < Math.min(maxConcurrent, urls.length); i++) {
    promises.push(checkNext())
  }

  await Promise.all(promises)
  process.stdout.write('\n')

  return { results, errors }
}

// 主函数
async function main() {
  console.log('🔍 开始检查网站404错误...\n')
  console.log(`基础URL: ${baseUrl}`)
  console.log(`最大并发数: ${maxConcurrent}`)
  console.log(`请求超时: ${timeout}ms\n`)
  console.log('='.repeat(80))

  try {
    // 获取所有URL
    console.log('\n📋 正在获取所有页面URL...')
    const urls = getAllToolUrls()
    console.log(`✅ 找到 ${urls.length} 个页面\n`)

    if (urls.length === 0) {
      console.log('❌ 没有找到任何URL')
      process.exit(1)
    }

    // 检查所有URL
    console.log('🔍 开始检查页面状态...\n')
    const { results, errors } = await checkUrlsConcurrently(urls)

    // 统计结果
    const statusCounts = {}
    results.forEach(r => {
      const status = r.status
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    // 显示统计
    console.log('\n' + '='.repeat(80))
    console.log('\n📊 检查结果统计:\n')
    console.log(`总页面数: ${urls.length}`)
    console.log(`成功 (200-399): ${results.filter(r => r.ok).length}`)
    console.log(`错误 (400+): ${results.filter(r => !r.ok && typeof r.status === 'number').length}`)
    console.log(`异常/超时: ${results.filter(r => typeof r.status === 'string').length}`)
    
    console.log('\n状态码分布:')
    Object.entries(statusCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`)
      })

    // 显示404错误
    if (errors.length > 0) {
      console.log('\n' + '='.repeat(80))
      console.log(`\n❌ 发现 ${errors.length} 个错误:\n`)
      
      // 按状态码分组
      const errorsByStatus = {}
      errors.forEach(e => {
        const status = e.status
        if (!errorsByStatus[status]) {
          errorsByStatus[status] = []
        }
        errorsByStatus[status].push(e)
      })

      Object.entries(errorsByStatus)
        .sort((a, b) => {
          // 数字状态码排在前面
          const aIsNum = typeof a[0] === 'string' && !isNaN(a[0])
          const bIsNum = typeof b[0] === 'string' && !isNaN(b[0])
          if (aIsNum && !bIsNum) return -1
          if (!aIsNum && bIsNum) return 1
          return a[0].localeCompare(b[0])
        })
        .forEach(([status, errorList]) => {
          console.log(`\n${status} (${errorList.length} 个):`)
          errorList.forEach(e => {
            console.log(`  - ${e.url}`)
            if (e.error) {
              console.log(`    错误: ${e.error}`)
            }
          })
        })

      console.log('\n' + '='.repeat(80))
      process.exit(1)
    } else {
      console.log('\n' + '='.repeat(80))
      console.log('\n✅ 所有页面检查通过，没有发现404错误！\n')
      process.exit(0)
    }
  } catch (error) {
    console.error('\n❌ 检查过程出错:', error)
    process.exit(1)
  }
}

// 运行
main()
