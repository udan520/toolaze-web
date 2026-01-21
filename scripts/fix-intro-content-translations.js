const fs = require('fs');
const path = require('path');

// intro.content[] 标题翻译模板
const introTitleTranslations = {
  'JPG Compression Benefits': {
    de: 'Vorteile der JPG-Komprimierung',
    es: 'Beneficios de la compresión JPG',
    fr: 'Avantages de la compression JPG',
    it: 'Vantaggi della compressione JPG',
    ja: 'JPG圧縮の利点',
    ko: 'JPG 압축의 이점',
    pt: 'Benefícios da compressão JPG',
    'zh-TW': 'JPG 壓縮的優點'
  },
  'When to Compress JPG': {
    de: 'Wann JPG komprimieren',
    es: 'Cuándo comprimir JPG',
    fr: 'Quand compresser JPG',
    it: 'Quando comprimere JPG',
    ja: 'JPGを圧縮するタイミング',
    ko: 'JPG 압축 시기',
    pt: 'Quando comprimir JPG',
    'zh-TW': '何時壓縮 JPG'
  },
  'Strict Government Portal Requirements': {
    de: 'Strenge Anforderungen von Behördenportalen',
    es: 'Requisitos estrictos de portales gubernamentales',
    fr: 'Exigences strictes des portails gouvernementaux',
    it: 'Requisiti rigorosi dei portali governativi',
    ja: '政府ポータルの厳格な要件',
    ko: '정부 포털의 엄격한 요구사항',
    pt: 'Requisitos rigorosos de portais governamentais',
    'zh-TW': '政府網站的嚴格要求'
  },
  'Complete Privacy for Sensitive Documents': {
    de: 'Vollständige Privatsphäre für sensible Dokumente',
    es: 'Privacidad completa para documentos sensibles',
    fr: 'Confidentialité complète pour documents sensibles',
    it: 'Privacy completa per documenti sensibili',
    ja: '機密文書の完全なプライバシー',
    ko: '민감한 문서를 위한 완전한 개인정보 보호',
    pt: 'Privacidade completa para documentos sensíveis',
    'zh-TW': '敏感文件的完全隱私'
  },
  'Web Performance and Lighthouse Scores': {
    de: 'Web-Performance und Lighthouse-Bewertungen',
    es: 'Rendimiento web y puntuaciones de Lighthouse',
    fr: 'Performance web et scores Lighthouse',
    it: 'Prestazioni web e punteggi Lighthouse',
    ja: 'WebパフォーマンスとLighthouseスコア',
    ko: '웹 성능 및 Lighthouse 점수',
    pt: 'Desempenho web e pontuações do Lighthouse',
    'zh-TW': '網頁效能和 Lighthouse 分數'
  },
  'Preserve Transparency for Professional UI/UX': {
    de: 'Transparenz für professionelles UI/UX erhalten',
    es: 'Preservar la transparencia para UI/UX profesional',
    fr: 'Préserver la transparence pour un UI/UX professionnel',
    it: 'Preservare la trasparenza per UI/UX professionale',
    ja: 'プロフェッショナルなUI/UXのための透明度の保持',
    ko: '전문적인 UI/UX를 위한 투명도 보존',
    pt: 'Preservar transparência para UI/UX profissional',
    'zh-TW': '為專業 UI/UX 保留透明度'
  },
  'DS-160 Visa Application Requirements': {
    de: 'Anforderungen für DS-160-Visumanträge',
    es: 'Requisitos de solicitud de visa DS-160',
    fr: 'Exigences de demande de visa DS-160',
    it: 'Requisiti per domanda di visto DS-160',
    ja: 'DS-160ビザ申請の要件',
    ko: 'DS-160 비자 신청 요구사항',
    pt: 'Requisitos de solicitação de visto DS-160',
    'zh-TW': 'DS-160 簽證申請要求'
  },
  'Complete Privacy for Biometric Data': {
    de: 'Vollständige Privatsphäre für biometrische Daten',
    es: 'Privacidad completa para datos biométricos',
    fr: 'Confidentialité complète pour données biométriques',
    it: 'Privacy completa per dati biometrici',
    ja: '生体認証データの完全なプライバシー',
    ko: '생체 인식 데이터를 위한 완전한 개인정보 보호',
    pt: 'Privacidade completa para dados biométricos',
    'zh-TW': '生物識別數據的完全隱私'
  },
  'Universal Size Requirements': {
    de: 'Universelle Größenanforderungen',
    es: 'Requisitos de tamaño universales',
    fr: 'Exigences de taille universelles',
    it: 'Requisiti di dimensione universali',
    ja: 'ユニバーサルサイズ要件',
    ko: '범용 크기 요구사항',
    pt: 'Requisitos de tamanho universais',
    'zh-TW': '通用大小要求'
  },
  'Passport Photo Standards': {
    de: 'Reisepassfoto-Standards',
    es: 'Estándares de fotos de pasaporte',
    fr: 'Normes de photos de passeport',
    it: 'Standard per foto del passaporto',
    ja: 'パスポート写真の基準',
    ko: '여권 사진 표준',
    pt: 'Padrões de fotos de passaporte',
    'zh-TW': '護照照片標準'
  }
};

