import type { Metadata } from 'next'

export const WAN_2_7_IMAGE_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type Wan27ImageLocale = (typeof WAN_2_7_IMAGE_LOCALES)[number]

type FeatureItem = {
  slot: string
  title: string
  paragraphs: string[]
}

type GalleryItem = {
  slot: string
  title: string
  text: string
}

type ComparisonRow = {
  capability: string
  wan: string
  gpt: string
  seedream: string
  nano: string
}

type PromptExample = {
  slot: string
  title: string
  prompt: string
}

type YoutubeExample = {
  title: string
  creator: string
  href: string
  videoId: string
  text: string
}

type RedditCopyItem = {
  title: string
  text: string
}

type XCopyItem = {
  title: string
  body: string
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

export type Wan27ImageLandingCopy = {
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
    rows: ComparisonRow[]
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
  youtube: {
    title: string
    text: string
    watch: string
    examples: YoutubeExample[]
  }
  reddit: {
    title: string
    text: string
    communityDiscussion: string
    openDiscussion: string
    items: RedditCopyItem[]
  }
  x: {
    title: string
    text: string
    verified: string
    follow: string
    watch: string
    monthYear: string
    likes: string
    reply: string
    copyLink: string
    read: string
    replies: string
    items: XCopyItem[]
  }
  related: {
    title: string
    tryNow: string
    links: RelatedLink[]
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

const en: Wan27ImageLandingCopy = {
  metadata: {
    title: 'Wan 2.7 Image Generator | Free AI Image Tool',
    description:
      'Use Wan 2.7 Image online on Toolaze for free. Generate and edit images with thinking mode, readable text layouts, multi-reference inputs, and 2K to 4K output options.',
    openGraphDescription:
      'Create and edit images with Wan 2.7 Image on Toolaze, including text-to-image, reference-guided editing, multi-image input, and structured visual layouts.',
    twitterDescription:
      'Try Wan 2.7 Image online for text-to-image, image editing, multi-reference input, and structured visual design.',
  },
  breadcrumbs: {
    home: 'Home',
    model: 'Model',
    current: 'Wan 2.7 Image',
  },
  schema: {
    pageName: 'Wan 2.7 Image Generator',
    appName: 'Wan 2.7 Image on Toolaze',
    howToName: 'How to use Wan 2.7 Image on Toolaze',
  },
  hero: {
    modelName: 'Wan 2.7 Image',
    suffix: 'Generator',
    description:
      'Use Wan 2.7 Image on Toolaze to create images from prompts, edit uploaded references, combine multiple inputs, and generate structured visuals with prompt reasoning and text layout control.',
  },
  whatIs: {
    title: 'What Is Wan 2.7 Image?',
    paragraphs: [
      'Wan 2.7 Image is Alibaba\'s image generation and editing model family for text-to-image, image-to-image editing, multi-reference creation, and consistent visual sets. It handles prompts that define layout, visible text, subject placement, and reference image roles.',
      'On Toolaze, Wan 2.7 Image works inside a browser generator: write a prompt, choose an aspect ratio and resolution, upload reference images when needed, then generate and download the result without leaving the page.',
    ],
  },
  features: {
    title: 'Key Features of Wan 2.7 Image',
    text:
      'Use Wan 2.7 Image when a prompt needs more than a single subject description: structured posters, product visuals, text-heavy graphics, guided edits, and multi-reference compositions.',
    items: [
      {
        slot: 'thinking-mode',
        title: 'Thinking Mode for Complex Prompts',
        paragraphs: [
          'Wan 2.7 Image supports thinking mode in eligible text-to-image scenarios, helping the model interpret longer prompts, layout rules, object relationships, and visual constraints before producing the final image.',
          'Use it for posters, educational graphics, campaign concepts, and prompts that describe several subjects, exact text, a background system, and composition requirements at once.',
        ],
      },
      {
        slot: 'text-rendering',
        title: 'Text Rendering and Structured Designs',
        paragraphs: [
          'Wan 2.7 Image is a practical choice for title-led graphics, labels, menus, social cards, event posters, and simple information graphics that depend on readable text and clear layout.',
          'Generated text should still be reviewed before publishing, especially when small legal copy, addresses, prices, or brand-critical wording must be exact.',
        ],
      },
      {
        slot: 'image-editing',
        title: 'Image Generation and Prompt-Based Editing',
        paragraphs: [
          'Wan 2.7 Image supports both creating new images from prompts and editing existing images with natural language instructions. You can upload a reference and describe what to change while keeping the subject, layout, or visual direction stable.',
          'Use it for product edits, background changes, localized revisions, composition cleanup, and design variations from an existing visual.',
        ],
      },
      {
        slot: 'multi-reference',
        title: 'Multi-Reference Image Fusion',
        paragraphs: [
          'Wan 2.7 Image supports up to 9 input images for reference-guided generation and editing. You can combine a product photo, style reference, background direction, character sheet, logo, or material sample in one prompt.',
          'For best results, name what each reference controls, such as subject identity, style, composition, background, packaging, or color palette.',
        ],
      },
      {
        slot: 'resolution',
        title: '2K and 4K Output Options',
        paragraphs: [
          'The standard Wan 2.7 Image mode supports 1K and 2K output for generation and editing. The Pro text-to-image path supports 4K output when no reference image is used.',
          'Use 2K for reference edits and fast campaign drafts. Choose 4K for text-to-image posters, detailed product boards, or large-format concepts when the selected generation mode supports it.',
        ],
      },
      {
        slot: 'image-sets',
        title: 'Consistent Image Sets',
        paragraphs: [
          'Wan 2.7 Image can help plan related visuals such as storyboard frames, product catalog variations, children\'s book concepts, slide visuals, and multi-card campaigns.',
          'On Toolaze, use clear naming in your prompt so each requested frame, angle, or variation has a defined role.',
        ],
      },
    ],
  },
  gallery: {
    title: 'Example Gallery for Wan 2.7 Image',
    text:
      'See common Wan 2.7 Image use cases for commercial design, dense text, multi-reference editing, and structured image work.',
    examples: [
      {
        slot: 'gallery-product-ad',
        title: 'Product Advertising Visual',
        text: 'Create clean commercial images with a hero product, readable headline, benefit callouts, and controlled studio lighting.',
      },
      {
        slot: 'gallery-event-poster',
        title: 'Event Poster Layout',
        text: 'Generate posters with title hierarchy, date, venue, speaker blocks, and visual rhythm.',
      },
      {
        slot: 'gallery-packaging',
        title: 'Packaging Concept',
        text: 'Test label systems, materials, brand colors, product surfaces, and retail presentation ideas.',
      },
      {
        slot: 'gallery-infographic',
        title: 'Educational Infographic',
        text: 'Build simple learning graphics with icons, numbered steps, short labels, and clean visual hierarchy.',
      },
      {
        slot: 'gallery-character',
        title: 'Character Reference Edit',
        text: 'Use references to keep a subject or character consistent while changing pose, outfit, or scene.',
      },
      {
        slot: 'gallery-interior',
        title: 'Interior Design Revision',
        text: 'Transform a room reference into a different style while preserving layout and camera angle.',
      },
      {
        slot: 'gallery-storyboard',
        title: 'Storyboard Frame',
        text: 'Plan campaign frames, scene beats, thumbnails, and narrative visuals with a consistent direction.',
      },
      {
        slot: 'gallery-brand-board',
        title: 'Brand Visual Board',
        text: 'Combine typography, palette, product imagery, and campaign notes into one structured concept board.',
      },
    ],
  },
  comparison: {
    title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro',
    text:
      'Use this table as an official-spec first comparison. When a public official page does not list a hard limit, the table says so.',
    capabilityHeader: 'Capability',
    rows: [
      {
        capability: 'Max output resolution',
        wan: 'Pro: 4K for text-to-image; image input/edit: 2K. Standard: 2K',
        gpt: 'Up to 3840px edge and 8.29MP, including 3840x2160',
        seedream: 'Official Seed page does not list a public max',
        nano: '1K, 2K, 4K Preview',
      },
      {
        capability: 'Reference images',
        wan: '0 to 9 input images',
        gpt: 'Up to 16 images for GPT image edit workflows',
        seedream: 'Multi-image editing; official max not listed',
        nano: 'Maximum 14 images per prompt',
      },
      {
        capability: 'Image editing',
        wan: 'Supported with prompt, image input, and optional boxes',
        gpt: 'Supported through image edits and reference images',
        seedream: 'Supported; official page highlights detail preservation',
        nano: 'Supported, including multi-turn image editing',
      },
      {
        capability: 'Aspect ratio and size',
        wan: 'Custom ratio 1:8 to 8:1 within pixel limits',
        gpt: 'Custom size; ratio up to 3:1; edges must be multiples of 16',
        seedream: 'Official page shows multi-format design use; exact API limits not listed',
        nano: '1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9',
      },
      {
        capability: 'Official strength',
        wan: 'Thinking mode, image sets, color palette control, multi-reference input',
        gpt: 'Flexible high-resolution sizes, high-fidelity inputs, image edits',
        seedream: 'Reference consistency, typography, dense text, multi-image editing',
        nano: 'Reasoning, Search grounding, C2PA, complex multi-turn editing',
      },
    ],
  },
  howTo: {
    title: 'How to Use Wan 2.7 Image on Toolaze',
    steps: [
      'Open the Wan 2.7 Image generator and choose text-to-image or image-to-image mode.',
      'Write a prompt that names the asset type, subject, visible text, layout, aspect ratio, lighting, and style.',
      'Upload reference images when you want the model to preserve a subject, product, room, logo, or visual direction.',
      'Select resolution and aspect ratio, generate the image, then download or refine the prompt for another version.',
    ],
  },
  prompts: {
    title: 'Best Wan 2.7 Image Prompt Examples',
    text:
      'Use these examples as starting points for the tasks where Wan 2.7 Image is strongest: structured layouts, text graphics, editing, reference fusion, and consistent visual systems.',
    copyButton: 'Copy',
    copiedButton: 'Copied',
    examples: [
      {
        slot: 'prompt-product-ad',
        title: 'Product Launch Poster',
        prompt:
          'Create a vertical product launch poster for a premium sparkling yuzu drink. Include a readable headline "Yuzu Spark", subtitle "bright citrus, zero sugar", one hero can with condensation, sliced yuzu fruit, clean white and citrus-yellow background, small benefit callouts, and polished commercial lighting.',
      },
      {
        slot: 'prompt-text-poster',
        title: 'Dense Text Event Poster',
        prompt:
          'Create a modern event poster for "Future Design Week 2026". Include readable schedule blocks for three sessions, speaker names, date, venue, ticket note, and a bold abstract visual system. Use strong hierarchy, generous spacing, and an editorial design style.',
      },
      {
        slot: 'prompt-reference-fusion',
        title: 'Multi-Reference Style Fusion',
        prompt:
          'Use the uploaded product image as the exact product reference, the second image as lighting reference, and the third image as color palette reference. Create a campaign visual that keeps the product shape unchanged while applying the lighting and color direction from the references.',
      },
      {
        slot: 'prompt-character-edit',
        title: 'Character Reference Edit',
        prompt:
          'Use the uploaded character reference. Keep the same face, hairstyle, body proportions, and outfit identity. Change the scene to a rainy neon street at night, add reflective pavement, cinematic rim light, and a calm confident pose. Do not change the character identity.',
      },
      {
        slot: 'prompt-infographic',
        title: 'Educational Infographic',
        prompt:
          'Create a clean infographic explaining how a solar panel converts sunlight into electricity. Use four numbered steps, short readable labels, simple icons, a blue and yellow palette, white background, and clear hierarchy for classroom use.',
      },
      {
        slot: 'prompt-interior',
        title: 'Interior Design Edit',
        prompt:
          'Use the uploaded living room photo as a reference. Keep the camera angle, windows, walls, and furniture positions. Redesign the room in a calm Japandi style with oak wood, linen textures, warm indirect lighting, neutral walls, and a tidy magazine-ready finish.',
      },
    ],
  },
  youtube: {
    title: 'Wan 2.7 Image Videos on YouTube',
    text:
      'Watch selected YouTube videos that test Wan 2.7 Image color control, prompt handling, face realism, editing behavior, and high-resolution output.',
    watch: 'Watch on YouTube',
    examples: [
      {
        title: 'Wan 2.7 Image color control test',
        creator: 'All About AI',
        href: 'https://www.youtube.com/watch?v=bO-pN6fw35s',
        videoId: 'bO-pN6fw35s',
        text: 'A focused walkthrough of Wan 2.7 Image color control, palette handling, and model behavior in practical image-generation tests.',
      },
      {
        title: 'Wan 2.7 Image complete guide and test',
        creator: 'AI Samson',
        href: 'https://www.youtube.com/watch?v=RERsGjQrQ6E',
        videoId: 'RERsGjQrQ6E',
        text: 'A longer test of Wan 2.7 Image quality, prompt response, generation modes, and visual output across several examples.',
      },
      {
        title: 'Wan 2.7 Image full testing',
        creator: 'AI Creator School',
        href: 'https://www.youtube.com/watch?v=MgwMFfK9M74',
        videoId: 'MgwMFfK9M74',
        text: 'A creator test that looks at Wan 2.7 Image output quality, reference behavior, and where the model fits compared with other image tools.',
      },
    ],
  },
  reddit: {
    title: 'Wan 2.7 Image Discussions on Reddit',
    text:
      'Browse real Reddit posts about Wan 2.7 Image availability, launch reactions, early tests, and community questions. Each card keeps media from its original Reddit thread.',
    communityDiscussion: 'Reddit discussion',
    openDiscussion: 'Open Reddit thread',
    items: [
      {
        title: 'Wan 2.7 and Wan 2.7 Pro image models are now available',
        text: 'A r/budgetpixel thread announcing Wan 2.7 and Wan 2.7 Pro availability, with the original Reddit preview images kept together in one card.',
      },
      {
        title: 'Wan 2.7 Image is out. Has anyone tested it yet?',
        text: 'A r/AtlasCloudAI question thread for early user testing, useful for reading practical reactions beyond official model notes.',
      },
      {
        title: 'Wan 2.7 Image just dropped',
        text: 'A r/ArtificialInteligence launch discussion about Wan 2.7 Image and what users expect from the next Wan video model.',
      },
      {
        title: 'Alibaba launches Wan 2.7 Image for sharper visuals',
        text: 'A r/aicuriosity post covering the Wan 2.7 Image release and positioning it as a newer image model for sharper, smarter visuals.',
      },
    ],
  },
  x: {
    title: 'Wan 2.7 Image Examples on X',
    text:
      'See X posts with real Wan 2.7 Image announcements, creator tests, and model notes. Cards use actual post media and profile avatars.',
    verified: 'Verified',
    follow: 'Follow',
    watch: 'View image',
    monthYear: 'June 2026',
    likes: 'likes',
    reply: 'Reply',
    copyLink: 'Copy link',
    read: 'Read',
    replies: 'replies',
    items: [
      {
        title: 'Official Wan2.7-Image announcement',
        body: 'The official Wan account introduces Wan2.7-Image as a unified model for generation, editing, text rendering, color control, and image sets.',
      },
      {
        title: 'Creator test with reference faces',
        body: 'A creator test in Japanese noting natural reference-face behavior and comparing detail against other image models.',
      },
      {
        title: 'Wan 2.7 model mode summary',
        body: 'A public X post summarizing Wan 2.7 text-to-image, image edit, Pro text-to-image, and Pro edit modes.',
      },
      {
        title: 'Wan 2.7 Image on Poe',
        body: 'Poe announces Wan 2.7 Image availability and highlights cohesive image sets, consistent characters, style, context, and bounding box editing.',
      },
      {
        title: 'Early creator evaluation',
        body: 'A creator shares early Wan 2.7 Image tests and compares where it may sit against Nano Banana and Seedream-style image models.',
      },
      {
        title: 'Feature breakdown from Alisa Qian',
        body: 'A concise feature breakdown covering facial control, palette-based color control, multilingual text rendering, and interactive editing.',
      },
      {
        title: 'Wan2.7-Image on Design Arena',
        body: 'Design Arena announces Wan2.7-Image availability with notes on detail, prompt alignment, stylistic control, and model variants.',
      },
      {
        title: 'WaveSpeed output set',
        body: 'A WaveSpeedAI post showing Wan 2.7 Image outputs in a multi-image example set, useful for checking generation range.',
      },
      {
        title: 'Wan 2.7 Image on fal',
        body: 'A fal-related post testing Wan 2.7 Image on a complex city scene and noting realistic faces, color extraction, multilingual text, and visual editing.',
      },
      {
        title: 'Wan2.7 creator webinar',
        body: 'The official Wan account promotes a Wan2.7 creator webinar about next-generation workflows and AI-agent-assisted creativity.',
      },
    ],
  },
  related: {
    title: 'Explore More AI Image Models',
    tryNow: 'Try Now',
    links: [
      {
        title: 'GPT Image 2',
        href: '/model/gpt-image-2',
        text: 'Use GPT Image 2 for text-rich visuals, editing, UI-style compositions, and clean layout control.',
      },
      {
        title: 'Seedream 4.5',
        href: '/model/seedream-4-5',
        text: 'Try Seedream 4.5 for product visuals, posters, typography-rich layouts, and reference-guided edits.',
      },
      {
        title: 'Nano Banana Pro',
        href: '/model/nano-banana-pro',
        text: 'Create high-resolution image assets and reference-guided visual drafts with Nano Banana Pro.',
      },
      {
        title: 'Nano Banana 2',
        href: '/model/nano-banana-2',
        text: 'Use Nano Banana 2 for fast everyday image generation and quick visual variations.',
      },
      {
        title: 'AI Models Hub',
        href: '/model',
        text: 'Browse Toolaze image and video model pages for a broader model comparison.',
      },
    ],
  },
  faq: {
    title: 'FAQs About Wan 2.7 Image',
    items: [
      {
        q: 'Is Wan 2.7 Image free to use on Toolaze?',
        a: 'Yes. You can try Wan 2.7 Image on Toolaze for free. Usage may vary by quota, selected quality settings, model availability, or rate limits.',
      },
      {
        q: 'Does Wan 2.7 Image support image editing?',
        a: 'Yes. Wan 2.7 Image supports prompt-based image editing with uploaded references, including workflows where the prompt describes what to preserve and what to change.',
      },
      {
        q: 'How many reference images can Wan 2.7 Image use?',
        a: 'Wan 2.7 Image supports up to 9 input images in multi-reference workflows. Use clear prompt wording to assign a role to each reference.',
      },
      {
        q: 'Does Wan 2.7 Image support 4K output?',
        a: 'The standard workflow supports 1K and 2K. The Pro text-to-image path supports 4K when no input image is used. Reference-based editing should use 1K or 2K.',
      },
      {
        q: 'What prompts work best with Wan 2.7 Image?',
        a: 'Use structured prompts that describe the asset type, subject, exact visible text, layout, references, lighting, background, aspect ratio, and what must stay unchanged.',
      },
    ],
  },
  cta: {
    title: 'Create with Wan 2.7 Image on Toolaze',
    text:
      'Start with a prompt, add references when needed, and use Wan 2.7 Image for structured graphics, commercial visuals, and image edits.',
    button: 'Try Wan 2.7 Image',
    label: 'Wan 2.7 Image creative workflow preview',
  },
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

function mergeCopy<T>(base: T, override: DeepPartial<T>): T {
  const mergeValue = (baseValue: unknown, overrideValue: unknown): unknown => {
    if (overrideValue === undefined) return baseValue
    if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
      return baseValue.map((item, index) => mergeValue(item, overrideValue[index])).concat(overrideValue.slice(baseValue.length))
    }
    if (Array.isArray(overrideValue)) return overrideValue
    if (
      baseValue &&
      overrideValue &&
      typeof baseValue === 'object' &&
      typeof overrideValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      return Object.fromEntries(
        Object.keys({ ...(baseValue as Record<string, unknown>), ...(overrideValue as Record<string, unknown>) }).map((key) => [
          key,
          mergeValue((baseValue as Record<string, unknown>)[key], (overrideValue as Record<string, unknown>)[key]),
        ]),
      )
    }
    return overrideValue
  }

  return mergeValue(base, override) as T
}

const localizedOverrides: Record<Exclude<Wan27ImageLocale, 'en'>, DeepPartial<Wan27ImageLandingCopy>> = {
  de: {
    metadata: {
      title: 'Wan 2.7 Image Generator | Kostenloses KI-Bildtool',
      description: 'Nutzen Sie Wan 2.7 Image online auf Toolaze kostenlos. Erstellen und bearbeiten Sie Bilder mit Thinking Mode, Textlayouts, Mehrfachreferenzen und 2K- bis 4K-Optionen.',
      openGraphDescription: 'Erstellen und bearbeiten Sie Bilder mit Wan 2.7 Image auf Toolaze, inklusive Text-zu-Bild, referenzgeführter Bearbeitung, mehreren Eingabebildern und strukturierten Layouts.',
      twitterDescription: 'Testen Sie Wan 2.7 Image online für Text-zu-Bild, Bildbearbeitung, Mehrfachreferenzen und strukturiertes Design.',
    },
    breadcrumbs: { home: 'Startseite', model: 'Modelle', current: 'Wan 2.7 Image' },
    schema: { pageName: 'Wan 2.7 Image Generator', appName: 'Wan 2.7 Image auf Toolaze', howToName: 'So verwenden Sie Wan 2.7 Image auf Toolaze' },
    hero: {
      suffix: 'Generator',
      description: 'Nutzen Sie Wan 2.7 Image auf Toolaze, um Bilder aus Prompts zu erstellen, Referenzen zu bearbeiten, mehrere Eingaben zu kombinieren und strukturierte Visuals mit Prompt-Reasoning und Textlayout-Kontrolle zu erzeugen.',
    },
    whatIs: {
      title: 'Was ist Wan 2.7 Image?',
      paragraphs: [
        'Wan 2.7 Image ist Alibabas Modellfamilie für Bildgenerierung und Bildbearbeitung, darunter Text-zu-Bild, Bild-zu-Bild-Bearbeitung, Mehrfachreferenzen und konsistente Bildsets.',
        'Auf Toolaze läuft Wan 2.7 Image direkt im Browser: Prompt schreiben, Seitenverhältnis und Auflösung wählen, bei Bedarf Referenzen hochladen und das Ergebnis herunterladen.',
      ],
    },
    features: { title: 'Wichtige Funktionen von Wan 2.7 Image', text: 'Nutzen Sie Wan 2.7 Image für strukturierte Poster, Produktvisuals, textreiche Grafiken, geführte Bearbeitung und Mehrfachreferenzen.' },
    gallery: { title: 'Beispielgalerie für Wan 2.7 Image', text: 'Sehen Sie typische Wan 2.7 Image Anwendungen für kommerzielles Design, dichten Text, Mehrfachreferenzen und strukturierte Bilder.' },
    comparison: { title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro', text: 'Diese Tabelle priorisiert offizielle Spezifikationen. Wenn keine öffentliche harte Grenze genannt wird, steht dies klar in der Tabelle.', capabilityHeader: 'Funktion' },
    howTo: { title: 'So verwenden Sie Wan 2.7 Image auf Toolaze' },
    prompts: { title: 'Beste Wan 2.7 Image Prompt-Beispiele', text: 'Nutzen Sie diese Beispiele für strukturierte Layouts, Textgrafiken, Bearbeitung, Referenzfusion und konsistente Bildsysteme.', copyButton: 'Kopieren', copiedButton: 'Kopiert' },
    youtube: { title: 'Wan 2.7 Image Videos auf YouTube', text: 'Ausgewählte YouTube-Videos zu Farbkontrolle, Prompt-Verhalten, Gesichtsrealismus, Bearbeitung und hoher Auflösung.', watch: 'Auf YouTube ansehen' },
    reddit: { title: 'Wan 2.7 Image Diskussionen auf Reddit', text: 'Echte Reddit-Posts zu Verfügbarkeit, Launch-Reaktionen, frühen Tests und Community-Fragen.', communityDiscussion: 'Reddit-Diskussion', openDiscussion: 'Reddit-Thread öffnen' },
    x: { title: 'Wan 2.7 Image Beispiele auf X', text: 'X-Posts mit echten Wan 2.7 Image Ankündigungen, Creator-Tests und Modellhinweisen.', verified: 'Verifiziert', follow: 'Folgen', watch: 'Bild ansehen', monthYear: 'Juni 2026', likes: 'Likes', reply: 'Antworten', copyLink: 'Link kopieren', read: 'Lesen', replies: 'Antworten' },
    related: { title: 'Weitere KI-Bildmodelle entdecken', tryNow: 'Jetzt testen' },
    faq: { title: 'Häufige Fragen zu Wan 2.7 Image' },
    cta: { title: 'Mit Wan 2.7 Image auf Toolaze erstellen', text: 'Starten Sie mit einem Prompt, fügen Sie bei Bedarf Referenzen hinzu und erstellen Sie strukturierte Grafiken, kommerzielle Visuals und Bildbearbeitungen.', button: 'Wan 2.7 Image testen', label: 'Wan 2.7 Image Workflow-Vorschau' },
  },
  ja: {
    metadata: {
      title: 'Wan 2.7 Image ジェネレーター | 無料AI画像ツール',
      description: 'ToolazeでWan 2.7 Imageを無料でオンライン利用。Thinking Mode、読みやすい文字レイアウト、複数参照、2Kから4Kの出力オプションで画像を生成・編集できます。',
      openGraphDescription: 'ToolazeでWan 2.7 Imageを使い、テキストから画像、参照付き編集、複数画像入力、構造化されたビジュアルを作成できます。',
      twitterDescription: 'Wan 2.7 Imageをオンラインで試し、画像生成、編集、複数参照、構造化デザインに活用できます。',
    },
    breadcrumbs: { home: 'ホーム', model: 'モデル', current: 'Wan 2.7 Image' },
    schema: { pageName: 'Wan 2.7 Image ジェネレーター', appName: 'Toolaze の Wan 2.7 Image', howToName: 'ToolazeでWan 2.7 Imageを使う方法' },
    hero: { suffix: 'ジェネレーター', description: 'ToolazeでWan 2.7 Imageを使い、プロンプトから画像を作成し、参照画像を編集し、複数入力を組み合わせ、テキストレイアウト制御のある構造化ビジュアルを生成できます。' },
    whatIs: { title: 'Wan 2.7 Imageとは？', paragraphs: ['Wan 2.7 ImageはAlibabaの画像生成・編集モデル群で、テキストから画像、画像編集、複数参照、安定したビジュアルセットに対応します。', 'Toolazeではブラウザ内でプロンプト、比率、解像度、参照画像を指定し、その場で生成してダウンロードできます。'] },
    features: { title: 'Wan 2.7 Imageの主な機能', text: '構造化ポスター、商品ビジュアル、文字の多いグラフィック、参照付き編集、複数参照構成に向いています。' },
    gallery: { title: 'Wan 2.7 Imageの作例ギャラリー', text: '商用デザイン、密度の高い文字、複数参照編集、構造化画像の代表的な使い方を確認できます。' },
    comparison: { title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro', text: 'この表は公式仕様を優先します。公式ページに明確な上限がない場合は、その旨を記載します。', capabilityHeader: '機能' },
    howTo: { title: 'ToolazeでWan 2.7 Imageを使う方法' },
    prompts: { title: 'Wan 2.7 Imageのおすすめプロンプト例', text: '構造化レイアウト、文字入り画像、編集、参照融合、一貫したビジュアル制作の出発点として使えます。', copyButton: 'コピー', copiedButton: 'コピー済み' },
    youtube: { title: 'YouTubeのWan 2.7 Image動画', text: '色制御、プロンプト処理、顔のリアリズム、編集動作、高解像度出力を検証する動画です。', watch: 'YouTubeで見る' },
    reddit: { title: 'RedditのWan 2.7 Imageディスカッション', text: '公開状況、ローンチ反応、初期テスト、コミュニティの質問を扱う実際のReddit投稿です。', communityDiscussion: 'Redditの議論', openDiscussion: 'Redditスレッドを開く' },
    x: { title: 'XのWan 2.7 Image作例', text: '実際のWan 2.7 Image発表、クリエイターのテスト、モデルメモを含むX投稿です。', verified: '認証済み', follow: 'フォロー', watch: '画像を見る', monthYear: '2026年6月', likes: 'いいね', reply: '返信', copyLink: 'リンクをコピー', read: '読む', replies: '件の返信' },
    related: { title: '他のAI画像モデルを見る', tryNow: '今すぐ試す' },
    faq: { title: 'Wan 2.7 ImageのFAQ' },
    cta: { title: 'ToolazeでWan 2.7 Imageを作成', text: 'プロンプトから始め、必要に応じて参照を追加し、構造化グラフィック、商用ビジュアル、画像編集に活用できます。', button: 'Wan 2.7 Imageを試す', label: 'Wan 2.7 Imageの制作ワークフロー' },
  },
  es: {
    metadata: { title: 'Wan 2.7 Image Generator | Herramienta gratis de IA', description: 'Usa Wan 2.7 Image online en Toolaze gratis. Genera y edita imágenes con modo de razonamiento, texto legible, múltiples referencias y opciones de 2K a 4K.', openGraphDescription: 'Crea y edita imágenes con Wan 2.7 Image en Toolaze, con texto a imagen, edición guiada por referencias, entrada multiimagen y diseños estructurados.', twitterDescription: 'Prueba Wan 2.7 Image online para generación, edición, referencias múltiples y diseño estructurado.' },
    breadcrumbs: { home: 'Inicio', model: 'Modelo', current: 'Wan 2.7 Image' },
    schema: { pageName: 'Generador Wan 2.7 Image', appName: 'Wan 2.7 Image en Toolaze', howToName: 'Cómo usar Wan 2.7 Image en Toolaze' },
    hero: { suffix: 'Generator', description: 'Usa Wan 2.7 Image en Toolaze para crear imágenes desde prompts, editar referencias, combinar entradas y generar visuales estructurados con control de texto y composición.' },
    whatIs: { title: '¿Qué es Wan 2.7 Image?', paragraphs: ['Wan 2.7 Image es la familia de modelos de Alibaba para generación y edición de imágenes, con texto a imagen, edición, creación con múltiples referencias y conjuntos visuales consistentes.', 'En Toolaze funciona en el navegador: escribe un prompt, elige relación de aspecto y resolución, sube referencias si hace falta y descarga el resultado.'] },
    features: { title: 'Funciones clave de Wan 2.7 Image', text: 'Úsalo para pósters estructurados, imágenes de producto, gráficos con texto, ediciones guiadas y composiciones con múltiples referencias.' },
    gallery: { title: 'Galería de ejemplos de Wan 2.7 Image', text: 'Explora usos comunes para diseño comercial, texto denso, edición con referencias y trabajo visual estructurado.' },
    comparison: { title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro', text: 'La tabla prioriza especificaciones oficiales. Si una página oficial no publica un límite claro, se indica.', capabilityHeader: 'Capacidad' },
    howTo: { title: 'Cómo usar Wan 2.7 Image en Toolaze' },
    prompts: { title: 'Mejores prompts para Wan 2.7 Image', text: 'Usa estos ejemplos para layouts estructurados, gráficos con texto, edición, fusión de referencias y sistemas visuales consistentes.', copyButton: 'Copiar', copiedButton: 'Copiado' },
    youtube: { title: 'Videos de Wan 2.7 Image en YouTube', text: 'Videos seleccionados que prueban control de color, prompts, realismo facial, edición y salida de alta resolución.', watch: 'Ver en YouTube' },
    reddit: { title: 'Debates de Wan 2.7 Image en Reddit', text: 'Publicaciones reales sobre disponibilidad, reacciones de lanzamiento, primeras pruebas y preguntas de la comunidad.', communityDiscussion: 'Debate de Reddit', openDiscussion: 'Abrir hilo en Reddit' },
    x: { title: 'Ejemplos de Wan 2.7 Image en X', text: 'Publicaciones reales de X con anuncios, pruebas de creadores y notas del modelo.', verified: 'Verificado', follow: 'Seguir', watch: 'Ver imagen', monthYear: 'junio de 2026', likes: 'me gusta', reply: 'Responder', copyLink: 'Copiar enlace', read: 'Leer', replies: 'respuestas' },
    related: { title: 'Explora más modelos de imagen IA', tryNow: 'Probar ahora' },
    faq: { title: 'Preguntas frecuentes sobre Wan 2.7 Image' },
    cta: { title: 'Crea con Wan 2.7 Image en Toolaze', text: 'Empieza con un prompt, añade referencias cuando sea necesario y úsalo para gráficos estructurados, visuales comerciales y edición de imágenes.', button: 'Probar Wan 2.7 Image', label: 'Vista previa del flujo creativo de Wan 2.7 Image' },
  },
  'zh-TW': {
    metadata: { title: 'Wan 2.7 Image 生成器 | 免費 AI 圖像工具', description: '在 Toolaze 免費線上使用 Wan 2.7 Image。透過思考模式、可讀文字版面、多參考圖與 2K 到 4K 輸出選項生成和編輯圖片。', openGraphDescription: '在 Toolaze 使用 Wan 2.7 Image 建立與編輯圖片，支援文字生圖、參考導向編輯、多圖輸入與結構化版面。', twitterDescription: '線上試用 Wan 2.7 Image，用於生圖、圖片編輯、多參考圖與結構化視覺設計。' },
    breadcrumbs: { home: '首頁', model: '模型', current: 'Wan 2.7 Image' },
    schema: { pageName: 'Wan 2.7 Image 生成器', appName: 'Toolaze 上的 Wan 2.7 Image', howToName: '如何在 Toolaze 使用 Wan 2.7 Image' },
    hero: { suffix: '生成器', description: '在 Toolaze 使用 Wan 2.7 Image，從提示詞建立圖片、編輯上傳參考、組合多個輸入，並生成具備提示推理與文字版面控制的結構化視覺。' },
    whatIs: { title: 'Wan 2.7 Image 是什麼？', paragraphs: ['Wan 2.7 Image 是 Alibaba 的圖像生成與編輯模型系列，支援文字生圖、圖片編輯、多參考創作與一致視覺組。', '在 Toolaze 中，你可以直接在瀏覽器寫提示詞、選比例和解析度、上傳參考圖，然後生成並下載結果。'] },
    features: { title: 'Wan 2.7 Image 主要功能', text: '適合結構化海報、產品視覺、文字密集圖形、引導式編輯與多參考構圖。' },
    gallery: { title: 'Wan 2.7 Image 範例圖庫', text: '查看商業設計、密集文字、多參考編輯與結構化圖像的常見用法。' },
    comparison: { title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro', text: '此表優先採用官方規格。若官方頁面未列出明確上限，表格會直接標示。', capabilityHeader: '能力' },
    howTo: { title: '如何在 Toolaze 使用 Wan 2.7 Image' },
    prompts: { title: '最佳 Wan 2.7 Image 提示詞範例', text: '可作為結構化版面、文字圖形、編輯、參考融合與一致視覺系統的起點。', copyButton: '複製', copiedButton: '已複製' },
    youtube: { title: 'YouTube 上的 Wan 2.7 Image 影片', text: '觀看色彩控制、提示詞處理、臉部真實感、編輯行為與高解析輸出的精選測試影片。', watch: '在 YouTube 觀看' },
    reddit: { title: 'Reddit 上的 Wan 2.7 Image 討論', text: '瀏覽關於可用性、發布反應、早期測試與社群問題的真實 Reddit 貼文。', communityDiscussion: 'Reddit 討論', openDiscussion: '開啟 Reddit 討論串' },
    x: { title: 'X 上的 Wan 2.7 Image 範例', text: '查看真實的 Wan 2.7 Image 發布、創作者測試與模型說明貼文。', verified: '已驗證', follow: '追蹤', watch: '查看圖片', monthYear: '2026 年 6 月', likes: '喜歡', reply: '回覆', copyLink: '複製連結', read: '閱讀', replies: '則回覆' },
    related: { title: '探索更多 AI 圖像模型', tryNow: '立即試用' },
    faq: { title: 'Wan 2.7 Image 常見問題' },
    cta: { title: '在 Toolaze 使用 Wan 2.7 Image 創作', text: '從提示詞開始，必要時加入參考圖，用於結構化圖形、商業視覺與圖片編輯。', button: '試用 Wan 2.7 Image', label: 'Wan 2.7 Image 創作流程預覽' },
  },
  pt: {
    metadata: { title: 'Wan 2.7 Image Generator | Ferramenta grátis de IA', description: 'Use Wan 2.7 Image online no Toolaze grátis. Gere e edite imagens com modo de raciocínio, layouts com texto legível, múltiplas referências e opções de 2K a 4K.', openGraphDescription: 'Crie e edite imagens com Wan 2.7 Image no Toolaze, incluindo texto para imagem, edição com referências, entrada multiimagem e layouts estruturados.', twitterDescription: 'Teste Wan 2.7 Image online para geração, edição, múltiplas referências e design estruturado.' },
    breadcrumbs: { home: 'Início', model: 'Modelo', current: 'Wan 2.7 Image' },
    schema: { pageName: 'Gerador Wan 2.7 Image', appName: 'Wan 2.7 Image no Toolaze', howToName: 'Como usar Wan 2.7 Image no Toolaze' },
    hero: { suffix: 'Generator', description: 'Use Wan 2.7 Image no Toolaze para criar imagens a partir de prompts, editar referências enviadas, combinar várias entradas e gerar visuais estruturados com controle de texto e layout.' },
    whatIs: { title: 'O que é Wan 2.7 Image?', paragraphs: ['Wan 2.7 Image é a família de modelos da Alibaba para geração e edição de imagens, com texto para imagem, edição, múltiplas referências e conjuntos visuais consistentes.', 'No Toolaze, o modelo roda no navegador: escreva um prompt, escolha proporção e resolução, envie referências quando necessário e baixe o resultado.'] },
    features: { title: 'Principais recursos do Wan 2.7 Image', text: 'Use para pôsteres estruturados, visuais de produto, gráficos com texto, edições guiadas e composições com múltiplas referências.' },
    gallery: { title: 'Galeria de exemplos do Wan 2.7 Image', text: 'Veja usos comuns em design comercial, texto denso, edição com referências e trabalho visual estruturado.' },
    comparison: { title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro', text: 'A tabela prioriza especificações oficiais. Quando a página oficial não lista um limite claro, isso é indicado.', capabilityHeader: 'Capacidade' },
    howTo: { title: 'Como usar Wan 2.7 Image no Toolaze' },
    prompts: { title: 'Melhores prompts para Wan 2.7 Image', text: 'Use estes exemplos para layouts estruturados, gráficos com texto, edição, fusão de referências e sistemas visuais consistentes.', copyButton: 'Copiar', copiedButton: 'Copiado' },
    youtube: { title: 'Vídeos de Wan 2.7 Image no YouTube', text: 'Vídeos selecionados sobre controle de cor, prompts, realismo facial, edição e saída em alta resolução.', watch: 'Ver no YouTube' },
    reddit: { title: 'Discussões sobre Wan 2.7 Image no Reddit', text: 'Posts reais sobre disponibilidade, reações ao lançamento, testes iniciais e perguntas da comunidade.', communityDiscussion: 'Discussão no Reddit', openDiscussion: 'Abrir tópico no Reddit' },
    x: { title: 'Exemplos de Wan 2.7 Image no X', text: 'Posts reais no X com anúncios, testes de criadores e notas do modelo.', verified: 'Verificado', follow: 'Seguir', watch: 'Ver imagem', monthYear: 'junho de 2026', likes: 'curtidas', reply: 'Responder', copyLink: 'Copiar link', read: 'Ler', replies: 'respostas' },
    related: { title: 'Explore mais modelos de imagem IA', tryNow: 'Testar agora' },
    faq: { title: 'Perguntas frequentes sobre Wan 2.7 Image' },
    cta: { title: 'Crie com Wan 2.7 Image no Toolaze', text: 'Comece com um prompt, adicione referências quando necessário e use para gráficos estruturados, visuais comerciais e edição de imagens.', button: 'Testar Wan 2.7 Image', label: 'Prévia do fluxo criativo do Wan 2.7 Image' },
  },
  fr: {
    metadata: { title: 'Wan 2.7 Image Generator | Outil image IA gratuit', description: 'Utilisez Wan 2.7 Image en ligne sur Toolaze gratuitement. Générez et retouchez des images avec mode raisonnement, texte lisible, références multiples et options 2K à 4K.', openGraphDescription: 'Créez et retouchez des images avec Wan 2.7 Image sur Toolaze, avec texte vers image, édition guidée par références, entrée multi-image et compositions structurées.', twitterDescription: 'Essayez Wan 2.7 Image en ligne pour la génération, l’édition, les références multiples et le design structuré.' },
    breadcrumbs: { home: 'Accueil', model: 'Modèle', current: 'Wan 2.7 Image' },
    schema: { pageName: 'Générateur Wan 2.7 Image', appName: 'Wan 2.7 Image sur Toolaze', howToName: 'Comment utiliser Wan 2.7 Image sur Toolaze' },
    hero: { suffix: 'Generator', description: 'Utilisez Wan 2.7 Image sur Toolaze pour créer des images depuis des prompts, éditer des références, combiner plusieurs entrées et générer des visuels structurés avec contrôle du texte et de la mise en page.' },
    whatIs: { title: 'Qu’est-ce que Wan 2.7 Image ?', paragraphs: ['Wan 2.7 Image est la famille de modèles d’Alibaba pour la génération et l’édition d’images, avec texte vers image, édition, références multiples et ensembles visuels cohérents.', 'Sur Toolaze, tout se fait dans le navigateur : écrivez un prompt, choisissez le ratio et la résolution, ajoutez des références si besoin, puis téléchargez le résultat.'] },
    features: { title: 'Fonctions clés de Wan 2.7 Image', text: 'Utilisez-le pour des affiches structurées, visuels produit, graphiques riches en texte, éditions guidées et compositions multi-références.' },
    gallery: { title: 'Galerie d’exemples Wan 2.7 Image', text: 'Découvrez des usages courants pour le design commercial, le texte dense, l’édition multi-références et les visuels structurés.' },
    comparison: { title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro', text: 'Ce tableau privilégie les spécifications officielles. Si aucune limite publique claire n’est donnée, cela est indiqué.', capabilityHeader: 'Capacité' },
    howTo: { title: 'Comment utiliser Wan 2.7 Image sur Toolaze' },
    prompts: { title: 'Meilleurs exemples de prompts Wan 2.7 Image', text: 'Utilisez ces exemples pour les mises en page structurées, graphiques textuels, éditions, fusion de références et systèmes visuels cohérents.', copyButton: 'Copier', copiedButton: 'Copié' },
    youtube: { title: 'Vidéos Wan 2.7 Image sur YouTube', text: 'Vidéos sélectionnées sur le contrôle couleur, les prompts, le réalisme des visages, l’édition et la sortie haute résolution.', watch: 'Voir sur YouTube' },
    reddit: { title: 'Discussions Wan 2.7 Image sur Reddit', text: 'Posts Reddit réels sur la disponibilité, les réactions au lancement, les premiers tests et les questions de la communauté.', communityDiscussion: 'Discussion Reddit', openDiscussion: 'Ouvrir le fil Reddit' },
    x: { title: 'Exemples Wan 2.7 Image sur X', text: 'Posts X réels avec annonces, tests de créateurs et notes sur le modèle.', verified: 'Vérifié', follow: 'Suivre', watch: 'Voir l’image', monthYear: 'juin 2026', likes: 'J’aime', reply: 'Répondre', copyLink: 'Copier le lien', read: 'Lire', replies: 'réponses' },
    related: { title: 'Explorer plus de modèles d’image IA', tryNow: 'Essayer' },
    faq: { title: 'FAQ sur Wan 2.7 Image' },
    cta: { title: 'Créer avec Wan 2.7 Image sur Toolaze', text: 'Commencez avec un prompt, ajoutez des références si nécessaire et créez des graphiques structurés, visuels commerciaux et retouches.', button: 'Essayer Wan 2.7 Image', label: 'Aperçu du flux créatif Wan 2.7 Image' },
  },
  ko: {
    metadata: { title: 'Wan 2.7 Image 생성기 | 무료 AI 이미지 도구', description: 'Toolaze에서 Wan 2.7 Image를 무료로 사용하세요. 사고 모드, 읽기 쉬운 텍스트 레이아웃, 다중 참조, 2K~4K 출력 옵션으로 이미지를 생성하고 편집할 수 있습니다.', openGraphDescription: 'Toolaze에서 Wan 2.7 Image로 텍스트-이미지, 참조 기반 편집, 다중 이미지 입력, 구조화된 비주얼을 만들 수 있습니다.', twitterDescription: 'Wan 2.7 Image를 온라인으로 사용해 이미지 생성, 편집, 다중 참조, 구조화 디자인을 테스트하세요.' },
    breadcrumbs: { home: '홈', model: '모델', current: 'Wan 2.7 Image' },
    schema: { pageName: 'Wan 2.7 Image 생성기', appName: 'Toolaze의 Wan 2.7 Image', howToName: 'Toolaze에서 Wan 2.7 Image 사용하는 방법' },
    hero: { suffix: 'Generator', description: 'Toolaze에서 Wan 2.7 Image로 프롬프트 기반 이미지 생성, 업로드 참조 편집, 여러 입력 결합, 텍스트 레이아웃 제어가 있는 구조화 비주얼을 만들 수 있습니다.' },
    whatIs: { title: 'Wan 2.7 Image란?', paragraphs: ['Wan 2.7 Image는 Alibaba의 이미지 생성 및 편집 모델군으로, 텍스트-이미지, 이미지 편집, 다중 참조 생성, 일관된 이미지 세트를 지원합니다.', 'Toolaze에서는 브라우저에서 프롬프트를 작성하고 비율과 해상도를 선택한 뒤, 필요하면 참조 이미지를 업로드하고 결과를 다운로드할 수 있습니다.'] },
    features: { title: 'Wan 2.7 Image 주요 기능', text: '구조화 포스터, 제품 비주얼, 텍스트가 많은 그래픽, 가이드 편집, 다중 참조 구성에 적합합니다.' },
    gallery: { title: 'Wan 2.7 Image 예시 갤러리', text: '상업 디자인, 고밀도 텍스트, 다중 참조 편집, 구조화 이미지 작업의 일반적인 사용 사례를 확인하세요.' },
    comparison: { title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro', text: '이 표는 공식 사양을 우선합니다. 공식 페이지에 명확한 한도가 없으면 그대로 표시합니다.', capabilityHeader: '기능' },
    howTo: { title: 'Toolaze에서 Wan 2.7 Image 사용하는 방법' },
    prompts: { title: '최고의 Wan 2.7 Image 프롬프트 예시', text: '구조화 레이아웃, 텍스트 그래픽, 편집, 참조 융합, 일관된 비주얼 시스템의 시작점으로 사용하세요.', copyButton: '복사', copiedButton: '복사됨' },
    youtube: { title: 'YouTube의 Wan 2.7 Image 영상', text: '색상 제어, 프롬프트 처리, 얼굴 사실감, 편집 동작, 고해상도 출력을 테스트하는 영상입니다.', watch: 'YouTube에서 보기' },
    reddit: { title: 'Reddit의 Wan 2.7 Image 토론', text: '출시 여부, 출시 반응, 초기 테스트, 커뮤니티 질문을 다루는 실제 Reddit 게시물입니다.', communityDiscussion: 'Reddit 토론', openDiscussion: 'Reddit 스레드 열기' },
    x: { title: 'X의 Wan 2.7 Image 예시', text: '실제 Wan 2.7 Image 발표, 크리에이터 테스트, 모델 메모가 포함된 X 게시물입니다.', verified: '인증됨', follow: '팔로우', watch: '이미지 보기', monthYear: '2026년 6월', likes: '좋아요', reply: '답글', copyLink: '링크 복사', read: '읽기', replies: '개의 답글' },
    related: { title: '더 많은 AI 이미지 모델 탐색', tryNow: '지금 사용' },
    faq: { title: 'Wan 2.7 Image FAQ' },
    cta: { title: 'Toolaze에서 Wan 2.7 Image로 만들기', text: '프롬프트로 시작하고 필요하면 참조를 추가해 구조화 그래픽, 상업용 비주얼, 이미지 편집에 활용하세요.', button: 'Wan 2.7 Image 사용하기', label: 'Wan 2.7 Image 작업 흐름 미리보기' },
  },
  it: {
    metadata: { title: 'Wan 2.7 Image Generator | Strumento IA gratuito', description: 'Usa Wan 2.7 Image online su Toolaze gratis. Genera e modifica immagini con modalità ragionamento, testo leggibile, riferimenti multipli e opzioni da 2K a 4K.', openGraphDescription: 'Crea e modifica immagini con Wan 2.7 Image su Toolaze, con text-to-image, editing guidato da riferimenti, input multi-immagine e layout strutturati.', twitterDescription: 'Prova Wan 2.7 Image online per generazione, editing, riferimenti multipli e design strutturato.' },
    breadcrumbs: { home: 'Home', model: 'Modello', current: 'Wan 2.7 Image' },
    schema: { pageName: 'Generatore Wan 2.7 Image', appName: 'Wan 2.7 Image su Toolaze', howToName: 'Come usare Wan 2.7 Image su Toolaze' },
    hero: { suffix: 'Generator', description: 'Usa Wan 2.7 Image su Toolaze per creare immagini da prompt, modificare riferimenti caricati, combinare più input e generare visual strutturati con controllo di testo e layout.' },
    whatIs: { title: 'Che cos’è Wan 2.7 Image?', paragraphs: ['Wan 2.7 Image è la famiglia di modelli Alibaba per generazione e modifica immagini, con text-to-image, editing, riferimenti multipli e set visivi coerenti.', 'Su Toolaze funziona nel browser: scrivi un prompt, scegli rapporto e risoluzione, carica riferimenti quando servono e scarica il risultato.'] },
    features: { title: 'Funzioni principali di Wan 2.7 Image', text: 'Usalo per poster strutturati, visual prodotto, grafiche ricche di testo, editing guidato e composizioni multi-riferimento.' },
    gallery: { title: 'Galleria esempi di Wan 2.7 Image', text: 'Guarda usi comuni per design commerciale, testo denso, editing multi-riferimento e lavori visivi strutturati.' },
    comparison: { title: 'Wan 2.7 Image vs GPT Image 2 vs Seedream 4.5 vs Nano Banana Pro', text: 'La tabella privilegia specifiche ufficiali. Se una pagina ufficiale non indica un limite chiaro, viene segnalato.', capabilityHeader: 'Capacità' },
    howTo: { title: 'Come usare Wan 2.7 Image su Toolaze' },
    prompts: { title: 'Migliori esempi di prompt Wan 2.7 Image', text: 'Usa questi esempi per layout strutturati, grafiche testuali, editing, fusione di riferimenti e sistemi visivi coerenti.', copyButton: 'Copia', copiedButton: 'Copiato' },
    youtube: { title: 'Video Wan 2.7 Image su YouTube', text: 'Video selezionati su controllo colore, prompt, realismo dei volti, editing e output ad alta risoluzione.', watch: 'Guarda su YouTube' },
    reddit: { title: 'Discussioni Wan 2.7 Image su Reddit', text: 'Post reali su disponibilità, reazioni al lancio, primi test e domande della community.', communityDiscussion: 'Discussione Reddit', openDiscussion: 'Apri thread Reddit' },
    x: { title: 'Esempi Wan 2.7 Image su X', text: 'Post X reali con annunci, test di creator e note sul modello.', verified: 'Verificato', follow: 'Segui', watch: 'Vedi immagine', monthYear: 'giugno 2026', likes: 'Mi piace', reply: 'Rispondi', copyLink: 'Copia link', read: 'Leggi', replies: 'risposte' },
    related: { title: 'Esplora altri modelli immagine IA', tryNow: 'Prova ora' },
    faq: { title: 'Domande frequenti su Wan 2.7 Image' },
    cta: { title: 'Crea con Wan 2.7 Image su Toolaze', text: 'Inizia con un prompt, aggiungi riferimenti quando servono e usalo per grafiche strutturate, visual commerciali ed editing immagini.', button: 'Prova Wan 2.7 Image', label: 'Anteprima workflow creativo Wan 2.7 Image' },
  },
}

const localizedNestedOverrides: Record<Exclude<Wan27ImageLocale, 'en'>, DeepPartial<Wan27ImageLandingCopy>> = {
  de: {
    features: {
      items: [
        { title: 'Thinking Mode für komplexe Prompts', paragraphs: ['Wan 2.7 Image unterstützt Thinking Mode in passenden Text-zu-Bild-Szenarien. Das hilft dem Modell, längere Prompts, Layoutregeln, Objektbeziehungen und visuelle Vorgaben vor der Ausgabe zu interpretieren.', 'Nutzen Sie ihn für Poster, Lernvisuals, Kampagnenentwürfe und Prompts mit mehreren Motiven, sichtbarem Text, Hintergrundsystem und klaren Kompositionsregeln.'] },
        { title: 'Textrendering und strukturierte Designs', paragraphs: ['Wan 2.7 Image eignet sich für titelgeführte Grafiken, Labels, Menüs, Social Cards, Eventposter und einfache Infografiken mit lesbarem Text und klarer Struktur.', 'Prüfen Sie generierten Text vor der Veröffentlichung, besonders bei kleinem Rechtstext, Adressen, Preisen oder markenkritischen Formulierungen.'] },
        { title: 'Bildgenerierung und promptbasierte Bearbeitung', paragraphs: ['Wan 2.7 Image kann neue Bilder aus Prompts erstellen und bestehende Bilder per natürlicher Sprache bearbeiten. Laden Sie eine Referenz hoch und beschreiben Sie, was geändert werden soll, während Motiv, Layout oder Stilrichtung stabil bleiben.', 'Nutzen Sie es für Produktanpassungen, Hintergrundwechsel, lokalisierte Versionen, Kompositionskorrekturen und Designvarianten aus einem vorhandenen Motiv.'] },
        { title: 'Mehrfachreferenzen zusammenführen', paragraphs: ['Wan 2.7 Image unterstützt bis zu 9 Eingabebilder für referenzgeführte Generierung und Bearbeitung. Kombinieren Sie Produktfoto, Stilreferenz, Hintergrundrichtung, Charakterbogen, Logo oder Materialmuster in einem Prompt.', 'Benennen Sie für bessere Ergebnisse, welche Referenz welches Element steuert, etwa Identität, Stil, Komposition, Hintergrund, Verpackung oder Farbpalette.'] },
        { title: '2K- und 4K-Ausgabeoptionen', paragraphs: ['Der Standardmodus von Wan 2.7 Image unterstützt 1K und 2K für Generierung und Bearbeitung. Der Pro-Text-zu-Bild-Pfad unterstützt 4K, wenn kein Referenzbild verwendet wird.', 'Verwenden Sie 2K für Referenzbearbeitung und schnelle Kampagnenentwürfe. Wählen Sie 4K für Text-zu-Bild-Poster, detaillierte Produktboards oder großformatige Konzepte, wenn der gewählte Modus es unterstützt.'] },
        { title: 'Konsistente Bildsets', paragraphs: ['Wan 2.7 Image kann verwandte Visuals wie Storyboard-Frames, Produktkatalogvarianten, Kinderbuchkonzepte, Folienvisuals und mehrteilige Kampagnen planen.', 'Nutzen Sie auf Toolaze klare Bezeichnungen im Prompt, damit jeder Frame, Winkel oder jede Variante eine definierte Rolle hat.'] },
      ],
    },
    gallery: {
      examples: [
        { title: 'Produktwerbung', text: 'Erstellen Sie saubere kommerzielle Bilder mit Hauptprodukt, lesbarer Headline, Nutzenhinweisen und kontrolliertem Studiolicht.' },
        { title: 'Eventposter-Layout', text: 'Generieren Sie Poster mit Titelhierarchie, Datum, Ort, Sprecherblöcken und visuellem Rhythmus.' },
        { title: 'Verpackungskonzept', text: 'Testen Sie Labels, Materialien, Markenfarben, Produktoberflächen und Ideen für die Präsentation im Handel.' },
        { title: 'Lerninfografik', text: 'Erstellen Sie einfache Lernvisuals mit Icons, nummerierten Schritten, kurzen Labels und klarer Hierarchie.' },
        { title: 'Charakterreferenz bearbeiten', text: 'Nutzen Sie Referenzen, um ein Motiv oder eine Figur konsistent zu halten, während Pose, Kleidung oder Szene wechseln.' },
        { title: 'Interior-Design-Überarbeitung', text: 'Verwandeln Sie eine Raumreferenz in einen anderen Stil und behalten Sie Layout und Kamerawinkel bei.' },
        { title: 'Storyboard-Frame', text: 'Planen Sie Kampagnenframes, Szenenbeats, Thumbnails und erzählerische Visuals mit einheitlicher Richtung.' },
        { title: 'Marken-Visual-Board', text: 'Kombinieren Sie Typografie, Palette, Produktbilder und Kampagnennotizen in einem strukturierten Konzeptboard.' },
      ],
    },
    comparison: {
      rows: [
        { capability: 'Maximale Ausgabeauflösung', wan: 'Pro: 4K für Text-zu-Bild; Bildeingabe/Bearbeitung: 2K. Standard: 2K', gpt: 'Bis zu 3840px Kantenlänge und 8.29MP, inklusive 3840x2160', seedream: 'Die offizielle Seed-Seite nennt kein öffentliches Maximum', nano: '1K, 2K, 4K Preview' },
        { capability: 'Referenzbilder', wan: '0 bis 9 Eingabebilder', gpt: 'Bis zu 16 Bilder für GPT-Bildbearbeitungsabläufe', seedream: 'Mehrbild-Bearbeitung; offizielles Maximum nicht genannt', nano: 'Maximal 14 Bilder pro Prompt' },
        { capability: 'Bildbearbeitung', wan: 'Unterstützt mit Prompt, Bildeingabe und optionalen Boxen', gpt: 'Unterstützt über Bildbearbeitung und Referenzbilder', seedream: 'Unterstützt; offizielle Seite betont Detailerhalt', nano: 'Unterstützt, einschließlich mehrstufiger Bildbearbeitung' },
        { capability: 'Seitenverhältnis und Größe', wan: 'Benutzerdefiniertes Verhältnis 1:8 bis 8:1 innerhalb der Pixelgrenzen', gpt: 'Benutzerdefinierte Größe; Verhältnis bis 3:1; Kanten müssen Vielfache von 16 sein', seedream: 'Offizielle Seite zeigt Multi-Format-Design; genaue API-Grenzen nicht genannt', nano: '1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9' },
        { capability: 'Offizielle Stärke', wan: 'Thinking Mode, Bildsets, Farbpalettensteuerung, Mehrfachreferenzen', gpt: 'Flexible hochauflösende Größen, hochwertige Eingaben, Bildbearbeitung', seedream: 'Referenzkonsistenz, Typografie, dichter Text, Mehrbild-Bearbeitung', nano: 'Reasoning, Search grounding, C2PA, komplexe mehrstufige Bearbeitung' },
      ],
    },
    howTo: { steps: ['Öffnen Sie den Wan 2.7 Image Generator und wählen Sie Text-zu-Bild oder Bild-zu-Bild.', 'Schreiben Sie einen Prompt mit Asset-Typ, Motiv, sichtbarem Text, Layout, Seitenverhältnis, Licht und Stil.', 'Laden Sie Referenzbilder hoch, wenn Motiv, Produkt, Raum, Logo oder visuelle Richtung erhalten bleiben sollen.', 'Wählen Sie Auflösung und Seitenverhältnis, generieren Sie das Bild und laden Sie es herunter oder verfeinern Sie den Prompt.'] },
    prompts: {
      examples: [
        { title: 'Poster für Produktlaunch', prompt: 'Erstellen Sie ein vertikales Launch-Poster für ein hochwertiges Yuzu-Sprudelgetränk. Enthalten sein sollen die lesbare Headline "Yuzu Spark", der Untertitel "bright citrus, zero sugar", eine Hero-Dose mit Kondenswasser, Yuzu-Scheiben, ein weißer und citrusgelber Hintergrund, kleine Nutzenhinweise und poliertes kommerzielles Licht.' },
        { title: 'Textreiches Eventposter', prompt: 'Erstellen Sie ein modernes Eventposter für "Future Design Week 2026". Integrieren Sie lesbare Zeitplanblöcke für drei Sessions, Sprecher, Datum, Ort, Ticket-Hinweis und ein markantes abstraktes Visualsystem. Nutzen Sie klare Hierarchie, großzügige Abstände und einen editorialen Designstil.' },
        { title: 'Stilfusion mit mehreren Referenzen', prompt: 'Nutzen Sie das hochgeladene Produktbild als exakte Produktreferenz, das zweite Bild als Lichtreferenz und das dritte Bild als Farbpalettenreferenz. Erstellen Sie ein Kampagnenvisual, das die Produktform unverändert lässt und Licht sowie Farbwirkung aus den Referenzen übernimmt.' },
        { title: 'Charakterreferenz bearbeiten', prompt: 'Nutzen Sie die hochgeladene Charakterreferenz. Behalten Sie Gesicht, Frisur, Körperproportionen und Outfit-Identität bei. Verlegen Sie die Szene in eine regnerische Neonstraße bei Nacht, mit spiegelndem Asphalt, filmischem Kantenlicht und ruhiger selbstbewusster Pose. Ändern Sie die Identität nicht.' },
        { title: 'Lerninfografik', prompt: 'Erstellen Sie eine klare Infografik darüber, wie ein Solarpanel Sonnenlicht in Strom umwandelt. Nutzen Sie vier nummerierte Schritte, kurze lesbare Labels, einfache Icons, eine blaue und gelbe Palette, weißen Hintergrund und eine klare Hierarchie für den Unterricht.' },
        { title: 'Interior-Design-Bearbeitung', prompt: 'Nutzen Sie das hochgeladene Wohnzimmerfoto als Referenz. Behalten Sie Kamerawinkel, Fenster, Wände und Möbelpositionen bei. Gestalten Sie den Raum in ruhigem Japandi-Stil mit Eichenholz, Leinentexturen, warmem indirektem Licht, neutralen Wänden und einem aufgeräumten Magazinfinish.' },
      ],
    },
    youtube: {
      examples: [
        { title: 'Wan 2.7 Image Test zur Farbkontrolle', text: 'Ein fokussierter Durchlauf zu Farbkontrolle, Palettenverhalten und Modellreaktion in praktischen Bildgenerierungstests.' },
        { title: 'Wan 2.7 Image kompletter Guide und Test', text: 'Ein längerer Test zu Qualität, Prompt-Reaktion, Generierungsmodi und visueller Ausgabe anhand mehrerer Beispiele.' },
        { title: 'Wan 2.7 Image ausführlich getestet', text: 'Ein Creator-Test zu Ausgabequalität, Referenzverhalten und Einordnung gegenüber anderen Bildtools.' },
      ],
    },
    reddit: { items: [
      { title: 'Wan 2.7 und Wan 2.7 Pro Bildmodelle sind verfügbar', text: 'Ein r/budgetpixel-Thread zur Verfügbarkeit von Wan 2.7 und Wan 2.7 Pro, mit den originalen Reddit-Vorschaubildern in einer Karte.' },
      { title: 'Wan 2.7 Image ist da. Hat es schon jemand getestet?', text: 'Ein r/AtlasCloudAI-Fragethread zu frühen Tests und praktischen Reaktionen jenseits offizieller Modellhinweise.' },
      { title: 'Wan 2.7 Image wurde gerade veröffentlicht', text: 'Eine r/ArtificialInteligence-Diskussion zum Launch und zu Erwartungen an das nächste Wan-Videomodell.' },
      { title: 'Alibaba veröffentlicht Wan 2.7 Image für schärfere Visuals', text: 'Ein r/aicuriosity-Beitrag zum Release von Wan 2.7 Image und seiner Positionierung als neueres Bildmodell.' },
    ] },
    x: { items: [
      { title: 'Offizielle Wan2.7-Image Ankündigung', body: 'Der offizielle Wan-Account stellt Wan2.7-Image als einheitliches Modell für Generierung, Bearbeitung, Textrendering, Farbkontrolle und Bildsets vor.' },
      { title: 'Creator-Test mit Referenzgesichtern', body: 'Ein japanischer Creator-Test beschreibt natürliches Verhalten bei Referenzgesichtern und vergleicht Details mit anderen Bildmodellen.' },
      { title: 'Zusammenfassung der Wan 2.7 Modi', body: 'Ein öffentlicher X-Post fasst Wan 2.7 Text-zu-Bild, Bildbearbeitung, Pro Text-zu-Bild und Pro-Bearbeitungsmodi zusammen.' },
      { title: 'Wan 2.7 Image auf Poe', body: 'Poe kündigt Wan 2.7 Image an und hebt kohärente Bildsets, konsistente Charaktere, Stil, Kontext und Bounding-Box-Bearbeitung hervor.' },
      { title: 'Frühe Creator-Bewertung', body: 'Ein Creator teilt frühe Wan 2.7 Image Tests und vergleicht die mögliche Position gegenüber Nano Banana und Seedream-ähnlichen Modellen.' },
      { title: 'Feature-Überblick von Alisa Qian', body: 'Ein kurzer Überblick zu Gesichtskontrolle, farbpalettenbasierter Farbsteuerung, mehrsprachigem Textrendering und interaktiver Bearbeitung.' },
      { title: 'Wan2.7-Image auf Design Arena', body: 'Design Arena meldet die Verfügbarkeit von Wan2.7-Image mit Hinweisen zu Detailgrad, Prompt-Treue, Stilkontrolle und Modellvarianten.' },
      { title: 'WaveSpeed-Ausgabeset', body: 'Ein WaveSpeedAI-Post zeigt Wan 2.7 Image Ausgaben in einem Mehrbild-Set und hilft, die Generierungsbreite einzuschätzen.' },
      { title: 'Wan 2.7 Image auf fal', body: 'Ein fal-bezogener Post testet Wan 2.7 Image an einer komplexen Stadtszene und nennt realistische Gesichter, Farbextraktion, mehrsprachigen Text und visuelle Bearbeitung.' },
      { title: 'Wan2.7 Creator-Webinar', body: 'Der offizielle Wan-Account bewirbt ein Wan2.7 Creator-Webinar zu Arbeitsabläufen der nächsten Generation und KI-Agenten-gestützter Kreativität.' },
    ] },
    related: { links: [
      { text: 'Nutzen Sie GPT Image 2 für textreiche Visuals, Bearbeitung, UI-ähnliche Kompositionen und klare Layoutkontrolle.' },
      { text: 'Testen Sie Seedream 4.5 für Produktvisuals, Poster, typografiereiche Layouts und referenzgeführte Bearbeitung.' },
      { text: 'Erstellen Sie hochauflösende Bildassets und referenzgeführte visuelle Entwürfe mit Nano Banana Pro.' },
      { text: 'Nutzen Sie Nano Banana 2 für schnelle Alltagsgenerierung und einfache visuelle Varianten.' },
      { text: 'Durchsuchen Sie Toolaze Bild- und Videomodellseiten für einen breiteren Modellvergleich.' },
    ] },
    faq: { items: [
      { q: 'Ist Wan 2.7 Image auf Toolaze kostenlos nutzbar?', a: 'Ja. Sie können Wan 2.7 Image auf Toolaze kostenlos testen. Die Nutzung kann je nach Kontingent, Qualitätseinstellung, Modellverfügbarkeit oder Rate Limits variieren.' },
      { q: 'Unterstützt Wan 2.7 Image Bildbearbeitung?', a: 'Ja. Wan 2.7 Image unterstützt promptbasierte Bildbearbeitung mit hochgeladenen Referenzen, einschließlich Abläufen, in denen der Prompt festlegt, was erhalten und was geändert werden soll.' },
      { q: 'Wie viele Referenzbilder kann Wan 2.7 Image nutzen?', a: 'Wan 2.7 Image unterstützt bis zu 9 Eingabebilder in Mehrfachreferenz-Abläufen. Weisen Sie jeder Referenz im Prompt klar eine Rolle zu.' },
      { q: 'Unterstützt Wan 2.7 Image 4K-Ausgabe?', a: 'Der Standardablauf unterstützt 1K und 2K. Der Pro-Text-zu-Bild-Pfad unterstützt 4K, wenn kein Eingabebild verwendet wird. Referenzbasierte Bearbeitung sollte 1K oder 2K verwenden.' },
      { q: 'Welche Prompts funktionieren am besten mit Wan 2.7 Image?', a: 'Nutzen Sie strukturierte Prompts mit Asset-Typ, Motiv, exakt sichtbarem Text, Layout, Referenzen, Licht, Hintergrund, Seitenverhältnis und unveränderlichen Elementen.' },
    ] },
  },
  ja: {
    features: { items: [
      { title: '複雑なプロンプト向けのThinking Mode', paragraphs: ['Wan 2.7 Imageは、対応するテキストから画像の場面でThinking Modeを使えます。長いプロンプト、レイアウト指定、物体同士の関係、視覚的な制約を出力前に解釈しやすくします。', 'ポスター、教育用グラフィック、キャンペーン案、複数の被写体や正確な文字、背景設計、構図条件をまとめて指定するプロンプトに向いています。'] },
      { title: '文字表現と構造化デザイン', paragraphs: ['Wan 2.7 Imageは、見出し中心のグラフィック、ラベル、メニュー、SNSカード、イベントポスター、シンプルな情報図など、読みやすい文字と明確なレイアウトが必要な制作に実用的です。', '公開前には生成文字を確認してください。特に細かい注意書き、住所、価格、ブランド上重要な文言は確認が必要です。'] },
      { title: '画像生成とプロンプト編集', paragraphs: ['Wan 2.7 Imageは、プロンプトから新しい画像を作るだけでなく、自然言語の指示で既存画像を編集できます。参照画像をアップロードし、被写体、レイアウト、方向性を保ちながら変更点を指定できます。', '商品編集、背景変更、ローカライズ、構図整理、既存ビジュアルからのデザインバリエーションに使えます。'] },
      { title: '複数参照画像の融合', paragraphs: ['Wan 2.7 Imageは、参照付き生成と編集で最大9枚の入力画像に対応します。商品写真、スタイル参照、背景方向、キャラクターシート、ロゴ、素材サンプルを1つのプロンプトで組み合わせられます。', '良い結果を得るには、各参照が何を制御するかを明記します。例として、被写体の同一性、スタイル、構図、背景、パッケージ、配色があります。'] },
      { title: '2Kと4Kの出力オプション', paragraphs: ['Wan 2.7 Imageの標準モードは、生成と編集で1Kと2Kをサポートします。Proのテキストから画像の経路では、参照画像を使わない場合に4K出力をサポートします。', '参照編集や素早いキャンペーン案には2Kを使います。選択した生成モードが対応している場合、ポスター、詳細な商品ボード、大判コンセプトには4Kを選べます。'] },
      { title: '一貫した画像セット', paragraphs: ['Wan 2.7 Imageは、ストーリーボード、商品カタログのバリエーション、絵本コンセプト、スライド用ビジュアル、複数カードのキャンペーンなど、関連する画像群の制作に役立ちます。', 'Toolazeでは、各フレーム、角度、バリエーションの役割が明確になるようにプロンプトで名前を付けてください。'] },
    ] },
    gallery: { examples: [
      { title: '商品広告ビジュアル', text: '主役の商品、読みやすい見出し、ベネフィット表示、制御されたスタジオ照明で商用画像を作れます。' },
      { title: 'イベントポスターのレイアウト', text: 'タイトル階層、日付、会場、登壇者ブロック、視覚的なリズムを備えたポスターを生成できます。' },
      { title: 'パッケージコンセプト', text: 'ラベル、素材、ブランドカラー、商品表面、店頭での見え方を試せます。' },
      { title: '教育用インフォグラフィック', text: 'アイコン、番号付きステップ、短いラベル、明確な階層で学習用の図解を作れます。' },
      { title: 'キャラクター参照編集', text: '参照を使って被写体やキャラクターを保ち、ポーズ、服装、シーンを変更できます。' },
      { title: 'インテリアデザイン変更', text: '部屋の参照を別スタイルに変えながら、レイアウトとカメラ角度を維持できます。' },
      { title: 'ストーリーボードフレーム', text: 'キャンペーンのフレーム、場面の流れ、サムネイル、物語性のあるビジュアルを一貫した方向で計画できます。' },
      { title: 'ブランドビジュアルボード', text: 'タイポグラフィ、配色、商品画像、キャンペーンメモを1つの構造化コンセプトボードにまとめられます。' },
    ] },
    comparison: { rows: [
      { capability: '最大出力解像度', wan: 'Pro: テキストから画像は4K。画像入力/編集は2K。標準は2K', gpt: '最大3840px辺、8.29MPまで。3840x2160を含む', seedream: '公式Seedページに公開最大値の記載なし', nano: '1K、2K、4K Preview' },
      { capability: '参照画像', wan: '0から9枚の入力画像', gpt: 'GPT画像編集ワークフローで最大16枚', seedream: '複数画像編集に対応。公式最大値は未記載', nano: '1プロンプト最大14枚' },
      { capability: '画像編集', wan: 'プロンプト、画像入力、任意のボックスで対応', gpt: '画像編集と参照画像で対応', seedream: '対応。公式ページはディテール保持を強調', nano: '複数ターンの画像編集を含めて対応' },
      { capability: '比率とサイズ', wan: 'ピクセル制限内で1:8から8:1のカスタム比率', gpt: 'カスタムサイズ。比率は最大3:1。辺は16の倍数', seedream: '公式ページはマルチフォーマット設計を掲載。正確なAPI制限は未記載', nano: '1:1、3:2、2:3、3:4、4:3、4:5、5:4、9:16、16:9、21:9' },
      { capability: '公式に示される強み', wan: 'Thinking Mode、画像セット、色パレット制御、複数参照入力', gpt: '柔軟な高解像度サイズ、高忠実度入力、画像編集', seedream: '参照一貫性、タイポグラフィ、密度の高い文字、複数画像編集', nano: 'Reasoning、Search grounding、C2PA、複雑な複数ターン編集' },
    ] },
    howTo: { steps: ['Wan 2.7 Imageジェネレーターを開き、テキストから画像または画像から画像を選びます。', 'アセット種別、被写体、表示したい文字、レイアウト、比率、照明、スタイルをプロンプトに書きます。', '被写体、商品、部屋、ロゴ、視覚方向を保ちたい場合は参照画像をアップロードします。', '解像度と比率を選び、画像を生成してダウンロードするか、プロンプトを調整して別案を作ります。'] },
    prompts: { examples: [
      { title: '商品ローンチポスター', prompt: '高級な柚子スパークリングドリンクの縦型ローンチポスターを作成してください。読みやすい見出し "Yuzu Spark"、サブタイトル "bright citrus, zero sugar"、結露した主役の缶、柚子のスライス、白とシトラスイエローの背景、小さなベネフィット表示、洗練された商用照明を含めてください。' },
      { title: '文字量の多いイベントポスター', prompt: '"Future Design Week 2026" のモダンなイベントポスターを作成してください。3つのセッションの読みやすいスケジュール、登壇者名、日付、会場、チケット案内、大胆な抽象ビジュアルシステムを入れてください。強い階層、十分な余白、編集的なデザインスタイルにしてください。' },
      { title: '複数参照のスタイル融合', prompt: 'アップロードした商品画像を正確な商品参照、2枚目を照明参照、3枚目をカラーパレット参照として使ってください。商品の形状を変えずに、参照の照明と色方向を適用したキャンペーンビジュアルを作成してください。' },
      { title: 'キャラクター参照編集', prompt: 'アップロードしたキャラクター参照を使ってください。同じ顔、髪型、体型、衣装の同一性を保ってください。シーンを夜の雨のネオン街に変更し、濡れた舗装、映画的なリムライト、落ち着いた自信のあるポーズを追加してください。キャラクターの同一性は変えないでください。' },
      { title: '教育用インフォグラフィック', prompt: '太陽光パネルが太陽光を電気に変える仕組みを説明するクリーンなインフォグラフィックを作成してください。4つの番号付きステップ、短い読みやすいラベル、シンプルなアイコン、青と黄色の配色、白背景、授業向けの明確な階層にしてください。' },
      { title: 'インテリアデザイン編集', prompt: 'アップロードしたリビングルーム写真を参照にしてください。カメラ角度、窓、壁、家具の位置は保ってください。オーク材、リネン素材、暖かい間接照明、ニュートラルな壁、雑誌向けの整った仕上がりで、落ち着いたジャパンディスタイルに変更してください。' },
    ] },
    youtube: { examples: [
      { title: 'Wan 2.7 Imageの色制御テスト', text: 'Wan 2.7 Imageの色制御、パレット処理、実用的な画像生成テストでのモデル挙動を確認する動画です。' },
      { title: 'Wan 2.7 Image完全ガイドとテスト', text: '品質、プロンプトへの反応、生成モード、複数例での出力を確認する長めのテストです。' },
      { title: 'Wan 2.7 Imageの総合テスト', text: '出力品質、参照挙動、他の画像ツールとの位置づけを見るクリエイターテストです。' },
    ] },
    reddit: { items: [
      { title: 'Wan 2.7とWan 2.7 Proの画像モデルが利用可能に', text: 'r/budgetpixelのスレッドで、Wan 2.7とWan 2.7 Proの利用開始を告知しています。元のRedditプレビュー画像は1枚のカード内にまとめています。' },
      { title: 'Wan 2.7 Imageが公開。もう試した人はいますか？', text: 'r/AtlasCloudAIの質問スレッドで、公式情報以外の初期テストや実用的な反応を読むのに役立ちます。' },
      { title: 'Wan 2.7 Imageがリリースされたばかり', text: 'r/ArtificialInteligenceのローンチ議論で、Wan 2.7 Imageと次のWan動画モデルへの期待が話題です。' },
      { title: 'Alibabaがよりシャープなビジュアル向けにWan 2.7 Imageを発表', text: 'r/aicuriosityの投稿で、Wan 2.7 Imageのリリースと新しい画像モデルとしての位置づけを扱っています。' },
    ] },
    x: { items: [
      { title: '公式Wan2.7-Image発表', body: '公式Wanアカウントが、生成、編集、文字表現、色制御、画像セットを扱う統合モデルとしてWan2.7-Imageを紹介しています。' },
      { title: '参照顔を使ったクリエイターテスト', body: '日本語のクリエイターテストで、参照顔の自然さと他の画像モデルとの細部比較に触れています。' },
      { title: 'Wan 2.7モデルモードの概要', body: '公開X投稿が、Wan 2.7のテキストから画像、画像編集、Proテキストから画像、Pro編集モードをまとめています。' },
      { title: 'Poe上のWan 2.7 Image', body: 'PoeがWan 2.7 Imageの提供開始を告知し、画像セット、キャラクター一貫性、スタイル、文脈、ボックス編集を紹介しています。' },
      { title: '初期クリエイター評価', body: 'クリエイターが初期のWan 2.7 Imageテストを共有し、Nano BananaやSeedream系モデルとの位置づけを比較しています。' },
      { title: 'Alisa Qianによる機能整理', body: '顔制御、パレットによる色制御、多言語テキスト表現、インタラクティブ編集を簡潔にまとめています。' },
      { title: 'Design ArenaのWan2.7-Image', body: 'Design ArenaがWan2.7-Imageの提供を知らせ、ディテール、プロンプト追従、スタイル制御、モデル種別に触れています。' },
      { title: 'WaveSpeedの出力セット', body: 'WaveSpeedAIの投稿が、複数画像の例でWan 2.7 Imageの出力を示し、生成範囲の確認に役立ちます。' },
      { title: 'fal上のWan 2.7 Image', body: 'fal関連の投稿が複雑な都市シーンでWan 2.7 Imageを試し、顔のリアルさ、色抽出、多言語テキスト、画像編集に触れています。' },
      { title: 'Wan2.7クリエイターウェビナー', body: '公式Wanアカウントが、次世代ワークフローとAIエージェント支援の制作に関するWan2.7クリエイターウェビナーを案内しています。' },
    ] },
    related: { links: [
      { text: 'GPT Image 2で、文字の多いビジュアル、編集、UI風の構図、整ったレイアウト制御を試せます。' },
      { text: 'Seedream 4.5で、商品ビジュアル、ポスター、文字量の多いレイアウト、参照付き編集を試せます。' },
      { text: 'Nano Banana Proで、高解像度の画像素材と参照に基づくビジュアル案を作成できます。' },
      { text: 'Nano Banana 2で、日常的な画像生成と素早いバリエーション作成ができます。' },
      { text: 'Toolazeの画像・動画モデルページを見て、より広いモデル比較を確認できます。' },
    ] },
    faq: { items: [
      { q: 'Wan 2.7 ImageはToolazeで無料で使えますか？', a: 'はい。ToolazeでWan 2.7 Imageを無料で試せます。利用状況は、クォータ、選択した品質設定、モデルの利用可否、レート制限によって変わる場合があります。' },
      { q: 'Wan 2.7 Imageは画像編集に対応していますか？', a: 'はい。Wan 2.7 Imageは、アップロードした参照画像を使ったプロンプトベースの画像編集に対応します。何を保ち、何を変えるかをプロンプトで指定できます。' },
      { q: 'Wan 2.7 Imageはいくつの参照画像を使えますか？', a: 'Wan 2.7 Imageは、複数参照ワークフローで最大9枚の入力画像に対応します。各参照の役割をプロンプトで明確に指定してください。' },
      { q: 'Wan 2.7 Imageは4K出力に対応していますか？', a: '標準ワークフローは1Kと2Kに対応します。Proのテキストから画像の経路では、入力画像を使わない場合に4Kをサポートします。参照ベース編集では1Kまたは2Kを使ってください。' },
      { q: 'Wan 2.7 Imageに向いているプロンプトは？', a: 'アセット種別、被写体、正確な表示文字、レイアウト、参照、照明、背景、比率、変更してはいけない要素を含む構造化プロンプトが向いています。' },
    ] },
  },
  es: {
    features: { items: [
      { title: 'Modo de razonamiento para prompts complejos', paragraphs: ['Wan 2.7 Image admite modo de razonamiento en escenarios aptos de texto a imagen. Ayuda al modelo a interpretar prompts largos, reglas de diseño, relaciones entre objetos y restricciones visuales antes de generar la imagen.', 'Úsalo para pósters, gráficos educativos, conceptos de campaña y prompts que combinan varios sujetos, texto exacto, fondo y requisitos de composición.'] },
      { title: 'Texto legible y diseños estructurados', paragraphs: ['Wan 2.7 Image funciona bien para gráficos con título, etiquetas, menús, tarjetas sociales, pósters de eventos e infografías simples que dependen de texto legible y una maquetación clara.', 'Revisa el texto generado antes de publicar, sobre todo si incluye letra pequeña legal, direcciones, precios o frases críticas de marca.'] },
      { title: 'Generación y edición con prompts', paragraphs: ['Wan 2.7 Image crea imágenes desde prompts y también edita imágenes existentes con instrucciones en lenguaje natural. Puedes subir una referencia y explicar qué cambiar sin perder sujeto, layout o dirección visual.', 'Sirve para ediciones de producto, cambios de fondo, versiones localizadas, limpieza de composición y variantes de diseño desde un visual existente.'] },
      { title: 'Fusión con múltiples referencias', paragraphs: ['Wan 2.7 Image admite hasta 9 imágenes de entrada para generación y edición guiadas por referencia. Puedes combinar producto, estilo, fondo, hoja de personaje, logotipo o muestra de material en un prompt.', 'Para mejores resultados, indica qué controla cada referencia, como identidad, estilo, composición, fondo, empaque o paleta de color.'] },
      { title: 'Opciones de salida 2K y 4K', paragraphs: ['El modo estándar de Wan 2.7 Image admite 1K y 2K para generación y edición. La ruta Pro de texto a imagen admite 4K cuando no se usa imagen de referencia.', 'Usa 2K para ediciones con referencia y borradores rápidos. Elige 4K para pósters, tableros de producto detallados o conceptos de gran formato cuando el modo elegido lo permita.'] },
      { title: 'Conjuntos de imágenes consistentes', paragraphs: ['Wan 2.7 Image ayuda a planear visuales relacionados como frames de storyboard, variantes de catálogo, conceptos de libro infantil, imágenes para slides y campañas con varias tarjetas.', 'En Toolaze, nombra con claridad cada frame, ángulo o variante para que tenga una función definida dentro del prompt.'] },
    ] },
    gallery: { examples: [
      { title: 'Visual publicitario de producto', text: 'Crea imágenes comerciales limpias con producto principal, titular legible, beneficios y luz de estudio controlada.' },
      { title: 'Layout de póster de evento', text: 'Genera pósters con jerarquía de título, fecha, sede, bloques de ponentes y ritmo visual.' },
      { title: 'Concepto de empaque', text: 'Prueba sistemas de etiqueta, materiales, colores de marca, superficies de producto y presentación en retail.' },
      { title: 'Infografía educativa', text: 'Construye gráficos de aprendizaje con iconos, pasos numerados, etiquetas cortas y jerarquía visual limpia.' },
      { title: 'Edición de referencia de personaje', text: 'Usa referencias para mantener un sujeto o personaje consistente mientras cambias pose, ropa o escena.' },
      { title: 'Revisión de interiorismo', text: 'Transforma una habitación de referencia en otro estilo conservando distribución y ángulo de cámara.' },
      { title: 'Frame de storyboard', text: 'Planifica frames de campaña, momentos de escena, miniaturas y visuales narrativos con dirección consistente.' },
      { title: 'Tablero visual de marca', text: 'Combina tipografía, paleta, producto y notas de campaña en un tablero conceptual estructurado.' },
    ] },
    comparison: { rows: [
      { capability: 'Resolución máxima de salida', wan: 'Pro: 4K para texto a imagen; entrada/edición con imagen: 2K. Estándar: 2K', gpt: 'Hasta borde de 3840px y 8.29MP, incluido 3840x2160', seedream: 'La página oficial de Seed no lista un máximo público', nano: '1K, 2K, 4K Preview' },
      { capability: 'Imágenes de referencia', wan: '0 a 9 imágenes de entrada', gpt: 'Hasta 16 imágenes en flujos de edición de GPT image', seedream: 'Edición multiimagen; máximo oficial no listado', nano: 'Máximo 14 imágenes por prompt' },
      { capability: 'Edición de imágenes', wan: 'Compatible con prompt, imagen de entrada y cajas opcionales', gpt: 'Compatible mediante ediciones de imagen e imágenes de referencia', seedream: 'Compatible; la página oficial destaca preservación de detalle', nano: 'Compatible, incluida edición de imagen en varios turnos' },
      { capability: 'Relación de aspecto y tamaño', wan: 'Relación personalizada de 1:8 a 8:1 dentro de los límites de píxeles', gpt: 'Tamaño personalizado; relación hasta 3:1; los bordes deben ser múltiplos de 16', seedream: 'La página oficial muestra diseño multiformato; límites exactos de API no listados', nano: '1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9' },
      { capability: 'Fortaleza oficial', wan: 'Thinking Mode, conjuntos de imágenes, control de paleta, entrada con múltiples referencias', gpt: 'Tamaños flexibles de alta resolución, entradas de alta fidelidad, edición de imágenes', seedream: 'Consistencia de referencia, tipografía, texto denso, edición multiimagen', nano: 'Reasoning, Search grounding, C2PA, edición compleja en varios turnos' },
    ] },
    howTo: { steps: ['Abre el generador Wan 2.7 Image y elige texto a imagen o imagen a imagen.', 'Escribe un prompt con tipo de asset, sujeto, texto visible, layout, relación de aspecto, iluminación y estilo.', 'Sube referencias cuando quieras conservar un sujeto, producto, habitación, logotipo o dirección visual.', 'Elige resolución y relación de aspecto, genera la imagen y descarga el resultado o ajusta el prompt.'] },
    prompts: { examples: [
      { title: 'Póster de lanzamiento de producto', prompt: 'Crea un póster vertical de lanzamiento para una bebida premium de yuzu con gas. Incluye el titular legible "Yuzu Spark", subtítulo "bright citrus, zero sugar", una lata protagonista con condensación, rodajas de yuzu, fondo blanco y amarillo cítrico, pequeños beneficios y luz comercial pulida.' },
      { title: 'Póster de evento con mucho texto', prompt: 'Crea un póster moderno para "Future Design Week 2026". Incluye bloques de agenda legibles para tres sesiones, nombres de ponentes, fecha, sede, nota de entradas y un sistema visual abstracto fuerte. Usa jerarquía clara, espacio generoso y estilo editorial.' },
      { title: 'Fusión de estilo con varias referencias', prompt: 'Usa la imagen de producto subida como referencia exacta, la segunda como referencia de iluminación y la tercera como paleta de color. Crea un visual de campaña que mantenga la forma del producto sin cambios y aplique la luz y el color de las referencias.' },
      { title: 'Edición de personaje con referencia', prompt: 'Usa la referencia de personaje subida. Mantén el mismo rostro, peinado, proporciones e identidad del atuendo. Cambia la escena a una calle neón lluviosa de noche, añade pavimento reflectante, luz de contorno cinematográfica y una pose tranquila y segura. No cambies la identidad del personaje.' },
      { title: 'Infografía educativa', prompt: 'Crea una infografía limpia que explique cómo un panel solar convierte la luz solar en electricidad. Usa cuatro pasos numerados, etiquetas breves y legibles, iconos simples, paleta azul y amarilla, fondo blanco y jerarquía clara para clase.' },
      { title: 'Edición de interiorismo', prompt: 'Usa la foto de sala subida como referencia. Mantén ángulo de cámara, ventanas, paredes y posiciones de muebles. Rediseña la habitación en estilo Japandi sereno con roble, lino, luz indirecta cálida, paredes neutras y acabado ordenado de revista.' },
    ] },
    youtube: { examples: [
      { title: 'Prueba de control de color en Wan 2.7 Image', text: 'Recorrido centrado en control de color, manejo de paleta y comportamiento del modelo en pruebas prácticas.' },
      { title: 'Guía completa y prueba de Wan 2.7 Image', text: 'Prueba amplia de calidad, respuesta a prompts, modos de generación y salida visual con varios ejemplos.' },
      { title: 'Prueba completa de Wan 2.7 Image', text: 'Test de creador sobre calidad de salida, comportamiento con referencias y comparación con otras herramientas de imagen.' },
    ] },
    reddit: { items: [
      { title: 'Los modelos Wan 2.7 y Wan 2.7 Pro ya están disponibles', text: 'Un hilo de r/budgetpixel anuncia la disponibilidad de Wan 2.7 y Wan 2.7 Pro, con las imágenes originales de Reddit juntas en una tarjeta.' },
      { title: 'Wan 2.7 Image ya salió. ¿Alguien lo probó?', text: 'Un hilo de preguntas en r/AtlasCloudAI para leer primeras pruebas y reacciones prácticas más allá de las notas oficiales.' },
      { title: 'Wan 2.7 Image acaba de salir', text: 'Debate de lanzamiento en r/ArtificialInteligence sobre Wan 2.7 Image y expectativas para el próximo modelo de video Wan.' },
      { title: 'Alibaba lanza Wan 2.7 Image para visuales más nítidos', text: 'Publicación de r/aicuriosity sobre el lanzamiento de Wan 2.7 Image y su lugar como modelo de imagen reciente.' },
    ] },
    x: { items: [
      { title: 'Anuncio oficial de Wan2.7-Image', body: 'La cuenta oficial de Wan presenta Wan2.7-Image como modelo unificado para generación, edición, texto, color y conjuntos de imágenes.' },
      { title: 'Prueba de creador con rostros de referencia', body: 'Una prueba en japonés comenta el comportamiento natural con rostros de referencia y compara el detalle con otros modelos.' },
      { title: 'Resumen de modos de Wan 2.7', body: 'Una publicación pública de X resume texto a imagen, edición de imagen, Pro texto a imagen y modos Pro de edición.' },
      { title: 'Wan 2.7 Image en Poe', body: 'Poe anuncia Wan 2.7 Image y destaca conjuntos cohesivos, personajes consistentes, estilo, contexto y edición con cajas.' },
      { title: 'Evaluación temprana de creador', body: 'Un creador comparte pruebas iniciales y compara su posible lugar frente a modelos tipo Nano Banana y Seedream.' },
      { title: 'Resumen de funciones de Alisa Qian', body: 'Un resumen breve sobre control facial, control de color por paleta, texto multilingüe y edición interactiva.' },
      { title: 'Wan2.7-Image en Design Arena', body: 'Design Arena anuncia disponibilidad con notas sobre detalle, alineación al prompt, control de estilo y variantes del modelo.' },
      { title: 'Set de resultados de WaveSpeed', body: 'Una publicación de WaveSpeedAI muestra resultados de Wan 2.7 Image en un set multiimagen, útil para revisar su rango.' },
      { title: 'Wan 2.7 Image en fal', body: 'Una publicación relacionada con fal prueba una escena urbana compleja y menciona rostros realistas, extracción de color, texto multilingüe y edición visual.' },
      { title: 'Webinar de creadores Wan2.7', body: 'La cuenta oficial de Wan promociona un webinar sobre flujos de próxima generación y creatividad asistida por agentes de IA.' },
    ] },
    related: { links: [
      { text: 'Usa GPT Image 2 para visuales con mucho texto, edición, composiciones tipo UI y control de layout limpio.' },
      { text: 'Prueba Seedream 4.5 para visuales de producto, pósters, layouts con tipografía y ediciones guiadas por referencia.' },
      { text: 'Crea assets de alta resolución y bocetos visuales guiados por referencia con Nano Banana Pro.' },
      { text: 'Usa Nano Banana 2 para generación diaria rápida y variaciones visuales simples.' },
      { text: 'Explora páginas de modelos de imagen y video en Toolaze para comparar más opciones.' },
    ] },
    faq: { items: [
      { q: '¿Wan 2.7 Image es gratis en Toolaze?', a: 'Sí. Puedes probar Wan 2.7 Image gratis en Toolaze. El uso puede variar según cuota, ajustes de calidad, disponibilidad del modelo o límites de velocidad.' },
      { q: '¿Wan 2.7 Image admite edición de imágenes?', a: 'Sí. Wan 2.7 Image admite edición basada en prompts con referencias subidas, incluidos flujos donde el prompt indica qué conservar y qué cambiar.' },
      { q: '¿Cuántas imágenes de referencia puede usar Wan 2.7 Image?', a: 'Wan 2.7 Image admite hasta 9 imágenes de entrada en flujos con múltiples referencias. Asigna una función clara a cada referencia en el prompt.' },
      { q: '¿Wan 2.7 Image admite salida 4K?', a: 'El flujo estándar admite 1K y 2K. La ruta Pro de texto a imagen admite 4K cuando no se usa imagen de entrada. La edición con referencias debe usar 1K o 2K.' },
      { q: '¿Qué prompts funcionan mejor con Wan 2.7 Image?', a: 'Usa prompts estructurados que describan tipo de asset, sujeto, texto visible exacto, layout, referencias, iluminación, fondo, relación de aspecto y lo que debe permanecer sin cambios.' },
    ] },
  },
  'zh-TW': {
    features: { items: [
      { title: '適合複雜提示詞的思考模式', paragraphs: ['Wan 2.7 Image 在適用的文字生圖情境中支援思考模式，可協助模型在輸出前理解較長提示詞、版面規則、物件關係與視覺限制。', '適合海報、教學圖、活動概念，以及同時包含多個主體、精確文字、背景系統與構圖要求的提示詞。'] },
      { title: '文字渲染與結構化設計', paragraphs: ['Wan 2.7 Image 適合製作以標題為核心的圖形、標籤、菜單、社群卡片、活動海報與簡單資訊圖，這些內容都需要可讀文字與清楚版面。', '發布前仍需檢查生成文字，特別是小字法律聲明、地址、價格或品牌關鍵文案。'] },
      { title: '圖像生成與提示詞編輯', paragraphs: ['Wan 2.7 Image 可依提示詞建立新圖片，也能用自然語言指令編輯既有圖片。你可以上傳參考圖，描述要修改的內容，同時保持主體、版面或視覺方向穩定。', '可用於產品修圖、背景替換、在地化版本、構圖整理，以及從既有視覺延伸設計變體。'] },
      { title: '多參考圖融合', paragraphs: ['Wan 2.7 Image 在參考導向生成與編輯中支援最多 9 張輸入圖片。你可以在同一提示詞中組合產品照、風格參考、背景方向、角色設定、Logo 或材質樣本。', '為了取得更好的結果，請說明每張參考圖控制什麼，例如主體身份、風格、構圖、背景、包裝或色彩。'] },
      { title: '2K 與 4K 輸出選項', paragraphs: ['Wan 2.7 Image 標準模式支援 1K 與 2K 的生成和編輯。Pro 文字生圖路徑在未使用參考圖時支援 4K 輸出。', '參考圖編輯與快速活動草稿可使用 2K。當所選生成模式支援時，文字生圖海報、精細產品板或大型概念圖可選 4K。'] },
      { title: '一致的圖像組', paragraphs: ['Wan 2.7 Image 可協助規劃相關視覺，例如分鏡畫面、產品型錄變體、童書概念、簡報視覺與多卡片活動。', '在 Toolaze 使用時，請在提示詞中清楚命名每個畫面、角度或變體，讓每個需求都有明確角色。'] },
    ] },
    gallery: { examples: [
      { title: '產品廣告視覺', text: '建立乾淨的商業圖片，包含主產品、可讀標題、賣點標註與受控棚拍光線。' },
      { title: '活動海報版面', text: '生成包含標題層級、日期、地點、講者區塊與視覺節奏的海報。' },
      { title: '包裝概念', text: '測試標籤系統、材質、品牌色、產品表面與零售展示想法。' },
      { title: '教育資訊圖', text: '以圖示、編號步驟、短標籤與清楚層級建立簡潔教學圖。' },
      { title: '角色參考編輯', text: '使用參考圖保持主體或角色一致，同時改變姿勢、服裝或場景。' },
      { title: '室內設計修改', text: '將房間參考改成不同風格，同時保留平面布局與相機角度。' },
      { title: '分鏡畫面', text: '以一致方向規劃活動畫面、場景節奏、縮圖與敘事視覺。' },
      { title: '品牌視覺板', text: '將字體、色彩、產品圖與活動備註整合成一張結構化概念板。' },
    ] },
    comparison: { rows: [
      { capability: '最高輸出解析度', wan: 'Pro：文字生圖 4K；圖片輸入/編輯 2K。標準：2K', gpt: '最高 3840px 邊長與 8.29MP，包含 3840x2160', seedream: '官方 Seed 頁面未列出公開最高值', nano: '1K、2K、4K Preview' },
      { capability: '參考圖片', wan: '0 到 9 張輸入圖片', gpt: 'GPT 圖像編輯流程最多 16 張圖片', seedream: '支援多圖編輯；官方未列出最高數量', nano: '每個提示詞最多 14 張圖片' },
      { capability: '圖片編輯', wan: '支援提示詞、圖片輸入與可選框選', gpt: '透過圖片編輯與參考圖支援', seedream: '支援；官方頁面強調細節保留', nano: '支援，包含多輪圖片編輯' },
      { capability: '比例與尺寸', wan: '在像素限制內可自訂 1:8 到 8:1', gpt: '可自訂尺寸；比例最高 3:1；邊長需為 16 的倍數', seedream: '官方頁面展示多格式設計用途；未列出精確 API 限制', nano: '1:1、3:2、2:3、3:4、4:3、4:5、5:4、9:16、16:9、21:9' },
      { capability: '官方強項', wan: '思考模式、圖像組、色彩調色盤控制、多參考輸入', gpt: '彈性高解析尺寸、高保真輸入、圖片編輯', seedream: '參考一致性、字體排版、密集文字、多圖編輯', nano: 'Reasoning、Search grounding、C2PA、複雜多輪編輯' },
    ] },
    howTo: { steps: ['開啟 Wan 2.7 Image 生成器，選擇文字生圖或圖片生圖模式。', '撰寫提示詞，包含素材類型、主體、可見文字、版面、比例、光線與風格。', '若需要保留主體、產品、房間、Logo 或視覺方向，請上傳參考圖。', '選擇解析度與比例，生成圖片後下載，或調整提示詞再產生另一版。'] },
    prompts: { examples: [
      { title: '產品上市海報', prompt: '為高級柚子氣泡飲建立一張直式產品上市海報。包含可讀標題 "Yuzu Spark"、副標 "bright citrus, zero sugar"、一罐帶有凝結水珠的主產品、柚子切片、白色與柑橘黃背景、小型賣點標註，以及精緻商業光線。' },
      { title: '密集文字活動海報', prompt: '為 "Future Design Week 2026" 建立一張現代活動海報。包含三場議程的可讀時間表區塊、講者姓名、日期、地點、購票提示與大膽抽象視覺系統。使用清楚層級、充足留白與編輯設計風格。' },
      { title: '多參考風格融合', prompt: '使用上傳的產品圖片作為精確產品參考，第二張圖片作為光線參考，第三張圖片作為色彩參考。建立一張活動視覺，保持產品形狀不變，同時套用參考圖的光線與色彩方向。' },
      { title: '角色參考編輯', prompt: '使用上傳的角色參考圖。保持相同臉部、髮型、身體比例與服裝身份。將場景改成雨夜霓虹街道，加入反光路面、電影感輪廓光與平靜自信的姿勢。不要改變角色身份。' },
      { title: '教育資訊圖', prompt: '建立一張乾淨資訊圖，解釋太陽能板如何把陽光轉換成電力。使用四個編號步驟、短且可讀的標籤、簡單圖示、藍黃配色、白色背景，以及適合教室使用的清楚層級。' },
      { title: '室內設計編輯', prompt: '使用上傳的客廳照片作為參考。保持相機角度、窗戶、牆面與家具位置。將房間重新設計為平靜 Japandi 風格，加入橡木、亞麻質感、溫暖間接光、中性牆面與整潔的雜誌級完成感。' },
    ] },
    youtube: { examples: [
      { title: 'Wan 2.7 Image 色彩控制測試', text: '聚焦測試 Wan 2.7 Image 的色彩控制、調色盤處理，以及實際生圖中的模型表現。' },
      { title: 'Wan 2.7 Image 完整指南與測試', text: '透過多個範例測試品質、提示詞反應、生成模式與視覺輸出。' },
      { title: 'Wan 2.7 Image 全面測試', text: '創作者測試輸出品質、參考圖行為，以及此模型相較其他圖像工具的位置。' },
    ] },
    reddit: { items: [
      { title: 'Wan 2.7 和 Wan 2.7 Pro 圖像模型已可使用', text: 'r/budgetpixel 討論串宣布 Wan 2.7 和 Wan 2.7 Pro 可用，原始 Reddit 預覽圖保持在同一卡片中。' },
      { title: 'Wan 2.7 Image 已推出，有人測試了嗎？', text: 'r/AtlasCloudAI 的提問討論串，可用來閱讀官方模型說明之外的早期實測反應。' },
      { title: 'Wan 2.7 Image 剛發布', text: 'r/ArtificialInteligence 的發布討論，涵蓋 Wan 2.7 Image 以及使用者對下一個 Wan 影片模型的期待。' },
      { title: 'Alibaba 推出 Wan 2.7 Image，主打更清晰視覺', text: 'r/aicuriosity 貼文介紹 Wan 2.7 Image 發布，並將其定位為更新的圖像模型。' },
    ] },
    x: { items: [
      { title: '官方 Wan2.7-Image 發布', body: '官方 Wan 帳號介紹 Wan2.7-Image，將其定位為支援生成、編輯、文字渲染、色彩控制與圖像組的一體化模型。' },
      { title: '使用參考臉部的創作者測試', body: '一則日文創作者測試提到參考臉部的自然表現，並與其他圖像模型比較細節。' },
      { title: 'Wan 2.7 模式摘要', body: '公開 X 貼文整理 Wan 2.7 文字生圖、圖片編輯、Pro 文字生圖與 Pro 編輯模式。' },
      { title: 'Poe 上的 Wan 2.7 Image', body: 'Poe 宣布 Wan 2.7 Image 可用，並強調一致圖像組、角色一致性、風格、語境與框選編輯。' },
      { title: '早期創作者評測', body: '創作者分享早期 Wan 2.7 Image 測試，並比較它可能相對於 Nano Banana 與 Seedream 類模型的位置。' },
      { title: 'Alisa Qian 的功能整理', body: '簡短整理臉部控制、基於調色盤的色彩控制、多語文字渲染與互動式編輯。' },
      { title: 'Design Arena 上的 Wan2.7-Image', body: 'Design Arena 宣布 Wan2.7-Image 可用，並提到細節、提示詞對齊、風格控制與模型版本。' },
      { title: 'WaveSpeed 輸出組', body: 'WaveSpeedAI 貼文展示 Wan 2.7 Image 的多圖範例輸出，可用來觀察生成範圍。' },
      { title: 'fal 上的 Wan 2.7 Image', body: 'fal 相關貼文以複雜城市場景測試 Wan 2.7 Image，提到真實臉部、色彩擷取、多語文字與視覺編輯。' },
      { title: 'Wan2.7 創作者網路研討會', body: '官方 Wan 帳號宣傳 Wan2.7 創作者網路研討會，主題包含下一代工作流程與 AI 代理輔助創作。' },
    ] },
    related: { links: [
      { text: '使用 GPT Image 2 製作文字密集視覺、圖片編輯、UI 風構圖與乾淨版面控制。' },
      { text: '試用 Seedream 4.5 製作產品視覺、海報、字體豐富版面與參考導向編輯。' },
      { text: '使用 Nano Banana Pro 建立高解析圖片素材與參考導向視覺草稿。' },
      { text: '使用 Nano Banana 2 進行快速日常生圖與簡單視覺變體。' },
      { text: '瀏覽 Toolaze 圖像與影片模型頁面，進行更完整的模型比較。' },
    ] },
    faq: { items: [
      { q: 'Wan 2.7 Image 可以在 Toolaze 免費使用嗎？', a: '可以。你可以在 Toolaze 免費試用 Wan 2.7 Image。使用情況可能依配額、品質設定、模型可用性或速率限制而有所不同。' },
      { q: 'Wan 2.7 Image 支援圖片編輯嗎？', a: '支援。Wan 2.7 Image 支援使用上傳參考圖的提示詞式圖片編輯，提示詞可描述要保留與要改變的內容。' },
      { q: 'Wan 2.7 Image 可以使用幾張參考圖？', a: 'Wan 2.7 Image 在多參考流程中最多支援 9 張輸入圖片。請在提示詞中清楚指定每張參考圖的角色。' },
      { q: 'Wan 2.7 Image 支援 4K 輸出嗎？', a: '標準流程支援 1K 和 2K。Pro 文字生圖路徑在未使用輸入圖片時支援 4K。參考圖編輯建議使用 1K 或 2K。' },
      { q: 'Wan 2.7 Image 最適合哪類提示詞？', a: '適合使用結構化提示詞，描述素材類型、主體、精確可見文字、版面、參考、光線、背景、比例與必須保持不變的內容。' },
    ] },
  },
  pt: {
    features: { items: [
      { title: 'Modo de raciocínio para prompts complexos', paragraphs: ['Wan 2.7 Image oferece modo de raciocínio em cenários elegíveis de texto para imagem. Ele ajuda o modelo a interpretar prompts longos, regras de layout, relações entre objetos e restrições visuais antes de gerar a imagem.', 'Use para pôsteres, gráficos educativos, conceitos de campanha e prompts com vários sujeitos, texto exato, sistema de fundo e requisitos de composição.'] },
      { title: 'Texto legível e designs estruturados', paragraphs: ['Wan 2.7 Image é útil para gráficos com título, rótulos, menus, cards sociais, pôsteres de evento e infográficos simples que dependem de texto legível e layout claro.', 'Revise o texto gerado antes de publicar, especialmente em letras pequenas legais, endereços, preços ou frases críticas de marca.'] },
      { title: 'Geração e edição por prompt', paragraphs: ['Wan 2.7 Image cria imagens a partir de prompts e edita imagens existentes com instruções em linguagem natural. Envie uma referência e descreva o que mudar mantendo sujeito, layout ou direção visual.', 'Use para edições de produto, troca de fundo, versões localizadas, limpeza de composição e variações de design a partir de um visual existente.'] },
      { title: 'Fusão com múltiplas referências', paragraphs: ['Wan 2.7 Image aceita até 9 imagens de entrada para geração e edição guiadas por referência. Combine foto de produto, referência de estilo, direção de fundo, ficha de personagem, logotipo ou amostra de material em um prompt.', 'Para melhores resultados, diga o que cada referência controla, como identidade, estilo, composição, fundo, embalagem ou paleta de cores.'] },
      { title: 'Opções de saída 2K e 4K', paragraphs: ['O modo padrão de Wan 2.7 Image aceita 1K e 2K para geração e edição. O caminho Pro de texto para imagem aceita 4K quando nenhuma imagem de referência é usada.', 'Use 2K para edições com referência e rascunhos rápidos de campanha. Escolha 4K para pôsteres, painéis de produto detalhados ou conceitos grandes quando o modo selecionado aceitar.'] },
      { title: 'Conjuntos de imagem consistentes', paragraphs: ['Wan 2.7 Image ajuda a planejar visuais relacionados, como frames de storyboard, variações de catálogo, conceitos de livro infantil, imagens para slides e campanhas com múltiplos cards.', 'No Toolaze, nomeie claramente cada frame, ângulo ou variação no prompt para que cada pedido tenha uma função definida.'] },
    ] },
    gallery: { examples: [
      { title: 'Visual publicitário de produto', text: 'Crie imagens comerciais limpas com produto principal, título legível, chamadas de benefício e luz de estúdio controlada.' },
      { title: 'Layout de pôster de evento', text: 'Gere pôsteres com hierarquia de título, data, local, blocos de palestrantes e ritmo visual.' },
      { title: 'Conceito de embalagem', text: 'Teste sistemas de rótulo, materiais, cores de marca, superfícies de produto e ideias de apresentação no varejo.' },
      { title: 'Infográfico educativo', text: 'Crie gráficos de aprendizagem com ícones, etapas numeradas, rótulos curtos e hierarquia visual limpa.' },
      { title: 'Edição de personagem com referência', text: 'Use referências para manter um sujeito ou personagem consistente enquanto muda pose, roupa ou cena.' },
      { title: 'Revisão de design de interiores', text: 'Transforme uma referência de ambiente em outro estilo preservando layout e ângulo de câmera.' },
      { title: 'Frame de storyboard', text: 'Planeje frames de campanha, momentos de cena, miniaturas e visuais narrativos com direção consistente.' },
      { title: 'Quadro visual de marca', text: 'Combine tipografia, paleta, imagens de produto e notas de campanha em um quadro conceitual estruturado.' },
    ] },
    comparison: { rows: [
      { capability: 'Resolução máxima de saída', wan: 'Pro: 4K para texto para imagem; entrada/edição com imagem: 2K. Padrão: 2K', gpt: 'Até borda de 3840px e 8.29MP, incluindo 3840x2160', seedream: 'A página oficial da Seed não lista máximo público', nano: '1K, 2K, 4K Preview' },
      { capability: 'Imagens de referência', wan: '0 a 9 imagens de entrada', gpt: 'Até 16 imagens em fluxos de edição GPT image', seedream: 'Edição multiimagem; máximo oficial não listado', nano: 'Máximo de 14 imagens por prompt' },
      { capability: 'Edição de imagem', wan: 'Compatível com prompt, imagem de entrada e caixas opcionais', gpt: 'Compatível por edições de imagem e imagens de referência', seedream: 'Compatível; página oficial destaca preservação de detalhes', nano: 'Compatível, incluindo edição multi-turno' },
      { capability: 'Proporção e tamanho', wan: 'Proporção personalizada de 1:8 a 8:1 dentro dos limites de pixels', gpt: 'Tamanho personalizado; proporção até 3:1; bordas devem ser múltiplos de 16', seedream: 'Página oficial mostra design multiformato; limites exatos de API não listados', nano: '1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9' },
      { capability: 'Força oficial', wan: 'Thinking Mode, conjuntos de imagens, controle de paleta, múltiplas referências', gpt: 'Tamanhos flexíveis de alta resolução, entradas de alta fidelidade, edição de imagem', seedream: 'Consistência de referência, tipografia, texto denso, edição multiimagem', nano: 'Reasoning, Search grounding, C2PA, edição complexa multi-turno' },
    ] },
    howTo: { steps: ['Abra o gerador Wan 2.7 Image e escolha texto para imagem ou imagem para imagem.', 'Escreva um prompt com tipo de asset, sujeito, texto visível, layout, proporção, iluminação e estilo.', 'Envie referências quando quiser preservar sujeito, produto, ambiente, logotipo ou direção visual.', 'Selecione resolução e proporção, gere a imagem e baixe o resultado ou refine o prompt.'] },
    prompts: { examples: [
      { title: 'Pôster de lançamento de produto', prompt: 'Crie um pôster vertical de lançamento para uma bebida premium de yuzu com gás. Inclua o título legível "Yuzu Spark", subtítulo "bright citrus, zero sugar", uma lata principal com condensação, fatias de yuzu, fundo branco e amarelo cítrico, pequenas chamadas de benefício e iluminação comercial polida.' },
      { title: 'Pôster de evento com texto denso', prompt: 'Crie um pôster moderno para "Future Design Week 2026". Inclua blocos legíveis de agenda para três sessões, nomes dos palestrantes, data, local, nota de ingresso e um sistema visual abstrato forte. Use hierarquia clara, espaço generoso e estilo editorial.' },
      { title: 'Fusão de estilo com múltiplas referências', prompt: 'Use a imagem de produto enviada como referência exata, a segunda imagem como referência de iluminação e a terceira como paleta de cores. Crie um visual de campanha que mantenha a forma do produto inalterada e aplique luz e cor das referências.' },
      { title: 'Edição de personagem com referência', prompt: 'Use a referência de personagem enviada. Mantenha rosto, penteado, proporções corporais e identidade da roupa. Mude a cena para uma rua neon chuvosa à noite, adicione pavimento refletivo, luz de contorno cinematográfica e pose calma e confiante. Não altere a identidade.' },
      { title: 'Infográfico educativo', prompt: 'Crie um infográfico limpo explicando como um painel solar converte luz do sol em eletricidade. Use quatro etapas numeradas, rótulos curtos e legíveis, ícones simples, paleta azul e amarela, fundo branco e hierarquia clara para sala de aula.' },
      { title: 'Edição de design de interiores', prompt: 'Use a foto da sala enviada como referência. Mantenha ângulo de câmera, janelas, paredes e posições dos móveis. Redesenhe o ambiente em estilo Japandi calmo com madeira de carvalho, texturas de linho, luz indireta quente, paredes neutras e acabamento organizado de revista.' },
    ] },
    youtube: { examples: [
      { title: 'Teste de controle de cor do Wan 2.7 Image', text: 'Um walkthrough focado em controle de cor, paleta e comportamento do modelo em testes práticos de geração.' },
      { title: 'Guia completo e teste do Wan 2.7 Image', text: 'Um teste mais longo de qualidade, resposta a prompts, modos de geração e saída visual em vários exemplos.' },
      { title: 'Teste completo do Wan 2.7 Image', text: 'Um teste de criador sobre qualidade de saída, comportamento com referência e comparação com outras ferramentas de imagem.' },
    ] },
    reddit: { items: [
      { title: 'Modelos Wan 2.7 e Wan 2.7 Pro já estão disponíveis', text: 'Thread de r/budgetpixel anunciando disponibilidade de Wan 2.7 e Wan 2.7 Pro, com as imagens originais do Reddit reunidas em um card.' },
      { title: 'Wan 2.7 Image saiu. Alguém já testou?', text: 'Thread de perguntas em r/AtlasCloudAI para ler testes iniciais e reações práticas além das notas oficiais.' },
      { title: 'Wan 2.7 Image acabou de ser lançado', text: 'Discussão de lançamento em r/ArtificialInteligence sobre Wan 2.7 Image e expectativas para o próximo modelo de vídeo Wan.' },
      { title: 'Alibaba lança Wan 2.7 Image para visuais mais nítidos', text: 'Post de r/aicuriosity sobre o lançamento de Wan 2.7 Image e seu posicionamento como modelo de imagem mais novo.' },
    ] },
    x: { items: [
      { title: 'Anúncio oficial do Wan2.7-Image', body: 'A conta oficial Wan apresenta Wan2.7-Image como modelo unificado para geração, edição, texto, cor e conjuntos de imagens.' },
      { title: 'Teste de criador com rostos de referência', body: 'Um teste em japonês comenta o comportamento natural com rostos de referência e compara detalhes com outros modelos.' },
      { title: 'Resumo dos modos do Wan 2.7', body: 'Um post público no X resume texto para imagem, edição de imagem, Pro texto para imagem e modos Pro de edição.' },
      { title: 'Wan 2.7 Image no Poe', body: 'Poe anuncia Wan 2.7 Image e destaca conjuntos coesos, personagens consistentes, estilo, contexto e edição por caixas.' },
      { title: 'Avaliação inicial de criador', body: 'Um criador compartilha testes iniciais e compara a posição possível frente a modelos como Nano Banana e Seedream.' },
      { title: 'Resumo de recursos por Alisa Qian', body: 'Resumo curto sobre controle facial, controle de cor por paleta, texto multilíngue e edição interativa.' },
      { title: 'Wan2.7-Image no Design Arena', body: 'Design Arena anuncia disponibilidade com notas sobre detalhe, alinhamento ao prompt, controle de estilo e variantes.' },
      { title: 'Conjunto de saídas da WaveSpeed', body: 'Post da WaveSpeedAI mostra saídas do Wan 2.7 Image em um conjunto multiimagem, útil para revisar o alcance da geração.' },
      { title: 'Wan 2.7 Image no fal', body: 'Post relacionado à fal testa uma cena urbana complexa e cita rostos realistas, extração de cor, texto multilíngue e edição visual.' },
      { title: 'Webinar de criadores Wan2.7', body: 'A conta oficial Wan promove um webinar sobre fluxos de próxima geração e criatividade assistida por agentes de IA.' },
    ] },
    related: { links: [
      { text: 'Use GPT Image 2 para visuais com muito texto, edição, composições estilo UI e controle de layout limpo.' },
      { text: 'Teste Seedream 4.5 para visuais de produto, pôsteres, layouts ricos em tipografia e edições guiadas por referência.' },
      { text: 'Crie assets em alta resolução e rascunhos visuais guiados por referência com Nano Banana Pro.' },
      { text: 'Use Nano Banana 2 para geração rápida do dia a dia e variações visuais simples.' },
      { text: 'Navegue por páginas de modelos de imagem e vídeo no Toolaze para comparar mais modelos.' },
    ] },
    faq: { items: [
      { q: 'Wan 2.7 Image é grátis no Toolaze?', a: 'Sim. Você pode testar Wan 2.7 Image gratuitamente no Toolaze. O uso pode variar conforme cota, configurações de qualidade, disponibilidade do modelo ou limites de taxa.' },
      { q: 'Wan 2.7 Image aceita edição de imagens?', a: 'Sim. Wan 2.7 Image aceita edição baseada em prompt com referências enviadas, incluindo fluxos em que o prompt descreve o que preservar e o que mudar.' },
      { q: 'Quantas imagens de referência Wan 2.7 Image pode usar?', a: 'Wan 2.7 Image aceita até 9 imagens de entrada em fluxos com múltiplas referências. Defina uma função clara para cada referência no prompt.' },
      { q: 'Wan 2.7 Image aceita saída 4K?', a: 'O fluxo padrão aceita 1K e 2K. O caminho Pro de texto para imagem aceita 4K quando nenhuma imagem de entrada é usada. Edição baseada em referência deve usar 1K ou 2K.' },
      { q: 'Quais prompts funcionam melhor com Wan 2.7 Image?', a: 'Use prompts estruturados que descrevam tipo de asset, sujeito, texto visível exato, layout, referências, iluminação, fundo, proporção e o que deve permanecer inalterado.' },
    ] },
  },
  fr: {
    features: { items: [
      { title: 'Mode raisonnement pour prompts complexes', paragraphs: ['Wan 2.7 Image prend en charge le mode raisonnement dans les scénarios texte vers image éligibles. Il aide le modèle à interpréter les longs prompts, règles de mise en page, relations entre objets et contraintes visuelles avant la génération.', 'Utilisez-le pour des affiches, visuels pédagogiques, concepts de campagne et prompts qui décrivent plusieurs sujets, du texte exact, un système de fond et des règles de composition.'] },
      { title: 'Texte lisible et designs structurés', paragraphs: ['Wan 2.7 Image convient aux visuels guidés par un titre, étiquettes, menus, cartes sociales, affiches événementielles et infographies simples qui demandent du texte lisible et une mise en page claire.', 'Relisez le texte généré avant publication, surtout pour les mentions légales, adresses, prix ou formulations importantes pour la marque.'] },
      { title: 'Génération et édition par prompt', paragraphs: ['Wan 2.7 Image crée de nouvelles images depuis des prompts et modifie des images existantes avec des consignes en langage naturel. Ajoutez une référence et décrivez ce qui doit changer tout en gardant sujet, mise en page ou direction visuelle.', 'Utilisez-le pour des retouches produit, changements de fond, versions localisées, nettoyage de composition et variantes de design depuis un visuel existant.'] },
      { title: 'Fusion de références multiples', paragraphs: ['Wan 2.7 Image prend en charge jusqu\'à 9 images d\'entrée pour la génération et l\'édition guidées par référence. Vous pouvez combiner photo produit, référence de style, direction de fond, fiche personnage, logo ou échantillon de matière dans un prompt.', 'Pour de meilleurs résultats, indiquez ce que chaque référence contrôle, comme identité, style, composition, fond, packaging ou palette de couleurs.'] },
      { title: 'Options de sortie 2K et 4K', paragraphs: ['Le mode standard de Wan 2.7 Image prend en charge 1K et 2K pour la génération et l\'édition. Le chemin Pro texte vers image prend en charge 4K lorsqu\'aucune image de référence n\'est utilisée.', 'Utilisez 2K pour les éditions avec référence et les brouillons rapides. Choisissez 4K pour les affiches, planches produit détaillées ou concepts grand format lorsque le mode choisi le permet.'] },
      { title: 'Ensembles d\'images cohérents', paragraphs: ['Wan 2.7 Image peut aider à préparer des visuels liés, comme frames de storyboard, variantes de catalogue, concepts de livre jeunesse, visuels de présentation et campagnes multi-cartes.', 'Sur Toolaze, nommez clairement chaque frame, angle ou variante dans le prompt afin que chaque demande ait un rôle défini.'] },
    ] },
    gallery: { examples: [
      { title: 'Visuel publicitaire produit', text: 'Créez des images commerciales propres avec produit principal, titre lisible, bénéfices et éclairage studio maîtrisé.' },
      { title: 'Mise en page d\'affiche événement', text: 'Générez des affiches avec hiérarchie de titre, date, lieu, blocs intervenants et rythme visuel.' },
      { title: 'Concept packaging', text: 'Testez systèmes d\'étiquette, matières, couleurs de marque, surfaces produit et idées de présentation retail.' },
      { title: 'Infographie pédagogique', text: 'Créez des graphiques d\'apprentissage avec icônes, étapes numérotées, libellés courts et hiérarchie claire.' },
      { title: 'Édition de personnage avec référence', text: 'Utilisez des références pour garder un sujet ou personnage cohérent tout en changeant pose, tenue ou scène.' },
      { title: 'Révision de design intérieur', text: 'Transformez une pièce de référence dans un autre style tout en conservant plan et angle caméra.' },
      { title: 'Frame de storyboard', text: 'Préparez frames de campagne, temps forts de scène, vignettes et visuels narratifs avec une direction cohérente.' },
      { title: 'Planche visuelle de marque', text: 'Combinez typographie, palette, imagerie produit et notes de campagne dans une planche concept structurée.' },
    ] },
    comparison: { rows: [
      { capability: 'Résolution maximale de sortie', wan: 'Pro : 4K pour texte vers image; entrée/édition image : 2K. Standard : 2K', gpt: 'Jusqu\'à 3840px de côté et 8.29MP, y compris 3840x2160', seedream: 'La page officielle Seed ne liste pas de maximum public', nano: '1K, 2K, 4K Preview' },
      { capability: 'Images de référence', wan: '0 à 9 images d\'entrée', gpt: 'Jusqu\'à 16 images pour les flux d\'édition GPT image', seedream: 'Édition multi-image; maximum officiel non listé', nano: 'Maximum 14 images par prompt' },
      { capability: 'Édition d\'image', wan: 'Compatible avec prompt, image d\'entrée et boîtes optionnelles', gpt: 'Compatible via édition d\'image et images de référence', seedream: 'Compatible; la page officielle met en avant la préservation des détails', nano: 'Compatible, y compris édition multi-tour' },
      { capability: 'Ratio et taille', wan: 'Ratio personnalisé de 1:8 à 8:1 dans les limites de pixels', gpt: 'Taille personnalisée; ratio jusqu\'à 3:1; côtés multiples de 16', seedream: 'La page officielle montre du design multi-format; limites API exactes non listées', nano: '1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9' },
      { capability: 'Force officielle', wan: 'Thinking Mode, ensembles d\'images, contrôle de palette, références multiples', gpt: 'Tailles haute résolution flexibles, entrées haute fidélité, édition d\'images', seedream: 'Cohérence des références, typographie, texte dense, édition multi-image', nano: 'Reasoning, Search grounding, C2PA, édition complexe multi-tour' },
    ] },
    howTo: { steps: ['Ouvrez le générateur Wan 2.7 Image et choisissez texte vers image ou image vers image.', 'Rédigez un prompt avec type d\'asset, sujet, texte visible, mise en page, ratio, lumière et style.', 'Ajoutez des images de référence pour préserver sujet, produit, pièce, logo ou direction visuelle.', 'Sélectionnez résolution et ratio, générez l\'image, puis téléchargez-la ou affinez le prompt.'] },
    prompts: { examples: [
      { title: 'Affiche de lancement produit', prompt: 'Créez une affiche verticale de lancement pour une boisson pétillante premium au yuzu. Incluez le titre lisible "Yuzu Spark", le sous-titre "bright citrus, zero sugar", une canette principale avec condensation, des tranches de yuzu, un fond blanc et jaune agrume, de petits bénéfices et un éclairage commercial soigné.' },
      { title: 'Affiche événement riche en texte', prompt: 'Créez une affiche moderne pour "Future Design Week 2026". Incluez des blocs de programme lisibles pour trois sessions, noms des intervenants, date, lieu, note billetterie et système visuel abstrait fort. Utilisez une hiérarchie nette, de l\'espace et un style éditorial.' },
      { title: 'Fusion de style multi-références', prompt: 'Utilisez l\'image produit importée comme référence exacte, la deuxième comme référence d\'éclairage et la troisième comme référence de palette. Créez un visuel de campagne qui garde la forme du produit inchangée tout en appliquant lumière et couleurs des références.' },
      { title: 'Édition de personnage avec référence', prompt: 'Utilisez la référence de personnage importée. Gardez le même visage, la même coiffure, les proportions et l\'identité de tenue. Changez la scène pour une rue néon pluvieuse de nuit, avec chaussée réfléchissante, rim light cinématographique et pose calme et confiante. Ne changez pas l\'identité du personnage.' },
      { title: 'Infographie pédagogique', prompt: 'Créez une infographie claire expliquant comment un panneau solaire convertit la lumière en électricité. Utilisez quatre étapes numérotées, libellés courts et lisibles, icônes simples, palette bleue et jaune, fond blanc et hiérarchie claire pour la classe.' },
      { title: 'Édition de design intérieur', prompt: 'Utilisez la photo de salon importée comme référence. Gardez angle caméra, fenêtres, murs et positions des meubles. Redessinez la pièce dans un style Japandi calme avec chêne, lin, lumière indirecte chaude, murs neutres et finition rangée de magazine.' },
    ] },
    youtube: { examples: [
      { title: 'Test du contrôle couleur Wan 2.7 Image', text: 'Un passage ciblé sur le contrôle couleur, la gestion de palette et le comportement du modèle dans des tests pratiques.' },
      { title: 'Guide complet et test Wan 2.7 Image', text: 'Un test plus long sur qualité, réponse aux prompts, modes de génération et sorties visuelles sur plusieurs exemples.' },
      { title: 'Test complet Wan 2.7 Image', text: 'Un test créateur sur qualité de sortie, comportement avec références et position du modèle face à d\'autres outils image.' },
    ] },
    reddit: { items: [
      { title: 'Les modèles Wan 2.7 et Wan 2.7 Pro sont disponibles', text: 'Un fil r/budgetpixel annonce la disponibilité de Wan 2.7 et Wan 2.7 Pro, avec les aperçus Reddit originaux réunis dans une carte.' },
      { title: 'Wan 2.7 Image est sorti. Quelqu\'un l\'a testé ?', text: 'Un fil de questions r/AtlasCloudAI pour lire les premiers tests et réactions pratiques au-delà des notes officielles.' },
      { title: 'Wan 2.7 Image vient de sortir', text: 'Discussion de lancement r/ArtificialInteligence sur Wan 2.7 Image et les attentes envers le prochain modèle vidéo Wan.' },
      { title: 'Alibaba lance Wan 2.7 Image pour des visuels plus nets', text: 'Post r/aicuriosity sur la sortie de Wan 2.7 Image et son positionnement comme modèle d\'image plus récent.' },
    ] },
    x: { items: [
      { title: 'Annonce officielle Wan2.7-Image', body: 'Le compte officiel Wan présente Wan2.7-Image comme modèle unifié pour génération, édition, texte, couleur et ensembles d\'images.' },
      { title: 'Test créateur avec visages de référence', body: 'Un test en japonais note un comportement naturel avec les visages de référence et compare les détails avec d\'autres modèles.' },
      { title: 'Résumé des modes Wan 2.7', body: 'Un post X public résume texte vers image, édition image, Pro texte vers image et modes Pro d\'édition.' },
      { title: 'Wan 2.7 Image sur Poe', body: 'Poe annonce Wan 2.7 Image et met en avant ensembles cohérents, personnages consistants, style, contexte et édition par boîtes.' },
      { title: 'Première évaluation créateur', body: 'Un créateur partage des tests initiaux et compare sa place possible face à Nano Banana et aux modèles de type Seedream.' },
      { title: 'Synthèse de fonctions par Alisa Qian', body: 'Résumé court sur contrôle facial, contrôle couleur par palette, texte multilingue et édition interactive.' },
      { title: 'Wan2.7-Image sur Design Arena', body: 'Design Arena annonce la disponibilité avec des notes sur détail, alignement au prompt, contrôle stylistique et variantes.' },
      { title: 'Set de sorties WaveSpeed', body: 'Un post WaveSpeedAI montre des sorties Wan 2.7 Image dans un set multi-image, utile pour vérifier l\'amplitude de génération.' },
      { title: 'Wan 2.7 Image sur fal', body: 'Un post lié à fal teste une scène urbaine complexe et mentionne visages réalistes, extraction couleur, texte multilingue et édition visuelle.' },
      { title: 'Webinar créateur Wan2.7', body: 'Le compte officiel Wan promeut un webinar sur les flux nouvelle génération et la créativité assistée par agents IA.' },
    ] },
    related: { links: [
      { text: 'Utilisez GPT Image 2 pour visuels riches en texte, édition, compositions type UI et contrôle de mise en page.' },
      { text: 'Essayez Seedream 4.5 pour visuels produit, affiches, layouts typographiques et éditions guidées par référence.' },
      { text: 'Créez des assets haute résolution et brouillons guidés par référence avec Nano Banana Pro.' },
      { text: 'Utilisez Nano Banana 2 pour génération rapide du quotidien et variations visuelles simples.' },
      { text: 'Parcourez les pages de modèles image et vidéo Toolaze pour comparer plus largement.' },
    ] },
    faq: { items: [
      { q: 'Wan 2.7 Image est-il gratuit sur Toolaze ?', a: 'Oui. Vous pouvez essayer Wan 2.7 Image gratuitement sur Toolaze. L\'usage peut varier selon quota, paramètres de qualité, disponibilité du modèle ou limites de débit.' },
      { q: 'Wan 2.7 Image prend-il en charge l\'édition d\'images ?', a: 'Oui. Wan 2.7 Image prend en charge l\'édition par prompt avec références importées, y compris les flux où le prompt précise ce qu\'il faut conserver et modifier.' },
      { q: 'Combien d\'images de référence Wan 2.7 Image peut-il utiliser ?', a: 'Wan 2.7 Image accepte jusqu\'à 9 images d\'entrée dans les flux multi-références. Attribuez clairement un rôle à chaque référence dans le prompt.' },
      { q: 'Wan 2.7 Image prend-il en charge la sortie 4K ?', a: 'Le flux standard prend en charge 1K et 2K. Le chemin Pro texte vers image prend en charge 4K lorsqu\'aucune image d\'entrée n\'est utilisée. L\'édition basée sur référence doit utiliser 1K ou 2K.' },
      { q: 'Quels prompts fonctionnent le mieux avec Wan 2.7 Image ?', a: 'Utilisez des prompts structurés avec type d\'asset, sujet, texte visible exact, mise en page, références, lumière, fond, ratio et éléments à garder inchangés.' },
    ] },
  },
  ko: {
    features: { items: [
      { title: '복잡한 프롬프트를 위한 Thinking Mode', paragraphs: ['Wan 2.7 Image는 적합한 텍스트-이미지 시나리오에서 Thinking Mode를 지원합니다. 긴 프롬프트, 레이아웃 규칙, 객체 관계, 시각적 제약을 출력 전에 해석하는 데 도움을 줍니다.', '포스터, 교육용 그래픽, 캠페인 콘셉트, 여러 주제와 정확한 텍스트, 배경 체계, 구도 조건을 한 번에 담는 프롬프트에 적합합니다.'] },
      { title: '텍스트 렌더링과 구조화 디자인', paragraphs: ['Wan 2.7 Image는 제목 중심 그래픽, 라벨, 메뉴, 소셜 카드, 이벤트 포스터, 간단한 정보 그래픽처럼 읽기 쉬운 텍스트와 명확한 레이아웃이 필요한 작업에 적합합니다.', '게시 전 생성된 텍스트를 확인하세요. 특히 작은 법적 문구, 주소, 가격, 브랜드 핵심 문구는 검토가 필요합니다.'] },
      { title: '이미지 생성과 프롬프트 기반 편집', paragraphs: ['Wan 2.7 Image는 프롬프트로 새 이미지를 만들고 자연어 지시로 기존 이미지를 편집할 수 있습니다. 참조 이미지를 업로드하고 주제, 레이아웃, 시각 방향을 유지하면서 변경할 내용을 설명할 수 있습니다.', '제품 편집, 배경 변경, 현지화 버전, 구도 정리, 기존 비주얼 기반 디자인 변형에 사용할 수 있습니다.'] },
      { title: '다중 참조 이미지 융합', paragraphs: ['Wan 2.7 Image는 참조 기반 생성과 편집에서 최대 9장의 입력 이미지를 지원합니다. 제품 사진, 스타일 참조, 배경 방향, 캐릭터 시트, 로고, 소재 샘플을 하나의 프롬프트에 결합할 수 있습니다.', '좋은 결과를 위해 각 참조가 무엇을 제어하는지 명시하세요. 예를 들어 주체 정체성, 스타일, 구도, 배경, 패키지, 색상 팔레트가 있습니다.'] },
      { title: '2K와 4K 출력 옵션', paragraphs: ['Wan 2.7 Image 표준 모드는 생성과 편집에서 1K와 2K를 지원합니다. Pro 텍스트-이미지 경로는 참조 이미지를 사용하지 않을 때 4K 출력을 지원합니다.', '참조 편집과 빠른 캠페인 초안에는 2K를 사용하세요. 선택한 생성 모드가 지원할 때 포스터, 상세 제품 보드, 대형 콘셉트에는 4K를 선택할 수 있습니다.'] },
      { title: '일관된 이미지 세트', paragraphs: ['Wan 2.7 Image는 스토리보드 프레임, 제품 카탈로그 변형, 어린이책 콘셉트, 슬라이드 비주얼, 멀티 카드 캠페인 같은 관련 비주얼을 계획하는 데 도움을 줍니다.', 'Toolaze에서는 요청한 각 프레임, 각도, 변형의 역할이 분명하도록 프롬프트에서 명확하게 이름을 붙이세요.'] },
    ] },
    gallery: { examples: [
      { title: '제품 광고 비주얼', text: '주요 제품, 읽기 쉬운 헤드라인, 장점 콜아웃, 제어된 스튜디오 조명으로 깔끔한 상업 이미지를 만듭니다.' },
      { title: '이벤트 포스터 레이아웃', text: '제목 계층, 날짜, 장소, 발표자 블록, 시각 리듬이 있는 포스터를 생성합니다.' },
      { title: '패키지 콘셉트', text: '라벨 시스템, 소재, 브랜드 색상, 제품 표면, 리테일 진열 아이디어를 테스트합니다.' },
      { title: '교육용 인포그래픽', text: '아이콘, 번호 단계, 짧은 라벨, 깨끗한 시각 계층으로 학습 그래픽을 만듭니다.' },
      { title: '캐릭터 참조 편집', text: '참조를 사용해 주체나 캐릭터를 일관되게 유지하면서 포즈, 의상, 장면을 바꿉니다.' },
      { title: '인테리어 디자인 수정', text: '방 참조를 다른 스타일로 바꾸면서 레이아웃과 카메라 각도를 유지합니다.' },
      { title: '스토리보드 프레임', text: '일관된 방향으로 캠페인 프레임, 장면 비트, 썸네일, 내러티브 비주얼을 계획합니다.' },
      { title: '브랜드 비주얼 보드', text: '타이포그래피, 팔레트, 제품 이미지, 캠페인 메모를 하나의 구조화된 콘셉트 보드로 결합합니다.' },
    ] },
    comparison: { rows: [
      { capability: '최대 출력 해상도', wan: 'Pro: 텍스트-이미지 4K; 이미지 입력/편집 2K. 표준: 2K', gpt: '최대 3840px 변과 8.29MP, 3840x2160 포함', seedream: '공식 Seed 페이지에 공개 최대값 없음', nano: '1K, 2K, 4K Preview' },
      { capability: '참조 이미지', wan: '0~9장 입력 이미지', gpt: 'GPT image 편집 워크플로에서 최대 16장', seedream: '다중 이미지 편집 지원; 공식 최대값 미기재', nano: '프롬프트당 최대 14장' },
      { capability: '이미지 편집', wan: '프롬프트, 이미지 입력, 선택적 박스로 지원', gpt: '이미지 편집과 참조 이미지로 지원', seedream: '지원. 공식 페이지는 디테일 보존을 강조', nano: '다중 턴 이미지 편집 포함 지원' },
      { capability: '비율과 크기', wan: '픽셀 제한 내 1:8~8:1 사용자 지정 비율', gpt: '사용자 지정 크기. 비율 최대 3:1. 변은 16의 배수', seedream: '공식 페이지는 다중 포맷 디자인을 표시. 정확한 API 제한은 미기재', nano: '1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9' },
      { capability: '공식 강점', wan: 'Thinking Mode, 이미지 세트, 색상 팔레트 제어, 다중 참조 입력', gpt: '유연한 고해상도 크기, 고충실도 입력, 이미지 편집', seedream: '참조 일관성, 타이포그래피, 고밀도 텍스트, 다중 이미지 편집', nano: 'Reasoning, Search grounding, C2PA, 복잡한 다중 턴 편집' },
    ] },
    howTo: { steps: ['Wan 2.7 Image 생성기를 열고 텍스트-이미지 또는 이미지-이미지 모드를 선택합니다.', '에셋 유형, 주제, 보이는 텍스트, 레이아웃, 화면 비율, 조명, 스타일을 프롬프트에 작성합니다.', '주제, 제품, 방, 로고, 시각 방향을 보존하려면 참조 이미지를 업로드합니다.', '해상도와 비율을 선택하고 이미지를 생성한 뒤 다운로드하거나 프롬프트를 다듬습니다.'] },
    prompts: { examples: [
      { title: '제품 출시 포스터', prompt: '프리미엄 유자 탄산음료의 세로형 출시 포스터를 만들어 주세요. 읽기 쉬운 헤드라인 "Yuzu Spark", 부제 "bright citrus, zero sugar", 물방울이 맺힌 메인 캔, 유자 슬라이스, 흰색과 시트러스 옐로 배경, 작은 장점 콜아웃, 세련된 상업 조명을 포함하세요.' },
      { title: '텍스트가 많은 이벤트 포스터', prompt: '"Future Design Week 2026"을 위한 현대적인 이벤트 포스터를 만들어 주세요. 세 세션의 읽기 쉬운 일정 블록, 발표자 이름, 날짜, 장소, 티켓 안내, 강한 추상 비주얼 시스템을 포함하세요. 명확한 계층, 넉넉한 여백, 에디토리얼 디자인 스타일을 사용하세요.' },
      { title: '다중 참조 스타일 융합', prompt: '업로드한 제품 이미지는 정확한 제품 참조로, 두 번째 이미지는 조명 참조로, 세 번째 이미지는 색상 팔레트 참조로 사용하세요. 제품 형태는 바꾸지 않고 참조의 조명과 색상 방향을 적용한 캠페인 비주얼을 만드세요.' },
      { title: '캐릭터 참조 편집', prompt: '업로드한 캐릭터 참조를 사용하세요. 같은 얼굴, 헤어스타일, 신체 비율, 의상 정체성을 유지하세요. 장면을 밤의 비 내리는 네온 거리로 바꾸고, 반사되는 포장도로, 영화 같은 림 라이트, 차분하고 자신감 있는 포즈를 추가하세요. 캐릭터 정체성은 바꾸지 마세요.' },
      { title: '교육용 인포그래픽', prompt: '태양광 패널이 햇빛을 전기로 바꾸는 과정을 설명하는 깔끔한 인포그래픽을 만들어 주세요. 네 개의 번호 단계, 짧고 읽기 쉬운 라벨, 단순한 아이콘, 파란색과 노란색 팔레트, 흰 배경, 수업용 명확한 계층을 사용하세요.' },
      { title: '인테리어 디자인 편집', prompt: '업로드한 거실 사진을 참조로 사용하세요. 카메라 각도, 창문, 벽, 가구 위치를 유지하세요. 오크 목재, 리넨 질감, 따뜻한 간접 조명, 중성 벽, 정돈된 잡지 스타일 마감으로 차분한 재팬디 스타일로 다시 디자인하세요.' },
    ] },
    youtube: { examples: [
      { title: 'Wan 2.7 Image 색상 제어 테스트', text: '색상 제어, 팔레트 처리, 실제 이미지 생성 테스트에서의 모델 동작을 집중적으로 다룹니다.' },
      { title: 'Wan 2.7 Image 전체 가이드와 테스트', text: '여러 예시를 통해 품질, 프롬프트 반응, 생성 모드, 시각 출력을 길게 테스트합니다.' },
      { title: 'Wan 2.7 Image 전체 테스트', text: '출력 품질, 참조 동작, 다른 이미지 도구와의 비교 위치를 살펴보는 크리에이터 테스트입니다.' },
    ] },
    reddit: { items: [
      { title: 'Wan 2.7 및 Wan 2.7 Pro 이미지 모델 사용 가능', text: 'r/budgetpixel 스레드가 Wan 2.7 및 Wan 2.7 Pro 제공을 알리며, 원본 Reddit 미리보기 이미지를 한 카드에 함께 유지합니다.' },
      { title: 'Wan 2.7 Image가 출시되었습니다. 테스트한 사람이 있나요?', text: '공식 모델 노트 외의 초기 사용자 테스트와 실제 반응을 읽기 좋은 r/AtlasCloudAI 질문 스레드입니다.' },
      { title: 'Wan 2.7 Image가 막 공개되었습니다', text: 'Wan 2.7 Image와 다음 Wan 비디오 모델에 대한 기대를 다루는 r/ArtificialInteligence 출시 토론입니다.' },
      { title: 'Alibaba가 더 선명한 비주얼을 위한 Wan 2.7 Image 출시', text: 'Wan 2.7 Image 출시와 새로운 이미지 모델로서의 위치를 다루는 r/aicuriosity 게시물입니다.' },
    ] },
    x: { items: [
      { title: '공식 Wan2.7-Image 발표', body: '공식 Wan 계정이 Wan2.7-Image를 생성, 편집, 텍스트 렌더링, 색상 제어, 이미지 세트를 위한 통합 모델로 소개합니다.' },
      { title: '참조 얼굴을 사용한 크리에이터 테스트', body: '일본어 크리에이터 테스트에서 참조 얼굴의 자연스러운 동작과 다른 이미지 모델 대비 디테일을 언급합니다.' },
      { title: 'Wan 2.7 모델 모드 요약', body: '공개 X 게시물이 Wan 2.7 텍스트-이미지, 이미지 편집, Pro 텍스트-이미지, Pro 편집 모드를 요약합니다.' },
      { title: 'Poe의 Wan 2.7 Image', body: 'Poe가 Wan 2.7 Image 제공을 알리고 일관된 이미지 세트, 캐릭터, 스타일, 맥락, 박스 편집을 강조합니다.' },
      { title: '초기 크리에이터 평가', body: '크리에이터가 초기 Wan 2.7 Image 테스트를 공유하고 Nano Banana 및 Seedream 계열 모델과의 위치를 비교합니다.' },
      { title: 'Alisa Qian의 기능 정리', body: '얼굴 제어, 팔레트 기반 색상 제어, 다국어 텍스트 렌더링, 인터랙티브 편집을 간결하게 정리합니다.' },
      { title: 'Design Arena의 Wan2.7-Image', body: 'Design Arena가 Wan2.7-Image 제공을 알리며 디테일, 프롬프트 정렬, 스타일 제어, 모델 변형을 언급합니다.' },
      { title: 'WaveSpeed 출력 세트', body: 'WaveSpeedAI 게시물이 다중 이미지 예시 세트로 Wan 2.7 Image 출력을 보여 주어 생성 범위를 확인하는 데 유용합니다.' },
      { title: 'fal의 Wan 2.7 Image', body: 'fal 관련 게시물이 복잡한 도시 장면에서 Wan 2.7 Image를 테스트하고 사실적인 얼굴, 색상 추출, 다국어 텍스트, 시각 편집을 언급합니다.' },
      { title: 'Wan2.7 크리에이터 웨비나', body: '공식 Wan 계정이 차세대 워크플로와 AI 에이전트 지원 창작을 다루는 Wan2.7 크리에이터 웨비나를 홍보합니다.' },
    ] },
    related: { links: [
      { text: 'GPT Image 2로 텍스트가 많은 비주얼, 편집, UI 스타일 구성, 깔끔한 레이아웃 제어를 사용할 수 있습니다.' },
      { text: 'Seedream 4.5로 제품 비주얼, 포스터, 타이포그래피가 많은 레이아웃, 참조 기반 편집을 시도하세요.' },
      { text: 'Nano Banana Pro로 고해상도 이미지 에셋과 참조 기반 비주얼 초안을 만드세요.' },
      { text: 'Nano Banana 2로 빠른 일상 이미지 생성과 간단한 시각 변형을 만드세요.' },
      { text: 'Toolaze 이미지 및 비디오 모델 페이지를 살펴보고 더 넓게 비교하세요.' },
    ] },
    faq: { items: [
      { q: 'Wan 2.7 Image는 Toolaze에서 무료로 사용할 수 있나요?', a: '예. Toolaze에서 Wan 2.7 Image를 무료로 테스트할 수 있습니다. 사용량은 할당량, 선택한 품질 설정, 모델 가용성 또는 속도 제한에 따라 달라질 수 있습니다.' },
      { q: 'Wan 2.7 Image는 이미지 편집을 지원하나요?', a: '예. Wan 2.7 Image는 업로드한 참조를 사용하는 프롬프트 기반 이미지 편집을 지원하며, 프롬프트로 무엇을 유지하고 바꿀지 지정할 수 있습니다.' },
      { q: 'Wan 2.7 Image는 몇 장의 참조 이미지를 사용할 수 있나요?', a: 'Wan 2.7 Image는 다중 참조 워크플로에서 최대 9장의 입력 이미지를 지원합니다. 각 참조의 역할을 프롬프트에 명확히 지정하세요.' },
      { q: 'Wan 2.7 Image는 4K 출력을 지원하나요?', a: '표준 워크플로는 1K와 2K를 지원합니다. Pro 텍스트-이미지 경로는 입력 이미지를 사용하지 않을 때 4K를 지원합니다. 참조 기반 편집은 1K 또는 2K를 사용해야 합니다.' },
      { q: 'Wan 2.7 Image에 가장 잘 맞는 프롬프트는 무엇인가요?', a: '에셋 유형, 주제, 정확한 표시 텍스트, 레이아웃, 참조, 조명, 배경, 비율, 유지해야 할 요소를 설명하는 구조화 프롬프트가 좋습니다.' },
    ] },
  },
  it: {
    features: { items: [
      { title: 'Thinking Mode per prompt complessi', paragraphs: ['Wan 2.7 Image supporta Thinking Mode negli scenari text-to-image idonei. Aiuta il modello a interpretare prompt lunghi, regole di layout, relazioni tra oggetti e vincoli visivi prima di produrre l\'immagine.', 'Usalo per poster, grafiche educative, concept di campagna e prompt che descrivono più soggetti, testo esatto, sistema di sfondo e requisiti compositivi.'] },
      { title: 'Testo leggibile e design strutturati', paragraphs: ['Wan 2.7 Image è una scelta pratica per grafiche basate su titolo, etichette, menu, social card, poster evento e semplici infografiche che dipendono da testo leggibile e layout chiaro.', 'Controlla sempre il testo generato prima della pubblicazione, soprattutto per note legali piccole, indirizzi, prezzi o copy critico per il brand.'] },
      { title: 'Generazione e modifica tramite prompt', paragraphs: ['Wan 2.7 Image crea nuove immagini da prompt e modifica immagini esistenti con istruzioni in linguaggio naturale. Puoi caricare un riferimento e descrivere cosa cambiare mantenendo soggetto, layout o direzione visiva.', 'Usalo per modifiche prodotto, cambi di sfondo, versioni localizzate, pulizia della composizione e varianti da un visual esistente.'] },
      { title: 'Fusione multi-riferimento', paragraphs: ['Wan 2.7 Image supporta fino a 9 immagini in input per generazione e modifica guidate da riferimento. Puoi combinare foto prodotto, riferimento stile, direzione sfondo, scheda personaggio, logo o campione materiale in un prompt.', 'Per risultati migliori, indica cosa controlla ogni riferimento, come identità, stile, composizione, sfondo, packaging o palette colore.'] },
      { title: 'Opzioni di output 2K e 4K', paragraphs: ['La modalità standard di Wan 2.7 Image supporta 1K e 2K per generazione e modifica. Il percorso Pro text-to-image supporta 4K quando non viene usata un\'immagine di riferimento.', 'Usa 2K per modifiche con riferimento e bozze rapide. Scegli 4K per poster, tavole prodotto dettagliate o concept grandi quando la modalità selezionata lo supporta.'] },
      { title: 'Set di immagini coerenti', paragraphs: ['Wan 2.7 Image aiuta a pianificare visual correlati come frame storyboard, varianti catalogo, concept per libri illustrati, visual slide e campagne multi-card.', 'Su Toolaze, dai nomi chiari nel prompt a ogni frame, angolo o variante, così ogni richiesta ha un ruolo definito.'] },
    ] },
    gallery: { examples: [
      { title: 'Visual pubblicitario prodotto', text: 'Crea immagini commerciali pulite con prodotto principale, headline leggibile, benefit e luce studio controllata.' },
      { title: 'Layout poster evento', text: 'Genera poster con gerarchia del titolo, data, sede, blocchi speaker e ritmo visivo.' },
      { title: 'Concept packaging', text: 'Testa sistemi di etichette, materiali, colori brand, superfici prodotto e idee di presentazione retail.' },
      { title: 'Infografica educativa', text: 'Crea grafiche didattiche con icone, passaggi numerati, etichette brevi e gerarchia pulita.' },
      { title: 'Modifica personaggio da riferimento', text: 'Usa riferimenti per mantenere coerente un soggetto o personaggio cambiando posa, outfit o scena.' },
      { title: 'Revisione interior design', text: 'Trasforma una stanza di riferimento in un altro stile mantenendo layout e angolo camera.' },
      { title: 'Frame storyboard', text: 'Pianifica frame campagna, momenti di scena, thumbnail e visual narrativi con direzione coerente.' },
      { title: 'Brand visual board', text: 'Combina tipografia, palette, immagini prodotto e note campagna in una board concettuale strutturata.' },
    ] },
    comparison: { rows: [
      { capability: 'Risoluzione massima output', wan: 'Pro: 4K per text-to-image; input/modifica immagine: 2K. Standard: 2K', gpt: 'Fino a lato 3840px e 8.29MP, incluso 3840x2160', seedream: 'La pagina ufficiale Seed non indica un massimo pubblico', nano: '1K, 2K, 4K Preview' },
      { capability: 'Immagini di riferimento', wan: '0 a 9 immagini in input', gpt: 'Fino a 16 immagini nei flussi di modifica GPT image', seedream: 'Editing multi-immagine; massimo ufficiale non indicato', nano: 'Massimo 14 immagini per prompt' },
      { capability: 'Modifica immagini', wan: 'Supportata con prompt, immagine input e box opzionali', gpt: 'Supportata tramite edit immagine e immagini di riferimento', seedream: 'Supportata; la pagina ufficiale evidenzia preservazione dei dettagli', nano: 'Supportata, incluso editing multi-turno' },
      { capability: 'Rapporto e dimensione', wan: 'Rapporto personalizzato da 1:8 a 8:1 entro i limiti pixel', gpt: 'Dimensione personalizzata; rapporto fino a 3:1; lati multipli di 16', seedream: 'La pagina ufficiale mostra design multi-formato; limiti API esatti non indicati', nano: '1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9' },
      { capability: 'Punto forte ufficiale', wan: 'Thinking Mode, set immagini, controllo palette, input multi-riferimento', gpt: 'Dimensioni flessibili ad alta risoluzione, input ad alta fedeltà, modifica immagini', seedream: 'Coerenza riferimento, tipografia, testo denso, editing multi-immagine', nano: 'Reasoning, Search grounding, C2PA, editing complesso multi-turno' },
    ] },
    howTo: { steps: ['Apri il generatore Wan 2.7 Image e scegli text-to-image o image-to-image.', 'Scrivi un prompt con tipo di asset, soggetto, testo visibile, layout, rapporto, illuminazione e stile.', 'Carica riferimenti quando vuoi preservare soggetto, prodotto, stanza, logo o direzione visiva.', 'Seleziona risoluzione e rapporto, genera l\'immagine, poi scarica o affina il prompt.'] },
    prompts: { examples: [
      { title: 'Poster lancio prodotto', prompt: 'Crea un poster verticale di lancio per una bevanda premium frizzante allo yuzu. Includi headline leggibile "Yuzu Spark", sottotitolo "bright citrus, zero sugar", una lattina hero con condensa, fette di yuzu, sfondo bianco e giallo agrume, piccoli benefit e luce commerciale curata.' },
      { title: 'Poster evento con testo denso', prompt: 'Crea un poster moderno per "Future Design Week 2026". Includi blocchi agenda leggibili per tre sessioni, nomi speaker, data, venue, nota ticket e un sistema visivo astratto forte. Usa gerarchia chiara, spazio generoso e stile editoriale.' },
      { title: 'Fusione stile multi-riferimento', prompt: 'Usa l\'immagine prodotto caricata come riferimento esatto, la seconda immagine come riferimento luce e la terza come riferimento palette. Crea un visual campagna che mantenga invariata la forma del prodotto applicando luce e colori dei riferimenti.' },
      { title: 'Modifica personaggio da riferimento', prompt: 'Usa il riferimento personaggio caricato. Mantieni stesso volto, acconciatura, proporzioni corporee e identità outfit. Cambia la scena in una strada neon piovosa di notte, aggiungi pavimento riflettente, rim light cinematografica e posa calma e sicura. Non cambiare identità del personaggio.' },
      { title: 'Infografica educativa', prompt: 'Crea un\'infografica pulita che spieghi come un pannello solare converte la luce in elettricità. Usa quattro passaggi numerati, etichette brevi e leggibili, icone semplici, palette blu e gialla, sfondo bianco e gerarchia chiara per uso in classe.' },
      { title: 'Modifica interior design', prompt: 'Usa la foto del soggiorno caricata come riferimento. Mantieni angolo camera, finestre, pareti e posizioni mobili. Ridisegna la stanza in stile Japandi calmo con rovere, texture lino, luce indiretta calda, pareti neutre e finitura ordinata da rivista.' },
    ] },
    youtube: { examples: [
      { title: 'Test controllo colore Wan 2.7 Image', text: 'Un walkthrough mirato su controllo colore, gestione palette e comportamento del modello in test pratici.' },
      { title: 'Guida completa e test Wan 2.7 Image', text: 'Un test più lungo su qualità, risposta ai prompt, modalità di generazione e output visivo con vari esempi.' },
      { title: 'Test completo Wan 2.7 Image', text: 'Un test creator su qualità output, comportamento con riferimenti e posizione rispetto ad altri strumenti immagine.' },
    ] },
    reddit: { items: [
      { title: 'I modelli Wan 2.7 e Wan 2.7 Pro sono disponibili', text: 'Un thread r/budgetpixel annuncia la disponibilità di Wan 2.7 e Wan 2.7 Pro, con le anteprime Reddit originali unite in una card.' },
      { title: 'Wan 2.7 Image è uscito. Qualcuno lo ha testato?', text: 'Un thread domanda su r/AtlasCloudAI utile per leggere primi test e reazioni pratiche oltre alle note ufficiali.' },
      { title: 'Wan 2.7 Image è appena uscito', text: 'Discussione di lancio su r/ArtificialInteligence su Wan 2.7 Image e aspettative per il prossimo modello video Wan.' },
      { title: 'Alibaba lancia Wan 2.7 Image per visual più nitidi', text: 'Post r/aicuriosity sulla release di Wan 2.7 Image e sul suo posizionamento come modello immagine più recente.' },
    ] },
    x: { items: [
      { title: 'Annuncio ufficiale Wan2.7-Image', body: 'L\'account ufficiale Wan presenta Wan2.7-Image come modello unificato per generazione, editing, testo, colore e set immagini.' },
      { title: 'Test creator con volti di riferimento', body: 'Un test in giapponese nota il comportamento naturale con volti di riferimento e confronta il dettaglio con altri modelli.' },
      { title: 'Riepilogo modalità Wan 2.7', body: 'Un post pubblico su X riassume text-to-image, image edit, Pro text-to-image e modalità Pro edit di Wan 2.7.' },
      { title: 'Wan 2.7 Image su Poe', body: 'Poe annuncia Wan 2.7 Image e mette in evidenza set coesi, personaggi consistenti, stile, contesto e editing con box.' },
      { title: 'Valutazione iniziale di un creator', body: 'Un creator condivide test iniziali e confronta la possibile posizione rispetto a Nano Banana e modelli tipo Seedream.' },
      { title: 'Riepilogo funzioni di Alisa Qian', body: 'Breve sintesi su controllo facciale, controllo colore tramite palette, testo multilingue ed editing interattivo.' },
      { title: 'Wan2.7-Image su Design Arena', body: 'Design Arena annuncia disponibilità con note su dettaglio, allineamento al prompt, controllo stilistico e varianti modello.' },
      { title: 'Set output WaveSpeed', body: 'Un post WaveSpeedAI mostra output Wan 2.7 Image in un set multi-immagine, utile per valutare la gamma di generazione.' },
      { title: 'Wan 2.7 Image su fal', body: 'Un post legato a fal testa una scena urbana complessa e cita volti realistici, estrazione colore, testo multilingue ed editing visuale.' },
      { title: 'Webinar creator Wan2.7', body: 'L\'account ufficiale Wan promuove un webinar sui workflow di nuova generazione e la creatività assistita da agenti IA.' },
    ] },
    related: { links: [
      { text: 'Usa GPT Image 2 per visual ricchi di testo, editing, composizioni stile UI e controllo layout pulito.' },
      { text: 'Prova Seedream 4.5 per visual prodotto, poster, layout ricchi di tipografia ed editing guidato da riferimenti.' },
      { text: 'Crea asset ad alta risoluzione e bozze visuali guidate da riferimento con Nano Banana Pro.' },
      { text: 'Usa Nano Banana 2 per generazione rapida quotidiana e variazioni visuali semplici.' },
      { text: 'Sfoglia le pagine modello immagine e video di Toolaze per un confronto più ampio.' },
    ] },
    faq: { items: [
      { q: 'Wan 2.7 Image è gratuito su Toolaze?', a: 'Sì. Puoi provare Wan 2.7 Image gratis su Toolaze. L\'uso può variare in base a quota, impostazioni qualità, disponibilità modello o limiti di frequenza.' },
      { q: 'Wan 2.7 Image supporta editing immagini?', a: 'Sì. Wan 2.7 Image supporta editing basato su prompt con riferimenti caricati, inclusi flussi in cui il prompt descrive cosa preservare e cosa cambiare.' },
      { q: 'Quante immagini di riferimento può usare Wan 2.7 Image?', a: 'Wan 2.7 Image supporta fino a 9 immagini input nei flussi multi-riferimento. Assegna un ruolo chiaro a ogni riferimento nel prompt.' },
      { q: 'Wan 2.7 Image supporta output 4K?', a: 'Il flusso standard supporta 1K e 2K. Il percorso Pro text-to-image supporta 4K quando non viene usata immagine input. L\'editing basato su riferimento deve usare 1K o 2K.' },
      { q: 'Quali prompt funzionano meglio con Wan 2.7 Image?', a: 'Usa prompt strutturati che descrivono tipo di asset, soggetto, testo visibile esatto, layout, riferimenti, luce, sfondo, rapporto e cosa deve restare invariato.' },
    ] },
  },
}

const copies: Record<Wan27ImageLocale, Wan27ImageLandingCopy> = {
  en,
  de: mergeCopy(en, mergeCopy(localizedOverrides.de, localizedNestedOverrides.de)),
  ja: mergeCopy(en, mergeCopy(localizedOverrides.ja, localizedNestedOverrides.ja)),
  es: mergeCopy(en, mergeCopy(localizedOverrides.es, localizedNestedOverrides.es)),
  'zh-TW': mergeCopy(en, mergeCopy(localizedOverrides['zh-TW'], localizedNestedOverrides['zh-TW'])),
  pt: mergeCopy(en, mergeCopy(localizedOverrides.pt, localizedNestedOverrides.pt)),
  fr: mergeCopy(en, mergeCopy(localizedOverrides.fr, localizedNestedOverrides.fr)),
  ko: mergeCopy(en, mergeCopy(localizedOverrides.ko, localizedNestedOverrides.ko)),
  it: mergeCopy(en, mergeCopy(localizedOverrides.it, localizedNestedOverrides.it)),
}

function normalizeLocale(locale: string): Wan27ImageLocale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return WAN_2_7_IMAGE_LOCALES.includes(locale as Wan27ImageLocale) ? (locale as Wan27ImageLocale) : 'en'
}

export function getWan27ImageLandingCopy(locale: string): Wan27ImageLandingCopy {
  return copies[normalizeLocale(locale)]
}

export function getWan27ImagePageMetadata(
  locale: string,
  canonicalUrl = 'https://toolaze.com/model/wan-2-7-image',
): Metadata {
  const copy = getWan27ImageLandingCopy(locale)

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
