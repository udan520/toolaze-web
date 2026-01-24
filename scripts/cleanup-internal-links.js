// 清理堆砌的内链，按照内链策略保留合理的内链
const fs = require('fs')
const path = require('path')

// 移除HTML链接的函数
function removeLinks(text) {
  if (!text) return text
  // 移除 <a> 标签，保留文本内容
  return text.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
}

// 清理关键词堆砌（移除脚本添加的堆砌关键词）
function removeKeywordStuffing(text) {
  if (!text) return text
  
  // 移除常见的关键词堆砌模式
  const patterns = [
    // 移除开头的堆砌关键词（如 "A text tiny font generator copy and paste copy paste"）
    /^[Aa]\s+(text\s+)?(tiny\s+)?(font\s+generator\s+copy\s+(and\s+)?paste\s*)+/gi,
    // 移除 "Our/This/With our/Try our/Use our + 堆砌关键词" 的堆砌
    /\s*(Our|This|With our|Try our|Use our)\s+(text\s+)?(tiny\s+)?(font\s+generator\s+copy\s+(and\s+)?paste|cursive\s+text\s+tiny\s+font\s+generator\s+cursive\s+copy\s+paste|instagram\s+text\s+tiny\s+instagram\s+fonts\s+generator\s+copy\s+paste|tattoo\s+text\s+tiny\s+font\s+generator\s+tattoo\s+copy\s+paste|star\s+wars\s+text\s+tiny\s+star\s+wars\s+font\s+generator\s+copy\s+paste|old\s+english\s+text\s+tiny\s+old\s+english\s+font\s+generator\s+copy\s+paste|minecraft\s+text\s+tiny\s+minecraft\s+font\s+generator\s+copy\s+paste)[^.]*\./gi,
    // 移除 "关键词 + makes it easy/works perfectly/for quick results/to generate" 的堆砌
    /\s*(font generator copy paste|text font generator|tiny font generator|font generator copy and paste|font generator cursive|instagram fonts generator)\s+(makes it easy|works perfectly|for quick results|to generate|to create styled text|works perfectly for all platforms)[^.]*\./gi,
    // 移除重复的关键词短语
    /\b(font generator|text font generator|tiny font generator)\s+(font generator|text font generator|tiny font generator)/gi,
    // 移除句子中间的堆砌关键词短语
    /\s+(text\s+)?(tiny\s+)?(font\s+generator\s+copy\s+(and\s+)?paste\s*){2,}/gi,
  ]
  
  let cleaned = text
  patterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, (match) => {
      // 如果匹配的是句子开头，替换为 "A font generator" 或 "Our font generator"
      if (match.match(/^[Aa]\s+/)) {
        return 'A font generator'
      }
      if (match.match(/^(Our|This|With our|Try our|Use our)\s+/)) {
        return match.match(/^(Our|This|With our|Try our|Use our)/)[0] + ' font generator'
      }
      return ''
    })
  })
  
  // 修复清理后遗留的问题
  cleaned = cleaned.replace(/\bA\s+copy\s+paste\b/gi, 'A font generator')
  cleaned = cleaned.replace(/\bOur\s+copy\s+paste\b/gi, 'Our font generator')
  cleaned = cleaned.replace(/\bThis\s+copy\s+paste\b/gi, 'This font generator')
  
  // 清理多余的空格和标点
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  // 移除多余的句号
  cleaned = cleaned.replace(/\.{2,}/g, '.')
  // 确保句子以句号结尾（如果原文本有内容）
  if (cleaned && cleaned.length > 0 && !cleaned.match(/[.!?]$/)) {
    cleaned = cleaned + '.'
  }
  
  return cleaned
}

// 清理Features板块的内链和关键词堆砌
function cleanupFeatures(features) {
  if (!features || !features.items) return features
  
  const cleanedItems = features.items.map(item => {
    if (item.desc) {
      // 移除desc中的所有内链
      item.desc = removeLinks(item.desc)
      // 清理关键词堆砌
      item.desc = removeKeywordStuffing(item.desc)
      // 清理多余的空格和标点
      item.desc = item.desc.replace(/\s+/g, ' ').trim()
      // 确保句子以句号结尾
      if (item.desc && !item.desc.match(/[.!?]$/)) {
        item.desc = item.desc + '.'
      }
    }
    return item
  })
  
  return {
    ...features,
    items: cleanedItems
  }
}

