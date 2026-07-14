import type { Metadata } from 'next'

export const SEEDREAM_5_0_PRO_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

type Seedream50ProLocale = (typeof SEEDREAM_5_0_PRO_LOCALES)[number]

type FeatureItem = {
  title: string
  text: string
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
  pro: string
  lite: string
}

type PromptExample = {
  title: string
  prompt: string
  slot: string
}

type FaqItem = {
  q: string
  a: string
}

export type Seedream50ProLandingCopy = {
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
    statusLabel: string
    liveModelLabel: string
    liveModelValue: string
  }
  notice: {
    title: string
    text: string
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
  comparison: {
    title: string
    text: string
    headers: {
      capability: string
      pro: string
      lite: string
    }
    rows: ComparisonRow[]
    note: string
  }
  gallery: {
    title: string
    text: string
    examples: GalleryItem[]
  }
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
  useCases: {
    title: string
    text: string
    items: string[]
  }
  related: {
    title: string
    text: string
    tryNow: string
    links: Array<{ title: string; href: string; text: string }>
  }
  image: {
    container: string
  }
  faq: {
    title: string
    items: FaqItem[]
  }
  cta: {
    label: string
    title: string
    text: string
    button: string
  }
}

type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

const en: Seedream50ProLandingCopy = {
  metadata: {
    title: 'Seedream 5.0 Pro AI Image Generator Coming Soon | Toolaze',
    description:
      'Explore Seedream 5.0 Pro capabilities, cinematic image workflows, precision editing, layered composition, and commercial visual examples.',
    openGraphDescription:
      'Explore Seedream 5.0 Pro capabilities for cinematic generation, precision editing, and commercial image workflows.',
    twitterDescription:
      'Explore Seedream 5.0 Pro cinematic image generation, editing, and structured visual workflows.',
  },
  breadcrumbs: {
    home: 'Home',
    model: 'Model',
    current: 'Seedream 5.0 Pro',
  },
  schema: {
    pageName: 'Seedream 5.0 Pro AI Image Generator',
    appName: 'Seedream 5.0 Pro on Toolaze',
    howToName: 'How to prepare Seedream 5.0 Pro style images on Toolaze',
  },
  hero: {
    modelName: 'Seedream 5.0 Pro',
    suffix: 'AI Image Generator Coming Soon',
    description:
      'Seedream 5.0 Pro is ByteDance Seedream’s upcoming cinematic image generation and editing model for polished campaign visuals, structured scene edits, brand images, ecommerce assets, and video frame creation.',
    statusLabel: 'Model preview',
    liveModelLabel: 'Preview workflow',
    liveModelValue: 'Seedream 5.0 Lite',
  },
  notice: {
    title: 'What Seedream 5.0 Pro is designed for',
    text:
      'Seedream 5.0 Pro focuses on cinematic generation, precision editing, multi-layer scene control, built-in research, and reasoning-based composition for commercial and creative image production.',
  },
  whatIs: {
    title: 'What is Seedream 5.0 Pro?',
    paragraphs: [
      'Seedream 5.0 Pro is a cinematic AI image generator and editing model for commercial visuals, structured scene edits, brand images, ecommerce assets, and video frame creation.',
      'The Pro positioning is different from a simple prompt-to-image page: it emphasizes precise edits, layered visual control, research-aware outputs, and stronger reasoning for complex image composition.',
    ],
  },
  features: {
    title: 'Seedream 5.0 Pro capabilities',
    text:
      'These capabilities explain how Seedream 5.0 Pro supports cinematic, commercial, and structured image work.',
    items: [
      {
        title: 'Cinematic image generation',
        text:
          'Use Pro planning for polished campaign visuals, hero posters, social images, and frame-like compositions that need a finished art-direction feel.',
        slot: 'feature-cinematic-generation',
        label: 'Cinematic campaign image created for Seedream 5.0 Pro page',
      },
      {
        title: 'Precision editing and accuracy control',
        text:
          'Pinpoint edits make Pro relevant for changing details while keeping the wider subject, layout, or commercial scene intact.',
        slot: 'feature-precision-editing',
        label: 'Precision image editing example for Seedream 5.0 Pro',
      },
      {
        title: 'Multi-layer visual control',
        text:
          'Seedream 5.0 Pro is positioned for structured scene editing where foreground subjects, products, backgrounds, and design elements need coordinated control.',
        slot: 'feature-multilayer-control',
        label: 'Layered commercial scene control example',
      },
      {
        title: 'Reasoning-based composition',
        text:
          'The Pro story emphasizes stronger planning for complex visuals, helping prompts turn into coherent posters, product scenes, and design-ready drafts.',
        slot: 'feature-reasoning-composition',
        label: 'Reasoning-based image composition example',
      },
    ],
  },
  comparison: {
    title: 'Seedream 5.0 Pro vs Seedream 5.0 Lite',
    text:
      'Use this comparison to understand where Pro expands the Seedream 5.0 workflow.',
    headers: {
      capability: 'Capability',
      pro: 'Seedream 5.0 Pro',
      lite: 'Seedream 5.0 Lite',
    },
    rows: [
      {
        capability: 'Workflow role',
        pro: 'Advanced model for cinematic, commercial, and structured image work.',
        lite: 'Fast model for everyday image creation and lightweight creative experiments.',
      },
      {
        capability: 'Creative depth',
        pro: 'Better suited to complex scenes, design systems, campaign compositions, and precise editing plans.',
        lite: 'Better suited to quick prompt testing, simple social drafts, and lower-friction image production.',
      },
      {
        capability: 'Model focus',
        pro: 'Cinematic generation, precision editing, multi-layer control, online research, and reasoning-based composition.',
        lite: 'Fast everyday image creation and lightweight creative experiments.',
      },
      {
        capability: 'Commercial fit',
        pro: 'Campaign visuals, ecommerce scenes, brand systems, social creative, and video frame planning.',
        lite: 'Quick concepts, prompt testing, social drafts, and lightweight image production.',
      },
    ],
    note:
      'This comparison focuses on the model’s creative direction, use cases, and prompt planning for Seedream 5.0 Pro workflows.',
  },
  gallery: {
    title: 'Seedream 5.0 Pro image ideas',
    text:
      'Explore common commercial and cinematic output directions for Seedream 5.0 Pro.',
    examples: [
      {
        title: 'Ad campaign key visual',
        text: 'A premium poster-style product visual with cinematic lighting and clear brand-safe composition.',
        slot: 'gallery-ad-campaign',
      },
      {
        title: 'Ecommerce brand scene',
        text: 'A polished product environment with controlled materials, lighting, and shopping-ready detail.',
        slot: 'gallery-ecommerce-branding',
      },
      {
        title: 'Social media hero image',
        text: 'A creator-friendly image with strong subject focus, clean negative space, and campaign-ready color.',
        slot: 'gallery-social-key-visual',
      },
      {
        title: 'Video frame concept',
        text: 'A cinematic still that can guide image-to-video planning or storyboard development.',
        slot: 'gallery-video-frame',
      },
    ],
  },
  howTo: {
    title: 'How to plan Seedream 5.0 Pro images',
    steps: [
      'Write prompts that describe the final commercial image, not internal model details.',
      'Use aspect ratio and resolution settings that match the channel you plan to publish on.',
      'Give the model concrete subject, scene, lighting, material, and composition requirements.',
      'Keep brand names fictional unless you have the right to use the real brand.',
      'Save strong prompt structures for campaign visuals, ecommerce scenes, social posts, and video-frame planning.',
    ],
  },
  prompts: {
    title: 'Prompt examples for Seedream 5.0 Pro style planning',
    text:
      'Use these examples as starting points for Seedream 5.0 Pro style image planning.',
    copyButton: 'Copy prompt',
    copiedButton: 'Copied',
    examples: [
      {
        title: 'Cinematic product ad',
        prompt:
          'Create a cinematic product advertisement for a premium sparkling tea can on a reflective studio surface, dramatic side lighting, citrus slices, clean headline space, realistic condensation, refined commercial photography, no real brand logo.',
        slot: 'prompt-product-ad',
      },
      {
        title: 'Structured scene edit',
        prompt:
          'Create a layered fashion editorial scene with a model in the foreground, textured wall background, warm rim light, product display table on the right, clear negative space for copy, coherent shadows, premium magazine composition.',
        slot: 'prompt-scene-edit',
      },
      {
        title: 'Brand visual system',
        prompt:
          'Create a brand campaign image for a fictional skincare line named Luma C, hero bottle, ingredient textures, three clean callout areas, soft peach and pearl palette, realistic product detail, polished ecommerce style.',
        slot: 'prompt-brand-system',
      },
    ],
  },
  useCases: {
    title: 'Best use cases',
    text:
      'Seedream 5.0 Pro fits teams that need richer visual direction rather than one-off decorative images.',
    items: [
      'Marketing and advertising concepts with polished campaign composition.',
      'Branding and ecommerce visuals that need consistent product presentation.',
      'Social media images with strong hooks, clear subjects, and platform-ready framing.',
      'Video frame generation and storyboard stills for image-to-video planning.',
      'Precision image edits where the subject, layout, and scene need to stay coherent.',
      'Creative review drafts for designers, product marketers, and content teams.',
    ],
  },
  related: {
    title: 'Recommended image models',
    text: 'Try other Toolaze image models when you want faster drafts, earlier Seedream workflows, or adjacent high-quality image generation.',
    tryNow: 'Open model',
    links: [
      {
        title: 'Seedream 5.0 Lite',
        href: '/model/seedream-5-0-lite',
        text: 'Explore the lighter Seedream 5.0 workflow for fast image generation and creative drafts.',
      },
      {
        title: 'Seedream 4.5',
        href: '/model/seedream-4-5',
        text: 'Create commercial product visuals, typography layouts, and reference-guided image edits.',
      },
      {
        title: 'Wan 2.7 Image',
        href: '/model/wan-2-7-image',
        text: 'Try structured image generation, multi-reference prompts, and text-rich visual drafts.',
      },
    ],
  },
  image: {
    container: 'Generated page asset',
  },
  faq: {
    title: 'Seedream 5.0 Pro FAQ',
    items: [
      {
        q: 'What is Seedream 5.0 Pro designed for?',
        a: 'Seedream 5.0 Pro is designed around cinematic image generation, precision editing, multi-layer visual control, built-in online research, and reasoning-based composition.',
      },
      {
        q: 'What kinds of images fit Seedream 5.0 Pro best?',
        a: 'It fits campaign visuals, ecommerce scenes, brand systems, social creative, structured edits, and cinematic stills for video planning.',
      },
      {
        q: 'How should I write prompts for Seedream 5.0 Pro?',
        a: 'Describe the final output clearly: subject, setting, lighting, camera angle, material details, layout needs, and any text or negative space requirements.',
      },
      {
        q: 'Can Seedream 5.0 Pro help with brand and ecommerce visuals?',
        a: 'Yes. Its positioning makes it relevant for polished product scenes, campaign key visuals, controlled materials, and repeatable brand-style concepts.',
      },
    ],
  },
  cta: {
    label: 'Plan your prompt',
    title: 'Prepare stronger Seedream 5.0 Pro image prompts',
    text:
      'Use the examples on this page to structure campaign visuals, product scenes, social posts, and cinematic stills for Seedream 5.0 Pro.',
    button: 'Explore prompt examples',
  },
}

