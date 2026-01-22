const fs = require('fs')
const path = require('path')

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const baseUrl = 'https://toolaze.com'

// 读取 sitemap.xml
function parseSitemap() {
  const sitemapPath = path.join(__dirname, '../out/sitemap.xml')
  if (!fs.existsSync(sitemapPath)) {
    return []
  }
  
  const content = fs.readFileSync(sitemapPath, 'utf8')
  const urls = []
  const locRegex = /<loc>(.*?)<\/loc>/g
  let match
  
  while ((match = locRegex.exec(content)) !== null) {
    urls.push(match[1])
  }
  
  return urls
}

// 获取所有工具页面
function getAllToolPages() {
  const pages = []
  
  // 静态页面
  const staticPages = [
    { path: '', locales: locales },
    { path: 'about', locales: locales },
    { path: 'privacy', locales: locales },
    { path: 'terms', locales: locales },
    { path: 'image-compressor', locales: locales },
    { path: 'image-converter', locales: locales },
  ]
  
  staticPages.forEach(page => {
    page.locales.forEach(locale => {
      if (locale === 'en') {
        pages.push(`${baseUrl}/${page.path}`)
      } else {
        pages.push(`${baseUrl}/${locale}/${page.path}`)
      }
    })
  })
  
  // Image Compressor 工具页面
  const compressionPath = path.join(__dirname, '../src/data/en/image-compression.json')
  if (fs.existsSync(compressionPath)) {
    const data = JSON.parse(fs.readFileSync(compressionPath, 'utf8'))
    Object.keys(data).forEach(slug => {
      locales.forEach(locale => {
        if (locale === 'en') {
          pages.push(`${baseUrl}/image-compressor/${slug}`)
        } else {
          pages.push(`${baseUrl}/${locale}/image-compressor/${slug}`)
        }
      })
    })
  }
  
  // Image Converter 工具页面
  const converterDir = path.join(__dirname, '../src/data/en/image-converter')
  if (fs.existsSync(converterDir)) {
    const files = fs.readdirSync(converterDir).filter(f => f.endsWith('.json'))
    files.forEach(file => {
      const slug = file.replace('.json', '')
      locales.forEach(locale => {
        if (locale === 'en') {
          pages.push(`${baseUrl}/image-converter/${slug}`)
        } else {
          pages.push(`${baseUrl}/${locale}/image-converter/${slug}`)
        }
      })
    })
  }
  
  return pages
}

// 主函数
function main() {
  console.log('检查 sitemap 完整性...\n')
  console.log('='.repeat(80))
  
  const sitemapUrls = parseSitemap()
  const expectedPages = getAllToolPages()
  
  console.log(`\nSitemap 中的 URL 数量: ${sitemapUrls.length}`)
  console.log(`预期页面数量: ${expectedPages.length}`)
  
  // 找出缺失的页面
  const missingPages = expectedPages.filter(page => !sitemapUrls.includes(page))
  const extraPages = sitemapUrls.filter(url => !expectedPages.includes(url) && url.startsWith(baseUrl))
  
  console.log('\n' + '='.repeat(80))
  
  if (missingPages.length > 0) {
    console.log(`\n⚠️  缺失的页面 (${missingPages.length}):\n`)
    missingPages.forEach(page => {
      console.log(`   - ${page}`)
    })
  } else {
    console.log('\n✅ 所有预期页面都在 sitemap 中')
  }
  
  if (extraPages.length > 0) {
    console.log(`\n⚠️  Sitemap 中的额外页面 (${extraPages.length}):\n`)
    extraPages.forEach(page => {
      console.log(`   - ${page}`)
    })
  }
  
  // 按工具分类检查
  console.log('\n' + '='.repeat(80))
  console.log('\n按工具分类检查:\n')
  
  // Image Compressor 工具
  const compressorSlugs = []
  const compressionPath = path.join(__dirname, '../src/data/en/image-compression.json')
  if (fs.existsSync(compressionPath)) {
    const data = JSON.parse(fs.readFileSync(compressionPath, 'utf8'))
    Object.keys(data).forEach(slug => compressorSlugs.push(slug))
  }
  
  console.log(`\nImage Compressor 工具 (${compressorSlugs.length} 个):`)
  compressorSlugs.forEach(slug => {
    const enUrl = `${baseUrl}/image-compressor/${slug}`
    const inSitemap = sitemapUrls.includes(enUrl)
    console.log(`  ${inSitemap ? '✅' : '❌'} ${slug}: ${inSitemap ? '已包含' : '缺失'}`)
  })
  
  // Image Converter 工具
  const converterSlugs = []
  const converterDir = path.join(__dirname, '../src/data/en/image-converter')
  if (fs.existsSync(converterDir)) {
    const files = fs.readdirSync(converterDir).filter(f => f.endsWith('.json'))
    files.forEach(file => converterSlugs.push(file.replace('.json', '')))
  }
  
  console.log(`\nImage Converter 工具 (${converterSlugs.length} 个):`)
  converterSlugs.forEach(slug => {
    const enUrl = `${baseUrl}/image-converter/${slug}`
    const inSitemap = sitemapUrls.includes(enUrl)
    console.log(`  ${inSitemap ? '✅' : '❌'} ${slug}: ${inSitemap ? '已包含' : '缺失'}`)
  })
  
  // 检查多语言版本
  console.log('\n' + '='.repeat(80))
  console.log('\n多语言版本检查:\n')
  
  const missingByLocale = {}
  locales.forEach(locale => {
    const missing = []
    compressorSlugs.forEach(slug => {
      const url = locale === 'en' 
        ? `${baseUrl}/image-compressor/${slug}`
        : `${baseUrl}/${locale}/image-compressor/${slug}`
      if (!sitemapUrls.includes(url)) {
        missing.push(`image-compressor/${slug}`)
      }
    })
    converterSlugs.forEach(slug => {
      const url = locale === 'en'
        ? `${baseUrl}/image-converter/${slug}`
        : `${baseUrl}/${locale}/image-converter/${slug}`
      if (!sitemapUrls.includes(url)) {
        missing.push(`image-converter/${slug}`)
      }
    })
    if (missing.length > 0) {
      missingByLocale[locale] = missing
    }
  })
  
  if (Object.keys(missingByLocale).length > 0) {
    console.log('⚠️  缺失多语言版本的页面:\n')
    Object.entries(missingByLocale).forEach(([locale, pages]) => {
      console.log(`  ${locale.toUpperCase()} (${pages.length} 个):`)
      pages.forEach(page => console.log(`    - ${page}`))
    })
  } else {
    console.log('✅ 所有语言版本都在 sitemap 中')
  }
  
  console.log('\n' + '='.repeat(80))
  
  if (missingPages.length > 0) {
    console.log('\n❌ 发现缺失的页面，请更新 sitemap')
    process.exit(1)
  } else {
    console.log('\n✅ Sitemap 完整，所有页面都已包含')
    process.exit(0)
  }
}

main()
