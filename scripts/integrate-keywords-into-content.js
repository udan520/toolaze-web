// 将长尾关键词融入L2和L3页面内容
const fs = require('fs')
const path = require('path')

// 读取关键词文件
const keywordsPath = path.join(__dirname, '../docs/keywords/font-generator-keywords.json')
const keywordsData = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'))

// 提取高搜索量的长尾关键词（搜索量>=1000）
const highVolumeKeywords = keywordsData.longTailKeywords
  .filter(kw => kw.searchVolume >= 1000)
  .sort((a, b) => b.searchVolume - a.searchVolume)

// 通用长尾关键词（用于L2页面）- 选择搜索量最高的通用关键词
const generalKeywords = highVolumeKeywords
  .filter(kw => !kw.targetPage || kw.targetPage === null)
  .slice(0, 10) // 选择前10个通用关键词

// 按分类映射关键词
const categoryKeywords = {}
highVolumeKeywords.forEach(kw => {
  if (kw.targetPage) {
    // 处理不同的targetPage格式
    let categorySlug = kw.targetPage
    if (categorySlug.includes('-font-generator')) {
      categorySlug = categorySlug.replace('-font-generator', '')
    } else if (categorySlug.includes('-generator')) {
      categorySlug = categorySlug.replace('-generator', '')
    }
    
    if (!categoryKeywords[categorySlug]) {
      categoryKeywords[categorySlug] = []
    }
    categoryKeywords[categorySlug].push({
      keyword: kw.keyword,
      searchVolume: kw.searchVolume
    })
  }
})

