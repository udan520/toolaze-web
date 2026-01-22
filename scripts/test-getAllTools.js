// 测试 getAllTools 函数
const { getAllTools } = require('../src/lib/seo-loader')

async function test() {
  console.log('测试 getAllTools 函数...\n')
  
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  
  for (const locale of locales) {
    try {
      const tools = await getAllTools(locale)
      const compressorTools = tools.filter(t => t.tool === 'image-compressor')
      const converterTools = tools.filter(t => t.tool === 'image-converter')
      
      console.log(`${locale.toUpperCase()}:`)
      console.log(`  Image Compressor: ${compressorTools.length} 个工具`)
      console.log(`  Image Converter: ${converterTools.length} 个工具`)
      
      // 检查关键工具
      const keyTools = ['compress-jpg', 'compress-png', 'compress-webp', 'batch-compress', 'compress-image']
      const missing = keyTools.filter(tool => !compressorTools.find(t => t.slug === tool))
      if (missing.length > 0) {
        console.log(`  ⚠️  缺失: ${missing.join(', ')}`)
      }
      console.log('')
    } catch (error) {
      console.error(`${locale.toUpperCase()}: 错误 - ${error.message}`)
    }
  }
}

test().catch(console.error)
