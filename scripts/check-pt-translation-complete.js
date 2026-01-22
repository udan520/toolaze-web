const fs = require('fs')
const path = require('path')

// 检查葡萄牙语翻译的完整性
function checkPTTranslation() {
  console.log('检查葡萄牙语（pt）翻译完整性...\n')
  console.log('='.repeat(80))
  
  const issues = []
  
  // 1. 检查 common.json
  console.log('\n1. 检查 common.json...')
  const ptCommonPath = path.join(__dirname, '../src/data/pt/common.json')
  const enCommonPath = path.join(__dirname, '../src/data/en/common.json')
  
  if (fs.existsSync(ptCommonPath) && fs.existsSync(enCommonPath)) {
    const ptCommon = JSON.parse(fs.readFileSync(ptCommonPath, 'utf8'))
    const enCommon = JSON.parse(fs.readFileSync(enCommonPath, 'utf8'))
    
    // 检查 nav 部分
    if (!ptCommon.nav || !ptCommon.nav.quickTools || ptCommon.nav.quickTools === enCommon.nav.quickTools) {
      issues.push('common.json: nav.quickTools 未翻译或与英文相同')
    }
    if (!ptCommon.nav || !ptCommon.nav.imageCompression || ptCommon.nav.imageCompression === enCommon.nav.imageCompression) {
      issues.push('common.json: nav.imageCompression 未翻译或与英文相同')
    }
    if (!ptCommon.nav || !ptCommon.nav.imageConverter || ptCommon.nav.imageConverter === enCommon.nav.imageConverter) {
      issues.push('common.json: nav.imageConverter 未翻译或与英文相同')
    }
    if (!ptCommon.nav || !ptCommon.nav.aboutUs || ptCommon.nav.aboutUs === enCommon.nav.aboutUs) {
      issues.push('common.json: nav.aboutUs 未翻译或与英文相同')
    }
  } else {
    issues.push('common.json 文件不存在')
  }
  
  // 2. 检查 image-compression.json 中的菜单项
  console.log('2. 检查 image-compression.json 中的菜单项...')
  const ptCompressionPath = path.join(__dirname, '../src/data/pt/image-compression.json')
  const enCompressionPath = path.join(__dirname, '../src/data/en/image-compression.json')
  
  if (fs.existsSync(ptCompressionPath) && fs.existsSync(enCompressionPath)) {
    const ptCompression = JSON.parse(fs.readFileSync(ptCompressionPath, 'utf8'))
    const enCompression = JSON.parse(fs.readFileSync(enCompressionPath, 'utf8'))
    
    // 检查所有 in_menu: true 的工具
    const menuTools = ['compress-jpg', 'compress-png', 'compress-webp', 'batch-compress']
    
    menuTools.forEach(slug => {
      if (ptCompression[slug] && ptCompression[slug].in_menu === true) {
        const ptH1 = ptCompression[slug]?.hero?.h1
        const enH1 = enCompression[slug]?.hero?.h1
        
        if (!ptH1) {
          issues.push(`image-compression.json: ${slug}.hero.h1 缺失`)
        } else if (ptH1 === enH1) {
          issues.push(`image-compression.json: ${slug}.hero.h1 与英文相同: "${ptH1}"`)
        }
      }
    })
  } else {
    issues.push('image-compression.json 文件不存在')
  }
  
  // 3. 检查 image-converter 目录下的工具
  console.log('3. 检查 image-converter 目录下的工具...')
  const ptConverterDir = path.join(__dirname, '../src/data/pt/image-converter')
  const enConverterDir = path.join(__dirname, '../src/data/en/image-converter')
  
  if (fs.existsSync(ptConverterDir) && fs.existsSync(enConverterDir)) {
    const ptFiles = fs.readdirSync(ptConverterDir).filter(f => f.endsWith('.json'))
    const enFiles = fs.readdirSync(enConverterDir).filter(f => f.endsWith('.json'))
    
    enFiles.forEach(file => {
      const slug = file.replace('.json', '')
      const ptFilePath = path.join(ptConverterDir, file)
      const enFilePath = path.join(enConverterDir, file)
      
      if (fs.existsSync(ptFilePath) && fs.existsSync(enFilePath)) {
        const ptData = JSON.parse(fs.readFileSync(ptFilePath, 'utf8'))
        const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'))
        
        if (ptData.in_menu === true || enData.in_menu === true) {
          const ptH1 = ptData?.hero?.h1
          const enH1 = enData?.hero?.h1
          
          if (!ptH1) {
            issues.push(`image-converter/${file}: hero.h1 缺失`)
          } else if (ptH1 === enH1) {
            issues.push(`image-converter/${file}: hero.h1 与英文相同: "${ptH1}"`)
          }
        }
      } else if (enData.in_menu === true) {
        issues.push(`image-converter/${file}: 文件不存在`)
      }
    })
  } else {
    issues.push('image-converter 目录不存在')
  }
  
  // 显示结果
  console.log('\n' + '='.repeat(80))
  if (issues.length > 0) {
    console.log(`\n⚠️  发现 ${issues.length} 个问题:\n`)
    issues.forEach(issue => console.log(`   - ${issue}`))
    console.log('\n' + '='.repeat(80))
    console.log('\n❌ 葡萄牙语翻译未完成，请修复上述问题')
    process.exit(1)
  } else {
    console.log('\n✅ 葡萄牙语翻译完整！')
    console.log('\n' + '='.repeat(80))
    process.exit(0)
  }
}

checkPTTranslation()
