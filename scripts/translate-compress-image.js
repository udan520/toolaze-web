const fs = require('fs')
const path = require('path')

// 翻译映射
const translations = {
  de: {
    metadata: {
      title: "Bilder online komprimieren (Kostenlos, Batch & Keine Werbung) - Toolaze",
      description: "Wie komprimiere ich Bilder? 1. Bild hochladen 2. Zielgröße festlegen 3. Komprimiertes herunterladen. Dateigröße um 60% reduzieren bei gleichbleibender Qualität. Sicher & Privat."
    },
    intro: {
      title: "Warum Bilder komprimieren?",
      content: [
        {
          title: "Vorteile der Bildkomprimierung",
          text: "Große Bilddateien können Websites verlangsamen, Speicherplatz verbrauchen, Upload-Fehler verursachen und Bandbreitenkosten erhöhen. Die Komprimierung von Bildern reduziert die Dateigröße um 50-70%, während die akzeptable visuelle Qualität erhalten bleibt, was sie perfekt für die Webnutzung, E-Mail-Anhänge, Online-Formulare und Speicheroptimierung macht. Unser universeller Bildkompressor unterstützt JPG-, PNG-, WebP- und BMP-Formate und verarbeitet alle Bilder lokal in Ihrem Browser mit Canvas API, was vollständige Privatsphäre und schnelle Komprimierung ohne Upload Ihrer Bilder auf einen Server gewährleistet."
        },
        {
          title: "Wann Bilder komprimieren",
          text: "Komprimieren Sie Bilder, wenn Sie Fotos und Grafiken für schnellere Website-Ladezeiten optimieren müssen, Upload-Größenlimits für Online-Formulare, E-Mail-Anhänge oder Social-Media-Plattformen erfüllen müssen, Speicherplatz auf Ihrem Gerät oder Cloud-Speicher sparen oder Bandbreitenkosten für Web-Hosting reduzieren möchten. Unser Tool unterstützt präzise Größensteuerung, sodass Sie exakte Zielgrößen in KB oder MB für jedes unterstützte Format festlegen können, was es perfekt macht, um spezifische Anforderungen zu erfüllen und gleichzeitig die Bildqualität zu erhalten."
        }
      ]
    },
    howToUse: {
      title: "Wie man Bilder komprimiert",
      steps: [
        {
          title: "Ihre Bilder hochladen",
          desc: "Ziehen Sie Ihre Bilder (JPG, PNG, WebP oder BMP) in den Komprimierungsbereich oder klicken Sie, um Dateien von Ihrem Gerät auszuwählen."
        },
        {
          title: "Zielgröße festlegen",
          desc: "Wählen Sie Ihre gewünschte Dateigröße in KB oder MB. Unser Kompressor optimiert Ihre Bilder, um das Ziel zu erreichen und gleichzeitig die Qualität zu erhalten."
        },
        {
          title: "Komprimierte Dateien herunterladen",
          desc: "Laden Sie Ihre komprimierten Bilder sofort herunter. Jede Datei behält die visuelle Qualität bei und ist deutlich kleiner als das Original."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Browser-Native Verarbeitung",
      limit: "Batch 100+ Bilder - Unbegrenzte Dateigrößen",
      logic: "Präzise KB/MB Größensteuerung",
      privacy: "100% Clientseitig (Lokale Browser-Verarbeitung)"
    },
    features: {
      title: "Universelle Bildkomprimierungs-Funktionen"
    },
    performanceMetrics: {
      metrics: [
        { label: "Unterstützte Formate", value: "JPG, PNG, WebP, BMP" },
        { label: "Ausgabeformat", value: "Ursprüngliches Format beibehalten" },
        { label: "Maximale Stapelgröße", value: "100 Bilder pro Sitzung" },
        { label: "Dateigrößenlimit", value: "Unbegrenzt (Begrenzt durch Browserspeicher)" },
        { label: "Komprimierungsverhältnis", value: "Typisch 50-70% Größenreduzierung" },
        { label: "Verarbeitungsort", value: "100% Clientseitig (Browser Canvas API)" },
        { label: "Qualitätskontrolle", value: "Präzise Größensteuerung mit Qualitätserhaltung" }
      ]
    },
    rating: {
      text: "\"Perfektes Tool zum Komprimieren aller meiner Bilder! Schnell, kostenlos und privat!\" - Schließen Sie sich Tausenden von Benutzern an, die Toolaze für die Bildkomprimierung vertrauen."
    },
    faq: [
      {
        q: "Welche Bildformate werden unterstützt?",
        a: "Toolaze unterstützt JPG, PNG, WebP und BMP Formate. Ihre komprimierten Dateien werden in ihrem ursprünglichen Format heruntergeladen."
      },
      {
        q: "Wie viel kann ich ein Bild komprimieren?",
        a: "Typischerweise können Bilder um 50-70% komprimiert werden, während eine akzeptable visuelle Qualität erhalten bleibt. Die genaue Reduzierung hängt von der ursprünglichen Dateigröße und dem Format ab."
      },
      {
        q: "Kann ich mehrere Bilder gleichzeitig komprimieren?",
        a: "Ja, Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Bildern pro Sitzung. Sie können gesamte Fotosammlungen in einem Vorgang verarbeiten."
      },
      {
        q: "Ist die Bildkomprimierung kostenlos und sicher?",
        a: "Ja, Toolaze ist für immer völlig kostenlos ohne versteckte Kosten. Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre Bilder verlassen niemals Ihr Gerät—was 100% Privatsphäre und Sicherheit gewährleistet."
      },
      {
        q: "Welche Dateigrößen kann ich komprimieren?",
        a: "Es gibt keine individuellen Dateigrößenbeschränkungen. Wenn Ihr Computer die Datei öffnen kann, kann Toolaze sie komprimieren. Sie können Dateien jeder Größe verarbeiten."
      },
      {
        q: "Wird die Transparenz bei PNG-Dateien erhalten bleiben?",
        a: "Ja, beim Komprimieren von PNG-Dateien wird die Transparenz erhalten. Das Tool behält den Alpha-Kanal während der Komprimierung bei."
      }
    ]
  },
  es: {
    metadata: {
      title: "Comprimir Imágenes Online (Gratis, Lotes y Sin Anuncios) - Toolaze",
      description: "¿Cómo comprimir imágenes? 1. Subir imagen 2. Establecer tamaño objetivo 3. Descargar comprimido. Reducir tamaño de archivo en 60% manteniendo calidad. Seguro y Privado."
    },
    intro: {
      title: "¿Por qué comprimir imágenes?",
      content: [
        {
          title: "Beneficios de la Compresión de Imágenes",
          text: "Los archivos de imagen grandes pueden ralentizar sitios web, consumir espacio de almacenamiento, causar fallos de carga y aumentar los costos de ancho de banda. Comprimir imágenes reduce el tamaño del archivo en un 50-70% mientras mantiene una calidad visual aceptable, haciéndolas perfectas para uso web, adjuntos de correo electrónico, formularios en línea y optimización de almacenamiento. Nuestro compresor de imágenes universal admite formatos JPG, PNG, WebP y BMP, procesando todas las imágenes localmente en su navegador usando Canvas API, garantizando privacidad completa y compresión rápida sin cargar sus imágenes a ningún servidor."
        },
        {
          title: "Cuándo comprimir imágenes",
          text: "Comprima imágenes cuando necesite optimizar fotos y gráficos para cargas más rápidas de sitios web, cumplir límites de tamaño de carga para formularios en línea, adjuntos de correo electrónico o plataformas de redes sociales, ahorrar espacio de almacenamiento en su dispositivo o almacenamiento en la nube, o reducir costos de ancho de banda para alojamiento web. Nuestra herramienta admite control preciso de tamaño, permitiéndole establecer tamaños objetivo exactos en KB o MB para cualquier formato compatible, haciéndola perfecta para cumplir requisitos específicos mientras mantiene la calidad de imagen."
        }
      ]
    },
    howToUse: {
      title: "Cómo comprimir imágenes",
      steps: [
        {
          title: "Subir sus imágenes",
          desc: "Arrastre y suelte sus imágenes (JPG, PNG, WebP o BMP) en el área del compresor o haga clic para navegar y seleccionar archivos desde su dispositivo."
        },
        {
          title: "Establecer tamaño objetivo",
          desc: "Elija el tamaño de archivo deseado en KB o MB. Nuestro compresor optimizará sus imágenes para cumplir el objetivo manteniendo la calidad."
        },
        {
          title: "Descargar archivos comprimidos",
          desc: "Descargue sus imágenes comprimidas al instante. Cada archivo mantiene la calidad visual mientras es significativamente más pequeño que el original."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Procesamiento Nativo del Navegador",
      limit: "Lote 100+ Imágenes - Tamaños de Archivo Ilimitados",
      logic: "Control Preciso de Tamaño KB/MB",
      privacy: "100% del Lado del Cliente (Procesamiento Local del Navegador)"
    },
    features: {
      title: "Características Universales de Compresión de Imágenes"
    },
    performanceMetrics: {
      metrics: [
        { label: "Formatos Soportados", value: "JPG, PNG, WebP, BMP" },
        { label: "Formato de Salida", value: "Formato original preservado" },
        { label: "Tamaño Máximo de Lote", value: "100 imágenes por sesión" },
        { label: "Límite de Tamaño de Archivo", value: "Ilimitado (Limitado por la memoria del navegador)" },
        { label: "Relación de Compresión", value: "Reducción de tamaño típica del 50-70%" },
        { label: "Ubicación de Procesamiento", value: "100% del Lado del Cliente (API Canvas del Navegador)" },
        { label: "Control de Calidad", value: "Objetivo de tamaño preciso con preservación de calidad" }
      ]
    },
    rating: {
      text: "\"¡Herramienta perfecta para comprimir todas mis imágenes! ¡Rápida, gratuita y privada!\" - Únete a miles de usuarios que confían en Toolaze para la compresión de imágenes."
    },
    faq: [
      {
        q: "¿Qué formatos de imagen son compatibles?",
        a: "Toolaze admite formatos JPG, PNG, WebP y BMP. Sus archivos comprimidos se descargarán en su formato original."
      },
      {
        q: "¿Cuánto puedo comprimir una imagen?",
        a: "Típicamente, las imágenes se pueden comprimir entre un 50-70% manteniendo una calidad visual aceptable. La reducción exacta depende del tamaño del archivo original y el formato."
      },
      {
        q: "¿Puedo comprimir múltiples imágenes a la vez?",
        a: "Sí, Toolaze admite procesamiento por lotes de hasta 100 imágenes por sesión. Puede procesar colecciones completas de fotos en una operación."
      },
      {
        q: "¿La compresión de imágenes es gratuita y segura?",
        a: "Sí, Toolaze es completamente gratuito para siempre sin costos ocultos. Toda la compresión ocurre localmente en su navegador. Sus imágenes nunca abandonan su dispositivo—garantizando 100% de privacidad y seguridad."
      },
      {
        q: "¿Qué tamaños de archivo puedo comprimir?",
        a: "No hay límites de tamaño de archivo individual. Si su computadora puede abrir el archivo, Toolaze puede comprimirlo. Puede procesar archivos de cualquier tamaño."
      },
      {
        q: "¿Se preservará la transparencia para archivos PNG?",
        a: "Sí, al comprimir archivos PNG, se preserva la transparencia. La herramienta mantiene el canal alfa durante la compresión."
      }
    ]
  },
  fr: {
    metadata: {
      title: "Compresser des Images en Ligne (Gratuit, Lots et Sans Publicité) - Toolaze",
      description: "Comment compresser des images? 1. Télécharger l'image 2. Définir la taille cible 3. Télécharger compressé. Réduire la taille du fichier de 60% tout en maintenant la qualité. Sécurisé et Privé."
    },
    intro: {
      title: "Pourquoi compresser des images?",
      content: [
        {
          title: "Avantages de la Compression d'Images",
          text: "Les fichiers image volumineux peuvent ralentir les sites web, consommer de l'espace de stockage, provoquer des échecs de téléchargement et augmenter les coûts de bande passante. La compression d'images réduit la taille du fichier de 50-70% tout en maintenant une qualité visuelle acceptable, les rendant parfaites pour l'utilisation web, les pièces jointes d'e-mail, les formulaires en ligne et l'optimisation du stockage. Notre compresseur d'images universel prend en charge les formats JPG, PNG, WebP et BMP, traitant toutes les images localement dans votre navigateur en utilisant Canvas API, garantissant une confidentialité complète et une compression rapide sans télécharger vos images sur un serveur."
        },
        {
          title: "Quand compresser des images",
          text: "Compressez des images lorsque vous devez optimiser des photos et des graphiques pour des chargements de sites web plus rapides, respecter les limites de taille de téléchargement pour les formulaires en ligne, les pièces jointes d'e-mail ou les plateformes de médias sociaux, économiser de l'espace de stockage sur votre appareil ou le stockage cloud, ou réduire les coûts de bande passante pour l'hébergement web. Notre outil prend en charge le contrôle précis de la taille, vous permettant de définir des tailles cibles exactes en Ko ou Mo pour tout format pris en charge, le rendant parfait pour répondre à des exigences spécifiques tout en maintenant la qualité de l'image."
        }
      ]
    },
    howToUse: {
      title: "Comment compresser des images",
      steps: [
        {
          title: "Télécharger vos images",
          desc: "Glissez-déposez vos images (JPG, PNG, WebP ou BMP) dans la zone de compression ou cliquez pour parcourir et sélectionner des fichiers depuis votre appareil."
        },
        {
          title: "Définir la taille cible",
          desc: "Choisissez la taille de fichier souhaitée en Ko ou Mo. Notre compresseur optimisera vos images pour atteindre l'objectif tout en maintenant la qualité."
        },
        {
          title: "Télécharger les fichiers compressés",
          desc: "Téléchargez vos images compressées instantanément. Chaque fichier maintient la qualité visuelle tout en étant considérablement plus petit que l'original."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Traitement Natif du Navigateur",
      limit: "Lot 100+ Images - Tailles de Fichier Illimitées",
      logic: "Contrôle Précis de Taille Ko/Mo",
      privacy: "100% Côté Client (Traitement Local du Navigateur)"
    },
    features: {
      title: "Fonctionnalités Universelles de Compression d'Images"
    },
    performanceMetrics: {
      metrics: [
        { label: "Formats Pris en Charge", value: "JPG, PNG, WebP, BMP" },
        { label: "Format de Sortie", value: "Format original préservé" },
        { label: "Taille Maximale du Lot", value: "100 images par session" },
        { label: "Limite de Taille de Fichier", value: "Illimité (Limité par la mémoire du navigateur)" },
        { label: "Taux de Compression", value: "Réduction de taille typique de 50-70%" },
        { label: "Emplacement de Traitement", value: "100% Côté Client (API Canvas du Navigateur)" },
        { label: "Contrôle de Qualité", value: "Ciblage précis de la taille avec préservation de la qualité" }
      ]
    },
    rating: {
      text: "\"Outil parfait pour compresser toutes mes images! Rapide, gratuit et privé!\" - Rejoignez des milliers d'utilisateurs qui font confiance à Toolaze pour la compression d'images."
    },
    faq: [
      {
        q: "Quels formats d'image sont pris en charge?",
        a: "Toolaze prend en charge les formats JPG, PNG, WebP et BMP. Vos fichiers compressés seront téléchargés dans leur format d'origine."
      },
      {
        q: "Combien puis-je compresser une image?",
        a: "Généralement, les images peuvent être compressées de 50-70% tout en maintenant une qualité visuelle acceptable. La réduction exacte dépend de la taille du fichier original et du format."
      },
      {
        q: "Puis-je compresser plusieurs images à la fois?",
        a: "Oui, Toolaze prend en charge le traitement par lots de jusqu'à 100 images par session. Vous pouvez traiter des collections complètes de photos en une seule opération."
      },
      {
        q: "La compression d'images est-elle gratuite et sécurisée?",
        a: "Oui, Toolaze est complètement gratuit pour toujours sans coûts cachés. Toute la compression se fait localement dans votre navigateur. Vos images ne quittent jamais votre appareil—garantissant 100% de confidentialité et de sécurité."
      },
      {
        q: "Quelles tailles de fichier puis-je compresser?",
        a: "Il n'y a pas de limites de taille de fichier individuelles. Si votre ordinateur peut ouvrir le fichier, Toolaze peut le compresser. Vous pouvez traiter des fichiers de toute taille."
      },
      {
        q: "La transparence sera-t-elle préservée pour les fichiers PNG?",
        a: "Oui, lors de la compression des fichiers PNG, la transparence est préservée. L'outil maintient le canal alpha pendant la compression."
      }
    ]
  },
  pt: {
    metadata: {
      title: "Comprimir Imagens Online (Grátis, Lotes e Sem Anúncios) - Toolaze",
      description: "Como comprimir imagens? 1. Fazer upload da imagem 2. Definir tamanho alvo 3. Baixar comprimido. Reduzir tamanho do arquivo em 60% mantendo qualidade. Seguro e Privado."
    },
    intro: {
      title: "Por que comprimir imagens?",
      content: [
        {
          title: "Benefícios da Compressão de Imagens",
          text: "Arquivos de imagem grandes podem retardar sites, consumir espaço de armazenamento, causar falhas de upload e aumentar os custos de largura de banda. Comprimir imagens reduz o tamanho do arquivo em 50-70% mantendo qualidade visual aceitável, tornando-as perfeitas para uso na web, anexos de e-mail, formulários online e otimização de armazenamento. Nosso compressor de imagens universal suporta formatos JPG, PNG, WebP e BMP, processando todas as imagens localmente em seu navegador usando Canvas API, garantindo privacidade completa e compressão rápida sem fazer upload de suas imagens para qualquer servidor."
        },
        {
          title: "Quando comprimir imagens",
          text: "Comprima imagens quando precisar otimizar fotos e gráficos para carregamento mais rápido de sites, atender limites de tamanho de upload para formulários online, anexos de e-mail ou plataformas de mídia social, economizar espaço de armazenamento em seu dispositivo ou armazenamento em nuvem, ou reduzir custos de largura de banda para hospedagem web. Nossa ferramenta suporta controle preciso de tamanho, permitindo definir tamanhos alvo exatos em KB ou MB para qualquer formato suportado, tornando-a perfeita para atender requisitos específicos mantendo a qualidade da imagem."
        }
      ]
    },
    howToUse: {
      title: "Como comprimir imagens",
      steps: [
        {
          title: "Fazer upload de suas imagens",
          desc: "Arraste e solte suas imagens (JPG, PNG, WebP ou BMP) na área do compressor ou clique para navegar e selecionar arquivos do seu dispositivo."
        },
        {
          title: "Definir tamanho alvo",
          desc: "Escolha o tamanho de arquivo desejado em KB ou MB. Nosso compressor otimizará suas imagens para atingir o alvo mantendo a qualidade."
        },
        {
          title: "Baixar arquivos comprimidos",
          desc: "Baixe suas imagens comprimidas instantaneamente. Cada arquivo mantém a qualidade visual enquanto é significativamente menor que o original."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Processamento Nativo do Navegador",
      limit: "Lote 100+ Imagens - Tamanhos de Arquivo Ilimitados",
      logic: "Controle Preciso de Tamanho KB/MB",
      privacy: "100% do Lado do Cliente (Processamento Local do Navegador)"
    },
    features: {
      title: "Recursos Universais de Compressão de Imagens"
    },
    performanceMetrics: {
      metrics: [
        { label: "Formatos Suportados", value: "JPG, PNG, WebP, BMP" },
        { label: "Formato de Saída", value: "Formato original preservado" },
        { label: "Tamanho Máximo do Lote", value: "100 imagens por sessão" },
        { label: "Limite de Tamanho de Arquivo", value: "Ilimitado (Limitado pela memória do navegador)" },
        { label: "Taxa de Compressão", value: "Redução de tamanho típica de 50-70%" },
        { label: "Localização do Processamento", value: "100% do Lado do Cliente (API Canvas do Navegador)" },
        { label: "Controle de Qualidade", value: "Direcionamento preciso de tamanho com preservação de qualidade" }
      ]
    },
    rating: {
      text: "\"Ferramenta perfeita para comprimir todas as minhas imagens! Rápida, gratuita e privada!\" - Junte-se a milhares de usuários que confiam no Toolaze para compressão de imagens."
    },
    faq: [
      {
        q: "Quais formatos de imagem são suportados?",
        a: "Toolaze suporta formatos JPG, PNG, WebP e BMP. Seus arquivos comprimidos serão baixados em seu formato original."
      },
      {
        q: "Quanto posso comprimir uma imagem?",
        a: "Tipicamente, imagens podem ser comprimidas em 50-70% mantendo qualidade visual aceitável. A redução exata depende do tamanho do arquivo original e do formato."
      },
      {
        q: "Posso comprimir várias imagens de uma vez?",
        a: "Sim, Toolaze suporta processamento em lote de até 100 imagens por sessão. Você pode processar coleções completas de fotos em uma operação."
      },
      {
        q: "A compressão de imagens é gratuita e segura?",
        a: "Sim, Toolaze é completamente gratuito para sempre sem custos ocultos. Toda a compressão acontece localmente em seu navegador. Suas imagens nunca deixam seu dispositivo—garantindo 100% de privacidade e segurança."
      },
      {
        q: "Quais tamanhos de arquivo posso comprimir?",
        a: "Não há limites de tamanho de arquivo individual. Se seu computador pode abrir o arquivo, Toolaze pode comprimi-lo. Você pode processar arquivos de qualquer tamanho."
      },
      {
        q: "A transparência será preservada para arquivos PNG?",
        a: "Sim, ao comprimir arquivos PNG, a transparência é preservada. A ferramenta mantém o canal alfa durante a compressão."
      }
    ]
  },
  it: {
    metadata: {
      title: "Comprimi Immagini Online (Gratis, Batch e Senza Pubblicità) - Toolaze",
      description: "Come comprimere immagini? 1. Carica immagine 2. Imposta dimensione obiettivo 3. Scarica compresso. Riduci dimensione file del 60% mantenendo qualità. Sicuro e Privato."
    },
    intro: {
      title: "Perché comprimere immagini?",
      content: [
        {
          title: "Vantaggi della Compressione Immagini",
          text: "I file immagine grandi possono rallentare i siti web, consumare spazio di archiviazione, causare errori di caricamento e aumentare i costi della larghezza di banda. Comprimere le immagini riduce la dimensione del file del 50-70% mantenendo una qualità visiva accettabile, rendendole perfette per l'uso web, gli allegati email, i moduli online e l'ottimizzazione dello storage. Il nostro compressore immagini universale supporta i formati JPG, PNG, WebP e BMP, elaborando tutte le immagini localmente nel tuo browser utilizzando Canvas API, garantendo completa privacy e compressione rapida senza caricare le tue immagini su alcun server."
        },
        {
          title: "Quando comprimere immagini",
          text: "Comprimi immagini quando devi ottimizzare foto e grafiche per caricamenti più rapidi dei siti web, soddisfare limiti di dimensione di caricamento per moduli online, allegati email o piattaforme di social media, risparmiare spazio di archiviazione sul tuo dispositivo o storage cloud, o ridurre i costi della larghezza di banda per l'hosting web. Il nostro strumento supporta il controllo preciso delle dimensioni, permettendoti di impostare dimensioni obiettivo esatte in KB o MB per qualsiasi formato supportato, rendendolo perfetto per soddisfare requisiti specifici mantenendo la qualità dell'immagine."
        }
      ]
    },
    howToUse: {
      title: "Come comprimere immagini",
      steps: [
        {
          title: "Carica le tue immagini",
          desc: "Trascina e rilascia le tue immagini (JPG, PNG, WebP o BMP) nell'area del compressore o fai clic per sfogliare e selezionare file dal tuo dispositivo."
        },
        {
          title: "Imposta dimensione obiettivo",
          desc: "Scegli la dimensione del file desiderata in KB o MB. Il nostro compressore ottimizzerà le tue immagini per raggiungere l'obiettivo mantenendo la qualità."
        },
        {
          title: "Scarica file compressi",
          desc: "Scarica le tue immagini compresse all'istante. Ogni file mantiene la qualità visiva pur essendo significativamente più piccolo dell'originale."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Elaborazione Nativa del Browser",
      limit: "Batch 100+ Immagini - Dimensioni File Illimitate",
      logic: "Controllo Preciso Dimensione KB/MB",
      privacy: "100% Lato Client (Elaborazione Locale del Browser)"
    },
    features: {
      title: "Funzionalità Universali di Compressione Immagini"
    },
    performanceMetrics: {
      metrics: [
        { label: "Formati Supportati", value: "JPG, PNG, WebP, BMP" },
        { label: "Formato di Output", value: "Formato originale preservato" },
        { label: "Dimensione Massima del Batch", value: "100 immagini per sessione" },
        { label: "Limite Dimensione File", value: "Illimitato (Limitato dalla memoria del browser)" },
        { label: "Rapporto di Compressione", value: "Riduzione tipica delle dimensioni del 50-70%" },
        { label: "Posizione di Elaborazione", value: "100% Lato Client (API Canvas del Browser)" },
        { label: "Controllo Qualità", value: "Targeting preciso delle dimensioni con preservazione della qualità" }
      ]
    },
    rating: {
      text: "\"Strumento perfetto per comprimere tutte le mie immagini! Veloce, gratuito e privato!\" - Unisciti a migliaia di utenti che si fidano di Toolaze per la compressione immagini."
    },
    faq: [
      {
        q: "Quali formati di immagine sono supportati?",
        a: "Toolaze supporta formati JPG, PNG, WebP e BMP. I tuoi file compressi saranno scaricati nel loro formato originale."
      },
      {
        q: "Quanto posso comprimere un'immagine?",
        a: "Tipicamente, le immagini possono essere compresse del 50-70% mantenendo una qualità visiva accettabile. La riduzione esatta dipende dalla dimensione del file originale e dal formato."
      },
      {
        q: "Posso comprimere più immagini contemporaneamente?",
        a: "Sì, Toolaze supporta l'elaborazione batch di fino a 100 immagini per sessione. Puoi elaborare intere collezioni di foto in un'operazione."
      },
      {
        q: "La compressione immagini è gratuita e sicura?",
        a: "Sì, Toolaze è completamente gratuito per sempre senza costi nascosti. Tutta la compressione avviene localmente nel tuo browser. Le tue immagini non lasciano mai il tuo dispositivo—garantendo 100% privacy e sicurezza."
      },
      {
        q: "Quali dimensioni di file posso comprimere?",
        a: "Non ci sono limiti di dimensione del file individuali. Se il tuo computer può aprire il file, Toolaze può comprimerlo. Puoi elaborare file di qualsiasi dimensione."
      },
      {
        q: "La trasparenza sarà preservata per i file PNG?",
        a: "Sì, quando si comprimono file PNG, la trasparenza è preservata. Lo strumento mantiene il canale alfa durante la compressione."
      }
    ]
  },
  ja: {
    metadata: {
      title: "画像オンライン圧縮（無料、バッチ処理、広告なし）- Toolaze",
      description: "画像を圧縮する方法は？1. 画像をアップロード 2. 目標サイズを設定 3. 圧縮ファイルをダウンロード。品質を維持しながらファイルサイズを60%削減します。安全でプライベート。"
    },
    intro: {
      title: "画像を圧縮する理由",
      content: [
        {
          title: "画像圧縮の利点",
          text: "大きな画像ファイルは、ウェブサイトの速度を低下させ、ストレージスペースを消費し、アップロードの失敗を引き起こし、帯域幅コストを増加させる可能性があります。画像を圧縮すると、許容できる視覚品質を維持しながらファイルサイズを50-70%削減でき、ウェブ使用、メール添付、オンラインフォーム、ストレージ最適化に最適です。当社のユニバーサル画像圧縮ツールは、JPG、PNG、WebP、BMP形式をサポートし、Canvas APIを使用してブラウザ内でローカルにすべての画像を処理し、画像をサーバーにアップロードすることなく、完全なプライバシーと高速圧縮を保証します。"
        },
        {
          title: "画像を圧縮するタイミング",
          text: "ウェブサイトの読み込みを高速化するために写真やグラフィックを最適化する必要がある場合、オンラインフォーム、メール添付、またはソーシャルメディアプラットフォームのアップロードサイズ制限を満たす場合、デバイスまたはクラウドストレージのストレージスペースを節約する場合、またはウェブホスティングの帯域幅コストを削減する場合に画像を圧縮します。当社のツールは正確なサイズ制御をサポートし、サポートされている形式のKBまたはMBで正確なターゲットサイズを設定できるため、画像品質を維持しながら特定の要件を満たすのに最適です。"
        }
      ]
    },
    howToUse: {
      title: "画像の圧縮方法",
      steps: [
        {
          title: "画像をアップロード",
          desc: "画像（JPG、PNG、WebP、またはBMP）を圧縮エリアにドラッグ&ドロップするか、クリックしてデバイスからファイルを選択します。"
        },
        {
          title: "ターゲットサイズを設定",
          desc: "希望するファイルサイズ（KBまたはMB）を選択します。圧縮ツールが画像を最適化し、品質を維持しながらターゲットを達成します。"
        },
        {
          title: "圧縮ファイルをダウンロード",
          desc: "圧縮された画像を即座にダウンロードします。各ファイルは視覚的な品質を維持しながら、元のファイルよりも大幅に小さくなります。"
        }
      ]
    },
    specs: {
      engine: "Canvas API - ブラウザネイティブ処理",
      limit: "バッチ100+画像 - 無制限ファイルサイズ",
      logic: "正確なKB/MBサイズ制御",
      privacy: "100%クライアント側（ローカルブラウザ処理）"
    },
    features: {
      title: "ユニバーサル画像圧縮機能"
    },
    performanceMetrics: {
      metrics: [
        { label: "サポート形式", value: "JPG、PNG、WebP、BMP" },
        { label: "出力形式", value: "元の形式を保持" },
        { label: "最大バッチサイズ", value: "セッションあたり100画像" },
        { label: "ファイルサイズ制限", value: "無制限（ブラウザのメモリによって制限）" },
        { label: "圧縮率", value: "典型的に50-70%のサイズ削減" },
        { label: "処理場所", value: "100%クライアント側（ブラウザCanvas API）" },
        { label: "品質管理", value: "品質保持を伴う正確なサイズターゲティング" }
      ]
    },
    rating: {
      text: "\"すべての画像を圧縮するのに最適なツール！高速、無料、プライベート！\" - 画像圧縮のためにToolazeを信頼する何千人ものユーザーに参加してください。"
    },
    faq: [
      {
        q: "どの画像形式がサポートされていますか？",
        a: "ToolazeはJPG、PNG、WebP、BMP形式をサポートしています。圧縮されたファイルは元の形式でダウンロードされます。"
      },
      {
        q: "画像をどのくらい圧縮できますか？",
        a: "通常、画像は許容できる視覚品質を維持しながら50-70%圧縮できます。正確な削減は、元のファイルサイズと形式によって異なります。"
      },
      {
        q: "複数の画像を一度に圧縮できますか？",
        a: "はい、Toolazeはセッションあたり最大100画像のバッチ処理をサポートしています。1回の操作で写真コレクション全体を処理できます。"
      },
      {
        q: "画像圧縮は無料で安全ですか？",
        a: "はい、Toolazeは完全に無料で、隠れたコストはありません。すべての圧縮はブラウザ内でローカルに実行されます。画像がデバイスを離れることはなく、100%のプライバシーとセキュリティを保証します。"
      },
      {
        q: "どのようなファイルサイズを圧縮できますか？",
        a: "個別のファイルサイズ制限はありません。コンピューターがファイルを開ける場合、Toolazeはそれを圧縮できます。任意のサイズのファイルを処理できます。"
      },
      {
        q: "PNGファイルの透明度は保持されますか？",
        a: "はい、PNGファイルを圧縮する場合、透明度は保持されます。ツールは圧縮中にアルファチャンネルを維持します。"
      }
    ]
  },
  ko: {
    metadata: {
      title: "이미지 온라인 압축 (무료, 일괄 처리 및 광고 없음) - Toolaze",
      description: "이미지를 압축하는 방법은? 1. 이미지 업로드 2. 목표 크기 설정 3. 압축 파일 다운로드. 품질을 유지하면서 파일 크기를 60% 줄입니다. 안전하고 비공개."
    },
    intro: {
      title: "이미지를 압축하는 이유",
      content: [
        {
          title: "이미지 압축의 이점",
          text: "큰 이미지 파일은 웹사이트 속도를 늦추고, 저장 공간을 소비하며, 업로드 실패를 유발하고, 대역폭 비용을 증가시킬 수 있습니다. 이미지를 압축하면 허용 가능한 시각적 품질을 유지하면서 파일 크기를 50-70% 줄일 수 있어 웹 사용, 이메일 첨부, 온라인 양식 및 저장 최적화에 완벽합니다. 당사의 범용 이미지 압축기는 JPG, PNG, WebP 및 BMP 형식을 지원하며, Canvas API를 사용하여 브라우저에서 로컬로 모든 이미지를 처리하여 이미지를 서버에 업로드하지 않고도 완전한 개인정보 보호와 빠른 압축을 보장합니다."
        },
        {
          title: "이미지를 압축하는 시기",
          text: "웹사이트 로딩을 더 빠르게 하기 위해 사진과 그래픽을 최적화해야 할 때, 온라인 양식, 이메일 첨부 또는 소셜 미디어 플랫폼의 업로드 크기 제한을 충족해야 할 때, 장치 또는 클라우드 저장소의 저장 공간을 절약하거나 웹 호스팅의 대역폭 비용을 줄여야 할 때 이미지를 압축합니다. 당사의 도구는 정확한 크기 제어를 지원하여 지원되는 모든 형식에 대해 KB 또는 MB로 정확한 목표 크기를 설정할 수 있어 이미지 품질을 유지하면서 특정 요구사항을 충족하는 데 완벽합니다."
        }
      ]
    },
    howToUse: {
      title: "이미지 압축 방법",
      steps: [
        {
          title: "이미지 업로드",
          desc: "이미지(JPG, PNG, WebP 또는 BMP)를 압축 영역으로 드래그 앤 드롭하거나 클릭하여 장치에서 파일을 찾아 선택합니다."
        },
        {
          title: "목표 크기 설정",
          desc: "원하는 파일 크기(KB 또는 MB)를 선택하세요. 압축기가 이미지를 최적화하여 품질을 유지하면서 목표를 달성합니다."
        },
        {
          title: "압축 파일 다운로드",
          desc: "압축된 이미지를 즉시 다운로드하세요. 각 파일은 시각적 품질을 유지하면서 원본보다 훨씬 작습니다."
        }
      ]
    },
    specs: {
      engine: "Canvas API - 브라우저 네이티브 처리",
      limit: "일괄 처리 100+ 이미지 - 무제한 파일 크기",
      logic: "정확한 KB/MB 크기 제어",
      privacy: "100% 클라이언트 측 (로컬 브라우저 처리)"
    },
    features: {
      title: "범용 이미지 압축 기능"
    },
    performanceMetrics: {
      metrics: [
        { label: "지원 형식", value: "JPG, PNG, WebP, BMP" },
        { label: "출력 형식", value: "원본 형식 보존" },
        { label: "최대 배치 크기", value: "세션당 100개 이미지" },
        { label: "파일 크기 제한", value: "무제한 (브라우저 메모리에 따라 제한됨)" },
        { label: "압축 비율", value: "일반적으로 50-70% 크기 감소" },
        { label: "처리 위치", value: "100% 클라이언트 측 (브라우저 Canvas API)" },
        { label: "품질 제어", value: "품질 보존을 통한 정확한 크기 타겟팅" }
      ]
    },
    rating: {
      text: "\"모든 이미지를 압축하는 완벽한 도구! 빠르고 무료하며 비공개!\" - 이미지 압축을 위해 Toolaze를 신뢰하는 수천 명의 사용자에 합류하세요."
    },
    faq: [
      {
        q: "어떤 이미지 형식이 지원되나요?",
        a: "Toolaze는 JPG, PNG, WebP 및 BMP 형식을 지원합니다. 압축된 파일은 원본 형식으로 다운로드됩니다."
      },
      {
        q: "이미지를 얼마나 압축할 수 있나요?",
        a: "일반적으로 이미지는 허용 가능한 시각적 품질을 유지하면서 50-70% 압축할 수 있습니다. 정확한 감소는 원본 파일 크기와 형식에 따라 다릅니다."
      },
      {
        q: "여러 이미지를 한 번에 압축할 수 있나요?",
        a: "예, Toolaze는 세션당 최대 100개 이미지의 일괄 처리를 지원합니다. 한 번의 작업으로 전체 사진 컬렉션을 처리할 수 있습니다."
      },
      {
        q: "이미지 압축이 무료이고 안전한가요?",
        a: "예, Toolaze는 숨겨진 비용 없이 완전히 무료입니다. 모든 압축은 브라우저에서 로컬로 수행됩니다. 이미지가 기기를 떠나지 않아 100% 개인정보 보호와 보안을 보장합니다."
      },
      {
        q: "어떤 파일 크기를 압축할 수 있나요?",
        a: "개별 파일 크기 제한이 없습니다. 컴퓨터가 파일을 열 수 있으면 Toolaze가 압축할 수 있습니다. 모든 크기의 파일을 처리할 수 있습니다."
      },
      {
        q: "PNG 파일의 투명도가 보존되나요?",
        a: "예, PNG 파일을 압축할 때 투명도가 보존됩니다. 도구는 압축 중에 알파 채널을 유지합니다."
      }
    ]
  },
  'zh-TW': {
    metadata: {
      title: "圖片線上壓縮（免費、批次處理、無廣告）- Toolaze",
      description: "如何壓縮圖片？1. 上傳圖片 2. 設定目標大小 3. 下載壓縮檔。在保持品質的同時將檔案大小減少 60%。安全且私密。"
    },
    intro: {
      title: "為什麼要壓縮圖片？",
      content: [
        {
          title: "圖片壓縮的優點",
          text: "大型圖片檔案可能會減慢網站速度、消耗儲存空間、導致上傳失敗並增加頻寬成本。壓縮圖片可在保持可接受的視覺品質的同時將檔案大小減少 50-70%，使其非常適合網頁使用、電子郵件附件、線上表單和儲存優化。我們的通用圖片壓縮工具支援 JPG、PNG、WebP 和 BMP 格式，使用 Canvas API 在您的瀏覽器中本地處理所有圖片，確保完全隱私和快速壓縮，無需將圖片上傳到任何伺服器。"
        },
        {
          title: "何時壓縮圖片",
          text: "當您需要優化照片和圖形以加快網站載入速度、滿足線上表單、電子郵件附件或社交媒體平台的上傳大小限制、節省設備或雲端儲存的儲存空間，或降低網頁託管的頻寬成本時，請壓縮圖片。我們的工具支援精確的大小控制，允許您為任何支援的格式設定精確的目標大小（KB 或 MB），使其非常適合在保持圖片品質的同時滿足特定要求。"
        }
      ]
    },
    howToUse: {
      title: "如何壓縮圖片",
      steps: [
        {
          title: "上傳您的圖片",
          desc: "將您的圖片（JPG、PNG、WebP 或 BMP）拖放到壓縮區域，或點擊瀏覽並從您的裝置中選擇檔案。"
        },
        {
          title: "設定目標大小",
          desc: "選擇您想要的檔案大小（KB 或 MB）。我們的壓縮工具將優化您的圖片以達到目標，同時保持品質。"
        },
        {
          title: "下載壓縮檔案",
          desc: "立即下載您的壓縮圖片。每個檔案保持視覺品質，同時比原始檔案小得多。"
        }
      ]
    },
    specs: {
      engine: "Canvas API - 瀏覽器原生處理",
      limit: "批次處理 100+ 圖片 - 無限制檔案大小",
      logic: "精確 KB/MB 大小控制",
      privacy: "100% 客戶端（本地瀏覽器處理）"
    },
    features: {
      title: "通用圖片壓縮功能"
    },
    performanceMetrics: {
      metrics: [
        { label: "支援格式", value: "JPG、PNG、WebP、BMP" },
        { label: "輸出格式", value: "保留原始格式" },
        { label: "最大批次大小", value: "每個會話 100 張圖片" },
        { label: "檔案大小限制", value: "無限制（受瀏覽器記憶體限制）" },
        { label: "壓縮比率", value: "通常減少 50-70% 大小" },
        { label: "處理位置", value: "100% 客戶端（瀏覽器 Canvas API）" },
        { label: "品質控制", value: "精確大小目標設定，保持品質" }
      ]
    },
    rating: {
      text: "\"壓縮所有圖片的完美工具！快速、免費且私密！\" - 加入數千名信賴 Toolaze 進行圖片壓縮的使用者。"
    },
    faq: [
      {
        q: "支援哪些圖片格式？",
        a: "Toolaze 支援 JPG、PNG、WebP 和 BMP 格式。您的壓縮檔案將以其原始格式下載。"
      },
      {
        q: "我可以將圖片壓縮多少？",
        a: "通常，圖片可以在保持可接受的視覺品質的同時壓縮 50-70%。確切的減少取決於原始檔案大小和格式。"
      },
      {
        q: "可以一次壓縮多張圖片嗎？",
        a: "是的，Toolaze 支援每個會話最多 100 張圖片的批次處理。您可以一次操作處理整個照片集合。"
      },
      {
        q: "圖片壓縮是免費且安全的嗎？",
        a: "是的，Toolaze 完全免費，沒有隱藏費用。所有壓縮都在您的瀏覽器中本地進行。您的圖片永遠不會離開您的設備—確保 100% 的隱私和安全。"
      },
      {
        q: "我可以壓縮哪些檔案大小？",
        a: "沒有個別檔案大小限制。如果您的電腦可以打開檔案，Toolaze 就可以壓縮它。您可以處理任何大小的檔案。"
      },
      {
        q: "PNG 檔案的透明度會保留嗎？",
        a: "是的，壓縮 PNG 檔案時會保留透明度。工具在壓縮過程中維持 Alpha 通道。"
      }
    ]
  }
}

// 递归合并函数
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {}
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

async function main() {
  const languages = ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']
  
  for (const lang of languages) {
    const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (!data['compress-image']) {
      console.log(`⚠️  ${lang}: compress-image section not found`)
      continue
    }
    
    const translation = translations[lang]
    if (!translation) {
      console.log(`⚠️  ${lang}: translation not found`)
      continue
    }
    
    // 合并翻译
    if (translation.metadata) {
      deepMerge(data['compress-image'].metadata, translation.metadata)
    }
    
    if (translation.intro) {
      deepMerge(data['compress-image'].intro, translation.intro)
    }
    
    if (translation.howToUse) {
      deepMerge(data['compress-image'].howToUse, translation.howToUse)
    }
    
    if (translation.specs) {
      deepMerge(data['compress-image'].specs, translation.specs)
    }
    
    if (translation.features) {
      deepMerge(data['compress-image'].features, translation.features)
    }
    
    if (translation.performanceMetrics) {
      if (!data['compress-image'].performanceMetrics) {
        data['compress-image'].performanceMetrics = { title: '', metrics: [] }
      }
      if (translation.performanceMetrics.metrics) {
        data['compress-image'].performanceMetrics.metrics = translation.performanceMetrics.metrics
      }
    }
    
    if (translation.rating) {
      deepMerge(data['compress-image'].rating, translation.rating)
    }
    
    if (translation.faq) {
      data['compress-image'].faq = translation.faq
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ ${lang}: compress-image translated`)
  }
  
  console.log('\n✨ All translations completed!')
}

main().catch(console.error)
