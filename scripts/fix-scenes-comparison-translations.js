const fs = require('fs');
const path = require('path');

// 通用场景标题翻译
const sceneTitleTranslations = {
  'Government Exams': {
    de: 'Regierungsprüfungen',
    es: 'Exámenes Gubernamentales',
    fr: 'Examens Gouvernementaux',
    it: 'Esami Governativi',
    ja: '政府試験',
    ko: '정부 시험',
    pt: 'Exames Governamentais',
    'zh-TW': '政府考試'
  },
  'Bank Account Opening': {
    de: 'Bankkontoeröffnung',
    es: 'Apertura de Cuenta Bancaria',
    fr: 'Ouverture de Compte Bancaire',
    it: 'Apertura Conto Bancario',
    ja: '銀行口座開設',
    ko: '은행 계좌 개설',
    pt: 'Abertura de Conta Bancária',
    'zh-TW': '銀行開戶'
  },
  'University Admissions': {
    de: 'Universitätszulassungen',
    es: 'Admisiones Universitarias',
    fr: 'Admissions Universitaires',
    it: 'Ammissioni Universitarie',
    ja: '大学入学',
    ko: '대학 입학',
    pt: 'Admissões Universitárias',
    'zh-TW': '大學入學'
  },
  'Job Applications': {
    de: 'Stellenbewerbungen',
    es: 'Solicitudes de Empleo',
    fr: 'Candidatures d\'Emploi',
    it: 'Candidature di Lavoro',
    ja: '就職応募',
    ko: '취업 지원',
    pt: 'Candidaturas de Emprego',
    'zh-TW': '求職申請'
  },
  'Resume Portals': {
    de: 'Lebenslauf-Portale',
    es: 'Portales de Currículum',
    fr: 'Portails de CV',
    it: 'Portali di Curriculum',
    ja: '履歴書ポータル',
    ko: '이력서 포털',
    pt: 'Portais de Currículo',
    'zh-TW': '履歷網站'
  },
  'Online Forms': {
    de: 'Online-Formulare',
    es: 'Formularios en Línea',
    fr: 'Formulaires en Ligne',
    it: 'Moduli Online',
    ja: 'オンラインフォーム',
    ko: '온라인 양식',
    pt: 'Formulários Online',
    'zh-TW': '線上表單'
  }
};

// Comparison通用翻译模式
function translateComparison(text, lang) {
  // 处理常见的comparison模式
  if (text.includes('Precise') && text.includes('browser-side')) {
    const translations = {
      de: 'Präzise Ausgabe, 100% Browser-seitige Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Bildern, Für immer kostenlos, Vollständige Privatsphäre',
      es: 'Salida precisa, Procesamiento 100% del lado del cliente, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes de hasta 100 imágenes, Gratis para siempre, Privacidad completa',
      fr: 'Sortie précise, Traitement 100% côté navigateur, Aucune filigrane ou perte de qualité, Traitement par lots jusqu\'à 100 images, Gratuit pour toujours, Confidentialité complète',
      it: 'Output preciso, Elaborazione 100% lato browser, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 immagini, Gratis per sempre, Privacy completa',
      ja: '正確な出力、100%ブラウザ側処理、透かしや品質損失なし、最大100画像の一括処理、永久無料、完全なプライバシー',
      ko: '정확한 출력, 100% 브라우저 측 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이미지 일괄 처리, 영구 무료, 완전한 개인정보 보호',
      pt: 'Saída precisa, Processamento 100% do lado do navegador, Sem marcas d\'água ou perda de qualidade, Processamento em lote de até 100 imagens, Gratuito para sempre, Privacidade completa',
      'zh-TW': '精確輸出、100% 瀏覽器端處理、無浮水印或品質損失、批次處理最多 100 張圖片、永久免費、完全隱私'
    };
    return translations[lang] || text;
  }
  
  if (text.includes('Random file sizes') && text.includes('Server uploads')) {
    const translations = {
      de: 'Zufällige Dateigrößen können überschritten werden, Server-Uploads erforderlich, Wasserzeichen oder Qualitätsverschlechterung, Begrenzte Stapelverarbeitung, Abonnementgebühren oder Werbung, Datenschutzbedenken',
      es: 'Los tamaños de archivo aleatorios pueden exceder, Se requieren cargas al servidor, Marcas de agua o degradación de calidad, Procesamiento por lotes limitado, Tarifas de suscripción o anuncios, Preocupaciones de privacidad',
      fr: 'Les tailles de fichier aléatoires peuvent dépasser, Téléchargements serveur requis, Filigranes ou dégradation de qualité, Traitement par lots limité, Frais d\'abonnement ou publicités, Préoccupations de confidentialité',
      it: 'Le dimensioni dei file casuali possono superare, Caricamenti sul server richiesti, Filigrane o degrado della qualità, Elaborazione batch limitata, Tariffe di abbonamento o annunci, Preoccupazioni sulla privacy',
      ja: 'ランダムなファイルサイズが超過する可能性、サーバーアップロードが必要、透かしや品質劣化、制限された一括処理、サブスクリプション料金や広告、プライバシーの懸念',
      ko: '임의 파일 크기가 초과할 수 있음, 서버 업로드 필요, 워터마크 또는 품질 저하, 제한된 일괄 처리, 구독료 또는 광고, 개인정보 보호 우려',
      pt: 'Tamanhos de arquivo aleatórios podem exceder, Uploads de servidor necessários, Marcas d\'água ou degradação de qualidade, Processamento em lote limitado, Taxas de assinatura ou anúncios, Preocupações de privacidade',
      'zh-TW': '隨機檔案大小可能超過、需要伺服器上傳、浮水印或品質下降、有限的批次處理、訂閱費用或廣告、隱私擔憂'
    };
    return translations[lang] || text;
  }
  
  return text;
}

