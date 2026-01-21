const fs = require('fs')
const path = require('path')

// 所有语言
const languages = ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']

// 检查字符串是否包含英语（简单检查：包含常见英语单词）
function containsEnglish(text) {
  if (!text || typeof text !== 'string') return false
  
  // 检查是否包含常见英语单词和短语
  const englishWords = [
    'the ', ' and ', ' or ', ' but ', ' in ', ' on ', ' at ', ' to ', ' for ', ' of ', ' with ', ' by ',
    'Upload', 'Download', 'Compress', 'Image', 'Photo', 'File', 'Size', 'Format', 'Quality',
    'How to', 'What is', 'Why', 'When', 'Where', 'Which', 'Who',
    'Click', 'Drag', 'Drop', 'Browse', 'Select', 'Set', 'Get', 'Use',
    'Maintain', 'Preserve', 'Optimize', 'Reduce', 'Improve', 'Perfect', 'Instant', 'Free',
    'Browser', 'Server', 'Local', 'Online', 'Tool', 'Feature', 'Step', 'Scene',
    'Comparison', 'Rating', 'FAQ', 'Question', 'Answer'
  ]
  
  const lowerText = ' ' + text.toLowerCase() + ' '
  return englishWords.some(word => lowerText.includes(' ' + word.toLowerCase() + ' '))
}

// 递归检查对象中的所有字符串值
function checkObject(obj, path = '', issues = []) {
  if (obj === null || obj === undefined) return issues
  
  if (typeof obj === 'string') {
    if (containsEnglish(obj)) {
      issues.push({
        path: path,
        value: obj.substring(0, 150) // 只显示前150个字符
      })
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      checkObject(item, `${path}[${index}]`, issues)
    })
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      // 跳过 icon 和 iconType 字段（这些可能是emoji或技术标识符）
      if (key === 'icon' || key === 'iconType') return
      const newPath = path ? `${path}.${key}` : key
      checkObject(obj[key], newPath, issues)
    })
  }
  
  return issues
}

// 读取英文版本作为参考
const enData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'en', 'image-compression.json'), 'utf8'))
const pageKeys = Object.keys(enData)

console.log('🔍 Checking for untranslated English content in all third-level pages...\n')

let totalIssues = 0
const allIssues = {}

// 检查每个页面
for (const pageKey of pageKeys) {
  console.log(`\n📄 Checking page: ${pageKey}`)
  console.log('─'.repeat(60))
  
  let pageHasIssues = false
  const pageIssues = {}
  
  // 检查每个语言版本
  for (const lang of languages) {
    const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  ${lang}: File not found`)
      continue
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (!data[pageKey]) {
      console.log(`  ⚠️  ${lang}: Page not found`)
      continue
    }
    
    const pageData = data[pageKey]
    const issues = checkObject(pageData, pageKey)
    
    if (issues.length > 0) {
      pageHasIssues = true
      totalIssues += issues.length
      pageIssues[lang] = issues
      console.log(`  ❌ ${lang}: Found ${issues.length} untranslated field(s)`)
      issues.slice(0, 5).forEach(issue => {
        const displayValue = issue.value.length > 100 ? issue.value.substring(0, 100) + '...' : issue.value
        console.log(`     - ${issue.path}: "${displayValue}"`)
      })
      if (issues.length > 5) {
        console.log(`     ... and ${issues.length - 5} more`)
      }
    } else {
      console.log(`  ✅ ${lang}: All translated`)
    }
  }
  
  if (pageHasIssues) {
    allIssues[pageKey] = pageIssues
  } else {
    console.log(`  ✨ All languages fully translated for ${pageKey}`)
  }
}

console.log(`\n\n📊 Summary:`)
console.log(`   Total issues found: ${totalIssues}`)
if (totalIssues === 0) {
  console.log(`   🎉 All pages are fully translated!`)
} else {
  console.log(`   ⚠️  Found untranslated content in ${Object.keys(allIssues).length} page(s)`)
  console.log(`\n   Pages with issues:`)
  Object.keys(allIssues).forEach(pageKey => {
    const langCount = Object.keys(allIssues[pageKey]).length
    const totalFields = Object.values(allIssues[pageKey]).reduce((sum, issues) => sum + issues.length, 0)
    console.log(`   - ${pageKey}: ${totalFields} fields in ${langCount} language(s)`)
  })
}
