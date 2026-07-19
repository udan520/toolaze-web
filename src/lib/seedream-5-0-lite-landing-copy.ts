import type { Metadata } from 'next'

export const SEEDREAM_5_0_LITE_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type Seedream50LiteLocale = (typeof SEEDREAM_5_0_LITE_LOCALES)[number]

type FeatureItem = {
  title: string
  text: string
  paragraphs: string[]
  slot: string
  label: string
}

type GalleryItem = {
  title: string
  text: string
  slot: string
}

type ComparisonRow = {
  capability: string
  seedream50: string
  seedream45: string
  gpt: string
  nano: string
}

type ComparisonCapabilityLabels = [
  string,
  string,
  string,
  string,
  string,
  string,
]

type ComparisonRowValues = Array<Omit<ComparisonRow, 'capability'>>

type PromptExample = {
  title: string
  prompt: string
  id: string
  slot: string
}

type RelatedLink = {
  title: string
  href: string
  text: string
}

type FaqItem = {
  q: string
  a: string
}

type AudienceSection = {
  title: string
  text: string
  items: string[]
}

type MediaPlaceholderItem = {
  title: string
  text: string
  source?: string
  creator?: string
  name?: string
  handle?: string
  body?: string
  href?: string
  embedUrl?: string
  videoId?: string
  thumbnailUrl?: string
  slot: string
}

export type Seedream50LiteLandingCopy = {
  metadata: {
    title: string
    description: string
    openGraphDescription: string
    twitterDescription: string
  }
  breadcrumbs: {
    home: string
    model: string
    current: string
  }
  schema: {
    pageName: string
    appName: string
    howToName: string
  }
  hero: {
    modelName: string
    suffix: string
    description: string
    availability: string
  }
  whatIs: {
    title: string
    paragraphs: string[]
  }
  features: {
    title: string
    text: string
    items: FeatureItem[]
  }
  gallery: {
    title: string
    text: string
    examples: GalleryItem[]
  }
  comparison: {
    title: string
    text: string
    capabilityHeader: string
    note: string
    rows: ComparisonRow[]
  }
  audiences: AudienceSection
  howTo: {
    title: string
    steps: string[]
  }
  prompts: {
    title: string
    text: string
    copyButton: string
    copiedButton: string
    examples: PromptExample[]
  }
  related: {
    title: string
    text?: string
    tryNow: string
    links: RelatedLink[]
  }
  youtube: {
    title: string
    text: string
    watch: string
    examples: MediaPlaceholderItem[]
  }
  reddit: {
    title: string
    text: string
    communityDiscussion: string
    openDiscussion: string
    items: MediaPlaceholderItem[]
  }
  x: {
    title: string
    text: string
    watch: string
    read: string
    items: MediaPlaceholderItem[]
  }
  image: {
    container: string
  }
  faq: {
    title: string
    items: FaqItem[]
  }
  cta: {
    title: string
    text: string
    button: string
    label: string
  }
}

type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

const comparisonCapabilityLabels: Record<Seedream50LiteLocale, ComparisonCapabilityLabels> = {
  en: [
    'Official source',
    'Maximum output resolution',
    'Reference image limit',
    'Reference upload size',
    'Aspect ratio options',
    'Best fit',
  ],
  de: [
    'Offizielle Quelle',
    'Maximale Ausgabeauflösung',
    'Limit für Referenzbilder',
    'Uploadgröße pro Referenzbild',
    'Seitenverhältnis-Optionen',
    'Beste Eignung',
  ],
  ja: [
    '公式提供元',
    '最大出力解像度',
    '参照画像の上限',
    '参照画像のアップロードサイズ',
    'アスペクト比オプション',
    '得意な用途',
  ],
  es: [
    'Fuente oficial',
    'Resolución máxima de salida',
    'Límite de imágenes de referencia',
    'Tamaño de subida por referencia',
    'Opciones de proporción',
    'Mejor uso',
  ],
  'zh-TW': [
    '官方來源',
    '最大輸出解析度',
    '參考圖數量上限',
    '單張參考圖上傳大小',
    '長寬比選項',
    '最適合',
  ],
  pt: [
    'Fonte oficial',
    'Resolução máxima de saída',
    'Limite de imagens de referência',
    'Tamanho de upload por referência',
    'Opções de proporção',
    'Melhor uso',
  ],
  fr: [
    'Source officielle',
    'Résolution maximale de sortie',
    'Limite d’images de référence',
    'Taille d’import par référence',
    'Options de ratio',
    'Meilleur usage',
  ],
  ko: [
    '공식 출처',
    '최대 출력 해상도',
    '참조 이미지 한도',
    '참조 이미지 업로드 크기',
    '화면비 옵션',
    '적합한 작업',
  ],
  it: [
    'Fonte ufficiale',
    'Risoluzione massima in output',
    'Limite immagini di riferimento',
    'Dimensione upload per riferimento',
    'Opzioni rapporto d’aspetto',
    'Uso migliore',
  ],
}

const comparisonRowValues: Record<Seedream50LiteLocale, ComparisonRowValues> = {
  en: [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Google Gemini image family' },
    { seedream50: 'Official max not listed; Toolaze currently exposes 1K, 2K, and 4K settings through the available Seed workflow.', seedream45: 'Toolaze setting: 1K, 2K, and 4K.', gpt: 'Toolaze setting: 1K, 2K, and 4K.', nano: 'Toolaze setting: 1K, 2K, and 4K; availability can depend on the active model route.' },
    { seedream50: 'Dedicated 5.0 Lite official max not listed; current Toolaze Seed workflow supports up to 14 reference images.', seedream45: 'Up to 14 reference images on Toolaze.', gpt: 'Up to 16 reference images on Toolaze.', nano: 'Up to 8 reference images on Toolaze.' },
    { seedream50: 'Toolaze current Seed workflow: 10 MB per reference image.', seedream45: '10 MB per reference image on Toolaze.', gpt: '30 MB per reference image on Toolaze.', nano: '30 MB per reference image on Toolaze.' },
    { seedream50: 'Toolaze current Seed workflow: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2, and 21:9.', seedream45: '8 ratios on Toolaze: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2, and 21:9.', gpt: '6 ratios on Toolaze: auto, 1:1, 9:16, 16:9, 4:3, and 3:4.', nano: '11 ratios on Toolaze, including auto, square, portrait, landscape, 16:9, 9:16, and 21:9.' },
    { seedream50: 'Reasoning, online search grounding, and multimodal image planning.', seedream45: '4K-oriented product visuals, posters, typography, and reference edits.', gpt: 'Structured images, text-led graphics, and precise edits.', nano: 'Fast creative drafts and reference-based generation.' },
  ],
  de: [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Google Gemini Bildfamilie' },
    { seedream50: 'Offizielles Maximum nicht genannt; Toolaze bietet im verfügbaren Seed-Workflow 1K, 2K und 4K.', seedream45: 'Toolaze-Einstellung: 1K, 2K und 4K.', gpt: 'Toolaze-Einstellung: 1K, 2K und 4K.', nano: 'Toolaze-Einstellung: 1K, 2K und 4K; Verfügbarkeit hängt vom aktiven Modellpfad ab.' },
    { seedream50: 'Dediziertes 5.0-Lite-Maximum nicht genannt; aktueller Toolaze Seed-Workflow unterstützt bis zu 14 Referenzen.', seedream45: 'Bis zu 14 Referenzbilder auf Toolaze.', gpt: 'Bis zu 16 Referenzbilder auf Toolaze.', nano: 'Bis zu 8 Referenzbilder auf Toolaze.' },
    { seedream50: 'Aktueller Toolaze Seed-Workflow: 10 MB pro Referenzbild.', seedream45: '10 MB pro Referenzbild auf Toolaze.', gpt: '30 MB pro Referenzbild auf Toolaze.', nano: '30 MB pro Referenzbild auf Toolaze.' },
    { seedream50: 'Aktueller Toolaze Seed-Workflow: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 und 21:9.', seedream45: '8 Formate auf Toolaze: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 und 21:9.', gpt: '6 Formate auf Toolaze: auto, 1:1, 9:16, 16:9, 4:3 und 3:4.', nano: '11 Formate auf Toolaze, darunter auto, quadratisch, Hochformat, Querformat, 16:9, 9:16 und 21:9.' },
    { seedream50: 'Reasoning, Online-Kontext und multimodale Bildplanung.', seedream45: '4K-orientierte Produktbilder, Poster, Typografie und Referenzbearbeitung.', gpt: 'Strukturierte Bilder, textgeführte Grafiken und präzise Bearbeitung.', nano: 'Schnelle kreative Entwürfe und referenzbasierte Generierung.' },
  ],
  ja: [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Google Gemini 画像ファミリー' },
    { seedream50: '公式の最大値は未掲載。Toolaze の利用可能な Seed ワークフローでは 1K、2K、4K を選択できます。', seedream45: 'Toolaze 設定: 1K、2K、4K。', gpt: 'Toolaze 設定: 1K、2K、4K。', nano: 'Toolaze 設定: 1K、2K、4K。利用可否は有効なモデル経路により変わります。' },
    { seedream50: '専用 5.0 Lite の公式上限は未掲載。現在の Toolaze Seed ワークフローは最大14枚の参照画像に対応します。', seedream45: 'Toolaze で最大14枚の参照画像。', gpt: 'Toolaze で最大16枚の参照画像。', nano: 'Toolaze で最大8枚の参照画像。' },
    { seedream50: '現在の Toolaze Seed ワークフロー: 参照画像1枚あたり10 MB。', seedream45: 'Toolaze で参照画像1枚あたり10 MB。', gpt: 'Toolaze で参照画像1枚あたり30 MB。', nano: 'Toolaze で参照画像1枚あたり30 MB。' },
    { seedream50: '現在の Toolaze Seed ワークフロー: 1:1、4:3、3:4、16:9、9:16、2:3、3:2、21:9。', seedream45: 'Toolaze の8比率: 1:1、4:3、3:4、16:9、9:16、2:3、3:2、21:9。', gpt: 'Toolaze の6比率: auto、1:1、9:16、16:9、4:3、3:4。', nano: 'Toolaze の11比率。auto、正方形、縦長、横長、16:9、9:16、21:9 など。' },
    { seedream50: '推論、オンライン文脈、マルチモーダルな画像設計。', seedream45: '4K向けの商品ビジュアル、ポスター、タイポグラフィ、参照編集。', gpt: '構造化画像、文字中心グラフィック、精密な編集。', nano: '素早いクリエイティブ草案と参照ベース生成。' },
  ],
  es: [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Familia de imágenes Google Gemini' },
    { seedream50: 'El máximo oficial no está publicado; Toolaze expone 1K, 2K y 4K mediante el flujo Seed disponible.', seedream45: 'Ajuste de Toolaze: 1K, 2K y 4K.', gpt: 'Ajuste de Toolaze: 1K, 2K y 4K.', nano: 'Ajuste de Toolaze: 1K, 2K y 4K; la disponibilidad depende de la ruta activa del modelo.' },
    { seedream50: 'El máximo oficial dedicado de 5.0 Lite no está publicado; el flujo Seed actual de Toolaze admite hasta 14 referencias.', seedream45: 'Hasta 14 imágenes de referencia en Toolaze.', gpt: 'Hasta 16 imágenes de referencia en Toolaze.', nano: 'Hasta 8 imágenes de referencia en Toolaze.' },
    { seedream50: 'Flujo Seed actual de Toolaze: 10 MB por imagen de referencia.', seedream45: '10 MB por imagen de referencia en Toolaze.', gpt: '30 MB por imagen de referencia en Toolaze.', nano: '30 MB por imagen de referencia en Toolaze.' },
    { seedream50: 'Flujo Seed actual de Toolaze: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 y 21:9.', seedream45: '8 proporciones en Toolaze: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 y 21:9.', gpt: '6 proporciones en Toolaze: auto, 1:1, 9:16, 16:9, 4:3 y 3:4.', nano: '11 proporciones en Toolaze, incluyendo auto, cuadrado, vertical, horizontal, 16:9, 9:16 y 21:9.' },
    { seedream50: 'Razonamiento, contexto de búsqueda online y planificación multimodal.', seedream45: 'Visuales de producto 4K, pósters, tipografía y ediciones con referencias.', gpt: 'Imágenes estructuradas, gráficos con texto y ediciones precisas.', nano: 'Borradores creativos rápidos y generación con referencias.' },
  ],
  'zh-TW': [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Google Gemini 圖像系列' },
    { seedream50: '官方未列出最大值；Toolaze 目前透過可用的 Seed 工作流程提供 1K、2K、4K 設定。', seedream45: 'Toolaze 設定：1K、2K、4K。', gpt: 'Toolaze 設定：1K、2K、4K。', nano: 'Toolaze 設定：1K、2K、4K；可用性取決於目前模型路由。' },
    { seedream50: '專用 5.0 Lite 官方上限未列出；目前 Toolaze Seed 工作流程支援最多 14 張參考圖。', seedream45: 'Toolaze 最多 14 張參考圖。', gpt: 'Toolaze 最多 16 張參考圖。', nano: 'Toolaze 最多 8 張參考圖。' },
    { seedream50: 'Toolaze 目前 Seed 工作流程：每張參考圖 10 MB。', seedream45: 'Toolaze 每張參考圖 10 MB。', gpt: 'Toolaze 每張參考圖 30 MB。', nano: 'Toolaze 每張參考圖 30 MB。' },
    { seedream50: 'Toolaze 目前 Seed 工作流程：1:1、4:3、3:4、16:9、9:16、2:3、3:2、21:9。', seedream45: 'Toolaze 8 種比例：1:1、4:3、3:4、16:9、9:16、2:3、3:2、21:9。', gpt: 'Toolaze 6 種比例：auto、1:1、9:16、16:9、4:3、3:4。', nano: 'Toolaze 11 種比例，包含 auto、方形、直式、橫式、16:9、9:16、21:9。' },
    { seedream50: '推理、線上搜尋脈絡與多模態圖像規劃。', seedream45: '4K 導向商品視覺、海報、文字排版與參考編輯。', gpt: '結構化圖像、文字主導圖形與精準編輯。', nano: '快速創意草稿與參考圖生成。' },
  ],
  pt: [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Família de imagens Google Gemini' },
    { seedream50: 'O máximo oficial não foi listado; o Toolaze expõe 1K, 2K e 4K pelo fluxo Seed disponível.', seedream45: 'Configuração do Toolaze: 1K, 2K e 4K.', gpt: 'Configuração do Toolaze: 1K, 2K e 4K.', nano: 'Configuração do Toolaze: 1K, 2K e 4K; a disponibilidade depende da rota ativa do modelo.' },
    { seedream50: 'O máximo oficial dedicado do 5.0 Lite não foi listado; o fluxo Seed atual do Toolaze aceita até 14 referências.', seedream45: 'Até 14 imagens de referência no Toolaze.', gpt: 'Até 16 imagens de referência no Toolaze.', nano: 'Até 8 imagens de referência no Toolaze.' },
    { seedream50: 'Fluxo Seed atual do Toolaze: 10 MB por imagem de referência.', seedream45: '10 MB por referência no Toolaze.', gpt: '30 MB por referência no Toolaze.', nano: '30 MB por referência no Toolaze.' },
    { seedream50: 'Fluxo Seed atual do Toolaze: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 e 21:9.', seedream45: '8 proporções no Toolaze: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 e 21:9.', gpt: '6 proporções no Toolaze: auto, 1:1, 9:16, 16:9, 4:3 e 3:4.', nano: '11 proporções no Toolaze, incluindo auto, quadrado, retrato, paisagem, 16:9, 9:16 e 21:9.' },
    { seedream50: 'Raciocínio, contexto de busca online e planejamento multimodal.', seedream45: 'Visuais de produto 4K, pôsteres, tipografia e edições com referência.', gpt: 'Imagens estruturadas, gráficos com texto e edições precisas.', nano: 'Rascunhos criativos rápidos e geração baseada em referências.' },
  ],
  fr: [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Famille d’images Google Gemini' },
    { seedream50: 'Maximum officiel non publié ; Toolaze expose 1K, 2K et 4K via le workflow Seed disponible.', seedream45: 'Réglage Toolaze : 1K, 2K et 4K.', gpt: 'Réglage Toolaze : 1K, 2K et 4K.', nano: 'Réglage Toolaze : 1K, 2K et 4K ; la disponibilité dépend de la route de modèle active.' },
    { seedream50: 'Maximum officiel dédié 5.0 Lite non publié ; le workflow Seed actuel de Toolaze accepte jusqu’à 14 références.', seedream45: 'Jusqu’à 14 images de référence sur Toolaze.', gpt: 'Jusqu’à 16 images de référence sur Toolaze.', nano: 'Jusqu’à 8 images de référence sur Toolaze.' },
    { seedream50: 'Workflow Seed actuel de Toolaze : 10 MB par image de référence.', seedream45: '10 MB par référence sur Toolaze.', gpt: '30 MB par référence sur Toolaze.', nano: '30 MB par référence sur Toolaze.' },
    { seedream50: 'Workflow Seed actuel de Toolaze : 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 et 21:9.', seedream45: '8 ratios sur Toolaze : 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 et 21:9.', gpt: '6 ratios sur Toolaze : auto, 1:1, 9:16, 16:9, 4:3 et 3:4.', nano: '11 ratios sur Toolaze, dont auto, carré, portrait, paysage, 16:9, 9:16 et 21:9.' },
    { seedream50: 'Raisonnement, contexte de recherche en ligne et planification multimodale.', seedream45: 'Visuels produit 4K, affiches, typographie et éditions par référence.', gpt: 'Images structurées, visuels avec texte et éditions précises.', nano: 'Brouillons créatifs rapides et génération par référence.' },
  ],
  ko: [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Google Gemini 이미지 제품군' },
    { seedream50: '공식 최대값은 공개되지 않았으며 Toolaze는 사용 가능한 Seed 워크플로에서 1K, 2K, 4K 설정을 제공합니다.', seedream45: 'Toolaze 설정: 1K, 2K, 4K.', gpt: 'Toolaze 설정: 1K, 2K, 4K.', nano: 'Toolaze 설정: 1K, 2K, 4K. 사용 가능 여부는 활성 모델 경로에 따라 달라질 수 있습니다.' },
    { seedream50: '전용 5.0 Lite 공식 최대값은 공개되지 않았으며 현재 Toolaze Seed 워크플로는 최대 14개 참조 이미지를 지원합니다.', seedream45: 'Toolaze에서 최대 14개 참조 이미지.', gpt: 'Toolaze에서 최대 16개 참조 이미지.', nano: 'Toolaze에서 최대 8개 참조 이미지.' },
    { seedream50: '현재 Toolaze Seed 워크플로: 참조 이미지당 10 MB.', seedream45: 'Toolaze에서 참조 이미지당 10 MB.', gpt: 'Toolaze에서 참조 이미지당 30 MB.', nano: 'Toolaze에서 참조 이미지당 30 MB.' },
    { seedream50: '현재 Toolaze Seed 워크플로: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2, 21:9.', seedream45: 'Toolaze 8개 비율: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2, 21:9.', gpt: 'Toolaze 6개 비율: auto, 1:1, 9:16, 16:9, 4:3, 3:4.', nano: 'Toolaze 11개 비율: auto, 정사각형, 세로, 가로, 16:9, 9:16, 21:9 등.' },
    { seedream50: '추론, 온라인 검색 맥락, 멀티모달 이미지 기획.', seedream45: '4K 지향 제품 이미지, 포스터, 타이포그래피, 참조 편집.', gpt: '구조화 이미지, 텍스트 중심 그래픽, 정밀 편집.', nano: '빠른 창작 초안과 참조 기반 생성.' },
  ],
  it: [
    { seedream50: 'ByteDance Seed', seedream45: 'ByteDance Seed', gpt: 'OpenAI', nano: 'Famiglia immagini Google Gemini' },
    { seedream50: 'Il massimo ufficiale non è indicato; Toolaze espone 1K, 2K e 4K tramite il workflow Seed disponibile.', seedream45: 'Impostazione Toolaze: 1K, 2K e 4K.', gpt: 'Impostazione Toolaze: 1K, 2K e 4K.', nano: 'Impostazione Toolaze: 1K, 2K e 4K; la disponibilità dipende dalla route modello attiva.' },
    { seedream50: 'Il massimo ufficiale dedicato 5.0 Lite non è indicato; il workflow Seed attuale di Toolaze supporta fino a 14 riferimenti.', seedream45: 'Fino a 14 immagini di riferimento su Toolaze.', gpt: 'Fino a 16 immagini di riferimento su Toolaze.', nano: 'Fino a 8 immagini di riferimento su Toolaze.' },
    { seedream50: 'Workflow Seed attuale di Toolaze: 10 MB per immagine di riferimento.', seedream45: '10 MB per riferimento su Toolaze.', gpt: '30 MB per riferimento su Toolaze.', nano: '30 MB per riferimento su Toolaze.' },
    { seedream50: 'Workflow Seed attuale di Toolaze: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 e 21:9.', seedream45: '8 rapporti su Toolaze: 1:1, 4:3, 3:4, 16:9, 9:16, 2:3, 3:2 e 21:9.', gpt: '6 rapporti su Toolaze: auto, 1:1, 9:16, 16:9, 4:3 e 3:4.', nano: '11 rapporti su Toolaze, tra cui auto, quadrato, verticale, orizzontale, 16:9, 9:16 e 21:9.' },
    { seedream50: 'Ragionamento, contesto da ricerca online e pianificazione multimodale.', seedream45: 'Visual prodotto 4K, poster, tipografia ed editing con riferimenti.', gpt: 'Immagini strutturate, grafiche con testo ed editing preciso.', nano: 'Bozze creative rapide e generazione basata su riferimenti.' },
  ],
}

