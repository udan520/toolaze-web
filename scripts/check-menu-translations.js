const fs = require('fs')
const path = require('path')

// 所有支持的语言
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 读取英文版本作为参考
const enPath = path.join(__dirname, '../src/data/en/common.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'))

// 需要检查的菜单项
const menuKeys = {
  nav: ['quickTools', 'imageCompression', 'imageConverter', 'aboutUs'],
  breadcrumb: ['home', 'quickTools', 'imageCompression', 'imageConverter', 'aboutUs', 'privacyPolicy', 'termsOfService']
}

// 检查翻译完整性
function checkTranslation(locale) {
  const filePath = path.join(__dirname, `../src/data/${locale}/common.json`)
  if (!fs.existsSync(filePath)) {
    return { locale, exists: false, missing: [], untranslated: [] }
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const issues = {
    missing: [],
    untranslated: [],
    english: []
  }

  // 检查 nav 菜单
  if (!data.nav) {
    issues.missing.push('nav')
  } else {
    menuKeys.nav.forEach(key => {
      if (!data.nav[key]) {
        issues.missing.push(`nav.${key}`)
      } else {
        const value = data.nav[key]
        const enValue = enData.nav[key]
        // 检查是否与英文相同（可能是未翻译）
        if (locale !== 'en' && value === enValue) {
          issues.untranslated.push(`nav.${key}`)
        }
        // 检查是否包含英文单词（可能是部分翻译）
        if (locale !== 'en' && /[A-Za-z]{3,}/.test(value) && value === enValue) {
          issues.english.push(`nav.${key}`)
        }
      }
    })
  }

  // 检查 breadcrumb 菜单
  if (!data.breadcrumb) {
    issues.missing.push('breadcrumb')
  } else {
    menuKeys.breadcrumb.forEach(key => {
      if (!data.breadcrumb[key]) {
        issues.missing.push(`breadcrumb.${key}`)
      } else {
        const value = data.breadcrumb[key]
        const enValue = enData.breadcrumb[key]
        // 检查是否与英文相同（可能是未翻译）
        if (locale !== 'en' && value === enValue) {
          issues.untranslated.push(`breadcrumb.${key}`)
        }
      }
    })
  }

  return { locale, exists: true, ...issues }
}

// 主函数
console.log('检查二级和三级菜单名称的多语言翻译...\n')
console.log('='.repeat(80))

const results = locales.map(locale => checkTranslation(locale))

let hasIssues = false

results.forEach(result => {
  console.log(`\n语言: ${result.locale.toUpperCase()}`)
  console.log('-'.repeat(80))
  
  if (!result.exists) {
    console.log('❌ 文件不存在')
    hasIssues = true
  } else if (result.missing.length > 0 || result.untranslated.length > 0 || result.english.length > 0) {
    hasIssues = true
    
    if (result.missing.length > 0) {
      console.log(`\n⚠️  缺失的键 (${result.missing.length}):`)
      result.missing.forEach(key => console.log(`   - ${key}`))
    }
    
    if (result.untranslated.length > 0) {
      console.log(`\n⚠️  未翻译的内容 (${result.untranslated.length}):`)
      result.untranslated.forEach(key => console.log(`   - ${key}`))
    }
    
    if (result.english.length > 0) {
      console.log(`\n⚠️  可能未翻译的内容 (${result.english.length}):`)
      result.english.forEach(key => console.log(`   - ${key}`))
    }
  } else {
    console.log('✅ 翻译完整')
  }
})

console.log('\n' + '='.repeat(80))

// 显示详细对比
console.log('\n详细对比：\n')
console.log('导航菜单 (nav):')
console.log('-'.repeat(80))
locales.forEach(locale => {
  if (locale === 'en') return
  const filePath = path.join(__dirname, `../src/data/${locale}/common.json`)
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    console.log(`\n${locale.toUpperCase()}:`)
    if (data.nav) {
      menuKeys.nav.forEach(key => {
        const value = data.nav[key] || 'MISSING'
        const enValue = enData.nav[key]
        const status = value === enValue ? '⚠️' : '✅'
        console.log(`  ${status} ${key}: "${value}" (EN: "${enValue}")`)
      })
    }
  }
})

console.log('\n面包屑菜单 (breadcrumb):')
console.log('-'.repeat(80))
locales.forEach(locale => {
  if (locale === 'en') return
  const filePath = path.join(__dirname, `../src/data/${locale}/common.json`)
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    console.log(`\n${locale.toUpperCase()}:`)
    if (data.breadcrumb) {
      menuKeys.breadcrumb.forEach(key => {
        const value = data.breadcrumb[key] || 'MISSING'
        const enValue = enData.breadcrumb[key]
        const status = value === enValue ? '⚠️' : '✅'
        console.log(`  ${status} ${key}: "${value}" (EN: "${enValue}")`)
      })
    }
  }
})

if (hasIssues) {
  console.log('\n❌ 发现翻译问题，请修复上述问题')
  process.exit(1)
} else {
  console.log('\n✅ 所有语言的菜单翻译都完整！')
  process.exit(0)
}
