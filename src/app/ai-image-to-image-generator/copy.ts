import type { AiImageGeneratorPageCopy } from '@/app/ai-image-generator/copy'

export const AI_IMAGE_TO_IMAGE_GENERATOR_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type AiImageToImageGeneratorLocale = (typeof AI_IMAGE_TO_IMAGE_GENERATOR_LOCALES)[number]

type PageCopyOverride = DeepPageCopyOverride

type DeepPageCopyOverride = {
  [P in keyof AiImageGeneratorPageCopy]?: AiImageGeneratorPageCopy[P] extends Array<infer U>
    ? Array<Partial<U>>
    : AiImageGeneratorPageCopy[P] extends object
      ? DeepPageCopyOverrideFor<AiImageGeneratorPageCopy[P]>
      : AiImageGeneratorPageCopy[P]
}

type DeepPageCopyOverrideFor<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<Partial<U>>
    : T[P] extends object
      ? DeepPageCopyOverrideFor<T[P]>
      : T[P]
}

const en: AiImageGeneratorPageCopy = {
  metadata: {
    title: 'AI Image to Image Generator Free Online | Toolaze',
    description:
      'Upload a reference image and describe the changes you want. Create AI image variations, product shots, portraits, style transfers, backgrounds, and creative edits online with Toolaze.',
  },
  breadcrumbs: {
    home: 'Home',
    aiTools: 'AI Tools',
    current: 'AI Image to Image Generator',
  },
  hero: {
    highlight: 'AI Image to Image Generator',
    description:
      'Upload a reference image, describe the edit you want, and generate a new visual from it. Use Toolaze to create image variations, product photos, portrait restyles, background changes, social graphics, concept art, and polished creative drafts from an existing image.',
    badges: ['Reference Image', 'Prompt-Guided Edits', 'Style Transfer', 'Background Swap'],
  },
  samples: [
    {
      url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/reference-guided-product-edit.webp',
      title: 'Reference-guided product edit sample',
      width: 1024,
      height: 1024,
    },
    {
      url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/seasonal-product-ad.webp',
      title: 'Ecommerce product variation sample',
      width: 1024,
      height: 1024,
    },
    {
      url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/portrait-restyle-before-after.webp',
      title: 'Portrait restyle sample',
      width: 1024,
      height: 1024,
    },
    {
      url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/social-media-poster.webp',
      title: 'Commercial image variation sample',
      width: 1280,
      height: 960,
    },
  ],
  whatIs: {
    title: 'What Is an AI Image to Image Generator?',
    paragraphs: [
      'An AI image to image generator creates a new image from an existing reference image. Instead of starting from text alone, it uses your uploaded image to guide the subject, composition, pose, product shape, room layout, or visual direction.',
      'Your prompt controls what changes, such as the style, background, lighting, colors, scene, or final use case. This makes image-to-image generation useful when you want a fresh result while keeping important parts of the source image recognizable.',
    ],
  },
  promise: {
    title: 'Create New Images From a Reference',
    text:
      'Start with a real image and guide the result with plain language. Keep the important parts recognizable while changing the visual direction.',
    cards: [
      {
        title: 'Preserve the Main Subject',
        text: 'Keep a product, person, object, room, logo placement, or composition recognizable while generating a cleaner or more creative version.',
      },
      {
        title: 'Change Style With a Prompt',
        text: 'Transform a photo into a cinematic scene, studio product image, anime portrait, illustration, editorial poster, 3D render, or social media visual.',
      },
      {
        title: 'Replace Backgrounds',
        text: 'Move a subject into a new setting, create a studio backdrop, test seasonal scenes, remove visual clutter, or build ecommerce-ready images.',
      },
      {
        title: 'Create Image Variations',
        text: 'Generate multiple directions from one reference image to compare layouts, lighting, colors, camera angles, and creative treatments.',
      },
    ],
  },
  features: {
    title: 'Edit Images From a Reference and Prompt',
    text:
      'Use image-to-image generation when you need a controlled result from an existing visual. Upload a reference, describe what should stay the same, then guide the model toward a new style, background, product setup, or creative direction.',
    items: [
      {
        title: 'Reference-Guided Editing',
        text: 'Keep the main subject, product, pose, layout, or composition recognizable while changing the final image with plain-language instructions.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/reference-guided-product-edit.webp',
        alt: 'AI image to image reference-guided editing example',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Product Photo Variations',
        text: 'Turn one product reference into studio shots, ecommerce images, lifestyle scenes, seasonal concepts, and campaign-ready product visuals.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/seasonal-product-ad.webp',
        alt: 'AI image to image product photo variation example',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Background Replacement',
        text: 'Replace the original background with a cleaner scene, branded setup, indoor room, outdoor location, studio backdrop, or social media composition.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/background-replacement-before-after.webp',
        alt: 'AI image to image before and after background replacement example',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Style Transfer and Restyle',
        text: 'Restyle a photo as an editorial portrait, anime avatar, watercolor illustration, 3D render, sticker, poster, or cinematic concept.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/portrait-restyle-before-after.webp',
        alt: 'AI image to image before and after style transfer example',
        width: 1024,
        height: 1024,
      },
    ],
  },
  gallery: {
    title: 'Image to Image Examples',
    text:
      'Explore practical results you can create from a reference image and a focused prompt.',
    examples: [
      {
        title: 'Studio Product Shot',
        text: 'Keep the same product shape and label placement while creating a clean studio background with soft shadows.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/reference-guided-product-edit.webp',
        alt: 'AI image to image product photo with clean studio background',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Seasonal Product Ad',
        text: 'Keep the product unchanged and place it in a warm holiday campaign scene with premium retail styling.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/seasonal-product-ad.webp',
        alt: 'AI image variation of a product in a seasonal ad scene',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Portrait to Editorial',
        text: 'Restyle a portrait as an editorial fashion image with dramatic lighting and a clean backdrop.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/portrait-restyle-before-after.webp',
        alt: 'AI portrait restyle before and after example',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Room Redesign',
        text: 'Keep the room layout and camera angle while testing new furniture, materials, and lighting direction.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/interior-redesign-before-after.webp',
        alt: 'AI interior redesign before and after example',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Background Replacement',
        text: 'Keep the subject and pose unchanged while replacing the original scene with a polished new background.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/background-replacement-before-after.webp',
        alt: 'AI portrait background replacement before and after example',
        width: 1024,
        height: 1024,
      },
      {
        title: '3D Product Render',
        text: 'Convert a product reference into a high-quality render with glossy materials and soft studio reflections.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/three-d-product-render.webp',
        alt: 'AI 3D product render from an uploaded product image',
        width: 1280,
        height: 960,
      },
      {
        title: 'Social Media Poster',
        text: 'Use the reference subject as the visual anchor for a bold vertical poster or campaign graphic.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/social-media-poster.webp',
        alt: 'AI social media poster generated from a reference image',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Concept Art Variation',
        text: 'Turn a rough visual direction into a more polished scene, environment, or creative moodboard.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/concept-art-variation.webp',
        alt: 'AI concept art variation generated from a reference image',
        width: 800,
        height: 600,
      },
    ],
  },
  models: {
    title: 'Use the Right Model for Image to Image',
    description:
      'Choose a model by the job: product edits, portraits, style transfer, composition control, prompt following, or polished campaign output.',
    cards: [
      {
        title: 'GPT Image 2',
        text: 'Best for structured image-to-image edits, product visuals, readable layouts, poster concepts, and commercial creative drafts.',
        href: '/model/gpt-image-2',
        label: 'Try GPT Image 2',
        imageId: 'gpt-image-2',
      },
      {
        title: 'Nano Banana Pro',
        text: 'Best for polished image variations, portraits, product shots, creative restyles, and high-quality reference-based outputs.',
        href: '/model/nano-banana-pro',
        label: 'Try Nano Banana Pro',
        imageId: 'nano-banana-pro',
      },
      {
        title: 'Seedream 4.5',
        text: 'Best for commercial product visuals, brand-style compositions, typography-led layouts, and consistent reference editing.',
        href: '/model/seedream-4-5',
        label: 'Try Seedream 4.5',
        imageId: 'seedream-4-5',
      },
    ],
    comparisonTitle: 'Image to Image Model Guide',
    headers: {
      model: 'Model',
      bestFor: 'Best for',
      output: 'Output',
      references: 'Reference images',
      textAndEditing: 'Text and editing',
      watchouts: 'Watchouts',
    },
    rows: [
      {
        model: 'GPT Image 2',
        bestFor: 'Product edits, posters, layout-aware image variations, commercial drafts.',
        output: 'Supports multiple output sizes through Toolaze model settings.',
        references: 'Useful when the uploaded image should guide the main subject or layout.',
        textAndEditing: 'Strong for prompt-guided edits, short text, and structured compositions.',
        watchouts: 'Review spelling, faces, hands, logos, and product details before publishing.',
      },
      {
        model: 'Nano Banana Pro',
        bestFor: 'Portrait restyles, polished creative variations, product shots, campaign visuals.',
        output: 'Useful for high-quality image drafts and refined visual directions.',
        references: 'Strong for keeping visual identity while exploring new treatments.',
        textAndEditing: 'Good for complex prompts and creative image variations.',
        watchouts: 'Use clearer preservation instructions when the subject changes too much.',
      },
      {
        model: 'Seedream 4.5',
        bestFor: 'Commercial product scenes, brand visuals, ecommerce concepts, typography-led images.',
        output: 'Useful for polished product and marketing workflows.',
        references: 'Good fit for brand-style references and product-driven edits.',
        textAndEditing: 'Strong prompt adherence for commercial-looking image drafts.',
        watchouts: 'Best results come from specific prompts with a clear final use case.',
      },
    ],
  },
  modes: {
    title: 'Image to Image vs Text to Image',
    description:
      'Choose the right workflow based on how much control you need from an existing visual.',
    headers: {
      label: 'Workflow',
      aiImageGenerator: 'Best for',
      textToImage: 'Input',
      imageToImage: 'Output',
    },
    rows: [
      {
        label: 'AI Image to Image Generator',
        aiImageGenerator: 'Creating controlled variations from an existing image',
        textToImage: 'Reference image plus prompt',
        imageToImage: 'A new image guided by the uploaded reference',
      },
      {
        label: 'Text to Image Generator',
        aiImageGenerator: 'Creating a new visual from scratch',
        textToImage: 'Prompt only',
        imageToImage: 'A generated image based on the text description',
      },
      {
        label: 'AI Photo Editor',
        aiImageGenerator: 'Making targeted corrections or simple edits',
        textToImage: 'Existing photo and edit instructions',
        imageToImage: 'An edited version of the original image',
      },
    ],
  },
  prompts: {
    title: 'Image to Image Prompt Templates',
    text:
      'Good prompts tell the model what to keep, what to change, and how the final image should feel.',
    copyButton: 'Copy prompt',
    copiedButton: 'Copied',
    examples: [
      {
        title: 'Product Photo Template',
        prompt:
          'Keep the same product shape, color, logo placement, and key details. Replace the background with a clean studio scene. Use soft shadows, premium ecommerce lighting, and a polished product photography look.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/reference-guided-product-edit.webp',
        alt: 'Product image to image prompt example',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Portrait Restyle Template',
        prompt:
          'Keep the same person, face structure, pose, and expression. Restyle the image as an editorial portrait with a clean background, dramatic side lighting, natural skin tones, and high-end magazine color grading.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/portrait-restyle-before-after.webp',
        alt: 'Portrait image to image before and after prompt example',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Interior Design Template',
        prompt:
          'Keep the same room layout, windows, and camera angle. Redesign the space with modern Japandi furniture, warm wood textures, neutral fabrics, indoor plants, and soft natural light.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/interior-redesign-before-after.webp',
        alt: 'Interior image to image before and after prompt example',
        width: 1024,
        height: 1024,
      },
      {
        title: 'Creative Variation Template',
        prompt:
          'Use the uploaded image as the main reference. Create a new version for a social media campaign with bold composition, modern colors, clean spacing for headline text, and a polished commercial look.',
        image: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-image-to-image-generator/social-media-poster.webp',
        alt: 'Creative image to image prompt example',
        width: 1024,
        height: 1024,
      },
    ],
  },
  howTo: {
    schemaName: 'How to Use Toolaze AI Image to Image Generator',
    title: 'How to Use the AI Image to Image Generator',
    description:
      'Upload a reference image, describe what should change, then refine the result with clearer preservation and style instructions.',
    stepLabel: 'Step',
    steps: [
      {
        title: 'Upload a Reference Image',
        text: 'Choose the image you want to transform. The reference helps guide the subject, composition, pose, product shape, or visual direction.',
      },
      {
        title: 'Describe the Edit',
        text: 'Write a clear prompt that explains what should change and what should stay the same. Add style, background, lighting, and use case details.',
      },
      {
        title: 'Choose Settings',
        text: 'Select the model, aspect ratio, and quality settings that best fit your image variation or creative workflow.',
      },
      {
        title: 'Generate the Image',
        text: 'Create your new image and compare it against the original reference to check subject stability, style, and composition.',
      },
      {
        title: 'Refine and Download',
        text: 'Adjust your prompt if you want a closer match, stronger style, cleaner background, or more polished final output.',
      },
    ],
  },
  useCases: {
    title: 'Popular Image to Image Ideas',
    description:
      'Use image-to-image generation when you already have a visual starting point and want a new version without rebuilding the image from scratch.',
    cards: [
      {
        title: 'Product Photo Upgrade',
        text: 'Turn a basic product image into a clean studio shot, seasonal ad visual, ecommerce listing image, or premium campaign concept.',
      },
      {
        title: 'Portrait Restyle',
        text: 'Restyle a portrait with new lighting, fashion direction, background, illustration style, avatar look, or profile image concept.',
      },
      {
        title: 'Background Swap',
        text: 'Keep the subject and replace the scene with a studio backdrop, outdoor location, branded setup, room interior, or campaign environment.',
      },
      {
        title: 'Interior Redesign',
        text: 'Upload a room photo and test new furniture, color palettes, lighting, materials, wall art, or decor directions.',
      },
      {
        title: 'Style Transfer',
        text: 'Convert a reference image into anime, watercolor, 3D render, editorial photography, cinematic, sketch, sticker, or poster style.',
      },
      {
        title: 'Marketing Creative',
        text: 'Create visual directions for paid ads, landing page heroes, social posts, thumbnails, launch graphics, and product announcements.',
      },
    ],
  },
  related: {
    title: 'Related AI Image Tools',
    description:
      'Continue your workflow with tools for image generation, editing, enhancement, and prompt discovery.',
    cards: [
      {
        title: 'AI Image Generator',
        href: '/ai-image-generator',
        label: 'Generate from Text',
        text: 'Start from a text prompt when you do not have a reference image.',
      },
      {
        title: 'GPT Image 2 Generator',
        href: '/model/gpt-image-2',
        label: 'Try GPT Image 2',
        text: 'Create high-quality image generations and reference-guided edits with Toolaze’s GPT image workflow.',
      },
      {
        title: 'Background Remover',
        href: '/watermark-remover',
        label: 'Remove Background',
        text: 'Remove visual clutter before creating a new product shot, profile image, or design asset.',
      },
      {
        title: 'Image Enhancer',
        href: '/photo-restoration',
        label: 'Enhance Image',
        text: 'Improve clarity, detail, and polish after generating or editing an image.',
      },
      {
        title: 'Nano Banana Pro',
        href: '/model/nano-banana-pro',
        label: 'Try Nano Banana Pro',
        text: 'Explore another high-quality image model for creative variations and visual experiments.',
      },
      {
        title: 'Seedream 4.5',
        href: '/model/seedream-4-5',
        label: 'Try Seedream 4.5',
        text: 'Create commercial product visuals, typography-led designs, and reference-based marketing drafts.',
      },
    ],
  },
  faq: {
    title: 'AI Image to Image Generator FAQ',
    description:
      'Answers to common questions about reference images, prompts, formats, free usage, and practical image-to-image workflows.',
    items: [
      {
        q: 'What is an AI image to image generator?',
        a: 'An AI image to image generator creates a new image from an uploaded reference image and a text prompt. The reference image guides the subject, composition, pose, or visual structure, while the prompt controls the style, background, lighting, and edits.',
      },
      {
        q: 'How is image-to-image different from text-to-image?',
        a: 'Text-to-image starts from a prompt only. Image-to-image starts from a reference image, so it is better when you want to keep a product, person, layout, object, or composition recognizable while changing the final look.',
      },
      {
        q: 'Can I use the AI image to image generator for free?',
        a: 'Free usage may vary by quota, selected model, and quality settings. Check the generator controls for current availability before starting a new image.',
      },
      {
        q: 'What image formats can I upload?',
        a: 'Toolaze image tools commonly support standard web image formats such as JPG, PNG, and WEBP. Use a clear source image with good lighting for better results.',
      },
      {
        q: 'How do I keep the same person or product?',
        a: 'Tell the generator exactly what should stay the same. For example: “Keep the same face, pose, hairstyle, and expression,” or “Keep the same product shape, label position, and color.”',
      },
      {
        q: 'Can I change only the background?',
        a: 'Yes. Upload your image and write a prompt that says what subject should stay unchanged and what background should replace the original scene.',
      },
      {
        q: 'Can I turn a photo into anime, cartoon, or illustration style?',
        a: 'Yes. Upload the photo and describe the style you want, such as anime avatar, storybook illustration, watercolor, 3D render, sticker, poster, or cinematic concept art.',
      },
      {
        q: 'Is image-to-image useful for product photos?',
        a: 'Yes. It is useful for product background changes, studio-style ecommerce shots, seasonal campaign concepts, ad visuals, mockups, and creative variations from the same product reference.',
      },
      {
        q: 'Why did the result change too much?',
        a: 'The prompt may not clearly explain what should stay the same. Add preservation instructions such as “keep the same pose,” “keep the product unchanged,” or “keep the room layout and camera angle.”',
      },
      {
        q: 'What makes a good image-to-image prompt?',
        a: 'A good prompt includes three parts: what to keep, what to change, and how the final image should look. Add details about style, lighting, background, colors, camera angle, and use case.',
      },
      {
        q: 'Can I use generated images commercially?',
        a: 'Commercial use depends on the source image, your rights to the uploaded content, the selected model, and your use case. Do not upload images you do not have permission to use, and review final assets before publishing.',
      },
      {
        q: 'What image prompts are a good fit for this tool?',
        a: 'Toolaze is designed for practical creative workflows such as product visuals, portraits, social graphics, design concepts, and marketing drafts. Use safe, rights-cleared images and prompts.',
      },
      {
        q: 'What is the best image to image AI generator?',
        a: 'The best image to image AI generator is the one that keeps important reference details recognizable while giving you control over style, background, lighting, and output format. Toolaze focuses on practical image variations, creative edits, and prompt-guided workflows.',
      },
    ],
  },
  cta: {
    title: 'Create Your Next Image Variation',
    description:
      'Upload a reference image, describe the change, and generate a new visual for products, portraits, interiors, campaigns, social posts, and creative drafts.',
    button: 'Start Generating',
  },
}

