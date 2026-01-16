#!/usr/bin/env ts-node
/**
 * 多语言 SEO 内容同步工具
 * 
 * 功能：
 * 1. 从英语源文件同步所有 slug 到其他语言
 * 2. 保留已翻译的内容，只添加新的 slug
 * 3. 新内容保持英文结构，可以后续手动翻译
 * 
 * 使用方法：
 * npm run sync-locales
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ES module 兼容：获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const DATA_DIR = path.join(__dirname, '..', 'src', 'data')
const TOOLS = ['image-compression', 'image-converter']

/**
 * 深度合并对象：保留已翻译的内容，使用源内容填充缺失的部分
 */
function deepMerge(existing: any, source: any): any {
  // 如果源内容不存在，返回现有内容
  if (source === null || source === undefined) {
    return existing
  }

  // 如果现有内容不存在，直接使用源内容（作为英文模板）
  if (existing === null || existing === undefined) {
    return JSON.parse(JSON.stringify(source)) // 深拷贝
  }

  // 如果是数组，合并数组元素
  if (Array.isArray(source)) {
    if (!Array.isArray(existing)) {
      return JSON.parse(JSON.stringify(source)) // 如果现有不是数组，使用源数组
    }
    
    // 合并数组：保留现有元素，添加新的元素
    const result: any[] = []
    const maxLength = Math.max(existing.length, source.length)
    
    for (let i = 0; i < maxLength; i++) {
      if (i < existing.length && i < source.length) {
        // 两个数组都有这个索引，递归合并
        result.push(deepMerge(existing[i], source[i]))
      } else if (i < existing.length) {
        // 只有现有数组有，保留
        result.push(existing[i])
      } else {
        // 只有源数组有，添加
        result.push(JSON.parse(JSON.stringify(source[i])))
      }
    }
    
    return result
  }

  // 如果是对象，递归合并
  if (typeof source === 'object' && typeof existing === 'object') {
    const result: any = {}
    
    // 先复制现有的所有键
    for (const key in existing) {
      result[key] = existing[key]
    }
    
    // 然后合并源对象中的键
    for (const key in source) {
      if (key in existing && typeof existing[key] === 'object' && typeof source[key] === 'object') {
        // 两个都是对象，递归合并
        result[key] = deepMerge(existing[key], source[key])
      } else if (!(key in existing)) {
        // 源对象有但现有对象没有，添加（使用英文模板）
        result[key] = JSON.parse(JSON.stringify(source[key]))
      }
      // 如果 key 已存在且是原始值，保留现有值（已翻译的内容）
    }
    
    return result
  }

  // 如果是原始值，保留现有值（优先已翻译的内容）
  return existing
}

/**
 * 同步单个工具文件
 */
function syncToolFile(toolName: string) {
  const enFile = path.join(DATA_DIR, 'en', `${toolName}.json`)
  
  if (!fs.existsSync(enFile)) {
    console.error(`❌ English source file not found: ${enFile}`)
    return
  }

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'))
  console.log(`\n📝 Processing ${toolName}.json`)
  console.log(`   Found ${Object.keys(enContent).length} slugs in English version`)

  // 为每个语言同步内容
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === 'en') continue // 跳过英语本身

    const localeDir = path.join(DATA_DIR, locale)
    
    // 确保语言目录存在
    if (!fs.existsSync(localeDir)) {
      fs.mkdirSync(localeDir, { recursive: true })
      console.log(`   ✅ Created directory: ${locale}`)
    }

    const localeFile = path.join(localeDir, `${toolName}.json`)
    let existingContent: any = {}

    // 读取现有的翻译文件（如果存在）
    if (fs.existsSync(localeFile)) {
      try {
        existingContent = JSON.parse(fs.readFileSync(localeFile, 'utf-8'))
      } catch (error) {
        console.warn(`   ⚠️  Failed to parse existing ${locale} file, creating new one`)
        existingContent = {}
      }
    }

    // 合并内容：保留已翻译的，添加新的
    const mergedContent: any = {}
    
    // 先保留所有现有的 slug（即使英语版本中没有了，也保留）
    for (const slug in existingContent) {
      mergedContent[slug] = existingContent[slug]
    }
    
    // 然后合并英语版本的所有 slug
    for (const slug in enContent) {
      if (existingContent[slug]) {
        // 已存在的 slug，深度合并（保留翻译，更新结构）
        mergedContent[slug] = deepMerge(existingContent[slug], enContent[slug])
      } else {
        // 新的 slug，直接复制英文版本作为模板
        mergedContent[slug] = JSON.parse(JSON.stringify(enContent[slug]))
      }
    }

    // 计算统计信息
    const newSlugs = Object.keys(enContent).filter(s => !existingContent[s])
    const totalSlugs = Object.keys(mergedContent).length

    // 保存合并后的内容
    fs.writeFileSync(
      localeFile,
      JSON.stringify(mergedContent, null, 2) + '\n',
      'utf-8'
    )

    if (newSlugs.length > 0) {
      console.log(`   ✅ ${locale}: Added ${newSlugs.length} new slug(s): ${newSlugs.join(', ')}`)
    } else {
      console.log(`   ✅ ${locale}: All ${totalSlugs} slug(s) up to date`)
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🌍 Starting multi-language SEO content sync...')
  console.log(`   Supported locales: ${SUPPORTED_LOCALES.join(', ')}`)
  console.log(`   Tools: ${TOOLS.join(', ')}`)

  for (const tool of TOOLS) {
    syncToolFile(tool)
  }

  console.log('\n✨ Sync completed!')
  console.log('\n📋 Next steps:')
  console.log('   1. Check the generated files in src/data/[locale]/')
  console.log('   2. Translate the English content in each language file')
  console.log('   3. Run this script again after updating English content to sync new changes')
  console.log('   ℹ️  Note: Translated content will be preserved when syncing')
}

// 运行主函数（ES module 兼容）
main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})

export { syncToolFile, deepMerge }
