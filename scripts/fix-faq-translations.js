const fs = require('fs');
const path = require('path');

// 通用FAQ翻译模板 - 常见问题和答案
const commonFaqTranslations = {
  'What formats are supported?': {
    de: 'Welche Formate werden unterstützt?',
    es: '¿Qué formatos son compatibles?',
    fr: 'Quels formats sont pris en charge?',
    it: 'Quali formati sono supportati?',
    ja: 'どの形式がサポートされていますか？',
    ko: '어떤 형식이 지원되나요?',
    pt: 'Quais formatos são suportados?',
    'zh-TW': '支援哪些格式？'
  },
  'Is it really free?': {
    de: 'Ist es wirklich kostenlos?',
    es: '¿Es realmente gratuito?',
    fr: 'Est-ce vraiment gratuit?',
    it: 'È davvero gratuito?',
    ja: '本当に無料ですか？',
    ko: '정말 무료인가요?',
    pt: 'É realmente gratuito?',
    'zh-TW': '真的免費嗎？'
  },
  'Can I compress multiple images at once?': {
    de: 'Kann ich mehrere Bilder gleichzeitig komprimieren?',
    es: '¿Puedo comprimir múltiples imágenes a la vez?',
    fr: 'Puis-je compresser plusieurs images à la fois?',
    it: 'Posso comprimere più immagini contemporaneamente?',
    ja: '複数の画像を一度に圧縮できますか？',
    ko: '여러 이미지를 한 번에 압축할 수 있나요?',
    pt: 'Posso comprimir várias imagens de uma vez?',
    'zh-TW': '可以一次壓縮多張圖片嗎？'
  },
  'Will my compressed image still be accepted by online forms?': {
    de: 'Wird mein komprimiertes Bild noch von Online-Formularen akzeptiert?',
    es: '¿Mi imagen comprimida seguirá siendo aceptada por formularios en línea?',
    fr: 'Mon image compressée sera-t-elle toujours acceptée par les formulaires en ligne?',
    it: 'La mia immagine compressa sarà ancora accettata dai moduli online?',
    ja: '圧縮された画像はオンラインフォームで受け入れられますか？',
    ko: '압축된 이미지가 온라인 양식에서 여전히 허용되나요?',
    pt: 'Minha imagem comprimida ainda será aceita por formulários online?',
    'zh-TW': '壓縮後的圖片仍會被線上表單接受嗎？'
  },
  'What if my original image is already under 20KB?': {
    de: 'Was ist, wenn mein Originalbild bereits unter 20KB liegt?',
    es: '¿Qué pasa si mi imagen original ya está por debajo de 20KB?',
    fr: 'Que se passe-t-il si mon image originale est déjà sous 20KB?',
    it: 'E se la mia immagine originale è già sotto 20KB?',
    ja: '元の画像がすでに20KB未満の場合はどうなりますか？',
    ko: '원본 이미지가 이미 20KB 미만이면 어떻게 되나요?',
    pt: 'E se minha imagem original já estiver abaixo de 20KB?',
    'zh-TW': '如果我的原始圖片已經小於 20KB 怎麼辦？'
  },
  'Does it work for passport photos and ID documents?': {
    de: 'Funktioniert es für Reisepassfotos und Ausweisdokumente?',
    es: '¿Funciona para fotos de pasaporte y documentos de identidad?',
    fr: 'Fonctionne-t-il pour les photos de passeport et les documents d\'identité?',
    it: 'Funziona per foto del passaporto e documenti di identità?',
    ja: 'パスポート写真や身分証明書に使用できますか？',
    ko: '여권 사진 및 신분증 문서에 사용할 수 있나요?',
    pt: 'Funciona para fotos de passaporte e documentos de identidade?',
    'zh-TW': '適用於護照照片和身份證件嗎？'
  }
};

