const fs = require('fs');
const path = require('path');

// 通用特性翻译模板
const featureTranslations = {
  'Precise 20KB Target': {
    de: 'Präzises 20KB-Ziel',
    es: 'Objetivo Preciso de 20KB',
    fr: 'Cible Précise de 20KB',
    it: 'Obiettivo Preciso di 20KB',
    ja: '正確な20KBターゲット',
    ko: '정확한 20KB 목표',
    pt: 'Meta Precisa de 20KB',
    'zh-TW': '精確 20KB 目標'
  },
  'Precise 50KB Target': {
    de: 'Präzises 50KB-Ziel',
    es: 'Objetivo Preciso de 50KB',
    fr: 'Cible Précise de 50KB',
    it: 'Obiettivo Preciso di 50KB',
    ja: '正確な50KBターゲット',
    ko: '정확한 50KB 목표',
    pt: 'Meta Precisa de 50KB',
    'zh-TW': '精確 50KB 目標'
  },
  'Precise 100KB Target': {
    de: 'Präzises 100KB-Ziel',
    es: 'Objetivo Preciso de 100KB',
    fr: 'Cible Précise de 100KB',
    it: 'Obiettivo Preciso di 100KB',
    ja: '正確な100KBターゲット',
    ko: '정확한 100KB 목표',
    pt: 'Meta Precisa de 100KB',
    'zh-TW': '精確 100KB 目標'
  },
  'Precise 200KB Target': {
    de: 'Präzises 200KB-Ziel',
    es: 'Objetivo Preciso de 200KB',
    fr: 'Cible Précise de 200KB',
    it: 'Obiettivo Preciso di 200KB',
    ja: '正確な200KBターゲット',
    ko: '정확한 200KB 목표',
    pt: 'Meta Precisa de 200KB',
    'zh-TW': '精確 200KB 目標'
  },
  'Precise 240KB Target': {
    de: 'Präzises 240KB-Ziel',
    es: 'Objetivo Preciso de 240KB',
    fr: 'Cible Précise de 240KB',
    it: 'Obiettivo Preciso di 240KB',
    ja: '正確な240KBターゲット',
    ko: '정확한 240KB 목표',
    pt: 'Meta Precisa de 240KB',
    'zh-TW': '精確 240KB 目標'
  },
  '100% Private Processing': {
    de: '100% Private Verarbeitung',
    es: 'Procesamiento 100% Privado',
    fr: 'Traitement 100% Privé',
    it: 'Elaborazione 100% Privata',
    ja: '100%プライベート処理',
    ko: '100% 비공개 처리',
    pt: 'Processamento 100% Privado',
    'zh-TW': '100% 私密處理'
  },
  'Batch Processing': {
    de: 'Stapelverarbeitung',
    es: 'Procesamiento por Lotes',
    fr: 'Traitement par Lots',
    it: 'Elaborazione in Batch',
    ja: '一括処理',
    ko: '일괄 처리',
    pt: 'Processamento em Lote',
    'zh-TW': '批次處理'
  },
  'Instant Compression': {
    de: 'Sofortige Komprimierung',
    es: 'Compresión Instantánea',
    fr: 'Compression Instantanée',
    it: 'Compressione Istantanea',
    ja: '即座の圧縮',
    ko: '즉시 압축',
    pt: 'Compressão Instantânea',
    'zh-TW': '即時壓縮'
  },
  'Free Forever': {
    de: 'Für Immer Kostenlos',
    es: 'Gratis Para Siempre',
    fr: 'Gratuit Pour Toujours',
    it: 'Gratis Per Sempre',
    ja: '永久無料',
    ko: '영구 무료',
    pt: 'Gratuito Para Sempre',
    'zh-TW': '永久免費'
  },
  'Quality Preserved': {
    de: 'Qualität Erhalten',
    es: 'Calidad Preservada',
    fr: 'Qualité Préservée',
    it: 'Qualità Preservata',
    ja: '品質維持',
    ko: '품질 유지',
    pt: 'Qualidade Preservada',
    'zh-TW': '保持品質'
  },
  'Format Preserved': {
    de: 'Format Erhalten',
    es: 'Formato Preservado',
    fr: 'Format Préservé',
    it: 'Formato Preservato',
    ja: '形式維持',
    ko: '형식 보존',
    pt: 'Formato Preservado',
    'zh-TW': '保留格式'
  },
  'Multiple Format Support': {
    de: 'Mehrfachformat-Unterstützung',
    es: 'Soporte de Múltiples Formatos',
    fr: 'Support Multi-Formats',
    it: 'Supporto Multi-Formato',
    ja: '複数形式サポート',
    ko: '다중 형식 지원',
    pt: 'Suporte a Múltiplos Formatos',
    'zh-TW': '多格式支援'
  },
  'Precise Size Control': {
    de: 'Präzise Größensteuerung',
    es: 'Control Preciso de Tamaño',
    fr: 'Contrôle Précis de la Taille',
    it: 'Controllo Preciso delle Dimensioni',
    ja: '正確なサイズ制御',
    ko: '정확한 크기 제어',
    pt: 'Controle Preciso de Tamanho',
    'zh-TW': '精確大小控制'
  },
  'Fast Compression': {
    de: 'Schnelle Komprimierung',
    es: 'Compresión Rápida',
    fr: 'Compression Rapide',
    it: 'Compressione Veloce',
    ja: '高速圧縮',
    ko: '빠른 압축',
    pt: 'Compressão Rápida',
    'zh-TW': '快速壓縮'
  }
};

