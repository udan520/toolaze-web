#!/usr/bin/env tsx
/**
 * 批量翻译所有三级页面
 * 以英语版本为主，翻译到所有其他语言
 * 完全遵循英语的内容和页面结构，不得增删
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 需要翻译的语言列表
const locales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

// 需要翻译的页面列表（11个特定工具页面）
const pagesToTranslate = [
  'jpg-to-20kb',
  'png-to-100kb',
  'uscis-photo-240kb',
  'image-to-50kb',
  'passport-photo-200kb',
  'amazon-product-10mb',
  'etsy-listing-1mb',
  'ebay-picture-fast',
  'youtube-thumbnail-2mb',
  'discord-emoji-256kb',
  'email-signature-20kb'
]

// 读取英语版本
const enDataPath = path.join(__dirname, '../src/data/en/image-compression.json')
const enData = JSON.parse(fs.readFileSync(enDataPath, 'utf8'))

console.log('🌍 开始翻译所有三级页面...')
console.log(`📄 需要翻译的页面数: ${pagesToTranslate.length}`)
console.log(`🌐 需要翻译的语言数: ${locales.length}`)
console.log(`📊 总翻译任务数: ${pagesToTranslate.length * locales.length}`)
console.log('')

// 翻译映射表（这里需要实际的翻译逻辑）
// 由于没有翻译API，这里只是复制结构
// 实际使用时需要调用翻译服务或手动翻译

for (const locale of locales) {
  const localeDataPath = path.join(__dirname, `../src/data/${locale}/image-compression.json`)
  let localeData: any = {}
  
  // 如果文件存在，读取现有数据
  if (fs.existsSync(localeDataPath)) {
    try {
      localeData = JSON.parse(fs.readFileSync(localeDataPath, 'utf8'))
    } catch (error) {
      console.error(`❌ 读取 ${locale} 数据失败:`, error)
      localeData = {}
    }
  }
  
  // 翻译每个页面
  for (const pageKey of pagesToTranslate) {
    if (enData[pageKey]) {
      // 获取英语版本的数据结构（深拷贝）
      const enPageData = JSON.parse(JSON.stringify(enData[pageKey]))
      
      console.log(`  📝 处理 ${locale}/${pageKey}...`)
      
      // 这里需要实际的翻译逻辑
      // 暂时保持英语内容，实际使用时需要翻译
      // TODO: 调用翻译API或使用翻译服务
      
      localeData[pageKey] = enPageData
    }
  }
  
  // 保存翻译后的数据
  const output = JSON.stringify(localeData, null, 2)
  fs.writeFileSync(localeDataPath, output, 'utf8')
  console.log(`✅ 已保存 ${locale} 的翻译数据`)
  console.log('')
}

console.log('✨ 翻译完成！')
console.log('⚠️  注意：此脚本只是复制了结构，实际翻译需要调用翻译API或手动翻译。')
console.log('📋 下一步：请手动翻译各语言文件中的英语内容。')
