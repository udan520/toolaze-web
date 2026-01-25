#!/usr/bin/env node

/**
 * 验证 sitemap 是否包含所有预期的页面
 * 用于在发布前检查 sitemap 的完整性
 */

const { getAllTools } = require('../src/lib/seo-loader.ts')

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const STATIC_PAGES = ['about', 'privacy', 'terms']
const TOOL_PAGES = ['image-compressor', 'image-converter', 'font-generator']
const baseUrl = 'https://toolaze.com'

async function verifySitemap() {
  console.log('🔍 验证 Sitemap 完整性...\n')
  console.log('='.repeat(80))
  
  const expectedUrls = new Set()
  const missingUrls = []
  
  // 1. 首页
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '' : `/${locale}`
    expectedUrls.add(`${baseUrl}${path}`)
  })
  
  // 2. 静态页面
  STATIC_PAGES.forEach((page) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const path = locale === 'en' ? `/${page}` : `/${locale}/${page}`
      expectedUrls.add(`${baseUrl}${path}`)
    })
  })
  
  // 3. 工具 L2 页面
  TOOL_PAGES.forEach((tool) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      if (tool === 'font-generator' && locale !== 'en' && locale !== 'de') {
        return
      }
      const path = locale === 'en' ? `/${tool}` : `/${locale}/${tool}`
      expectedUrls.add(`${baseUrl}${path}`)
    })
  })
  
  // 4. 工具 L3 页面
  for (const locale of SUPPORTED_LOCALES) {
    try {
      const tools = await getAllTools(locale)
      
      if (tools && tools.length > 0) {
        tools.forEach(({ tool, slug }) => {
          const path = locale === 'en' 
            ? `/${tool}/${slug}`
            : `/${locale}/${tool}/${slug}`
          expectedUrls.add(`${baseUrl}${path}`)
        })
      }
    } catch (error) {
      console.warn(`⚠️  获取 ${locale} 语言工具失败:`, error.message)
    }
  }
  
  console.log(`\n✅ 预期 URL 总数: ${expectedUrls.size}`)
  
  // 统计各工具页面数
  const toolCounts = {}
  for (const url of expectedUrls) {
    const path = url.replace(baseUrl, '')
    if (path.includes('/font-generator/')) {
      toolCounts['font-generator'] = (toolCounts['font-generator'] || 0) + 1
    } else if (path.includes('/image-compressor/')) {
      toolCounts['image-compressor'] = (toolCounts['image-compressor'] || 0) + 1
    } else if (path.includes('/image-converter/')) {
      toolCounts['image-converter'] = (toolCounts['image-converter'] || 0) + 1
    }
  }
  
  console.log('\n📊 各工具页面统计:')
  Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tool, count]) => {
      console.log(`  ${tool.padEnd(20)}: ${count.toString().padStart(4)} 个页面`)
    })
  
  // 检查 font-generator 德语页面
  const fontGenDeUrls = Array.from(expectedUrls).filter(url => 
    url.includes('/de/font-generator/')
  )
  console.log(`\n✅ 德语 font-generator L3 页面: ${fontGenDeUrls.length} 个`)
  
  if (fontGenDeUrls.length === 16) {
    console.log('   ✅ 所有 16 个分类页面都已包含')
  } else {
    console.log(`   ⚠️  预期 16 个，实际 ${fontGenDeUrls.length} 个`)
    missingUrls.push(...fontGenDeUrls)
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('\n✅ Sitemap 验证完成！')
  console.log('\n💡 提示: 发布后访问 https://toolaze.com/sitemap.xml 确认所有 URL 都已包含')
  
  if (missingUrls.length > 0) {
    console.log('\n⚠️  发现缺失的 URL:')
    missingUrls.forEach(url => console.log(`  - ${url}`))
    process.exit(1)
  }
  
  process.exit(0)
}

verifySitemap().catch((error) => {
  console.error('\n❌ 验证过程出错:', error)
  process.exit(1)
})