// 通用特性描述翻译模板
const featureDescTranslations = {
  'Compress images to exactly 50KB. Meet universal online form requirements with precision while maintaining visual quality for official verification.': {
    de: 'Komprimieren Sie Bilder auf genau 50KB. Erfüllen Sie universelle Online-Formularanforderungen mit Präzision und erhalten Sie dabei die visuelle Qualität für die offizielle Überprüfung.',
    es: 'Comprime imágenes exactamente a 50KB. Cumple con los requisitos universales de formularios en línea con precisión mientras mantienes la calidad visual para la verificación oficial.',
    fr: 'Compressez les images à exactement 50KB. Répondez aux exigences universelles des formulaires en ligne avec précision tout en maintenant la qualité visuelle pour la vérification officielle.',
    it: 'Comprimi le immagini esattamente a 50KB. Soddisfa i requisiti universali dei moduli online con precisione mantenendo la qualità visiva per la verifica ufficiale.',
    ja: '画像を正確に50KBに圧縮します。公式検証に必要な視覚品質を維持しながら、オンラインフォームの普遍的な要件を正確に満たします。',
    ko: '이미지를 정확히 50KB로 압축합니다. 공식 검증에 필요한 시각적 품질을 유지하면서 범용 온라인 양식 요구사항을 정확하게 충족합니다.',
    pt: 'Comprima imagens exatamente para 50KB. Atenda aos requisitos universais de formulários online com precisão mantendo a qualidade visual para verificação oficial.',
    'zh-TW': '將圖片精確壓縮到 50KB。在保持官方驗證所需視覺品質的同時，精確滿足通用線上表單要求。'
  },
  'All compression happens locally in your browser. Your personal documents and photos never leave your device, ensuring complete privacy and security.': {
    de: 'Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre persönlichen Dokumente und Fotos verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre und Sicherheit.',
    es: 'Toda la compresión ocurre localmente en tu navegador. Tus documentos personales y fotos nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas.',
    fr: 'Toute la compression se fait localement dans votre navigateur. Vos documents personnels et photos ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes.',
    it: 'Tutta la compressione avviene localmente nel tuo browser. I tuoi documenti personali e le foto non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete.',
    ja: 'すべての圧縮はブラウザでローカルに実行されます。個人文書や写真がデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。',
    ko: '모든 압축은 브라우저에서 로컬로 수행됩니다. 개인 문서와 사진이 기기를 떠나지 않아 완전한 개인정보 보호와 보안을 보장합니다.',
    pt: 'Toda a compressão acontece localmente no seu navegador. Seus documentos pessoais e fotos nunca deixam seu dispositivo, garantindo privacidade e segurança completas.',
    'zh-TW': '所有壓縮都在您的瀏覽器中本地進行。您的個人文件和照片永遠不會離開您的設備，確保完全的隱私和安全。'
  },
  'Process up to 100 images simultaneously. Perfect for bulk document processing and multiple application submissions.': {
    de: 'Verarbeiten Sie bis zu 100 Bilder gleichzeitig. Perfekt für die Massenverarbeitung von Dokumenten und mehrere Antragseinreichungen.',
    es: 'Procesa hasta 100 imágenes simultáneamente. Perfecto para el procesamiento masivo de documentos y múltiples envíos de solicitudes.',
    fr: 'Traitez jusqu\'à 100 images simultanément. Parfait pour le traitement en masse de documents et les soumissions multiples d\'applications.',
    it: 'Elabora fino a 100 immagini contemporaneamente. Perfetto per l\'elaborazione in massa di documenti e più invii di applicazioni.',
    ja: '最大100枚の画像を同時に処理します。大量の文書処理や複数の申請提出に最適です。',
    ko: '최대 100개의 이미지를 동시에 처리합니다. 대량 문서 처리 및 여러 신청 제출에 완벽합니다.',
    pt: 'Processe até 100 imagens simultaneamente. Perfeito para processamento em massa de documentos e múltiplos envios de aplicações.',
    'zh-TW': '同時處理最多 100 張圖片。非常適合批量文檔處理和多個申請提交。'
  },
  'Browser-native Canvas API processing ensures instant compression without server uploads or waiting queues. Get your documents ready immediately.': {
    de: 'Die browser-native Canvas API-Verarbeitung gewährleistet sofortige Komprimierung ohne Server-Uploads oder Warteschlangen. Bereiten Sie Ihre Dokumente sofort vor.',
    es: 'El procesamiento de la API Canvas nativa del navegador garantiza compresión instantánea sin cargas al servidor o colas de espera. Prepara tus documentos inmediatamente.',
    fr: 'Le traitement de l\'API Canvas native du navigateur garantit une compression instantanée sans téléchargements serveur ni files d\'attente. Préparez vos documents immédiatement.',
    it: 'L\'elaborazione dell\'API Canvas nativa del browser garantisce compressione istantanea senza caricamenti sul server o code di attesa. Prepara i tuoi documenti immediatamente.',
    ja: 'ブラウザネイティブのCanvas API処理により、サーバーアップロードや待機キューなしで即座に圧縮されます。文書をすぐに準備できます。',
    ko: '브라우저 네이티브 Canvas API 처리는 서버 업로드나 대기 큐 없이 즉시 압축을 보장합니다. 문서를 즉시 준비하세요.',
    pt: 'O processamento da API Canvas nativa do navegador garante compressão instantânea sem uploads de servidor ou filas de espera. Prepare seus documentos imediatamente.',
    'zh-TW': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需服務器上傳或等待隊列。立即準備好您的文檔。'
  },
  'Unlimited image compression completely free—no premium tiers, no subscription fees, no advertisements. Perfect for all users.': {
    de: 'Unbegrenzte Bildkomprimierung völlig kostenlos—keine Premium-Stufen, keine Abonnementgebühren, keine Werbung. Perfekt für alle Benutzer.',
    es: 'Compresión de imágenes ilimitada completamente gratuita: sin niveles premium, sin tarifas de suscripción, sin anuncios. Perfecto para todos los usuarios.',
    fr: 'Compression d\'images illimitée entièrement gratuite—aucun niveau premium, aucun frais d\'abonnement, aucune publicité. Parfait pour tous les utilisateurs.',
    it: 'Compressione immagini illimitata completamente gratuita—nessun livello premium, nessuna tariffa di abbonamento, nessuna pubblicità. Perfetto per tutti gli utenti.',
    ja: '無制限の画像圧縮が完全無料—プレミアム階層なし、サブスクリプション料金なし、広告なし。すべてのユーザーに最適です。',
    ko: '무제한 이미지 압축 완전 무료—프리미엄 등급 없음, 구독료 없음, 광고 없음. 모든 사용자에게 완벽합니다.',
    pt: 'Compressão de imagens ilimitada completamente gratuita—sem níveis premium, sem taxas de assinatura, sem anúncios. Perfeito para todos os usuários.',
    'zh-TW': '無限圖片壓縮完全免費—無高級層級、無訂閱費用、無廣告。適合所有用戶。'
  },
  'Maintain original image format (JPG, PNG, WebP, BMP). Keep compatibility with any online form or application system.': {
    de: 'Behalten Sie das ursprüngliche Bildformat bei (JPG, PNG, WebP, BMP). Behalten Sie die Kompatibilität mit jedem Online-Formular oder Anwendungssystem.',
    es: 'Mantén el formato de imagen original (JPG, PNG, WebP, BMP). Mantén la compatibilidad con cualquier formulario en línea o sistema de aplicación.',
    fr: 'Conservez le format d\'image original (JPG, PNG, WebP, BMP). Maintenez la compatibilité avec tout formulaire en ligne ou système d\'application.',
    it: 'Mantieni il formato immagine originale (JPG, PNG, WebP, BMP). Mantieni la compatibilità con qualsiasi modulo online o sistema di applicazione.',
    ja: '元の画像形式（JPG、PNG、WebP、BMP）を維持します。オンラインフォームやアプリケーションシステムとの互換性を保ちます。',
    ko: '원본 이미지 형식(JPG, PNG, WebP, BMP)을 유지합니다. 모든 온라인 양식 또는 애플리케이션 시스템과의 호환성을 유지합니다.',
    pt: 'Mantenha o formato de imagem original (JPG, PNG, WebP, BMP). Mantenha a compatibilidade com qualquer formulário online ou sistema de aplicação.',
    'zh-TW': '保留原始圖片格式（JPG、PNG、WebP、BMP）。保持與任何線上表單或應用系統的兼容性。'
  }
};

