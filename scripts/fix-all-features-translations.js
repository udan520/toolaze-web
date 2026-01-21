const fs = require('fs');
const path = require('path');

// 通用特性翻译模板
const featureTranslations = {
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
  'Fast Compression': {
    de: 'Schnelle Komprimierung',
    es: 'Compresión Rápida',
    fr: 'Compression Rapide',
    it: 'Compressione Veloce',
    ja: '高速圧縮',
    ko: '빠른 압축',
    pt: 'Compressão Rápida',
    'zh-TW': '快速壓縮'
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
  'No Installation': {
    de: 'Keine Installation',
    es: 'Sin Instalación',
    fr: 'Aucune Installation',
    it: 'Nessuna Installazione',
    ja: 'インストール不要',
    ko: '설치 불필요',
    pt: 'Sem Instalação',
    'zh-TW': '無需安裝'
  }
};

// 通用特性描述翻译模板
const featureDescTranslations = {
  'Set exact target sizes in KB or MB. Compress JPG images to meet specific requirements while maintaining visual quality.': {
    de: 'Legen Sie genaue Zielgrößen in KB oder MB fest. Komprimieren Sie JPG-Bilder, um spezifische Anforderungen zu erfüllen und dabei die visuelle Qualität zu erhalten.',
    es: 'Establece tamaños objetivo exactos en KB o MB. Comprime imágenes JPG para cumplir requisitos específicos manteniendo la calidad visual.',
    fr: 'Définissez des tailles cibles exactes en Ko ou Mo. Compressez les images JPG pour répondre à des exigences spécifiques tout en maintenant la qualité visuelle.',
    it: 'Imposta dimensioni obiettivo esatte in KB o MB. Comprimi immagini JPG per soddisfare requisiti specifici mantenendo la qualità visiva.',
    ja: 'KBまたはMBで正確なターゲットサイズを設定します。視覚品質を維持しながら、特定の要件を満たすためにJPG画像を圧縮します。',
    ko: 'KB 또는 MB로 정확한 목표 크기를 설정합니다. 시각적 품질을 유지하면서 특정 요구사항을 충족하도록 JPG 이미지를 압축합니다.',
    pt: 'Defina tamanhos alvo exatos em KB ou MB. Comprima imagens JPG para atender requisitos específicos mantendo a qualidade visual.',
    'zh-TW': '設定精確的目標大小（KB 或 MB）。在保持視覺品質的同時壓縮 JPG 圖片以滿足特定要求。'
  },
  'All compression happens locally in your browser. Your JPG files never leave your device, ensuring complete privacy and security.': {
    de: 'Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre JPG-Dateien verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre und Sicherheit.',
    es: 'Toda la compresión ocurre localmente en tu navegador. Tus archivos JPG nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas.',
    fr: 'Toute la compression se fait localement dans votre navigateur. Vos fichiers JPG ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes.',
    it: 'Tutta la compressione avviene localmente nel tuo browser. I tuoi file JPG non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete.',
    ja: 'すべての圧縮はブラウザでローカルに実行されます。JPGファイルがデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。',
    ko: '모든 압축은 브라우저에서 로컬로 수행됩니다. JPG 파일이 기기를 떠나지 않아 완전한 개인정보 보호와 보안을 보장합니다.',
    pt: 'Toda a compressão acontece localmente no seu navegador. Seus arquivos JPG nunca deixam seu dispositivo, garantindo privacidade e segurança completas.',
    'zh-TW': '所有壓縮都在您的瀏覽器中本地進行。您的 JPG 檔案永遠不會離開您的設備，確保完全的隱私和安全。'
  },
  'Compress up to 100 JPG images simultaneously. Process entire photo collections in one operation.': {
    de: 'Komprimieren Sie bis zu 100 JPG-Bilder gleichzeitig. Verarbeiten Sie gesamte Fotosammlungen in einem Vorgang.',
    es: 'Comprime hasta 100 imágenes JPG simultáneamente. Procesa colecciones completas de fotos en una operación.',
    fr: 'Compressez jusqu\'à 100 images JPG simultanément. Traitez des collections complètes de photos en une seule opération.',
    it: 'Comprimi fino a 100 immagini JPG contemporaneamente. Elabora intere collezioni di foto in un\'operazione.',
    ja: '最大100枚のJPG画像を同時に圧縮します。1回の操作で写真コレクション全体を処理します。',
    ko: '최대 100개의 JPG 이미지를 동시에 압축합니다. 한 번의 작업으로 전체 사진 컬렉션을 처리합니다.',
    pt: 'Comprima até 100 imagens JPG simultaneamente. Processe coleções completas de fotos em uma operação.',
    'zh-TW': '同時壓縮最多 100 張 JPG 圖片。一次操作處理整個照片集合。'
  },
  'Browser-native Canvas API processing ensures instant compression without server uploads or waiting queues.': {
    de: 'Die browser-native Canvas API-Verarbeitung gewährleistet sofortige Komprimierung ohne Server-Uploads oder Warteschlangen.',
    es: 'El procesamiento de la API Canvas nativa del navegador garantiza compresión instantánea sin cargas al servidor o colas de espera.',
    fr: 'Le traitement de l\'API Canvas native du navigateur garantit une compression instantanée sans téléchargements serveur ni files d\'attente.',
    it: 'L\'elaborazione dell\'API Canvas nativa del browser garantisce compressione istantanea senza caricamenti sul server o code di attesa.',
    ja: 'ブラウザネイティブのCanvas API処理により、サーバーアップロードや待機キューなしで即座に圧縮されます。',
    ko: '브라우저 네이티브 Canvas API 처리는 서버 업로드나 대기 큐 없이 즉시 압축을 보장합니다.',
    pt: 'O processamento da API Canvas nativa do navegador garante compressão instantânea sem uploads de servidor ou filas de espera.',
    'zh-TW': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需服務器上傳或等待隊列。'
  },
  'Unlimited JPG compression completely free—no premium tiers, no subscription fees, no advertisements.': {
    de: 'Unbegrenzte JPG-Komprimierung völlig kostenlos—keine Premium-Stufen, keine Abonnementgebühren, keine Werbung.',
    es: 'Compresión JPG ilimitada completamente gratuita: sin niveles premium, sin tarifas de suscripción, sin anuncios.',
    fr: 'Compression JPG illimitée entièrement gratuite—aucun niveau premium, aucun frais d\'abonnement, aucune publicité.',
    it: 'Compressione JPG illimitata completamente gratuita—nessun livello premium, nessuna tariffa di abbonamento, nessuna pubblicità.',
    ja: '無制限のJPG圧縮が完全無料—プレミアム階層なし、サブスクリプション料金なし、広告なし。',
    ko: '무제한 JPG 압축 완전 무료—프리미엄 등급 없음, 구독료 없음, 광고 없음.',
    pt: 'Compressão JPG ilimitada completamente gratuita—sem níveis premium, sem taxas de assinatura, sem anúncios.',
    'zh-TW': '無限 JPG 壓縮完全免費—無高級層級、無訂閱費用、無廣告。'
  },
  'Supports JPG, PNG, WebP, and BMP formats. Compress any image type with one tool.': {
    de: 'Unterstützt JPG-, PNG-, WebP- und BMP-Formate. Komprimieren Sie jeden Bildtyp mit einem Tool.',
    es: 'Admite formatos JPG, PNG, WebP y BMP. Comprime cualquier tipo de imagen con una herramienta.',
    fr: 'Prend en charge les formats JPG, PNG, WebP et BMP. Compressez tout type d\'image avec un seul outil.',
    it: 'Supporta formati JPG, PNG, WebP e BMP. Comprimi qualsiasi tipo di immagine con un solo strumento.',
    ja: 'JPG、PNG、WebP、BMP形式をサポートします。1つのツールで任意の画像タイプを圧縮します。',
    ko: 'JPG, PNG, WebP 및 BMP 형식을 지원합니다. 하나의 도구로 모든 이미지 유형을 압축합니다.',
    pt: 'Suporta formatos JPG, PNG, WebP e BMP. Comprima qualquer tipo de imagem com uma ferramenta.',
    'zh-TW': '支援 JPG、PNG、WebP 和 BMP 格式。使用一個工具壓縮任何圖片類型。'
  },
  'Set exact target sizes in KB or MB. Compress images to meet specific requirements while maintaining quality.': {
    de: 'Legen Sie genaue Zielgrößen in KB oder MB fest. Komprimieren Sie Bilder, um spezifische Anforderungen zu erfüllen und dabei die Qualität zu erhalten.',
    es: 'Establece tamaños objetivo exactos en KB o MB. Comprime imágenes para cumplir requisitos específicos manteniendo la calidad.',
    fr: 'Définissez des tailles cibles exactes en Ko ou Mo. Compressez les images pour répondre à des exigences spécifiques tout en maintenant la qualité.',
    it: 'Imposta dimensioni obiettivo esatte in KB o MB. Comprimi immagini per soddisfare requisiti specifici mantenendo la qualità.',
    ja: 'KBまたはMBで正確なターゲットサイズを設定します。品質を維持しながら、特定の要件を満たすために画像を圧縮します。',
    ko: 'KB 또는 MB로 정확한 목표 크기를 설정합니다. 품질을 유지하면서 특정 요구사항을 충족하도록 이미지를 압축합니다.',
    pt: 'Defina tamanhos alvo exatos em KB ou MB. Comprima imagens para atender requisitos específicos mantendo a qualidade.',
    'zh-TW': '設定精確的目標大小（KB 或 MB）。在保持品質的同時壓縮圖片以滿足特定要求。'
  },
  'All compression happens locally in your browser. Your images never leave your device, ensuring complete privacy.': {
    de: 'Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre Bilder verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre.',
    es: 'Toda la compresión ocurre localmente en tu navegador. Tus imágenes nunca abandonan tu dispositivo, garantizando privacidad completa.',
    fr: 'Toute la compression se fait localement dans votre navigateur. Vos images ne quittent jamais votre appareil, garantissant une confidentialité complète.',
    it: 'Tutta la compressione avviene localmente nel tuo browser. Le tue immagini non lasciano mai il tuo dispositivo, garantendo privacy completa.',
    ja: 'すべての圧縮はブラウザでローカルに実行されます。画像がデバイスを離れることはなく、完全なプライバシーを保証します。',
    ko: '모든 압축은 브라우저에서 로컬로 수행됩니다. 이미지가 기기를 떠나지 않아 완전한 개인정보 보호를 보장합니다.',
    pt: 'Toda a compressão acontece localmente no seu navegador. Suas imagens nunca deixam seu dispositivo, garantindo privacidade completa.',
    'zh-TW': '所有壓縮都在您的瀏覽器中本地進行。您的圖片永遠不會離開您的設備，確保完全的隱私。'
  },
  'Compress up to 100 images simultaneously. Process entire photo collections in one operation.': {
    de: 'Komprimieren Sie bis zu 100 Bilder gleichzeitig. Verarbeiten Sie gesamte Fotosammlungen in einem Vorgang.',
    es: 'Comprime hasta 100 imágenes simultáneamente. Procesa colecciones completas de fotos en una operación.',
    fr: 'Compressez jusqu\'à 100 images simultanément. Traitez des collections complètes de photos en une seule opération.',
    it: 'Comprimi fino a 100 immagini contemporaneamente. Elabora intere collezioni di foto in un\'operazione.',
    ja: '最大100枚の画像を同時に圧縮します。1回の操作で写真コレクション全体を処理します。',
    ko: '최대 100개의 이미지를 동시에 압축합니다. 한 번의 작업으로 전체 사진 컬렉션을 처리합니다.',
    pt: 'Comprima até 100 imagens simultaneamente. Processe coleções completas de fotos em uma operação.',
    'zh-TW': '同時壓縮最多 100 張圖片。一次操作處理整個照片集合。'
  },
  'Browser-native Canvas API processing ensures instant compression without server uploads or delays.': {
    de: 'Die browser-native Canvas API-Verarbeitung gewährleistet sofortige Komprimierung ohne Server-Uploads oder Verzögerungen.',
    es: 'El procesamiento de la API Canvas nativa del navegador garantiza compresión instantánea sin cargas al servidor o retrasos.',
    fr: 'Le traitement de l\'API Canvas native du navigateur garantit une compression instantanée sans téléchargements serveur ni délais.',
    it: 'L\'elaborazione dell\'API Canvas nativa del browser garantisce compressione istantanea senza caricamenti sul server o ritardi.',
    ja: 'ブラウザネイティブのCanvas API処理により、サーバーアップロードや遅延なしで即座に圧縮されます。',
    ko: '브라우저 네이티브 Canvas API 처리는 서버 업로드나 지연 없이 즉시 압축을 보장합니다.',
    pt: 'O processamento da API Canvas nativa do navegador garante compressão instantânea sem uploads de servidor ou atrasos.',
    'zh-TW': '瀏覽器原生 Canvas API 處理確保即時壓縮，無需服務器上傳或延遲。'
  },
  'Unlimited image compression completely free—no premium tiers, no subscription fees, no advertisements.': {
    de: 'Unbegrenzte Bildkomprimierung völlig kostenlos—keine Premium-Stufen, keine Abonnementgebühren, keine Werbung.',
    es: 'Compresión de imágenes ilimitada completamente gratuita: sin niveles premium, sin tarifas de suscripción, sin anuncios.',
    fr: 'Compression d\'images illimitée entièrement gratuite—aucun niveau premium, aucun frais d\'abonnement, aucune publicité.',
    it: 'Compressione immagini illimitata completamente gratuita—nessun livello premium, nessuna tariffa di abbonamento, nessuna pubblicità.',
    ja: '無制限の画像圧縮が完全無料—プレミアム階層なし、サブスクリプション料金なし、広告なし。',
    ko: '무제한 이미지 압축 완전 무료—프리미엄 등급 없음, 구독료 없음, 광고 없음.',
    pt: 'Compressão de imagens ilimitada completamente gratuita—sem níveis premium, sem taxas de assinatura, sem anúncios.',
    'zh-TW': '無限圖片壓縮完全免費—無高級層級、無訂閱費用、無廣告。'
  },
  'Works directly in your web browser. No software downloads or plugin installations required.': {
    de: 'Funktioniert direkt in Ihrem Webbrowser. Keine Software-Downloads oder Plugin-Installationen erforderlich.',
    es: 'Funciona directamente en tu navegador web. No se requieren descargas de software ni instalaciones de complementos.',
    fr: 'Fonctionne directement dans votre navigateur web. Aucun téléchargement de logiciel ni installation de plugin requis.',
    it: 'Funziona direttamente nel tuo browser web. Nessun download di software o installazione di plugin richiesta.',
    ja: 'Webブラウザで直接動作します。ソフトウェアのダウンロードやプラグインのインストールは不要です。',
    ko: '웹 브라우저에서 직접 작동합니다. 소프트웨어 다운로드나 플러그인 설치가 필요하지 않습니다.',
    pt: 'Funciona diretamente no seu navegador web. Não são necessários downloads de software ou instalações de plugins.',
    'zh-TW': '直接在您的網頁瀏覽器中運行。無需下載軟體或安裝插件。'
  }
};

function translateFeatureTitle(title, lang) {
  if (featureTranslations[title] && featureTranslations[title][lang]) {
    return featureTranslations[title][lang];
  }
  return title;
}

function translateFeatureDesc(desc, lang) {
  if (featureDescTranslations[desc] && featureDescTranslations[desc][lang]) {
    return featureDescTranslations[desc][lang];
  }
  return desc;
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
  
  // 修复所有工具的features
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.features || !langTool.features || !enTool.features.items) return;
    
    const enItems = enTool.features.items || [];
    const langItems = langTool.features.items || [];
    
    if (enItems.length !== langItems.length) {
      langTool.features.items = enItems.map(item => ({
        icon: item.icon,
        iconType: item.iconType,
        title: translateFeatureTitle(item.title, lang),
        desc: translateFeatureDesc(item.desc, lang)
      }));
      langFixed += enItems.length * 2;
    } else {
      enItems.forEach((enItem, idx) => {
        const langItem = langItems[idx];
        if (!langItem) return;
        
        const translatedTitle = translateFeatureTitle(enItem.title, lang);
        if (translatedTitle !== enItem.title && (!langItem.title || langItem.title === enItem.title)) {
          langItem.title = translatedTitle;
          langFixed++;
        }
        
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
