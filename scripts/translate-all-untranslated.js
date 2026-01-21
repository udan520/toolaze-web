const fs = require('fs')
const path = require('path')

// 所有需要翻译的内容
const translations = {
  'uscis-photo-240kb': {
    intro: {
      content: [
        null, // [0] 已翻译
        {
          // [1].text 需要翻译
          de: "Visumantragsfotos enthalten sensible biometrische Informationen, die mit äußerster Sorgfalt behandelt werden müssen. Das Hochladen dieser Fotos auf cloudbasierte Komprimierungsdienste birgt ernsthafte Datenschutz- und Sicherheitsrisiken, da Ihre biometrischen Daten von Dritten gespeichert, analysiert oder missbraucht werden könnten. Toolaze verarbeitet alle Fotos lokal in Ihrem Browser und stellt sicher, dass Ihre biometrischen Informationen Ihr Gerät niemals verlassen. Alle Komprimierung erfolgt mit JavaScript und Canvas API ohne Server-Uploads, Gesichtserkennung oder Datenspeicherung. Wir konzentrieren uns auf technische Klarheit und Dateigrößenoptimierung ohne künstliche Änderungen, Verschönerung oder KI-Verbesserungen, um sicherzustellen, dass Ihr Foto authentisch bleibt und den Regierungsstandards entspricht.",
          es: "Las fotos de solicitud de visa contienen información biométrica sensible que debe manejarse con extremo cuidado. Subir estas fotos a servicios de compresión basados en la nube plantea serios riesgos de privacidad y seguridad, ya que sus datos biométricos podrían ser almacenados, analizados o mal utilizados por terceros. Toolaze procesa todas las fotos localmente en su navegador, asegurando que su información biométrica nunca abandone su dispositivo. Toda la compresión ocurre usando JavaScript y Canvas API sin cargas al servidor, reconocimiento facial o almacenamiento de datos. Nos enfocamos en la claridad técnica y la optimización del tamaño del archivo sin alteraciones artificiales, embellecimiento o mejoras de IA, asegurando que su foto permanezca auténtica y cumpla con los estándares gubernamentales.",
          fr: "Les photos de demande de visa contiennent des informations biométriques sensibles qui doivent être traitées avec un soin extrême. Le téléchargement de ces photos vers des services de compression basés sur le cloud présente des risques sérieux pour la confidentialité et la sécurité, car vos données biométriques pourraient être stockées, analysées ou mal utilisées par des tiers. Toolaze traite toutes les photos localement dans votre navigateur, garantissant que vos informations biométriques ne quittent jamais votre appareil. Toute la compression se fait en utilisant JavaScript et Canvas API sans téléchargements serveur, reconnaissance faciale ou stockage de données. Nous nous concentrons sur la clarté technique et l'optimisation de la taille des fichiers sans altérations artificielles, embellissement ou améliorations IA, garantissant que votre photo reste authentique et conforme aux normes gouvernementales.",
          pt: "Fotos de solicitação de visto contêm informações biométricas sensíveis que devem ser tratadas com extremo cuidado. Fazer upload dessas fotos para serviços de compressão baseados em nuvem apresenta sérios riscos de privacidade e segurança, pois seus dados biométricos podem ser armazenados, analisados ou mal utilizados por terceiros. Toolaze processa todas as fotos localmente em seu navegador, garantindo que suas informações biométricas nunca saiam do seu dispositivo. Toda a compressão acontece usando JavaScript e Canvas API sem uploads de servidor, reconhecimento facial ou armazenamento de dados. Focamos em clareza técnica e otimização do tamanho do arquivo sem alterações artificiais, embelezamento ou melhorias de IA, garantindo que sua foto permaneça autêntica e em conformidade com os padrões governamentais.",
          it: "Le foto per la domanda di visto contengono informazioni biometriche sensibili che devono essere gestite con estrema cura. Il caricamento di queste foto su servizi di compressione basati su cloud presenta seri rischi per la privacy e la sicurezza, poiché i tuoi dati biometrici potrebbero essere archiviati, analizzati o utilizzati impropriamente da terze parti. Toolaze elabora tutte le foto localmente nel tuo browser, garantendo che le tue informazioni biometriche non lascino mai il tuo dispositivo. Tutta la compressione avviene utilizzando JavaScript e Canvas API senza caricamenti sul server, riconoscimento facciale o archiviazione dei dati. Ci concentriamo sulla chiarezza tecnica e sull'ottimizzazione delle dimensioni del file senza alterazioni artificiali, abbellimenti o miglioramenti dell'IA, garantendo che la tua foto rimanga autentica e conforme agli standard governativi.",
          ja: "ビザ申請写真には、極めて慎重に扱う必要がある機密性の高い生体認証情報が含まれています。これらの写真をクラウドベースの圧縮サービスにアップロードすると、生体認証データが第三者によって保存、分析、または悪用される可能性があり、深刻なプライバシーとセキュリティのリスクが生じます。Toolazeはすべての写真をブラウザでローカルに処理し、生体認証情報がデバイスを離れることがないようにします。すべての圧縮はJavaScriptとCanvas APIを使用して行われ、サーバーへのアップロード、顔認識、またはデータストレージはありません。人工的な変更、美化、またはAIの強化なしに技術的な明確さとファイルサイズの最適化に焦点を当て、写真が本物のままで政府の基準に準拠していることを保証します。",
          ko: "비자 신청 사진에는 극도로 신중하게 처리해야 하는 민감한 생체 인식 정보가 포함되어 있습니다. 이러한 사진을 클라우드 기반 압축 서비스에 업로드하면 생체 인식 데이터가 제3자에 의해 저장, 분석 또는 오용될 수 있어 심각한 개인정보 보호 및 보안 위험이 발생합니다. Toolaze는 모든 사진을 브라우저에서 로컬로 처리하여 생체 인식 정보가 기기를 떠나지 않도록 합니다. 모든 압축은 서버 업로드, 얼굴 인식 또는 데이터 저장 없이 JavaScript와 Canvas API를 사용하여 수행됩니다. 우리는 인공적인 변경, 미화 또는 AI 개선 없이 기술적 명확성과 파일 크기 최적화에 중점을 두어 사진이 진정성을 유지하고 정부 표준을 준수하도록 보장합니다.",
          'zh-TW': "簽證申請照片包含敏感的生物識別資訊，必須極其謹慎地處理。將這些照片上傳到基於雲端的壓縮服務會帶來嚴重的隱私和安全風險，因為您的生物識別數據可能會被第三方存儲、分析或濫用。Toolaze 在您的瀏覽器中本地處理所有照片，確保您的生物識別資訊永遠不會離開您的設備。所有壓縮都使用 JavaScript 和 Canvas API 進行，無需服務器上傳、面部識別或數據存儲。我們專注於技術清晰度和文件大小優化，不進行任何人工更改、美化或 AI 增強，確保您的照片保持真實並符合政府標準。"
        }
      ]
    }
  },
  'passport-photo-200kb': {
    intro: {
      content: [
        {
          title: {
            de: "Globale Passverlängerungsanforderungen",
            es: "Requisitos Globales de Renovación de Pasaporte",
            fr: "Exigences Globales de Renouvellement de Passeport",
            pt: "Requisitos Globais de Renovação de Passaporte",
            it: "Requisiti Globali di Rinnovo del Passaporto",
            ja: "グローバルパスポート更新要件",
            ko: "글로벌 여권 갱신 요구사항",
            'zh-TW': "全球護照更新要求"
          }
        },
        {
          title: {
            de: "Vollständige Privatsphäre für biometrische Daten",
            es: "Privacidad Completa para Datos Biométricos",
            fr: "Confidentialité Complète pour les Données Biométriques",
            pt: "Privacidade Completa para Dados Biométricos",
            it: "Privacy Completa per Dati Biometrici",
            ja: "生体認証データの完全なプライバシー",
            ko: "생체 인식 데이터의 완전한 개인정보 보호",
            'zh-TW': "生物識別數據的完全隱私"
          },
          text: {
            de: "Passfotos enthalten sensible biometrische Informationen, die mit äußerster Sorgfalt behandelt werden müssen. Das Hochladen dieser Fotos auf cloudbasierte Komprimierungsdienste birgt ernsthafte Datenschutz- und Sicherheitsrisiken, da Ihre biometrischen Daten von Dritten gespeichert, analysiert oder missbraucht werden könnten. Toolaze verarbeitet alle Fotos lokal in Ihrem Browser und stellt sicher, dass Ihre biometrischen Informationen Ihr Gerät niemals verlassen. Alle Komprimierung erfolgt mit JavaScript und Canvas API ohne Server-Uploads, Gesichtserkennung oder Datenspeicherung. Wir konzentrieren uns auf technische Klarheit und Dateigrößenoptimierung ohne künstliche Änderungen, Verschönerung oder KI-Verbesserungen, um sicherzustellen, dass Ihr Foto authentisch bleibt und den Regierungsstandards entspricht.",
            es: "Las fotos de pasaporte contienen información biométrica sensible que debe manejarse con extremo cuidado. Subir estas fotos a servicios de compresión basados en la nube plantea serios riesgos de privacidad y seguridad, ya que sus datos biométricos podrían ser almacenados, analizados o mal utilizados por terceros. Toolaze procesa todas las fotos localmente en su navegador, asegurando que su información biométrica nunca abandone su dispositivo. Toda la compresión ocurre usando JavaScript y Canvas API sin cargas al servidor, reconocimiento facial o almacenamiento de datos. Nos enfocamos en la claridad técnica y la optimización del tamaño del archivo sin alteraciones artificiales, embellecimiento o mejoras de IA, asegurando que su foto permanezca auténtica y cumpla con los estándares gubernamentales.",
            fr: "Les photos de passeport contiennent des informations biométriques sensibles qui doivent être traitées avec un soin extrême. Le téléchargement de ces photos vers des services de compression basés sur le cloud présente des risques sérieux pour la confidentialité et la sécurité, car vos données biométriques pourraient être stockées, analysées ou mal utilisées par des tiers. Toolaze traite toutes les photos localement dans votre navigateur, garantissant que vos informations biométriques ne quittent jamais votre appareil. Toute la compression se fait en utilisant JavaScript et Canvas API sans téléchargements serveur, reconnaissance faciale ou stockage de données. Nous nous concentrons sur la clarté technique et l'optimisation de la taille des fichiers sans altérations artificielles, embellissement ou améliorations IA, garantissant que votre photo reste authentique et conforme aux normes gouvernementales.",
            pt: "Fotos de passaporte contêm informações biométricas sensíveis que devem ser tratadas com extremo cuidado. Fazer upload dessas fotos para serviços de compressão baseados em nuvem apresenta sérios riscos de privacidade e segurança, pois seus dados biométricos podem ser armazenados, analizados ou mal utilizados por terceiros. Toolaze processa todas as fotos localmente em seu navegador, garantindo que suas informações biométricas nunca saiam do seu dispositivo. Toda a compressão acontece usando JavaScript e Canvas API sem uploads de servidor, reconhecimento facial ou armazenamento de dados. Focamos em clareza técnica e otimização do tamanho do arquivo sem alterações artificiais, embelezamento ou melhorias de IA, garantindo que sua foto permaneça autêntica e em conformidade com os padrões governamentais.",
            it: "Le foto del passaporto contengono informazioni biometriche sensibili che devono essere gestite con estrema cura. Il caricamento di queste foto su servizi di compressione basati su cloud presenta seri rischi per la privacy e la sicurezza, poiché i tuoi dati biometrici potrebbero essere archiviati, analizzati o utilizzati impropriamente da terze parti. Toolaze elabora tutte le foto localmente nel tuo browser, garantendo che le tue informazioni biometriche non lascino mai il tuo dispositivo. Tutta la compressione avviene utilizzando JavaScript e Canvas API senza caricamenti sul server, riconoscimento facciale o archiviazione dei dati. Ci concentriamo sulla chiarezza tecnica e sull'ottimizzazione delle dimensioni del file senza alterazioni artificiali, abbellimenti o miglioramenti dell'IA, garantendo che la tua foto rimanga autentica e conforme agli standard governativi.",
            ja: "パスポート写真には、極めて慎重に扱う必要がある機密性の高い生体認証情報が含まれています。これらの写真をクラウドベースの圧縮サービスにアップロードすると、生体認証データが第三者によって保存、分析、または悪用される可能性があり、深刻なプライバシーとセキュリティのリスクが生じます。Toolazeはすべての写真をブラウザでローカルに処理し、生体認証情報がデバイスを離れることがないようにします。すべての圧縮はJavaScriptとCanvas APIを使用して行われ、サーバーへのアップロード、顔認識、またはデータストレージはありません。人工的な変更、美化、またはAIの強化なしに技術的な明確さとファイルサイズの最適化に焦点を当て、写真が本物のままで政府の基準に準拠していることを保証します。",
            ko: "여권 사진에는 극도로 신중하게 처리해야 하는 민감한 생체 인식 정보가 포함되어 있습니다. 이러한 사진을 클라우드 기반 압축 서비스에 업로드하면 생체 인식 데이터가 제3자에 의해 저장, 분석 또는 오용될 수 있어 심각한 개인정보 보호 및 보안 위험이 발생합니다. Toolaze는 모든 사진을 브라우저에서 로컬로 처리하여 생체 인식 정보가 기기를 떠나지 않도록 합니다. 모든 압축은 서버 업로드, 얼굴 인식 또는 데이터 저장 없이 JavaScript와 Canvas API를 사용하여 수행됩니다. 우리는 인공적인 변경, 미화 또는 AI 개선 없이 기술적 명확성과 파일 크기 최적화에 중점을 두어 사진이 진정성을 유지하고 정부 표준을 준수하도록 보장합니다.",
            'zh-TW': "護照照片包含敏感的生物識別資訊，必須極其謹慎地處理。將這些照片上傳到基於雲端的壓縮服務會帶來嚴重的隱私和安全風險，因為您的生物識別數據可能會被第三方存儲、分析或濫用。Toolaze 在您的瀏覽器中本地處理所有照片，確保您的生物識別資訊永遠不會離開您的設備。所有壓縮都使用 JavaScript 和 Canvas API 進行，無需服務器上傳、面部識別或數據存儲。我們專注於技術清晰度和文件大小優化，不進行任何人工更改、美化或 AI 增強，確保您的照片保持真實並符合政府標準。"
          }
        }
      ]
    }
  },
  'amazon-product-10mb': {
    intro: {
      content: [
        {
          title: {
            de: "Amazon Seller Central Upload-Anforderungen",
            es: "Requisitos de Carga de Amazon Seller Central",
            fr: "Exigences de Téléchargement Amazon Seller Central",
            pt: "Requisitos de Upload do Amazon Seller Central",
            it: "Requisiti di Caricamento Amazon Seller Central",
            ja: "Amazon Seller Centralアップロード要件",
            ko: "Amazon Seller Central 업로드 요구사항",
            'zh-TW': "Amazon Seller Central 上傳要求"
          }
        },
        {
          title: {
            de: "Schützen Sie Ihr Produkt-IP und Geschäftsgeheimnisse",
            es: "Proteja su IP de Producto y Secretos Comerciales",
            fr: "Protégez votre IP Produit et Secrets Commerciaux",
            pt: "Proteja sua IP de Produto e Segredos Comerciais",
            it: "Proteggi la tua IP del Prodotto e i Segreti Commerciali",
            ja: "製品IPと企業秘密を保護",
            ko: "제품 IP 및 영업 기밀 보호",
            'zh-TW': "保護您的產品 IP 和商業機密"
          },
          text: {
            de: "Als Amazon-Verkäufer sind Ihre Produktfotos wertvolles geistiges Eigentum, das geschützt werden muss. Das Hochladen unveröffentlichter Produkte oder proprietärer Designs auf cloudbasierte Komprimierungsdienste birgt ernsthafte Sicherheitsrisiken, da Ihre Bilder von Wettbewerbern gespeichert, analysiert oder missbraucht werden könnten. Toolaze verarbeitet alle Bilder lokal in Ihrem Browser und stellt sicher, dass Ihre Produktfotos Ihr Gerät niemals verlassen. Alle Komprimierung erfolgt mit JavaScript und Canvas API ohne Server-Uploads, Wasserzeichen oder Datenspeicherung. Ihre Geschäftsgeheimnisse und Produktdesigns bleiben während des gesamten Komprimierungsprozesses vollständig privat und sicher, was es sicher für unveröffentlichte Produkte und proprietäre Informationen macht.",
            es: "Como vendedor de Amazon, sus fotos de productos son valiosa propiedad intelectual que debe protegerse. Subir productos no lanzados o diseños propietarios a servicios de compresión basados en la nube plantea serios riesgos de seguridad, ya que sus imágenes podrían ser almacenadas, analizadas o mal utilizadas por competidores. Toolaze procesa todas las imágenes localmente en su navegador, asegurando que sus fotos de productos nunca abandonen su dispositivo. Toda la compresión ocurre usando JavaScript y Canvas API sin cargas al servidor, marcas de agua o almacenamiento de datos. Sus secretos comerciales y diseños de productos permanecen completamente privados y seguros durante todo el proceso de compresión, haciéndolo seguro para productos no lanzados e información propietaria.",
            fr: "En tant que vendeur Amazon, vos photos de produits sont une propriété intellectuelle précieuse qui doit être protégée. Le téléchargement de produits non publiés ou de conceptions propriétaires vers des services de compression basés sur le cloud présente des risques de sécurité sérieux, car vos images pourraient être stockées, analysées ou mal utilisées par des concurrents. Toolaze traite toutes les images localement dans votre navigateur, garantissant que vos photos de produits ne quittent jamais votre appareil. Toute la compression se fait en utilisant JavaScript et Canvas API sans téléchargements serveur, filigranes ou stockage de données. Vos secrets commerciaux et conceptions de produits restent complètement privés et sécurisés tout au long du processus de compression, le rendant sûr pour les produits non publiés et les informations propriétaires.",
            pt: "Como vendedor da Amazon, suas fotos de produtos são propriedade intelectual valiosa que deve ser protegida. Fazer upload de produtos não lançados ou designs proprietários para serviços de compressão baseados em nuvem apresenta sérios riscos de segurança, pois suas imagens podem ser armazenadas, analisadas ou mal utilizadas por concorrentes. Toolaze processa todas as imagens localmente em seu navegador, garantindo que suas fotos de produtos nunca saiam do seu dispositivo. Toda a compressão acontece usando JavaScript e Canvas API sem uploads de servidor, marcas d'água ou armazenamento de dados. Seus segredos comerciais e designs de produtos permanecem completamente privados e seguros durante todo o processo de compressão, tornando-o seguro para produtos não lançados e informações proprietárias.",
            it: "Come venditore Amazon, le tue foto di prodotti sono preziosa proprietà intellettuale che deve essere protetta. Il caricamento di prodotti non pubblicati o design proprietari su servizi di compressione basati su cloud presenta seri rischi per la sicurezza, poiché le tue immagini potrebbero essere archiviate, analizzate o utilizzate impropriamente dai concorrenti. Toolaze elabora tutte le immagini localmente nel tuo browser, garantendo che le tue foto di prodotti non lascino mai il tuo dispositivo. Tutta la compressione avviene utilizzando JavaScript e Canvas API senza caricamenti sul server, filigrane o archiviazione dei dati. I tuoi segreti commerciali e i design dei prodotti rimangono completamente privati e sicuri durante l'intero processo di compressione, rendendolo sicuro per prodotti non pubblicati e informazioni proprietarie.",
            ja: "Amazonの販売者として、製品写真は保護すべき貴重な知的財産です。未公開製品や独自のデザインをクラウドベースの圧縮サービスにアップロードすると、画像が競合他社によって保存、分析、または悪用される可能性があり、深刻なセキュリティリスクが生じます。Toolazeはすべての画像をブラウザでローカルに処理し、製品写真がデバイスを離れることがないようにします。すべての圧縮はJavaScriptとCanvas APIを使用して行われ、サーバーへのアップロード、透かし、またはデータストレージはありません。営業秘密と製品デザインは圧縮プロセス全体を通じて完全にプライベートで安全に保たれ、未公開製品や独自情報に安全です。",
            ko: "Amazon 판매자로서 제품 사진은 보호해야 할 귀중한 지적 재산입니다. 미출시 제품이나 독점 디자인을 클라우드 기반 압축 서비스에 업로드하면 이미지가 경쟁자에 의해 저장, 분석 또는 오용될 수 있어 심각한 보안 위험이 발생합니다. Toolaze는 모든 이미지를 브라우저에서 로컬로 처리하여 제품 사진이 기기를 떠나지 않도록 합니다. 모든 압축은 서버 업로드, 워터마크 또는 데이터 저장 없이 JavaScript와 Canvas API를 사용하여 수행됩니다. 영업 기밀과 제품 디자인은 압축 프로세스 전체를 통해 완전히 비공개이고 안전하게 유지되며, 미출시 제품 및 독점 정보에 안전합니다.",
            'zh-TW': "作為 Amazon 賣家，您的產品照片是必須保護的寶貴知識產權。將未發布的產品或專有設計上傳到基於雲端的壓縮服務會帶來嚴重的安全風險，因為您的圖像可能會被競爭對手存儲、分析或濫用。Toolaze 在您的瀏覽器中本地處理所有圖像，確保您的產品照片永遠不會離開您的設備。所有壓縮都使用 JavaScript 和 Canvas API 進行，無需服務器上傳、水印或數據存儲。您的商業機密和產品設計在整個壓縮過程中保持完全私密和安全，對未發布的產品和專有資訊是安全的。"
          }
        }
      ]
    }
  },
  'youtube-thumbnail-2mb': {
    intro: {
      content: [
        {
          title: {
            de: "Die 2MB-Grenze von YouTube",
            es: "El Desafío del Límite de 2MB de YouTube",
            fr: "Le Défi de la Limite de 2MB de YouTube",
            pt: "O Desafio do Limite de 2MB do YouTube",
            it: "La Sfida del Limite di 2MB di YouTube",
            ja: "YouTubeの2MB制限の課題",
            ko: "YouTube의 2MB 제한 과제",
            'zh-TW': "YouTube 的 2MB 限制挑戰"
          }
        },
        {
          title: {
            de: "Klickraten beibehalten",
            es: "Mantener las Tasas de Clic",
            fr: "Maintenir les Taux de Clic",
            pt: "Manter as Taxas de Clique",
            it: "Mantenere i Tassi di Click",
            ja: "クリック率を維持",
            ko: "클릭률 유지",
            'zh-TW': "維持點擊率"
          },
          text: {
            de: "Ein großartiges Thumbnail ist entscheidend für den YouTube-Erfolg—es ist das Erste, was Zuschauer sehen, und beeinflusst direkt Ihre Klickrate (CTR). Das Komprimieren von Thumbnails sollte nicht bedeuten, Qualität zu opfern oder die Auflösung zu reduzieren. Toolaze erhält Textklarheit, Gesichtsdetails und lebendige Farben bei, während unsichtbare Daten intelligent entfernt werden, um Sie unter die 2MB-Barriere zu bringen. Alle Verarbeitung erfolgt lokal in Ihrem Browser, sodass Ihre Thumbnail-Designs privat und sicher bleiben, ohne Wasserzeichen oder Qualitätsverschlechterung.",
            es: "Una gran miniatura es crucial para el éxito en YouTube—es lo primero que ven los espectadores e impacta directamente tu tasa de clics (CTR). Comprimir miniaturas no debería significar sacrificar calidad o reducir la resolución. Toolaze preserva la claridad del texto, los detalles faciales y los colores vibrantes mientras elimina inteligentemente datos invisibles para mantenerte bajo la barrera de 2MB. Todo el procesamiento ocurre localmente en tu navegador, asegurando que tus diseños de miniaturas permanezcan privados y seguros sin marcas de agua o degradación de calidad.",
            fr: "Une excellente miniature est cruciale pour le succès sur YouTube—c'est la première chose que voient les spectateurs et cela impacte directement votre taux de clics (CTR). Compresser les miniatures ne devrait pas signifier sacrifier la qualité ou réduire la résolution. Toolaze préserve la clarté du texte, les détails faciaux et les couleurs vibrantes tout en supprimant intelligemment les données invisibles pour vous maintenir sous la barrière de 2MB. Tout le traitement se fait localement dans votre navigateur, garantissant que vos conceptions de miniatures restent privées et sécurisées sans filigranes ou dégradation de qualité.",
            pt: "Uma ótima miniatura é crucial para o sucesso no YouTube—é a primeira coisa que os espectadores veem e impacta diretamente sua taxa de cliques (CTR). Comprimir miniaturas não deve significar sacrificar qualidade ou reduzir a resolução. Toolaze preserva a clareza do texto, detalhes faciais e cores vibrantes enquanto remove inteligentemente dados invisíveis para mantê-lo abaixo da barreira de 2MB. Todo o processamento acontece localmente em seu navegador, garantindo que seus designs de miniatura permaneçam privados e seguros sem marcas d'água ou degradação de qualidade.",
            it: "Una grande miniatura è cruciale per il successo su YouTube—è la prima cosa che vedono gli spettatori e impatta direttamente il tuo tasso di clic (CTR). Comprimere le miniature non dovrebbe significare sacrificare la qualità o ridurre la risoluzione. Toolaze preserva la chiarezza del testo, i dettagli facciali e i colori vibranti mentre rimuove intelligentemente i dati invisibili per mantenerti sotto la barriera di 2MB. Tutta l'elaborazione avviene localmente nel tuo browser, garantendo che i tuoi design delle miniature rimangano privati e sicuri senza filigrane o degrado della qualità.",
            ja: "優れたサムネイルはYouTubeの成功に不可欠です—視聴者が最初に見るもので、クリック率（CTR）に直接影響します。サムネイルの圧縮は、品質を犠牲にしたり解像度を下げたりすることを意味するべきではありません。Toolazeは、テキストの明瞭さ、顔の詳細、鮮やかな色を保持しながら、2MBの障壁を下回るように見えないデータをインテリジェントに削除します。すべての処理はブラウザでローカルに実行されるため、透かしや品質の劣化なしにサムネイルデザインがプライベートで安全に保たれます。",
            ko: "훌륭한 썸네일은 YouTube 성공에 필수적입니다—시청자가 처음 보는 것이며 클릭률(CTR)에 직접적인 영향을 미칩니다. 썸네일 압축은 품질을 희생하거나 해상도를 낮추는 것을 의미하지 않아야 합니다. Toolaze는 텍스트 명확성, 얼굴 세부 사항 및 생생한 색상을 유지하면서 2MB 장벽 아래로 유지하기 위해 보이지 않는 데이터를 지능적으로 제거합니다. 모든 처리는 브라우저에서 로컬로 수행되므로 워터마크나 품질 저하 없이 썸네일 디자인이 비공개이고 안전하게 유지됩니다.",
            'zh-TW': "出色的縮圖對 YouTube 成功至關重要—這是觀眾首先看到的內容，並直接影響您的點擊率 (CTR)。壓縮縮圖不應該意味著犧牲品質或降低解析度。Toolaze 保持文字清晰度、面部細節和鮮豔色彩，同時智能地移除不可見的數據以保持在 2MB 限制以下。所有處理都在您的瀏覽器中本地進行，確保您的縮圖設計保持私密和安全，無水印或品質下降。"
          }
        }
      ]
    }
  },
  'discord-emoji-256kb': {
    intro: {
      content: [
        {
          title: {
            de: "Die strenge 256KB-Dateigrößengrenze von Discord",
            es: "El Límite Estricto de Tamaño de Archivo de 256KB de Discord",
            fr: "La Limite Stricte de Taille de Fichier de 256KB de Discord",
            pt: "O Limite Rigoroso de Tamanho de Arquivo de 256KB do Discord",
            it: "Il Limite Rigoroso di Dimensione File di 256KB di Discord",
            ja: "Discordの厳格な256KBファイルサイズ制限",
            ko: "Discord의 엄격한 256KB 파일 크기 제한",
            'zh-TW': "Discord 的嚴格 256KB 檔案大小限制"
          }
        },
        {
          title: {
            de: "Transparenz für benutzerdefinierte Server-Emotes erhalten",
            es: "Preservar la Transparencia para Emotes Personalizados del Servidor",
            fr: "Préserver la Transparence pour les Emotes Personnalisés du Serveur",
            pt: "Preservar a Transparência para Emotes Personalizados do Servidor",
            it: "Preservare la Trasparenza per Emote Personalizzate del Server",
            ja: "カスタムサーバー絵文字の透明度を保持",
            ko: "사용자 정의 서버 이모티콘의 투명도 유지",
            'zh-TW': "保留自訂伺服器表情符號的透明度"
          },
          text: {
            de: "Benutzerdefinierte Discord-Emojis erfordern oft transparente Hintergründe, um sich nahtlos mit Discord's Oberfläche zu verbinden und im Chat professionell auszusehen. Das Konvertieren von PNG-Emojis zu JPG, um die Dateigröße zu reduzieren, zerstört diese Transparenz und zwingt Sie, solide Hintergründe zu verwenden, die unprofessionell aussehen. Unser Komprimierungsalgorithmus behält den Alpha-Kanal während des gesamten Prozesses bei und stellt sicher, dass Ihre transparenten Hintergründe perfekt klar bleiben und Ihre benutzerdefinierten Emotes scharf bleiben. Alle Verarbeitung erfolgt lokal in Ihrem Browser, sodass Ihre Emoji-Designs Ihr Gerät niemals verlassen und vollständig privat und sicher bleiben.",
            es: "Los emojis personalizados de Discord a menudo requieren fondos transparentes para integrarse perfectamente con la interfaz de Discord y verse profesionales en el chat. Convertir emojis PNG a JPG para reducir el tamaño del archivo destruye esta transparencia, obligándote a usar fondos sólidos que se ven poco profesionales. Nuestro algoritmo de compresión mantiene el canal Alpha durante todo el proceso, asegurando que tus fondos transparentes permanezcan perfectamente claros y tus emotes personalizados se mantengan nítidos. Todo el procesamiento ocurre localmente en tu navegador, por lo que tus diseños de emoji nunca abandonan tu dispositivo y permanecen completamente privados y seguros.",
            fr: "Les emojis Discord personnalisés nécessitent souvent des arrière-plans transparents pour s'intégrer parfaitement à l'interface Discord et avoir un aspect professionnel dans le chat. Convertir les emojis PNG en JPG pour réduire la taille du fichier détruit cette transparence, vous obligeant à utiliser des arrière-plans solides qui semblent peu professionnels. Notre algorithme de compression maintient le canal Alpha tout au long du processus, garantissant que vos arrière-plans transparents restent parfaitement clairs et que vos emotes personnalisés restent nets. Tout le traitement se fait localement dans votre navigateur, donc vos conceptions d'emoji ne quittent jamais votre appareil et restent complètement privées et sécurisées.",
            pt: "Emojis personalizados do Discord frequentemente requerem fundos transparentes para se integrar perfeitamente com a interface do Discord e parecer profissionais no chat. Converter emojis PNG para JPG para reduzir o tamanho do arquivo destrói essa transparência, forçando você a usar fundos sólidos que parecem pouco profissionais. Nosso algoritmo de compressão mantém o canal Alpha durante todo o processo, garantindo que seus fundos transparentes permaneçam perfeitamente claros e seus emotes personalizados permaneçam nítidos. Todo o processamento acontece localmente em seu navegador, então seus designs de emoji nunca saem do seu dispositivo e permanecem completamente privados e seguros.",
            it: "Le emoji personalizzate di Discord spesso richiedono sfondi trasparenti per integrarsi perfettamente con l'interfaccia di Discord e apparire professionali nella chat. Convertire emoji PNG in JPG per ridurre le dimensioni del file distrugge questa trasparenza, costringendoti a usare sfondi solidi che sembrano poco professionali. Il nostro algoritmo di compressione mantiene il canale Alpha durante tutto il processo, garantendo che i tuoi sfondi trasparenti rimangano perfettamente chiari e le tue emote personalizzate rimangano nitide. Tutta l'elaborazione avviene localmente nel tuo browser, quindi i tuoi design di emoji non lasciano mai il tuo dispositivo e rimangono completamente privati e sicuri.",
            ja: "カスタムDiscord絵文字は、Discordのインターフェースとシームレスに融合し、チャットでプロフェッショナルに見えるように、透明な背景が必要な場合がよくあります。ファイルサイズを減らすためにPNG絵文字をJPGに変換すると、この透明度が破壊され、プロフェッショナルに見えない単色の背景を使用することを余儀なくされます。当社の圧縮アルゴリズムは、プロセス全体を通じてアルファチャネルを維持し、透明な背景が完全にクリアに保たれ、カスタム絵文字が鮮明に保たれるようにします。すべての処理はブラウザでローカルに実行されるため、絵文字デザインがデバイスを離れることはなく、完全にプライベートで安全に保たれます。",
            ko: "사용자 정의 Discord 이모티콘은 종종 Discord 인터페이스와 완벽하게 통합되고 채팅에서 전문적으로 보이기 위해 투명한 배경이 필요합니다. 파일 크기를 줄이기 위해 PNG 이모티콘을 JPG로 변환하면 이 투명도가 파괴되어 전문적이지 않은 단색 배경을 사용해야 합니다. 당사의 압축 알고리즘은 프로세스 전체에 걸쳐 알파 채널을 유지하여 투명한 배경이 완벽하게 명확하게 유지되고 사용자 정의 이모티콘이 선명하게 유지되도록 합니다. 모든 처리는 브라우저에서 로컬로 수행되므로 이모티콘 디자인이 기기를 떠나지 않으며 완전히 비공개이고 안전하게 유지됩니다.",
            'zh-TW': "自訂 Discord 表情符號通常需要透明背景才能與 Discord 介面無縫融合，並在聊天中看起來專業。將 PNG 表情符號轉換為 JPG 以減小檔案大小會破壞這種透明度，迫使您使用看起來不專業的實心背景。我們的壓縮演算法在整個過程中保持 Alpha 通道，確保您的透明背景保持完全清晰，您的自訂表情符號保持清晰。所有處理都在您的瀏覽器中本地進行，因此您的表情符號設計永遠不會離開您的設備，並保持完全私密和安全。"
          }
        }
      ]
    }
  },
  'email-signature-20kb': {
    intro: {
      content: [
        {
          title: {
            de: "Spam-Filter verhindern und Zustellbarkeit verbessern",
            es: "Prevenir Filtros de Spam y Mejorar la Entregabilidad",
            fr: "Prévenir les Filtres Anti-Spam et Améliorer la Livrabilité",
            pt: "Prevenir Filtros de Spam e Melhorar a Entregabilidade",
            it: "Prevenire i Filtri Spam e Migliorare la Recapitazione",
            ja: "スパムフィルターを防ぎ、配信性を向上",
            ko: "스팸 필터 방지 및 전달성 향상",
            'zh-TW': "防止垃圾郵件過濾器並提高送達率"
          }
        },
        {
          title: {
            de: "Professionelles Erscheinungsbild auf allen Geräten",
            es: "Apariencia Profesional en Todos los Dispositivos",
            fr: "Apparence Professionnelle sur Tous les Appareils",
            pt: "Aparência Profissional em Todos os Dispositivos",
            it: "Aspetto Professionale su Tutti i Dispositivi",
            ja: "すべてのデバイスでのプロフェッショナルな外観",
            ko: "모든 기기에서 전문적인 외관",
            'zh-TW': "在所有設備上的專業外觀"
          },
          text: {
            de: "Eine schwere E-Mail-Signatur ist unprofessionell und verbraucht mobile Daten für die Empfänger. Wenn Ihre Signaturbilder zu groß sind, laden sie langsam auf langsamen Verbindungen, was einen schlechten Eindruck erweckt und möglicherweise dazu führt, dass Empfänger Ihre E-Mail löschen, bevor sie sie lesen. Toolaze verkleinert Ihr Firmenlogo und Ihr Porträtfoto, sodass sie auch auf 3G-Netzwerken sofort laden und Ihre E-Mails scharf und professionell aussehen lassen. Wir optimieren speziell für Retina-Displays und hochauflösende Bildschirme und stellen sicher, dass Ihr Logo und Ihr Porträtfoto auch bei kleinen Dateigrößen scharf und klar bleiben. Alle Verarbeitung erfolgt lokal in Ihrem Browser, sodass Ihre Unternehmensbranding-Assets Ihr Gerät niemals verlassen und vollständig privat und sicher bleiben.",
            es: "Una firma de correo electrónico pesada es poco profesional y consume datos móviles para los destinatarios. Cuando tus imágenes de firma son demasiado grandes, cargan lentamente en conexiones lentas, creando una mala impresión y potencialmente causando que los destinatarios eliminen tu correo antes de leerlo. Toolaze reduce tu logotipo de empresa y foto de perfil para que carguen instantáneamente incluso en redes 3G, manteniendo tus correos electrónicos nítidos y profesionales. Optimizamos específicamente para pantallas Retina y pantallas de alta resolución, asegurando que tu logotipo y foto de perfil permanezcan nítidos y claros incluso en tamaños de archivo pequeños. Todo el procesamiento ocurre localmente en tu navegador, por lo que tus activos de marca corporativa nunca abandonan tu dispositivo y permanecen completamente privados y seguros.",
            fr: "Une signature électronique lourde est peu professionnelle et consomme des données mobiles pour les destinataires. Lorsque vos images de signature sont trop grandes, elles chargent lentement sur les connexions lentes, créant une mauvaise impression et pouvant amener les destinataires à supprimer votre e-mail avant de le lire. Toolaze réduit votre logo d'entreprise et photo de profil pour qu'ils chargent instantanément même sur les réseaux 3G, gardant vos e-mails nets et professionnels. Nous optimisons spécifiquement pour les écrans Retina et les écrans haute résolution, garantissant que votre logo et photo de profil restent nets et clairs même à de petites tailles de fichier. Tout le traitement se fait localement dans votre navigateur, donc vos actifs de marque d'entreprise ne quittent jamais votre appareil et restent complètement privés et sécurisés.",
            pt: "Uma assinatura de e-mail pesada é pouco profissional e consome dados móveis para os destinatários. Quando suas imagens de assinatura são muito grandes, carregam lentamente em conexões lentas, criando uma má impressão e potencialmente fazendo com que os destinatários excluam seu e-mail antes de lê-lo. Toolaze reduz seu logotipo da empresa e foto de perfil para que carreguem instantaneamente mesmo em redes 3G, mantendo seus e-mails nítidos e profissionais. Otimizamos especificamente para telas Retina e telas de alta resolução, garantindo que seu logotipo e foto de perfil permaneçam nítidos e claros mesmo em tamanhos de arquivo pequenos. Todo o processamento acontece localmente em seu navegador, então seus ativos de marca corporativa nunca saem do seu dispositivo e permanecem completamente privados e seguros.",
            it: "Una firma email pesante è poco professionale e consuma dati mobili per i destinatari. Quando le tue immagini della firma sono troppo grandi, caricano lentamente su connessioni lente, creando una cattiva impressione e potenzialmente causando che i destinatari eliminino la tua email prima di leggerla. Toolaze riduce il tuo logo aziendale e foto del profilo in modo che carichino istantaneamente anche su reti 3G, mantenendo le tue email nitide e professionali. Ottimizziamo specificamente per display Retina e schermi ad alta risoluzione, garantendo che il tuo logo e foto del profilo rimangano nitidi e chiari anche a piccole dimensioni di file. Tutta l'elaborazione avviene localmente nel tuo browser, quindi i tuoi asset di branding aziendale non lasciano mai il tuo dispositivo e rimangono completamente privati e sicuri.",
            ja: "重いメール署名は専門的ではなく、受信者のモバイルデータを消費します。署名画像が大きすぎると、低速接続で遅く読み込まれ、悪い印象を与え、受信者がメールを読む前に削除する可能性があります。Toolazeは会社のロゴとプロフィール写真を縮小して、3Gネットワークでも即座に読み込めるようにし、メールを鮮明で専門的に保ちます。Retinaディスプレイや高解像度画面に特に最適化し、小さなファイルサイズでもロゴとプロフィール写真が鮮明で明確に保たれるようにします。すべての処理はブラウザでローカルに実行されるため、企業ブランディングアセットがデバイスを離れることはなく、完全にプライベートで安全に保たれます。",
            ko: "무거운 이메일 서명은 전문적이지 않으며 수신자의 모바일 데이터를 소비합니다. 서명 이미지가 너무 크면 느린 연결에서 느리게 로드되어 나쁜 인상을 만들고 수신자가 읽기 전에 이메일을 삭제할 수 있습니다. Toolaze는 회사 로고와 프로필 사진을 축소하여 3G 네트워크에서도 즉시 로드되도록 하여 이메일을 선명하고 전문적으로 유지합니다. Retina 디스플레이 및 고해상도 화면에 특히 최적화하여 작은 파일 크기에서도 로고와 프로필 사진이 선명하고 명확하게 유지되도록 합니다. 모든 처리는 브라우저에서 로컬로 수행되므로 기업 브랜딩 자산이 기기를 떠나지 않으며 완전히 비공개이고 안전하게 유지됩니다.",
            'zh-TW': "沉重的電子郵件簽名不專業，並且會消耗收件人的行動數據。當您的簽名圖像太大時，它們在慢速連接上加載緩慢，造成不良印象，並可能導致收件人在閱讀之前刪除您的電子郵件。Toolaze 縮小您的公司標誌和個人資料照片，使它們即使在 3G 網絡上也能立即加載，保持您的電子郵件清晰專業。我們專門針對 Retina 顯示器和高解析度螢幕進行優化，確保您的標誌和個人資料照片即使在小的檔案大小下也保持清晰。所有處理都在您的瀏覽器中本地進行，因此您的企業品牌資產永遠不會離開您的設備，並保持完全私密和安全。"
          }
        }
      ]
    }
  },
  'compress-webp': {
    intro: {
      content: [
        {
          title: {
            de: "Vorteile der WebP-Komprimierung",
            es: "Beneficios de la Compresión WebP",
            fr: "Avantages de la Compression WebP",
            pt: "Benefícios da Compressão WebP",
            it: "Vantaggi della Compressione WebP",
            ja: "WebP圧縮の利点",
            ko: "WebP 압축의 이점",
            'zh-TW': "WebP 壓縮的優勢"
          }
        },
        {
          title: {
            de: "Wann WebP komprimieren",
            es: "Cuándo Comprimir WebP",
            fr: "Quand Compresser WebP",
            pt: "Quando Comprimir WebP",
            it: "Quando Comprimere WebP",
            ja: "WebPを圧縮するタイミング",
            ko: "WebP 압축 시기",
            'zh-TW': "何時壓縮 WebP"
          }
        }
      ]
    }
  }
}

