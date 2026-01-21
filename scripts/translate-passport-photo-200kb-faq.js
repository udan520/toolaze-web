const fs = require('fs')
const path = require('path')

// FAQ 翻译映射
const faqTranslations = {
  de: [
    {
      q: "Wird mein Passfoto nach der Komprimierung unscharf?",
      a: "Nein. 200KB bieten viel Platz für ein scharfes Porträt. Toolaze priorisiert Detailerhaltung und Gesichtsklarheit, während das Größenziel erreicht wird. Der Komprimierungsalgorithmus konzentriert sich darauf, unsichtbare Daten zu entfernen, anstatt die visuelle Qualität zu reduzieren."
    },
    {
      q: "Kann ich dies für mehrere Familienmitglieder verwenden?",
      a: "Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Passfotos gleichzeitig. Perfekt für die Verarbeitung von Fotos für gesamte Familienreiseanträge oder mehrere Verlängerungseinreichungen effizient."
    },
    {
      q: "Sind meine biometrischen Fotos sicher und privat?",
      a: "Ja! Alle Komprimierung erfolgt lokal in Ihrem Browser mit JavaScript und Canvas API. Ihre Passfotos verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre und Sicherheit. Keine Daten werden jemals an unsere Server gesendet oder irgendwo gespeichert."
    },
    {
      q: "Wird mein komprimiertes Foto von Passverlängerungsportalen akzeptiert?",
      a: "Ja. Toolaze behält die visuelle Qualität und Klarheit bei, die für die offizielle Identifikation erforderlich ist, während die strenge 200KB-Dateigrößenanforderung erfüllt wird. Die komprimierten Fotos behalten die Gesichtsklarheit bei und erfüllen die staatlichen Passfoto-Spezifikationen."
    },
    {
      q: "Welche Länder akzeptieren 200KB Passfotos?",
      a: "Viele Länder akzeptieren Passfotos zwischen 200KB und 500KB, einschließlich Großbritannien, Australien, Kanada, Neuseeland und anderen. Überprüfen Sie immer die Anforderungen Ihres spezifischen Landes vor der Komprimierung, da einige möglicherweise unterschiedliche Größenlimits haben."
    },
    {
      q: "Verändert das Tool meine Gesichtszüge?",
      a: "Nein! Toolaze bietet reine technische Komprimierung ohne Gesichtsveränderungen, Verschönerung oder KI-Verbesserungen. Ihre Gesichtszüge bleiben zu 100% authentisch, was für Pass- und Identifikationszwecke unerlässlich ist."
    }
  ],
  es: [
    {
      q: "¿Mi foto de pasaporte se verá borrosa después de la compresión?",
      a: "No. 200KB proporciona mucho espacio para una foto de perfil nítida. Toolaze prioriza la retención de detalles y la claridad facial mientras cumple con el objetivo de tamaño. El algoritmo de compresión se enfoca en eliminar datos invisibles en lugar de reducir la calidad visual."
    },
    {
      q: "¿Puedo usar esto para múltiples miembros de la familia?",
      a: "¡Sí! Toolaze admite procesamiento por lotes de hasta 100 fotos de pasaporte simultáneamente. Perfecto para procesar fotos para solicitudes de viaje familiar completas o múltiples envíos de renovación de manera eficiente."
    },
    {
      q: "¿Son seguras y privadas mis fotos biométricas?",
      a: "¡Sí! Toda la compresión ocurre localmente en su navegador usando JavaScript y Canvas API. Sus fotos de pasaporte nunca abandonan su dispositivo, garantizando privacidad y seguridad completas. No se envían datos a nuestros servidores ni se almacenan en ningún lugar."
    },
    {
      q: "¿Mi foto comprimida será aceptada por los portales de renovación de pasaporte?",
      a: "Sí. Toolaze mantiene la calidad visual y claridad requeridas para identificación oficial mientras cumple con el estricto requisito de tamaño de archivo de 200KB. Las fotos comprimidas mantienen la claridad facial y cumplen con las especificaciones gubernamentales de fotos de pasaporte."
    },
    {
      q: "¿Qué países aceptan fotos de pasaporte de 200KB?",
      a: "Muchos países aceptan fotos de pasaporte entre 200KB y 500KB, incluyendo Reino Unido, Australia, Canadá, Nueva Zelanda y otros. Siempre verifique los requisitos de su país específico antes de comprimir, ya que algunos pueden tener límites de tamaño diferentes."
    },
    {
      q: "¿La herramienta altera mis rasgos faciales?",
      a: "¡No! Toolaze proporciona compresión técnica pura sin alteraciones faciales, embellecimiento o mejoras de IA. Sus rasgos faciales permanecen 100% auténticos, lo cual es esencial para propósitos de pasaporte e identificación."
    }
  ],
  fr: [
    {
      q: "Ma photo de passeport sera-t-elle floue après compression?",
      a: "Non. 200KB fournit beaucoup d'espace pour une photo de profil nette. Toolaze priorise la rétention des détails et la clarté faciale tout en atteignant l'objectif de taille. L'algorithme de compression se concentre sur l'élimination des données invisibles plutôt que sur la réduction de la qualité visuelle."
    },
    {
      q: "Puis-je utiliser cela pour plusieurs membres de la famille?",
      a: "Oui! Toolaze prend en charge le traitement par lots de jusqu'à 100 photos de passeport simultanément. Parfait pour traiter des photos pour des demandes de voyage familial complètes ou plusieurs soumissions de renouvellement efficacement."
    },
    {
      q: "Mes photos biométriques sont-elles sécurisées et privées?",
      a: "Oui! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos photos de passeport ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes. Aucune donnée n'est jamais envoyée à nos serveurs ou stockée n'importe où."
    },
    {
      q: "Ma photo compressée sera-t-elle acceptée par les portails de renouvellement de passeport?",
      a: "Oui. Toolaze maintient la qualité visuelle et la clarté requises pour l'identification officielle tout en respectant l'exigence stricte de taille de fichier de 200KB. Les photos compressées maintiennent la clarté faciale et répondent aux spécifications gouvernementales des photos de passeport."
    },
    {
      q: "Quels pays acceptent les photos de passeport de 200KB?",
      a: "De nombreux pays acceptent les photos de passeport entre 200KB et 500KB, notamment le Royaume-Uni, l'Australie, le Canada, la Nouvelle-Zélande et d'autres. Vérifiez toujours les exigences de votre pays spécifique avant de compresser, car certains peuvent avoir des limites de taille différentes."
    },
    {
      q: "L'outil modifie-t-il mes traits du visage?",
      a: "Non! Toolaze fournit une compression technique pure sans altérations faciales, embellissement ou améliorations IA. Vos traits du visage restent 100% authentiques, ce qui est essentiel pour les passeports et l'identification."
    }
  ],
  pt: [
    {
      q: "Minha foto de passaporte ficará embaçada após a compressão?",
      a: "Não. 200KB fornece muito espaço para uma foto de perfil nítida. Toolaze prioriza a retenção de detalhes e clareza facial enquanto atinge o objetivo de tamanho. O algoritmo de compressão se concentra em remover dados invisíveis em vez de reduzir a qualidade visual."
    },
    {
      q: "Posso usar isso para vários membros da família?",
      a: "Sim! Toolaze suporta processamento em lote de até 100 fotos de passaporte simultaneamente. Perfeito para processar fotos para solicitações de viagem familiar completas ou múltiplos envios de renovação de forma eficiente."
    },
    {
      q: "Minhas fotos biométricas são seguras e privadas?",
      a: "Sim! Toda a compressão acontece localmente em seu navegador usando JavaScript e Canvas API. Suas fotos de passaporte nunca deixam seu dispositivo, garantindo privacidade e segurança completas. Nenhum dado é enviado para nossos servidores ou armazenado em qualquer lugar."
    },
    {
      q: "Minha foto comprimida será aceita pelos portais de renovação de passaporte?",
      a: "Sim. Toolaze mantém a qualidade visual e clareza necessárias para identificação oficial enquanto atende ao requisito rigoroso de tamanho de arquivo de 200KB. As fotos comprimidas mantêm a clareza facial e atendem às especificações governamentais de fotos de passaporte."
    },
    {
      q: "Quais países aceitam fotos de passaporte de 200KB?",
      a: "Muitos países aceitam fotos de passaporte entre 200KB e 500KB, incluindo Reino Unido, Austrália, Canadá, Nova Zelândia e outros. Sempre verifique os requisitos do seu país específico antes de comprimir, pois alguns podem ter limites de tamanho diferentes."
    },
    {
      q: "A ferramenta altera meus traços faciais?",
      a: "Não! Toolaze fornece compressão técnica pura sem alterações faciais, embelezamento ou melhorias de IA. Seus traços faciais permanecem 100% autênticos, o que é essencial para passaportes e identificação."
    }
  ],
  it: [
    {
      q: "La mia foto del passaporto sarà sfocata dopo la compressione?",
      a: "No. 200KB fornisce molto spazio per una foto di profilo nitida. Toolaze priorizza la ritenzione dei dettagli e la chiarezza facciale mentre raggiunge l'obiettivo di dimensione. L'algoritmo di compressione si concentra sulla rimozione di dati invisibili piuttosto che sulla riduzione della qualità visiva."
    },
    {
      q: "Posso usare questo per più membri della famiglia?",
      a: "Sì! Toolaze supporta l'elaborazione batch di fino a 100 foto del passaporto contemporaneamente. Perfetto per elaborare foto per intere richieste di viaggio familiare o più invii di rinnovo in modo efficiente."
    },
    {
      q: "Le mie foto biometriche sono sicure e private?",
      a: "Sì! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue foto del passaporto non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete. Nessun dato viene mai inviato ai nostri server o memorizzato da nessuna parte."
    },
    {
      q: "La mia foto compressa sarà accettata dai portali di rinnovo del passaporto?",
      a: "Sì. Toolaze mantiene la qualità visiva e la chiarezza richieste per l'identificazione ufficiale mentre soddisfa il rigoroso requisito di dimensione del file di 200KB. Le foto compresse mantengono la chiarezza facciale e soddisfano le specifiche governative delle foto del passaporto."
    },
    {
      q: "Quali paesi accettano foto del passaporto da 200KB?",
      a: "Molti paesi accettano foto del passaporto tra 200KB e 500KB, inclusi Regno Unito, Australia, Canada, Nuova Zelanda e altri. Controlla sempre i requisiti del tuo paese specifico prima di comprimere, poiché alcuni potrebbero avere limiti di dimensione diversi."
    },
    {
      q: "Lo strumento altera i miei tratti facciali?",
      a: "No! Toolaze fornisce compressione tecnica pura senza alterazioni facciali, abbellimento o miglioramenti IA. I tuoi tratti facciali rimangono 100% autentici, il che è essenziale per passaporti e identificazione."
    }
  ],
  ja: [
    {
      q: "圧縮後、パスポート写真はぼやけますか？",
      a: "いいえ。200KBは鮮明な顔写真には十分なスペースを提供します。Toolazeはサイズ目標を達成しながら、詳細の保持と顔の明瞭さを優先します。圧縮アルゴリズムは視覚品質を低下させるのではなく、見えないデータを削除することに焦点を当てています。"
    },
    {
      q: "複数の家族メンバーに使用できますか？",
      a: "はい！Toolazeは最大100枚のパスポート写真を同時に一括処理できます。家族全員の旅行申請や複数の更新提出の写真を効率的に処理するのに最適です。"
    },
    {
      q: "生体認証写真は安全でプライベートですか？",
      a: "はい！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。パスポート写真がデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。データがサーバーに送信されたり、どこかに保存されたりすることはありません。"
    },
    {
      q: "圧縮された写真はパスポート更新ポータルで受け入れられますか？",
      a: "はい。Toolazeは、厳格な200KBファイルサイズ要件を満たしながら、公式識別に必要な視覚品質と明瞭さを維持します。圧縮された写真は顔の明瞭さを維持し、政府のパスポート写真仕様を満たしています。"
    },
    {
      q: "200KBのパスポート写真を受け入れる国は？",
      a: "英国、オーストラリア、カナダ、ニュージーランドなど、多くの国が200KBから500KBのパスポート写真を受け入れています。一部の国では異なるサイズ制限がある可能性があるため、圧縮する前に特定の国の要件を必ず確認してください。"
    },
    {
      q: "ツールは私の顔の特徴を変更しますか？",
      a: "いいえ！Toolazeは顔の変更、美化、またはAI強化なしで純粋な技術的圧縮を提供します。顔の特徴は100%本物のままです。これはパスポートや識別目的に不可欠です。"
    }
  ],
  ko: [
    {
      q: "압축 후 내 여권 사진이 흐려지나요?",
      a: "아니요. 200KB는 선명한 인물 사진에 충분한 공간을 제공합니다. Toolaze는 크기 목표를 달성하면서 세부 사항 보존과 얼굴 선명도를 우선시합니다. 압축 알고리즘은 시각적 품질을 낮추는 대신 보이지 않는 데이터를 제거하는 데 중점을 둡니다."
    },
    {
      q: "여러 가족 구성원에게 사용할 수 있나요?",
      a: "예! Toolaze는 최대 100개의 여권 사진을 동시에 일괄 처리할 수 있습니다. 전체 가족 여행 신청 또는 여러 갱신 제출을 위한 사진을 효율적으로 처리하는 데 완벽합니다."
    },
    {
      q: "내 생체 인식 사진이 안전하고 비공개인가요?",
      a: "예! 모든 압축은 JavaScript와 Canvas API를 사용하여 브라우저에서 로컬로 수행됩니다. 여권 사진이 기기를 떠나지 않아 완전한 개인정보 보호와 보안을 보장합니다. 데이터가 서버로 전송되거나 어디에도 저장되지 않습니다."
    },
    {
      q: "압축된 사진이 여권 갱신 포털에서 승인되나요?",
      a: "예. Toolaze는 엄격한 200KB 파일 크기 요구사항을 충족하면서 공식 신원 확인에 필요한 시각적 품질과 선명도를 유지합니다. 압축된 사진은 얼굴 선명도를 유지하고 정부 여권 사진 사양을 충족합니다."
    },
    {
      q: "200KB 여권 사진을 허용하는 국가는?",
      a: "영국, 호주, 캐나다, 뉴질랜드 등을 포함한 많은 국가가 200KB에서 500KB 사이의 여권 사진을 허용합니다. 일부 국가는 다른 크기 제한이 있을 수 있으므로 압축하기 전에 특정 국가의 요구사항을 항상 확인하세요."
    },
    {
      q: "도구가 내 얼굴 특징을 변경하나요?",
      a: "아니요! Toolaze는 얼굴 변경, 미화 또는 AI 향상 없이 순수한 기술적 압축을 제공합니다. 얼굴 특징은 100% 진정한 상태로 유지되며, 이는 여권 및 신원 확인 목적에 필수적입니다."
    }
  ],
  'zh-TW': [
    {
      q: "壓縮後我的護照照片會模糊嗎？",
      a: "不會。200KB 為清晰的頭像提供了充足的空間。Toolaze 在達到大小目標的同時優先保留細節和面部清晰度。壓縮演算法專注於移除不可見的數據，而不是降低視覺品質。"
    },
    {
      q: "我可以為多個家庭成員使用這個嗎？",
      a: "是的！Toolaze 支援同時批次處理最多 100 張護照照片。非常適合為整個家庭旅行申請或多個更新提交高效處理照片。"
    },
    {
      q: "我的生物識別照片安全且私密嗎？",
      a: "是的！所有壓縮都在您的瀏覽器中使用 JavaScript 和 Canvas API 本地進行。您的護照照片永遠不會離開您的設備，確保完全的隱私和安全。數據永遠不會發送到我們的伺服器或存儲在任何地方。"
    },
    {
      q: "我的壓縮照片會被護照更新入口網站接受嗎？",
      a: "是的。Toolaze 在滿足嚴格的 200KB 檔案大小要求的同時，保持官方識別所需的視覺品質和清晰度。壓縮的照片保持面部清晰度並符合政府護照照片規格。"
    },
    {
      q: "哪些國家接受 200KB 護照照片？",
      a: "許多國家接受 200KB 到 500KB 之間的護照照片，包括英國、澳洲、加拿大、紐西蘭等。在壓縮之前，請務必檢查您特定國家的要求，因為某些國家可能有不同的大小限制。"
    },
    {
      q: "工具會改變我的面部特徵嗎？",
      a: "不會！Toolaze 提供純技術壓縮，不進行任何面部更改、美化或 AI 增強。您的面部特徵保持 100% 真實，這對於護照和識別目的至關重要。"
    }
  ]
}

async function main() {
  const languages = ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']
  
  for (const lang of languages) {
    const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (!data['passport-photo-200kb']) {
      console.log(`⚠️  ${lang}: passport-photo-200kb section not found`)
      continue
    }
    
    const faq = faqTranslations[lang]
    if (!faq) {
      console.log(`⚠️  ${lang}: FAQ translation not found`)
      continue
    }
    
    // 替换 FAQ
    data['passport-photo-200kb'].faq = faq
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ ${lang}: passport-photo-200kb FAQ translated`)
  }
  
  console.log('\n✨ All FAQ translations completed!')
}

main().catch(console.error)
