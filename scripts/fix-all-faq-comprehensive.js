const fs = require('fs');
const path = require('path');

// 扩展的FAQ翻译模板
const faqQuestionTranslations = {
  'Why did my image resolution change when compressing to 20KB?': {
    de: 'Warum hat sich meine Bildauflösung geändert, als ich auf 20KB komprimiert habe?',
    es: '¿Por qué cambió la resolución de mi imagen al comprimir a 20KB?',
    fr: 'Pourquoi la résolution de mon image a-t-elle changé lors de la compression à 20KB?',
    it: 'Perché la risoluzione della mia immagine è cambiata quando ho compresso a 20KB?',
    ja: '20KBに圧縮したときに画像の解像度が変わったのはなぜですか？',
    ko: '20KB로 압축할 때 이미지 해상도가 변경된 이유는 무엇입니까?',
    pt: 'Por que a resolução da minha imagem mudou ao comprimir para 20KB?',
    'zh-TW': '為什麼壓縮到 20KB 時我的圖片解析度會改變？'
  },
  'Are my ID photos and sensitive documents secure?': {
    de: 'Sind meine Ausweisfotos und sensiblen Dokumente sicher?',
    es: '¿Son seguras mis fotos de identificación y documentos sensibles?',
    fr: 'Mes photos d\'identité et documents sensibles sont-ils sécurisés?',
    it: 'Le mie foto d\'identità e documenti sensibili sono sicuri?',
    ja: '身分証明書の写真や機密文書は安全ですか？',
    ko: '내 신분증 사진과 민감한 문서가 안전한가요?',
    pt: 'Minhas fotos de identidade e documentos sensíveis estão seguros?',
    'zh-TW': '我的身份證照片和敏感文件安全嗎？'
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
  'Will my compressed image still be accepted by government portals?': {
    de: 'Wird mein komprimiertes Bild immer noch von Behördenportalen akzeptiert?',
    es: '¿Mi imagen comprimida seguirá siendo aceptada por portales gubernamentales?',
    fr: 'Mon image compressée sera-t-elle toujours acceptée par les portails gouvernementaux?',
    it: 'La mia immagine compressa sarà ancora accettata dai portali governativi?',
    ja: '圧縮された画像は政府ポータルで受け入れられますか？',
    ko: '압축된 이미지가 정부 포털에서 여전히 수락되나요?',
    pt: 'Minha imagem comprimida ainda será aceita por portais governamentais?',
    'zh-TW': '我的壓縮圖片仍會被政府網站接受嗎？'
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
  'Does it work for passport photos and visa applications?': {
    de: 'Funktioniert es für Passfotos und Visumanträge?',
    es: '¿Funciona para fotos de pasaporte y solicitudes de visa?',
    fr: 'Fonctionne-t-il pour les photos de passeport et les demandes de visa?',
    it: 'Funziona per foto del passaporto e domande di visto?',
    ja: 'パスポート写真やビザ申請に使用できますか？',
    ko: '여권 사진 및 비자 신청에 작동하나요?',
    pt: 'Funciona para fotos de passaporte e solicitações de visto?',
    'zh-TW': '適用於護照照片和簽證申請嗎？'
  }
};

// FAQ答案翻译模板
const faqAnswerTranslations = {
  'To reach the strict 20KB limit, the tool automatically adjusts both quality settings and dimensions. This ensures the file size target is met while maintaining sufficient visual quality for official verification. The algorithm prioritizes facial clarity and document readability.': {
    de: 'Um das strenge 20KB-Limit zu erreichen, passt das Tool automatisch sowohl Qualitätseinstellungen als auch Abmessungen an. Dies stellt sicher, dass das Dateigrößenziel erreicht wird und dabei ausreichende visuelle Qualität für die offizielle Verifizierung erhalten bleibt. Der Algorithmus priorisiert Gesichtsklarität und Dokumentenlesbarkeit.',
    es: 'Para alcanzar el límite estricto de 20KB, la herramienta ajusta automáticamente tanto la configuración de calidad como las dimensiones. Esto asegura que se cumpla el objetivo de tamaño de archivo mientras se mantiene una calidad visual suficiente para la verificación oficial. El algoritmo prioriza la claridad facial y la legibilidad del documento.',
    fr: 'Pour atteindre la limite stricte de 20KB, l\'outil ajuste automatiquement à la fois les paramètres de qualité et les dimensions. Cela garantit que l\'objectif de taille de fichier est atteint tout en maintenant une qualité visuelle suffisante pour la vérification officielle. L\'algorithme priorise la clarté faciale et la lisibilité des documents.',
    it: 'Per raggiungere il limite rigoroso di 20KB, lo strumento regola automaticamente sia le impostazioni di qualità che le dimensioni. Ciò garantisce che l\'obiettivo di dimensione del file sia raggiunto mantenendo una qualità visiva sufficiente per la verifica ufficiale. L\'algoritmo dà priorità alla chiarezza facciale e alla leggibilità del documento.',
    ja: '厳格な20KB制限に達するために、ツールは品質設定とサイズの両方を自動的に調整します。これにより、公式検証に十分な視覚品質を維持しながら、ファイルサイズの目標が達成されます。アルゴリズムは顔の明確さと文書の読みやすさを優先します。',
    ko: '엄격한 20KB 제한에 도달하기 위해 도구는 품질 설정과 크기를 자동으로 조정합니다. 이는 공식 검증에 충분한 시각적 품질을 유지하면서 파일 크기 목표가 달성되도록 보장합니다. 알고リズムは顔の明確さと文書の読みやすさを優先します。',
    pt: 'Para atingir o limite rigoroso de 20KB, a ferramenta ajusta automaticamente tanto as configurações de qualidade quanto as dimensões. Isso garante que o objetivo de tamanho de arquivo seja alcançado mantendo qualidade visual suficiente para verificação oficial. O algoritmo prioriza clareza facial e legibilidade do documento.',
    'zh-TW': '為了達到嚴格的 20KB 限制，工具會自動調整品質設定和尺寸。這確保在保持官方驗證所需的足夠視覺品質的同時達到檔案大小目標。演算法優先考慮面部清晰度和文件可讀性。'
  },
  'Yes! All compression happens locally in your browser using JavaScript and Canvas API. Your images never leave your device, ensuring complete privacy and security. No data is ever sent to our servers or stored anywhere.': {
    de: 'Ja! Die gesamte Komprimierung erfolgt lokal in Ihrem Browser mit JavaScript und Canvas-API. Ihre Bilder verlassen Ihr Gerät niemals und gewährleisten vollständige Privatsphäre und Sicherheit. Keine Daten werden jemals an unsere Server gesendet oder irgendwo gespeichert.',
    es: '¡Sí! Toda la compresión ocurre localmente en tu navegador usando JavaScript y Canvas API. Tus imágenes nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas. No se envían datos a nuestros servidores ni se almacenan en ningún lugar.',
    fr: 'Oui! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos images ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes. Aucune donnée n\'est jamais envoyée à nos serveurs ou stockée n\'importe où.',
    it: 'Sì! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue immagini non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete. Nessun dato viene mai inviato ai nostri server o memorizzato da nessuna parte.',
    ja: 'はい！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。画像がデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。データがサーバーに送信されたり、どこかに保存されることはありません。',
    ko: '네! 모든 압축은 JavaScript와 Canvas API를 사용하여 브라우저에서 로컬로 수행됩니다. 이미지가 기기를 떠나지 않아 완전한 개인정보 보호와 보안을 보장합니다. 데이터는 서버로 전송되거나 어디에도 저장되지 않습니다.',
    pt: 'Sim! Toda a compressão acontece localmente no seu navegador usando JavaScript e Canvas API. Suas imagens nunca deixam seu dispositivo, garantindo privacidade e segurança completas. Nenhum dado é enviado aos nossos servidores ou armazenado em qualquer lugar.',
    'zh-TW': '是的！所有壓縮都在您的瀏覽器中使用 JavaScript 和 Canvas API 本地進行。您的圖片永遠不會離開您的設備，確保完全的隱私和安全。數據永遠不會發送到我們的服務器或存儲在任何地方。'
  }
};

// 动态翻译函数 - 处理常见模式
function translateFaqQuestion(q, lang) {
  // 检查直接匹配
  if (faqQuestionTranslations[q] && faqQuestionTranslations[q][lang]) {
    return faqQuestionTranslations[q][lang];
  }
  
  // 处理动态模式
  if (q.includes('Why did my image resolution change when compressing to')) {
    const match = q.match(/compressing to (\d+KB)/);
    if (match) {
      const size = match[1];
      const translations = {
        de: `Warum hat sich meine Bildauflösung geändert, als ich auf ${size} komprimiert habe?`,
        es: `¿Por qué cambió la resolución de mi imagen al comprimir a ${size}?`,
        fr: `Pourquoi la résolution de mon image a-t-elle changé lors de la compression à ${size}?`,
        it: `Perché la risoluzione della mia immagine è cambiata quando ho compresso a ${size}?`,
        ja: `${size}に圧縮したときに画像の解像度が変わったのはなぜですか？`,
        ko: `${size}로 압축할 때 이미지 해상도가 변경된 이유는 무엇입니까?`,
        pt: `Por que a resolução da minha imagem mudou ao comprimir para ${size}?`,
        'zh-TW': `為什麼壓縮到 ${size} 時我的圖片解析度會改變？`
      };
      return translations[lang] || q;
    }
  }
  
  return q;
}

function translateFaqAnswer(a, lang) {
  // 检查直接匹配
  if (faqAnswerTranslations[a] && faqAnswerTranslations[a][lang]) {
    return faqAnswerTranslations[a][lang];
  }
  
  // 处理通用模式
  if (a.includes('All compression happens locally')) {
    const translations = {
      de: 'Ja! Die gesamte Komprimierung erfolgt lokal in Ihrem Browser mit JavaScript und Canvas-API. Ihre Bilder verlassen Ihr Gerät niemals und gewährleisten vollständige Privatsphäre und Sicherheit.',
      es: '¡Sí! Toda la compresión ocurre localmente en tu navegador usando JavaScript y Canvas API. Tus imágenes nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas.',
      fr: 'Oui! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos images ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes.',
      it: 'Sì! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue immagini non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete.',
      ja: 'はい！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。画像がデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。',
      ko: '네! 모든 압축은 JavaScript와 Canvas API를 사용하여 브라우저에서 로컬로 수행됩니다. 이미지가 기기를 떠나지 않아 완전한 개인정보 보호와 보안을 보장합니다.',
      pt: 'Sim! Toda a compressão acontece localmente no seu navegador usando JavaScript e Canvas API. Suas imagens nunca deixam seu dispositivo, garantindo privacidade e segurança completas.',
      'zh-TW': '是的！所有壓縮都在您的瀏覽器中使用 JavaScript 和 Canvas API 本地進行。您的圖片永遠不會離開您的設備，確保完全的隱私和安全。'
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
    const langFaq = langTool.faq || [];
    
    // 确保faq数组存在且长度匹配
    if (!langTool.faq) {
      langTool.faq = [];
    }
    
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