// 动态替换函数 - 根据工具类型替换特定值
function translateFeatureTitle(title, lang, toolSlug) {
  // 检查是否有直接匹配
  if (featureTranslations[title] && featureTranslations[title][lang]) {
    return featureTranslations[title][lang];
  }
  
  // 处理动态标题（如 "Precise XXKB Target"）
  const match = title.match(/^Precise (\d+KB) Target$/);
  if (match) {
    const size = match[1];
    const translations = {
      de: `Präzises ${size}-Ziel`,
      es: `Objetivo Preciso de ${size}`,
      fr: `Cible Précise de ${size}`,
      it: `Obiettivo Preciso di ${size}`,
      ja: `正確な${size}ターゲット`,
      ko: `정확한 ${size} 목표`,
      pt: `Meta Precisa de ${size}`,
      'zh-TW': `精確 ${size} 目標`
    };
    return translations[lang] || title;
  }
  
  return title;
}

function translateFeatureDesc(desc, lang) {
  // 检查是否有直接匹配
  if (featureDescTranslations[desc] && featureDescTranslations[desc][lang]) {
    return featureDescTranslations[desc][lang];
  }
  
  // 处理通用模式
  if (desc.includes('Compress images to exactly')) {
    const match = desc.match(/Compress images to exactly (\d+KB)/);
    if (match) {
      const size = match[1];
      const translations = {
        de: `Komprimieren Sie Bilder auf genau ${size}. Erfüllen Sie universelle Online-Formularanforderungen mit Präzision und erhalten Sie dabei die visuelle Qualität für die offizielle Überprüfung.`,
        es: `Comprime imágenes exactamente a ${size}. Cumple con los requisitos universales de formularios en línea con precisión mientras mantienes la calidad visual para la verificación oficial.`,
        fr: `Compressez les images à exactement ${size}. Répondez aux exigences universelles des formulaires en ligne avec précision tout en maintenant la qualité visuelle pour la vérification officielle.`,
        it: `Comprimi le immagini esattamente a ${size}. Soddisfa i requisiti universali dei moduli online con precisione mantenendo la qualità visiva per la verifica ufficiale.`,
        ja: `画像を正確に${size}に圧縮します。公式検証に必要な視覚品質を維持しながら、オンラインフォームの普遍的な要件を正確に満たします。`,
        ko: `이미지를 정확히 ${size}로 압축합니다. 공식 검증에 필요한 시각적 품질을 유지하면서 범용 온라인 양식 요구사항을 정확하게 충족합니다.`,
        pt: `Comprima imagens exatamente para ${size}. Atenda aos requisitos universais de formulários online com precisão mantendo a qualidade visual para verificação oficial.`,
        'zh-TW': `將圖片精確壓縮到 ${size}。在保持官方驗證所需視覺品質的同時，精確滿足通用線上表單要求。`
      };
      return translations[lang] || desc;
    }
  }
  
  return desc;
}

