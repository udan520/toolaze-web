export const AI_IMAGE_GENERATOR_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type AiImageGeneratorLocale = (typeof AI_IMAGE_GENERATOR_LOCALES)[number]

const AI_IMAGE_GENERATOR_ASSET_BASE_URL = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/ai-image-generator'

const aiImageAsset = (fileName: string) => `${AI_IMAGE_GENERATOR_ASSET_BASE_URL}/${fileName}`

type TextCard = {
  title: string
  text: string
}

type LinkCard = TextCard & {
  href: string
  label: string
  imageId?: string
}

type ImageExample = TextCard & {
  image: string
  alt: string
  width: number
  height: number
}

type PromptExample = {
  title: string
  prompt: string
  image: string
  alt: string
  width: number
  height: number
}

type ComparisonRow = {
  label: string
  aiImageGenerator: string
  textToImage: string
  imageToImage: string
}

type FeatureItem = TextCard & {
  image: string
  alt: string
  width: number
  height: number
  href?: string
  label?: string
}

type ModelRow = {
  model: string
  bestFor: string
  output: string
  references: string
  textAndEditing: string
  watchouts: string
}

type FaqItem = {
  q: string
  a: string
}

export type AiImageGeneratorPageCopy = {
  metadata: {
    title: string
    description: string
  }
  breadcrumbs: {
    home: string
    aiTools: string
    current: string
  }
  hero: {
    highlight: string
    description: string
    badges: string[]
  }
  samples: Array<{
    url: string
    title: string
    width: number
    height: number
  }>
  whatIs: {
    title: string
    paragraphs: string[]
  }
  promise: {
    title: string
    text: string
    cards: TextCard[]
  }
  features: {
    title: string
    text: string
    items: FeatureItem[]
  }
  gallery: {
    title: string
    text: string
    examples: ImageExample[]
  }
  models: {
    title: string
    description: string
    cards: LinkCard[]
    comparisonTitle: string
    headers: {
      model: string
      bestFor: string
      output: string
      references: string
      textAndEditing: string
      watchouts: string
    }
    rows: ModelRow[]
  }
  modes: {
    title: string
    description: string
    headers: {
      label: string
      aiImageGenerator: string
      textToImage: string
      imageToImage: string
    }
    rows: ComparisonRow[]
  }
  prompts: {
    title: string
    text: string
    copyButton: string
    copiedButton: string
    examples: PromptExample[]
  }
  howTo: {
    schemaName: string
    title: string
    description: string
    stepLabel: string
    steps: TextCard[]
  }
  useCases: {
    title: string
    description: string
    cards: TextCard[]
  }
  related: {
    title: string
    description: string
    cards: LinkCard[]
  }
  faq: {
    title: string
    description: string
    items: FaqItem[]
  }
  cta: {
    title: string
    description: string
    button: string
  }
}

const en: AiImageGeneratorPageCopy = {
  metadata: {
    title: 'Free AI Image Generator Online - No Sign Up | Toolaze',
    description:
      'Create AI images online for free with no sign up. Use Toolaze AI Image Generator for text-to-image, image-to-image, product images, posters, ads, thumbnails, and social media visuals.',
  },
  breadcrumbs: {
    home: 'Home',
    aiTools: 'AI Tools',
    current: 'AI Image Generator',
  },
  hero: {
    highlight: 'AI Image Generator',
    description:
      'Create AI images online from text prompts or reference images. Use Toolaze AI Image Generator for product images, posters, ads, thumbnails, portraits, social media visuals, UI concepts, and reference-guided edits directly in your browser.',
    badges: ['Free Online', 'No Sign Up', 'Text to Image', 'Image to Image', 'Multiple AI Models', 'Commercial Drafts'],
  },
  samples: [
    {
      url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/gpt-image-2.jpg',
      title: 'Commercial poster sample',
      width: 800,
      height: 600,
    },
    {
      url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/wan-2-7-image/gallery-event-poster.webp',
      title: 'Event poster sample',
      width: 960,
      height: 720,
    },
    {
      url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/seedream-4-5/gallery-ecommerce-product.webp',
      title: 'Product image sample',
      width: 1280,
      height: 960,
    },
    {
      url: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/nano-banana-pro.jpg',
      title: 'Creative concept sample',
      width: 800,
      height: 597,
    },
  ],
  whatIs: {
    title: 'What Is an AI Image Generator?',
    paragraphs: [
      'An AI image generator turns text prompts, reference images, or editing instructions into new visuals. It can create realistic photos, product mockups, posters, thumbnails, portraits, illustrations, UI concepts, and social media graphics directly in the browser.',
      'Toolaze works as a free online AI image generator and model selection hub. Start with a simple text prompt, upload a reference image when needed, then choose the model that best fits your task, such as stronger text rendering, product staging, image editing, fast variations, or polished commercial layouts.',
      'Use it for practical image creation: product images, ecommerce listings, paid ads, social posts, YouTube thumbnails, campaign concepts, presentation graphics, character ideas, design references, and client review drafts.',
    ],
  },
  promise: {
    title: 'Free AI Image Generator With No Sign Up',
    text:
      'Start creating images without installing design software or setting up an account. Test prompts, compare visual directions, and generate usable drafts quickly from your browser.',
    cards: [
      {
        title: 'Free Online',
        text: 'Open the generator in your browser and start creating image drafts without installing software or setting up a paid design suite.',
      },
      {
        title: 'Fast Creative Iteration',
        text: 'Test prompts, generate variations, and compare models as you refine ads, product images, thumbnails, and design drafts.',
      },
      {
        title: 'No Sign Up to Start',
        text: 'Begin generating images without creating an account. Sign-in may be useful later for saved workflows, credits, or higher-volume usage.',
      },
      {
        title: 'Useful for Commercial Drafts',
        text: 'Create ads, product concepts, posters, thumbnails, social visuals, and design options for review before final publishing.',
      },
    ],
  },
  features: {
    title: 'Create Images From Text, Images, and Ideas',
    text:
      'Use Toolaze when you need more than a decorative image. Build prompt-based visuals, edit from references, compare models, and generate image drafts for real marketing, product, design, education, and content workflows.',
    items: [
      {
        title: 'Text to Image Generator',
        text: 'Turn a written prompt into a new image. Describe the subject, style, layout, background, lighting, aspect ratio, and exact words that should appear in the image.',
        image: aiImageAsset('text-to-image-generator.webp'),
        alt: 'AI text to image generator creating a product poster from a written prompt',
        width: 1600,
        height: 900,
      },
      {
        title: 'Image to Image AI Generator',
        text: 'Upload a reference image and ask the model to change the background, style, lighting, scene, product setup, composition, or visual direction while keeping important details stable.',
        image: aiImageAsset('image-to-image-generator.webp'),
        alt: 'AI image to image generator editing a reference product photo',
        width: 1600,
        height: 900,
        href: '/ai-image-to-image-generator',
        label: 'Open Image to Image',
      },
      {
        title: 'Product Image Generator',
        text: 'Create ecommerce product images, marketplace listing drafts, lifestyle scenes, package mockups, seasonal product visuals, and clean product hero images.',
        image: aiImageAsset('product-image-generator.webp'),
        alt: 'AI generated ecommerce product image with clean background and product hero',
        width: 1600,
        height: 900,
      },
      {
        title: 'Poster and Ad Generator',
        text: 'Generate campaign posters, paid social ads, event graphics, launch visuals, promo banners, and short-copy commercial layouts.',
        image: aiImageAsset('poster-ad-generator.webp'),
        alt: 'AI generated poster and ad design with readable headline',
        width: 1600,
        height: 900,
        href: '/prompts/categories/advertising',
        label: 'Browse Ad Prompts',
      },
      {
        title: 'Thumbnail and Social Visuals',
        text: 'Make YouTube thumbnails, blog hero images, social media posts, creator graphics, profile concepts, and scroll-friendly visual hooks.',
        image: aiImageAsset('thumbnail-social-visuals.webp'),
        alt: 'AI generated social media thumbnail with bold layout',
        width: 1600,
        height: 900,
      },
      {
        title: 'Model Choice for Better Results',
        text: 'Switch between supported image models when your prompt needs stronger text rendering, better reference editing, higher visual polish, faster output, or more creative variation.',
        image: aiImageAsset('model-choice.webp'),
        alt: 'AI image generator model chooser with multiple image models',
        width: 1600,
        height: 900,
        href: '/model',
        label: 'Compare Models',
      },
    ],
  },
  gallery: {
    title: 'AI Image Generator Examples',
    text:
      'Explore common results you can create with Toolaze, from marketing images and product visuals to UI concepts, educational graphics, portraits, thumbnails, and reference-guided edits.',
    examples: [
      {
        title: 'Product Launch Poster',
        text: 'Create a clean product poster with a readable headline, product hero, offer area, and polished campaign composition.',
        image: aiImageAsset('product-launch-poster.webp'),
        alt: 'AI generated product launch poster example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Social Media Ad',
        text: 'Generate scroll-stopping social ads with short copy, strong contrast, a clear benefit, and a mobile-friendly layout.',
        image: aiImageAsset('social-media-ad.webp'),
        alt: 'AI generated social media ad example',
        width: 1600,
        height: 900,
      },
      {
        title: 'UI Mockup Concept',
        text: 'Draft app screens, dashboard panels, onboarding cards, or product feature overviews for early design exploration.',
        image: aiImageAsset('ui-mockup-concept.webp'),
        alt: 'AI generated UI mockup concept example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Ecommerce Product Image',
        text: 'Turn a product idea or reference into a cleaner marketplace image, lifestyle shot, bundle visual, or seasonal listing draft.',
        image: aiImageAsset('ecommerce-product-image.webp'),
        alt: 'AI generated ecommerce product image example',
        width: 1600,
        height: 900,
      },
      {
        title: 'YouTube Thumbnail',
        text: 'Create bold thumbnail concepts with a clear subject, expressive composition, readable short text, and strong visual contrast.',
        image: aiImageAsset('youtube-thumbnail.webp'),
        alt: 'AI generated YouTube thumbnail example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Educational Infographic',
        text: 'Create study visuals, science diagrams, historical explainers, process charts, and classroom graphics with section labels.',
        image: aiImageAsset('educational-infographic.webp'),
        alt: 'AI generated educational infographic example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Portrait or Character Concept',
        text: 'Generate portraits, creator avatars, character ideas, profile images, style studies, and visual references for storytelling.',
        image: aiImageAsset('portrait-character-concept.webp'),
        alt: 'AI generated portrait and character concept example',
        width: 1600,
        height: 900,
      },
      {
        title: 'Reference-Guided Edit',
        text: 'Upload a reference image and change background, lighting, composition, or style while keeping the main subject stable.',
        image: aiImageAsset('reference-guided-edit.webp'),
        alt: 'AI generated reference-guided edit example',
        width: 1600,
        height: 900,
      },
    ],
  },
  models: {
    title: 'Choose the Best AI Image Generator Model',
    description:
      'Different image models are better at different jobs. Choose by output goal: readable text, product images, reference edits, fast variations, polished design drafts, or creative exploration.',
    cards: [
      {
        title: 'GPT Image 2',
        text: 'Best for clean text-to-image prompts, readable short text, posters, product ads, UI mockups, and commercial graphics.',
        href: '/model/gpt-image-2',
        label: 'Try GPT Image 2',
        imageId: 'gpt-image-2',
      },
      {
        title: 'Wan 2.7 Image',
        text: 'Best for structured prompts, multi-reference edits, text-heavy layouts, prompt reasoning, and image sets.',
        href: '/model/wan-2-7-image',
        label: 'Try Wan 2.7 Image',
        imageId: 'wan-2-7-image',
      },
      {
        title: 'Nano Banana Pro',
        text: 'Best for high-quality image generation, reference edits, portraits, product shots, and polished campaign drafts.',
        href: '/model/nano-banana-pro',
        label: 'Try Nano Banana Pro',
        imageId: 'nano-banana-pro',
      },
      {
        title: 'Nano Banana 2',
        text: 'Best for fast everyday image generation, quick creative variants, broad aspect ratios, and image-to-image drafts.',
        href: '/model/nano-banana-2',
        label: 'Try Nano Banana 2',
        imageId: 'nano-banana-2',
      },
      {
        title: 'Seedream 4.5',
        text: 'Best for commercial product visuals, typography-led layouts, prompt adherence, and brand-style compositions.',
        href: '/model/seedream-4-5',
        label: 'Try Seedream 4.5',
        imageId: 'seedream-4-5',
      },
      {
        title: 'Seedream 5.0 Lite',
        text: 'Best for lightweight image generation workflows, campaign ideas, image drafts, and fast creator experiments.',
        href: '/model/seedream-5-0-lite',
        label: 'Try Seedream 5.0 Lite',
        imageId: 'seedream-5-0-lite',
      },
    ],
    comparisonTitle: 'Model Strengths by Workflow',
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
        bestFor: 'Posters, ads, UI mockups, thumbnails, commercial layouts.',
        output: '1K, 2K, 4K. 4K examples include 3840 x 2160 and 2160 x 3840. Max edge: 3840px.',
        references: 'Up to 16 input images. High-fidelity reference handling.',
        textAndEditing: 'Strong short text, clean layouts, natural-language edits.',
        watchouts: 'Review spelling, faces, hands, and product details.',
      },
      {
        model: 'Wan 2.7 Image',
        bestFor: 'Structured posters, image sets, text-heavy layouts, product ads.',
        output: '1K, 2K, Pro 4K. Standard modes may not support 2.5K or 4K.',
        references: 'Up to 9 input images.',
        textAndEditing: 'Strong layout control, prompt following, text-in-image.',
        watchouts: 'Best for structured instructions, not loose art prompts.',
      },
      {
        model: 'Nano Banana Pro',
        bestFor: 'Polished creative images, portraits, product shots, campaign assets.',
        output: '1K, 2K, 4K.',
        references: 'Up to 14 reference images.',
        textAndEditing: 'Strong text rendering, world knowledge, complex prompts.',
        watchouts: 'Best when quality and reasoning matter more than speed.',
      },
      {
        model: 'Nano Banana 2',
        bestFor: 'Fast variants, social graphics, broad aspect ratios, image edits.',
        output: '1K, 2K, 4K. Supports wide and tall aspect ratios.',
        references: 'Up to 14 reference images.',
        textAndEditing: 'Good labels, creator graphics, quick image-to-image edits.',
        watchouts: 'Less premium than Nano Banana Pro for polished campaigns.',
      },
      {
        model: 'Seedream 4.5',
        bestFor: 'Product visuals, packaging, brand key visuals, campaign drafts.',
        output: '1K, 2K, 4K.',
        references: 'Up to 14 reference images.',
        textAndEditing: 'Strong prompt adherence, typography, reference consistency.',
        watchouts: 'Best for commercial polish, not the lightest workflow.',
      },
      {
        model: 'Seedream 5.0 Lite',
        bestFor: 'Fast product ideas, creator experiments, lightweight drafts.',
        output: '1K, 2K, 4K.',
        references: 'Up to 14 reference images.',
        textAndEditing: 'Good prompt following, fast variants, product concepts.',
        watchouts: 'Choose Seedream 4.5 for stronger commercial polish.',
      },
    ],
  },
  modes: {
    title: 'Text to Image vs Image to Image Workflows',
    description:
      'Most users start with text-to-image for fast exploration, then move to image-to-image when they need more control. Toolaze combines both workflows with model selection, so you can choose the right path for each image task.',
    headers: {
      label: 'Question',
      aiImageGenerator: 'AI Image Generator',
      textToImage: 'Text to Image',
      imageToImage: 'Image to Image',
    },
    rows: [
      {
        label: 'What it means',
        aiImageGenerator: 'One place to create, compare, and refine visuals',
        textToImage: 'Create a new image from a written prompt',
        imageToImage: 'Upload a reference image and transform or restyle it',
      },
      {
        label: 'Best for',
        aiImageGenerator: 'Broad image creation, model choice, and workflow control',
        textToImage: 'New scenes, ads, posters, portraits, thumbnails',
        imageToImage: 'Reference edits, style changes, product variants',
      },
      {
        label: 'Input',
        aiImageGenerator: 'Prompt, reference image, or both',
        textToImage: 'Text prompt',
        imageToImage: 'Uploaded image plus editing instructions',
      },
      {
        label: 'Use it when',
        aiImageGenerator: 'You want one place to test prompts and models',
        textToImage: 'You know the image idea but do not have a source image',
        imageToImage: 'You need subject, style, layout, or composition control',
      },
      {
        label: 'Prompt focus',
        aiImageGenerator: 'Goal, model, mode, output format, and usage',
        textToImage: 'Subject, scene, style, composition, text, lighting',
        imageToImage: 'What to preserve, what to change, and target result',
      },
    ],
  },
  prompts: {
    title: 'AI Image Prompt Templates to Copy',
    text:
      'Copy a prompt, paste it into the generator, then adjust the subject, brand style, format, and model for your own image.',
    copyButton: 'Copy prompt',
    copiedButton: 'Copied',
    examples: [
      {
        title: 'Product Poster Prompt',
        prompt:
          'Create a premium product launch poster for a fictional sparkling water brand called "Luma Fizz". Show one can as the hero product, cold condensation, citrus slices, bright studio lighting, clean white and indigo background, readable headline text "FRESH SPARK", small subtitle "Citrus sparkling water", polished commercial ad layout, 4:5 vertical poster.',
        image: aiImageAsset('prompt-product-poster.webp'),
        alt: 'Product poster prompt example image',
        width: 1600,
        height: 900,
      },
      {
        title: 'YouTube Thumbnail Prompt',
        prompt:
          'Create a bold YouTube thumbnail for a video titled "5 AI TOOLS I USE DAILY". Use a clean tech background, one expressive creator portrait, five floating app-style cards, large readable text, strong contrast, bright rim lighting, modern creator economy style, 16:9 composition.',
        image: aiImageAsset('prompt-youtube-thumbnail.webp'),
        alt: 'YouTube thumbnail prompt example image',
        width: 1600,
        height: 900,
      },
      {
        title: 'Social Media Ad Prompt',
        prompt:
          'Create a square social media ad for a productivity app. Show a clean phone mockup with a simple task dashboard, a bright desk scene, and the headline "Plan Your Day in Minutes". Use friendly modern typography, high contrast, and a layout that works on mobile feeds.',
        image: aiImageAsset('prompt-social-media-ad.webp'),
        alt: 'Social media ad prompt example image',
        width: 1600,
        height: 900,
      },
      {
        title: 'Reference Edit Prompt',
        prompt:
          'Use the uploaded product photo as the reference. Preserve the product shape, logo placement, and camera angle. Change only the background into a premium marble bathroom scene with soft daylight, clean reflections, luxury skincare styling, and natural shadows.',
        image: aiImageAsset('prompt-reference-edit.webp'),
        alt: 'Reference edit prompt example image',
        width: 1600,
        height: 900,
      },
      {
        title: 'Ecommerce Product Prompt',
        prompt:
          'Create a clean ecommerce product image for a reusable water bottle. Show the bottle standing upright on a white background with soft shadows, three small feature callouts, and a premium marketplace-ready look. Keep the image uncluttered and realistic.',
        image: aiImageAsset('prompt-ecommerce-product.webp'),
        alt: 'Ecommerce product prompt example image',
        width: 1600,
        height: 900,
      },
      {
        title: 'UI Mockup Prompt',
        prompt:
          'Create a modern SaaS analytics dashboard mockup for a fictional product named "PulseDesk". Include readable labels, left sidebar navigation, three metric cards, a line chart, a campaign table, calm white background, indigo accent color, realistic product UI screenshot style.',
        image: aiImageAsset('prompt-ui-mockup.webp'),
        alt: 'UI mockup prompt example image',
        width: 1600,
        height: 900,
      },
      {
        title: 'Character Sheet Prompt',
        prompt:
          'Create a character reference sheet for an original adventure game courier named Mira. Show front view, side view, back view, three facial expressions, one backpack prop, color palette, and clothing details. Keep the same character identity across every panel.',
        image: aiImageAsset('prompt-character-sheet.webp'),
        alt: 'Character sheet prompt example image',
        width: 1600,
        height: 900,
      },
      {
        title: 'Educational Infographic Prompt',
        prompt:
          'Create a clear educational infographic explaining how solar panels work. Include labeled sections for sunlight, photovoltaic cells, inverter, battery, and home power. Use simple icons, readable short labels, clean spacing, friendly science classroom style.',
        image: aiImageAsset('prompt-educational-infographic.webp'),
        alt: 'Educational infographic prompt example image',
        width: 1600,
        height: 900,
      },
    ],
  },
  howTo: {
    schemaName: 'How to Use Toolaze AI Image Generator',
    title: 'How to Generate AI Images Online',
    description:
      'Create an image in a few steps, then refine the result with clearer prompts, reference images, or a different model.',
    stepLabel: 'Step',
    steps: [
      {
        title: 'Write a Prompt',
        text: 'Describe the asset type, subject, scene, style, mood, aspect ratio, and any text that should appear in the image.',
      },
      {
        title: 'Upload a Reference Image',
        text: 'Add a reference image when you want to preserve a product, face, object, pose, layout, room, sketch, or visual direction.',
      },
      {
        title: 'Choose a Model',
        text: 'Select a model based on the task, such as text-to-image generation, image editing, product visuals, social ads, or fast prompt variations.',
      },
      {
        title: 'Generate and Review',
        text: 'Check text spelling, faces, hands, brand claims, product details, and composition before using the image publicly.',
      },
      {
        title: 'Refine the Result',
        text: 'Adjust one part of the prompt at a time, change the model if needed, or upload a stronger reference image for more controlled output.',
      },
    ],
  },
  useCases: {
    title: 'Popular AI Image Use Cases',
    description:
      'Move from idea to visual draft for business assets, creator content, design exploration, and fast client review.',
    cards: [
      {
        title: 'Ads and Product Visuals',
        text: 'Generate product launch posters, paid social concepts, ecommerce mockups, packaging ideas, and seasonal campaign images.',
      },
      {
        title: 'Thumbnails and Social Posts',
        text: 'Create YouTube thumbnails, TikTok covers, Instagram graphics, creator posts, reaction images, and share-ready content formats.',
      },
      {
        title: 'Portraits and Character Art',
        text: 'Make profile concepts, character sheets, stylized portraits, avatars, and reference-friendly creative directions.',
      },
      {
        title: 'Posters and Text Layouts',
        text: 'Draft event posters, quote graphics, presentation covers, editorial layouts, and short text-heavy designs for review.',
      },
      {
        title: 'UI and Brand Concepts',
        text: 'Explore app screens, landing page visuals, brand moodboards, feature graphics, and early design directions.',
      },
      {
        title: 'Image Editing Ideas',
        text: 'Start from text or upload a reference image, then change background, style, lighting, composition, or use case.',
      },
      {
        title: 'Education and Explainers',
        text: 'Build infographics, classroom diagrams, process visuals, study aids, labeled charts, and presentation-ready educational graphics.',
      },
      {
        title: 'Reference-Guided Edits',
        text: 'Edit product photos, change backgrounds, restyle rooms, improve lighting, create variants, and turn rough references into polished drafts.',
      },
    ],
  },
  related: {
    title: 'Related AI Image Tools',
    description:
      'Continue with a specialized model page or browse more Toolaze tools when your workflow needs editing, compression, conversion, or model comparison.',
    cards: [
      {
        title: 'AI Tools',
        text: 'Browse more AI tools for image, video, writing, productivity, and creative workflows.',
        href: '/ai-tools',
        label: 'Explore AI Tools',
      },
      {
        title: 'AI Models',
        text: 'Compare Toolaze image and video models by task, output style, model family, and creative workflow.',
        href: '/model',
        label: 'Browse Models',
      },
      {
        title: 'AI Image to Image Generator',
        text: 'Upload a reference image, describe the edit, and create controlled variations, product shots, background swaps, or restyles.',
        href: '/ai-image-to-image-generator',
        label: 'Edit from Image',
      },
      {
        title: 'GPT Image 2',
        text: 'Use GPT Image 2 for posters, product ads, readable text, UI mockups, and structured image generation.',
        href: '/model/gpt-image-2',
        label: 'Try GPT Image 2',
      },
      {
        title: 'GPT Image 2 Prompts',
        text: 'Browse prompt structures for text-heavy images, product visuals, UI mockups, and campaign-ready layouts.',
        href: '/prompts/models/gpt-image-2',
        label: 'Open Prompts',
      },
      {
        title: 'Advertising Prompts',
        text: 'Use ad-focused prompt templates for product launches, social campaigns, paid creative, and thumbnail concepts.',
        href: '/prompts/categories/advertising',
        label: 'Browse Advertising',
      },
      {
        title: 'Image Converter',
        text: 'Convert downloaded AI images between JPG, PNG, WebP, and HEIC formats for publishing workflows.',
        href: '/image-converter',
        label: 'Convert Images',
      },
      {
        title: 'Image Compressor',
        text: 'Compress generated images for web publishing, ecommerce listings, social uploads, and faster page speed.',
        href: '/image-compressor',
        label: 'Compress Images',
      },
    ],
  },
  faq: {
    title: 'AI Image Generator FAQ',
    description:
      'Quick answers about free usage, no sign up access, text-to-image generation, image-to-image editing, model choice, and commercial review.',
    items: [
      {
        q: 'What is an AI image generator?',
        a: 'An AI image generator creates images from text prompts, reference images, or editing instructions. It can make product images, posters, ads, thumbnails, portraits, illustrations, UI concepts, and social media visuals.',
      },
      {
        q: 'Is this AI image generator free?',
        a: 'Yes. Toolaze lets you start creating AI images online for free. Usage may vary by quota, model availability, selected settings, and account status.',
      },
      {
        q: 'Do I need to sign up?',
        a: 'No sign-up is required to start. You can open the generator, write a prompt, choose settings, and create images online.',
      },
      {
        q: 'How do I generate AI images from text?',
        a: 'Enter a prompt that describes the subject, style, layout, background, lighting, aspect ratio, and exact text if needed. Generate the image, review the result, then refine the prompt.',
      },
      {
        q: 'Can I generate AI images from another image?',
        a: 'Yes. Use image-to-image generation by uploading a reference image and describing what should change, such as background, lighting, style, composition, or scene.',
      },
      {
        q: 'What can I make with a text to image AI generator?',
        a: 'You can make ads, posters, product images, thumbnails, social visuals, portraits, concept art, UI mockups, and design drafts from text prompts.',
      },
      {
        q: 'Which AI image model should I use?',
        a: 'Start with GPT Image 2 for general text-to-image. Use Wan 2.7 Image for structured layouts, Nano Banana Pro for polished edits, and Nano Banana 2 for fast variants.',
      },
      {
        q: 'Can I use AI generated images commercially?',
        a: 'AI generated images may be used for commercial drafts and projects when they meet your rights, brand, platform, and legal requirements. Always review the final image before publishing.',
      },
      {
        q: 'What prompt works best for AI image generation?',
        a: 'A strong prompt names the asset type, subject, style, composition, text, lighting, output purpose, and constraints. For image edits, say what should stay unchanged.',
      },
      {
        q: 'Can AI image generators create readable text?',
        a: 'Some models are better at text than others. Use short exact phrases, place text in quotation marks, describe where it should appear, and review spelling before using the image.',
      },
      {
        q: 'What can I create with Toolaze AI Image Generator?',
        a: 'You can create product images, posters, ads, thumbnails, social media visuals, portraits, UI concepts, educational graphics, character ideas, and reference-guided edits.',
      },
    ],
  },
  cta: {
    title: 'Start Creating AI Images Online',
    description:
      'Use Toolaze AI Image Generator to create images from text prompts, edit from reference images, compare AI models, and build practical visuals for products, ads, thumbnails, social media, education, and design.',
    button: 'Generate an Image',
  },
}



