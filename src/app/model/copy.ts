import type { Metadata } from 'next'

export const MODEL_PAGE_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type ModelPageLocale = (typeof MODEL_PAGE_LOCALES)[number]

type ModelCard = {
  title: string
  href: string
  description: string
  tags: string[]
  cta: string
  icon: 'chart' | 'text' | 'plainText' | 'image' | 'list'
}

export type ModelPageCopy = {
  metadata: {
    title: string
    description: string
  }
  breadcrumbs: {
    home: string
    current: string
  }
  hero: {
    title: string
    description: string
  }
  cards: ModelCard[]
  about: {
    title: string
    paragraphs: string[]
  }
}

const sharedCards = {
  gptImage2: {
    title: 'GPT Image 2',
    href: '/model/gpt-image-2',
    icon: 'chart' as const,
  },
  wan27Image: {
    title: 'Wan 2.7 Image',
    href: '/model/wan-2-7-image',
    icon: 'text' as const,
  },
  nanoBananaPro: {
    title: 'Nano Banana Pro',
    href: '/model/nano-banana-pro',
    icon: 'image' as const,
  },
  nanoBanana2: {
    title: 'Nano Banana 2',
    href: '/model/nano-banana-2',
    icon: 'list' as const,
  },
  seedream45: {
    title: 'Seedream 4.5',
    href: '/model/seedream-4-5',
    icon: 'plainText' as const,
  },
}

const en: ModelPageCopy = {
  metadata: {
    title: 'AI Models - Image Generation Tools | Toolaze',
    description:
      'Explore Toolaze AI image generation models including GPT Image 2, Wan 2.7 Image, Nano Banana Pro, Nano Banana 2, and Seedream 4.5 for image-to-image, text-to-image, and reference-guided image generation.',
  },
  breadcrumbs: {
    home: 'Home',
    current: 'Model',
  },
  hero: {
    title: 'AI Models',
    description:
      'Compare Toolaze image models for text-to-image, image editing, reference inputs, and high-resolution output.',
  },
  cards: [
    {
      ...sharedCards.gptImage2,
      description:
        'Use GPT Image 2 for text-to-image and image-to-image in one interface. Set aspect ratio and resolution, then generate and download online.',
      tags: ['Image to Image', 'Text to Image', '4K Ready'],
      cta: 'Try GPT Image 2',
    },
    {
      ...sharedCards.wan27Image,
      description:
        'Generate and edit images with Wan 2.7 Image, including thinking mode, multi-reference inputs, structured text layouts, and 2K to 4K creative workflows.',
      tags: ['Text to Image', 'Image Editing', 'Multi-Reference'],
      cta: 'Try Wan 2.7 Image',
    },
    {
      ...sharedCards.nanoBananaPro,
      description:
        'Generate images from text or edit uploaded references with Nano Banana Pro. Use it for product visuals, portraits, and campaign drafts.',
      tags: ['Image to Image', 'Text to Image', 'High Quality'],
      cta: 'Try Nano Banana Pro',
    },
    {
      ...sharedCards.nanoBanana2,
      description:
        'Generate detailed images at high speed with Nano Banana 2. Create from text or edit from reference images with broad aspect ratios and flexible outputs.',
      tags: ['Image to Image', 'Text to Image', 'Fast Generation'],
      cta: 'Try Nano Banana 2',
    },
    {
      ...sharedCards.seedream45,
      description:
        'Create 4K product visuals, poster layouts, typography-rich designs, and reference-guided image edits with Seedream 4.5 on Toolaze.',
      tags: ['Text to Image', 'Image Editing', '4K Output'],
      cta: 'Try Seedream 4.5',
    },
  ],
  about: {
    title: 'About AI Models',
    paragraphs: [
      'Each model on Toolaze fits a different image task, from text-heavy graphics and product visuals to reference-guided edits and quick concept drafts.',
      'Use the model pages to compare settings, try prompts, upload references when supported, and choose the best fit for your image workflow.',
    ],
  },
}