function buildComparisonRows(
  labels: ComparisonCapabilityLabels = comparisonCapabilityLabels.en,
  values: ComparisonRowValues = comparisonRowValues.en,
): ComparisonRow[] {
  return values.map((value, index) => ({
    capability: labels[index],
    ...value,
  }))
}

const en: Seedream50LiteLandingCopy = {
  metadata: {
    title: 'Seedream 5.0 Lite AI Image Generator | Toolaze',
    description:
      'Explore Seedream 5.0 Lite on Toolaze: ByteDance Seed image generation with deep thinking, online search grounding, reference-aware editing, and professional visual design workflows.',
    openGraphDescription:
      'Learn how Seedream 5.0 Lite improves AI image generation with reasoning, online search grounding, reference-aware editing, and professional visual layouts.',
    twitterDescription:
      'Explore Seedream 5.0 Lite for reasoning-driven AI image generation, online search grounding, and professional image design workflows.',
  },
  breadcrumbs: {
    home: 'Home',
    model: 'Model',
    current: 'Seedream 5.0 Lite',
  },
  schema: {
    pageName: 'Seedream 5.0 Lite AI Image Generator',
    appName: 'Seedream 5.0 Lite on Toolaze',
    howToName: 'How to use Seedream 5.0 Lite on Toolaze',
  },
  hero: {
    modelName: 'Seedream 5.0 Lite',
    suffix: 'AI Image Generator',
    description:
      'Explore Seedream 5.0 Lite, ByteDance Seed\'s image model for reasoning-driven prompts, online search grounded visuals, reference-aware edits, and polished image design workflows.',
    availability:
      'Toolaze currently shows Seedream 5.0 Lite as a model guide and routes generation through available Seed image workflows while dedicated 5.0 Lite access is finalized.',
  },
  whatIs: {
    title: 'What Is Seedream 5.0 Lite?',
    paragraphs: [
      'Seedream 5.0 Lite is a ByteDance Seed image generation model presented as a unified multimodal image model. Official materials emphasize stronger understanding, deep thinking, online search grounding, and higher-quality image generation across creative and professional tasks.',
      'The model is designed for prompts that need more than visual style alone: it can reason through layout instructions, use web-grounded context where available, preserve visual intent across edits, and produce images for posters, branded assets, illustrations, product visuals, and text-led designs.',
      'On Toolaze, this page helps creators compare Seedream 5.0 Lite with current image models and prepare stronger prompts for the Seed image workflow.',
    ],
  },
  features: {
    title: 'Key Features of Seedream 5.0 Lite',
    text:
      'Use Seedream 5.0 Lite when the prompt needs reasoning, reference awareness, factual context, and controlled visual composition rather than a single decorative image.',
    items: [
      {
        title: 'Deep Thinking for Complex Image Prompts',
        text:
          'Seedream 5.0 Lite is positioned around stronger reasoning. That matters for prompts with several constraints: subject placement, layout hierarchy, exact style rules, scene relationships, and visible design intent.',
        paragraphs: [
          'Seedream 5.0 Lite is positioned around stronger reasoning. That matters for prompts with several constraints: subject placement, layout hierarchy, exact style rules, scene relationships, and visible design intent.',
          'Use it for briefs where the image should satisfy a plan instead of only matching a mood: landing page visuals, explainers, campaign scenes, and design compositions with multiple constraints.',
        ],
        slot: 'feature-deep-thinking',
        label: 'Reasoning workflow visual placeholder for Seedream 5.0 Lite',
      },
      {
        title: 'Online Search Grounded Visual Direction',
        text:
          'Official Seedream 5.0 Lite materials highlight online search. This is useful when an image concept depends on current context, recognizable categories, regional details, or richer visual references.',
        paragraphs: [
          'Official Seedream 5.0 Lite materials highlight online search. This is useful when an image concept depends on current context, recognizable categories, regional details, or richer visual references.',
          'For production work, this helps turn a broad creative brief into more grounded visual direction before you refine composition, lighting, typography, and final output settings.',
        ],
        slot: 'feature-online-search',
        label: 'Online search grounded image direction placeholder',
      },
      {
        title: 'Reference-Aware Editing and Visual Consistency',
        text:
          'Seedream 5.0 Lite is designed for multimodal image tasks, including workflows where uploaded images, style references, or existing compositions should guide the result instead of being ignored.',
        paragraphs: [
          'Seedream 5.0 Lite is designed for multimodal image tasks, including workflows where uploaded images, style references, or existing compositions should guide the result instead of being ignored.',
          'That makes it useful for product iterations, character continuity, poster refinements, and brand scenes where the uploaded reference should remain recognizable after editing.',
        ],
        slot: 'feature-reference-aware',
        label: 'Reference-aware editing placeholder for Seedream 5.0 Lite',
      },
      {
        title: 'Professional Layouts and Text-Led Designs',
        text:
          'Use it for campaign posters, information cards, brand mockups, editorial visuals, product scenes, and social graphics where readable structure and polished composition matter.',
        paragraphs: [
          'Use it for campaign posters, information cards, brand mockups, editorial visuals, product scenes, and social graphics where readable structure and polished composition matter.',
          'Structured prompts should define hierarchy, label areas, title placement, safe margins, visual density, and where the image needs clean negative space.',
        ],
        slot: 'feature-layouts',
        label: 'Professional visual layout placeholder for Seedream 5.0 Lite',
      },
      {
        title: 'Multimodal Briefs for Real Design Work',
        text:
          'Seedream 5.0 Lite is most useful when text instructions and visual references work together, especially for design reviews, image refreshes, and concept-to-output workflows.',
        paragraphs: [
          'Seedream 5.0 Lite is most useful when text instructions and visual references work together, especially for design reviews, image refreshes, and concept-to-output workflows.',
          'Combine a concise objective with reference roles, must-keep elements, composition notes, visual style, output format, and review criteria before generating.',
        ],
        slot: 'feature-multimodal-briefs',
        label: 'Multimodal creative brief placeholder for Seedream 5.0 Lite',
      },
    ],
  },
  gallery: {
    title: 'Seedream 5.0 Lite Example Directions',
    text:
      'These prompt directions reflect the official capability focus: reasoning, search-grounded context, design layouts, reference editing, and creative visual exploration.',
    examples: [
      {
        title: 'Search-Grounded Product Concept',
        text:
          'Create a product launch image with region-aware visual cues, current design language, accurate material details, and a clean hero composition.',
        slot: 'gallery-search-grounded-product',
      },
      {
        title: 'Reference-Guided Poster Edit',
        text:
          'Upload a draft poster, keep the central product and brand palette, then improve hierarchy, lighting, title placement, and call-to-action clarity.',
        slot: 'gallery-reference-poster-edit',
      },
      {
        title: 'Reasoned Infographic Scene',
        text:
          'Design a simple information graphic where every visual element maps to a specific concept, with readable labels and balanced spacing.',
        slot: 'gallery-reasoned-infographic',
      },
      {
        title: 'Character and Style Continuity',
        text:
          'Use reference images to keep a character, outfit, or brand asset consistent while changing background, mood, camera angle, or format.',
        slot: 'gallery-character-continuity',
      },
      {
        title: 'Editorial Visual Brief',
        text:
          'Turn a complex article theme into a clean editorial image with symbolic objects, headline-safe space, and a controlled visual hierarchy.',
        slot: 'gallery-editorial-brief',
      },
      {
        title: 'UI and Diagram Mockup',
        text:
          'Create a product workflow diagram or interface concept where labels, panels, arrows, and visual grouping stay easy to scan.',
        slot: 'gallery-ui-diagram',
      },
      {
        title: 'Interior and Architecture Update',
        text:
          'Use a room or facade reference, keep structural cues, and change lighting, materials, furniture, signage, or seasonal mood.',
        slot: 'gallery-interior-architecture',
      },
      {
        title: 'Multilingual Text Layout',
        text:
          'Prepare a poster, menu board, or social card where multiple text zones need clear hierarchy and post-generation review.',
        slot: 'gallery-multilingual-layout',
      },
    ],
  },
  comparison: {
    title: 'Seedream 5.0 Lite vs Seedream 4.5 vs GPT Image 2 vs Nano Banana Pro',
    text:
      'Choose the model by task. Seedream 5.0 Lite is most interesting when reasoning and online search grounding matter; Seedream 4.5 remains strong for Toolaze-supported 4K and reference-guided Seed workflows.',
    capabilityHeader: 'Capability',
    note: '',
    rows: buildComparisonRows(),
  },
  audiences: {
    title: 'Who Should Use Seedream 5.0 Lite?',
    text:
      'Seedream 5.0 Lite is most useful for creators who need an image model to follow a brief, reason through references, and produce structured design-ready visuals.',
    items: [
      'Brand designers preparing campaign key visuals, social cards, product scenes, and launch assets.',
      'E-commerce teams refining product hero images, detail cards, packaging concepts, and seasonal variants.',
      'Content teams turning explainers, reports, and article ideas into structured infographics or editorial visuals.',
      'Creative directors comparing model behavior before choosing a workflow for higher-resolution production.',
      'Product marketers who need clear text zones, visual hierarchy, and review-friendly image concepts.',
      'Creators who use reference images and need consistent subjects, styles, or layouts across variations.',
    ],
  },
  howTo: {
    title: 'How to Use Seedream 5.0 Lite on Toolaze',
    steps: [
      'Open the Seedream 5.0 Lite model page and start from the functional generator area.',
      'Write a structured prompt that names the output type, subject, layout, reference role, lighting, aspect ratio, and text requirements.',
      'Upload reference images when the result should preserve a product, person, design, or visual style.',
      'Use Toolaze\'s available Seed image workflow to draft results while dedicated Seedream 5.0 Lite access is being finalized.',
      'Review text, factual details, and brand-critical elements before publishing any generated image.',
    ],
  },
  prompts: {
    title: 'Seedream 5.0 Lite Prompt Examples',
    text:
      'Use these prompts as starting points for reasoning-heavy, search-aware, and reference-guided image generation tasks.',
    copyButton: 'Copy Prompt',
    copiedButton: 'Copied',
    examples: [
      {
        title: 'Search-Grounded Campaign Key Visual',
        id: 'search-grounded-campaign-key-visual',
        slot: 'prompt-search-grounded-campaign',
        prompt:
          'Create a premium campaign key visual for a new eco travel backpack. Use current outdoor gear design language, recycled fabric details, a realistic mountain train station setting, clear product hierarchy, soft morning light, and a clean headline area. The image should feel factual, modern, and ready for a landing page hero.',
      },
      {
        title: 'Reference-Aware Product Redesign',
        id: 'reference-aware-product-redesign',
        slot: 'prompt-reference-product-redesign',
        prompt:
          'Use the uploaded product image as the exact reference. Keep the shape, logo placement, color family, and material finish. Improve the background into a minimal studio scene with subtle reflections, clearer edge lighting, and a 4:5 composition for a product page.',
      },
      {
        title: 'Reasoned Information Graphic',
        id: 'reasoned-information-graphic',
        slot: 'prompt-reasoned-information-graphic',
        prompt:
          'Design a square educational infographic explaining how a solar-powered home battery stores daytime energy for night use. Use three clear visual zones, readable labels, simple arrows, warm daylight on the left and evening interior light on the right, with a clean editorial layout.',
      },
      {
        title: 'Character Reference Continuity',
        id: 'character-reference-continuity',
        slot: 'prompt-character-reference-continuity',
        prompt:
          'Use the uploaded character reference to create a new cinematic portrait. Keep the face shape, hairstyle, outfit color palette, and personality consistent. Change the setting to a rainy neon street, use shallow depth of field, and preserve a natural expression.',
      },
      {
        title: 'Event Poster With Clear Text Zones',
        id: 'event-poster-clear-text-zones',
        slot: 'prompt-event-poster-clear-text-zones',
        prompt:
          'Design a vertical event poster for a future design conference. Create a bold central symbol, three clean text zones for title, date, and venue, generous margins, modern editorial lighting, and a premium technology atmosphere. Leave all text readable and easy to review.',
      },
      {
        title: 'Interior Redesign From Reference',
        id: 'interior-redesign-reference',
        slot: 'prompt-interior-redesign-reference',
        prompt:
          'Use the uploaded living room as the structural reference. Keep the window placement and room proportions, then redesign the space with warm minimal furniture, indirect lighting, natural materials, and a calm evening mood. Show the full room in a realistic wide-angle composition.',
      },
    ],
  },
  related: {
    title: 'Explore Related AI Image Models',
    text:
      'Compare Seedream 5.0 Lite with adjacent Toolaze image model pages when you need a different balance of generation, editing, reference control, or high-resolution output.',
    tryNow: 'Try now',
    links: [
      {
        title: 'Seedream 4.5',
        href: '/model/seedream-4-5',
        text: 'Use the current Toolaze Seed image workflow for 4K product visuals, typography-rich posters, and reference-guided edits.',
      },
      {
        title: 'GPT Image 2',
        href: '/model/gpt-image-2',
        text: 'Create structured images, mockups, text-led graphics, and edited visuals with GPT Image 2.',
      },
      {
        title: 'Wan 2.7 Image',
        href: '/model/wan-2-7-image',
        text: 'Try Wan 2.7 Image for thinking mode, multi-reference generation, and structured poster layouts.',
      },
    ],
  },
  youtube: {
    title: 'Seedream 5.0 Lite Video Watchlist',
    text:
      'Watch public Seedream 5.0 Lite videos that discuss model behavior, prompt workflows, and how the image model compares with adjacent generation tools.',
    watch: 'Watch on YouTube',
    examples: [
      {
        title: 'I Tested SeeDream 5.0 Lite so You Don\'t Have To',
        creator: 'Joseph Martin',
        text: 'A hands-on creator review focused on Seedream 5.0 Lite output quality and practical image generation behavior.',
        href: 'https://www.youtube.com/watch?v=Hya5KNw7ESI',
        embedUrl: 'https://www.youtube.com/embed/Hya5KNw7ESI',
        videoId: 'Hya5KNw7ESI',
        thumbnailUrl: 'https://i.ytimg.com/vi/Hya5KNw7ESI/hqdefault.jpg',
        slot: 'youtube-joseph-martin-review',
      },
      {
        title: 'Seedream 5.0 Lite Is Here',
        creator: 'YouTube creator walkthrough',
        text: 'A public overview video describing how Seedream 5.0 Lite changes AI image generation workflows.',
        href: 'https://www.youtube.com/watch?v=bY3yvp-cP7A',
        embedUrl: 'https://www.youtube.com/embed/bY3yvp-cP7A',
        videoId: 'bY3yvp-cP7A',
        thumbnailUrl: 'https://i.ytimg.com/vi/bY3yvp-cP7A/hqdefault.jpg',
        slot: 'youtube-seedream-lite-overview',
      },
      {
        title: 'Introducing Seedream 5.0 Lite',
        creator: 'ModelArk / BytePlus ecosystem',
        text: 'A short launch-style video introducing Seedream 5.0 Lite through the ModelArk API workflow.',
        href: 'https://www.youtube.com/watch?v=q4eI7eXjs0Q',
        embedUrl: 'https://www.youtube.com/embed/q4eI7eXjs0Q',
        videoId: 'q4eI7eXjs0Q',
        thumbnailUrl: 'https://i.ytimg.com/vi/q4eI7eXjs0Q/hqdefault.jpg',
        slot: 'youtube-modelark-launch',
      },
    ],
  },
  reddit: {
    title: 'Seedream 5.0 Lite on Reddit',
    text:
      'View verified Reddit posts with matching Seedream 5.0 Lite titles, source links, and original media grouped by post.',
    communityDiscussion: 'Community post',
    openDiscussion: 'Open Reddit thread',
    items: [
      {
        title: 'Seedream 5.0 Lite is now live',
        source: 'r/Freepik_AI',
        text: 'A Reddit announcement post for Seedream 5.0 Lite availability with multiple original media examples kept inside one carousel.',
        slot: 'reddit-freepik-live',
      },
      {
        title: 'Seedream 5.0 Lite API pricing breakdown',
        source: 'r/Bard',
        text: 'A Reddit post discussing Seedream 5.0 Lite pricing and API availability with an original media preview.',
        slot: 'reddit-pricing-breakdown',
      },
      {
        title: 'Seedream 5.0 Lite, Seedream 4.5, and Nano Banana comparison',
        source: 'r/ArtificialInteligence',
        text: 'A Reddit comparison post testing Seedream 5.0 Lite beside Seedream 4.5 and Nano Banana with original output media.',
        slot: 'reddit-model-comparison',
      },
    ],
  },
  x: {
    title: 'Seedream 5.0 Lite Posts on X',
    text:
      'Read public X posts from model platforms, AI tool providers, and benchmark communities discussing Seedream 5.0 Lite launch details, reasoning, search grounding, and multi-image editing.',
    watch: 'Open post',
    read: 'Source',
    items: [
      {
        title: 'BytePlus launch post',
        name: 'BytePlus',
        handle: '@BytePlusGlobal',
        body: 'INTRODUCING: Seedream 5.0 Lite — the next generation of AI image creation is here.',
        text: 'Official BytePlus launch post for Seedream 5.0 Lite with model positioning and image creation examples.',
        href: 'https://x.com/BytePlusGlobal/status/2026265861531541863',
        slot: 'x-byteplus-launch',
      },
      {
        title: 'BytePlus capability post',
        name: 'BytePlus',
        handle: '@BytePlusGlobal',
        body: 'Seedream 5.0 Lite is here, with BytePlus describing it as a compact model for stronger visual creation.',
        text: 'BytePlus follow-up post describing why the Lite model is still positioned for capable image generation.',
        href: 'https://x.com/BytePlusGlobal/status/2026570532234396024',
        slot: 'x-byteplus-capabilities',
      },
      {
        title: 'Poe availability post',
        name: 'Poe',
        handle: '@poe_platform',
        body: 'Seedream 5.0 Lite is live on Poe, described as a high-fidelity image generation model with multi-step visual reasoning and precise control.',
        text: 'Poe announcement post about Seedream 5.0 Lite availability and reasoning-focused image generation.',
        href: 'https://x.com/poe_platform/status/2027234682941894815',
        slot: 'x-poe-live',
      },
      {
        title: 'Multi-Image Edit Arena ranking',
        name: 'Arena',
        handle: '@arena',
        body: 'Seedream-5.0-Lite ties for top 5 on the Multi-Image Edit Arena.',
        text: 'Benchmark-style post covering Seedream 5.0 Lite performance in multi-image editing comparisons.',
        href: 'https://x.com/arena/status/2026822344216650161',
        slot: 'x-arena-ranking',
      },
      {
        title: 'fal day-zero launch',
        name: 'fal',
        handle: '@fal',
        body: 'Seedream 5.0 Lite is here on fal at day 0, described as unified multimodal image generation with deep thinking and built-in online search.',
        text: 'fal launch post for Seedream 5.0 Lite, emphasizing deep thinking and built-in online search.',
        href: 'https://x.com/fal/status/2026256585757008160',
        slot: 'x-fal-launch',
      },
    ],
  },
  image: {
    container: 'Image placeholder',
  },
  faq: {
    title: 'Seedream 5.0 Lite FAQ',
    items: [
      {
        q: 'What is Seedream 5.0 Lite?',
        a:
          'Seedream 5.0 Lite is a ByteDance Seed AI image generation model focused on stronger understanding, reasoning, online search grounding, multimodal image tasks, and professional visual creation.',
      },
      {
        q: 'Is Seedream 5.0 Lite available on Toolaze?',
        a:
          'Toolaze provides a Seedream 5.0 Lite model guide and lets users prepare prompts for available Seed image generation workflows.',
      },
      {
        q: 'How is Seedream 5.0 Lite different from Seedream 4.5?',
        a:
          'Seedream 5.0 Lite is positioned around deeper reasoning and online search grounding. Seedream 4.5 is already supported in Toolaze for high-quality Seed image generation, 4K-oriented output, typography-rich visuals, and reference-guided edits.',
      },
      {
        q: 'What prompts work best with Seedream 5.0 Lite?',
        a:
          'Use structured prompts that define the asset type, subject, reference role, composition, visible text, factual context, style constraints, and final use case. The model is more useful when the task needs reasoning, not just a short style phrase.',
      },
    ],
  },
  cta: {
    title: 'Explore Seedream 5.0 Lite on Toolaze',
    text:
      'Prepare reasoning-driven image prompts, compare Seedream 5.0 Lite with current Toolaze image models, and start creating through available Seed image workflows.',
    button: 'Start from the generator',
    label: 'Seedream 5.0 Lite final call to action',
  },
}

