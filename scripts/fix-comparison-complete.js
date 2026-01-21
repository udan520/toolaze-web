const fs = require('fs');
const path = require('path');

// 完整的Comparison翻译模板
const comparisonTranslations = {
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
    },
    'Under 10MB guarantee, Zoom capability preserved, 100% browser-side processing, No watermarks or quality loss, Batch process up to 100 images, Free forever, IP protection': {
      de: 'Unter 10MB Garantie, Zoom-Fähigkeit erhalten, 100% Browser-seitige Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Bildern, Für immer kostenlos, IP-Schutz',
      es: 'Garantía bajo 10MB, Capacidad de zoom preservada, 100% procesamiento del lado del navegador, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes hasta 100 imágenes, Gratis para siempre, Protección IP',
      fr: 'Garantie sous 10MB, Capacité de zoom préservée, 100% traitement côté navigateur, Aucune filigrane ou perte de qualité, Traitement par lots jusqu\'à 100 images, Gratuit pour toujours, Protection IP',
      it: 'Garanzia sotto 10MB, Capacità di zoom preservata, 100% elaborazione lato browser, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 immagini, Gratuito per sempre, Protezione IP',
      ja: '10MB未満保証、ズーム機能保持、100%ブラウザ側処理、透かしや品質損失なし、最大100枚の画像を一括処理、永久無料、IP保護',
      ko: '10MB 미만 보장, 줌 기능 보존, 100% 브라우저 측 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이미지 일괄 처리, 영구 무료, IP 보호',
      pt: 'Garantia abaixo de 10MB, Capacidade de zoom preservada, 100% processamento do lado do navegador, Sem marcas d\'água ou perda de qualidade, Processamento em lote até 100 imagens, Grátis para sempre, Proteção IP',
      'zh-TW': '10MB 以下保證、縮放功能保留、100% 瀏覽器端處理、無水印或品質損失、批次處理最多 100 張圖片、永久免費、IP 保護'
    },
    'Under 10MB guarantee, Zoom capability preserved, 100% local processing, No watermarks or quality loss, Batch process up to 100 images, Free forever, IP protection': {
      de: 'Unter 10MB Garantie, Zoom-Fähigkeit erhalten, 100% lokale Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Bildern, Für immer kostenlos, IP-Schutz',
      es: 'Garantía bajo 10MB, Capacidad de zoom preservada, 100% procesamiento local, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes hasta 100 imágenes, Gratis para siempre, Protección IP',
      fr: 'Garantie sous 10MB, Capacité de zoom préservée, 100% traitement local, Aucune filigrane ou perte de qualité, Traitement par lots jusqu\'à 100 images, Gratuit pour toujours, Protection IP',
      it: 'Garanzia sotto 10MB, Capacità di zoom preservata, 100% elaborazione locale, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 immagini, Gratuito per sempre, Protezione IP',
      ja: '10MB未満保証、ズーム機能保持、100%ローカル処理、透かしや品質損失なし、最大100枚の画像を一括処理、永久無料、IP保護',
      ko: '10MB 미만 보장, 줌 기능 보존, 100% 로컬 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이미지 일괄 처리, 영구 무료, IP 보호',
      pt: 'Garantia abaixo de 10MB, Capacidade de zoom preservada, 100% processamento local, Sem marcas d\'água ou perda de qualidade, Processamento em lote até 100 imagens, Grátis para sempre, Proteção IP',
      'zh-TW': '10MB 以下保證、縮放功能保留、100% 本地處理、無水印或品質損失、批次處理最多 100 張圖片、永久免費、IP 保護'
    },
    'Under 1MB guarantee, Colors and textures preserved, 100% local processing, No watermarks or quality loss, Batch process up to 100 images, Free forever': {
      de: 'Unter 1MB Garantie, Farben und Texturen erhalten, 100% lokale Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Bildern, Für immer kostenlos',
      es: 'Garantía bajo 1MB, Colores y texturas preservados, 100% procesamiento local, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes hasta 100 imágenes, Gratis para siempre',
      fr: 'Garantie sous 1MB, Couleurs et textures préservées, 100% traitement local, Aucune filigrane ou perte de qualité, Traitement par lots jusqu\'à 100 images, Gratuit pour toujours',
      it: 'Garanzia sotto 1MB, Colori e texture preservati, 100% elaborazione locale, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 immagini, Gratuito per sempre',
      ja: '1MB未満保証、色とテクスチャ保持、100%ローカル処理、透かしや品質損失なし、最大100枚の画像を一括処理、永久無料',
      ko: '1MB 미만 보장, 색상 및 질감 보존, 100% 로컬 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이미지 일괄 처리, 영구 무료',
      pt: 'Garantia abaixo de 1MB, Cores e texturas preservadas, 100% processamento local, Sem marcas d\'água ou perda de qualidade, Processamento em lote até 100 imagens, Grátis para sempre',
      'zh-TW': '1MB 以下保證、顏色和紋理保留、100% 本地處理、無水印或品質損失、批次處理最多 100 張圖片、永久免費'
    },
    'Mobile-optimized sizes (500KB-1.5MB), Batch process up to 100 images, 100% local processing, No watermarks or quality loss, Preserves product detail and colors, Free forever': {
      de: 'Mobil optimierte Größen (500KB-1.5MB), Stapelverarbeitung bis zu 100 Bildern, 100% lokale Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Erhält Produktdetails und Farben, Für immer kostenlos',
      es: 'Tamaños optimizados para móviles (500KB-1.5MB), Procesamiento por lotes hasta 100 imágenes, 100% procesamiento local, Sin marcas de agua o pérdida de calidad, Preserva detalles y colores del producto, Gratis para siempre',
      fr: 'Tailles optimisées pour mobile (500KB-1.5MB), Traitement par lots jusqu\'à 100 images, 100% traitement local, Aucune filigrane ou perte de qualité, Préserve les détails et couleurs du produit, Gratuit pour toujours',
      it: 'Dimensioni ottimizzate per mobile (500KB-1.5MB), Elaborazione batch fino a 100 immagini, 100% elaborazione locale, Nessuna filigrana o perdita di qualità, Preserva dettagli e colori del prodotto, Gratuito per sempre',
      ja: 'モバイル最適化サイズ（500KB-1.5MB）、最大100枚の画像を一括処理、100%ローカル処理、透かしや品質損失なし、製品の詳細と色を保持、永久無料',
      ko: '모바일 최적화 크기 (500KB-1.5MB), 최대 100개 이미지 일괄 처리, 100% 로컬 처리, 워터마크 또는 품질 손실 없음, 제품 세부 사항 및 색상 보존, 영구 무료',
      pt: 'Tamanhos otimizados para mobile (500KB-1.5MB), Processamento em lote até 100 imagens, 100% processamento local, Sem marcas d\'água ou perda de qualidade, Preserva detalhes e cores do produto, Grátis para sempre',
      'zh-TW': '行動裝置優化大小（500KB-1.5MB）、批次處理最多 100 張圖片、100% 本地處理、無水印或品質損失、保留產品細節和顏色、永久免費'
    },
    'Strict 256KB cap, Transparency preserved, 100% browser-side processing, No watermarks or quality loss, Batch process up to 100 emojis, Free forever': {
      de: 'Strenge 256KB-Obergrenze, Transparenz erhalten, 100% Browser-seitige Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Emojis, Für immer kostenlos',
      es: 'Límite estricto de 256KB, Transparencia preservada, 100% procesamiento del lado del navegador, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes hasta 100 emojis, Gratis para siempre',
      fr: 'Limite stricte de 256KB, Transparence préservée, 100% traitement côté navigateur, Aucune filigrane ou perte de qualité, Traitement par lots jusqu\'à 100 emojis, Gratuit pour toujours',
      it: 'Limite rigoroso di 256KB, Trasparenza preservata, 100% elaborazione lato browser, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 emoji, Gratuito per sempre',
      ja: '厳格な256KB上限、透明度保持、100%ブラウザ側処理、透かしや品質損失なし、最大100個の絵文字を一括処理、永久無料',
      ko: '엄격한 256KB 상한, 투명도 보존, 100% 브라우저 측 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이모지 일괄 처리, 영구 무료',
      pt: 'Limite rigoroso de 256KB, Transparência preservada, 100% processamento do lado do navegador, Sem marcas d\'água ou perda de qualidade, Processamento em lote até 100 emojis, Grátis para sempre',
      'zh-TW': '嚴格 256KB 上限、透明度保留、100% 瀏覽器端處理、無水印或品質損失、批次處理最多 100 個表情符號、永久免費'
    },
    'Strict 256KB cap, Transparency preserved, 100% local processing, No watermarks or quality loss, Batch process up to 100 emojis, Free forever': {
      de: 'Strenge 256KB-Obergrenze, Transparenz erhalten, 100% lokale Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Emojis, Für immer kostenlos',
      es: 'Límite estricto de 256KB, Transparencia preservada, 100% procesamiento local, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes hasta 100 emojis, Gratis para siempre',
      fr: 'Limite stricte de 256KB, Transparence préservée, 100% traitement local, Aucune filigrane ou perte de qualité, Traitement par lots jusqu\'à 100 emojis, Gratuit pour toujours',
      it: 'Limite rigoroso di 256KB, Trasparenza preservata, 100% elaborazione locale, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 emoji, Gratuito per sempre',
      ja: '厳格な256KB上限、透明度保持、100%ローカル処理、透かしや品質損失なし、最大100個の絵文字を一括処理、永久無料',
      ko: '엄격한 256KB 상한, 투명도 보존, 100% 로컬 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이모지 일괄 처리, 영구 무료',
      pt: 'Limite rigoroso de 256KB, Transparência preservada, 100% processamento local, Sem marcas d\'água ou perda de qualidade, Processamento em lote até 100 emojis, Grátis para sempre',
      'zh-TW': '嚴格 256KB 上限、透明度保留、100% 本地處理、無水印或品質損失、批次處理最多 100 個表情符號、永久免費'
    },
    'Unlimited file sizes, Batch 100+ images, Transparency preserved, Precise size control, 100% local processing, Free forever': {
      de: 'Unbegrenzte Dateigrößen, Stapel 100+ Bilder, Transparenz erhalten, Präzise Größensteuerung, 100% lokale Verarbeitung, Für immer kostenlos',
      es: 'Tamaños de archivo ilimitados, Lote 100+ imágenes, Transparencia preservada, Control preciso del tamaño, 100% procesamiento local, Gratis para siempre',
      fr: 'Tailles de fichier illimitées, Traitement par lots 100+ images, Transparence préservée, Contrôle précis de la taille, 100% traitement local, Gratuit pour toujours',
      it: 'Dimensioni file illimitate, Elaborazione batch 100+ immagini, Trasparenza preservata, Controllo preciso delle dimensioni, 100% elaborazione locale, Gratuito per sempre',
      ja: '無制限のファイルサイズ、100枚以上の画像を一括処理、透明度保持、正確なサイズ制御、100%ローカル処理、永久無料',
      ko: '무제한 파일 크기, 100개 이상 이미지 일괄 처리, 투명도 보존, 정확한 크기 제어, 100% 로컬 처리, 영구 무료',
      pt: 'Tamanhos de arquivo ilimitados, Lote 100+ imagens, Transparência preservada, Controle preciso de tamanho, 100% processamento local, Grátis para sempre',
      'zh-TW': '無限制檔案大小、批次處理 100+ 圖片、透明度保留、精確大小控制、100% 本地處理、永久免費'
    },
    'Unlimited file sizes, Batch 100+ images, Quality preserved, Precise size control, 100% local processing, Free forever': {
      de: 'Unbegrenzte Dateigrößen, Stapel 100+ Bilder, Qualität erhalten, Präzise Größensteuerung, 100% lokale Verarbeitung, Für immer kostenlos',
      es: 'Tamaños de archivo ilimitados, Lote 100+ imágenes, Calidad preservada, Control preciso del tamaño, 100% procesamiento local, Gratis para siempre',
      fr: 'Tailles de fichier illimitées, Traitement par lots 100+ images, Qualité préservée, Contrôle précis de la taille, 100% traitement local, Gratuit pour toujours',
      it: 'Dimensioni file illimitate, Elaborazione batch 100+ immagini, Qualità preservata, Controllo preciso delle dimensioni, 100% elaborazione locale, Gratuito per sempre',
      ja: '無制限のファイルサイズ、100枚以上の画像を一括処理、品質保持、正確なサイズ制御、100%ローカル処理、永久無料',
      ko: '무제한 파일 크기, 100개 이상 이미지 일괄 처리, 품질 보존, 정확한 크기 제어, 100% 로컬 처리, 영구 무료',
      pt: 'Tamanhos de arquivo ilimitados, Lote 100+ imagens, Qualidade preservada, Controle preciso de tamanho, 100% processamento local, Grátis para sempre',
      'zh-TW': '無限制檔案大小、批次處理 100+ 圖片、品質保留、精確大小控制、100% 本地處理、永久免費'
    },
    'Unlimited file sizes, Batch 100+ images, Multiple formats, Precise size control, 100% local processing, Free forever': {
      de: 'Unbegrenzte Dateigrößen, Stapel 100+ Bilder, Mehrere Formate, Präzise Größensteuerung, 100% lokale Verarbeitung, Für immer kostenlos',
      es: 'Tamaños de archivo ilimitados, Lote 100+ imágenes, Múltiples formatos, Control preciso del tamaño, 100% procesamiento local, Gratis para siempre',
      fr: 'Tailles de fichier illimitées, Traitement par lots 100+ images, Formats multiples, Contrôle précis de la taille, 100% traitement local, Gratuit pour toujours',
      it: 'Dimensioni file illimitate, Elaborazione batch 100+ immagini, Formati multipli, Controllo preciso delle dimensioni, 100% elaborazione locale, Gratuito per sempre',
      ja: '無制限のファイルサイズ、100枚以上の画像を一括処理、複数形式、正確なサイズ制御、100%ローカル処理、永久無料',
      ko: '무제한 파일 크기, 100개 이상 이미지 일괄 처리, 여러 형식, 정확한 크기 제어, 100% 로컬 처리, 영구 무료',
      pt: 'Tamanhos de arquivo ilimitados, Lote 100+ imagens, Múltiplos formatos, Controle preciso de tamanho, 100% processamento local, Grátis para sempre',
      'zh-TW': '無限制檔案大小、批次處理 100+ 圖片、多種格式、精確大小控制、100% 本地處理、永久免費'
    },
    'Batch 100+ images, Multiple formats, Consistent compression, Precise size control, 100% local processing, Free forever': {
      de: 'Stapel 100+ Bilder, Mehrere Formate, Konsistente Komprimierung, Präzise Größensteuerung, 100% lokale Verarbeitung, Für immer kostenlos',
      es: 'Lote 100+ imágenes, Múltiples formatos, Compresión consistente, Control preciso del tamaño, 100% procesamiento local, Gratis para siempre',
      fr: 'Traitement par lots 100+ images, Formats multiples, Compression cohérente, Contrôle précis de la taille, 100% traitement local, Gratuit pour toujours',
      it: 'Elaborazione batch 100+ immagini, Formati multipli, Compressione consistente, Controllo preciso delle dimensioni, 100% elaborazione locale, Gratuito per sempre',
      ja: '100枚以上の画像を一括処理、複数形式、一貫した圧縮、正確なサイズ制御、100%ローカル処理、永久無料',
      ko: '100개 이상 이미지 일괄 처리, 여러 형식, 일관된 압축, 정확한 크기 제어, 100% 로컬 처리, 영구 무료',
      pt: 'Lote 100+ imagens, Múltiplos formatos, Compressão consistente, Controle preciso de tamanho, 100% processamento local, Grátis para sempre',
      'zh-TW': '批次處理 100+ 圖片、多種格式、一致的壓縮、精確大小控制、100% 本地處理、永久免費'
    }
  },
  
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
    },
    'May exceed 256KB limit, Loses transparency, Server uploads required, Watermarks or quality degradation, Limited batch processing, Subscription fees or ads': {
      de: 'Kann 256KB-Limit überschreiten, Verliert Transparenz, Server-Uploads erforderlich, Wasserzeichen oder Qualitätsverschlechterung, Begrenzte Stapelverarbeitung, Abonnementgebühren oder Werbung',
      es: 'Puede exceder el límite de 256KB, Pierde transparencia, Cargas al servidor requeridas, Marcas de agua o degradación de calidad, Procesamiento por lotes limitado, Tarifas de suscripción o anuncios',
      fr: 'Peut dépasser la limite de 256KB, Perd la transparence, Téléchargements serveur requis, Filigranes ou dégradation de qualité, Traitement par lots limité, Frais d\'abonnement ou publicités',
      it: 'Può superare il limite di 256KB, Perde trasparenza, Caricamenti server richiesti, Filigrane o degrado della qualità, Elaborazione batch limitata, Tariffe di abbonamento o annunci',
      ja: '256KB制限を超える可能性、透明度の喪失、サーバーアップロード必要、透かしや品質劣化、限定的な一括処理、サブスクリプション料金または広告',
      ko: '256KB 제한 초과 가능, 투명도 손실, 서버 업로드 필요, 워터마크 또는 품질 저하, 제한된 일괄 처리, 구독료 또는 광고',
      pt: 'Pode exceder o limite de 256KB, Perde transparência, Uploads de servidor necessários, Marcas d\'água ou degradação de qualidade, Processamento em lote limitado, Taxas de assinatura ou anúncios',
      'zh-TW': '可能超過 256KB 限制、失去透明度、需要伺服器上傳、水印或品質下降、有限的批次處理、訂閱費用或廣告'
    },
    '20MB file limits, Transparency lost, Single file processing, Cloud uploads required, Server queues, Paid upgrades': {
      de: '20MB-Dateigrößenbeschränkungen, Transparenz verloren, Einzeldateiverarbeitung, Cloud-Uploads erforderlich, Server-Warteschlangen, Bezahlte Upgrades',
      es: 'Límites de archivo de 20MB, Transparencia perdida, Procesamiento de archivo único, Cargas en la nube requeridas, Colas de servidor, Actualizaciones de pago',
      fr: 'Limites de fichier 20MB, Transparence perdue, Traitement de fichier unique, Téléchargements cloud requis, Files d\'attente serveur, Mises à niveau payantes',
      it: 'Limiti di file 20MB, Trasparenza persa, Elaborazione file singolo, Caricamenti cloud richiesti, Code del server, Aggiornamenti a pagamento',
      ja: '20MBファイル制限、透明度の喪失、単一ファイル処理、クラウドアップロード必要、サーバーキュー、有料アップグレード',
      ko: '20MB 파일 제한, 투명도 손실, 단일 파일 처리, 클라우드 업로드 필요, 서버 대기열, 유료 업그레이드',
      pt: 'Limites de arquivo de 20MB, Transparência perdida, Processamento de arquivo único, Uploads na nuvem necessários, Filas de servidor, Atualizações pagas',
      'zh-TW': '20MB 檔案限制、失去透明度、單一檔案處理、需要雲端上傳、伺服器佇列、付費升級'
    },
    '20MB file limits, Quality loss, Single file processing, Cloud uploads required, Server queues, Paid upgrades': {
      de: '20MB-Dateigrößenbeschränkungen, Qualitätsverlust, Einzeldateiverarbeitung, Cloud-Uploads erforderlich, Server-Warteschlangen, Bezahlte Upgrades',
      es: 'Límites de archivo de 20MB, Pérdida de calidad, Procesamiento de archivo único, Cargas en la nube requeridas, Colas de servidor, Actualizaciones de pago',
      fr: 'Limites de fichier 20MB, Perte de qualité, Traitement de fichier unique, Téléchargements cloud requis, Files d\'attente serveur, Mises à niveau payantes',
      it: 'Limiti di file 20MB, Perdita di qualità, Elaborazione file singolo, Caricamenti cloud richiesti, Code del server, Aggiornamenti a pagamento',
      ja: '20MBファイル制限、品質損失、単一ファイル処理、クラウドアップロード必要、サーバーキュー、有料アップグレード',
      ko: '20MB 파일 제한, 품질 손실, 단일 파일 처리, 클라우드 업로드 필요, 서버 대기열, 유료 업그레이드',
      pt: 'Limites de arquivo de 20MB, Perda de qualidade, Processamento de arquivo único, Uploads na nuvem necessários, Filas de servidor, Atualizações pagas',
      'zh-TW': '20MB 檔案限制、品質損失、單一檔案處理、需要雲端上傳、伺服器佇列、付費升級'
    },
    '20MB file limits, Format restrictions, Single file processing, Cloud uploads required, Server queues, Paid upgrades': {
      de: '20MB-Dateigrößenbeschränkungen, Formatbeschränkungen, Einzeldateiverarbeitung, Cloud-Uploads erforderlich, Server-Warteschlangen, Bezahlte Upgrades',
      es: 'Límites de archivo de 20MB, Restricciones de formato, Procesamiento de archivo único, Cargas en la nube requeridas, Colas de servidor, Actualizaciones de pago',
      fr: 'Limites de fichier 20MB, Restrictions de format, Traitement de fichier unique, Téléchargements cloud requis, Files d\'attente serveur, Mises à niveau payantes',
      it: 'Limiti di file 20MB, Restrizioni di formato, Elaborazione file singolo, Caricamenti cloud richiesti, Code del server, Aggiornamenti a pagamento',
      ja: '20MBファイル制限、形式制限、単一ファイル処理、クラウドアップロード必要、サーバーキュー、有料アップグレード',
      ko: '20MB 파일 제한, 형식 제한, 단일 파일 처리, 클라우드 업로드 필요, 서버 대기열, 유료 업그레이드',
      pt: 'Limites de arquivo de 20MB, Restrições de formato, Processamento de arquivo único, Uploads na nuvem necessários, Filas de servidor, Atualizações pagas',
      'zh-TW': '20MB 檔案限制、格式限制、單一檔案處理、需要雲端上傳、伺服器佇列、付費升級'
    },
    'Limited batch size, Format restrictions, Inconsistent results, Cloud uploads required, Server queues, Paid upgrades': {
      de: 'Begrenzte Stapelgröße, Formatbeschränkungen, Inkonsistente Ergebnisse, Cloud-Uploads erforderlich, Server-Warteschlangen, Bezahlte Upgrades',
      es: 'Tamaño de lote limitado, Restricciones de formato, Resultados inconsistentes, Cargas en la nube requeridas, Colas de servidor, Actualizaciones de pago',
      fr: 'Taille de lot limitée, Restrictions de format, Résultats incohérents, Téléchargements cloud requis, Files d\'attente serveur, Mises à niveau payantes',
      it: 'Dimensione batch limitata, Restrizioni di formato, Risultati inconsistenti, Caricamenti cloud richiesti, Code del server, Aggiornamenti a pagamento',
      ja: '限定的なバッチサイズ、形式制限、一貫性のない結果、クラウドアップロード必要、サーバーキュー、有料アップグレード',
      ko: '제한된 배치 크기, 형식 제한, 일관성 없는 결과, 클라우드 업로드 필요, 서버 대기열, 유료 업그레이드',
      pt: 'Tamanho de lote limitado, Restrições de formato, Resultados inconsistentes, Uploads na nuvem necessários, Filas de servidor, Atualizações pagas',
      'zh-TW': '有限的批次大小、格式限制、不一致的結果、需要雲端上傳、伺服器佇列、付費升級'
    }
  }
};