const copies: Record<ModelPageLocale, ModelPageCopy> = {
  en,
  de: {
    metadata: {
      title: 'KI-Modelle - Bildgenerierungstools | Toolaze',
      description:
        'Entdecken Sie Toolaze KI-Bildmodelle wie GPT Image 2, Wan 2.7 Image, Nano Banana Pro, Nano Banana 2 und Seedream 4.5 für Bildbearbeitung, Text-zu-Bild und referenzbasierte Generierung.',
    },
    breadcrumbs: { home: 'Startseite', current: 'Modelle' },
    hero: {
      title: 'KI-Modelle',
      description:
        'Vergleichen Sie Toolaze Bildmodelle für Text-zu-Bild, Bildbearbeitung, Referenzeingaben und hochauflösende Ausgaben.',
    },
    cards: [
      { ...sharedCards.gptImage2, description: 'Nutzen Sie GPT Image 2 für Text-zu-Bild und Bild-zu-Bild in einer Oberfläche. Wählen Sie Seitenverhältnis und Auflösung, erzeugen Sie das Bild und laden Sie es online herunter.', tags: ['Bild zu Bild', 'Text zu Bild', '4K bereit'], cta: 'GPT Image 2 ausprobieren' },
      { ...sharedCards.wan27Image, description: 'Generieren und bearbeiten Sie Bilder mit Wan 2.7 Image, inklusive Thinking Mode, mehreren Referenzen, strukturierten Textlayouts und kreativen Workflows von 2K bis 4K.', tags: ['Text zu Bild', 'Bildbearbeitung', 'Mehrere Referenzen'], cta: 'Wan 2.7 Image ausprobieren' },
      { ...sharedCards.nanoBananaPro, description: 'Erzeugen Sie Bilder aus Text oder bearbeiten Sie hochgeladene Referenzen mit Nano Banana Pro. Ideal für Produktbilder, Porträts und Kampagnenentwürfe.', tags: ['Bild zu Bild', 'Text zu Bild', 'Hohe Qualität'], cta: 'Nano Banana Pro ausprobieren' },
      { ...sharedCards.nanoBanana2, description: 'Erstellen Sie detailreiche Bilder schnell mit Nano Banana 2. Generieren Sie aus Text oder bearbeiten Sie Referenzbilder mit flexiblen Seitenverhältnissen.', tags: ['Bild zu Bild', 'Text zu Bild', 'Schnelle Generierung'], cta: 'Nano Banana 2 ausprobieren' },
      { ...sharedCards.seedream45, description: 'Erstellen Sie 4K-Produktvisuals, Posterlayouts, typografische Designs und referenzgeführte Bildbearbeitungen mit Seedream 4.5 auf Toolaze.', tags: ['Text zu Bild', 'Bildbearbeitung', '4K-Ausgabe'], cta: 'Seedream 4.5 ausprobieren' },
    ],
    about: {
      title: 'Über KI-Modelle',
      paragraphs: [
        'Jedes Modell auf Toolaze passt zu einer anderen Bildaufgabe, von textlastigen Grafiken und Produktvisuals bis zu referenzgeführten Bearbeitungen und schnellen Konzeptentwürfen.',
        'Nutzen Sie die Modellseiten, um Einstellungen zu vergleichen, Prompts zu testen, unterstützte Referenzen hochzuladen und den besten Workflow zu wählen.',
      ],
    },
  },
  ja: {
    metadata: {
      title: 'AIモデル - 画像生成ツール | Toolaze',
      description:
        'GPT Image 2、Wan 2.7 Image、Nano Banana Pro、Nano Banana 2、Seedream 4.5など、画像編集、テキストから画像、参照画像生成に使えるToolazeのAI画像モデルを比較できます。',
    },
    breadcrumbs: { home: 'ホーム', current: 'モデル' },
    hero: {
      title: 'AIモデル',
      description:
        'テキストから画像、画像編集、参照入力、高解像度出力に使えるToolazeの画像モデルを比較できます。',
    },
    cards: [
      { ...sharedCards.gptImage2, description: 'GPT Image 2でテキストから画像生成と画像から画像編集を同じ画面で行えます。比率と解像度を設定し、生成してオンラインでダウンロードできます。', tags: ['画像から画像', 'テキストから画像', '4K対応'], cta: 'GPT Image 2を試す' },
      { ...sharedCards.wan27Image, description: 'Wan 2.7 Imageで画像生成と編集を行えます。Thinking mode、複数参照、構造化テキストレイアウト、2Kから4Kの制作ワークフローに対応します。', tags: ['テキストから画像', '画像編集', '複数参照'], cta: 'Wan 2.7 Imageを試す' },
      { ...sharedCards.nanoBananaPro, description: 'Nano Banana Proでテキストから画像を生成したり、アップロードした参照画像を編集したりできます。商品ビジュアル、ポートレート、キャンペーン案に使えます。', tags: ['画像から画像', 'テキストから画像', '高品質'], cta: 'Nano Banana Proを試す' },
      { ...sharedCards.nanoBanana2, description: 'Nano Banana 2で高速に細かな画像を生成できます。テキスト生成や参照画像編集に対応し、幅広い比率と柔軟な出力を使えます。', tags: ['画像から画像', 'テキストから画像', '高速生成'], cta: 'Nano Banana 2を試す' },
      { ...sharedCards.seedream45, description: 'ToolazeのSeedream 4.5で、4K商品ビジュアル、ポスターレイアウト、文字表現の多いデザイン、参照画像編集を作成できます。', tags: ['テキストから画像', '画像編集', '4K出力'], cta: 'Seedream 4.5を試す' },
    ],
    about: {
      title: 'AIモデルについて',
      paragraphs: [
        'Toolazeの各モデルは、文字の多いグラフィック、商品ビジュアル、参照画像編集、素早いコンセプト作成など、それぞれ異なる画像タスクに向いています。',
        'モデルページで設定を比較し、プロンプトを試し、対応している場合は参照画像をアップロードして、最適な画像ワークフローを選べます。',
      ],
    },
  },
  es: {
    metadata: {
      title: 'Modelos IA - Herramientas de generación de imágenes | Toolaze',
      description:
        'Explora modelos de imagen IA en Toolaze, incluidos GPT Image 2, Wan 2.7 Image, Nano Banana Pro, Nano Banana 2 y Seedream 4.5 para edición, texto a imagen y generación con referencias.',
    },
    breadcrumbs: { home: 'Inicio', current: 'Modelos' },
    hero: {
      title: 'Modelos IA',
      description:
        'Compara modelos de imagen de Toolaze para texto a imagen, edición, entradas de referencia y salida de alta resolución.',
    },
    cards: [
      { ...sharedCards.gptImage2, description: 'Usa GPT Image 2 para texto a imagen e imagen a imagen en una sola interfaz. Configura relación de aspecto y resolución, genera y descarga online.', tags: ['Imagen a imagen', 'Texto a imagen', 'Listo para 4K'], cta: 'Probar GPT Image 2' },
      { ...sharedCards.wan27Image, description: 'Genera y edita imágenes con Wan 2.7 Image, con thinking mode, varias referencias, diseños de texto estructurado y flujos creativos de 2K a 4K.', tags: ['Texto a imagen', 'Edición de imagen', 'Varias referencias'], cta: 'Probar Wan 2.7 Image' },
      { ...sharedCards.nanoBananaPro, description: 'Genera imágenes desde texto o edita referencias subidas con Nano Banana Pro. Úsalo para producto, retratos y borradores de campaña.', tags: ['Imagen a imagen', 'Texto a imagen', 'Alta calidad'], cta: 'Probar Nano Banana Pro' },
      { ...sharedCards.nanoBanana2, description: 'Genera imágenes detalladas rápidamente con Nano Banana 2. Crea desde texto o edita imágenes de referencia con proporciones amplias y salidas flexibles.', tags: ['Imagen a imagen', 'Texto a imagen', 'Generación rápida'], cta: 'Probar Nano Banana 2' },
      { ...sharedCards.seedream45, description: 'Crea visuales de producto en 4K, diseños de póster, composiciones con tipografía y ediciones guiadas por referencia con Seedream 4.5 en Toolaze.', tags: ['Texto a imagen', 'Edición de imagen', 'Salida 4K'], cta: 'Probar Seedream 4.5' },
    ],
    about: {
      title: 'Acerca de los modelos IA',
      paragraphs: [
        'Cada modelo de Toolaze se adapta a una tarea visual distinta, desde gráficos con mucho texto y visuales de producto hasta ediciones con referencia y conceptos rápidos.',
        'Usa las páginas de modelos para comparar ajustes, probar prompts, subir referencias cuando estén disponibles y elegir el mejor flujo de imagen.',
      ],
    },
  },
  'zh-TW': {
    metadata: {
      title: 'AI 模型 - 圖像生成工具 | Toolaze',
      description:
        '探索 Toolaze AI 圖像模型，包括 GPT Image 2、Wan 2.7 Image、Nano Banana Pro、Nano Banana 2 與 Seedream 4.5，適用於圖像編輯、文字生成圖像與參考圖生成。',
    },
    breadcrumbs: { home: '首頁', current: '模型' },
    hero: {
      title: 'AI 模型',
      description:
        '比較 Toolaze 圖像模型，適合文字生成圖像、圖像編輯、參考圖輸入與高解析度輸出。',
    },
    cards: [
      { ...sharedCards.gptImage2, description: '在同一介面使用 GPT Image 2 進行文字生成圖像與圖像轉圖像。設定比例與解析度後，即可線上生成並下載。', tags: ['圖像轉圖像', '文字生成圖像', '支援 4K'], cta: '試用 GPT Image 2' },
      { ...sharedCards.wan27Image, description: '使用 Wan 2.7 Image 生成與編輯圖像，包含 thinking mode、多參考圖、結構化文字版面，以及 2K 到 4K 創作流程。', tags: ['文字生成圖像', '圖像編輯', '多參考圖'], cta: '試用 Wan 2.7 Image' },
      { ...sharedCards.nanoBananaPro, description: '使用 Nano Banana Pro 從文字生成圖像，或編輯上傳的參考圖。適合產品視覺、肖像與活動草稿。', tags: ['圖像轉圖像', '文字生成圖像', '高品質'], cta: '試用 Nano Banana Pro' },
      { ...sharedCards.nanoBanana2, description: '使用 Nano Banana 2 快速生成細節豐富的圖像。可從文字建立，也可依參考圖編輯，支援多種比例與彈性輸出。', tags: ['圖像轉圖像', '文字生成圖像', '快速生成'], cta: '試用 Nano Banana 2' },
      { ...sharedCards.seedream45, description: '在 Toolaze 使用 Seedream 4.5 建立 4K 產品視覺、海報版面、文字豐富的設計與參考圖編輯。', tags: ['文字生成圖像', '圖像編輯', '4K 輸出'], cta: '試用 Seedream 4.5' },
    ],
    about: {
      title: '關於 AI 模型',
      paragraphs: [
        'Toolaze 上的每個模型都適合不同圖像任務，從文字密集圖形、產品視覺，到參考圖編輯與快速概念草稿。',
        '使用模型頁比較設定、測試提示詞、在支援時上傳參考圖，並選擇最適合你的圖像工作流程。',
      ],
    },
  },
  pt: {
    metadata: {
      title: 'Modelos de IA - Ferramentas de geração de imagens | Toolaze',
      description:
        'Explore modelos de imagem com IA no Toolaze, incluindo GPT Image 2, Wan 2.7 Image, Nano Banana Pro, Nano Banana 2 e Seedream 4.5 para edição, texto para imagem e geração com referência.',
    },
    breadcrumbs: { home: 'Início', current: 'Modelos' },
    hero: {
      title: 'Modelos de IA',
      description:
        'Compare modelos de imagem do Toolaze para texto para imagem, edição, entradas de referência e saída em alta resolução.',
    },
    cards: [
      { ...sharedCards.gptImage2, description: 'Use GPT Image 2 para texto para imagem e imagem para imagem em uma interface. Defina proporção e resolução, gere e baixe online.', tags: ['Imagem para imagem', 'Texto para imagem', 'Pronto para 4K'], cta: 'Testar GPT Image 2' },
      { ...sharedCards.wan27Image, description: 'Gere e edite imagens com Wan 2.7 Image, incluindo thinking mode, múltiplas referências, layouts de texto estruturado e fluxos criativos de 2K a 4K.', tags: ['Texto para imagem', 'Edição de imagem', 'Múltiplas referências'], cta: 'Testar Wan 2.7 Image' },
      { ...sharedCards.nanoBananaPro, description: 'Gere imagens a partir de texto ou edite referências enviadas com Nano Banana Pro. Use para produtos, retratos e rascunhos de campanha.', tags: ['Imagem para imagem', 'Texto para imagem', 'Alta qualidade'], cta: 'Testar Nano Banana Pro' },
      { ...sharedCards.nanoBanana2, description: 'Gere imagens detalhadas rapidamente com Nano Banana 2. Crie por texto ou edite referências com várias proporções e saídas flexíveis.', tags: ['Imagem para imagem', 'Texto para imagem', 'Geração rápida'], cta: 'Testar Nano Banana 2' },
      { ...sharedCards.seedream45, description: 'Crie visuais de produto em 4K, layouts de pôster, designs ricos em tipografia e edições guiadas por referência com Seedream 4.5 no Toolaze.', tags: ['Texto para imagem', 'Edição de imagem', 'Saída 4K'], cta: 'Testar Seedream 4.5' },
    ],
    about: {
      title: 'Sobre modelos de IA',
      paragraphs: [
        'Cada modelo no Toolaze atende a uma tarefa visual diferente, de gráficos com muito texto e visuais de produto a edições com referência e conceitos rápidos.',
        'Use as páginas dos modelos para comparar configurações, testar prompts, enviar referências quando houver suporte e escolher o melhor fluxo de imagem.',
      ],
    },
  },
  fr: {
    metadata: {
      title: 'Modèles IA - Outils de génération d’images | Toolaze',
      description:
        'Explorez les modèles d’image IA de Toolaze, dont GPT Image 2, Wan 2.7 Image, Nano Banana Pro, Nano Banana 2 et Seedream 4.5 pour l’édition, le texte vers image et la génération guidée par référence.',
    },
    breadcrumbs: { home: 'Accueil', current: 'Modèles' },
    hero: {
      title: 'Modèles IA',
      description:
        'Comparez les modèles d’image Toolaze pour le texte vers image, l’édition, les références et la sortie haute résolution.',
    },
    cards: [
      { ...sharedCards.gptImage2, description: 'Utilisez GPT Image 2 pour le texte vers image et l’image vers image dans une seule interface. Réglez le ratio et la résolution, puis générez et téléchargez en ligne.', tags: ['Image vers image', 'Texte vers image', 'Compatible 4K'], cta: 'Essayer GPT Image 2' },
      { ...sharedCards.wan27Image, description: 'Générez et modifiez des images avec Wan 2.7 Image, avec thinking mode, références multiples, mises en page textuelles structurées et workflows créatifs de 2K à 4K.', tags: ['Texte vers image', 'Édition d’image', 'Références multiples'], cta: 'Essayer Wan 2.7 Image' },
      { ...sharedCards.nanoBananaPro, description: 'Générez des images depuis du texte ou modifiez des références importées avec Nano Banana Pro. Idéal pour produits, portraits et brouillons de campagne.', tags: ['Image vers image', 'Texte vers image', 'Haute qualité'], cta: 'Essayer Nano Banana Pro' },
      { ...sharedCards.nanoBanana2, description: 'Générez rapidement des images détaillées avec Nano Banana 2. Créez depuis du texte ou modifiez des références avec de nombreux ratios et sorties flexibles.', tags: ['Image vers image', 'Texte vers image', 'Génération rapide'], cta: 'Essayer Nano Banana 2' },
      { ...sharedCards.seedream45, description: 'Créez des visuels produit 4K, affiches, designs riches en typographie et éditions guidées par référence avec Seedream 4.5 sur Toolaze.', tags: ['Texte vers image', 'Édition d’image', 'Sortie 4K'], cta: 'Essayer Seedream 4.5' },
    ],
    about: {
      title: 'À propos des modèles IA',
      paragraphs: [
        'Chaque modèle Toolaze convient à une tâche visuelle différente, des graphismes riches en texte et visuels produit aux éditions guidées par référence et concepts rapides.',
        'Utilisez les pages de modèles pour comparer les réglages, tester des prompts, importer des références lorsque c’est pris en charge et choisir le meilleur workflow d’image.',
      ],
    },
  },
  ko: {
    metadata: {
      title: 'AI 모델 - 이미지 생성 도구 | Toolaze',
      description:
        'GPT Image 2, Wan 2.7 Image, Nano Banana Pro, Nano Banana 2, Seedream 4.5 등 Toolaze AI 이미지 모델을 이미지 편집, 텍스트 이미지 생성, 참조 기반 생성용으로 살펴보세요.',
    },
    breadcrumbs: { home: '홈', current: '모델' },
    hero: {
      title: 'AI 모델',
      description:
        '텍스트 이미지 생성, 이미지 편집, 참조 입력, 고해상도 출력을 위한 Toolaze 이미지 모델을 비교하세요.',
    },
    cards: [
      { ...sharedCards.gptImage2, description: 'GPT Image 2로 텍스트 이미지 생성과 이미지 기반 편집을 하나의 화면에서 사용할 수 있습니다. 비율과 해상도를 설정하고 온라인에서 생성 및 다운로드하세요.', tags: ['이미지 기반 편집', '텍스트 이미지 생성', '4K 지원'], cta: 'GPT Image 2 사용하기' },
      { ...sharedCards.wan27Image, description: 'Wan 2.7 Image로 이미지를 생성하고 편집하세요. thinking mode, 다중 참조, 구조화된 텍스트 레이아웃, 2K에서 4K까지의 제작 흐름을 지원합니다.', tags: ['텍스트 이미지 생성', '이미지 편집', '다중 참조'], cta: 'Wan 2.7 Image 사용하기' },
      { ...sharedCards.nanoBananaPro, description: 'Nano Banana Pro로 텍스트에서 이미지를 만들거나 업로드한 참조를 편집하세요. 제품 이미지, 인물 사진, 캠페인 초안에 적합합니다.', tags: ['이미지 기반 편집', '텍스트 이미지 생성', '고품질'], cta: 'Nano Banana Pro 사용하기' },
      { ...sharedCards.nanoBanana2, description: 'Nano Banana 2로 세부 묘사가 풍부한 이미지를 빠르게 생성하세요. 텍스트 생성과 참조 이미지 편집을 넓은 비율과 유연한 출력으로 사용할 수 있습니다.', tags: ['이미지 기반 편집', '텍스트 이미지 생성', '빠른 생성'], cta: 'Nano Banana 2 사용하기' },
      { ...sharedCards.seedream45, description: 'Toolaze에서 Seedream 4.5로 4K 제품 비주얼, 포스터 레이아웃, 타이포그래피 중심 디자인, 참조 기반 편집을 만드세요.', tags: ['텍스트 이미지 생성', '이미지 편집', '4K 출력'], cta: 'Seedream 4.5 사용하기' },
    ],
    about: {
      title: 'AI 모델 소개',
      paragraphs: [
        'Toolaze의 각 모델은 텍스트가 많은 그래픽, 제품 비주얼, 참조 기반 편집, 빠른 콘셉트 초안 등 서로 다른 이미지 작업에 맞춰져 있습니다.',
        '모델 페이지에서 설정을 비교하고, 프롬프트를 테스트하고, 지원되는 경우 참조 이미지를 업로드해 가장 알맞은 이미지 워크플로를 선택하세요.',
      ],
    },
  },
  it: {
    metadata: {
      title: 'Modelli IA - Strumenti di generazione immagini | Toolaze',
      description:
        'Esplora i modelli immagine IA di Toolaze, tra cui GPT Image 2, Wan 2.7 Image, Nano Banana Pro, Nano Banana 2 e Seedream 4.5 per editing, testo in immagine e generazione con riferimenti.',
    },
    breadcrumbs: { home: 'Home', current: 'Modelli' },
    hero: {
      title: 'Modelli IA',
      description:
        'Confronta i modelli immagine Toolaze per testo in immagine, editing, input di riferimento e output ad alta risoluzione.',
    },
    cards: [
      { ...sharedCards.gptImage2, description: 'Usa GPT Image 2 per testo in immagine e immagine in immagine in un’unica interfaccia. Imposta rapporto e risoluzione, poi genera e scarica online.', tags: ['Immagine in immagine', 'Testo in immagine', 'Pronto per 4K'], cta: 'Prova GPT Image 2' },
      { ...sharedCards.wan27Image, description: 'Genera e modifica immagini con Wan 2.7 Image, inclusi thinking mode, input multi-riferimento, layout testuali strutturati e workflow creativi da 2K a 4K.', tags: ['Testo in immagine', 'Editing immagine', 'Multi-riferimento'], cta: 'Prova Wan 2.7 Image' },
      { ...sharedCards.nanoBananaPro, description: 'Genera immagini da testo o modifica riferimenti caricati con Nano Banana Pro. Usalo per prodotti, ritratti e bozze di campagna.', tags: ['Immagine in immagine', 'Testo in immagine', 'Alta qualità'], cta: 'Prova Nano Banana Pro' },
      { ...sharedCards.nanoBanana2, description: 'Genera rapidamente immagini dettagliate con Nano Banana 2. Crea da testo o modifica riferimenti con rapporti ampi e output flessibili.', tags: ['Immagine in immagine', 'Testo in immagine', 'Generazione rapida'], cta: 'Prova Nano Banana 2' },
      { ...sharedCards.seedream45, description: 'Crea visual di prodotto 4K, layout poster, design ricchi di tipografia ed editing guidato da riferimento con Seedream 4.5 su Toolaze.', tags: ['Testo in immagine', 'Editing immagine', 'Output 4K'], cta: 'Prova Seedream 4.5' },
    ],
    about: {
      title: 'Informazioni sui modelli IA',
      paragraphs: [
        'Ogni modello su Toolaze è adatto a un compito visivo diverso, da grafiche ricche di testo e visual prodotto a editing con riferimento e bozze concettuali rapide.',
        'Usa le pagine dei modelli per confrontare impostazioni, provare prompt, caricare riferimenti quando supportati e scegliere il workflow immagine migliore.',
      ],
    },
  },
}

