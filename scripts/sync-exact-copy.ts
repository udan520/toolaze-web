#!/usr/bin/env tsx
/**
 * 精确复制同步工具
 * 将英语版本的内容完全复制到其他语言版本（用于确保结构和内容完全一致）
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPPORTED_LOCALES = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const DATA_DIR = path.join(__dirname, '..', 'src', 'data')

function syncExactCopy(filePath: string) {
  // 处理文件路径
  let relativePath = filePath
  if (!relativePath.endsWith('.json')) {
    relativePath = `${relativePath}.json`
  }

  const enFile = path.join(DATA_DIR, 'en', relativePath)
  
  if (!fs.existsSync(enFile)) {
    console.error(`❌ English source file not found: ${enFile}`)
    process.exit(1)
  }

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'))
  console.log(`\n📝 Processing ${relativePath}`)
  console.log(`   Source file: ${enFile}`)

  const dirPath = path.dirname(relativePath)
  const fileName = path.basename(relativePath)

  // 为每个语言完全复制英语版本
  for (const locale of SUPPORTED_LOCALES) {
    const localeDir = path.join(DATA_DIR, locale, dirPath)
    const localeFile = path.join(localeDir, fileName)
    
    // 确保语言目录存在
    if (!fs.existsSync(localeDir)) {
      fs.mkdirSync(localeDir, { recursive: true })
      console.log(`   ✅ Created directory: ${locale}/${dirPath}`)
    }

    // 完全复制英语版本的内容
    fs.writeFileSync(
      localeFile,
      JSON.stringify(enContent, null, 2) + '\n',
      'utf-8'
    )

    console.log(`   ✅ ${locale}: Copied exact content from English version`)
  }
}

async function main() {
  const filePath = process.argv[2]

  if (!filePath) {
    console.error('❌ Please provide a file path')
    console.error('   Usage: npm run sync-exact -- image-converter/heic-to-jpg.json')
    process.exit(1)
  }

  console.log('🌍 Starting exact copy sync...')
  console.log(`   File: ${filePath}`)
  console.log(`   ⚠️  WARNING: This will replace all content in other languages with English version!`)

  syncExactCopy(filePath)

  console.log('\n✨ Sync completed!')
  console.log('\n📋 Note:')
  console.log('   All language files now have the exact same content as English version.')
  console.log('   You can now translate the content in each language file.')
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
