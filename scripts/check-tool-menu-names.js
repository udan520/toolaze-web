const fs = require('fs')
const path = require('path')

// 所有支持的语言
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 需要检查的工具（in_menu: true 的工具）
const toolsToCheck = [
  { tool: 'image-compression', slug: 'compress-jpg', name: 'JPG Compressor' },
  { tool: 'image-compression', slug: 'compress-png', name: 'PNG Compressor' },
  { tool: 'image-compression', slug: 'compress-webp', name: 'WebP Compressor' },
  { tool: 'image-compression', slug: 'batch-compress', name: 'Batch Image Compressor' }
]

// 读取英文版本作为参考
const enPath = path.join(__dirname, '../src/data/en/image-compression.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'))

// 获取英文版本的 hero.h1
const enHeroH1 = {}
toolsToCheck.forEach(({ slug }) => {
  if (enData[slug] && enData[slug].hero && enData[slug].hero.h1) {
    enHeroH1[slug] = enData[slug].hero.h1
  }
})

// 检查翻译完整性
function checkTranslation(locale) {
  const filePath = path.join(__dirname, `../src/data/${locale}/image-compression.json`)
  if (!fs.existsSync(filePath)) {
    return { locale, exists: false, missing: [], untranslated: [] }
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const issues = {
    missing: [],
    untranslated: []
  }

  toolsToCheck.forEach(({ slug, name }) => {
    if (!data[slug]) {
      issues.missing.push(`${slug} (${name})`)
    } else if (!data[slug].hero || !data[slug].hero.h1) {
      issues.missing.push(`${slug}.hero.h1 (${name})`)
    } else {
      const value = data[slug].hero.h1
      const enValue = enHeroH1[slug]
      // 检查是否与英文相同（可能是未翻译）
      if (locale !== 'en' && value === enValue) {
        issues.untranslated.push(`${slug} (${name}): "${value}"`)
      }
    }
  })

  return { locale, exists: true, ...issues }
}

// 主函数
console.log('检查四级菜单项（工具页面名称）的多语言翻译...\n')
console.log('='.repeat(80))

const results = locales.map(locale => checkTranslation(locale))

let hasIssues = false

results.forEach(result => {
  console.log(`\n语言: ${result.locale.toUpperCase()}`)
  console.log('-'.repeat(80))
  
  if (!result.exists) {
    console.log('❌ 文件不存在')
    hasIssues = true
  } else if (result.missing.length > 0 || result.untranslated.length > 0) {
    hasIssues = true
    
    if (result.missing.length > 0) {
      console.log(`\n⚠️  缺失的键 (${result.missing.length}):`)
      result.missing.forEach(key => console.log(`   - ${key}`))
    }
    
    if (result.untranslated.length > 0) {
      console.log(`\n⚠️  未翻译的内容 (${result.untranslated.length}):`)
      result.untranslated.forEach(key => console.log(`   - ${key}`))
    }
  } else {
    console.log('✅ 翻译完整')
  }
})

console.log('\n' + '='.repeat(80))

// 显示详细对比
console.log('\n详细对比：\n')
console.log('工具页面名称 (hero.h1):')
console.log('-'.repeat(80))

toolsToCheck.forEach(({ slug, name }) => {
  console.log(`\n${name} (${slug}):`)
  console.log('-'.repeat(60))
  locales.forEach(locale => {
    const filePath = path.join(__dirname, `../src/data/${locale}/image-compression.json`)
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (data[slug] && data[slug].hero && data[slug].hero.h1) {
        const value = data[slug].hero.h1
        const enValue = enHeroH1[slug]
        const status = (locale === 'en' || value !== enValue) ? '✅' : '⚠️'
        console.log(`  ${status} ${locale.toUpperCase()}: "${value}"`)
      } else {
        console.log(`  ❌ ${locale.toUpperCase()}: MISSING`)
      }
    }
  })
})

if (hasIssues) {
  console.log('\n❌ 发现翻译问题，请修复上述问题')
  process.exit(1)
} else {
  console.log('\n✅ 所有语言的工具页面名称翻译都完整！')
  process.exit(0)
}
