const fs = require('fs')
const path = require('path')

// 完整翻译映射
const translations = {
  de: {
    hero: {
      desc: "Optimieren Sie eBay-Listing-Bilder für schnelles mobiles Laden. Lassen Sie einfach Ihre Produktfotos unten fallen, um sie für bessere Suchrankings und schnellere Verkäufe zu komprimieren."
    },
    intro: {
      title: "Warum eBay-Bilder für Mobile optimieren?",
      content: [
        {
          title: "Mobile-First-Einkaufserfahrung",
          text: "Über 60% der eBay-Transaktionen finden auf mobilen Geräten statt. Wenn Ihre Listing-Bilder zu groß sind, laden sie langsam auf 4G-Netzwerken, was potenzielle Käufer dazu veranlasst, Ihre Listings zu verlassen, bevor sie Ihre Produkte überhaupt sehen. eBays Suchalgorithmus bevorzugt aktiv Listings, die schnell laden, was bedeutet, dass schneller ladende Bilder Ihr Suchranking verbessern und Ihre Verkaufschancen erhöhen können. Große Bilddateien frustrieren nicht nur mobile Käufer, sondern verschwenden auch ihre Datenpläne, was zu geringerem Engagement und weniger Conversions führt."
        },
        {
          title: "Suchrankings und Verkäufe steigern",
          text: "eBays Best-Match-Algorithmus berücksichtigt die Seitenladegeschwindigkeit als Ranking-Faktor. Durch Komprimieren Ihrer Listing-Bilder auf mobile-freundliche Größen (typischerweise 500KB-1.5MB) verbessern Sie die Leistungsmetriken Ihrer Listings und erhöhen die Sichtbarkeit in Suchergebnissen. Unser browserbasierter Kompressor verwendet intelligente Canvas API-Verarbeitung, um Dateigrößen zu reduzieren und dabei Produktdetails, Farbgenauigkeit und visuelle Attraktivität zu erhalten. Alle Verarbeitung erfolgt lokal in Ihrem Browser, sodass Ihre Produktfotos privat und sicher bleiben, ohne Wasserzeichen oder Qualitätsverschlechterung, die Ihren professionellen Verkäuferruf schädigen könnten."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Mobile-optimierte Größen",
          desc: "Komprimieren Sie Bilder auf 500KB-1.5MB für sofortiges mobiles Laden. Verbessern Sie Ihre eBay-Suchrankings und reduzieren Sie Käufer-Absprungraten bei langsamen Verbindungen."
        },
        {
          title: "100% Private Verarbeitung",
          desc: "Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre Produktfotos verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre und Sicherheit für Ihr Inventar."
        },
        {
          title: "Stapelverarbeitung",
          desc: "Verarbeiten Sie bis zu 100 Listing-Bilder gleichzeitig. Optimieren Sie gesamte Produktkataloge in einem Vorgang, perfekt für Power-Seller und Bulk-Listings."
        },
        {
          title: "Sofortige Optimierung",
          desc: "Browser-native Canvas API-Verarbeitung gewährleistet sofortige Komprimierung ohne Server-Uploads oder Warteschlangen. Bringen Sie Ihre Listings schneller live."
        },
        {
          title: "Für Immer Kostenlos",
          desc: "Unbegrenzte Bildoptimierung völlig kostenlos—keine Premium-Stufen, keine Abonnementgebühren, keine Werbung. Perfekt für Verkäufer aller Größen."
        },
        {
          title: "Qualität Erhalten",
          desc: "Behalten Sie Produktdetails und Farbgenauigkeit bei. Halten Sie Ihre Bilder scharf und professionell, während Sie die Dateigröße für schnelleres mobiles Laden reduzieren."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Eingabeformat",
          value: "JPG, PNG, WebP, BMP (Produkt-Listing-Bilder)"
        },
        {
          label: "Ausgabeformat",
          value: "JPG (Optimiert für eBay-Listings)"
        },
        {
          label: "Empfohlene Größe",
          value: "500KB - 1.5MB (Mobile-optimiert)"
        },
        {
          label: "Auflösungsunterstützung",
          value: "Bis zu 4K (3840x2160) - Abmessungen erhalten"
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
      title: "Wie man eBay-Bilder optimiert",
      steps: [
        {
          title: "Listing-Fotos hochladen",
          desc: "Ziehen Sie Ihre eBay-Produktbilder per Drag & Drop oder klicken Sie zum Durchsuchen. Unterstützt JPG-, PNG-, WebP- und BMP-Formate bis zu 4K-Auflösung."
        },
        {
          title: "Mobile-freundliche Größe festlegen",
          desc: "Setzen Sie Ihre Zielgröße auf 500KB-1.5MB für optimales mobiles Laden. Unser Algorithmus komprimiert Ihre Bilder und erhält dabei Produktdetails und Farbgenauigkeit."
        },
        {
          title: "Optimiertes herunterladen",
          desc: "Laden Sie Ihre optimierten Bilder sofort herunter. Dateien sind bereit zum Hochladen auf eBay und verbessern die Ladegeschwindigkeit Ihrer Listings und Suchrankings."
        }
      ]
    },
    scenes: [
      {
        title: "Power-Seller",
        desc: "Optimieren Sie Hunderte von Produktbildern für Bulk-Listings. Verarbeiten Sie gesamte Kataloge schnell und konsistent, um professionelle Qualität über alle Listings hinweg zu erhalten."
      },
      {
        title: "Mobile-First-Verkäufer",
        desc: "Stellen Sie sicher, dass Ihre Listings auf mobilen Geräten sofort laden. Verbessern Sie die Käufererfahrung und reduzieren Sie Absprungraten bei langsamen 4G-Verbindungen."
      },
      {
        title: "Gallery Plus Benutzer",
        desc: "Optimieren Sie hochauflösende Zoom-Bilder für eBay Gallery Plus. Halten Sie Bilder leicht genug, um sofort zu öffnen, während Sie Details für Nahaufnahmen erhalten."
      }
    ],
    comparison: {
      toolaze: "Mobile-optimierte Größen (500KB-1.5MB), Stapelverarbeitung bis zu 100 Bildern, 100% browser-seitige Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Erhält Produktdetails und Farben, Für immer kostenlos",
      others: "Zufällige Dateigrößen können zu groß sein, Begrenzte Stapelverarbeitung, Server-Uploads erforderlich, Wasserzeichen oder Qualitätsverschlechterung, Kann Bildqualität unnötig reduzieren, Abonnementgebühren oder Werbung"
    },
    rating: {
      text: "\"Meine eBay-Listings laden jetzt sofort auf Mobile! Suchrankings verbessert und Verkäufe gestiegen.\" - Schließen Sie sich Tausenden von eBay-Verkäufern an, die Toolaze für Mobile-First-Optimierung vertrauen."
    },
    faq: [
      {
        q: "Welche Dateigröße sollte ich für eBay-Listings verwenden?",
        a: "Für optimales mobiles Laden und Suchrankings komprimieren Sie Ihre eBay-Listing-Bilder auf 500KB-1.5MB. Dies gewährleistet schnelles Laden auf 4G-Netzwerken und behält gleichzeitig ausreichende Qualität für Käufer bei, um Produktdetails klar zu sehen."
      },
      {
        q: "Wird das Komprimieren von Bildern die Qualität meiner Produktfotos beeinträchtigen?",
        a: "Nein. Toolaze verwendet intelligente Komprimierungsalgorithmen, die Produktdetails, Farbgenauigkeit und visuelle Attraktivität erhalten. Die Komprimierung konzentriert sich darauf, unsichtbare Daten zu entfernen, anstatt die visuelle Qualität zu reduzieren, und stellt sicher, dass Ihre Listings professionell aussehen."
      },
      {
        q: "Kann ich mehrere Produktbilder gleichzeitig verarbeiten?",
        a: "Ja! Toolaze unterstützt die Stapelverarbeitung von bis zu 100 Bildern gleichzeitig. Perfekt für Power-Seller, die gesamte Produktkataloge oder Bulk-Listings effizient optimieren müssen."
      },
      {
        q: "Werden meine Produktfotos auf einen Server hochgeladen?",
        a: "Nein! Alle Komprimierung erfolgt lokal in Ihrem Browser mit JavaScript und Canvas API. Ihre Produktfotos verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre und Sicherheit für Ihr Inventar."
      },
      {
        q: "Verbessern optimierte Bilder meine eBay-Suchrankings?",
        a: "Ja. eBays Best-Match-Algorithmus berücksichtigt die Seitenladegeschwindigkeit als Ranking-Faktor. Schneller ladende Bilder können die Leistungsmetriken Ihrer Listings verbessern und die Sichtbarkeit in Suchergebnissen erhöhen, was möglicherweise zu mehr Verkäufen führt."
      },
      {
        q: "Welche Bildformate unterstützt eBay?",
        a: "eBay unterstützt JPG-, PNG- und GIF-Formate. Toolaze kann JPG-, PNG-, WebP- und BMP-Bilder komprimieren, wobei JPG aufgrund seiner kleineren Dateigröße und breiten Kompatibilität das empfohlene Format für eBay-Listings ist."
      }
    ]
  },
  es: {
    hero: {
      desc: "Optimiza imágenes de listados de eBay para carga móvil rápida. Simplemente suelta tus fotos de producto a continuación para comprimirlas y obtener mejores rankings de búsqueda y ventas más rápidas."
    },
    intro: {
      title: "¿Por qué optimizar imágenes de eBay para móvil?",
      content: [
        {
          title: "Experiencia de compra Mobile-First",
          text: "Más del 60% de las transacciones de eBay ocurren en dispositivos móviles. Cuando tus imágenes de listado son demasiado grandes, cargan lentamente en redes 4G, causando que compradores potenciales abandonen tus listados antes de ver tus productos. El algoritmo de búsqueda de eBay favorece activamente los listados que cargan rápidamente, lo que significa que imágenes de carga más rápida pueden mejorar tu ranking de búsqueda y aumentar tus posibilidades de hacer una venta. Los archivos de imagen grandes no solo frustran a los compradores móviles, sino que también desperdician sus planes de datos, lo que lleva a menor compromiso y menos conversiones."
        },
        {
          title: "Impulsa rankings de búsqueda y ventas",
          text: "El algoritmo Best Match de eBay considera la velocidad de carga de página como un factor de ranking. Al comprimir tus imágenes de listado a tamaños móviles (típicamente 500KB-1.5MB), mejoras las métricas de rendimiento de tus listados y aumentas la visibilidad en los resultados de búsqueda. Nuestro compresor basado en navegador utiliza procesamiento inteligente de Canvas API para reducir tamaños de archivo mientras preserva detalles del producto, precisión de color y atractivo visual. Todo el procesamiento ocurre localmente en tu navegador, asegurando que tus fotos de producto permanezcan privadas y seguras sin marcas de agua o degradación de calidad que puedan dañar tu reputación de vendedor profesional."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Tamaños Optimizados para Móvil",
          desc: "Comprime imágenes a 500KB-1.5MB para carga móvil instantánea. Mejora tus rankings de búsqueda de eBay y reduce las tasas de rebote de compradores en conexiones lentas."
        },
        {
          title: "Procesamiento 100% Privado",
          desc: "Toda la compresión ocurre localmente en tu navegador. Tus fotos de producto nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas para tu inventario."
        },
        {
          title: "Procesamiento por Lotes",
          desc: "Procesa hasta 100 imágenes de listado simultáneamente. Optimiza catálogos de productos completos en una operación, perfecto para vendedores profesionales y listados masivos."
        },
        {
          title: "Optimización Instantánea",
          desc: "El procesamiento nativo de Canvas API del navegador garantiza compresión instantánea sin cargas al servidor o colas de espera. Haz que tus listados estén activos más rápido."
        },
        {
          title: "Gratis Para Siempre",
          desc: "Optimización de imágenes ilimitada completamente gratuita—sin niveles premium, sin tarifas de suscripción, sin anuncios. Perfecto para vendedores de todos los tamaños."
        },
        {
          title: "Calidad Preservada",
          desc: "Mantén detalles del producto y precisión de color. Mantén tus imágenes nítidas y profesionales mientras reduces el tamaño del archivo para carga móvil más rápida."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato de Entrada",
          value: "JPG, PNG, WebP, BMP (Imágenes de listado de productos)"
        },
        {
          label: "Formato de Salida",
          value: "JPG (Optimizado para listados de eBay)"
        },
        {
          label: "Tamaño Recomendado",
          value: "500KB - 1.5MB (Optimizado para móvil)"
        },
        {
          label: "Soporte de Resolución",
          value: "Hasta 4K (3840x2160) - Dimensiones preservadas"
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
      title: "Cómo Optimizar Imágenes de eBay",
      steps: [
        {
          title: "Subir Fotos de Listado",
          desc: "Arrastra y suelta tus imágenes de producto de eBay o haz clic para navegar. Admite formatos JPG, PNG, WebP y BMP hasta resolución 4K."
        },
        {
          title: "Establecer Tamaño Móvil",
          desc: "Establece tu tamaño objetivo a 500KB-1.5MB para carga móvil óptima. Nuestro algoritmo comprime tus imágenes preservando detalles del producto y precisión de color."
        },
        {
          title: "Descargar Optimizado",
          desc: "Descarga tus imágenes optimizadas al instante. Los archivos están listos para subir a eBay, mejorando la velocidad de carga de tus listados y rankings de búsqueda."
        }
      ]
    },
    scenes: [
      {
        title: "Vendedores Profesionales",
        desc: "Optimiza cientos de imágenes de productos para listados masivos. Procesa catálogos completos rápida y consistentemente para mantener calidad profesional en todos los listados."
      },
      {
        title: "Vendedores Mobile-First",
        desc: "Asegura que tus listados carguen instantáneamente en dispositivos móviles. Mejora la experiencia del comprador y reduce las tasas de rebote en conexiones 4G lentas."
      },
      {
        title: "Usuarios de Gallery Plus",
        desc: "Optimiza imágenes de zoom de alta resolución para eBay Gallery Plus. Mantén las imágenes lo suficientemente ligeras para abrir instantáneamente mientras preservas detalles para vistas de primer plano."
      }
    ],
    comparison: {
      toolaze: "Tamaños optimizados para móvil (500KB-1.5MB), Procesamiento por lotes hasta 100 imágenes, 100% procesamiento del lado del navegador, Sin marcas de agua o pérdida de calidad, Preserva detalles del producto y colores, Gratis para siempre",
      others: "Los tamaños de archivo aleatorios pueden ser demasiado grandes, Procesamiento por lotes limitado, Se requieren cargas al servidor, Marcas de agua o degradación de calidad, Puede reducir la calidad de imagen innecesariamente, Tarifas de suscripción o anuncios"
    },
    rating: {
      text: "\"¡Mis listados de eBay cargan instantáneamente en móvil ahora! Rankings de búsqueda mejorados y ventas aumentadas.\" - Únete a miles de vendedores de eBay que confían en Toolaze para optimización mobile-first."
    },
    faq: [
      {
        q: "¿Qué tamaño de archivo debo usar para listados de eBay?",
        a: "Para carga móvil óptima y rankings de búsqueda, comprime tus imágenes de listado de eBay a 500KB-1.5MB. Esto asegura carga rápida en redes 4G mientras mantiene calidad suficiente para que los compradores vean detalles del producto claramente."
      },
      {
        q: "¿Comprimir imágenes dañará la calidad de mis fotos de producto?",
        a: "No. Toolaze usa algoritmos de compresión inteligentes que preservan detalles del producto, precisión de color y atractivo visual. La compresión se enfoca en eliminar datos invisibles en lugar de reducir la calidad visual, asegurando que tus listados se vean profesionales."
      },
      {
        q: "¿Puedo procesar múltiples imágenes de producto a la vez?",
        a: "¡Sí! Toolaze admite procesamiento por lotes de hasta 100 imágenes simultáneamente. Perfecto para vendedores profesionales que necesitan optimizar catálogos de productos completos o listados masivos eficientemente."
      },
      {
        q: "¿Se suben mis fotos de producto a un servidor?",
        a: "¡No! Toda la compresión ocurre localmente en tu navegador usando JavaScript y Canvas API. Tus fotos de producto nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas para tu inventario."
      },
      {
        q: "¿Las imágenes optimizadas mejorarán mis rankings de búsqueda de eBay?",
        a: "Sí. El algoritmo Best Match de eBay considera la velocidad de carga de página como un factor de ranking. Imágenes de carga más rápida pueden mejorar las métricas de rendimiento de tus listados y aumentar la visibilidad en resultados de búsqueda, potencialmente llevando a más ventas."
      },
      {
        q: "¿Qué formatos de imagen admite eBay?",
        a: "eBay admite formatos JPG, PNG y GIF. Toolaze puede comprimir imágenes JPG, PNG, WebP y BMP, siendo JPG el formato recomendado para listados de eBay debido a su menor tamaño de archivo y amplia compatibilidad."
      }
    ]
  },
  fr: {
    hero: {
      desc: "Optimisez les images de listage eBay pour un chargement mobile rapide. Déposez simplement vos photos de produit ci-dessous pour les comprimer et obtenir de meilleurs classements de recherche et des ventes plus rapides."
    },
    intro: {
      title: "Pourquoi optimiser les images eBay pour mobile?",
      content: [
        {
          title: "Expérience d'achat Mobile-First",
          text: "Plus de 60% des transactions eBay se produisent sur appareils mobiles. Lorsque vos images de listage sont trop volumineuses, elles chargent lentement sur les réseaux 4G, causant l'abandon de vos listages par les acheteurs potentiels avant même qu'ils voient vos produits. L'algorithme de recherche d'eBay favorise activement les listages qui chargent rapidement, ce qui signifie que des images à chargement plus rapide peuvent améliorer votre classement de recherche et augmenter vos chances de faire une vente. Les gros fichiers d'images frustrent non seulement les acheteurs mobiles, mais gaspillent également leurs forfaits de données, menant à un engagement réduit et moins de conversions."
        },
        {
          title: "Améliorer les classements de recherche et les ventes",
          text: "L'algorithme Best Match d'eBay considère la vitesse de chargement de page comme un facteur de classement. En compressant vos images de listage à des tailles adaptées au mobile (typiquement 500KB-1.5MB), vous améliorez les métriques de performance de vos listages et augmentez la visibilité dans les résultats de recherche. Notre compresseur basé sur navigateur utilise un traitement intelligent de Canvas API pour réduire les tailles de fichiers tout en préservant les détails du produit, la précision des couleurs et l'attrait visuel. Tout le traitement se fait localement dans votre navigateur, garantissant que vos photos de produit restent privées et sécurisées sans filigranes ou dégradation de qualité qui pourraient nuire à votre réputation de vendeur professionnel."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Tailles Optimisées pour Mobile",
          desc: "Compressez les images à 500KB-1.5MB pour un chargement mobile instantané. Améliorez vos classements de recherche eBay et réduisez les taux de rebond des acheteurs sur connexions lentes."
        },
        {
          title: "Traitement 100% Privé",
          desc: "Toute la compression se fait localement dans votre navigateur. Vos photos de produit ne quittent jamais votre appareil, garantissant une confidentialité et sécurité complètes pour votre inventaire."
        },
        {
          title: "Traitement par Lots",
          desc: "Traitez jusqu'à 100 images de listage simultanément. Optimisez des catalogues de produits entiers en une opération, parfait pour les vendeurs professionnels et les listages en masse."
        },
        {
          title: "Optimisation Instantanée",
          desc: "Le traitement natif Canvas API du navigateur garantit une compression instantanée sans téléchargements serveur ou files d'attente. Mettez vos listages en ligne plus rapidement."
        },
        {
          title: "Gratuit Pour Toujours",
          desc: "Optimisation d'images illimitée complètement gratuite—aucun niveau premium, aucun frais d'abonnement, aucune publicité. Parfait pour les vendeurs de toutes tailles."
        },
        {
          title: "Qualité Préservée",
          desc: "Maintenez les détails du produit et la précision des couleurs. Gardez vos images nettes et professionnelles tout en réduisant la taille du fichier pour un chargement mobile plus rapide."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Format d'Entrée",
          value: "JPG, PNG, WebP, BMP (Images de listage de produits)"
        },
        {
          label: "Format de Sortie",
          value: "JPG (Optimisé pour listages eBay)"
        },
        {
          label: "Taille Recommandée",
          value: "500KB - 1.5MB (Optimisé pour mobile)"
        },
        {
          label: "Support de Résolution",
          value: "Jusqu'à 4K (3840x2160) - Dimensions préservées"
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
      title: "Comment Optimiser les Images eBay",
      steps: [
        {
          title: "Télécharger les Photos de Listage",
          desc: "Glissez-déposez vos images de produit eBay ou cliquez pour parcourir. Prend en charge les formats JPG, PNG, WebP et BMP jusqu'à résolution 4K."
        },
        {
          title: "Définir la Taille Mobile",
          desc: "Définissez votre taille cible à 500KB-1.5MB pour un chargement mobile optimal. Notre algorithme compresse vos images tout en préservant les détails du produit et la précision des couleurs."
        },
        {
          title: "Télécharger Optimisé",
          desc: "Téléchargez vos images optimisées instantanément. Les fichiers sont prêts à être téléchargés sur eBay, améliorant la vitesse de chargement de vos listages et les classements de recherche."
        }
      ]
    },
    scenes: [
      {
        title: "Vendeurs Professionnels",
        desc: "Optimisez des centaines d'images de produits pour des listages en masse. Traitez des catalogues entiers rapidement et de manière cohérente pour maintenir une qualité professionnelle sur tous les listages."
      },
      {
        title: "Vendeurs Mobile-First",
        desc: "Assurez-vous que vos listages chargent instantanément sur appareils mobiles. Améliorez l'expérience de l'acheteur et réduisez les taux de rebond sur connexions 4G lentes."
      },
      {
        title: "Utilisateurs Gallery Plus",
        desc: "Optimisez les images de zoom haute résolution pour eBay Gallery Plus. Gardez les images suffisamment légères pour s'ouvrir instantanément tout en maintenant les détails pour les vues rapprochées."
      }
    ],
    comparison: {
      toolaze: "Tailles optimisées pour mobile (500KB-1.5MB), Traitement par lots jusqu'à 100 images, 100% traitement côté navigateur, Aucune filigrane ou perte de qualité, Préserve détails du produit et couleurs, Gratuit pour toujours",
      others: "Les tailles de fichier aléatoires peuvent être trop grandes, Traitement par lots limité, Téléchargements serveur requis, Filigranes ou dégradation de qualité, Peut réduire la qualité d'image inutilement, Frais d'abonnement ou publicités"
    },
    rating: {
      text: "\"Mes listages eBay chargent instantanément sur mobile maintenant! Classements de recherche améliorés et ventes augmentées.\" - Rejoignez des milliers de vendeurs eBay qui font confiance à Toolaze pour l'optimisation mobile-first."
    },
    faq: [
      {
        q: "Quelle taille de fichier dois-je utiliser pour les listages eBay?",
        a: "Pour un chargement mobile optimal et des classements de recherche, compressez vos images de listage eBay à 500KB-1.5MB. Cela assure un chargement rapide sur les réseaux 4G tout en maintenant une qualité suffisante pour que les acheteurs voient clairement les détails du produit."
      },
      {
        q: "Compresser les images nuira-t-il à la qualité de mes photos de produit?",
        a: "Non. Toolaze utilise des algorithmes de compression intelligents qui préservent les détails du produit, la précision des couleurs et l'attrait visuel. La compression se concentre sur l'élimination des données invisibles plutôt que sur la réduction de la qualité visuelle, garantissant que vos listages ont l'air professionnels."
      },
      {
        q: "Puis-je traiter plusieurs images de produit à la fois?",
        a: "Oui! Toolaze prend en charge le traitement par lots de jusqu'à 100 images simultanément. Parfait pour les vendeurs professionnels qui doivent optimiser des catalogues de produits entiers ou des listages en masse efficacement."
      },
      {
        q: "Mes photos de produit sont-elles téléchargées sur un serveur?",
        a: "Non! Toute la compression se fait localement dans votre navigateur en utilisant JavaScript et Canvas API. Vos photos de produit ne quittent jamais votre appareil, garantissant une confidentialité et sécurité complètes pour votre inventaire."
      },
      {
        q: "Les images optimisées amélioreront-elles mes classements de recherche eBay?",
        a: "Oui. L'algorithme Best Match d'eBay considère la vitesse de chargement de page comme un facteur de classement. Les images à chargement plus rapide peuvent améliorer les métriques de performance de vos listages et augmenter la visibilité dans les résultats de recherche, menant potentiellement à plus de ventes."
      },
      {
        q: "Quels formats d'image eBay prend-il en charge?",
        a: "eBay prend en charge les formats JPG, PNG et GIF. Toolaze peut comprimer les images JPG, PNG, WebP et BMP, JPG étant le format recommandé pour les listages eBay en raison de sa taille de fichier plus petite et de sa large compatibilité."
      }
    ]
  },
  pt: {
    hero: {
      desc: "Otimize imagens de listagens do eBay para carregamento móvel rápido. Simplesmente solte suas fotos de produto abaixo para comprimi-las para melhores rankings de pesquisa e vendas mais rápidas."
    },
    intro: {
      title: "Por que otimizar imagens do eBay para móvel?",
      content: [
        {
          title: "Experiência de compra Mobile-First",
          text: "Mais de 60% das transações do eBay acontecem em dispositivos móveis. Quando suas imagens de listagem são muito grandes, carregam lentamente em redes 4G, causando que compradores potenciais abandonem suas listagens antes mesmo de verem seus produtos. O algoritmo de pesquisa do eBay favorece ativamente listagens que carregam rapidamente, o que significa que imagens de carregamento mais rápido podem melhorar seu ranking de pesquisa e aumentar suas chances de fazer uma venda. Arquivos de imagem grandes não apenas frustram compradores móveis, mas também desperdiçam seus planos de dados, levando a menor engajamento e menos conversões."
        },
        {
          title: "Impulsione rankings de pesquisa e vendas",
          text: "O algoritmo Best Match do eBay considera a velocidade de carregamento de página como um fator de ranking. Ao comprimir suas imagens de listagem para tamanhos móveis (tipicamente 500KB-1.5MB), você melhora as métricas de desempenho de suas listagens e aumenta a visibilidade nos resultados de pesquisa. Nosso compressor baseado em navegador usa processamento inteligente de Canvas API para reduzir tamanhos de arquivo enquanto preserva detalhes do produto, precisão de cor e apelo visual. Todo o processamento acontece localmente em seu navegador, garantindo que suas fotos de produto permaneçam privadas e seguras sem marcas d'água ou degradação de qualidade que possam prejudicar sua reputação de vendedor profissional."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Tamanhos Otimizados para Móvel",
          desc: "Comprima imagens para 500KB-1.5MB para carregamento móvel instantâneo. Melhore seus rankings de pesquisa do eBay e reduza taxas de rejeição de compradores em conexões lentas."
        },
        {
          title: "Processamento 100% Privado",
          desc: "Toda a compressão acontece localmente em seu navegador. Suas fotos de produto nunca deixam seu dispositivo, garantindo privacidade e segurança completas para seu inventário."
        },
        {
          title: "Processamento em Lote",
          desc: "Processe até 100 imagens de listagem simultaneamente. Otimize catálogos de produtos inteiros em uma operação, perfeito para vendedores profissionais e listagens em massa."
        },
        {
          title: "Otimização Instantânea",
          desc: "O processamento nativo de Canvas API do navegador garante compressão instantânea sem uploads de servidor ou filas de espera. Coloque suas listagens online mais rapidamente."
        },
        {
          title: "Grátis Para Sempre",
          desc: "Otimização de imagens ilimitada completamente gratuita—sem níveis premium, sem taxas de assinatura, sem anúncios. Perfeito para vendedores de todos os tamanhos."
        },
        {
          title: "Qualidade Preservada",
          desc: "Mantenha detalhes do produto e precisão de cor. Mantenha suas imagens nítidas e profissionais enquanto reduz o tamanho do arquivo para carregamento móvel mais rápido."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato de Entrada",
          value: "JPG, PNG, WebP, BMP (Imagens de listagem de produtos)"
        },
        {
          label: "Formato de Saída",
          value: "JPG (Otimizado para listagens do eBay)"
        },
        {
          label: "Tamanho Recomendado",
          value: "500KB - 1.5MB (Otimizado para móvel)"
        },
        {
          label: "Suporte de Resolução",
          value: "Até 4K (3840x2160) - Dimensões preservadas"
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
      title: "Como Otimizar Imagens do eBay",
      steps: [
        {
          title: "Enviar Fotos de Listagem",
          desc: "Arraste e solte suas imagens de produto do eBay ou clique para navegar. Suporta formatos JPG, PNG, WebP e BMP até resolução 4K."
        },
        {
          title: "Definir Tamanho Móvel",
          desc: "Defina seu tamanho alvo para 500KB-1.5MB para carregamento móvel ótimo. Nosso algoritmo comprime suas imagens preservando detalhes do produto e precisão de cor."
        },
        {
          title: "Baixar Otimizado",
          desc: "Baixe suas imagens otimizadas instantaneamente. Os arquivos estão prontos para enviar ao eBay, melhorando a velocidade de carregamento de suas listagens e rankings de pesquisa."
        }
      ]
    },
    scenes: [
      {
        title: "Vendedores Profissionais",
        desc: "Otimize centenas de imagens de produtos para listagens em massa. Processe catálogos inteiros rápida e consistentemente para manter qualidade profissional em todas as listagens."
      },
      {
        title: "Vendedores Mobile-First",
        desc: "Garanta que suas listagens carreguem instantaneamente em dispositivos móveis. Melhore a experiência do comprador e reduza taxas de rejeição em conexões 4G lentas."
      },
      {
        title: "Usuários do Gallery Plus",
        desc: "Otimize imagens de zoom de alta resolução para eBay Gallery Plus. Mantenha imagens leves o suficiente para abrir instantaneamente enquanto preserva detalhes para visualizações de close-up."
      }
    ],
    comparison: {
      toolaze: "Tamanhos otimizados para móvel (500KB-1.5MB), Processamento em lote até 100 imagens, 100% processamento do lado do navegador, Sem marcas d'água ou perda de qualidade, Preserva detalhes do produto e cores, Grátis para sempre",
      others: "Tamanhos de arquivo aleatórios podem ser muito grandes, Processamento em lote limitado, Uploads de servidor necessários, Marcas d'água ou degradação de qualidade, Pode reduzir qualidade de imagem desnecessariamente, Taxas de assinatura ou anúncios"
    },
    rating: {
      text: "\"Minhas listagens do eBay carregam instantaneamente no móvel agora! Rankings de pesquisa melhorados e vendas aumentadas.\" - Junte-se a milhares de vendedores do eBay que confiam no Toolaze para otimização mobile-first."
    },
    faq: [
      {
        q: "Qual tamanho de arquivo devo usar para listagens do eBay?",
        a: "Para carregamento móvel ótimo e rankings de pesquisa, comprima suas imagens de listagem do eBay para 500KB-1.5MB. Isso garante carregamento rápido em redes 4G enquanto mantém qualidade suficiente para compradores verem detalhes do produto claramente."
      },
      {
        q: "Comprimir imagens prejudicará a qualidade das minhas fotos de produto?",
        a: "Não. Toolaze usa algoritmos de compressão inteligentes que preservam detalhes do produto, precisão de cor e apelo visual. A compressão se concentra em remover dados invisíveis em vez de reduzir qualidade visual, garantindo que suas listagens pareçam profissionais."
      },
      {
        q: "Posso processar múltiplas imagens de produto de uma vez?",
        a: "Sim! Toolaze suporta processamento em lote de até 100 imagens simultaneamente. Perfeito para vendedores profissionais que precisam otimizar catálogos de produtos inteiros ou listagens em massa eficientemente."
      },
      {
        q: "Minhas fotos de produto são enviadas para um servidor?",
        a: "Não! Toda a compressão acontece localmente em seu navegador usando JavaScript e Canvas API. Suas fotos de produto nunca deixam seu dispositivo, garantindo privacidade e segurança completas para seu inventário."
      },
      {
        q: "Imagens otimizadas melhorarão meus rankings de pesquisa do eBay?",
        a: "Sim. O algoritmo Best Match do eBay considera a velocidade de carregamento de página como um fator de ranking. Imagens de carregamento mais rápido podem melhorar as métricas de desempenho de suas listagens e aumentar a visibilidade nos resultados de pesquisa, potencialmente levando a mais vendas."
      },
      {
        q: "Quais formatos de imagem o eBay suporta?",
        a: "O eBay suporta formatos JPG, PNG e GIF. Toolaze pode comprimir imagens JPG, PNG, WebP e BMP, sendo JPG o formato recomendado para listagens do eBay devido ao seu menor tamanho de arquivo e ampla compatibilidade."
      }
    ]
  },
  it: {
    hero: {
      desc: "Ottimizza le immagini degli annunci eBay per un caricamento mobile rapido. Basta rilasciare le tue foto di prodotto qui sotto per comprimerle e ottenere migliori classifiche di ricerca e vendite più veloci."
    },
    intro: {
      title: "Perché ottimizzare le immagini eBay per mobile?",
      content: [
        {
          title: "Esperienza di acquisto Mobile-First",
          text: "Oltre il 60% delle transazioni eBay avviene su dispositivi mobili. Quando le tue immagini di annuncio sono troppo grandi, caricano lentamente sulle reti 4G, causando che potenziali acquirenti abbandonino i tuoi annunci prima ancora di vedere i tuoi prodotti. L'algoritmo di ricerca di eBay favorisce attivamente gli annunci che caricano rapidamente, il che significa che immagini a caricamento più veloce possono migliorare la tua classifica di ricerca e aumentare le tue possibilità di fare una vendita. I file di immagine grandi non solo frustrano gli acquirenti mobili, ma sprecano anche i loro piani dati, portando a un impegno inferiore e meno conversioni."
        },
        {
          title: "Migliora classifiche di ricerca e vendite",
          text: "L'algoritmo Best Match di eBay considera la velocità di caricamento della pagina come un fattore di classifica. Comprimendo le tue immagini di annuncio a dimensioni mobile-friendly (tipicamente 500KB-1.5MB), migliori le metriche di prestazione dei tuoi annunci e aumenti la visibilità nei risultati di ricerca. Il nostro compressore basato su browser utilizza l'elaborazione intelligente di Canvas API per ridurre le dimensioni dei file preservando dettagli del prodotto, precisione del colore e appeal visivo. Tutta l'elaborazione avviene localmente nel tuo browser, garantendo che le tue foto di prodotto rimangano private e sicure senza filigrane o degrado della qualità che potrebbero danneggiare la tua reputazione di venditore professionale."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Dimensioni Ottimizzate per Mobile",
          desc: "Comprimi immagini a 500KB-1.5MB per caricamento mobile istantaneo. Migliora le tue classifiche di ricerca eBay e riduci i tassi di rimbalzo degli acquirenti su connessioni lente."
        },
        {
          title: "Elaborazione 100% Privata",
          desc: "Tutta la compressione avviene localmente nel tuo browser. Le tue foto di prodotto non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete per il tuo inventario."
        },
        {
          title: "Elaborazione Batch",
          desc: "Elabora fino a 100 immagini di annunci contemporaneamente. Ottimizza interi cataloghi di prodotti in un'operazione, perfetto per venditori professionali e annunci in blocco."
        },
        {
          title: "Ottimizzazione Istantanea",
          desc: "L'elaborazione nativa Canvas API del browser garantisce compressione istantanea senza caricamenti sul server o code di attesa. Metti i tuoi annunci online più velocemente."
        },
        {
          title: "Gratis Per Sempre",
          desc: "Ottimizzazione immagini illimitata completamente gratuita—nessun livello premium, nessuna tariffa di abbonamento, nessuna pubblicità. Perfetto per venditori di tutte le dimensioni."
        },
        {
          title: "Qualità Preservata",
          desc: "Mantieni dettagli del prodotto e precisione del colore. Mantieni le tue immagini nitide e professionali mentre riduci la dimensione del file per un caricamento mobile più veloce."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato di Input",
          value: "JPG, PNG, WebP, BMP (Immagini di annunci prodotti)"
        },
        {
          label: "Formato di Output",
          value: "JPG (Ottimizzato per annunci eBay)"
        },
        {
          label: "Dimensione Consigliata",
          value: "500KB - 1.5MB (Ottimizzato per mobile)"
        },
        {
          label: "Supporto Risoluzione",
          value: "Fino a 4K (3840x2160) - Dimensioni preservate"
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
      title: "Come Ottimizzare le Immagini eBay",
      steps: [
        {
          title: "Carica Foto di Annunci",
          desc: "Trascina e rilascia le tue immagini di prodotto eBay o fai clic per sfogliare. Supporta formati JPG, PNG, WebP e BMP fino a risoluzione 4K."
        },
        {
          title: "Imposta Dimensione Mobile",
          desc: "Imposta la tua dimensione obiettivo a 500KB-1.5MB per caricamento mobile ottimale. Il nostro algoritmo comprime le tue immagini preservando dettagli del prodotto e precisione del colore."
        },
        {
          title: "Scarica Ottimizzato",
          desc: "Scarica le tue immagini ottimizzate istantaneamente. I file sono pronti per essere caricati su eBay, migliorando la velocità di caricamento dei tuoi annunci e le classifiche di ricerca."
        }
      ]
    },
    scenes: [
      {
        title: "Venditori Professionali",
        desc: "Ottimizza centinaia di immagini di prodotti per annunci in blocco. Elabora interi cataloghi rapidamente e consistentemente per mantenere qualità professionale su tutti gli annunci."
      },
      {
        title: "Venditori Mobile-First",
        desc: "Assicurati che i tuoi annunci carichino istantaneamente su dispositivi mobili. Migliora l'esperienza dell'acquirente e riduci i tassi di rimbalzo su connessioni 4G lente."
      },
      {
        title: "Utenti Gallery Plus",
        desc: "Ottimizza immagini di zoom ad alta risoluzione per eBay Gallery Plus. Mantieni immagini abbastanza leggere da aprire istantaneamente preservando dettagli per viste ravvicinate."
      }
    ],
    comparison: {
      toolaze: "Dimensioni ottimizzate per mobile (500KB-1.5MB), Elaborazione batch fino a 100 immagini, 100% elaborazione lato browser, Nessuna filigrana o perdita di qualità, Preserva dettagli del prodotto e colori, Gratis per sempre",
      others: "Dimensioni file casuali possono essere troppo grandi, Elaborazione batch limitata, Caricamenti server richiesti, Filigrane o degrado della qualità, Può ridurre qualità immagine inutilmente, Tariffe di abbonamento o pubblicità"
    },
    rating: {
      text: "\"I miei annunci eBay caricano istantaneamente su mobile ora! Classifiche di ricerca migliorate e vendite aumentate.\" - Unisciti a migliaia di venditori eBay che si fidano di Toolaze per l'ottimizzazione mobile-first."
    },
    faq: [
      {
        q: "Quale dimensione di file devo usare per annunci eBay?",
        a: "Per caricamento mobile ottimale e classifiche di ricerca, comprimi le tue immagini di annunci eBay a 500KB-1.5MB. Questo assicura caricamento rapido su reti 4G mantenendo qualità sufficiente per gli acquirenti di vedere dettagli del prodotto chiaramente."
      },
      {
        q: "Comprimere immagini danneggerà la qualità delle mie foto di prodotto?",
        a: "No. Toolaze usa algoritmi di compressione intelligenti che preservano dettagli del prodotto, precisione del colore e appeal visivo. La compressione si concentra sulla rimozione di dati invisibili piuttosto che sulla riduzione della qualità visiva, garantendo che i tuoi annunci sembrino professionali."
      },
      {
        q: "Posso elaborare più immagini di prodotto contemporaneamente?",
        a: "Sì! Toolaze supporta l'elaborazione batch di fino a 100 immagini contemporaneamente. Perfetto per venditori professionali che devono ottimizzare interi cataloghi di prodotti o annunci in blocco efficientemente."
      },
      {
        q: "Le mie foto di prodotto vengono caricate su un server?",
        a: "No! Tutta la compressione avviene localmente nel tuo browser utilizzando JavaScript e Canvas API. Le tue foto di prodotto non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete per il tuo inventario."
      },
      {
        q: "Le immagini ottimizzate miglioreranno le mie classifiche di ricerca eBay?",
        a: "Sì. L'algoritmo Best Match di eBay considera la velocità di caricamento della pagina come un fattore di classifica. Immagini a caricamento più veloce possono migliorare le metriche di prestazione dei tuoi annunci e aumentare la visibilità nei risultati di ricerca, portando potenzialmente a più vendite."
      },
      {
        q: "Quali formati di immagine supporta eBay?",
        a: "eBay supporta formati JPG, PNG e GIF. Toolaze può comprimere immagini JPG, PNG, WebP e BMP, con JPG essendo il formato raccomandato per annunci eBay a causa della sua dimensione file più piccola e ampia compatibilità."
      }
    ]
  },
  ja: {
    hero: {
      desc: "eBayの出品画像を高速モバイル読み込み用に最適化します。製品写真を下にドロップするだけで、検索ランキングと売上を向上させるために圧縮できます。"
    },
    intro: {
      title: "なぜeBay画像をモバイル用に最適化するのか？",
      content: [
        {
          title: "モバイルファーストのショッピング体験",
          text: "eBayの取引の60%以上がモバイルデバイスで行われています。出品画像が大きすぎると、4Gネットワークで読み込みが遅くなり、潜在的な買い手が製品を見る前に出品を離れてしまいます。eBayの検索アルゴリズムは、読み込みが速い出品を積極的に優先するため、読み込みが速い画像は検索ランキングを改善し、売上の可能性を高めることができます。大きな画像ファイルは、モバイル買い手をイライラさせるだけでなく、データプランを無駄にし、エンゲージメントの低下とコンバージョンの減少につながります。"
        },
        {
          title: "検索ランキングと売上を向上",
          text: "eBayのBest Matchアルゴリズムは、ページ読み込み速度をランキング要因として考慮します。出品画像をモバイル対応サイズ（通常500KB-1.5MB）に圧縮することで、出品のパフォーマンス指標を改善し、検索結果での可視性を高めます。当社のブラウザベースの圧縮ツールは、インテリジェントなCanvas API処理を使用して、製品の詳細、色の精度、視覚的魅力を保持しながらファイルサイズを削減します。すべての処理はブラウザでローカルに実行されるため、製品写真はプライベートで安全に保たれ、プロの販売者の評判を損なう可能性のある透かしや品質劣化はありません。"
        }
      ]
    },
    features: {
      items: [
        {
          title: "モバイル最適化サイズ",
          desc: "画像を500KB-1.5MBに圧縮して、即座のモバイル読み込みを実現します。eBayの検索ランキングを改善し、遅い接続での買い手の離脱率を減らします。"
        },
        {
          title: "100%プライベート処理",
          desc: "すべての圧縮はブラウザでローカルに実行されます。製品写真がデバイスを離れることはなく、在庫の完全なプライバシーとセキュリティを保証します。"
        },
        {
          title: "一括処理",
          desc: "最大100枚の出品画像を同時に処理します。1回の操作で製品カタログ全体を最適化し、プロの販売者や一括出品に最適です。"
        },
        {
          title: "即座の最適化",
          desc: "ブラウザネイティブのCanvas API処理により、サーバーアップロードや待機キューなしで即座の圧縮が保証されます。出品をより迅速に公開できます。"
        },
        {
          title: "永久無料",
          desc: "無制限の画像最適化が完全無料—プレミアム層なし、サブスクリプション料金なし、広告なし。あらゆる規模の販売者に最適です。"
        },
        {
          title: "品質維持",
          desc: "製品の詳細と色の精度を維持します。モバイル読み込みを高速化するためにファイルサイズを削減しながら、画像を鮮明でプロフェッショナルに保ちます。"
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "入力形式",
          value: "JPG、PNG、WebP、BMP（製品出品画像）"
        },
        {
          label: "出力形式",
          value: "JPG（eBay出品用に最適化）"
        },
        {
          label: "推奨サイズ",
          value: "500KB - 1.5MB（モバイル最適化）"
        },
        {
          label: "解像度サポート",
          value: "最大4K（3840x2160）- 寸法を保持"
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
      title: "eBay画像を最適化する方法",
      steps: [
        {
          title: "出品写真をアップロード",
          desc: "eBayの製品画像をドラッグ&ドロップするか、クリックして参照します。最大4K解像度のJPG、PNG、WebP、BMP形式をサポートします。"
        },
        {
          title: "モバイル対応サイズを設定",
          desc: "最適なモバイル読み込みのために、ターゲットサイズを500KB-1.5MBに設定します。アルゴリズムは製品の詳細と色の精度を保持しながら画像を圧縮します。"
        },
        {
          title: "最適化された画像をダウンロード",
          desc: "最適化された画像を即座にダウンロードします。ファイルはeBayにアップロードする準備ができており、出品の読み込み速度と検索ランキングを改善します。"
        }
      ]
    },
    scenes: [
      {
        title: "プロの販売者",
        desc: "一括出品用に数百枚の製品画像を最適化します。すべての出品でプロフェッショナルな品質を維持するために、カタログ全体を迅速かつ一貫して処理します。"
      },
      {
        title: "モバイルファースト販売者",
        desc: "出品がモバイルデバイスで即座に読み込まれるようにします。遅い4G接続での買い手の体験を改善し、離脱率を減らします。"
      },
      {
        title: "Gallery Plusユーザー",
        desc: "eBay Gallery Plus用の高解像度ズーム画像を最適化します。クローズアップビューの詳細を維持しながら、即座に開けるように画像を軽く保ちます。"
      }
    ],
    comparison: {
      toolaze: "モバイル最適化サイズ（500KB-1.5MB）、最大100画像の一括処理、100%ブラウザ側処理、透かしや品質損失なし、製品の詳細と色を保持、永久無料",
      others: "ランダムなファイルサイズが大きすぎる可能性、制限された一括処理、サーバーアップロードが必要、透かしや品質劣化、不必要に画像品質を低下させる可能性、サブスクリプション料金や広告"
    },
    rating: {
      text: "\"eBayの出品がモバイルで即座に読み込まれるようになりました！検索ランキングが改善し、売上が増加しました。\" - モバイルファースト最適化のためにToolazeを信頼する何千人ものeBay販売者に参加してください。"
    },
    faq: [
      {
        q: "eBay出品にはどのファイルサイズを使用すべきですか？",
        a: "最適なモバイル読み込みと検索ランキングのために、eBay出品画像を500KB-1.5MBに圧縮してください。これにより、4Gネットワークでの高速読み込みが保証され、買い手が製品の詳細を明確に見るのに十分な品質が維持されます。"
      },
      {
        q: "画像を圧縮すると製品写真の品質が損なわれますか？",
        a: "いいえ。Toolazeは、製品の詳細、色の精度、視覚的魅力を保持するインテリジェントな圧縮アルゴリズムを使用します。圧縮は視覚品質を低下させるのではなく、見えないデータを削除することに焦点を当てており、出品がプロフェッショナルに見えるようにします。"
      },
      {
        q: "複数の製品画像を一度に処理できますか？",
        a: "はい！Toolazeは最大100枚の画像を同時に一括処理できます。製品カタログ全体または一括出品を効率的に最適化する必要があるプロの販売者に最適です。"
      },
      {
        q: "製品写真はサーバーにアップロードされますか？",
        a: "いいえ！すべての圧縮はJavaScriptとCanvas APIを使用してブラウザでローカルに実行されます。製品写真がデバイスを離れることはなく、在庫の完全なプライバシーとセキュリティを保証します。"
      },
      {
        q: "最適化された画像はeBayの検索ランキングを改善しますか？",
        a: "はい。eBayのBest Matchアルゴリズムは、ページ読み込み速度をランキング要因として考慮します。読み込みが速い画像は、出品のパフォーマンス指標を改善し、検索結果での可視性を高め、より多くの売上につながる可能性があります。"
      },
      {
        q: "eBayはどの画像形式をサポートしていますか？",
        a: "eBayはJPG、PNG、GIF形式をサポートしています。ToolazeはJPG、PNG、WebP、BMP画像を圧縮でき、ファイルサイズが小さく互換性が広いため、eBay出品にはJPGが推奨形式です。"
      }
    ]
  },
  ko: {
    hero: {
      desc: "빠른 모바일 로딩을 위해 eBay 리스팅 이미지를 최적화합니다. 제품 사진을 아래에 드롭하기만 하면 검색 순위와 판매를 개선하기 위해 압축할 수 있습니다."
    },
    intro: {
      title: "왜 eBay 이미지를 모바일용으로 최적화해야 하나요?",
      content: [
        {
          title: "모바일 우선 쇼핑 경험",
          text: "eBay 거래의 60% 이상이 모바일 기기에서 발생합니다. 리스팅 이미지가 너무 크면 4G 네트워크에서 느리게 로드되어 잠재 구매자가 제품을 보기 전에 리스팅을 포기하게 됩니다. eBay의 검색 알고리즘은 빠르게 로드되는 리스팅을 적극적으로 선호하므로, 더 빠르게 로드되는 이미지는 검색 순위를 개선하고 판매 가능성을 높일 수 있습니다. 큰 이미지 파일은 모바일 구매자를 좌절시킬 뿐만 아니라 데이터 요금제를 낭비하여 참여도 감소와 전환율 감소로 이어집니다."
        },
        {
          title: "검색 순위 및 판매 향상",
          text: "eBay의 Best Match 알고리즘은 페이지 로드 속도를 순위 요소로 고려합니다. 리스팅 이미지를 모바일 친화적 크기(일반적으로 500KB-1.5MB)로 압축하면 리스팅의 성능 지표를 개선하고 검색 결과에서의 가시성을 높입니다. 당사의 브라우저 기반 압축기는 지능형 Canvas API 처리를 사용하여 제품 세부 사항, 색상 정확도 및 시각적 매력을 유지하면서 파일 크기를 줄입니다. 모든 처리는 브라우저에서 로컬로 수행되므로 제품 사진이 개인적이고 안전하게 유지되며 전문 판매자 평판을 해칠 수 있는 워터마크나 품질 저하가 없습니다."
        }
      ]
    },
    features: {
      items: [
        {
          title: "모바일 최적화 크기",
          desc: "이미지를 500KB-1.5MB로 압축하여 즉시 모바일 로딩을 실현합니다. eBay 검색 순위를 개선하고 느린 연결에서 구매자 이탈률을 줄입니다."
        },
        {
          title: "100% 비공개 처리",
          desc: "모든 압축은 브라우저에서 로컬로 수행됩니다. 제품 사진이 기기를 떠나지 않아 재고의 완전한 개인정보 보호와 보안을 보장합니다."
        },
        {
          title: "일괄 처리",
          desc: "최대 100개의 리스팅 이미지를 동시에 처리합니다. 한 번의 작업으로 전체 제품 카탈로그를 최적화하여 전문 판매자 및 대량 리스팅에 완벽합니다."
        },
        {
          title: "즉시 최적화",
          desc: "브라우저 네이티브 Canvas API 처리는 서버 업로드나 대기 큐 없이 즉시 압축을 보장합니다. 리스팅을 더 빠르게 라이브로 만듭니다."
        },
        {
          title: "영구 무료",
          desc: "무제한 이미지 최적화 완전 무료—프리미엄 계층 없음, 구독료 없음, 광고 없음. 모든 규모의 판매자에게 완벽합니다."
        },
        {
          title: "품질 유지",
          desc: "제품 세부 사항과 색상 정확도를 유지합니다. 더 빠른 모바일 로딩을 위해 파일 크기를 줄이면서 이미지를 선명하고 전문적으로 유지합니다."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "입력 형식",
          value: "JPG, PNG, WebP, BMP (제품 리스팅 이미지)"
        },
        {
          label: "출력 형식",
          value: "JPG (eBay 리스팅용 최적화)"
        },
        {
          label: "권장 크기",
          value: "500KB - 1.5MB (모바일 최적화)"
        },
        {
          label: "해상도 지원",
          value: "최대 4K (3840x2160) - 크기 유지"
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
      title: "eBay 이미지를 최적화하는 방법",
      steps: [
        {
          title: "리스팅 사진 업로드",
          desc: "eBay 제품 이미지를 드래그 앤 드롭하거나 클릭하여 찾아봅니다. 최대 4K 해상도의 JPG, PNG, WebP 및 BMP 형식을 지원합니다."
        },
        {
          title: "모바일 친화적 크기 설정",
          desc: "최적의 모바일 로딩을 위해 대상 크기를 500KB-1.5MB로 설정합니다. 알고리즘은 제품 세부 사항과 색상 정확도를 유지하면서 이미지를 압축합니다."
        },
        {
          title: "최적화된 이미지 다운로드",
          desc: "최적화된 이미지를 즉시 다운로드합니다. 파일은 eBay에 업로드할 준비가 되어 있으며 리스팅 로드 속도와 검색 순위를 개선합니다."
        }
      ]
    },
    scenes: [
      {
        title: "전문 판매자",
        desc: "대량 리스팅을 위해 수백 개의 제품 이미지를 최적화합니다. 모든 리스팅에서 전문적인 품질을 유지하기 위해 카탈로그 전체를 빠르고 일관되게 처리합니다."
      },
      {
        title: "모바일 우선 판매자",
        desc: "리스팅이 모바일 기기에서 즉시 로드되도록 합니다. 느린 4G 연결에서 구매자 경험을 개선하고 이탈률을 줄입니다."
      },
      {
        title: "Gallery Plus 사용자",
        desc: "eBay Gallery Plus용 고해상도 줌 이미지를 최적화합니다. 클로즈업 보기의 세부 사항을 유지하면서 즉시 열 수 있도록 이미지를 가볍게 유지합니다."
      }
    ],
    comparison: {
      toolaze: "모바일 최적화 크기 (500KB-1.5MB), 최대 100개 이미지 일괄 처리, 100% 브라우저 측 처리, 워터마크 또는 품질 손실 없음, 제품 세부 사항 및 색상 유지, 영구 무료",
      others: "랜덤 파일 크기가 너무 클 수 있음, 제한된 일괄 처리, 서버 업로드 필요, 워터마크 또는 품질 저하, 불필요하게 이미지 품질을 낮출 수 있음, 구독료 또는 광고"
    },
    rating: {
      text: "\"eBay 리스팅이 이제 모바일에서 즉시 로드됩니다! 검색 순위가 개선되고 판매가 증가했습니다.\" - 모바일 우선 최적화를 위해 Toolaze를 신뢰하는 수천 명의 eBay 판매자에 합류하세요."
    },
    faq: [
      {
        q: "eBay 리스팅에는 어떤 파일 크기를 사용해야 하나요?",
        a: "최적의 모바일 로딩과 검색 순위를 위해 eBay 리스팅 이미지를 500KB-1.5MB로 압축하세요. 이렇게 하면 4G 네트워크에서 빠른 로딩이 보장되면서 구매자가 제품 세부 사항을 명확하게 볼 수 있는 충분한 품질이 유지됩니다."
      },
      {
        q: "이미지를 압축하면 제품 사진의 품질이 손상되나요?",
        a: "아니요. Toolaze는 제품 세부 사항, 색상 정확도 및 시각적 매력을 유지하는 지능형 압축 알고리즘을 사용합니다. 압축은 시각적 품질을 낮추는 대신 보이지 않는 데이터를 제거하는 데 중점을 두어 리스팅이 전문적으로 보이도록 합니다."
      },
      {
        q: "여러 제품 이미지를 한 번에 처리할 수 있나요?",
        a: "예! Toolaze는 최대 100개의 이미지를 동시에 일괄 처리할 수 있습니다. 전체 제품 카탈로그 또는 대량 리스팅을 효율적으로 최적화해야 하는 전문 판매자에게 완벽합니다."
      },
      {
        q: "제품 사진이 서버에 업로드되나요?",
        a: "아니요! 모든 압축은 JavaScript와 Canvas API를 사용하여 브라우저에서 로컬로 수행됩니다. 제품 사진이 기기를 떠나지 않아 재고의 완전한 개인정보 보호와 보안을 보장합니다."
      },
      {
        q: "최적화된 이미지가 eBay 검색 순위를 개선하나요?",
        a: "예. eBay의 Best Match 알고리즘은 페이지 로드 속도를 순위 요소로 고려합니다. 더 빠르게 로드되는 이미지는 리스팅의 성능 지표를 개선하고 검색 결과에서의 가시성을 높여 잠재적으로 더 많은 판매로 이어질 수 있습니다."
      },
      {
        q: "eBay는 어떤 이미지 형식을 지원하나요?",
        a: "eBay는 JPG, PNG 및 GIF 형식을 지원합니다. Toolaze는 JPG, PNG, WebP 및 BMP 이미지를 압축할 수 있으며, 파일 크기가 작고 호환성이 넓기 때문에 eBay 리스팅에는 JPG가 권장 형식입니다."
      }
    ]
  },
  'zh-TW': {
    hero: {
      desc: "優化 eBay 列表圖片以實現快速行動載入。只需將您的產品照片拖放到下方即可壓縮，以獲得更好的搜尋排名和更快的銷售。"
    },
    intro: {
      title: "為什麼要優化 eBay 圖片以適應行動裝置？",
      content: [
        {
          title: "行動優先的購物體驗",
          text: "超過 60% 的 eBay 交易發生在行動裝置上。當您的列表圖片太大時，它們在 4G 網路上載入緩慢，導致潛在買家在看到您的產品之前就放棄您的列表。eBay 的搜尋演算法積極偏愛快速載入的列表，這意味著載入更快的圖片可以改善您的搜尋排名並增加您完成銷售的機會。大型圖片檔案不僅讓行動購物者感到沮喪，還會浪費他們的數據計劃，導致參與度降低和轉換率下降。"
        },
        {
          title: "提升搜尋排名和銷售",
          text: "eBay 的 Best Match 演算法將頁面載入速度視為排名因素。通過將您的列表圖片壓縮到行動友好的大小（通常為 500KB-1.5MB），您可以改善列表的性能指標並提高在搜尋結果中的可見性。我們的瀏覽器壓縮工具使用智能 Canvas API 處理來減少檔案大小，同時保留產品細節、顏色準確性和視覺吸引力。所有處理都在您的瀏覽器中本地進行，確保您的產品照片保持私密和安全，不會有任何可能損害您專業賣家聲譽的水印或品質下降。"
        }
      ]
    },
    features: {
      items: [
        {
          title: "行動優化大小",
          desc: "將圖片壓縮至 500KB-1.5MB 以實現即時行動載入。改善您的 eBay 搜尋排名並減少在慢速連接上的買家跳出率。"
        },
        {
          title: "100% 私密處理",
          desc: "所有壓縮都在您的瀏覽器中本地進行。您的產品照片永遠不會離開您的設備，確保您的庫存完全私密和安全。"
        },
        {
          title: "批次處理",
          desc: "同時處理最多 100 張列表圖片。在一次操作中優化整個產品目錄，非常適合專業賣家和大批量列表。"
        },
        {
          title: "即時優化",
          desc: "瀏覽器原生 Canvas API 處理確保即時壓縮，無需伺服器上傳或等待隊列。讓您的列表更快上線。"
        },
        {
          title: "永久免費",
          desc: "無限圖片優化完全免費—無高級層級、無訂閱費用、無廣告。非常適合各種規模的賣家。"
        },
        {
          title: "保留品質",
          desc: "保持產品細節和顏色準確性。在減少檔案大小以加快行動載入速度的同時，保持您的圖片清晰和專業。"
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "輸入格式",
          value: "JPG、PNG、WebP、BMP（產品列表圖片）"
        },
        {
          label: "輸出格式",
          value: "JPG（針對 eBay 列表優化）"
        },
        {
          label: "推薦大小",
          value: "500KB - 1.5MB（行動優化）"
        },
        {
          label: "解析度支援",
          value: "最高 4K (3840x2160) - 保留尺寸"
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
      title: "如何優化 eBay 圖片",
      steps: [
        {
          title: "上傳列表照片",
          desc: "拖放您的 eBay 產品圖片或點擊瀏覽。支援最高 4K 解析度的 JPG、PNG、WebP 和 BMP 格式。"
        },
        {
          title: "設定行動友好大小",
          desc: "將您的目標大小設定為 500KB-1.5MB 以實現最佳行動載入。我們的演算法在保留產品細節和顏色準確性的同時壓縮您的圖片。"
        },
        {
          title: "下載優化後的圖片",
          desc: "立即下載您的優化圖片。檔案已準備好上傳到 eBay，改善您列表的載入速度和搜尋排名。"
        }
      ]
    },
    scenes: [
      {
        title: "專業賣家",
        desc: "優化數百張產品圖片以進行批量列表。快速且一致地處理整個目錄，以在所有列表中保持專業品質。"
      },
      {
        title: "行動優先賣家",
        desc: "確保您的列表在行動裝置上即時載入。改善買家體驗並減少在慢速 4G 連接上的跳出率。"
      },
      {
        title: "Gallery Plus 用戶",
        desc: "優化 eBay Gallery Plus 的高解析度縮放圖片。保持圖片足夠輕以便即時打開，同時保留特寫視圖的細節。"
      }
    ],
    comparison: {
      toolaze: "行動優化大小 (500KB-1.5MB)、批次處理最多 100 張圖片、100% 瀏覽器端處理、無水印或品質損失、保留產品細節和顏色、永久免費",
      others: "隨機檔案大小可能太大、有限的批次處理、需要伺服器上傳、水印或品質下降、可能不必要地降低圖片品質、訂閱費用或廣告"
    },
    rating: {
      text: "\"我的 eBay 列表現在在行動裝置上即時載入！搜尋排名改善，銷售增加。\" - 加入數千名信賴 Toolaze 進行行動優先優化的 eBay 賣家。"
    },
    faq: [
      {
        q: "我應該為 eBay 列表使用什麼檔案大小？",
        a: "為了實現最佳行動載入和搜尋排名，請將您的 eBay 列表圖片壓縮至 500KB-1.5MB。這確保在 4G 網路上快速載入，同時保持足夠的品質讓買家清楚地看到產品細節。"
      },
      {
        q: "壓縮圖片會損害我的產品照片品質嗎？",
        a: "不會。Toolaze 使用智能壓縮演算法，保留產品細節、顏色準確性和視覺吸引力。壓縮專注於移除不可見的數據而不是降低視覺品質，確保您的列表看起來專業。"
      },
      {
        q: "我可以一次處理多張產品圖片嗎？",
        a: "是的！Toolaze 支援同時批次處理最多 100 張圖片。非常適合需要高效優化整個產品目錄或批量列表的專業賣家。"
      },
      {
        q: "我的產品照片會上傳到伺服器嗎？",
        a: "不會！所有壓縮都在您的瀏覽器中使用 JavaScript 和 Canvas API 本地進行。您的產品照片永遠不會離開您的設備，確保您的庫存完全私密和安全。"
      },
      {
        q: "優化後的圖片會改善我的 eBay 搜尋排名嗎？",
        a: "是的。eBay 的 Best Match 演算法將頁面載入速度視為排名因素。載入更快的圖片可以改善您列表的性能指標並提高在搜尋結果中的可見性，可能帶來更多銷售。"
      },
      {
        q: "eBay 支援哪些圖片格式？",
        a: "eBay 支援 JPG、PNG 和 GIF 格式。Toolaze 可以壓縮 JPG、PNG、WebP 和 BMP 圖片，由於檔案大小較小和廣泛的相容性，JPG 是 eBay 列表的推薦格式。"
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
    
    if (!data['ebay-picture-fast']) {
      console.log(`⚠️  ${lang}: ebay-picture-fast section not found`)
      continue
    }
    
    const translation = translations[lang]
    if (!translation) {
      console.log(`⚠️  ${lang}: translation not found`)
      continue
    }
    
    // 深度合并翻译
    data['ebay-picture-fast'] = deepMerge(data['ebay-picture-fast'], translation)
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ ${lang}: ebay-picture-fast fully translated`)
  }
  
  console.log('\n✨ All translations completed!')
}

main().catch(console.error)
