const fs = require('fs')
const path = require('path')

// FAQ 翻译映射
const faqTranslations = {
  de: [
    {
      q: "Unterstützt es JPG-Format für Etsy-Listings?",
      a: "Ja! Etsy bevorzugt JPG-Format für Listing-Fotos, und Toolaze optimiert sie perfekt. JPG-Format bietet die beste Balance zwischen Dateigröße und Bildqualität für Etsys Plattform."
    },
    {
      q: "Warum ist 1MB die empfohlene Größe für Etsy?",
      a: "Etsy empfiehlt Bilder unter 1MB, weil größere Dateien das Laden des Shops verlangsamen, besonders auf mobilen Geräten. Dateien über 1MB werden möglicherweise nicht ordnungsgemäß hochgeladen oder laden sehr langsam für Käufer, was eine schlechte Einkaufserfahrung schafft und möglicherweise Ihre Suchrankings beeinträchtigt."
    },
    {
      q: "Werden meine Produktfarben nach der Komprimierung ausgewaschen aussehen?",
      a: "Nein! Toolazes Komprimierungsalgorithmus ist speziell darauf ausgelegt, lebendige Farben und Texturen zu erhalten. Die Komprimierung konzentriert sich darauf, die Bildstruktur zu optimieren, anstatt die Farbqualität zu reduzieren, und stellt sicher, dass Ihre handgefertigten Produkte am besten aussehen."
    },
    {
      q: "Kann ich mehrere Listing-Bilder gleichzeitig verarbeiten?",
      a: "Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Listing-Bildern gleichzeitig. Perfekt für die Optimierung gesamter Produktkataloge oder Bulk-Shop-Updates effizient."
    },
    {
      q: "Werden meine Produktfotos auf einen Server hochgeladen?",
      a: "Nein! Alle Komprimierung erfolgt lokal in Ihrem Browser mit JavaScript und Canvas API. Ihre Produktfotos und Designs verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre und Sicherheit für Ihre kreative Arbeit."
    },
    {
      q: "Verbessern optimierte Bilder meine Etsy-Suchrankings?",
      a: "Ja. Schneller ladende Shops schneiden besser in Etsys Suchalgorithmus ab. Optimierte Bilder verbessern die Ladegeschwindigkeit Ihres Shops, was Ihre Suchrankings steigern und das Käuferengagement erhöhen kann, was möglicherweise zu mehr Verkäufen führt."
    }
  ],
  es: [
    {
      q: "¿Admite formato JPG para listados de Etsy?",
      a: "¡Sí! Etsy prefiere formato JPG para fotos de listado, y Toolaze las optimiza perfectamente. El formato JPG proporciona el mejor equilibrio entre tamaño de archivo y calidad de imagen para la plataforma de Etsy."
    },
    {
      q: "¿Por qué 1MB es el tamaño recomendado para Etsy?",
      a: "Etsy recomienda imágenes bajo 1MB porque archivos más grandes ralentizan la carga de la tienda, especialmente en dispositivos móviles. Los archivos sobre 1MB pueden no cargarse correctamente o cargarse muy lentamente para los compradores, creando una mala experiencia de compra y potencialmente dañando sus rankings de búsqueda."
    },
    {
      q: "¿Se verán descoloridos los colores de mi producto después de la compresión?",
      a: "¡No! El algoritmo de compresión de Toolaze está específicamente ajustado para preservar colores vibrantes y texturas. La compresión se enfoca en optimizar la estructura de la imagen en lugar de reducir la calidad del color, asegurando que sus productos hechos a mano se vean mejor."
    },
    {
      q: "¿Puedo procesar múltiples imágenes de listado a la vez?",
      a: "¡Sí! Toolaze admite procesamiento por lotes de hasta 100 imágenes de listado simultáneamente. Perfecto para optimizar catálogos de productos completos o actualizaciones masivas de tienda de manera eficiente."
    },
    {
      q: "¿Se suben mis fotos de producto a un servidor?",
      a: "¡No! Toda la compresión ocurre localmente en su navegador usando JavaScript y Canvas API. Sus fotos de producto y diseños nunca abandonan su dispositivo, garantizando privacidad y seguridad completas para su trabajo creativo."
    },
    {
      q: "¿Las imágenes optimizadas mejorarán mis rankings de búsqueda de Etsy?",
      a: "Sí. Las tiendas que cargan más rápido tienen mejor rendimiento en el algoritmo de búsqueda de Etsy. Las imágenes optimizadas mejoran la velocidad de carga de su tienda, lo que puede aumentar sus rankings de búsqueda y aumentar el compromiso del comprador, potencialmente llevando a más ventas."
    }
  ],
  fr: [
    {
      q: "Prend-il en charge le format JPG pour les annonces Etsy?",
      a: "Oui! Etsy préfère le format JPG pour les photos d'annonces, et Toolaze les optimise parfaitement. Le format JPG offre le meilleur équilibre entre la taille du fichier et la qualité de l'image pour la plateforme Etsy."
    },
    {
      q: "Pourquoi 1MB est la taille recommandée pour Etsy?",
      a: "Etsy recommande des images sous 1MB car les fichiers plus volumineux ralentissent le chargement de la boutique, surtout sur les appareils mobiles. Les fichiers de plus de 1MB peuvent ne pas se télécharger correctement ou se charger très lentement pour les acheteurs, créant une mauvaise expérience d'achat et potentiellement nuisant à vos classements de recherche."
    },
    {
      q: "Mes couleurs de produit sembleront-elles délavées après compression?",
      a: "Non! L'algorithme de compression de Toolaze est spécifiquement réglé pour préserver les couleurs vives et les textures. La compression se concentre sur l'optimisation de la structure de l'image plutôt que sur la réduction de la qualité des couleurs, garantissant que vos produits faits à la main ont la meilleure apparence."
    },
    {
      q: "Puis-je traiter plusieurs images d'annonces à la fois?",
      a: "Oui! Toolaze prend en charge le traitement par lots de jusqu'à 100 images d'annonces simultanément. Parfait pour optimiser des catalogues de produits entiers ou des mises à jour de boutique en masse efficacement."
    },
    {
      q: "Mes photos de produit sont-elles téléchargées sur un serveur?",
      a: "Non! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos photos de produit et designs ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes pour votre travail créatif."
    },
    {
      q: "Les images optimisées amélioreront-elles mes classements de recherche Etsy?",
      a: "Oui. Les boutiques qui chargent plus rapidement fonctionnent mieux dans l'algorithme de recherche d'Etsy. Les images optimisées améliorent la vitesse de chargement de votre boutique, ce qui peut augmenter vos classements de recherche et augmenter l'engagement des acheteurs, menant potentiellement à plus de ventes."
    }
  ],
  pt: [
    {
      q: "Ele suporta formato JPG para listagens do Etsy?",
      a: "Sim! O Etsy prefere formato JPG para fotos de listagem, e o Toolaze as otimiza perfeitamente. O formato JPG fornece o melhor equilíbrio entre tamanho de arquivo e qualidade de imagem para a plataforma do Etsy."
    },
    {
      q: "Por que 1MB é o tamanho recomendado para o Etsy?",
      a: "O Etsy recomenda imagens abaixo de 1MB porque arquivos maiores retardam o carregamento da loja, especialmente em dispositivos móveis. Arquivos acima de 1MB podem não fazer upload corretamente ou carregar muito lentamente para compradores, criando uma experiência de compra ruim e potencialmente prejudicando seus rankings de pesquisa."
    },
    {
      q: "As cores do meu produto ficarão desbotadas após a compressão?",
      a: "Não! O algoritmo de compressão do Toolaze é especificamente ajustado para preservar cores vibrantes e texturas. A compressão se concentra em otimizar a estrutura da imagem em vez de reduzir a qualidade da cor, garantindo que seus produtos feitos à mão tenham a melhor aparência."
    },
    {
      q: "Posso processar várias imagens de listagem de uma vez?",
      a: "Sim! O Toolaze suporta processamento em lote de até 100 imagens de listagem simultaneamente. Perfeito para otimizar catálogos de produtos inteiros ou atualizações em massa de loja de forma eficiente."
    },
    {
      q: "Minhas fotos de produto são enviadas para um servidor?",
      a: "Não! Toda a compressão acontece localmente em seu navegador usando JavaScript e Canvas API. Suas fotos de produto e designs nunca deixam seu dispositivo, garantindo privacidade e segurança completas para seu trabalho criativo."
    },
    {
      q: "Imagens otimizadas melhorarão meus rankings de pesquisa do Etsy?",
      a: "Sim. Lojas que carregam mais rápido têm melhor desempenho no algoritmo de pesquisa do Etsy. Imagens otimizadas melhoram a velocidade de carregamento da sua loja, o que pode aumentar seus rankings de pesquisa e aumentar o engajamento do comprador, potencialmente levando a mais vendas."
    }
  ],
  it: [
    {
      q: "Supporta il formato JPG per gli annunci Etsy?",
      a: "Sì! Etsy preferisce il formato JPG per le foto degli annunci, e Toolaze le ottimizza perfettamente. Il formato JPG fornisce il miglior equilibrio tra dimensione del file e qualità dell'immagine per la piattaforma Etsy."
    },
    {
      q: "Perché 1MB è la dimensione raccomandata per Etsy?",
      a: "Etsy raccomanda immagini sotto 1MB perché file più grandi rallentano il caricamento del negozio, specialmente sui dispositivi mobili. File sopra 1MB potrebbero non caricarsi correttamente o caricarsi molto lentamente per gli acquirenti, creando una scarsa esperienza di acquisto e potenzialmente danneggiando le tue classifiche di ricerca."
    },
    {
      q: "I colori del mio prodotto sembreranno sbiaditi dopo la compressione?",
      a: "No! L'algoritmo di compressione di Toolaze è specificamente sintonizzato per preservare colori vivaci e texture. La compressione si concentra sull'ottimizzazione della struttura dell'immagine piuttosto che sulla riduzione della qualità del colore, garantendo che i tuoi prodotti fatti a mano abbiano il miglior aspetto."
    },
    {
      q: "Posso elaborare più immagini di annunci contemporaneamente?",
      a: "Sì! Toolaze supporta l'elaborazione batch di fino a 100 immagini di annunci contemporaneamente. Perfetto per ottimizzare interi cataloghi di prodotti o aggiornamenti di negozio in blocco in modo efficiente."
    },
    {
      q: "Le mie foto di prodotto vengono caricate su un server?",
      a: "No! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue foto di prodotto e design non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete per il tuo lavoro creativo."
    },
    {
      q: "Le immagini ottimizzate miglioreranno le mie classifiche di ricerca Etsy?",
      a: "Sì. I negozi che caricano più velocemente hanno prestazioni migliori nell'algoritmo di ricerca di Etsy. Le immagini ottimizzate migliorano la velocità di caricamento del tuo negozio, il che può aumentare le tue classifiche di ricerca e aumentare l'impegno degli acquirenti, portando potenzialmente a più vendite."
    }
  ],
  ja: [
    {
      q: "Etsyの出品にJPG形式をサポートしていますか？",
      a: "はい！Etsyは出品写真にJPG形式を推奨しており、Toolazeはそれらを完璧に最適化します。JPG形式は、Etsyのプラットフォームでファイルサイズと画像品質の最良のバランスを提供します。"
    },
    {
      q: "なぜEtsyでは1MBが推奨サイズなのですか？",
      a: "Etsyは1MB未満の画像を推奨しています。これは、大きなファイルがショップの読み込みを遅くするためです。特にモバイルデバイスでは、1MBを超えるファイルは正しくアップロードされないか、買い手にとって非常に遅く読み込まれる可能性があり、購入体験を悪化させ、検索ランキングに悪影響を与える可能性があります。"
    },
    {
      q: "圧縮後、製品の色が薄く見えますか？",
      a: "いいえ！Toolazeの圧縮アルゴリズムは、鮮やかな色とテクスチャを保持するように特別に調整されています。圧縮は色の品質を低下させるのではなく、画像構造を最適化することに焦点を当てており、ハンドメイド製品が最高に見えるようにします。"
    },
    {
      q: "複数の出品画像を一度に処理できますか？",
      a: "はい！Toolazeは最大100枚の出品画像を同時に一括処理できます。製品カタログ全体の最適化や一括ショップ更新に最適です。"
    },
    {
      q: "製品写真はサーバーにアップロードされますか？",
      a: "いいえ！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。製品写真やデザインがデバイスを離れることはなく、クリエイティブな作品の完全なプライバシーとセキュリティを保証します。"
    },
    {
      q: "最適化された画像はEtsyの検索ランキングを改善しますか？",
      a: "はい。読み込みが速いショップは、Etsyの検索アルゴリズムでより良いパフォーマンスを発揮します。最適化された画像はショップの読み込み速度を改善し、検索ランキングを向上させ、買い手のエンゲージメントを増加させ、より多くの売上につながる可能性があります。"
    }
  ],
  ko: [
    {
      q: "Etsy 리스팅에 JPG 형식을 지원하나요?",
      a: "예! Etsy는 리스팅 사진에 JPG 형식을 선호하며, Toolaze는 이를 완벽하게 최적화합니다. JPG 형식은 Etsy 플랫폼에서 파일 크기와 이미지 품질 사이의 최상의 균형을 제공합니다."
    },
    {
      q: "왜 Etsy에서 1MB가 권장 크기인가요?",
      a: "Etsy는 더 큰 파일이 특히 모바일 기기에서 상점 로딩을 느리게 만들기 때문에 1MB 미만의 이미지를 권장합니다. 1MB를 초과하는 파일은 제대로 업로드되지 않거나 구매자에게 매우 느리게 로드되어 나쁜 쇼핑 경험을 만들고 검색 순위에 잠재적으로 해를 끼칠 수 있습니다."
    },
    {
      q: "압축 후 제품 색상이 흐려 보이나요?",
      a: "아니요! Toolaze의 압축 알고리즘은 생생한 색상과 질감을 보존하도록 특별히 조정되었습니다. 압축은 색상 품질을 낮추는 대신 이미지 구조를 최적화하는 데 중점을 두어 수제 제품이 최상으로 보이도록 합니다."
    },
    {
      q: "여러 리스팅 이미지를 한 번에 처리할 수 있나요?",
      a: "예! Toolaze는 최대 100개의 리스팅 이미지를 동시에 일괄 처리할 수 있습니다. 전체 제품 카탈로그 최적화 또는 대량 상점 업데이트에 완벽합니다."
    },
    {
      q: "제품 사진이 서버에 업로드되나요?",
      a: "아니요! 모든 압축은 JavaScript와 Canvas API를 사용하여 브라우저에서 로컬로 수행됩니다. 제품 사진과 디자인이 기기를 떠나지 않아 창의적 작업에 대한 완전한 개인정보 보호와 보안을 보장합니다."
    },
    {
      q: "최적화된 이미지가 Etsy 검색 순위를 개선하나요?",
      a: "예. 더 빠르게 로드되는 상점은 Etsy의 검색 알고리즘에서 더 나은 성능을 발휘합니다. 최적화된 이미지는 상점의 로딩 속도를 개선하여 검색 순위를 높이고 구매자 참여를 증가시켜 잠재적으로 더 많은 판매로 이어질 수 있습니다."
    }
  ],
  'zh-TW': [
    {
      q: "它支援 Etsy 列表的 JPG 格式嗎？",
      a: "是的！Etsy 偏好列表照片使用 JPG 格式，Toolaze 會完美優化它們。JPG 格式為 Etsy 平台提供了檔案大小和圖像品質之間的最佳平衡。"
    },
    {
      q: "為什麼 Etsy 推薦 1MB 的大小？",
      a: "Etsy 建議圖片低於 1MB，因為較大的檔案會減慢商店載入速度，尤其是在行動裝置上。超過 1MB 的檔案可能無法正確上傳或對買家載入非常緩慢，造成糟糕的購物體驗，並可能損害您的搜尋排名。"
    },
    {
      q: "壓縮後我的產品顏色會看起來褪色嗎？",
      a: "不會！Toolaze 的壓縮演算法專門調整以保留鮮豔的顏色和質感。壓縮專注於優化圖像結構而不是降低顏色品質，確保您的手工產品看起來最佳。"
    },
    {
      q: "我可以一次處理多張列表圖片嗎？",
      a: "是的！Toolaze 支援同時批次處理最多 100 張列表圖片。非常適合高效優化整個產品目錄或批量商店更新。"
    },
    {
      q: "我的產品照片會上傳到伺服器嗎？",
      a: "不會！所有壓縮都在您的瀏覽器中使用 JavaScript 和 Canvas API 本地進行。您的產品照片和設計永遠不會離開您的設備，確保您的創意作品完全私密和安全。"
    },
    {
      q: "優化後的圖片會改善我的 Etsy 搜尋排名嗎？",
      a: "是的。載入更快的商店在 Etsy 的搜尋演算法中表現更好。優化後的圖片改善了您商店的載入速度，這可以提高您的搜尋排名並增加買家參與度，可能帶來更多銷售。"
    }
  ]
}

async function main() {
  const languages = ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']
  
  for (const lang of languages) {
    const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (!data['etsy-listing-1mb']) {
      console.log(`⚠️  ${lang}: etsy-listing-1mb section not found`)
      continue
    }
    
    const faq = faqTranslations[lang]
    if (!faq) {
      console.log(`⚠️  ${lang}: FAQ translation not found`)
      continue
    }
    
    // 替换 FAQ
    data['etsy-listing-1mb'].faq = faq
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ ${lang}: etsy-listing-1mb FAQ translated`)
  }
  
  console.log('\n✨ All FAQ translations completed!')
}

main().catch(console.error)
