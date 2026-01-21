const fs = require('fs')
const path = require('path')

// FAQ 翻译映射
const faqTranslations = {
  de: [
    {
      q: "Was ist, wenn mein Foto nicht 240KB erreichen kann, ohne Qualität zu verlieren?",
      a: "Für sehr hochauflösende Originale passt das Tool automatisch sowohl Qualitätseinstellungen als auch Abmessungen an, um sicherzustellen, dass das 240KB-Ziel erreicht wird. Der Algorithmus priorisiert Gesichtsklarheit und behält ausreichende Auflösung für Einwanderungsverifizierung bei, während die strenge Dateigrößenanforderung erfüllt wird."
    },
    {
      q: "Bearbeitet das Tool mein Gesicht oder verschönert es?",
      a: "Nein! Toolaze bietet reine technische Komprimierung ohne Gesichtsveränderungen, Verschönerung oder KI-Verbesserungen. Ihre Gesichtszüge bleiben 100% authentisch, was für Einwanderungsstandards unerlässlich ist. Wir komprimieren nur die Dateigröße, nicht das Aussehen."
    },
    {
      q: "Sind meine biometrischen Fotos sicher und privat?",
      a: "Ja! Die gesamte Komprimierung erfolgt lokal in Ihrem Browser mit JavaScript und Canvas API. Ihre Passfotos verlassen Ihr Gerät niemals und gewährleisten vollständige Privatsphäre und Sicherheit. Keine Daten werden jemals an unsere Server gesendet oder irgendwo gespeichert."
    },
    {
      q: "Kann ich mehrere Familienmitglieder-Fotos gleichzeitig komprimieren?",
      a: "Ja! Toolaze unterstützt die Batch-Verarbeitung von bis zu 100 Passfotos gleichzeitig. Perfekt für die Verarbeitung von Fotos für gesamte Familien-Visumanträge oder mehrere Einwanderungsanträge."
    },
    {
      q: "Wird mein komprimiertes Foto von USCIS akzeptiert?",
      a: "Ja. Toolaze erhält die visuelle Qualität und Authentizität, die für Einwanderungszwecke erforderlich ist, während die strenge 240KB-Dateigrößenanforderung erfüllt wird. Die komprimierten Fotos behalten Gesichtsklarheit bei und erfüllen USCIS-Foto-Spezifikationen."
    },
    {
      q: "Welche Foto-Spezifikationen erfordert USCIS?",
      a: "USCIS erfordert Passfoto-Stil-Fotos, die 2x2 Zoll groß sind, innerhalb der letzten 6 Monate aufgenommen wurden, mit einem einfachen weißen oder cremefarbenen Hintergrund und Ihr volles Gesicht zeigen. Die Dateigröße muss für DS-160-Anträge unter 240KB liegen. Toolaze komprimiert Ihr Foto, um die Dateigrößenanforderung zu erfüllen und dabei diese visuellen Spezifikationen beizubehalten."
    }
  ],
  es: [
    {
      q: "¿Qué pasa si mi foto no puede alcanzar 240KB sin perder calidad?",
      a: "Para originales de muy alta resolución, la herramienta ajustará automáticamente tanto la configuración de calidad como las dimensiones para asegurar que se alcance el objetivo de 240KB. El algoritmo prioriza la claridad facial y mantiene suficiente resolución para verificación de inmigración mientras cumple con el estricto requisito de tamaño de archivo."
    },
    {
      q: "¿La herramienta edita o embellece mi cara?",
      a: "¡No! Toolaze proporciona compresión técnica pura sin alteraciones faciales, embellecimiento o mejoras de IA. Sus rasgos faciales permanecen 100% auténticos, lo cual es esencial para estándares de inmigración. Solo comprimimos el tamaño del archivo, no la apariencia."
    },
    {
      q: "¿Son seguras y privadas mis fotos biométricas?",
      a: "¡Sí! Toda la compresión ocurre localmente en su navegador usando JavaScript y Canvas API. Sus fotos de pasaporte nunca abandonan su dispositivo, garantizando privacidad y seguridad completas. No se envían datos a nuestros servidores ni se almacenan en ningún lugar."
    },
    {
      q: "¿Puedo comprimir múltiples fotos de miembros de la familia a la vez?",
      a: "¡Sí! Toolaze admite procesamiento por lotes de hasta 100 fotos de pasaporte simultáneamente. Perfecto para procesar fotos para solicitudes de visa familiar completas o múltiples envíos de inmigración."
    },
    {
      q: "¿Mi foto comprimida será aceptada por USCIS?",
      a: "Sí. Toolaze mantiene la calidad visual y autenticidad requeridas para propósitos de inmigración mientras cumple con el estricto requisito de tamaño de archivo de 240KB. Las fotos comprimidas mantienen la claridad facial y cumplen con las especificaciones de fotos de USCIS."
    },
    {
      q: "¿Qué especificaciones de foto requiere USCIS?",
      a: "USCIS requiere fotos estilo pasaporte que sean de 2x2 pulgadas, tomadas dentro de los últimos 6 meses, con un fondo blanco liso o blanco roto, y que muestren su rostro completo. El tamaño del archivo debe estar por debajo de 240KB para aplicaciones DS-160. Toolaze comprime su foto para cumplir con el requisito de tamaño de archivo mientras mantiene estas especificaciones visuales."
    }
  ],
  fr: [
    {
      q: "Et si ma photo ne peut pas atteindre 240KB sans perdre en qualité?",
      a: "Pour les originaux très haute résolution, l'outil ajustera automatiquement à la fois les paramètres de qualité et les dimensions pour s'assurer que l'objectif de 240KB est atteint. L'algorithme priorise la clarté faciale et maintient une résolution suffisante pour la vérification de l'immigration tout en respectant l'exigence stricte de taille de fichier."
    },
    {
      q: "L'outil modifie-t-il ou embellit-il mon visage?",
      a: "Non! Toolaze fournit une compression technique pure sans altérations faciales, embellissement ou améliorations IA. Vos traits du visage restent 100% authentiques, ce qui est essentiel pour les normes d'immigration. Nous compressons uniquement la taille du fichier, pas l'apparence."
    },
    {
      q: "Mes photos biométriques sont-elles sécurisées et privées?",
      a: "Oui! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos photos de passeport ne quittent jamais votre appareil, garantissant une confidentialité et une sécurité complètes. Aucune donnée n'est jamais envoyée à nos serveurs ou stockée n'importe où."
    },
    {
      q: "Puis-je compresser plusieurs photos de membres de la famille à la fois?",
      a: "Oui! Toolaze prend en charge le traitement par lots de jusqu'à 100 photos de passeport simultanément. Parfait pour traiter des photos pour des demandes de visa familial complètes ou plusieurs soumissions d'immigration."
    },
    {
      q: "Ma photo compressée sera-t-elle acceptée par USCIS?",
      a: "Oui. Toolaze maintient la qualité visuelle et l'authenticité requises pour les besoins d'immigration tout en respectant l'exigence stricte de taille de fichier de 240KB. Les photos compressées maintiennent la clarté faciale et répondent aux spécifications de photos USCIS."
    },
    {
      q: "Quelles spécifications de photo USCIS exige-t-il?",
      a: "USCIS exige des photos de style passeport de 2x2 pouces, prises dans les 6 derniers mois, avec un fond blanc uni ou blanc cassé, et montrant votre visage complet. La taille du fichier doit être inférieure à 240KB pour les demandes DS-160. Toolaze compresse votre photo pour répondre à l'exigence de taille de fichier tout en maintenant ces spécifications visuelles."
    }
  ],
  pt: [
    {
      q: "E se minha foto não conseguir atingir 240KB sem perder qualidade?",
      a: "Para originais de muito alta resolução, a ferramenta ajustará automaticamente tanto as configurações de qualidade quanto as dimensões para garantir que o objetivo de 240KB seja atingido. O algoritmo prioriza a clareza facial e mantém resolução suficiente para verificação de imigração enquanto atende ao requisito rigoroso de tamanho de arquivo."
    },
    {
      q: "A ferramenta edita ou embeleza meu rosto?",
      a: "Não! Toolaze fornece compressão técnica pura sem alterações faciais, embelezamento ou melhorias de IA. Seus traços faciais permanecem 100% autênticos, o que é essencial para padrões de imigração. Compressamos apenas o tamanho do arquivo, não a aparência."
    },
    {
      q: "Minhas fotos biométricas são seguras e privadas?",
      a: "Sim! Toda a compressão acontece localmente em seu navegador usando JavaScript e Canvas API. Suas fotos de passaporte nunca deixam seu dispositivo, garantindo privacidade e segurança completas. Nenhum dado é enviado para nossos servidores ou armazenado em qualquer lugar."
    },
    {
      q: "Posso comprimir várias fotos de membros da família de uma vez?",
      a: "Sim! Toolaze suporta processamento em lote de até 100 fotos de passaporte simultaneamente. Perfeito para processar fotos para solicitações de visto familiar completas ou múltiplos envios de imigração."
    },
    {
      q: "Minha foto comprimida será aceita pelo USCIS?",
      a: "Sim. Toolaze mantém a qualidade visual e autenticidade necessárias para fins de imigração enquanto atende ao requisito rigoroso de tamanho de arquivo de 240KB. As fotos comprimidas mantêm a clareza facial e atendem às especificações de fotos do USCIS."
    },
    {
      q: "Quais especificações de foto o USCIS exige?",
      a: "USCIS exige fotos estilo passaporte de 2x2 polegadas, tiradas nos últimos 6 meses, com fundo branco liso ou branco quebrado, e mostrando seu rosto completo. O tamanho do arquivo deve estar abaixo de 240KB para aplicações DS-160. Toolaze comprime sua foto para atender ao requisito de tamanho de arquivo enquanto mantém essas especificações visuais."
    }
  ],
  it: [
    {
      q: "E se la mia foto non può raggiungere 240KB senza perdere qualità?",
      a: "Per originali ad altissima risoluzione, lo strumento regolerà automaticamente sia le impostazioni di qualità che le dimensioni per garantire che l'obiettivo di 240KB sia raggiunto. L'algoritmo priorizza la chiarezza facciale e mantiene una risoluzione sufficiente per la verifica dell'immigrazione mentre soddisfa il rigoroso requisito di dimensione del file."
    },
    {
      q: "Lo strumento modifica o abbellisce il mio viso?",
      a: "No! Toolaze fornisce compressione tecnica pura senza alterazioni facciali, abbellimento o miglioramenti IA. I tuoi tratti facciali rimangono 100% autentici, il che è essenziale per gli standard di immigrazione. Comprimiamo solo la dimensione del file, non l'aspetto."
    },
    {
      q: "Le mie foto biometriche sono sicure e private?",
      a: "Sì! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue foto del passaporto non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete. Nessun dato viene mai inviato ai nostri server o memorizzato da nessuna parte."
    },
    {
      q: "Posso comprimere più foto di membri della famiglia contemporaneamente?",
      a: "Sì! Toolaze supporta l'elaborazione batch di fino a 100 foto del passaporto contemporaneamente. Perfetto per elaborare foto per intere richieste di visto familiare o più invii di immigrazione."
    },
    {
      q: "La mia foto compressa sarà accettata da USCIS?",
      a: "Sì. Toolaze mantiene la qualità visiva e l'autenticità richieste per scopi di immigrazione mentre soddisfa il rigoroso requisito di dimensione del file di 240KB. Le foto compresse mantengono la chiarezza facciale e soddisfano le specifiche delle foto USCIS."
    },
    {
      q: "Quali specifiche fotografiche richiede USCIS?",
      a: "USCIS richiede foto stile passaporto di 2x2 pollici, scattate negli ultimi 6 mesi, con uno sfondo bianco semplice o bianco rotto, e che mostrino il tuo viso completo. La dimensione del file deve essere inferiore a 240KB per le applicazioni DS-160. Toolaze comprime la tua foto per soddisfare il requisito di dimensione del file mantenendo queste specifiche visive."
    }
  ],
  ja: [
    {
      q: "品質を失うことなく240KBに達しない場合はどうなりますか？",
      a: "非常に高解像度のオリジナルの場合、ツールは品質設定と寸法の両方を自動的に調整して、240KBの目標が達成されるようにします。アルゴリズムは顔の明瞭さを優先し、厳格なファイルサイズ要件を満たしながら、移民検証に十分な解像度を維持します。"
    },
    {
      q: "ツールは私の顔を編集または美化しますか？",
      a: "いいえ！Toolazeは顔の変更、美化、またはAI強化なしで純粋な技術的圧縮を提供します。顔の特徴は100%本物のままです。これは移民基準に不可欠です。ファイルサイズのみを圧縮し、外観は変更しません。"
    },
    {
      q: "生体認証写真は安全でプライベートですか？",
      a: "はい！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。パスポート写真がデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。データがサーバーに送信されたり、どこかに保存されたりすることはありません。"
    },
    {
      q: "複数の家族メンバーの写真を一度に圧縮できますか？",
      a: "はい！Toolazeは最大100枚のパスポート写真を同時に一括処理できます。家族全員のビザ申請や複数の移民提出の写真を処理するのに最適です。"
    },
    {
      q: "圧縮された写真はUSCISによって受け入れられますか？",
      a: "はい。Toolazeは、厳格な240KBファイルサイズ要件を満たしながら、移民目的に必要な視覚品質と真正性を維持します。圧縮された写真は顔の明瞭さを維持し、USCIS写真仕様を満たしています。"
    },
    {
      q: "USCISはどのような写真仕様を要求しますか？",
      a: "USCISは、過去6か月以内に撮影された、無地の白またはオフホワイトの背景で、顔全体が写っている2x2インチのパスポートスタイルの写真を要求します。DS-160申請の場合、ファイルサイズは240KB未満である必要があります。Toolazeは、これらの視覚仕様を維持しながら、ファイルサイズ要件を満たすように写真を圧縮します。"
    }
  ],
  ko: [
    {
      q: "품질을 잃지 않고 240KB에 도달할 수 없는 경우 어떻게 되나요?",
      a: "매우 고해상도 원본의 경우 도구는 240KB 목표를 달성하기 위해 품질 설정과 크기를 자동으로 조정합니다. 알고리즘은 얼굴 선명도를 우선시하고 엄격한 파일 크기 요구사항을 충족하면서 이민 검증을 위한 충분한 해상도를 유지합니다."
    },
    {
      q: "도구가 내 얼굴을 편집하거나 미화하나요?",
      a: "아니요! Toolaze는 얼굴 변경, 미화 또는 AI 향상 없이 순수한 기술적 압축을 제공합니다. 얼굴 특징은 100% 진정한 상태로 유지되며, 이는 이민 기준에 필수적입니다. 파일 크기만 압축하고 외관은 변경하지 않습니다."
    },
    {
      q: "내 생체 인식 사진이 안전하고 비공개인가요?",
      a: "예! 모든 압축은 JavaScript와 Canvas API를 사용하여 브라우저에서 로컬로 수행됩니다. 여권 사진이 기기를 떠나지 않아 완전한 개인정보 보호와 보안을 보장합니다. 데이터가 서버로 전송되거나 어디에도 저장되지 않습니다."
    },
    {
      q: "여러 가족 구성원의 사진을 한 번에 압축할 수 있나요?",
      a: "예! Toolaze는 최대 100개의 여권 사진을 동시에 일괄 처리할 수 있습니다. 전체 가족 비자 신청 또는 여러 이민 제출을 위한 사진을 처리하는 데 완벽합니다."
    },
    {
      q: "압축된 사진이 USCIS에서 승인되나요?",
      a: "예. Toolaze는 엄격한 240KB 파일 크기 요구사항을 충족하면서 이민 목적에 필요한 시각적 품질과 진정성을 유지합니다. 압축된 사진은 얼굴 선명도를 유지하고 USCIS 사진 사양을 충족합니다."
    },
    {
      q: "USCIS는 어떤 사진 사양을 요구하나요?",
      a: "USCIS는 지난 6개월 이내에 촬영된, 단색 흰색 또는 오프화이트 배경에 전체 얼굴이 보이는 2x2인치 여권 스타일 사진을 요구합니다. DS-160 신청의 경우 파일 크기는 240KB 미만이어야 합니다. Toolaze는 이러한 시각적 사양을 유지하면서 파일 크기 요구사항을 충족하도록 사진을 압축합니다."
    }
  ],
  'zh-TW': [
    {
      q: "如果我的照片無法在不損失品質的情況下達到240KB怎麼辦？",
      a: "對於非常高解析度的原始照片，工具會自動調整品質設定和尺寸，以確保達到240KB目標。演算法優先考慮面部清晰度，在滿足嚴格檔案大小要求的同時，保持足夠的解析度以供移民驗證。"
    },
    {
      q: "工具會編輯或美化我的臉部嗎？",
      a: "不會！Toolaze提供純技術壓縮，不進行任何面部更改、美化或AI增強。您的面部特徵保持100%真實，這對於移民標準至關重要。我們只壓縮檔案大小，不改變外觀。"
    },
    {
      q: "我的生物識別照片安全且私密嗎？",
      a: "是的！所有壓縮都在您的瀏覽器中使用JavaScript和Canvas API本地進行。您的護照照片永遠不會離開您的設備，確保完全的隱私和安全。數據永遠不會發送到我們的伺服器或存儲在任何地方。"
    },
    {
      q: "我可以一次壓縮多個家庭成員的照片嗎？",
      a: "是的！Toolaze支援同時批次處理最多100張護照照片。非常適合為整個家庭簽證申請或多個移民提交處理照片。"
    },
    {
      q: "我的壓縮照片會被USCIS接受嗎？",
      a: "是的。Toolaze在滿足嚴格的240KB檔案大小要求的同時，保持移民目的所需的視覺品質和真實性。壓縮的照片保持面部清晰度並符合USCIS照片規格。"
    },
    {
      q: "USCIS要求什麼照片規格？",
      a: "USCIS要求2x2英寸、過去6個月內拍攝、純白或米白色背景、顯示完整臉部的護照風格照片。DS-160申請的檔案大小必須低於240KB。Toolaze壓縮您的照片以滿足檔案大小要求，同時保持這些視覺規格。"
    }
  ]
}

async function main() {
  const languages = ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']
  
  for (const lang of languages) {
    const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (!data['uscis-photo-240kb']) {
      console.log(`⚠️  ${lang}: uscis-photo-240kb section not found`)
      continue
    }
    
    const faq = faqTranslations[lang]
    if (!faq) {
      console.log(`⚠️  ${lang}: FAQ translation not found`)
      continue
    }
    
    // 替换 FAQ
    data['uscis-photo-240kb'].faq = faq
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ ${lang}: uscis-photo-240kb FAQ translated`)
  }
  
  console.log('\n✨ All FAQ translations completed!')
}

main().catch(console.error)