type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P]
}

function mergeCopy(base: AiImageGeneratorPageCopy, patch: DeepPartial<AiImageGeneratorPageCopy>): AiImageGeneratorPageCopy {
  const mergeValue = (baseValue: unknown, patchValue: unknown): unknown => {
    if (Array.isArray(baseValue) && Array.isArray(patchValue)) {
      return baseValue.map((item, index) => mergeValue(item, patchValue[index] ?? {}))
    }

    if (
      baseValue &&
      patchValue &&
      typeof baseValue === 'object' &&
      typeof patchValue === 'object' &&
      !Array.isArray(baseValue) &&
      !Array.isArray(patchValue)
    ) {
      const merged: Record<string, unknown> = { ...(baseValue as Record<string, unknown>) }
      Object.entries(patchValue as Record<string, unknown>).forEach(([key, value]) => {
        merged[key] = key in merged ? mergeValue(merged[key], value) : value
      })
      return merged
    }

    return patchValue ?? baseValue
  }

  return mergeValue(base, patch) as AiImageGeneratorPageCopy
}

const localizedCopyOverrides: Partial<Record<Exclude<AiImageGeneratorLocale, 'en'>, DeepPartial<AiImageGeneratorPageCopy>>> = {
  de: {
    metadata: {
      title: 'Kostenloser KI-Bildgenerator online - ohne Anmeldung | Toolaze',
      description:
        'Erstellen Sie KI-Bilder online kostenlos und ohne Anmeldung. Nutzen Sie Toolaze AI Image Generator für Text-zu-Bild, Bild-zu-Bild, Produktbilder, Poster, Anzeigen, Thumbnails und Social-Media-Visuals.',
    },
    breadcrumbs: { home: 'Startseite', aiTools: 'KI-Tools', current: 'KI-Bildgenerator' },
    hero: {
      highlight: 'KI-Bildgenerator',
      description:
        'Erstellen Sie KI-Bilder online aus Textprompts oder Referenzbildern. Nutzen Sie Toolaze AI Image Generator direkt im Browser für Produktbilder, Poster, Anzeigen, Thumbnails, Porträts, Social-Media-Visuals, UI-Konzepte und referenzbasierte Bearbeitungen.',
      badges: ['Kostenlos online', 'Ohne Anmeldung', 'Text zu Bild', 'Bild zu Bild', 'Mehrere KI-Modelle', 'Kommerzielle Entwürfe'],
    },
    samples: [{ title: 'Beispiel für Werbeposter' }, { title: 'Beispiel für Eventposter' }, { title: 'Beispiel für Produktbild' }, { title: 'Beispiel für Kreativkonzept' }],
    whatIs: {
      title: 'Was ist ein KI-Bildgenerator?',
      paragraphs: [
        'Ein KI-Bildgenerator verwandelt Textprompts, Referenzbilder oder Bearbeitungsanweisungen in neue Visuals. Er kann realistische Fotos, Produkt-Mockups, Poster, Thumbnails, Porträts, Illustrationen, UI-Konzepte und Social-Media-Grafiken direkt im Browser erstellen.',
        'Toolaze funktioniert als kostenloser Online-KI-Bildgenerator und als Hub zur Modellauswahl. Beginnen Sie mit einem einfachen Textprompt, laden Sie bei Bedarf ein Referenzbild hoch und wählen Sie dann das Modell, das am besten zu Ihrer Aufgabe passt, etwa für stärkeres Text-Rendering, Produktinszenierung, Bildbearbeitung, schnelle Varianten oder ausgefeilte kommerzielle Layouts.',
        'Nutzen Sie es für praktische Bilderstellung: Produktbilder, Ecommerce-Listings, bezahlte Anzeigen, Social Posts, YouTube-Thumbnails, Kampagnenkonzepte, Präsentationsgrafiken, Charakterideen, Designreferenzen und Entwürfe für Kundenreviews.',
      ],
    },
    promise: {
      title: 'Kostenloser KI-Bildgenerator ohne Anmeldung',
      text: 'Erstellen Sie Bilder, ohne Designsoftware zu installieren oder ein Konto einzurichten. Testen Sie Prompts, vergleichen Sie visuelle Richtungen und erzeugen Sie schnell brauchbare Entwürfe im Browser.',
      cards: [
        { title: 'Kostenlos online', text: 'Öffnen Sie den Generator im Browser und starten Sie mit Bildentwürfen, ohne Software zu installieren oder eine kostenpflichtige Design-Suite einzurichten.' },
        { title: 'Schnelle kreative Iteration', text: 'Testen Sie Prompts, erzeugen Sie Varianten und vergleichen Sie Modelle, während Sie Anzeigen, Produktbilder, Thumbnails und Designentwürfe verfeinern.' },
        { title: 'Start ohne Anmeldung', text: 'Beginnen Sie mit der Bilderstellung, ohne ein Konto anzulegen. Eine Anmeldung kann später für gespeicherte Workflows, Credits oder höhere Nutzungsmengen sinnvoll sein.' },
        { title: 'Nützlich für kommerzielle Entwürfe', text: 'Erstellen Sie Anzeigen, Produktkonzepte, Poster, Thumbnails, Social Visuals und Designoptionen zur Prüfung vor der finalen Veröffentlichung.' },
      ],
    },
    features: {
      title: 'Bilder aus Text, Bildern und Ideen erstellen',
      text: 'Nutzen Sie Toolaze, wenn Sie mehr als ein dekoratives Bild benötigen. Erstellen Sie promptbasierte Visuals, bearbeiten Sie anhand von Referenzen, vergleichen Sie Modelle und erzeugen Sie Bildentwürfe für echte Marketing-, Produkt-, Design-, Bildungs- und Content-Workflows.',
      items: [
        { title: 'Text-zu-Bild-Generator', text: 'Verwandeln Sie einen geschriebenen Prompt in ein neues Bild. Beschreiben Sie Motiv, Stil, Layout, Hintergrund, Licht, Seitenverhältnis und den genauen Text, der im Bild erscheinen soll.', alt: 'KI-Text-zu-Bild-Generator erstellt aus einem geschriebenen Prompt ein Produktposter' },
        { title: 'Bild-zu-Bild-KI-Generator', text: 'Laden Sie ein Referenzbild hoch und lassen Sie das Modell Hintergrund, Stil, Licht, Szene, Produktaufbau, Komposition oder visuelle Richtung ändern, während wichtige Details stabil bleiben.', alt: 'KI-Bild-zu-Bild-Generator bearbeitet ein Referenz-Produktfoto', label: 'Bild zu Bild öffnen' },
        { title: 'Produktbild-Generator', text: 'Erstellen Sie Ecommerce-Produktbilder, Entwürfe für Marktplatz-Listings, Lifestyle-Szenen, Verpackungs-Mockups, saisonale Produktvisuals und klare Produkt-Hero-Bilder.', alt: 'KI-generiertes Ecommerce-Produktbild mit sauberem Hintergrund und Produkt-Hero' },
        { title: 'Poster- und Anzeigen-Generator', text: 'Generieren Sie Kampagnenposter, Paid-Social-Anzeigen, Eventgrafiken, Launch-Visuals, Promo-Banner und kommerzielle Layouts mit kurzer Copy.', alt: 'KI-generiertes Poster- und Anzeigendesign mit lesbarer Überschrift', label: 'Anzeigen-Prompts ansehen' },
        { title: 'Thumbnails und Social Visuals', text: 'Erstellen Sie YouTube-Thumbnails, Blog-Hero-Bilder, Social-Media-Posts, Creator-Grafiken, Profilkonzepte und scrollstarke visuelle Hooks.', alt: 'KI-generiertes Social-Media-Thumbnail mit markantem Layout' },
        { title: 'Modellauswahl für bessere Ergebnisse', text: 'Wechseln Sie zwischen unterstützten Bildmodellen, wenn Ihr Prompt besseres Text-Rendering, präzisere Referenzbearbeitung, höhere visuelle Politur, schnellere Ausgabe oder mehr kreative Variation braucht.', alt: 'KI-Bildgenerator-Modellauswahl mit mehreren Bildmodellen', label: 'Modelle vergleichen' },
      ],
    },
    gallery: {
      title: 'Beispiele für den KI-Bildgenerator',
      text: 'Entdecken Sie typische Ergebnisse, die Sie mit Toolaze erstellen können: Marketingbilder, Produktvisuals, UI-Konzepte, Bildungsgrafiken, Porträts, Thumbnails und referenzbasierte Bearbeitungen.',
      examples: [
        { title: 'Produktlaunch-Poster', text: 'Erstellen Sie ein klares Produktposter mit lesbarer Überschrift, Produkt-Hero, Angebotsbereich und polierter Kampagnenkomposition.', alt: 'Beispiel eines KI-generierten Produktlaunch-Posters' },
        { title: 'Social-Media-Anzeige', text: 'Generieren Sie auffällige Social Ads mit kurzer Copy, starkem Kontrast, klarem Nutzenversprechen und mobilfreundlichem Layout.', alt: 'Beispiel einer KI-generierten Social-Media-Anzeige' },
        { title: 'UI-Mockup-Konzept', text: 'Entwerfen Sie App-Screens, Dashboard-Panels, Onboarding-Karten oder Produktfeature-Übersichten für frühe Designexploration.', alt: 'Beispiel eines KI-generierten UI-Mockup-Konzepts' },
        { title: 'Ecommerce-Produktbild', text: 'Verwandeln Sie eine Produktidee oder Referenz in ein saubereres Marktplatzbild, Lifestyle-Foto, Bundle-Visual oder saisonalen Listing-Entwurf.', alt: 'Beispiel eines KI-generierten Ecommerce-Produktbilds' },
        { title: 'YouTube-Thumbnail', text: 'Erstellen Sie starke Thumbnail-Konzepte mit klarem Motiv, ausdrucksvoller Komposition, lesbarem Kurztext und kräftigem Kontrast.', alt: 'Beispiel eines KI-generierten YouTube-Thumbnails' },
        { title: 'Bildungsinfografik', text: 'Erstellen Sie Lernvisuals, Wissenschaftsdiagramme, historische Erklärgrafiken, Prozesscharts und Unterrichtsgrafiken mit Abschnittslabels.', alt: 'Beispiel einer KI-generierten Bildungsinfografik' },
        { title: 'Porträt- oder Charakterkonzept', text: 'Generieren Sie Porträts, Creator-Avatare, Charakterideen, Profilbilder, Stilstudien und visuelle Storytelling-Referenzen.', alt: 'Beispiel eines KI-generierten Porträt- und Charakterkonzepts' },
        { title: 'Referenzbasierte Bearbeitung', text: 'Laden Sie ein Referenzbild hoch und ändern Sie Hintergrund, Licht, Komposition oder Stil, während das Hauptmotiv stabil bleibt.', alt: 'Beispiel einer KI-generierten referenzbasierten Bearbeitung' },
      ],
    },
    models: {
      title: 'Das beste KI-Bildgenerator-Modell wählen',
      description: 'Verschiedene Bildmodelle eignen sich für unterschiedliche Aufgaben. Wählen Sie nach Ziel: lesbarer Text, Produktbilder, Referenzbearbeitung, schnelle Varianten, polierte Designentwürfe oder kreative Exploration.',
      cards: [
        { text: 'Am besten für klare Text-zu-Bild-Prompts, lesbaren Kurztext, Poster, Produktanzeigen, UI-Mockups und kommerzielle Grafiken.', label: 'GPT Image 2 testen' },
        { text: 'Am besten für strukturierte Prompts, Multi-Referenz-Bearbeitungen, textlastige Layouts, Prompt-Reasoning und Bildsets.', label: 'Wan 2.7 Image testen' },
        { text: 'Am besten für hochwertige Bilderstellung, Referenzbearbeitungen, Porträts, Produktshots und polierte Kampagnenentwürfe.', label: 'Nano Banana Pro testen' },
        { text: 'Am besten für schnelle Alltagsbilder, schnelle kreative Varianten, breite Seitenverhältnisse und Bild-zu-Bild-Entwürfe.', label: 'Nano Banana 2 testen' },
        { text: 'Am besten für kommerzielle Produktvisuals, typografische Layouts, Prompt-Treue und markennahe Kompositionen.', label: 'Seedream 4.5 testen' },
        { text: 'Am besten für leichte Bildgenerierungs-Workflows, Kampagnenideen, Bildentwürfe und schnelle Creator-Experimente.', label: 'Seedream 5.0 Lite testen' },
      ],
      comparisonTitle: 'Modellstärken nach Workflow',
      headers: { model: 'Modell', bestFor: 'Am besten für', output: 'Ausgabe', references: 'Referenzbilder', textAndEditing: 'Text und Bearbeitung', watchouts: 'Zu prüfen' },
      rows: [
        { bestFor: 'Poster, Anzeigen, UI-Mockups, Thumbnails, kommerzielle Layouts.', output: '1K, 2K, 4K. 4K-Beispiele umfassen 3840 x 2160 und 2160 x 3840. Maximale Kante: 3840px.', references: 'Bis zu 16 Eingabebilder. Hochpräzise Referenzverarbeitung.', textAndEditing: 'Starker Kurztext, saubere Layouts, Bearbeitung in natürlicher Sprache.', watchouts: 'Rechtschreibung, Gesichter, Hände und Produktdetails prüfen.' },
        { bestFor: 'Strukturierte Poster, Bildsets, textlastige Layouts, Produktanzeigen.', output: '1K, 2K, Pro 4K. Standardmodi unterstützen ggf. kein 2.5K oder 4K.', references: 'Bis zu 9 Eingabebilder.', textAndEditing: 'Starke Layoutkontrolle, Prompt-Befolgung, Text im Bild.', watchouts: 'Am besten für strukturierte Anweisungen, weniger für lose Kunstprompts.' },
        { bestFor: 'Polierte Kreativbilder, Porträts, Produktshots, Kampagnenassets.', output: '1K, 2K, 4K.', references: 'Bis zu 14 Referenzbilder.', textAndEditing: 'Starkes Text-Rendering, Weltwissen, komplexe Prompts.', watchouts: 'Am besten, wenn Qualität und Reasoning wichtiger sind als Geschwindigkeit.' },
        { bestFor: 'Schnelle Varianten, Social Graphics, breite Seitenverhältnisse, Bildbearbeitung.', output: '1K, 2K, 4K. Unterstützt breite und hohe Seitenverhältnisse.', references: 'Bis zu 14 Referenzbilder.', textAndEditing: 'Gute Labels, Creator-Grafiken, schnelle Bild-zu-Bild-Bearbeitungen.', watchouts: 'Für polierte Kampagnen weniger hochwertig als Nano Banana Pro.' },
        { bestFor: 'Produktvisuals, Verpackung, Brand Key Visuals, Kampagnenentwürfe.', output: '1K, 2K, 4K.', references: 'Bis zu 14 Referenzbilder.', textAndEditing: 'Starke Prompt-Treue, Typografie, Referenzkonsistenz.', watchouts: 'Am besten für kommerzielle Politur, nicht der leichteste Workflow.' },
        { bestFor: 'Schnelle Produktideen, Creator-Experimente, leichte Entwürfe.', output: '1K, 2K, 4K.', references: 'Bis zu 14 Referenzbilder.', textAndEditing: 'Gute Prompt-Befolgung, schnelle Varianten, Produktkonzepte.', watchouts: 'Wählen Sie Seedream 4.5 für stärkere kommerzielle Politur.' },
      ],
    },
    modes: {
      title: 'Text zu Bild vs. Bild zu Bild Workflows',
      description: 'Die meisten Nutzer starten mit Text-zu-Bild für schnelle Exploration und wechseln zu Bild-zu-Bild, wenn mehr Kontrolle nötig ist. Toolaze kombiniert beide Workflows mit Modellauswahl, damit Sie für jede Bildaufgabe den passenden Weg wählen können.',
      headers: { label: 'Frage', aiImageGenerator: 'KI-Bildgenerator', textToImage: 'Text zu Bild', imageToImage: 'Bild zu Bild' },
      rows: [
        { label: 'Was es bedeutet', aiImageGenerator: 'Ein Ort zum Erstellen, Vergleichen und Verfeinern von Visuals', textToImage: 'Ein neues Bild aus einem geschriebenen Prompt erstellen', imageToImage: 'Ein Referenzbild hochladen und transformieren oder neu stylen' },
        { label: 'Am besten für', aiImageGenerator: 'Breite Bilderstellung, Modellauswahl und Workflow-Kontrolle', textToImage: 'Neue Szenen, Anzeigen, Poster, Porträts, Thumbnails', imageToImage: 'Referenzbearbeitungen, Stiländerungen, Produktvarianten' },
        { label: 'Eingabe', aiImageGenerator: 'Prompt, Referenzbild oder beides', textToImage: 'Textprompt', imageToImage: 'Hochgeladenes Bild plus Bearbeitungsanweisungen' },
        { label: 'Verwenden, wenn', aiImageGenerator: 'Sie Prompts und Modelle an einem Ort testen möchten', textToImage: 'Sie eine Bildidee haben, aber kein Ausgangsbild', imageToImage: 'Sie Kontrolle über Motiv, Stil, Layout oder Komposition benötigen' },
        { label: 'Prompt-Fokus', aiImageGenerator: 'Ziel, Modell, Modus, Ausgabeformat und Nutzung', textToImage: 'Motiv, Szene, Stil, Komposition, Text, Licht', imageToImage: 'Was erhalten bleiben soll, was sich ändern soll und das Zielergebnis' },
      ],
    },
    prompts: {
      title: 'KI-Bild-Promptvorlagen zum Kopieren',
      text: 'Kopieren Sie einen Prompt, fügen Sie ihn in den Generator ein und passen Sie Motiv, Markenstil, Format und Modell für Ihr eigenes Bild an.',
      copyButton: 'Prompt kopieren',
      copiedButton: 'Kopiert',
      examples: [
        { title: 'Produktposter-Prompt', alt: 'Beispielbild für einen Produktposter-Prompt' },
        { title: 'YouTube-Thumbnail-Prompt', alt: 'Beispielbild für einen YouTube-Thumbnail-Prompt' },
        { title: 'Social-Media-Anzeigen-Prompt', alt: 'Beispielbild für einen Social-Media-Anzeigen-Prompt' },
        { title: 'Referenzbearbeitungs-Prompt', alt: 'Beispielbild für einen Referenzbearbeitungs-Prompt' },
        { title: 'Ecommerce-Produkt-Prompt', alt: 'Beispielbild für einen Ecommerce-Produkt-Prompt' },
        { title: 'UI-Mockup-Prompt', alt: 'Beispielbild für einen UI-Mockup-Prompt' },
        { title: 'Charakterbogen-Prompt', alt: 'Beispielbild für einen Charakterbogen-Prompt' },
        { title: 'Bildungsinfografik-Prompt', alt: 'Beispielbild für einen Bildungsinfografik-Prompt' },
      ],
    },
    howTo: {
      schemaName: 'So verwenden Sie den Toolaze KI-Bildgenerator',
      title: 'So generieren Sie KI-Bilder online',
      description: 'Erstellen Sie ein Bild in wenigen Schritten und verfeinern Sie es anschließend mit klareren Prompts, Referenzbildern oder einem anderen Modell.',
      stepLabel: 'Schritt',
      steps: [
        { title: 'Prompt schreiben', text: 'Beschreiben Sie Asset-Typ, Motiv, Szene, Stil, Stimmung, Seitenverhältnis und jeden Text, der im Bild erscheinen soll.' },
        { title: 'Referenzbild hochladen', text: 'Fügen Sie ein Referenzbild hinzu, wenn Sie ein Produkt, Gesicht, Objekt, eine Pose, ein Layout, einen Raum, eine Skizze oder eine visuelle Richtung erhalten möchten.' },
        { title: 'Modell wählen', text: 'Wählen Sie ein Modell passend zur Aufgabe, etwa Text-zu-Bild-Generierung, Bildbearbeitung, Produktvisuals, Social Ads oder schnelle Promptvarianten.' },
        { title: 'Generieren und prüfen', text: 'Prüfen Sie Rechtschreibung, Gesichter, Hände, Markenclaims, Produktdetails und Komposition, bevor Sie das Bild öffentlich verwenden.' },
        { title: 'Ergebnis verfeinern', text: 'Passen Sie jeweils einen Teil des Prompts an, wechseln Sie bei Bedarf das Modell oder laden Sie eine bessere Referenz für kontrolliertere Ergebnisse hoch.' },
      ],
    },
    useCases: {
      title: 'Beliebte KI-Bild-Anwendungsfälle',
      description: 'Vom Gedanken zum visuellen Entwurf für Business-Assets, Creator-Content, Designexploration und schnelle Kundenreviews.',
      cards: [
        { title: 'Anzeigen und Produktvisuals', text: 'Generieren Sie Produktlaunch-Poster, Paid-Social-Konzepte, Ecommerce-Mockups, Verpackungsideen und saisonale Kampagnenbilder.' },
        { title: 'Thumbnails und Social Posts', text: 'Erstellen Sie YouTube-Thumbnails, TikTok-Cover, Instagram-Grafiken, Creator-Posts, Reaktionsbilder und teilbare Content-Formate.' },
        { title: 'Porträts und Charakterkunst', text: 'Erstellen Sie Profilkonzepte, Charakterbögen, stilisierte Porträts, Avatare und referenzfreundliche Kreativrichtungen.' },
        { title: 'Poster und Textlayouts', text: 'Entwerfen Sie Eventposter, Zitatgrafiken, Präsentationscover, redaktionelle Layouts und kurze textlastige Designs zur Prüfung.' },
        { title: 'UI- und Brand-Konzepte', text: 'Erkunden Sie App-Screens, Landingpage-Visuals, Brand-Moodboards, Feature-Grafiken und frühe Designrichtungen.' },
        { title: 'Bildbearbeitungsideen', text: 'Starten Sie mit Text oder laden Sie ein Referenzbild hoch und ändern Sie Hintergrund, Stil, Licht, Komposition oder Einsatzzweck.' },
        { title: 'Bildung und Erklärgrafiken', text: 'Erstellen Sie Infografiken, Unterrichtsdiagramme, Prozessvisuals, Lernhilfen, beschriftete Charts und präsentationsreife Bildungsgrafiken.' },
        { title: 'Referenzbasierte Bearbeitungen', text: 'Bearbeiten Sie Produktfotos, ändern Sie Hintergründe, restylen Sie Räume, verbessern Sie Licht, erstellen Sie Varianten und verwandeln Sie grobe Referenzen in polierte Entwürfe.' },
      ],
    },
    related: {
      title: 'Verwandte KI-Bildtools',
      description: 'Fahren Sie mit einer spezialisierten Modellseite fort oder entdecken Sie weitere Toolaze-Tools, wenn Ihr Workflow Bearbeitung, Komprimierung, Konvertierung oder Modellvergleich benötigt.',
      cards: [
        { title: 'KI-Tools', text: 'Entdecken Sie weitere KI-Tools für Bild, Video, Schreiben, Produktivität und kreative Workflows.', label: 'KI-Tools entdecken' },
        { title: 'KI-Modelle', text: 'Vergleichen Sie Toolaze Bild- und Videomodelle nach Aufgabe, Ausgabestil, Modellfamilie und Kreativworkflow.', label: 'Modelle ansehen' },
        { title: 'KI-Bild-zu-Bild-Generator', text: 'Laden Sie ein Referenzbild hoch, beschreiben Sie die Bearbeitung und erstellen Sie kontrollierte Varianten, Produktshots, Hintergrundwechsel oder Restyles.', label: 'Aus Bild bearbeiten' },
        { text: 'Nutzen Sie GPT Image 2 für Poster, Produktanzeigen, lesbaren Text, UI-Mockups und strukturierte Bilderstellung.', label: 'GPT Image 2 testen' },
        { title: 'GPT Image 2 Prompts', text: 'Entdecken Sie Promptstrukturen für textlastige Bilder, Produktvisuals, UI-Mockups und kampagnenreife Layouts.', label: 'Prompts öffnen' },
        { title: 'Werbe-Prompts', text: 'Nutzen Sie werbefokussierte Promptvorlagen für Produktlaunches, Social Campaigns, Paid Creative und Thumbnail-Konzepte.', label: 'Werbung ansehen' },
        { title: 'Bildkonverter', text: 'Konvertieren Sie heruntergeladene KI-Bilder zwischen JPG, PNG, WebP und HEIC für Publishing-Workflows.', label: 'Bilder konvertieren' },
        { title: 'Bildkompressor', text: 'Komprimieren Sie generierte Bilder für Webpublishing, Ecommerce-Listings, Social Uploads und schnellere Seitenladezeit.', label: 'Bilder komprimieren' },
      ],
    },
    faq: {
      title: 'KI-Bildgenerator FAQ',
      description: 'Kurze Antworten zu kostenloser Nutzung, Zugriff ohne Anmeldung, Text-zu-Bild, Bild-zu-Bild-Bearbeitung, Modellauswahl und kommerzieller Prüfung.',
      items: [
        { q: 'Was ist ein KI-Bildgenerator?', a: 'Ein KI-Bildgenerator erstellt Bilder aus Textprompts, Referenzbildern oder Bearbeitungsanweisungen. Er kann Produktbilder, Poster, Anzeigen, Thumbnails, Porträts, Illustrationen, UI-Konzepte und Social-Media-Visuals erstellen.' },
        { q: 'Ist dieser KI-Bildgenerator kostenlos?', a: 'Ja. Mit Toolaze können Sie kostenlos online KI-Bilder erstellen. Die Nutzung kann je nach Kontingent, Modellverfügbarkeit, gewählten Einstellungen und Kontostatus variieren.' },
        { q: 'Muss ich mich anmelden?', a: 'Zum Start ist keine Anmeldung erforderlich. Sie können den Generator öffnen, einen Prompt schreiben, Einstellungen wählen und online Bilder erstellen.' },
        { q: 'Wie generiere ich KI-Bilder aus Text?', a: 'Geben Sie einen Prompt ein, der Motiv, Stil, Layout, Hintergrund, Licht, Seitenverhältnis und bei Bedarf exakten Text beschreibt. Generieren Sie das Bild, prüfen Sie das Ergebnis und verfeinern Sie den Prompt.' },
        { q: 'Kann ich KI-Bilder aus einem anderen Bild generieren?', a: 'Ja. Nutzen Sie Bild-zu-Bild-Generierung, indem Sie ein Referenzbild hochladen und beschreiben, was sich ändern soll, etwa Hintergrund, Licht, Stil, Komposition oder Szene.' },
        { q: 'Was kann ich mit einem Text-zu-Bild-KI-Generator erstellen?', a: 'Sie können Anzeigen, Poster, Produktbilder, Thumbnails, Social Visuals, Porträts, Concept Art, UI-Mockups und Designentwürfe aus Textprompts erstellen.' },
        { q: 'Welches KI-Bildmodell sollte ich verwenden?', a: 'Starten Sie mit GPT Image 2 für allgemeines Text-zu-Bild. Nutzen Sie Wan 2.7 Image für strukturierte Layouts, Nano Banana Pro für polierte Bearbeitungen und Nano Banana 2 für schnelle Varianten.' },
        { q: 'Kann ich KI-generierte Bilder kommerziell nutzen?', a: 'KI-generierte Bilder können für kommerzielle Entwürfe und Projekte genutzt werden, wenn sie Ihren Rechte-, Marken-, Plattform- und Rechtsanforderungen entsprechen. Prüfen Sie das finale Bild immer vor der Veröffentlichung.' },
        { q: 'Welcher Prompt funktioniert am besten für KI-Bildgenerierung?', a: 'Ein starker Prompt nennt Asset-Typ, Motiv, Stil, Komposition, Text, Licht, Ausgabezweck und Einschränkungen. Bei Bildbearbeitungen sagen Sie, was unverändert bleiben soll.' },
        { q: 'Können KI-Bildgeneratoren lesbaren Text erstellen?', a: 'Einige Modelle sind besser bei Text als andere. Verwenden Sie kurze exakte Phrasen, setzen Sie Text in Anführungszeichen, beschreiben Sie die Platzierung und prüfen Sie die Rechtschreibung vor der Nutzung.' },
        { q: 'Was kann ich mit Toolaze AI Image Generator erstellen?', a: 'Sie können Produktbilder, Poster, Anzeigen, Thumbnails, Social-Media-Visuals, Porträts, UI-Konzepte, Bildungsgrafiken, Charakterideen und referenzbasierte Bearbeitungen erstellen.' },
      ],
    },
    cta: { title: 'Jetzt KI-Bilder online erstellen', description: 'Nutzen Sie Toolaze AI Image Generator, um Bilder aus Textprompts zu erstellen, Referenzbilder zu bearbeiten, KI-Modelle zu vergleichen und praktische Visuals für Produkte, Anzeigen, Thumbnails, Social Media, Bildung und Design zu bauen.', button: 'Bild generieren' },
  },
  ja: {
    metadata: { title: '無料AI画像生成ツール - 登録不要 | Toolaze', description: '登録なしで無料のAI画像をオンライン作成。Toolaze AI Image Generatorでテキストから画像、画像から画像、商品画像、ポスター、広告、サムネイル、SNSビジュアルを作成できます。' },
    breadcrumbs: { home: 'ホーム', aiTools: 'AIツール', current: 'AI画像生成' },
    hero: { highlight: 'AI画像生成', description: 'テキストプロンプトや参照画像からAI画像をオンラインで作成できます。Toolaze AI Image Generatorを使えば、商品画像、ポスター、広告、サムネイル、ポートレート、SNSビジュアル、UIコンセプト、参照ベースの編集をブラウザで直接作れます。', badges: ['無料オンライン', '登録不要', 'テキストから画像', '画像から画像', '複数のAIモデル', '商用ドラフト'] },
    samples: [{ title: '商用ポスターのサンプル' }, { title: 'イベントポスターのサンプル' }, { title: '商品画像のサンプル' }, { title: 'クリエイティブコンセプトのサンプル' }],
    whatIs: { title: 'AI画像生成ツールとは？', paragraphs: ['AI画像生成ツールは、テキストプロンプト、参照画像、編集指示を新しいビジュアルに変換します。リアルな写真、商品モックアップ、ポスター、サムネイル、ポートレート、イラスト、UIコンセプト、SNSグラフィックをブラウザで直接作成できます。', 'Toolazeは無料オンラインAI画像生成ツールであり、モデル選択ハブでもあります。シンプルなテキストプロンプトから始め、必要に応じて参照画像をアップロードし、文字表現、商品演出、画像編集、高速バリエーション、商用レイアウトなど目的に合うモデルを選べます。', '商品画像、ECリスティング、広告、SNS投稿、YouTubeサムネイル、キャンペーン案、プレゼン資料、キャラクター案、デザイン参照、クライアント確認用ドラフトなど実務向けの画像作成に使えます。'] },
    promise: { title: '登録不要の無料AI画像生成', text: 'デザインソフトのインストールやアカウント作成なしで画像作成を開始できます。プロンプトを試し、方向性を比較し、ブラウザから素早く使えるドラフトを生成できます。', cards: [{ title: '無料オンライン', text: 'ブラウザで生成ツールを開き、ソフトのインストールや有料デザイン環境なしで画像ドラフトを作成できます。' }, { title: '高速なクリエイティブ反復', text: '広告、商品画像、サムネイル、デザイン案を磨きながら、プロンプト、バリエーション、モデルを素早く比較できます。' }, { title: '登録なしで開始', text: 'アカウントを作らずに画像生成を始められます。保存ワークフロー、クレジット、大量利用には後でサインインが役立つ場合があります。' }, { title: '商用ドラフトに便利', text: '公開前の確認用に、広告、商品コンセプト、ポスター、サムネイル、SNSビジュアル、デザイン案を作成できます。' }] },
    features: { title: 'テキスト・画像・アイデアから画像を作成', text: '装飾画像以上のものが必要なときにToolazeを使えます。プロンプトベースのビジュアル、参照画像からの編集、モデル比較、マーケティング、商品、デザイン、教育、コンテンツ制作向けの画像ドラフトを作成できます。', items: [{ title: 'テキストから画像生成', text: '文章のプロンプトを新しい画像に変換します。被写体、スタイル、レイアウト、背景、照明、アスペクト比、画像内に入れる正確な文字を指定できます。', alt: '文章プロンプトから商品ポスターを作成するAIテキスト画像生成ツール' }, { title: '画像から画像AI生成', text: '参照画像をアップロードし、重要なディテールを保ちながら背景、スタイル、照明、シーン、商品セット、構図、方向性を変更できます。', alt: '参照商品写真を編集するAI画像から画像生成ツール', label: '画像から画像を開く' }, { title: '商品画像生成', text: 'EC商品画像、マーケットプレイス用ドラフト、ライフスタイルシーン、パッケージモックアップ、季節の商品ビジュアル、クリーンな商品ヒーロー画像を作成できます。', alt: 'クリーンな背景の商品ヒーローを含むAI生成EC商品画像' }, { title: 'ポスター・広告生成', text: 'キャンペーンポスター、SNS広告、イベントグラフィック、ローンチビジュアル、プロモバナー、短いコピーの商用レイアウトを生成できます。', alt: '読みやすい見出しのAI生成ポスターと広告デザイン', label: '広告プロンプトを見る' }, { title: 'サムネイルとSNSビジュアル', text: 'YouTubeサムネイル、ブログヒーロー画像、SNS投稿、クリエイター用グラフィック、プロフィール案、スクロールを止めるビジュアルフックを作成できます。', alt: '大胆なレイアウトのAI生成SNSサムネイル' }, { title: '結果を高めるモデル選択', text: 'より強い文字表現、参照編集、ビジュアルの完成度、高速出力、クリエイティブなバリエーションが必要な場合に、対応する画像モデルを切り替えられます。', alt: '複数の画像モデルを表示するAI画像生成モデル選択画面', label: 'モデルを比較' }] },
    gallery: { title: 'AI画像生成の例', text: 'Toolazeで作れる一般的な成果物を確認できます。マーケティング画像、商品ビジュアル、UIコンセプト、教育グラフィック、ポートレート、サムネイル、参照ベース編集に対応します。', examples: [{ title: '商品ローンチポスター', text: '読みやすい見出し、商品ヒーロー、オファー枠、洗練されたキャンペーン構図のクリーンな商品ポスターを作成できます。', alt: 'AI生成の商品ローンチポスター例' }, { title: 'SNS広告', text: '短いコピー、強いコントラスト、明確なベネフィット、モバイル向けレイアウトの目を引くSNS広告を生成できます。', alt: 'AI生成SNS広告の例' }, { title: 'UIモックアップ案', text: 'アプリ画面、ダッシュボード、オンボーディングカード、商品機能の概要を初期デザイン検討用に作成できます。', alt: 'AI生成UIモックアップ案の例' }, { title: 'EC商品画像', text: '商品アイデアや参照を、よりきれいなマーケットプレイス画像、ライフスタイル写真、バンドル画像、季節用リスティング案にできます。', alt: 'AI生成EC商品画像の例' }, { title: 'YouTubeサムネイル', text: '明確な被写体、表情のある構図、読みやすい短文、強いコントラストの大胆なサムネイル案を作成できます。', alt: 'AI生成YouTubeサムネイルの例' }, { title: '教育インフォグラフィック', text: '学習ビジュアル、科学図解、歴史解説、工程チャート、セクションラベル付きの授業用グラフィックを作れます。', alt: 'AI生成教育インフォグラフィックの例' }, { title: 'ポートレート・キャラクター案', text: 'ポートレート、クリエイターアバター、キャラクター案、プロフィール画像、スタイルスタディ、物語制作向けの参照を生成できます。', alt: 'AI生成ポートレートとキャラクター案の例' }, { title: '参照ベース編集', text: '参照画像をアップロードし、主題を保ったまま背景、照明、構図、スタイルを変更できます。', alt: 'AI生成参照ベース編集の例' }] },
    models: { title: '最適なAI画像生成モデルを選ぶ', description: '画像モデルにはそれぞれ得意な用途があります。読みやすい文字、商品画像、参照編集、高速バリエーション、洗練されたデザイン案、クリエイティブ探索など出力目的で選べます。', cards: [{ text: 'クリーンなテキスト画像プロンプト、読みやすい短文、ポスター、商品広告、UIモックアップ、商用グラフィックに最適です。', label: 'GPT Image 2を試す' }, { text: '構造化プロンプト、複数参照編集、文字量の多いレイアウト、プロンプト推論、画像セットに最適です。', label: 'Wan 2.7 Imageを試す' }, { text: '高品質な画像生成、参照編集、ポートレート、商品写真、洗練されたキャンペーンドラフトに最適です。', label: 'Nano Banana Proを試す' }, { text: '日常的な高速画像生成、素早いクリエイティブ変種、幅広い比率、画像から画像のドラフトに最適です。', label: 'Nano Banana 2を試す' }, { text: '商用商品ビジュアル、文字主体レイアウト、プロンプト追従、ブランド調の構図に最適です。', label: 'Seedream 4.5を試す' }, { text: '軽量な画像生成ワークフロー、キャンペーン案、画像ドラフト、高速なクリエイター実験に最適です。', label: 'Seedream 5.0 Liteを試す' }], comparisonTitle: 'ワークフロー別モデルの強み', headers: { model: 'モデル', bestFor: '最適な用途', output: '出力', references: '参照画像', textAndEditing: '文字と編集', watchouts: '注意点' }, rows: [{ bestFor: 'ポスター、広告、UIモックアップ、サムネイル、商用レイアウト。', output: '1K、2K、4K。4K例には3840 x 2160と2160 x 3840を含みます。最大辺: 3840px。', references: '最大16枚の入力画像。高忠実度の参照処理。', textAndEditing: '短い文字、クリーンなレイアウト、自然言語編集に強い。', watchouts: 'スペル、顔、手、商品ディテールを確認してください。' }, { bestFor: '構造化ポスター、画像セット、文字量の多いレイアウト、商品広告。', output: '1K、2K、Pro 4K。標準モードは2.5Kや4Kに対応しない場合があります。', references: '最大9枚の入力画像。', textAndEditing: 'レイアウト制御、プロンプト追従、画像内文字に強い。', watchouts: '自由なアートプロンプトより構造化した指示に向いています。' }, { bestFor: '洗練されたクリエイティブ画像、ポートレート、商品写真、キャンペーン素材。', output: '1K、2K、4K。', references: '最大14枚の参照画像。', textAndEditing: '強い文字表現、世界知識、複雑なプロンプト。', watchouts: '速度より品質と推論が重要なときに最適です。' }, { bestFor: '高速バリエーション、SNSグラフィック、幅広い比率、画像編集。', output: '1K、2K、4K。横長・縦長の比率に対応。', references: '最大14枚の参照画像。', textAndEditing: 'ラベル、クリエイター画像、素早い画像から画像編集に適しています。', watchouts: '洗練されたキャンペーンにはNano Banana Proほど高級感はありません。' }, { bestFor: '商品ビジュアル、パッケージ、ブランドキービジュアル、キャンペーン案。', output: '1K、2K、4K。', references: '最大14枚の参照画像。', textAndEditing: 'プロンプト追従、タイポグラフィ、参照一貫性に強い。', watchouts: '商用の磨き込みに最適で、最軽量ワークフローではありません。' }, { bestFor: '素早い商品アイデア、クリエイター実験、軽量ドラフト。', output: '1K、2K、4K。', references: '最大14枚の参照画像。', textAndEditing: '良好なプロンプト追従、高速バリエーション、商品コンセプト。', watchouts: '商用の完成度を上げるならSeedream 4.5を選んでください。' }] },
    modes: { title: 'テキストから画像と画像から画像のワークフロー', description: '多くのユーザーは素早い探索にテキストから画像を使い、より制御が必要なときに画像から画像へ移ります。Toolazeは両方のワークフローとモデル選択を組み合わせ、各画像タスクに合う方法を選べます。', headers: { label: '項目', aiImageGenerator: 'AI画像生成', textToImage: 'テキストから画像', imageToImage: '画像から画像' }, rows: [{ label: '意味', aiImageGenerator: 'ビジュアルを作成、比較、改善するための一つの場所', textToImage: '文章プロンプトから新しい画像を作成', imageToImage: '参照画像をアップロードして変換またはスタイル変更' }, { label: '最適な用途', aiImageGenerator: '幅広い画像作成、モデル選択、ワークフロー制御', textToImage: '新しいシーン、広告、ポスター、ポートレート、サムネイル', imageToImage: '参照編集、スタイル変更、商品バリエーション' }, { label: '入力', aiImageGenerator: 'プロンプト、参照画像、または両方', textToImage: 'テキストプロンプト', imageToImage: 'アップロード画像と編集指示' }, { label: '使う場面', aiImageGenerator: 'プロンプトとモデルを一か所で試したいとき', textToImage: '画像アイデアはあるが元画像がないとき', imageToImage: '被写体、スタイル、レイアウト、構図を制御したいとき' }, { label: 'プロンプトの焦点', aiImageGenerator: '目的、モデル、モード、出力形式、用途', textToImage: '被写体、シーン、スタイル、構図、文字、照明', imageToImage: '残すもの、変更するもの、目標結果' }] },
    prompts: { title: 'コピーできるAI画像プロンプトテンプレート', text: 'プロンプトをコピーして生成ツールに貼り付け、被写体、ブランドスタイル、形式、モデルを自分の画像に合わせて調整できます。', copyButton: 'プロンプトをコピー', copiedButton: 'コピー済み', examples: [{ title: '商品ポスタープロンプト', alt: '商品ポスタープロンプトの例画像' }, { title: 'YouTubeサムネイルプロンプト', alt: 'YouTubeサムネイルプロンプトの例画像' }, { title: 'SNS広告プロンプト', alt: 'SNS広告プロンプトの例画像' }, { title: '参照編集プロンプト', alt: '参照編集プロンプトの例画像' }, { title: 'EC商品プロンプト', alt: 'EC商品プロンプトの例画像' }, { title: 'UIモックアッププロンプト', alt: 'UIモックアッププロンプトの例画像' }, { title: 'キャラクターシートプロンプト', alt: 'キャラクターシートプロンプトの例画像' }, { title: '教育インフォグラフィックプロンプト', alt: '教育インフォグラフィックプロンプトの例画像' }] },
    howTo: { schemaName: 'Toolaze AI画像生成の使い方', title: 'オンラインでAI画像を生成する方法', description: '数ステップで画像を作成し、より明確なプロンプト、参照画像、別モデルで結果を改善できます。', stepLabel: 'ステップ', steps: [{ title: 'プロンプトを書く', text: 'アセットタイプ、被写体、シーン、スタイル、雰囲気、アスペクト比、画像内に入れる文字を説明します。' }, { title: '参照画像をアップロード', text: '商品、顔、物体、ポーズ、レイアウト、部屋、スケッチ、視覚方向を保ちたいときに参照画像を追加します。' }, { title: 'モデルを選ぶ', text: 'テキストから画像、画像編集、商品ビジュアル、SNS広告、高速プロンプトバリエーションなどタスクに合わせてモデルを選びます。' }, { title: '生成して確認', text: '公開前に文字のスペル、顔、手、ブランド表現、商品ディテール、構図を確認します。' }, { title: '結果を改善', text: 'プロンプトを一部ずつ調整し、必要ならモデルを変更し、より制御したい場合は強い参照画像をアップロードします。' }] },
    useCases: { title: '人気のAI画像活用例', description: 'ビジネス素材、クリエイターコンテンツ、デザイン探索、素早いクライアント確認のために、アイデアからビジュアルドラフトへ進めます。', cards: [{ title: '広告と商品ビジュアル', text: '商品ローンチポスター、SNS広告案、ECモックアップ、パッケージ案、季節キャンペーン画像を生成できます。' }, { title: 'サムネイルとSNS投稿', text: 'YouTubeサムネイル、TikTokカバー、Instagramグラフィック、クリエイター投稿、リアクション画像、共有向け形式を作れます。' }, { title: 'ポートレートとキャラクターアート', text: 'プロフィール案、キャラクターシート、スタイライズポートレート、アバター、参照しやすいクリエイティブ方向を作れます。' }, { title: 'ポスターと文字レイアウト', text: 'イベントポスター、引用グラフィック、プレゼン表紙、編集風レイアウト、短文中心デザインを確認用に作れます。' }, { title: 'UIとブランドコンセプト', text: 'アプリ画面、ランディングページビジュアル、ブランドムードボード、機能グラフィック、初期デザイン方向を探索できます。' }, { title: '画像編集アイデア', text: 'テキストから始めるか参照画像をアップロードし、背景、スタイル、照明、構図、用途を変更できます。' }, { title: '教育と解説', text: 'インフォグラフィック、授業用図解、工程ビジュアル、学習補助、ラベル付きチャート、プレゼン向け教育グラフィックを作れます。' }, { title: '参照ベース編集', text: '商品写真を編集し、背景変更、部屋のリスタイル、照明改善、バリエーション作成、粗い参照から洗練されたドラフト化ができます。' }] },
    related: { title: '関連AI画像ツール', description: '編集、圧縮、変換、モデル比較が必要な場合は、専門モデルページや他のToolazeツールへ進めます。', cards: [{ title: 'AIツール', text: '画像、動画、文章、 productivity、クリエイティブワークフロー向けのAIツールをさらに探せます。', label: 'AIツールを見る' }, { title: 'AIモデル', text: 'タスク、出力スタイル、モデルファミリー、クリエイティブワークフロー別にToolazeの画像・動画モデルを比較できます。', label: 'モデルを見る' }, { title: 'AI画像から画像生成', text: '参照画像をアップロードし、編集内容を説明して、制御されたバリエーション、商品写真、背景差し替え、リスタイルを作成できます。', label: '画像から編集' }, { text: 'GPT Image 2でポスター、商品広告、読みやすい文字、UIモックアップ、構造化画像生成を行えます。', label: 'GPT Image 2を試す' }, { title: 'GPT Image 2プロンプト', text: '文字量の多い画像、商品ビジュアル、UIモックアップ、キャンペーン向けレイアウトのプロンプト構造を探せます。', label: 'プロンプトを開く' }, { title: '広告プロンプト', text: '商品ローンチ、SNSキャンペーン、有料クリエイティブ、サムネイル案向けの広告プロンプトテンプレートを使えます。', label: '広告を見る' }, { title: '画像コンバーター', text: 'ダウンロードしたAI画像をJPG、PNG、WebP、HEIC形式に変換して公開ワークフローに使えます。', label: '画像を変換' }, { title: '画像圧縮', text: '生成画像をWeb公開、ECリスティング、SNSアップロード、高速表示向けに圧縮できます。', label: '画像を圧縮' }] },
    faq: { title: 'AI画像生成FAQ', description: '無料利用、登録不要アクセス、テキストから画像、画像から画像編集、モデル選択、商用利用確認についての短い回答です。', items: [{ q: 'AI画像生成ツールとは何ですか？', a: 'AI画像生成ツールは、テキストプロンプト、参照画像、編集指示から画像を作成します。商品画像、ポスター、広告、サムネイル、ポートレート、イラスト、UIコンセプト、SNSビジュアルを作れます。' }, { q: 'このAI画像生成ツールは無料ですか？', a: 'はい。Toolazeでは無料でオンラインAI画像作成を開始できます。利用量はクォータ、モデル提供状況、選択設定、アカウント状態によって変わる場合があります。' }, { q: '登録は必要ですか？', a: '開始に登録は不要です。生成ツールを開き、プロンプトを書き、設定を選んでオンラインで画像を作成できます。' }, { q: 'テキストからAI画像を生成するには？', a: '被写体、スタイル、レイアウト、背景、照明、アスペクト比、必要な正確な文字を説明するプロンプトを入力します。生成後に結果を確認し、プロンプトを改善します。' }, { q: '別の画像からAI画像を生成できますか？', a: 'はい。参照画像をアップロードし、背景、照明、スタイル、構図、シーンなど変更したい内容を説明して画像から画像生成を使えます。' }, { q: 'テキストから画像AI生成で何を作れますか？', a: 'テキストプロンプトから広告、ポスター、商品画像、サムネイル、SNSビジュアル、ポートレート、コンセプトアート、UIモックアップ、デザインドラフトを作れます。' }, { q: 'どのAI画像モデルを使うべきですか？', a: '一般的なテキストから画像にはGPT Image 2から始めてください。構造化レイアウトにはWan 2.7 Image、洗練された編集にはNano Banana Pro、高速バリエーションにはNano Banana 2が向いています。' }, { q: 'AI生成画像を商用利用できますか？', a: 'AI生成画像は、権利、ブランド、プラットフォーム、法的要件を満たす場合に商用ドラフトやプロジェクトで使えます。公開前に必ず最終画像を確認してください。' }, { q: 'AI画像生成に最適なプロンプトは？', a: '強いプロンプトは、アセットタイプ、被写体、スタイル、構図、文字、照明、出力目的、制約を明記します。画像編集では何を変えないかも書きます。' }, { q: 'AI画像生成ツールは読みやすい文字を作れますか？', a: 'モデルによって文字の得意不得意があります。短い正確なフレーズを引用符で指定し、配置を説明し、使用前にスペルを確認してください。' }, { q: 'Toolaze AI Image Generatorで何を作れますか？', a: '商品画像、ポスター、広告、サムネイル、SNSビジュアル、ポートレート、UIコンセプト、教育グラフィック、キャラクター案、参照ベース編集を作れます。' }] },
    cta: { title: 'オンラインでAI画像作成を開始', description: 'Toolaze AI Image Generatorでテキストプロンプトから画像を作成し、参照画像から編集し、AIモデルを比較し、商品、広告、サムネイル、SNS、教育、デザイン向けの実用的なビジュアルを作成できます。', button: '画像を生成' },
  },
}

