const fs = require('fs');
const path = require('path');

// 翻译模板 - 为每个工具和语言提供翻译
const translations = {
  'jpg-to-20kb': {
    de: {
      intro: { title: 'Warum JPG auf 20KB komprimieren?' },
      features: { title: '20KB JPG-Komprimierungsfunktionen' },
      howToUse: { title: 'Wie man JPG auf 20KB komprimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Comprimir JPG a 20KB?' },
      features: { title: 'Características de Compresión JPG a 20KB' },
      howToUse: { title: 'Cómo Comprimir JPG a 20KB' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Compresser JPG à 20KB?' },
      features: { title: 'Fonctionnalités de Compression JPG à 20KB' },
      howToUse: { title: 'Comment Compresser JPG à 20KB' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Comprimere JPG a 20KB?' },
      features: { title: 'Funzionalità di Compressione JPG a 20KB' },
      howToUse: { title: 'Come Comprimere JPG a 20KB' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'JPGを20KBに圧縮する理由' },
      features: { title: '20KB JPG圧縮機能' },
      howToUse: { title: 'JPGを20KBに圧縮する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: 'JPG를 20KB로 압축하는 이유' },
      features: { title: '20KB JPG 압축 기능' },
      howToUse: { title: 'JPG를 20KB로 압축하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Comprimir JPG para 20KB?' },
      features: { title: 'Recursos de Compressão JPG para 20KB' },
      howToUse: { title: 'Como Comprimir JPG para 20KB' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要將 JPG 壓縮到 20KB？' },
      features: { title: '20KB JPG 壓縮功能' },
      howToUse: { title: '如何將 JPG 壓縮到 20KB' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'png-to-100kb': {
    de: {
      intro: { title: 'Warum PNG auf 100KB komprimieren?' },
      features: { title: 'PNG zu 100KB Komprimierungsfunktionen' },
      howToUse: { title: 'Wie man PNG auf 100KB komprimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Comprimir PNG a 100KB?' },
      features: { title: 'Características de Compresión PNG a 100KB' },
      howToUse: { title: 'Cómo Comprimir PNG a 100KB' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Compresser PNG à 100KB?' },
      features: { title: 'Fonctionnalités de Compression PNG à 100KB' },
      howToUse: { title: 'Comment Compresser PNG à 100KB' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Comprimere PNG a 100KB?' },
      features: { title: 'Funzionalità di Compressione PNG a 100KB' },
      howToUse: { title: 'Come Comprimere PNG a 100KB' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'PNGを100KBに圧縮する理由' },
      features: { title: 'PNGから100KB圧縮機能' },
      howToUse: { title: 'PNGを100KBに圧縮する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: 'PNG를 100KB로 압축하는 이유' },
      features: { title: 'PNG를 100KB로 압축하는 기능' },
      howToUse: { title: 'PNG를 100KB로 압축하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Comprimir PNG para 100KB?' },
      features: { title: 'Recursos de Compressão PNG para 100KB' },
      howToUse: { title: 'Como Comprimir PNG para 100KB' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要將 PNG 壓縮到 100KB？' },
      features: { title: 'PNG 壓縮到 100KB 功能' },
      howToUse: { title: '如何將 PNG 壓縮到 100KB' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'image-to-50kb': {
    de: {
      intro: { title: 'Warum Bilder auf 50KB komprimieren?' },
      features: { title: '50KB Bildkomprimierungsfunktionen' },
      howToUse: { title: 'Wie man Bilder auf 50KB komprimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Comprimir Imágenes a 50KB?' },
      features: { title: 'Características de Compresión de Imágenes a 50KB' },
      howToUse: { title: 'Cómo Comprimir Imágenes a 50KB' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Compresser les Images à 50KB?' },
      features: { title: 'Fonctionnalités de Compression d\'Images à 50KB' },
      howToUse: { title: 'Comment Compresser les Images à 50KB' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Comprimere Immagini a 50KB?' },
      features: { title: 'Funzionalità di Compressione Immagini a 50KB' },
      howToUse: { title: 'Come Comprimere Immagini a 50KB' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: '画像を50KBに圧縮する理由' },
      features: { title: '50KB画像圧縮機能' },
      howToUse: { title: '画像を50KBに圧縮する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: '이미지를 50KB로 압축하는 이유' },
      features: { title: '50KB 이미지 압축 기능' },
      howToUse: { title: '이미지를 50KB로 압축하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Comprimir Imagens para 50KB?' },
      features: { title: 'Recursos de Compressão de Imagens para 50KB' },
      howToUse: { title: 'Como Comprimir Imagens para 50KB' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要將圖片壓縮到 50KB？' },
      features: { title: '50KB 圖片壓縮功能' },
      howToUse: { title: '如何將圖片壓縮到 50KB' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'uscis-photo-240kb': {
    de: {
      intro: { title: 'Warum USCIS-Fotos auf 240KB komprimieren?' },
      features: { title: 'USCIS-Foto 240KB Komprimierungsfunktionen' },
      howToUse: { title: 'Wie man USCIS-Fotos auf 240KB komprimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Comprimir Fotos USCIS a 240KB?' },
      features: { title: 'Características de Compresión de Fotos USCIS a 240KB' },
      howToUse: { title: 'Cómo Comprimir Fotos USCIS a 240KB' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Compresser les Photos USCIS à 240KB?' },
      features: { title: 'Fonctionnalités de Compression de Photos USCIS à 240KB' },
      howToUse: { title: 'Comment Compresser les Photos USCIS à 240KB' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Comprimere Foto USCIS a 240KB?' },
      features: { title: 'Funzionalità di Compressione Foto USCIS a 240KB' },
      howToUse: { title: 'Come Comprimere Foto USCIS a 240KB' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'USCIS写真を240KBに圧縮する理由' },
      features: { title: 'USCIS写真240KB圧縮機能' },
      howToUse: { title: 'USCIS写真を240KBに圧縮する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: 'USCIS 사진을 240KB로 압축하는 이유' },
      features: { title: 'USCIS 사진 240KB 압축 기능' },
      howToUse: { title: 'USCIS 사진을 240KB로 압축하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Comprimir Fotos USCIS para 240KB?' },
      features: { title: 'Recursos de Compressão de Fotos USCIS para 240KB' },
      howToUse: { title: 'Como Comprimir Fotos USCIS para 240KB' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要將 USCIS 照片壓縮到 240KB？' },
      features: { title: 'USCIS 照片 240KB 壓縮功能' },
      howToUse: { title: '如何將 USCIS 照片壓縮到 240KB' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'passport-photo-200kb': {
    de: {
      intro: { title: 'Warum Reisepassfotos auf 200KB komprimieren?' },
      features: { title: 'Reisepassfoto 200KB Komprimierungsfunktionen' },
      howToUse: { title: 'Wie man Reisepassfotos auf 200KB komprimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Comprimir Fotos de Pasaporte a 200KB?' },
      features: { title: 'Características de Compresión de Fotos de Pasaporte a 200KB' },
      howToUse: { title: 'Cómo Comprimir Fotos de Pasaporte a 200KB' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Compresser les Photos de Passeport à 200KB?' },
      features: { title: 'Fonctionnalités de Compression de Photos de Passeport à 200KB' },
      howToUse: { title: 'Comment Compresser les Photos de Passeport à 200KB' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Comprimere Foto del Passaporto a 200KB?' },
      features: { title: 'Funzionalità di Compressione Foto del Passaporto a 200KB' },
      howToUse: { title: 'Come Comprimere Foto del Passaporto a 200KB' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'パスポート写真を200KBに圧縮する理由' },
      features: { title: 'パスポート写真200KB圧縮機能' },
      howToUse: { title: 'パスポート写真を200KBに圧縮する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: '여권 사진을 200KB로 압축하는 이유' },
      features: { title: '여권 사진 200KB 압축 기능' },
      howToUse: { title: '여권 사진을 200KB로 압축하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Comprimir Fotos de Passaporte para 200KB?' },
      features: { title: 'Recursos de Compressão de Fotos de Passaporte para 200KB' },
      howToUse: { title: 'Como Comprimir Fotos de Passaporte para 200KB' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要將護照照片壓縮到 200KB？' },
      features: { title: '護照照片 200KB 壓縮功能' },
      howToUse: { title: '如何將護照照片壓縮到 200KB' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'amazon-product-10mb': {
    de: {
      intro: { title: 'Warum Amazon-Produktbilder optimieren?' },
      features: { title: 'Amazon-Produktbild-Optimierungsfunktionen' },
      howToUse: { title: 'Wie man Amazon-Produktbilder optimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Optimizar Imágenes de Productos de Amazon?' },
      features: { title: 'Características de Optimización de Imágenes de Productos de Amazon' },
      howToUse: { title: 'Cómo Optimizar Imágenes de Productos de Amazon' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Optimiser les Images de Produits Amazon?' },
      features: { title: 'Fonctionnalités d\'Optimisation d\'Images de Produits Amazon' },
      howToUse: { title: 'Comment Optimiser les Images de Produits Amazon' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Ottimizzare le Immagini dei Prodotti Amazon?' },
      features: { title: 'Funzionalità di Ottimizzazione Immagini Prodotti Amazon' },
      howToUse: { title: 'Come Ottimizzare le Immagini dei Prodotti Amazon' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'Amazon商品画像を最適化する理由' },
      features: { title: 'Amazon商品画像最適化機能' },
      howToUse: { title: 'Amazon商品画像を最適化する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: 'Amazon 제품 이미지를 최적화하는 이유' },
      features: { title: 'Amazon 제품 이미지 최적화 기능' },
      howToUse: { title: 'Amazon 제품 이미지를 최적화하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Otimizar Imagens de Produtos da Amazon?' },
      features: { title: 'Recursos de Otimização de Imagens de Produtos da Amazon' },
      howToUse: { title: 'Como Otimizar Imagens de Produtos da Amazon' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要優化 Amazon 產品圖片？' },
      features: { title: 'Amazon 產品圖片優化功能' },
      howToUse: { title: '如何優化 Amazon 產品圖片' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'etsy-listing-1mb': {
    de: {
      intro: { title: 'Warum Etsy-Listings optimieren?' },
      features: { title: 'Etsy-Listing-Optimierungsfunktionen' },
      howToUse: { title: 'Wie man Etsy-Listings optimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Optimizar Listados de Etsy?' },
      features: { title: 'Características de Optimización de Listados de Etsy' },
      howToUse: { title: 'Cómo Optimizar Listados de Etsy' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Optimiser les Listings Etsy?' },
      features: { title: 'Fonctionnalités d\'Optimisation de Listings Etsy' },
      howToUse: { title: 'Comment Optimiser les Listings Etsy' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Ottimizzare gli Annunci Etsy?' },
      features: { title: 'Funzionalità di Ottimizzazione Annunci Etsy' },
      howToUse: { title: 'Come Ottimizzare gli Annunci Etsy' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'Etsyリストを最適化する理由' },
      features: { title: 'Etsyリスト最適化機能' },
      howToUse: { title: 'Etsyリストを最適化する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: 'Etsy 리스팅을 최적화하는 이유' },
      features: { title: 'Etsy 리스팅 최적화 기능' },
      howToUse: { title: 'Etsy 리스팅을 최적화하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Otimizar Listagens do Etsy?' },
      features: { title: 'Recursos de Otimização de Listagens do Etsy' },
      howToUse: { title: 'Como Otimizar Listagens do Etsy' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要優化 Etsy 列表？' },
      features: { title: 'Etsy 列表優化功能' },
      howToUse: { title: '如何優化 Etsy 列表' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'ebay-picture-fast': {
    de: {
      intro: { title: 'Warum eBay-Bilder optimieren?' },
      features: { title: 'eBay-Bild-Optimierungsfunktionen' },
      howToUse: { title: 'Wie man eBay-Bilder optimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Optimizar Imágenes de eBay?' },
      features: { title: 'Características de Optimización de Imágenes de eBay' },
      howToUse: { title: 'Cómo Optimizar Imágenes de eBay' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Optimiser les Images eBay?' },
      features: { title: 'Fonctionnalités d\'Optimisation d\'Images eBay' },
      howToUse: { title: 'Comment Optimiser les Images eBay' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Ottimizzare le Immagini eBay?' },
      features: { title: 'Funzionalità di Ottimizzazione Immagini eBay' },
      howToUse: { title: 'Come Ottimizzare le Immagini eBay' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'eBay画像を最適化する理由' },
      features: { title: 'eBay画像最適化機能' },
      howToUse: { title: 'eBay画像を最適化する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: 'eBay 이미지를 최적화하는 이유' },
      features: { title: 'eBay 이미지 최적화 기능' },
      howToUse: { title: 'eBay 이미지를 최적화하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Otimizar Imagens do eBay?' },
      features: { title: 'Recursos de Otimização de Imagens do eBay' },
      howToUse: { title: 'Como Otimizar Imagens do eBay' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要優化 eBay 圖片？' },
      features: { title: 'eBay 圖片優化功能' },
      howToUse: { title: '如何優化 eBay 圖片' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'youtube-thumbnail-2mb': {
    de: {
      intro: { title: 'Warum YouTube-Thumbnails optimieren?' },
      features: { title: 'YouTube-Thumbnail-Optimierungsfunktionen' },
      howToUse: { title: 'Wie man YouTube-Thumbnails optimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Optimizar Miniaturas de YouTube?' },
      features: { title: 'Características de Optimización de Miniaturas de YouTube' },
      howToUse: { title: 'Cómo Optimizar Miniaturas de YouTube' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Optimiser les Miniatures YouTube?' },
      features: { title: 'Fonctionnalités d\'Optimisation de Miniatures YouTube' },
      howToUse: { title: 'Comment Optimiser les Miniatures YouTube' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Ottimizzare le Miniature di YouTube?' },
      features: { title: 'Funzionalità di Ottimizzazione Miniature YouTube' },
      howToUse: { title: 'Come Ottimizzare le Miniature di YouTube' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'YouTubeサムネイルを最適化する理由' },
      features: { title: 'YouTubeサムネイル最適化機能' },
      howToUse: { title: 'YouTubeサムネイルを最適化する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: 'YouTube 썸네일을 최적화하는 이유' },
      features: { title: 'YouTube 썸네일 최적화 기능' },
      howToUse: { title: 'YouTube 썸네일을 최적화하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Otimizar Miniaturas do YouTube?' },
      features: { title: 'Recursos de Otimização de Miniaturas do YouTube' },
      howToUse: { title: 'Como Otimizar Miniaturas do YouTube' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要優化 YouTube 縮圖？' },
      features: { title: 'YouTube 縮圖優化功能' },
      howToUse: { title: '如何優化 YouTube 縮圖' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'discord-emoji-256kb': {
    de: {
      intro: { title: 'Warum Discord-Emojis optimieren?' },
      features: { title: 'Discord-Emoji-Optimierungsfunktionen' },
      howToUse: { title: 'Wie man Discord-Emojis optimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Optimizar Emojis de Discord?' },
      features: { title: 'Características de Optimización de Emojis de Discord' },
      howToUse: { title: 'Cómo Optimizar Emojis de Discord' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Optimiser les Emojis Discord?' },
      features: { title: 'Fonctionnalités d\'Optimisation d\'Emojis Discord' },
      howToUse: { title: 'Comment Optimiser les Emojis Discord' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Ottimizzare le Emoji Discord?' },
      features: { title: 'Funzionalità di Ottimizzazione Emoji Discord' },
      howToUse: { title: 'Come Ottimizzare le Emoji Discord' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'Discord絵文字を最適化する理由' },
      features: { title: 'Discord絵文字最適化機能' },
      howToUse: { title: 'Discord絵文字を最適化する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: 'Discord 이모지를 최적화하는 이유' },
      features: { title: 'Discord 이모지 최적화 기능' },
      howToUse: { title: 'Discord 이모지를 최적화하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Otimizar Emojis do Discord?' },
      features: { title: 'Recursos de Otimização de Emojis do Discord' },
      howToUse: { title: 'Como Otimizar Emojis do Discord' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要優化 Discord 表情符號？' },
      features: { title: 'Discord 表情符號優化功能' },
      howToUse: { title: '如何優化 Discord 表情符號' },
      performanceMetrics: { title: '技術規格' }
    }
  },
  'email-signature-100kb': {
    de: {
      intro: { title: 'Warum E-Mail-Signaturbilder optimieren?' },
      features: { title: 'E-Mail-Signaturbild-Optimierungsfunktionen' },
      howToUse: { title: 'Wie man E-Mail-Signaturbilder optimiert' },
      performanceMetrics: { title: 'Technische Spezifikationen' }
    },
    es: {
      intro: { title: '¿Por Qué Optimizar Imágenes de Firma de Email?' },
      features: { title: 'Características de Optimización de Imágenes de Firma de Email' },
      howToUse: { title: 'Cómo Optimizar Imágenes de Firma de Email' },
      performanceMetrics: { title: 'Especificaciones Técnicas' }
    },
    fr: {
      intro: { title: 'Pourquoi Optimiser les Images de Signature Email?' },
      features: { title: 'Fonctionnalités d\'Optimisation d\'Images de Signature Email' },
      howToUse: { title: 'Comment Optimiser les Images de Signature Email' },
      performanceMetrics: { title: 'Spécifications Techniques' }
    },
    it: {
      intro: { title: 'Perché Ottimizzare le Immagini della Firma Email?' },
      features: { title: 'Funzionalità di Ottimizzazione Immagini Firma Email' },
      howToUse: { title: 'Come Ottimizzare le Immagini della Firma Email' },
      performanceMetrics: { title: 'Specifiche Tecniche' }
    },
    ja: {
      intro: { title: 'メール署名画像を最適化する理由' },
      features: { title: 'メール署名画像最適化機能' },
      howToUse: { title: 'メール署名画像を最適化する方法' },
      performanceMetrics: { title: '技術仕様' }
    },
    ko: {
      intro: { title: '이메일 서명 이미지를 최적화하는 이유' },
      features: { title: '이메일 서명 이미지 최적화 기능' },
      howToUse: { title: '이메일 서명 이미지를 최적화하는 방법' },
      performanceMetrics: { title: '기술 사양' }
    },
    pt: {
      intro: { title: 'Por Que Otimizar Imagens de Assinatura de Email?' },
      features: { title: 'Recursos de Otimização de Imagens de Assinatura de Email' },
      howToUse: { title: 'Como Otimizar Imagens de Assinatura de Email' },
      performanceMetrics: { title: 'Especificações Técnicas' }
    },
    'zh-TW': {
      intro: { title: '為什麼要優化電子郵件簽名圖片？' },
      features: { title: '電子郵件簽名圖片優化功能' },
      howToUse: { title: '如何優化電子郵件簽名圖片' },
      performanceMetrics: { title: '技術規格' }
    }
  }
};

// 通用翻译 - 用于所有工具
const commonTranslations = {
  'Technical Specifications': {
    de: 'Technische Spezifikationen',
    es: 'Especificaciones Técnicas',
    fr: 'Spécifications Techniques',
    it: 'Specifiche Tecniche',
    ja: '技術仕様',
    ko: '기술 사양',
    pt: 'Especificações Técnicas',
    'zh-TW': '技術規格'
  }
};

const toolsToFix = [
  'jpg-to-20kb',
  'png-to-100kb',
  'image-to-50kb',
  'uscis-photo-240kb',
  'passport-photo-200kb',
  'amazon-product-10mb',
  'etsy-listing-1mb',
  'ebay-picture-fast',
  'youtube-thumbnail-2mb',
  'discord-emoji-256kb',
  'email-signature-100kb'
];

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
  
  toolsToFix.forEach(slug => {
    const enTool = enData[slug];
    const langTool = data[slug];
    
    if (!enTool || !langTool) return;
    
    const toolTranslations = translations[slug]?.[lang];
    
    // 修复 intro.title
    if (enTool.intro?.title && langTool.intro) {
      if (toolTranslations?.intro?.title) {
        if (!langTool.intro.title || langTool.intro.title === enTool.intro.title) {
          langTool.intro.title = toolTranslations.intro.title;
          langFixed++;
        }
      }
    }
    
    // 修复 features.title
    if (enTool.features?.title && langTool.features) {
      if (toolTranslations?.features?.title) {
        if (!langTool.features.title || langTool.features.title === enTool.features.title) {
          langTool.features.title = toolTranslations.features.title;
          langFixed++;
        }
      }
    }
    
    // 修复 howToUse.title
    if (enTool.howToUse?.title && langTool.howToUse) {
      if (toolTranslations?.howToUse?.title) {
        if (!langTool.howToUse.title || langTool.howToUse.title === enTool.howToUse.title) {
          langTool.howToUse.title = toolTranslations.howToUse.title;
          langFixed++;
        }
      }
    }
    
    // 修复 performanceMetrics.title
    if (enTool.performanceMetrics?.title && langTool.performanceMetrics) {
      const translatedTitle = commonTranslations[enTool.performanceMetrics.title]?.[lang] || toolTranslations?.performanceMetrics?.title;
      if (translatedTitle) {
        if (!langTool.performanceMetrics.title || langTool.performanceMetrics.title === enTool.performanceMetrics.title) {
          langTool.performanceMetrics.title = translatedTitle;
          langFixed++;
        }
      }
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${lang}/image-compression.json - Fixed ${langFixed} titles`);
  totalFixed += langFixed;
});

console.log(`\n✨ Total fixed: ${totalFixed} translation titles`);
