const fs = require('fs')
const path = require('path')

// Metadata 翻译
const metadataTranslations = {
  'compress-jpg': {
    de: {
      title: "JPG online komprimieren (Kostenlos, Batch & Keine Werbung) - Toolaze",
      description: "Wie komprimiere ich JPG-Bilder? 1. JPG hochladen 2. Zielgröße festlegen 3. Komprimiert herunterladen. Dateigröße um 60% reduzieren bei gleichbleibender Qualität. Sicher & Privat."
    },
    es: {
      title: "Comprimir JPG Online (Gratis, Por Lotes y Sin Anuncios) - Toolaze",
      description: "¿Cómo comprimir imágenes JPG? 1. Sube JPG 2. Establece tamaño objetivo 3. Descarga comprimido. Reduce el tamaño del archivo en un 60% manteniendo la calidad. Seguro y Privado."
    },
    fr: {
      title: "Compresser JPG en Ligne (Gratuit, Par Lots et Sans Publicité) - Toolaze",
      description: "Comment compresser les images JPG? 1. Téléchargez JPG 2. Définissez la taille cible 3. Téléchargez compressé. Réduisez la taille du fichier de 60% tout en maintenant la qualité. Sécurisé et Privé."
    },
    pt: {
      title: "Comprimir JPG Online (Grátis, em Lote e Sem Anúncios) - Toolaze",
      description: "Como comprimir imagens JPG? 1. Envie JPG 2. Defina tamanho alvo 3. Baixe comprimido. Reduza o tamanho do arquivo em 60% mantendo a qualidade. Seguro e Privado."
    },
    it: {
      title: "Comprimi JPG Online (Gratuito, Batch e Senza Pubblicità) - Toolaze",
      description: "Come comprimere immagini JPG? 1. Carica JPG 2. Imposta dimensione obiettivo 3. Scarica compresso. Riduci la dimensione del file del 60% mantenendo la qualità. Sicuro e Privato."
    },
    ja: {
      title: "JPGをオンラインで圧縮（無料、バッチ処理、広告なし） - Toolaze",
      description: "JPG画像を圧縮する方法は？1. JPGをアップロード 2. 目標サイズを設定 3. 圧縮されたものをダウンロード。品質を維持しながらファイルサイズを60%削減。安全でプライベート。"
    },
    ko: {
      title: "JPG 온라인 압축 (무료, 일괄 처리 및 광고 없음) - Toolaze",
      description: "JPG 이미지를 압축하는 방법은? 1. JPG 업로드 2. 목표 크기 설정 3. 압축된 파일 다운로드. 품질을 유지하면서 파일 크기를 60% 줄입니다. 안전하고 비공개."
    },
    'zh-TW': {
      title: "在線壓縮 JPG（免費、批次處理、無廣告） - Toolaze",
      description: "如何壓縮 JPG 圖片？1. 上傳 JPG 2. 設定目標大小 3. 下載壓縮後的檔案。在保持品質的同時將檔案大小減少 60%。安全且私密。"
    }
  },
  'compress-webp': {
    de: {
      title: "WebP online komprimieren (Kostenlos, Batch & Keine Werbung) - Toolaze",
      description: "Wie komprimiere ich WebP-Bilder? 1. WebP hochladen 2. Zielgröße festlegen 3. Komprimiert herunterladen. Dateigröße um 30% reduzieren bei gleichbleibender Qualität. Sicher & Privat."
    },
    pt: {
      title: "Comprimir WebP Online (Grátis, em Lote e Sem Anúncios) - Toolaze",
      description: "Como comprimir imagens WebP? 1. Envie WebP 2. Defina tamanho alvo 3. Baixe comprimido. Reduza o tamanho do arquivo em 30% mantendo a qualidade. Seguro e Privado."
    }
  }
}

// 日语版本的 specs 翻译
const jaSpecsTranslations = {
  'image-to-50kb': {
    limit: "厳格な50KB制限 - ユニバーサルフォーム準拠",
    privacy: "100% クライアント側（ローカルブラウザ処理）"
  },
  'passport-photo-200kb': {
    limit: "200KBターゲット - グローバル更新準拠",
    privacy: "100% クライアント側（ローカルブラウザ処理）"
  },
  'compress-jpg': {
    engine: "Canvas API - ブラウザネイティブ処理",
    limit: "バッチ100+画像 - 無制限ファイルサイズ",
    logic: "正確なKB/MBサイズ制御",
    privacy: "100% クライアント側（ローカルブラウザ処理）"
  },
  'png-to-100kb': {
    privacy: "100% クライアント側（ローカルブラウザ処理）"
  }
}

async function main() {
  const languages = ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']
  
  // 处理 metadata
  console.log('处理 metadata...')
  for (const pageKey of Object.keys(metadataTranslations)) {
    console.log(`\n页面: ${pageKey}`)
    for (const lang of Object.keys(metadataTranslations[pageKey])) {
      const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
      if (!fs.existsSync(filePath)) continue
      
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (!data[pageKey] || !data[pageKey].metadata) continue
      
      const trans = metadataTranslations[pageKey][lang]
      if (trans.title) {
        data[pageKey].metadata.title = trans.title
      }
      if (trans.description) {
        data[pageKey].metadata.description = trans.description
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
      console.log(`  ✅ ${lang}: metadata 已更新`)
    }
  }
  
  // 处理日语版本的 specs
  console.log('\n\n处理日语版本的 specs...')
  for (const pageKey of Object.keys(jaSpecsTranslations)) {
    console.log(`\n页面: ${pageKey}`)
    const filePath = path.join(__dirname, '..', 'src', 'data', 'ja', 'image-compression.json')
    if (!fs.existsSync(filePath)) continue
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    if (!data[pageKey] || !data[pageKey].specs) continue
    
    const specs = jaSpecsTranslations[pageKey]
    Object.keys(specs).forEach(key => {
      data[pageKey].specs[key] = specs[key]
    })
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`  ✅ ja: specs 已更新`)
  }
  
  console.log('\n✨ 所有翻译完成!')
}

main().catch(console.error)