localizedCopyOverrides.es = {
  metadata: { title: 'Generador de imágenes IA gratis online - sin registro | Toolaze', description: 'Crea imágenes IA gratis online sin registrarte. Usa Toolaze AI Image Generator para texto a imagen, imagen a imagen, productos, pósteres, anuncios, miniaturas y visuales para redes sociales.' },
  breadcrumbs: { home: 'Inicio', aiTools: 'Herramientas IA', current: 'Generador de imágenes IA' },
  hero: { highlight: 'Generador de imágenes IA', description: 'Crea imágenes IA online desde prompts de texto o imágenes de referencia. Usa Toolaze AI Image Generator en el navegador para imágenes de producto, pósteres, anuncios, miniaturas, retratos, visuales sociales, conceptos UI y ediciones guiadas por referencia.', badges: ['Gratis online', 'Sin registro', 'Texto a imagen', 'Imagen a imagen', 'Varios modelos IA', 'Borradores comerciales'] },
  samples: [{ title: 'Ejemplo de póster comercial' }, { title: 'Ejemplo de póster de evento' }, { title: 'Ejemplo de imagen de producto' }, { title: 'Ejemplo de concepto creativo' }],
  whatIs: { title: '¿Qué es un generador de imágenes IA?', paragraphs: ['Un generador de imágenes IA convierte prompts de texto, imágenes de referencia o instrucciones de edición en nuevos visuales. Puede crear fotos realistas, mockups de producto, pósteres, miniaturas, retratos, ilustraciones, conceptos UI y gráficos para redes sociales directamente en el navegador.', 'Toolaze funciona como generador de imágenes IA online gratis y como centro de selección de modelos. Empieza con un prompt simple, sube una referencia cuando la necesites y elige el modelo adecuado para texto más claro, staging de producto, edición, variaciones rápidas o layouts comerciales pulidos.', 'Úsalo para crear imágenes prácticas: productos, listados ecommerce, anuncios pagados, posts sociales, miniaturas de YouTube, conceptos de campaña, gráficos de presentación, ideas de personajes, referencias de diseño y borradores para revisión de clientes.'] },
  promise: { title: 'Generador de imágenes IA gratis sin registro', text: 'Empieza a crear imágenes sin instalar software de diseño ni crear una cuenta. Prueba prompts, compara direcciones visuales y genera borradores útiles rápidamente desde el navegador.', cards: [{ title: 'Gratis online', text: 'Abre el generador en tu navegador y empieza a crear borradores de imagen sin instalar software ni contratar una suite de diseño.' }, { title: 'Iteración creativa rápida', text: 'Prueba prompts, genera variaciones y compara modelos mientras mejoras anuncios, productos, miniaturas y diseños.' }, { title: 'Empieza sin registrarte', text: 'Comienza a generar imágenes sin crear cuenta. Iniciar sesión puede servir después para flujos guardados, créditos o mayor volumen.' }, { title: 'Útil para borradores comerciales', text: 'Crea anuncios, conceptos de producto, pósteres, miniaturas, visuales sociales y opciones de diseño para revisión antes de publicar.' }] },
  features: { title: 'Crea imágenes desde texto, imágenes e ideas', text: 'Usa Toolaze cuando necesites más que una imagen decorativa. Crea visuales con prompts, edita desde referencias, compara modelos y genera borradores para marketing, producto, diseño, educación y contenido.', items: [{ title: 'Generador texto a imagen', text: 'Convierte un prompt escrito en una imagen nueva. Describe sujeto, estilo, layout, fondo, iluminación, proporción y el texto exacto que debe aparecer.', alt: 'Generador IA de texto a imagen creando un póster de producto desde un prompt' }, { title: 'Generador IA imagen a imagen', text: 'Sube una imagen de referencia y pide cambios de fondo, estilo, luz, escena, composición o dirección visual manteniendo detalles importantes.', alt: 'Generador IA imagen a imagen editando una foto de producto de referencia', label: 'Abrir imagen a imagen' }, { title: 'Generador de imágenes de producto', text: 'Crea imágenes ecommerce, borradores para marketplaces, escenas lifestyle, mockups de empaque, visuales de temporada y hero shots limpios.', alt: 'Imagen de producto ecommerce generada por IA con fondo limpio' }, { title: 'Generador de pósteres y anuncios', text: 'Genera pósteres de campaña, anuncios sociales, gráficos de evento, visuales de lanzamiento, banners promocionales y layouts comerciales breves.', alt: 'Diseño de póster y anuncio generado por IA con titular legible', label: 'Ver prompts de anuncios' }, { title: 'Miniaturas y visuales sociales', text: 'Crea miniaturas de YouTube, hero images para blogs, posts sociales, gráficos de creador, ideas de perfil y ganchos visuales para scroll.', alt: 'Miniatura social generada por IA con layout llamativo' }, { title: 'Elección de modelo para mejores resultados', text: 'Cambia entre modelos de imagen cuando necesites mejor texto, edición con referencias, más pulido visual, salida rápida o variación creativa.', alt: 'Selector de modelos para generador de imágenes IA', label: 'Comparar modelos' }] },
  gallery: { title: 'Ejemplos de generador de imágenes IA', text: 'Explora resultados comunes que puedes crear con Toolaze: marketing, productos, conceptos UI, gráficos educativos, retratos, miniaturas y ediciones con referencia.', examples: [{ title: 'Póster de lanzamiento de producto', text: 'Crea un póster limpio con titular legible, producto protagonista, área de oferta y composición de campaña pulida.', alt: 'Ejemplo de póster de producto generado por IA' }, { title: 'Anuncio para redes sociales', text: 'Genera anuncios móviles con copy breve, contraste fuerte, beneficio claro y layout listo para feeds.', alt: 'Ejemplo de anuncio social generado por IA' }, { title: 'Concepto de mockup UI', text: 'Boceta pantallas de app, paneles de dashboard, tarjetas de onboarding o resúmenes de producto para exploración temprana.', alt: 'Ejemplo de mockup UI generado por IA' }, { title: 'Imagen de producto ecommerce', text: 'Convierte una idea o referencia en una imagen más limpia para marketplace, foto lifestyle, bundle o listado estacional.', alt: 'Ejemplo de imagen ecommerce generada por IA' }, { title: 'Miniatura de YouTube', text: 'Crea conceptos de miniatura con sujeto claro, composición expresiva, texto breve legible y contraste fuerte.', alt: 'Ejemplo de miniatura de YouTube generada por IA' }, { title: 'Infografía educativa', text: 'Crea visuales de estudio, diagramas científicos, explicadores históricos, procesos y gráficos de aula con etiquetas.', alt: 'Ejemplo de infografía educativa generada por IA' }, { title: 'Retrato o concepto de personaje', text: 'Genera retratos, avatares de creador, ideas de personajes, imágenes de perfil, estudios de estilo y referencias narrativas.', alt: 'Ejemplo de retrato y personaje generado por IA' }, { title: 'Edición guiada por referencia', text: 'Sube una referencia y cambia fondo, iluminación, composición o estilo mientras mantienes estable el sujeto principal.', alt: 'Ejemplo de edición guiada por referencia generada por IA' }] },
  models: { title: 'Elige el mejor modelo generador de imágenes IA', description: 'Cada modelo de imagen destaca en tareas distintas. Elige según el objetivo: texto legible, productos, edición con referencias, variaciones rápidas, diseños pulidos o exploración creativa.', cards: [{ text: 'Ideal para prompts texto a imagen limpios, texto breve legible, pósteres, anuncios de producto, mockups UI y gráficos comerciales.', label: 'Probar GPT Image 2' }, { text: 'Ideal para prompts estructurados, ediciones con varias referencias, layouts con mucho texto, razonamiento de prompt y sets de imágenes.', label: 'Probar Wan 2.7 Image' }, { text: 'Ideal para generación de alta calidad, ediciones con referencia, retratos, productos y borradores de campaña pulidos.', label: 'Probar Nano Banana Pro' }, { text: 'Ideal para generación diaria rápida, variantes creativas, muchas proporciones y borradores imagen a imagen.', label: 'Probar Nano Banana 2' }, { text: 'Ideal para visuales comerciales de producto, layouts tipográficos, seguimiento del prompt y composiciones de marca.', label: 'Probar Seedream 4.5' }, { text: 'Ideal para flujos ligeros, ideas de campaña, borradores visuales y experimentos rápidos de creadores.', label: 'Probar Seedream 5.0 Lite' }], comparisonTitle: 'Fortalezas por flujo de trabajo', headers: { model: 'Modelo', bestFor: 'Ideal para', output: 'Salida', references: 'Imágenes de referencia', textAndEditing: 'Texto y edición', watchouts: 'Revisar' }, rows: [{ bestFor: 'Pósteres, anuncios, mockups UI, miniaturas y layouts comerciales.', output: '1K, 2K, 4K. Ejemplos 4K incluyen 3840 x 2160 y 2160 x 3840. Borde máximo: 3840px.', references: 'Hasta 16 imágenes de entrada. Manejo fiel de referencias.', textAndEditing: 'Texto corto fuerte, layouts limpios y ediciones en lenguaje natural.', watchouts: 'Revisa ortografía, caras, manos y detalles de producto.' }, { bestFor: 'Pósteres estructurados, sets de imágenes, layouts con texto y anuncios de producto.', output: '1K, 2K, Pro 4K. Los modos estándar pueden no admitir 2.5K o 4K.', references: 'Hasta 9 imágenes de entrada.', textAndEditing: 'Fuerte control de layout, seguimiento del prompt y texto dentro de imagen.', watchouts: 'Mejor para instrucciones estructuradas que para prompts artísticos sueltos.' }, { bestFor: 'Imágenes creativas pulidas, retratos, producto y assets de campaña.', output: '1K, 2K, 4K.', references: 'Hasta 14 imágenes de referencia.', textAndEditing: 'Texto fuerte, conocimiento del mundo y prompts complejos.', watchouts: 'Mejor cuando importan más calidad y razonamiento que velocidad.' }, { bestFor: 'Variantes rápidas, gráficos sociales, proporciones amplias y ediciones.', output: '1K, 2K, 4K. Admite proporciones horizontales y verticales.', references: 'Hasta 14 imágenes de referencia.', textAndEditing: 'Buenos rótulos, gráficos de creador y ediciones rápidas imagen a imagen.', watchouts: 'Menos premium que Nano Banana Pro para campañas pulidas.' }, { bestFor: 'Visuales de producto, packaging, key visuals de marca y campañas.', output: '1K, 2K, 4K.', references: 'Hasta 14 imágenes de referencia.', textAndEditing: 'Fuerte seguimiento de prompt, tipografía y consistencia de referencia.', watchouts: 'Mejor para pulido comercial, no el flujo más ligero.' }, { bestFor: 'Ideas rápidas de producto, experimentos de creador y borradores ligeros.', output: '1K, 2K, 4K.', references: 'Hasta 14 imágenes de referencia.', textAndEditing: 'Buen seguimiento de prompt, variantes rápidas y conceptos de producto.', watchouts: 'Elige Seedream 4.5 para mayor pulido comercial.' }] },
  modes: { title: 'Flujos texto a imagen vs imagen a imagen', description: 'Muchos usuarios empiezan con texto a imagen para explorar rápido y pasan a imagen a imagen cuando necesitan más control. Toolaze combina ambos flujos con selección de modelos.', headers: { label: 'Pregunta', aiImageGenerator: 'Generador de imágenes IA', textToImage: 'Texto a imagen', imageToImage: 'Imagen a imagen' }, rows: [{ label: 'Qué significa', aiImageGenerator: 'Un lugar para crear, comparar y refinar visuales', textToImage: 'Crear una imagen nueva desde un prompt escrito', imageToImage: 'Subir una referencia y transformarla o cambiar su estilo' }, { label: 'Ideal para', aiImageGenerator: 'Creación amplia, elección de modelo y control del flujo', textToImage: 'Escenas nuevas, anuncios, pósteres, retratos, miniaturas', imageToImage: 'Ediciones con referencia, cambios de estilo, variantes de producto' }, { label: 'Entrada', aiImageGenerator: 'Prompt, referencia o ambos', textToImage: 'Prompt de texto', imageToImage: 'Imagen subida más instrucciones de edición' }, { label: 'Úsalo cuando', aiImageGenerator: 'Quieres probar prompts y modelos en un solo lugar', textToImage: 'Tienes la idea pero no una imagen fuente', imageToImage: 'Necesitas controlar sujeto, estilo, layout o composición' }, { label: 'Enfoque del prompt', aiImageGenerator: 'Objetivo, modelo, modo, formato de salida y uso', textToImage: 'Sujeto, escena, estilo, composición, texto, luz', imageToImage: 'Qué conservar, qué cambiar y resultado esperado' }] },
  prompts: { title: 'Plantillas de prompts IA para copiar', text: 'Copia un prompt, pégalo en el generador y ajusta sujeto, estilo de marca, formato y modelo para tu propia imagen.', copyButton: 'Copiar prompt', copiedButton: 'Copiado', examples: [{ title: 'Prompt de póster de producto', alt: 'Imagen de ejemplo para prompt de póster de producto' }, { title: 'Prompt de miniatura de YouTube', alt: 'Imagen de ejemplo para prompt de miniatura de YouTube' }, { title: 'Prompt de anuncio social', alt: 'Imagen de ejemplo para prompt de anuncio social' }, { title: 'Prompt de edición con referencia', alt: 'Imagen de ejemplo para prompt de edición con referencia' }, { title: 'Prompt de producto ecommerce', alt: 'Imagen de ejemplo para prompt ecommerce' }, { title: 'Prompt de mockup UI', alt: 'Imagen de ejemplo para prompt de mockup UI' }, { title: 'Prompt de hoja de personaje', alt: 'Imagen de ejemplo para prompt de hoja de personaje' }, { title: 'Prompt de infografía educativa', alt: 'Imagen de ejemplo para prompt de infografía educativa' }] },
  howTo: { schemaName: 'Cómo usar Toolaze AI Image Generator', title: 'Cómo generar imágenes IA online', description: 'Crea una imagen en pocos pasos y mejora el resultado con prompts más claros, referencias o un modelo distinto.', stepLabel: 'Paso', steps: [{ title: 'Escribe el prompt', text: 'Describe tipo de asset, sujeto, escena, estilo, ambiente, proporción y cualquier texto que deba aparecer.' }, { title: 'Sube una referencia', text: 'Añade una referencia si quieres mantener producto, rostro, objeto, pose, layout, habitación, boceto o dirección visual.' }, { title: 'Elige el modelo', text: 'Selecciona un modelo según la tarea: texto a imagen, edición, producto, anuncios sociales o variaciones rápidas.' }, { title: 'Genera y revisa', text: 'Revisa ortografía, caras, manos, claims de marca, detalles de producto y composición antes de publicar.' }, { title: 'Refina el resultado', text: 'Ajusta una parte del prompt cada vez, cambia de modelo o sube una referencia mejor para más control.' }] },
  useCases: { title: 'Casos de uso populares de imágenes IA', description: 'Pasa de idea a borrador visual para assets de negocio, contenido de creadores, exploración de diseño y revisión rápida de clientes.', cards: [{ title: 'Anuncios y visuales de producto', text: 'Genera pósteres de lanzamiento, conceptos para paid social, mockups ecommerce, ideas de empaque y campañas estacionales.' }, { title: 'Miniaturas y posts sociales', text: 'Crea miniaturas de YouTube, portadas TikTok, gráficos Instagram, posts de creador, imágenes reacción y formatos compartibles.' }, { title: 'Retratos y personajes', text: 'Crea conceptos de perfil, hojas de personaje, retratos estilizados, avatares y direcciones creativas fáciles de referenciar.' }, { title: 'Pósteres y layouts con texto', text: 'Boceta pósteres de evento, gráficos de cita, portadas de presentación, layouts editoriales y diseños breves con texto.' }, { title: 'Conceptos UI y marca', text: 'Explora pantallas de app, visuales de landing page, moodboards de marca, gráficos de función y direcciones iniciales.' }, { title: 'Ideas de edición de imagen', text: 'Empieza con texto o sube una referencia y cambia fondo, estilo, luz, composición o propósito.' }, { title: 'Educación y explicadores', text: 'Crea infografías, diagramas de clase, visuales de proceso, ayudas de estudio, charts etiquetados y gráficos de presentación.' }, { title: 'Edición con referencia', text: 'Edita fotos de producto, cambia fondos, reestiliza habitaciones, mejora iluminación, crea variantes y convierte referencias en borradores pulidos.' }] },
  related: { title: 'Herramientas IA de imagen relacionadas', description: 'Continúa con una página de modelo especializada o usa otras herramientas Toolaze para editar, comprimir, convertir o comparar modelos.', cards: [{ title: 'Herramientas IA', text: 'Explora más herramientas IA para imagen, video, escritura, productividad y flujos creativos.', label: 'Ver herramientas IA' }, { title: 'Modelos IA', text: 'Compara modelos de imagen y video de Toolaze por tarea, estilo de salida, familia y workflow creativo.', label: 'Ver modelos' }, { title: 'Generador imagen a imagen IA', text: 'Sube una referencia, describe la edición y crea variantes controladas, productos, fondos o restyles.', label: 'Editar desde imagen' }, { text: 'Usa GPT Image 2 para pósteres, anuncios de producto, texto legible, mockups UI e imágenes estructuradas.', label: 'Probar GPT Image 2' }, { title: 'Prompts GPT Image 2', text: 'Explora estructuras de prompts para imágenes con texto, productos, UI y layouts de campaña.', label: 'Abrir prompts' }, { title: 'Prompts de publicidad', text: 'Usa plantillas enfocadas en lanzamientos, campañas sociales, paid creative y miniaturas.', label: 'Ver publicidad' }, { title: 'Convertidor de imágenes', text: 'Convierte imágenes IA descargadas entre JPG, PNG, WebP y HEIC para publicación.', label: 'Convertir imágenes' }, { title: 'Compresor de imágenes', text: 'Comprime imágenes generadas para web, ecommerce, redes sociales y mayor velocidad.', label: 'Comprimir imágenes' }] },
  faq: { title: 'FAQ del generador de imágenes IA', description: 'Respuestas rápidas sobre uso gratis, acceso sin registro, texto a imagen, imagen a imagen, modelos y revisión comercial.', items: [{ q: '¿Qué es un generador de imágenes IA?', a: 'Un generador de imágenes IA crea imágenes desde prompts de texto, referencias o instrucciones de edición para productos, pósteres, anuncios, miniaturas, retratos, UI y redes sociales.' }, { q: '¿Este generador de imágenes IA es gratis?', a: 'Sí. Toolaze permite empezar a crear imágenes IA online gratis. El uso puede variar por cuota, disponibilidad del modelo, ajustes elegidos y estado de cuenta.' }, { q: '¿Necesito registrarme?', a: 'No necesitas registrarte para empezar. Abre el generador, escribe un prompt, elige ajustes y crea imágenes online.' }, { q: '¿Cómo genero imágenes IA desde texto?', a: 'Escribe un prompt con sujeto, estilo, layout, fondo, luz, proporción y texto exacto si hace falta. Genera, revisa y refina.' }, { q: '¿Puedo generar imágenes IA desde otra imagen?', a: 'Sí. Sube una referencia y describe qué debe cambiar, como fondo, luz, estilo, composición o escena.' }, { q: '¿Qué puedo crear con texto a imagen?', a: 'Puedes crear anuncios, pósteres, productos, miniaturas, visuales sociales, retratos, concept art, mockups UI y diseños.' }, { q: '¿Qué modelo de imagen IA debo usar?', a: 'Empieza con GPT Image 2 para texto a imagen general. Usa Wan 2.7 Image para layouts estructurados, Nano Banana Pro para ediciones pulidas y Nano Banana 2 para variantes rápidas.' }, { q: '¿Puedo usar imágenes IA comercialmente?', a: 'Las imágenes IA pueden usarse como borradores y proyectos comerciales si cumplen requisitos de derechos, marca, plataforma y legales. Revisa siempre el resultado final.' }, { q: '¿Qué prompt funciona mejor?', a: 'Un buen prompt indica tipo de asset, sujeto, estilo, composición, texto, luz, propósito y restricciones. Para editar, di qué debe permanecer igual.' }, { q: '¿Puede crear texto legible?', a: 'Algunos modelos son mejores que otros. Usa frases cortas exactas, entre comillas, indica ubicación y revisa ortografía antes de usar.' }, { q: '¿Qué puedo crear con Toolaze AI Image Generator?', a: 'Puedes crear productos, pósteres, anuncios, miniaturas, visuales sociales, retratos, UI, educación, personajes y ediciones con referencia.' }] },
  cta: { title: 'Empieza a crear imágenes IA online', description: 'Usa Toolaze AI Image Generator para crear desde texto, editar con referencias, comparar modelos y producir visuales prácticos para productos, anuncios, miniaturas, redes, educación y diseño.', button: 'Generar imagen' },
}