// 翻译函数 - 处理常见模式和混合内容
function translateComparisonText(text, type, lang) {
  // 检查直接匹配
  if (comparisonTranslations[type] && comparisonTranslations[type][text] && comparisonTranslations[type][text][lang]) {
    return comparisonTranslations[type][text][lang];
  }
  
  // 处理混合内容（部分英文部分已翻译）
  // 检查是否包含英文关键词
  const englishKeywords = ['Unlimited', 'Batch', 'Precise', 'local processing', 'No uploads', 'Free forever', 
                          'file limits', 'Single file', 'Cloud uploads', 'Server queues', 'Paid upgrades',
                          'Transparency', 'Quality', 'Multiple formats', 'Consistent'];
  
  const hasEnglish = englishKeywords.some(keyword => text.includes(keyword));
  
  if (hasEnglish) {
    // 如果包含英文，尝试翻译
    const items = text.split(', ').map(item => item.trim());
    const translatedItems = items.map(item => {
      // 跳过已经翻译的项目（包含非ASCII字符）
      if (/[^\x00-\x7F]/.test(item) && !item.match(/[A-Z][a-z]+/)) {
        return item; // 已经是翻译
      }
      
      // 翻译常见短语
      if (item.includes('Unlimited file sizes')) {
        const translations = {
          de: 'Unbegrenzte Dateigrößen',
          es: 'Tamaños de archivo ilimitados',
          fr: 'Tailles de fichier illimitées',
          it: 'Dimensioni file illimitate',
          ja: '無制限のファイルサイズ',
          ko: '무제한 파일 크기',
          pt: 'Tamanhos de arquivo ilimitados',
          'zh-TW': '無限制檔案大小'
        };
        return translations[lang] || item;
      }
      
      if (item.includes('Batch 100+ images') || item.includes('Batch process up to 100')) {
        const translations = {
          de: 'Stapel 100+ Bilder',
          es: 'Lote 100+ imágenes',
          fr: 'Traitement par lots 100+ images',
          it: 'Elaborazione batch 100+ immagini',
          ja: '100枚以上の画像を一括処理',
          ko: '100개 이상 이미지 일괄 처리',
          pt: 'Lote 100+ imagens',
          'zh-TW': '批次處理 100+ 圖片'
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
      
      if (item.includes('100% local processing') || item.includes('100% browser-side processing') || item.includes('100% 로컬 처리')) {
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
      
      if (item.includes('100% browser-side processing')) {
        const translations = {
          de: '100% Browser-seitige Verarbeitung',
          es: '100% procesamiento del lado del navegador',
          fr: '100% traitement côté navigateur',
          it: '100% elaborazione lato browser',
          ja: '100%ブラウザ側処理',
          ko: '100% 브라우저 측 처리',
          pt: '100% processamento do lado do navegador',
          'zh-TW': '100% 瀏覽器端處理'
        };
        return translations[lang] || item;
      }
      
      if (item.includes('No watermarks or quality loss')) {
        const translations = {
          de: 'Keine Wasserzeichen oder Qualitätsverlust',
          es: 'Sin marcas de agua o pérdida de calidad',
          fr: 'Aucune filigrane ou perte de qualité',
          it: 'Nessuna filigrana o perdita di qualità',
          ja: '透かしや品質損失なし',
          ko: '워터마크 또는 품질 손실 없음',
          pt: 'Sem marcas d\'água ou perda de qualidade',
          'zh-TW': '無水印或品質損失'
        };
        return translations[lang] || item;
      }
      
      if (item.includes('Batch process up to 100 images') || item.includes('Batch process up to 100 emojis')) {
        const type = item.includes('emojis') ? 'emojis' : 'images';
        const translations = {
          de: type === 'emojis' ? 'Stapelverarbeitung bis zu 100 Emojis' : 'Stapelverarbeitung bis zu 100 Bildern',
          es: type === 'emojis' ? 'Procesamiento por lotes hasta 100 emojis' : 'Procesamiento por lotes hasta 100 imágenes',
          fr: type === 'emojis' ? 'Traitement par lots jusqu\'à 100 emojis' : 'Traitement par lots jusqu\'à 100 images',
          it: type === 'emojis' ? 'Elaborazione batch fino a 100 emoji' : 'Elaborazione batch fino a 100 immagini',
          ja: type === 'emojis' ? '最大100個の絵文字を一括処理' : '最大100枚の画像を一括処理',
          ko: type === 'emojis' ? '최대 100개 이모지 일괄 처리' : '최대 100개 이미지 일괄 처리',
          pt: type === 'emojis' ? 'Processamento em lote até 100 emojis' : 'Processamento em lote até 100 imagens',
          'zh-TW': type === 'emojis' ? '批次處理最多 100 個表情符號' : '批次處理最多 100 張圖片'
        };
        return translations[lang] || item;
      }
      
      if (item.includes('No uploads') || item.includes('업로드 없음')) {
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
      
      if (item.includes('Free forever') || item.includes('영구 무료')) {
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
      
      if (item.includes('Transparency preserved') || item.includes('Transparency lost')) {
        const translations = {
          de: item.includes('preserved') ? 'Transparenz erhalten' : 'Transparenz verloren',
          es: item.includes('preserved') ? 'Transparencia preservada' : 'Transparencia perdida',
          fr: item.includes('preserved') ? 'Transparence préservée' : 'Transparence perdue',
          it: item.includes('preserved') ? 'Trasparenza preservata' : 'Trasparenza persa',
          ja: item.includes('preserved') ? '透明度保持' : '透明度の喪失',
          ko: item.includes('preserved') ? '투명도 보존' : '투명도 손실',
          pt: item.includes('preserved') ? 'Transparência preservada' : 'Transparência perdida',
          'zh-TW': item.includes('preserved') ? '透明度保留' : '失去透明度'
        };
        return translations[lang] || item;
      }
      
      if (item.includes('Quality preserved') || item.includes('Quality loss')) {
        const translations = {
          de: item.includes('preserved') ? 'Qualität erhalten' : 'Qualitätsverlust',
          es: item.includes('preserved') ? 'Calidad preservada' : 'Pérdida de calidad',
          fr: item.includes('preserved') ? 'Qualité préservée' : 'Perte de qualité',
          it: item.includes('preserved') ? 'Qualità preservata' : 'Perdita di qualità',
          ja: item.includes('preserved') ? '品質保持' : '品質損失',
          ko: item.includes('preserved') ? '품질 보존' : '품질 손실',
          pt: item.includes('preserved') ? 'Qualidade preservada' : 'Perda de qualidade',
          'zh-TW': item.includes('preserved') ? '品質保留' : '品質損失'
        };
        return translations[lang] || item;
      }
      
      if (item.includes('Multiple formats') || item.includes('Format restrictions')) {
        const translations = {
          de: item.includes('Multiple') ? 'Mehrere Formate' : 'Formatbeschränkungen',
          es: item.includes('Multiple') ? 'Múltiples formatos' : 'Restricciones de formato',
          fr: item.includes('Multiple') ? 'Formats multiples' : 'Restrictions de format',
          it: item.includes('Multiple') ? 'Formati multipli' : 'Restrizioni di formato',
          ja: item.includes('Multiple') ? '複数形式' : '形式制限',
          ko: item.includes('Multiple') ? '여러 형식' : '형식 제한',
          pt: item.includes('Multiple') ? 'Múltiplos formatos' : 'Restrições de formato',
          'zh-TW': item.includes('Multiple') ? '多種格式' : '格式限制'
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
      
      if (item.includes('Paid upgrades')) {
        const translations = {
          de: 'Bezahlte Upgrades',
          es: 'Actualizaciones de pago',
          fr: 'Mises à niveau payantes',
          it: 'Aggiornamenti a pagamento',
          ja: '有料アップグレード',
          ko: '유료 업그레이드',
          pt: 'Atualizações pagas',
          'zh-TW': '付費升級'
        };
        return translations[lang] || item;
      }
      
      return item;
    });
    
    return translatedItems.join(', ');
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
    
      // 修复toolaze - 如果与英文相同或包含英文关键词，强制翻译
      if (enComparison.toolaze) {
        const currentToolaze = langComparison.toolaze || '';
        // 检查是否包含英文关键词（更严格的检查）
        const englishPatterns = [
          /Unlimited\s+file\s+sizes/i,
          /Batch\s+100\+/i,
          /100%\s+local\s+processing/i,
          /No\s+uploads/i,
          /Free\s+forever/i,
          /file\s+sizes/i,
          /local\s+processing/i,
          /Under\s+\d+MB/i,
          /Transparency\s+preserved/i,
          /Quality\s+preserved/i,
          /Multiple\s+formats/i,
          /Consistent\s+compression/i,
          /No\s+watermarks/i,
          /IP\s+protection/i,
          /Zoom\s+capability/i
        ];
        
        const hasEnglish = englishPatterns.some(pattern => pattern.test(currentToolaze)) ||
                           currentToolaze === enComparison.toolaze ||
                           (!currentToolaze);
        
        if (hasEnglish) {
          const translatedToolaze = translateComparisonText(enComparison.toolaze, 'toolaze', lang);
          if (translatedToolaze !== enComparison.toolaze) {
            langComparison.toolaze = translatedToolaze;
            langFixed++;
          }
        }
      }
      
      // 修复others - 如果与英文相同或包含英文关键词，强制翻译
      if (enComparison.others) {
        const currentOthers = langComparison.others || '';
        // 检查是否包含英文关键词（更严格的检查）
        const englishPatterns = [
          /\d+MB\s+file\s+limits/i,
          /Single\s+file\s+processing/i,
          /Cloud\s+uploads\s+required/i,
          /Server\s+queues/i,
          /Paid\s+upgrades/i,
          /Transparency\s+lost/i,
          /Quality\s+loss/i,
          /Format\s+restrictions/i,
          /Limited\s+batch/i,
          /Subscription\s+fees/i,
          /May\s+exceed/i,
          /Loses\s+transparency/i,
          /Watermarks\s+or/i
        ];
        
        const hasEnglish = englishPatterns.some(pattern => pattern.test(currentOthers)) ||
                           currentOthers === enComparison.others ||
                           (!currentOthers);
        
        if (hasEnglish) {
          const translatedOthers = translateComparisonText(enComparison.others, 'others', lang);
          if (translatedOthers !== enComparison.others) {
            langComparison.others = translatedOthers;
            langFixed++;
          }
        }
      }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} comparison items`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} comparison translations`);
console.log(`⚠️  Note: Some items may still need manual translation for context-specific content`);