// 清理Intro板块的内链（保留最多2-3个，每个段落最多2个）
function cleanupIntro(intro, isL2 = false) {
  if (!intro || !intro.content) return intro
  
  const maxLinksPerParagraph = isL2 ? 2 : 1 // L2页面每个段落最多2个，L3页面每个段落最多1个
  const totalMaxLinks = isL2 ? 3 : 2 // L2页面总共最多3个，L3页面总共最多2个
  
  let totalLinkCount = 0
  const cleanedContent = intro.content.map(item => {
    if (item.text) {
      // 提取所有链接
      const linkMatches = item.text.match(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi) || []
      
      if (linkMatches.length > 0) {
        let paragraphLinkCount = 0
        item.text = item.text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (match, href, text) => {
          // 如果段落内链数量未超限且总内链数量未超限，保留链接
          if (paragraphLinkCount < maxLinksPerParagraph && totalLinkCount < totalMaxLinks) {
            paragraphLinkCount++
            totalLinkCount++
            return match
          } else {
            // 移除链接，保留文本
            return text
          }
        })
      }
      
      // 清理关键词堆砌
      item.text = removeKeywordStuffing(item.text)
      // 清理多余的空格
      item.text = item.text.replace(/\s+/g, ' ').trim()
    }
    return item
  })
  
  return {
    ...intro,
    content: cleanedContent
  }
}

// 清理FAQ板块的内链（保留最多1-2个）
function cleanupFAQ(faq, isL2 = false) {
  if (!faq || !Array.isArray(faq)) return faq
  
  const maxLinks = isL2 ? 2 : 1 // L2页面最多2个，L3页面最多1个
  const cleanedFAQ = faq.map(item => {
    if (item.a || item.answer) {
      let answer = item.a || item.answer
      
      // 修复不完整的锚文本（如 "Instagram " 应该改为 "Instagram font generator"）
      answer = answer.replace(/<a[^>]*href="([^"]*)"[^>]*>(calligraphy|fancy|gothic|bold|cursive|italic|tattoo|discord|instagram|disney|minecraft|3d|old-english|bubble|star-wars|cool)\s*<\/a>/gi, 
        (match, href, keyword) => {
          return `<a href="${href}" class="text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2">${keyword} font generator</a>`
        })
      
      // 提取所有链接
      const linkMatches = answer.match(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi) || []
      
      if (linkMatches.length > maxLinks) {
        // 如果链接过多，只保留前maxLinks个
        let linkCount = 0
        answer = answer.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (match, href, text) => {
          if (linkCount < maxLinks) {
            linkCount++
            return match
          } else {
            // 移除链接，保留文本
            return text
          }
        })
      }
      
      // 清理关键词堆砌
      answer = removeKeywordStuffing(answer)
      answer = answer.replace(/\s+/g, ' ').trim()
      
      if (item.a) {
        item.a = answer
      } else {
        item.answer = answer
      }
    }
    return item
  })
  
  return cleanedFAQ
}

// 确保L3页面有回到L2的链接
function ensureL2Link(intro, tool) {
  if (!intro || !intro.content) return intro
  
  const l2Link = `<a href="/${tool}" class="text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2">font generator</a>`
  
  // 检查是否已经有回到L2的链接
  const hasL2Link = intro.content.some(item => 
    item.text && item.text.includes(`href="/${tool}"`)
  )
  
  if (!hasL2Link) {
    // 在最后一个content item中添加回到L2的链接
    const lastItem = intro.content[intro.content.length - 1]
    if (lastItem && lastItem.text) {
      // 在文本末尾添加回到L2的链接
      if (!lastItem.text.includes(l2Link)) {
        lastItem.text = lastItem.text.trim()
        if (!lastItem.text.match(/[.!?]$/)) {
          lastItem.text += '.'
        }
        lastItem.text += ` Explore more styles with our comprehensive ${l2Link} collection.`
      }
    }
  }
  
  return intro
}

