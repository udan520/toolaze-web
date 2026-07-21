import type { Metadata } from 'next'

export const AI_TOOLS_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type AiToolsLocale = (typeof AI_TOOLS_LOCALES)[number]

type AiToolsCard = {
  title: string
  href: string
  image: string
  description: string
}

type AiToolsPageCopy = {
  metadata: {
    title: string
    description: string
  }
  breadcrumbs: {
    home: string
    current: string
  }
  hero: {
    prefix: string
    highlight: string
    description: string
  }
  cards: AiToolsCard[]
}

const cardAssets = {
  aiImage:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/gpt-image-2.jpg',
  aiVideo:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/seedance-2.jpg',
  worldCup:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp',
  watermark:
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  restoration:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  couple: '/ai-couple-photo-maker/rainy-eiffel-4x3.jpg',
  baby: '/ai-baby-generator/hero-baby-portrait.webp',
}

const en: AiToolsPageCopy = {
  metadata: {
    title: 'AI Tools - AI Image Generator, AI Baby, Watermark Remover & Photo Restoration | Toolaze',
    description:
      'Explore Toolaze AI tools with visual previews. Use the free AI Image Generator, AI Baby Generator, Watermark Remover, Photo Restoration, AI Couple Photo Maker, and World Cup AI Image Generator online.',
  },
  breadcrumbs: {
    home: 'Home',
    current: 'AI Tools',
  },
  hero: {
    prefix: 'AI',
    highlight: 'Tools',
    description:
      'Use AI-powered image tools with clear visual previews. Choose a feature and start in seconds.',
  },
  cards: [
    {
      title: 'AI Image Generator',
      href: '/ai-image-generator',
      image: cardAssets.aiImage,
      description: 'Create high-quality AI images online from text prompts for ads, posters, concepts, and social visuals.',
    },
    {
      title: 'AI Video Generator',
      href: '/ai-video-generator',
      image: cardAssets.aiVideo,
      description: 'Create short AI videos online from text, images, video clips, or audio references.',
    },
    {
      title: 'World Cup AI Image Generator',
      href: '/world-cup-ai-image-generator',
      image: cardAssets.worldCup,
      description: 'Create football posters, fan edits, sticker packs, and social images with GPT Image 2.',
    },
    {
      title: 'Watermark Remover',
      href: '/watermark-remover',
      image: cardAssets.watermark,
      description: 'Remove watermarks from photos online with AI in one click.',
    },
    {
      title: 'Photo Restoration',
      href: '/photo-restoration',
      image: cardAssets.restoration,
      description: 'Restore and colorize old photos with AI while improving detail.',
    },
    {
      title: 'AI Couple Photo Maker',
      href: '/ai-couple-photo-maker',
      image: cardAssets.couple,
      description: 'Upload one or two photos and generate romantic couple portraits with scene templates.',
    },
    {
      title: 'AI Baby Generator',
      href: '/ai-baby-generator',
      image: cardAssets.baby,
      description: 'Upload parent or couple photos and create playful fictional baby portraits with GPT Image 2.',
    },
  ],
}