localizedCopyOverrides['zh-TW'] = {
  metadata: { title: '免費 AI 圖像產生器 - 免註冊 | Toolaze', description: '免註冊免費在線建立 AI 圖像。使用 Toolaze AI Image Generator 製作文字轉圖像、圖像轉圖像、商品圖、海報、廣告、縮圖與社群視覺。' },
  breadcrumbs: { home: '首頁', aiTools: 'AI 工具', current: 'AI 圖像產生器' },
  hero: { highlight: 'AI 圖像產生器', description: '從文字提示或參考圖片在線建立 AI 圖像。Toolaze AI Image Generator 可直接在瀏覽器製作商品圖、海報、廣告、縮圖、人像、社群視覺、UI 概念與參考導向編輯。', badges: ['免費在線', '免註冊', '文字轉圖像', '圖像轉圖像', '多種 AI 模型', '商用草稿'] },
  samples: [{ title: '商業海報範例' }, { title: '活動海報範例' }, { title: '商品圖範例' }, { title: '創意概念範例' }],
  whatIs: { title: '什麼是 AI 圖像產生器？', paragraphs: ['AI 圖像產生器會把文字提示、參考圖片或編輯指令轉成新的視覺內容。它能直接在瀏覽器建立寫實照片、商品 mockup、海報、縮圖、人像、插畫、UI 概念與社群圖像。', 'Toolaze 是免費在線 AI 圖像產生器，也提供模型選擇。你可以先輸入簡單提示，需要時上傳參考圖片，再依照文字呈現、商品場景、圖片編輯、快速變體或商業版面選擇合適模型。', '適合實務圖像創作：商品圖、電商刊登、付費廣告、社群貼文、YouTube 縮圖、活動概念、簡報圖像、角色想法、設計參考與客戶審稿草稿。'] },
  promise: { title: '免註冊免費 AI 圖像產生器', text: '不用安裝設計軟體，也不用建立帳號，就能開始建立圖片。快速測試提示、比較視覺方向，並在瀏覽器生成可用草稿。', cards: [{ title: '免費在線', text: '在瀏覽器開啟產生器即可開始建立圖片草稿，不必安裝軟體或設定付費設計套件。' }, { title: '快速創意迭代', text: '在調整廣告、商品圖、縮圖與設計草稿時，測試提示、生成變體並比較模型。' }, { title: '免註冊開始', text: '不用建立帳號也能開始生成圖片。之後若需要保存流程、點數或更高用量，可再登入。' }, { title: '適合商用草稿', text: '建立廣告、商品概念、海報、縮圖、社群視覺與設計選項，用於發布前審核。' }] },
  features: { title: '從文字、圖片與想法建立圖像', text: '當你需要的不只是裝飾圖時，可以使用 Toolaze 建立提示型視覺、參考圖片編輯、模型比較，以及行銷、商品、設計、教育與內容流程中的圖片草稿。', items: [{ title: '文字轉圖像產生器', text: '把文字提示轉成新圖片。描述主體、風格、版面、背景、光線、比例，以及圖片中應出現的精確文字。', alt: 'AI 文字轉圖像產生器從提示建立商品海報' }, { title: 'AI 圖像轉圖像產生器', text: '上傳參考圖片，要求模型改變背景、風格、光線、場景、商品配置、構圖或視覺方向，同時保留重要細節。', alt: 'AI 圖像轉圖像產生器編輯參考商品照', label: '開啟圖像轉圖像' }, { title: '商品圖產生器', text: '建立電商商品圖、市集刊登草稿、生活風場景、包裝 mockup、季節商品視覺與乾淨商品主圖。', alt: 'AI 生成的乾淨背景電商商品主圖' }, { title: '海報與廣告產生器', text: '生成活動海報、付費社群廣告、活動圖、上市視覺、促銷 banner 與短文案商業版面。', alt: 'AI 生成含可讀標題的海報與廣告設計', label: '瀏覽廣告提示' }, { title: '縮圖與社群視覺', text: '製作 YouTube 縮圖、部落格主視覺、社群貼文、創作者圖像、個人檔案概念與吸睛視覺鉤子。', alt: 'AI 生成的大膽版面社群縮圖' }, { title: '選擇模型取得更好結果', text: '當提示需要更強文字呈現、參考編輯、視覺精修、快速輸出或更多創意變體時，可切換支援的圖片模型。', alt: '顯示多種圖片模型的 AI 圖像產生器選擇器', label: '比較模型' }] },
  gallery: { title: 'AI 圖像產生器範例', text: '探索你可以用 Toolaze 建立的常見成果，包含行銷圖片、商品視覺、UI 概念、教育圖像、人像、縮圖與參考導向編輯。', examples: [{ title: '商品上市海報', text: '建立包含可讀標題、商品主視覺、優惠區與精緻活動構圖的乾淨商品海報。', alt: 'AI 生成商品上市海報範例' }, { title: '社群媒體廣告', text: '生成短文案、高對比、明確利益點與行動版面友善的吸睛社群廣告。', alt: 'AI 生成社群媒體廣告範例' }, { title: 'UI Mockup 概念', text: '為早期設計探索建立 App 畫面、dashboard 面板、onboarding 卡片或產品功能概覽。', alt: 'AI 生成 UI mockup 概念範例' }, { title: '電商商品圖', text: '把商品想法或參考變成更乾淨的市集圖片、生活風照片、組合圖或季節刊登草稿。', alt: 'AI 生成電商商品圖範例' }, { title: 'YouTube 縮圖', text: '建立主體清楚、構圖有表情、短文字可讀且對比強烈的縮圖概念。', alt: 'AI 生成 YouTube 縮圖範例' }, { title: '教育資訊圖', text: '建立學習視覺、科學圖解、歷史說明、流程圖與含區塊標籤的課堂圖像。', alt: 'AI 生成教育資訊圖範例' }, { title: '人像或角色概念', text: '生成肖像、創作者頭像、角色想法、個人檔案圖片、風格研究與敘事參考。', alt: 'AI 生成人像與角色概念範例' }, { title: '參考導向編輯', text: '上傳參考圖片，在保持主體穩定的同時改變背景、光線、構圖或風格。', alt: 'AI 生成參考導向編輯範例' }] },
  models: { title: '選擇最佳 AI 圖像產生模型', description: '不同圖片模型適合不同工作。依輸出目標選擇：可讀文字、商品圖、參考編輯、快速變體、精緻設計草稿或創意探索。', cards: [{ text: '適合乾淨文字轉圖像提示、可讀短文字、海報、商品廣告、UI mockup 與商業圖像。', label: '試用 GPT Image 2' }, { text: '適合結構化提示、多參考編輯、文字較多版面、提示推理與圖片組。', label: '試用 Wan 2.7 Image' }, { text: '適合高品質圖像生成、參考編輯、人像、商品照與精緻活動草稿。', label: '試用 Nano Banana Pro' }, { text: '適合日常快速圖片、快速創意變體、多種比例與圖像轉圖像草稿。', label: '試用 Nano Banana 2' }, { text: '適合商業商品視覺、文字導向版面、提示遵循與品牌風格構圖。', label: '試用 Seedream 4.5' }, { text: '適合輕量圖片生成流程、活動想法、圖片草稿與快速創作者實驗。', label: '試用 Seedream 5.0 Lite' }], comparisonTitle: '依工作流程比較模型強項', headers: { model: '模型', bestFor: '最適合', output: '輸出', references: '參考圖片', textAndEditing: '文字與編輯', watchouts: '注意事項' }, rows: [{ bestFor: '海報、廣告、UI mockup、縮圖、商業版面。', output: '1K、2K、4K。4K 範例包含 3840 x 2160 與 2160 x 3840。最大邊：3840px。', references: '最多 16 張輸入圖片。高保真參考處理。', textAndEditing: '短文字、乾淨版面與自然語言編輯表現強。', watchouts: '檢查拼字、臉、手與商品細節。' }, { bestFor: '結構化海報、圖片組、文字較多版面、商品廣告。', output: '1K、2K、Pro 4K。標準模式可能不支援 2.5K 或 4K。', references: '最多 9 張輸入圖片。', textAndEditing: '版面控制、提示遵循與圖片內文字表現強。', watchouts: '更適合結構化指令，不適合鬆散藝術提示。' }, { bestFor: '精緻創意圖、人像、商品照、活動素材。', output: '1K、2K、4K。', references: '最多 14 張參考圖片。', textAndEditing: '文字呈現、世界知識與複雜提示表現強。', watchouts: '品質和推理比速度更重要時最適合。' }, { bestFor: '快速變體、社群圖、多種比例、圖片編輯。', output: '1K、2K、4K。支援寬版與直式比例。', references: '最多 14 張參考圖片。', textAndEditing: '適合標籤、創作者圖像與快速圖像轉圖像編輯。', watchouts: '精緻活動不如 Nano Banana Pro 高級。' }, { bestFor: '商品視覺、包裝、品牌主視覺、活動草稿。', output: '1K、2K、4K。', references: '最多 14 張參考圖片。', textAndEditing: '提示遵循、字體排版與參考一致性強。', watchouts: '適合商業精修，不是最輕量流程。' }, { bestFor: '快速商品想法、創作者實驗、輕量草稿。', output: '1K、2K、4K。', references: '最多 14 張參考圖片。', textAndEditing: '提示遵循佳、快速變體、商品概念。', watchouts: '若要更高商業精緻度，選 Seedream 4.5。' }] },
  modes: { title: '文字轉圖像 vs 圖像轉圖像工作流程', description: '多數使用者會先用文字轉圖像快速探索，當需要更多控制時再改用圖像轉圖像。Toolaze 結合兩種流程與模型選擇。', headers: { label: '問題', aiImageGenerator: 'AI 圖像產生器', textToImage: '文字轉圖像', imageToImage: '圖像轉圖像' }, rows: [{ label: '意思', aiImageGenerator: '建立、比較與優化視覺的一個地方', textToImage: '從文字提示建立新圖片', imageToImage: '上傳參考圖片並轉換或重設風格' }, { label: '最適合', aiImageGenerator: '廣泛圖片建立、模型選擇與流程控制', textToImage: '新場景、廣告、海報、人像、縮圖', imageToImage: '參考編輯、風格變更、商品變體' }, { label: '輸入', aiImageGenerator: '提示、參考圖片或兩者', textToImage: '文字提示', imageToImage: '上傳圖片加編輯指令' }, { label: '使用時機', aiImageGenerator: '想在一處測試提示和模型時', textToImage: '有圖片想法但沒有來源圖時', imageToImage: '需要控制主體、風格、版面或構圖時' }, { label: '提示重點', aiImageGenerator: '目標、模型、模式、輸出格式與用途', textToImage: '主體、場景、風格、構圖、文字、光線', imageToImage: '要保留什麼、要改什麼、目標結果' }] },
  prompts: { title: '可複製的 AI 圖像提示模板', text: '複製提示，貼到產生器，再依你的圖片調整主體、品牌風格、格式與模型。', copyButton: '複製提示', copiedButton: '已複製', examples: [{ title: '商品海報提示', alt: '商品海報提示範例圖片' }, { title: 'YouTube 縮圖提示', alt: 'YouTube 縮圖提示範例圖片' }, { title: '社群廣告提示', alt: '社群廣告提示範例圖片' }, { title: '參考編輯提示', alt: '參考編輯提示範例圖片' }, { title: '電商商品提示', alt: '電商商品提示範例圖片' }, { title: 'UI Mockup 提示', alt: 'UI mockup 提示範例圖片' }, { title: '角色設定表提示', alt: '角色設定表提示範例圖片' }, { title: '教育資訊圖提示', alt: '教育資訊圖提示範例圖片' }] },
  howTo: { schemaName: '如何使用 Toolaze AI 圖像產生器', title: '如何在線生成 AI 圖像', description: '幾個步驟建立圖片，並用更清楚的提示、參考圖片或其他模型改善結果。', stepLabel: '步驟', steps: [{ title: '撰寫提示', text: '描述素材類型、主體、場景、風格、氛圍、比例與圖片中要出現的文字。' }, { title: '上傳參考圖片', text: '當你要保留商品、臉、物件、姿勢、版面、房間、草圖或視覺方向時加入參考圖。' }, { title: '選擇模型', text: '依任務選擇模型，例如文字轉圖像、圖片編輯、商品視覺、社群廣告或快速提示變體。' }, { title: '生成並檢查', text: '發布前檢查拼字、臉、手、品牌文字、商品細節與構圖。' }, { title: '改善結果', text: '一次調整提示的一部分，必要時切換模型，或上傳更好的參考圖取得更高控制。' }] },
  useCases: { title: '熱門 AI 圖像用途', description: '把想法轉成商業素材、創作者內容、設計探索與快速客戶審核用的視覺草稿。', cards: [{ title: '廣告與商品視覺', text: '生成商品上市海報、付費社群概念、電商 mockup、包裝想法與季節活動圖。' }, { title: '縮圖與社群貼文', text: '建立 YouTube 縮圖、TikTok 封面、Instagram 圖像、創作者貼文、反應圖與分享格式。' }, { title: '人像與角色藝術', text: '建立個人檔案概念、角色設定表、風格化人像、頭像與容易參考的創意方向。' }, { title: '海報與文字版面', text: '草擬活動海報、引用圖、簡報封面、編輯風版面與短文字設計。' }, { title: 'UI 與品牌概念', text: '探索 App 畫面、landing page 視覺、品牌 moodboard、功能圖與早期設計方向。' }, { title: '圖片編輯想法', text: '從文字開始或上傳參考圖片，改變背景、風格、光線、構圖或用途。' }, { title: '教育與說明', text: '建立資訊圖、課堂圖解、流程視覺、學習輔助、標籤 chart 與簡報教育圖。' }, { title: '參考導向編輯', text: '編輯商品照、替換背景、重塑室內風格、改善光線、建立變體，並把粗略參考變成精緻草稿。' }] },
  related: { title: '相關 AI 圖像工具', description: '若工作流程需要編輯、壓縮、轉檔或模型比較，可前往專門模型頁或其他 Toolaze 工具。', cards: [{ title: 'AI 工具', text: '探索更多圖片、影片、寫作、生產力與創意流程的 AI 工具。', label: '查看 AI 工具' }, { title: 'AI 模型', text: '依任務、輸出風格、模型系列與創意流程比較 Toolaze 圖像與影片模型。', label: '查看模型' }, { title: 'AI 圖像轉圖像產生器', text: '上傳參考圖、描述要修改的內容，建立受控變體、商品照、背景替換或風格重塑。', label: '從圖片編輯' }, { text: '使用 GPT Image 2 製作海報、商品廣告、可讀文字、UI mockup 與結構化圖片。', label: '試用 GPT Image 2' }, { title: 'GPT Image 2 提示', text: '探索文字較多圖片、商品視覺、UI mockup 與活動版面的提示結構。', label: '開啟提示' }, { title: '廣告提示', text: '使用產品上市、社群活動、付費創意與縮圖概念的廣告提示模板。', label: '瀏覽廣告' }, { title: '圖片轉檔', text: '把下載的 AI 圖片轉成 JPG、PNG、WebP 或 HEIC，用於發布流程。', label: '轉換圖片' }, { title: '圖片壓縮', text: '壓縮生成圖片，用於網頁發布、電商刊登、社群上傳與更快載入。', label: '壓縮圖片' }] },
  faq: { title: 'AI 圖像產生器 FAQ', description: '關於免費使用、免註冊、文字轉圖像、圖像轉圖像、模型選擇與商用檢查的快速回答。', items: [{ q: '什麼是 AI 圖像產生器？', a: 'AI 圖像產生器會從文字提示、參考圖片或編輯指令建立圖片，可製作商品圖、海報、廣告、縮圖、人像、插畫、UI 概念與社群視覺。' }, { q: '這個 AI 圖像產生器免費嗎？', a: '是。Toolaze 可免費在線開始建立 AI 圖像。用量可能依配額、模型可用性、選擇設定與帳號狀態而異。' }, { q: '需要註冊嗎？', a: '開始不需要註冊。你可以開啟產生器、撰寫提示、選擇設定並在線建立圖片。' }, { q: '如何從文字生成 AI 圖像？', a: '輸入描述主體、風格、版面、背景、光線、比例與必要精確文字的提示，生成後檢查並優化。' }, { q: '可以從另一張圖片生成 AI 圖像嗎？', a: '可以。上傳參考圖片並描述要改變的背景、光線、風格、構圖或場景。' }, { q: '文字轉圖像可以製作什麼？', a: '可以從文字提示製作廣告、海報、商品圖、縮圖、社群視覺、人像、概念藝術、UI mockup 與設計草稿。' }, { q: '應該使用哪個 AI 圖像模型？', a: '一般文字轉圖像可從 GPT Image 2 開始；結構化版面用 Wan 2.7 Image，精緻編輯用 Nano Banana Pro，快速變體用 Nano Banana 2。' }, { q: 'AI 生成圖片可以商用嗎？', a: '若符合你的權利、品牌、平台與法律要求，AI 生成圖片可用於商用草稿與專案。發布前請務必審核最終圖片。' }, { q: '什麼提示最適合 AI 圖像生成？', a: '好的提示會說明素材類型、主體、風格、構圖、文字、光線、輸出用途與限制。圖片編輯時也要說明哪些內容不變。' }, { q: 'AI 圖像產生器能做出可讀文字嗎？', a: '不同模型文字能力不同。使用短且精確的詞句、加上引號、描述位置，並在使用前檢查拼字。' }, { q: 'Toolaze AI Image Generator 可以建立什麼？', a: '可以建立商品圖、海報、廣告、縮圖、社群視覺、人像、UI 概念、教育圖像、角色想法與參考導向編輯。' }] },
  cta: { title: '開始在線建立 AI 圖像', description: '使用 Toolaze AI Image Generator 從文字建立圖片、用參考圖編輯、比較 AI 模型，並製作商品、廣告、縮圖、社群、教育與設計用實用視覺。', button: '生成圖片' },
}