const localeOverrides: Partial<Record<Seedream50LiteLocale, DeepPartial<Seedream50LiteLandingCopy>>> = {
  de: {
    metadata: {
      title: 'Seedream 5.0 Lite KI-Bildgenerator | Toolaze',
      description:
        'Entdecken Sie Seedream 5.0 Lite auf Toolaze: ByteDance Seed Bildgenerierung mit Deep Thinking, Online-Suche, referenzbewusster Bearbeitung und professionellen visuellen Workflows.',
      openGraphDescription: en.metadata.openGraphDescription,
      twitterDescription: en.metadata.twitterDescription,
    },
    breadcrumbs: { ...en.breadcrumbs, current: 'Seedream 5.0 Lite' },
  },
  ja: {
    metadata: {
      title: 'Seedream 5.0 Lite AI画像生成 | Toolaze',
      description:
        'ToolazeでSeedream 5.0 Liteを探索。ByteDance Seedの画像生成モデルで、深い思考、オンライン検索に基づく視覚生成、参照画像編集、プロ向けデザインワークフローを理解できます。',
      openGraphDescription: en.metadata.openGraphDescription,
      twitterDescription: en.metadata.twitterDescription,
    },
    breadcrumbs: { ...en.breadcrumbs, home: 'ホーム', model: 'モデル', current: 'Seedream 5.0 Lite' },
  },
  es: {
    metadata: {
      title: 'Generador de imágenes AI Seedream 5.0 Lite | Toolaze',
      description:
        'Explora Seedream 5.0 Lite en Toolaze: generación de imágenes de ByteDance Seed con razonamiento profundo, búsqueda online, edición con referencias y flujos visuales profesionales.',
      openGraphDescription: en.metadata.openGraphDescription,
      twitterDescription: en.metadata.twitterDescription,
    },
    breadcrumbs: { ...en.breadcrumbs, home: 'Inicio', model: 'Modelo', current: 'Seedream 5.0 Lite' },
  },
  'zh-TW': {
    metadata: {
      title: 'Seedream 5.0 Lite AI 圖像生成器 | Toolaze',
      description:
        '在 Toolaze 探索 Seedream 5.0 Lite：ByteDance Seed 圖像生成模型，具備深度思考、線上搜尋輔助、參考導向編輯與專業視覺設計工作流程。',
      openGraphDescription: en.metadata.openGraphDescription,
      twitterDescription: en.metadata.twitterDescription,
    },
    breadcrumbs: { ...en.breadcrumbs, home: '首頁', model: '模型', current: 'Seedream 5.0 Lite' },
  },
  pt: {
    metadata: {
      title: 'Gerador de imagens AI Seedream 5.0 Lite | Toolaze',
      description:
        'Explore o Seedream 5.0 Lite no Toolaze: geração de imagens da ByteDance Seed com raciocínio profundo, busca online, edição por referência e fluxos visuais profissionais.',
      openGraphDescription: en.metadata.openGraphDescription,
      twitterDescription: en.metadata.twitterDescription,
    },
  },
  fr: {
    metadata: {
      title: 'Générateur d’images AI Seedream 5.0 Lite | Toolaze',
      description:
        'Explorez Seedream 5.0 Lite sur Toolaze : génération d’images ByteDance Seed avec raisonnement, recherche en ligne, édition guidée par référence et workflows visuels professionnels.',
      openGraphDescription: en.metadata.openGraphDescription,
      twitterDescription: en.metadata.twitterDescription,
    },
  },
  ko: {
    metadata: {
      title: 'Seedream 5.0 Lite AI 이미지 생성기 | Toolaze',
      description:
        'Toolaze에서 Seedream 5.0 Lite를 살펴보세요. ByteDance Seed 이미지 생성 모델로 깊은 사고, 온라인 검색 기반 시각 생성, 참조 기반 편집, 전문 디자인 워크플로를 이해할 수 있습니다.',
      openGraphDescription: en.metadata.openGraphDescription,
      twitterDescription: en.metadata.twitterDescription,
    },
  },
  it: {
    metadata: {
      title: 'Generatore di immagini AI Seedream 5.0 Lite | Toolaze',
      description:
        'Esplora Seedream 5.0 Lite su Toolaze: generazione immagini ByteDance Seed con ragionamento profondo, ricerca online, editing guidato da riferimenti e workflow visivi professionali.',
      openGraphDescription: en.metadata.openGraphDescription,
      twitterDescription: en.metadata.twitterDescription,
    },
  },
}