const localizedOverrides: Partial<Record<Exclude<AiImageToImageGeneratorLocale, 'en'>, DeepPageCopyOverride>> = {
  de: {
    metadata: {
      title: 'KI-Bild-zu-Bild-Generator kostenlos online | Toolaze',
      description: 'Lade ein Referenzbild hoch und beschreibe die gewünschte Änderung. Erstelle KI-Bildvarianten, Produktfotos, Porträts, Stilübertragungen, Hintergründe und kreative Bearbeitungen direkt im Browser mit Toolaze.',
    },
    breadcrumbs: { home: 'Startseite', aiTools: 'KI-Tools', current: 'KI-Bild-zu-Bild-Generator' },
    hero: {
      highlight: 'KI-Bild-zu-Bild-Generator',
      description: 'Lade ein Referenzbild hoch, beschreibe den gewünschten Edit und generiere daraus ein neues Visual. Nutze Toolaze für Bildvarianten, Produktfotos, Porträt-Restyles, Hintergrundwechsel, Social-Grafiken, Concept Art und ausgearbeitete kreative Entwürfe aus einem bestehenden Bild.',
      badges: ['Referenzbild', 'Prompt-geführte Edits', 'Stilübertragung', 'Hintergrundwechsel'],
    },
    samples: [
      { title: 'Beispiel für referenzgeführten Produkt-Edit' },
      { title: 'Beispiel für E-Commerce-Produktvariante' },
      { title: 'Beispiel für Porträt-Restyle' },
      { title: 'Beispiel für kommerzielle Bildvariante' },
    ],
    whatIs: {
      title: 'Was ist ein KI-Bild-zu-Bild-Generator?',
      paragraphs: [
        'Ein KI-Bild-zu-Bild-Generator erstellt aus einem bestehenden Referenzbild ein neues Bild. Statt nur mit Text zu starten, nutzt er dein hochgeladenes Bild, um Motiv, Komposition, Pose, Produktform, Raumlayout oder visuelle Richtung zu steuern.',
        'Dein Prompt bestimmt, was sich ändert, etwa Stil, Hintergrund, Licht, Farben, Szene oder der finale Einsatzzweck. So eignet sich Image-to-Image, wenn du ein frisches Ergebnis möchtest, aber wichtige Teile des Ausgangsbildes erkennbar bleiben sollen.',
      ],
    },
    promise: {
      title: 'Neue Bilder aus einer Referenz erstellen',
      text: 'Starte mit einem echten Bild und steuere das Ergebnis in natürlicher Sprache. Wichtige Details bleiben erkennbar, während sich die visuelle Richtung ändert.',
      cards: [
        { title: 'Hauptmotiv beibehalten', text: 'Halte ein Produkt, eine Person, ein Objekt, einen Raum, eine Logoposition oder eine Komposition erkennbar, während eine sauberere oder kreativere Version entsteht.' },
        { title: 'Stil per Prompt ändern', text: 'Verwandle ein Foto in eine cineastische Szene, ein Studio-Produktbild, Anime-Porträt, eine Illustration, ein Editorial-Poster, 3D-Rendering oder Social-Media-Visual.' },
        { title: 'Hintergründe ersetzen', text: 'Setze ein Motiv in eine neue Umgebung, erstelle einen Studiohintergrund, teste saisonale Szenen, entferne visuelle Unruhe oder baue E-Commerce-Bilder.' },
        { title: 'Bildvarianten erstellen', text: 'Generiere mehrere Richtungen aus einem Referenzbild, um Layouts, Licht, Farben, Kamerawinkel und kreative Behandlungen zu vergleichen.' },
      ],
    },
    features: {
      title: 'Bilder mit Referenz und Prompt bearbeiten',
      text: 'Nutze Image-to-Image, wenn du ein kontrolliertes Ergebnis aus einem vorhandenen Visual brauchst. Lade eine Referenz hoch, beschreibe, was gleich bleiben soll, und führe das Modell zu neuem Stil, Hintergrund, Produktsetup oder kreativer Richtung.',
      items: [
        { title: 'Referenzgeführtes Bearbeiten', text: 'Halte Hauptmotiv, Produkt, Pose, Layout oder Komposition erkennbar, während du das finale Bild mit einfachen Anweisungen veränderst.', alt: 'Beispiel für referenzgeführte KI-Bild-zu-Bild-Bearbeitung' },
        { title: 'Produktfoto-Varianten', text: 'Verwandle eine Produktreferenz in Studioaufnahmen, E-Commerce-Bilder, Lifestyle-Szenen, saisonale Konzepte und kampagnenfähige Produktvisuals.', alt: 'Beispiel für KI-Bild-zu-Bild-Produktfoto-Variante' },
        { title: 'Hintergrund ersetzen', text: 'Ersetze den Originalhintergrund durch eine sauberere Szene, ein Marken-Setup, einen Innenraum, Außenort, Studiohintergrund oder Social-Media-Komposition.', alt: 'Vorher-Nachher-Beispiel für KI-Bild-zu-Bild-Hintergrundwechsel' },
        { title: 'Stilübertragung und Restyle', text: 'Restyle ein Foto als Editorial-Porträt, Anime-Avatar, Aquarellillustration, 3D-Render, Sticker, Poster oder cineastisches Konzept.', alt: 'Vorher-Nachher-Beispiel für KI-Bild-zu-Bild-Stilübertragung' },
      ],
    },
    gallery: {
      title: 'Bild-zu-Bild-Beispiele',
      text: 'Entdecke praktische Ergebnisse, die du aus einem Referenzbild und einem fokussierten Prompt erstellen kannst.',
      examples: [
        { title: 'Studio-Produktfoto', text: 'Behalte Produktform und Labelposition bei und erstelle einen sauberen Studiohintergrund mit weichen Schatten.', alt: 'KI-Bild-zu-Bild-Produktfoto mit sauberem Studiohintergrund' },
        { title: 'Saisonale Produktanzeige', text: 'Halte das Produkt unverändert und platziere es in einer warmen Feiertagskampagne mit hochwertigem Retail-Styling.', alt: 'KI-Bildvariante eines Produkts in einer saisonalen Werbeszene' },
        { title: 'Porträt zu Editorial', text: 'Restyle ein Porträt als Editorial-Fashion-Bild mit dramatischem Licht und sauberem Hintergrund.', alt: 'Vorher-Nachher-Beispiel für KI-Porträt-Restyle' },
        { title: 'Raum-Redesign', text: 'Behalte Raumlayout und Kamerawinkel bei und teste neue Möbel, Materialien und Lichtstimmungen.', alt: 'Vorher-Nachher-Beispiel für KI-Innenraum-Redesign' },
        { title: 'Hintergrundwechsel', text: 'Behalte Motiv und Pose bei und ersetze die Originalszene durch einen polierten neuen Hintergrund.', alt: 'Vorher-Nachher-Beispiel für KI-Porträt-Hintergrundwechsel' },
        { title: '3D-Produkt-Render', text: 'Konvertiere eine Produktreferenz in ein hochwertiges Rendering mit glänzenden Materialien und weichen Studio-Reflexionen.', alt: 'KI-3D-Produkt-Render aus einem hochgeladenen Produktbild' },
        { title: 'Social-Media-Poster', text: 'Nutze das Referenzmotiv als visuellen Anker für ein starkes vertikales Poster oder Kampagnengrafik.', alt: 'KI-Social-Media-Poster aus einem Referenzbild' },
        { title: 'Concept-Art-Variante', text: 'Verwandle eine grobe visuelle Richtung in eine ausgearbeitete Szene, Umgebung oder kreatives Moodboard.', alt: 'KI-Concept-Art-Variante aus einem Referenzbild' },
      ],
    },
    models: {
      title: 'Das richtige Modell für Image-to-Image wählen',
      description: 'Wähle ein Modell nach Aufgabe: Produkt-Edits, Porträts, Stilübertragung, Kompositionskontrolle, Prompt-Treue oder polierte Kampagnenergebnisse.',
      cards: [
        { title: 'GPT Image 2', text: 'Am besten für strukturierte Image-to-Image-Edits, Produktvisuals, lesbare Layouts, Posterkonzepte und kommerzielle Entwürfe.', label: 'GPT Image 2 testen' },
        { title: 'Nano Banana Pro', text: 'Am besten für polierte Bildvarianten, Porträts, Produktfotos, kreative Restyles und hochwertige referenzbasierte Outputs.', label: 'Nano Banana Pro testen' },
        { title: 'Seedream 4.5', text: 'Am besten für kommerzielle Produktszenen, Markenvisuals, E-Commerce-Konzepte, typografische Layouts und konsistente Referenzbearbeitung.', label: 'Seedream 4.5 testen' },
      ],
      comparisonTitle: 'Modellguide für Image-to-Image',
      headers: { model: 'Modell', bestFor: 'Am besten für', output: 'Ausgabe', references: 'Referenzbilder', textAndEditing: 'Text und Bearbeitung', watchouts: 'Worauf achten' },
      rows: [
        { model: 'GPT Image 2', bestFor: 'Produkt-Edits, Poster, layoutbewusste Bildvarianten, kommerzielle Entwürfe.', output: 'Unterstützt mehrere Ausgabegrößen über Toolaze-Modellsettings.', references: 'Nützlich, wenn das hochgeladene Bild Hauptmotiv oder Layout führen soll.', textAndEditing: 'Stark bei promptgeführten Edits, kurzem Text und strukturierten Kompositionen.', watchouts: 'Prüfe Rechtschreibung, Gesichter, Hände, Logos und Produktdetails vor der Veröffentlichung.' },
        { model: 'Nano Banana Pro', bestFor: 'Porträt-Restyles, polierte kreative Varianten, Produktfotos, Kampagnenvisuals.', output: 'Nützlich für hochwertige Bildentwürfe und verfeinerte visuelle Richtungen.', references: 'Stark darin, visuelle Identität zu halten und neue Treatments zu erkunden.', textAndEditing: 'Gut für komplexe Prompts und kreative Bildvarianten.', watchouts: 'Nutze klarere Erhaltungsanweisungen, wenn sich das Motiv zu stark verändert.' },
        { model: 'Seedream 4.5', bestFor: 'Kommerzielle Produktszenen, Markenvisuals, E-Commerce-Konzepte, typografische Bilder.', output: 'Nützlich für polierte Produkt- und Marketing-Workflows.', references: 'Gut geeignet für Markenstil-Referenzen und produktgetriebene Edits.', textAndEditing: 'Starke Prompt-Treue für kommerziell wirkende Bildentwürfe.', watchouts: 'Beste Ergebnisse entstehen mit konkreten Prompts und klarem Einsatzzweck.' },
      ],
    },
    modes: {
      title: 'Image-to-Image vs. Text-to-Image',
      description: 'Wähle den passenden Ablauf danach, wie viel Kontrolle du aus einem vorhandenen Bild brauchst.',
      headers: { label: 'Ablauf', aiImageGenerator: 'Am besten für', textToImage: 'Eingabe', imageToImage: 'Ausgabe' },
      rows: [
        { label: 'KI-Bild-zu-Bild-Generator', aiImageGenerator: 'Kontrollierte Varianten aus einem bestehenden Bild erstellen', textToImage: 'Referenzbild plus Prompt', imageToImage: 'Ein neues Bild, geführt durch die hochgeladene Referenz' },
        { label: 'Text-zu-Bild-Generator', aiImageGenerator: 'Ein neues Visual von Grund auf erstellen', textToImage: 'Nur Prompt', imageToImage: 'Ein generiertes Bild basierend auf der Textbeschreibung' },
        { label: 'KI-Fotoeditor', aiImageGenerator: 'Gezielte Korrekturen oder einfache Edits erstellen', textToImage: 'Vorhandenes Foto und Bearbeitungsanweisungen', imageToImage: 'Eine bearbeitete Version des Originalbildes' },
      ],
    },
    prompts: {
      title: 'Image-to-Image-Prompt-Vorlagen',
      text: 'Gute Prompts sagen dem Modell, was bleiben, was sich ändern und wie das finale Bild wirken soll.',
      copyButton: 'Prompt kopieren',
      copiedButton: 'Kopiert',
      examples: [
        { title: 'Produktfoto-Vorlage', prompt: 'Behalte dieselbe Produktform, Farbe, Logoposition und die wichtigsten Details bei. Ersetze den Hintergrund durch eine saubere Studioszene. Nutze weiche Schatten, hochwertiges E-Commerce-Licht und einen polierten Produktfoto-Look.', alt: 'Beispiel für Produkt-Image-to-Image-Prompt' },
        { title: 'Porträt-Restyle-Vorlage', prompt: 'Behalte dieselbe Person, Gesichtsstruktur, Pose und Ausdruck bei. Restyle das Bild als Editorial-Porträt mit sauberem Hintergrund, dramatischem Seitenlicht, natürlichen Hauttönen und hochwertigem Magazin-Color-Grading.', alt: 'Vorher-Nachher-Beispiel für Porträt-Image-to-Image-Prompt' },
        { title: 'Interior-Design-Vorlage', prompt: 'Behalte dasselbe Raumlayout, die Fenster und den Kamerawinkel bei. Gestalte den Raum mit modernen Japandi-Möbeln, warmen Holztexturen, neutralen Stoffen, Zimmerpflanzen und weichem Naturlicht neu.', alt: 'Vorher-Nachher-Beispiel für Interior-Image-to-Image-Prompt' },
        { title: 'Kreativvarianten-Vorlage', prompt: 'Nutze das hochgeladene Bild als Hauptreferenz. Erstelle eine neue Version für eine Social-Media-Kampagne mit starker Komposition, modernen Farben, sauberem Platz für Headline-Text und poliertem kommerziellem Look.', alt: 'Beispiel für kreativen Image-to-Image-Prompt' },
      ],
    },
    howTo: {
      schemaName: 'So nutzt du den Toolaze KI-Bild-zu-Bild-Generator',
      title: 'So nutzt du den KI-Bild-zu-Bild-Generator',
      description: 'Lade ein Referenzbild hoch, beschreibe die gewünschte Änderung und verfeinere das Ergebnis mit klareren Erhaltungs- und Stilhinweisen.',
      stepLabel: 'Schritt',
      steps: [
        { title: 'Referenzbild hochladen', text: 'Wähle das Bild, das du transformieren möchtest. Die Referenz hilft, Motiv, Komposition, Pose, Produktform oder visuelle Richtung zu führen.' },
        { title: 'Edit beschreiben', text: 'Schreibe einen klaren Prompt, der erklärt, was sich ändern und was gleich bleiben soll. Ergänze Details zu Stil, Hintergrund, Licht und Einsatzzweck.' },
        { title: 'Einstellungen wählen', text: 'Wähle Modell, Seitenverhältnis und Qualitätseinstellungen, die zu deiner Bildvariante oder deinem kreativen Arbeitsablauf passen.' },
        { title: 'Bild generieren', text: 'Erstelle dein neues Bild und vergleiche es mit der Originalreferenz, um Motivstabilität, Stil und Komposition zu prüfen.' },
        { title: 'Verfeinern und herunterladen', text: 'Passe den Prompt an, wenn du eine nähere Übereinstimmung, stärkeren Stil, saubereren Hintergrund oder ein polierteres Ergebnis möchtest.' },
      ],
    },
    useCases: {
      title: 'Beliebte Image-to-Image-Ideen',
      description: 'Nutze Image-to-Image, wenn du bereits einen visuellen Ausgangspunkt hast und eine neue Version willst, ohne das Bild von Grund auf neu aufzubauen.',
      cards: [
        { title: 'Produktfoto aufwerten', text: 'Verwandle ein einfaches Produktbild in ein sauberes Studiofoto, saisonales Anzeigenvisual, E-Commerce-Listingbild oder Premium-Kampagnenkonzept.' },
        { title: 'Porträt-Restyle', text: 'Restyle ein Porträt mit neuem Licht, Fashion-Richtung, Hintergrund, Illustrationsstil, Avatar-Look oder Profilbildkonzept.' },
        { title: 'Hintergrundwechsel', text: 'Behalte das Motiv und ersetze die Szene durch Studiohintergrund, Außenort, Marken-Setup, Rauminterieur oder Kampagnenumgebung.' },
        { title: 'Interior-Redesign', text: 'Lade ein Raumfoto hoch und teste neue Möbel, Farbpaletten, Licht, Materialien, Wandkunst oder Deko-Richtungen.' },
        { title: 'Stilübertragung', text: 'Konvertiere ein Referenzbild in Anime, Aquarell, 3D-Render, Editorial-Fotografie, Cinematic, Skizze, Sticker oder Poster-Stil.' },
        { title: 'Marketing-Creative', text: 'Erstelle visuelle Richtungen für Paid Ads, Landingpage-Heroes, Social Posts, Thumbnails, Launch-Grafiken und Produktankündigungen.' },
      ],
    },
    related: {
      title: 'Verwandte KI-Bild-Tools',
      description: 'Setze deinen Arbeitsablauf mit Tools für Bildgenerierung, Bearbeitung, Verbesserung und Prompt-Entdeckung fort.',
      cards: [
        { title: 'KI-Bildgenerator', label: 'Aus Text generieren', text: 'Starte mit einem Textprompt, wenn du kein Referenzbild hast.' },
        { title: 'GPT Image 2 Generator auf Deutsch', label: 'GPT Image 2 testen', text: 'Erstelle hochwertige Bildgenerierungen und referenzgeführte Bearbeitungen mit dem GPT-Bild-Ablauf von Toolaze.' },
        { title: 'Hintergrund-Entferner', label: 'Hintergrund entfernen', text: 'Entferne visuelle Unruhe, bevor du ein neues Produktfoto, Profilbild oder Design-Asset erstellst.' },
        { title: 'Bildverbesserer', label: 'Bild verbessern', text: 'Verbessere Klarheit, Details und Politur nach dem Generieren oder Bearbeiten eines Bildes.' },
        { title: 'Nano Banana Pro', label: 'Nano Banana Pro testen', text: 'Erkunde ein weiteres hochwertiges Bildmodell für kreative Varianten und visuelle Experimente.' },
        { title: 'Seedream 4.5', label: 'Seedream 4.5 testen', text: 'Erstelle kommerzielle Produktvisuals, typografische Designs und referenzbasierte Marketingentwürfe.' },
      ],
    },
    faq: {
      title: 'KI-Bild-zu-Bild-Generator FAQ',
      description: 'Antworten auf häufige Fragen zu Referenzbildern, Prompts, Formaten, kostenloser Nutzung und praktischen Image-to-Image-Workflows.',
      items: [
        { q: 'Was ist ein KI-Bild-zu-Bild-Generator?', a: 'Ein KI-Bild-zu-Bild-Generator erstellt aus einem hochgeladenen Referenzbild und einem Textprompt ein neues Bild. Das Referenzbild führt Motiv, Komposition, Pose oder visuelle Struktur, während der Prompt Stil, Hintergrund, Licht und Edits steuert.' },
        { q: 'Wie unterscheidet sich Image-to-Image von Text-to-Image?', a: 'Text-to-Image startet nur mit einem Prompt. Image-to-Image startet mit einem Referenzbild und eignet sich besser, wenn Produkt, Person, Layout, Objekt oder Komposition erkennbar bleiben sollen.' },
        { q: 'Kann ich den KI-Bild-zu-Bild-Generator kostenlos nutzen?', a: 'Kostenlose Nutzung kann je nach Kontingent, gewähltem Modell und Qualitätseinstellungen variieren. Prüfe die Generatorsteuerung auf aktuelle Verfügbarkeit, bevor du ein neues Bild startest.' },
        { q: 'Welche Bildformate kann ich hochladen?', a: 'Toolaze-Bildtools unterstützen übliche Webformate wie JPG, PNG und WEBP. Nutze ein klares Ausgangsbild mit gutem Licht für bessere Ergebnisse.' },
        { q: 'Wie behalte ich dieselbe Person oder dasselbe Produkt bei?', a: 'Sage dem Generator genau, was gleich bleiben soll. Zum Beispiel: „Behalte dasselbe Gesicht, dieselbe Pose, Frisur und denselben Ausdruck bei“ oder „Behalte Produktform, Labelposition und Farbe bei“.' },
        { q: 'Kann ich nur den Hintergrund ändern?', a: 'Ja. Lade dein Bild hoch und schreibe einen Prompt, der erklärt, welches Motiv unverändert bleiben soll und welcher Hintergrund die Originalszene ersetzen soll.' },
        { q: 'Kann ich ein Foto in Anime-, Cartoon- oder Illustrationsstil verwandeln?', a: 'Ja. Lade das Foto hoch und beschreibe den gewünschten Stil, etwa Anime-Avatar, Bilderbuchillustration, Aquarell, 3D-Render, Sticker, Poster oder cineastische Concept Art.' },
        { q: 'Ist Image-to-Image nützlich für Produktfotos?', a: 'Ja. Es eignet sich für Produkt-Hintergrundwechsel, Studio-E-Commerce-Aufnahmen, saisonale Kampagnenkonzepte, Werbevisuals, Mockups und kreative Varianten derselben Produktreferenz.' },
        { q: 'Warum hat sich das Ergebnis zu stark verändert?', a: 'Der Prompt erklärt möglicherweise nicht klar genug, was gleich bleiben soll. Ergänze Erhaltungsanweisungen wie „gleiche Pose beibehalten“, „Produkt unverändert lassen“ oder „Raumlayout und Kamerawinkel beibehalten“.' },
        { q: 'Was macht einen guten Image-to-Image-Prompt aus?', a: 'Ein guter Prompt hat drei Teile: was bleiben soll, was sich ändern soll und wie das finale Bild aussehen soll. Ergänze Details zu Stil, Licht, Hintergrund, Farben, Kamerawinkel und Einsatzzweck.' },
        { q: 'Kann ich generierte Bilder kommerziell nutzen?', a: 'Kommerzielle Nutzung hängt vom Ausgangsbild, deinen Rechten am hochgeladenen Inhalt, dem gewählten Modell und dem Einsatzzweck ab. Lade keine Bilder hoch, für die du keine Rechte hast, und prüfe finale Assets vor der Veröffentlichung.' },
        { q: 'Welche Bildprompts passen gut zu diesem Tool?', a: 'Toolaze ist für praktische kreative Workflows wie Produktvisuals, Porträts, Social-Grafiken, Designkonzepte und Marketingentwürfe gedacht. Nutze sichere Bilder, für die du Rechte hast, und passende Prompts.' },
        { q: 'Was ist der beste Image-to-Image-KI-Generator?', a: 'Der beste Image-to-Image-KI-Generator hält wichtige Referenzdetails erkennbar und gibt dir Kontrolle über Stil, Hintergrund, Licht und Ausgabeformat. Toolaze fokussiert praktische Bildvarianten, kreative Edits und promptgeführte Workflows.' },
      ],
    },
    cta: { title: 'Erstelle deine nächste Bildvariante', description: 'Lade ein Referenzbild hoch, beschreibe die Änderung und generiere ein neues Bild für Produkte, Porträts, Innenräume, Kampagnen, Social-Media-Beiträge und kreative Entwürfe.', button: 'Jetzt generieren' },
  },
  ja: {
    metadata: { title: 'AI画像から画像ジェネレーター 無料オンライン | Toolaze', description: '参照画像をアップロードして変更内容を説明するだけで、AI画像バリエーション、商品写真、ポートレート、スタイル変換、背景変更、クリエイティブ編集をToolazeで作成できます。' },
    breadcrumbs: { home: 'ホーム', aiTools: 'AIツール', current: 'AI画像から画像ジェネレーター' },
    hero: { highlight: 'AI画像から画像ジェネレーター', description: '参照画像をアップロードし、編集したい内容を説明して、新しいビジュアルを生成します。Toolazeなら既存画像から、画像バリエーション、商品写真、ポートレートのリスタイル、背景変更、SNSグラフィック、コンセプトアート、仕上がりのよいクリエイティブ案を作れます。', badges: ['参照画像', 'プロンプト編集', 'スタイル変換', '背景差し替え'] },
    samples: [{ title: '参照画像ベースの商品編集サンプル' }, { title: 'EC商品バリエーションサンプル' }, { title: 'ポートレートリスタイルサンプル' }, { title: '商用画像バリエーションサンプル' }],
    whatIs: { title: 'AI画像から画像ジェネレーターとは？', paragraphs: ['AI画像から画像ジェネレーターは、既存の参照画像から新しい画像を作成するツールです。テキストだけで始めるのではなく、アップロードした画像を使って、被写体、構図、ポーズ、商品の形、部屋のレイアウト、ビジュアルの方向性をガイドします。', 'プロンプトでは、スタイル、背景、照明、色、シーン、用途など、何を変えるかを指定できます。元画像の重要な部分を保ちながら新しい仕上がりにしたい場合に便利です。'] },
    promise: { title: '参照画像から新しい画像を作成', text: '実際の画像を出発点にして、自然な言葉で結果を調整できます。重要な要素を認識できる形で残しながら、ビジュアルの方向性を変えられます。', cards: [{ title: '主な被写体を保つ', text: '商品、人物、物体、部屋、ロゴ位置、構図を認識できるまま、よりきれいで創造的なバージョンを生成します。' }, { title: 'プロンプトでスタイル変更', text: '写真を映画風シーン、スタジオ商品画像、アニメ風ポートレート、イラスト、編集風ポスター、3Dレンダー、SNSビジュアルに変換できます。' }, { title: '背景を置き換える', text: '被写体を新しい場所に移し、スタジオ背景、季節シーン、すっきりした構図、EC向け画像を作成できます。' }, { title: '画像バリエーションを作成', text: '1枚の参照画像から複数案を生成し、レイアウト、照明、色、カメラ角度、クリエイティブ表現を比較できます。' }] },
    features: { title: '参照画像とプロンプトで画像を編集', text: '既存のビジュアルから制御された結果が必要なときに、image-to-image生成を使います。参照画像をアップロードし、何を残すかを説明して、新しいスタイル、背景、商品セットアップ、クリエイティブ方向へ導きます。', items: [{ title: '参照画像ガイド編集', text: '主な被写体、商品、ポーズ、レイアウト、構図を認識できるまま、自然言語の指示で最終画像を変えます。', alt: 'AI画像から画像の参照ガイド編集例' }, { title: '商品写真バリエーション', text: '1つの商品参照から、スタジオ写真、EC画像、ライフスタイルシーン、季節コンセプト、キャンペーン用ビジュアルを作れます。', alt: 'AI画像から画像の商品写真バリエーション例' }, { title: '背景差し替え', text: '元の背景を、よりきれいなシーン、ブランド向けセット、室内、屋外ロケーション、スタジオ背景、SNS構図に置き換えます。', alt: 'AI画像から画像の背景差し替え前後比較例' }, { title: 'スタイル変換とリスタイル', text: '写真を編集風ポートレート、アニメアバター、水彩イラスト、3Dレンダー、ステッカー、ポスター、映画風コンセプトに変換します。', alt: 'AI画像から画像のスタイル変換前後比較例' }] },
    gallery: { title: '画像から画像の作例', text: '参照画像と絞り込んだプロンプトから作成できる実用的な結果を確認できます。', examples: [{ title: 'スタジオ商品写真', text: '同じ商品形状とラベル位置を保ちながら、柔らかな影のあるクリーンなスタジオ背景を作ります。', alt: 'クリーンなスタジオ背景の商品AI画像' }, { title: '季節の商品広告', text: '商品を変えずに、上質なリテール演出の温かいホリデーキャンペーンシーンに配置します。', alt: '季節広告シーンの商品AIバリエーション' }, { title: 'ポートレートから編集風へ', text: 'ポートレートを、ドラマチックな照明とすっきりした背景のファッション編集画像にリスタイルします。', alt: 'AIポートレートリスタイル前後比較例' }, { title: '部屋のリデザイン', text: '部屋のレイアウトとカメラ角度を保ちながら、新しい家具、素材、照明方向を試します。', alt: 'AIインテリアリデザイン前後比較例' }, { title: '背景差し替え', text: '被写体とポーズを変えずに、元のシーンを洗練された新しい背景に置き換えます。', alt: 'AIポートレート背景差し替え前後比較例' }, { title: '3D商品レンダー', text: '商品参照を、光沢素材と柔らかなスタジオ反射を備えた高品質レンダーに変換します。', alt: 'アップロード商品画像からのAI 3D商品レンダー' }, { title: 'SNSポスター', text: '参照被写体を視覚的な軸にして、大胆な縦型ポスターやキャンペーングラフィックを作ります。', alt: '参照画像から生成したAI SNSポスター' }, { title: 'コンセプトアート変化', text: 'ラフなビジュアル方向を、より完成度の高いシーン、環境、ムードボードへ発展させます。', alt: '参照画像から生成したAIコンセプトアート変化' }] },
    models: { title: 'Image-to-Imageに合うモデルを選ぶ', description: '商品編集、ポートレート、スタイル変換、構図制御、プロンプト追従、キャンペーン品質など、目的に合わせてモデルを選びます。', cards: [{ title: 'GPT Image 2', text: '構造的な画像編集、商品ビジュアル、読みやすいレイアウト、ポスター案、商用クリエイティブ下書きに最適です。', label: 'GPT Image 2を試す' }, { title: 'Nano Banana Pro', text: '洗練された画像バリエーション、ポートレート、商品写真、クリエイティブなリスタイル、高品質な参照ベース出力に最適です。', label: 'Nano Banana Proを試す' }, { title: 'Seedream 4.5', text: '商用商品ビジュアル、ブランド調の構成、ECコンセプト、タイポグラフィ中心のレイアウト、一貫した参照編集に最適です。', label: 'Seedream 4.5を試す' }], comparisonTitle: 'Image-to-Imageモデルガイド', headers: { model: 'モデル', bestFor: '最適な用途', output: '出力', references: '参照画像', textAndEditing: 'テキストと編集', watchouts: '注意点' }, rows: [{ model: 'GPT Image 2', bestFor: '商品編集、ポスター、レイアウトを意識した画像バリエーション、商用下書き。', output: 'Toolazeのモデル設定で複数の出力サイズに対応。', references: 'アップロード画像で主被写体やレイアウトを導きたい場合に便利です。', textAndEditing: 'プロンプト編集、短いテキスト、構造的な構図に強いです。', watchouts: '公開前に文字、顔、手、ロゴ、商品ディテールを確認してください。' }, { model: 'Nano Banana Pro', bestFor: 'ポートレートリスタイル、洗練された創作バリエーション、商品写真、キャンペーンビジュアル。', output: '高品質な画像下書きと洗練されたビジュアル方向に便利です。', references: '視覚的な同一性を保ちながら新しい表現を探索するのに強いです。', textAndEditing: '複雑なプロンプトと創造的な画像バリエーションに向いています。', watchouts: '被写体が変わりすぎる場合は、保持したい要素をより明確に書いてください。' }, { model: 'Seedream 4.5', bestFor: '商用商品シーン、ブランドビジュアル、ECコンセプト、タイポグラフィ画像。', output: '商品とマーケティングのワークフローを洗練させるのに便利です。', references: 'ブランドスタイル参照や商品中心の編集に適しています。', textAndEditing: '商用感のある画像下書きでプロンプト追従が強いです。', watchouts: '明確な用途を持つ具体的なプロンプトで最良の結果になります。' }] },
    modes: { title: 'Image-to-ImageとText-to-Imageの違い', description: '既存ビジュアルからどれだけ制御したいかで、適切なワークフローを選びます。', headers: { label: 'ワークフロー', aiImageGenerator: '最適な用途', textToImage: '入力', imageToImage: '出力' }, rows: [{ label: 'AI画像から画像ジェネレーター', aiImageGenerator: '既存画像から制御されたバリエーションを作成', textToImage: '参照画像とプロンプト', imageToImage: 'アップロード参照に導かれた新しい画像' }, { label: 'テキストから画像ジェネレーター', aiImageGenerator: 'ゼロから新しいビジュアルを作成', textToImage: 'プロンプトのみ', imageToImage: 'テキスト説明に基づく生成画像' }, { label: 'AIフォトエディター', aiImageGenerator: '部分的な修正や簡単な編集', textToImage: '既存写真と編集指示', imageToImage: '元画像を編集したバージョン' }] },
    prompts: { title: 'Image-to-Imageプロンプトテンプレート', text: '良いプロンプトは、何を残し、何を変え、最終画像をどう見せたいかをモデルに伝えます。', copyButton: 'プロンプトをコピー', copiedButton: 'コピー済み', examples: [{ title: '商品写真テンプレート', prompt: '同じ商品形状、色、ロゴ位置、主要ディテールを保ってください。背景をクリーンなスタジオシーンに置き換え、柔らかな影、上質なEC照明、洗練された商品写真の見た目にしてください。', alt: '商品image-to-imageプロンプト例' }, { title: 'ポートレートリスタイルテンプレート', prompt: '同じ人物、顔の構造、ポーズ、表情を保ってください。クリーンな背景、ドラマチックなサイドライト、自然な肌色、高級雑誌風のカラーグレーディングで編集風ポートレートにしてください。', alt: 'ポートレートimage-to-image前後プロンプト例' }, { title: 'インテリアデザインテンプレート', prompt: '同じ部屋のレイアウト、窓、カメラ角度を保ってください。モダンなJapandi家具、温かい木の質感、ニュートラルなファブリック、観葉植物、柔らかな自然光で空間をリデザインしてください。', alt: 'インテリアimage-to-image前後プロンプト例' }, { title: 'クリエイティブ変化テンプレート', prompt: 'アップロードした画像を主な参照として使ってください。大胆な構図、現代的な色、見出しテキスト用の余白、洗練された商用ルックを持つSNSキャンペーン向けの新しいバージョンを作成してください。', alt: 'クリエイティブimage-to-imageプロンプト例' }] },
    howTo: { schemaName: 'Toolaze AI画像から画像ジェネレーターの使い方', title: 'AI画像から画像ジェネレーターの使い方', description: '参照画像をアップロードし、何を変えるかを説明して、保持内容とスタイル指示を明確にしながら結果を調整します。', stepLabel: 'ステップ', steps: [{ title: '参照画像をアップロード', text: '変換したい画像を選びます。参照画像は、被写体、構図、ポーズ、商品の形、ビジュアル方向を導きます。' }, { title: '編集内容を説明', text: '何を変え、何を残すかを明確に書きます。スタイル、背景、照明、用途の詳細を追加します。' }, { title: '設定を選ぶ', text: '画像バリエーションや制作ワークフローに合うモデル、アスペクト比、品質設定を選びます。' }, { title: '画像を生成', text: '新しい画像を作成し、元の参照と比較して被写体の安定性、スタイル、構図を確認します。' }, { title: '調整してダウンロード', text: 'より近い一致、強いスタイル、きれいな背景、洗練された仕上がりが必要な場合はプロンプトを調整します。' }] },
    useCases: { title: '人気のImage-to-Imageアイデア', description: 'すでにビジュアルの出発点があり、画像を最初から作り直さずに新しいバージョンが欲しいときに使えます。', cards: [{ title: '商品写真アップグレード', text: '基本の商品画像を、クリーンなスタジオ写真、季節広告ビジュアル、EC掲載画像、プレミアムキャンペーン案に変換します。' }, { title: 'ポートレートリスタイル', text: '新しい照明、ファッション方向、背景、イラストスタイル、アバター風、プロフィール画像案でポートレートを変えます。' }, { title: '背景差し替え', text: '被写体を保ち、スタジオ背景、屋外ロケーション、ブランドセット、室内、キャンペーン環境に置き換えます。' }, { title: 'インテリアリデザイン', text: '部屋写真をアップロードして、新しい家具、配色、照明、素材、壁面アート、装飾方向を試します。' }, { title: 'スタイル変換', text: '参照画像をアニメ、水彩、3Dレンダー、編集写真、映画風、スケッチ、ステッカー、ポスター風に変換します。' }, { title: 'マーケティングクリエイティブ', text: '広告、ランディングページヒーロー、SNS投稿、サムネイル、ローンチグラフィック、商品告知のビジュアル方向を作ります。' }] },
    related: { title: '関連AI画像ツール', description: '画像生成、編集、強化、プロンプト発見のツールでワークフローを続けられます。', cards: [{ title: 'AI画像ジェネレーター', label: 'テキストから生成', text: '参照画像がない場合は、テキストプロンプトから始めます。' }, { title: 'GPT Image 2ジェネレーター', label: 'GPT Image 2を試す', text: 'ToolazeのGPT画像ワークフローで、高品質な画像生成と参照ガイド編集を作成できます。' }, { title: '背景削除ツール', label: '背景を削除', text: '新しい商品写真、プロフィール画像、デザイン素材を作る前に、不要な視覚要素を取り除きます。' }, { title: '画像補正ツール', label: '画像を強化', text: '画像生成や編集の後に、明瞭さ、ディテール、仕上がりを改善します。' }, { title: 'Nano Banana Pro', label: 'Nano Banana Proを試す', text: '創造的なバリエーションや視覚実験向けの別の高品質画像モデルを試せます。' }, { title: 'Seedream 4.5', label: 'Seedream 4.5を試す', text: '商用商品ビジュアル、タイポグラフィデザイン、参照ベースのマーケティング下書きを作成します。' }] },
    faq: { title: 'AI画像から画像ジェネレーター FAQ', description: '参照画像、プロンプト、形式、無料利用、実用的なimage-to-imageワークフローに関するよくある質問です。', items: [{ q: 'AI画像から画像ジェネレーターとは何ですか？', a: 'アップロードした参照画像とテキストプロンプトから新しい画像を作るAIツールです。参照画像が被写体、構図、ポーズ、視覚構造を導き、プロンプトがスタイル、背景、照明、編集内容を制御します。' }, { q: 'Image-to-ImageはText-to-Imageとどう違いますか？', a: 'Text-to-Imageはプロンプトだけで始めます。Image-to-Imageは参照画像から始めるため、商品、人物、レイアウト、物体、構図を認識できるまま見た目を変えたい場合に向いています。' }, { q: 'AI画像から画像ジェネレーターは無料で使えますか？', a: '無料利用は、クォータ、選択モデル、品質設定によって変わる場合があります。新しい画像を始める前に、ジェネレーターの現在の利用条件を確認してください。' }, { q: 'どの画像形式をアップロードできますか？', a: 'Toolazeの画像ツールは通常、JPG、PNG、WEBPなどの標準的なWeb画像形式に対応しています。より良い結果には、明るくクリアな元画像を使ってください。' }, { q: '同じ人物や商品を保つには？', a: '何を同じにしたいかを具体的に書いてください。例：「同じ顔、ポーズ、髪型、表情を保つ」「同じ商品形状、ラベル位置、色を保つ」。' }, { q: '背景だけを変更できますか？', a: 'はい。画像をアップロードし、どの被写体を変えずに残し、どんな背景で元のシーンを置き換えるかをプロンプトに書いてください。' }, { q: '写真をアニメ、カートゥーン、イラスト風にできますか？', a: 'はい。写真をアップロードし、アニメアバター、絵本風イラスト、水彩、3Dレンダー、ステッカー、ポスター、映画風コンセプトアートなど希望のスタイルを説明します。' }, { q: 'Image-to-Imageは商品写真に役立ちますか？', a: 'はい。商品背景変更、スタジオ風EC写真、季節キャンペーン案、広告ビジュアル、モックアップ、同じ商品参照からの創造的バリエーションに便利です。' }, { q: 'なぜ結果が変わりすぎましたか？', a: 'プロンプトで何を残すかが十分に明確でない可能性があります。「同じポーズを保つ」「商品を変えない」「部屋のレイアウトとカメラ角度を保つ」などを追加してください。' }, { q: '良いImage-to-Imageプロンプトとは？', a: '良いプロンプトには、何を残すか、何を変えるか、最終画像をどう見せるかの3つがあります。スタイル、照明、背景、色、カメラ角度、用途を加えてください。' }, { q: '生成画像を商用利用できますか？', a: '商用利用は、元画像、アップロード内容の権利、選択モデル、用途によって異なります。権利のない画像をアップロードせず、公開前に最終アセットを確認してください。' }, { q: 'このツールに合う画像プロンプトは？', a: 'Toolazeは商品ビジュアル、ポートレート、SNSグラフィック、デザインコンセプト、マーケティング下書きなど実用的な制作ワークフロー向けです。権利上安全な画像とプロンプトを使ってください。' }, { q: '最高のImage-to-Image AIジェネレーターはどれですか？', a: '重要な参照ディテールを認識できる形で保ちつつ、スタイル、背景、照明、出力形式を制御できるものです。Toolazeは実用的な画像バリエーション、クリエイティブ編集、プロンプトガイド型ワークフローに重点を置いています。' }] },
    cta: { title: '次の画像バリエーションを作成', description: '参照画像をアップロードし、変更内容を説明して、商品、ポートレート、インテリア、キャンペーン、SNS投稿、クリエイティブ下書き向けの新しいビジュアルを生成します。', button: '生成を始める' },
  },
  es: {
    metadata: { title: 'Generador AI de imagen a imagen gratis en línea | Toolaze', description: 'Sube una imagen de referencia y describe los cambios que quieres. Crea variaciones de imagen con IA, fotos de producto, retratos, transferencias de estilo, fondos y ediciones creativas en línea con Toolaze.' },
    breadcrumbs: { home: 'Inicio', aiTools: 'Herramientas de IA', current: 'Generador AI de imagen a imagen' },
    hero: { highlight: 'Generador AI de imagen a imagen', description: 'Sube una imagen de referencia, describe la edición que quieres y genera una nueva pieza visual a partir de ella. Usa Toolaze para crear variaciones de imagen, fotos de producto, cambios de estilo en retratos, cambios de fondo, gráficos sociales, arte conceptual y borradores creativos pulidos desde una imagen existente.', badges: ['Imagen de referencia', 'Ediciones con prompt', 'Transferencia de estilo', 'Cambio de fondo'] },
    samples: [{ title: 'Ejemplo de edición de producto guiada por referencia' }, { title: 'Ejemplo de variación de producto ecommerce' }, { title: 'Ejemplo de cambio de estilo de retrato' }, { title: 'Ejemplo de variación de imagen comercial' }],
    whatIs: { title: '¿Qué es un generador AI de imagen a imagen?', paragraphs: ['Un generador AI de imagen a imagen crea una nueva imagen a partir de una imagen de referencia existente. En lugar de empezar solo con texto, usa tu imagen subida para guiar el sujeto, la composición, la pose, la forma del producto, el diseño de una habitación o la dirección visual.', 'Tu prompt controla qué cambia, como el estilo, fondo, iluminación, colores, escena o uso final. Esto hace que image-to-image sea útil cuando quieres un resultado nuevo manteniendo reconocibles partes importantes de la imagen original.'] },
    promise: { title: 'Crea nuevas imágenes desde una referencia', text: 'Empieza con una imagen real y guía el resultado con lenguaje natural. Mantén reconocibles las partes importantes mientras cambias la dirección visual.', cards: [{ title: 'Conserva el sujeto principal', text: 'Mantén reconocible un producto, persona, objeto, habitación, ubicación de logo o composición mientras generas una versión más limpia o creativa.' }, { title: 'Cambia el estilo con un prompt', text: 'Transforma una foto en una escena cinematográfica, imagen de producto de estudio, retrato anime, ilustración, póster editorial, render 3D o visual social.' }, { title: 'Reemplaza fondos', text: 'Mueve un sujeto a un nuevo entorno, crea un fondo de estudio, prueba escenas estacionales, elimina ruido visual o crea imágenes listas para ecommerce.' }, { title: 'Crea variaciones de imagen', text: 'Genera varias direcciones desde una imagen de referencia para comparar layouts, iluminación, colores, ángulos de cámara y tratamientos creativos.' }] },
    features: { title: 'Edita imágenes desde una referencia y un prompt', text: 'Usa la generación de imagen a imagen cuando necesitas un resultado controlado desde una pieza visual existente. Sube una referencia, describe qué debe permanecer igual y guía el modelo hacia un nuevo estilo, fondo, composición de producto o dirección creativa.', items: [{ title: 'Edición guiada por referencia', text: 'Mantén reconocible el sujeto, producto, pose, composición o encuadre mientras cambias la imagen final con instrucciones en lenguaje natural.', alt: 'Ejemplo de edición AI de imagen a imagen guiada por referencia' }, { title: 'Variaciones de foto de producto', text: 'Convierte una referencia de producto en tomas de estudio, imágenes ecommerce, escenas de estilo de vida, conceptos estacionales y piezas listas para campaña.', alt: 'Ejemplo de variación de foto de producto AI imagen a imagen' }, { title: 'Reemplazo de fondo', text: 'Reemplaza el fondo original por una escena más limpia, una composición de marca, interior, exterior, fondo de estudio o composición para redes sociales.', alt: 'Ejemplo antes y después de reemplazo de fondo AI imagen a imagen' }, { title: 'Transferencia de estilo y cambio de estilo', text: 'Convierte una foto en retrato editorial, avatar anime, ilustración acuarela, render 3D, pegatina, póster o concepto cinematográfico.', alt: 'Ejemplo antes y después de transferencia de estilo AI imagen a imagen' }] },
    gallery: { title: 'Ejemplos de imagen a imagen', text: 'Explora resultados prácticos que puedes crear desde una imagen de referencia y un prompt enfocado.', examples: [{ title: 'Foto de producto en estudio', text: 'Mantén la forma del producto y la ubicación de la etiqueta mientras creas un fondo de estudio limpio con sombras suaves.', alt: 'Foto de producto AI imagen a imagen con fondo de estudio limpio' }, { title: 'Anuncio de producto estacional', text: 'Mantén el producto sin cambios y colócalo en una escena cálida de campaña navideña con estilo retail premium.', alt: 'Variación AI de producto en una escena publicitaria estacional' }, { title: 'Retrato a editorial', text: 'Cambia el estilo de un retrato hacia una imagen de moda editorial con iluminación dramática y fondo limpio.', alt: 'Ejemplo antes y después de cambio de estilo de retrato AI' }, { title: 'Rediseño de habitación', text: 'Mantén la distribución y el ángulo de cámara mientras pruebas nuevos muebles, materiales e iluminación.', alt: 'Ejemplo antes y después de rediseño interior AI' }, { title: 'Reemplazo de fondo', text: 'Mantén sujeto y pose sin cambios mientras sustituyes la escena original por un fondo nuevo y pulido.', alt: 'Ejemplo antes y después de reemplazo de fondo de retrato AI' }, { title: 'Render 3D de producto', text: 'Convierte una referencia de producto en un render de alta calidad con materiales brillantes y reflejos suaves de estudio.', alt: 'Render 3D AI de producto desde una imagen subida' }, { title: 'Póster para redes sociales', text: 'Usa el sujeto de referencia como ancla visual para un póster vertical audaz o gráfico de campaña.', alt: 'Póster social AI generado desde una imagen de referencia' }, { title: 'Variación de arte conceptual', text: 'Convierte una dirección visual inicial en una escena, entorno o moodboard creativo más pulido.', alt: 'Variación de arte conceptual AI generada desde una imagen de referencia' }] },
    models: { title: 'Usa el modelo adecuado para imagen a imagen', description: 'Elige modelo según la tarea: edición de producto, retratos, transferencia de estilo, control de composición, seguimiento de prompt o resultado de campaña pulido.', cards: [{ title: 'GPT Image 2', text: 'Ideal para ediciones de imagen a imagen estructuradas, piezas de producto, composiciones legibles, conceptos de póster y borradores comerciales.', label: 'Probar GPT Image 2' }, { title: 'Nano Banana Pro', text: 'Ideal para variaciones pulidas, retratos, fotos de producto, cambios de estilo creativos y resultados de alta calidad basados en referencia.', label: 'Probar Nano Banana Pro' }, { title: 'Seedream 4.5', text: 'Ideal para escenas comerciales de producto, piezas de marca, conceptos ecommerce, composiciones tipográficas y edición consistente con referencias.', label: 'Probar Seedream 4.5' }], comparisonTitle: 'Guía de modelos de imagen a imagen', headers: { model: 'Modelo', bestFor: 'Ideal para', output: 'Salida', references: 'Imágenes de referencia', textAndEditing: 'Texto y edición', watchouts: 'A revisar' }, rows: [{ model: 'GPT Image 2', bestFor: 'Ediciones de producto, pósters, variaciones con composición, borradores comerciales.', output: 'Admite varios tamaños de salida mediante ajustes de modelo de Toolaze.', references: 'Útil cuando la imagen subida debe guiar el sujeto principal o la composición.', textAndEditing: 'Fuerte para ediciones con prompt, texto corto y composiciones estructuradas.', watchouts: 'Revisa ortografía, rostros, manos, logos y detalles de producto antes de publicar.' }, { model: 'Nano Banana Pro', bestFor: 'Cambios de estilo de retrato, variaciones creativas pulidas, fotos de producto, piezas de campaña.', output: 'Útil para borradores de imagen de alta calidad y direcciones visuales refinadas.', references: 'Fuerte para mantener identidad visual mientras exploras nuevos tratamientos.', textAndEditing: 'Bueno para prompts complejos y variaciones creativas.', watchouts: 'Usa instrucciones de preservación más claras si el sujeto cambia demasiado.' }, { model: 'Seedream 4.5', bestFor: 'Escenas comerciales de producto, piezas de marca, conceptos ecommerce, imágenes tipográficas.', output: 'Útil para flujos pulidos de producto y marketing.', references: 'Buen ajuste para referencias de estilo de marca y ediciones centradas en producto.', textAndEditing: 'Fuerte seguimiento de prompt para borradores con aspecto comercial.', watchouts: 'Los mejores resultados vienen de prompts específicos con un caso de uso claro.' }] },
    modes: { title: 'Imagen a imagen vs texto a imagen', description: 'Elige el flujo correcto según cuánto control necesites desde una pieza visual existente.', headers: { label: 'Flujo', aiImageGenerator: 'Ideal para', textToImage: 'Entrada', imageToImage: 'Salida' }, rows: [{ label: 'Generador AI de imagen a imagen', aiImageGenerator: 'Crear variaciones controladas desde una imagen existente', textToImage: 'Imagen de referencia más prompt', imageToImage: 'Nueva imagen guiada por la referencia subida' }, { label: 'Generador texto a imagen', aiImageGenerator: 'Crear una pieza visual nueva desde cero', textToImage: 'Solo prompt', imageToImage: 'Imagen generada según la descripción de texto' }, { label: 'Editor de fotos AI', aiImageGenerator: 'Hacer correcciones puntuales o ediciones simples', textToImage: 'Foto existente e instrucciones de edición', imageToImage: 'Versión editada de la imagen original' }] },
    prompts: { title: 'Plantillas de prompt imagen a imagen', text: 'Los buenos prompts indican qué conservar, qué cambiar y cómo debe sentirse la imagen final.', copyButton: 'Copiar prompt', copiedButton: 'Copiado', examples: [{ title: 'Plantilla de foto de producto', prompt: 'Mantén la misma forma del producto, color, ubicación del logo y detalles clave. Reemplaza el fondo por una escena de estudio limpia. Usa sombras suaves, iluminación premium de ecommerce y un look de fotografía de producto pulido.', alt: 'Ejemplo de prompt imagen a imagen para producto' }, { title: 'Plantilla de restyle de retrato', prompt: 'Mantén la misma persona, estructura facial, pose y expresión. Restyle la imagen como retrato editorial con fondo limpio, iluminación lateral dramática, tonos de piel naturales y color grading de revista premium.', alt: 'Ejemplo antes y después de prompt imagen a imagen para retrato' }, { title: 'Plantilla de diseño interior', prompt: 'Mantén el mismo layout de la habitación, ventanas y ángulo de cámara. Rediseña el espacio con muebles Japandi modernos, texturas de madera cálida, telas neutras, plantas de interior y luz natural suave.', alt: 'Ejemplo antes y después de prompt imagen a imagen para interior' }, { title: 'Plantilla de variación creativa', prompt: 'Usa la imagen subida como referencia principal. Crea una nueva versión para una campaña de redes sociales con composición audaz, colores modernos, espacio limpio para titular y un look comercial pulido.', alt: 'Ejemplo de prompt creativo imagen a imagen' }] },
    howTo: { schemaName: 'Cómo usar el generador AI de imagen a imagen de Toolaze', title: 'Cómo usar el generador AI de imagen a imagen', description: 'Sube una imagen de referencia, describe qué debe cambiar y refina el resultado con instrucciones más claras de preservación y estilo.', stepLabel: 'Paso', steps: [{ title: 'Sube una imagen de referencia', text: 'Elige la imagen que quieres transformar. La referencia ayuda a guiar sujeto, composición, pose, forma del producto o dirección visual.' }, { title: 'Describe la edición', text: 'Escribe un prompt claro que explique qué debe cambiar y qué debe mantenerse igual. Añade detalles de estilo, fondo, iluminación y uso.' }, { title: 'Elige ajustes', text: 'Selecciona modelo, relación de aspecto y calidad que mejor encajen con tu variación de imagen o flujo creativo.' }, { title: 'Genera la imagen', text: 'Crea tu nueva imagen y compárala con la referencia original para revisar estabilidad del sujeto, estilo y composición.' }, { title: 'Refina y descarga', text: 'Ajusta el prompt si quieres una coincidencia más cercana, un estilo más fuerte, fondo más limpio o salida más pulida.' }] },
    useCases: { title: 'Ideas populares de imagen a imagen', description: 'Usa imagen a imagen cuando ya tienes un punto de partida visual y quieres una nueva versión sin reconstruir la imagen desde cero.', cards: [{ title: 'Mejora de foto de producto', text: 'Convierte una imagen básica de producto en foto de estudio limpia, anuncio estacional, imagen de ficha ecommerce o concepto de campaña premium.' }, { title: 'Cambio de estilo de retrato', text: 'Cambia el estilo de un retrato con nueva iluminación, dirección de moda, fondo, estilo ilustrado, look de avatar o concepto de perfil.' }, { title: 'Cambio de fondo', text: 'Mantén el sujeto y reemplaza la escena por fondo de estudio, ubicación exterior, composición de marca, interior o entorno de campaña.' }, { title: 'Rediseño interior', text: 'Sube una foto de habitación y prueba nuevos muebles, paletas de color, iluminación, materiales, arte mural o direcciones decorativas.' }, { title: 'Transferencia de estilo', text: 'Convierte una referencia en anime, acuarela, render 3D, fotografía editorial, cine, boceto, pegatina o estilo póster.' }, { title: 'Creativo de marketing', text: 'Crea direcciones visuales para anuncios pagados, heroes de landing page, publicaciones sociales, miniaturas, gráficos de lanzamiento y anuncios de producto.' }] },
    related: { title: 'Herramientas AI de imagen relacionadas', description: 'Continúa tu flujo con herramientas para generación, edición, mejora y descubrimiento de prompts.', cards: [{ title: 'Generador de imágenes AI', label: 'Generar desde texto', text: 'Empieza desde un prompt de texto cuando no tienes una imagen de referencia.' }, { title: 'Generador GPT Image 2', label: 'Probar GPT Image 2', text: 'Crea generaciones de imagen de alta calidad y ediciones guiadas por referencia con el flujo GPT de Toolaze.' }, { title: 'Eliminador de fondo', label: 'Eliminar fondo', text: 'Elimina ruido visual antes de crear una nueva foto de producto, imagen de perfil o recurso de diseño.' }, { title: 'Mejorador de imagen', label: 'Mejorar imagen', text: 'Mejora claridad, detalle y acabado después de generar o editar una imagen.' }, { title: 'Nano Banana Pro', label: 'Probar Nano Banana Pro', text: 'Explora otro modelo de imagen de alta calidad para variaciones creativas y experimentos visuales.' }, { title: 'Seedream 4.5', label: 'Probar Seedream 4.5', text: 'Crea piezas comerciales de producto, diseños con tipografía y borradores de marketing basados en referencia.' }] },
    faq: { title: 'FAQ del generador AI de imagen a imagen', description: 'Respuestas sobre imágenes de referencia, prompts, formatos, uso gratuito y flujos prácticos de imagen a imagen.', items: [{ q: '¿Qué es un generador AI de imagen a imagen?', a: 'Es una herramienta que crea una nueva imagen desde una referencia subida y un prompt de texto. La referencia guía sujeto, composición, pose o estructura visual, mientras el prompt controla estilo, fondo, iluminación y ediciones.' }, { q: '¿En qué se diferencia imagen a imagen de texto a imagen?', a: 'Texto a imagen empieza solo con un prompt. Imagen a imagen empieza con una referencia, por lo que funciona mejor cuando quieres mantener reconocible un producto, persona, composición, objeto o encuadre.' }, { q: '¿Puedo usar gratis el generador AI de imagen a imagen?', a: 'El uso gratuito puede variar según cuota, modelo seleccionado y ajustes de calidad. Revisa los controles del generador para ver la disponibilidad actual antes de iniciar una nueva imagen.' }, { q: '¿Qué formatos de imagen puedo subir?', a: 'Las herramientas de imagen de Toolaze suelen admitir formatos web estándar como JPG, PNG y WEBP. Usa una fuente clara con buena iluminación para mejores resultados.' }, { q: '¿Cómo mantengo la misma persona o producto?', a: 'Indica exactamente qué debe permanecer igual. Por ejemplo: “mantén el mismo rostro, pose, peinado y expresión” o “mantén la misma forma del producto, posición de etiqueta y color”.' }, { q: '¿Puedo cambiar solo el fondo?', a: 'Sí. Sube tu imagen y escribe un prompt que diga qué sujeto debe quedarse sin cambios y qué fondo debe reemplazar la escena original.' }, { q: '¿Puedo convertir una foto a estilo anime, cartoon o ilustración?', a: 'Sí. Sube la foto y describe el estilo deseado, como avatar anime, ilustración de cuento, acuarela, render 3D, pegatina, póster o arte conceptual cinematográfico.' }, { q: '¿Imagen a imagen sirve para fotos de producto?', a: 'Sí. Sirve para cambios de fondo de producto, fotos ecommerce de estudio, conceptos de campaña estacional, piezas de anuncio, mockups y variaciones creativas de la misma referencia.' }, { q: '¿Por qué el resultado cambió demasiado?', a: 'Puede que el prompt no explique con claridad qué debe mantenerse. Añade instrucciones como “mantener la misma pose”, “dejar el producto sin cambios” o “mantener composición y ángulo de cámara”.' }, { q: '¿Qué hace bueno a un prompt de imagen a imagen?', a: 'Un buen prompt incluye tres partes: qué conservar, qué cambiar y cómo debe verse la imagen final. Añade estilo, iluminación, fondo, colores, ángulo de cámara y caso de uso.' }, { q: '¿Puedo usar imágenes generadas comercialmente?', a: 'El uso comercial depende de la imagen de origen, tus derechos sobre el contenido subido, el modelo elegido y el caso de uso. No subas imágenes sin permiso y revisa los recursos finales antes de publicar.' }, { q: '¿Qué prompts de imagen encajan con esta herramienta?', a: 'Toolaze está pensado para flujos creativos prácticos como piezas de producto, retratos, gráficos sociales, conceptos de diseño y borradores de marketing. Usa imágenes seguras y con derechos claros.' }, { q: '¿Cuál es el mejor generador AI de imagen a imagen?', a: 'El mejor es el que mantiene reconocibles los detalles importantes de referencia mientras te da control sobre estilo, fondo, iluminación y formato de salida. Toolaze se centra en variaciones prácticas, ediciones creativas y flujos guiados por prompt.' }] },
    cta: { title: 'Crea tu próxima variación de imagen', description: 'Sube una imagen de referencia, describe el cambio y genera una nueva pieza visual para productos, retratos, interiores, campañas, publicaciones sociales y borradores creativos.', button: 'Empezar a generar' },
  },
  'zh-TW': {
    metadata: { title: 'AI 圖生圖產生器免費線上使用 | Toolaze', description: '上傳參考圖片並描述想要的變化。使用 Toolaze 線上建立 AI 圖片變體、產品照、人像、風格轉換、背景替換與創意修圖。' },
    breadcrumbs: { home: '首頁', aiTools: 'AI 工具', current: 'AI 圖生圖產生器' },
    hero: { highlight: 'AI 圖生圖產生器', description: '上傳參考圖片，描述你想要的編輯效果，並從既有圖片生成新的視覺內容。使用 Toolaze 建立圖片變體、產品照、人像改風格、背景替換、社群圖片、概念藝術與精修創意草稿。', badges: ['參考圖片', 'Prompt 引導編輯', '風格轉換', '背景替換'] },
    samples: [{ title: '參考圖引導的產品編輯範例' }, { title: '電商產品變體範例' }, { title: '人像改風格範例' }, { title: '商業圖片變體範例' }],
    whatIs: { title: '什麼是 AI 圖生圖產生器？', paragraphs: ['AI 圖生圖產生器會從既有參考圖片建立一張新圖片。它不是只從文字開始，而是利用你上傳的圖片來引導主體、構圖、姿勢、產品形狀、房間布局或視覺方向。', '你的提示詞控制要改變的內容，例如風格、背景、光線、顏色、場景或最終用途。當你想要新結果，同時保留原圖重要元素可辨識時，圖生圖非常實用。'] },
    promise: { title: '從參考圖片建立新圖片', text: '從真實圖片開始，用自然語言引導結果。保留重要元素的辨識度，同時改變整體視覺方向。', cards: [{ title: '保留主要主體', text: '保留產品、人物、物件、房間、Logo 位置或構圖的辨識度，同時生成更乾淨或更有創意的版本。' }, { title: '用提示詞改變風格', text: '把照片轉成電影感場景、棚拍產品圖、動漫人像、插畫、編輯風海報、3D 渲染或社群視覺。' }, { title: '替換背景', text: '把主體移到新場景，建立棚拍背景、測試節日場景、移除雜亂元素，或製作電商可用圖片。' }, { title: '建立圖片變體', text: '從一張參考圖片生成多個方向，方便比較布局、光線、顏色、鏡頭角度與創意處理。' }] },
    features: { title: '用參考圖片和提示詞編輯圖片', text: '當你需要從既有視覺得到可控結果時，使用圖生圖生成。上傳參考圖，說明哪些部分要保留，再引導模型產生新的風格、背景、產品場景或創意方向。', items: [{ title: '參考圖引導編輯', text: '保留主體、產品、姿勢、布局或構圖的辨識度，並用自然語言指令改變最終圖片。', alt: 'AI 圖生圖參考引導編輯範例' }, { title: '產品照片變體', text: '把一張產品參考圖變成棚拍照、電商圖片、生活情境、節日概念與可用於行銷活動的產品視覺。', alt: 'AI 圖生圖產品照片變體範例' }, { title: '背景替換', text: '把原始背景替換成更乾淨的場景、品牌設定、室內空間、戶外地點、棚拍背景或社群構圖。', alt: 'AI 圖生圖背景替換前後對比範例' }, { title: '風格轉換與改風格', text: '把照片改成編輯風人像、動漫頭像、水彩插畫、3D 渲染、貼紙、海報或電影感概念圖。', alt: 'AI 圖生圖風格轉換前後對比範例' }] },
    gallery: { title: '圖生圖範例', text: '探索你可以用參考圖片和聚焦提示詞建立的實用結果。', examples: [{ title: '棚拍產品照', text: '保留相同產品形狀與標籤位置，同時建立有柔和陰影的乾淨棚拍背景。', alt: 'AI 圖生圖乾淨棚拍背景產品照' }, { title: '節日產品廣告', text: '保留產品不變，並放入具有高級零售質感的溫暖節日行銷場景。', alt: '產品在節日廣告場景中的 AI 圖片變體' }, { title: '人像轉編輯風', text: '把人像改成具有戲劇光線與乾淨背景的時尚編輯圖片。', alt: 'AI 人像改風格前後對比範例' }, { title: '房間重新設計', text: '保留房間布局與鏡頭角度，同時測試新的家具、材質與光線方向。', alt: 'AI 室內重新設計前後對比範例' }, { title: '背景替換', text: '保留主體與姿勢不變，將原本場景替換為精緻的新背景。', alt: 'AI 人像背景替換前後對比範例' }, { title: '3D 產品渲染', text: '把產品參考圖轉成具有光澤材質與柔和棚拍反射的高品質渲染圖。', alt: '從上傳產品圖生成的 AI 3D 產品渲染' }, { title: '社群媒體海報', text: '用參考主體作為視覺中心，建立大膽的直式海報或行銷圖。', alt: '從參考圖片生成的 AI 社群媒體海報' }, { title: '概念藝術變體', text: '把粗略視覺方向轉成更完整的場景、環境或創意情緒板。', alt: '從參考圖片生成的 AI 概念藝術變體' }] },
    models: { title: '為圖生圖選擇合適模型', description: '依任務選擇模型：產品編輯、人像、風格轉換、構圖控制、Prompt 遵循度或精修行銷輸出。', cards: [{ title: 'GPT Image 2', text: '適合結構化圖生圖編輯、產品視覺、可讀布局、海報概念與商業創意草稿。', label: '試用 GPT Image 2' }, { title: 'Nano Banana Pro', text: '適合精緻圖片變體、人像、產品照、創意改風格與高品質參考式輸出。', label: '試用 Nano Banana Pro' }, { title: 'Seedream 4.5', text: '適合商業產品場景、品牌視覺、電商概念、文字布局與一致的參考圖編輯。', label: '試用 Seedream 4.5' }], comparisonTitle: '圖生圖模型指南', headers: { model: '模型', bestFor: '最適合', output: '輸出', references: '參考圖片', textAndEditing: '文字與編輯', watchouts: '注意事項' }, rows: [{ model: 'GPT Image 2', bestFor: '產品編輯、海報、具布局意識的圖片變體、商業草稿。', output: '透過 Toolaze 模型設定支援多種輸出尺寸。', references: '當上傳圖片需要引導主體或布局時很實用。', textAndEditing: '擅長 Prompt 引導編輯、短文字與結構化構圖。', watchouts: '發布前請檢查拼字、臉、手、Logo 與產品細節。' }, { model: 'Nano Banana Pro', bestFor: '人像改風格、精緻創意變體、產品照、行銷視覺。', output: '適合高品質圖片草稿與更細緻的視覺方向。', references: '擅長保留視覺識別並探索新的處理方式。', textAndEditing: '適合複雜提示詞與創意圖片變體。', watchouts: '如果主體改變過多，請使用更清楚的保留指令。' }, { model: 'Seedream 4.5', bestFor: '商業產品場景、品牌視覺、電商概念、文字主導圖片。', output: '適合精緻產品與行銷工作流程。', references: '很適合品牌風格參考與以產品為核心的編輯。', textAndEditing: '對商業感圖片草稿有強 Prompt 遵循能力。', watchouts: '清楚具體且有明確用途的提示詞能得到最佳結果。' }] },
    modes: { title: '圖生圖 vs 文生圖', description: '依照你需要從既有視覺取得多少控制度，選擇正確工作流程。', headers: { label: '工作流程', aiImageGenerator: '最適合', textToImage: '輸入', imageToImage: '輸出' }, rows: [{ label: 'AI 圖生圖產生器', aiImageGenerator: '從既有圖片建立可控變體', textToImage: '參考圖片加提示詞', imageToImage: '由上傳參考圖引導的新圖片' }, { label: '文生圖產生器', aiImageGenerator: '從零建立新的視覺', textToImage: '只有提示詞', imageToImage: '依文字描述生成的圖片' }, { label: 'AI 照片編輯器', aiImageGenerator: '進行局部修正或簡單編輯', textToImage: '既有照片與編輯指令', imageToImage: '原始圖片的編輯版本' }] },
    prompts: { title: '圖生圖提示詞範本', text: '好的提示詞會告訴模型要保留什麼、改變什麼，以及最終圖片應該呈現什麼感覺。', copyButton: '複製提示詞', copiedButton: '已複製', examples: [{ title: '產品照片範本', prompt: '保留相同的產品形狀、顏色、Logo 位置與關鍵細節。把背景替換成乾淨的棚拍場景。使用柔和陰影、高級電商光線與精緻產品攝影風格。', alt: '產品圖生圖提示詞範例' }, { title: '人像改風格範本', prompt: '保留相同人物、臉部結構、姿勢與表情。把圖片改成編輯風人像，使用乾淨背景、戲劇性側光、自然膚色與高級雜誌色彩分級。', alt: '人像圖生圖前後對比提示詞範例' }, { title: '室內設計範本', prompt: '保留相同房間布局、窗戶與鏡頭角度。用現代 Japandi 家具、溫暖木質紋理、中性色布料、室內植物與柔和自然光重新設計空間。', alt: '室內圖生圖前後對比提示詞範例' }, { title: '創意變體範本', prompt: '使用上傳圖片作為主要參考。為社群媒體活動建立新版本，加入大膽構圖、現代色彩、乾淨的標題文字空間與精緻商業質感。', alt: '創意圖生圖提示詞範例' }] },
    howTo: { schemaName: '如何使用 Toolaze AI 圖生圖產生器', title: '如何使用 AI 圖生圖產生器', description: '上傳參考圖片，描述要改變的內容，並用更清楚的保留與風格指令精修結果。', stepLabel: '步驟', steps: [{ title: '上傳參考圖片', text: '選擇你想轉換的圖片。參考圖有助於引導主體、構圖、姿勢、產品形狀或視覺方向。' }, { title: '描述編輯內容', text: '寫出清楚提示詞，說明哪些要改、哪些要保留。加入風格、背景、光線與用途細節。' }, { title: '選擇設定', text: '選擇最適合圖片變體或創意流程的模型、比例與品質設定。' }, { title: '生成圖片', text: '建立新圖片，並與原始參考圖比較主體穩定度、風格與構圖。' }, { title: '精修並下載', text: '如果想要更接近原圖、更強風格、更乾淨背景或更精緻結果，調整提示詞後再生成。' }] },
    useCases: { title: '熱門圖生圖想法', description: '當你已經有視覺起點，並想要不從零重做圖片就建立新版本時，可以使用圖生圖。', cards: [{ title: '產品照片升級', text: '把基礎產品圖轉成乾淨棚拍照、節日廣告視覺、電商列表圖片或高級行銷概念。' }, { title: '人像改風格', text: '用新的光線、時尚方向、背景、插畫風、頭像感或個人檔案圖片概念重新設計人像。' }, { title: '背景替換', text: '保留主體並把場景替換成棚拍背景、戶外地點、品牌設定、室內空間或行銷環境。' }, { title: '室內重新設計', text: '上傳房間照片，測試新的家具、色彩搭配、光線、材質、牆面藝術或裝飾方向。' }, { title: '風格轉換', text: '把參考圖片轉成動漫、水彩、3D 渲染、編輯攝影、電影感、素描、貼紙或海報風格。' }, { title: '行銷創意', text: '為付費廣告、落地頁 Hero、社群貼文、縮圖、上市圖與產品公告建立視覺方向。' }] },
    related: { title: '相關 AI 圖片工具', description: '繼續使用圖片生成、編輯、增強與提示詞探索工具完成工作流程。', cards: [{ title: 'AI 圖片產生器', label: '從文字生成', text: '沒有參考圖片時，可以從文字提示詞開始。' }, { title: 'GPT Image 2 產生器', label: '試用 GPT Image 2', text: '使用 Toolaze 的 GPT 圖片流程建立高品質圖片生成與參考圖引導編輯。' }, { title: '背景移除工具', label: '移除背景', text: '在建立新的產品照、個人檔案圖片或設計素材前，先移除視覺雜訊。' }, { title: '圖片增強工具', label: '增強圖片', text: '在生成或編輯圖片後，改善清晰度、細節與完成度。' }, { title: 'Nano Banana Pro', label: '試用 Nano Banana Pro', text: '探索另一個高品質圖片模型，用於創意變體與視覺實驗。' }, { title: 'Seedream 4.5', label: '試用 Seedream 4.5', text: '建立商業產品視覺、文字主導設計與參考圖式行銷草稿。' }] },
    faq: { title: 'AI 圖生圖產生器 FAQ', description: '解答關於參考圖片、提示詞、格式、免費使用與實用圖生圖流程的常見問題。', items: [{ q: '什麼是 AI 圖生圖產生器？', a: 'AI 圖生圖產生器會從上傳的參考圖片和文字提示詞建立新圖片。參考圖引導主體、構圖、姿勢或視覺結構，而提示詞控制風格、背景、光線與編輯內容。' }, { q: '圖生圖和文生圖有什麼不同？', a: '文生圖只從提示詞開始。圖生圖從參考圖片開始，因此更適合在改變最終外觀時保留產品、人物、布局、物件或構圖的辨識度。' }, { q: '我可以免費使用 AI 圖生圖產生器嗎？', a: '免費使用可能因額度、選擇的模型與品質設定而異。開始新圖片前，請查看產生器控制項中的目前可用狀態。' }, { q: '可以上傳哪些圖片格式？', a: 'Toolaze 圖片工具通常支援 JPG、PNG、WEBP 等標準網頁圖片格式。使用光線清楚的來源圖片可獲得更好結果。' }, { q: '如何保留同一個人或產品？', a: '明確告訴產生器哪些部分要保持相同。例如：「保留相同臉部、姿勢、髮型與表情」或「保留相同產品形狀、標籤位置與顏色」。' }, { q: '可以只改背景嗎？', a: '可以。上傳圖片後，在提示詞中說明哪些主體要保持不變，以及要用什麼背景替換原本場景。' }, { q: '可以把照片變成動漫、卡通或插畫風嗎？', a: '可以。上傳照片並描述想要的風格，例如動漫頭像、童書插畫、水彩、3D 渲染、貼紙、海報或電影感概念藝術。' }, { q: '圖生圖適合產品照嗎？', a: '適合。它可用於產品背景替換、棚拍感電商照、節日行銷概念、廣告視覺、Mockup，以及同一產品參考圖的創意變體。' }, { q: '為什麼結果改變太多？', a: '提示詞可能沒有清楚說明要保留什麼。加入「保留相同姿勢」、「產品保持不變」或「保留房間布局與鏡頭角度」等保留指令。' }, { q: '好的圖生圖提示詞要包含什麼？', a: '好的提示詞包含三部分：要保留什麼、要改變什麼，以及最終圖片要呈現什麼效果。加入風格、光線、背景、顏色、鏡頭角度與用途細節。' }, { q: '生成圖片可以商用嗎？', a: '商業使用取決於來源圖片、你對上傳內容的權利、選擇的模型與用途。不要上傳你沒有權限使用的圖片，發布前也要檢查最終素材。' }, { q: '哪些圖片提示詞適合這個工具？', a: 'Toolaze 適合產品視覺、人像、社群圖片、設計概念與行銷草稿等實用創意流程。請使用安全且有權利的圖片與提示詞。' }, { q: '最好的 AI 圖生圖產生器是什麼？', a: '最好的圖生圖 AI 產生器應能保留重要參考細節，同時讓你控制風格、背景、光線與輸出格式。Toolaze 專注於實用圖片變體、創意編輯與 Prompt 引導流程。' }] },
    cta: { title: '建立你的下一張圖片變體', description: '上傳參考圖片，描述改變內容，並為產品、人像、室內、行銷活動、社群貼文與創意草稿生成新的視覺。', button: '開始生成' },
  },
  pt: {
    metadata: { title: 'Gerador de imagem para imagem com IA grátis online | Toolaze', description: 'Envie uma imagem de referência e descreva as mudanças desejadas. Crie variações de imagem com IA, fotos de produto, retratos, transferências de estilo, fundos e edições criativas online com Toolaze.' },
    breadcrumbs: { home: 'Início', aiTools: 'Ferramentas de IA', current: 'Gerador de imagem para imagem com IA' },
    hero: { highlight: 'Gerador de imagem para imagem com IA', description: 'Envie uma imagem de referência, descreva a edição desejada e gere um novo visual a partir dela. Use Toolaze para criar variações de imagem, fotos de produto, restyles de retrato, trocas de fundo, gráficos sociais, concept art e rascunhos criativos polidos a partir de uma imagem existente.', badges: ['Imagem de referência', 'Edições guiadas por prompt', 'Transferência de estilo', 'Troca de fundo'] },
    samples: [{ title: 'Exemplo de edição de produto guiada por referência' }, { title: 'Exemplo de variação de produto ecommerce' }, { title: 'Exemplo de restyle de retrato' }, { title: 'Exemplo de variação de imagem comercial' }],
    whatIs: { title: 'O que é um gerador de imagem para imagem com IA?', paragraphs: ['Um gerador de imagem para imagem com IA cria uma nova imagem a partir de uma imagem de referência existente. Em vez de começar só com texto, ele usa a imagem enviada para guiar o assunto, composição, pose, forma do produto, layout do ambiente ou direção visual.', 'Seu prompt controla o que muda, como estilo, fundo, iluminação, cores, cena ou uso final. Isso torna o image-to-image útil quando você quer um resultado novo mantendo partes importantes da imagem original reconhecíveis.'] },
    promise: { title: 'Crie novas imagens a partir de uma referência', text: 'Comece com uma imagem real e guie o resultado com linguagem simples. Mantenha as partes importantes reconhecíveis enquanto muda a direção visual.', cards: [{ title: 'Preserve o assunto principal', text: 'Mantenha reconhecível um produto, pessoa, objeto, ambiente, posição de logo ou composição enquanto gera uma versão mais limpa ou criativa.' }, { title: 'Mude o estilo com um prompt', text: 'Transforme uma foto em cena cinematográfica, foto de produto em estúdio, retrato anime, ilustração, pôster editorial, render 3D ou visual social.' }, { title: 'Substitua fundos', text: 'Leve um assunto para um novo cenário, crie um fundo de estúdio, teste cenas sazonais, remova poluição visual ou crie imagens prontas para ecommerce.' }, { title: 'Crie variações de imagem', text: 'Gere várias direções a partir de uma imagem de referência para comparar layouts, iluminação, cores, ângulos de câmera e tratamentos criativos.' }] },
    features: { title: 'Edite imagens com referência e prompt', text: 'Use geração image-to-image quando precisar de um resultado controlado a partir de um visual existente. Envie uma referência, descreva o que deve permanecer igual e guie o modelo para novo estilo, fundo, setup de produto ou direção criativa.', items: [{ title: 'Edição guiada por referência', text: 'Mantenha o assunto, produto, pose, layout ou composição reconhecíveis enquanto altera a imagem final com instruções em linguagem simples.', alt: 'Exemplo de edição IA imagem para imagem guiada por referência' }, { title: 'Variações de foto de produto', text: 'Transforme uma referência de produto em fotos de estúdio, imagens ecommerce, cenas lifestyle, conceitos sazonais e visuais prontos para campanha.', alt: 'Exemplo de variação de foto de produto IA imagem para imagem' }, { title: 'Substituição de fundo', text: 'Substitua o fundo original por uma cena mais limpa, setup de marca, ambiente interno, local externo, fundo de estúdio ou composição para redes sociais.', alt: 'Exemplo antes e depois de substituição de fundo IA imagem para imagem' }, { title: 'Transferência de estilo e restyle', text: 'Restyle uma foto como retrato editorial, avatar anime, ilustração em aquarela, render 3D, sticker, pôster ou conceito cinematográfico.', alt: 'Exemplo antes e depois de transferência de estilo IA imagem para imagem' }] },
    gallery: { title: 'Exemplos de imagem para imagem', text: 'Explore resultados práticos que você pode criar a partir de uma imagem de referência e um prompt focado.', examples: [{ title: 'Foto de produto em estúdio', text: 'Mantenha a mesma forma do produto e posição do rótulo enquanto cria um fundo de estúdio limpo com sombras suaves.', alt: 'Foto de produto IA imagem para imagem com fundo de estúdio limpo' }, { title: 'Anúncio sazonal de produto', text: 'Mantenha o produto inalterado e coloque-o em uma cena quente de campanha de fim de ano com styling premium de varejo.', alt: 'Variação IA de produto em cena de anúncio sazonal' }, { title: 'Retrato para editorial', text: 'Restyle um retrato como imagem de moda editorial com iluminação dramática e fundo limpo.', alt: 'Exemplo antes e depois de restyle de retrato IA' }, { title: 'Redesign de ambiente', text: 'Mantenha o layout e o ângulo da câmera enquanto testa novos móveis, materiais e direção de luz.', alt: 'Exemplo antes e depois de redesign de interiores IA' }, { title: 'Substituição de fundo', text: 'Mantenha assunto e pose inalterados enquanto substitui a cena original por um novo fundo polido.', alt: 'Exemplo antes e depois de substituição de fundo de retrato IA' }, { title: 'Render 3D de produto', text: 'Converta uma referência de produto em render de alta qualidade com materiais brilhantes e reflexos suaves de estúdio.', alt: 'Render 3D IA de produto a partir de imagem enviada' }, { title: 'Pôster para redes sociais', text: 'Use o assunto de referência como âncora visual para um pôster vertical marcante ou gráfico de campanha.', alt: 'Pôster social IA gerado a partir de imagem de referência' }, { title: 'Variação de concept art', text: 'Transforme uma direção visual inicial em uma cena, ambiente ou moodboard criativo mais polido.', alt: 'Variação de concept art IA gerada a partir de imagem de referência' }] },
    models: { title: 'Use o modelo certo para image-to-image', description: 'Escolha o modelo pela tarefa: edição de produto, retratos, transferência de estilo, controle de composição, aderência ao prompt ou saída de campanha polida.', cards: [{ title: 'GPT Image 2', text: 'Melhor para edições image-to-image estruturadas, visuais de produto, layouts legíveis, conceitos de pôster e rascunhos comerciais.', label: 'Testar GPT Image 2' }, { title: 'Nano Banana Pro', text: 'Melhor para variações polidas, retratos, fotos de produto, restyles criativos e resultados de alta qualidade baseados em referência.', label: 'Testar Nano Banana Pro' }, { title: 'Seedream 4.5', text: 'Melhor para cenas comerciais de produto, visuais de marca, conceitos ecommerce, layouts tipográficos e edição consistente com referências.', label: 'Testar Seedream 4.5' }], comparisonTitle: 'Guia de modelos image-to-image', headers: { model: 'Modelo', bestFor: 'Melhor para', output: 'Saída', references: 'Imagens de referência', textAndEditing: 'Texto e edição', watchouts: 'Atenção' }, rows: [{ model: 'GPT Image 2', bestFor: 'Edições de produto, pôsteres, variações com layout, rascunhos comerciais.', output: 'Suporta vários tamanhos de saída nas configurações de modelo do Toolaze.', references: 'Útil quando a imagem enviada deve guiar o assunto principal ou layout.', textAndEditing: 'Forte para edições guiadas por prompt, texto curto e composições estruturadas.', watchouts: 'Revise ortografia, rostos, mãos, logos e detalhes do produto antes de publicar.' }, { model: 'Nano Banana Pro', bestFor: 'Restyles de retrato, variações criativas polidas, fotos de produto, visuais de campanha.', output: 'Útil para rascunhos de imagem de alta qualidade e direções visuais refinadas.', references: 'Forte para manter identidade visual enquanto explora novos tratamentos.', textAndEditing: 'Bom para prompts complexos e variações criativas de imagem.', watchouts: 'Use instruções de preservação mais claras quando o assunto mudar demais.' }, { model: 'Seedream 4.5', bestFor: 'Cenas comerciais de produto, visuais de marca, conceitos ecommerce, imagens tipográficas.', output: 'Útil para workflows polidos de produto e marketing.', references: 'Boa opção para referências de estilo de marca e edições focadas em produto.', textAndEditing: 'Forte aderência ao prompt para rascunhos com aparência comercial.', watchouts: 'Os melhores resultados vêm de prompts específicos com uso final claro.' }] },
    modes: { title: 'Imagem para imagem vs texto para imagem', description: 'Escolha o fluxo certo conforme o nível de controle que você precisa a partir de um visual existente.', headers: { label: 'Fluxo', aiImageGenerator: 'Melhor para', textToImage: 'Entrada', imageToImage: 'Saída' }, rows: [{ label: 'Gerador de imagem para imagem com IA', aiImageGenerator: 'Criar variações controladas a partir de uma imagem existente', textToImage: 'Imagem de referência mais prompt', imageToImage: 'Nova imagem guiada pela referência enviada' }, { label: 'Gerador de texto para imagem', aiImageGenerator: 'Criar um visual novo do zero', textToImage: 'Apenas prompt', imageToImage: 'Imagem gerada com base na descrição textual' }, { label: 'Editor de fotos com IA', aiImageGenerator: 'Fazer correções pontuais ou edições simples', textToImage: 'Foto existente e instruções de edição', imageToImage: 'Versão editada da imagem original' }] },
    prompts: { title: 'Modelos de prompt imagem para imagem', text: 'Bons prompts dizem ao modelo o que manter, o que mudar e como a imagem final deve parecer.', copyButton: 'Copiar prompt', copiedButton: 'Copiado', examples: [{ title: 'Modelo de foto de produto', prompt: 'Mantenha a mesma forma do produto, cor, posição do logo e detalhes principais. Substitua o fundo por uma cena de estúdio limpa. Use sombras suaves, iluminação premium de ecommerce e aparência polida de fotografia de produto.', alt: 'Exemplo de prompt imagem para imagem de produto' }, { title: 'Modelo de restyle de retrato', prompt: 'Mantenha a mesma pessoa, estrutura facial, pose e expressão. Restyle a imagem como retrato editorial com fundo limpo, iluminação lateral dramática, tons de pele naturais e color grading de revista premium.', alt: 'Exemplo antes e depois de prompt imagem para imagem de retrato' }, { title: 'Modelo de design de interiores', prompt: 'Mantenha o mesmo layout do ambiente, janelas e ângulo da câmera. Redesenhe o espaço com móveis Japandi modernos, texturas de madeira quente, tecidos neutros, plantas internas e luz natural suave.', alt: 'Exemplo antes e depois de prompt imagem para imagem de interior' }, { title: 'Modelo de variação criativa', prompt: 'Use a imagem enviada como referência principal. Crie uma nova versão para campanha de redes sociais com composição ousada, cores modernas, espaço limpo para título e visual comercial polido.', alt: 'Exemplo de prompt criativo imagem para imagem' }] },
    howTo: { schemaName: 'Como usar o gerador de imagem para imagem com IA do Toolaze', title: 'Como usar o gerador de imagem para imagem com IA', description: 'Envie uma imagem de referência, descreva o que deve mudar e refine o resultado com instruções mais claras de preservação e estilo.', stepLabel: 'Etapa', steps: [{ title: 'Envie uma imagem de referência', text: 'Escolha a imagem que deseja transformar. A referência ajuda a guiar assunto, composição, pose, forma do produto ou direção visual.' }, { title: 'Descreva a edição', text: 'Escreva um prompt claro explicando o que deve mudar e o que deve permanecer igual. Adicione detalhes de estilo, fundo, iluminação e uso.' }, { title: 'Escolha configurações', text: 'Selecione modelo, proporção e qualidade que melhor combinam com sua variação de imagem ou workflow criativo.' }, { title: 'Gere a imagem', text: 'Crie sua nova imagem e compare com a referência original para verificar estabilidade do assunto, estilo e composição.' }, { title: 'Refine e baixe', text: 'Ajuste o prompt se quiser correspondência mais próxima, estilo mais forte, fundo mais limpo ou saída mais polida.' }] },
    useCases: { title: 'Ideias populares de imagem para imagem', description: 'Use image-to-image quando já tiver um ponto de partida visual e quiser uma nova versão sem reconstruir a imagem do zero.', cards: [{ title: 'Upgrade de foto de produto', text: 'Transforme uma imagem básica de produto em foto de estúdio limpa, visual de anúncio sazonal, imagem de listing ecommerce ou conceito de campanha premium.' }, { title: 'Restyle de retrato', text: 'Restyle um retrato com nova iluminação, direção de moda, fundo, estilo de ilustração, visual de avatar ou conceito de perfil.' }, { title: 'Troca de fundo', text: 'Mantenha o assunto e substitua a cena por fundo de estúdio, local externo, setup de marca, interior ou ambiente de campanha.' }, { title: 'Redesign de interiores', text: 'Envie uma foto de ambiente e teste novos móveis, paletas de cor, iluminação, materiais, arte de parede ou direções de decoração.' }, { title: 'Transferência de estilo', text: 'Converta uma referência em anime, aquarela, render 3D, fotografia editorial, cinema, esboço, sticker ou estilo de pôster.' }, { title: 'Criativo de marketing', text: 'Crie direções visuais para anúncios pagos, heroes de landing page, posts sociais, thumbnails, gráficos de lançamento e anúncios de produto.' }] },
    related: { title: 'Ferramentas de imagem com IA relacionadas', description: 'Continue seu fluxo de criação com ferramentas para geração, edição, melhoria e descoberta de prompts.', cards: [{ title: 'Gerador de imagens com IA', label: 'Gerar a partir de texto', text: 'Comece com um prompt de texto quando não tiver uma imagem de referência.' }, { title: 'Gerador GPT Image 2', label: 'Testar GPT Image 2', text: 'Crie gerações de imagem de alta qualidade e edições guiadas por referência com o fluxo GPT do Toolaze.' }, { title: 'Removedor de fundo', label: 'Remover fundo', text: 'Remova poluição visual antes de criar uma nova foto de produto, imagem de perfil ou recurso de design.' }, { title: 'Melhorador de imagem', label: 'Melhorar imagem', text: 'Melhore clareza, detalhe e acabamento depois de gerar ou editar uma imagem.' }, { title: 'Nano Banana Pro', label: 'Testar Nano Banana Pro', text: 'Explore outro modelo de imagem de alta qualidade para variações criativas e experimentos visuais.' }, { title: 'Seedream 4.5', label: 'Testar Seedream 4.5', text: 'Crie imagens comerciais de produto, designs tipográficos e rascunhos de marketing baseados em referência.' }] },
    faq: { title: 'FAQ do gerador de imagem para imagem com IA', description: 'Respostas sobre imagens de referência, prompts, formatos, uso gratuito e workflows práticos de image-to-image.', items: [{ q: 'O que é um gerador de imagem para imagem com IA?', a: 'É uma ferramenta que cria uma nova imagem a partir de uma referência enviada e um prompt de texto. A referência guia assunto, composição, pose ou estrutura visual; o prompt controla estilo, fundo, iluminação e edições.' }, { q: 'Como image-to-image difere de text-to-image?', a: 'Text-to-image começa apenas com um prompt. Image-to-image começa com uma referência, então é melhor quando você quer manter produto, pessoa, layout, objeto ou composição reconhecíveis.' }, { q: 'Posso usar o gerador de imagem para imagem com IA grátis?', a: 'O uso gratuito pode variar por cota, modelo selecionado e configurações de qualidade. Verifique os controles do gerador para a disponibilidade atual antes de iniciar uma nova imagem.' }, { q: 'Quais formatos posso enviar?', a: 'As ferramentas de imagem do Toolaze normalmente suportam formatos web padrão como JPG, PNG e WEBP. Use uma imagem clara e bem iluminada para melhores resultados.' }, { q: 'Como manter a mesma pessoa ou produto?', a: 'Diga exatamente o que deve permanecer igual. Por exemplo: “mantenha o mesmo rosto, pose, cabelo e expressão” ou “mantenha a mesma forma do produto, posição do rótulo e cor”.' }, { q: 'Posso mudar apenas o fundo?', a: 'Sim. Envie a imagem e escreva um prompt dizendo qual assunto deve permanecer inalterado e qual fundo deve substituir a cena original.' }, { q: 'Posso transformar uma foto em anime, cartoon ou ilustração?', a: 'Sim. Envie a foto e descreva o estilo desejado, como avatar anime, ilustração infantil, aquarela, render 3D, sticker, pôster ou concept art cinematográfica.' }, { q: 'Image-to-image é útil para fotos de produto?', a: 'Sim. É útil para troca de fundo de produto, fotos ecommerce em estúdio, conceitos sazonais de campanha, visuais de anúncio, mockups e variações criativas da mesma referência.' }, { q: 'Por que o resultado mudou demais?', a: 'O prompt talvez não explique claramente o que deve ficar igual. Adicione instruções como “mantenha a mesma pose”, “mantenha o produto inalterado” ou “mantenha layout e ângulo da câmera”.' }, { q: 'O que torna um prompt image-to-image bom?', a: 'Um bom prompt inclui três partes: o que manter, o que mudar e como a imagem final deve parecer. Adicione estilo, iluminação, fundo, cores, ângulo de câmera e uso.' }, { q: 'Posso usar imagens geradas comercialmente?', a: 'O uso comercial depende da imagem de origem, seus direitos sobre o conteúdo enviado, o modelo escolhido e o caso de uso. Não envie imagens sem permissão e revise os assets finais antes de publicar.' }, { q: 'Quais prompts de imagem combinam com esta ferramenta?', a: 'Toolaze foi feito para workflows criativos práticos como visuais de produto, retratos, gráficos sociais, conceitos de design e rascunhos de marketing. Use imagens seguras e com direitos claros.' }, { q: 'Qual é o melhor gerador AI image-to-image?', a: 'O melhor mantém detalhes importantes da referência reconhecíveis e oferece controle sobre estilo, fundo, iluminação e formato de saída. Toolaze foca variações práticas, edições criativas e workflows guiados por prompt.' }] },
    cta: { title: 'Crie sua próxima variação de imagem', description: 'Envie uma imagem de referência, descreva a mudança e gere um novo visual para produtos, retratos, interiores, campanhas, posts sociais e rascunhos criativos.', button: 'Começar a gerar' },
  },
  fr: {
    metadata: { title: 'Générateur IA image vers image gratuit en ligne | Toolaze', description: 'Importez une image de référence et décrivez les changements souhaités. Créez avec Toolaze des variations d’images IA, photos produit, portraits, transferts de style, arrière-plans et retouches créatives.' },
    breadcrumbs: { home: 'Accueil', aiTools: 'Outils IA', current: 'Générateur IA image vers image' },
    hero: { highlight: 'Générateur IA image vers image', description: 'Importez une image de référence, décrivez la retouche voulue et générez un nouveau visuel à partir de celle-ci. Utilisez Toolaze pour créer des variations d’image, photos produit, portraits relookés, changements d’arrière-plan, visuels sociaux, concept art et maquettes créatives soignées depuis une image existante.', badges: ['Image de référence', 'Retouches guidées par prompt', 'Transfert de style', 'Changement d’arrière-plan'] },
    samples: [{ title: 'Exemple de retouche produit guidée par référence' }, { title: 'Exemple de variation produit ecommerce' }, { title: 'Exemple de relooking de portrait' }, { title: 'Exemple de variation d’image commerciale' }],
    whatIs: { title: 'Qu’est-ce qu’un générateur IA image vers image ?', paragraphs: ['Un générateur IA image vers image crée une nouvelle image à partir d’une image de référence existante. Au lieu de partir uniquement d’un texte, il utilise l’image importée pour guider le sujet, la composition, la pose, la forme du produit, l’agencement d’une pièce ou la direction visuelle.', 'Votre prompt contrôle ce qui change, comme le style, l’arrière-plan, la lumière, les couleurs, la scène ou l’usage final. La génération image vers image est utile lorsque vous voulez un résultat nouveau tout en gardant reconnaissables les éléments importants de l’image source.'] },
    promise: { title: 'Créez de nouvelles images à partir d’une référence', text: 'Commencez avec une image réelle et guidez le résultat en langage simple. Gardez les éléments importants reconnaissables tout en changeant la direction visuelle.', cards: [{ title: 'Préserver le sujet principal', text: 'Conservez un produit, une personne, un objet, une pièce, l’emplacement d’un logo ou une composition reconnaissable tout en générant une version plus propre ou plus créative.' }, { title: 'Changer le style avec un prompt', text: 'Transformez une photo en scène cinématographique, photo produit en studio, portrait anime, illustration, affiche éditoriale, rendu 3D ou visuel pour réseaux sociaux.' }, { title: 'Remplacer les arrière-plans', text: 'Placez un sujet dans un nouveau décor, créez un fond studio, testez des scènes saisonnières, supprimez le désordre visuel ou préparez des images ecommerce.' }, { title: 'Créer des variations d’image', text: 'Générez plusieurs directions à partir d’une image de référence pour comparer les mises en page, lumières, couleurs, angles de caméra et traitements créatifs.' }] },
    features: { title: 'Modifiez des images avec une référence et un prompt', text: 'Utilisez la génération image vers image lorsque vous avez besoin d’un résultat contrôlé depuis un visuel existant. Importez une référence, indiquez ce qui doit rester identique, puis guidez le modèle vers un nouveau style, arrière-plan, décor produit ou axe créatif.', items: [{ title: 'Retouche guidée par référence', text: 'Gardez le sujet principal, le produit, la pose, la mise en page ou la composition reconnaissable tout en modifiant l’image finale avec des consignes en langage simple.', alt: 'Exemple de retouche IA image vers image guidée par référence' }, { title: 'Variations de photos produit', text: 'Transformez une référence produit en photos studio, images ecommerce, scènes lifestyle, concepts saisonniers et visuels produit prêts pour une campagne.', alt: 'Exemple de variation de photo produit IA image vers image' }, { title: 'Remplacement d’arrière-plan', text: 'Remplacez l’arrière-plan d’origine par une scène plus nette, un décor de marque, un intérieur, un lieu extérieur, un fond studio ou une composition pour réseaux sociaux.', alt: 'Exemple avant-après de remplacement d’arrière-plan IA image vers image' }, { title: 'Transfert de style et relooking', text: 'Relookez une photo en portrait éditorial, avatar anime, illustration aquarelle, rendu 3D, sticker, affiche ou concept cinématographique.', alt: 'Exemple avant-après de transfert de style IA image vers image' }] },
    gallery: { title: 'Exemples image vers image', text: 'Explorez des résultats pratiques que vous pouvez créer avec une image de référence et un prompt précis.', examples: [{ title: 'Photo produit en studio', text: 'Conservez la même forme de produit et le même placement d’étiquette tout en créant un fond studio net avec des ombres douces.', alt: 'Photo produit IA image vers image avec fond studio propre' }, { title: 'Publicité produit saisonnière', text: 'Gardez le produit inchangé et placez-le dans une scène de campagne chaleureuse avec un stylisme retail premium.', alt: 'Variation IA d’un produit dans une scène publicitaire saisonnière' }, { title: 'Portrait vers éditorial', text: 'Relookez un portrait en image de mode éditoriale avec une lumière dramatique et un fond épuré.', alt: 'Exemple avant-après de relooking de portrait IA' }, { title: 'Réaménagement intérieur', text: 'Conservez l’agencement et l’angle de caméra de la pièce tout en testant de nouveaux meubles, matériaux et éclairages.', alt: 'Exemple avant-après de réaménagement intérieur IA' }, { title: 'Remplacement d’arrière-plan', text: 'Gardez le sujet et la pose inchangés tout en remplaçant la scène d’origine par un nouvel arrière-plan soigné.', alt: 'Exemple avant-après de remplacement d’arrière-plan de portrait IA' }, { title: 'Rendu produit 3D', text: 'Convertissez une référence produit en rendu de haute qualité avec matériaux brillants et reflets studio doux.', alt: 'Rendu produit 3D IA à partir d’une image produit importée' }, { title: 'Affiche pour réseaux sociaux', text: 'Utilisez le sujet de référence comme ancrage visuel pour une affiche verticale forte ou un graphique de campagne.', alt: 'Affiche sociale IA générée à partir d’une image de référence' }, { title: 'Variation de concept art', text: 'Transformez une direction visuelle brute en scène, environnement ou moodboard créatif plus abouti.', alt: 'Variation de concept art IA générée à partir d’une image de référence' }] },
    models: { title: 'Choisir le bon modèle pour l’image vers image', description: 'Choisissez un modèle selon la tâche : retouches produit, portraits, transfert de style, contrôle de composition, respect du prompt ou rendu de campagne soigné.', cards: [{ title: 'GPT Image 2', text: 'Idéal pour les retouches image vers image structurées, visuels produit, mises en page lisibles, concepts d’affiche et maquettes créatives commerciales.', label: 'Essayer GPT Image 2' }, { title: 'Nano Banana Pro', text: 'Idéal pour les variations soignées, portraits, photos produit, relookings créatifs et sorties de haute qualité basées sur une référence.', label: 'Essayer Nano Banana Pro' }, { title: 'Seedream 4.5', text: 'Idéal pour les scènes produit commerciales, visuels de marque, concepts ecommerce, mises en page typographiques et retouches cohérentes avec référence.', label: 'Essayer Seedream 4.5' }], comparisonTitle: 'Guide des modèles image vers image', headers: { model: 'Modèle', bestFor: 'Idéal pour', output: 'Sortie', references: 'Images de référence', textAndEditing: 'Texte et retouche', watchouts: 'Points à vérifier' }, rows: [{ model: 'GPT Image 2', bestFor: 'Retouches produit, affiches, variations sensibles à la mise en page, maquettes commerciales.', output: 'Prend en charge plusieurs tailles de sortie via les réglages de modèle Toolaze.', references: 'Utile lorsque l’image importée doit guider le sujet principal ou la mise en page.', textAndEditing: 'Fort pour les retouches guidées par prompt, les textes courts et les compositions structurées.', watchouts: 'Vérifiez l’orthographe, les visages, les mains, les logos et les détails produit avant publication.' }, { model: 'Nano Banana Pro', bestFor: 'Relookings de portrait, variations créatives soignées, photos produit, visuels de campagne.', output: 'Utile pour des brouillons d’image de haute qualité et des directions visuelles affinées.', references: 'Fort pour conserver l’identité visuelle tout en explorant de nouveaux traitements.', textAndEditing: 'Adapté aux prompts complexes et aux variations d’image créatives.', watchouts: 'Ajoutez des consignes de préservation plus claires si le sujet change trop.' }, { model: 'Seedream 4.5', bestFor: 'Scènes produit commerciales, visuels de marque, concepts ecommerce, images typographiques.', output: 'Utile pour des workflows produit et marketing plus soignés.', references: 'Bon choix pour les références de style de marque et les retouches centrées produit.', textAndEditing: 'Bonne adhérence au prompt pour des brouillons à rendu commercial.', watchouts: 'Les meilleurs résultats viennent de prompts précis avec un usage final clair.' }] },
    modes: { title: 'Image vers image ou texte vers image', description: 'Choisissez le bon workflow selon le contrôle dont vous avez besoin depuis un visuel existant.', headers: { label: 'Flux', aiImageGenerator: 'Idéal pour', textToImage: 'Entrée', imageToImage: 'Sortie' }, rows: [{ label: 'Générateur IA image vers image', aiImageGenerator: 'Créer des variations contrôlées depuis une image existante', textToImage: 'Image de référence plus prompt', imageToImage: 'Nouvelle image guidée par la référence importée' }, { label: 'Générateur texte vers image', aiImageGenerator: 'Créer un nouveau visuel à partir de zéro', textToImage: 'Prompt uniquement', imageToImage: 'Image générée à partir de la description textuelle' }, { label: 'Éditeur photo IA', aiImageGenerator: 'Effectuer des corrections ciblées ou des retouches simples', textToImage: 'Photo existante et consignes de retouche', imageToImage: 'Version retouchée de l’image d’origine' }] },
    prompts: { title: 'Modèles de prompts image vers image', text: 'Un bon prompt indique au modèle ce qu’il doit conserver, ce qu’il doit changer et l’apparence finale souhaitée.', copyButton: 'Copier le prompt', copiedButton: 'Copié', examples: [{ title: 'Modèle photo produit', prompt: 'Conservez la même forme de produit, la même couleur, le même placement de logo et les détails principaux. Remplacez l’arrière-plan par une scène studio propre. Utilisez des ombres douces, un éclairage ecommerce premium et un rendu de photographie produit soigné.', alt: 'Exemple de prompt image vers image pour produit' }, { title: 'Modèle relooking de portrait', prompt: 'Conservez la même personne, la structure du visage, la pose et l’expression. Relookez l’image en portrait éditorial avec fond propre, lumière latérale dramatique, tons de peau naturels et étalonnage couleur haut de gamme.', alt: 'Exemple avant-après de prompt image vers image pour portrait' }, { title: 'Modèle design intérieur', prompt: 'Conservez le même agencement de pièce, les fenêtres et l’angle de caméra. Réaménagez l’espace avec des meubles Japandi modernes, des textures bois chaleureuses, des tissus neutres, des plantes d’intérieur et une lumière naturelle douce.', alt: 'Exemple avant-après de prompt image vers image pour intérieur' }, { title: 'Modèle variation créative', prompt: 'Utilisez l’image importée comme référence principale. Créez une nouvelle version pour une campagne social media avec composition audacieuse, couleurs modernes, espace propre pour un titre et rendu commercial soigné.', alt: 'Exemple de prompt créatif image vers image' }] },
    howTo: { schemaName: 'Comment utiliser le générateur IA image vers image de Toolaze', title: 'Comment utiliser le générateur IA image vers image', description: 'Importez une image de référence, décrivez ce qui doit changer, puis affinez le résultat avec des consignes de préservation et de style plus claires.', stepLabel: 'Étape', steps: [{ title: 'Importer une image de référence', text: 'Choisissez l’image à transformer. La référence aide à guider le sujet, la composition, la pose, la forme du produit ou la direction visuelle.' }, { title: 'Décrire la retouche', text: 'Rédigez un prompt clair expliquant ce qui doit changer et ce qui doit rester identique. Ajoutez des détails de style, d’arrière-plan, de lumière et d’usage.' }, { title: 'Choisir les réglages', text: 'Sélectionnez le modèle, le ratio et la qualité adaptés à votre variation d’image ou workflow créatif.' }, { title: 'Générer l’image', text: 'Créez votre nouvelle image et comparez-la à la référence d’origine pour vérifier la stabilité du sujet, le style et la composition.' }, { title: 'Affiner et télécharger', text: 'Ajustez le prompt si vous voulez une correspondance plus proche, un style plus marqué, un fond plus net ou une sortie plus soignée.' }] },
    useCases: { title: 'Idées populaires image vers image', description: 'Utilisez l’image vers image lorsque vous avez déjà un point de départ visuel et voulez une nouvelle version sans reconstruire l’image depuis zéro.', cards: [{ title: 'Amélioration photo produit', text: 'Transformez une image produit simple en photo studio propre, visuel publicitaire saisonnier, image ecommerce ou concept de campagne premium.' }, { title: 'Relooking de portrait', text: 'Relookez un portrait avec une nouvelle lumière, direction mode, arrière-plan, style d’illustration, rendu avatar ou concept d’image de profil.' }, { title: 'Changement d’arrière-plan', text: 'Gardez le sujet et remplacez la scène par un fond studio, un lieu extérieur, un décor de marque, un intérieur ou un environnement de campagne.' }, { title: 'Réaménagement intérieur', text: 'Importez une photo de pièce et testez de nouveaux meubles, palettes de couleurs, lumières, matériaux, œuvres murales ou directions décoratives.' }, { title: 'Transfert de style', text: 'Convertissez une référence en anime, aquarelle, rendu 3D, photographie éditoriale, style cinéma, croquis, sticker ou affiche.' }, { title: 'Créatif marketing', text: 'Créez des directions visuelles pour publicités payantes, héros de landing page, posts sociaux, miniatures, visuels de lancement et annonces produit.' }] },
    related: { title: 'Outils IA d’image associés', description: 'Poursuivez votre flux de création avec des outils de génération, retouche, amélioration et découverte de prompts.', cards: [{ title: 'Générateur d’images IA', label: 'Générer depuis du texte', text: 'Commencez par un prompt texte lorsque vous n’avez pas d’image de référence.' }, { title: 'Générateur GPT Image 2', label: 'Essayer GPT Image 2', text: 'Créez des générations d’image de haute qualité et des retouches guidées par référence avec le flux GPT de Toolaze.' }, { title: 'Suppresseur d’arrière-plan', label: 'Supprimer le fond', text: 'Retirez le désordre visuel avant de créer une nouvelle photo produit, image de profil ou ressource design.' }, { title: 'Améliorateur d’image', label: 'Améliorer l’image', text: 'Améliorez la netteté, les détails et la finition après génération ou retouche d’une image.' }, { title: 'Nano Banana Pro', label: 'Essayer Nano Banana Pro', text: 'Explorez un autre modèle d’image de haute qualité pour les variations créatives et les essais visuels.' }, { title: 'Seedream 4.5', label: 'Essayer Seedream 4.5', text: 'Créez des visuels produit commerciaux, designs typographiques et brouillons marketing basés sur une référence.' }] },
    faq: { title: 'FAQ du générateur IA image vers image', description: 'Réponses aux questions courantes sur les images de référence, prompts, formats, usage gratuit et workflows pratiques image vers image.', items: [{ q: 'Qu’est-ce qu’un générateur IA image vers image ?', a: 'C’est un outil qui crée une nouvelle image à partir d’une référence importée et d’un prompt texte. La référence guide le sujet, la composition, la pose ou la structure visuelle, tandis que le prompt contrôle le style, l’arrière-plan, la lumière et les retouches.' }, { q: 'Quelle différence avec le texte vers image ?', a: 'Le texte vers image part uniquement d’un prompt. L’image vers image part d’une référence, donc c’est mieux lorsque vous voulez garder reconnaissable un produit, une personne, une mise en page, un objet ou une composition.' }, { q: 'Puis-je utiliser le générateur IA image vers image gratuitement ?', a: 'L’usage gratuit peut varier selon le quota, le modèle choisi et les réglages de qualité. Vérifiez les contrôles du générateur pour connaître la disponibilité actuelle avant de lancer une nouvelle image.' }, { q: 'Quels formats d’image puis-je importer ?', a: 'Les outils image de Toolaze prennent généralement en charge les formats web standards comme JPG, PNG et WEBP. Utilisez une image source nette et bien éclairée pour de meilleurs résultats.' }, { q: 'Comment garder la même personne ou le même produit ?', a: 'Indiquez précisément ce qui doit rester identique. Par exemple : « garder le même visage, la même pose, la même coiffure et expression » ou « garder la même forme de produit, la position de l’étiquette et la couleur ».' }, { q: 'Puis-je changer uniquement l’arrière-plan ?', a: 'Oui. Importez votre image et écrivez un prompt indiquant quel sujet doit rester inchangé et quel arrière-plan doit remplacer la scène d’origine.' }, { q: 'Puis-je transformer une photo en anime, cartoon ou illustration ?', a: 'Oui. Importez la photo et décrivez le style souhaité, comme avatar anime, illustration jeunesse, aquarelle, rendu 3D, sticker, affiche ou concept art cinématographique.' }, { q: 'L’image vers image est-elle utile pour les photos produit ?', a: 'Oui. Elle est utile pour les changements de fond produit, photos ecommerce façon studio, concepts saisonniers de campagne, visuels publicitaires, mockups et variations créatives d’une même référence.' }, { q: 'Pourquoi le résultat a-t-il trop changé ?', a: 'Le prompt n’explique peut-être pas clairement ce qui doit rester identique. Ajoutez des consignes comme « garder la même pose », « garder le produit inchangé » ou « garder l’agencement et l’angle de caméra ».' }, { q: 'Qu’est-ce qu’un bon prompt image vers image ?', a: 'Un bon prompt contient trois parties : ce qu’il faut garder, ce qu’il faut changer et l’apparence finale souhaitée. Ajoutez le style, la lumière, l’arrière-plan, les couleurs, l’angle de caméra et l’usage.' }, { q: 'Puis-je utiliser commercialement les images générées ?', a: 'L’usage commercial dépend de l’image source, de vos droits sur le contenu importé, du modèle choisi et de votre cas d’usage. N’importez pas d’images sans autorisation et vérifiez les ressources finales avant publication.' }, { q: 'Quels prompts conviennent à cet outil ?', a: 'Toolaze est conçu pour des workflows créatifs pratiques comme les visuels produit, portraits, graphiques sociaux, concepts design et brouillons marketing. Utilisez des images sûres et dont les droits sont clairs.' }, { q: 'Quel est le meilleur générateur IA image vers image ?', a: 'Le meilleur générateur garde reconnaissables les détails importants de la référence tout en donnant du contrôle sur le style, l’arrière-plan, la lumière et le format de sortie. Toolaze se concentre sur les variations pratiques, les retouches créatives et les workflows guidés par prompt.' }] },
    cta: { title: 'Créez votre prochaine variation d’image', description: 'Importez une image de référence, décrivez le changement et générez un nouveau visuel pour produits, portraits, intérieurs, campagnes, posts sociaux et brouillons créatifs.', button: 'Commencer à générer' },
  },
  ko: {
    metadata: { title: 'AI 이미지 투 이미지 생성기 무료 온라인 | Toolaze', description: '참조 이미지를 업로드하고 원하는 변경 사항을 설명하세요. Toolaze에서 AI 이미지 변형, 제품 사진, 인물 사진, 스타일 변환, 배경 변경, 창의적인 편집 이미지를 온라인으로 만들 수 있습니다.' },
    breadcrumbs: { home: '홈', aiTools: 'AI 도구', current: 'AI 이미지 투 이미지 생성기' },
    hero: { highlight: 'AI 이미지 투 이미지 생성기', description: '참조 이미지를 업로드하고 원하는 편집 내용을 설명한 뒤, 그 이미지를 바탕으로 새로운 비주얼을 생성하세요. Toolaze로 기존 이미지에서 이미지 변형, 제품 사진, 인물 리스타일, 배경 변경, 소셜 그래픽, 콘셉트 아트, 완성도 높은 크리에이티브 초안을 만들 수 있습니다.', badges: ['참조 이미지', '프롬프트 기반 편집', '스타일 변환', '배경 교체'] },
    samples: [{ title: '참조 기반 제품 편집 예시' }, { title: '이커머스 제품 변형 예시' }, { title: '인물 리스타일 예시' }, { title: '상업용 이미지 변형 예시' }],
    whatIs: { title: 'AI 이미지 투 이미지 생성기란?', paragraphs: ['AI 이미지 투 이미지 생성기는 기존 참조 이미지에서 새로운 이미지를 만드는 도구입니다. 텍스트만으로 시작하는 대신 업로드한 이미지를 사용해 피사체, 구도, 포즈, 제품 형태, 공간 배치 또는 시각적 방향을 안내합니다.', '프롬프트는 스타일, 배경, 조명, 색상, 장면, 최종 용도처럼 무엇을 바꿀지 제어합니다. 그래서 원본 이미지의 중요한 부분은 알아볼 수 있게 유지하면서 새로운 결과가 필요할 때 유용합니다.'] },
    promise: { title: '참조 이미지에서 새 이미지 만들기', text: '실제 이미지를 시작점으로 삼고 쉬운 문장으로 결과를 안내하세요. 중요한 요소는 알아볼 수 있게 유지하면서 시각적 방향을 바꿀 수 있습니다.', cards: [{ title: '주요 피사체 유지', text: '제품, 인물, 사물, 방, 로고 위치 또는 구도를 알아볼 수 있게 유지하면서 더 깔끔하거나 창의적인 버전을 생성합니다.' }, { title: '프롬프트로 스타일 변경', text: '사진을 영화 같은 장면, 스튜디오 제품 이미지, 애니메이션풍 인물, 일러스트, 에디토리얼 포스터, 3D 렌더, 소셜 미디어 비주얼로 바꿀 수 있습니다.' }, { title: '배경 교체', text: '피사체를 새 환경에 배치하고, 스튜디오 배경을 만들고, 시즌 장면을 테스트하고, 시각적 잡음을 줄이거나 이커머스용 이미지를 만들 수 있습니다.' }, { title: '이미지 변형 생성', text: '하나의 참조 이미지에서 여러 방향을 생성해 레이아웃, 조명, 색상, 카메라 각도, 창의적 표현을 비교합니다.' }] },
    features: { title: '참조 이미지와 프롬프트로 이미지 편집', text: '기존 비주얼에서 제어된 결과가 필요할 때 이미지 투 이미지 생성을 사용하세요. 참조를 업로드하고 무엇을 유지할지 설명한 뒤, 모델을 새로운 스타일, 배경, 제품 세팅 또는 창의적 방향으로 안내합니다.', items: [{ title: '참조 기반 편집', text: '주요 피사체, 제품, 포즈, 레이아웃 또는 구도를 알아볼 수 있게 유지하면서 자연어 지시로 최종 이미지를 바꿉니다.', alt: '참조 기반 AI 이미지 투 이미지 편집 예시' }, { title: '제품 사진 변형', text: '하나의 제품 참조를 스튜디오 컷, 이커머스 이미지, 라이프스타일 장면, 시즌 콘셉트, 캠페인용 제품 비주얼로 바꿉니다.', alt: 'AI 이미지 투 이미지 제품 사진 변형 예시' }, { title: '배경 교체', text: '원래 배경을 더 깔끔한 장면, 브랜드 세팅, 실내 공간, 야외 장소, 스튜디오 배경 또는 소셜 미디어 구성으로 교체합니다.', alt: 'AI 이미지 투 이미지 배경 교체 전후 예시' }, { title: '스타일 변환과 리스타일', text: '사진을 에디토리얼 인물, 애니메이션 아바타, 수채화 일러스트, 3D 렌더, 스티커, 포스터 또는 영화 콘셉트로 리스타일합니다.', alt: 'AI 이미지 투 이미지 스타일 변환 전후 예시' }] },
    gallery: { title: '이미지 투 이미지 예시', text: '참조 이미지와 집중된 프롬프트로 만들 수 있는 실용적인 결과를 살펴보세요.', examples: [{ title: '스튜디오 제품 사진', text: '같은 제품 형태와 라벨 위치를 유지하면서 부드러운 그림자가 있는 깔끔한 스튜디오 배경을 만듭니다.', alt: '깔끔한 스튜디오 배경의 AI 이미지 투 이미지 제품 사진' }, { title: '시즌 제품 광고', text: '제품은 바꾸지 않고 프리미엄 리테일 스타일의 따뜻한 홀리데이 캠페인 장면에 배치합니다.', alt: '시즌 광고 장면 속 제품 AI 이미지 변형' }, { title: '인물 사진을 에디토리얼로', text: '인물 사진을 드라마틱한 조명과 깔끔한 배경의 패션 에디토리얼 이미지로 리스타일합니다.', alt: 'AI 인물 리스타일 전후 예시' }, { title: '공간 리디자인', text: '방의 배치와 카메라 각도를 유지하면서 새로운 가구, 소재, 조명 방향을 테스트합니다.', alt: 'AI 인테리어 리디자인 전후 예시' }, { title: '배경 교체', text: '피사체와 포즈를 그대로 유지하면서 원래 장면을 완성도 높은 새 배경으로 바꿉니다.', alt: 'AI 인물 배경 교체 전후 예시' }, { title: '3D 제품 렌더', text: '제품 참조를 광택 소재와 부드러운 스튜디오 반사가 있는 고품질 렌더로 변환합니다.', alt: '업로드한 제품 이미지 기반 AI 3D 제품 렌더' }, { title: '소셜 미디어 포스터', text: '참조 피사체를 시각적 중심으로 사용해 강한 세로형 포스터 또는 캠페인 그래픽을 만듭니다.', alt: '참조 이미지에서 생성한 AI 소셜 미디어 포스터' }, { title: '콘셉트 아트 변형', text: '거친 시각 방향을 더 완성도 높은 장면, 환경 또는 창의적인 무드보드로 발전시킵니다.', alt: '참조 이미지에서 생성한 AI 콘셉트 아트 변형' }] },
    models: { title: '이미지 투 이미지에 맞는 모델 선택', description: '제품 편집, 인물, 스타일 변환, 구도 제어, 프롬프트 반영, 완성도 높은 캠페인 결과 등 작업에 맞춰 모델을 선택하세요.', cards: [{ title: 'GPT Image 2', text: '구조적인 이미지 투 이미지 편집, 제품 비주얼, 읽기 쉬운 레이아웃, 포스터 콘셉트, 상업용 크리에이티브 초안에 적합합니다.', label: 'GPT Image 2 사용하기' }, { title: 'Nano Banana Pro', text: '완성도 높은 이미지 변형, 인물, 제품 사진, 창의적 리스타일, 참조 기반 고품질 결과에 적합합니다.', label: 'Nano Banana Pro 사용하기' }, { title: 'Seedream 4.5', text: '상업용 제품 장면, 브랜드 비주얼, 이커머스 콘셉트, 타이포그래피 중심 레이아웃, 일관된 참조 편집에 적합합니다.', label: 'Seedream 4.5 사용하기' }], comparisonTitle: '이미지 투 이미지 모델 가이드', headers: { model: '모델', bestFor: '추천 용도', output: '출력', references: '참조 이미지', textAndEditing: '텍스트와 편집', watchouts: '확인할 점' }, rows: [{ model: 'GPT Image 2', bestFor: '제품 편집, 포스터, 레이아웃을 고려한 이미지 변형, 상업용 초안.', output: 'Toolaze 모델 설정에서 여러 출력 크기를 지원합니다.', references: '업로드 이미지가 주요 피사체나 레이아웃을 안내해야 할 때 유용합니다.', textAndEditing: '프롬프트 기반 편집, 짧은 텍스트, 구조적인 구도에 강합니다.', watchouts: '게시 전 철자, 얼굴, 손, 로고, 제품 디테일을 확인하세요.' }, { model: 'Nano Banana Pro', bestFor: '인물 리스타일, 완성도 높은 창의적 변형, 제품 사진, 캠페인 비주얼.', output: '고품질 이미지 초안과 정제된 시각 방향에 유용합니다.', references: '시각적 정체성을 유지하면서 새로운 표현을 탐색하는 데 강합니다.', textAndEditing: '복잡한 프롬프트와 창의적인 이미지 변형에 좋습니다.', watchouts: '피사체가 너무 많이 바뀌면 보존 지시를 더 명확히 작성하세요.' }, { model: 'Seedream 4.5', bestFor: '상업용 제품 장면, 브랜드 비주얼, 이커머스 콘셉트, 타이포그래피 이미지.', output: '제품과 마케팅 워크플로를 더 완성도 있게 만드는 데 유용합니다.', references: '브랜드 스타일 참조와 제품 중심 편집에 잘 맞습니다.', textAndEditing: '상업적인 느낌의 이미지 초안에서 프롬프트 반영이 강합니다.', watchouts: '명확한 최종 용도가 담긴 구체적인 프롬프트가 가장 좋은 결과를 만듭니다.' }] },
    modes: { title: '이미지 투 이미지와 텍스트 투 이미지', description: '기존 비주얼에서 얼마나 많은 제어가 필요한지에 따라 적절한 워크플로를 선택하세요.', headers: { label: '워크플로', aiImageGenerator: '추천 용도', textToImage: '입력', imageToImage: '출력' }, rows: [{ label: 'AI 이미지 투 이미지 생성기', aiImageGenerator: '기존 이미지에서 제어된 변형 만들기', textToImage: '참조 이미지와 프롬프트', imageToImage: '업로드한 참조가 안내하는 새 이미지' }, { label: '텍스트 투 이미지 생성기', aiImageGenerator: '처음부터 새 비주얼 만들기', textToImage: '프롬프트만 사용', imageToImage: '텍스트 설명을 기반으로 생성된 이미지' }, { label: 'AI 사진 편집기', aiImageGenerator: '대상 수정 또는 간단한 편집', textToImage: '기존 사진과 편집 지시', imageToImage: '원본 이미지를 편집한 버전' }] },
    prompts: { title: '이미지 투 이미지 프롬프트 템플릿', text: '좋은 프롬프트는 무엇을 유지하고, 무엇을 바꾸며, 최종 이미지가 어떤 느낌이어야 하는지 알려줍니다.', copyButton: '프롬프트 복사', copiedButton: '복사됨', examples: [{ title: '제품 사진 템플릿', prompt: '같은 제품 형태, 색상, 로고 위치, 핵심 디테일을 유지하세요. 배경을 깔끔한 스튜디오 장면으로 바꾸고, 부드러운 그림자, 프리미엄 이커머스 조명, 완성도 높은 제품 사진 느낌을 사용하세요.', alt: '제품 이미지 투 이미지 프롬프트 예시' }, { title: '인물 리스타일 템플릿', prompt: '같은 인물, 얼굴 구조, 포즈, 표정을 유지하세요. 깔끔한 배경, 드라마틱한 측면 조명, 자연스러운 피부 톤, 고급 매거진 컬러 그레이딩이 있는 에디토리얼 인물 사진으로 리스타일하세요.', alt: '인물 이미지 투 이미지 전후 프롬프트 예시' }, { title: '인테리어 디자인 템플릿', prompt: '같은 방 배치, 창문, 카메라 각도를 유지하세요. 모던 재팬디 가구, 따뜻한 목재 질감, 뉴트럴 패브릭, 실내 식물, 부드러운 자연광으로 공간을 리디자인하세요.', alt: '인테리어 이미지 투 이미지 전후 프롬프트 예시' }, { title: '크리에이티브 변형 템플릿', prompt: '업로드한 이미지를 주요 참조로 사용하세요. 대담한 구성, 현대적인 색상, 제목 텍스트를 위한 깔끔한 여백, 완성도 높은 상업적 느낌을 가진 소셜 미디어 캠페인용 새 버전을 만드세요.', alt: '창의적 이미지 투 이미지 프롬프트 예시' }] },
    howTo: { schemaName: 'Toolaze AI 이미지 투 이미지 생성기 사용 방법', title: 'AI 이미지 투 이미지 생성기 사용 방법', description: '참조 이미지를 업로드하고 무엇을 바꿀지 설명한 다음, 보존과 스타일 지시를 더 명확히 하며 결과를 다듬으세요.', stepLabel: '단계', steps: [{ title: '참조 이미지 업로드', text: '변환할 이미지를 선택하세요. 참조 이미지는 피사체, 구도, 포즈, 제품 형태 또는 시각적 방향을 안내합니다.' }, { title: '편집 내용 설명', text: '무엇을 바꾸고 무엇을 유지할지 명확한 프롬프트를 작성하세요. 스타일, 배경, 조명, 용도 세부 정보를 추가합니다.' }, { title: '설정 선택', text: '이미지 변형 또는 창의적 워크플로에 맞는 모델, 비율, 품질 설정을 선택하세요.' }, { title: '이미지 생성', text: '새 이미지를 만들고 원본 참조와 비교해 피사체 안정성, 스타일, 구도를 확인하세요.' }, { title: '다듬고 다운로드', text: '더 가까운 일치, 더 강한 스타일, 더 깔끔한 배경, 더 완성도 높은 결과가 필요하면 프롬프트를 조정하세요.' }] },
    useCases: { title: '인기 이미지 투 이미지 아이디어', description: '이미 시각적 출발점이 있고 이미지를 처음부터 다시 만들지 않고 새 버전이 필요할 때 이미지 투 이미지를 사용하세요.', cards: [{ title: '제품 사진 업그레이드', text: '기본 제품 이미지를 깔끔한 스튜디오 컷, 시즌 광고 비주얼, 이커머스 등록 이미지 또는 프리미엄 캠페인 콘셉트로 바꿉니다.' }, { title: '인물 리스타일', text: '새 조명, 패션 방향, 배경, 일러스트 스타일, 아바타 느낌 또는 프로필 이미지 콘셉트로 인물을 리스타일합니다.' }, { title: '배경 교체', text: '피사체를 유지하고 장면을 스튜디오 배경, 야외 장소, 브랜드 세팅, 실내 또는 캠페인 환경으로 바꿉니다.' }, { title: '인테리어 리디자인', text: '방 사진을 업로드하고 새 가구, 색상 팔레트, 조명, 소재, 벽 장식 또는 데코 방향을 테스트합니다.' }, { title: '스타일 변환', text: '참조 이미지를 애니메이션, 수채화, 3D 렌더, 에디토리얼 사진, 시네마틱, 스케치, 스티커 또는 포스터 스타일로 변환합니다.' }, { title: '마케팅 크리에이티브', text: '유료 광고, 랜딩 페이지 히어로, 소셜 게시물, 썸네일, 출시 그래픽, 제품 발표를 위한 시각 방향을 만듭니다.' }] },
    related: { title: '관련 AI 이미지 도구', description: '이미지 생성, 편집, 개선, 프롬프트 탐색 도구로 워크플로를 이어가세요.', cards: [{ title: 'AI 이미지 생성기', label: '텍스트에서 생성', text: '참조 이미지가 없을 때는 텍스트 프롬프트로 시작하세요.' }, { title: 'GPT Image 2 생성기', label: 'GPT Image 2 사용하기', text: 'Toolaze의 GPT 이미지 워크플로로 고품질 이미지 생성과 참조 기반 편집을 만들 수 있습니다.' }, { title: '배경 제거 도구', label: '배경 제거', text: '새 제품 사진, 프로필 이미지 또는 디자인 자산을 만들기 전에 시각적 잡음을 제거하세요.' }, { title: '이미지 향상 도구', label: '이미지 향상', text: '이미지를 생성하거나 편집한 뒤 선명도, 디테일, 완성도를 개선하세요.' }, { title: 'Nano Banana Pro', label: 'Nano Banana Pro 사용하기', text: '창의적인 변형과 시각 실험을 위한 또 다른 고품질 이미지 모델을 살펴보세요.' }, { title: 'Seedream 4.5', label: 'Seedream 4.5 사용하기', text: '상업용 제품 비주얼, 타이포그래피 중심 디자인, 참조 기반 마케팅 초안을 만드세요.' }] },
    faq: { title: 'AI 이미지 투 이미지 생성기 FAQ', description: '참조 이미지, 프롬프트, 형식, 무료 사용, 실용적인 이미지 투 이미지 워크플로에 대한 답변입니다.', items: [{ q: 'AI 이미지 투 이미지 생성기란 무엇인가요?', a: '업로드한 참조 이미지와 텍스트 프롬프트에서 새 이미지를 만드는 도구입니다. 참조 이미지는 피사체, 구도, 포즈 또는 시각 구조를 안내하고, 프롬프트는 스타일, 배경, 조명, 편집 내용을 제어합니다.' }, { q: '텍스트 투 이미지와 어떻게 다른가요?', a: '텍스트 투 이미지는 프롬프트만으로 시작합니다. 이미지 투 이미지는 참조 이미지에서 시작하므로 제품, 인물, 레이아웃, 사물 또는 구도를 알아볼 수 있게 유지하고 싶을 때 더 적합합니다.' }, { q: 'AI 이미지 투 이미지 생성기를 무료로 사용할 수 있나요?', a: '무료 사용은 할당량, 선택한 모델, 품질 설정에 따라 달라질 수 있습니다. 새 이미지를 시작하기 전에 생성기 컨트롤에서 현재 사용 가능 여부를 확인하세요.' }, { q: '어떤 이미지 형식을 업로드할 수 있나요?', a: 'Toolaze 이미지 도구는 일반적으로 JPG, PNG, WEBP 같은 표준 웹 이미지 형식을 지원합니다. 더 좋은 결과를 위해 선명하고 조명이 좋은 원본 이미지를 사용하세요.' }, { q: '같은 사람이나 제품을 유지하려면 어떻게 해야 하나요?', a: '무엇을 그대로 유지해야 하는지 정확히 말하세요. 예를 들어 “같은 얼굴, 포즈, 헤어스타일, 표정을 유지” 또는 “같은 제품 형태, 라벨 위치, 색상을 유지”라고 작성합니다.' }, { q: '배경만 바꿀 수 있나요?', a: '네. 이미지를 업로드하고 어떤 피사체를 그대로 유지할지, 원래 장면을 어떤 배경으로 바꿀지 프롬프트에 작성하세요.' }, { q: '사진을 애니메이션, 만화 또는 일러스트 스타일로 바꿀 수 있나요?', a: '네. 사진을 업로드하고 애니메이션 아바타, 동화책 일러스트, 수채화, 3D 렌더, 스티커, 포스터, 시네마틱 콘셉트 아트 같은 원하는 스타일을 설명하세요.' }, { q: '이미지 투 이미지는 제품 사진에 유용한가요?', a: '네. 제품 배경 변경, 스튜디오 스타일 이커머스 컷, 시즌 캠페인 콘셉트, 광고 비주얼, 목업, 같은 제품 참조의 창의적 변형에 유용합니다.' }, { q: '결과가 너무 많이 바뀐 이유는 무엇인가요?', a: '프롬프트가 무엇을 유지해야 하는지 명확히 설명하지 않았을 수 있습니다. “같은 포즈 유지”, “제품은 변경하지 않기”, “방 배치와 카메라 각도 유지” 같은 보존 지시를 추가하세요.' }, { q: '좋은 이미지 투 이미지 프롬프트란 무엇인가요?', a: '좋은 프롬프트에는 세 가지가 포함됩니다. 무엇을 유지할지, 무엇을 바꿀지, 최종 이미지가 어떻게 보여야 하는지입니다. 스타일, 조명, 배경, 색상, 카메라 각도, 용도를 추가하세요.' }, { q: '생성 이미지를 상업적으로 사용할 수 있나요?', a: '상업적 사용은 원본 이미지, 업로드한 콘텐츠에 대한 권리, 선택한 모델, 사용 목적에 따라 달라집니다. 권한이 없는 이미지는 업로드하지 말고 게시 전 최종 자산을 검토하세요.' }, { q: '이 도구에 잘 맞는 이미지 프롬프트는 무엇인가요?', a: 'Toolaze는 제품 비주얼, 인물, 소셜 그래픽, 디자인 콘셉트, 마케팅 초안 같은 실용적인 크리에이티브 워크플로를 위해 설계되었습니다. 안전하고 권리가 명확한 이미지와 프롬프트를 사용하세요.' }, { q: '최고의 AI 이미지 투 이미지 생성기는 무엇인가요?', a: '가장 좋은 생성기는 중요한 참조 디테일을 알아볼 수 있게 유지하면서 스타일, 배경, 조명, 출력 형식을 제어할 수 있게 해줍니다. Toolaze는 실용적인 이미지 변형, 창의적 편집, 프롬프트 기반 워크플로에 집중합니다.' }] },
    cta: { title: '다음 이미지 변형 만들기', description: '참조 이미지를 업로드하고 변경 사항을 설명한 뒤 제품, 인물, 인테리어, 캠페인, 소셜 게시물, 창의적 초안을 위한 새 비주얼을 생성하세요.', button: '생성 시작' },
  },
  it: {
    metadata: { title: 'Generatore AI da immagine a immagine gratis online | Toolaze', description: 'Carica un’immagine di riferimento e descrivi le modifiche desiderate. Crea con Toolaze variazioni di immagini AI, foto prodotto, ritratti, trasferimenti di stile, sfondi e modifiche creative.' },
    breadcrumbs: { home: 'Pagina iniziale', aiTools: 'Strumenti AI', current: 'Generatore AI da immagine a immagine' },
    hero: { highlight: 'Generatore AI da immagine a immagine', description: 'Carica un’immagine di riferimento, descrivi la modifica desiderata e genera un nuovo visual a partire da essa. Usa Toolaze per creare variazioni di immagine, foto prodotto, restyle di ritratti, cambi di sfondo, grafiche social, concept art e bozze creative rifinite da un’immagine esistente.', badges: ['Immagine di riferimento', 'Modifiche guidate da prompt', 'Trasferimento di stile', 'Cambio sfondo'] },
    samples: [{ title: 'Esempio di modifica prodotto guidata da riferimento' }, { title: 'Esempio di variazione prodotto ecommerce' }, { title: 'Esempio di restyle ritratto' }, { title: 'Esempio di variazione immagine commerciale' }],
    whatIs: { title: 'Cos’è un generatore AI da immagine a immagine?', paragraphs: ['Un generatore AI da immagine a immagine crea una nuova immagine da un’immagine di riferimento esistente. Invece di partire solo dal testo, usa l’immagine caricata per guidare soggetto, composizione, posa, forma del prodotto, layout della stanza o direzione visiva.', 'Il prompt controlla cosa cambia, come stile, sfondo, illuminazione, colori, scena o uso finale. La generazione da immagine a immagine è utile quando vuoi un risultato nuovo mantenendo riconoscibili parti importanti dell’immagine di partenza.'] },
    promise: { title: 'Crea nuove immagini da un riferimento', text: 'Parti da un’immagine reale e guida il risultato con un linguaggio semplice. Mantieni riconoscibili le parti importanti mentre cambi la direzione visiva.', cards: [{ title: 'Preserva il soggetto principale', text: 'Mantieni riconoscibili prodotto, persona, oggetto, stanza, posizione del logo o composizione mentre generi una versione più pulita o più creativa.' }, { title: 'Cambia stile con un prompt', text: 'Trasforma una foto in scena cinematografica, immagine prodotto in studio, ritratto anime, illustrazione, poster editoriale, render 3D o visual per social media.' }, { title: 'Sostituisci gli sfondi', text: 'Porta un soggetto in un nuovo ambiente, crea uno sfondo da studio, prova scene stagionali, elimina disordine visivo o crea immagini pronte per ecommerce.' }, { title: 'Crea variazioni di immagine', text: 'Genera più direzioni da una sola immagine di riferimento per confrontare layout, luce, colori, angoli di camera e trattamenti creativi.' }] },
    features: { title: 'Modifica immagini con riferimento e prompt', text: 'Usa la generazione da immagine a immagine quando ti serve un risultato controllato da un visual esistente. Carica un riferimento, descrivi cosa deve restare uguale e guida il modello verso un nuovo stile, sfondo, setup prodotto o direzione creativa.', items: [{ title: 'Modifica guidata da riferimento', text: 'Mantieni riconoscibili soggetto principale, prodotto, posa, layout o composizione mentre cambi l’immagine finale con istruzioni in linguaggio naturale.', alt: 'Esempio di modifica AI da immagine a immagine guidata da riferimento' }, { title: 'Variazioni di foto prodotto', text: 'Trasforma un riferimento prodotto in scatti studio, immagini ecommerce, scene lifestyle, concept stagionali e visual prodotto pronti per campagne.', alt: 'Esempio di variazione foto prodotto AI da immagine a immagine' }, { title: 'Sostituzione sfondo', text: 'Sostituisci lo sfondo originale con una scena più pulita, un setup di marca, un interno, una location esterna, un fondale studio o una composizione social.', alt: 'Esempio prima e dopo di sostituzione sfondo AI da immagine a immagine' }, { title: 'Trasferimento di stile e restyle', text: 'Trasforma una foto in ritratto editoriale, avatar anime, illustrazione ad acquerello, render 3D, sticker, poster o concept cinematografico.', alt: 'Esempio prima e dopo di trasferimento stile AI da immagine a immagine' }] },
    gallery: { title: 'Esempi da immagine a immagine', text: 'Esplora risultati pratici che puoi creare da un’immagine di riferimento e un prompt mirato.', examples: [{ title: 'Foto prodotto in studio', text: 'Mantieni la stessa forma del prodotto e la posizione dell’etichetta creando uno sfondo studio pulito con ombre morbide.', alt: 'Foto prodotto AI da immagine a immagine con sfondo studio pulito' }, { title: 'Annuncio prodotto stagionale', text: 'Mantieni invariato il prodotto e inseriscilo in una scena calda da campagna festiva con styling retail premium.', alt: 'Variazione AI di un prodotto in scena pubblicitaria stagionale' }, { title: 'Da ritratto a editoriale', text: 'Trasforma un ritratto in immagine fashion editoriale con illuminazione drammatica e sfondo pulito.', alt: 'Esempio prima e dopo di restyle ritratto AI' }, { title: 'Redesign di interni', text: 'Mantieni layout della stanza e angolo di camera mentre provi nuovi arredi, materiali e direzione della luce.', alt: 'Esempio prima e dopo di redesign interni AI' }, { title: 'Sostituzione sfondo', text: 'Mantieni soggetto e posa invariati mentre sostituisci la scena originale con un nuovo sfondo rifinito.', alt: 'Esempio prima e dopo di sostituzione sfondo ritratto AI' }, { title: 'Render 3D prodotto', text: 'Converti un riferimento prodotto in un render di alta qualità con materiali lucidi e riflessi studio morbidi.', alt: 'Render 3D AI di prodotto da immagine caricata' }, { title: 'Poster per social media', text: 'Usa il soggetto di riferimento come ancora visiva per un poster verticale audace o una grafica di campagna.', alt: 'Poster social AI generato da immagine di riferimento' }, { title: 'Variazione concept art', text: 'Trasforma una direzione visiva grezza in una scena, ambiente o moodboard creativo più rifinito.', alt: 'Variazione concept art AI generata da immagine di riferimento' }] },
    models: { title: 'Usa il modello giusto per immagine a immagine', description: 'Scegli il modello in base al lavoro: modifiche prodotto, ritratti, trasferimento di stile, controllo composizione, aderenza al prompt o output di campagna rifinito.', cards: [{ title: 'GPT Image 2', text: 'Ideale per modifiche strutturate da immagine a immagine, visual prodotto, layout leggibili, concept poster e bozze creative commerciali.', label: 'Prova GPT Image 2' }, { title: 'Nano Banana Pro', text: 'Ideale per variazioni rifinite, ritratti, foto prodotto, restyle creativi e output di alta qualità basati su riferimento.', label: 'Prova Nano Banana Pro' }, { title: 'Seedream 4.5', text: 'Ideale per scene prodotto commerciali, visual di marca, concept ecommerce, layout tipografici e modifiche coerenti con riferimento.', label: 'Prova Seedream 4.5' }], comparisonTitle: 'Guida ai modelli da immagine a immagine', headers: { model: 'Modello', bestFor: 'Ideale per', output: 'Risultato', references: 'Immagini di riferimento', textAndEditing: 'Testo e modifica', watchouts: 'Da controllare' }, rows: [{ model: 'GPT Image 2', bestFor: 'Modifiche prodotto, poster, variazioni sensibili al layout, bozze commerciali.', output: 'Supporta più dimensioni di output tramite le impostazioni modello di Toolaze.', references: 'Utile quando l’immagine caricata deve guidare il soggetto principale o il layout.', textAndEditing: 'Forte per modifiche guidate da prompt, testi brevi e composizioni strutturate.', watchouts: 'Controlla ortografia, volti, mani, loghi e dettagli prodotto prima di pubblicare.' }, { model: 'Nano Banana Pro', bestFor: 'Restyle di ritratti, variazioni creative rifinite, foto prodotto, visual di campagna.', output: 'Utile per bozze immagine di alta qualità e direzioni visive raffinate.', references: 'Forte nel mantenere identità visiva esplorando nuovi trattamenti.', textAndEditing: 'Adatto a prompt complessi e variazioni creative di immagine.', watchouts: 'Usa istruzioni di conservazione più chiare quando il soggetto cambia troppo.' }, { model: 'Seedream 4.5', bestFor: 'Scene prodotto commerciali, visual di marca, concept ecommerce, immagini tipografiche.', output: 'Utile per workflow prodotto e marketing rifiniti.', references: 'Buona scelta per riferimenti di stile marca e modifiche guidate dal prodotto.', textAndEditing: 'Forte aderenza al prompt per bozze con aspetto commerciale.', watchouts: 'I risultati migliori arrivano da prompt specifici con un uso finale chiaro.' }] },
    modes: { title: 'Immagine a immagine o testo a immagine', description: 'Scegli il workflow giusto in base al controllo che ti serve da un visual esistente.', headers: { label: 'Flusso', aiImageGenerator: 'Ideale per', textToImage: 'Ingresso', imageToImage: 'Risultato' }, rows: [{ label: 'Generatore AI da immagine a immagine', aiImageGenerator: 'Creare variazioni controllate da un’immagine esistente', textToImage: 'Immagine di riferimento più prompt', imageToImage: 'Nuova immagine guidata dal riferimento caricato' }, { label: 'Generatore da testo a immagine', aiImageGenerator: 'Creare un nuovo visual da zero', textToImage: 'Solo prompt', imageToImage: 'Immagine generata dalla descrizione testuale' }, { label: 'Editor foto AI', aiImageGenerator: 'Fare correzioni mirate o modifiche semplici', textToImage: 'Foto esistente e istruzioni di modifica', imageToImage: 'Versione modificata dell’immagine originale' }] },
    prompts: { title: 'Template di prompt da immagine a immagine', text: 'I buoni prompt dicono al modello cosa mantenere, cosa cambiare e come deve apparire l’immagine finale.', copyButton: 'Copia prompt', copiedButton: 'Copiato', examples: [{ title: 'Template foto prodotto', prompt: 'Mantieni la stessa forma del prodotto, colore, posizione del logo e dettagli principali. Sostituisci lo sfondo con una scena studio pulita. Usa ombre morbide, illuminazione ecommerce premium e un look fotografico prodotto rifinito.', alt: 'Esempio di prompt da immagine a immagine per prodotto' }, { title: 'Template restyle ritratto', prompt: 'Mantieni la stessa persona, struttura del volto, posa ed espressione. Trasforma l’immagine in un ritratto editoriale con sfondo pulito, luce laterale drammatica, toni pelle naturali e color grading da rivista premium.', alt: 'Esempio prima e dopo di prompt da immagine a immagine per ritratto' }, { title: 'Template design interni', prompt: 'Mantieni lo stesso layout della stanza, finestre e angolo di camera. Ridisegna lo spazio con mobili Japandi moderni, texture di legno caldo, tessuti neutri, piante da interno e luce naturale morbida.', alt: 'Esempio prima e dopo di prompt da immagine a immagine per interni' }, { title: 'Template variazione creativa', prompt: 'Usa l’immagine caricata come riferimento principale. Crea una nuova versione per campagna social media con composizione audace, colori moderni, spazio pulito per testo headline e look commerciale rifinito.', alt: 'Esempio di prompt creativo da immagine a immagine' }] },
    howTo: { schemaName: 'Come usare il generatore AI da immagine a immagine di Toolaze', title: 'Come usare il generatore AI da immagine a immagine', description: 'Carica un’immagine di riferimento, descrivi cosa deve cambiare e rifinisci il risultato con istruzioni più chiare di conservazione e stile.', stepLabel: 'Passaggio', steps: [{ title: 'Carica un’immagine di riferimento', text: 'Scegli l’immagine da trasformare. Il riferimento aiuta a guidare soggetto, composizione, posa, forma del prodotto o direzione visiva.' }, { title: 'Descrivi la modifica', text: 'Scrivi un prompt chiaro che spieghi cosa deve cambiare e cosa deve restare uguale. Aggiungi dettagli su stile, sfondo, luce e uso finale.' }, { title: 'Scegli le impostazioni', text: 'Seleziona modello, rapporto d’aspetto e qualità più adatti alla tua variazione immagine o workflow creativo.' }, { title: 'Genera l’immagine', text: 'Crea la nuova immagine e confrontala con il riferimento originale per controllare stabilità del soggetto, stile e composizione.' }, { title: 'Rifinisci e scarica', text: 'Regola il prompt se vuoi una corrispondenza più vicina, uno stile più forte, uno sfondo più pulito o un output più rifinito.' }] },
    useCases: { title: 'Idee popolari da immagine a immagine', description: 'Usa la generazione da immagine a immagine quando hai già un punto di partenza visivo e vuoi una nuova versione senza ricostruire l’immagine da zero.', cards: [{ title: 'Upgrade foto prodotto', text: 'Trasforma un’immagine prodotto base in scatto studio pulito, visual pubblicitario stagionale, immagine ecommerce o concept campagna premium.' }, { title: 'Restyle ritratto', text: 'Rielabora un ritratto con nuova luce, direzione moda, sfondo, stile illustrativo, look avatar o concept per profilo.' }, { title: 'Cambio sfondo', text: 'Mantieni il soggetto e sostituisci la scena con fondale studio, location esterna, setup di marca, interno o ambiente di campagna.' }, { title: 'Redesign interni', text: 'Carica una foto di una stanza e prova nuovi arredi, palette colore, luci, materiali, quadri o direzioni decorative.' }, { title: 'Trasferimento di stile', text: 'Converti un riferimento in anime, acquerello, render 3D, fotografia editoriale, stile cinematico, sketch, sticker o poster.' }, { title: 'Creatività marketing', text: 'Crea direzioni visive per annunci paid, hero di landing page, post social, miniature, grafiche di lancio e annunci prodotto.' }] },
    related: { title: 'Strumenti AI per immagini correlati', description: 'Continua il flusso di creazione con strumenti per generazione, modifica, miglioramento e scoperta di prompt.', cards: [{ title: 'Generatore di immagini AI', label: 'Genera da testo', text: 'Parti da un prompt testuale quando non hai un’immagine di riferimento.' }, { title: 'Generatore GPT Image 2', label: 'Prova GPT Image 2', text: 'Crea generazioni di immagini di alta qualità e modifiche guidate da riferimento con il flusso GPT di Toolaze.' }, { title: 'Rimozione sfondo', label: 'Rimuovi sfondo', text: 'Elimina il disordine visivo prima di creare una nuova foto prodotto, immagine profilo o risorsa di design.' }, { title: 'Miglioratore immagine', label: 'Migliora immagine', text: 'Migliora nitidezza, dettaglio e finitura dopo aver generato o modificato un’immagine.' }, { title: 'Nano Banana Pro', label: 'Prova Nano Banana Pro', text: 'Esplora un altro modello immagine di alta qualità per variazioni creative ed esperimenti visivi.' }, { title: 'Seedream 4.5', label: 'Prova Seedream 4.5', text: 'Crea immagini prodotto commerciali, design tipografici e bozze marketing basate su riferimento.' }] },
    faq: { title: 'FAQ generatore AI da immagine a immagine', description: 'Risposte alle domande comuni su immagini di riferimento, prompt, formati, uso gratuito e workflow pratici da immagine a immagine.', items: [{ q: 'Cos’è un generatore AI da immagine a immagine?', a: 'È uno strumento che crea una nuova immagine da un riferimento caricato e un prompt testuale. Il riferimento guida soggetto, composizione, posa o struttura visiva; il prompt controlla stile, sfondo, illuminazione e modifiche.' }, { q: 'In cosa differisce dal testo a immagine?', a: 'Il testo a immagine parte solo da un prompt. L’immagine a immagine parte da una reference, quindi è migliore quando vuoi mantenere riconoscibili prodotto, persona, layout, oggetto o composizione.' }, { q: 'Posso usare gratis il generatore AI da immagine a immagine?', a: 'L’uso gratuito può variare in base a quota, modello selezionato e impostazioni di qualità. Controlla i comandi del generatore per la disponibilità attuale prima di avviare una nuova immagine.' }, { q: 'Quali formati immagine posso caricare?', a: 'Gli strumenti immagine di Toolaze supportano comunemente formati web standard come JPG, PNG e WEBP. Usa un’immagine sorgente chiara e ben illuminata per risultati migliori.' }, { q: 'Come mantengo la stessa persona o lo stesso prodotto?', a: 'Indica esattamente cosa deve restare uguale. Per esempio: “mantieni lo stesso volto, posa, capelli ed espressione” oppure “mantieni la stessa forma del prodotto, posizione dell’etichetta e colore”.' }, { q: 'Posso cambiare solo lo sfondo?', a: 'Sì. Carica l’immagine e scrivi un prompt che dica quale soggetto deve restare invariato e quale sfondo deve sostituire la scena originale.' }, { q: 'Posso trasformare una foto in anime, cartoon o illustrazione?', a: 'Sì. Carica la foto e descrivi lo stile desiderato, come avatar anime, illustrazione da libro, acquerello, render 3D, sticker, poster o concept art cinematografica.' }, { q: 'L’immagine a immagine è utile per foto prodotto?', a: 'Sì. È utile per cambi di sfondo prodotto, scatti ecommerce in stile studio, concept stagionali di campagna, visual adv, mockup e variazioni creative dallo stesso riferimento prodotto.' }, { q: 'Perché il risultato è cambiato troppo?', a: 'Il prompt potrebbe non spiegare chiaramente cosa deve restare uguale. Aggiungi istruzioni come “mantieni la stessa posa”, “mantieni il prodotto invariato” o “mantieni layout della stanza e angolo di camera”.' }, { q: 'Cosa rende buono un prompt da immagine a immagine?', a: 'Un buon prompt include tre parti: cosa mantenere, cosa cambiare e come deve apparire l’immagine finale. Aggiungi dettagli su stile, luce, sfondo, colori, angolo di camera e uso finale.' }, { q: 'Posso usare commercialmente le immagini generate?', a: 'L’uso commerciale dipende dall’immagine sorgente, dai tuoi diritti sul contenuto caricato, dal modello scelto e dal caso d’uso. Non caricare immagini senza permesso e controlla gli asset finali prima della pubblicazione.' }, { q: 'Quali prompt immagine sono adatti a questo strumento?', a: 'Toolaze è pensato per workflow creativi pratici come visual prodotto, ritratti, grafiche social, concept design e bozze marketing. Usa immagini sicure e con diritti chiari.' }, { q: 'Qual è il miglior generatore AI da immagine a immagine?', a: 'Il migliore mantiene riconoscibili i dettagli importanti del riferimento e offre controllo su stile, sfondo, illuminazione e formato di output. Toolaze si concentra su variazioni pratiche, modifiche creative e workflow guidati da prompt.' }] },
    cta: { title: 'Crea la tua prossima variazione immagine', description: 'Carica un’immagine di riferimento, descrivi la modifica e genera un nuovo visual per prodotti, ritratti, interni, campagne, post social e bozze creative.', button: 'Inizia a generare' },
  },
}

