const fs = require('fs')
const path = require('path')

// 读取英文版本作为参考
const enPath = path.join(__dirname, '../src/data/en/image-compression.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'))
const enPNG = enData['compress-png']

// 各语言的完整翻译映射
const translations = {
  'de': {
    intro: {
      content: [
        null,
        {
          title: 'Wann PNG komprimieren',
          text: 'Komprimieren Sie PNG-Bilder, wenn Sie Grafiken und Logos für schnellere Website-Ladezeiten optimieren müssen, Dateigrößen reduzieren müssen, während Sie Transparenz für Webdesign-Projekte beibehalten, Upload-Größenlimits für Online-Formulare oder Plattformen erfüllen müssen oder Speicherplatz sparen möchten, ohne die Transparenzfunktion zu verlieren. Unser Tool verwendet Canvas API, um PNG-Dateien lokal in Ihrem Browser zu komprimieren und gewährleistet vollständige Privatsphäre bei gleichzeitiger Beibehaltung der Alpha-Kanal-Transparenz, die das PNG-Format einzigartig macht.'
        }
      ]
    },
    features: {
      items: [
        null, null, null, null,
        {
          title: 'Schnelle Komprimierung',
          desc: 'Die browser-native Canvas API-Verarbeitung gewährleistet sofortige Komprimierung ohne Server-Uploads oder Verzögerungen.'
        },
        null
      ]
    },
    specs: {
      engine: 'Canvas API - Browser-Native Verarbeitung'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { value: '100% Client-Side (Browser Canvas API)' }
      ]
    }
  },
  'ja': {
    intro: {
      content: [
        null,
        {
          title: 'PNGを圧縮するタイミング',
          text: 'Webサイトの読み込みを高速化するためにグラフィックやロゴを最適化する必要がある場合、Webデザインプロジェクトで透明度を維持しながらファイルサイズを削減する必要がある場合、オンラインフォームやプラットフォームのアップロードサイズ制限を満たす場合、または透明度機能を失うことなくストレージスペースを節約する場合にPNG画像を圧縮します。当社のツールはCanvas APIを使用してブラウザ内でPNGファイルをローカルに圧縮し、PNG形式を独特にするアルファチャンネルの透明度を維持しながら完全なプライバシーを確保します。'
        }
      ]
    },
    features: {
      items: [
        null, null, null, null,
        {
          title: '高速圧縮',
          desc: 'ブラウザネイティブのCanvas API処理により、サーバーアップロードや遅延なしで即座に圧縮されます。'
        },
        null
      ]
    },
    specs: {
      engine: 'Canvas API - ブラウザネイティブ処理'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { value: '100%クライアント側（ブラウザCanvas API）' }
      ]
    },
    faq: [
      null, null, null,
      {
        q: 'PNG圧縮は無料で安全ですか？',
        a: 'はい！Toolazeは完全に無料で、隠れたコストはありません。すべての圧縮はブラウザでローカルに実行されます。PNGファイルがデバイスを離れることはなく、100%のプライバシーとセキュリティを保証します。'
      },
      null, null
    ]
  },
  'es': {
    intro: {
      content: [
        null,
        {
          title: 'Cuándo Comprimir PNG',
          text: 'Comprime imágenes PNG cuando necesites optimizar gráficos y logotipos para una carga más rápida del sitio web, reducir tamaños de archivo mientras mantienes la transparencia para proyectos de diseño web, cumplir límites de tamaño de carga para formularios en línea o plataformas, o ahorrar espacio de almacenamiento sin perder la función de transparencia. Nuestra herramienta usa Canvas API para comprimir archivos PNG localmente en tu navegador, garantizando privacidad completa mientras preserva la transparencia del canal alfa que hace único al formato PNG.'
        }
      ]
    },
    specs: {
      engine: 'Canvas API - Procesamiento Browser-Native'
    },
    faq: [
      null, null, null,
      {
        q: '¿La compresión PNG es gratuita y segura?',
        a: '¡Sí! Toolaze es completamente gratuito para siempre sin costos ocultos. Toda la compresión ocurre localmente en tu navegador. Tus archivos PNG nunca abandonan tu dispositivo, garantizando 100% de privacidad y seguridad.'
      },
      null, null
    ]
  },
  'zh-TW': {
    intro: {
      content: [
        null,
        {
          title: '何時壓縮 PNG',
          text: '當您需要優化圖形和標誌以加快網站載入速度、在保持透明度的同時減少檔案大小以用於網頁設計專案、滿足線上表單或平台的上傳大小限制，或在不失透明度功能的情況下節省儲存空間時，請壓縮 PNG 圖片。我們的工具使用 Canvas API 在您的瀏覽器中本地壓縮 PNG 檔案，確保完全隱私，同時保留使 PNG 格式獨特的 Alpha 通道透明度。'
        }
      ]
    },
    features: {
      items: [
        null, null, null, null,
        {
          title: '快速壓縮',
          desc: '瀏覽器原生 Canvas API 處理確保即時壓縮，無需服務器上傳或延遲。'
        },
        null
      ]
    },
    specs: {
      engine: 'Canvas API - 瀏覽器原生處理'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { value: '100% 客戶端（瀏覽器 Canvas API）' }
      ]
    },
    faq: [
      {
        q: '壓縮 PNG 時會保留透明度嗎？',
        a: '是的，我們的 PNG 壓縮工具專門設計用於在壓縮過程中保留 Alpha 通道透明度。PNG 圖片中的所有透明區域都將保持透明。'
      },
      null, null,
      {
        q: 'PNG 壓縮是免費且安全的嗎？',
        a: '是的！Toolaze 完全免費，沒有隱藏成本。所有壓縮都在您的瀏覽器中本地進行。您的 PNG 檔案永遠不會離開您的設備，確保 100% 的隱私和安全。'
      },
      null, null
    ]
  },
  'pt': {
    intro: {
      content: [
        null,
        {
          title: 'Quando Comprimir PNG',
          text: 'Comprima imagens PNG quando precisar otimizar gráficos e logotipos para carregamento mais rápido do site, reduzir tamanhos de arquivo mantendo a transparência para projetos de design web, atender limites de tamanho de upload para formulários online ou plataformas, ou economizar espaço de armazenamento sem perder a função de transparência. Nossa ferramenta usa Canvas API para comprimir arquivos PNG localmente no seu navegador, garantindo privacidade completa enquanto preserva a transparência do canal alfa que torna o formato PNG único.'
        }
      ]
    },
    specs: {
      engine: 'Canvas API - Processamento Browser-Native'
    },
    faq: [
      null, null, null,
      {
        q: 'A compressão PNG é gratuita e segura?',
        a: 'Sim! Toolaze é completamente gratuito para sempre sem custos ocultos. Toda a compressão acontece localmente no seu navegador. Seus arquivos PNG nunca deixam seu dispositivo, garantindo 100% de privacidade e segurança.'
      },
      null, null
    ]
  },
  'fr': {
    intro: {
      content: [
        null,
        {
          title: 'Quand Compresser PNG',
          text: 'Compressez les images PNG lorsque vous devez optimiser les graphiques et les logos pour un chargement plus rapide du site web, réduire les tailles de fichier tout en maintenant la transparence pour les projets de conception web, respecter les limites de taille de téléchargement pour les formulaires en ligne ou les plateformes, ou économiser de l\'espace de stockage sans perdre la fonction de transparence. Notre outil utilise Canvas API pour compresser les fichiers PNG localement dans votre navigateur, garantissant une confidentialité complète tout en préservant la transparence du canal alpha qui rend le format PNG unique.'
        }
      ]
    },
    specs: {
      engine: 'Canvas API - Traitement Browser-Native'
    },
    faq: [
      null, null, null,
      {
        q: 'La compression PNG est-elle gratuite et sécurisée?',
        a: 'Oui! Toolaze est complètement gratuit pour toujours sans coûts cachés. Toute la compression se fait localement dans votre navigateur. Vos fichiers PNG ne quittent jamais votre appareil, garantissant 100% de confidentialité et de sécurité.'
      },
      null, null
    ]
  },
  'ko': {
    intro: {
      content: [
        null,
        {
          title: 'PNG 압축 시기',
          text: '웹사이트 로딩을 더 빠르게 하기 위해 그래픽과 로고를 최적화해야 하는 경우, 웹 디자인 프로젝트를 위해 투명도를 유지하면서 파일 크기를 줄여야 하는 경우, 온라인 양식 또는 플랫폼의 업로드 크기 제한을 충족해야 하는 경우, 또는 투명도 기능을 잃지 않고 저장 공간을 절약해야 하는 경우 PNG 이미지를 압축합니다. 당사 도구는 Canvas API를 사용하여 브라우저에서 PNG 파일을 로컬로 압축하여 PNG 형식을 고유하게 만드는 알파 채널 투명도를 유지하면서 완전한 개인 정보 보호를 보장합니다.'
        }
      ]
    },
    features: {
      items: [
        null, null, null, null,
        {
          title: '빠른 압축',
          desc: '브라우저 네이티브 Canvas API 처리는 서버 업로드나 지연 없이 즉시 압축을 보장합니다.'
        },
        null
      ]
    },
    specs: {
      engine: 'Canvas API - 브라우저 네이티브 처리'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { value: '100% 클라이언트 측 (브라우저 Canvas API)' }
      ]
    },
    faq: [
      null, null, null,
      {
        q: 'PNG 압축이 무료이고 안전한가요?',
        a: '네! Toolaze는 완전히 무료이며 숨겨진 비용이 없습니다. 모든 압축은 브라우저에서 로컬로 수행됩니다. PNG 파일이 기기를 떠나지 않아 100%의 개인정보 보호와 보안을 보장합니다.'
      },
      null, null
    ]
  },
  'it': {
    intro: {
      content: [
        null,
        {
          title: 'Quando Comprimere PNG',
          text: 'Comprimi le immagini PNG quando devi ottimizzare grafici e loghi per un caricamento più rapido del sito web, ridurre le dimensioni dei file mantenendo la trasparenza per progetti di design web, soddisfare i limiti di dimensione di caricamento per moduli online o piattaforme, o risparmiare spazio di archiviazione senza perdere la funzione di trasparenza. Il nostro strumento utilizza Canvas API per comprimere i file PNG localmente nel tuo browser, garantendo la privacy completa preservando la trasparenza del canale alfa che rende unico il formato PNG.'
        }
      ]
    },
    specs: {
      engine: 'Canvas API - Elaborazione Browser-Native'
    },
    faq: [
      null, null, null,
      {
        q: 'La compressione PNG è gratuita e sicura?',
        a: 'Sì! Toolaze è completamente gratuito per sempre senza costi nascosti. Tutta la compressione avviene localmente nel tuo browser. I tuoi file PNG non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza al 100%.'
      },
      null,
      {
        q: 'Il PNG compresso mantiene la trasparenza?',
        a: 'Sì, i file PNG compressi mantengono la piena trasparenza del canale alfa. Lo strumento ottimizza la dimensione del file preservando tutte le funzionalità di trasparenza.'
      }
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
    
    if (!data['compress-png']) {
      console.log(`⚠️  compress-png 不存在于 ${lang}`)
      return false
    }

    const langTranslations = translations[lang]
    if (!langTranslations) {
      console.log(`ℹ️  没有翻译数据: ${lang}`)
      return true
    }

    const pngData = data['compress-png']
    
    // 应用翻译
    if (langTranslations.intro) {
      if (langTranslations.intro.content) {
        pngData.intro.content = deepMerge(pngData.intro.content, langTranslations.intro.content)
      }
    }
    
    if (langTranslations.features && langTranslations.features.items) {
      pngData.features.items = deepMerge(pngData.features.items, langTranslations.features.items)
    }
    
    if (langTranslations.specs) {
      Object.assign(pngData.specs, langTranslations.specs)
    }
    
    if (langTranslations.performanceMetrics) {
      if (langTranslations.performanceMetrics.metrics) {
        pngData.performanceMetrics.metrics = deepMerge(pngData.performanceMetrics.metrics, langTranslations.performanceMetrics.metrics)
      }
    }
    
    if (langTranslations.faq) {
      pngData.faq = deepMerge(pngData.faq, langTranslations.faq)
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
  console.log('开始修复 compress-png 页面的多语言翻译...\n')
  
  const languages = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  let successCount = 0
  
  for (const lang of languages) {
    if (processLanguage(lang)) {
      successCount++
    }
  }
  
  console.log(`\n完成！成功修复 ${successCount}/${languages.length} 个语言文件`)
}

main()