const localizedContentOverrides: Partial<Record<Seedream50LiteLocale, DeepPartial<Seedream50LiteLandingCopy>>> = {
  de: {
    schema: {
      pageName: 'Seedream 5.0 Lite KI-Bildgenerator',
      appName: 'Seedream 5.0 Lite auf Toolaze',
      howToName: 'So verwenden Sie Seedream 5.0 Lite auf Toolaze',
    },
    hero: {
      modelName: 'Seedream 5.0 Lite',
      suffix: 'KI-Bildgenerator',
      description:
        'Entdecken Sie Seedream 5.0 Lite, das ByteDance Seed Bildmodell für reasoning-starke Prompts, online gestützte Bildideen, referenzbewusste Bearbeitung und professionelle Design-Workflows.',
      availability:
        'Toolaze zeigt Seedream 5.0 Lite derzeit als Modellguide. Bis der dedizierte 5.0 Lite Zugang abgeschlossen ist, läuft die Erstellung über verfügbare Seed Bild-Workflows.',
    },
    whatIs: {
      title: 'Was ist Seedream 5.0 Lite?',
      paragraphs: [
        'Seedream 5.0 Lite ist ein ByteDance Seed Bildmodell, das offiziell als vereinheitlichtes multimodales Bildmodell beschrieben wird.',
        'Es eignet sich für Aufgaben, bei denen Prompts Layout, Referenzen, Text, Kontext und Verwendungszweck klar beschreiben müssen.',
        'Auf Toolaze hilft diese Seite beim Vergleichen von Modellen und beim Vorbereiten von Prompts für verfügbare Seed Bild-Workflows.',
      ],
    },
    features: {
      title: 'Wichtige Funktionen von Seedream 5.0 Lite',
      text: 'Nutzen Sie Seedream 5.0 Lite, wenn eine Bildaufgabe Reasoning, Referenzen, Kontext und kontrollierte Komposition braucht.',
      items: [
        { title: 'Deep Thinking für komplexe Prompts', text: 'Hilft bei mehreren Vorgaben wie Motivplatzierung, Layout-Hierarchie, Stilregeln und Szenenbeziehungen.' },
        { title: 'Online-Suche als visueller Kontext', text: 'Nützlich für aktuelle Kontexte, regionale Details, Kategorieverständnis und reichere visuelle Richtungen.' },
        { title: 'Referenzbewusste Bearbeitung', text: 'Geeignet, wenn hochgeladene Bilder, Stile oder bestehende Kompositionen das Ergebnis führen sollen.' },
        { title: 'Professionelle Layouts', text: 'Für Poster, Infokarten, Marken-Mockups, Produktbilder und Social Visuals mit klarer Struktur.' },
      ],
    },
    gallery: {
      title: 'Seedream 5.0 Lite Anwendungsrichtungen',
      text: 'Diese Beispiele folgen den offiziellen Schwerpunkten: Reasoning, Suchkontext, Layouts, Referenzen und kreative Exploration.',
      examples: [
        { title: 'Suchgestütztes Produktkonzept', text: 'Erstellen Sie ein Launch-Bild mit regionalen Details, aktueller Designsprache und klarer Produkt-Hierarchie.' },
        { title: 'Referenzgeführte Posterbearbeitung', text: 'Bewahren Sie Produkt und Farbwelt, verbessern Sie aber Hierarchie, Licht, Titel und CTA.' },
        { title: 'Reasoning-Infografik', text: 'Gestalten Sie eine Informationsgrafik, in der jedes Element ein klares Konzept erklärt.' },
        { title: 'Charakter- und Stilkontinuität', text: 'Halten Sie Figur, Outfit oder Marke stabil und ändern Sie Hintergrund, Stimmung oder Format.' },
      ],
    },
    comparison: {
      title: 'Seedream 5.0 Lite im Modellvergleich',
      text: 'Wählen Sie nach Aufgabe. Seedream 5.0 Lite ist besonders interessant, wenn Reasoning und Online-Kontext wichtig sind.',
      capabilityHeader: 'Funktion',
    },
    howTo: {
      title: 'So verwenden Sie Seedream 5.0 Lite auf Toolaze',
      steps: [
        'Öffnen Sie die Seedream 5.0 Lite Seite und starten Sie im Generatorbereich.',
        'Beschreiben Sie Ausgabetyp, Motiv, Layout, Referenzrolle, Licht, Seitenverhältnis und Textanforderungen.',
        'Laden Sie Referenzen hoch, wenn Produkt, Person, Design oder Stil erhalten bleiben soll.',
        'Nutzen Sie verfügbare Seed Bild-Workflows, während dedizierter 5.0 Lite Zugang finalisiert wird.',
        'Prüfen Sie Text, Fakten und markenkritische Details vor der Veröffentlichung.',
      ],
    },
    prompts: {
      title: 'Seedream 5.0 Lite Prompt-Beispiele',
      text: 'Startpunkte für reasoning-starke, suchbewusste und referenzgeführte Bildaufgaben.',
      copyButton: 'Prompt kopieren',
      copiedButton: 'Kopiert',
      examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Suchgestütztes Kampagnen-Key-Visual', 'Referenzbasiertes Produkt-Redesign', 'Reasoning-Infografik'][index] || item.title })),
    },
    related: {
      title: 'Verwandte KI-Bildmodelle',
      tryNow: 'Jetzt testen',
      links: [
        { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Nutzen Sie den aktuellen Seed Workflow für 4K Produktbilder, Poster und Referenzbearbeitung.' },
        { title: 'GPT Image 2', href: '/model/gpt-image-2', text: 'Erstellen Sie strukturierte Bilder, Mockups, Textgrafiken und Bearbeitungen.' },
        { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Testen Sie Thinking Mode, Multi-Reference und strukturierte Posterlayouts.' },
      ],
    },
    faq: {
      title: 'Seedream 5.0 Lite FAQ',
      items: [
        { q: 'Was ist Seedream 5.0 Lite?', a: 'Seedream 5.0 Lite ist ein ByteDance Seed KI-Bildmodell mit Fokus auf Verständnis, Reasoning, Online-Kontext, multimodale Bildaufgaben und professionelle Visuals.' },
        { q: 'Ist Seedream 5.0 Lite auf Toolaze verfügbar?', a: 'Toolaze bietet einen Modellguide und verfügbare Seed Bild-Workflows. Dedizierte 5.0 Lite Generierung kann je nach Modellzugang und Einstellungen variieren.' },
        { q: 'Was ist anders als bei Seedream 4.5?', a: 'Seedream 5.0 Lite betont tieferes Reasoning und Online-Kontext. Seedream 4.5 ist auf Toolaze bereits für Seed Bildgenerierung, 4K-orientierte Ausgabe, Typografie und Referenzbearbeitung verfügbar.' },
        { q: 'Welche Prompts funktionieren gut?', a: 'Gute Prompts nennen Asset-Typ, Motiv, Referenzrolle, Komposition, sichtbaren Text, Kontext, Stilgrenzen und den finalen Einsatz.' },
      ],
    },
    cta: {
      title: 'Seedream 5.0 Lite auf Toolaze entdecken',
      text: 'Bereiten Sie reasoning-starke Bildprompts vor, vergleichen Sie Modelle und starten Sie mit verfügbaren Seed Bild-Workflows.',
      button: 'Zum Generator',
      label: 'Seedream 5.0 Lite CTA',
    },
  },
  es: {
    schema: {
      pageName: 'Generador de imágenes AI Seedream 5.0 Lite',
      appName: 'Seedream 5.0 Lite en Toolaze',
      howToName: 'Cómo usar Seedream 5.0 Lite en Toolaze',
    },
    hero: {
      modelName: 'Seedream 5.0 Lite',
      suffix: 'Generador de imágenes AI',
      description:
        'Explora Seedream 5.0 Lite, el modelo de imagen de ByteDance Seed para prompts con razonamiento, contexto de búsqueda online, edición con referencias y flujos visuales profesionales.',
      availability:
        'Toolaze muestra Seedream 5.0 Lite como guía de modelo y enruta la generación mediante flujos Seed disponibles mientras se finaliza el acceso dedicado.',
    },
    whatIs: {
      title: '¿Qué es Seedream 5.0 Lite?',
      paragraphs: [
        'Seedream 5.0 Lite es un modelo de imagen de ByteDance Seed presentado como un modelo multimodal unificado.',
        'Sirve para prompts que definen composición, referencias, texto, contexto y uso final, no solo estilo visual.',
        'En Toolaze, esta página ayuda a comparar modelos y preparar prompts para los flujos de imagen Seed disponibles.',
      ],
    },
    features: {
      title: 'Funciones principales de Seedream 5.0 Lite',
      text: 'Úsalo cuando la tarea requiera razonamiento, referencias, contexto factual y composición controlada.',
      items: [
        { title: 'Razonamiento para prompts complejos', text: 'Ayuda con ubicación del sujeto, jerarquía, reglas de estilo y relaciones dentro de la escena.' },
        { title: 'Dirección visual con búsqueda online', text: 'Útil para contexto actual, detalles regionales, categorías reconocibles y referencias visuales más ricas.' },
        { title: 'Edición consciente de referencias', text: 'Pensado para que imágenes subidas, estilos o composiciones existentes guíen el resultado.' },
        { title: 'Diseños profesionales', text: 'Para pósters, tarjetas informativas, mockups de marca, escenas de producto y gráficos sociales estructurados.' },
      ],
    },
    gallery: {
      title: 'Direcciones de uso para Seedream 5.0 Lite',
      text: 'Ejemplos alineados con razonamiento, búsqueda, layouts, edición con referencias y exploración creativa.',
      examples: [
        { title: 'Concepto de producto con búsqueda', text: 'Crea una imagen de lanzamiento con señales regionales, lenguaje visual actual y jerarquía de producto clara.' },
        { title: 'Edición de póster con referencia', text: 'Conserva producto y paleta, mejorando jerarquía, luz, título y llamada a la acción.' },
        { title: 'Infografía razonada', text: 'Diseña un gráfico donde cada elemento visual explique una idea concreta.' },
        { title: 'Continuidad de personaje y estilo', text: 'Mantén personaje, ropa o marca mientras cambias fondo, tono, ángulo o formato.' },
      ],
    },
    comparison: {
      title: 'Seedream 5.0 Lite frente a otros modelos',
      text: 'Elige según la tarea. Seedream 5.0 Lite destaca cuando importan el razonamiento y el contexto online.',
      capabilityHeader: 'Capacidad',
    },
    howTo: {
      title: 'Cómo usar Seedream 5.0 Lite en Toolaze',
      steps: [
        'Abre la página de Seedream 5.0 Lite y empieza desde el generador funcional.',
        'Escribe un prompt con tipo de salida, sujeto, layout, rol de referencias, luz, proporción y texto.',
        'Sube referencias cuando quieras preservar producto, persona, diseño o estilo.',
        'Usa los flujos Seed disponibles mientras se finaliza el acceso dedicado.',
        'Revisa texto, detalles factuales y elementos críticos de marca antes de publicar.',
      ],
    },
    prompts: {
      title: 'Ejemplos de prompts para Seedream 5.0 Lite',
      text: 'Puntos de partida para tareas con razonamiento, búsqueda y referencias.',
      copyButton: 'Copiar prompt',
      copiedButton: 'Copiado',
      examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Visual de campaña con búsqueda', 'Rediseño de producto con referencia', 'Infografía razonada'][index] || item.title })),
    },
    related: {
      title: 'Modelos de imagen AI relacionados',
      tryNow: 'Probar ahora',
      links: [
        { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Usa el flujo Seed actual para productos 4K, pósters y edición con referencias.' },
        { title: 'GPT Image 2', href: '/model/gpt-image-2', text: 'Crea imágenes estructuradas, mockups, gráficos con texto y ediciones.' },
        { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Prueba thinking mode, múltiples referencias y layouts de póster.' },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes sobre Seedream 5.0 Lite',
      items: [
        { q: '¿Qué es Seedream 5.0 Lite?', a: 'Es un modelo de imagen AI de ByteDance Seed centrado en comprensión, razonamiento, búsqueda online, tareas multimodales y creación visual profesional.' },
        { q: '¿Está disponible en Toolaze?', a: 'Toolaze ofrece una guía del modelo y ayuda a preparar prompts para los flujos Seed disponibles.' },
        { q: '¿En qué se diferencia de Seedream 4.5?', a: 'Seedream 5.0 Lite enfatiza razonamiento y búsqueda online. Seedream 4.5 ya está disponible en Toolaze para generación Seed, salida orientada a 4K, tipografía y referencias.' },
        { q: '¿Qué prompts funcionan mejor?', a: 'Define tipo de activo, sujeto, rol de referencia, composición, texto visible, contexto, estilo y uso final.' },
      ],
    },
    cta: {
      title: 'Explora Seedream 5.0 Lite en Toolaze',
      text: 'Prepara prompts con razonamiento, compara modelos y empieza con los flujos Seed disponibles.',
      button: 'Ir al generador',
      label: 'CTA final de Seedream 5.0 Lite',
    },
  },
  ja: {
    schema: {
      pageName: 'Seedream 5.0 Lite AI画像生成',
      appName: 'Toolaze の Seedream 5.0 Lite',
      howToName: 'Toolaze で Seedream 5.0 Lite を使う方法',
    },
    hero: {
      modelName: 'Seedream 5.0 Lite',
      suffix: 'AI画像生成',
      description:
        'Seedream 5.0 Lite は、推論を必要とするプロンプト、オンライン検索に基づく視覚表現、参照画像を意識した編集、完成度の高いデザインワークフローに向いた ByteDance Seed の画像モデルです。',
      availability:
        'Toolaze では現在、Seedream 5.0 Lite をモデルガイドとして提供し、専用アクセスの準備中は利用可能な Seed 画像ワークフローで生成を開始できます。',
    },
    whatIs: {
      title: 'Seedream 5.0 Liteとは？',
      paragraphs: [
        'Seedream 5.0 Lite は、ByteDance Seed が発表した統合マルチモーダル画像モデルです。公式情報では、より強い理解力、深い思考、オンライン検索に基づく文脈、そしてクリエイティブや業務用途での画質向上が強調されています。',
        '単なるスタイル指定だけでなく、レイアウト、参照画像、文字、構図、用途まで整理したプロンプトに向いています。ポスター、ブランド素材、商品画像、説明用ビジュアル、編集ワークフローに活用できます。',
        'このページでは、Seedream 5.0 Lite の特徴を整理し、Toolaze で使える Seed 画像ワークフローに向けたプロンプト作成を支援します。',
      ],
    },
    features: {
      title: 'Seedream 5.0 Liteの主な特徴',
      text: '推論、参照理解、事実に基づく文脈、制御された構図が必要な画像タスクに向いています。',
      items: [
        { title: '複雑な画像プロンプトの深い思考', text: '複数の条件、被写体の配置、階層、スタイル規則、シーン内の関係を整理したプロンプトで力を発揮します。' },
        { title: 'オンライン検索に基づく視覚方向', text: '現在の文脈、地域性、カテゴリ理解、より豊かな視覚参照が必要な画像コンセプトに役立ちます。' },
        { title: '参照画像を意識した編集と一貫性', text: 'アップロード画像、スタイル参照、既存レイアウトを結果に反映したいマルチモーダル画像タスクに向いています。' },
        { title: 'プロ向けレイアウトと文字中心のデザイン', text: 'キャンペーンポスター、情報カード、ブランドモックアップ、商品シーン、SNS画像など構造が重要な制作に使えます。' },
      ],
    },
    gallery: {
      title: 'Seedream 5.0 Liteの活用例',
      text: '推論、検索文脈、レイアウト、参照編集、クリエイティブ探索を想定した方向性です。',
      examples: [
        { title: '検索文脈を使う商品コンセプト', text: '地域の視覚要素、現在のデザイン感、素材の質感、明確な商品階層を含むローンチ画像を作成します。' },
        { title: '参照ポスターの改善', text: '元ポスターの中心商品とブランドカラーを保ちながら、階層、光、タイトル位置、CTAを整えます。' },
        { title: '推論型インフォグラフィック', text: '各要素が概念に対応するように、読みやすいラベルと余白を持つ情報図を作ります。' },
        { title: 'キャラクターとスタイルの継続性', text: '参照画像を使い、人物、衣装、ブランド要素を保ちながら背景や構図を変えます。' },
      ],
    },
    comparison: {
      title: 'Seedream 5.0 Lite と他の画像モデルの比較',
      text: 'タスクに合わせてモデルを選びます。Seedream 5.0 Lite は、推論とオンライン検索文脈が重要な場合に特に注目できます。',
      capabilityHeader: '機能',
    },
    howTo: {
      title: 'ToolazeでSeedream 5.0 Liteを使う方法',
      steps: [
        'Seedream 5.0 Lite ページを開き、ページ上部の生成エリアから開始します。',
        '出力タイプ、被写体、レイアウト、参照画像の役割、照明、比率、文字要件を含めてプロンプトを書きます。',
        '商品、人物、デザイン、スタイルを保ちたい場合は参照画像をアップロードします。',
        '専用アクセスの準備中は、Toolaze で利用可能な Seed 画像ワークフローから生成します。',
        '公開前に文字、事実関係、ブランド上重要な要素を確認します。',
      ],
    },
    prompts: {
      title: 'Seedream 5.0 Liteプロンプト例',
      text: '推論、検索文脈、参照画像を活かす画像生成タスクの出発点として使えます。',
      copyButton: 'プロンプトをコピー',
      copiedButton: 'コピー済み',
      examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['検索文脈を使うキャンペーンKV', '参照商品リデザイン', '推論型情報グラフィック'][index] || item.title })),
    },
    related: {
      title: '関連するAI画像モデル',
      tryNow: '今すぐ試す',
      links: [
        { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: '4K商品画像、文字組みポスター、参照編集に対応した現在の Seed 画像ワークフローを使います。' },
        { title: 'GPT Image 2', href: '/model/gpt-image-2', text: '構造化画像、モックアップ、文字中心のグラフィック、編集画像を作成します。' },
        { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'thinking mode、複数参照、構造化ポスターレイアウトを試せます。' },
      ],
    },
    faq: {
      title: 'Seedream 5.0 Lite FAQ',
      items: [
        { q: 'Seedream 5.0 Liteとは何ですか？', a: 'Seedream 5.0 Lite は、理解力、推論、オンライン検索文脈、マルチモーダル画像タスク、プロ向け視覚制作に重点を置いた ByteDance Seed のAI画像モデルです。' },
        { q: 'Seedream 5.0 LiteはToolazeで使えますか？', a: 'Toolaze は Seedream 5.0 Lite のモデルガイドを提供し、利用可能な Seed 画像生成ワークフロー向けのプロンプト作成を支援します。' },
        { q: 'Seedream 4.5との違いは？', a: 'Seedream 5.0 Lite は深い推論とオンライン検索文脈が特徴です。Seedream 4.5 は Toolaze で高品質な Seed 画像生成、4K向け出力、文字中心デザイン、参照編集に対応しています。' },
        { q: 'どんなプロンプトが向いていますか？', a: 'アセット種別、被写体、参照画像の役割、構図、表示文字、事実文脈、スタイル制約、最終用途を具体的に書くと効果的です。' },
      ],
    },
    cta: {
      title: 'ToolazeでSeedream 5.0 Liteを探索',
      text: '推論重視の画像プロンプトを準備し、現在の Toolaze 画像モデルと比較しながら、利用可能な Seed 画像ワークフローで作成を始めましょう。',
      button: '生成エリアへ移動',
      label: 'Seedream 5.0 Lite 最終CTA',
    },
  },
  pt: {
    schema: { pageName: 'Gerador de imagens AI Seedream 5.0 Lite', appName: 'Seedream 5.0 Lite no Toolaze', howToName: 'Como usar Seedream 5.0 Lite no Toolaze' },
    hero: { modelName: 'Seedream 5.0 Lite', suffix: 'Gerador de imagens AI', description: 'Explore o Seedream 5.0 Lite, modelo de imagem da ByteDance Seed para prompts com raciocínio, contexto de busca online, edição por referência e fluxos visuais profissionais.', availability: 'O Toolaze mostra o Seedream 5.0 Lite como guia de modelo e usa fluxos Seed disponíveis enquanto o acesso dedicado é finalizado.' },
    whatIs: { title: 'O que é Seedream 5.0 Lite?', paragraphs: ['Seedream 5.0 Lite é um modelo de imagem da ByteDance Seed apresentado como um modelo multimodal unificado.', 'Ele é útil quando o prompt precisa definir layout, referências, texto, contexto e uso final.', 'No Toolaze, esta página ajuda a comparar modelos e preparar prompts para fluxos Seed disponíveis.'] },
    features: { title: 'Principais recursos do Seedream 5.0 Lite', text: 'Use quando a tarefa exigir raciocínio, referências, contexto factual e composição controlada.', items: [{ title: 'Raciocínio para prompts complexos', text: 'Ajuda com posição do assunto, hierarquia visual, regras de estilo e relações da cena.' }, { title: 'Direção visual com busca online', text: 'Útil para contexto atual, detalhes regionais e referências visuais mais ricas.' }, { title: 'Edição consciente de referências', text: 'Projetado para usar imagens enviadas, estilos e composições existentes como guia.' }, { title: 'Layouts profissionais', text: 'Para pôsteres, cartões informativos, mockups de marca, produtos e imagens sociais estruturadas.' }] },
    gallery: { title: 'Direções de uso do Seedream 5.0 Lite', text: 'Exemplos para raciocínio, busca, layouts, edição com referências e exploração criativa.', examples: [{ title: 'Conceito de produto com busca', text: 'Crie uma imagem de lançamento com sinais regionais, design atual e hierarquia clara.' }, { title: 'Edição de pôster por referência', text: 'Preserve produto e paleta, melhorando hierarquia, luz, título e chamada.' }, { title: 'Infográfico com raciocínio', text: 'Crie um gráfico em que cada elemento visual explique uma ideia.' }, { title: 'Continuidade de personagem e estilo', text: 'Mantenha personagem, roupa ou marca enquanto muda fundo, clima ou formato.' }] },
    comparison: { title: 'Seedream 5.0 Lite em comparação', text: 'Escolha pelo trabalho. Seedream 5.0 Lite se destaca quando raciocínio e contexto online importam.', capabilityHeader: 'Capacidade' },
    howTo: { title: 'Como usar Seedream 5.0 Lite no Toolaze', steps: ['Abra a página Seedream 5.0 Lite e comece pelo gerador.', 'Escreva um prompt com tipo de saída, assunto, layout, referência, luz, proporção e texto.', 'Envie referências quando quiser preservar produto, pessoa, design ou estilo.', 'Use os fluxos Seed disponíveis enquanto o acesso dedicado é finalizado.', 'Revise texto, fatos e elementos de marca antes de publicar.'] },
    prompts: { title: 'Exemplos de prompts para Seedream 5.0 Lite', text: 'Pontos de partida para tarefas com raciocínio, busca e referência.', copyButton: 'Copiar prompt', copiedButton: 'Copiado', examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Visual de campanha com busca', 'Redesign de produto com referência', 'Infográfico com raciocínio'][index] || item.title })) },
    related: { title: 'Modelos AI relacionados', tryNow: 'Testar agora', links: [{ title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Use o fluxo Seed atual para produtos 4K, pôsteres e edição com referências.' }, { title: 'GPT Image 2', href: '/model/gpt-image-2', text: 'Crie imagens estruturadas, mockups, gráficos com texto e edições.' }, { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Teste thinking mode, múltiplas referências e layouts de pôster.' }] },
    faq: { title: 'FAQ do Seedream 5.0 Lite', items: [{ q: 'O que é Seedream 5.0 Lite?', a: 'É um modelo de imagem AI da ByteDance Seed focado em compreensão, raciocínio, busca online, tarefas multimodais e criação visual profissional.' }, { q: 'Está disponível no Toolaze?', a: 'O Toolaze oferece guia do modelo e ajuda a preparar prompts para fluxos Seed disponíveis.' }, { q: 'Qual a diferença para Seedream 4.5?', a: 'Seedream 5.0 Lite enfatiza raciocínio e contexto online. Seedream 4.5 já está disponível no Toolaze para geração Seed, saída 4K, tipografia e referências.' }, { q: 'Quais prompts funcionam melhor?', a: 'Defina tipo de ativo, assunto, referência, composição, texto visível, contexto, estilo e uso final.' }] },
    cta: { title: 'Explore Seedream 5.0 Lite no Toolaze', text: 'Prepare prompts com raciocínio, compare modelos e comece com fluxos Seed disponíveis.', button: 'Ir para o gerador', label: 'CTA final Seedream 5.0 Lite' },
  },
  'zh-TW': {
    schema: {
      pageName: 'Seedream 5.0 Lite AI 圖像生成器',
      appName: 'Toolaze 上的 Seedream 5.0 Lite',
      howToName: '如何在 Toolaze 使用 Seedream 5.0 Lite',
    },
    hero: {
      modelName: 'Seedream 5.0 Lite',
      suffix: 'AI 圖像生成器',
      description:
        '探索 Seedream 5.0 Lite。這是 ByteDance Seed 面向推理型提示詞、線上搜尋輔助視覺、參考導向編輯與專業圖像設計流程的圖像模型。',
      availability:
        'Toolaze 目前將 Seedream 5.0 Lite 作為模型指南呈現；專用 5.0 Lite 生成接入完成前，可透過現有 Seed 圖像工作流程開始創作。',
    },
    whatIs: {
      title: '什麼是 Seedream 5.0 Lite？',
      paragraphs: [
        'Seedream 5.0 Lite 是 ByteDance Seed 發表的統一多模態圖像模型。官方資料強調更強的理解能力、深度思考、線上搜尋輔助，以及在創意與專業任務中的圖像品質提升。',
        '它適合需要明確排版、參考圖、文字、構圖與用途的提示詞，而不只是單純指定風格。可用於海報、品牌素材、商品圖、說明型視覺與參考編輯工作流程。',
        '在 Toolaze，這個頁面協助你理解 Seedream 5.0 Lite、比較目前的圖像模型，並準備適合 Seed 圖像工作流程的提示詞。',
      ],
    },
    features: {
      title: 'Seedream 5.0 Lite 的主要特色',
      text: '當圖像任務需要推理、參考理解、事實脈絡與可控構圖時，Seedream 5.0 Lite 會更有價值。',
      items: [
        { title: '複雜圖像提示詞的深度思考', text: '適合包含多個限制、主體位置、版面層級、風格規則與場景關係的提示詞。' },
        { title: '線上搜尋輔助的視覺方向', text: '當圖像概念需要當前脈絡、地域細節、類別理解或更豐富的視覺參考時很有用。' },
        { title: '參考導向編輯與視覺一致性', text: '適合希望上傳圖片、風格參考或既有構圖能真正影響輸出的多模態圖像任務。' },
        { title: '專業排版與文字主導設計', text: '可用於活動海報、資訊卡、品牌 mockup、商品場景與社群圖像等重視結構的素材。' },
      ],
    },
    gallery: {
      title: 'Seedream 5.0 Lite 使用方向',
      text: '這些方向對應官方強調的推理、搜尋脈絡、設計排版、參考編輯與創意探索。',
      examples: [
        { title: '搜尋脈絡商品概念', text: '建立含有地域視覺線索、當代設計語言、準確材質細節與清晰商品主體的上市圖。' },
        { title: '參考導向海報編輯', text: '保留草稿海報的核心商品與品牌色，改善階層、光線、標題位置與 CTA 清晰度。' },
        { title: '推理型資訊圖', text: '讓每個視覺元素都對應明確概念，並保持標籤可讀與版面平衡。' },
        { title: '角色與風格延續', text: '使用參考圖保持角色、服裝或品牌元素一致，同時改變背景、情緒、角度或格式。' },
      ],
    },
    comparison: {
      title: 'Seedream 5.0 Lite 與其他圖像模型比較',
      text: '依照任務選模型。Seedream 5.0 Lite 的亮點在需要推理與線上搜尋脈絡的圖像任務。',
      capabilityHeader: '能力',
    },
    howTo: {
      title: '如何在 Toolaze 使用 Seedream 5.0 Lite',
      steps: [
        '開啟 Seedream 5.0 Lite 模型頁，從頁面上方的功能生成區開始。',
        '寫出包含輸出類型、主體、排版、參考角色、光線、比例與文字要求的結構化提示詞。',
        '如果結果需要保留商品、人物、設計或視覺風格，請上傳參考圖。',
        '在專用 Seedream 5.0 Lite 接入完成前，使用 Toolaze 目前可用的 Seed 圖像工作流程生成草稿。',
        '發布前檢查文字、事實細節與品牌關鍵元素。',
      ],
    },
    prompts: {
      title: 'Seedream 5.0 Lite 提示詞範例',
      text: '這些提示詞可作為推理型、搜尋輔助與參考導向圖像任務的起點。',
      copyButton: '複製提示詞',
      copiedButton: '已複製',
      examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['搜尋脈絡活動主視覺', '參考商品重新設計', '推理型資訊圖'][index] || item.title })),
    },
    related: {
      title: '探索相關 AI 圖像模型',
      tryNow: '立即試用',
      links: [
        { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: '使用目前 Toolaze Seed 圖像工作流程，創作 4K 商品視覺、排版海報與參考編輯。' },
        { title: 'GPT Image 2', href: '/model/gpt-image-2', text: '建立結構化圖像、mockup、文字主導圖形與編輯視覺。' },
        { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: '嘗試 thinking mode、多參考生成與結構化海報排版。' },
      ],
    },
    faq: {
      title: 'Seedream 5.0 Lite 常見問題',
      items: [
        { q: 'Seedream 5.0 Lite 是什麼？', a: 'Seedream 5.0 Lite 是 ByteDance Seed 的 AI 圖像生成模型，重點在更強理解、推理、線上搜尋輔助、多模態圖像任務與專業視覺創作。' },
        { q: 'Toolaze 可以使用 Seedream 5.0 Lite 嗎？', a: 'Toolaze 提供 Seedream 5.0 Lite 模型指南，並協助你為現有 Seed 圖像生成工作流程準備提示詞。' },
        { q: '它和 Seedream 4.5 有什麼不同？', a: 'Seedream 5.0 Lite 更強調深度推理與線上搜尋脈絡。Seedream 4.5 已在 Toolaze 支援高品質 Seed 圖像生成、4K 導向輸出、文字設計與參考編輯。' },
        { q: '什麼提示詞最適合？', a: '請明確描述素材類型、主體、參考角色、構圖、可見文字、事實脈絡、風格限制與最終用途。' },
      ],
    },
    cta: {
      title: '在 Toolaze 探索 Seedream 5.0 Lite',
      text: '準備推理型圖像提示詞，與目前 Toolaze 圖像模型比較，並透過可用的 Seed 圖像工作流程開始創作。',
      button: '前往生成區',
      label: 'Seedream 5.0 Lite 最終行動呼籲',
    },
  },
  fr: {
    schema: { pageName: 'Générateur d’images AI Seedream 5.0 Lite', appName: 'Seedream 5.0 Lite sur Toolaze', howToName: 'Comment utiliser Seedream 5.0 Lite sur Toolaze' },
    hero: { modelName: 'Seedream 5.0 Lite', suffix: 'Générateur d’images AI', description: 'Explorez Seedream 5.0 Lite, le modèle image de ByteDance Seed pour les prompts avec raisonnement, le contexte issu de la recherche en ligne, l’édition guidée par référence et les workflows visuels professionnels.', availability: 'Toolaze présente actuellement Seedream 5.0 Lite comme guide de modèle et lance la création via les workflows Seed disponibles pendant la finalisation de l’accès dédié.' },
    whatIs: { title: 'Qu’est-ce que Seedream 5.0 Lite ?', paragraphs: ['Seedream 5.0 Lite est un modèle d’image ByteDance Seed présenté comme un modèle multimodal unifié.', 'Il convient aux prompts qui définissent la composition, les références, le texte, le contexte et l’usage final.', 'Sur Toolaze, cette page aide à comparer les modèles et à préparer des prompts pour les workflows Seed disponibles.'] },
    features: { title: 'Fonctions clés de Seedream 5.0 Lite', text: 'Utilisez-le lorsque la tâche demande du raisonnement, des références, du contexte factuel et une composition contrôlée.', items: [{ title: 'Raisonnement pour prompts complexes', text: 'Aide à gérer la position du sujet, la hiérarchie, les règles de style et les relations dans la scène.' }, { title: 'Direction visuelle avec recherche en ligne', text: 'Utile pour le contexte récent, les détails régionaux, les catégories reconnaissables et des références plus riches.' }, { title: 'Édition guidée par référence', text: 'Pensé pour que les images importées, les styles ou les compositions existantes guident le résultat.' }, { title: 'Layouts professionnels', text: 'Pour affiches, cartes d’information, mockups de marque, visuels produit et images sociales structurées.' }] },
    gallery: { title: 'Directions d’usage Seedream 5.0 Lite', text: 'Exemples alignés avec le raisonnement, la recherche, les layouts, l’édition par référence et l’exploration créative.', examples: [{ title: 'Concept produit avec recherche', text: 'Créez une image de lancement avec indices régionaux, langage visuel actuel et hiérarchie produit claire.' }, { title: 'Édition d’affiche par référence', text: 'Conservez le produit et la palette, tout en améliorant hiérarchie, lumière, titre et appel à l’action.' }, { title: 'Infographie raisonnée', text: 'Créez un graphique où chaque élément visuel explique une idée précise.' }, { title: 'Continuité de personnage et de style', text: 'Gardez personnage, tenue ou marque tout en changeant arrière-plan, ambiance, angle ou format.' }] },
    comparison: { title: 'Seedream 5.0 Lite comparé aux autres modèles', text: 'Choisissez selon la tâche. Seedream 5.0 Lite est intéressant lorsque le raisonnement et le contexte en ligne comptent.', capabilityHeader: 'Capacité' },
    howTo: { title: 'Comment utiliser Seedream 5.0 Lite sur Toolaze', steps: ['Ouvrez la page Seedream 5.0 Lite et commencez dans le générateur.', 'Rédigez un prompt avec type de sortie, sujet, layout, rôle des références, lumière, ratio et texte.', 'Importez des références si le produit, la personne, le design ou le style doit rester stable.', 'Utilisez les workflows Seed disponibles pendant la finalisation de l’accès dédié.', 'Vérifiez le texte, les faits et les éléments de marque avant publication.'] },
    prompts: { title: 'Exemples de prompts Seedream 5.0 Lite', text: 'Points de départ pour les tâches avec raisonnement, recherche et références.', copyButton: 'Copier le prompt', copiedButton: 'Copié', examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Visuel de campagne avec recherche', 'Refonte produit avec référence', 'Infographie raisonnée'][index] || item.title })) },
    related: { title: 'Modèles AI associés', tryNow: 'Essayer', links: [{ title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Utilisez le workflow Seed actuel pour produits 4K, affiches et édition par référence.' }, { title: 'GPT Image 2', href: '/model/gpt-image-2', text: 'Créez des images structurées, mockups, visuels avec texte et éditions.' }, { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Testez thinking mode, références multiples et layouts d’affiche.' }] },
    faq: { title: 'FAQ Seedream 5.0 Lite', items: [{ q: 'Qu’est-ce que Seedream 5.0 Lite ?', a: 'C’est un modèle d’image AI de ByteDance Seed centré sur la compréhension, le raisonnement, la recherche en ligne, les tâches multimodales et la création visuelle professionnelle.' }, { q: 'Est-il disponible sur Toolaze ?', a: 'Toolaze propose un guide du modèle et aide à préparer des prompts pour les workflows Seed disponibles.' }, { q: 'Quelle différence avec Seedream 4.5 ?', a: 'Seedream 5.0 Lite met l’accent sur le raisonnement et le contexte en ligne. Seedream 4.5 est déjà disponible sur Toolaze pour la génération Seed, la sortie orientée 4K, la typographie et les références.' }, { q: 'Quels prompts fonctionnent le mieux ?', a: 'Définissez le type d’actif, le sujet, le rôle des références, la composition, le texte visible, le contexte, le style et l’usage final.' }] },
    cta: { title: 'Explorer Seedream 5.0 Lite sur Toolaze', text: 'Préparez des prompts avec raisonnement, comparez les modèles et commencez avec les workflows Seed disponibles.', button: 'Aller au générateur', label: 'CTA final Seedream 5.0 Lite' },
  },
  ko: {
    schema: { pageName: 'Seedream 5.0 Lite AI 이미지 생성기', appName: 'Toolaze의 Seedream 5.0 Lite', howToName: 'Toolaze에서 Seedream 5.0 Lite 사용하는 방법' },
    hero: { modelName: 'Seedream 5.0 Lite', suffix: 'AI 이미지 생성기', description: 'Seedream 5.0 Lite는 추론형 프롬프트, 온라인 검색 기반 시각 방향, 참조 이미지 편집, 전문 디자인 워크플로에 맞춘 ByteDance Seed 이미지 모델입니다.', availability: 'Toolaze는 현재 Seedream 5.0 Lite를 모델 가이드로 제공하며, 전용 5.0 Lite 접근이 마무리되는 동안 사용 가능한 Seed 이미지 워크플로로 생성을 시작할 수 있습니다.' },
    whatIs: { title: 'Seedream 5.0 Lite란?', paragraphs: ['Seedream 5.0 Lite는 ByteDance Seed가 통합 멀티모달 이미지 모델로 소개한 이미지 모델입니다.', '레이아웃, 참조 이미지, 텍스트, 맥락, 최종 용도를 명확히 지정해야 하는 프롬프트에 적합합니다.', 'Toolaze에서는 이 페이지를 통해 모델을 비교하고 사용 가능한 Seed 이미지 워크플로용 프롬프트를 준비할 수 있습니다.'] },
    features: { title: 'Seedream 5.0 Lite 주요 기능', text: '추론, 참조 이해, 사실 맥락, 제어된 구성이 필요한 이미지 작업에 사용하세요.', items: [{ title: '복잡한 프롬프트를 위한 깊은 사고', text: '피사체 위치, 레이아웃 계층, 스타일 규칙, 장면 관계가 많은 작업에 도움이 됩니다.' }, { title: '온라인 검색 기반 시각 방향', text: '최신 맥락, 지역 세부 정보, 카테고리 이해, 풍부한 시각 참조가 필요할 때 유용합니다.' }, { title: '참조 인식 편집', text: '업로드한 이미지, 스타일, 기존 구성이 결과에 반영되어야 하는 작업에 적합합니다.' }, { title: '전문 레이아웃', text: '포스터, 정보 카드, 브랜드 목업, 제품 장면, 구조화된 소셜 이미지에 적합합니다.' }] },
    gallery: { title: 'Seedream 5.0 Lite 활용 방향', text: '추론, 검색 맥락, 레이아웃, 참조 편집, 창의적 탐색에 맞춘 예시입니다.', examples: [{ title: '검색 기반 제품 콘셉트', text: '지역적 단서, 최신 디자인 언어, 명확한 제품 계층을 갖춘 출시 이미지를 만듭니다.' }, { title: '참조 포스터 편집', text: '제품과 색상 팔레트는 유지하고 계층, 조명, 제목, CTA를 개선합니다.' }, { title: '추론형 인포그래픽', text: '각 시각 요소가 하나의 개념을 설명하도록 정보 그래픽을 구성합니다.' }, { title: '캐릭터와 스타일 연속성', text: '캐릭터, 의상, 브랜드 요소를 유지하면서 배경, 분위기, 각도, 형식을 바꿉니다.' }] },
    comparison: { title: 'Seedream 5.0 Lite 모델 비교', text: '작업에 따라 모델을 선택하세요. Seedream 5.0 Lite는 추론과 온라인 맥락이 중요할 때 특히 유용합니다.', capabilityHeader: '기능' },
    howTo: { title: 'Toolaze에서 Seedream 5.0 Lite 사용하는 방법', steps: ['Seedream 5.0 Lite 페이지를 열고 생성 영역에서 시작합니다.', '출력 유형, 주제, 레이아웃, 참조 역할, 조명, 비율, 텍스트 요구사항을 적습니다.', '제품, 인물, 디자인, 스타일을 유지해야 하면 참조 이미지를 업로드합니다.', '전용 접근이 마무리되는 동안 사용 가능한 Seed 이미지 워크플로를 사용합니다.', '게시 전 텍스트, 사실 정보, 브랜드 핵심 요소를 확인합니다.'] },
    prompts: { title: 'Seedream 5.0 Lite 프롬프트 예시', text: '추론, 검색, 참조 기반 이미지 작업의 시작점으로 사용하세요.', copyButton: '프롬프트 복사', copiedButton: '복사됨', examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['검색 기반 캠페인 키비주얼', '참조 기반 제품 리디자인', '추론형 인포그래픽'][index] || item.title })) },
    related: { title: '관련 AI 이미지 모델', tryNow: '지금 사용', links: [{ title: 'Seedream 4.5', href: '/model/seedream-4-5', text: '현재 Seed 워크플로로 4K 제품 이미지, 포스터, 참조 편집을 만듭니다.' }, { title: 'GPT Image 2', href: '/model/gpt-image-2', text: '구조화 이미지, 목업, 텍스트 그래픽, 편집 이미지를 만듭니다.' }, { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'thinking mode, 다중 참조, 구조화 포스터 레이아웃을 시도합니다.' }] },
    faq: { title: 'Seedream 5.0 Lite FAQ', items: [{ q: 'Seedream 5.0 Lite란 무엇인가요?', a: '이해, 추론, 온라인 검색 맥락, 멀티모달 이미지 작업, 전문 시각 제작에 중점을 둔 ByteDance Seed AI 이미지 모델입니다.' }, { q: 'Toolaze에서 사용할 수 있나요?', a: 'Toolaze는 모델 가이드와 사용 가능한 Seed 워크플로를 제공합니다. 전용 생성은 접근 및 설정에 따라 달라질 수 있습니다.' }, { q: 'Seedream 4.5와 무엇이 다른가요?', a: 'Seedream 5.0 Lite는 추론과 온라인 맥락을 강조합니다. Seedream 4.5는 Toolaze에서 Seed 이미지 생성, 4K 지향 출력, 타이포그래피, 참조 편집에 사용할 수 있습니다.' }, { q: '어떤 프롬프트가 좋나요?', a: '자산 유형, 주제, 참조 역할, 구성, 보이는 텍스트, 맥락, 스타일 제한, 최종 용도를 명확히 쓰세요.' }] },
    cta: { title: 'Toolaze에서 Seedream 5.0 Lite 탐색', text: '추론형 이미지 프롬프트를 준비하고 모델을 비교한 뒤 사용 가능한 Seed 워크플로로 시작하세요.', button: '생성 영역으로 이동', label: 'Seedream 5.0 Lite 최종 CTA' },
  },
  it: {
    schema: { pageName: 'Generatore di immagini AI Seedream 5.0 Lite', appName: 'Seedream 5.0 Lite su Toolaze', howToName: 'Come usare Seedream 5.0 Lite su Toolaze' },
    hero: { modelName: 'Seedream 5.0 Lite', suffix: 'Generatore di immagini AI', description: 'Esplora Seedream 5.0 Lite, il modello immagine di ByteDance Seed per prompt con ragionamento, contesto da ricerca online, editing guidato da riferimenti e workflow visuali professionali.', availability: 'Toolaze mostra Seedream 5.0 Lite come guida modello e avvia la generazione tramite workflow Seed disponibili mentre l’accesso dedicato viene finalizzato.' },
    whatIs: { title: 'Che cos’è Seedream 5.0 Lite?', paragraphs: ['Seedream 5.0 Lite è un modello immagine ByteDance Seed presentato come modello multimodale unificato.', 'È utile quando il prompt deve definire layout, riferimenti, testo, contesto e uso finale.', 'Su Toolaze questa pagina aiuta a confrontare modelli e preparare prompt per i workflow Seed disponibili.'] },
    features: { title: 'Funzioni principali di Seedream 5.0 Lite', text: 'Usalo quando servono ragionamento, riferimenti, contesto fattuale e composizione controllata.', items: [{ title: 'Ragionamento per prompt complessi', text: 'Aiuta con posizione del soggetto, gerarchia, regole di stile e relazioni nella scena.' }, { title: 'Direzione visuale con ricerca online', text: 'Utile per contesto attuale, dettagli regionali, categorie riconoscibili e riferimenti più ricchi.' }, { title: 'Editing consapevole dei riferimenti', text: 'Pensato per far guidare il risultato da immagini caricate, stili o composizioni esistenti.' }, { title: 'Layout professionali', text: 'Per poster, schede informative, mockup di brand, scene prodotto e immagini social strutturate.' }] },
    gallery: { title: 'Direzioni d’uso per Seedream 5.0 Lite', text: 'Esempi per ragionamento, ricerca, layout, editing con riferimenti ed esplorazione creativa.', examples: [{ title: 'Concept prodotto con ricerca', text: 'Crea un’immagine di lancio con segnali regionali, design attuale e gerarchia prodotto chiara.' }, { title: 'Editing poster da riferimento', text: 'Mantieni prodotto e palette, migliorando gerarchia, luce, titolo e call to action.' }, { title: 'Infografica ragionata', text: 'Progetta un grafico in cui ogni elemento visuale spiega un concetto.' }, { title: 'Continuità di personaggio e stile', text: 'Mantieni personaggio, outfit o brand cambiando sfondo, atmosfera, angolo o formato.' }] },
    comparison: { title: 'Seedream 5.0 Lite a confronto', text: 'Scegli in base al lavoro. Seedream 5.0 Lite è interessante quando contano ragionamento e contesto online.', capabilityHeader: 'Capacità' },
    howTo: { title: 'Come usare Seedream 5.0 Lite su Toolaze', steps: ['Apri la pagina Seedream 5.0 Lite e parti dal generatore.', 'Scrivi un prompt con tipo di output, soggetto, layout, ruolo dei riferimenti, luce, rapporto e testo.', 'Carica riferimenti quando vuoi preservare prodotto, persona, design o stile.', 'Usa i workflow Seed disponibili mentre viene finalizzato l’accesso dedicato.', 'Controlla testo, fatti ed elementi di brand prima della pubblicazione.'] },
    prompts: { title: 'Esempi di prompt Seedream 5.0 Lite', text: 'Punti di partenza per attività con ragionamento, ricerca e riferimenti.', copyButton: 'Copia prompt', copiedButton: 'Copiato', examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Visual campagna con ricerca', 'Redesign prodotto da riferimento', 'Infografica ragionata'][index] || item.title })) },
    related: { title: 'Modelli AI correlati', tryNow: 'Prova ora', links: [{ title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Usa il workflow Seed attuale per prodotti 4K, poster ed editing con riferimenti.' }, { title: 'GPT Image 2', href: '/model/gpt-image-2', text: 'Crea immagini strutturate, mockup, grafiche con testo ed editing.' }, { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Prova thinking mode, riferimenti multipli e layout poster.' }] },
    faq: { title: 'FAQ Seedream 5.0 Lite', items: [{ q: 'Che cos’è Seedream 5.0 Lite?', a: 'È un modello immagine AI di ByteDance Seed focalizzato su comprensione, ragionamento, ricerca online, task multimodali e creazione visuale professionale.' }, { q: 'È disponibile su Toolaze?', a: 'Toolaze offre una guida del modello e aiuta a preparare prompt per i workflow Seed disponibili.' }, { q: 'In cosa differisce da Seedream 4.5?', a: 'Seedream 5.0 Lite enfatizza ragionamento e contesto online. Seedream 4.5 è già disponibile su Toolaze per generazione Seed, output 4K, tipografia e riferimenti.' }, { q: 'Quali prompt funzionano meglio?', a: 'Definisci tipo di asset, soggetto, ruolo dei riferimenti, composizione, testo visibile, contesto, stile e uso finale.' }] },
    cta: { title: 'Esplora Seedream 5.0 Lite su Toolaze', text: 'Prepara prompt con ragionamento, confronta i modelli e inizia con i workflow Seed disponibili.', button: 'Vai al generatore', label: 'CTA finale Seedream 5.0 Lite' },
  },
}