const romanceOverrides: Partial<Record<AiImageGeneratorLocale, {
  metadataTitle: string
  metadataDescription: string
  home: string
  aiTools: string
  current: string
  highlight: string
  heroDescription: string
  badges: string[]
  whatIsTitle: string
  promiseTitle: string
  featuresTitle: string
  galleryTitle: string
  modelsTitle: string
  modesTitle: string
  promptsTitle: string
  howToTitle: string
  useCasesTitle: string
  relatedTitle: string
  faqTitle: string
  ctaTitle: string
  ctaButton: string
  modesDescription: string
  modesHeaders: {
    label: string
    aiImageGenerator: string
    textToImage: string
    imageToImage: string
  }
  modesRows: ComparisonRow[]
}>> = {
  pt: {
    metadataTitle: 'Gerador de imagens IA grátis online - sem cadastro | Toolaze',
    metadataDescription: 'Crie imagens IA grátis online sem cadastro. Use o gerador de imagens IA da Toolaze para texto para imagem, imagem para imagem, produtos, pôsteres, anúncios, miniaturas e redes sociais.',
    home: 'Início',
    aiTools: 'Ferramentas IA',
    current: 'Gerador de imagens IA',
    highlight: 'Gerador de imagens IA',
    heroDescription: 'Crie imagens IA online a partir de instruções de texto ou imagens de referência. Use o gerador de imagens IA da Toolaze no navegador para produtos, pôsteres, anúncios, miniaturas, retratos, redes sociais, conceitos UI e edições com referência.',
    badges: ['Grátis online', 'Sem cadastro', 'Texto para imagem', 'Imagem para imagem', 'Vários modelos IA', 'Rascunhos comerciais'],
    whatIsTitle: 'O que é um gerador de imagens IA?',
    promiseTitle: 'Gerador de imagens IA grátis sem cadastro',
    featuresTitle: 'Crie imagens a partir de texto, imagens e ideias',
    galleryTitle: 'Exemplos de gerador de imagens IA',
    modelsTitle: 'Escolha o melhor modelo gerador de imagens IA',
    modesTitle: 'Fluxos texto para imagem vs imagem para imagem',
    promptsTitle: 'Modelos de instruções IA para copiar',
    howToTitle: 'Como gerar imagens IA online',
    useCasesTitle: 'Casos de uso populares para imagens IA',
    relatedTitle: 'Ferramentas IA de imagem relacionadas',
    faqTitle: 'Perguntas frequentes sobre o gerador de imagens IA',
    ctaTitle: 'Comece a criar imagens IA online',
    ctaButton: 'Gerar imagem',
    modesDescription: 'A maioria dos usuários começa com texto para imagem para explorar rapidamente e passa para imagem para imagem quando precisa de mais controle. O Toolaze combina os dois fluxos com seleção de modelos.',
    modesHeaders: { label: 'Pergunta', aiImageGenerator: 'Gerador de imagens IA', textToImage: 'Texto para imagem', imageToImage: 'Imagem para imagem' },
    modesRows: [
      { label: 'O que significa', aiImageGenerator: 'Um lugar para criar, comparar e refinar visuais', textToImage: 'Criar uma nova imagem a partir de uma instrução escrita', imageToImage: 'Enviar uma imagem de referência e transformar ou mudar seu estilo' },
      { label: 'Melhor para', aiImageGenerator: 'Criação ampla de imagens, escolha de modelo e controle do fluxo', textToImage: 'Novas cenas, anúncios, pôsteres, retratos e miniaturas', imageToImage: 'Edições com referência, mudanças de estilo e variações de produto' },
      { label: 'Entrada', aiImageGenerator: 'Instrução, imagem de referência ou ambos', textToImage: 'Instrução de texto', imageToImage: 'Imagem enviada mais instruções de edição' },
      { label: 'Quando usar', aiImageGenerator: 'Você quer testar instruções e modelos em um só lugar', textToImage: 'Você tem a ideia da imagem, mas não tem uma imagem de origem', imageToImage: 'Você precisa controlar assunto, estilo, layout ou composição' },
      { label: 'Foco da instrução', aiImageGenerator: 'Objetivo, modelo, modo, formato de saída e uso', textToImage: 'Assunto, cena, estilo, composição, texto e iluminação', imageToImage: 'O que preservar, o que mudar e o resultado desejado' },
    ],
  },
  fr: {
    metadataTitle: 'Générateur d’images IA gratuit en ligne - sans inscription | Toolaze',
    metadataDescription: 'Créez des images IA gratuitement en ligne sans inscription. Utilisez Toolaze AI Image Generator pour texte vers image, image vers image, produits, affiches, annonces, miniatures et visuels sociaux.',
    home: 'Accueil',
    aiTools: 'Outils IA',
    current: 'Générateur d’images IA',
    highlight: 'Générateur d’images IA',
    heroDescription: 'Créez des images IA en ligne depuis des prompts texte ou des images de référence. Utilisez Toolaze AI Image Generator dans le navigateur pour produits, affiches, annonces, miniatures, portraits, réseaux sociaux, concepts UI et éditions guidées par référence.',
    badges: ['Gratuit en ligne', 'Sans inscription', 'Texte vers image', 'Image vers image', 'Plusieurs modèles IA', 'Brouillons commerciaux'],
    whatIsTitle: 'Qu’est-ce qu’un générateur d’images IA ?',
    promiseTitle: 'Générateur d’images IA gratuit sans inscription',
    featuresTitle: 'Créez des images depuis du texte, des images et des idées',
    galleryTitle: 'Exemples de générateur d’images IA',
    modelsTitle: 'Choisir le meilleur modèle de génération d’images IA',
    modesTitle: 'Flux texte vers image vs image vers image',
    promptsTitle: 'Modèles de prompts IA à copier',
    howToTitle: 'Comment générer des images IA en ligne',
    useCasesTitle: 'Cas d’usage populaires pour les images IA',
    relatedTitle: 'Outils IA d’image associés',
    faqTitle: 'FAQ du générateur d’images IA',
    ctaTitle: 'Commencez à créer des images IA en ligne',
    ctaButton: 'Générer une image',
    modesDescription: 'La plupart des utilisateurs commencent par le texte vers image pour explorer rapidement, puis passent à l’image vers image lorsqu’ils ont besoin de plus de contrôle. Toolaze combine les deux flux avec le choix du modèle.',
    modesHeaders: { label: 'Question', aiImageGenerator: 'Générateur d’images IA', textToImage: 'Texte vers image', imageToImage: 'Image vers image' },
    modesRows: [
      { label: 'Ce que cela signifie', aiImageGenerator: 'Un seul espace pour créer, comparer et affiner des visuels', textToImage: 'Créer une nouvelle image depuis un prompt écrit', imageToImage: 'Importer une image de référence et la transformer ou la restyler' },
      { label: 'Idéal pour', aiImageGenerator: 'Création d’images large, choix du modèle et contrôle du workflow', textToImage: 'Nouvelles scènes, annonces, affiches, portraits et miniatures', imageToImage: 'Éditions avec référence, changements de style et variantes produit' },
      { label: 'Entrée', aiImageGenerator: 'Prompt, image de référence ou les deux', textToImage: 'Prompt texte', imageToImage: 'Image importée avec instructions d’édition' },
      { label: 'À utiliser quand', aiImageGenerator: 'Vous voulez tester prompts et modèles au même endroit', textToImage: 'Vous connaissez l’idée, mais n’avez pas d’image source', imageToImage: 'Vous devez contrôler le sujet, le style, la mise en page ou la composition' },
      { label: 'Focus du prompt', aiImageGenerator: 'Objectif, modèle, mode, format de sortie et usage', textToImage: 'Sujet, scène, style, composition, texte et éclairage', imageToImage: 'Ce qu’il faut conserver, modifier et le résultat attendu' },
    ],
  },
  it: {
    metadataTitle: 'Generatore di immagini IA gratis online - senza registrazione | Toolaze',
    metadataDescription: 'Crea immagini IA gratis online senza registrarti. Usa Toolaze AI Image Generator per testo in immagine, immagine in immagine, prodotti, poster, annunci, thumbnail e visual social.',
    home: 'Home',
    aiTools: 'Strumenti IA',
    current: 'Generatore di immagini IA',
    highlight: 'Generatore di immagini IA',
    heroDescription: 'Crea immagini IA online da prompt testuali o immagini di riferimento. Usa Toolaze AI Image Generator nel browser per prodotti, poster, annunci, thumbnail, ritratti, visual social, concept UI ed editing guidato da riferimenti.',
    badges: ['Gratis online', 'Senza registrazione', 'Testo in immagine', 'Immagine in immagine', 'Più modelli IA', 'Bozze commerciali'],
    whatIsTitle: 'Cos’è un generatore di immagini IA?',
    promiseTitle: 'Generatore di immagini IA gratis senza registrazione',
    featuresTitle: 'Crea immagini da testo, immagini e idee',
    galleryTitle: 'Esempi di generatore di immagini IA',
    modelsTitle: 'Scegli il miglior modello generatore di immagini IA',
    modesTitle: 'Flussi testo in immagine vs immagine in immagine',
    promptsTitle: 'Template di prompt IA da copiare',
    howToTitle: 'Come generare immagini IA online',
    useCasesTitle: 'Casi d’uso popolari per immagini IA',
    relatedTitle: 'Strumenti IA per immagini correlati',
    faqTitle: 'FAQ generatore di immagini IA',
    ctaTitle: 'Inizia a creare immagini IA online',
    ctaButton: 'Genera immagine',
    modesDescription: 'La maggior parte degli utenti inizia con testo in immagine per esplorare rapidamente, poi passa a immagine in immagine quando serve più controllo. Toolaze combina entrambi i flussi con la scelta del modello.',
    modesHeaders: { label: 'Domanda', aiImageGenerator: 'Generatore di immagini IA', textToImage: 'Testo in immagine', imageToImage: 'Immagine in immagine' },
    modesRows: [
      { label: 'Cosa significa', aiImageGenerator: 'Un unico posto per creare, confrontare e rifinire visual', textToImage: 'Creare una nuova immagine da un prompt scritto', imageToImage: 'Caricare un’immagine di riferimento e trasformarla o cambiarne lo stile' },
      { label: 'Ideale per', aiImageGenerator: 'Creazione ampia di immagini, scelta del modello e controllo del workflow', textToImage: 'Nuove scene, annunci, poster, ritratti e thumbnail', imageToImage: 'Editing con riferimento, cambi di stile e varianti prodotto' },
      { label: 'Input', aiImageGenerator: 'Prompt, immagine di riferimento o entrambi', textToImage: 'Prompt testuale', imageToImage: 'Immagine caricata più istruzioni di editing' },
      { label: 'Usalo quando', aiImageGenerator: 'Vuoi testare prompt e modelli in un solo posto', textToImage: 'Hai l’idea dell’immagine ma non una sorgente visiva', imageToImage: 'Devi controllare soggetto, stile, layout o composizione' },
      { label: 'Focus del prompt', aiImageGenerator: 'Obiettivo, modello, modalità, formato di output e uso', textToImage: 'Soggetto, scena, stile, composizione, testo e luce', imageToImage: 'Cosa preservare, cosa cambiare e risultato desiderato' },
    ],
  },
}

