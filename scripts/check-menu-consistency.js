const fs = require('fs')
const path = require('path')

// 所有支持的语言
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 获取所有工具（从英文版本）
function getAllToolsFromEn() {
  const tools = []
  
  // 从 image-compression.json
  const compressionPath = path.join(__dirname, '../src/data/en/image-compression.json')
  if (fs.existsSync(compressionPath)) {
    const data = JSON.parse(fs.readFileSync(compressionPath, 'utf8'))
    for (const [slug, toolData] of Object.entries(data)) {
      if (toolData && toolData.in_menu === true) {
        tools.push({
          tool: 'image-compression',
          slug,
          enHeroH1: toolData.hero?.h1 || 'MISSING'
        })
      }
    }
  }
  
  // 从 image-converter 目录
  const converterDir = path.join(__dirname, '../src/data/en/image-converter')
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
          enHeroH1: data.hero?.h1 || 'MISSING'
        })
      }
    }
  }
  
  return tools
}

// 检查单个语言的工具
function checkLanguageTools(locale, enTools) {
  const issues = {
    missing: [],
    inMenuMismatch: [],
    untranslated: []
  }
  
  enTools.forEach(enTool => {
    let toolData = null
    
    if (enTool.tool === 'image-compression') {
      const filePath = path.join(__dirname, `../src/data/${locale}/image-compression.json`)
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        toolData = data[enTool.slug]
      }
    } else if (enTool.tool === 'image-converter') {
      const filePath = path.join(__dirname, `../src/data/${locale}/image-converter/${enTool.slug}.json`)
      if (fs.existsSync(filePath)) {
        toolData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      }
    }
    
    if (!toolData) {
      issues.missing.push(`${enTool.tool}/${enTool.slug}`)
    } else {
      // 检查 in_menu 是否一致
      if (toolData.in_menu !== true) {
        issues.inMenuMismatch.push({
          tool: `${enTool.tool}/${enTool.slug}`,
          enInMenu: true,
          currentInMenu: toolData.in_menu
        })
      }
      
      // 检查 hero.h1 是否翻译
      const heroH1 = toolData.hero?.h1 || ''
      if (heroH1 === enTool.enHeroH1 && locale !== 'en') {
        issues.untranslated.push({
          tool: `${enTool.tool}/${enTool.slug}`,
          value: heroH1
        })
      }
    }
  })
  
  return issues
}

// 主函数
function main() {
  console.log('检查所有语言的菜单项一致性和翻译...\n')
  console.log('='.repeat(80))
  
  const enTools = getAllToolsFromEn()
  console.log(`\n英文版本中找到 ${enTools.length} 个 in_menu: true 的工具:\n`)
  enTools.forEach(t => {
    console.log(`  - ${t.tool}/${t.slug}: "${t.enHeroH1}"`)
  })
  
  console.log('\n' + '='.repeat(80))
  
  let hasIssues = false
  
  for (const locale of locales) {
    if (locale === 'en') continue
    
    console.log(`\n语言: ${locale.toUpperCase()}`)
    console.log('-'.repeat(80))
    
    const issues = checkLanguageTools(locale, enTools)
    
    if (issues.missing.length > 0 || issues.inMenuMismatch.length > 0 || issues.untranslated.length > 0) {
      hasIssues = true
      
      if (issues.missing.length > 0) {
        console.log(`\n❌ 缺失的工具 (${issues.missing.length}):`)
        issues.missing.forEach(tool => console.log(`   - ${tool}`))
      }
      
      if (issues.inMenuMismatch.length > 0) {
        console.log(`\n⚠️  in_menu 不一致 (${issues.inMenuMismatch.length}):`)
        issues.inMenuMismatch.forEach(item => {
          console.log(`   - ${item.tool}: 英文 in_menu=true, 当前 in_menu=${item.currentInMenu}`)
        })
      }
      
      if (issues.untranslated.length > 0) {
        console.log(`\n⚠️  未翻译的 hero.h1 (${issues.untranslated.length}):`)
        issues.untranslated.forEach(item => {
          console.log(`   - ${item.tool}: "${item.value}"`)
        })
      }
    } else {
      console.log('✅ 所有工具都存在且已翻译')
    }
  }
  
  console.log('\n' + '='.repeat(80))
  if (hasIssues) {
    console.log('\n❌ 发现一致性问题，请修复上述问题')
    process.exit(1)
  } else {
    console.log('\n✅ 所有语言的菜单项都一致且已翻译！')
    process.exit(0)
  }
}

main()
