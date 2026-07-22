import type { Metadata } from 'next'

export const AI_TOOLS_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type AiToolsLocale = (typeof AI_TOOLS_LOCALES)[number]

export type AiToolsCategory = 'all' | 'image' | 'video'

export type AiToolsCard = {
  title: string
  href: string
  image: string
  description: string
  category: Exclude<AiToolsCategory, 'all'>
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
  filters: Record<AiToolsCategory, string>
  cards: AiToolsCard[]
}

type StoredAiToolsPageCopy = Omit<AiToolsPageCopy, 'filters'>

const cardAssets = {
  aiImage:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/gpt-image-2.jpg',
  textToImage:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-image-generator/text-to-image-generator.webp',
  imageToImage:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/gpt-image-2/feature-image-editing.webp',
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
  dance: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/ai-dance-demo-source.png',
  hairstyle: '/ai-hairstyle-changer/hero-before-after.webp',
  hairColor: '/ai-hair-color-changer/rose-pink-before-after.webp',
}

const en: StoredAiToolsPageCopy = {
  metadata: {
    title: 'AI Tools - AI Image Generator, AI Baby, Watermark Remover & Photo Restoration | Toolaze',
    description:
      'Explore Toolaze AI tools with visual previews. Use the free AI Image Generator, AI Dance Generator, AI Baby Generator, Watermark Remover, Photo Restoration, AI Couple Photo Maker, and World Cup AI Image Generator online.',
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
      category: 'image',
    },
    {
      title: 'Text to Image Generator',
      href: '/text-to-image-generator',
      image: cardAssets.textToImage,
      description: 'Turn written prompts into AI images for concepts, marketing visuals, posters, and social content.',
      category: 'image',
    },
    {
      title: 'AI Image to Image Generator',
      href: '/ai-image-to-image-generator',
      image: cardAssets.imageToImage,
      description: 'Upload a reference image and use a prompt to restyle, edit, or transform it with AI.',
      category: 'image',
    },
    {
      title: 'AI Video Generator',
      href: '/ai-video-generator',
      image: cardAssets.aiVideo,
      description: 'Create short AI videos online from text, images, video clips, or audio references.',
      category: 'video',
    },
    {
      title: 'World Cup AI Image Generator',
      href: '/world-cup-ai-image-generator',
      image: cardAssets.worldCup,
      description: 'Create football posters, fan edits, sticker packs, and social images with GPT Image 2.',
      category: 'image',
    },
    {
      title: 'Watermark Remover',
      href: '/watermark-remover',
      image: cardAssets.watermark,
      description: 'Remove watermarks from photos online with AI in one click.',
      category: 'image',
    },
    {
      title: 'Photo Restoration',
      href: '/photo-restoration',
      image: cardAssets.restoration,
      description: 'Restore and colorize old photos with AI while improving detail.',
      category: 'image',
    },
    {
      title: 'AI Couple Photo Maker',
      href: '/ai-couple-photo-maker',
      image: cardAssets.couple,
      description: 'Upload one or two photos and generate romantic couple portraits with scene templates.',
      category: 'image',
    },
    {
      title: 'AI Baby Generator',
      href: '/ai-baby-generator',
      image: cardAssets.baby,
      description: 'Upload parent or couple photos and create playful fictional baby portraits with GPT Image 2.',
      category: 'image',
    },
    {
      title: 'AI Dance Generator',
      href: '/ai-dance-generator',
      image: cardAssets.dance,
      description: 'Upload one image and create short dance videos for choreography concepts, class promos, and social clips.',
      category: 'video',
    },
    {
      title: 'AI Hairstyle Changer',
      href: '/ai-hairstyle-changer',
      image: cardAssets.hairstyle,
      description: 'Try different hairstyles on a reference photo while keeping the person and overall look consistent.',
      category: 'image',
    },
    {
      title: 'AI Hair Color Changer',
      href: '/ai-hair-color-changer',
      image: cardAssets.hairColor,
      description: 'Preview natural and creative hair colors on your photo with reference-guided AI editing.',
      category: 'image',
    },
  ],
}

