const fs = require('fs');
const path = require('path');

// Compare字段的翻译模板（与comparison相同）
const compareTranslations = {
  toolaze: {
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
    'Unlimited PNG compression, Transparency preserved, Batch processing, Local-first architecture, No file size limits, Complete privacy': {
      de: 'Unbegrenzte PNG-Komprimierung, Transparenz erhalten, Stapelverarbeitung, Lokal-zuerst-Architektur, Keine Dateigrößenbeschränkungen, Vollständige Privatsphäre',
      es: 'Compresión PNG ilimitada, Transparencia preservada, Procesamiento por lotes, Arquitectura local primero, Sin límites de tamaño de archivo, Privacidad completa',
      fr: 'Compression PNG illimitée, Transparence préservée, Traitement par lots, Architecture locale d\'abord, Aucune limite de taille de fichier, Confidentialité complète',
      it: 'Compressione PNG illimitata, Trasparenza preservata, Elaborazione batch, Architettura locale prima, Nessun limite di dimensione del file, Privacy completa',
      ja: '無制限PNG圧縮、透明度保持、一括処理、ローカルファーストアーキテクチャ、ファイルサイズ制限なし、完全なプライバシー',
      ko: '무제한 PNG 압축, 투명도 보존, 일괄 처리, 로컬 우선 아키텍처, 파일 크기 제한 없음, 완전한 개인정보 보호',
      pt: 'Compressão PNG ilimitada, Transparência preservada, Processamento em lote, Arquitetura local primeiro, Sem limites de tamanho de arquivo, Privacidade completa',
      'zh-TW': '無限制 PNG 壓縮、透明度保留、批次處理、本地優先架構、無檔案大小限制、完全隱私'
    },
    'Unlimited WebP compression, Quality preserved, Batch processing, Local-first architecture, No file size limits, Complete privacy': {
      de: 'Unbegrenzte WebP-Komprimierung, Qualität erhalten, Stapelverarbeitung, Lokal-zuerst-Architektur, Keine Dateigrößenbeschränkungen, Vollständige Privatsphäre',
      es: 'Compresión WebP ilimitada, Calidad preservada, Procesamiento por lotes, Arquitectura local primero, Sin límites de tamaño de archivo, Privacidad completa',
      fr: 'Compression WebP illimitée, Qualité préservée, Traitement par lots, Architecture locale d\'abord, Aucune limite de taille de fichier, Confidentialité complète',
      it: 'Compressione WebP illimitata, Qualità preservata, Elaborazione batch, Architettura locale prima, Nessun limite di dimensione del file, Privacy completa',
      ja: '無制限WebP圧縮、品質保持、一括処理、ローカルファーストアーキテクチャ、ファイルサイズ制限なし、完全なプライバシー',
      ko: '무제한 WebP 압축, 품질 보존, 일괄 처리, 로컬 우선 아키텍처, 파일 크기 제한 없음, 완전한 개인정보 보호',
      pt: 'Compressão WebP ilimitada, Qualidade preservada, Processamento em lote, Arquitetura local primeiro, Sem limites de tamanho de arquivo, Privacidade completa',
      'zh-TW': '無限制 WebP 壓縮、品質保留、批次處理、本地優先架構、無檔案大小限制、完全隱私'
    },
    'Unlimited HEIC compression, Batch processing, Local-first architecture, No file size limits, Complete privacy': {
      de: 'Unbegrenzte HEIC-Komprimierung, Stapelverarbeitung, Lokal-zuerst-Architektur, Keine Dateigrößenbeschränkungen, Vollständige Privatsphäre',
      es: 'Compresión HEIC ilimitada, Procesamiento por lotes, Arquitectura local primero, Sin límites de tamaño de archivo, Privacidad completa',
      fr: 'Compression HEIC illimitée, Traitement par lots, Architecture locale d\'abord, Aucune limite de taille de fichier, Confidentialité complète',
      it: 'Compressione HEIC illimitata, Elaborazione batch, Architettura locale prima, Nessun limite di dimensione del file, Privacy completa',
      ja: '無制限HEIC圧縮、一括処理、ローカルファーストアーキテクチャ、ファイルサイズ制限なし、完全なプライバシー',
      ko: '무제한 HEIC 압축, 일괄 처리, 로컬 우선 아키텍처, 파일 크기 제한 없음, 완전한 개인정보 보호',
      pt: 'Compressão HEIC ilimitada, Processamento em lote, Arquitetura local primeiro, Sem limites de tamanho de arquivo, Privacidade completa',
      'zh-TW': '無限制 HEIC 壓縮、批次處理、本地優先架構、無檔案大小限制、完全隱私'
    }
  },
  
  others: {
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
    '20MB file limits, Transparency lost, Cloud uploads required, Single file processing, Server queues, Privacy concerns': {
      de: '20MB-Dateigrößenbeschränkungen, Transparenz verloren, Cloud-Uploads erforderlich, Einzeldateiverarbeitung, Server-Warteschlangen, Datenschutzbedenken',
      es: 'Límites de archivo de 20MB, Transparencia perdida, Cargas en la nube requeridas, Procesamiento de archivo único, Colas de servidor, Preocupaciones de privacidad',
      fr: 'Limites de fichier 20MB, Transparence perdue, Téléchargements cloud requis, Traitement de fichier unique, Files d\'attente serveur, Préoccupations de confidentialité',
      it: 'Limiti di file 20MB, Trasparenza persa, Caricamenti cloud richiesti, Elaborazione file singolo, Code del server, Preoccupazioni sulla privacy',
      ja: '20MBファイル制限、透明度の喪失、クラウドアップロード必要、単一ファイル処理、サーバーキュー、プライバシー懸念',
      ko: '20MB 파일 제한, 투명도 손실, 클라우드 업로드 필요, 단일 파일 처리, 서버 대기열, 개인정보 보호 우려',
      pt: 'Limites de arquivo de 20MB, Transparência perdida, Uploads na nuvem necessários, Processamento de arquivo único, Filas de servidor, Preocupações de privacidade',
      'zh-TW': '20MB 檔案限制、失去透明度、需要雲端上傳、單一檔案處理、伺服器佇列、隱私擔憂'
    },
    '20MB file limits, Quality loss, Cloud uploads required, Single file processing, Server queues, Privacy concerns': {
      de: '20MB-Dateigrößenbeschränkungen, Qualitätsverlust, Cloud-Uploads erforderlich, Einzeldateiverarbeitung, Server-Warteschlangen, Datenschutzbedenken',
      es: 'Límites de archivo de 20MB, Pérdida de calidad, Cargas en la nube requeridas, Procesamiento de archivo único, Colas de servidor, Preocupaciones de privacidad',
      fr: 'Limites de fichier 20MB, Perte de qualité, Téléchargements cloud requis, Traitement de fichier unique, Files d\'attente serveur, Préoccupations de confidentialité',
      it: 'Limiti di file 20MB, Perdita di qualità, Caricamenti cloud richiesti, Elaborazione file singolo, Code del server, Preoccupazioni sulla privacy',
      ja: '20MBファイル制限、品質損失、クラウドアップロード必要、単一ファイル処理、サーバーキュー、プライバシー懸念',
      ko: '20MB 파일 제한, 품질 손실, 클라우드 업로드 필요, 단일 파일 처리, 서버 대기열, 개인정보 보호 우려',
      pt: 'Limites de arquivo de 20MB, Perda de qualidade, Uploads na nuvem necessários, Processamento de arquivo único, Filas de servidor, Preocupações de privacidade',
      'zh-TW': '20MB 檔案限制、品質損失、需要雲端上傳、單一檔案處理、伺服器佇列、隱私擔憂'
    }
  }
};