// intro.content[] 文本翻译函数 - 处理常见模式
function translateIntroText(text, lang) {
  // 处理 "JPG Compression Benefits" 的文本
  if (text.includes('JPG (JPEG) is the most widely used image format')) {
    const translations = {
      de: 'JPG (JPEG) ist das am weitesten verbreitete Bildformat für Fotos und Web-Bilder. Große JPG-Dateien können jedoch Websites verlangsamen, Speicherplatz verbrauchen und Upload-Fehler verursachen. Die Komprimierung von JPG-Bildern reduziert die Dateigröße um 50-70%, während eine akzeptable visuelle Qualität erhalten bleibt, was sie perfekt für die Webnutzung, E-Mail-Anhänge und Online-Formulare macht. Unser browserbasierter Kompressor verarbeitet Ihre JPG-Dateien lokal mit Canvas API und gewährleistet vollständige Privatsphäre und schnelle Komprimierung, ohne Ihre Bilder auf einen Server hochzuladen.',
      es: 'JPG (JPEG) es el formato de imagen más utilizado para fotos e imágenes web. Sin embargo, los archivos JPG grandes pueden ralentizar los sitios web, consumir espacio de almacenamiento y causar fallos de carga. Comprimir imágenes JPG reduce el tamaño del archivo entre un 50-70% manteniendo una calidad visual aceptable, haciéndolas perfectas para uso web, adjuntos de correo electrónico y formularios en línea. Nuestro compresor basado en navegador procesa sus archivos JPG localmente usando Canvas API, garantizando privacidad completa y compresión rápida sin subir sus imágenes a ningún servidor.',
      fr: 'JPG (JPEG) est le format d\'image le plus largement utilisé pour les photos et les images web. Cependant, les fichiers JPG volumineux peuvent ralentir les sites web, consommer de l\'espace de stockage et provoquer des échecs de téléchargement. La compression des images JPG réduit la taille des fichiers de 50 à 70% tout en maintenant une qualité visuelle acceptable, ce qui les rend parfaites pour une utilisation web, les pièces jointes e-mail et les formulaires en ligne. Notre compresseur basé sur navigateur traite vos fichiers JPG localement en utilisant Canvas API, garantissant une confidentialité complète et une compression rapide sans télécharger vos images sur un serveur.',
      it: 'JPG (JPEG) è il formato di immagine più utilizzato per foto e immagini web. Tuttavia, i file JPG di grandi dimensioni possono rallentare i siti web, consumare spazio di archiviazione e causare errori di caricamento. La compressione delle immagini JPG riduce la dimensione del file del 50-70% mantenendo una qualità visiva accettabile, rendendole perfette per l\'uso web, gli allegati e-mail e i moduli online. Il nostro compressore basato su browser elabora i tuoi file JPG localmente utilizzando Canvas API, garantendo privacy completa e compressione rapida senza caricare le tue immagini su alcun server.',
      ja: 'JPG（JPEG）は、写真やWeb画像で最も広く使用されている画像形式です。ただし、大きなJPGファイルは、Webサイトの速度を低下させ、ストレージスペースを消費し、アップロードエラーを引き起こす可能性があります。JPG画像を圧縮すると、許容できる視覚品質を維持しながらファイルサイズが50-70%削減され、Web使用、メール添付、オンラインフォームに最適です。ブラウザベースの圧縮ツールは、Canvas APIを使用してJPGファイルをローカルで処理し、画像をサーバーにアップロードすることなく、完全なプライバシーと高速圧縮を保証します。',
      ko: 'JPG(JPEG)는 사진 및 웹 이미지에 가장 널리 사용되는 이미지 형식입니다. 그러나 큰 JPG 파일은 웹사이트 속도를 늦추고, 저장 공간을 소비하며, 업로드 실패를 유발할 수 있습니다. JPG 이미지를 압축하면 허용 가능한 시각적 품질을 유지하면서 파일 크기를 50-70% 줄여 웹 사용, 이메일 첨부 파일 및 온라인 양식에 완벽합니다. 브라우저 기반 압축기는 Canvas API를 사용하여 JPG 파일을 로컬로 처리하여 이미지를 서버에 업로드하지 않고 완전한 개인정보 보호와 빠른 압축을 보장합니다.',
      pt: 'JPG (JPEG) é o formato de imagem mais amplamente usado para fotos e imagens web. No entanto, arquivos JPG grandes podem desacelerar sites, consumir espaço de armazenamento e causar falhas de upload. Comprimir imagens JPG reduz o tamanho do arquivo em 50-70% mantendo qualidade visual aceitável, tornando-as perfeitas para uso web, anexos de e-mail e formulários online. Nosso compressor baseado em navegador processa seus arquivos JPG localmente usando Canvas API, garantindo privacidade completa e compressão rápida sem fazer upload de suas imagens para nenhum servidor.',
      'zh-TW': 'JPG（JPEG）是用於照片和網頁圖片最廣泛使用的圖片格式。然而，大型 JPG 檔案可能會減慢網站速度、消耗儲存空間並導致上傳失敗。壓縮 JPG 圖片可在保持可接受的視覺品質的同時將檔案大小減少 50-70%，使其非常適合網頁使用、電子郵件附件和線上表單。我們的瀏覽器壓縮工具使用 Canvas API 在本地處理您的 JPG 檔案，確保完全的隱私和快速壓縮，無需將您的圖片上傳到任何伺服器。'
    };
    return translations[lang] || text;
  }
  
  // 处理 "When to Compress JPG" 的文本
  if (text.includes('Compress JPG images when you need to reduce file size')) {
    const translations = {
      de: 'Komprimieren Sie JPG-Bilder, wenn Sie die Dateigröße für schnellere Website-Ladezeiten reduzieren müssen, Upload-Größenlimits für Online-Formulare oder E-Mail-Anhänge erfüllen müssen, Speicherplatz auf Ihrem Gerät oder Cloud-Speicher sparen möchten oder Bilder für Social-Media-Plattformen optimieren möchten. Unser Tool unterstützt präzise Größensteuerung und ermöglicht es Ihnen, exakte Zielgrößen in KB oder MB festzulegen, was es perfekt macht, um spezifische Anforderungen zu erfüllen und gleichzeitig die Bildqualität zu erhalten.',
      es: 'Comprime imágenes JPG cuando necesites reducir el tamaño del archivo para tiempos de carga más rápidos del sitio web, cumplir con límites de tamaño de carga para formularios en línea o adjuntos de correo electrónico, ahorrar espacio de almacenamiento en tu dispositivo o almacenamiento en la nube, u optimizar imágenes para plataformas de redes sociales. Nuestra herramienta admite control preciso del tamaño, permitiéndote establecer tamaños objetivo exactos en KB o MB, lo que la hace perfecta para cumplir requisitos específicos mientras mantienes la calidad de la imagen.',
      fr: 'Compressez les images JPG lorsque vous devez réduire la taille du fichier pour des temps de chargement de site web plus rapides, respecter les limites de taille de téléchargement pour les formulaires en ligne ou les pièces jointes e-mail, économiser de l\'espace de stockage sur votre appareil ou le stockage cloud, ou optimiser les images pour les plateformes de médias sociaux. Notre outil prend en charge le contrôle précis de la taille, vous permettant de définir des tailles cibles exactes en KB ou MB, ce qui le rend parfait pour répondre à des exigences spécifiques tout en maintenant la qualité de l\'image.',
      it: 'Comprimi le immagini JPG quando devi ridurre la dimensione del file per tempi di caricamento del sito web più rapidi, soddisfare i limiti di dimensione di caricamento per moduli online o allegati e-mail, risparmiare spazio di archiviazione sul tuo dispositivo o archiviazione cloud, o ottimizzare le immagini per piattaforme di social media. Il nostro strumento supporta il controllo preciso delle dimensioni, consentendoti di impostare dimensioni target esatte in KB o MB, rendendolo perfetto per soddisfare requisiti specifici mantenendo la qualità dell\'immagine.',
      ja: 'Webサイトの読み込み時間を短縮するためにファイルサイズを減らす必要がある場合、オンラインフォームやメール添付ファイルのアップロードサイズ制限を満たす必要がある場合、デバイスまたはクラウドストレージのストレージスペースを節約したい場合、またはソーシャルメディアプラットフォーム用に画像を最適化したい場合にJPG画像を圧縮します。当社のツールは正確なサイズ制御をサポートし、KBまたはMBで正確なターゲットサイズを設定できるため、画像品質を維持しながら特定の要件を満たすのに最適です。',
      ko: '웹사이트 로딩 시간을 단축하기 위해 파일 크기를 줄여야 할 때, 온라인 양식 또는 이메일 첨부 파일의 업로드 크기 제한을 충족해야 할 때, 기기 또는 클라우드 저장소의 저장 공간을 절약하려고 할 때, 또는 소셜 미디어 플랫폼용 이미지를 최적화하려고 할 때 JPG 이미지를 압축하세요. 당사의 도구는 정확한 크기 제어를 지원하여 KB 또는 MB로 정확한 목표 크기를 설정할 수 있어 이미지 품질을 유지하면서 특정 요구사항을 충족하는 데 완벽합니다.',
      pt: 'Comprima imagens JPG quando precisar reduzir o tamanho do arquivo para tempos de carregamento mais rápidos do site, atender limites de tamanho de upload para formulários online ou anexos de e-mail, economizar espaço de armazenamento no seu dispositivo ou armazenamento em nuvem, ou otimizar imagens para plataformas de redes sociais. Nossa ferramenta suporta controle preciso de tamanho, permitindo definir tamanhos alvo exatos em KB ou MB, tornando-a perfeita para atender requisitos específicos mantendo a qualidade da imagem.',
      'zh-TW': '當您需要減少檔案大小以加快網站載入時間、滿足線上表單或電子郵件附件的上傳大小限制、節省設備或雲端儲存空間，或優化社交媒體平台的圖片時，請壓縮 JPG 圖片。我們的工具支援精確的大小控制，允許您以 KB 或 MB 設定確切的目標大小，使其非常適合在保持圖片品質的同時滿足特定要求。'
    };
    return translations[lang] || text;
  }
  
  // 处理 "Strict Government Portal Requirements" 的文本
  if (text.includes('Many government and academic portals enforce')) {
    const translations = {
      de: 'Viele Behörden- und Hochschulportale setzen ein strenges 20KB-Dateigrößenlimit für Ausweisfotos, Prüfungsanmeldungen und offizielle Dokumenten-Uploads durch. Wenn Sie ein Foto mit Ihrem Smartphone aufnehmen oder ein Dokument scannen, ist die resultierende JPG-Datei oft 2-5MB groß und überschreitet diese Limits bei weitem. Upload-Fehler aufgrund von Dateigrößenbeschränkungen können Ihre Bewerbungen verzögern, Ihre Zeit verschwenden und Frustration verursachen. Unser browserbasierter Kompressor verwendet intelligente Canvas-API-Verarbeitung, um Ihre JPG-Dateien genau auf 20KB zu reduzieren und gleichzeitig die für die offizielle Verifizierung erforderliche visuelle Qualität zu erhalten.',
      es: 'Muchos portales gubernamentales y académicos aplican un límite estricto de tamaño de archivo de 20KB para fotos de identificación, registros de exámenes y cargas de documentos oficiales. Cuando tomas una foto con tu smartphone o escaneas un documento, el archivo JPG resultante a menudo tiene 2-5MB, muy por encima de estos límites. Los fallos de carga debido a restricciones de tamaño de archivo pueden retrasar tus solicitudes, desperdiciar tu tiempo y causar frustración. Nuestro compresor basado en navegador utiliza procesamiento inteligente de Canvas API para reducir tus archivos JPG exactamente a 20KB mientras mantiene la calidad visual necesaria para la verificación oficial.',
      fr: 'De nombreux portails gouvernementaux et académiques appliquent une limite stricte de taille de fichier de 20KB pour les photos d\'identité, les inscriptions aux examens et les téléchargements de documents officiels. Lorsque vous prenez une photo avec votre smartphone ou scannez un document, le fichier JPG résultant fait souvent 2-5MB, dépassant largement ces limites. Les échecs de téléchargement dus aux restrictions de taille de fichier peuvent retarder vos candidatures, gaspiller votre temps et causer de la frustration. Notre compresseur basé sur navigateur utilise un traitement intelligent Canvas API pour réduire vos fichiers JPG exactement à 20KB tout en maintenant la qualité visuelle nécessaire pour la vérification officielle.',
      it: 'Molti portali governativi e accademici applicano un limite rigoroso di dimensione del file di 20KB per foto d\'identità, registrazioni d\'esame e caricamenti di documenti ufficiali. Quando scatti una foto con il tuo smartphone o scansioni un documento, il file JPG risultante è spesso di 2-5MB, superando di gran lunga questi limiti. I fallimenti di caricamento dovuti alle restrizioni di dimensione del file possono ritardare le tue domande, sprecare il tuo tempo e causare frustrazione. Il nostro compressore basato su browser utilizza l\'elaborazione intelligente di Canvas API per ridurre i tuoi file JPG esattamente a 20KB mantenendo la qualità visiva necessaria per la verifica ufficiale.',
      ja: '多くの政府および学術ポータルは、身分証明書の写真、試験登録、公式文書のアップロードに対して厳格な20KBファイルサイズ制限を実施しています。スマートフォンで写真を撮影したり、文書をスキャンしたりすると、結果として得られるJPGファイルはしばしば2-5MBになり、これらの制限を大幅に超えます。ファイルサイズの制限によるアップロードエラーは、申請を遅らせ、時間を無駄にし、フラストレーションを引き起こす可能性があります。当社のブラウザベースの圧縮ツールは、インテリジェントなCanvas API処理を使用して、JPGファイルを正確に20KBに削減しながら、公式検証に必要な視覚品質を維持します。',
      ko: '많은 정부 및 학술 포털은 신분증 사진, 시험 등록 및 공식 문서 업로드에 대해 엄격한 20KB 파일 크기 제한을 시행합니다. 스마트폰으로 사진을 찍거나 문서를 스캔하면 결과 JPG 파일은 종종 2-5MB로 이러한 제한을 훨씬 초과합니다. 파일 크기 제한으로 인한 업로드 실패는 신청을 지연시키고 시간을 낭비하며 좌절감을 유발할 수 있습니다. 당사의 브라우저 기반 압축기는 지능형 Canvas API 처리를 사용하여 JPG 파일을 정확히 20KB로 줄이면서 공식 검증에 필요한 시각적 품질을 유지합니다.',
      pt: 'Muitos portais governamentais e acadêmicos aplicam um limite rigoroso de tamanho de arquivo de 20KB para fotos de identidade, registros de exames e uploads de documentos oficiais. Quando você tira uma foto com seu smartphone ou digitaliza um documento, o arquivo JPG resultante geralmente tem 2-5MB, muito acima desses limites. Falhas de upload devido a restrições de tamanho de arquivo podem atrasar suas inscrições, desperdiçar seu tempo e causar frustração. Nosso compressor baseado em navegador usa processamento inteligente de Canvas API para reduzir seus arquivos JPG exatamente para 20KB mantendo a qualidade visual necessária para verificação oficial.',
      'zh-TW': '許多政府和學術網站對身份證照片、考試註冊和官方文件上傳實施嚴格的 20KB 檔案大小限制。當您使用智能手機拍照或掃描文件時，生成的 JPG 檔案通常為 2-5MB，遠遠超過這些限制。由於檔案大小限制導致的上傳失敗可能會延遲您的申請、浪費您的時間並造成挫折。我們的瀏覽器壓縮工具使用智能 Canvas API 處理，將您的 JPG 檔案精確減少到 20KB，同時保持官方驗證所需的視覺品質。'
    };
    return translations[lang] || text;
  }
  
  // 处理 "Web Performance and Lighthouse Scores" 的文本
  if (text.includes('Large PNG files significantly slow down website loading times')) {
    const translations = {
      de: 'Große PNG-Dateien verlangsamen die Website-Ladezeiten erheblich und beeinträchtigen die Benutzererfahrung und Suchmaschinenrankings. Die Performance-Audits von Google Lighthouse bestrafen Websites mit Bildern über 100KB und beeinflussen Ihre Core Web Vitals-Bewertungen und SEO-Leistung. Wenn Sie PNG-Bilder aus Design-Tools wie Photoshop, Figma oder Canva exportieren, überschreiten sie oft 500KB oder sogar mehrere Megabyte, insbesondere bei Bildern mit Transparenz oder hochauflösenden Grafiken. Toolaze verwendet intelligente browserbasierte Komprimierung, um PNG-Dateigrößen genau auf 100KB zu reduzieren und gleichzeitig die Alpha-Kanal-Transparenz zu erhalten, die das PNG-Format für modernes Webdesign unverzichtbar macht.',
      es: 'Los archivos PNG grandes ralentizan significativamente los tiempos de carga del sitio web, perjudicando la experiencia del usuario y los rankings de los motores de búsqueda. Las auditorías de rendimiento de Google Lighthouse penalizan sitios con imágenes de más de 100KB, afectando sus puntuaciones de Core Web Vitals y rendimiento SEO. Cuando exporta imágenes PNG desde herramientas de diseño como Photoshop, Figma o Canva, a menudo exceden 500KB o incluso varios megabytes, especialmente para imágenes con transparencia o gráficos de alta resolución. Toolaze usa compresión inteligente del lado del navegador para reducir los tamaños de archivo PNG exactamente a 100KB mientras preserva la transparencia del canal Alpha que hace que el formato PNG sea esencial para el diseño web moderno.',
      fr: 'Les fichiers PNG volumineux ralentissent considérablement les temps de chargement des sites web, nuisant à l\'expérience utilisateur et aux classements des moteurs de recherche. Les audits de performance de Google Lighthouse pénalisent les sites avec des images de plus de 100KB, affectant vos scores Core Web Vitals et les performances SEO. Lorsque vous exportez des images PNG depuis des outils de design comme Photoshop, Figma ou Canva, elles dépassent souvent 500KB ou même plusieurs mégabytes, surtout pour les images avec transparence ou graphiques haute résolution. Toolaze utilise une compression intelligente côté navigateur pour réduire les tailles de fichier PNG exactement à 100KB tout en préservant la transparence du canal Alpha qui rend le format PNG essentiel pour le design web moderne.',
      it: 'I file PNG di grandi dimensioni rallentano significativamente i tempi di caricamento del sito web, danneggiando l\'esperienza utente e le classifiche dei motori di ricerca. Le verifiche delle prestazioni di Google Lighthouse penalizzano i siti con immagini superiori a 100KB, influenzando i punteggi Core Web Vitals e le prestazioni SEO. Quando esporti immagini PNG da strumenti di design come Photoshop, Figma o Canva, spesso superano 500KB o addirittura diversi megabyte, specialmente per immagini con trasparenza o grafiche ad alta risoluzione. Toolaze utilizza compressione intelligente lato browser per ridurre le dimensioni dei file PNG esattamente a 100KB preservando la trasparenza del canale Alpha che rende il formato PNG essenziale per il design web moderno.',
      ja: '大きなPNGファイルは、Webサイトの読み込み時間を大幅に遅くし、ユーザーエクスペリエンスと検索エンジンのランキングに悪影響を与えます。GoogleのLighthouseパフォーマンス監査は、100KBを超える画像を持つサイトをペナルティし、Core Web VitalsスコアとSEOパフォーマンスに影響を与えます。Photoshop、Figma、CanvaなどのデザインツールからPNG画像をエクスポートすると、特に透明度や高解像度グラフィックを含む画像の場合、500KBまたは数メガバイトを超えることがよくあります。Toolazeは、インテリジェントなブラウザ側圧縮を使用して、PNGファイルサイズを正確に100KBに削減しながら、PNG形式をモダンなWebデザインに不可欠にするAlphaチャネルの透明度を保持します。',
      ko: '큰 PNG 파일은 웹사이트 로딩 시간을 크게 늦추고 사용자 경험과 검색 엔진 순위에 악영향을 미칩니다. Google의 Lighthouse 성능 감사는 100KB를 초과하는 이미지가 있는 사이트에 불이익을 주어 Core Web Vitals 점수와 SEO 성능에 영향을 미칩니다. Photoshop, Figma 또는 Canva와 같은 디자인 도구에서 PNG 이미지를 내보낼 때 특히 투명도나 고해상도 그래픽이 있는 이미지의 경우 500KB 또는 수 메가바이트를 초과하는 경우가 많습니다. Toolaze는 지능형 브라우저 측 압축을 사용하여 PNG 파일 크기를 정확히 100KB로 줄이면서 PNG 형식을 현대 웹 디자인에 필수적으로 만드는 Alpha 채널 투명도를 보존합니다.',
      pt: 'Arquivos PNG grandes desaceleram significativamente os tempos de carregamento do site, prejudicando a experiência do usuário e os rankings dos mecanismos de busca. As auditorias de desempenho do Google Lighthouse penalizam sites com imagens acima de 100KB, afetando suas pontuações Core Web Vitals e desempenho SEO. Quando você exporta imagens PNG de ferramentas de design como Photoshop, Figma ou Canva, elas frequentemente excedem 500KB ou até vários megabytes, especialmente para imagens com transparência ou gráficos de alta resolução. O Toolaze usa compressão inteligente do lado do navegador para reduzir os tamanhos de arquivo PNG exatamente para 100KB preservando a transparência do canal Alpha que torna o formato PNG essencial para o design web moderno.',
      'zh-TW': '大型 PNG 檔案會顯著減慢網站載入時間，損害使用者體驗和搜尋引擎排名。Google 的 Lighthouse 效能審核會對圖片超過 100KB 的網站進行處罰，影響您的 Core Web Vitals 分數和 SEO 效能。當您從 Photoshop、Figma 或 Canva 等設計工具匯出 PNG 圖片時，它們通常會超過 500KB 甚至數 MB，特別是對於具有透明度或高解析度圖形的圖片。Toolaze 使用智能瀏覽器端壓縮將 PNG 檔案大小精確減少到 100KB，同時保留使 PNG 格式成為現代網頁設計必不可少的 Alpha 通道透明度。'
    };
    return translations[lang] || text;
  }
  
  // 处理 "Preserve Transparency for Professional UI/UX" 的文本
  if (text.includes('PNG format is crucial for web design because it supports transparency')) {
    const translations = {
      de: 'Das PNG-Format ist für Webdesign entscheidend, da es Transparenz unterstützt und Logos, Symbole und Grafiken ermöglicht, sich nahtlos mit jedem Hintergrund zu vermischen. Die Umwandlung von PNG in JPG zur Reduzierung der Dateigröße zerstört diese Transparenz und zwingt Sie, solide Hintergründe zu verwenden oder Ihre Designflexibilität einzuschränken. Unser Komprimierungsalgorithmus erhält den Alpha-Kanal während des gesamten Prozesses und stellt sicher, dass Ihre transparenten Hintergründe perfekt klar bleiben und Ihre UI/UX-Designs professionell bleiben. Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser, sodass Ihre Design-Assets Ihr Gerät niemals verlassen und vollständig privat und sicher bleiben.',
      es: 'El formato PNG es crucial para el diseño web porque admite transparencia, permitiendo que logotipos, iconos y gráficos se mezclen perfectamente con cualquier fondo. Convertir PNG a JPG para reducir el tamaño del archivo destruye esta transparencia, obligándote a usar fondos sólidos o limitando tu flexibilidad de diseño. Nuestro algoritmo de compresión mantiene el canal Alpha durante todo el proceso, asegurando que tus fondos transparentes permanezcan perfectamente claros y tus diseños UI/UX se mantengan profesionales. Todo el procesamiento ocurre localmente en tu navegador, por lo que tus recursos de diseño nunca abandonan tu dispositivo y permanecen completamente privados y seguros.',
      fr: 'Le format PNG est crucial pour le design web car il prend en charge la transparence, permettant aux logos, icônes et graphiques de se fondre parfaitement avec n\'importe quel arrière-plan. Convertir PNG en JPG pour réduire la taille du fichier détruit cette transparence, vous forçant à utiliser des arrière-plans solides ou limitant votre flexibilité de conception. Notre algorithme de compression maintient le canal Alpha tout au long du processus, garantissant que vos arrière-plans transparents restent parfaitement clairs et que vos conceptions UI/UX restent professionnelles. Tout le traitement se fait localement dans votre navigateur, donc vos ressources de design ne quittent jamais votre appareil et restent complètement privées et sécurisées.',
      it: 'Il formato PNG è cruciale per il web design perché supporta la trasparenza, consentendo a loghi, icone e grafiche di fondersi perfettamente con qualsiasi sfondo. Convertire PNG in JPG per ridurre la dimensione del file distrugge questa trasparenza, costringendoti a usare sfondi solidi o limitando la tua flessibilità di design. Il nostro algoritmo di compressione mantiene il canale Alpha durante tutto il processo, assicurando che i tuoi sfondi trasparenti rimangano perfettamente chiari e i tuoi design UI/UX rimangano professionali. Tutta l\'elaborazione avviene localmente nel tuo browser, quindi le tue risorse di design non lasciano mai il tuo dispositivo e rimangono completamente private e sicure.',
      ja: 'PNG形式は透明度をサポートしているため、Webデザインにとって重要であり、ロゴ、アイコン、グラフィックが任意の背景とシームレスにブレンドできるようになります。ファイルサイズを減らすためにPNGをJPGに変換すると、この透明度が破壊され、単色の背景を使用するか、デザインの柔軟性を制限することを余儀なくされます。当社の圧縮アルゴリズムは、プロセス全体を通じてAlphaチャネルを維持し、透明な背景が完全にクリアなままになり、UI/UXデザインがプロフェッショナルなままであることを保証します。すべての処理はブラウザでローカルに実行されるため、デザインアセットがデバイスを離れることはなく、完全にプライベートで安全なままです。',
      ko: 'PNG 형식은 투명도를 지원하기 때문에 웹 디자인에 중요하며, 로고, 아이콘 및 그래픽이 모든 배경과 완벽하게 혼합될 수 있도록 합니다. 파일 크기를 줄이기 위해 PNG를 JPG로 변환하면 이 투명도가 파괴되어 단색 배경을 사용하거나 디자인 유연성을 제한해야 합니다. 당사의 압축 알고리즘은 프로세스 전체에 걸쳐 Alpha 채널을 유지하여 투명한 배경이 완벽하게 선명하게 유지되고 UI/UX 디자인이 전문적으로 유지되도록 보장합니다. 모든 처리는 브라우저에서 로컬로 수행되므로 디자인 자산이 기기를 떠나지 않으며 완전히 비공개 및 안전하게 유지됩니다.',
      pt: 'O formato PNG é crucial para o design web porque suporta transparência, permitindo que logotipos, ícones e gráficos se misturem perfeitamente com qualquer fundo. Converter PNG para JPG para reduzir o tamanho do arquivo destrói essa transparência, forçando você a usar fundos sólidos ou limitando sua flexibilidade de design. Nosso algoritmo de compressão mantém o canal Alpha durante todo o processo, garantindo que seus fundos transparentes permaneçam perfeitamente claros e seus designs UI/UX permaneçam profissionais. Todo o processamento acontece localmente no seu navegador, então seus recursos de design nunca deixam seu dispositivo e permanecem completamente privados e seguros.',
      'zh-TW': 'PNG 格式對網頁設計至關重要，因為它支援透明度，允許標誌、圖標和圖形與任何背景完美融合。將 PNG 轉換為 JPG 以減少檔案大小會破壞這種透明度，迫使您使用純色背景或限制您的設計靈活性。我們的壓縮演算法在整個過程中保持 Alpha 通道，確保您的透明背景保持完全清晰，您的 UI/UX 設計保持專業。所有處理都在您的瀏覽器中本地進行，因此您的設計資源永遠不會離開您的設備，並保持完全私密和安全。'
    };
    return translations[lang] || text;
  }
  
  // 处理 "Complete Privacy for Sensitive Documents" 的文本
  if (text.includes('Government portals require personal ID photos')) {
    const translations = {
      de: 'Behördenportale benötigen persönliche Ausweisfotos, Passscans und sensible Dokumente, die Ihre biometrischen Informationen enthalten. Das Hochladen dieser Dateien auf cloudbasierte Komprimierungsdienste birgt ernsthafte Datenschutzrisiken. Toolaze verarbeitet alle Bilder lokal in Ihrem Browser und stellt sicher, dass Ihre persönlichen Daten Ihr Gerät niemals verlassen. Die gesamte Komprimierung erfolgt mit JavaScript und Canvas API ohne Server-Uploads, Wasserzeichen oder Datenspeicherung. Ihre sensiblen Dokumente bleiben während des gesamten Prozesses vollständig privat und sicher.',
      es: 'Los portales gubernamentales requieren fotos de identificación personal, escaneos de pasaporte y documentos sensibles que contienen su información biométrica. Subir estos archivos a servicios de compresión basados en la nube plantea serios riesgos de privacidad. Toolaze procesa todas las imágenes localmente en su navegador, asegurando que sus datos personales nunca abandonen su dispositivo. Toda la compresión ocurre usando JavaScript y Canvas API sin cargas de servidor, marcas de agua o almacenamiento de datos. Sus documentos sensibles permanecen completamente privados y seguros durante todo el proceso.',
      fr: 'Les portails gouvernementaux nécessitent des photos d\'identité personnelles, des scans de passeport et des documents sensibles contenant vos informations biométriques. Le téléchargement de ces fichiers vers des services de compression basés sur le cloud présente des risques sérieux pour la confidentialité. Toolaze traite toutes les images localement dans votre navigateur, garantissant que vos données personnelles ne quittent jamais votre appareil. Toute la compression se fait en utilisant JavaScript et Canvas API sans téléchargements de serveur, filigranes ou stockage de données. Vos documents sensibles restent complètement privés et sécurisés tout au long du processus.',
      it: 'I portali governativi richiedono foto d\'identità personali, scansioni di passaporto e documenti sensibili che contengono le tue informazioni biometriche. Il caricamento di questi file su servizi di compressione basati su cloud comporta seri rischi per la privacy. Toolaze elabora tutte le immagini localmente nel tuo browser, assicurando che i tuoi dati personali non lascino mai il tuo dispositivo. Tutta la compressione avviene utilizzando JavaScript e Canvas API senza caricamenti sul server, filigrane o archiviazione dei dati. I tuoi documenti sensibili rimangono completamente privati e sicuri durante l\'intero processo.',
      ja: '政府ポータルは、生体認証情報を含む個人身分証明書の写真、パスポートスキャン、機密文書を要求します。これらのファイルをクラウドベースの圧縮サービスにアップロードすることは、深刻なプライバシーリスクをもたらします。Toolazeは、すべての画像をブラウザでローカルに処理し、個人データがデバイスを離れることがないようにします。すべての圧縮は、サーバーのアップロード、透かし、またはデータストレージなしで、JavaScriptとCanvas APIを使用して行われます。機密文書は、プロセス全体を通じて完全にプライベートで安全なままです。',
      ko: '정부 포털은 생체 인식 정보를 포함하는 개인 신분증 사진, 여권 스캔 및 민감한 문서를 요구합니다. 이러한 파일을 클라우드 기반 압축 서비스에 업로드하는 것은 심각한 개인정보 보호 위험을 초래합니다. Toolaze는 모든 이미지를 브라우저에서 로컬로 처리하여 개인 데이터가 기기를 떠나지 않도록 보장합니다. 모든 압축은 서버 업로드, 워터마크 또는 데이터 저장 없이 JavaScript 및 Canvas API를 사용하여 수행됩니다. 민감한 문서는 전체 프로세스 동안 완전히 비공개 및 안전하게 유지됩니다.',
      pt: 'Portais governamentais exigem fotos de identidade pessoal, digitalizações de passaporte e documentos sensíveis que contêm suas informações biométricas. Fazer upload desses arquivos para serviços de compressão baseados em nuvem apresenta sérios riscos à privacidade. O Toolaze processa todas as imagens localmente em seu navegador, garantindo que seus dados pessoais nunca deixem seu dispositivo. Toda a compressão acontece usando JavaScript e Canvas API sem uploads de servidor, marcas d\'água ou armazenamento de dados. Seus documentos sensíveis permanecem completamente privados e seguros durante todo o processo.',
      'zh-TW': '政府網站需要包含您生物識別信息的個人身份證照片、護照掃描和敏感文件。將這些文件上傳到基於雲的壓縮服務會帶來嚴重的隱私風險。Toolaze 在您的瀏覽器中本地處理所有圖片，確保您的個人數據永遠不會離開您的設備。所有壓縮都使用 JavaScript 和 Canvas API 進行，無需服務器上傳、水印或數據存儲。您的敏感文件在整個過程中保持完全私密和安全。'
    };
    return translations[lang] || text;
  }
  
  // 通用模式：如果文本包含特定关键词，使用通用翻译
  if (text.includes('browser-based') && text.includes('Canvas API')) {
    const translations = {
      de: 'Unser browserbasierter Kompressor verarbeitet Ihre Dateien lokal mit Canvas API und gewährleistet vollständige Privatsphäre und schnelle Komprimierung, ohne Ihre Bilder auf einen Server hochzuladen.',
      es: 'Nuestro compresor basado en navegador procesa sus archivos localmente usando Canvas API, garantizando privacidad completa y compresión rápida sin subir sus imágenes a ningún servidor.',
      fr: 'Notre compresseur basé sur navigateur traite vos fichiers localement en utilisant Canvas API, garantissant une confidentialité complète et une compression rapide sans télécharger vos images sur un serveur.',
      it: 'Il nostro compressore basato su browser elabora i tuoi file localmente utilizzando Canvas API, garantendo privacy completa e compressione rapida senza caricare le tue immagini su alcun server.',
      ja: 'ブラウザベースの圧縮ツールは、Canvas APIを使用してファイルをローカルで処理し、画像をサーバーにアップロードすることなく、完全なプライバシーと高速圧縮を保証します。',
      ko: '브라우저 기반 압축기는 Canvas API를 사용하여 파일을 로컬로 처리하여 이미지를 서버에 업로드하지 않고 완전한 개인정보 보호와 빠른 압축을 보장합니다.',
      pt: 'Nosso compressor baseado em navegador processa seus arquivos localmente usando Canvas API, garantindo privacidade completa e compressão rápida sem fazer upload de suas imagens para nenhum servidor.',
      'zh-TW': '我們的瀏覽器壓縮工具使用 Canvas API 在本地處理您的檔案，確保完全的隱私和快速壓縮，無需將您的圖片上傳到任何伺服器。'
    };
    return translations[lang] || text;
  }
  
  return text;
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
  
  // 修复所有工具的intro.content[]
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.intro || !enTool.intro.content) return;
    
    const enIntro = enTool.intro;
    const langIntro = langTool.intro || {};
    
    if (!langTool.intro) {
      langTool.intro = {};
    }
    
    if (!langIntro.content) {
      langIntro.content = [];
    }
    
    const enContent = enIntro.content || [];
    const langContent = langIntro.content || [];
    
    // 确保长度匹配
    if (enContent.length !== langContent.length) {
      langIntro.content = enContent.map(item => ({
        title: introTitleTranslations[item.title]?.[lang] || item.title,
        text: translateIntroText(item.text, lang)
      }));
      langFixed += enContent.length * 2;
    } else {
      // 检查并修复每个内容项
      enContent.forEach((enItem, idx) => {
        const langItem = langContent[idx];
        if (!langItem) {
          langContent[idx] = {
            title: introTitleTranslations[enItem.title]?.[lang] || enItem.title,
            text: translateIntroText(enItem.text, lang)
          };
          langFixed += 2;
          return;
        }
        
        // 修复标题
        const translatedTitle = introTitleTranslations[enItem.title]?.[lang];
        if (translatedTitle && (!langItem.title || langItem.title === enItem.title)) {
          langItem.title = translatedTitle;
          langFixed++;
        }
        
        // 修复文本 - 如果文本与英文相同，强制翻译
        const translatedText = translateIntroText(enItem.text, lang);
        if (!langItem.text || langItem.text === enItem.text || langItem.text.length === enItem.text.length) {
          if (translatedText !== enItem.text) {
            langItem.text = translatedText;
            langFixed++;
          }
        }
      });
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} intro.content items`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} intro.content translations`);
console.log(`⚠️  Note: Some items may still need manual translation for context-specific content`);
