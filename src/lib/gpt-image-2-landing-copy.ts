import type { Metadata } from 'next'

export const GPT_IMAGE_2_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

export type GptImage2Locale = (typeof GPT_IMAGE_2_LOCALES)[number]

type TextItem = {
  title: string
  text: string
}

type FeatureItem = {
  slot: string
  title: string
  paragraphs: string[]
  label: string
}

type GalleryItem = TextItem & {
  slot: string
}

type ComparisonRow = {
  capability: string
  gpt: string
  nano: string
  midjourney: string
  flux: string
}

type PromptExample = {
  id: string
  slot: string
  title: string
  prompt: string
}

type CommunityText = {
  title: string
  text: string
}

type RelatedLink = TextItem & {
  href: string
}

type FaqItem = {
  q: string
  a: string
}

export type GptImage2LandingCopy = {
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
  audiences: {
    title: string
    text: string
    items: string[]
  }
  comparison: {
    title: string
    text: string
    capabilityHeader: string
    rows: ComparisonRow[]
    note: string
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
    examples: Array<CommunityText & { creator: string; href: string; videoId: string }>
  }
  reddit: {
    title: string
    text: string
    communityDiscussion: string
    openDiscussion: string
    items: CommunityText[]
  }
  x: {
    title: string
    text: string
    verified: string
    follow: string
    watch: string
    likes: string
    reply: string
    copyLink: string
    read: string
    replies: string
    monthYear: string
    items: Array<{ title: string; body: string }>
  }
  related: {
    title: string
    text: string
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
  image: {
    container: string
  }
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

function mergeCopy<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) return base
  if (Array.isArray(base)) {
    return (override as T) || base
  }
  if (typeof base !== 'object' || base === null) {
    return (override as T) ?? base
  }

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    const baseValue = result[key]
    result[key] = Array.isArray(baseValue)
      ? value
      : typeof baseValue === 'object' && baseValue !== null && typeof value === 'object' && value !== null
        ? mergeCopy(baseValue, value as never)
        : value
  }

  return result as T
}

function normalizeLocale(locale: string): GptImage2Locale {
  if (locale === 'zh' || locale === 'zh-CN' || locale === 'zh-HK') return 'zh-TW'
  return GPT_IMAGE_2_LOCALES.includes(locale as GptImage2Locale) ? (locale as GptImage2Locale) : 'en'
}

const englishCopy: GptImage2LandingCopy = {
  metadata: {
    title: 'GPT Image 2 AI Image Generator | Free, No Signup',
    description:
      'Use GPT Image 2 online on Toolaze for free with no signup. Create 4K images, product posters, social ads, UI mockups, edits, and prompt examples.',
    openGraphDescription:
      'Create 4K images, product posters, social media ads, UI mockups, image edits, and text-rich commercial visuals with GPT Image 2 on Toolaze.',
    twitterDescription: 'Try GPT Image 2 online on Toolaze for free with no signup or login.',
  },
  breadcrumbs: {
    home: 'Home',
    model: 'Model',
    current: 'GPT Image 2',
  },
  schema: {
    pageName: 'GPT Image 2 AI Image Generator',
    appName: 'GPT Image 2 AI Image Generator',
    howToName: 'How to Use GPT Image 2 for Free Without Signup on Toolaze',
  },
  hero: {
    modelName: 'GPT Image 2',
    suffix: 'AI Image Generator',
    description:
      "Use GPT Image 2 online on Toolaze for free with no signup or login. Create 4K images, product posters, social media ads, UI mockups, edited product visuals, and text-rich commercial graphics with OpenAI's image generation model directly in your browser.",
  },
  whatIs: {
    title: 'What Is GPT Image 2?',
    paragraphs: [
      "GPT Image 2 is OpenAI's image generation and editing model for creating visuals from text prompts and reference images. It is useful when an image needs more than a decorative style: readable text, structured layout, realistic product staging, clear prompt following, and practical image editing.",
      'On Toolaze, GPT Image 2 is positioned as a free online AI image generator for creators, marketers, designers, e-commerce sellers, product teams, and educators. You can use it for text-to-image work, image-to-image edits, product concepts, advertising layouts, UI mockups, infographics, thumbnail concepts, and other visual drafts that need both creativity and structure.',
      'The main reason to choose GPT Image 2 is not only that it can make attractive images. Its stronger value is in practical visual work: short readable text inside images, commercial layouts, reference-guided edits, and prompt-driven variations that are easier to review, refine, and publish.',
    ],
  },
  features: {
    title: 'Key Features of GPT Image 2',
    text: 'Each feature maps to a real image job: readable text, 4K drafts, product editing, structured layouts, and campaign-ready visual exploration.',
    items: [
      {
        slot: 'feature-text-rendering',
        title: 'High-Accuracy Text Rendering',
        paragraphs: [
          'Text rendering is one of the most important reasons to use GPT Image 2 for commercial images. Marketing teams often need readable headlines, product labels, UI phrases, event titles, stickers, chart labels, or callouts inside the image.',
          'Keep the text concise, put exact words in quotation marks, and describe where the text should appear. Before publishing, still check spelling, brand wording, legal statements, and small typography.',
        ],
        label: 'GPT Image 2 product poster with readable headline and package label',
      },
      {
        slot: 'feature-4k-output',
        title: '4K Image Output',
        paragraphs: [
          'GPT Image 2 is useful when the output needs enough resolution for review, layout testing, campaign planning, and high-quality web visuals. On Toolaze, use 4K output when the selected ratio and model settings support it.',
          'High-resolution output matters most when the image includes product details, text labels, interface elements, textures, or a design system board.',
        ],
        label: 'GPT Image 2 4K commercial visual with product detail and clean layout',
      },
      {
        slot: 'feature-image-editing',
        title: 'Image Generation and Editing',
        paragraphs: [
          'GPT Image 2 is not only for creating images from scratch. It also works well for reference-guided editing, where you start with an existing product image, room photo, interface concept, or visual direction and ask the model to change specific parts of it.',
          'Use image-to-image workflows for background replacement, product staging, lighting cleanup, seasonal campaign variations, packaging mockups, e-commerce listing ideas, and before-after concepts.',
        ],
        label: 'GPT Image 2 before and after product image editing example',
      },
      {
        slot: 'feature-ui-layouts',
        title: 'Structured Layout Control',
        paragraphs: [
          'GPT Image 2 is useful when the image needs a readable layout rather than a purely artistic look. Product teams can use it to sketch dashboards, app screens, landing page hero concepts, feature diagrams, data boards, classroom explainers, and presentation-ready visual systems.',
        ],
        label: 'GPT Image 2 dashboard UI mockup with structured cards and labels',
      },
      {
        slot: 'feature-commercial-output',
        title: 'Commercial Creative Output',
        paragraphs: [
          'GPT Image 2 can help marketing teams explore multiple campaign directions before committing design time. Use prompts to test product posters, paid social ads, creator thumbnails, e-commerce banners, feature launch visuals, and seasonal campaign concepts.',
        ],
        label: 'GPT Image 2 campaign board with ad creative variations',
      },
      {
        slot: 'feature-prompt-following',
        title: 'Prompt Following',
        paragraphs: [
          'GPT Image 2 responds best when the prompt gives it a clear job. Describe the asset type, subject, audience, layout, exact text, visual style, lighting, background, output ratio, and what should not change. If the first result is close but not correct, revise one part of the prompt at a time.',
        ],
        label: 'GPT Image 2 prompt instruction board with visual output examples',
      },
    ],
  },
  gallery: {
    title: 'Example Gallery for GPT Image 2',
    text: 'These eight examples show where GPT Image 2 is useful on Toolaze: advertising, e-commerce, UI design, social content, education, text-rich branding, image editing, and high-resolution campaigns.',
    examples: [
      {
        slot: 'gallery-product-poster',
        title: 'Product Launch Poster',
        text: 'Create a clean product poster for a bottle, skincare item, coffee drink, snack package, or software feature with a readable headline and clear product hero.',
      },
      {
        slot: 'gallery-social-ad',
        title: 'Social Media Ad',
        text: 'Build a scroll-stopping social ad with bold short text, a clear product benefit, creator-friendly composition, and safe fictional people or objects.',
      },
      {
        slot: 'gallery-ui-mockup',
        title: 'UI Mockup Concept',
        text: 'Generate an app dashboard, analytics panel, onboarding page, or feature overview image with readable labels and structured navigation.',
      },
      {
        slot: 'gallery-ecommerce',
        title: 'E-Commerce Product Image',
        text: 'Use a product reference to create a cleaner marketplace image, seasonal background, lifestyle setup, or bundle visual.',
      },
      {
        slot: 'gallery-education',
        title: 'Educational Infographic',
        text: 'Create a classroom visual, science diagram, historical explainer, process chart, or study guide image with clear section labels.',
      },
      {
        slot: 'gallery-text-logo',
        title: 'Text Logo Concept',
        text: 'Explore early logo concepts, badge layouts, event titles, sticker designs, and packaging wordmarks with short readable text.',
      },
      {
        slot: 'gallery-reference-edit',
        title: 'Reference-Guided Edit',
        text: 'Upload a reference image and ask GPT Image 2 to preserve the main subject while changing background, lighting, styling, or layout.',
      },
      {
        slot: 'gallery-high-resolution',
        title: 'High-Resolution Campaign Visual',
        text: 'Create a polished campaign image for posters, banners, product launches, and large-format creative drafts when 4K output is needed.',
      },
    ],
  },
  audiences: {
    title: 'Who Should Use GPT Image 2?',
    text: 'GPT Image 2 is useful for teams that need practical visuals, not just one-off experiments.',
    items: [
      'Marketing teams: Create product posters, paid social concepts, campaign variants, launch visuals, and thumbnail ideas for fast creative testing.',
      'Designers: Explore moodboards, UI screens, layout systems, typography directions, and visual concepts before moving into production tools.',
      'E-commerce sellers: Create product image variations, seasonal backgrounds, listing visuals, bundle images, and promotional banners for online stores.',
      'Content creators: Make thumbnails, educational graphics, social media posts, creator economy visuals, and branded images with clearer text direction.',
      'Product managers: Mock up feature screens, internal planning boards, app concepts, and product storytelling visuals for early validation.',
      'Educators: Create diagrams, lesson visuals, concept maps, classroom explainers, and simple infographics for teaching materials.',
    ],
  },
  comparison: {
    title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux',
    text: 'Choose an AI image model by the job, not by the loudest claim. GPT Image 2 is strongest when the image depends on text, structure, editing, and commercial purpose.',
    capabilityHeader: 'Capability',
    rows: [
      {
        capability: 'Best for',
        gpt: 'Text-rich commercial visuals, image editing, UI mockups, structured layouts',
        nano: 'Fast image generation, reference edits, Gemini-style creative workflows',
        midjourney: 'Stylized art direction, cinematic visuals, aesthetic exploration',
        flux: 'Photoreal images, open workflows, multi-reference control',
      },
      {
        capability: 'Text rendering',
        gpt: 'Strong for short readable text, labels, posters, and UI-style visuals',
        nano: 'Strong in newer Gemini image workflows and text-heavy designs',
        midjourney: 'Improved but still needs careful review',
        flux: 'Strong in typography and layout-focused use cases',
      },
      {
        capability: 'Image editing',
        gpt: 'Useful for natural-language edits and reference-guided changes',
        nano: 'Useful for fast iteration and image-to-image variations',
        midjourney: 'Editor workflows are available but less direct for some users',
        flux: 'Strong for text-prompted editing and reference control',
      },
      {
        capability: 'Layout control',
        gpt: 'Strong for dashboards, posters, infographics, and multi-panel concepts',
        nano: 'Good for structured generation and commercial concepts',
        midjourney: 'Better for visual style than strict layout',
        flux: 'Strong for production-style visuals and controlled compositions',
      },
      {
        capability: '4K output',
        gpt: 'Supports high-resolution workflows, including 4K when settings support it',
        nano: 'Strong high-resolution positioning in current image workflows',
        midjourney: 'High-quality output with strong detail and texture',
        flux: 'Strong detail and photoreal output across supported workflows',
      },
      {
        capability: 'Limitations',
        gpt: 'Review spelling, small text, faces, hands, brand claims, and compliance',
        nano: 'Review model availability, style fit, and reference consistency',
        midjourney: 'Less ideal when exact text and strict layout are the priority',
        flux: 'Workflow and access can vary by platform and model version',
      },
    ],
    note: 'Use GPT Image 2 first when you need readable text, structured layouts, product visuals, image edits, or commercial design drafts. Use Midjourney when art direction is the main goal. Use Flux when open workflows and reference control matter. Use Nano Banana when you want another fast image model for creative iteration and comparison.',
  },
  howTo: {
    title: 'How to Use GPT Image 2 for Free Without Signup on Toolaze',
    steps: [
      'Open the GPT Image 2 page on Toolaze.',
      'Start with free no-signup access.',
      'Enter a clear prompt or upload a reference image when your task needs image-to-image editing.',
      'Generate, review spelling and visual details, then refine the prompt or reference images.',
    ],
  },
  prompts: {
    title: 'Best GPT Image 2 Prompt Examples',
    text: 'These examples focus on GPT Image 2 strengths that are different from the gallery above: multilingual typography, print constraints, character consistency, sequential storytelling, reference edits, and editorial layouts.',
    copyButton: 'Copy',
    copiedButton: 'Copied',
    examples: [
      {
        id: 'multilingual-text',
        slot: 'prompt-multilingual-text',
        title: 'Multilingual Text Layout Prompt',
        prompt:
          'Create a premium multilingual editorial poster titled "GLOBAL TYPE". Include readable text blocks in English, Spanish, French, Japanese, and Arabic, with a clean grid, bold headline typography, strong color contrast, and enough spacing for each language. Keep all text short and review-ready.',
      },
      {
        id: 'print-layout',
        slot: 'prompt-print-layout',
        title: 'Print Layout Prompt',
        prompt:
          'Create a print-ready Art Deco bookmark concept for a fictional bookstore named "Tangerine Books". Show the bookmark on a clean proof sheet with visible bleed, trim, and safe margin guide lines. Include the exact words "TANGERINE BOOKS" and "READ WELL" with crisp lettering.',
      },
      {
        id: 'character-sheet',
        slot: 'prompt-character-sheet',
        title: 'Character Reference Sheet Prompt',
        prompt:
          'Create a coherent character reference sheet for an original adventure game heroine named "Adele". Show front view, side view, back view, three facial expressions, outfit details, a color palette, and one prop close-up. Keep the character identity consistent across every panel.',
      },
      {
        id: 'storyboard',
        slot: 'prompt-storyboard',
        title: 'Sequential Storyboard Prompt',
        prompt:
          'Create a six-panel storyboard titled "RAIN RUN". Show the same courier riding through a rainy neon city while delivering one glowing package. Keep the character, package, weather, and visual style consistent from Panel 1 through Panel 6.',
      },
      {
        id: 'reference-edit',
        slot: 'prompt-reference-edit',
        title: 'Reference-Guided Interior Edit Prompt',
        prompt:
          'Use the uploaded living room photo as the reference. Preserve the window placement, wall structure, sofa position, floor, and camera angle. Change only the interior style into a warm Japandi look with wood textures, soft daylight, neutral fabric, and sage green accents.',
      },
      {
        id: 'travel-brochure',
        slot: 'prompt-travel-brochure',
        title: 'Editorial Brochure Prompt',
        prompt:
          'Create a premium travel brochure spread for a fictional mountain retreat called "Mist Ridge Lodge". Include the headings "Weekend Retreat", "Rooms", "Dining", and "Trails". Use elegant editorial photography, readable type, calm luxury colors, and a polished hospitality layout.',
      },
    ],
  },
  youtube: {
    title: 'GPT Image 2 Videos on YouTube',
    text: 'YouTube videos are useful when you want a walkthrough instead of a static example. These links help users compare workflows, watch prompt tests, and see how creators explain GPT Image 2.',
    watch: 'Watch on YouTube',
    examples: [
      {
        title: 'Introducing ChatGPT Images 2.0',
        creator: 'OpenAI',
        href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI',
        videoId: 'sWkGomJ3TLI',
        text: 'An official launch-style video reference for understanding how OpenAI presents the new image workflow and model direction.',
      },
      {
        title: 'GPT Image 2 vs Nano Banana 2',
        creator: 'Creator guide',
        href: 'https://www.youtube.com/watch?v=Yp4nRScy45c',
        videoId: 'Yp4nRScy45c',
        text: 'A practical comparison video that helps users evaluate model choice, workflow differences, and real image results.',
      },
      {
        title: 'OpenAI Image 2: 10 ways to use it',
        creator: 'Creator test',
        href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw',
        videoId: 'GY-kAiZGLOw',
        text: 'A use-case focused video that explores practical applications beyond a single gallery image.',
      },
    ],
  },
  reddit: {
    title: 'GPT Image 2 Discussions on Reddit',
    text: 'Reddit discussions are useful for reading practical questions, comparison concerns, and early user reactions. Use them as community context, not as official model documentation.',
    communityDiscussion: 'Community discussion',
    openDiscussion: 'Open Reddit Discussion',
    items: [
      {
        title: 'Image 2.0 consistency sequence',
        text: 'A multi-image Reddit thread testing whether Image 2.0 can keep the same subject consistent across different angles and action shots.',
      },
      {
        title: 'Prompt stress-test examples',
        text: 'A different Reddit post with several output tests, useful for comparing detail, composition, and prompt-following behavior across tasks.',
      },
      {
        title: 'Game sprite workflow test',
        text: 'A game-dev discussion showing sprite-sheet output and animation-style media, relevant for consistency and asset-production use cases.',
      },
      {
        title: 'Casual output experimentation',
        text: 'A separate community post with practical image examples and comments around how GPT-Image-2 feels in everyday experimentation.',
      },
      {
        title: 'Artifact critique discussion',
        text: 'A Reddit critique thread focused on visible artifacts, useful for balancing the page with real failure-mode discussion instead of only praise.',
      },
      {
        title: 'Self-review iteration claim',
        text: 'A post about GPT-Image-2 reviewing and iterating on its own output, useful context for quality-control and refinement claims.',
      },
      {
        title: 'Quality jump discussion',
        text: 'A separate discussion centered on perceived quality gains, useful as community context rather than official model documentation.',
      },
      {
        title: 'Multi-example quality thread',
        text: 'A multi-image thread that gives another set of public examples, helping the section avoid depending on one viral post.',
      },
      {
        title: 'Image 2.0 wow examples',
        text: 'Another independent Reddit post with multiple examples, useful for judging style range and public reaction beyond a single thread.',
      },
      {
        title: 'GPT Image 2 vs Nano Banana 2',
        text: 'A model-comparison post with several side-by-side images, relevant for searchers comparing GPT Image 2 with other image models.',
      },
    ],
  },
  x: {
    title: 'GPT Image 2 Examples on X',
    text: 'Creators on X often publish concrete output tests. These links are useful for studying the kinds of layouts, image styles, and model stress tests people are trying in public.',
    verified: 'Verified',
    follow: 'Follow',
    watch: 'Watch on X',
    likes: 'Likes',
    reply: 'Reply',
    copyLink: 'Copy link',
    read: 'Read',
    replies: 'replies',
    monthYear: 'Jun 2026',
    items: [
      {
        title: 'Complete UI design system board',
        body: 'Public GPT Image 2 example testing a complete UI design system board with structured labels, component cards, and interface layout control.',
      },
      {
        title: 'Official character sheet reconstruction',
        body: 'A useful X reference for character consistency, pose breakdowns, costume details, and reference-sheet style composition.',
      },
      {
        title: 'Dense Chinese text layout test',
        body: 'A dense non-English text layout test that is helpful for reviewing typography handling, spacing, hierarchy, and readable copy inside generated images.',
      },
      {
        title: 'Mathematical concept visualization',
        body: 'A public educational visual example focused on concept explanation, clean diagram structure, and infographic-style reasoning.',
      },
      {
        title: 'Multi-page brand kit',
        body: 'A commercial brand-kit style example for page consistency, identity presentation, layout systems, and campaign-ready visual direction.',
      },
      {
        title: 'Interior design mood board',
        body: 'A creator example for interior mood boards, material palettes, room concepts, and reference-guided visual planning.',
      },
      {
        title: 'Stylized character poster',
        body: 'A public image example focused on polished character presentation, strong art direction, and production-ready poster composition.',
      },
      {
        title: 'Creator prompt collection',
        body: 'A creator image test that is useful for studying promptable composition, visual hierarchy, and finished social-ready output.',
      },
      {
        title: 'Studio product prompt',
        body: 'A public still-image example for product-style composition, lighting control, and prompt-driven commercial presentation.',
      },
      {
        title: 'Cinematic illustration test',
        body: 'A public X image example for checking cinematic style, lighting, subject detail, and image-model range in a still visual.',
      },
    ],
  },
  related: {
    title: 'Explore More AI Models and Tools',
    text: 'Use GPT Image 2 when you want text-rich images, image editing, structured layouts, and commercial visuals. Explore related Toolaze pages when your creative task changes.',
    tryNow: 'Try Now',
    links: [
      {
        title: 'GPT Image 2 Prompt Templates',
        href: '/prompts/models/gpt-image-2',
        text: 'Study source-backed prompt structures, then return to GPT Image 2 to create your own image.',
      },
      {
        title: 'Nano Banana Pro Generator',
        href: '/model/nano-banana-pro',
        text: 'Compare a Gemini image workflow for high-resolution design assets and text-heavy layouts.',
      },
      {
        title: 'Nano Banana 2 Generator',
        href: '/model/nano-banana-2',
        text: 'Explore another fast image generation and editing model for common publishing formats.',
      },
      {
        title: 'Nano Banana Image to Image',
        href: '/model/nano-banana',
        text: 'Use another image-to-image workflow when reference-guided editing is your main priority.',
      },
      {
        title: 'AI Models Hub',
        href: '/model',
        text: 'Browse Toolaze image and video model pages when you need broader model comparison.',
      },
    ],
  },
  faq: {
    title: 'FAQs About GPT Image 2',
    items: [
      {
        q: 'What is GPT Image 2?',
        a: "GPT Image 2 is OpenAI's image generation and editing model for creating images from text prompts and reference images. It is useful for product posters, social media ads, UI mockups, image editing, text-rich visuals, and structured commercial design concepts.",
      },
      {
        q: 'Is GPT Image 2 free on Toolaze?',
        a: 'Yes. Toolaze lets you try GPT Image 2 for free online. Free usage may depend on daily quota, model availability, output settings, or future access policy, but the page is designed for fast browser-based image generation.',
      },
      {
        q: 'Can I use GPT Image 2 without signup?',
        a: 'Yes. Toolaze lets you try GPT Image 2 without signup or login. Some advanced settings, higher limits, downloads, or continued usage may require signing in, depending on the current Toolaze access policy.',
      },
      {
        q: 'Does GPT Image 2 support 4K output?',
        a: 'Yes. GPT Image 2 supports high-resolution image workflows, including 4K output when the selected mode, ratio, and settings support it. Use 4K for product posters, campaign visuals, UI mockups, and presentation-ready creative drafts.',
      },
      {
        q: 'What can I create with GPT Image 2?',
        a: 'You can create product posters, social media ads, UI mockups, e-commerce images, educational infographics, text logo concepts, edited images, campaign visuals, thumbnails, and reference-guided creative variations.',
      },
      {
        q: 'Can GPT Image 2 edit images?',
        a: 'Yes. GPT Image 2 supports image editing from text and image inputs. Use it for product image cleanup, background changes, lighting refinement, layout changes, visual variations, before-after concepts, and reference-guided creative updates.',
      },
      {
        q: 'Is GPT Image 2 better than Nano Banana, Midjourney, or Flux?',
        a: 'It depends on the task. GPT Image 2 is a strong choice for text-rich images, structured layouts, image editing, and commercial visuals. Midjourney is often stronger for stylized art direction, while Flux and Nano Banana can be useful for different reference and workflow needs.',
      },
      {
        q: 'What prompts work best with GPT Image 2?',
        a: 'The best prompts describe the asset type, subject, exact text, composition, style, lighting, background, output purpose, and constraints. For edits, specify what should stay unchanged and what should be modified.',
      },
    ],
  },
  cta: {
    title: 'Create with GPT Image 2 on Toolaze for Free',
    text: 'Try GPT Image 2 online with no signup or login and create 4K images, product posters, social media ads, UI mockups, edited product visuals, and text-rich commercial graphics directly on Toolaze.',
    button: 'Start Free on Toolaze',
    label: 'GPT Image 2 final CTA visual with commercial image examples',
  },
  image: {
    container: 'Image container',
  },
}

