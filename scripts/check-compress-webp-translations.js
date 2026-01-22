const fs = require('fs')
const path = require('path')

// 所有支持的语言
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 读取英文版本作为参考结构
const enPath = path.join(__dirname, '../src/data/en/image-compression.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'))
const enWebP = enData['compress-webp']

// 递归检查对象的所有键
function getAllKeys(obj, prefix = '') {
  const keys = []
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

// 检查值是否为英文（简单检测）
function isEnglish(text) {
  if (typeof text !== 'string') return false
  // 检查是否包含常见的英文单词或短语
  const englishPatterns = [
    /WebP Compressor/i,
    /Compress WebP/i,
    /Upload Your WebP/i,
    /Download Compressed/i,
    /How to Compress/i,
    /Technical Specifications/i,
    /Input Format/i,
    /Output Format/i,
    /Processing Location/i,
    /Transparency Support/i,
    /Batch Processing/i,
    /100% Private Processing/i,
    /Fast Compression/i,
    /Free Forever/i,
    /Canvas API/i,
    /Browser-Native/i,
    /Client-Side/i,
    /How much can I compress/i,
    /Will compressing/i,
    /Can I compress multiple/i,
    /Is WebP compression/i,
    /Will transparency/i,
    /What file sizes/i,
  ]
  return englishPatterns.some(pattern => pattern.test(text))
}

// 检查翻译完整性
function checkTranslation(locale) {
  const filePath = path.join(__dirname, `../src/data/${locale}/image-compression.json`)
  if (!fs.existsSync(filePath)) {
    return { locale, exists: false, missing: [], untranslated: [] }
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const webpData = data['compress-webp']

  if (!webpData) {
    return { locale, exists: false, missing: ['compress-webp'], untranslated: [] }
  }

  // 获取所有英文键
  const enKeys = getAllKeys(enWebP)
  const currentKeys = getAllKeys(webpData)

  // 检查缺失的键
  const missing = enKeys.filter(key => !currentKeys.includes(key))

  // 检查未翻译的内容
  const untranslated = []
  function checkValue(obj, path = '') {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              checkValue(item, `${currentPath}[${index}]`)
            } else if (isEnglish(item)) {
              untranslated.push(`${currentPath}[${index}]`)
            }
          })
        } else {
          checkValue(obj[key], currentPath)
        }
      } else if (isEnglish(obj[key])) {
        untranslated.push(currentPath)
      }
    }
  }
  checkValue(webpData)

  return { locale, exists: true, missing, untranslated }
}

// 主函数
console.log('检查 compress-webp 页面的多语言翻译完整性...\n')
console.log('='.repeat(80))

const results = locales.map(locale => checkTranslation(locale))

let hasIssues = false

results.forEach(result => {
  console.log(`\n语言: ${result.locale.toUpperCase()}`)
  console.log('-'.repeat(80))
  
  if (!result.exists) {
    console.log('❌ 文件不存在或缺少 compress-webp 数据')
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
if (hasIssues) {
  console.log('\n❌ 发现翻译问题，请修复上述问题')
  process.exit(1)
} else {
  console.log('\n✅ 所有语言的翻译都完整！')
  process.exit(0)
}
