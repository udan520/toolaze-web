const fs = require('fs')
const path = require('path')

// 翻译映射
const translations = {
  de: {
    metadata: {
      title: "Bilder stapelweise online komprimieren (Kostenlos, Keine Werbung & Schnell) - Toolaze",
      description: "Wie komprimiere ich mehrere Bilder? 1. Mehrere Bilder hochladen 2. Zielgröße festlegen 3. Alle herunterladen. Komprimieren Sie bis zu 100 Bilder gleichzeitig. Sicher & Privat."
    },
    intro: {
      title: "Warum mehrere Bilder stapelweise komprimieren?",
      content: [
        {
          title: "Vorteile der Stapelkomprimierung",
          text: "Das Verarbeiten von Bildern einzeln ist zeitaufwändig und ineffizient. Die Stapelkomprimierung ermöglicht es Ihnen, bis zu 100 Bilder gleichzeitig zu komprimieren, spart Stunden Arbeit und gewährleistet konsistente Ergebnisse für Ihre gesamte Bildsammlung. Ob Sie eine Fotogalerie optimieren, Bilder für eine Website vorbereiten oder Dateien für die Speicherung komprimieren, die Stapelverarbeitung erledigt alles in einem Vorgang. Unser browserbasierter Stapelkompressor verarbeitet alle Bilder lokal mit Canvas API, gewährleistet vollständige Privatsphäre und bietet schnelle, effiziente Komprimierung ohne Upload Ihrer Bilder auf einen Server."
        },
        {
          title: "Wann Stapelkomprimierung verwenden",
          text: "Verwenden Sie Stapelkomprimierung, wenn Sie gesamte Fotogalerien oder Bildsammlungen optimieren müssen, mehrere Bilder für Website-Uploads oder Social Media vorbereiten, Dateien für Speicher- oder Backup-Zwecke komprimieren oder Bilder mit konsistenten Komprimierungseinstellungen verarbeiten müssen. Unser Tool unterstützt JPG-, PNG-, WebP- und BMP-Formate und ermöglicht es Ihnen, verschiedene Formate in einem einzigen Stapelvorgang zu mischen, was es perfekt macht, um vielfältige Bildsammlungen effizient zu verarbeiten."
        }
      ]
    },
    features: {
      items: [
        {
          title: "100 Bilder verarbeiten",
          desc: "Komprimieren Sie bis zu 100 Bilder gleichzeitig in einem Stapelvorgang. Sparen Sie Zeit und Aufwand."
        },
        {
          title: "Mehrfachformat-Unterstützung",
          desc: "Unterstützt JPG-, PNG-, WebP- und BMP-Formate. Mischen Sie verschiedene Formate in einem Stapel."
        },
        {
          title: "Präzise Größensteuerung",
          desc: "Legen Sie genaue Zielgrößen in KB oder MB fest. Alle Bilder werden komprimiert, um dieselbe Zielgröße zu erreichen."
        },
        {
          title: "100% Private Verarbeitung",
          desc: "Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre Bilder verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre."
        },
        {
          title: "Schnelle Stapelverarbeitung",
          desc: "Die browser-native Canvas API-Verarbeitung gewährleistet schnelle Stapelkomprimierung ohne Server-Uploads oder Verzögerungen."
        },
        {
          title: "Für Immer Kostenlos",
          desc: "Unbegrenzte Stapelkomprimierung völlig kostenlos—keine Premium-Stufen, keine Abonnementgebühren, keine Werbung."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Browser-Native Verarbeitung",
      limit: "Stapel 100+ Bilder - Unbegrenzte Dateigrößen",
      logic: "Konsistente Stapelkomprimierung",
      privacy: "100% Clientseitig (Lokale Browser-Verarbeitung)"
    },
    performanceMetrics: {
      metrics: [
        { label: "Stapelgröße", value: "Bis zu 100 Bilder pro Stapel" },
        { label: "Unterstützte Formate", value: "JPG, PNG, WebP, BMP" },
        { label: "Ausgabeformat", value: "Ursprüngliches Format beibehalten" },
        { label: "Dateigrößenlimit", value: "Unbegrenzt (Begrenzt durch Browserspeicher)" },
        { label: "Komprimierungsverhältnis", value: "Typisch 50-70% Größenreduzierung" },
        { label: "Verarbeitungsort", value: "100% Clientseitig (Browser Canvas API)" },
        { label: "Stapelkonsistenz", value: "Alle Bilder mit derselben Zielgröße komprimiert" }
      ]
    },
    howToUse: {
      title: "Wie man mehrere Bilder stapelweise komprimiert",
      steps: [
        {
          title: "Mehrere Bilder hochladen",
          desc: "Ziehen Sie bis zu 100 Bilder (JPG, PNG, WebP oder BMP) in den Komprimierungsbereich oder klicken Sie, um mehrere Dateien auszuwählen."
        },
        {
          title: "Zielgröße festlegen",
          desc: "Wählen Sie die gewünschte Dateigröße in KB oder MB. Alle Bilder im Stapel werden komprimiert, um diese Zielgröße zu erreichen."
        },
        {
          title: "Alle komprimierten Dateien herunterladen",
          desc: "Laden Sie alle komprimierten Bilder auf einmal als ZIP-Datei oder einzeln herunter. Jedes Bild behält die Qualität bei und ist deutlich kleiner als das Original."
        }
      ]
    },
    scenes: [
      {
        title: "Fotografen",
        desc: "Komprimieren Sie gesamte Fotogalerien auf einmal. Verarbeiten Sie Hunderte von Fotos effizient bei gleichbleibender Qualität."
      },
      {
        title: "Web-Entwickler",
        desc: "Optimieren Sie mehrere Bilder für Websites. Verarbeiten Sie Produktbilder, Galerien und Assets effizient im Stapel."
      },
      {
        title: "E-Commerce-Manager",
        desc: "Komprimieren Sie Produktbildsammlungen für Online-Shops. Verarbeiten Sie gesamte Kataloge schnell und konsistent."
      }
    ],
    rating: {
      text: "\"Spart mir Stunden Arbeit! Perfekt für die Stapelverarbeitung meiner Fotosammlungen!\" - Schließen Sie sich Tausenden von Benutzern an, die Toolaze für die Stapelkomprimierung vertrauen."
    },
    faq: [
      {
        q: "Wie viele Bilder kann ich gleichzeitig komprimieren?",
        a: "Toolaze unterstützt die Stapelkomprimierung von bis zu 100 Bildern pro Sitzung. Sie können gesamte Fotosammlungen in einem Vorgang verarbeiten."
      },
      {
        q: "Kann ich verschiedene Bildformate in einem Stapel mischen?",
        a: "Ja, Sie können JPG-, PNG-, WebP- und BMP-Formate in einem einzigen Stapel mischen. Jedes Bild wird komprimiert, während sein ursprüngliches Format beibehalten wird."
      },
      {
        q: "Werden alle Bilder auf dieselbe Größe komprimiert?",
        a: "Alle Bilder werden komprimiert, um die von Ihnen angegebene Zielgröße (in KB oder MB) zu erreichen, was konsistente Ergebnisse für Ihren Stapel gewährleistet."
      },
      {
        q: "Ist die Stapelkomprimierung kostenlos und sicher?",
        a: "Ja, Toolaze ist für immer völlig kostenlos ohne versteckte Kosten. Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre Bilder verlassen niemals Ihr Gerät—was 100% Privatsphäre und Sicherheit gewährleistet."
      },
      {
        q: "Kann ich alle komprimierten Bilder auf einmal herunterladen?",
        a: "Ja, Sie können alle komprimierten Bilder als ZIP-Datei oder einzeln herunterladen, je nachdem, was für Sie bequemer ist."
      },
      {
        q: "Welche Dateigrößen kann ich komprimieren?",
        a: "Es gibt keine individuellen Dateigrößenbeschränkungen. Wenn Ihr Computer die Datei öffnen kann, kann Toolaze sie komprimieren. Sie können Dateien jeder Größe in Ihrem Stapel verarbeiten."
      }
    ]
  },
  es: {
    metadata: {
      title: "Comprimir Imágenes por Lotes Online (Gratis, Sin Anuncios y Rápido) - Toolaze",
      description: "¿Cómo comprimir imágenes por lotes? 1. Subir múltiples imágenes 2. Establecer tamaño objetivo 3. Descargar todas. Comprima hasta 100 imágenes a la vez. Seguro y Privado."
    },
    intro: {
      title: "¿Por qué usar compresión por lotes?",
      content: [
        {
          title: "Beneficios de la Compresión por Lotes",
          text: "Procesar imágenes una por una consume mucho tiempo y es ineficiente. La compresión por lotes le permite comprimir hasta 100 imágenes simultáneamente, ahorrando horas de trabajo y garantizando resultados consistentes en toda su colección de imágenes. Ya sea que esté optimizando una galería de fotos, preparando imágenes para un sitio web o comprimiendo archivos para almacenamiento, el procesamiento por lotes maneja todo en una sola operación. Nuestro compresor por lotes basado en navegador procesa todas las imágenes localmente usando Canvas API, garantizando privacidad completa mientras proporciona compresión rápida y eficiente sin cargar sus imágenes a ningún servidor."
        },
        {
          title: "Cuándo usar compresión por lotes",
          text: "Use compresión por lotes cuando necesite optimizar galerías de fotos completas o colecciones de imágenes, preparar múltiples imágenes para cargas de sitios web o redes sociales, comprimir archivos para almacenamiento o respaldo, o procesar imágenes con configuraciones de compresión consistentes. Nuestra herramienta admite formatos JPG, PNG, WebP y BMP, permitiéndole mezclar diferentes formatos en una sola operación por lotes, haciéndola perfecta para manejar colecciones de imágenes diversas de manera eficiente."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Procesar 100 Imágenes",
          desc: "Comprima hasta 100 imágenes simultáneamente en una operación por lotes. Ahorre tiempo y esfuerzo."
        },
        {
          title: "Soporte de Múltiples Formatos",
          desc: "Admite formatos JPG, PNG, WebP y BMP. Mezcle diferentes formatos en un solo lote."
        },
        {
          title: "Control Preciso de Tamaño",
          desc: "Establezca tamaños objetivo exactos en KB o MB. Todas las imágenes comprimidas para cumplir el mismo tamaño objetivo."
        },
        {
          title: "Procesamiento 100% Privado",
          desc: "Toda la compresión ocurre localmente en su navegador. Sus imágenes nunca abandonan su dispositivo, garantizando privacidad completa."
        },
        {
          title: "Procesamiento por Lotes Rápido",
          desc: "El procesamiento de la API Canvas nativa del navegador garantiza compresión por lotes rápida sin cargas al servidor o retrasos."
        },
        {
          title: "Gratis Para Siempre",
          desc: "Compresión por lotes ilimitada completamente gratuita: sin niveles premium, sin tarifas de suscripción, sin anuncios."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Procesamiento Nativo del Navegador",
      limit: "Lote 100+ Imágenes - Tamaños de Archivo Ilimitados",
      logic: "Compresión por Lotes Consistente",
      privacy: "100% del Lado del Cliente (Procesamiento Local del Navegador)"
    },
    performanceMetrics: {
      metrics: [
        { label: "Tamaño del Lote", value: "Hasta 100 imágenes por lote" },
        { label: "Formatos Soportados", value: "JPG, PNG, WebP, BMP" },
        { label: "Formato de Salida", value: "Formato original preservado" },
        { label: "Límite de Tamaño de Archivo", value: "Ilimitado (Limitado por la memoria del navegador)" },
        { label: "Relación de Compresión", value: "Reducción de tamaño típica del 50-70%" },
        { label: "Ubicación de Procesamiento", value: "100% del Lado del Cliente (API Canvas del Navegador)" },
        { label: "Consistencia del Lote", value: "Todas las imágenes comprimidas con el mismo tamaño objetivo" }
      ]
    },
    howToUse: {
      title: "Cómo comprimir imágenes por lotes",
      steps: [
        {
          title: "Subir múltiples imágenes",
          desc: "Arrastre y suelte hasta 100 imágenes (JPG, PNG, WebP o BMP) en el área del compresor o haga clic para navegar y seleccionar múltiples archivos."
        },
        {
          title: "Establecer tamaño objetivo",
          desc: "Elija el tamaño de archivo deseado en KB o MB. Todas las imágenes en el lote se comprimirán para cumplir este tamaño objetivo."
        },
        {
          title: "Descargar todos los archivos comprimidos",
          desc: "Descargue todas las imágenes comprimidas a la vez como un archivo ZIP o individualmente. Cada archivo mantiene la calidad mientras es más pequeño que el original."
        }
      ]
    },
    scenes: [
      {
        title: "Fotógrafos",
        desc: "Comprima galerías de fotos completas a la vez. Procese cientos de fotos eficientemente mientras mantiene la calidad."
      },
      {
        title: "Desarrolladores Web",
        desc: "Optimice múltiples imágenes para sitios web. Procese imágenes de productos, galerías y assets por lotes de manera eficiente."
      },
      {
        title: "Gerentes de Comercio Electrónico",
        desc: "Comprima colecciones de imágenes de productos para tiendas en línea. Procese catálogos completos rápida y consistentemente."
      }
    ],
    rating: {
      text: "\"¡Me ahorra horas de trabajo! ¡Perfecto para procesar por lotes mis colecciones de fotos!\" - Únete a miles de usuarios que confían en Toolaze para la compresión por lotes."
    },
    faq: [
      {
        q: "¿Cuántas imágenes puedo comprimir a la vez?",
        a: "Toolaze admite compresión por lotes de hasta 100 imágenes por sesión. Puede procesar colecciones completas de fotos en una operación."
      },
      {
        q: "¿Puedo mezclar diferentes formatos de imagen en un lote?",
        a: "Sí, puede mezclar formatos JPG, PNG, WebP y BMP en un solo lote. Cada imagen se comprimirá manteniendo su formato original."
      },
      {
        q: "¿Todas las imágenes se comprimirán al mismo tamaño?",
        a: "Todas las imágenes se comprimirán para cumplir el mismo tamaño objetivo que especifique (en KB o MB), garantizando resultados consistentes en su lote."
      },
      {
        q: "¿La compresión por lotes es gratuita y segura?",
        a: "Sí, Toolaze es completamente gratuito para siempre sin costos ocultos. Toda la compresión ocurre localmente en su navegador. Sus imágenes nunca abandonan su dispositivo—garantizando 100% de privacidad y seguridad."
      },
      {
        q: "¿Puedo descargar todas las imágenes comprimidas a la vez?",
        a: "Sí, puede descargar todas las imágenes comprimidas como un archivo ZIP o descargarlas individualmente, lo que sea más conveniente para usted."
      },
      {
        q: "¿Qué tamaños de archivo puedo comprimir?",
        a: "No hay límites de tamaño de archivo individual. Si su computadora puede abrir el archivo, Toolaze puede comprimirlo. Puede procesar archivos de cualquier tamaño en su lote."
      }
    ]
  },
  fr: {
    metadata: {
      title: "Compresser des Images par Lots en Ligne (Gratuit, Sans Publicité et Rapide) - Toolaze",
      description: "Comment compresser des images par lots? 1. Télécharger plusieurs images 2. Définir la taille cible 3. Télécharger toutes. Compressez jusqu'à 100 images à la fois. Sécurisé et Privé."
    },
    intro: {
      title: "Pourquoi utiliser la compression par lots?",
      content: [
        {
          title: "Avantages de la Compression par Lots",
          text: "Traiter les images une par une prend du temps et est inefficace. La compression par lots vous permet de compresser jusqu'à 100 images simultanément, économisant des heures de travail et garantissant des résultats cohérents dans toute votre collection d'images. Que vous optimisiez une galerie photo, prépariez des images pour un site web ou compressiez des fichiers pour le stockage, le traitement par lots gère tout en une seule opération. Notre compresseur par lots basé sur navigateur traite toutes les images localement en utilisant Canvas API, garantissant une confidentialité complète tout en fournissant une compression rapide et efficace sans télécharger vos images sur un serveur."
        },
        {
          title: "Quand utiliser la compression par lots",
          text: "Utilisez la compression par lots lorsque vous devez optimiser des galeries photo complètes ou des collections d'images, préparer plusieurs images pour les téléchargements de sites web ou les médias sociaux, compresser des fichiers à des fins de stockage ou de sauvegarde, ou traiter des images avec des paramètres de compression cohérents. Notre outil prend en charge les formats JPG, PNG, WebP et BMP, vous permettant de mélanger différents formats dans une seule opération par lots, le rendant parfait pour gérer efficacement des collections d'images diverses."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Traiter 100 Images",
          desc: "Compressez jusqu'à 100 images simultanément en une seule opération par lots. Économisez du temps et des efforts."
        },
        {
          title: "Support Multi-Formats",
          desc: "Prend en charge les formats JPG, PNG, WebP et BMP. Mélangez différents formats en un seul lot."
        },
        {
          title: "Contrôle Précis de la Taille",
          desc: "Définissez des tailles cibles exactes en Ko ou Mo. Toutes les images compressées pour atteindre la même taille cible."
        },
        {
          title: "Traitement 100% Privé",
          desc: "Toute la compression se fait localement dans votre navigateur. Vos images ne quittent jamais votre appareil, garantissant une confidentialité complète."
        },
        {
          title: "Traitement par Lots Rapide",
          desc: "Le traitement de l'API Canvas native du navigateur garantit une compression par lots rapide sans téléchargements serveur ni délais."
        },
        {
          title: "Gratuit Pour Toujours",
          desc: "Compression par lots illimitée entièrement gratuite—aucun niveau premium, aucun frais d'abonnement, aucune publicité."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Traitement Natif du Navigateur",
      limit: "Lot 100+ Images - Tailles de Fichier Illimitées",
      logic: "Compression par Lots Cohérente",
      privacy: "100% Côté Client (Traitement Local du Navigateur)"
    },
    performanceMetrics: {
      metrics: [
        { label: "Taille du Lot", value: "Jusqu'à 100 images par lot" },
        { label: "Formats Pris en Charge", value: "JPG, PNG, WebP, BMP" },
        { label: "Format de Sortie", value: "Format original préservé" },
        { label: "Limite de Taille de Fichier", value: "Illimité (Limité par la mémoire du navigateur)" },
        { label: "Taux de Compression", value: "Réduction de taille typique de 50-70%" },
        { label: "Emplacement de Traitement", value: "100% Côté Client (API Canvas du Navigateur)" },
        { label: "Cohérence du Lot", value: "Toutes les images compressées avec la même taille cible" }
      ]
    },
    howToUse: {
      title: "Comment compresser des images par lots",
      steps: [
        {
          title: "Télécharger plusieurs images",
          desc: "Glissez-déposez jusqu'à 100 images (JPG, PNG, WebP ou BMP) dans la zone de compression ou cliquez pour parcourir et sélectionner plusieurs fichiers."
        },
        {
          title: "Définir la taille cible",
          desc: "Choisissez la taille de fichier souhaitée en Ko ou Mo. Toutes les images du lot seront compressées pour atteindre cette taille cible."
        },
        {
          title: "Télécharger tous les fichiers compressés",
          desc: "Téléchargez toutes les images compressées à la fois sous forme de fichier ZIP ou individuellement. Chaque fichier maintient la qualité tout en étant plus petit que l'original."
        }
      ]
    },
    scenes: [
      {
        title: "Photographes",
        desc: "Compressez des galeries photo complètes à la fois. Traitez des centaines de photos efficacement tout en maintenant la qualité."
      },
      {
        title: "Développeurs Web",
        desc: "Optimisez plusieurs images pour les sites web. Traitez par lots les images de produits, galeries et assets efficacement."
      },
      {
        title: "Gestionnaires E-commerce",
        desc: "Compressez des collections d'images de produits pour les boutiques en ligne. Traitez des catalogues complets rapidement et de manière cohérente."
      }
    ],
    rating: {
      text: "\"M'économise des heures de travail! Parfait pour le traitement par lots de mes collections de photos!\" - Rejoignez des milliers d'utilisateurs qui font confiance à Toolaze pour la compression par lots."
    },
    faq: [
      {
        q: "Combien d'images puis-je compresser à la fois?",
        a: "Toolaze prend en charge la compression par lots de jusqu'à 100 images par session. Vous pouvez traiter des collections complètes de photos en une seule opération."
      },
      {
        q: "Puis-je mélanger différents formats d'image dans un lot?",
        a: "Oui, vous pouvez mélanger les formats JPG, PNG, WebP et BMP dans un seul lot. Chaque image sera compressée tout en conservant son format d'origine."
      },
      {
        q: "Toutes les images seront-elles compressées à la même taille?",
        a: "Toutes les images seront compressées pour atteindre la même taille cible que vous spécifiez (en Ko ou Mo), garantissant des résultats cohérents dans votre lot."
      },
      {
        q: "La compression par lots est-elle gratuite et sécurisée?",
        a: "Oui, Toolaze est complètement gratuit pour toujours sans coûts cachés. Toute la compression se fait localement dans votre navigateur. Vos images ne quittent jamais votre appareil—garantissant 100% de confidentialité et de sécurité."
      },
      {
        q: "Puis-je télécharger toutes les images compressées à la fois?",
        a: "Oui, vous pouvez télécharger toutes les images compressées sous forme de fichier ZIP ou les télécharger individuellement, selon ce qui vous convient le mieux."
      },
      {
        q: "Quelles tailles de fichier puis-je compresser?",
        a: "Il n'y a pas de limites de taille de fichier individuelles. Si votre ordinateur peut ouvrir le fichier, Toolaze peut le compresser. Vous pouvez traiter des fichiers de toute taille dans votre lot."
      }
    ]
  },
  pt: {
    metadata: {
      title: "Comprimir Imagens em Lote Online (Grátis, Sem Anúncios e Rápido) - Toolaze",
      description: "Como comprimir imagens em lote? 1. Fazer upload de múltiplas imagens 2. Definir tamanho alvo 3. Baixar todas. Comprima até 100 imagens de uma vez. Seguro e Privado."
    },
    intro: {
      title: "Por que usar compressão em lote?",
      content: [
        {
          title: "Benefícios da Compressão em Lote",
          text: "Processar imagens uma por uma consome muito tempo e é ineficiente. A compressão em lote permite comprimir até 100 imagens simultaneamente, economizando horas de trabalho e garantindo resultados consistentes em toda sua coleção de imagens. Seja otimizando uma galeria de fotos, preparando imagens para um site ou comprimindo arquivos para armazenamento, o processamento em lote gerencia tudo em uma única operação. Nosso compressor em lote baseado em navegador processa todas as imagens localmente usando Canvas API, garantindo privacidade completa enquanto fornece compressão rápida e eficiente sem fazer upload de suas imagens para qualquer servidor."
        },
        {
          title: "Quando usar compressão em lote",
          text: "Use compressão em lote quando precisar otimizar galerias de fotos completas ou coleções de imagens, preparar múltiplas imagens para uploads de sites ou redes sociais, comprimir arquivos para armazenamento ou backup, ou processar imagens com configurações de compressão consistentes. Nossa ferramenta suporta formatos JPG, PNG, WebP e BMP, permitindo misturar diferentes formatos em uma única operação em lote, tornando-a perfeita para lidar com coleções de imagens diversas de forma eficiente."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Processar 100 Imagens",
          desc: "Comprima até 100 imagens simultaneamente em uma operação em lote. Economize tempo e esforço."
        },
        {
          title: "Suporte a Múltiplos Formatos",
          desc: "Suporta formatos JPG, PNG, WebP e BMP. Misture diferentes formatos em um lote."
        },
        {
          title: "Controle Preciso de Tamanho",
          desc: "Defina tamanhos alvo exatos em KB ou MB. Todas as imagens comprimidas para atender ao mesmo tamanho alvo."
        },
        {
          title: "Processamento 100% Privado",
          desc: "Toda a compressão acontece localmente no seu navegador. Suas imagens nunca deixam seu dispositivo, garantindo privacidade completa."
        },
        {
          title: "Processamento em Lote Rápido",
          desc: "O processamento da API Canvas nativa do navegador garante compressão em lote rápida sem uploads de servidor ou atrasos."
        },
        {
          title: "Gratuito Para Sempre",
          desc: "Compressão em lote ilimitada completamente gratuita—sem níveis premium, sem taxas de assinatura, sem anúncios."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Processamento Nativo do Navegador",
      limit: "Lote 100+ Imagens - Tamanhos de Arquivo Ilimitados",
      logic: "Compressão em Lote Consistente",
      privacy: "100% do Lado do Cliente (Processamento Local do Navegador)"
    },
    performanceMetrics: {
      metrics: [
        { label: "Tamanho do Lote", value: "Até 100 imagens por lote" },
        { label: "Formatos Suportados", value: "JPG, PNG, WebP, BMP" },
        { label: "Formato de Saída", value: "Formato original preservado" },
        { label: "Limite de Tamanho de Arquivo", value: "Ilimitado (Limitado pela memória do navegador)" },
        { label: "Taxa de Compressão", value: "Redução de tamanho típica de 50-70%" },
        { label: "Localização do Processamento", value: "100% do Lado do Cliente (API Canvas do Navegador)" },
        { label: "Consistência do Lote", value: "Todas as imagens comprimidas com o mesmo tamanho alvo" }
      ]
    },
    howToUse: {
      title: "Como comprimir imagens em lote",
      steps: [
        {
          title: "Fazer upload de múltiplas imagens",
          desc: "Arraste e solte até 100 imagens (JPG, PNG, WebP ou BMP) na área do compressor ou clique para navegar e selecionar múltiplos arquivos."
        },
        {
          title: "Definir tamanho alvo",
          desc: "Escolha o tamanho de arquivo desejado em KB ou MB. Todas as imagens no lote serão comprimidas para atingir este tamanho alvo."
        },
        {
          title: "Baixar todos os arquivos comprimidos",
          desc: "Baixe todas as imagens comprimidas de uma vez como um arquivo ZIP ou individualmente. Cada arquivo mantém a qualidade enquanto é menor que o original."
        }
      ]
    },
    scenes: [
      {
        title: "Fotógrafos",
        desc: "Comprima galerias de fotos completas de uma vez. Processe centenas de fotos eficientemente enquanto mantém a qualidade."
      },
      {
        title: "Desenvolvedores Web",
        desc: "Otimize múltiplas imagens para sites. Processe imagens de produtos, galerias e assets em lote de forma eficiente."
      },
      {
        title: "Gerentes de E-commerce",
        desc: "Comprima coleções de imagens de produtos para lojas online. Processe catálogos completos rápida e consistentemente."
      }
    ],
    rating: {
      text: "\"Economiza horas de trabalho! Perfeito para processar em lote minhas coleções de fotos!\" - Junte-se a milhares de usuários que confiam no Toolaze para compressão em lote."
    },
    faq: [
      {
        q: "Quantas imagens posso comprimir de uma vez?",
        a: "Toolaze suporta compressão em lote de até 100 imagens por sessão. Você pode processar coleções completas de fotos em uma operação."
      },
      {
        q: "Posso misturar diferentes formatos de imagem em um lote?",
        a: "Sim, você pode misturar formatos JPG, PNG, WebP e BMP em um único lote. Cada imagem será comprimida mantendo seu formato original."
      },
      {
        q: "Todas as imagens serão comprimidas para o mesmo tamanho?",
        a: "Todas as imagens serão comprimidas para atender ao mesmo tamanho alvo que você especificar (em KB ou MB), garantindo resultados consistentes em seu lote."
      },
      {
        q: "A compressão em lote é gratuita e segura?",
        a: "Sim, Toolaze é completamente gratuito para sempre sem custos ocultos. Toda a compressão acontece localmente em seu navegador. Suas imagens nunca deixam seu dispositivo—garantindo 100% de privacidade e segurança."
      },
      {
        q: "Posso baixar todas as imagens comprimidas de uma vez?",
        a: "Sim, você pode baixar todas as imagens comprimidas como um arquivo ZIP ou baixá-las individualmente, o que for mais conveniente para você."
      },
      {
        q: "Quais tamanhos de arquivo posso comprimir?",
        a: "Não há limites de tamanho de arquivo individual. Se seu computador pode abrir o arquivo, Toolaze pode comprimi-lo. Você pode processar arquivos de qualquer tamanho em seu lote."
      }
    ]
  },
  it: {
    metadata: {
      title: "Comprimi Immagini in Batch Online (Gratis, Senza Pubblicità e Veloce) - Toolaze",
      description: "Come comprimere immagini in batch? 1. Carica più immagini 2. Imposta dimensione obiettivo 3. Scarica tutte. Comprimi fino a 100 immagini alla volta. Sicuro e Privato."
    },
    intro: {
      title: "Perché usare la compressione in batch?",
      content: [
        {
          title: "Vantaggi della Compressione in Batch",
          text: "Elaborare immagini una per una richiede tempo ed è inefficiente. La compressione in batch ti consente di comprimere fino a 100 immagini contemporaneamente, risparmiando ore di lavoro e garantendo risultati consistenti in tutta la tua collezione di immagini. Che tu stia ottimizzando una galleria fotografica, preparando immagini per un sito web o comprimendo file per l'archiviazione, l'elaborazione in batch gestisce tutto in un'operazione. Il nostro compressore in batch basato su browser elabora tutte le immagini localmente utilizzando Canvas API, garantendo completa privacy mentre fornisce compressione rapida ed efficiente senza caricare le tue immagini su alcun server."
        },
        {
          title: "Quando usare la compressione in batch",
          text: "Usa la compressione in batch quando devi ottimizzare intere gallerie fotografiche o collezioni di immagini, preparare più immagini per caricamenti di siti web o social media, comprimere file per scopi di archiviazione o backup, o elaborare immagini con impostazioni di compressione consistenti. Il nostro strumento supporta formati JPG, PNG, WebP e BMP, permettendoti di mescolare diversi formati in una singola operazione batch, rendendolo perfetto per gestire collezioni di immagini diverse in modo efficiente."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Elabora 100 Immagini",
          desc: "Comprimi fino a 100 immagini contemporaneamente in un'operazione batch. Risparmia tempo e fatica."
        },
        {
          title: "Supporto Multi-Formato",
          desc: "Supporta formati JPG, PNG, WebP e BMP. Mescola diversi formati in un batch."
        },
        {
          title: "Controllo Preciso delle Dimensioni",
          desc: "Imposta dimensioni obiettivo esatte in KB o MB. Tutte le immagini compresse per raggiungere la stessa dimensione obiettivo."
        },
        {
          title: "Elaborazione 100% Privata",
          desc: "Tutta la compressione avviene localmente nel tuo browser. Le tue immagini non lasciano mai il tuo dispositivo, garantendo privacy completa."
        },
        {
          title: "Elaborazione Batch Veloce",
          desc: "L'elaborazione dell'API Canvas nativa del browser garantisce compressione batch rapida senza caricamenti sul server o ritardi."
        },
        {
          title: "Gratis Per Sempre",
          desc: "Compressione batch illimitata completamente gratuita—nessun livello premium, nessuna tariffa di abbonamento, nessuna pubblicità."
        }
      ]
    },
    specs: {
      engine: "Canvas API - Elaborazione Nativa del Browser",
      limit: "Batch 100+ Immagini - Dimensioni File Illimitate",
      logic: "Compressione Batch Consistente",
      privacy: "100% Lato Client (Elaborazione Locale del Browser)"
    },
    performanceMetrics: {
      metrics: [
        { label: "Dimensione del Batch", value: "Fino a 100 immagini per batch" },
        { label: "Formati Supportati", value: "JPG, PNG, WebP, BMP" },
        { label: "Formato di Output", value: "Formato originale preservato" },
        { label: "Limite Dimensione File", value: "Illimitato (Limitato dalla memoria del browser)" },
        { label: "Rapporto di Compressione", value: "Riduzione tipica delle dimensioni del 50-70%" },
        { label: "Posizione di Elaborazione", value: "100% Lato Client (API Canvas del Browser)" },
        { label: "Coerenza del Batch", value: "Tutte le immagini compresse con la stessa dimensione obiettivo" }
      ]
    },
    howToUse: {
      title: "Come comprimere immagini in batch",
      steps: [
        {
          title: "Carica più immagini",
          desc: "Trascina e rilascia fino a 100 immagini (JPG, PNG, WebP o BMP) nell'area del compressore o fai clic per sfogliare e selezionare più file."
        },
        {
          title: "Imposta dimensione obiettivo",
          desc: "Scegli la dimensione del file desiderata in KB o MB. Tutte le immagini nel batch saranno compresse per raggiungere questa dimensione obiettivo."
        },
        {
          title: "Scarica tutti i file compressi",
          desc: "Scarica tutte le immagini compresse in una volta come file ZIP o individualmente. Ogni file mantiene la qualità pur essendo più piccolo dell'originale."
        }
      ]
    },
    scenes: [
      {
        title: "Fotografi",
        desc: "Comprimi intere gallerie fotografiche in una volta. Elabora centinaia di foto efficientemente mantenendo la qualità."
      },
      {
        title: "Sviluppatori Web",
        desc: "Ottimizza più immagini per siti web. Elabora immagini di prodotti, gallerie e asset in batch in modo efficiente."
      },
      {
        title: "Gestori E-commerce",
        desc: "Comprimi collezioni di immagini di prodotti per negozi online. Elabora interi cataloghi rapidamente e consistentemente."
      }
    ],
    rating: {
      text: "\"Mi fa risparmiare ore di lavoro! Perfetto per l'elaborazione batch delle mie collezioni di foto!\" - Unisciti a migliaia di utenti che si fidano di Toolaze per la compressione batch."
    },
    faq: [
      {
        q: "Quante immagini posso comprimere contemporaneamente?",
        a: "Toolaze supporta la compressione batch di fino a 100 immagini per sessione. Puoi elaborare intere collezioni di foto in un'operazione."
      },
      {
        q: "Posso mescolare diversi formati di immagine in un batch?",
        a: "Sì, puoi mescolare formati JPG, PNG, WebP e BMP in un singolo batch. Ogni immagine sarà compressa mantenendo il suo formato originale."
      },
      {
        q: "Tutte le immagini saranno compresse alla stessa dimensione?",
        a: "Tutte le immagini saranno compresse per raggiungere la stessa dimensione obiettivo che specifichi (in KB o MB), garantendo risultati consistenti nel tuo batch."
      },
      {
        q: "La compressione batch è gratuita e sicura?",
        a: "Sì, Toolaze è completamente gratuito per sempre senza costi nascosti. Tutta la compressione avviene localmente nel tuo browser. Le tue immagini non lasciano mai il tuo dispositivo—garantendo 100% privacy e sicurezza."
      },
      {
        q: "Posso scaricare tutte le immagini compresse in una volta?",
        a: "Sì, puoi scaricare tutte le immagini compresse come file ZIP o scaricarle individualmente, a seconda di cosa è più conveniente per te."
      },
      {
        q: "Quali dimensioni di file posso comprimere?",
        a: "Non ci sono limiti di dimensione del file individuali. Se il tuo computer può aprire il file, Toolaze può comprimerlo. Puoi elaborare file di qualsiasi dimensione nel tuo batch."
      }
    ]
  },
  ja: {
    metadata: {
      title: "画像を一括圧縮オンライン（無料、広告なし、高速）- Toolaze",
      description: "画像を一括圧縮する方法は？1. 複数の画像をアップロード 2. 目標サイズを設定 3. すべてをダウンロード。一度に最大100枚の画像を圧縮します。安全でプライベート。"
    },
    intro: {
      title: "一括圧縮を使用する理由",
      content: [
        {
          title: "一括圧縮の利点",
          text: "画像を1つずつ処理するのは時間がかかり非効率的です。一括圧縮により、最大100枚の画像を同時に圧縮でき、何時間もの作業を節約し、画像コレクション全体で一貫した結果を保証します。写真ギャラリーを最適化する場合、ウェブサイト用の画像を準備する場合、またはストレージ用のファイルを圧縮する場合でも、一括処理は1回の操作ですべてを処理します。当社のブラウザベースの一括圧縮ツールは、Canvas APIを使用してすべての画像をローカルに処理し、画像をサーバーにアップロードすることなく、完全なプライバシーを確保しながら、高速で効率的な圧縮を提供します。"
        },
        {
          title: "一括圧縮を使用するタイミング",
          text: "写真ギャラリー全体または画像コレクションを最適化する必要がある場合、ウェブサイトのアップロードやソーシャルメディア用に複数の画像を準備する場合、ストレージやバックアップ目的でファイルを圧縮する場合、または一貫した圧縮設定で画像を処理する場合に一括圧縮を使用します。当社のツールはJPG、PNG、WebP、BMP形式をサポートし、1回の一括操作で異なる形式を混合できるため、多様な画像コレクションを効率的に処理するのに最適です。"
        }
      ]
    },
    features: {
      items: [
        {
          title: "100枚の画像を処理",
          desc: "1回の一括操作で最大100枚の画像を同時に圧縮します。時間と労力を節約します。"
        },
        {
          title: "複数形式サポート",
          desc: "JPG、PNG、WebP、BMP形式をサポートします。1つのバッチで異なる形式を混合できます。"
        },
        {
          title: "正確なサイズ制御",
          desc: "KBまたはMBで正確なターゲットサイズを設定します。すべての画像が同じターゲットサイズを満たすように圧縮されます。"
        },
        {
          title: "100%プライベート処理",
          desc: "すべての圧縮はブラウザでローカルに実行されます。画像がデバイスを離れることはなく、完全なプライバシーを保証します。"
        },
        {
          title: "高速一括処理",
          desc: "ブラウザネイティブのCanvas API処理により、サーバーアップロードや遅延なしで高速な一括圧縮が保証されます。"
        },
        {
          title: "永久無料",
          desc: "無制限の一括圧縮が完全無料—プレミアム層なし、サブスクリプション料金なし、広告なし。"
        }
      ]
    },
    specs: {
      engine: "Canvas API - ブラウザネイティブ処理",
      limit: "バッチ100+画像 - 無制限ファイルサイズ",
      logic: "一貫した一括圧縮",
      privacy: "100%クライアント側（ローカルブラウザ処理）"
    },
    performanceMetrics: {
      metrics: [
        { label: "バッチサイズ", value: "バッチあたり最大100画像" },
        { label: "サポート形式", value: "JPG、PNG、WebP、BMP" },
        { label: "出力形式", value: "元の形式を保持" },
        { label: "ファイルサイズ制限", value: "無制限（ブラウザのメモリによって制限）" },
        { label: "圧縮率", value: "典型的に50-70%のサイズ削減" },
        { label: "処理場所", value: "100%クライアント側（ブラウザCanvas API）" },
        { label: "バッチ一貫性", value: "すべての画像が同じターゲットサイズで圧縮" }
      ]
    },
    howToUse: {
      title: "画像を一括圧縮する方法",
      steps: [
        {
          title: "複数の画像をアップロード",
          desc: "最大100枚の画像（JPG、PNG、WebP、またはBMP）を圧縮エリアにドラッグ&ドロップするか、クリックして複数のファイルを選択します。"
        },
        {
          title: "ターゲットサイズを設定",
          desc: "希望するファイルサイズ（KBまたはMB）を選択します。バッチ内のすべての画像がこのターゲットサイズを満たすように圧縮されます。"
        },
        {
          title: "すべての圧縮ファイルをダウンロード",
          desc: "すべての圧縮画像を一度にZIPファイルとして、または個別にダウンロードします。各ファイルは品質を維持しながら、元のファイルよりも大幅に小さくなります。"
        }
      ]
    },
    scenes: [
      {
        title: "写真家",
        desc: "写真ギャラリー全体を一度に圧縮します。品質を維持しながら、数百枚の写真を効率的に処理します。"
      },
      {
        title: "Web開発者",
        desc: "ウェブサイト用に複数の画像を最適化します。製品画像、ギャラリー、アセットを効率的に一括処理します。"
      },
      {
        title: "Eコマースマネージャー",
        desc: "オンラインストア用に製品画像コレクションを圧縮します。カタログ全体を迅速かつ一貫して処理します。"
      }
    ],
    rating: {
      text: "\"何時間もの作業を節約！写真コレクションの一括処理に最適！\" - 一括圧縮のためにToolazeを信頼する何千人ものユーザーに参加してください。"
    },
    faq: [
      {
        q: "一度に何枚の画像を圧縮できますか？",
        a: "Toolazeはセッションあたり最大100画像の一括圧縮をサポートしています。1回の操作で写真コレクション全体を処理できます。"
      },
      {
        q: "1つのバッチで異なる画像形式を混合できますか？",
        a: "はい、1つのバッチでJPG、PNG、WebP、BMP形式を混合できます。各画像は元の形式を維持しながら圧縮されます。"
      },
      {
        q: "すべての画像が同じサイズに圧縮されますか？",
        a: "すべての画像は、指定したターゲットサイズ（KBまたはMB）を満たすように圧縮され、バッチ全体で一貫した結果が保証されます。"
      },
      {
        q: "一括圧縮は無料で安全ですか？",
        a: "はい、Toolazeは完全に無料で、隠れたコストはありません。すべての圧縮はブラウザ内でローカルに実行されます。画像がデバイスを離れることはなく、100%のプライバシーとセキュリティを保証します。"
      },
      {
        q: "すべての圧縮画像を一度にダウンロードできますか？",
        a: "はい、すべての圧縮画像をZIPファイルとして、または個別にダウンロードできます。どちらが便利かはお選びください。"
      },
      {
        q: "どのようなファイルサイズを圧縮できますか？",
        a: "個別のファイルサイズ制限はありません。コンピューターがファイルを開ける場合、Toolazeはそれを圧縮できます。バッチ内の任意のサイズのファイルを処理できます。"
      }
    ]
  },
  ko: {
    metadata: {
      title: "이미지 일괄 압축 온라인 (무료, 광고 없음 및 빠름) - Toolaze",
      description: "이미지를 일괄 압축하는 방법은? 1. 여러 이미지 업로드 2. 목표 크기 설정 3. 모두 다운로드. 한 번에 최대 100개의 이미지를 압축합니다. 안전하고 비공개."
    },
    intro: {
      title: "일괄 압축을 사용하는 이유",
      content: [
        {
          title: "일괄 압축의 이점",
          text: "이미지를 하나씩 처리하는 것은 시간이 많이 걸리고 비효율적입니다. 일괄 압축을 사용하면 최대 100개의 이미지를 동시에 압축할 수 있어 수시간의 작업을 절약하고 전체 이미지 컬렉션에서 일관된 결과를 보장합니다. 사진 갤러리를 최적화하거나, 웹사이트용 이미지를 준비하거나, 저장용 파일을 압축하는 경우에도 일괄 처리는 한 번의 작업으로 모든 것을 처리합니다. 당사의 브라우저 기반 일괄 압축기는 Canvas API를 사용하여 모든 이미지를 로컬로 처리하여 이미지를 서버에 업로드하지 않고도 완전한 개인정보 보호를 보장하면서 빠르고 효율적인 압축을 제공합니다."
        },
        {
          title: "일괄 압축을 사용하는 시기",
          text: "전체 사진 갤러리 또는 이미지 컬렉션을 최적화해야 할 때, 웹사이트 업로드 또는 소셜 미디어용 여러 이미지를 준비해야 할 때, 저장 또는 백업 목적으로 파일을 압축해야 할 때, 또는 일관된 압축 설정으로 이미지를 처리해야 할 때 일괄 압축을 사용합니다. 당사의 도구는 JPG, PNG, WebP 및 BMP 형식을 지원하여 단일 일괄 작업에서 다양한 형식을 혼합할 수 있어 다양한 이미지 컬렉션을 효율적으로 처리하는 데 완벽합니다."
        }
      ]
    },
    features: {
      items: [
        {
          title: "100개 이미지 처리",
          desc: "한 번의 일괄 작업으로 최대 100개의 이미지를 동시에 압축합니다. 시간과 노력을 절약합니다."
        },
        {
          title: "다중 형식 지원",
          desc: "JPG, PNG, WebP 및 BMP 형식을 지원합니다. 하나의 배치에서 다양한 형식을 혼합할 수 있습니다."
        },
        {
          title: "정확한 크기 제어",
          desc: "KB 또는 MB로 정확한 목표 크기를 설정합니다. 모든 이미지가 동일한 목표 크기를 충족하도록 압축됩니다."
        },
        {
          title: "100% 비공개 처리",
          desc: "모든 압축은 브라우저에서 로컬로 수행됩니다. 이미지가 기기를 떠나지 않아 완전한 개인정보 보호를 보장합니다."
        },
        {
          title: "빠른 일괄 처리",
          desc: "브라우저 네이티브 Canvas API 처리는 서버 업로드나 지연 없이 빠른 일괄 압축을 보장합니다."
        },
        {
          title: "영구 무료",
          desc: "무제한 일괄 압축 완전 무료—프리미엄 등급 없음, 구독료 없음, 광고 없음."
        }
      ]
    },
    specs: {
      engine: "Canvas API - 브라우저 네이티브 처리",
      limit: "일괄 처리 100+ 이미지 - 무제한 파일 크기",
      logic: "일관된 일괄 압축",
      privacy: "100% 클라이언트 측 (로컬 브라우저 처리)"
    },
    performanceMetrics: {
      metrics: [
        { label: "배치 크기", value: "배치당 최대 100개 이미지" },
        { label: "지원 형식", value: "JPG, PNG, WebP, BMP" },
        { label: "출력 형식", value: "원본 형식 보존" },
        { label: "파일 크기 제한", value: "무제한 (브라우저 메모리에 따라 제한됨)" },
        { label: "압축 비율", value: "일반적으로 50-70% 크기 감소" },
        { label: "처리 위치", value: "100% 클라이언트 측 (브라우저 Canvas API)" },
        { label: "배치 일관성", value: "모든 이미지가 동일한 목표 크기로 압축됨" }
      ]
    },
    howToUse: {
      title: "이미지를 일괄 압축하는 방법",
      steps: [
        {
          title: "여러 이미지 업로드",
          desc: "최대 100개의 이미지(JPG, PNG, WebP 또는 BMP)를 압축 영역으로 드래그 앤 드롭하거나 클릭하여 여러 파일을 찾아 선택합니다."
        },
        {
          title: "목표 크기 설정",
          desc: "원하는 파일 크기(KB 또는 MB)를 선택하세요. 배치의 모든 이미지가 이 목표 크기를 충족하도록 압축됩니다."
        },
        {
          title: "모든 압축 파일 다운로드",
          desc: "모든 압축 이미지를 한 번에 ZIP 파일로 또는 개별적으로 다운로드하세요. 각 파일은 품질을 유지하면서 원본보다 훨씬 작습니다."
        }
      ]
    },
    scenes: [
      {
        title: "사진작가",
        desc: "전체 사진 갤러리를 한 번에 압축합니다. 품질을 유지하면서 수백 장의 사진을 효율적으로 처리합니다."
      },
      {
        title: "웹 개발자",
        desc: "웹사이트용 여러 이미지를 최적화합니다. 제품 이미지, 갤러리 및 자산을 효율적으로 일괄 처리합니다."
      },
      {
        title: "전자상거래 관리자",
        desc: "온라인 스토어용 제품 이미지 컬렉션을 압축합니다. 전체 카탈로그를 빠르고 일관되게 처리합니다."
      }
    ],
    rating: {
      text: "\"수시간의 작업을 절약합니다! 내 사진 컬렉션 일괄 처리에 완벽합니다!\" - 일괄 압축을 위해 Toolaze를 신뢰하는 수천 명의 사용자에 합류하세요."
    },
    faq: [
      {
        q: "한 번에 몇 개의 이미지를 압축할 수 있나요?",
        a: "Toolaze는 세션당 최대 100개 이미지의 일괄 압축을 지원합니다. 한 번의 작업으로 전체 사진 컬렉션을 처리할 수 있습니다."
      },
      {
        q: "하나의 배치에서 다른 이미지 형식을 혼합할 수 있나요?",
        a: "예, 하나의 배치에서 JPG, PNG, WebP 및 BMP 형식을 혼합할 수 있습니다. 각 이미지는 원본 형식을 유지하면서 압축됩니다."
      },
      {
        q: "모든 이미지가 같은 크기로 압축되나요?",
        a: "모든 이미지는 지정한 목표 크기(KB 또는 MB)를 충족하도록 압축되어 배치 전체에서 일관된 결과를 보장합니다."
      },
      {
        q: "일괄 압축이 무료이고 안전한가요?",
        a: "예, Toolaze는 숨겨진 비용 없이 완전히 무료입니다. 모든 압축은 브라우저에서 로컬로 수행됩니다. 이미지가 기기를 떠나지 않아 100% 개인정보 보호와 보안을 보장합니다."
      },
      {
        q: "모든 압축 이미지를 한 번에 다운로드할 수 있나요?",
        a: "예, 모든 압축 이미지를 ZIP 파일로 또는 개별적으로 다운로드할 수 있습니다. 더 편리한 방법을 선택하세요."
      },
      {
        q: "어떤 파일 크기를 압축할 수 있나요?",
        a: "개별 파일 크기 제한이 없습니다. 컴퓨터가 파일을 열 수 있으면 Toolaze가 압축할 수 있습니다. 배치에서 모든 크기의 파일을 처리할 수 있습니다."
      }
    ]
  },
  'zh-TW': {
    metadata: {
      title: "圖片批次壓縮線上（免費、無廣告、快速）- Toolaze",
      description: "如何批次壓縮圖片？1. 上傳多張圖片 2. 設定目標大小 3. 下載全部。一次壓縮最多 100 張圖片。安全且私密。"
    },
    intro: {
      title: "為什麼要使用批次壓縮？",
      content: [
        {
          title: "批次壓縮的優點",
          text: "逐一處理圖片既耗時又低效。批次壓縮讓您可以同時壓縮最多 100 張圖片，節省數小時的工作時間，並確保整個圖片集合的一致結果。無論您是優化照片庫、為網站準備圖片，還是壓縮檔案以供儲存，批次處理都能在一次操作中完成所有工作。我們的瀏覽器批次壓縮工具使用 Canvas API 在本地處理所有圖片，確保完全隱私，同時提供快速高效的壓縮，無需將圖片上傳到任何伺服器。"
        },
        {
          title: "何時使用批次壓縮",
          text: "當您需要優化整個照片庫或圖片集合、為網站上傳或社交媒體準備多張圖片、壓縮檔案以供儲存或備份，或使用一致的壓縮設定處理圖片時，請使用批次壓縮。我們的工具支援 JPG、PNG、WebP 和 BMP 格式，允許您在單一批次操作中混合不同格式，使其非常適合高效處理多樣化的圖片集合。"
        }
      ]
    },
    features: {
      items: [
        {
          title: "處理 100 張圖片",
          desc: "在一次批次操作中同時壓縮最多 100 張圖片。節省時間和精力。"
        },
        {
          title: "多格式支援",
          desc: "支援 JPG、PNG、WebP 和 BMP 格式。在一個批次中混合不同格式。"
        },
        {
          title: "精確大小控制",
          desc: "設定精確的目標大小（KB 或 MB）。所有圖片壓縮以達到相同的目標大小。"
        },
        {
          title: "100% 私密處理",
          desc: "所有壓縮都在您的瀏覽器中本地進行。您的圖片永遠不會離開您的設備，確保完全的隱私。"
        },
        {
          title: "快速批次處理",
          desc: "瀏覽器原生 Canvas API 處理確保快速批次壓縮，無需伺服器上傳或延遲。"
        },
        {
          title: "永久免費",
          desc: "無限批次壓縮完全免費—無高級層級、無訂閱費用、無廣告。"
        }
      ]
    },
    specs: {
      engine: "Canvas API - 瀏覽器原生處理",
      limit: "批次處理 100+ 圖片 - 無限制檔案大小",
      logic: "一致的批次壓縮",
      privacy: "100% 客戶端（本地瀏覽器處理）"
    },
    performanceMetrics: {
      metrics: [
        { label: "批次大小", value: "每個批次最多 100 張圖片" },
        { label: "支援格式", value: "JPG、PNG、WebP、BMP" },
        { label: "輸出格式", value: "保留原始格式" },
        { label: "檔案大小限制", value: "無限制（受瀏覽器記憶體限制）" },
        { label: "壓縮比率", value: "通常減少 50-70% 大小" },
        { label: "處理位置", value: "100% 客戶端（瀏覽器 Canvas API）" },
        { label: "批次一致性", value: "所有圖片以相同目標大小壓縮" }
      ]
    },
    howToUse: {
      title: "如何批次壓縮圖片",
      steps: [
        {
          title: "上傳多張圖片",
          desc: "將最多 100 張圖片（JPG、PNG、WebP 或 BMP）拖放到壓縮區域，或點擊瀏覽並選擇多個檔案。"
        },
        {
          title: "設定目標大小",
          desc: "選擇您想要的檔案大小（KB 或 MB）。批次中的所有圖片都將被壓縮以達到此目標大小。"
        },
        {
          title: "下載所有壓縮檔案",
          desc: "一次性下載所有壓縮圖片為 ZIP 檔案，或個別下載。每個檔案保持品質，同時比原始檔案小得多。"
        }
      ]
    },
    scenes: [
      {
        title: "攝影師",
        desc: "一次壓縮整個照片庫。在保持品質的同時高效處理數百張照片。"
      },
      {
        title: "網頁開發者",
        desc: "優化網站的多張圖片。高效批次處理產品圖片、圖庫和資產。"
      },
      {
        title: "電子商務管理員",
        desc: "壓縮線上商店的產品圖片集合。快速且一致地處理整個目錄。"
      }
    ],
    rating: {
      text: "\"為我節省數小時的工作時間！批次處理我的照片集合非常完美！\" - 加入數千名信賴 Toolaze 進行批次壓縮的使用者。"
    },
    faq: [
      {
        q: "我可以一次壓縮多少張圖片？",
        a: "Toolaze 支援每個會話最多 100 張圖片的批次壓縮。您可以一次操作處理整個照片集合。"
      },
      {
        q: "我可以在一個批次中混合不同的圖片格式嗎？",
        a: "是的，您可以在單一批次中混合 JPG、PNG、WebP 和 BMP 格式。每張圖片將在保持其原始格式的同時被壓縮。"
      },
      {
        q: "所有圖片都會被壓縮到相同大小嗎？",
        a: "所有圖片都將被壓縮以達到您指定的相同目標大小（KB 或 MB），確保批次中的一致結果。"
      },
      {
        q: "批次壓縮是免費且安全的嗎？",
        a: "是的，Toolaze 完全免費，沒有隱藏費用。所有壓縮都在您的瀏覽器中本地進行。您的圖片永遠不會離開您的設備—確保 100% 的隱私和安全。"
      },
      {
        q: "我可以一次下載所有壓縮圖片嗎？",
        a: "是的，您可以將所有壓縮圖片下載為 ZIP 檔案，或個別下載，以您更方便的方式為準。"
      },
      {
        q: "我可以壓縮哪些檔案大小？",
        a: "沒有個別檔案大小限制。如果您的電腦可以打開檔案，Toolaze 就可以壓縮它。您可以在批次中處理任何大小的檔案。"
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
    } else if (Array.isArray(source[key])) {
      // 对于数组，直接替换
      target[key] = source[key]
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
    
    if (!data['batch-compress']) {
      console.log(`⚠️  ${lang}: batch-compress section not found`)
      continue
    }
    
    const translation = translations[lang]
    if (!translation) {
      console.log(`⚠️  ${lang}: translation not found`)
      continue
    }
    
    // 合并翻译
    if (translation.metadata) {
      deepMerge(data['batch-compress'].metadata, translation.metadata)
    }
    
    if (translation.intro) {
      deepMerge(data['batch-compress'].intro, translation.intro)
    }
    
    if (translation.features) {
      if (translation.features.items) {
        data['batch-compress'].features.items = translation.features.items
      }
    }
    
    if (translation.specs) {
      deepMerge(data['batch-compress'].specs, translation.specs)
    }
    
    if (translation.performanceMetrics) {
      if (!data['batch-compress'].performanceMetrics) {
        data['batch-compress'].performanceMetrics = { title: '', metrics: [] }
      }
      if (translation.performanceMetrics.metrics) {
        data['batch-compress'].performanceMetrics.metrics = translation.performanceMetrics.metrics
      }
    }
    
    if (translation.howToUse) {
      deepMerge(data['batch-compress'].howToUse, translation.howToUse)
    }
    
    if (translation.scenes) {
      data['batch-compress'].scenes = translation.scenes
    }
    
    if (translation.rating) {
      deepMerge(data['batch-compress'].rating, translation.rating)
    }
    
    if (translation.faq) {
      data['batch-compress'].faq = translation.faq
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ ${lang}: batch-compress translated`)
  }
  
  console.log('\n✨ All translations completed!')
}

main().catch(console.error)
