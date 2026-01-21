const fs = require('fs');
const path = require('path');

// 扩展的FAQ翻译模板 - 包含更多常见问题和答案
const faqTranslations = {
  // 常见问题模式
  questions: {
    'How much can I compress a JPG file?': {
      de: 'Wie viel kann ich eine JPG-Datei komprimieren?',
      es: '¿Cuánto puedo comprimir un archivo JPG?',
      fr: 'Combien puis-je compresser un fichier JPG?',
      it: 'Quanto posso comprimere un file JPG?',
      ja: 'JPGファイルをどのくらい圧縮できますか？',
      ko: 'JPG 파일을 얼마나 압축할 수 있나요?',
      pt: 'Quanto posso comprimir um arquivo JPG?',
      'zh-TW': '我可以將 JPG 檔案壓縮多少？'
    },
    'Will compressing JPG reduce image quality?': {
      de: 'Wird die Komprimierung von JPG die Bildqualität reduzieren?',
      es: '¿Comprimir JPG reducirá la calidad de la imagen?',
      fr: 'La compression JPG réduira-t-elle la qualité de l\'image?',
      it: 'Comprimere JPG ridurrà la qualità dell\'immagine?',
      ja: 'JPGを圧縮すると画像の品質が低下しますか？',
      ko: 'JPG를 압축하면 이미지 품질이 감소하나요?',
      pt: 'Comprimir JPG reduzirá a qualidade da imagem?',
      'zh-TW': '壓縮 JPG 會降低圖片品質嗎？'
    },
    'Can I compress multiple JPG files at once?': {
      de: 'Kann ich mehrere JPG-Dateien gleichzeitig komprimieren?',
      es: '¿Puedo comprimir múltiples archivos JPG a la vez?',
      fr: 'Puis-je compresser plusieurs fichiers JPG à la fois?',
      it: 'Posso comprimere più file JPG contemporaneamente?',
      ja: '複数のJPGファイルを一度に圧縮できますか？',
      ko: '여러 JPG 파일을 한 번에 압축할 수 있나요?',
      pt: 'Posso comprimir vários arquivos JPG de uma vez?',
      'zh-TW': '我可以一次壓縮多個 JPG 檔案嗎？'
    },
    'Is JPG compression free and secure?': {
      de: 'Ist die JPG-Komprimierung kostenlos und sicher?',
      es: '¿La compresión JPG es gratuita y segura?',
      fr: 'La compression JPG est-elle gratuite et sécurisée?',
      it: 'La compressione JPG è gratuita e sicura?',
      ja: 'JPG圧縮は無料で安全ですか？',
      ko: 'JPG 압축이 무료이고 안전한가요?',
      pt: 'A compressão JPG é gratuita e segura?',
      'zh-TW': 'JPG 壓縮是免費且安全的嗎？'
    },
    'What file sizes can I compress?': {
      de: 'Welche Dateigrößen kann ich komprimieren?',
      es: '¿Qué tamaños de archivo puedo comprimir?',
      fr: 'Quelles tailles de fichier puis-je compresser?',
      it: 'Quali dimensioni di file posso comprimere?',
      ja: 'どのようなファイルサイズを圧縮できますか？',
      ko: '어떤 파일 크기를 압축할 수 있나요?',
      pt: 'Quais tamanhos de arquivo posso comprimir?',
      'zh-TW': '我可以壓縮哪些檔案大小？'
    },
    'Does the compression preserve PNG transparency?': {
      de: 'Erhält die Komprimierung die PNG-Transparenz?',
      es: '¿La compresión preserva la transparencia PNG?',
      fr: 'La compression préserve-t-elle la transparence PNG?',
      it: 'La compressione preserva la trasparenza PNG?',
      ja: '圧縮はPNGの透明度を保持しますか？',
      ko: '압축이 PNG 투명도를 보존하나요?',
      pt: 'A compressão preserva a transparência PNG?',
      'zh-TW': '壓縮會保留 PNG 透明度嗎？'
    },
    'Can I process multiple PNG files at once?': {
      de: 'Kann ich mehrere PNG-Dateien gleichzeitig verarbeiten?',
      es: '¿Puedo procesar múltiples archivos PNG a la vez?',
      fr: 'Puis-je traiter plusieurs fichiers PNG à la fois?',
      it: 'Posso elaborare più file PNG contemporaneamente?',
      ja: '複数のPNGファイルを一度に処理できますか？',
      ko: '여러 PNG 파일을 한 번에 처리할 수 있나요?',
      pt: 'Posso processar vários arquivos PNG de uma vez?',
      'zh-TW': '我可以一次處理多個 PNG 檔案嗎？'
    },
    'Which image formats are supported?': {
      de: 'Welche Bildformate werden unterstützt?',
      es: '¿Qué formatos de imagen son compatibles?',
      fr: 'Quels formats d\'image sont pris en charge?',
      it: 'Quali formati di immagine sono supportati?',
      ja: 'どの画像形式がサポートされていますか？',
      ko: '어떤 이미지 형식이 지원되나요?',
      pt: 'Quais formatos de imagem são suportados?',
      'zh-TW': '支援哪些圖片格式？'
    },
    'Is the compression really free?': {
      de: 'Ist die Komprimierung wirklich kostenlos?',
      es: '¿La compresión es realmente gratuita?',
      fr: 'La compression est-elle vraiment gratuite?',
      it: 'La compressione è davvero gratuita?',
      ja: '圧縮は本当に無料ですか？',
      ko: '압축이 정말 무료인가요?',
      pt: 'A compressão é realmente gratuita?',
      'zh-TW': '壓縮真的免費嗎？'
    },
    'Will my passport photo be blurred after compression?': {
      de: 'Wird mein Reisepassfoto nach der Komprimierung unscharf?',
      es: '¿Mi foto de pasaporte se verá borrosa después de la compresión?',
      fr: 'Ma photo de passeport sera-t-elle floue après compression?',
      it: 'La mia foto del passaporto sarà sfocata dopo la compressione?',
      ja: '圧縮後、パスポート写真はぼやけますか？',
      ko: '압축 후 여권 사진이 흐려지나요?',
      pt: 'Minha foto de passaporte ficará embaçada após a compressão?',
      'zh-TW': '壓縮後我的護照照片會模糊嗎？'
    },
    'Can I use this for multiple family members?': {
      de: 'Kann ich dies für mehrere Familienmitglieder verwenden?',
      es: '¿Puedo usar esto para múltiples miembros de la familia?',
      fr: 'Puis-je l\'utiliser pour plusieurs membres de la famille?',
      it: 'Posso usarlo per più membri della famiglia?',
      ja: '複数の家族メンバーに使用できますか？',
      ko: '여러 가족 구성원에게 사용할 수 있나요?',
      pt: 'Posso usar isso para vários membros da família?',
      'zh-TW': '我可以為多個家庭成員使用嗎？'
    },
    'Does the compressed JPG maintain the original format?': {
      de: 'Behält das komprimierte JPG das ursprüngliche Format?',
      es: '¿El JPG comprimido mantiene el formato original?',
      fr: 'Le JPG compressé conserve-t-il le format d\'origine?',
      it: 'Il JPG compresso mantiene il formato originale?',
      ja: '圧縮されたJPGは元の形式を維持しますか？',
      ko: '압축된 JPG가 원본 형식을 유지하나요?',
      pt: 'O JPG comprimido mantém o formato original?',
      'zh-TW': '壓縮後的 JPG 會保持原始格式嗎？'
    },
    'What if my photo can\'t reach 240KB without losing quality?': {
      de: 'Was ist, wenn mein Foto 240KB nicht erreichen kann, ohne Qualität zu verlieren?',
      es: '¿Qué pasa si mi foto no puede alcanzar 240KB sin perder calidad?',
      fr: 'Que se passe-t-il si ma photo ne peut pas atteindre 240KB sans perdre en qualité?',
      it: 'E se la mia foto non può raggiungere 240KB senza perdere qualità?',
      ja: '品質を失うことなく240KBに達しない場合はどうなりますか？',
      ko: '품질을 잃지 않고 240KB에 도달할 수 없는 경우는 어떻게 되나요?',
      pt: 'E se minha foto não conseguir atingir 240KB sem perder qualidade?',
      'zh-TW': '如果我的照片無法在不損失品質的情況下達到 240KB 怎麼辦？'
    },
    'Does the tool edit or beautify my face?': {
      de: 'Bearbeitet oder verschönert das Tool mein Gesicht?',
      es: '¿La herramienta edita o embellece mi rostro?',
      fr: 'L\'outil modifie-t-il ou embellit-il mon visage?',
      it: 'Lo strumento modifica o abbellisce il mio viso?',
      ja: 'ツールは私の顔を編集または美化しますか？',
      ko: '도구가 내 얼굴을 편집하거나 미화하나요?',
      pt: 'A ferramenta edita ou embeleza meu rosto?',
      'zh-TW': '工具會編輯或美化我的臉部嗎？'
    }
  },
  
  // 常见答案模式
  answers: {
    'Typically, JPG files can be compressed by 50-70% while maintaining acceptable visual quality. The exact reduction depends on the original file size and quality settings.': {
      de: 'Typischerweise können JPG-Dateien um 50-70% komprimiert werden, während eine akzeptable visuelle Qualität erhalten bleibt. Die genaue Reduzierung hängt von der ursprünglichen Dateigröße und den Qualitätseinstellungen ab.',
      es: 'Típicamente, los archivos JPG se pueden comprimir entre un 50-70% manteniendo una calidad visual aceptable. La reducción exacta depende del tamaño del archivo original y la configuración de calidad.',
      fr: 'Généralement, les fichiers JPG peuvent être compressés de 50 à 70% tout en maintenant une qualité visuelle acceptable. La réduction exacte dépend de la taille du fichier original et des paramètres de qualité.',
      it: 'Tipicamente, i file JPG possono essere compressi del 50-70% mantenendo una qualità visiva accettabile. La riduzione esatta dipende dalla dimensione del file originale e dalle impostazioni di qualità.',
      ja: '通常、JPGファイルは許容できる視覚品質を維持しながら50-70%圧縮できます。正確な削減は、元のファイルサイズと品質設定によって異なります。',
      ko: '일반적으로 JPG 파일은 허용 가능한 시각적 품질을 유지하면서 50-70% 압축할 수 있습니다. 정확한 감소는 원본 파일 크기와 품질 설정에 따라 다릅니다.',
      pt: 'Tipicamente, arquivos JPG podem ser comprimidos em 50-70% mantendo qualidade visual aceitável. A redução exata depende do tamanho do arquivo original e configurações de qualidade.',
      'zh-TW': '通常，JPG 檔案可以在保持可接受的視覺品質的同時壓縮 50-70%。確切的減少取決於原始檔案大小和品質設定。'
    },
    'Some quality reduction is expected with compression, but our tool optimizes the compression to maintain visual quality while meeting your target file size.': {
      de: 'Bei der Komprimierung ist eine gewisse Qualitätsreduzierung zu erwarten, aber unser Tool optimiert die Komprimierung, um die visuelle Qualität zu erhalten und gleichzeitig Ihre Ziel-Dateigröße zu erreichen.',
      es: 'Se espera cierta reducción de calidad con la compresión, pero nuestra herramienta optimiza la compresión para mantener la calidad visual mientras cumple con el tamaño de archivo objetivo.',
      fr: 'Une certaine réduction de qualité est attendue avec la compression, mais notre outil optimise la compression pour maintenir la qualité visuelle tout en répondant à votre taille de fichier cible.',
      it: 'È prevista una certa riduzione della qualità con la compressione, ma il nostro strumento ottimizza la compressione per mantenere la qualità visiva rispettando la dimensione del file obiettivo.',
      ja: '圧縮により品質の低下が予想されますが、当社のツールは目標ファイルサイズを満たしながら視覚品質を維持するように圧縮を最適化します。',
      ko: '압축으로 인해 품질 감소가 예상되지만, 당사의 도구는 목표 파일 크기를 충족하면서 시각적 품질을 유지하도록 압축을 최적화합니다.',
      pt: 'Alguma redução de qualidade é esperada com a compressão, mas nossa ferramenta otimiza a compressão para manter a qualidade visual enquanto atende ao tamanho de arquivo alvo.',
      'zh-TW': '壓縮時會有一些品質下降，但我們的工具會優化壓縮以在達到目標檔案大小的同時保持視覺品質。'
    },
    'Yes, Toolaze supports batch compression of up to 100 JPG files per session. You can process entire photo collections in one operation.': {
      de: 'Ja, Toolaze unterstützt die Stapelkomprimierung von bis zu 100 JPG-Dateien pro Sitzung. Sie können gesamte Fotosammlungen in einem Vorgang verarbeiten.',
      es: 'Sí, Toolaze admite compresión por lotes de hasta 100 archivos JPG por sesión. Puedes procesar colecciones completas de fotos en una operación.',
      fr: 'Oui, Toolaze prend en charge la compression par lots de jusqu\'à 100 fichiers JPG par session. Vous pouvez traiter des collections complètes de photos en une seule opération.',
      it: 'Sì, Toolaze supporta la compressione batch di fino a 100 file JPG per sessione. Puoi elaborare intere collezioni di foto in un\'operazione.',
      ja: 'はい、Toolazeはセッションあたり最大100個のJPGファイルの一括圧縮をサポートしています。1回の操作で写真コレクション全体を処理できます。',
      ko: '예, Toolaze는 세션당 최대 100개의 JPG 파일 일괄 압축을 지원합니다. 한 번의 작업으로 전체 사진 컬렉션을 처리할 수 있습니다.',
      pt: 'Sim, Toolaze suporta compressão em lote de até 100 arquivos JPG por sessão. Você pode processar coleções completas de fotos em uma operação.',
      'zh-TW': '是的，Toolaze 支援每個會話批次壓縮最多 100 個 JPG 檔案。您可以一次操作處理整個照片集合。'
    },
    'Yes, Toolaze is completely free forever with no hidden costs. Most importantly, all compression happens locally in your browser. Your JPG files never leave your device—ensuring 100% privacy and security.': {
      de: 'Ja, Toolaze ist für immer völlig kostenlos ohne versteckte Kosten. Am wichtigsten ist, dass die gesamte Komprimierung lokal in Ihrem Browser erfolgt. Ihre JPG-Dateien verlassen Ihr Gerät niemals und gewährleisten 100% Privatsphäre und Sicherheit.',
      es: 'Sí, Toolaze es completamente gratuito para siempre sin costos ocultos. Lo más importante es que toda la compresión ocurre localmente en tu navegador. Tus archivos JPG nunca abandonan tu dispositivo, garantizando 100% de privacidad y seguridad.',
      fr: 'Oui, Toolaze est complètement gratuit pour toujours sans coûts cachés. Plus important encore, toute la compression se fait localement dans votre navigateur. Vos fichiers JPG ne quittent jamais votre appareil, garantissant 100% de confidentialité et de sécurité.',
      it: 'Sì, Toolaze è completamente gratuito per sempre senza costi nascosti. Soprattutto, tutta la compressione avviene localmente nel tuo browser. I tuoi file JPG non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza al 100%.',
      ja: 'はい、Toolazeは隠れたコストなしで永久に完全無料です。最も重要なのは、すべての圧縮がブラウザでローカルに実行されることです。JPGファイルがデバイスを離れることはなく、100%のプライバシーとセキュリティを保証します。',
      ko: '예, Toolaze는 숨겨진 비용 없이 영구적으로 완전 무료입니다. 가장 중요한 것은 모든 압축이 브라우저에서 로컬로 수행된다는 것입니다. JPG 파일이 기기를 떠나지 않아 100% 개인정보 보호와 보안을 보장합니다.',
      pt: 'Sim, Toolaze é completamente gratuito para sempre sem custos ocultos. Mais importante, toda a compressão acontece localmente no seu navegador. Seus arquivos JPG nunca deixam seu dispositivo, garantindo 100% de privacidade e segurança.',
      'zh-TW': '是的，Toolaze 永遠完全免費，沒有隱藏費用。最重要的是，所有壓縮都在您的瀏覽器中本地進行。您的 JPG 檔案永遠不會離開您的設備，確保 100% 的隱私和安全。'
    },
    'There are no individual file size limits. If your computer can open the file, Toolaze can compress it. You can process files of any size.': {
      de: 'Es gibt keine individuellen Dateigrößenbeschränkungen. Wenn Ihr Computer die Datei öffnen kann, kann Toolaze sie komprimieren. Sie können Dateien jeder Größe verarbeiten.',
      es: 'No hay límites de tamaño de archivo individual. Si tu computadora puede abrir el archivo, Toolaze puede comprimirlo. Puedes procesar archivos de cualquier tamaño.',
      fr: 'Il n\'y a pas de limites de taille de fichier individuelles. Si votre ordinateur peut ouvrir le fichier, Toolaze peut le compresser. Vous pouvez traiter des fichiers de toute taille.',
      it: 'Non ci sono limiti di dimensione del file individuali. Se il tuo computer può aprire il file, Toolaze può comprimerlo. Puoi elaborare file di qualsiasi dimensione.',
      ja: '個別のファイルサイズ制限はありません。コンピューターがファイルを開ける場合、Toolazeはそれを圧縮できます。任意のサイズのファイルを処理できます。',
      ko: '개별 파일 크기 제한이 없습니다. 컴퓨터가 파일을 열 수 있으면 Toolaze가 압축할 수 있습니다. 모든 크기의 파일을 처리할 수 있습니다.',
      pt: 'Não há limites de tamanho de arquivo individual. Se seu computador pode abrir o arquivo, Toolaze pode comprimi-lo. Você pode processar arquivos de qualquer tamanho.',
      'zh-TW': '沒有個別檔案大小限制。如果您的電腦可以打開檔案，Toolaze 就可以壓縮它。您可以處理任何大小的檔案。'
    },
    'Yes! Toolaze is specifically designed to preserve the Alpha channel during compression. Your transparent backgrounds remain perfectly clear, making it ideal for logos, icons, and graphics that need to blend with any background.': {
      de: 'Ja! Toolaze ist speziell dafür entwickelt, den Alpha-Kanal während der Komprimierung zu erhalten. Ihre transparenten Hintergründe bleiben perfekt klar, was es ideal für Logos, Symbole und Grafiken macht, die sich mit jedem Hintergrund vermischen müssen.',
      es: '¡Sí! Toolaze está específicamente diseñado para preservar el canal Alpha durante la compresión. Tus fondos transparentes permanecen perfectamente claros, lo que lo hace ideal para logotipos, iconos y gráficos que necesitan mezclarse con cualquier fondo.',
      fr: 'Oui! Toolaze est spécialement conçu pour préserver le canal Alpha pendant la compression. Vos arrière-plans transparents restent parfaitement clairs, ce qui le rend idéal pour les logos, icônes et graphiques qui doivent se fondre avec n\'importe quel arrière-plan.',
      it: 'Sì! Toolaze è specificamente progettato per preservare il canale Alpha durante la compressione. I tuoi sfondi trasparenti rimangono perfettamente chiari, rendendolo ideale per loghi, icone e grafiche che devono fondersi con qualsiasi sfondo.',
      ja: 'はい！Toolazeは圧縮中にAlphaチャネルを保持するように特別に設計されています。透明な背景が完全にクリアなままなので、あらゆる背景とブレンドする必要があるロゴ、アイコン、グラフィックに最適です。',
      ko: '예! Toolaze는 압축 중에 Alpha 채널을 보존하도록 특별히 설계되었습니다. 투명한 배경이 완벽하게 선명하게 유지되어 모든 배경과 혼합해야 하는 로고, 아이콘 및 그래픽에 이상적입니다.',
      pt: 'Sim! Toolaze é especificamente projetado para preservar o canal Alpha durante a compressão. Seus fundos transparentes permanecem perfeitamente claros, tornando-o ideal para logotipos, ícones e gráficos que precisam se misturar com qualquer fundo.',
      'zh-TW': '是的！Toolaze 專門設計用於在壓縮期間保留 Alpha 通道。您的透明背景保持完全清晰，使其非常適合需要與任何背景混合的標誌、圖標和圖形。'
    },
    'Toolaze supports JPG, JPEG, PNG, WebP, and BMP formats. Your compressed file will be downloaded in its original format, ensuring maximum compatibility with any online form or application system.': {
      de: 'Toolaze unterstützt JPG-, JPEG-, PNG-, WebP- und BMP-Formate. Ihre komprimierte Datei wird in ihrem ursprünglichen Format heruntergeladen und gewährleistet maximale Kompatibilität mit jedem Online-Formular oder Anwendungssystem.',
      es: 'Toolaze admite formatos JPG, JPEG, PNG, WebP y BMP. Tu archivo comprimido se descargará en su formato original, garantizando la máxima compatibilidad con cualquier formulario en línea o sistema de aplicación.',
      fr: 'Toolaze prend en charge les formats JPG, JPEG, PNG, WebP et BMP. Votre fichier compressé sera téléchargé dans son format d\'origine, garantissant une compatibilité maximale avec tout formulaire en ligne ou système d\'application.',
      it: 'Toolaze supporta formati JPG, JPEG, PNG, WebP e BMP. Il tuo file compresso verrà scaricato nel suo formato originale, garantendo la massima compatibilità con qualsiasi modulo online o sistema di applicazione.',
      ja: 'ToolazeはJPG、JPEG、PNG、WebP、BMP形式をサポートしています。圧縮されたファイルは元の形式でダウンロードされ、オンラインフォームやアプリケーションシステムとの最大の互換性を保証します。',
      ko: 'Toolaze는 JPG, JPEG, PNG, WebP 및 BMP 형식을 지원합니다. 압축된 파일은 원본 형식으로 다운로드되어 모든 온라인 양식 또는 애플리케이션 시스템과의 최대 호환성을 보장합니다.',
      pt: 'Toolaze suporta formatos JPG, JPEG, PNG, WebP e BMP. Seu arquivo comprimido será baixado em seu formato original, garantindo máxima compatibilidade com qualquer formulário online ou sistema de aplicação.',
      'zh-TW': 'Toolaze 支援 JPG、JPEG、PNG、WebP 和 BMP 格式。您的壓縮檔案將以其原始格式下載，確保與任何線上表單或應用系統的最大兼容性。'
    },
    'Yes! Toolaze is 100% free with no ads, no premium tiers, and no limits on the number of times you use it. All compression happens locally in your browser, so there are no server costs or subscription fees.': {
      de: 'Ja! Toolaze ist zu 100% kostenlos ohne Werbung, ohne Premium-Stufen und ohne Begrenzung der Nutzungshäufigkeit. Die gesamte Komprimierung erfolgt lokal in Ihrem Browser, sodass keine Serverkosten oder Abonnementgebühren anfallen.',
      es: '¡Sí! Toolaze es 100% gratuito sin anuncios, sin niveles premium y sin límites en la cantidad de veces que lo usas. Toda la compresión ocurre localmente en tu navegador, por lo que no hay costos de servidor ni tarifas de suscripción.',
      fr: 'Oui! Toolaze est 100% gratuit sans publicité, sans niveaux premium et sans limite sur le nombre de fois que vous l\'utilisez. Toute la compression se fait localement dans votre navigateur, donc il n\'y a pas de coûts de serveur ni de frais d\'abonnement.',
      it: 'Sì! Toolaze è gratuito al 100% senza pubblicità, senza livelli premium e senza limiti sul numero di volte che lo usi. Tutta la compressione avviene localmente nel tuo browser, quindi non ci sono costi del server o tariffe di abbonamento.',
      ja: 'はい！Toolazeは100%無料で、広告もプレミアム階層も使用回数の制限もありません。すべての圧縮はブラウザでローカルに実行されるため、サーバーコストやサブスクリプション料金はありません。',
      ko: '예! Toolaze는 광고 없이, 프리미엄 등급 없이, 사용 횟수 제한 없이 100% 무료입니다. 모든 압축은 브라우저에서 로컬로 수행되므로 서버 비용이나 구독료가 없습니다.',
      pt: 'Sim! Toolaze é 100% gratuito sem anúncios, sem níveis premium e sem limites no número de vezes que você o usa. Toda a compressão acontece localmente no seu navegador, então não há custos de servidor ou taxas de assinatura.',
      'zh-TW': '是的！Toolaze 100% 免費，無廣告、無高級層級，且無使用次數限制。所有壓縮都在您的瀏覽器中本地進行，因此沒有服務器成本或訂閱費用。'
    },
    'No. 200KB provides plenty of space for a sharp headshot. Toolaze prioritizes detail retention and facial clarity while meeting the size target. The compression algorithm focuses on removing invisible data rather than reducing visual quality.': {
      de: 'Nein. 200KB bieten viel Platz für ein scharfes Porträtfoto. Toolaze priorisiert Detailerhaltung und Gesichtsklarität und erfüllt dabei das Größenziel. Der Komprimierungsalgorithmus konzentriert sich darauf, unsichtbare Daten zu entfernen, anstatt die visuelle Qualität zu reduzieren.',
      es: 'No. 200KB proporciona mucho espacio para una foto de cabeza nítida. Toolaze prioriza la retención de detalles y la claridad facial mientras cumple con el objetivo de tamaño. El algoritmo de compresión se enfoca en eliminar datos invisibles en lugar de reducir la calidad visual.',
      fr: 'Non. 200KB offrent beaucoup d\'espace pour une photo de tête nette. Toolaze priorise la rétention des détails et la clarté faciale tout en répondant à l\'objectif de taille. L\'algorithme de compression se concentre sur l\'élimination des données invisibles plutôt que sur la réduction de la qualité visuelle.',
      it: 'No. 200KB forniscono molto spazio per un ritratto nitido. Toolaze dà priorità alla conservazione dei dettagli e alla chiarezza facciale rispettando l\'obiettivo di dimensione. L\'algorithme di compressione si concentra sulla rimozione di dati invisibili piuttosto che sulla riduzione della qualità visiva.',
      ja: 'いいえ。200KBは鮮明な顔写真に十分なスペースを提供します。Toolazeはサイズ目標を満たしながら、詳細の保持と顔の明確さを優先します。圧縮アルゴリズムは、視覚品質を低下させるのではなく、見えないデータを削除することに焦点を当てています。',
      ko: '아니요. 200KB는 선명한 얼굴 사진에 충분한 공간을 제공합니다. Toolaze는 크기 목표를 충족하면서 세부 사항 보존과 얼굴 선명도를 우선시합니다. 압축 알고리즘은 시각적 품질을 낮추는 대신 보이지 않는 데이터를 제거하는 데 중점을 둡니다.',
      pt: 'Não. 200KB fornece muito espaço para uma foto de cabeça nítida. Toolaze prioriza a retenção de detalhes e clareza facial enquanto atende ao objetivo de tamanho. O algoritmo de compressão foca em remover dados invisíveis em vez de reduzir a qualidade visual.',
      'zh-TW': '不會。200KB 為清晰的頭像照片提供了充足的空間。Toolaze 在達到大小目標的同時優先考慮細節保留和面部清晰度。壓縮演算法專注於移除不可見數據，而不是降低視覺品質。'
    },
    'Yes! Toolaze supports batch processing of up to 100 passport photos simultaneously. Perfect for processing photos for entire family travel applications or multiple renewal submissions efficiently.': {
      de: 'Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Reisepassfotos gleichzeitig. Perfekt für die Verarbeitung von Fotos für gesamte Familienreiseanträge oder mehrere Verlängerungseinreichungen effizient.',
      es: '¡Sí! Toolaze admite procesamiento por lotes de hasta 100 fotos de pasaporte simultáneamente. Perfecto para procesar fotos para solicitudes de viaje familiar completas o múltiples envíos de renovación de manera eficiente.',
      fr: 'Oui! Toolaze prend en charge le traitement par lots de jusqu\'à 100 photos de passeport simultanément. Parfait pour traiter efficacement les photos pour les demandes de voyage familiales complètes ou plusieurs soumissions de renouvellement.',
      it: 'Sì! Toolaze supporta l\'elaborazione batch di fino a 100 foto del passaporto contemporaneamente. Perfetto per elaborare foto per intere domande di viaggio familiari o più invii di rinnovo in modo efficiente.',
      ja: 'はい！Toolazeは最大100枚のパスポート写真を同時に一括処理できます。家族全員の旅行申請や複数の更新提出用の写真を効率的に処理するのに最適です。',
      ko: '예! Toolaze는 최대 100개의 여권 사진을 동시에 일괄 처리할 수 있습니다. 전체 가족 여행 신청 또는 여러 갱신 제출을 위한 사진을 효율적으로 처리하는 데 완벽합니다.',
      pt: 'Sim! Toolaze suporta processamento em lote de até 100 fotos de passaporte simultaneamente. Perfeito para processar fotos para solicitações de viagem familiar completas ou múltiplos envios de renovação com eficiência.',
      'zh-TW': '是的！Toolaze 支援同時批次處理最多 100 張護照照片。非常適合高效處理整個家庭旅行申請或多個續簽提交的照片。'
    },
    'Yes, compressed files remain in JPG format. The tool optimizes the file size while preserving the JPG format for maximum compatibility.': {
      de: 'Ja, komprimierte Dateien bleiben im JPG-Format. Das Tool optimiert die Dateigröße und erhält dabei das JPG-Format für maximale Kompatibilität.',
      es: 'Sí, los archivos comprimidos permanecen en formato JPG. La herramienta optimiza el tamaño del archivo mientras preserva el formato JPG para máxima compatibilidad.',
      fr: 'Oui, les fichiers compressés restent au format JPG. L\'outil optimise la taille du fichier tout en préservant le format JPG pour une compatibilité maximale.',
      it: 'Sì, i file compressi rimangono in formato JPG. Lo strumento ottimizza la dimensione del file preservando il formato JPG per la massima compatibilità.',
      ja: 'はい、圧縮されたファイルはJPG形式のままです。ツールは最大の互換性のためにJPG形式を保持しながらファイルサイズを最適化します。',
      ko: '예, 압축된 파일은 JPG 형식으로 유지됩니다. 도구는 최대 호환성을 위해 JPG 형식을 보존하면서 파일 크기를 최적화합니다.',
      pt: 'Sim, arquivos comprimidos permanecem em formato JPG. A ferramenta otimiza o tamanho do arquivo preservando o formato JPG para máxima compatibilidade.',
      'zh-TW': '是的，壓縮後的檔案保持 JPG 格式。工具在保持 JPG 格式以實現最大兼容性的同時優化檔案大小。'
    },
    'For very high-resolution originals, the tool will automatically adjust both quality settings and dimensions to ensure the 240KB target is met. The algorithm prioritizes facial clarity and maintains sufficient resolution for immigration verification while meeting the strict file size requirement.': {
      de: 'Für sehr hochauflösende Originale passt das Tool automatisch sowohl Qualitätseinstellungen als auch Abmessungen an, um sicherzustellen, dass das 240KB-Ziel erreicht wird. Der Algorithmus priorisiert Gesichtsklarität und erhält ausreichende Auflösung für die Einwanderungsüberprüfung und erfüllt dabei die strenge Dateigrößenanforderung.',
      es: 'Para originales de muy alta resolución, la herramienta ajustará automáticamente tanto la configuración de calidad como las dimensiones para asegurar que se cumpla el objetivo de 240KB. El algoritmo prioriza la claridad facial y mantiene suficiente resolución para la verificación de inmigración mientras cumple con el requisito estricto de tamaño de archivo.',
      fr: 'Pour les originaux très haute résolution, l\'outil ajustera automatiquement à la fois les paramètres de qualité et les dimensions pour s\'assurer que l\'objectif de 240KB est atteint. L\'algorithme priorise la clarté faciale et maintient une résolution suffisante pour la vérification de l\'immigration tout en répondant à l\'exigence stricte de taille de fichier.',
      it: 'Per originali ad altissima risoluzione, lo strumento regolerà automaticamente sia le impostazioni di qualità che le dimensioni per assicurarsi che l\'obiettivo di 240KB sia raggiunto. L\'algoritmo priorizza la chiarezza facciale e mantiene una risoluzione sufficiente per la verifica dell\'immigrazione rispettando il requisito rigoroso di dimensione del file.',
      ja: '非常に高解像度のオリジナルの場合、ツールは品質設定とサイズの両方を自動的に調整して、240KBの目標が達成されるようにします。アルゴリズムは顔の明確さを優先し、厳格なファイルサイズ要件を満たしながら、移民検証に十分な解像度を維持します。',
      ko: '매우 고해상도 원본의 경우 도구는 240KB 목표가 달성되도록 품질 설정과 크기를 자동으로 조정합니다. 알고리즘은 얼굴 선명도를 우선시하고 엄격한 파일 크기 요구사항을 충족하면서 이민 검증에 충분한 해상도를 유지합니다.',
      pt: 'Para originais de muito alta resolução, a ferramenta ajustará automaticamente tanto as configurações de qualidade quanto as dimensões para garantir que o objetivo de 240KB seja atingido. O algoritmo prioriza clareza facial e mantém resolução suficiente para verificação de imigração enquanto atende ao requisito rigoroso de tamanho de arquivo.',
      'zh-TW': '對於非常高解析度的原始照片，工具會自動調整品質設定和尺寸，以確保達到 240KB 目標。演算法優先考慮面部清晰度，在滿足嚴格檔案大小要求的同時保持足夠的解析度以供移民驗證。'
    },
    'No! Toolaze provides pure technical compression without any facial alterations, beautification, or AI enhancements. Your facial features remain 100% authentic, which is essential for immigration standards. We only compress the file size, not the appearance.': {
      de: 'Nein! Toolaze bietet reine technische Komprimierung ohne Gesichtsveränderungen, Verschönerungen oder KI-Verbesserungen. Ihre Gesichtszüge bleiben zu 100% authentisch, was für Einwanderungsstandards unerlässlich ist. Wir komprimieren nur die Dateigröße, nicht das Aussehen.',
      es: '¡No! Toolaze proporciona compresión técnica pura sin alteraciones faciales, embellecimiento o mejoras de IA. Tus características faciales permanecen 100% auténticas, lo cual es esencial para los estándares de inmigración. Solo comprimimos el tamaño del archivo, no la apariencia.',
      fr: 'Non! Toolaze fournit une compression technique pure sans aucune altération faciale, embellissement ou amélioration IA. Vos traits faciaux restent 100% authentiques, ce qui est essentiel pour les normes d\'immigration. Nous compressons uniquement la taille du fichier, pas l\'apparence.',
      it: 'No! Toolaze fornisce compressione tecnica pura senza alterazioni facciali, abbellimenti o miglioramenti IA. Le tue caratteristiche facciali rimangono autentiche al 100%, essenziale per gli standard di immigrazione. Comprimiamo solo la dimensione del file, non l\'aspetto.',
      ja: 'いいえ！Toolazeは顔の変更、美化、またはAI強化なしで純粋な技術的圧縮を提供します。あなたの顔の特徴は100%本物のままです。これは移民基準にとって不可欠です。ファイルサイズのみを圧縮し、外観は変更しません。',
      ko: '아니요! Toolaze는 얼굴 변경, 미화 또는 AI 향상 없이 순수 기술 압축을 제공합니다. 얼굴 특징은 100% 진정한 상태로 유지되며, 이는 이민 기준에 필수적입니다. 파일 크기만 압축하고 외관은 변경하지 않습니다.',
      pt: 'Não! Toolaze fornece compressão técnica pura sem alterações faciais, embelezamento ou melhorias de IA. Suas características faciais permanecem 100% autênticas, essencial para padrões de imigração. Apenas comprimimos o tamanho do arquivo, não a aparência.',
      'zh-TW': '不會！Toolaze 提供純技術壓縮，不進行任何面部更改、美化或 AI 增強。您的面部特徵保持 100% 真實，這對移民標準至關重要。我們只壓縮檔案大小，不改變外觀。'
    }
  }
};

