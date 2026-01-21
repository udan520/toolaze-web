const fs = require('fs');
const path = require('path');

// 场景描述翻译模板
function translateSceneDesc(desc, lang) {
  // 常见场景描述模式
  if (desc.includes('Optimize') && desc.includes('websites and apps')) {
    const translations = {
      de: 'Optimieren Sie Bilder für Websites und Apps. Reduzieren Sie Ladezeiten bei gleichzeitiger Beibehaltung der Qualität für besseres SEO und Benutzererfahrung.',
      es: 'Optimiza imágenes para sitios web y aplicaciones. Reduce los tiempos de carga manteniendo la calidad para un mejor SEO y experiencia de usuario.',
      fr: 'Optimisez les images pour les sites web et les applications. Réduisez les temps de chargement tout en maintenant la qualité pour un meilleur SEO et une meilleure expérience utilisateur.',
      it: 'Ottimizza le immagini per siti web e app. Riduci i tempi di caricamento mantenendo la qualità per un migliore SEO e esperienza utente.',
      ja: 'ウェブサイトやアプリ用の画像を最適化します。品質を維持しながら読み込み時間を短縮し、SEOとユーザーエクスペリエンスを向上させます。',
      ko: '웹사이트 및 앱용 이미지를 최적화합니다. 품질을 유지하면서 로딩 시간을 줄여 SEO 및 사용자 경험을 개선합니다.',
      pt: 'Otimize imagens para sites e aplicativos. Reduza os tempos de carregamento mantendo a qualidade para melhor SEO e experiência do usuário.',
      'zh-TW': '優化網站和應用程式的圖片。在保持品質的同時減少載入時間，以改善 SEO 和使用者體驗。'
    };
    return translations[lang] || desc;
  }
  
  if (desc.includes('Compress large photo collections')) {
    const translations = {
      de: 'Komprimieren Sie große Fotosammlungen zum Teilen und Speichern. Behalten Sie die Qualität bei und reduzieren Sie die Dateigrößen erheblich.',
      es: 'Comprime grandes colecciones de fotos para compartir y almacenar. Mantén la calidad mientras reduces significativamente los tamaños de archivo.',
      fr: 'Compressez de grandes collections de photos pour le partage et le stockage. Maintenez la qualité tout en réduisant considérablement les tailles de fichier.',
      it: 'Comprimi grandi collezioni di foto per condivisione e archiviazione. Mantieni la qualità riducendo significativamente le dimensioni dei file.',
      ja: '共有と保存のために大きな写真コレクションを圧縮します。品質を維持しながら、ファイルサイズを大幅に削減します。',
      ko: '공유 및 저장을 위해 대규모 사진 컬렉션을 압축합니다. 품질을 유지하면서 파일 크기를 크게 줄입니다.',
      pt: 'Comprima grandes coleções de fotos para compartilhamento e armazenamento. Mantenha a qualidade enquanto reduz significativamente os tamanhos dos arquivos.',
      'zh-TW': '壓縮大型照片集合以供分享和儲存。在保持品質的同時大幅減少檔案大小。'
    };
    return translations[lang] || desc;
  }
  
  if (desc.includes('Prepare') && desc.includes('social media')) {
    const translations = {
      de: 'Bereiten Sie Bilder für soziale Medien und Blogs vor. Verarbeiten Sie mehrere Bilder schnell ohne Qualitätsverlust.',
      es: 'Prepara imágenes para redes sociales y blogs. Procesa múltiples imágenes rápidamente sin pérdida de calidad.',
      fr: 'Préparez les images pour les réseaux sociaux et les blogs. Traitez plusieurs images rapidement sans perte de qualité.',
      it: 'Prepara immagini per social media e blog. Elabora più immagini rapidamente senza perdita di qualità.',
      ja: 'ソーシャルメディアやブログ用の画像を準備します。品質を失うことなく、複数の画像をすばやく処理します。',
      ko: '소셜 미디어 및 블로그용 이미지를 준비합니다. 품질 손실 없이 여러 이미지를 빠르게 처리합니다.',
      pt: 'Prepare imagens para redes sociais e blogs. Processe várias imagens rapidamente sem perda de qualidade.',
      'zh-TW': '為社交媒體和部落格準備圖片。快速批次處理多張圖片而不損失品質。'
    };
    return translations[lang] || desc;
  }
  
  if (desc.includes('Meet strict file size requirements')) {
    const translations = {
      de: 'Erfüllen Sie strenge Dateigrößenanforderungen für offizielle Portale und Prüfungsanmeldungen. Stellen Sie sicher, dass Ihre Bilder die Spezifikationen erfüllen.',
      es: 'Cumple con requisitos estrictos de tamaño de archivo para portales oficiales y registros de exámenes. Asegúrate de que tus imágenes cumplan con las especificaciones.',
      fr: 'Répondez aux exigences strictes de taille de fichier pour les portails officiels et les inscriptions aux examens. Assurez-vous que vos images répondent aux spécifications.',
      it: 'Soddisfa requisiti rigorosi di dimensione del file per portali ufficiali e registrazioni d\'esame. Assicurati che le tue immagini soddisfino le specifiche.',
      ja: '公式ポータルや試験登録のための厳格なファイルサイズ要件を満たします。画像が仕様を満たしていることを確認してください。',
      ko: '공식 포털 및 시험 등록을 위한 엄격한 파일 크기 요구사항을 충족합니다. 이미지가 사양을 충족하는지 확인하세요.',
      pt: 'Atenda requisitos rigorosos de tamanho de arquivo para portais oficiais e registros de exames. Certifique-se de que suas imagens atendam às especificações.',
      'zh-TW': '滿足官方網站和考試註冊的嚴格檔案大小要求。確保您的圖片符合規格。'
    };
    return translations[lang] || desc;
  }
  
  if (desc.includes('Compress passport photos')) {
    const translations = {
      de: 'Komprimieren Sie Reisepassfotos für Visaanträge und Einwanderungsverfahren. Stellen Sie sicher, dass Ihre Fotos die Anforderungen erfüllen.',
      es: 'Comprime fotos de pasaporte para solicitudes de visa y procesos de inmigración. Asegúrate de que tus fotos cumplan con los requisitos.',
      fr: 'Compressez les photos de passeport pour les demandes de visa et les processus d\'immigration. Assurez-vous que vos photos répondent aux exigences.',
      it: 'Comprimi foto del passaporto per domande di visto e processi di immigrazione. Assicurati che le tue foto soddisfino i requisiti.',
      ja: 'ビザ申請や移民手続きのためにパスポート写真を圧縮します。写真が要件を満たしていることを確認してください。',
      ko: '비자 신청 및 이민 절차를 위한 여권 사진을 압축합니다. 사진이 요구사항을 충족하는지 확인하세요.',
      pt: 'Comprima fotos de passaporte para solicitações de visto e processos de imigração. Certifique-se de que suas fotos atendam aos requisitos.',
      'zh-TW': '壓縮護照照片以供簽證申請和移民流程使用。確保您的照片符合要求。'
    };
    return translations[lang] || desc;
  }
  
  if (desc.includes('Optimize graphics and logos')) {
    const translations = {
      de: 'Optimieren Sie Grafiken und Logos für schnellere Website-Ladezeiten. Reduzieren Sie Dateigrößen bei gleichzeitiger Beibehaltung der Transparenz.',
      es: 'Optimiza gráficos y logotipos para tiempos de carga más rápidos del sitio web. Reduce los tamaños de archivo manteniendo la transparencia.',
      fr: 'Optimisez les graphiques et logos pour des temps de chargement de site web plus rapides. Réduisez les tailles de fichier tout en préservant la transparence.',
      it: 'Ottimizza grafiche e loghi per tempi di caricamento del sito web più rapidi. Riduci le dimensioni dei file preservando la trasparenza.',
      ja: 'より速いウェブサイトの読み込み時間のためにグラフィックとロゴを最適化します。透明度を維持しながらファイルサイズを削減します。',
      ko: '더 빠른 웹사이트 로딩 시간을 위해 그래픽 및 로고를 최적화합니다. 투명도를 유지하면서 파일 크기를 줄입니다.',
      pt: 'Otimize gráficos e logotipos para tempos de carregamento mais rápidos do site. Reduza os tamanhos dos arquivos preservando a transparência.',
      'zh-TW': '優化圖形和標誌以加快網站載入時間。在保持透明度的同時減少檔案大小。'
    };
    return translations[lang] || desc;
  }
  
  // 更多场景描述模式
  if (desc.includes('Reduce file sizes') || desc.includes('reducing file sizes')) {
    const translations = {
      de: 'Reduzieren Sie Dateigrößen erheblich bei gleichzeitiger Beibehaltung der Qualität.',
      es: 'Reduce significativamente los tamaños de archivo manteniendo la calidad.',
      fr: 'Réduisez considérablement les tailles de fichier tout en maintenant la qualité.',
      it: 'Riduci significativamente le dimensioni dei file mantenendo la qualità.',
      ja: '品質を維持しながらファイルサイズを大幅に削減します。',
      ko: '품질을 유지하면서 파일 크기를 크게 줄입니다.',
      pt: 'Reduza significativamente os tamanhos dos arquivos mantendo a qualidade.',
      'zh-TW': '在保持品質的同時大幅減少檔案大小。'
    };
    return translations[lang] || desc;
  }
  
  if (desc.includes('Batch process') || desc.includes('process multiple')) {
    const translations = {
      de: 'Verarbeiten Sie mehrere Bilder schnell ohne Qualitätsverlust.',
      es: 'Procesa múltiples imágenes rápidamente sin pérdida de calidad.',
      fr: 'Traitez plusieurs images rapidement sans perte de qualité.',
      it: 'Elabora più immagini rapidamente senza perdita di qualità.',
      ja: '品質を失うことなく、複数の画像をすばやく処理します。',
      ko: '품질 손실 없이 여러 이미지를 빠르게 처리합니다.',
      pt: 'Processe várias imagens rapidamente sem perda de qualidade.',
      'zh-TW': '快速處理多張圖片而不損失品質。'
    };
    return translations[lang] || desc;
  }
  
  if (desc.includes('Maintain quality') || desc.includes('preserving quality')) {
    const translations = {
      de: 'Behalten Sie die Qualität bei und reduzieren Sie gleichzeitig die Dateigröße.',
      es: 'Mantén la calidad mientras reduces el tamaño del archivo.',
      fr: 'Maintenez la qualité tout en réduisant la taille du fichier.',
      it: 'Mantieni la qualità riducendo la dimensione del file.',
      ja: 'ファイルサイズを削減しながら品質を維持します。',
      ko: '파일 크기를 줄이면서 품질을 유지합니다.',
      pt: 'Mantenha a qualidade enquanto reduz o tamanho do arquivo.',
      'zh-TW': '在減少檔案大小的同時保持品質。'
    };
    return translations[lang] || desc;
  }
  
  // 通用模式匹配
  if (desc.includes('Reduce load times')) {
    const match = desc.match(/Reduce (load times|file size)/);
    const translations = {
      de: 'Reduzieren Sie Ladezeiten bei gleichzeitiger Beibehaltung der Qualität für bessere Leistung.',
      es: 'Reduce los tiempos de carga manteniendo la calidad para un mejor rendimiento.',
      fr: 'Réduisez les temps de chargement tout en maintenant la qualité pour de meilleures performances.',
      it: 'Riduci i tempi di caricamento mantenendo la qualità per prestazioni migliori.',
      ja: '品質を維持しながら読み込み時間を短縮し、パフォーマンスを向上させます。',
      ko: '품질을 유지하면서 로딩 시간을 줄여 성능을 향상시킵니다.',
      pt: 'Reduza os tempos de carregamento mantendo a qualidade para melhor desempenho.',
      'zh-TW': '在保持品質的同時減少載入時間以提升效能。'
    };
    return translations[lang] || desc;
  }
  
  return desc;
}