const romanceDeepOverrides: Partial<Record<AiImageGeneratorLocale, DeepPartial<AiImageGeneratorPageCopy>>> = {
  pt: {
    samples: [{ title: 'Exemplo de pôster comercial' }, { title: 'Exemplo de pôster de evento' }, { title: 'Exemplo de imagem de produto' }, { title: 'Exemplo de conceito criativo' }],
    whatIs: {
      paragraphs: [
        'Um gerador de imagens IA transforma instruções de texto, imagens de referência ou pedidos de edição em novos visuais. Ele pode criar fotos realistas, maquetes de produto, pôsteres, miniaturas, retratos, ilustrações, conceitos UI e gráficos para redes sociais diretamente no navegador.',
        'O Toolaze funciona como gerador de imagens IA grátis online e central de seleção de modelos. Comece com uma instrução simples, envie uma imagem de referência quando precisar e escolha o modelo mais adequado para texto mais legível, apresentação de produto, edição de imagem, variações rápidas ou composições comerciais polidas.',
        'Use para criação prática de imagens: produtos, listagens de comércio eletrônico, anúncios pagos, publicações sociais, miniaturas do YouTube, conceitos de campanha, gráficos de apresentação, ideias de personagens, referências de design e rascunhos para revisão de clientes.',
      ],
    },
    promise: {
      text: 'Comece a criar imagens sem instalar software de design nem configurar uma conta. Teste instruções, avalie direções visuais e gere rascunhos úteis rapidamente no navegador.',
      cards: [
        { title: 'Grátis online', text: 'Abra o gerador no navegador e comece a criar rascunhos de imagem sem instalar software ou contratar uma suíte de design paga.' },
        { title: 'Iteração criativa rápida', text: 'Teste instruções, gere variações e avalie modelos enquanto refina anúncios, imagens de produto, miniaturas e rascunhos de design.' },
        { title: 'Comece sem cadastro', text: 'Comece a gerar imagens sem criar conta. O login pode ser útil depois para fluxos de trabalho salvos, créditos ou maior volume de uso.' },
        { title: 'Útil para rascunhos comerciais', text: 'Crie anúncios, conceitos de produto, pôsteres, miniaturas, visuais sociais e opções de design para revisar antes da publicação final.' },
      ],
    },
    features: {
      text: 'Use o Toolaze quando precisar de mais do que uma imagem decorativa. Crie visuais baseados em instruções, edite a partir de referências, avalie modelos e gere rascunhos para fluxos reais de marketing, produto, design, educação e conteúdo.',
      items: [
        { title: 'Gerador de texto para imagem', text: 'Transforme uma instrução escrita em uma nova imagem. Descreva assunto, estilo, layout, fundo, iluminação, proporção e as palavras exatas que devem aparecer.', alt: 'Gerador IA de texto para imagem criando um pôster de produto a partir de uma instrução' },
        { title: 'Gerador IA de imagem para imagem', text: 'Envie uma imagem de referência e peça ao modelo para alterar fundo, estilo, luz, cena, configuração do produto, composição ou direção visual mantendo detalhes importantes estáveis.', alt: 'Gerador IA de imagem para imagem editando uma foto de produto de referência', label: 'Abrir imagem para imagem' },
        { title: 'Gerador de imagens de produto', text: 'Crie imagens para comércio eletrônico, rascunhos de marketplace, cenas de estilo de vida, maquetes de embalagem, visuais sazonais e imagens de destaque limpas de produto.', alt: 'Imagem de produto para comércio eletrônico gerada por IA com fundo limpo e produto em destaque' },
        { title: 'Gerador de pôsteres e anúncios', text: 'Gere pôsteres de campanha, anúncios para redes sociais, gráficos de evento, visuais de lançamento, banners promocionais e layouts comerciais com texto curto.', alt: 'Design de pôster e anúncio gerado por IA com título legível', label: 'Ver instruções de anúncios' },
        { title: 'Miniaturas e visuais sociais', text: 'Crie miniaturas do YouTube, imagens de destaque para blog, posts de redes sociais, gráficos para criadores, conceitos de perfil e ganchos visuais para feeds.', alt: 'Miniatura social gerada por IA com layout marcante' },
        { title: 'Escolha de modelo para melhores resultados', text: 'Alterne entre modelos de imagem quando sua instrução precisar de texto mais forte, melhor edição por referência, maior polimento visual, saída mais rápida ou mais variação criativa.', alt: 'Seletor de modelos de gerador de imagens IA com vários modelos', label: 'Avaliar modelos' },
      ],
    },
    gallery: {
      text: 'Explore resultados comuns que você pode criar com o Toolaze: imagens de marketing, visuais de produto, conceitos UI, gráficos educativos, retratos, miniaturas e edições guiadas por referência.',
      examples: [
        { title: 'Pôster de lançamento de produto', text: 'Crie um pôster limpo com título legível, produto em destaque, área de oferta e composição de campanha polida.', alt: 'Exemplo de pôster de lançamento de produto gerado por IA' },
        { title: 'Anúncio para redes sociais', text: 'Gere anúncios sociais chamativos com copy curta, contraste forte, benefício claro e layout adequado para mobile.', alt: 'Exemplo de anúncio para redes sociais gerado por IA' },
        { title: 'Conceito de maquete UI', text: 'Rascunhe telas de app, painéis de controle, cards de integração ou resumos de recursos para exploração inicial de design.', alt: 'Exemplo de conceito de maquete UI gerado por IA' },
        { title: 'Imagem de produto para comércio eletrônico', text: 'Transforme uma ideia ou referência de produto em uma imagem mais limpa para marketplace, estilo de vida, pacote ou listagem sazonal.', alt: 'Exemplo de imagem de produto para comércio eletrônico gerada por IA' },
        { title: 'Miniatura do YouTube', text: 'Crie conceitos de miniatura com assunto claro, composição expressiva, texto curto legível e contraste forte.', alt: 'Exemplo de miniatura do YouTube gerada por IA' },
        { title: 'Infográfico educativo', text: 'Crie visuais de estudo, diagramas científicos, explicações históricas, fluxos de processo e gráficos de sala de aula com rótulos.', alt: 'Exemplo de infográfico educativo gerado por IA' },
        { title: 'Retrato ou conceito de personagem', text: 'Gere retratos, avatares de criadores, ideias de personagens, imagens de perfil, estudos de estilo e referências visuais para storytelling.', alt: 'Exemplo de retrato e conceito de personagem gerado por IA' },
        { title: 'Edição guiada por referência', text: 'Envie uma imagem de referência e altere fundo, luz, composição ou estilo mantendo o assunto principal estável.', alt: 'Exemplo de edição guiada por referência gerada por IA' },
      ],
    },
    models: {
      description: 'Modelos de imagem diferentes são melhores em tarefas diferentes. Escolha pelo objetivo: texto legível, imagens de produto, edições por referência, variações rápidas, rascunhos de design polidos ou exploração criativa.',
      cards: [
        { text: 'Melhor para instruções limpas de texto para imagem, texto curto legível, pôsteres, anúncios de produto, maquetes UI e gráficos comerciais.', label: 'Testar GPT Image 2' },
        { text: 'Melhor para instruções estruturadas, edições com múltiplas referências, layouts com muito texto, raciocínio de instrução e conjuntos de imagens.', label: 'Testar Wan 2.7 Image' },
        { text: 'Melhor para geração de alta qualidade, edições por referência, retratos, fotos de produto e rascunhos de campanha polidos.', label: 'Testar Nano Banana Pro' },
        { text: 'Melhor para geração rápida do dia a dia, variantes criativas, várias proporções e rascunhos imagem para imagem.', label: 'Testar Nano Banana 2' },
        { text: 'Melhor para visuais comerciais de produto, layouts guiados por tipografia, aderência à instrução e composições de marca.', label: 'Testar Seedream 4.5' },
        { text: 'Melhor para fluxos leves de geração, ideias de campanha, rascunhos de imagem e experimentos rápidos de criadores.', label: 'Testar Seedream 5.0 Lite' },
      ],
      comparisonTitle: 'Forças dos modelos por fluxo de trabalho',
      headers: { model: 'Modelo', bestFor: 'Melhor para', output: 'Saída', references: 'Imagens de referência', textAndEditing: 'Texto e edição', watchouts: 'Pontos de atenção' },
      rows: [
        { bestFor: 'Pôsteres, anúncios, maquetes UI, miniaturas e layouts comerciais.', output: '1K, 2K, 4K. Exemplos 4K incluem 3840 x 2160 e 2160 x 3840. Borda máxima: 3840px.', references: 'Até 16 imagens de entrada. Tratamento fiel de referências.', textAndEditing: 'Texto curto forte, layouts limpos e edições em linguagem natural.', watchouts: 'Revise ortografia, rostos, mãos e detalhes do produto.' },
        { bestFor: 'Pôsteres estruturados, conjuntos de imagens, layouts com texto e anúncios de produto.', output: '1K, 2K, Pro 4K. Modos padrão podem não suportar 2.5K ou 4K.', references: 'Até 9 imagens de entrada.', textAndEditing: 'Forte controle de layout, aderência à instrução e texto dentro da imagem.', watchouts: 'Melhor para instruções estruturadas, não para instruções artísticas soltas.' },
        { bestFor: 'Imagens criativas polidas, retratos, fotos de produto e materiais de campanha.', output: '1K, 2K, 4K.', references: 'Até 14 imagens de referência.', textAndEditing: 'Texto forte, conhecimento de mundo e instruções complexas.', watchouts: 'Melhor quando qualidade e raciocínio importam mais que velocidade.' },
        { bestFor: 'Variações rápidas, gráficos sociais, proporções amplas e edições de imagem.', output: '1K, 2K, 4K. Suporta proporções largas e verticais.', references: 'Até 14 imagens de referência.', textAndEditing: 'Bons rótulos, gráficos para criadores e edições rápidas imagem para imagem.', watchouts: 'Menos premium que Nano Banana Pro para campanhas polidas.' },
        { bestFor: 'Visuais de produto, embalagens, peças-chave de marca e rascunhos de campanha.', output: '1K, 2K, 4K.', references: 'Até 14 imagens de referência.', textAndEditing: 'Forte aderência à instrução, tipografia e consistência de referência.', watchouts: 'Melhor para polimento comercial, não para o fluxo mais leve.' },
        { bestFor: 'Ideias rápidas de produto, experimentos de criadores e rascunhos leves.', output: '1K, 2K, 4K.', references: 'Até 14 imagens de referência.', textAndEditing: 'Boa aderência à instrução, variações rápidas e conceitos de produto.', watchouts: 'Escolha Seedream 4.5 para maior polimento comercial.' },
      ],
    },
    prompts: {
      text: 'Copie uma instrução, cole no gerador e ajuste assunto, estilo de marca, formato e modelo para sua própria imagem.',
      copyButton: 'Copiar instrução',
      copiedButton: 'Copiado',
      examples: [
        { title: 'Instrução para pôster de produto', alt: 'Imagem de exemplo para instrução de pôster de produto' },
        { title: 'Instrução para miniatura do YouTube', alt: 'Imagem de exemplo para instrução de miniatura do YouTube' },
        { title: 'Instrução para anúncio social', alt: 'Imagem de exemplo para instrução de anúncio social' },
        { title: 'Instrução para edição por referência', alt: 'Imagem de exemplo para instrução de edição por referência' },
        { title: 'Instrução para produto de comércio eletrônico', alt: 'Imagem de exemplo para instrução de produto de comércio eletrônico' },
        { title: 'Instrução para maquete UI', alt: 'Imagem de exemplo para instrução de maquete UI' },
        { title: 'Instrução para ficha de personagem', alt: 'Imagem de exemplo para instrução de ficha de personagem' },
        { title: 'Instrução para infográfico educativo', alt: 'Imagem de exemplo para instrução de infográfico educativo' },
      ],
    },
    howTo: {
      schemaName: 'Como usar o gerador de imagens IA da Toolaze',
      description: 'Crie uma imagem em poucos passos e refine o resultado com instruções mais claras, imagens de referência ou outro modelo.',
      stepLabel: 'Passo',
      steps: [
        { title: 'Escreva uma instrução', text: 'Descreva tipo de material, assunto, cena, estilo, clima, proporção e qualquer texto que deva aparecer na imagem.' },
        { title: 'Envie uma imagem de referência', text: 'Adicione uma referência quando quiser preservar produto, rosto, objeto, pose, layout, ambiente, esboço ou direção visual.' },
        { title: 'Escolha um modelo', text: 'Selecione um modelo conforme a tarefa, como geração texto para imagem, edição, produto, anúncios sociais ou variações rápidas.' },
        { title: 'Gere e revise', text: 'Confira ortografia, rostos, mãos, claims de marca, detalhes do produto e composição antes de usar a imagem publicamente.' },
        { title: 'Refine o resultado', text: 'Ajuste uma parte da instrução por vez, troque o modelo se necessário ou envie uma referência melhor para saída mais controlada.' },
      ],
    },
    useCases: {
      description: 'Passe de ideia a rascunho visual para materiais de negócio, conteúdo de criadores, exploração de design e revisão rápida de clientes.',
      cards: [
        { title: 'Anúncios e visuais de produto', text: 'Gere pôsteres de lançamento, conceitos para mídia paga, maquetes de comércio eletrônico, ideias de embalagem e imagens sazonais.' },
        { title: 'Miniaturas e posts sociais', text: 'Crie miniaturas do YouTube, capas do TikTok, gráficos do Instagram, posts de criadores, imagens de reação e formatos prontos para compartilhar.' },
        { title: 'Retratos e arte de personagem', text: 'Crie conceitos de perfil, fichas de personagem, retratos estilizados, avatares e direções criativas fáceis de referenciar.' },
        { title: 'Pôsteres e layouts com texto', text: 'Rascunhe pôsteres de evento, cards de citação, capas de apresentação, layouts editoriais e designs curtos com texto.' },
        { title: 'Conceitos UI e marca', text: 'Explore telas de app, visuais de página de entrada, painéis de referência de marca, gráficos de recursos e direções iniciais de design.' },
        { title: 'Ideias de edição de imagem', text: 'Comece por texto ou envie uma referência, depois altere fundo, estilo, iluminação, composição ou caso de uso.' },
        { title: 'Educação e explicadores', text: 'Crie infográficos, diagramas de aula, visuais de processo, materiais de estudo, gráficos rotulados e imagens para apresentação.' },
        { title: 'Edições guiadas por referência', text: 'Edite fotos de produto, troque fundos, reestilize ambientes, melhore luz, crie variações e transforme referências brutas em rascunhos polidos.' },
      ],
    },
    related: {
      description: 'Continue em uma página de modelo especializada ou explore outras ferramentas Toolaze quando seu fluxo de trabalho precisar de edição, compressão, conversão ou comparação de modelos.',
      cards: [
        { title: 'Ferramentas IA', text: 'Explore mais ferramentas IA para imagem, vídeo, escrita, produtividade e fluxos criativos.', label: 'Ver ferramentas IA' },
        { title: 'Modelos IA', text: 'Avalie modelos de imagem e vídeo do Toolaze por tarefa, estilo de saída, família de modelo e fluxo criativo.', label: 'Ver modelos' },
        { title: 'Gerador IA imagem para imagem', text: 'Envie uma referência, descreva a edição e crie variações controladas, produtos, trocas de fundo ou reestilizações.', label: 'Editar a partir de imagem' },
        { text: 'Use GPT Image 2 para pôsteres, anúncios de produto, texto legível, maquetes UI e geração de imagens estruturadas.', label: 'Testar GPT Image 2' },
        { title: 'Instruções para GPT Image 2', text: 'Explore estruturas de instruções para imagens com muito texto, visuais de produto, maquetes UI e layouts de campanha.', label: 'Abrir instruções' },
        { title: 'Instruções de publicidade', text: 'Use modelos de instrução para lançamentos de produto, campanhas sociais, criativos pagos e conceitos de miniatura.', label: 'Ver publicidade' },
        { title: 'Conversor de imagens', text: 'Converta imagens IA baixadas entre JPG, PNG, WebP e HEIC para fluxos de publicação.', label: 'Converter imagens' },
        { title: 'Compressor de imagens', text: 'Comprima imagens geradas para publicação web, comércio eletrônico, uploads sociais e carregamento mais rápido.', label: 'Comprimir imagens' },
      ],
    },
    faq: {
      description: 'Respostas rápidas sobre uso grátis, acesso sem cadastro, texto para imagem, edição imagem para imagem, escolha de modelo e revisão comercial.',
      items: [
        { q: 'O que é um gerador de imagens IA?', a: 'Um gerador de imagens IA cria imagens a partir de instruções de texto, referências ou pedidos de edição para produtos, pôsteres, anúncios, miniaturas, retratos, UI e redes sociais.' },
        { q: 'Este gerador de imagens IA é grátis?', a: 'Sim. O Toolaze permite começar a criar imagens IA online grátis. O uso pode variar conforme cota, disponibilidade do modelo, configurações escolhidas e status da conta.' },
        { q: 'Preciso me cadastrar?', a: 'Não é preciso cadastro para começar. Abra o gerador, escreva uma instrução, escolha as configurações e crie imagens online.' },
        { q: 'Como gero imagens IA a partir de texto?', a: 'Escreva uma instrução com assunto, estilo, layout, fundo, luz, proporção e texto exato quando necessário. Gere, revise e refine.' },
        { q: 'Posso gerar imagens IA a partir de outra imagem?', a: 'Sim. Envie uma referência e descreva o que deve mudar, como fundo, luz, estilo, composição ou cena.' },
        { q: 'O que posso criar com texto para imagem?', a: 'Você pode criar anúncios, pôsteres, produtos, miniaturas, visuais sociais, retratos, arte conceitual, maquetes UI e designs.' },
        { q: 'Qual modelo de imagem IA devo usar?', a: 'Comece com GPT Image 2 para texto para imagem geral. Use Wan 2.7 Image para layouts estruturados, Nano Banana Pro para edições polidas e Nano Banana 2 para variações rápidas.' },
        { q: 'Posso usar imagens IA comercialmente?', a: 'Imagens IA podem ser usadas em rascunhos e projetos comerciais quando atendem aos seus requisitos de direitos, marca, plataforma e legislação. Revise sempre o resultado final.' },
        { q: 'Qual instrução funciona melhor?', a: 'Uma boa instrução informa tipo de material, assunto, estilo, composição, texto, luz, objetivo e restrições. Para edição, diga o que deve permanecer igual.' },
        { q: 'Ele consegue criar texto legível?', a: 'Alguns modelos são melhores que outros. Prefira frases curtas e exatas entre aspas, indique a posição e revise a ortografia antes de usar.' },
        { q: 'O que posso criar com o gerador de imagens IA da Toolaze?', a: 'Você pode criar produtos, pôsteres, anúncios, miniaturas, visuais sociais, retratos, UI, materiais educativos, personagens e edições por referência.' },
      ],
    },
    cta: { description: 'Use o gerador de imagens IA da Toolaze para criar imagens a partir de texto, editar com referências, comparar modelos IA e produzir visuais práticos para produtos, anúncios, miniaturas, redes sociais, educação e design.' },
  },
  fr: {
    samples: [{ title: 'Exemple d’affiche commerciale' }, { title: 'Exemple d’affiche d’événement' }, { title: 'Exemple d’image produit' }, { title: 'Exemple de concept créatif' }],
    whatIs: {
      paragraphs: [
        'Un générateur d’images IA transforme des prompts texte, des images de référence ou des consignes d’édition en nouveaux visuels. Il peut créer directement dans le navigateur des photos réalistes, mockups produit, affiches, miniatures, portraits, illustrations, concepts UI et visuels pour les réseaux sociaux.',
        'Toolaze fonctionne comme générateur d’images IA gratuit en ligne et comme hub de sélection de modèles. Commencez par un prompt simple, importez une référence si besoin, puis choisissez le modèle adapté au texte lisible, à la mise en scène produit, à l’édition, aux variations rapides ou aux layouts commerciaux polis.',
        'Utilisez-le pour créer des images concrètes : produits, listings ecommerce, annonces payantes, posts sociaux, miniatures YouTube, concepts de campagne, graphiques de présentation, idées de personnages, références design et brouillons pour revue client.',
      ],
    },
    promise: {
      text: 'Commencez à créer des images sans installer de logiciel de design ni créer de compte. Testez des prompts, comparez des directions visuelles et générez rapidement des brouillons utiles dans le navigateur.',
      cards: [
        { title: 'Gratuit en ligne', text: 'Ouvrez le générateur dans votre navigateur et lancez des brouillons d’image sans installer de logiciel ni configurer une suite de design payante.' },
        { title: 'Itération créative rapide', text: 'Testez des prompts, générez des variantes et comparez les modèles pendant que vous affinez annonces, produits, miniatures et brouillons design.' },
        { title: 'Démarrage sans inscription', text: 'Commencez à générer des images sans créer de compte. La connexion peut ensuite servir aux workflows enregistrés, crédits ou volumes plus élevés.' },
        { title: 'Utile pour les brouillons commerciaux', text: 'Créez annonces, concepts produit, affiches, miniatures, visuels sociaux et options design à revoir avant publication finale.' },
      ],
    },
    features: {
      text: 'Utilisez Toolaze lorsque vous avez besoin de plus qu’une image décorative. Créez des visuels à partir de prompts, éditez avec des références, comparez les modèles et générez des brouillons pour de vrais workflows marketing, produit, design, éducation et contenu.',
      items: [
        { title: 'Générateur texte vers image', text: 'Transformez un prompt écrit en nouvelle image. Décrivez le sujet, le style, le layout, l’arrière-plan, l’éclairage, le ratio et les mots exacts à afficher.', alt: 'Générateur IA texte vers image créant une affiche produit depuis un prompt écrit' },
        { title: 'Générateur IA image vers image', text: 'Importez une image de référence et demandez au modèle de changer l’arrière-plan, le style, la lumière, la scène, la mise en place produit, la composition ou la direction visuelle tout en conservant les détails importants.', alt: 'Générateur IA image vers image éditant une photo produit de référence', label: 'Ouvrir image vers image' },
        { title: 'Générateur d’images produit', text: 'Créez images ecommerce, brouillons de marketplace, scènes lifestyle, mockups packaging, visuels saisonniers et images hero produit nettes.', alt: 'Image produit ecommerce générée par IA avec fond propre et produit hero' },
        { title: 'Générateur d’affiches et d’annonces', text: 'Générez affiches de campagne, annonces paid social, visuels d’événement, lancements, bannières promo et layouts commerciaux à copy courte.', alt: 'Design d’affiche et d’annonce généré par IA avec titre lisible', label: 'Voir les prompts d’annonces' },
        { title: 'Miniatures et visuels sociaux', text: 'Créez miniatures YouTube, images hero de blog, posts sociaux, graphiques créateur, concepts de profil et accroches visuelles adaptées au scroll.', alt: 'Miniature sociale générée par IA avec layout marqué' },
        { title: 'Choix du modèle pour de meilleurs résultats', text: 'Passez d’un modèle d’image à l’autre quand votre prompt demande un meilleur rendu de texte, une édition par référence plus précise, plus de polish visuel, une sortie plus rapide ou davantage de variation créative.', alt: 'Sélecteur de modèles pour générateur d’images IA avec plusieurs modèles', label: 'Comparer les modèles' },
      ],
    },
    gallery: {
      text: 'Explorez les résultats courants que vous pouvez créer avec Toolaze : images marketing, visuels produit, concepts UI, graphiques éducatifs, portraits, miniatures et éditions guidées par référence.',
      examples: [
        { title: 'Affiche de lancement produit', text: 'Créez une affiche nette avec titre lisible, produit hero, zone d’offre et composition de campagne polie.', alt: 'Exemple d’affiche de lancement produit générée par IA' },
        { title: 'Annonce pour réseaux sociaux', text: 'Générez des annonces sociales accrocheuses avec copy courte, fort contraste, bénéfice clair et layout mobile-friendly.', alt: 'Exemple d’annonce pour réseaux sociaux générée par IA' },
        { title: 'Concept de mockup UI', text: 'Brouillonnez écrans d’app, panneaux dashboard, cartes onboarding ou vues de fonctionnalités pour l’exploration design initiale.', alt: 'Exemple de concept de mockup UI généré par IA' },
        { title: 'Image produit ecommerce', text: 'Transformez une idée ou référence produit en image marketplace plus propre, photo lifestyle, visuel bundle ou listing saisonnier.', alt: 'Exemple d’image produit ecommerce générée par IA' },
        { title: 'Miniature YouTube', text: 'Créez des concepts de miniature avec sujet clair, composition expressive, court texte lisible et fort contraste.', alt: 'Exemple de miniature YouTube générée par IA' },
        { title: 'Infographie éducative', text: 'Créez visuels d’étude, diagrammes scientifiques, explications historiques, schémas de processus et graphiques de classe avec labels.', alt: 'Exemple d’infographie éducative générée par IA' },
        { title: 'Portrait ou concept de personnage', text: 'Générez portraits, avatars créateur, idées de personnages, images de profil, études de style et références visuelles de narration.', alt: 'Exemple de portrait et concept de personnage généré par IA' },
        { title: 'Édition guidée par référence', text: 'Importez une référence et changez l’arrière-plan, la lumière, la composition ou le style tout en gardant le sujet principal stable.', alt: 'Exemple d’édition guidée par référence générée par IA' },
      ],
    },
    models: {
      description: 'Les modèles d’image excellent dans des tâches différentes. Choisissez selon l’objectif : texte lisible, images produit, éditions par référence, variations rapides, brouillons design polis ou exploration créative.',
      cards: [
        { text: 'Idéal pour prompts texte vers image propres, court texte lisible, affiches, annonces produit, mockups UI et graphiques commerciaux.', label: 'Essayer GPT Image 2' },
        { text: 'Idéal pour prompts structurés, éditions multi-références, layouts riches en texte, raisonnement de prompt et séries d’images.', label: 'Essayer Wan 2.7 Image' },
        { text: 'Idéal pour génération haute qualité, éditions par référence, portraits, photos produit et brouillons de campagne polis.', label: 'Essayer Nano Banana Pro' },
        { text: 'Idéal pour génération rapide au quotidien, variantes créatives, nombreux ratios et brouillons image vers image.', label: 'Essayer Nano Banana 2' },
        { text: 'Idéal pour visuels produit commerciaux, layouts typographiques, respect du prompt et compositions de marque.', label: 'Essayer Seedream 4.5' },
        { text: 'Idéal pour workflows légers, idées de campagne, brouillons d’image et expériences rapides de créateurs.', label: 'Essayer Seedream 5.0 Lite' },
      ],
      comparisonTitle: 'Forces des modèles par workflow',
      headers: { model: 'Modèle', bestFor: 'Idéal pour', output: 'Sortie', references: 'Images de référence', textAndEditing: 'Texte et édition', watchouts: 'À vérifier' },
      rows: [
        { bestFor: 'Affiches, annonces, mockups UI, miniatures et layouts commerciaux.', output: '1K, 2K, 4K. Les exemples 4K incluent 3840 x 2160 et 2160 x 3840. Bord maximal : 3840px.', references: 'Jusqu’à 16 images d’entrée. Gestion fidèle des références.', textAndEditing: 'Court texte solide, layouts propres et éditions en langage naturel.', watchouts: 'Vérifiez orthographe, visages, mains et détails produit.' },
        { bestFor: 'Affiches structurées, séries d’images, layouts textuels et annonces produit.', output: '1K, 2K, Pro 4K. Les modes standard peuvent ne pas prendre en charge 2.5K ou 4K.', references: 'Jusqu’à 9 images d’entrée.', textAndEditing: 'Fort contrôle du layout, respect du prompt et texte dans l’image.', watchouts: 'Meilleur pour instructions structurées que pour prompts artistiques libres.' },
        { bestFor: 'Images créatives polies, portraits, photos produit et assets de campagne.', output: '1K, 2K, 4K.', references: 'Jusqu’à 14 images de référence.', textAndEditing: 'Texte fort, connaissance du monde et prompts complexes.', watchouts: 'Meilleur lorsque qualité et raisonnement comptent plus que vitesse.' },
        { bestFor: 'Variantes rapides, graphiques sociaux, ratios larges et éditions d’image.', output: '1K, 2K, 4K. Prend en charge ratios larges et verticaux.', references: 'Jusqu’à 14 images de référence.', textAndEditing: 'Bons labels, graphiques créateur et éditions image vers image rapides.', watchouts: 'Moins premium que Nano Banana Pro pour campagnes très polies.' },
        { bestFor: 'Visuels produit, packaging, key visuals de marque et brouillons de campagne.', output: '1K, 2K, 4K.', references: 'Jusqu’à 14 images de référence.', textAndEditing: 'Fort respect du prompt, typographie et cohérence de référence.', watchouts: 'Idéal pour polish commercial, pas pour le workflow le plus léger.' },
        { bestFor: 'Idées produit rapides, expériences créateur et brouillons légers.', output: '1K, 2K, 4K.', references: 'Jusqu’à 14 images de référence.', textAndEditing: 'Bon suivi du prompt, variantes rapides et concepts produit.', watchouts: 'Choisissez Seedream 4.5 pour un polish commercial plus fort.' },
      ],
    },
    prompts: {
      text: 'Copiez un prompt, collez-le dans le générateur, puis ajustez sujet, style de marque, format et modèle pour votre propre image.',
      copyButton: 'Copier le prompt',
      copiedButton: 'Copié',
      examples: [
        { title: 'Prompt d’affiche produit', alt: 'Image exemple pour prompt d’affiche produit' },
        { title: 'Prompt de miniature YouTube', alt: 'Image exemple pour prompt de miniature YouTube' },
        { title: 'Prompt d’annonce sociale', alt: 'Image exemple pour prompt d’annonce sociale' },
        { title: 'Prompt d’édition par référence', alt: 'Image exemple pour prompt d’édition par référence' },
        { title: 'Prompt produit ecommerce', alt: 'Image exemple pour prompt produit ecommerce' },
        { title: 'Prompt de mockup UI', alt: 'Image exemple pour prompt de mockup UI' },
        { title: 'Prompt de fiche personnage', alt: 'Image exemple pour prompt de fiche personnage' },
        { title: 'Prompt d’infographie éducative', alt: 'Image exemple pour prompt d’infographie éducative' },
      ],
    },
    howTo: {
      schemaName: 'Comment utiliser Toolaze AI Image Generator',
      description: 'Créez une image en quelques étapes, puis améliorez le résultat avec des prompts plus clairs, des références ou un autre modèle.',
      stepLabel: 'Étape',
      steps: [
        { title: 'Écrire un prompt', text: 'Décrivez le type d’asset, le sujet, la scène, le style, l’ambiance, le ratio et tout texte à afficher dans l’image.' },
        { title: 'Importer une image de référence', text: 'Ajoutez une référence si vous voulez conserver un produit, visage, objet, pose, layout, pièce, croquis ou direction visuelle.' },
        { title: 'Choisir un modèle', text: 'Sélectionnez un modèle selon la tâche : génération texte vers image, édition, visuels produit, annonces sociales ou variations rapides.' },
        { title: 'Générer et vérifier', text: 'Vérifiez orthographe, visages, mains, claims de marque, détails produit et composition avant usage public.' },
        { title: 'Affiner le résultat', text: 'Ajustez une partie du prompt à la fois, changez de modèle si besoin ou importez une meilleure référence pour plus de contrôle.' },
      ],
    },
    useCases: {
      description: 'Passez de l’idée au brouillon visuel pour assets business, contenu créateur, exploration design et revue client rapide.',
      cards: [
        { title: 'Annonces et visuels produit', text: 'Générez affiches de lancement, concepts paid social, mockups ecommerce, idées packaging et images de campagne saisonnière.' },
        { title: 'Miniatures et posts sociaux', text: 'Créez miniatures YouTube, couvertures TikTok, graphiques Instagram, posts créateur, images de réaction et formats prêts à partager.' },
        { title: 'Portraits et personnages', text: 'Créez concepts de profil, fiches personnage, portraits stylisés, avatars et directions créatives faciles à référencer.' },
        { title: 'Affiches et layouts texte', text: 'Brouillonnez affiches événement, visuels de citation, couvertures de présentation, layouts éditoriaux et designs courts riches en texte.' },
        { title: 'Concepts UI et marque', text: 'Explorez écrans d’app, visuels de landing page, moodboards de marque, graphiques de fonctionnalités et premières directions design.' },
        { title: 'Idées d’édition d’image', text: 'Commencez par du texte ou importez une référence, puis changez arrière-plan, style, lumière, composition ou usage.' },
        { title: 'Éducation et explications', text: 'Créez infographies, diagrammes de classe, visuels de processus, supports d’étude, charts étiquetés et graphiques de présentation.' },
        { title: 'Éditions guidées par référence', text: 'Éditez photos produit, remplacez les arrière-plans, restylez des pièces, améliorez la lumière, créez des variantes et transformez des références brutes en brouillons polis.' },
      ],
    },
    related: {
      description: 'Continuez vers une page modèle spécialisée ou explorez d’autres outils Toolaze si votre workflow demande édition, compression, conversion ou comparaison de modèles.',
      cards: [
        { title: 'Outils IA', text: 'Explorez davantage d’outils IA pour image, vidéo, écriture, productivité et workflows créatifs.', label: 'Voir les outils IA' },
        { title: 'Modèles IA', text: 'Comparez les modèles image et vidéo Toolaze par tâche, style de sortie, famille de modèle et workflow créatif.', label: 'Voir les modèles' },
        { title: 'Générateur IA image vers image', text: 'Importez une référence, décrivez l’édition et créez variantes contrôlées, produits, changements de fond ou restyles.', label: 'Éditer depuis une image' },
        { text: 'Utilisez GPT Image 2 pour affiches, annonces produit, texte lisible, mockups UI et génération structurée.', label: 'Essayer GPT Image 2' },
        { title: 'Prompts GPT Image 2', text: 'Explorez des structures de prompts pour images riches en texte, visuels produit, mockups UI et layouts de campagne.', label: 'Ouvrir les prompts' },
        { title: 'Prompts publicitaires', text: 'Utilisez des templates de prompts pour lancements produit, campagnes sociales, paid creative et concepts de miniature.', label: 'Voir publicité' },
        { title: 'Convertisseur d’images', text: 'Convertissez les images IA téléchargées entre JPG, PNG, WebP et HEIC pour vos workflows de publication.', label: 'Convertir des images' },
        { title: 'Compresseur d’images', text: 'Compressez les images générées pour publication web, ecommerce, réseaux sociaux et chargement plus rapide.', label: 'Compresser des images' },
      ],
    },
    faq: {
      description: 'Réponses rapides sur l’usage gratuit, l’accès sans inscription, le texte vers image, l’édition image vers image, le choix du modèle et la revue commerciale.',
      items: [
        { q: 'Qu’est-ce qu’un générateur d’images IA ?', a: 'Un générateur d’images IA crée des images depuis des prompts texte, références ou consignes d’édition pour produits, affiches, annonces, miniatures, portraits, UI et réseaux sociaux.' },
        { q: 'Ce générateur d’images IA est-il gratuit ?', a: 'Oui. Toolaze permet de commencer à créer des images IA gratuitement en ligne. L’usage peut varier selon quota, disponibilité du modèle, réglages et statut du compte.' },
        { q: 'Dois-je m’inscrire ?', a: 'Non, l’inscription n’est pas nécessaire pour commencer. Ouvrez le générateur, écrivez un prompt, choisissez les réglages et créez des images en ligne.' },
        { q: 'Comment générer des images IA depuis du texte ?', a: 'Écrivez un prompt avec sujet, style, layout, fond, lumière, ratio et texte exact si nécessaire. Générez, vérifiez, puis affinez.' },
        { q: 'Puis-je générer des images IA depuis une autre image ?', a: 'Oui. Importez une référence et décrivez ce qui doit changer, comme le fond, la lumière, le style, la composition ou la scène.' },
        { q: 'Que puis-je créer avec le texte vers image ?', a: 'Vous pouvez créer annonces, affiches, produits, miniatures, visuels sociaux, portraits, concept art, mockups UI et designs.' },
        { q: 'Quel modèle d’image IA utiliser ?', a: 'Commencez par GPT Image 2 pour le texte vers image général. Utilisez Wan 2.7 Image pour les layouts structurés, Nano Banana Pro pour les éditions polies et Nano Banana 2 pour les variantes rapides.' },
        { q: 'Puis-je utiliser les images IA commercialement ?', a: 'Les images IA peuvent servir à des brouillons et projets commerciaux si elles respectent vos exigences de droits, marque, plateforme et loi. Vérifiez toujours le résultat final.' },
        { q: 'Quel prompt fonctionne le mieux ?', a: 'Un bon prompt indique type d’asset, sujet, style, composition, texte, lumière, objectif et contraintes. Pour l’édition, précisez ce qui doit rester identique.' },
        { q: 'Peut-il créer du texte lisible ?', a: 'Certains modèles sont meilleurs que d’autres. Utilisez des phrases courtes exactes entre guillemets, indiquez l’emplacement et vérifiez l’orthographe avant usage.' },
        { q: 'Que puis-je créer avec Toolaze AI Image Generator ?', a: 'Vous pouvez créer produits, affiches, annonces, miniatures, visuels sociaux, portraits, UI, supports éducatifs, personnages et éditions par référence.' },
      ],
    },
    cta: { description: 'Utilisez Toolaze AI Image Generator pour créer des images depuis du texte, éditer avec des références, comparer des modèles IA et produire des visuels pratiques pour produits, annonces, miniatures, réseaux sociaux, éducation et design.' },
  },
  it: {
    samples: [{ title: 'Esempio di poster commerciale' }, { title: 'Esempio di poster evento' }, { title: 'Esempio di immagine prodotto' }, { title: 'Esempio di concept creativo' }],
    breadcrumbs: { home: 'Pagina iniziale' },
    whatIs: {
      paragraphs: [
        'Un generatore di immagini IA trasforma prompt testuali, immagini di riferimento o istruzioni di editing in nuovi visual. Può creare direttamente nel browser foto realistiche, mockup prodotto, poster, thumbnail, ritratti, illustrazioni, concept UI e grafiche social.',
        'Toolaze funziona come generatore di immagini IA gratis online e hub per scegliere il modello. Parti da un prompt semplice, carica una reference quando serve e scegli il modello adatto a testo più leggibile, staging prodotto, editing, varianti rapide o layout commerciali rifiniti.',
        'Usalo per creare immagini pratiche: prodotti, listing ecommerce, annunci paid, post social, thumbnail YouTube, concept di campagna, grafiche per presentazioni, idee personaggio, riferimenti di design e bozze per review cliente.',
      ],
    },
    promise: {
      text: 'Inizia a creare immagini senza installare software di design o configurare un account. Testa prompt, confronta direzioni visive e genera rapidamente bozze utilizzabili dal browser.',
      cards: [
        { title: 'Gratis online', text: 'Apri il generatore nel browser e inizia a creare bozze immagine senza installare software o configurare una suite di design a pagamento.' },
        { title: 'Iterazione creativa rapida', text: 'Testa prompt, genera varianti e confronta modelli mentre perfezioni annunci, immagini prodotto, thumbnail e bozze design.' },
        { title: 'Inizia senza registrazione', text: 'Comincia a generare immagini senza creare un account. Il login può servire più avanti per workflow salvati, crediti o volumi maggiori.' },
        { title: 'Utile per bozze commerciali', text: 'Crea annunci, concept prodotto, poster, thumbnail, visual social e opzioni design da rivedere prima della pubblicazione finale.' },
      ],
    },
    features: {
      text: 'Usa Toolaze quando ti serve più di un’immagine decorativa. Crea visual da prompt, modifica con reference, confronta modelli e genera bozze per workflow reali di marketing, prodotto, design, educazione e contenuti.',
      items: [
        { title: 'Generatore testo in immagine', text: 'Trasforma un prompt scritto in una nuova immagine. Descrivi soggetto, stile, layout, sfondo, luce, proporzioni e parole esatte da mostrare.', alt: 'Generatore IA testo in immagine che crea un poster prodotto da un prompt' },
        { title: 'Generatore IA immagine in immagine', text: 'Carica un’immagine di riferimento e chiedi al modello di cambiare sfondo, stile, luce, scena, setup prodotto, composizione o direzione visiva mantenendo stabili i dettagli importanti.', alt: 'Generatore IA immagine in immagine che modifica una foto prodotto di riferimento', label: 'Apri immagine in immagine' },
        { title: 'Generatore immagini prodotto', text: 'Crea immagini ecommerce, bozze per marketplace, scene lifestyle, mockup packaging, visual stagionali e immagini hero prodotto pulite.', alt: 'Immagine ecommerce generata da IA con sfondo pulito e prodotto hero' },
        { title: 'Generatore di poster e annunci', text: 'Genera poster campagna, annunci paid social, grafiche evento, visual lancio, banner promo e layout commerciali con copy breve.', alt: 'Design poster e annuncio generato da IA con headline leggibile', label: 'Vedi prompt annunci' },
        { title: 'Thumbnail e visual social', text: 'Crea thumbnail YouTube, immagini hero per blog, post social, grafiche creator, concept profilo e hook visivi per lo scroll.', alt: 'Thumbnail social generata da IA con layout deciso' },
        { title: 'Scelta del modello per risultati migliori', text: 'Passa tra i modelli supportati quando il prompt richiede testo più forte, editing con reference migliore, maggiore polish visivo, output più rapido o più variazione creativa.', alt: 'Selettore modelli del generatore immagini IA con più modelli', label: 'Confronta modelli' },
      ],
    },
    gallery: {
      text: 'Esplora risultati comuni che puoi creare con Toolaze: immagini marketing, visual prodotto, concept UI, grafiche educative, ritratti, thumbnail ed editing guidato da reference.',
      examples: [
        { title: 'Poster lancio prodotto', text: 'Crea un poster pulito con headline leggibile, prodotto hero, area offerta e composizione campagna rifinita.', alt: 'Esempio di poster lancio prodotto generato da IA' },
        { title: 'Annuncio social media', text: 'Genera annunci social d’impatto con copy breve, forte contrasto, beneficio chiaro e layout adatto al mobile.', alt: 'Esempio di annuncio social generato da IA' },
        { title: 'Concept mockup UI', text: 'Bozza schermate app, pannelli dashboard, card onboarding o panoramiche feature per esplorazione design iniziale.', alt: 'Esempio di concept mockup UI generato da IA' },
        { title: 'Immagine prodotto ecommerce', text: 'Trasforma un’idea o reference prodotto in immagine marketplace più pulita, scatto lifestyle, visual bundle o listing stagionale.', alt: 'Esempio di immagine ecommerce generata da IA' },
        { title: 'Thumbnail YouTube', text: 'Crea concept di thumbnail con soggetto chiaro, composizione espressiva, testo breve leggibile e forte contrasto.', alt: 'Esempio di thumbnail YouTube generata da IA' },
        { title: 'Infografica educativa', text: 'Crea visual di studio, diagrammi scientifici, spiegazioni storiche, chart di processo e grafiche per classe con etichette.', alt: 'Esempio di infografica educativa generata da IA' },
        { title: 'Ritratto o concept personaggio', text: 'Genera ritratti, avatar creator, idee personaggio, immagini profilo, studi di stile e reference visive per storytelling.', alt: 'Esempio di ritratto e concept personaggio generato da IA' },
        { title: 'Editing guidato da reference', text: 'Carica una reference e cambia sfondo, luce, composizione o stile mantenendo stabile il soggetto principale.', alt: 'Esempio di editing guidato da reference generato da IA' },
      ],
    },
    models: {
      description: 'Modelli immagine diversi sono migliori per lavori diversi. Scegli in base all’obiettivo: testo leggibile, prodotti, editing con reference, varianti rapide, bozze design rifinite o esplorazione creativa.',
      cards: [
        { text: 'Ideale per prompt testo in immagine puliti, testo breve leggibile, poster, annunci prodotto, mockup UI e grafiche commerciali.', label: 'Prova GPT Image 2' },
        { text: 'Ideale per prompt strutturati, editing multi-reference, layout ricchi di testo, ragionamento sul prompt e set di immagini.', label: 'Prova Wan 2.7 Image' },
        { text: 'Ideale per generazione di alta qualità, editing con reference, ritratti, scatti prodotto e bozze campagna rifinite.', label: 'Prova Nano Banana Pro' },
        { text: 'Ideale per generazione quotidiana veloce, varianti creative rapide, molte proporzioni e bozze immagine in immagine.', label: 'Prova Nano Banana 2' },
        { text: 'Ideale per visual prodotto commerciali, layout tipografici, aderenza al prompt e composizioni di marca.', label: 'Prova Seedream 4.5' },
        { text: 'Ideale per workflow leggeri, idee campagna, bozze immagine ed esperimenti rapidi per creator.', label: 'Prova Seedream 5.0 Lite' },
      ],
      comparisonTitle: 'Punti di forza dei modelli per workflow',
      headers: { model: 'Modello', bestFor: 'Ideale per', output: 'Output', references: 'Immagini di riferimento', textAndEditing: 'Testo ed editing', watchouts: 'Da controllare' },
      rows: [
        { bestFor: 'Poster, annunci, mockup UI, thumbnail e layout commerciali.', output: '1K, 2K, 4K. Gli esempi 4K includono 3840 x 2160 e 2160 x 3840. Lato massimo: 3840px.', references: 'Fino a 16 immagini di input. Gestione reference ad alta fedeltà.', textAndEditing: 'Testo breve forte, layout puliti ed editing in linguaggio naturale.', watchouts: 'Controlla ortografia, volti, mani e dettagli prodotto.' },
        { bestFor: 'Poster strutturati, set immagini, layout con molto testo e annunci prodotto.', output: '1K, 2K, Pro 4K. Le modalità standard potrebbero non supportare 2.5K o 4K.', references: 'Fino a 9 immagini di input.', textAndEditing: 'Forte controllo layout, rispetto del prompt e testo nell’immagine.', watchouts: 'Meglio per istruzioni strutturate che per prompt artistici liberi.' },
        { bestFor: 'Immagini creative rifinite, ritratti, scatti prodotto e asset campagna.', output: '1K, 2K, 4K.', references: 'Fino a 14 immagini di riferimento.', textAndEditing: 'Testo forte, conoscenza del mondo e prompt complessi.', watchouts: 'Meglio quando qualità e ragionamento contano più della velocità.' },
        { bestFor: 'Varianti rapide, grafiche social, proporzioni ampie ed editing immagini.', output: '1K, 2K, 4K. Supporta proporzioni larghe e verticali.', references: 'Fino a 14 immagini di riferimento.', textAndEditing: 'Buone etichette, grafiche creator ed editing immagine in immagine rapido.', watchouts: 'Meno premium di Nano Banana Pro per campagne molto rifinite.' },
        { bestFor: 'Visual prodotto, packaging, key visual di marca e bozze campagna.', output: '1K, 2K, 4K.', references: 'Fino a 14 immagini di riferimento.', textAndEditing: 'Forte aderenza al prompt, tipografia e coerenza reference.', watchouts: 'Ideale per polish commerciale, non per il workflow più leggero.' },
        { bestFor: 'Idee prodotto veloci, esperimenti creator e bozze leggere.', output: '1K, 2K, 4K.', references: 'Fino a 14 immagini di riferimento.', textAndEditing: 'Buon rispetto del prompt, varianti rapide e concept prodotto.', watchouts: 'Scegli Seedream 4.5 per polish commerciale più forte.' },
      ],
    },
    prompts: {
      text: 'Copia un prompt, incollalo nel generatore, poi adatta soggetto, stile di brand, formato e modello alla tua immagine.',
      copyButton: 'Copia prompt',
      copiedButton: 'Copiato',
      examples: [
        { title: 'Prompt poster prodotto', alt: 'Immagine esempio per prompt poster prodotto' },
        { title: 'Prompt thumbnail YouTube', alt: 'Immagine esempio per prompt thumbnail YouTube' },
        { title: 'Prompt annuncio social', alt: 'Immagine esempio per prompt annuncio social' },
        { title: 'Prompt editing con reference', alt: 'Immagine esempio per prompt editing con reference' },
        { title: 'Prompt prodotto ecommerce', alt: 'Immagine esempio per prompt prodotto ecommerce' },
        { title: 'Prompt mockup UI', alt: 'Immagine esempio per prompt mockup UI' },
        { title: 'Prompt scheda personaggio', alt: 'Immagine esempio per prompt scheda personaggio' },
        { title: 'Prompt infografica educativa', alt: 'Immagine esempio per prompt infografica educativa' },
      ],
    },
    howTo: {
      schemaName: 'Come usare Toolaze AI Image Generator',
      description: 'Crea un’immagine in pochi passaggi, poi migliora il risultato con prompt più chiari, immagini di riferimento o un modello diverso.',
      stepLabel: 'Passo',
      steps: [
        { title: 'Scrivi un prompt', text: 'Descrivi tipo di asset, soggetto, scena, stile, mood, proporzione e qualsiasi testo che deve apparire nell’immagine.' },
        { title: 'Carica un’immagine di riferimento', text: 'Aggiungi una reference se vuoi preservare prodotto, volto, oggetto, posa, layout, stanza, schizzo o direzione visiva.' },
        { title: 'Scegli un modello', text: 'Seleziona un modello in base al lavoro: generazione testo in immagine, editing, prodotto, annunci social o varianti rapide.' },
        { title: 'Genera e controlla', text: 'Controlla ortografia, volti, mani, claim di brand, dettagli prodotto e composizione prima di usare l’immagine pubblicamente.' },
        { title: 'Rifinisci il risultato', text: 'Modifica una parte del prompt alla volta, cambia modello se serve o carica una reference più forte per un output più controllato.' },
      ],
    },
    useCases: {
      description: 'Passa dall’idea alla bozza visual per asset business, contenuti creator, esplorazione design e review cliente veloce.',
      cards: [
        { title: 'Annunci e visual prodotto', text: 'Genera poster lancio prodotto, concept paid social, mockup ecommerce, idee packaging e immagini campagna stagionali.' },
        { title: 'Thumbnail e post social', text: 'Crea thumbnail YouTube, cover TikTok, grafiche Instagram, post creator, immagini reaction e formati pronti da condividere.' },
        { title: 'Ritratti e personaggi', text: 'Crea concept profilo, schede personaggio, ritratti stilizzati, avatar e direzioni creative facili da usare come reference.' },
        { title: 'Poster e layout testuali', text: 'Bozza poster evento, grafiche quote, cover presentazione, layout editoriali e design brevi ricchi di testo.' },
        { title: 'Concept UI e brand', text: 'Esplora schermate app, visual landing page, moodboard brand, grafiche feature e prime direzioni design.' },
        { title: 'Idee di editing immagine', text: 'Parti da testo o carica una reference, poi cambia sfondo, stile, luce, composizione o uso finale.' },
        { title: 'Educazione e spiegazioni', text: 'Crea infografiche, diagrammi didattici, visual di processo, aiuti studio, chart con etichette e grafiche per presentazioni.' },
        { title: 'Editing guidato da reference', text: 'Modifica foto prodotto, cambia sfondi, reinterpreta stanze, migliora luce, crea varianti e trasforma reference grezze in bozze rifinite.' },
      ],
    },
    related: {
      description: 'Continua con una pagina modello specializzata o esplora altri strumenti Toolaze quando il workflow richiede editing, compressione, conversione o confronto modelli.',
      cards: [
        { title: 'Strumenti IA', text: 'Esplora altri strumenti IA per immagini, video, scrittura, produttività e workflow creativi.', label: 'Vedi strumenti IA' },
        { title: 'Modelli IA', text: 'Confronta i modelli immagine e video Toolaze per attività, stile output, famiglia modello e workflow creativo.', label: 'Vedi modelli' },
        { title: 'Generatore IA immagine in immagine', text: 'Carica una reference, descrivi la modifica e crea varianti controllate, prodotti, cambi sfondo o restyle.', label: 'Modifica da immagine' },
        { text: 'Usa GPT Image 2 per poster, annunci prodotto, testo leggibile, mockup UI e generazione strutturata.', label: 'Prova GPT Image 2' },
        { title: 'Prompt GPT Image 2', text: 'Esplora strutture di prompt per immagini ricche di testo, visual prodotto, mockup UI e layout campagna.', label: 'Apri prompt' },
        { title: 'Prompt pubblicitari', text: 'Usa template di prompt per lanci prodotto, campagne social, creatività paid e concept thumbnail.', label: 'Vedi pubblicità' },
        { title: 'Convertitore immagini', text: 'Converti immagini IA scaricate tra JPG, PNG, WebP e HEIC per workflow di pubblicazione.', label: 'Converti immagini' },
        { title: 'Compressore immagini', text: 'Comprimi immagini generate per pubblicazione web, ecommerce, upload social e caricamento più rapido.', label: 'Comprimi immagini' },
      ],
    },
    faq: {
      description: 'Risposte rapide su uso gratuito, accesso senza registrazione, testo in immagine, editing immagine in immagine, scelta modello e review commerciale.',
      items: [
        { q: 'Cos’è un generatore di immagini IA?', a: 'Un generatore di immagini IA crea immagini da prompt testuali, reference o istruzioni di editing per prodotti, poster, annunci, thumbnail, ritratti, UI e social.' },
        { q: 'Questo generatore di immagini IA è gratis?', a: 'Sì. Toolaze ti permette di iniziare a creare immagini IA online gratis. L’uso può variare per quota, disponibilità del modello, impostazioni scelte e stato account.' },
        { q: 'Devo registrarmi?', a: 'Non serve registrarsi per iniziare. Apri il generatore, scrivi un prompt, scegli le impostazioni e crea immagini online.' },
        { q: 'Come genero immagini IA da testo?', a: 'Scrivi un prompt con soggetto, stile, layout, sfondo, luce, proporzione e testo esatto se necessario. Genera, controlla e rifinisci.' },
        { q: 'Posso generare immagini IA da un’altra immagine?', a: 'Sì. Carica una reference e descrivi cosa deve cambiare, come sfondo, luce, stile, composizione o scena.' },
        { q: 'Cosa posso creare con testo in immagine?', a: 'Puoi creare annunci, poster, prodotti, thumbnail, visual social, ritratti, concept art, mockup UI e design.' },
        { q: 'Quale modello immagine IA dovrei usare?', a: 'Inizia con GPT Image 2 per testo in immagine generale. Usa Wan 2.7 Image per layout strutturati, Nano Banana Pro per editing rifinito e Nano Banana 2 per varianti rapide.' },
        { q: 'Posso usare immagini IA commercialmente?', a: 'Le immagini IA possono essere usate per bozze e progetti commerciali quando rispettano requisiti di diritti, brand, piattaforma e legge. Controlla sempre il risultato finale.' },
        { q: 'Quale prompt funziona meglio?', a: 'Un buon prompt indica tipo di asset, soggetto, stile, composizione, testo, luce, obiettivo e vincoli. Per editing, specifica cosa deve restare invariato.' },
        { q: 'Può creare testo leggibile?', a: 'Alcuni modelli sono migliori di altri. Usa frasi brevi ed esatte tra virgolette, indica la posizione e controlla l’ortografia prima dell’uso.' },
        { q: 'Cosa posso creare con Toolaze AI Image Generator?', a: 'Puoi creare prodotti, poster, annunci, thumbnail, visual social, ritratti, UI, materiali educativi, personaggi ed editing con reference.' },
      ],
    },
    cta: { description: 'Usa Toolaze AI Image Generator per creare immagini da testo, modificare con reference, confrontare modelli IA e produrre visual pratici per prodotti, annunci, thumbnail, social media, educazione e design.' },
  },
}