const simpleOverrides: Record<Exclude<Seedream50ProLocale, 'en'>, DeepPartial<Seedream50ProLandingCopy>> = {
  de: {
    metadata: {
      title: 'Seedream 5.0 Pro KI-Bildgenerator bald verfügbar | Toolaze',
      description:
        'Entdecke Seedream 5.0 Pro Funktionen und kreative Workflows. Seedream 5.0 Pro ist auf Toolaze bald verfügbar; erstelle jetzt Bilder mit Seedream 5.0 Lite.',
      openGraphDescription: 'Seedream 5.0 Pro ist auf Toolaze bald verfügbar. Nutze heute Seedream 5.0 Lite.',
      twitterDescription: 'Seedream 5.0 Pro ist bald verfügbar. Starte inzwischen mit Seedream 5.0 Lite.',
    },
    breadcrumbs: { home: 'Startseite', model: 'Modell', current: 'Seedream 5.0 Pro' },
    hero: {
      suffix: 'KI-Bildgenerator bald verfügbar',
      description:
        'Seedream 5.0 Pro ist ein kommendes Modell für filmische Bildgenerierung und Bearbeitung. Toolaze bereitet Pro-Zugang vor; der Generator unten nutzt aktuell Seedream 5.0 Lite.',
      statusLabel: 'Pro-Status: bald verfügbar',
      liveModelLabel: 'Jetzt verfügbar',
    },
    notice: {
      title: 'Seedream 5.0 Pro kommt bald zu Toolaze',
      text: 'Die offizielle Positionierung betont filmische Generierung, präzise Bearbeitung, mehrschichtige Szenenkontrolle, Recherche und reasoning-basierte Komposition.',
    },
    whatIs: {
      title: 'Was ist Seedream 5.0 Pro?',
      paragraphs: [
        'Seedream 5.0 Pro wird als filmischer KI-Bildgenerator und Bearbeitungstool für Werbemotive, strukturierte Szenen, Markenbilder, E-Commerce und Videoframes vorgestellt.',
        'Pro hebt präzise Bearbeitung, visuelle Ebenenkontrolle und stärkere Planung komplexer Kompositionen hervor.',
      ],
    },
    features: {
      title: 'Offizielle Fähigkeiten im Blick',
      text: 'Zusammenfassung öffentlicher Angaben, ohne Pro als bereits live auf Toolaze darzustellen.',
      items: [
        {
          title: 'Filmische Bildgenerierung',
          text: 'Plane mit Pro hochwertige Kampagnenmotive, Hero-Poster, Social-Bilder und frameartige Kompositionen mit klarer Art Direction.',
          slot: 'feature-cinematic-generation',
          label: 'Filmisches Kampagnenbild für die Seedream 5.0 Pro Seite',
        },
        {
          title: 'Präzise Bearbeitung und Genauigkeitskontrolle',
          text: 'Die offizielle Kommunikation betont gezielte Änderungen, bei denen Motiv, Layout und kommerzielle Szene erhalten bleiben.',
          slot: 'feature-precision-editing',
          label: 'Beispiel für präzise Bildbearbeitung mit Seedream 5.0 Pro',
        },
        {
          title: 'Mehrschichtige visuelle Kontrolle',
          text: 'Seedream 5.0 Pro eignet sich laut Positionierung für strukturierte Szenen mit koordiniertem Vordergrund, Produkt, Hintergrund und Designelementen.',
          slot: 'feature-multilayer-control',
          label: 'Beispiel für mehrschichtige Szenenkontrolle',
        },
        {
          title: 'Komposition auf Basis von Reasoning',
          text: 'Die Pro-Positionierung legt Wert auf stärkere Planung für komplexe Bilder, damit Prompts zu stimmigen Postern, Produktszenen und Designentwürfen werden.',
          slot: 'feature-reasoning-composition',
          label: 'Beispiel für reasoning-basierte Bildkomposition',
        },
      ],
    },
    comparison: {
      title: 'Seedream 5.0 Pro vs. Seedream 5.0 Lite auf Toolaze',
      text: 'Wähle den passenden Workflow, während Pro vorbereitet wird.',
      headers: { capability: 'Fähigkeit', pro: 'Seedream 5.0 Pro', lite: 'Seedream 5.0 Lite' },
      rows: [
        {
          capability: 'Verfügbarkeit auf Toolaze',
          pro: 'Bald verfügbar. Toolaze stellt Pro noch nicht als live dar.',
          lite: 'Im Generator auf dieser Seite verfügbar.',
        },
        {
          capability: 'Beste aktuelle Aktion',
          pro: 'Fähigkeiten prüfen und Prompts für die kommende Pro-Nutzung vorbereiten.',
          lite: 'Sofort Bildentwürfe mit Text-zu-Bild-Workflows erzeugen.',
        },
        {
          capability: 'Offizielle Positionierung',
          pro: 'Filmische Generierung, präzise Bearbeitung, mehrschichtige Kontrolle, Online-Recherche und reasoning-basierte Komposition.',
          lite: 'Schnelle alltägliche Bildkreation und leichte Kreativexperimente.',
        },
        {
          capability: 'Kommerzieller Einsatz',
          pro: 'Kampagnenbilder, E-Commerce-Szenen, Markensysteme, Social Creatives und Videoframe-Planung.',
          lite: 'Schnelle Konzepte, Prompt-Tests, Social-Entwürfe und leichte Bildproduktion.',
        },
      ],
      note: 'Toolaze veröffentlicht keine unbestätigten Pro-Limits. Verifizierte Einstellungen werden nach Verfügbarkeit ergänzt.',
    },
    gallery: {
      title: 'Bildideen für Seedream 5.0 Pro',
      text: 'Diese Beispiele zeigen kommerzielle und filmische Ergebnisse, auf die diese Seite vorbereitet ist.',
      examples: [
        { title: 'Key Visual für Anzeigenkampagnen', text: 'Ein hochwertiges Produktmotiv im Poster-Stil mit filmischem Licht und markensicherer Komposition.', slot: 'gallery-ad-campaign' },
        { title: 'E-Commerce-Markenszene', text: 'Eine ausgearbeitete Produktumgebung mit kontrollierten Materialien, Licht und verkaufsstarken Details.', slot: 'gallery-ecommerce-branding' },
        { title: 'Hero-Bild für Social Media', text: 'Ein creator-freundliches Bild mit starkem Motivfokus, sauberer Freifläche und kampagnentauglicher Farbe.', slot: 'gallery-social-key-visual' },
        { title: 'Videoframe-Konzept', text: 'Ein filmischer Still, der Bild-zu-Video-Planung oder Storyboard-Entwicklung unterstützen kann.', slot: 'gallery-video-frame' },
      ],
    },
    howTo: {
      title: 'So nutzt du diese Seite vor dem Pro-Start',
      steps: [
        'Starte im Generator oben mit Seedream 5.0 Lite.',
        'Beschreibe im Prompt das endgültige kommerzielle Bild statt interner Modelldetails.',
        'Wähle Seitenverhältnis und Auflösung passend zum geplanten Veröffentlichungskanal.',
        'Speichere starke Lite-Entwürfe und nutze die besten Prompt-Strukturen später erneut für Pro.',
        'Prüfe diese Seite auf Toolaze-Updates zur Pro-Verfügbarkeit, bevor du produktiv arbeitest.',
      ],
    },
    prompts: {
      title: 'Prompt-Beispiele für die Pro-Planung',
      text: 'Nutze sie heute mit Seedream 5.0 Lite und verfeinere sie später für Pro.',
      copyButton: 'Prompt kopieren',
      copiedButton: 'Kopiert',
      examples: [
        { title: 'Filmische Produktanzeige', prompt: 'Erstelle eine filmische Produktanzeige für eine hochwertige Sprudeltee-Dose auf einer reflektierenden Studiofläche, dramatisches Seitenlicht, Zitrusscheiben, sauberer Bereich für Überschrift, realistische Kondensation, edle Werbefotografie, kein echtes Markenlogo.', slot: 'prompt-product-ad' },
        { title: 'Strukturierte Szenenbearbeitung', prompt: 'Erstelle eine mehrschichtige Fashion-Editorial-Szene mit Model im Vordergrund, strukturierter Wand im Hintergrund, warmem Rim Light, Produkttisch rechts, klarer Freifläche für Text, stimmigen Schatten und hochwertiger Magazin-Komposition.', slot: 'prompt-scene-edit' },
        { title: 'Visuelles Markensystem', prompt: 'Erstelle ein Kampagnenbild für eine fiktive Hautpflegelinie namens Luma C, Hero-Flasche, Inhaltsstoff-Texturen, drei saubere Hinweisbereiche, weiche Pfirsich- und Perlmuttpalette, realistische Produktdetails, polierter E-Commerce-Stil.', slot: 'prompt-brand-system' },
      ],
    },
    useCases: {
      title: 'Beste Anwendungsfälle',
      text: 'Interessant für Teams, die reichere visuelle Richtung brauchen.',
      items: [
        'Marketing- und Anzeigenkonzepte mit ausgearbeiteter Kampagnenkomposition.',
        'Branding- und E-Commerce-Visuals mit konsistenter Produktpräsentation.',
        'Social-Media-Bilder mit starkem Hook, klarem Motiv und plattformgerechtem Format.',
        'Videoframe-Generierung und Storyboard-Stills für Bild-zu-Video-Planung.',
        'Präzise Bildbearbeitungen, bei denen Motiv, Layout und Szene stimmig bleiben müssen.',
        'Kreative Review-Entwürfe für Design-, Produktmarketing- und Content-Teams.',
      ],
    },
    related: {
      title: 'Empfohlene Bildmodelle',
      text: 'Teste weitere Toolaze-Bildmodelle für schnelle Entwürfe, frühere Seedream-Workflows oder ähnliche hochwertige Bildgenerierung.',
      tryNow: 'Modell öffnen',
      links: [
        { title: 'Seedream 5.0 Lite', href: '/model/seedream-5-0-lite', text: 'Nutze den aktuell verfügbaren Seedream 5.0 Lite Workflow für schnelle Bildgenerierung.' },
        { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Erstelle kommerzielle Produktbilder, Typografie-Layouts und referenzgestützte Bildbearbeitungen.' },
        { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Teste strukturierte Bildgenerierung, Multi-Referenz-Prompts und textreiche visuelle Entwürfe.' },
      ],
    },
    faq: {
      title: 'Seedream 5.0 Pro FAQ',
      items: [
        { q: 'Ist Seedream 5.0 Pro jetzt auf Toolaze verfügbar?', a: 'Seedream 5.0 Pro ist auf Toolaze als bald verfügbar markiert. Der Generator auf dieser Seite nutzt aktuell Seedream 5.0 Lite.' },
        { q: 'Warum verwendet der Generator Seedream 5.0 Lite?', a: 'Lite ist heute der verfügbare Seedream 5.0 Workflow auf Toolaze, damit Nutzer Bildentwürfe erstellen können, während Pro vorbereitet wird.' },
        { q: 'Wofür ist Seedream 5.0 Pro gedacht?', a: 'Seedream 5.0 Pro ist für filmische Bildgenerierung, präzise Bearbeitung, mehrschichtige visuelle Kontrolle, integrierte Online-Recherche und reasoning-basierte Komposition gedacht.' },
        { q: 'Kann ich die Prompts auf dieser Seite jetzt verwenden?', a: 'Ja. Du kannst sie heute mit Seedream 5.0 Lite verwenden und später weiter verfeinern, sobald Toolaze Pro-Verfügbarkeit ergänzt.' },
        { q: 'Wird Toolaze genaue Pro-Einstellungen zeigen?', a: 'Ja. Sobald Pro bereit ist, zeigt Toolaze die unterstützten Modi, Ausgabeoptionen und Workflow-Einstellungen direkt auf dieser Seite.' },
      ],
    },
    cta: { label: 'Jetzt mit Lite starten', title: 'Bereite Seedream 5.0 Pro Prompts vor dem Start vor', text: 'Teste heute visuelle Richtungen mit Seedream 5.0 Lite.', button: 'Seedream 5.0 Lite testen' },
  },
  ja: {
    metadata: {
      title: 'Seedream 5.0 Pro AI画像生成 近日公開 | Toolaze',
      description: 'Seedream 5.0 Proの機能とワークフローを確認。Toolazeでは近日公開予定で、現在はSeedream 5.0 Liteで作成できます。',
      openGraphDescription: 'Seedream 5.0 ProはToolazeで近日公開予定です。今はSeedream 5.0 Liteを試せます。',
      twitterDescription: 'Seedream 5.0 Proは近日公開予定。まずはSeedream 5.0 Liteで開始できます。',
    },
    breadcrumbs: { home: 'ホーム', model: 'モデル', current: 'Seedream 5.0 Pro' },
    hero: {
      suffix: 'AI画像生成 近日公開',
      description: 'Seedream 5.0 Proはシネマティックな画像生成と編集向けの近日公開モデルです。ToolazeではPro対応を準備中で、下の生成機能は現在Seedream 5.0 Liteを使用します。',
      statusLabel: 'Proの状態: 近日公開',
      liveModelLabel: '現在利用可能',
    },
    notice: { title: 'Seedream 5.0 ProはToolazeで近日公開予定', text: '公式情報では、シネマティック生成、精密編集、複数レイヤー制御、オンライン調査、推論ベースの構図が強調されています。' },
    whatIs: { title: 'Seedream 5.0 Proとは？' },
    features: { title: '注目すべき公式機能', text: 'ProがToolazeで稼働中だと主張せず、公開情報を要約します。' },
    comparison: { title: 'Seedream 5.0 Pro と Seedream 5.0 Lite', text: 'Pro準備中の最適な使い分けです。', headers: { capability: '機能', pro: 'Seedream 5.0 Pro', lite: 'Seedream 5.0 Lite' } },
    howTo: { title: 'Pro公開前の使い方' },
    prompts: { title: 'Pro向け計画用プロンプト例', text: '今はSeedream 5.0 Liteで使用し、Pro公開後に調整できます。', copyButton: 'プロンプトをコピー', copiedButton: 'コピー済み' },
    useCases: { title: '主な用途' },
    related: { title: 'おすすめ画像モデル', text: '高速な下書き、既存のSeedreamワークフロー、近い用途の高品質画像生成に使えるToolazeモデルです。', tryNow: 'モデルを開く' },
    faq: { title: 'Seedream 5.0 Pro FAQ' },
    cta: { label: 'Liteで開始', title: '公開前にSeedream 5.0 Pro用プロンプトを準備', text: 'Seedream 5.0 Liteで方向性をテストできます。', button: 'Seedream 5.0 Liteを試す' },
  },
  es: {
    metadata: {
      title: 'Seedream 5.0 Pro generador de imágenes IA próximamente | Toolaze',
      description: 'Explora funciones y flujos de Seedream 5.0 Pro. Pro llegará pronto a Toolaze; empieza ahora con Seedream 5.0 Lite.',
      openGraphDescription: 'Seedream 5.0 Pro llegará pronto a Toolaze. Usa Seedream 5.0 Lite hoy.',
      twitterDescription: 'Seedream 5.0 Pro próximamente en Toolaze. Empieza con Seedream 5.0 Lite.',
    },
    breadcrumbs: { home: 'Inicio', model: 'Modelo', current: 'Seedream 5.0 Pro' },
    hero: { suffix: 'generador de imágenes IA próximamente', description: 'Seedream 5.0 Pro es un modelo próximo para generación y edición cinematográfica. Toolaze prepara el acceso Pro; el generador actual usa Seedream 5.0 Lite.', statusLabel: 'Estado Pro: próximamente', liveModelLabel: 'Disponible ahora' },
    notice: { title: 'Seedream 5.0 Pro llegará pronto a Toolaze', text: 'Seedream 5.0 Pro se centra en generación cinematográfica, edición precisa, control por capas, investigación integrada y composición basada en razonamiento.' },
    whatIs: { title: '¿Qué es Seedream 5.0 Pro?' },
    features: { title: 'Funciones clave a seguir', text: 'Estas capacidades explican por qué Pro es relevante para trabajo visual cinematográfico, comercial y estructurado.' },
    comparison: { title: 'Seedream 5.0 Pro vs Seedream 5.0 Lite', text: 'Elige el flujo adecuado mientras Pro se prepara.', headers: { capability: 'Función', pro: 'Seedream 5.0 Pro', lite: 'Seedream 5.0 Lite' } },
    howTo: { title: 'Cómo usar esta página antes del lanzamiento' },
    prompts: { title: 'Prompts para planificar estilo Pro', text: 'Úsalos hoy con Lite y refínalos cuando Pro esté disponible.', copyButton: 'Copiar prompt', copiedButton: 'Copiado' },
    useCases: { title: 'Mejores usos' },
    related: { title: 'Modelos de imagen recomendados', text: 'Prueba otros modelos de Toolaze para borradores rápidos, flujos Seedream anteriores o generación de imagen similar.', tryNow: 'Abrir modelo' },
    faq: { title: 'Preguntas sobre Seedream 5.0 Pro' },
    cta: { label: 'Empieza con Lite', title: 'Prepara prompts de Seedream 5.0 Pro antes del lanzamiento', text: 'Prueba direcciones visuales con Seedream 5.0 Lite.', button: 'Probar Seedream 5.0 Lite' },
  },
  'zh-TW': {
    metadata: {
      title: 'Seedream 5.0 Pro AI 圖像生成器即將推出 | Toolaze',
      description: '查看 Seedream 5.0 Pro 能力與影像工作流。Seedream 5.0 Pro 在 Toolaze 即將推出；目前可先使用 Seedream 5.0 Lite。',
      openGraphDescription: 'Seedream 5.0 Pro 在 Toolaze 即將推出。現在可先使用 Seedream 5.0 Lite。',
      twitterDescription: 'Seedream 5.0 Pro 即將推出；先用 Seedream 5.0 Lite 開始創作。',
    },
    breadcrumbs: { home: '首頁', model: '模型', current: 'Seedream 5.0 Pro' },
    hero: { suffix: 'AI 圖像生成器即將推出', description: 'Seedream 5.0 Pro 是即將推出的電影感圖像生成與編輯模型。Toolaze 正在準備 Pro 支援；下方生成器目前預設使用 Seedream 5.0 Lite。', statusLabel: 'Pro 狀態：即將推出', liveModelLabel: '目前可用' },
    notice: { title: 'Seedream 5.0 Pro 即將在 Toolaze 推出', text: 'Seedream 5.0 Pro 聚焦電影感生成、精準編輯、多層視覺控制、線上研究與基於推理的構圖。' },
    whatIs: { title: 'Seedream 5.0 Pro 是什麼？' },
    features: { title: '值得關注的核心能力', text: '這些能力說明 Pro 為什麼值得用於電影感、商業化與結構化圖片工作。' },
    comparison: { title: 'Seedream 5.0 Pro 與 Seedream 5.0 Lite', text: '在 Pro 準備期間選擇合適流程。', headers: { capability: '能力', pro: 'Seedream 5.0 Pro', lite: 'Seedream 5.0 Lite' } },
    howTo: { title: 'Pro 上線前如何使用此頁' },
    prompts: { title: 'Pro 風格規劃提示詞', text: '現在可用 Lite 測試，Pro 上線後再細化。', copyButton: '複製提示詞', copiedButton: '已複製' },
    useCases: { title: '適合用途' },
    related: { title: '推薦圖像模型', text: '需要快速草稿、既有 Seedream 工作流或相近的高品質圖像生成時，可試用其他 Toolaze 模型。', tryNow: '開啟模型' },
    faq: { title: 'Seedream 5.0 Pro 常見問題' },
    cta: { label: '先用 Lite 開始', title: '在上線前準備 Seedream 5.0 Pro 提示詞', text: '使用 Seedream 5.0 Lite 測試視覺方向。', button: '試用 Seedream 5.0 Lite' },
  },
  pt: {
    metadata: {
      title: 'Seedream 5.0 Pro gerador de imagens IA em breve | Toolaze',
      description: 'Explore recursos e fluxos do Seedream 5.0 Pro. O Pro chega em breve ao Toolaze; comece agora com Seedream 5.0 Lite.',
      openGraphDescription: 'Seedream 5.0 Pro chega em breve ao Toolaze. Use Seedream 5.0 Lite hoje.',
      twitterDescription: 'Seedream 5.0 Pro em breve. Comece com Seedream 5.0 Lite.',
    },
    breadcrumbs: { home: 'Início', model: 'Modelo', current: 'Seedream 5.0 Pro' },
    hero: { suffix: 'gerador de imagens IA em breve', description: 'Seedream 5.0 Pro é um modelo futuro para geração e edição cinematográfica. O Toolaze prepara o acesso Pro; o gerador atual usa Seedream 5.0 Lite.', statusLabel: 'Status Pro: em breve', liveModelLabel: 'Disponível agora' },
    notice: { title: 'Seedream 5.0 Pro chega em breve ao Toolaze', text: 'Seedream 5.0 Pro foca em geração cinematográfica, edição precisa, controle em camadas, pesquisa integrada e composição baseada em raciocínio.' },
    whatIs: { title: 'O que é Seedream 5.0 Pro?' },
    features: { title: 'Recursos principais para acompanhar', text: 'Essas capacidades explicam por que o Pro importa para imagens cinematográficas, comerciais e estruturadas.' },
    comparison: { title: 'Seedream 5.0 Pro vs Seedream 5.0 Lite', text: 'Escolha o fluxo certo enquanto o Pro é preparado.', headers: { capability: 'Recurso', pro: 'Seedream 5.0 Pro', lite: 'Seedream 5.0 Lite' } },
    howTo: { title: 'Como usar antes do lançamento Pro' },
    prompts: { title: 'Prompts para planejar estilo Pro', text: 'Use hoje com Lite e refine quando o Pro estiver disponível.', copyButton: 'Copiar prompt', copiedButton: 'Copiado' },
    useCases: { title: 'Melhores usos' },
    related: { title: 'Modelos de imagem recomendados', text: 'Teste outros modelos do Toolaze para rascunhos rápidos, fluxos Seedream anteriores ou geração de imagem semelhante.', tryNow: 'Abrir modelo' },
    faq: { title: 'FAQ do Seedream 5.0 Pro' },
    cta: { label: 'Comece com Lite', title: 'Prepare prompts do Seedream 5.0 Pro antes do lançamento', text: 'Teste direções visuais com Seedream 5.0 Lite.', button: 'Testar Seedream 5.0 Lite' },
  },
  fr: {
    metadata: {
      title: 'Seedream 5.0 Pro générateur d’images IA bientôt disponible | Toolaze',
      description: 'Découvrez les capacités de Seedream 5.0 Pro. Pro arrive bientôt sur Toolaze; commencez avec Seedream 5.0 Lite.',
      openGraphDescription: 'Seedream 5.0 Pro arrive bientôt sur Toolaze. Essayez Seedream 5.0 Lite dès maintenant.',
      twitterDescription: 'Seedream 5.0 Pro bientôt disponible. Commencez avec Seedream 5.0 Lite.',
    },
    breadcrumbs: { home: 'Accueil', model: 'Modèle', current: 'Seedream 5.0 Pro' },
    hero: { suffix: 'générateur d’images IA bientôt disponible', description: 'Seedream 5.0 Pro est un modèle à venir pour la génération et l’édition cinématographiques. Toolaze prépare l’accès Pro; le générateur utilise actuellement Seedream 5.0 Lite.', statusLabel: 'Statut Pro : bientôt disponible', liveModelLabel: 'Disponible maintenant' },
    notice: { title: 'Seedream 5.0 Pro arrive bientôt sur Toolaze', text: 'Seedream 5.0 Pro se concentre sur la génération cinématographique, l’édition précise, le contrôle visuel multicouche, la recherche intégrée et la composition raisonnée.' },
    whatIs: { title: 'Qu’est-ce que Seedream 5.0 Pro ?' },
    features: { title: 'Capacités clés à suivre', text: 'Ces capacités expliquent pourquoi Pro est utile pour les images cinématographiques, commerciales et structurées.' },
    comparison: { title: 'Seedream 5.0 Pro vs Seedream 5.0 Lite', text: 'Choisissez le bon flux pendant la préparation de Pro.', headers: { capability: 'Capacité', pro: 'Seedream 5.0 Pro', lite: 'Seedream 5.0 Lite' } },
    howTo: { title: 'Utiliser cette page avant Pro' },
    prompts: { title: 'Exemples de prompts pour le style Pro', text: 'Utilisez-les avec Lite maintenant puis affinez-les pour Pro.', copyButton: 'Copier le prompt', copiedButton: 'Copié' },
    useCases: { title: 'Meilleurs usages' },
    related: { title: 'Modèles d’image recommandés', text: 'Essayez d’autres modèles Toolaze pour des brouillons rapides, des workflows Seedream existants ou une génération d’image proche.', tryNow: 'Ouvrir le modèle' },
    faq: { title: 'FAQ Seedream 5.0 Pro' },
    cta: { label: 'Commencer avec Lite', title: 'Préparez vos prompts Seedream 5.0 Pro avant le lancement', text: 'Testez vos directions visuelles avec Seedream 5.0 Lite.', button: 'Essayer Seedream 5.0 Lite' },
  },
  ko: {
    metadata: {
      title: 'Seedream 5.0 Pro AI 이미지 생성기 출시 예정 | Toolaze',
      description: 'Seedream 5.0 Pro 기능과 워크플로를 확인하세요. Toolaze에서는 곧 제공 예정이며 현재는 Seedream 5.0 Lite로 만들 수 있습니다.',
      openGraphDescription: 'Seedream 5.0 Pro는 Toolaze에서 곧 제공됩니다. 지금은 Seedream 5.0 Lite를 사용하세요.',
      twitterDescription: 'Seedream 5.0 Pro 출시 예정. 먼저 Seedream 5.0 Lite로 시작하세요.',
    },
    breadcrumbs: { home: '홈', model: '모델', current: 'Seedream 5.0 Pro' },
    hero: { suffix: 'AI 이미지 생성기 출시 예정', description: 'Seedream 5.0 Pro는 영화적 이미지 생성과 편집을 위한 예정 모델입니다. Toolaze는 Pro 지원을 준비 중이며 현재 생성기는 Seedream 5.0 Lite를 기본으로 사용합니다.', statusLabel: 'Pro 상태: 출시 예정', liveModelLabel: '현재 사용 가능' },
    notice: { title: 'Seedream 5.0 Pro가 Toolaze에 곧 제공됩니다', text: 'Seedream 5.0 Pro는 시네마틱 생성, 정밀 편집, 다층 장면 제어, 온라인 리서치, 추론 기반 구성을 중심으로 합니다.' },
    whatIs: { title: 'Seedream 5.0 Pro란?' },
    features: { title: '주목할 핵심 기능', text: '이 기능들은 Pro가 시네마틱, 상업용, 구조화된 이미지 작업에 왜 중요한지 보여줍니다.' },
    comparison: { title: 'Seedream 5.0 Pro vs Seedream 5.0 Lite', text: 'Pro 준비 중에 적절한 워크플로를 선택하세요.', headers: { capability: '기능', pro: 'Seedream 5.0 Pro', lite: 'Seedream 5.0 Lite' } },
    howTo: { title: 'Pro 출시 전 사용 방법' },
    prompts: { title: 'Pro 스타일 계획용 프롬프트', text: '현재 Lite에서 사용하고 Pro 출시 후 다듬을 수 있습니다.', copyButton: '프롬프트 복사', copiedButton: '복사됨' },
    useCases: { title: '추천 사용 사례' },
    related: { title: '추천 이미지 모델', text: '빠른 초안, 기존 Seedream 워크플로, 유사한 고품질 이미지 생성을 위해 다른 Toolaze 모델도 사용해 보세요.', tryNow: '모델 열기' },
    faq: { title: 'Seedream 5.0 Pro FAQ' },
    cta: { label: 'Lite로 시작', title: '출시 전 Seedream 5.0 Pro 프롬프트 준비', text: 'Seedream 5.0 Lite로 시각 방향을 테스트하세요.', button: 'Seedream 5.0 Lite 사용' },
  },
  it: {
    metadata: {
      title: 'Seedream 5.0 Pro generatore immagini IA in arrivo | Toolaze',
      description: 'Scopri capacità e workflow di Seedream 5.0 Pro. Pro arriverà presto su Toolaze; inizia ora con Seedream 5.0 Lite.',
      openGraphDescription: 'Seedream 5.0 Pro arriverà presto su Toolaze. Usa Seedream 5.0 Lite oggi.',
      twitterDescription: 'Seedream 5.0 Pro in arrivo. Inizia con Seedream 5.0 Lite.',
    },
    breadcrumbs: { home: 'Home', model: 'Modello', current: 'Seedream 5.0 Pro' },
    hero: { suffix: 'generatore immagini IA in arrivo', description: 'Seedream 5.0 Pro è un modello in arrivo per generazione ed editing cinematografico. Toolaze prepara l’accesso Pro; il generatore attuale usa Seedream 5.0 Lite.', statusLabel: 'Stato Pro: in arrivo', liveModelLabel: 'Disponibile ora' },
    notice: { title: 'Seedream 5.0 Pro arriverà presto su Toolaze', text: 'Seedream 5.0 Pro punta su generazione cinematografica, editing preciso, controllo multilivello, ricerca integrata e composizione basata sul ragionamento.' },
    whatIs: { title: 'Che cos’è Seedream 5.0 Pro?' },
    features: { title: 'Funzioni ufficiali da seguire', text: 'Sintesi pubblica senza presentare Pro come già attivo su Toolaze.' },
    comparison: { title: 'Seedream 5.0 Pro vs Seedream 5.0 Lite', text: 'Scegli il workflow corretto mentre Pro viene preparato.', headers: { capability: 'Funzione', pro: 'Seedream 5.0 Pro', lite: 'Seedream 5.0 Lite' } },
    howTo: { title: 'Come usare questa pagina prima di Pro' },
    prompts: { title: 'Prompt per pianificare lo stile Pro', text: 'Usali oggi con Lite e rifiniscili quando Pro sarà disponibile.', copyButton: 'Copia prompt', copiedButton: 'Copiato' },
    useCases: { title: 'Migliori utilizzi' },
    related: { title: 'Modelli immagine consigliati', text: 'Prova altri modelli Toolaze per bozze rapide, workflow Seedream precedenti o generazione immagine affine.', tryNow: 'Apri modello' },
    faq: { title: 'FAQ Seedream 5.0 Pro' },
    cta: { label: 'Inizia con Lite', title: 'Prepara prompt Seedream 5.0 Pro prima del lancio', text: 'Testa direzioni visive con Seedream 5.0 Lite.', button: 'Prova Seedream 5.0 Lite' },
  },
}

const fullSectionOverrides: Record<Exclude<Seedream50ProLocale, 'en'>, DeepPartial<Seedream50ProLandingCopy>> = {
  de: {
    image: { container: 'Generiertes Seitenbild' },
    schema: {
      pageName: 'Seedream 5.0 Pro KI-Bildgenerator',
      appName: 'Seedream 5.0 Pro auf Toolaze',
      howToName: 'So bereitest du Bilder im Seedream 5.0 Pro Stil auf Toolaze vor',
    },
  },
  ja: {
    schema: { pageName: 'Seedream 5.0 Pro AI画像生成', appName: 'ToolazeのSeedream 5.0 Pro', howToName: 'ToolazeでSeedream 5.0 Pro向け画像を準備する方法' },
    whatIs: {
      paragraphs: [
        'Seedream 5.0 Proは、DreaminaとByteDanceが商用ビジュアル、構造化されたシーン編集、ブランド画像、EC素材、動画フレーム制作向けに紹介しているシネマティックなAI画像生成・編集ツールです。',
        '単純なプロンプト画像生成とは異なり、精密編集、レイヤー制御、調査を踏まえた出力、複雑な構図のための推論力を重視しています。',
      ],
    },
    features: {
      items: [
        { title: 'シネマティック画像生成', text: 'キャンペーンビジュアル、ヒーローポスター、SNS画像、完成度の高いアートディレクションが必要なフレーム風構図の準備に向いています。', slot: 'feature-cinematic-generation', label: 'Seedream 5.0 Proページ用のシネマティックなキャンペーン画像' },
        { title: '精密編集と正確な制御', text: '公式情報では、被写体やレイアウト、商用シーン全体を保ちながら細部を変更する用途が強調されています。', slot: 'feature-precision-editing', label: 'Seedream 5.0 Proの精密画像編集例' },
        { title: '複数レイヤーの視覚制御', text: '前景の被写体、商品、背景、デザイン要素をまとめて調整する構造化シーン編集に適しています。', slot: 'feature-multilayer-control', label: 'レイヤー化された商用シーン制御の例' },
        { title: '推論ベースの構図設計', text: '複雑なビジュアルを計画し、プロンプトから一貫したポスター、商品シーン、デザイン下書きを作る力が重視されています。', slot: 'feature-reasoning-composition', label: '推論ベースの画像構図例' },
      ],
    },
    comparison: {
      rows: [
        { capability: 'Toolazeでの提供状況', pro: '近日公開予定。ToolazeではまだProを利用可能とは表示していません。', lite: 'このページの生成機能で利用できます。' },
        { capability: '今すぐ取るべき行動', pro: '機能を確認し、今後のPro利用に向けたプロンプトを準備します。', lite: 'テキストから画像をすぐに生成して下書きを作成できます。' },
        { capability: '公式の位置づけ', pro: 'シネマティック生成、精密編集、複数レイヤー制御、オンライン調査、推論ベースの構図。', lite: '日常的な画像作成と軽量なクリエイティブ実験。' },
        { capability: '商用用途', pro: 'キャンペーン画像、ECシーン、ブランドシステム、SNSクリエイティブ、動画フレーム計画。', lite: '素早いコンセプト、プロンプト検証、SNS下書き、軽量な画像制作。' },
      ],
      note: 'Toolazeは未確認のPro制限を掲載しません。Proが利用可能になった後、対応設定と確認済み仕様を更新します。',
    },
    gallery: {
      text: 'このページが対応を準備している商用・シネマティックな出力例です。',
      examples: [
        { title: '広告キャンペーンのキービジュアル', text: 'シネマティックな照明とブランド安全な構図を備えた高品質なポスター風商品ビジュアル。', slot: 'gallery-ad-campaign' },
        { title: 'EC向けブランドシーン', text: '素材、照明、販売向けディテールを整えた洗練された商品環境。', slot: 'gallery-ecommerce-branding' },
        { title: 'SNS向けヒーロー画像', text: '強い被写体フォーカス、余白、キャンペーン向けカラーを備えたクリエイター向け画像。', slot: 'gallery-social-key-visual' },
        { title: '動画フレーム構想', text: '画像から動画への計画やストーリーボード制作に使えるシネマティックな静止画。', slot: 'gallery-video-frame' },
      ],
    },
    howTo: {
      steps: ['上の生成機能でSeedream 5.0 Liteから始めます。', '内部モデル名ではなく、完成した商用画像を説明するプロンプトを書きます。', '公開先に合わせてアスペクト比と解像度を選びます。', '良いLite下書きを保存し、Pro公開後に同じ構成を再利用します。', '本番利用前に、このページでToolazeのPro提供状況を確認します。'],
    },
    prompts: {
      examples: [
        { title: 'シネマティック商品広告', prompt: 'Create a cinematic product advertisement for a premium sparkling tea can on a reflective studio surface, dramatic side lighting, citrus slices, clean headline space, realistic condensation, refined commercial photography, no real brand logo.', slot: 'prompt-product-ad' },
        { title: '構造化シーン編集', prompt: 'Create a layered fashion editorial scene with a model in the foreground, textured wall background, warm rim light, product display table on the right, clear negative space for copy, coherent shadows, premium magazine composition.', slot: 'prompt-scene-edit' },
        { title: 'ブランドビジュアル体系', prompt: 'Create a brand campaign image for a fictional skincare line named Luma C, hero bottle, ingredient textures, three clean callout areas, soft peach and pearl palette, realistic product detail, polished ecommerce style.', slot: 'prompt-brand-system' },
      ],
    },
    useCases: {
      items: ['完成度の高いキャンペーン構図を持つマーケティング・広告案。', '一貫した商品表現が必要なブランディングとECビジュアル。', '強いフック、明確な被写体、プラットフォーム向け構図を持つSNS画像。', '画像から動画への計画に使う動画フレームや絵コンテ用静止画。', '被写体、レイアウト、シーンの整合性を保つ精密画像編集。', 'デザイナー、プロダクトマーケター、コンテンツチーム向けのレビュー下書き。'],
    },
    related: {
      links: [
        { title: 'Seedream 5.0 Lite', href: '/model/seedream-5-0-lite', text: '現在利用できるSeedream 5.0 Liteで素早く画像を生成できます。' },
        { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: '商用商品画像、タイポグラフィ中心のレイアウト、参照画像を使った編集を作成できます。' },
        { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: '構造化画像生成、複数参照プロンプト、文字の多いビジュアル下書きを試せます。' },
      ],
    },
    image: { container: '生成されたページ画像' },
    faq: {
      items: [
        { q: 'Seedream 5.0 ProはToolazeで今使えますか？', a: 'Seedream 5.0 ProはToolazeで近日公開予定です。このページの生成機能は現在Seedream 5.0 Liteを使用します。' },
        { q: 'なぜ生成機能はSeedream 5.0 Liteを使うのですか？', a: 'Liteは現在Toolazeで利用できるSeedream 5.0ワークフローのため、Pro準備中でも画像下書きを作成できます。' },
        { q: 'Seedream 5.0 Proは何に向いていますか？', a: '公式情報では、シネマティック画像生成、精密編集、複数レイヤー制御、オンライン調査、推論ベースの構図が強調されています。' },
        { q: 'このページのプロンプトは今使えますか？', a: 'はい。今はSeedream 5.0 Liteで使い、ToolazeでProが利用可能になった後にさらに調整できます。' },
        { q: 'ToolazeはProの正確な制限を公開しますか？', a: 'はい。対応モード、制限、出力オプションはProサポート確認後に追加されます。' },
      ],
    },
  },
  es: {
    features: {
      items: [
        { title: 'Generación de imágenes cinematográficas', text: 'Planifica visuales de campaña, pósteres hero, imágenes sociales y composiciones tipo fotograma con dirección artística terminada.', slot: 'feature-cinematic-generation', label: 'Imagen cinematográfica de campaña para Seedream 5.0 Pro' },
      { title: 'Edición precisa y control de exactitud', text: 'Los cambios puntuales ayudan a conservar sujeto, diseño y escena comercial mientras se ajustan detalles concretos.', slot: 'feature-precision-editing', label: 'Ejemplo de edición precisa con Seedream 5.0 Pro' },
        { title: 'Control visual por capas', text: 'La propuesta de Pro encaja con escenas estructuradas donde primer plano, producto, fondo y elementos de diseño deben coordinarse.', slot: 'feature-multilayer-control', label: 'Ejemplo de control de escena por capas' },
        { title: 'Composición basada en razonamiento', text: 'La historia de Pro prioriza una planificación más fuerte para convertir prompts complejos en pósteres, escenas de producto y borradores de diseño coherentes.', slot: 'feature-reasoning-composition', label: 'Ejemplo de composición basada en razonamiento' },
      ],
    },
    comparison: {
      rows: [
        { capability: 'Disponibilidad en Toolaze', pro: 'Próximamente. Toolaze aún no presenta Pro como activo.', lite: 'Disponible en el generador de esta página.' },
        { capability: 'Mejor acción actual', pro: 'Revisar capacidades y preparar prompts para el uso futuro de Pro.', lite: 'Generar borradores de imagen inmediatamente con texto a imagen.' },
      { capability: 'Enfoque del modelo', pro: 'Generación cinematográfica, edición precisa, control por capas, investigación en línea y composición razonada.', lite: 'Creación rápida de imágenes y experimentos creativos ligeros.' },
        { capability: 'Uso comercial', pro: 'Visuales de campaña, escenas ecommerce, sistemas de marca, piezas sociales y planificación de fotogramas de video.', lite: 'Conceptos rápidos, pruebas de prompt, borradores sociales y producción ligera.' },
      ],
      note: 'Toolaze evita publicar límites Pro no verificados. Cuando Pro esté disponible, se añadirán ajustes compatibles y especificaciones confirmadas.',
    },
    gallery: { text: 'Ejemplos de los resultados comerciales y cinematográficos que esta página prepara.', examples: [
      { title: 'Visual principal de campaña', text: 'Visual de producto estilo póster con luz cinematográfica y composición segura para marca.', slot: 'gallery-ad-campaign' },
      { title: 'Escena de marca ecommerce', text: 'Entorno de producto pulido con materiales, iluminación y detalle listo para venta.', slot: 'gallery-ecommerce-branding' },
      { title: 'Imagen hero para redes sociales', text: 'Imagen para creadores con sujeto claro, espacio limpio y color listo para campaña.', slot: 'gallery-social-key-visual' },
      { title: 'Concepto de fotograma de video', text: 'Fotograma cinematográfico útil para planear imagen a video o storyboard.', slot: 'gallery-video-frame' },
    ] },
    howTo: { steps: ['Empieza con Seedream 5.0 Lite en el generador superior.', 'Escribe prompts que describan la imagen comercial final.', 'Elige proporción y resolución según el canal de publicación.', 'Guarda buenos borradores Lite y reutiliza la estructura cuando Pro esté disponible.', 'Revisa esta página para ver actualizaciones de disponibilidad Pro en Toolaze.'] },
    prompts: { examples: [
      { title: 'Anuncio de producto cinematográfico', prompt: 'Create a cinematic product advertisement for a premium sparkling tea can on a reflective studio surface, dramatic side lighting, citrus slices, clean headline space, realistic condensation, refined commercial photography, no real brand logo.', slot: 'prompt-product-ad' },
      { title: 'Edición de escena estructurada', prompt: 'Create a layered fashion editorial scene with a model in the foreground, textured wall background, warm rim light, product display table on the right, clear negative space for copy, coherent shadows, premium magazine composition.', slot: 'prompt-scene-edit' },
      { title: 'Sistema visual de marca', prompt: 'Create a brand campaign image for a fictional skincare line named Luma C, hero bottle, ingredient textures, three clean callout areas, soft peach and pearl palette, realistic product detail, polished ecommerce style.', slot: 'prompt-brand-system' },
    ] },
    useCases: { items: ['Conceptos de marketing y publicidad con composición pulida.', 'Visuales de marca y ecommerce con presentación de producto consistente.', 'Imágenes sociales con gancho claro, sujeto fuerte y encuadre de plataforma.', 'Fotogramas y storyboards para planificar imagen a video.', 'Ediciones precisas donde sujeto, diseño y escena deben mantenerse coherentes.', 'Borradores de revisión para diseño, marketing de producto y equipos de contenido.'] },
    related: { links: [
      { title: 'Seedream 5.0 Lite', href: '/model/seedream-5-0-lite', text: 'Usa el flujo Seedream 5.0 Lite disponible para generar imágenes rápido.' },
      { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Crea visuales comerciales, diseños con tipografía y ediciones guiadas por referencia.' },
      { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Prueba generación estructurada, prompts con varias referencias y borradores con texto.' },
    ] },
    image: { container: 'Imagen generada de la página' },
    faq: { items: [
      { q: '¿Seedream 5.0 Pro está disponible ahora en Toolaze?', a: 'Seedream 5.0 Pro aparece como próximamente en Toolaze. El generador de esta página usa Seedream 5.0 Lite.' },
      { q: '¿Por qué el generador usa Seedream 5.0 Lite?', a: 'Lite es el flujo Seedream 5.0 disponible hoy en Toolaze, así que puedes crear borradores mientras se prepara Pro.' },
      { q: '¿Para qué está diseñado Seedream 5.0 Pro?', a: 'Seedream 5.0 Pro está diseñado para generación cinematográfica, edición precisa, control visual por capas, investigación integrada y composición razonada.' },
      { q: '¿Puedo usar ahora los prompts de esta página?', a: 'Sí. Puedes usarlos con Seedream 5.0 Lite y refinarlos cuando Toolaze añada Pro.' },
      { q: '¿Toolaze publicará límites exactos de Pro?', a: 'Sí. Los modos, límites y opciones se añadirán cuando el soporte Pro esté confirmado.' },
    ] },
  },
  'zh-TW': {
    features: { items: [
      { title: '電影感圖像生成', text: '適合規劃高質感活動主視覺、海報、社群圖片，以及需要完整美術方向的影格式構圖。', slot: 'feature-cinematic-generation', label: 'Seedream 5.0 Pro 頁面的電影感活動圖像' },
      { title: '精準編輯與準確控制', text: '局部細節修改有助於在調整指定元素時，保留主體、版面與商業場景的一致性。', slot: 'feature-precision-editing', label: 'Seedream 5.0 Pro 精準圖像編輯示例' },
      { title: '多層視覺控制', text: 'Seedream 5.0 Pro 的定位適合前景主體、產品、背景與設計元素需要協同控制的結構化場景。', slot: 'feature-multilayer-control', label: '多層商業場景控制示例' },
      { title: '基於推理的構圖', text: 'Pro 強調更強的複雜視覺規劃，讓提示詞轉化為一致的海報、產品場景與設計草稿。', slot: 'feature-reasoning-composition', label: '基於推理的圖像構圖示例' },
    ] },
    comparison: { rows: [
      { capability: 'Toolaze 可用狀態', pro: '即將推出。Toolaze 尚未將 Pro 顯示為已上線。', lite: '可在本頁生成器中使用。' },
      { capability: '目前最佳操作', pro: '查看能力並準備未來使用 Pro 的提示詞。', lite: '立即使用文字生成圖片流程建立草稿。' },
      { capability: '模型重點', pro: '電影感生成、精準編輯、多層控制、線上研究與基於推理的構圖。', lite: '快速日常圖像創作與輕量創意實驗。' },
      { capability: '商業適用場景', pro: '活動視覺、電商場景、品牌系統、社群素材與影片影格規劃。', lite: '快速概念、提示詞測試、社群草稿與輕量圖像製作。' },
    ], note: 'Pro 可用後，本頁會顯示 Toolaze 支援的模式、輸出選項與工作流設定。' },
    gallery: { text: '這些示例展示本頁準備支援的商業與電影感輸出方向。', examples: [
      { title: '廣告活動主視覺', text: '具有電影感燈光與品牌安全構圖的高質感海報式產品視覺。', slot: 'gallery-ad-campaign' },
      { title: '電商品牌場景', text: '具備受控材質、光線與銷售細節的精緻產品環境。', slot: 'gallery-ecommerce-branding' },
      { title: '社群媒體主圖', text: '具備明確主體、乾淨留白與活動色彩的創作者友善圖像。', slot: 'gallery-social-key-visual' },
      { title: '影片影格概念', text: '可用於圖生影片規劃或分鏡發想的電影感靜態畫面。', slot: 'gallery-video-frame' },
    ] },
    howTo: { steps: ['先在上方生成器使用 Seedream 5.0 Lite。', '提示詞描述最終商業圖片，而不是內部模型細節。', '依照發布渠道選擇長寬比與解析度。', '保存好的 Lite 草稿，Pro 可用後重用最佳提示詞結構。', '正式使用前回到本頁確認 Toolaze 的 Pro 可用狀態。'] },
    prompts: { examples: [
      { title: '電影感產品廣告', prompt: 'Create a cinematic product advertisement for a premium sparkling tea can on a reflective studio surface, dramatic side lighting, citrus slices, clean headline space, realistic condensation, refined commercial photography, no real brand logo.', slot: 'prompt-product-ad' },
      { title: '結構化場景編輯', prompt: 'Create a layered fashion editorial scene with a model in the foreground, textured wall background, warm rim light, product display table on the right, clear negative space for copy, coherent shadows, premium magazine composition.', slot: 'prompt-scene-edit' },
      { title: '品牌視覺系統', prompt: 'Create a brand campaign image for a fictional skincare line named Luma C, hero bottle, ingredient textures, three clean callout areas, soft peach and pearl palette, realistic product detail, polished ecommerce style.', slot: 'prompt-brand-system' },
    ] },
    useCases: { items: ['具備完整活動構圖的行銷與廣告概念。', '需要一致產品呈現的品牌與電商視覺。', '具備強鉤子、明確主體與平台適配構圖的社群圖片。', '用於圖生影片規劃的影片影格與分鏡靜態圖。', '需要保持主體、版面與場景一致的精準圖像編輯。', '給設計、產品行銷與內容團隊審稿用的創意草稿。'] },
    related: { links: [
      { title: 'Seedream 5.0 Lite', href: '/model/seedream-5-0-lite', text: '使用目前可用的 Seedream 5.0 Lite 工作流快速生成圖片。' },
      { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: '建立商業產品圖、文字排版設計與參考圖導向的圖像編輯。' },
      { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: '嘗試結構化生成、多參考提示詞與文字豐富的視覺草稿。' },
    ] },
    image: { container: '生成的頁面圖片' },
    faq: { items: [
      { q: 'Seedream 5.0 Pro 現在可以在 Toolaze 使用嗎？', a: 'Seedream 5.0 Pro 在 Toolaze 標示為即將推出。本頁生成器目前預設使用 Seedream 5.0 Lite。' },
      { q: '為什麼生成器使用 Seedream 5.0 Lite？', a: 'Lite 是目前 Toolaze 可用的 Seedream 5.0 工作流，因此使用者可在 Pro 準備期間先建立圖像草稿。' },
      { q: 'Seedream 5.0 Pro 適合做什麼？', a: 'Seedream 5.0 Pro 適合電影感圖像生成、精準編輯、多層視覺控制、內建線上研究與基於推理的構圖。' },
      { q: '我現在可以使用本頁提示詞嗎？', a: '可以。你可以先搭配 Seedream 5.0 Lite 使用，等 Toolaze 加入 Pro 可用性後再微調。' },
      { q: 'Toolaze 會發布 Pro 的確切限制嗎？', a: '會。支援模式、限制與輸出選項會在 Pro 支援確認後再補上。' },
    ] },
  },
  pt: {
    features: { items: [
      { title: 'Geração cinematográfica de imagens', text: 'Planeje visuais de campanha, pôsteres principais, imagens sociais e composições com direção de arte finalizada.', slot: 'feature-cinematic-generation', label: 'Imagem cinematográfica de campanha para Seedream 5.0 Pro' },
      { title: 'Edição precisa e controle de exatidão', text: 'Alterações pontuais ajudam a manter assunto, layout e cena comercial coerentes enquanto detalhes específicos são ajustados.', slot: 'feature-precision-editing', label: 'Exemplo de edição precisa com Seedream 5.0 Pro' },
      { title: 'Controle visual em camadas', text: 'A proposta do Pro atende cenas estruturadas em que primeiro plano, produto, fundo e elementos de design precisam trabalhar juntos.', slot: 'feature-multilayer-control', label: 'Exemplo de controle de cena em camadas' },
      { title: 'Composição baseada em raciocínio', text: 'O posicionamento Pro enfatiza melhor planejamento para transformar prompts complexos em pôsteres, cenas de produto e rascunhos de design coerentes.', slot: 'feature-reasoning-composition', label: 'Exemplo de composição baseada em raciocínio' },
    ] },
    comparison: { rows: [
      { capability: 'Disponibilidade no Toolaze', pro: 'Em breve. O Toolaze ainda não apresenta o Pro como ativo.', lite: 'Disponível no gerador desta página.' },
      { capability: 'Melhor ação agora', pro: 'Revisar capacidades e preparar prompts para uso futuro do Pro.', lite: 'Gerar rascunhos de imagem imediatamente com texto para imagem.' },
      { capability: 'Foco do modelo', pro: 'Geração cinematográfica, edição precisa, controle em camadas, pesquisa online e composição baseada em raciocínio.', lite: 'Criação rápida de imagens e experimentos criativos leves.' },
      { capability: 'Uso comercial', pro: 'Visuais de campanha, cenas ecommerce, sistemas de marca, peças sociais e planejamento de frames de vídeo.', lite: 'Conceitos rápidos, testes de prompt, rascunhos sociais e produção leve.' },
    ], note: 'O Toolaze evita publicar limites Pro não verificados. Quando o Pro estiver disponível, ajustes compatíveis e especificações confirmadas serão adicionados.' },
    gallery: { text: 'Exemplos dos resultados comerciais e cinematográficos que esta página prepara.', examples: [
      { title: 'Visual principal de campanha', text: 'Visual de produto em estilo pôster com luz cinematográfica e composição segura para marca.', slot: 'gallery-ad-campaign' },
      { title: 'Cena de marca ecommerce', text: 'Ambiente de produto refinado com materiais, iluminação e detalhes prontos para venda.', slot: 'gallery-ecommerce-branding' },
      { title: 'Imagem principal para redes sociais', text: 'Imagem para criadores com assunto claro, espaço limpo e cor pronta para campanha.', slot: 'gallery-social-key-visual' },
      { title: 'Conceito de frame de vídeo', text: 'Imagem cinematográfica útil para planejar imagem para vídeo ou storyboard.', slot: 'gallery-video-frame' },
    ] },
    howTo: { steps: ['Comece com Seedream 5.0 Lite no gerador acima.', 'Escreva prompts que descrevam a imagem comercial final.', 'Escolha proporção e resolução conforme o canal de publicação.', 'Salve bons rascunhos Lite e reutilize a estrutura quando o Pro estiver disponível.', 'Revise esta página para acompanhar a disponibilidade Pro no Toolaze.'] },
    prompts: { examples: [
      { title: 'Anúncio cinematográfico de produto', prompt: 'Create a cinematic product advertisement for a premium sparkling tea can on a reflective studio surface, dramatic side lighting, citrus slices, clean headline space, realistic condensation, refined commercial photography, no real brand logo.', slot: 'prompt-product-ad' },
      { title: 'Edição de cena estruturada', prompt: 'Create a layered fashion editorial scene with a model in the foreground, textured wall background, warm rim light, product display table on the right, clear negative space for copy, coherent shadows, premium magazine composition.', slot: 'prompt-scene-edit' },
      { title: 'Sistema visual de marca', prompt: 'Create a brand campaign image for a fictional skincare line named Luma C, hero bottle, ingredient textures, three clean callout areas, soft peach and pearl palette, realistic product detail, polished ecommerce style.', slot: 'prompt-brand-system' },
    ] },
    useCases: { items: ['Conceitos de marketing e publicidade com composição de campanha refinada.', 'Visuais de marca e ecommerce com apresentação de produto consistente.', 'Imagens sociais com gancho claro, assunto forte e enquadramento de plataforma.', 'Frames e storyboards para planejar imagem para vídeo.', 'Edições precisas em que assunto, layout e cena precisam permanecer coerentes.', 'Rascunhos de revisão para design, marketing de produto e equipes de conteúdo.'] },
    related: { links: [
      { title: 'Seedream 5.0 Lite', href: '/model/seedream-5-0-lite', text: 'Use o fluxo Seedream 5.0 Lite disponível para gerar imagens rapidamente.' },
      { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Crie visuais comerciais, layouts com tipografia e edições guiadas por referência.' },
      { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Teste geração estruturada, prompts com várias referências e rascunhos com texto.' },
    ] },
    image: { container: 'Imagem gerada da página' },
    faq: { items: [
      { q: 'Seedream 5.0 Pro está disponível agora no Toolaze?', a: 'Seedream 5.0 Pro aparece como em breve no Toolaze. O gerador desta página usa Seedream 5.0 Lite.' },
      { q: 'Por que o gerador usa Seedream 5.0 Lite?', a: 'Lite é o fluxo Seedream 5.0 disponível hoje no Toolaze, então você pode criar rascunhos enquanto o Pro é preparado.' },
      { q: 'Para que Seedream 5.0 Pro foi projetado?', a: 'Seedream 5.0 Pro foi projetado para geração cinematográfica, edição precisa, controle visual em camadas, pesquisa integrada e composição baseada em raciocínio.' },
      { q: 'Posso usar os prompts desta página agora?', a: 'Sim. Você pode usá-los com Seedream 5.0 Lite e refiná-los quando o Toolaze adicionar o Pro.' },
      { q: 'O Toolaze publicará limites exatos do Pro?', a: 'Sim. Modos, limites e opções de saída serão adicionados quando o suporte Pro for confirmado.' },
    ] },
  },
  fr: {
    features: { items: [
      { title: 'Génération d’images cinématographiques', text: 'Préparez des visuels de campagne, affiches principales, images sociales et compositions de type photogramme avec une direction artistique aboutie.', slot: 'feature-cinematic-generation', label: 'Image de campagne cinématographique pour Seedream 5.0 Pro' },
      { title: 'Édition précise et contrôle de l’exactitude', text: 'Les modifications ciblées aident à conserver le sujet, la mise en page et la scène commerciale tout en ajustant des détails précis.', slot: 'feature-precision-editing', label: 'Exemple d’édition précise avec Seedream 5.0 Pro' },
      { title: 'Contrôle visuel multicouche', text: 'Le positionnement Pro convient aux scènes structurées où premier plan, produit, arrière-plan et éléments de design doivent rester coordonnés.', slot: 'feature-multilayer-control', label: 'Exemple de contrôle de scène multicouche' },
      { title: 'Composition basée sur le raisonnement', text: 'Le récit Pro met l’accent sur une meilleure planification pour transformer des prompts complexes en affiches, scènes produit et brouillons de design cohérents.', slot: 'feature-reasoning-composition', label: 'Exemple de composition basée sur le raisonnement' },
    ] },
    comparison: { rows: [
      { capability: 'Disponibilité sur Toolaze', pro: 'Bientôt disponible. Toolaze ne présente pas encore Pro comme actif.', lite: 'Disponible dans le générateur de cette page.' },
      { capability: 'Meilleure action actuelle', pro: 'Examiner les capacités et préparer des prompts pour l’usage futur de Pro.', lite: 'Générer immédiatement des brouillons d’image en texte vers image.' },
      { capability: 'Orientation du modèle', pro: 'Génération cinématographique, édition précise, contrôle multicouche, recherche en ligne et composition raisonnée.', lite: 'Création rapide d’images et expérimentations créatives légères.' },
      { capability: 'Usage commercial', pro: 'Visuels de campagne, scènes ecommerce, systèmes de marque, créations sociales et planification de photogrammes vidéo.', lite: 'Concepts rapides, tests de prompts, brouillons sociaux et production légère.' },
    ], note: 'Toolaze évite de publier des limites Pro non vérifiées. Lorsque Pro sera disponible, les réglages compatibles et les spécifications confirmées seront ajoutés.' },
    gallery: { text: 'Exemples de résultats commerciaux et cinématographiques que cette page prépare.', examples: [
      { title: 'Visuel principal de campagne', text: 'Visuel produit au style affiche, avec lumière cinématographique et composition sûre pour la marque.', slot: 'gallery-ad-campaign' },
      { title: 'Scène de marque ecommerce', text: 'Environnement produit soigné avec matériaux, lumière et détails prêts pour la vente.', slot: 'gallery-ecommerce-branding' },
      { title: 'Image principale pour réseaux sociaux', text: 'Image adaptée aux créateurs avec sujet net, espace propre et couleur prête pour une campagne.', slot: 'gallery-social-key-visual' },
      { title: 'Concept de photogramme vidéo', text: 'Image fixe cinématographique utile pour planifier image vers vidéo ou storyboard.', slot: 'gallery-video-frame' },
    ] },
    howTo: { steps: ['Commencez avec Seedream 5.0 Lite dans le générateur ci-dessus.', 'Rédigez des prompts décrivant l’image commerciale finale.', 'Choisissez le ratio et la résolution selon le canal de publication.', 'Enregistrez les bons brouillons Lite et réutilisez leur structure lorsque Pro sera disponible.', 'Consultez cette page pour suivre la disponibilité Pro sur Toolaze.'] },
    prompts: { examples: [
      { title: 'Annonce produit cinématographique', prompt: 'Create a cinematic product advertisement for a premium sparkling tea can on a reflective studio surface, dramatic side lighting, citrus slices, clean headline space, realistic condensation, refined commercial photography, no real brand logo.', slot: 'prompt-product-ad' },
      { title: 'Édition de scène structurée', prompt: 'Create a layered fashion editorial scene with a model in the foreground, textured wall background, warm rim light, product display table on the right, clear negative space for copy, coherent shadows, premium magazine composition.', slot: 'prompt-scene-edit' },
      { title: 'Système visuel de marque', prompt: 'Create a brand campaign image for a fictional skincare line named Luma C, hero bottle, ingredient textures, three clean callout areas, soft peach and pearl palette, realistic product detail, polished ecommerce style.', slot: 'prompt-brand-system' },
    ] },
    useCases: { items: ['Concepts marketing et publicitaires avec composition de campagne aboutie.', 'Visuels de marque et ecommerce avec présentation produit cohérente.', 'Images sociales avec accroche claire, sujet fort et cadrage adapté aux plateformes.', 'Photogrammes et storyboards pour planifier image vers vidéo.', 'Éditions précises où sujet, mise en page et scène doivent rester cohérents.', 'Brouillons de revue pour équipes design, marketing produit et contenu.'] },
    related: { links: [
      { title: 'Seedream 5.0 Lite', href: '/model/seedream-5-0-lite', text: 'Utilisez le flux Seedream 5.0 Lite disponible pour générer rapidement des images.' },
      { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Créez des visuels commerciaux, mises en page typographiques et éditions guidées par référence.' },
      { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Testez la génération structurée, les prompts multi-références et les brouillons riches en texte.' },
    ] },
    image: { container: 'Image de page générée' },
    faq: { items: [
      { q: 'Seedream 5.0 Pro est-il disponible maintenant sur Toolaze ?', a: 'Seedream 5.0 Pro est indiqué comme bientôt disponible sur Toolaze. Le générateur de cette page utilise Seedream 5.0 Lite.' },
      { q: 'Pourquoi le générateur utilise-t-il Seedream 5.0 Lite ?', a: 'Lite est le flux Seedream 5.0 disponible aujourd’hui sur Toolaze, vous pouvez donc créer des brouillons pendant la préparation de Pro.' },
      { q: 'À quoi sert Seedream 5.0 Pro ?', a: 'Seedream 5.0 Pro sert à créer des images cinématographiques, des éditions précises, des scènes multicouches, des visuels enrichis par recherche et des compositions raisonnées.' },
      { q: 'Puis-je utiliser les prompts de cette page maintenant ?', a: 'Oui. Vous pouvez les utiliser avec Seedream 5.0 Lite et les affiner lorsque Toolaze ajoutera Pro.' },
      { q: 'Toolaze publiera-t-il les limites exactes de Pro ?', a: 'Oui. Les modes, limites et options de sortie seront ajoutés lorsque le support Pro sera confirmé.' },
    ] },
  },
  ko: {
    features: { items: [
      { title: '시네마틱 이미지 생성', text: '완성도 높은 캠페인 비주얼, 대표 포스터, 소셜 이미지, 프레임형 구도를 준비하는 데 적합합니다.', slot: 'feature-cinematic-generation', label: 'Seedream 5.0 Pro 페이지용 시네마틱 캠페인 이미지' },
      { title: '정밀 편집과 정확도 제어', text: '정밀 변경은 세부 요소를 조정하면서 피사체, 레이아웃, 상업 장면의 일관성을 유지하는 데 유용합니다.', slot: 'feature-precision-editing', label: 'Seedream 5.0 Pro 정밀 이미지 편집 예시' },
      { title: '다층 시각 제어', text: 'Pro는 전경, 제품, 배경, 디자인 요소를 함께 조정해야 하는 구조화된 장면 편집에 맞춰져 있습니다.', slot: 'feature-multilayer-control', label: '다층 상업 장면 제어 예시' },
      { title: '추론 기반 구성', text: 'Pro 포지셔닝은 복잡한 프롬프트를 일관된 포스터, 제품 장면, 디자인 초안으로 바꾸는 계획 능력을 강조합니다.', slot: 'feature-reasoning-composition', label: '추론 기반 이미지 구성 예시' },
    ] },
    comparison: { rows: [
      { capability: 'Toolaze 제공 상태', pro: '출시 예정입니다. Toolaze는 아직 Pro를 사용 가능으로 표시하지 않습니다.', lite: '이 페이지의 생성기에서 사용할 수 있습니다.' },
      { capability: '현재 권장 작업', pro: '기능을 검토하고 향후 Pro 사용을 위한 프롬프트를 준비합니다.', lite: '텍스트로 이미지를 바로 생성해 초안을 만듭니다.' },
      { capability: '모델 초점', pro: '시네마틱 생성, 정밀 편집, 다층 제어, 온라인 조사, 추론 기반 구성.', lite: '빠른 일상 이미지 제작과 가벼운 창작 실험.' },
      { capability: '상업적 활용', pro: '캠페인 비주얼, 전자상거래 장면, 브랜드 시스템, 소셜 크리에이티브, 영상 프레임 계획.', lite: '빠른 콘셉트, 프롬프트 테스트, 소셜 초안, 가벼운 이미지 제작.' },
    ], note: 'Toolaze는 검증되지 않은 Pro 제한을 게시하지 않습니다. Pro가 제공되면 지원 설정과 확인된 사양을 업데이트합니다.' },
    gallery: { text: '이 페이지가 준비 중인 상업적이고 시네마틱한 결과 예시입니다.', examples: [
      { title: '광고 캠페인 키 비주얼', text: '시네마틱 조명과 브랜드 안전 구성을 갖춘 프리미엄 포스터형 제품 비주얼.', slot: 'gallery-ad-campaign' },
      { title: '전자상거래 브랜드 장면', text: '소재, 조명, 판매용 디테일이 정리된 세련된 제품 환경.', slot: 'gallery-ecommerce-branding' },
      { title: '소셜 미디어 대표 이미지', text: '명확한 피사체, 깨끗한 여백, 캠페인용 색감을 갖춘 크리에이터용 이미지.', slot: 'gallery-social-key-visual' },
      { title: '영상 프레임 콘셉트', text: '이미지-투-비디오 계획이나 스토리보드에 활용할 수 있는 시네마틱 스틸.', slot: 'gallery-video-frame' },
    ] },
    howTo: { steps: ['위 생성기에서 Seedream 5.0 Lite로 시작합니다.', '내부 모델 세부 정보가 아니라 최종 상업 이미지를 설명합니다.', '게시 채널에 맞게 비율과 해상도를 선택합니다.', '좋은 Lite 초안을 저장하고 Pro가 제공되면 같은 구조를 재사용합니다.', '실제 작업 전 이 페이지에서 Toolaze Pro 제공 상태를 확인합니다.'] },
    prompts: { examples: [
      { title: '시네마틱 제품 광고', prompt: 'Create a cinematic product advertisement for a premium sparkling tea can on a reflective studio surface, dramatic side lighting, citrus slices, clean headline space, realistic condensation, refined commercial photography, no real brand logo.', slot: 'prompt-product-ad' },
      { title: '구조화된 장면 편집', prompt: 'Create a layered fashion editorial scene with a model in the foreground, textured wall background, warm rim light, product display table on the right, clear negative space for copy, coherent shadows, premium magazine composition.', slot: 'prompt-scene-edit' },
      { title: '브랜드 비주얼 시스템', prompt: 'Create a brand campaign image for a fictional skincare line named Luma C, hero bottle, ingredient textures, three clean callout areas, soft peach and pearl palette, realistic product detail, polished ecommerce style.', slot: 'prompt-brand-system' },
    ] },
    useCases: { items: ['완성도 높은 캠페인 구성을 가진 마케팅 및 광고 콘셉트.', '일관된 제품 표현이 필요한 브랜딩 및 전자상거래 비주얼.', '강한 후킹, 명확한 피사체, 플랫폼 맞춤 구도를 가진 소셜 이미지.', '이미지-투-비디오 계획을 위한 영상 프레임과 스토리보드 스틸.', '피사체, 레이아웃, 장면 일관성이 필요한 정밀 이미지 편집.', '디자인, 제품 마케팅, 콘텐츠 팀을 위한 리뷰용 창작 초안.'] },
    related: { links: [
      { title: 'Seedream 5.0 Lite', href: '/model/seedream-5-0-lite', text: '현재 제공되는 Seedream 5.0 Lite 흐름으로 이미지를 빠르게 생성합니다.' },
      { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: '상업 제품 비주얼, 타이포그래피 레이아웃, 참조 기반 이미지 편집을 만듭니다.' },
      { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: '구조화 생성, 다중 참조 프롬프트, 텍스트가 많은 시각 초안을 테스트합니다.' },
    ] },
    image: { container: '생성된 페이지 이미지' },
    faq: { items: [
      { q: 'Seedream 5.0 Pro를 지금 Toolaze에서 사용할 수 있나요?', a: 'Seedream 5.0 Pro는 Toolaze에서 출시 예정으로 표시됩니다. 이 페이지의 생성기는 현재 Seedream 5.0 Lite를 사용합니다.' },
      { q: '왜 생성기가 Seedream 5.0 Lite를 사용하나요?', a: 'Lite는 현재 Toolaze에서 사용할 수 있는 Seedream 5.0 흐름이므로 Pro 준비 중에도 이미지 초안을 만들 수 있습니다.' },
      { q: 'Seedream 5.0 Pro는 무엇에 적합한가요?', a: 'Seedream 5.0 Pro는 시네마틱 이미지 생성, 정밀 편집, 다층 시각 제어, 내장 온라인 조사, 추론 기반 구성에 적합합니다.' },
      { q: '이 페이지의 프롬프트를 지금 사용할 수 있나요?', a: '네. Seedream 5.0 Lite에서 사용하고 Toolaze가 Pro를 추가하면 다시 다듬을 수 있습니다.' },
      { q: 'Toolaze는 정확한 Pro 제한을 공개하나요?', a: '네. 지원 모드, 제한, 출력 옵션은 Pro 지원이 확인된 후 추가됩니다.' },
    ] },
  },
  it: {
    features: { items: [
      { title: 'Generazione di immagini cinematografiche', text: 'Pianifica visual di campagna, poster principali, immagini social e composizioni tipo fotogramma con direzione artistica rifinita.', slot: 'feature-cinematic-generation', label: 'Immagine cinematografica di campagna per Seedream 5.0 Pro' },
      { title: 'Editing preciso e controllo dell’accuratezza', text: 'Le modifiche mirate aiutano a mantenere soggetto, layout e scena commerciale coerenti mentre si regolano dettagli specifici.', slot: 'feature-precision-editing', label: 'Esempio di editing preciso con Seedream 5.0 Pro' },
      { title: 'Controllo visivo multilivello', text: 'Il posizionamento Pro si adatta a scene strutturate in cui primo piano, prodotto, sfondo ed elementi di design devono restare coordinati.', slot: 'feature-multilayer-control', label: 'Esempio di controllo di scena multilivello' },
      { title: 'Composizione basata sul ragionamento', text: 'La proposta Pro enfatizza una pianificazione più forte per trasformare prompt complessi in poster, scene prodotto e bozze di design coerenti.', slot: 'feature-reasoning-composition', label: 'Esempio di composizione basata sul ragionamento' },
    ] },
    comparison: { rows: [
      { capability: 'Disponibilità su Toolaze', pro: 'In arrivo. Toolaze non presenta ancora Pro come attivo.', lite: 'Disponibile nel generatore di questa pagina.' },
      { capability: 'Migliore azione attuale', pro: 'Rivedere le capacità e preparare prompt per l’uso futuro di Pro.', lite: 'Generare subito bozze immagine con testo-immagine.' },
      { capability: 'Focus del modello', pro: 'Generazione cinematografica, editing preciso, controllo multilivello, ricerca online e composizione ragionata.', lite: 'Creazione rapida di immagini ed esperimenti creativi leggeri.' },
      { capability: 'Uso commerciale', pro: 'Visual di campagna, scene ecommerce, sistemi di marca, creatività social e pianificazione di frame video.', lite: 'Concetti rapidi, test di prompt, bozze social e produzione leggera.' },
    ], note: 'Toolaze evita di pubblicare limiti Pro non verificati. Quando Pro sarà disponibile, verranno aggiunte impostazioni compatibili e specifiche confermate.' },
    gallery: { text: 'Esempi dei risultati commerciali e cinematografici che questa pagina prepara.', examples: [
      { title: 'Visual principale di campagna', text: 'Visual prodotto in stile poster con luce cinematografica e composizione sicura per il brand.', slot: 'gallery-ad-campaign' },
      { title: 'Scena brand ecommerce', text: 'Ambiente prodotto curato con materiali, illuminazione e dettagli pronti alla vendita.', slot: 'gallery-ecommerce-branding' },
      { title: 'Immagine hero per social media', text: 'Immagine per creator con soggetto chiaro, spazio pulito e colore pronto per campagna.', slot: 'gallery-social-key-visual' },
      { title: 'Concetto di frame video', text: 'Still cinematografico utile per pianificare immagine-video o storyboard.', slot: 'gallery-video-frame' },
    ] },
    howTo: { steps: ['Inizia con Seedream 5.0 Lite nel generatore sopra.', 'Scrivi prompt che descrivono l’immagine commerciale finale.', 'Scegli rapporto e risoluzione in base al canale di pubblicazione.', 'Salva buone bozze Lite e riusa la struttura quando Pro sarà disponibile.', 'Controlla questa pagina per aggiornamenti sulla disponibilità Pro su Toolaze.'] },
    prompts: { examples: [
      { title: 'Annuncio prodotto cinematografico', prompt: 'Create a cinematic product advertisement for a premium sparkling tea can on a reflective studio surface, dramatic side lighting, citrus slices, clean headline space, realistic condensation, refined commercial photography, no real brand logo.', slot: 'prompt-product-ad' },
      { title: 'Editing di scena strutturata', prompt: 'Create a layered fashion editorial scene with a model in the foreground, textured wall background, warm rim light, product display table on the right, clear negative space for copy, coherent shadows, premium magazine composition.', slot: 'prompt-scene-edit' },
      { title: 'Sistema visivo di marca', prompt: 'Create a brand campaign image for a fictional skincare line named Luma C, hero bottle, ingredient textures, three clean callout areas, soft peach and pearl palette, realistic product detail, polished ecommerce style.', slot: 'prompt-brand-system' },
    ] },
    useCases: { items: ['Concetti marketing e advertising con composizione di campagna rifinita.', 'Visual di marca ed ecommerce con presentazione prodotto coerente.', 'Immagini social con aggancio chiaro, soggetto forte e formato adatto alla piattaforma.', 'Frame e storyboard per pianificare immagine-video.', 'Editing precisi in cui soggetto, layout e scena devono restare coerenti.', 'Bozze creative per team design, product marketing e contenuti.'] },
    related: { links: [
      { title: 'Seedream 5.0 Lite', href: '/model/seedream-5-0-lite', text: 'Usa il flusso Seedream 5.0 Lite disponibile per generare immagini rapidamente.' },
      { title: 'Seedream 4.5', href: '/model/seedream-4-5', text: 'Crea visual commerciali, layout tipografici ed editing guidati da riferimenti.' },
      { title: 'Wan 2.7 Image', href: '/model/wan-2-7-image', text: 'Prova generazione strutturata, prompt multi-riferimento e bozze ricche di testo.' },
    ] },
    image: { container: 'Immagine generata della pagina' },
    faq: { items: [
      { q: 'Seedream 5.0 Pro è disponibile ora su Toolaze?', a: 'Seedream 5.0 Pro è indicato come in arrivo su Toolaze. Il generatore di questa pagina usa Seedream 5.0 Lite.' },
      { q: 'Perché il generatore usa Seedream 5.0 Lite?', a: 'Lite è il flusso Seedream 5.0 disponibile oggi su Toolaze, quindi puoi creare bozze mentre Pro viene preparato.' },
      { q: 'Per cosa è pensato Seedream 5.0 Pro?', a: 'Seedream 5.0 Pro è pensato per generazione cinematografica, editing preciso, controllo visivo multilivello, ricerca integrata e composizione ragionata.' },
      { q: 'Posso usare ora i prompt di questa pagina?', a: 'Sì. Puoi usarli con Seedream 5.0 Lite e rifinirli quando Toolaze aggiungerà Pro.' },
      { q: 'Toolaze pubblicherà i limiti esatti di Pro?', a: 'Sì. Modalità, limiti e opzioni di output saranno aggiunti dopo la conferma del supporto Pro.' },
    ] },
  },
}

const liveAvailabilityOverrides: Record<Seedream50ProLocale, DeepPartial<Seedream50ProLandingCopy>> = {
  en: {
    metadata: {
      title: 'Seedream 5.0 Pro AI Image Generator | Toolaze',
      description:
        'Use Seedream 5.0 Pro on Toolaze for cinematic image generation, precision editing, layered composition, and commercial visual creation.',
      openGraphDescription:
        'Use Seedream 5.0 Pro for cinematic generation, precision editing, and commercial image workflows on Toolaze.',
      twitterDescription:
        'Generate Seedream 5.0 Pro images on Toolaze with cinematic image generation and structured visual workflows.',
    },
    schema: {
      howToName: 'How to create Seedream 5.0 Pro images on Toolaze',
    },
    hero: {
      suffix: 'AI Image Generator',
      description:
        'Use Seedream 5.0 Pro on Toolaze to create cinematic campaign visuals, structured scene edits, brand images, ecommerce assets, and video frame concepts.',
      statusLabel: 'Live on Toolaze',
      liveModelLabel: 'Active model',
      liveModelValue: 'Seedream 5.0 Pro',
    },
    notice: {
      title: 'Create with Seedream 5.0 Pro on Toolaze',
      text:
        'Seedream 5.0 Pro supports cinematic generation, precision editing, multi-layer scene control, research-aware visual planning, and reasoning-based composition for commercial and creative image production.',
    },
    howTo: {
      title: 'How to create Seedream 5.0 Pro images',
      steps: [
        'Start with the Seedream 5.0 Pro generator above.',
        'Write a prompt that describes the final commercial image, not internal model details.',
        'Choose the aspect ratio and resolution for your publishing channel.',
        'Add concrete subject, scene, lighting, material, and composition requirements.',
        'Generate, review the result, then refine the prompt for campaign visuals, ecommerce scenes, social posts, or video-frame planning.',
      ],
    },
    prompts: {
      title: 'Seedream 5.0 Pro prompt examples',
      text: 'Use these examples as starting points for Seedream 5.0 Pro image generation.',
    },
    related: {
      text: 'Try other Toolaze image models when you want faster drafts, earlier Seedream workflows, or adjacent high-quality image generation.',
    },
    faq: {
      items: [
        {
          q: 'Can I use Seedream 5.0 Pro on Toolaze now?',
          a: 'Yes. The generator on this page uses Seedream 5.0 Pro for supported text-to-image and image-to-image workflows.',
        },
        {
          q: 'What kinds of images fit Seedream 5.0 Pro best?',
          a: 'It fits campaign visuals, ecommerce scenes, brand systems, social creative, structured edits, and cinematic stills for video planning.',
        },
        {
          q: 'How should I write prompts for Seedream 5.0 Pro?',
          a: 'Describe the final output clearly: subject, setting, lighting, camera angle, material details, layout needs, and any text or negative space requirements.',
        },
        {
          q: 'Can Seedream 5.0 Pro help with brand and ecommerce visuals?',
          a: 'Yes. It is useful for polished product scenes, campaign key visuals, controlled materials, and repeatable brand-style concepts.',
        },
      ],
    },
    cta: {
      label: 'Generate now',
      title: 'Create Seedream 5.0 Pro images online',
      text: 'Use Seedream 5.0 Pro for campaign visuals, product scenes, social posts, and cinematic stills.',
      button: 'Start generating',
    },
  },
  de: {
    metadata: {
      title: 'Seedream 5.0 Pro KI-Bildgenerator | Toolaze',
      description:
        'Nutze Seedream 5.0 Pro auf Toolaze für filmische Bildgenerierung, präzise Bearbeitung, strukturierte Kompositionen und kommerzielle Visuals.',
      openGraphDescription: 'Nutze Seedream 5.0 Pro auf Toolaze für filmische Generierung und kommerzielle Bild-Workflows.',
      twitterDescription: 'Erstelle Seedream 5.0 Pro Bilder auf Toolaze.',
    },
    schema: { howToName: 'So erstellst du Seedream 5.0 Pro Bilder auf Toolaze' },
    hero: {
      suffix: 'KI-Bildgenerator',
      description:
        'Nutze Seedream 5.0 Pro auf Toolaze für Kampagnenmotive, strukturierte Szenenbearbeitung, Markenbilder, E-Commerce-Assets und Videoframe-Konzepte.',
      statusLabel: 'Live auf Toolaze',
      liveModelLabel: 'Aktives Modell',
      liveModelValue: 'Seedream 5.0 Pro',
    },
    notice: {
      title: 'Mit Seedream 5.0 Pro auf Toolaze erstellen',
      text: 'Seedream 5.0 Pro unterstützt filmische Generierung, präzise Bearbeitung, mehrschichtige Szenenkontrolle und reasoning-basierte Komposition für kommerzielle Bildproduktion.',
    },
    features: { text: 'Diese Fähigkeiten erklären, wie Seedream 5.0 Pro filmische, kommerzielle und strukturierte Bildarbeit unterstützt.' },
    comparison: {
      text: 'Nutze den Vergleich, um Pro und Lite für unterschiedliche Seedream-Workflows einzuordnen.',
      rows: [
        { capability: 'Workflow-Rolle', pro: 'Fortgeschrittenes Modell für filmische, kommerzielle und strukturierte Bildarbeit.', lite: 'Schnelles Modell für alltägliche Bildideen und leichte Experimente.' },
        { capability: 'Kreative Tiefe', pro: 'Geeignet für komplexe Szenen, Designsysteme, Kampagnenkompositionen und präzise Bearbeitung.', lite: 'Geeignet für schnelle Prompt-Tests, einfache Social-Entwürfe und niedrige Reibung.' },
        { capability: 'Modellfokus', pro: 'Filmische Generierung, präzise Bearbeitung, mehrschichtige Kontrolle, Recherche und reasoning-basierte Komposition.', lite: 'Schnelle alltägliche Bildkreation und leichte Kreativexperimente.' },
        { capability: 'Kommerzieller Einsatz', pro: 'Kampagnenbilder, E-Commerce-Szenen, Markensysteme, Social Creatives und Videoframe-Planung.', lite: 'Schnelle Konzepte, Prompt-Tests und leichte Bildproduktion.' },
      ],
      note: 'Diese Tabelle konzentriert sich auf kreative Richtung, Einsatzfälle und Workflow-Entscheidungen.',
    },
    gallery: { text: 'Kommerzielle und filmische Ergebnisrichtungen für Seedream 5.0 Pro.' },
    howTo: {
      title: 'So erstellst du Seedream 5.0 Pro Bilder',
      steps: [
        'Starte im Generator oben mit Seedream 5.0 Pro.',
        'Beschreibe im Prompt das endgültige kommerzielle Bild statt interner Modelldetails.',
        'Wähle Seitenverhältnis und Auflösung passend zum Veröffentlichungskanal.',
        'Ergänze konkrete Angaben zu Motiv, Szene, Licht, Material und Komposition.',
        'Generiere ein Ergebnis und verfeinere den Prompt für Kampagnen, E-Commerce, Social Posts oder Videoframes.',
      ],
    },
    prompts: { title: 'Seedream 5.0 Pro Prompt-Beispiele', text: 'Nutze diese Beispiele als Startpunkte für Seedream 5.0 Pro Bildgenerierung.' },
    related: { text: 'Teste weitere Toolaze-Bildmodelle für schnelle Entwürfe, frühere Seedream-Workflows oder ähnliche hochwertige Bildgenerierung.' },
    faq: {
      items: [
        { q: 'Kann ich Seedream 5.0 Pro jetzt auf Toolaze verwenden?', a: 'Ja. Der Generator auf dieser Seite nutzt Seedream 5.0 Pro für unterstützte Text-zu-Bild- und Bild-zu-Bild-Workflows.' },
        { q: 'Wofür eignet sich Seedream 5.0 Pro am besten?', a: 'Für Kampagnenbilder, E-Commerce-Szenen, Markensysteme, Social Creatives, strukturierte Bearbeitungen und filmische Stills für Videoplanung.' },
        { q: 'Wie schreibe ich gute Seedream 5.0 Pro Prompts?', a: 'Beschreibe Motiv, Umgebung, Licht, Kamerawinkel, Materialdetails, Layout und benötigte Freiflächen klar.' },
        { q: 'Hilft Seedream 5.0 Pro bei Marken- und E-Commerce-Bildern?', a: 'Ja. Es eignet sich für Produktbilder, Kampagnenmotive, kontrollierte Materialien und wiederholbare Markenstile.' },
      ],
    },
    cta: { label: 'Jetzt generieren', title: 'Seedream 5.0 Pro Bilder online erstellen', text: 'Nutze Seedream 5.0 Pro für Kampagnenmotive, Produktszenen, Social Posts und filmische Stills.', button: 'Generierung starten' },
  },
  ja: {
    metadata: {
      title: 'Seedream 5.0 Pro AI画像生成 | Toolaze',
      description: 'ToolazeでSeedream 5.0 Proを使い、シネマティックな画像生成、精密編集、構造化された商用ビジュアルを作成できます。',
      openGraphDescription: 'ToolazeでSeedream 5.0 Pro画像を生成できます。',
      twitterDescription: 'Seedream 5.0 Pro画像をToolazeで作成。',
    },
    schema: { howToName: 'ToolazeでSeedream 5.0 Pro画像を作成する方法' },
    hero: {
      suffix: 'AI画像生成',
      description: 'Seedream 5.0 Proで、キャンペーンビジュアル、構造化されたシーン編集、ブランド画像、EC素材、動画フレーム案を作成できます。',
      statusLabel: 'Toolazeで利用可能',
      liveModelLabel: '使用モデル',
      liveModelValue: 'Seedream 5.0 Pro',
    },
    notice: { title: 'ToolazeでSeedream 5.0 Proを作成', text: 'Seedream 5.0 Proは、シネマティック生成、精密編集、複数レイヤー制御、推論ベースの構図を使った商用画像制作に適しています。' },
    features: { text: 'Seedream 5.0 Proがシネマティック、商用、構造化された画像制作をどう支えるかをまとめます。' },
    comparison: {
      text: 'ProとLiteを用途別に比較できます。',
      rows: [
        { capability: 'ワークフロー上の役割', pro: 'シネマティック、商用、構造化された画像制作向けの上位モデル。', lite: '日常的な画像案と軽量な実験向けの高速モデル。' },
        { capability: 'クリエイティブの深さ', pro: '複雑なシーン、デザイン体系、キャンペーン構図、精密編集に向いています。', lite: '素早いプロンプト検証やシンプルなSNS下書きに向いています。' },
        { capability: 'モデルの重点', pro: 'シネマティック生成、精密編集、複数レイヤー制御、調査、推論ベースの構図。', lite: '高速な日常画像制作と軽量な創作実験。' },
        { capability: '商用利用の向き', pro: 'キャンペーン画像、ECシーン、ブランドシステム、SNSクリエイティブ、動画フレーム計画。', lite: '素早いコンセプト、プロンプトテスト、軽量な画像制作。' },
      ],
      note: 'この比較は、制作目的とワークフロー選択に絞っています。',
    },
    gallery: { text: 'Seedream 5.0 Proで作成できる商用・シネマティックな出力例です。' },
    howTo: {
      title: 'Seedream 5.0 Pro画像の作り方',
      steps: ['上の生成機能でSeedream 5.0 Proを選びます。', '内部モデル名ではなく、完成した商用画像を説明するプロンプトを書きます。', '公開先に合わせてアスペクト比と解像度を選びます。', '被写体、シーン、照明、素材、構図を具体的に指定します。', '生成結果を確認し、用途に合わせてプロンプトを調整します。'],
    },
    prompts: { title: 'Seedream 5.0 Proプロンプト例', text: 'Seedream 5.0 Pro画像生成の出発点として使えます。' },
    related: { text: '高速な下書き、既存のSeedreamワークフロー、近い用途の高品質画像生成に使えるToolazeモデルです。' },
    faq: {
      items: [
        { q: 'Seedream 5.0 ProはToolazeで使えますか？', a: 'はい。このページの生成機能は、対応するテキスト画像生成と画像参照ワークフローでSeedream 5.0 Proを使用します。' },
        { q: 'Seedream 5.0 Proはどんな画像に向いていますか？', a: 'キャンペーン画像、ECシーン、ブランドシステム、SNSクリエイティブ、構造化編集、動画計画用のシネマティックな静止画に向いています。' },
        { q: 'プロンプトはどう書けばいいですか？', a: '被写体、背景、照明、カメラ角度、素材、レイアウト、余白や文字配置を明確に書いてください。' },
        { q: 'ブランドやEC画像にも使えますか？', a: 'はい。商品シーン、キャンペーン主視覚、素材表現、繰り返し使えるブランドスタイルの作成に役立ちます。' },
      ],
    },
    cta: { label: '今すぐ生成', title: 'Seedream 5.0 Pro画像をオンラインで作成', text: 'キャンペーン、商品シーン、SNS投稿、シネマティックな静止画に使えます。', button: '生成を開始' },
  },
  es: {
    metadata: {
      title: 'Seedream 5.0 Pro generador de imágenes IA | Toolaze',
      description: 'Usa Seedream 5.0 Pro en Toolaze para generación cinematográfica, edición precisa y visuales comerciales estructurados.',
      openGraphDescription: 'Genera imágenes con Seedream 5.0 Pro en Toolaze.',
      twitterDescription: 'Crea imágenes con Seedream 5.0 Pro en Toolaze.',
    },
    schema: { howToName: 'Cómo crear imágenes Seedream 5.0 Pro en Toolaze' },
    hero: { suffix: 'generador de imágenes IA', description: 'Usa Seedream 5.0 Pro para crear visuales de campaña, ediciones de escena, imágenes de marca, recursos ecommerce y conceptos de fotograma de video.', statusLabel: 'Disponible en Toolaze', liveModelLabel: 'Modelo activo', liveModelValue: 'Seedream 5.0 Pro' },
    notice: { title: 'Crea con Seedream 5.0 Pro en Toolaze', text: 'Seedream 5.0 Pro sirve para generación cinematográfica, edición precisa, control por capas y composición razonada para producción visual comercial.' },
    comparison: { text: 'Compara Pro y Lite según el tipo de trabajo visual.', rows: [
      { capability: 'Rol del flujo', pro: 'Modelo avanzado para trabajo cinematográfico, comercial y estructurado.', lite: 'Modelo rápido para creación diaria y experimentos ligeros.' },
      { capability: 'Profundidad creativa', pro: 'Útil para escenas complejas, sistemas de diseño, campañas y edición precisa.', lite: 'Útil para pruebas rápidas de prompt y borradores simples.' },
      { capability: 'Enfoque del modelo', pro: 'Generación cinematográfica, edición precisa, control por capas, investigación y composición razonada.', lite: 'Creación rápida de imágenes y experimentos creativos ligeros.' },
      { capability: 'Uso comercial', pro: 'Campañas, escenas ecommerce, sistemas de marca, piezas sociales y fotogramas de video.', lite: 'Conceptos rápidos, pruebas de prompt y producción ligera.' },
    ], note: 'Esta comparación se centra en casos de uso y decisiones de flujo.' },
    howTo: { title: 'Cómo crear imágenes con Seedream 5.0 Pro', steps: ['Empieza con el generador Seedream 5.0 Pro superior.', 'Describe la imagen comercial final, no detalles internos del modelo.', 'Elige proporción y resolución según el canal de publicación.', 'Añade sujeto, escena, iluminación, materiales y composición concretos.', 'Genera, revisa y ajusta el prompt para tu caso de uso.'] },
    prompts: { title: 'Prompts para Seedream 5.0 Pro', text: 'Usa estos ejemplos como punto de partida para generar imágenes con Seedream 5.0 Pro.' },
    related: { text: 'Prueba otros modelos de Toolaze para borradores rápidos, flujos Seedream anteriores o generación de imagen similar.' },
    faq: { items: [
      { q: '¿Puedo usar Seedream 5.0 Pro ahora en Toolaze?', a: 'Sí. El generador de esta página usa Seedream 5.0 Pro para flujos compatibles de texto a imagen e imagen a imagen.' },
      { q: '¿Qué imágenes encajan mejor con Seedream 5.0 Pro?', a: 'Visuales de campaña, escenas ecommerce, sistemas de marca, creatividad social, ediciones estructuradas y fotogramas cinematográficos.' },
      { q: '¿Cómo escribo buenos prompts?', a: 'Describe sujeto, escenario, iluminación, cámara, materiales, layout y espacios de texto con claridad.' },
      { q: '¿Sirve para marca y ecommerce?', a: 'Sí. Es útil para escenas de producto, visuales de campaña y estilos de marca repetibles.' },
    ] },
    cta: { label: 'Generar ahora', title: 'Crea imágenes Seedream 5.0 Pro online', text: 'Usa Seedream 5.0 Pro para campañas, producto, redes sociales y fotogramas cinematográficos.', button: 'Empezar a generar' },
  },
  'zh-TW': {
    metadata: {
      title: 'Seedream 5.0 Pro AI 圖像生成器 | Toolaze',
      description: '在 Toolaze 使用 Seedream 5.0 Pro，建立電影感圖像、精準編輯、結構化商業視覺與品牌素材。',
      openGraphDescription: '在 Toolaze 使用 Seedream 5.0 Pro 生成圖片。',
      twitterDescription: '在 Toolaze 建立 Seedream 5.0 Pro 圖像。',
    },
    schema: { howToName: '如何在 Toolaze 建立 Seedream 5.0 Pro 圖像' },
    hero: { suffix: 'AI 圖像生成器', description: '使用 Seedream 5.0 Pro 建立活動主視覺、結構化場景編輯、品牌圖片、電商素材與影片影格概念。', statusLabel: '已在 Toolaze 上線', liveModelLabel: '使用模型', liveModelValue: 'Seedream 5.0 Pro' },
    notice: { title: '在 Toolaze 使用 Seedream 5.0 Pro 創作', text: 'Seedream 5.0 Pro 適合電影感生成、精準編輯、多層場景控制與基於推理的商業圖片構圖。' },
    comparison: { text: '依照不同圖片工作流比較 Pro 與 Lite。', rows: [
      { capability: '工作流定位', pro: '進階模型，適合電影感、商業化與結構化圖片工作。', lite: '快速模型，適合日常圖片創作與輕量實驗。' },
      { capability: '創作深度', pro: '適合複雜場景、設計系統、活動構圖與精準編輯。', lite: '適合快速提示詞測試與簡單社群草稿。' },
      { capability: '模型重點', pro: '電影感生成、精準編輯、多層控制、研究輔助與基於推理的構圖。', lite: '快速日常圖像創作與輕量創意實驗。' },
      { capability: '商業適用場景', pro: '活動視覺、電商場景、品牌系統、社群素材與影片影格規劃。', lite: '快速概念、提示詞測試與輕量圖片製作。' },
    ], note: '此比較聚焦於用途與工作流選擇。' },
    howTo: { title: '如何建立 Seedream 5.0 Pro 圖像', steps: ['先使用上方 Seedream 5.0 Pro 生成器。', '提示詞描述最終商業圖片，而不是內部模型細節。', '依照發布渠道選擇長寬比與解析度。', '明確指定主體、場景、光線、材質與構圖。', '生成後檢查結果，並依照用途調整提示詞。'] },
    prompts: { title: 'Seedream 5.0 Pro 提示詞範例', text: '用這些範例作為 Seedream 5.0 Pro 圖像生成起點。' },
    related: { text: '需要快速草稿、既有 Seedream 工作流或相近的高品質圖像生成時，可試用其他 Toolaze 模型。' },
    faq: { items: [
      { q: '現在可以在 Toolaze 使用 Seedream 5.0 Pro 嗎？', a: '可以。本頁生成器使用 Seedream 5.0 Pro 支援文字生成圖片與圖生圖工作流。' },
      { q: 'Seedream 5.0 Pro 適合哪些圖片？', a: '適合活動視覺、電商場景、品牌系統、社群素材、結構化編輯與影片規劃用電影感靜態圖。' },
      { q: '提示詞該怎麼寫？', a: '清楚描述主體、場景、光線、鏡頭角度、材質、版面需求與文字留白。' },
      { q: '可以用於品牌與電商圖片嗎？', a: '可以。它適合產品場景、活動主視覺、受控材質與可重複使用的品牌風格概念。' },
    ] },
    cta: { label: '立即生成', title: '線上建立 Seedream 5.0 Pro 圖像', text: '使用 Seedream 5.0 Pro 建立活動視覺、產品場景、社群貼文與電影感靜態圖。', button: '開始生成' },
  },
  pt: {
    metadata: {
      title: 'Seedream 5.0 Pro gerador de imagens IA | Toolaze',
      description: 'Use Seedream 5.0 Pro no Toolaze para geração cinematográfica, edição precisa e visuais comerciais estruturados.',
      openGraphDescription: 'Gere imagens com Seedream 5.0 Pro no Toolaze.',
      twitterDescription: 'Crie imagens com Seedream 5.0 Pro no Toolaze.',
    },
    schema: { howToName: 'Como criar imagens Seedream 5.0 Pro no Toolaze' },
    hero: { suffix: 'gerador de imagens IA', description: 'Use Seedream 5.0 Pro para criar visuais de campanha, edições de cena, imagens de marca, recursos ecommerce e conceitos de frame de vídeo.', statusLabel: 'Disponível no Toolaze', liveModelLabel: 'Modelo ativo', liveModelValue: 'Seedream 5.0 Pro' },
    notice: { title: 'Crie com Seedream 5.0 Pro no Toolaze', text: 'Seedream 5.0 Pro serve para geração cinematográfica, edição precisa, controle em camadas e composição baseada em raciocínio para produção visual comercial.' },
    comparison: { text: 'Compare Pro e Lite por tipo de trabalho visual.', rows: [
      { capability: 'Papel no fluxo', pro: 'Modelo avançado para trabalho cinematográfico, comercial e estruturado.', lite: 'Modelo rápido para criação diária e experimentos leves.' },
      { capability: 'Profundidade criativa', pro: 'Útil para cenas complexas, sistemas de design, campanhas e edição precisa.', lite: 'Útil para testes rápidos de prompt e rascunhos simples.' },
      { capability: 'Foco do modelo', pro: 'Geração cinematográfica, edição precisa, controle em camadas, pesquisa e composição baseada em raciocínio.', lite: 'Criação rápida de imagens e experimentos criativos leves.' },
      { capability: 'Uso comercial', pro: 'Campanhas, cenas ecommerce, sistemas de marca, peças sociais e frames de vídeo.', lite: 'Conceitos rápidos, testes de prompt e produção leve.' },
    ], note: 'Esta comparação foca usos e decisões de fluxo.' },
    howTo: { title: 'Como criar imagens com Seedream 5.0 Pro', steps: ['Comece com o gerador Seedream 5.0 Pro acima.', 'Descreva a imagem comercial final, não detalhes internos do modelo.', 'Escolha proporção e resolução conforme o canal de publicação.', 'Adicione assunto, cena, iluminação, materiais e composição concretos.', 'Gere, revise e ajuste o prompt para seu caso de uso.'] },
    prompts: { title: 'Prompts para Seedream 5.0 Pro', text: 'Use estes exemplos como ponto de partida para gerar imagens com Seedream 5.0 Pro.' },
    related: { text: 'Teste outros modelos do Toolaze para rascunhos rápidos, fluxos Seedream anteriores ou geração de imagem semelhante.' },
    faq: { items: [
      { q: 'Posso usar Seedream 5.0 Pro agora no Toolaze?', a: 'Sim. O gerador desta página usa Seedream 5.0 Pro para fluxos compatíveis de texto para imagem e imagem para imagem.' },
      { q: 'Quais imagens combinam melhor com Seedream 5.0 Pro?', a: 'Visuais de campanha, cenas ecommerce, sistemas de marca, criatividade social, edições estruturadas e frames cinematográficos.' },
      { q: 'Como escrever bons prompts?', a: 'Descreva assunto, cenário, iluminação, câmera, materiais, layout e espaços de texto com clareza.' },
      { q: 'Serve para marca e ecommerce?', a: 'Sim. É útil para cenas de produto, visuais de campanha e estilos de marca repetíveis.' },
    ] },
    cta: { label: 'Gerar agora', title: 'Crie imagens Seedream 5.0 Pro online', text: 'Use Seedream 5.0 Pro para campanhas, produto, redes sociais e frames cinematográficos.', button: 'Começar a gerar' },
  },
  fr: {
    metadata: {
      title: 'Seedream 5.0 Pro générateur d’images IA | Toolaze',
      description: 'Utilisez Seedream 5.0 Pro sur Toolaze pour la génération cinématographique, l’édition précise et les visuels commerciaux structurés.',
      openGraphDescription: 'Générez des images avec Seedream 5.0 Pro sur Toolaze.',
      twitterDescription: 'Créez des images Seedream 5.0 Pro sur Toolaze.',
    },
    schema: { howToName: 'Comment créer des images Seedream 5.0 Pro sur Toolaze' },
    hero: { suffix: 'générateur d’images IA', description: 'Utilisez Seedream 5.0 Pro pour créer des visuels de campagne, des éditions de scène, des images de marque, des assets ecommerce et des concepts de photogrammes vidéo.', statusLabel: 'Disponible sur Toolaze', liveModelLabel: 'Modèle actif', liveModelValue: 'Seedream 5.0 Pro' },
    notice: { title: 'Créez avec Seedream 5.0 Pro sur Toolaze', text: 'Seedream 5.0 Pro convient à la génération cinématographique, l’édition précise, le contrôle multicouche et la composition raisonnée pour la production visuelle commerciale.' },
    comparison: { text: 'Comparez Pro et Lite selon le type de travail visuel.', rows: [
      { capability: 'Rôle du flux', pro: 'Modèle avancé pour le travail cinématographique, commercial et structuré.', lite: 'Modèle rapide pour la création quotidienne et les essais légers.' },
      { capability: 'Profondeur créative', pro: 'Utile pour scènes complexes, systèmes de design, campagnes et édition précise.', lite: 'Utile pour tests rapides de prompts et brouillons simples.' },
      { capability: 'Orientation du modèle', pro: 'Génération cinématographique, édition précise, contrôle multicouche, recherche et composition raisonnée.', lite: 'Création rapide d’images et expérimentations créatives légères.' },
      { capability: 'Usage commercial', pro: 'Campagnes, scènes ecommerce, systèmes de marque, créations sociales et photogrammes vidéo.', lite: 'Concepts rapides, tests de prompts et production légère.' },
    ], note: 'Cette comparaison se concentre sur les usages et le choix du flux.' },
    howTo: { title: 'Comment créer des images avec Seedream 5.0 Pro', steps: ['Commencez avec le générateur Seedream 5.0 Pro ci-dessus.', 'Décrivez l’image commerciale finale, pas les détails internes du modèle.', 'Choisissez le ratio et la résolution selon le canal de publication.', 'Ajoutez le sujet, la scène, la lumière, les matériaux et la composition.', 'Générez, vérifiez, puis ajustez le prompt selon votre usage.'] },
    prompts: { title: 'Prompts Seedream 5.0 Pro', text: 'Utilisez ces exemples comme point de départ pour générer des images Seedream 5.0 Pro.' },
    related: { text: 'Essayez d’autres modèles Toolaze pour des brouillons rapides, des workflows Seedream existants ou une génération d’image proche.' },
    faq: { items: [
      { q: 'Puis-je utiliser Seedream 5.0 Pro sur Toolaze maintenant ?', a: 'Oui. Le générateur de cette page utilise Seedream 5.0 Pro pour les flux compatibles texte vers image et image vers image.' },
      { q: 'Quels types d’images conviennent à Seedream 5.0 Pro ?', a: 'Visuels de campagne, scènes ecommerce, systèmes de marque, créations sociales, éditions structurées et photogrammes cinématographiques.' },
      { q: 'Comment écrire de bons prompts ?', a: 'Décrivez clairement le sujet, le décor, la lumière, la caméra, les matériaux, la mise en page et les espaces de texte.' },
      { q: 'Est-ce utile pour marque et ecommerce ?', a: 'Oui. C’est utile pour scènes produit, visuels de campagne et styles de marque répétables.' },
    ] },
    cta: { label: 'Générer maintenant', title: 'Créez des images Seedream 5.0 Pro en ligne', text: 'Utilisez Seedream 5.0 Pro pour campagnes, produits, réseaux sociaux et photogrammes cinématographiques.', button: 'Commencer à générer' },
  },
  ko: {
    metadata: {
      title: 'Seedream 5.0 Pro AI 이미지 생성기 | Toolaze',
      description: 'Toolaze에서 Seedream 5.0 Pro로 시네마틱 이미지, 정밀 편집, 구조화된 상업용 비주얼을 만드세요.',
      openGraphDescription: 'Toolaze에서 Seedream 5.0 Pro 이미지를 생성하세요.',
      twitterDescription: 'Seedream 5.0 Pro 이미지를 Toolaze에서 생성하세요.',
    },
    schema: { howToName: 'Toolaze에서 Seedream 5.0 Pro 이미지를 만드는 방법' },
    hero: { suffix: 'AI 이미지 생성기', description: 'Seedream 5.0 Pro로 캠페인 비주얼, 구조화된 장면 편집, 브랜드 이미지, 전자상거래 에셋, 영상 프레임 콘셉트를 만들 수 있습니다.', statusLabel: 'Toolaze에서 사용 가능', liveModelLabel: '사용 모델', liveModelValue: 'Seedream 5.0 Pro' },
    notice: { title: 'Toolaze에서 Seedream 5.0 Pro로 생성', text: 'Seedream 5.0 Pro는 시네마틱 생성, 정밀 편집, 다층 장면 제어, 추론 기반 구성을 활용한 상업용 이미지 제작에 적합합니다.' },
    comparison: { text: '이미지 작업 유형에 따라 Pro와 Lite를 비교하세요.', rows: [
      { capability: '워크플로 역할', pro: '시네마틱, 상업용, 구조화된 이미지 작업을 위한 고급 모델.', lite: '일상 이미지 제작과 가벼운 실험을 위한 빠른 모델.' },
      { capability: '창작 깊이', pro: '복잡한 장면, 디자인 시스템, 캠페인 구성, 정밀 편집에 적합합니다.', lite: '빠른 프롬프트 테스트와 간단한 초안에 적합합니다.' },
      { capability: '모델 초점', pro: '시네마틱 생성, 정밀 편집, 다층 제어, 조사, 추론 기반 구성.', lite: '빠른 일상 이미지 제작과 가벼운 창작 실험.' },
      { capability: '상업적 활용', pro: '캠페인 비주얼, 전자상거래 장면, 브랜드 시스템, 소셜 크리에이티브, 영상 프레임 계획.', lite: '빠른 콘셉트, 프롬프트 테스트, 가벼운 이미지 제작.' },
    ], note: '이 비교는 사용 사례와 워크플로 선택에 집중합니다.' },
    howTo: { title: 'Seedream 5.0 Pro 이미지 생성 방법', steps: ['위 Seedream 5.0 Pro 생성기에서 시작합니다.', '내부 모델 정보가 아니라 최종 상업 이미지를 설명합니다.', '게시 채널에 맞게 비율과 해상도를 선택합니다.', '피사체, 장면, 조명, 소재, 구성을 구체적으로 입력합니다.', '결과를 생성하고 검토한 뒤 목적에 맞게 프롬프트를 조정합니다.'] },
    prompts: { title: 'Seedream 5.0 Pro 프롬프트 예시', text: '이 예시를 Seedream 5.0 Pro 이미지 생성의 출발점으로 사용하세요.' },
    related: { text: '빠른 초안, 기존 Seedream 워크플로, 유사한 고품질 이미지 생성을 위해 다른 Toolaze 모델도 사용해 보세요.' },
    faq: { items: [
      { q: '지금 Toolaze에서 Seedream 5.0 Pro를 사용할 수 있나요?', a: '네. 이 페이지의 생성기는 지원되는 텍스트-이미지 및 이미지-이미지 워크플로에서 Seedream 5.0 Pro를 사용합니다.' },
      { q: 'Seedream 5.0 Pro는 어떤 이미지에 적합한가요?', a: '캠페인 비주얼, 전자상거래 장면, 브랜드 시스템, 소셜 크리에이티브, 구조화 편집, 영상 계획용 시네마틱 스틸에 적합합니다.' },
      { q: '좋은 프롬프트는 어떻게 쓰나요?', a: '피사체, 배경, 조명, 카메라 각도, 소재, 레이아웃, 텍스트 공간을 명확히 설명하세요.' },
      { q: '브랜드와 전자상거래 이미지에도 사용할 수 있나요?', a: '네. 제품 장면, 캠페인 키 비주얼, 제어된 소재 표현, 반복 가능한 브랜드 스타일에 유용합니다.' },
    ] },
    cta: { label: '지금 생성', title: 'Seedream 5.0 Pro 이미지를 온라인으로 생성', text: 'Seedream 5.0 Pro로 캠페인, 제품 장면, 소셜 게시물, 시네마틱 스틸을 만드세요.', button: '생성 시작' },
  },
  it: {
    metadata: {
      title: 'Seedream 5.0 Pro generatore immagini IA | Toolaze',
      description: 'Usa Seedream 5.0 Pro su Toolaze per generazione cinematografica, editing preciso e visual commerciali strutturati.',
      openGraphDescription: 'Genera immagini con Seedream 5.0 Pro su Toolaze.',
      twitterDescription: 'Crea immagini con Seedream 5.0 Pro su Toolaze.',
    },
    schema: { howToName: 'Come creare immagini Seedream 5.0 Pro su Toolaze' },
    hero: { suffix: 'generatore immagini IA', description: 'Usa Seedream 5.0 Pro per creare visual di campagna, editing di scene, immagini brand, asset ecommerce e concept di frame video.', statusLabel: 'Disponibile su Toolaze', liveModelLabel: 'Modello attivo', liveModelValue: 'Seedream 5.0 Pro' },
    notice: { title: 'Crea con Seedream 5.0 Pro su Toolaze', text: 'Seedream 5.0 Pro è adatto a generazione cinematografica, editing preciso, controllo multilivello e composizione ragionata per produzione visual commerciale.' },
    comparison: { text: 'Confronta Pro e Lite in base al tipo di lavoro visuale.', rows: [
      { capability: 'Ruolo nel workflow', pro: 'Modello avanzato per lavoro cinematografico, commerciale e strutturato.', lite: 'Modello rapido per creazione quotidiana ed esperimenti leggeri.' },
      { capability: 'Profondità creativa', pro: 'Utile per scene complesse, sistemi di design, campagne ed editing preciso.', lite: 'Utile per test rapidi di prompt e bozze semplici.' },
      { capability: 'Focus del modello', pro: 'Generazione cinematografica, editing preciso, controllo multilivello, ricerca e composizione ragionata.', lite: 'Creazione rapida di immagini ed esperimenti creativi leggeri.' },
      { capability: 'Uso commerciale', pro: 'Campagne, scene ecommerce, sistemi di marca, creatività social e frame video.', lite: 'Concetti rapidi, test di prompt e produzione leggera.' },
    ], note: 'Questo confronto si concentra su casi d’uso e scelte di workflow.' },
    howTo: { title: 'Come creare immagini con Seedream 5.0 Pro', steps: ['Inizia dal generatore Seedream 5.0 Pro sopra.', 'Descrivi l’immagine commerciale finale, non dettagli interni del modello.', 'Scegli rapporto e risoluzione in base al canale di pubblicazione.', 'Aggiungi soggetto, scena, illuminazione, materiali e composizione concreti.', 'Genera, rivedi e regola il prompt per il tuo caso d’uso.'] },
    prompts: { title: 'Prompt per Seedream 5.0 Pro', text: 'Usa questi esempi come punto di partenza per generare immagini con Seedream 5.0 Pro.' },
    related: { text: 'Prova altri modelli Toolaze per bozze rapide, workflow Seedream precedenti o generazione immagine affine.' },
    faq: { items: [
      { q: 'Posso usare Seedream 5.0 Pro ora su Toolaze?', a: 'Sì. Il generatore di questa pagina usa Seedream 5.0 Pro per workflow supportati testo-immagine e immagine-immagine.' },
      { q: 'Quali immagini funzionano meglio con Seedream 5.0 Pro?', a: 'Visual di campagna, scene ecommerce, sistemi di marca, creatività social, editing strutturati e frame cinematografici.' },
      { q: 'Come scrivo buoni prompt?', a: 'Descrivi chiaramente soggetto, scenario, luce, camera, materiali, layout e spazi per testo.' },
      { q: 'Serve per brand ed ecommerce?', a: 'Sì. È utile per scene prodotto, visual di campagna e stili di marca ripetibili.' },
    ] },
    cta: { label: 'Genera ora', title: 'Crea immagini Seedream 5.0 Pro online', text: 'Usa Seedream 5.0 Pro per campagne, prodotto, social e frame cinematografici.', button: 'Inizia a generare' },
  },
}

function normalizeLocale(locale: string): Seedream50ProLocale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return SEEDREAM_5_0_PRO_LOCALES.includes(locale as Seedream50ProLocale)
    ? (locale as Seedream50ProLocale)
    : 'en'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepMerge<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) return base
  if (Array.isArray(base) && Array.isArray(override)) return override as T
  if (!isRecord(base) || !isRecord(override)) return (override ?? base) as T
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

export function getSeedream50ProLandingCopy(locale: string): Seedream50ProLandingCopy {
  const normalized = normalizeLocale(locale)
  const baseCopy = normalized === 'en'
    ? en
    : deepMerge(deepMerge(en, simpleOverrides[normalized]), fullSectionOverrides[normalized])
  return deepMerge(baseCopy, liveAvailabilityOverrides[normalized])
}

export function getSeedream50ProPageMetadata(
  locale: string,
  canonicalUrl = 'https://toolaze.com/model/seedream-5-0-pro',
): Metadata {
  const copy = getSeedream50ProLandingCopy(locale)

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