async function main() {
  const languages = ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']
  
  for (const pageKey of Object.keys(translations)) {
    console.log(`\n处理页面: ${pageKey}`)
    
    for (const lang of languages) {
      const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
      if (!fs.existsSync(filePath)) continue
      
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      if (!data[pageKey]) continue
      
      const pageData = data[pageKey]
      const pageTranslations = translations[pageKey]
      
      // 更新 intro.content
      if (pageTranslations.intro && pageTranslations.intro.content) {
        pageTranslations.intro.content.forEach((item, index) => {
          if (!item) return
          
          if (!pageData.intro || !pageData.intro.content || !pageData.intro.content[index]) return
          
          // 处理 title
          if (item.title && item.title[lang]) {
            pageData.intro.content[index].title = item.title[lang]
          }
          
          // 处理 text - 支持两种数据结构
          if (item.text) {
            if (typeof item.text === 'object' && item.text[lang]) {
              // 结构: { text: { de: "...", es: "..." } }
              pageData.intro.content[index].text = item.text[lang]
            } else if (typeof item.text === 'string' && item.text.length > 50) {
              // 直接是字符串（已翻译）
              pageData.intro.content[index].text = item.text
            }
          }
          
          // 处理直接的语言键（向后兼容）
          if (item[lang] && typeof item[lang] === 'string' && item[lang].length > 50) {
            pageData.intro.content[index].text = item[lang]
          }
        })
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
      console.log(`  ✅ ${lang}: 已更新`)
    }
  }
  
  console.log('\n✨ 第一批翻译完成!')
}

main().catch(console.error)
