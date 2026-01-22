const fs = require('fs')
const path = require('path')

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const baseUrl = 'https://toolaze.com'

// 获取所有工具 slug
function getAllToolSlugs() {
  const slugs = {
    'image-compressor': [],
    'image-converter': []
  }
  
  // Image Compressor 工具
  const enCompressionPath = path.join(__dirname, '../src/data/en/image-compression.json')
  if (fs.existsSync(enCompressionPath)) {
    const data = JSON.parse(fs.readFileSync(enCompressionPath, 'utf8'))
    slugs['image-compressor'] = Object.keys(data)
  }
  
  // Image Converter 工具
  const enConverterDir = path.join(__dirname, '../src/data/en/image-converter')
  if (fs.existsSync(enConverterDir)) {
    const files = fs.readdirSync(enConverterDir).filter(f => f.endsWith('.json'))
    slugs['image-converter'] = files.map(f => f.replace('.json', ''))
  }
  
  return slugs
}

// 解析 sitemap
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

// 主函数
function main() {
  console.log('检查 sitemap 中的工具页面...\n')
  console.log('='.repeat(80))
  
  const sitemapUrls = parseSitemap()
  const toolSlugs = getAllToolSlugs()
  
  console.log(`\n工具统计:`)
  console.log(`  Image Compressor: ${toolSlugs['image-compressor'].length} 个工具`)
  console.log(`  Image Converter: ${toolSlugs['image-converter'].length} 个工具`)
  console.log(`  总工具数: ${toolSlugs['image-compressor'].length + toolSlugs['image-converter'].length}`)
  console.log(`  预期页面数: ${(toolSlugs['image-compressor'].length + toolSlugs['image-converter'].length) * locales.length}`)
  
  // 检查每个工具的多语言版本
  const missing = []
  const present = []
  
  Object.entries(toolSlugs).forEach(([tool, slugs]) => {
    slugs.forEach(slug => {
      locales.forEach(locale => {
        const url = locale === 'en'
          ? `${baseUrl}/${tool}/${slug}`
          : `${baseUrl}/${locale}/${tool}/${slug}`
        
        if (sitemapUrls.includes(url)) {
          present.push({ tool, slug, locale, url })
        } else {
          missing.push({ tool, slug, locale, url })
        }
      })
    })
  })
  
  console.log('\n' + '='.repeat(80))
  console.log(`\n已包含: ${present.length} 个页面`)
  console.log(`缺失: ${missing.length} 个页面`)
  
  if (missing.length > 0) {
    console.log('\n缺失的页面:\n')
    
    // 按工具分组
    const missingByTool = {}
    missing.forEach(({ tool, slug, locale, url }) => {
      const key = `${tool}/${slug}`
      if (!missingByTool[key]) {
        missingByTool[key] = []
      }
      missingByTool[key].push(locale)
    })
    
    Object.entries(missingByTool).forEach(([key, locales]) => {
      console.log(`  ${key}:`)
      console.log(`    缺失语言: ${locales.join(', ')}`)
    })
    
    // 按语言分组
    console.log('\n按语言分组:\n')
    const missingByLocale = {}
    missing.forEach(({ tool, slug, locale }) => {
      if (!missingByLocale[locale]) {
        missingByLocale[locale] = []
      }
      missingByLocale[locale].push(`${tool}/${slug}`)
    })
    
    Object.entries(missingByLocale).forEach(([locale, pages]) => {
      console.log(`  ${locale.toUpperCase()}: ${pages.length} 个页面`)
      pages.forEach(page => console.log(`    - ${page}`))
    })
  } else {
    console.log('\n✅ 所有工具页面都在 sitemap 中')
  }
  
  console.log('\n' + '='.repeat(80))
  
  if (missing.length > 0) {
    console.log('\n❌ 发现缺失的页面，需要重新生成 sitemap')
    process.exit(1)
  } else {
    console.log('\n✅ Sitemap 完整')
    process.exit(0)
  }
}

main()
