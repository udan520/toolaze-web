const fs = require('fs')
const path = require('path')

// 所有支持的语言
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 检查所有 in_menu: true 的工具
async function getAllMenuTools(locale) {
  const tools = []
  
  // 检查 image-compression.json
  const compressionPath = path.join(__dirname, `../src/data/${locale}/image-compression.json`)
  if (fs.existsSync(compressionPath)) {
    const data = JSON.parse(fs.readFileSync(compressionPath, 'utf8'))
    for (const [slug, toolData] of Object.entries(data)) {
      if (toolData && toolData.in_menu === true) {
        tools.push({
          tool: 'image-compression',
          slug,
          heroH1: toolData.hero?.h1 || 'MISSING',
          inMenu: true
        })
      }
    }
  }
  
  // 检查 image-converter 目录下的文件
  const converterDir = path.join(__dirname, `../src/data/${locale}/image-converter`)
  if (fs.existsSync(converterDir)) {
    const files = fs.readdirSync(converterDir).filter(f => f.endsWith('.json'))
    for (const file of files) {
      const filePath = path.join(converterDir, file)
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (data && data.in_menu === true) {
        const slug = file.replace('.json', '')
        tools.push({
          tool: 'image-converter',
          slug,
          heroH1: data.hero?.h1 || 'MISSING',
          inMenu: true
        })
      }
    }
  }
  
  return tools
}

// 检查值是否为英文（简单检测）
function isEnglish(text) {
  if (typeof text !== 'string') return false
  // 检查是否包含常见的英文单词或短语
  const englishPatterns = [
    /^JPG Compressor$/i,
    /^PNG Compressor$/i,
    /^WebP Compressor$/i,
    /^Batch Image Compressor$/i,
    /^HEIC to JPG Converter$/i,
    /^HEIC to PNG Converter$/i,
    /^HEIC to WebP Converter$/i,
    /^JPG to PNG Converter$/i,
    /^JPG to WebP Converter$/i,
    /^PNG to JPG Converter$/i,
    /^PNG to WebP Converter$/i,
    /^WebP to JPG Converter$/i,
    /^WebP to PNG Converter$/i,
  ]
  return englishPatterns.some(pattern => pattern.test(text))
}

// 主函数
async function main() {
  console.log('检查所有菜单项（in_menu: true）的多语言翻译...\n')
  console.log('='.repeat(80))
  
  // 获取英文版本作为参考
  const enTools = await getAllMenuTools('en')
  const enToolMap = new Map()
  enTools.forEach(t => {
    enToolMap.set(`${t.tool}/${t.slug}`, t.heroH1)
  })
  
  let hasIssues = false
  const allIssues = {}
  
  for (const locale of locales) {
    if (locale === 'en') continue
    
    const tools = await getAllMenuTools(locale)
    const issues = []
    
    tools.forEach(t => {
      const key = `${t.tool}/${t.slug}`
      const enH1 = enToolMap.get(key)
      
      if (!t.heroH1 || t.heroH1 === 'MISSING') {
        issues.push({
          tool: key,
          issue: 'MISSING',
          value: t.heroH1,
          enValue: enH1
        })
      } else if (t.heroH1 === enH1 && isEnglish(t.heroH1)) {
        issues.push({
          tool: key,
          issue: 'UNTRANSLATED',
          value: t.heroH1,
          enValue: enH1
        })
      }
    })
    
    if (issues.length > 0) {
      hasIssues = true
      allIssues[locale] = issues
    }
  }
  
  // 显示结果
  for (const locale of locales) {
    if (locale === 'en') continue
    
    console.log(`\n语言: ${locale.toUpperCase()}`)
    console.log('-'.repeat(80))
    
    if (allIssues[locale] && allIssues[locale].length > 0) {
      console.log(`\n⚠️  发现 ${allIssues[locale].length} 个问题:`)
      allIssues[locale].forEach(issue => {
        console.log(`   - ${issue.tool}: ${issue.issue}`)
        console.log(`     当前值: "${issue.value}"`)
        console.log(`     英文值: "${issue.enValue}"`)
      })
    } else {
      console.log('✅ 翻译完整')
    }
  }
  
  // 显示详细对比
  console.log('\n' + '='.repeat(80))
  console.log('\n详细对比（所有 in_menu: true 的工具）:\n')
  
  for (const locale of locales) {
    const tools = await getAllMenuTools(locale)
    if (tools.length === 0) continue
    
    console.log(`\n${locale.toUpperCase()}:`)
    console.log('-'.repeat(60))
    
    tools.forEach(t => {
      const key = `${t.tool}/${t.slug}`
      const enH1 = enToolMap.get(key)
      const status = (locale === 'en' || (t.heroH1 !== enH1 && !isEnglish(t.heroH1))) ? '✅' : '⚠️'
      console.log(`  ${status} ${t.tool}/${t.slug}: "${t.heroH1}"`)
      if (locale !== 'en' && t.heroH1 === enH1) {
        console.log(`     (与英文相同: "${enH1}")`)
      }
    })
  }
  
  console.log('\n' + '='.repeat(80))
  if (hasIssues) {
    console.log('\n❌ 发现翻译问题，请修复上述问题')
    process.exit(1)
  } else {
    console.log('\n✅ 所有语言的菜单项翻译都完整！')
    process.exit(0)
  }
}

main().catch(console.error)
