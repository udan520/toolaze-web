const fs = require('fs')
const path = require('path')

// 各语言的翻译映射
const translations = {
  'de': {
    'Why Compress WebP Images?': 'Warum WebP-Bilder komprimieren?',
    'WebP Compression Benefits': 'Vorteile der WebP-Komprimierung',
    'When to Compress WebP': 'Wann WebP komprimieren',
    'WebP Compression Features': 'WebP-Komprimierungsfunktionen',
    'Superior Compression': 'Überlegene Komprimierung',
    'Transparency Support': 'Transparenz-Unterstützung',
    '100% Private Processing': '100% private Verarbeitung',
    'Batch Processing': 'Stapelverarbeitung',
    'Fast Compression': 'Schnelle Komprimierung',
    'Free Forever': 'Kostenlos für immer',
    'Technical Specifications': 'Technische Spezifikationen',
    'Input Format': 'Eingabeformat',
    'Output Format': 'Ausgabeformat',
    'Max Batch Size': 'Maximale Stapelgröße',
    'File Size Limit': 'Dateigrößenlimit',
    'Compression Ratio': 'Komprimierungsverhältnis',
    'Transparency Support': 'Transparenz-Unterstützung',
    'Processing Location': 'Verarbeitungsort',
    'How to Compress WebP Images': 'So komprimieren Sie WebP-Bilder',
    'Upload Your WebP Files': 'Laden Sie Ihre WebP-Dateien hoch',
    'Set Target Size': 'Zielgröße festlegen',
    'Download Compressed Files': 'Komprimierte Dateien herunterladen',
    'Web Developers': 'Web-Entwickler',
    'Mobile App Developers': 'Mobile-App-Entwickler',
    'Content Creators': 'Content-Ersteller',
  },
  'ja': {
    'Why Compress WebP Images?': 'WebP画像を圧縮する理由',
    'WebP Compression Benefits': 'WebP圧縮の利点',
    'When to Compress WebP': 'WebPを圧縮するタイミング',
    'WebP Compression Features': 'WebP圧縮機能',
    'Superior Compression': '優れた圧縮',
    'Transparency Support': '透明度サポート',
    '100% Private Processing': '100%プライベート処理',
    'Batch Processing': 'バッチ処理',
    'Fast Compression': '高速圧縮',
    'Free Forever': '永久無料',
    'Technical Specifications': '技術仕様',
    'Input Format': '入力形式',
    'Output Format': '出力形式',
    'Max Batch Size': '最大バッチサイズ',
    'File Size Limit': 'ファイルサイズ制限',
    'Compression Ratio': '圧縮率',
    'Transparency Support': '透明度サポート',
    'Processing Location': '処理場所',
    'How to Compress WebP Images': 'WebP画像の圧縮方法',
    'Upload Your WebP Files': 'WebPファイルをアップロード',
    'Set Target Size': '目標サイズを設定',
    'Download Compressed Files': '圧縮ファイルをダウンロード',
    'Web Developers': 'Web開発者',
    'Mobile App Developers': 'モバイルアプリ開発者',
    'Content Creators': 'コンテンツクリエイター',
  },
  'es': {
    'Why Compress WebP Images?': '¿Por qué comprimir imágenes WebP?',
    'WebP Compression Benefits': 'Beneficios de la compresión WebP',
    'When to Compress WebP': 'Cuándo comprimir WebP',
    'WebP Compression Features': 'Características de compresión WebP',
    'Superior Compression': 'Compresión superior',
    'Transparency Support': 'Soporte de transparencia',
    '100% Private Processing': 'Procesamiento 100% privado',
    'Batch Processing': 'Procesamiento por lotes',
    'Fast Compression': 'Compresión rápida',
    'Free Forever': 'Gratis para siempre',
    'Technical Specifications': 'Especificaciones técnicas',
    'Input Format': 'Formato de entrada',
    'Output Format': 'Formato de salida',
    'Max Batch Size': 'Tamaño máximo de lote',
    'File Size Limit': 'Límite de tamaño de archivo',
    'Compression Ratio': 'Ratio de compresión',
    'Transparency Support': 'Soporte de transparencia',
    'Processing Location': 'Ubicación de procesamiento',
    'How to Compress WebP Images': 'Cómo comprimir imágenes WebP',
    'Upload Your WebP Files': 'Sube tus archivos WebP',
    'Set Target Size': 'Establecer tamaño objetivo',
    'Download Compressed Files': 'Descargar archivos comprimidos',
    'Web Developers': 'Desarrolladores web',
    'Mobile App Developers': 'Desarrolladores de aplicaciones móviles',
    'Content Creators': 'Creadores de contenido',
  },
  'fr': {
    'Why Compress WebP Images?': 'Pourquoi compresser les images WebP?',
    'WebP Compression Benefits': 'Avantages de la compression WebP',
    'When to Compress WebP': 'Quand compresser WebP',
    'WebP Compression Features': 'Fonctionnalités de compression WebP',
    'Superior Compression': 'Compression supérieure',
    'Transparency Support': 'Support de la transparence',
    '100% Private Processing': 'Traitement 100% privé',
    'Batch Processing': 'Traitement par lots',
    'Fast Compression': 'Compression rapide',
    'Free Forever': 'Gratuit pour toujours',
    'Technical Specifications': 'Spécifications techniques',
    'Input Format': 'Format d\'entrée',
    'Output Format': 'Format de sortie',
    'Max Batch Size': 'Taille de lot maximale',
    'File Size Limit': 'Limite de taille de fichier',
    'Compression Ratio': 'Ratio de compression',
    'Transparency Support': 'Support de la transparence',
    'Processing Location': 'Emplacement du traitement',
    'How to Compress WebP Images': 'Comment compresser les images WebP',
    'Upload Your WebP Files': 'Téléchargez vos fichiers WebP',
    'Set Target Size': 'Définir la taille cible',
    'Download Compressed Files': 'Télécharger les fichiers compressés',
    'Web Developers': 'Développeurs web',
    'Mobile App Developers': 'Développeurs d\'applications mobiles',
    'Content Creators': 'Créateurs de contenu',
  },
  'ko': {
    'Why Compress WebP Images?': 'WebP 이미지를 압축하는 이유',
    'WebP Compression Benefits': 'WebP 압축의 이점',
    'When to Compress WebP': 'WebP 압축 시기',
    'WebP Compression Features': 'WebP 압축 기능',
    'Superior Compression': '우수한 압축',
    'Transparency Support': '투명도 지원',
    '100% Private Processing': '100% 개인 처리',
    'Batch Processing': '일괄 처리',
    'Fast Compression': '빠른 압축',
    'Free Forever': '영구 무료',
    'Technical Specifications': '기술 사양',
    'Input Format': '입력 형식',
    'Output Format': '출력 형식',
    'Max Batch Size': '최대 일괄 크기',
    'File Size Limit': '파일 크기 제한',
    'Compression Ratio': '압축률',
    'Transparency Support': '투명도 지원',
    'Processing Location': '처리 위치',
    'How to Compress WebP Images': 'WebP 이미지 압축 방법',
    'Upload Your WebP Files': 'WebP 파일 업로드',
    'Set Target Size': '목표 크기 설정',
    'Download Compressed Files': '압축 파일 다운로드',
    'Web Developers': '웹 개발자',
    'Mobile App Developers': '모바일 앱 개발자',
    'Content Creators': '콘텐츠 제작자',
  },
  'pt': {
    'Why Compress WebP Images?': 'Por que comprimir imagens WebP?',
    'WebP Compression Benefits': 'Benefícios da compressão WebP',
    'When to Compress WebP': 'Quando comprimir WebP',
    'WebP Compression Features': 'Recursos de compressão WebP',
    'Superior Compression': 'Compressão superior',
    'Transparency Support': 'Suporte à transparência',
    '100% Private Processing': 'Processamento 100% privado',
    'Batch Processing': 'Processamento em lote',
    'Fast Compression': 'Compressão rápida',
    'Free Forever': 'Gratuito para sempre',
    'Technical Specifications': 'Especificações técnicas',
    'Input Format': 'Formato de entrada',
    'Output Format': 'Formato de saída',
    'Max Batch Size': 'Tamanho máximo do lote',
    'File Size Limit': 'Limite de tamanho do arquivo',
    'Compression Ratio': 'Taxa de compressão',
    'Transparency Support': 'Suporte à transparência',
    'Processing Location': 'Localização do processamento',
    'How to Compress WebP Images': 'Como comprimir imagens WebP',
    'Upload Your WebP Files': 'Carregue seus arquivos WebP',
    'Set Target Size': 'Definir tamanho alvo',
    'Download Compressed Files': 'Baixar arquivos comprimidos',
    'Web Developers': 'Desenvolvedores web',
    'Mobile App Developers': 'Desenvolvedores de aplicativos móveis',
    'Content Creators': 'Criadores de conteúdo',
  },
  'it': {
    'Why Compress WebP Images?': 'Perché comprimere le immagini WebP?',
    'WebP Compression Benefits': 'Vantaggi della compressione WebP',
    'When to Compress WebP': 'Quando comprimere WebP',
    'WebP Compression Features': 'Funzionalità di compressione WebP',
    'Superior Compression': 'Compressione superiore',
    'Transparency Support': 'Supporto trasparenza',
    '100% Private Processing': 'Elaborazione 100% privata',
    'Batch Processing': 'Elaborazione batch',
    'Fast Compression': 'Compressione veloce',
    'Free Forever': 'Gratuito per sempre',
    'Technical Specifications': 'Specifiche tecniche',
    'Input Format': 'Formato di input',
    'Output Format': 'Formato di output',
    'Max Batch Size': 'Dimensione batch massima',
    'File Size Limit': 'Limite dimensione file',
    'Compression Ratio': 'Rapporto di compressione',
    'Transparency Support': 'Supporto trasparenza',
    'Processing Location': 'Posizione elaborazione',
    'How to Compress WebP Images': 'Come comprimere immagini WebP',
    'Upload Your WebP Files': 'Carica i tuoi file WebP',
    'Set Target Size': 'Imposta dimensione target',
    'Download Compressed Files': 'Scarica file compressi',
    'Web Developers': 'Sviluppatori web',
    'Mobile App Developers': 'Sviluppatori di app mobili',
    'Content Creators': 'Creatori di contenuti',
  },
  'zh-TW': {
    'Why Compress WebP Images?': '為什麼要壓縮 WebP 圖片？',
    'WebP Compression Benefits': 'WebP 壓縮的優勢',
    'When to Compress WebP': '何時壓縮 WebP',
    'WebP Compression Features': 'WebP 壓縮功能',
    'Superior Compression': '優越的壓縮',
    'Transparency Support': '透明度支援',
    '100% Private Processing': '100% 私密處理',
    'Batch Processing': '批次處理',
    'Fast Compression': '快速壓縮',
    'Free Forever': '永久免費',
    'Technical Specifications': '技術規格',
    'Input Format': '輸入格式',
    'Output Format': '輸出格式',
    'Max Batch Size': '最大批次大小',
    'File Size Limit': '檔案大小限制',
    'Compression Ratio': '壓縮比率',
    'Transparency Support': '透明度支援',
    'Processing Location': '處理位置',
    'How to Compress WebP Images': '如何壓縮 WebP 圖片',
    'Upload Your WebP Files': '上傳您的 WebP 檔案',
    'Set Target Size': '設定目標大小',
    'Download Compressed Files': '下載壓縮檔案',
    'Web Developers': '網站開發者',
    'Mobile App Developers': '行動應用開發者',
    'Content Creators': '內容創作者',
  }
}