const localizedOverrides: Record<Exclude<GptImage2Locale, 'en'>, DeepPartial<GptImage2LandingCopy>> = {
  de: {
    metadata: {
      title: 'GPT Image 2 KI-Bildgenerator | Kostenlos, ohne Anmeldung',
      description:
        'Nutzen Sie GPT Image 2 online auf Toolaze kostenlos und ohne Anmeldung. Erstellen Sie 4K-Bilder, Produktposter, Social Ads, UI-Mockups, Bearbeitungen und Prompt-Beispiele.',
      openGraphDescription:
        'Erstellen Sie 4K-Bilder, Produktposter, Social-Media-Anzeigen, UI-Mockups, Bildbearbeitungen und textreiche kommerzielle Visuals mit GPT Image 2 auf Toolaze.',
      twitterDescription: 'Testen Sie GPT Image 2 online auf Toolaze kostenlos und ohne Anmeldung.',
    },
    breadcrumbs: { home: 'Startseite', model: 'Modell', current: 'GPT Image 2' },
    schema: {
      pageName: 'GPT Image 2 KI-Bildgenerator',
      appName: 'GPT Image 2 KI-Bildgenerator',
      howToName: 'So verwenden Sie GPT Image 2 kostenlos und ohne Anmeldung auf Toolaze',
    },
    hero: {
      suffix: 'KI-Bildgenerator',
      description:
        "Nutzen Sie GPT Image 2 online auf Toolaze kostenlos und ohne Anmeldung. Erstellen Sie 4K-Bilder, Produktposter, Social-Media-Anzeigen, UI-Mockups, bearbeitete Produktbilder und textreiche kommerzielle Grafiken direkt im Browser.",
    },
    whatIs: {
      title: 'Was ist GPT Image 2?',
      paragraphs: [
        'GPT Image 2 ist OpenAIs Modell zur Bildgenerierung und Bildbearbeitung aus Text-Prompts und Referenzbildern. Es ist besonders nützlich, wenn ein Bild lesbaren Text, klare Layouts, realistische Produktinszenierung, genaue Prompt-Umsetzung und praktische Bearbeitung braucht.',
        'Auf Toolaze ist GPT Image 2 als kostenloser Online-KI-Bildgenerator für Creator, Marketingteams, Designer, E-Commerce-Anbieter, Produktteams und Lehrkräfte gedacht.',
        'Der wichtigste Grund für GPT Image 2 ist praktische visuelle Arbeit: kurzer lesbarer Text im Bild, kommerzielle Layouts, referenzgeführte Bearbeitungen und Varianten, die sich leichter prüfen und verbessern lassen.',
      ],
    },
    features: {
      title: 'Wichtige Funktionen von GPT Image 2',
      text: 'Jede Funktion passt zu einer realen Bildaufgabe: lesbarer Text, 4K-Entwürfe, Produktbearbeitung, strukturierte Layouts und Kampagnenvisuals.',
      items: [
        { slot: 'feature-text-rendering', title: 'Sehr gute Textdarstellung', paragraphs: ['Textdarstellung ist einer der wichtigsten Gründe, GPT Image 2 für kommerzielle Bilder zu nutzen. Marketingteams benötigen oft lesbare Headlines, Produktlabels, UI-Texte, Eventtitel, Sticker, Diagrammbeschriftungen oder Callouts direkt im Bild.', 'Halten Sie Text kurz, setzen Sie genaue Wörter in Anführungszeichen und beschreiben Sie die Position. Prüfen Sie vor der Veröffentlichung Rechtschreibung, Markenformulierungen, rechtliche Aussagen und kleine Typografie.'], label: 'GPT Image 2 Produktposter mit lesbarer Headline und Verpackungslabel' },
        { slot: 'feature-4k-output', title: '4K-Bildausgabe', paragraphs: ['GPT Image 2 eignet sich, wenn die Ausgabe genug Auflösung für Review, Layouttests, Kampagnenplanung und hochwertige Webvisuals braucht. Verwenden Sie auf Toolaze 4K, wenn Seitenverhältnis und Modelleinstellungen es unterstützen.', 'Hohe Auflösung ist besonders wichtig bei Produktdetails, Textlabels, Interface-Elementen, Texturen oder Design-System-Boards.'], label: 'GPT Image 2 4K-Kampagnenvisual mit Produktdetails und klarem Layout' },
        { slot: 'feature-image-editing', title: 'Bildgenerierung und Bearbeitung', paragraphs: ['GPT Image 2 erstellt nicht nur Bilder von Grund auf. Es eignet sich auch für referenzgeführte Bearbeitung, wenn Sie mit einem Produktbild, Raumfoto, Interface-Konzept oder einer visuellen Richtung starten und gezielt einzelne Teile ändern möchten.', 'Nutzen Sie Image-to-Image für Hintergrundwechsel, Produktinszenierung, Lichtkorrekturen, saisonale Kampagnenvarianten, Packaging-Mockups, E-Commerce-Ideen und Vorher-Nachher-Konzepte.'], label: 'GPT Image 2 Beispiel für Produktbildbearbeitung vor und nachher' },
        { slot: 'feature-ui-layouts', title: 'Kontrolle strukturierter Layouts', paragraphs: ['GPT Image 2 ist nützlich, wenn ein Bild ein lesbares Layout statt nur einen künstlerischen Look braucht. Produktteams können Dashboards, App-Screens, Hero-Konzepte, Feature-Diagramme, Datenboards, Lernvisuals und Präsentationssysteme skizzieren.'], label: 'GPT Image 2 Dashboard-UI-Mockup mit Karten und Beschriftungen' },
        { slot: 'feature-commercial-output', title: 'Kommerzielle Kreativ-Outputs', paragraphs: ['GPT Image 2 hilft Marketingteams, mehrere Kampagnenrichtungen zu testen, bevor Designzeit gebunden wird. Testen Sie Produktposter, Paid Social Ads, Creator-Thumbnails, E-Commerce-Banner, Launch-Visuals und saisonale Konzepte.'], label: 'GPT Image 2 Kampagnenboard mit Anzeigenvarianten' },
        { slot: 'feature-prompt-following', title: 'Prompt-Befolgung', paragraphs: ['GPT Image 2 funktioniert am besten, wenn der Prompt eine klare Aufgabe beschreibt: Asset-Typ, Motiv, Zielgruppe, Layout, exakter Text, Stil, Licht, Hintergrund, Format und unveränderte Bereiche. Wenn das erste Ergebnis nah dran ist, ändern Sie jeweils nur einen Teil des Prompts.'], label: 'GPT Image 2 Prompt-Board mit visuellen Beispielen' },
      ],
    },
    gallery: {
      title: 'Beispielgalerie für GPT Image 2',
      text: 'Diese acht Beispiele zeigen, wo GPT Image 2 auf Toolaze nützlich ist: Werbung, E-Commerce, UI-Design, Social Content, Bildung, textreiches Branding, Bildbearbeitung und hochauflösende Kampagnen.',
    },
    audiences: {
      title: 'Wer sollte GPT Image 2 nutzen?',
      text: 'GPT Image 2 ist für Teams nützlich, die praktische Visuals brauchen, nicht nur einzelne Experimente.',
    },
    comparison: {
      title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux',
      text: 'Wählen Sie ein KI-Bildmodell nach Aufgabe, nicht nach dem lautesten Versprechen.',
      capabilityHeader: 'Fähigkeit',
    },
    howTo: {
      title: 'So verwenden Sie GPT Image 2 kostenlos und ohne Anmeldung auf Toolaze',
      steps: ['Öffnen Sie die GPT Image 2 Seite auf Toolaze.', 'Starten Sie mit kostenlosem Zugang ohne Anmeldung.', 'Geben Sie einen klaren Prompt ein oder laden Sie ein Referenzbild hoch.', 'Generieren Sie das Bild, prüfen Sie Details und verfeinern Sie Prompt oder Referenzen.'],
    },
    prompts: { title: 'Beste GPT Image 2 Prompt-Beispiele', text: 'Diese Beispiele konzentrieren sich auf Stärken wie mehrsprachige Typografie, Druckvorgaben, Charakterkonsistenz, Storyboards, Referenzbearbeitung und Editorial-Layouts.', copyButton: 'Kopieren', copiedButton: 'Kopiert' },
    youtube: { title: 'GPT Image 2 Videos auf YouTube', text: 'YouTube-Videos helfen, Workflows, Prompt-Tests und Erklärungen von Creators nachzuvollziehen.', watch: 'Auf YouTube ansehen' },
    reddit: { title: 'GPT Image 2 Diskussionen auf Reddit', text: 'Reddit-Diskussionen liefern praktische Fragen, Vergleiche und frühe Nutzerreaktionen.', communityDiscussion: 'Community-Diskussion', openDiscussion: 'Reddit-Diskussion öffnen' },
    x: { title: 'GPT Image 2 Beispiele auf X', text: 'Creator auf X veröffentlichen konkrete Output-Tests zu Layouts, Bildstilen und Modellgrenzen.', verified: 'Verifiziert', follow: 'Folgen', watch: 'Auf X ansehen', likes: 'Likes', reply: 'Antworten', copyLink: 'Link kopieren', read: 'Lesen', replies: 'Antworten', monthYear: 'Juni 2026' },
    related: { title: 'Weitere KI-Modelle und Tools entdecken', text: 'Nutzen Sie GPT Image 2 für textreiche Bilder, Bildbearbeitung, strukturierte Layouts und kommerzielle Visuals.', tryNow: 'Jetzt testen' },
    faq: {
      title: 'Häufige Fragen zu GPT Image 2',
      items: [
        { q: 'Was ist GPT Image 2?', a: 'GPT Image 2 ist OpenAIs Bildgenerierungs- und Bearbeitungsmodell für Bilder aus Text-Prompts und Referenzbildern.' },
        { q: 'Ist GPT Image 2 auf Toolaze kostenlos?', a: 'Ja. Toolaze lässt Sie GPT Image 2 kostenlos online testen. Die kostenlose Nutzung kann von Tageskontingenten, Verfügbarkeit und Einstellungen abhängen.' },
        { q: 'Kann ich GPT Image 2 ohne Anmeldung verwenden?', a: 'Ja. Sie können GPT Image 2 auf Toolaze ohne Anmeldung oder Login ausprobieren.' },
        { q: 'Unterstützt GPT Image 2 4K-Ausgabe?', a: 'Ja. GPT Image 2 unterstützt hochauflösende Workflows einschließlich 4K, wenn Modus, Seitenverhältnis und Einstellungen es erlauben.' },
        { q: 'Was kann ich mit GPT Image 2 erstellen?', a: 'Sie können Produktposter, Social Ads, UI-Mockups, E-Commerce-Bilder, Infografiken, Logoideen, Bildbearbeitungen und Kampagnenvisuals erstellen.' },
        { q: 'Kann GPT Image 2 Bilder bearbeiten?', a: 'Ja. GPT Image 2 unterstützt Bildbearbeitung aus Text- und Bildeingaben.' },
        { q: 'Ist GPT Image 2 besser als Nano Banana, Midjourney oder Flux?', a: 'Das hängt von der Aufgabe ab. GPT Image 2 ist stark bei textreichen Bildern, strukturierten Layouts, Bearbeitung und kommerziellen Visuals.' },
        { q: 'Welche Prompts funktionieren am besten mit GPT Image 2?', a: 'Gute Prompts beschreiben Asset-Typ, Motiv, exakten Text, Layout, Stil, Licht, Hintergrund, Zweck und Einschränkungen.' },
      ],
    },
    cta: { title: 'Erstellen Sie kostenlos mit GPT Image 2 auf Toolaze', text: 'Testen Sie GPT Image 2 online ohne Anmeldung und erstellen Sie 4K-Bilder, Produktposter, Social Ads, UI-Mockups und textreiche kommerzielle Grafiken direkt auf Toolaze.', button: 'Kostenlos auf Toolaze starten', label: 'GPT Image 2 CTA-Visual mit kommerziellen Bildbeispielen' },
    image: { container: 'Bildcontainer' },
  },
  ja: {
    metadata: {
      title: 'GPT Image 2 AI 画像ジェネレーター | 無料・登録不要',
      description: 'ToolazeでGPT Image 2を無料、登録不要でオンライン利用。4K画像、商品ポスター、SNS広告、UIモックアップ、画像編集、プロンプト例を作成できます。',
      openGraphDescription: 'ToolazeのGPT Image 2で、4K画像、商品ポスター、SNS広告、UIモックアップ、画像編集、文字の多い商用ビジュアルを作成できます。',
      twitterDescription: 'ToolazeでGPT Image 2を無料、登録不要で試せます。',
    },
    breadcrumbs: { home: 'ホーム', model: 'モデル', current: 'GPT Image 2' },
    schema: { pageName: 'GPT Image 2 AI 画像ジェネレーター', appName: 'GPT Image 2 AI 画像ジェネレーター', howToName: 'ToolazeでGPT Image 2を無料・登録不要で使う方法' },
    hero: { suffix: 'AI 画像ジェネレーター', description: 'ToolazeでGPT Image 2を無料、登録不要でオンライン利用できます。4K画像、商品ポスター、SNS広告、UIモックアップ、編集済みの商品ビジュアル、文字の多い商用グラフィックをブラウザ上で作成できます。' },
    whatIs: { title: 'GPT Image 2とは？', paragraphs: ['GPT Image 2は、テキストプロンプトと参照画像からビジュアルを作成、編集するOpenAIの画像モデルです。読みやすい文字、構造化レイアウト、現実的な商品演出、明確なプロンプト反映、実用的な画像編集が必要な場面に向いています。', 'Toolazeでは、GPT Image 2をクリエイター、マーケター、デザイナー、EC販売者、プロダクトチーム、教育者向けの無料オンラインAI画像ジェネレーターとして提供しています。', 'GPT Image 2の価値は、魅力的な画像を作るだけではありません。画像内の短い読みやすいテキスト、商用レイアウト、参照画像に基づく編集、レビューしやすいバリエーション作成にあります。'] },
    features: { title: 'GPT Image 2の主な機能', text: '各機能は、読みやすい文字、4Kドラフト、商品編集、構造化レイアウト、キャンペーン向けビジュアルなど実際の制作タスクに対応します。' },
    gallery: { title: 'GPT Image 2の作例ギャラリー', text: '8つの例で、広告、EC、UIデザイン、SNSコンテンツ、教育、文字の多いブランディング、画像編集、高解像度キャンペーンでの使い方を示します。' },
    audiences: { title: 'GPT Image 2は誰に向いている？', text: 'GPT Image 2は、単発の実験ではなく実用的なビジュアルを必要とするチームに向いています。' },
    comparison: { title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux', text: 'AI画像モデルは話題性ではなく、作りたいものに合わせて選ぶべきです。', capabilityHeader: '機能' },
    howTo: { title: 'ToolazeでGPT Image 2を無料・登録不要で使う方法', steps: ['ToolazeのGPT Image 2ページを開きます。', '登録不要の無料アクセスで開始します。', '明確なプロンプトを入力するか、参照画像をアップロードします。', '生成後、文字や細部を確認し、プロンプトや参照画像を調整します。'] },
    prompts: { title: 'GPT Image 2のベストプロンプト例', text: '多言語タイポグラフィ、印刷制約、キャラクター一貫性、連続ストーリー、参照編集、編集レイアウトなどの強みを扱います。', copyButton: 'コピー', copiedButton: 'コピー済み' },
    youtube: { title: 'YouTubeのGPT Image 2動画', text: 'YouTube動画は、ワークフロー、プロンプトテスト、Creatorによる解説を理解するのに役立ちます。', watch: 'YouTubeで見る' },
    reddit: { title: 'RedditのGPT Image 2ディスカッション', text: 'Redditでは実用的な質問、比較、初期ユーザーの反応を確認できます。', communityDiscussion: 'コミュニティの議論', openDiscussion: 'Redditで開く' },
    x: { title: 'XのGPT Image 2作例', text: 'XのCreatorは、レイアウト、画像スタイル、モデルの限界を確認できる具体的な出力例を公開しています。', verified: '認証済み', follow: 'フォロー', watch: 'Xで見る', likes: 'いいね', reply: '返信', copyLink: 'リンクをコピー', read: '読む', replies: '件の返信', monthYear: '2026年6月' },
    related: { title: '他のAIモデルとツールを探す', text: '文字の多い画像、画像編集、構造化レイアウト、商用ビジュアルにはGPT Image 2を使います。', tryNow: '試す' },
    faq: {
      title: 'GPT Image 2に関するFAQ',
      items: [
        { q: 'GPT Image 2とは何ですか？', a: 'GPT Image 2は、テキストプロンプトや参照画像から画像を生成、編集するOpenAIの画像モデルです。' },
        { q: 'ToolazeでGPT Image 2は無料ですか？', a: 'はい。ToolazeではGPT Image 2を無料でオンライン試用できます。無料利用は日次上限、モデル availability、設定によって変わる場合があります。' },
        { q: '登録なしでGPT Image 2を使えますか？', a: 'はい。Toolazeでは登録やログインなしでGPT Image 2を試せます。' },
        { q: 'GPT Image 2は4K出力に対応していますか？', a: 'はい。選択したモード、比率、設定が対応している場合、4Kを含む高解像度ワークフローに対応します。' },
        { q: 'GPT Image 2で何を作れますか？', a: '商品ポスター、SNS広告、UIモックアップ、EC画像、教育用インフォグラフィック、ロゴ案、画像編集、キャンペーンビジュアルを作成できます。' },
        { q: 'GPT Image 2は画像編集できますか？', a: 'はい。GPT Image 2はテキスト入力と画像入力を使った画像編集に対応します。' },
        { q: 'GPT Image 2はNano Banana、Midjourney、Fluxより優れていますか？', a: '用途によります。GPT Image 2は文字の多い画像、構造化レイアウト、画像編集、商用ビジュアルに強い選択肢です。' },
        { q: 'GPT Image 2ではどんなプロンプトが有効ですか？', a: '良いプロンプトは、アセット種別、主題、正確な文字、構図、スタイル、光、背景、目的、制約を明確にします。' },
      ],
    },
    cta: { title: 'ToolazeでGPT Image 2を無料作成', text: '登録不要でGPT Image 2をオンライン利用し、4K画像、商品ポスター、SNS広告、UIモックアップ、文字の多い商用グラフィックをToolaze上で作成できます。', button: 'Toolazeで無料開始', label: '商用画像例を含むGPT Image 2 CTAビジュアル' },
    image: { container: '画像コンテナ' },
  },
  es: {
    metadata: { title: 'GPT Image 2 Generador de imágenes con IA | Gratis, sin registro', description: 'Usa GPT Image 2 online en Toolaze gratis y sin registro. Crea imágenes 4K, pósters de producto, anuncios sociales, mockups UI, ediciones y ejemplos de prompts.', openGraphDescription: 'Crea imágenes 4K, pósters de producto, anuncios en redes, mockups UI, ediciones y visuales comerciales con mucho texto usando GPT Image 2 en Toolaze.', twitterDescription: 'Prueba GPT Image 2 online en Toolaze gratis y sin registro.' },
    breadcrumbs: { home: 'Inicio', model: 'Modelo', current: 'GPT Image 2' },
    schema: { pageName: 'GPT Image 2 Generador de imágenes con IA', appName: 'GPT Image 2 Generador de imágenes con IA', howToName: 'Cómo usar GPT Image 2 gratis y sin registro en Toolaze' },
    hero: { suffix: 'Generador de imágenes con IA', description: 'Usa GPT Image 2 online en Toolaze gratis y sin registro. Crea imágenes 4K, pósters de producto, anuncios sociales, mockups UI, visuales de producto editados y gráficos comerciales con texto directamente en tu navegador.' },
    whatIs: { title: '¿Qué es GPT Image 2?', paragraphs: ['GPT Image 2 es el modelo de OpenAI para generar y editar imágenes desde prompts de texto e imágenes de referencia. Es útil cuando una imagen necesita texto legible, estructura, presentación de producto, buen seguimiento del prompt y edición práctica.', 'En Toolaze, GPT Image 2 funciona como un generador de imágenes con IA gratuito para creadores, marketers, diseñadores, vendedores e-commerce, equipos de producto y educadores.', 'Su valor principal está en el trabajo visual práctico: texto corto legible dentro de la imagen, layouts comerciales, ediciones guiadas por referencia y variaciones fáciles de revisar y publicar.'] },
    features: { title: 'Funciones clave de GPT Image 2', text: 'Cada función responde a una tarea real: texto legible, borradores 4K, edición de producto, layouts estructurados y exploración visual para campañas.' },
    gallery: { title: 'Galería de ejemplos para GPT Image 2', text: 'Estos ocho ejemplos muestran usos en publicidad, e-commerce, UI, contenido social, educación, branding con texto, edición de imagen y campañas de alta resolución.' },
    audiences: { title: '¿Quién debería usar GPT Image 2?', text: 'GPT Image 2 sirve para equipos que necesitan visuales prácticos, no solo experimentos aislados.' },
    comparison: { title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux', text: 'Elige el modelo según la tarea, no según la promesa más llamativa.', capabilityHeader: 'Capacidad' },
    howTo: { title: 'Cómo usar GPT Image 2 gratis y sin registro en Toolaze', steps: ['Abre la página de GPT Image 2 en Toolaze.', 'Comienza con acceso gratuito sin registro.', 'Introduce un prompt claro o sube una imagen de referencia.', 'Genera, revisa texto y detalles, y ajusta el prompt o las referencias.'] },
    prompts: { title: 'Mejores ejemplos de prompts para GPT Image 2', text: 'Estos ejemplos cubren tipografía multilingüe, restricciones de impresión, consistencia de personajes, storyboard, edición con referencia y layouts editoriales.', copyButton: 'Copiar', copiedButton: 'Copiado' },
    youtube: { title: 'Vídeos de GPT Image 2 en YouTube', text: 'Los vídeos ayudan a comparar flujos de trabajo, ver pruebas de prompts y entender cómo los creadores explican GPT Image 2.', watch: 'Ver en YouTube' },
    reddit: { title: 'Debates de GPT Image 2 en Reddit', text: 'Reddit aporta preguntas prácticas, comparaciones y primeras reacciones de usuarios.', communityDiscussion: 'Debate de la comunidad', openDiscussion: 'Abrir debate en Reddit' },
    x: { title: 'Ejemplos de GPT Image 2 en X', text: 'Los creadores en X publican pruebas concretas de layouts, estilos de imagen y límites del modelo.', verified: 'Verificado', follow: 'Seguir', watch: 'Ver en X', likes: 'Me gusta', reply: 'Responder', copyLink: 'Copiar enlace', read: 'Leer', replies: 'respuestas', monthYear: 'jun 2026' },
    related: { title: 'Explora más modelos y herramientas de IA', text: 'Usa GPT Image 2 para imágenes con texto, edición, layouts estructurados y visuales comerciales.', tryNow: 'Probar ahora' },
    faq: {
      title: 'Preguntas frecuentes sobre GPT Image 2',
      items: [
        { q: '¿Qué es GPT Image 2?', a: 'GPT Image 2 es el modelo de OpenAI para generar y editar imágenes desde prompts de texto e imágenes de referencia.' },
        { q: '¿GPT Image 2 es gratis en Toolaze?', a: 'Sí. Toolaze permite probar GPT Image 2 gratis online. El uso gratuito puede depender de cuota diaria, disponibilidad del modelo y ajustes.' },
        { q: '¿Puedo usar GPT Image 2 sin registro?', a: 'Sí. Puedes probar GPT Image 2 en Toolaze sin registrarte ni iniciar sesión.' },
        { q: '¿GPT Image 2 admite salida 4K?', a: 'Sí. GPT Image 2 admite flujos de alta resolución, incluido 4K cuando el modo, la proporción y los ajustes lo permiten.' },
        { q: '¿Qué puedo crear con GPT Image 2?', a: 'Puedes crear pósters de producto, anuncios sociales, mockups UI, imágenes e-commerce, infografías, conceptos de logo, ediciones y visuales de campaña.' },
        { q: '¿GPT Image 2 puede editar imágenes?', a: 'Sí. GPT Image 2 admite edición de imágenes a partir de texto e imágenes de entrada.' },
        { q: '¿GPT Image 2 es mejor que Nano Banana, Midjourney o Flux?', a: 'Depende de la tarea. GPT Image 2 es fuerte para imágenes con texto, layouts estructurados, edición y visuales comerciales.' },
        { q: '¿Qué prompts funcionan mejor con GPT Image 2?', a: 'Los mejores prompts describen tipo de recurso, sujeto, texto exacto, composición, estilo, iluminación, fondo, objetivo y restricciones.' },
      ],
    },
    cta: { title: 'Crea gratis con GPT Image 2 en Toolaze', text: 'Prueba GPT Image 2 online sin registro y crea imágenes 4K, pósters de producto, anuncios sociales, mockups UI y gráficos comerciales con texto directamente en Toolaze.', button: 'Empezar gratis en Toolaze', label: 'Visual CTA de GPT Image 2 con ejemplos comerciales' },
    image: { container: 'Contenedor de imagen' },
  },
  'zh-TW': {
    metadata: { title: 'GPT Image 2 AI 圖像生成器 | 免費，免註冊', description: '在 Toolaze 免費線上使用 GPT Image 2，免註冊。建立 4K 圖像、產品海報、社群廣告、UI mockup、圖片編輯與提示詞範例。', openGraphDescription: '在 Toolaze 使用 GPT Image 2 建立 4K 圖像、產品海報、社群廣告、UI mockup、圖片編輯與文字密集的商用視覺。', twitterDescription: '在 Toolaze 免費試用 GPT Image 2，免註冊免登入。' },
    breadcrumbs: { home: '首頁', model: '模型', current: 'GPT Image 2' },
    schema: { pageName: 'GPT Image 2 AI 圖像生成器', appName: 'GPT Image 2 AI 圖像生成器', howToName: '如何在 Toolaze 免費免註冊使用 GPT Image 2' },
    hero: { suffix: 'AI 圖像生成器', description: '在 Toolaze 免費線上使用 GPT Image 2，免註冊免登入。直接在瀏覽器中建立 4K 圖像、產品海報、社群廣告、UI mockup、編輯後的產品視覺與文字密集的商用圖形。' },
    whatIs: { title: '什麼是 GPT Image 2？', paragraphs: ['GPT Image 2 是 OpenAI 的圖像生成與編輯模型，可從文字提示詞和參考圖片建立視覺內容。當圖像需要可讀文字、結構化版面、真實產品陳列、清楚遵循提示詞和實用編輯時特別有用。', '在 Toolaze 上，GPT Image 2 是面向創作者、行銷人、設計師、電商賣家、產品團隊和教育者的免費線上 AI 圖像生成器。', 'GPT Image 2 的主要價值在於實用視覺工作：圖中短且可讀的文字、商用版面、參考圖編輯，以及更容易審核、修改和發布的變體。'] },
    features: { title: 'GPT Image 2 主要功能', text: '每個功能都對應真實圖像任務：可讀文字、4K 草稿、產品編輯、結構化版面與活動視覺探索。' },
    gallery: { title: 'GPT Image 2 範例圖庫', text: '這 8 個範例展示 GPT Image 2 在廣告、電商、UI 設計、社群內容、教育、文字品牌視覺、圖片編輯與高解析活動中的用途。' },
    audiences: { title: '誰適合使用 GPT Image 2？', text: 'GPT Image 2 適合需要實用視覺素材，而不只是單次實驗的團隊。' },
    comparison: { title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux', text: '選 AI 圖像模型應看任務，而不是最響亮的宣傳。', capabilityHeader: '能力' },
    howTo: { title: '如何在 Toolaze 免費免註冊使用 GPT Image 2', steps: ['開啟 Toolaze 的 GPT Image 2 頁面。', '使用免費免註冊存取開始。', '輸入清楚的提示詞，或在需要圖生圖時上傳參考圖。', '生成後檢查文字和視覺細節，再調整提示詞或參考圖。'] },
    prompts: { title: '最佳 GPT Image 2 提示詞範例', text: '這些範例聚焦多語言排版、印刷限制、角色一致性、連續分鏡、參考圖編輯與編輯版面。', copyButton: '複製', copiedButton: '已複製' },
    youtube: { title: 'YouTube 上的 GPT Image 2 影片', text: 'YouTube 影片適合用來觀看工作流程、提示詞測試，以及創作者如何解釋 GPT Image 2。', watch: '在 YouTube 觀看' },
    reddit: { title: 'Reddit 上的 GPT Image 2 討論', text: 'Reddit 討論可用來閱讀實際問題、比較疑慮與早期使用者反應。', communityDiscussion: '社群討論', openDiscussion: '開啟 Reddit 討論' },
    x: { title: 'X 上的 GPT Image 2 範例', text: 'X 上的創作者常發布具體輸出測試，可觀察版面、圖片風格與模型壓力測試。', verified: '已驗證', follow: '追蹤', watch: '在 X 查看', likes: '喜歡', reply: '回覆', copyLink: '複製連結', read: '閱讀', replies: '則回覆', monthYear: '2026 年 6 月' },
    related: { title: '探索更多 AI 模型和工具', text: '當你需要文字密集圖像、圖片編輯、結構化版面和商用視覺時，優先使用 GPT Image 2。', tryNow: '立即試用' },
    faq: {
      title: 'GPT Image 2 常見問題',
      items: [
        { q: '什麼是 GPT Image 2？', a: 'GPT Image 2 是 OpenAI 的圖像生成與編輯模型，可從文字提示詞和參考圖片建立圖像。' },
        { q: 'Toolaze 上的 GPT Image 2 免費嗎？', a: '是。Toolaze 可讓你免費線上試用 GPT Image 2。免費使用可能受每日額度、模型可用性和輸出設定影響。' },
        { q: '我可以免註冊使用 GPT Image 2 嗎？', a: '可以。你可以在 Toolaze 免註冊、免登入試用 GPT Image 2。' },
        { q: 'GPT Image 2 支援 4K 輸出嗎？', a: '支援。當所選模式、比例和設定支援時，GPT Image 2 可用於包含 4K 的高解析圖像工作流程。' },
        { q: '我可以用 GPT Image 2 建立什麼？', a: '你可以建立產品海報、社群廣告、UI mockup、電商圖片、教育資訊圖、文字 Logo 概念、圖片編輯和活動視覺。' },
        { q: 'GPT Image 2 可以編輯圖片嗎？', a: '可以。GPT Image 2 支援從文字與圖片輸入進行圖片編輯。' },
        { q: 'GPT Image 2 比 Nano Banana、Midjourney 或 Flux 更好嗎？', a: '取決於任務。GPT Image 2 在文字密集圖像、結構化版面、圖片編輯和商用視覺上很有優勢。' },
        { q: 'GPT Image 2 適合什麼提示詞？', a: '好的提示詞會說明素材類型、主體、精確文字、構圖、風格、光線、背景、用途和限制。' },
      ],
    },
    cta: { title: '在 Toolaze 免費使用 GPT Image 2 創作', text: '免註冊線上試用 GPT Image 2，直接在 Toolaze 建立 4K 圖像、產品海報、社群廣告、UI mockup 和文字密集商用圖形。', button: '在 Toolaze 免費開始', label: '含商用圖像範例的 GPT Image 2 CTA 視覺' },
    image: { container: '圖片容器' },
  },
  pt: {
    metadata: { title: 'GPT Image 2 Gerador de imagens com IA | Grátis, sem cadastro', description: 'Use o GPT Image 2 online no Toolaze grátis e sem cadastro. Crie imagens 4K, pôsteres de produto, anúncios sociais, mockups UI, edições e exemplos de prompts.', openGraphDescription: 'Crie imagens 4K, pôsteres de produto, anúncios sociais, mockups UI, edições de imagem e visuais comerciais com muito texto usando GPT Image 2 no Toolaze.', twitterDescription: 'Experimente o GPT Image 2 online no Toolaze grátis e sem cadastro.' },
    breadcrumbs: { home: 'Início', model: 'Modelo', current: 'GPT Image 2' },
    schema: { pageName: 'GPT Image 2 Gerador de imagens com IA', appName: 'GPT Image 2 Gerador de imagens com IA', howToName: 'Como usar o GPT Image 2 grátis e sem cadastro no Toolaze' },
    hero: { suffix: 'Gerador de imagens com IA', description: 'Use o GPT Image 2 online no Toolaze grátis e sem cadastro. Crie imagens 4K, pôsteres de produto, anúncios sociais, mockups UI, visuais de produto editados e gráficos comerciais com texto diretamente no navegador.' },
    whatIs: { title: 'O que é o GPT Image 2?', paragraphs: ['GPT Image 2 é o modelo da OpenAI para gerar e editar imagens a partir de prompts de texto e imagens de referência.', 'No Toolaze, ele funciona como um gerador de imagens com IA gratuito para criadores, marketing, designers, e-commerce, equipes de produto e educadores.', 'Seu maior valor está no trabalho visual prático: texto curto legível dentro da imagem, layouts comerciais, edições guiadas por referência e variações fáceis de revisar.'] },
    features: { title: 'Principais recursos do GPT Image 2', text: 'Cada recurso atende a uma tarefa real: texto legível, rascunhos 4K, edição de produto, layouts estruturados e visuais de campanha.' },
    gallery: { title: 'Galeria de exemplos do GPT Image 2', text: 'Estes oito exemplos mostram usos em publicidade, e-commerce, UI, conteúdo social, educação, branding com texto, edição de imagem e campanhas em alta resolução.' },
    audiences: { title: 'Quem deve usar o GPT Image 2?', text: 'GPT Image 2 é útil para equipes que precisam de visuais práticos, não apenas experimentos isolados.' },
    comparison: { title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux', text: 'Escolha o modelo pela tarefa, não pela promessa mais barulhenta.', capabilityHeader: 'Capacidade' },
    howTo: { title: 'Como usar o GPT Image 2 grátis e sem cadastro no Toolaze', steps: ['Abra a página do GPT Image 2 no Toolaze.', 'Comece com acesso gratuito sem cadastro.', 'Digite um prompt claro ou envie uma imagem de referência.', 'Gere, revise detalhes e refine o prompt ou as referências.'] },
    prompts: { title: 'Melhores exemplos de prompts para GPT Image 2', text: 'Os exemplos cobrem tipografia multilíngue, restrições de impressão, consistência de personagem, storyboard, edição com referência e layouts editoriais.', copyButton: 'Copiar', copiedButton: 'Copiado' },
    youtube: { title: 'Vídeos de GPT Image 2 no YouTube', text: 'Vídeos ajudam a comparar fluxos de trabalho, assistir testes de prompts e entender explicações de criadores.', watch: 'Ver no YouTube' },
    reddit: { title: 'Discussões sobre GPT Image 2 no Reddit', text: 'Discussões no Reddit trazem perguntas práticas, comparações e primeiras reações de usuários.', communityDiscussion: 'Discussão da comunidade', openDiscussion: 'Abrir discussão no Reddit' },
    x: { title: 'Exemplos de GPT Image 2 no X', text: 'Criadores no X publicam testes concretos de layout, estilo de imagem e limites do modelo.', verified: 'Verificado', follow: 'Seguir', watch: 'Ver no X', likes: 'curtidas', reply: 'Responder', copyLink: 'Copiar link', read: 'Ler', replies: 'respostas', monthYear: 'jun 2026' },
    related: { title: 'Explore mais modelos e ferramentas de IA', text: 'Use GPT Image 2 para imagens com texto, edição, layouts estruturados e visuais comerciais.', tryNow: 'Testar agora' },
    faq: {
      title: 'Perguntas frequentes sobre GPT Image 2',
      items: [
        { q: 'O que é o GPT Image 2?', a: 'GPT Image 2 é o modelo da OpenAI para gerar e editar imagens a partir de prompts de texto e imagens de referência.' },
        { q: 'O GPT Image 2 é gratuito no Toolaze?', a: 'Sim. O Toolaze permite testar o GPT Image 2 online gratuitamente. O uso grátis pode depender de cota diária, disponibilidade do modelo e configurações.' },
        { q: 'Posso usar o GPT Image 2 sem cadastro?', a: 'Sim. Você pode testar o GPT Image 2 no Toolaze sem cadastro ou login.' },
        { q: 'O GPT Image 2 suporta saída 4K?', a: 'Sim. GPT Image 2 suporta fluxos de alta resolução, incluindo 4K quando modo, proporção e configurações permitem.' },
        { q: 'O que posso criar com GPT Image 2?', a: 'Você pode criar pôsteres de produto, anúncios sociais, mockups UI, imagens e-commerce, infográficos, conceitos de logo, edições e visuais de campanha.' },
        { q: 'O GPT Image 2 pode editar imagens?', a: 'Sim. GPT Image 2 suporta edição de imagens a partir de texto e imagens de entrada.' },
        { q: 'GPT Image 2 é melhor que Nano Banana, Midjourney ou Flux?', a: 'Depende da tarefa. GPT Image 2 é forte para imagens com texto, layouts estruturados, edição e visuais comerciais.' },
        { q: 'Quais prompts funcionam melhor com GPT Image 2?', a: 'Bons prompts descrevem tipo de asset, assunto, texto exato, composição, estilo, iluminação, fundo, objetivo e restrições.' },
      ],
    },
    cta: { title: 'Crie com GPT Image 2 no Toolaze grátis', text: 'Experimente GPT Image 2 online sem cadastro e crie imagens 4K, pôsteres, anúncios sociais, mockups UI e gráficos comerciais com texto diretamente no Toolaze.', button: 'Começar grátis no Toolaze', label: 'Visual CTA do GPT Image 2 com exemplos comerciais' },
    image: { container: 'Contêiner de imagem' },
  },
  fr: {
    metadata: { title: "GPT Image 2 Générateur d'images IA | Gratuit, sans inscription", description: "Utilisez GPT Image 2 en ligne sur Toolaze gratuitement et sans inscription. Créez des images 4K, affiches produit, publicités sociales, maquettes UI, retouches et exemples de prompts.", openGraphDescription: "Créez des images 4K, affiches produit, publicités sociales, maquettes UI, retouches et visuels commerciaux riches en texte avec GPT Image 2 sur Toolaze.", twitterDescription: 'Essayez GPT Image 2 en ligne sur Toolaze gratuitement et sans inscription.' },
    breadcrumbs: { home: 'Accueil', model: 'Modèle', current: 'GPT Image 2' },
    schema: { pageName: "GPT Image 2 Générateur d'images IA", appName: "GPT Image 2 Générateur d'images IA", howToName: 'Comment utiliser GPT Image 2 gratuitement et sans inscription sur Toolaze' },
    hero: { suffix: "Générateur d'images IA", description: "Utilisez GPT Image 2 en ligne sur Toolaze gratuitement et sans inscription. Créez des images 4K, affiches produit, publicités sociales, maquettes UI, visuels produit retouchés et graphiques commerciaux riches en texte directement dans le navigateur." },
    whatIs: { title: "Qu'est-ce que GPT Image 2 ?", paragraphs: ["GPT Image 2 est le modèle d'OpenAI pour générer et éditer des images à partir de prompts texte et d'images de référence.", "Sur Toolaze, il sert de générateur d'images IA gratuit pour créateurs, marketing, designers, e-commerce, équipes produit et enseignants.", "Sa valeur principale tient au travail visuel concret : texte court lisible dans l'image, layouts commerciaux, retouches guidées par référence et variantes faciles à revoir."] },
    features: { title: 'Fonctionnalités clés de GPT Image 2', text: 'Chaque fonctionnalité correspond à une tâche réelle : texte lisible, brouillons 4K, retouche produit, layouts structurés et visuels de campagne.' },
    gallery: { title: "Galerie d'exemples GPT Image 2", text: "Ces huit exemples montrent des usages en publicité, e-commerce, UI, contenu social, éducation, branding textuel, retouche et campagnes haute résolution." },
    audiences: { title: 'Qui devrait utiliser GPT Image 2 ?', text: 'GPT Image 2 est utile aux équipes qui ont besoin de visuels pratiques, pas seulement de tests isolés.' },
    comparison: { title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux', text: "Choisissez le modèle selon la tâche, pas selon l'affirmation la plus bruyante.", capabilityHeader: 'Capacité' },
    howTo: { title: 'Comment utiliser GPT Image 2 gratuitement et sans inscription sur Toolaze', steps: ['Ouvrez la page GPT Image 2 sur Toolaze.', 'Commencez avec un accès gratuit sans inscription.', 'Saisissez un prompt clair ou importez une image de référence.', 'Générez, vérifiez les détails, puis affinez le prompt ou les références.'] },
    prompts: { title: 'Meilleurs exemples de prompts GPT Image 2', text: 'Ces exemples couvrent la typographie multilingue, les contraintes print, la cohérence de personnage, le storyboard, la retouche avec référence et les layouts éditoriaux.', copyButton: 'Copier', copiedButton: 'Copié' },
    youtube: { title: 'Vidéos GPT Image 2 sur YouTube', text: 'Les vidéos aident à comparer les workflows, voir des tests de prompts et comprendre les explications de créateurs.', watch: 'Voir sur YouTube' },
    reddit: { title: 'Discussions GPT Image 2 sur Reddit', text: 'Reddit apporte des questions pratiques, des comparaisons et les premières réactions des utilisateurs.', communityDiscussion: 'Discussion communautaire', openDiscussion: 'Ouvrir sur Reddit' },
    x: { title: 'Exemples GPT Image 2 sur X', text: 'Les créateurs sur X publient des tests concrets de layouts, styles et limites du modèle.', verified: 'Vérifié', follow: 'Suivre', watch: 'Voir sur X', likes: 'J’aime', reply: 'Répondre', copyLink: 'Copier le lien', read: 'Lire', replies: 'réponses', monthYear: 'juin 2026' },
    related: { title: "Explorer d'autres modèles et outils IA", text: 'Utilisez GPT Image 2 pour les images riches en texte, la retouche, les layouts structurés et les visuels commerciaux.', tryNow: 'Essayer' },
    faq: {
      title: 'FAQ sur GPT Image 2',
      items: [
        { q: "Qu'est-ce que GPT Image 2 ?", a: "GPT Image 2 est le modèle d'OpenAI pour générer et éditer des images à partir de prompts texte et d'images de référence." },
        { q: 'GPT Image 2 est-il gratuit sur Toolaze ?', a: "Oui. Toolaze permet d'essayer GPT Image 2 gratuitement en ligne. L'usage gratuit peut dépendre du quota quotidien, de la disponibilité du modèle et des réglages." },
        { q: 'Puis-je utiliser GPT Image 2 sans inscription ?', a: 'Oui. Vous pouvez essayer GPT Image 2 sur Toolaze sans inscription ni connexion.' },
        { q: 'GPT Image 2 prend-il en charge la sortie 4K ?', a: 'Oui. GPT Image 2 prend en charge les workflows haute résolution, y compris la 4K lorsque le mode, le ratio et les réglages le permettent.' },
        { q: 'Que puis-je créer avec GPT Image 2 ?', a: 'Vous pouvez créer des affiches produit, publicités sociales, maquettes UI, images e-commerce, infographies, concepts de logo, retouches et visuels de campagne.' },
        { q: 'GPT Image 2 peut-il éditer des images ?', a: "Oui. GPT Image 2 prend en charge l'édition d'images à partir de texte et d'images d'entrée." },
        { q: 'GPT Image 2 est-il meilleur que Nano Banana, Midjourney ou Flux ?', a: 'Cela dépend de la tâche. GPT Image 2 est fort pour les images riches en texte, les layouts structurés, la retouche et les visuels commerciaux.' },
        { q: 'Quels prompts fonctionnent le mieux avec GPT Image 2 ?', a: 'Les bons prompts décrivent le type de ressource, le sujet, le texte exact, la composition, le style, la lumière, le fond, le but et les contraintes.' },
      ],
    },
    cta: { title: 'Créer gratuitement avec GPT Image 2 sur Toolaze', text: 'Essayez GPT Image 2 en ligne sans inscription et créez des images 4K, affiches produit, publicités sociales, maquettes UI et graphiques commerciaux riches en texte directement sur Toolaze.', button: 'Commencer gratuitement', label: 'Visuel CTA GPT Image 2 avec exemples commerciaux' },
    image: { container: "Conteneur d'image" },
  },
  ko: {
    metadata: { title: 'GPT Image 2 AI 이미지 생성기 | 무료, 가입 없음', description: 'Toolaze에서 GPT Image 2를 무료로, 가입 없이 사용하세요. 4K 이미지, 제품 포스터, 소셜 광고, UI 목업, 이미지 편집과 프롬프트 예시를 만들 수 있습니다.', openGraphDescription: 'Toolaze의 GPT Image 2로 4K 이미지, 제품 포스터, 소셜 광고, UI 목업, 이미지 편집, 텍스트가 많은 상업용 비주얼을 만드세요.', twitterDescription: 'Toolaze에서 GPT Image 2를 무료로, 가입 없이 사용해 보세요.' },
    breadcrumbs: { home: '홈', model: '모델', current: 'GPT Image 2' },
    schema: { pageName: 'GPT Image 2 AI 이미지 생성기', appName: 'GPT Image 2 AI 이미지 생성기', howToName: 'Toolaze에서 GPT Image 2를 무료로 가입 없이 사용하는 방법' },
    hero: { suffix: 'AI 이미지 생성기', description: 'Toolaze에서 GPT Image 2를 무료로, 가입이나 로그인 없이 온라인으로 사용하세요. 브라우저에서 바로 4K 이미지, 제품 포스터, 소셜 광고, UI 목업, 편집된 제품 비주얼과 텍스트가 많은 상업용 그래픽을 만들 수 있습니다.' },
    whatIs: { title: 'GPT Image 2란?', paragraphs: ['GPT Image 2는 텍스트 프롬프트와 참조 이미지로 이미지를 생성하고 편집하는 OpenAI의 이미지 모델입니다.', 'Toolaze에서는 크리에이터, 마케터, 디자이너, 이커머스 판매자, 제품팀, 교육자를 위한 무료 온라인 AI 이미지 생성기로 제공됩니다.', '핵심 가치는 실용적인 시각 작업입니다. 이미지 안의 짧고 읽기 쉬운 텍스트, 상업용 레이아웃, 참조 기반 편집, 검토하기 쉬운 변형을 만들 수 있습니다.'] },
    features: { title: 'GPT Image 2 주요 기능', text: '각 기능은 읽기 쉬운 텍스트, 4K 초안, 제품 편집, 구조화된 레이아웃, 캠페인 비주얼 같은 실제 작업과 연결됩니다.' },
    gallery: { title: 'GPT Image 2 예시 갤러리', text: '8개의 예시는 광고, 이커머스, UI 디자인, 소셜 콘텐츠, 교육, 텍스트 중심 브랜딩, 이미지 편집, 고해상도 캠페인 활용을 보여줍니다.' },
    audiences: { title: '누가 GPT Image 2를 사용하면 좋을까요?', text: 'GPT Image 2는 단발성 실험보다 실용적인 비주얼이 필요한 팀에 적합합니다.' },
    comparison: { title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux', text: 'AI 이미지 모델은 가장 큰 홍보 문구가 아니라 작업 목적에 맞춰 선택하세요.', capabilityHeader: '기능' },
    howTo: { title: 'Toolaze에서 GPT Image 2를 무료로 가입 없이 사용하는 방법', steps: ['Toolaze의 GPT Image 2 페이지를 엽니다.', '무료, 가입 없는 접근으로 시작합니다.', '명확한 프롬프트를 입력하거나 참조 이미지를 업로드합니다.', '생성 후 철자와 세부사항을 확인하고 프롬프트나 참조 이미지를 다듬습니다.'] },
    prompts: { title: 'GPT Image 2 베스트 프롬프트 예시', text: '다국어 타이포그래피, 인쇄 제약, 캐릭터 일관성, 스토리보드, 참조 편집, 에디토리얼 레이아웃을 다룹니다.', copyButton: '복사', copiedButton: '복사됨' },
    youtube: { title: 'YouTube의 GPT Image 2 영상', text: '영상은 워크플로, 프롬프트 테스트, 크리에이터 설명을 이해하는 데 도움이 됩니다.', watch: 'YouTube에서 보기' },
    reddit: { title: 'Reddit의 GPT Image 2 토론', text: 'Reddit 토론은 실제 질문, 비교 의견, 초기 사용자 반응을 보는 데 유용합니다.', communityDiscussion: '커뮤니티 토론', openDiscussion: 'Reddit 토론 열기' },
    x: { title: 'X의 GPT Image 2 예시', text: 'X의 크리에이터들은 레이아웃, 이미지 스타일, 모델 한계를 확인할 수 있는 실제 출력 테스트를 게시합니다.', verified: '인증됨', follow: '팔로우', watch: 'X에서 보기', likes: '좋아요', reply: '답글', copyLink: '링크 복사', read: '읽기', replies: '개의 답글', monthYear: '2026년 6월' },
    related: { title: '더 많은 AI 모델과 도구 탐색', text: '텍스트가 많은 이미지, 이미지 편집, 구조화된 레이아웃, 상업용 비주얼에는 GPT Image 2를 사용하세요.', tryNow: '지금 사용' },
    faq: {
      title: 'GPT Image 2 FAQ',
      items: [
        { q: 'GPT Image 2란 무엇인가요?', a: 'GPT Image 2는 텍스트 프롬프트와 참조 이미지로 이미지를 생성하고 편집하는 OpenAI의 이미지 모델입니다.' },
        { q: 'Toolaze에서 GPT Image 2는 무료인가요?', a: '네. Toolaze에서 GPT Image 2를 무료로 온라인 사용해 볼 수 있습니다. 무료 사용은 일일 한도, 모델 사용 가능 여부, 설정에 따라 달라질 수 있습니다.' },
        { q: '가입 없이 GPT Image 2를 사용할 수 있나요?', a: '네. Toolaze에서 가입이나 로그인 없이 GPT Image 2를 사용해 볼 수 있습니다.' },
        { q: 'GPT Image 2는 4K 출력을 지원하나요?', a: '네. 선택한 모드, 비율, 설정이 지원하는 경우 4K를 포함한 고해상도 워크플로를 지원합니다.' },
        { q: 'GPT Image 2로 무엇을 만들 수 있나요?', a: '제품 포스터, 소셜 광고, UI 목업, 이커머스 이미지, 교육용 인포그래픽, 로고 콘셉트, 이미지 편집, 캠페인 비주얼을 만들 수 있습니다.' },
        { q: 'GPT Image 2는 이미지를 편집할 수 있나요?', a: '네. GPT Image 2는 텍스트와 이미지 입력을 사용한 이미지 편집을 지원합니다.' },
        { q: 'GPT Image 2가 Nano Banana, Midjourney, Flux보다 좋은가요?', a: '작업에 따라 다릅니다. GPT Image 2는 텍스트가 많은 이미지, 구조화된 레이아웃, 이미지 편집, 상업용 비주얼에 강합니다.' },
        { q: 'GPT Image 2에 가장 잘 맞는 프롬프트는 무엇인가요?', a: '좋은 프롬프트는 asset 종류, 주제, 정확한 텍스트, 구성, 스타일, 조명, 배경, 목적, 제한 조건을 명확히 설명합니다.' },
      ],
    },
    cta: { title: 'Toolaze에서 GPT Image 2로 무료 제작', text: '가입 없이 GPT Image 2를 온라인으로 사용하고 4K 이미지, 제품 포스터, 소셜 광고, UI 목업과 텍스트 중심 상업용 그래픽을 Toolaze에서 바로 만드세요.', button: 'Toolaze에서 무료 시작', label: '상업용 이미지 예시가 있는 GPT Image 2 CTA 비주얼' },
    image: { container: '이미지 컨테이너' },
  },
  it: {
    metadata: { title: 'GPT Image 2 Generatore di immagini AI | Gratis, senza registrazione', description: 'Usa GPT Image 2 online su Toolaze gratis e senza registrazione. Crea immagini 4K, poster prodotto, annunci social, mockup UI, modifiche ed esempi di prompt.', openGraphDescription: 'Crea immagini 4K, poster prodotto, annunci social, mockup UI, modifiche immagine e visual commerciali ricchi di testo con GPT Image 2 su Toolaze.', twitterDescription: 'Prova GPT Image 2 online su Toolaze gratis e senza registrazione.' },
    breadcrumbs: { home: 'Home', model: 'Modello', current: 'GPT Image 2' },
    schema: { pageName: 'GPT Image 2 Generatore di immagini AI', appName: 'GPT Image 2 Generatore di immagini AI', howToName: 'Come usare GPT Image 2 gratis e senza registrazione su Toolaze' },
    hero: { suffix: 'Generatore di immagini AI', description: 'Usa GPT Image 2 online su Toolaze gratis e senza registrazione. Crea immagini 4K, poster prodotto, annunci social, mockup UI, visual prodotto modificati e grafiche commerciali ricche di testo direttamente nel browser.' },
    whatIs: { title: "Cos'è GPT Image 2?", paragraphs: ['GPT Image 2 è il modello di OpenAI per generare e modificare immagini da prompt testuali e immagini di riferimento.', 'Su Toolaze è un generatore di immagini AI gratuito per creator, marketer, designer, venditori e-commerce, team prodotto ed educatori.', 'Il suo valore principale è nel lavoro visivo pratico: testo breve leggibile nelle immagini, layout commerciali, modifiche guidate da riferimento e varianti facili da rivedere.'] },
    features: { title: 'Funzioni principali di GPT Image 2', text: 'Ogni funzione corrisponde a un lavoro reale: testo leggibile, bozze 4K, editing prodotto, layout strutturati e visual per campagne.' },
    gallery: { title: 'Galleria esempi per GPT Image 2', text: 'Questi otto esempi mostrano usi in advertising, e-commerce, UI, social content, education, branding testuale, editing immagini e campagne ad alta risoluzione.' },
    audiences: { title: 'Chi dovrebbe usare GPT Image 2?', text: 'GPT Image 2 è utile per team che hanno bisogno di visual pratici, non solo di esperimenti isolati.' },
    comparison: { title: 'GPT Image 2 vs Nano Banana vs Midjourney vs Flux', text: 'Scegli il modello in base al lavoro, non alla promessa più rumorosa.', capabilityHeader: 'Capacità' },
    howTo: { title: 'Come usare GPT Image 2 gratis e senza registrazione su Toolaze', steps: ['Apri la pagina GPT Image 2 su Toolaze.', 'Inizia con accesso gratuito senza registrazione.', 'Inserisci un prompt chiaro o carica un’immagine di riferimento.', 'Genera, controlla dettagli e testo, poi affina prompt o riferimenti.'] },
    prompts: { title: 'Migliori esempi di prompt per GPT Image 2', text: 'Gli esempi coprono tipografia multilingue, vincoli di stampa, coerenza del personaggio, storyboard, editing con riferimento e layout editoriali.', copyButton: 'Copia', copiedButton: 'Copiato' },
    youtube: { title: 'Video GPT Image 2 su YouTube', text: 'I video aiutano a confrontare workflow, vedere test di prompt e capire le spiegazioni dei creator.', watch: 'Guarda su YouTube' },
    reddit: { title: 'Discussioni GPT Image 2 su Reddit', text: 'Le discussioni su Reddit offrono domande pratiche, confronti e prime reazioni degli utenti.', communityDiscussion: 'Discussione community', openDiscussion: 'Apri discussione su Reddit' },
    x: { title: 'Esempi GPT Image 2 su X', text: 'I creator su X pubblicano test concreti su layout, stili immagine e limiti del modello.', verified: 'Verificato', follow: 'Segui', watch: 'Guarda su X', likes: 'Mi piace', reply: 'Rispondi', copyLink: 'Copia link', read: 'Leggi', replies: 'risposte', monthYear: 'giu 2026' },
    related: { title: 'Esplora altri modelli e strumenti AI', text: 'Usa GPT Image 2 per immagini ricche di testo, editing, layout strutturati e visual commerciali.', tryNow: 'Prova ora' },
    faq: {
      title: 'FAQ su GPT Image 2',
      items: [
        { q: "Cos'è GPT Image 2?", a: 'GPT Image 2 è il modello di OpenAI per generare e modificare immagini da prompt testuali e immagini di riferimento.' },
        { q: 'GPT Image 2 è gratis su Toolaze?', a: 'Sì. Toolaze consente di provare GPT Image 2 online gratuitamente. L’uso gratuito può dipendere da quota giornaliera, disponibilità del modello e impostazioni.' },
        { q: 'Posso usare GPT Image 2 senza registrazione?', a: 'Sì. Puoi provare GPT Image 2 su Toolaze senza registrazione o login.' },
        { q: 'GPT Image 2 supporta output 4K?', a: 'Sì. GPT Image 2 supporta workflow ad alta risoluzione, incluso 4K quando modalità, rapporto e impostazioni lo consentono.' },
        { q: 'Cosa posso creare con GPT Image 2?', a: 'Puoi creare poster prodotto, annunci social, mockup UI, immagini e-commerce, infografiche, concept logo, modifiche immagine e visual di campagna.' },
        { q: 'GPT Image 2 può modificare immagini?', a: 'Sì. GPT Image 2 supporta editing di immagini da input testuali e immagini.' },
        { q: 'GPT Image 2 è migliore di Nano Banana, Midjourney o Flux?', a: 'Dipende dal compito. GPT Image 2 è forte per immagini ricche di testo, layout strutturati, editing e visual commerciali.' },
        { q: 'Quali prompt funzionano meglio con GPT Image 2?', a: 'I prompt migliori descrivono tipo di asset, soggetto, testo esatto, composizione, stile, luce, sfondo, scopo e vincoli.' },
      ],
    },
    cta: { title: 'Crea gratis con GPT Image 2 su Toolaze', text: 'Prova GPT Image 2 online senza registrazione e crea immagini 4K, poster prodotto, annunci social, mockup UI e grafiche commerciali ricche di testo direttamente su Toolaze.', button: 'Inizia gratis su Toolaze', label: 'Visual CTA GPT Image 2 con esempi commerciali' },
    image: { container: 'Contenitore immagine' },
  },
}

const localizedArrayOverrides: Record<Exclude<GptImage2Locale, 'en'>, DeepPartial<GptImage2LandingCopy>> = {
  de: {
    gallery: {
      examples: [
        { slot: 'gallery-product-poster', title: 'Produktposter zum Launch', text: 'Erstellen Sie ein klares Produktposter fuer Flaschen, Pflegeprodukte, Kaffee, Snacks oder Softwarefeatures mit lesbarer Headline und starkem Produktfokus.' },
        { slot: 'gallery-social-ad', title: 'Social-Media-Anzeige', text: 'Entwerfen Sie eine auffaellige Social Ad mit kurzem Text, klarem Nutzenversprechen, creatorfreundlicher Komposition und sicheren fiktiven Personen oder Objekten.' },
        { slot: 'gallery-ui-mockup', title: 'UI-Mockup-Konzept', text: 'Generieren Sie Dashboard-, Analytics-, Onboarding- oder Feature-Overview-Bilder mit lesbaren Labels und strukturierter Navigation.' },
        { slot: 'gallery-ecommerce', title: 'E-Commerce-Produktbild', text: 'Nutzen Sie eine Produktreferenz, um sauberere Marketplace-Bilder, saisonale Hintergruende, Lifestyle-Setups oder Bundle-Visuals zu erstellen.' },
        { slot: 'gallery-education', title: 'Bildungsinfografik', text: 'Erstellen Sie Unterrichtsvisuals, Wissenschaftsdiagramme, historische Erklaerungen, Prozessgrafiken oder Lernkarten mit klaren Abschnittslabels.' },
        { slot: 'gallery-text-logo', title: 'Textlogo-Konzept', text: 'Entwickeln Sie fruehe Logoideen, Badge-Layouts, Eventtitel, Stickerdesigns und Packaging-Wortmarken mit kurzem lesbarem Text.' },
        { slot: 'gallery-reference-edit', title: 'Bearbeitung mit Referenz', text: 'Laden Sie ein Referenzbild hoch und lassen Sie GPT Image 2 das Hauptmotiv erhalten, waehrend Hintergrund, Licht, Stil oder Layout geaendert werden.' },
        { slot: 'gallery-high-resolution', title: 'Hochaufloesendes Kampagnenvisual', text: 'Erstellen Sie ein ausgearbeitetes Kampagnenbild fuer Poster, Banner, Produktlaunches und grosse Kreativentwuerfe, wenn 4K-Ausgabe gebraucht wird.' },
      ],
    },
    audiences: {
      items: [
        'Marketingteams: Erstellen Sie Produktposter, Paid-Social-Konzepte, Kampagnenvarianten, Launch-Visuals und Thumbnail-Ideen fuer schnelle Kreativtests.',
        'Designer: Erkunden Sie Moodboards, UI-Screens, Layoutsysteme, Typografie-Richtungen und visuelle Konzepte vor der Arbeit in Produktionstools.',
        'E-Commerce-Anbieter: Erstellen Sie Produktvarianten, saisonale Hintergruende, Listing-Visuals, Bundle-Bilder und Werbebanner fuer Online-Shops.',
        'Content Creator: Erstellen Sie Thumbnails, Lern grafiken, Social Posts, Creator-Visuals und Markenbilder mit klarerer Textfuehrung.',
        'Produktmanager: Skizzieren Sie Feature-Screens, interne Planungsboards, App-Konzepte und Produktstorytelling-Visuals fuer fruehe Validierung.',
        'Lehrkraefte: Erstellen Sie Diagramme, Unterrichtsbilder, Concept Maps, Erklaervisuals und einfache Infografiken fuer Lernmaterial.',
      ],
    },
    comparison: {
      rows: [
        { capability: 'Am besten fuer', gpt: 'Textreiche kommerzielle Visuals, Bildbearbeitung, UI-Mockups, strukturierte Layouts', nano: 'Schnelle Bildgenerierung, Referenzbearbeitung, Gemini-aehnliche Kreativworkflows', midjourney: 'Stilisierte Art Direction, cineastische Visuals, aesthetische Exploration', flux: 'Fotorealistische Bilder, offene Workflows, Multi-Referenz-Kontrolle' },
        { capability: 'Textdarstellung', gpt: 'Stark bei kurzem lesbarem Text, Labels, Postern und UI-artigen Visuals', nano: 'Stark in neueren Gemini-Bildworkflows und textlastigen Designs', midjourney: 'Verbessert, aber weiterhin sorgfaeltig zu pruefen', flux: 'Stark bei Typografie- und Layout-Anwendungen' },
        { capability: 'Bildbearbeitung', gpt: 'Nuetzlich fuer natuerlichsprachliche Edits und referenzgefuehrte Aenderungen', nano: 'Nuetzlich fuer schnelle Iteration und Image-to-Image-Varianten', midjourney: 'Editor-Workflows sind verfuegbar, aber fuer manche Nutzer weniger direkt', flux: 'Stark bei textgesteuerter Bearbeitung und Referenzkontrolle' },
        { capability: 'Layoutkontrolle', gpt: 'Stark fuer Dashboards, Poster, Infografiken und Multi-Panel-Konzepte', nano: 'Gut fuer strukturierte Generierung und kommerzielle Konzepte', midjourney: 'Besser fuer visuellen Stil als fuer strenge Layouts', flux: 'Stark fuer produktionsnahe Visuals und kontrollierte Kompositionen' },
        { capability: '4K-Ausgabe', gpt: 'Unterstuetzt hochaufloesende Workflows einschliesslich 4K, wenn die Einstellungen es erlauben', nano: 'Starke High-Resolution-Positionierung in aktuellen Bildworkflows', midjourney: 'Hochwertige Ausgabe mit starken Details und Texturen', flux: 'Starke Details und fotorealistische Ausgabe in unterstuetzten Workflows' },
        { capability: 'Grenzen', gpt: 'Pruefen Sie Rechtschreibung, kleinen Text, Gesichter, Haende, Markenclaims und Compliance', nano: 'Pruefen Sie Modellverfuegbarkeit, Stilfit und Referenzkonsistenz', midjourney: 'Weniger ideal, wenn exakter Text und strenge Layouts Prioritaet haben', flux: 'Workflow und Zugang koennen je nach Plattform und Modellversion variieren' },
      ],
      note: 'Nutzen Sie GPT Image 2 zuerst, wenn Sie lesbaren Text, strukturierte Layouts, Produktvisuals, Bildbearbeitung oder kommerzielle Designentwuerfe brauchen. Midjourney passt besser fuer Art Direction. Flux ist sinnvoll, wenn offene Workflows und Referenzkontrolle wichtig sind. Nano Banana ist eine schnelle Alternative fuer kreative Iteration und Vergleich.',
    },
    prompts: {
      examples: [
        { id: 'multilingual-text', slot: 'prompt-multilingual-text', title: 'Prompt fuer mehrsprachiges Textlayout', prompt: 'Erstelle ein hochwertiges mehrsprachiges Editorial-Poster mit dem Titel "GLOBAL TYPE". Fuege lesbare Textbloecke auf Englisch, Spanisch, Franzoesisch, Japanisch und Arabisch hinzu, mit sauberem Raster, kraeftiger Headline-Typografie, starkem Kontrast und ausreichend Abstand fuer jede Sprache. Halte alle Texte kurz und gut pruefbar.' },
        { id: 'print-layout', slot: 'prompt-print-layout', title: 'Prompt fuer Printlayout', prompt: 'Erstelle ein druckfertiges Art-Deco-Lesezeichen fuer eine fiktive Buchhandlung namens "Tangerine Books". Zeige das Lesezeichen auf einem sauberen Proof-Sheet mit sichtbaren Anschnitt-, Beschnitt- und Sicherheitslinien. Nutze die exakten Woerter "TANGERINE BOOKS" und "READ WELL" mit klarer Schrift.' },
        { id: 'character-sheet', slot: 'prompt-character-sheet', title: 'Prompt fuer Charakter-Referenzbogen', prompt: 'Erstelle einen konsistenten Charakter-Referenzbogen fuer eine originale Adventure-Game-Heldin namens "Adele". Zeige Vorderansicht, Seitenansicht, Rueckansicht, drei Gesichtsausdruecke, Outfitdetails, Farbpalette und eine Prop-Nahaufnahme. Halte die Identitaet in allen Panels konsistent.' },
        { id: 'storyboard', slot: 'prompt-storyboard', title: 'Prompt fuer sequenzielles Storyboard', prompt: 'Erstelle ein sechs Panel Storyboard mit dem Titel "RAIN RUN". Zeige denselben Kurier, der durch eine regnerische Neonstadt faehrt und ein leuchtendes Paket liefert. Halte Figur, Paket, Wetter und Stil von Panel 1 bis Panel 6 konsistent.' },
        { id: 'reference-edit', slot: 'prompt-reference-edit', title: 'Prompt fuer referenzgefuehrte Interior-Bearbeitung', prompt: 'Nutze das hochgeladene Wohnzimmerfoto als Referenz. Erhalte Fensterposition, Wandstruktur, Sofa, Boden und Kamerawinkel. Aendere nur den Einrichtungsstil zu warmem Japandi mit Holztexturen, weichem Tageslicht, neutralen Stoffen und salbeigruenen Akzenten.' },
        { id: 'travel-brochure', slot: 'prompt-travel-brochure', title: 'Prompt fuer Editorial-Broschuere', prompt: 'Erstelle eine hochwertige Reisebroschueren-Doppelseite fuer ein fiktives Berghotel namens "Mist Ridge Lodge". Nutze die Ueberschriften "Weekend Retreat", "Rooms", "Dining" und "Trails". Verwende elegante Editorial-Fotografie, lesbare Schrift, ruhige Luxusfarben und ein poliertes Hospitality-Layout.' },
      ],
    },
    youtube: {
      examples: [
        { title: 'Einführung in ChatGPT Images 2.0', creator: 'OpenAI', href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI', videoId: 'sWkGomJ3TLI', text: 'Ein offizieller Launch-Referenzpunkt, um zu verstehen, wie OpenAI den neuen Bildworkflow und die Modellrichtung einordnet.' },
        { title: 'GPT Image 2 vs Nano Banana 2', creator: 'Creator Guide', href: 'https://www.youtube.com/watch?v=Yp4nRScy45c', videoId: 'Yp4nRScy45c', text: 'Ein praktisches Vergleichsvideo fuer Modellwahl, Workflow-Unterschiede und reale Bildergebnisse.' },
        { title: 'OpenAI Image 2: 10 Einsatzmoeglichkeiten', creator: 'Creator Test', href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw', videoId: 'GY-kAiZGLOw', text: 'Ein use-case-orientiertes Video zu praktischen Anwendungen jenseits eines einzelnen Galeriebeispiels.' },
      ],
    },
    reddit: {
      items: [
        { title: 'Image 2.0 Konsistenzsequenz', text: 'Ein Reddit-Thread mit mehreren Bildern, der testet, ob Image 2.0 dasselbe Motiv ueber Blickwinkel und Action-Shots hinweg konsistent halten kann.' },
        { title: 'Prompt-Stresstest-Beispiele', text: 'Ein anderer Reddit-Beitrag mit mehreren Ausgabetests, nuetzlich fuer den Vergleich von Detailgrad, Komposition und Prompt-Befolgung.' },
        { title: 'Game-Sprite-Workflow-Test', text: 'Eine Game-Dev-Diskussion mit Sprite-Sheet-Output und animationsartigen Medien, relevant fuer Konsistenz und Asset-Produktion.' },
        { title: 'Alltaegliche Output-Experimente', text: 'Ein separater Community-Beitrag mit praktischen Bildbeispielen und Kommentaren dazu, wie sich GPT-Image-2 im Alltag anfuehlt.' },
        { title: 'Diskussion zu Artefakten', text: 'Ein Reddit-Kritikthread zu sichtbaren Artefakten, hilfreich, um die Seite nicht nur mit Lob, sondern auch mit Fehlerbildern auszubalancieren.' },
        { title: 'Behauptung zur Selbstpruefung', text: 'Ein Beitrag ueber GPT-Image-2, das eigene Ausgaben prueft und iteriert, als Kontext fuer Qualitaetskontrolle und Verfeinerung.' },
        { title: 'Diskussion zum Qualitaetssprung', text: 'Eine eigene Diskussion ueber wahrgenommene Qualitaetsgewinne, als Community-Kontext statt offizieller Modelldokumentation.' },
        { title: 'Thread mit mehreren Qualitaetsbeispielen', text: 'Ein Multi-Image-Thread mit weiteren oeffentlichen Beispielen, damit der Abschnitt nicht von einem viralen Beitrag abhaengt.' },
        { title: 'Image 2.0 Wow-Beispiele', text: 'Ein weiterer unabhaengiger Reddit-Beitrag mit mehreren Beispielen, hilfreich fuer Stilbreite und oeffentliche Reaktionen.' },
        { title: 'GPT Image 2 vs Nano Banana 2', text: 'Ein Modellvergleich mit mehreren Side-by-Side-Bildern, relevant fuer Suchende, die GPT Image 2 mit anderen Bildmodellen vergleichen.' },
      ],
    },
    x: {
      items: [
        { title: 'Komplettes UI-Designsystem-Board', body: 'Oeffentliches GPT Image 2 Beispiel fuer ein vollstaendiges UI-Designsystem mit Labels, Komponentenkarten und Layoutkontrolle.' },
        { title: 'Offizieller Charakterbogen-Nachbau', body: 'Nuetzliche X-Referenz fuer Charakterkonsistenz, Posen, Kostuemdetails und Referenzbogen-Komposition.' },
        { title: 'Dichter chinesischer Textlayout-Test', body: 'Ein dichter nicht-englischer Textlayout-Test fuer Typografie, Abstand, Hierarchie und lesbaren Text in generierten Bildern.' },
        { title: 'Mathematische Konzeptvisualisierung', body: 'Oeffentliches Bildungsvisual mit Fokus auf Konzepterklaerung, saubere Diagrammstruktur und Infografik-Logik.' },
        { title: 'Mehrseitiges Brand-Kit', body: 'Kommerzielles Brand-Kit-Beispiel fuer Seitenkonsistenz, Identitaet, Layoutsysteme und kampagnentaugliche Richtung.' },
        { title: 'Moodboard fuer Interior Design', body: 'Creator-Beispiel fuer Raum-Moodboards, Materialpaletten, Raumkonzepte und referenzgefuehrte Planung.' },
        { title: 'Stilisierter Charakterposter', body: 'Oeffentliches Bildbeispiel fuer polierte Charakterpraesentation, starke Art Direction und posterreife Komposition.' },
        { title: 'Prompt-Sammlung eines Creators', body: 'Creator-Bildtest fuer promptbare Komposition, visuelle Hierarchie und social-ready Output.' },
        { title: 'Studio-Produktprompt', body: 'Oeffentliches Standbildbeispiel fuer Produktkomposition, Lichtkontrolle und promptgesteuerte kommerzielle Praesentation.' },
        { title: 'Cineastischer Illustrationstest', body: 'Oeffentliches X-Bildbeispiel fuer Stil, Licht, Motivdetails und die Spannweite des Bildmodells.' },
      ],
    },
    related: {
      links: [
        { title: 'GPT Image 2 Prompt-Vorlagen', href: '/prompts/models/gpt-image-2', text: 'Studieren Sie quellenbasierte Prompt-Strukturen und kehren Sie dann zu GPT Image 2 zurueck, um eigene Bilder zu erstellen.' },
        { title: 'Nano Banana Pro Generator', href: '/model/nano-banana-pro', text: 'Vergleichen Sie einen Gemini-Bildworkflow fuer hochaufloesende Designassets und textlastige Layouts.' },
        { title: 'Nano Banana 2 Generator', href: '/model/nano-banana-2', text: 'Erkunden Sie ein weiteres schnelles Modell fuer Bildgenerierung und Bearbeitung in gaengigen Publishing-Formaten.' },
        { title: 'Nano Banana Image to Image', href: '/model/nano-banana', text: 'Nutzen Sie einen anderen Image-to-Image-Workflow, wenn referenzgefuehrte Bearbeitung Prioritaet hat.' },
        { title: 'AI-Modelle-Hub', href: '/model', text: 'Durchsuchen Sie Toolaze Bild- und Videomodellseiten, wenn Sie breitere Modellvergleiche brauchen.' },
      ],
    },
  },
  ko: {
    features: {
      items: [
        { slot: 'feature-text-rendering', title: '높은 정확도의 텍스트 렌더링', paragraphs: ['읽기 쉬운 텍스트는 상업용 이미지에서 GPT Image 2를 쓰는 핵심 이유입니다. 마케팅팀은 이미지 안에 헤드라인, 제품 라벨, UI 문구, 이벤트 제목, 스티커, 차트 라벨, 콜아웃을 넣어야 할 때가 많습니다.', '텍스트는 짧게 유지하고 정확한 문구는 따옴표로 감싸며 위치를 지정하세요. 게시 전에는 철자, 브랜드 표현, 법적 문구, 작은 글자를 반드시 확인합니다.'], label: '읽기 쉬운 헤드라인과 패키지 라벨이 있는 GPT Image 2 제품 포스터' },
        { slot: 'feature-4k-output', title: '4K 이미지 출력', paragraphs: ['GPT Image 2는 리뷰, 레이아웃 테스트, 캠페인 기획, 고품질 웹 비주얼에 충분한 해상도가 필요할 때 유용합니다. Toolaze에서는 선택한 비율과 모델 설정이 지원할 때 4K 출력을 사용합니다.', '고해상도는 제품 디테일, 텍스트 라벨, 인터페이스 요소, 질감, 디자인 시스템 보드가 포함된 이미지에서 특히 중요합니다.'], label: '제품 디테일과 깔끔한 레이아웃이 있는 GPT Image 2 4K 상업용 비주얼' },
        { slot: 'feature-image-editing', title: '이미지 생성과 편집', paragraphs: ['GPT Image 2는 처음부터 이미지를 만드는 데만 쓰이지 않습니다. 기존 제품 사진, 공간 사진, 인터페이스 콘셉트, 시각 방향을 기준으로 특정 부분만 바꾸는 참조 기반 편집에도 적합합니다.', '배경 교체, 제품 연출, 조명 정리, 시즌 캠페인 변형, 패키지 mockup, 이커머스 listing 아이디어, 전후 비교 콘셉트에 사용할 수 있습니다.'], label: 'GPT Image 2 제품 이미지 편집 전후 예시' },
        { slot: 'feature-ui-layouts', title: '구조화된 레이아웃 제어', paragraphs: ['GPT Image 2는 단순한 예술 스타일보다 읽기 쉬운 레이아웃이 필요한 이미지에 유용합니다. 제품팀은 대시보드, 앱 화면, 랜딩 페이지 히어로, 기능 다이어그램, 데이터 보드, 수업용 설명 이미지, 발표용 시각 시스템을 스케치할 수 있습니다.'], label: '카드와 라벨이 정리된 GPT Image 2 대시보드 UI 목업' },
        { slot: 'feature-commercial-output', title: '상업용 크리에이티브 출력', paragraphs: ['GPT Image 2는 디자인 시간을 투입하기 전에 여러 캠페인 방향을 탐색하려는 마케팅팀에 도움이 됩니다. 제품 포스터, paid social 광고, 썸네일, 이커머스 배너, 기능 출시 비주얼, 시즌 캠페인을 테스트할 수 있습니다.'], label: '광고 크리에이티브 변형이 있는 GPT Image 2 캠페인 보드' },
        { slot: 'feature-prompt-following', title: '프롬프트 준수', paragraphs: ['GPT Image 2는 프롬프트가 명확한 작업을 줄 때 가장 잘 반응합니다. asset 유형, 주제, 대상, 레이아웃, 정확한 텍스트, 스타일, 조명, 배경, 비율, 바뀌면 안 되는 요소를 설명하세요. 첫 결과가 가깝다면 한 번에 한 부분만 수정합니다.'], label: '시각 출력 예시가 있는 GPT Image 2 프롬프트 지시 보드' },
      ],
    },
    gallery: {
      examples: [
        { slot: 'gallery-product-poster', title: '제품 출시 포스터', text: '병, 스킨케어, 커피, 스낵, 소프트웨어 기능을 읽기 쉬운 헤드라인과 명확한 제품 중심 구성으로 보여주는 포스터를 만듭니다.' },
        { slot: 'gallery-social-ad', title: '소셜 미디어 광고', text: '짧고 굵은 문구, 명확한 제품 장점, 크리에이터 친화적 구성을 갖춘 스크롤을 멈추게 하는 광고를 만듭니다.' },
        { slot: 'gallery-ui-mockup', title: 'UI 목업 콘셉트', text: '앱 대시보드, 분석 패널, 온보딩 페이지, 기능 overview 이미지를 읽기 쉬운 라벨과 구조화된 내비게이션으로 생성합니다.' },
        { slot: 'gallery-ecommerce', title: '이커머스 제품 이미지', text: '제품 참조 이미지를 사용해 더 깔끔한 marketplace 이미지, 시즌 배경, lifestyle setup, bundle 비주얼을 만듭니다.' },
        { slot: 'gallery-education', title: '교육용 인포그래픽', text: '수업 비주얼, 과학 다이어그램, 역사 설명, 과정 차트, 학습 가이드 이미지를 명확한 섹션 라벨과 함께 만듭니다.' },
        { slot: 'gallery-text-logo', title: '텍스트 로고 콘셉트', text: '초기 로고, 배지 레이아웃, 이벤트 제목, 스티커, 패키지 wordmark를 짧고 읽기 쉬운 텍스트로 탐색합니다.' },
        { slot: 'gallery-reference-edit', title: '참조 기반 편집', text: '참조 이미지를 업로드하고 GPT Image 2가 주 피사체를 유지하면서 배경, 조명, 스타일, 레이아웃을 바꾸도록 요청합니다.' },
        { slot: 'gallery-high-resolution', title: '고해상도 캠페인 비주얼', text: '4K 출력이 필요할 때 포스터, 배너, 제품 출시, 대형 크리에이티브 초안용 완성도 높은 캠페인 이미지를 만듭니다.' },
      ],
    },
    audiences: {
      items: [
        '마케팅팀: 제품 포스터, paid social 콘셉트, 캠페인 변형, 출시 비주얼, 썸네일 아이디어를 빠르게 테스트합니다.',
        '디자이너: 제작 도구로 옮기기 전에 moodboard, UI 화면, 레이아웃 시스템, 타이포그래피 방향, 시각 콘셉트를 탐색합니다.',
        '이커머스 판매자: 제품 이미지 변형, 시즌 배경, listing 비주얼, bundle 이미지, 프로모션 배너를 만듭니다.',
        '콘텐츠 크리에이터: 썸네일, 교육 그래픽, 소셜 포스트, 브랜드 이미지를 더 명확한 텍스트 방향으로 만듭니다.',
        '제품 관리자: 기능 화면, 내부 기획 보드, 앱 콘셉트, 제품 스토리텔링 비주얼을 초기 검증합니다.',
        '교육자: 다이어그램, 수업 비주얼, 개념 지도, 설명 이미지, 간단한 인포그래픽을 만듭니다.',
      ],
    },
    comparison: {
      rows: [
        { capability: '가장 적합한 용도', gpt: '텍스트 중심 상업용 비주얼, 이미지 편집, UI 목업, 구조화된 레이아웃', nano: '빠른 이미지 생성, 참조 편집, Gemini 스타일 크리에이티브 워크플로', midjourney: '스타일화된 아트 디렉션, 영화적 비주얼, 미감 탐색', flux: '포토리얼 이미지, 오픈 워크플로, 다중 참조 제어' },
        { capability: '텍스트 렌더링', gpt: '짧고 읽기 쉬운 텍스트, 라벨, 포스터, UI형 비주얼에 강함', nano: '최신 Gemini 이미지 워크플로와 텍스트 많은 디자인에 강함', midjourney: '개선되었지만 여전히 꼼꼼한 검토 필요', flux: '타이포그래피와 레이아웃 중심 작업에 강함' },
        { capability: '이미지 편집', gpt: '자연어 편집과 참조 기반 변경에 유용', nano: '빠른 반복과 image-to-image 변형에 유용', midjourney: '편집 워크플로가 있지만 일부 사용자에게는 덜 직접적', flux: '텍스트 기반 편집과 참조 제어에 강함' },
        { capability: '레이아웃 제어', gpt: '대시보드, 포스터, 인포그래픽, 다중 패널 콘셉트에 강함', nano: '구조화 생성과 상업용 콘셉트에 적합', midjourney: '엄격한 레이아웃보다 시각 스타일에 강함', flux: '제작용 비주얼과 제어된 구도에 강함' },
        { capability: '4K 출력', gpt: '설정이 지원하면 4K를 포함한 고해상도 워크플로 지원', nano: '현재 이미지 워크플로에서 고해상도 포지셔닝 강함', midjourney: '디테일과 질감이 강한 고품질 출력', flux: '지원 워크플로에서 디테일과 포토리얼 출력 강함' },
        { capability: '한계', gpt: '철자, 작은 텍스트, 얼굴, 손, 브랜드 claim, compliance 확인 필요', nano: '모델 가용성, 스타일 적합성, 참조 일관성 확인 필요', midjourney: '정확한 텍스트와 엄격한 레이아웃이 우선이면 덜 적합', flux: '플랫폼과 모델 버전에 따라 워크플로와 접근이 달라짐' },
      ],
      note: '읽기 쉬운 텍스트, 구조화된 레이아웃, 제품 비주얼, 이미지 편집, 상업용 초안이 필요하면 GPT Image 2를 먼저 사용하세요. 아트 디렉션이 핵심이면 Midjourney, 오픈 워크플로와 참조 제어가 중요하면 Flux, 빠른 비교가 필요하면 Nano Banana가 좋습니다.',
    },
    prompts: {
      examples: [
        { id: 'multilingual-text', slot: 'prompt-multilingual-text', title: '다국어 텍스트 레이아웃 프롬프트', prompt: '"GLOBAL TYPE"이라는 제목의 프리미엄 다국어 에디토리얼 포스터를 만들어 주세요. 영어, 스페인어, 프랑스어, 일본어, 아랍어의 짧고 읽기 쉬운 텍스트 블록을 넣고, 깔끔한 그리드, 강한 헤드라인 타이포그래피, 높은 대비, 언어별 충분한 여백을 유지하세요.' },
        { id: 'print-layout', slot: 'prompt-print-layout', title: '인쇄 레이아웃 프롬프트', prompt: '"Tangerine Books"라는 가상의 서점을 위한 인쇄용 Art Deco 책갈피 콘셉트를 만들어 주세요. 깔끔한 proof sheet 위에 bleed, trim, safe margin 가이드라인을 보이게 하고, "TANGERINE BOOKS"와 "READ WELL"을 선명하게 포함하세요.' },
        { id: 'character-sheet', slot: 'prompt-character-sheet', title: '캐릭터 레퍼런스 시트 프롬프트', prompt: '"Adele"이라는 오리지널 어드벤처 게임 여주인공의 일관된 캐릭터 레퍼런스 시트를 만들어 주세요. 정면, 측면, 후면, 표정 3개, 의상 디테일, 컬러 팔레트, 소품 클로즈업을 포함하고 모든 패널에서 정체성을 유지하세요.' },
        { id: 'storyboard', slot: 'prompt-storyboard', title: '연속 스토리보드 프롬프트', prompt: '"RAIN RUN"이라는 제목의 6패널 스토리보드를 만들어 주세요. 같은 배달원이 비 오는 네온 도시를 지나 빛나는 패키지를 전달하는 장면을 그리고, 1패널부터 6패널까지 인물, 패키지, 날씨, 스타일을 일관되게 유지하세요.' },
        { id: 'reference-edit', slot: 'prompt-reference-edit', title: '참조 기반 인테리어 편집 프롬프트', prompt: '업로드한 거실 사진을 참조로 사용하세요. 창 위치, 벽 구조, 소파 위치, 바닥, 카메라 각도는 유지하세요. 인테리어 스타일만 따뜻한 Japandi로 바꾸고, 나무 질감, 부드러운 자연광, 중립 패브릭, 세이지 그린 포인트를 사용하세요.' },
        { id: 'travel-brochure', slot: 'prompt-travel-brochure', title: '에디토리얼 브로슈어 프롬프트', prompt: '"Mist Ridge Lodge"라는 가상의 산악 리트리트를 위한 프리미엄 여행 브로슈어 스프레드를 만들어 주세요. "Weekend Retreat", "Rooms", "Dining", "Trails" 제목을 포함하고, 우아한 에디토리얼 사진, 읽기 쉬운 글자, 차분한 럭셔리 색, 세련된 호텔 레이아웃을 사용하세요.' },
      ],
    },
    youtube: {
      examples: [
        { title: 'ChatGPT Images 2.0 소개', creator: 'OpenAI', href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI', videoId: 'sWkGomJ3TLI', text: 'OpenAI가 새 이미지 워크플로와 모델 방향을 어떻게 소개하는지 이해할 수 있는 공식 출시형 영상입니다.' },
        { title: 'GPT Image 2 vs Nano Banana 2', creator: '크리에이터 가이드', href: 'https://www.youtube.com/watch?v=Yp4nRScy45c', videoId: 'Yp4nRScy45c', text: '모델 선택, 워크플로 차이, 실제 이미지 결과를 평가하는 데 도움이 되는 실용 비교 영상입니다.' },
        { title: 'OpenAI Image 2: 10가지 활용법', creator: '크리에이터 테스트', href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw', videoId: 'GY-kAiZGLOw', text: '단일 갤러리 이미지를 넘어 실제 활용 사례를 탐색하는 영상입니다.' },
      ],
    },
    reddit: {
      items: [
        { title: 'Image 2.0 일관성 시퀀스', text: 'Image 2.0이 각도와 액션 샷이 달라도 같은 주제를 유지하는지 테스트하는 다중 이미지 Reddit 글입니다.' },
        { title: '프롬프트 스트레스 테스트 예시', text: '디테일, 구도, 프롬프트 준수를 비교하기 좋은 여러 출력 테스트가 있는 별도 글입니다.' },
        { title: '게임 스프라이트 워크플로 테스트', text: '스프라이트 시트와 애니메이션식 미디어를 보여주는 game-dev 토론으로, 일관성과 asset 제작에 관련됩니다.' },
        { title: '일상 출력 실험', text: '실용적인 이미지 예시와 GPT-Image-2의 일상 사용감에 대한 댓글이 있는 커뮤니티 글입니다.' },
        { title: '아티팩트 비평 토론', text: '보이는 아티팩트를 다룬 비평 스레드로, 장점뿐 아니라 실제 실패 양상을 균형 있게 보여줍니다.' },
        { title: '자기 검토 반복 주장', text: 'GPT-Image-2가 자신의 출력을 검토하고 반복한다는 글로, 품질 관리 맥락에 유용합니다.' },
        { title: '품질 향상 토론', text: '체감 품질 향상에 초점을 둔 별도 토론으로, 공식 문서가 아닌 커뮤니티 맥락입니다.' },
        { title: '여러 예시의 품질 스레드', text: '추가 공개 예시를 제공하는 다중 이미지 스레드입니다.' },
        { title: 'Image 2.0 놀라운 예시', text: '스타일 범위와 공개 반응을 볼 수 있는 여러 예시가 담긴 독립 게시물입니다.' },
        { title: 'GPT Image 2 vs Nano Banana 2', text: '여러 side-by-side 이미지를 포함한 모델 비교 글로, 모델 비교 검색자에게 관련됩니다.' },
      ],
    },
    x: {
      items: [
        { title: '완전한 UI 디자인 시스템 보드', body: '구조화된 라벨, 컴포넌트 카드, 인터페이스 레이아웃 제어를 테스트하는 공개 GPT Image 2 예시입니다.' },
        { title: '공식 캐릭터 시트 재구성', body: '캐릭터 일관성, 포즈, 의상 디테일, 레퍼런스 시트 구성을 확인하기 좋은 X 참고 자료입니다.' },
        { title: '고밀도 중국어 텍스트 레이아웃 테스트', body: '생성 이미지 안의 타이포그래피, 간격, 계층, 가독성을 검토하는 비영어 텍스트 테스트입니다.' },
        { title: '수학 개념 시각화', body: '개념 설명, 깔끔한 다이어그램 구조, 인포그래픽식 추론에 초점을 둔 교육용 공개 예시입니다.' },
        { title: '멀티 페이지 브랜드 키트', body: '페이지 일관성, 정체성 표현, 레이아웃 시스템, 캠페인 방향을 보는 상업용 brand kit 예시입니다.' },
        { title: '인테리어 디자인 무드보드', body: '인테리어 무드보드, 소재 팔레트, 공간 콘셉트, 참조 기반 계획을 위한 크리에이터 예시입니다.' },
        { title: '스타일화된 캐릭터 포스터', body: '세련된 캐릭터 표현, 강한 아트 디렉션, 제작용 포스터 구도에 초점을 둔 공개 이미지입니다.' },
        { title: '크리에이터 프롬프트 모음', body: '프롬프트로 제어 가능한 구도, 시각 계층, 소셜용 완성도를 공부하기 좋은 이미지 테스트입니다.' },
        { title: '스튜디오 제품 프롬프트', body: '제품형 구도, 조명 제어, 프롬프트 기반 상업용 프레젠테이션을 확인하는 공개 still 이미지입니다.' },
        { title: '시네마틱 일러스트 테스트', body: '영화적 스타일, 조명, 피사체 디테일, 모델 표현 범위를 확인하는 X 공개 예시입니다.' },
      ],
    },
    related: {
      links: [
        { title: 'GPT Image 2 프롬프트 템플릿', href: '/prompts/models/gpt-image-2', text: '출처 기반 프롬프트 구조를 살펴본 뒤 GPT Image 2로 돌아와 직접 이미지를 만듭니다.' },
        { title: 'Nano Banana Pro 생성기', href: '/model/nano-banana-pro', text: '고해상도 디자인 asset과 텍스트 많은 레이아웃용 Gemini 이미지 워크플로를 비교합니다.' },
        { title: 'Nano Banana 2 생성기', href: '/model/nano-banana-2', text: '일반 게시 형식에 맞는 빠른 이미지 생성 및 편집 모델을 탐색합니다.' },
        { title: 'Nano Banana Image to Image', href: '/model/nano-banana', text: '참조 기반 편집이 우선일 때 다른 image-to-image 워크플로를 사용합니다.' },
        { title: 'AI 모델 허브', href: '/model', text: '더 넓은 모델 비교가 필요할 때 Toolaze 이미지 및 비디오 모델 페이지를 둘러봅니다.' },
      ],
    },
  },
  fr: {
    features: {
      items: [
        { slot: 'feature-text-rendering', title: 'Rendu de texte haute précision', paragraphs: ['Le texte lisible est l’une des raisons majeures d’utiliser GPT Image 2 pour des images commerciales. Les équipes marketing ont souvent besoin de titres, labels produit, phrases UI, titres d’événement, stickers, libellés de graphique ou annotations directement dans l’image.', 'Gardez le texte court, mettez les mots exacts entre guillemets et décrivez leur emplacement. Avant publication, vérifiez orthographe, formulation de marque, mentions légales et petite typographie.'], label: 'Affiche produit GPT Image 2 avec titre et label lisibles' },
        { slot: 'feature-4k-output', title: 'Sortie image 4K', paragraphs: ['GPT Image 2 est utile quand la sortie doit avoir assez de résolution pour la revue, les tests de layout, la planification de campagne et les visuels web de qualité. Sur Toolaze, utilisez la 4K lorsque le ratio et les réglages du modèle le permettent.', 'La haute résolution compte surtout avec détails produit, labels texte, éléments d’interface, textures ou board de design system.'], label: 'Visuel commercial 4K GPT Image 2 avec détail produit et layout propre' },
        { slot: 'feature-image-editing', title: 'Génération et retouche d’image', paragraphs: ['GPT Image 2 ne sert pas seulement à créer depuis zéro. Il fonctionne aussi pour la retouche guidée par référence, à partir d’une photo produit, d’une pièce, d’un concept UI ou d’une direction visuelle.', 'Utilisez-le pour remplacer un fond, mettre en scène un produit, nettoyer la lumière, créer des variantes saisonnières, mockups packaging, idées e-commerce et concepts avant/après.'], label: 'Exemple avant/après de retouche produit avec GPT Image 2' },
        { slot: 'feature-ui-layouts', title: 'Contrôle de layouts structurés', paragraphs: ['GPT Image 2 est utile quand l’image doit avoir un layout lisible plutôt qu’un simple style artistique. Les équipes produit peuvent esquisser dashboards, écrans d’app, héros de landing page, diagrammes de fonctionnalités, tableaux de données, supports pédagogiques et systèmes visuels de présentation.'], label: 'Mockup UI de dashboard GPT Image 2 avec cartes et labels' },
        { slot: 'feature-commercial-output', title: 'Création commerciale', paragraphs: ['GPT Image 2 aide les équipes marketing à explorer plusieurs directions avant d’engager du temps design. Testez affiches produit, paid social ads, thumbnails, bannières e-commerce, visuels de lancement et campagnes saisonnières.'], label: 'Board de campagne GPT Image 2 avec variantes publicitaires' },
        { slot: 'feature-prompt-following', title: 'Respect du prompt', paragraphs: ['GPT Image 2 répond mieux quand le prompt donne une tâche claire. Décrivez type de ressource, sujet, audience, layout, texte exact, style, lumière, fond, ratio et ce qui ne doit pas changer. Si le premier résultat est proche, modifiez une partie du prompt à la fois.'], label: 'Board d’instructions GPT Image 2 avec exemples visuels' },
      ],
    },
    gallery: {
      examples: [
        { slot: 'gallery-product-poster', title: 'Affiche de lancement produit', text: 'Créez une affiche propre pour bouteille, soin, café, snack ou fonctionnalité logicielle avec titre lisible et produit bien mis en avant.' },
        { slot: 'gallery-social-ad', title: 'Publicité social media', text: 'Créez une publicité qui arrête le scroll avec texte court, bénéfice clair et composition adaptée aux créateurs.' },
        { slot: 'gallery-ui-mockup', title: 'Concept de mockup UI', text: 'Générez dashboard, panneau analytics, onboarding ou overview de fonctionnalité avec labels lisibles et navigation structurée.' },
        { slot: 'gallery-ecommerce', title: 'Image produit e-commerce', text: 'Utilisez une référence produit pour créer une image marketplace plus propre, fond saisonnier, scène lifestyle ou bundle.' },
        { slot: 'gallery-education', title: 'Infographie pédagogique', text: 'Créez visuel de cours, diagramme scientifique, explication historique, schéma de processus ou guide d’étude avec sections claires.' },
        { slot: 'gallery-text-logo', title: 'Concept de logo textuel', text: 'Explorez logos initiaux, badges, titres d’événement, stickers et wordmarks packaging avec texte court et lisible.' },
        { slot: 'gallery-reference-edit', title: 'Retouche guidée par référence', text: 'Importez une image de référence et demandez à GPT Image 2 de préserver le sujet tout en changeant fond, lumière, style ou layout.' },
        { slot: 'gallery-high-resolution', title: 'Visuel de campagne haute résolution', text: 'Créez une image polie pour affiches, bannières, lancements et grands brouillons créatifs quand la 4K est nécessaire.' },
      ],
    },
    audiences: {
      items: [
        'Marketing : crée affiches produit, concepts paid social, variantes de campagne, visuels de lancement et thumbnails pour tester vite.',
        'Designers : explorent moodboards, écrans UI, systèmes de layout, directions typographiques et concepts avant la production.',
        'E-commerce : crée variantes produit, fonds saisonniers, visuels listing, bundles et bannières promotionnelles.',
        'Créateurs : produisent thumbnails, graphiques pédagogiques, posts sociaux et images de marque avec une direction texte plus claire.',
        'Product managers : esquissent écrans de fonctionnalités, boards internes, concepts d’app et storytelling visuel pour validation précoce.',
        'Enseignants : créent diagrammes, supports de cours, cartes conceptuelles, explications et infographies simples.',
      ],
    },
    comparison: {
      rows: [
        { capability: 'Idéal pour', gpt: 'Visuels commerciaux riches en texte, retouche, mockups UI et layouts structurés', nano: 'Génération rapide, retouches avec référence et workflows créatifs type Gemini', midjourney: 'Direction artistique stylisée, visuels cinématiques et exploration esthétique', flux: 'Images photoréalistes, workflows ouverts et contrôle multi-référence' },
        { capability: 'Rendu du texte', gpt: 'Fort pour texte court lisible, labels, affiches et visuels type UI', nano: 'Fort dans les workflows Gemini récents et designs textuels', midjourney: 'Amélioré mais à vérifier soigneusement', flux: 'Fort pour typographie et layouts' },
        { capability: 'Retouche image', gpt: 'Utile pour retouches en langage naturel et changements guidés par référence', nano: 'Utile pour itération rapide et variantes image-to-image', midjourney: 'Éditeur disponible mais parfois moins direct', flux: 'Fort pour retouche par texte et contrôle de référence' },
        { capability: 'Contrôle layout', gpt: 'Fort pour dashboards, affiches, infographies et concepts multipanneaux', nano: 'Bon pour génération structurée et concepts commerciaux', midjourney: 'Meilleur pour style visuel que layout strict', flux: 'Fort pour visuels de production et compositions contrôlées' },
        { capability: 'Sortie 4K', gpt: 'Prend en charge la haute résolution, y compris 4K quand les réglages le permettent', nano: 'Positionnement haute résolution fort dans les workflows actuels', midjourney: 'Sortie de qualité avec détail et texture', flux: 'Détail fort et rendu photoréaliste dans les workflows compatibles' },
        { capability: 'Limites', gpt: 'Vérifiez orthographe, petit texte, visages, mains, claims de marque et conformité', nano: 'Vérifiez disponibilité, style et cohérence de référence', midjourney: 'Moins idéal si texte exact et layout strict sont prioritaires', flux: 'Workflow et accès varient selon plateforme et version' },
      ],
      note: 'Utilisez GPT Image 2 d’abord pour texte lisible, layouts structurés, visuels produit, retouche ou brouillons commerciaux. Utilisez Midjourney pour la direction artistique, Flux pour workflows ouverts et références, Nano Banana pour itérer et comparer vite.',
    },
    prompts: {
      examples: [
        { id: 'multilingual-text', slot: 'prompt-multilingual-text', title: 'Prompt de layout texte multilingue', prompt: 'Crée une affiche éditoriale premium intitulée "GLOBAL TYPE". Inclue des blocs courts et lisibles en anglais, espagnol, français, japonais et arabe, avec grille propre, typographie forte, contraste élevé et espace suffisant pour chaque langue.' },
        { id: 'print-layout', slot: 'prompt-print-layout', title: 'Prompt de layout print', prompt: 'Crée un marque-page Art Deco prêt à imprimer pour une librairie fictive appelée "Tangerine Books". Montre-le sur une feuille de BAT propre avec fonds perdus, coupe et marge de sécurité visibles. Inclue exactement "TANGERINE BOOKS" et "READ WELL".' },
        { id: 'character-sheet', slot: 'prompt-character-sheet', title: 'Prompt de fiche personnage', prompt: 'Crée une fiche de référence cohérente pour une héroïne de jeu d’aventure originale nommée "Adele". Montre face, profil, dos, trois expressions, détails de tenue, palette couleur et gros plan d’accessoire, avec identité constante.' },
        { id: 'storyboard', slot: 'prompt-storyboard', title: 'Prompt de storyboard séquentiel', prompt: 'Crée un storyboard de six panneaux intitulé "RAIN RUN". Montre le même livreur traversant une ville néon pluvieuse avec un colis lumineux. Garde personnage, colis, météo et style cohérents du panneau 1 au panneau 6.' },
        { id: 'reference-edit', slot: 'prompt-reference-edit', title: 'Prompt de retouche intérieure avec référence', prompt: 'Utilise la photo de salon importée comme référence. Préserve fenêtres, structure du mur, canapé, sol et angle caméra. Change seulement le style en Japandi chaleureux avec bois, lumière douce, tissus neutres et accents vert sauge.' },
        { id: 'travel-brochure', slot: 'prompt-travel-brochure', title: 'Prompt de brochure éditoriale', prompt: 'Crée une double page de brochure premium pour un refuge de montagne fictif nommé "Mist Ridge Lodge". Inclue "Weekend Retreat", "Rooms", "Dining" et "Trails", avec photographie éditoriale élégante, texte lisible et layout hôtelier poli.' },
      ],
    },
    youtube: {
      examples: [
        { title: 'Présentation de ChatGPT Images 2.0', creator: 'OpenAI', href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI', videoId: 'sWkGomJ3TLI', text: 'Référence officielle pour comprendre comment OpenAI présente le nouveau workflow image et la direction du modèle.' },
        { title: 'GPT Image 2 vs Nano Banana 2', creator: 'Guide créateur', href: 'https://www.youtube.com/watch?v=Yp4nRScy45c', videoId: 'Yp4nRScy45c', text: 'Comparaison pratique pour évaluer choix de modèle, différences de workflow et résultats réels.' },
        { title: 'OpenAI Image 2 : 10 façons de l’utiliser', creator: 'Test créateur', href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw', videoId: 'GY-kAiZGLOw', text: 'Vidéo orientée cas d’usage qui explore des applications concrètes au-delà d’une seule image de galerie.' },
      ],
    },
    reddit: {
      items: [
        { title: 'Séquence de cohérence Image 2.0', text: 'Thread multi-image testant si Image 2.0 garde le même sujet entre angles et scènes d’action.' },
        { title: 'Exemples de stress test de prompts', text: 'Post avec plusieurs tests de sortie pour comparer détail, composition et suivi du prompt.' },
        { title: 'Test de workflow sprite de jeu', text: 'Discussion game-dev avec sprite sheet et média type animation, utile pour cohérence et production d’assets.' },
        { title: 'Expérimentation de sorties courantes', text: 'Post communautaire avec exemples pratiques et commentaires sur l’usage quotidien de GPT-Image-2.' },
        { title: 'Discussion critique sur les artefacts', text: 'Thread critique sur artefacts visibles, utile pour présenter aussi des limites réelles.' },
        { title: 'Affirmation d’auto-révision itérative', text: 'Post sur GPT-Image-2 qui relit et itère sa sortie, contexte utile pour qualité et affinage.' },
        { title: 'Discussion sur le saut de qualité', text: 'Discussion sur gains perçus de qualité, comme contexte communautaire.' },
        { title: 'Thread qualité avec exemples multiples', text: 'Thread multi-image avec d’autres exemples publics.' },
        { title: 'Exemples wow Image 2.0', text: 'Post indépendant avec plusieurs exemples pour observer variété de styles et réactions.' },
        { title: 'GPT Image 2 vs Nano Banana 2', text: 'Post comparatif avec images côte à côte, pertinent pour comparer les modèles.' },
      ],
    },
    x: {
      items: [
        { title: 'Board complet de design system UI', body: 'Exemple public testant un système UI complet avec labels, cartes de composants et contrôle de layout.' },
        { title: 'Reconstruction de fiche personnage officielle', body: 'Référence utile pour cohérence de personnage, poses, tenue et composition en fiche.' },
        { title: 'Test de layout avec texte chinois dense', body: 'Test de texte non anglais pour vérifier typographie, espacement, hiérarchie et lisibilité.' },
        { title: 'Visualisation de concept mathématique', body: 'Exemple éducatif centré sur explication, diagramme clair et raisonnement visuel.' },
        { title: 'Brand kit multipage', body: 'Exemple commercial pour cohérence de pages, identité, systèmes de layout et direction campagne.' },
        { title: 'Moodboard de design intérieur', body: 'Exemple pour moodboards, palettes matière, concepts de pièce et planification guidée par référence.' },
        { title: 'Affiche de personnage stylisée', body: 'Exemple centré sur présentation de personnage, direction artistique forte et composition poster.' },
        { title: 'Collection de prompts créateur', body: 'Test utile pour étudier composition promptable, hiérarchie visuelle et sortie prête pour social.' },
        { title: 'Prompt produit en studio', body: 'Exemple de still produit pour composition, lumière et présentation commerciale.' },
        { title: 'Test d’illustration cinématique', body: 'Exemple pour vérifier style cinématique, lumière, détails sujet et amplitude du modèle.' },
      ],
    },
    related: {
      links: [
        { title: 'Templates de prompts GPT Image 2', href: '/prompts/models/gpt-image-2', text: 'Étudiez des structures de prompt sourcées, puis revenez à GPT Image 2 pour créer votre image.' },
        { title: 'Générateur Nano Banana Pro', href: '/model/nano-banana-pro', text: 'Comparez un workflow Gemini pour assets haute résolution et layouts riches en texte.' },
        { title: 'Générateur Nano Banana 2', href: '/model/nano-banana-2', text: 'Explorez un autre modèle rapide de génération et retouche d’image.' },
        { title: 'Nano Banana Image to Image', href: '/model/nano-banana', text: 'Utilisez un autre workflow image-to-image quand la retouche avec référence est prioritaire.' },
        { title: 'Hub des modèles IA', href: '/model', text: 'Parcourez les pages de modèles image et vidéo Toolaze pour comparer plus largement.' },
      ],
    },
  },
  pt: {
    features: {
      items: [
        { slot: 'feature-text-rendering', title: 'Renderização de texto com alta precisão', paragraphs: ['Texto legível é um dos principais motivos para usar o GPT Image 2 em imagens comerciais. Equipes de marketing frequentemente precisam de manchetes, rótulos de produto, frases de UI, títulos de evento, stickers, etiquetas de gráfico ou chamadas dentro da imagem.', 'Mantenha o texto curto, coloque as palavras exatas entre aspas e descreva onde elas devem aparecer. Antes de publicar, revise ortografia, linguagem de marca, avisos legais e tipografia pequena.'], label: 'Pôster de produto do GPT Image 2 com manchete e rótulo legíveis' },
        { slot: 'feature-4k-output', title: 'Saída de imagem 4K', paragraphs: ['GPT Image 2 é útil quando a saída precisa de resolução para revisão, testes de layout, planejamento de campanha e visuais web de alta qualidade. No Toolaze, use 4K quando proporção e configurações do modelo permitirem.', 'Alta resolução importa especialmente em imagens com detalhes de produto, rótulos de texto, elementos de interface, texturas ou boards de sistema de design.'], label: 'Visual comercial 4K do GPT Image 2 com detalhe de produto e layout limpo' },
        { slot: 'feature-image-editing', title: 'Geração e edição de imagens', paragraphs: ['GPT Image 2 não serve apenas para criar do zero. Ele também funciona bem para edição guiada por referência, começando com uma foto de produto, ambiente, conceito de interface ou direção visual e pedindo mudanças específicas.', 'Use para troca de fundo, staging de produto, limpeza de iluminação, variações sazonais, mockups de embalagem, ideias de e-commerce e conceitos antes/depois.'], label: 'Exemplo antes e depois de edição de produto com GPT Image 2' },
        { slot: 'feature-ui-layouts', title: 'Controle de layouts estruturados', paragraphs: ['GPT Image 2 é útil quando a imagem precisa de um layout legível, não apenas de estilo artístico. Times de produto podem rascunhar dashboards, telas de app, heróis de landing page, diagramas, painéis de dados, explicações de aula e sistemas visuais para apresentação.'], label: 'Mockup UI de dashboard do GPT Image 2 com cards e rótulos' },
        { slot: 'feature-commercial-output', title: 'Criatividade comercial', paragraphs: ['GPT Image 2 ajuda times de marketing a explorar várias direções antes de investir tempo de design. Teste pôsteres de produto, anúncios pagos, thumbnails, banners e-commerce, visuais de lançamento e campanhas sazonais.'], label: 'Board de campanha do GPT Image 2 com variações de anúncio' },
        { slot: 'feature-prompt-following', title: 'Seguimento de prompt', paragraphs: ['GPT Image 2 responde melhor quando o prompt define uma tarefa clara. Descreva tipo de asset, assunto, público, layout, texto exato, estilo, luz, fundo, proporção e o que não deve mudar. Se o primeiro resultado estiver perto, ajuste uma parte por vez.'], label: 'Board de instruções para GPT Image 2 com exemplos visuais' },
      ],
    },
    gallery: {
      examples: [
        { slot: 'gallery-product-poster', title: 'Poster de lançamento de produto', text: 'Crie um pôster limpo para garrafa, skincare, café, snack ou recurso de software com manchete legível e produto em destaque.' },
        { slot: 'gallery-social-ad', title: 'Anúncio para redes sociais', text: 'Crie um anúncio que prende atenção com texto curto, benefício claro e composição adequada para creators.' },
        { slot: 'gallery-ui-mockup', title: 'Conceito de mockup UI', text: 'Gere dashboards, painéis de análise, onboarding ou imagens de overview com rótulos legíveis e navegação estruturada.' },
        { slot: 'gallery-ecommerce', title: 'Imagem de produto e-commerce', text: 'Use referência de produto para criar imagens de marketplace mais limpas, fundos sazonais, cenas lifestyle ou bundles.' },
        { slot: 'gallery-education', title: 'Infográfico educacional', text: 'Crie visuais de aula, diagramas científicos, explicações históricas, fluxos ou guias de estudo com seções claras.' },
        { slot: 'gallery-text-logo', title: 'Conceito de logo textual', text: 'Explore ideias iniciais de logo, badges, títulos de evento, stickers e wordmarks de embalagem com texto curto e legível.' },
        { slot: 'gallery-reference-edit', title: 'Edição guiada por referência', text: 'Envie uma imagem de referência e peça ao GPT Image 2 para preservar o assunto principal enquanto muda fundo, luz, estilo ou layout.' },
        { slot: 'gallery-high-resolution', title: 'Visual de campanha em alta resolução', text: 'Crie uma imagem polida para pôsteres, banners, lançamentos e rascunhos criativos grandes quando 4K for necessário.' },
      ],
    },
    audiences: {
      items: [
        'Marketing: cria pôsteres de produto, conceitos paid social, variações de campanha, visuais de lançamento e thumbnails para testes rápidos.',
        'Designers: exploram moodboards, telas UI, sistemas de layout, direções tipográficas e conceitos antes das ferramentas de produção.',
        'E-commerce: cria variações de produto, fundos sazonais, imagens de listing, bundles e banners promocionais.',
        'Creators: fazem thumbnails, gráficos educativos, posts sociais e imagens de marca com direção de texto mais clara.',
        'Product managers: rascunham telas de recurso, boards internos, conceitos de app e storytelling visual para validação inicial.',
        'Educadores: criam diagramas, visuais de aula, mapas conceituais, explicações e infográficos simples para materiais didáticos.',
      ],
    },
    comparison: {
      rows: [
        { capability: 'Melhor para', gpt: 'Visuais comerciais com texto, edição de imagem, mockups UI e layouts estruturados', nano: 'Geração rápida, edições com referência e fluxos criativos estilo Gemini', midjourney: 'Direção artística estilizada, visuais cinematográficos e exploração estética', flux: 'Imagens fotorrealistas, fluxos abertos e controle com múltiplas referências' },
        { capability: 'Texto na imagem', gpt: 'Forte para texto curto legível, rótulos, pôsteres e visuais tipo UI', nano: 'Forte em fluxos Gemini recentes e designs com muito texto', midjourney: 'Melhorou, mas ainda exige revisão cuidadosa', flux: 'Forte em tipografia e layouts' },
        { capability: 'Edição de imagem', gpt: 'Útil para edições em linguagem natural e mudanças guiadas por referência', nano: 'Útil para iteração rápida e variações image-to-image', midjourney: 'Possui editor, mas pode ser menos direto', flux: 'Forte em edição por texto e controle de referência' },
        { capability: 'Controle de layout', gpt: 'Forte para dashboards, pôsteres, infográficos e conceitos multipainel', nano: 'Bom para geração estruturada e conceitos comerciais', midjourney: 'Melhor para estilo visual que layout estrito', flux: 'Forte para visuais de produção e composições controladas' },
        { capability: 'Saída 4K', gpt: 'Suporta alta resolução, incluindo 4K quando as configurações permitem', nano: 'Boa proposta de alta resolução em fluxos atuais', midjourney: 'Alta qualidade com detalhe e textura', flux: 'Detalhe forte e saída fotorrealista nos fluxos suportados' },
        { capability: 'Limitações', gpt: 'Revise ortografia, texto pequeno, rostos, mãos, claims de marca e compliance', nano: 'Revise disponibilidade, encaixe de estilo e consistência de referência', midjourney: 'Menos ideal quando texto exato e layout estrito são prioridade', flux: 'Fluxo e acesso variam por plataforma e versão' },
      ],
      note: 'Use GPT Image 2 primeiro para texto legível, layouts estruturados, visuais de produto, edição ou rascunhos comerciais. Use Midjourney para direção artística, Flux para fluxos abertos e controle de referência, e Nano Banana para iteração e comparação rápida.',
    },
    prompts: {
      examples: [
        { id: 'multilingual-text', slot: 'prompt-multilingual-text', title: 'Prompt de layout multilíngue', prompt: 'Crie um pôster editorial premium chamado "GLOBAL TYPE". Inclua blocos curtos e legíveis em inglês, espanhol, francês, japonês e árabe, com grade limpa, tipografia forte, alto contraste e espaçamento suficiente para cada idioma.' },
        { id: 'print-layout', slot: 'prompt-print-layout', title: 'Prompt de layout impresso', prompt: 'Crie um marcador Art Deco pronto para impressão para uma livraria fictícia chamada "Tangerine Books". Mostre em uma folha de prova com sangria, corte e margem segura visíveis. Inclua exatamente "TANGERINE BOOKS" e "READ WELL" com letras nítidas.' },
        { id: 'character-sheet', slot: 'prompt-character-sheet', title: 'Prompt de ficha de personagem', prompt: 'Crie uma ficha de referência coerente para uma heroína original de jogo chamada "Adele". Mostre frente, lado, costas, três expressões, detalhes do traje, paleta de cores e close de um acessório, mantendo a identidade consistente.' },
        { id: 'storyboard', slot: 'prompt-storyboard', title: 'Prompt de storyboard sequencial', prompt: 'Crie um storyboard de seis painéis chamado "RAIN RUN". Mostre o mesmo entregador atravessando uma cidade neon chuvosa com um pacote brilhante. Mantenha personagem, pacote, clima e estilo consistentes.' },
        { id: 'reference-edit', slot: 'prompt-reference-edit', title: 'Prompt de edição interior com referência', prompt: 'Use a foto de sala enviada como referência. Preserve janelas, parede, sofá, piso e ângulo da câmera. Mude apenas o estilo para Japandi quente com madeira, luz suave, tecidos neutros e acentos verde sálvia.' },
        { id: 'travel-brochure', slot: 'prompt-travel-brochure', title: 'Prompt de brochura editorial', prompt: 'Crie uma página dupla de brochura premium para um retiro de montanha fictício chamado "Mist Ridge Lodge". Inclua "Weekend Retreat", "Rooms", "Dining" e "Trails", com fotografia editorial elegante, texto legível e layout hoteleiro polido.' },
      ],
    },
    youtube: {
      examples: [
        { title: 'Apresentando ChatGPT Images 2.0', creator: 'OpenAI', href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI', videoId: 'sWkGomJ3TLI', text: 'Referência oficial de lançamento para entender como a OpenAI apresenta o novo fluxo de imagem e a direção do modelo.' },
        { title: 'GPT Image 2 vs Nano Banana 2', creator: 'Guia de creator', href: 'https://www.youtube.com/watch?v=Yp4nRScy45c', videoId: 'Yp4nRScy45c', text: 'Comparação prática para avaliar escolha de modelo, diferenças de fluxo e resultados reais.' },
        { title: 'OpenAI Image 2: 10 formas de usar', creator: 'Teste de creator', href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw', videoId: 'GY-kAiZGLOw', text: 'Vídeo focado em usos práticos além de uma única imagem de galeria.' },
      ],
    },
    reddit: {
      items: [
        { title: 'Sequência de consistência do Image 2.0', text: 'Thread multiimagem testando se o Image 2.0 mantém o mesmo sujeito em ângulos e cenas de ação.' },
        { title: 'Exemplos de stress test de prompts', text: 'Post com vários testes de saída para comparar detalhe, composição e seguimento de prompt.' },
        { title: 'Teste de workflow para sprites', text: 'Discussão game-dev com sprite sheet e mídia tipo animação, relevante para consistência e produção de assets.' },
        { title: 'Experimentação casual de saída', text: 'Post comunitário com exemplos práticos e comentários sobre o uso cotidiano do GPT-Image-2.' },
        { title: 'Discussão crítica de artefatos', text: 'Thread sobre artefatos visíveis, útil para equilibrar a página com falhas reais.' },
        { title: 'Afirmação de autoavaliação iterativa', text: 'Post sobre GPT-Image-2 revisar e iterar a própria saída, como contexto de controle de qualidade.' },
        { title: 'Discussão sobre salto de qualidade', text: 'Discussão sobre ganhos percebidos de qualidade, como contexto de comunidade.' },
        { title: 'Thread de qualidade com múltiplos exemplos', text: 'Thread multiimagem com exemplos públicos adicionais.' },
        { title: 'Exemplos impressionantes do Image 2.0', text: 'Post independente com vários exemplos para observar variedade de estilo e reação pública.' },
        { title: 'GPT Image 2 vs Nano Banana 2', text: 'Post comparativo com imagens lado a lado, relevante para quem compara modelos.' },
      ],
    },
    x: {
      items: [
        { title: 'Board completo de sistema UI', body: 'Exemplo público testando sistema UI completo com rótulos, cards de componentes e controle de layout.' },
        { title: 'Reconstrução de ficha oficial de personagem', body: 'Referência útil para consistência de personagem, poses, traje e composição de ficha.' },
        { title: 'Teste de layout com texto chinês denso', body: 'Teste de texto não inglês para revisar tipografia, espaçamento, hierarquia e legibilidade.' },
        { title: 'Visualização de conceito matemático', body: 'Exemplo educacional com foco em explicação, diagrama limpo e raciocínio visual.' },
        { title: 'Brand kit multipágina', body: 'Exemplo comercial para consistência de páginas, identidade, sistemas de layout e campanha.' },
        { title: 'Moodboard de design interior', body: 'Exemplo para moodboards, paletas de materiais, conceitos de ambiente e planejamento com referência.' },
        { title: 'Pôster de personagem estilizado', body: 'Exemplo focado em personagem polido, direção artística forte e composição de pôster.' },
        { title: 'Coleção de prompts de creator', body: 'Teste útil para estudar composição por prompt, hierarquia visual e saída pronta para redes.' },
        { title: 'Prompt de produto em estúdio', body: 'Exemplo de still para composição de produto, controle de luz e apresentação comercial.' },
        { title: 'Teste de ilustração cinematográfica', body: 'Exemplo para verificar estilo cinematográfico, luz, detalhes do sujeito e alcance do modelo.' },
      ],
    },
    related: {
      links: [
        { title: 'Templates de prompt para GPT Image 2', href: '/prompts/models/gpt-image-2', text: 'Estude estruturas de prompt com fontes e volte ao GPT Image 2 para criar sua imagem.' },
        { title: 'Gerador Nano Banana Pro', href: '/model/nano-banana-pro', text: 'Compare um workflow Gemini para assets em alta resolução e layouts com muito texto.' },
        { title: 'Gerador Nano Banana 2', href: '/model/nano-banana-2', text: 'Explore outro modelo rápido para geração e edição de imagens.' },
        { title: 'Nano Banana Image to Image', href: '/model/nano-banana', text: 'Use outro fluxo image-to-image quando edição com referência for prioridade.' },
        { title: 'Hub de modelos de IA', href: '/model', text: 'Navegue por páginas de modelos de imagem e vídeo do Toolaze para comparar mais opções.' },
      ],
    },
  },
  'zh-TW': {
    features: {
      items: [
        { slot: 'feature-text-rendering', title: '高準確度文字渲染', paragraphs: ['文字渲染是商用圖片使用 GPT Image 2 的重要原因之一。行銷團隊常需要在圖中放入可讀標題、產品標籤、UI 文案、活動標題、貼紙、圖表標籤或註解。', '請讓文字保持簡短，把精確字詞放在引號中，並描述文字應出現的位置。發布前仍要檢查拼字、品牌措辭、法律聲明與小字排版。'], label: '含可讀標題與包裝標籤的 GPT Image 2 產品海報' },
        { slot: 'feature-4k-output', title: '4K 圖像輸出', paragraphs: ['當輸出需要足夠解析度來做審核、版面測試、活動規劃與高品質網頁視覺時，GPT Image 2 很有用。在 Toolaze 上，當所選比例與模型設定支援時可使用 4K 輸出。', '高解析度在圖中包含產品細節、文字標籤、介面元素、材質或設計系統板時尤其重要。'], label: '含產品細節與乾淨版面的 GPT Image 2 4K 商用視覺' },
        { slot: 'feature-image-editing', title: '圖像生成與編輯', paragraphs: ['GPT Image 2 不只適合從零生成圖片，也適合參考圖編輯：從既有產品圖、室內照片、介面概念或視覺方向開始，要求模型修改特定部分。', '可用於更換背景、產品陳列、清理光線、季節活動變體、包裝 mockup、電商上架構想，以及前後對比概念。'], label: 'GPT Image 2 產品圖片編輯前後對比範例' },
        { slot: 'feature-ui-layouts', title: '結構化版面控制', paragraphs: ['當圖片需要可讀版面，而不只是藝術風格時，GPT Image 2 很適合。產品團隊可以用它草擬儀表板、App 畫面、落地頁首屏概念、功能圖解、資料看板、課堂說明圖與簡報用視覺系統。'], label: '含結構化卡片與標籤的 GPT Image 2 儀表板 UI mockup' },
        { slot: 'feature-commercial-output', title: '商用創意輸出', paragraphs: ['GPT Image 2 可協助行銷團隊在投入設計工時前探索多個活動方向。可測試產品海報、付費社群廣告、創作者縮圖、電商橫幅、功能發布視覺與季節活動概念。'], label: '含廣告創意變體的 GPT Image 2 活動看板' },
        { slot: 'feature-prompt-following', title: '提示詞遵循能力', paragraphs: ['當提示詞給出清楚任務時，GPT Image 2 表現最好。請描述素材類型、主體、受眾、版面、精確文字、視覺風格、光線、背景、輸出比例，以及哪些內容不應改變。若首次結果接近需求，請一次只調整提示詞的一個部分。'], label: '含視覺輸出範例的 GPT Image 2 提示詞指令板' },
      ],
    },
    gallery: {
      examples: [
        { slot: 'gallery-product-poster', title: '產品發布海報', text: '為瓶裝飲品、保養品、咖啡、零食包裝或軟體功能建立乾淨海報，包含可讀標題與清楚的產品主視覺。' },
        { slot: 'gallery-social-ad', title: '社群媒體廣告', text: '製作能吸引停留的社群廣告，包含短而醒目的文字、清楚產品賣點、適合創作者的構圖，以及安全的虛構人物或物件。' },
        { slot: 'gallery-ui-mockup', title: 'UI Mockup 概念', text: '生成 App 儀表板、分析面板、 onboarding 頁面或功能總覽圖片，帶有可讀標籤與結構化導覽。' },
        { slot: 'gallery-ecommerce', title: '電商產品圖片', text: '使用產品參考圖建立更乾淨的平台圖片、季節背景、生活方式場景或組合商品視覺。' },
        { slot: 'gallery-education', title: '教育資訊圖', text: '建立課堂視覺、科學圖解、歷史說明、流程圖或學習指南圖片，並加入清楚的區塊標籤。' },
        { slot: 'gallery-text-logo', title: '文字 Logo 概念', text: '探索早期 Logo 概念、徽章版面、活動標題、貼紙設計與包裝字標，使用短且可讀的文字。' },
        { slot: 'gallery-reference-edit', title: '參考圖引導編輯', text: '上傳參考圖片，要求 GPT Image 2 保留主體，同時更換背景、光線、風格或版面。' },
        { slot: 'gallery-high-resolution', title: '高解析活動視覺', text: '當需要 4K 輸出時，建立可用於海報、橫幅、產品發布與大型創意草稿的精緻活動圖片。' },
      ],
    },
    audiences: {
      items: [
        '行銷團隊：建立產品海報、付費社群概念、活動變體、發布視覺與縮圖構想，用於快速創意測試。',
        '設計師：在進入正式設計工具前，探索 moodboard、UI 畫面、版面系統、字體方向與視覺概念。',
        '電商賣家：為線上商店建立產品圖片變體、季節背景、商品頁視覺、組合商品圖片與促銷橫幅。',
        '內容創作者：製作縮圖、教育圖像、社群貼文、創作者經濟視覺與文字方向更清楚的品牌圖片。',
        '產品經理：草擬功能畫面、內部規劃板、App 概念與產品敘事視覺，用於早期驗證。',
        '教育者：建立圖解、課程視覺、概念圖、課堂說明與教學素材用的簡單資訊圖。',
      ],
    },
    comparison: {
      rows: [
        { capability: '最適合', gpt: '文字密集商用視覺、圖片編輯、UI mockup、結構化版面', nano: '快速圖像生成、參考圖編輯、Gemini 風格創意流程', midjourney: '風格化美術指導、電影感視覺、美感探索', flux: '寫實圖片、開放流程、多參考控制' },
        { capability: '文字渲染', gpt: '擅長短且可讀的文字、標籤、海報與 UI 風格視覺', nano: '在較新的 Gemini 圖像流程與文字密集設計中表現強', midjourney: '已有改善，但仍需仔細審核', flux: '在排版與版面導向場景中表現強' },
        { capability: '圖片編輯', gpt: '適合自然語言編輯與參考圖引導變更', nano: '適合快速迭代與圖生圖變體', midjourney: '有編輯流程，但對部分使用者不夠直接', flux: '擅長文字提示編輯與參考控制' },
        { capability: '版面控制', gpt: '擅長儀表板、海報、資訊圖與多面板概念', nano: '適合結構化生成與商用概念', midjourney: '較擅長視覺風格，不適合嚴格版面', flux: '擅長製作型視覺與可控構圖' },
        { capability: '4K 輸出', gpt: '支援高解析流程，當設定支援時包含 4K', nano: '目前圖像流程中具備高解析定位', midjourney: '高品質輸出，細節與材質表現強', flux: '在支援流程中有強細節與寫實輸出' },
        { capability: '限制', gpt: '需檢查拼字、小字、臉、手、品牌聲明與合規內容', nano: '需檢查模型可用性、風格是否匹配與參考一致性', midjourney: '當精確文字與嚴格版面是優先事項時較不理想', flux: '流程與存取方式會因平台和模型版本而異' },
      ],
      note: '當你需要可讀文字、結構化版面、產品視覺、圖片編輯或商用設計草稿時，優先使用 GPT Image 2。若主要目標是美術指導，可用 Midjourney；若重視開放流程與參考控制，可用 Flux；若想快速比較另一個圖像模型，可用 Nano Banana。',
    },
    prompts: {
      examples: [
        { id: 'multilingual-text', slot: 'prompt-multilingual-text', title: '多語言文字版面提示詞', prompt: '建立一張高級多語言編輯風海報，標題為「GLOBAL TYPE」。包含英文、西班牙文、法文、日文與阿拉伯文的可讀短文字區塊，使用乾淨網格、醒目標題字體、強烈色彩對比，並為每種語言保留足夠間距。所有文字保持簡短且方便審核。' },
        { id: 'print-layout', slot: 'prompt-print-layout', title: '印刷版面提示詞', prompt: '為一家名為「Tangerine Books」的虛構書店建立可印刷的 Art Deco 書籤概念。將書籤放在乾淨打樣紙上，顯示出血、裁切與安全邊界線。加入精確文字「TANGERINE BOOKS」與「READ WELL」，字體需清晰。' },
        { id: 'character-sheet', slot: 'prompt-character-sheet', title: '角色參考表提示詞', prompt: '為一位名叫「Adele」的原創冒險遊戲女主角建立一致的角色參考表。包含正面、側面、背面、三種表情、服裝細節、色票，以及一個道具特寫。所有面板都要保持同一角色身份一致。' },
        { id: 'storyboard', slot: 'prompt-storyboard', title: '連續分鏡提示詞', prompt: '建立一個名為「RAIN RUN」的六格分鏡。展示同一位快遞員穿越下雨的霓虹城市，送出一個發光包裹。從第 1 格到第 6 格保持角色、包裹、天氣與視覺風格一致。' },
        { id: 'reference-edit', slot: 'prompt-reference-edit', title: '參考圖室內編輯提示詞', prompt: '使用上傳的客廳照片作為參考。保留窗戶位置、牆面結構、沙發位置、地板與相機角度。只把室內風格改成溫暖 Japandi：木質紋理、柔和日光、中性色布料與鼠尾草綠點綴。' },
        { id: 'travel-brochure', slot: 'prompt-travel-brochure', title: '編輯風旅遊手冊提示詞', prompt: '為一個名為「Mist Ridge Lodge」的虛構山間度假地建立高級旅遊手冊跨頁。包含標題「Weekend Retreat」「Rooms」「Dining」「Trails」。使用優雅編輯攝影、可讀字體、沉穩奢華配色與精緻飯店版面。' },
      ],
    },
    youtube: {
      examples: [
        { title: 'ChatGPT Images 2.0 介紹', creator: 'OpenAI', href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI', videoId: 'sWkGomJ3TLI', text: '官方發布風格影片，可了解 OpenAI 如何呈現新的圖像工作流程與模型方向。' },
        { title: 'GPT Image 2 vs Nano Banana 2', creator: '創作者指南', href: 'https://www.youtube.com/watch?v=Yp4nRScy45c', videoId: 'Yp4nRScy45c', text: '實用比較影片，幫助使用者評估模型選擇、流程差異與真實圖片結果。' },
        { title: 'OpenAI Image 2：10 種用法', creator: '創作者測試', href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw', videoId: 'GY-kAiZGLOw', text: '以使用場景為核心的影片，探索單張圖庫圖片之外的實際應用。' },
      ],
    },
    reddit: {
      items: [
        { title: 'Image 2.0 一致性序列', text: '多圖 Reddit 討論串，測試 Image 2.0 是否能在不同角度與動作鏡頭中保持同一主體一致。' },
        { title: '提示詞壓力測試範例', text: '另一篇包含多個輸出測試的 Reddit 貼文，可比較細節、構圖與提示詞遵循表現。' },
        { title: '遊戲 Sprite 工作流程測試', text: 'Game-dev 討論展示 sprite sheet 輸出與動畫風媒體，與一致性和素材製作場景相關。' },
        { title: '日常輸出實驗', text: '獨立社群貼文，包含實用圖片範例與對 GPT-Image-2 日常使用感受的評論。' },
        { title: '瑕疵批評討論', text: '聚焦可見瑕疵的 Reddit 批評串，可讓頁面不只呈現優點，也保留真實失敗模式。' },
        { title: '自我審核迭代說法', text: '關於 GPT-Image-2 審查並迭代自身輸出的貼文，可作為品質控制與改進說法的參考。' },
        { title: '品質躍升討論', text: '圍繞感知品質提升的獨立討論，適合作為社群脈絡，而非官方模型文件。' },
        { title: '多範例品質討論串', text: '包含另一組公開範例的多圖討論串，避免該區塊依賴單一熱門貼文。' },
        { title: 'Image 2.0 驚艷範例', text: '另一篇含多個範例的獨立 Reddit 貼文，有助於觀察風格範圍與公開反應。' },
        { title: 'GPT Image 2 vs Nano Banana 2', text: '含多張並排對比圖的模型比較貼文，適合正在比較 GPT Image 2 與其他圖像模型的搜尋者。' },
      ],
    },
    x: {
      items: [
        { title: '完整 UI 設計系統板', body: '公開 GPT Image 2 範例，測試完整 UI 設計系統板、結構化標籤、元件卡片與介面版面控制。' },
        { title: '官方角色表重建', body: '有助於觀察角色一致性、姿勢拆解、服裝細節與角色參考表式構圖的 X 參考。' },
        { title: '密集中文文字版面測試', body: '非英文密集文字版面測試，可用來審查生成圖片中的排版、間距、層級與可讀文案。' },
        { title: '數學概念視覺化', body: '聚焦概念解釋、乾淨圖解結構與資訊圖式推理的公開教育視覺範例。' },
        { title: '多頁品牌套件', body: '商用品牌套件風格範例，用於觀察頁面一致性、身份呈現、版面系統與活動視覺方向。' },
        { title: '室內設計 Moodboard', body: '創作者範例，適合觀察室內 moodboard、材質色盤、房間概念與參考圖引導規劃。' },
        { title: '風格化角色海報', body: '聚焦精緻角色呈現、強美術方向與可投入製作的海報構圖公開範例。' },
        { title: '創作者提示詞合集', body: '可用於研究提示詞可控構圖、視覺層級與社群發布成品感的創作者圖片測試。' },
        { title: '棚拍產品提示詞', body: '公開靜態圖範例，可觀察產品式構圖、光線控制與提示詞驅動的商用呈現。' },
        { title: '電影感插畫測試', body: '公開 X 圖像範例，可檢查電影感風格、光線、主體細節與圖像模型表現範圍。' },
      ],
    },
    related: {
      links: [
        { title: 'GPT Image 2 提示詞模板', href: '/prompts/models/gpt-image-2', text: '先研究有來源支撐的提示詞結構，再回到 GPT Image 2 建立自己的圖像。' },
        { title: 'Nano Banana Pro 生成器', href: '/model/nano-banana-pro', text: '比較 Gemini 圖像工作流程，適用於高解析設計素材與文字密集版面。' },
        { title: 'Nano Banana 2 生成器', href: '/model/nano-banana-2', text: '探索另一個快速圖像生成與編輯模型，用於常見發布格式。' },
        { title: 'Nano Banana 圖生圖', href: '/model/nano-banana', text: '當參考圖引導編輯是主要需求時，可使用另一個圖生圖工作流程。' },
        { title: 'AI 模型中心', href: '/model', text: '當你需要更廣泛的模型比較時，瀏覽 Toolaze 的圖像與影片模型頁面。' },
      ],
    },
  },
  es: {
    features: {
      items: [
        { slot: 'feature-text-rendering', title: 'Renderizado de texto de alta precisión', paragraphs: ['El texto legible es una de las razones principales para usar GPT Image 2 en imágenes comerciales. Los equipos de marketing suelen necesitar titulares, etiquetas de producto, frases UI, títulos de eventos, stickers, etiquetas de gráficos o llamadas dentro de la imagen.', 'Mantén el texto breve, coloca las palabras exactas entre comillas y describe dónde debe aparecer. Antes de publicar, revisa ortografía, tono de marca, avisos legales y tipografía pequeña.'], label: 'Póster de producto de GPT Image 2 con titular y etiqueta legibles' },
        { slot: 'feature-4k-output', title: 'Salida de imagen 4K', paragraphs: ['GPT Image 2 es útil cuando el resultado necesita resolución suficiente para revisión, pruebas de layout, planificación de campañas y visuales web de alta calidad. En Toolaze, usa 4K cuando la proporción y los ajustes del modelo lo permitan.', 'La alta resolución importa especialmente cuando la imagen incluye detalles de producto, etiquetas de texto, elementos de interfaz, texturas o un tablero de sistema de diseño.'], label: 'Visual comercial 4K de GPT Image 2 con detalle de producto y layout limpio' },
        { slot: 'feature-image-editing', title: 'Generación y edición de imágenes', paragraphs: ['GPT Image 2 no sirve solo para crear desde cero. También funciona para edición guiada por referencia, partiendo de una imagen de producto, foto de interior, concepto de interfaz o dirección visual y pidiendo cambios concretos.', 'Úsalo para cambiar fondos, montar productos, limpiar iluminación, crear variaciones de campaña, mockups de empaque, ideas e-commerce y conceptos antes/después.'], label: 'Ejemplo antes y después de edición de producto con GPT Image 2' },
        { slot: 'feature-ui-layouts', title: 'Control de layouts estructurados', paragraphs: ['GPT Image 2 es útil cuando la imagen necesita una composición legible y no solo un estilo artístico. Los equipos de producto pueden bocetar dashboards, pantallas de app, héroes de landing, diagramas de funciones, tableros de datos, explicaciones educativas y sistemas visuales para presentaciones.'], label: 'Mockup UI de dashboard de GPT Image 2 con tarjetas y etiquetas' },
        { slot: 'feature-commercial-output', title: 'Creatividad comercial', paragraphs: ['GPT Image 2 ayuda a equipos de marketing a explorar varias direcciones antes de invertir tiempo de diseño. Prueba pósters de producto, anuncios paid social, thumbnails, banners e-commerce, visuales de lanzamiento y campañas estacionales.'], label: 'Tablero de campaña de GPT Image 2 con variaciones de anuncios' },
        { slot: 'feature-prompt-following', title: 'Seguimiento del prompt', paragraphs: ['GPT Image 2 responde mejor cuando el prompt define una tarea clara. Describe tipo de recurso, sujeto, audiencia, layout, texto exacto, estilo, luz, fondo, formato y qué no debe cambiar. Si el primer resultado está cerca, modifica una parte del prompt cada vez.'], label: 'Tablero de instrucciones para GPT Image 2 con ejemplos visuales' },
      ],
    },
    gallery: {
      examples: [
        { slot: 'gallery-product-poster', title: 'Cartel de lanzamiento de producto', text: 'Crea un póster limpio para una botella, cosmético, café, snack o función de software con titular legible y producto protagonista.' },
        { slot: 'gallery-social-ad', title: 'Anuncio para redes sociales', text: 'Construye un anuncio que detenga el scroll con texto breve en negrita, beneficio claro y composición apta para creadores.' },
        { slot: 'gallery-ui-mockup', title: 'Concepto de mockup UI', text: 'Genera dashboards, paneles de analítica, pantallas de onboarding o imágenes de overview con etiquetas legibles y navegación estructurada.' },
        { slot: 'gallery-ecommerce', title: 'Imagen de producto e-commerce', text: 'Usa una referencia de producto para crear imágenes de marketplace más limpias, fondos estacionales, escenas lifestyle o bundles.' },
        { slot: 'gallery-education', title: 'Infografía educativa', text: 'Crea visuales de clase, diagramas científicos, explicaciones históricas, procesos o guías de estudio con secciones claras.' },
        { slot: 'gallery-text-logo', title: 'Concepto de logo con texto', text: 'Explora logos tempranos, badges, títulos de eventos, stickers y wordmarks de empaque con texto corto y legible.' },
        { slot: 'gallery-reference-edit', title: 'Edición guiada por referencia', text: 'Sube una imagen de referencia y pide a GPT Image 2 conservar el sujeto principal mientras cambia fondo, luz, estilo o layout.' },
        { slot: 'gallery-high-resolution', title: 'Visual de campaña en alta resolución', text: 'Crea una imagen pulida para pósters, banners, lanzamientos y borradores creativos grandes cuando se necesita 4K.' },
      ],
    },
    audiences: {
      items: [
        'Equipos de marketing: crean pósters, conceptos paid social, variantes de campaña, visuales de lanzamiento e ideas de thumbnails para validar rápido.',
        'Diseñadores: exploran moodboards, pantallas UI, sistemas de layout, direcciones tipográficas y conceptos antes de pasar a herramientas de producción.',
        'Vendedores e-commerce: generan variaciones de producto, fondos estacionales, visuales de listing, bundles y banners para tiendas online.',
        'Creadores de contenido: producen thumbnails, gráficos educativos, posts sociales y visuales de marca con mejor dirección de texto.',
        'Product managers: bocetan pantallas de funciones, tableros internos, conceptos de app y storytelling visual para validación temprana.',
        'Educadores: crean diagramas, visuales de clase, mapas conceptuales, explicaciones e infografías simples para materiales didácticos.',
      ],
    },
    comparison: {
      rows: [
        { capability: 'Mejor para', gpt: 'Visuales comerciales con texto, edición de imagen, mockups UI y layouts estructurados', nano: 'Generación rápida, ediciones con referencia y flujos creativos estilo Gemini', midjourney: 'Dirección artística estilizada, visuales cinematográficos y exploración estética', flux: 'Imágenes fotorrealistas, flujos abiertos y control con múltiples referencias' },
        { capability: 'Renderizado de texto', gpt: 'Fuerte para texto breve legible, etiquetas, pósters y visuales tipo UI', nano: 'Fuerte en flujos Gemini recientes y diseños con mucho texto', midjourney: 'Ha mejorado, pero requiere revisión cuidadosa', flux: 'Fuerte en casos de tipografía y layout' },
        { capability: 'Edición de imagen', gpt: 'Útil para ediciones en lenguaje natural y cambios guiados por referencia', nano: 'Útil para iteración rápida y variaciones image-to-image', midjourney: 'Tiene flujos de edición, aunque menos directos para algunos usuarios', flux: 'Fuerte en edición por texto y control de referencia' },
        { capability: 'Control de layout', gpt: 'Fuerte para dashboards, pósters, infografías y conceptos multipanel', nano: 'Bueno para generación estructurada y conceptos comerciales', midjourney: 'Mejor para estilo visual que para layout estricto', flux: 'Fuerte para visuales de producción y composiciones controladas' },
        { capability: 'Salida 4K', gpt: 'Admite flujos de alta resolución, incluido 4K cuando los ajustes lo permiten', nano: 'Buen posicionamiento de alta resolución en flujos actuales', midjourney: 'Salida de alta calidad con detalle y textura', flux: 'Detalle fuerte y salida fotorrealista en flujos compatibles' },
        { capability: 'Limitaciones', gpt: 'Revisa ortografía, texto pequeño, rostros, manos, claims de marca y cumplimiento', nano: 'Revisa disponibilidad, encaje de estilo y consistencia de referencia', midjourney: 'Menos ideal cuando texto exacto y layout estricto son prioridad', flux: 'Acceso y flujo pueden variar por plataforma y versión' },
      ],
      note: 'Usa GPT Image 2 primero cuando necesites texto legible, layouts estructurados, visuales de producto, edición o borradores comerciales. Usa Midjourney si la dirección artística es lo principal, Flux si importan flujos abiertos y referencias, y Nano Banana para iterar y comparar rápido.',
    },
    prompts: {
      examples: [
        { id: 'multilingual-text', slot: 'prompt-multilingual-text', title: 'Prompt de layout de texto multilingüe', prompt: 'Crea un póster editorial premium titulado "GLOBAL TYPE". Incluye bloques de texto legibles en inglés, español, francés, japonés y árabe, con cuadrícula limpia, tipografía de titular fuerte, alto contraste y suficiente espacio para cada idioma. Mantén todos los textos breves y fáciles de revisar.' },
        { id: 'print-layout', slot: 'prompt-print-layout', title: 'Prompt de layout impreso', prompt: 'Crea un concepto de separador Art Deco listo para impresión para una librería ficticia llamada "Tangerine Books". Muéstralo en una hoja de prueba limpia con guías visibles de sangrado, corte y margen seguro. Incluye exactamente "TANGERINE BOOKS" y "READ WELL" con letras nítidas.' },
        { id: 'character-sheet', slot: 'prompt-character-sheet', title: 'Prompt de hoja de personaje', prompt: 'Crea una hoja de referencia coherente para una heroína original de juego de aventuras llamada "Adele". Muestra vista frontal, lateral, trasera, tres expresiones, detalles del atuendo, paleta de color y un primer plano de un accesorio. Mantén la identidad consistente en todos los paneles.' },
        { id: 'storyboard', slot: 'prompt-storyboard', title: 'Prompt de storyboard secuencial', prompt: 'Crea un storyboard de seis paneles titulado "RAIN RUN". Muestra al mismo repartidor atravesando una ciudad neón lluviosa mientras entrega un paquete brillante. Mantén personaje, paquete, clima y estilo consistentes del Panel 1 al Panel 6.' },
        { id: 'reference-edit', slot: 'prompt-reference-edit', title: 'Prompt de edición interior con referencia', prompt: 'Usa la foto de sala subida como referencia. Conserva ventanas, estructura de pared, posición del sofá, suelo y ángulo de cámara. Cambia solo el estilo interior a Japandi cálido con texturas de madera, luz suave, telas neutras y acentos verde salvia.' },
        { id: 'travel-brochure', slot: 'prompt-travel-brochure', title: 'Prompt de folleto editorial', prompt: 'Crea una doble página de folleto de viaje premium para un retiro de montaña ficticio llamado "Mist Ridge Lodge". Incluye los títulos "Weekend Retreat", "Rooms", "Dining" y "Trails". Usa fotografía editorial elegante, tipografía legible, colores de lujo serenos y layout hotelero pulido.' },
      ],
    },
    youtube: {
      examples: [
        { title: 'Presentación de ChatGPT Images 2.0', creator: 'OpenAI', href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI', videoId: 'sWkGomJ3TLI', text: 'Referencia oficial de lanzamiento para entender cómo OpenAI presenta el nuevo flujo de imágenes y la dirección del modelo.' },
        { title: 'GPT Image 2 vs Nano Banana 2', creator: 'Guía de creador', href: 'https://www.youtube.com/watch?v=Yp4nRScy45c', videoId: 'Yp4nRScy45c', text: 'Comparación práctica para evaluar elección de modelo, diferencias de flujo y resultados reales.' },
        { title: 'OpenAI Image 2: 10 formas de usarlo', creator: 'Prueba de creador', href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw', videoId: 'GY-kAiZGLOw', text: 'Vídeo centrado en casos de uso que explora aplicaciones prácticas más allá de una sola imagen de galería.' },
      ],
    },
    reddit: {
      items: [
        { title: 'Secuencia de consistencia de Image 2.0', text: 'Thread con varias imágenes que prueba si Image 2.0 mantiene el mismo sujeto entre ángulos y escenas de acción.' },
        { title: 'Ejemplos de stress test de prompts', text: 'Post distinto con varias pruebas de salida para comparar detalle, composición y seguimiento del prompt.' },
        { title: 'Prueba de flujo para sprites de juego', text: 'Discusión game-dev con sprite sheet y medios tipo animación, relevante para consistencia y producción de assets.' },
        { title: 'Experimentación casual de resultados', text: 'Post comunitario separado con ejemplos prácticos y comentarios sobre cómo se siente GPT-Image-2 en uso cotidiano.' },
        { title: 'Discusión crítica de artefactos', text: 'Thread de crítica sobre artefactos visibles, útil para equilibrar la página con modos de fallo reales.' },
        { title: 'Afirmación de autoevaluación iterativa', text: 'Post sobre GPT-Image-2 revisando e iterando su propia salida, útil como contexto de control de calidad.' },
        { title: 'Discusión sobre salto de calidad', text: 'Discusión centrada en mejoras percibidas de calidad, como contexto comunitario y no documentación oficial.' },
        { title: 'Thread de calidad con múltiples ejemplos', text: 'Thread multiimagen con otros ejemplos públicos para evitar depender de una sola publicación viral.' },
        { title: 'Ejemplos wow de Image 2.0', text: 'Otro post independiente con varios ejemplos, útil para juzgar rango de estilos y reacción pública.' },
        { title: 'GPT Image 2 vs Nano Banana 2', text: 'Post comparativo con varias imágenes lado a lado, relevante para usuarios que comparan modelos.' },
      ],
    },
    x: {
      items: [
        { title: 'Tablero completo de sistema UI', body: 'Ejemplo público de GPT Image 2 que prueba un sistema UI completo con etiquetas, tarjetas de componentes y control de layout.' },
        { title: 'Reconstrucción de hoja oficial de personaje', body: 'Referencia útil para consistencia de personaje, poses, detalles de vestuario y composición tipo hoja de referencia.' },
        { title: 'Prueba de layout con texto chino denso', body: 'Prueba de texto no inglés denso para revisar tipografía, espaciado, jerarquía y legibilidad dentro de imágenes generadas.' },
        { title: 'Visualización de concepto matemático', body: 'Ejemplo educativo público centrado en explicación de conceptos, estructura limpia de diagrama y razonamiento tipo infografía.' },
        { title: 'Brand kit multipágina', body: 'Ejemplo comercial de brand kit para consistencia de páginas, identidad, sistemas de layout y dirección de campaña.' },
        { title: 'Moodboard de diseño interior', body: 'Ejemplo de creador para moodboards interiores, paletas de materiales, conceptos de sala y planificación con referencia.' },
        { title: 'Póster de personaje estilizado', body: 'Ejemplo público centrado en presentación pulida de personaje, dirección artística fuerte y composición de póster.' },
        { title: 'Colección de prompts de creador', body: 'Prueba visual útil para estudiar composición controlable por prompt, jerarquía visual y salida lista para redes.' },
        { title: 'Prompt de producto en estudio', body: 'Ejemplo público de imagen fija para composición de producto, control de luz y presentación comercial.' },
        { title: 'Prueba de ilustración cinematográfica', body: 'Ejemplo público en X para revisar estilo cinematográfico, luz, detalle del sujeto y rango del modelo.' },
      ],
    },
    related: {
      links: [
        { title: 'Plantillas de prompts para GPT Image 2', href: '/prompts/models/gpt-image-2', text: 'Estudia estructuras de prompt respaldadas por fuentes y vuelve a GPT Image 2 para crear tu imagen.' },
        { title: 'Generador Nano Banana Pro', href: '/model/nano-banana-pro', text: 'Compara un flujo Gemini para assets de alta resolución y layouts con mucho texto.' },
        { title: 'Generador Nano Banana 2', href: '/model/nano-banana-2', text: 'Explora otro modelo rápido de generación y edición para formatos de publicación comunes.' },
        { title: 'Nano Banana Image to Image', href: '/model/nano-banana', text: 'Usa otro flujo image-to-image cuando la edición con referencia sea la prioridad.' },
        { title: 'Hub de modelos de IA', href: '/model', text: 'Explora páginas de modelos de imagen y vídeo en Toolaze cuando necesites comparar más modelos.' },
      ],
    },
  },
  ja: {
    features: {
      items: [
        { slot: 'feature-text-rendering', title: '高精度なテキスト描画', paragraphs: ['商用画像でGPT Image 2を使う大きな理由の一つがテキスト描画です。マーケティングでは、画像内に読みやすい見出し、商品ラベル、UI文言、イベント名、ステッカー、図表ラベル、注釈が必要になることがあります。', 'テキストは短くし、正確な文言を引用符で囲み、表示位置を指定してください。公開前には、スペル、ブランド表現、法的表記、小さな文字を必ず確認します。'], label: '読みやすい見出しとパッケージラベルを含むGPT Image 2の商品ポスター' },
        { slot: 'feature-4k-output', title: '4K画像出力', paragraphs: ['GPT Image 2は、レビュー、レイアウト検証、キャンペーン計画、高品質なWebビジュアルに十分な解像度が必要なときに役立ちます。Toolazeでは、選択した比率とモデル設定が対応する場合に4K出力を使用します。', '高解像度は、商品ディテール、文字ラベル、UI要素、質感、デザインシステムボードを含む画像で特に重要です。'], label: '商品ディテールと整理されたレイアウトを含むGPT Image 2の4K商用ビジュアル' },
        { slot: 'feature-image-editing', title: '画像生成と編集', paragraphs: ['GPT Image 2はゼロから画像を作るだけではありません。既存の商品画像、部屋写真、UIコンセプト、ビジュアル方向性を起点に、特定部分だけを変更する参照ベース編集にも向いています。', '背景差し替え、商品演出、照明調整、季節キャンペーン案、パッケージモックアップ、EC掲載案、ビフォーアフター案に使えます。'], label: 'GPT Image 2による商品画像編集のビフォーアフター例' },
        { slot: 'feature-ui-layouts', title: '構造化レイアウトの制御', paragraphs: ['GPT Image 2は、純粋なアート表現より読みやすいレイアウトが必要な画像に有用です。プロダクトチームは、ダッシュボード、アプリ画面、LPヒーロー案、機能図、データボード、授業用説明画像、プレゼン向けビジュアルシステムを試作できます。'], label: 'カードとラベルが整理されたGPT Image 2のダッシュボードUIモックアップ' },
        { slot: 'feature-commercial-output', title: '商用クリエイティブ出力', paragraphs: ['GPT Image 2は、デザイン工数を確定する前に複数のキャンペーン方向を試したいマーケティングチームに役立ちます。商品ポスター、広告案、サムネイル、ECバナー、機能ローンチ画像、季節キャンペーン案を検討できます。'], label: '広告クリエイティブ案を並べたGPT Image 2のキャンペーンボード' },
        { slot: 'feature-prompt-following', title: 'プロンプト追従', paragraphs: ['GPT Image 2は、プロンプトが明確な仕事を与えるほど扱いやすくなります。アセット種別、主題、対象ユーザー、レイアウト、正確なテキスト、スタイル、光、背景、比率、変更しない要素を指定します。最初の結果が近い場合は、一度に一箇所だけ修正します。'], label: 'GPT Image 2のプロンプト指示ボードと出力例' },
      ],
    },
    gallery: {
      examples: [
        { slot: 'gallery-product-poster', title: '商品ローンチポスター', text: 'ボトル、スキンケア、コーヒー、スナック、ソフトウェア機能などを、読みやすい見出しと明確な商品ヒーローで見せるポスターを作成します。' },
        { slot: 'gallery-social-ad', title: 'SNS広告', text: '短い太字テキスト、明確な商品メリット、クリエイター向け構図、安全な架空人物や物体を使ったスクロールを止める広告を作ります。' },
        { slot: 'gallery-ui-mockup', title: 'UIモックアップ案', text: 'アプリダッシュボード、分析パネル、オンボーディング、機能紹介画像を、読みやすいラベルと構造化ナビゲーション付きで生成します。' },
        { slot: 'gallery-ecommerce', title: 'EC商品画像', text: '商品参照画像を使い、より清潔なマーケットプレイス画像、季節背景、ライフスタイル構図、セット商品ビジュアルを作ります。' },
        { slot: 'gallery-education', title: '教育インフォグラフィック', text: '授業用画像、科学図解、歴史説明、プロセスチャート、学習ガイドを、明確なセクションラベル付きで作成します。' },
        { slot: 'gallery-text-logo', title: 'テキストロゴ案', text: '初期ロゴ案、バッジレイアウト、イベントタイトル、ステッカーデザイン、パッケージ用ワードマークを短い読みやすい文字で検討します。' },
        { slot: 'gallery-reference-edit', title: '参照画像ベースの編集', text: '参照画像をアップロードし、主題を保ったまま背景、光、スタイル、レイアウトを変更します。' },
        { slot: 'gallery-high-resolution', title: '高解像度キャンペーンビジュアル', text: '4K出力が必要なポスター、バナー、商品ローンチ、大型クリエイティブ案向けの仕上がったキャンペーン画像を作成します。' },
      ],
    },
    audiences: {
      items: [
        'マーケティングチーム: 商品ポスター、広告案、キャンペーンバリエーション、ローンチ画像、サムネイル案を素早く検証できます。',
        'デザイナー: 制作ツールに入る前に、ムードボード、UI画面、レイアウトシステム、タイポグラフィ方向、ビジュアル案を探索できます。',
        'EC販売者: 商品画像バリエーション、季節背景、掲載画像、セット商品画像、オンラインストア用バナーを作れます。',
        'コンテンツクリエイター: サムネイル、教育グラフィック、SNS投稿、クリエイター向けビジュアル、ブランド画像をより明確な文字指示で作成できます。',
        'プロダクトマネージャー: 機能画面、社内計画ボード、アプリ案、プロダクトストーリー用ビジュアルを初期検証できます。',
        '教育者: 図解、授業用画像、概念マップ、説明ビジュアル、教材用の簡単なインフォグラフィックを作れます。',
      ],
    },
    comparison: {
      rows: [
        { capability: '最適な用途', gpt: '文字の多い商用ビジュアル、画像編集、UIモックアップ、構造化レイアウト', nano: '高速画像生成、参照編集、Gemini系クリエイティブワークフロー', midjourney: '様式化されたアートディレクション、映画的ビジュアル、美的探索', flux: 'フォトリアル画像、オープンなワークフロー、複数参照の制御' },
        { capability: 'テキスト描画', gpt: '短い読みやすい文字、ラベル、ポスター、UI風ビジュアルに強い', nano: '新しいGemini画像ワークフローや文字量の多いデザインに強い', midjourney: '改善しているが慎重な確認が必要', flux: 'タイポグラフィやレイアウト重視の用途に強い' },
        { capability: '画像編集', gpt: '自然言語編集と参照ベースの変更に有用', nano: '高速反復と画像to画像バリエーションに有用', midjourney: '編集ワークフローはあるが、一部ユーザーには直接的でない場合がある', flux: 'テキスト指示の編集と参照制御に強い' },
        { capability: 'レイアウト制御', gpt: 'ダッシュボード、ポスター、インフォグラフィック、複数パネル案に強い', nano: '構造化生成と商用コンセプトに向く', midjourney: '厳密なレイアウトより視覚スタイルに強い', flux: '制作向けビジュアルと制御された構図に強い' },
        { capability: '4K出力', gpt: '設定が対応する場合、4Kを含む高解像度ワークフローをサポート', nano: '現行画像ワークフローで高解像度を強く打ち出している', midjourney: '細部と質感に強い高品質出力', flux: '対応ワークフローで細部とフォトリアル表現に強い' },
        { capability: '注意点', gpt: 'スペル、小さな文字、顔、手、ブランド表現、コンプライアンスを確認', nano: 'モデル提供状況、スタイル適合、参照一貫性を確認', midjourney: '正確な文字と厳密なレイアウトが最優先のときは不向きな場合がある', flux: 'ワークフローと利用条件はプラットフォームやモデル版で変わる' },
      ],
      note: '読みやすい文字、構造化レイアウト、商品ビジュアル、画像編集、商用デザイン案が必要なら、まずGPT Image 2を使います。主目的がアートディレクションならMidjourney、オープンなワークフローや参照制御が重要ならFlux、別の高速画像モデルで比較したいならNano Bananaが候補です。',
    },
    prompts: {
      examples: [
        { id: 'multilingual-text', slot: 'prompt-multilingual-text', title: '多言語テキストレイアウトプロンプト', prompt: '「GLOBAL TYPE」というタイトルの上質な多言語エディトリアルポスターを作成してください。英語、スペイン語、フランス語、日本語、アラビア語の読みやすい短いテキストブロックを入れ、整ったグリッド、太い見出し、強い色コントラスト、各言語に十分な余白を持たせてください。' },
        { id: 'print-layout', slot: 'prompt-print-layout', title: '印刷レイアウトプロンプト', prompt: '架空の書店「Tangerine Books」のために、印刷向けのアールデコ調しおり案を作成してください。しおりを清潔な校正シート上に置き、塗り足し、裁ち落とし、安全マージンのガイド線を見せてください。正確な文字「TANGERINE BOOKS」と「READ WELL」を鮮明に入れてください。' },
        { id: 'character-sheet', slot: 'prompt-character-sheet', title: 'キャラクター参照シートプロンプト', prompt: 'オリジナルの冒険ゲームヒロイン「Adele」の一貫したキャラクター参照シートを作成してください。正面、側面、背面、3つの表情、衣装ディテール、カラーパレット、小道具のクローズアップを含め、全パネルで同じ人物に見えるようにしてください。' },
        { id: 'storyboard', slot: 'prompt-storyboard', title: '連続ストーリーボードプロンプト', prompt: '「RAIN RUN」というタイトルの6コマストーリーボードを作成してください。同じ配達員が雨のネオン都市を走り、光る荷物を届ける場面を描きます。1コマ目から6コマ目まで、人物、荷物、天気、視覚スタイルを一貫させてください。' },
        { id: 'reference-edit', slot: 'prompt-reference-edit', title: '参照ベースのインテリア編集プロンプト', prompt: 'アップロードしたリビング写真を参照にしてください。窓の位置、壁構造、ソファ位置、床、カメラ角度は維持します。変更するのは内装スタイルだけで、木の質感、柔らかな日光、ニュートラルな布地、セージグリーンのアクセントを持つ温かいJapandiスタイルにしてください。' },
        { id: 'travel-brochure', slot: 'prompt-travel-brochure', title: 'エディトリアル冊子プロンプト', prompt: '架空の山岳リトリート「Mist Ridge Lodge」の高級旅行パンフレット見開きを作成してください。見出し「Weekend Retreat」「Rooms」「Dining」「Trails」を含め、上品なエディトリアル写真、読みやすい文字、落ち着いた高級感のある色、洗練されたホテル向けレイアウトにしてください。' },
      ],
    },
    youtube: {
      examples: [
        { title: 'ChatGPT Images 2.0の紹介', creator: 'OpenAI', href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI', videoId: 'sWkGomJ3TLI', text: 'OpenAIが新しい画像ワークフローとモデルの方向性をどう見せているかを理解するための公式ローンチ系動画です。' },
        { title: 'GPT Image 2 vs Nano Banana 2', creator: 'クリエイターガイド', href: 'https://www.youtube.com/watch?v=Yp4nRScy45c', videoId: 'Yp4nRScy45c', text: 'モデル選択、ワークフローの違い、実際の画像結果を比較するための実用的な動画です。' },
        { title: 'OpenAI Image 2の10の使い方', creator: 'クリエイターテスト', href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw', videoId: 'GY-kAiZGLOw', text: '単一のギャラリー画像を超えた実用用途を探るユースケース中心の動画です。' },
      ],
    },
    reddit: {
      items: [
        { title: 'Image 2.0の一貫性シーケンス', text: 'Image 2.0が同じ被写体を角度やアクションショットを変えても保てるかを試す、複数画像のRedditスレッドです。' },
        { title: 'プロンプト負荷テスト例', text: '複数の出力テストを含む別のReddit投稿で、ディテール、構図、プロンプト追従を比較するのに役立ちます。' },
        { title: 'ゲームスプライトワークフローテスト', text: 'スプライトシート出力とアニメーション風メディアを示すゲーム開発系の議論で、一貫性と素材制作に関連します。' },
        { title: '日常的な出力実験', text: 'GPT-Image-2が日常の実験でどう感じられるかを、実用的な画像例とコメントで確認できる別投稿です。' },
        { title: 'アーティファクト批評の議論', text: '目に見えるアーティファクトに焦点を当てたReddit批評スレッドで、良い点だけでなく失敗例も把握できます。' },
        { title: '自己レビュー反復の話題', text: 'GPT-Image-2が自身の出力を見直し反復するという投稿で、品質管理や改善の文脈として参考になります。' },
        { title: '品質向上に関する議論', text: '体感される品質向上を中心にした別の議論で、公式情報ではなくコミュニティ文脈として使えます。' },
        { title: '複数例の品質スレッド', text: '別の公開例を複数含むスレッドで、1つの話題投稿に依存しないための参考になります。' },
        { title: 'Image 2.0の驚きの作例', text: '複数の例を含む別の独立したReddit投稿で、スタイルの幅と反応を見るのに役立ちます。' },
        { title: 'GPT Image 2 vs Nano Banana 2', text: '複数の比較画像を含むモデル比較投稿で、他の画像モデルと比較したい検索ユーザーに関連します。' },
      ],
    },
    x: {
      items: [
        { title: '完全なUIデザインシステムボード', body: 'ラベル、コンポーネントカード、インターフェースレイアウト制御を含む、GPT Image 2の公開UIデザインシステム例です。' },
        { title: '公式キャラクターシート再構成', body: 'キャラクター一貫性、ポーズ分解、衣装ディテール、参照シート風構成を確認できるXの参考例です。' },
        { title: '中国語の高密度テキストレイアウトテスト', body: '生成画像内のタイポグラフィ、間隔、階層、読みやすいコピーを確認する非英語テキストの高密度テストです。' },
        { title: '数学概念の可視化', body: '概念説明、整った図解構造、インフォグラフィック的な reasoning に焦点を当てた教育向け公開例です。' },
        { title: '複数ページのブランドキット', body: 'ページ一貫性、アイデンティティ表現、レイアウトシステム、キャンペーン向け方向性を見る商用ブランドキット例です。' },
        { title: 'インテリアデザインのムードボード', body: 'インテリアのムードボード、素材パレット、部屋コンセプト、参照ベースの視覚計画に使える作例です。' },
        { title: 'スタイライズされたキャラクターポスター', body: '洗練されたキャラクター表現、強いアートディレクション、制作向けポスター構図に焦点を当てた公開画像例です。' },
        { title: 'クリエイターのプロンプト集', body: 'プロンプトで制御できる構図、視覚階層、SNS向けの完成度を学ぶためのクリエイター画像テストです。' },
        { title: 'スタジオ商品プロンプト', body: '商品風構図、照明制御、プロンプト主導の商用プレゼンテーションを確認できる公開静止画例です。' },
        { title: '映画的イラストテスト', body: '映画的なスタイル、光、被写体の細部、静止画でのモデル表現範囲を確認するXの公開画像例です。' },
      ],
    },
    related: {
      links: [
        { title: 'GPT Image 2プロンプトテンプレート', href: '/prompts/models/gpt-image-2', text: '根拠のあるプロンプト構造を学び、GPT Image 2に戻って自分の画像を作成します。' },
        { title: 'Nano Banana Proジェネレーター', href: '/model/nano-banana-pro', text: '高解像度デザイン素材や文字量の多いレイアウト向けにGemini画像ワークフローを比較します。' },
        { title: 'Nano Banana 2ジェネレーター', href: '/model/nano-banana-2', text: '一般的な公開フォーマット向けの別の高速画像生成・編集モデルを試します。' },
        { title: 'Nano Banana画像to画像', href: '/model/nano-banana', text: '参照ベース編集が主目的のときに、別の画像to画像ワークフローを使います。' },
        { title: 'AIモデルハブ', href: '/model', text: 'より広いモデル比較が必要なときに、Toolazeの画像・動画モデルページを閲覧します。' },
      ],
    },
  },
  it: {
    features: {
      items: [
        { slot: 'feature-text-rendering', title: 'Rendering del testo ad alta precisione', paragraphs: ['Il testo leggibile è uno dei motivi principali per usare GPT Image 2 nelle immagini commerciali. I team marketing spesso hanno bisogno di headline, etichette prodotto, frasi UI, titoli evento, sticker, label di grafici o callout dentro l’immagine.', 'Mantieni il testo breve, inserisci le parole esatte tra virgolette e descrivi dove devono comparire. Prima di pubblicare, controlla ortografia, wording di marca, note legali e microtipografia.'], label: 'Poster prodotto GPT Image 2 con headline ed etichetta leggibili' },
        { slot: 'feature-4k-output', title: 'Output immagine 4K', paragraphs: ['GPT Image 2 è utile quando l’output richiede risoluzione sufficiente per review, test di layout, pianificazione campagna e visual web di qualità. Su Toolaze usa 4K quando rapporto e impostazioni modello lo supportano.', 'L’alta risoluzione conta soprattutto con dettagli prodotto, label testuali, elementi UI, texture o board di design system.'], label: 'Visual commerciale 4K GPT Image 2 con dettaglio prodotto e layout pulito' },
        { slot: 'feature-image-editing', title: 'Generazione e modifica immagini', paragraphs: ['GPT Image 2 non serve solo a creare da zero. Funziona bene anche per editing guidato da riferimento, partendo da foto prodotto, foto interni, concept UI o direzione visuale e chiedendo modifiche specifiche.', 'Usalo per cambio sfondo, staging prodotto, pulizia luci, varianti stagionali, mockup packaging, idee e-commerce e concept prima/dopo.'], label: 'Esempio prima e dopo di editing prodotto con GPT Image 2' },
        { slot: 'feature-ui-layouts', title: 'Controllo di layout strutturati', paragraphs: ['GPT Image 2 è utile quando l’immagine richiede un layout leggibile, non solo uno stile artistico. I team prodotto possono abbozzare dashboard, schermate app, hero di landing, diagrammi, data board, visual didattici e sistemi per presentazioni.'], label: 'Mockup UI dashboard GPT Image 2 con card e label' },
        { slot: 'feature-commercial-output', title: 'Output creativo commerciale', paragraphs: ['GPT Image 2 aiuta i team marketing a esplorare più direzioni prima di impegnare tempo design. Testa poster prodotto, paid social ads, thumbnail, banner e-commerce, visual di lancio e campagne stagionali.'], label: 'Board campagna GPT Image 2 con varianti adv' },
        { slot: 'feature-prompt-following', title: 'Aderenza al prompt', paragraphs: ['GPT Image 2 risponde meglio quando il prompt assegna un compito chiaro. Descrivi tipo di asset, soggetto, pubblico, layout, testo esatto, stile, luce, sfondo, formato e cosa non deve cambiare. Se il primo risultato è vicino, modifica una parte alla volta.'], label: 'Board istruzioni GPT Image 2 con esempi visuali' },
      ],
    },
    gallery: {
      examples: [
        { slot: 'gallery-product-poster', title: 'Poster di lancio prodotto', text: 'Crea un poster pulito per bottiglia, skincare, caffè, snack o feature software con headline leggibile e prodotto protagonista.' },
        { slot: 'gallery-social-ad', title: 'Annuncio social media', text: 'Crea un annuncio che ferma lo scroll con testo breve, beneficio chiaro e composizione adatta ai creator.' },
        { slot: 'gallery-ui-mockup', title: 'Concept mockup UI', text: 'Genera dashboard, pannelli analytics, onboarding o overview feature con label leggibili e navigazione strutturata.' },
        { slot: 'gallery-ecommerce', title: 'Immagine prodotto e-commerce', text: 'Usa una reference prodotto per creare immagini marketplace più pulite, sfondi stagionali, scene lifestyle o bundle visual.' },
        { slot: 'gallery-education', title: 'Infografica educativa', text: 'Crea visual per lezioni, diagrammi scientifici, spiegazioni storiche, process chart o guide studio con sezioni chiare.' },
        { slot: 'gallery-text-logo', title: 'Concept logo testuale', text: 'Esplora idee logo iniziali, badge, titoli evento, sticker e wordmark packaging con testo breve e leggibile.' },
        { slot: 'gallery-reference-edit', title: 'Editing guidato da riferimento', text: 'Carica una reference e chiedi a GPT Image 2 di preservare il soggetto cambiando sfondo, luce, stile o layout.' },
        { slot: 'gallery-high-resolution', title: 'Visual campagna ad alta risoluzione', text: 'Crea un’immagine rifinita per poster, banner, lanci prodotto e grandi bozze creative quando serve 4K.' },
      ],
    },
    audiences: {
      items: [
        'Marketing team: creano poster prodotto, concept paid social, varianti campagna, visual di lancio e idee thumbnail per test rapidi.',
        'Designer: esplorano moodboard, schermate UI, sistemi layout, direzioni tipografiche e concept prima della produzione.',
        'Seller e-commerce: creano varianti prodotto, sfondi stagionali, visual listing, bundle e banner promozionali.',
        'Content creator: producono thumbnail, grafiche educative, post social e immagini brand con direzione testuale più chiara.',
        'Product manager: abbozzano schermate feature, board interni, concept app e storytelling visuale per validazione iniziale.',
        'Educatori: creano diagrammi, visual di lezione, mappe concettuali, spiegazioni e infografiche semplici.',
      ],
    },
    comparison: {
      rows: [
        { capability: 'Ideale per', gpt: 'Visual commerciali ricchi di testo, editing immagini, mockup UI e layout strutturati', nano: 'Generazione rapida, editing con reference e workflow creativi stile Gemini', midjourney: 'Art direction stilizzata, visual cinematografici ed esplorazione estetica', flux: 'Immagini fotorealistiche, workflow aperti e controllo multi-reference' },
        { capability: 'Rendering testo', gpt: 'Forte per testo breve leggibile, label, poster e visual tipo UI', nano: 'Forte nei workflow Gemini recenti e design ricchi di testo', midjourney: 'Migliorato, ma richiede review accurata', flux: 'Forte in tipografia e layout' },
        { capability: 'Editing immagine', gpt: 'Utile per modifiche in linguaggio naturale e cambi guidati da reference', nano: 'Utile per iterazioni rapide e varianti image-to-image', midjourney: 'Editor disponibile ma meno diretto per alcuni utenti', flux: 'Forte per editing da testo e controllo reference' },
        { capability: 'Controllo layout', gpt: 'Forte per dashboard, poster, infografiche e concept multipanel', nano: 'Buono per generazione strutturata e concept commerciali', midjourney: 'Meglio per stile visuale che layout rigido', flux: 'Forte per visual produttivi e composizioni controllate' },
        { capability: 'Output 4K', gpt: 'Supporta alta risoluzione, incluso 4K quando le impostazioni lo permettono', nano: 'Forte posizionamento high-resolution nei workflow attuali', midjourney: 'Output di qualità con dettaglio e texture', flux: 'Dettaglio forte e output fotorealistico nei workflow supportati' },
        { capability: 'Limiti', gpt: 'Controlla ortografia, testo piccolo, volti, mani, claim brand e compliance', nano: 'Controlla disponibilità modello, fit stilistico e coerenza reference', midjourney: 'Meno ideale quando testo esatto e layout rigido sono prioritari', flux: 'Workflow e accesso variano per piattaforma e versione' },
      ],
      note: 'Usa GPT Image 2 prima quando servono testo leggibile, layout strutturati, visual prodotto, editing o bozze commerciali. Usa Midjourney per art direction, Flux per workflow aperti e reference control, Nano Banana per iterare e confrontare rapidamente.',
    },
    prompts: {
      examples: [
        { id: 'multilingual-text', slot: 'prompt-multilingual-text', title: 'Prompt layout testo multilingue', prompt: 'Crea un poster editoriale premium intitolato "GLOBAL TYPE". Includi blocchi brevi e leggibili in inglese, spagnolo, francese, giapponese e arabo, con griglia pulita, tipografia headline forte, alto contrasto e spazio sufficiente per ogni lingua.' },
        { id: 'print-layout', slot: 'prompt-print-layout', title: 'Prompt layout di stampa', prompt: 'Crea un segnalibro Art Deco pronto per la stampa per una libreria fittizia chiamata "Tangerine Books". Mostralo su un proof sheet pulito con linee di abbondanza, taglio e margine sicuro visibili. Includi esattamente "TANGERINE BOOKS" e "READ WELL".' },
        { id: 'character-sheet', slot: 'prompt-character-sheet', title: 'Prompt scheda personaggio', prompt: 'Crea una scheda reference coerente per un’eroina originale di adventure game chiamata "Adele". Mostra fronte, lato, retro, tre espressioni, dettagli outfit, palette colore e close-up di un prop, mantenendo identità coerente.' },
        { id: 'storyboard', slot: 'prompt-storyboard', title: 'Prompt storyboard sequenziale', prompt: 'Crea uno storyboard di sei pannelli intitolato "RAIN RUN". Mostra lo stesso corriere che attraversa una città neon sotto la pioggia con un pacco luminoso. Mantieni personaggio, pacco, meteo e stile coerenti.' },
        { id: 'reference-edit', slot: 'prompt-reference-edit', title: 'Prompt interior edit con reference', prompt: 'Usa la foto del soggiorno caricata come reference. Mantieni finestre, struttura pareti, posizione divano, pavimento e angolo camera. Cambia solo lo stile in Japandi caldo con legno, luce morbida, tessuti neutri e accenti verde salvia.' },
        { id: 'travel-brochure', slot: 'prompt-travel-brochure', title: 'Prompt brochure editoriale', prompt: 'Crea una doppia pagina brochure premium per un retreat montano fittizio chiamato "Mist Ridge Lodge". Includi "Weekend Retreat", "Rooms", "Dining" e "Trails", con fotografia editoriale elegante, testo leggibile e layout hospitality rifinito.' },
      ],
    },
    youtube: {
      examples: [
        { title: 'Presentazione di ChatGPT Images 2.0', creator: 'OpenAI', href: 'https://www.youtube.com/watch?v=sWkGomJ3TLI', videoId: 'sWkGomJ3TLI', text: 'Riferimento ufficiale per capire come OpenAI presenta il nuovo workflow immagini e la direzione del modello.' },
        { title: 'GPT Image 2 vs Nano Banana 2', creator: 'Guida creator', href: 'https://www.youtube.com/watch?v=Yp4nRScy45c', videoId: 'Yp4nRScy45c', text: 'Confronto pratico per valutare scelta del modello, differenze di workflow e risultati reali.' },
        { title: 'OpenAI Image 2: 10 modi per usarlo', creator: 'Test creator', href: 'https://www.youtube.com/watch?v=GY-kAiZGLOw', videoId: 'GY-kAiZGLOw', text: 'Video orientato ai casi d’uso che esplora applicazioni pratiche oltre una singola immagine gallery.' },
      ],
    },
    reddit: {
      items: [
        { title: 'Sequenza di coerenza Image 2.0', text: 'Thread multi-immagine che testa se Image 2.0 mantiene lo stesso soggetto tra angoli e scene action.' },
        { title: 'Esempi di stress test prompt', text: 'Post con diversi test output per confrontare dettaglio, composizione e aderenza al prompt.' },
        { title: 'Test workflow sprite game', text: 'Discussione game-dev con sprite sheet e media tipo animazione, rilevante per coerenza e produzione asset.' },
        { title: 'Sperimentazione casuale output', text: 'Post community con esempi pratici e commenti su come GPT-Image-2 si comporta nell’uso quotidiano.' },
        { title: 'Discussione critica sugli artefatti', text: 'Thread critico su artefatti visibili, utile per mostrare anche limiti reali.' },
        { title: 'Claim di auto-review iterativa', text: 'Post su GPT-Image-2 che rivede e itera il proprio output, utile per contesto qualità.' },
        { title: 'Discussione sul salto di qualità', text: 'Discussione sui miglioramenti percepiti, come contesto community.' },
        { title: 'Thread qualità con esempi multipli', text: 'Thread multi-immagine con altri esempi pubblici.' },
        { title: 'Esempi wow di Image 2.0', text: 'Post indipendente con più esempi per valutare range stilistico e reazione pubblica.' },
        { title: 'GPT Image 2 vs Nano Banana 2', text: 'Post comparativo con immagini side-by-side, rilevante per chi confronta modelli.' },
      ],
    },
    x: {
      items: [
        { title: 'Board completo di design system UI', body: 'Esempio pubblico che testa un sistema UI completo con label, card componenti e controllo layout.' },
        { title: 'Ricostruzione scheda personaggio ufficiale', body: 'Reference utile per coerenza personaggio, pose, outfit e composizione tipo scheda.' },
        { title: 'Test layout con testo cinese denso', body: 'Test non inglese per rivedere tipografia, spaziatura, gerarchia e leggibilità.' },
        { title: 'Visualizzazione concetto matematico', body: 'Esempio educativo focalizzato su spiegazione, struttura diagramma pulita e ragionamento visuale.' },
        { title: 'Brand kit multipagina', body: 'Esempio commerciale per coerenza pagine, identità, sistemi layout e direzione campagna.' },
        { title: 'Moodboard interior design', body: 'Esempio per moodboard interni, palette materiali, concept stanza e pianificazione con reference.' },
        { title: 'Poster personaggio stilizzato', body: 'Esempio focalizzato su presentazione personaggio, art direction forte e composizione poster.' },
        { title: 'Collezione prompt creator', body: 'Test utile per studiare composizione da prompt, gerarchia visuale e output social-ready.' },
        { title: 'Prompt prodotto in studio', body: 'Still pubblico per composizione prodotto, controllo luce e presentazione commerciale.' },
        { title: 'Test illustrazione cinematografica', body: 'Esempio per verificare stile cinematografico, luce, dettaglio soggetto e range del modello.' },
      ],
    },
    related: {
      links: [
        { title: 'Template prompt GPT Image 2', href: '/prompts/models/gpt-image-2', text: 'Studia strutture di prompt con fonti, poi torna a GPT Image 2 per creare la tua immagine.' },
        { title: 'Generatore Nano Banana Pro', href: '/model/nano-banana-pro', text: 'Confronta un workflow Gemini per asset high-resolution e layout ricchi di testo.' },
        { title: 'Generatore Nano Banana 2', href: '/model/nano-banana-2', text: 'Esplora un altro modello rapido per generazione e editing immagini.' },
        { title: 'Nano Banana Image to Image', href: '/model/nano-banana', text: 'Usa un altro workflow image-to-image quando l’editing con reference è prioritario.' },
        { title: 'Hub modelli AI', href: '/model', text: 'Sfoglia le pagine Toolaze di modelli immagine e video per confronti più ampi.' },
      ],
    },
  },
}

export function getGptImage2LandingCopy(locale: string): GptImage2LandingCopy {
  const normalizedLocale = normalizeLocale(locale)
  if (normalizedLocale === 'en') return englishCopy

  return mergeCopy(mergeCopy(englishCopy, localizedOverrides[normalizedLocale]), localizedArrayOverrides[normalizedLocale])
}

export function getGptImage2PageMetadata(locale: string, canonicalUrl = 'https://toolaze.com/model/gpt-image-2'): Metadata {
  const copy = getGptImage2LandingCopy(locale)

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
