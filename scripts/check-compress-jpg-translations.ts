import fs from 'fs'
import path from 'path'

// 支持的语言列表（排除英语）
const LOCALES = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 递归获取所有字段路径
function getAllFieldPaths(obj: any, prefix: string = ''): string[] {
  const paths: string[] = []
  
  for (const key in obj) {
    const currentPath = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    
    if (value === null || value === undefined) {
      paths.push(currentPath)
    } else if (Array.isArray(value)) {
      // 处理数组
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          paths.push(...getAllFieldPaths(item, `${currentPath}[${index}]`))
        } else {
          paths.push(`${currentPath}[${index}]`)
        }
      })
    } else if (typeof value === 'object') {
      paths.push(...getAllFieldPaths(value, currentPath))
    } else {
      paths.push(currentPath)
    }
  }
  
  return paths
}

// 获取嵌套对象的值
function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.')
  let current = obj
  
  for (const part of parts) {
    if (part.includes('[')) {
      const [key, indexStr] = part.split('[')
      const index = parseInt(indexStr.replace(']', ''))
      if (current[key] && Array.isArray(current[key])) {
        current = current[key][index]
      } else {
        return undefined
      }
    } else {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        return undefined
      }
    }
  }
  
  return current
}

// 检查字段是否为可翻译的文本字段
function isTranslatableField(path: string, value: any): boolean {
  // 排除这些字段
  const excludedFields = ['in_menu', 'icon', 'iconType', 'sectionsOrder']
  
  // 检查路径是否包含排除的字段
  if (excludedFields.some(field => path.includes(field))) {
    return false
  }
  
  // 只检查字符串类型的值
  if (typeof value === 'string' && value.trim().length > 0) {
    return true
  }
  
  return false
}

// 检查是否为英语文本（简单检查）
function isEnglishText(text: string): boolean {
  // 简单的英语检测：检查是否包含常见的英语单词或模式
  const englishPatterns = [
    /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/i,
    /\b(how|what|when|where|why|can|will|is|are|was|were)\b/i,
    /\b(compress|image|file|size|quality|format|upload|download)\b/i,
  ]
  
  return englishPatterns.some(pattern => pattern.test(text))
}

async function checkTranslations() {
  const dataDir = path.join(process.cwd(), 'src', 'data')
  
  // 读取英语版本作为基准
  const enPath = path.join(dataDir, 'en', 'image-compression.json')
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
  const compressJpgEn = enData['compress-jpg']
  
  if (!compressJpgEn) {
    console.error('❌ compress-jpg not found in English version')
    return
  }
  
  // 获取所有可翻译字段
  const allPaths = getAllFieldPaths(compressJpgEn)
  const translatablePaths = allPaths.filter(path => {
    const value = getNestedValue(compressJpgEn, path)
    return isTranslatableField(path, value)
  })
  
  console.log(`\n📋 检查 compress-jpg 的翻译完整性`)
  console.log(`📊 英语版本共有 ${translatablePaths.length} 个可翻译字段\n`)
  
  const issues: Array<{ locale: string; path: string; enValue: string; currentValue: string; issue: string }> = []
  
  // 检查每个语言版本
  for (const locale of LOCALES) {
    console.log(`\n🔍 检查 ${locale.toUpperCase()} 版本...`)
    
    const localePath = path.join(dataDir, locale, 'image-compression.json')
    
    if (!fs.existsSync(localePath)) {
      console.log(`  ❌ 文件不存在: ${localePath}`)
      issues.push({
        locale,
        path: 'FILE',
        enValue: 'N/A',
        currentValue: 'MISSING',
        issue: '文件不存在'
      })
      continue
    }
    
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'))
    const compressJpgLocale = localeData['compress-jpg']
    
    if (!compressJpgLocale) {
      console.log(`  ❌ compress-jpg 条目不存在`)
      issues.push({
        locale,
        path: 'compress-jpg',
        enValue: 'EXISTS',
        currentValue: 'MISSING',
        issue: 'compress-jpg 条目不存在'
      })
      continue
    }
    
    let missingCount = 0
    let englishCount = 0
    
    // 检查每个字段
    for (const fieldPath of translatablePaths) {
      const enValue = getNestedValue(compressJpgEn, fieldPath)
      const localeValue = getNestedValue(compressJpgLocale, fieldPath)
      
      if (enValue === undefined) {
        continue
      }
      
      if (localeValue === undefined || localeValue === null) {
        missingCount++
        issues.push({
          locale,
          path: fieldPath,
          enValue: String(enValue).substring(0, 50),
          currentValue: 'MISSING',
          issue: '字段缺失'
        })
      } else if (typeof localeValue === 'string' && localeValue.trim() === '') {
        missingCount++
        issues.push({
          locale,
          path: fieldPath,
          enValue: String(enValue).substring(0, 50),
          currentValue: 'EMPTY',
          issue: '字段为空'
        })
      } else if (typeof localeValue === 'string' && isEnglishText(localeValue) && localeValue === enValue) {
        englishCount++
        issues.push({
          locale,
          path: fieldPath,
          enValue: String(enValue).substring(0, 50),
          currentValue: String(localeValue).substring(0, 50),
          issue: '仍为英语文本'
        })
      }
    }
    
    if (missingCount === 0 && englishCount === 0) {
      console.log(`  ✅ 所有字段已正确翻译`)
    } else {
      console.log(`  ⚠️  发现 ${missingCount} 个缺失字段，${englishCount} 个未翻译字段`)
    }
  }
  
  // 生成报告
  console.log(`\n\n📊 翻译检查报告`)
  console.log(`═══════════════════════════════════════════════════════════`)
  
  if (issues.length === 0) {
    console.log(`\n✅ 所有语言版本翻译完整！`)
  } else {
    console.log(`\n❌ 发现 ${issues.length} 个问题：\n`)
    
    // 按语言分组
    const issuesByLocale: Record<string, typeof issues> = {}
    for (const issue of issues) {
      if (!issuesByLocale[issue.locale]) {
        issuesByLocale[issue.locale] = []
      }
      issuesByLocale[issue.locale].push(issue)
    }
    
    for (const locale of LOCALES) {
      const localeIssues = issuesByLocale[locale] || []
      if (localeIssues.length > 0) {
        console.log(`\n🌐 ${locale.toUpperCase()} (${localeIssues.length} 个问题):`)
        console.log(`───────────────────────────────────────────────────────────`)
        
        for (const issue of localeIssues) {
          console.log(`  ❌ ${issue.path}`)
          console.log(`     问题: ${issue.issue}`)
          if (issue.enValue !== 'N/A' && issue.enValue !== 'EXISTS') {
            console.log(`     英语: ${issue.enValue}...`)
          }
          if (issue.currentValue !== 'MISSING' && issue.currentValue !== 'EMPTY') {
            console.log(`     当前: ${issue.currentValue}...`)
          }
          console.log(``)
        }
      }
    }
  }
  
  console.log(`\n═══════════════════════════════════════════════════════════\n`)
}

// 运行检查
checkTranslations().catch(console.error)