// 翻译文本函数
function translateText(text, lang) {
  if (typeof text !== 'string') return text
  if (!translations[lang]) return text
  
  const langTranslations = translations[lang]
  return langTranslations[text] || text
}

// 递归处理对象
function translateObject(obj, lang) {
  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, lang))
  } else if (obj !== null && typeof obj === 'object') {
    const translated = {}
    for (const [key, value] of Object.entries(obj)) {
      // 跳过不需要翻译的字段
      if (key === 'icon' || key === 'iconType' || key === 'in_menu' || key === 'sectionsOrder') {
        translated[key] = value
      } else if (key === 'title' || key === 'label') {
        // 翻译标题和标签
        translated[key] = translateText(value, lang)
      } else if (key === 'desc' && typeof value === 'string' && value.length < 200) {
        // 简短的描述，尝试翻译
        translated[key] = translateText(value, lang)
      } else {
        translated[key] = translateObject(value, lang)
      }
    }
    return translated
  } else if (typeof obj === 'string') {
    return translateText(obj, lang)
  }
  return obj
}

// 处理单个文件
function processFile(filePath, lang) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(content)
    
    // 只处理 compress-webp 部分
    if (data['compress-webp']) {
      data['compress-webp'] = translateObject(data['compress-webp'], lang)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
      return true
    }
    return false
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return false
  }
}

// 主函数
function main() {
  const dataDir = path.join(__dirname, '../src/data')
  const languages = ['de', 'ja', 'es', 'fr', 'ko', 'pt', 'it', 'zh-TW']
  let totalProcessed = 0
  
  for (const lang of languages) {
    const filePath = path.join(dataDir, lang, 'image-compression.json')
    if (fs.existsSync(filePath)) {
      if (processFile(filePath, lang)) {
        totalProcessed++
        console.log(`✅ Processed: ${lang}/image-compression.json`)
      }
    }
  }
  
  console.log(`\n完成！處理了 ${totalProcessed} 個語言文件`)
}

main()