function mergeValue<T>(base: T, override: unknown): T {
  if (override === undefined) return base
  if (Array.isArray(base)) {
    const overrideArray = Array.isArray(override) ? override : []
    return base.map((item, index) => mergeValue(item, overrideArray[index])) as T
  }
  if (base && typeof base === 'object' && override && typeof override === 'object' && !Array.isArray(override)) {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [key, value] of Object.entries(override)) {
      result[key] = mergeValue(result[key], value)
    }
    return result as T
  }
  return override as T
}

function buildLocalizedCopy(overrides: DeepPageCopyOverride): AiImageGeneratorPageCopy {
  return mergeValue(en, overrides)
}

export const aiImageToImageGeneratorPageCopy = en

export const aiImageToImageGeneratorPageCopies: Record<AiImageToImageGeneratorLocale, AiImageGeneratorPageCopy> = {
  en,
  de: buildLocalizedCopy(localizedOverrides.de ?? {}),
  ja: buildLocalizedCopy(localizedOverrides.ja ?? {}),
  es: buildLocalizedCopy(localizedOverrides.es ?? {}),
  'zh-TW': buildLocalizedCopy(localizedOverrides['zh-TW'] ?? {}),
  pt: buildLocalizedCopy(localizedOverrides.pt ?? {}),
  fr: buildLocalizedCopy(localizedOverrides.fr ?? {}),
  ko: buildLocalizedCopy(localizedOverrides.ko ?? {}),
  it: buildLocalizedCopy(localizedOverrides.it ?? {}),
}

export function isAiImageToImageGeneratorLocale(
  locale: string,
): locale is AiImageToImageGeneratorLocale {
  return AI_IMAGE_TO_IMAGE_GENERATOR_LOCALES.includes(locale as AiImageToImageGeneratorLocale)
}

export function getAiImageToImageGeneratorPageCopy(
  locale: string = 'en',
): AiImageGeneratorPageCopy {
  return isAiImageToImageGeneratorLocale(locale)
    ? aiImageToImageGeneratorPageCopies[locale]
    : aiImageToImageGeneratorPageCopies.en
}