// 翻译函数 - 处理常见模式
function translateCompareText(text, type, lang) {
  // 检查直接匹配
  if (compareTranslations[type] && compareTranslations[type][text] && compareTranslations[type][text][lang]) {
    return compareTranslations[type][text][lang];
  }
  
  // 处理常见模式
  const items = text.split(', ').map(item => item.trim());
  const translatedItems = items.map(item => {
    // 翻译常见短语
    if (item.includes('Unlimited')) {
      const format = item.match(/Unlimited\s+(\w+)\s+compression/i)?.[1] || '';
      const translations = {
        de: `Unbegrenzte ${format}${format ? '-' : ''}Komprimierung`,
        es: `Compresión ${format} ilimitada`,
        fr: `Compression ${format} illimitée`,
        it: `Compressione ${format} illimitata`,
        ja: `無制限${format}圧縮`,
        ko: `무제한 ${format} 압축`,
        pt: `Compressão ${format} ilimitada`,
        'zh-TW': `無限制 ${format} 壓縮`
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
    
    if (item.includes('Batch processing')) {
      const translations = {
        de: 'Stapelverarbeitung',
        es: 'Procesamiento por lotes',
        fr: 'Traitement par lots',
        it: 'Elaborazione batch',
        ja: '一括処理',
        ko: '일괄 처리',
        pt: 'Processamento em lote',
        'zh-TW': '批次處理'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Local-first architecture')) {
      const translations = {
        de: 'Lokal-zuerst-Architektur',
        es: 'Arquitectura local primero',
        fr: 'Architecture locale d\'abord',
        it: 'Architettura locale prima',
        ja: 'ローカルファーストアーキテクチャ',
        ko: '로컬 우선 아키텍처',
        pt: 'Arquitetura local primeiro',
        'zh-TW': '本地優先架構'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('No file size limits')) {
      const translations = {
        de: 'Keine Dateigrößenbeschränkungen',
        es: 'Sin límites de tamaño de archivo',
        fr: 'Aucune limite de taille de fichier',
        it: 'Nessun limite di dimensione del file',
        ja: 'ファイルサイズ制限なし',
        ko: '파일 크기 제한 없음',
        pt: 'Sem limites de tamanho de arquivo',
        'zh-TW': '無檔案大小限制'
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
    
    if (item.includes('Transparency preserved')) {
      const translations = {
        de: 'Transparenz erhalten',
        es: 'Transparencia preservada',
        fr: 'Transparence préservée',
        it: 'Trasparenza preservata',
        ja: '透明度保持',
        ko: '투명도 보존',
        pt: 'Transparência preservada',
        'zh-TW': '透明度保留'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Quality preserved')) {
      const translations = {
        de: 'Qualität erhalten',
        es: 'Calidad preservada',
        fr: 'Qualité préservée',
        it: 'Qualità preservata',
        ja: '品質保持',
        ko: '품질 보존',
        pt: 'Qualidade preservada',
        'zh-TW': '品質保留'
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
    
    if (item.includes('EXIF data stripped')) {
      const translations = {
        de: 'EXIF-Daten entfernt',
        es: 'Datos EXIF eliminados',
        fr: 'Données EXIF supprimées',
        it: 'Dati EXIF rimossi',
        ja: 'EXIFデータ削除',
        ko: 'EXIF 데이터 제거',
        pt: 'Dados EXIF removidos',
        'zh-TW': 'EXIF 數據被移除'
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
    
    if (item.includes('Transparency lost')) {
      const translations = {
        de: 'Transparenz verloren',
        es: 'Transparencia perdida',
        fr: 'Transparence perdue',
        it: 'Trasparenza persa',
        ja: '透明度の喪失',
        ko: '투명도 손실',
        pt: 'Transparência perdida',
        'zh-TW': '失去透明度'
      };
      return translations[lang] || item;
    }
    
    if (item.includes('Quality loss')) {
      const translations = {
        de: 'Qualitätsverlust',
        es: 'Pérdida de calidad',
        fr: 'Perte de qualité',
        it: 'Perdita di qualità',
        ja: '品質損失',
        ko: '품질 손실',
        pt: 'Perda de qualidade',
        'zh-TW': '品質損失'
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
  
  // 修复所有工具的compare字段
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.compare) return;
    
    const enCompare = enTool.compare;
    const langCompare = langTool.compare || {};
    
    if (!langTool.compare) {
      langTool.compare = {};
    }
    
    // 修复toolaze
    if (enCompare.toolaze) {
      const currentToolaze = langCompare.toolaze || '';
      const hasEnglish = /[A-Z][a-z]+/.test(currentToolaze) && 
                         (currentToolaze.includes('Unlimited') || currentToolaze.includes('Precise') ||
                          currentToolaze.includes('Batch') || currentToolaze.includes('Local-first') ||
                          currentToolaze === enCompare.toolaze);
      
      if (hasEnglish || !currentToolaze || currentToolaze === enCompare.toolaze) {
        const translatedToolaze = translateCompareText(enCompare.toolaze, 'toolaze', lang);
        if (translatedToolaze !== enCompare.toolaze) {
          langCompare.toolaze = translatedToolaze;
          langFixed++;
        }
      }
    }
    
    // 修复others
    if (enCompare.others) {
      const currentOthers = langCompare.others || '';
      const hasEnglish = /[A-Z][a-z]+/.test(currentOthers) && 
                         (currentOthers.includes('20MB') || currentOthers.includes('Cloud') ||
                          currentOthers.includes('Single') || currentOthers.includes('Server') ||
                          currentOthers === enCompare.others);
      
      if (hasEnglish || !currentOthers || currentOthers === enCompare.others) {
        const translatedOthers = translateCompareText(enCompare.others, 'others', lang);
        if (translatedOthers !== enCompare.others) {
          langCompare.others = translatedOthers;
          langFixed++;
        }
      }
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} compare items`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} compare translations`);
