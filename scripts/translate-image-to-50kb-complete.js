const fs = require('fs')
const path = require('path')

// 完整翻译映射
const translations = {
  de: {
    hero: {
      desc: "Komprimieren Sie Bilder auf genau 50KB für Online-Formulare und Anwendungen. Lassen Sie einfach Ihre Bilder unten fallen, um sie in Sekunden zu komprimieren."
    },
    intro: {
      title: "Warum Bilder auf 50KB komprimieren?",
      content: [
        {
          title: "Universeller Standard für Online-Formulare",
          text: "50KB ist die häufigste Dateigrößenanforderung für Online-Formulare, Anwendungen und Portale weltweit. Von Schulzulassungen und Universitätsbewerbungen bis hin zu Lebenslauf-Portalen, Stellenbewerbungen und Regierungsformularen ist 50KB zum universellen Gateway für Dokumenten-Uploads geworden. Wenn Sie ein Foto mit Ihrem Smartphone aufnehmen oder ein Dokument scannen, ist die resultierende Bilddatei oft 2-10MB groß und überschreitet diese Grenzen bei weitem. Upload-Fehler aufgrund von Dateigrößenbeschränkungen können Ihre Bewerbungen verzögern, Ihre Zeit verschwenden und Frustration verursachen. Unser browserbasierter Kompressor verwendet intelligente Canvas API-Verarbeitung, um Ihre Bilder auf genau 50KB zu reduzieren und dabei die visuelle Qualität zu erhalten, die für die offizielle Überprüfung und professionelle Präsentation erforderlich ist."
        },
        {
          title: "Originalformat für maximale Kompatibilität erhalten",
          text: "Verschiedene Online-Formulare akzeptieren verschiedene Bildformate—einige erfordern JPG, andere akzeptieren PNG, und einige bevorzugen WebP. Die Konvertierung zwischen Formaten kann Kompatibilitätsprobleme oder Qualitätsverlust verursachen. Toolaze komprimiert Ihre Bilder und behält dabei das Originalformat bei, was maximale Kompatibilität mit jedem System gewährleistet. Ob Sie mit einer 5MB JPG oder einer 50MB PNG beginnen, unser Algorithmus behandelt die Komprimierung ohne Änderung des Dateiformats, sodass Ihr komprimiertes Bild nahtlos mit jedem Portal oder Anwendungssystem funktioniert. Alle Verarbeitung erfolgt lokal in Ihrem Browser, sodass Ihre persönlichen Dokumente und Fotos vollständig privat und sicher bleiben."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Präzises 50KB-Ziel",
          desc: "Komprimieren Sie Bilder auf genau 50KB. Erfüllen Sie universelle Online-Formularanforderungen mit Präzision und erhalten Sie dabei die visuelle Qualität für die offizielle Überprüfung."
        },
        {
          title: "100% Private Verarbeitung",
          desc: "Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre persönlichen Dokumente und Fotos verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre und Sicherheit."
        },
        {
          title: "Stapelverarbeitung",
          desc: "Verarbeiten Sie bis zu 100 Bilder gleichzeitig. Perfekt für die Massenverarbeitung von Dokumenten und mehrere Antragseinreichungen."
        },
        {
          title: "Sofortige Komprimierung",
          desc: "Die browser-native Canvas API-Verarbeitung gewährleistet sofortige Komprimierung ohne Server-Uploads oder Warteschlangen. Bereiten Sie Ihre Dokumente sofort vor."
        },
        {
          title: "Für Immer Kostenlos",
          desc: "Unbegrenzte Bildkomprimierung völlig kostenlos—keine Premium-Stufen, keine Abonnementgebühren, keine Werbung. Perfekt für alle Benutzer."
        },
        {
          title: "Format Erhalten",
          desc: "Behalten Sie das ursprüngliche Bildformat bei (JPG, PNG, WebP, BMP). Behalten Sie die Kompatibilität mit jedem Online-Formular oder Anwendungssystem."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Eingabeformat",
          value: "JPG, PNG, WebP, BMP (Alle Bildformate)"
        },
        {
          label: "Ausgabeformat",
          value: "Originalformat erhalten"
        },
        {
          label: "Dateigrößenlimit",
          value: "Genau 50KB (Universelle Formularanforderung)"
        },
        {
          label: "Auflösungsunterstützung",
          value: "Bis zu 4K (3840x2160) - Automatisch für Größe angepasst"
        },
        {
          label: "Stapelverarbeitung",
          value: "Bis zu 100 Bilder pro Sitzung"
        },
        {
          label: "Verarbeitungsgeschwindigkeit",
          value: "Sofortige browser-seitige Komprimierung"
        }
      ]
    },
    howToUse: {
      title: "Wie man Bilder auf 50KB komprimiert",
      steps: [
        {
          title: "Bild hochladen",
          desc: "Ziehen Sie Ihr Bild per Drag & Drop oder klicken Sie zum Durchsuchen. Unterstützt JPG-, PNG-, WebP- und BMP-Formate von jeder Quelle."
        },
        {
          title: "50KB-Ziel festlegen",
          desc: "Das Tool setzt das Ziel automatisch auf genau 50KB. Unser Algorithmus komprimiert Ihr Bild präzise, um Online-Formularanforderungen zu erfüllen."
        },
        {
          title: "Komprimiertes herunterladen",
          desc: "Laden Sie Ihr komprimiertes Bild sofort herunter. Die Datei ist garantiert unter 50KB und bereit zum Hochladen auf jedes Online-Formular."
        }
      ]
    },
    scenes: [
      {
        title: "Lebenslauf-Portale",
        desc: "Komprimieren Sie Porträts und Dokumentenscans für ATS- und Rekrutierungssysteme. Stellen Sie sicher, dass Ihre Lebenslauf-Anhänge die Dateigrößenanforderungen für sofortige Verarbeitung erfüllen."
      },
      {
        title: "Universitätszulassungen",
        desc: "Optimieren Sie Ausweisfotos und Dokumentenscans für Zulassungsportale. Erfüllen Sie strenge 50KB-Anforderungen für Bewerbungseinreichungen."
      },
      {
        title: "Stellenbewerbungen",
        desc: "Komprimieren Sie Fotos und Dokumente für Online-Stellenbewerbungen. Stellen Sie sicher, dass Ihre Anhänge die Dateigrößenlimits für erfolgreiche Einreichungen erfüllen."
      }
    ],
    comparison: {
      toolaze: "Präzise 50KB-Ausgabe, Originalformat erhalten, 100% browser-seitige Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Bildern, Für immer kostenlos",
      others: "Zufällige Dateigrößen können 50KB überschreiten, Formatkonvertierung erforderlich, Server-Uploads erforderlich, Wasserzeichen oder Qualitätsverschlechterung, Begrenzte Stapelverarbeitung, Abonnementgebühren oder Werbung"
    },
    rating: {
      text: "\"Perfekt die 50KB-Marke für meine Universitätsbewerbung getroffen. Kein Raten mehr!\" - Schließen Sie sich Tausenden von Studenten und Fachleuten an, die Toolaze für Online-Formular-Compliance vertrauen."
    },
    faq: [
      {
        q: "Welche Bildformate werden unterstützt?",
        a: "Toolaze unterstützt JPG-, JPEG-, PNG-, WebP- und BMP-Formate. Ihre komprimierte Datei wird in ihrem Originalformat heruntergeladen, was maximale Kompatibilität mit jedem Online-Formular oder Anwendungssystem gewährleistet."
      },
      {
        q: "Ist die Komprimierung wirklich kostenlos?",
        a: "Ja! Toolaze ist 100% kostenlos ohne Werbung, ohne Premium-Stufen und ohne Begrenzung der Nutzungshäufigkeit. Alle Komprimierung erfolgt lokal in Ihrem Browser, sodass es keine Serverkosten oder Abonnementgebühren gibt."
      },
      {
        q: "Kann ich mehrere Bilder gleichzeitig komprimieren?",
        a: "Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Bildern gleichzeitig. Perfekt für die Verarbeitung mehrerer Dokumente oder Fotos für Massenantragseinreichungen."
      },
      {
        q: "Wird mein komprimiertes Bild noch von Online-Formularen akzeptiert?",
        a: "Ja. Toolaze erhält die visuelle Qualität, die für die offizielle Überprüfung erforderlich ist, während die strenge 50KB-Dateigrößenanforderung erfüllt wird. Die komprimierten Bilder behalten die Klarheit und Lesbarkeit bei, die von Online-Formularen und Portalen erforderlich sind."
      },
      {
        q: "Was ist, wenn mein Originalbild bereits unter 50KB liegt?",
        a: "Wenn Ihr Bild bereits unter 50KB liegt, optimiert das Tool es weiter, um sicherzustellen, dass es die genaue Anforderung erfüllt und dabei die Qualität erhält. Der Komprimierungsalgorithmus konzentriert sich darauf, unsichtbare Daten zu entfernen, anstatt die visuelle Qualität zu reduzieren."
      },
      {
        q: "Funktioniert es für Reisepassfotos und Ausweisdokumente?",
        a: "Ja, Toolaze kann Reisepassfotos und Ausweisdokumentenscans auf 50KB komprimieren. Beachten Sie jedoch, dass einige Anwendungen möglicherweise unterschiedliche Größenanforderungen haben (z. B. erfordert USCIS 240KB). Überprüfen Sie immer Ihre spezifischen Anwendungsanforderungen vor der Komprimierung."
      }
    ]
  },
  es: {
    hero: {
      desc: "Comprime imágenes a exactamente 50KB para formularios y aplicaciones online. Simplemente suelta tus imágenes a continuación para comprimirlas en segundos."
    },
    intro: {
      title: "¿Por qué comprimir imágenes a 50KB?",
      content: [
        {
          title: "Estándar Universal para Formularios Online",
          text: "50KB es el requisito de tamaño de archivo más común para formularios online, aplicaciones y portales en todo el mundo. Desde admisiones escolares y solicitudes universitarias hasta portales de currículum, solicitudes de empleo y formularios gubernamentales, 50KB se ha convertido en la puerta de entrada universal para cargas de documentos. Cuando tomas una foto con tu smartphone o escaneas un documento, el archivo de imagen resultante suele ser de 2-10MB, superando con creces estos límites. Los fallos de carga debido a restricciones de tamaño de archivo pueden retrasar tus solicitudes, desperdiciar tu tiempo y causar frustración. Nuestro compresor basado en navegador utiliza procesamiento inteligente de Canvas API para reducir tus imágenes a exactamente 50KB mientras mantiene la calidad visual necesaria para verificación oficial y presentación profesional."
        },
        {
          title: "Mantener Formato Original para Máxima Compatibilidad",
          text: "Diferentes formularios online aceptan diferentes formatos de imagen—algunos requieren JPG, otros aceptan PNG, y algunos prefieren WebP. Convertir entre formatos puede causar problemas de compatibilidad o pérdida de calidad. Toolaze comprime tus imágenes manteniendo el formato original intacto, asegurando máxima compatibilidad con cualquier sistema. Ya sea que comiences con un JPG de 5MB o un PNG de 50MB, nuestro algoritmo maneja la compresión sin cambiar el formato de archivo, por lo que tu imagen comprimida funciona perfectamente con cualquier portal o sistema de aplicación. Todo el procesamiento ocurre localmente en tu navegador, asegurando que tus documentos personales y fotos permanezcan completamente privados y seguros."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Objetivo Preciso de 50KB",
          desc: "Comprime imágenes a exactamente 50KB. Cumple con los requisitos universales de formularios online con precisión mientras mantienes la calidad visual para verificación oficial."
        },
        {
          title: "Procesamiento 100% Privado",
          desc: "Toda la compresión ocurre localmente en tu navegador. Tus documentos personales y fotos nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas."
        },
        {
          title: "Procesamiento por Lotes",
          desc: "Procesa hasta 100 imágenes simultáneamente. Perfecto para procesamiento masivo de documentos y múltiples envíos de solicitudes."
        },
        {
          title: "Compresión Instantánea",
          desc: "El procesamiento nativo de Canvas API del navegador garantiza compresión instantánea sin cargas al servidor o colas de espera. Prepara tus documentos inmediatamente."
        },
        {
          title: "Gratis Para Siempre",
          desc: "Compresión de imágenes ilimitada completamente gratuita—sin niveles premium, sin tarifas de suscripción, sin anuncios. Perfecto para todos los usuarios."
        },
        {
          title: "Formato Preservado",
          desc: "Mantén el formato de imagen original (JPG, PNG, WebP, BMP). Mantén la compatibilidad con cualquier formulario online o sistema de aplicación."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato de Entrada",
          value: "JPG, PNG, WebP, BMP (Todos los formatos de imagen)"
        },
        {
          label: "Formato de Salida",
          value: "Formato original preservado"
        },
        {
          label: "Límite de Tamaño de Archivo",
          value: "Exactamente 50KB (requisito universal de formulario)"
        },
        {
          label: "Soporte de Resolución",
          value: "Hasta 4K (3840x2160) - Ajustado automáticamente para tamaño"
        },
        {
          label: "Procesamiento por Lotes",
          value: "Hasta 100 imágenes por sesión"
        },
        {
          label: "Velocidad de Procesamiento",
          value: "Compresión instantánea del lado del navegador"
        }
      ]
    },
    howToUse: {
      title: "Cómo Comprimir Imagen a 50KB",
      steps: [
        {
          title: "Subir Imagen",
          desc: "Arrastra y suelta tu imagen o haz clic para navegar. Admite formatos JPG, PNG, WebP y BMP de cualquier fuente."
        },
        {
          title: "Establecer Objetivo de 50KB",
          desc: "La herramienta establece automáticamente el objetivo a exactamente 50KB. Nuestro algoritmo comprime tu imagen con precisión para cumplir con los requisitos de formularios online."
        },
        {
          title: "Descargar Comprimido",
          desc: "Descarga tu imagen comprimida al instante. El archivo está garantizado que estará bajo 50KB y listo para subir a cualquier formulario online."
        }
      ]
    },
    scenes: [
      {
        title: "Portales de Currículum",
        desc: "Comprime fotos de perfil y escaneos de documentos para sistemas ATS y de reclutamiento. Asegura que tus adjuntos de currículum cumplan con los requisitos de tamaño de archivo para procesamiento instantáneo."
      },
      {
        title: "Admisiones Universitarias",
        desc: "Optimiza fotos de identificación y escaneos de documentos para portales de admisión. Cumple con requisitos estrictos de 50KB para envíos de solicitudes."
      },
      {
        title: "Solicitudes de Empleo",
        desc: "Comprime fotos y documentos para solicitudes de empleo online. Asegura que tus adjuntos cumplan con los límites de tamaño de archivo para envíos exitosos."
      }
    ],
    comparison: {
      toolaze: "Salida precisa de 50KB, Formato original preservado, 100% procesamiento del lado del navegador, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes hasta 100 imágenes, Gratis para siempre",
      others: "Los tamaños de archivo aleatorios pueden exceder 50KB, Conversión de formato requerida, Se requieren cargas al servidor, Marcas de agua o degradación de calidad, Procesamiento por lotes limitado, Tarifas de suscripción o anuncios"
    },
    rating: {
      text: "\"¡Alcanzó perfectamente la marca de 50KB para mi solicitud universitaria. ¡No más adivinanzas!\" - Únete a miles de estudiantes y profesionales que confían en Toolaze para cumplimiento de formularios online."
    },
    faq: [
      {
        q: "¿Qué formatos de imagen se admiten?",
        a: "Toolaze admite formatos JPG, JPEG, PNG, WebP y BMP. Tu archivo comprimido se descargará en su formato original, asegurando máxima compatibilidad con cualquier formulario online o sistema de aplicación."
      },
      {
        q: "¿La compresión es realmente gratuita?",
        a: "¡Sí! Toolaze es 100% gratuito sin anuncios, sin niveles premium y sin límites en la cantidad de veces que lo uses. Toda la compresión ocurre localmente en tu navegador, por lo que no hay costos de servidor ni tarifas de suscripción."
      },
      {
        q: "¿Puedo comprimir múltiples imágenes a la vez?",
        a: "¡Sí! Toolaze admite procesamiento por lotes de hasta 100 imágenes simultáneamente. Perfecto para procesar múltiples documentos o fotos para envíos masivos de solicitudes."
      },
      {
        q: "¿Mi imagen comprimida seguirá siendo aceptada por formularios online?",
        a: "Sí. Toolaze mantiene la calidad visual necesaria para verificación oficial mientras cumple con el estricto requisito de tamaño de archivo de 50KB. Las imágenes comprimidas mantienen la claridad y legibilidad requeridas por formularios online y portales."
      },
      {
        q: "¿Qué pasa si mi imagen original ya está bajo 50KB?",
        a: "Si tu imagen ya está bajo 50KB, la herramienta la optimizará aún más para asegurar que cumpla con el requisito exacto mientras preserva la calidad. El algoritmo de compresión se enfoca en eliminar datos invisibles en lugar de reducir la calidad visual."
      },
      {
        q: "¿Funciona para fotos de pasaporte y documentos de identificación?",
        a: "Sí, Toolaze puede comprimir fotos de pasaporte y escaneos de documentos de identificación a 50KB. Sin embargo, ten en cuenta que algunas aplicaciones pueden tener requisitos de tamaño diferentes (por ejemplo, USCIS requiere 240KB). Siempre verifica los requisitos específicos de tu aplicación antes de comprimir."
      }
    ]
  },
  fr: {
    hero: {
      desc: "Compressez les images à exactement 50KB pour les formulaires et applications en ligne. Déposez simplement vos images ci-dessous pour les comprimer en quelques secondes."
    },
    intro: {
      title: "Pourquoi compresser les images à 50KB?",
      content: [
        {
          title: "Standard Universel pour Formulaires en Ligne",
          text: "50KB est l'exigence de taille de fichier la plus courante pour les formulaires en ligne, applications et portails dans le monde entier. Des admissions scolaires et demandes universitaires aux portails de CV, candidatures d'emploi et formulaires gouvernementaux, 50KB est devenu la passerelle universelle pour les téléchargements de documents. Lorsque vous prenez une photo avec votre smartphone ou scannez un document, le fichier image résultant fait souvent 2-10MB, dépassant largement ces limites. Les échecs de téléchargement dus aux restrictions de taille de fichier peuvent retarder vos candidatures, gaspiller votre temps et causer de la frustration. Notre compresseur basé sur navigateur utilise un traitement intelligent de Canvas API pour réduire vos images à exactement 50KB tout en maintenant la qualité visuelle nécessaire pour la vérification officielle et la présentation professionnelle."
        },
        {
          title: "Maintenir le Format Original pour une Compatibilité Maximale",
          text: "Différents formulaires en ligne acceptent différents formats d'image—certains nécessitent JPG, d'autres acceptent PNG, et certains préfèrent WebP. Convertir entre formats peut causer des problèmes de compatibilité ou une perte de qualité. Toolaze compresse vos images tout en gardant le format original intact, assurant une compatibilité maximale avec tout système. Que vous commenciez avec un JPG de 5MB ou un PNG de 50MB, notre algorithme gère la compression sans changer le format de fichier, donc votre image compressée fonctionne parfaitement avec n'importe quel portail ou système d'application. Tout le traitement se fait localement dans votre navigateur, garantissant que vos documents personnels et photos restent complètement privés et sécurisés."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Cible Précise de 50KB",
          desc: "Compressez les images à exactement 50KB. Répondez aux exigences universelles des formulaires en ligne avec précision tout en maintenant la qualité visuelle pour la vérification officielle."
        },
        {
          title: "Traitement 100% Privé",
          desc: "Toute la compression se fait localement dans votre navigateur. Vos documents personnels et photos ne quittent jamais votre appareil, garantissant une confidentialité et sécurité complètes."
        },
        {
          title: "Traitement par Lots",
          desc: "Traitez jusqu'à 100 images simultanément. Parfait pour le traitement en masse de documents et plusieurs soumissions de candidatures."
        },
        {
          title: "Compression Instantanée",
          desc: "Le traitement natif Canvas API du navigateur garantit une compression instantanée sans téléchargements serveur ou files d'attente. Préparez vos documents immédiatement."
        },
        {
          title: "Gratuit Pour Toujours",
          desc: "Compression d'images illimitée complètement gratuite—aucun niveau premium, aucun frais d'abonnement, aucune publicité. Parfait pour tous les utilisateurs."
        },
        {
          title: "Format Préservé",
          desc: "Maintenez le format d'image original (JPG, PNG, WebP, BMP). Gardez la compatibilité avec n'importe quel formulaire en ligne ou système d'application."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Format d'Entrée",
          value: "JPG, PNG, WebP, BMP (Tous les formats d'image)"
        },
        {
          label: "Format de Sortie",
          value: "Format original préservé"
        },
        {
          label: "Limite de Taille de Fichier",
          value: "Exactement 50KB (exigence universelle de formulaire)"
        },
        {
          label: "Support de Résolution",
          value: "Jusqu'à 4K (3840x2160) - Ajusté automatiquement pour la taille"
        },
        {
          label: "Traitement par Lots",
          value: "Jusqu'à 100 images par session"
        },
        {
          label: "Vitesse de Traitement",
          value: "Compression instantanée côté navigateur"
        }
      ]
    },
    howToUse: {
      title: "Comment Compresser une Image à 50KB",
      steps: [
        {
          title: "Télécharger l'Image",
          desc: "Glissez-déposez votre image ou cliquez pour parcourir. Prend en charge les formats JPG, PNG, WebP et BMP de toute source."
        },
        {
          title: "Définir la Cible de 50KB",
          desc: "L'outil définit automatiquement la cible à exactement 50KB. Notre algorithme compresse votre image avec précision pour répondre aux exigences des formulaires en ligne."
        },
        {
          title: "Télécharger Comprimé",
          desc: "Téléchargez votre image compressée instantanément. Le fichier est garanti d'être sous 50KB et prêt à être téléchargé sur n'importe quel formulaire en ligne."
        }
      ]
    },
    scenes: [
      {
        title: "Portails de CV",
        desc: "Compressez les photos de profil et scans de documents pour les systèmes ATS et de recrutement. Assurez-vous que vos pièces jointes de CV répondent aux exigences de taille de fichier pour un traitement instantané."
      },
      {
        title: "Admissions Universitaires",
        desc: "Optimisez les photos d'identité et scans de documents pour les portails d'admission. Répondez aux exigences strictes de 50KB pour les soumissions de candidatures."
      },
      {
        title: "Candidatures d'Emploi",
        desc: "Compressez les photos et documents pour les candidatures d'emploi en ligne. Assurez-vous que vos pièces jointes répondent aux limites de taille de fichier pour des soumissions réussies."
      }
    ],
    comparison: {
      toolaze: "Sortie précise de 50KB, Format original préservé, 100% traitement côté navigateur, Aucune filigrane ou perte de qualité, Traitement par lots jusqu'à 100 images, Gratuit pour toujours",
      others: "Les tailles de fichier aléatoires peuvent dépasser 50KB, Conversion de format requise, Téléchargements serveur requis, Filigranes ou dégradation de qualité, Traitement par lots limité, Frais d'abonnement ou publicités"
    },
    rating: {
      text: "\"Atteint parfaitement la marque de 50KB pour ma candidature universitaire. Plus de devinettes!\" - Rejoignez des milliers d'étudiants et professionnels qui font confiance à Toolaze pour la conformité des formulaires en ligne."
    },
    faq: [
      {
        q: "Quels formats d'image sont pris en charge?",
        a: "Toolaze prend en charge les formats JPG, JPEG, PNG, WebP et BMP. Votre fichier compressé sera téléchargé dans son format original, assurant une compatibilité maximale avec tout formulaire en ligne ou système d'application."
      },
      {
        q: "La compression est-elle vraiment gratuite?",
        a: "Oui! Toolaze est 100% gratuit sans publicité, sans niveaux premium et sans limite sur le nombre de fois que vous l'utilisez. Toute la compression se fait localement dans votre navigateur, donc il n'y a pas de coûts de serveur ou de frais d'abonnement."
      },
      {
        q: "Puis-je compresser plusieurs images à la fois?",
        a: "Oui! Toolaze prend en charge le traitement par lots de jusqu'à 100 images simultanément. Parfait pour traiter plusieurs documents ou photos pour des soumissions massives de candidatures."
      },
      {
        q: "Mon image compressée sera-t-elle toujours acceptée par les formulaires en ligne?",
        a: "Oui. Toolaze maintient la qualité visuelle nécessaire pour la vérification officielle tout en respectant l'exigence stricte de taille de fichier de 50KB. Les images compressées maintiennent la clarté et la lisibilité requises par les formulaires en ligne et les portails."
      },
      {
        q: "Et si mon image originale est déjà sous 50KB?",
        a: "Si votre image est déjà sous 50KB, l'outil l'optimisera davantage pour s'assurer qu'elle répond à l'exigence exacte tout en préservant la qualité. L'algorithme de compression se concentre sur l'élimination des données invisibles plutôt que sur la réduction de la qualité visuelle."
      },
      {
        q: "Fonctionne-t-il pour les photos de passeport et documents d'identité?",
        a: "Oui, Toolaze peut compresser les photos de passeport et scans de documents d'identité à 50KB. Cependant, notez que certaines applications peuvent avoir des exigences de taille différentes (par exemple, USCIS nécessite 240KB). Vérifiez toujours les exigences spécifiques de votre application avant de compresser."
      }
    ]
  },
  pt: {
    hero: {
      desc: "Comprima imagens para exatamente 50KB para formulários e aplicações online. Simplesmente solte suas imagens abaixo para comprimi-las em segundos."
    },
    intro: {
      title: "Por que comprimir imagens para 50KB?",
      content: [
        {
          title: "Padrão Universal para Formulários Online",
          text: "50KB é o requisito de tamanho de arquivo mais comum para formulários online, aplicações e portais em todo o mundo. Desde admissões escolares e aplicações universitárias até portais de currículo, candidaturas de emprego e formulários governamentais, 50KB tornou-se o portal universal para uploads de documentos. Quando você tira uma foto com seu smartphone ou escaneia um documento, o arquivo de imagem resultante geralmente tem 2-10MB, excedendo em muito esses limites. Falhas de upload devido a restrições de tamanho de arquivo podem atrasar suas aplicações, desperdiçar seu tempo e causar frustração. Nosso compressor baseado em navegador usa processamento inteligente de Canvas API para reduzir suas imagens para exatamente 50KB enquanto mantém a qualidade visual necessária para verificação oficial e apresentação profissional."
        },
        {
          title: "Manter Formato Original para Máxima Compatibilidade",
          text: "Diferentes formulários online aceitam diferentes formatos de imagem—alguns requerem JPG, outros aceitam PNG, e alguns preferem WebP. Converter entre formatos pode causar problemas de compatibilidade ou perda de qualidade. Toolaze comprime suas imagens mantendo o formato original intacto, garantindo máxima compatibilidade com qualquer sistema. Seja começando com um JPG de 5MB ou um PNG de 50MB, nosso algoritmo lida com a compressão sem alterar o formato do arquivo, então sua imagem comprimida funciona perfeitamente com qualquer portal ou sistema de aplicação. Todo o processamento acontece localmente em seu navegador, garantindo que seus documentos pessoais e fotos permaneçam completamente privados e seguros."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Objetivo Preciso de 50KB",
          desc: "Comprima imagens para exatamente 50KB. Atenda aos requisitos universais de formulários online com precisão enquanto mantém a qualidade visual para verificação oficial."
        },
        {
          title: "Processamento 100% Privado",
          desc: "Toda a compressão acontece localmente em seu navegador. Seus documentos pessoais e fotos nunca deixam seu dispositivo, garantindo privacidade e segurança completas."
        },
        {
          title: "Processamento em Lote",
          desc: "Processe até 100 imagens simultaneamente. Perfeito para processamento em massa de documentos e múltiplos envios de aplicações."
        },
        {
          title: "Compressão Instantânea",
          desc: "O processamento nativo de Canvas API do navegador garante compressão instantânea sem uploads de servidor ou filas de espera. Prepare seus documentos imediatamente."
        },
        {
          title: "Grátis Para Sempre",
          desc: "Compressão de imagens ilimitada completamente gratuita—sem níveis premium, sem taxas de assinatura, sem anúncios. Perfeito para todos os usuários."
        },
        {
          title: "Formato Preservado",
          desc: "Mantenha o formato de imagem original (JPG, PNG, WebP, BMP). Mantenha a compatibilidade com qualquer formulário online ou sistema de aplicação."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato de Entrada",
          value: "JPG, PNG, WebP, BMP (Todos os formatos de imagem)"
        },
        {
          label: "Formato de Saída",
          value: "Formato original preservado"
        },
        {
          label: "Limite de Tamanho de Arquivo",
          value: "Exatamente 50KB (requisito universal de formulário)"
        },
        {
          label: "Suporte de Resolução",
          value: "Até 4K (3840x2160) - Ajustado automaticamente para tamanho"
        },
        {
          label: "Processamento em Lote",
          value: "Até 100 imagens por sessão"
        },
        {
          label: "Velocidade de Processamento",
          value: "Compressão instantânea do lado do navegador"
        }
      ]
    },
    howToUse: {
      title: "Como Comprimir Imagem para 50KB",
      steps: [
        {
          title: "Enviar Imagem",
          desc: "Arraste e solte sua imagem ou clique para navegar. Suporta formatos JPG, PNG, WebP e BMP de qualquer fonte."
        },
        {
          title: "Definir Objetivo de 50KB",
          desc: "A ferramenta define automaticamente o objetivo para exatamente 50KB. Nosso algoritmo comprime sua imagem com precisão para atender aos requisitos de formulários online."
        },
        {
          title: "Baixar Comprimido",
          desc: "Baixe sua imagem comprimida instantaneamente. O arquivo está garantido que estará abaixo de 50KB e pronto para enviar para qualquer formulário online."
        }
      ]
    },
    scenes: [
      {
        title: "Portais de Currículo",
        desc: "Comprima fotos de perfil e digitalizações de documentos para sistemas ATS e de recrutamento. Garanta que seus anexos de currículo atendam aos requisitos de tamanho de arquivo para processamento instantâneo."
      },
      {
        title: "Admissões Universitárias",
        desc: "Otimize fotos de identidade e digitalizações de documentos para portais de admissão. Atenda aos requisitos rigorosos de 50KB para envios de aplicações."
      },
      {
        title: "Candidaturas de Emprego",
        desc: "Comprima fotos e documentos para candidaturas de emprego online. Garanta que seus anexos atendam aos limites de tamanho de arquivo para envios bem-sucedidos."
      }
    ],
    comparison: {
      toolaze: "Saída precisa de 50KB, Formato original preservado, 100% processamento do lado do navegador, Sem marcas d'água ou perda de qualidade, Processamento em lote até 100 imagens, Grátis para sempre",
      others: "Tamanhos de arquivo aleatórios podem exceder 50KB, Conversão de formato necessária, Uploads de servidor necessários, Marcas d'água ou degradação de qualidade, Processamento em lote limitado, Taxas de assinatura ou anúncios"
    },
    rating: {
      text: "\"Atingiu perfeitamente a marca de 50KB para minha aplicação universitária. Sem mais adivinhações!\" - Junte-se a milhares de estudantes e profissionais que confiam no Toolaze para conformidade de formulários online."
    },
    faq: [
      {
        q: "Quais formatos de imagem são suportados?",
        a: "Toolaze suporta formatos JPG, JPEG, PNG, WebP e BMP. Seu arquivo comprimido será baixado em seu formato original, garantindo máxima compatibilidade com qualquer formulário online ou sistema de aplicação."
      },
      {
        q: "A compressão é realmente gratuita?",
        a: "Sim! Toolaze é 100% gratuito sem anúncios, sem níveis premium e sem limites no número de vezes que você o usa. Toda a compressão acontece localmente em seu navegador, então não há custos de servidor ou taxas de assinatura."
      },
      {
        q: "Posso comprimir múltiplas imagens de uma vez?",
        a: "Sim! Toolaze suporta processamento em lote de até 100 imagens simultaneamente. Perfeito para processar múltiplos documentos ou fotos para envios em massa de aplicações."
      },
      {
        q: "Minha imagem comprimida ainda será aceita por formulários online?",
        a: "Sim. Toolaze mantém a qualidade visual necessária para verificação oficial enquanto atende ao requisito rigoroso de tamanho de arquivo de 50KB. As imagens comprimidas mantêm a clareza e legibilidade necessárias por formulários online e portais."
      },
      {
        q: "E se minha imagem original já estiver abaixo de 50KB?",
        a: "Se sua imagem já estiver abaixo de 50KB, a ferramenta a otimizará ainda mais para garantir que atenda ao requisito exato enquanto preserva a qualidade. O algoritmo de compressão se concentra em remover dados invisíveis em vez de reduzir a qualidade visual."
      },
      {
        q: "Funciona para fotos de passaporte e documentos de identidade?",
        a: "Sim, Toolaze pode comprimir fotos de passaporte e digitalizações de documentos de identidade para 50KB. No entanto, observe que algumas aplicações podem ter requisitos de tamanho diferentes (por exemplo, USCIS requer 240KB). Sempre verifique os requisitos específicos de sua aplicação antes de comprimir."
      }
    ]
  },
  it: {
    hero: {
      desc: "Comprimi le immagini a esattamente 50KB per formulari e applicazioni online. Basta rilasciare le tue immagini qui sotto per comprimerle in pochi secondi."
    },
    intro: {
      title: "Perché comprimere le immagini a 50KB?",
      content: [
        {
          title: "Standard Universale per Formulari Online",
          text: "50KB è il requisito di dimensione file più comune per formulari online, applicazioni e portali in tutto il mondo. Dalle ammissioni scolastiche e domande universitarie ai portali di curriculum, candidature di lavoro e formulari governativi, 50KB è diventato il gateway universale per i caricamenti di documenti. Quando scatti una foto con il tuo smartphone o scansioni un documento, il file immagine risultante è spesso 2-10MB, superando di gran lunga questi limiti. I fallimenti di caricamento dovuti a restrizioni di dimensione file possono ritardare le tue domande, sprecare il tuo tempo e causare frustrazione. Il nostro compressore basato su browser utilizza l'elaborazione intelligente di Canvas API per ridurre le tue immagini a esattamente 50KB mantenendo la qualità visiva necessaria per la verifica ufficiale e la presentazione professionale."
        },
        {
          title: "Mantenere il Formato Originale per Massima Compatibilità",
          text: "Diversi formulari online accettano diversi formati di immagine—alcuni richiedono JPG, altri accettano PNG, e alcuni preferiscono WebP. Convertire tra formati può causare problemi di compatibilità o perdita di qualità. Toolaze comprime le tue immagini mantenendo il formato originale intatto, garantendo massima compatibilità con qualsiasi sistema. Che tu inizi con un JPG da 5MB o un PNG da 50MB, il nostro algoritmo gestisce la compressione senza cambiare il formato del file, quindi la tua immagine compressa funziona perfettamente con qualsiasi portale o sistema di applicazione. Tutta l'elaborazione avviene localmente nel tuo browser, garantendo che i tuoi documenti personali e fotografie rimangano completamente privati e sicuri."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Obiettivo Preciso di 50KB",
          desc: "Comprimi le immagini a esattamente 50KB. Soddisfa i requisiti universali dei formulari online con precisione mantenendo la qualità visiva per la verifica ufficiale."
        },
        {
          title: "Elaborazione 100% Privata",
          desc: "Tutta la compressione avviene localmente nel tuo browser. I tuoi documenti personali e fotografie non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete."
        },
        {
          title: "Elaborazione Batch",
          desc: "Elabora fino a 100 immagini contemporaneamente. Perfetto per l'elaborazione in massa di documenti e più invii di applicazioni."
        },
        {
          title: "Compressione Istantanea",
          desc: "L'elaborazione nativa Canvas API del browser garantisce compressione istantanea senza caricamenti sul server o code di attesa. Prepara i tuoi documenti immediatamente."
        },
        {
          title: "Gratis Per Sempre",
          desc: "Compressione immagini illimitata completamente gratuita—nessun livello premium, nessuna tariffa di abbonamento, nessuna pubblicità. Perfetto per tutti gli utenti."
        },
        {
          title: "Formato Preservato",
          desc: "Mantieni il formato immagine originale (JPG, PNG, WebP, BMP). Mantieni la compatibilità con qualsiasi formulario online o sistema di applicazione."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato di Input",
          value: "JPG, PNG, WebP, BMP (Tutti i formati di immagine)"
        },
        {
          label: "Formato di Output",
          value: "Formato originale preservato"
        },
        {
          label: "Limite Dimensione File",
          value: "Esattamente 50KB (requisito universale di formulario)"
        },
        {
          label: "Supporto Risoluzione",
          value: "Fino a 4K (3840x2160) - Regolato automaticamente per dimensione"
        },
        {
          label: "Elaborazione Batch",
          value: "Fino a 100 immagini per sessione"
        },
        {
          label: "Velocità di Elaborazione",
          value: "Compressione istantanea lato browser"
        }
      ]
    },
    howToUse: {
      title: "Come Comprimere Immagine a 50KB",
      steps: [
        {
          title: "Carica Immagine",
          desc: "Trascina e rilascia la tua immagine o fai clic per sfogliare. Supporta formati JPG, PNG, WebP e BMP da qualsiasi fonte."
        },
        {
          title: "Imposta Obiettivo di 50KB",
          desc: "Lo strumento imposta automaticamente l'obiettivo a esattamente 50KB. Il nostro algoritmo comprime la tua immagine con precisione per soddisfare i requisiti dei formulari online."
        },
        {
          title: "Scarica Comprimuto",
          desc: "Scarica la tua immagine compressa istantaneamente. Il file è garantito che sarà sotto 50KB e pronto per essere caricato su qualsiasi formulario online."
        }
      ]
    },
    scenes: [
      {
        title: "Portali di Curriculum",
        desc: "Comprimi foto profilo e scansioni di documenti per sistemi ATS e di reclutamento. Assicurati che i tuoi allegati di curriculum soddisfino i requisiti di dimensione file per elaborazione istantanea."
      },
      {
        title: "Ammissioni Universitarie",
        desc: "Ottimizza foto di identità e scansioni di documenti per portali di ammissione. Soddisfa rigorosi requisiti di 50KB per invii di applicazioni."
      },
      {
        title: "Candidature di Lavoro",
        desc: "Comprimi foto e documenti per candidature di lavoro online. Assicurati che i tuoi allegati soddisfino i limiti di dimensione file per invii riusciti."
      }
    ],
    comparison: {
      toolaze: "Uscita precisa di 50KB, Formato originale preservato, 100% elaborazione lato browser, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 immagini, Gratis per sempre",
      others: "Dimensioni file casuali possono superare 50KB, Conversione formato richiesta, Caricamenti server richiesti, Filigrane o degrado della qualità, Elaborazione batch limitata, Tariffe di abbonamento o pubblicità"
    },
    rating: {
      text: "\"Raggiunto perfettamente il segno di 50KB per la mia domanda universitaria. Niente più congetture!\" - Unisciti a migliaia di studenti e professionisti che si fidano di Toolaze per la conformità dei formulari online."
    },
    faq: [
      {
        q: "Quali formati di immagine sono supportati?",
        a: "Toolaze supporta formati JPG, JPEG, PNG, WebP e BMP. Il tuo file compresso sarà scaricato nel suo formato originale, garantendo massima compatibilità con qualsiasi formulario online o sistema di applicazione."
      },
      {
        q: "La compressione è davvero gratuita?",
        a: "Sì! Toolaze è 100% gratuito senza pubblicità, senza livelli premium e senza limiti sul numero di volte che lo usi. Tutta la compressione avviene localmente nel tuo browser, quindi non ci sono costi del server o tariffe di abbonamento."
      },
      {
        q: "Posso comprimere più immagini contemporaneamente?",
        a: "Sì! Toolaze supporta l'elaborazione batch di fino a 100 immagini contemporaneamente. Perfetto per elaborare più documenti o fotografie per invii di applicazioni in massa."
      },
      {
        q: "La mia immagine compressa sarà ancora accettata dai formulari online?",
        a: "Sì. Toolaze mantiene la qualità visiva necessaria per la verifica ufficiale mentre soddisfa il rigoroso requisito di dimensione file di 50KB. Le immagini compresse mantengono la chiarezza e leggibilità richieste dai formulari online e portali."
      },
      {
        q: "E se la mia immagine originale è già sotto 50KB?",
        a: "Se la tua immagine è già sotto 50KB, lo strumento la ottimizzerà ulteriormente per assicurarsi che soddisfi il requisito esatto preservando la qualità. L'algoritmo di compressione si concentra sulla rimozione di dati invisibili piuttosto che sulla riduzione della qualità visiva."
      },
      {
        q: "Funziona per foto di passaporto e documenti di identità?",
        a: "Sì, Toolaze può comprimere foto di passaporto e scansioni di documenti di identità a 50KB. Tuttavia, nota che alcune applicazioni possono avere requisiti di dimensione diversi (ad esempio, USCIS richiede 240KB). Controlla sempre i requisiti specifici della tua applicazione prima di comprimere."
      }
    ]
  },
  ja: {
    hero: {
      desc: "オンラインフォームやアプリケーション用に画像を正確に50KBに圧縮します。画像を下にドロップするだけで、数秒で圧縮できます。"
    },
    intro: {
      title: "なぜ画像を50KBに圧縮するのか？",
      content: [
        {
          title: "オンラインフォームの普遍的な標準",
          text: "50KBは、世界中のオンラインフォーム、アプリケーション、ポータルで最も一般的なファイルサイズ要件です。学校の入学から大学の申請、履歴書ポータル、求人応募、政府フォームまで、50KBは文書アップロードの普遍的なゲートウェイとなっています。スマートフォンで写真を撮ったり、文書をスキャンしたりすると、結果として得られる画像ファイルは2-10MBになることが多く、これらの制限を大幅に超えています。ファイルサイズの制限によるアップロードの失敗は、申請を遅らせ、時間を浪費し、イライラを引き起こす可能性があります。当社のブラウザベースの圧縮ツールは、インテリジェントなCanvas API処理を使用して、公式検証とプロフェッショナルなプレゼンテーションに必要な視覚品質を維持しながら、画像を正確に50KBに削減します。"
        },
        {
          title: "最大の互換性のために元の形式を維持",
          text: "異なるオンラインフォームは異なる画像形式を受け入れます—一部はJPGを要求し、他のものはPNGを受け入れ、一部はWebPを好みます。形式間の変換は、互換性の問題や品質の低下を引き起こす可能性があります。Toolazeは、元の形式をそのまま維持しながら画像を圧縮し、あらゆるシステムとの最大の互換性を保証します。5MBのJPGから始めても50MBのPNGから始めても、アルゴリズムはファイル形式を変更せずに圧縮を処理するため、圧縮された画像はあらゆるポータルやアプリケーションシステムでシームレスに機能します。すべての処理はブラウザでローカルに実行されるため、個人文書や写真が完全にプライベートで安全に保たれます。"
        }
      ]
    },
    features: {
      items: [
        {
          title: "正確な50KBターゲット",
          desc: "画像を正確に50KBに圧縮します。公式検証に必要な視覚品質を維持しながら、オンラインフォームの普遍的な要件を正確に満たします。"
        },
        {
          title: "100%プライベート処理",
          desc: "すべての圧縮はブラウザでローカルに実行されます。個人文書や写真がデバイスを離れることはなく、完全なプライバシーとセキュリティを保証します。"
        },
        {
          title: "一括処理",
          desc: "最大100枚の画像を同時に処理します。大量の文書処理や複数の申請提出に最適です。"
        },
        {
          title: "即座の圧縮",
          desc: "ブラウザネイティブのCanvas API処理により、サーバーアップロードや待機キューなしで即座に圧縮されます。文書をすぐに準備できます。"
        },
        {
          title: "永久無料",
          desc: "無制限の画像圧縮が完全無料—プレミアム階層なし、サブスクリプション料金なし、広告なし。すべてのユーザーに最適です。"
        },
        {
          title: "形式維持",
          desc: "元の画像形式（JPG、PNG、WebP、BMP）を維持します。オンラインフォームやアプリケーションシステムとの互換性を保ちます。"
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "入力形式",
          value: "JPG、PNG、WebP、BMP（すべての画像形式）"
        },
        {
          label: "出力形式",
          value: "元の形式を保持"
        },
        {
          label: "ファイルサイズ制限",
          value: "正確に50KB（普遍的なフォーム要件）"
        },
        {
          label: "解像度サポート",
          value: "最大4K（3840x2160）- サイズに自動調整"
        },
        {
          label: "一括処理",
          value: "セッションあたり最大100画像"
        },
        {
          label: "処理速度",
          value: "即座のブラウザ側圧縮"
        }
      ]
    },
    howToUse: {
      title: "画像を50KBに圧縮する方法",
      steps: [
        {
          title: "画像をアップロード",
          desc: "画像をドラッグ&ドロップするか、クリックして参照します。あらゆるソースからのJPG、PNG、WebP、BMP形式をサポートします。"
        },
        {
          title: "50KBターゲットを設定",
          desc: "ツールは自動的にターゲットを正確に50KBに設定します。アルゴリズムは、オンラインフォームの要件を満たすように画像を正確に圧縮します。"
        },
        {
          title: "圧縮された画像をダウンロード",
          desc: "圧縮された画像を即座にダウンロードします。ファイルは50KB未満であることが保証され、あらゆるオンラインフォームにアップロードする準備ができています。"
        }
      ]
    },
    scenes: [
      {
        title: "履歴書ポータル",
        desc: "ATSや採用システム用のプロフィール写真や文書スキャンを圧縮します。履歴書の添付ファイルが即座の処理のためにファイルサイズ要件を満たすようにします。"
      },
      {
        title: "大学入学",
        desc: "入学ポータル用のID写真や文書スキャンを最適化します。申請提出のための厳格な50KB要件を満たします。"
      },
      {
        title: "求人応募",
        desc: "オンライン求人応募用の写真や文書を圧縮します。添付ファイルが成功した提出のためにファイルサイズ制限を満たすようにします。"
      }
    ],
    comparison: {
      toolaze: "正確な50KB出力、元の形式を保持、100%ブラウザ側処理、透かしや品質損失なし、最大100画像の一括処理、永久無料",
      others: "ランダムなファイルサイズが50KBを超える可能性、形式変換が必要、サーバーアップロードが必要、透かしや品質劣化、制限された一括処理、サブスクリプション料金や広告"
    },
    rating: {
      text: "\"大学申請で50KBのマークを完璧に達成しました。もう推測する必要はありません！\" - オンラインフォームコンプライアンスのためにToolazeを信頼する何千人もの学生や専門家に参加してください。"
    },
    faq: [
      {
        q: "どの画像形式がサポートされていますか？",
        a: "ToolazeはJPG、JPEG、PNG、WebP、BMP形式をサポートしています。圧縮されたファイルは元の形式でダウンロードされ、あらゆるオンラインフォームやアプリケーションシステムとの最大の互換性を保証します。"
      },
      {
        q: "圧縮は本当に無料ですか？",
        a: "はい！Toolazeは100%無料で、広告なし、プレミアム層なし、使用回数の制限なしです。すべての圧縮はブラウザでローカルに実行されるため、サーバーコストやサブスクリプション料金はありません。"
      },
      {
        q: "複数の画像を一度に圧縮できますか？",
        a: "はい！Toolazeは最大100枚の画像を同時に一括処理できます。大量の申請提出のために複数の文書や写真を処理するのに最適です。"
      },
      {
        q: "圧縮された画像はオンラインフォームで受け入れられますか？",
        a: "はい。Toolazeは、厳格な50KBファイルサイズ要件を満たしながら、公式検証に必要な視覚品質を維持します。圧縮された画像は、オンラインフォームやポータルで必要な明瞭さと可読性を維持します。"
      },
      {
        q: "元の画像がすでに50KB未満の場合はどうなりますか？",
        a: "画像がすでに50KB未満の場合、ツールは品質を維持しながら正確な要件を満たすようにさらに最適化します。圧縮アルゴリズムは、視覚品質を低下させるのではなく、見えないデータを削除することに焦点を当てています。"
      },
      {
        q: "パスポート写真や身分証明書に使用できますか？",
        a: "はい、Toolazeはパスポート写真や身分証明書のスキャンを50KBに圧縮できます。ただし、一部のアプリケーションでは異なるサイズ要件がある場合があります（例：USCISは240KBを要求）。圧縮する前に、特定のアプリケーション要件を必ず確認してください。"
      }
    ]
  },
  ko: {
    hero: {
      desc: "온라인 양식 및 애플리케이션을 위해 이미지를 정확히 50KB로 압축합니다. 이미지를 아래에 드롭하기만 하면 몇 초 만에 압축할 수 있습니다."
    },
    intro: {
      title: "왜 이미지를 50KB로 압축해야 하나요?",
      content: [
        {
          title: "온라인 양식을 위한 보편적 표준",
          text: "50KB는 전 세계 온라인 양식, 애플리케이션 및 포털에서 가장 일반적인 파일 크기 요구사항입니다. 학교 입학 및 대학 지원부터 이력서 포털, 취업 지원 및 정부 양식까지, 50KB는 문서 업로드를 위한 보편적 게이트웨이가 되었습니다. 스마트폰으로 사진을 찍거나 문서를 스캔하면 결과 이미지 파일이 종종 2-10MB로 이러한 제한을 훨씬 초과합니다. 파일 크기 제한으로 인한 업로드 실패는 지원을 지연시키고 시간을 낭비하며 좌절감을 유발할 수 있습니다. 당사의 브라우저 기반 압축기는 지능형 Canvas API 처리를 사용하여 공식 검증 및 전문 프레젠테이션에 필요한 시각적 품질을 유지하면서 이미지를 정확히 50KB로 줄입니다."
        },
        {
          title: "최대 호환성을 위해 원본 형식 유지",
          text: "다양한 온라인 양식은 다양한 이미지 형식을 허용합니다—일부는 JPG를 요구하고, 다른 것들은 PNG를 허용하며, 일부는 WebP를 선호합니다. 형식 간 변환은 호환성 문제나 품질 손실을 일으킬 수 있습니다. Toolaze는 원본 형식을 그대로 유지하면서 이미지를 압축하여 모든 시스템과의 최대 호환성을 보장합니다. 5MB JPG로 시작하든 50MB PNG로 시작하든, 알고리즘은 파일 형식을 변경하지 않고 압축을 처리하므로 압축된 이미지는 모든 포털이나 애플리케이션 시스템에서 원활하게 작동합니다. 모든 처리는 브라우저에서 로컬로 수행되므로 개인 문서와 사진이 완전히 비공개이고 안전하게 유지됩니다."
        }
      ]
    },
    features: {
      items: [
        {
          title: "정확한 50KB 목표",
          desc: "이미지를 정확히 50KB로 압축합니다. 공식 검증에 필요한 시각적 품질을 유지하면서 온라인 양식의 보편적 요구사항을 정확히 충족합니다."
        },
        {
          title: "100% 비공개 처리",
          desc: "모든 압축은 브라우저에서 로컬로 수행됩니다. 개인 문서와 사진이 기기를 떠나지 않아 완전한 개인정보 보호와 보안을 보장합니다."
        },
        {
          title: "일괄 처리",
          desc: "최대 100개의 이미지를 동시에 처리합니다. 대량 문서 처리 및 여러 지원 제출에 완벽합니다."
        },
        {
          title: "즉시 압축",
          desc: "브라우저 네이티브 Canvas API 처리는 서버 업로드나 대기 큐 없이 즉시 압축을 보장합니다. 문서를 즉시 준비할 수 있습니다."
        },
        {
          title: "영구 무료",
          desc: "무제한 이미지 압축 완전 무료—프리미엄 계층 없음, 구독료 없음, 광고 없음. 모든 사용자에게 완벽합니다."
        },
        {
          title: "형식 유지",
          desc: "원본 이미지 형식(JPG, PNG, WebP, BMP)을 유지합니다. 모든 온라인 양식이나 애플리케이션 시스템과의 호환성을 유지합니다."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "입력 형식",
          value: "JPG, PNG, WebP, BMP (모든 이미지 형식)"
        },
        {
          label: "출력 형식",
          value: "원본 형식 유지"
        },
        {
          label: "파일 크기 제한",
          value: "정확히 50KB (보편적 양식 요구사항)"
        },
        {
          label: "해상도 지원",
          value: "최대 4K (3840x2160) - 크기에 자동 조정"
        },
        {
          label: "일괄 처리",
          value: "세션당 최대 100개 이미지"
        },
        {
          label: "처리 속도",
          value: "즉시 브라우저 측 압축"
        }
      ]
    },
    howToUse: {
      title: "이미지를 50KB로 압축하는 방법",
      steps: [
        {
          title: "이미지 업로드",
          desc: "이미지를 드래그 앤 드롭하거나 클릭하여 찾아봅니다. 모든 소스의 JPG, PNG, WebP 및 BMP 형식을 지원합니다."
        },
        {
          title: "50KB 목표 설정",
          desc: "도구는 자동으로 목표를 정확히 50KB로 설정합니다. 알고리즘은 온라인 양식 요구사항을 충족하도록 이미지를 정확하게 압축합니다."
        },
        {
          title: "압축된 이미지 다운로드",
          desc: "압축된 이미지를 즉시 다운로드합니다. 파일은 50KB 미만임이 보장되며 모든 온라인 양식에 업로드할 준비가 되어 있습니다."
        }
      ]
    },
    scenes: [
      {
        title: "이력서 포털",
        desc: "ATS 및 채용 시스템용 프로필 사진 및 문서 스캔을 압축합니다. 이력서 첨부 파일이 즉시 처리되도록 파일 크기 요구사항을 충족하는지 확인합니다."
      },
      {
        title: "대학 입학",
        desc: "입학 포털용 ID 사진 및 문서 스캔을 최적화합니다. 지원 제출을 위한 엄격한 50KB 요구사항을 충족합니다."
      },
      {
        title: "취업 지원",
        desc: "온라인 취업 지원용 사진 및 문서를 압축합니다. 첨부 파일이 성공적인 제출을 위해 파일 크기 제한을 충족하는지 확인합니다."
      }
    ],
    comparison: {
      toolaze: "정확한 50KB 출력, 원본 형식 유지, 100% 브라우저 측 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이미지 일괄 처리, 영구 무료",
      others: "랜덤 파일 크기가 50KB를 초과할 수 있음, 형식 변환 필요, 서버 업로드 필요, 워터마크 또는 품질 저하, 제한된 일괄 처리, 구독료 또는 광고"
    },
    rating: {
      text: "\"대학 지원에서 50KB 마크를 완벽하게 달성했습니다. 더 이상 추측할 필요가 없습니다!\" - 온라인 양식 준수를 위해 Toolaze를 신뢰하는 수천 명의 학생 및 전문가에 합류하세요."
    },
    faq: [
      {
        q: "어떤 이미지 형식이 지원되나요?",
        a: "Toolaze는 JPG, JPEG, PNG, WebP 및 BMP 형식을 지원합니다. 압축된 파일은 원본 형식으로 다운로드되어 모든 온라인 양식이나 애플리케이션 시스템과의 최대 호환성을 보장합니다."
      },
      {
        q: "압축이 정말 무료인가요?",
        a: "예! Toolaze는 100% 무료이며 광고 없음, 프리미엄 계층 없음, 사용 횟수 제한 없음입니다. 모든 압축은 브라우저에서 로컬로 수행되므로 서버 비용이나 구독료가 없습니다."
      },
      {
        q: "여러 이미지를 한 번에 압축할 수 있나요?",
        a: "예! Toolaze는 최대 100개의 이미지를 동시에 일괄 처리할 수 있습니다. 대량 지원 제출을 위해 여러 문서나 사진을 처리하는 데 완벽합니다."
      },
      {
        q: "압축된 이미지가 온라인 양식에서 여전히 허용되나요?",
        a: "예. Toolaze는 엄격한 50KB 파일 크기 요구사항을 충족하면서 공식 검증에 필요한 시각적 품질을 유지합니다. 압축된 이미지는 온라인 양식 및 포털에서 필요한 명확성과 가독성을 유지합니다."
      },
      {
        q: "원본 이미지가 이미 50KB 미만인 경우 어떻게 되나요?",
        a: "이미지가 이미 50KB 미만인 경우, 도구는 품질을 유지하면서 정확한 요구사항을 충족하도록 추가로 최적화합니다. 압축 알고리즘은 시각적 품질을 낮추는 대신 보이지 않는 데이터를 제거하는 데 중점을 둡니다."
      },
      {
        q: "여권 사진 및 신분증에 사용할 수 있나요?",
        a: "예, Toolaze는 여권 사진 및 신분증 스캔을 50KB로 압축할 수 있습니다. 그러나 일부 애플리케이션은 다른 크기 요구사항이 있을 수 있습니다(예: USCIS는 240KB를 요구). 압축하기 전에 항상 특정 애플리케이션 요구사항을 확인하세요."
      }
    ]
  },
  'zh-TW': {
    hero: {
      desc: "將圖片壓縮至 50KB，適用於線上表單和應用程式。只需將您的圖片拖放到下方即可在幾秒內完成壓縮。"
    },
    intro: {
      title: "為什麼要將圖片壓縮至 50KB？",
      content: [
        {
          title: "線上表單的通用標準",
          text: "50KB 是全球線上表單、應用程式和入口網站最常見的檔案大小要求。從學校入學和大學申請到履歷入口網站、求職申請和政府表單，50KB 已成為文件上傳的通用入口。當您使用智能手機拍照或掃描文件時，生成的圖片檔案通常為 2-10MB，遠遠超過這些限制。由於檔案大小限制導致的上傳失敗可能會延遲您的申請、浪費您的時間並造成挫折。我們的瀏覽器壓縮工具使用智能 Canvas API 處理來將您的圖片減少至 50KB，同時保持官方驗證和專業呈現所需的視覺品質。"
        },
        {
          title: "保持原始格式以實現最大相容性",
          text: "不同的線上表單接受不同的圖片格式—有些要求 JPG，有些接受 PNG，有些偏好 WebP。在格式之間轉換可能會導致相容性問題或品質損失。Toolaze 在保持原始格式不變的情況下壓縮您的圖片，確保與任何系統的最大相容性。無論您從 5MB 的 JPG 還是 50MB 的 PNG 開始，我們的演算法都會在不更改檔案格式的情況下處理壓縮，因此您的壓縮圖片可以與任何入口網站或應用程式系統無縫配合。所有處理都在您的瀏覽器中本地進行，確保您的個人文件和照片保持完全私密和安全。"
        }
      ]
    },
    features: {
      items: [
        {
          title: "精確的 50KB 目標",
          desc: "將圖片壓縮至 50KB。在保持官方驗證所需視覺品質的同時，精確滿足線上表單的通用要求。"
        },
        {
          title: "100% 私密處理",
          desc: "所有壓縮都在您的瀏覽器中本地進行。您的個人文件和照片永遠不會離開您的設備，確保完全的隱私和安全。"
        },
        {
          title: "批次處理",
          desc: "同時處理最多 100 張圖片。非常適合批量文件處理和多個申請提交。"
        },
        {
          title: "即時壓縮",
          desc: "瀏覽器原生 Canvas API 處理確保即時壓縮，無需伺服器上傳或等待隊列。立即準備您的文件。"
        },
        {
          title: "永久免費",
          desc: "無限圖片壓縮完全免費—無高級層級、無訂閱費用、無廣告。非常適合所有用戶。"
        },
        {
          title: "保留格式",
          desc: "保持原始圖片格式（JPG、PNG、WebP、BMP）。保持與任何線上表單或應用程式系統的相容性。"
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "輸入格式",
          value: "JPG、PNG、WebP、BMP（所有圖片格式）"
        },
        {
          label: "輸出格式",
          value: "保留原始格式"
        },
        {
          label: "檔案大小限制",
          value: "精確 50KB（通用表單要求）"
        },
        {
          label: "解析度支援",
          value: "最高 4K (3840x2160) - 自動調整大小"
        },
        {
          label: "批次處理",
          value: "每個會話最多 100 張圖片"
        },
        {
          label: "處理速度",
          value: "即時瀏覽器端壓縮"
        }
      ]
    },
    howToUse: {
      title: "如何將圖片壓縮至 50KB",
      steps: [
        {
          title: "上傳圖片",
          desc: "拖放您的圖片或點擊瀏覽。支援來自任何來源的 JPG、PNG、WebP 和 BMP 格式。"
        },
        {
          title: "設定 50KB 目標",
          desc: "工具會自動將目標設定為 50KB。我們的演算法精確壓縮您的圖片以滿足線上表單要求。"
        },
        {
          title: "下載壓縮後的圖片",
          desc: "立即下載您的壓縮圖片。檔案保證低於 50KB，並準備好上傳到任何線上表單。"
        }
      ]
    },
    scenes: [
      {
        title: "履歷入口網站",
        desc: "壓縮 ATS 和招聘系統的個人照片和文件掃描。確保您的履歷附件滿足檔案大小要求以實現即時處理。"
      },
      {
        title: "大學入學",
        desc: "優化入學入口網站的身份照片和文件掃描。滿足申請提交的嚴格 50KB 要求。"
      },
      {
        title: "求職申請",
        desc: "壓縮線上求職申請的照片和文件。確保您的附件滿足檔案大小限制以實現成功提交。"
      }
    ],
    comparison: {
      toolaze: "精確的 50KB 輸出、保留原始格式、100% 瀏覽器端處理、無水印或品質損失、批次處理最多 100 張圖片、永久免費",
      others: "隨機檔案大小可能超過 50KB、需要格式轉換、需要伺服器上傳、水印或品質下降、有限的批次處理、訂閱費用或廣告"
    },
    rating: {
      text: "\"為我的大學申請完美達到了 50KB 標記。不再需要猜測！\" - 加入數千名信賴 Toolaze 進行線上表單合規的學生和專業人士。"
    },
    faq: [
      {
        q: "支援哪些圖片格式？",
        a: "Toolaze 支援 JPG、JPEG、PNG、WebP 和 BMP 格式。您的壓縮檔案將以其原始格式下載，確保與任何線上表單或應用程式系統的最大相容性。"
      },
      {
        q: "壓縮真的免費嗎？",
        a: "是的！Toolaze 100% 免費，無廣告、無高級層級，且使用次數無限制。所有壓縮都在您的瀏覽器中本地進行，因此沒有伺服器成本或訂閱費用。"
      },
      {
        q: "我可以一次壓縮多張圖片嗎？",
        a: "是的！Toolaze 支援同時批次處理最多 100 張圖片。非常適合處理多個文件或照片以進行批量申請提交。"
      },
      {
        q: "我的壓縮圖片仍會被線上表單接受嗎？",
        a: "是的。Toolaze 在滿足嚴格的 50KB 檔案大小要求的同時，保持官方驗證所需的視覺品質。壓縮後的圖片保持線上表單和入口網站所需的清晰度和可讀性。"
      },
      {
        q: "如果我的原始圖片已經低於 50KB 怎麼辦？",
        a: "如果您的圖片已經低於 50KB，工具將進一步優化它以確保滿足確切要求，同時保持品質。壓縮演算法專注於移除不可見的數據而不是降低視覺品質。"
      },
      {
        q: "它適用於護照照片和身份證件嗎？",
        a: "是的，Toolaze 可以將護照照片和身份證件掃描壓縮至 50KB。但是，請注意某些應用程式可能有不同的大小要求（例如，USCIS 要求 240KB）。在壓縮之前，請務必檢查您的特定應用程式要求。"
      }
    ]
  }
}

// 深度合并函数
function deepMerge(target, source) {
  const output = { ...target }
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else if (Array.isArray(source[key])) {
        // 对于数组，直接替换
        output[key] = source[key]
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  
  return output
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

async function main() {
  const languages = ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-TW']
  
  for (const lang of languages) {
    const filePath = path.join(__dirname, '..', 'src', 'data', lang, 'image-compression.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (!data['image-to-50kb']) {
      console.log(`⚠️  ${lang}: image-to-50kb section not found`)
      continue
    }
    
    const translation = translations[lang]
    if (!translation) {
      console.log(`⚠️  ${lang}: translation not found`)
      continue
    }
    
    // 深度合并翻译
    data['image-to-50kb'] = deepMerge(data['image-to-50kb'], translation)
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ ${lang}: image-to-50kb fully translated`)
  }
  
  console.log('\n✨ All translations completed!')
}

main().catch(console.error)
