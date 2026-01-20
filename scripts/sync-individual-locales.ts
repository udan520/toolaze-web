#!/usr/bin/env tsx
/**
 * 独立 JSON 文件多语言同步工具
 * 
 * 功能：
 * 1. 从英语源文件同步独立 JSON 文件到其他语言
 * 2. 保留已翻译的内容，只更新结构和新字段
 * 3. 新内容保持英文结构，可以后续手动翻译
 * 
 * 使用方法：
 * npm run sync-individual -- image-converter/heic-to-jpg.json
 * 或
 * npm run sync-individual -- image-converter/heic-to-jpg
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ES module 兼容：获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const DATA_DIR = path.join(__dirname, '..', 'src', 'data')

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
      if (key in existing && typeof existing[key] === 'object' && typeof source[key] === 'object' && !Array.isArray(existing[key]) && !Array.isArray(source[key])) {
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
 * 同步单个独立 JSON 文件
 */
function syncIndividualFile(filePath: string) {
  // 处理文件路径：支持带 .json 或不带
  let relativePath = filePath
  if (!relativePath.endsWith('.json')) {
    relativePath = `${relativePath}.json`
  }

  const enFile = path.join(DATA_DIR, 'en', relativePath)
  
  if (!fs.existsSync(enFile)) {
    console.error(`❌ English source file not found: ${enFile}`)
    console.error(`   Please check the file path. Example: image-converter/heic-to-jpg.json`)
    process.exit(1)
  }

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'))
  console.log(`\n📝 Processing ${relativePath}`)
  console.log(`   Source file: ${enFile}`)

  // 获取目录路径（用于创建目录结构）
  const dirPath = path.dirname(relativePath)
  const fileName = path.basename(relativePath)

  // 为每个语言同步内容
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === 'en') continue // 跳过英语本身

    const localeDir = path.join(DATA_DIR, locale, dirPath)
    const localeFile = path.join(localeDir, fileName)
    
    // 确保语言目录存在
    if (!fs.existsSync(localeDir)) {
      fs.mkdirSync(localeDir, { recursive: true })
      console.log(`   ✅ Created directory: ${locale}/${dirPath}`)
    }

    let existingContent: any = null

    // 读取现有的翻译文件（如果存在）
    if (fs.existsSync(localeFile)) {
      try {
        existingContent = JSON.parse(fs.readFileSync(localeFile, 'utf-8'))
        console.log(`   📖 Found existing ${locale} file`)
      } catch (error) {
        console.warn(`   ⚠️  Failed to parse existing ${locale} file, will create new one`)
        existingContent = null
      }
    }

    // 合并内容：保留已翻译的，添加新的
    const mergedContent = deepMerge(existingContent, enContent)

    // 保存合并后的内容
    fs.writeFileSync(
      localeFile,
      JSON.stringify(mergedContent, null, 2) + '\n',
      'utf-8'
    )

    if (existingContent === null) {
      console.log(`   ✅ ${locale}: Created new file (using English template)`)
    } else {
      console.log(`   ✅ ${locale}: Updated file (preserved translations, synced structure)`)
    }
  }
}

/**
 * 主函数
 */
async function main() {
  const filePath = process.argv[2]

  if (!filePath) {
    console.error('❌ Please provide a file path')
    console.error('   Usage: npm run sync-individual -- image-converter/heic-to-jpg.json')
    console.error('   Or:    npm run sync-individual -- image-converter/heic-to-jpg')
    process.exit(1)
  }

  console.log('🌍 Starting individual file multi-language sync...')
  console.log(`   Supported locales: ${SUPPORTED_LOCALES.join(', ')}`)
  console.log(`   File: ${filePath}`)

  syncIndividualFile(filePath)

  console.log('\n✨ Sync completed!')
  console.log('\n📋 Next steps:')
  console.log('   1. Check the generated files in src/data/[locale]/')
  console.log('   2. Translate the English content in each language file')
  console.log('   3. Run this script again after updating English content to sync new changes')
  console.log('   ℹ️  Note: Translated content will be preserved when syncing')
}

// 运行主函数
main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})

export { syncIndividualFile, deepMerge }