function translateSceneTitle(title, lang) {
  if (sceneTitleTranslations[title] && sceneTitleTranslations[title][lang]) {
    return sceneTitleTranslations[title][lang];
  }
  return title;
}

function translateSceneDesc(desc, lang) {
  // 场景描述通常比较具体，这里先返回原值，需要根据具体内容翻译
  // 可以添加更多通用模式
  return desc;
}

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const enFile = path.join(__dirname, '../src/data/en/image-compression.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

let totalFixed = {
  scenes: 0,
  comparison: 0
};

languages.forEach(lang => {
  const filePath = path.join(__dirname, '../src/data', lang, 'image-compression.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let langFixed = { scenes: 0, comparison: 0 };
  
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool) return;
    
    // 修复scenes[]
    if (enTool.scenes && Array.isArray(enTool.scenes)) {
      const langScenes = langTool.scenes || [];
      if (enTool.scenes.length !== langScenes.length) {
        langTool.scenes = enTool.scenes.map(scene => ({
          icon: scene.icon,
          title: translateSceneTitle(scene.title, lang),
          desc: translateSceneDesc(scene.desc, lang)
        }));
        langFixed.scenes += enTool.scenes.length * 2;
      } else {
        enTool.scenes.forEach((enScene, idx) => {
          const langScene = langScenes[idx];
          if (!langScene) return;
          
          const translatedTitle = translateSceneTitle(enScene.title, lang);
          if (translatedTitle !== enScene.title && (!langScene.title || langScene.title === enScene.title)) {
            langScene.title = translatedTitle;
            langFixed.scenes++;
          }
        });
      }
    }
    
    // 修复comparison
    if (enTool.comparison) {
      const langComparison = langTool.comparison || {};
      
      if (enTool.comparison.toolaze) {
        const translatedToolaze = translateComparison(enTool.comparison.toolaze, lang);
        if (translatedToolaze !== enTool.comparison.toolaze && (!langComparison.toolaze || langComparison.toolaze === enTool.comparison.toolaze)) {
          langComparison.toolaze = translatedToolaze;
          langFixed.comparison++;
        }
      }
      
      if (enTool.comparison.others) {
        const translatedOthers = translateComparison(enTool.comparison.others, lang);
        if (translatedOthers !== enTool.comparison.others && (!langComparison.others || langComparison.others === enTool.comparison.others)) {
          langComparison.others = translatedOthers;
          langFixed.comparison++;
        }
      }
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed.scenes} scenes, ${langFixed.comparison} comparison`);
  totalFixed.scenes += langFixed.scenes;
  totalFixed.comparison += langFixed.comparison;
});

console.log(`\n✨ Total fixed: ${totalFixed.scenes} scenes, ${totalFixed.comparison} comparison translations`);
console.log(`⚠️  Note: Scene descriptions and some comparison texts may still need manual translation`);