const modelHubSummaries: Record<ModelPageLocale, {
  metadataTitle: string
  metadataDescription: string
  heroDescription: string
  aboutParagraphs: string[]
}> = {
  en: {
    metadataTitle: 'AI Models - Image and Video Generation | Toolaze',
    metadataDescription: 'Compare Toolaze AI image and video models for text-to-image, image editing, text-to-video, and image-to-video generation.',
    heroDescription: 'Compare all Toolaze AI image and video models, then choose the best model for your generation workflow.',
    aboutParagraphs: ['Each Toolaze model fits a different image or video task, from reference-guided edits and product visuals to cinematic motion and quick concept drafts.', 'Use the model pages to compare capabilities, inputs, output settings, and quality ratings before choosing the best fit for your workflow.'],
  },
  de: {
    metadataTitle: 'KI-Modelle für Bild- und Videogenerierung | Toolaze',
    metadataDescription: 'Vergleichen Sie Toolaze KI-Modelle für Bilder und Videos, von Text-zu-Bild und Bildbearbeitung bis Text-zu-Video und Bild-zu-Video.',
    heroDescription: 'Vergleichen Sie alle Toolaze KI-Modelle für Bilder und Videos und wählen Sie das passende Modell für Ihren Workflow.',
    aboutParagraphs: ['Jedes Toolaze Modell passt zu einer anderen Bild- oder Videoaufgabe, von referenzbasierten Bearbeitungen und Produktvisuals bis zu filmischer Bewegung und schnellen Konzeptentwürfen.', 'Vergleichen Sie auf den Modellseiten Funktionen, Eingaben, Ausgabeeinstellungen und Qualitätsbewertungen, bevor Sie das passende Modell wählen.'],
  },
  ja: {
    metadataTitle: '画像・動画生成AIモデル | Toolaze',
    metadataDescription: 'テキストから画像、画像編集、テキストから動画、画像から動画に対応するToolazeのAIモデルを比較できます。',
    heroDescription: 'Toolazeの画像・動画AIモデルをまとめて比較し、制作ワークフローに最適なモデルを選べます。',
    aboutParagraphs: ['Toolazeの各モデルは、参照画像編集や商品ビジュアルから映画的な動き、素早いコンセプト作成まで、異なる画像・動画タスクに適しています。', 'モデルページで機能、入力、出力設定、品質評価を比較し、ワークフローに最適なモデルを選べます。'],
  },
  es: {
    metadataTitle: 'Modelos IA para generar imágenes y videos | Toolaze',
    metadataDescription: 'Compara modelos IA de Toolaze para texto a imagen, edición, texto a video e imagen a video.',
    heroDescription: 'Compara todos los modelos IA de imagen y video de Toolaze y elige el mejor para tu flujo de generación.',
    aboutParagraphs: ['Cada modelo de Toolaze se adapta a una tarea de imagen o video distinta, desde ediciones con referencias y visuales de producto hasta movimiento cinematográfico y conceptos rápidos.', 'Compara capacidades, entradas, ajustes de salida y puntuaciones de calidad en cada página antes de elegir el mejor modelo.'],
  },
  'zh-TW': {
    metadataTitle: 'AI 圖像與影片生成模型 | Toolaze',
    metadataDescription: '比較 Toolaze AI 圖像與影片模型，涵蓋文字生成圖像、圖像編輯、文字生成影片與圖像生成影片。',
    heroDescription: '比較 Toolaze 的所有 AI 圖像與影片模型，並為你的生成工作流程選擇最合適的模型。',
    aboutParagraphs: ['每個 Toolaze 模型都適合不同的圖像或影片任務，從參考圖編輯與產品視覺，到電影感動態與快速概念草稿。', '在模型頁比較功能、輸入、輸出設定與品質評分，再選擇最適合工作流程的模型。'],
  },
  pt: {
    metadataTitle: 'Modelos de IA para gerar imagens e vídeos | Toolaze',
    metadataDescription: 'Compare modelos de IA do Toolaze para texto em imagem, edição, texto em vídeo e imagem em vídeo.',
    heroDescription: 'Compare todos os modelos de IA de imagem e vídeo do Toolaze e escolha o melhor para seu fluxo de geração.',
    aboutParagraphs: ['Cada modelo do Toolaze atende a uma tarefa diferente de imagem ou vídeo, de edições com referência e visuais de produto a movimento cinematográfico e conceitos rápidos.', 'Compare recursos, entradas, configurações de saída e avaliações de qualidade nas páginas dos modelos antes de escolher o melhor para seu fluxo.'],
  },
  fr: {
    metadataTitle: 'Modèles IA de génération d’images et de vidéos | Toolaze',
    metadataDescription: 'Comparez les modèles IA Toolaze pour le texte vers image, la retouche, le texte vers vidéo et l’image vers vidéo.',
    heroDescription: 'Comparez tous les modèles IA d’image et de vidéo de Toolaze et choisissez le meilleur pour votre workflow.',
    aboutParagraphs: ['Chaque modèle Toolaze convient à une tâche d’image ou de vidéo différente, des retouches guidées par référence aux visuels produit, mouvements cinématographiques et concepts rapides.', 'Comparez les capacités, les entrées, les réglages de sortie et les notes de qualité avant de choisir le modèle adapté à votre workflow.'],
  },
  ko: {
    metadataTitle: 'AI 이미지 및 동영상 생성 모델 | Toolaze',
    metadataDescription: '텍스트 이미지, 이미지 편집, 텍스트 동영상 및 이미지 동영상 생성을 위한 Toolaze AI 모델을 비교하세요.',
    heroDescription: 'Toolaze의 모든 AI 이미지 및 동영상 모델을 비교하고 생성 워크플로에 가장 적합한 모델을 선택하세요.',
    aboutParagraphs: ['각 Toolaze 모델은 참조 이미지 편집과 제품 비주얼부터 시네마틱 모션과 빠른 콘셉트 초안까지 서로 다른 이미지 또는 동영상 작업에 적합합니다.', '모델 페이지에서 기능, 입력, 출력 설정 및 품질 평점을 비교한 뒤 워크플로에 가장 적합한 모델을 선택하세요.'],
  },
  it: {
    metadataTitle: 'Modelli IA per generare immagini e video | Toolaze',
    metadataDescription: 'Confronta i modelli IA Toolaze per testo in immagine, editing, testo in video e immagine in video.',
    heroDescription: 'Confronta tutti i modelli IA di immagine e video di Toolaze e scegli il migliore per il tuo workflow.',
    aboutParagraphs: ['Ogni modello Toolaze è adatto a un diverso compito di immagine o video, dall’editing con riferimenti e visual prodotto al movimento cinematografico e ai concept rapidi.', 'Confronta capacità, input, impostazioni di output e valutazioni di qualità nelle pagine dei modelli prima di scegliere quello più adatto.'],
  },
}

export function isModelPageLocale(locale: string): locale is ModelPageLocale {
  return MODEL_PAGE_LOCALES.includes(locale as ModelPageLocale)
}

export function getModelPageCopy(locale = 'en'): ModelPageCopy {
  const resolvedLocale = isModelPageLocale(locale) ? locale : 'en'
  const copy = copies[resolvedLocale]
  const summary = modelHubSummaries[resolvedLocale]

  return {
    ...copy,
    metadata: {
      title: summary.metadataTitle,
      description: summary.metadataDescription,
    },
    hero: {
      ...copy.hero,
      description: summary.heroDescription,
    },
    about: {
      ...copy.about,
      paragraphs: summary.aboutParagraphs,
    },
  }
}

export function getModelPageMetadata(
  locale = 'en',
  canonicalUrl = 'https://toolaze.com/model',
): Metadata {
  const copy = getModelPageCopy(locale)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
