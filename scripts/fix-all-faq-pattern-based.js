const fs = require('fs');
const path = require('path');

// 基于模式的FAQ翻译 - 处理常见模式和关键词
function translateFaqByPattern(q, a, lang) {
  let translatedQ = q;
  let translatedA = a;
  
  // 问题翻译模式
  if (q.includes('How much can I compress')) {
    const match = q.match(/compress (a|an) (\w+)/);
    const format = match ? match[2] : 'image';
    const translations = {
      de: `Wie viel kann ich eine ${format}-Datei komprimieren?`,
      es: `¿Cuánto puedo comprimir un archivo ${format}?`,
      fr: `Combien puis-je compresser un fichier ${format}?`,
      it: `Quanto posso comprimere un file ${format}?`,
      ja: `${format}ファイルをどのくらい圧縮できますか？`,
      ko: `${format} 파일을 얼마나 압축할 수 있나요?`,
      pt: `Quanto posso comprimir um arquivo ${format}?`,
      'zh-TW': `我可以將 ${format} 檔案壓縮多少？`
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('Will compressing') && q.includes('reduce image quality')) {
    const match = q.match(/compressing (\w+)/);
    const format = match ? match[1] : 'image';
    const translations = {
      de: `Wird die Komprimierung von ${format} die Bildqualität reduzieren?`,
      es: `¿Comprimir ${format} reducirá la calidad de la imagen?`,
      fr: `La compression ${format} réduira-t-elle la qualité de l'image?`,
      it: `Comprimere ${format} ridurrà la qualità dell'immagine?`,
      ja: `${format}を圧縮すると画像の品質が低下しますか？`,
      ko: `${format}를 압축하면 이미지 품질이 감소하나요?`,
      pt: `Comprimir ${format} reduzirá a qualidade da imagem?`,
      'zh-TW': `壓縮 ${format} 會降低圖片品質嗎？`
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('Can I compress multiple') || q.includes('Can I process multiple')) {
    const match = q.match(/(compress|process) multiple (\w+)/);
    const format = match ? match[2] : 'files';
    const translations = {
      de: `Kann ich mehrere ${format}-Dateien gleichzeitig komprimieren?`,
      es: `¿Puedo comprimir múltiples archivos ${format} a la vez?`,
      fr: `Puis-je compresser plusieurs fichiers ${format} à la fois?`,
      it: `Posso comprimere più file ${format} contemporaneamente?`,
      ja: `複数の${format}ファイルを一度に圧縮できますか？`,
      ko: `여러 ${format} 파일을 한 번에 압축할 수 있나요?`,
      pt: `Posso comprimir vários arquivos ${format} de uma vez?`,
      'zh-TW': `我可以一次壓縮多個 ${format} 檔案嗎？`
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('Is') && q.includes('free and secure')) {
    const match = q.match(/Is (\w+) (compression|compression free)/);
    const format = match ? match[1] : 'it';
    const translations = {
      de: `Ist die ${format}-Komprimierung kostenlos und sicher?`,
      es: `¿La compresión ${format} es gratuita y segura?`,
      fr: `La compression ${format} est-elle gratuite et sécurisée?`,
      it: `La compressione ${format} è gratuita e sicura?`,
      ja: `${format}圧縮は無料で安全ですか？`,
      ko: `${format} 압축이 무료이고 안전한가요?`,
      pt: `A compressão ${format} é gratuita e segura?`,
      'zh-TW': `${format} 壓縮是免費且安全的嗎？`
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('What file sizes can I compress') || q.includes('What formats')) {
    const translations = {
      de: 'Welche Dateigrößen kann ich komprimieren?',
      es: '¿Qué tamaños de archivo puedo comprimir?',
      fr: 'Quelles tailles de fichier puis-je compresser?',
      it: 'Quali dimensioni di file posso comprimere?',
      ja: 'どのようなファイルサイズを圧縮できますか？',
      ko: '어떤 파일 크기를 압축할 수 있나요?',
      pt: 'Quais tamanhos de arquivo posso comprimir?',
      'zh-TW': '我可以壓縮哪些檔案大小？'
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('Does the compression preserve') && q.includes('transparency')) {
    const translations = {
      de: 'Erhält die Komprimierung die Transparenz?',
      es: '¿La compresión preserva la transparencia?',
      fr: 'La compression préserve-t-elle la transparence?',
      it: 'La compressione preserva la trasparenza?',
      ja: '圧縮は透明度を保持しますか？',
      ko: '압축이 투명도를 보존하나요?',
      pt: 'A compressão preserva a transparência?',
      'zh-TW': '壓縮會保留透明度嗎？'
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('Does the compressed') && q.includes('maintain the original format')) {
    const translations = {
      de: 'Behält das komprimierte Bild das ursprüngliche Format?',
      es: '¿La imagen comprimida mantiene el formato original?',
      fr: 'L\'image compressée conserve-t-elle le format d\'origine?',
      it: 'L\'immagine compressa mantiene il formato originale?',
      ja: '圧縮された画像は元の形式を維持しますか？',
      ko: '압축된 이미지가 원본 형식을 유지하나요?',
      pt: 'A imagem comprimida mantém o formato original?',
      'zh-TW': '壓縮後的圖片會保持原始格式嗎？'
    };
    translatedQ = translations[lang] || q;
  }
  
  // 答案翻译模式
  if (a.includes('Typically') && a.includes('can be compressed by')) {
    const match = a.match(/compressed by (\d+-\d+%)/);
    const percent = match ? match[1] : '50-70%';
    const translations = {
      de: `Typischerweise können Dateien um ${percent} komprimiert werden, während eine akzeptable visuelle Qualität erhalten bleibt. Die genaue Reduzierung hängt von der ursprünglichen Dateigröße und den Qualitätseinstellungen ab.`,
      es: `Típicamente, los archivos se pueden comprimir entre un ${percent} manteniendo una calidad visual aceptable. La reducción exacta depende del tamaño del archivo original y la configuración de calidad.`,
      fr: `Généralement, les fichiers peuvent être compressés de ${percent} tout en maintenant une qualité visuelle acceptable. La réduction exacte dépend de la taille du fichier original et des paramètres de qualité.`,
      it: `Tipicamente, i file possono essere compressi del ${percent} mantenendo una qualità visiva accettabile. La riduzione esatta dipende dalla dimensione del file originale e dalle impostazioni di qualità.`,
      ja: `通常、ファイルは許容できる視覚品質を維持しながら${percent}圧縮できます。正確な削減は、元のファイルサイズと品質設定によって異なります。`,
      ko: `일반적으로 파일은 허용 가능한 시각적 품질을 유지하면서 ${percent} 압축할 수 있습니다. 정확한 감소는 원본 파일 크기와 품질 설정에 따라 다릅니다.`,
      pt: `Tipicamente, arquivos podem ser comprimidos em ${percent} mantendo qualidade visual aceitável. A redução exata depende do tamanho do arquivo original e configurações de qualidade.`,
      'zh-TW': `通常，檔案可以在保持可接受的視覺品質的同時壓縮 ${percent}。確切的減少取決於原始檔案大小和品質設定。`
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('Yes') && a.includes('Toolaze supports batch')) {
    const translations = {
      de: 'Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Dateien gleichzeitig. Sie können gesamte Sammlungen in einem Vorgang verarbeiten.',
      es: '¡Sí! Toolaze admite procesamiento por lotes de hasta 100 archivos simultáneamente. Puedes procesar colecciones completas en una operación.',
      fr: 'Oui! Toolaze prend en charge le traitement par lots de jusqu\'à 100 fichiers simultanément. Vous pouvez traiter des collections complètes en une seule opération.',
      it: 'Sì! Toolaze supporta l\'elaborazione batch di fino a 100 file contemporaneamente. Puoi elaborare intere collezioni in un\'operazione.',
      ja: 'はい！Toolazeは最大100個のファイルを同時に一括処理できます。1回の操作でコレクション全体を処理できます。',
      ko: '예! Toolaze는 최대 100개의 파일을 동시에 일괄 처리할 수 있습니다. 한 번의 작업으로 전체 컬렉션을 처리할 수 있습니다.',
      pt: 'Sim! Toolaze suporta processamento em lote de até 100 arquivos simultaneamente. Você pode processar coleções completas em uma operação.',
      'zh-TW': '是的！Toolaze 支援同時批次處理最多 100 個檔案。您可以一次操作處理整個集合。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('Yes, Toolaze is completely free') || a.includes('Yes! Toolaze is 100% free')) {
    const translations = {
      de: 'Ja, Toolaze ist für immer völlig kostenlos ohne versteckte Kosten. Am wichtigsten ist, dass die gesamte Komprimierung lokal in Ihrem Browser erfolgt. Ihre Dateien verlassen Ihr Gerät niemals und gewährleisten 100% Privatsphäre und Sicherheit.',
      es: 'Sí, Toolaze es completamente gratuito para siempre sin costos ocultos. Lo más importante es que toda la compresión ocurre localmente en tu navegador. Tus archivos nunca abandonan tu dispositivo, garantizando 100% de privacidad y seguridad.',
      fr: 'Oui, Toolaze est complètement gratuit pour toujours sans coûts cachés. Plus important encore, toute la compression se fait localement dans votre navigateur. Vos fichiers ne quittent jamais votre appareil, garantissant 100% de confidentialité et de sécurité.',
      it: 'Sì, Toolaze è completamente gratuito per sempre senza costi nascosti. Soprattutto, tutta la compressione avviene localmente nel tuo browser. I tuoi file non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza al 100%.',
      ja: 'はい、Toolazeは隠れたコストなしで永久に完全無料です。最も重要なのは、すべての圧縮がブラウザでローカルに実行されることです。ファイルがデバイスを離れることはなく、100%のプライバシーとセキュリティを保証します。',
      ko: '예, Toolaze는 숨겨진 비용 없이 영구적으로 완전 무료입니다. 가장 중요한 것은 모든 압축이 브라우저에서 로컬로 수행된다는 것입니다. 파일이 기기를 떠나지 않아 100% 개인정보 보호와 보안을 보장합니다.',
      pt: 'Sim, Toolaze é completamente gratuito para sempre sem custos ocultos. Mais importante, toda a compressão acontece localmente no seu navegador. Seus arquivos nunca deixam seu dispositivo, garantindo 100% de privacidade e segurança.',
      'zh-TW': '是的，Toolaze 永遠完全免費，沒有隱藏費用。最重要的是，所有壓縮都在您的瀏覽器中本地進行。您的檔案永遠不會離開您的設備，確保 100% 的隱私和安全。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('There are no') && a.includes('file size limits')) {
    const translations = {
      de: 'Es gibt keine individuellen Dateigrößenbeschränkungen. Wenn Ihr Computer die Datei öffnen kann, kann Toolaze sie komprimieren. Sie können Dateien jeder Größe verarbeiten.',
      es: 'No hay límites de tamaño de archivo individual. Si tu computadora puede abrir el archivo, Toolaze puede comprimirlo. Puedes procesar archivos de cualquier tamaño.',
      fr: 'Il n\'y a pas de limites de taille de fichier individuelles. Si votre ordinateur peut ouvrir le fichier, Toolaze peut le compresser. Vous pouvez traiter des fichiers de toute taille.',
      it: 'Non ci sono limiti di dimensione del file individuali. Se il tuo computer può aprire il file, Toolaze può comprimerlo. Puoi elaborare file di qualsiasi dimensione.',
      ja: '個別のファイルサイズ制限はありません。コンピューターがファイルを開ける場合、Toolazeはそれを圧縮できます。任意のサイズのファイルを処理できます。',
      ko: '개별 파일 크기 제한이 없습니다. 컴퓨터가 파일을 열 수 있으면 Toolaze가 압축할 수 있습니다. 모든 크기의 파일을 처리할 수 있습니다.',
      pt: 'Não há limites de tamanho de arquivo individual. Se seu computador pode abrir o arquivo, Toolaze pode comprimi-lo. Você pode processar arquivos de qualquer tamanho.',
      'zh-TW': '沒有個別檔案大小限制。如果您的電腦可以打開檔案，Toolaze 就可以壓縮它。您可以處理任何大小的檔案。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('Yes! Toolaze is specifically designed to preserve')) {
    const translations = {
      de: 'Ja! Toolaze ist speziell dafür entwickelt, die Transparenz während der Komprimierung zu erhalten. Ihre transparenten Hintergründe bleiben perfekt klar.',
      es: '¡Sí! Toolaze está específicamente diseñado para preservar la transparencia durante la compresión. Tus fondos transparentes permanecen perfectamente claros.',
      fr: 'Oui! Toolaze est spécialement conçu pour préserver la transparence pendant la compression. Vos arrière-plans transparents restent parfaitement clairs.',
      it: 'Sì! Toolaze è specificamente progettato per preservare la trasparenza durante la compressione. I tuoi sfondi trasparenti rimangono perfettamente chiari.',
      ja: 'はい！Toolazeは圧縮中に透明度を保持するように特別に設計されています。透明な背景が完全にクリアなままです。',
      ko: '예! Toolaze는 압축 중에 투명도를 보존하도록 특별히 설계되었습니다. 투명한 배경이 완벽하게 선명하게 유지됩니다.',
      pt: 'Sim! Toolaze é especificamente projetado para preservar a transparência durante a compressão. Seus fundos transparentes permanecem perfeitamente claros.',
      'zh-TW': '是的！Toolaze 專門設計用於在壓縮期間保留透明度。您的透明背景保持完全清晰。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (q.includes('Will my') && q.includes('look pixelated')) {
    const translations = {
      de: 'Werden meine Bilder nach der Komprimierung pixelig aussehen?',
      es: '¿Mis imágenes se verán pixeladas después de la compresión?',
      fr: 'Mes images auront-elles l\'air pixellisées après compression?',
      it: 'Le mie immagini sembreranno pixelate dopo la compressione?',
      ja: '圧縮後、画像がピクセル化して見えますか？',
      ko: '압축 후 이미지가 픽셀화되어 보이나요?',
      pt: 'Minhas imagens ficarão pixeladas após a compressão?',
      'zh-TW': '壓縮後我的圖片會看起來有像素化嗎？'
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('Are my') && q.includes('uploaded to a server')) {
    const translations = {
      de: 'Werden meine Dateien auf einen Server hochgeladen?',
      es: '¿Mis archivos se suben a un servidor?',
      fr: 'Mes fichiers sont-ils téléchargés sur un serveur?',
      it: 'I miei file vengono caricati su un server?',
      ja: 'ファイルがサーバーにアップロードされますか？',
      ko: '내 파일이 서버에 업로드되나요?',
      pt: 'Meus arquivos são enviados para um servidor?',
      'zh-TW': '我的檔案會上傳到伺服器嗎？'
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('What\'s the difference between') && q.includes('compression')) {
    const translations = {
      de: 'Was ist der Unterschied zwischen verschiedenen Komprimierungsformaten?',
      es: '¿Cuál es la diferencia entre diferentes formatos de compresión?',
      fr: 'Quelle est la différence entre les différents formats de compression?',
      it: 'Qual è la differenza tra diversi formati di compressione?',
      ja: '異なる圧縮形式の違いは何ですか？',
      ko: '다른 압축 형식의 차이점은 무엇인가요?',
      pt: 'Qual é a diferença entre diferentes formatos de compressão?',
      'zh-TW': '不同壓縮格式之間的差異是什麼？'
    };
    translatedQ = translations[lang] || q;
  }
  
  if (q.includes('Can I use this for')) {
    const translations = {
      de: 'Kann ich dies für verschiedene Zwecke verwenden?',
      es: '¿Puedo usar esto para diferentes propósitos?',
      fr: 'Puis-je l\'utiliser à différentes fins?',
      it: 'Posso usarlo per diversi scopi?',
      ja: 'さまざまな目的に使用できますか？',
      ko: '다양한 목적으로 사용할 수 있나요?',
      pt: 'Posso usar isso para diferentes propósitos?',
      'zh-TW': '我可以將其用於不同目的嗎？'
    };
    translatedQ = translations[lang] || q;
  }
  
  if (a.includes('No. Toolaze uses intelligent compression')) {
    const translations = {
      de: 'Nein. Toolaze verwendet intelligente Komprimierungsalgorithmen, die die visuelle Qualität erhalten und gleichzeitig die Dateigröße reduzieren. Die Komprimierung konzentriert sich darauf, unsichtbare Daten zu entfernen und die Bildstruktur zu optimieren, anstatt die Auflösung unnötig zu reduzieren.',
      es: 'No. Toolaze usa algoritmos de compresión inteligentes que preservan la calidad visual mientras reducen el tamaño del archivo. La compresión se enfoca en eliminar datos invisibles y optimizar la estructura de la imagen en lugar de reducir la resolución innecesariamente.',
      fr: 'Non. Toolaze utilise des algorithmes de compression intelligents qui préservent la qualité visuelle tout en réduisant la taille du fichier. La compression se concentre sur l\'élimination des données invisibles et l\'optimisation de la structure de l\'image plutôt que de réduire inutilement la résolution.',
      it: 'No. Toolaze utilizza algoritmi di compressione intelligenti che preservano la qualità visiva riducendo la dimensione del file. La compressione si concentra sulla rimozione di dati invisibili e sull\'ottimizzazione della struttura dell\'immagine piuttosto che sulla riduzione inutile della risoluzione.',
      ja: 'いいえ。Toolazeは、ファイルサイズを削減しながら視覚品質を保持するインテリジェントな圧縮アルゴリズムを使用します。圧縮は、解像度を不必要に削減するのではなく、見えないデータを削除し、画像構造を最適化することに焦点を当てています。',
      ko: '아니요. Toolaze는 파일 크기를 줄이면서 시각적 품질을 유지하는 지능형 압축 알고리즘을 사용합니다. 압축은 해상도를 불필요하게 낮추는 대신 보이지 않는 데이터를 제거하고 이미지 구조를 최적화하는 데 중점을 둡니다.',
      pt: 'Não. Toolaze usa algoritmos de compressão inteligentes que preservam a qualidade visual enquanto reduzem o tamanho do arquivo. A compressão se concentra em remover dados invisíveis e otimizar a estrutura da imagem em vez de reduzir desnecessariamente a resolução.',
      'zh-TW': '不會。Toolaze 使用智能壓縮演算法，在減少檔案大小的同時保持視覺品質。壓縮專注於移除不可見數據並優化圖像結構，而不是不必要地降低解析度。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('No! All compression happens locally') && a.includes('design')) {
    const translations = {
      de: 'Nein! Die gesamte Komprimierung erfolgt lokal in Ihrem Browser mit JavaScript und Canvas-API. Ihre Design-Assets verlassen Ihr Gerät niemals und gewährleisten vollständige Privatsphäre und Sicherheit für Ihre Designarbeit.',
      es: '¡No! Toda la compresión ocurre localmente en tu navegador usando JavaScript y Canvas API. Tus recursos de diseño nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas para tu trabajo de diseño.',
      fr: 'Non! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos ressources de design ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes pour votre travail de design.',
      it: 'No! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue risorse di design non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete per il tuo lavoro di design.',
      ja: 'いいえ！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。デザインアセットがデバイスを離れることはなく、デザイン作業の完全なプライバシーとセキュリティを保証します。',
      ko: '아니요! 모든 압축은 JavaScript와 Canvas API를 사용하여 브라우저에서 로컬로 수행됩니다. 디자인 자산이 기기를 떠나지 않아 디자인 작업에 대한 완전한 개인정보 보호와 보안을 보장합니다.',
      pt: 'Não! Toda a compressão acontece localmente no seu navegador usando JavaScript e Canvas API. Seus recursos de design nunca deixam seu dispositivo, garantindo privacidade e segurança completas para seu trabalho de design.',
      'zh-TW': '不會！所有壓縮都在您的瀏覽器中使用 JavaScript 和 Canvas API 本地進行。您的設計資源永遠不會離開您的設備，確保您的設計工作完全隱私和安全。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('PNG compression preserves transparency') && a.includes('JPG compression')) {
    const translations = {
      de: 'PNG-Komprimierung erhält Transparenz (Alpha-Kanal) und ist verlustfrei, was sie ideal für Grafiken mit transparenten Hintergründen macht. JPG-Komprimierung entfernt Transparenz und verwendet verlustbehaftete Komprimierung, was für Fotos besser ist, aber für Grafiken, die Transparenz erfordern, ungeeignet ist.',
      es: 'La compresión PNG preserva la transparencia (canal Alpha) y es sin pérdidas, lo que la hace ideal para gráficos con fondos transparentes. La compresión JPG elimina la transparencia y usa compresión con pérdidas, que es mejor para fotografías pero inadecuada para gráficos que requieren transparencia.',
      fr: 'La compression PNG préserve la transparence (canal Alpha) et est sans perte, ce qui la rend idéale pour les graphiques avec des arrière-plans transparents. La compression JPG supprime la transparence et utilise une compression avec perte, ce qui est meilleur pour les photographies mais inadapté aux graphiques nécessitant la transparence.',
      it: 'La compressione PNG preserva la trasparenza (canale Alpha) ed è senza perdita, rendendola ideale per grafici con sfondi trasparenti. La compressione JPG rimuove la trasparenza e usa compressione con perdita, che è migliore per le fotografie ma inadatta per grafici che richiedono trasparenza.',
      ja: 'PNG圧縮は透明度（Alphaチャネル）を保持し、ロスレスであるため、透明な背景を持つグラフィックに最適です。JPG圧縮は透明度を削除し、ロスあり圧縮を使用します。これは写真には適していますが、透明度が必要なグラフィックには適していません。',
      ko: 'PNG 압축은 투명도(Alpha 채널)를 보존하고 무손실이므로 투명한 배경이 있는 그래픽에 이상적입니다. JPG 압축은 투명도를 제거하고 손실 압축을 사용하며, 이는 사진에는 더 좋지만 투명도가 필요한 그래픽에는 적합하지 않습니다.',
      pt: 'A compressão PNG preserva a transparência (canal Alpha) e é sem perdas, tornando-a ideal para gráficos com fundos transparentes. A compressão JPG remove a transparência e usa compressão com perdas, que é melhor para fotografias mas inadequada para gráficos que requerem transparência.',
      'zh-TW': 'PNG 壓縮保留透明度（Alpha 通道）且無損，使其非常適合具有透明背景的圖形。JPG 壓縮會移除透明度並使用有損壓縮，這對照片更好，但不適合需要透明度的圖形。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('Absolutely!') && a.includes('perfect for icons')) {
    const translations = {
      de: 'Absolut! PNG-Komprimierung auf 100KB ist perfekt für Symbole, Logos und Grafiken, die Transparenz erfordern. Die Komprimierung erhält scharfe Kanten und transparente Hintergründe und stellt sicher, dass Ihre Marken-Assets auf jedem Hintergrund professionell aussehen.',
      es: '¡Absolutamente! La compresión PNG a 100KB es perfecta para iconos, logotipos y gráficos que requieren transparencia. La compresión mantiene bordes nítidos y fondos transparentes, asegurando que tus recursos de marca se vean profesionales en cualquier fondo.',
      fr: 'Absolument! La compression PNG à 100KB est parfaite pour les icônes, logos et graphiques qui nécessitent la transparence. La compression maintient des bords nets et des arrière-plans transparents, garantissant que vos ressources de marque ont l\'air professionnelles sur n\'importe quel arrière-plan.',
      it: 'Assolutamente! La compressione PNG a 100KB è perfetta per icone, loghi e grafici che richiedono trasparenza. La compressione mantiene bordi nitidi e sfondi trasparenti, assicurando che le tue risorse di branding sembrino professionali su qualsiasi sfondo.',
      ja: 'もちろん！100KBへのPNG圧縮は、透明度が必要なアイコン、ロゴ、グラフィックに最適です。圧縮はシャープなエッジと透明な背景を維持し、ブランディングアセットがどの背景でもプロフェッショナルに見えるようにします。',
      ko: '물론입니다! 100KB로 PNG 압축은 투명도가 필요한 아이콘, 로고 및 그래픽에 완벽합니다. 압축은 선명한 가장자리와 투명한 배경을 유지하여 브랜딩 자산이 모든 배경에서 전문적으로 보이도록 보장합니다.',
      pt: 'Absolutamente! A compressão PNG para 100KB é perfeita para ícones, logotipos e gráficos que requerem transparência. A compressão mantém bordas nítidas e fundos transparentes, garantindo que seus recursos de marca pareçam profissionais em qualquer fundo.',
      'zh-TW': '當然！PNG 壓縮到 100KB 非常適合需要透明度的圖標、標誌和圖形。壓縮保持銳利的邊緣和透明背景，確保您的品牌資源在任何背景上看起來都很專業。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('Will my compressed photo be accepted by')) {
    const match = a.match(/accepted by (\w+)/);
    const org = match ? match[1] : 'the system';
    const translations = {
      de: `Ja. Toolaze erhält die visuelle Qualität und Authentizität, die für ${org} erforderlich sind, während die strenge Dateigrößenanforderung erfüllt wird.`,
      es: `Sí. Toolaze mantiene la calidad visual y autenticidad requeridas para ${org} mientras cumple con el requisito estricto de tamaño de archivo.`,
      fr: `Oui. Toolaze maintient la qualité visuelle et l'authenticité requises pour ${org} tout en répondant à l'exigence stricte de taille de fichier.`,
      it: `Sì. Toolaze mantiene la qualità visiva e autenticità richieste per ${org} rispettando il requisito rigoroso di dimensione del file.`,
      ja: `はい。Toolazeは、厳格なファイルサイズ要件を満たしながら、${org}に必要な視覚品質と真正性を維持します。`,
      ko: `예. Toolaze는 엄격한 파일 크기 요구사항을 충족하면서 ${org}에 필요한 시각적 품질과 진정성을 유지합니다.`,
      pt: `Sim. Toolaze mantém a qualidade visual e autenticidade necessárias para ${org} enquanto atende ao requisito rigoroso de tamanho de arquivo.`,
      'zh-TW': `是的。Toolaze 在滿足嚴格檔案大小要求的同時，保持 ${org} 所需的視覺品質和真實性。`
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('USCIS requires') || a.includes('requires passport-style photos')) {
    const translations = {
      de: 'USCIS erfordert passfotoartige Fotos, die 2x2 Zoll groß sind, innerhalb der letzten 6 Monate aufgenommen wurden, mit einem einfachen weißen oder cremefarbenen Hintergrund und zeigen Ihr volles Gesicht. Die Dateigröße muss für DS-160-Anwendungen unter 240KB liegen.',
      es: 'USCIS requiere fotos estilo pasaporte que sean de 2x2 pulgadas, tomadas dentro de los últimos 6 meses, con un fondo blanco liso o blanco roto, y que muestren su rostro completo. El tamaño del archivo debe estar por debajo de 240KB para aplicaciones DS-160.',
      fr: 'USCIS exige des photos de style passeport de 2x2 pouces, prises dans les 6 derniers mois, avec un fond blanc uni ou blanc cassé, et montrant votre visage complet. La taille du fichier doit être inférieure à 240KB pour les demandes DS-160.',
      it: 'USCIS richiede foto stile passaporto che siano 2x2 pollici, scattate negli ultimi 6 mesi, con uno sfondo bianco semplice o bianco rotto, e che mostrino il tuo viso completo. La dimensione del file deve essere inferiore a 240KB per le applicazioni DS-160.',
      ja: 'USCISは、2x2インチ、過去6か月以内に撮影された、無地の白またはオフホワイトの背景で、顔全体が写っているパスポートスタイルの写真を要求します。DS-160申請の場合、ファイルサイズは240KB未満である必要があります。',
      ko: 'USCIS는 2x2인치, 지난 6개월 이내에 촬영된, 단색 흰색 또는 오프화이트 배경의 전체 얼굴이 보이는 여권 스타일 사진을 요구합니다. DS-160 신청의 경우 파일 크기는 240KB 미만이어야 합니다.',
      pt: 'USCIS requer fotos estilo passaporte que sejam 2x2 polegadas, tiradas nos últimos 6 meses, com um fundo branco liso ou branco quebrado, e mostrando seu rosto completo. O tamanho do arquivo deve estar abaixo de 240KB para aplicações DS-160.',
      'zh-TW': 'USCIS 要求護照風格的照片，尺寸為 2x2 英寸，在過去 6 個月內拍攝，背景為純白色或米白色，並顯示您的完整臉部。DS-160 申請的檔案大小必須低於 240KB。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('Toolaze supports') && a.includes('formats')) {
    const translations = {
      de: 'Toolaze unterstützt JPG, JPEG, PNG, WebP und BMP Formate. Ihre komprimierte Datei wird in ihrem ursprünglichen Format heruntergeladen.',
      es: 'Toolaze admite formatos JPG, JPEG, PNG, WebP y BMP. Tu archivo comprimido se descargará en su formato original.',
      fr: 'Toolaze prend en charge les formats JPG, JPEG, PNG, WebP et BMP. Votre fichier compressé sera téléchargé dans son format d\'origine.',
      it: 'Toolaze supporta formati JPG, JPEG, PNG, WebP e BMP. Il tuo file compresso verrà scaricato nel suo formato originale.',
      ja: 'ToolazeはJPG、JPEG、PNG、WebP、BMP形式をサポートしています。圧縮されたファイルは元の形式でダウンロードされます。',
      ko: 'Toolaze는 JPG, JPEG, PNG, WebP 및 BMP 형식을 지원합니다. 압축된 파일은 원본 형식으로 다운로드됩니다.',
      pt: 'Toolaze suporta formatos JPG, JPEG, PNG, WebP e BMP. Seu arquivo comprimido será baixado em seu formato original.',
      'zh-TW': 'Toolaze 支援 JPG、JPEG、PNG、WebP 和 BMP 格式。您的壓縮檔案將以其原始格式下載。'
    };
    translatedA = translations[lang] || a;
  }
  
  if (a.includes('Yes, compressed files remain in')) {
    const match = a.match(/remain in (\w+) format/);
    const format = match ? match[1] : 'original';
    const translations = {
      de: `Ja, komprimierte Dateien bleiben im ${format}-Format. Das Tool optimiert die Dateigröße und erhält dabei das ${format}-Format für maximale Kompatibilität.`,
      es: `Sí, los archivos comprimidos permanecen en formato ${format}. La herramienta optimiza el tamaño del archivo mientras preserva el formato ${format} para máxima compatibilidad.`,
      fr: `Oui, les fichiers compressés restent au format ${format}. L'outil optimise la taille du fichier tout en préservant le format ${format} pour une compatibilité maximale.`,
      it: `Sì, i file compressi rimangono in formato ${format}. Lo strumento ottimizza la dimensione del file preservando il formato ${format} per la massima compatibilità.`,
      ja: `はい、圧縮されたファイルは${format}形式のままです。ツールは最大の互換性のために${format}形式を保持しながらファイルサイズを最適化します。`,
      ko: `예, 압축된 파일은 ${format} 형식으로 유지됩니다. 도구는 최대 호환성을 위해 ${format} 형식을 보존하면서 파일 크기를 최적화합니다.`,
      pt: `Sim, arquivos comprimidos permanecem em formato ${format}. A ferramenta otimiza o tamanho do arquivo preservando o formato ${format} para máxima compatibilidade.`,
      'zh-TW': `是的，壓縮後的檔案保持 ${format} 格式。工具在保持 ${format} 格式以實現最大兼容性的同時優化檔案大小。`
    };
    translatedA = translations[lang] || a;
  }
  
  return { q: translatedQ, a: translatedA };
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
  
  // 修复所有工具的faq
  Object.keys(enData).forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool || !enTool.faq || !Array.isArray(enTool.faq)) return;
    
    const enFaq = enTool.faq || [];
    
    // 确保faq数组存在
    if (!langTool.faq) {
      langTool.faq = [];
    }
    
    const langFaq = langTool.faq || [];
    
    // 如果长度不匹配，重新创建
    if (enFaq.length !== langFaq.length) {
      langTool.faq = enFaq.map(faq => {
        const translated = translateFaqByPattern(faq.q, faq.a, lang);
        return {
          q: translated.q,
          a: translated.a
        };
      });
      langFixed += enFaq.length * 2;
    } else {
      // 如果长度匹配，检查并修复每个FAQ
      enFaq.forEach((enFaqItem, idx) => {
        const langFaqItem = langFaq[idx];
        if (!langFaqItem) {
          const translated = translateFaqByPattern(enFaqItem.q, enFaqItem.a, lang);
          langFaq[idx] = {
            q: translated.q,
            a: translated.a
          };
          langFixed += 2;
          return;
        }
        
        // 如果问题或答案与英文相同，尝试翻译
        if (!langFaqItem.q || langFaqItem.q === enFaqItem.q) {
          const translated = translateFaqByPattern(enFaqItem.q, enFaqItem.a, lang);
          langFaqItem.q = translated.q;
          langFixed++;
        }
        
        if (!langFaqItem.a || langFaqItem.a === enFaqItem.a) {
          const translated = translateFaqByPattern(enFaqItem.q, enFaqItem.a, lang);
          langFaqItem.a = translated.a;
          langFixed++;
        }
      });
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} FAQ items`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} FAQ translations`);
console.log(`⚠️  Note: Some FAQ items may still need manual translation for context-specific content`);