// 用户评价翻译模板
function translateRatingText(text, lang) {
  // 常见评价模式
  if (text.includes('Perfect tool for optimizing')) {
    const translations = {
      de: '"Perfektes Tool zur Optimierung meiner Website-Bilder. Schnell und privat!" - Schließen Sie sich Tausenden von Benutzern an, die Toolaze für JPG-Komprimierung vertrauen.',
      es: '"¡Herramienta perfecta para optimizar las imágenes de mi sitio web. Rápida y privada!" - Únete a miles de usuarios que confían en Toolaze para compresión JPG.',
      fr: '"Outil parfait pour optimiser les images de mon site web. Rapide et privé!" - Rejoignez des milliers d\'utilisateurs qui font confiance à Toolaze pour la compression JPG.',
      it: '"Strumento perfetto per ottimizzare le immagini del mio sito web. Veloce e privato!" - Unisciti a migliaia di utenti che si fidano di Toolaze per la compressione JPG.',
      ja: '"ウェブサイトの画像を最適化するための完璧なツール。高速でプライベート！" - JPG圧縮のためにToolazeを信頼する何千人ものユーザーに参加してください。',
      ko: '"웹사이트 이미지를 최적화하기 위한 완벽한 도구. 빠르고 비공개입니다!" - JPG 압축을 위해 Toolaze를 신뢰하는 수천 명의 사용자에 합류하세요.',
      pt: '"Ferramenta perfeita para otimizar as imagens do meu site. Rápida e privada!" - Junte-se a milhares de usuários que confiam no Toolaze para compressão JPG.',
      'zh-TW': '"優化網站圖片的完美工具。快速且私密！" - 加入數千名信賴 Toolaze 進行 JPG 壓縮的使用者。'
    };
    return translations[lang] || text;
  }
  
  if (text.includes('Perfect balance of file size')) {
    const translations = {
      de: '"Perfektes Gleichgewicht zwischen Dateigröße und Transparenz. Meine Website besteht jetzt Lighthouse-Audits!" - Schließen Sie sich Tausenden von Entwicklern an, die Toolaze für Web-Performance-Optimierung vertrauen.',
      es: '"¡Equilibrio perfecto entre tamaño de archivo y transparencia. Mi sitio web ahora pasa las auditorías de Lighthouse!" - Únete a miles de desarrolladores que confían en Toolaze para optimización del rendimiento web.',
      fr: '"Équilibre parfait entre taille de fichier et transparence. Mon site web passe maintenant les audits Lighthouse!" - Rejoignez des milliers de développeurs qui font confiance à Toolaze pour l\'optimisation des performances web.',
      it: '"Equilibrio perfetto tra dimensione del file e trasparenza. Il mio sito web ora supera gli audit di Lighthouse!" - Unisciti a migliaia di sviluppatori che si fidano di Toolaze per l\'ottimizzazione delle prestazioni web.',
      ja: '"ファイルサイズと透明度の完璧なバランス。私のウェブサイトは今、Lighthouse監査に合格しています！" - Webパフォーマンス最適化のためにToolazeを信頼する何千人もの開発者に参加してください。',
      ko: '"파일 크기와 투명도의 완벽한 균형. 내 웹사이트가 이제 Lighthouse 감사를 통과합니다!" - 웹 성능 최적화를 위해 Toolaze를 신뢰하는 수천 명의 개발자에 합류하세요.',
      pt: '"Equilíbrio perfeito entre tamanho de arquivo e transparência. Meu site agora passa nas auditorias do Lighthouse!" - Junte-se a milhares de desenvolvedores que confiam no Toolaze para otimização de desempenho web.',
      'zh-TW': '"檔案大小和透明度的完美平衡。我的網站現在通過了 Lighthouse 審核！" - 加入數千名信賴 Toolaze 進行網頁效能優化的開發者。'
    };
    return translations[lang] || text;
  }
  
  if (text.includes('Finally met the 20KB limit')) {
    const translations = {
      de: '"Endlich das 20KB-Limit für meine Beamtenprüfungsanmeldung erreicht! Keine Upload-Fehler mehr." - Schließen Sie sich Tausenden von Bewerbern an, die Toolaze für die Einhaltung von Behördenportalen vertrauen.',
      es: '"¡Finalmente cumplí con el límite de 20KB para mi registro de examen oficial! No más errores de carga." - Únete a miles de solicitantes que confían en Toolaze para el cumplimiento de portales gubernamentales.',
      fr: '"Enfin atteint la limite de 20KB pour mon inscription à l\'examen officiel! Plus d\'erreurs de téléchargement." - Rejoignez des milliers de candidats qui font confiance à Toolaze pour la conformité des portails gouvernementaux.',
      it: '"Finalmente raggiunto il limite di 20KB per la mia registrazione all\'esame ufficiale! Nessun errore di caricamento." - Unisciti a migliaia di candidati che si fidano di Toolaze per la conformità dei portali governativi.',
      ja: '"ついに公式試験登録の20KB制限に達しました！アップロードエラーはもうありません。" - 政府ポータル準拠のためにToolazeを信頼する何千人もの申請者に参加してください。',
      ko: '"드디어 정부 시험 등록을 위한 20KB 제한을 달성했습니다! 더 이상 업로드 오류가 없습니다." - 공식 포털 준수를 위해 Toolaze를 신뢰하는 수천 명의 신청자에 합류하세요.',
      pt: '"Finalmente atingi o limite de 20KB para meu registro de exame oficial! Sem mais erros de upload." - Junte-se a milhares de candidatos que confiam no Toolaze para conformidade com portais governamentais.',
      'zh-TW': '"終於達到官方考試註冊的 20KB 限制！不再有上傳錯誤。" - 加入數千名信賴 Toolaze 以符合政府網站要求的申請者。'
    };
    return translations[lang] || text;
  }
  
  if (text.includes('USCIS photo requirements')) {
    const translations = {
      de: '"Perfekt für USCIS-Fotoanforderungen! Schnell, sicher und zuverlässig." - Schließen Sie sich Tausenden von Einwanderern an, die Toolaze für Visa-Fotos vertrauen.',
      es: '"¡Perfecto para los requisitos de fotos de USCIS! Rápido, seguro y confiable." - Únete a miles de inmigrantes que confían en Toolaze para fotos de visa.',
      fr: '"Parfait pour les exigences de photos USCIS! Rapide, sûr et fiable." - Rejoignez des milliers d\'immigrants qui font confiance à Toolaze pour les photos de visa.',
      it: '"Perfetto per i requisiti delle foto USCIS! Veloce, sicuro e affidabile." - Unisciti a migliaia di immigrati che si fidano di Toolaze per le foto del visto.',
      ja: '"USCIS写真要件に最適！高速、安全、信頼性があります。" - ビザ写真のためにToolazeを信頼する何千人もの移民に参加してください。',
      ko: '"USCIS 사진 요구사항에 완벽합니다! 빠르고 안전하며 신뢰할 수 있습니다." - 비자 사진을 위해 Toolaze를 신뢰하는 수천 명의 이민자에 합류하세요.',
      pt: '"Perfeito para requisitos de fotos USCIS! Rápido, seguro e confiável." - Junte-se a milhares de imigrantes que confiam no Toolaze para fotos de visto.',
      'zh-TW': '"完美符合 USCIS 照片要求！快速、安全且可靠。" - 加入數千名信賴 Toolaze 進行簽證照片的移民。'
    };
    return translations[lang] || text;
  }
  
  if (text.includes('DS-160 visa photo')) {
    const translations = {
      de: '"Mein DS-160-Visafoto wurde beim ersten Versuch erfolgreich hochgeladen! Keine Gesichtsveränderungen, nur perfekte Komprimierung." - Schließen Sie sich Tausenden von Visumantragstellern an, die Toolaze für sichere Dokumentenverarbeitung vertrauen.',
      es: '"¡Mi foto de visa DS-160 se cargó exitosamente en el primer intento! Sin alteraciones faciales, solo compresión perfecta." - Únete a miles de solicitantes de visa que confían en Toolaze para procesamiento seguro de documentos.',
      fr: '"Ma photo de visa DS-160 a été téléchargée avec succès dès le premier essai! Aucune altération faciale, juste une compression parfaite." - Rejoignez des milliers de demandeurs de visa qui font confiance à Toolaze pour le traitement sécurisé des documents.',
      it: '"La mia foto del visto DS-160 è stata caricata con successo al primo tentativo! Nessuna alterazione facciale, solo compressione perfetta." - Unisciti a migliaia di richiedenti visto che si fidano di Toolaze per l\'elaborazione sicura dei documenti.',
      ja: '"私のDS-160ビザ写真が最初の試行で正常にアップロードされました！顔の変更なし、完璧な圧縮のみ。" - 安全な文書処理のためにToolazeを信頼する何千人ものビザ申請者に参加してください。',
      ko: '"내 DS-160 비자 사진이 첫 시도에서 성공적으로 업로드되었습니다! 얼굴 변경 없이 완벽한 압축만." - 안전한 문서 처리를 위해 Toolaze를 신뢰하는 수천 명의 비자 신청자에 합류하세요.',
      pt: '"Minha foto de visto DS-160 foi carregada com sucesso na primeira tentativa! Sem alterações faciais, apenas compressão perfeita." - Junte-se a milhares de solicitantes de visto que confiam no Toolaze para processamento seguro de documentos.',
      'zh-TW': '"我的 DS-160 簽證照片在第一次嘗試時就成功上傳了！沒有面部更改，只有完美的壓縮。" - 加入數千名信賴 Toolaze 進行安全文件處理的簽證申請者。'
    };
    return translations[lang] || text;
  }
  
  if (text.includes('50KB mark') || text.includes('university application')) {
    const translations = {
      de: '"Habe die 50KB-Marke perfekt für meine Universitätsbewerbung erreicht. Kein Rätselraten mehr!" - Schließen Sie sich Tausenden von Studenten und Fachleuten an, die Toolaze für die Einhaltung von Online-Formularen vertrauen.',
      es: '"¡Alcanzó la marca de 50KB perfectamente para mi solicitud universitaria. ¡No más conjeturas!" - Únete a miles de estudiantes y profesionales que confían en Toolaze para el cumplimiento de formularios en línea.',
      fr: '"Atteint la marque de 50KB parfaitement pour ma candidature universitaire. Plus de devinettes!" - Rejoignez des milliers d\'étudiants et de professionnels qui font confiance à Toolaze pour la conformité des formulaires en ligne.',
      it: '"Raggiunto il segno di 50KB perfettamente per la mia domanda universitaria. Niente più congetture!" - Unisciti a migliaia di studenti e professionisti che si fidano di Toolaze per la conformità dei moduli online.',
      ja: '"大学申請のために50KBマークを完璧に達成しました。推測はもうありません！" - オンラインフォーム準拠のためにToolazeを信頼する何千人もの学生と専門家に参加してください。',
      ko: '"대학 지원을 위해 50KB 목표를 완벽하게 달성했습니다. 더 이상 추측할 필요가 없습니다!" - 온라인 양식 준수를 위해 Toolaze를 신뢰하는 수천 명의 학생 및 전문가에 합류하세요.',
      pt: '"Atingiu a marca de 50KB perfeitamente para minha inscrição universitária. Sem mais adivinhações!" - Junte-se a milhares de estudantes e profissionais que confiam no Toolaze para conformidade com formulários online.',
      'zh-TW': '"完美達到大學申請的 50KB 目標。不再需要猜測！" - 加入數千名信賴 Toolaze 以符合線上表單要求的學生和專業人士。'
    };
    return translations[lang] || text;
  }
  
  if (text.includes('UK passport renewal') || text.includes('passport renewal')) {
    const translations = {
      de: '"Meine UK-Reisepassverlängerung verlief reibungslos! Foto wurde sofort ohne Probleme hochgeladen." - Schließen Sie sich Tausenden von Reisenden an, die Toolaze für die Einhaltung globaler Reisepassverlängerungen vertrauen.',
      es: '"¡Mi renovación de pasaporte del Reino Unido fue sin problemas! La foto se cargó instantáneamente sin ningún problema." - Únete a miles de viajeros que confían en Toolaze para el cumplimiento de renovaciones de pasaporte globales.',
      fr: '"Mon renouvellement de passeport britannique s\'est déroulé sans problème! Photo téléchargée instantanément sans aucun problème." - Rejoignez des milliers de voyageurs qui font confiance à Toolaze pour la conformité du renouvellement de passeport mondial.',
      it: '"Il rinnovo del mio passaporto britannico è andato senza problemi! La foto è stata caricata istantaneamente senza problemi." - Unisciti a migliaia di viaggiatori che si fidano di Toolaze per la conformità del rinnovo del passaporto globale.',
      ja: '"私の英国パスポート更新は順調に進みました！写真が問題なく即座にアップロードされました。" - グローバルなパスポート更新準拠のためにToolazeを信頼する何千人もの旅行者に参加してください。',
      ko: '"영국 여권 갱신이 순조롭게 진행되었습니다! 사진이 문제 없이 즉시 업로드되었습니다." - 전 세계 여권 갱신 준수를 위해 Toolaze를 신뢰하는 수천 명의 여행자에 합류하세요.',
      pt: '"Minha renovação de passaporte do Reino Unido correu sem problemas! Foto carregada instantaneamente sem problemas." - Junte-se a milhares de viajantes que confiam no Toolaze para conformidade com renovações de passaporte globais.',
      'zh-TW': '"我的英國護照續簽進行順利！照片立即上傳，沒有任何問題。" - 加入數千名信賴 Toolaze 進行全球護照續簽合規的旅行者。'
    };
    return translations[lang] || text;
  }
  
  // 通用模式：包含引号和"Join thousands"
  if (text.includes('Join thousands') || text.includes('Join')) {
    const quoteMatch = text.match(/"([^"]+)"/);
    if (quoteMatch) {
      const quote = quoteMatch[1];
      const translations = {
        de: `"${quote}" - Schließen Sie sich Tausenden von Benutzern an, die Toolaze vertrauen.`,
        es: `"${quote}" - Únete a miles de usuarios que confían en Toolaze.`,
        fr: `"${quote}" - Rejoignez des milliers d'utilisateurs qui font confiance à Toolaze.`,
        it: `"${quote}" - Unisciti a migliaia di utenti che si fidano di Toolaze.`,
        ja: `"${quote}" - Toolazeを信頼する何千人ものユーザーに参加してください。`,
        ko: `"${quote}" - Toolaze를 신뢰하는 수천 명의 사용자에 합류하세요.`,
        pt: `"${quote}" - Junte-se a milhares de usuários que confiam no Toolaze.`,
        'zh-TW': `"${quote}" - 加入數千名信賴 Toolaze 的使用者。`
      };
      return translations[lang] || text;
    }
  }
  
  return text;
}