const koOverrides: DeepPartial<AiImageGeneratorPageCopy> = {
  metadata: { title: '무료 AI 이미지 생성기 온라인 - 가입 없음 | Toolaze', description: '가입 없이 무료로 AI 이미지를 온라인에서 만드세요. Toolaze AI Image Generator로 텍스트 이미지, 이미지 투 이미지, 제품 이미지, 포스터, 광고, 썸네일, 소셜 비주얼을 제작할 수 있습니다.' },
  breadcrumbs: { home: '홈', aiTools: 'AI 도구', current: 'AI 이미지 생성기' },
  hero: { highlight: 'AI 이미지 생성기', description: '텍스트 프롬프트나 참조 이미지로 AI 이미지를 온라인에서 만드세요. Toolaze AI Image Generator는 제품 이미지, 포스터, 광고, 썸네일, 인물, 소셜 비주얼, UI 콘셉트, 참조 기반 편집을 브라우저에서 바로 지원합니다.', badges: ['무료 온라인', '가입 없음', '텍스트 이미지', '이미지 투 이미지', '여러 AI 모델', '상업용 초안'] },
  samples: [{ title: '상업용 포스터 예시' }, { title: '이벤트 포스터 예시' }, { title: '제품 이미지 예시' }, { title: '크리에이티브 콘셉트 예시' }],
  whatIs: { title: 'AI 이미지 생성기란?', paragraphs: ['AI 이미지 생성기는 텍스트 프롬프트, 참조 이미지, 편집 지시를 새로운 시각 자료로 바꿉니다. 브라우저에서 사실적인 사진, 제품 목업, 포스터, 썸네일, 인물, 일러스트, UI 콘셉트, 소셜 그래픽을 만들 수 있습니다.', 'Toolaze는 무료 온라인 AI 이미지 생성기이자 모델 선택 허브입니다. 간단한 프롬프트로 시작하고 필요하면 참조 이미지를 업로드한 뒤, 텍스트 표현, 제품 연출, 이미지 편집, 빠른 변형, 상업용 레이아웃에 맞는 모델을 고를 수 있습니다.', '제품 이미지, 이커머스 등록 이미지, 유료 광고, 소셜 게시물, YouTube 썸네일, 캠페인 콘셉트, 발표 자료, 캐릭터 아이디어, 디자인 참고, 클라이언트 리뷰용 초안에 활용하세요.'] },
  promise: { title: '가입 없는 무료 AI 이미지 생성기', text: '디자인 소프트웨어 설치나 계정 생성 없이 이미지를 만들 수 있습니다. 프롬프트를 테스트하고 시각 방향을 비교하며 브라우저에서 빠르게 쓸 수 있는 초안을 생성하세요.', cards: [{ title: '무료 온라인', text: '브라우저에서 생성기를 열고 소프트웨어 설치나 유료 디자인 제품군 없이 이미지 초안을 시작하세요.' }, { title: '빠른 창작 반복', text: '광고, 제품 이미지, 썸네일, 디자인 초안을 다듬으며 프롬프트, 변형, 모델을 비교하세요.' }, { title: '가입 없이 시작', text: '계정을 만들지 않고 이미지 생성을 시작할 수 있습니다. 저장 워크플로, 크레딧, 대량 사용에는 나중에 로그인이 유용할 수 있습니다.' }, { title: '상업용 초안에 유용', text: '최종 게시 전 검토할 광고, 제품 콘셉트, 포스터, 썸네일, 소셜 비주얼, 디자인 옵션을 만드세요.' }] },
  features: { title: '텍스트, 이미지, 아이디어로 이미지 만들기', text: '장식용 이미지를 넘어 실제 작업물이 필요할 때 Toolaze를 사용하세요. 프롬프트 기반 비주얼, 참조 편집, 모델 비교, 마케팅/제품/디자인/교육/콘텐츠용 이미지 초안을 만들 수 있습니다.', items: [{ title: '텍스트 이미지 생성기', text: '작성한 프롬프트를 새 이미지로 변환합니다. 주제, 스타일, 레이아웃, 배경, 조명, 비율, 이미지 안에 들어갈 정확한 문구를 설명하세요.', alt: '작성한 프롬프트에서 제품 포스터를 만드는 AI 텍스트 이미지 생성기' }, { title: '이미지 투 이미지 AI 생성기', text: '참조 이미지를 업로드하고 중요한 디테일을 유지하면서 배경, 스타일, 조명, 장면, 제품 구성, 구도, 시각 방향을 바꾸세요.', alt: '참조 제품 사진을 편집하는 AI 이미지 투 이미지 생성기', label: '이미지 투 이미지 열기' }, { title: '제품 이미지 생성기', text: '이커머스 제품 이미지, 마켓플레이스 초안, 라이프스타일 장면, 패키지 목업, 시즌 제품 비주얼, 깔끔한 제품 히어로 이미지를 만드세요.', alt: '깨끗한 배경과 제품 히어로가 있는 AI 생성 이커머스 제품 이미지' }, { title: '포스터 및 광고 생성기', text: '캠페인 포스터, 유료 소셜 광고, 이벤트 그래픽, 출시 비주얼, 프로모션 배너, 짧은 카피 중심의 상업용 레이아웃을 생성하세요.', alt: '읽기 쉬운 헤드라인이 있는 AI 생성 포스터와 광고 디자인', label: '광고 프롬프트 보기' }, { title: '썸네일과 소셜 비주얼', text: 'YouTube 썸네일, 블로그 히어로, 소셜 게시물, 크리에이터 그래픽, 프로필 콘셉트, 스크롤을 멈추게 하는 시각 후크를 만드세요.', alt: '대담한 레이아웃의 AI 생성 소셜 썸네일' }, { title: '더 나은 결과를 위한 모델 선택', text: '더 강한 텍스트 표현, 참조 편집, 시각적 완성도, 빠른 출력, 창의적 변형이 필요할 때 지원 모델을 전환하세요.', alt: '여러 이미지 모델이 있는 AI 이미지 생성기 모델 선택기', label: '모델 비교' }] },
  gallery: { title: 'AI 이미지 생성기 예시', text: 'Toolaze로 만들 수 있는 결과를 살펴보세요. 마케팅 이미지, 제품 비주얼, UI 콘셉트, 교육 그래픽, 인물, 썸네일, 참조 기반 편집을 만들 수 있습니다.', examples: [{ title: '제품 출시 포스터', text: '읽기 쉬운 헤드라인, 제품 히어로, 오퍼 영역, 완성도 높은 캠페인 구성이 있는 깔끔한 포스터를 만드세요.', alt: 'AI 생성 제품 출시 포스터 예시' }, { title: '소셜 미디어 광고', text: '짧은 카피, 강한 대비, 명확한 혜택, 모바일 친화적 레이아웃의 눈에 띄는 소셜 광고를 생성하세요.', alt: 'AI 생성 소셜 미디어 광고 예시' }, { title: 'UI 목업 콘셉트', text: '초기 디자인 탐색을 위해 앱 화면, 대시보드 패널, 온보딩 카드, 제품 기능 개요를 빠르게 스케치하세요.', alt: 'AI 생성 UI 목업 콘셉트 예시' }, { title: '이커머스 제품 이미지', text: '제품 아이디어나 참조 이미지를 더 깔끔한 마켓플레이스 이미지, 라이프스타일 컷, 번들 비주얼, 시즌 리스팅 초안으로 바꾸세요.', alt: 'AI 생성 이커머스 제품 이미지 예시' }, { title: 'YouTube 썸네일', text: '명확한 주제, 표현력 있는 구도, 읽기 쉬운 짧은 문구, 강한 대비를 가진 썸네일 콘셉트를 만드세요.', alt: 'AI 생성 YouTube 썸네일 예시' }, { title: '교육용 인포그래픽', text: '학습 비주얼, 과학 다이어그램, 역사 설명 그래픽, 과정 차트, 섹션 라벨이 있는 수업 자료를 만드세요.', alt: 'AI 생성 교육용 인포그래픽 예시' }, { title: '인물 또는 캐릭터 콘셉트', text: '인물, 크리에이터 아바타, 캐릭터 아이디어, 프로필 이미지, 스타일 스터디, 스토리텔링 참고 비주얼을 생성하세요.', alt: 'AI 생성 인물 및 캐릭터 콘셉트 예시' }, { title: '참조 기반 편집', text: '참조 이미지를 업로드하고 주요 피사체는 안정적으로 유지하면서 배경, 조명, 구도, 스타일을 바꾸세요.', alt: 'AI 생성 참조 기반 편집 예시' }] },
  models: { title: '최적의 AI 이미지 생성 모델 선택', description: '이미지 모델마다 잘하는 작업이 다릅니다. 읽기 쉬운 텍스트, 제품 이미지, 참조 편집, 빠른 변형, 완성도 높은 디자인 초안, 창의적 탐색 등 출력 목표에 맞춰 선택하세요.', cards: [{ text: '깔끔한 텍스트 이미지 프롬프트, 읽기 쉬운 짧은 문구, 포스터, 제품 광고, UI 목업, 상업용 그래픽에 적합합니다.', label: 'GPT Image 2 사용해 보기' }, { text: '구조화된 프롬프트, 다중 참조 편집, 텍스트가 많은 레이아웃, 프롬프트 추론, 이미지 세트에 적합합니다.', label: 'Wan 2.7 Image 사용해 보기' }, { text: '고품질 이미지 생성, 참조 편집, 인물, 제품 샷, 완성도 높은 캠페인 초안에 적합합니다.', label: 'Nano Banana Pro 사용해 보기' }, { text: '빠른 일상 이미지 생성, 창의적 변형, 다양한 비율, 이미지 투 이미지 초안에 적합합니다.', label: 'Nano Banana 2 사용해 보기' }, { text: '상업용 제품 비주얼, 타이포그래피 중심 레이아웃, 프롬프트 준수, 브랜드 스타일 구도에 적합합니다.', label: 'Seedream 4.5 사용해 보기' }, { text: '가벼운 이미지 생성 workflow, 캠페인 아이디어, 이미지 초안, 빠른 크리에이터 실험에 적합합니다.', label: 'Seedream 5.0 Lite 사용해 보기' }], comparisonTitle: '워크플로별 모델 강점', headers: { model: '모델', bestFor: '적합한 작업', output: '출력', references: '참조 이미지', textAndEditing: '텍스트 및 편집', watchouts: '확인 사항' }, rows: [{ bestFor: '포스터, 광고, UI 목업, 썸네일, 상업용 레이아웃.', output: '1K, 2K, 4K. 4K 예시는 3840 x 2160 및 2160 x 3840을 포함합니다. 최대 변: 3840px.', references: '최대 16장 입력 이미지. 참조 처리 충실도 높음.', textAndEditing: '짧은 텍스트, 깔끔한 레이아웃, 자연어 편집에 강함.', watchouts: '철자, 얼굴, 손, 제품 디테일을 확인하세요.' }, { bestFor: '구조화된 포스터, 이미지 세트, 텍스트 중심 레이아웃, 제품 광고.', output: '1K, 2K, Pro 4K. 표준 모드는 2.5K 또는 4K를 지원하지 않을 수 있습니다.', references: '최대 9장 입력 이미지.', textAndEditing: '레이아웃 제어, 프롬프트 준수, 이미지 내 텍스트에 강함.', watchouts: '자유로운 아트 프롬프트보다 구조화된 지시에 더 적합합니다.' }, { bestFor: '완성도 높은 창작 이미지, 인물, 제품 샷, 캠페인 자산.', output: '1K, 2K, 4K.', references: '최대 14장 참조 이미지.', textAndEditing: '텍스트 표현, 세계 지식, 복잡한 프롬프트에 강함.', watchouts: '속도보다 품질과 추론이 중요할 때 적합합니다.' }, { bestFor: '빠른 변형, 소셜 그래픽, 다양한 비율, 이미지 편집.', output: '1K, 2K, 4K. 넓은 비율과 세로 비율을 지원합니다.', references: '최대 14장 참조 이미지.', textAndEditing: '라벨, 크리에이터 그래픽, 빠른 이미지 투 이미지 편집에 좋음.', watchouts: '정교한 캠페인에서는 Nano Banana Pro보다 덜 고급스럽습니다.' }, { bestFor: '제품 비주얼, 패키징, 브랜드 key visual, 캠페인 초안.', output: '1K, 2K, 4K.', references: '최대 14장 참조 이미지.', textAndEditing: '프롬프트 준수, 타이포그래피, 참조 일관성에 강함.', watchouts: '상업적 완성도에 좋지만 가장 가벼운 workflow는 아닙니다.' }, { bestFor: '빠른 제품 아이디어, 크리에이터 실험, 가벼운 초안.', output: '1K, 2K, 4K.', references: '최대 14장 참조 이미지.', textAndEditing: '프롬프트 준수, 빠른 변형, 제품 콘셉트에 좋음.', watchouts: '더 강한 상업적 완성도는 Seedream 4.5를 선택하세요.' }] },
  modes: { title: '텍스트 이미지 vs 이미지 투 이미지 워크플로', description: '대부분의 사용자는 빠른 탐색에는 텍스트 이미지를 사용하고, 더 많은 제어가 필요할 때 이미지 투 이미지로 이동합니다. Toolaze는 두 워크플로와 모델 선택을 함께 제공합니다.', headers: { label: '질문', aiImageGenerator: 'AI 이미지 생성기', textToImage: '텍스트 이미지', imageToImage: '이미지 투 이미지' }, rows: [{ label: '의미', aiImageGenerator: '비주얼을 만들고 비교하고 개선하는 한 곳', textToImage: '작성한 프롬프트에서 새 이미지 만들기', imageToImage: '참조 이미지를 업로드해 변환하거나 스타일 변경' }, { label: '적합한 작업', aiImageGenerator: '폭넓은 이미지 제작, 모델 선택, workflow 제어', textToImage: '새 장면, 광고, 포스터, 인물, 썸네일', imageToImage: '참조 편집, 스타일 변경, 제품 변형' }, { label: '입력', aiImageGenerator: '프롬프트, 참조 이미지 또는 둘 다', textToImage: '텍스트 프롬프트', imageToImage: '업로드한 이미지와 편집 지시' }, { label: '사용 시점', aiImageGenerator: '프롬프트와 모델을 한 곳에서 테스트하고 싶을 때', textToImage: '이미지 아이디어는 있지만 원본 이미지가 없을 때', imageToImage: '주제, 스타일, 레이아웃, 구도를 제어해야 할 때' }, { label: '프롬프트 초점', aiImageGenerator: '목표, 모델, 모드, 출력 형식, 사용 목적', textToImage: '주제, 장면, 스타일, 구도, 텍스트, 조명', imageToImage: '보존할 것, 바꿀 것, 원하는 결과' }] },
  prompts: { title: '복사 가능한 AI 이미지 프롬프트 템플릿', text: '프롬프트를 복사해 생성기에 붙여넣고 주제, 브랜드 스타일, 형식, 모델을 자신의 이미지에 맞게 조정하세요.', copyButton: '프롬프트 복사', copiedButton: '복사됨', examples: [{ title: '제품 포스터 프롬프트', alt: '제품 포스터 프롬프트 예시 이미지' }, { title: 'YouTube 썸네일 프롬프트', alt: 'YouTube 썸네일 프롬프트 예시 이미지' }, { title: '소셜 미디어 광고 프롬프트', alt: '소셜 미디어 광고 프롬프트 예시 이미지' }, { title: '참조 편집 프롬프트', alt: '참조 편집 프롬프트 예시 이미지' }, { title: '이커머스 제품 프롬프트', alt: '이커머스 제품 프롬프트 예시 이미지' }, { title: 'UI 목업 프롬프트', alt: 'UI 목업 프롬프트 예시 이미지' }, { title: '캐릭터 시트 프롬프트', alt: '캐릭터 시트 프롬프트 예시 이미지' }, { title: '교육용 인포그래픽 프롬프트', alt: '교육용 인포그래픽 프롬프트 예시 이미지' }] },
  howTo: { schemaName: 'Toolaze AI 이미지 생성기 사용 방법', title: '온라인에서 AI 이미지를 생성하는 방법', description: '몇 단계로 이미지를 만들고 더 명확한 프롬프트, 참조 이미지, 다른 모델로 결과를 개선하세요.', stepLabel: '단계', steps: [{ title: '프롬프트 작성', text: '자산 유형, 주제, 장면, 스타일, 분위기, 비율, 이미지에 표시할 텍스트를 설명하세요.' }, { title: '참조 이미지 업로드', text: '제품, 얼굴, 물체, 포즈, 레이아웃, 방, 스케치, 시각 방향을 유지하고 싶을 때 참조 이미지를 추가하세요.' }, { title: '모델 선택', text: '텍스트 이미지 생성, 이미지 편집, 제품 비주얼, 소셜 광고, 빠른 변형 등 작업에 맞는 모델을 선택하세요.' }, { title: '생성 및 검토', text: '이미지를 공개적으로 사용하기 전에 텍스트 철자, 얼굴, 손, 브랜드 문구, 제품 디테일, 구도를 확인하세요.' }, { title: '결과 개선', text: '프롬프트의 한 부분씩 조정하고, 필요하면 모델을 바꾸거나 더 좋은 참조 이미지를 업로드해 제어력을 높이세요.' }] },
  useCases: { title: '인기 AI 이미지 활용 사례', description: '비즈니스 자산, 크리에이터 콘텐츠, 디자인 탐색, 빠른 클라이언트 검토를 위해 아이디어를 시각 초안으로 바꾸세요.', cards: [{ title: '광고 및 제품 비주얼', text: '제품 출시 포스터, paid social 콘셉트, 이커머스 목업, 패키징 아이디어, 시즌 캠페인 이미지를 생성하세요.' }, { title: '썸네일 및 소셜 게시물', text: 'YouTube 썸네일, TikTok 커버, Instagram 그래픽, 크리에이터 게시물, 반응 이미지, 공유용 포맷을 만드세요.' }, { title: '인물 및 캐릭터 아트', text: '프로필 콘셉트, 캐릭터 시트, 스타일화된 인물, 아바타, 참고하기 쉬운 창작 방향을 만드세요.' }, { title: '포스터 및 텍스트 레이아웃', text: '이벤트 포스터, 인용 그래픽, 프레젠테이션 커버, 편집형 레이아웃, 짧은 텍스트 중심 디자인을 초안으로 만드세요.' }, { title: 'UI 및 브랜드 콘셉트', text: '앱 화면, 랜딩 페이지 비주얼, 브랜드 무드보드, 기능 그래픽, 초기 디자인 방향을 탐색하세요.' }, { title: '이미지 편집 아이디어', text: '텍스트로 시작하거나 참조 이미지를 업로드한 뒤 배경, 스타일, 조명, 구도, 사용 목적을 바꾸세요.' }, { title: '교육 및 설명 자료', text: '인포그래픽, 수업용 다이어그램, 과정 비주얼, 학습 보조 자료, 라벨이 있는 차트, 발표용 교육 그래픽을 만드세요.' }, { title: '참조 기반 편집', text: '제품 사진 편집, 배경 변경, 실내 스타일 변경, 조명 개선, 변형 생성, 거친 참조를 완성도 높은 초안으로 바꾸세요.' }] },
  related: { title: '관련 AI 이미지 도구', description: '편집, 압축, 변환, 모델 비교가 필요하면 전문 모델 페이지나 다른 Toolaze 도구로 이어가세요.', cards: [{ title: 'AI 도구', text: '이미지, 비디오, 글쓰기, 생산성, 창작 workflow를 위한 더 많은 AI 도구를 살펴보세요.', label: 'AI 도구 보기' }, { title: 'AI 모델', text: '작업, 출력 스타일, 모델 계열, 창작 workflow별로 Toolaze 이미지 및 비디오 모델을 비교하세요.', label: '모델 보기' }, { title: 'AI 이미지 투 이미지 생성기', text: '참조 이미지를 업로드하고 편집 내용을 설명해 제어된 변형, 제품 컷, 배경 교체, 스타일 변경을 만드세요.', label: '이미지에서 편집' }, { text: 'GPT Image 2로 포스터, 제품 광고, 읽기 쉬운 텍스트, UI 목업, 구조화된 이미지를 만드세요.', label: 'GPT Image 2 사용해 보기' }, { title: 'GPT Image 2 프롬프트', text: '텍스트가 많은 이미지, 제품 비주얼, UI 목업, 캠페인 레이아웃을 위한 프롬프트 구조를 살펴보세요.', label: '프롬프트 열기' }, { title: '광고 프롬프트', text: '제품 출시, 소셜 캠페인, 유료 크리에이티브, 썸네일 콘셉트를 위한 광고 프롬프트 템플릿을 사용하세요.', label: '광고 보기' }, { title: '이미지 변환기', text: '다운로드한 AI 이미지를 JPG, PNG, WebP, HEIC 형식으로 변환해 게시 workflow에 맞추세요.', label: '이미지 변환' }, { title: '이미지 압축기', text: '생성 이미지를 웹 게시, 이커머스 등록, 소셜 업로드, 빠른 페이지 속도에 맞게 압축하세요.', label: '이미지 압축' }] },
  faq: { title: 'AI 이미지 생성기 FAQ', description: '무료 사용, 가입 없는 접근, 텍스트 이미지, 이미지 투 이미지 편집, 모델 선택, 상업적 검토에 대한 빠른 답변입니다.', items: [{ q: 'AI 이미지 생성기란 무엇인가요?', a: 'AI 이미지 생성기는 텍스트 프롬프트, 참조 이미지, 편집 지시에서 제품 이미지, 포스터, 광고, 썸네일, 인물, UI, 소셜 비주얼을 만드는 도구입니다.' }, { q: '이 AI 이미지 생성기는 무료인가요?', a: '네. Toolaze에서는 온라인에서 무료로 AI 이미지 생성을 시작할 수 있습니다. 사용량은 할당량, 모델 사용 가능 여부, 선택한 설정, 계정 상태에 따라 달라질 수 있습니다.' }, { q: '가입이 필요한가요?', a: '시작할 때 가입은 필요하지 않습니다. 생성기를 열고 프롬프트를 작성한 뒤 설정을 선택해 온라인에서 이미지를 만들 수 있습니다.' }, { q: '텍스트에서 AI 이미지를 어떻게 생성하나요?', a: '주제, 스타일, 레이아웃, 배경, 조명, 비율, 필요한 정확한 텍스트를 포함한 프롬프트를 입력하세요. 생성 후 결과를 확인하고 프롬프트를 개선하세요.' }, { q: '다른 이미지에서 AI 이미지를 만들 수 있나요?', a: '네. 참조 이미지를 업로드하고 배경, 조명, 스타일, 구도, 장면 등 무엇을 바꿀지 설명하세요.' }, { q: '텍스트 이미지 생성기로 무엇을 만들 수 있나요?', a: '텍스트 프롬프트로 광고, 포스터, 제품 이미지, 썸네일, 소셜 비주얼, 인물, 콘셉트 아트, UI 목업, 디자인 초안을 만들 수 있습니다.' }, { q: '어떤 AI 이미지 모델을 써야 하나요?', a: '일반 텍스트 이미지 작업은 GPT Image 2로 시작하세요. 구조화된 레이아웃은 Wan 2.7 Image, 완성도 높은 편집은 Nano Banana Pro, 빠른 변형은 Nano Banana 2를 사용하세요.' }, { q: 'AI 생성 이미지를 상업적으로 사용할 수 있나요?', a: '권리, 브랜드, 플랫폼, 법적 요구사항을 충족한다면 AI 생성 이미지는 상업용 초안과 프로젝트에 사용할 수 있습니다. 게시 전 최종 이미지를 항상 검토하세요.' }, { q: '어떤 프롬프트가 가장 잘 작동하나요?', a: '좋은 프롬프트는 자산 유형, 주제, 스타일, 구도, 텍스트, 조명, 출력 목적, 제한사항을 명확히 적습니다. 이미지 편집에서는 유지할 내용도 말하세요.' }, { q: '읽기 쉬운 텍스트를 만들 수 있나요?', a: '모델마다 텍스트 능력이 다릅니다. 짧고 정확한 문구를 따옴표로 쓰고 위치를 설명한 뒤 사용 전에 철자를 확인하세요.' }, { q: 'Toolaze AI Image Generator로 무엇을 만들 수 있나요?', a: '제품 이미지, 포스터, 광고, 썸네일, 소셜 비주얼, 인물, UI 콘셉트, 교육 그래픽, 캐릭터 아이디어, 참조 기반 편집을 만들 수 있습니다.' }] },
  cta: { title: '온라인에서 AI 이미지 만들기 시작', description: 'Toolaze AI Image Generator로 텍스트에서 이미지를 만들고, 참조 이미지로 편집하고, AI 모델을 비교하며 제품, 광고, 썸네일, 소셜, 교육, 디자인용 실용 비주얼을 제작하세요.', button: '이미지 생성' },
}

