const fs = require('fs');
const path = require('path');

// Comparison 内容翻译模板
const comparisonTranslations = {
  // Toolaze 特性翻译
  toolaze: {
    'Unlimited file sizes, Batch 100+ images, Precise size control, 100% local processing, No uploads, Free forever': {
      de: 'Unbegrenzte Dateigrößen, Stapel 100+ Bilder, Präzise Größensteuerung, 100% lokale Verarbeitung, Keine Uploads, Für immer kostenlos',
      es: 'Tamaños de archivo ilimitados, Lote 100+ imágenes, Control preciso del tamaño, 100% procesamiento local, Sin cargas, Gratis para siempre',
      fr: 'Tailles de fichier illimitées, Traitement par lots 100+ images, Contrôle précis de la taille, 100% traitement local, Aucun téléchargement, Gratuit pour toujours',
      it: 'Dimensioni file illimitate, Elaborazione batch 100+ immagini, Controllo preciso delle dimensioni, 100% elaborazione locale, Nessun caricamento, Gratuito per sempre',
      ja: '無制限のファイルサイズ、100枚以上の画像を一括処理、正確なサイズ制御、100%ローカル処理、アップロード不要、永久無料',
      ko: '무제한 파일 크기, 100개 이상 이미지 일괄 처리, 정확한 크기 제어, 100% 로컬 처리, 업로드 없음, 영구 무료',
      pt: 'Tamanhos de arquivo ilimitados, Lote 100+ imagens, Controle preciso de tamanho, 100% processamento local, Sem uploads, Grátis para sempre',
      'zh-TW': '無限制檔案大小、批次處理 100+ 圖片、精確大小控制、100% 本地處理、無需上傳、永久免費'
    },
    'Unlimited JPG compression, Precise size control, Batch processing, Local-first architecture, No file size limits, Complete privacy': {
      de: 'Unbegrenzte JPG-Komprimierung, Präzise Größensteuerung, Stapelverarbeitung, Lokal-zuerst-Architektur, Keine Dateigrößenbeschränkungen, Vollständige Privatsphäre',
      es: 'Compresión JPG ilimitada, Control preciso del tamaño, Procesamiento por lotes, Arquitectura local primero, Sin límites de tamaño de archivo, Privacidad completa',
      fr: 'Compression JPG illimitée, Contrôle précis de la taille, Traitement par lots, Architecture locale d\'abord, Aucune limite de taille de fichier, Confidentialité complète',
      it: 'Compressione JPG illimitata, Controllo preciso delle dimensioni, Elaborazione batch, Architettura locale prima, Nessun limite di dimensione del file, Privacy completa',
      ja: '無制限JPG圧縮、正確なサイズ制御、一括処理、ローカルファーストアーキテクチャ、ファイルサイズ制限なし、完全なプライバシー',
      ko: '무제한 JPG 압축, 정확한 크기 제어, 일괄 처리, 로컬 우선 아키텍처, 파일 크기 제한 없음, 완전한 개인정보 보호',
      pt: 'Compressão JPG ilimitada, Controle preciso de tamanho, Processamento em lote, Arquitetura local primeiro, Sem limites de tamanho de arquivo, Privacidade completa',
      'zh-TW': '無限制 JPG 壓縮、精確大小控制、批次處理、本地優先架構、無檔案大小限制、完全隱私'
    },
    'Spam-filter safe (20KB-50KB), Retina-ready quality, 100% browser-side processing, No watermarks or quality loss, Batch process up to 100 images, Free forever': {
      de: 'Spam-Filter sicher (20KB-50KB), Retina-taugliche Qualität, 100% Browser-seitige Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Bildern, Für immer kostenlos',
      es: 'Seguro para filtros de spam (20KB-50KB), Calidad lista para Retina, 100% procesamiento del lado del navegador, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes hasta 100 imágenes, Gratis para siempre',
      fr: 'Sûr pour les filtres anti-spam (20KB-50KB), Qualité prête pour Retina, 100% traitement côté navigateur, Aucune filigrane ou perte de qualité, Traitement par lots jusqu\'à 100 images, Gratuit pour toujours',
      it: 'Sicuro per filtri spam (20KB-50KB), Qualità pronta per Retina, 100% elaborazione lato browser, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 immagini, Gratuito per sempre',
      ja: 'スパムフィルター対応（20KB-50KB）、Retina対応品質、100%ブラウザ側処理、透かしや品質損失なし、最大100枚の画像を一括処理、永久無料',
      ko: '스팸 필터 안전 (20KB-50KB), Retina 품질 준비, 100% 브라우저 측 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이미지 일괄 처리, 영구 무료',
      pt: 'Seguro para filtros de spam (20KB-50KB), Qualidade pronta para Retina, 100% processamento do lado do navegador, Sem marcas d\'água ou perda de qualidade, Processamento em lote até 100 imagens, Grátis para sempre',
      'zh-TW': '垃圾郵件過濾器安全（20KB-50KB）、Retina 品質就緒、100% 瀏覽器端處理、無水印或品質損失、批次處理最多 100 張圖片、永久免費'
    }
  },
  
  // Other tools 限制翻译
  others: {
    '20MB file limits, Single file processing, No size control, Cloud uploads required, Server queues, Paid upgrades': {
      de: '20MB-Dateigrößenbeschränkungen, Einzeldateiverarbeitung, Keine Größensteuerung, Cloud-Uploads erforderlich, Server-Warteschlangen, Bezahlte Upgrades',
      es: 'Límites de archivo de 20MB, Procesamiento de archivo único, Sin control de tamaño, Cargas en la nube requeridas, Colas de servidor, Actualizaciones de pago',
      fr: 'Limites de fichier 20MB, Traitement de fichier unique, Aucun contrôle de taille, Téléchargements cloud requis, Files d\'attente serveur, Mises à niveau payantes',
      it: 'Limiti di file 20MB, Elaborazione file singolo, Nessun controllo delle dimensioni, Caricamenti cloud richiesti, Code del server, Aggiornamenti a pagamento',
      ja: '20MBファイル制限、単一ファイル処理、サイズ制御なし、クラウドアップロード必要、サーバーキュー、有料アップグレード',
      ko: '20MB 파일 제한, 단일 파일 처리, 크기 제어 없음, 클라우드 업로드 필요, 서버 대기열, 유료 업그레이드',
      pt: 'Limites de arquivo de 20MB, Processamento de arquivo único, Sem controle de tamanho, Uploads na nuvem necessários, Filas de servidor, Atualizações pagas',
      'zh-TW': '20MB 檔案限制、單一檔案處理、無大小控制、需要雲端上傳、伺服器佇列、付費升級'
    },
    '20MB file limits, Cloud uploads required, Single file processing, Server queues, EXIF data stripped, Privacy concerns': {
      de: '20MB-Dateigrößenbeschränkungen, Cloud-Uploads erforderlich, Einzeldateiverarbeitung, Server-Warteschlangen, EXIF-Daten entfernt, Datenschutzbedenken',
      es: 'Límites de archivo de 20MB, Cargas en la nube requeridas, Procesamiento de archivo único, Colas de servidor, Datos EXIF eliminados, Preocupaciones de privacidad',
      fr: 'Limites de fichier 20MB, Téléchargements cloud requis, Traitement de fichier unique, Files d\'attente serveur, Données EXIF supprimées, Préoccupations de confidentialité',
      it: 'Limiti di file 20MB, Caricamenti cloud richiesti, Elaborazione file singolo, Code del server, Dati EXIF rimossi, Preoccupazioni sulla privacy',
      ja: '20MBファイル制限、クラウドアップロード必要、単一ファイル処理、サーバーキュー、EXIFデータ削除、プライバシー懸念',
      ko: '20MB 파일 제한, 클라우드 업로드 필요, 단일 파일 처리, 서버 대기열, EXIF 데이터 제거, 개인정보 보호 우려',
      pt: 'Limites de arquivo de 20MB, Uploads na nuvem necessários, Processamento de arquivo único, Filas de servidor, Dados EXIF removidos, Preocupações de privacidade',
      'zh-TW': '20MB 檔案限制、需要雲端上傳、單一檔案處理、伺服器佇列、EXIF 數據被移除、隱私擔憂'
    },
    'Too heavy (triggers spam filters), Pixelated edges on Retina screens, Server uploads required, Watermarks or quality degradation, Limited batch processing, Subscription fees or ads': {
      de: 'Zu schwer (löst Spam-Filter aus), Verpixelte Kanten auf Retina-Bildschirmen, Server-Uploads erforderlich, Wasserzeichen oder Qualitätsverschlechterung, Begrenzte Stapelverarbeitung, Abonnementgebühren oder Werbung',
      es: 'Demasiado pesado (activa filtros de spam), Bordes pixelados en pantallas Retina, Cargas al servidor requeridas, Marcas de agua o degradación de calidad, Procesamiento por lotes limitado, Tarifas de suscripción o anuncios',
      fr: 'Trop lourd (déclenche les filtres anti-spam), Bords pixellisés sur les écrans Retina, Téléchargements serveur requis, Filigranes ou dégradation de qualité, Traitement par lots limité, Frais d\'abonnement ou publicités',
      it: 'Troppo pesante (attiva filtri spam), Bordi pixelati su schermi Retina, Caricamenti server richiesti, Filigrane o degrado della qualità, Elaborazione batch limitata, Tariffe di abbonamento o annunci',
      ja: '重すぎる（スパムフィルターをトリガー）、Retina画面でのピクセル化されたエッジ、サーバーアップロード必要、透かしや品質劣化、限定的な一括処理、サブスクリプション料金または広告',
      ko: '너무 무거움 (스팸 필터 트리거), Retina 화면에서 픽셀화된 가장자리, 서버 업로드 필요, 워터마크 또는 품질 저하, 제한된 일괄 처리, 구독료 또는 광고',
      pt: 'Muito pesado (aciona filtros de spam), Bordas pixeladas em telas Retina, Uploads de servidor necessários, Marcas d\'água ou degradação de qualidade, Processamento em lote limitado, Taxas de assinatura ou anúncios',
      'zh-TW': '太重（觸發垃圾郵件過濾器）、Retina 螢幕上的像素化邊緣、需要伺服器上傳、水印或品質下降、有限的批次處理、訂閱費用或廣告'
    }
  }
};

