const fs = require('fs')
const path = require('path')

// 所有支持的语言
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 获取所有 in_menu: true 的工具及其 hero.h1
function getMenuTools(locale) {
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
          heroH1: toolData.hero?.h1 || null
        })
      }
    }
  }
  
  // 检查 image-converter 目录
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
          heroH1: data.hero?.h1 || null
        })
      }
    }
  }
  
  return tools
}

// 主函数
function main() {
  console.log('检查所有菜单项的 hero.h1 翻译...\n')
  console.log('='.repeat(80))
  
  // 获取英文版本作为参考
  const enTools = getMenuTools('en')
  const enToolMap = new Map()
  enTools.forEach(t => {
    enToolMap.set(`${t.tool}/${t.slug}`, t.heroH1)
  })
  
  console.log(`\n英文版本中找到 ${enTools.length} 个工具:\n`)
  enTools.forEach(t => {
    console.log(`  - ${t.tool}/${t.slug}: "${t.heroH1}"`)
  })
  
  console.log('\n' + '='.repeat(80))
  
  let hasIssues = false
  
  for (const locale of locales) {
    if (locale === 'en') continue
    
    console.log(`\n语言: ${locale.toUpperCase()}`)
    console.log('-'.repeat(80))
    
    const tools = getMenuTools(locale)
    const issues = []
    
    // 检查每个工具
    enTools.forEach(enTool => {
      const key = `${enTool.tool}/${enTool.slug}`
      const currentTool = tools.find(t => `${t.tool}/${t.slug}` === key)
      const enH1 = enToolMap.get(key)
      
      if (!currentTool) {
        issues.push({
          tool: key,
          issue: 'MISSING',
          enValue: enH1
        })
      } else if (!currentTool.heroH1) {
        issues.push({
          tool: key,
          issue: 'NO_HERO_H1',
          enValue: enH1
        })
      } else if (currentTool.heroH1 === enH1) {
        issues.push({
          tool: key,
          issue: 'SAME_AS_ENGLISH',
          value: currentTool.heroH1,
          enValue: enH1
        })
      }
    })
    
    if (issues.length > 0) {
      hasIssues = true
      console.log(`\n⚠️  发现 ${issues.length} 个问题:`)
      issues.forEach(issue => {
        console.log(`   - ${issue.tool}: ${issue.issue}`)
        if (issue.value) {
          console.log(`     当前值: "${issue.value}"`)
        }
        if (issue.enValue) {
          console.log(`     英文值: "${issue.enValue}"`)
        }
      })
    } else {
      console.log('✅ 所有工具都已翻译')
    }
  }
  
  // 显示详细对比表
  console.log('\n' + '='.repeat(80))
  console.log('\n详细对比表:\n')
  
  enTools.forEach(enTool => {
    const key = `${enTool.tool}/${enTool.slug}`
    console.log(`\n${key} (EN: "${enTool.heroH1}"):`)
    console.log('-'.repeat(60))
    
    locales.forEach(locale => {
      if (locale === 'en') {
        console.log(`  ✅ EN: "${enTool.heroH1}"`)
        return
      }
      
      const tools = getMenuTools(locale)
      const currentTool = tools.find(t => `${t.tool}/${t.slug}` === key)
      
      if (!currentTool) {
        console.log(`  ❌ ${locale.toUpperCase()}: MISSING`)
      } else if (!currentTool.heroH1) {
        console.log(`  ❌ ${locale.toUpperCase()}: NO hero.h1`)
      } else if (currentTool.heroH1 === enTool.heroH1) {
        console.log(`  ⚠️  ${locale.toUpperCase()}: "${currentTool.heroH1}" (与英文相同)`)
      } else {
        console.log(`  ✅ ${locale.toUpperCase()}: "${currentTool.heroH1}"`)
      }
    })
  })
  
  console.log('\n' + '='.repeat(80))
  if (hasIssues) {
    console.log('\n❌ 发现翻译问题，请修复上述问题')
    process.exit(1)
  } else {
    console.log('\n✅ 所有语言的菜单项 hero.h1 都已翻译！')
    process.exit(0)
  }
}

main()