function createRomanceCopy(locale: AiImageGeneratorLocale): DeepPartial<AiImageGeneratorPageCopy> {
  const copy = romanceOverrides[locale]
  if (!copy) return {}

  const shallowCopy: DeepPartial<AiImageGeneratorPageCopy> = {
    metadata: { title: copy.metadataTitle, description: copy.metadataDescription },
    breadcrumbs: { home: copy.home, aiTools: copy.aiTools, current: copy.current },
    hero: { highlight: copy.highlight, description: copy.heroDescription, badges: copy.badges },
    whatIs: { title: copy.whatIsTitle },
    promise: { title: copy.promiseTitle },
    features: { title: copy.featuresTitle },
    gallery: { title: copy.galleryTitle },
    models: { title: copy.modelsTitle },
    modes: {
      title: copy.modesTitle,
      description: copy.modesDescription,
      headers: copy.modesHeaders,
      rows: copy.modesRows,
    },
    prompts: { title: copy.promptsTitle },
    howTo: { title: copy.howToTitle },
    useCases: { title: copy.useCasesTitle },
    related: { title: copy.relatedTitle },
    faq: { title: copy.faqTitle },
    cta: { title: copy.ctaTitle, button: copy.ctaButton },
  }

  return mergeCopy(shallowCopy as AiImageGeneratorPageCopy, romanceDeepOverrides[locale] ?? {})
}

localizedCopyOverrides.pt = createRomanceCopy('pt')
localizedCopyOverrides.fr = createRomanceCopy('fr')
localizedCopyOverrides.it = createRomanceCopy('it')
localizedCopyOverrides.ko = koOverrides

const copies: Record<AiImageGeneratorLocale, AiImageGeneratorPageCopy> = AI_IMAGE_GENERATOR_LOCALES.reduce((acc, locale) => {
  acc[locale] = locale === 'en' ? en : mergeCopy(en, localizedCopyOverrides[locale] ?? {})
  return acc
}, {} as Record<AiImageGeneratorLocale, AiImageGeneratorPageCopy>)

function normalizeAiImageGeneratorLocale(locale: string): AiImageGeneratorLocale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return AI_IMAGE_GENERATOR_LOCALES.includes(locale as AiImageGeneratorLocale) ? (locale as AiImageGeneratorLocale) : 'en'
}

export function getAiImageGeneratorPageCopy(locale = 'en'): AiImageGeneratorPageCopy {
  return copies[normalizeAiImageGeneratorLocale(locale)]
}
