const fs = require('fs')
const path = require('path')

// 读取英文版本作为模板
const enPath = path.join(__dirname, '../src/data/en/image-compression.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'))
const enWebP = enData['compress-webp']

// 需要同步的语言
const languages = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 深度合并函数：保留已翻译内容，添加缺失字段
function deepMerge(target, source, skipKeys = ['icon', 'iconType', 'in_menu', 'sectionsOrder']) {
  if (Array.isArray(source)) {
    // 如果是数组，确保长度一致
    if (!Array.isArray(target)) {
      return JSON.parse(JSON.stringify(source))
    }
    const result = []
    for (let i = 0; i < source.length; i++) {
      if (i < target.length) {
        result.push(deepMerge(target[i], source[i], skipKeys))
      } else {
        result.push(JSON.parse(JSON.stringify(source[i])))
      }
    }
    return result
  } else if (source !== null && typeof source === 'object') {
    const result = {}
    // 先复制target的所有键
    for (const key in target) {
      result[key] = target[key]
    }
    // 然后添加source中的新键
    for (const key in source) {
      if (skipKeys.includes(key)) {
        // 跳过不需要翻译的字段，直接使用source的值
        result[key] = source[key]
      } else if (!(key in result)) {
        // 新字段，直接复制
        result[key] = JSON.parse(JSON.stringify(source[key]))
      } else {
        // 已存在的字段，递归合并
        result[key] = deepMerge(result[key], source[key], skipKeys)
      }
    }
    return result
  } else {
    // 如果是字符串，如果target已经是翻译过的（不是英文），保留target
    if (typeof target === 'string' && typeof source === 'string') {
      // 如果target看起来像是翻译（包含非ASCII字符），保留它
      if (/[^\x00-\x7F]/.test(target) && target !== source) {
        return target
      }
    }
    // 否则使用source（英文模板）
    return source
  }
}

// 处理每个语言文件
for (const lang of languages) {
  const filePath = path.join(__dirname, `../src/data/${lang}/image-compression.json`)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    continue
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (!data['compress-webp']) {
      console.log(`⚠️  compress-webp not found in ${lang}`)
      data['compress-webp'] = JSON.parse(JSON.stringify(enWebP))
    } else {
      // 深度合并，保留已翻译内容
      data['compress-webp'] = deepMerge(data['compress-webp'], enWebP)
    }
    
    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ Synced structure for ${lang}/image-compression.json`)
  } catch (error) {
    console.error(`❌ Error processing ${lang}:`, error.message)
  }
}

console.log('\n完成！已同步所有语言的结构')