const toolsToFix = [
  'jpg-to-20kb',
  'png-to-100kb',
  'image-to-50kb',
  'uscis-photo-240kb',
  'passport-photo-200kb',
  'amazon-product-10mb',
  'etsy-listing-1mb',
  'ebay-picture-fast',
  'youtube-thumbnail-2mb',
  'discord-emoji-256kb',
  'email-signature-100kb'
];

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
  
  toolsToFix.forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.features || !langTool.features || !enTool.features.items) return;
    
    const enItems = enTool.features.items || [];
    const langItems = langTool.features.items || [];
    
    if (enItems.length !== langItems.length) {
      // 如果长度不匹配，直接复制结构
      langTool.features.items = enItems.map(item => ({
        icon: item.icon,
        iconType: item.iconType,
        title: translateFeatureTitle(item.title, lang, slug),
        desc: translateFeatureDesc(item.desc, lang)
      }));
      langFixed += enItems.length * 2;
    } else {
      // 如果长度匹配，检查并修复每个 item
      enItems.forEach((enItem, idx) => {
        const langItem = langItems[idx];
        if (!langItem) return;
        
        // 翻译 title
        const translatedTitle = translateFeatureTitle(enItem.title, lang, slug);
        if (translatedTitle !== enItem.title && (!langItem.title || langItem.title === enItem.title)) {
          langItem.title = translatedTitle;
          langFixed++;
        }
        
        // 翻译 desc
        const translatedDesc = translateFeatureDesc(enItem.desc, lang);
        if (translatedDesc !== enItem.desc && (!langItem.desc || langItem.desc === enItem.desc)) {
          langItem.desc = translatedDesc;
          langFixed++;
        }
      });
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} feature items`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} feature translations`);