// 翻译函数 - 处理常见模式
function translateComparisonText(text, type, lang) {
  // 检查直接匹配
  if (comparisonTranslations[type] && comparisonTranslations[type][text] && comparisonTranslations[type][text][lang]) {
    return comparisonTranslations[type][text][lang];
  }
  
  // 处理常见模式
  const items = text.split(', ').map(item => item.trim());
  const translatedItems = items.map(item => {
    // 翻译常见短语
    if (item.includes('Unlimited')) {
      const translations = {
        de: item.replace('Unlimited', 'Unbegrenzt'),
        es: item.replace('Unlimited', 'Ilimitado'),
        fr: item.replace('Unlimited', 'Illimité'),
        it: item.replace('Unlimited', 'Illimitato'),
        ja: item.replace('Unlimited', '無制限'),
        ko: item.replace('Unlimited', '무제한'),
        pt: item.replace('Unlimited', 'Ilimitado'),
        'zh-TW': item.replace('Unlimited', '無限制')
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Batch')) {
      const translations = {
        de: item.replace('Batch', 'Stapel'),
        es: item.replace('Batch', 'Lote'),
        fr: item.replace('Batch', 'Lot'),
        it: item.replace('Batch', 'Elaborazione batch'),
        ja: item.replace('Batch', '一括'),
        ko: item.replace('Batch', '일괄'),
        pt: item.replace('Batch', 'Lote'),
        'zh-TW': item.replace('Batch', '批次')
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Precise size control')) {
      const translations = {
        de: 'Präzise Größensteuerung',
        es: 'Control preciso del tamaño',
        fr: 'Contrôle précis de la taille',
        it: 'Controllo preciso delle dimensioni',
        ja: '正確なサイズ制御',
        ko: '정확한 크기 제어',
        pt: 'Controle preciso de tamanho',
        'zh-TW': '精確大小控制'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('100% local processing') || item.includes('100% browser-side processing')) {
      const translations = {
        de: '100% lokale Verarbeitung',
        es: '100% procesamiento local',
        fr: '100% traitement local',
        it: '100% elaborazione locale',
        ja: '100%ローカル処理',
        ko: '100% 로컬 처리',
        pt: '100% processamento local',
        'zh-TW': '100% 本地處理'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Free forever')) {
      const translations = {
        de: 'Für immer kostenlos',
        es: 'Gratis para siempre',
        fr: 'Gratuit pour toujours',
        it: 'Gratuito per sempre',
        ja: '永久無料',
        ko: '영구 무료',
        pt: 'Grátis para sempre',
        'zh-TW': '永久免費'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Complete privacy')) {
      const translations = {
        de: 'Vollständige Privatsphäre',
        es: 'Privacidad completa',
        fr: 'Confidentialité complète',
        it: 'Privacy completa',
        ja: '完全なプライバシー',
        ko: '완전한 개인정보 보호',
        pt: 'Privacidade completa',
        'zh-TW': '完全隱私'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('No uploads')) {
      const translations = {
        de: 'Keine Uploads',
        es: 'Sin cargas',
        fr: 'Aucun téléchargement',
        it: 'Nessun caricamento',
        ja: 'アップロード不要',
        ko: '업로드 없음',
        pt: 'Sem uploads',
        'zh-TW': '無需上傳'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('20MB file limits')) {
      const translations = {
        de: '20MB-Dateigrößenbeschränkungen',
        es: 'Límites de archivo de 20MB',
        fr: 'Limites de fichier 20MB',
        it: 'Limiti di file 20MB',
        ja: '20MBファイル制限',
        ko: '20MB 파일 제한',
        pt: 'Limites de arquivo de 20MB',
        'zh-TW': '20MB 檔案限制'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Cloud uploads required')) {
      const translations = {
        de: 'Cloud-Uploads erforderlich',
        es: 'Cargas en la nube requeridas',
        fr: 'Téléchargements cloud requis',
        it: 'Caricamenti cloud richiesti',
        ja: 'クラウドアップロード必要',
        ko: '클라우드 업로드 필요',
        pt: 'Uploads na nuvem necessários',
        'zh-TW': '需要雲端上傳'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Single file processing')) {
      const translations = {
        de: 'Einzeldateiverarbeitung',
        es: 'Procesamiento de archivo único',
        fr: 'Traitement de fichier unique',
        it: 'Elaborazione file singolo',
        ja: '単一ファイル処理',
        ko: '단일 파일 처리',
        pt: 'Processamento de arquivo único',
        'zh-TW': '單一檔案處理'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Server queues')) {
      const translations = {
        de: 'Server-Warteschlangen',
        es: 'Colas de servidor',
        fr: 'Files d\'attente serveur',
        it: 'Code del server',
        ja: 'サーバーキュー',
        ko: '서버 대기열',
        pt: 'Filas de servidor',
        'zh-TW': '伺服器佇列'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Privacy concerns')) {
      const translations = {
        de: 'Datenschutzbedenken',
        es: 'Preocupaciones de privacidad',
        fr: 'Préoccupations de confidentialité',
        it: 'Preoccupazioni sulla privacy',
        ja: 'プライバシー懸念',
        ko: '개인정보 보호 우려',
        pt: 'Preocupações de privacidade',
        'zh-TW': '隱私擔憂'
      };
      return translations[lang] || item;
    }
    
    return item;
  });
  
  return translatedItems.join(', ');
}

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const enFile = path.join(__dirname, '../src/data/en/image-compression.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

let totalFixed = 0;

languages.forEach(lang => {
  const filePath = path.join(__dirname, '../src/data', lang, 'image-compression.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let langFixed = 0;
  
  // 修复所有工具的comparison
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.comparison) return;
    
    const enComparison = enTool.comparison;
    const langComparison = langTool.comparison || {};
    
    if (!langTool.comparison) {
      langTool.comparison = {};
    }
    
    // 修复toolaze
    if (enComparison.toolaze) {
      const translatedToolaze = translateComparisonText(enComparison.toolaze, 'toolaze', lang);
      if (translatedToolaze !== enComparison.toolaze && (!langComparison.toolaze || langComparison.toolaze === enComparison.toolaze)) {
        langComparison.toolaze = translatedToolaze;
        langFixed++;
      }
    }
    
    // 修复others
    if (enComparison.others) {
      const translatedOthers = translateComparisonText(enComparison.others, 'others', lang);
      if (translatedOthers !== enComparison.others && (!langComparison.others || langComparison.others === enComparison.others)) {
        langComparison.others = translatedOthers;
        langFixed++;
      }
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} comparison items`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} comparison translations`);
console.log(`⚠️  Note: Some items may still need manual translation for context-specific content`);
