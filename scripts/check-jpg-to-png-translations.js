const fs = require('fs')
const path = require('path')
const { findUntranslated } = require('./check-translation-helper')

const baseLang = 'en'
const toolSlug = 'jpg-to-png'
const dataDir = path.join(__dirname, '../src/data')

function loadTranslationFile(lang) {
  const filePath = path.join(dataDir, lang, 'image-converter', `${toolSlug}.json`)
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }
  return null
}

function main() {
  console.log(`检查 ${toolSlug} 页面的多语言翻译完整性...`)
  const enData = loadTranslationFile(baseLang)
  if (!enData) {
    console.error(`错误: 未找到 ${toolSlug} 的英文数据。`)
    return
  }

  const languages = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  let hasIssues = false

  console.log('\n================================================================================\n')

  for (const lang of languages) {
    const langData = loadTranslationFile(lang)
    if (!langData) {
      console.log(`语言: ${lang.toUpperCase()}\n--------------------------------------------------------------------------------\n⚠️  未找到 ${toolSlug} 的数据。`)
      hasIssues = true
      continue
    }

    const untranslated = findUntranslated(enData, langData)

    console.log(`语言: ${lang.toUpperCase()}\n--------------------------------------------------------------------------------\n`)
    if (untranslated.length > 0) {
      console.log(`⚠️  未翻译的内容 (${untranslated.length}):`)
      untranslated.forEach(item => console.log(`   - ${item}`))
      hasIssues = true
    } else {
      console.log('✅ 所有内容均已翻译。')
    }
    console.log('\n')
  }

  console.log('================================================================================\n')
  if (hasIssues) {
    console.log('❌ 发现翻译问题，请修复上述问题')
    process.exit(1)
  } else {
    console.log('✅ 所有语言的翻译均已完成。')
  }
}

main()