const copies: Record<AiToolsLocale, StoredAiToolsPageCopy> = {
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
      { ...en.cards[6], title: 'KI-Tanzgenerator', description: 'Laden Sie ein Bild hoch und erstellen Sie kurze Tanzvideos für Choreografie-Ideen, Kurs-Promos und Social Clips.' },
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
      { ...en.cards[6], title: 'AIダンスジェネレーター', description: '1枚の画像をアップロードして、振付案、クラス告知、SNSクリップ向けの短いダンス動画を作成できます。' },
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
      { ...en.cards[6], title: 'Generador de baile IA', description: 'Sube una imagen y crea videos cortos de baile para ideas de coreografía, promos de clases y clips sociales.' },
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
      { ...en.cards[6], title: 'AI 跳舞生成器', description: '上傳一張圖片，建立適合編舞概念、課程宣傳與社群短片的跳舞影片。' },
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
      { ...en.cards[6], title: 'Gerador de dança com IA', description: 'Envie uma imagem e crie vídeos curtos de dança para ideias de coreografia, promos de aulas e clipes sociais.' },
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
      { ...en.cards[6], title: 'Générateur de danse IA', description: 'Importez une image et créez de courtes vidéos de danse pour des idées de chorégraphie, promotions de cours et clips sociaux.' },
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
      { ...en.cards[6], title: 'AI 댄스 생성기', description: '이미지 한 장을 업로드해 안무 아이디어, 클래스 홍보, 소셜 클립용 짧은 댄스 영상을 만드세요.' },
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
      { ...en.cards[6], title: 'Generatore di danza IA', description: 'Carica un’immagine e crea brevi video di danza per idee coreografiche, promo di lezioni e clip social.' },
    ],
  },
}

type SupplementalCopy = {
  filters: Record<AiToolsCategory, string>
  heroDescription: string
  textToImage: Pick<AiToolsCard, 'title' | 'description'>
  imageToImage: Pick<AiToolsCard, 'title' | 'description'>
  video: Pick<AiToolsCard, 'title' | 'description'>
  hairstyle: Pick<AiToolsCard, 'title' | 'description'>
  hairColor: Pick<AiToolsCard, 'title' | 'description'>
}

