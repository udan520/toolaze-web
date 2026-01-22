const fs = require('fs')
const path = require('path')

// 读取英文版本作为参考
const enPath = path.join(__dirname, '../src/data/en/image-compression.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'))
const enWebP = enData['compress-webp']

// 各语言的完整翻译映射
const translations = {
  'de': {
    hero: {
      h1: 'WebP-Kompressor',
      desc: 'Komprimieren Sie WebP-Bilder online kostenlos. Ziehen Sie Ihre WebP-Bilder einfach unten ab, um sie in Sekunden zu komprimieren.'
    },
    intro: {
      title: 'Warum WebP-Bilder komprimieren?',
      content: [
        {
          title: 'Vorteile der WebP-Komprimierung',
          text: 'WebP ist Googles modernes Bildformat, das eine überlegene Komprimierung im Vergleich zu JPG und PNG bietet—typischerweise 25-35% bessere Komprimierung als PNG und ähnliche Qualität wie JPG. Jedoch können auch WebP-Dateien für bessere Leistung weiter optimiert werden. Die Komprimierung von WebP-Bildern reduziert die Dateigröße um 20-40%, während die visuelle Qualität und Transparenzunterstützung erhalten bleiben, was sie perfekt für moderne Webanwendungen, mobile Apps und digitale Plattformen macht, bei denen Leistungsoptimierung entscheidend ist.'
        },
        {
          title: 'Wann WebP komprimieren',
          text: 'Komprimieren Sie WebP-Bilder, wenn Sie bereits komprimierte WebP-Dateien für noch kleinere Größen weiter optimieren müssen, spezifische Dateigrößenanforderungen für Webanwendungen oder mobile Apps erfüllen müssen, Bandbreitenkosten für Webhosting oder Cloud-Speicher reduzieren möchten oder Bilder für schnelleres Laden auf mobilen Geräten optimieren möchten. Unser Tool verwendet Canvas API, um WebP-Dateien lokal in Ihrem Browser zu komprimieren und gewährleistet vollständige Privatsphäre bei gleichzeitiger Beibehaltung der überlegenen Komprimierungseigenschaften des Formats.'
        }
      ]
    },
    features: {
      items: [
        null, // 第一个已有翻译
        null, // 第二个已有翻译
        {
          title: '100% private Verarbeitung',
          desc: 'Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre WebP-Dateien verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre.'
        },
        {
          title: 'Stapelverarbeitung',
          desc: 'Komprimieren Sie bis zu 100 WebP-Bilder gleichzeitig. Verarbeiten Sie gesamte Bildersammlungen in einem Vorgang.'
        },
        {
          title: 'Schnelle Komprimierung',
          desc: 'Die browser-native Canvas API-Verarbeitung gewährleistet sofortige Komprimierung ohne Server-Uploads oder Verzögerungen.'
        },
        null // 第六个已有翻译
      ]
    },
    specs: {
      engine: 'Canvas API - Browser-Native Verarbeitung',
      privacy: '100% Client-Side (Lokale Browser-Verarbeitung)'
    },
    performanceMetrics: {
      title: 'Technische Spezifikationen',
      metrics: [
        { label: 'Eingabeformat', value: 'WebP (Googles modernes Bildformat)' },
        { label: 'Ausgabeformat', value: 'WebP (Originalformat erhalten)' },
        null, null, null, null,
        { label: 'Verarbeitungsort', value: '100% Client-Side (Browser Canvas API)' }
      ]
    },
    howToUse: {
      title: 'So komprimieren Sie WebP-Bilder',
      steps: [
        {
          title: 'Laden Sie Ihre WebP-Dateien hoch',
          desc: 'Ziehen Sie Ihre WebP-Bilder in den Komprimierungsbereich oder klicken Sie, um WebP-Dateien von Ihrem Gerät auszuwählen.'
        },
        null,
        {
          title: 'Komprimierte Dateien herunterladen',
          desc: 'Laden Sie Ihre komprimierten WebP-Dateien sofort herunter. Jede Datei behält die visuelle Qualität bei und ist deutlich kleiner als das Original.'
        }
      ]
    },
    faq: [
      {
        q: 'Wie viel kann ich eine WebP-Datei komprimieren?',
        a: 'Typischerweise können WebP-Dateien um weitere 20-40% komprimiert werden, während die visuelle Qualität erhalten bleibt. Die genaue Reduzierung hängt von der ursprünglichen Dateigröße und den Komprimierungseinstellungen ab.'
      },
      null,
      {
        q: 'Kann ich mehrere WebP-Dateien gleichzeitig komprimieren?',
        a: 'Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Dateien gleichzeitig. Sie können gesamte Sammlungen in einem Vorgang verarbeiten.'
      },
      {
        q: 'Ist WebP-Komprimierung kostenlos und sicher?',
        a: 'Ja! Die gesamte Komprimierung erfolgt lokal in Ihrem Browser mit JavaScript und Canvas-API. Ihre Bilder verlassen Ihr Gerät niemals und gewährleisten vollständige Privatsphäre und Sicherheit.'
      },
      {
        q: 'Wird die Transparenz erhalten bleiben?',
        a: 'Ja, wenn Ihre WebP-Datei Transparenz (Alpha-Kanal) hat, wird diese bei der Komprimierung erhalten bleiben. Das Tool behält die Transparenz bei, während es die Dateigröße optimiert.'
      },
      null
    ]
  },
  'it': {
    hero: {
      h1: 'Compressore WebP',
      desc: 'Comprimi immagini WebP online gratuitamente. Trascina semplicemente le tue immagini WebP qui sotto per comprimerle in pochi secondi.'
    },
    intro: {
      content: [
        null,
        {
          title: 'Quando Comprimere WebP',
          text: 'Comprimi le immagini WebP quando devi ottimizzare ulteriormente i file WebP già compressi per dimensioni ancora più piccole, soddisfare requisiti specifici di dimensione del file per applicazioni web o app mobili, ridurre i costi di larghezza di banda per l\'hosting web o lo storage cloud, o ottimizzare le immagini per un caricamento più rapido sui dispositivi mobili. Il nostro strumento utilizza Canvas API per comprimere i file WebP localmente nel tuo browser, garantendo la privacy completa mantenendo le caratteristiche di compressione superiori del formato.'
        }
      ]
    },
    features: {
      items: [
        { title: 'Compressione superiore', desc: 'Ottimizza ulteriormente i file WebP per dimensioni ancora più piccole. Ottieni la compressione massima mantenendo la qualità.' },
        { title: 'Supporto trasparenza', desc: 'Preserva la trasparenza quando si comprimono file WebP con canali alfa. Mantiene gli sfondi trasparenti.' },
        { title: 'Elaborazione 100% privata', desc: 'Tutta la compressione avviene localmente nel tuo browser. I tuoi file WebP non lasciano mai il tuo dispositivo, garantendo privacy completa.' },
        { title: 'Elaborazione batch', desc: 'Comprimi fino a 100 immagini WebP contemporaneamente. Elabora intere collezioni di immagini in un\'operazione.' },
        { title: 'Compressione veloce', desc: 'L\'elaborazione dell\'API Canvas nativa del browser garantisce compressione istantanea senza caricamenti sul server o ritardi.' },
        { title: 'Gratuito per sempre', desc: 'Compressione WebP illimitata completamente gratuita—nessun livello premium, nessuna tariffa di abbonamento, nessuna pubblicità.' }
      ]
    },
    specs: {
      engine: 'Canvas API - Elaborazione Browser-Native',
      privacy: '100% Client-Side (Elaborazione Browser Locale)'
    },
    performanceMetrics: {
      title: 'Specifiche tecniche',
      metrics: [
        { label: 'Formato di input', value: 'WebP (Formato immagine moderno di Google)' },
        { label: 'Formato di output', value: 'WebP (Formato originale preservato)' },
        null, null, null, null,
        { label: 'Posizione elaborazione', value: '100% Client-Side (API Canvas Browser)' }
      ]
    },
    howToUse: {
      title: 'Come comprimere immagini WebP',
      steps: [
        {
          title: 'Carica i tuoi file WebP',
          desc: 'Trascina e rilascia le tue immagini WebP nell\'area del compressore o fai clic per sfogliare e selezionare file WebP dal tuo dispositivo.'
        },
        null,
        {
          title: 'Scarica file compressi',
          desc: 'Scarica i tuoi file WebP comprimiti all\'istante. Ogni file mantiene la qualità visiva pur essendo significativamente più piccolo dell\'originale.'
        }
      ]
    },
    faq: [
      {
        q: 'Quanto posso comprimere un file WebP?',
        a: 'Tipicamente, i file WebP possono essere compressi ulteriormente del 20-40% mantenendo la qualità visiva. La riduzione esatta dipende dalla dimensione del file originale e dalle impostazioni di compressione.'
      },
      null, null,
      {
        q: 'La compressione WebP è gratuita e sicura?',
        a: 'Sì! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue immagini non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete.'
      },
      null,
      {
        q: 'Quali dimensioni di file posso comprimere?',
        a: 'Non ci sono limiti di dimensione del file individuali. Se il tuo computer può aprire il file, Toolaze può comprimerlo. Puoi elaborare file di qualsiasi dimensione.'
      }
    ]
  },
  'pt': {
    hero: {
      h1: 'Compressor WebP',
      desc: 'Comprima imagens WebP online gratuitamente. Simplesmente solte suas imagens WebP abaixo para comprimi-las em segundos.'
    },
    intro: {
      title: 'Por que comprimir imagens WebP?',
      content: [
        null,
        {
          title: 'Quando Comprimir WebP',
          text: 'Comprima imagens WebP quando precisar otimizar ainda mais arquivos WebP já comprimidos para tamanhos ainda menores, atender requisitos específicos de tamanho de arquivo para aplicações web ou aplicativos móveis, reduzir custos de largura de banda para hospedagem web ou armazenamento em nuvem, ou otimizar imagens para carregamento mais rápido em dispositivos móveis. Nossa ferramenta usa Canvas API para comprimir arquivos WebP localmente no seu navegador, garantindo privacidade completa enquanto mantém as características de compressão superiores do formato.'
        }
      ]
    },
    features: {
      items: [
        null,
        null,
        { title: 'Processamento 100% Privado', desc: 'Toda a compressão acontece localmente no seu navegador. Seus arquivos WebP nunca deixam seu dispositivo, garantindo privacidade completa.' },
        { title: 'Processamento em Lote', desc: 'Comprima até 100 imagens WebP simultaneamente. Processe coleções inteiras de imagens em uma única operação.' },
        null,
        { title: 'Gratuito para Sempre', desc: 'Compressão WebP ilimitada completamente gratuita—sem níveis premium, sem taxas de assinatura, sem anúncios.' }
      ]
    },
    specs: {
      engine: 'Canvas API - Processamento Browser-Native',
      privacy: '100% Client-Side (Processamento Browser Local)'
    },
    performanceMetrics: {
      metrics: [
        { label: 'Formato de Entrada', value: 'WebP (Formato de Imagem Moderno do Google)' },
        null, null, null, null, null,
        { label: 'Localização do Processamento', value: '100% Client-Side (API Canvas Browser)' }
      ]
    },
    howToUse: {
      title: 'Como comprimir imagens WebP',
      steps: [
        {
          title: 'Carregue seus arquivos WebP',
          desc: 'Arraste e solte suas imagens WebP na área do compressor ou clique para navegar e selecionar arquivos WebP do seu dispositivo.'
        },
        null,
        {
          title: 'Baixar arquivos comprimidos',
          desc: 'Baixe seus arquivos WebP comprimidos instantaneamente. Cada arquivo mantém a qualidade visual enquanto é significativamente menor que o original.'
        }
      ]
    },
    faq: [
      {
        q: 'Quanto posso comprimir um arquivo WebP?',
        a: 'Tipicamente, arquivos WebP podem ser comprimidos adicionalmente em 20-40% mantendo a qualidade visual. A redução exata depende do tamanho do arquivo original e das configurações de compressão.'
      },
      null, null,
      {
        q: 'A compressão WebP é gratuita e segura?',
        a: 'Sim! Toda a compressão acontece localmente no seu navegador usando JavaScript e Canvas API. Suas imagens nunca deixam seu dispositivo, garantindo privacidade e segurança completas.'
      },
      null,
      {
        q: 'Quais tamanhos de arquivo posso comprimir?',
        a: 'Não há limites de tamanho de arquivo individual. Se seu computador pode abrir o arquivo, Toolaze pode comprimi-lo. Você pode processar arquivos de qualquer tamanho.'
      }
    ]
  },
  'es': {
    hero: {
      h1: 'Compresor WebP',
      desc: 'Comprime imágenes WebP en línea de forma gratuita. Simplemente suelta tus imágenes WebP a continuación para comprimirlas en segundos.'
    },
    intro: {
      content: [
        null,
        {
          title: 'Cuándo Comprimir WebP',
          text: 'Comprime imágenes WebP cuando necesites optimizar aún más archivos WebP ya comprimidos para tamaños aún más pequeños, cumplir requisitos específicos de tamaño de archivo para aplicaciones web o aplicaciones móviles, reducir costos de ancho de banda para alojamiento web o almacenamiento en la nube, u optimizar imágenes para una carga más rápida en dispositivos móviles. Nuestra herramienta usa Canvas API para comprimir archivos WebP localmente en tu navegador, garantizando privacidad completa mientras mantiene las características de compresión superiores del formato.'
        }
      ]
    },
    features: {
      items: [
        null,
        { title: 'Soporte de transparencia', desc: 'Preserva la transparencia al comprimir archivos WebP con canales alfa. Mantiene fondos transparentes.' },
        { title: 'Procesamiento 100% privado', desc: 'Toda la compresión ocurre localmente en tu navegador. Tus archivos WebP nunca abandonan tu dispositivo, garantizando privacidad completa.' },
        { title: 'Procesamiento por lotes', desc: 'Comprime hasta 100 imágenes WebP simultáneamente. Procesa colecciones completas de imágenes en una sola operación.' },
        null,
        { title: 'Gratis para siempre', desc: 'Compresión WebP ilimitada completamente gratis—sin niveles premium, sin tarifas de suscripción, sin anuncios.' }
      ]
    },
    specs: {
      engine: 'Canvas API - Procesamiento Browser-Native',
      privacy: '100% Client-Side (Procesamiento Browser Local)'
    },
    performanceMetrics: {
      metrics: [
        { label: 'Formato de entrada', value: 'WebP (Formato de imagen moderno de Google)' },
        { label: 'Formato de salida', value: 'WebP (Formato original preservado)' },
        null, null, null,
        { label: 'Soporte de transparencia', value: 'Transparencia completa del canal alfa preservada' },
        { label: 'Ubicación de procesamiento', value: '100% Client-Side (API Canvas Browser)' }
      ]
    },
    howToUse: {
      steps: [
        {
          title: 'Sube tus archivos WebP',
          desc: 'Arrastra y suelta tus imágenes WebP en el área del compresor o haz clic para navegar y seleccionar archivos WebP de tu dispositivo.'
        },
        null,
        {
          title: 'Descargar archivos comprimidos',
          desc: 'Descarga tus archivos WebP comprimidos al instante. Cada archivo mantiene la calidad visual mientras es significativamente más pequeño que el original.'
        }
      ]
    },
    faq: [
      null, null, null,
      {
        q: '¿La compresión WebP es gratuita y segura?',
        a: '¡Sí! Toda la compresión ocurre localmente en tu navegador usando JavaScript y Canvas API. Tus imágenes nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas.'
      },
      null, null
    ]
  },
  'fr': {
    hero: {
      h1: 'Compresseur WebP',
      desc: 'Compressez des images WebP en ligne gratuitement. Déposez simplement vos images WebP ci-dessous pour les compresser en quelques secondes.'
    },
    intro: {
      title: 'Pourquoi compresser les images WebP?',
      content: [
        null,
        {
          title: 'Quand Compresser WebP',
          text: 'Compressez les images WebP lorsque vous devez optimiser davantage les fichiers WebP déjà compressés pour des tailles encore plus petites, répondre à des exigences spécifiques de taille de fichier pour les applications web ou mobiles, réduire les coûts de bande passante pour l\'hébergement web ou le stockage cloud, ou optimiser les images pour un chargement plus rapide sur les appareils mobiles. Notre outil utilise Canvas API pour compresser les fichiers WebP localement dans votre navigateur, garantissant une confidentialité complète tout en maintenant les caractéristiques de compression supérieures du format.'
        }
      ]
    },
    features: {
      items: [
        null,
        { title: 'Support de la transparence', desc: 'Préserve la transparence lors de la compression des fichiers WebP avec canaux alpha. Maintient les arrière-plans transparents.' },
        null,
        { title: 'Traitement par lots', desc: 'Compressez jusqu\'à 100 images WebP simultanément. Traitez des collections d\'images entières en une seule opération.' },
        { title: 'Compression rapide', desc: 'Le traitement de l\'API Canvas native du navigateur garantit une compression instantanée sans téléchargements serveur ni délais.' },
        { title: 'Gratuit pour toujours', desc: 'Compression WebP illimitée entièrement gratuite—pas de niveaux premium, pas de frais d\'abonnement, pas de publicités.' }
      ]
    },
    specs: {
      engine: 'Canvas API - Traitement Browser-Native',
      privacy: '100% côté client (Traitement local du navigateur)'
    },
    performanceMetrics: {
      metrics: [
        null,
        { label: 'Format de sortie', value: 'WebP (Format original préservé)' },
        null, null, null,
        { label: 'Support de la transparence', value: 'Transparence complète du canal alpha préservée' },
        { label: 'Emplacement du traitement', value: '100% Côté Client (API Canvas du Navigateur)' }
      ]
    },
    howToUse: {
      title: 'Comment compresser les images WebP',
      steps: [
        null, null, null
      ]
    },
    faq: [
      {
        q: 'Combien puis-je compresser un fichier WebP?',
        a: 'Typiquement, les fichiers WebP peuvent être compressés davantage de 20-40% tout en maintenant la qualité visuelle. La réduction exacte dépend de la taille du fichier original et des paramètres de compression.'
      },
      null, null,
      {
        q: 'La compression WebP est-elle gratuite et sécurisée?',
        a: 'Oui! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos images ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes.'
      },
      null,
      {
        q: 'Quelles tailles de fichier puis-je compresser?',
        a: 'Il n\'y a pas de limites de taille de fichier individuelles. Si votre ordinateur peut ouvrir le fichier, Toolaze peut le compresser. Vous pouvez traiter des fichiers de toute taille.'
      }
    ]
  },
  'ja': {
    intro: {
      content: [
        null,
        {
          title: 'WebPを圧縮するタイミング',
          text: '既に圧縮されたWebPファイルをさらに小さなサイズに最適化する必要がある場合、Webアプリケーションやモバイルアプリの特定のファイルサイズ要件を満たす場合、Webホスティングやクラウドストレージの帯域幅コストを削減する場合、またはモバイルデバイスでの高速読み込みのために画像を最適化する場合にWebP画像を圧縮します。当社のツールはCanvas APIを使用してブラウザ内でWebPファイルをローカルに圧縮し、形式の優れた圧縮特性を維持しながら完全なプライバシーを確保します。'
        }
      ]
    },
    features: {
      items: [
        null, null, null, null,
        { title: '高速圧縮', desc: 'ブラウザネイティブのCanvas API処理により、サーバーアップロードや遅延なしで即座に圧縮されます。' },
        null
      ]
    },
    specs: {
      engine: 'Canvas API - ブラウザネイティブ処理',
      privacy: '100%クライアント側（ローカルブラウザ処理）'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { label: '処理場所', value: '100%クライアント側（ブラウザCanvas API）' }
      ]
    },
    faq: [
      null, null, null,
      {
        q: 'WebP圧縮は無料で安全ですか？',
        a: 'はい！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。画像がデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。'
      },
      null, null
    ]
  },
  'zh-TW': {
    intro: {
      content: [
        null,
        {
          title: '何時壓縮 WebP',
          text: '當您需要進一步優化已壓縮的 WebP 檔案以獲得更小的尺寸、滿足網頁應用程式或行動應用程式的特定檔案大小要求、降低網頁託管或雲端儲存的頻寬成本，或優化圖片以在行動裝置上更快載入時，請壓縮 WebP 圖片。我們的工具使用 Canvas API 在您的瀏覽器中本地壓縮 WebP 檔案，確保完全隱私，同時保持格式的優越壓縮特性。'
        }
      ]
    },
    features: {
      items: [
        null, null, null, null,
        { title: '快速壓縮', desc: '瀏覽器原生 Canvas API 處理確保即時壓縮，無需服務器上傳或延遲。' },
        null
      ]
    },
    specs: {
      engine: 'Canvas API - 瀏覽器原生處理',
      privacy: '100% 客戶端（本地瀏覽器處理）'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { label: '處理位置', value: '100% 客戶端（瀏覽器 Canvas API）' }
      ]
    },
    faq: [
      null, null, null,
      {
        q: 'WebP 壓縮是免費且安全的嗎？',
        a: '是的！所有壓縮都在您的瀏覽器中使用 JavaScript 和 Canvas API 本地進行。您的圖片永遠不會離開您的設備，確保完全的隱私和安全。'
      },
      null, null
    ]
  },
  'ko': {
    intro: {
      content: [
        null,
        {
          title: 'WebP 압축 시기',
          text: '이미 압축된 WebP 파일을 더 작은 크기로 추가로 최적화해야 하는 경우, 웹 애플리케이션 또는 모바일 앱의 특정 파일 크기 요구 사항을 충족해야 하는 경우, 웹 호스팅 또는 클라우드 스토리지의 대역폭 비용을 줄이거나 모바일 장치에서 더 빠른 로딩을 위해 이미지를 최적화해야 하는 경우 WebP 이미지를 압축합니다. 당사 도구는 Canvas API를 사용하여 브라우저에서 WebP 파일을 로컬로 압축하여 형식의 우수한 압축 특성을 유지하면서 완전한 개인 정보 보호를 보장합니다.'
        }
      ]
    },
    features: {
      items: [
        null, null, null, null,
        { title: '빠른 압축', desc: '브라우저 네이티브 Canvas API 처리는 서버 업로드나 지연 없이 즉시 압축을 보장합니다.' },
        null
      ]
    },
    specs: {
      engine: 'Canvas API - 브라우저 네이티브 처리',
      privacy: '100% 클라이언트 측 (로컬 브라우저 처리)'
    },
    performanceMetrics: {
      metrics: [
        null, null, null, null, null, null,
        { label: '처리 위치', value: '100% 클라이언트 측 (브라우저 Canvas API)' }
      ]
    },
    faq: [
      null, null, null,
      {
        q: 'WebP 압축이 무료이고 안전한가요?',
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

    const langTranslations = translations[lang]
    if (!langTranslations) {
      console.log(`⚠️  没有翻译数据: ${lang}`)
      return false
    }

    // 应用翻译
    const webpData = data['compress-webp']
    
    // 合并翻译
    if (langTranslations.hero) {
      Object.assign(webpData.hero, langTranslations.hero)
    }
    
    if (langTranslations.intro) {
      if (langTranslations.intro.title) {
        webpData.intro.title = langTranslations.intro.title
      }
      if (langTranslations.intro.content) {
        webpData.intro.content = deepMerge(webpData.intro.content, langTranslations.intro.content)
      }
    }
    
    if (langTranslations.features && langTranslations.features.items) {
      webpData.features.items = deepMerge(webpData.features.items, langTranslations.features.items)
    }
    
    if (langTranslations.specs) {
      Object.assign(webpData.specs, langTranslations.specs)
    }
    
    if (langTranslations.performanceMetrics) {
      if (langTranslations.performanceMetrics.title) {
        webpData.performanceMetrics.title = langTranslations.performanceMetrics.title
      }
      if (langTranslations.performanceMetrics.metrics) {
        webpData.performanceMetrics.metrics = deepMerge(webpData.performanceMetrics.metrics, langTranslations.performanceMetrics.metrics)
      }
    }
    
    if (langTranslations.howToUse) {
      if (langTranslations.howToUse.title) {
        webpData.howToUse.title = langTranslations.howToUse.title
      }
      if (langTranslations.howToUse.steps) {
        webpData.howToUse.steps = deepMerge(webpData.howToUse.steps, langTranslations.howToUse.steps)
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
  console.log('开始修复 compress-webp 页面的多语言翻译...\n')
  
  const languages = ['de', 'it', 'pt', 'es', 'fr', 'ja', 'zh-TW', 'ko']
  let successCount = 0
  
  for (const lang of languages) {
    if (processLanguage(lang)) {
      successCount++
    }
  }
  
  console.log(`\n完成！成功修复 ${successCount}/${languages.length} 个语言文件`)
}

main()