const localizedSectionComplements: Partial<Record<Seedream50LiteLocale, DeepPartial<Seedream50LiteLandingCopy>>> = {
  de: {
    features: {
      items: [
        { title: 'Deep Thinking für komplexe Bild-Prompts', text: 'Hilft bei Briefings mit mehreren Vorgaben: Motivplatzierung, visueller Hierarchie, Stilregeln, Szenenlogik und klarer Gestaltungsabsicht.', paragraphs: ['Hilft bei Briefings mit mehreren Vorgaben: Motivplatzierung, visueller Hierarchie, Stilregeln, Szenenlogik und klarer Gestaltungsabsicht.', 'Nutzen Sie es für Kampagnenposter, Erklärbilder und Design-Kompositionen, die einen Plan erfüllen müssen statt nur eine Stimmung zu treffen.'], label: 'Konkretes Kampagnenposter als Beispiel für Seedream 5.0 Lite Reasoning' },
        { title: 'Visuelle Richtung mit Online-Kontext', text: 'Nützlich, wenn ein Motiv aktuelle Kategorien, regionale Details oder reichere visuelle Referenzen braucht.', paragraphs: ['Nützlich, wenn ein Motiv aktuelle Kategorien, regionale Details oder reichere visuelle Referenzen braucht.', 'So wird aus einem breiten Briefing schneller eine geerdete Produkt- oder Reisekampagne mit glaubwürdigen Details.'], label: 'Regionale Kampagnenvisualisierung mit Online-Kontext' },
        { title: 'Referenzbewusste Bearbeitung und Konsistenz', text: 'Geeignet, wenn hochgeladene Bilder, Stilreferenzen oder bestehende Layouts das Ergebnis sichtbar führen sollen.', paragraphs: ['Geeignet, wenn hochgeladene Bilder, Stilreferenzen oder bestehende Layouts das Ergebnis sichtbar führen sollen.', 'Das hilft bei Produktvarianten, Charakterkontinuität, Poster-Überarbeitungen und markentreuen Szenen.'], label: 'Referenzbasiertes Produktposter nach der Bearbeitung' },
        { title: 'Professionelle Layouts und Textdesigns', text: 'Für Poster, Infokarten, Brand-Mockups, Editorials und Social Visuals mit lesbarer Struktur.', paragraphs: ['Für Poster, Infokarten, Brand-Mockups, Editorials und Social Visuals mit lesbarer Struktur.', 'Beschreiben Sie Hierarchie, Titelbereiche, Ränder, Negativraum und Informationszonen direkt im Prompt.'], label: 'Professionelles Magazin- und Eventlayout' },
        { title: 'Multimodale Briefings für Designarbeit', text: 'Am stärksten, wenn Textanweisungen und Referenzbilder gemeinsam ein finales Designziel beschreiben.', paragraphs: ['Am stärksten, wenn Textanweisungen und Referenzbilder gemeinsam ein finales Designziel beschreiben.', 'Kombinieren Sie Ziel, Referenzrollen, Must-keep-Elemente, Komposition, Stil und Prüfkriterien vor der Generierung.'], label: 'Designbrief mit Referenzen und fertigem Ergebnis' },
      ],
    },
    gallery: {
      examples: [
        { title: 'Suchgestütztes Produktkonzept', text: 'Ein Launch-Visual mit regionalen Signalen, aktueller Designsprache, Materialdetails und klarer Hero-Komposition.' },
        { title: 'Referenzgeführte Posterbearbeitung', text: 'Produkt und Markenpalette bleiben erhalten, während Hierarchie, Licht, Titel und CTA verbessert werden.' },
        { title: 'Logisch aufgebaute Infografik', text: 'Jedes Bildelement erklärt ein bestimmtes Konzept mit lesbaren Labels und ausgewogener Fläche.' },
        { title: 'Charakter- und Stilkontinuität', text: 'Referenzen halten Figur, Outfit oder Markenobjekt stabil, während Hintergrund und Format wechseln.' },
        { title: 'Editoriales Themenbild', text: 'Ein komplexes Artikelnarrativ wird zu einem klaren Bild mit Headline-Fläche und kontrollierter Hierarchie.' },
        { title: 'UI- und Diagramm-Mockup', text: 'Panels, Labels, Pfeile und Gruppen bleiben in einem Produktworkflow schnell erfassbar.' },
        { title: 'Interior- und Architektur-Update', text: 'Raumstruktur bleibt erhalten, während Licht, Materialien, Möbel oder Saisonstimmung wechseln.' },
        { title: 'Mehrsprachiges Textlayout', text: 'Poster, Menükarten oder Social Cards mit mehreren klar getrennten Textzonen.' },
      ],
    },
    audiences: {
      title: 'Für wen ist Seedream 5.0 Lite geeignet?',
      text: 'Seedream 5.0 Lite passt zu Teams, die Briefings, Referenzen und strukturierte Designziele in prüfbare Bilder übersetzen.',
      items: ['Brand Designer für Kampagnen-Key-Visuals, Social Cards und Launch Assets.', 'E-Commerce-Teams für Produktbilder, Detailkarten, Verpackungsideen und Saisonvarianten.', 'Content-Teams für Infografiken, Editorials und visuelle Erklärstücke.', 'Creative Directors, die Modellverhalten vor der Produktion vergleichen.', 'Product Marketer mit Bedarf an Textzonen, Hierarchie und reviewfähigen Konzepten.', 'Creator, die Referenzen für konsistente Motive, Stile oder Layouts nutzen.'],
    },
    prompts: { examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Suchgestütztes Kampagnen-Key-Visual', 'Referenzbewusstes Produkt-Redesign', 'Logisch aufgebaute Infografik', 'Charakterkontinuität mit Referenz', 'Eventposter mit klaren Textzonen', 'Interior-Redesign nach Referenz'][index] })) },
    youtube: { title: 'Seedream 5.0 Lite Video-Auswahl', text: 'Öffentliche Videos zu Modellverhalten, Prompt-Workflows und Vergleichen mit anderen Bildgeneratoren.', watch: 'Auf YouTube ansehen' },
    reddit: { title: 'Seedream 5.0 Lite auf Reddit', text: 'Verifizierte Reddit-Beiträge mit passenden Titeln, Quellenlinks und Originalmedien pro Beitrag.', communityDiscussion: 'Community-Beitrag', openDiscussion: 'Reddit-Thread öffnen', items: [{ title: 'Seedream 5.0 Lite ist live', text: 'Ankündigung mit mehreren Originalbeispielen in einem Carousel.' }, { title: 'Preisaufschlüsselung zur Seedream 5.0 Lite API', text: 'Diskussion zu Preisen und API-Verfügbarkeit mit Originalvorschau.' }, { title: 'Vergleich von Seedream 5.0 Lite, Seedream 4.5 und Nano Banana', text: 'Testbeitrag mit Vergleichsausgaben und Originalmedien.' }] },
    x: { title: 'Seedream 5.0 Lite Beiträge auf X', text: 'Öffentliche X-Beiträge zu Launch, Reasoning, Suche und Multi-Image Editing.', watch: 'Beitrag öffnen', read: 'Quelle', items: [{ title: 'BytePlus Launch-Beitrag', text: 'Offizieller Launch-Beitrag mit Positionierung und Beispielen.' }, { title: 'BytePlus Funktionsbeitrag', text: 'Folgebeitrag zur Leistungsfähigkeit des Lite-Modells.' }, { title: 'Poe Verfügbarkeitsbeitrag', text: 'Ankündigung zur Verfügbarkeit und reasoning-orientierten Generierung.' }, { title: 'Multi-Image Edit Arena Ranking', text: 'Benchmark-Beitrag zu Multi-Image-Editing-Vergleichen.' }, { title: 'fal Day-Zero-Launch', text: 'Launch-Beitrag mit Fokus auf Deep Thinking und Online-Suche.' }] },
    image: { container: 'Bildplatzhalter' },
  },
  ja: {
    features: {
      items: [
        { title: '複雑な画像プロンプトの深い思考', text: '被写体配置、視覚階層、スタイル規則、シーン関係、デザイン意図など複数条件の整理に向いています。', paragraphs: ['被写体配置、視覚階層、スタイル規則、シーン関係、デザイン意図など複数条件の整理に向いています。', '雰囲気だけでなく計画を満たす広告ポスター、説明ビジュアル、キャンペーン構図に使いやすいモデルです。'], label: 'Seedream 5.0 Lite の推論力を示す具体的な広告ポスター' },
        { title: 'オンライン文脈に基づく視覚方向', text: '現在のカテゴリ感、地域の細部、認識しやすいモチーフ、豊かな参照が必要な画像に役立ちます。', paragraphs: ['現在のカテゴリ感、地域の細部、認識しやすいモチーフ、豊かな参照が必要な画像に役立ちます。', '広いブリーフを、現実感のある商品キャンペーンや旅行ビジュアルへ落とし込みやすくします。'], label: '地域文脈を反映したキャンペーン画像' },
        { title: '参照を意識した編集と一貫性', text: 'アップロード画像、スタイル参照、既存構図を結果に反映したいワークフロー向けです。', paragraphs: ['アップロード画像、スタイル参照、既存構図を結果に反映したいワークフロー向けです。', '商品バリエーション、キャラクター継続、ポスター改善、ブランドシーンの維持に役立ちます。'], label: '参照画像を保ちながら改善した商品ポスター' },
        { title: 'プロ向けレイアウトと文字中心デザイン', text: 'ポスター、情報カード、ブランドモックアップ、編集ビジュアル、SNS画像で読みやすい構造を作れます。', paragraphs: ['ポスター、情報カード、ブランドモックアップ、編集ビジュアル、SNS画像で読みやすい構造を作れます。', '階層、タイトル領域、余白、情報エリア、安全マージンをプロンプトで指定します。'], label: '明確なグリッドを持つ雑誌風イベントレイアウト' },
        { title: '実務向けのマルチモーダルブリーフ', text: 'テキスト指示と参照画像を組み合わせて、具体的なデザイン成果物へ近づけます。', paragraphs: ['テキスト指示と参照画像を組み合わせて、具体的なデザイン成果物へ近づけます。', '目的、参照の役割、保持要素、構図、スタイル、確認基準をまとめて生成します。'], label: '参照と完成案を含むデザインブリーフ' },
      ],
    },
    gallery: { examples: [{ title: '検索文脈の商品コンセプト', text: '地域の視覚要素、現在のデザイン感、素材の質感、明確な商品階層を含むローンチ画像。' }, { title: '参照に基づくポスター改善', text: '商品とブランドカラーを保ちながら、階層、光、タイトル、CTAを整えます。' }, { title: '推論型インフォグラフィック', text: '各要素が特定の概念に対応し、ラベルと余白が読みやすい情報図。' }, { title: 'キャラクターとスタイルの継続性', text: '人物、衣装、ブランド要素を保ちながら背景やフォーマットを変更します。' }, { title: '編集ビジュアルブリーフ', text: '複雑な記事テーマを、見出し余白と整理された階層を持つ画像へ変換します。' }, { title: 'UIと図解モックアップ', text: 'ラベル、パネル、矢印、グループが読み取りやすい製品ワークフロー図。' }, { title: 'インテリアと建築の更新', text: '構造を保ち、照明、素材、家具、季節感を変更します。' }, { title: '多言語テキストレイアウト', text: '複数の文字ゾーンを持つポスター、メニュー、SNSカード。' }] },
    audiences: { title: 'Seedream 5.0 Lite が向いている人', text: 'ブリーフ、参照画像、構造化されたデザイン目標をレビュー可能な画像にしたい制作チーム向けです。', items: ['キャンペーンKV、SNSカード、ローンチ素材を作るブランドデザイナー。', '商品ヒーロー、詳細カード、パッケージ案、季節バリエーションを扱うECチーム。', '記事やレポートをインフォグラフィックや編集ビジュアルへ変換するコンテンツチーム。', '高解像度制作前にモデル挙動を比較するクリエイティブディレクター。', '文字ゾーン、視覚階層、レビューしやすいコンセプトが必要なプロダクトマーケター。', '参照画像で被写体、スタイル、レイアウトの一貫性を保ちたいクリエイター。'] },
    prompts: { examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['検索文脈のキャンペーンKV', '参照を活かす商品リデザイン', '推論型情報グラフィック', '参照によるキャラクター継続', '明確な文字ゾーンのイベントポスター', '参照からのインテリアリデザイン'][index] })) },
    youtube: { title: 'Seedream 5.0 Lite 動画リスト', text: 'モデル挙動、プロンプトワークフロー、周辺生成ツールとの比較を扱う公開動画です。', watch: 'YouTubeで見る' },
    reddit: { title: 'Reddit の Seedream 5.0 Lite', text: 'タイトル、リンク、元メディアが一致する検証済みReddit投稿を表示します。', communityDiscussion: 'コミュニティ投稿', openDiscussion: 'Redditスレッドを開く', items: [{ title: 'Seedream 5.0 Lite が公開', text: '複数の元メディア例を含む公開告知投稿。' }, { title: 'Seedream 5.0 Lite API価格の内訳', text: '価格とAPI提供状況を扱う投稿。' }, { title: 'Seedream 5.0 Lite、Seedream 4.5、Nano Banana比較', text: '各モデルの出力を比較する投稿。' }] },
    x: { title: 'X の Seedream 5.0 Lite 投稿', text: 'ローンチ、推論、検索、複数画像編集についての公開投稿です。', watch: '投稿を開く', read: '出典', items: [{ title: 'BytePlus ローンチ投稿', text: 'モデルの位置づけと作例を紹介する公式投稿。' }, { title: 'BytePlus 機能紹介投稿', text: 'Liteモデルの画像生成力を説明する続報。' }, { title: 'Poe 提供開始投稿', text: '推論重視の画像生成として紹介する告知。' }, { title: 'Multi-Image Edit Arena ランキング', text: '複数画像編集比較での結果を扱う投稿。' }, { title: 'fal 初日ローンチ投稿', text: 'Deep Thinking とオンライン検索を強調する投稿。' }] },
    image: { container: '画像プレースホルダー' },
  },
  es: {
    features: { items: [{ title: 'Razonamiento para prompts de imagen complejos', text: 'Ayuda a ordenar ubicación del sujeto, jerarquía visual, reglas de estilo, relaciones de escena e intención de diseño.', paragraphs: ['Ayuda a ordenar ubicación del sujeto, jerarquía visual, reglas de estilo, relaciones de escena e intención de diseño.', 'Úsalo para pósters de campaña, explicadores y composiciones que deben cumplir un plan visual claro.'], label: 'Póster publicitario concreto que demuestra razonamiento en Seedream 5.0 Lite' }, { title: 'Dirección visual con contexto online', text: 'Útil cuando la imagen depende de categorías actuales, detalles regionales o referencias visuales más ricas.', paragraphs: ['Útil cuando la imagen depende de categorías actuales, detalles regionales o referencias visuales más ricas.', 'Convierte un brief amplio en una campaña de producto o viaje con señales visuales creíbles.'], label: 'Campaña con contexto regional y búsqueda online' }, { title: 'Edición con referencias y consistencia visual', text: 'Diseñado para que imágenes subidas, estilos o composiciones existentes guíen el resultado.', paragraphs: ['Diseñado para que imágenes subidas, estilos o composiciones existentes guíen el resultado.', 'Sirve para variantes de producto, continuidad de personajes, ajustes de póster y escenas de marca reconocibles.'], label: 'Póster de producto mejorado a partir de una referencia' }, { title: 'Layouts profesionales y diseño con texto', text: 'Para pósters, tarjetas informativas, mockups de marca, visuales editoriales y gráficos sociales estructurados.', paragraphs: ['Para pósters, tarjetas informativas, mockups de marca, visuales editoriales y gráficos sociales estructurados.', 'Define jerarquía, zonas de título, márgenes, espacio negativo y áreas de información en el prompt.'], label: 'Layout editorial y de evento con retícula clara' }, { title: 'Briefs multimodales para trabajo real', text: 'Funciona mejor cuando instrucciones de texto y referencias visuales describen un resultado de diseño concreto.', paragraphs: ['Funciona mejor cuando instrucciones de texto y referencias visuales describen un resultado de diseño concreto.', 'Combina objetivo, roles de referencia, elementos a conservar, composición, estilo y criterios de revisión.'], label: 'Brief de diseño con referencias y resultado final' }] },
    gallery: { examples: [{ title: 'Concepto de producto con búsqueda', text: 'Visual de lanzamiento con señales regionales, lenguaje actual, materiales precisos y composición hero clara.' }, { title: 'Edición de póster con referencia', text: 'Conserva producto y paleta de marca mientras mejora jerarquía, luz, título y CTA.' }, { title: 'Infografía razonada', text: 'Cada elemento visual se conecta con una idea específica, con etiquetas legibles y buen espaciado.' }, { title: 'Continuidad de personaje y estilo', text: 'Mantiene personaje, ropa o activo de marca mientras cambia fondo, formato o cámara.' }, { title: 'Brief visual editorial', text: 'Convierte un tema complejo en una imagen clara con espacio para titular y jerarquía controlada.' }, { title: 'Mockup de UI y diagrama', text: 'Paneles, flechas, etiquetas y grupos visuales se mantienen fáciles de leer.' }, { title: 'Actualización interior y arquitectura', text: 'Respeta estructura de sala o fachada y cambia luz, materiales, muebles o ambiente.' }, { title: 'Layout de texto multilingüe', text: 'Póster, menú o tarjeta social con varias zonas de texto bien separadas.' }] },
    audiences: { title: '¿Quién debería usar Seedream 5.0 Lite?', text: 'Es útil para equipos que convierten briefs, referencias y objetivos visuales en imágenes listas para revisar.', items: ['Diseñadores de marca que preparan key visuals, tarjetas sociales y piezas de lanzamiento.', 'Equipos e-commerce que refinan productos, tarjetas de detalle, packaging y variantes de temporada.', 'Equipos de contenido que convierten informes e ideas en infografías o visuales editoriales.', 'Directores creativos que comparan modelos antes de elegir un flujo de producción.', 'Product marketers que necesitan zonas de texto, jerarquía y conceptos fáciles de revisar.', 'Creadores que usan referencias para mantener sujetos, estilos o layouts consistentes.'] },
    prompts: { examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Visual clave de campaña con búsqueda', 'Rediseño de producto con referencia', 'Gráfico informativo razonado', 'Continuidad de personaje por referencia', 'Póster de evento con zonas de texto claras', 'Rediseño interior desde referencia'][index] })) },
    youtube: { title: 'Lista de videos sobre Seedream 5.0 Lite', text: 'Videos públicos sobre comportamiento del modelo, prompts y comparación con herramientas cercanas.', watch: 'Ver en YouTube' },
    reddit: { title: 'Seedream 5.0 Lite en Reddit', text: 'Publicaciones verificadas con títulos, enlaces y medios originales agrupados por post.', communityDiscussion: 'Publicación de la comunidad', openDiscussion: 'Abrir hilo de Reddit', items: [{ title: 'Seedream 5.0 Lite ya está disponible', text: 'Anuncio con varios ejemplos originales en un carrusel.' }, { title: 'Desglose de precios de la API Seedream 5.0 Lite', text: 'Debate sobre precios y disponibilidad de API con vista previa original.' }, { title: 'Comparación de Seedream 5.0 Lite, Seedream 4.5 y Nano Banana', text: 'Prueba comparativa con resultados y medios originales.' }] },
    x: { title: 'Publicaciones de Seedream 5.0 Lite en X', text: 'Posts públicos sobre lanzamiento, razonamiento, búsqueda online y edición multi-imagen.', watch: 'Abrir post', read: 'Fuente', items: [{ title: 'Post de lanzamiento de BytePlus', text: 'Anuncio oficial con posicionamiento y ejemplos.' }, { title: 'Post de capacidades de BytePlus', text: 'Seguimiento sobre el potencial del modelo Lite.' }, { title: 'Post de disponibilidad en Poe', text: 'Anuncio sobre disponibilidad y generación con razonamiento.' }, { title: 'Ranking Multi-Image Edit Arena', text: 'Post de benchmark sobre edición con varias imágenes.' }, { title: 'Lanzamiento day-zero de fal', text: 'Post que enfatiza deep thinking y búsqueda online.' }] },
    image: { container: 'Marcador de imagen' },
  },
  'zh-TW': {
    features: { items: [{ title: '複雜圖像提示詞的深度思考', text: '適合處理主體位置、視覺層級、風格規則、場景關係與明確設計意圖等多重限制。', paragraphs: ['適合處理主體位置、視覺層級、風格規則、場景關係與明確設計意圖等多重限制。', '當概念不好直接呈現時，可用廣告海報、活動視覺或說明型畫面這類具體成品來表達能力。'], label: '以具體廣告海報展示 Seedream 5.0 Lite 推理能力' }, { title: '結合線上脈絡的視覺方向', text: '當圖像概念需要當前語境、可辨識類別、地域細節或更豐富參考時很有用。', paragraphs: ['當圖像概念需要當前語境、可辨識類別、地域細節或更豐富參考時很有用。', '可把寬泛創意 brief 轉成更落地的商品、城市或旅行 campaign 視覺。'], label: '帶有地域語境的 campaign 視覺' }, { title: '參考導向編輯與視覺一致性', text: '適合讓上傳圖片、風格參考或既有構圖真正引導輸出結果。', paragraphs: ['適合讓上傳圖片、風格參考或既有構圖真正引導輸出結果。', '可用於商品改稿、角色延續、海報優化與需保留品牌識別的場景。'], label: '保留參考並升級後的商品海報' }, { title: '專業版式與文字主導設計', text: '適合海報、資訊卡、品牌 mockup、編輯視覺與社群圖中需要清晰結構的任務。', paragraphs: ['適合海報、資訊卡、品牌 mockup、編輯視覺與社群圖中需要清晰結構的任務。', '在提示詞中明確描述標題區、留白、資訊區、安全邊距與視覺密度。'], label: '具備清楚網格與資訊區的專業海報版式' }, { title: '面向真實設計工作的多模態 brief', text: '當文字指令與參考圖一起描述最終成品時，更容易得到可用的設計結果。', paragraphs: ['當文字指令與參考圖一起描述最終成品時，更容易得到可用的設計結果。', '生成前先組合目標、參考角色、必須保留元素、構圖、風格與檢查標準。'], label: '含參考圖與成品方向的設計 brief' }] },
    gallery: { examples: [{ title: '搜尋脈絡商品概念', text: '帶有地域線索、當代設計語言、材質細節與清楚主體層級的上市主視覺。' }, { title: '參考導向海報修改', text: '保留產品與品牌色，同時改善層級、光線、標題位置與 CTA。' }, { title: '推理型資訊圖', text: '每個視覺元素對應一個概念，並具備可讀標籤與平衡留白。' }, { title: '角色與風格延續', text: '利用參考圖維持人物、服裝或品牌資產，同時改變背景與格式。' }, { title: '編輯視覺 brief', text: '把複雜文章主題轉化為有標題安全區與清楚層級的圖片。' }, { title: 'UI 與流程圖 mockup', text: '讓面板、箭頭、標籤與視覺分組都易於掃讀。' }, { title: '室內與建築更新', text: '保留房間或立面的結構線索，改變光線、材質、家具或季節氛圍。' }, { title: '多語文字版式', text: '用於海報、菜單或社群卡片，多個文字區需清楚分層。' }] },
    audiences: { title: '誰適合使用 Seedream 5.0 Lite？', text: 'Seedream 5.0 Lite 適合需要把 brief、參考圖與結構化設計目標轉成可審核圖像的創作者。', items: ['準備 campaign 主視覺、社群卡片、商品場景與上市素材的品牌設計師。', '優化商品主圖、細節卡、包裝概念與季節變體的電商團隊。', '把文章、報告與說明內容轉成資訊圖或編輯視覺的內容團隊。', '在高解析製作前比較模型行為的創意總監。', '需要清楚文字區、視覺層級與易審核概念的產品行銷。', '使用參考圖並需保持主體、風格或版式一致的創作者。'] },
    prompts: { examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['搜尋脈絡 campaign 主視覺', '參考導向商品重設計', '推理型資訊圖', '參考角色延續', '清楚文字區活動海報', '根據參考圖做室內重設計'][index] })) },
    youtube: { title: 'Seedream 5.0 Lite 影片清單', text: '觀看公開影片，了解模型表現、提示詞流程與它和相近生成工具的差異。', watch: '在 YouTube 觀看' },
    reddit: { title: 'Reddit 上的 Seedream 5.0 Lite', text: '查看已驗證的 Reddit 貼文，每篇都保留相符標題、來源連結與原始媒體。', communityDiscussion: '社群貼文', openDiscussion: '開啟 Reddit 討論串', items: [{ title: 'Seedream 5.0 Lite 已上線', text: '包含多個原始媒體範例的公告貼文。' }, { title: 'Seedream 5.0 Lite API 價格拆解', text: '討論價格與 API 可用性的貼文。' }, { title: 'Seedream 5.0 Lite、Seedream 4.5 與 Nano Banana 比較', text: '比較多個模型輸出結果的測試貼文。' }] },
    x: { title: 'X 上的 Seedream 5.0 Lite 貼文', text: '閱讀關於發布、推理、線上搜尋與多圖編輯的公開 X 貼文。', watch: '開啟貼文', read: '來源', items: [{ title: 'BytePlus 發布貼文', text: '介紹模型定位與圖像創作範例的官方貼文。' }, { title: 'BytePlus 能力說明貼文', text: '描述 Lite 模型生成能力的後續貼文。' }, { title: 'Poe 可用性貼文', text: '關於 Seedream 5.0 Lite 上線與推理式生成的公告。' }, { title: 'Multi-Image Edit Arena 排名', text: '涵蓋多圖編輯比較表現的基準貼文。' }, { title: 'fal 首日發布貼文', text: '強調深度思考與內建線上搜尋的發布貼文。' }] },
    image: { container: '圖片佔位' },
  },
  pt: {
    features: { items: [{ title: 'Raciocínio para prompts de imagem complexos', text: 'Ajuda a organizar posição do assunto, hierarquia visual, regras de estilo, relações da cena e intenção de design.', paragraphs: ['Ajuda a organizar posição do assunto, hierarquia visual, regras de estilo, relações da cena e intenção de design.', 'Use para pôsteres de campanha, explicadores e composições que precisam cumprir um plano visual claro.'], label: 'Pôster publicitário concreto demonstrando raciocínio do Seedream 5.0 Lite' }, { title: 'Direção visual com contexto online', text: 'Útil quando a imagem depende de categorias atuais, detalhes regionais ou referências visuais mais ricas.', paragraphs: ['Útil quando a imagem depende de categorias atuais, detalhes regionais ou referências visuais mais ricas.', 'Transforma um brief amplo em uma campanha de produto ou viagem com sinais visuais críveis.'], label: 'Campanha com contexto regional e busca online' }, { title: 'Edição com referências e consistência visual', text: 'Feito para que imagens enviadas, estilos ou composições existentes guiem o resultado.', paragraphs: ['Feito para que imagens enviadas, estilos ou composições existentes guiem o resultado.', 'Serve para variantes de produto, continuidade de personagem, ajustes de pôster e cenas de marca reconhecíveis.'], label: 'Pôster de produto aprimorado a partir de referência' }, { title: 'Layouts profissionais e design com texto', text: 'Para pôsteres, cartões informativos, mockups de marca, editoriais e gráficos sociais estruturados.', paragraphs: ['Para pôsteres, cartões informativos, mockups de marca, editoriais e gráficos sociais estruturados.', 'Defina hierarquia, áreas de título, margens, espaço negativo e zonas de informação no prompt.'], label: 'Layout editorial e de evento com grade clara' }, { title: 'Briefs multimodais para trabalho real', text: 'Funciona melhor quando instruções de texto e referências visuais descrevem um resultado de design concreto.', paragraphs: ['Funciona melhor quando instruções de texto e referências visuais descrevem um resultado de design concreto.', 'Combine objetivo, papéis das referências, elementos a manter, composição, estilo e critérios de revisão.'], label: 'Brief de design com referências e resultado final' }] },
    gallery: { examples: [{ title: 'Conceito de produto com busca', text: 'Visual de lançamento com sinais regionais, linguagem atual, materiais precisos e composição hero clara.' }, { title: 'Edição de pôster com referência', text: 'Preserva produto e paleta enquanto melhora hierarquia, luz, título e chamada.' }, { title: 'Infográfico com raciocínio', text: 'Cada elemento visual se conecta a uma ideia específica, com rótulos legíveis e bom espaçamento.' }, { title: 'Continuidade de personagem e estilo', text: 'Mantém personagem, roupa ou ativo de marca enquanto muda fundo, formato ou câmera.' }, { title: 'Brief visual editorial', text: 'Converte um tema complexo em imagem clara com espaço para título e hierarquia controlada.' }, { title: 'Mockup de UI e diagrama', text: 'Painéis, setas, rótulos e grupos visuais permanecem fáceis de ler.' }, { title: 'Atualização de interior e arquitetura', text: 'Respeita estrutura de sala ou fachada e muda luz, materiais, móveis ou clima.' }, { title: 'Layout de texto multilíngue', text: 'Pôster, menu ou card social com várias zonas de texto bem separadas.' }] },
    audiences: { title: 'Quem deve usar Seedream 5.0 Lite?', text: 'Útil para equipes que transformam briefs, referências e metas visuais em imagens prontas para revisão.', items: ['Designers de marca criando key visuals, cards sociais e assets de lançamento.', 'Equipes de e-commerce refinando produtos, cards de detalhe, embalagens e variantes sazonais.', 'Equipes de conteúdo transformando relatórios e ideias em infográficos ou visuais editoriais.', 'Diretores criativos comparando modelos antes de escolher o fluxo de produção.', 'Product marketers que precisam de zonas de texto, hierarquia e conceitos fáceis de revisar.', 'Criadores que usam referências para manter assuntos, estilos ou layouts consistentes.'] },
    prompts: { examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Visual-chave de campanha com busca', 'Redesign de produto com referência', 'Gráfico informativo com raciocínio', 'Continuidade de personagem por referência', 'Pôster de evento com zonas de texto claras', 'Redesign de interior a partir de referência'][index] })) },
    youtube: { title: 'Lista de vídeos sobre Seedream 5.0 Lite', text: 'Vídeos públicos sobre comportamento do modelo, prompts e comparação com ferramentas próximas.', watch: 'Ver no YouTube' },
    reddit: { title: 'Seedream 5.0 Lite no Reddit', text: 'Posts verificados com títulos, links e mídias originais agrupados por publicação.', communityDiscussion: 'Post da comunidade', openDiscussion: 'Abrir discussão no Reddit', items: [{ title: 'Seedream 5.0 Lite já está ativo', text: 'Anúncio com vários exemplos originais em carrossel.' }, { title: 'Detalhamento de preços da API Seedream 5.0 Lite', text: 'Discussão sobre preços e disponibilidade de API com prévia original.' }, { title: 'Comparação entre Seedream 5.0 Lite, Seedream 4.5 e Nano Banana', text: 'Teste comparativo com resultados e mídias originais.' }] },
    x: { title: 'Posts de Seedream 5.0 Lite no X', text: 'Posts públicos sobre lançamento, raciocínio, busca online e edição multi-imagem.', watch: 'Abrir post', read: 'Fonte', items: [{ title: 'Post de lançamento da BytePlus', text: 'Anúncio oficial com posicionamento e exemplos.' }, { title: 'Post de capacidades da BytePlus', text: 'Continuação sobre o potencial do modelo Lite.' }, { title: 'Post de disponibilidade no Poe', text: 'Anúncio sobre disponibilidade e geração com raciocínio.' }, { title: 'Ranking Multi-Image Edit Arena', text: 'Post de benchmark sobre edição com várias imagens.' }, { title: 'Lançamento day-zero da fal', text: 'Post que enfatiza deep thinking e busca online.' }] },
    image: { container: 'Marcador de imagem' },
  },
  fr: {
    features: { items: [{ title: 'Raisonnement pour prompts d’image complexes', text: 'Aide à organiser placement du sujet, hiérarchie visuelle, règles de style, relations de scène et intention de design.', paragraphs: ['Aide à organiser placement du sujet, hiérarchie visuelle, règles de style, relations de scène et intention de design.', 'Utilisez-le pour affiches de campagne, visuels explicatifs et compositions qui doivent suivre un plan clair.'], label: 'Affiche publicitaire concrète montrant le raisonnement de Seedream 5.0 Lite' }, { title: 'Direction visuelle avec contexte en ligne', text: 'Utile quand l’image dépend de catégories actuelles, détails régionaux ou références visuelles plus riches.', paragraphs: ['Utile quand l’image dépend de catégories actuelles, détails régionaux ou références visuelles plus riches.', 'Transforme un brief large en campagne produit ou voyage avec des détails visuels crédibles.'], label: 'Campagne avec contexte régional et recherche en ligne' }, { title: 'Édition guidée par référence et cohérence', text: 'Conçu pour que les images importées, styles ou compositions existantes guident le résultat.', paragraphs: ['Conçu pour que les images importées, styles ou compositions existantes guident le résultat.', 'Utile pour variantes produit, continuité de personnage, reprises d’affiche et scènes de marque reconnaissables.'], label: 'Affiche produit améliorée à partir d’une référence' }, { title: 'Layouts professionnels et design textuel', text: 'Pour affiches, cartes d’information, mockups de marque, visuels éditoriaux et images sociales structurées.', paragraphs: ['Pour affiches, cartes d’information, mockups de marque, visuels éditoriaux et images sociales structurées.', 'Définissez hiérarchie, zones de titre, marges, espace négatif et zones d’information dans le prompt.'], label: 'Layout éditorial et événementiel avec grille claire' }, { title: 'Briefs multimodaux pour le vrai design', text: 'Fonctionne mieux quand instructions textuelles et références visuelles décrivent un résultat concret.', paragraphs: ['Fonctionne mieux quand instructions textuelles et références visuelles décrivent un résultat concret.', 'Combinez objectif, rôles des références, éléments à conserver, composition, style et critères de revue.'], label: 'Brief de design avec références et résultat final' }] },
    gallery: { examples: [{ title: 'Concept produit avec recherche', text: 'Visuel de lancement avec indices régionaux, langage actuel, matériaux précis et composition hero claire.' }, { title: 'Édition d’affiche avec référence', text: 'Conserve produit et palette tout en améliorant hiérarchie, lumière, titre et CTA.' }, { title: 'Infographie raisonnée', text: 'Chaque élément visuel correspond à une idée précise, avec libellés lisibles et bon espacement.' }, { title: 'Continuité de personnage et style', text: 'Garde personnage, tenue ou actif de marque tout en changeant décor, format ou caméra.' }, { title: 'Brief visuel éditorial', text: 'Transforme un thème complexe en image claire avec espace de titre et hiérarchie contrôlée.' }, { title: 'Mockup UI et diagramme', text: 'Panneaux, flèches, libellés et groupes visuels restent faciles à lire.' }, { title: 'Mise à jour intérieur et architecture', text: 'Respecte la structure d’une pièce ou façade et change lumière, matériaux, mobilier ou ambiance.' }, { title: 'Layout de texte multilingue', text: 'Affiche, menu ou carte sociale avec plusieurs zones de texte distinctes.' }] },
    audiences: { title: 'Qui devrait utiliser Seedream 5.0 Lite ?', text: 'Utile aux équipes qui transforment briefs, références et objectifs visuels en images prêtes à relire.', items: ['Designers de marque préparant key visuals, cartes sociales et assets de lancement.', 'Équipes e-commerce affinant produits, fiches détail, packaging et variantes saisonnières.', 'Équipes contenu transformant rapports et idées en infographies ou visuels éditoriaux.', 'Directeurs créatifs comparant les modèles avant un workflow de production.', 'Product marketers ayant besoin de zones de texte, hiérarchie et concepts faciles à valider.', 'Créateurs utilisant des références pour garder sujets, styles ou layouts cohérents.'] },
    prompts: { examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Visuel clé de campagne avec recherche', 'Refonte produit guidée par référence', 'Graphique informatif raisonné', 'Continuité personnage par référence', 'Affiche événement avec zones de texte claires', 'Refonte intérieure depuis référence'][index] })) },
    youtube: { title: 'Liste de vidéos Seedream 5.0 Lite', text: 'Vidéos publiques sur le comportement du modèle, les prompts et la comparaison avec des outils proches.', watch: 'Voir sur YouTube' },
    reddit: { title: 'Seedream 5.0 Lite sur Reddit', text: 'Posts vérifiés avec titres, liens et médias originaux regroupés par publication.', communityDiscussion: 'Post communautaire', openDiscussion: 'Ouvrir le fil Reddit', items: [{ title: 'Seedream 5.0 Lite est disponible', text: 'Annonce avec plusieurs exemples originaux en carrousel.' }, { title: 'Détail des prix API Seedream 5.0 Lite', text: 'Discussion sur prix et disponibilité API avec aperçu original.' }, { title: 'Comparaison Seedream 5.0 Lite, Seedream 4.5 et Nano Banana', text: 'Test comparatif avec sorties et médias originaux.' }] },
    x: { title: 'Posts Seedream 5.0 Lite sur X', text: 'Posts publics sur lancement, raisonnement, recherche en ligne et édition multi-image.', watch: 'Ouvrir le post', read: 'Lien source', items: [{ title: 'Post de lancement BytePlus', text: 'Annonce officielle avec positionnement et exemples.' }, { title: 'Post capacités BytePlus', text: 'Suite sur le potentiel du modèle Lite.' }, { title: 'Post disponibilité Poe', text: 'Annonce de disponibilité et génération par raisonnement.' }, { title: 'Classement Multi-Image Edit Arena', text: 'Post benchmark sur l’édition multi-image.' }, { title: 'Lancement day-zero fal', text: 'Post axé sur deep thinking et recherche en ligne.' }] },
    image: { container: 'Emplacement image' },
  },
  ko: {
    features: { items: [{ title: '복잡한 이미지 프롬프트를 위한 깊은 사고', text: '피사체 배치, 시각 계층, 스타일 규칙, 장면 관계, 디자인 의도를 함께 정리하는 작업에 적합합니다.', paragraphs: ['피사체 배치, 시각 계층, 스타일 규칙, 장면 관계, 디자인 의도를 함께 정리하는 작업에 적합합니다.', '분위기만 맞추는 대신 명확한 계획을 만족해야 하는 광고 포스터, 설명 이미지, 캠페인 장면에 유용합니다.'], label: 'Seedream 5.0 Lite 추론을 보여주는 구체적인 광고 포스터' }, { title: '온라인 맥락 기반 시각 방향', text: '최신 카테고리, 지역 세부 정보, 더 풍부한 시각 참조가 필요한 이미지에 유용합니다.', paragraphs: ['최신 카테고리, 지역 세부 정보, 더 풍부한 시각 참조가 필요한 이미지에 유용합니다.', '넓은 브리프를 신뢰할 만한 제품 또는 여행 캠페인 이미지로 구체화합니다.'], label: '지역 맥락과 온라인 검색을 반영한 캠페인 이미지' }, { title: '참조 인식 편집과 시각 일관성', text: '업로드 이미지, 스타일 참조, 기존 구성이 결과를 이끌어야 하는 작업에 맞습니다.', paragraphs: ['업로드 이미지, 스타일 참조, 기존 구성이 결과를 이끌어야 하는 작업에 맞습니다.', '제품 변형, 캐릭터 연속성, 포스터 수정, 브랜드 장면 유지에 도움이 됩니다.'], label: '참조를 유지하며 개선한 제품 포스터' }, { title: '전문 레이아웃과 텍스트 중심 디자인', text: '포스터, 정보 카드, 브랜드 목업, 에디토리얼 이미지, 구조화된 소셜 그래픽에 적합합니다.', paragraphs: ['포스터, 정보 카드, 브랜드 목업, 에디토리얼 이미지, 구조화된 소셜 그래픽에 적합합니다.', '프롬프트에 계층, 제목 영역, 여백, 정보 구역, 안전 마진을 명확히 적으세요.'], label: '명확한 그리드를 가진 전문 이벤트 레이아웃' }, { title: '실제 디자인 작업을 위한 멀티모달 브리프', text: '텍스트 지시와 참조 이미지가 구체적인 디자인 결과물을 함께 설명할 때 강합니다.', paragraphs: ['텍스트 지시와 참조 이미지가 구체적인 디자인 결과물을 함께 설명할 때 강합니다.', '목표, 참조 역할, 유지 요소, 구성, 스타일, 검토 기준을 결합해 생성하세요.'], label: '참조와 최종 결과 방향이 포함된 디자인 브리프' }] },
    gallery: { examples: [{ title: '검색 기반 제품 콘셉트', text: '지역 단서, 최신 디자인 언어, 소재 디테일, 명확한 제품 계층을 담은 출시 이미지.' }, { title: '참조 기반 포스터 편집', text: '제품과 브랜드 팔레트를 유지하면서 계층, 조명, 제목, CTA를 개선합니다.' }, { title: '추론형 인포그래픽', text: '각 시각 요소가 특정 개념에 연결되고 라벨과 여백이 읽기 쉽습니다.' }, { title: '캐릭터와 스타일 연속성', text: '캐릭터, 의상, 브랜드 자산을 유지하면서 배경, 형식, 카메라를 바꿉니다.' }, { title: '에디토리얼 비주얼 브리프', text: '복잡한 기사 주제를 제목 여백과 제어된 계층이 있는 이미지로 바꿉니다.' }, { title: 'UI와 다이어그램 목업', text: '패널, 화살표, 라벨, 시각 그룹이 빠르게 읽히도록 구성됩니다.' }, { title: '인테리어와 건축 업데이트', text: '방 또는 외관 구조를 유지하고 조명, 소재, 가구, 계절감을 바꿉니다.' }, { title: '다국어 텍스트 레이아웃', text: '여러 텍스트 구역이 필요한 포스터, 메뉴판, 소셜 카드에 적합합니다.' }] },
    audiences: { title: 'Seedream 5.0 Lite가 적합한 사용자', text: '브리프, 참조 이미지, 구조화된 디자인 목표를 검토 가능한 이미지로 바꾸는 팀에 적합합니다.', items: ['캠페인 키비주얼, 소셜 카드, 출시 자산을 준비하는 브랜드 디자이너.', '제품 히어로, 상세 카드, 패키징 콘셉트, 시즌 변형을 다루는 이커머스 팀.', '보고서와 아이디어를 인포그래픽 또는 에디토리얼 이미지로 바꾸는 콘텐츠 팀.', '제작 워크플로 선택 전 모델 동작을 비교하는 크리에이티브 디렉터.', '텍스트 구역, 시각 계층, 검토 쉬운 콘셉트가 필요한 제품 마케터.', '참조 이미지로 피사체, 스타일, 레이아웃 일관성을 유지하는 크리에이터.'] },
    prompts: { examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['검색 기반 캠페인 키비주얼', '참조 인식 제품 리디자인', '추론형 정보 그래픽', '참조 기반 캐릭터 연속성', '명확한 텍스트 구역의 이벤트 포스터', '참조 기반 인테리어 리디자인'][index] })) },
    youtube: { title: 'Seedream 5.0 Lite 영상 목록', text: '모델 동작, 프롬프트 워크플로, 주변 생성 도구와의 비교를 다루는 공개 영상입니다.', watch: 'YouTube에서 보기' },
    reddit: { title: 'Reddit의 Seedream 5.0 Lite', text: '제목, 링크, 원본 미디어가 일치하는 검증된 Reddit 게시물입니다.', communityDiscussion: '커뮤니티 게시물', openDiscussion: 'Reddit 스레드 열기', items: [{ title: 'Seedream 5.0 Lite 공개', text: '여러 원본 미디어 예시가 포함된 발표 게시물.' }, { title: 'Seedream 5.0 Lite API 가격 분석', text: '가격과 API 가용성을 다루는 게시물.' }, { title: 'Seedream 5.0 Lite, Seedream 4.5, Nano Banana 비교', text: '여러 모델 출력을 비교한 테스트 게시물.' }] },
    x: { title: 'X의 Seedream 5.0 Lite 게시물', text: '출시, 추론, 온라인 검색, 다중 이미지 편집을 다루는 공개 게시물입니다.', watch: '게시물 열기', read: '출처', items: [{ title: 'BytePlus 출시 게시물', text: '모델 포지셔닝과 예시를 담은 공식 발표.' }, { title: 'BytePlus 기능 게시물', text: 'Lite 모델의 생성 능력을 설명하는 후속 게시물.' }, { title: 'Poe 사용 가능 게시물', text: '가용성과 추론형 생성에 대한 발표.' }, { title: 'Multi-Image Edit Arena 순위', text: '다중 이미지 편집 비교를 다루는 벤치마크 게시물.' }, { title: 'fal 당일 출시 게시물', text: 'Deep Thinking과 온라인 검색을 강조하는 출시 글.' }] },
    image: { container: '이미지 자리표시자' },
  },
  it: {
    features: { items: [{ title: 'Ragionamento per prompt immagine complessi', text: 'Aiuta a organizzare posizione del soggetto, gerarchia visiva, regole di stile, relazioni di scena e intento progettuale.', paragraphs: ['Aiuta a organizzare posizione del soggetto, gerarchia visiva, regole di stile, relazioni di scena e intento progettuale.', 'Usalo per poster di campagna, visual esplicativi e composizioni che devono seguire un piano chiaro.'], label: 'Poster pubblicitario concreto che mostra il ragionamento di Seedream 5.0 Lite' }, { title: 'Direzione visiva con contesto online', text: 'Utile quando l’immagine dipende da categorie attuali, dettagli regionali o riferimenti visivi più ricchi.', paragraphs: ['Utile quando l’immagine dipende da categorie attuali, dettagli regionali o riferimenti visivi più ricchi.', 'Trasforma un brief ampio in una campagna prodotto o viaggio con segnali visivi credibili.'], label: 'Campagna con contesto regionale e ricerca online' }, { title: 'Editing con riferimenti e coerenza visiva', text: 'Pensato perché immagini caricate, stili o composizioni esistenti guidino il risultato.', paragraphs: ['Pensato perché immagini caricate, stili o composizioni esistenti guidino il risultato.', 'Serve per varianti prodotto, continuità personaggio, revisioni poster e scene di brand riconoscibili.'], label: 'Poster prodotto migliorato da un riferimento' }, { title: 'Layout professionali e design testuale', text: 'Per poster, schede informative, mockup di brand, visual editoriali e grafiche social strutturate.', paragraphs: ['Per poster, schede informative, mockup di brand, visual editoriali e grafiche social strutturate.', 'Definisci gerarchia, aree titolo, margini, spazio negativo e zone informative nel prompt.'], label: 'Layout editoriale ed evento con griglia chiara' }, { title: 'Brief multimodali per lavoro reale', text: 'Funziona meglio quando istruzioni testuali e riferimenti visivi descrivono un risultato di design concreto.', paragraphs: ['Funziona meglio quando istruzioni testuali e riferimenti visivi descrivono un risultato di design concreto.', 'Combina obiettivo, ruoli dei riferimenti, elementi da mantenere, composizione, stile e criteri di revisione.'], label: 'Brief di design con riferimenti e risultato finale' }] },
    gallery: { examples: [{ title: 'Concept prodotto con ricerca', text: 'Visual di lancio con segnali regionali, linguaggio attuale, materiali precisi e composizione hero chiara.' }, { title: 'Editing poster con riferimento', text: 'Mantiene prodotto e palette migliorando gerarchia, luce, titolo e CTA.' }, { title: 'Infografica ragionata', text: 'Ogni elemento visuale corrisponde a un’idea specifica, con label leggibili e buon respiro.' }, { title: 'Continuità di personaggio e stile', text: 'Mantiene personaggio, outfit o asset di brand cambiando sfondo, formato o camera.' }, { title: 'Brief visuale editoriale', text: 'Trasforma un tema complesso in immagine chiara con spazio per headline e gerarchia controllata.' }, { title: 'Mockup UI e diagramma', text: 'Pannelli, frecce, label e gruppi visivi restano facili da leggere.' }, { title: 'Aggiornamento interior e architettura', text: 'Rispetta struttura di stanza o facciata e cambia luce, materiali, arredi o atmosfera.' }, { title: 'Layout testo multilingue', text: 'Poster, menu o social card con diverse zone di testo ben separate.' }] },
    audiences: { title: 'Chi dovrebbe usare Seedream 5.0 Lite?', text: 'Utile per team che trasformano brief, riferimenti e obiettivi visuali in immagini pronte per revisione.', items: ['Brand designer che preparano key visual, social card e asset di lancio.', 'Team e-commerce che rifiniscono prodotti, schede dettaglio, packaging e varianti stagionali.', 'Team contenuti che trasformano report e idee in infografiche o visual editoriali.', 'Creative director che confrontano modelli prima del workflow di produzione.', 'Product marketer che necessitano zone testo, gerarchia e concept facili da revisionare.', 'Creator che usano riferimenti per mantenere soggetti, stili o layout coerenti.'] },
    prompts: { examples: en.prompts.examples.map((item, index) => ({ ...item, title: ['Key visual campagna con ricerca', 'Redesign prodotto guidato da riferimento', 'Grafico informativo ragionato', 'Continuità personaggio da riferimento', 'Poster evento con zone testo chiare', 'Redesign interior da riferimento'][index] })) },
    youtube: { title: 'Video Seedream 5.0 Lite da guardare', text: 'Video pubblici su comportamento del modello, workflow di prompt e confronto con strumenti vicini.', watch: 'Guarda su YouTube' },
    reddit: { title: 'Seedream 5.0 Lite su Reddit', text: 'Post verificati con titoli, link e media originali raggruppati per pubblicazione.', communityDiscussion: 'Post della community', openDiscussion: 'Apri thread Reddit', items: [{ title: 'Seedream 5.0 Lite è live', text: 'Annuncio con diversi esempi originali in carousel.' }, { title: 'Analisi prezzi API Seedream 5.0 Lite', text: 'Discussione su prezzi e disponibilità API con anteprima originale.' }, { title: 'Confronto Seedream 5.0 Lite, Seedream 4.5 e Nano Banana', text: 'Test comparativo con output e media originali.' }] },
    x: { title: 'Post Seedream 5.0 Lite su X', text: 'Post pubblici su lancio, ragionamento, ricerca online ed editing multi-immagine.', watch: 'Apri post', read: 'Fonte', items: [{ title: 'Post lancio BytePlus', text: 'Annuncio ufficiale con posizionamento ed esempi.' }, { title: 'Post capacità BytePlus', text: 'Aggiornamento sul potenziale del modello Lite.' }, { title: 'Post disponibilità Poe', text: 'Annuncio su disponibilità e generazione con ragionamento.' }, { title: 'Ranking Multi-Image Edit Arena', text: 'Post benchmark sull’editing multi-immagine.' }, { title: 'Lancio day-zero fal', text: 'Post focalizzato su deep thinking e ricerca online.' }] },
    image: { container: 'Segnaposto immagine' },
  },
}