const copies: Record<AiToolsLocale, AiToolsPageCopy> = {
  en,
  de: {
    metadata: {
      title: 'KI-Tools - KI-Bildgenerator, Wasserzeichen-Entferner & Fotorestaurierung | Toolaze',
      description:
        'Entdecken Sie Toolaze KI-Tools mit visuellen Vorschauen. Nutzen Sie den kostenlosen KI-Bildgenerator, Wasserzeichen-Entferner, die Fotorestaurierung und den KI-Paarfoto-Generator online.',
    },
    breadcrumbs: { home: 'Startseite', current: 'KI-Tools' },
    hero: {
      prefix: 'KI',
      highlight: 'Tools',
      description: 'Nutzen Sie KI-Bildtools mit klaren visuellen Vorschauen. Wählen Sie eine Funktion und starten Sie in Sekunden.',
    },
    cards: [
      { ...en.cards[0], title: 'KI-Bildgenerator', description: 'Erstellen Sie hochwertige KI-Bilder online aus Textprompts für Anzeigen, Poster, Konzepte und Social-Media-Visuals.' },
      { ...en.cards[1], title: 'World Cup KI-Bildgenerator', description: 'Erstellen Sie Fußballposter, Fan-Edits, Stickerpakete und Social-Media-Bilder mit GPT Image 2.' },
      { ...en.cards[2], title: 'Wasserzeichen-Entferner', description: 'Entfernen Sie Wasserzeichen aus Fotos online mit KI in einem Klick.' },
      { ...en.cards[3], title: 'Fotorestaurierung', description: 'Restaurieren und kolorieren Sie alte Fotos mit KI und verbessern Sie Details.' },
      { ...en.cards[4], title: 'KI-Paarfoto-Generator', description: 'Laden Sie ein oder zwei Fotos hoch und erstellen Sie romantische Paarporträts mit Szenenvorlagen.' },
      { ...en.cards[5], title: 'KI-Babygenerator', description: 'Laden Sie Eltern- oder Paarfotos hoch und erstellen Sie spielerische fiktive Babyporträts mit GPT Image 2.' },
    ],
  },
  ja: {
    metadata: {
      title: 'AIツール - AI画像生成、透かし削除、写真修復 | Toolaze',
      description:
        'ToolazeのAIツールを視覚プレビュー付きで探せます。無料のAI画像生成、透かし削除、写真修復、AIカップル写真メーカーをオンラインで使えます。',
    },
    breadcrumbs: { home: 'ホーム', current: 'AIツール' },
    hero: {
      prefix: 'AI',
      highlight: 'ツール',
      description: '見やすいプレビュー付きのAI画像ツールを選び、数秒で作成を始められます。',
    },
    cards: [
      { ...en.cards[0], title: 'AI画像生成', description: '広告、ポスター、コンセプト、SNS向けに、テキストプロンプトから高品質なAI画像をオンライン作成できます。' },
      { ...en.cards[1], title: 'ワールドカップAI画像生成', description: 'GPT Image 2でサッカーポスター、ファン編集、ステッカー、SNS画像を作成できます。' },
      { ...en.cards[2], title: '透かし削除', description: '写真の透かしをAIでオンライン削除できます。' },
      { ...en.cards[3], title: '写真修復', description: '古い写真をAIで修復・カラー化し、細部を改善できます。' },
      { ...en.cards[4], title: 'AIカップル写真メーカー', description: '1枚または2枚の写真をアップロードし、シーンテンプレートでロマンチックなカップル写真を生成できます。' },
      { ...en.cards[5], title: 'AIベビージェネレーター', description: '親またはカップルの写真をアップロードし、GPT Image 2で架空のベビーポートレートを作成できます。' },
    ],
  },
  es: {
    metadata: {
      title: 'Herramientas IA - Generador de imágenes, quitamarcas y restauración | Toolaze',
      description:
        'Explora las herramientas IA de Toolaze con vistas previas visuales. Usa gratis el generador de imágenes, el quitamarcas, la restauración de fotos y el creador de fotos de pareja.',
    },
    breadcrumbs: { home: 'Inicio', current: 'Herramientas IA' },
    hero: {
      prefix: 'Herramientas',
      highlight: 'IA',
      description: 'Usa herramientas de imagen con IA y vistas previas claras. Elige una función y empieza en segundos.',
    },
    cards: [
      { ...en.cards[0], title: 'Generador de imágenes IA', description: 'Crea imágenes IA online de alta calidad desde prompts para anuncios, pósteres, conceptos y redes sociales.' },
      { ...en.cards[1], title: 'Generador IA de imágenes del Mundial', description: 'Crea pósteres de fútbol, ediciones de fans, stickers e imágenes sociales con GPT Image 2.' },
      { ...en.cards[2], title: 'Quitamarcas de agua', description: 'Elimina marcas de agua de fotos online con IA en un clic.' },
      { ...en.cards[3], title: 'Restauración de fotos', description: 'Restaura y colorea fotos antiguas con IA mientras mejoras los detalles.' },
      { ...en.cards[4], title: 'Creador IA de fotos de pareja', description: 'Sube una o dos fotos y genera retratos románticos de pareja con plantillas de escena.' },
      { ...en.cards[5], title: 'Generador de bebés IA', description: 'Sube fotos de padres o pareja y crea retratos ficticios de bebé con GPT Image 2.' },
    ],
  },
  'zh-TW': {
    metadata: {
      title: 'AI 工具 - AI 圖像生成、去浮水印與照片修復 | Toolaze',
      description:
        '探索 Toolaze AI 工具與清楚的視覺預覽。線上使用免費 AI 圖像生成器、去浮水印、照片修復與 AI 情侶照片生成器。',
    },
    breadcrumbs: { home: '首頁', current: 'AI 工具' },
    hero: {
      prefix: 'AI',
      highlight: '工具',
      description: '使用具備清楚視覺預覽的 AI 圖像工具。選擇功能後即可在數秒內開始。',
    },
    cards: [
      { ...en.cards[0], title: 'AI 圖像生成器', description: '從文字提示詞線上建立高品質 AI 圖像，適合廣告、海報、概念與社群視覺。' },
      { ...en.cards[1], title: '世界盃 AI 圖像生成器', description: '使用 GPT Image 2 製作足球海報、球迷改圖、貼圖包與社群圖片。' },
      { ...en.cards[2], title: '去浮水印', description: '使用 AI 一鍵線上移除照片浮水印。' },
      { ...en.cards[3], title: '照片修復', description: '使用 AI 修復舊照片、上色並改善細節。' },
      { ...en.cards[4], title: 'AI 情侶照片生成器', description: '上傳一張或兩張照片，透過場景範本生成浪漫情侶肖像。' },
      { ...en.cards[5], title: 'AI 寶寶生成器', description: '上傳父母或情侶照片，使用 GPT Image 2 建立趣味虛構寶寶肖像。' },
    ],
  },
  pt: {
    metadata: {
      title: 'Ferramentas de IA - Gerador de imagens, removedor de marca d’água e restauração | Toolaze',
      description:
        'Explore as ferramentas de IA do Toolaze com prévias visuais. Use online o gerador de imagens, removedor de marca d’água, restauração de fotos e criador de fotos de casal.',
    },
    breadcrumbs: { home: 'Início', current: 'Ferramentas de IA' },
    hero: {
      prefix: 'Ferramentas',
      highlight: 'de IA',
      description: 'Use ferramentas de imagem com IA e prévias claras. Escolha um recurso e comece em segundos.',
    },
    cards: [
      { ...en.cards[0], title: 'Gerador de imagens com IA', description: 'Crie imagens de IA online em alta qualidade a partir de prompts para anúncios, pôsteres, conceitos e redes sociais.' },
      { ...en.cards[1], title: 'Gerador de imagens da Copa com IA', description: 'Crie pôsteres de futebol, edições de fãs, pacotes de figurinhas e imagens sociais com GPT Image 2.' },
      { ...en.cards[2], title: 'Removedor de marca d’água', description: 'Remova marcas d’água de fotos online com IA em um clique.' },
      { ...en.cards[3], title: 'Restauração de fotos', description: 'Restaure e colorize fotos antigas com IA enquanto melhora os detalhes.' },
      { ...en.cards[4], title: 'Criador de fotos de casal com IA', description: 'Envie uma ou duas fotos e gere retratos românticos de casal com modelos de cena.' },
      { ...en.cards[5], title: 'Gerador de bebê IA', description: 'Envie fotos dos pais ou do casal e crie retratos fictícios de bebê com GPT Image 2.' },
    ],
  },
  fr: {
    metadata: {
      title: 'Outils IA - Générateur d’images, suppression de filigrane et restauration photo | Toolaze',
      description:
        'Explorez les outils IA de Toolaze avec des aperçus visuels. Utilisez le générateur d’images, la suppression de filigrane, la restauration photo et le créateur de photos de couple.',
    },
    breadcrumbs: { home: 'Accueil', current: 'Outils IA' },
    hero: {
      prefix: 'Outils',
      highlight: 'IA',
      description: 'Utilisez des outils d’image IA avec des aperçus clairs. Choisissez une fonction et démarrez en quelques secondes.',
    },
    cards: [
      { ...en.cards[0], title: 'Générateur d’images IA', description: 'Créez en ligne des images IA de qualité à partir de prompts pour annonces, affiches, concepts et réseaux sociaux.' },
      { ...en.cards[1], title: 'Générateur d’images IA Coupe du Monde', description: 'Créez des affiches de football, montages de fans, packs de stickers et visuels sociaux avec GPT Image 2.' },
      { ...en.cards[2], title: 'Suppression de filigrane', description: 'Supprimez les filigranes des photos en ligne avec l’IA en un clic.' },
      { ...en.cards[3], title: 'Restauration photo', description: 'Restaurez et colorisez d’anciennes photos avec l’IA tout en améliorant les détails.' },
      { ...en.cards[4], title: 'Créateur IA de photos de couple', description: 'Importez une ou deux photos et générez des portraits romantiques de couple avec des modèles de scène.' },
      { ...en.cards[5], title: 'Générateur de bébé IA', description: 'Importez des photos de parents ou de couple et créez des portraits fictifs de bébé avec GPT Image 2.' },
    ],
  },
  ko: {
    metadata: {
      title: 'AI 도구 - AI 이미지 생성기, 워터마크 제거, 사진 복원 | Toolaze',
      description:
        '시각 미리보기가 있는 Toolaze AI 도구를 살펴보세요. 무료 AI 이미지 생성기, 워터마크 제거, 사진 복원, AI 커플 사진 제작 도구를 온라인에서 사용할 수 있습니다.',
    },
    breadcrumbs: { home: '홈', current: 'AI 도구' },
    hero: {
      prefix: 'AI',
      highlight: '도구',
      description: '명확한 미리보기가 있는 AI 이미지 도구를 사용하세요. 기능을 선택하고 몇 초 만에 시작할 수 있습니다.',
    },
    cards: [
      { ...en.cards[0], title: 'AI 이미지 생성기', description: '광고, 포스터, 콘셉트, 소셜 비주얼용 고품질 AI 이미지를 텍스트 프롬프트로 온라인 생성하세요.' },
      { ...en.cards[1], title: '월드컵 AI 이미지 생성기', description: 'GPT Image 2로 축구 포스터, 팬 편집 이미지, 스티커 팩, 소셜 이미지를 만드세요.' },
      { ...en.cards[2], title: '워터마크 제거', description: 'AI로 사진의 워터마크를 온라인에서 한 번에 제거하세요.' },
      { ...en.cards[3], title: '사진 복원', description: 'AI로 오래된 사진을 복원하고 색을 입히며 디테일을 개선하세요.' },
      { ...en.cards[4], title: 'AI 커플 사진 제작', description: '사진 한 장 또는 두 장을 업로드하고 장면 템플릿으로 로맨틱한 커플 초상화를 생성하세요.' },
      { ...en.cards[5], title: 'AI 아기 생성기', description: '부모 또는 커플 사진을 업로드하고 GPT Image 2로 가상의 아기 초상화를 만드세요.' },
    ],
  },
  it: {
    metadata: {
      title: 'Strumenti IA - Generatore immagini, rimozione watermark e restauro foto | Toolaze',
      description:
        'Esplora gli strumenti IA di Toolaze con anteprime visive. Usa online il generatore di immagini, il rimuovi watermark, il restauro foto e il creatore di foto di coppia.',
    },
    breadcrumbs: { home: 'Home', current: 'Strumenti IA' },
    hero: {
      prefix: 'Strumenti',
      highlight: 'IA',
      description: 'Usa strumenti per immagini con IA e anteprime chiare. Scegli una funzione e inizia in pochi secondi.',
    },
    cards: [
      { ...en.cards[0], title: 'Generatore di immagini IA', description: 'Crea online immagini IA di alta qualità da prompt per annunci, poster, concept e visual social.' },
      { ...en.cards[1], title: 'Generatore immagini IA Mondiali', description: 'Crea poster calcistici, fan edit, pacchetti sticker e immagini social con GPT Image 2.' },
      { ...en.cards[2], title: 'Rimuovi watermark', description: 'Rimuovi watermark dalle foto online con IA in un clic.' },
      { ...en.cards[3], title: 'Restauro foto', description: 'Restaura e colora vecchie foto con IA migliorandone i dettagli.' },
      { ...en.cards[4], title: 'Creatore IA di foto di coppia', description: 'Carica una o due foto e genera ritratti romantici di coppia con modelli di scena.' },
      { ...en.cards[5], title: 'Generatore di bebè IA', description: 'Carica foto dei genitori o della coppia e crea ritratti fittizi di bebè con GPT Image 2.' },
    ],
  },
}

export function isAiToolsLocale(locale: string): locale is AiToolsLocale {
  return AI_TOOLS_LOCALES.includes(locale as AiToolsLocale)
}

export function getAiToolsPageCopy(locale = 'en'): AiToolsPageCopy {
  return isAiToolsLocale(locale) ? copies[locale] : copies.en
}

export function getAiToolsPageMetadata(
  locale = 'en',
  canonicalUrl = 'https://toolaze.com/ai-tools',
): Metadata {
  const copy = getAiToolsPageCopy(locale)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
