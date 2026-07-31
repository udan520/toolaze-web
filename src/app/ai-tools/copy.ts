import type { Metadata } from 'next'

export const AI_TOOLS_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type AiToolsLocale = (typeof AI_TOOLS_LOCALES)[number]

export type AiToolsCategory = 'all' | 'image' | 'video'

export type AiToolsCard = {
  title: string
  href: string
  image: string
  video?: string
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

type StoredAiToolsCard = AiToolsCard | Pick<AiToolsCard, 'href' | 'title' | 'description'>

type StoredAiToolsPageCopy = Omit<AiToolsPageCopy, 'filters' | 'cards'> & {
  cards: StoredAiToolsCard[]
}

const cardAssets = {
  aiImage:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/gpt-image-2.jpg',
  textToImage:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-image-generator/text-to-image-generator.webp',
  imageToImage:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/gpt-image-2/feature-image-editing.webp',
  aiVideo:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/seedance-2.jpg',
  wan25Video:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ai-video-generator/prompt-templates/storyboard-scene.webp',
  textToVideo:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ai-video-generator/prompt-templates/storyboard-scene.webp',
  imageToVideo:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/880154a7e9874c2eb41e2beb2a9bab67.webp',
  worldCup:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp',
  watermark:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/watermark-remover-demo-before-after.webp',
  restoration:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/photo-restoration-demo-before-after.webp',
  couple: '/ai-couple-photo-maker/rainy-eiffel-4x3.jpg',
  baby: '/ai-baby-generator/hero-baby-portrait.webp',
  dance: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/ai-dance-demo-source.png',
  kissing:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/15ccbe71d8eb4921930b8b7638bcebab.webp',
  asmr:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/landing-pages/ai-asmr-video-generator/demo-poster.webp',
  talkingAvatar:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/landing-pages/talking-avatar-creator/demo-poster.webp',
  hairstyle: '/ai-hairstyle-changer/hero-before-after.webp',
  hairColor: '/ai-hair-color-changer/rose-pink-before-after.webp',
  clothes:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/84b9bf50f4414a2c962ebd3f74cb07f0.webp',
  bikini:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/6bcf91ffd06e45a8bcda2ea867015141.webp',
}

const cardVideos = {
  aiVideo:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ai-video-generator/ai-video-generator-grok-demo.mp4',
  wan25Video:
    '/model-assets/grok-imagine-video-1-5/grok-hero-demo-16x9.mp4',
  textToVideo:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/1b0129b9d2504494825f8fd28b00f4af.png',
  imageToVideo:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ai-video-generator/ai-video-generator-grok-demo.mp4',
  dance:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/ai-dance-demo.mp4',
  kissing:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/83a8c5b91a4945beb66275c38a731dbf.png',
  asmr:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/landing-pages/ai-asmr-video-generator/demo.mp4',
  talkingAvatar:
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/landing-pages/talking-avatar-creator/demo.mp4',
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
      video: cardVideos.aiVideo,
      description: 'Create short AI videos online from text, images, video clips, or audio references.',
      category: 'video',
    },
    {
      title: 'Text to Video Generator',
      href: '/text-to-video-generator',
      image: cardAssets.textToVideo,
      video: cardVideos.textToVideo,
      description: 'Turn written prompts into short AI videos for ads, storyboards, social clips, and concept tests.',
      category: 'video',
    },
    {
      title: 'Image to Video Generator',
      href: '/image-to-video-generator',
      image: cardAssets.imageToVideo,
      video: cardVideos.imageToVideo,
      description: 'Animate photos, product images, artwork, and reference frames with controlled AI motion.',
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
      video: cardVideos.dance,
      description: 'Upload one image and create short dance videos for choreography concepts, class promos, and social clips.',
      category: 'video',
    },
    {
      title: 'AI Kissing Video Generator',
      href: '/ai-kissing-video-generator',
      image: cardAssets.kissing,
      video: cardVideos.kissing,
      description: 'Upload one or two photos and create short romantic AI kiss videos for couple edits, anniversaries, and story reels.',
      category: 'video',
    },
    {
      title: 'AI Talking Avatar',
      href: '/talking-avatar-creator',
      image: cardAssets.talkingAvatar,
      video: cardVideos.talkingAvatar,
      description: 'Upload a portrait and voice audio to create a short lip-synced talking avatar video.',
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
    {
      title: 'AI Clothes Changer',
      href: '/ai-clothes-changer',
      image: cardAssets.clothes,
      description: 'Upload a person photo and preview realistic outfit changes with virtual try-on style prompts.',
      category: 'image',
    },
    {
      title: 'AI Bikini Generator',
      href: '/ai-bikini-generator',
      image: cardAssets.bikini,
      description: 'Upload an adult person photo and a bikini reference to preview tasteful swimwear edits while preserving the original person.',
      category: 'image',
    },
    {
      title: 'AI ASMR Video Generator',
      href: '/ai-asmr-video-generator',
      image: cardAssets.asmr,
      video: cardVideos.asmr,
      description: 'Create tactile AI ASMR videos with synchronized sound from a text prompt or reference image.',
      category: 'video',
    },
    {
      title: 'Wan 2.5 AI Video Generator',
      href: '/model/wan-2-5-ai-video-generator',
      image: cardAssets.wan25Video,
      video: cardVideos.wan25Video,
      description: 'Create Wan 2.5 text-to-video or image-to-video clips with 5/10 second, 720p/1080p, and native audio settings.',
      category: 'video',
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
      { href: '/ai-image-generator', title: 'KI-Bildgenerator', description: 'Erstellen Sie hochwertige KI-Bilder online aus Textprompts für Anzeigen, Poster, Konzepte und Social-Media-Visuals.' },
      { href: '/world-cup-ai-image-generator', title: 'World Cup KI-Bildgenerator', description: 'Erstellen Sie Fußballposter, Fan-Edits, Stickerpakete und Social-Media-Bilder mit GPT Image 2.' },
      { href: '/watermark-remover', title: 'Wasserzeichen-Entferner', description: 'Entfernen Sie Wasserzeichen aus Fotos online mit KI in einem Klick.' },
      { href: '/photo-restoration', title: 'Fotorestaurierung', description: 'Restaurieren und kolorieren Sie alte Fotos mit KI und verbessern Sie Details.' },
      { href: '/ai-couple-photo-maker', title: 'KI-Paarfoto-Generator', description: 'Laden Sie ein oder zwei Fotos hoch und erstellen Sie romantische Paarporträts mit Szenenvorlagen.' },
      { href: '/ai-baby-generator', title: 'KI-Babygenerator', description: 'Laden Sie Eltern- oder Paarfotos hoch und erstellen Sie spielerische fiktive Babyporträts mit GPT Image 2.' },
      { href: '/ai-dance-generator', title: 'KI-Tanzgenerator', description: 'Laden Sie ein Bild hoch und erstellen Sie kurze Tanzvideos für Choreografie-Ideen, Kurs-Promos und Social Clips.' },
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
      { href: '/ai-image-generator', title: 'AI画像生成', description: '広告、ポスター、コンセプト、SNS向けに、テキストプロンプトから高品質なAI画像をオンライン作成できます。' },
      { href: '/world-cup-ai-image-generator', title: 'ワールドカップAI画像生成', description: 'GPT Image 2でサッカーポスター、ファン編集、ステッカー、SNS画像を作成できます。' },
      { href: '/watermark-remover', title: '透かし削除', description: '写真の透かしをAIでオンライン削除できます。' },
      { href: '/photo-restoration', title: '写真修復', description: '古い写真をAIで修復・カラー化し、細部を改善できます。' },
      { href: '/ai-couple-photo-maker', title: 'AIカップル写真メーカー', description: '1枚または2枚の写真をアップロードし、シーンテンプレートでロマンチックなカップル写真を生成できます。' },
      { href: '/ai-baby-generator', title: 'AIベビージェネレーター', description: '親またはカップルの写真をアップロードし、GPT Image 2で架空のベビーポートレートを作成できます。' },
      { href: '/ai-dance-generator', title: 'AIダンスジェネレーター', description: '1枚の画像をアップロードして、振付案、クラス告知、SNSクリップ向けの短いダンス動画を作成できます。' },
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
      { href: '/ai-image-generator', title: 'Generador de imágenes IA', description: 'Crea imágenes IA online de alta calidad desde prompts para anuncios, pósteres, conceptos y redes sociales.' },
      { href: '/world-cup-ai-image-generator', title: 'Generador IA de imágenes del Mundial', description: 'Crea pósteres de fútbol, ediciones de fans, stickers e imágenes sociales con GPT Image 2.' },
      { href: '/watermark-remover', title: 'Quitamarcas de agua', description: 'Elimina marcas de agua de fotos online con IA en un clic.' },
      { href: '/photo-restoration', title: 'Restauración de fotos', description: 'Restaura y colorea fotos antiguas con IA mientras mejoras los detalles.' },
      { href: '/ai-couple-photo-maker', title: 'Creador IA de fotos de pareja', description: 'Sube una o dos fotos y genera retratos románticos de pareja con plantillas de escena.' },
      { href: '/ai-baby-generator', title: 'Generador de bebés IA', description: 'Sube fotos de padres o pareja y crea retratos ficticios de bebé con GPT Image 2.' },
      { href: '/ai-dance-generator', title: 'Generador de baile IA', description: 'Sube una imagen y crea videos cortos de baile para ideas de coreografía, promos de clases y clips sociales.' },
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
      { href: '/ai-image-generator', title: 'AI 圖像生成器', description: '從文字提示詞線上建立高品質 AI 圖像，適合廣告、海報、概念與社群視覺。' },
      { href: '/world-cup-ai-image-generator', title: '世界盃 AI 圖像生成器', description: '使用 GPT Image 2 製作足球海報、球迷改圖、貼圖包與社群圖片。' },
      { href: '/watermark-remover', title: '去浮水印', description: '使用 AI 一鍵線上移除照片浮水印。' },
      { href: '/photo-restoration', title: '照片修復', description: '使用 AI 修復舊照片、上色並改善細節。' },
      { href: '/ai-couple-photo-maker', title: 'AI 情侶照片生成器', description: '上傳一張或兩張照片，透過場景範本生成浪漫情侶肖像。' },
      { href: '/ai-baby-generator', title: 'AI 寶寶生成器', description: '上傳父母或情侶照片，使用 GPT Image 2 建立趣味虛構寶寶肖像。' },
      { href: '/ai-dance-generator', title: 'AI 跳舞生成器', description: '上傳一張圖片，建立適合編舞概念、課程宣傳與社群短片的跳舞影片。' },
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
      { href: '/ai-image-generator', title: 'Gerador de imagens com IA', description: 'Crie imagens de IA online em alta qualidade a partir de prompts para anúncios, pôsteres, conceitos e redes sociais.' },
      { href: '/world-cup-ai-image-generator', title: 'Gerador de imagens da Copa com IA', description: 'Crie pôsteres de futebol, edições de fãs, pacotes de figurinhas e imagens sociais com GPT Image 2.' },
      { href: '/watermark-remover', title: 'Removedor de marca d’água', description: 'Remova marcas d’água de fotos online com IA em um clique.' },
      { href: '/photo-restoration', title: 'Restauração de fotos', description: 'Restaure e colorize fotos antigas com IA enquanto melhora os detalhes.' },
      { href: '/ai-couple-photo-maker', title: 'Criador de fotos de casal com IA', description: 'Envie uma ou duas fotos e gere retratos românticos de casal com modelos de cena.' },
      { href: '/ai-baby-generator', title: 'Gerador de bebê IA', description: 'Envie fotos dos pais ou do casal e crie retratos fictícios de bebê com GPT Image 2.' },
      { href: '/ai-dance-generator', title: 'Gerador de dança com IA', description: 'Envie uma imagem e crie vídeos curtos de dança para ideias de coreografia, promos de aulas e clipes sociais.' },
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
      { href: '/ai-image-generator', title: 'Générateur d’images IA', description: 'Créez en ligne des images IA de qualité à partir de prompts pour annonces, affiches, concepts et réseaux sociaux.' },
      { href: '/world-cup-ai-image-generator', title: 'Générateur d’images IA Coupe du Monde', description: 'Créez des affiches de football, montages de fans, packs de stickers et visuels sociaux avec GPT Image 2.' },
      { href: '/watermark-remover', title: 'Suppression de filigrane', description: 'Supprimez les filigranes des photos en ligne avec l’IA en un clic.' },
      { href: '/photo-restoration', title: 'Restauration photo', description: 'Restaurez et colorisez d’anciennes photos avec l’IA tout en améliorant les détails.' },
      { href: '/ai-couple-photo-maker', title: 'Créateur IA de photos de couple', description: 'Importez une ou deux photos et générez des portraits romantiques de couple avec des modèles de scène.' },
      { href: '/ai-baby-generator', title: 'Générateur de bébé IA', description: 'Importez des photos de parents ou de couple et créez des portraits fictifs de bébé avec GPT Image 2.' },
      { href: '/ai-dance-generator', title: 'Générateur de danse IA', description: 'Importez une image et créez de courtes vidéos de danse pour des idées de chorégraphie, promotions de cours et clips sociaux.' },
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
      { href: '/ai-image-generator', title: 'AI 이미지 생성기', description: '광고, 포스터, 콘셉트, 소셜 비주얼용 고품질 AI 이미지를 텍스트 프롬프트로 온라인 생성하세요.' },
      { href: '/world-cup-ai-image-generator', title: '월드컵 AI 이미지 생성기', description: 'GPT Image 2로 축구 포스터, 팬 편집 이미지, 스티커 팩, 소셜 이미지를 만드세요.' },
      { href: '/watermark-remover', title: '워터마크 제거', description: 'AI로 사진의 워터마크를 온라인에서 한 번에 제거하세요.' },
      { href: '/photo-restoration', title: '사진 복원', description: 'AI로 오래된 사진을 복원하고 색을 입히며 디테일을 개선하세요.' },
      { href: '/ai-couple-photo-maker', title: 'AI 커플 사진 제작', description: '사진 한 장 또는 두 장을 업로드하고 장면 템플릿으로 로맨틱한 커플 초상화를 생성하세요.' },
      { href: '/ai-baby-generator', title: 'AI 아기 생성기', description: '부모 또는 커플 사진을 업로드하고 GPT Image 2로 가상의 아기 초상화를 만드세요.' },
      { href: '/ai-dance-generator', title: 'AI 댄스 생성기', description: '이미지 한 장을 업로드해 안무 아이디어, 클래스 홍보, 소셜 클립용 짧은 댄스 영상을 만드세요.' },
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
      { href: '/ai-image-generator', title: 'Generatore di immagini IA', description: 'Crea online immagini IA di alta qualità da prompt per annunci, poster, concept e visual social.' },
      { href: '/world-cup-ai-image-generator', title: 'Generatore immagini IA Mondiali', description: 'Crea poster calcistici, fan edit, pacchetti sticker e immagini social con GPT Image 2.' },
      { href: '/watermark-remover', title: 'Rimuovi watermark', description: 'Rimuovi watermark dalle foto online con IA in un clic.' },
      { href: '/photo-restoration', title: 'Restauro foto', description: 'Restaura e colora vecchie foto con IA migliorandone i dettagli.' },
      { href: '/ai-couple-photo-maker', title: 'Creatore IA di foto di coppia', description: 'Carica una o due foto e genera ritratti romantici di coppia con modelli di scena.' },
      { href: '/ai-baby-generator', title: 'Generatore di bebè IA', description: 'Carica foto dei genitori o della coppia e crea ritratti fittizi di bebè con GPT Image 2.' },
      { href: '/ai-dance-generator', title: 'Generatore di danza IA', description: 'Carica un’immagine e crea brevi video di danza per idee coreografiche, promo di lezioni e clip social.' },
    ],
  },
}

