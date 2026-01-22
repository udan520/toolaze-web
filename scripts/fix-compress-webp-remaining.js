const fs = require('fs')
const path = require('path')

// 剩余需要翻译的字段
const remainingTranslations = {
  'de': {
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { value: '100% Client-Side (Browser Canvas API)' } // 这个保持英文，因为是技术术语
      ]
    }
  },
  'es': {
    specs: {
      engine: 'Canvas API - Procesamiento Browser-Native',
      privacy: '100% Client-Side (Procesamiento Browser Local)'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { value: '100% Client-Side (API Canvas Browser)' }
      ]
    },
    faq: [
      null, null, null,
      {
        a: '¡Sí! Toda la compresión ocurre localmente en tu navegador usando JavaScript y Canvas API. Tus imágenes nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas.'
      },
      null, null
    ]
  },
  'pt': {
    specs: {
      engine: 'Canvas API - Processamento Browser-Native',
      privacy: '100% Client-Side (Processamento Browser Local)'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { value: '100% Client-Side (API Canvas Browser)' }
      ]
    },
    faq: [
      null, null, null,
      {
        a: 'Sim! Toda a compressão acontece localmente no seu navegador usando JavaScript e Canvas API. Suas imagens nunca deixam seu dispositivo, garantindo privacidade e segurança completas.'
      },
      null, null
    ]
  },
  'fr': {
    specs: {
      engine: 'Canvas API - Traitement Browser-Native'
    },
    faq: [
      null, null, null,
      {
        a: 'Oui! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos images ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes.'
      },
      null, null
    ]
  },
  'it': {
    specs: {
      engine: 'Canvas API - Elaborazione Browser-Native',
      privacy: '100% Client-Side (Elaborazione Browser Locale)'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null,
        { label: 'Supporto trasparenza', value: 'Trasparenza completa del canale alfa preservata' },
        null,
        { value: '100% Client-Side (API Canvas Browser)' }
      ]
    },
    faq: [
      null, null, null,
      {
        a: 'Sì! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue immagini non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete.'
      },
      null, null
    ]
  },
  'ja': {
    faq: [
      null, null, null,
      {
        a: 'はい！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。画像がデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。'
      },
      null, null
    ]
  },
  'zh-TW': {
    faq: [
      null, null, null,
      {
        a: '是的！所有壓縮都在您的瀏覽器中使用 JavaScript 和 Canvas API 本地進行。您的圖片永遠不會離開您的設備，確保完全的隱私和安全。'
      },
      null, null
    ]
  },
  'ko': {
    faq: [
      null, null, null,
      {
        a: '네! 모든 압축은 JavaScript와 Canvas API를 사용하여 브라우저에서 로컬로 수행됩니다. 이미지가 기기를 떠나지 않아 완전한 개인정보 보호와 보안을 보장합니다.'
      },
      null, null
    ]
  }
}

// 深度合并函数
function deepMerge(target, source) {
  if (!source) return target
  if (Array.isArray(source)) {
    return source.map((item, index) => {
      if (item === null) return target[index]
      if (typeof item === 'object' && !Array.isArray(item)) {
        return deepMerge(target[index] || {}, item)
      }
      return item
    })
  }
  if (typeof source === 'object' && source !== null) {
    const result = { ...target }
    for (const [key, value] of Object.entries(source)) {
      if (value === null) continue
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        result[key] = deepMerge(target[key] || {}, value)
      } else if (Array.isArray(value)) {
        result[key] = deepMerge(target[key] || [], value)
      } else {
        result[key] = value
      }
    }
    return result
  }
  return source
}

// 处理单个语言文件
function processLanguage(lang) {
  const filePath = path.join(__dirname, `../src/data/${lang}/image-compression.json`)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${lang}/image-compression.json`)
    return false
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(content)
    
    if (!data['compress-webp']) {
      console.log(`⚠️  compress-webp 不存在于 ${lang}`)
      return false
    }

    const langTranslations = remainingTranslations[lang]
    if (!langTranslations) {
      console.log(`ℹ️  没有剩余翻译: ${lang}`)
      return true
    }

    const webpData = data['compress-webp']
    
    // 应用翻译
    if (langTranslations.specs) {
      Object.assign(webpData.specs, langTranslations.specs)
    }
    
    if (langTranslations.performanceMetrics) {
      if (langTranslations.performanceMetrics.metrics) {
        webpData.performanceMetrics.metrics = deepMerge(webpData.performanceMetrics.metrics, langTranslations.performanceMetrics.metrics)
      }
    }
    
    if (langTranslations.faq) {
      webpData.faq = deepMerge(webpData.faq, langTranslations.faq)
    }

    // 保存文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ 已修复: ${lang}/image-compression.json`)
    return true
  } catch (error) {
    console.error(`❌ 处理 ${lang} 时出错:`, error.message)
    return false
  }
}

// 主函数
function main() {
  console.log('修复 compress-webp 页面的剩余翻译...\n')
  
  const languages = ['de', 'es', 'pt', 'fr', 'it', 'ja', 'zh-TW', 'ko']
  let successCount = 0
  
  for (const lang of languages) {
    if (processLanguage(lang)) {
      successCount++
    }
  }
  
  console.log(`\n完成！成功修复 ${successCount}/${languages.length} 个语言文件`)
}

main()