// 自然融入关键词的函数
function integrateKeywordsIntoText(text, keywords, maxIntegrations = 2) {
  if (!text || !keywords || keywords.length === 0) return text
  
  let result = text
  let integratedCount = 0
  
  // 按搜索量排序，优先融入高搜索量关键词
  const sortedKeywords = keywords
    .map(k => typeof k === 'string' ? { keyword: k, searchVolume: 0 } : k)
    .sort((a, b) => {
      const aVol = a.searchVolume || highVolumeKeywords.find(k => k.keyword === a.keyword)?.searchVolume || 0
      const bVol = b.searchVolume || highVolumeKeywords.find(k => k.keyword === b.keyword)?.searchVolume || 0
      return bVol - aVol
    })
  
  for (const kwObj of sortedKeywords) {
    if (integratedCount >= maxIntegrations) break
    
    const keyword = typeof kwObj === 'string' ? kwObj : kwObj.keyword
    const lowerKeyword = keyword.toLowerCase()
    const lowerText = result.toLowerCase()
    
    // 检查关键词是否已经在文本中（允许一次出现）
    const existingCount = (lowerText.match(new RegExp(lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
    if (existingCount >= 1) continue // 如果已经存在，跳过
    
    let found = false
    
    // 策略1: 只在特定情况下替换（避免破坏句子流畅性）
    // 只替换独立的 "font generator" 短语，不替换已经在链接中的
    if (!found && /(^|[^a-z])font generator([^a-z]|$)/i.test(result)) {
      // 检查是否在HTML链接中
      const beforeLink = result.substring(0, result.search(/font generator/i))
      const afterLink = result.substring(result.search(/font generator/i))
      
      // 如果不在链接标签内，可以替换
      if (!beforeLink.includes('<a') || beforeLink.split('<a').length <= beforeLink.split('</a>').length) {
        const firstMatch = result.search(/(^|[^a-z])font generator([^a-z]|$)/i)
        if (firstMatch >= 0 && firstMatch < result.length * 0.6) {
          result = result.replace(/(^|[^a-z])font generator([^a-z]|$)/i, (match, before, after, offset) => {
            if (!found && offset === firstMatch) {
              found = true
              integratedCount++
              return before + keyword + after
            }
            return match
          })
        }
      }
    }
    
    // 策略2: 在合适的位置自然添加关键词
    if (!found && integratedCount < maxIntegrations) {
      // 在句子末尾或合适位置添加
      const naturalAdditions = [
        { before: ' Our ', after: ' makes it easy to create styled text instantly.' },
        { before: ' Try our ', after: ' for quick results.' },
        { before: ' This ', after: ' works perfectly for all platforms.' },
        { before: ' Use our ', after: ' to generate beautiful text styles.' },
        { before: ' With our ', after: ', you can create styled text in seconds.' },
      ]
      
      // 找到最后一个句号的位置（在文本的后30%中）
      const lastPeriod = result.lastIndexOf('.')
      if (lastPeriod > 0 && lastPeriod > result.length * 0.7) {
        const addition = naturalAdditions[Math.floor(Math.random() * naturalAdditions.length)]
        result = result.slice(0, lastPeriod) + addition.before + keyword + addition.after + result.slice(lastPeriod + 1)
        found = true
        integratedCount++
      } else {
        // 如果没有句号，在文本末尾添加
        const addition = naturalAdditions[Math.floor(Math.random() * naturalAdditions.length)]
        result = result + addition.before + keyword + addition.after
        found = true
        integratedCount++
      }
    }
  }
  
  return result
}

// 更新L2页面内容
const l2Path = path.join(__dirname, '../src/data/en/font-generator.json')
const l2Data = JSON.parse(fs.readFileSync(l2Path, 'utf8'))

// 更新L2页面的intro内容
if (l2Data.intro && l2Data.intro.content) {
  l2Data.intro.content.forEach(item => {
    if (item.text) {
      item.text = integrateKeywordsIntoText(item.text, generalKeywords, 2)
    }
  })
}

// 更新L2页面的features描述
if (l2Data.features && l2Data.features.items) {
  l2Data.features.items.forEach(item => {
    if (item.desc) {
      item.desc = integrateKeywordsIntoText(item.desc, generalKeywords, 1)
    }
  })
}

// 更新L2页面的FAQ
if (l2Data.faq) {
  l2Data.faq.forEach(faq => {
    if (faq.a) {
      faq.a = integrateKeywordsIntoText(faq.a, generalKeywords, 1)
    }
  })
}

// 保存更新的L2数据
fs.writeFileSync(l2Path, JSON.stringify(l2Data, null, 2), 'utf8')
console.log('✅ Updated L2 page with keywords')

// 更新所有L3页面
const l3Dir = path.join(__dirname, '../src/data/en/font-generator')
const l3Files = fs.readdirSync(l3Dir).filter(f => f.endsWith('.json'))

l3Files.forEach(file => {
  const filePath = path.join(l3Dir, file)
  const l3Data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  
  // 确定分类slug
  const categorySlug = file.replace('.json', '')
  
  // 获取该分类的关键词
  const categorySpecificKeywords = categoryKeywords[categorySlug] || []
  const allKeywordsForCategory = [
    ...categorySpecificKeywords,
    ...generalKeywords.slice(0, 3) // 添加3个通用关键词
  ]
  
  // 更新intro内容
  if (l3Data.intro && l3Data.intro.content) {
    l3Data.intro.content.forEach(item => {
      if (item.text) {
        item.text = integrateKeywordsIntoText(item.text, allKeywordsForCategory, 2)
      }
    })
  }
  
  // 更新features描述
  if (l3Data.features && l3Data.features.items) {
    l3Data.features.items.forEach(item => {
      if (item.desc) {
        item.desc = integrateKeywordsIntoText(item.desc, allKeywordsForCategory, 1)
      }
    })
  }
  
  // 更新FAQ
  if (l3Data.faq) {
    l3Data.faq.forEach(faq => {
      if (faq.a) {
        faq.a = integrateKeywordsIntoText(faq.a, allKeywordsForCategory, 1)
      }
    })
  }
  
  // 更新howToUse描述
  if (l3Data.howToUse && l3Data.howToUse.steps) {
    l3Data.howToUse.steps.forEach(step => {
      if (step.desc) {
        step.desc = integrateKeywordsIntoText(step.desc, allKeywordsForCategory, 1)
      }
    })
  }
  
  // 保存更新的L3数据
  fs.writeFileSync(filePath, JSON.stringify(l3Data, null, 2), 'utf8')
  console.log(`✅ Updated ${categorySlug} page with keywords`)
})

console.log('\n🎉 All pages updated with long-tail keywords!')
console.log(`📊 Integrated ${highVolumeKeywords.length} high-volume keywords (search volume >= 1000)`)
console.log(`📝 General keywords for L2: ${generalKeywords.length}`)
console.log(`📝 Category-specific keywords: ${Object.keys(categoryKeywords).length} categories`)
