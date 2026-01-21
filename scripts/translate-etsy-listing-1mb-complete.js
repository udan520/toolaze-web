const fs = require('fs')
const path = require('path')

// 完整翻译映射
const translations = {
  de: {
    hero: {
      desc: "Komprimieren Sie Etsy-Listing-Bilder auf unter 1MB für schnelleres Laden des Shops. Lassen Sie einfach Ihre Produktfotos unten fallen, um sie zu optimieren und dabei Farben und Texturen zu erhalten."
    },
    intro: {
      title: "Warum Etsy-Listing-Bilder optimieren?",
      content: [
        {
          title: "Etsys 1MB-Empfehlung für bessere Leistung",
          text: "Etsy empfiehlt Listing-Bilder unter 1MB für die beste Browsing-Erfahrung. Wenn Sie Produktfotos mit einer professionellen Kamera oder einem Smartphone aufnehmen, sind die resultierenden Bilder oft 3-10MB groß und überschreiten diese Empfehlung bei weitem. Große Bilddateien verursachen nicht nur 'Datei zu groß'-Upload-Fehler, sondern verlangsamen auch die Ladegeschwindigkeit Ihres Shops, besonders auf mobilen Geräten, auf denen die meisten Etsy-Käufer surfen. Langsam ladende Shops schaden Ihren Suchrankings, reduzieren das Käuferengagement und können zu verlorenen Verkäufen führen. Etsy warnt, dass Dateien über 1MB möglicherweise nicht ordnungsgemäß hochgeladen werden oder für Käufer sehr langsam laden, was eine schlechte Einkaufserfahrung schafft. Unser browserbasierter Kompressor verwendet intelligente Canvas API-Verarbeitung, um Ihre Listing-Bilddateigrößen zu reduzieren und dabei die Texturen, Farben und Details zu erhalten, die für den Verkauf von handgefertigten und physischen Waren entscheidend sind."
        },
        {
          title: "Handgefertigte Produktdetails und Farben erhalten",
          text: "Etsy-Käufer lieben es, Details zu sehen—die Textur von handgefertigtem Schmuck, die lebendigen Farben von Kunstdrucken, die feine Handwerkskunst von Vintage-Artikeln. Das Komprimieren von Bildern sollte nicht bedeuten, diese entscheidenden Verkaufspunkte zu opfern. Toolazes Komprimierungsalgorithmus ist speziell darauf ausgelegt, Texturen und Farben zu erhalten und gleichzeitig das Dateigewicht drastisch zu reduzieren. Wir erhalten Farbgenauigkeit und Detailklarheit und stellen sicher, dass Ihre handgefertigten Produkte in Suchergebnissen und Produktseiten am besten aussehen. Alle Verarbeitung erfolgt lokal in Ihrem Browser, sodass Ihre einzigartigen Produktdesigns und Fotografien Ihr Gerät niemals verlassen und vollständige Privatsphäre und Sicherheit für Ihre kreative Arbeit gewährleisten."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Unter 1MB Ziel",
          desc: "Komprimieren Sie Listing-Bilder auf unter 1MB. Erfüllen Sie Etsys Empfehlungen für schnelleres Laden des Shops und bessere Suchrankings."
        },
        {
          title: "100% Private Verarbeitung",
          desc: "Alle Komprimierung erfolgt lokal in Ihrem Browser. Ihre Produktfotos und Designs verlassen niemals Ihr Gerät und gewährleisten vollständige Privatsphäre."
        },
        {
          title: "Stapelverarbeitung",
          desc: "Verarbeiten Sie bis zu 100 Listing-Bilder gleichzeitig. Optimieren Sie gesamte Produktkataloge in einem Vorgang für effizientes Shop-Management."
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
          title: "Farben & Texturen erhalten",
          desc: "Behalten Sie lebendige Farben und feine Texturen. Halten Sie Ihre handgefertigten Produkte am besten aussehend, während Sie die Dateigröße für schnelleres Laden reduzieren."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Eingabeformat",
          value: "JPG, PNG, WebP (Produkt-Listing-Bilder)"
        },
        {
          label: "Ausgabeformat",
          value: "JPG (Optimiert für Etsy, bevorzugtes Format)"
        },
        {
          label: "Dateigrößenlimit",
          value: "Unter 1MB (Etsy-Empfehlung)"
        },
        {
          label: "Farberhaltung",
          value: "Lebendige Farben und Texturen erhalten"
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
      title: "Wie man Etsy-Listing-Bilder optimiert",
      steps: [
        {
          title: "Produktfotos hochladen",
          desc: "Ziehen Sie Ihre Etsy-Listing-Bilder per Drag & Drop oder klicken Sie zum Durchsuchen. Unterstützt JPG-, PNG- und WebP-Formate von Kameras oder Design-Tools."
        },
        {
          title: "Unter 1MB Ziel festlegen",
          desc: "Das Tool setzt das Ziel automatisch auf unter 1MB. Unser Algorithmus komprimiert Ihre Bilder und erhält dabei Farben und Texturen."
        },
        {
          title: "Optimiertes herunterladen",
          desc: "Laden Sie Ihre optimierten Bilder sofort herunter. Dateien sind bereit zum Hochladen auf Etsy und verbessern die Ladegeschwindigkeit Ihres Shops und Suchrankings."
        }
      ]
    },
    scenes: [
      {
        title: "Handwerksverkäufer",
        desc: "Optimieren Sie Produktfotos für handgefertigte Artikel. Erhalten Sie Texturen, Farben und feine Details, die Ihre Handwerkskunst zeigen und Käufer anziehen."
      },
      {
        title: "Mobile Shop-Optimierung",
        desc: "Stellen Sie sicher, dass Ihr Shop in der Etsy-Mobil-App schnell lädt. Verbessern Sie die Käufererfahrung und Suchrankings mit schneller ladenden Listing-Bildern."
      },
      {
        title: "Digitale Kunstverkäufer",
        desc: "Reduzieren Sie die Größe digitaler Kunstdateien für einfachere Kundenzustellung. Optimieren Sie Vorschaubilder und erhalten Sie dabei die Farbgenauigkeit für Ihre Kunstwerke."
      }
    ],
    comparison: {
      toolaze: "Unter 1MB Garantie, Farben und Texturen erhalten, 100% browser-seitige Verarbeitung, Keine Wasserzeichen oder Qualitätsverlust, Stapelverarbeitung bis zu 100 Bildern, Für immer kostenlos",
      others: "Zufällige Dateigrößen können überschritten werden, Ausgewaschene Farben oder verlorene Texturen, Server-Uploads erforderlich, Wasserzeichen oder Qualitätsverschlechterung, Begrenzte Stapelverarbeitung, Abonnementgebühren oder Werbung"
    },
    rating: {
      text: "\"Mein Etsy-Shop lädt jetzt so viel schneller! Farben blieben lebendig und Texturen sind perfekt.\" - Schließen Sie sich Tausenden von Handwerksverkäufern an, die Toolaze für die Erhaltung von Produktdetails vertrauen."
    }
  },
  es: {
    hero: {
      desc: "Comprime imágenes de listados de Etsy a menos de 1MB para una carga más rápida de la tienda. Simplemente suelta tus fotos de producto a continuación para optimizarlas preservando colores y texturas."
    },
    intro: {
      title: "¿Por qué optimizar imágenes de listados de Etsy?",
      content: [
        {
          title: "Recomendación de 1MB de Etsy para mejor rendimiento",
          text: "Etsy recomienda imágenes de listado bajo 1MB para la mejor experiencia de navegación. Cuando tomas fotos de productos con una cámara profesional o smartphone, las imágenes resultantes suelen ser de 3-10MB, superando con creces esta recomendación. Los archivos de imagen grandes no solo causan errores de carga 'Archivo demasiado grande', sino que también ralentizan la velocidad de carga de tu tienda, especialmente en dispositivos móviles donde la mayoría de los compradores de Etsy navegan. Las tiendas de carga lenta perjudican tus rankings de búsqueda, reducen el compromiso del comprador y pueden llevar a ventas perdidas. Etsy advierte que los archivos sobre 1MB pueden no cargarse correctamente o cargarse muy lentamente para los compradores, creando una mala experiencia de compra. Nuestro compresor basado en navegador utiliza procesamiento inteligente de Canvas API para reducir los tamaños de archivo de imágenes de listado mientras preserva las texturas, colores y detalles que son cruciales para vender productos hechos a mano y físicos."
        },
        {
          title: "Preservar detalles y colores de productos hechos a mano",
          text: "Los compradores de Etsy adoran ver detalles—la textura de joyería hecha a mano, los colores vibrantes de impresiones artísticas, la fina artesanía de artículos vintage. Comprimir imágenes no debería significar sacrificar estos puntos de venta cruciales. El algoritmo de compresión de Toolaze está específicamente ajustado para preservar texturas y colores mientras reduce drásticamente el peso del archivo. Mantenemos la precisión del color y la claridad del detalle, asegurando que tus productos hechos a mano se vean mejor en resultados de búsqueda y páginas de productos. Todo el procesamiento ocurre localmente en tu navegador, por lo que tus diseños de productos únicos y fotografías nunca abandonan tu dispositivo, garantizando privacidad y seguridad completas para tu trabajo creativo."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Objetivo Bajo 1MB",
          desc: "Comprime imágenes de listado a menos de 1MB. Cumple con las recomendaciones de Etsy para carga más rápida de la tienda y mejores rankings de búsqueda."
        },
        {
          title: "Procesamiento 100% Privado",
          desc: "Toda la compresión ocurre localmente en tu navegador. Tus fotos de producto y diseños nunca abandonan tu dispositivo, garantizando privacidad completa."
        },
        {
          title: "Procesamiento por Lotes",
          desc: "Procesa hasta 100 imágenes de listado simultáneamente. Optimiza catálogos de productos completos en una operación para gestión eficiente de tienda."
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
          title: "Colores y Texturas Preservadas",
          desc: "Mantén colores vibrantes y texturas finas. Mantén tus productos hechos a mano luciendo mejor mientras reduces el tamaño del archivo para carga más rápida."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato de Entrada",
          value: "JPG, PNG, WebP (Imágenes de listado de productos)"
        },
        {
          label: "Formato de Salida",
          value: "JPG (Optimizado para Etsy, formato preferido)"
        },
        {
          label: "Límite de Tamaño de Archivo",
          value: "Bajo 1MB (recomendación de Etsy)"
        },
        {
          label: "Preservación de Color",
          value: "Colores vibrantes y texturas mantenidas"
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
      title: "Cómo Optimizar Imágenes de Listados de Etsy",
      steps: [
        {
          title: "Subir Fotos de Producto",
          desc: "Arrastra y suelta tus imágenes de listado de Etsy o haz clic para navegar. Admite formatos JPG, PNG y WebP de cámaras o herramientas de diseño."
        },
        {
          title: "Establecer Objetivo Bajo 1MB",
          desc: "La herramienta establece automáticamente el objetivo a menos de 1MB. Nuestro algoritmo comprime tus imágenes preservando colores y texturas."
        },
        {
          title: "Descargar Optimizado",
          desc: "Descarga tus imágenes optimizadas al instante. Los archivos están listos para subir a Etsy, mejorando la velocidad de carga de tu tienda y rankings de búsqueda."
        }
      ]
    },
    scenes: [
      {
        title: "Vendedores de Productos Hechos a Mano",
        desc: "Optimiza fotos de productos para artículos hechos a mano. Preserva texturas, colores y detalles finos que muestran tu artesanía y atraen compradores."
      },
      {
        title: "Optimización de Tienda Móvil",
        desc: "Asegura que tu tienda cargue rápido en la aplicación móvil de Etsy. Mejora la experiencia del comprador y rankings de búsqueda con imágenes de listado de carga más rápida."
      },
      {
        title: "Vendedores de Arte Digital",
        desc: "Reduce el tamaño de archivos de arte digital para entrega más fácil al cliente. Optimiza imágenes de vista previa manteniendo precisión de color para tus obras de arte."
      }
    ],
    comparison: {
      toolaze: "Garantía bajo 1MB, Colores y texturas preservadas, 100% procesamiento del lado del navegador, Sin marcas de agua o pérdida de calidad, Procesamiento por lotes hasta 100 imágenes, Gratis para siempre",
      others: "Los tamaños de archivo aleatorios pueden exceder 1MB, Colores deslavados o texturas perdidas, Se requieren cargas al servidor, Marcas de agua o degradación de calidad, Procesamiento por lotes limitado, Tarifas de suscripción o anuncios"
    },
    rating: {
      text: "\"¡Mi tienda de Etsy carga mucho más rápido ahora! Los colores se mantuvieron vibrantes y las texturas son perfectas.\" - Únete a miles de vendedores de productos hechos a mano que confían en Toolaze para preservar detalles de productos."
    }
  },
  fr: {
    hero: {
      desc: "Compressez les images de listage Etsy à moins de 1MB pour un chargement plus rapide de la boutique. Déposez simplement vos photos de produit ci-dessous pour les optimiser tout en préservant les couleurs et les textures."
    },
    intro: {
      title: "Pourquoi optimiser les images de listage Etsy?",
      content: [
        {
          title: "Recommandation de 1MB d'Etsy pour de meilleures performances",
          text: "Etsy recommande des images de listage sous 1MB pour la meilleure expérience de navigation. Lorsque vous prenez des photos de produits avec un appareil photo professionnel ou un smartphone, les images résultantes font souvent 3-10MB, dépassant largement cette recommandation. Les gros fichiers d'images causent non seulement des erreurs de téléchargement 'Fichier trop volumineux', mais ralentissent également la vitesse de chargement de votre boutique, surtout sur les appareils mobiles où la plupart des acheteurs Etsy naviguent. Les boutiques à chargement lent nuisent à vos classements de recherche, réduisent l'engagement des acheteurs et peuvent entraîner des ventes perdues. Etsy avertit que les fichiers de plus de 1MB peuvent ne pas se télécharger correctement ou se charger très lentement pour les acheteurs, créant une mauvaise expérience d'achat. Notre compresseur basé sur navigateur utilise un traitement intelligent de Canvas API pour réduire les tailles de fichiers d'images de listage tout en préservant les textures, couleurs et détails qui sont cruciaux pour vendre des produits faits à la main et physiques."
        },
        {
          title: "Préserver les détails et couleurs des produits faits à la main",
          text: "Les acheteurs Etsy adorent voir les détails—la texture des bijoux faits à la main, les couleurs vibrantes des impressions d'art, le fin travail artisanal des articles vintage. Compresser les images ne devrait pas signifier sacrifier ces points de vente cruciaux. L'algorithme de compression de Toolaze est spécifiquement réglé pour préserver les textures et couleurs tout en réduisant drastiquement le poids du fichier. Nous maintenons la précision des couleurs et la clarté des détails, garantissant que vos produits faits à la main ont la meilleure apparence dans les résultats de recherche et les pages de produits. Tout le traitement se fait localement dans votre navigateur, donc vos designs de produits uniques et photographies ne quittent jamais votre appareil, garantissant une confidentialité et sécurité complètes pour votre travail créatif."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Cible Sous 1MB",
          desc: "Compressez les images de listage à moins de 1MB. Répondez aux recommandations d'Etsy pour un chargement plus rapide de la boutique et de meilleurs classements de recherche."
        },
        {
          title: "Traitement 100% Privé",
          desc: "Toute la compression se fait localement dans votre navigateur. Vos photos de produit et designs ne quittent jamais votre appareil, garantissant une confidentialité complète."
        },
        {
          title: "Traitement par Lots",
          desc: "Traitez jusqu'à 100 images de listage simultanément. Optimisez des catalogues de produits entiers en une opération pour une gestion efficace de boutique."
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
          title: "Couleurs et Textures Préservées",
          desc: "Maintenez des couleurs vibrantes et des textures fines. Gardez vos produits faits à la main avec la meilleure apparence tout en réduisant la taille du fichier pour un chargement plus rapide."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Format d'Entrée",
          value: "JPG, PNG, WebP (Images de listage de produits)"
        },
        {
          label: "Format de Sortie",
          value: "JPG (Optimisé pour Etsy, format préféré)"
        },
        {
          label: "Limite de Taille de Fichier",
          value: "Sous 1MB (recommandation Etsy)"
        },
        {
          label: "Préservation des Couleurs",
          value: "Couleurs vibrantes et textures maintenues"
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
      title: "Comment Optimiser les Images de Listage Etsy",
      steps: [
        {
          title: "Télécharger les Photos de Produit",
          desc: "Glissez-déposez vos images de listage Etsy ou cliquez pour parcourir. Prend en charge les formats JPG, PNG et WebP des appareils photo ou outils de conception."
        },
        {
          title: "Définir la Cible Sous 1MB",
          desc: "L'outil définit automatiquement la cible à moins de 1MB. Notre algorithme compresse vos images tout en préservant les couleurs et textures."
        },
        {
          title: "Télécharger Optimisé",
          desc: "Téléchargez vos images optimisées instantanément. Les fichiers sont prêts à être téléchargés sur Etsy, améliorant la vitesse de chargement de votre boutique et les classements de recherche."
        }
      ]
    },
    scenes: [
      {
        title: "Vendeurs de Produits Faits à la Main",
        desc: "Optimisez les photos de produits pour les articles faits à la main. Préservez les textures, couleurs et détails fins qui mettent en valeur votre savoir-faire et attirent les acheteurs."
      },
      {
        title: "Optimisation de Boutique Mobile",
        desc: "Assurez-vous que votre boutique charge rapidement sur l'application mobile Etsy. Améliorez l'expérience de l'acheteur et les classements de recherche avec des images de listage à chargement plus rapide."
      },
      {
        title: "Vendeurs d'Art Numérique",
        desc: "Réduisez la taille des fichiers d'art numérique pour une livraison plus facile au client. Optimisez les images de prévisualisation tout en maintenant la précision des couleurs pour vos œuvres d'art."
      }
    ],
    comparison: {
      toolaze: "Garantie sous 1MB, Couleurs et textures préservées, 100% traitement côté navigateur, Aucune filigrane ou perte de qualité, Traitement par lots jusqu'à 100 images, Gratuit pour toujours",
      others: "Les tailles de fichier aléatoires peuvent dépasser 1MB, Couleurs délavées ou textures perdues, Téléchargements serveur requis, Filigranes ou dégradation de qualité, Traitement par lots limité, Frais d'abonnement ou publicités"
    },
    rating: {
      text: "\"Ma boutique Etsy charge tellement plus vite maintenant! Les couleurs sont restées vibrantes et les textures sont parfaites.\" - Rejoignez des milliers de vendeurs de produits faits à la main qui font confiance à Toolaze pour préserver les détails des produits."
    }
  },
  pt: {
    hero: {
      desc: "Comprima imagens de listagem do Etsy para menos de 1MB para carregamento mais rápido da loja. Simplesmente solte suas fotos de produto abaixo para otimizá-las preservando cores e texturas."
    },
    intro: {
      title: "Por que otimizar imagens de listagem do Etsy?",
      content: [
        {
          title: "Recomendação de 1MB do Etsy para melhor desempenho",
          text: "O Etsy recomenda imagens de listagem abaixo de 1MB para a melhor experiência de navegação. Quando você tira fotos de produtos com uma câmera profissional ou smartphone, as imagens resultantes geralmente têm 3-10MB, excedendo em muito esta recomendação. Arquivos de imagem grandes não apenas causam erros de upload 'Arquivo muito grande', mas também retardam a velocidade de carregamento da sua loja, especialmente em dispositivos móveis onde a maioria dos compradores do Etsy navega. Lojas de carregamento lento prejudicam seus rankings de pesquisa, reduzem o engajamento do comprador e podem levar a vendas perdidas. O Etsy avisa que arquivos acima de 1MB podem não fazer upload corretamente ou carregar muito lentamente para compradores, criando uma experiência de compra ruim. Nosso compressor baseado em navegador usa processamento inteligente de Canvas API para reduzir os tamanhos de arquivo de imagens de listagem enquanto preserva as texturas, cores e detalhes que são cruciais para vender produtos feitos à mão e físicos."
        },
        {
          title: "Preservar detalhes e cores de produtos feitos à mão",
          text: "Os compradores do Etsy adoram ver detalhes—a textura de joias feitas à mão, as cores vibrantes de impressões artísticas, a fina artesanaria de itens vintage. Comprimir imagens não deveria significar sacrificar esses pontos de venda cruciais. O algoritmo de compressão do Toolaze é especificamente ajustado para preservar texturas e cores enquanto reduz drasticamente o peso do arquivo. Mantemos a precisão de cor e clareza de detalhes, garantindo que seus produtos feitos à mão tenham a melhor aparência em resultados de pesquisa e páginas de produtos. Todo o processamento acontece localmente em seu navegador, então seus designs de produtos únicos e fotografias nunca deixam seu dispositivo, garantindo privacidade e segurança completas para seu trabalho criativo."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Objetivo Abaixo de 1MB",
          desc: "Comprima imagens de listagem para menos de 1MB. Atenda às recomendações do Etsy para carregamento mais rápido da loja e melhores rankings de pesquisa."
        },
        {
          title: "Processamento 100% Privado",
          desc: "Toda a compressão acontece localmente em seu navegador. Suas fotos de produto e designs nunca deixam seu dispositivo, garantindo privacidade completa."
        },
        {
          title: "Processamento em Lote",
          desc: "Processe até 100 imagens de listagem simultaneamente. Otimize catálogos de produtos inteiros em uma operação para gestão eficiente de loja."
        },
        {
          title: "Otimização Instantânea",
          desc: "O processamento nativo de Canvas API do navegador garante compressão instantânea sem uploads de servidor ou filas de espera. Coloque seus listagens online mais rapidamente."
        },
        {
          title: "Grátis Para Sempre",
          desc: "Otimização de imagens ilimitada completamente gratuita—sem níveis premium, sem taxas de assinatura, sem anúncios. Perfeito para vendedores de todos os tamanhos."
        },
        {
          title: "Cores e Texturas Preservadas",
          desc: "Mantenha cores vibrantes e texturas finas. Mantenha seus produtos feitos à mão com a melhor aparência enquanto reduz o tamanho do arquivo para carregamento mais rápido."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato de Entrada",
          value: "JPG, PNG, WebP (Imagens de listagem de produtos)"
        },
        {
          label: "Formato de Saída",
          value: "JPG (Otimizado para Etsy, formato preferido)"
        },
        {
          label: "Limite de Tamanho de Arquivo",
          value: "Abaixo de 1MB (recomendação do Etsy)"
        },
        {
          label: "Preservação de Cor",
          value: "Cores vibrantes e texturas mantidas"
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
      title: "Como Otimizar Imagens de Listagem do Etsy",
      steps: [
        {
          title: "Enviar Fotos de Produto",
          desc: "Arraste e solte suas imagens de listagem do Etsy ou clique para navegar. Suporta formatos JPG, PNG e WebP de câmeras ou ferramentas de design."
        },
        {
          title: "Definir Objetivo Abaixo de 1MB",
          desc: "A ferramenta define automaticamente o objetivo para menos de 1MB. Nosso algoritmo comprime suas imagens preservando cores e texturas."
        },
        {
          title: "Baixar Otimizado",
          desc: "Baixe suas imagens otimizadas instantaneamente. Os arquivos estão prontos para enviar ao Etsy, melhorando a velocidade de carregamento da sua loja e rankings de pesquisa."
        }
      ]
    },
    scenes: [
      {
        title: "Vendedores de Produtos Feitos à Mão",
        desc: "Otimize fotos de produtos para itens feitos à mão. Preserve texturas, cores e detalhes finos que mostram sua artesanaria e atraem compradores."
      },
      {
        title: "Otimização de Loja Móvel",
        desc: "Garanta que sua loja carregue rapidamente no aplicativo móvel do Etsy. Melhore a experiência do comprador e rankings de pesquisa com imagens de listagem de carregamento mais rápido."
      },
      {
        title: "Vendedores de Arte Digital",
        desc: "Reduza o tamanho de arquivos de arte digital para entrega mais fácil ao cliente. Otimize imagens de visualização mantendo precisão de cor para suas obras de arte."
      }
    ],
    comparison: {
      toolaze: "Garantia abaixo de 1MB, Cores e texturas preservadas, 100% processamento do lado do navegador, Sem marcas d'água ou perda de qualidade, Processamento em lote até 100 imagens, Grátis para sempre",
      others: "Tamanhos de arquivo aleatórios podem exceder 1MB, Cores desbotadas ou texturas perdidas, Uploads de servidor necessários, Marcas d'água ou degradação de qualidade, Processamento em lote limitado, Taxas de assinatura ou anúncios"
    },
    rating: {
      text: "\"Minha loja do Etsy carrega muito mais rápido agora! As cores permaneceram vibrantes e as texturas estão perfeitas.\" - Junte-se a milhares de vendedores de produtos feitos à mão que confiam no Toolaze para preservar detalhes de produtos."
    }
  },
  it: {
    hero: {
      desc: "Comprimi le immagini degli annunci Etsy a meno di 1MB per un caricamento più veloce del negozio. Basta rilasciare le tue foto di prodotto qui sotto per ottimizzarle preservando colori e texture."
    },
    intro: {
      title: "Perché ottimizzare le immagini degli annunci Etsy?",
      content: [
        {
          title: "Raccomandazione di 1MB di Etsy per prestazioni migliori",
          text: "Etsy raccomanda immagini di annuncio sotto 1MB per la migliore esperienza di navigazione. Quando scatti foto di prodotti con una fotocamera professionale o uno smartphone, le immagini risultanti sono spesso 3-10MB, superando di gran lunga questa raccomandazione. I file di immagine grandi non solo causano errori di caricamento 'File troppo grande', ma rallentano anche la velocità di caricamento del tuo negozio, specialmente sui dispositivi mobili dove la maggior parte degli acquirenti Etsy naviga. I negozi a caricamento lento danneggiano le tue classifiche di ricerca, riducono l'impegno degli acquirenti e possono portare a vendite perse. Etsy avverte che i file sopra 1MB potrebbero non caricarsi correttamente o caricarsi molto lentamente per gli acquirenti, creando una scarsa esperienza di acquisto. Il nostro compressore basato su browser utilizza l'elaborazione intelligente di Canvas API per ridurre le dimensioni dei file delle immagini degli annunci preservando le texture, i colori e i dettagli che sono cruciali per vendere prodotti fatti a mano e fisici."
        },
        {
          title: "Preservare dettagli e colori dei prodotti fatti a mano",
          text: "Gli acquirenti Etsy amano vedere i dettagli—la texture dei gioielli fatti a mano, i colori vivaci delle stampe artistiche, la fine artigianalità degli articoli vintage. Comprimere le immagini non dovrebbe significare sacrificare questi punti di vendita cruciali. L'algoritmo di compressione di Toolaze è specificamente sintonizzato per preservare texture e colori mentre riduce drasticamente il peso del file. Manteniamo la precisione del colore e la chiarezza dei dettagli, garantendo che i tuoi prodotti fatti a mano abbiano il miglior aspetto nei risultati di ricerca e nelle pagine dei prodotti. Tutta l'elaborazione avviene localmente nel tuo browser, quindi i tuoi design di prodotti unici e fotografie non lasciano mai il tuo dispositivo, garantendo privacy e sicurezza complete per il tuo lavoro creativo."
        }
      ]
    },
    features: {
      items: [
        {
          title: "Obiettivo Sotto 1MB",
          desc: "Comprimi le immagini degli annunci a meno di 1MB. Soddisfa le raccomandazioni di Etsy per un caricamento più veloce del negozio e classifiche di ricerca migliori."
        },
        {
          title: "Elaborazione 100% Privata",
          desc: "Tutta la compressione avviene localmente nel tuo browser. Le tue foto di prodotto e design non lasciano mai il tuo dispositivo, garantendo privacy completa."
        },
        {
          title: "Elaborazione Batch",
          desc: "Elabora fino a 100 immagini di annunci contemporaneamente. Ottimizza interi cataloghi di prodotti in un'operazione per una gestione efficiente del negozio."
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
          title: "Colori e Texture Preservati",
          desc: "Mantieni colori vivaci e texture fini. Mantieni i tuoi prodotti fatti a mano con il miglior aspetto mentre riduci la dimensione del file per un caricamento più veloce."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "Formato di Input",
          value: "JPG, PNG, WebP (Immagini di annunci prodotti)"
        },
        {
          label: "Formato di Output",
          value: "JPG (Ottimizzato per Etsy, formato preferito)"
        },
        {
          label: "Limite Dimensione File",
          value: "Sotto 1MB (raccomandazione Etsy)"
        },
        {
          label: "Conservazione Colore",
          value: "Colori vivaci e texture mantenute"
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
      title: "Come Ottimizzare le Immagini degli Annunci Etsy",
      steps: [
        {
          title: "Carica Foto di Prodotto",
          desc: "Trascina e rilascia le tue immagini di annunci Etsy o fai clic per sfogliare. Supporta formati JPG, PNG e WebP da fotocamere o strumenti di design."
        },
        {
          title: "Imposta Obiettivo Sotto 1MB",
          desc: "Lo strumento imposta automaticamente l'obiettivo a meno di 1MB. Il nostro algoritmo comprime le tue immagini preservando colori e texture."
        },
        {
          title: "Scarica Ottimizzato",
          desc: "Scarica le tue immagini ottimizzate istantaneamente. I file sono pronti per essere caricati su Etsy, migliorando la velocità di caricamento del tuo negozio e le classifiche di ricerca."
        }
      ]
    },
    scenes: [
      {
        title: "Venditori di Prodotti Fatti a Mano",
        desc: "Ottimizza foto di prodotti per articoli fatti a mano. Preserva texture, colori e dettagli fini che mostrano la tua artigianalità e attirano acquirenti."
      },
      {
        title: "Ottimizzazione Negozio Mobile",
        desc: "Assicurati che il tuo negozio carichi velocemente sull'app mobile Etsy. Migliora l'esperienza dell'acquirente e le classifiche di ricerca con immagini di annunci a caricamento più veloce."
      },
      {
        title: "Venditori di Arte Digitale",
        desc: "Riduci la dimensione dei file di arte digitale per una consegna più facile al cliente. Ottimizza le immagini di anteprima mantenendo la precisione del colore per le tue opere d'arte."
      }
    ],
    comparison: {
      toolaze: "Garanzia sotto 1MB, Colori e texture preservati, 100% elaborazione lato browser, Nessuna filigrana o perdita di qualità, Elaborazione batch fino a 100 immagini, Gratis per sempre",
      others: "Dimensioni file casuali possono superare 1MB, Colori sbiaditi o texture perse, Caricamenti server richiesti, Filigrane o degrado della qualità, Elaborazione batch limitata, Tariffe di abbonamento o pubblicità"
    },
    rating: {
      text: "\"Il mio negozio Etsy carica molto più velocemente ora! I colori sono rimasti vivaci e le texture sono perfette.\" - Unisciti a migliaia di venditori di prodotti fatti a mano che si fidano di Toolaze per preservare i dettagli dei prodotti."
    }
  },
  ja: {
    hero: {
      desc: "Etsyの出品画像を1MB未満に圧縮して、ショップの読み込みを高速化します。製品写真を下にドロップするだけで、色とテクスチャを保持しながら最適化できます。"
    },
    intro: {
      title: "なぜEtsyの出品画像を最適化するのか？",
      content: [
        {
          title: "パフォーマンス向上のためのEtsyの1MB推奨",
          text: "Etsyは最高のブラウジング体験のために出品画像を1MB未満にすることを推奨しています。プロのカメラやスマートフォンで製品写真を撮影すると、結果として得られる画像は3-10MBになることが多く、この推奨を大幅に超えています。大きな画像ファイルは「ファイルが大きすぎる」アップロードエラーを引き起こすだけでなく、特にEtsyの買い手のほとんどがブラウズするモバイルデバイスでショップの読み込み速度を遅くします。読み込みが遅いショップは検索ランキングに悪影響を与え、買い手のエンゲージメントを減らし、売上の損失につながる可能性があります。Etsyは1MBを超えるファイルが正しくアップロードされないか、買い手にとって非常に遅く読み込まれる可能性があると警告しており、購入体験を悪化させます。当社のブラウザベースの圧縮ツールは、インテリジェントなCanvas API処理を使用して、ハンドメイド製品や物理製品の販売に不可欠なテクスチャ、色、詳細を保持しながら、出品画像ファイルサイズを削減します。"
        },
        {
          title: "ハンドメイド製品の詳細と色を保持",
          text: "Etsyの買い手は詳細を見るのが大好きです—ハンドメイドジュエリーのテクスチャ、アートプリントの鮮やかな色、ヴィンテージアイテムの細かい職人技。画像を圧縮することは、これらの重要なセールスポイントを犠牲にすることを意味するべきではありません。Toolazeの圧縮アルゴリズムは、ファイルの重みを大幅に削減しながら、テクスチャと色を保持するように特別に調整されています。色の精度と詳細の明瞭さを維持し、ハンドメイド製品が検索結果と製品ページで最高に見えるようにします。すべての処理はブラウザでローカルに実行されるため、独自の製品デザインと写真がデバイスを離れることはなく、クリエイティブな作品の完全なプライバシーとセキュリティを保証します。"
        }
      ]
    },
    features: {
      items: [
        {
          title: "1MB未満のターゲット",
          desc: "出品画像を1MB未満に圧縮します。ショップの読み込みを高速化し、検索ランキングを向上させるためのEtsyの推奨事項を満たします。"
        },
        {
          title: "100%プライベート処理",
          desc: "すべての圧縮はブラウザでローカルに実行されます。製品写真やデザインがデバイスを離れることはなく、完全なプライバシーを保証します。"
        },
        {
          title: "一括処理",
          desc: "最大100枚の出品画像を同時に処理します。1回の操作で製品カタログ全体を最適化し、効率的なショップ管理を実現します。"
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
          title: "色とテクスチャを保持",
          desc: "鮮やかな色と細かいテクスチャを維持します。ファイルサイズを削減して読み込みを高速化しながら、ハンドメイド製品を最高の状態に保ちます。"
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "入力形式",
          value: "JPG、PNG、WebP（製品出品画像）"
        },
        {
          label: "出力形式",
          value: "JPG（Etsy用に最適化、推奨形式）"
        },
        {
          label: "ファイルサイズ制限",
          value: "1MB未満（Etsy推奨）"
        },
        {
          label: "色の保持",
          value: "鮮やかな色とテクスチャを維持"
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
      title: "Etsy出品画像を最適化する方法",
      steps: [
        {
          title: "製品写真をアップロード",
          desc: "Etsyの出品画像をドラッグ&ドロップするか、クリックして参照します。カメラやデザインツールからのJPG、PNG、WebP形式をサポートします。"
        },
        {
          title: "1MB未満のターゲットを設定",
          desc: "ツールは自動的にターゲットを1MB未満に設定します。アルゴリズムは色とテクスチャを保持しながら画像を圧縮します。"
        },
        {
          title: "最適化された画像をダウンロード",
          desc: "最適化された画像を即座にダウンロードします。ファイルはEtsyにアップロードする準備ができており、ショップの読み込み速度と検索ランキングを改善します。"
        }
      ]
    },
    scenes: [
      {
        title: "ハンドメイド販売者",
        desc: "ハンドメイドアイテムの製品写真を最適化します。職人技を示し、買い手を引き付けるテクスチャ、色、細かい詳細を保持します。"
      },
      {
        title: "モバイルショップ最適化",
        desc: "Etsyモバイルアプリでショップが高速に読み込まれるようにします。読み込みが速い出品画像で買い手の体験と検索ランキングを改善します。"
      },
      {
        title: "デジタルアート販売者",
        desc: "顧客への配信を容易にするためにデジタルアートファイルのサイズを削減します。アートワークの色精度を維持しながらプレビュー画像を最適化します。"
      }
    ],
    comparison: {
      toolaze: "1MB未満の保証、色とテクスチャを保持、100%ブラウザ側処理、透かしや品質損失なし、最大100画像の一括処理、永久無料",
      others: "ランダムなファイルサイズが1MBを超える可能性、色が薄くなるかテクスチャが失われる、サーバーアップロードが必要、透かしや品質劣化、制限された一括処理、サブスクリプション料金や広告"
    },
    rating: {
      text: "\"Etsyショップの読み込みがずっと速くなりました！色は鮮やかなままで、テクスチャは完璧です。\" - 製品詳細の保持のためにToolazeを信頼する何千人ものハンドメイド販売者に参加してください。"
    }
  },
  ko: {
    hero: {
      desc: "상점 로딩을 빠르게 하기 위해 Etsy 리스팅 이미지를 1MB 미만으로 압축합니다. 제품 사진을 아래에 드롭하기만 하면 색상과 질감을 유지하면서 최적화할 수 있습니다."
    },
    intro: {
      title: "왜 Etsy 리스팅 이미지를 최적화해야 하나요?",
      content: [
        {
          title: "더 나은 성능을 위한 Etsy의 1MB 권장사항",
          text: "Etsy는 최상의 브라우징 경험을 위해 리스팅 이미지를 1MB 미만으로 권장합니다. 전문 카메라나 스마트폰으로 제품 사진을 촬영하면 결과 이미지가 종종 3-10MB로 이 권장사항을 훨씬 초과합니다. 큰 이미지 파일은 '파일이 너무 큼' 업로드 오류를 일으킬 뿐만 아니라 대부분의 Etsy 구매자가 브라우징하는 모바일 기기에서 특히 상점 로딩 속도를 느리게 합니다. 느리게 로드되는 상점은 검색 순위에 해를 끼치고 구매자 참여를 줄이며 판매 손실로 이어질 수 있습니다. Etsy는 1MB를 초과하는 파일이 제대로 업로드되지 않거나 구매자에게 매우 느리게 로드될 수 있다고 경고하여 나쁜 쇼핑 경험을 만듭니다. 당사의 브라우저 기반 압축기는 지능형 Canvas API 처리를 사용하여 수제 및 물리적 상품 판매에 중요한 질감, 색상 및 세부 사항을 유지하면서 리스팅 이미지 파일 크기를 줄입니다."
        },
        {
          title: "수제 제품 세부 사항 및 색상 유지",
          text: "Etsy 구매자는 세부 사항을 보는 것을 좋아합니다—수제 보석의 질감, 아트 프린트의 생생한 색상, 빈티지 아이템의 세밀한 장인정신. 이미지 압축은 이러한 중요한 판매 포인트를 희생하는 것을 의미하지 않아야 합니다. Toolaze의 압축 알고리즘은 파일 무게를 크게 줄이면서 질감과 색상을 유지하도록 특별히 조정되었습니다. 색상 정확도와 세부 사항 선명도를 유지하여 수제 제품이 검색 결과 및 제품 페이지에서 최상으로 보이도록 합니다. 모든 처리는 브라우저에서 로컬로 수행되므로 고유한 제품 디자인과 사진이 기기를 떠나지 않아 창의적 작업에 대한 완전한 개인정보 보호와 보안을 보장합니다."
        }
      ]
    },
    features: {
      items: [
        {
          title: "1MB 미만 목표",
          desc: "리스팅 이미지를 1MB 미만으로 압축합니다. 더 빠른 상점 로딩 및 더 나은 검색 순위를 위한 Etsy의 권장사항을 충족합니다."
        },
        {
          title: "100% 비공개 처리",
          desc: "모든 압축은 브라우저에서 로컬로 수행됩니다. 제품 사진과 디자인이 기기를 떠나지 않아 완전한 개인정보 보호를 보장합니다."
        },
        {
          title: "일괄 처리",
          desc: "최대 100개의 리스팅 이미지를 동시에 처리합니다. 효율적인 상점 관리를 위해 한 번의 작업으로 전체 제품 카탈로그를 최적화합니다."
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
          title: "색상 및 질감 유지",
          desc: "생생한 색상과 세밀한 질감을 유지합니다. 더 빠른 로딩을 위해 파일 크기를 줄이면서 수제 제품을 최상으로 보이게 유지합니다."
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "입력 형식",
          value: "JPG, PNG, WebP (제품 리스팅 이미지)"
        },
        {
          label: "출력 형식",
          value: "JPG (Etsy용 최적화, 선호 형식)"
        },
        {
          label: "파일 크기 제한",
          value: "1MB 미만 (Etsy 권장사항)"
        },
        {
          label: "색상 보존",
          value: "생생한 색상과 질감 유지"
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
      title: "Etsy 리스팅 이미지를 최적화하는 방법",
      steps: [
        {
          title: "제품 사진 업로드",
          desc: "Etsy 리스팅 이미지를 드래그 앤 드롭하거나 클릭하여 찾아봅니다. 카메라 또는 디자인 도구의 JPG, PNG 및 WebP 형식을 지원합니다."
        },
        {
          title: "1MB 미만 목표 설정",
          desc: "도구는 자동으로 목표를 1MB 미만으로 설정합니다. 알고리즘은 색상과 질감을 유지하면서 이미지를 압축합니다."
        },
        {
          title: "최적화된 이미지 다운로드",
          desc: "최적화된 이미지를 즉시 다운로드합니다. 파일은 Etsy에 업로드할 준비가 되어 있으며 상점 로딩 속도와 검색 순위를 개선합니다."
        }
      ]
    },
    scenes: [
      {
        title: "수제 판매자",
        desc: "수제 아이템의 제품 사진을 최적화합니다. 장인정신을 보여주고 구매자를 유치하는 질감, 색상 및 세밀한 세부 사항을 유지합니다."
      },
      {
        title: "모바일 상점 최적화",
        desc: "Etsy 모바일 앱에서 상점이 빠르게 로드되도록 합니다. 더 빠르게 로드되는 리스팅 이미지로 구매자 경험과 검색 순위를 개선합니다."
      },
      {
        title: "디지털 아트 판매자",
        desc: "고객 배송을 쉽게 하기 위해 디지털 아트 파일의 크기를 줄입니다. 아트워크의 색상 정확도를 유지하면서 미리보기 이미지를 최적화합니다."
      }
    ],
    comparison: {
      toolaze: "1MB 미만 보장, 색상 및 질감 유지, 100% 브라우저 측 처리, 워터마크 또는 품질 손실 없음, 최대 100개 이미지 일괄 처리, 영구 무료",
      others: "랜덤 파일 크기가 1MB를 초과할 수 있음, 색상이 흐려지거나 질감 손실, 서버 업로드 필요, 워터마크 또는 품질 저하, 제한된 일괄 처리, 구독료 또는 광고"
    },
    rating: {
      text: "\"Etsy 상점이 이제 훨씬 빠르게 로드됩니다! 색상은 생생하게 유지되었고 질감은 완벽합니다.\" - 제품 세부 사항 보존을 위해 Toolaze를 신뢰하는 수천 명의 수제 판매자에 합류하세요."
    }
  },
  'zh-TW': {
    hero: {
      desc: "將 Etsy 列表圖片壓縮至 1MB 以下，以加快商店載入速度。只需將您的產品照片拖放到下方即可優化，同時保留顏色和質感。"
    },
    intro: {
      title: "為什麼要優化 Etsy 列表圖片？",
      content: [
        {
          title: "Etsy 的 1MB 建議以獲得更好的性能",
          text: "Etsy 建議列表圖片低於 1MB 以獲得最佳瀏覽體驗。當您使用專業相機或智能手機拍攝產品照片時，生成的圖片通常為 3-10MB，遠遠超過此建議。大型圖片檔案不僅會導致「檔案太大」上傳錯誤，還會減慢商店的載入速度，特別是在大多數 Etsy 購物者瀏覽的行動裝置上。載入緩慢的商店會損害您的搜尋排名，減少買家參與度，並可能導致銷售損失。Etsy 警告，超過 1MB 的檔案可能無法正確上傳或對買家載入非常緩慢，造成糟糕的購物體驗。我們的瀏覽器壓縮工具使用智能 Canvas API 處理來減少列表圖片檔案大小，同時保留對銷售手工和實體產品至關重要的質感、顏色和細節。"
        },
        {
          title: "保留手工產品細節和顏色",
          text: "Etsy 購物者喜歡看到細節—手工珠寶的質感、藝術印刷品的鮮豔顏色、復古物品的精細工藝。壓縮圖片不應該意味著犧牲這些關鍵的銷售點。Toolaze 的壓縮演算法專門調整以保留質感和顏色，同時大幅減少檔案重量。我們保持顏色準確性和細節清晰度，確保您的手工產品在搜尋結果和產品頁面中看起來最佳。所有處理都在您的瀏覽器中本地進行，因此您獨特的產品設計和攝影永遠不會離開您的設備，確保您的創意作品完全私密和安全。"
        }
      ]
    },
    features: {
      items: [
        {
          title: "1MB 以下目標",
          desc: "將列表圖片壓縮至 1MB 以下。滿足 Etsy 的建議，以加快商店載入速度和改善搜尋排名。"
        },
        {
          title: "100% 私密處理",
          desc: "所有壓縮都在您的瀏覽器中本地進行。您的產品照片和設計永遠不會離開您的設備，確保完全的隱私。"
        },
        {
          title: "批次處理",
          desc: "同時處理最多 100 張列表圖片。在一次操作中優化整個產品目錄，實現高效的商店管理。"
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
          title: "保留顏色和質感",
          desc: "保持鮮豔的顏色和細緻的質感。在減少檔案大小以加快載入速度的同時，讓您的手工產品看起來最佳。"
        }
      ]
    },
    performanceMetrics: {
      metrics: [
        {
          label: "輸入格式",
          value: "JPG、PNG、WebP（產品列表圖片）"
        },
        {
          label: "輸出格式",
          value: "JPG（針對 Etsy 優化，首選格式）"
        },
        {
          label: "檔案大小限制",
          value: "1MB 以下（Etsy 建議）"
        },
        {
          label: "顏色保留",
          value: "保持鮮豔的顏色和質感"
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
      title: "如何優化 Etsy 列表圖片",
      steps: [
        {
          title: "上傳產品照片",
          desc: "拖放您的 Etsy 列表圖片或點擊瀏覽。支援來自相機或設計工具的 JPG、PNG 和 WebP 格式。"
        },
        {
          title: "設定 1MB 以下目標",
          desc: "工具會自動將目標設定為 1MB 以下。我們的演算法在保留顏色和質感的同時壓縮您的圖片。"
        },
        {
          title: "下載優化後的圖片",
          desc: "立即下載您的優化圖片。檔案已準備好上傳到 Etsy，改善您商店的載入速度和搜尋排名。"
        }
      ]
    },
    scenes: [
      {
        title: "手工賣家",
        desc: "優化手工物品的產品照片。保留展示您工藝並吸引買家的質感、顏色和精細細節。"
      },
      {
        title: "行動商店優化",
        desc: "確保您的商店在 Etsy 行動應用程式上快速載入。使用載入更快的列表圖片改善買家體驗和搜尋排名。"
      },
      {
        title: "數位藝術賣家",
        desc: "減少數位藝術檔案的大小，以便更容易交付給客戶。在保持藝術作品顏色準確性的同時優化預覽圖片。"
      }
    ],
    comparison: {
      toolaze: "1MB 以下保證、保留顏色和質感、100% 瀏覽器端處理、無水印或品質損失、批次處理最多 100 張圖片、永久免費",
      others: "隨機檔案大小可能超過 1MB、顏色褪色或質感丟失、需要伺服器上傳、水印或品質下降、有限的批次處理、訂閱費用或廣告"
    },
    rating: {
      text: "\"我的 Etsy 商店現在載入速度快多了！顏色保持鮮豔，質感完美。\" - 加入數千名信賴 Toolaze 保留產品細節的手工賣家。"
    }
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
    
    if (!data['etsy-listing-1mb']) {
      console.log(`⚠️  ${lang}: etsy-listing-1mb section not found`)
      continue
    }
    
    const translation = translations[lang]
    if (!translation) {
      console.log(`⚠️  ${lang}: translation not found`)
      continue
    }
    
    // 深度合并翻译
    data['etsy-listing-1mb'] = deepMerge(data['etsy-listing-1mb'], translation)
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`✅ ${lang}: etsy-listing-1mb fully translated`)
  }
  
  console.log('\n✨ All translations completed!')
}

main().catch(console.error)