const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'];
const enFile = path.join(__dirname, '../src/data/en/image-compression.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

let totalScenesFixed = 0;
let totalRatingsFixed = 0;

languages.forEach(lang => {
  const filePath = path.join(__dirname, '../src/data', lang, 'image-compression.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let langScenesFixed = 0;
  let langRatingsFixed = 0;
  
  // 修复所有工具的scenes和rating
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool) return;
    
    // 修复scenes[].desc
    if (enTool.scenes && Array.isArray(enTool.scenes)) {
      const enScenes = enTool.scenes;
      const langScenes = langTool.scenes || [];
      
      enScenes.forEach((enScene, idx) => {
        const langScene = langScenes[idx];
        if (!langScene) {
          langScenes[idx] = {
            title: langScenes[idx]?.title || enScene.title,
            icon: enScene.icon,
            desc: translateSceneDesc(enScene.desc, lang)
          };
          langScenesFixed++;
        } else if (!langScene.desc || langScene.desc === enScene.desc) {
          langScene.desc = translateSceneDesc(enScene.desc, lang);
          langScenesFixed++;
        }
      });
      
      langTool.scenes = langScenes;
    }
    
    // 修复rating.text
    if (enTool.rating && enTool.rating.text) {
      const enRatingText = enTool.rating.text;
      const langRatingText = langTool.rating?.text;
      
      if (!langRatingText || langRatingText === enRatingText) {
        if (!langTool.rating) {
          langTool.rating = {};
        }
        langTool.rating.text = translateRatingText(enRatingText, lang);
        langRatingsFixed++;
      }
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langScenesFixed} scene descs, ${langRatingsFixed} ratings`);
  totalScenesFixed += langScenesFixed;
  totalRatingsFixed += langRatingsFixed;
});

console.log(`\n✨ Total fixed: ${totalScenesFixed} scene descriptions, ${totalRatingsFixed} rating texts`);
console.log(`⚠️  Note: Some items may still need manual translation for context-specific content`);