const supplementalCopies: Record<AiToolsLocale, SupplementalCopy> = {
  en: {
    filters: { all: 'All', image: 'AI Image Tools', video: 'AI Video Tools' },
    heroDescription: 'Explore AI image and video tools with clear visual previews. Choose a workflow and start creating in seconds.',
    textToImage: { title: 'Text to Image Generator', description: 'Turn written prompts into AI images for concepts, marketing visuals, posters, and social content.' },
    imageToImage: { title: 'AI Image to Image Generator', description: 'Upload a reference image and use a prompt to restyle, edit, or transform it with AI.' },
    video: { title: 'AI Video Generator', description: 'Create short AI videos online from text, images, video clips, or audio references.' },
    hairstyle: { title: 'AI Hairstyle Changer', description: 'Try different hairstyles on a reference photo while keeping the person and overall look consistent.' },
    hairColor: { title: 'AI Hair Color Changer', description: 'Preview natural and creative hair colors on your photo with reference-guided AI editing.' },
  },
  de: {
    filters: { all: 'Alle', image: 'KI-Bildtools', video: 'KI-Videotools' },
    heroDescription: 'Entdecken Sie KI-Tools für Bilder und Videos mit klaren Vorschauen. Wählen Sie einen Workflow und starten Sie in Sekunden.',
    textToImage: { title: 'Text-zu-Bild-Generator', description: 'Verwandeln Sie Textprompts in KI-Bilder für Konzepte, Marketingvisuals, Poster und Social Media.' },
    imageToImage: { title: 'KI-Bild-zu-Bild-Generator', description: 'Laden Sie ein Referenzbild hoch und gestalten, bearbeiten oder verwandeln Sie es per Prompt mit KI.' },
    video: { title: 'KI-Videogenerator', description: 'Erstellen Sie kurze KI-Videos aus Text, Bildern, Videoclips oder Audioreferenzen.' },
    hairstyle: { title: 'KI-Frisurenwechsler', description: 'Probieren Sie verschiedene Frisuren auf einem Referenzfoto aus und bewahren Sie das Aussehen der Person.' },
    hairColor: { title: 'KI-Haarfarbenwechsler', description: 'Testen Sie natürliche und kreative Haarfarben auf Ihrem Foto mit referenzbasierter KI-Bearbeitung.' },
  },
  ja: {
    filters: { all: 'すべて', image: 'AI画像ツール', video: 'AI動画ツール' },
    heroDescription: '見やすいプレビュー付きのAI画像・動画ツールを選び、数秒で作成を始められます。',
    textToImage: { title: 'テキストから画像生成', description: '文章プロンプトからコンセプト、広告、ポスター、SNS向けのAI画像を作成できます。' },
    imageToImage: { title: 'AI画像から画像生成', description: '参照画像をアップロードし、プロンプトでスタイル変更、編集、変換を行えます。' },
    video: { title: 'AI動画生成', description: 'テキスト、画像、動画クリップ、音声参照から短いAI動画をオンライン作成できます。' },
    hairstyle: { title: 'AIヘアスタイルチェンジャー', description: '人物の印象を保ちながら、参照写真でさまざまな髪型を試せます。' },
    hairColor: { title: 'AIヘアカラー変更', description: '参照画像を使ったAI編集で、自然な髪色や個性的なカラーを写真上で確認できます。' },
  },
  es: {
    filters: { all: 'Todos', image: 'Herramientas de imagen IA', video: 'Herramientas de video IA' },
    heroDescription: 'Explora herramientas IA de imagen y video con vistas previas claras. Elige un flujo y empieza en segundos.',
    textToImage: { title: 'Generador de texto a imagen', description: 'Convierte prompts escritos en imágenes IA para conceptos, marketing, pósteres y contenido social.' },
    imageToImage: { title: 'Generador IA de imagen a imagen', description: 'Sube una imagen de referencia y usa un prompt para cambiar su estilo, editarla o transformarla.' },
    video: { title: 'Generador de video IA', description: 'Crea videos cortos con IA desde texto, imágenes, clips de video o referencias de audio.' },
    hairstyle: { title: 'Cambiador de peinados IA', description: 'Prueba distintos peinados en una foto de referencia manteniendo el aspecto de la persona.' },
    hairColor: { title: 'Cambiador de color de pelo IA', description: 'Prueba colores de pelo naturales y creativos con edición IA guiada por referencia.' },
  },
  'zh-TW': {
    filters: { all: '全部', image: 'AI 圖像工具', video: 'AI 影片工具' },
    heroDescription: '探索具備清楚預覽的 AI 圖像與影片工具。選擇工作流程後即可在數秒內開始創作。',
    textToImage: { title: '文字轉圖像生成器', description: '將文字提示詞轉換為適合概念、行銷、海報與社群內容的 AI 圖像。' },
    imageToImage: { title: 'AI 圖像轉圖像生成器', description: '上傳參考圖像並透過提示詞重新設計、編輯或轉換圖像。' },
    video: { title: 'AI 影片生成器', description: '使用文字、圖像、影片片段或音訊參考在線建立 AI 短片。' },
    hairstyle: { title: 'AI 髮型變換器', description: '在保留人物整體外觀的同時，透過參考照片嘗試不同髮型。' },
    hairColor: { title: 'AI 髮色變換器', description: '使用參考圖引導的 AI 編輯，在照片上預覽自然或創意髮色。' },
  },
  pt: {
    filters: { all: 'Todos', image: 'Ferramentas de imagem IA', video: 'Ferramentas de vídeo IA' },
    heroDescription: 'Explore ferramentas de IA para imagem e vídeo com prévias claras. Escolha um fluxo e comece em segundos.',
    textToImage: { title: 'Gerador de texto para imagem', description: 'Transforme prompts em imagens de IA para conceitos, marketing, pôsteres e conteúdo social.' },
    imageToImage: { title: 'Gerador IA de imagem para imagem', description: 'Envie uma imagem de referência e use um prompt para editar, transformar ou mudar seu estilo.' },
    video: { title: 'Gerador de vídeo IA', description: 'Crie vídeos curtos com IA a partir de texto, imagens, clipes ou referências de áudio.' },
    hairstyle: { title: 'Alterador de penteado IA', description: 'Teste penteados diferentes em uma foto mantendo a pessoa e o visual geral consistentes.' },
    hairColor: { title: 'Alterador de cor de cabelo IA', description: 'Visualize cores naturais e criativas no cabelo com edição de IA guiada por referência.' },
  },
  fr: {
    filters: { all: 'Tous', image: 'Outils d’image IA', video: 'Outils vidéo IA' },
    heroDescription: 'Explorez des outils IA pour l’image et la vidéo avec des aperçus clairs. Choisissez un workflow et démarrez en quelques secondes.',
    textToImage: { title: 'Générateur texte-image', description: 'Transformez des prompts en images IA pour concepts, marketing, affiches et contenus sociaux.' },
    imageToImage: { title: 'Générateur image-à-image IA', description: 'Importez une image de référence et utilisez un prompt pour la modifier, la restyler ou la transformer.' },
    video: { title: 'Générateur de vidéo IA', description: 'Créez de courtes vidéos IA à partir de texte, d’images, de clips ou de références audio.' },
    hairstyle: { title: 'Changeur de coiffure IA', description: 'Essayez différentes coiffures sur une photo de référence tout en conservant l’apparence de la personne.' },
    hairColor: { title: 'Changeur de couleur de cheveux IA', description: 'Prévisualisez des couleurs naturelles ou créatives grâce à une retouche IA guidée par référence.' },
  },
  ko: {
    filters: { all: '전체', image: 'AI 이미지 도구', video: 'AI 동영상 도구' },
    heroDescription: '명확한 미리보기가 있는 AI 이미지 및 동영상 도구를 살펴보고 몇 초 만에 제작을 시작하세요.',
    textToImage: { title: '텍스트-이미지 생성기', description: '텍스트 프롬프트를 콘셉트, 마케팅, 포스터 및 소셜 콘텐츠용 AI 이미지로 만드세요.' },
    imageToImage: { title: 'AI 이미지-이미지 생성기', description: '참조 이미지를 업로드하고 프롬프트로 스타일 변경, 편집 또는 변환하세요.' },
    video: { title: 'AI 동영상 생성기', description: '텍스트, 이미지, 동영상 클립 또는 오디오 참조로 짧은 AI 동영상을 만드세요.' },
    hairstyle: { title: 'AI 헤어스타일 변경기', description: '인물의 전체적인 모습을 유지하면서 참조 사진에서 다양한 헤어스타일을 시험해 보세요.' },
    hairColor: { title: 'AI 헤어 컬러 변경기', description: '참조 기반 AI 편집으로 사진에서 자연스럽거나 창의적인 헤어 컬러를 미리 확인하세요.' },
  },
  it: {
    filters: { all: 'Tutti', image: 'Strumenti per immagini IA', video: 'Strumenti video IA' },
    heroDescription: 'Esplora strumenti IA per immagini e video con anteprime chiare. Scegli un workflow e inizia in pochi secondi.',
    textToImage: { title: 'Generatore da testo a immagine', description: 'Trasforma prompt scritti in immagini IA per concept, marketing, poster e contenuti social.' },
    imageToImage: { title: 'Generatore IA da immagine a immagine', description: 'Carica un’immagine di riferimento e usa un prompt per modificarla, trasformarla o cambiarne lo stile.' },
    video: { title: 'Generatore video IA', description: 'Crea brevi video IA da testo, immagini, clip video o riferimenti audio.' },
    hairstyle: { title: 'Cambia acconciatura IA', description: 'Prova diverse acconciature su una foto mantenendo coerenti la persona e l’aspetto generale.' },
    hairColor: { title: 'Cambia colore capelli IA', description: 'Visualizza colori naturali e creativi con editing IA guidato da un’immagine di riferimento.' },
  },
}