// 处理L2页面
const l2Path = path.join(__dirname, '../src/data/en/font-generator.json')
const l2Data = JSON.parse(fs.readFileSync(l2Path, 'utf8'))

// 清理Features
if (l2Data.features) {
  l2Data.features = cleanupFeatures(l2Data.features)
}

// 清理Intro（保留最多3个内链）
if (l2Data.intro) {
  l2Data.intro = cleanupIntro(l2Data.intro, true)
}

// 清理FAQ（保留最多2个内链）
if (l2Data.faq) {
  l2Data.faq = cleanupFAQ(l2Data.faq, true)
}

// 保存L2数据
fs.writeFileSync(l2Path, JSON.stringify(l2Data, null, 2), 'utf8')
console.log('✅ Cleaned L2 page internal links')

// 处理所有L3页面
const l3Dir = path.join(__dirname, '../src/data/en/font-generator')
const l3Files = fs.readdirSync(l3Dir).filter(f => f.endsWith('.json'))

l3Files.forEach(file => {
  const filePath = path.join(l3Dir, file)
  const l3Data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const categorySlug = file.replace('.json', '')
  
  // 清理Features（移除所有内链）
  if (l3Data.features) {
    l3Data.features = cleanupFeatures(l3Data.features)
  }
  
  // 清理Intro（保留最多2个内链）
  if (l3Data.intro) {
    l3Data.intro = cleanupIntro(l3Data.intro, false)
    // 确保有回到L2的链接
    l3Data.intro = ensureL2Link(l3Data.intro, 'font-generator')
  }
  
  // 清理FAQ（保留最多1个内链）
  if (l3Data.faq) {
    l3Data.faq = cleanupFAQ(l3Data.faq, false)
  }
  
  // 清理HowToUse板块的关键词堆砌
  if (l3Data.howToUse && l3Data.howToUse.steps) {
    l3Data.howToUse.steps = l3Data.howToUse.steps.map(step => {
      if (step.desc) {
        step.desc = removeKeywordStuffing(step.desc)
        step.desc = step.desc.replace(/\s+/g, ' ').trim()
        if (step.desc && !step.desc.match(/[.!?]$/)) {
          step.desc = step.desc + '.'
        }
      }
      return step
    })
  }
  
  // 修复FAQ中不完整的锚文本（如 "calligraphy " 应该改为 "calligraphy font generator"）
  if (l3Data.faq) {
    l3Data.faq = l3Data.faq.map(item => {
      if (item.a || item.answer) {
        let answer = item.a || item.answer
        // 修复不完整的锚文本（匹配 "calligraphy " 或 "calligraphy</a>" 这种情况）
        answer = answer.replace(/<a[^>]*href="([^"]*)"[^>]*>(calligraphy|fancy|gothic|bold|cursive|italic|tattoo|discord|instagram|disney|minecraft|3d|old-english|bubble|star-wars|cool)\s*<\/a>/gi, 
          (match, href, keyword) => {
            return `<a href="${href}" class="text-indigo-600 hover:text-purple-600 font-semibold underline decoration-2 underline-offset-2">${keyword} font generator</a>`
          })
        // 清理关键词堆砌
        answer = removeKeywordStuffing(answer)
        answer = answer.replace(/\s+/g, ' ').trim()
        if (item.a) {
          item.a = answer
        } else {
          item.answer = answer
        }
      }
      return item
    })
  }
  
  // 保存L3数据
  fs.writeFileSync(filePath, JSON.stringify(l3Data, null, 2), 'utf8')
  console.log(`✅ Cleaned ${categorySlug} page internal links`)
})

console.log('\n🎉 All internal links cleaned!')
console.log('📋 Summary:')
console.log('  - L2 page: Features cleaned, Intro max 3 links, FAQ max 2 links')
console.log('  - L3 pages: Features cleaned, Intro max 2 links + L2 link, FAQ max 1 link')