function translateFaqQuestion(q, lang) {
  // 检查直接匹配
  if (faqTranslations.questions[q] && faqTranslations.questions[q][lang]) {
    return faqTranslations.questions[q][lang];
  }
  
  // 处理动态模式
  if (q.includes('How much can I compress')) {
    const match = q.match(/compress (a|an) (\w+)/);
    if (match) {
      const format = match[2];
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
      return translations[lang] || q;
    }
  }
  
  return q;
}

function translateFaqAnswer(a, lang) {
  // 检查直接匹配
  if (faqTranslations.answers[a] && faqTranslations.answers[a][lang]) {
    return faqTranslations.answers[a][lang];
  }
  
  // 处理通用模式
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
    return translations[lang] || a;
  }
  
  if (a.includes('Yes! Toolaze') && a.includes('batch')) {
    const translations = {
      de: 'Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Bildern gleichzeitig. Perfekt für die Verarbeitung mehrerer Dateien in einem Vorgang.',
      es: '¡Sí! Toolaze admite procesamiento por lotes de hasta 100 imágenes simultáneamente. Perfecto para procesar múltiples archivos en una operación.',
      fr: 'Oui! Toolaze prend en charge le traitement par lots de jusqu\'à 100 images simultanément. Parfait pour traiter plusieurs fichiers en une seule opération.',
      it: 'Sì! Toolaze supporta l\'elaborazione batch di fino a 100 immagini contemporaneamente. Perfetto per elaborare più file in un\'operazione.',
      ja: 'はい！Toolazeは最大100枚の画像を同時に一括処理できます。1回の操作で複数のファイルを処理するのに最適です。',
      ko: '예! Toolaze는 최대 100개의 이미지를 동시에 일괄 처리할 수 있습니다. 한 번의 작업으로 여러 파일을 처리하는 데 완벽합니다.',
      pt: 'Sim! Toolaze suporta processamento em lote de até 100 imagens simultaneamente. Perfeito para processar vários arquivos em uma operação.',
      'zh-TW': '是的！Toolaze 支援同時批次處理最多 100 張圖片。非常適合一次操作處理多個檔案。'
    };
    return translations[lang] || a;
  }
  
  return a;
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
      langTool.faq = enFaq.map(faq => ({
        q: translateFaqQuestion(faq.q, lang),
        a: translateFaqAnswer(faq.a, lang)
      }));
      langFixed += enFaq.length * 2;
    } else {
      // 如果长度匹配，检查并修复每个FAQ
      enFaq.forEach((enFaqItem, idx) => {
        const langFaqItem = langFaq[idx];
        if (!langFaqItem) {
          langFaq[idx] = {
            q: translateFaqQuestion(enFaqItem.q, lang),
            a: translateFaqAnswer(enFaqItem.a, lang)
          };
          langFixed += 2;
          return;
        }
        
        const translatedQ = translateFaqQuestion(enFaqItem.q, lang);
        if (translatedQ !== enFaqItem.q && (!langFaqItem.q || langFaqItem.q === enFaqItem.q)) {
          langFaqItem.q = translatedQ;
          langFixed++;
        }
        
        const translatedA = translateFaqAnswer(enFaqItem.a, lang);
        if (translatedA !== enFaqItem.a && (!langFaqItem.a || langFaqItem.a === enFaqItem.a)) {
          langFaqItem.a = translatedA;
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