// 通用FAQ答案翻译模板
const commonFaqAnswerTranslations = {
  'JPG, JPEG, PNG, WebP, and BMP are supported. Files are downloaded in their original format.': {
    de: 'JPG, JPEG, PNG, WebP und BMP werden unterstützt. Dateien werden in ihrem ursprünglichen Format heruntergeladen.',
    es: 'Se admiten JPG, JPEG, PNG, WebP y BMP. Los archivos se descargan en su formato original.',
    fr: 'JPG, JPEG, PNG, WebP et BMP sont pris en charge. Les fichiers sont téléchargés dans leur format d\'origine.',
    it: 'Sono supportati JPG, JPEG, PNG, WebP e BMP. I file vengono scaricati nel loro formato originale.',
    ja: 'JPG、JPEG、PNG、WebP、BMPがサポートされています。ファイルは元の形式でダウンロードされます。',
    ko: 'JPG, JPEG, PNG, WebP 및 BMP가 지원됩니다. 파일은 원본 형식으로 다운로드됩니다.',
    pt: 'JPG, JPEG, PNG, WebP e BMP são suportados. Os arquivos são baixados em seu formato original.',
    'zh-TW': '支援 JPG、JPEG、PNG、WebP 和 BMP。檔案會以原始格式下載。'
  },
  'Yes, Toolaze is 100% free with no ads and no usage limits.': {
    de: 'Ja, Toolaze ist zu 100% kostenlos ohne Werbung und ohne Nutzungsbeschränkungen.',
    es: 'Sí, Toolaze es 100% gratuito sin anuncios y sin límites de uso.',
    fr: 'Oui, Toolaze est 100% gratuit sans publicité et sans limites d\'utilisation.',
    it: 'Sì, Toolaze è gratuito al 100% senza pubblicità e senza limiti di utilizzo.',
    ja: 'はい、Toolazeは100%無料で、広告も使用制限もありません。',
    ko: '예, Toolaze는 광고 없이 사용 제한 없이 100% 무료입니다.',
    pt: 'Sim, Toolaze é 100% gratuito sem anúncios e sem limites de uso.',
    'zh-TW': '是的，Toolaze 100% 免費，無廣告且無使用限制。'
  },
  'Yes! Toolaze supports batch processing of up to 100 images simultaneously. Perfect for processing multiple documents or photos for bulk application submissions.': {
    de: 'Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Bildern gleichzeitig. Perfekt für die Verarbeitung mehrerer Dokumente oder Fotos für Massenantragseinreichungen.',
    es: '¡Sí! Toolaze admite procesamiento por lotes de hasta 100 imágenes simultáneamente. Perfecto para procesar múltiples documentos o fotos para envíos masivos de solicitudes.',
    fr: 'Oui! Toolaze prend en charge le traitement par lots de jusqu\'à 100 images simultanément. Parfait pour traiter plusieurs documents ou photos pour des soumissions d\'applications en masse.',
    it: 'Sì! Toolaze supporta l\'elaborazione in batch di fino a 100 immagini contemporaneamente. Perfetto per elaborare più documenti o foto per invii di applicazioni in massa.',
    ja: 'はい！Toolazeは最大100枚の画像を同時に一括処理できます。複数の文書や写真を一括申請提出用に処理するのに最適です。',
    ko: '예! Toolaze는 최대 100개의 이미지를 동시에 일괄 처리할 수 있습니다. 대량 신청 제출을 위한 여러 문서나 사진을 처리하는 데 완벽합니다.',
    pt: 'Sim! Toolaze suporta processamento em lote de até 100 imagens simultaneamente. Perfeito para processar vários documentos ou fotos para envios em massa de aplicações.',
    'zh-TW': '是的！Toolaze 支援同時批次處理最多 100 張圖片。非常適合處理多個文件或照片以進行批量申請提交。'
  },
  'Yes. Toolaze maintains the visual quality needed for official verification while meeting the strict file size requirement. The compressed images maintain clarity and readability required by online forms and portals.': {
    de: 'Ja. Toolaze erhält die für die offizielle Überprüfung erforderliche visuelle Qualität und erfüllt gleichzeitig die strenge Dateigrößenanforderung. Die komprimierten Bilder behalten die von Online-Formularen und Portalen geforderte Klarheit und Lesbarkeit.',
    es: 'Sí. Toolaze mantiene la calidad visual necesaria para la verificación oficial mientras cumple con el estricto requisito de tamaño de archivo. Las imágenes comprimidas mantienen la claridad y legibilidad requeridas por formularios y portales en línea.',
    fr: 'Oui. Toolaze maintient la qualité visuelle nécessaire pour la vérification officielle tout en répondant à l\'exigence stricte de taille de fichier. Les images compressées maintiennent la clarté et la lisibilité requises par les formulaires et portails en ligne.',
    it: 'Sì. Toolaze mantiene la qualità visiva necessaria per la verifica ufficiale rispettando il requisito rigoroso di dimensione del file. Le immagini compresse mantengono la chiarezza e la leggibilità richieste da moduli e portali online.',
    ja: 'はい。Toolazeは、厳格なファイルサイズ要件を満たしながら、公式検証に必要な視覚品質を維持します。圧縮された画像は、オンラインフォームやポータルで必要な明確さと読みやすさを維持します。',
    ko: '예. Toolaze는 엄격한 파일 크기 요구사항을 충족하면서 공식 검증에 필요한 시각적 품질을 유지합니다. 압축된 이미지는 온라인 양식 및 포털에서 요구하는 선명도와 가독성을 유지합니다.',
    pt: 'Sim. Toolaze mantém a qualidade visual necessária para verificação oficial enquanto atende ao requisito rigoroso de tamanho de arquivo. As imagens comprimidas mantêm a clareza e legibilidade exigidas por formulários e portais online.',
    'zh-TW': '是的。Toolaze 在滿足嚴格檔案大小要求的同時，保持官方驗證所需的視覺品質。壓縮後的圖片保持線上表單和網站所需的清晰度和可讀性。'
  },
  'If your image is already under the target size, the tool will optimize it further to ensure it meets the exact requirement while preserving quality. The compression algorithm focuses on removing invisible data rather than reducing visual quality.': {
    de: 'Wenn Ihr Bild bereits unter der Zielgröße liegt, optimiert das Tool es weiter, um sicherzustellen, dass es die genaue Anforderung erfüllt und dabei die Qualität erhält. Der Komprimierungsalgorithmus konzentriert sich darauf, unsichtbare Daten zu entfernen, anstatt die visuelle Qualität zu reduzieren.',
    es: 'Si tu imagen ya está por debajo del tamaño objetivo, la herramienta la optimizará aún más para asegurar que cumpla con el requisito exacto mientras preserva la calidad. El algoritmo de compresión se enfoca en eliminar datos invisibles en lugar de reducir la calidad visual.',
    fr: 'Si votre image est déjà sous la taille cible, l\'outil l\'optimisera davantage pour s\'assurer qu\'elle répond à l\'exigence exacte tout en préservant la qualité. L\'algorithme de compression se concentre sur la suppression des données invisibles plutôt que sur la réduction de la qualité visuelle.',
    it: 'Se la tua immagine è già sotto la dimensione obiettivo, lo strumento la ottimizzerà ulteriormente per assicurarsi che soddisfi il requisito esatto mantenendo la qualità. L\'algoritmo di compressione si concentra sulla rimozione di dati invisibili piuttosto che sulla riduzione della qualità visiva.',
    ja: '画像がすでにターゲットサイズ未満の場合、ツールは品質を維持しながら正確な要件を満たすようにさらに最適化します。圧縮アルゴリズムは、視覚品質を低下させるのではなく、見えないデータを削除することに焦点を当てています。',
    ko: '이미지가 이미 목표 크기 미만인 경우, 도구는 품질을 유지하면서 정확한 요구사항을 충족하도록 추가로 최적화합니다. 압축 알고리즘은 시각적 품질을 낮추는 대신 보이지 않는 데이터를 제거하는 데 중점을 둡니다.',
    pt: 'Se sua imagem já estiver abaixo do tamanho alvo, a ferramenta a otimizará ainda mais para garantir que atenda ao requisito exato enquanto preserva a qualidade. O algoritmo de compressão foca em remover dados invisíveis em vez de reduzir a qualidade visual.',
    'zh-TW': '如果您的圖片已經小於目標大小，工具會進一步優化它以確保滿足確切要求，同時保持品質。壓縮演算法專注於移除不可見數據，而不是降低視覺品質。'
  },
  'Yes, Toolaze can compress passport photos and ID document scans. However, note that some applications may have different size requirements (e.g., USCIS requires 240KB). Always check your specific application requirements before compressing.': {
    de: 'Ja, Toolaze kann Reisepassfotos und Ausweisdokument-Scans komprimieren. Beachten Sie jedoch, dass einige Anwendungen möglicherweise unterschiedliche Größenanforderungen haben (z. B. erfordert USCIS 240KB). Überprüfen Sie immer Ihre spezifischen Anwendungsanforderungen vor der Komprimierung.',
    es: 'Sí, Toolaze puede comprimir fotos de pasaporte y escaneos de documentos de identidad. Sin embargo, tenga en cuenta que algunas aplicaciones pueden tener requisitos de tamaño diferentes (por ejemplo, USCIS requiere 240KB). Siempre verifique los requisitos específicos de su aplicación antes de comprimir.',
    fr: 'Oui, Toolaze peut compresser les photos de passeport et les scans de documents d\'identité. Cependant, notez que certaines applications peuvent avoir des exigences de taille différentes (par exemple, USCIS nécessite 240KB). Vérifiez toujours les exigences spécifiques de votre application avant de compresser.',
    it: 'Sì, Toolaze può comprimere foto del passaporto e scansioni di documenti di identità. Tuttavia, nota che alcune applicazioni possono avere requisiti di dimensione diversi (ad esempio, USCIS richiede 240KB). Controlla sempre i requisiti specifici della tua applicazione prima di comprimere.',
    ja: 'はい、Toolazeはパスポート写真や身分証明書のスキャンを圧縮できます。ただし、一部のアプリケーションでは異なるサイズ要件がある場合があります（例：USCISは240KBが必要）。圧縮する前に、必ず特定のアプリケーション要件を確認してください。',
    ko: '예, Toolaze는 여권 사진 및 신분증 문서 스캔을 압축할 수 있습니다. 그러나 일부 신청은 다른 크기 요구사항이 있을 수 있습니다(예: USCIS는 240KB 필요). 압축하기 전에 항상 특정 신청 요구사항을 확인하세요.',
    pt: 'Sim, Toolaze pode comprimir fotos de passaporte e escaneamentos de documentos de identidade. No entanto, observe que algumas aplicações podem ter requisitos de tamanho diferentes (por exemplo, USCIS requer 240KB). Sempre verifique os requisitos específicos da sua aplicação antes de comprimir.',
    'zh-TW': '是的，Toolaze 可以壓縮護照照片和身份證件掃描。但是，請注意某些申請可能有不同的尺寸要求（例如，USCIS 需要 240KB）。在壓縮之前，請務必檢查您的特定申請要求。'
  }
};

function translateFaqQuestion(q, lang) {
  if (commonFaqTranslations[q] && commonFaqTranslations[q][lang]) {
    return commonFaqTranslations[q][lang];
  }
  return q;
}

function translateFaqAnswer(a, lang) {
  if (commonFaqAnswerTranslations[a] && commonFaqAnswerTranslations[a][lang]) {
    return commonFaqAnswerTranslations[a][lang];
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
    const langFaq = langTool.faq || [];
    
    if (enFaq.length !== langFaq.length) {
      // 如果长度不匹配，复制结构
      langTool.faq = enFaq.map(faq => ({
        q: translateFaqQuestion(faq.q, lang),
        a: translateFaqAnswer(faq.a, lang)
      }));
      langFixed += enFaq.length * 2;
    } else {
      enFaq.forEach((enFaqItem, idx) => {
        const langFaqItem = langFaq[idx];
        if (!langFaqItem) return;
        
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