function applyLocalizedCard(
  baseCard: AiToolsCard,
  localizedCard: Pick<AiToolsCard, 'title' | 'description'>,
): AiToolsCard {
  return {
    ...baseCard,
    title: localizedCard.title,
    description: localizedCard.description,
  }
}

function getLocalizedCards(locale: AiToolsLocale, storedCards: AiToolsCard[]): AiToolsCard[] {
  const [image, worldCup, watermark, restoration, couple, baby, dance] = storedCards
  const supplemental = supplementalCopies[locale]

  if (locale === 'en') {
    return [
      en.cards[0],
      en.cards[1],
      en.cards[2],
      en.cards[3],
      en.cards[4],
      en.cards[7],
      en.cards[8],
      en.cards[9],
      en.cards[10],
      en.cards[11],
      en.cards[5],
      en.cards[6],
    ]
  }

  return [
    applyLocalizedCard(en.cards[0], image),
    applyLocalizedCard(en.cards[1], supplemental.textToImage),
    applyLocalizedCard(en.cards[2], supplemental.imageToImage),
    applyLocalizedCard(en.cards[3], supplemental.video),
    applyLocalizedCard(en.cards[4], worldCup),
    applyLocalizedCard(en.cards[7], couple),
    applyLocalizedCard(en.cards[8], baby),
    applyLocalizedCard(en.cards[9], dance),
    applyLocalizedCard(en.cards[10], supplemental.hairstyle),
    applyLocalizedCard(en.cards[11], supplemental.hairColor),
    applyLocalizedCard(en.cards[5], watermark),
    applyLocalizedCard(en.cards[6], restoration),
  ]
}

export function isAiToolsLocale(locale: string): locale is AiToolsLocale {
  return AI_TOOLS_LOCALES.includes(locale as AiToolsLocale)
}

export function getAiToolsPageCopy(locale = 'en'): AiToolsPageCopy {
  const resolvedLocale = isAiToolsLocale(locale) ? locale : 'en'
  const copy = copies[resolvedLocale]
  const supplemental = supplementalCopies[resolvedLocale]

  return {
    ...copy,
    metadata: {
      ...copy.metadata,
      description: supplemental.heroDescription,
    },
    hero: {
      ...copy.hero,
      description: supplemental.heroDescription,
    },
    filters: supplemental.filters,
    cards: getLocalizedCards(resolvedLocale, copy.cards),
  }
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