const localizedVisibleComplements: Partial<Record<Seedream50LiteLocale, DeepPartial<Seedream50LiteLandingCopy>>> = {
  de: {
    metadata: {
      openGraphDescription:
        'Erfahren Sie, wie Seedream 5.0 Lite KI-Bilder mit Schlussfolgern, Online-Kontext, referenzbewusster Bearbeitung und professionellen Layouts verbessert.',
      twitterDescription:
        'Entdecken Sie Seedream 5.0 Lite für KI-Bilder mit Schlussfolgern, Online-Kontext und professionellen Design-Abläufen.',
    },
    related: {
      text:
        'Vergleichen Sie Seedream 5.0 Lite mit weiteren Toolaze Bildmodellen, wenn Sie einen anderen Schwerpunkt bei Generierung, Bearbeitung, Referenzen oder hoher Auflösung brauchen.',
    },
    youtube: {
      examples: [
        { text: 'Ein praxisnaher Creator-Test zu Ausgabequalität und Bildgenerierung mit Seedream 5.0 Lite.' },
        { text: 'Ein öffentliches Überblicksvideo dazu, wie Seedream 5.0 Lite KI-Bildabläufe verändert.' },
        { text: 'Ein kurzes Launch-Video zu Seedream 5.0 Lite im ModelArk API-Ablauf.' },
      ],
    },
    x: {
      items: [
        { body: 'BytePlus stellt Seedream 5.0 Lite als nächste Generation der KI-Bilderstellung vor.' },
        { body: 'BytePlus beschreibt Seedream 5.0 Lite als kompaktes Modell für stärkere visuelle Erstellung.' },
        { body: 'Poe meldet Seedream 5.0 Lite als hochpräzises Bildmodell mit mehrstufigem visuellen Schlussfolgern und genauer Steuerung.' },
        { body: 'Seedream 5.0 Lite erreicht einen geteilten Top-5-Platz in der Multi-Image Edit Arena.' },
        { body: 'fal hebt zum Day-Zero-Start Deep Thinking und integrierte Online-Suche für Seedream 5.0 Lite hervor.' },
      ],
    },
    faq: { title: 'Häufige Fragen zu Seedream 5.0 Lite' },
  },
  ja: {
    metadata: {
      openGraphDescription:
        'Seedream 5.0 Liteが推論、オンライン検索文脈、参照を使う編集、プロ向けレイアウトでAI画像生成をどう強化するかを確認できます。',
      twitterDescription:
        '推論重視のAI画像生成、オンライン検索文脈、プロ向けデザインワークフローにSeedream 5.0 Liteを活用できます。',
    },
    related: {
      text:
        '生成、編集、参照制御、高解像度出力のバランスを変えたい場合は、Seedream 5.0 Liteを他のToolaze画像モデルページと比較してください。',
    },
    youtube: {
      examples: [
        { text: 'Seedream 5.0 Liteの出力品質と実用的な画像生成挙動を扱うクリエイターの実機レビューです。' },
        { text: 'Seedream 5.0 LiteがAI画像生成ワークフローをどう変えるかを説明する公開概要動画です。' },
        { text: 'ModelArk APIワークフローを通じてSeedream 5.0 Liteを紹介する短いローンチ動画です。' },
      ],
    },
    x: {
      items: [
        { body: 'BytePlusはSeedream 5.0 LiteをAI画像制作の次世代モデルとして紹介しています。' },
        { body: 'BytePlusはSeedream 5.0 Liteを、より強いビジュアル制作向けのコンパクトなモデルとして説明しています。' },
        { body: 'Poeでは、Seedream 5.0 Liteが多段階の視覚推論と精密制御に対応する高忠実度画像生成モデルとして紹介されています。' },
        { body: 'Seedream 5.0 LiteはMulti-Image Edit Arenaで同率トップ5に入っています。' },
        { body: 'falの公開投稿では、Seedream 5.0 LiteのDeep Thinkingと組み込みオンライン検索が強調されています。' },
      ],
    },
    faq: { title: 'Seedream 5.0 Lite よくある質問' },
  },
  es: {
    metadata: {
      openGraphDescription:
        'Descubre cómo Seedream 5.0 Lite mejora la generación de imágenes AI con razonamiento, contexto online, edición con referencias y layouts profesionales.',
      twitterDescription:
        'Explora Seedream 5.0 Lite para imágenes AI con razonamiento, contexto online y flujos de diseño profesional.',
    },
    related: {
      text:
        'Compara Seedream 5.0 Lite con otros modelos de imagen de Toolaze cuando necesites otro equilibrio entre generación, edición, referencias o salida de alta resolución.',
    },
    youtube: {
      examples: [
        { text: 'Una reseña práctica de creador centrada en la calidad de salida y el comportamiento real de Seedream 5.0 Lite.' },
        { text: 'Un video público que explica cómo Seedream 5.0 Lite cambia los flujos de generación de imágenes AI.' },
        { text: 'Un video breve de lanzamiento que presenta Seedream 5.0 Lite mediante el flujo de ModelArk API.' },
      ],
    },
    x: {
      items: [
        { body: 'BytePlus presenta Seedream 5.0 Lite como la nueva generación de creación de imágenes AI.' },
        { body: 'BytePlus describe Seedream 5.0 Lite como un modelo compacto para una creación visual más potente.' },
        { body: 'Poe anuncia Seedream 5.0 Lite como modelo de alta fidelidad con razonamiento visual por pasos y control preciso.' },
        { body: 'Seedream 5.0 Lite empata en el top 5 de Multi-Image Edit Arena.' },
        { body: 'fal destaca el lanzamiento inmediato de Seedream 5.0 Lite con Deep Thinking y búsqueda online integrada.' },
      ],
    },
  },
  'zh-TW': {
    metadata: {
      openGraphDescription:
        '了解 Seedream 5.0 Lite 如何透過推理、線上搜尋脈絡、參考導向編輯與專業視覺排版，提升 AI 圖像生成。',
      twitterDescription:
        '探索 Seedream 5.0 Lite 在推理型 AI 圖像生成、線上搜尋脈絡與專業圖像設計流程中的用途。',
    },
    related: {
      text:
        '當你需要不同的生成、編輯、參考控制或高解析度輸出平衡時，可將 Seedream 5.0 Lite 與 Toolaze 其他圖像模型頁比較。',
    },
    youtube: {
      examples: [
        { text: '創作者實測 Seedream 5.0 Lite 的輸出品質與實際圖像生成表現。' },
        { text: '公開概覽影片，說明 Seedream 5.0 Lite 如何改變 AI 圖像生成流程。' },
        { text: '透過 ModelArk API 流程介紹 Seedream 5.0 Lite 的短版發布影片。' },
      ],
    },
    x: {
      items: [
        { body: 'BytePlus 將 Seedream 5.0 Lite 介紹為新一代 AI 圖像創作模型。' },
        { body: 'BytePlus 說明 Seedream 5.0 Lite 是面向更強視覺創作的精簡模型。' },
        { body: 'Poe 宣布 Seedream 5.0 Lite 可用，並描述其具備高保真圖像生成、多步驟視覺推理與精準控制能力。' },
        { body: 'Seedream 5.0 Lite 在 Multi-Image Edit Arena 並列前五名。' },
        { body: 'fal 在首日發布中強調 Seedream 5.0 Lite 的 Deep Thinking 與內建線上搜尋。' },
      ],
    },
  },
  pt: {
    metadata: {
      openGraphDescription:
        'Veja como o Seedream 5.0 Lite melhora a geração de imagens AI com raciocínio, contexto de busca online, edição por referência e layouts profissionais.',
      twitterDescription:
        'Explore Seedream 5.0 Lite para imagens AI com raciocínio, contexto online e fluxos de design profissional.',
    },
    related: {
      text:
        'Compare o Seedream 5.0 Lite com outros modelos de imagem do Toolaze quando precisar de outro equilíbrio entre geração, edição, referências ou saída em alta resolução.',
    },
    youtube: {
      examples: [
        { text: 'Uma análise prática de criador sobre qualidade de saída e comportamento real do Seedream 5.0 Lite.' },
        { text: 'Um vídeo público que explica como o Seedream 5.0 Lite muda os fluxos de geração de imagens AI.' },
        { text: 'Um vídeo curto de lançamento apresentando o Seedream 5.0 Lite pelo fluxo ModelArk API.' },
      ],
    },
    x: {
      items: [
        { body: 'A BytePlus apresenta o Seedream 5.0 Lite como a próxima geração de criação de imagens AI.' },
        { body: 'A BytePlus descreve o Seedream 5.0 Lite como um modelo compacto para criação visual mais forte.' },
        { body: 'A Poe anuncia o Seedream 5.0 Lite como modelo de alta fidelidade com raciocínio visual em etapas e controle preciso.' },
        { body: 'O Seedream 5.0 Lite empata no top 5 da Multi-Image Edit Arena.' },
        { body: 'A fal destaca o lançamento imediato do Seedream 5.0 Lite com Deep Thinking e busca online integrada.' },
      ],
    },
  },
  fr: {
    metadata: {
      openGraphDescription:
        'Découvrez comment Seedream 5.0 Lite améliore la génération d’images AI avec raisonnement, contexte en ligne, édition par référence et layouts professionnels.',
      twitterDescription:
        'Explorez Seedream 5.0 Lite pour des images AI avec raisonnement, contexte en ligne et workflows de design professionnel.',
    },
    related: {
      text:
        'Comparez Seedream 5.0 Lite aux autres modèles d’image Toolaze lorsque vous cherchez un autre équilibre entre génération, édition, références ou sortie haute résolution.',
    },
    youtube: {
      examples: [
        { text: 'Un test pratique de créateur centré sur la qualité de sortie et le comportement de génération de Seedream 5.0 Lite.' },
        { text: 'Une vidéo publique expliquant comment Seedream 5.0 Lite modifie les workflows de génération d’images AI.' },
        { text: 'Une courte vidéo de lancement présentant Seedream 5.0 Lite via le flux ModelArk API.' },
      ],
    },
    x: {
      items: [
        { body: 'BytePlus présente Seedream 5.0 Lite comme la nouvelle génération de création d’images AI.' },
        { body: 'BytePlus décrit Seedream 5.0 Lite comme un modèle compact pour une création visuelle plus puissante.' },
        { body: 'Poe annonce Seedream 5.0 Lite comme modèle haute fidélité avec raisonnement visuel par étapes et contrôle précis.' },
        { body: 'Seedream 5.0 Lite se classe ex aequo dans le top 5 de Multi-Image Edit Arena.' },
        { body: 'fal met en avant le lancement immédiat de Seedream 5.0 Lite avec Deep Thinking et recherche en ligne intégrée.' },
      ],
    },
    faq: { title: 'Questions fréquentes sur Seedream 5.0 Lite' },
  },
  ko: {
    metadata: {
      openGraphDescription:
        'Seedream 5.0 Lite가 추론, 온라인 검색 맥락, 참조 기반 편집, 전문 레이아웃으로 AI 이미지 생성을 어떻게 개선하는지 확인하세요.',
      twitterDescription:
        '추론 중심 AI 이미지 생성, 온라인 검색 맥락, 전문 디자인 워크플로에 Seedream 5.0 Lite를 활용하세요.',
    },
    related: {
      text:
        '생성, 편집, 참조 제어, 고해상도 출력의 균형이 다르게 필요할 때 Seedream 5.0 Lite를 다른 Toolaze 이미지 모델 페이지와 비교하세요.',
    },
    youtube: {
      examples: [
        { text: 'Seedream 5.0 Lite의 출력 품질과 실제 이미지 생성 동작을 다룬 크리에이터 실사용 리뷰입니다.' },
        { text: 'Seedream 5.0 Lite가 AI 이미지 생성 워크플로를 어떻게 바꾸는지 설명하는 공개 개요 영상입니다.' },
        { text: 'ModelArk API 흐름을 통해 Seedream 5.0 Lite를 소개하는 짧은 출시 영상입니다.' },
      ],
    },
    x: {
      items: [
        { body: 'BytePlus는 Seedream 5.0 Lite를 차세대 AI 이미지 제작 모델로 소개합니다.' },
        { body: 'BytePlus는 Seedream 5.0 Lite를 더 강한 시각 제작을 위한 컴팩트 모델로 설명합니다.' },
        { body: 'Poe는 Seedream 5.0 Lite를 다단계 시각 추론과 정밀 제어를 갖춘 고충실도 이미지 생성 모델로 소개합니다.' },
        { body: 'Seedream 5.0 Lite는 Multi-Image Edit Arena에서 공동 5위권에 올랐습니다.' },
        { body: 'fal은 Seedream 5.0 Lite의 즉시 출시와 함께 Deep Thinking 및 내장 온라인 검색을 강조합니다.' },
      ],
    },
    faq: { title: 'Seedream 5.0 Lite 자주 묻는 질문' },
  },
  it: {
    metadata: {
      openGraphDescription:
        'Scopri come Seedream 5.0 Lite migliora la generazione di immagini AI con ragionamento, contesto online, editing con riferimenti e layout professionali.',
      twitterDescription:
        'Esplora Seedream 5.0 Lite per immagini AI con ragionamento, contesto online e workflow di design professionale.',
    },
    related: {
      text:
        'Confronta Seedream 5.0 Lite con altri modelli immagine Toolaze quando ti serve un diverso equilibrio tra generazione, editing, riferimenti o output ad alta risoluzione.',
    },
    youtube: {
      examples: [
        { text: 'Una recensione pratica di creator sulla qualità di output e sul comportamento reale di Seedream 5.0 Lite.' },
        { text: 'Un video pubblico che spiega come Seedream 5.0 Lite cambia i workflow di generazione immagini AI.' },
        { text: 'Un breve video di lancio che presenta Seedream 5.0 Lite tramite il workflow ModelArk API.' },
      ],
    },
    x: {
      items: [
        { body: 'BytePlus presenta Seedream 5.0 Lite come la nuova generazione della creazione di immagini AI.' },
        { body: 'BytePlus descrive Seedream 5.0 Lite come modello compatto per una creazione visuale più forte.' },
        { body: 'Poe annuncia Seedream 5.0 Lite come modello ad alta fedeltà con ragionamento visuale a più passaggi e controllo preciso.' },
        { body: 'Seedream 5.0 Lite entra a pari merito nella top 5 della Multi-Image Edit Arena.' },
        { body: 'fal evidenzia il lancio immediato di Seedream 5.0 Lite con Deep Thinking e ricerca online integrata.' },
      ],
    },
    faq: { title: 'Domande frequenti su Seedream 5.0 Lite' },
  },
}