type SupplementalCopy = {
  filters: Record<AiToolsCategory, string>
  heroDescription: string
  textToImage: Pick<AiToolsCard, 'title' | 'description'>
  imageToImage: Pick<AiToolsCard, 'title' | 'description'>
  video: Pick<AiToolsCard, 'title' | 'description'>
  asmr: Pick<AiToolsCard, 'title' | 'description'>
  kissing: Pick<AiToolsCard, 'title' | 'description'>
  talkingAvatar: Pick<AiToolsCard, 'title' | 'description'>
  textToVideo: Pick<AiToolsCard, 'title' | 'description'>
  imageToVideo: Pick<AiToolsCard, 'title' | 'description'>
  hairstyle: Pick<AiToolsCard, 'title' | 'description'>
  hairColor: Pick<AiToolsCard, 'title' | 'description'>
  clothes: Pick<AiToolsCard, 'title' | 'description'>
  bikini: Pick<AiToolsCard, 'title' | 'description'>
}

const supplementalCopies: Record<AiToolsLocale, SupplementalCopy> = {
  en: {
    filters: { all: 'All', image: 'AI Image Tools', video: 'AI Video Tools' },
    heroDescription: 'Explore AI image and video tools with clear visual previews. Choose a tool and start creating in seconds.',
    textToImage: { title: 'Text to Image Generator', description: 'Turn written prompts into AI images for concepts, marketing visuals, posters, and social content.' },
    imageToImage: { title: 'AI Image to Image Generator', description: 'Upload a reference image and use a prompt to restyle, edit, or transform it with AI.' },
    video: { title: 'AI Video Generator', description: 'Create short AI videos online from text, images, video clips, or audio references.' },
    asmr: { title: 'AI ASMR Video Generator', description: 'Create tactile AI ASMR videos with synchronized sound from a text prompt or reference image.' },
    kissing: { title: 'AI Kissing Video Generator', description: 'Upload one or two photos and create short romantic AI kiss videos for couple edits, anniversaries, and story reels.' },
    talkingAvatar: { title: 'AI Talking Avatar', description: 'Upload a portrait and voice audio to create a short lip-synced talking avatar video.' },
    textToVideo: { title: 'Text to Video Generator', description: 'Turn written prompts into short AI videos for ads, storyboards, social clips, and concept tests.' },
    imageToVideo: { title: 'Image to Video Generator', description: 'Animate photos, product images, artwork, and reference frames with controlled AI motion.' },
    hairstyle: { title: 'AI Hairstyle Changer', description: 'Try different hairstyles on a reference photo while keeping the person and overall look consistent.' },
    hairColor: { title: 'AI Hair Color Changer', description: 'Preview natural and creative hair colors on your photo with reference-guided AI editing.' },
    clothes: { title: 'AI Clothes Changer', description: 'Upload a person photo and preview realistic outfit changes with virtual try-on style prompts.' },
    bikini: { title: 'AI Bikini Generator', description: 'Upload an adult person photo and a bikini reference to preview tasteful swimwear edits while preserving the original person.' },
  },
  de: {
    filters: { all: 'Alle', image: 'KI-Bildtools', video: 'KI-Videotools' },
    heroDescription: 'Entdecken Sie KI-Tools für Bilder und Videos mit klaren Vorschauen. Wählen Sie ein Tool und starten Sie in Sekunden.',
    textToImage: { title: 'Text-zu-Bild-Generator', description: 'Verwandeln Sie Textprompts in KI-Bilder für Konzepte, Marketingvisuals, Poster und Social Media.' },
    imageToImage: { title: 'KI-Bild-zu-Bild-Generator', description: 'Laden Sie ein Referenzbild hoch und gestalten, bearbeiten oder verwandeln Sie es per Prompt mit KI.' },
    video: { title: 'KI-Videogenerator', description: 'Erstellen Sie kurze KI-Videos aus Text, Bildern, Videoclips oder Audioreferenzen.' },
    asmr: { title: 'KI-ASMR-Videogenerator', description: 'Erstellen Sie taktile KI-ASMR-Videos mit synchronisiertem Sound aus Text oder Referenzbild.' },
    kissing: { title: 'KI-Kuss-Video-Generator', description: 'Laden Sie ein oder zwei Fotos hoch und erstellen Sie kurze romantische KI-Kussvideos für Paar-Edits, Jubiläen und Story-Reels.' },
    talkingAvatar: { title: 'KI-Sprechavatar', description: 'Laden Sie ein Porträt und Sprachaudio hoch, um ein kurzes lippensynchrones Sprechavatar-Video zu erstellen.' },
    textToVideo: { title: 'Text-zu-Video-Generator', description: 'Verwandeln Sie Textprompts in kurze KI-Videos für Anzeigen, Storyboards, Social Clips und Konzepttests.' },
    imageToVideo: { title: 'Bild-zu-Video-Generator', description: 'Animieren Sie Fotos, Produktbilder, Kunstwerke und Referenzframes mit kontrollierter KI-Bewegung.' },
    hairstyle: { title: 'KI-Frisurenwechsler', description: 'Probieren Sie verschiedene Frisuren auf einem Referenzfoto aus und bewahren Sie das Aussehen der Person.' },
    hairColor: { title: 'KI-Haarfarbenwechsler', description: 'Testen Sie natürliche und kreative Haarfarben auf Ihrem Foto mit referenzbasierter KI-Bearbeitung.' },
    clothes: { title: 'KI-Kleiderwechsler', description: 'Laden Sie ein Personenfoto hoch und testen Sie realistische Outfitwechsel mit virtuellen Anprobe-Prompts.' },
    bikini: { title: 'KI-Bikini-Generator', description: 'Laden Sie ein Erwachsenenfoto und eine Bikini-Referenz hoch, um geschmackvolle Swimwear-Edits mit stabiler Personenvorschau zu testen.' },
  },
  ja: {
    filters: { all: 'すべて', image: 'AI画像ツール', video: 'AI動画ツール' },
    heroDescription: '見やすいプレビュー付きのAI画像・動画ツールを選び、数秒で作成を始められます。',
    textToImage: { title: 'テキストから画像生成', description: '文章プロンプトからコンセプト、広告、ポスター、SNS向けのAI画像を作成できます。' },
    imageToImage: { title: 'AI画像から画像生成', description: '参照画像をアップロードし、プロンプトでスタイル変更、編集、変換を行えます。' },
    video: { title: 'AI動画生成', description: 'テキスト、画像、動画クリップ、音声参照から短いAI動画をオンライン作成できます。' },
    asmr: { title: 'AI ASMR動画ジェネレーター', description: 'テキストや参照画像から、同期した音付きの触感的なAI ASMR動画を作成できます。' },
    kissing: { title: 'AIキス動画ジェネレーター', description: '1枚または2枚の写真から、カップル編集、記念日、ストーリーリール向けの短いロマンチックなAIキス動画を作成できます。' },
    talkingAvatar: { title: 'AIトーキングアバター', description: 'ポートレートと音声をアップロードして、リップシンク付きの短いトーキングアバター動画を作成できます。' },
    textToVideo: { title: 'テキストから動画生成', description: '文章プロンプトを広告、絵コンテ、SNSクリップ、コンセプト検証向けの短いAI動画にできます。' },
    imageToVideo: { title: '画像から動画生成', description: '写真、商品画像、アート、参照フレームに制御可能なAIモーションを加えられます。' },
    hairstyle: { title: 'AIヘアスタイルチェンジャー', description: '人物の印象を保ちながら、参照写真でさまざまな髪型を試せます。' },
    hairColor: { title: 'AIヘアカラー変更', description: '参照画像を使ったAI編集で、自然な髪色や個性的なカラーを写真上で確認できます。' },
    clothes: { title: 'AI服装チェンジャー', description: '人物写真をアップロードし、バーチャル試着向けプロンプトでリアルな衣装変更をプレビューできます。' },
    bikini: { title: 'AIビキニジェネレーター', description: '成人の人物写真とビキニ参照をアップロードし、人物を保ったまま上品なスイムウェア編集をプレビューできます。' },
  },
  es: {
    filters: { all: 'Todos', image: 'Herramientas de imagen IA', video: 'Herramientas de video IA' },
    heroDescription: 'Explora herramientas IA de imagen y video con vistas previas claras. Elige una herramienta y empieza en segundos.',
    textToImage: { title: 'Generador de texto a imagen', description: 'Convierte prompts escritos en imágenes IA para conceptos, marketing, pósteres y contenido social.' },
    imageToImage: { title: 'Generador IA de imagen a imagen', description: 'Sube una imagen de referencia y usa un prompt para cambiar su estilo, editarla o transformarla.' },
    video: { title: 'Generador de video IA', description: 'Crea videos cortos con IA desde texto, imágenes, clips de video o referencias de audio.' },
    asmr: { title: 'Generador de video ASMR IA', description: 'Crea videos ASMR táctiles con sonido sincronizado desde un prompt de texto o una imagen de referencia.' },
    kissing: { title: 'Generador de videos de besos IA', description: 'Sube una o dos fotos y crea videos cortos de besos románticos para ediciones de pareja, aniversarios y reels.' },
    talkingAvatar: { title: 'Avatar parlante con IA', description: 'Sube un retrato y audio de voz para crear un video corto de avatar con labios sincronizados.' },
    textToVideo: { title: 'Generador de texto a video', description: 'Convierte prompts escritos en videos cortos con IA para anuncios, guiones visuales, clips sociales y pruebas de concepto.' },
    imageToVideo: { title: 'Generador de imagen a video', description: 'Anima fotos, imágenes de producto, ilustraciones y fotogramas de referencia con movimiento IA controlado.' },
    hairstyle: { title: 'Cambiador de peinados IA', description: 'Prueba distintos peinados en una foto de referencia manteniendo el aspecto de la persona.' },
    hairColor: { title: 'Cambiador de color de pelo IA', description: 'Prueba colores de pelo naturales y creativos con edición IA guiada por referencia.' },
    clothes: { title: 'Cambiador de ropa con IA', description: 'Sube una foto de persona y previsualiza cambios de outfit realistas con prompts de prueba virtual.' },
    bikini: { title: 'Generador de bikini con IA', description: 'Sube una foto adulta y una referencia de bikini para previsualizar ediciones de swimwear de buen gusto sin cambiar a la persona.' },
  },
  'zh-TW': {
    filters: { all: '全部', image: 'AI 圖像工具', video: 'AI 影片工具' },
    heroDescription: '探索具備清楚預覽的 AI 圖像與影片工具。選擇工具後即可在數秒內開始創作。',
    textToImage: { title: '文字轉圖像生成器', description: '將文字提示詞轉換為適合概念、行銷、海報與社群內容的 AI 圖像。' },
    imageToImage: { title: 'AI 圖像轉圖像生成器', description: '上傳參考圖像並透過提示詞重新設計、編輯或轉換圖像。' },
    video: { title: 'AI 影片生成器', description: '使用文字、圖像、影片片段或音訊參考在線建立 AI 短片。' },
    asmr: { title: 'AI ASMR 影片生成器', description: '使用文字提示詞或參考圖像建立具備同步聲音的觸感式 AI ASMR 影片。' },
    kissing: { title: 'AI 親吻影片生成器', description: '上傳一張或兩張照片，生成適合情侶剪輯、紀念日與 Story Reels 的浪漫親吻短片。' },
    talkingAvatar: { title: 'AI 說話頭像', description: '上傳人像與語音音訊，建立短的唇形同步說話頭像影片。' },
    textToVideo: { title: '文字轉影片生成器', description: '將文字提示詞轉為適合廣告、分鏡、社群短片與概念測試的 AI 短片。' },
    imageToVideo: { title: '圖像轉影片生成器', description: '以可控的 AI 動態為照片、產品圖、藝術作品和參考畫面製作動畫。' },
    hairstyle: { title: 'AI 髮型變換器', description: '在保留人物整體外觀的同時，透過參考照片嘗試不同髮型。' },
    hairColor: { title: 'AI 髮色變換器', description: '使用參考圖引導的 AI 編輯，在照片上預覽自然或創意髮色。' },
    clothes: { title: 'AI 換衣工具', description: '上傳人物照片，使用虛擬試穿提示詞預覽逼真的換裝效果。' },
    bikini: { title: 'AI 比基尼生成器', description: '上傳成人人物照片與比基尼參考圖，在保留原人物的同時預覽得體的泳裝編輯效果。' },
  },
  pt: {
    filters: { all: 'Todos', image: 'Ferramentas de imagem IA', video: 'Ferramentas de vídeo IA' },
    heroDescription: 'Explore ferramentas de IA para imagem e vídeo com prévias claras. Escolha uma ferramenta e comece em segundos.',
    textToImage: { title: 'Gerador de texto para imagem', description: 'Transforme prompts em imagens de IA para conceitos, marketing, pôsteres e conteúdo social.' },
    imageToImage: { title: 'Gerador IA de imagem para imagem', description: 'Envie uma imagem de referência e use um prompt para editar, transformar ou mudar seu estilo.' },
    video: { title: 'Gerador de vídeo IA', description: 'Crie vídeos curtos com IA a partir de texto, imagens, clipes ou referências de áudio.' },
    asmr: { title: 'Gerador de vídeo ASMR com IA', description: 'Crie vídeos ASMR táteis com som sincronizado a partir de texto ou imagem de referência.' },
    kissing: { title: 'Gerador de vídeos de beijo com IA', description: 'Envie uma ou duas fotos e crie vídeos curtos de beijo romântico para edições de casal, aniversários e reels.' },
    talkingAvatar: { title: 'Avatar falante com IA', description: 'Envie um retrato e áudio de voz para criar um vídeo curto de avatar com lábios sincronizados.' },
    textToVideo: { title: 'Gerador de texto para vídeo', description: 'Transforme prompts em vídeos curtos com IA para anúncios, storyboards, clipes sociais e testes de conceito.' },
    imageToVideo: { title: 'Gerador de imagem para vídeo', description: 'Anime fotos, imagens de produtos, obras de arte e quadros de referência com movimento de IA controlado.' },
    hairstyle: { title: 'Alterador de penteado IA', description: 'Teste penteados diferentes em uma foto mantendo a pessoa e o visual geral consistentes.' },
    hairColor: { title: 'Alterador de cor de cabelo IA', description: 'Visualize cores naturais e criativas no cabelo com edição de IA guiada por referência.' },
    clothes: { title: 'Trocador de roupas com IA', description: 'Envie uma foto da pessoa e visualize trocas de roupa realistas com prompts de prova virtual.' },
    bikini: { title: 'Gerador de biquíni com IA', description: 'Envie uma foto adulta e uma referência de biquíni para visualizar edições de swimwear de bom gosto mantendo a pessoa original.' },
  },
  fr: {
    filters: { all: 'Tous', image: 'Outils d’image IA', video: 'Outils vidéo IA' },
    heroDescription: 'Explorez des outils IA pour l’image et la vidéo avec des aperçus clairs. Choisissez un outil et démarrez en quelques secondes.',
    textToImage: { title: 'Générateur texte-image', description: 'Transformez des prompts en images IA pour concepts, marketing, affiches et contenus sociaux.' },
    imageToImage: { title: 'Générateur image-à-image IA', description: 'Importez une image de référence et utilisez un prompt pour la modifier, la restyler ou la transformer.' },
    video: { title: 'Générateur de vidéo IA', description: 'Créez de courtes vidéos IA à partir de texte, d’images, de clips ou de références audio.' },
    asmr: { title: 'Générateur de vidéo ASMR IA', description: 'Créez des vidéos ASMR tactiles avec son synchronisé depuis un prompt texte ou une image de référence.' },
    kissing: { title: 'Générateur de vidéos de baiser IA', description: 'Importez une ou deux photos et créez de courtes vidéos de baiser romantique pour montages de couple, anniversaires et reels.' },
    talkingAvatar: { title: 'Avatar parlant IA', description: 'Importez un portrait et un audio vocal pour créer une courte vidéo d’avatar synchronisée.' },
    textToVideo: { title: 'Générateur texte-vidéo', description: 'Transformez des prompts en courtes vidéos IA pour annonces, storyboards, clips sociaux et tests de concept.' },
    imageToVideo: { title: 'Générateur image-vidéo', description: 'Animez photos, images produit, créations et images de référence avec des mouvements IA contrôlés.' },
    hairstyle: { title: 'Changeur de coiffure IA', description: 'Essayez différentes coiffures sur une photo de référence tout en conservant l’apparence de la personne.' },
    hairColor: { title: 'Changeur de couleur de cheveux IA', description: 'Prévisualisez des couleurs naturelles ou créatives grâce à une retouche IA guidée par référence.' },
    clothes: { title: 'Changeur de vêtements IA', description: 'Importez une photo de personne et prévisualisez des changements de tenue réalistes avec des prompts d’essayage virtuel.' },
    bikini: { title: 'Générateur de bikini IA', description: 'Importez une photo adulte et une référence bikini pour prévisualiser des retouches swimwear sobres en conservant la personne.' },
  },
  ko: {
    filters: { all: '전체', image: 'AI 이미지 도구', video: 'AI 동영상 도구' },
    heroDescription: '명확한 미리보기가 있는 AI 이미지 및 동영상 도구를 살펴보고 몇 초 만에 제작을 시작하세요.',
    textToImage: { title: '텍스트-이미지 생성기', description: '텍스트 프롬프트를 콘셉트, 마케팅, 포스터 및 소셜 콘텐츠용 AI 이미지로 만드세요.' },
    imageToImage: { title: 'AI 이미지-이미지 생성기', description: '참조 이미지를 업로드하고 프롬프트로 스타일 변경, 편집 또는 변환하세요.' },
    video: { title: 'AI 동영상 생성기', description: '텍스트, 이미지, 동영상 클립 또는 오디오 참조로 짧은 AI 동영상을 만드세요.' },
    asmr: { title: 'AI ASMR 동영상 생성기', description: '텍스트 프롬프트나 참조 이미지로 동기화된 사운드가 있는 촉각적인 AI ASMR 영상을 만드세요.' },
    kissing: { title: 'AI 키스 동영상 생성기', description: '사진 한 장 또는 두 장을 업로드해 커플 편집, 기념일, 스토리 릴용 짧은 로맨틱 AI 키스 영상을 만드세요.' },
    talkingAvatar: { title: 'AI 말하는 아바타', description: '인물 사진과 음성 오디오를 업로드해 짧은 립싱크 말하는 아바타 영상을 만드세요.' },
    textToVideo: { title: '텍스트-동영상 생성기', description: '텍스트 프롬프트를 광고, 스토리보드, 소셜 클립, 콘셉트 테스트용 짧은 AI 동영상으로 만드세요.' },
    imageToVideo: { title: '이미지-동영상 생성기', description: '사진, 제품 이미지, 아트워크, 참조 프레임에 제어 가능한 AI 모션을 적용하세요.' },
    hairstyle: { title: 'AI 헤어스타일 변경기', description: '인물의 전체적인 모습을 유지하면서 참조 사진에서 다양한 헤어스타일을 시험해 보세요.' },
    hairColor: { title: 'AI 헤어 컬러 변경기', description: '참조 기반 AI 편집으로 사진에서 자연스럽거나 창의적인 헤어 컬러를 미리 확인하세요.' },
    clothes: { title: 'AI 의상 체인저', description: '인물 사진을 업로드하고 가상 착용 스타일 프롬프트로 현실적인 의상 변경을 미리보세요.' },
    bikini: { title: 'AI 비키니 생성기', description: '성인 인물 사진과 비키니 참조 이미지를 업로드해 원본 인물을 유지한 깔끔한 수영복 편집을 미리보세요.' },
  },
  it: {
    filters: { all: 'Tutti', image: 'Strumenti per immagini IA', video: 'Strumenti video IA' },
    heroDescription: 'Esplora strumenti IA per immagini e video con anteprime chiare. Scegli uno strumento e inizia in pochi secondi.',
    textToImage: { title: 'Generatore da testo a immagine', description: 'Trasforma prompt scritti in immagini IA per concept, marketing, poster e contenuti social.' },
    imageToImage: { title: 'Generatore IA da immagine a immagine', description: 'Carica un’immagine di riferimento e usa un prompt per modificarla, trasformarla o cambiarne lo stile.' },
    video: { title: 'Generatore video IA', description: 'Crea brevi video IA da testo, immagini, clip video o riferimenti audio.' },
    asmr: { title: 'Generatore video ASMR IA', description: 'Crea video ASMR tattili con audio sincronizzato da un prompt testuale o da un’immagine di riferimento.' },
    kissing: { title: 'Generatore di video di baci IA', description: 'Carica una o due foto e crea brevi video di baci romantici per edit di coppia, anniversari e reel.' },
    talkingAvatar: { title: 'Avatar parlante IA', description: 'Carica un ritratto e audio vocale per creare un breve video avatar con labbra sincronizzate.' },
    textToVideo: { title: 'Generatore da testo a video', description: 'Trasforma prompt scritti in brevi video IA per annunci, storyboard, clip social e test di concept.' },
    imageToVideo: { title: 'Generatore da immagine a video', description: 'Anima foto, immagini di prodotto, opere e fotogrammi di riferimento con movimenti IA controllati.' },
    hairstyle: { title: 'Cambia acconciatura IA', description: 'Prova diverse acconciature su una foto mantenendo coerenti la persona e l’aspetto generale.' },
    hairColor: { title: 'Cambia colore capelli IA', description: 'Visualizza colori naturali e creativi con editing IA guidato da un’immagine di riferimento.' },
    clothes: { title: 'Cambia abiti con IA', description: 'Carica una foto della persona e visualizza cambi outfit realistici con prompt da prova virtuale.' },
    bikini: { title: 'Generatore di bikini IA', description: 'Carica una foto adulta e un riferimento bikini per visualizzare edit swimwear di buon gusto mantenendo la persona originale.' },
  },
}