function normalizeLocale(locale: string): Seedream50LiteLocale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return SEEDREAM_5_0_LITE_LOCALES.includes(locale as Seedream50LiteLocale)
    ? (locale as Seedream50LiteLocale)
    : 'en'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base) && Array.isArray(override)) {
    const length = Math.max(base.length, override.length)
    return Array.from({ length }, (_, index) => {
      const baseItem = base[index]
      const overrideItem = override[index]
      if (baseItem === undefined) return overrideItem
      if (overrideItem === undefined) return baseItem
      return isRecord(baseItem) && isRecord(overrideItem) ? deepMerge(baseItem, overrideItem) : overrideItem
    }) as T
  }

  if (!isRecord(base) || !isRecord(override)) {
    return (override ?? base) as T
  }
  const merged: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    const current = merged[key]
    merged[key] =
      (isRecord(current) && isRecord(value)) || (Array.isArray(current) && Array.isArray(value))
        ? deepMerge(current, value)
        : value
  }
  return merged as T
}

function mergeCopy(base: Seedream50LiteLandingCopy, override?: DeepPartial<Seedream50LiteLandingCopy>) {
  if (!override) return base
  return deepMerge(base, override)
}

export function getSeedream50LiteLandingCopy(locale: string): Seedream50LiteLandingCopy {
  const normalized = normalizeLocale(locale)
  const copy = mergeCopy(
    mergeCopy(
      mergeCopy(
        mergeCopy(en, localeOverrides[normalized]),
        localizedContentOverrides[normalized],
      ),
      localizedSectionComplements[normalized],
    ),
    localizedVisibleComplements[normalized],
  )

  return {
    ...copy,
    comparison: {
      ...copy.comparison,
      rows: buildComparisonRows(comparisonCapabilityLabels[normalized], comparisonRowValues[normalized]),
    },
  }
}

export function getSeedream50LitePageMetadata(
  locale: string,
  canonicalUrl = 'https://toolaze.com/model/seedream-5-0-lite',
): Metadata {
  const copy = getSeedream50LiteLandingCopy(locale)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: copy.metadata.title,
      description: copy.metadata.openGraphDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.metadata.title,
      description: copy.metadata.twitterDescription,
    },
  }
}