const wan25VideoCards: Record<AiToolsLocale, Pick<AiToolsCard, 'title' | 'description'>> = {
  en: { title: 'Wan 2.5 AI Video Generator', description: 'Create Wan 2.5 text-to-video or image-to-video clips with 5/10 second, 720p/1080p, and native audio settings.' },
  de: { title: 'Wan 2.5 KI-Videogenerator', description: 'Erstellen Sie Wan 2.5 Text-zu-Video- oder Bild-zu-Video-Clips mit 5/10 Sekunden, 720p/1080p und nativen Audioeinstellungen.' },
  ja: { title: 'Wan 2.5 AI動画生成', description: 'Wan 2.5でテキスト動画または画像動画を作成し、5/10秒、720p/1080p、ネイティブ音声設定を使えます。' },
  es: { title: 'Generador de video IA Wan 2.5', description: 'Crea clips Wan 2.5 de texto a video o imagen a video con 5/10 segundos, 720p/1080p y audio nativo.' },
  'zh-TW': { title: 'Wan 2.5 AI 影片生成器', description: '使用 Wan 2.5 建立文字轉影片或圖片轉影片短片，支援 5/10 秒、720p/1080p 與原生音訊設定。' },
  pt: { title: 'Gerador de vídeo IA Wan 2.5', description: 'Crie clipes Wan 2.5 de texto para vídeo ou imagem para vídeo com 5/10 segundos, 720p/1080p e áudio nativo.' },
  fr: { title: 'Générateur vidéo IA Wan 2.5', description: 'Créez des clips Wan 2.5 texte vers vidéo ou image vers vidéo avec 5/10 secondes, 720p/1080p et audio natif.' },
  ko: { title: 'Wan 2.5 AI 동영상 생성기', description: 'Wan 2.5로 5/10초, 720p/1080p, 네이티브 오디오 설정의 텍스트-동영상 또는 이미지-동영상을 만드세요.' },
  it: { title: 'Generatore video IA Wan 2.5', description: 'Crea clip Wan 2.5 da testo o immagine con 5/10 secondi, 720p/1080p e audio nativo.' },
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

const aiToolsCardOrder = [
  '/ai-image-generator',
  '/text-to-image-generator',
  '/ai-image-to-image-generator',
  '/ai-video-generator',
  '/text-to-video-generator',
  '/image-to-video-generator',
  '/world-cup-ai-image-generator',
  '/ai-couple-photo-maker',
  '/ai-baby-generator',
  '/ai-dance-generator',
  '/ai-kissing-video-generator',
  '/talking-avatar-creator',
  '/ai-hairstyle-changer',
  '/ai-hair-color-changer',
  '/ai-clothes-changer',
  '/ai-bikini-generator',
  '/ai-asmr-video-generator',
  '/model/wan-2-5-ai-video-generator',
  '/watermark-remover',
  '/photo-restoration',
] as const

const enCardsByHref = Object.fromEntries(en.cards.map((card) => [card.href, card])) as Record<string, AiToolsCard>

function getStoredCardByHref(
  storedCards: StoredAiToolsCard[],
  href: string,
): Pick<AiToolsCard, 'title' | 'description'> | undefined {
  return storedCards.find((card) => card.href === href)
}

function getSupplementalCardByHref(
  supplemental: SupplementalCopy,
  href: string,
  locale: AiToolsLocale,
): Pick<AiToolsCard, 'title' | 'description'> | undefined {
  const cardsByHref: Record<string, Pick<AiToolsCard, 'title' | 'description'>> = {
    '/text-to-image-generator': supplemental.textToImage,
    '/ai-image-to-image-generator': supplemental.imageToImage,
    '/ai-video-generator': supplemental.video,
    '/text-to-video-generator': supplemental.textToVideo,
    '/image-to-video-generator': supplemental.imageToVideo,
    '/ai-kissing-video-generator': supplemental.kissing,
    '/talking-avatar-creator': supplemental.talkingAvatar,
    '/ai-hairstyle-changer': supplemental.hairstyle,
    '/ai-hair-color-changer': supplemental.hairColor,
    '/ai-clothes-changer': supplemental.clothes,
    '/ai-bikini-generator': supplemental.bikini,
    '/ai-asmr-video-generator': supplemental.asmr,
    '/model/wan-2-5-ai-video-generator': wan25VideoCards[locale],
  }

  return cardsByHref[href]
}

function getLocalizedCards(locale: AiToolsLocale, storedCards: StoredAiToolsCard[]): AiToolsCard[] {
  const supplemental = supplementalCopies[locale]

  return aiToolsCardOrder.map((href) => {
    const baseCard = enCardsByHref[href]
    const localizedCard =
      locale === 'en'
        ? baseCard
        : getSupplementalCardByHref(supplemental, href, locale) || getStoredCardByHref(storedCards, href)

    return applyLocalizedCard(baseCard, localizedCard || baseCard)
  })
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
